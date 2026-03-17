import { ResourceId } from '../values/ResourceId.js';

/**
 * Represents a Topic entity in the domain.
 */
export class Topic {
  /**
   * Creates an instance of a Topic.
   * @param {Object} data - The initial data for the topic.
   * @param {string} [data.id]
   * @param {string} [data.name]
   * @param {string} [data.description]
   * @param {string[]} [data.bookmarkIds]
   */
  constructor({ id, name, description, bookmarkIds }) {
    this.id = id || ResourceId.generate('topic').toString();
    this.name = name || 'Untitled Topic';
    this.description = description || '';
    this.bookmarkIds = bookmarkIds || [];
  }

  /**
   * Links a bookmark to this topic.
   * @param {string} bookmarkId 
   */
  addBookmark(bookmarkId) {
    if (!this.bookmarkIds.includes(bookmarkId)) {
      this.bookmarkIds.push(bookmarkId);
    }
  }

  /**
   * Unlinks a bookmark from this topic.
   * @param {string} bookmarkId 
   */
  removeBookmark(bookmarkId) {
    this.bookmarkIds = this.bookmarkIds.filter(id => id !== bookmarkId);
  }
}
