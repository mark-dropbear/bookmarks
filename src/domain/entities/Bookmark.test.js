import { expect } from '@esm-bundle/chai';
import { Bookmark } from './Bookmark.js';

describe('Bookmark Entity', () => {
  it('should create a valid Bookmark object aligned with schema.org', () => {
    const data = {
      id: 'webpage/456',
      name: 'Example Title',
      description: 'An example description',
      url: 'https://example.com',
      about: [{ '@id': 'topic/123' }]
    };

    const bookmark = new Bookmark(data);

    expect(bookmark['@type']).to.equal('WebPage');
    expect(bookmark['@id']).to.equal(data.id);
    expect(bookmark.name).to.equal(data.name);
    expect(bookmark.description).to.equal(data.description);
    expect(bookmark.url).to.equal(data.url);
    expect(bookmark.about).to.deep.equal(data.about);
  });

  it('should throw an error if URL is missing', () => {
    const data = {
      name: 'Example Title'
    };
    expect(() => new Bookmark(data)).to.throw('URL is required');
  });
});
