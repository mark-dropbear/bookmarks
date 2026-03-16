/**
 * @typedef {Object} BookmarkData
 * @property {string} [id]
 * @property {string} name
 * @property {string} [description]
 * @property {string} url
 * @property {string[]} [tags]
 */

export class Bookmark {
  /**
   * @param {BookmarkData} data
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
