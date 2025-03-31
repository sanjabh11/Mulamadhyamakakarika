import { verses } from './config.js';

// DOM elements
const verseSelector = document.getElementById('verseSelector');
const prevButton = document.getElementById('prevVerse');
const nextButton = document.getElementById('nextVerse');
const toggleButton = document.getElementById('toggleText');
const textContainer = document.getElementById('text-container');
const verseTitle = document.getElementById('verse-title');
const verseText = document.getElementById('verse-text');
const madhyamakaConcept = document.getElementById('madhyamaka-concept');
const quantumPhysics = document.getElementById('quantum-physics');
const explanation = document.getElementById('explanation');
const animationContainer = document.getElementById('animation-container');

// Current verse index
let currentVerseIndex = 0;
let animations = {};
let currentAnimation = null;

// Initialize verse selector
function initVerseSelector() {
    verses.forEach((verse, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Verse ${verse.id}`;
        verseSelector.appendChild(option);
    });
}

// Update text content
function updateTextContent() {
    const verse = verses[currentVerseIndex];
    verseTitle.textContent = verse.title;
    verseText.textContent = verse.text;
    madhyamakaConcept.textContent = verse.madhyamakaConcept;
    quantumPhysics.textContent = verse.quantumPhysics;
    explanation.textContent = verse.explanation;
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
    
    const verse = verses[currentVerseIndex];
    if (animations[verse.id]) {
        currentAnimation = animations[verse.id](animationContainer);
    } else {
        console.warn(`No animation available for verse ${verse.id}`);
    }
}

// Navigate to verse
function navigateToVerse(index) {
    if (index >= 0 && index < verses.length) {
        currentVerseIndex = index;
        verseSelector.value = index;
        updateTextContent();
        displayAnimation();
    }
}

// Event listeners
verseSelector.addEventListener('change', (e) => {
    navigateToVerse(parseInt(e.target.value));
});

prevButton.addEventListener('click', () => {
    navigateToVerse(currentVerseIndex - 1);
});

nextButton.addEventListener('click', () => {
    navigateToVerse(currentVerseIndex + 1);
});

toggleButton.addEventListener('click', () => {
    textContainer.classList.toggle('show');
});

// Handle resize
window.addEventListener('resize', () => {
    if (currentAnimation && typeof currentAnimation.resize === 'function') {
        currentAnimation.resize();
    }
});

// Initialize
async function init() {
    initVerseSelector();
    await loadAnimations();
    navigateToVerse(0);
}

init();

