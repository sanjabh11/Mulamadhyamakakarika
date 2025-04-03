import { verseData } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Panel elements
    const sidePanel = document.querySelector('.side-panel');
    const panelToggle = document.querySelector('.panel-toggle');
    const verseNavigation = document.getElementById('verse-navigation');
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    // Panel toggle functionality
    panelToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('collapsed');
        
        // Update toggle button icon
        if (sidePanel.classList.contains('collapsed')) {
            panelToggle.textContent = '▶';
        } else {
            panelToggle.textContent = '◀';
        }
    });
    
    // Collapsible sections functionality
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggleIcon = header.querySelector('.toggle-icon');
            
            content.classList.toggle('expanded');
            
            if (content.classList.contains('expanded')) {
                toggleIcon.textContent = '▼';
            } else {
                toggleIcon.textContent = '►';
            }
        });
    });
    
    // Initialize verse navigation buttons
    initVerseNavigation();
    
    // Initialize section states
    initSectionStates();
    
    // Sync panel verse content with main content
    syncVerseContent();
});

// Create verse navigation buttons
function initVerseNavigation() {
    const verseNavigation = document.getElementById('verse-navigation');
    
    // Clear existing content
    verseNavigation.innerHTML = '';
    
    // Create verse buttons
    for (let i = 13; i <= 24; i++) {
        const button = document.createElement('button');
        button.className = 'verse-btn';
        button.textContent = i;
        button.dataset.verse = i;
        button.addEventListener('click', () => {
            // Find window.navigateToVerse function from main.js
            if (typeof window.navigateToVerse === 'function') {
                window.navigateToVerse(parseInt(i));
            } else {
                // Fallback to direct navigation call
                navigateToVerse(parseInt(i));
            }
            
            // Update active button
            document.querySelectorAll('.verse-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
        
        // Set active class for current verse
        if (window.currentVerse === i || (!window.currentVerse && i === 13)) {
            button.classList.add('active');
        }
        
        verseNavigation.appendChild(button);
    }
}

// Initialize section states based on screen size
function initSectionStates() {
    const verseExplanationSection = document.querySelector('#verse-explanation-section .section-content');
    const animationControlsSection = document.querySelector('#animation-controls-section .section-content');
    const verseToggleIcon = document.querySelector('#verse-explanation-section .toggle-icon');
    const controlsToggleIcon = document.querySelector('#animation-controls-section .toggle-icon');
    
    // Default states
    if (window.innerWidth < 768) {
        // Mobile defaults
        verseExplanationSection.classList.remove('expanded');
        animationControlsSection.classList.remove('expanded');
        verseToggleIcon.textContent = '►';
        controlsToggleIcon.textContent = '►';
    } else {
        // Desktop defaults
        verseExplanationSection.classList.add('expanded');
        animationControlsSection.classList.remove('expanded');
        verseToggleIcon.textContent = '▼';
        controlsToggleIcon.textContent = '►';
    }
}

// Sync panel verse content with main overlay content
function syncVerseContent() {
    // Watch for changes to the main content
    const observeConfig = { childList: true, subtree: true, characterData: true };
    
    // Create an observer for each element
    const titleObserver = new MutationObserver(() => {
        if (document.getElementById('verse-title') && document.getElementById('verse-title-overlay')) {
            document.getElementById('verse-title').innerHTML = document.getElementById('verse-title-overlay').innerHTML;
        }
    });
    
    const contentObserver = new MutationObserver(() => {
        if (document.getElementById('verse-content') && document.getElementById('verse-content-overlay')) {
            document.getElementById('verse-content').innerHTML = document.getElementById('verse-content-overlay').innerHTML;
        }
    });
    
    const explanationObserver = new MutationObserver(() => {
        if (document.getElementById('verse-explanation') && document.getElementById('verse-explanation-overlay')) {
            document.getElementById('verse-explanation').innerHTML = document.getElementById('verse-explanation-overlay').innerHTML;
        }
    });
    
    // Start observing
    if (document.getElementById('verse-title-overlay')) {
        titleObserver.observe(document.getElementById('verse-title-overlay'), observeConfig);
    }
    
    if (document.getElementById('verse-content-overlay')) {
        contentObserver.observe(document.getElementById('verse-content-overlay'), observeConfig);
    }
    
    if (document.getElementById('verse-explanation-overlay')) {
        explanationObserver.observe(document.getElementById('verse-explanation-overlay'), observeConfig);
    }
}

// Update verse text content
export function updatePanelVerseContent(verse) {
    const verseInfo = verseData.find(v => v.verse === verse);
    
    if (verseInfo) {
        if (document.getElementById('verse-text')) {
            document.getElementById('verse-text').textContent = `Verse ${verse}: ${verseInfo.title}`;
        }
        
        if (document.getElementById('verse-title')) {
            document.getElementById('verse-title').textContent = verseInfo.title;
        }
        
        if (document.getElementById('verse-content')) {
            document.getElementById('verse-content').textContent = verseInfo.content;
        }
        
        if (document.getElementById('verse-explanation')) {
            document.getElementById('verse-explanation').textContent = verseInfo.explanation;
        }
    }
    
    // Update active button
    document.querySelectorAll('.verse-btn').forEach(btn => {
        if (parseInt(btn.dataset.verse) === verse) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Expose navigateToVerse to window for access from main.js
window.updatePanelVerseContent = updatePanelVerseContent;