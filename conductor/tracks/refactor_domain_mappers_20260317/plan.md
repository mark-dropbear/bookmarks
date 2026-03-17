# Implementation Plan: Refactor Domain Entities and Introduce Data Mapping Layer

## Phase 1: Domain Entities & DTOs [checkpoint: 1749e58]
- [x] Task: Refactor Domain Entities [469c497]
    - [x] Remove `toJSON`, `fromJSON`, and JSON-LD specific fields from `src/domain/entities/Bookmark.js`.
    - [x] Remove `toJSON`, `fromJSON`, and JSON-LD specific fields from `src/domain/entities/Topic.js`.
- [x] Task: Define Data Transfer Objects (DTOs) [b10df6b]
    - [x] Create `src/domain/types/index.js` (or similar) to define `BookmarkDTO` and `TopicDTO` via JSDoc.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Domain Entities & DTOs' (Protocol in workflow.md) [1749e58]

## Phase 2: Mappers [checkpoint: 602fc4d]
- [x] Task: Implement Persistence Mappers [70e257e]
    - [x] Create `src/core/mappers/BookmarkPersistenceMapper.js`.
    - [x] Create `src/core/mappers/TopicPersistenceMapper.js`.
    - [x] Write unit tests for Persistence Mappers.
- [x] Task: Implement Serialization Mappers [56934e8]
    - [x] Create `src/core/mappers/BookmarkJsonLdMapper.js`.
    - [x] Create `src/core/mappers/TopicJsonLdMapper.js`.
    - [x] Write unit tests for Serialization Mappers.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Mappers' (Protocol in workflow.md) [602fc4d]

## Phase 3: Repositories & Use Cases
- [x] Task: Update Repositories [868329a]
    - [x] Update `InMemoryBookmarkRepository` and `IndexedDBBookmarkRepository` to use Persistence Mappers internally.
    - [x] Update `InMemoryTopicRepository` and `IndexedDBTopicRepository` to use Persistence Mappers internally.
    - [x] Update corresponding repository tests.
- [x] Task: Update Use Cases [e7552aa]
    - [x] Refactor `AddBookmarkUseCase`, `UpdateBookmarkUseCase`, `DeleteBookmarkUseCase`, and `GetBookmarksUseCase` to accept/return DTOs and map to Entities internally.
    - [x] Update corresponding use case tests.
- [~] Task: Conductor - User Manual Verification 'Phase 3: Repositories & Use Cases' (Protocol in workflow.md)

## Phase 4: UI Refactoring
- [ ] Task: Update UI Components and Controllers
    - [ ] Update `BookmarkList`, `AddBookmarkForm`, `EditBookmarkDialog`, and `BookmarkDashboard` to consume and produce DTOs exclusively.
    - [ ] Update `BookmarksController` to handle DTOs.
    - [ ] Fix any failing UI tests.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI Refactoring' (Protocol in workflow.md)

## Phase 5: Final Verification & Quality Gate
- [ ] Task: Execute Full Test Suite
    - [ ] Run `npm test` and ensure all tests pass.
- [ ] Task: Verify Code Quality
    - [ ] Run `npm run lint`.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Verification & Quality Gate' (Protocol in workflow.md)