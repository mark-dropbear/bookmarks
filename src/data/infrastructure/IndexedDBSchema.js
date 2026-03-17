export const DB_NAME = 'bookmarks-db';
export const DB_VERSION = 1;

/**
 * Handles database upgrades and schema definition.
 * @param {import('idb').IDBPDatabase<any>} db 
 * @param {number} oldVersion 
 * @param {number|null} _newVersion 
 * @param {import('idb').IDBPTransaction<any, any, "versionchange">} _transaction 
 */
export function upgradeDatabase(db, oldVersion, _newVersion, _transaction) {
  if (oldVersion < 1) {
    const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
    bookmarkStore.createIndex('url', 'url', { unique: false });

    const topicStore = db.createObjectStore('topics', { keyPath: 'id' });
    topicStore.createIndex('name', 'name', { unique: true });
  }
}
