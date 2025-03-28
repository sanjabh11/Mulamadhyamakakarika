import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses, animationConfigs, colorSchemes } from './config.js';
import * as ANIMATIONS from './animations.js';
import { gsap } from 'gsap';

// Main application state
let currentVerse = 1;
let scene, camera, renderer, controls;
let currentAnimation = null;
let animationSpecificControls = {};
let detailsVisible = true;

// Initial setup
function init() {
    // Create Three.js scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // Add controls for camera
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.9;
    controls.panSpeed = 0.8;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.getElementById('next-verse').addEventListener('click', goToNextVerse);
    document.getElementById('prev-verse').addEventListener('click', goToPrevVerse);
    document.getElementById('toggle-details').addEventListener('click', toggleDetails);
    document.getElementById('reset-animation').addEventListener('click', resetAnimation);
    
    // Load first verse
    loadVerse(currentVerse);
    
    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    
    if (currentAnimation && currentAnimation.update) {
        currentAnimation.update();
    }
    
    // Add subtle camera movement for more dynamic feel
    if (!controls.active) {
        camera.position.x += Math.sin(performance.now() * 0.0001) * 0.01;
        camera.position.y += Math.cos(performance.now() * 0.0001) * 0.01;
    }
    
    renderer.render(scene, camera);
}

// Load a specific verse
function loadVerse(verseId) {
    const verse = verses.find(v => v.id === verseId);
    if (!verse) return;
    
    // Clear previous animation
    clearScene();
    
    // Update UI
    document.getElementById('verse-number').textContent = `Verse ${verse.id}`;
    document.getElementById('verse-text').textContent = verse.text;
    document.getElementById('madhyamaka-concept').textContent = verse.madhyamakaConcept;
    document.getElementById('quantum-parallel').textContent = verse.quantumParallel;
    document.getElementById('accessible-explanation').textContent = verse.accessibleExplanation;
    document.getElementById('verse-indicator').textContent = `${verse.id}/12`;
    
    // Update navigation buttons
    document.getElementById('prev-verse').disabled = verseId === 1;
    document.getElementById('next-verse').disabled = verseId === 12;
    
    // Set scene background
    scene.background = new THREE.Color(colorSchemes[verseId].background);
    
    // Create animation for this verse
    createAnimation(verseId);
    
    // Reset camera position
    camera.position.set(0, 0, 15);
    controls.reset();
}

// Create the appropriate animation for a verse
function createAnimation(verseId) {
    const config = animationConfigs[verseId];
    const colors = colorSchemes[verseId];
    
    // Clear any previous animation-specific controls
    clearAnimationControls();
    
    // Create animation based on verse number
    switch(verseId) {
        case 1:
            currentAnimation = ANIMATIONS.createSuperpositionAnimation(scene, config, colors);
            break;
        case 2:
            currentAnimation = ANIMATIONS.createWaveFunctionAnimation(scene, config, colors);
            break;
        case 3:
            currentAnimation = ANIMATIONS.createParticleInteractionAnimation(scene, config, colors);
            break;
        case 4:
            currentAnimation = ANIMATIONS.createDoubleslitAnimation(scene, config, colors);
            break;
        case 5:
            currentAnimation = ANIMATIONS.createEntanglementAnimation(scene, config, colors);
            break;
        case 6:
            currentAnimation = ANIMATIONS.createAttractionAnimation(scene, config, colors);
            break;
        case 7:
            currentAnimation = ANIMATIONS.createCoherenceAnimation(scene, config, colors);
            break;
        case 8:
            currentAnimation = ANIMATIONS.createDecayAnimation(scene, config, colors);
            break;
        case 9:
            currentAnimation = ANIMATIONS.createEntropyAnimation(scene, config, colors);
            break;
        case 10:
            currentAnimation = ANIMATIONS.createInitialConditionsAnimation(scene, config, colors);
            break;
        case 11:
            currentAnimation = ANIMATIONS.createQuantumErasureAnimation(scene, config, colors);
            break;
        case 12:
            currentAnimation = ANIMATIONS.createChainReactionAnimation(scene, config, colors);
            break;
    }
    
    // Set up animation specific controls if the animation provides them
    if (currentAnimation && currentAnimation.setupControls) {
        currentAnimation.setupControls(document.getElementById('animation-specific-controls'));
    }
}

// Clear the scene to prepare for a new animation
function clearScene() {
    while (scene.children.length > 0) {
        const object = scene.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
        scene.remove(object);
    }
    
    // Clear any ongoing animations or timelines
    if (currentAnimation && currentAnimation.dispose) {
        currentAnimation.dispose();
    }
    
    currentAnimation = null;
}

// Clear animation-specific controls
function clearAnimationControls() {
    const controlsContainer = document.getElementById('animation-specific-controls');
    controlsContainer.innerHTML = '';
    animationSpecificControls = {};
}

// Navigation functions
function goToNextVerse() {
    if (currentVerse < 12) {
        currentVerse++;
        transitionToVerse(currentVerse);
    }
}

function goToPrevVerse() {
    if (currentVerse > 1) {
        currentVerse--;
        transitionToVerse(currentVerse);
    }
}

// Animated transition between verses
function transitionToVerse(verseId) {
    // Fade out current content
    gsap.to('#text-overlay', { 
        opacity: 0, 
        duration: 0.5,
        onComplete: () => {
            loadVerse(verseId);
            // Fade in new content
            gsap.to('#text-overlay', { 
                opacity: 1, 
                duration: 0.5 
            });
        }
    });
}

// Reset the current animation
function resetAnimation() {
    clearScene();
    createAnimation(currentVerse);
}

// Toggle visibility of detailed text
function toggleDetails() {
    const details = document.getElementById('content-details');
    const button = document.getElementById('toggle-details');
    
    detailsVisible = !detailsVisible;
    
    if (!detailsVisible) {
        details.classList.add('hidden');
        button.textContent = 'Show Details';
    } else {
        details.classList.remove('hidden');
        button.textContent = 'Hide Details';
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);