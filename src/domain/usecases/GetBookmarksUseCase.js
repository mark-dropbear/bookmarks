import { Bookmark } from '../entities/Bookmark.js';

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
   * @returns {Promise<Bookmark[]>} Resolves to an array of bookmarks.
   * @throws {import('../../core/errors/AppErrors.js').RepositoryError} If storage retrieval fails.
   */
  async execute(query) {
    let data;
    if (query) {
      data = await this.repository.search(query);
    } else {
      data = await this.repository.getAll();
    }
    
    return data.map(json => Bookmark.fromJSON(json));
  }
}
