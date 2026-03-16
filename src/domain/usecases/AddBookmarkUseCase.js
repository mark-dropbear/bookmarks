import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';
import { NotFoundError } from '../../core/errors/AppErrors.js';

/**
 * Use case for adding a new bookmark and ensuring its topics are managed.
 * Includes URL validation and automated favicon discovery using Image loading.
 */
export class AddBookmarkUseCase {
  /**
   * Initializes the use case with repositories.
   * @param {import('../repositories/BookmarkRepository.js').BookmarkRepository} bookmarkRepository
   * @param {import('../repositories/TopicRepository.js').TopicRepository} topicRepository
   */
  constructor(bookmarkRepository, topicRepository) {
    this.bookmarkRepository = bookmarkRepository;
    this.topicRepository = topicRepository;
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
      data.image = await this.#discoverFavicon(data.url);
    }

    // 2. Create Bookmark Entity (Constructor performs validation and throws ValidationError)
    const bookmark = new Bookmark(data);
    await this.bookmarkRepository.add(bookmark);

    // 3. Maintain bi-directional links with topics
    const topics = bookmark.about();
    if (topics.length > 0) {
      for (const ref of topics) {
        const topicId = ref['@id'];
        let topic;
        
        try {
          const topicData = await this.topicRepository.getById(topicId);
          topic = new Topic(topicData);
        } catch (e) {
          if (e instanceof NotFoundError) {
            // Topic doesn't exist, create it
            topic = new Topic({ id: topicId, name: 'New Topic' });
          } else {
            throw e;
          }
        }

        topic.addBookmark(bookmark.id());
        await this.topicRepository.add(topic);
      }
    }

    return bookmark;
  }

  /**
   * Attempts to find a favicon for the given URL by testing common extensions.
   * @param {string} url 
   * @returns {Promise<string>} The URL of the found favicon, or empty string.
   */
  async #discoverFavicon(url) {
    try {
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
      const extensions = ['ico', 'svg', 'png'];

      for (const ext of extensions) {
        const faviconUrl = `${baseUrl}/favicon.${ext}`;
        const exists = await this.#testImageUrl(faviconUrl);
        if (exists) {
          return faviconUrl;
        }
      }
    } catch (e) {
      // Invalid URL - we just return empty image instead of crashing
    }
    return '';
  }

  /**
   * Tests if an image URL is valid and accessible.
   * @param {string} url 
   * @returns {Promise<boolean>}
   */
  #testImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}
