import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { verses } from './config.js';
import { createVerse1Animation } from './verse1.js';
import { createVerse2Animation } from './verse2.js';
import { createVerse3Animation } from './verse3.js';
import { createVerse4Animation } from './verse4.js';
import { createVerse5Animation } from './verse5.js';
import { createVerse6Animation } from './verse6.js';
import { createVerse7Animation } from './verse7.js';
import { createVerse8Animation } from './verse8.js';
import { createVerse9Animation } from './verse9.js';
import { createVerse10Animation } from './verse10.js';
import { createVerse11Animation } from './verse11.js';
import { createVerse12Animation } from './verse12.js';
import { createVerse13Animation } from './verse13.js';

// State
let currentVerseIndex = 0;
let currentScene = null;
let currentAnimation = null;
let clock = new THREE.Clock();

// DOM Elements
const container = document.getElementById('animation-container');
const controlPanel = document.getElementById('control-panel');
const togglePanelBtn = document.getElementById('toggle-panel');
const verseText = document.getElementById('verse-text');
const madhyamakaContent = document.getElementById('madhyamaka-content');
const quantumContent = document.getElementById('quantum-content');
const explanationContent = document.getElementById('explanation-content');
const verseIndicator = document.getElementById('verse-nav');
const verseSpecificControls = document.getElementById('verse-specific-controls');
const sectionHeaders = document.querySelectorAll('.section-header');

// Create verse indicator buttons
verses.forEach((verse, index) => {
    const dot = document.createElement('button');
    dot.classList.add('verse-dot');
    if (index === 0) dot.classList.add('active');
    dot.dataset.index = index;
    dot.textContent = index + 1;
    dot.addEventListener('click', () => changeVerse(index));
    verseIndicator.appendChild(dot);
});

// Toggle control panel
togglePanelBtn.addEventListener('click', () => {
    controlPanel.classList.toggle('collapsed');
});

// Section toggle functionality
sectionHeaders.forEach(header => {
    const sectionId = header.dataset.section;
    const contentSection = document.getElementById(`${sectionId}-section`);
    
    // Set initial states
    if (sectionId === 'verse-content') {
        header.setAttribute('aria-expanded', 'true');
    } else {
        header.setAttribute('aria-expanded', 'false');
    }
    
    header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded
        header.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle content visibility
        contentSection.classList.toggle('active');
        
        // Update toggle icon
        const toggleIcon = header.querySelector('.toggle-icon');
        toggleIcon.textContent = !isExpanded ? '▼' : '►';
    });
});

// Set mobile defaults
function setMobileDefaults() {
    if (window.innerWidth < 768) {
        // Collapse all sections on mobile
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active');
        });
        
        // Update all toggle icons
        document.querySelectorAll('.section-header').forEach(header => {
            header.setAttribute('aria-expanded', 'false');
            header.querySelector('.toggle-icon').textContent = '►';
        });
    }
}

// Initialize mobile defaults
setMobileDefaults();

// Helper to create animation based on verse number
function createAnimationForVerse(index) {
    const verseCreators = [
        createVerse1Animation,
        createVerse2Animation,
        createVerse3Animation,
        createVerse4Animation,
        createVerse5Animation,
        createVerse6Animation,
        createVerse7Animation,
        createVerse8Animation,
        createVerse9Animation,
        createVerse10Animation,
        createVerse11Animation,
        createVerse12Animation,
        createVerse13Animation
    ];
    
    if (index >= 0 && index < verseCreators.length) {
        return verseCreators[index](container, handleAction);
    }
    
    return null;
}

// Action handler for verse-specific controls
function handleAction(action, value) {
    if (currentAnimation && typeof currentAnimation.actions === 'object' && typeof currentAnimation.actions[action] === 'function') {
        currentAnimation.actions[action](value);
    }
}

// Create verse-specific controls
function createVerseControls(verse) {
    verseSpecificControls.innerHTML = '';
    
    if (!verse.controls) return;
    
    verse.controls.forEach(control => {
        if (control.type === 'slider') {
            const label = document.createElement('label');
            label.textContent = control.label;
            label.htmlFor = control.id;
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = control.id;
            slider.min = control.min;
            slider.max = control.max;
            slider.step = control.step;
            slider.value = control.value;
            
            slider.addEventListener('input', () => {
                handleAction(control.action, parseFloat(slider.value));
            });
            
            const wrapper = document.createElement('div');
            wrapper.className = 'slider-control';
            wrapper.appendChild(label);
            wrapper.appendChild(slider);
            
            verseSpecificControls.appendChild(wrapper);
        } else {
            const button = document.createElement('button');
            button.id = control.id;
            button.textContent = control.label;
            button.className = 'control-btn';
            
            button.addEventListener('click', () => {
                handleAction(control.action);
            });
            
            verseSpecificControls.appendChild(button);
        }
    });
}

// Change to a specific verse
function changeVerse(index) {
    if (index < 0 || index >= verses.length) return;
    
    // Clean up previous animation
    if (currentAnimation && typeof currentAnimation.dispose === 'function') {
        currentAnimation.dispose();
    }
    
    // Update UI
    const verse = verses[index];
    verseText.textContent = verse.text;
    madhyamakaContent.textContent = verse.madhyamaka;
    quantumContent.textContent = verse.quantum;
    explanationContent.textContent = verse.explanation;
    
    // Update dots
    document.querySelectorAll('.verse-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Create new animation
    currentVerseIndex = index;
    currentAnimation = createAnimationForVerse(index);
    
    // Create verse-specific controls
    createVerseControls(verse);
    
    // Ensure controls section expands when it has content
    if (verse.controls && verse.controls.length > 0) {
        const controlsHeader = document.querySelector('.section-header[data-section="controls"]');
        const controlsSection = document.getElementById('controls-section');
        
        // Only expand on desktop
        if (window.innerWidth >= 768) {
            controlsHeader.setAttribute('aria-expanded', 'true');
            controlsHeader.querySelector('.toggle-icon').textContent = '▼';
            controlsSection.classList.add('active');
        }
    }
}

// Initialize with first verse
changeVerse(0);

// Handle window resize
window.addEventListener('resize', () => {
    if (currentAnimation && typeof currentAnimation.resize === 'function') {
        currentAnimation.resize();
    }
    
    // Apply mobile defaults on resize if width is under mobile breakpoint
    setMobileDefaults();
});