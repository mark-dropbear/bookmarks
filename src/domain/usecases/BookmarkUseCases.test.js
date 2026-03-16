import { expect } from '@esm-bundle/chai';
import { AddBookmarkUseCase } from './AddBookmarkUseCase.js';
import { GetBookmarksUseCase } from './GetBookmarksUseCase.js';
import { InMemoryBookmarkRepository } from '../../data/repositories/InMemoryBookmarkRepository.js';
import { InMemoryTopicRepository } from '../../data/repositories/InMemoryTopicRepository.js';
import { Bookmark } from '../entities/Bookmark.js';

describe('Bookmark Use Cases', () => {
  let bookmarkRepository;
  let topicRepository;

  beforeEach(() => {
    bookmarkRepository = new InMemoryBookmarkRepository();
    topicRepository = new InMemoryTopicRepository();
  });

  describe('AddBookmarkUseCase', () => {
    it('should add a bookmark and maintain topic links', async () => {
      const useCase = new AddBookmarkUseCase(bookmarkRepository, topicRepository);
      const bookmarkData = { 
        name: 'Test', 
        url: 'https://test.com',
        about: [{ '@id': 'topic/123' }]
      };
      
      const result = await useCase.execute(bookmarkData);
      
      expect(result).to.be.instanceOf(Bookmark);
      
      // Verify topic was created/updated
      const topic = await topicRepository.getById('topic/123');
      expect(topic).to.exist;
      expect(topic.subjectOf).to.deep.include({ '@id': result.id });
    });

    it('should attempt to discover a favicon using Image loading', async () => {
      const useCase = new AddBookmarkUseCase(bookmarkRepository, topicRepository);
      
      // Stub Image for this test
      const originalImage = window.Image;
      window.Image = class {
        set src(url) {
          if (url.endsWith('favicon.ico')) {
            setTimeout(() => this.onload(), 0);
          } else {
            setTimeout(() => this.onerror(), 0);
          }
        }
      };

      const bookmarkData = { name: 'Fetch Test', url: 'https://lit.dev' };
      const result = await useCase.execute(bookmarkData);
      
      expect(result.image).to.equal('https://lit.dev/favicon.ico');
      
      window.Image = originalImage;
    });
  });

  describe('GetBookmarksUseCase', () => {
    it('should retrieve all bookmarks or search them', async () => {
      const useCase = new GetBookmarksUseCase(bookmarkRepository);
      await bookmarkRepository.add(new Bookmark({ name: 'Alpha', url: 'https://a.com' }));
      await bookmarkRepository.add(new Bookmark({ name: 'Beta', url: 'https://b.com' }));

      const all = await useCase.execute();
      expect(all).to.have.lengthOf(2);

      const search = await useCase.execute('Alpha');
      expect(search).to.have.lengthOf(1);
      expect(search[0].name).to.equal('Alpha');
    });
  });
});
