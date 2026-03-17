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
    let entities;
    if (query) {
      entities = await this.repository.search(query);
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
