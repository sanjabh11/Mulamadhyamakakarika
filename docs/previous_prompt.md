Create nice stunning INTERATCTIVE 3D animations based on the details below. Make a full page animation for each verse with text details embedded on the same page for each verse given. ENSURE keeping an explanations bar with an animation control panel on the left of the page with "Verse Explanation" and "Animation Controls" sections within the side panel collapsible for mobile responsiveness with scrollable and zoomable facility. 
┌─────────────────────────────────────────────────────────┐
│              Chapter Title & Verse Navigation           │
├─────────────────┬───────────────────┬───────────────────┤
│                 │                   │                   │
│   LEFT PANEL    │   3D ANIMATION    │   RIGHT PANEL     │
│                 │     CANVAS        │                   │
│ • Verse Text    │                   │ • Deeper Dive     │
│ • Explanation   │  Interactive 3D   │ • 5 FAQ Questions, with real life examples (2-3 lines each) │
│ • Controls      │     Scene         │ • Click to reveal │
│                 │                   │                   │
└─────────────────┴───────────────────┴───────────────────┘

Please create the question and answer panel on the right side (named as "Deeper Dive") exactly on the same line as the left panel 
2. All the question and answer with related real world examples, for every verse is shared below  please populate for each verses on the right panel created under "Deeper Dive” section
This section will initially show a link or button. Clicking it will reveal five pre-defined, common questions specific to that verses given below ﻿with the answers below ﻿along (2-3 lines) each with the real life examples given with (2-3 lines) each 
Add visual with explanations related with both quantum physics the MMK text
CODE GENERATION GUIDELINES

Structure Requirements

Single React Component: Complete, self-contained component
Clean Architecture: Separate functions for animation, UI, and data handling
Modular Design: Easy to understand and modify
Efficient Code: No unnecessary complexity or verbose explanations
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
Layout: A grid or row of buttons below the title. Buttons wrap to the next line if needed.
Appearance: Buttons have a border matching the accent color and light text. The button for the currently active verse has a solid background matching the accent color and possibly bolder text.
Functionality: Allows users to select different verses (specific action handled by original chapter JS).
Verse Explanation Section (Collapsible):
Header: Displays the text "Verse Explanation". Uses the accent color. Acts as a clickable button. Includes a toggle indicator icon (e.g., ▼ when expanded, ► when collapsed) on the right.
Functionality: Clicking the header smoothly expands or collapses the content area below it.
Content Area (when expanded): Contains the detailed explanations for the selected verse.
Verse Text: Displayed first, possibly italicized, maybe in a subtly highlighted box. Standard text size.
Sub-Sections (e.g., Madhyamaka, Quantum, Explanation): Each has a small header in the accent color, followed by the paragraph text in the standard light color and small text size.
Concept Explanation: Buddhist concept + Quantum parallel + Bridge explanation
Animation Controls Section (Collapsible) with scrollable and zoomable facility.  :
Header: Displays the text "Animation Controls". Uses the accent color. Acts as a clickable button. Includes a toggle indicator icon (e.g., ▼ when expanded, ► when collapsed) on the right.
Functionality: Clicking the header smoothly expands or collapses the content area below it.
Content Area (when expanded): Contains the interactive controls (sliders, buttons) specific to the current verse's animation (populated by original chapter JS).
Control Labels: Small text size.
Buttons/Sliders: Styled consistently with the panel theme (e.g., using accent color).
Importnat- Add visual explanations related with both quantum physics the MMK text for each animations
Visual Impact: Stunning 3D animations that wow users
collapsible Educational Clarity: Clear explanations that make complex concepts understandable. include 2-3 lines details about Visuals, interactions, symbolism, and user controls to help users understand the bridge between verse’s essence with quantum physics and 3d animation.
Smooth Functionality: Everything works reliably across devices including mobile
Ensure that each verse is unique and it should NOT be following the similar kind of animation pattern. 
Clean Code: Well-structured, readable implementation
Styling Requirements

Dark semi-transparent background
Light text with purple/blue accents
Smooth expand/collapse animations
Mobile-responsive (collapsible on small screens)
CENTER CANVAS: 3D Animation

Animation Requirements

Visual Quality: Smooth 60fps animations with professional aesthetics
Educational Focus: Every visual element represents either Buddhist or quantum concepts
Interactivity:
Click objects for explanations
Drag to rotate/manipulate
Hover for tooltips
Responsiveness: Scales properly on all screen sizes
Control Overlays

Floating help button
Fullscreen toggle
Animation progress indicator
Responsive Design

Desktop: Full three-panel layout
Tablet: Collapsible side panels
Mobile: Stacked layout with swipeable panels
IV. Default States & Responsiveness:

Desktop Default: Panel starts expanded. "Verse Explanation" section starts expanded. "Animation Controls" section starts collapsed.
Mobile Default (Screen width < ~768px): Panel starts expanded but overlays the canvas. Both "Verse Explanation" and "Animation Controls" sections start collapsed. Font sizes for titles and text are slightly reduced. ﻿ ﻿ ﻿ ﻿ ﻿ ﻿

The animation should be having gamifications and auto-rotatation with controls like 
Animation Controls
Rotation (enabled by default)
Flow/Speed
Complexity
Zoom
Colours choice (Avoid dark colors with a dark background. This at times is not visible very clearly. 