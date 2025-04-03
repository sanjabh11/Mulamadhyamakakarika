import { verses } from './config.js';

// DOM elements
const verseNavigation = document.getElementById('verseNavigation');
const verseText = document.getElementById('verse-text');
const madhyamakaConcept = document.getElementById('madhyamaka-concept');
const quantumPhysics = document.getElementById('quantum-physics');
const explanation = document.getElementById('explanation');
const animationContainer = document.getElementById('animation-container');
const animationControls = document.getElementById('animationControls');

// Current verse index
let currentVerseIndex = 0;
let animations = {};
let currentAnimation = null;

// Initialize verse navigation
function initVerseNavigation() {
    verses.forEach((verse, index) => {
        const button = document.createElement('button');
        button.classList.add('verse-btn');
        button.textContent = verse.id;
        button.dataset.verseIndex = index;
        if (index === currentVerseIndex) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            navigateToVerse(index);
        });
        verseNavigation.appendChild(button);
    });
}

// Update text content
function updateTextContent() {
    const verse = verses[currentVerseIndex];
    verseText.textContent = verse.text;
    madhyamakaConcept.textContent = verse.madhyamakaConcept;
    quantumPhysics.textContent = verse.quantumPhysics;
    explanation.textContent = verse.explanation;
    
    // Update active verse button
    document.querySelectorAll('.verse-btn').forEach((btn, index) => {
        if (parseInt(btn.dataset.verseIndex) === currentVerseIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Load animation modules
async function loadAnimations() {
    for (const verse of verses) {
        try {
            const module = await import(`./animations/verse${verse.id}.js`);
            animations[verse.id] = module.default;
        } catch (error) {
            console.error(`Failed to load animation for verse ${verse.id}:`, error);
        }
    }
}

// Display current animation
function displayAnimation() {
    // Clear previous animation
    if (currentAnimation && typeof currentAnimation.cleanup === 'function') {
        currentAnimation.cleanup();
    }
    
    animationContainer.innerHTML = '';
    animationControls.innerHTML = ''; // Clear previous controls
    
    const verse = verses[currentVerseIndex];
    if (animations[verse.id]) {
        currentAnimation = animations[verse.id](animationContainer, animationControls);
    } else {
        console.warn(`No animation available for verse ${verse.id}`);
    }
}

// Navigate to verse
function navigateToVerse(index) {
    if (index >= 0 && index < verses.length) {
        currentVerseIndex = index;
        updateTextContent();
        displayAnimation();
    }
}

// Handle resize
window.addEventListener('resize', () => {
    if (currentAnimation && typeof currentAnimation.resize === 'function') {
        currentAnimation.resize();
    }
});

// Initialize
async function init() {
    initVerseNavigation();
    await loadAnimations();
    navigateToVerse(0);
}

init();