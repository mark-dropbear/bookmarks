# Specification: IndexedDB Persistence Layer

## Overview
Implement a robust, persistent storage layer using IndexedDB to replace the temporary `InMemory` repositories in production. This will ensure that bookmarks and topics are saved locally in the user's browser and persist across sessions.

## Functional Requirements
- **Library Integration:** Use the `idb` npm package to manage IndexedDB interactions with a promise-based API.
- **Normalized Schema:**
    - Create a `bookmarks` object store.
    - Create a `topics` object store.
    - Ensure both stores support retrieval by ID and common indexes (e.g., searching by URL or name).
- **Repository Implementations:**
    - `IndexedDBBookmarkRepository`: Implement the full `BookmarkRepository` interface.
    - `IndexedDBTopicRepository`: Implement the full `TopicRepository` interface.
- **Bi-directional Consistency:** Maintain links between bookmarks and topics within the IndexedDB transactions to ensure data integrity.
- **Production Entry Point:** Create a dedicated entry point (e.g., `src/main.prod.js`) that instantiates and injects the `IndexedDB` repositories into the `DependencyRegistry`, while keeping `src/main.js` for development/in-memory use.

## Non-Functional Requirements
- **Clean Architecture:** The new repositories must strictly adhere to the domain layer's repository interfaces.
- **Robustness:** Gracefully handle IndexedDB initialization errors.
- **Performance:** Utilize IndexedDB indexes for efficient searching and retrieval.

## Acceptance Criteria
- [ ] Data added in "Production Mode" persists after a full browser refresh.
- [ ] All existing Use Cases (Add, Update, Delete, Search) function correctly with the `IndexedDB` repositories.
- [ ] The application correctly bootstraps with either `InMemory` (Dev) or `IndexedDB` (Prod) based on the entry point.
- [ ] Automated tests validate the storage and retrieval logic for both new repositories.

## Out of Scope
- Automatic data migration between `InMemory` and `IndexedDB`.
- Cloud synchronization or cross-device persistence.
- Exporting from IndexedDB directly to RDF (handled by Use Cases).