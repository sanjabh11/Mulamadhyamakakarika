import { createAnimation } from './animations.js';
import { config } from './config.js';

// DOM elements
const canvas = document.getElementById('canvas');
const verseTextElem = document.querySelector('.verse-text');
const madhyamakaElem = document.querySelector('.madhyamaka');
const quantumElem = document.querySelector('.quantum');
const explanationElem = document.querySelector('.explanation');
const verseNumberElem = document.getElementById('verse-number');
const textOverlay = document.getElementById('textOverlay');
const toggleTextBtn = document.getElementById('toggleText');
const toggleFullscreenBtn = document.getElementById('toggleFullscreen');
const prevVerseBtn = document.querySelector('.prev-verse');
const nextVerseBtn = document.querySelector('.next-verse');

// Current verse and animation
let currentVerse = 15; // Starting with verse 15
let currentAnimation;

// Initialize the application
function init() {
    // Load the first verse
    loadVerse(currentVerse);
    
    // Setup event listeners
    toggleTextBtn.addEventListener('click', toggleText);
    toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
    prevVerseBtn.addEventListener('click', () => changeVerse(-1));
    nextVerseBtn.addEventListener('click', () => changeVerse(1));
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
}

// Load a specific verse
function loadVerse(verseNumber) {
    // Update current verse
    currentVerse = verseNumber;
    
    // Update verse number display
    verseNumberElem.textContent = `Verse ${verseNumber}`;
    
    // Load verse text and concepts
    const verseData = config.verses[verseNumber];
    if (!verseData) {
        console.error(`Verse ${verseNumber} data not found`);
        return;
    }
    
    // Update text elements
    verseTextElem.innerHTML = `"${verseData.text}"`;
    
    madhyamakaElem.innerHTML = `
        <h3>Madhyamaka Concept</h3>
        <p>${verseData.madhyamaka.content}</p>
    `;
    
    quantumElem.innerHTML = `
        <h3>Quantum Physics Parallel</h3>
        <p>${verseData.quantum.content}</p>
    `;
    
    explanationElem.innerHTML = `
        <h3>Accessible Explanation</h3>
        <p>${verseData.explanation.content}</p>
        <div class="mobile-instruction">
            <p><i>${verseData.interactionHint}</i></p>
        </div>
    `;
    
    // Dispose of current animation and create new one
    if (currentAnimation) {
        currentAnimation.dispose();
    }
    
    currentAnimation = createAnimation(verseNumber, canvas);
}

// Change verse (next or previous)
function changeVerse(delta) {
    const nextVerse = currentVerse + delta;
    
    // Ensure verse is within valid range (15-28)
    if (nextVerse >= 15 && nextVerse <= 28) {
        loadVerse(nextVerse);
    }
}

// Toggle text visibility
function toggleText() {
    textOverlay.classList.toggle('hidden');
    toggleTextBtn.textContent = textOverlay.classList.contains('hidden') ? 'Show Text' : 'Hide Text';
    
    // Adjust controls position based on text visibility
    if (textOverlay.classList.contains('hidden')) {
        document.getElementById('controls').classList.add('full-width');
    } else {
        document.getElementById('controls').classList.remove('full-width');
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Handle window resize
function handleResize() {
    // Update animation if needed
    if (currentAnimation && currentAnimation.onResize) {
        currentAnimation.onResize();
    }
    
    // Update mobile/desktop detection
    const wasMobile = window.innerWidth < 768;
    const isMobile = window.innerWidth < 768;
    
    if (wasMobile !== isMobile && currentAnimation) {
        // Force reload animation to adapt to new screen size
        loadVerse(currentVerse);
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', init);