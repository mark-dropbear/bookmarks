# Tech Stack: Local-First Bookmark Manager

## Languages & Types
- **Language:** Plain JavaScript (ESM)
- **Type Hinting:** JSDoc comments for type safety and IDE support.

## Frontend Frameworks & Libraries
- **Core UI:** [Lit](https://lit.dev/) for lightweight, standards-based web components.
- **UI Components:** [Material Web](https://github.com/material-components/material-web) (@material/web) for Material 3 building blocks.
- **Routing:** [@lit-labs/router](https://www.npmjs.com/package/@lit-labs/router) for client-side routing.
- **State Management:** [@lit/context](https://lit.dev/docs/data/context/) for dependency injection and state sharing.
- **Async Operations:** [@lit/task](https://lit.dev/docs/data/task/) for handling asynchronous data fetching and state.

## Data & Storage
- **Primary Storage:** In-memory repository (for initial development), eventually migrating to IndexedDB.
- **Repositories:** BookmarkRepository and TopicRepository interfaces defined in the domain layer.
- **Data Format:** RDF/JSON-LD for interoperability and portability.

## Development & Build Tools
- **Local Server:** [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) for a modern, fast development experience.
- **Code Quality:** [ESLint](https://eslint.org/) for JavaScript and Lit (`eslint-plugin-lit`) linting.
- **CSS Linting & Compatibility:** [@eslint/css](https://github.com/eslint/css) for CSS linting, with [Web Platform Baseline](https://web.dev/baseline) enforcement (Warn level) to identify features that may require progressive enhancement or fallback strategies.
- **Dependency Management:** Import Maps via [JSPM CLI](https://jspm.org/docs/cli/) for seamless external dependency management without a heavy bundler, using `es-module-shims` for browser support.
- **Architecture:** Clean Architecture pattern with a dedicated **Composition Root** (`main.js`) and **Dependency Registry** (`DependencyRegistry.js`) to ensure loose coupling. Employs a dedicated **Data Mapping Layer** and **DTOs** to isolate pure Domain Entities from external serialization formats (like JSON-LD) and storage schemas.
- **Reactive Controllers:** Custom controllers (e.g., BookmarksController) to encapsulate async logic and reactive state.
