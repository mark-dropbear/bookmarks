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
   * @param {import('../entities/Bookmark.js').BookmarkData} data - The bookmark data.
   * @returns {Promise<Bookmark>} The created bookmark.
   * @throws {import('../../core/errors/AppErrors.js').ValidationError} If the bookmark data is invalid.
   * @throws {import('../../core/errors/AppErrors.js').RepositoryError} If storage fails.
   */
  async execute(data) {
    // 1. Discover Favicon if not already provided
    if (!data.image) {
      data.image = await this.faviconDiscovery.discoverFavicon(data.url);
    }

    // 2. Resolve topics by name to get their IDs
    const topics = data.about || [];
    const resolvedTopics = [];

    if (topics.length > 0) {
      for (const topicData of topics) {
        let topic;
        
        try {
          // Input data provides names
          const topicEntityData = await this.topicRepository.getByName(topicData.name);
          topic = Topic.fromJSON(topicEntityData);
        } catch (e) {
          if (e instanceof NotFoundError) {
            // Topic doesn't exist, create it. It will auto-generate a ResourceId.
            topic = new Topic({ name: topicData.name });
          } else {
            throw e;
          }
        }
        
        resolvedTopics.push({ '@id': topic.id(), name: topic.name() });
      }
    }
    
    // Replace the input topic strings with fully resolved references
    data.about = resolvedTopics;

    // 3. Create Bookmark Entity
    const bookmark = new Bookmark(data);
    await this.bookmarkRepository.add(bookmark);

    // 4. Maintain bi-directional links with topics
    for (const ref of resolvedTopics) {
      let topic;
      try {
        const topicData = await this.topicRepository.getById(ref['@id']);
        topic = Topic.fromJSON(topicData);
      } catch (e) {
        if (e instanceof NotFoundError) {
          // We created it in memory earlier but it might not be in the repo yet
          topic = new Topic({ id: ref['@id'], name: ref.name });
        } else {
          throw e;
        }
      }
      
      topic.addBookmark(bookmark.id());
      await this.topicRepository.add(topic);
    }

    return bookmark;
  }
}
