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
   * @param {import('../types/index.js').BookmarkDTO} dto - The updated bookmark DTO.
   * @returns {Promise<import('../types/index.js').BookmarkDTO>} The updated bookmark DTO.
   * @throws {import('../../core/errors/AppErrors.js').NotFoundError} If the bookmark is not found.
   */
  async execute(dto) {
    const id = dto.id;
    
    // 1. Get current state
    const currentBookmark = await this.bookmarkRepository.getById(id);

    // 2. Re-discover favicon if URL changed
    let image = dto.image;
    if (dto.url !== currentBookmark.url && !image) {
      image = await this.faviconDiscovery.discoverFavicon(dto.url);
    } else if (!image) {
      image = currentBookmark.image;
    }

    // 3. Resolve topics by name (if provided by UI) to get their IDs
    const topicNames = dto.topicNames || [];
    const resolvedTopicIds = [...(dto.topicIds || [])];

    for (const name of topicNames) {
      let topic;
      try {
        topic = await this.topicRepository.getByName(name);
      } catch (_e) {
        // Topic doesn't exist, create it
        topic = new Topic({ name });
        await this.topicRepository.add(topic);
      }
      if (!resolvedTopicIds.includes(topic.id)) {
        resolvedTopicIds.push(topic.id);
      }
    }

    // 4. Create and update bookmark entity
    const updatedBookmark = new Bookmark({
      id: id,
      name: dto.name,
      description: dto.description,
      url: dto.url,
      image: image,
      topicIds: resolvedTopicIds
    });
    
    await this.bookmarkRepository.update(updatedBookmark);

    // 5. Synchronize Topics
    const oldTopicIds = [...currentBookmark.topicIds];
    const newTopicIds = [...updatedBookmark.topicIds];

    const toRemove = oldTopicIds.filter(tid => !newTopicIds.includes(tid));
    const toAdd = newTopicIds.filter(tid => !oldTopicIds.includes(tid));

    // Remove from old topics
    for (const topicId of toRemove) {
      try {
        const topic = await this.topicRepository.getById(topicId);
        topic.removeBookmark(id);
        
        // If topic is now orphaned (no bookmarks), delete it
        if (topic.bookmarkIds.length === 0) {
          await this.topicRepository.delete(topicId);
        } else {
          await this.topicRepository.add(topic); // add acts as upsert
        }
      } catch (_e) {
        // Topic already gone or broken, skip
      }
    }

    // Add to new topics
    for (const topicId of toAdd) {
      let topic;
      try {
        topic = await this.topicRepository.getById(topicId);
      } catch (_e) {
        // If somehow the topic wasn't created above, skip or recreate.
        // It should have been handled in step 3.
        continue;
      }
      topic.addBookmark(id);
      await this.topicRepository.add(topic); // add acts as upsert
    }

    return {
      id: updatedBookmark.id,
      name: updatedBookmark.name,
      description: updatedBookmark.description,
      url: updatedBookmark.url,
      image: updatedBookmark.image,
      topicIds: [...updatedBookmark.topicIds]
    };
  }
}
