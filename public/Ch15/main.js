import { config, verseData } from './config.js';
import { initVerse1, cleanupVerse1 } from './animations/verse1.js';
import { initVerse2, cleanupVerse2 } from './animations/verse2.js';
import { initVerse3, cleanupVerse3 } from './animations/verse3.js';
import { initVerse4, cleanupVerse4 } from './animations/verse4.js';
import { initVerse5, cleanupVerse5 } from './animations/verse5.js';
import { initVerse6, cleanupVerse6 } from './animations/verse6.js';
import { initVerse7, cleanupVerse7 } from './animations/verse7.js';
import { initVerse8, cleanupVerse8 } from './animations/verse8.js';
import { initVerse9, cleanupVerse9 } from './animations/verse9.js';
import { initVerse10, cleanupVerse10 } from './animations/verse10.js';
import { initVerse11, cleanupVerse11 } from './animations/verse11.js';

// Current active animation state
let currentVerseId = null;
let currentCleanupFunction = null;

// DOM elements
const verseSelector = document.getElementById('verse-selector');
const togglePanelBtn = document.getElementById('toggle-panel');
const toggleControlsBtn = document.getElementById('toggle-controls');
const animationContainer = document.getElementById('animation-container');
const controlsContent = document.getElementById('controls-content');
const textPanelSide = document.getElementById('text-panel-side');

// Initialize the application
function init() {
    setupEventListeners();
    
    // Set initial verse (either from URL or default to 1)
    const urlParams = new URLSearchParams(window.location.search);
    const initialVerse = urlParams.get('verse') || '1';
    verseSelector.value = initialVerse;
    
    // Load initial verse
    loadVerse(parseInt(initialVerse));
}

// Setup event listeners
function setupEventListeners() {
    // Verse selection change
    verseSelector.addEventListener('change', (e) => {
        const verseId = parseInt(e.target.value);
        loadVerse(verseId);
        
        // Update URL without reloading page
        const url = new URL(window.location);
        url.searchParams.set('verse', verseId);
        window.history.pushState({}, '', url);
    });
    
    // Toggle text panel
    togglePanelBtn.addEventListener('click', () => {
        document.body.classList.toggle('text-panel-hidden');
    });
    
    // Toggle control panel
    toggleControlsBtn.addEventListener('click', () => {
        document.body.classList.toggle('control-panel-visible');
    });
    
    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const verseId = parseInt(urlParams.get('verse') || '1');
        
        if (verseId !== currentVerseId) {
            verseSelector.value = verseId;
            loadVerse(verseId);
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', debounce(() => {
        if (currentVerseId) {
            // Reload current verse to adjust for new dimensions
            loadVerse(currentVerseId);
        }
    }, 250));
    
    // Add swipe gesture for mobile - text panel
    let touchStartX = 0;
    let touchStartY = 0;
    
    textPanelSide.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    textPanelSide.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Horizontal swipe detection for desktop
        if (window.innerWidth > 768 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50) {
            if (deltaX < 0) {
                // Swipe left - hide panel
                document.body.classList.add('text-panel-hidden');
            } else {
                // Swipe right - show panel
                document.body.classList.remove('text-panel-hidden');
            }
        }
        
        // Vertical swipe detection for mobile
        if (window.innerWidth <= 768 && Math.abs(deltaY) > 50 && Math.abs(deltaX) < 50) {
            if (deltaY < 0) {
                // Swipe up - hide panel
                document.body.classList.add('text-panel-hidden');
            } else {
                // Swipe down - show panel
                document.body.classList.remove('text-panel-hidden');
            }
        }
    }, false);
}

// Debounce function to prevent excessive resize handling
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Load a specific verse
function loadVerse(verseId) {
    // First check if we need to create verse animations that don't exist yet
    if (verseId === 10 && typeof initVerse10 === 'undefined') {
        initVerse10 = createPlaceholderAnimation;
        cleanupVerse10 = () => {};
    }
    
    if (verseId === 11 && typeof initVerse11 === 'undefined') {
        initVerse11 = createPlaceholderAnimation;
        cleanupVerse11 = () => {};
    }
    
    // Clean up previous animation if exists
    if (currentCleanupFunction) {
        currentCleanupFunction();
        currentCleanupFunction = null;
    }
    
    // Clear containers
    animationContainer.innerHTML = '';
    controlsContent.innerHTML = '';
    
    // Update verse data display
    updateVerseContent(verseId);
    
    // Initialize new animation
    currentVerseId = verseId;
    
    // Call the appropriate initialization function based on verse ID
    try {
        switch(verseId) {
            case 1:
                currentCleanupFunction = initVerse1(animationContainer, controlsContent, config.verse1);
                break;
            case 2:
                currentCleanupFunction = initVerse2(animationContainer, controlsContent, config.verse2);
                break;
            case 3:
                currentCleanupFunction = initVerse3(animationContainer, controlsContent, config.verse3);
                break;
            case 4:
                currentCleanupFunction = initVerse4(animationContainer, controlsContent, config.verse4);
                break;
            case 5:
                currentCleanupFunction = initVerse5(animationContainer, controlsContent, config.verse5);
                break;
            case 6:
                currentCleanupFunction = initVerse6(animationContainer, controlsContent, config.verse6);
                break;
            case 7:
                currentCleanupFunction = initVerse7(animationContainer, controlsContent, config.verse7);
                break;
            case 8:
                currentCleanupFunction = initVerse8(animationContainer, controlsContent, config.verse8);
                break;
            case 9:
                currentCleanupFunction = initVerse9(animationContainer, controlsContent, config.verse9);
                break;
            case 10:
                currentCleanupFunction = initVerse10(animationContainer, controlsContent, config.verse10);
                break;
            case 11:
                currentCleanupFunction = initVerse11(animationContainer, controlsContent, config.verse11);
                break;
            default:
                console.error(`No animation defined for verse ${verseId}`);
                createPlaceholderAnimation(animationContainer, controlsContent);
        }
    } catch (err) {
        console.error(`Error initializing verse ${verseId}:`, err);
        createPlaceholderAnimation(animationContainer, controlsContent);
    }
}

// Placeholder animation for verses without implementations
function createPlaceholderAnimation(container, controlsContainer) {
    const placeholderDiv = document.createElement('div');
    placeholderDiv.className = 'placeholder-animation';
    placeholderDiv.style.width = '100%';
    placeholderDiv.style.height = '100%';
    placeholderDiv.style.display = 'flex';
    placeholderDiv.style.alignItems = 'center';
    placeholderDiv.style.justifyContent = 'center';
    placeholderDiv.style.backgroundColor = '#1a1a1a';
    placeholderDiv.style.color = 'white';
    placeholderDiv.style.fontSize = '1.5rem';
    placeholderDiv.style.textAlign = 'center';
    placeholderDiv.innerHTML = `
        <div>
            <p>Animation coming soon</p>
            <p style="font-size: 0.9rem; margin-top: 1rem; color: #aaa;">This verse's interactive animation is being developed.</p>
        </div>
    `;
    
    container.appendChild(placeholderDiv);
    
    controlsContainer.innerHTML = `
        <h3>Animation Controls</h3>
        <p style="margin-top: 1rem; color: #aaa;">Controls for this animation will be available soon.</p>
    `;
    
    return function cleanup() {
        container.removeChild(placeholderDiv);
    };
}

// Update verse content in the text panel
function updateVerseContent(verseId) {
    const verse = verseData.find(v => v.id === verseId);
    
    if (!verse) {
        console.error(`Verse ${verseId} not found in data`);
        return;
    }
    
    document.getElementById('verse-title').textContent = verse.title;
    document.getElementById('original-verse').textContent = verse.originalVerse;
    document.getElementById('madhyamaka-concept').textContent = verse.madhyamakaConcept;
    document.getElementById('quantum-parallel').textContent = verse.quantumParallel;
    document.getElementById('accessible-explanation').textContent = verse.accessibleExplanation;
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);