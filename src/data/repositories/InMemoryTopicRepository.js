/**
 * In-memory implementation of the TopicRepository.
 * @implements {import('../../domain/repositories/TopicRepository.js').TopicRepository}
 */
export class InMemoryTopicRepository {
  constructor() {
    /** @type {import('../../domain/entities/Topic.js').Topic[]} */
    this.topics = [];
  }

  /**
   * Adds a topic to the in-memory store.
   * @param {import('../../domain/entities/Topic.js').Topic} topic
   * @returns {Promise<void>}
   */
  async add(topic) {
    this.topics.push(topic);
  }

  /**
   * Returns all topics.
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic[]>}
   */
  async getAll() {
    return [...this.topics];
  }

  /**
   * Gets a specific topic by its ID.
   * @param {string} id
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic|null>}
   */
  async getById(id) {
    return this.topics.find(t => t['@id'] === id) || null;
  }
}
