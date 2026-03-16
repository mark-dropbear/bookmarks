/**
 * In-memory implementation of the TopicRepository.
 * Stores and retrieves plain objects representing topics.
 * @implements {import('../../domain/repositories/TopicRepository.js').TopicRepository}
 */
export class InMemoryTopicRepository {
  /**
   * Initializes a new instance of the InMemoryTopicRepository.
   */
  constructor() {
    /** 
     * The internal collection of topics stored in memory.
     * @type {Object[]} 
     */
    this.topics = [];
  }

  /**
   * Adds or updates a topic in the in-memory collection.
   * @param {import('../../domain/entities/Topic.js').Topic} topic - The topic entity to save.
   * @returns {Promise<void>} Resolves when the topic is successfully added.
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
   * Retrieves all currently stored topics as plain data objects.
   * @returns {Promise<Object[]>} Resolves to a copy of the topic array.
   */
  async getAll() {
    return [...this.topics];
  }

  /**
   * Gets a specific topic by its unique identifier.
   * @param {string} id - The @id of the topic to retrieve.
   * @returns {Promise<Object|null>} Resolves to the topic data or null if not found.
   */
  async getById(id) {
    return this.topics.find(t => t['@id'] === id) || null;
  }
}
