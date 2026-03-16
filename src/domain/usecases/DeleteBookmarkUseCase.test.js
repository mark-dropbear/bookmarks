import { expect } from '@esm-bundle/chai';
import { DeleteBookmarkUseCase } from './DeleteBookmarkUseCase.js';
import { InMemoryBookmarkRepository } from '../../data/repositories/InMemoryBookmarkRepository.js';
import { InMemoryTopicRepository } from '../../data/repositories/InMemoryTopicRepository.js';
import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';
import { NotFoundError } from '../../core/errors/AppErrors.js';

describe('DeleteBookmarkUseCase', () => {
  let bookmarkRepository;
  let topicRepository;
  let useCase;

  beforeEach(() => {
    bookmarkRepository = new InMemoryBookmarkRepository();
    topicRepository = new InMemoryTopicRepository();
    useCase = new DeleteBookmarkUseCase(bookmarkRepository, topicRepository);
  });

  it('should delete a bookmark and cleanup topic references', async () => {
    const bookmark = new Bookmark({ id: 'b/1', name: 'Test', url: 'https://test.com', about: [{ '@id': 'topic/1' }] });
    const topic = new Topic({ id: 'topic/1', name: 'Topic 1', subjectOf: [{ '@id': 'b/1' }] });
    
    await bookmarkRepository.add(bookmark);
    await topicRepository.add(topic);

    await useCase.execute('b/1');

    // Verify bookmark is gone
    try {
      await bookmarkRepository.getById('b/1');
      expect.fail('Bookmark should have been deleted');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }

    // Verify topic cleanup
    const updatedTopic = await topicRepository.getById('topic/1');
    expect(updatedTopic.subjectOf).to.not.deep.include({ '@id': 'b/1' });
  });

  it('should throw NotFoundError if bookmark does not exist', async () => {
    try {
      await useCase.execute('non-existent');
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });
});
