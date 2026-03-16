import { Bookmark } from '../entities/Bookmark.js';

/**
 * Use case for adding a new bookmark to the repository.
 * This encapsulates the business logic of creating and persisting a bookmark.
 */
export class AddBookmarkUseCase {
  /**
   * Initializes the use case with a repository.
   * @param {import('../repositories/BookmarkRepository.js').BookmarkRepository} repository - The repository to persist bookmarks.
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Executes the use case to add a new bookmark.
   * @param {import('../entities/Bookmark.js').BookmarkData} data - The data for the new bookmark.
   * @returns {Promise<Bookmark>} Resolves to the newly created Bookmark entity.
   */
  async execute(data) {
    const bookmark = new Bookmark(data);
    await this.repository.add(bookmark);
    return bookmark;
  }
}
