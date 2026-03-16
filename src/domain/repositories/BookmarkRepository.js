/**
 * Interface for bookmark storage and retrieval operations.
 * This defines the contract that any data storage adapter must implement.
 * @interface BookmarkRepository
 */
export class BookmarkRepository {
  /**
   * Persists a new bookmark or updates an existing one.
   * @param {import('../entities/Bookmark.js').Bookmark} bookmark - The bookmark entity to save.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} If the operation is not implemented by the subclass.
   */
  async add(bookmark) {
    throw new Error('Not implemented');
  }

  /**
   * Retrieves all bookmarks from the repository.
   * @returns {Promise<import('../entities/Bookmark.js').Bookmark[]>} A promise that resolves to an array of bookmarks.
   * @throws {Error} If the operation is not implemented by the subclass.
   */
  async getAll() {
    throw new Error('Not implemented');
  }

  /**
   * Retrieves a bookmark by its unique identifier.
   * @param {string} id - The unique identifier for the bookmark.
   * @returns {Promise<import('../entities/Bookmark.js').Bookmark>} A promise that resolves to the bookmark entity.
   * @throws {Error} If the operation is not implemented by the subclass.
   */
  async getById(id) {
    throw new Error('Not implemented');
  }

  /**
   * Updates an existing bookmark.
   * @param {import('../entities/Bookmark.js').Bookmark} bookmark - The bookmark entity to update.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} If the operation is not implemented by the subclass.
   */
  async update(bookmark) {
    throw new Error('Not implemented');
  }

  /**
   * Deletes a bookmark by its unique identifier.
   * @param {string} id - The unique identifier for the bookmark.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} If the operation is not implemented by the subclass.
   */
  async delete(id) {
    throw new Error('Not implemented');
  }

  /**
   * Searches for bookmarks matching the provided query.
   * Searches across name, URL, description, and tags.
   * @param {string} query - The search string to match against.
   * @returns {Promise<import('../entities/Bookmark.js').Bookmark[]>} A promise that resolves to an array of matching bookmarks.
   * @throws {Error} If the operation is not implemented by the subclass.
   */
  async search(query) {
    throw new Error('Not implemented');
  }
}
