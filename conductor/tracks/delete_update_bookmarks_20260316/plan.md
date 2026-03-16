# Implementation Plan: Delete and Update Bookmarks

## Phase 1: Domain & Data Layer (CRUD Extensions) [checkpoint: 35b3738]
- [x] Task: Extend Repositories (abc3592, 32336e3)
    - [x] Write failing tests for `delete` and `update` in `InMemoryBookmarkRepository.test.js`. (abc3592)
    - [x] Implement `delete(id)` and `update(bookmark)` in `InMemoryBookmarkRepository.js`. (abc3592)
    - [x] Add `delete` to `TopicRepository` and `InMemoryTopicRepository`. (32336e3)
- [x] Task: Implement Delete Use Case (000bb3b, 32336e3)
    - [x] Create `src/domain/usecases/DeleteBookmarkUseCase.js`. (000bb3b)
    - [x] Write failing tests in `src/domain/usecases/DeleteBookmarkUseCase.test.js`. (000bb3b, 32336e3)
    - [x] Implement `execute(id)` logic in `DeleteBookmarkUseCase.js`. (000bb3b, 32336e3)
    - [x] Ensure that deleting a bookmark removes its ID from all associated `Topic` entities (cleaning up `subjectOf`). (000bb3b)
    - [x] Implement orphaned topic deletion. (32336e3)
- [x] Task: Implement Update Use Case (25fdaab)
    - [x] Create `src/domain/usecases/UpdateBookmarkUseCase.js`. (25fdaab)
    - [x] Write failing tests in `src/domain/usecases/UpdateBookmarkUseCase.test.js`. (25fdaab)
    - [x] Implement `execute(data)` logic in `UpdateBookmarkUseCase.js`. (25fdaab)
    - [x] Integrate favicon re-discovery and topic synchronization logic if URL changes. (25fdaab)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Domain & Data Layer' (Protocol in workflow.md) (35b3738)

## Phase 2: UI Implementation (Actions & Feedback)
- [x] Task: Add Actions to Bookmark Item (26ed4d1)
    - [x] Import and integrate Material 3 icon buttons in `src/presentation/components/BookmarkItem.js`. (26ed4d1)
    - [x] Add `delete` and `edit` buttons to the item UI. (26ed4d1)
- [~] Task: Implementation Confirmation Dialog
    - [ ] Implement a reusable Material 3 dialog component or use `md-dialog` directly for deletion confirmation.
    - [ ] Connect the delete button to the confirmation dialog and then to the `DeleteBookmarkUseCase`.
- [ ] Task: Create Edit Bookmark Dialog
    - [ ] Implement `src/presentation/components/EditBookmarkDialog.js`.
    - [ ] Pre-populate the form with current bookmark data.
    - [ ] Connect the form submission to the `UpdateBookmarkUseCase`.
- [ ] Task: UI Feedback with Snackbars
    - [ ] Implement a simple Snackbar provider or use `md-snackbar` if available.
    - [ ] Show success notifications after successful deletion and update operations.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Implementation' (Protocol in workflow.md)
