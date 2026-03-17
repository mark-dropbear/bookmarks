import { expect } from '@esm-bundle/chai';
import { TopicPersistenceMapper } from './TopicPersistenceMapper.js';
import { Topic } from '../../domain/entities/Topic.js';

describe('TopicPersistenceMapper', () => {
  it('should map a pure Topic entity to a persistence object', () => {
    const topic = new Topic({
      id: 't/123',
      name: 'Test Topic',
      description: 'Desc',
      bookmarkIds: ['b/1', 'b/2']
    });

    const persistenceObj = TopicPersistenceMapper.toPersistence(topic);

    expect(persistenceObj).to.deep.equal({
      id: 't/123',
      name: 'Test Topic',
      description: 'Desc',
      bookmarkIds: ['b/1', 'b/2']
    });
  });

  it('should map a persistence object to a pure Topic entity', () => {
    const persistenceObj = {
      id: 't/123',
      name: 'Test Topic',
      description: 'Desc',
      bookmarkIds: ['b/1', 'b/2']
    };

    const topic = TopicPersistenceMapper.toEntity(persistenceObj);

    expect(topic).to.be.instanceOf(Topic);
    expect(topic.id).to.equal('t/123');
    expect(topic.name).to.equal('Test Topic');
    expect(topic.description).to.equal('Desc');
    expect(topic.bookmarkIds).to.deep.equal(['b/1', 'b/2']);
  });
});
