# Implementation Plan: IndexedDB Persistence Layer

## Phase 1: Infrastructure & Database Setup
- [x] Task: Install the `idb` library [cf6f1df]
    - [x] Run `npm install idb` (or update package.json/importmap)
- [x] Task: Create IndexedDB connection utility [4a85579]
    - [x] Implement `src/data/infrastructure/IndexedDBConnection.js` using `idb`
    - [x] Define the database name and initial version
- [ ] Task: Define Schema & Migrations
    - [ ] Configure `bookmarks` store with an `@id` key path and indexes for `url`
    - [ ] Configure `topics` store with an `@id` key path and indexes for `name`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Database Setup' (Protocol in workflow.md)

## Phase 2: Repository Implementations
- [ ] Task: Implement `IndexedDBBookmarkRepository`
    - [ ] Create `src/data/repositories/IndexedDBBookmarkRepository.js`
    - [ ] Implement `add`, `getAll`, `getById`, `update`, `delete`, and `search`
- [ ] Task: Implement `IndexedDBTopicRepository`
    - [ ] Create `src/data/repositories/IndexedDBTopicRepository.js`
    - [ ] Implement `add`, `getAll`, `getById`, `getByName`, and `delete`
- [ ] Task: Write Tests for IndexedDB Repositories
    - [ ] Create `src/data/repositories/IndexedDBBookmarkRepository.test.js`
    - [ ] Create `src/data/repositories/IndexedDBTopicRepository.test.js`
    - [ ] Ensure tests cover CRUD operations and index-based lookups
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Repository Implementations' (Protocol in workflow.md)

## Phase 3: Integration & Production Entry Point
- [ ] Task: Create Production Entry Point
    - [ ] Implement `src/main.prod.js` mirroring `src/main.js` but using `IndexedDB` repositories
- [ ] Task: Update Build/Run Configuration
    - [ ] Update `package.json` to include a `jspm:build:prod` script (or similar) to target `src/main.prod.js`
    - [ ] Update `importmap.js` to handle the production export if necessary
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Production Entry Point' (Protocol in workflow.md)

## Phase 4: Final Verification & Quality Gate
- [ ] Task: Execute Full Test Suite
    - [ ] Run `npm test` and ensure all 66+ tests pass
- [ ] Task: Verify Baseline Compatibility
    - [ ] Run `npm run lint` and check for CSS baseline warnings related to storage APIs
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification & Quality Gate' (Protocol in workflow.md)