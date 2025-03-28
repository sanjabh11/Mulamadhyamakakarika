import { verses } from './config.js';
import { createAnimation } from './animations.js';

let currentVerseIndex = 0;
let currentAnimation = null;

function setupUI() {
    const prevButton = document.getElementById('prev-verse');
    const nextButton = document.getElementById('next-verse');
    const togglePanelButton = document.getElementById('toggle-panel');
    const controlsPanel = document.getElementById('controls-panel');
    
    prevButton.addEventListener('click', () => {
        if (currentVerseIndex > 0) {
            loadVerse(currentVerseIndex - 1);
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentVerseIndex < verses.length - 1) {
            loadVerse(currentVerseIndex + 1);
        }
    });
    
    togglePanelButton.addEventListener('click', () => {
        controlsPanel.classList.toggle('hidden');
        togglePanelButton.textContent = controlsPanel.classList.contains('hidden') ? 'Show Controls' : 'Hide Controls';
    });
    
    // Handle scroll position on verse change
    document.getElementById('text-side').addEventListener('scroll', function() {
        localStorage.setItem('scrollPosition', this.scrollTop);
    });
}

function updateVerseContent(verseIndex) {
    const verse = verses[verseIndex];
    const verseContainer = document.getElementById('verse-container');
    const explanation = document.getElementById('explanation');
    const verseIndicator = document.getElementById('verse-indicator');
    const prevButton = document.getElementById('prev-verse');
    const nextButton = document.getElementById('next-verse');
    
    // Show loading animation
    document.querySelector('.loading-screen').style.opacity = '1';
    document.querySelector('.loading-screen').style.display = 'flex';
    
    // Update navigation buttons state
    prevButton.disabled = verseIndex === 0;
    nextButton.disabled = verseIndex === verses.length - 1;
    
    // Update verse indicator
    verseIndicator.textContent = `Verse ${verseIndex + 1}/${verses.length}`;
    
    // Update verse content
    verseContainer.innerHTML = `
        <h2>${verse.title}</h2>
        <p class="verse-text">${verse.text}</p>
        <div class="concept-box">
            <h3>Madhyamaka Concept:</h3>
            <p>${verse.madhyamaka}</p>
        </div>
        <div class="concept-box">
            <h3>Quantum Physics Parallel:</h3>
            <p>${verse.quantum}</p>
        </div>
    `;
    
    // Update explanation
    explanation.innerHTML = `<p>${verse.explanation}</p>`;
    
    // Reset scroll position
    document.getElementById('text-side').scrollTop = 0;
    
    // Hide loading screen after a small delay
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1000);
}

function loadVerse(verseIndex) {
    // Clean up current animation if it exists
    if (currentAnimation) {
        currentAnimation.cleanup();
        currentAnimation = null;
    }
    
    // Update UI with new verse content
    updateVerseContent(verseIndex);
    
    // Create new animation
    const sceneContainer = document.getElementById('scene-container');
    const controlsContainer = document.getElementById('interaction-controls');
    
    currentAnimation = createAnimation(verseIndex + 1, sceneContainer);
    currentAnimation.setupInteractionControls(controlsContainer);
    
    // Save current index
    currentVerseIndex = verseIndex;
    
    // Add hash to URL for sharing
    window.location.hash = `verse=${verseIndex + 1}`;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    
    // Check for hash in URL (for sharing specific verses)
    const hash = window.location.hash;
    let initialVerse = 0;
    
    if (hash) {
        const match = hash.match(/verse=(\d+)/);
        if (match && match[1]) {
            const verseNum = parseInt(match[1]);
            if (verseNum >= 1 && verseNum <= verses.length) {
                initialVerse = verseNum - 1;
            }
        }
    }
    
    loadVerse(initialVerse);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (currentAnimation) {
            currentAnimation.onWindowResize();
        }
    });
    
    // Hide loading screen when all resources are loaded
    window.addEventListener('load', () => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    });
});