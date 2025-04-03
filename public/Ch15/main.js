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
const animationContainer = document.getElementById('animation-container');
const controlsContent = document.getElementById('controls-content');
const panel = document.getElementById('panel');
const togglePanelBtn = document.getElementById('toggle-panel');
const verseExplanationHeader = document.getElementById('verse-explanation-header');
const verseContent = document.getElementById('verse-content');
const animationControlsHeader = document.getElementById('animation-controls-header');
const verseNavigationContainer = document.getElementById('verse-navigation');

// Initialize the application
function init() {
    // Create verse navigation buttons
    createVerseNavigation();
    
    // Setup event listeners
    setupEventListeners();
    
    // Set initial verse (either from URL or default to 1)
    const urlParams = new URLSearchParams(window.location.search);
    const initialVerse = urlParams.get('verse') || '1';
    
    // Load initial verse
    loadVerse(parseInt(initialVerse));
    
    // Set default panel states based on screen size
    setDefaultPanelStates();
}

// Create verse navigation buttons
function createVerseNavigation() {
    verseData.forEach(verse => {
        const button = document.createElement('button');
        button.classList.add('verse-button');
        button.dataset.verseId = verse.id;
        button.textContent = `${verse.id}`;
        button.title = verse.title;
        
        button.addEventListener('click', () => {
            loadVerse(verse.id);
            
            // Update URL without reloading page
            const url = new URL(window.location);
            url.searchParams.set('verse', verse.id);
            window.history.pushState({}, '', url);
        });
        
        verseNavigationContainer.appendChild(button);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Toggle panel
    togglePanelBtn.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
    });
    
    // Toggle verse explanation section
    verseExplanationHeader.addEventListener('click', () => {
        verseExplanationHeader.classList.toggle('collapsed');
        if (verseExplanationHeader.classList.contains('collapsed')) {
            verseContent.style.display = 'none';
        } else {
            verseContent.style.display = 'block';
        }
    });
    
    // Toggle animation controls section
    animationControlsHeader.addEventListener('click', () => {
        animationControlsHeader.classList.toggle('collapsed');
        if (animationControlsHeader.classList.contains('collapsed')) {
            controlsContent.style.display = 'none';
        } else {
            controlsContent.style.display = 'block';
        }
    });
    
    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const verseId = parseInt(urlParams.get('verse') || '1');
        
        if (verseId !== currentVerseId) {
            loadVerse(verseId);
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', debounce(() => {
        setDefaultPanelStates();
        
        if (currentVerseId) {
            // Reload current verse to adjust for new dimensions
            loadVerse(currentVerseId);
        }
    }, 250));
}

// Set default panel states based on screen size
function setDefaultPanelStates() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile defaults
        verseExplanationHeader.classList.add('collapsed');
        verseContent.style.display = 'none';
        
        animationControlsHeader.classList.add('collapsed');
        controlsContent.style.display = 'none';
    } else {
        // Desktop defaults
        verseExplanationHeader.classList.remove('collapsed');
        verseContent.style.display = 'block';
        
        animationControlsHeader.classList.add('collapsed');
        controlsContent.style.display = 'none';
    }
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
    
    // Update active verse in navigation
    document.querySelectorAll('.verse-button').forEach(button => {
        if (parseInt(button.dataset.verseId) === verseId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
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

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);