/**
 * In-memory implementation of the TopicRepository.
 */
export class InMemoryTopicRepository {
  constructor() {
    /** @type {Object[]} */
    this.topics = [];
  }

  /**
   * Adds or updates a topic.
   * @param {import('../../domain/entities/Topic.js').Topic} topic
   * @returns {Promise<void>}
   */
  async add(topic) {
    const data = topic.toJSON();
    const index = this.topics.findIndex(t => t['@id'] === data['@id']);
    if (index !== -1) {
      this.topics[index] = data;
    } else {
      this.topics.push(data);
    }
  }

  /**
   * Returns all topics.
   * @returns {Promise<Object[]>}
   */
  async getAll() {
    return [...this.topics];
  }

  /**
   * Gets a specific topic by its ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    return this.topics.find(t => t['@id'] === id) || null;
  }
}
