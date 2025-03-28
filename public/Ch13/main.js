import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { config } from './config.js';
import { waveCollapseAnimation } from './animations/waveCollapse.js';
import { entanglementAnimation } from './animations/entanglement.js';
import { uncertaintyAnimation } from './animations/uncertainty.js';
import { waveDualityAnimation } from './animations/waveDuality.js';
import { quantumJumpAnimation } from './animations/quantumJump.js';
import { particleDecayAnimation } from './animations/particleDecay.js';
import { superpositionAnimation } from './animations/superposition.js';
import { advancedEntanglementAnimation } from './animations/advancedEntanglement.js';

// Global variables
let currentVerseIndex = 0;
let renderer, scene, camera, controls, composer;
let currentAnimation = null;
let animationFrameId = null;
let clock = new THREE.Clock();

// Initialize the scene
function init() {
    try {
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f0f1a);
        scene.fog = new THREE.FogExp2(0x0f0f1a, 0.05);
        
        // Camera setup
        camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            config.cameraNear, 
            config.cameraFar
        );
        camera.position.set(0, 0, config.cameraDistance);
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('scene-container').appendChild(renderer.domElement);
        
        // Controls setup
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Post-processing
        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.75, // strength
            0.4,  // radius
            0.9   // threshold
        );
        composer.addPass(bloomPass);
        
        // Event listeners
        window.addEventListener('resize', onWindowResize);
        document.getElementById('prev-verse').addEventListener('click', showPreviousVerse);
        document.getElementById('next-verse').addEventListener('click', showNextVerse);
        document.getElementById('toggle-info').addEventListener('click', toggleInfo);
        
        // Load the first verse
        showVerse(currentVerseIndex);
    } catch (error) {
        console.error("Error initializing scene:", error);
        document.getElementById('verse-container').innerHTML = 
            '<div class="error-message">Error loading visualization. Please check console for details.</div>';
    }
}

// Show a specific verse and its animation
function showVerse(index) {
    try {
        // Clear previous animation
        if (currentAnimation) {
            if (typeof currentAnimation.cleanup === 'function') {
                currentAnimation.cleanup();
            }
            scene.clear();
            const controlsPanel = document.getElementById('animation-controls');
            controlsPanel.innerHTML = '';
        }
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        // Reset camera and controls
        camera.position.set(0, 0, config.cameraDistance);
        controls.reset();
        
        // Update verse content
        const verse = config.verses[index];
        document.getElementById('verse-number').textContent = verse.number;
        document.getElementById('verse-text').textContent = verse.text;
        document.getElementById('madhyamaka-concept').textContent = verse.madhyamakaConcept;
        document.getElementById('quantum-parallel').textContent = verse.quantumParallel;
        document.getElementById('accessible-explanation').textContent = verse.accessibleExplanation;
        
        // Basic lighting for all scenes
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Load the appropriate animation
        switch (verse.animationType) {
            case 'waveCollapse':
                currentAnimation = waveCollapseAnimation(scene, camera, controls);
                break;
            case 'entanglement':
                currentAnimation = entanglementAnimation(scene, camera, controls);
                break;
            case 'uncertainty':
                currentAnimation = uncertaintyAnimation(scene, camera, controls);
                break;
            case 'waveDuality':
                currentAnimation = waveDualityAnimation(scene, camera, controls);
                break;
            case 'quantumJump':
                currentAnimation = quantumJumpAnimation(scene, camera, controls);
                break;
            case 'particleDecay':
                currentAnimation = particleDecayAnimation(scene, camera, controls);
                break;
            case 'superposition':
                currentAnimation = superpositionAnimation(scene, camera, controls);
                break;
            case 'advancedEntanglement':
                currentAnimation = advancedEntanglementAnimation(scene, camera, controls);
                break;
            default:
                console.error('Unknown animation type:', verse.animationType);
        }
        
        // Start the animation loop
        animate();
    } catch (error) {
        console.error("Error showing verse:", error);
        document.getElementById('verse-container').innerHTML += 
            '<div class="error-message">Error loading animation. Please check console for details.</div>';
    }
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    const deltaTime = clock.getDelta();
    
    // Update controls
    controls.update();
    
    // Update the current animation
    if (currentAnimation && typeof currentAnimation.update === 'function') {
        currentAnimation.update(deltaTime);
    }
    
    // Render
    composer.render();
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Navigation functions
function showNextVerse() {
    currentVerseIndex = (currentVerseIndex + 1) % config.verses.length;
    showVerse(currentVerseIndex);
}

function showPreviousVerse() {
    currentVerseIndex = (currentVerseIndex - 1 + config.verses.length) % config.verses.length;
    showVerse(currentVerseIndex);
}

// Toggle info panel for mobile
function toggleInfo() {
    const verseContainer = document.getElementById('verse-container');
    const toggleButton = document.getElementById('toggle-info');
    
    if (verseContainer.classList.contains('hidden')) {
        verseContainer.classList.remove('hidden');
        toggleButton.textContent = 'Hide Text';
    } else {
        verseContainer.classList.add('hidden');
        toggleButton.textContent = 'Show Text';
    }
}

// Check URL for verse parameter
function checkURLForVerse() {
    const hash = window.location.hash;
    if (hash) {
        const verseParam = hash.split('=')[1];
        if (verseParam) {
            const verseIndex = parseInt(verseParam) - 1; // Convert to 0-based index
            if (verseIndex >= 0 && verseIndex < config.verses.length) {
                currentVerseIndex = verseIndex;
            }
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkURLForVerse();
    init();
});

