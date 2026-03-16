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

  it('should create a Topic from JSON using fromJSON', () => {
    const json = {
      '@id': 'topic/123',
      name: 'JSON Topic',
      description: 'Desc',
      subjectOf: [{ '@id': 'webpage/1' }]
    };

    const topic = Topic.fromJSON(json);

    expect(topic.id()).to.equal(json['@id']);
    expect(topic.name()).to.equal(json.name);
    expect(topic.description()).to.equal(json.description);
    expect(topic.subjectOf()).to.deep.equal(json.subjectOf);
  });

  it('should allow adding bookmarks via addBookmark', () => {
    const topic = new Topic({ name: 'Lit' });
    topic.addBookmark('webpage/999');
    expect(topic.subjectOf()).to.deep.equal([{ '@id': 'webpage/999' }]);
  });

  it('should allow removing bookmarks via removeBookmark', () => {
    const topic = new Topic({ name: 'Lit', subjectOf: [{ '@id': 'webpage/999' }] });
    topic.removeBookmark('webpage/999');
    expect(topic.subjectOf()).to.be.empty;
  });
});
