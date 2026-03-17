import { NotFoundError } from '../../core/errors/AppErrors.js';
import { TopicPersistenceMapper } from '../../core/mappers/TopicPersistenceMapper.js';

/**
 * In-memory implementation of the TopicRepository.
 * Stores persistence data objects and returns pure Domain Entities.
 * @implements {import('../../domain/repositories/TopicRepository.js').TopicRepository}
 */
export class InMemoryTopicRepository {
  /**
   * Initializes a new instance of the InMemoryTopicRepository.
   */
  constructor() {
    /** 
     * The internal collection of topics stored as persistence objects.
     * @type {Object[]} 
     */
    this.topics = [];
  }

  /**
   * Adds or updates a topic in the in-memory collection.
   * @param {import('../../domain/entities/Topic.js').Topic} topic 
   * @returns {Promise<void>} 
   */
  async add(topic) {
    const data = TopicPersistenceMapper.toPersistence(topic);
    const index = this.topics.findIndex(t => t.id === data.id);
    if (index !== -1) {
      this.topics[index] = data;
    } else {
      this.topics.push(data);
    }
  }

  /**
   * Retrieves all currently stored topics.
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic[]>} 
   */
  async getAll() {
    return this.topics.map(t => TopicPersistenceMapper.toEntity(t));
  }

  /**
   * Gets a specific topic by its unique identifier.
   * @param {string} id 
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic>} 
   * @throws {NotFoundError} If the topic is not found.
   */
  async getById(id) {
    const data = this.topics.find(t => t.id === id);
    if (!data) {
      throw new NotFoundError(`Topic with id ${id} not found`, { details: { id } });
    }
    return TopicPersistenceMapper.toEntity(data);
  }

  /**
   * Gets a specific topic by its name.
   * @param {string} name 
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic>} 
   * @throws {NotFoundError} If the topic is not found.
   */
  async getByName(name) {
    const data = this.topics.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (!data) {
      throw new NotFoundError(`Topic with name ${name} not found`, { details: { name } });
    }
    return TopicPersistenceMapper.toEntity(data);
  }

  /**
   * Deletes a topic from the in-memory collection.
   * @param {string} id 
   * @returns {Promise<void>} 
   * @throws {NotFoundError} If the topic is not found.
   */
  async delete(id) {
    const index = this.topics.findIndex(t => t.id === id);
    if (index === -1) {
      throw new NotFoundError(`Topic with id ${id} not found`);
    }
    this.topics.splice(index, 1);
  }
}
