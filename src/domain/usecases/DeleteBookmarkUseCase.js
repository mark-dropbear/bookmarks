import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';

/**
 * Use case for deleting a bookmark and cleaning up its associations.
 */
export class DeleteBookmarkUseCase {
  /**
   * @param {import('../repositories/BookmarkRepository.js').BookmarkRepository} bookmarkRepository
   * @param {import('../repositories/TopicRepository.js').TopicRepository} topicRepository
   */
  constructor(bookmarkRepository, topicRepository) {
    this.bookmarkRepository = bookmarkRepository;
    this.topicRepository = topicRepository;
  }

  /**
   * Deletes a bookmark and ensures related topics are cleaned up.
   * @param {string} id - The @id of the bookmark to delete.
   * @returns {Promise<void>}
   * @throws {import('../../core/errors/AppErrors.js').NotFoundError} If the bookmark is not found.
   */
  async execute(id) {
    // 1. Get the bookmark first to know its topics
    const bookmarkData = await this.bookmarkRepository.getById(id);
    const bookmark = Bookmark.fromJSON(bookmarkData);

    // 2. Delete the bookmark
    await this.bookmarkRepository.delete(id);

    // 3. Cleanup topics
    const topics = bookmark.about();
    for (const ref of topics) {
      const topicId = ref['@id'];
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
      } catch (e) {
        // If topic not found, it's already "clean" for this bookmark
      }
    }
  }
}
