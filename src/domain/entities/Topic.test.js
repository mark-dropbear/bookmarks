import { expect } from '@esm-bundle/chai';
import { Topic } from './Topic.js';

describe('Topic Entity', () => {
  it('should create a valid Topic object and serialize to JSON-LD', () => {
    const data = {
      id: 'topic/123',
      name: 'User title goes here',
      description: 'An optional description goes here',
      subjectOf: [{ '@id': 'webpage/456' }]
    };

    const topic = new Topic(data);

    expect(topic.id()).to.equal(data.id);
    expect(topic.name()).to.equal(data.name);
    
    const json = topic.toJSON();
    expect(json['@type']).to.equal('Thing');
    expect(json['@id']).to.equal(data.id);
    expect(json.subjectOf).to.deep.equal(data.subjectOf);
  });

  it('should allow adding bookmarks via addBookmark', () => {
    const topic = new Topic({ name: 'Lit' });
    topic.addBookmark('webpage/999');
    expect(topic.subjectOf()).to.deep.equal([{ '@id': 'webpage/999' }]);
  });
});
