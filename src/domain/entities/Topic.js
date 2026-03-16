/**
 * @typedef {Object} BookmarkReference
 * @property {string} @id - The unique identifier of the bookmark.
 */

/**
 * Data structure for creating a new Topic, following schema.org Thing.
 * @typedef {Object} TopicData
 * @property {string} [id] - The unique identifier (@id) for the topic.
 * @property {string} name - The name of the topic.
 * @property {string} [description] - A brief summary of the topic.
 * @property {BookmarkReference[]} [subjectOf] - Webpages that are about this topic.
 */

/**
 * Represents a Topic (Thing) entity in the domain.
 * Uses private fields for encapsulation and toJSON for schema.org compatibility.
 */
export class Topic {
  #id;
  #name;
  #description;
  #subjectOf;

  /**
   * Creates an instance of a Topic.
   * @param {TopicData} data - The initial data for the topic.
   */
  constructor({ id, name, description, subjectOf }) {
    this.#id = id || `topic/${crypto.randomUUID()}`;
    this.#name = name || 'Untitled Topic';
    this.#description = description || '';
    this.#subjectOf = subjectOf || [];
  }

  /** @returns {string} */
  get id() { return this.#id; }

  /** @returns {string} */
  get name() { return this.#name; }

  /** @returns {string} */
  get description() { return this.#description; }

  /** @returns {BookmarkReference[]} */
  get subjectOf() { return [...this.#subjectOf]; }

  /**
   * Links a bookmark to this topic.
   * @param {string} bookmarkId 
   */
  addBookmark(bookmarkId) {
    if (!this.#subjectOf.some(b => b['@id'] === bookmarkId)) {
      this.#subjectOf.push({ '@id': bookmarkId });
    }
  }

  /**
   * Serializes the entity to a schema.org compliant JSON-LD object.
   * @returns {Object}
   */
  toJSON() {
    return {
      '@type': 'Thing',
      '@id': this.#id,
      'name': this.#name,
      'description': this.#description,
      'subjectOf': this.#subjectOf
    };
  }
}
