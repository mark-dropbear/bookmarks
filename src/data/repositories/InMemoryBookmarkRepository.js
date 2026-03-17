import { NotFoundError } from '../../core/errors/AppErrors.js';

/**
 * In-memory implementation of the BookmarkRepository.
 * Stores and retrieves plain objects representing bookmarks.
 * @implements {import('../../domain/repositories/BookmarkRepository.js').BookmarkRepository}
 */
export class InMemoryBookmarkRepository {
  /**
   * Initializes a new instance of the InMemoryBookmarkRepository.
   */
  constructor() {
    /** 
     * The internal collection of bookmarks stored in memory.
     * @type {Object[]} 
     */
    this.bookmarks = [];
  }

  /**
   * Adds or updates a bookmark in the in-memory collection.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark - The bookmark entity to save.
   * @returns {Promise<void>} Resolves when the bookmark is successfully added.
   */
  async add(bookmark) {
    // Store as plain object for easier search and consistent serialization
    const data = bookmark.toJSON();
    const index = this.bookmarks.findIndex(b => b['@id'] === data['@id']);
    if (index !== -1) {
      this.bookmarks[index] = data;
    } else {
      this.bookmarks.push(data);
    }
  }

  /**
   * Retrieves all currently stored bookmarks as plain data objects.
   * @returns {Promise<Object[]>} Resolves to a copy of the bookmark array.
   */
  async getAll() {
    return [...this.bookmarks];
  }

  /**
   * Retrieves a bookmark by its unique identifier.
   * @param {string} id - The unique identifier for the bookmark.
   * @returns {Promise<Object>} A promise that resolves to the bookmark data.
   * @throws {NotFoundError} If the bookmark is not found.
   */
  async getById(id) {
    const bookmark = this.bookmarks.find(b => b['@id'] === id);
    if (!bookmark) {
      throw new NotFoundError(`Bookmark with id ${id} not found`, { details: { id } });
    }
    return bookmark;
  }

  /**
   * Updates an existing bookmark in the in-memory collection.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark - The bookmark entity to update.
   * @returns {Promise<void>} Resolves when the bookmark is successfully updated.
   * @throws {NotFoundError} If the bookmark is not found.
   */
  async update(bookmark) {
    const data = bookmark.toJSON();
    const index = this.bookmarks.findIndex(b => b['@id'] === data['@id']);
    if (index === -1) {
      throw new NotFoundError(`Bookmark with id ${data['@id']} not found`);
    }
    this.bookmarks[index] = data;
  }

  /**
   * Deletes a bookmark from the in-memory collection.
   * @param {string} id - The unique identifier for the bookmark to delete.
   * @returns {Promise<void>} Resolves when the bookmark is successfully deleted.
   * @throws {NotFoundError} If the bookmark is not found.
   */
  async delete(id) {
    const index = this.bookmarks.findIndex(b => b['@id'] === id);
    if (index === -1) {
      throw new NotFoundError(`Bookmark with id ${id} not found`);
    }
    this.bookmarks.splice(index, 1);
  }

  /**
   * Searches the in-memory collection for bookmarks matching the provided query.
   * Case-insensitive matching across name, url, description, and related topic names.
   * @param {string} query - The search term to match.
   * @returns {Promise<Object[]>} Resolves to a filtered array of bookmark data.
   */
  async search(query) {
    const lowQuery = query.toLowerCase();
    return this.bookmarks.filter(b => 
      b.name.toLowerCase().includes(lowQuery) ||
      b.url.toLowerCase().includes(lowQuery) ||
      b.description.toLowerCase().includes(lowQuery) ||
      b.about.some(t => t.name && t.name.toLowerCase().includes(lowQuery))
    );
  }
}
