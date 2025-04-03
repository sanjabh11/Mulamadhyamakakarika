import { verses, colors, animation } from './config.js';
import { initVerse1 } from './animations/verse1.js';
import { initVerse2 } from './animations/verse2.js';
import { initVerse3 } from './animations/verse3.js';
import { initVerse4 } from './animations/verse4.js';
import { initVerse5 } from './animations/verse5.js';
import { initVerse6 } from './animations/verse6.js';
import { initVerse7 } from './animations/verse7.js';
import { initVerse8 } from './animations/verse8.js';
import { initVerse9 } from './animations/verse9.js';
import { initVerse10 } from './animations/verse10.js';
import { initVerse11 } from './animations/verse11.js';
import { setupZoomAndPan } from './controls-utils.js';

let currentVerse = 1;
let currentAnimation = null;
let resizeTimeout;
let cameraControls = null;

const verseInitializers = [
    initVerse1, initVerse2, initVerse3, initVerse4, initVerse5,
    initVerse6, initVerse7, initVerse8, initVerse9, initVerse10, initVerse11
];

function updateVerseContent(verse) {
    document.querySelector('.verse-text').textContent = `Verse ${verse.number}: ${verse.text}`;
    document.querySelector('.madhyamaka-concept').textContent = verse.madhyamakaConcept;
    document.querySelector('.quantum-parallel').textContent = verse.quantumParallel;
    document.querySelector('.accessible-explanation').textContent = verse.accessibleExplanation;
    
    // Update active verse button
    document.querySelectorAll('.verse-nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.verse-nav-button[data-verse="${verse.number}"]`).classList.add('active');
}

function loadVerse(verseNumber) {
    // Clean up current animation if exists
    if (currentAnimation && currentAnimation.cleanup) {
        currentAnimation.cleanup();
    }
    
    // Clean up camera controls if exists
    if (cameraControls && cameraControls.cleanup) {
        cameraControls.cleanup();
    }
    
    // Clear animation container
    const container = document.getElementById('animation-canvas');
    container.innerHTML = '';
    
    // Clear interaction controls
    const interactionControls = document.querySelector('.interaction-controls');
    interactionControls.innerHTML = '';
    
    // Load new animation
    const index = verseNumber - 1;
    currentVerse = verseNumber;
    
    if (verseInitializers[index]) {
        currentAnimation = verseInitializers[index](container, interactionControls);
        updateVerseContent(verses[index]);
        
        // Add camera controls reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset View';
        resetButton.className = 'reset-view-button';
        resetButton.addEventListener('click', () => {
            if (cameraControls) cameraControls.reset();
        });
        interactionControls.appendChild(resetButton);
        
        // Setup zoom and pan controls
        if (currentAnimation && currentAnimation.camera && currentAnimation.renderer) {
            cameraControls = setupZoomAndPan(currentAnimation.camera, currentAnimation.renderer);
        }
    }
}

function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (currentAnimation && currentAnimation.resize) {
            currentAnimation.resize();
        }
    }, 250);
}

function initializeVerseNavigation() {
    const navContainer = document.getElementById('verse-nav');
    navContainer.innerHTML = '';
    
    verses.forEach(verse => {
        const button = document.createElement('button');
        button.className = 'verse-nav-button';
        button.dataset.verse = verse.number;
        button.textContent = verse.number;
        
        if (verse.number === currentVerse) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            loadVerse(verse.number);
        });
        
        navContainer.appendChild(button);
    });
}

function initializeSidebarPanel() {
    const panel = document.querySelector('.sidebar-panel');
    const toggleButton = document.getElementById('panel-toggle');
    
    // Toggle panel expanded/collapsed state
    toggleButton.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
    });
    
    // Section collapsing functionality
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggleIcon = header.querySelector('.toggle-icon');
            
            content.classList.toggle('collapsed');
            toggleIcon.textContent = content.classList.contains('collapsed') ? '►' : '▼';
        });
    });
    
    // Mobile panel functionality
    if (window.innerWidth < 768) {
        // Start with panel active on mobile
        panel.classList.add('active');
        
        // For mobile, toggle button should show/hide panel
        toggleButton.addEventListener('click', () => {
            panel.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize verse navigation buttons
    initializeVerseNavigation();
    
    // Initialize sidebar panel functionality
    initializeSidebarPanel();
    
    // Default state: explanation expanded, controls collapsed
    document.getElementById('explanation-header').querySelector('.toggle-icon').textContent = '▼';
    document.getElementById('controls-header').querySelector('.toggle-icon').textContent = '►';
    document.getElementById('animation-controls').classList.add('collapsed');
    
    // Initialize with first verse
    loadVerse(1);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
});