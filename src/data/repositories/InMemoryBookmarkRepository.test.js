import { expect } from '@esm-bundle/chai';
import { InMemoryBookmarkRepository } from './InMemoryBookmarkRepository.js';
import { Bookmark } from '../../domain/entities/Bookmark.js';

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
    expect(all).to.deep.include(bookmark1);
    expect(all).to.deep.include(bookmark2);
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

  it('should search bookmarks by topic ID', async () => {
    const bookmark1 = new Bookmark({ name: 'T1', url: 'https://t1.com', about: [{ '@id': 'topic/123' }] });
    const bookmark2 = new Bookmark({ name: 'T2', url: 'https://t2.com', about: [{ '@id': 'topic/456' }] });

    await repository.add(bookmark1);
    await repository.add(bookmark2);

    const results = await repository.search('topic/123');
    expect(results).to.have.lengthOf(1);
    expect(results[0].name).to.equal('T1');
  });
});
