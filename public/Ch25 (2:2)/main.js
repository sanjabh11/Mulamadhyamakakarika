import * as THREE from 'three';
import * as d3 from 'd3';
import { verseData } from './config.js';
import { initBackgroundEffects, cleanupBackgroundEffects, add3DEffect } from './ui-effects.js';

// Animation module imports
import { initVerse13, cleanupVerse13 } from './animations/verse13.js';
import { initVerse14, cleanupVerse14 } from './animations/verse14.js';
import { initVerse15, cleanupVerse15 } from './animations/verse15.js';
import { initVerse16, cleanupVerse16 } from './animations/verse16.js';
import { initVerse17, cleanupVerse17 } from './animations/verse17.js';
import { initVerse18, cleanupVerse18 } from './animations/verse18.js';
import { initVerse19, cleanupVerse19 } from './animations/verse19.js';
import { initVerse20, cleanupVerse20 } from './animations/verse20.js';
import { initVerse21, cleanupVerse21 } from './animations/verse21.js';
import { initVerse22, cleanupVerse22 } from './animations/verse22.js';
import { initVerse23, cleanupVerse23 } from './animations/verse23.js';
import { initVerse24, cleanupVerse24 } from './animations/verse24.js';

// DOM Elements
const container = document.getElementById('animation-container');
const verseTitle = document.getElementById('verse-title');
const verseContent = document.getElementById('verse-content');
const verseExplanation = document.getElementById('verse-explanation');
const verseNumber = document.getElementById('verse-number');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const toggleTextBtn = document.getElementById('toggle-text');
const toggleExplanationBtn = document.getElementById('toggle-explanation');
const textOverlay = document.getElementById('text-overlay');
const versesTimeline = document.getElementById('verses-timeline');

// Current verse state
let currentVerse = 13; // Starting with verse 13
let textVisible = true;
let explanationVisible = true;

// Animation functions map
const animations = {
    13: { init: initVerse13, cleanup: cleanupVerse13 },
    14: { init: initVerse14, cleanup: cleanupVerse14 },
    15: { init: initVerse15, cleanup: cleanupVerse15 },
    16: { init: initVerse16, cleanup: cleanupVerse16 },
    17: { init: initVerse17, cleanup: cleanupVerse17 },
    18: { init: initVerse18, cleanup: cleanupVerse18 },
    19: { init: initVerse19, cleanup: cleanupVerse19 },
    20: { init: initVerse20, cleanup: cleanupVerse20 },
    21: { init: initVerse21, cleanup: cleanupVerse21 },
    22: { init: initVerse22, cleanup: cleanupVerse22 },
    23: { init: initVerse23, cleanup: cleanupVerse23 },
    24: { init: initVerse24, cleanup: cleanupVerse24 }
};

// Initialize the timeline
function initTimeline() {
    // Clear existing content
    versesTimeline.innerHTML = '';
    
    // Create verse markers
    for (let i = 13; i <= 24; i++) {
        const marker = document.createElement('div');
        marker.className = 'verse-marker';
        marker.textContent = i;
        marker.dataset.verse = i;
        marker.addEventListener('click', () => navigateToVerse(i));
        
        if (i === currentVerse) {
            marker.classList.add('active');
        }
        
        versesTimeline.appendChild(marker);
    }
    
    // Add tooltips using d3
    d3.selectAll('.verse-marker')
        .append('title')
        .text(function(d, i) {
            const verse = verseData.find(v => parseInt(v.verse) === parseInt(this.dataset.verse));
            return verse ? verse.title : `Verse ${this.dataset.verse}`;
        });
    
    // Add 3D effect to timeline markers
    document.querySelectorAll('.verse-marker').forEach(marker => {
        add3DEffect(marker, 15);
    });
}

// Update timeline active marker
function updateTimelineActiveMarker() {
    document.querySelectorAll('.verse-marker').forEach(marker => {
        if (parseInt(marker.dataset.verse) === currentVerse) {
            marker.classList.add('active');
        } else {
            marker.classList.remove('active');
        }
    });
    
    // Scroll the timeline to center the active marker
    const activeMarker = document.querySelector('.verse-marker.active');
    if (activeMarker) {
        versesTimeline.scrollLeft = activeMarker.offsetLeft - versesTimeline.offsetWidth / 2 + activeMarker.offsetWidth / 2;
    }
}

// Initialize the current verse
function initCurrentVerse() {
    const verseIndex = currentVerse - 13; // Adjust for 0-based index
    const verse = verseData[verseIndex];
    
    // Update text content
    verseTitle.textContent = verse.title;
    verseContent.textContent = verse.content;
    verseExplanation.textContent = verse.explanation;
    verseNumber.textContent = `Verse ${currentVerse}/24`;
    
    // Initialize the corresponding animation
    animations[currentVerse].init(container);
    
    // Update active marker in timeline
    updateTimelineActiveMarker();
    
    // Add 3D effect to text overlay
    add3DEffect(textOverlay, 5);
}

// Clean up the current verse before moving to another
function cleanupCurrentVerse() {
    animations[currentVerse].cleanup();
}

// Navigate to a specific verse
function navigateToVerse(verseNum) {
    if (verseNum < 13 || verseNum > 24) return;
    
    // Add transition effect
    container.style.opacity = 0;
    
    setTimeout(() => {
        cleanupCurrentVerse();
        currentVerse = verseNum;
        initCurrentVerse();
        
        // Fade back in
        container.style.opacity = 1;
    }, 300);
}

// Event listeners
prevBtn.addEventListener('click', () => {
    if (currentVerse > 13) {
        navigateToVerse(currentVerse - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentVerse < 24) {
        navigateToVerse(currentVerse + 1);
    }
});

toggleTextBtn.addEventListener('click', () => {
    textVisible = !textVisible;
    if (textVisible) {
        textOverlay.classList.remove('hidden');
        toggleTextBtn.textContent = 'Hide Text';
    } else {
        textOverlay.classList.add('hidden');
        toggleTextBtn.textContent = 'Show Text';
    }
});

toggleExplanationBtn.addEventListener('click', () => {
    explanationVisible = !explanationVisible;
    if (explanationVisible) {
        verseExplanation.style.display = 'block';
        toggleExplanationBtn.textContent = 'Hide Explanation';
    } else {
        verseExplanation.style.display = 'none';
        toggleExplanationBtn.textContent = 'Show Explanation';
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentVerse > 13) {
        navigateToVerse(currentVerse - 1);
    } else if (e.key === 'ArrowRight' && currentVerse < 24) {
        navigateToVerse(currentVerse + 1);
    } else if (e.key === 'Escape') {
        // Toggle text visibility with Escape key
        textVisible = !textVisible;
        if (textVisible) {
            textOverlay.classList.remove('hidden');
            toggleTextBtn.textContent = 'Hide Text';
        } else {
            textOverlay.classList.add('hidden');
            toggleTextBtn.textContent = 'Show Text';
        }
    }
});

// Touch swipe for mobile navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    // Min swipe distance to trigger navigation
    const minSwipeDistance = 50;
    
    if (touchEndX < touchStartX - minSwipeDistance && currentVerse < 24) {
        // Swipe left: next verse
        navigateToVerse(currentVerse + 1);
    } else if (touchEndX > touchStartX + minSwipeDistance && currentVerse > 13) {
        // Swipe right: previous verse
        navigateToVerse(currentVerse - 1);
    }
}

// Scroll verse text with wheel
textOverlay.addEventListener('wheel', (e) => {
    e.stopPropagation(); // Prevent unintended navigation
});

// Handle wheel events for navigation on desktop
document.addEventListener('wheel', (e) => {
    // Don't handle wheel events from text overlay
    if (e.target.closest('#text-overlay')) return;
    
    // Debounce wheel navigation
    if (!document.wheelTimeout) {
        document.wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0 && currentVerse < 24) {
                navigateToVerse(currentVerse + 1);
            } else if (e.deltaY < 0 && currentVerse > 13) {
                navigateToVerse(currentVerse - 1);
            }
            document.wheelTimeout = null;
        }, 300);
    }
});

// Responsive UI adjustments
function handleResize() {
    const isMobile = window.innerWidth < 768;
    if (isMobile && textVisible) {
        // Adjust text overlay for mobile
        textOverlay.style.maxHeight = '40vh';
    } else {
        textOverlay.style.maxHeight = '';
    }
}

window.addEventListener('resize', handleResize);

// Add 3D effects to buttons
function addButtonEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        add3DEffect(button, 10);
    });
}

// Initialize the application
function init() {
    // Add background effects
    initBackgroundEffects(container);
    
    // Initialize timeline
    initTimeline();
    
    // Setup responsive design
    handleResize();
    
    // Add 3D effects to buttons
    addButtonEffects();
    
    // Initialize first verse
    initCurrentVerse();
    
    // Add smooth transition style
    container.style.transition = 'opacity 0.3s ease';
    
    // Add p5.js script dynamically to ensure it's available
    if (typeof p5 === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
        script.onload = () => console.log('p5.js loaded dynamically');
        document.head.appendChild(script);
    }
}

// Start the application
init();