import { expect } from '@esm-bundle/chai';
import { openIndexedDB } from './IndexedDBConnection.js';
import { upgradeDatabase } from './IndexedDBSchema.js';

describe('IndexedDBConnection', () => {
  const TEST_DB_NAME = 'bookmarks-test-db';

  afterEach(async () => {
    // Cleanup database after each test
    const dbs = await window.indexedDB.databases();
    if (dbs.find(db => db.name === TEST_DB_NAME)) {
      await new Promise((resolve, reject) => {
        const req = window.indexedDB.deleteDatabase(TEST_DB_NAME);
        req.onsuccess = resolve;
        req.onerror = reject;
      });
    }
  });

  it('should open the database', async () => {
    const db = await openIndexedDB(TEST_DB_NAME, 1);
    expect(db).to.exist;
    expect(db.name).to.equal(TEST_DB_NAME);
    expect(db.version).to.equal(1);
    db.close();
  });

  it('should create object stores and indexes on upgrade using schema', async () => {
    const db = await openIndexedDB(TEST_DB_NAME, 1, {
      upgrade: upgradeDatabase
    });

    const storeNames = Array.from(db.objectStoreNames);
    expect(storeNames).to.contain('bookmarks');
    expect(storeNames).to.contain('topics');

    const tx = db.transaction(['bookmarks', 'topics'], 'readonly');
    const bookmarkStore = tx.objectStore('bookmarks');
    const topicStore = tx.objectStore('topics');

    expect(Array.from(bookmarkStore.indexNames)).to.contain('url');
    expect(Array.from(topicStore.indexNames)).to.contain('name');

    db.close();
  });
});
