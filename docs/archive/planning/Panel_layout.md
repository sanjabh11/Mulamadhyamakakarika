Part 1-
I. General Panel Layout & Appearance:

Location & Background: A panel is fixed to the left side. It has a dark, semi-transparent background (like a blurred dark blue/purple).
Text & Accent Colors: Most text inside the panel is light-colored (like off-white) for readability. A distinct accent color (like a medium purple/blue) is used for headings, button borders/backgrounds, and highlights.
Width & Collapsing:
The panel has a standard expanded width (around 300-320 pixels).
It can be collapsed to a very narrow width (around 40 pixels) using a toggle button.
The transition between expanded and collapsed states is smooth (animated).
Scrolling: If the content inside the panel is taller than the screen, the panel content area should be vertically scrollable. The scrollbar should be styled subtly using the accent color.

II. Panel Toggle Button (Side Edge):

Location: Sticks to the right edge of the panel, vertically centered.
Appearance: Has a background matching the accent color. Displays an arrow icon (◀ when expanded, ▶ when collapsed).
Functionality: Clicking this button toggles the panel between its expanded and collapsed widths smoothly. The arrow icon flips 180 degrees upon click.
III. Panel Content Sections (Inside the Panel):

Chapter Title:
Position: Topmost item within the panel content.
Appearance: Clearly the main title, larger font size (e.g., ~1.3 times standard text), uses the accent color, centered text.
Verse Navigation:
Layout: A grid or row of buttons below the title and above the Verse Explanation section. Buttons wrap to the next line if needed.
Appearance: Buttons have a border matching the accent color and light text. The button for the currently active verse has a solid background matching the accent color and bolder text.
Functionality: Allows users to select different verses, with each button showing the verse number. Clicking a button loads the corresponding verse content and animation.
Verse Explanation Section (Collapsible):
Header: Displays the text "Verse Explanation". Uses the accent color. Acts as a clickable button. Includes a toggle indicator icon (e.g., ▼ when expanded, ► when collapsed) on the right.
Functionality: Clicking the header smoothly expands or collapses the content area below it.
Content Area (when expanded): Contains the detailed explanations for the selected verse.
Verse Text: Displayed first, possibly italicized, maybe in a subtly highlighted box. Standard text size.
Sub-Sections (e.g., Madhyamaka, Quantum, Explanation): Each has a small header in the accent color, followed by the paragraph text in the standard light color and small text size.
Animation Controls Section (Collapsible):
Header: Displays the text "Animation Controls". Uses the accent color. Acts as a clickable button. Includes a toggle indicator icon (e.g., ▼ when expanded, ► when collapsed) on the right.
Functionality: Clicking the header smoothly expands or collapses the content area below it.
Content Area (when expanded): Contains the interactive controls (sliders, buttons) specific to the current verse's animation (populated by original chapter JS).
Control Labels: Small text size.
Buttons/Sliders: Styled consistently with the panel theme (e.g., using accent color).
Animation controls should be properly populated and functional for each verse, allowing users to interact with specific elements of the animation.
IV. Default States & Responsiveness:

Desktop Default: Panel starts expanded. "Verse Explanation" section starts expanded. "Animation Controls" section starts collapsed.
Mobile Default (Screen width < ~768px): Panel starts expanded but overlays the canvas. Both "Verse Explanation" and "Animation Controls" sections start collapsed. Font sizes for titles and text are slightly reduced.

Part 2-
Do check home button, chapter number and verse number on each page if not there. check  "Deeper Dive" Q&A Feature as the right page panel. Include collapsible buttons with toggle facility (↔) on this panels for mobile responsiveness . Also check the “Home” button on the top is linked to the home page url, if not there pls include. Check UI Layout & Functionality: Adapt the HTML and CSS for each chapter to establish a consistent three-column layout (Left: Explanations, Middle: Animation, Right: Q&A). If not, please correct the same.

Check both the left and right side panels are with toggle buttons and are collapsible/uncollapsible using dedicated toggle buttons. This toggle functionality must work correctly across different screen sizes, providing an overlay effect on smaller screens and hiding/showing the panels (allowing the middle section to expand) on larger screens.

Animation Integration: Preserve the existing, chapter-specific animation logic (found in separate verseX.js files or similar). Check the animation displays correctly, is centered within the middle column, and responds appropriately to resizing. Add a standard, subtle on-screen instruction explaining common user interactions with the animation canvas (rotate, zoom, pan).

Scrollable and Zoomable Animations: All animations must be interactive with the following capabilities:
1. Rotation: Users should be able to click and drag to rotate the 3D objects/scenes
2. Zooming: Mouse wheel or pinch gestures should allow zooming in and out of the animation
3. Panning: Holding Shift while dragging should allow panning the view
4. These interactions should be implemented using OrbitControls or similar functionality
5. Animation instructions should be visible at the bottom of the animation area, explaining these interactions to users
