import { ValidationError } from '../../core/errors/AppErrors.js';
import { ResourceId } from '../values/ResourceId.js';

/**
 * Represents a Bookmark entity in the domain.
 */
export class Bookmark {
  /**
   * Creates an instance of a Bookmark.
   * @param {Object} data - The initial data for the bookmark.
   * @param {string} [data.id]
   * @param {string} [data.name]
   * @param {string} [data.description]
   * @param {string} data.url
   * @param {string} [data.image]
   * @param {string[]} [data.topicIds]
   * @throws {ValidationError} If the URL is missing or invalid.
   */
  constructor({ id, name, description, url, image, topicIds }) {
    if (!url) {
      throw new ValidationError('URL is required');
    }
    
    try {
      new URL(url);
    } catch (_e) {
      throw new ValidationError('Invalid URL', { details: { url } });
    }
    
    this.id = id || ResourceId.generate('webpage').toString();
    this.name = name || 'Untitled';
    this.description = description || '';
    this.url = url;
    this.image = image || '';
    this.topicIds = topicIds || [];
  }

  /**
   * Adds a topic reference to the bookmark.
   * @param {string} topicId 
   */
  addTopic(topicId) {
    if (!this.topicIds.includes(topicId)) {
      this.topicIds.push(topicId);
    }
  }
}
