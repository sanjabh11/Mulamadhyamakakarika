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
const verseTitle = document.getElementById('verse-title');
const verseText = document.getElementById('verse-text');
const madhyamakaContent = document.getElementById('madhyamaka-content');
const quantumContent = document.getElementById('quantum-content');
const explanationContent = document.getElementById('explanation-content');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const verseIndicator = document.getElementById('verse-indicator');
const verseSpecificControls = document.getElementById('verse-specific-controls');

// Create verse indicator dots
verses.forEach((verse, index) => {
    const dot = document.createElement('div');
    dot.classList.add('verse-dot');
    if (index === 0) dot.classList.add('active');
    dot.dataset.index = index;
    dot.addEventListener('click', () => changeVerse(index));
    verseIndicator.appendChild(dot);
});

// Setup tab buttons
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to current button and content
        button.classList.add('active');
        document.getElementById(`${tab}-content`).classList.add('active');
    });
});

// Toggle control panel
togglePanelBtn.addEventListener('click', () => {
    controlPanel.classList.toggle('hidden');
    if (controlPanel.classList.contains('hidden')) {
        togglePanelBtn.textContent = 'Show Panel';
        togglePanelBtn.classList.add('panel-hidden');
    } else {
        togglePanelBtn.textContent = 'Hide Panel';
        togglePanelBtn.classList.remove('panel-hidden');
    }
});

// Navigation
prevBtn.addEventListener('click', () => {
    changeVerse(Math.max(0, currentVerseIndex - 1));
});

nextBtn.addEventListener('click', () => {
    changeVerse(Math.min(verses.length - 1, currentVerseIndex + 1));
});

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
    verseTitle.textContent = verse.title;
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
    
    // Update navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === verses.length - 1;
}

// Initialize with first verse
changeVerse(0);

// Handle window resize
window.addEventListener('resize', () => {
    if (currentAnimation && typeof currentAnimation.resize === 'function') {
        currentAnimation.resize();
    }
});

