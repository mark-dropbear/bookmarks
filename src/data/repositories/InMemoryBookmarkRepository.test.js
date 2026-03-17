import { expect } from '@esm-bundle/chai';
import { InMemoryBookmarkRepository } from './InMemoryBookmarkRepository.js';
import { Bookmark } from '../../domain/entities/Bookmark.js';
import { NotFoundError } from '../../core/errors/AppErrors.js';

describe('InMemoryBookmarkRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new InMemoryBookmarkRepository();
  });

  it('should add and retrieve all bookmarks', async () => {
    const bookmark1 = new Bookmark({ name: 'Test 1', url: 'https://test1.com' });
    const bookmark2 = new Bookmark({ name: 'Test 2', url: 'https://test2.com' });

    await repository.add(bookmark1);
    await repository.add(bookmark2);

    const all = await repository.getAll();
    expect(all).to.have.lengthOf(2);
    expect(all[0]).to.deep.equal(bookmark1.toJSON());
    expect(all[1]).to.deep.equal(bookmark2.toJSON());
  });

  it('should retrieve a bookmark by ID', async () => {
    const bookmark = new Bookmark({ id: 'b/123', name: 'Test', url: 'https://test.com' });
    await repository.add(bookmark);

    const retrieved = await repository.getById('b/123');
    expect(retrieved).to.deep.equal(bookmark.toJSON());
  });

  it('should throw NotFoundError if bookmark is not found by ID', async () => {
    try {
      await repository.getById('non-existent');
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
      expect(e.message).to.contain('Bookmark with id non-existent not found');
    }
  });

  it('should search bookmarks by name', async () => {
    const bookmark1 = new Bookmark({ name: 'Search Me', url: 'https://search.com' });
    const bookmark2 = new Bookmark({ name: 'Other', url: 'https://other.com' });

    await repository.add(bookmark1);
    await repository.add(bookmark2);

    const results = await repository.search('Search');
    expect(results).to.have.lengthOf(1);
    expect(results[0].name).to.equal('Search Me');
  });

  it('should search bookmarks by topic name', async () => {
    const bookmark1 = new Bookmark({ name: 'T1', url: 'https://t1.com', about: [{ '@id': 'topic/123', name: 'Awesome Topic' }] });
    const bookmark2 = new Bookmark({ name: 'T2', url: 'https://t2.com', about: [{ '@id': 'topic/456', name: 'Boring Topic' }] });

    await repository.add(bookmark1);
    await repository.add(bookmark2);

    const results = await repository.search('Awesome');
    expect(results).to.have.lengthOf(1);
    expect(results[0].name).to.equal('T1');
  });

  it('should delete a bookmark by ID', async () => {
    const bookmark = new Bookmark({ id: 'b/delete-me', name: 'Delete Me', url: 'https://delete.com' });
    await repository.add(bookmark);

    await repository.delete('b/delete-me');
    
    try {
      await repository.getById('b/delete-me');
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });

  it('should throw NotFoundError when deleting non-existent bookmark', async () => {
    try {
      await repository.delete('non-existent');
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });

  it('should update an existing bookmark', async () => {
    const bookmark = new Bookmark({ id: 'b/update-me', name: 'Original', url: 'https://original.com' });
    await repository.add(bookmark);

    const updatedBookmark = new Bookmark({ id: 'b/update-me', name: 'Updated', url: 'https://updated.com' });
    await repository.update(updatedBookmark);

    const retrieved = await repository.getById('b/update-me');
    expect(retrieved.name).to.equal('Updated');
    expect(retrieved.url).to.equal('https://updated.com');
  });

  it('should throw NotFoundError when updating non-existent bookmark', async () => {
    const bookmark = new Bookmark({ id: 'non-existent', name: 'Missing', url: 'https://missing.com' });
    try {
      await repository.update(bookmark);
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });
});
