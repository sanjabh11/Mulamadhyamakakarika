import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { verses, animationSettings } from './config.js';
import { initAnimations } from './animations.js';

// DOM elements
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const verseNumberElement = document.getElementById('verse-number');
const verseTextElement = document.getElementById('verse-text');
const madhyamakaConceptElement = document.getElementById('madhyamaka-concept');
const quantumParallelElement = document.getElementById('quantum-parallel');
const accessibleExplanationElement = document.getElementById('accessible-explanation');
const animationContainer = document.getElementById('animation-container');
const contentContainer = document.getElementById('content-container');
const controlsPanel = document.getElementById('controls-panel');
const toggleControls = document.getElementById('toggle-controls');
const toggleInfo = document.getElementById('toggle-info');

// New fixed navigation elements
const fixedNavigation = document.getElementById('fixed-navigation');
const fixedPrevBtn = document.getElementById('fixed-prev-btn');
const fixedNextBtn = document.getElementById('fixed-next-btn');
const fixedVerseNumberElement = document.getElementById('fixed-verse-number');

// Control elements
const speedSlider = document.getElementById('speed-slider');
const intensitySlider = document.getElementById('intensity-slider');
const primaryColorPicker = document.getElementById('primary-color');
const secondaryColorPicker = document.getElementById('secondary-color');
const resetCameraBtn = document.getElementById('reset-camera');
const autoRotateBtn = document.getElementById('auto-rotate');

// Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#030a1c');

const camera = new THREE.PerspectiveCamera(
    70, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
animationContainer.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add point lights
const pointLight1 = new THREE.PointLight(0x6fcbf7, 2, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff00ff, 2, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.autoRotateSpeed = 1.0;
controls.enableZoom = true;  
controls.enablePan = true;   
controls.maxDistance = 100;  
controls.minDistance = 2;    

// Current verse index
let currentVerseIndex = 0;

// Initialize animations
const animations = initAnimations(scene);
let currentAnimation = null;

// Update content based on current verse
function updateContent() {
    const verse = verses[currentVerseIndex];
    
    verseNumberElement.textContent = `Verse ${verse.number}`;
    fixedVerseNumberElement.textContent = `Verse ${verse.number}`; // Update fixed navigation
    verseTextElement.textContent = verse.text;
    madhyamakaConceptElement.textContent = verse.madhyamakaConcept;
    quantumParallelElement.textContent = verse.quantumParallel;
    accessibleExplanationElement.textContent = verse.accessibleExplanation;
    
    // Update animation
    if (currentAnimation) {
        currentAnimation.clear();
    }
    
    currentAnimation = animations[verse.animation];
    if (currentAnimation) {
        currentAnimation.init();
    }
    
    // Update UI to match current animation settings
    updateControlsFromSettings();
    
    // Ensure verse container is visible after changing verse
    contentContainer.classList.remove('info-hidden');
    
    // Show/hide fixed navigation based on info panel state
    updateFixedNavigationVisibility();
}

// Show/hide fixed navigation based on info panel state
function updateFixedNavigationVisibility() {
    // Always show fixed navigation
    fixedNavigation.classList.add('visible');
}

// Handle control panel toggles
toggleControls.addEventListener('click', () => {
    controlsPanel.classList.toggle('hidden');
    toggleControls.classList.toggle('hidden');
});

toggleInfo.addEventListener('click', () => {
    contentContainer.classList.toggle('info-hidden');
    toggleInfo.textContent = contentContainer.classList.contains('info-hidden') ? '↓' : '↑';
    // Don't change fixed navigation visibility, keep it always visible
});

// Handle control inputs
speedSlider.addEventListener('input', (e) => {
    animationSettings.speed = parseFloat(e.target.value);
});

intensitySlider.addEventListener('input', (e) => {
    animationSettings.intensity = parseFloat(e.target.value);
    updateLightIntensity();
});

primaryColorPicker.addEventListener('input', (e) => {
    animationSettings.colorPrimary = e.target.value;
    pointLight1.color.set(e.target.value);
    if (currentAnimation) {
        currentAnimation.clear();
        currentAnimation.init();
    }
});

secondaryColorPicker.addEventListener('input', (e) => {
    animationSettings.colorSecondary = e.target.value;
    pointLight2.color.set(e.target.value);
    if (currentAnimation) {
        currentAnimation.clear();
        currentAnimation.init();
    }
});

resetCameraBtn.addEventListener('click', () => {
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);
    controls.reset();
});

autoRotateBtn.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    autoRotateBtn.classList.toggle('active');
});

function updateLightIntensity() {
    const intensity = animationSettings.intensity;
    pointLight1.intensity = intensity * 2;
    pointLight2.intensity = intensity * 2;
    ambientLight.intensity = intensity * 1.5;
    directionalLight.intensity = intensity;
}

function updateControlsFromSettings() {
    speedSlider.value = animationSettings.speed;
    intensitySlider.value = animationSettings.intensity;
    primaryColorPicker.value = animationSettings.colorPrimary;
    secondaryColorPicker.value = animationSettings.colorSecondary;
    updateLightIntensity();
}

// Check if mobile and optimize UI
function checkMobile() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-optimize');
        controlsPanel.classList.add('hidden');
        toggleControls.classList.add('hidden');
        // Don't auto-hide verse container on mobile
        contentContainer.classList.remove('info-hidden');
    } else {
        document.body.classList.remove('mobile-optimize');
        controlsPanel.classList.remove('hidden');
        toggleControls.classList.remove('hidden');
    }
    // Update toggle button text
    toggleInfo.textContent = contentContainer.classList.contains('info-hidden') ? '↓' : '↑';
}

// Event listeners
prevBtn.addEventListener('click', () => {
    if (currentVerseIndex > 0) {
        currentVerseIndex--;
        updateContent();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentVerseIndex < verses.length - 1) {
        currentVerseIndex++;
        updateContent();
    }
});

// Scrolling navigation with keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentVerseIndex < verses.length - 1) {
            currentVerseIndex++;
            updateContent();
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            updateContent();
        }
    }
});

// Touch swipe navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left, next verse
        if (currentVerseIndex < verses.length - 1) {
            currentVerseIndex++;
            updateContent();
        }
    } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right, previous verse
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            updateContent();
        }
    }
}

// Add event listeners for fixed navigation
fixedPrevBtn.addEventListener('click', () => {
    if (currentVerseIndex > 0) {
        currentVerseIndex--;
        updateContent();
        // Ensure content is visible when using navigation
        contentContainer.classList.remove('info-hidden');
    }
});

fixedNextBtn.addEventListener('click', () => {
    if (currentVerseIndex < verses.length - 1) {
        currentVerseIndex++;
        updateContent();
        // Ensure content is visible when using navigation
        contentContainer.classList.remove('info-hidden');
    }
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    checkMobile();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (currentAnimation && currentAnimation.update) {
        currentAnimation.update();
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Initialize
checkMobile();
updateContent();
animate();