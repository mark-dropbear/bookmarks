import { Bookmark } from '../../domain/entities/Bookmark.js';

/**
 * Maps between Bookmark Domain Entities and persistence data objects.
 */
export class BookmarkPersistenceMapper {
  /**
   * Converts a domain entity to a persistence object.
   * @param {Bookmark} entity 
   * @returns {Object}
   */
  static toPersistence(entity) {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      url: entity.url,
      image: entity.image,
      topicIds: [...entity.topicIds]
    };
  }

  /**
   * Converts a persistence object to a domain entity.
   * @param {Object} data 
   * @returns {Bookmark}
   */
  static toEntity(data) {
    return new Bookmark({
      id: data.id,
      name: data.name,
      description: data.description,
      url: data.url,
      image: data.image,
      topicIds: data.topicIds ? [...data.topicIds] : []
    });
  }
}
