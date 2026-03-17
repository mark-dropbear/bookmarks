import { Topic } from '../../domain/entities/Topic.js';

/**
 * Maps between Topic Domain Entities and JSON-LD serialization format.
 */
export class TopicJsonLdMapper {
  /**
   * Converts a domain entity to a JSON-LD object.
   * @param {Topic} entity 
   * @returns {Object}
   */
  static toJsonLd(entity) {
    return {
      '@type': 'Thing',
      '@id': entity.id,
      name: entity.name,
      description: entity.description,
      subjectOf: entity.bookmarkIds.map(id => ({ '@id': id }))
    };
  }

  /**
   * Converts a JSON-LD object to a domain entity.
   * @param {Object} json 
   * @returns {Topic}
   */
  static toEntity(json) {
    const bookmarkIds = (json.subjectOf || []).map(ref => ref['@id']);
    return new Topic({
      id: json['@id'] || json.id,
      name: json.name,
      description: json.description,
      bookmarkIds: bookmarkIds
    });
  }
}
