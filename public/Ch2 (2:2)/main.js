import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap'; // Assuming gsap is available via import map or globally
import { verses } from './config.js'; // Verses 14-25

// --- State ---
let currentVerseIndex = 0; // Index within the 'verses' array (0 corresponds to verse 14)
let scene, camera, renderer, composer, controls;
let sceneObjects = [];
let animationFrameId;
let clock = new THREE.Clock();
let animationMixers = [];
let interactiveObjects = [];
let mousePosition = new THREE.Vector2();
let currentAnimationUpdate = null; // Function to update the current animation
let currentAnimationDispose = null; // Function to clean up the current animation

// --- DOM Elements (Matching Part 1's HTML structure) ---
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

// --- Initialization ---
function initializeApp() {
    initSceneBase(); // Initialize Three.js basics
    setupUI(); // Setup UI listeners
    changeVerse(0); // Corrected function call: Load the first verse (verse 14)
    animate(); // Start animation loop
}

// Initialize Three.js Scene, Camera, Renderer, Composer, Controls
function initSceneBase() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000020); // Background from Part 2

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10); // Default position from Part 2

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (container) { // Check if container exists
        container.appendChild(renderer.domElement);
    } else {
        console.error("Animation container not found!");
        return;
    }


    const ambientLight = new THREE.AmbientLight(0x333333); // Lighting from Part 2
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Post-processing from Part 2
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85
    );
    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    clock = new THREE.Clock();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
}

// --- UI Setup (Matching Part 1 Logic) ---
function setupUI() {
    // Verse Indicator Dots
    verses.forEach((verse, index) => {
        const dot = document.createElement('div');
        dot.classList.add('verse-dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        dot.addEventListener('click', () => changeVerse(index));
        if (verseIndicator) verseIndicator.appendChild(dot);
    });

    // Tab Buttons
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                if (tabContents) tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                const activeContent = document.getElementById(`${tab}-content`);
                if (activeContent) activeContent.classList.add('active');
            });
        });
    }


    // Toggle Panel Button
    if (togglePanelBtn && controlPanel) {
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
    }


    // Navigation Buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            changeVerse(Math.max(0, currentVerseIndex - 1));
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            changeVerse(Math.min(verses.length - 1, currentVerseIndex + 1));
        });
    }
}


// --- Animation Loop ---
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    if (!scene || !camera || !composer) return; // Exit if scene not ready

    const delta = clock.getDelta();

    animationMixers.forEach(mixer => mixer.update(delta));

    // Call the current verse's update function
    if (currentAnimationUpdate) {
        currentAnimationUpdate(delta, verses[currentVerseIndex]?.sceneConfig || {});
    }


    if (controls) controls.update();
    composer.render();
}

// --- Event Handlers ---
function onWindowResize() {
    if (!camera || !renderer || !composer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick() {
    if (!camera || !scene || !interactiveObjects.length) return;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0 && intersects[0].object.userData.onClick) {
        intersects[0].object.userData.onClick();
    }
}

// --- Scene Management ---
function clearScene() {
    if (!scene) return;
    // Call dispose function if it exists
    if (currentAnimationDispose) {
        currentAnimationDispose();
        currentAnimationDispose = null;
    }
    // Fallback cleanup
    sceneObjects.forEach(obj => {
        if (obj.parent) obj.parent.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
             if (Array.isArray(obj.material)) {
                 obj.material.forEach(m => {
                     if (m.map) m.map.dispose();
                     m.dispose();
                 });
             } else {
                 if (obj.material.map) obj.material.map.dispose();
                 obj.material.dispose();
             }
        }
    });
    sceneObjects = [];
    animationMixers = [];
    interactiveObjects = [];
    gsap.killTweensOf('*'); // Kill GSAP animations
    currentAnimationUpdate = null;
}

// Update UI Content (Adapted from Part 1's changeVerse)
function updateUIContent(verseIndex) {
    const verse = verses[verseIndex];
    if (!verse) return;

    // Use IDs from Part 1's HTML
    if (verseTitle) verseTitle.textContent = `Verse ${verse.number}`; // Part 2 uses 'number', Part 1 uses 'title'
    if (verseText) verseText.textContent = verse.text;
    if (madhyamakaContent) madhyamakaContent.textContent = verse.madhyamakaConcept;
    if (quantumContent) quantumContent.textContent = verse.quantumParallel;
    if (explanationContent) explanationContent.textContent = verse.accessibleExplanation;

    // Update dots
    if (verseIndicator) {
        document.querySelectorAll('.verse-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === verseIndex);
        });
    }


    // Update navigation buttons
    if (prevBtn) prevBtn.disabled = verseIndex === 0;
    if (nextBtn) nextBtn.disabled = verseIndex === verses.length - 1;

    // Create verse-specific controls (Placeholder - Part 2 config doesn't define them like Part 1)
    createVerseControls(verse);
}

// --- Verse Loading and Animation Creation ---
function changeVerse(index) {
    if (index < 0 || index >= verses.length || !scene) return;

    clearScene(); // Clean up previous scene first

    currentVerseIndex = index;
    updateUIContent(index); // Update text, buttons, dots

    // Create new animation scene
    const verse = verses[index];
    const animationFunctions = createSceneForVerse(verse); // Get create/update/dispose functions

    if (animationFunctions) {
        animationFunctions.create(verse.sceneConfig || {}); // Call create function
        currentAnimationUpdate = animationFunctions.update; // Set update function
        currentAnimationDispose = animationFunctions.dispose; // Set dispose function
    } else {
        createDefaultScene(); // Fallback
        currentAnimationUpdate = null;
        currentAnimationDispose = null;
    }


    // Optional: Camera animation (from Part 2)
    gsap.to(camera.position, { x: 0, y: 0, z: 10, duration: 1, ease: "power2.inOut" });
}

// Maps verse type to creation/update/dispose functions
function createSceneForVerse(verse) {
    if (!verse || !verse.sceneConfig || !verse.sceneConfig.type) {
        return { create: createDefaultScene, update: null, dispose: null };
    }

    const type = verse.sceneConfig.type;
    // Map type to the specific functions defined below
    const functionMap = {
        'temporalSuperposition': { create: createTemporalSuperpositionScene, update: updateTemporalSuperposition, dispose: defaultDispose },
        'waveParticleDuality': { create: createWaveParticleScene, update: updateWaveParticleDuality, dispose: defaultDispose },
        'complementarity': { create: createComplementarityScene, update: updateComplementarity, dispose: defaultDispose },
        'continuousFlow': { create: createContinuousFlowScene, update: updateContinuousFlow, dispose: defaultDispose },
        'entanglement': { create: createEntanglementScene, update: updateEntanglement, dispose: defaultDispose },
        'observerEffect': { create: createObserverEffectScene, update: updateObserverEffect, dispose: defaultDispose },
        'inseparablePair': { create: createInseparablePairScene, update: updateInseparablePair, dispose: defaultDispose },
        'superpositionBlend': { create: createSuperpositionBlendScene, update: updateSuperpositionBlend, dispose: defaultDispose },
        'observationalEmergence': { create: createObservationalEmergenceScene, update: updateObservationalEmergence, dispose: defaultDispose },
        'quantumIdentity': { create: createQuantumIdentityScene, update: updateQuantumIdentity, dispose: defaultDispose },
        'existentialSuperposition': { create: createExistentialSuperpositionScene, update: updateExistentialSuperposition, dispose: defaultDispose },
        'relationalMirage': { create: createRelationalMirageScene, update: updateRelationalMirage, dispose: defaultDispose }
        // Add other verse types here
    };

    return functionMap[type] || { create: createDefaultScene, update: null, dispose: null };
}

// Default dispose function (can be overridden by specific scenes if needed)
function defaultDispose() {
    // Basic cleanup is handled by clearScene, add specific disposal here if needed
}

// --- Verse-Specific Controls (Adapted from Part 1) ---
// Action handler (Placeholder - needs mapping if controls are added)
function handleAction(action, value) {
    console.log("Action:", action, "Value:", value);
    // Example: if (currentAnimation && currentAnimation.actions && currentAnimation.actions[action]) {
    //     currentAnimation.actions[action](value);
    // }
}

// Create controls (Placeholder - Part 2 config lacks 'controls' array)
function createVerseControls(verse) {
    if (verseSpecificControls) verseSpecificControls.innerHTML = ''; // Clear previous controls
    // Logic to create buttons/sliders based on verse.sceneConfig or a new 'controls' array if added to config
    // Example: if (verse.sceneConfig.interactive) { ... create button ... }
}


// --- Scene Creation & Update Functions (Copied from Part 2's main.js, wrapped) ---
// NOTE: These functions now assume 'scene', 'sceneObjects', 'interactiveObjects', 'gsap', 'clock' are available globally within this module.

function createDefaultScene() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    sceneObjects.push(cube);
}

// Verse 14: Temporal Superposition
function createTemporalSuperpositionScene(config) {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.particleCount * 3);
    const colors = new Float32Array(config.particleCount * 3);
    const sizes = new Float32Array(config.particleCount);
    const timeOffsets = new Float32Array(config.particleCount);
    const color1 = new THREE.Color(config.colors.primary);
    const color2 = new THREE.Color(config.colors.secondary);
    const color3 = new THREE.Color(config.colors.tertiary);
    for (let i = 0; i < config.particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        const colorMix = Math.random();
        let particleColor;
        if (colorMix < 0.33) particleColor = color1.clone().lerp(color2, colorMix * 3);
        else if (colorMix < 0.66) particleColor = color2.clone().lerp(color3, (colorMix - 0.33) * 3);
        else particleColor = color3.clone().lerp(color1, (colorMix - 0.66) * 3);
        colors[i * 3] = particleColor.r; colors[i * 3 + 1] = particleColor.g; colors[i * 3 + 2] = particleColor.b;
        sizes[i] = Math.random() * 0.1 + 0.05;
        timeOffsets[i] = Math.random() * Math.PI * 2;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.userData = { timeOffsets: timeOffsets };
    const particleMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles); sceneObjects.push(particles);
    for (let p = 0; p < config.pathComplexity; p++) {
        const pathCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3),
            new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4),
            new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4),
            new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3)
        );
        const pathGeometry = new THREE.TubeGeometry(pathCurve, 100, 0.02, 8, true);
        const pathMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.tertiary), transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        scene.add(path); sceneObjects.push(path);
        gsap.to(pathMaterial, { opacity: 0.7, duration: 3 + Math.random() * 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
}
function updateTemporalSuperposition(delta, config) {
    const particles = sceneObjects.find(obj => obj.type === 'Points'); if (!particles) return;
    const positions = particles.geometry.getAttribute('position'); const timeOffsets = particles.geometry.userData.timeOffsets; const sizes = particles.geometry.getAttribute('size');
    for (let i = 0; i < positions.count; i++) {
        const time = clock.elapsedTime * config.speed + timeOffsets[i];
        const x = positions.getX(i); const y = positions.getY(i); const z = positions.getZ(i);
        positions.setX(i, x + Math.sin(time * 0.5) * 0.02); positions.setY(i, y + Math.cos(time * 0.3) * 0.02); positions.setZ(i, z + Math.sin(time * 0.4) * 0.02);
        sizes.setX(i, Math.abs(Math.sin(time) * 0.05) + 0.05);
    }
    positions.needsUpdate = true; sizes.needsUpdate = true;
}

// Verse 15: Wave-Particle Duality
function createWaveParticleScene(config) {
    const waveParticleCount = config.particleCount; const waveGeometry = new THREE.BufferGeometry();
    const wavePositions = new Float32Array(waveParticleCount * 3); const waveColors = new Float32Array(waveParticleCount * 3);
    const waveSizes = new Float32Array(waveParticleCount); const waveStates = new Float32Array(waveParticleCount);
    const waveColor = new THREE.Color(config.colors.waveState); const particleColor = new THREE.Color(config.colors.particleState); const transitionColor = new THREE.Color(config.colors.transition);
    for (let i = 0; i < waveParticleCount; i++) {
        const angle = (i / waveParticleCount) * Math.PI * 2; const radius = 5;
        wavePositions[i * 3] = Math.cos(angle) * radius; wavePositions[i * 3 + 1] = Math.sin(angle) * radius; wavePositions[i * 3 + 2] = 0;
        waveColors[i * 3] = waveColor.r; waveColors[i * 3 + 1] = waveColor.g; waveColors[i * 3 + 2] = waveColor.b;
        waveSizes[i] = 0.1; waveStates[i] = 0;
    }
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3)); waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3)); waveGeometry.setAttribute('size', new THREE.BufferAttribute(waveSizes, 1));
    waveGeometry.userData = { states: waveStates, originalPositions: wavePositions.slice(), time: 0 };
    const waveMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const waveParticles = new THREE.Points(waveGeometry, waveMaterial); scene.add(waveParticles); sceneObjects.push(waveParticles);
    const entityGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const entityMaterial = new THREE.MeshPhongMaterial({ color: transitionColor, emissive: transitionColor, emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const entity = new THREE.Mesh(entityGeometry, entityMaterial); scene.add(entity); sceneObjects.push(entity);
    gsap.to(entity.scale, { x: 1.5, y: 0.5, z: 1.5, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(entityMaterial, { emissiveIntensity: 0.8, duration: 2, repeat: -1, yoyo: true });
}
function updateWaveParticleDuality(delta, config) {
    const waveParticles = sceneObjects.find(obj => obj.type === 'Points'); if (!waveParticles) return;
    const positions = waveParticles.geometry.getAttribute('position'); const colors = waveParticles.geometry.getAttribute('color'); const sizes = waveParticles.geometry.getAttribute('size');
    const states = waveParticles.geometry.userData.states; const origPositions = waveParticles.geometry.userData.originalPositions;
    waveParticles.geometry.userData.time += delta; const time = waveParticles.geometry.userData.time;
    const globalWaveFactor = (Math.sin(time * config.speed) + 1) / 2;
    const waveColor = new THREE.Color(config.colors.waveState); const particleColor = new THREE.Color(config.colors.particleState); const transitionColor = new THREE.Color(config.colors.transition);
    for (let i = 0; i < positions.count; i++) {
        const angle = (i / positions.count) * Math.PI * 2; const baseRadius = 5;
        const waveFactor = globalWaveFactor; states[i] = waveFactor;
        const waveDisplacement = Math.sin(angle * 6 + time * 2) * config.amplitude * waveFactor; const radius = baseRadius + waveDisplacement * 0.5;
        positions.setX(i, Math.cos(angle) * radius); positions.setY(i, Math.sin(angle) * radius); positions.setZ(i, waveDisplacement);
        sizes.setX(i, 0.05 + waveFactor * 0.1);
        let currentColor;
        if (waveFactor < 0.5) currentColor = particleColor.clone().lerp(transitionColor, waveFactor * 2);
        else currentColor = transitionColor.clone().lerp(waveColor, (waveFactor - 0.5) * 2);
        colors.setXYZ(i, currentColor.r, currentColor.g, currentColor.b);
    }
    positions.needsUpdate = true; colors.needsUpdate = true; sizes.needsUpdate = true;
}

// Verse 16: Complementarity
function createComplementarityScene(config) {
    const waveGeometry = new THREE.TorusKnotGeometry(3, 0.8, 128, 32); const particleGeometry = new THREE.SphereGeometry(2, 32, 32);
    const waveMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.wave), emissive: new THREE.Color(config.colors.wave), emissiveIntensity: 0.5, transparent: true, opacity: 0.9, wireframe: true });
    const particleMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.particle), emissive: new THREE.Color(config.colors.particle), emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const waveObject = new THREE.Mesh(waveGeometry, waveMaterial); const particleObject = new THREE.Mesh(particleGeometry, particleMaterial);
    particleObject.visible = false; scene.add(waveObject); scene.add(particleObject); sceneObjects.push(waveObject, particleObject);
    const detectorGeometry = new THREE.BoxGeometry(1, 1, 1);
    const detectorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xaaaaaa, transparent: true, opacity: 0.7 });
    const detector = new THREE.Mesh(detectorGeometry, detectorMaterial); detector.position.set(6, 0, 0); scene.add(detector); sceneObjects.push(detector);
    detector.userData = { isDetector: true, isActive: false, onClick: () => {
        const isParticleVisible = particleObject.visible; waveObject.visible = isParticleVisible; particleObject.visible = !isParticleVisible;
        gsap.to(detector.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, repeat: 1, yoyo: true });
        gsap.to(detector.material, { emissiveIntensity: 0.8, duration: 0.3, repeat: 1, yoyo: true });
    }}; interactiveObjects.push(detector);
    // Add helper text (simplified)
    // createText("Click the cube to measure", new THREE.Vector3(6, 2, 0), 0xffffff); // Assuming createText exists
}
function updateComplementarity(delta, config) {
    const waveObject = sceneObjects.find(obj => obj.geometry?.type === 'TorusKnotGeometry');
    const particleObject = sceneObjects.find(obj => obj.geometry?.type === 'SphereGeometry');
    if (waveObject && waveObject.visible) { waveObject.rotation.x += delta * 0.2; waveObject.rotation.y += delta * 0.3; }
    if (particleObject && particleObject.visible) { particleObject.rotation.y += delta * 0.5; }
    const detector = sceneObjects.find(obj => obj.userData?.isDetector);
    if (detector && !detector.userData.hasBeenAnimated) {
        gsap.to(detector.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, repeat: -1, yoyo: true });
        detector.userData.hasBeenAnimated = true;
    }
}

// Verse 17: Continuous Flow
function createContinuousFlowScene(config) {
    const flowGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.streamDensity * 3);
    const colors = new Float32Array(config.streamDensity * 3);
    const sizes = new Float32Array(config.streamDensity);
    const lifetimes = new Float32Array(config.streamDensity);
    const streamColor = new THREE.Color(config.colors.stream);
    const glowColor = new THREE.Color(config.colors.glow);
    for (let i = 0; i < config.streamDensity; i++) {
        const angle = Math.random() * Math.PI * 2; const radius = Math.random() * 5; const height = (Math.random() - 0.5) * 20;
        positions[i * 3] = Math.cos(angle) * radius; positions[i * 3 + 1] = height; positions[i * 3 + 2] = Math.sin(angle) * radius;
        const colorMix = Math.random(); const particleColor = streamColor.clone().lerp(glowColor, colorMix);
        colors[i * 3] = particleColor.r; colors[i * 3 + 1] = particleColor.g; colors[i * 3 + 2] = particleColor.b;
        sizes[i] = Math.random() * 0.1 + 0.05; lifetimes[i] = Math.random();
    }
    flowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); flowGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); flowGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    flowGeometry.userData = { lifetimes: lifetimes, originalHeights: positions.slice() };
    const flowMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const flowParticles = new THREE.Points(flowGeometry, flowMaterial); scene.add(flowParticles); sceneObjects.push(flowParticles);
    const flowCurve = new THREE.CatmullRomCurve3([ new THREE.Vector3(0, -8, 0), new THREE.Vector3(2, -4, 2), new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 4, 2), new THREE.Vector3(0, 8, 0) ]);
    const flowPathGeometry = new THREE.TubeGeometry(flowCurve, 100, 0.2, 8, false);
    const flowPathMaterial = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const flowPath = new THREE.Mesh(flowPathGeometry, flowPathMaterial); scene.add(flowPath); sceneObjects.push(flowPath);
    gsap.to(flowPathMaterial, { opacity: 0.6, duration: 2, repeat: -1, yoyo: true });
}
function updateContinuousFlow(delta, config) {
    const flowParticles = sceneObjects.find(obj => obj.type === 'Points'); if (!flowParticles) return;
    const positions = flowParticles.geometry.getAttribute('position'); const lifetimes = flowParticles.geometry.userData.lifetimes; const originalHeights = flowParticles.geometry.userData.originalHeights;
    for (let i = 0; i < positions.count; i++) {
        lifetimes[i] += delta * config.flowRate; if (lifetimes[i] > 1) lifetimes[i] -= 1;
        const idx = i * 3; const x = positions.getX(i); const y = originalHeights[idx + 1]; const z = positions.getZ(i);
        const flowHeight = y - lifetimes[i] * 20; positions.setY(i, flowHeight % 20 - 10);
        const turbulence = config.turbulence * Math.sin(lifetimes[i] * 10 + clock.elapsedTime);
        positions.setX(i, x + turbulence * 0.1); positions.setZ(i, z + turbulence * 0.1);
    }
    positions.needsUpdate = true;
}

// Verse 18: Entanglement
function createEntanglementScene(config) {
    const particle1Geometry = new THREE.SphereGeometry(0.5, 32, 32); const particle2Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle1Material = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.particle1), emissive: new THREE.Color(config.colors.particle1), emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const particle2Material = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.particle2), emissive: new THREE.Color(config.colors.particle2), emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material); const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    particle1.position.set(3, 0, 0); particle2.position.set(-3, 0, 0); scene.add(particle1); scene.add(particle2); sceneObjects.push(particle1, particle2);
    const connectionGeometry = new THREE.BufferGeometry(); const connectionPositions = new Float32Array(2 * 3);
    connectionPositions[0] = particle1.position.x; connectionPositions[1] = particle1.position.y; connectionPositions[2] = particle1.position.z;
    connectionPositions[3] = particle2.position.x; connectionPositions[4] = particle2.position.y; connectionPositions[5] = particle2.position.z;
    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
    const connectionMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(config.colors.connection), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const connection = new THREE.Line(connectionGeometry, connectionMaterial); scene.add(connection); sceneObjects.push(connection);
    const orbit1Geometry = new THREE.TorusGeometry(3, 0.05, 16, 100); const orbit2Geometry = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.connection), transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const orbit1 = new THREE.Mesh(orbit1Geometry, orbitMaterial); const orbit2 = new THREE.Mesh(orbit2Geometry, orbitMaterial);
    orbit1.rotation.x = Math.PI / 2; orbit2.rotation.x = Math.PI / 2; orbit2.rotation.y = Math.PI / 4; scene.add(orbit1); scene.add(orbit2); sceneObjects.push(orbit1, orbit2);
    particle1.userData = { angle: 0, radius: 3, orbitDirection: 1, entangledWith: particle2 };
    particle2.userData = { angle: Math.PI, radius: 3, orbitDirection: -1, entangledWith: particle1 };
    connection.userData = { particleA: particle1, particleB: particle2, positionAttribute: connection.geometry.getAttribute('position') };
    gsap.to(particle1Material, { emissiveIntensity: 0.8, duration: 1.5, repeat: -1, yoyo: true });
    gsap.to(particle2Material, { emissiveIntensity: 0.8, duration: 1.5, repeat: -1, yoyo: true, delay: 0.75 });
}
function updateEntanglement(delta, config) {
    const particles = sceneObjects.filter(obj => obj.type === 'Mesh' && obj.geometry.type === 'SphereGeometry' && obj.userData && obj.userData.entangledWith);
    const connection = sceneObjects.find(obj => obj.type === 'Line');
    particles.forEach(particle => {
        particle.userData.angle += delta * config.orbitSpeed * particle.userData.orbitDirection;
        const radius = particle.userData.radius; particle.position.x = Math.cos(particle.userData.angle) * radius; particle.position.z = Math.sin(particle.userData.angle) * radius;
        const otherParticle = particle.userData.entangledWith; particle.position.y = Math.sin(otherParticle.userData.angle) * 0.5;
    });
    if (connection && connection.userData.particleA && connection.userData.particleB) {
        const posAttr = connection.userData.positionAttribute;
        posAttr.setXYZ(0, connection.userData.particleA.position.x, connection.userData.particleA.position.y, connection.userData.particleA.position.z);
        posAttr.setXYZ(1, connection.userData.particleB.position.x, connection.userData.particleB.position.y, connection.userData.particleB.position.z);
        posAttr.needsUpdate = true;
    }
}

// Verse 19: Observer Effect
function createObserverEffectScene(config) {
    const beamGeometry = new THREE.CylinderGeometry(0.2, 1, 10, 32, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.observer), transparent: true, opacity: 0.5, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial); beam.position.set(-5, 0, 0); beam.rotation.z = Math.PI / 2; scene.add(beam); sceneObjects.push(beam);
    const observerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const observerMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.observer), emissive: new THREE.Color(config.colors.observer), emissiveIntensity: 0.6 });
    const observer = new THREE.Mesh(observerGeometry, observerMaterial); observer.position.set(-10, 0, 0); scene.add(observer); sceneObjects.push(observer);
    const particleCount = config.particleCount; const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); const colors = new Float32Array(particleCount * 3); const sizes = new Float32Array(particleCount);
    const originalStates = new Float32Array(particleCount * 3); const observedStates = new Float32Array(particleCount * 3);
    const particleColor = new THREE.Color(config.colors.particle); const effectColor = new THREE.Color(config.colors.effect);
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); const radius = 2 + Math.random() * 2;
        const x = radius * Math.sin(phi) * Math.cos(theta); const y = radius * Math.sin(phi) * Math.sin(theta); const z = radius * Math.cos(phi);
        positions[i * 3] = 5 + x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
        originalStates[i * 3] = positions[i * 3]; originalStates[i * 3 + 1] = positions[i * 3 + 1]; originalStates[i * 3 + 2] = positions[i * 3 + 2];
        const angle = (i / particleCount) * Math.PI * 2; const observedRadius = 3;
        observedStates[i * 3] = 5 + observedRadius * Math.cos(angle); observedStates[i * 3 + 1] = observedRadius * Math.sin(angle); observedStates[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        colors[i * 3] = particleColor.r; colors[i * 3 + 1] = particleColor.g; colors[i * 3 + 2] = particleColor.b;
        sizes[i] = Math.random() * 0.1 + 0.05;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.userData = { originalStates: originalStates, observedStates: observedStates, observationLevel: 0 };
    const particleMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(particleGeometry, particleMaterial); scene.add(particles); sceneObjects.push(particles);
    beam.userData = { targetParticles: particles, observerSource: observer, isActive: false, strength: 0 };
    beam.userData.onClick = () => {
        beam.userData.isActive = !beam.userData.isActive;
        if (beam.userData.isActive) { gsap.to(beam.userData, { strength: 1, duration: 2, ease: "power2.inOut" }); gsap.to(beamMaterial, { opacity: 0.8, duration: 1 }); }
        else { gsap.to(beam.userData, { strength: 0, duration: 2, ease: "power2.inOut" }); gsap.to(beamMaterial, { opacity: 0.3, duration: 1 }); }
    }; interactiveObjects.push(beam);
    // Add helper text (simplified)
    // createText("Click the beam to observe", new THREE.Vector3(-5, 3, 0), 0xffffff);
    gsap.to(observerMaterial, { emissiveIntensity: 1, duration: 1.5, repeat: -1, yoyo: true });
}
function updateObserverEffect(delta, config) {
    const beam = sceneObjects.find(obj => obj.userData?.targetParticles); if (!beam) return;
    const particles = beam.userData.targetParticles; const positions = particles.geometry.getAttribute('position'); const colors = particles.geometry.getAttribute('color');
    const originalStates = particles.geometry.userData.originalStates; const observedStates = particles.geometry.userData.observedStates;
    const observationLevel = beam.userData.strength || 0; particles.geometry.userData.observationLevel = observationLevel;
    for (let i = 0; i < positions.count; i++) {
        const idx = i * 3;
        positions.setX(i, originalStates[idx] * (1 - observationLevel) + observedStates[idx] * observationLevel);
        positions.setY(i, originalStates[idx + 1] * (1 - observationLevel) + observedStates[idx + 1] * observationLevel);
        positions.setZ(i, originalStates[idx + 2] * (1 - observationLevel) + observedStates[idx + 2] * observationLevel);
        const particleColor = new THREE.Color(config.colors.particle); const effectColor = new THREE.Color(config.colors.effect);
        const blendedColor = particleColor.clone().lerp(effectColor, observationLevel);
        colors.setXYZ(i, blendedColor.r, blendedColor.g, blendedColor.b);
    }
    positions.needsUpdate = true; colors.needsUpdate = true; beam.rotation.z += delta * 0.1;
}

// Verse 20: Inseparable Pair
function createInseparablePairScene(config) {
    const particle1Geometry = new THREE.SphereGeometry(0.5, 32, 32); const particle2Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle1Material = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.particle1), emissive: new THREE.Color(config.colors.particle1), emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const particle2Material = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.particle2), emissive: new THREE.Color(config.colors.particle2), emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material); const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    particle1.position.set(2, 1, 0); particle2.position.set(-2, -1, 0); scene.add(particle1); scene.add(particle2); sceneObjects.push(particle1, particle2);
    const tetherGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(particle1.position, particle2.position), 20, 0.1, 8, false);
    const tetherMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.tether), emissive: new THREE.Color(config.colors.tether), emissiveIntensity: 0.5, transparent: true, opacity: 0.7 });
    const tether = new THREE.Mesh(tetherGeometry, tetherMaterial); scene.add(tether); sceneObjects.push(tether);
    particle1.userData = { tetheredTo: particle2, basePosition: new THREE.Vector3(2, 1, 0), moveRadius: 3, angle: 0, speed: 0.5 };
    particle2.userData = { tetheredTo: particle1, basePosition: new THREE.Vector3(-2, -1, 0), moveRadius: 2, angle: Math.PI, speed: 0.7 };
    tether.userData = { particle1: particle1, particle2: particle2, needsUpdate: true };
    const flowGeometry = new THREE.BufferGeometry(); const flowCount = 50; const flowPositions = new Float32Array(flowCount * 3); const flowSizes = new Float32Array(flowCount); const flowProgress = new Float32Array(flowCount);
    for (let i = 0; i < flowCount; i++) {
        flowPositions[i * 3] = particle1.position.x; flowPositions[i * 3 + 1] = particle1.position.y; flowPositions[i * 3 + 2] = particle1.position.z;
        flowSizes[i] = Math.random() * 0.08 + 0.02; flowProgress[i] = Math.random();
    }
    flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3)); flowGeometry.setAttribute('size', new THREE.BufferAttribute(flowSizes, 1));
    const flowMaterial = new THREE.PointsMaterial({ color: new THREE.Color(config.colors.tether), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, size: 0.1 });
    const flow = new THREE.Points(flowGeometry, flowMaterial); scene.add(flow); sceneObjects.push(flow);
    flow.userData = { particle1: particle1, particle2: particle2, flowProgress: flowProgress };
    gsap.to(particle1Material, { emissiveIntensity: 0.8, duration: 1.5, repeat: -1, yoyo: true });
    gsap.to(particle2Material, { emissiveIntensity: 0.8, duration: 1.5, repeat: -1, yoyo: true, delay: 0.75 });
    gsap.to(tetherMaterial, { emissiveIntensity: 0.7, duration: 2, repeat: -1, yoyo: true });
}
function updateInseparablePair(delta, config) {
    const particles = sceneObjects.filter(obj => obj.userData?.tetheredTo);
    particles.forEach(particle => {
        particle.userData.angle += delta * particle.userData.speed;
        const basePos = particle.userData.basePosition; const radius = particle.userData.moveRadius;
        particle.position.x = basePos.x + Math.cos(particle.userData.angle) * radius * 0.5;
        particle.position.y = basePos.y + Math.sin(particle.userData.angle) * radius * 0.3;
        particle.position.z = basePos.z + Math.sin(particle.userData.angle * 1.5) * radius * 0.2;
        const other = particle.userData.tetheredTo; const toOther = new THREE.Vector3().subVectors(other.position, particle.position); const distance = toOther.length();
        if (distance > 8) { toOther.normalize().multiplyScalar(distance - 8); particle.position.add(toOther.multiplyScalar(0.1)); }
    });
    const tether = sceneObjects.find(obj => obj.userData?.particle1 && obj.userData.particle2);
    if (tether && tether.userData.needsUpdate) {
        const p1 = tether.userData.particle1.position; const p2 = tether.userData.particle2.position;
        const curve = new THREE.LineCurve3(p1, p2); const geometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
        tether.geometry.dispose(); tether.geometry = geometry;
    }
    const flow = sceneObjects.find(obj => obj.userData?.flowProgress);
    if (flow) {
        const positions = flow.geometry.getAttribute('position'); const flowProgress = flow.userData.flowProgress;
        const p1 = flow.userData.particle1.position; const p2 = flow.userData.particle2.position;
        for (let i = 0; i < positions.count; i++) {
            flowProgress[i] += delta * 0.5; if (flowProgress[i] > 1) flowProgress[i] -= 1;
            const pos = p1.clone().lerp(p2, flowProgress[i]);
            pos.x += (Math.random() - 0.5) * 0.1; pos.y += (Math.random() - 0.5) * 0.1; pos.z += (Math.random() - 0.5) * 0.1;
            positions.setXYZ(i, pos.x, pos.y, pos.z);
        }
        positions.needsUpdate = true;
    }
}

// Verse 21: Superposition Blend
function createSuperpositionBlendScene(config) {
    const state1Geometry = new THREE.TorusKnotGeometry(2, 0.5, 128, 32, 2, 3); const state2Geometry = new THREE.TorusKnotGeometry(2, 0.5, 128, 32, 3, 2);
    const blendMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.blend), emissive: new THREE.Color(config.colors.blend), emissiveIntensity: 0.5, wireframe: true, transparent: true, opacity: 0.9 });
    const morphingObject = new THREE.Mesh(state1Geometry, blendMaterial); scene.add(morphingObject); sceneObjects.push(morphingObject);
    morphingObject.userData = { state1: state1Geometry, state2: state2Geometry, morphFactor: 0, morphDirection: 1, morphSpeed: config.blendRate };
    const particleCount = 500; const particleGeometry = new THREE.BufferGeometry(); const particlePositions = new Float32Array(particleCount * 3); const particleSizes = new Float32Array(particleCount); const particleColors = new Float32Array(particleCount * 3);
    const color1 = new THREE.Color(config.colors.state1); const color2 = new THREE.Color(config.colors.state2);
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); const radius = 2.5 + Math.random();
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        particleSizes[i] = Math.random() * 0.08 + 0.02;
        const colorMix = Math.random(); const particleColor = color1.clone().lerp(color2, colorMix);
        particleColors[i * 3] = particleColor.r; particleColors[i * 3 + 1] = particleColor.g; particleColors[i * 3 + 2] = particleColor.b;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)); particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1)); particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const particleMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(particleGeometry, particleMaterial); scene.add(particles); sceneObjects.push(particles);
    particles.userData = { basePositions: particlePositions.slice(), orbitSpeed: 0.1, orbitAmplitude: 0.1, time: 0 };
    gsap.to(blendMaterial, { emissiveIntensity: 0.8, duration: 2, repeat: -1, yoyo: true });
}
function updateSuperpositionBlend(delta, config) {
    const morphingObject = sceneObjects.find(obj => obj.userData?.state1);
    if (morphingObject) {
        morphingObject.userData.morphFactor += delta * morphingObject.userData.morphSpeed * morphingObject.userData.morphDirection;
        if (morphingObject.userData.morphFactor >= 1) { morphingObject.userData.morphFactor = 1; morphingObject.userData.morphDirection = -1; }
        else if (morphingObject.userData.morphFactor <= 0) { morphingObject.userData.morphFactor = 0; morphingObject.userData.morphDirection = 1; }
        const morphFactor = morphingObject.userData.morphFactor;
        morphingObject.rotation.x += delta * 0.2 * (1 + morphFactor); morphingObject.rotation.y += delta * 0.3 * (1 - morphFactor);
        const startColor = new THREE.Color(config.colors.state1); const endColor = new THREE.Color(config.colors.state2); const blendColor = new THREE.Color(config.colors.blend);
        let currentColor;
        if (morphFactor < 0.5) currentColor = startColor.clone().lerp(blendColor, morphFactor * 2);
        else currentColor = blendColor.clone().lerp(endColor, (morphFactor - 0.5) * 2);
        morphingObject.material.color.copy(currentColor); morphingObject.material.emissive.copy(currentColor);
    }
    const particles = sceneObjects.find(obj => obj.userData?.basePositions);
    if (particles) {
        const positions = particles.geometry.getAttribute('position'); const basePositions = particles.userData.basePositions;
        particles.userData.time += delta; const time = particles.userData.time;
        for (let i = 0; i < positions.count; i++) {
            const idx = i * 3; const x = basePositions[idx]; const y = basePositions[idx + 1]; const z = basePositions[idx + 2];
            positions.setX(i, x + Math.sin(time + i * 0.1) * particles.userData.orbitAmplitude);
            positions.setY(i, y + Math.cos(time + i * 0.1) * particles.userData.orbitAmplitude);
            positions.setZ(i, z + Math.sin(time * 1.5 + i * 0.05) * particles.userData.orbitAmplitude);
        }
        positions.needsUpdate = true;
    }
}

// Verse 22: Observational Emergence
function createObservationalEmergenceScene(config) {
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.particle), emissive: new THREE.Color(config.colors.particle), emissiveIntensity: 0.5, transparent: true, opacity: config.particleOpacity });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial); scene.add(particle); sceneObjects.push(particle);
    const orbitGeometry = new THREE.TorusGeometry(4, 0.05, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.path), transparent: true, opacity: 0.1 });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial); orbit.rotation.x = Math.PI / 2; scene.add(orbit); sceneObjects.push(orbit);
    const beamGeometry = new THREE.CylinderGeometry(0.5, 0.1, 10, 32, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.beam), transparent: true, opacity: 0.5, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial); beam.position.set(0, 0, -5); beam.rotation.x = Math.PI / 2; scene.add(beam); sceneObjects.push(beam);
    const observerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const observerMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.beam), emissive: new THREE.Color(config.colors.beam), emissiveIntensity: 0.5 });
    const observer = new THREE.Mesh(observerGeometry, observerMaterial); observer.position.set(0, 0, -10); scene.add(observer); sceneObjects.push(observer);
    particle.userData = { orbitAngle: 0, orbitRadius: 4, orbitSpeed: 0.5, isObserved: false, observedSegments: [] };
    beam.userData = { targetParticle: particle, targetOrbit: orbit, isActive: false, activationStrength: 0, observerSource: observer };
    beam.userData.onClick = () => {
        beam.userData.isActive = !beam.userData.isActive;
        if (beam.userData.isActive) { gsap.to(beam.userData, { activationStrength: 1, duration: 1, ease: "power2.inOut" }); gsap.to(beamMaterial, { opacity: 0.8, duration: 1 }); gsap.to(orbitMaterial, { opacity: 0.5, duration: 1 }); gsap.to(particleMaterial, { opacity: 1, duration: 1 }); }
        else { gsap.to(beam.userData, { activationStrength: 0, duration: 1, ease: "power2.inOut" }); gsap.to(beamMaterial, { opacity: 0.3, duration: 1 }); gsap.to(orbitMaterial, { opacity: 0.1, duration: 1 }); gsap.to(particleMaterial, { opacity: config.particleOpacity, duration: 1 }); }
    }; interactiveObjects.push(beam);
    // Add helper text (simplified)
    // createText("Click the light to observe", new THREE.Vector3(0, 3, -5), 0xffffff);
    const trailGeometry = new THREE.BufferGeometry(); const maxTrailPoints = 100; const trailPositions = new Float32Array(maxTrailPoints * 3); const trailColors = new Float32Array(maxTrailPoints * 3); const trailSizes = new Float32Array(maxTrailPoints);
    for (let i = 0; i < maxTrailPoints; i++) { trailPositions[i * 3] = 0; trailPositions[i * 3 + 1] = 0; trailPositions[i * 3 + 2] = 0; trailColors[i * 3] = 1; trailColors[i * 3 + 1] = 1; trailColors[i * 3 + 2] = 1; trailSizes[i] = 0; }
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3)); trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3)); trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));
    const trailMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const trail = new THREE.Points(trailGeometry, trailMaterial); scene.add(trail); sceneObjects.push(trail);
    trail.userData = { targetParticle: particle, activePoints: 0, maxPoints: maxTrailPoints };
    gsap.to(observerMaterial, { emissiveIntensity: 0.8, duration: 1.5, repeat: -1, yoyo: true });
}
function updateObservationalEmergence(delta, config) {
    const particle = sceneObjects.find(obj => obj.userData?.orbitAngle !== undefined);
    if (particle) {
        particle.userData.orbitAngle += delta * particle.userData.orbitSpeed;
        const radius = particle.userData.orbitRadius; particle.position.x = Math.cos(particle.userData.orbitAngle) * radius; particle.position.z = Math.sin(particle.userData.orbitAngle) * radius;
        const beam = sceneObjects.find(obj => obj.userData?.targetParticle === particle);
        if (beam) { particle.userData.isObserved = beam.userData.isActive; }
    }
    const trail = sceneObjects.find(obj => obj.userData?.targetParticle);
    if (trail && particle && particle.userData.isObserved) {
        const positions = trail.geometry.getAttribute('position'); const colors = trail.geometry.getAttribute('color'); const sizes = trail.geometry.getAttribute('size');
        for (let i = trail.userData.maxPoints - 1; i > 0; i--) {
            positions.setXYZ(i, positions.getX(i - 1), positions.getY(i - 1), positions.getZ(i - 1));
            colors.setXYZ(i, colors.getX(i - 1), colors.getY(i - 1), colors.getZ(i - 1));
            sizes.setX(i, sizes.getX(i - 1));
        }
        positions.setXYZ(0, particle.position.x, particle.position.y, particle.position.z);
        const particleColor = new THREE.Color(config.colors.particle); colors.setXYZ(0, particleColor.r, particleColor.g, particleColor.b);
        sizes.setX(0, 0.2);
        if (trail.userData.activePoints < trail.userData.maxPoints) { trail.userData.activePoints++; }
        for (let i = 0; i < trail.userData.activePoints; i++) { const fadeFactor = 1 - (i / trail.userData.activePoints); sizes.setX(i, 0.2 * fadeFactor); }
        positions.needsUpdate = true; colors.needsUpdate = true; sizes.needsUpdate = true;
    }
    const beam = sceneObjects.find(obj => obj.userData?.targetParticle && obj.userData.observerSource);
    if (beam && particle) {
        const observer = beam.userData.observerSource; const dirToParticle = new THREE.Vector3().subVectors(particle.position, observer.position).normalize();
        beam.position.copy(observer.position).add(dirToParticle.clone().multiplyScalar(5)); beam.lookAt(particle.position);
        const distance = observer.position.distanceTo(particle.position); beam.scale.y = distance / 10;
    }
}

// Verse 23: Quantum Identity
function createQuantumIdentityScene(config) {
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.particle1), emissive: new THREE.Color(config.colors.particle1), emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const particle1 = new THREE.Mesh(particleGeometry, particleMaterial.clone()); const particle2 = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    particle1.position.set(3, 0, 0); particle2.position.set(-3, 0, 0); scene.add(particle1); scene.add(particle2); sceneObjects.push(particle1, particle2);
    const pathCurve = new THREE.CubicBezierCurve3( new THREE.Vector3(3, 0, 0), new THREE.Vector3(1, 2, 2), new THREE.Vector3(-1, -2, 2), new THREE.Vector3(-3, 0, 0) );
    const pathGeometry = new THREE.TubeGeometry(pathCurve, 100, 0.1, 8, false);
    const pathMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.path), transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const path = new THREE.Mesh(pathGeometry, pathMaterial); scene.add(path); sceneObjects.push(path);
    particle1.userData = { pathProgress: 0, swapDirection: 1, swapRate: config.swapRate, swapPath: pathCurve, otherParticle: particle2 };
    particle2.userData = { pathProgress: 1, swapDirection: -1, swapRate: config.swapRate, swapPath: pathCurve, otherParticle: particle1 };
    const trailCount = 20;
    const createTrail = (particle) => {
        const trailGroup = new THREE.Group();
        for (let i = 0; i < trailCount; i++) {
            const trailElement = new THREE.Mesh( new THREE.SphereGeometry(0.4 * (1 - i/trailCount), 16, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.particle1), transparent: true, opacity: 0.3 * (1 - i/trailCount), blending: THREE.AdditiveBlending }) );
            trailGroup.add(trailElement);
        }
        trailGroup.userData = { targetParticle: particle, positions: Array(trailCount).fill().map(() => new THREE.Vector3()) };
        scene.add(trailGroup); sceneObjects.push(trailGroup); return trailGroup;
    };
    const trail1 = createTrail(particle1); const trail2 = createTrail(particle2);
    const indistinguishabilityGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const indistinguishabilityMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.particle1), transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const swapCloud = new THREE.Group(); const swapParticleCount = 30;
    for (let i = 0; i < swapParticleCount; i++) {
        const cloudParticle = new THREE.Mesh(indistinguishabilityGeometry, indistinguishabilityMaterial); const angle = Math.random() * Math.PI * 2; const radius = Math.random() * 1.5;
        cloudParticle.position.set( Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 2 );
        swapCloud.add(cloudParticle);
    }
    swapCloud.position.set(0, 0, 0); swapCloud.visible = false; scene.add(swapCloud); sceneObjects.push(swapCloud);
    swapCloud.userData = { particle1: particle1, particle2: particle2, indistinguishabilityFactor: config.indistinguishability };
    gsap.to(particleMaterial, { emissiveIntensity: 0.8, duration: 1.5, repeat: -1, yoyo: true });
}
function updateQuantumIdentity(delta, config) {
    const particles = sceneObjects.filter(obj => obj.userData?.swapPath);
    const swapCloud = sceneObjects.find(obj => obj.userData?.indistinguishabilityFactor);
    particles.forEach(particle => {
        particle.userData.pathProgress += delta * particle.userData.swapDirection * particle.userData.swapRate;
        if (particle.userData.pathProgress > 1) { particle.userData.pathProgress = 1; particle.userData.swapDirection *= -1; }
        else if (particle.userData.pathProgress < 0) { particle.userData.pathProgress = 0; particle.userData.swapDirection *= -1; }
        const path = particle.userData.swapPath; const point = path.getPoint(particle.userData.pathProgress); particle.position.copy(point);
        if (swapCloud) {
            const particle1 = swapCloud.userData.particle1; const particle2 = swapCloud.userData.particle2;
            const midProximity = Math.abs(particle1.userData.pathProgress - 0.5) + Math.abs(particle2.userData.pathProgress - 0.5);
            if (midProximity < 0.3) { const visibility = 1 - (midProximity / 0.3); swapCloud.visible = true; swapCloud.scale.set(visibility, visibility, visibility); particle.material.opacity = 0.9 - visibility * 0.5; }
            else { swapCloud.visible = false; particle.material.opacity = 0.9; }
        }
    });
    const trails = sceneObjects.filter(obj => obj.userData?.targetParticle && obj.userData.positions);
    trails.forEach(trail => {
        const particle = trail.userData.targetParticle; const positions = trail.userData.positions;
        for (let i = positions.length - 1; i > 0; i--) { positions[i].copy(positions[i - 1]); }
        positions[0].copy(particle.position);
        for (let i = 0; i < trail.children.length; i++) {
            const element = trail.children[i]; element.position.copy(positions[i]);
            const fadeRatio = 1 - (i / trail.children.length); element.material.opacity = 0.3 * fadeRatio; element.scale.set(fadeRatio, fadeRatio, fadeRatio);
        }
    });
}

// Verse 24: Existential Superposition
function createExistentialSuperpositionScene(config) {
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.existence), emissive: new THREE.Color(config.colors.existence), emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial); scene.add(particle); sceneObjects.push(particle);
    const voidGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const voidMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.nonExistence), transparent: true, opacity: 0.3, side: THREE.BackSide });
    const voidSphere = new THREE.Mesh(voidGeometry, voidMaterial); scene.add(voidSphere); sceneObjects.push(voidSphere);
    const fieldGeometry = new THREE.SphereGeometry(2, 32, 32);
    const fieldMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.transition), transparent: true, opacity: 0.2, wireframe: true });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial); scene.add(field); sceneObjects.push(field);
    particle.userData = { existenceState: 1.0, fadeRate: config.fadeRate, fadeDirection: -1, voidSphere: voidSphere, energyField: field, cycleCount: 0, maxCycles: config.stateCycles || Infinity };
    const waveCount = 500; const waveGeometry = new THREE.BufferGeometry(); const wavePositions = new Float32Array(waveCount * 3); const waveSizes = new Float32Array(waveCount); const wavePhases = new Float32Array(waveCount);
    for (let i = 0; i < waveCount; i++) {
        const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); const radius = 2 + Math.random() * 0.3;
        wavePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); wavePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); wavePositions[i * 3 + 2] = radius * Math.cos(phi);
        waveSizes[i] = Math.random() * 0.05 + 0.02; wavePhases[i] = Math.random() * Math.PI * 2;
    }
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3)); waveGeometry.setAttribute('size', new THREE.BufferAttribute(waveSizes, 1));
    const waveMaterial = new THREE.PointsMaterial({ color: new THREE.Color(config.colors.transition), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, size: 0.1 });
    const waveParticles = new THREE.Points(waveGeometry, waveMaterial); scene.add(waveParticles); sceneObjects.push(waveParticles);
    waveParticles.userData = { phases: wavePhases, centerParticle: particle, originalPositions: wavePositions.slice(), pulseStrength: config.pulseStrength };
    gsap.to(field.rotation, { x: Math.PI * 2, y: Math.PI, duration: 20, repeat: -1, ease: "none" });
    gsap.to(voidMaterial, { opacity: 0.5, duration: 3, repeat: -1, yoyo: true });
}
function updateExistentialSuperposition(delta, config) {
    const particle = sceneObjects.find(obj => obj.userData?.existenceState !== undefined);
    if (particle) {
        particle.userData.existenceState += delta * particle.userData.fadeRate * particle.userData.fadeDirection;
        if (particle.userData.existenceState >= 1) { particle.userData.existenceState = 1; particle.userData.fadeDirection = -1; particle.userData.cycleCount++; if (particle.userData.cycleCount >= particle.userData.maxCycles) { particle.userData.fadeDirection = 0; particle.userData.existenceState = 0.5; } }
        else if (particle.userData.existenceState <= 0) { particle.userData.existenceState = 0; particle.userData.fadeDirection = 1; }
        const existenceState = particle.userData.existenceState; particle.material.opacity = existenceState * 0.8 + 0.1;
        const scale = 0.5 + existenceState; particle.scale.set(scale, scale, scale);
        if (particle.userData.voidSphere) { const voidSphere = particle.userData.voidSphere; voidSphere.material.opacity = 0.3 - (existenceState * 0.2); const pulseFactor = 1 + (1 - existenceState) * Math.sin(clock.elapsedTime * 2) * 0.1; voidSphere.scale.set(pulseFactor, pulseFactor, pulseFactor); }
        if (particle.userData.energyField) { const field = particle.userData.energyField; const transitionFactor = 4 * (existenceState * (1 - existenceState)); field.rotation.y += delta * (0.3 + transitionFactor); field.rotation.z += delta * (0.2 + transitionFactor); const fieldScale = 1.8 + transitionFactor * 0.4; field.scale.set(fieldScale, fieldScale, fieldScale); field.material.opacity = 0.1 + transitionFactor * 0.3; }
    }
    const waveParticles = sceneObjects.find(obj => obj.userData?.phases);
    if (waveParticles && particle) {
        const positions = waveParticles.geometry.getAttribute('position'); const phases = waveParticles.userData.phases; const originalPositions = waveParticles.userData.originalPositions; const sizes = waveParticles.geometry.getAttribute('size');
        const pulseStrength = waveParticles.userData.pulseStrength; const existenceState = particle.userData.existenceState; const transitionFactor = 4 * (existenceState * (1 - existenceState));
        for (let i = 0; i < positions.count; i++) {
            const idx = i * 3; const x = originalPositions[idx]; const y = originalPositions[idx + 1]; const z = originalPositions[idx + 2];
            phases[i] += delta * (1 + transitionFactor); const displacement = Math.sin(phases[i]) * pulseStrength * transitionFactor;
            const dir = new THREE.Vector3(x, y, z).normalize();
            positions.setX(i, x + dir.x * displacement); positions.setY(i, y + dir.y * displacement); positions.setZ(i, z + dir.z * displacement);
            sizes.setX(i, 0.02 + transitionFactor * 0.08);
        }
        positions.needsUpdate = true; sizes.needsUpdate = true; waveParticles.material.opacity = 0.3 + transitionFactor * 0.6;
    }
}

// Verse 25: Relational Mirage
function createRelationalMirageScene(config) {
    const pathPoints = []; for (let i = 0; i <= 10; i++) { const t = i / 10; const angle = t * Math.PI * 4; const radius = 4 - t * 2; pathPoints.push(new THREE.Vector3( Math.cos(angle) * radius, (t - 0.5) * 4, Math.sin(angle) * radius )); }
    const curve = new THREE.CatmullRomCurve3(pathPoints);
    const mirageGeometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
    const mirageMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.mirage), transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const miragePath = new THREE.Mesh(mirageGeometry, mirageMaterial); scene.add(miragePath); sceneObjects.push(miragePath);
    const solidGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
    const solidMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.solid), emissive: new THREE.Color(config.colors.solid), emissiveIntensity: 0.5, transparent: true, opacity: 0 });
    const solidPath = new THREE.Mesh(solidGeometry, solidMaterial); scene.add(solidPath); sceneObjects.push(solidPath);
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.mirage), emissive: new THREE.Color(config.colors.mirage), emissiveIntensity: 0.5, transparent: true, opacity: 0.7 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial); scene.add(particle); sceneObjects.push(particle);
    const startPoint = curve.getPoint(0); particle.position.copy(startPoint);
    const measureGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const measureMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(config.colors.measurement), emissive: new THREE.Color(config.colors.measurement), emissiveIntensity: 0.3, transparent: true });
    const measureDevice = new THREE.Mesh(measureGeometry, measureMaterial); measureDevice.position.set(0, 0, -6); measureDevice.rotation.x = Math.PI / 2; scene.add(measureDevice); sceneObjects.push(measureDevice);
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 16, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(config.colors.measurement), transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial); beam.position.set(0, 0, -1); beam.rotation.x = Math.PI / 2; scene.add(beam); sceneObjects.push(beam);
    particle.userData = { pathCurve: curve, pathProgress: 0, speed: 0.2, miragePath: miragePath, solidPath: solidPath, isMeasured: false };
    measureDevice.userData = { targetParticle: particle, measurementBeam: beam, measureStrength: 0, isActive: false, effectRadius: 2 };
    measureDevice.userData.onClick = () => {
        measureDevice.userData.isActive = !measureDevice.userData.isActive;
        if (measureDevice.userData.isActive) { gsap.to(measureDevice.userData, { measureStrength: 1, duration: 1, ease: "power2.inOut" }); gsap.to(beamMaterial, { opacity: 0.8, duration: 1 }); gsap.to(solidMaterial, { opacity: config.pathSolidity, duration: 1 }); gsap.to(particleMaterial.color, { r: new THREE.Color(config.colors.solid).r, g: new THREE.Color(config.colors.solid).g, b: new THREE.Color(config.colors.solid).b, duration: 1 }); gsap.to(particleMaterial.emissive, { r: new THREE.Color(config.colors.solid).r, g: new THREE.Color(config.colors.solid).g, b: new THREE.Color(config.colors.solid).b, duration: 1 }); }
        else { gsap.to(measureDevice.userData, { measureStrength: 0, duration: 1, ease: "power2.inOut" }); gsap.to(beamMaterial, { opacity: 0.3, duration: 1 }); gsap.to(solidMaterial, { opacity: 0, duration: 1 }); gsap.to(particleMaterial.color, { r: new THREE.Color(config.colors.mirage).r, g: new THREE.Color(config.colors.mirage).g, b: new THREE.Color(config.colors.mirage).b, duration: 1 }); gsap.to(particleMaterial.emissive, { r: new THREE.Color(config.colors.mirage).r, g: new THREE.Color(config.colors.mirage).g, b: new THREE.Color(config.colors.mirage).b, duration: 1 }); }
    }; interactiveObjects.push(measureDevice);
    // Add helper text (simplified)
    // createText("Click the cone to measure", new THREE.Vector3(0, 2, -6), 0xffffff);
    gsap.to(measureMaterial, { emissiveIntensity: 0.6, duration: 1.5, repeat: -1, yoyo: true });
}
function updateRelationalMirage(delta, config) {
    const particle = sceneObjects.find(obj => obj.userData?.pathCurve);
    if (particle) {
        particle.userData.pathProgress += delta * particle.userData.speed; if (particle.userData.pathProgress > 1) particle.userData.pathProgress = 0;
        const path = particle.userData.pathCurve; const point = path.getPoint(particle.userData.pathProgress); particle.position.copy(point);
        const measureDevice = sceneObjects.find(obj => obj.userData?.targetParticle === particle);
        if (measureDevice && measureDevice.userData.isActive) {
            const distToParticle = measureDevice.position.distanceTo(particle.position); const effectRadius = measureDevice.userData.effectRadius || 2;
            if (distToParticle < effectRadius) { particle.userData.isMeasured = true; const visibilityFactor = 1 - (distToParticle / effectRadius); if (particle.userData.solidPath) { particle.userData.solidPath.material.opacity = config.pathSolidity * visibilityFactor; } }
            else { particle.userData.isMeasured = false; if (particle.userData.solidPath) { gsap.to(particle.userData.solidPath.material, { opacity: 0, duration: 0.5 }); } }
        } else { particle.userData.isMeasured = false; if (particle.userData.solidPath) { gsap.to(particle.userData.solidPath.material, { opacity: 0, duration: 0.5 }); } }
    }
    const measureDevice = sceneObjects.find(obj => obj.userData?.targetParticle);
    if (measureDevice && particle && measureDevice.userData.isActive) {
        const beam = sceneObjects.find(obj => obj.geometry?.type === 'CylinderGeometry' && obj.material.color.equals(new THREE.Color(config.colors.measurement)));
        if (beam) { beam.lookAt(particle.position); const distance = measureDevice.position.distanceTo(particle.position); beam.scale.y = distance / 10; }
        measureDevice.rotation.z += delta * 0.5;
    }
    const miragePath = sceneObjects.find(obj => obj.material?.color.equals(new THREE.Color(config.colors.mirage)));
    if (miragePath) { const fadeRate = Math.sin(clock.elapsedTime * 0.5) * 0.1 + 0.3; miragePath.material.opacity = fadeRate; }
}


// --- Start Application ---
initializeApp();
