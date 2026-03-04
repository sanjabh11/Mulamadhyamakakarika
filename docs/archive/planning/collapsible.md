# Collapsible Panels Implementation Plan

## Version 1.0

This document outlines the implementation plan for adding collapsible left and right panels with toggle buttons to Chapter 23 and Chapter 24 of the Mulamadhyamakakarika project, based on the successful implementation in Chapter 21.

## Overview

The goal is to add collapsible panels with dedicated toggle buttons (↔) to both Chapters 23 and 24, ensuring functionality is preserved while enhancing the user experience with collapsible side panels.

## Key Elements

1. **HTML Structure**: Update the panel structure to include toggle buttons
2. **CSS Updates**: Add styling for panels, toggle buttons, and transition effects
3. **JavaScript Implementation**: Implement toggle functionality for panels
4. **Consistency Check**: Ensure all original functionality remains intact

## Implementation Steps

### For Each Chapter (23 and 24)

1. **HTML Updates**:
   - Add panel toggle buttons to the left and right panels
   - Ensure proper classes and IDs are assigned to panels and buttons
   - Maintain the existing content and functionality

2. **CSS Updates**:
   - Add styling for panel collapsed/expanded states
   - Style toggle buttons consistently
   - Add smooth transition effects
   - Ensure mobile responsiveness

3. **JavaScript Updates**:
   - Add event listeners for toggle buttons
   - Implement panel toggle functionality
   - Update resize handling to account for panel state
   - Ensure all existing functionality remains intact

## Chapter-Specific Considerations

### Chapter 23
- Examine the existing panel structure in `index.html`
- Check for any unique functionality in `app.js`
- Preserve the Q&A panel functionality while making it collapsible

### Chapter 24 (All 3 Parts)
- Ensure consistency across all 3 parts
- Maintain navigation between parts
- Check for any part-specific functionality that needs special handling

## Implementation Approach

1. **Analysis Phase**:
   - Examine current implementation in each chapter
   - Identify differences from Chapter 21 implementation
   - Determine necessary modifications

2. **Implementation Phase**:
   - Start with Chapter 23 (1:2)
   - Apply the same changes to Chapter 24 (1:3)
   - Test after each chapter implementation
   - Apply to remaining parts systematically

3. **Testing Phase**:
   - Verify panel toggle functionality
   - Check responsiveness on different screen sizes
   - Ensure original functionality is preserved

## Code Changes

### HTML Changes
```html
<!-- Add toggle buttons to left panel -->
<div id="left-panel" class="panel">
    <button id="left-panel-toggle" class="panel-toggle">◀</button>
    <!-- Existing content -->
</div>

<!-- Add toggle buttons to right panel -->
<div id="right-panel" class="panel">
    <button id="right-panel-toggle" class="panel-toggle">▶</button>
    <!-- Existing content -->
</div>
```

### CSS Changes
```css
.panel {
    position: fixed;
    top: 0;
    height: 100%;
    width: 320px;
    transition: transform 0.3s ease;
    z-index: 10;
    /* Additional styling as needed */
}

.panel.collapsed {
    transform: translateX(-100%);
}

#right-panel.collapsed {
    transform: translateX(100%);
}

.panel-toggle {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 60px;
    transform: translateY(-50%);
    z-index: 11;
    cursor: pointer;
    border: none;
    /* Additional styling as needed */
}

#left-panel-toggle {
    right: -20px;
    border-radius: 0 5px 5px 0;
}

#right-panel-toggle {
    left: -20px;
    border-radius: 5px 0 0 5px;
}
```

### JavaScript Changes
```javascript
// Panel toggle - left panel
const leftPanel = document.getElementById('left-panel');
const leftPanelToggle = document.getElementById('left-panel-toggle');
leftPanelToggle.addEventListener('click', () => {
    leftPanel.classList.toggle('collapsed');
    leftPanelToggle.textContent = leftPanel.classList.contains('collapsed') ? '▶' : '◀';
    // Additional code to handle resize if needed
});

// Panel toggle - right panel
const rightPanel = document.getElementById('right-panel');
const rightPanelToggle = document.getElementById('right-panel-toggle');
rightPanelToggle.addEventListener('click', () => {
    rightPanel.classList.toggle('collapsed');
    rightPanelToggle.textContent = rightPanel.classList.contains('collapsed') ? '◀' : '▶';
    // Additional code to handle resize if needed
});
```

## Expected Outcomes

1. Both left and right panels should be collapsible with dedicated toggle buttons
2. All existing functionality should be preserved
3. User experience should be consistent across all chapters
4. Responsive design should work properly at all screen sizes

## Rollback Procedure

If issues are encountered, revert to the original implementation with a repository rollback or manual reversal of the changes.
