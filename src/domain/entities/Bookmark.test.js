import { expect } from '@esm-bundle/chai';
import { Bookmark } from './Bookmark.js';
import { ValidationError } from '../../core/errors/AppErrors.js';

describe('Bookmark Entity', () => {
  it('should create a valid Bookmark object and serialize to JSON-LD', () => {
    const data = {
      id: 'webpage/456',
      name: 'Example Title',
      description: 'An example description',
      url: 'https://example.com',
      image: 'https://example.com/favicon.ico',
      about: [{ '@id': 'topic/123' }]
    };

    const bookmark = new Bookmark(data);

    expect(bookmark.id()).to.equal(data.id);
    expect(bookmark.name()).to.equal(data.name);
    expect(bookmark.url()).to.equal(data.url);
    expect(bookmark.image()).to.equal(data.image);
    
    const json = bookmark.toJSON();
    expect(json['@type']).to.equal('WebPage');
    expect(json['@id']).to.equal(data.id);
    expect(json.image).to.equal(data.image);
    expect(json.about).to.deep.equal(data.about);
  });

  it('should throw ValidationError if URL is missing', () => {
    expect(() => new Bookmark({ name: 'Test' }))
      .to.throw(ValidationError, 'URL is required');
  });

  it('should throw ValidationError if URL is invalid', () => {
    expect(() => new Bookmark({ name: 'Test', url: 'not-a-url' }))
      .to.throw(ValidationError, 'Invalid URL');
  });

  it('should allow adding topics via addTopic', () => {
    const bookmark = new Bookmark({ name: 'T', url: 'https://t.com' });
    bookmark.addTopic('topic/789');
    expect(bookmark.about()).to.deep.equal([{ '@id': 'topic/789' }]);
  });
});
