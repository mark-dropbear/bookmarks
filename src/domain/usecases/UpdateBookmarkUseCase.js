import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';
import { NotFoundError } from '../../core/errors/AppErrors.js';
import { FaviconDiscovery } from './FaviconDiscovery.js';

/**
 * Use case for updating an existing bookmark.
 */
export class UpdateBookmarkUseCase {
  /**
   * @param {import('../repositories/BookmarkRepository.js').BookmarkRepository} bookmarkRepository
   * @param {import('../repositories/TopicRepository.js').TopicRepository} topicRepository
   */
  constructor(bookmarkRepository, topicRepository) {
    this.bookmarkRepository = bookmarkRepository;
    this.topicRepository = topicRepository;
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
      data.image = await FaviconDiscovery.discoverFavicon(data.url);
    } else if (!data.image) {
      data.image = currentBookmark.image();
    }

    // 3. Create and update bookmark
    const updatedBookmark = Bookmark.fromJSON(data);
    await this.bookmarkRepository.update(updatedBookmark);

    // 4. Synchronize Topics
    const oldTopicIds = currentBookmark.about().map(t => t['@id']);
    const newTopicIds = updatedBookmark.about().map(t => t['@id']);

    const toRemove = oldTopicIds.filter(id => !newTopicIds.includes(id));
    const toAdd = newTopicIds.filter(id => !oldTopicIds.includes(id));

    // Remove from old topics
    for (const topicId of toRemove) {
      try {
        const topicData = await this.topicRepository.getById(topicId);
        const topic = Topic.fromJSON(topicData);
        topic.removeBookmark(id);
        await this.topicRepository.add(topic);
      } catch (e) {
        // Topic already gone or broken, skip
      }
    }

    // Add to new topics
    for (const topicId of toAdd) {
      let topic;
      try {
        const topicData = await this.topicRepository.getById(topicId);
        topic = Topic.fromJSON(topicData);
      } catch (e) {
        if (e instanceof NotFoundError) {
          topic = Topic.fromJSON({ '@id': topicId, name: 'New Topic' });
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
