import { expect } from '@esm-bundle/chai';
import { IndexedDBTopicRepository } from './IndexedDBTopicRepository.js';
import { Topic } from '../../domain/entities/Topic.js';
import { NotFoundError } from '../../core/errors/AppErrors.js';
import { openIndexedDB } from '../infrastructure/IndexedDBConnection.js';
import { upgradeDatabase } from '../infrastructure/IndexedDBSchema.js';

describe('IndexedDBTopicRepository', () => {
  const TEST_DB_NAME = 'topics-repo-test-db';
  let repository;
  let db;

  beforeEach(async () => {
    db = await openIndexedDB(TEST_DB_NAME, 1, { upgrade: upgradeDatabase });
    repository = new IndexedDBTopicRepository(db);
  });

  afterEach(async () => {
    db.close();
    await new Promise((resolve, reject) => {
      const req = window.indexedDB.deleteDatabase(TEST_DB_NAME);
      req.onsuccess = resolve;
      req.onerror = reject;
    });
  });

  it('should add and retrieve all topics', async () => {
    const topic1 = new Topic({ name: 'Topic 1' });
    const topic2 = new Topic({ name: 'Topic 2' });

    await repository.add(topic1);
    await repository.add(topic2);

    const all = await repository.getAll();
    expect(all).to.have.lengthOf(2);
    
    // Sort by name for consistent comparison
    all.sort((a, b) => a.name.localeCompare(b.name));
    
    expect(all[0]).to.deep.equal(topic1);
    expect(all[1]).to.deep.equal(topic2);
  });

  it('should retrieve a topic by ID', async () => {
    const topic = new Topic({ id: 't/123', name: 'Test' });
    await repository.add(topic);

    const retrieved = await repository.getById('t/123');
    expect(retrieved).to.deep.equal(topic);
  });

  it('should retrieve a topic by name', async () => {
    const topic = new Topic({ name: 'Unique Name' });
    await repository.add(topic);

    const retrieved = await repository.getByName('Unique Name');
    expect(retrieved).to.deep.equal(topic);
  });

  it('should throw NotFoundError if topic is not found by name', async () => {
    try {
      await repository.getByName('Non-existent');
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });

  it('should delete a topic by ID', async () => {
    const topic = new Topic({ id: 't/delete-me', name: 'Delete Me' });
    await repository.add(topic);

    await repository.delete('t/delete-me');
    
    try {
      await repository.getById('t/delete-me');
      expect.fail('Should have thrown NotFoundError');
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });
});
