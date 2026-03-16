import { NotFoundError } from '../../core/errors/AppErrors.js';

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
   * @returns {Promise<Object>} Resolves to the topic data.
   * @throws {NotFoundError} If the topic is not found.
   */
  async getById(id) {
    const topic = this.topics.find(t => t['@id'] === id);
    if (!topic) {
      throw new NotFoundError(`Topic with id ${id} not found`, { details: { id } });
    }
    return topic;
  }

  /**
   * Deletes a topic from the in-memory collection.
   * @param {string} id - The @id of the topic to delete.
   * @returns {Promise<void>} Resolves when the topic is successfully deleted.
   * @throws {NotFoundError} If the topic is not found.
   */
  async delete(id) {
    const index = this.topics.findIndex(t => t['@id'] === id);
    if (index === -1) {
      throw new NotFoundError(`Topic with id ${id} not found`);
    }
    this.topics.splice(index, 1);
  }
}
