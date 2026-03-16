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
   * @returns {Promise<import('../entities/Bookmark.js').Bookmark[]>} Resolves to an array of bookmarks.
   */
  async execute(query) {
    if (query) {
      return await this.repository.search(query);
    }
    return await this.repository.getAll();
  }
}
