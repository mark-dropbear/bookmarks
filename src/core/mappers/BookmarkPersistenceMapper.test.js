import { expect } from '@esm-bundle/chai';
import { BookmarkPersistenceMapper } from './BookmarkPersistenceMapper.js';
import { Bookmark } from '../../domain/entities/Bookmark.js';

describe('BookmarkPersistenceMapper', () => {
  it('should map a pure Bookmark entity to a persistence object', () => {
    const bookmark = new Bookmark({
      id: 'b/123',
      name: 'Test',
      url: 'https://test.com',
      description: 'Desc',
      image: 'img.png',
      topicIds: ['t/1', 't/2']
    });

    const persistenceObj = BookmarkPersistenceMapper.toPersistence(bookmark);

    expect(persistenceObj).to.deep.equal({
      id: 'b/123',
      name: 'Test',
      url: 'https://test.com',
      description: 'Desc',
      image: 'img.png',
      topicIds: ['t/1', 't/2']
    });
  });

  it('should map a persistence object to a pure Bookmark entity', () => {
    const persistenceObj = {
      id: 'b/123',
      name: 'Test',
      url: 'https://test.com',
      description: 'Desc',
      image: 'img.png',
      topicIds: ['t/1', 't/2']
    };

    const bookmark = BookmarkPersistenceMapper.toEntity(persistenceObj);

    expect(bookmark).to.be.instanceOf(Bookmark);
    expect(bookmark.id).to.equal('b/123');
    expect(bookmark.name).to.equal('Test');
    expect(bookmark.url).to.equal('https://test.com');
    expect(bookmark.description).to.equal('Desc');
    expect(bookmark.image).to.equal('img.png');
    expect(bookmark.topicIds).to.deep.equal(['t/1', 't/2']);
  });
});
