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

    // Verify topic cleanup (should be deleted because it's orphaned)
    try {
      await topicRepository.getById('topic/1');
      expect.fail('Orphaned topic should have been deleted');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });

  it('should preserve shared topics and delete orphaned topics', async () => {
    // Shared Topic: used by b/1 and b/2
    // Unique Topic: used only by b/1
    const b1 = new Bookmark({ id: 'b/1', name: 'B1', url: 'https://b1.com', about: [{ '@id': 'topic/shared' }, { '@id': 'topic/unique' }] });
    const b2 = new Bookmark({ id: 'b/2', name: 'B2', url: 'https://b2.com', about: [{ '@id': 'topic/shared' }] });
    
    const tShared = new Topic({ id: 'topic/shared', name: 'Shared', subjectOf: [{ '@id': 'b/1' }, { '@id': 'b/2' }] });
    const tUnique = new Topic({ id: 'topic/unique', name: 'Unique', subjectOf: [{ '@id': 'b/1' }] });

    await bookmarkRepository.add(b1);
    await bookmarkRepository.add(b2);
    await topicRepository.add(tShared);
    await topicRepository.add(tUnique);

    await useCase.execute('b/1');

    // Shared topic should still exist and have b/2
    const updatedShared = await topicRepository.getById('topic/shared');
    expect(updatedShared).to.exist;
    expect(updatedShared.subjectOf).to.deep.equal([{ '@id': 'b/2' }]);

    // Unique topic should be DELETED because it's orphaned
    try {
      await topicRepository.getById('topic/unique');
      expect.fail('Orphaned topic should have been deleted');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
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
