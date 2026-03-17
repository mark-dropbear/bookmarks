import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';
import { NotFoundError } from '../../core/errors/AppErrors.js';

/**
 * Use case for updating an existing bookmark.
 */
export class UpdateBookmarkUseCase {
  /**
   * @param {import('../repositories/BookmarkRepository.js').BookmarkRepository} bookmarkRepository
   * @param {import('../repositories/TopicRepository.js').TopicRepository} topicRepository
   * @param {import('./FaviconDiscovery.js').FaviconDiscovery} faviconDiscovery
   */
  constructor(bookmarkRepository, topicRepository, faviconDiscovery) {
    this.bookmarkRepository = bookmarkRepository;
    this.topicRepository = topicRepository;
    this.faviconDiscovery = faviconDiscovery;
  }

  /**
   * Updates an existing bookmark and synchronizes associations.
   * @param {import('../entities/Bookmark.js').BookmarkData} data - The updated bookmark data.
   * @returns {Promise<Bookmark>} The updated bookmark entity.
   * @throws {import('../../core/errors/AppErrors.js').NotFoundError} If the bookmark is not found.
   * @throws {import('../../core/errors/AppErrors.js').ValidationError} If the data is invalid.
   */
  async execute(data) {
    const id = data.id || data['@id'];
    
    // 1. Get current state
    const currentData = await this.bookmarkRepository.getById(id);
    const currentBookmark = Bookmark.fromJSON(currentData);

    // 2. Re-discover favicon if URL changed
    if (data.url !== currentBookmark.url() && !data.image) {
      data.image = await this.faviconDiscovery.discoverFavicon(data.url);
    } else if (!data.image) {
      data.image = currentBookmark.image();
    }

    // 3. Resolve topics by name to get their IDs
    const topics = data.about || [];
    const resolvedTopics = [];

    if (topics.length > 0) {
      for (const topicData of topics) {
        let topic;
        
        try {
          // Input data provides names
          const topicEntityData = await this.topicRepository.getByName(topicData.name);
          topic = Topic.fromJSON(topicEntityData);
        } catch (_e) {
          if (e instanceof NotFoundError) {
            // Topic doesn't exist, create it
            topic = new Topic({ name: topicData.name });
          } else {
            throw e;
          }
        }
        
        resolvedTopics.push({ '@id': topic.id(), name: topic.name() });
      }
    }
    
    data.about = resolvedTopics;

    // 4. Create and update bookmark
    const updatedBookmark = Bookmark.fromJSON(data);
    await this.bookmarkRepository.update(updatedBookmark);

    // 5. Synchronize Topics
    const oldTopicIds = currentBookmark.about().map(t => t['@id']);
    const newTopicIds = updatedBookmark.about().map(t => t['@id']);

    const toRemove = oldTopicIds.filter(tid => !newTopicIds.includes(tid));
    const toAdd = newTopicIds.filter(tid => !oldTopicIds.includes(tid));

    // Remove from old topics
    for (const topicId of toRemove) {
      try {
        const topicData = await this.topicRepository.getById(topicId);
        const topic = Topic.fromJSON(topicData);
        topic.removeBookmark(id);
        
        // If topic is now orphaned (no bookmarks), delete it
        if (topic.subjectOf().length === 0) {
          await this.topicRepository.delete(topicId);
        } else {
          await this.topicRepository.add(topic);
        }
      } catch (_e) {
        // Topic already gone or broken, skip
      }
    }

    // Add to new topics
    for (const topicRef of resolvedTopics.filter(t => toAdd.includes(t['@id']))) {
      let topic;
      try {
        const topicData = await this.topicRepository.getById(topicRef['@id']);
        topic = Topic.fromJSON(topicData);
      } catch (_e) {
        if (e instanceof NotFoundError) {
          topic = new Topic({ id: topicRef['@id'], name: topicRef.name });
        } else {
          throw e;
        }
      }
      topic.addBookmark(id);
      await this.topicRepository.add(topic);
    }

    return updatedBookmark;
  }
}
