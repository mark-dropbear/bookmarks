import { expect } from '@esm-bundle/chai';
import { AddBookmarkUseCase } from './AddBookmarkUseCase.js';
import { GetBookmarksUseCase } from './GetBookmarksUseCase.js';
import { InMemoryBookmarkRepository } from '../../data/repositories/InMemoryBookmarkRepository.js';
import { Bookmark } from '../entities/Bookmark.js';

describe('Bookmark Use Cases', () => {
  let repository;

  beforeEach(() => {
    repository = new InMemoryBookmarkRepository();
  });

  describe('AddBookmarkUseCase', () => {
    it('should add a bookmark via the repository', async () => {
      const useCase = new AddBookmarkUseCase(repository);
      const bookmarkData = { name: 'Test', url: 'https://test.com' };
      
      const result = await useCase.execute(bookmarkData);
      
      expect(result).to.be.instanceOf(Bookmark);
      expect(result.url).to.equal(bookmarkData.url);
      
      const all = await repository.getAll();
      expect(all).to.have.lengthOf(1);
    });
  });

  describe('GetBookmarksUseCase', () => {
    it('should retrieve all bookmarks or search them', async () => {
      const useCase = new GetBookmarksUseCase(repository);
      await repository.add(new Bookmark({ name: 'Alpha', url: 'https://a.com' }));
      await repository.add(new Bookmark({ name: 'Beta', url: 'https://b.com' }));

      const all = await useCase.execute();
      expect(all).to.have.lengthOf(2);

      const search = await useCase.execute('Alpha');
      expect(search).to.have.lengthOf(1);
      expect(search[0].name).to.equal('Alpha');
    });
  });
});
