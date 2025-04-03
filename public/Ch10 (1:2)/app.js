import { verses, animationSettings } from './config.js';
import { initThreeJS, createAnimation, clearScene } from './animations.js';

document.addEventListener('DOMContentLoaded', init);

let currentVerseIndex = 0;
let currentAnimation = null;

function init() {
    // Initialize Three.js
    const container = document.getElementById('animation-container');
    initThreeJS(container);
    
    // Set up panel toggle
    const leftPanel = document.getElementById('left-panel');
    const panelToggle = document.querySelector('.panel-toggle');
    
    panelToggle.addEventListener('click', () => {
        leftPanel.classList.toggle('collapsed');
    });
    
    // Set up section toggles
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('expanded');
        });
    });
    
    // Create verse navigation buttons
    const verseNavigation = document.getElementById('verse-navigation');
    verses.forEach((verse, index) => {
        const button = document.createElement('button');
        button.textContent = verse.id;
        button.classList.add('verse-button');
        if (index === 0) button.classList.add('active');
        
        button.addEventListener('click', () => {
            showVerse(index);
            
            // Update active button
            document.querySelectorAll('.verse-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
        
        verseNavigation.appendChild(button);
    });
    
    // Set up original event listeners for backward compatibility
    document.getElementById('prev-verse').addEventListener('click', showPreviousVerse);
    document.getElementById('next-verse').addEventListener('click', showNextVerse);
    
    // Legacy controls for backward compatibility
    if (document.getElementById('toggle-text')) {
        document.getElementById('toggle-text').addEventListener('click', toggleTextPanel);
    }
    if (document.getElementById('toggle-controls')) {
        document.getElementById('toggle-controls').addEventListener('click', toggleControlsPanel);
    }
    if (document.getElementById('show-panels')) {
        document.getElementById('show-panels').addEventListener('click', showPanels);
    }
    
    // Show first verse
    showVerse(currentVerseIndex);
    
    // Handle responsive behavior
    handleResize();
    window.addEventListener('resize', handleResize);
}

function handleResize() {
    const leftPanel = document.getElementById('left-panel');
    
    // On small screens, collapse the left panel if screen width is below 768px
    if (window.innerWidth < 768) {
        // Collapse sections but not the panel itself on mobile
        document.getElementById('verse-explanation-section').classList.remove('expanded');
        document.getElementById('animation-controls-section').classList.remove('expanded');
    } else {
        // On desktop, expand verse explanation by default
        document.getElementById('verse-explanation-section').classList.add('expanded');
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
    
    // Update legacy text content for backward compatibility
    if (document.getElementById('verse-text-legacy')) {
        document.getElementById('verse-text-legacy').textContent = verse.text;
        document.getElementById('madhyamaka-concept-legacy').textContent = verse.madhyamakaConcept;
        document.getElementById('quantum-parallel-legacy').textContent = verse.quantumParallel;
        document.getElementById('accessible-explanation-legacy').textContent = verse.accessibleExplanation;
    }
    
    // Update navigation
    document.getElementById('verse-indicator').textContent = `Verse ${verse.id}/${verses.length}`;
    if (document.getElementById('verse-indicator-legacy')) {
        document.getElementById('verse-indicator-legacy').textContent = `Verse ${verse.id}/${verses.length}`;
    }
    
    // Create animation
    if (currentAnimation) {
        clearScene();
    }
    
    currentAnimation = createAnimation(verse.animationType);
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