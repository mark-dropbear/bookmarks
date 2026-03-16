/**
 * @implements {BookmarkRepository}
 */
export class InMemoryBookmarkRepository {
  constructor() {
    /** @type {import('../../domain/entities/Bookmark.js').Bookmark[]} */
    this.bookmarks = [];
  }

  /**
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark
   * @returns {Promise<void>}
   */
  async add(bookmark) {
    this.bookmarks.push(bookmark);
  }

  /**
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>}
   */
  async getAll() {
    return [...this.bookmarks];
  }

  /**
   * @param {string} query
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>}
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
