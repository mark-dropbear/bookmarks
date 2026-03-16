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
 * Uses private fields for encapsulation and toJSON for schema.org compatibility.
 */
export class Bookmark {
  #id;
  #name;
  #description;
  #url;
  #about;

  /**
   * Creates an instance of a Bookmark.
   * @param {BookmarkData} data - The initial data for the bookmark.
   * @throws {Error} If the URL is missing.
   */
  constructor({ id, name, description, url, about }) {
    if (!url) {
      throw new Error('URL is required');
    }
    
    this.#id = id || `webpage/${crypto.randomUUID()}`;
    this.#name = name || 'Untitled';
    this.#description = description || '';
    this.#url = url;
    this.#about = about || [];
  }

  /** @returns {string} */
  get id() { return this.#id; }

  /** @returns {string} */
  get name() { return this.#name; }

  /** @returns {string} */
  get description() { return this.#description; }

  /** @returns {string} */
  get url() { return this.#url; }

  /** @returns {TopicReference[]} */
  get about() { return [...this.#about]; }

  /**
   * Adds a topic reference to the bookmark.
   * @param {string} topicId 
   */
  addTopic(topicId) {
    if (!this.#about.some(t => t['@id'] === topicId)) {
      this.#about.push({ '@id': topicId });
    }
  }

  /**
   * Serializes the entity to a schema.org compliant JSON-LD object.
   * @returns {Object}
   */
  toJSON() {
    return {
      '@type': 'WebPage',
      '@id': this.#id,
      'name': this.#name,
      'description': this.#description,
      'url': this.#url,
      'about': this.#about
    };
  }
}
