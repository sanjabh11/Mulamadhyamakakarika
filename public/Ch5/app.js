import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config, verses } from './config.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Water } from 'three/addons/objects/Water.js';
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

// Initialize the application
init();

// Setup event listeners
function setupEventListeners() {
    // Panel toggle
    panelToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('collapsed');
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
    });

    // Handle touch events for mobile
    document.addEventListener('touchstart', () => {
        if (isMobile) {
            hideMobileTooltip();
        }
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
}

// Setup the THREE.js scene
function setupScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, getAspectRatio(), 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(getCanvasWidth(), getCanvasHeight());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);
    
    // Create orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Setup post-processing
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
    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();
    renderer.setSize(getCanvasWidth(), getCanvasHeight());
    composer.setSize(getCanvasWidth(), getCanvasHeight());
}

// Calculate aspect ratio for the canvas
function getAspectRatio() {
    return getCanvasWidth() / getCanvasHeight();
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
    
    // Update verse details
    updateVerseDetails(verseId);
    
    // Load new animation
    loadAnimation(verseId);
    
    // Update current verse
    currentVerse = verseId;
    
    // Show mobile tooltip if needed
    if (isMobile) {
        showMobileTooltip();
    }
}

// Update verse details in the side panel
function updateVerseDetails(verseId) {
    const verse = verses.find(v => v.id === verseId);
    if (!verse) return;
    
    verseDetails.innerHTML = `
        <div class="verse-text">${verse.text}</div>
        
        <div class="concept-section">
            <h4>Madhyamaka Concept</h4>
            <p>${verse.concept}</p>
        </div>
        
        <div class="concept-section">
            <h4>Quantum Physics Parallel</h4>
            <p>${verse.physics}</p>
        </div>
        
        <div class="concept-section">
            <h4>Accessible Explanation</h4>
            <p>${verse.explanation}</p>
        </div>
    `;
}

// Load animation for a specific verse
function loadAnimation(verseId) {
    // Clear current animation
    if (currentAnimation && currentAnimation.dispose) {
        currentAnimation.dispose();
    }
    
    // Clear scene
    clearScene();
    
    // Load new animation based on verse ID
    switch (verseId) {
        case 1:
            currentAnimation = loadVerse1Animation();
            break;
        case 2:
            currentAnimation = loadVerse2Animation();
            break;
        case 3:
            currentAnimation = loadVerse3Animation();
            break;
        case 4:
            currentAnimation = loadVerse4Animation();
            break;
        case 5:
            currentAnimation = loadVerse5Animation();
            break;
        case 6:
            currentAnimation = loadVerse6Animation();
            break;
        case 7:
            currentAnimation = loadVerse7Animation();
            break;
        case 8:
            currentAnimation = loadVerse8Animation();
            break;
    }
    
    // Update controls for this animation
    updateControls(verseId);
}

// Clear all objects from the scene
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
}

// Update control panel based on verse
function updateControls(verseId) {
    controlsContainer.innerHTML = '';
    
    switch (verseId) {
        case 1:
            // Grid space controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <button id="triggerRipple" class="button-control">Generate Quantum Field</button>
                </div>
                <div class="control-item">
                    <label for="gridDensity">Grid Density</label>
                    <input type="range" id="gridDensity" class="slider" min="10" max="30" value="${config.verse1.gridSize}">
                </div>
                <div class="control-item">
                    <label for="rippleSpeed">Ripple Speed</label>
                    <input type="range" id="rippleSpeed" class="slider" min="0.1" max="1" step="0.1" value="${config.verse1.rippleSpeed}">
                </div>
            `;
            
            // Add event listeners for controls
            document.getElementById('triggerRipple').addEventListener('click', () => {
                if (currentAnimation.triggerRipple) {
                    currentAnimation.triggerRipple();
                }
            });
            
            document.getElementById('gridDensity').addEventListener('input', (e) => {
                if (currentAnimation.updateGridDensity) {
                    currentAnimation.updateGridDensity(parseInt(e.target.value));
                }
            });
            
            document.getElementById('rippleSpeed').addEventListener('input', (e) => {
                if (currentAnimation.updateRippleSpeed) {
                    currentAnimation.updateRippleSpeed(parseFloat(e.target.value));
                }
            });
            break;
        
        case 2:
            // Blob controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <label>Hover over the blob to define its form</label>
                </div>
                <div class="control-item">
                    <label for="blobComplexity">Blob Complexity</label>
                    <input type="range" id="blobComplexity" class="slider" min="1" max="5" step="0.1" value="${config.verse2.complexity}">
                </div>
                <div class="control-item">
                    <label for="pulseSpeed">Pulse Speed</label>
                    <input type="range" id="pulseSpeed" class="slider" min="0.5" max="3" step="0.1" value="${config.verse2.pulseSpeed}">
                </div>
            `;
            
            document.getElementById('blobComplexity').addEventListener('input', (e) => {
                if (currentAnimation.updateComplexity) {
                    currentAnimation.updateComplexity(parseFloat(e.target.value));
                }
            });
            
            document.getElementById('pulseSpeed').addEventListener('input', (e) => {
                if (currentAnimation.updatePulseSpeed) {
                    currentAnimation.updatePulseSpeed(parseFloat(e.target.value));
                }
            });
            break;
        
        case 3:
            // Chameleon controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <label for="backgroundColor">Background Color</label>
                    <input type="range" id="backgroundColor" class="slider" min="0" max="100" value="50">
                </div>
                <div class="control-item">
                    <label for="transitionSpeed">Transition Speed</label>
                    <input type="range" id="transitionSpeed" class="slider" min="0.2" max="2" step="0.1" value="${config.verse3.transitionSpeed}">
                </div>
            `;
            
            document.getElementById('backgroundColor').addEventListener('input', (e) => {
                if (currentAnimation.updateBackgroundColor) {
                    currentAnimation.updateBackgroundColor(parseInt(e.target.value));
                }
            });
            
            document.getElementById('transitionSpeed').addEventListener('input', (e) => {
                if (currentAnimation.updateTransitionSpeed) {
                    currentAnimation.updateTransitionSpeed(parseFloat(e.target.value));
                }
            });
            break;
        
        case 4:
            // Mirror reflection controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <button id="moveObject" class="button-control">Move Object</button>
                    <button id="breakMirror" class="button-control">Break Mirror</button>
                </div>
                <div class="control-item">
                    <button id="resetScene" class="button-control">Reset Scene</button>
                </div>
                <div class="control-item">
                    <label for="objectBrightness">Object Brightness</label>
                    <input type="range" id="objectBrightness" class="slider" min="0.5" max="2.5" step="0.1" value="1.5">
                </div>
            `;
            
            document.getElementById('moveObject').addEventListener('click', () => {
                if (currentAnimation.moveObject) {
                    currentAnimation.moveObject();
                }
            });
            
            document.getElementById('breakMirror').addEventListener('click', () => {
                if (currentAnimation.breakMirror) {
                    currentAnimation.breakMirror();
                }
            });
            
            document.getElementById('resetScene').addEventListener('click', () => {
                if (currentAnimation.resetScene) {
                    currentAnimation.resetScene();
                }
            });
            
            document.getElementById('objectBrightness').addEventListener('input', (e) => {
                if (currentAnimation.updateBrightness) {
                    currentAnimation.updateBrightness(parseFloat(e.target.value));
                }
            });
            break;
        
        case 5:
            // Ocean wave controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <label>Scroll to zoom in and see only waves</label>
                </div>
                <div class="control-item">
                    <label for="waveHeight">Wave Height</label>
                    <input type="range" id="waveHeight" class="slider" min="0.2" max="1.5" step="0.1" value="${config.verse5.waveHeight}">
                </div>
                <div class="control-item">
                    <label for="waveSpeed">Wave Speed</label>
                    <input type="range" id="waveSpeed" class="slider" min="0.5" max="2" step="0.1" value="${config.verse5.waveSpeed}">
                </div>
            `;
            
            document.getElementById('waveHeight').addEventListener('input', (e) => {
                if (currentAnimation.updateWaveHeight) {
                    currentAnimation.updateWaveHeight(parseFloat(e.target.value));
                }
            });
            
            document.getElementById('waveSpeed').addEventListener('input', (e) => {
                if (currentAnimation.updateWaveSpeed) {
                    currentAnimation.updateWaveSpeed(parseFloat(e.target.value));
                }
            });
            break;
        
        case 6:
            // Light bulb controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <label for="dimmerSlider">Dimmer Level</label>
                    <input type="range" id="dimmerSlider" class="slider" min="0" max="100" value="50">
                </div>
                <div class="control-item">
                    <button id="measureState" class="button-control">Measure State</button>
                </div>
                <div class="control-item">
                    <button id="resetBulb" class="button-control">Reset Bulb</button>
                </div>
            `;
            
            document.getElementById('dimmerSlider').addEventListener('input', (e) => {
                if (currentAnimation.updateDimmer) {
                    currentAnimation.updateDimmer(parseInt(e.target.value));
                }
            });
            
            document.getElementById('measureState').addEventListener('click', () => {
                if (currentAnimation.measureState) {
                    currentAnimation.measureState();
                }
            });
            
            document.getElementById('resetBulb').addEventListener('click', () => {
                if (currentAnimation.resetBulb) {
                    currentAnimation.resetBulb();
                }
            });
            break;
        
        case 7:
            // Quantum vacuum controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <label>Zoom in to see quantum activity</label>
                </div>
                <div class="control-item">
                    <label for="particleDensity">Particle Density</label>
                    <input type="range" id="particleDensity" class="slider" min="1000" max="5000" step="100" value="${config.verse7.particleCount}">
                </div>
                <div class="control-item">
                    <label for="emergenceRate">Emergence Rate</label>
                    <input type="range" id="emergenceRate" class="slider" min="0.2" max="1.5" step="0.1" value="${config.verse7.emergenceRate}">
                </div>
            `;
            
            document.getElementById('particleDensity').addEventListener('input', (e) => {
                if (currentAnimation.updateParticleDensity) {
                    currentAnimation.updateParticleDensity(parseInt(e.target.value));
                }
            });
            
            document.getElementById('emergenceRate').addEventListener('input', (e) => {
                if (currentAnimation.updateEmergenceRate) {
                    currentAnimation.updateEmergenceRate(parseFloat(e.target.value));
                }
            });
            break;
        
        case 8:
            // Glass water controls
            controlsContainer.innerHTML = `
                <div class="control-item">
                    <label>Drag to tilt the glass</label>
                </div>
                <div class="control-item">
                    <label for="rotationAxis">Rotation Axis</label>
                    <select id="rotationAxis" class="control-select">
                        <option value="x">X Axis</option>
                        <option value="z" selected>Z Axis</option>
                    </select>
                </div>
                <div class="control-item">
                    <button id="resetGlass" class="button-control">Reset Glass</button>
                </div>
            `;
            
            document.getElementById('rotationAxis').addEventListener('change', (e) => {
                if (currentAnimation.changeRotationAxis) {
                    currentAnimation.changeRotationAxis(e.target.value);
                }
            });
            
            document.getElementById('resetGlass').addEventListener('click', () => {
                if (currentAnimation.resetGlass) {
                    currentAnimation.resetGlass();
                }
            });
            break;
    }
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

//==============================================================================
// VERSE 1: Space Grid Animation
//==============================================================================
function loadVerse1Animation() {
    // Settings
    const settings = config.verse1;
    let gridSize = settings.gridSize;
    let rippling = false;
    
    // Create objects
    const gridGroup = new THREE.Group();
    scene.add(gridGroup);
    
    // Set camera position
    camera.position.set(0, 0, 30);
    controls.update();
    
    // Create grid
    function createGrid() {
        // Clear previous grid
        while (gridGroup.children.length > 0) {
            const line = gridGroup.children[0];
            line.geometry.dispose();
            line.material.dispose();
            gridGroup.remove(line);
        }
        
        const size = 20;
        const divisions = gridSize;
        
        // Create grid lines
        for (let i = -divisions; i <= divisions; i++) {
            // X axis lines
            const xLineMaterial = new THREE.LineBasicMaterial({ 
                color: settings.gridColor,
                transparent: true,
                opacity: 0.4
            });
            const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-size, 0, i * (size/divisions)),
                new THREE.Vector3(size, 0, i * (size/divisions))
            ]);
            const xLine = new THREE.Line(xLineGeometry, xLineMaterial);
            xLine.userData = { originalColor: settings.gridColor, type: 'grid' };
            gridGroup.add(xLine);
            
            // Z axis lines
            const zLineMaterial = new THREE.LineBasicMaterial({ 
                color: settings.gridColor,
                transparent: true,
                opacity: 0.4
            });
            const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i * (size/divisions), 0, -size),
                new THREE.Vector3(i * (size/divisions), 0, size)
            ]);
            const zLine = new THREE.Line(zLineGeometry, zLineMaterial);
            zLine.userData = { originalColor: settings.gridColor, type: 'grid' };
            gridGroup.add(zLine);
        }
        
        // Add quantum particles (initially invisible)
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = settings.particleDensity;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * size * 2;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 5;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * size * 2;
            particleSizes[i] = Math.random() * 0.5;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: settings.activeColor,
            size: 0.2,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData = { type: 'particles' };
        gridGroup.add(particles);
        
        // Rotate grid for better viewing angle
        gridGroup.rotation.x = Math.PI / 4;
    }
    
    // Create initial grid
    createGrid();
    
    // Trigger ripple effect
    function triggerRipple() {
        rippling = true;
        
        // Find and animate particles
        const particles = gridGroup.children.find(child => child.userData.type === 'particles');
        if (particles) {
            gsap.to(particles.material, {
                opacity: 0.8,
                duration: 2,
                ease: "power2.out"
            });
        }
        
        // Animate grid lines
        gridGroup.children.forEach(child => {
            if (child.userData.type === 'grid') {
                gsap.to(child.material, {
                    color: settings.activeColor,
                    opacity: 0.8,
                    duration: 1.5,
                    ease: "power2.out"
                });
            }
        });
        
        // Revert after some time
        setTimeout(() => {
            revertRipple();
        }, 5000);
    }
    
    // Revert ripple effect
    function revertRipple() {
        rippling = false;
        
        // Find and animate particles
        const particles = gridGroup.children.find(child => child.userData.type === 'particles');
        if (particles) {
            gsap.to(particles.material, {
                opacity: 0,
                duration: 3,
                ease: "power2.in"
            });
        }
        
        // Animate grid lines
        gridGroup.children.forEach(child => {
            if (child.userData.type === 'grid') {
                gsap.to(child.material, {
                    color: child.userData.originalColor,
                    opacity: 0.4,
                    duration: 2,
                    ease: "power2.in"
                });
            }
        });
    }
    
    // Update grid density
    function updateGridDensity(newSize) {
        gridSize = newSize;
        createGrid();
    }
    
    // Update ripple speed
    function updateRippleSpeed(speed) {
        settings.rippleSpeed = speed;
    }
    
    // Animation update
    function update() {
        // Animate particles if rippling
        if (rippling) {
            const particles = gridGroup.children.find(child => child.userData.type === 'particles');
            if (particles) {
                const positions = particles.geometry.attributes.position.array;
                const sizes = particles.geometry.attributes.size.array;
                
                for (let i = 0; i < settings.particleDensity; i++) {
                    const i3 = i * 3;
                    positions[i3 + 1] = Math.sin(Date.now() * 0.001 * settings.rippleSpeed + i) * 0.5;
                    sizes[i] = (Math.sin(Date.now() * 0.002 * settings.rippleSpeed + i) + 1.5) * 0.3;
                }
                
                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.size.needsUpdate = true;
            }
        }
        
        // Subtle animation for grid even when not rippling
        gridGroup.rotation.y += 0.001;
    }
    
    // Interaction setup
    renderer.domElement.addEventListener('click', triggerRipple);
    
    // Clean up function
    function dispose() {
        renderer.domElement.removeEventListener('click', triggerRipple);
    }
    
    // Return animation controller
    return {
        update,
        dispose,
        triggerRipple,
        updateGridDensity,
        updateRippleSpeed
    };
}

//==============================================================================
// VERSE 2: Blob Animation
//==============================================================================
function loadVerse2Animation() {
    // Settings
    const settings = config.verse2;
    let complexity = settings.complexity;
    let pulseSpeed = settings.pulseSpeed;
    let isHovering = false;
    
    // Set camera position
    camera.position.set(0, 0, 5);
    controls.update();
    
    // Create blob mesh
    const blobGeometry = new THREE.SphereGeometry(1, 128, 128);
    const blobMaterial = new THREE.MeshStandardMaterial({
        color: settings.blobColor,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7
    });
    const blob = new THREE.Mesh(blobGeometry, blobMaterial);
    scene.add(blob);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);
    
    // Noise for blob deformation
    const noiseOffsets = [];
    const vertexCount = blobGeometry.attributes.position.count;
    for (let i = 0; i < vertexCount; i++) {
        noiseOffsets.push(Math.random() * 100);
    }
    
    // Store original vertex positions
    const originalPositions = new Float32Array(blobGeometry.attributes.position.array);
    
    // Mouse tracking
    const mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    
    function onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Check if mouse is over blob
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(blob);
        
        isHovering = intersects.length > 0;
        
        if (isHovering) {
            // Change to defined state
            gsap.to(blob.material, {
                color: settings.definedColor,
                roughness: 0.3,
                metalness: 0.7,
                opacity: 1,
                duration: 0.5
            });
        } else {
            // Change back to undefined state
            gsap.to(blob.material, {
                color: settings.blobColor,
                roughness: 0.8,
                metalness: 0.2,
                opacity: 0.7,
                duration: 0.8
            });
        }
    }
    
    // Touch event for mobile
    function onTouch(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const fakeEvent = { clientX: touch.clientX, clientY: touch.clientY };
        onMouseMove(fakeEvent);
    }
    
    // Add event listeners
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('touchmove', onTouch);
    renderer.domElement.addEventListener('touchstart', onTouch);
    
    // Update functions
    function updateComplexity(newComplexity) {
        complexity = newComplexity;
    }
    
    function updatePulseSpeed(newSpeed) {
        pulseSpeed = newSpeed;
    }
    
    // Animation update
    function update() {
        const positions = blobGeometry.attributes.position.array;
        const time = Date.now() * 0.001 * pulseSpeed;
        
        // Deform the blob using simplex noise (approximated with sine waves)
        for (let i = 0; i < vertexCount; i++) {
            const i3 = i * 3;
            const originalX = originalPositions[i3];
            const originalY = originalPositions[i3 + 1];
            const originalZ = originalPositions[i3 + 2];
            
            // Calculate deformation amount
            let deformation = Math.sin(time + noiseOffsets[i]) * 0.05 * complexity;
            
            // If hovering, reduce deformation
            if (isHovering) {
                deformation *= 0.2;
            }
            
            // Apply deformation based on original position
            positions[i3] = originalX * (1 + deformation);
            positions[i3 + 1] = originalY * (1 + deformation);
            positions[i3 + 2] = originalZ * (1 + deformation);
        }
        
        blobGeometry.attributes.position.needsUpdate = true;
        blobGeometry.computeVertexNormals();
        
        // Rotate blob slowly
        blob.rotation.y += 0.003;
        blob.rotation.x += 0.001;
    }
    
    // Clean up function
    function dispose() {
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('touchmove', onTouch);
        renderer.domElement.removeEventListener('touchstart', onTouch);
    }
    
    // Return animation controller
    return {
        update,
        dispose,
        updateComplexity,
        updatePulseSpeed
    };
}

//==============================================================================
// VERSE 3: Chameleon Animation
//==============================================================================
function loadVerse3Animation() {
    // Settings
    const settings = config.verse3;
    let transitionSpeed = settings.transitionSpeed;
    let backgroundColor = 50; // 0-100 range
    
    // Set camera position
    camera.position.set(0, 1, 5);
    controls.update();
    
    // Create scene background
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Create chameleon
    const chameleonGroup = new THREE.Group();
    scene.add(chameleonGroup);
    
    // Create simplified chameleon shape
    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.5, 1.5, 5, 8),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
    );
    body.rotation.z = Math.PI / 2;
    chameleonGroup.add(body);
    
    // Create head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
    );
    head.position.set(1, 0.2, 0);
    chameleonGroup.add(head);
    
    // Create tail
    const tailCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.7, 0, 0),
        new THREE.Vector3(-1.5, 0, 0.5),
        new THREE.Vector3(-2.2, 0, -0.5),
        new THREE.Vector3(-2.5, 0, 0)
    );
    
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.15, 8, false);
    const tail = new THREE.Mesh(
        tailGeometry,
        new THREE.MeshStandardMaterial({ color: 0x777777 })
    );
    chameleonGroup.add(tail);
    
    // Create legs
    function createLeg(x, y, z, rotation) {
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.05, 0.6, 8),
            new THREE.MeshStandardMaterial({ color: 0x777777 })
        );
        leg.position.set(x, y, z);
        leg.rotation.set(0, 0, rotation);
        return leg;
    }
    
    // Front legs
    chameleonGroup.add(createLeg(0.5, -0.3, 0.3, Math.PI / 4));
    chameleonGroup.add(createLeg(0.5, -0.3, -0.3, Math.PI / 4));
    
    // Back legs
    chameleonGroup.add(createLeg(-0.5, -0.3, 0.3, -Math.PI / 4));
    chameleonGroup.add(createLeg(-0.5, -0.3, -0.3, -Math.PI / 4));
    
    // Create eyes (spheres)
    function createEye(x, y, z) {
        const eyeGroup = new THREE.Group();
        
        // Eye ball
        const eye = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        
        // Pupil
        const pupil = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        pupil.position.set(0.07, 0, 0);
        
        eyeGroup.add(eye);
        eyeGroup.add(pupil);
        eyeGroup.position.set(x, y, z);
        
        return eyeGroup;
    }
    
    // Add eyes
    const leftEye = createEye(1.2, 0.3, 0.25);
    const rightEye = createEye(1.2, 0.3, -0.25);
    chameleonGroup.add(leftEye);
    chameleonGroup.add(rightEye);
    
    // Create branch
    const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.15, 8, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.1
        })
    );
    branch.rotation.z = Math.PI / 2;
    branch.position.y = -0.5;
    scene.add(branch);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Function to update chameleon color based on background
    function updateChameleonColor() {
        // Map 0-100 to a color spectrum
        // Using a gradient from blue to red through green
        let color;
        
        if (backgroundColor < 33) {
            // Blue to green
            const t = backgroundColor / 33;
            color = new THREE.Color(0x2255aa).lerp(new THREE.Color(0x55aa55), t);
        } else if (backgroundColor < 66) {
            // Green to orange
            const t = (backgroundColor - 33) / 33;
            color = new THREE.Color(0x55aa55).lerp(new THREE.Color(0xdd8833), t);
        } else {
            // Orange to red
            const t = (backgroundColor - 66) / 34;
            color = new THREE.Color(0xdd8833).lerp(new THREE.Color(0xff5588), t);
        }
        
        // Update all chameleon parts
        chameleonGroup.traverse((child) => {
            if (child.isMesh && child.material.color && 
                child.material !== leftEye.children[0].material && 
                child.material !== rightEye.children[0].material &&
                child.material !== leftEye.children[1].material && 
                child.material !== rightEye.children[1].material) {
                
                gsap.to(child.material.color, {
                    r: color.r,
                    g: color.g,
                    b: color.b,
                    duration: transitionSpeed,
                    ease: "sine.inOut"
                });
            }
        });
        
        // Update background color slightly
        const bgColor = color.clone().multiplyScalar(0.3);
        gsap.to(scene.background, {
            r: bgColor.r,
            g: bgColor.g,
            b: bgColor.b,
            duration: transitionSpeed,
            ease: "sine.inOut"
        });
    }
    
    // Update functions
    function updateBackgroundColor(value) {
        backgroundColor = value;
        updateChameleonColor();
    }
    
    function updateTransitionSpeed(speed) {
        transitionSpeed = speed;
    }
    
    // Set initial chameleon color
    updateChameleonColor();
    
    // Animation update
    function update() {
        // Slightly animate chameleon breathing
        const breathAmount = Math.sin(Date.now() * 0.002) * 0.03;
        body.scale.set(1 + breathAmount, 1 + breathAmount, 1 + breathAmount);
        
        // Animate tail subtle movement
        tail.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Occasionally blink eyes
        if (Math.random() < 0.005) {
            // Blink by scaling the y-axis of the eyeballs
            [leftEye.children[0], rightEye.children[0]].forEach(eye => {
                gsap.to(eye.scale, {
                    y: 0.1,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(eye.scale, {
                            y: 1,
                            duration: 0.1
                        });
                    }
                });
            });
        }
    }
    
    // Clean up function
    function dispose() {
        // Cleanup function if needed
    }
    
    // Return animation controller
    return {
        update,
        dispose,
        updateBackgroundColor,
        updateTransitionSpeed
    };
}

//==============================================================================
// VERSE 4: Mirror Reflection Animation
//==============================================================================
function loadVerse4Animation() {
    // Settings
    const settings = config.verse4;
    let mirrorBroken = false;
    let objectMoved = false;
    
    // Set camera position
    camera.position.set(0, 2, 8);
    controls.update();
    
    // Create scene
    scene.background = new THREE.Color(0x222222);
    
    // Create ground
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2
        })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);
    
    // Create central object (a glowing orb)
    const objectGeometry = new THREE.SphereGeometry(1, 32, 32);
    const objectMaterial = new THREE.MeshStandardMaterial({
        color: settings.objectColor,
        emissive: settings.objectColor,
        emissiveIntensity: settings.environmentIntensity,
        roughness: 0.2,
        metalness: 0.8
    });
    const glowingObject = new THREE.Mesh(objectGeometry, objectMaterial);
    glowingObject.position.set(0, 0, -2);
    scene.add(glowingObject);
    
    // Create mirror
    const mirrorGeometry = new THREE.BoxGeometry(6, 4, 0.2);
    const mirrorMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.0
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.set(0, 0, 2);
    scene.add(mirror);
    
    // Create mirror frame
    const frameGeometry = new THREE.BoxGeometry(6.5, 4.5, 0.3);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x885522,
        roughness: 0.8,
        metalness: 0.2
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0, 1.9);
    scene.add(frame);
    
    // Create reflection (a duplicate of the glowing object)
    const reflectionGeometry = new THREE.SphereGeometry(1, 32, 32);
    const reflectionMaterial = new THREE.MeshStandardMaterial({
        color: settings.objectColor,
        emissive: settings.objectColor,
        emissiveIntensity: settings.environmentIntensity * 0.8,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });
    const reflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
    updateReflectionPosition();
    scene.add(reflection);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Helper function to update reflection position
    function updateReflectionPosition() {
        if (objectMoved || mirrorBroken) {
            reflection.visible = false;
            return;
        }
        
        // Calculate reflection position (mirror position + distance equal to object distance)
        const objectDistance = glowingObject.position.z - mirror.position.z;
        reflection.position.x = glowingObject.position.x;
        reflection.position.y = glowingObject.position.y;
        reflection.position.z = mirror.position.z + Math.abs(objectDistance);
        reflection.visible = true;
    }
    
    // Action functions
    function moveObject() {
        if (!objectMoved) {
            gsap.to(glowingObject.position, {
                x: 4,
                y: 1,
                duration: 2,
                ease: "power2.inOut",
                onUpdate: updateReflectionPosition,
                onComplete: () => {
                    objectMoved = true;
                    updateReflectionPosition();
                    
                    // Dim the object gradually
                    gsap.to(glowingObject.material, {
                        emissiveIntensity: 0.2,
                        duration: 1.5
                    });
                }
            });
        }
    }
    
    function breakMirror() {
        if (!mirrorBroken) {
            mirrorBroken = true;
            
            // Create mirror shards
            const shards = new THREE.Group();
            const shardCount = 12;
            
            // Original mirror dimensions
            const width = 6;
            const height = 4;
            
            // Create individual shards
            for (let i = 0; i < shardCount; i++) {
                // Create irregular shard shapes using custom geometry
                const points = [];
                
                // Center point
                const centerX = (Math.random() - 0.5) * width * 0.5;
                const centerY = (Math.random() - 0.5) * height * 0.5;
                
                // Create random points around the center
                const segments = 5 + Math.floor(Math.random() * 3);
                for (let j = 0; j < segments; j++) {
                    const angle = (j / segments) * Math.PI * 2;
                    const radius = 0.5 + Math.random() * 0.8;
                    points.push(
                        new THREE.Vector3(
                            centerX + Math.cos(angle) * radius,
                            centerY + Math.sin(angle) * radius,
                            0
                        )
                    );
                }
                
                // Create shard geometry
                const shardGeometry = new THREE.BufferGeometry();
                const shapeGeometry = new THREE.ShapeGeometry(new THREE.Shape(points));
                shardGeometry.copy(shapeGeometry);
                
                // Create shard mesh
                const shardMaterial = mirrorMaterial.clone();
                shardMaterial.side = THREE.DoubleSide;
                const shard = new THREE.Mesh(shardGeometry, shardMaterial);
                
                // Position shard at mirror location
                shard.position.copy(mirror.position);
                
                // Add physics-like animation
                const direction = new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ).normalize();
                
                const speed = 1 + Math.random() * 2;
                const rotationSpeed = Math.random() * 0.1;
                
                gsap.to(shard.position, {
                    x: shard.position.x + direction.x * speed,
                    y: shard.position.y + direction.y * speed,
                    z: shard.position.z + direction.z * speed,
                    duration: 1.5,
                    ease: "power1.out"
                });
                
                gsap.to(shard.rotation, {
                    x: rotationSpeed * 10,
                    y: rotationSpeed * 10,
                    z: rotationSpeed * 10,
                    duration: 1.5,
                    ease: "power1.out"
                });
                
                shards.add(shard);
            }
            
            scene.add(shards);
            
            // Hide original mirror
            mirror.visible = false;
            
            // Update reflection
            updateReflectionPosition();
            
            // Dim the object if mirror breaks
            gsap.to(glowingObject.material, {
                emissiveIntensity: 0.2,
                duration: 1.5
            });
        }
    }
    
    function resetScene() {
        // Reset mirror
        mirrorBroken = false;
        mirror.visible = true;
        
        // Remove all shards
        scene.children.forEach(child => {
            if (child.isGroup && child.children.length > 0 && 
                child.children[0].geometry && 
                child.children[0].material.side === THREE.DoubleSide) {
                scene.remove(child);
            }
        });
        
        // Reset object position
        objectMoved = false;
        gsap.to(glowingObject.position, {
            x: 0,
            y: 0, 
            z: -2,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: updateReflectionPosition
        });
        
        // Reset object brightness
        gsap.to(glowingObject.material, {
            emissiveIntensity: settings.environmentIntensity,
            duration: 1
        });
        
        // Reset reflection
        updateReflectionPosition();
    }
    
    function updateBrightness(brightness) {
        if (!objectMoved && !mirrorBroken) {
            gsap.to(glowingObject.material, {
                emissiveIntensity: brightness,
                duration: 0.5
            });
            
            gsap.to(reflection.material, {
                emissiveIntensity: brightness * 0.8,
                duration: 0.5
            });
        } else if (!mirrorBroken && objectMoved) {
            gsap.to(glowingObject.material, {
                emissiveIntensity: brightness * 0.3, // Dimmer when moved
                duration: 0.5
            });
        }
    }
    
    // Animation update
    function update() {
        // Add subtle floating animation to the glowing object
        glowingObject.position.y += Math.sin(Date.now() * 0.002) * 0.002;
        
        // Update reflection position & rotation to match object
        if (!objectMoved && !mirrorBroken) {
            reflection.rotation.copy(glowingObject.rotation);
            reflection.position.y = glowingObject.position.y;
        }
    }
    
    // Clean up function
    function dispose() {
        // Cleanup if needed
    }
    
    // Return animation controller
    return {
        update,
        dispose,
        moveObject,
        breakMirror,
        resetScene,
        updateBrightness
    };
}

//==============================================================================
// VERSE 5: Ocean Waves Animation
//==============================================================================
function loadVerse5Animation() {
    // Settings
    const settings = config.verse5;
    let waveHeight = settings.waveHeight;
    let waveSpeed = settings.waveSpeed;
    
    // Set camera position
    camera.position.set(0, 10, 20);
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.update();
    
    // Create scene
    scene.background = new THREE.Color(0x001133);
    scene.fog = new THREE.FogExp2(0x001133, 0.02);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(30, 100, 30);
    sunLight.castShadow = true;
    scene.add(sunLight);
    
    // Water surface
    const waterGeometry = new THREE.PlaneGeometry(100, 100, 64, 64);
    
    // Water texture
    const waterNormals = new THREE.TextureLoader().load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r157/examples/textures/waternormals.jpg', 
        function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
    );
    
    // Create water
    const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        alpha: 1.0,
        sunDirection: sunLight.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: settings.oceanColor,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    });
    
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    
    // Add some decorative elements
    // Distant mountains
    function createMountains() {
        const mountainGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const mountainCount = 5;
        const mountainWidth = 60;
        const mountainSpacing = mountainWidth / mountainCount;
        
        for (let i = 0; i < mountainCount; i++) {
            const x = -mountainWidth / 2 + i * mountainSpacing;
            const height = 15 + Math.random() * 10;
            
            // Simple triangle for each mountain
            vertices.push(
                x - mountainSpacing/2, 0, -50, // Base left
                x + mountainSpacing/2, 0, -50, // Base right
                x, height, -50  // Peak
            );
        }
        
        mountainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        mountainGeometry.computeVertexNormals();
        
        const mountains = new THREE.Mesh(
            mountainGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x334455,
                roughness: 0.9,
                metalness: 0.1,
                side: THREE.DoubleSide
            })
        );
        
        scene.add(mountains);
    }
    
    createMountains();
    
    // Animation update
    function update() {
        water.material.uniforms['time'].value += 0.005 * waveSpeed;
        
        // Update wave height
        water.material.uniforms['distortionScale'].value = 3.7 * waveHeight;
        
        // Handle camera distance to show "there is only water" concept
        const distance = camera.position.length();
        
        // When zoomed in close to water, increase wave effect to show it's all just water
        if (distance < 10) {
            water.material.uniforms['distortionScale'].value = 3.7 * waveHeight * (1 + (10-distance)/5);
        }
    }
    
    // Update functions
    function updateWaveHeight(height) {
        waveHeight = height;
    }
    
    function updateWaveSpeed(speed) {
        waveSpeed = speed;
    }
    
    // Clean up function
    function dispose() {
        // Cleanup if needed
    }
    
    // Return animation controller
    return {
        update,
        dispose,
        updateWaveHeight,
        updateWaveSpeed
    };
}

//==============================================================================
// VERSE 6: Light Bulb Animation
//==============================================================================
function loadVerse6Animation() {
    // Settings
    const settings = config.verse6;
    let dimmerValue = 50; // 0-100 range
    let measured = false;
    let isSuperposition = true;
    
    // Set camera position
    camera.position.set(0, 0, 5);
    controls.update();
    
    // Create scene
    scene.background = new THREE.Color(0x000011);
    
    // Create light bulb
    const bulbGroup = new THREE.Group();
    scene.add(bulbGroup);
    
    // Glass bulb
    const glassGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        roughness: 0.1,
        clearcoat: 1
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    bulbGroup.add(glass);
    
    // Bulb base
    const baseGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.5, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.8,
        metalness: 0.5
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1;
    bulbGroup.add(base);
    
    // Connection piece
    const connectorGeometry = new THREE.CylinderGeometry(0.2, 0.4, 0.3, 16);
    const connectorMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.5
    });
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.y = -0.6;
    bulbGroup.add(connector);
    
    // Filament
    const filamentCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.3, -0.3, 0),
        new THREE.Vector3(-0.1, 0, 0),
        new THREE.Vector3(0.1, 0.3, 0),
        new THREE.Vector3(0.3, 0, 0),
        new THREE.Vector3(0.1, -0.3, 0),
        new THREE.Vector3(-0.1, 0, 0),
        new THREE.Vector3(-0.3, 0.3, 0)
    ]);
    
    const filamentGeometry = new THREE.TubeGeometry(filamentCurve, 64, 0.02, 8, false);
    const filamentMaterial = new THREE.MeshStandardMaterial({
        color: settings.bulbColor,
        emissive: settings.bulbColor,
        emissiveIntensity: 0.5,
        roughness: 0.5,
        metalness: 0.8
    });
    const filament = new THREE.Mesh(filamentGeometry, filamentMaterial);
    bulbGroup.add(filament);
    
    // Light source inside bulb
    const light = new THREE.PointLight(settings.bulbColor, 1, 15);
    light.position.set(0, 0, 0);
    bulbGroup.add(light);
    
    // Create a "stand" for the bulb
    const standGeometry = new THREE.BoxGeometry(3, 0.2, 3);
    const standMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -1.5;
    scene.add(stand);
    
    // Create a dimmer switch visualization
    const switchGroup = new THREE.Group();
    scene.add(switchGroup);
    
    // Dimmer track
    const trackGeometry = new THREE.BoxGeometry(0.2, 2, 0.1);
    const trackMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.position.set(-2.5, 0, 0);
    switchGroup.add(track);
    
    // Dimmer handle
    const handleGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.2);
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.5,
        metalness: 0.8
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(-2.5, 0, 0.1);
    switchGroup.add(handle);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    
    // Create measurement effect (particles)
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const radius = 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: settings.bulbColor,
        size: 0.05,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    bulbGroup.add(particles);
    
    // Update dimmer value and bulb appearance
    function updateDimmer(value) {
        dimmerValue = value;
        
        if (!measured) {
            // In superposition, we show a flickering effect
            const intensity = (Math.sin(Date.now() * 0.005) + 1) * 0.5;
            updateBulbIntensity(intensity);
            
            // Update dimmer handle position
            updateHandlePosition(value);
        }
    }
    
    // Helper to update bulb intensity
    function updateBulbIntensity(intensity) {
        // Calculate brightness between min and max
        const brightness = settings.minBrightness + 
            (settings.maxBrightness - settings.minBrightness) * intensity;
        
        filamentMaterial.emissiveIntensity = brightness;
        light.intensity = brightness * 2;
    }
    
    // Update handle position based on dimmer value (0-100)
    function updateHandlePosition(value) {
        const yPos = -1 + (value / 100) * 2;
        handle.position.y = yPos;
    }
    
    // Measure the state (collapse superposition)
    function measureState() {
        if (measured) return;
        
        measured = true;
        isSuperposition = false;
        
        // Show measurement effect
        gsap.to(particlesMaterial, {
            opacity: 0.8,
            duration: 0.5,
            onComplete: () => {
                gsap.to(particlesMaterial, {
                    opacity: 0,
                    duration: 0.5
                });
            }
        });
        
        // Set final intensity based on dimmer value
        const finalIntensity = dimmerValue / 100;
        
        gsap.to(filamentMaterial, {
            emissiveIntensity: settings.minBrightness + 
                (settings.maxBrightness - settings.minBrightness) * finalIntensity,
            duration: 1
        });
        
        gsap.to(light, {
            intensity: (settings.minBrightness + 
                (settings.maxBrightness - settings.minBrightness) * finalIntensity) * 2,
            duration: 1
        });
    }
    
    // Reset the bulb to superposition
    function resetBulb() {
        measured = false;
        isSuperposition = true;
    }
    
    // Animation update
    function update() {
        if (isSuperposition) {
            // Create flickering effect in superposition
            const timeVal = Date.now() * 0.003;
            const flicker1 = Math.sin(timeVal) * 0.5 + 0.5;
            const flicker2 = Math.sin(timeVal * 1.3) * 0.5 + 0.5;
            const combinedFlicker = (flicker1 + flicker2) * 0.5;
            
            updateBulbIntensity(combinedFlicker);
        }
        
        // Rotate bulb slightly for visual interest
        bulbGroup.rotation.y += 0.005;
    }
    
    // Clean up function
    function dispose() {
        // Cleanup if needed
    }
    
    // Return animation controller
    return {
        update,
        dispose,
        updateDimmer,
        measureState,
        resetBulb
    };
}

//==============================================================================
// VERSE 7: Quantum Vacuum Animation
//==============================================================================
function loadVerse7Animation() {
    // Settings
    const settings = config.verse7;
    let particleCount = settings.particleCount;
    let emergenceRate = settings.emergenceRate;
    
    // Set camera position
    camera.position.set(0, 0, 30);
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.update();
    
    // Store original background color
    const originalBackgroundColor = scene.background.clone();
    
    // Create scene - Use a slightly lighter background for better contrast
    scene.background = new THREE.Color(0x1a2a3f); // Lighter blue/grey
    
    // Create particles system
    function createParticleSystem() {
        const particles = new THREE.Group();
        
        // Particle system for "virtual particles"
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const opacities = new Float32Array(particleCount);
        const lifetimes = new Float32Array(particleCount);
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 60;
            positions[i3 + 1] = (Math.random() - 0.5) * 60;
            positions[i3 + 2] = (Math.random() - 0.5) * 60;
            
            sizes[i] = Math.random() * settings.particleSize;
            opacities[i] = 0;
            lifetimes[i] = Math.random() * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
        
        // Custom shader material for particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(settings.particleColor) },
                pointTexture: { value: createParticleTexture() }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                varying float vOpacity;
                
                void main() {
                    vOpacity = opacity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    // Increased base size multiplier for more impact
                    gl_PointSize = size * (450.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform sampler2D pointTexture;
                varying float vOpacity;
                
                void main() {
                    gl_FragColor = vec4(color, vOpacity) * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        particles.add(particleSystem);
        
        // Create faint grid to represent "space"
        const gridHelper = new THREE.GridHelper(100, 20, 0x001133, 0x001133);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.2;
        particles.add(gridHelper);
        
        return particles;
    }
    
    // Create a circular particle texture
    function createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(
            32, 32, 0, 32, 32, 32
        );
        
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    
    // Create particle system
    let particleSystem = createParticleSystem(); // Changed const to let
    scene.add(particleSystem);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    
    // Update functions
    function updateParticleDensity(newCount) {
        if (Math.abs(particleCount - newCount) > 100) {
            particleCount = newCount;
            
            // Remove old particle system
            scene.remove(particleSystem);
            
            // Create new one with updated count
            const newSystem = createParticleSystem();
            scene.add(newSystem);
            
            // Update reference
            particleSystem = newSystem;
        }
    }
    
    function updateEmergenceRate(rate) {
        emergenceRate = rate;
    }
    
    // Animation update
    function update() {
        // Get camera distance
        const cameraDistance = camera.position.length();
        
        // Only show particle activity when zoomed in close
        const zoomFactor = Math.max(0, 1 - (cameraDistance - 10) / 25);
        
        // Update particles based on camera distance
        if (particleSystem.children[0] && particleSystem.children[0].isPoints) {
            const particles = particleSystem.children[0];
            const positions = particles.geometry.attributes.position.array;
            const opacities = particles.geometry.attributes.opacity.array;
            const lifetimes = particles.geometry.attributes.lifetime.array;
            
            for (let i = 0; i < particleCount; i++) {
                // Update lifetime
                lifetimes[i] -= 0.01 * emergenceRate;
                
                // If lifetime expired, create new particle
                if (lifetimes[i] <= 0) {
                    const i3 = i * 3;
                    
                    // Random position
                    positions[i3] = (Math.random() - 0.5) * 60;
                    positions[i3 + 1] = (Math.random() - 0.5) * 60;
                    positions[i3 + 2] = (Math.random() - 0.5) * 60;
                    
                    // Reset lifetime
                    lifetimes[i] = 1 + Math.random();
                    
                    // Chance to create particle pairs
                    if (Math.random() < 0.3) {
                        // Find nearest unused particle
                        let nearest = -1;
                        let minDist = 999;
                        
                        for (let j = 0; j < particleCount; j++) {
                            if (j !== i && opacities[j] < 0.1 && lifetimes[j] > 0.9) {
                                const j3 = j * 3;
                                const dist = Math.sqrt(
                                    Math.pow(positions[i3] - positions[j3], 2) +
                                    Math.pow(positions[i3+1] - positions[j3+1], 2) +
                                    Math.pow(positions[i3+2] - positions[j3+2], 2)
                                );
                                
                                if (dist < minDist) {
                                    minDist = dist;
                                    nearest = j;
                                }
                            }
                        }
                        
                        // Create pair
                        if (nearest >= 0) {
                            const n3 = nearest * 3;
                            const offset = 0.5;
                            
                            positions[n3] = positions[i3] + (Math.random() - 0.5) * offset;
                            positions[n3+1] = positions[i3+1] + (Math.random() - 0.5) * offset;
                            positions[n3+2] = positions[i3+2] + (Math.random() - 0.5) * offset;
                            
                            lifetimes[nearest] = lifetimes[i];
                            opacities[nearest] = 0;
                        }
                    }
                }
                
                // Calculate opacity based on lifetime and zoom
                const lifeFactor = Math.sin(lifetimes[i] * Math.PI);
                // Add a small base opacity and slightly boost the lifeFactor effect
                const targetOpacity = (0.1 + lifeFactor * 0.9) * zoomFactor;
                
                // Smoothly adjust opacity
                opacities[i] += (targetOpacity - opacities[i]) * 0.1;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.opacity.needsUpdate = true;
            particles.geometry.attributes.lifetime.needsUpdate = true;
        }
        
        // Update grid visibility based on zoom
        if (particleSystem.children[1] && particleSystem.children[1].isGridHelper) {
            particleSystem.children[1].material.opacity = 0.1 + 0.1 * (1 - zoomFactor);
        }
        
        // Rotate particle system slowly
        particleSystem.rotation.y += 0.0005;
    }
    // Clean up function
    function dispose() {
        // Restore original background color
        scene.background = originalBackgroundColor;
    }
    
    
    // Return animation controller
    return {
        update,
        dispose,
        updateParticleDensity,
        updateEmergenceRate
    };
}

//==============================================================================
// VERSE 8: Glass Water Animation
//==============================================================================
function loadVerse8Animation() {
    // Settings
    const settings = config.verse8;
    let rotationAxis = 'z';
    
    // Set camera position
    camera.position.set(0, 1, 5);
    controls.update();
    
    // Create scene
    scene.background = new THREE.Color(0x222233);
    
    // Create table
    const tableGeometry = new THREE.BoxGeometry(10, 0.5, 10);
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.8,
        metalness: 0.2
    });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -1.5;
    scene.add(table);
    
    // Create glass container
    const glassGroup = new THREE.Group();
    scene.add(glassGroup);
    
    // Glass cylinder
    const glassGeometry = new THREE.CylinderGeometry(1, 1, 2, 32, 1, true);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: settings.glassColor,
        transparent: true,
        opacity: 0.3,
        transmission: 0.9,
        roughness: 0.05,
        clearcoat: 1,
        side: THREE.DoubleSide
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glassGroup.add(glass);
    
    // Glass bottom
    const bottomGeometry = new THREE.CircleGeometry(1, 32);
    const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -1;
    glassGroup.add(bottom);
    
    // Liquid (water)
    const waterGroup = new THREE.Group();
    glassGroup.add(waterGroup);
    
    // Create water
    const waterGeometry = new THREE.CylinderGeometry(0.98, 0.98, 1, 32, 1, true);
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: settings.liquidColor,
        transparent: true,
        opacity: settings.liquidOpacity,
        transmission: 0.4,
        roughness: 0.1,
        side: THREE.DoubleSide
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = -0.5;
    waterGroup.add(water);
    
    // Water surface (circle on top of water)
    const waterSurfaceGeometry = new THREE.CircleGeometry(0.98, 32);
    const waterSurface = new THREE.Mesh(waterSurfaceGeometry, waterMaterial);
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = 0;
    waterGroup.add(waterSurface);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add some text for "half full" and "half empty"
    function createTextSprite(text, position, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 100;
        
        context.font = 'Bold 40px Arial';
        context.fillStyle = color;
        context.textAlign = 'center';
        context.fillText(text, 100, 50);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(2, 1, 1);
        
        return sprite;
    }
    
    const halfFullText = createTextSprite('Half Full', new THREE.Vector3(3, 0.5, 0), '#33cc33');
    const halfEmptyText = createTextSprite('Half Empty', new THREE.Vector3(-3, 0.5, 0), '#cc3333');
    
    scene.add(halfFullText);
    scene.add(halfEmptyText);
    
    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    function onMouseDown(event) {
        event.preventDefault();
        
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([glass, water, waterSurface, bottom]);
        
        if (intersects.length > 0) {
            isDragging = true;
            controls.enabled = false;
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }
    
    function onMouseMove(event) {
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };
            
            if (rotationAxis === 'x') {
                glassGroup.rotation.z += deltaMove.x * 0.01;
                glassGroup.rotation.x = 0;
            } else {
                glassGroup.rotation.x += deltaMove.y * 0.01;
                glassGroup.rotation.z = 0;
            }
            
            // Update water surface tilt to simulate water physics
            updateWaterTilt();
            
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }
    
    function onMouseUp(event) {
        isDragging = false;
        controls.enabled = true;
    }
    
    // Touch events for mobile
    function onTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            const touch = event.touches[0];
            const fakeEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {}
            };
            onMouseDown(fakeEvent);
        }
    }
    
    function onTouchMove(event) {
        if (isDragging && event.touches.length === 1) {
            event.preventDefault();
            const touch = event.touches[0];
            const fakeEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            onMouseMove(fakeEvent);
        }
    }
    
    function onTouchEnd(event) {
        onMouseUp(event);
    }
    
    // Update water tilt based on glass rotation
    function updateWaterTilt() {
        // Reset water group rotation
        waterGroup.rotation.set(0, 0, 0);
        
        // Determine which axis is being rotated
        if (rotationAxis === 'x') {
            // Limit rotation to keep water in glass
            glassGroup.rotation.z = Math.max(Math.min(glassGroup.rotation.z, Math.PI / 3), -Math.PI / 3);
            
            // Tilt water surface to simulate water physics (limited tilt)
            waterGroup.rotation.z = glassGroup.rotation.z * 0.1;
            
            // Adjust water surface position based on tilt
            const xOffset = Math.sin(glassGroup.rotation.z) * 0.5;
            waterSurface.position.x = xOffset;
            
            // Show different text opacity based on tilt
            const tiltFactor = (glassGroup.rotation.z + Math.PI/3) / (2 * Math.PI/3);
            halfFullText.material.opacity = tiltFactor;
            halfEmptyText.material.opacity = 1 - tiltFactor;
        } else {
            // Limit rotation to keep water in glass
            glassGroup.rotation.x = Math.max(Math.min(glassGroup.rotation.x, Math.PI / 3), -Math.PI / 3);
            
            // Tilt water surface to simulate water physics (limited tilt)
            waterGroup.rotation.x = glassGroup.rotation.x * 0.1;
            
            // Adjust water surface position based on tilt
            const zOffset = -Math.sin(glassGroup.rotation.x) * 0.5;
            waterSurface.position.z = zOffset;
            
            // Show different text opacity based on tilt
            const tiltFactor = (glassGroup.rotation.x + Math.PI/3) / (2 * Math.PI/3);
            halfFullText.material.opacity = tiltFactor;
            halfEmptyText.material.opacity = 1 - tiltFactor;
        }
    }
    
    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    
    // Reset glass position
    function resetGlass() {
        gsap.to(glassGroup.rotation, {
            x: 0,
            z: 0,
            duration: 1,
            ease: "power2.out",
            onUpdate: updateWaterTilt
        });
        
        gsap.to(halfFullText.material, { opacity: 0.5, duration: 1 });
        gsap.to(halfEmptyText.material, { opacity: 0.5, duration: 1 });
    }
    
    // Change rotation axis
    function changeRotationAxis(axis) {
        rotationAxis = axis;
        resetGlass();
    }
    
    // Animation update
    function update() {
        // Add subtle floating animation
        glassGroup.position.y = Math.sin(Date.now() * 0.001) * 0.05;
        
        // Subtle water surface ripple effect
        if (water.material.displacementScale) {
            water.material.displacementScale = Math.sin(Date.now() * 0.002) * 0.01;
        }
        
        // Make text face camera
        halfFullText.lookAt(camera.position);
        halfEmptyText.lookAt(camera.position);
    }
    
    // Clean up function
    function dispose() {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
    }
    
    // Return animation controller
    return {
        update,
        dispose,
        resetGlass,
        changeRotationAxis
    };
}

