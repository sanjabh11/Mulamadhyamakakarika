import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses, animationConfigs, colorSchemes } from './config.js'; // Import from Ch26 config
import * as ANIMATIONS from './animations.js'; // Import from Ch26 animations
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

// Core app state
let currentVerse = 1;
let scene, camera, renderer, composer, controls;
let currentAnimation = null;
let isMobile = window.innerWidth < 768;

// DOM Elements
const sidePanel = document.getElementById('sidePanel');
const panelToggle = document.getElementById('panelToggle');
const verseButtons = document.querySelectorAll('.nav-button');
const verseDetails = document.getElementById('verseDetails');
const controlsContainer = document.getElementById('controlsContainer');
const canvasContainer = document.getElementById('canvasContainer');
const mobileTooltip = document.getElementById('mobileTooltip');
const explanationHeader = document.getElementById('explanationHeader');
const explanationContent = document.getElementById('explanationContent');
const controlsHeader = document.getElementById('controlsHeader');
const controlsContentWrapper = document.getElementById('controlsContentWrapper');


// Initialize the application
init();

// Setup event listeners
function setupEventListeners() {
    // Panel toggle
    panelToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('collapsed');
        // Canvas resize is handled by the window resize event listener
    });

    // Verse navigation
    verseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const verseId = parseInt(button.getAttribute('data-verse'));
            if (verseId !== currentVerse) {
                changeVerse(verseId);
            }
        });
    });

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Check if mobile
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < 768;
        if (isMobile) {
            showMobileTooltip();
        }
        // Also trigger canvas resize immediately on mobile resize
        onWindowResize();
    });

    // Handle touch events for mobile
    document.addEventListener('touchstart', () => {
        if (isMobile) {
            hideMobileTooltip();
        }
    });

    // Collapsible sections
    explanationHeader.addEventListener('click', () => {
        explanationHeader.classList.toggle('collapsed');
        explanationContent.classList.toggle('hidden');
    });

    controlsHeader.addEventListener('click', () => {
        controlsHeader.classList.toggle('collapsed');
        controlsContentWrapper.classList.toggle('hidden');
    });
}

// Initialize the 3D scene
function init() {
    // Create the THREE.js scene
    setupScene();

    // Setup initial verse
    updateVerseDetails(currentVerse);
    loadAnimation(currentVerse);

    // Setup event listeners
    setupEventListeners();

    // Start animation loop
    animate();

    // Show mobile tooltip if needed
    if (isMobile) {
        showMobileTooltip();
    }

    // Optionally start with sections collapsed on mobile
    if (isMobile) {
        explanationHeader.classList.add('collapsed');
        explanationContent.classList.add('hidden');
        controlsHeader.classList.add('collapsed');
        controlsContentWrapper.classList.add('hidden');
    } else {
         // Start with explanation expanded, controls collapsed by default on desktop
        controlsHeader.classList.add('collapsed');
        controlsContentWrapper.classList.add('hidden');
    }
}

// Setup the THREE.js scene
function setupScene() {
    // Create scene
    scene = new THREE.Scene();
    // Background will be set per verse

    // Create camera
    camera = new THREE.PerspectiveCamera(70, getAspectRatio(), 0.1, 1000); // Use 70 FOV like Ch26_backup
    camera.position.z = 15; // Use 15 Z like Ch26_backup

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Use alpha like Ch26_backup
    renderer.setSize(getCanvasWidth(), getCanvasHeight());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Create orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8; // Use Ch26_backup speed
    controls.zoomSpeed = 0.9;   // Use Ch26_backup speed
    controls.panSpeed = 0.8;    // Use Ch26_backup speed
    controls.minDistance = 5;   // Use Ch26_backup distance
    controls.maxDistance = 30;  // Use Ch26_backup distance

    // Setup post-processing (Keep from Ch5 template)
    setupPostProcessing();
}

// Setup post-processing effects
function setupPostProcessing() {
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(getCanvasWidth(), getCanvasHeight()),
        0.8,  // strength
        0.3,  // radius
        0.9   // threshold
    );

    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Run current animation update function if it exists
    if (currentAnimation && currentAnimation.update) {
        currentAnimation.update();
    }

    // Render scene with post-processing
    composer.render();
}

// Handle window resize
function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();

    // Update renderer and composer size
    renderer.setSize(getCanvasWidth(), getCanvasHeight());
    composer.setSize(getCanvasWidth(), getCanvasHeight());
}


// Calculate aspect ratio for the canvas
function getAspectRatio() {
    const width = getCanvasWidth();
    const height = getCanvasHeight();
    return width > 0 && height > 0 ? width / height : 1;
}

// Get canvas width accounting for panel
function getCanvasWidth() {
    return canvasContainer.clientWidth;
}

// Get canvas height
function getCanvasHeight() {
    return canvasContainer.clientHeight;
}

// Change to a different verse
function changeVerse(verseId) {
    // Update active button
    verseButtons.forEach(button => {
        if (parseInt(button.getAttribute('data-verse')) === verseId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Fade out current content (similar to Ch26_backup transition)
    gsap.to([verseDetails, controlsContainer], {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            // Update verse details
            updateVerseDetails(verseId);

            // Load new animation
            loadAnimation(verseId);

            // Update current verse
            currentVerse = verseId;

            // Fade in new content
            gsap.to([verseDetails, controlsContainer], {
                opacity: 1,
                duration: 0.3
            });

            // Show mobile tooltip if needed
            if (isMobile) {
                showMobileTooltip();
            }
        }
    });
}

// Update verse details in the side panel
function updateVerseDetails(verseId) {
    const verse = verses.find(v => v.id === verseId);
    if (!verse) return;

    // Use property names from Ch26 config
    verseDetails.innerHTML = `
        <div class="verse-text">${verse.text}</div>

        <div class="concept-section">
            <h4>Madhyamaka Concept</h4>
            <p>${verse.madhyamakaConcept}</p>
        </div>

        <div class="concept-section">
            <h4>Quantum Physics Parallel</h4>
            <p>${verse.quantumParallel}</p>
        </div>

        <div class="concept-section">
            <h4>Accessible Explanation</h4>
            <p>${verse.accessibleExplanation}</p>
        </div>
    `;
}

// Load animation for a specific verse
function loadAnimation(verseId) {
    // Clear current animation and scene objects
    clearScene();

    const config = animationConfigs[verseId];
    const colors = colorSchemes[verseId];

    // Set scene background for this verse
    scene.background = new THREE.Color(colors.background);

    // Clear previous animation-specific controls
    controlsContainer.innerHTML = ''; // Clear container first
    // Add back the title
    const title = document.createElement('h3');
    title.textContent = 'Animation Controls';
    controlsContainer.appendChild(title);


    // Create animation based on verse ID using imported functions
    switch (verseId) {
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
        default:
            console.error(`No animation found for verse ${verseId}`);
            currentAnimation = null;
    }

    // Set up animation specific controls if the animation provides them
    if (currentAnimation && currentAnimation.setupControls) {
        currentAnimation.setupControls(controlsContainer); // Pass the container
    }

    // Reset camera position for new animation
    camera.position.set(0, 0, 15);
    controls.target.set(0, 0, 0); // Reset target as well
    controls.update();
}

// Clear all objects from the scene and dispose animation
function clearScene() {
    // Dispose current animation first
    if (currentAnimation && currentAnimation.dispose) {
        try {
            currentAnimation.dispose();
        } catch (error) {
            console.error("Error disposing animation:", error);
        }
    }
    currentAnimation = null;

    // Remove all objects from the scene
    while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);

        // Dispose geometry and material
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            // Check if material is an array
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
        // Recursively dispose children if it's a group
        if (object.children && object.children.length > 0) {
             // Make a copy of the children array before iterating
            const childrenCopy = [...object.children];
            childrenCopy.forEach(child => {
                 // Remove child from parent before disposing
                 object.remove(child);
                 if (child.geometry) child.geometry.dispose();
                 if (child.material) {
                     if (Array.isArray(child.material)) {
                         child.material.forEach(material => material.dispose());
                     } else {
                         child.material.dispose();
                     }
                 }
            });
        }
    }

    // Add back essential lights if needed (or handle in animation setup)
    // Example: Add a default ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Default light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

// Show mobile tooltip
function showMobileTooltip() {
    mobileTooltip.classList.add('visible');
    setTimeout(() => {
        hideMobileTooltip();
    }, 3000);
}

// Hide mobile tooltip
function hideMobileTooltip() {
    mobileTooltip.classList.remove('visible');
}