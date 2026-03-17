import { expect } from '@esm-bundle/chai';
import { BookmarkJsonLdMapper } from './BookmarkJsonLdMapper.js';
import { Bookmark } from '../../domain/entities/Bookmark.js';

describe('BookmarkJsonLdMapper', () => {
  it('should map a pure Bookmark entity to a JSON-LD object', () => {
    const bookmark = new Bookmark({
      id: 'webpage/123',
      name: 'Test',
      url: 'https://test.com',
      description: 'Desc',
      image: 'img.png',
      topicIds: ['topic/1', 'topic/2']
    });

    // Provide topic names for the full JSON-LD representation if desired, 
    // or just map the IDs to references.
    const topicNames = ['Topic 1', 'Topic 2'];
    
    const jsonLd = BookmarkJsonLdMapper.toJsonLd(bookmark, topicNames);

    expect(jsonLd).to.deep.equal({
      '@type': 'WebPage',
      '@id': 'webpage/123',
      name: 'Test',
      url: 'https://test.com',
      description: 'Desc',
      image: 'img.png',
      about: [
        { '@id': 'topic/1', name: 'Topic 1' },
        { '@id': 'topic/2', name: 'Topic 2' }
      ]
    });
  });

  it('should map a JSON-LD object to a pure Bookmark entity', () => {
    const jsonLd = {
      '@type': 'WebPage',
      '@id': 'webpage/123',
      name: 'Test',
      url: 'https://test.com',
      description: 'Desc',
      image: 'img.png',
      about: [
        { '@id': 'topic/1', name: 'Topic 1' },
        { '@id': 'topic/2' } // missing name should be handled gracefully
      ]
    };

    const bookmark = BookmarkJsonLdMapper.toEntity(jsonLd);

    expect(bookmark).to.be.instanceOf(Bookmark);
    expect(bookmark.id).to.equal('webpage/123');
    expect(bookmark.name).to.equal('Test');
    expect(bookmark.url).to.equal('https://test.com');
    expect(bookmark.description).to.equal('Desc');
    expect(bookmark.image).to.equal('img.png');
    expect(bookmark.topicIds).to.deep.equal(['topic/1', 'topic/2']);
  });
});
