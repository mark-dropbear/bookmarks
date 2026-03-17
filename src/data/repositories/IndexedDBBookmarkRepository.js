import { NotFoundError } from '../../core/errors/AppErrors.js';
import { BookmarkPersistenceMapper } from '../../core/mappers/BookmarkPersistenceMapper.js';

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
   * Adds or updates a bookmark in the database.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark 
   * @returns {Promise<void>}
   */
  async add(bookmark) {
    const data = BookmarkPersistenceMapper.toPersistence(bookmark);
    await this.#db.put(this.#storeName, data);
  }

  /**
   * Retrieves all bookmarks.
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>}
   */
  async getAll() {
    const all = await this.#db.getAll(this.#storeName);
    return all.map(b => BookmarkPersistenceMapper.toEntity(b));
  }

  /**
   * Retrieves a bookmark by its unique identifier.
   * @param {string} id 
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark>}
   */
  async getById(id) {
    const data = await this.#db.get(this.#storeName, id);
    if (!data) {
      throw new NotFoundError(`Bookmark with id ${id} not found`, { details: { id } });
    }
    return BookmarkPersistenceMapper.toEntity(data);
  }

  /**
   * Updates an existing bookmark.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark 
   * @returns {Promise<void>}
   */
  async update(bookmark) {
    const data = BookmarkPersistenceMapper.toPersistence(bookmark);
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
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>}
   */
  async search(query) {
    const all = await this.#db.getAll(this.#storeName);
    const lowQuery = query.toLowerCase();
    const results = all.filter(b => 
      b.name.toLowerCase().includes(lowQuery) ||
      b.url.toLowerCase().includes(lowQuery) ||
      b.description.toLowerCase().includes(lowQuery)
    );
    return results.map(b => BookmarkPersistenceMapper.toEntity(b));
  }
}
