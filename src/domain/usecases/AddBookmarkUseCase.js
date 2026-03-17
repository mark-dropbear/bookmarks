import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';
import { NotFoundError } from '../../core/errors/AppErrors.js';

/**
 * Use case for adding a new bookmark and ensuring its topics are managed.
 * Includes URL validation and automated favicon discovery.
 */
export class AddBookmarkUseCase {
  /**
   * Initializes the use case with repositories and services.
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
   * Executes the use case to add a new bookmark.
   * Automatically creates or updates associated topics and attempts to find a favicon.
   * @param {import('../types/index.js').BookmarkDTO} dto - The bookmark DTO from the UI.
   * @returns {Promise<import('../types/index.js').BookmarkDTO>} The created bookmark DTO.
   * @throws {import('../../core/errors/AppErrors.js').ValidationError} If the bookmark data is invalid.
   */
  async execute(dto) {
    // 1. Discover Favicon if not already provided
    let image = dto.image;
    if (!image) {
      image = await this.faviconDiscovery.discoverFavicon(dto.url);
    }

    // 2. Resolve topics by name (if provided by UI) to get their IDs
    const topicNames = dto.topicNames || [];
    const resolvedTopicIds = [...(dto.topicIds || [])];

    for (const name of topicNames) {
      let topic;
      try {
        topic = await this.topicRepository.getByName(name);
      } catch (_e) {
        // Topic doesn't exist, create it.
        topic = new Topic({ name });
        await this.topicRepository.add(topic);
      }
      if (!resolvedTopicIds.includes(topic.id)) {
        resolvedTopicIds.push(topic.id);
      }
    }

    // 3. Create Bookmark Entity
    const bookmark = new Bookmark({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      url: dto.url,
      image: image,
      topicIds: resolvedTopicIds
    });
    
    await this.bookmarkRepository.add(bookmark);

    // 4. Maintain bi-directional links with topics
    for (const topicId of resolvedTopicIds) {
      const topic = await this.topicRepository.getById(topicId);
      topic.addBookmark(bookmark.id);
      await this.topicRepository.add(topic);
    }

    return {
      id: bookmark.id,
      name: bookmark.name,
      description: bookmark.description,
      url: bookmark.url,
      image: bookmark.image,
      topicIds: [...bookmark.topicIds]
    };
  }
}
