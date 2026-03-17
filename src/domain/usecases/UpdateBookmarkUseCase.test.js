import { expect } from '@esm-bundle/chai';
import { UpdateBookmarkUseCase } from './UpdateBookmarkUseCase.js';
import { InMemoryBookmarkRepository } from '../../data/repositories/InMemoryBookmarkRepository.js';
import { InMemoryTopicRepository } from '../../data/repositories/InMemoryTopicRepository.js';
import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';
import { NotFoundError, ValidationError } from '../../core/errors/AppErrors.js';

describe('UpdateBookmarkUseCase', () => {
  let bookmarkRepository;
  let topicRepository;
  let useCase;
  let mockFaviconDiscovery;

  beforeEach(() => {
    bookmarkRepository = new InMemoryBookmarkRepository();
    topicRepository = new InMemoryTopicRepository();
    mockFaviconDiscovery = {
      discoverFavicon: async () => ''
    };
    useCase = new UpdateBookmarkUseCase(bookmarkRepository, topicRepository, mockFaviconDiscovery);
  });

  it('should update core bookmark fields', async () => {
    const bookmark = new Bookmark({ id: 'b/1', name: 'Original', url: 'https://test.com' });
    await bookmarkRepository.add(bookmark);

    const updateData = { id: 'b/1', name: 'Updated', url: 'https://test.com', description: 'New Desc' };
    const result = await useCase.execute(updateData);

    expect(result.name).to.equal('Updated');
    expect(result.description).to.equal('New Desc');
    
    const retrieved = await bookmarkRepository.getById('b/1');
    expect(retrieved.name).to.equal('Updated');
  });

  it('should re-trigger favicon discovery if URL changes', async () => {
    const bookmark = new Bookmark({ id: 'b/1', name: 'Test', url: 'https://old.com', image: 'https://old.com/fav.ico' });
    await bookmarkRepository.add(bookmark);

    const customMockDiscovery = {
      discoverFavicon: async (url) => {
        if (url === 'https://new.com') return 'https://new.com/favicon.ico';
        return '';
      }
    };
    const localUseCase = new UpdateBookmarkUseCase(bookmarkRepository, topicRepository, customMockDiscovery);

    const updateData = { id: 'b/1', name: 'Test', url: 'https://new.com' };
    const result = await localUseCase.execute(updateData);

    expect(result.url).to.equal('https://new.com');
    expect(result.image).to.equal('https://new.com/favicon.ico');
  });

  it('should synchronize topic links (add new, remove old)', async () => {
    const bookmark = new Bookmark({ 
      id: 'b/1', 
      name: 'Test', 
      url: 'https://test.com', 
      topicIds: ['topic/old'] 
    });
    const oldTopic = new Topic({ id: 'topic/old', name: 'Old', bookmarkIds: ['b/1'] });
    const newTopic = new Topic({ id: 'topic/new', name: 'New' });

    await bookmarkRepository.add(bookmark);
    await topicRepository.add(oldTopic);
    await topicRepository.add(newTopic);

    const updateData = { 
      id: 'b/1', 
      name: 'Test', 
      url: 'https://test.com', 
      topicNames: ['New'] 
      // Notice we do NOT pass topicIds: ['topic/old']
    };
    await useCase.execute(updateData);

    // Verify old topic cleaned up (and deleted if orphaned)
    try {
      await topicRepository.getById('topic/old');
      expect.fail('Topic should have been deleted');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }

    // Verify new topic linked
    const updatedNewTopic = await topicRepository.getById('topic/new');
    expect(updatedNewTopic.bookmarkIds).to.deep.include('b/1');
    
    // Verify bookmark has new topic only
    const updatedBookmark = await bookmarkRepository.getById('b/1');
    expect(updatedBookmark.topicIds).to.deep.equal(['topic/new']);
  });

  it('should ignore topicIds if topicNames is provided', async () => {
    const bookmark = new Bookmark({ id: 'b/1', name: 'Test', url: 'https://test.com', topicIds: ['t/1'] });
    await bookmarkRepository.add(bookmark);
    await topicRepository.add(new Topic({ id: 't/1', name: 'T1', bookmarkIds: ['b/1'] }));

    const updateData = { 
      id: 'b/1', 
      name: 'Test', 
      url: 'https://test.com', 
      topicIds: ['t/1'], // Provide old IDs
      topicNames: [] // But say we want empty tags
    };
    await useCase.execute(updateData);

    const updated = await bookmarkRepository.getById('b/1');
    expect(updated.topicIds).to.be.empty; // topicNames won!
  });

  it('should delete orphaned topics during update', async () => {
    const bookmark = new Bookmark({ 
      id: 'b/1', 
      name: 'Test', 
      url: 'https://test.com', 
      topicIds: ['topic/orphan'] 
    });
    const orphanTopic = new Topic({ id: 'topic/orphan', name: 'Orphan', bookmarkIds: ['b/1'] });

    await bookmarkRepository.add(bookmark);
    await topicRepository.add(orphanTopic);

    const updateData = { 
      id: 'b/1', 
      name: 'Test', 
      url: 'https://test.com', 
      topicIds: [], // Remove the topic
      topicNames: []
    };
    await useCase.execute(updateData);

    // Verify orphan topic was deleted
    try {
      await topicRepository.getById('topic/orphan');
      expect.fail('Topic should have been deleted');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });

  it('should throw NotFoundError if bookmark does not exist', async () => {
    try {
      await useCase.execute({ id: 'non-existent', name: 'X', url: 'https://x.com' });
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });

  it('should throw ValidationError if update data is invalid', async () => {
    const bookmark = new Bookmark({ id: 'b/1', name: 'Test', url: 'https://test.com' });
    await bookmarkRepository.add(bookmark);

    try {
      await useCase.execute({ id: 'b/1', name: 'Test', url: '' });
      expect.fail('Should have thrown ValidationError');
    } catch (e) {
      expect(e).to.be.instanceOf(ValidationError);
    }
  });
});
