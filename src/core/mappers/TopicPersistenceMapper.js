import { Topic } from '../../domain/entities/Topic.js';

/**
 * Maps between Topic Domain Entities and persistence data objects.
 */
export class TopicPersistenceMapper {
  /**
   * Converts a domain entity to a persistence object.
   * @param {Topic} entity 
   * @returns {Object}
   */
  static toPersistence(entity) {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      bookmarkIds: [...entity.bookmarkIds]
    };
  }

  /**
   * Converts a persistence object to a domain entity.
   * @param {Object} data 
   * @returns {Topic}
   */
  static toEntity(data) {
    return new Topic({
      id: data.id,
      name: data.name,
      description: data.description,
      bookmarkIds: data.bookmarkIds ? [...data.bookmarkIds] : []
    });
  }
}
