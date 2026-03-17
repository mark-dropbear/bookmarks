# Initial Concept

I would like to build a local first bookmark manager application. It should be designed to run in a browser, use IndexedDB for storage, offer an option to serialize to RDF (I have provided an example JSON-LD file that shows the file structure and properties), It should follow a clean architecture pattern with minimal dependencies and strictly follow web standards, you may use Lit and any of its related packages for the UI, use the Material Web package for UI building blocks, Use @web/dev-server for the local server, use plain JavaScript with appropriate JSDoc comments for type hints. Use importmaps for loading external dependencies.

---

# Product Guide: Local-First Bookmark Manager

## Vision
A privacy-focused, local-first bookmark manager that empowers users with full data ownership. Built on modern web standards and a clean architecture, it provides a familiar, high-performance experience with seamless RDF/JSON-LD data portability.

## Target Audience
- **General Users:** Who want a fast and intuitive tool for managing their bookmarks.
- **Power Users & Developers:** Who value clean architecture, RDF integration, and the ability to control their own data.
- **Privacy Conscious:** Users seeking a local-first solution that avoids third-party cloud lock-in.

## Key Features
- **Local-First Storage:** Uses IndexedDB for fast, offline-capable storage directly in the browser.
- **Tagging & Search:** Efficiently organize and retrieve bookmarks using custom tags and a powerful search interface.
- **Favicon Discovery:** Automatically attempts to find and display favicons for saved bookmarks using browser-native image loading.
- **RDF Serialization:** Seamlessly import and export bookmarks using RDF/JSON-LD formats for maximum data interoperability.
- **Material 3 UI:** A modern, familiar look and feel built with Lit and Material Web components.
- **Dynamic Material 3 Theming:** Seamless support for Material 3 color schemes and typography. Includes automatic detection of OS/browser preferences for dark mode and high contrast, with a robust mechanism for manual user overrides.
- **Global Design Consistency:** Leverages modern web standards like `document.adoptedStyleSheets` to ensure a cohesive, themed experience across the entire document and all Shadow DOM components.

## Technical Goals
- **Clean Architecture:** Maintain a modular, well-tested codebase with clear separation of concerns. Rigidly enforces boundaries between business logic (Use Cases), persistence (Repositories), and rendering (Controllers/Components) using pure Domain Entities and strict Data Transfer Objects (DTOs).
- **Minimal Dependencies:** Prioritize web standards and small, focused libraries like Lit and Material Web.
- **Type Safety:** Leverage JSDoc comments for robust type hinting without a full TypeScript build step.
- **Web Platform Compatibility:** Targets [Web Platform Baseline](https://web.dev/baseline) (Widely Available) for all critical functionality. Supports progressive enhancement using newer features where appropriate, provided the core experience remains functional.
- **Data Portability:** Ensure data is easily exportable and adheres to open standards.
- **Robust Error Management:** Employs a structured application error hierarchy (`AppError` -> `DomainError`, `InfrastructureError`) for predictable error propagation and clear user feedback.
