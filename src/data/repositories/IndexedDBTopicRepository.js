import { NotFoundError } from '../../core/errors/AppErrors.js';
import { TopicPersistenceMapper } from '../../core/mappers/TopicPersistenceMapper.js';

/**
 * IndexedDB implementation of the TopicRepository.
 * Handles persistence of topics using the browser's IndexedDB API via 'idb' library.
 * @implements {import('../../domain/repositories/TopicRepository.js').TopicRepository}
 */
export class IndexedDBTopicRepository {
  /** @type {import('idb').IDBPDatabase<any>} */
  #db;
  #storeName = 'topics';

  /**
   * @param {import('idb').IDBPDatabase<any>} db - The IndexedDB database instance.
   */
  constructor(db) {
    this.#db = db;
  }

  /**
   * Adds or updates a topic in the database.
   * @param {import('../../domain/entities/Topic.js').Topic} topic 
   * @returns {Promise<void>}
   */
  async add(topic) {
    const data = TopicPersistenceMapper.toPersistence(topic);
    await this.#db.put(this.#storeName, data);
  }

  /**
   * Retrieves all topics.
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic[]>}
   */
  async getAll() {
    const all = await this.#db.getAll(this.#storeName);
    return all.map(t => TopicPersistenceMapper.toEntity(t));
  }

  /**
   * Retrieves a topic by its unique identifier.
   * @param {string} id 
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic>}
   */
  async getById(id) {
    const data = await this.#db.get(this.#storeName, id);
    if (!data) {
      throw new NotFoundError(`Topic with id ${id} not found`, { details: { id } });
    }
    return TopicPersistenceMapper.toEntity(data);
  }

  /**
   * Retrieves a topic by its name.
   * @param {string} name 
   * @returns {Promise<import('../../domain/entities/Topic.js').Topic>}
   */
  async getByName(name) {
    const data = await this.#db.getFromIndex(this.#storeName, 'name', name);
    if (!data) {
      throw new NotFoundError(`Topic with name ${name} not found`, { details: { name } });
    }
    return TopicPersistenceMapper.toEntity(data);
  }

  /**
   * Deletes a topic.
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async delete(id) {
    const existing = await this.#db.get(this.#storeName, id);
    if (!existing) {
      throw new NotFoundError(`Topic with id ${id} not found`);
    }
    await this.#db.delete(this.#storeName, id);
  }
}
