import { ValidationError } from '../../core/errors/AppErrors.js';
import { ResourceId } from '../values/ResourceId.js';

/**
 * Represents a Bookmark (WebPage) entity in the domain.
 * Uses private fields for encapsulation and toJSON for schema.org compatibility.
 */
export class Bookmark {
  #id;
  #name;
  #description;
  #url;
  #image;
  #about;

  /**
   * Creates an instance of a Bookmark.
   * @param {import('../types/index.js').BookmarkData} data - The initial data for the bookmark.
   * @throws {ValidationError} If the URL is missing or invalid.
   */
  constructor({ id, name, description, url, image, about }) {
    if (!url) {
      throw new ValidationError('URL is required');
    }
    
    try {
      new URL(url);
    } catch (_e) {
      throw new ValidationError('Invalid URL', { details: { url } });
    }
    
    this.#id = id || ResourceId.generate('webpage').toString();
    this.#name = name || 'Untitled';
    this.#description = description || '';
    this.#url = url;
    this.#image = image || '';
    this.#about = about || [];
  }

  /**
   * Factory method to create a Bookmark from a plain JSON object.
   * Handles mapping schema.org fields if necessary.
   * @param {import('../types/index.js').BookmarkData} json 
   * @returns {Bookmark}
   */
  static fromJSON(json) {
    return new Bookmark({
      id: json['@id'] || json.id,
      name: json.name,
      description: json.description,
      url: json.url,
      image: json.image,
      about: json.about
    });
  }

  /**
   * Gets the unique identifier for the bookmark.
   * @returns {string} 
   */
  id() { return this.#id; }

  /**
   * Gets the title of the bookmark.
   * @returns {string} 
   */
  name() { return this.#name; }

  /**
   * Gets the description of the bookmark.
   * @returns {string} 
   */
  description() { return this.#description; }

  /**
   * Gets the URL of the bookmark.
   * @returns {string} 
   */
  url() { return this.#url; }

  /**
   * Gets the image URL associated with the bookmark.
   * @returns {string} 
   */
  image() { return this.#image; }

  /**
   * Gets the list of topics associated with the bookmark.
   * @returns {import('../types/index.js').TopicReference[]} 
   */
  about() { return [...this.#about]; }

  /**
   * Adds a topic reference to the bookmark.
   * @param {import('../types/index.js').TopicReference} topicRef 
   */
  addTopic(topicRef) {
    if (!this.#about.some(t => t['@id'] === topicRef['@id'])) {
      this.#about.push({ '@id': topicRef['@id'], name: topicRef.name });
    }
  }

  /**
   * Serializes the entity to a schema.org compliant JSON-LD object.
   * @returns {import('../types/index.js').BookmarkData & { '@type': string }}
   */
  toJSON() {
    return {
      '@type': 'WebPage',
      '@id': this.#id,
      'name': this.#name,
      'description': this.#description,
      'url': this.#url,
      'image': this.#image,
      'about': this.#about
    };
  }
}
