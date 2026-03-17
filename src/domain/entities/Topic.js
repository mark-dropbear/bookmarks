import { ResourceId } from '../values/ResourceId.js';

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
   * @param {import('../types/index.js').TopicData} data - The initial data for the topic.
   */
  constructor({ id, name, description, subjectOf }) {
    this.#id = id || ResourceId.generate('topic').toString();
    this.#name = name || 'Untitled Topic';
    this.#description = description || '';
    this.#subjectOf = subjectOf || [];
  }

  /**
   * Factory method to create a Topic from a plain JSON object.
   * Handles mapping schema.org fields if necessary.
   * @param {import('../types/index.js').TopicData} json 
   * @returns {Topic}
   */
  static fromJSON(json) {
    return new Topic({
      id: json['@id'] || json.id,
      name: json.name,
      description: json.description,
      subjectOf: json.subjectOf
    });
  }

  /**
   * Gets the unique identifier for the topic.
   * @returns {string} 
   */
  id() { return this.#id; }

  /**
   * Gets the name of the topic.
   * @returns {string} 
   */
  name() { return this.#name; }

  /**
   * Gets the description of the topic.
   * @returns {string} 
   */
  description() { return this.#description; }

  /**
   * Gets the list of bookmarks associated with this topic.
   * @returns {import('../types/index.js').BookmarkReference[]} 
   */
  subjectOf() { return [...this.#subjectOf]; }

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
   * Unlinks a bookmark from this topic.
   * @param {string} bookmarkId 
   */
  removeBookmark(bookmarkId) {
    this.#subjectOf = this.#subjectOf.filter(b => b['@id'] !== bookmarkId);
  }

  /**
   * Serializes the entity to a schema.org compliant JSON-LD object.
   * @returns {import('../types/index.js').TopicData & { '@type': string }}
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
