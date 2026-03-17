import { NotFoundError } from '../../core/errors/AppErrors.js';

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
   * Helper to map application data to IndexedDB storage format.
   * Maps '@id' to 'id'.
   */
  #toDB(data) {
    const { '@id': id, ...rest } = data;
    return { id, ...rest };
  }

  /**
   * Helper to map IndexedDB storage format back to application data.
   * Maps 'id' back to '@id'.
   */
  #fromDB(data) {
    const { id, ...rest } = data;
    return { '@id': id, ...rest };
  }

  /**
   * Adds or updates a topic in the database.
   * @param {import('../../domain/entities/Topic.js').Topic} topic 
   * @returns {Promise<void>}
   */
  async add(topic) {
    const data = this.#toDB(topic.toJSON());
    await this.#db.put(this.#storeName, data);
  }

  /**
   * Retrieves all topics.
   * @returns {Promise<Object[]>}
   */
  async getAll() {
    const all = await this.#db.getAll(this.#storeName);
    return all.map(t => this.#fromDB(t));
  }

  /**
   * Retrieves a topic by its unique identifier.
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const data = await this.#db.get(this.#storeName, id);
    if (!data) {
      throw new NotFoundError(`Topic with id ${id} not found`, { details: { id } });
    }
    return this.#fromDB(data);
  }

  /**
   * Retrieves a topic by its name.
   * @param {string} name 
   * @returns {Promise<Object>}
   */
  async getByName(name) {
    const data = await this.#db.getFromIndex(this.#storeName, 'name', name);
    if (!data) {
      throw new NotFoundError(`Topic with name ${name} not found`, { details: { name } });
    }
    return this.#fromDB(data);
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
