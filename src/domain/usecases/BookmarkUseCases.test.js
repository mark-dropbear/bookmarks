import { expect } from '@esm-bundle/chai';
import { AddBookmarkUseCase } from './AddBookmarkUseCase.js';
import { GetBookmarksUseCase } from './GetBookmarksUseCase.js';
import { InMemoryBookmarkRepository } from '../../data/repositories/InMemoryBookmarkRepository.js';
import { InMemoryTopicRepository } from '../../data/repositories/InMemoryTopicRepository.js';
import { Bookmark } from '../entities/Bookmark.js';
import { Topic } from '../entities/Topic.js';
import { ValidationError } from '../../core/errors/AppErrors.js';

describe('Bookmark Use Cases', () => {
  let bookmarkRepository;
  let topicRepository;
  let mockFaviconDiscovery;

  beforeEach(() => {
    bookmarkRepository = new InMemoryBookmarkRepository();
    topicRepository = new InMemoryTopicRepository();
    mockFaviconDiscovery = {
      discoverFavicon: async () => ''
    };
  });

  describe('AddBookmarkUseCase', () => {
    it('should add a bookmark and maintain topic links', async () => {
      const useCase = new AddBookmarkUseCase(bookmarkRepository, topicRepository, mockFaviconDiscovery);
      const bookmarkData = { 
        name: 'Test', 
        url: 'https://test.com',
        topicNames: ['Test Topic']
      };
      
      const result = await useCase.execute(bookmarkData);
      
      expect(result.id).to.exist;
      expect(result.name).to.equal('Test');
      expect(result.topicIds).to.have.lengthOf(1);
      
      // Verify topic was created/updated
      const topics = await topicRepository.getAll();
      const topic = topics.find(t => t.name === 'Test Topic');
      expect(topic).to.exist;
      expect(topic.bookmarkIds).to.include(result.id);
    });

    it('should throw ValidationError if bookmark data is invalid', async () => {
      const useCase = new AddBookmarkUseCase(bookmarkRepository, topicRepository, mockFaviconDiscovery);
      const invalidData = { name: 'Invalid', url: '' };

      try {
        await useCase.execute(invalidData);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).to.be.instanceOf(ValidationError);
        expect(e.message).to.equal('URL is required');
      }
    });

    it('should attempt to discover a favicon using the provided service', async () => {
      const customMockDiscovery = {
        discoverFavicon: async (url) => {
          if (url === 'https://lit.dev') return 'https://lit.dev/favicon.ico';
          return '';
        }
      };
      const useCase = new AddBookmarkUseCase(bookmarkRepository, topicRepository, customMockDiscovery);

      const bookmarkData = { name: 'Fetch Test', url: 'https://lit.dev' };
      const result = await useCase.execute(bookmarkData);
      
      expect(result.image).to.equal('https://lit.dev/favicon.ico');
    });
  });

  describe('GetBookmarksUseCase', () => {
    it('should retrieve all bookmarks or search them', async () => {
      const useCase = new GetBookmarksUseCase(bookmarkRepository);
      await bookmarkRepository.add(new Bookmark({ name: 'Alpha', url: 'https://a.com' }));
      await bookmarkRepository.add(new Bookmark({ name: 'Beta', url: 'https://b.com' }));

      const all = await useCase.execute();
      expect(all).to.have.lengthOf(2);
      expect(all[0].id).to.exist; // Verify it's a DTO

      const search = await useCase.execute('Alpha');
      expect(search).to.have.lengthOf(1);
      expect(search[0].name).to.equal('Alpha');
    });
  });
});
