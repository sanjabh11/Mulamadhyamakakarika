# Plan for Updating Chapter Text Content

This document outlines the plan for updating the explanatory text associated with the verses of Nāgārjuna's Mūlamadhyamakakārikā within this project. It will be updated as we process each chapter to reflect any variations in file structure or data mapping.

## Standard UI/Format Adjustments (Learnings)

*(This section documents standard adjustments identified during the process, to be applied consistently to future chapters where applicable.)*

**Based on Chapter 1 & 2 Implementation (2025-04-06):**

1.  **Dynamic Chapter Title:** The main title element in the *left* panel HTML (identified by `id="mainTitle"` or similar) should be dynamically updated via JavaScript (e.g., in `initUI()`) to reflect the current chapter number and title (e.g., "Madhyamaka Chapter X - [Chapter Name]").
2.  **Verse Number Display:** The verse number should be displayed prominently alongside the verse text within the designated verse text element in the *left* panel (e.g., `#verseText`). Use formatting like `<strong>${verse.number}.</strong> ${verse.originalVerse}`.
3.  **HTML Rendering in Text:** When displaying text content (like `originalVerse`, questions, answers) that may contain HTML tags (e.g., `<br>`), use the `.innerHTML` property in JavaScript, not `.textContent`, to ensure the tags are rendered correctly.
4.  **Removal of Unused Data Display:** If a data field is removed from the source data structure (e.g., the `rationale` field was removed from `verseData`), ensure the corresponding JavaScript code attempting to display that field in the UI is also removed to prevent errors or display issues (like "Rationale: undefined").
5.  **Avoid Redundant Display:** If detailed information (like verse title and text) is already presented clearly in one part of the UI (e.g., a side panel), avoid duplicating it in another prominent area (e.g., a main content overlay like `#verseOverlay`). Remove the code responsible for populating the redundant display.
6.  **Three-Column Layout & "Deeper Dive" Q&A Panel:**
    *   **Layout:** Implement or adapt to a three-column layout (Left Panel: Explanations, Middle: Animation, Right Panel: Q&A).
        *   Use a main container (`.app-container` or similar) with `display: flex`.
        *   Left (`#sidePanel` or `#control-panel`) and Right (`#qaPanel`) panels should have fixed widths (e.g., `var(--panel-width)`) and `flex-shrink: 0`.
        *   Middle (`#mainContent` or `#scene-container`) uses `flex: 1` to fill remaining space.
    *   **Q&A Panel (`#qaPanel`):**
        *   **Purpose:** Provide users with common questions and answers related to each verse for further exploration.
        *   **Data:** Each verse object in the data source (e.g., `verseData` or `verses` in `main.js` or `config.js`) should include an array (e.g., `deeperDive` or `questions`) containing objects, each with a `question` and `answer` string property.
        *   **UI Structure:** Create or adapt a separate right-side panel (`#qaPanel`) styled similarly to the left panel. Include a header (`<h2>Deeper Dive Q&A</h2>`) and a content area (`#qaContent` or `#qa-container`).
        *   **Interaction:**
            *   Populate Q&A container dynamically using JavaScript based on the current verse's Q&A data.
            *   Each question (`.question` or `.qa-question`) should be clickable. Clicking toggles the visibility of its corresponding answer element (`.answer` or `.qa-answer`) directly below it (e.g., by toggling a class like `.expanded` on a parent `.qa-item` and using CSS `max-height`, or by directly toggling `display`).
    *   **Panel Toggles (Functional on All Screen Sizes):**
        *   **HTML:** Ensure toggle buttons (`#toggleSidePanel`/`#left-panel-toggle`, `#toggleQaPanel`/`#right-panel-toggle`) exist, preferably *outside* their respective panels but inside the main container.
        *   **CSS:** Adapt CSS to handle panel visibility/positioning based on a class toggled on the panel itself (e.g., `.collapsed`, `.hidden`) or on the main container (e.g., `.left-panel-open`). Ensure toggle buttons are positioned correctly in both open and closed states for large and small screens, using appropriate selectors and media queries.
        *   **JS:** Add/adapt event listeners in `initUI()` (or equivalent) to toggle the relevant class (`.collapsed`, `.hidden`, or container class) when buttons are clicked. Ensure JS correctly handles the initial open/closed state for different screen sizes if CSS doesn't fully control the default.
    *   **Styling:** Use CSS (`styles.css`) to define the layout, panel widths, shadows, Q&A formatting, and responsive behavior. Adapt existing styles where possible.
7.  **Animation Centering & Responsiveness:**
    *   **CSS:** Apply `display: flex`, `justify-content: center`, `align-items: center` to the middle content container (`#mainContent` or `#scene-container`). Adapt the animation container (`#animationContainer` or similar) styles (e.g., `position: relative`, `max-width`, `max-height`).
    *   **JS:** Modify the Three.js renderer setup (`initSceneSetup` or equivalent) and the window resize handler (`onWindowResize`) to use the dimensions of the middle content container (`getBoundingClientRect()`) for setting camera aspect ratio and renderer size.
8.  **Animation Interaction Instructions:**
    *   **HTML:** Add a dedicated element (e.g., `<div id="animationInstructions">...</div>` or `#scene-instructions`) within the middle content container.
    *   **Content:** Include clear text explaining interaction methods.
    *   **CSS:** Style the instruction element for appropriate positioning, appearance, and `pointer-events: none;`.

---

## Chapter 1: Examination of Conditions

**Status:** Implemented & Finalized (2025-04-06)
*(Details omitted for brevity - see previous versions)*

---

## Chapter 2 (Part 1): Examination of Motion

**Status:** Implemented & Finalized (2025-04-06)
*(Details omitted for brevity - see previous versions)*

---

## Chapter 3: Examination of the Senses

**Status:** Planning

**1. Target Files:**
*   `public/Ch3/config.js` (Contains `verses` data array)
*   `public/Ch3/app.js` (Main logic, UI updates)
*   `public/Ch3/index.html` (HTML structure)
*   `public/Ch3/style.css` (Styling)
*   `public/Ch3/verseX.js` (Individual animation logic files)

**2. Codebase Analysis & Differences:**
*   **Layout:** Uses `position: absolute` for panels (`#control-panel`, `#qa-panel`), not flexbox for main layout. Middle content is `#scene-container`.
*   **Panel Toggling:** Uses `.hidden` class toggled on panels themselves. Toggle buttons (`#toggle-panel`, `#toggle-qa-panel`) are *inside* panels.
*   **Q&A Toggling:** JS toggles `.active` class on answer; CSS expects `.expanded` class on parent `.qa-item`.
*   **Data Source:** `config.js` exports `verses`. Keys: `number`, `text`, `madhyamaka`, `quantum`, `accessible`, `instructions`, `questions`.
*   **JS Structure:** Functional (`init`, `loadVerse`, etc.).
*   **Animation:** Managed by `app.js` calling `verseX.js` functions.

**3. Plan:**
*   **Keep Existing Layout/Toggle Method:** Adapt the standard features to work with the existing absolute positioning and `.hidden` class toggling mechanism, rather than forcing a flexbox layout like Ch1/Ch2.
*   **HTML:**
    *   Verify IDs match JS selectors.
    *   *(No major structural changes planned initially)*.
*   **CSS:**
    *   Ensure `.panel` styles allow visibility by default.
    *   Verify `.hidden` class correctly hides panels (using `width` transition as currently implemented).
    *   Verify toggle button positioning (`#toggle-panel`, `#toggle-qa-panel`) works with `.hidden` class.
    *   **Fix:** Change Q&A CSS to use `.qa-answer.active` selector instead of `.qa-item.expanded .answer` to match JS.
    *   Apply animation centering styles to `#scene-container` (Learning #7 CSS).
    *   Apply animation instruction styles to `#animation-instructions` (Learning #8 CSS).
    *   Review responsive styles.
*   **JavaScript (`app.js`):**
    *   Modify `setupEventListeners`: Ensure toggle listeners correctly toggle `.hidden` class on `#control-panel` and `#qa-panel`.
    *   Modify `loadVerse`:
        *   Update text content using `.innerHTML` (Ref Learning #3). Prepend verse number (Ref Learning #2). Use correct content IDs (`#verse-text-content`, etc.).
        *   Update Q&A population logic to add click listener that toggles `.active` class on the answer element (matching existing JS).
    *   Modify `onWindowResize` and scene creation (`loadVerse`) to use `#scene-container` dimensions (Ref Learning #7 JS).
*   **Data (`config.js`):**
    *   Update text content based on user-provided Chapter 3 table.
    *   Rename `questions` key to `deeperDive` for consistency (or update JS to use `questions`). Let's rename to `deeperDive`.

---

*(Future chapter plans will be added below this line)*