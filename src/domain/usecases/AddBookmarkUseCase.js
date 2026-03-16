import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';

/**
 * Use case for adding a new bookmark and ensuring its topics are managed.
 * This encapsulates the logic of bi-directional linking between WebPages and Things.
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
   * Automatically creates or updates associated topics to maintain bi-directional links.
   * @param {import('../entities/Bookmark.js').BookmarkData} data - The bookmark data.
   * @returns {Promise<Bookmark>} The created bookmark.
   */
  async execute(data) {
    const bookmark = new Bookmark(data);
    await this.bookmarkRepository.add(bookmark);

    // Maintain bi-directional links with topics
    if (bookmark.about && bookmark.about.length > 0) {
      for (const ref of bookmark.about) {
        const topicId = ref['@id'];
        let topic = await this.topicRepository.getById(topicId);
        
        if (!topic) {
          // Create a shell topic if it doesn't exist
          topic = new Topic({ id: topicId, name: 'New Topic' });
        }

        // Add this bookmark to the topic's subjectOf if not already there
        const alreadyLinked = topic.subjectOf.some(sr => sr['@id'] === bookmark.id);
        if (!alreadyLinked) {
          topic.subjectOf.push({ '@id': bookmark.id });
          await this.topicRepository.add(topic);
        }
      }
    }

    return bookmark;
  }
}
