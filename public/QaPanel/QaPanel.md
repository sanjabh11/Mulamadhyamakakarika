# Implementation Plan: Three-Column Layout with Q&A Panel

## Version 1.0

This document outlines the implementation plan for enhancing the Madhyamaka Interactive Verses chapters with a three-column layout including a new Q&A panel, collapsible side panels, and animation improvements.

## Overview

We need to update three chapters (Ch6, Ch7 variants) to implement a consistent three-column layout with fully collapsible panels, preserving existing animations while adding new user interface elements.

## Implementation Phases

### Phase 1: Analyze Current Structure (Each Chapter)
1. Review existing HTML structure
2. Review CSS styling approach
3. Review JavaScript organization
4. Identify animation integration points

### Phase 2: HTML Structure Updates
1. Modify layout to three-column structure
   - Left panel (explanations)
   - Center area (animation)
   - Right panel (Q&A)
2. Add toggle buttons for both panels
3. Add placeholders for verse info and animation instructions
4. Add Q&A panel structure with expandable questions

### Phase 3: CSS Enhancements
1. Update container and panel styles for three-column layout
2. Implement collapsible panel mechanics
   - Desktop: Panel width reduction allowing center to expand
   - Mobile: Overlay panels with slide transitions
3. Style Q&A panel and expandable items
4. Add animation instruction styles
5. Ensure responsive behavior across screen sizes

### Phase 4: JavaScript Functionality
1. Implement panel toggling logic for both panels
2. Add canvas resizing handlers for panel state changes
3. Add Q&A interaction (question click to reveal answer)
4. Add animation instruction display
5. Modify any existing verse-switching logic to handle the new layout

### Phase 5: Cross-Browser Testing
1. Test on Chrome, Firefox, Safari
2. Test on desktop and mobile devices
3. Test panel collapse animations
4. Test Q&A interactions
5. Test animation canvas resizing

## Detailed Implementation Steps

### HTML Structure (Each Chapter)

```html
<div class="app-container">
    <!-- Left Panel -->
    <div class="side-panel left-panel" id="leftPanel">
        <div class="panel-content">
            <div id="verseInfo"><!-- Chapter X, Verse Y --></div>
            <h1>Chapter Title</h1>
            <!-- Verse navigation -->
            <!-- Verse content -->
        </div>
        <button class="panel-toggle left-toggle" id="leftPanelToggle">
            <span class="toggle-icon">↔</span>
        </button>
    </div>

    <!-- Center Animation Area -->
    <div class="canvas-container" id="canvasContainer">
        <!-- Animation canvas injected here -->
        <div id="animationInstructions" class="animation-instructions">
            <!-- Interaction instructions -->
        </div>
    </div>

    <!-- Right Panel (Q&A) -->
    <div class="side-panel right-panel" id="rightPanel">
        <button class="panel-toggle right-toggle" id="rightPanelToggle">
            <span class="toggle-icon">↔</span>
        </button>
        <div class="panel-content">
            <h2>Deeper Dive Q&A</h2>
            <div id="qaList">
                <!-- Placeholder for dynamic Q&A content -->
                <!-- Structure for each QA item:
                <div class="qa-item">
                    <div class="question">Question text?</div>
                    <div class="answer"><p>Answer text</p></div>
                </div>
                -->
            </div>
        </div>
    </div>
</div>
```

### CSS Structure

Key CSS components to implement:

```css
/* App Container */
.app-container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/* Common Panel Styles */
.side-panel {
    width: var(--panel-width);
    height: 100vh;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: var(--panel-bg);
    backdrop-filter: blur(8px);
    z-index: 10;
    overflow: hidden;
}

/* Panel Collapsed State */
.side-panel.collapsed {
    width: 0;
}

/* Toggle Buttons */
.panel-toggle {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 60px;
    background-color: var(--accent-color);
    z-index: 11;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Left/Right Panel Specifics */
.left-panel { order: 1; }
.left-toggle { border-radius: 0 30px 30px 0; }

.right-panel { order: 3; }
.right-toggle { border-radius: 30px 0 0 30px; }

/* Canvas Container */
.canvas-container {
    flex: 1;
    min-width: 0;
    height: 100vh;
    position: relative;
    order: 2;
    transition: margin 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Q&A Styling */
.qa-item {
    background-color: var(--qa-bg);
    border: 1px solid var(--qa-border);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.question {
    padding: 0.8rem 1rem;
    cursor: pointer;
    font-weight: 500;
}

.answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out, padding 0.4s ease-out;
}

.qa-item.active .answer {
    max-height: 500px;
    padding: 0.8rem 1rem;
}

/* Responsive Behavior */
@media (max-width: 1024px) {
    .side-panel {
        position: fixed;
        transform: translateX(-100%); /* default off-screen */
    }
    
    .side-panel:not(.collapsed) {
        transform: translateX(0);
    }
    
    /* Different handling for left vs right panels */
    .right-panel {
        transform: translateX(100%);
    }
}
```

### JavaScript Functions

Key JavaScript components to implement:

```javascript
// DOM Elements
const leftPanel = document.getElementById('leftPanel');
const rightPanel = document.getElementById('rightPanel');
const leftPanelToggle = document.getElementById('leftPanelToggle');
const rightPanelToggle = document.getElementById('rightPanelToggle');
const appContainer = document.querySelector('.app-container');
const canvasContainer = document.getElementById('canvasContainer');
const animationInstructions = document.getElementById('animationInstructions');

// Responsive mode detection
let isMobile = window.innerWidth <= 1024;
let resizeTimeout = null;

// Panel Toggle Functions
function togglePanel(panel, side) {
    panel.classList.toggle('collapsed');
    appContainer.classList.toggle(`${side}-panel-collapsed`);
    
    // Resize canvas after transition completes
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        handleCanvasResize();
    }, 500); // Match to CSS transition time
}

// Event Listeners
function setupEventListeners() {
    // Panel toggles
    leftPanelToggle.addEventListener('click', () => togglePanel(leftPanel, 'left'));
    rightPanelToggle.addEventListener('click', () => togglePanel(rightPanel, 'right'));
    
    // Responsive adjustments
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 1024;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            // Adjust panel styles based on screen size
        }
        
        // Handle canvas resizing
        handleCanvasResize();
    });
    
    // Q&A Interaction
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const qaItem = question.closest('.qa-item');
            qaItem.classList.toggle('active');
        });
    });
}

// Canvas Resize Handler
function handleCanvasResize() {
    // Update camera aspect ratio
    // Update renderer size
    // Adjust animations as needed
}

// Animation Instructions
function updateAnimationInstructions() {
    animationInstructions.innerHTML = `
        <span>Rotate: Drag</span> | 
        <span>Zoom: Scroll</span> | 
        <span>Pan: Right-click + Drag</span>
    `;
}

// Q&A Panel Update (for future content)
function updateQAPanel(verseId) {
    const qaList = document.getElementById('qaList');
    
    // This will be a placeholder until real data is provided
    qaList.innerHTML = `
        <div class="qa-item">
            <div class="question">Example question for Verse ${verseId}?</div>
            <div class="answer"><p>Placeholder answer. Real Q&A content will be provided later.</p></div>
        </div>
        <div class="qa-item">
            <div class="question">Another example question?</div>
            <div class="answer"><p>Another placeholder answer.</p></div>
        </div>
        <div class="qa-item">
            <div class="question">Third example question?</div>
            <div class="answer"><p>Third placeholder answer.</p></div>
        </div>
    `;
    
    // Add event listeners to new questions
    const questions = qaList.querySelectorAll('.question');
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const qaItem = question.closest('.qa-item');
            qaItem.classList.toggle('active');
        });
    });
}
```

## Chapter-Specific Considerations

### Chapter 6
- Review specific animation implementation
- Ensure any control panels or interactive elements are preserved
- Adapt existing verse navigation if present

### Chapter 7 (Multiple Versions)
- Determine which version is the current production version
- Apply changes consistently across all versions
- Preserve unique animation aspects of each version

## Implementation Approach

1. Implement changes in Chapter 6 first as a template
2. Test thoroughly
3. Apply similar patterns to Chapter 7 variants, accounting for differences
4. Verify animations work correctly in all variants

## Mobile-First Testing

1. Test on small screens first (overlay panel behavior)
2. Test on medium screens (tablet behavior)
3. Test on large screens (side-by-side panel behavior)
4. Verify animations scale correctly on all screen sizes

## Browser Compatibility

Ensure functionality across:
- Chrome
- Firefox
- Safari
- Edge

## Accessibility Considerations

1. Ensure keyboard navigation works for panel toggles
2. Add appropriate ARIA roles for collapsible panels
3. Maintain sufficient color contrast for text elements

## Future Enhancements

1. Add panel state persistence (localStorage)
2. Implement smoother transitions for canvas resizing
3. Support drag-to-resize panels

## Cross-Chapter Consistency

1. Apply the same panel widths, colors, and styles across chapters
2. Use the same interaction patterns and toggle icons
3. Create a consistent user experience throughout the application 