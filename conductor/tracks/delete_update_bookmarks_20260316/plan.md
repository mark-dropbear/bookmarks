# Implementation Plan: Delete and Update Bookmarks

## Phase 1: Domain & Data Layer (CRUD Extensions)
- [x] Task: Extend Repositories (abc3592)
    - [x] Write failing tests for `delete` and `update` in `InMemoryBookmarkRepository.test.js`. (abc3592)
    - [x] Implement `delete(id)` and `update(bookmark)` in `InMemoryBookmarkRepository.js`. (abc3592)
- [ ] Task: Implement Delete Use Case
    - [ ] Create `src/domain/usecases/DeleteBookmarkUseCase.js`.
    - [ ] Write failing tests in `src/domain/usecases/DeleteBookmarkUseCase.test.js`.
    - [ ] Implement `execute(id)` logic in `DeleteBookmarkUseCase.js`.
    - [ ] Ensure that deleting a bookmark removes its ID from all associated `Topic` entities (cleaning up `subjectOf`).
- [ ] Task: Implement Update Use Case
    - [ ] Create `src/domain/usecases/UpdateBookmarkUseCase.js`.
    - [ ] Write failing tests in `src/domain/usecases/UpdateBookmarkUseCase.test.js`.
    - [ ] Implement `execute(data)` logic in `UpdateBookmarkUseCase.js`.
    - [ ] Integrate favicon re-discovery and topic synchronization logic if URL changes.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Domain & Data Layer' (Protocol in workflow.md)

## Phase 2: UI Implementation (Actions & Feedback)
- [ ] Task: Add Actions to Bookmark Item
    - [ ] Import and integrate Material 3 icon buttons in `src/presentation/components/BookmarkItem.js`.
    - [ ] Add `delete` and `edit` buttons to the item UI.
- [ ] Task: Implementation Confirmation Dialog
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
