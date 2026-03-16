/**
 * In-memory implementation of the BookmarkRepository.
 * This class provides volatile storage for bookmarks, useful for development, testing, and 
 * initial core implementation without a persistent database dependency.
 * @implements {import('../../domain/repositories/BookmarkRepository.js').BookmarkRepository}
 */
export class InMemoryBookmarkRepository {
  /**
   * Initializes a new instance of the in-memory repository.
   */
  constructor() {
    /** 
     * The internal collection of bookmarks stored in memory.
     * @type {import('../../domain/entities/Bookmark.js').Bookmark[]} 
     */
    this.bookmarks = [];
  }

  /**
   * Adds a new bookmark to the in-memory collection.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark - The bookmark entity to add.
   * @returns {Promise<void>} Resolves when the bookmark is successfully added.
   */
  async add(bookmark) {
    this.bookmarks.push(bookmark);
  }

  /**
   * Retrieves all currently stored bookmarks.
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>} Resolves to a copy of the bookmark array.
   */
  async getAll() {
    return [...this.bookmarks];
  }

  /**
   * Searches the in-memory collection for bookmarks matching the provided query.
   * Case-insensitive matching across name, url, description, and tags.
   * @param {string} query - The search term to match.
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>} Resolves to a filtered array of bookmarks.
   */
  async search(query) {
    const lowQuery = query.toLowerCase();
    return this.bookmarks.filter(b => 
      b.name.toLowerCase().includes(lowQuery) ||
      b.url.toLowerCase().includes(lowQuery) ||
      b.description.toLowerCase().includes(lowQuery) ||
      b.tags.some(t => t.toLowerCase().includes(lowQuery))
    );
  }
}
