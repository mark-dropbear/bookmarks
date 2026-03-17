import { expect } from '@esm-bundle/chai';
import { Topic } from './Topic.js';

describe('Topic Entity', () => {
  it('should create a valid Topic object', () => {
    const data = {
      id: 'topic/123',
      name: 'User title goes here',
      description: 'An optional description goes here',
      bookmarkIds: ['webpage/456']
    };

    const topic = new Topic(data);

    expect(topic.id).to.equal(data.id);
    expect(topic.name).to.equal(data.name);
    expect(topic.description).to.equal(data.description);
    expect(topic.bookmarkIds).to.deep.equal(data.bookmarkIds);
  });

  it('should allow adding bookmarks via addBookmark', () => {
    const topic = new Topic({ name: 'Lit' });
    topic.addBookmark('webpage/999');
    expect(topic.bookmarkIds).to.deep.equal(['webpage/999']);
  });
  
  it('should not add duplicate bookmarks', () => {
    const topic = new Topic({ name: 'Lit', bookmarkIds: ['webpage/999'] });
    topic.addBookmark('webpage/999');
    expect(topic.bookmarkIds).to.deep.equal(['webpage/999']);
  });

  it('should allow removing bookmarks via removeBookmark', () => {
    const topic = new Topic({ name: 'Lit', bookmarkIds: ['webpage/999'] });
    topic.removeBookmark('webpage/999');
    expect(topic.bookmarkIds).to.be.empty;
  });
});
