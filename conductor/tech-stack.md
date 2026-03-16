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
- **Data Format:** RDF/JSON-LD for interoperability and portability.

## Development & Build Tools
- **Local Server:** [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) for a modern, fast development experience.
- **Dependency Management:** Import Maps via [JSPM CLI](https://jspm.org/docs/cli/) for seamless external dependency management without a heavy bundler, using `es-module-shims` for browser support.
- **Architecture:** Clean Architecture pattern for long-term maintainability.
