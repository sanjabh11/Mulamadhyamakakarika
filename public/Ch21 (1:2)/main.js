import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { gsap } from 'gsap';
import { config } from './config.js';

// Core scene elements
let scene, camera, renderer, composer, controls, labelRenderer;
let currentVerse = 0;
let animations = [];
let currentAnimation = null;

// DOM Elements
const panelToggleBtn = document.getElementById('panel-toggle');
const panel = document.getElementById('panel');
const explanationHeader = document.getElementById('explanation-header');
const explanationContent = document.getElementById('explanation-content');
const controlsHeader = document.getElementById('controls-header');
const controlsContent = document.getElementById('controls-content');
const verseNavigation = document.getElementById('verse-navigation');
const verseTitleEl = document.getElementById('verse-title');
const madhyamakaTextEl = document.getElementById('madhyamaka-text');
const quantumTextEl = document.getElementById('quantum-text');
const explanationTextEl = document.getElementById('explanation-text');
const interactionArea = document.getElementById('interaction-area');

// Initialize everything
init();

function init() {
    initScene();
    initAnimations();
    initUI();
    
    // Start with the first verse
    loadVerse(0);
    
    // Start render loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function initScene() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.colorScheme.background);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        config.cameraFOV, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = config.cameraDistance;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Post-processing
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, 0.4, 0.85
    );
    
    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add CSS2D renderer for labels
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById('scene-container').appendChild(labelRenderer.domElement);
}

function initAnimations() {
    // Define all verse animations
    animations = [
        createVerseOneAnimation,  // Superposition and measurement collapse
        createVerseTwoAnimation,  // Uncertainty principle
        createVerseThreeAnimation, // Vacuum fluctuations
        createVerseFourAnimation,  // Decoherence
        createVerseFiveAnimation,  // Stationary states
        createVerseSixAnimation,   // Virtual particles
        createVerseSevenAnimation, // Pair production
        createVerseEightAnimation, // Quantum field theory
        createVerseNineAnimation,  // Spontaneous decay
        createVerseTenAnimation,   // Creation/annihilation
        createVerseElevenAnimation, // Unitary evolution/collapse
        createVerseTwelveAnimation  // Probabilistic nature
    ];
}

function initUI() {
    // Panel toggle
    panelToggleBtn.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        panelToggleBtn.textContent = panel.classList.contains('collapsed') ? '▶' : '◀';
    });
    
    // Collapsible sections
    explanationHeader.addEventListener('click', () => {
        explanationHeader.classList.toggle('collapsed');
        const isCollapsed = explanationHeader.classList.contains('collapsed');
        explanationHeader.querySelector('.toggle-icon').textContent = isCollapsed ? '►' : '▼';
        explanationContent.style.display = isCollapsed ? 'none' : 'block';
    });
    
    controlsHeader.addEventListener('click', () => {
        controlsHeader.classList.toggle('collapsed');
        const isCollapsed = controlsHeader.classList.contains('collapsed');
        controlsHeader.querySelector('.toggle-icon').textContent = isCollapsed ? '►' : '▼';
        controlsContent.style.display = isCollapsed ? 'none' : 'block';
    });
    
    // Create verse navigation buttons
    for (let i = 0; i < config.verses.length; i++) {
        const button = document.createElement('button');
        button.className = 'verse-button';
        button.textContent = (i + 1).toString();
        button.addEventListener('click', () => {
            loadVerse(i);
        });
        verseNavigation.appendChild(button);
    }
    
    // Set first verse button as active
    verseNavigation.children[0].classList.add('active');
}

function loadVerse(verseIndex) {
    const verseData = config.verses[verseIndex];
    currentVerse = verseIndex;
    
    // Update UI elements
    verseTitleEl.textContent = verseData.title;
    madhyamakaTextEl.textContent = verseData.madhyamaka;
    quantumTextEl.textContent = verseData.quantum;
    explanationTextEl.textContent = verseData.explanation;
    
    // Update verse navigation
    Array.from(verseNavigation.children).forEach((button, i) => {
        button.classList.toggle('active', i === verseIndex);
    });
    
    // Clear current animation
    clearCurrentAnimation();
    
    // Create new animation
    currentAnimation = animations[verseIndex]();
    
    // Update interaction controls
    updateInteractionControls(verseData.controls);
}

function updateInteractionControls(controlsConfig) {
    interactionArea.innerHTML = '';
    
    controlsConfig.forEach(control => {
        if (control.type === 'slider') {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';
            
            const label = document.createElement('label');
            label.textContent = control.label;
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = control.id;
            slider.min = control.min;
            slider.max = control.max;
            slider.step = control.step;
            slider.value = control.default;
            
            slider.addEventListener('input', (e) => {
                if (currentAnimation && currentAnimation[control.id]) {
                    currentAnimation[control.id](parseFloat(e.target.value));
                }
            });
            
            sliderContainer.appendChild(label);
            sliderContainer.appendChild(slider);
            interactionArea.appendChild(sliderContainer);
            
        } else if (control.type === 'button') {
            const button = document.createElement('button');
            button.id = control.id;
            button.textContent = control.label;
            
            button.addEventListener('click', () => {
                if (currentAnimation && currentAnimation[control.id]) {
                    currentAnimation[control.id]();
                }
            });
            
            interactionArea.appendChild(button);
        }
    });
}

function clearCurrentAnimation() {
    if (currentAnimation && currentAnimation.cleanup) {
        currentAnimation.cleanup();
    }
    
    // Clean up the scene
    while(scene.children.length > 0) { 
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    if (labelRenderer) labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    
    if (currentAnimation && currentAnimation.update) {
        currentAnimation.update();
    }
    
    composer.render();
    if (labelRenderer) labelRenderer.render(scene, camera);
}

// Animation Implementations

function createVerseOneAnimation() {
    // Superposition animation with particle oscillating between states
    const group = new THREE.Group();
    scene.add(group);
    
    // Create electron
    const electronGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const electronMaterial = new THREE.MeshStandardMaterial({ 
        color: config.colorScheme.primary,
        emissive: config.colorScheme.primary,
        emissiveIntensity: 0.5
    });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    group.add(electron);
    
    // Create energy levels (orbits)
    const orbitMaterial = new THREE.LineBasicMaterial({ 
        color: config.colorScheme.neutral,
        transparent: true,
        opacity: 0.5
    });
    
    const orbits = [];
    const orbitCount = 3;
    
    for (let i = 0; i < orbitCount; i++) {
        const radius = 0.5 + i * 0.5;
        const orbitGeometry = new THREE.BufferGeometry();
        
        const points = [];
        const segments = 64;
        for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(theta) * radius,
                Math.sin(theta) * radius,
                0
            ));
        }
        
        orbitGeometry.setFromPoints(points);
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        group.add(orbit);
        orbits.push(orbit);
    }
    
    // Probability cloud particles
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 1.5;
        const orbitIndex = Math.floor(Math.random() * orbitCount);
        
        particlePositions[i * 3] = Math.cos(theta) * radius;
        particlePositions[i * 3 + 1] = Math.sin(theta) * radius;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        
        particleSizes[i] = Math.random() * 5 + 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: config.colorScheme.secondary,
        size: 0.03,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Animation variables
    let oscillationSpeed = 1;
    let time = 0;
    let isSuperposition = true;
    let targetOrbit = -1;
    
    // Animation functions
    function update() {
        time += 0.01 * oscillationSpeed * config.animationSpeed;
        
        if (isSuperposition) {
            // Oscillate between orbits in superposition
            const orbitPosition = Math.sin(time) * 1.5;
            const radius = 0.5 + orbitPosition;
            
            electron.position.x = Math.cos(time * 2) * radius;
            electron.position.y = Math.sin(time * 2) * radius;
            
            // Update particle visibilities based on probability
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const radius = Math.sqrt(
                    positions[i * 3] * positions[i * 3] + 
                    positions[i * 3 + 1] * positions[i * 3 + 1]
                );
                
                const probability = Math.exp(-Math.pow(radius - (0.5 + orbitPosition), 2) / 0.3);
                particleSizes[i] = probability * 10;
            }
            
            particles.geometry.attributes.size.needsUpdate = true;
            particles.material.opacity = 0.6;
        } else {
            // Fixed orbit after measurement
            const radius = 0.5 + targetOrbit * 0.5;
            electron.position.x = Math.cos(time * 2) * radius;
            electron.position.y = Math.sin(time * 2) * radius;
            
            // Fade out probability cloud
            particles.material.opacity *= 0.98;
            if (particles.material.opacity < 0.01) {
                particles.material.opacity = 0;
            }
        }
        
        // Rotate the whole group for 3D effect
        group.rotation.y = time * 0.1;
    }
    
    function measureParticle() {
        if (isSuperposition) {
            isSuperposition = false;
            
            // Random collapse to one of the orbits
            targetOrbit = Math.floor(Math.random() * orbitCount);
            
            // Visual effect for collapse
            gsap.to(electron.scale, {
                x: 0.1, y: 0.1, z: 0.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    electronMaterial.color.set(config.colorScheme.accent);
                    electronMaterial.emissive.set(config.colorScheme.accent);
                    
                    // Highlight the chosen orbit
                    orbits.forEach((orbit, i) => {
                        if (i === targetOrbit) {
                            orbit.material.color.set(config.colorScheme.accent);
                            orbit.material.opacity = 1;
                        } else {
                            orbit.material.opacity = 0.2;
                        }
                    });
                }
            });
        } else {
            // Reset to superposition
            isSuperposition = true;
            electronMaterial.color.set(config.colorScheme.primary);
            electronMaterial.emissive.set(config.colorScheme.primary);
            
            orbits.forEach(orbit => {
                orbit.material.color.set(config.colorScheme.neutral);
                orbit.material.opacity = 0.5;
            });
        }
    }
    
    return {
        update,
        "oscillation-speed": function(value) {
            oscillationSpeed = value;
        },
        "measure-particle": measureParticle,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            orbits.forEach(orbit => orbit.geometry.dispose());
            electronGeometry.dispose();
            electronMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            orbitMaterial.dispose();
        }
    };
}

function createVerseTwoAnimation() {
    // Uncertainty principle animation with wave packet
    const group = new THREE.Group();
    scene.add(group);
    
    // Create coordinate system
    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.material.opacity = 0.5;
    axesHelper.material.transparent = true;
    group.add(axesHelper);
    
    // Labels for axes
    const positionLabel = createTextLabel("Position", new THREE.Vector3(2.2, 0, 0));
    const momentumLabel = createTextLabel("Momentum", new THREE.Vector3(0, 2.2, 0));
    group.add(positionLabel);
    group.add(momentumLabel);
    
    // Create wave packet in position space
    const positionWaveGeometry = new THREE.BufferGeometry();
    const momentumWaveGeometry = new THREE.BufferGeometry();
    
    const linePoints = 200;
    const positionVertices = new Float32Array(linePoints * 3);
    const momentumVertices = new Float32Array(linePoints * 3);
    
    positionWaveGeometry.setAttribute('position', new THREE.BufferAttribute(positionVertices, 3));
    momentumWaveGeometry.setAttribute('position', new THREE.BufferAttribute(momentumVertices, 3));
    
    const positionWaveMaterial = new THREE.LineBasicMaterial({ 
        color: config.colorScheme.primary,
        transparent: true,
        opacity: 0.8
    });
    
    const momentumWaveMaterial = new THREE.LineBasicMaterial({ 
        color: config.colorScheme.secondary,
        transparent: true,
        opacity: 0.8
    });
    
    const positionWave = new THREE.Line(positionWaveGeometry, positionWaveMaterial);
    const momentumWave = new THREE.Line(momentumWaveGeometry, momentumWaveMaterial);
    
    // Position the waves with offset
    positionWave.position.y = 1;
    momentumWave.position.x = 1;
    momentumWave.rotation.z = Math.PI / 2;
    
    group.add(positionWave);
    group.add(momentumWave);
    
    // Create uncertainty rectangles
    const positionUncertaintyMaterial = new THREE.MeshBasicMaterial({
        color: config.colorScheme.primary,
        transparent: true,
        opacity: 0.2
    });
    
    const momentumUncertaintyMaterial = new THREE.MeshBasicMaterial({
        color: config.colorScheme.secondary,
        transparent: true,
        opacity: 0.2
    });
    
    const positionUncertaintyGeometry = new THREE.PlaneGeometry(1, 1);
    const momentumUncertaintyGeometry = new THREE.PlaneGeometry(1, 1);
    
    const positionUncertainty = new THREE.Mesh(positionUncertaintyGeometry, positionUncertaintyMaterial);
    const momentumUncertainty = new THREE.Mesh(momentumUncertaintyGeometry, momentumUncertaintyMaterial);
    
    positionUncertainty.position.y = 1;
    momentumUncertainty.position.x = 1;
    momentumUncertainty.rotation.z = Math.PI / 2;
    
    group.add(positionUncertainty);
    group.add(momentumUncertainty);
    
    // Uncertainty product indicator
    const productIndicator = createTextLabel("Uncertainty Product: ℏ/2", new THREE.Vector3(0, -1, 0));
    group.add(productIndicator);
    
    // Parameters
    let positionCertainty = 0.5;
    let momentumCertainty = 0.5;
    let time = 0;
    
    function updateWaveFunction() {
        // Position space wave function (Gaussian)
        const positionWidth = 0.1 + (1 - positionCertainty) * 1.9;
        
        for (let i = 0; i < linePoints; i++) {
            const x = (i / linePoints) * 4 - 2;
            const amplitude = Math.exp(-Math.pow(x, 2) / (2 * positionWidth * positionWidth));
            
            positionVertices[i * 3] = x;
            positionVertices[i * 3 + 1] = amplitude * 0.8;
            positionVertices[i * 3 + 2] = 0;
        }
        
        // Momentum space wave function (Fourier transform of Gaussian is Gaussian)
        const momentumWidth = 0.1 + (1 - momentumCertainty) * 1.9;
        
        for (let i = 0; i < linePoints; i++) {
            const k = (i / linePoints) * 4 - 2;
            const amplitude = Math.exp(-Math.pow(k, 2) / (2 * momentumWidth * momentumWidth));
            
            momentumVertices[i * 3] = k;
            momentumVertices[i * 3 + 1] = amplitude * 0.8;
            momentumVertices[i * 3 + 2] = 0;
        }
        
        // Update geometries
        positionWaveGeometry.attributes.position.needsUpdate = true;
        momentumWaveGeometry.attributes.position.needsUpdate = true;
        
        // Update uncertainty rectangles
        positionUncertainty.scale.set(positionWidth * 2, 0.8, 1);
        momentumUncertainty.scale.set(momentumWidth * 2, 0.8, 1);
        
        // Update product indicator
        const uncertaintyProduct = positionWidth * momentumWidth;
        const normalizedProduct = Math.abs(1 - uncertaintyProduct) < 0.1 ? "≈ ℏ/2 (Minimal)" : uncertaintyProduct < 1 ? "< ℏ/2 (Impossible)" : "> ℏ/2";
        productIndicator.element.textContent = `Uncertainty Product: ${uncertaintyProduct.toFixed(2)} ${normalizedProduct}`;
        
        // Color based on whether it satisfies uncertainty principle
        if (Math.abs(1 - uncertaintyProduct) < 0.1) {
            productIndicator.element.style.color = "#00ff00";
        } else if (uncertaintyProduct < 1) {
            productIndicator.element.style.color = "#ff0000";
        } else {
            productIndicator.element.style.color = "#ffffff";
        }
    }
    
    // Helper function to create text labels
    function createTextLabel(text, position) {
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;
        div.style.color = 'white';
        div.style.fontSize = '12px';
        
        const label = new CSS2DObject(div);
        label.position.copy(position);
        
        return label;
    }
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Update wave functions based on current certainties
        updateWaveFunction();
        
        // Enforce uncertainty principle
        const uncertaintyProduct = (0.1 + (1 - positionCertainty) * 1.9) * (0.1 + (1 - momentumCertainty) * 1.9);
        
        if (uncertaintyProduct < 1) {
            // Automatically adjust momentum certainty to respect uncertainty principle
            const requiredMomentumWidth = 1 / (0.1 + (1 - positionCertainty) * 1.9);
            momentumCertainty = 1 - ((requiredMomentumWidth - 0.1) / 1.9);
            momentumCertainty = Math.max(0, Math.min(1, momentumCertainty));
            
            // Update the momentum slider in the UI
            const momentumSlider = document.getElementById('momentum-certainty');
            if (momentumSlider) {
                momentumSlider.value = momentumCertainty;
            }
        }
        
        // Rotate for 3D effect
        group.rotation.y = Math.sin(time * 0.2) * 0.3;
    }
    
    return {
        update,
        "position-certainty": function(value) {
            positionCertainty = value;
        },
        "momentum-certainty": function(value) {
            momentumCertainty = value;
        },
        cleanup: function() {
            group.clear();
            scene.remove(group);
            positionWaveGeometry.dispose();
            momentumWaveGeometry.dispose();
            positionWaveMaterial.dispose();
            momentumWaveMaterial.dispose();
            positionUncertaintyGeometry.dispose();
            momentumUncertaintyGeometry.dispose();
            positionUncertaintyMaterial.dispose();
            momentumUncertaintyMaterial.dispose();
        }
    };
}

function createVerseThreeAnimation() {
    // Vacuum fluctuations animation
    const group = new THREE.Group();
    scene.add(group);
    
    // Create void/vacuum
    const vacuumGeometry = new THREE.SphereGeometry(5, 32, 32);
    const vacuumMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
    group.add(vacuum);
    
    // Particles for fluctuations
    const particleCount = config.particleCount;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    const particleLifetimes = new Float32Array(particleCount);
    
    // Initialize particles in inactive state
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = 0;
        particlePositions[i * 3 + 1] = 0;
        particlePositions[i * 3 + 2] = 0;
        
        particleSizes[i] = 0;
        
        // Color: blue for electron-like, red for positron-like
        const isElectron = Math.random() > 0.5;
        particleColors[i * 3] = isElectron ? 0.2 : 1.0;     // R
        particleColors[i * 3 + 1] = 0.2;                   // G
        particleColors[i * 3 + 2] = isElectron ? 1.0 : 0.2; // B
        
        particleLifetimes[i] = 0;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    // Particle shader material with custom attributes
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Particle pairs (connecting lines)
    const pairGeometry = new THREE.BufferGeometry();
    const pairPositions = new Float32Array(particleCount * 3); // Just allocate, will update
    pairGeometry.setAttribute('position', new THREE.BufferAttribute(pairPositions, 3));
    
    const pairMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const pairs = new THREE.LineSegments(pairGeometry, pairMaterial);
    group.add(pairs);
    
    // Animation parameters
    let vacuumEnergy = 1.0;
    let time = 0;
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Update particle lifetimes and create new ones
        const energyFactor = vacuumEnergy * 0.01;
        const creationChance = energyFactor;
        
        for (let i = 0; i < particleCount; i += 2) {
            // Update existing particles
            if (particleLifetimes[i] > 0) {
                particleLifetimes[i] -= 0.01;
                particleLifetimes[i+1] -= 0.01;
                
                // Fade out at end of lifetime
                if (particleLifetimes[i] < 0.2) {
                    particleSizes[i] = particleLifetimes[i] * 5;
                    particleSizes[i+1] = particleLifetimes[i] * 5;
                }
                
                // Move particles away from each other
                const dx = particlePositions[i * 3] - particlePositions[(i+1) * 3];
                const dy = particlePositions[i * 3 + 1] - particlePositions[(i+1) * 3 + 1];
                const dz = particlePositions[i * 3 + 2] - particlePositions[(i+1) * 3 + 2];
                
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const speed = 0.01 * (1 - particleLifetimes[i]);
                
                if (dist > 0) {
                    particlePositions[i * 3] += dx/dist * speed;
                    particlePositions[i * 3 + 1] += dy/dist * speed;
                    particlePositions[i * 3 + 2] += dz/dist * speed;
                    
                    particlePositions[(i+1) * 3] -= dx/dist * speed;
                    particlePositions[(i+1) * 3 + 1] -= dy/dist * speed;
                    particlePositions[(i+1) * 3 + 2] -= dz/dist * speed;
                }
                
            } else if (Math.random() < creationChance) {
                // Create new particle pair
                const radius = Math.random() * 3;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);
                
                // Particle 1
                particlePositions[i * 3] = x;
                particlePositions[i * 3 + 1] = y;
                particlePositions[i * 3 + 2] = z;
                
                // Particle 2 (very close)
                particlePositions[(i+1) * 3] = x + (Math.random() - 0.5) * 0.05;
                particlePositions[(i+1) * 3 + 1] = y + (Math.random() - 0.5) * 0.05;
                particlePositions[(i+1) * 3 + 2] = z + (Math.random() - 0.5) * 0.05;
                
                particleSizes[i] = 1.0;
                particleSizes[i+1] = 1.0;
                
                particleLifetimes[i] = 0.5 + Math.random() * 0.5;
                particleLifetimes[i+1] = particleLifetimes[i];
                
                // Effects for new particles
                gsap.from([
                    {target: particleSizes, property: i, startValue: 5}, 
                    {target: particleSizes, property: i+1, startValue: 5}
                ], {
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            // Update pair lines
            if (particleLifetimes[i] > 0) {
                pairPositions[i * 3] = particlePositions[i * 3];
                pairPositions[i * 3 + 1] = particlePositions[i * 3 + 1];
                pairPositions[i * 3 + 2] = particlePositions[i * 3 + 2];
                
                pairPositions[(i+1) * 3] = particlePositions[(i+1) * 3];
                pairPositions[(i+1) * 3 + 1] = particlePositions[(i+1) * 3 + 1];
                pairPositions[(i+1) * 3 + 2] = particlePositions[(i+1) * 3 + 2];
            } else {
                pairPositions[i * 3] = 0;
                pairPositions[i * 3 + 1] = 0;
                pairPositions[i * 3 + 2] = 0;
                
                pairPositions[(i+1) * 3] = 0;
                pairPositions[(i+1) * 3 + 1] = 0;
                pairPositions[(i+1) * 3 + 2] = 0;
            }
        }
        
        // Update buffers
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;
        pairs.geometry.attributes.position.needsUpdate = true;
        
        // Rotate for 3D effect
        group.rotation.y = time * 0.1;
        group.rotation.x = Math.sin(time * 0.05) * 0.2;
    }
    
    function clearParticles() {
        for (let i = 0; i < particleCount; i++) {
            particleSizes[i] = 0;
            particleLifetimes[i] = 0;
        }
        particles.geometry.attributes.size.needsUpdate = true;
    }
    
    return {
        update,
        "vacuum-energy": function(value) {
            vacuumEnergy = value;
        },
        "clear-particles": clearParticles,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            vacuumGeometry.dispose();
            vacuumMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            pairGeometry.dispose();
            pairMaterial.dispose();
        }
    };
}

function createVerseFourAnimation() {
    // Decoherence animation - quantum system losing coherence on interaction
    const group = new THREE.Group();
    scene.add(group);
    
    // Create central qubit
    const qubitGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const qubitMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.primary,
        emissive: config.colorScheme.primary,
        emissiveIntensity: 0.5
    });
    const qubit = new THREE.Mesh(qubitGeometry, qubitMaterial);
    group.add(qubit);
    
    // Bloch sphere (representation of qubit state)
    const blochSphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const blochSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const blochSphere = new THREE.Mesh(blochSphereGeometry, blochSphereMaterial);
    group.add(blochSphere);
    
    // State vector
    const arrowGeometry = new THREE.CylinderGeometry(0, 0.1, 0.2, 12);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: config.colorScheme.accent });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.y = 0.8; // Start at north pole
    arrow.rotation.x = Math.PI; // Point outward
    group.add(arrow);
    
    // Lines connecting the arrow to center
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = new Float32Array(6); // 2 points * 3 coordinates
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.accent,
        transparent: true,
        opacity: 0.6
    });
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);
    
    // Environment particles (causing decoherence)
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    // Initialize particles in random positions outside the qubit
    for (let i = 0; i < particleCount; i++) {
        const radius = 2 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        
        particleSizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: config.colorScheme.neutral,
        size: 0.1,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Parameters
    let interactionStrength = 0.2;
    let isInteracting = false;
    let coherence = 1.0; // 1.0 = fully coherent, 0.0 = fully decohered
    let stateTheta = 0;
    let statePhi = 0;
    let time = 0;
    
    function updateStateVector() {
        // Update state vector position (on Bloch sphere)
        const radius = 0.8;
        
        // Compute state vector coordinates
        const x = radius * Math.sin(stateTheta) * Math.cos(statePhi);
        const y = radius * Math.cos(stateTheta);
        const z = radius * Math.sin(stateTheta) * Math.sin(statePhi);
        
        // Update arrow position
        arrow.position.set(x, y, z);
        
        // Make arrow point outward from center
        arrow.lookAt(x * 2, y * 2, z * 2);
        
        // Update line connecting center to arrow
        lineVertices[0] = 0;
        lineVertices[1] = 0;
        lineVertices[2] = 0;
        lineVertices[3] = x;
        lineVertices[4] = y;
        lineVertices[5] = z;
        
        line.geometry.attributes.position.needsUpdate = true;
        
        // Update colors based on coherence
        const coherenceColor = new THREE.Color().setHSL(
            0.6, // Blue hue
            coherence, // Saturation based on coherence
            0.5 // Lightness
        );
        
        qubitMaterial.color.copy(coherenceColor);
        qubitMaterial.emissive.copy(coherenceColor);
        arrow.material.color.copy(coherenceColor);
        line.material.color.copy(coherenceColor);
        
        // Update opacity based on coherence
        line.material.opacity = coherence * 0.8;
        blochSphere.material.opacity = coherence * 0.2;
    }
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Evolve quantum state (precess around the Bloch sphere)
        statePhi += 0.02 * config.animationSpeed * (1 - 0.8 * (1 - coherence));
        
        // If interacting, reduce coherence
        if (isInteracting) {
            coherence = Math.max(0, coherence - 0.01 * interactionStrength * config.animationSpeed);
            
            // Make particles move toward the qubit
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const x = positions[i * 3];
                const y = positions[i * 3 + 1];
                const z = positions[i * 3 + 2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                if (dist > 0.3) {
                    // Move toward qubit
                    positions[i * 3] -= x / dist * 0.03 * interactionStrength;
                    positions[i * 3 + 1] -= y / dist * 0.03 * interactionStrength;
                    positions[i * 3 + 2] -= z / dist * 0.03 * interactionStrength;
                } else {
                    // Respawn outside
                    const radius = 5;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    
                    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[i * 3 + 2] = radius * Math.cos(phi);
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            
            // Visual effects for decoherence
            if (coherence < 0.5 && Math.random() < 0.1) {
                gsap.to(qubit.scale, {
                    x: 0.8 + Math.random() * 0.4,
                    y: 0.8 + Math.random() * 0.4,
                    z: 0.8 + Math.random() * 0.4,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
        
        // Update state vector
        updateStateVector();
        
        // Apply noise to state based on decoherence level
        if (coherence < 1) {
            const noiseAmount = (1 - coherence) * 0.1;
            stateTheta += (Math.random() - 0.5) * noiseAmount;
            statePhi += (Math.random() - 0.5) * noiseAmount;
        }
        
        // Rotate for 3D effect
        group.rotation.y = time * 0.1;
    }
    
    function interactSystem() {
        isInteracting = !isInteracting;
        
        // Visual feedback
        if (isInteracting) {
            gsap.to(particleMaterial, {
                opacity: 1,
                color: config.colorScheme.accent,
                duration: 0.5
            });
            
            // Update button text
            const button = document.getElementById('interact-system');
            if (button) {
                button.textContent = 'Stop Interaction';
            }
        } else {
            gsap.to(particleMaterial, {
                opacity: 0.7,
                color: config.colorScheme.neutral,
                duration: 0.5
            });
            
            // Update button text
            const button = document.getElementById('interact-system');
            if (button) {
                button.textContent = 'Interact with System';
            }
        }
    }
    
    return {
        update,
        "interaction-strength": function(value) {
            interactionStrength = value;
        },
        "interact-system": interactSystem,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            qubitGeometry.dispose();
            qubitMaterial.dispose();
            blochSphereGeometry.dispose();
            blochSphereMaterial.dispose();
            arrowGeometry.dispose();
            arrowMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
        }
    };
}

function createVerseFiveAnimation() {
    // Stationary states animation
    const group = new THREE.Group();
    scene.add(group);
    
    // Create atom nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.accent,
        emissive: config.colorScheme.accent,
        emissiveIntensity: 0.5
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    group.add(nucleus);
    
    // Create electron orbits
    const orbitCount = 3;
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.neutral,
        transparent: true,
        opacity: 0.3
    });
    
    const orbits = [];
    
    for (let i = 0; i < orbitCount; i++) {
        const radius = 0.7 + i * 0.5;
        const orbitGeometry = new THREE.BufferGeometry();
        
        const points = [];
        const segments = 64;
        for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(theta) * radius,
                Math.sin(theta) * radius,
                0
            ));
        }
        
        orbitGeometry.setFromPoints(points);
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial.clone());
        orbit.rotation.x = Math.PI / 2; // Rotate to horizontal
        group.add(orbit);
        orbits.push({
            line: orbit,
            radius: radius
        });
    }
    
    // Create electron
    const electronGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.primary,
        emissive: config.colorScheme.primary,
        emissiveIntensity: 0.5
    });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    group.add(electron);
    
    // Wave function visualization (a cloud around the electron)
    const waveGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const waveMaterial = new THREE.MeshPhongMaterial({ // Changed to Phong
        color: config.colorScheme.primary,
        transparent: true,
        opacity: 0.3
    });
    const waveFunction = new THREE.Mesh(waveGeometry, waveMaterial);
    electron.add(waveFunction); // Attach to electron
    
    // Energy level indicator
    const energyIndicatorGeometry = new THREE.PlaneGeometry(0.2, 3);
    const energyIndicatorMaterial = new THREE.MeshPhongMaterial({ // Changed to Phong
        color: config.colorScheme.primary,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const energyIndicator = new THREE.Mesh(energyIndicatorGeometry, energyIndicatorMaterial);
    energyIndicator.position.x = -2;
    energyIndicator.position.y = 0; // Will be updated
    group.add(energyIndicator);
    
    // Energy level marker
    const markerGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.05);
    const markerMaterial = new THREE.MeshPhongMaterial({ // Changed to Phong
        color: config.colorScheme.accent
    });
    const energyMarker = new THREE.Mesh(markerGeometry, markerMaterial);
    energyMarker.position.x = -2;
    group.add(energyMarker);
    
    // Parameters
    let currentOrbit = 1; // Start in middle orbit
    let electronAngle = 0;
    let stabilityLevel = 0.9;
    let energyLevel = 0;
    let isPerturbed = false;
    let perturbTime = 0;
    let transitionProgress = 0;
    let time = 0;
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        if (isPerturbed) {
            perturbTime += 0.02 * config.animationSpeed;
            
            // Handle transition between energy levels
            if (perturbTime < 1) {
                // During perturbation, electron oscillates and wave function grows
                const noise = 0.3 * Math.sin(perturbTime * 20);
                
                const targetRadius = orbits[currentOrbit].radius;
                electronAngle += (0.05 * config.animationSpeed) * (1 + noise);
                
                const radius = targetRadius * (1 + noise * 0.2);
                electron.position.x = Math.cos(electronAngle) * radius;
                electron.position.z = Math.sin(electronAngle) * radius;
                
                // Wave function grows
                waveFunction.scale.set(
                    1 + perturbTime * 2,
                    1 + perturbTime * 2,
                    1 + perturbTime * 2
                );
                
                waveFunction.material.opacity = 0.3 + perturbTime * 0.4;
                
            } else if (perturbTime < 2) {
                // During transition
                transitionProgress = (perturbTime - 1);
                
                // Decide new orbit: choose randomly but make it more likely to transition to
                // adjacent orbits, and more likely to go down than up
                if (transitionProgress < 0.1) {
                    let newOrbit;
                    
                    // Only choose once at the start of transition
                    if (transitionProgress === 0) {
                        const rand = Math.random();
                        
                        if (currentOrbit === 0) {
                            // From ground state, can only go up
                            newOrbit = 1;
                        } else if (currentOrbit === orbitCount - 1) {
                            // From highest state, can only go down
                            newOrbit = orbitCount - 2;
                        } else {
                            // From middle states, can go up or down
                            newOrbit = rand < 0.7 ? currentOrbit - 1 : currentOrbit + 1;
                        }
                        
                        // Update current orbit
                        currentOrbit = newOrbit;
                    }
                    
                    // Flash effect for transition
                    electronMaterial.emissiveIntensity = 2;
                    gsap.to(electronMaterial, {
                        emissiveIntensity: 0.5,
                        duration: 0.5
                    });
                }
                
                // Interpolate between orbits during transition
                const prevRadius = orbits[currentOrbit].radius;
                
                electronAngle += 0.1 * config.animationSpeed;
                electron.position.x = Math.cos(electronAngle) * prevRadius;
                electron.position.z = Math.sin(electronAngle) * prevRadius;
                
                // Shrink wave function back
                waveFunction.scale.set(
                    3 - transitionProgress * 2,
                    3 - transitionProgress * 2,
                    3 - transitionProgress * 2
                );
                
                waveFunction.material.opacity = 0.7 - transitionProgress * 0.4;
                
            } else {
                // Done with transition
                isPerturbed = false;
                perturbTime = 0;
                transitionProgress = 0;
                
                // Reset wave function
                waveFunction.scale.set(1, 1, 1);
                waveFunction.material.opacity = 0.3;
                
                // Highlight the current orbit
                orbits.forEach((orbit, i) => {
                    orbit.line.material.opacity = i === currentOrbit ? 0.8 : 0.3;
                    orbit.line.material.color.set(
                        i === currentOrbit ? config.colorScheme.primary : config.colorScheme.neutral
                    );
                });
            }
            
        } else {
            // Stable orbit - moving at constant speed
            electronAngle += 0.05 * config.animationSpeed;
            
            const radius = orbits[currentOrbit].radius;
            electron.position.x = Math.cos(electronAngle) * radius;
            electron.position.z = Math.sin(electronAngle) * radius;
            
            // Check if stable enough to avoid spontaneous transitions
            if (Math.random() < 0.001 * (1 - stabilityLevel) * config.animationSpeed) {
                // Spontaneous transition
                perturbSystem();
            }
        }
        
        // Update energy level indicator
        energyLevel = currentOrbit * 1.5;
        energyMarker.position.y = -energyLevel + 1.5;
        
        // Rotate for 3D effect
        group.rotation.y = Math.sin(time * 0.2) * 0.3;
    }
    
    function perturbSystem() {
        if (!isPerturbed) {
            isPerturbed = true;
            perturbTime = 0;
            
            // Visual feedback
            gsap.to(nucleus.scale, {
                x: 1.5, y: 1.5, z: 1.5,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            
            // Nucleus pulse when perturbed
            const pulseGeometry = new THREE.SphereGeometry(0.3, 32, 32);
            const pulseMaterial = new THREE.MeshBasicMaterial({
                color: config.colorScheme.accent,
                transparent: true,
                opacity: 0.7
            });
            const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
            pulse.position.copy(nucleus.position);
            group.add(pulse);
            
            gsap.to(pulse.scale, {
                x: 5, y: 5, z: 5,
                duration: 1,
                ease: "power1.out"
            });
            
            gsap.to(pulseMaterial, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    group.remove(pulse);
                    pulse.geometry.dispose();
                    pulse.material.dispose();
                }
            });
        }
    }
    
    return {
        update,
        "stability-level": function(value) {
            stabilityLevel = value;
        },
        "perturb-system": perturbSystem,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            nucleusGeometry.dispose();
            nucleusMaterial.dispose();
            electronGeometry.dispose();
            electronMaterial.dispose();
            waveGeometry.dispose();
            waveMaterial.dispose();
            energyIndicatorGeometry.dispose();
            energyIndicatorMaterial.dispose();
            markerGeometry.dispose();
            markerMaterial.dispose();
            
            orbits.forEach(orbit => {
                orbit.line.geometry.dispose();
                orbit.line.material.dispose();
            });
        }
    };
}

function createVerseSixAnimation() {
    // Virtual particles animation: electron interaction via virtual photon
    const group = new THREE.Group();
    scene.add(group);
    
    // Create electrons
    const electronGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.primary,
        emissive: config.colorScheme.primary,
        emissiveIntensity: 0.5
    });
    
    const electron1 = new THREE.Mesh(electronGeometry, electronMaterial.clone());
    const electron2 = new THREE.Mesh(electronGeometry, electronMaterial.clone());
    
    electron1.position.x = -1.5;
    electron2.position.x = 1.5;
    
    group.add(electron1);
    group.add(electron2);
    
    // Create electric field lines
    const fieldLineCount = 20;
    const fieldLines = [];
    
    const fieldLineMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.secondary,
        transparent: true,
        opacity: 0.3
    });
    
    for (let i = 0; i < fieldLineCount; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePoints = [];
        
        // Start from electron1, curve toward electron2
        const angle = (i / fieldLineCount) * Math.PI * 2;
        const startRadius = 0.4;
        const startX = electron1.position.x + Math.cos(angle) * startRadius;
        const startY = Math.sin(angle) * startRadius;
        
        linePoints.push(new THREE.Vector3(startX, startY, 0));
        
        // Add curve points
        const segments = 10;
        for (let j = 1; j < segments; j++) {
            const t = j / segments;
            const curveX = electron1.position.x * (1 - t) + electron2.position.x * t;
            
            // Curve height affected by virtual intensity
            const curveY = Math.sin(Math.PI * t) * (0.5 + Math.sin(angle) * 0.5);
            
            linePoints.push(new THREE.Vector3(curveX, curveY, 0));
        }
        
        // End at electron2
        const endX = electron2.position.x + Math.cos(angle + Math.PI) * startRadius;
        const endY = Math.sin(angle + Math.PI) * startRadius;
        linePoints.push(new THREE.Vector3(endX, endY, 0));
        
        lineGeometry.setFromPoints(linePoints);
        
        const line = new THREE.Line(lineGeometry, fieldLineMaterial.clone());
        line.material.opacity = 0.1 + Math.random() * 0.2;
        group.add(line);
        fieldLines.push({
            line: line,
            points: linePoints,
            angle: angle
        });
    }
    
    // Virtual photon
    const photonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const photonMaterial = new THREE.MeshBasicMaterial({
        color: config.colorScheme.accent,
        transparent: true,
        opacity: 0.8
    });
    const photon = new THREE.Mesh(photonGeometry, photonMaterial);
    photon.position.set(electron1.position.x, 0, 0);
    photon.visible = false;
    group.add(photon);
    
    // Photon trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(100 * 3); // 100 points
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    const trailMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.accent,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    trail.visible = false;
    group.add(trail);
    
    // Parameters
    let virtualIntensity = 0.5;
    let photonExchangeActive = false;
    let photonProgress = 0;
    let repulsionForce = 0;
    let time = 0;
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Update field lines based on virtual intensity
        fieldLines.forEach((fieldLine, i) => {
            const linePoints = [];
            const angle = fieldLine.angle;
            
            // Start from electron1, curve toward electron2
            const startRadius = 0.4;
            const startX = electron1.position.x + Math.cos(angle) * startRadius;
            const startY = Math.sin(angle) * startRadius;
            
            linePoints.push(new THREE.Vector3(startX, startY, 0));
            
            // Add curve points
            const segments = 10;
            for (let j = 1; j < segments; j++) {
                const t = j / segments;
                const curveX = electron1.position.x * (1 - t) + electron2.position.x * t;
                
                // Curve height affected by virtual intensity
                const curveY = Math.sin(Math.PI * t) * (virtualIntensity + Math.sin(angle + time) * 0.2);
                
                linePoints.push(new THREE.Vector3(curveX, curveY, 0));
            }
            
            // End at electron2
            const endX = electron2.position.x + Math.cos(angle + Math.PI) * startRadius;
            const endY = Math.sin(angle + Math.PI) * startRadius;
            linePoints.push(new THREE.Vector3(endX, endY, 0));
            
            // Update line geometry
            fieldLine.line.geometry.setFromPoints(linePoints);
            
            // Update opacity based on intensity
            fieldLine.line.material.opacity = 0.1 + virtualIntensity * 0.5 + Math.sin(time * 2 + i) * 0.1;
        });
        
        // Handle photon exchange
        if (photonExchangeActive) {
            photonProgress += 0.02 * config.animationSpeed;
            
            if (photonProgress <= 1) {
                // Photon moving from electron1 to electron2
                const t = photonProgress;
                
                // Curve from electron1 to electron2
                const x = electron1.position.x * (1 - t) + electron2.position.x * t;
                const y = Math.sin(Math.PI * t) * virtualIntensity * 1.5;
                
                photon.position.set(x, y, 0);
                
                // Update trail
                const positions = trail.geometry.attributes.position.array;
                
                // Shift all positions forward
                for (let i = 99; i > 0; i--) {
                    positions[i * 3] = positions[(i - 1) * 3];
                    positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                    positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
                }
                
                // Add new position
                positions[0] = x;
                positions[1] = y;
                positions[2] = 0;
                
                trail.geometry.attributes.position.needsUpdate = true;
            } else {
                // Done with exchange
                photonExchangeActive = false;
                photon.visible = false;
                trail.visible = false;
                
                // Apply repulsion effect
                repulsionForce = 0.5;
                
                // Visual feedback
                gsap.to(electron2.scale, {
                    x: 1.5, y: 1.5, z: 1.5,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
        
        // Apply repulsion force
        if (repulsionForce > 0) {
            electron2.position.x += 0.01 * repulsionForce;
            repulsionForce *= 0.95; // Decay
            
            if (repulsionForce < 0.01) {
                repulsionForce = 0;
                
                // Reset electron position gradually
                gsap.to(electron2.position, {
                    x: 1.5,
                    duration: 1,
                    ease: "power2.out"
                });
            }
        }
        
        // Rotate for 3D effect
        group.rotation.y = Math.sin(time * 0.3) * 0.3;
    }
    
    function exchangePhoton() {
        if (!photonExchangeActive) {
            photonExchangeActive = true;
            photonProgress = 0;
            
            // Reset photon position to electron1
            photon.position.copy(electron1.position);
            photon.visible = true;
            
            // Reset trail
            const positions = trail.geometry.attributes.position.array;
            for (let i = 0; i < 100; i++) {
                positions[i * 3] = electron1.position.x;
                positions[i * 3 + 1] = electron1.position.y;
                positions[i * 3 + 2] = electron1.position.z;
            }
            trail.geometry.attributes.position.needsUpdate = true;
            trail.visible = true;
            
            // Visual feedback
            gsap.to(electron1.scale, {
                x: 1.5, y: 1.5, z: 1.5,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
    }
    
    return {
        update,
        "virtual-intensity": function(value) {
            virtualIntensity = value;
        },
        "exchange-photon": exchangePhoton,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            electronGeometry.dispose();
            electronMaterial.dispose();
            photonGeometry.dispose();
            photonMaterial.dispose();
            trailGeometry.dispose();
            trailMaterial.dispose();
            
            fieldLines.forEach(fieldLine => {
                fieldLine.line.geometry.dispose();
                fieldLine.line.material.dispose();
            });
        }
    };
}

function createVerseSevenAnimation() {
    // Pair production animation: photon splitting into electron-positron pair
    const group = new THREE.Group();
    scene.add(group);
    
    // Create photon
    const photonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const photonMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.accent,
        emissive: config.colorScheme.accent,
        emissiveIntensity: 0.8
    });
    const photon = new THREE.Mesh(photonGeometry, photonMaterial);
    group.add(photon);
    
    // Photon trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(50 * 3); // 50 points
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    const trailMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.accent,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    group.add(trail);
    
    // Electron and positron (initially invisible)
    const particleGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.primary,
        emissive: config.colorScheme.primary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    const positronMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.secondary,
        emissive: config.colorScheme.secondary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    const electron = new THREE.Mesh(particleGeometry, electronMaterial);
    const positron = new THREE.Mesh(particleGeometry, positronMaterial);
    
    group.add(electron);
    group.add(positron);
    
    // Particle trails
    const electronTrailGeometry = new THREE.BufferGeometry();
    const positronTrailGeometry = new THREE.BufferGeometry();
    
    const electronTrailPositions = new Float32Array(50 * 3);
    const positronTrailPositions = new Float32Array(50 * 3);
    
    electronTrailGeometry.setAttribute('position', new THREE.BufferAttribute(electronTrailPositions, 3));
    positronTrailGeometry.setAttribute('position', new THREE.BufferAttribute(positronTrailPositions, 3));
    
    const electronTrailMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.primary,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    
    const positronTrailMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.secondary,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    
    const electronTrail = new THREE.Line(electronTrailGeometry, electronTrailMaterial);
    const positronTrail = new THREE.Line(positronTrailGeometry, positronTrailMaterial);
    
    group.add(electronTrail);
    group.add(positronTrail);
    
    // Add environment (quantum vacuum)
    const vacuumGeometry = new THREE.SphereGeometry(5, 32, 32);
    const vacuumMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        wireframe: true
    });
    const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
    group.add(vacuum);
    
    // Parameters
    let photonEnergy = 1.0;
    let isSplitting = false;
    let splitProgress = 0;
    let particleDistance = 0;
    let time = 0;
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        if (!isSplitting) {
            // Photon moving
            photon.position.x = Math.sin(time) * 1.5;
            photon.position.y = Math.cos(time * 0.7) * 0.5;
            
            // Size based on energy
            photon.scale.set(photonEnergy, photonEnergy, photonEnergy);
            
            // Update trail
            const positions = trail.geometry.attributes.position.array;
            
            // Shift all positions forward
            for (let i = 49; i > 0; i--) {
                positions[i * 3] = positions[(i - 1) * 3];
                positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
            }
            
            // Add new position
            positions[0] = photon.position.x;
            positions[1] = photon.position.y;
            positions[2] = photon.position.z;
            
            trail.geometry.attributes.position.needsUpdate = true;
        } else {
            // Photon splitting animation
            splitProgress += 0.01 * config.animationSpeed;
            
            if (splitProgress < 1) {
                // Photon fading out
                photonMaterial.opacity = 1 - splitProgress;
                
                // Particles fading in
                electronMaterial.opacity = splitProgress;
                positronMaterial.opacity = splitProgress;
                
                // Trails fading in
                electronTrailMaterial.opacity = splitProgress * 0.5;
                positronTrailMaterial.opacity = splitProgress * 0.5;
                
                // Particles emerging from photon position
                particleDistance = splitProgress * photonEnergy;
                
                electron.position.x = photon.position.x + Math.cos(time * 5) * particleDistance;
                electron.position.y = photon.position.y + Math.sin(time * 5) * particleDistance;
                
                positron.position.x = photon.position.x - Math.cos(time * 5) * particleDistance;
                positron.position.y = photon.position.y - Math.sin(time * 5) * particleDistance;
                
                // Update particle trails
                const ePositions = electronTrail.geometry.attributes.position.array;
                const pPositions = positronTrail.geometry.attributes.position.array;
                
                // Shift all positions forward
                for (let i = 49; i > 0; i--) {
                    ePositions[i * 3] = ePositions[(i - 1) * 3];
                    ePositions[i * 3 + 1] = ePositions[(i - 1) * 3 + 1];
                    ePositions[i * 3 + 2] = ePositions[(i - 1) * 3 + 2];
                    
                    pPositions[i * 3] = pPositions[(i - 1) * 3];
                    pPositions[i * 3 + 1] = pPositions[(i - 1) * 3 + 1];
                    pPositions[i * 3 + 2] = pPositions[(i - 1) * 3 + 2];
                }
                
                // Add new positions
                ePositions[0] = electron.position.x;
                ePositions[1] = electron.position.y;
                ePositions[2] = electron.position.z;
                
                pPositions[0] = positron.position.x;
                pPositions[1] = positron.position.y;
                pPositions[2] = positron.position.z;
                
                electronTrail.geometry.attributes.position.needsUpdate = true;
                positronTrail.geometry.attributes.position.needsUpdate = true;
                
            } else if (splitProgress < 3) {
                // Particles moving away
                photon.visible = false;
                
                particleDistance = photonEnergy * (1 + (splitProgress - 1) * 0.5);
                
                const angle = time * 3;
                electron.position.x = Math.cos(angle) * particleDistance;
                electron.position.y = Math.sin(angle) * particleDistance;
                
                positron.position.x = -Math.cos(angle) * particleDistance;
                positron.position.y = -Math.sin(angle) * particleDistance;
                
                // Update particle trails
                const ePositions = electronTrail.geometry.attributes.position.array;
                const pPositions = positronTrail.geometry.attributes.position.array;
                
                // Shift positions
                for (let i = 49; i > 0; i--) {
                    ePositions[i * 3] = ePositions[(i - 1) * 3];
                    ePositions[i * 3 + 1] = ePositions[(i - 1) * 3 + 1];
                    ePositions[i * 3 + 2] = ePositions[(i - 1) * 3 + 2];
                    
                    pPositions[i * 3] = pPositions[(i - 1) * 3];
                    pPositions[i * 3 + 1] = pPositions[(i - 1) * 3 + 1];
                    pPositions[i * 3 + 2] = pPositions[(i - 1) * 3 + 2];
                }
                
                // Add new positions
                ePositions[0] = electron.position.x;
                ePositions[1] = electron.position.y;
                ePositions[2] = electron.position.z;
                
                pPositions[0] = positron.position.x;
                pPositions[1] = positron.position.y;
                pPositions[2] = positron.position.z;
                
                electronTrail.geometry.attributes.position.needsUpdate = true;
                positronTrail.geometry.attributes.position.needsUpdate = true;
                
            } else {
                // Reset animation
                resetPhoton();
            }
        }
        
        // Rotate for 3D effect
        group.rotation.y = Math.sin(time * 0.2) * 0.3;
    }
    
    function splitPhoton() {
        if (!isSplitting && photonEnergy >= 0.8) {
            isSplitting = true;
            splitProgress = 0;
            
            // Visual feedback
            gsap.to(photon.scale, {
                x: 2, y: 2, z: 2,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            
            // Reset particle positions to photon position
            electron.position.copy(photon.position);
            positron.position.copy(photon.position);
            
            // Reset trails
            const ePositions = electronTrail.geometry.attributes.position.array;
            const pPositions = positronTrail.geometry.attributes.position.array;
            
            for (let i = 0; i < 50; i++) {
                ePositions[i * 3] = photon.position.x;
                ePositions[i * 3 + 1] = photon.position.y;
                ePositions[i * 3 + 2] = photon.position.z;
                
                pPositions[i * 3] = photon.position.x;
                pPositions[i * 3 + 1] = photon.position.y;
                pPositions[i * 3 + 2] = photon.position.z;
            }
            
            electronTrail.geometry.attributes.position.needsUpdate = true;
            positronTrail.geometry.attributes.position.needsUpdate = true;
        } else if (photonEnergy < 0.8) {
            // Visual feedback for insufficient energy
            gsap.to(photon.scale, {
                x: 0.5, y: 0.5, z: 0.5,
                duration: 0.1,
                yoyo: true,
                repeat: 3
            });
        }
    }
    
    function resetPhoton() {
        isSplitting = false;
        photon.visible = true;
        photonMaterial.opacity = 1;
        
        electronMaterial.opacity = 0;
        positronMaterial.opacity = 0;
        electronTrailMaterial.opacity = 0;
        positronTrailMaterial.opacity = 0;
    }
    
    return {
        update,
        "photon-energy": function(value) {
            photonEnergy = value;
            if (!isSplitting) {
                photon.scale.set(value, value, value);
            }
        },
        "split-photon": splitPhoton,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            photonGeometry.dispose();
            photonMaterial.dispose();
            particleGeometry.dispose();
            electronMaterial.dispose();
            positronMaterial.dispose();
            trailGeometry.dispose();
            trailMaterial.dispose();
            electronTrailGeometry.dispose();
            positronTrailGeometry.dispose();
            electronTrailMaterial.dispose();
            positronTrailMaterial.dispose();
            vacuumGeometry.dispose();
            vacuumMaterial.dispose();
        }
    };
}

function createVerseEightAnimation() {
    // Quantum field theory animation
    const group = new THREE.Group();
    scene.add(group);
    
    // Create quantum field as a grid
    const gridSize = 20;
    const gridSpacing = 0.2;
    const fieldGeometry = new THREE.BufferGeometry();
    const fieldPositions = new Float32Array(gridSize * gridSize * 3);
    const fieldColors = new Float32Array(gridSize * gridSize * 3);
    
    // Initialize positions in a grid
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = (i * gridSize + j) * 3;
            fieldPositions[index] = (i - gridSize/2) * gridSpacing;
            fieldPositions[index + 1] = 0; // Will be animated
            fieldPositions[index + 2] = (j - gridSize/2) * gridSpacing;
            
            // Blue-ish colors
            fieldColors[index] = 0.1;
            fieldColors[index + 1] = 0.5;
            fieldColors[index + 2] = 1.0;
        }
    }
    
    fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
    fieldGeometry.setAttribute('color', new THREE.BufferAttribute(fieldColors, 3));
    
    const fieldMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });
    
    const field = new THREE.Points(fieldGeometry, fieldMaterial);
    group.add(field);
    
    // Add field connections (to visualize grid)
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(gridSize * gridSize * 6 * 2); // Each point has up to 4 connections
    
    let lineIndex = 0;
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = (i * gridSize + j) * 3;
            
            // Connect to right neighbor if not on edge
            if (j < gridSize - 1) {
                const rightIndex = (i * gridSize + j + 1) * 3;
                
                linePositions[lineIndex++] = fieldPositions[index];
                linePositions[lineIndex++] = fieldPositions[index + 1];
                linePositions[lineIndex++] = fieldPositions[index + 2];
                
                linePositions[lineIndex++] = fieldPositions[rightIndex];
                linePositions[lineIndex++] = fieldPositions[rightIndex + 1];
                linePositions[lineIndex++] = fieldPositions[rightIndex + 2];
            }
            
            // Connect to bottom neighbor if not on edge
            if (i < gridSize - 1) {
                const bottomIndex = ((i + 1) * gridSize + j) * 3;
                
                linePositions[lineIndex++] = fieldPositions[index];
                linePositions[lineIndex++] = fieldPositions[index + 1];
                linePositions[lineIndex++] = fieldPositions[index + 2];
                
                linePositions[lineIndex++] = fieldPositions[bottomIndex];
                linePositions[lineIndex++] = fieldPositions[bottomIndex + 1];
                linePositions[lineIndex++] = fieldPositions[bottomIndex + 2];
            }
        }
    }
    
    // Trim the buffer to actual size
    const trimmedLinePositions = new Float32Array(lineIndex);
    for (let i = 0; i < lineIndex; i++) {
        trimmedLinePositions[i] = linePositions[i];
    }
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(trimmedLinePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.primary,
        transparent: true,
        opacity: 0.2
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);
    
    // Particle excitations
    const particleCount = 5;
    const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.accent,
        emissive: config.colorScheme.accent,
        emissiveIntensity: 0.8
    });
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.visible = false;
        particle.userData = {
            active: false,
            centerX: 0,
            centerZ: 0,
            amplitude: 0,
            speed: 0,
            lifetime: 0
        };
        group.add(particle);
        particles.push(particle);
    }
    
    // Parameters
    let fieldStrength = 1.0;
    let time = 0;
    let lastExciteTime = 0;
    
    function updateField() {
        // Update field heights based on wave equations
        const positions = field.geometry.attributes.position.array;
        const linePositions = lines.geometry.attributes.position.array;
        
        // Apply wave function
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const index = (i * gridSize + j) * 3;
                const x = positions[index];
                const z = positions[index + 2];
                
                // Base field oscillation
                let height = Math.sin(x * 0.5 + time) * 0.05 * fieldStrength;
                height += Math.sin(z * 0.3 + time * 1.2) * 0.05 * fieldStrength;
                
                // Add effects from particles
                for (const particle of particles) {
                    if (particle.userData.active) {
                        const dx = x - particle.userData.centerX;
                        const dz = z - particle.userData.centerZ;
                        const distance = Math.sqrt(dx*dx + dz*dz);
                        
                        const waveEffect = Math.sin(distance * 3 - time * particle.userData.speed) * 
                                          particle.userData.amplitude * 
                                          Math.exp(-distance * 1.5);
                        
                        height += waveEffect;
                    }
                }
                
                positions[index + 1] = height;
            }
        }
        
        // Update line positions to match field points
        let lineIndex = 0;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const index = (i * gridSize + j) * 3;
                
                // Update right neighbor line if not on edge
                if (j < gridSize - 1) {
                    const rightIndex = (i * gridSize + j + 1) * 3;
                    
                    linePositions[lineIndex++] = positions[index];
                    linePositions[lineIndex++] = positions[index + 1];
                    linePositions[lineIndex++] = positions[index + 2];
                    
                    linePositions[lineIndex++] = positions[rightIndex];
                    linePositions[lineIndex++] = positions[rightIndex + 1];
                    linePositions[lineIndex++] = positions[rightIndex + 2];
                }
                
                // Update bottom neighbor line if not on edge
                if (i < gridSize - 1) {
                    const bottomIndex = ((i + 1) * gridSize + j) * 3;
                    
                    linePositions[lineIndex++] = positions[index];
                    linePositions[lineIndex++] = positions[index + 1];
                    linePositions[lineIndex++] = positions[index + 2];
                    
                    linePositions[lineIndex++] = positions[bottomIndex];
                    linePositions[lineIndex++] = positions[bottomIndex + 1];
                    linePositions[lineIndex++] = positions[bottomIndex + 2];
                }
            }
        }
        
        // Update buffers
        field.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.position.needsUpdate = true;
    }
    
    function updateParticles() {
        // Update particle positions and properties
        for (const particle of particles) {
            if (particle.userData.active) {
                // Move along field
                particle.userData.lifetime -= 0.01 * config.animationSpeed;
                
                if (particle.userData.lifetime <= 0) {
                    particle.userData.active = false;
                    particle.visible = false;
                    continue;
                }
                
                // Calculate position based on field
                const waveCenter = new THREE.Vector3(
                    particle.userData.centerX,
                    0,
                    particle.userData.centerZ
                );
                
                const now = time * particle.userData.speed;
                const radius = now % 3; // Circular motion with increasing radius
                const angle = now * 2;
                
                particle.position.x = waveCenter.x + Math.cos(angle) * radius * 0.2;
                particle.position.z = waveCenter.z + Math.sin(angle) * radius * 0.2;
                
                // Height from field at this position
                const fieldX = Math.round((particle.position.x / gridSpacing) + gridSize/2);
                const fieldZ = Math.round((particle.position.z / gridSpacing) + gridSize/2);
                
                if (fieldX >= 0 && fieldX < gridSize && fieldZ >= 0 && fieldZ < gridSize) {
                    const fieldIndex = (fieldX * gridSize + fieldZ) * 3;
                    const fieldHeight = field.geometry.attributes.position.array[fieldIndex + 1];
                    particle.position.y = fieldHeight * 2; // Amplify height for visibility
                }
                
                // Fade out at end of lifetime
                if (particle.userData.lifetime < 0.3) {
                    particle.material.opacity = particle.userData.lifetime / 0.3;
                }
            }
        }
    }
    
    function exciteField() {
        // Find an available particle
        const availableParticle = particles.find(p => !p.userData.active);
        
        if (availableParticle) {
            availableParticle.userData.active = true;
            availableParticle.visible = true;
            
            // Random position on the field
            const posX = (Math.random() - 0.5) * gridSize * gridSpacing * 0.8;
            const posZ = (Math.random() - 0.5) * gridSize * gridSpacing * 0.8;
            
            availableParticle.userData.centerX = posX;
            availableParticle.userData.centerZ = posZ;
            availableParticle.userData.amplitude = 0.1 + Math.random() * 0.1 * fieldStrength;
            availableParticle.userData.speed = 1 + Math.random() * 2;
            availableParticle.userData.lifetime = 1 + Math.random() * 2;
            
            availableParticle.position.set(posX, 0, posZ);
            availableParticle.material.opacity = 1;
            
            // Visual feedback
            gsap.from(availableParticle.scale, {
                x: 3, y: 3, z: 3,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
            
            lastExciteTime = time;
        }
    }
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Update field
        updateField();
        
        // Update particles
        updateParticles();
        
        // Auto-excite field occasionally, based on field strength
        if (time - lastExciteTime > 3 / fieldStrength && Math.random() < 0.01 * fieldStrength) {
            exciteField();
        }
        
        // Rotate for 3D effect
        group.rotation.x = Math.PI / 4; // Tilted view
        group.rotation.y = Math.sin(time * 0.1) * 0.2;
    }
    
    return {
        update,
        "field-strength": function(value) {
            fieldStrength = value;
        },
        "excite-field": exciteField,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            fieldGeometry.dispose();
            fieldMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            particleGeometry.dispose();
            
            particles.forEach(particle => {
                particle.geometry.dispose();
                particle.material.dispose();
            });
        }
    };
}

function createVerseNineAnimation() {
    // Spontaneous decay animation
    const group = new THREE.Group();
    scene.add(group);
    
    // Create nucleus container
    const nucleusGroup = new THREE.Group();
    group.add(nucleusGroup);
    
    // Create protons and neutrons
    const nucleonCount = 20;
    const nucleonGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const protonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5555,
        emissive: 0xff2222,
        emissiveIntensity: 0.3
    });
    const neutronMaterial = new THREE.MeshStandardMaterial({
        color: 0x5555ff,
        emissive: 0x2222ff,
        emissiveIntensity: 0.3
    });
    
    const nucleons = [];
    
    for (let i = 0; i < nucleonCount; i++) {
        const isProton = i % 2 === 0;
        const nucleon = new THREE.Mesh(
            nucleonGeometry,
            isProton ? protonMaterial.clone() : neutronMaterial.clone()
        );
        
        // Arrange in a rough sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 0.3 + Math.random() * 0.1;
        
        nucleon.position.x = radius * Math.sin(phi) * Math.cos(theta);
        nucleon.position.y = radius * Math.sin(phi) * Math.sin(theta);
        nucleon.position.z = radius * Math.cos(phi);
        
        nucleon.userData = {
            isProton: isProton,
            decayed: false,
            originalPosition: nucleon.position.clone()
        };
        
        nucleusGroup.add(nucleon);
        nucleons.push(nucleon);
    }
    
    // Emission particles
    const emissionCount = 10;
    const emissionGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const alphaParticleMaterial = new THREE.MeshPhongMaterial({ // Changed to Phong
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
    });
    const betaParticleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
    });
    const gammaParticleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
    });
    
    const emissions = [];
    
    for (let i = 0; i < emissionCount; i++) {
        // Randomly choose emission type
        const emissionType = Math.floor(Math.random() * 3); // 0: alpha, 1: beta, 2: gamma
        const material = [alphaParticleMaterial, betaParticleMaterial, gammaParticleMaterial][emissionType];
        
        const emission = new THREE.Mesh(emissionGeometry, material.clone());
        emission.visible = false;
        emission.userData = {
            active: false,
            type: ['alpha', 'beta', 'gamma'][emissionType],
            speed: 0.05 + Math.random() * 0.05,
            direction: new THREE.Vector3(0, 0, 0),
            lifetime: 0
        };
        
        group.add(emission);
        emissions.push(emission);
    }
    
    // Trails for emissions
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(emissionCount * 100 * 3); // 100 points per trail
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    const trailMaterials = [
        new THREE.LineBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        }),
        new THREE.LineBasicMaterial({
            color: 0x00ffaa,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        }),
        new THREE.LineBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        })
    ];
    
    const trails = [];
    
    for (let i = 0; i < emissionCount; i++) {
        const material = trailMaterials[Math.floor(Math.random() * 3)];
        const trail = new THREE.Line(trailGeometry.clone(), material.clone());
        trail.visible = false;
        trail.userData = {
            emissionIndex: i,
            positions: new Float32Array(100 * 3)
        };
        
        group.add(trail);
        trails.push(trail);
    }
    
    // Parameters
    let decayProbability = 0.01;
    let time = 0;
    
    function checkDecay() {
        // Check each nucleon for decay
        nucleons.forEach((nucleon, i) => {
            if (!nucleon.userData.decayed && Math.random() < decayProbability * config.animationSpeed) {
                // Decay!
                nucleon.userData.decayed = true;
                
                // Visual effect for decaying nucleon
                gsap.to(nucleon.scale, {
                    x: 1.5, y: 1.5, z: 1.5,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        // Shrink slightly to show it has decayed
                        gsap.to(nucleon.scale, {
                            x: 0.7, y: 0.7, z: 0.7,
                            duration: 0.5
                        });
                        
                        // Change color to show transformation
                        const newColor = nucleon.userData.isProton ? 0x5555ff : 0xff5555;
                        const newEmissive = nucleon.userData.isProton ? 0x2222ff : 0xff2222;
                        
                        gsap.to(nucleon.material.color, {
                            r: (newColor >> 16) / 255,
                            g: ((newColor >> 8) & 0xff) / 255,
                            b: (newColor & 0xff) / 255,
                            duration: 0.5
                        });
                        
                        gsap.to(nucleon.material.emissive, {
                            r: (newEmissive >> 16) / 255,
                            g: ((newEmissive >> 8) & 0xff) / 255,
                            b: (newEmissive & 0xff) / 255,
                            duration: 0.5
                        });
                        
                        // Toggle proton/neutron status
                        nucleon.userData.isProton = !nucleon.userData.isProton;
                    }
                });
                
                // Emit a particle
                emitParticle(nucleon);
            }
        });
    }
    
    function emitParticle(sourceNucleon) {
        // Find an available emission particle
        const availableEmission = emissions.find(e => !e.userData.active);
        if (!availableEmission) return;
        
        // Activate emission
        availableEmission.userData.active = true;
        availableEmission.visible = true;
        
        // Start from nucleon position
        availableEmission.position.copy(sourceNucleon.position);
        availableEmission.position.add(nucleusGroup.position);
        
        // Random direction
        const direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        availableEmission.userData.direction = direction;
        availableEmission.userData.lifetime = 2;
        
        // Size based on type
        if (availableEmission.userData.type === 'alpha') {
            availableEmission.scale.set(1.5, 1.5, 1.5);
        } else if (availableEmission.userData.type === 'beta') {
            availableEmission.scale.set(0.8, 0.8, 0.8);
        } else {
            availableEmission.scale.set(0.5, 0.5, 0.5);
        }
        
        // Activate trail
        const trail = trails.find(t => t.userData.emissionIndex === emissions.indexOf(availableEmission));
        if (trail) {
            trail.visible = true;
            
            // Reset trail positions
            const positions = trail.userData.positions;
            for (let i = 0; i < 100; i++) {
                positions[i * 3] = availableEmission.position.x;
                positions[i * 3 + 1] = availableEmission.position.y;
                positions[i * 3 + 2] = availableEmission.position.z;
            }
            
            trail.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        }
    }
    
    function updateEmissions() {
        // Update emission particles
        emissions.forEach((emission, index) => {
            if (emission.userData.active) {
                // Move along direction
                emission.position.add(
                    emission.userData.direction.clone().multiplyScalar(
                        emission.userData.speed * config.animationSpeed
                    )
                );
                
                // Update lifetime
                emission.userData.lifetime -= 0.01 * config.animationSpeed;
                
                if (emission.userData.lifetime <= 0) {
                    // Deactivate
                    emission.userData.active = false;
                    emission.visible = false;
                    
                    // Deactivate trail
                    const trail = trails.find(t => t.userData.emissionIndex === index);
                    if (trail) {
                        trail.visible = false;
                    }
                } else {
                    // Update trail
                    const trail = trails.find(t => t.userData.emissionIndex === index);
                    if (trail) {
                        const positions = trail.userData.positions;
                        
                        // Shift positions
                        for (let i = 99; i > 0; i--) {
                            positions[i * 3] = positions[(i - 1) * 3];
                            positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                            positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
                        }
                        
                        // Add new position
                        positions[0] = emission.position.x;
                        positions[1] = emission.position.y;
                        positions[2] = emission.position.z;
                        
                        trail.geometry.attributes.position.needsUpdate = true;
                    }
                }
                
                // Fade out near end of lifetime
                if (emission.userData.lifetime < 0.5) {
                    emission.material.opacity = emission.userData.lifetime / 0.5;
                }
            }
        });
    }
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Nucleus jitter
        nucleons.forEach(nucleon => {
            // Small random movement for quantum jitter
            nucleon.position.x = nucleon.userData.originalPosition.x + (Math.random() - 0.5) * 0.02;
            nucleon.position.y = nucleon.userData.originalPosition.y + (Math.random() - 0.5) * 0.02;
            nucleon.position.z = nucleon.userData.originalPosition.z + (Math.random() - 0.5) * 0.02;
        });
        
        // Check for decay
        checkDecay();
        
        // Update emissions
        updateEmissions();
        
        // Rotate nucleus
        nucleusGroup.rotation.x = time * 0.1;
        nucleusGroup.rotation.y = time * 0.15;
        
        // Rotate whole scene for 3D effect
        group.rotation.y = Math.sin(time * 0.1) * 0.2;
    }
    
    function resetAtoms() {
        // Reset all nucleons
        nucleons.forEach(nucleon => {
            nucleon.userData.decayed = false;
            
            // Reset color based on type
            const color = nucleon.userData.isProton ? 0xff5555 : 0x5555ff;
            const emissive = nucleon.userData.isProton ? 0xff2222 : 0x2222ff;
            
            nucleon.material.color.setHex(color);
            nucleon.material.emissive.setHex(emissive);
            
            gsap.to(nucleon.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5
            });
        });
        
        // Reset all emissions
        emissions.forEach((emission, index) => {
            emission.userData.active = false;
            emission.visible = false;
            
            // Reset trail
            const trail = trails.find(t => t.userData.emissionIndex === index);
            if (trail) {
                trail.visible = false;
            }
        });
    }
    
    return {
        update,
        "decay-probability": function(value) {
            decayProbability = value;
        },
        "reset-atoms": resetAtoms,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            nucleonGeometry.dispose();
            protonMaterial.dispose();
            neutronMaterial.dispose();
            emissionGeometry.dispose();
            alphaParticleMaterial.dispose();
            betaParticleMaterial.dispose();
            gammaParticleMaterial.dispose();
            
            trails.forEach(trail => {
                trail.geometry.dispose();
                trail.material.dispose();
            });
        }
    };
}

function createVerseTenAnimation() {
    // Creation/annihilation animation
    const group = new THREE.Group();
    scene.add(group);
    
    // Create field
    const fieldGeometry = new THREE.PlaneGeometry(5, 5, 50, 50);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: config.colorScheme.neutral,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    group.add(field);
    
    // Particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVisible = new Uint8Array(particleCount);
    
    // Initialize particles (all hidden)
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = 0;
        particlePositions[i * 3 + 1] = 0;
        particlePositions[i * 3 + 2] = 0;
        
        particleSizes[i] = 0;
        
        particleColors[i * 3] = 0.5;
        particleColors[i * 3 + 1] = 0.5;
        particleColors[i * 3 + 2] = 1.0;
        
        particleVisible[i] = 0;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Parameters
    let creationRate = 1.0;
    let annihilationRate = 1.0;
    let time = 0;
    let activeParticles = 0;
    
    function createParticle() {
        // Find an unused particle
        let index = -1;
        for (let i = 0; i < particleCount; i++) {
            if (particleVisible[i] === 0) {
                index = i;
                break;
            }
        }
        
        if (index === -1) return; // No available particles
        
        // Create new particle
        particleVisible[index] = 1;
        activeParticles++;
        
        // Random position near the field
        const x = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        const y = Math.sin(x * 0.5 + z * 0.5 + time) * 0.2 + 0.5;
        
        particlePositions[index * 3] = x;
        particlePositions[index * 3 + 1] = y;
        particlePositions[index * 3 + 2] = z;
        
        particleSizes[index] = Math.random() * 0.2 + 0.1;
        
        // Random color (blue to purple)
        particleColors[index * 3] = 0.5 + Math.random() * 0.5;
        particleColors[index * 3 + 1] = 0.2 + Math.random() * 0.3;
        particleColors[index * 3 + 2] = 0.8 + Math.random() * 0.2;
        
        // Visual effect for creation
        const creationEffect = createFlashEffect(
            new THREE.Vector3(x, y, z),
            new THREE.Color(
                particleColors[index * 3],
                particleColors[index * 3 + 1],
                particleColors[index * 3 + 2]
            )
        );
        group.add(creationEffect);
        
        gsap.to(creationEffect.scale, {
            x: 3, y: 3, z: 3,
            duration: 0.5,
            ease: "power1.out"
        });
        
        gsap.to(creationEffect.material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                group.remove(creationEffect);
                creationEffect.geometry.dispose();
                creationEffect.material.dispose();
            }
        });
    }
    
    function annihilateParticle() {
        if (activeParticles <= 0) return; // No particles to annihilate
        
        // Find a random active particle
        const activeIndices = [];
        for (let i = 0; i < particleCount; i++) {
            if (particleVisible[i] === 1) {
                activeIndices.push(i);
            }
        }
        
        if (activeIndices.length === 0) return;
        
        const index = activeIndices[Math.floor(Math.random() * activeIndices.length)];
        
        // Create annihilation effect
        const x = particlePositions[index * 3];
        const y = particlePositions[index * 3 + 1];
        const z = particlePositions[index * 3 + 2];
        
        const annihilationEffect = createFlashEffect(
            new THREE.Vector3(x, y, z),
            new THREE.Color(1, 0.3, 0.3)
        );
        group.add(annihilationEffect);
        
        gsap.to(annihilationEffect.scale, {
            x: 3, y: 3, z: 3,
            duration: 0.5,
            ease: "power1.out"
        });
        
        gsap.to(annihilationEffect.material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                group.remove(annihilationEffect);
                annihilationEffect.geometry.dispose();
                annihilationEffect.material.dispose();
            }
        });
        
        // Hide particle
        particleVisible[index] = 0;
        particleSizes[index] = 0;
        activeParticles--;
    }
    
    function createFlashEffect(position, color) {
        const flashGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        flash.position.copy(position);
        
        return flash;
    }
    
    function updateField() {
        // Update field geometry to simulate waves
        const vertices = field.geometry.attributes.position.array;
        
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            vertices[i + 1] = Math.sin(x * 0.5 + z * 0.5 + time) * 0.2;
        }
        
        field.geometry.attributes.position.needsUpdate = true;
    }
    
    function updateParticles() {
        // Move existing particles
        for (let i = 0; i < particleCount; i++) {
            if (particleVisible[i] === 1) {
                // Get current position
                const x = particlePositions[i * 3];
                const y = particlePositions[i * 3 + 1];
                const z = particlePositions[i * 3 + 2];
                
                // Move in a small spiral
                const angle = time * 0.5 + i * 0.1;
                const dx = Math.cos(angle) * 0.01 * config.animationSpeed;
                const dz = Math.sin(angle) * 0.01 * config.animationSpeed;
                
                // New position
                particlePositions[i * 3] = x + dx;
                particlePositions[i * 3 + 2] = z + dz;
                
                // Height based on field
                particlePositions[i * 3 + 1] = Math.sin(x * 0.5 + z * 0.5 + time) * 0.2 + 0.5;
                
                // Size pulsation
                particleSizes[i] = (Math.sin(time * 2 + i) * 0.05 + 0.15) * (0.8 + Math.sin(time * 0.2) * 0.2);
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;
    }
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Update field
        updateField();
        
        // Update particles
        updateParticles();
        
        // Create particles based on creation rate
        if (Math.random() < 0.05 * creationRate * config.animationSpeed) {
            createParticle();
        }
        
        // Annihilate particles based on annihilation rate
        if (activeParticles > 0 && Math.random() < 0.03 * annihilationRate * config.animationSpeed) {
            annihilateParticle();
        }
        
        // Rotate for 3D effect
        group.rotation.y = time * 0.1;
    }
    
    return {
        update,
        "creation-rate": function(value) {
            creationRate = value;
        },
        "annihilation-rate": function(value) {
            annihilationRate = value;
        },
        cleanup: function() {
            group.clear();
            scene.remove(group);
            fieldGeometry.dispose();
            fieldMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
        }
    };
}

function createVerseElevenAnimation() {
    // Unitary evolution and collapse animation
    const group = new THREE.Group();
    scene.add(group);
    
    // Create quantum state visualization
    const stateGeometry = new THREE.SphereGeometry(1, 32, 32);
    const stateMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.primary,
        emissive: config.colorScheme.primary,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });
    
    const state = new THREE.Mesh(stateGeometry, stateMaterial);
    group.add(state);
    
    // Add surface patterns to represent state complexity
    const patternCount = 10;
    const patternGeometry = new THREE.TorusGeometry(1.01, 0.02, 8, 100);
    const patternMaterial = new THREE.MeshBasicMaterial({
        color: config.colorScheme.accent,
        transparent: true,
        opacity: 0.5
    });
    
    const patterns = [];
    
    for (let i = 0; i < patternCount; i++) {
        const pattern = new THREE.Mesh(patternGeometry, patternMaterial.clone());
        pattern.rotation.x = Math.random() * Math.PI * 2;
        pattern.rotation.y = Math.random() * Math.PI * 2;
        pattern.rotation.z = Math.random() * Math.PI * 2;
        state.add(pattern);
        patterns.push(pattern);
    }
    
    // Wave function visualization
    const wavePointCount = 1000;
    const waveGeometry = new THREE.BufferGeometry();
    const waveVertices = new Float32Array(wavePointCount * 3);
    const waveColors = new Float32Array(wavePointCount * 3);
    
    // Initialize in a sphere
    for (let i = 0; i < wavePointCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 0.8 + Math.random() * 0.4;
        
        waveVertices[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        waveVertices[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        waveVertices[i * 3 + 2] = radius * Math.cos(phi);
        
        waveColors[i * 3] = 0.2 + Math.random() * 0.4;
        waveColors[i * 3 + 1] = 0.2 + Math.random() * 0.2;
        waveColors[i * 3 + 2] = 0.6 + Math.random() * 0.4;
    }
    
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(waveVertices, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));
    
    const waveMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const waveFunction = new THREE.Points(waveGeometry, waveMaterial);
    group.add(waveFunction);
    
    // Measurement/collapse result
    const resultGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const resultMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.secondary,
        emissive: config.colorScheme.secondary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    const result = new THREE.Mesh(resultGeometry, resultMaterial);
    group.add(result);
    
    // Parameters
    let evolutionSpeed = 1.0;
    let isCollapsed = false;
    let collapsePosition = new THREE.Vector3();
    let time = 0;
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        if (!isCollapsed) {
            // Unitary evolution - state evolves smoothly
            
            // Update wave function points
            const positions = waveFunction.geometry.attributes.position.array;
            const colors = waveFunction.geometry.attributes.color.array;
            
            for (let i = 0; i < wavePointCount; i++) {
                const x = positions[i * 3];
                const y = positions[i * 3 + 1];
                const z = positions[i * 3 + 2];
                
                // Distance from center
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                // Update position with periodic oscillation
                const theta = Math.atan2(y, x) + time * 0.1 * evolutionSpeed;
                const phi = Math.acos(z / dist) + Math.sin(time * 0.2 * evolutionSpeed) * 0.1;
                
                const newRadius = dist + Math.sin(time * evolutionSpeed + dist * 5) * 0.02;
                
                positions[i * 3] = newRadius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = newRadius * Math.cos(phi);
                
                // Update colors for wave effect
                const phase = time * evolutionSpeed + dist * 10;
                colors[i * 3] = 0.2 + Math.sin(phase) * 0.2 + Math.random() * 0.1;
                colors[i * 3 + 1] = 0.2 + Math.sin(phase + Math.PI/3) * 0.1;
                colors[i * 3 + 2] = 0.6 + Math.sin(phase + Math.PI*2/3) * 0.2;
            }
            
            waveFunction.geometry.attributes.position.needsUpdate = true;
            waveFunction.geometry.attributes.color.needsUpdate = true;
            
            // Update pattern rotations
            patterns.forEach((pattern, i) => {
                pattern.rotation.x += 0.002 * evolutionSpeed * config.animationSpeed * (i % 3 - 1);
                pattern.rotation.y += 0.003 * evolutionSpeed * config.animationSpeed * (i % 3 - 1);
                pattern.rotation.z += 0.001 * evolutionSpeed * config.animationSpeed * (i % 3 - 1);
            });
            
            // State pulsation
            state.scale.set(
                1 + Math.sin(time * evolutionSpeed) * 0.05,
                1 + Math.sin(time * evolutionSpeed + Math.PI/3) * 0.05,
                1 + Math.sin(time * evolutionSpeed + Math.PI*2/3) * 0.05
            );
            
        } else {
            // Collapsed state - localized at measurement result
            
            // Wave function collapses to measurement position
            const positions = waveFunction.geometry.attributes.position.array;
            
            for (let i = 0; i < wavePointCount; i++) {
                const x = positions[i * 3];
                const y = positions[i * 3 + 1];
                const z = positions[i * 3 + 2];
                
                // Vector from current position to collapse point
                const dx = collapsePosition.x - x;
                const dy = collapsePosition.y - y;
                const dz = collapsePosition.z - z;
                
                // Move toward collapse point
                positions[i * 3] += dx * 0.1 * config.animationSpeed;
                positions[i * 3 + 1] += dy * 0.1 * config.animationSpeed;
                positions[i * 3 + 2] += dz * 0.1 * config.animationSpeed;
            }
            
            waveFunction.geometry.attributes.position.needsUpdate = true;
            
            // Fade out wave function
            waveMaterial.opacity = Math.max(0, waveMaterial.opacity - 0.01 * config.animationSpeed);
            
            // Fade out state sphere
            stateMaterial.opacity = Math.max(0, stateMaterial.opacity - 0.01 * config.animationSpeed);
            
            // Shrink patterns
            patterns.forEach(pattern => {
                pattern.scale.multiplyScalar(0.99);
            });
            
            // Pulse the result
            result.scale.set(
                1 + Math.sin(time * 2) * 0.1,
                1 + Math.sin(time * 2 + Math.PI/3) * 0.1,
                1 + Math.sin(time * 2 + Math.PI*2/3) * 0.1
            );
        }
        
        // Rotate for 3D effect
        group.rotation.y = time * 0.1;
    }
    
    function collapseState() {
        if (isCollapsed) {
            // Reset to unitary evolution
            isCollapsed = false;
            
            // Fade in wave function
            gsap.to(waveMaterial, {
                opacity: 0.8,
                duration: 0.5
            });
            
            // Fade in state sphere
            gsap.to(stateMaterial, {
                opacity: 0.8,
                duration: 0.5
            });
            
            // Reset patterns
            patterns.forEach(pattern => {
                gsap.to(pattern.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 0.5
                });
            });
            
            // Fade out result
            gsap.to(resultMaterial, {
                opacity: 0,
                duration: 0.5
            });
            
            // Reset wave function points
            const positions = waveFunction.geometry.attributes.position.array;
            
            for (let i = 0; i < wavePointCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = 0.8 + Math.random() * 0.4;
                
                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);
            }
            
            waveFunction.geometry.attributes.position.needsUpdate = true;
            
            // Update button text
            const button = document.getElementById('collapse-state');
            if (button) {
                button.textContent = 'Collapse State';
            }
            
        } else {
            // Collapse to measurement
            isCollapsed = true;
            
            // Choose random point for collapse
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 0.8;
            
            collapsePosition = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Position the result
            result.position.copy(collapsePosition);
            
            // Fade in result
            gsap.to(resultMaterial, {
                opacity: 1,
                duration: 0.5
            });
            
            // Visual effects for collapse
            gsap.from(result.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
            
            // Flash the state at collapse
            gsap.to(stateMaterial, {
                emissiveIntensity: 1.5,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            
            // Update button text
            const button = document.getElementById('collapse-state');
            if (button) {
                button.textContent = 'Reset State';
            }
        }
    }
    
    return {
        update,
        "evolution-speed": function(value) {
            evolutionSpeed = value;
        },
        "collapse-state": collapseState,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            stateGeometry.dispose();
            stateMaterial.dispose();
            patternGeometry.dispose();
            
            patterns.forEach(pattern => {
                pattern.material.dispose();
            });
            
            waveGeometry.dispose();
            waveMaterial.dispose();
            resultGeometry.dispose();
            resultMaterial.dispose();
        }
    };
}

function createVerseTwelveAnimation() {
    // Probabilistic nature and illusory reality animation
    const group = new THREE.Group();
    scene.add(group);
    
    // Create dual representation: particle and wave
    const particleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: config.colorScheme.primary,
        emissive: config.colorScheme.primary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 1
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    group.add(particle);
    
    // Wave representation
    const waveWidth = 4;
    const waveSegments = 100;
    const waveGeometry = new THREE.BufferGeometry();
    const waveVertices = new Float32Array(waveSegments * 3);
    
    for (let i = 0; i < waveSegments; i++) {
        const x = (i / (waveSegments - 1)) * waveWidth - waveWidth / 2;
        waveVertices[i * 3] = x;
        waveVertices[i * 3 + 1] = 0; // Will be animated
        waveVertices[i * 3 + 2] = 0;
    }
    
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(waveVertices, 3));
    
    const waveMaterial = new THREE.LineBasicMaterial({
        color: config.colorScheme.secondary,
        transparent: true,
        opacity: 0
    });
    
    const wave = new THREE.Line(waveGeometry, waveMaterial);
    group.add(wave);
    
    // Probability cloud
    const cloudCount = 1000;
    const cloudGeometry = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudCount * 3);
    const cloudColors = new Float32Array(cloudCount * 3);
    const cloudSizes = new Float32Array(cloudCount);
    
    for (let i = 0; i < cloudCount; i++) {
        const x = (Math.random() - 0.5) * waveWidth;
        const y = (Math.random() - 0.5) * 1;
        const z = (Math.random() - 0.5) * 1;
        
        cloudPositions[i * 3] = x;
        cloudPositions[i * 3 + 1] = y;
        cloudPositions[i * 3 + 2] = z;
        
        // Colors from blue to purple
        cloudColors[i * 3] = 0.5 + Math.random() * 0.5;
        cloudColors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        cloudColors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        
        cloudSizes[i] = Math.random() * 0.05 + 0.01;
    }
    
    cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    cloudGeometry.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));
    cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1));
    
    const cloudMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    
    const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
    group.add(cloud);
    
    // Measurement grid (reality grid)
    const gridGeometry = new THREE.PlaneGeometry(waveWidth, 2, 20, 5);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: config.colorScheme.neutral,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.position.z = -0.5;
    group.add(grid);
    
    // Text indicators
    const particleLabel = createTextLabel("Particle View", new THREE.Vector3(0, 0.8, 0));
    const waveLabel = createTextLabel("Wave View", new THREE.Vector3(0, 0.8, 0));
    waveLabel.visible = false;
    
    group.add(particleLabel);
    group.add(waveLabel);
    
    // Parameters
    let realityMode = 0.5; // 0 = particle, 1 = wave
    let particlePosition = 0;
    let time = 0;
    
    // Helper function to create text labels
    function createTextLabel(text, position) {
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;
        div.style.color = 'white';
        div.style.fontSize = '12px';
        
        const label = new THREE.Object3D();
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = text;
        labelDiv.style.marginTop = '-1em';
        labelDiv.style.color = 'white';
        labelDiv.style.fontSize = '12px';
        const labelObject = new CSS2DObject(labelDiv);
        label.add(labelObject);
        label.position.copy(position);
        
        return label;
    }
    
    function update() {
        time += 0.01 * config.animationSpeed;
        
        // Update wave function
        const wavePositions = wave.geometry.attributes.position.array;
        
        for (let i = 0; i < waveSegments; i++) {
            const x = wavePositions[i * 3];
            
            // Gaussian wave packet
            const wavePacket = Math.exp(-Math.pow(x - particlePosition, 2) / 0.5) * 
                              Math.cos((x - particlePosition) * 10 + time * 5);
            
            wavePositions[i * 3 + 1] = wavePacket * 0.3;
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
        
        // Move particle
        particlePosition = Math.sin(time * 0.5) * 1.5;
        particle.position.x = particlePosition;
        
        // Blend between views based on realityMode
        particleMaterial.opacity = 1 - realityMode;
        waveMaterial.opacity = realityMode;
        cloudMaterial.opacity = realityMode * 0.7;
        
        // Update labels
        particleLabel.visible = realityMode < 0.5;
        waveLabel.visible = realityMode >= 0.5;
        
        // Update particle trail effect
        if (realityMode < 0.5) {
            // More particle-like
            particle.scale.set(1, 1, 1);
        } else {
            // More wave-like
            particle.scale.set(0.5, 0.5, 0.5);
        }
        
        // Update probability cloud to follow wave function
        const cloudPositions = cloud.geometry.attributes.position.array;
        const cloudSizes = cloud.geometry.attributes.size.array;
        
        for (let i = 0; i < cloudCount; i++) {
            const x = cloudPositions[i * 3];
            
            // Probability amplitude based on wave function
            const probability = Math.exp(-Math.pow(x - particlePosition, 2) / (0.5 + realityMode * 1.5));
            
            // Update y position for visual effect
            cloudPositions[i * 3 + 1] = (Math.random() - 0.5) * probability * 0.5;
            
            // Update size based on probability
            cloudSizes[i] = probability * 0.05 + 0.01;
        }
        
        cloud.geometry.attributes.position.needsUpdate = true;
        cloud.geometry.attributes.size.needsUpdate = true;
        
        // Rotate for 3D effect
        group.rotation.y = Math.sin(time * 0.2) * 0.3;
    }
    
    function toggleView() {
        // Toggle between particle and wave views
        gsap.to(this, {
            realityMode: realityMode < 0.5 ? 1 : 0,
            duration: 1,
            ease: "power2.inOut"
        });
        
        // Visual effects for transition
        if (realityMode < 0.5) {
            // Transitioning to wave
            gsap.to(grid.material, {
                opacity: 0.05,
                duration: 1
            });
            
            // Flash effect
            const flash = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 32, 32),
                new THREE.MeshBasicMaterial({
                    color: config.colorScheme.accent,
                    transparent: true,
                    opacity: 0.7
                })
            );
            flash.position.copy(particle.position);
            group.add(flash);
            
            gsap.to(flash.scale, {
                x: 10, y: 10, z: 10,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.to(flash.material, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    group.remove(flash);
                    flash.geometry.dispose();
                    flash.material.dispose();
                }
            });
            
            // Update button text
            const button = document.getElementById('toggle-view');
            if (button) {
                button.textContent = 'Show Particle View';
            }
        } else {
            // Transitioning to particle
            gsap.to(grid.material, {
                opacity: 0.1,
                duration: 1
            });
            
            // Collapse wave effect
            const positions = wave.geometry.attributes.position.array;
            const originalY = new Float32Array(waveSegments);
            
            for (let i = 0; i < waveSegments; i++) {
                originalY[i] = positions[i * 3 + 1];
            }
            
            gsap.to(originalY, {
                endArray: new Array(waveSegments).fill(0),
                duration: 1,
                onUpdate: () => {
                    for (let i = 0; i < waveSegments; i++) {
                        positions[i * 3 + 1] = originalY[i];
                    }
                    wave.geometry.attributes.position.needsUpdate = true;
                }
            });
            
            // Update button text
            const button = document.getElementById('toggle-view');
            if (button) {
                button.textContent = 'Show Wave View';
            }
        }
    }
    
    return {
        update,
        "reality-mode": function(value) {
            realityMode = value;
        },
        "toggle-view": toggleView,
        cleanup: function() {
            group.clear();
            scene.remove(group);
            particleGeometry.dispose();
            particleMaterial.dispose();
            waveGeometry.dispose();
            waveMaterial.dispose();
            cloudGeometry.dispose();
            cloudMaterial.dispose();
            gridGeometry.dispose();
            gridMaterial.dispose();
        }
    };
}

// Helper function to create text labels
function createTextLabel(text, position) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = text;
    div.style.color = 'white';
    div.style.fontSize = '12px';
    
    const label = new THREE.Object3D();
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = text;
    labelDiv.style.marginTop = '-1em';
    labelDiv.style.color = 'white';
    labelDiv.style.fontSize = '12px';
    const labelObject = new CSS2DObject(labelDiv);
    label.add(labelObject);
    label.position.copy(position);
    
    return label;
}