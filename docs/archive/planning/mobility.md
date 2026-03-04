# Panel Collapsibility Implementation Guide

## Version 1.0

This document outlines the implementation of collapsible side panels for the Madhyamaka Interactive Verses chapters.

## Overview

The implementation provides fully collapsible left and right panels with smooth transitions and mobile responsiveness, while preserving the 3D animations in the center canvas.

### Key Features

- Full panel collapsibility for both left and right panels
- Smooth transitions with proper canvas resizing
- Mobile-responsive design
- Preserved 3D animations and interactions
- Toggle buttons that move with panels
- Proper state management

## Implementation Details

### 1. Collapsed Panel Navigation

To implement a collapsed sidebar that still shows verse navigation buttons (as seen in Chapter 12), follow these guidelines:

#### CSS for Collapsed Panel Navigation

```css
/* Root Variables */
:root {
    --panel-width: 320px;
    --panel-collapsed-width: 60px; /* Width for collapsed state */
}

/* Panel States */
.side-panel.collapsed {
    width: var(--panel-collapsed-width);
    overflow: hidden;
}

/* Verse Navigation in Collapsed State */
.verse-nav-collapsed {
    display: none; /* Hidden by default in expanded state */
}

.side-panel.collapsed .verse-nav-collapsed {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 10px 5px;
    margin-top: 60px; /* Space for chapter title */
    height: calc(100vh - 80px); /* Allow scrolling for many verses */
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-color) transparent;
}

.side-panel.collapsed .verse-nav-collapsed::-webkit-scrollbar {
    width: 4px;
}

.side-panel.collapsed .verse-nav-collapsed::-webkit-scrollbar-thumb {
    background-color: var(--accent-color);
    border-radius: 4px;
}

.side-panel.collapsed .verse-nav-collapsed .verse-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 0.9rem;
}

/* Hide regular content in collapsed state */
.side-panel.collapsed .panel-content {
    opacity: 0;
    pointer-events: none;
}

/* Show chapter info in collapsed state */
.side-panel.collapsed .chapter-info {
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    height: auto;
}
```

#### HTML Structure

```html
<div id="left-panel" class="side-panel">
    <button id="panel-toggle" class="panel-toggle">◀</button>

    <!-- Regular panel content (hidden when collapsed) -->
    <div class="panel-content">
        <h1>Chapter Title</h1>
        <div class="verse-navigation">
            <!-- Regular verse buttons -->
        </div>
        <!-- Other panel content -->
    </div>

    <!-- Collapsed state navigation (shown only when collapsed) -->
    <div class="verse-nav-collapsed">
        <div class="chapter-info">Chapter X</div>
        <!-- Verse buttons for collapsed state -->
    </div>
</div>
```

#### JavaScript Implementation

```javascript
function setupCollapsedNavigation() {
    const leftPanel = document.getElementById('left-panel');
    const panelToggle = document.getElementById('panel-toggle');
    const verseNavCollapsed = document.createElement('div');
    verseNavCollapsed.className = 'verse-nav-collapsed';

    // Add chapter info
    const chapterInfo = document.createElement('div');
    chapterInfo.className = 'chapter-info';
    chapterInfo.textContent = 'Chapter X'; // Replace X with actual chapter number
    verseNavCollapsed.appendChild(chapterInfo);

    // Create verse buttons for collapsed state
    verses.forEach((verse, index) => {
        const button = document.createElement('button');
        button.className = 'verse-button';
        if (index === currentVerseIndex) button.classList.add('active');
        button.textContent = index + 1;

        button.addEventListener('click', () => {
            currentVerseIndex = index;
            updateVerseButtons(); // Update both regular and collapsed buttons
            loadVerse(index);
        });

        verseNavCollapsed.appendChild(button);
    });

    // Add to panel
    leftPanel.appendChild(verseNavCollapsed);

    // Toggle panel state
    panelToggle.addEventListener('click', () => {
        leftPanel.classList.toggle('collapsed');
    });

    // Update function to handle both sets of buttons
    function updateVerseButtons() {
        const allButtons = document.querySelectorAll('.verse-button');
        allButtons.forEach((button, index) => {
            if (index % verses.length === currentVerseIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
}
```

#### Benefits and Implementation Considerations

**Benefits of Collapsed Navigation:**

1. **Improved User Experience:** Users can navigate between verses without repeatedly expanding and collapsing the panel
2. **Maximized Screen Space:** More space for the animation while maintaining navigation functionality
3. **Consistent Navigation:** Provides a consistent way to navigate throughout the experience
4. **Mobile-Friendly:** Works well on smaller screens where space is limited
5. **Visual Hierarchy:** Maintains chapter context even in collapsed state

**Implementation Considerations:**

1. **Button Size:** Ensure collapsed state buttons are large enough for touch interaction (40px minimum)
2. **Active State:** Clearly indicate the current verse in both expanded and collapsed states
3. **Performance:** Create collapsed navigation elements only once during initialization
4. **Accessibility:** Maintain proper focus management and keyboard navigation
5. **Responsive Design:** Test on various screen sizes to ensure proper layout

**Troubleshooting Panel Toggle Issues:**

If the panel toggle button is not working properly, consider these solutions:

1. **Z-Index Issues:** Ensure the toggle button has a higher z-index than the panel (z-index: 1000 or higher)
2. **Position the Toggle Button Outside the Panel:** Place the toggle button in a fixed position outside the panel to avoid any CSS conflicts
3. **Use Inline JavaScript:** For maximum reliability, consider using an inline onclick handler
4. **Toggle Button Positioning:** Ensure the toggle button remains accessible when the panel is collapsed by adjusting its position

#### Toggle Button Positioning Fix

A common issue is that the toggle button becomes inaccessible after collapsing the panel. The most reliable solution is to use a nested button structure and proper CSS positioning.

##### HTML Structure (Recommended)

```html
<!-- Left panel with toggle button -->
<div class="sidebar-panel left-panel">
    <div class="panel-toggle">
        <button id="panel-toggle-left" aria-label="Toggle Left Panel">◀</button>
    </div>

    <div class="panel-content">
        <!-- Panel content here -->
    </div>
</div>
```

##### CSS Implementation (Recommended)

```css
/* Panel toggle container */
.panel-toggle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1001; /* High z-index to ensure visibility */
}

/* Left panel toggle positioning */
.left-panel .panel-toggle {
    right: -15px;
    transition: right 0.3s ease;
}

/* Right panel toggle positioning */
.right-panel .panel-toggle {
    left: -15px;
    transition: left 0.3s ease;
}

/* Toggle button styling */
.panel-toggle button {
    width: 30px;
    height: 50px;
    background: #4a54df;
    color: white;
    border: 2px solid white; /* Border for visibility */
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Shadow for depth */
    cursor: pointer;
    transition: transform 0.3s ease;
}

/* Button border radius for left/right panels */
.left-panel .panel-toggle button {
    border-radius: 0 5px 5px 0;
}

.right-panel .panel-toggle button {
    border-radius: 5px 0 0 5px;
}

/* Collapsed state positioning */
.left-panel.collapsed .panel-toggle {
    right: 10px; /* Move button inside the collapsed panel */
}

.right-panel.collapsed .panel-toggle {
    left: 10px; /* Move button inside the collapsed panel */
}

/* Rotate button icon in collapsed state */
.sidebar-panel.collapsed .panel-toggle button {
    transform: rotate(180deg);
}
```

This approach ensures that the toggle button moves with the panel and remains accessible in both expanded and collapsed states. The nested structure provides better control over positioning and styling.

##### JavaScript Implementation (Recommended)

```javascript
// Initialize panel toggle functionality
function initPanelToggle() {
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const leftToggleButton = document.getElementById('panel-toggle-left');
    const rightToggleButton = document.getElementById('panel-toggle-right');

    // Ensure toggle buttons exist before adding event listeners
    if (leftToggleButton && leftPanel) {
        // Toggle left panel expanded/collapsed state
        leftToggleButton.addEventListener('click', () => {
            leftPanel.classList.toggle('collapsed');
            console.log('Left panel toggled');
        });
    } else {
        console.error('Left panel toggle button or panel not found');
    }

    if (rightToggleButton && rightPanel) {
        // Toggle right panel expanded/collapsed state
        rightToggleButton.addEventListener('click', () => {
            rightPanel.classList.toggle('collapsed');
            console.log('Right panel toggled');
        });
    } else {
        console.error('Right panel toggle button or panel not found');
    }
}

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', initPanelToggle);
```

This JavaScript implementation includes error checking to ensure the toggle buttons and panels exist before adding event listeners. It also logs messages to the console for debugging purposes.

```html
<!-- Fixed panel toggle button -->
<button id="fixed-panel-toggle" style="position: fixed; left: 320px; top: 50%; transform: translateY(-50%); z-index: 1000; background-color: #7f7fff; color: white; border: none; width: 20px; height: 50px; border-radius: 0 5px 5px 0; cursor: pointer; transition: left 0.3s ease;" onclick="toggleLeftPanel()">
    ◀
</button>

<script>
    function toggleLeftPanel() {
        const leftPanel = document.getElementById('left-panel');
        const toggleButton = document.getElementById('fixed-panel-toggle');

        leftPanel.classList.toggle('collapsed');

        if (leftPanel.classList.contains('collapsed')) {
            toggleButton.style.left = '60px';
            toggleButton.innerHTML = '▶';
        } else {
            toggleButton.style.left = '320px';
            toggleButton.innerHTML = '◀';
        }
    }
</script>
```

**Example Implementations:**

1. **Chapter 17 (2:3):** The best reference implementation with a nested button structure that ensures the toggle button is always accessible. This chapter uses the recommended HTML structure and CSS approach described above.

2. **Chapter 12:** Demonstrates the collapsed navigation pattern effectively with a narrow sidebar that shows verse numbers in a vertical column when collapsed, while still providing the full content when expanded.

3. **Chapter 13:** Implements the pattern with a fixed toggle button outside the panel for improved reliability. The toggle button moves with the panel and changes its arrow direction based on the panel state.

4. **Chapter 14, 15, 16:** Implement collapsed navigation with scrollable verse buttons, ensuring all verses remain accessible even in collapsed state.

5. **Chapter 7 (1:3), 7 (2:3), 7 (3:3):** Implement proper toggle button positioning with the nested button structure to ensure the button remains accessible in both expanded and collapsed states.

6. **Chapter 17 (1:3), 17 (3:3):** Implement the nested button structure with proper z-index and positioning to ensure panels can be both collapsed and expanded.

7. **Chapter 18:** Implements proper home button linking to the root URL ('/') and has functional panel toggle buttons for both left and right panels.

8. **Chapter 19:** Implements collapsible panels with toggle buttons and auto-rotating animations by default. The home button correctly links to the root URL ('/').

**Reference Implementation:**

A complete working example is available at `public/examples/collapsed-navigation-example.html`. This example includes all the HTML, CSS, and JavaScript needed to implement the collapsed navigation pattern and can be used as a reference when implementing this feature in other chapters.
```

### 2. Animation Centering, Scrollability, and Auto-Rotation

To ensure animations are properly centered, scrollable, zoomable, and auto-rotating by default across all chapters, follow these standardized approaches:

#### CSS for Animation Container

```css
/* Animation container */
.animation-area, .canvas-container {
    flex-grow: 1;
    position: relative;
    z-index: 5;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

/* Canvas element */
#animation-canvas, canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: block;
    z-index: 10;
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
}
```

#### JavaScript for Renderer Setup

```javascript
// Renderer setup
renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('animation-canvas'),
    antialias: true,
    alpha: true
});
renderer.setSize(canvasWidth, canvasHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Center the renderer output
const canvas = renderer.domElement;
canvas.style.position = 'absolute';
canvas.style.left = '50%';
canvas.style.top = '50%';
canvas.style.transform = 'translate(-50%, -50%)';
canvas.style.maxWidth = '100%';
canvas.style.maxHeight = '100%';
```

#### OrbitControls Configuration

```javascript
// Create orbit controls
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
controls.enablePan = true;
controls.panSpeed = 1.0;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.enableRotate = true;
controls.rotateSpeed = 1.0;
controls.autoRotate = true; // Enable auto-rotation by default
controls.autoRotateSpeed = 1.0; // Set auto-rotation speed

// Make sure controls are active
controls.enabled = true;
controls.update();
```

#### Auto-Rotation Implementation

To ensure animations auto-rotate by default, add this code to your verse change function:

```javascript
// Change active verse
function changeVerse(verseNum) {
    // Hide current animation if any
    if (currentAnimation) {
        currentAnimation.hide();
    }

    // Show new animation
    currentVerse = verseNum;
    currentAnimation = animations[verseNum];
    currentAnimation.show();
    currentAnimation.reset();

    // Start animation by default (auto-rotate)
    if (currentAnimation.toggleAnimation) {
        currentAnimation.toggleAnimation(true);

        // Update UI buttons if they exist
        const startButtons = [
            document.getElementById('animation-start'),
            document.getElementById('rotation-start')
        ];

        const stopButtons = [
            document.getElementById('animation-stop'),
            document.getElementById('rotation-stop')
        ];

        // Update button states
        startButtons.forEach(btn => {
            if (btn) btn.classList.add('active');
        });

        stopButtons.forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
    }

    // Update verse content and controls
    // ...
}
```

#### Animation Instructions

Ensure that animation instructions are visible to users by adding this HTML and CSS:

```html
<div id="animation-instructions">
    <p>Drag to rotate • Scroll to zoom • Shift+drag to pan</p>
</div>
```

```css
#animation-instructions {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(20, 20, 40, 0.7);
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.85rem;
    opacity: 0.8;
    backdrop-filter: blur(5px);
    z-index: 200;
    text-align: center;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

#animation-instructions:hover {
    opacity: 1;
}
```

#### Window Resize Handler

```javascript
function onWindowResize() {
    // Get container dimensions
    const canvasWidth = container.clientWidth;
    const canvasHeight = container.clientHeight;

    // Update camera aspect ratio
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    // Update renderer and composer sizes
    renderer.setSize(canvasWidth, canvasHeight);
    composer.setSize(canvasWidth, canvasHeight);

    // Ensure the canvas remains centered
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    // Adjust for aspect ratio to prevent stretching
    if (canvasWidth > canvasHeight) {
        // Landscape orientation
        const aspectRatio = canvasWidth / canvasHeight;
        if (aspectRatio > 2) {
            // Very wide - constrain width
            canvas.style.width = '80%';
            canvas.style.height = 'auto';
        }
    } else {
        // Portrait orientation
        const aspectRatio = canvasHeight / canvasWidth;
        if (aspectRatio > 2) {
            // Very tall - constrain height
            canvas.style.height = '80%';
            canvas.style.width = 'auto';
        }
    }
}
```

### 2. CSS Structure

```css
/* Root Variables */
:root {
    --panel-width: 320px;
    --panel-background: rgba(20, 20, 35, 0.9);
    --panel-border: rgba(138, 92, 245, 0.25);
    --panel-shadow: rgba(0, 0, 0, 0.3);
}

/* Panel Base Structure */
.side-panel {
    position: relative;
    width: var(--panel-width);
    height: 100vh;
    background-color: var(--panel-background);
    backdrop-filter: blur(8px);
    z-index: 10;
    display: flex;
    flex-direction: column;
    overflow: visible;
    transition: transform 0.5s ease, width 0.5s ease;
}

/* Panel States */
.side-panel.collapsed {
    width: 60px; /* Width for collapsed state with verse navigation */
    overflow: hidden;
}

/* Toggle Buttons */
.panel-toggle {
    position: fixed;
    width: 30px;
    height: 50px;
    background-color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
    z-index: 11;
    transition: transform 0.5s ease;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
    .side-panel {
        position: fixed;
        top: 0;
    }

    #left-panel.collapsed {
        transform: translateX(-100%);
    }

    #right-panel.collapsed {
        transform: translateX(100%);
    }
}
```

### 2. JavaScript Implementation

```javascript
// Event Listeners Setup
function setupEventListeners() {
    // Panel toggle functionality
    leftPanelToggle.addEventListener('click', () => {
        leftPanel.classList.toggle('collapsed');
        container.classList.toggle('left-panel-collapsed');

        // Ensure proper canvas resize after animation
        setTimeout(() => {
            onWindowResize();
        }, 500);
    });

    rightPanelToggle.addEventListener('click', () => {
        rightPanel.classList.toggle('collapsed');
        container.classList.toggle('right-panel-collapsed');

        // Ensure proper canvas resize after animation
        setTimeout(() => {
            onWindowResize();
        }, 500);
    });
}

// Canvas Resizing
function onWindowResize() {
    // Get the visible width for the canvas
    const leftPanelWidth = leftPanel.classList.contains('collapsed') ? 0 : leftPanel.offsetWidth;
    const rightPanelWidth = rightPanel.classList.contains('collapsed') ? 0 : rightPanel.offsetWidth;
    const canvasWidth = window.innerWidth - leftPanelWidth - rightPanelWidth;

    // Update camera aspect ratio
    camera.aspect = canvasWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer and composer sizes
    renderer.setSize(canvasWidth, window.innerHeight);
    composer.setSize(canvasWidth, window.innerHeight);
}
```

### 3. HTML Structure

```html
<div id="container">
    <!-- Left Panel -->
    <div id="left-panel" class="side-panel">
        <div class="panel-content">
            <!-- Panel content here -->
        </div>
    </div>

    <!-- Canvas Container -->
    <div id="canvas-container">
        <canvas id="canvas"></canvas>
    </div>

    <!-- Right Panel -->
    <div id="right-panel" class="side-panel">
        <div class="panel-content">
            <!-- Panel content here -->
        </div>
    </div>

    <!-- Toggle Buttons -->
    <div class="panel-toggle left-toggle">
        <span class="arrow">◀</span>
    </div>
    <div class="panel-toggle right-toggle">
        <span class="arrow">▶</span>
    </div>
</div>
```

## Implementation Steps

1. **Setup Base Structure**
   - Add panel containers in HTML
   - Add toggle buttons
   - Set up basic CSS variables

2. **Style Panels**
   - Define panel dimensions and appearance
   - Add transitions for smooth animations
   - Style toggle buttons

3. **Add Panel Logic**
   - Implement toggle functionality
   - Add state management
   - Handle canvas resizing

4. **Mobile Optimization**
   - Add media queries
   - Adjust panel behavior for mobile
   - Optimize transitions

5. **Animation Preservation**
   - Update canvas dimensions on panel toggle
   - Maintain aspect ratio
   - Preserve 3D scene rendering

## Best Practices

1. **Performance**
   - Use transform for animations when possible
   - Debounce resize events
   - Use hardware acceleration

2. **Accessibility**
   - Maintain keyboard navigation
   - Add ARIA labels
   - Ensure proper contrast

3. **Mobile UX**
   - Test on various screen sizes
   - Ensure smooth touch interactions
   - Prevent content overflow

## Troubleshooting

Common issues and solutions:

1. **Panel Flickering**
   - Check z-index values
   - Verify transition timing
   - Ensure proper stacking context

2. **Canvas Distortion**
   - Verify aspect ratio calculations
   - Check resize event timing
   - Confirm renderer dimensions

3. **Mobile Issues**
   - Test transform positioning
   - Verify touch events
   - Check viewport settings

## Testing Checklist

- [ ] Panel collapse/expand animations
- [ ] Canvas resizing
- [ ] Mobile responsiveness
- [ ] Touch interactions
- [ ] Animation preservation
- [ ] State management
- [ ] Cross-browser compatibility

## Version History

- 1.0: Initial implementation
  - Basic panel collapsibility
  - Mobile responsiveness
  - Animation preservation

## Multi-Part Chapter Navigation

For chapters that are split into multiple parts, implement a consistent navigation system that allows users to move between parts directly from the chapter interface.

### Implementation Details

#### HTML Structure

```html
<div class="panel-header">
    <a href="/" class="home-button" title="Home">🏠</a>
    <h2 class="chapter-title">Chapter X (Part Y) - Chapter Title</h2>
    <div class="part-nav">
        <a href="/ChX (1:Z)/index.html" class="part-link">Part 1</a>
        <a href="/ChX (2:Z)/index.html" class="part-link current">Part 2</a>
        <!-- Add more parts as needed -->
    </div>
</div>
```

#### CSS Styling

```css
/* Panel header with part navigation */
.panel-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--panel-border);
}

.chapter-title {
    font-size: 1.2rem;
    color: var(--accent-color);
    text-align: center;
    flex: 1;
}

.part-nav {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 8px;
}

.part-link {
    color: var(--secondary-color);
    text-decoration: none;
    font-size: 0.9rem;
    padding: 4px 10px;
    border: 1px solid var(--secondary-color);
    border-radius: 4px;
    transition: all 0.2s ease;
    margin: 0 5px;
}

.part-link:hover {
    background-color: rgba(76, 201, 240, 0.2);
    transform: translateY(-2px);
}

.part-link.current {
    background-color: var(--secondary-color);
    color: var(--bg-color);
    font-weight: bold;
}
```

### Implementation Guidelines

1. **Consistent Naming**: Use the format "Chapter X (Part Y)" in the title
2. **Clear Indication**: Highlight the current part with a different style
3. **Direct Links**: Provide direct links to all parts of the chapter
4. **Home Button**: Always include a home button that links to the root URL ('/')
5. **Responsive Design**: Ensure the part navigation works well on all screen sizes

### Multi-Part Chapters

The following chapters have multiple parts and should implement this navigation pattern:

- **Chapter 2**: 2 parts
- **Chapter 7**: 3 parts
- **Chapter 10**: 2 parts
- **Chapter 17**: 3 parts
- **Chapter 20**: 2 parts
- **Chapter 24**: 3 parts
- **Chapter 25**: 2 parts
- **Chapter 27**: 3 parts

## Future Improvements

1. **Performance**
   - Optimize transition animations
   - Add lazy loading for panel content
   - Improve mobile performance

2. **Features**
   - Add panel resize functionality
   - Implement panel snap positions
   - Add more customization options

3. **Accessibility**
   - Enhance keyboard navigation
   - Add screen reader support
   - Improve focus management