import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { verses, animationSettings, defaultControls } from './config.js';
import gsap from 'gsap';

// Main app state
const state = {
    currentVerseIndex: 0,
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    controls: null,
    animationObjects: {},
    clock: new THREE.Clock(),
    animating: true,
    currentAnimation: null,
    controlSettings: { ...defaultControls }
};

// DOM elements
const domElements = {
    sceneContainer: document.getElementById('scene-container'),
    verseText: document.getElementById('verse-text'),
    verseNumber: document.getElementById('verse-number'),
    madhyamakaConcept: document.getElementById('madhyamaka-concept'),
    quantumPhysics: document.getElementById('quantum-physics'),
    accessibleExplanation: document.getElementById('accessible-explanation'),
    verseSpecificControls: document.getElementById('verse-specific-controls'),
    prevVerseBtn: document.getElementById('prev-verse'),
    nextVerseBtn: document.getElementById('next-verse'),
    verseIndicator: document.getElementById('verse-indicator'),
    togglePanelBtn: document.getElementById('toggle-panel'),
    contentPanel: document.getElementById('content-panel')
};

// Initialize the application
init();

function init() {
    initThree();
    initEventListeners();
    updateVerseContent(0);
    animate();
}

function initThree() {
    // Create scene
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x000000);
    
    // Create camera
    state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    state.camera.position.z = animationSettings.cameraDistance;
    
    // Create renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    domElements.sceneContainer.appendChild(state.renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    state.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    state.scene.add(directionalLight);
    
    // Add orbit controls
    state.controls = new OrbitControls(state.camera, state.renderer.domElement);
    state.controls.enableDamping = true;
    state.controls.dampingFactor = 0.05;
    
    // Setup post-processing
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85 // threshold
    );
    
    state.composer = new EffectComposer(state.renderer);
    state.composer.addPass(new RenderPass(state.scene, state.camera));
    state.composer.addPass(bloomPass);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.composer.setSize(window.innerWidth, window.innerHeight);
}

function initEventListeners() {
    // Navigation buttons
    domElements.prevVerseBtn.addEventListener('click', () => navigateVerse(-1));
    domElements.nextVerseBtn.addEventListener('click', () => navigateVerse(1));
    
    // Mobile panel toggle
    domElements.togglePanelBtn.addEventListener('click', togglePanel);
}

function togglePanel() {
    domElements.contentPanel.classList.toggle('visible');
    domElements.togglePanelBtn.textContent = 
        domElements.contentPanel.classList.contains('visible') ? 'Hide Text' : 'Show Text';
}

function navigateVerse(direction) {
    const newIndex = state.currentVerseIndex + direction;
    if (newIndex >= 0 && newIndex < verses.length) {
        updateVerseContent(newIndex);
    }
}

function updateVerseContent(index) {
    state.currentVerseIndex = index;
    const verse = verses[index];
    
    // Update text content
    domElements.verseNumber.textContent = `Verse ${verse.id}`;
    domElements.verseText.textContent = verse.text;
    domElements.madhyamakaConcept.textContent = verse.madhyamaka;
    domElements.quantumPhysics.textContent = verse.quantum;
    domElements.accessibleExplanation.textContent = verse.explanation;
    
    // Update verse indicator
    domElements.verseIndicator.textContent = `${index + 1} / ${verses.length}`;
    
    // Add fade-in animation to updated content
    const elements = [
        domElements.verseNumber, 
        domElements.verseText, 
        domElements.madhyamakaConcept, 
        domElements.quantumPhysics, 
        domElements.accessibleExplanation
    ];
    
    elements.forEach(element => {
        element.classList.remove('fade-in');
        void element.offsetWidth; // Trigger reflow
        element.classList.add('fade-in');
    });
    
    // Update controls
    updateControls(verse);
    
    // Update 3D animation
    updateAnimation(verse.animation);
}

function updateControls(verse) {
    // Clear existing controls
    domElements.verseSpecificControls.innerHTML = '';
    
    // Add new controls based on verse
    verse.controls.forEach(control => {
        if (control.type === 'slider') {
            const container = document.createElement('div');
            container.className = 'slider-container';
            
            const label = document.createElement('label');
            label.textContent = control.label;
            label.htmlFor = control.id;
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = control.id;
            slider.min = control.min;
            slider.max = control.max;
            slider.value = control.value;
            
            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = slider.value;
            valueDisplay.className = 'slider-value';
            
            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
                handleControlAction(control.action, e.target.value);
            });
            
            container.appendChild(label);
            container.appendChild(slider);
            container.appendChild(valueDisplay);
            domElements.verseSpecificControls.appendChild(container);
        } else if (control.type === 'button') {
            const button = document.createElement('button');
            button.id = control.id;
            button.textContent = control.label;
            button.addEventListener('click', () => handleControlAction(control.action));
            domElements.verseSpecificControls.appendChild(button);
        }
    });
}

function handleControlAction(action, value) {
    switch (action) {
        case 'measureState':
            measureState();
            break;
        case 'adjustBarrier':
            state.controlSettings.barrierHeight = parseFloat(value);
            break;
        case 'measureEntangled':
            measureEntangled();
            break;
        case 'measureIndeterminacy':
            measureIndeterminacy();
            break;
        case 'adjustObservationRate':
            state.controlSettings.observationRate = parseFloat(value);
            break;
        case 'observeSystem':
            observeSystem();
            break;
        case 'adjustFieldEnergy':
            state.controlSettings.fieldEnergy = parseFloat(value);
            break;
        case 'measureCorrelation':
            measureCorrelation();
            break;
        case 'collapseProbability':
            collapseProbability();
            break;
        case 'createParticlePair':
            createParticlePair();
            break;
        case 'adjustTemperature':
            state.controlSettings.temperature = parseFloat(value);
            break;
        case 'addPhoton':
            addPhoton();
            break;
        case 'adjustPlateDistance':
            state.controlSettings.plateDistance = parseFloat(value);
            break;
    }
}

function clearScene() {
    // Remove all animation-specific objects
    for (const key in state.animationObjects) {
        if (state.animationObjects[key] instanceof THREE.Object3D) {
            state.scene.remove(state.animationObjects[key]);
        } else if (Array.isArray(state.animationObjects[key])) {
            state.animationObjects[key].forEach(obj => {
                if (obj instanceof THREE.Object3D) {
                    state.scene.remove(obj);
                }
            });
        }
    }
    
    // Reset animation objects
    state.animationObjects = {};
}

function updateAnimation(animationType) {
    clearScene();
    state.currentAnimation = animationType;
    
    switch (animationType) {
        case 'superposition':
            createSuperpositionAnimation();
            break;
        case 'tunneling':
            createTunnelingAnimation();
            break;
        case 'entanglement':
            createEntanglementAnimation();
            break;
        case 'indeterminacy':
            createIndeterminacyAnimation();
            break;
        case 'zeno':
            createZenoAnimation();
            break;
        case 'observerEffect':
            createObserverEffectAnimation();
            break;
        case 'particleCreation':
            createParticleCreationAnimation();
            break;
        case 'noLocalVariables':
            createNoLocalVariablesAnimation();
            break;
        case 'probabilisticStates':
            createProbabilisticStatesAnimation();
            break;
        case 'particleAntiparticle':
            createParticleAntiparticleAnimation();
            break;
        case 'laserCooling':
            createLaserCoolingAnimation();
            break;
        case 'electronJump':
            createElectronJumpAnimation();
            break;
        case 'quantumVacuum':
            createQuantumVacuumAnimation();
            break;
    }
}

// Animation Creation Functions

function createSuperpositionAnimation() {
    // Create a sphere with a wavey shader material
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Create a superposition shader material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(animationSettings.colors.primary) },
            color2: { value: new THREE.Color(animationSettings.colors.accent) }
        },
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                vUv = uv;
                
                vec3 pos = position;
                float elevation = sin(pos.x * 5.0 + time) * 0.1 + 
                                 sin(pos.y * 4.0 + time * 0.8) * 0.1 + 
                                 sin(pos.z * 3.0 + time * 1.2) * 0.1;
                
                pos += normal * elevation;
                vElevation = elevation;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                float mixFactor = (vElevation + 0.1) * 5.0;
                vec3 color = mix(color1, color2, mixFactor);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        transparent: true
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    state.scene.add(sphere);
    state.animationObjects.sphere = sphere;
    state.animationObjects.material = material;
    state.animationObjects.isSuperposed = true;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 0,
        z: 3,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createTunnelingAnimation() {
    // Create barrier
    const barrierGeometry = new THREE.BoxGeometry(0.5, 2, 2);
    const barrierMaterial = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.secondary,
        transparent: true,
        opacity: 0.7
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    state.scene.add(barrier);
    
    // Create particle
    const particleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.accent,
        emissive: animationSettings.colors.accent,
        emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = -2;
    state.scene.add(particle);
    
    // Create probability wave
    const waveGeometry = new THREE.BufferGeometry();
    const wavePoints = [];
    const segments = 100;
    
    for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * 5 - 2.5;
        wavePoints.push(new THREE.Vector3(x, 0, 0));
    }
    
    waveGeometry.setFromPoints(wavePoints);
    const waveMaterial = new THREE.LineBasicMaterial({ 
        color: animationSettings.colors.light,
        linewidth: 2
    });
    const wave = new THREE.Line(waveGeometry, waveMaterial);
    state.scene.add(wave);
    
    // Store references
    state.animationObjects.barrier = barrier;
    state.animationObjects.particle = particle;
    state.animationObjects.wave = wave;
    state.animationObjects.wavePoints = wavePoints;
    state.animationObjects.waveGeometry = waveGeometry;
    state.animationObjects.tunnelProgress = 0;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 1,
        z: 4,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createEntanglementAnimation() {
    // Create two entangled particles
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    
    const particle1Material = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.primary,
        emissive: animationSettings.colors.primary,
        emissiveIntensity: 0.5
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.accent,
        emissive: animationSettings.colors.accent,
        emissiveIntensity: 0.5
    });
    
    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    particle1.position.x = -1.5;
    
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    particle2.position.x = 1.5;
    
    state.scene.add(particle1);
    state.scene.add(particle2);
    
    // Create connection line
    const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
        particle1.position,
        particle2.position
    ]);
    const connectionMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.1,
        gapSize: 0.05,
        linewidth: 2
    });
    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
    connection.computeLineDistances();
    state.scene.add(connection);
    
    // Add spin vectors
    const arrowHelper1 = createArrow(particle1.position, new THREE.Vector3(0, 1, 0), 0.5, animationSettings.colors.primary);
    const arrowHelper2 = createArrow(particle2.position, new THREE.Vector3(0, -1, 0), 0.5, animationSettings.colors.accent);
    
    state.scene.add(arrowHelper1);
    state.scene.add(arrowHelper2);
    
    // Store references
    state.animationObjects.particle1 = particle1;
    state.animationObjects.particle2 = particle2;
    state.animationObjects.connection = connection;
    state.animationObjects.arrow1 = arrowHelper1;
    state.animationObjects.arrow2 = arrowHelper2;
    state.animationObjects.measured = false;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 1,
        z: 5,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createArrow(origin, direction, length, color) {
    const arrowHelper = new THREE.ArrowHelper(
        direction.normalize(),
        origin,
        length,
        color,
        0.1,
        0.05
    );
    
    return arrowHelper;
}

function createIndeterminacyAnimation() {
    // Create a cloud of particles
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(animationSettings.colors.primary);
    const color2 = new THREE.Color(animationSettings.colors.accent);
    
    for (let i = 0; i < particleCount; i++) {
        // Create random positions in a spherical cloud
        const radius = 1 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Interpolate between two colors
        const mixFactor = Math.random();
        const particleColor = new THREE.Color().lerpColors(color1, color2, mixFactor);
        
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    state.scene.add(particleSystem);
    
    // Store references
    state.animationObjects.particleSystem = particleSystem;
    state.animationObjects.particles = particles;
    state.animationObjects.positions = positions;
    state.animationObjects.originalPositions = positions.slice();
    state.animationObjects.measured = false;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 0,
        z: 4,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createZenoAnimation() {
    // Create a particle for the Quantum Zeno effect
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.primary,
        emissive: animationSettings.colors.primary,
        emissiveIntensity: 0.5
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    state.scene.add(particle);
    
    // Create a path target
    const targetGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const targetMaterial = new THREE.MeshBasicMaterial({ 
        color: animationSettings.colors.accent,
        transparent: true,
        opacity: 0.5
    });
    
    const target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(2, 0, 0);
    state.scene.add(target);
    
    // Create observer flash effect
    const flashGeometry = new THREE.RingGeometry(0.4, 0.5, 32);
    const flashMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
    });
    
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    state.scene.add(flash);
    
    // Store references
    state.animationObjects.particle = particle;
    state.animationObjects.target = target;
    state.animationObjects.flash = flash;
    state.animationObjects.flashMaterial = flashMaterial;
    state.animationObjects.lastObservationTime = 0;
    state.animationObjects.zenoDrift = 0;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 1,
        z: 5,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createObserverEffectAnimation() {
    // Create particle system
    const particleCount = 300;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Arrange particles in a disk
        const radius = Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        
        positions[i * 3] = radius * Math.cos(angle);
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = radius * Math.sin(angle);
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: animationSettings.colors.primary,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    state.scene.add(particleSystem);
    
    // Create observer
    const observerGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);
    const observerMaterial = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.accent,
        emissive: animationSettings.colors.accent,
        emissiveIntensity: 0.3
    });
    
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.position.set(0, 1, 3);
    observer.rotation.x = Math.PI / 2;
    observer.rotation.z = Math.PI;
    state.scene.add(observer);
    
    // Create observer beam
    const beamGeometry = new THREE.CylinderGeometry(0.01, 0.1, 3, 16);
    const beamMaterial = new THREE.MeshBasicMaterial({ 
        color: animationSettings.colors.accent,
        transparent: true,
        opacity: 0
    });
    
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, -1, 0);
    observer.add(beam);
    
    // Store references
    state.animationObjects.particleSystem = particleSystem;
    state.animationObjects.particles = particles;
    state.animationObjects.positions = positions;
    state.animationObjects.observer = observer;
    state.animationObjects.beam = beam;
    state.animationObjects.beamMaterial = beamMaterial;
    state.animationObjects.isObserving = false;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 3,
        y: 2,
        z: 5,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createParticleCreationAnimation() {
    // Create quantum field visualization
    const gridSize = 10;
    const spacing = 0.4;
    
    const fieldPoints = [];
    for (let x = -gridSize/2; x <= gridSize/2; x++) {
        for (let z = -gridSize/2; z <= gridSize/2; z++) {
            fieldPoints.push(
                new THREE.Vector3(x * spacing, 0, z * spacing)
            );
        }
    }
    
    const fieldGeometry = new THREE.BufferGeometry().setFromPoints(fieldPoints);
    const fieldMaterial = new THREE.PointsMaterial({
        color: 0x3366ff,
        size: 0.05
    });
    
    const field = new THREE.Points(fieldGeometry, fieldMaterial);
    state.scene.add(field);
    
    // Create particle pairs container
    const particlePairs = [];
    state.animationObjects.particlePairs = particlePairs;
    
    // Store references
    state.animationObjects.field = field;
    state.animationObjects.fieldGeometry = fieldGeometry;
    state.animationObjects.fieldPoints = fieldPoints;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 3,
        z: 4,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createNoLocalVariablesAnimation() {
    // Create two entangled particles with measurement devices
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    
    const particle1Material = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.primary,
        emissive: animationSettings.colors.primary,
        emissiveIntensity: 0.5
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({ 
        color: animationSettings.colors.accent,
        emissive: animationSettings.colors.accent,
        emissiveIntensity: 0.5
    });
    
    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    particle1.position.x = -2;
    
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    particle2.position.x = 2;
    
    state.scene.add(particle1);
    state.scene.add(particle2);
    
    // Create measurement devices
    const deviceGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const deviceMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
    
    const device1 = new THREE.Mesh(deviceGeometry, deviceMaterial);
    device1.position.set(-2, -0.5, 0);
    
    const device2 = new THREE.Mesh(deviceGeometry, deviceMaterial);
    device2.position.set(2, -0.5, 0);
    
    state.scene.add(device1);
    state.scene.add(device2);
    
    // Create result indicators
    const indicatorGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const indicator1Material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.5
    });
    const indicator2Material = indicator1Material.clone();
    
    const indicator1 = new THREE.Mesh(indicatorGeometry, indicator1Material);
    indicator1.position.set(-2, -0.7, 0);
    
    const indicator2 = new THREE.Mesh(indicatorGeometry, indicator2Material);
    indicator2.position.set(2, -0.7, 0);
    
    state.scene.add(indicator1);
    state.scene.add(indicator2);
    
    // Create connection line
    const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
        particle1.position,
        particle2.position
    ]);
    const connectionMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.1,
        gapSize: 0.05
    });
    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
    connection.computeLineDistances();
    state.scene.add(connection);
    
    // Store references
    state.animationObjects.particle1 = particle1;
    state.animationObjects.particle2 = particle2;
    state.animationObjects.device1 = device1;
    state.animationObjects.device2 = device2;
    state.animationObjects.indicator1 = indicator1;
    state.animationObjects.indicator2 = indicator2;
    state.animationObjects.indicator1Material = indicator1Material;
    state.animationObjects.indicator2Material = indicator2Material;
    state.animationObjects.connection = connection;
    state.animationObjects.measured = false;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 0,
        z: 5,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createProbabilisticStatesAnimation() {
    // Create a probability wave function
    const wavePoints = [];
    const segments = 100;
    const waveWidth = 5;
    
    for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * waveWidth - waveWidth/2;
        const y = Math.exp(-x*x) * Math.cos(x * 10) * 0.5;
        wavePoints.push(new THREE.Vector3(x, y, 0));
    }
    
    const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMaterial = new THREE.LineBasicMaterial({ 
        color: animationSettings.colors.primary,
        linewidth: 2
    });
    
    const wave = new THREE.Line(waveGeometry, waveMaterial);
    state.scene.add(wave);
    
    // Create probability particles
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Sample from probability distribution
        let x, y;
        do {
            x = (Math.random() * 2 - 1) * waveWidth/2;
            const amplitude = Math.exp(-x*x) * 0.5;
            y = (Math.random() * 2 - 1) * 0.5;
        } while (Math.abs(y) > Math.exp(-x*x) * 0.5);
        
        const z = (Math.random() * 2 - 1) * 0.1;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: animationSettings.colors.accent,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    state.scene.add(particleSystem);
    
    // Create the collapsed state particle
    const collapsedGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const collapsedMaterial = new THREE.MeshPhongMaterial({
        color: animationSettings.colors.accent,
        emissive: animationSettings.colors.accent,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    const collapsedParticle = new THREE.Mesh(collapsedGeometry, collapsedMaterial);
    state.scene.add(collapsedParticle);
    
    // Store references
    state.animationObjects.wave = wave;
    state.animationObjects.particleSystem = particleSystem;
    state.animationObjects.collapsedParticle = collapsedParticle;
    state.animationObjects.collapsedMaterial = collapsedMaterial;
    state.animationObjects.isCollapsed = false;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 0,
        z: 4,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createParticleAntiparticleAnimation() {
    // Create a vacuum field
    const fieldGeometry = new THREE.PlaneGeometry(6, 6, 20, 20);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x000033,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    state.scene.add(field);
    
    // Store particle pairs
    const particlePairs = [];
    state.animationObjects.particlePairs = particlePairs;
    
    // Create initial particle pairs
    for (let i = 0; i < 3; i++) {
        createPair(Math.random() * 4 - 2, Math.random() * 4 - 2, false);
    }
    
    // Store references
    state.animationObjects.field = field;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 3,
        z: 4,
        duration: 1.5,
        ease: "power2.inOut"
    });
    
    function createPair(x, z, animate = true) {
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: animationSettings.colors.primary,
            emissive: animationSettings.colors.primary,
            emissiveIntensity: 0.5
        });
        
        const antiparticleMaterial = new THREE.MeshPhongMaterial({
            color: animationSettings.colors.accent,
            emissive: animationSettings.colors.accent,
            emissiveIntensity: 0.5
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial);
        
        if (animate) {
            // Start at same position and then separate
            particle.position.set(x, 0, z);
            antiparticle.position.set(x, 0, z);
            
            particle.scale.set(0, 0, 0);
            antiparticle.scale.set(0, 0, 0);
            
            gsap.to(particle.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
            
            gsap.to(antiparticle.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
            
            // Separate in opposite directions
            const angle = Math.random() * Math.PI * 2;
            gsap.to(particle.position, {
                x: x + Math.cos(angle) * 0.3,
                y: 0.1,
                z: z + Math.sin(angle) * 0.3,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.to(antiparticle.position, {
                x: x - Math.cos(angle) * 0.3,
                y: 0.1,
                z: z - Math.sin(angle) * 0.3,
                duration: 1,
                ease: "power2.out"
            });
        } else {
            // Initial pairs are already separated
            const angle = Math.random() * Math.PI * 2;
            particle.position.set(
                x + Math.cos(angle) * 0.3,
                0.1,
                z + Math.sin(angle) * 0.3
            );
            
            antiparticle.position.set(
                x - Math.cos(angle) * 0.3,
                0.1,
                z - Math.sin(angle) * 0.3
            );
        }
        
        state.scene.add(particle);
        state.scene.add(antiparticle);
        
        // Create connection line
        const connectionGeometry = new THREE.BufferGeometry();
        connectionGeometry.setFromPoints([
            particle.position,
            antiparticle.position
        ]);
        
        const connectionMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 0.05,
            gapSize: 0.05
        });
        
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        connection.computeLineDistances();
        state.scene.add(connection);
        
        // Store the pair
        const pair = {
            particle,
            antiparticle,
            connection,
            connectionGeometry,
            age: 0,
            maxAge: 5 + Math.random() * 5
        };
        
        state.animationObjects.particlePairs.push(pair);
        
        return pair;
    }
    
    // Add creation function to animation objects
    state.animationObjects.createPair = createPair;
}

function createLaserCoolingAnimation() {
    // Create atoms for laser cooling
    const atomCount = 50;
    const atoms = [];
    
    for (let i = 0; i < atomCount; i++) {
        const atomGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const atomMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6600,
            emissive: 0xff3300,
            emissiveIntensity: 0.5
        });
        
        const atom = new THREE.Mesh(atomGeometry, atomMaterial);
        
        // Random position in a cube
        atom.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        
        // Random velocity
        atom.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        
        atom.userData.temperature = 1;
        
        state.scene.add(atom);
        atoms.push(atom);
    }
    
    // Create bounding box
    const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x3366ff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    state.scene.add(box);
    
    // Create laser beams (in 6 directions)
    const laserGeometry = new THREE.CylinderGeometry(0.02, 0.02, 4, 8);
    const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.2
    });
    
    const laserBeams = [];
    
    // X axis lasers
    const laserX1 = new THREE.Mesh(laserGeometry, laserMaterial);
    laserX1.rotation.z = Math.PI / 2;
    laserX1.position.x = -2;
    state.scene.add(laserX1);
    laserBeams.push(laserX1);
    
    const laserX2 = new THREE.Mesh(laserGeometry, laserMaterial);
    laserX2.rotation.z = Math.PI / 2;
    laserX2.position.x = 2;
    state.scene.add(laserX2);
    laserBeams.push(laserX2);
    
    // Y axis lasers
    const laserY1 = new THREE.Mesh(laserGeometry, laserMaterial);
    laserY1.position.y = -2;
    state.scene.add(laserY1);
    laserBeams.push(laserY1);
    
    const laserY2 = new THREE.Mesh(laserGeometry, laserMaterial);
    laserY2.position.y = 2;
    state.scene.add(laserY2);
    laserBeams.push(laserY2);
    
    // Z axis lasers
    const laserZ1 = new THREE.Mesh(laserGeometry, laserMaterial);
    laserZ1.rotation.x = Math.PI / 2;
    laserZ1.position.z = -2;
    state.scene.add(laserZ1);
    laserBeams.push(laserZ1);
    
    const laserZ2 = new THREE.Mesh(laserGeometry, laserMaterial);
    laserZ2.rotation.x = Math.PI / 2;
    laserZ2.position.z = 2;
    state.scene.add(laserZ2);
    laserBeams.push(laserZ2);
    
    // Store references
    state.animationObjects.atoms = atoms;
    state.animationObjects.box = box;
    state.animationObjects.laserBeams = laserBeams;
    state.animationObjects.laserMaterial = laserMaterial;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 5,
        y: 5,
        z: 5,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createElectronJumpAnimation() {
    // Create atom with electron orbits
    const nucleusGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const nucleusMaterial = new THREE.MeshPhongMaterial({
        color: 0x6666ff,
        emissive: 0x3333ff,
        emissiveIntensity: 0.5
    });
    
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    state.scene.add(nucleus);
    
    // Create electron orbits
    const orbits = [];
    const electrons = [];
    const orbitCount = 3;
    
    for (let i = 0; i < orbitCount; i++) {
        const radius = 0.5 + i * 0.5;
        
        const orbitGeometry = new THREE.TorusGeometry(radius, 0.01, 16, 100);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        });
        
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        state.scene.add(orbit);
        orbits.push(orbit);
        
        // Add electron if it's the ground state
        if (i === 0) {
            const electronGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const electronMaterial = new THREE.MeshPhongMaterial({
                color: 0xff0000,
                emissive: 0xff3300,
                emissiveIntensity: 0.5
            });
            
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            electron.position.set(radius, 0, 0);
            state.scene.add(electron);
            electrons.push(electron);
            
            electron.userData.orbitRadius = radius;
            electron.userData.orbitPosition = 0;
            electron.userData.orbitalLevel = 0;
        }
    }
    
    // Create photon
    const photonGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const photonMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0
    });
    
    const photon = new THREE.Mesh(photonGeometry, photonMaterial);
    photon.position.set(-3, 0, 0);
    state.scene.add(photon);
    
    // Store references
    state.animationObjects.nucleus = nucleus;
    state.animationObjects.orbits = orbits;
    state.animationObjects.electrons = electrons;
    state.animationObjects.photon = photon;
    state.animationObjects.photonMaterial = photonMaterial;
    state.animationObjects.isAnimatingJump = false;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 1,
        z: 4,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

function createQuantumVacuumAnimation() {
    // Create vacuum field with fluctuations
    const fieldGeometry = new THREE.PlaneGeometry(6, 6, 50, 50);
    
    // Create shader material for vacuum fluctuations
    const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            plateDistance: { value: 0.5 }
        },
        vertexShader: `
            uniform float time;
            uniform float plateDistance;
            varying vec2 vUv;
            varying float vElevation;
            
            float noise(vec2 p) {
                return sin(p.x * 10.0) * sin(p.y * 10.0) * 0.5 + 0.5;
            }
            
            void main() {
                vUv = uv;
                
                // Calculate distance from plates (plates are at x = -1.5 and x = 1.5)
                float distFromPlate1 = abs(position.x + 1.5);
                float distFromPlate2 = abs(position.x - 1.5);
                float plateEffect = min(distFromPlate1, distFromPlate2);
                
                // More dampening when plates are closer
                float dampening = smoothstep(0.0, plateDistance, plateEffect);
                
                vec2 noisePos = position.xz * 0.5 + time * 0.2;
                float noiseValue = noise(noisePos) * 0.1 * dampening;
                
                vec3 pos = position;
                pos.y = noiseValue;
                vElevation = noiseValue;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                float intensity = vElevation * 10.0 + 0.5;
                vec3 color = mix(
                    vec3(0.0, 0.1, 0.2),
                    vec3(0.0, 0.5, 1.0),
                    intensity
                );
                gl_FragColor = vec4(color, 0.7);
            }
        `,
        transparent: true,
        wireframe: false
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    state.scene.add(field);
    
    // Create Casimir plates
    const plateGeometry = new THREE.BoxGeometry(1, 0.1, 3);
    const plateMaterial = new THREE.MeshPhongMaterial({
        color: 0x999999,
        transparent: true,
        opacity: 0.7
    });
    
    const plate1 = new THREE.Mesh(plateGeometry, plateMaterial);
    plate1.position.set(-1.5, 0, 0);
    state.scene.add(plate1);
    
    const plate2 = new THREE.Mesh(plateGeometry, plateMaterial);
    plate2.position.set(1.5, 0, 0);
    state.scene.add(plate2);
    
    // Create arrows to indicate attraction
    const arrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
    
    const arrow1 = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow1.rotation.z = -Math.PI / 2;
    arrow1.position.set(-1, 0, 0);
    arrow1.scale.set(0, 0, 0);
    state.scene.add(arrow1);
    
    const arrow2 = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow2.rotation.z = Math.PI / 2;
    arrow2.position.set(1, 0, 0);
    arrow2.scale.set(0, 0, 0);
    state.scene.add(arrow2);
    
    // Store references
    state.animationObjects.field = field;
    state.animationObjects.fieldMaterial = fieldMaterial;
    state.animationObjects.plate1 = plate1;
    state.animationObjects.plate2 = plate2;
    state.animationObjects.arrow1 = arrow1;
    state.animationObjects.arrow2 = arrow2;
    
    // Position camera for this animation
    gsap.to(state.camera.position, {
        x: 0,
        y: 2,
        z: 5,
        duration: 1.5,
        ease: "power2.inOut"
    });
}

// Animation Control Functions

function measureState() {
    if (state.currentAnimation === 'superposition' && state.animationObjects.isSuperposed) {
        // Collapse the superposition
        const sphere = state.animationObjects.sphere;
        const material = state.animationObjects.material;
        
        gsap.to(material.uniforms.time, {
            value: 0,
            duration: 0.5,
            ease: "power2.inOut"
        });
        
        // Change material to a solid color
        const solidMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(animationSettings.colors.primary),
            transparent: true
        });
        
        gsap.delayedCall(0.5, () => {
            sphere.material = solidMaterial;
            
            // Flash effect
            gsap.to(solidMaterial, {
                opacity: 0.5,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        });
        
        state.animationObjects.isSuperposed = false;
    }
}

function measureEntangled() {
    if (state.currentAnimation === 'entanglement' && !state.animationObjects.measured) {
        const { arrow1, arrow2 } = state.animationObjects;
        
        // Randomly choose up or down for the first particle
        const upOrDown = Math.random() > 0.5 ? 1 : -1;
        
        // Second particle must be the opposite
        gsap.to(arrow1.rotation, {
            x: upOrDown === 1 ? 0 : Math.PI,
            duration: 0.5
        });
        
        gsap.to(arrow2.rotation, {
            x: upOrDown === 1 ? Math.PI : 0,
            duration: 0.5
        });
        
        // Add visual feedback
        const particle1 = state.animationObjects.particle1;
        const particle2 = state.animationObjects.particle2;
        
        gsap.to(particle1.scale, {
            x: 1.3, y: 1.3, z: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        gsap.to(particle2.scale, {
            x: 1.3, y: 1.3, z: 1.3,
            duration: 0.2,
            delay: 0.3,
            yoyo: true,
            repeat: 1
        });
        
        state.animationObjects.measured = true;
    }
}

function measureIndeterminacy() {
    if (state.currentAnimation === 'indeterminacy' && !state.animationObjects.measured) {
        const { particleSystem, positions, originalPositions } = state.animationObjects;
        
        // Choose a random focus point
        const focusPoint = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        
        // Move particles to collapsed state - clustered around focus point
        for (let i = 0; i < positions.length / 3; i++) {
            const index = i * 3;
            
            // Get direction to focus point
            const particlePos = new THREE.Vector3(
                originalPositions[index],
                originalPositions[index + 1],
                originalPositions[index + 2]
            );
            
            const distanceToFocus = particlePos.distanceTo(focusPoint);
            const direction = new THREE.Vector3().subVectors(focusPoint, particlePos).normalize();
            
            // Move closer to focus based on distance
            const newPos = new THREE.Vector3().addVectors(
                particlePos,
                direction.multiplyScalar(distanceToFocus * 0.8)
            );
            
            // Add random noise
            newPos.x += (Math.random() - 0.5) * 0.2;
            newPos.y += (Math.random() - 0.5) * 0.2;
            newPos.z += (Math.random() - 0.5) * 0.2;
            
            gsap.to(positions, {
                [index]: newPos.x,
                [index + 1]: newPos.y,
                [index + 2]: newPos.z,
                duration: 1,
                ease: "power2.inOut",
                onUpdate: () => {
                    particleSystem.geometry.attributes.position.needsUpdate = true;
                }
            });
        }
        
        state.animationObjects.measured = true;
    }
}

function observeSystem() {
    if (state.currentAnimation === 'observerEffect' && !state.animationObjects.isObserving) {
        const { beam, beamMaterial, particleSystem, positions } = state.animationObjects;
        
        // Make beam visible
        gsap.to(beamMaterial, {
            opacity: 0.7,
            duration: 0.5
        });
        
        // Disturb particles
        for (let i = 0; i < positions.length / 3; i++) {
            const index = i * 3;
            const x = positions[index];
            const z = positions[index + 2];
            
            // Calculate distance from beam center
            const distanceFromBeam = Math.sqrt(x * x + z * z);
            
            if (distanceFromBeam < 1) {
                // Particles near beam move more
                const angle = Math.atan2(z, x);
                const newRadius = distanceFromBeam + 0.5;
                
                gsap.to(positions, {
                    [index]: Math.cos(angle) * newRadius,
                    [index + 2]: Math.sin(angle) * newRadius,
                    duration: 1,
                    ease: "power2.out",
                    onUpdate: () => {
                        particleSystem.geometry.attributes.position.needsUpdate = true;
                    }
                });
            }
        }
        
        // Reset after a delay
        gsap.delayedCall(2, () => {
            gsap.to(beamMaterial, {
                opacity: 0,
                duration: 0.5
            });
            state.animationObjects.isObserving = false;
        });
        
        state.animationObjects.isObserving = true;
    }
}

function createParticlePair() {
    if (state.currentAnimation === 'particleCreation') {
        const randomX = (Math.random() - 0.5) * 2;
        const randomZ = (Math.random() - 0.5) * 2;
        
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: animationSettings.colors.primary,
            emissive: animationSettings.colors.primary,
            emissiveIntensity: 0.5
        });
        
        const antiparticleMaterial = new THREE.MeshPhongMaterial({
            color: animationSettings.colors.accent,
            emissive: animationSettings.colors.accent,
            emissiveIntensity: 0.5
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial);
        
        // Start at same position
        particle.position.set(randomX, 0, randomZ);
        antiparticle.position.set(randomX, 0, randomZ);
        
        particle.scale.set(0, 0, 0);
        antiparticle.scale.set(0, 0, 0);
        
        state.scene.add(particle);
        state.scene.add(antiparticle);
        
        // Grow from nothing
        gsap.to(particle.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        gsap.to(antiparticle.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        // Move apart
        const angle = Math.random() * Math.PI * 2;
        gsap.to(particle.position, {
            x: randomX + Math.cos(angle) * 0.5,
            y: Math.sin(Math.random() * Math.PI) * 0.3,
            z: randomZ + Math.sin(angle) * 0.5,
            duration: 1,
            ease: "power2.out"
        });
        
        gsap.to(antiparticle.position, {
            x: randomX - Math.cos(angle) * 0.5,
            y: Math.sin(Math.random() * Math.PI) * 0.3,
            z: randomZ - Math.sin(angle) * 0.5,
            duration: 1,
            ease: "power2.out"
        });
        
        // Create temporary connection line
        const connectionGeometry = new THREE.BufferGeometry();
        connectionGeometry.setFromPoints([
            particle.position,
            antiparticle.position
        ]);
        
        const connectionMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 0.05,
            gapSize: 0.05,
            transparent: true,
            opacity: 1
        });
        
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        connection.computeLineDistances();
        state.scene.add(connection);
        
        // Update line during animation
        const updateConnection = () => {
            connectionGeometry.setFromPoints([
                particle.position,
                antiparticle.position
            ]);
            connectionGeometry.attributes.position.needsUpdate = true;
            connection.computeLineDistances();
        };
        
        const updateInterval = setInterval(updateConnection, 50);
        
        // Fade out and remove after a delay
        gsap.delayedCall(3, () => {
            clearInterval(updateInterval);
            
            gsap.to(connectionMaterial, {
                opacity: 0,
                duration: 0.5
            });
            
            gsap.to(particle.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.5,
                delay: 0.5
            });
            
            gsap.to(antiparticle.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.5,
                delay: 0.5,
                onComplete: () => {
                    state.scene.remove(particle);
                    state.scene.remove(antiparticle);
                    state.scene.remove(connection);
                }
            });
        });
    } else if (state.currentAnimation === 'particleAntiparticle') {
        // Use the existing createPair function
        const randomX = (Math.random() - 0.5) * 3;
        const randomZ = (Math.random() - 0.5) * 3;
        state.animationObjects.createPair(randomX, randomZ, true);
    }
}

function measureCorrelation() {
    if (state.currentAnimation === 'noLocalVariables' && !state.animationObjects.measured) {
        const { indicator1Material, indicator2Material } = state.animationObjects;
        
        // Randomly choose result for first measurement
        const result1 = Math.random() > 0.5;
        
        // Second measurement is correlated (opposite in this case)
        const result2 = !result1;
        
        // Update indicator colors
        gsap.to(indicator1Material.color, {
            r: result1 ? 0 : 1,
            g: result1 ? 1 : 0,
            b: 0,
            duration: 0.5
        });
        
        gsap.to(indicator2Material.color, {
            r: result2 ? 0 : 1,
            g: result2 ? 1 : 0,
            b: 0,
            duration: 0.5,
            delay: 0.3
        });
        
        // Add visual feedback
        const particle1 = state.animationObjects.particle1;
        const particle2 = state.animationObjects.particle2;
        
        gsap.to(particle1.scale, {
            x: 1.3, y: 1.3, z: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        gsap.to(particle2.scale, {
            x: 1.3, y: 1.3, z: 1.3,
            duration: 0.2,
            delay: 0.3,
            yoyo: true,
            repeat: 1
        });
        
        state.animationObjects.measured = true;
    }
}

function collapseProbability() {
    if (state.currentAnimation === 'probabilisticStates' && !state.animationObjects.isCollapsed) {
        const { wave, particleSystem, collapsedParticle, collapsedMaterial } = state.animationObjects;
        
        // Choose a random position along the wave function
        const x = (Math.random() * 2 - 1) * 2;
        const probability = Math.exp(-x*x) * 0.5;
        const y = (Math.random() * 2 - 1) * probability;
        
        // Hide the wave and particles
        gsap.to(wave.material, {
            opacity: 0,
            duration: 0.5
        });
        
        gsap.to(particleSystem.material, {
            opacity: 0,
            duration: 0.5
        });
        
        // Show the collapsed particle
        collapsedParticle.position.set(x, y, 0);
        
        gsap.to(collapsedMaterial, {
            opacity: 1,
            duration: 0.5
        });
        
        // Add pulse effect
        gsap.to(collapsedParticle.scale, {
            x: 1.5, y: 1.5, z: 1.5,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
        
        state.animationObjects.isCollapsed = true;
    }
}

function addPhoton() {
    if (state.currentAnimation === 'electronJump' && !state.animationObjects.isAnimatingJump) {
        const { photon, photonMaterial, electrons } = state.animationObjects;
        
        if (electrons.length === 0) return;
        
        const electron = electrons[0];
        
        // Reset photon position
        photon.position.set(-3, 0, 0);
        
        // Make photon visible and animate it
        gsap.to(photonMaterial, {
            opacity: 1,
            duration: 0.3
        });
        
        gsap.to(photon.position, {
            x: electron.position.x,
            duration: 1,
            ease: "power2.in",
            onComplete: () => {
                // Absorb photon
                gsap.to(photonMaterial, {
                    opacity: 0,
                    duration: 0.2
                });
                
                // Electron jumps to higher orbit
                const currentLevel = electron.userData.orbitalLevel;
                const newLevel = (currentLevel + 1) % state.animationObjects.orbits.length;
                const newRadius = 0.5 + newLevel * 0.5;
                
                gsap.to(electron.position, {
                    x: Math.cos(electron.userData.orbitPosition) * newRadius,
                    z: Math.sin(electron.userData.orbitPosition) * newRadius,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        electron.userData.orbitalLevel = newLevel;
                        electron.userData.orbitRadius = newRadius;
                        state.animationObjects.isAnimatingJump = false;
                    }
                });
            }
        });
        
        state.animationObjects.isAnimatingJump = true;
    }
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = state.clock.getDelta();
    
    // Update animations based on current type
    updateCurrentAnimation(delta);
    
    // Update camera controls
    state.controls.update();
    
    // Render scene
    state.composer.render();
}

function updateCurrentAnimation(delta) {
    switch (state.currentAnimation) {
        case 'superposition':
            if (state.animationObjects.isSuperposed) {
                state.animationObjects.material.uniforms.time.value += delta;
            }
            break;
            
        case 'tunneling':
            updateTunnelingAnimation(delta);
            break;
            
        case 'entanglement':
            updateEntanglementAnimation(delta);
            break;
            
        case 'indeterminacy':
            updateIndeterminacyAnimation(delta);
            break;
            
        case 'zeno':
            updateZenoAnimation(delta);
            break;
            
        case 'particleCreation':
            updateParticleCreationAnimation(delta);
            break;
            
        case 'particleAntiparticle':
            updateParticleAntiparticleAnimation(delta);
            break;
            
        case 'laserCooling':
            updateLaserCoolingAnimation(delta);
            break;
            
        case 'electronJump':
            updateElectronJumpAnimation(delta);
            break;
            
        case 'quantumVacuum':
            updateQuantumVacuumAnimation(delta);
            break;
    }
}

// Animation update functions for each type

function updateTunnelingAnimation(delta) {
    // Update barrier based on control
    if (state.animationObjects.barrier) {
        state.animationObjects.barrier.scale.y = state.controlSettings.barrierHeight / 5;
    }
    
    // Update wave function
    if (state.animationObjects.wavePoints) {
        const { wavePoints, waveGeometry, particle } = state.animationObjects;
        const segments = wavePoints.length - 1;
        
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * 5 - 2.5;
            const barrierX = 0;
            const barrierWidth = 0.5;
            
            // Calculate wave amplitude - reduced inside barrier proportional to barrier height
            let amplitude = 0.3;
            if (x > barrierX - barrierWidth/2 && x < barrierX + barrierWidth/2) {
                amplitude *= Math.exp(-state.controlSettings.barrierHeight / 2);
            }
            
            // Create wave pattern
            wavePoints[i].y = Math.sin(x * 10 + state.clock.elapsedTime * 5) * amplitude;
        }
        
        waveGeometry.setFromPoints(wavePoints);
        
        // Move particle with probability of tunneling inversely proportional to barrier height
        state.animationObjects.tunnelProgress += delta * (0.5 - state.controlSettings.barrierHeight / 20);
        
        if (state.animationObjects.tunnelProgress < 0) {
            state.animationObjects.tunnelProgress = 0;
        }
        
        if (state.animationObjects.tunnelProgress > 1) {
            state.animationObjects.tunnelProgress = 0;
            particle.position.x = -2; // Reset to left side
        }
        
        // Calculate position based on a sigmoid function for smoother transitions
        const sigmoid = (x) => 1 / (1 + Math.exp(-12 * (x - 0.5)));
        const normalizedPos = sigmoid(state.animationObjects.tunnelProgress);
        
        particle.position.x = -2 + normalizedPos * 4;
    }
}

function updateEntanglementAnimation(delta) {
    if (state.animationObjects.particle1 && state.animationObjects.particle2) {
        const { particle1, particle2, connection, arrow1, arrow2 } = state.animationObjects;
        
        // Update connection line
        const points = [
            particle1.position,
            particle2.position
        ];
        connection.geometry.setFromPoints(points);
        connection.computeLineDistances();
        
        // Rotate particles slightly
        particle1.rotation.y += delta * 0.5;
        particle2.rotation.y += delta * 0.5;
        
        if (!state.animationObjects.measured) {
            // Rotate spin arrows when not measured
            arrow1.rotation.z = -Math.PI / 2;
            arrow1.rotation.y += delta;
            
            arrow2.rotation.z = Math.PI / 2;
            arrow2.rotation.y += delta;
        }
    }
}

function updateIndeterminacyAnimation(delta) {
    if (state.animationObjects.particleSystem && !state.animationObjects.measured) {
        const { particleSystem, positions } = state.animationObjects;
        
        // Make particles move in fuzzy patterns
        for (let i = 0; i < positions.length; i += 3) {
            const time = state.clock.elapsedTime;
            
            // Use noise-like function for movement
            const noise1 = Math.sin(time + i * 0.01) * Math.cos(time * 0.7 + i * 0.03);
            const noise2 = Math.sin(time * 0.8 + i * 0.02) * Math.cos(time * 1.2 + i * 0.01);
            const noise3 = Math.sin(time * 1.1 + i * 0.03) * Math.cos(time * 0.5 + i * 0.02);
            
            positions[i] += noise1 * delta * 0.05;
            positions[i + 1] += noise2 * delta * 0.05;
            positions[i + 2] += noise3 * delta * 0.05;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
}

function updateZenoAnimation(delta) {
    if (state.animationObjects.particle) {
        const { particle, target, flash, flashMaterial } = state.animationObjects;
        
        // Quantum Zeno effect - movement freezes with frequent observation
        const observationRate = state.controlSettings.observationRate / 10;
        const observationInterval = 1 / observationRate;
        
        state.animationObjects.lastObservationTime += delta;
        
        if (state.animationObjects.lastObservationTime >= observationInterval) {
            // Observation occurred, flash and reset position slightly
            state.animationObjects.lastObservationTime = 0;
            
            flash.position.copy(particle.position);
            
            gsap.to(flashMaterial, {
                opacity: 0.8,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
            
            // Reset zenoDrift (freezes movement with frequent observations)
            state.animationObjects.zenoDrift *= 0.1;
        }
        
        // Calculate drift (ability to move toward target)
        state.animationObjects.zenoDrift += delta * 0.2;
        
        // Move particle toward target based on zenoDrift
        const direction = new THREE.Vector3().subVectors(target.position, particle.position).normalize();
        particle.position.add(direction.multiplyScalar(delta * state.animationObjects.zenoDrift));
        
        // Reset if reached target
        if (particle.position.distanceTo(target.position) < 0.1) {
            particle.position.set(0, 0, 0);
            state.animationObjects.zenoDrift = 0;
        }
    }
}

function updateParticleCreationAnimation(delta) {
    // Adjust field fluctuations based on energy
    // Higher energy -> more particle pairs
    if (Math.random() < delta * state.controlSettings.fieldEnergy / 5) {
        // Random position in field
        const x = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        
        createParticlePair();
    }
}

function updateParticleAntiparticleAnimation(delta) {
    // Update particle pairs
    if (state.animationObjects.particlePairs) {
        const pairs = state.animationObjects.particlePairs;
        
        for (let i = pairs.length - 1; i >= 0; i--) {
            const pair = pairs[i];
            
            // Update connection line
            pair.connectionGeometry.setFromPoints([
                pair.particle.position,
                pair.antiparticle.position
            ]);
            pair.connection.computeLineDistances();
            
            // Rotate particles
            pair.particle.rotation.y += delta;
            pair.antiparticle.rotation.y += delta;
            
            // Age the pair
            pair.age += delta;
            
            // Annihilate old pairs
            if (pair.age > pair.maxAge) {
                // Move particles closer for annihilation
                gsap.to(pair.particle.position, {
                    x: (pair.particle.position.x + pair.antiparticle.position.x) / 2,
                    y: (pair.particle.position.y + pair.antiparticle.position.y) / 2,
                    z: (pair.particle.position.z + pair.antiparticle.position.z) / 2,
                    duration: 0.5
                });
                
                gsap.to(pair.antiparticle.position, {
                    x: (pair.particle.position.x + pair.antiparticle.position.x) / 2,
                    y: (pair.particle.position.y + pair.antiparticle.position.y) / 2,
                    z: (pair.particle.position.z + pair.antiparticle.position.z) / 2,
                    duration: 0.5
                });
                
                // Shrink and remove
                gsap.to(pair.particle.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5,
                    delay: 0.5
                });
                
                gsap.to(pair.antiparticle.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5,
                    delay: 0.5,
                    onComplete: () => {
                        state.scene.remove(pair.particle);
                        state.scene.remove(pair.antiparticle);
                        state.scene.remove(pair.connection);
                    }
                });
                
                // Remove from array
                pairs.splice(i, 1);
                
                // Create a new pair elsewhere
                if (Math.random() < 0.7) {
                    setTimeout(() => {
                        if (state.currentAnimation === 'particleAntiparticle') {
                            const x = (Math.random() - 0.5) * 4;
                            const z = (Math.random() - 0.5) * 4;
                            state.animationObjects.createPair(x, z, true);
                        }
                    }, Math.random() * 1000);
                }
            }
        }
    }
}

function updateLaserCoolingAnimation(delta) {
    if (state.animationObjects.atoms) {
        const { atoms, box, laserMaterial } = state.animationObjects;
        const temperature = state.controlSettings.temperature / 10;
        
        // Update laser intensity based on temperature
        const laserIntensity = (10 - temperature) / 10;
        laserMaterial.opacity = laserIntensity * 0.4;
        
        for (let atom of atoms) {
            // Update velocity and position
            atom.position.x += atom.userData.velocity.x * delta * temperature;
            atom.position.y += atom.userData.velocity.y * delta * temperature;
            atom.position.z += atom.userData.velocity.z * delta * temperature;
            
            // Boundary collisions with the box
            const boxSize = 2;
            
            if (Math.abs(atom.position.x) > boxSize) {
                atom.position.x = Math.sign(atom.position.x) * boxSize;
                atom.userData.velocity.x *= -0.9;
            }
            
            if (Math.abs(atom.position.y) > boxSize) {
                atom.position.y = Math.sign(atom.position.y) * boxSize;
                atom.userData.velocity.y *= -0.9;
            }
            
            if (Math.abs(atom.position.z) > boxSize) {
                atom.position.z = Math.sign(atom.position.z) * boxSize;
                atom.userData.velocity.z *= -0.9;
            }
            
            // Slow down atoms based on temperature control (laser cooling)
            if (temperature < 0.9) {
                atom.userData.velocity.x *= 0.99;
                atom.userData.velocity.y *= 0.99;
                atom.userData.velocity.z *= 0.99;
            }
            
            // Update atom color based on temperature (red hot to blue cold)
            const r = Math.min(1, temperature);
            const g = Math.min(0.6, temperature * 0.5);
            const b = Math.max(0, 1 - temperature);
            
            atom.material.color.setRGB(r, g, b);
            atom.material.emissive.setRGB(r * 0.5, g * 0.5, b * 0.5);
        }
    }
}

function updateElectronJumpAnimation(delta) {
    if (state.animationObjects.electrons) {
        for (const electron of state.animationObjects.electrons) {
            // Update orbital position
            electron.userData.orbitPosition += delta * 2;
            
            // Calculate position based on orbital level and angle
            const radius = electron.userData.orbitRadius;
            const angle = electron.userData.orbitPosition;
            
            electron.position.x = Math.cos(angle) * radius;
            electron.position.z = Math.sin(angle) * radius;
        }
    }
}

function updateQuantumVacuumAnimation(delta) {
    if (state.animationObjects.fieldMaterial) {
        // Update time uniform for the vacuum fluctuations
        state.animationObjects.fieldMaterial.uniforms.time.value += delta;
        
        // Update plate distance based on slider
        const plateDistance = state.controlSettings.plateDistance / 10;
        state.animationObjects.fieldMaterial.uniforms.plateDistance.value = plateDistance;
        
        // Position plates based on distance setting
        const { plate1, plate2, arrow1, arrow2 } = state.animationObjects;
        
        const plateX = 1 + plateDistance * 2;
        
        plate1.position.x = -plateX;
        plate2.position.x = plateX;
        
        // Show attraction arrows if plates are close enough
        if (plateDistance < 0.3) {
            const arrowScale = (0.3 - plateDistance) / 0.3;
            
            arrow1.position.x = -plateX/2;
            arrow2.position.x = plateX/2;
            
            gsap.to(arrow1.scale, {
                x: arrowScale, y: arrowScale, z: arrowScale,
                duration: 0.5
            });
            
            gsap.to(arrow2.scale, {
                x: arrowScale, y: arrowScale, z: arrowScale,
                duration: 0.5
            });
        } else {
            gsap.to(arrow1.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.5
            });
            
            gsap.to(arrow2.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.5
            });
        }
    }
}

