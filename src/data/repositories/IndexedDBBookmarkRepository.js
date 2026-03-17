import { NotFoundError } from '../../core/errors/AppErrors.js';

/**
 * IndexedDB implementation of the BookmarkRepository.
 * Handles persistence of bookmarks using the browser's IndexedDB API via 'idb' library.
 * @implements {import('../../domain/repositories/BookmarkRepository.js').BookmarkRepository}
 */
export class IndexedDBBookmarkRepository {
  /** @type {import('idb').IDBPDatabase<any>} */
  #db;
  #storeName = 'bookmarks';

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
   * Adds or updates a bookmark in the database.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark 
   * @returns {Promise<void>}
   */
  async add(bookmark) {
    const data = this.#toDB(bookmark.toJSON());
    await this.#db.put(this.#storeName, data);
  }

  /**
   * Retrieves all bookmarks.
   * @returns {Promise<Object[]>}
   */
  async getAll() {
    const all = await this.#db.getAll(this.#storeName);
    return all.map(b => this.#fromDB(b));
  }

  /**
   * Retrieves a bookmark by its unique identifier.
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const data = await this.#db.get(this.#storeName, id);
    if (!data) {
      throw new NotFoundError(`Bookmark with id ${id} not found`, { details: { id } });
    }
    return this.#fromDB(data);
  }

  /**
   * Updates an existing bookmark.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark 
   * @returns {Promise<void>}
   */
  async update(bookmark) {
    const data = this.#toDB(bookmark.toJSON());
    // Check existence first to match interface expectation
    const existing = await this.#db.get(this.#storeName, data.id);
    if (!existing) {
      throw new NotFoundError(`Bookmark with id ${data.id} not found`);
    }
    await this.#db.put(this.#storeName, data);
  }

  /**
   * Deletes a bookmark.
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async delete(id) {
    const existing = await this.#db.get(this.#storeName, id);
    if (!existing) {
      throw new NotFoundError(`Bookmark with id ${id} not found`);
    }
    await this.#db.delete(this.#storeName, id);
  }

  /**
   * Searches bookmarks. 
   * Note: This currently performs a full scan filtered in memory since 
   * complex multi-field keyword searching isn't natively supported by simple IDB indexes.
   * @param {string} query 
   * @returns {Promise<Object[]>}
   */
  async search(query) {
    const all = await this.getAll();
    const lowQuery = query.toLowerCase();
    return all.filter(b => 
      b.name.toLowerCase().includes(lowQuery) ||
      b.url.toLowerCase().includes(lowQuery) ||
      b.description.toLowerCase().includes(lowQuery) ||
      b.about.some(t => t.name && t.name.toLowerCase().includes(lowQuery))
    );
  }
}
