/**
 * @typedef {Object} TopicReference
 * @property {string} @id - The unique identifier of the topic.
 */

/**
 * Data structure for creating a new Bookmark, following schema.org WebPage.
 * @typedef {Object} BookmarkData
 * @property {string} [id] - The unique identifier (@id) for the webpage.
 * @property {string} name - The title of the webpage.
 * @property {string} [description] - A brief summary of the webpage.
 * @property {string} url - The absolute URL of the webpage.
 * @property {TopicReference[]} [about] - Topics this webpage is about.
 */

/**
 * Represents a Bookmark (WebPage) entity in the domain.
 * Aligned with schema.org/WebPage as seen in example-data.jsonld.
 */
export class Bookmark {
  /**
   * Creates an instance of a Bookmark.
   * @param {BookmarkData} data - The initial data for the bookmark.
   * @throws {Error} If the URL is missing.
   */
  constructor({ id, name, description, url, about }) {
    if (!url) {
      throw new Error('URL is required');
    }
    
    this['@type'] = 'WebPage';
    this['@id'] = id || `webpage/${crypto.randomUUID()}`;
    this.name = name || 'Untitled';
    this.description = description || '';
    this.url = url;
    this.about = about || [];
  }

  /**
   * Getter for the ID to simplify access while maintaining JSON-LD compatibility.
   * @returns {string}
   */
  get id() {
    return this['@id'];
  }
}
