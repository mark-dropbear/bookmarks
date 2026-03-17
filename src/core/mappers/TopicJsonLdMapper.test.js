import { expect } from '@esm-bundle/chai';
import { TopicJsonLdMapper } from './TopicJsonLdMapper.js';
import { Topic } from '../../domain/entities/Topic.js';

describe('TopicJsonLdMapper', () => {
  it('should map a pure Topic entity to a JSON-LD object', () => {
    const topic = new Topic({
      id: 'topic/123',
      name: 'Test Topic',
      description: 'Desc',
      bookmarkIds: ['webpage/1', 'webpage/2']
    });

    const jsonLd = TopicJsonLdMapper.toJsonLd(topic);

    expect(jsonLd).to.deep.equal({
      '@type': 'Thing',
      '@id': 'topic/123',
      name: 'Test Topic',
      description: 'Desc',
      subjectOf: [
        { '@id': 'webpage/1' },
        { '@id': 'webpage/2' }
      ]
    });
  });

  it('should map a JSON-LD object to a pure Topic entity', () => {
    const jsonLd = {
      '@type': 'Thing',
      '@id': 'topic/123',
      name: 'Test Topic',
      description: 'Desc',
      subjectOf: [
        { '@id': 'webpage/1' },
        { '@id': 'webpage/2' }
      ]
    };

    const topic = TopicJsonLdMapper.toEntity(jsonLd);

    expect(topic).to.be.instanceOf(Topic);
    expect(topic.id).to.equal('topic/123');
    expect(topic.name).to.equal('Test Topic');
    expect(topic.description).to.equal('Desc');
    expect(topic.bookmarkIds).to.deep.equal(['webpage/1', 'webpage/2']);
  });
});
