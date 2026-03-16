# Specification: Delete and Update Bookmarks

## Overview
This track implements the ability for users to modify and remove existing bookmarks. It extends the core CRUD functionality of the application, ensuring that data can be kept up-to-date or cleaned up as needed.

## Functional Requirements
- **Delete Bookmark:**
    - Users can initiate a deletion from the bookmark list/item view.
    - A Material 3 confirmation dialog must appear before the deletion is finalized.
    - Upon confirmation, the bookmark is removed from the repository.
    - All associated bi-directional links in topics must be updated (removal of the bookmark ID from topic `subjectOf` lists).
- **Update Bookmark:**
    - Users can edit an existing bookmark via a dialog interface.
    - Fields available for editing: Title, URL, Description, and Topics.
    - **Automated URL logic:** If the URL is changed during an update, the system must automatically re-trigger favicon discovery and ensure topic links are correctly synchronized.
- **UI/UX:**
    - Use Material 3 Icon Buttons for triggering actions (e.g., `delete` and `edit` icons).
    - Use Material 3 Dialogs for both deletion confirmation and the editing form.
    - Provide success feedback using Material 3 Snackbars after a successful delete or update.

## Non-Functional Requirements
- **Data Integrity:** Ensure that deleting a bookmark does not leave "dangling" references in topic entities.
- **Responsiveness:** UI should reflect changes immediately after the repository update is complete.

## Acceptance Criteria
- [ ] User can click a delete icon, see a confirmation dialog, and remove a bookmark.
- [ ] Deleted bookmarks no longer appear in the dashboard search or list.
- [ ] User can click an edit icon, see a form pre-populated with current data, and save changes.
- [ ] Updating a bookmark's URL triggers a fresh favicon fetch and updates topic associations.
- [ ] Snackbars appear to confirm successful actions.

## Out of Scope
- Bulk deletion/updating.
- "Undo" functionality for deletion (out of scope for this phase, as only confirmation was requested).
