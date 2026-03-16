/**
 * Data structure for creating a new Bookmark.
 * @typedef {Object} BookmarkData
 * @property {string} [id] - The unique identifier for the bookmark.
 * @property {string} name - The display title of the bookmark.
 * @property {string} [description] - A brief summary or notes about the bookmarked page.
 * @property {string} url - The absolute URL of the bookmarked page.
 * @property {string[]} [tags] - A list of topics or categories associated with the bookmark.
 */

/**
 * Represents a Bookmark entity in the domain.
 * This class encapsulates the data and basic validation for a bookmark.
 */
export class Bookmark {
  /**
   * Creates an instance of a Bookmark.
   * @param {BookmarkData} data - The initial data for the bookmark.
   * @throws {Error} If the URL is missing.
   */
  constructor({ id, name, description, url, tags }) {
    if (!url) {
      throw new Error('URL is required');
    }
    
    this.id = id || `webpage/${crypto.randomUUID()}`;
    this.name = name || 'Untitled';
    this.description = description || '';
    this.url = url;
    this.tags = tags || [];
  }
}
