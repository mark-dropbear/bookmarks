/**
 * Use case for retrieving bookmarks from the repository.
 * Supports retrieving all bookmarks or searching them by query.
 */
export class GetBookmarksUseCase {
  /**
   * Initializes the use case with a repository.
   * @param {import('../repositories/BookmarkRepository.js').BookmarkRepository} repository - The repository to query.
   */
  constructor(repository) {
    this.repository = repository;
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
    
    return entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      url: entity.url,
      image: entity.image,
      topicIds: [...entity.topicIds]
    }));
  }
}
