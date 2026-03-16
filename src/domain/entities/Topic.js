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
 * Aligned with schema.org/Thing as seen in example-data.jsonld.
 */
export class Topic {
  /**
   * Creates an instance of a Topic.
   * @param {TopicData} data - The initial data for the topic.
   */
  constructor({ id, name, description, subjectOf }) {
    this['@type'] = 'Thing';
    this['@id'] = id || `topic/${crypto.randomUUID()}`;
    this.name = name || 'Untitled Topic';
    this.description = description || '';
    this.subjectOf = subjectOf || [];
  }

  /**
   * Getter for the ID to simplify access while maintaining JSON-LD compatibility.
   * @returns {string}
   */
  get id() {
    return this['@id'];
  }
}
