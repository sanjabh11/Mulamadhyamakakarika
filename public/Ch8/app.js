import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { config } from './config.js';

// Main state
let currentVerseIndex = 0;
let scene, camera, renderer, composer, controls;
let currentAnimation = null;
let isMobile = window.innerWidth < 768;

// DOM Elements
const contentPanel = document.getElementById('content-panel');
const verseText = document.getElementById('verse-text');
const explanationContent = document.getElementById('explanation-content');
const controlsContent = document.getElementById('controls-content');
const prevVerseButton = document.getElementById('prev-verse');
const nextVerseButton = document.getElementById('next-verse');
const verseIndicator = document.getElementById('verse-indicator');
const toggleExplanationButton = document.getElementById('toggle-explanation');
const toggleControlsButton = document.getElementById('toggle-controls');

// Initialize the scene
function init() {
    // Setup Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.animationSettings.backgroundColor);

    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = config.animationSettings.cameraDistance;

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add post-processing
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, 0.4, 0.85
    );
    composer.addPass(bloomPass);

    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = config.animationSettings.autoRotate;
    controls.autoRotateSpeed = 1;

    // Load first verse
    loadVerse(currentVerseIndex);

    // Setup event listeners
    setupEventListeners();

    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Update current animation if it has an update method
    if (currentAnimation && typeof currentAnimation.update === 'function') {
        currentAnimation.update();
    }

    composer.render();
}

// Load verse content and animation
function loadVerse(index) {
    // Clean up previous animation
    if (currentAnimation && typeof currentAnimation.dispose === 'function') {
        currentAnimation.dispose();
    }

    // Clear scene except lights
    while (scene.children.length > 2) {
        if (scene.children[2].type !== "Light") {
            scene.remove(scene.children[2]);
        }
    }

    const verse = config.verses[index];

    // Update verse content
    verseText.innerHTML = `
        <h2>${verse.title}</h2>
        <p>${verse.text}</p>
    `;

    // Update explanation
    explanationContent.innerHTML = `
        <h4>${verse.quantumConcept}</h4>
        <p>${verse.explanation}</p>
        <h4>Metaphor</h4>
        <p>${verse.metaphor}</p>
    `;

    // Update controls based on animation type
    updateControls(verse);

    // Load animation
    loadAnimation(verse.animation);

    // Update navigation
    verseIndicator.textContent = `Verse ${index + 1}/${config.verses.length}`;
    prevVerseButton.disabled = index === 0;
    nextVerseButton.disabled = index === config.verses.length - 1;

    // Reset camera position
    gsap.to(camera.position, {
        z: config.animationSettings.cameraDistance,
        duration: 1,
        ease: "power2.inOut"
    });

    controls.reset();
}

// Update controls based on current verse
function updateControls(verse) {
    controlsContent.innerHTML = '';

    switch (verse.animation.type) {
        case 'entangledSpheres':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Correlation Strength</label>
                    <input type="range" id="correlation-slider" min="0" max="1" step="0.01" value="1">
                </div>
                <div class="touch-area" id="measure-area">Tap to measure</div>
            `;
            break;

        case 'superpositionWave':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Wave Amplitude</label>
                    <input type="range" id="amplitude-slider" min="0" max="2" step="0.1" value="1.5">
                </div>
                <div class="control-group">
                    <label class="control-label">Collapse Speed</label>
                    <input type="range" id="collapse-slider" min="0.1" max="3" step="0.1" value="1">
                </div>
            `;
            break;

        case 'doubleSlit':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Particle Count</label>
                    <input type="range" id="particles-slider" min="100" max="1000" step="100" value="500">
                </div>
                <div class="touch-area" id="slit-area">Tap to toggle slit configuration</div>
            `;
            break;

        case 'decoupling':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Decoupling Rate</label>
                    <input type="range" id="decoupling-slider" min="0" max="1" step="0.01" value="0.5">
                </div>
            `;
            break;

        case 'pathIntegral':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Path Count</label>
                    <input type="range" id="path-slider" min="1" max="50" step="1" value="20">
                </div>
            `;
            break;

        case 'decoherence':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Decoherence Rate</label>
                    <input type="range" id="decoherence-slider" min="0" max="1" step="0.01" value="0.1">
                </div>
            `;
            break;

        case 'quantumDecay':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Decay Rate</label>
                    <input type="range" id="decay-slider" min="0" max="1" step="0.01" value="0.05">
                </div>
            `;
            break;

        case 'contextuality':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Context Switch Speed</label>
                    <input type="range" id="context-slider" min="0" max="1" step="0.01" value="0.5">
                </div>
            `;
            break;

        case 'uncertaintyPrinciple':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Precision</label>
                    <input type="range" id="precision-slider" min="0" max="1" step="0.01" value="0.5">
                </div>
            `;
            break;

        case 'probabilityCloud':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Cloud Size</label>
                    <input type="range" id="cloud-size-slider" min="0" max="2" step="0.1" value="1.5">
                </div>
            `;
            break;

        case 'coherentWaves':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Wave Count</label>
                    <input type="range" id="wave-count-slider" min="1" max="10" step="1" value="5">
                </div>
            `;
            break;

        case 'qubitSphere':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Rotation Speed</label>
                    <input type="range" id="rotation-speed-slider" min="0" max="1" step="0.01" value="0.5">
                </div>
            `;
            break;

        case 'quantumField':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Field Size</label>
                    <input type="range" id="field-size-slider" min="1" max="10" step="1" value="5">
                </div>
            `;
            break;

        case 'holismPattern':
            controlsContent.innerHTML = `
                <div class="control-group">
                    <label class="control-label">Particle Count</label>
                    <input type="range" id="particle-count-slider" min="100" max="1000" step="100" value="500">
                </div>
            `;
            break;

        default:
            controlsContent.innerHTML = `
                <div class="touch-area">Interact with the visualization</div>
                <div class="control-group">
                    <label class="control-label">Rotation Speed</label>
                    <input type="range" id="rotation-slider" min="0" max="2" step="0.1" value="1">
                </div>
            `;
    }
}

// Load animation based on type
function loadAnimation(animationConfig) {
    const { type, params } = animationConfig;

    switch (type) {
        case 'entangledSpheres':
            currentAnimation = createEntangledSpheresAnimation(params);
            break;

        case 'superpositionWave':
            currentAnimation = createSuperpositionWaveAnimation(params);
            break;

        case 'doubleSlit':
            currentAnimation = createDoubleSlitAnimation(params);
            break;

        case 'decoupling':
            currentAnimation = createDecouplingAnimation(params);
            break;

        case 'pathIntegral':
            currentAnimation = createPathIntegralAnimation(params);
            break;

        case 'decoherence':
            currentAnimation = createDecoherenceAnimation(params);
            break;

        case 'quantumDecay':
            currentAnimation = createQuantumDecayAnimation(params);
            break;

        case 'contextuality':
            currentAnimation = createContextualityAnimation(params);
            break;

        case 'uncertaintyPrinciple':
            currentAnimation = createUncertaintyAnimation(params);
            break;

        case 'probabilityCloud':
            currentAnimation = createProbabilityCloudAnimation(params);
            break;

        case 'coherentWaves':
            currentAnimation = createCoherentWavesAnimation(params);
            break;

        case 'qubitSphere':
            currentAnimation = createQubitSphereAnimation(params);
            break;

        case 'quantumField':
            currentAnimation = createQuantumFieldAnimation(params);
            break;

        case 'holismPattern':
            currentAnimation = createHolismPatternAnimation(params);
            break;

        default:
            // Default animation
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: config.animationSettings.particleColor,
                emissive: config.animationSettings.particleColor,
                emissiveIntensity: 0.5
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            currentAnimation = {
                update: () => {
                    sphere.rotation.x += 0.01;
                    sphere.rotation.y += 0.01;
                },
                dispose: () => {
                    geometry.dispose();
                    material.dispose();
                }
            };
    }
}

function createDoubleSlitAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Set up parameters
    const particleCount = params.particleCount || 500;
    const buildPattern = params.buildPattern || true;

    // Create slits
    const wallGeometry = new THREE.BoxGeometry(3, 1, 0.1);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        emissive: 0x222222,
        emissiveIntensity: 0.3
    });

    // Top part of wall
    const topWall = new THREE.Mesh(wallGeometry, wallMaterial);
    topWall.position.set(0, 0.75, -1);
    group.add(topWall);

    // Bottom part of wall
    const bottomWall = new THREE.Mesh(wallGeometry, wallMaterial);
    bottomWall.position.set(0, -0.75, -1);
    group.add(bottomWall);

    // Middle part (between slits)
    const middleWall = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 0.1), wallMaterial);
    middleWall.position.set(0, 0, -1);
    group.add(middleWall);

    // Screen to show pattern
    const screenGeometry = new THREE.PlaneGeometry(3, 2, 30, 20);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x000000,
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide
    });

    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 1);
    group.add(screen);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    // Initialize particles at source position
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 0.1;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
        particlePositions[i * 3 + 2] = -2;

        particleSizes[i] = 0.02 + Math.random() * 0.02;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        color: config.animationSettings.particleColor,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);

    // Pattern accumulation
    const patternGeometry = new THREE.BufferGeometry();
    const patternPositions = new Float32Array(10000 * 3); // Store up to 10,000 particles on screen
    const patternColors = new Float32Array(10000 * 3);

    patternGeometry.setAttribute('position', new THREE.BufferAttribute(patternPositions, 3));
    patternGeometry.setAttribute('color', new THREE.BufferAttribute(patternColors, 3));

    const patternMaterial = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.02,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const pattern = new THREE.Points(patternGeometry, patternMaterial);
    group.add(pattern);

    // Animation state
    const particleData = [];
    for (let i = 0; i < particleCount; i++) {
        particleData.push({
            active: false,
            velocity: new THREE.Vector3(0, 0, 0),
            wallPassed: false,
            onScreen: false
        });
    }

    let patternParticleCount = 0;
    let slitConfiguration = 'double'; // 'double', 'single', 'none'

    // Add slit configuration toggle
    const slitArea = document.getElementById('slit-area');
    if (slitArea) {
        slitArea.textContent = "Tap to change slit configuration (Currently: Double Slit)";

        slitArea.addEventListener('click', () => {
            // Cycle through configurations
            if (slitConfiguration === 'double') {
                slitConfiguration = 'single';
                // Cover one slit
                middleWall.scale.set(1, 3, 1);
                middleWall.position.y = 0.3;
                slitArea.textContent = "Tap to change slit configuration (Currently: Single Slit)";
            } else if (slitConfiguration === 'single') {
                slitConfiguration = 'none';
                // Cover both slits
                middleWall.scale.set(1, 6, 1);
                middleWall.position.y = 0;
                slitArea.textContent = "Tap to change slit configuration (Currently: No Slits)";
            } else {
                slitConfiguration = 'double';
                // Return to two slits
                middleWall.scale.set(1, 1, 1);
                middleWall.position.y = 0;
                slitArea.textContent = "Tap to change slit configuration (Currently: Double Slit)";
            }

            // Reset pattern on configuration change
            if (buildPattern) {
                patternParticleCount = 0;
            }
        });
    }

    return {
        update: () => {
            // Launch new particles
            for (let i = 0; i < particleCount; i++) {
                if (!particleData[i].active && Math.random() < 0.02) {
                    particleData[i].active = true;

                    // Reset position to source
                    const i3 = i * 3;
                    particlePositions[i3] = (Math.random() - 0.5) * 0.1;
                    particlePositions[i3 + 1] = (Math.random() - 0.5) * 0.1;
                    particlePositions[i3 + 2] = -2;

                    // Set initial velocity toward slits
                    particleData[i].velocity.set(
                        (Math.random() - 0.5) * 0.01,
                        (Math.random() - 0.5) * 0.01,
                        0.04 + Math.random() * 0.01
                    );

                    particleData[i].wallPassed = false;
                    particleData[i].onScreen = false;
                }
            }

            // Update active particles
            const positions = particlesGeometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                if (particleData[i].active) {
                    const i3 = i * 3;

                    // Apply velocity
                    positions[i3] += particleData[i].velocity.x;
                    positions[i3 + 1] += particleData[i].velocity.y;
                    positions[i3 + 2] += particleData[i].velocity.z;

                    // Check for wall collision if not passed yet
                    if (!particleData[i].wallPassed && positions[i3 + 2] >= -1) {
                        const x = positions[i3];
                        const y = positions[i3 + 1];

                        // Check if particle passes through a slit
                        let passesThroughSlit = false;

                        if (slitConfiguration === 'double') {
                            // Double slit: Check upper and lower slits
                            passesThroughSlit = (y > 0.2 && y < 0.5) || (y < -0.2 && y > -0.5);
                        } else if (slitConfiguration === 'single') {
                            // Single slit: Check only lower slit
                            passesThroughSlit = (y < -0.2 && y > -0.5);
                        }
                        // No slits: never passes

                        if (passesThroughSlit) {
                            particleData[i].wallPassed = true;

                            // Add quantum behavior after slit - adjust velocity slightly
                            particleData[i].velocity.x += (Math.random() - 0.5) * 0.01;
                            particleData[i].velocity.y += (Math.random() - 0.5) * 0.01;
                        } else {
                            // Hit the wall and get absorbed
                            particleData[i].active = false;
                        }
                    }

                    // Check if particle hits the screen
                    if (particleData[i].wallPassed && !particleData[i].onScreen && positions[i3 + 2] >= 1) {
                        particleData[i].onScreen = true;

                        // Add to pattern if building pattern is enabled
                        if (buildPattern && patternParticleCount < 10000) {
                            const pIndex = patternParticleCount * 3;

                            // Position on screen
                            patternPositions[pIndex] = positions[i3];
                            patternPositions[pIndex + 1] = positions[i3 + 1];
                            patternPositions[pIndex + 2] = 1;

                            // Color based on position (to show interference)
                            const intensity = Math.sin(positions[i3] * 20) * Math.sin(positions[i3 + 1] * 20);
                            const hue = (intensity + 1) / 2; // Map -1..1 to 0..1

                            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
                            patternColors[pIndex] = color.r;
                            patternColors[pIndex + 1] = color.g;
                            patternColors[pIndex + 2] = color.b;

                            patternParticleCount++;
                            patternGeometry.setDrawRange(0, patternParticleCount);
                        }

                        // Deactivate after hitting screen
                        particleData[i].active = false;
                    }

                    // Deactivate if out of bounds
                    if (
                        Math.abs(positions[i3]) > 2 ||
                        Math.abs(positions[i3 + 1]) > 2 ||
                        positions[i3 + 2] > 2
                    ) {
                        particleData[i].active = false;
                    }
                }
            }

            // Update buffers
            particlesGeometry.attributes.position.needsUpdate = true;
            patternGeometry.attributes.position.needsUpdate = true;
            patternGeometry.attributes.color.needsUpdate = true;

            // Rotate slightly
            group.rotation.y += 0.001;
        },
        dispose: () => {
            wallGeometry.dispose();
            wallMaterial.dispose();
            screenGeometry.dispose();
            screenMaterial.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            patternGeometry.dispose();
            patternMaterial.dispose();

            // Clean up DOM elements
            if (slitArea) {
                slitArea.textContent = "Tap to toggle slit configuration";
            }
        }
    };
}

function createEntangledSpheresAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Create quantum system (initially in superposition)
    const particleCount = params.particleCount || 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    // Initialize particles in coherent circular pattern
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 1.5;

        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
        particlePositions[i * 3 + 2] = 0;

        particleSizes[i] = 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        color: config.animationSettings.particleColor,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);

    // Environmental particles
    const envParticleCount = 200;
    const envGeometry = new THREE.BufferGeometry();
    const envPositions = new Float32Array(envParticleCount * 3);

    // Initialize environment particles
    for (let i = 0; i < envParticleCount; i++) {
        envPositions[i * 3] = (Math.random() - 0.5) * 8;
        envPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        envPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    envGeometry.setAttribute('position', new THREE.BufferAttribute(envPositions, 3));

    const envMaterial = new THREE.PointsMaterial({
        color: 0x225588,
        size: 0.05,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    const envParticles = new THREE.Points(envGeometry, envMaterial);
    group.add(envParticles);

    // Interaction variables
    let interacting = false;
    let interactionStrength = 0;

    // Animation state
    const particleData = [];
    for (let i = 0; i < particleCount; i++) {
        particleData.push({
            originalPos: new THREE.Vector3(
                particlePositions[i * 3],
                particlePositions[i * 3 + 1],
                particlePositions[i * 3 + 2]
            ),
            velocity: new THREE.Vector3(0, 0, 0),
            phase: Math.random() * Math.PI * 2
        });
    }

    // Setup interaction touch area
    const touchArea = document.getElementById('measure-area');
    if (touchArea) {
        touchArea.textContent = "Tap to interact with environment";

        touchArea.addEventListener('pointerdown', () => {
            interacting = true;
            touchArea.textContent = "Interacting... (Release to stop)";
        });

        touchArea.addEventListener('pointerup', () => {
            interacting = false;
            touchArea.textContent = "Tap to interact with environment";
        });

        touchArea.addEventListener('pointerout', () => {
            interacting = false;
            touchArea.textContent = "Tap to interact with environment";
        });
    }

    return {
        update: () => {
            // Update interaction strength
            if (interacting) {
                interactionStrength = Math.min(1, interactionStrength + 0.02);
            } else {
                interactionStrength = Math.max(0, interactionStrength - 0.01);
            }

            // Update particles based on interaction
            const positions = particlesGeometry.attributes.position.array;
            const sizes = particlesGeometry.attributes.size.array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const data = particleData[i];

                if (interactionStrength > 0) {
                    // Calculate random environmental influence
                    data.velocity.x += (Math.random() - 0.5) * 0.01 * interactionStrength;
                    data.velocity.y += (Math.random() - 0.5) * 0.01 * interactionStrength;
                    data.velocity.z += (Math.random() - 0.5) * 0.01 * interactionStrength;

                    // Apply some damping
                    data.velocity.multiplyScalar(0.99);

                    // Update position
                    positions[i3] += data.velocity.x;
                    positions[i3 + 1] += data.velocity.y;
                    positions[i3 + 2] += data.velocity.z;

                    // Make particles spread out
                    sizes[i] = 0.1 + 0.1 * interactionStrength * Math.random();
                } else {
                    // Return to original circle formation
                    const returnStrength = 0.02;
                    positions[i3] += (data.originalPos.x - positions[i3]) * returnStrength;
                    positions[i3 + 1] += (data.originalPos.y - positions[i3 + 1]) * returnStrength;
                    positions[i3 + 2] += (data.originalPos.z - positions[i3 + 2]) * returnStrength;

                    // Make particles uniform again
                    sizes[i] = 0.1;

                    // Reset velocity
                    data.velocity.multiplyScalar(0.95);
                }
            }

            // Update environmental particles
            const envPositions = envGeometry.attributes.position.array;
            for (let i = 0; i < envParticleCount; i++) {
                const i3 = i * 3;

                // Make environment particles move randomly
                envPositions[i3] += (Math.random() - 0.5) * 0.02;
                envPositions[i3 + 1] += (Math.random() - 0.5) * 0.02;
                envPositions[i3 + 2] += (Math.random() - 0.5) * 0.02;

                // Keep within bounds
                if (Math.abs(envPositions[i3]) > 4) envPositions[i3] *= 0.95;
                if (Math.abs(envPositions[i3 + 1]) > 4) envPositions[i3 + 1] *= 0.95;
                if (Math.abs(envPositions[i3 + 2]) > 4) envPositions[i3 + 2] *= 0.95;

                // Make them converge on quantum system when interacting
                if (interactionStrength > 0) {
                    const dx = positions[i % particleCount * 3] - envPositions[i3];
                    const dy = positions[i % particleCount * 3 + 1] - envPositions[i3 + 1];
                    const dz = positions[i % particleCount * 3 + 2] - envPositions[i3 + 2];

                    envPositions[i3] += dx * 0.005 * interactionStrength;
                    envPositions[i3 + 1] += dy * 0.005 * interactionStrength;
                    envPositions[i3 + 2] += dz * 0.005 * interactionStrength;
                }
            }

            // Update buffers
            particlesGeometry.attributes.position.needsUpdate = true;
            particlesGeometry.attributes.size.needsUpdate = true;
            envGeometry.attributes.position.needsUpdate = true;

            // Rotate the entire group
            group.rotation.y += 0.003;
        },
        dispose: () => {
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            envGeometry.dispose();
            envMaterial.dispose();
        }
    };
}

function createSuperpositionWaveAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const waveHeight = params.waveHeight || 1.5;
    const collapseOnInteraction = params.collapseOnInteraction || true;

    // Create wave mesh
    const waveGeometry = new THREE.PlaneGeometry(4, 3, 100, 20);
    const waveMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.particleColor,
        emissive: config.animationSettings.particleColor,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = Math.PI / 2;
    group.add(waveMesh);

    // Collapsed state indicator
    const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.highlightColor,
        emissive: config.animationSettings.highlightColor,
        emissiveIntensity: 0.8
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.visible = false;
    group.add(particle);

    // Animation state
    let time = 0;
    let isCollapsed = false;
    let collapsePosition = new THREE.Vector3();
    let amplitude = waveHeight;

    // Setup slider for amplitude control
    const amplitudeSlider = document.getElementById('amplitude-slider');
    if (amplitudeSlider) {
        amplitudeSlider.addEventListener('input', (e) => {
            amplitude = parseFloat(e.target.value);
        });
    }

    // Setup slider for collapse speed
    const collapseSlider = document.getElementById('collapse-slider');
    let collapseSpeed = 1.0;
    if (collapseSlider) {
        collapseSlider.addEventListener('input', (e) => {
            collapseSpeed = parseFloat(e.target.value);
        });
    }

    // Interaction for wave function collapse
    if (collapseOnInteraction) {
        const container = document.getElementById('scene-container');

        container.addEventListener('click', (e) => {
            if (!isCollapsed) {
                isCollapsed = true;

                // Calculate position based on click
                const rect = container.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                // Project to 3D space
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera({ x, y }, camera);

                const intersects = raycaster.intersectObject(waveMesh);
                if (intersects.length > 0) {
                    collapsePosition.copy(intersects[0].point);
                } else {
                    // Default collapse position if no intersection
                    collapsePosition.set((Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3);
                }

                particle.position.copy(collapsePosition);
                particle.visible = true;

                // Reset after a delay
                setTimeout(() => {
                    isCollapsed = false;
                    particle.visible = false;
                }, 3000);
            }
        });
    }

    return {
        update: () => {
            time += 0.02;

            // Update vertices for wave effect
            const positions = waveGeometry.attributes.position.array;
            const count = positions.length / 3;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const x = positions[i3];
                const z = positions[i3 + 2];

                if (!isCollapsed) {
                    // Superposition: wave-like behavior
                    positions[i3 + 1] = Math.sin(x * 2 + time) * Math.cos(z * 2 + time) * amplitude;
                } else {
                    // Collapsed: localize around measurement point
                    const dx = x - collapsePosition.x;
                    const dz = z - collapsePosition.z;
                    const distance = Math.sqrt(dx * dx + dz * dz);

                    // Gaussian collapse
                    const collapseWidth = Math.max(0.1, 2.0 - time * collapseSpeed);
                    positions[i3 + 1] = amplitude * Math.exp(-(distance * distance) / collapseWidth);
                }
            }

            waveGeometry.attributes.position.needsUpdate = true;

            // Rotate the group
            group.rotation.y += 0.002;
        },
        dispose: () => {
            waveGeometry.dispose();
            waveMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
        }
    };
}

function createPathIntegralAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const pathCount = params.pathCount || 20;
    const interference = params.interference || true;

    // Create start and end points
    const startPoint = new THREE.Vector3(-2, 0, 0);
    const endPoint = new THREE.Vector3(2, 0, 0);

    // Create paths
    const paths = [];
    const pathLines = [];

    // Create path material
    const pathMaterial = new THREE.LineBasicMaterial({
        color: config.animationSettings.particleColor,
        transparent: true,
        opacity: 0.5
    });

    // Create particle
    const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.highlightColor,
        emissive: config.animationSettings.highlightColor,
        emissiveIntensity: 0.8
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(startPoint);
    group.add(particle);

    // Create interference pattern
    const patternGeometry = new THREE.PlaneGeometry(4, 4, 40, 40);
    const patternMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a237e,
        emissive: 0x303f9f,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
        wireframe: false,
        side: THREE.DoubleSide
    });

    const patternMesh = new THREE.Mesh(patternGeometry, patternMaterial);
    patternMesh.rotation.x = Math.PI / 2;
    patternMesh.position.y = -1;
    patternMesh.visible = interference;
    group.add(patternMesh);

    // Setup paths
    function generatePaths() {
        // Remove old paths
        for (const line of pathLines) {
            group.remove(line);
        }
        pathLines.length = 0;
        paths.length = 0;

        // Generate new paths
        for (let i = 0; i < pathCount; i++) {
            const path = [];
            const segments = 20;

            path.push(startPoint.clone());

            // Generate random path
            for (let j = 1; j < segments; j++) {
                const t = j / segments;
                const basePoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

                // Add random offset
                const randomY = (Math.random() - 0.5) * 2 * (1.0 - t * t);
                const randomZ = (Math.random() - 0.5) * 2 * (1.0 - t * t);

                basePoint.y += randomY;
                basePoint.z += randomZ;

                path.push(basePoint);
            }

            path.push(endPoint.clone());
            paths.push(path);

            // Create line geometry
            const geometry = new THREE.BufferGeometry().setFromPoints(path);
            const line = new THREE.Line(geometry, pathMaterial.clone());
            line.material.opacity = 0.2 + Math.random() * 0.3;

            pathLines.push(line);
            group.add(line);
        }
    }

    generatePaths();

    // Path slider control
    const pathSlider = document.getElementById('path-slider');
    if (pathSlider) {
        pathSlider.addEventListener('input', (e) => {
            const newPathCount = parseInt(e.target.value);
            if (newPathCount !== pathCount) {
                pathCount = newPathCount;
                generatePaths();
            }
        });
    }

    // Animation state
    let time = 0;
    let activePath = 0;
    let particleProgress = 0;

    return {
        update: () => {
            time += 0.01;

            // Move particle along active path
            particleProgress += 0.005;
            if (particleProgress >= 1) {
                particleProgress = 0;
                activePath = (activePath + 1) % paths.length;
            }

            const path = paths[activePath];
            if (path.length > 1) {
                const segmentCount = path.length - 1;
                const segmentIndex = Math.floor(particleProgress * segmentCount);
                const segmentProgress = (particleProgress * segmentCount) - segmentIndex;

                const pointA = path[segmentIndex];
                const pointB = path[segmentIndex + 1];

                particle.position.lerpVectors(pointA, pointB, segmentProgress);
            }

            // Update interference pattern
            if (interference) {
                const positions = patternGeometry.attributes.position.array;
                const count = positions.length / 3;

                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;
                    const x = positions[i3];
                    const z = positions[i3 + 2];

                    let phaseSum = 0;

                    // Sum contributions from all paths
                    for (const path of paths) {
                        // Calculate phase contribution from this path
                        let pathLength = 0;
                        for (let j = 1; j < path.length; j++) {
                            pathLength += path[j].distanceTo(path[j - 1]);
                        }

                        // Phase based on path length
                        const phase = (pathLength * 10 + time * 2) % (Math.PI * 2);
                        const contribution = Math.cos(phase);

                        phaseSum += contribution;
                    }

                    // Normalize and set height
                    const height = (phaseSum / paths.length) * 0.5;
                    positions[i3 + 1] = height;
                }

                patternGeometry.attributes.position.needsUpdate = true;
            }

            // Rotate the group
            group.rotation.y += 0.002;
        },
        dispose: () => {
            particleGeometry.dispose();
            particleMaterial.dispose();
            patternGeometry.dispose();
            patternMaterial.dispose();

            for (const line of pathLines) {
                line.geometry.dispose();
                line.material.dispose();
            }
        }
    };
}

function createDecoherenceAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const particleCount = params.particleCount || 100;
    const environmentInteraction = params.environmentInteraction || true;

    // Create quantum system
    const quantumGeometry = new THREE.BufferGeometry();
    const quantumPositions = new Float32Array(particleCount * 3);
    const quantumColors = new Float32Array(particleCount * 3);
    const quantumSizes = new Float32Array(particleCount);

    // Initialize quantum particles in a coherent state (wave-like)
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 1.5;

        quantumPositions[i * 3] = Math.cos(angle) * radius;
        quantumPositions[i * 3 + 1] = Math.sin(angle) * radius;
        quantumPositions[i * 3 + 2] = 0;

        // Initial color (blue - coherent)
        quantumColors[i * 3] = 0.2;
        quantumColors[i * 3 + 1] = 0.5;
        quantumColors[i * 3 + 2] = 1.0;

        quantumSizes[i] = 0.1;
    }

    quantumGeometry.setAttribute('position', new THREE.BufferAttribute(quantumPositions, 3));
    quantumGeometry.setAttribute('color', new THREE.BufferAttribute(quantumColors, 3));
    quantumGeometry.setAttribute('size', new THREE.BufferAttribute(quantumSizes, 1));

    const quantumMaterial = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const quantumSystem = new THREE.Points(quantumGeometry, quantumMaterial);
    group.add(quantumSystem);

    // Create environment particles
    const envCount = 200;
    const envGeometry = new THREE.BufferGeometry();
    const envPositions = new Float32Array(envCount * 3);

    // Initialize environment particles
    for (let i = 0; i < envCount; i++) {
        envPositions[i * 3] = (Math.random() - 0.5) * 8;
        envPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        envPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    envGeometry.setAttribute('position', new THREE.BufferAttribute(envPositions, 3));

    const envMaterial = new THREE.PointsMaterial({
        color: 0x444444,
        size: 0.05,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    const envSystem = new THREE.Points(envGeometry, envMaterial);
    group.add(envSystem);

    // Animation state
    let time = 0;
    let decoherenceRate = 0.1;
    let decoherencePhase = 0;

    // Particle data for physics
    const particleData = [];
    for (let i = 0; i < particleCount; i++) {
        particleData.push({
            originalPos: new THREE.Vector3(
                quantumPositions[i * 3],
                quantumPositions[i * 3 + 1],
                quantumPositions[i * 3 + 2]
            ),
            velocity: new THREE.Vector3(0, 0, 0),
            phase: Math.random() * Math.PI * 2,
            decoherence: 0 // 0 = coherent, 1 = decohered
        });
    }

    // Decoherence slider control
    const decoherenceSlider = document.getElementById('decoherence-slider');
    if (decoherenceSlider) {
        decoherenceSlider.addEventListener('input', (e) => {
            decoherenceRate = parseFloat(e.target.value);
        });
    }

    return {
        update: () => {
            time += 0.01;

            // Update decoherence phase
            if (environmentInteraction) {
                decoherencePhase += decoherenceRate * 0.01;
                decoherencePhase = Math.min(decoherencePhase, 1);
            } else {
                decoherencePhase = 0;
            }

            // Update quantum particles
            const positions = quantumGeometry.attributes.position.array;
            const colors = quantumGeometry.attributes.color.array;
            const sizes = quantumGeometry.attributes.size.array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const data = particleData[i];

                // Update decoherence state
                data.decoherence = Math.min(1, data.decoherence + Math.random() * decoherenceRate * 0.02);

                if (decoherencePhase > 0) {
                    // Apply environmental influences
                    data.velocity.x += (Math.random() - 0.5) * 0.01 * decoherencePhase;
                    data.velocity.y += (Math.random() - 0.5) * 0.01 * decoherencePhase;
                    data.velocity.z += (Math.random() - 0.5) * 0.01 * decoherencePhase;

                    // Apply damping
                    data.velocity.multiplyScalar(0.99);

                    // Update position
                    positions[i3] += data.velocity.x;
                    positions[i3 + 1] += data.velocity.y;
                    positions[i3 + 2] += data.velocity.z;

                    // Update color based on decoherence (blue -> red)
                    colors[i3] = 0.2 + data.decoherence * 0.8; // red increases
                    colors[i3 + 1] = Math.max(0, 0.5 - data.decoherence * 0.5); // green decreases
                    colors[i3 + 2] = Math.max(0, 1.0 - data.decoherence); // blue decreases

                    // Update size
                    sizes[i] = 0.05 + 0.05 * (1 - data.decoherence);
                } else {
                    // Return to coherent state
                    data.decoherence = Math.max(0, data.decoherence - 0.01);

                    // Oscillate in wave pattern
                    const angle = (i / particleCount) * Math.PI * 2;
                    const radius = 1.5 + Math.sin(time * 2 + angle) * 0.1;

                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 1] = Math.sin(angle) * radius;
                    positions[i3 + 2] = 0;

                    // Return to blue color
                    colors[i3] = 0.2;
                    colors[i3 + 1] = 0.5;
                    colors[i3 + 2] = 1.0;

                    // Reset size
                    sizes[i] = 0.1;
                }
            }

            // Update environment particles
            const envPositions = envGeometry.attributes.position.array;
            for (let i = 0; i < envCount; i++) {
                const i3 = i * 3;

                if (decoherencePhase > 0) {
                    // Environment particles move toward quantum system when interacting
                    const idx = i % particleCount;
                    const targetX = positions[idx * 3];
                    const targetY = positions[idx * 3 + 1];
                    const targetZ = positions[idx * 3 + 2];

                    envPositions[i3] += (targetX - envPositions[i3]) * 0.01 * decoherencePhase;
                    envPositions[i3 + 1] += (targetY - envPositions[i3 + 1]) * 0.01 * decoherencePhase;
                    envPositions[i3 + 2] += (targetZ - envPositions[i3 + 2]) * 0.01 * decoherencePhase;
                } else {
                    // Random movement when not interacting
                    envPositions[i3] += (Math.random() - 0.5) * 0.05;
                    envPositions[i3 + 1] += (Math.random() - 0.5) * 0.05;
                    envPositions[i3 + 2] += (Math.random() - 0.5) * 0.05;

                    // Keep within bounds
                    if (Math.abs(envPositions[i3]) > 4) envPositions[i3] *= 0.95;
                    if (Math.abs(envPositions[i3 + 1]) > 4) envPositions[i3 + 1] *= 0.95;
                    if (Math.abs(envPositions[i3 + 2]) > 4) envPositions[i3 + 2] *= 0.95;
                }
            }

            // Update buffers
            quantumGeometry.attributes.position.needsUpdate = true;
            quantumGeometry.attributes.color.needsUpdate = true;
            quantumGeometry.attributes.size.needsUpdate = true;
            envGeometry.attributes.position.needsUpdate = true;

            // Rotate the entire group
            group.rotation.y += 0.002;
        },
        dispose: () => {
            quantumGeometry.dispose();
            quantumMaterial.dispose();
            envGeometry.dispose();
            envMaterial.dispose();
        }
    };
}

function createQuantumDecayAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const atomCount = params.atomCount || 50;
    let decayRate = params.decayRate || 0.05;

    // Create atoms
    const atomGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const atomMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.particleColor,
        emissive: config.animationSettings.particleColor,
        emissiveIntensity: 0.5
    });

    const decayedMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.highlightColor,
        emissive: config.animationSettings.highlightColor,
        emissiveIntensity: 0.5
    });

    const atoms = [];
    const atomMeshes = [];

    // Create atoms in grid pattern
    const gridSize = Math.ceil(Math.sqrt(atomCount));
    const spacing = 3.0 / gridSize;

    for (let i = 0; i < atomCount; i++) {
        const x = (i % gridSize) * spacing - 1.5 + spacing / 2;
        const z = Math.floor(i / gridSize) * spacing - 1.5 + spacing / 2;

        const atom = {
            position: new THREE.Vector3(x, 0, z),
            decayed: false,
            decayTime: null,
            radiation: []
        };

        const mesh = new THREE.Mesh(atomGeometry, atomMaterial);
        mesh.position.copy(atom.position);
        group.add(mesh);

        atoms.push(atom);
        atomMeshes.push(mesh);
    }

    // Create graph to display decay curve
    const graphGeometry = new THREE.BufferGeometry();
    const graphPositions = new Float32Array(100 * 3); // 100 points for the curve

    graphGeometry.setAttribute('position', new THREE.BufferAttribute(graphPositions, 3));

    const graphMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2
    });

    const graph = new THREE.Line(graphGeometry, graphMaterial);
    graph.position.set(0, -1.5, 0);
    group.add(graph);

    // Create graph axes
    const axesGeometry = new THREE.BufferGeometry();
    const axesPositions = new Float32Array([
        -1.5, 0, 0,  // X-axis start
        1.5, 0, 0,   // X-axis end
        -1.5, 0, 0,  // Y-axis start
        -1.5, 1, 0   // Y-axis end
    ]);

    axesGeometry.setAttribute('position', new THREE.BufferAttribute(axesPositions, 3));

    const axesMaterial = new THREE.LineBasicMaterial({
        color: 0x888888,
        linewidth: 1
    });

    const axes = new THREE.LineSegments(axesGeometry, axesMaterial);
    axes.position.set(0, -1.5, 0);
    group.add(axes);

    // Animation state
    let time = 0;
    let undecayedCount = atomCount;
    const decayHistory = [];

    // Decay rate slider
    const decaySlider = document.getElementById('decay-slider');
    if (decaySlider) {
        decaySlider.addEventListener('input', (e) => {
            decayRate = parseFloat(e.target.value);
        });
    }

    return {
        update: () => {
            time += 0.016; // Approx 60fps

            // Update decay history
            decayHistory.push(undecayedCount);
            if (decayHistory.length > 100) {
                decayHistory.shift();
            }

            // Update atoms - check for new decays
            for (let i = 0; i < atomCount; i++) {
                const atom = atoms[i];

                if (!atom.decayed && Math.random() < decayRate * 0.016) {
                    atom.decayed = true;
                    atom.decayTime = time;
                    atomMeshes[i].material = decayedMaterial;
                    undecayedCount--;

                    // Create radiation particles
                    const radiationCount = 3 + Math.floor(Math.random() * 3);
                    for (let j = 0; j < radiationCount; j++) {
                        const radiationGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                        const radiationMaterial = new THREE.MeshStandardMaterial({
                            color: 0xffff00,
                            emissive: 0xffff00,
                            emissiveIntensity: 1.0,
                            transparent: true,
                            opacity: 0.8
                        });

                        const radiation = new THREE.Mesh(radiationGeometry, radiationMaterial);
                        radiation.position.copy(atom.position);

                        const speed = 0.03 + Math.random() * 0.02;
                        const angle = Math.random() * Math.PI * 2;
                        const elevationAngle = Math.random() * Math.PI * 2;

                        const velocity = new THREE.Vector3(
                            Math.cos(angle) * Math.cos(elevationAngle) * speed,
                            Math.sin(elevationAngle) * speed,
                            Math.sin(angle) * Math.cos(elevationAngle) * speed
                        );

                        atom.radiation.push({
                            mesh: radiation,
                            velocity: velocity,
                            life: 1.0
                        });

                        group.add(radiation);
                    }
                }

                // Update radiation particles
                for (let j = atom.radiation.length - 1; j >= 0; j--) {
                    const rad = atom.radiation[j];

                    rad.mesh.position.add(rad.velocity);
                    rad.life -= 0.02;

                    // Scale and fade out radiation
                    rad.mesh.scale.setScalar(rad.life * 0.5 + 0.5);
                    rad.mesh.material.opacity = rad.life;

                    if (rad.life <= 0) {
                        group.remove(rad.mesh);
                        rad.mesh.geometry.dispose();
                        rad.mesh.material.dispose();
                        atom.radiation.splice(j, 1);
                    }
                }
            }

            // Update decay curve graph
            const graphPos = graphGeometry.attributes.position.array;
            for (let i = 0; i < decayHistory.length; i++) {
                const normalizedCount = decayHistory[i] / atomCount;

                graphPos[i * 3] = (i / 100) * 3 - 1.5; // X position
                graphPos[i * 3 + 1] = normalizedCount; // Y position
                graphPos[i * 3 + 2] = 0; // Z position
            }

            graphGeometry.setDrawRange(0, decayHistory.length);
            graphGeometry.attributes.position.needsUpdate = true;

            // Rotate the group
            group.rotation.y += 0.002;
        },
        dispose: () => {
            atomGeometry.dispose();
            atomMaterial.dispose();
            decayedMaterial.dispose();
            graphGeometry.dispose();
            graphMaterial.dispose();
            axesGeometry.dispose();
            axesMaterial.dispose();

            // Clean up radiation particles
            for (const atom of atoms) {
                for (const rad of atom.radiation) {
                    rad.mesh.geometry.dispose();
                    rad.mesh.material.dispose();
                }
            }
        }
    };
}

function createContextualityAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const contextCount = params.contexts || 3;
    const outcomeShift = params.outcomeShift || true;

    // Create context visualizations
    const contexts = [];
    const contextMeshes = [];
    const measurements = [];

    for (let i = 0; i < contextCount; i++) {
        // Create reference frame for each context
        const contextGroup = new THREE.Group();
        contextGroup.position.set(0, 0, 0);
        contextGroup.visible = i === 0; // Only first context visible initially
        group.add(contextGroup);

        // Create axis visualization
        const axisColors = [0xff0000, 0x00ff00, 0x0000ff];

        for (let axis = 0; axis < 3; axis++) {
            const axisGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
            const axisMaterial = new THREE.MeshBasicMaterial({ color: axisColors[axis] });
            const axisMesh = new THREE.Mesh(axisGeometry, axisMaterial);

            // Position each axis
            if (axis === 0) {
                axisMesh.rotation.z = Math.PI / 2;
            } else if (axis === 1) {
                // Y axis already aligned
            } else {
                axisMesh.rotation.x = Math.PI / 2;
            }

            // Rotate each context frame differently
            axisMesh.rotation.y += (i / contextCount) * Math.PI;

            contextGroup.add(axisMesh);
        }

        // Create context-specific outcome visualization
        const outcomesGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const outcomesMaterial = new THREE.MeshStandardMaterial({
            color: config.animationSettings.highlightColor,
            emissive: config.animationSettings.highlightColor,
            emissiveIntensity: 0.5
        });

        // Create 8 outcomes (like spin in different directions)
        const outcomes = [];
        for (let j = 0; j < 8; j++) {
            const position = new THREE.Vector3(
                (j & 1) ? 0.8 : -0.8,
                (j & 2) ? 0.8 : -0.8,
                (j & 4) ? 0.8 : -0.8
            );

            const outcomeMesh = new THREE.Mesh(outcomesGeometry, outcomesMaterial.clone());
            outcomeMesh.position.copy(position);
            outcomeMesh.visible = false;
            contextGroup.add(outcomeMesh);

            outcomes.push({
                mesh: outcomeMesh,
                position: position,
                probability: Math.random()
            });
        }

        // Context data
        contexts.push({
            group: contextGroup,
            outcomes: outcomes,
            angle: (i / contextCount) * Math.PI
        });
    }

    // Create quantum object being measured
    const quantumGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const quantumMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.particleColor,
        emissive: config.animationSettings.particleColor,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const quantumObject = new THREE.Mesh(quantumGeometry, quantumMaterial);
    group.add(quantumObject);

    // Animation state
    let time = 0;
    let activeContext = 0;
    let showingOutcome = false;
    let switchSpeed = 0.5;
    let lastSwitchTime = 0;

    // Context switch slider
    const contextSlider = document.getElementById('context-slider');
    if (contextSlider) {
        contextSlider.addEventListener('input', (e) => {
            switchSpeed = parseFloat(e.target.value);
        });
    }

    // Measure function - shows an outcome based on current context
    function measure() {
        if (showingOutcome) return;

        showingOutcome = true;
        const context = contexts[activeContext];

        // Choose outcome based on probabilities
        let totalProb = 0;
        for (const outcome of context.outcomes) {
            totalProb += outcome.probability;
        }

        const randomValue = Math.random() * totalProb;
        let cumulativeProb = 0;
        let selectedOutcome = context.outcomes[0];

        for (const outcome of context.outcomes) {
            cumulativeProb += outcome.probability;
            if (randomValue <= cumulativeProb) {
                selectedOutcome = outcome;
                break;
            }
        }

        // Show selected outcome
        for (const outcome of context.outcomes) {
            outcome.mesh.visible = outcome === selectedOutcome;
        }

        // Hide quantum object during measurement
        quantumObject.visible = false;

        // Record measurement
        measurements.push({
            context: activeContext,
            outcome: context.outcomes.indexOf(selectedOutcome),
            time: time
        });

        // Reset after delay
        setTimeout(() => {
            showingOutcome = false;

            // Hide all outcomes
            for (const outcome of context.outcomes) {
                outcome.mesh.visible = false;
            }

            // Show quantum object again
            quantumObject.visible = true;
        }, 1500);
    }

    // Setup touch area for measurement
    const touchArea = document.getElementById('scene-container');
    touchArea.addEventListener('click', measure);

    return {
        update: () => {
            time += 0.016;

            // Switch context periodically
            if (time - lastSwitchTime > (1 / switchSpeed) && !showingOutcome) {
                lastSwitchTime = time;

                // Hide current context
                contexts[activeContext].group.visible = false;

                // Activate next context
                activeContext = (activeContext + 1) % contextCount;
                contexts[activeContext].group.visible = true;

                // Update probabilities if outcome shift is enabled
                if (outcomeShift) {
                    const context = contexts[activeContext];
                    for (const outcome of context.outcomes) {
                        outcome.probability = Math.random();
                    }
                }
            }

            // Animate quantum object
            if (!showingOutcome) {
                quantumObject.rotation.x += 0.01;
                quantumObject.rotation.y += 0.01;

                // Pulse effect
                const scale = 0.8 + Math.sin(time * 3) * 0.2;
                quantumObject.scale.set(scale, scale, scale);
            }

            // Rotate the group
            group.rotation.y += 0.001;
        },
        dispose: () => {
            quantumGeometry.dispose();
            quantumMaterial.dispose();

            for (const context of contexts) {
                context.group.children.forEach(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
            }

            // Remove event listener
            touchArea.removeEventListener('click', measure);
        }
    };
}

function createUncertaintyPrincipleAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const precisionTrade = params.precisionTrade || true;
    const visualizeUncertainty = params.visualizeUncertainty || true;

    // Create particle
    const particleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.particleColor,
        emissive: config.animationSettings.particleColor,
        emissiveIntensity: 0.5
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    group.add(particle);

    // Create position uncertainty visualization
    const posUncertaintyGeometry = new THREE.SphereGeometry(1, 32, 32);
    const posUncertaintyMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.particleColor,
        emissive: config.animationSettings.particleColor,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });

    const posUncertainty = new THREE.Mesh(posUncertaintyGeometry, posUncertaintyMaterial);
    group.add(posUncertainty);

    // Create momentum visualization (arrow)
    const arrowLength = 2;
    const arrowHeadLength = 0.2;
    const arrowHeadWidth = 0.1;

    const arrowDirection = new THREE.Vector3(1, 0, 0);
    const arrow = new THREE.ArrowHelper(
        arrowDirection.normalize(),
        new THREE.Vector3(0, 0, 0),
        arrowLength,
        config.animationSettings.highlightColor,
        arrowHeadLength,
        arrowHeadWidth
    );

    group.add(arrow);

    // Create momentum uncertainty visualization
    const momentumUncertaintyGeometry = new THREE.CylinderGeometry(0.05, 0.05, arrowLength, 8);
    momentumUncertaintyGeometry.rotateZ(Math.PI / 2);

    const momentumUncertaintyMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.highlightColor,
        emissive: config.animationSettings.highlightColor,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.3
    });

    const momentumUncertainty = new THREE.Mesh(
        momentumUncertaintyGeometry,
        momentumUncertaintyMaterial
    );
    momentumUncertainty.position.set(arrowLength / 2, 0, 0);
    group.add(momentumUncertainty);

    // Create uncertainty principle formula
    const heisenbergGeometry = new THREE.PlaneGeometry(1, 0.5);

    // Create canvas for texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Draw formula
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Δx · Δp ≥ ℏ/2', canvas.width / 2, canvas.height / 2);

    // Create texture
    const formulaTexture = new THREE.CanvasTexture(canvas);

    const formulaMaterial = new THREE.MeshBasicMaterial({
        map: formulaTexture,
        transparent: true,
        opacity: 0.8
    });

    const formulaMesh = new THREE.Mesh(heisenbergGeometry, formulaMaterial);
    formulaMesh.position.set(0, -1.5, 0);
    group.add(formulaMesh);

    // Animation state
    let time = 0;
    let positionPrecision = 0.5; // 0 to 1, where 1 is perfect position precision

    // Update precision based on slider
    const precisionSlider = document.getElementById('precision-slider');
    if (precisionSlider) {
        precisionSlider.addEventListener('input', (e) => {
            positionPrecision = parseFloat(e.target.value);
        });
    }

    return {
        update: () => {
            time += 0.016;

            if (precisionTrade) {
                // Calculate momentum precision (inverse of position precision)
                const momentumPrecision = 1 - positionPrecision;

                // Update position uncertainty visualization
                const posUncertaintySize = 0.2 + (1 - positionPrecision) * 1.8;
                posUncertainty.scale.set(posUncertaintySize, posUncertaintySize, posUncertaintySize);

                // Update momentum uncertainty visualization
                const momentumUncertaintyWidth = 0.02 + momentumPrecision * 0.18;
                momentumUncertainty.scale.set(1, momentumUncertaintyWidth * 20, momentumUncertaintyWidth * 20);

                // Update arrow length based on momentum precision
                const arrowScaleLength = 0.5 + momentumPrecision * 1.5;
                arrow.setLength(arrowLength * arrowScaleLength, arrowHeadLength, arrowHeadWidth);

                // Position the momentum uncertainty visualization
                momentumUncertainty.position.set(arrowLength * arrowScaleLength / 2, 0, 0);

                // Animate particle position
                if (visualizeUncertainty) {
                    // More uncertain position = more random movement
                    const rangeFactor = 1 - positionPrecision;
                    particle.position.set(
                        (Math.random() - 0.5) * rangeFactor,
                        (Math.random() - 0.5) * rangeFactor,
                        (Math.random() - 0.5) * rangeFactor
                    );

                    // Animate arrow direction
                    if (momentumPrecision > 0.1) {
                        const angle = Math.random() * Math.PI * 2 * momentumPrecision;
                        const elevation = (Math.random() - 0.5) * Math.PI * momentumPrecision;

                        arrowDirection.set(
                            Math.cos(angle) * Math.cos(elevation),
                            Math.sin(elevation),
                            Math.sin(angle) * Math.cos(elevation)
                        );

                        arrow.setDirection(arrowDirection.normalize());
                    } else {
                        arrow.setDirection(new THREE.Vector3(1, 0, 0));
                    }
                }
            }

            // Rotate formula to face camera
            formulaMesh.lookAt(camera.position);

            // Rotate group
            group.rotation.y += 0.002;
        },
        dispose: () => {
            particleGeometry.dispose();
            particleMaterial.dispose();
            posUncertaintyGeometry.dispose();
            posUncertaintyMaterial.dispose();
            momentumUncertaintyGeometry.dispose();
            momentumUncertaintyMaterial.dispose();
            heisenbergGeometry.dispose();
            formulaMaterial.dispose();
            formulaTexture.dispose();
        }
    };
}

function createProbabilityCloudAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const cloudSize = params.cloudSize || 2;
    const localizationSpeed = params.localizationSpeed || 0.5;

    // Create electron cloud
    const particleCount = 1000;
    const cloudGeometry = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(particleCount * 3);
    const cloudSizes = new Float32Array(particleCount);
    const cloudColors = new Float32Array(particleCount * 3);

    // Initialize cloud particles
    for (let i = 0; i < particleCount; i++) {
        // Position in spherical probability distribution
        const radius = Math.pow(Math.random(), 1 / 3) * cloudSize; // Cube root for volume distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        cloudPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        cloudPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        cloudPositions[i * 3 + 2] = radius * Math.cos(phi);

        // Size and color based on probability density
        const probability = Math.exp(-radius / (cloudSize * 0.3));
        cloudSizes[i] = 0.05 * probability + 0.01;

        cloudColors[i * 3] = 0.3;
        cloudColors[i * 3 + 1] = 0.6;
        cloudColors[i * 3 + 2] = 1.0;
    }

    cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1));
    cloudGeometry.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));

    const cloudMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const cloudPoints = new THREE.Points(cloudGeometry, cloudMaterial);
    group.add(cloudPoints);

    // Create nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.highlightColor,
        emissive: config.animationSettings.highlightColor,
        emissiveIntensity: 0.8
    });

    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    group.add(nucleus);

    // Create localized electron
    const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.particleColor,
        emissive: config.animationSettings.particleColor,
        emissiveIntensity: 0.8
    });

    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.visible = false;
    group.add(electron);

    // Animation state
    let time = 0;
    let isLocalized = false;
    let localizationTime = 0;
    let localizationPosition = new THREE.Vector3();
    let currentCloudSize = cloudSize;

    // Add slider control for cloud size
    const cloudSizeSlider = document.getElementById('cloud-size-slider');
    if (cloudSizeSlider) {
        cloudSizeSlider.addEventListener('input', (e) => {
            currentCloudSize = parseFloat(e.target.value);

            // Only update positions if not currently localized
            if (!isLocalized) {
                const positions = cloudGeometry.attributes.position.array;
                const sizes = cloudGeometry.attributes.size.array;

                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    const currentPos = new THREE.Vector3(
                        positions[i3],
                        positions[i3 + 1],
                        positions[i3 + 2]
                    );

                    const currentDir = currentPos.normalize();
                    const newLength = Math.pow(Math.random(), 1 / 3) * currentCloudSize;

                    positions[i3] = currentDir.x * newLength;
                    positions[i3 + 1] = currentDir.y * newLength;
                    positions[i3 + 2] = currentDir.z * newLength;

                    // Update size based on probability density
                    const radius = newLength;
                    const probability = Math.exp(-radius / (currentCloudSize * 0.3));
                    sizes[i] = 0.05 * probability + 0.01;
                }

                cloudGeometry.attributes.position.needsUpdate = true;
                cloudGeometry.attributes.size.needsUpdate = true;
            }
        });
    }

    // Interaction for wave function collapse/localization
    const container = document.getElementById('scene-container');

    container.addEventListener('click', (e) => {
        if (!isLocalized) {
            isLocalized = true;
            localizationTime = time;

            // Calculate position based on probability distribution
            const radius = Math.pow(Math.random(), 1 / 3) * currentCloudSize;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            localizationPosition.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            electron.position.copy(localizationPosition);
            electron.visible = true;

            // Reset after a delay
            setTimeout(() => {
                isLocalized = false;
                electron.visible = false;
            }, 3000);
        }
    });

    return {
        update: () => {
            time += 0.016;

            const positions = cloudGeometry.attributes.position.array;
            const sizes = cloudGeometry.attributes.size.array;
            const colors = cloudGeometry.attributes.color.array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;

                if (isLocalized) {
                    // When localized, particles move toward the measurement point
                    const currentPos = new THREE.Vector3(
                        positions[i3],
                        positions[i3 + 1],
                        positions[i3 + 2]
                    );

                    // Calculate time since localization
                    const elapsed = time - localizationTime;
                    const localizationProgress = Math.min(1, elapsed * localizationSpeed);

                    // Move toward localization point
                    currentPos.lerp(localizationPosition, localizationProgress * 0.1);

                    positions[i3] = currentPos.x;
                    positions[i3 + 1] = currentPos.y;
                    positions[i3 + 2] = currentPos.z;

                    // Fade out particles except near localization point
                    const distToLocalization = currentPos.distanceTo(localizationPosition);
                    const fadeThreshold = 0.5;

                    if (distToLocalization > fadeThreshold) {
                        const fade = Math.max(0, 1 - localizationProgress);
                        sizes[i] *= fade;
                        colors[i3 + 3] = fade;
                    }
                } else {
                    // When not localized, apply quantum jitter to particles
                    positions[i3] += (Math.random() - 0.5) * 0.01;
                    positions[i3 + 1] += (Math.random() - 0.5) * 0.01;
                    positions[i3 + 2] += (Math.random() - 0.5) * 0.01;

                    // Keep within cloud bounds
                    const currentPos = new THREE.Vector3(
                        positions[i3],
                        positions[i3 + 1],
                        positions[i3 + 2]
                    );

                    const dist = currentPos.length();
                    if (dist > currentCloudSize) {
                        currentPos.normalize().multiplyScalar(currentCloudSize);
                        positions[i3] = currentPos.x;
                        positions[i3 + 1] = currentPos.y;
                        positions[i3 + 2] = currentPos.z;
                    }

                    // Update color and size based on position
                    const radius = currentPos.length();
                    const probability = Math.exp(-radius / (currentCloudSize * 0.3));

                    sizes[i] = 0.05 * probability + 0.01;
                    colors[i3 + 3] = 1.0; // Restore full opacity
                }
            }

            cloudGeometry.attributes.position.needsUpdate = true;
            cloudGeometry.attributes.size.needsUpdate = true;
            cloudGeometry.attributes.color.needsUpdate = true;

            // Rotate the cloud
            cloudPoints.rotation.y += 0.001;
            cloudPoints.rotation.z += 0.0005;

            // Rotate the entire group
            group.rotation.y += 0.002;
        },
        dispose: () => {
            cloudGeometry.dispose();
            cloudMaterial.dispose();
            nucleusGeometry.dispose();
            nucleusMaterial.dispose();
            electronGeometry.dispose();
            electronMaterial.dispose();
        }
    };
}

function createCoherentWavesAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    let waveCount = params.waveCount || 5;
    const decoherenceRate = params.decoherenceRate || 0.1;

    // Create waves
    const waves = [];

    function createWaves() {
        // Remove existing waves
        for (const wave of waves) {
            group.remove(wave.mesh);
            wave.geometry.dispose();
            wave.material.dispose();
        }
        waves.length = 0;

        // Create new waves
        for (let i = 0; i < waveCount; i++) {
            const geometry = new THREE.PlaneGeometry(4, 3, 50, 1);

            // Assign color based on wave index
            const hue = i / waveCount;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
                wireframe: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
            mesh.position.y = i * 0.1 - (waveCount - 1) * 0.05;

            group.add(mesh);

            waves.push({
                mesh: mesh,
                geometry: geometry,
                material: material,
                phaseOffset: (i / waveCount) * Math.PI * 2,
                frequency: 1 + i * 0.2,
                amplitude: 0.2,
                decoherence: 0
            });
        }
    }

    createWaves();

    // Add wave count slider
    const waveCountSlider = document.getElementById('wave-count-slider');
    if (waveCountSlider) {
        waveCountSlider.addEventListener('input', (e) => {
            waveCount = parseInt(e.target.value);
            createWaves();
        });
    }

    // Animation state
    let time = 0;
    let isInteracting = false;
    let interactionPoint = new THREE.Vector3();

    // Add interaction to cause decoherence
    document.addEventListener('mousedown', (e) => {
        isInteracting = true;

        // Calculate interaction point in 3D space
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        interactionPoint.set(x * 2, 0, y * 2);
    });

    document.addEventListener('mouseup', () => {
        isInteracting = false;
    });

    return {
        update: () => {
            time += 0.05;

            for (let i = 0; i < waves.length; i++) {
                const wave = waves[i];
                const positions = wave.geometry.attributes.position.array;

                // Update decoherence
                if (isInteracting) {
                    wave.decoherence = Math.min(1, wave.decoherence + decoherenceRate * Math.random());
                } else {
                    wave.decoherence = Math.max(0, wave.decoherence - 0.01);
                }

                // Update wave shape
                for (let j = 0; j < positions.length / 3; j++) {
                    const x = positions[j * 3];

                    // Calculate coherent wave
                    let y = Math.sin(x + time * wave.frequency + wave.phaseOffset) * wave.amplitude;

                    // Apply decoherence
                    if (wave.decoherence > 0) {
                        // Add distance-based decoherence from interaction point
                        const particlePos = new THREE.Vector3(x, 0, positions[j * 3 + 2]);
                        const distToInteraction = particlePos.distanceTo(interactionPoint);
                        const localDecoherence = wave.decoherence * Math.max(0, 1 - distToInteraction / 4);

                        // Add random noise based on decoherence
                        y += (Math.random() - 0.5) * localDecoherence * 0.4;

                        // Fade out coherent component
                        y *= (1 - localDecoherence * 0.5);
                    }

                    positions[j * 3 + 1] = y;
                }

                wave.geometry.attributes.position.needsUpdate = true;

                // Update opacity based on decoherence
                wave.material.opacity = 0.7 * (1 - wave.decoherence * 0.5);
            }

            // Rotate group
            group.rotation.y += 0.01;
        },
        dispose: () => {
            for (const wave of waves) {
                wave.geometry.dispose();
                wave.material.dispose();
            }
        }
    };
}

function createQubitSphereAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const rotationAxes = params.rotationAxes || true;
    const stateVisualization = params.stateVisualization || true;

    // Create Bloch sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        emissive: 0x111111,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    // Create axes
    const axisLength = 1.2;
    const xAxis = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        axisLength,
        0xff0000
    );

    const yAxis = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        axisLength,
        0x00ff00
    );

    const zAxis = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        axisLength,
        0x0000ff
    );

    group.add(xAxis, yAxis, zAxis);

    // Add axis labels
    function createTextLabel(text, position, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(0.2, 0.2, 0.2);

        return sprite;
    }

    const xLabel = createTextLabel('X', new THREE.Vector3(1.3, 0, 0), '#ff0000');
    const yLabel = createTextLabel('Y', new THREE.Vector3(0, 1.3, 0), '#00ff00');
    const zLabel = createTextLabel('Z', new THREE.Vector3(0, 0, 1.3), '#0000ff');

    group.add(xLabel, yLabel, zLabel);

    // Add state vectors
    const zeroState = new THREE.Vector3(0, 0, 1);
    const oneState = new THREE.Vector3(0, 0, -1);

    const zeroGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const zeroMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5
    });

    const oneGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const oneMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5
    });

    const zeroSphere = new THREE.Mesh(zeroGeometry, zeroMaterial);
    zeroSphere.position.copy(zeroState);

    const oneSphere = new THREE.Mesh(oneGeometry, oneMaterial);
    oneSphere.position.copy(oneState);

    group.add(zeroSphere, oneSphere);

    // Create state vector
    const arrowGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
    arrowGeometry.translate(0, 1, 0);
    arrowGeometry.rotateX(Math.PI / 2);

    const arrowMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.highlightColor,
        emissive: config.animationSettings.highlightColor,
        emissiveIntensity: 0.5
    });

    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    group.add(arrow);

    // Create arrow tip
    const tipGeometry = new THREE.ConeGeometry(0.05, 0.2, 8);
    tipGeometry.translate(0, 1.1, 0);
    tipGeometry.rotateX(Math.PI / 2);

    const tip = new THREE.Mesh(tipGeometry, arrowMaterial);
    group.add(tip);

    // Create superposition path
    const pathGeometry = new THREE.BufferGeometry();
    const pathMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    });

    const pathLine = new THREE.Line(pathGeometry, pathMaterial);
    group.add(pathLine);

    // Animation state
    let time = 0;
    let currentState = new THREE.Vector3(0, 0, 1);
    let targetState = new THREE.Vector3(0, 0, 1);
    let pathHistory = [];
    let rotationSpeed = 0.5;
    let path = [];
    let pathIndex = 0;

    // Generate a new random path
    function generatePath() {
        path = [];
        pathIndex = 0;

        // Create a series of points on the Bloch sphere
        const steps = 100;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;

            // Parameters for path
            const theta = t * Math.PI * 4;
            const phi = Math.sin(t * Math.PI * 2) * Math.PI;

            // Convert to Cartesian coordinates
            const x = Math.sin(theta) * Math.cos(phi);
            const y = Math.sin(theta) * Math.sin(phi);
            const z = Math.cos(theta);

            path.push(new THREE.Vector3(x, y, z));
        }
    }

    generatePath();

    // Setup rotation speed slider
    const rotationSpeedSlider = document.getElementById('rotation-speed-slider');
    if (rotationSpeedSlider) {
        rotationSpeedSlider.addEventListener('input', (e) => {
            rotationSpeed = parseFloat(e.target.value);
        });
    }

    return {
        update: () => {
            time += 0.016 * rotationSpeed;

            // Update qubit state along path
            if (path.length > 0) {
                pathIndex = (pathIndex + rotationSpeed * 0.5) % path.length;
                const idx = Math.floor(pathIndex);
                const nextIdx = (idx + 1) % path.length;
                const blend = pathIndex - idx;

                currentState.lerpVectors(path[idx], path[nextIdx], blend);
                currentState.normalize();
            }

            // Update arrow to point to current state
            const arrowQuat = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                currentState
            );

            arrow.quaternion.copy(arrowQuat);
            tip.quaternion.copy(arrowQuat);

            // Record path history
            pathHistory.push(currentState.clone());
            if (pathHistory.length > 100) {
                pathHistory.shift();
            }

            // Update path visualization
            const pathPositions = new Float32Array(pathHistory.length * 3);
            for (let i = 0; i < pathHistory.length; i++) {
                const point = pathHistory[i];
                pathPositions[i * 3] = point.x;
                pathPositions[i * 3 + 1] = point.y;
                pathPositions[i * 3 + 2] = point.z;
            }

            pathGeometry.setAttribute('position', new THREE.BufferAttribute(pathPositions, 3));

            // Rotate entire group
            group.rotation.y += 0.005;
        },
        dispose: () => {
            sphereGeometry.dispose();
            sphereMaterial.dispose();

            // Dispose axes
            xAxis.dispose();
            yAxis.dispose();
            zAxis.dispose();

            // Dispose labels
            xLabel.material.map.dispose();
            xLabel.material.dispose();
            yLabel.material.map.dispose();
            yLabel.material.dispose();
            zLabel.material.map.dispose();
            zLabel.material.dispose();

            // Dispose states
            zeroGeometry.dispose();
            zeroMaterial.dispose();
            oneGeometry.dispose();
            oneMaterial.dispose();

            // Dispose arrow
            arrowGeometry.dispose();
            arrowMaterial.dispose();
            tipGeometry.dispose();

            // Dispose path
            pathGeometry.dispose();
            pathMaterial.dispose();
        }
    };
}

function createQuantumFieldAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const fieldSize = params.fieldSize || 25;
    const excitationCount = params.excitationCount || 3;

    // Create field grid
    const gridSize = Math.ceil(Math.sqrt(fieldSize));
    const grid = new THREE.Group();

    const cellGeometry = new THREE.PlaneGeometry(4 / gridSize, 4 / gridSize);
    const cellMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const cell = new THREE.Mesh(cellGeometry, cellMaterial);
            cell.position.set(
                (x / gridSize) * 4 - 2 + 2 / gridSize,
                0,
                (y / gridSize) * 4 - 2 + 2 / gridSize
            );
            cell.rotation.x = Math.PI / 2;
            grid.add(cell);
        }
    }

    group.add(grid);

    // Create field values visualization
    const fieldPointCount = fieldSize;
    const fieldGeometry = new THREE.BufferGeometry();
    const fieldPositions = new Float32Array(fieldPointCount * 3);
    const fieldColors = new Float32Array(fieldPointCount * 3);
    const fieldSizes = new Float32Array(fieldPointCount);

    // Initialize field points in grid
    for (let i = 0; i < fieldPointCount; i++) {
        const x = i % gridSize;
        const y = Math.floor(i / gridSize);

        fieldPositions[i * 3] = (x / gridSize) * 4 - 2 + 2 / gridSize;
        fieldPositions[i * 3 + 1] = 0;
        fieldPositions[i * 3 + 2] = (y / gridSize) * 4 - 2 + 2 / gridSize;

        // Initial color (blue)
        fieldColors[i * 3] = 0;
        fieldColors[i * 3 + 1] = 0.5;
        fieldColors[i * 3 + 2] = 1.0;

        fieldSizes[i] = 0.1;
    }

    fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
    fieldGeometry.setAttribute('color', new THREE.BufferAttribute(fieldColors, 3));
    fieldGeometry.setAttribute('size', new THREE.BufferAttribute(fieldSizes, 1));

    const fieldMaterial = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const fieldPoints = new THREE.Points(fieldGeometry, fieldMaterial);
    group.add(fieldPoints);

    // Create excitation particles
    const excitationGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const excitationMaterial = new THREE.MeshStandardMaterial({
        color: config.animationSettings.highlightColor,
        emissive: config.animationSettings.highlightColor,
        emissiveIntensity: 0.8
    });

    const excitations = [];

    for (let i = 0; i < excitationCount; i++) {
        const mesh = new THREE.Mesh(excitationGeometry, excitationMaterial.clone());

        // Random position on grid
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);

        mesh.position.set(
            (x / gridSize) * 4 - 2 + 2 / gridSize,
            0.1, // Slightly above field
            (y / gridSize) * 4 - 2 + 2 / gridSize
        );

        group.add(mesh);

        excitations.push({
            mesh: mesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                0,
                (Math.random() - 0.5) * 0.02
            ),
            gridPos: { x, y }
        });
    }

    // Animation state
    let time = 0;
    const fieldValues = new Array(fieldPointCount).fill(0);

    // Add field size slider
    const fieldSizeSlider = document.getElementById('field-size-slider');
    if (fieldSizeSlider) {
        fieldSizeSlider.addEventListener('input', (e) => {
            const size = parseFloat(e.target.value);
            for (let i = 0; i < fieldSizes.length; i++) {
                fieldSizes[i] = size * 0.02 + 0.05;
            }
            fieldGeometry.attributes.size.needsUpdate = true;
        });
    }

    return {
        update: () => {
            time += 0.016;

            // Update excitation positions
            for (const excitation of excitations) {
                excitation.mesh.position.x += excitation.velocity.x;
                excitation.mesh.position.z += excitation.velocity.z;

                // Bounce off boundaries
                if (excitation.mesh.position.x < -2 || excitation.mesh.position.x > 2) {
                    excitation.velocity.x *= -1;
                }

                if (excitation.mesh.position.z < -2 || excitation.mesh.position.z > 2) {
                    excitation.velocity.z *= -1;
                }

                // Update grid position
                excitation.gridPos.x = Math.floor(((excitation.mesh.position.x + 2) / 4) * gridSize);
                excitation.gridPos.y = Math.floor(((excitation.mesh.position.z + 2) / 4) * gridSize);

                // Keep in bounds
                excitation.gridPos.x = Math.max(0, Math.min(gridSize - 1, excitation.gridPos.x));
                excitation.gridPos.y = Math.max(0, Math.min(gridSize - 1, excitation.gridPos.y));

                // Visualize excitation
                const index = excitation.gridPos.y * gridSize + excitation.gridPos.x;
                if (index < fieldValues.length) {
                    fieldValues[index] = 1;
                }

                // Make particles pulse
                const scale = 0.8 + Math.sin(time * 5 + Math.PI * 2 * Math.random()) * 0.2;
                excitation.mesh.scale.set(scale, scale, scale);
            }

            // Update field visualization
            const positions = fieldGeometry.attributes.position.array;
            const colors = fieldGeometry.attributes.color.array;

            for (let i = 0; i < fieldPointCount; i++) {
                // Decay field values
                fieldValues[i] *= 0.99;

                // Calculate field propagation
                for (const excitation of excitations) {
                    const x = i % gridSize;
                    const y = Math.floor(i / gridSize);

                    const dx = x - excitation.gridPos.x;
                    const dy = y - excitation.gridPos.y;
                    const distSq = dx * dx + dy * dy;

                    const influence = Math.exp(-distSq / 10) * 0.2;
                    fieldValues[i] += influence;
                }

                // Update field visualization based on values
                const value = Math.min(1, fieldValues[i]);

                // Update height based on field value
                positions[i * 3 + 1] = value * 0.5;

                // Update color based on field value (blue to yellow)
                colors[i * 3] = value;
                colors[i * 3 + 1] = 0.5;
                colors[i * 3 + 2] = 1.0 - value * 0.7;

                // Update size based on field value
                fieldSizes[i] = 0.1 + value * 0.2;
            }

            fieldGeometry.attributes.position.needsUpdate = true;
            fieldGeometry.attributes.color.needsUpdate = true;
            fieldGeometry.attributes.size.needsUpdate = true;

            // Rotate the entire group
            group.rotation.y += 0.005;
        },
        dispose: () => {
            cellGeometry.dispose();
            cellMaterial.dispose();
            fieldGeometry.dispose();
            fieldMaterial.dispose();
            excitationGeometry.dispose();

            for (const excitation of excitations) {
                excitation.mesh.material.dispose();
            }
        }
    };
}

function createHolismPatternAnimation(params) {
    const group = new THREE.Group();
    scene.add(group);

    // Parameters
    const particleCount = params.particleCount || 200;
    const emergenceVisualization = params.emergenceVisualization || true;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    // Initialize particles in a spherical volume
    for (let i = 0; i < particleCount; i++) {
        const radius = 2 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);

        // Initial color (blue)
        particleColors[i * 3] = 0.2;
        particleColors[i * 3 + 1] = 0.5;
        particleColors[i * 3 + 2] = 1.0;

        particleSizes[i] = 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);

    // Create emergence visualization
    let emergentShape = null;
    let shapeMesh = null;

    if (emergenceVisualization) {
        // Create emergent shape (initially invisible)
        emergentShape = new THREE.IcosahedronGeometry(1, 1);
        const shapeMaterial = new THREE.MeshStandardMaterial({
            color: config.animationSettings.highlightColor,
            emissive: config.animationSettings.highlightColor,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0,
            wireframe: true
        });

        shapeMesh = new THREE.Mesh(emergentShape, shapeMaterial);
        group.add(shapeMesh);
    }

    // Animation state
    let time = 0;
    let interactionLevel = 0;
    let emergenceLevel = 0;

    // Particle dynamics data
    const particleData = [];
    for (let i = 0; i < particleCount; i++) {
        particleData.push({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            ),
            originalPos: new THREE.Vector3(
                particlePositions[i * 3],
                particlePositions[i * 3 + 1],
                particlePositions[i * 3 + 2]
            ),
            neighbors: []
        });
    }

    // Particle count slider
    const particleCountSlider = document.getElementById('particle-count-slider');
    if (particleCountSlider) {
        particleCountSlider.addEventListener('input', (e) => {
            // We can't actually change the particle count dynamically,
            // but we can adjust other aspects like size or visibility
            const scale = parseInt(e.target.value) / particleCount;

            // Adjust particle sizes
            const sizes = particlesGeometry.attributes.size.array;
            for (let i = 0; i < sizes.length; i++) {
                sizes[i] = 0.1 * scale;
            }

            particlesGeometry.attributes.size.needsUpdate = true;
        });
    }

    // Interaction for increasing connection strength
    document.addEventListener('mousedown', () => {
        interactionLevel = Math.min(1, interactionLevel + 0.1);
    });

    document.addEventListener('mouseup', () => {
        // Don't reset immediately, let it fade
    });

    return {
        update: () => {
            time += 0.016;

            // Gradually reduce interaction level
            interactionLevel = Math.max(0, interactionLevel - 0.005);

            // Update emergence level based on interaction
            emergenceLevel = Math.max(emergenceLevel, interactionLevel);
            emergenceLevel = Math.max(0, emergenceLevel - 0.001);

            // Update particles
            const positions = particlesGeometry.attributes.position.array;
            const colors = particlesGeometry.attributes.color.array;
            const sizes = particlesGeometry.attributes.size.array;

            // Calculate neighbors (simplified, not actual n-body)
            if (interactionLevel > 0) {
                for (let i = 0; i < particleCount; i++) {
                    particleData[i].neighbors = [];

                    const ix = positions[i * 3];
                    const iy = positions[i * 3 + 1];
                    const iz = positions[i * 3 + 2];

                    for (let j = 0; j < particleCount; j++) {
                        if (i === j) continue;

                        const jx = positions[j * 3];
                        const jy = positions[j * 3 + 1];
                        const jz = positions[j * 3 + 2];

                        const dx = jx - ix;
                        const dy = jy - iy;
                        const dz = jz - iz;

                        const distSq = dx * dx + dy * dy + dz * dz;
                        if (distSq < 0.5) {
                            particleData[i].neighbors.push(j);
                        }
                    }
                }
            }

            // Update particle positions
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const data = particleData[i];

                // Apply velocity
                positions[i3] += data.velocity.x;
                positions[i3 + 1] += data.velocity.y;
                positions[i3 + 2] += data.velocity.z;

                // Apply neighbor interactions
                if (interactionLevel > 0 && data.neighbors.length > 0) {
                    let avgX = 0, avgY = 0, avgZ = 0;

                    for (const neighbor of data.neighbors) {
                        avgX += positions[neighbor * 3];
                        avgY += positions[neighbor * 3 + 1];
                        avgZ += positions[neighbor * 3 + 2];
                    }

                    avgX /= data.neighbors.length;
                    avgY /= data.neighbors.length;
                    avgZ /= data.neighbors.length;

                    // Move slightly toward average neighbor position
                    positions[i3] += (avgX - positions[i3]) * 0.01 * interactionLevel;
                    positions[i3 + 1] += (avgY - positions[i3 + 1]) * 0.01 * interactionLevel;
                    positions[i3 + 2] += (avgZ - positions[i3 + 2]) * 0.01 * interactionLevel;

                    // Add some random movement
                    positions[i3] += (Math.random() - 0.5) * 0.005;
                    positions[i3 + 1] += (Math.random() - 0.5) * 0.005;
                    positions[i3 + 2] += (Math.random() - 0.5) * 0.005;
                }

                // Apply emergence force - move toward emergent shape
                if (emergenceLevel > 0 && emergentShape) {
                    // Calculate target position on emergent shape
                    const currentPos = new THREE.Vector3(
                        positions[i3],
                        positions[i3 + 1],
                        positions[i3 + 2]
                    );

                    // Normalize to unit sphere
                    const direction = currentPos.clone().normalize();

                    // Move toward emergent shape's surface
                    positions[i3] += (direction.x - positions[i3]) * 0.01 * emergenceLevel;
                    positions[i3 + 1] += (direction.y - positions[i3 + 1]) * 0.01 * emergenceLevel;
                    positions[i3 + 2] += (direction.z - positions[i3 + 2]) * 0.01 * emergenceLevel;

                    // Update color based on emergence (blue to yellow)
                    colors[i3] = Math.min(1, 0.2 + emergenceLevel * 0.8);
                    colors[i3 + 1] = 0.5;
                    colors[i3 + 2] = Math.max(0, 1.0 - emergenceLevel * 0.8);

                    // Update size based on emergence
                    sizes[i] = 0.1 + emergenceLevel * 0.05;
                }

                // Keep within bounds
                const posVec = new THREE.Vector3(
                    positions[i3],
                    positions[i3 + 1],
                    positions[i3 + 2]
                );

                if (posVec.length() > 3) {
                    posVec.normalize().multiplyScalar(3);
                    positions[i3] = posVec.x;
                    positions[i3 + 1] = posVec.y;
                    positions[i3 + 2] = posVec.z;

                    // Reverse velocity when hitting boundary
                    data.velocity.multiplyScalar(-0.5);
                }

                // Apply small drift toward center
                const dist = posVec.length();
                positions[i3] -= posVec.x * 0.001 * dist;
                positions[i3 + 1] -= posVec.y * 0.001 * dist;
                positions[i3 + 2] -= posVec.z * 0.001 * dist;

                // Apply damping
                data.velocity.multiplyScalar(0.99);
            }

            particlesGeometry.attributes.position.needsUpdate = true;
            particlesGeometry.attributes.color.needsUpdate = true;
            particlesGeometry.attributes.size.needsUpdate = true;

            // Update emergent shape
            if (shapeMesh) {
                shapeMesh.material.opacity = emergenceLevel * 0.5;

                // Pulse effect
                const pulse = 0.9 + Math.sin(time * 2) * 0.1;
                shapeMesh.scale.set(pulse, pulse, pulse);

                // Rotate slightly
                shapeMesh.rotation.y += 0.01;
                shapeMesh.rotation.z += 0.005;
            }

            // Rotate the entire group
            group.rotation.y += 0.002;
        },
        dispose: () => {
            particlesGeometry.dispose();
            particlesMaterial.dispose();

            if (emergentShape) {
                emergentShape.dispose();
                shapeMesh.material.dispose();
            }
        }
    };
}

function createUncertaintyAnimation(params) {
    return createUncertaintyPrincipleAnimation(params);
}

// Setup event listeners
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);

        isMobile = window.innerWidth < 768;
    });

    // Navigation
    prevVerseButton.addEventListener('click', () => {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            loadVerse(currentVerseIndex);
            // Update URL hash
            window.location.hash = `verse-${currentVerseIndex + 1}`;
        }
    });

    nextVerseButton.addEventListener('click', () => {
        if (currentVerseIndex < config.verses.length - 1) {
            currentVerseIndex++;
            loadVerse(currentVerseIndex);
            // Update URL hash
            window.location.hash = `verse-${currentVerseIndex + 1}`;
        }
    });

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        checkUrlHash();
        loadVerse(currentVerseIndex);
    });

    // Toggle explanation visibility
    toggleExplanationButton.addEventListener('click', () => {
        const explanationContent = document.getElementById('explanation-content');

        if (explanationContent.style.display === 'none') {
            explanationContent.style.display = 'block';
            toggleExplanationButton.textContent = 'Hide';
        } else {
            explanationContent.style.display = 'none';
            toggleExplanationButton.textContent = 'Show';
        }
    });

    // Toggle controls visibility
    toggleControlsButton.addEventListener('click', () => {
        const controlsContent = document.getElementById('controls-content');

        if (controlsContent.style.display === 'none') {
            controlsContent.style.display = 'block';
            toggleControlsButton.textContent = 'Hide';
        } else {
            controlsContent.style.display = 'none';
            toggleControlsButton.textContent = 'Show';
        }
    });
}

// Check URL hash for direct verse linking
function checkUrlHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#verse-')) {
        const verseNumber = parseInt(hash.substring(7));
        if (!isNaN(verseNumber) && verseNumber >= 1 && verseNumber <= config.verses.length) {
            currentVerseIndex = verseNumber - 1;
        }
    }
}

// Initialize the application
checkUrlHash();
init();