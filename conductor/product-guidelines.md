# Product Guidelines: Local-First Bookmark Manager

## Prose Style
- **Tone:** Professional & Concise.
- **Voice:** Clear, direct, and helpful.
- **Guidelines:** Avoid unnecessary jargon. Use active voice and focus on user benefits. Keep error messages informative but brief.

## Branding & Design
- **Theme:** Native Material 3.
- **Design Tokens:** Use standard Material 3 color palettes and typography.
- **Principles:** Prioritize consistency with established Material Design patterns. Ensure a clean, modern look and feel using Lit and Material Web components.

## UX Principles
- **Local-First Responsiveness:** All user actions (add, edit, delete, tag) should be reflected immediately in the UI, with background synchronization to IndexedDB.
- **Search-Centric:** Provide a prominent search bar that allows for quick retrieval by title, URL, and tags.
- **Progressive Enhancement:** Target [Web Platform Baseline](https://web.dev/baseline) (Widely Available) for the core experience while embracing newer web platform features as enhancements when they improve the UX for supported browsers.
- **Data Transparency:** Make it easy for users to see their data status (e.g., "Saved Locally") and provide clear paths for RDF/JSON-LD export.
- **Accessibility:** Adhere to WCAG 2.1 standards, ensuring high contrast and screen reader compatibility.
