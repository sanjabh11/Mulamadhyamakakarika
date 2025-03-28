import { verses, animationSettings } from './config.js';
import { initThreeJS, createAnimation, clearScene } from './animations.js';

document.addEventListener('DOMContentLoaded', init);

let currentVerseIndex = 0;
let currentAnimation = null;

function init() {
    // Initialize Three.js
    const container = document.getElementById('animation-container');
    initThreeJS(container);
    
    // Set up event listeners
    document.getElementById('prev-verse').addEventListener('click', showPreviousVerse);
    document.getElementById('next-verse').addEventListener('click', showNextVerse);
    document.getElementById('toggle-text').addEventListener('click', toggleTextPanel);
    document.getElementById('toggle-controls').addEventListener('click', toggleControlsPanel);
    document.getElementById('show-panels').addEventListener('click', showPanels);
    
    // Check for URL hash to determine initial verse
    checkUrlHash();
    
    // Show first verse
    showVerse(currentVerseIndex);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Handle URL hash changes
    window.addEventListener('hashchange', checkUrlHash);
}

function checkUrlHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#verse-')) {
        const verseNum = parseInt(hash.substring(7));
        if (!isNaN(verseNum) && verseNum >= 1 && verseNum <= verses.length) {
            currentVerseIndex = verseNum - 1;
            showVerse(currentVerseIndex);
        }
    }
}

function handleResize() {
    const textPanel = document.getElementById('text-panel');
    const controlsPanel = document.getElementById('controls-panel');
    
    // On small screens, collapse panels automatically
    if (window.innerWidth < 768) {
        textPanel.classList.add('hidden');
        controlsPanel.classList.add('hidden');
        document.getElementById('show-panels').classList.remove('hidden');
    }
}

function showVerse(index) {
    if (index < 0 || index >= verses.length) return;
    
    currentVerseIndex = index;
    const verse = verses[index];
    
    // Update text content
    document.getElementById('verse-text').textContent = verse.text;
    document.getElementById('madhyamaka-concept').textContent = verse.madhyamakaConcept;
    document.getElementById('quantum-parallel').textContent = verse.quantumParallel;
    document.getElementById('accessible-explanation').textContent = verse.accessibleExplanation;
    
    // Update navigation
    document.getElementById('verse-indicator').textContent = `Verse ${verse.id}/${verses.length}`;
    document.getElementById('prev-verse').disabled = index === 0;
    document.getElementById('next-verse').disabled = index === verses.length - 1;
    
    // Create animation
    if (currentAnimation) {
        clearScene();
    }
    
    currentAnimation = createAnimation(verse.animationType);
    
    // Update URL hash without triggering a hashchange event
    const newHash = `#verse-${verse.id}`;
    if (window.location.hash !== newHash) {
        history.replaceState(null, null, newHash);
    }
}

function showNextVerse() {
    if (currentVerseIndex < verses.length - 1) {
        showVerse(currentVerseIndex + 1);
    }
}

function showPreviousVerse() {
    if (currentVerseIndex > 0) {
        showVerse(currentVerseIndex - 1);
    }
}

function toggleTextPanel() {
    const panel = document.getElementById('text-panel');
    const button = document.getElementById('toggle-text');
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        button.textContent = 'Hide Text';
    } else {
        panel.classList.add('hidden');
        button.textContent = 'Show Text';
    }
}

function toggleControlsPanel() {
    const panel = document.getElementById('controls-panel');
    const button = document.getElementById('toggle-controls');
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        button.textContent = 'Hide Controls';
    } else {
        panel.classList.add('hidden');
        button.textContent = 'Show Controls';
        document.getElementById('show-panels').classList.remove('hidden');
    }
}

function showPanels() {
    document.getElementById('text-panel').classList.remove('hidden');
    document.getElementById('controls-panel').classList.remove('hidden');
    document.getElementById('show-panels').classList.add('hidden');
}

