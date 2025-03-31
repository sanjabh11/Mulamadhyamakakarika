import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { verses, settings } from './config.js';

// Animation scenes
import { createVerse1Scene } from './verse1.js';
import { createVerse2Scene } from './verse2.js';
import { createVerse3Scene } from './verse3.js';
import { createVerse4Scene } from './verse4.js';
import { createVerse5Scene } from './verse5.js';
import { createVerse6Scene } from './verse6.js';
import { createVerse7Scene } from './verse7.js';
import { createVerse8Scene } from './verse8.js';
import { createVerse9Scene } from './verse9.js';

// DOM elements
const sceneContainer = document.getElementById('scene-container');
const controlPanel = document.getElementById('control-panel');
const togglePanel = document.getElementById('toggle-panel');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const verseNumberDisplay = document.getElementById('verse-number');

// Content elements
const verseTextContent = document.getElementById('verse-text-content');
const madhyamakaContent = document.getElementById('madhyamaka-content');
const quantumContent = document.getElementById('quantum-content');
const accessibleContent = document.getElementById('accessible-content');
const instructionsContent = document.getElementById('scene-instructions-content');

// Tab buttons
const tabButtons = document.querySelectorAll('.tab-button');

// Core Three.js components
let currentScene, currentRenderer, currentCamera, currentControls;
let currentVerseIndex = 0;
let animationFrameId;
let sceneCreators = [
    createVerse1Scene,
    createVerse2Scene,
    createVerse3Scene,
    createVerse4Scene,
    createVerse5Scene,
    createVerse6Scene,
    createVerse7Scene,
    createVerse8Scene,
    createVerse9Scene
];

// Initialize the application
function init() {
    setupEventListeners();
    loadVerse(currentVerseIndex);
    updateNavigationButtons();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Setup event listeners
function setupEventListeners() {
    togglePanel.addEventListener('click', () => {
        controlPanel.classList.toggle('hidden');
        
        if (controlPanel.classList.contains('hidden')) {
            togglePanel.innerHTML = 'Show Panel <span class="arrow">&#9654;</span>';
        } else {
            togglePanel.innerHTML = 'Hide Panel <span class="arrow">&#9664;</span>';
        }
    });
    
    prevVerseBtn.addEventListener('click', () => {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            loadVerse(currentVerseIndex);
            updateNavigationButtons();
        }
    });
    
    nextVerseBtn.addEventListener('click', () => {
        if (currentVerseIndex < verses.length - 1) {
            currentVerseIndex++;
            loadVerse(currentVerseIndex);
            updateNavigationButtons();
        }
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tab buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

// Update navigation buttons state
function updateNavigationButtons() {
    prevVerseBtn.disabled = currentVerseIndex === 0;
    nextVerseBtn.disabled = currentVerseIndex === verses.length - 1;
}

// Load verse content and create scene
function loadVerse(index) {
    const verse = verses[index];
    
    // Update text content
    verseNumberDisplay.textContent = `Verse ${verse.number}`;
    verseTextContent.textContent = verse.text;
    madhyamakaContent.textContent = verse.madhyamaka;
    quantumContent.textContent = verse.quantum;
    accessibleContent.textContent = verse.accessible;
    instructionsContent.textContent = verse.instructions;
    
    // Clean up previous scene if it exists
    if (currentRenderer) {
        cancelAnimationFrame(animationFrameId);
        sceneContainer.removeChild(currentRenderer.domElement);
        currentScene = null;
        currentRenderer = null;
        currentCamera = null;
        if (currentControls) {
            currentControls.dispose();
            currentControls = null;
        }
    }
    
    // Create new scene
    const { scene, camera, renderer, controls, animate } = sceneCreators[index]();
    
    currentScene = scene;
    currentCamera = camera;
    currentRenderer = renderer;
    currentControls = controls;
    
    // Add renderer to container
    sceneContainer.appendChild(renderer.domElement);
    
    // Start animation
    function animationLoop() {
        animationFrameId = requestAnimationFrame(animationLoop);
        if (animate) animate();
        renderer.render(scene, camera);
    }
    
    animationLoop();
}

// Handle window resize
function onWindowResize() {
    if (currentCamera && currentRenderer) {
        currentCamera.aspect = window.innerWidth / window.innerHeight;
        currentCamera.updateProjectionMatrix();
        currentRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize the application
init();