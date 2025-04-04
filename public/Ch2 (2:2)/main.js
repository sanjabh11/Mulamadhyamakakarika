import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { verses } from './config.js';

// DOM elements
const sceneContainer = document.getElementById('scene-container');
const sidePanel = document.getElementById('side-panel');
const panelToggle = document.getElementById('panel-toggle');
const verseNavigation = document.getElementById('verse-navigation');
const verseExplanationSection = document.getElementById('verse-explanation-section');
const animationControlsSection = document.getElementById('animation-controls-section');
const zoomSlider = document.getElementById('zoom-slider');
const speedSlider = document.getElementById('speed-slider');
const resetCameraBtn = document.getElementById('reset-camera');

// Global variables
let currentVerseIndex = 0;
let scene, camera, renderer, composer, controls;
let sceneObjects = [];
let animationFrameId;
let clock = new THREE.Clock();
let animationMixers = [];
let interactiveObjects = [];
let mousePosition = new THREE.Vector2();
let animationSpeed = 1.0;

// Initialize the scene
function initScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000020);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Add orbit controls for camera
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add post-processing
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85  // threshold
    );
    
    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle mouse movement for interactions
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    
    // Setup UI controls and event listeners
    setupUIControls();
    
    // Create verse navigation buttons
    createVerseNavigation();
    
    // Start animation loop
    animate();
}

// Setup UI controls and event listeners
function setupUIControls() {
    // Panel toggle
    panelToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('collapsed');
    });
    
    // Collapsible sections
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('expanded');
        });
    });
    
    // Zoom slider
    zoomSlider.addEventListener('input', () => {
        const zoomLevel = parseFloat(zoomSlider.value);
        camera.position.z = 15 - zoomLevel;
        camera.updateProjectionMatrix();
    });
    
    // Animation speed slider
    speedSlider.addEventListener('input', () => {
        animationSpeed = parseFloat(speedSlider.value);
    });
    
    // Reset camera button
    resetCameraBtn.addEventListener('click', () => {
        controls.reset();
        zoomSlider.value = 5;
        camera.position.set(0, 0, 10);
        camera.updateProjectionMatrix();
    });
    
    // Handle responsive behavior
    if (window.innerWidth <= 768) {
        // On mobile, start with panel sections collapsed
        verseExplanationSection.classList.remove('expanded');
        animationControlsSection.classList.remove('expanded');
    }
}

// Create verse navigation buttons
function createVerseNavigation() {
    verseNavigation.innerHTML = '';
    
    verses.forEach((verse, index) => {
        const button = document.createElement('button');
        button.className = 'verse-button';
        button.textContent = verse.number;
        
        if (index === currentVerseIndex) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            loadVerse(index);
            
            // Update active button
            document.querySelectorAll('.verse-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
        
        verseNavigation.appendChild(button);
    });
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // Update mixers
    animationMixers.forEach(mixer => mixer.update(delta * animationSpeed));
    
    // Update scene-specific animations
    updateCurrentSceneAnimation(delta * animationSpeed);
    
    // Update controls
    controls.update();
    
    // Render scene
    composer.render();
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Track mouse position for interactivity
function onMouseMove(event) {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Handle mouse clicks for interactive elements
function onMouseClick() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, camera);
    
    const intersects = raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
        intersects[0].object.userData.onClick && intersects[0].object.userData.onClick();
    }
}

// Clear the current scene for new verse
function clearScene() {
    // Remove all scene objects except lights and cameras
    sceneObjects.forEach(obj => scene.remove(obj));
    sceneObjects = [];
    animationMixers = [];
    interactiveObjects = [];
    
    // Cancel any ongoing animations
    gsap.killTweensOf('*');
}

// Update verse content in DOM
function updateVerseContent(verseIndex) {
    const verse = verses[verseIndex];
    
    document.getElementById('verse-content').textContent = verse.text;
    document.getElementById('madhyamaka-concept').textContent = verse.madhyamakaConcept;
    document.getElementById('quantum-parallel').textContent = verse.quantumParallel;
    document.getElementById('accessible-explanation').textContent = verse.accessibleExplanation;
}

// Load new verse and its animation
function loadVerse(verseIndex) {
    currentVerseIndex = verseIndex;
    
    // Clear current scene
    clearScene();
    
    // Update text content
    updateVerseContent(verseIndex);
    
    // Create new scene based on verse config
    createSceneForVerse(verses[verseIndex]);
    
    // Add a slight camera animation
    gsap.to(camera.position, {
        x: 0, 
        y: 0, 
        z: 10,
        duration: 2,
        ease: "power2.inOut"
    });
    
    // Update active verse button
    document.querySelectorAll('.verse-button').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === verseIndex);
    });
}

// Create specific scene for each verse
function createSceneForVerse(verse) {
    const config = verse.sceneConfig;
    
    switch(config.type) {
        case 'temporalSuperposition':
            createTemporalSuperpositionScene(config);
            break;
        case 'waveParticleDuality':
            createWaveParticleScene(config);
            break;
        case 'complementarity':
            createComplementarityScene(config);
            break;
        case 'continuousFlow':
            createContinuousFlowScene(config);
            break;
        case 'entanglement':
            createEntanglementScene(config);
            break;
        case 'observerEffect':
            createObserverEffectScene(config);
            break;
        case 'inseparablePair':
            createInseparablePairScene(config);
            break;
        case 'superpositionBlend':
            createSuperpositionBlendScene(config);
            break;
        case 'observationalEmergence':
            createObservationalEmergenceScene(config);
            break;
        case 'quantumIdentity':
            createQuantumIdentityScene(config);
            break;
        case 'existentialSuperposition':
            createExistentialSuperpositionScene(config);
            break;
        case 'relationalMirage':
            createRelationalMirageScene(config);
            break;
        default:
            createDefaultScene();
    }
}

// Scene-specific update function for animation
function updateCurrentSceneAnimation(delta) {
    const verse = verses[currentVerseIndex];
    const config = verse.sceneConfig;
    
    switch(config.type) {
        case 'temporalSuperposition':
            updateTemporalSuperposition(delta, config);
            break;
        case 'waveParticleDuality':
            updateWaveParticleDuality(delta, config);
            break;
        case 'complementarity':
            updateComplementarity(delta, config);
            break;
        case 'continuousFlow':
            updateContinuousFlow(delta, config);
            break;
        case 'entanglement':
            updateEntanglement(delta, config);
            break;
        case 'observerEffect':
            updateObserverEffect(delta, config);
            break;
        case 'inseparablePair':
            updateInseparablePair(delta, config);
            break;
        case 'superpositionBlend':
            updateSuperpositionBlend(delta, config);
            break;
        case 'observationalEmergence':
            updateObservationalEmergence(delta, config);
            break;
        case 'quantumIdentity':
            updateQuantumIdentity(delta, config);
            break;
        case 'existentialSuperposition':
            updateExistentialSuperposition(delta, config);
            break;
        case 'relationalMirage':
            updateRelationalMirage(delta, config);
            break;
    }
}

// Verse 14: Temporal Superposition
function createTemporalSuperpositionScene(config) {
    // Create particle system
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.particleCount * 3);
    const colors = new Float32Array(config.particleCount * 3);
    const sizes = new Float32Array(config.particleCount);
    const timeOffsets = new Float32Array(config.particleCount);
    
    const color1 = new THREE.Color(config.colors.primary);
    const color2 = new THREE.Color(config.colors.secondary);
    const color3 = new THREE.Color(config.colors.tertiary);
    
    for (let i = 0; i < config.particleCount; i++) {
        // Random starting positions
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        // Mix colors based on position
        const colorMix = Math.random();
        let particleColor;
        
        if (colorMix < 0.33) {
            particleColor = color1.clone().lerp(color2, colorMix * 3);
        } else if (colorMix < 0.66) {
            particleColor = color2.clone().lerp(color3, (colorMix - 0.33) * 3);
        } else {
            particleColor = color3.clone().lerp(color1, (colorMix - 0.66) * 3);
        }
        
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
        
        // Random sizes
        sizes[i] = Math.random() * 0.1 + 0.05;
        
        // Time offsets for animation
        timeOffsets[i] = Math.random() * Math.PI * 2;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Store time offsets in userData for animation
    particleGeometry.userData = {
        timeOffsets: timeOffsets
    };
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    sceneObjects.push(particles);
    
    // Add some orbital path visualizations
    for (let p = 0; p < config.pathComplexity; p++) {
        const pathCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3),
            new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4),
            new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4),
            new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3)
        );
        
        const pathGeometry = new THREE.TubeGeometry(pathCurve, 100, 0.02, 8, true);
        const pathMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(config.colors.tertiary),
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        scene.add(path);
        sceneObjects.push(path);
        
        // Animate path opacity
        gsap.to(pathMaterial, {
            opacity: 0.7,
            duration: 3 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

// Verse 15: Wave-Particle Duality
function createWaveParticleScene(config) {
    // Create a wave system
    const waveParticleCount = config.particleCount;
    const waveGeometry = new THREE.BufferGeometry();
    const wavePositions = new Float32Array(waveParticleCount * 3);
    const waveColors = new Float32Array(waveParticleCount * 3);
    const waveSizes = new Float32Array(waveParticleCount);
    const waveStates = new Float32Array(waveParticleCount); // 0=particle, 1=wave
    
    const waveColor = new THREE.Color(config.colors.waveState);
    const particleColor = new THREE.Color(config.colors.particleState);
    const transitionColor = new THREE.Color(config.colors.transition);
    
    // Create a circular wave pattern
    for (let i = 0; i < waveParticleCount; i++) {
        const angle = (i / waveParticleCount) * Math.PI * 2;
        const radius = 5;
        
        wavePositions[i * 3] = Math.cos(angle) * radius;
        wavePositions[i * 3 + 1] = Math.sin(angle) * radius;
        wavePositions[i * 3 + 2] = 0;
        
        // Assign colors (will be updated in animation)
        waveColors[i * 3] = waveColor.r;
        waveColors[i * 3 + 1] = waveColor.g;
        waveColors[i * 3 + 2] = waveColor.b;
        
        // Sizes will be modulated
        waveSizes[i] = 0.1;
        
        // Initial state (will be animated)
        waveStates[i] = 0;
    }
    
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));
    waveGeometry.setAttribute('size', new THREE.BufferAttribute(waveSizes, 1));
    
    waveGeometry.userData = {
        states: waveStates,
        originalPositions: wavePositions.slice(),
        time: 0
    };
    
    const waveMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    
    const waveParticles = new THREE.Points(waveGeometry, waveMaterial);
    scene.add(waveParticles);
    sceneObjects.push(waveParticles);
    
    // Add central "quantum entity"
    const entityGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const entityMaterial = new THREE.MeshPhongMaterial({
        color: transitionColor,
        emissive: transitionColor,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const entity = new THREE.Mesh(entityGeometry, entityMaterial);
    scene.add(entity);
    sceneObjects.push(entity);
    
    // Animate entity
    gsap.to(entity.scale, {
        x: 1.5, y: 0.5, z: 1.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    gsap.to(entityMaterial, {
        emissiveIntensity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true
    });
}

// Verse 16: Complementarity
function createComplementarityScene(config) {
    // Create central object that morphs between wave and particle states
    const waveGeometry = new THREE.TorusKnotGeometry(3, 0.8, 128, 32);
    const particleGeometry = new THREE.SphereGeometry(2, 32, 32);
    
    // Materials for each state
    const waveMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.wave),
        emissive: new THREE.Color(config.colors.wave),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.particle),
        emissive: new THREE.Color(config.colors.particle),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    // Create both objects
    const waveObject = new THREE.Mesh(waveGeometry, waveMaterial);
    const particleObject = new THREE.Mesh(particleGeometry, particleMaterial);
    
    // Initially hide the particle object
    particleObject.visible = false;
    
    // Add both to scene
    scene.add(waveObject);
    scene.add(particleObject);
    sceneObjects.push(waveObject, particleObject);
    
    // Create a "measurement detector" that triggers state changes
    const detectorGeometry = new THREE.BoxGeometry(1, 1, 1);
    const detectorMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xaaaaaa,
        transparent: true,
        opacity: 0.7
    });
    
    const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector.position.set(6, 0, 0);
    scene.add(detector);
    sceneObjects.push(detector);
    
    // Make detector interactive
    detector.userData = {
        isDetector: true,
        isActive: false,
        onClick: () => {
            const isParticleVisible = particleObject.visible;
            
            // Toggle between wave and particle
            waveObject.visible = isParticleVisible;
            particleObject.visible = !isParticleVisible;
            
            // Visual feedback
            gsap.to(detector.scale, {
                x: 1.5, y: 1.5, z: 1.5,
                duration: 0.3,
                repeat: 1,
                yoyo: true
            });
            
            gsap.to(detector.material, {
                emissiveIntensity: 0.8,
                duration: 0.3,
                repeat: 1,
                yoyo: true
            });
        }
    };
    interactiveObjects.push(detector);
    
    // Add helper text to show interactivity
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 128;
    const context = textCanvas.getContext('2d');
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, textCanvas.width, textCanvas.height);
    context.font = 'bold 36px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Click the cube to measure', textCanvas.width / 2, textCanvas.height / 2);
    
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textMaterial = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
    const textSprite = new THREE.Sprite(textMaterial);
    textSprite.position.set(6, 2, 0);
    textSprite.scale.set(5, 1.25, 1);
    
    scene.add(textSprite);
    sceneObjects.push(textSprite);
}

// Verse 17: Continuous Flow
function createContinuousFlowScene(config) {
    // Create a flowing particle system
    const flowGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.streamDensity * 3);
    const colors = new Float32Array(config.streamDensity * 3);
    const sizes = new Float32Array(config.streamDensity);
    const lifetimes = new Float32Array(config.streamDensity);
    
    const streamColor = new THREE.Color(config.colors.stream);
    const glowColor = new THREE.Color(config.colors.glow);
    
    // Create particles in a spiral flow pattern
    for (let i = 0; i < config.streamDensity; i++) {
        // Starting positions in a spiral
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 5;
        const height = (Math.random() - 0.5) * 20;
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
        
        // Blend colors
        const colorMix = Math.random();
        const particleColor = streamColor.clone().lerp(glowColor, colorMix);
        
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
        
        // Random sizes
        sizes[i] = Math.random() * 0.1 + 0.05;
        
        // Lifetime/flow offset for animation
        lifetimes[i] = Math.random();
    }
    
    flowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    flowGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    flowGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    flowGeometry.userData = {
        lifetimes: lifetimes,
        originalHeights: positions.slice() // Store original heights for animation
    };
    
    const flowMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const flowParticles = new THREE.Points(flowGeometry, flowMaterial);
    scene.add(flowParticles);
    sceneObjects.push(flowParticles);
    
    // Add flowing path guideline
    const flowCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -8, 0),
        new THREE.Vector3(2, -4, 2),
        new THREE.Vector3(-2, 0, -2),
        new THREE.Vector3(2, 4, 2),
        new THREE.Vector3(0, 8, 0)
    ]);
    
    const flowPathGeometry = new THREE.TubeGeometry(flowCurve, 100, 0.2, 8, false);
    const flowPathMaterial = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const flowPath = new THREE.Mesh(flowPathGeometry, flowPathMaterial);
    scene.add(flowPath);
    sceneObjects.push(flowPath);
    
    // Animate path
    gsap.to(flowPathMaterial, {
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true
    });
}

// Verse 18: Entanglement
function createEntanglementScene(config) {
    // Create two entangled particles
    const particle1Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle2Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    const particle1Material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.particle1),
        emissive: new THREE.Color(config.colors.particle1),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.particle2),
        emissive: new THREE.Color(config.colors.particle2),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    
    // Place particles in initial positions
    particle1.position.set(3, 0, 0);
    particle2.position.set(-3, 0, 0);
    
    scene.add(particle1);
    scene.add(particle2);
    sceneObjects.push(particle1, particle2);
    
    // Create a connection line between particles
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions = new Float32Array(2 * 3); // 2 points, 3 coordinates each
    
    connectionPositions[0] = particle1.position.x;
    connectionPositions[1] = particle1.position.y;
    connectionPositions[2] = particle1.position.z;
    connectionPositions[3] = particle2.position.x;
    connectionPositions[4] = particle2.position.y;
    connectionPositions[5] = particle2.position.z;
    
    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
    
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(config.colors.connection),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
    scene.add(connection);
    sceneObjects.push(connection);
    
    // Create orbit paths
    const orbit1Geometry = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const orbit2Geometry = new THREE.TorusGeometry(3, 0.05, 16, 100);
    
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.connection),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const orbit1 = new THREE.Mesh(orbit1Geometry, orbitMaterial);
    const orbit2 = new THREE.Mesh(orbit2Geometry, orbitMaterial);
    
    // Rotate orbits to different planes
    orbit1.rotation.x = Math.PI / 2;
    orbit2.rotation.x = Math.PI / 2;
    orbit2.rotation.y = Math.PI / 4;
    
    scene.add(orbit1);
    scene.add(orbit2);
    sceneObjects.push(orbit1, orbit2);
    
    // Store data for animation
    particle1.userData = {
        angle: 0,
        radius: 3,
        orbitDirection: 1,
        entangledWith: particle2
    };
    
    particle2.userData = {
        angle: Math.PI,
        radius: 3,
        orbitDirection: -1,
        entangledWith: particle1
    };
    
    connection.userData = {
        particleA: particle1,
        particleB: particle2,
        positionAttribute: connection.geometry.getAttribute('position')
    };
    
    // Add glow effects
    gsap.to(particle1Material, {
        emissiveIntensity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true
    });
    
    gsap.to(particle2Material, {
        emissiveIntensity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        delay: 0.75 // offset for interesting effect
    });
}

// Verse 19: Observer Effect
function createObserverEffectScene(config) {
    // Create observer "beam"
    const beamGeometry = new THREE.CylinderGeometry(0.2, 1, 10, 32, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.observer),
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(-5, 0, 0);
    beam.rotation.z = Math.PI / 2;
    scene.add(beam);
    sceneObjects.push(beam);
    
    // Create "observer" source
    const observerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const observerMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.observer),
        emissive: new THREE.Color(config.colors.observer),
        emissiveIntensity: 0.6
    });
    
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.position.set(-10, 0, 0);
    scene.add(observer);
    sceneObjects.push(observer);
    
    // Create particles that are affected by the beam
    const particleCount = config.particleCount;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const originalStates = new Float32Array(particleCount * 3);
    const observedStates = new Float32Array(particleCount * 3);
    
    const particleColor = new THREE.Color(config.colors.particle);
    const effectColor = new THREE.Color(config.colors.effect);
    
    // Create particles in a cloud formation
    for (let i = 0; i < particleCount; i++) {
        // Original positions - spherical cloud
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2 + Math.random() * 2;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions[i * 3] = 5 + x; // Offset to right of observer
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Store original positions
        originalStates[i * 3] = positions[i * 3];
        originalStates[i * 3 + 1] = positions[i * 3 + 1];
        originalStates[i * 3 + 2] = positions[i * 3 + 2];
        
        // Prepare observed states - more organized pattern
        const angle = (i / particleCount) * Math.PI * 2;
        const observedRadius = 3;
        
        observedStates[i * 3] = 5 + observedRadius * Math.cos(angle);
        observedStates[i * 3 + 1] = observedRadius * Math.sin(angle);
        observedStates[i * 3 + 2] = (Math.random() - 0.5) * 0.5; // almost flat
        
        // Initial colors
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
        
        // Random sizes
        sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    particleGeometry.userData = {
        originalStates: originalStates,
        observedStates: observedStates,
        observationLevel: 0 // 0 = original, 1 = fully observed
    };
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    sceneObjects.push(particles);
    
    // Store references for animation
    beam.userData = {
        targetParticles: particles,
        observerSource: observer,
        isActive: false,
        strength: 0
    };
    
    // Make beam interactive
    beam.userData.onClick = () => {
        beam.userData.isActive = !beam.userData.isActive;
        
        if (beam.userData.isActive) {
            gsap.to(beam.userData, {
                strength: 1,
                duration: 2,
                ease: "power2.inOut"
            });
            
            gsap.to(beamMaterial, {
                opacity: 0.8,
                duration: 1
            });
        } else {
            gsap.to(beam.userData, {
                strength: 0,
                duration: 2,
                ease: "power2.inOut"
            });
            
            gsap.to(beamMaterial, {
                opacity: 0.3,
                duration: 1
            });
        }
    };
    
    interactiveObjects.push(beam);
    
    // Create instruction text
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 128;
    const context = textCanvas.getContext('2d');
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, textCanvas.width, textCanvas.height);
    context.font = 'bold 36px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Click the beam to observe', textCanvas.width / 2, textCanvas.height / 2);
    
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textMaterial = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
    const textSprite = new THREE.Sprite(textMaterial);
    textSprite.position.set(-5, 3, 0);
    textSprite.scale.set(5, 1.25, 1);
    
    scene.add(textSprite);
    sceneObjects.push(textSprite);
    
    // Animate observer glow
    gsap.to(observerMaterial, {
        emissiveIntensity: 1,
        duration: 1.5,
        repeat: -1,
        yoyo: true
    });
}

// Verse 20: Inseparable Pair
function createInseparablePairScene(config) {
    // Create two tethered particles
    const particle1Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle2Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    const particle1Material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.particle1),
        emissive: new THREE.Color(config.colors.particle1),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.particle2),
        emissive: new THREE.Color(config.colors.particle2),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    
    // Position particles
    particle1.position.set(2, 1, 0);
    particle2.position.set(-2, -1, 0);
    
    scene.add(particle1);
    scene.add(particle2);
    sceneObjects.push(particle1, particle2);
    
    // Create tether between particles
    const tetherGeometry = new THREE.TubeGeometry(
        new THREE.LineCurve3(
            particle1.position,
            particle2.position
        ),
        20, // tubular segments
        0.1, // radius
        8, // radial segments
        false // closed
    );
    
    const tetherMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.tether),
        emissive: new THREE.Color(config.colors.tether),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const tether = new THREE.Mesh(tetherGeometry, tetherMaterial);
    scene.add(tether);
    sceneObjects.push(tether);
    
    // Store data for animation
    particle1.userData = {
        tetheredTo: particle2,
        basePosition: new THREE.Vector3(2, 1, 0),
        moveRadius: 3,
        angle: 0,
        speed: 0.5
    };
    
    particle2.userData = {
        tetheredTo: particle1,
        basePosition: new THREE.Vector3(-2, -1, 0),
        moveRadius: 2,
        angle: Math.PI,
        speed: 0.7
    };
    
    tether.userData = {
        particle1: particle1,
        particle2: particle2,
        needsUpdate: true
    };
    
    // Add energy flow along tether
    const flowGeometry = new THREE.BufferGeometry();
    const flowCount = 50;
    const flowPositions = new Float32Array(flowCount * 3);
    const flowSizes = new Float32Array(flowCount);
    const flowProgress = new Float32Array(flowCount);
    
    for (let i = 0; i < flowCount; i++) {
        // Initialize at particle1
        flowPositions[i * 3] = particle1.position.x;
        flowPositions[i * 3 + 1] = particle1.position.y;
        flowPositions[i * 3 + 2] = particle1.position.z;
        
        // Random sizes
        flowSizes[i] = Math.random() * 0.08 + 0.02;
        
        // Random progress along tether
        flowProgress[i] = Math.random();
    }
    
    flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
    flowGeometry.setAttribute('size', new THREE.BufferAttribute(flowSizes, 1));
    
    const flowMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(config.colors.tether),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        size: 0.1
    });
    
    const flow = new THREE.Points(flowGeometry, flowMaterial);
    scene.add(flow);
    sceneObjects.push(flow);
    
    flow.userData = {
        particle1: particle1,
        particle2: particle2,
        flowProgress: flowProgress
    };
    
    // Animate glow effects
    gsap.to(particle1Material, {
        emissiveIntensity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true
    });
    
    gsap.to(particle2Material, {
        emissiveIntensity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        delay: 0.75 // offset
    });
    
    gsap.to(tetherMaterial, {
        emissiveIntensity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true
    });
}

// Verse 21: Superposition Blend
function createSuperpositionBlendScene(config) {
    // Create a morphing object that blends between states
    const complexityFactor = config.morphComplexity;
    
    // Create geometries representing different states
    const state1Geometry = new THREE.TorusKnotGeometry(2, 0.5, 128, 32, 2, 3);
    const state2Geometry = new THREE.TorusKnotGeometry(2, 0.5, 128, 32, 3, 2);
    
    // Create materials with glowing effect
    const blendMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.blend),
        emissive: new THREE.Color(config.colors.blend),
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    
    // Create mesh with initial geometry
    const morphingObject = new THREE.Mesh(state1Geometry, blendMaterial);
    scene.add(morphingObject);
    sceneObjects.push(morphingObject);
    
    // Store state geometries for morphing
    morphingObject.userData = {
        state1: state1Geometry,
        state2: state2Geometry,
        morphFactor: 0, // 0 = state1, 1 = state2
        morphDirection: 1,
        morphSpeed: config.blendRate
    };
    
    // Create particle system that orbits and follows the morphing
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(config.colors.state1);
    const color2 = new THREE.Color(config.colors.state2);
    
    for (let i = 0; i < particleCount; i++) {
        // Place particles in a spherical shell around the object
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2.5 + Math.random();
        
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Assign sizes
        particleSizes[i] = Math.random() * 0.08 + 0.02;
        
        // Blend colors
        const colorMix = Math.random();
        const particleColor = color1.clone().lerp(color2, colorMix);
        
        particleColors[i * 3] = particleColor.r;
        particleColors[i * 3 + 1] = particleColor.g;
        particleColors[i * 3 + 2] = particleColor.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    sceneObjects.push(particles);
    
    particles.userData = {
        basePositions: particlePositions.slice(),
        orbitSpeed: 0.1,
        orbitAmplitude: 0.1,
        time: 0
    };
    
    // Add subtle animation to emissive intensity
    gsap.to(blendMaterial, {
        emissiveIntensity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true
    });
}

// Verse 22: Observational Emergence
function createObservationalEmergenceScene(config) {
    // Create a particle that only manifests its path when observed
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.particle),
        emissive: new THREE.Color(config.colors.particle),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: config.particleOpacity
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    sceneObjects.push(particle);
    
    // Create a circular orbit path for the particle
    const orbitGeometry = new THREE.TorusGeometry(4, 0.05, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.path),
        transparent: true,
        opacity: 0.1 // Nearly invisible until observed
    });
    
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    sceneObjects.push(orbit);
    
    // Create an observation beam that reveals the path
    const beamGeometry = new THREE.CylinderGeometry(0.5, 0.1, 10, 32, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.beam),
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, 0, -5);
    beam.rotation.x = Math.PI / 2;
    scene.add(beam);
    sceneObjects.push(beam);
    
    // Create beam source (observer)
    const observerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const observerMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.beam),
        emissive: new THREE.Color(config.colors.beam),
        emissiveIntensity: 0.5
    });
    
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.position.set(0, 0, -10);
    scene.add(observer);
    sceneObjects.push(observer);
    
    // Store data for animation
    particle.userData = {
        orbitAngle: 0,
        orbitRadius: 4,
        orbitSpeed: 0.5,
        isObserved: false,
        observedSegments: [] // Will store path points when observed
    };
    
    beam.userData = {
        targetParticle: particle,
        targetOrbit: orbit,
        isActive: false,
        activationStrength: 0,
        observerSource: observer
    };
    
    // Make beam interactive
    beam.userData.onClick = () => {
        beam.userData.isActive = !beam.userData.isActive;
        
        if (beam.userData.isActive) {
            gsap.to(beam.userData, {
                activationStrength: 1,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(beamMaterial, {
                opacity: 0.8,
                duration: 1
            });
            
            // Reveal the orbit
            gsap.to(orbitMaterial, {
                opacity: 0.5,
                duration: 1
            });
            
            // Make particle more visible
            gsap.to(particleMaterial, {
                opacity: 1,
                duration: 1
            });
        } else {
            gsap.to(beam.userData, {
                activationStrength: 0,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(beamMaterial, {
                opacity: 0.3,
                duration: 1
            });
            
            // Hide the orbit
            gsap.to(orbitMaterial, {
                opacity: 0.1,
                duration: 1
            });
            
            // Make particle less visible
            gsap.to(particleMaterial, {
                opacity: config.particleOpacity,
                duration: 1
            });
        }
    };
    
    interactiveObjects.push(beam);
    
    // Create instruction text
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 128;
    const context = textCanvas.getContext('2d');
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, textCanvas.width, textCanvas.height);
    context.font = 'bold 36px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Click the light to observe', textCanvas.width / 2, textCanvas.height / 2);
    
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textMaterial = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
    const textSprite = new THREE.Sprite(textMaterial);
    textSprite.position.set(0, 3, -5);
    textSprite.scale.set(5, 1.25, 1);
    
    scene.add(textSprite);
    sceneObjects.push(textSprite);
    
    // Create a particle trail system that appears when observed
    const trailGeometry = new THREE.BufferGeometry();
    const maxTrailPoints = 100;
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    const trailColors = new Float32Array(maxTrailPoints * 3);
    const trailSizes = new Float32Array(maxTrailPoints);
    
    // Initialize with zero opacity points
    for (let i = 0; i < maxTrailPoints; i++) {
        trailPositions[i * 3] = 0;
        trailPositions[i * 3 + 1] = 0;
        trailPositions[i * 3 + 2] = 0;
        
        trailColors[i * 3] = 1;
        trailColors[i * 3 + 1] = 1;
        trailColors[i * 3 + 2] = 1;
        
        trailSizes[i] = 0;
    }
    
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));
    
    const trailMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const trail = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trail);
    sceneObjects.push(trail);
    
    trail.userData = {
        targetParticle: particle,
        activePoints: 0,
        maxPoints: maxTrailPoints
    };
    
    // Animate glow effects
    gsap.to(observerMaterial, {
        emissiveIntensity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true
    });
}

// Verse 23: Quantum Identity
function createQuantumIdentityScene(config) {
    // Create two identical particles that swap positions
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.particle1),
        emissive: new THREE.Color(config.colors.particle1),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const particle1 = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    const particle2 = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    
    // Position particles on opposite sides
    particle1.position.set(3, 0, 0);
    particle2.position.set(-3, 0, 0);
    
    scene.add(particle1);
    scene.add(particle2);
    sceneObjects.push(particle1, particle2);
    
    // Create path for particles
    const pathCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(3, 0, 0),
        new THREE.Vector3(1, 2, 2),
        new THREE.Vector3(-1, -2, 2),
        new THREE.Vector3(-3, 0, 0)
    );
    
    const pathGeometry = new THREE.TubeGeometry(pathCurve, 100, 0.1, 8, false);
    const pathMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.path),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);
    sceneObjects.push(path);
    
    // Store data for animation
    particle1.userData = {
        pathProgress: 0,
        swapDirection: 1,
        swapRate: config.swapRate,
        swapPath: pathCurve,
        otherParticle: particle2
    };
    
    particle2.userData = {
        pathProgress: 1,
        swapDirection: -1,
        swapRate: config.swapRate,
        swapPath: pathCurve,
        otherParticle: particle1
    };
    
    // Create particle trail/blur effect
    const trailCount = 20;
    const createTrail = (particle) => {
        const trailGroup = new THREE.Group();
        
        for (let i = 0; i < trailCount; i++) {
            const trailElement = new THREE.Mesh(
                new THREE.SphereGeometry(0.4 * (1 - i/trailCount), 16, 16),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(config.colors.particle1),
                    transparent: true,
                    opacity: 0.3 * (1 - i/trailCount),
                    blending: THREE.AdditiveBlending
                })
            );
            trailGroup.add(trailElement);
        }
        
        trailGroup.userData = {
            targetParticle: particle,
            positions: Array(trailCount).fill().map(() => new THREE.Vector3())
        };
        
        scene.add(trailGroup);
        sceneObjects.push(trailGroup);
        
        return trailGroup;
    };
    
    const trail1 = createTrail(particle1);
    const trail2 = createTrail(particle2);
    
    // Add indistinguishability effect
    const indistinguishabilityGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const indistinguishabilityMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.particle1),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    // Create cloud of particles at swap point
    const swapCloud = new THREE.Group();
    const swapParticleCount = 30;
    
    for (let i = 0; i < swapParticleCount; i++) {
        const cloudParticle = new THREE.Mesh(indistinguishabilityGeometry, indistinguishabilityMaterial);
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.5;
        
        cloudParticle.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            (Math.random() - 0.5) * 2
        );
        
        swapCloud.add(cloudParticle);
    }
    
    swapCloud.position.set(0, 0, 0);
    swapCloud.visible = false;
    
    scene.add(swapCloud);
    sceneObjects.push(swapCloud);
    
    swapCloud.userData = {
        particle1: particle1,
        particle2: particle2,
        indistinguishabilityFactor: config.indistinguishability
    };
    
    // Animate glow
    gsap.to(particleMaterial, {
        emissiveIntensity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true
    });
}

// Verse 24: Existential Superposition
function createExistentialSuperpositionScene(config) {
    // Create a particle that fades between existence and non-existence
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.existence),
        emissive: new THREE.Color(config.colors.existence),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    sceneObjects.push(particle);
    
    // Create "non-existence" visualization
    const voidGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const voidMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.nonExistence),
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const voidSphere = new THREE.Mesh(voidGeometry, voidMaterial);
    scene.add(voidSphere);
    sceneObjects.push(voidSphere);
    
    // Create transitional energy field
    const fieldGeometry = new THREE.SphereGeometry(2, 32, 32);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.transition),
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    scene.add(field);
    sceneObjects.push(field);
    
    // Store data for animation
    particle.userData = {
        existenceState: 1.0, // 1 = fully exists, 0 = doesn't exist
        fadeRate: config.fadeRate,
        fadeDirection: -1,
        voidSphere: voidSphere,
        energyField: field,
        cycleCount: 0,
        maxCycles: config.stateCycles || Infinity
    };
    
    // Create probability wave particles
    const waveCount = 500;
    const waveGeometry = new THREE.BufferGeometry();
    const wavePositions = new Float32Array(waveCount * 3);
    const waveSizes = new Float32Array(waveCount);
    const wavePhases = new Float32Array(waveCount);
    
    for (let i = 0; i < waveCount; i++) {
        // Distribute in a spherical shell
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2 + Math.random() * 0.3; // Near the field boundary
        
        wavePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        wavePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        wavePositions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Random sizes
        waveSizes[i] = Math.random() * 0.05 + 0.02;
        
        // Random phases for animation
        wavePhases[i] = Math.random() * Math.PI * 2;
    }
    
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute('size', new THREE.BufferAttribute(waveSizes, 1));
    
    const waveMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(config.colors.transition),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        size: 0.1
    });
    
    const waveParticles = new THREE.Points(waveGeometry, waveMaterial);
    scene.add(waveParticles);
    sceneObjects.push(waveParticles);
    
    waveParticles.userData = {
        phases: wavePhases,
        centerParticle: particle,
        originalPositions: wavePositions.slice(),
        pulseStrength: config.pulseStrength
    };
    
    // Animate the field rotation
    gsap.to(field.rotation, {
        x: Math.PI * 2,
        y: Math.PI,
        duration: 20,
        repeat: -1,
        ease: "none"
    });
    
    // Pulse the void
    gsap.to(voidMaterial, {
        opacity: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true
    });
}

// Verse 25: Relational Mirage
function createRelationalMirageScene(config) {
    // Create a path that only becomes solid when measured
    const pathPoints = [];
    
    // Create a complex path
    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const angle = t * Math.PI * 4;
        const radius = 4 - t * 2; // Spiral inward
        
        pathPoints.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            (t - 0.5) * 4, // Move up
            Math.sin(angle) * radius
        ));
    }
    
    const curve = new THREE.CatmullRomCurve3(pathPoints);
    
    // Create mirage path (always visible but ethereal)
    const mirageGeometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
    const mirageMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.mirage),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const miragePath = new THREE.Mesh(mirageGeometry, mirageMaterial);
    scene.add(miragePath);
    sceneObjects.push(miragePath);
    
    // Create solid path (only visible when measured)
    const solidGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
    const solidMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.solid),
        emissive: new THREE.Color(config.colors.solid),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0 // Start invisible
    });
    
    const solidPath = new THREE.Mesh(solidGeometry, solidMaterial);
    scene.add(solidPath);
    sceneObjects.push(solidPath);
    
    // Create a particle that travels along the path
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.mirage),
        emissive: new THREE.Color(config.colors.mirage),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    sceneObjects.push(particle);
    
    // Position at start of path
    const startPoint = curve.getPoint(0);
    particle.position.copy(startPoint);
    
    // Create measurement device
    const measureGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const measureMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.colors.measurement),
        emissive: new THREE.Color(config.colors.measurement),
        emissiveIntensity: 0.3,
        transparent: true
    });
    
    const measureDevice = new THREE.Mesh(measureGeometry, measureMaterial);
    measureDevice.position.set(0, 0, -6);
    measureDevice.rotation.x = Math.PI / 2;
    scene.add(measureDevice);
    sceneObjects.push(measureDevice);
    
    // Create measurement beam
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 16, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.colors.measurement),
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, 0, -1); // Between device and center
    beam.rotation.x = Math.PI / 2;
    scene.add(beam);
    sceneObjects.push(beam);
    
    // Store data for animation
    particle.userData = {
        pathCurve: curve,
        pathProgress: 0,
        speed: 0.2,
        miragePath: miragePath,
        solidPath: solidPath,
        isMeasured: false
    };
    
    measureDevice.userData = {
        targetParticle: particle,
        measurementBeam: beam,
        measureStrength: 0,
        isActive: false,
        effectRadius: 2 // How close to activate measurement effect
    };
    
    // Make measurement device interactive
    measureDevice.userData.onClick = () => {
        measureDevice.userData.isActive = !measureDevice.userData.isActive;
        
        if (measureDevice.userData.isActive) {
            gsap.to(measureDevice.userData, {
                measureStrength: 1,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(beamMaterial, {
                opacity: 0.8,
                duration: 1
            });
            
            // Show the solid path
            gsap.to(solidMaterial, {
                opacity: config.pathSolidity,
                duration: 1
            });
            
            // Change particle color to measured state
            gsap.to(particleMaterial.color, {
                r: new THREE.Color(config.colors.solid).r,
                g: new THREE.Color(config.colors.solid).g,
                b: new THREE.Color(config.colors.solid).b,
                duration: 1
            });
            
            gsap.to(particleMaterial.emissive, {
                r: new THREE.Color(config.colors.solid).r,
                g: new THREE.Color(config.colors.solid).g,
                b: new THREE.Color(config.colors.solid).b,
                duration: 1
            });
        } else {
            gsap.to(measureDevice.userData, {
                measureStrength: 0,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(beamMaterial, {
                opacity: 0.3,
                duration: 1
            });
            
            // Hide the solid path gradually
            gsap.to(solidMaterial, {
                opacity: 0,
                duration: 1
            });
            
            // Change particle color back to mirage state
            gsap.to(particleMaterial.color, {
                r: new THREE.Color(config.colors.mirage).r,
                g: new THREE.Color(config.colors.mirage).g,
                b: new THREE.Color(config.colors.mirage).b,
                duration: 1
            });
            
            gsap.to(particleMaterial.emissive, {
                r: new THREE.Color(config.colors.mirage).r,
                g: new THREE.Color(config.colors.mirage).g,
                b: new THREE.Color(config.colors.mirage).b,
                duration: 1
            });
        }
    };
    
    interactiveObjects.push(measureDevice);
    
    // Create instruction text
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 128;
    const context = textCanvas.getContext('2d');
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, textCanvas.width, textCanvas.height);
    context.font = 'bold 36px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Click the cone to measure', textCanvas.width / 2, textCanvas.height / 2);
    
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textMaterial = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
    const textSprite = new THREE.Sprite(textMaterial);
    textSprite.position.set(0, 2, -6);
    textSprite.scale.set(5, 1.25, 1);
    
    scene.add(textSprite);
    sceneObjects.push(textSprite);
    
    // Animate device glow
    gsap.to(measureMaterial, {
        emissiveIntensity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true
    });
}

// ---- Animation Update Functions ----

// Verse 14: Temporal Superposition
function updateTemporalSuperposition(delta, config) {
    const particles = sceneObjects.find(obj => obj.type === 'Points');
    if (!particles) return;
    
    const positions = particles.geometry.getAttribute('position');
    const timeOffsets = particles.geometry.userData.timeOffsets;
    const sizes = particles.geometry.getAttribute('size');
    
    // Update each particle position based on complex temporal paths
    for (let i = 0; i < positions.count; i++) {
        const time = clock.elapsedTime * config.speed + timeOffsets[i];
        
        // Create complex motion with multiple harmonic components
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Superimposed temporal oscillations
        positions.setX(i, x + Math.sin(time * 0.5) * 0.02);
        positions.setY(i, y + Math.cos(time * 0.3) * 0.02);
        positions.setZ(i, z + Math.sin(time * 0.4) * 0.02);
        
        // Pulsate sizes
        sizes.setX(i, Math.abs(Math.sin(time) * 0.05) + 0.05);
    }
    
    positions.needsUpdate = true;
    sizes.needsUpdate = true;
}

// Verse 15: Wave-Particle Duality
function updateWaveParticleDuality(delta, config) {
    const waveParticles = sceneObjects.find(obj => obj.type === 'Points');
    if (!waveParticles) return;
    
    const positions = waveParticles.geometry.getAttribute('position');
    const colors = waveParticles.geometry.getAttribute('color');
    const sizes = waveParticles.geometry.getAttribute('size');
    const states = waveParticles.geometry.userData.states;
    const origPositions = waveParticles.geometry.userData.originalPositions;
    
    waveParticles.geometry.userData.time += delta;
    const time = waveParticles.geometry.userData.time;
    
    // Global wave factor (oscillates between particle and wave state)
    const globalWaveFactor = (Math.sin(time * config.speed) + 1) / 2; // 0 to 1
    
    const waveColor = new THREE.Color(config.colors.waveState);
    const particleColor = new THREE.Color(config.colors.particleState);
    const transitionColor = new THREE.Color(config.colors.transition);
    
    for (let i = 0; i < positions.count; i++) {
        const idx = i * 3;
        const angle = (i / positions.count) * Math.PI * 2;
        const baseRadius = 5;
        
        // Compute wave effect
        const waveFactor = globalWaveFactor; // 0 = particle, 1 = wave
        states[i] = waveFactor;
        
        // Shift positions from original circle based on wave state
        const waveDisplacement = Math.sin(angle * 6 + time * 2) * config.amplitude * waveFactor;
        const radius = baseRadius + waveDisplacement * 0.5;
        
        positions.setX(i, Math.cos(angle) * radius);
        positions.setY(i, Math.sin(angle) * radius);
        positions.setZ(i, waveDisplacement);
        
        // Size changes with state
        sizes.setX(i, 0.05 + waveFactor * 0.1);
        
        // Color transitions between states
        let currentColor;
        if (waveFactor < 0.5) {
            // Blend from particle to transition
            currentColor = particleColor.clone().lerp(transitionColor, waveFactor * 2);
        } else {
            // Blend from transition to wave
            currentColor = transitionColor.clone().lerp(waveColor, (waveFactor - 0.5) * 2);
        }
        
        colors.setXYZ(i, currentColor.r, currentColor.g, currentColor.b);
    }
    
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    sizes.needsUpdate = true;
}

// Verse 16: Complementarity
function updateComplementarity(delta, config) {
    // This scene is mainly handled by interactive clicks
    // Just add some continuous subtle animation
    
    const waveObject = sceneObjects.find(
        obj => obj.type === 'Mesh' && 
        obj.geometry.type === 'TorusKnotGeometry'
    );
    
    const particleObject = sceneObjects.find(
        obj => obj.type === 'Mesh' && 
        obj.geometry.type === 'SphereGeometry' && 
        obj !== 
        sceneObjects.find(obj => obj.userData && obj.userData.isDetector)
    );
    
    if (waveObject && waveObject.visible) {
        waveObject.rotation.x += delta * 0.2;
        waveObject.rotation.y += delta * 0.3;
    }
    
    if (particleObject && particleObject.visible) {
        particleObject.rotation.y += delta * 0.5;
    }
    
    // Pulse the detector if it hasn't been clicked yet
    const detector = sceneObjects.find(obj => obj.userData && obj.userData.isDetector);
    if (detector && !detector.userData.hasBeenAnimated) {
        gsap.to(detector.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            duration: 1,
            repeat: -1,
            yoyo: true
        });
        detector.userData.hasBeenAnimated = true;
    }
}

// Verse 17: Continuous Flow
function updateContinuousFlow(delta, config) {
    const flowParticles = sceneObjects.find(obj => obj.type === 'Points');
    if (!flowParticles) return;
    
    const positions = flowParticles.geometry.getAttribute('position');
    const lifetimes = flowParticles.geometry.userData.lifetimes;
    const originalHeights = flowParticles.geometry.userData.originalHeights;
    
    for (let i = 0; i < positions.count; i++) {
        // Update lifetime/flow progress
        lifetimes[i] += delta * config.flowRate;
        if (lifetimes[i] > 1) lifetimes[i] -= 1; // Loop back
        
        const idx = i * 3;
        // Original position
        const x = positions.getX(i);
        const y = originalHeights[idx + 1]; // Original y
        const z = positions.getZ(i);
        
        // Calculate current height in the flow
        const flowHeight = y - lifetimes[i] * 20; // Flow downward
        positions.setY(i, flowHeight % 20 - 10); // Loop within range
        
        // Add some turbulence
        const turbulence = config.turbulence * Math.sin(lifetimes[i] * 10 + clock.elapsedTime);
        positions.setX(i, x + turbulence * 0.1);
        positions.setZ(i, z + turbulence * 0.1);
    }
    
    positions.needsUpdate = true;
}

// Verse 18: Entanglement
function updateEntanglement(delta, config) {
    // Update particle positions in orbits
    const particles = sceneObjects.filter(obj => 
        obj.type === 'Mesh' && 
        obj.geometry.type === 'SphereGeometry' &&
        obj.userData && obj.userData.entangledWith
    );
    
    // Update connection line
    const connection = sceneObjects.find(obj => obj.type === 'Line');
    
    particles.forEach(particle => {
        // Update orbit angle
        particle.userData.angle += delta * config.orbitSpeed * particle.userData.orbitDirection;
        
        // Calculate new position
        const radius = particle.userData.radius;
        particle.position.x = Math.cos(particle.userData.angle) * radius;
        particle.position.z = Math.sin(particle.userData.angle) * radius;
        
        // Add slight vertical oscillation based on other particle's position
        const otherParticle = particle.userData.entangledWith;
        particle.position.y = Math.sin(otherParticle.userData.angle) * 0.5;
    });
    
    // Update connection line positions
    if (connection && connection.userData.particleA && connection.userData.particleB) {
        const posAttr = connection.userData.positionAttribute;
        
        posAttr.setXYZ(0, 
            connection.userData.particleA.position.x,
            connection.userData.particleA.position.y,
            connection.userData.particleA.position.z
        );
        
        posAttr.setXYZ(1, 
            connection.userData.particleB.position.x,
            connection.userData.particleB.position.y,
            connection.userData.particleB.position.z
        );
        
        posAttr.needsUpdate = true;
    }
}

// Verse 19: Observer Effect
function updateObserverEffect(delta, config) {
    const beam = sceneObjects.find(obj => 
        obj.type === 'Mesh' && 
        obj.geometry.type === 'CylinderGeometry' &&
        obj.userData && obj.userData.targetParticles
    );
    
    if (!beam) return;
    
    const particles = beam.userData.targetParticles;
    const positions = particles.geometry.getAttribute('position');
    const colors = particles.geometry.getAttribute('color');
    const originalStates = particles.geometry.userData.originalStates;
    const observedStates = particles.geometry.userData.observedStates;
    
    // Get current observation level
    const observationLevel = beam.userData.strength || 0;
    particles.geometry.userData.observationLevel = observationLevel;
    
    // Interpolate between original and observed states
    for (let i = 0; i < positions.count; i++) {
        const idx = i * 3;
        
        // Position interpolation
        positions.setX(i, 
            originalStates[idx] * (1 - observationLevel) + 
            observedStates[idx] * observationLevel
        );
        
        positions.setY(i, 
            originalStates[idx + 1] * (1 - observationLevel) + 
            observedStates[idx + 1] * observationLevel
        );
        
        positions.setZ(i, 
            originalStates[idx + 2] * (1 - observationLevel) + 
            observedStates[idx + 2] * observationLevel
        );
        
        // Color shift with observation
        const particleColor = new THREE.Color(config.colors.particle);
        const effectColor = new THREE.Color(config.colors.effect);
        
        const blendedColor = particleColor.clone().lerp(effectColor, observationLevel);
        
        colors.setX(i, blendedColor.r);
        colors.setY(i, blendedColor.g);
        colors.setZ(i, blendedColor.b);
    }
    
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    
    // Rotate beam slightly
    beam.rotation.z += delta * 0.1;
}

// Verse 20: Inseparable Pair
function updateInseparablePair(delta, config) {
    // Update tethered particles
    const particles = sceneObjects.filter(obj => 
        obj.type === 'Mesh' && 
        obj.geometry.type === 'SphereGeometry' &&
        obj.userData && obj.userData.tetheredTo
    );
    
    particles.forEach(particle => {
        // Update angle
        particle.userData.angle += delta * particle.userData.speed;
        
        // Calculate new position
        const basePos = particle.userData.basePosition;
        const radius = particle.userData.moveRadius;
        
        // Orbit around base position
        particle.position.x = basePos.x + Math.cos(particle.userData.angle) * radius * 0.5;
        particle.position.y = basePos.y + Math.sin(particle.userData.angle) * radius * 0.3;
        particle.position.z = basePos.z + Math.sin(particle.userData.angle * 1.5) * radius * 0.2;
        
        // Add influence from tethered particle (constraint)
        const other = particle.userData.tetheredTo;
        const toOther = new THREE.Vector3().subVectors(other.position, particle.position);
        const distance = toOther.length();
        
        // If too far from other particle, apply correction
        if (distance > 8) {
            toOther.normalize().multiplyScalar(distance - 8);
            particle.position.add(toOther.multiplyScalar(0.1));
        }
    });
    
    // Update tether
    const tether = sceneObjects.find(obj => 
        obj.userData && obj.userData.particle1 && obj.userData.particle2
    );
    
    if (tether && tether.userData.needsUpdate) {
        // Remove old tether
        scene.remove(tether);
        
        // Create new tether with updated positions
        const p1 = tether.userData.particle1.position;
        const p2 = tether.userData.particle2.position;
        
        const curve = new THREE.LineCurve3(p1, p2);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
        
        tether.geometry.dispose();
        tether.geometry = geometry;
    }
    
    // Update flow particles along tether
    const flow = sceneObjects.find(obj => 
        obj.type === 'Points' && 
        obj.userData && obj.userData.particle1 && obj.userData.particle2
    );
    
    if (flow) {
        const positions = flow.geometry.getAttribute('position');
        const flowProgress = flow.userData.flowProgress;
        const p1 = flow.userData.particle1.position;
        const p2 = flow.userData.particle2.position;
        
        for (let i = 0; i < positions.count; i++) {
            // Update progress
            flowProgress[i] += delta * 0.5;
            if (flowProgress[i] > 1) flowProgress[i] -= 1;
            
            // Interpolate position along tether
            const pos = p1.clone().lerp(p2, flowProgress[i]);
            
            // Add slight randomness
            pos.x += (Math.random() - 0.5) * 0.1;
            pos.y += (Math.random() - 0.5) * 0.1;
            pos.z += (Math.random() - 0.5) * 0.1;
            
            positions.setXYZ(i, pos.x, pos.y, pos.z);
        }
        
        positions.needsUpdate = true;
    }
}

// Verse 21: Superposition Blend
function updateSuperpositionBlend(delta, config) {
    // Update the morphing object
    const morphingObject = sceneObjects.find(obj => 
        obj.type === 'Mesh' && 
        obj.userData && obj.userData.state1 && obj.userData.state2
    );
    
    if (morphingObject) {
        // Update morph factor
        morphingObject.userData.morphFactor += delta * morphingObject.userData.morphSpeed * morphingObject.userData.morphDirection;
        
        // Reverse direction at limits
        if (morphingObject.userData.morphFactor >= 1) {
            morphingObject.userData.morphFactor = 1;
            morphingObject.userData.morphDirection = -1;
        } else if (morphingObject.userData.morphFactor <= 0) {
            morphingObject.userData.morphFactor = 0;
            morphingObject.userData.morphDirection = 1;
        }
        
        // Get current factor
        const morphFactor = morphingObject.userData.morphFactor;
        
        // Rotate based on morphing
        morphingObject.rotation.x += delta * 0.2 * (1 + morphFactor);
        morphingObject.rotation.y += delta * 0.3 * (1 - morphFactor);
        
        // Update material color
        const startColor = new THREE.Color(config.colors.state1);
        const endColor = new THREE.Color(config.colors.state2);
        const blendColor = new THREE.Color(config.colors.blend);
        
        let currentColor;
        if (morphFactor < 0.5) {
            // Blend from state1 to blend
            currentColor = startColor.clone().lerp(blendColor, morphFactor * 2);
        } else {
            // Blend from blend to state2
            currentColor = blendColor.clone().lerp(endColor, (morphFactor - 0.5) * 2);
        }
        
        morphingObject.material.color.copy(currentColor);
        morphingObject.material.emissive.copy(currentColor);
        
        // In a real implementation, we would morph between geometries
        // Here we use rotation and color to suggest the transformation
    }
    
    // Update orbiting particles
    const particles = sceneObjects.find(obj => 
        obj.type === 'Points' && 
        obj.userData && obj.userData.basePositions
    );
    
    if (particles) {
        const positions = particles.geometry.getAttribute('position');
        const basePositions = particles.userData.basePositions;
        
        // Update time
        particles.userData.time += delta;
        const time = particles.userData.time;
        
        for (let i = 0; i < positions.count; i++) {
            const idx = i * 3;
            
            // Base position
            const x = basePositions[idx];
            const y = basePositions[idx + 1];
            const z = basePositions[idx + 2];
            
            // Orbit around base position
            positions.setX(i, x + Math.sin(time + i * 0.1) * particles.userData.orbitAmplitude);
            positions.setY(i, y + Math.cos(time + i * 0.1) * particles.userData.orbitAmplitude);
            positions.setZ(i, z + Math.sin(time * 1.5 + i * 0.05) * particles.userData.orbitAmplitude);
        }
        
        positions.needsUpdate = true;
    }
}

// Verse 22: Observational Emergence
function updateObservationalEmergence(delta, config) {
    // Update particle motion
    const particle = sceneObjects.find(obj => 
        obj.type === 'Mesh' && 
        obj.geometry.type === 'SphereGeometry' && 
        obj.userData && obj.userData.orbitAngle !== undefined
    );
    
    if (particle) {
        // Update orbit angle
        particle.userData.orbitAngle += delta * particle.userData.orbitSpeed;
        
        // Calculate new position
        const radius = particle.userData.orbitRadius;
        particle.position.x = Math.cos(particle.userData.orbitAngle) * radius;
        particle.position.z = Math.sin(particle.userData.orbitAngle) * radius;
        
        // Update observed state based on beam
        const beam = sceneObjects.find(obj => 
            obj.userData && obj.userData.targetParticle === particle
        );
        
        if (beam) {
            particle.userData.isObserved = beam.userData.isActive;
        }
    }
    
    // Update trail when observed
    const trail = sceneObjects.find(obj => 
        obj.type === 'Points' && 
        obj.userData && obj.userData.targetParticle
    );
    
    if (trail && particle && particle.userData.isObserved) {
        const positions = trail.geometry.getAttribute('position');
        const colors = trail.geometry.getAttribute('color');
        const sizes = trail.geometry.getAttribute('size');
        
        // Shift all points forward
        for (let i = trail.userData.maxPoints - 1; i > 0; i--) {
            positions.setXYZ(i,
                positions.getX(i - 1),
                positions.getY(i - 1),
                positions.getZ(i - 1)
            );
            
            colors.setXYZ(i,
                colors.getX(i - 1),
                colors.getY(i - 1),
                colors.getZ(i - 1)
            );
            
            sizes.setX(i, sizes.getX(i - 1));
        }
        
        // Add new point at particle position
        positions.setXYZ(0, 
            particle.position.x, 
            particle.position.y, 
            particle.position.z
        );
        
        // Set color with fade effect
        const particleColor = new THREE.Color(config.colors.particle);
        colors.setXYZ(0, particleColor.r, particleColor.g, particleColor.b);
        
        // Set size
        sizes.setX(0, 0.2);
        
        // Increase active points if needed
        if (trail.userData.activePoints < trail.userData.maxPoints) {
            trail.userData.activePoints++;
        }
        
        // Fade out older points
        for (let i = 0; i < trail.userData.activePoints; i++) {
            const fadeFactor = 1 - (i / trail.userData.activePoints);
            sizes.setX(i, 0.2 * fadeFactor);
        }
        
        positions.needsUpdate = true;
        colors.needsUpdate = true;
        sizes.needsUpdate = true;
    }
    
    // Update beam position to point at particle
    const beam = sceneObjects.find(obj => 
        obj.userData && obj.userData.targetParticle && obj.userData.observerSource
    );
    
    if (beam && particle) {
        // Point beam at particle
        const observer = beam.userData.observerSource;
        const dirToParticle = new THREE.Vector3().subVectors(particle.position, observer.position).normalize();
        
        beam.position.copy(observer.position).add(dirToParticle.clone().multiplyScalar(5));
        beam.lookAt(particle.position);
        
        // Adjust beam length based on distance
        const distance = observer.position.distanceTo(particle.position);
        beam.scale.y = distance / 10; // Assuming beam's height is 10
    }
}

// Verse 23: Quantum Identity
function updateQuantumIdentity(delta, config) {
    // Update particles along path
    const particles = sceneObjects.filter(obj => 
        obj.type === 'Mesh' && 
        obj.geometry.type === 'SphereGeometry' &&
        obj.userData && obj.userData.swapPath
    );
    
    const swapCloud = sceneObjects.find(obj => 
        obj.type === 'Group' && 
        obj.userData && obj.userData.indistinguishabilityFactor
    );
    
    particles.forEach(particle => {
        // Update progress along path
        particle.userData.pathProgress += delta * particle.userData.swapDirection * particle.userData.swapRate;
        
        // Keep within 0-1 range with reversal
        if (particle.userData.pathProgress > 1) {
            particle.userData.pathProgress = 1;
            particle.userData.swapDirection *= -1;
        } else if (particle.userData.pathProgress < 0) {
            particle.userData.pathProgress = 0;
            particle.userData.swapDirection *= -1;
        }
        
        // Get position on path
        const path = particle.userData.swapPath;
        const point = path.getPoint(particle.userData.pathProgress);
        particle.position.copy(point);
        
        // When particles are in middle of swap, show indistinguishability effect
        if (swapCloud) {
            const particle1 = swapCloud.userData.particle1;
            const particle2 = swapCloud.userData.particle2;
            
            // Calculate proximity of particles (both close to middle of path)
            const midProximity = Math.abs(particle1.userData.pathProgress - 0.5) + 
                               Math.abs(particle2.userData.pathProgress - 0.5);
            
            // Scale and show cloud when particles are near middle
            if (midProximity < 0.3) {
                const visibility = 1 - (midProximity / 0.3);
                swapCloud.visible = true;
                swapCloud.scale.set(visibility, visibility, visibility);
                
                // Fade particles when in the cloud
                particle.material.opacity = 0.9 - visibility * 0.5;
            } else {
                swapCloud.visible = false;
                particle.material.opacity = 0.9;
            }
        }
    });
    
    // Update trails
    const trails = sceneObjects.filter(obj => 
        obj.type === 'Group' && 
        obj.userData && obj.userData.targetParticle &&
        obj.userData.positions
    );
    
    trails.forEach(trail => {
        const particle = trail.userData.targetParticle;
        const positions = trail.userData.positions;
        
        // Shift positions
        for (let i = positions.length - 1; i > 0; i--) {
            positions[i].copy(positions[i - 1]);
        }
        
        // Set first position to current particle position
        positions[0].copy(particle.position);
        
        // Update trail elements
        for (let i = 0; i < trail.children.length; i++) {
            const element = trail.children[i];
            element.position.copy(positions[i]);
            
            // Fade based on position in trail
            const fadeRatio = 1 - (i / trail.children.length);
            element.material.opacity = 0.3 * fadeRatio;
            element.scale.set(fadeRatio, fadeRatio, fadeRatio);
        }
    });
}

// Verse 24: Existential Superposition
function updateExistentialSuperposition(delta, config) {
    // Update the main particle's existence state
    const particle = sceneObjects.find(obj => 
        obj.type === 'Mesh' && 
        obj.geometry.type === 'SphereGeometry' &&
        obj.userData && obj.userData.existenceState !== undefined
    );
    
    if (particle) {
        // Update existence state
        particle.userData.existenceState += delta * particle.userData.fadeRate * particle.userData.fadeDirection;
        
        // Clamp and reverse
        if (particle.userData.existenceState >= 1) {
            particle.userData.existenceState = 1;
            particle.userData.fadeDirection = -1;
            
            // Count completed cycles
            particle.userData.cycleCount++;
            
            // Check if we've reached max cycles
            if (particle.userData.cycleCount >= particle.userData.maxCycles) {
                particle.userData.fadeDirection = 0; // Stop animation
                particle.userData.existenceState = 0.5; // Stabilize at halfway
            }
        } else if (particle.userData.existenceState <= 0) {
            particle.userData.existenceState = 0;
            particle.userData.fadeDirection = 1;
        }
        
        // Update material based on existence state
        const existenceState = particle.userData.existenceState;
        particle.material.opacity = existenceState * 0.8 + 0.1; // Never completely invisible
        
        // Scale based on existence state
        const scale = 0.5 + existenceState;
        particle.scale.set(scale, scale, scale);
        
        // Update void and field
        if (particle.userData.voidSphere) {
            const voidSphere = particle.userData.voidSphere;
            voidSphere.material.opacity = 0.3 - (existenceState * 0.2); // Stronger when particle doesn't exist
            
            // Pulse void when particle is in non-existence
            const pulseFactor = 1 + (1 - existenceState) * Math.sin(clock.elapsedTime * 2) * 0.1;
            voidSphere.scale.set(pulseFactor, pulseFactor, pulseFactor);
        }
        
        if (particle.userData.energyField) {
            const field = particle.userData.energyField;
            
            // Rotate field - faster when transitioning
            const transitionFactor = 4 * (existenceState * (1 - existenceState)); // Peaks at 0.5
            field.rotation.y += delta * (0.3 + transitionFactor);
            field.rotation.z += delta * (0.2 + transitionFactor);
            
            // Scale field with transition
            const fieldScale = 1.8 + transitionFactor * 0.4;
            field.scale.set(fieldScale, fieldScale, fieldScale);
            
            // Increase opacity during transition
            field.material.opacity = 0.1 + transitionFactor * 0.3;
        }
    }
    
    // Update wave particles
    const waveParticles = sceneObjects.find(obj => 
        obj.type === 'Points' && 
        obj.userData && obj.userData.phases
    );
    
    if (waveParticles && particle) {
        const positions = waveParticles.geometry.getAttribute('position');
        const phases = waveParticles.userData.phases;
        const originalPositions = waveParticles.userData.originalPositions;
        const sizes = waveParticles.geometry.getAttribute('size');
        
        // Get pulse strength and existence state
        const pulseStrength = waveParticles.userData.pulseStrength;
        const existenceState = particle.userData.existenceState;
        
        // Transition factor peaks during transition
        const transitionFactor = 4 * (existenceState * (1 - existenceState));
        
        for (let i = 0; i < positions.count; i++) {
            const idx = i * 3;
            
            // Base position
            const x = originalPositions[idx];
            const y = originalPositions[idx + 1];
            const z = originalPositions[idx + 2];
            
            // Update phase
            phases[i] += delta * (1 + transitionFactor);
            
            // Calculate displacement based on phase and transition state
            const displacement = Math.sin(phases[i]) * pulseStrength * transitionFactor;
            
            // Apply displacement radially
            const dir = new THREE.Vector3(x, y, z).normalize();
            
            positions.setX(i, x + dir.x * displacement);
            positions.setY(i, y + dir.y * displacement);
            positions.setZ(i, z + dir.z * displacement);
            
            // Update sizes - larger during transition
            sizes.setX(i, 0.02 + transitionFactor * 0.08);
        }
        
        positions.needsUpdate = true;
        sizes.needsUpdate = true;
        
        // Update material opacity based on transition
        waveParticles.material.opacity = 0.3 + transitionFactor * 0.6;
    }
}

// Verse 25: Relational Mirage
function updateRelationalMirage(delta, config) {
    // Update particle moving along the path
    const particle = sceneObjects.find(obj => 
        obj.type === 'Mesh' && 
        obj.geometry.type === 'SphereGeometry' &&
        obj.userData && obj.userData.pathCurve
    );
    
    if (particle) {
        // Update path progress
        particle.userData.pathProgress += delta * particle.userData.speed;
        if (particle.userData.pathProgress > 1) particle.userData.pathProgress = 0;
        
        // Get position on path
        const path = particle.userData.pathCurve;
        const point = path.getPoint(particle.userData.pathProgress);
        particle.position.copy(point);
        
        // Get tangent for orienting measurement device
        const tangent = path.getTangent(particle.userData.pathProgress);
        
        // Check if being measured
        const measureDevice = sceneObjects.find(obj => 
            obj.userData && obj.userData.targetParticle === particle
        );
        
        // If being measured and close enough, reveal solid path
        if (measureDevice && measureDevice.userData.isActive) {
            // Get distance from measure device to particle
            const distToParticle = measureDevice.position.distanceTo(particle.position);
            const effectRadius = measureDevice.userData.effectRadius || 2;
            
            // When particle is within range, path becomes more solid
            if (distToParticle < effectRadius) {
                particle.userData.isMeasured = true;
                
                // Calculate visibility based on distance
                const visibilityFactor = 1 - (distToParticle / effectRadius);
                
                // Fade in solid path
                if (particle.userData.solidPath) {
                    // Only show segment near particle
                    const fadePath = (t) => {
                        const distOnPath = Math.abs(t - particle.userData.pathProgress);
                        if (distOnPath > 0.5) return 0; // Handle wraparound
                        return Math.max(0, 1 - (distOnPath * 4));
                    };
                    
                    // This would use a shader in a real implementation
                    // Here we just set overall opacity
                    particle.userData.solidPath.material.opacity = config.pathSolidity * visibilityFactor;
                }
            } else {
                particle.userData.isMeasured = false;
                
                // Fade out solid path
                if (particle.userData.solidPath) {
                    gsap.to(particle.userData.solidPath.material, {
                        opacity: 0,
                        duration: 0.5
                    });
                }
            }
        } else {
            particle.userData.isMeasured = false;
            
            // Fade out solid path
            if (particle.userData.solidPath) {
                gsap.to(particle.userData.solidPath.material, {
                    opacity: 0,
                    duration: 0.5
                });
            }
        }
    }
    
    // Update measurement beam to point at particle
    const measureDevice = sceneObjects.find(obj => 
        obj.userData && obj.userData.targetParticle
    );
    
    if (measureDevice && particle) {
        // Only if active
        if (measureDevice.userData.isActive) {
            // Point beam at particle
            const beam = sceneObjects.find(obj => 
                obj.geometry.type === 'CylinderGeometry' && 
                obj.material.color.equals(new THREE.Color(config.colors.measurement))
            );
            
            if (beam) {
                beam.lookAt(particle.position);
                
                // Adjust beam length based on distance
                const distance = measureDevice.position.distanceTo(particle.position);
                beam.scale.y = distance / 10; // Assuming beam's height is 10
            }
            
            // Rotate device slightly
            measureDevice.rotation.z += delta * 0.5;
        }
    }
    
    // Make mirage path pulse
    const miragePath = sceneObjects.find(obj => 
        obj.material && obj.material.color.equals(new THREE.Color(config.colors.mirage))
    );
    
    if (miragePath) {
        const fadeRate = Math.sin(clock.elapsedTime * 0.5) * 0.1 + 0.3;
        miragePath.material.opacity = fadeRate;
    }
}

// Initialize scene and first verse
initScene();
loadVerse(0);