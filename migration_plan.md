# Migration Plan: Apply Ch5 Structure to All Chapters

**Objective:** Migrate all relevant chapter directories under `public/` (excluding `Ch5` and `Ch26`) to use the file structure, styling, and JS logic pattern established in `public/Ch5/`. Source data (verses, animation config, animation logic) will be pulled from the corresponding chapter directory within `public/backup/`.

**Assumptions:**
*   Source data for chapter `X` is located in `public/backup/X`.
*   Backup is handled externally; this plan does not include backup steps.
*   User approval is required after each chapter migration before proceeding to the next.

## Phase 1: Pre-Audit (Refined Checks & Reporting)

1.  **Objective:** Verify source data in `public/backup/` and categorize chapters based on their readiness for *automated* vs. *manual* migration steps.
2.  **Script:** `scripts/pre_audit_migration.js` (Modify).
3.  **Functionality:**
    *   Identify target chapters in `public/`.
    *   For each `targetDirName`:
        *   Check `sourceDir = public/backup/{targetDirName}` exists.
        *   Check `config.js` exists and contains `export const verses`.
        *   Check if *any* `.js` file (excluding `config.js`) exists in `sourceDir`.
        *   If `.js` files exist, check if *at least one* contains `export function create`.
    *   **Enhanced Reporting:** In the `migration_audit.md` "Details" column, list the names of the JS files found (e.g., "Found JS: scripts.js", "Found JS: verse1.js, verse2.js", "Found JS: animations.js, main.js").
    *   **Categorization:** Remains the same ('Ready', 'Config Issue', 'JS Missing', 'Animation Func Issue', 'Missing Source Dir'). A chapter with `verseN.js` files containing the correct export will still be marked 'Ready'.
4.  **Execution & Review:** Run the script and present the audit report.

## Phase 2: Migration (Tiered Approach with JS Concatenation)

1.  **Objective:** Migrate chapters based on audit status, handling different JS source structures, using automation where possible and flagging for manual intervention where needed.
2.  **Script:** `scripts/migrate_chapter.js` (Modify).
3.  **Functionality Changes:**
    *   **Step 6 (Create `animations.js`):** The script will find *all* `.js` files (except `config.js`) in the `sourceDir` and concatenate their cleaned content into the target `animations.js`. This handles the `verseN.js` case.
    *   **Step 7 (Create `app.js`):** The `loadAnimation` switch statement generation will *assume* that the necessary functions (e.g., `createVerse1Animation`, `createVerse2Animation`, etc., or the pattern from Ch26 like `createSuperpositionAnimation`) are correctly exported within the *combined* `animations.js`. The `getAnimationFunctionName` helper will generate these expected names based on the verse number. **Verification after migration is crucial here.**
4.  **Execution Loop (Chapter-by-Chapter with Approval):**
    *   Process chapters marked **`Ready`** first.
        *   Run `node scripts/migrate_chapter.js {chapterName} ready`.
        *   Script performs migration steps (clean, copy/generate files, combine JS).
        *   Ask for user verification.
    *   Process chapters marked **`JS Missing`** next.
        *   Run `node scripts/migrate_chapter.js {chapterName} js-missing`.
        *   Script sets up structure (HTML, CSS, Config) but creates *empty* `animations.js` and `app.js` with comments indicating manual work needed.
        *   Ask for user verification (structure only).
    *   Chapters marked **`Config Issue`** or **`Missing Source Dir`** will be skipped by the script, requiring manual data preparation in `public/backup/`.
    *   If verification fails at any step, stop and report the issue.

## Workflow Diagram

```mermaid
graph TD
    A[Start] --> B(Phase 1: Run Refined Pre-Audit Script);
    B --> C{Generate/Review Audit Report (Categorized)};
    C --> D{Process 'Ready' Chapters?};
    D -- Yes --> E{Select Next 'Ready' Chapter};
    E --> F(Run `migrate_chapter.js {chapterName} ready`);
    F --> G{Ask User to Verify};
    G -- Approved --> H{More 'Ready' Chapters?};
    H -- Yes --> E;
    H -- No --> J{Process 'JS Missing' Chapters?};
    G -- Issues Found --> K{Stop & Report Issue};

    J -- Yes --> L{Select Next 'JS Missing' Chapter};
    L --> M(Run `migrate_chapter.js {chapterName} js-missing`);
    M --> N{Ask User to Verify (Structure Only)};
    N -- Approved --> O{More 'JS Missing' Chapters?};
    O -- Yes --> L;
    O -- No --> P[Review Remaining Issues (Config/Missing Source)];
    N -- Issues Found --> K;

    D -- No --> J;
    J -- No --> P;

    P --> Q[End / Manual Intervention];
    K --> Q;