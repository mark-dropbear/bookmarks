import { openDB } from 'idb';

/**
 * Opens an IndexedDB connection with the given name and version.
 * @param {string} name - The name of the database.
 * @param {number} version - The version of the database.
 * @param {import('idb').OpenDBCallbacks<any>} [callbacks] - Optional callbacks for upgrade, etc.
 * @returns {Promise<import('idb').IDBPDatabase<any>>}
 */
export async function openIndexedDB(name, version, callbacks = {}) {
  return openDB(name, version, callbacks);
}
