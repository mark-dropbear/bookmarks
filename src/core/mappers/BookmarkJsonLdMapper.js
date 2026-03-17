import { Bookmark } from '../../domain/entities/Bookmark.js';

/**
 * Maps between Bookmark Domain Entities and JSON-LD serialization format.
 */
export class BookmarkJsonLdMapper {
  /**
   * Converts a domain entity to a JSON-LD object.
   * @param {Bookmark} entity 
   * @param {string[]} [topicNames] - Optional names for the topics to enrich the JSON-LD.
   * @returns {Object}
   */
  static toJsonLd(entity, topicNames = []) {
    return {
      '@type': 'WebPage',
      '@id': entity.id,
      name: entity.name,
      description: entity.description,
      url: entity.url,
      image: entity.image,
      about: entity.topicIds.map((id, index) => {
        const ref = { '@id': id };
        if (topicNames[index]) {
          ref.name = topicNames[index];
        }
        return ref;
      })
    };
  }

  /**
   * Converts a JSON-LD object to a domain entity.
   * @param {Object} json 
   * @returns {Bookmark}
   */
  static toEntity(json) {
    const topicIds = (json.about || []).map(ref => ref['@id']);
    return new Bookmark({
      id: json['@id'] || json.id,
      name: json.name,
      description: json.description,
      url: json.url,
      image: json.image,
      topicIds: topicIds
    });
  }
}
