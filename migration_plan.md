# Migration Plan for Mulamadhyamakakarika Repository Refactoring

## Version 2.1 - Integrated Migration Strategy

This document outlines the comprehensive migration plan to transition from the current decentralized structure to a more modular, centralized approach with shared components and standardized chapter implementations. This plan incorporates detailed testing, asset management, rollback procedures, and per-chapter User Acceptance Testing (UAT).

**Guiding Principles:**

*   **Modularity:** Centralize common code and assets.
*   **Consistency:** Apply Chapter 27's styling rules (layout, fonts, etc.) while allowing chapter-specific color palettes via `config.js` and CSS variables.
*   **Safety:** Implement robust testing, backups, and rollback mechanisms.
*   **User Validation:** Require explicit user confirmation (UAT) after each chapter migration before proceeding.
*   **User Control:** Allow the user to select the next chapter for migration.

## Progress Tracking (High-Level Phases)

| Phase                                       | Status     | Notes                                                                 |
|---------------------------------------------|------------|-----------------------------------------------------------------------|
| ⬜ **Phase 1: Setup**                       | Pending    | Audit, Testing Infra, Asset Management, Templates (Steps 1-7 below) |
| ⬜ **Phase 2: Iterative Chapter Migration** | Pending    | Migrate chapters one by one with UAT (Steps 8-11 below)             |
| ⬜ **Phase 3: Finalization**                | Pending    | Entry Point, Final Tests, Optimization, Docs (Steps 12-15 below)    |

*(Detailed status tracking for steps 1-15 will occur during implementation)*

## Detailed Plan Steps

*(Based on the user-provided V2.0 plan)*

### Phase 1: Setup

**1. Create Shared Directory Structure** ✅ *(Assumed partially complete, verify/finalize)*
    *   `public/common/`
    *   `public/chapters/`
    *   `public/assets/` (with subdirs: `3d_models`, `images`, `fonts`, `audio`)

**2. Extract Common Code** ✅ *(Assumed partially complete, verify/finalize)*
    *   `public/common/base.js`: Core Three.js setup, `BaseAnimation` class.
    *   `public/common/styles.css`: Shared CSS (layout, typography, base UI styles using CSS variables for theming).
    *   `public/common/config.js`: Shared configuration (e.g., default settings).
    *   `public/common/ui.js`: Shared UI components/logic.

**3. Refactor Chapter 27 as Prototype** ✅ *(Assumed complete based on provided files, verify)*
    *   Ensure `public/chapters/ch27/` fully adheres to the modular structure and serves as the definitive prototype.

**4. Create Template for New Chapters** ✅ *(Verify/Create)*
    *   Create `public/chapters/_template/` containing skeleton files (`index.html`, `chapter.js`, `config.js`, `animations.js`, `styles.css`) based on the Ch27 prototype.

**5. Pre-Migration Audit**
    *   **Goal:** Document specifics for *each* chapter before migration.
    *   **Checklist per Chapter:**
        *   Content Analysis (Verse data, formatting, language).
        *   Animation Inventory (Unique animations, dependencies, effects, performance concerns).
        *   UI Elements (Custom components, interactions, accessibility).
        *   Assets (Models, textures, audio, dependencies).
        *   Performance Baseline (FPS, memory, load times, known bugs).
        *   Create chapter-specific migration checklist.
    *   **Backup:** Implement pre-migration backup system (see Rollback Strategy).

**6. Setup Testing Infrastructure**
    *   **Goal:** Create tools for automated validation.
    *   **Implement Scripts:** (Place in a suitable directory like `tests/` or `scripts/`)
        *   `animation-tester.js`: Tests animation class initialization, rendering, disposal.
        *   `performance-tester.js`: Measures FPS and memory usage.
        *   `migration-logger.js`: Logs info, warnings, errors, success messages during migration.
        *   `chapter-validator.js`: Orchestrates validation using logger, animation tester, performance tester.
    *   **Workflow:** Define pre- and post-migration testing procedures.

**7. Asset Management System**
    *   **Goal:** Organize, version, and optimize assets.
    *   **Structure:** Implement `public/assets/` structure with `shared/` and `[chapter-id]/` subdirs.
    *   **Manifest:** Create `public/assets/manifest.json` detailing asset paths, versions, metadata.
    *   **Loader:** Implement `asset-loader.js` to load assets based on the manifest, potentially preloading for chapters.
    *   **Optimization:** Optimize models (e.g., to glb), textures (e.g., to webp), audio.

### Phase 2: Iterative Chapter Migration (with UAT)

**Process for Each Chapter (e.g., starting with Ch26):**

**8. Select Chapter:**
    *   Ask user: "Which chapter would you like to migrate next?" (User selected Ch26 first).

**9. Pre-migration Steps:**
    *   Run pre-migration tests (using `ChapterValidator`) to establish baseline performance/behavior.
    *   Create backup of original chapter files using the backup system.
    *   Consult the Pre-Migration Audit checklist for this chapter.

**10. Migration:**
    *   Create new directory `public/chapters/ChX/` from the `_template`.
    *   Migrate verse data and chapter-specific `colors` to `config.js`.
    *   Refactor animations (`animations.js`) to extend `BaseAnimation`, use factory pattern, import colors from `./config.js`.
    *   Refactor main script (`chapter.js`) to use shared components (`base.js`, `ui.js`), import config/animations.
    *   Refactor `index.html` to use shared structure, link common CSS/JS, chapter-specific CSS/JS, update asset paths.
    *   Refactor `styles.css` to contain only chapter-specific CSS variable definitions (for colors) and minimal overrides.
    *   Move assets to `public/assets/shared/` or `public/assets/ChX/` and update paths; update `manifest.json`.

**11. Post-migration Testing & Validation:**
    *   Run post-migration tests using `ChapterValidator`.
    *   Check browser console for errors during runtime.
    *   Manually verify UI functionality and visual appearance (layout, fonts, interactions).
    *   Compare behavior and appearance against the original chapter version (or screenshots/recordings).
    *   Generate validation report using `MigrationLogger`.

**12. User Acceptance Testing (UAT):**
    *   Present validation report and provide access to the migrated chapter.
    *   Ask user: "Please review migrated Chapter X. Does it meet expectations? Approve proceeding?"
    *   **Do not proceed to the next chapter without explicit user approval.**

**(Repeat steps 8-12 for all remaining chapters)**

### Phase 3: Finalization

**13. Create Main Entry Point**
    *   Update or create a main navigation page (e.g., `pages/index.jsx` or `public/index.html`) linking to `/chapters/ChX/`.
    *   Ensure consistent styling and responsiveness.

**14. Final Testing and Validation**
    *   Comprehensive testing across *all* migrated chapters.
    *   Cross-browser and cross-device testing.
    *   Final performance benchmarking.
    *   Accessibility checks.

**15. Performance Optimization**
    *   Review asset loading strategies (preloading, lazy loading).
    *   Consider code splitting/bundling (if moving beyond static files later).
    *   Optimize rendering loops and memory usage based on testing.

**16. Cleanup and Documentation**
    *   Remove old chapter directories and redundant files.
    *   Update `README.md` with the new project structure and usage instructions.
    *   Add developer documentation for common components and migration process.
    *   Establish maintenance guidelines.

## Rollback Strategy

*   **Automated Backups:** Use `backup-creator.js` (or similar mechanism) to store original file contents (e.g., in localStorage or a dedicated backup folder) before migrating each chapter, tagged with a timestamp.
*   **Rollback Script:** Implement `rollback.js` (or similar) to restore files from a specific backup if critical issues arise post-migration that cannot be quickly resolved.

## Migration Guidelines

*   **Code Style:** ES6 Modules, kebab-case filenames, PascalCase classes, camelCase functions/variables, JSDoc comments, 2-space indentation.
*   **CSS Style:** Use `common/styles.css` for shared rules, chapter `styles.css` for CSS variable definitions (colors) and minimal overrides. Consider BEM naming. Use CSS variables extensively for theming.
*   **Animation Style:** Extend `BaseAnimation`, implement `dispose()`, use factory pattern, handle errors, prioritize performance.

## Troubleshooting Steps

1.  Compare problematic chapter with the working Ch27 prototype.
2.  Check browser developer console for errors.
3.  Review validation reports from `MigrationLogger`.
4.  Verify all import/export paths and module names.
5.  Ensure required HTML elements exist and have correct IDs/classes.
6.  Test individual components (animations, UI) in isolation.
7.  Utilize the rollback strategy if necessary.

## Future Improvements (Post-Migration)

*   Implement bundler (Webpack, Rollup, Vite) if transitioning to a more integrated build process.
*   Add build steps for minification and optimization.
*   Convert to TypeScript.
*   Implement Service Workers for offline capabilities.
*   Add analytics.
*   Consider full integration into the Next.js framework (dynamic routes, components).