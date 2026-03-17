import { expect } from '@esm-bundle/chai';
import { openIndexedDB } from './IndexedDBConnection.js';

describe('IndexedDBConnection', () => {
  const DB_NAME = 'bookmarks-test-db';

  afterEach(async () => {
    // Cleanup database after each test
    const dbs = await window.indexedDB.databases();
    if (dbs.find(db => db.name === DB_NAME)) {
      await new Promise((resolve, reject) => {
        const req = window.indexedDB.deleteDatabase(DB_NAME);
        req.onsuccess = resolve;
        req.onerror = reject;
      });
    }
  });

  it('should open the database', async () => {
    const db = await openIndexedDB(DB_NAME, 1);
    expect(db).to.exist;
    expect(db.name).to.equal(DB_NAME);
    expect(db.version).to.equal(1);
    db.close();
  });
});
