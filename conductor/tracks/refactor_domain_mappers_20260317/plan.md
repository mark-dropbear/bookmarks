# Implementation Plan: Refactor Domain Entities and Introduce Data Mapping Layer

## Phase 1: Domain Entities & DTOs
- [x] Task: Refactor Domain Entities [469c497]
    - [x] Remove `toJSON`, `fromJSON`, and JSON-LD specific fields from `src/domain/entities/Bookmark.js`.
    - [x] Remove `toJSON`, `fromJSON`, and JSON-LD specific fields from `src/domain/entities/Topic.js`.
- [x] Task: Define Data Transfer Objects (DTOs) [b10df6b]
    - [x] Create `src/domain/types/index.js` (or similar) to define `BookmarkDTO` and `TopicDTO` via JSDoc.
- [~] Task: Conductor - User Manual Verification 'Phase 1: Domain Entities & DTOs' (Protocol in workflow.md)

## Phase 2: Mappers
- [ ] Task: Implement Persistence Mappers
    - [ ] Create `src/core/mappers/BookmarkPersistenceMapper.js`.
    - [ ] Create `src/core/mappers/TopicPersistenceMapper.js`.
    - [ ] Write unit tests for Persistence Mappers.
- [ ] Task: Implement Serialization Mappers
    - [ ] Create `src/core/mappers/BookmarkJsonLdMapper.js`.
    - [ ] Create `src/core/mappers/TopicJsonLdMapper.js`.
    - [ ] Write unit tests for Serialization Mappers.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Mappers' (Protocol in workflow.md)

## Phase 3: Repositories & Use Cases
- [ ] Task: Update Repositories
    - [ ] Update `InMemoryBookmarkRepository` and `IndexedDBBookmarkRepository` to use Persistence Mappers internally.
    - [ ] Update `InMemoryTopicRepository` and `IndexedDBTopicRepository` to use Persistence Mappers internally.
    - [ ] Update corresponding repository tests.
- [ ] Task: Update Use Cases
    - [ ] Refactor `AddBookmarkUseCase`, `UpdateBookmarkUseCase`, `DeleteBookmarkUseCase`, and `GetBookmarksUseCase` to accept/return DTOs and map to Entities internally.
    - [ ] Update corresponding use case tests.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Repositories & Use Cases' (Protocol in workflow.md)

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