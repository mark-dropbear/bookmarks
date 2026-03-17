import { NotFoundError } from '../../core/errors/AppErrors.js';
import { BookmarkPersistenceMapper } from '../../core/mappers/BookmarkPersistenceMapper.js';

/**
 * In-memory implementation of the BookmarkRepository.
 * Stores persistence data objects and returns pure Domain Entities.
 * @implements {import('../../domain/repositories/BookmarkRepository.js').BookmarkRepository}
 */
export class InMemoryBookmarkRepository {
  /**
   * Initializes a new instance of the InMemoryBookmarkRepository.
   */
  constructor() {
    /** 
     * The internal collection of bookmarks stored as persistence objects.
     * @type {Object[]} 
     */
    this.bookmarks = [];
  }

  /**
   * Adds or updates a bookmark in the in-memory collection.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark 
   * @returns {Promise<void>} 
   */
  async add(bookmark) {
    const data = BookmarkPersistenceMapper.toPersistence(bookmark);
    const index = this.bookmarks.findIndex(b => b.id === data.id);
    if (index !== -1) {
      this.bookmarks[index] = data;
    } else {
      this.bookmarks.push(data);
    }
  }

  /**
   * Retrieves all currently stored bookmarks.
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>}
   */
  async getAll() {
    return this.bookmarks.map(b => BookmarkPersistenceMapper.toEntity(b));
  }

  /**
   * Retrieves a bookmark by its unique identifier.
   * @param {string} id 
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark>} 
   * @throws {NotFoundError} If the bookmark is not found.
   */
  async getById(id) {
    const data = this.bookmarks.find(b => b.id === id);
    if (!data) {
      throw new NotFoundError(`Bookmark with id ${id} not found`, { details: { id } });
    }
    return BookmarkPersistenceMapper.toEntity(data);
  }

  /**
   * Updates an existing bookmark in the in-memory collection.
   * @param {import('../../domain/entities/Bookmark.js').Bookmark} bookmark 
   * @returns {Promise<void>} 
   * @throws {NotFoundError} If the bookmark is not found.
   */
  async update(bookmark) {
    const data = BookmarkPersistenceMapper.toPersistence(bookmark);
    const index = this.bookmarks.findIndex(b => b.id === data.id);
    if (index === -1) {
      throw new NotFoundError(`Bookmark with id ${data.id} not found`);
    }
    this.bookmarks[index] = data;
  }

  /**
   * Deletes a bookmark from the in-memory collection.
   * @param {string} id 
   * @returns {Promise<void>} 
   * @throws {NotFoundError} If the bookmark is not found.
   */
  async delete(id) {
    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index === -1) {
      throw new NotFoundError(`Bookmark with id ${id} not found`);
    }
    this.bookmarks.splice(index, 1);
  }

  /**
   * Searches the in-memory collection for bookmarks matching the provided query.
   * @param {string} query - The search term to match.
   * @returns {Promise<import('../../domain/entities/Bookmark.js').Bookmark[]>} 
   */
  async search(query) {
    const lowQuery = query.toLowerCase();
    const results = this.bookmarks.filter(b => 
      b.name.toLowerCase().includes(lowQuery) ||
      b.url.toLowerCase().includes(lowQuery) ||
      b.description.toLowerCase().includes(lowQuery)
    );
    return results.map(b => BookmarkPersistenceMapper.toEntity(b));
  }
}
