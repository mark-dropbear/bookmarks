# Specification: Refactor Domain Entities and Introduce Data Mapping Layer

## Overview
Decouple the core domain entities from specific serialization formats (like JSON-LD) and storage schemas (like IndexedDB) by introducing a dedicated Data Mapping layer and strict Data Transfer Objects (DTOs). This ensures a clean architectural boundary between the UI, domain, and external data representations.

## Functional Requirements
- **Pure Domain Entities:** Refactor `Bookmark.js` and `Topic.js` to remove all JSON-LD specific properties (`@id`, `@type`) and serialization methods (`toJSON`, `fromJSON`). They should only contain domain logic and properties (`id`, `name`, `url`, etc.).
- **Strict DTOs:** Define JSDoc type definitions (e.g., `BookmarkDTO`, `TopicDTO`) representing plain JavaScript objects to act as the strict data contract between the Presentation (UI) layer and the Use Cases.
- **Dedicated Mappers Directory:** Create a new directory `src/core/mappers` (or similar) to house all mapping logic.
- **Persistence Mappers:** Implement mappers to translate between pure Domain Entities and a clean, flat object format suitable for IndexedDB and InMemory storage schemas.
- **Serialization Mappers:** Implement mappers to translate between pure Domain Entities and the external JSON-LD format.
- **Use Case Refactoring:** Update all Use Cases to act as the translation boundary:
    - Receive DTOs from the UI, convert to Entities using mappers (or directly if simple), and pass to Repositories.
    - Receive Entities from Repositories, convert to DTOs using mappers (or directly), and return to the UI.
- **UI Refactoring:** Update all Lit components and controllers to consume and produce DTOs exclusively, removing any direct imports or usage of Domain Entity classes.

## Non-Functional Requirements
- **Clean Architecture:** Strictly enforce the dependency rule: UI -> Use Cases -> Entities, and Infrastructure -> Entities.
- **Test Coverage:** Maintain >80% code coverage. All new mappers must have dedicated unit tests.

## Acceptance Criteria
- [ ] Domain entities (`Bookmark`, `Topic`) have no references to JSON-LD (`@id`, `@context`, `@type`).
- [ ] UI components render and function correctly using only DTOs.
- [ ] Data is successfully saved to and retrieved from IndexedDB using the new Persistence Mappers.
- [ ] The application passes all automated tests.

## Out of Scope
- Implementing the RDF-JS library (this refactor prepares the codebase for it).
- Data migrations from previous versions (assuming a clean slate).