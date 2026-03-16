import { expect } from '@esm-bundle/chai';
import { Topic } from './Topic.js';

describe('Topic Entity', () => {
  it('should create a valid Topic object aligned with schema.org Thing', () => {
    const data = {
      id: 'topic/123',
      name: 'User title goes here',
      description: 'An optional description goes here',
      subjectOf: [{ '@id': 'webpage/456' }]
    };

    const topic = new Topic(data);

    expect(topic['@type']).to.equal('Thing');
    expect(topic['@id']).to.equal(data.id);
    expect(topic.name).to.equal(data.name);
    expect(topic.description).to.equal(data.description);
    expect(topic.subjectOf).to.deep.equal(data.subjectOf);
  });

  it('should generate a valid ID if not provided', () => {
    const topic = new Topic({ name: 'Generic' });
    expect(topic['@id']).to.match(/^topic\/[a-f0-9-]{36}$/);
  });
});
