# Implementation Plan: Core Bookmarking Functionality

## Phase 1: Environment Setup [checkpoint: c335d18]
- [x] Task: Project Scaffolding (c335d18)
    - [x] Create directory structure for Clean Architecture (src/domain, src/data, src/presentation).
    - [x] Initialize `package.json` with `@web/dev-server` and JSPM CLI.
    - [x] Generate initial `importmap.json` using `jspm link` for Lit, Material Web, Router, Context, and Task.
    - [x] Configure `index.html` with `es-module-shims` and the generated import map.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Environment Setup' (Protocol in workflow.md) (c335d18)

## Phase 2: Domain & Data Layers [checkpoint: 06c3b40]
- [x] Task: Define Domain Model (17f4a79)
    - [x] Create Bookmark entity in `src/domain/entities/Bookmark.js`.
- [x] Task: Implement Data Layer (66a1eba)
    - [x] Create `InMemoryBookmarkRepository` in `src/data/repositories/InMemoryBookmarkRepository.js`.
    - [x] Implement `add`, `getAll`, and `search` methods.
- [x] Task: Implement Use Cases (7e7e513)
    - [x] Create `AddBookmarkUseCase.js` and `GetBookmarksUseCase.js` in `src/domain/usecases/`.
- [x] Task: Set Up Dependency Injection (052d549)
    - [x] Define Lit contexts in `src/presentation/context.js` (e.g., repository context or use case context).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Domain & Data Layers' (Protocol in workflow.md) (06c3b40)

## Phase 3: UI Components (Presentation Layer)
- [ ] Task: Core UI & Routing
    - [ ] Create main entry point `src/presentation/app.js`.
    - [ ] Setup routing with `@lit-labs/router` for Home (dashboard) and Add Bookmark pages.
    - [ ] Implement a basic Material 3 layout using `<md-elevated-card>` and `<md-filled-button>`.
- [ ] Task: Add Bookmark Component
    - [ ] Create `<add-bookmark-form>` using Material Web text fields.
    - [ ] Consume use cases via `@lit/context`.
- [ ] Task: Bookmark List Component
    - [ ] Create `<bookmark-list>` and `<bookmark-item>` components.
    - [ ] Fetch data using `@lit/task` and display state (loading, error, complete).
- [ ] Task: Search & Filter
    - [ ] Add an `<md-outlined-text-field>` for real-time searching.
    - [ ] Implement search logic in the presentation layer.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Components' (Protocol in workflow.md)