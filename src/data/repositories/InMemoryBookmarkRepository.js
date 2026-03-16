/**
 * In-memory implementation of the BookmarkRepository.
 */
export class InMemoryBookmarkRepository {
  constructor() {
    /** @type {Object[]} */
    this.bookmarks = [];
  }

  /**
   * Adds a new bookmark.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark
   * @returns {Promise<void>}
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
   * Retrieves all currently stored bookmarks.
   * @returns {Promise<Object[]>}
   */
  async getAll() {
    return [...this.bookmarks];
  }

  /**
   * Searches bookmarks.
   * @param {string} query
   * @returns {Promise<Object[]>}
   */
  async search(query) {
    const lowQuery = query.toLowerCase();
    return this.bookmarks.filter(b => 
      b.name.toLowerCase().includes(lowQuery) ||
      b.url.toLowerCase().includes(lowQuery) ||
      b.description.toLowerCase().includes(lowQuery) ||
      b.about.some(t => t['@id'].toLowerCase().includes(lowQuery))
    );
  }
}
