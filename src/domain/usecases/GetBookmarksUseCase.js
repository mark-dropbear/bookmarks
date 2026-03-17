/**
 * Use case for retrieving bookmarks from the repository.
 * Supports retrieving all bookmarks or searching them by query.
 */
export class GetBookmarksUseCase {
  /**
   * Initializes the use case with a repository.
   * @param {import('../repositories/BookmarkRepository.js').BookmarkRepository} repository - The repository to query.
   * @param {import('../repositories/TopicRepository.js').TopicRepository} topicRepository - The topic repository to resolve names.
   */
  constructor(repository, topicRepository) {
    this.repository = repository;
    this.topicRepository = topicRepository;
  }

  /**
   * Executes the use case to fetch bookmarks.
   * @param {string} [query] - Optional search query to filter bookmarks.
   * @returns {Promise<import('../types/index.js').BookmarkDTO[]>} Resolves to an array of bookmark DTOs.
   */
  async execute(query) {
    let entities = [];
    
    if (query) {
      // 1. Search bookmarks directly (name, url, description)
      const directMatches = await this.repository.search(query);
      
      // 2. Search topics by name to find associated bookmarks
      const allTopics = await this.topicRepository.getAll();
      const matchingTopicIds = allTopics
        .filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
        .map(t => t.id);
        
      // 3. Get all bookmarks and filter by the matching topic IDs
      let topicMatches = [];
      if (matchingTopicIds.length > 0) {
        const allBookmarks = await this.repository.getAll();
        topicMatches = allBookmarks.filter(b => b.topicIds.some(id => matchingTopicIds.includes(id)));
      }
      
      // 4. Merge and deduplicate
      const combined = [...directMatches, ...topicMatches];
      const uniqueIds = new Set();
      for (const entity of combined) {
        if (!uniqueIds.has(entity.id)) {
          uniqueIds.add(entity.id);
          entities.push(entity);
        }
      }
    } else {
      entities = await this.repository.getAll();
    }
    
    const dtos = [];
    for (const entity of entities) {
      const topicNames = [];
      for (const tid of entity.topicIds) {
        try {
          const topic = await this.topicRepository.getById(tid);
          topicNames.push(topic.name);
        } catch (_e) {
          // Ignore if topic not found
        }
      }
      
      dtos.push({
        id: entity.id,
        name: entity.name,
        description: entity.description,
        url: entity.url,
        image: entity.image,
        topicIds: [...entity.topicIds],
        topicNames
      });
    }
    
    return dtos;
  }
}
