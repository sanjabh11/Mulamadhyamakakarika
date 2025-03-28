import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { verses } from './config.js';

// Core variables
let currentVerse = 1;
let scene, camera, renderer, composer, controls;
let animationFrameId;
let interactionControls = document.getElementById('interaction-controls');
let verses1To14Scenes = [];
let isMobile = window.innerWidth <= 768;

// Initialize the application
function init() {
    setupScene();
    setupLighting();
    setupPostprocessing();
    setupControls();
    setupEventListeners();
    setupAccessibilityFeatures();
    createScenesForAllVerses();
    
    loadVerse(currentVerse);
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Set up the ThreeJS scene
function setupScene() {
    const container = document.getElementById('scene-container');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.002);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
}

// Set up lighting for the scene
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x64ffda, 2, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
}

// Set up post-processing effects
function setupPostprocessing() {
    composer = new EffectComposer(renderer);
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,  // strength
        0.4,  // radius
        0.85  // threshold
    );
    composer.addPass(bloomPass);
}

// Set up navigation controls
function setupControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const verseDots = document.querySelectorAll('.verse-dot');
    
    prevBtn.addEventListener('click', () => {
        if (currentVerse > 1) {
            loadVerse(currentVerse - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentVerse < verses.length) {
            loadVerse(currentVerse + 1);
        }
    });
    
    verseDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const verseNum = parseInt(dot.getAttribute('data-verse'));
            loadVerse(verseNum);
        });
        
        // Add keyboard accessibility
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Go to verse ${dot.getAttribute('data-verse')}`);
        
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const verseNum = parseInt(dot.getAttribute('data-verse'));
                loadVerse(verseNum);
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (currentVerse < verses.length) {
                loadVerse(currentVerse + 1);
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (currentVerse > 1) {
                loadVerse(currentVerse - 1);
            }
        }
    });
}

// Set up event listeners for interactions
function setupEventListeners() {
    // Touch events for mobile swipe navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left (next)
            if (currentVerse < verses.length) {
                loadVerse(currentVerse + 1);
            }
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right (prev)
            if (currentVerse > 1) {
                loadVerse(currentVerse - 1);
            }
        }
    }
    
    // Panel toggle for mobile
    const panelToggle = document.getElementById('panel-toggle');
    const textPanel = document.getElementById('text-panel');
    
    panelToggle.addEventListener('click', () => {
        textPanel.classList.toggle('open');
        panelToggle.textContent = textPanel.classList.contains('open') ? '×' : '≡';
        
        // Update aria attributes
        if (textPanel.classList.contains('open')) {
            panelToggle.setAttribute('aria-expanded', 'true');
            panelToggle.setAttribute('aria-label', 'Close text panel');
        } else {
            panelToggle.setAttribute('aria-expanded', 'false');
            panelToggle.setAttribute('aria-label', 'Open text panel');
        }
    });
    
    // Help button and modal
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelp = document.getElementById('close-help');
    
    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });
    
    closeHelp.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
    
    // Close modal when clicking outside content
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
    
    // Close with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpModal.style.display === 'flex') {
            helpModal.style.display = 'none';
        }
    });
}

// Setup accessibility features
function setupAccessibilityFeatures() {
    // Add aria roles and labels
    document.getElementById('prev-btn').setAttribute('aria-label', 'Go to previous verse');
    document.getElementById('next-btn').setAttribute('aria-label', 'Go to next verse');
    
    const verseDots = document.querySelectorAll('.verse-dot');
    verseDots.forEach(dot => {
        const verseNum = dot.getAttribute('data-verse');
        dot.setAttribute('aria-label', `Go to verse ${verseNum}`);
    });
    
    document.getElementById('verse-indicator').setAttribute('role', 'navigation');
    document.getElementById('verse-indicator').setAttribute('aria-label', 'Verse navigation');
    
    document.getElementById('panel-toggle').setAttribute('aria-expanded', 'false');
    document.getElementById('panel-toggle').setAttribute('aria-label', 'Open text panel');
    document.getElementById('panel-toggle').setAttribute('aria-controls', 'text-panel');
    
    document.getElementById('text-panel').setAttribute('role', 'region');
    document.getElementById('text-panel').setAttribute('aria-label', 'Verse information');
    
    document.getElementById('interaction-controls').setAttribute('role', 'region');
    document.getElementById('interaction-controls').setAttribute('aria-label', 'Interactive controls');
    
    // Help modal accessibility
    const helpModal = document.getElementById('help-modal');
    helpModal.setAttribute('role', 'dialog');
    helpModal.setAttribute('aria-labelledby', 'help-title');
    helpModal.setAttribute('aria-modal', 'true');
    
    const helpButton = document.getElementById('help-button');
    helpButton.setAttribute('aria-haspopup', 'dialog');
    helpButton.setAttribute('aria-controls', 'help-modal');
}

// Create scenes for all verses
function createScenesForAllVerses() {
    // Initialize empty scenes for all verses
    for (let i = 0; i < verses.length; i++) {
        verses1To14Scenes[i] = new THREE.Group();
    }
    
    // Verse 1: Double Slit Experiment
    createDoubleSlitScene();
    
    // Verse 2: Quantum Circuit
    createQuantumCircuitScene();
    
    // Verse 3: Atom Energy Levels
    createAtomEnergyLevelsScene();
    
    // Verse 4: Entangled Particles
    createEntangledParticlesScene();
    
    // Verse 5: Three Jewels Network
    createThreeJewelsNetworkScene();
    
    // Verse 6: Quantum Measurement
    createQuantumMeasurementScene();
    
    // Verse 7: Quantum Maze
    createQuantumMazeScene();
    
    // Verse 8: Quantum Coin
    createQuantumCoinScene();
    
    // Verse 9: Quantum Lenses
    createQuantumLensesScene();
    
    // Verse 10: Quantum Ladder
    createQuantumLadderScene();
    
    // Verse 11: Quantum Snake
    createQuantumSnakeScene();
    
    // Verse 12: Quantum Puzzle Cube
    createQuantumPuzzleCubeScene();
    
    // Verse 13: Quantum Engine
    createQuantumEngineScene();
    
    // Verse 14: Quantum Canvas
    createQuantumCanvasScene();
}

// Create the Double Slit Experiment scene (Verse 1)
function createDoubleSlitScene() {
    const group = verses1To14Scenes[0];
    
    // Source
    const sourceGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const sourceMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.5
    });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.set(0, 0, -3);
    group.add(source);
    
    // Double slit barrier
    const barrierGeometry = new THREE.BoxGeometry(4, 2, 0.1);
    const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.set(0, 0, 0);
    group.add(barrier);
    
    // Slits
    const slitGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const slitMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.1
    });
    
    const slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit1.position.set(-0.5, 0, 0);
    group.add(slit1);
    
    const slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit2.position.set(0.5, 0, 0);
    group.add(slit2);
    
    // Detection screen
    const screenGeometry = new THREE.PlaneGeometry(4, 2);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 3);
    screen.rotation.y = Math.PI;
    group.add(screen);
    
    // Particles (wave pattern)
    const waveGroup = new THREE.Group();
    group.add(waveGroup);
    waveGroup.visible = true;
    
    const particleGroup = new THREE.Group();
    group.add(particleGroup);
    particleGroup.visible = false;
    
    // Create wave pattern
    for (let i = 0; i < 100; i++) {
        const waveGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const waveMaterial = new THREE.MeshStandardMaterial({
            color: 0x64ffda,
            emissive: 0x64ffda,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        
        // Place in a wave interference pattern
        const x = (Math.random() - 0.5) * 3;
        const y = Math.sin(x * 5) * 0.5 * Math.cos(x * 3) * 0.5;
        const z = 3; // On the screen
        
        wave.position.set(x, y, z);
        waveGroup.add(wave);
        
        // Animate wave
        gsap.to(wave.position, {
            y: y + (Math.random() - 0.5) * 0.2,
            duration: 1 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(wave.material, {
            opacity: 0.3 + Math.random() * 0.4,
            duration: 1 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Create particle pattern
    for (let i = 0; i < 50; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x64ffda,
            emissiveIntensity: 1
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Place in a particle pattern
        const bandWidth = 0.3;
        const band1Center = -1;
        const band2Center = 1;
        
        let x;
        if (Math.random() < 0.5) {
            x = band1Center + (Math.random() - 0.5) * bandWidth;
        } else {
            x = band2Center + (Math.random() - 0.5) * bandWidth;
        }
        
        const y = (Math.random() - 0.5) * 1.5;
        const z = 3; // On the screen
        
        particle.position.set(x, y, z);
        particleGroup.add(particle);
    }
    
    // Store references
    group.userData = {
        waveGroup,
        particleGroup,
        toggleObservation: (observed) => {
            waveGroup.visible = !observed;
            particleGroup.visible = observed;
        }
    };
}

// Create the Quantum Circuit scene (Verse 2)
function createQuantumCircuitScene() {
    const group = verses1To14Scenes[1];
    
    // Qubits as glowing lines
    const qubitCount = 3;
    const qubitLines = [];
    const lineLength = 6;
    
    for (let i = 0; i < qubitCount; i++) {
        const points = [];
        points.push(new THREE.Vector3(-lineLength/2, i - (qubitCount-1)/2, 0));
        points.push(new THREE.Vector3(lineLength/2, i - (qubitCount-1)/2, 0));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x64ffda,
            linewidth: 2
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
        qubitLines.push(line);
        
        // States of qubits (|0⟩ initially)
        const stateGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const stateMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x64ffda,
            emissiveIntensity: 0.8
        });
        
        const state = new THREE.Mesh(stateGeometry, stateMaterial);
        state.position.copy(points[0]);
        group.add(state);
        
        // Animated flow of quantum information
        const flowCount = 20;
        for (let j = 0; j < flowCount; j++) {
            const flowGeometry = new THREE.SphereGeometry(0.03, 8, 8);
            const flowMaterial = new THREE.MeshStandardMaterial({
                color: 0x64ffda,
                emissive: 0x64ffda,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.7
            });
            
            const flow = new THREE.Mesh(flowGeometry, flowMaterial);
            const startPosition = new THREE.Vector3().copy(points[0]);
            flow.position.copy(startPosition);
            group.add(flow);
            
            // Animate flow
            gsap.to(flow.position, {
                x: points[1].x,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                delay: j * 0.2,
                ease: "none",
                onComplete: () => {
                    flow.position.copy(startPosition);
                }
            });
            
            gsap.to(flow.material, {
                opacity: 0.2 + Math.random() * 0.5,
                duration: 1 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
    
    // Quantum gates
    const hadamardGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const hadamardMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x64ffda,
        emissiveIntensity: 0.5
    });
    
    const hadamard = new THREE.Mesh(hadamardGeometry, hadamardMaterial);
    hadamard.position.set(-2, 0, 0);
    group.add(hadamard);
    
    const cnotGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 32);
    const cnotMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xff64a5,
        emissiveIntensity: 0.5
    });
    
    const cnot = new THREE.Mesh(cnotGeometry, cnotMaterial);
    cnot.position.set(2, 0, 0);
    cnot.rotation.x = Math.PI / 2;
    group.add(cnot);
    
    // Final "liberated" configuration
    const finalStateGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const finalStateMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x64ffda,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.7
    });
    
    const finalState = new THREE.Mesh(finalStateGeometry, finalStateMaterial);
    finalState.position.set(lineLength/2 + 1, 0, 0);
    finalState.scale.set(0.5, 0.5, 0.5);
    group.add(finalState);
    
    // Pulse animation for final state
    gsap.to(finalState.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Define animation for adding gates
    group.userData = {
        applyHadamard: () => {
            const hadamardClone = hadamard.clone();
            hadamardClone.position.set(-1, -1, 0);
            group.add(hadamardClone);
            
            gsap.to(hadamardClone.position, {
                x: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    // Show transformation effect
                    const transformEffect = new THREE.Mesh(
                        new THREE.SphereGeometry(0.3, 16, 16),
                        new THREE.MeshStandardMaterial({
                            color: 0x64ffda,
                            emissive: 0x64ffda,
                            emissiveIntensity: 1,
                            transparent: true,
                            opacity: 0.8
                        })
                    );
                    transformEffect.position.set(0, -1, 0);
                    group.add(transformEffect);
                    
                    gsap.to(transformEffect.scale, {
                        x: 2,
                        y: 2,
                        z: 2,
                        duration: 0.5,
                        ease: "power2.out",
                        onComplete: () => {
                            group.remove(transformEffect);
                        }
                    });
                    
                    gsap.to(transformEffect.material, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        },
        applyCNOT: () => {
            const cnotClone = cnot.clone();
            cnotClone.position.set(-1, 0, 0);
            group.add(cnotClone);
            
            gsap.to(cnotClone.position, {
                x: 1,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    // Show connection effect between qubits
                    const points = [
                        new THREE.Vector3(1, 0, 0),
                        new THREE.Vector3(1, -1, 0)
                    ];
                    
                    const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const connectionMaterial = new THREE.LineBasicMaterial({ 
                        color: 0xff64a5,
                        linewidth: 3
                    });
                    
                    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
                    group.add(connection);
                    
                    gsap.to(connection.material, {
                        opacity: 0,
                        duration: 1,
                        delay: 0.5,
                        onComplete: () => {
                            group.remove(connection);
                        }
                    });
                }
            });
        },
        resetCircuit: () => {
            // Reset animation - pulse of energy through circuit
            const resetEffect = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 16, 16),
                new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 1,
                    transparent: true,
                    opacity: 0.8
                })
            );
            resetEffect.position.set(-lineLength/2, 0, 0);
            group.add(resetEffect);
            
            gsap.to(resetEffect.position, {
                x: lineLength/2,
                duration: 1.5,
                ease: "power1.inOut",
                onComplete: () => {
                    group.remove(resetEffect);
                }
            });
        }
    };
}

// Create the Atom Energy Levels scene (Verse 3)
function createAtomEnergyLevelsScene() {
    const group = verses1To14Scenes[2];
    
    // Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0x2266dd,
        emissive: 0x1144aa,
        emissiveIntensity: 0.5,
        roughness: 0.4
    });
    
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    group.add(nucleus);
    
    // Energy levels (orbits)
    const levelCount = 4;
    const orbitRadii = [1.5, 2.5, 3.5, 4.5];
    const orbits = [];
    const fruitLabels = ["Stream Entry", "Once-Returner", "Non-Returner", "Arahantship"];
    
    for (let i = 0; i < levelCount; i++) {
        const orbitGeometry = new THREE.TorusGeometry(orbitRadii[i], 0.02, 16, 100);
        const orbitMaterial = new THREE.MeshStandardMaterial({
            color: 0x64ffda,
            emissive: 0x64ffda,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6
        });
        
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        group.add(orbit);
        orbits.push(orbit);
        
        // Pulse animation for orbits
        gsap.to(orbit.material, {
            emissiveIntensity: 0.6,
            opacity: 0.8,
            duration: 1 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Electrons
    const electrons = [];
    
    for (let i = 0; i < levelCount; i++) {
        const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const electronMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x64ffda,
            emissiveIntensity: 0.8
        });
        
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        
        // Position on first level initially
        const angle = i * (Math.PI / 2);
        electron.position.set(
            orbitRadii[0] * Math.cos(angle),
            0,
            orbitRadii[0] * Math.sin(angle)
        );
        
        group.add(electron);
        electrons.push({
            mesh: electron,
            currentLevel: 0,
            angle: angle,
            speed: 0.5 + Math.random() * 0.5
        });
    }
    
    // Store animation function
    group.userData = {
        electrons,
        orbits,
        orbitRadii,
        addPhoton: () => {
            // Create photon (energy input)
            const photonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const photonMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.8
            });
            
            const photon = new THREE.Mesh(photonGeometry, photonMaterial);
            photon.position.set(-5, 2, 0);
            group.add(photon);
            
            // Animate photon towards electron
            gsap.to(photon.position, {
                x: electrons[0].mesh.position.x,
                y: electrons[0].mesh.position.y,
                z: electrons[0].mesh.position.z,
                duration: 1,
                ease: "power1.in",
                onComplete: () => {
                    group.remove(photon);
                    
                    // Trigger electron level transition
                    const electron = electrons[0];
                    if (electron.currentLevel < orbitRadii.length - 1) {
                        electron.currentLevel++;
                        
                        // Flash effect
                        const flashGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                        const flashMaterial = new THREE.MeshStandardMaterial({
                            color: 0xffffff,
                            emissive: 0xffffff,
                            emissiveIntensity: 1,
                            transparent: true,
                            opacity: 0.8
                        });
                        
                        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                        flash.position.copy(electron.mesh.position);
                        group.add(flash);
                        
                        gsap.to(flash.scale, {
                            x: 3,
                            y: 3,
                            z: 3,
                            duration: 0.5,
                            ease: "power1.out",
                            onComplete: () => {
                                group.remove(flash);
                            }
                        });
                        
                        gsap.to(flash.material, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power1.out"
                        });
                        
                        // Show label for the fruit
                        const fruitLabel = fruitLabels[electron.currentLevel];
                        console.log(`Electron transitioned to: ${fruitLabel}`);
                    }
                }
            });
        },
        animate: () => {
            // Animate electrons
            electrons.forEach(electron => {
                electron.angle += electron.speed * 0.01;
                electron.mesh.position.set(
                    orbitRadii[electron.currentLevel] * Math.cos(electron.angle),
                    0,
                    orbitRadii[electron.currentLevel] * Math.sin(electron.angle)
                );
                
                // Pulse animation for electrons
                gsap.to(electron.mesh.material, {
                    emissiveIntensity: 0.4 + Math.random() * 0.4,
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: 1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }
    };
}

// Create the Entangled Particles scene (Verse 4)
function createEntangledParticlesScene() {
    const group = verses1To14Scenes[3];
    
    // Create particles
    const particleCount = 8;
    const particles = [];
    const particleRadius = 0.3;
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(particleRadius, 32, 32);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x64ffda,
            emissive: 0x64ffda,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position in a circular pattern
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3;
        particle.position.set(
            radius * Math.cos(angle),
            0,
            radius * Math.sin(angle)
        );
        
        group.add(particle);
        particles.push(particle);
        
        // Pulse animation
        gsap.to(particle.scale, {
            x: 0.8 + Math.random() * 0.4,
            y: 0.8 + Math.random() * 0.4,
            z: 0.8 + Math.random() * 0.4,
            duration: 1 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(particle.material, {
            emissiveIntensity: 0.3 + Math.random() * 0.5,
            opacity: 0.6 + Math.random() * 0.4,
            duration: 1 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Create connection lines between particles
    const connections = [];
    
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const points = [
                particles[i].position,
                particles[j].position
            ];
            
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: 0x64ffda,
                transparent: true,
                opacity: 0.3
            });
            
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            group.add(connection);
            connections.push({
                line: connection,
                points: points,
                material: connectionMaterial
            });
            
            // Pulse animation for connections
            gsap.to(connectionMaterial, {
                opacity: 0.1 + Math.random() * 0.3,
                duration: 1 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
    
    // Create the central "observer" particle
    const observerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const observerMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xff64a5,
        emissiveIntensity: 0.7
    });
    
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.position.set(0, 0, 0);
    group.add(observer);
    
    // Store interaction function
    group.userData = {
        particles,
        connections,
        observer,
        adjustParticle: (value) => {
            // Adjust all particles based on the slider value
            const normalizedValue = value / 100; // Assuming slider goes from 0 to 100
            
            // Change the state of the observer
            observer.material.emissiveIntensity = 0.3 + normalizedValue * 0.7;
            observer.scale.set(
                0.8 + normalizedValue * 0.4,
                0.8 + normalizedValue * 0.4,
                0.8 + normalizedValue * 0.4
            );
            
            // Propagate the change to all particles (entanglement effect)
            particles.forEach((particle, index) => {
                // Modify color based on the adjustment
                const hue = 0.5 + normalizedValue * 0.3; // Cyan to blue-green
                particle.material.color.setHSL(hue, 0.8, 0.5);
                particle.material.emissive.setHSL(hue, 0.8, 0.5);
                
                // Modify scale
                const scale = 0.8 + normalizedValue * 0.6;
                gsap.to(particle.scale, {
                    x: scale,
                    y: scale, 
                    z: scale,
                    duration: 0.5 + index * 0.1,
                    ease: "power2.out"
                });
                
                // Create pulse effect radiating from observer
                const pulseGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
                const pulseMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff64a5,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                
                const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
                pulse.position.copy(observer.position);
                pulse.lookAt(particle.position);
                group.add(pulse);
                
                gsap.to(pulse.scale, {
                    x: 20,
                    y: 20,
                    z: 1,
                    duration: 1,
                    ease: "power1.out",
                    onComplete: () => {
                        group.remove(pulse);
                    }
                });
                
                gsap.to(pulse.material, {
                    opacity: 0,
                    duration: 1,
                    ease: "power1.out"
                });
            });
            
            // Enhance connection lines
            connections.forEach(connection => {
                connection.material.opacity = 0.1 + normalizedValue * 0.6;
                connection.line.geometry.setFromPoints(connection.points);
                connection.line.geometry.attributes.position.needsUpdate = true;
            });
        }
    };
}

// Create the Three Jewels Network scene (Verse 5)
function createThreeJewelsNetworkScene() {
    const group = verses1To14Scenes[4];
    
    // Create the three nodes: Buddha, Dharma, Sangha
    const nodeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    
    const buddhaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700, // Gold for Buddha
        emissive: 0xffd700,
        emissiveIntensity: 0.5
    });
    
    const dharmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda, // Cyan for Dharma
        emissive: 0x64ffda,
        emissiveIntensity: 0.5
    });
    
    const sanghaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff64a5, // Pink for Sangha
        emissive: 0xff64a5,
        emissiveIntensity: 0.5
    });
    
    // Create nodes
    const buddhaNnode = new THREE.Mesh(nodeGeometry, buddhaMaterial);
    buddhaNnode.position.set(0, 2, 0);
    group.add(buddhaNnode);
    
    const dharmaNode = new THREE.Mesh(nodeGeometry, dharmaMaterial);
    dharmaNode.position.set(-2, -1, 0);
    group.add(dharmaNode);
    
    const sanghaNode = new THREE.Mesh(nodeGeometry, sanghaMaterial);
    sanghaNode.position.set(2, -1, 0);
    group.add(sanghaNode);
    
    // Create connections
    const createConnection = (node1, node2, color) => {
        const points = [
            node1.position,
            node2.position
        ];
        
        const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 2,
            transparent: true,
            opacity: 0.7
        });
        
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        group.add(connection);
        
        return {
            line: connection,
            material: connectionMaterial
        };
    };
    
    const buddhaDharmaConn = createConnection(buddhaNnode, dharmaNode, 0xb4e1ff);
    const buddhaSanghaConn = createConnection(buddhaNnode, sanghaNode, 0xffb4e1);
    const dharmaSanghaConn = createConnection(dharmaNode, sanghaNode, 0xb4ffe1);
    
    // Create energy flows along connections
    const createEnergyFlow = (startNode, endNode, color) => {
        const flowCount = 5;
        const flows = [];
        
        for (let i = 0; i < flowCount; i++) {
            const flowGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const flowMaterial = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8
            });
            
            const flow = new THREE.Mesh(flowGeometry, flowMaterial);
            flow.position.copy(startNode.position);
            group.add(flow);
            flows.push(flow);
            
            // Start animation with delay
            gsap.to(flow.position, {
                x: endNode.position.x,
                y: endNode.position.y,
                z: endNode.position.z,
                duration: 2 + Math.random(),
                delay: i * 0.4,
                repeat: -1,
                ease: "none",
                onRepeat: () => {
                    flow.position.copy(startNode.position);
                }
            });
            
            gsap.to(flow.material, {
                opacity: 0.4 + Math.random() * 0.4,
                duration: 1 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        return flows;
    };
    
    const buddhaDharmaFlow = createEnergyFlow(buddhaNnode, dharmaNode, 0xb4e1ff);
    const buddhaSanghaFlow = createEnergyFlow(buddhaNnode, sanghaNode, 0xffb4e1);
    const dharmaSanghaFlow = createEnergyFlow(dharmaNode, sanghaNode, 0xb4ffe1);
    const dharmaTobuddhaFlow = createEnergyFlow(dharmaNode, buddhaNnode, 0xb4e1ff);
    const sanghaTobuddhaFlow = createEnergyFlow(sanghaNode, buddhaNnode, 0xffb4e1);
    const sanghaTodharmaFlow = createEnergyFlow(sanghaNode, dharmaNode, 0xb4ffe1);
    
    // Store interaction function
    group.userData = {
        nodes: {
            buddha: buddhaNnode,
            dharma: dharmaNode,
            sangha: sanghaNode
        },
        connections: {
            buddhaDharma: buddhaDharmaConn,
            buddhaSangha: buddhaSanghaConn,
            dharmaSangha: dharmaSanghaConn
        },
        flows: {
            buddhaDharma: buddhaDharmaFlow,
            buddhaSangha: buddhaSanghaFlow,
            dharmaSangha: dharmaSanghaFlow,
            dharmaToBuddha: dharmaTobuddhaFlow,
            sanghaToBuddha: sanghaTobuddhaFlow,
            sanghaToDharma: sanghaTodharmaFlow
        },
        activateNode: (nodeName) => {
            const node = group.userData.nodes[nodeName];
            
            // Pulse the selected node
            gsap.to(node.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
            
            gsap.to(node.material, {
                emissiveIntensity: 1,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
            
            // Create wave effect
            const waveGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
            const waveMaterial = new THREE.MeshBasicMaterial({
                color: node.material.color,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.position.copy(node.position);
            wave.rotation.x = Math.PI / 2;
            group.add(wave);
            
            gsap.to(wave.scale, {
                x: 15,
                y: 15,
                z: 1,
                duration: 2,
                ease: "power1.out",
                onComplete: () => {
                    group.remove(wave);
                }
            });
            
            gsap.to(wave.material, {
                opacity: 0,
                duration: 2,
                ease: "power1.out"
            });
            
            // Affect all other nodes (non-locality)
            Object.keys(group.userData.nodes).forEach(key => {
                if (key !== nodeName) {
                    const otherNode = group.userData.nodes[key];
                    
                    gsap.to(otherNode.scale, {
                        x: 1.2,
                        y: 1.2,
                        z: 1.2,
                        duration: 1,
                        delay: 0.5,
                        yoyo: true,
                        repeat: 1,
                        ease: "power1.inOut"
                    });
                    
                    gsap.to(otherNode.material, {
                        emissiveIntensity: 0.8,
                        duration: 1,
                        delay: 0.5,
                        yoyo: true,
                        repeat: 1,
                        ease: "power1.inOut"
                    });
                }
            });
            
            // Enhance all connections temporarily
            Object.values(group.userData.connections).forEach(conn => {
                gsap.to(conn.material, {
                    opacity: 1,
                    duration: 1,
                    delay: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut"
                });
            });
        }
    };
}

// Create the Quantum Measurement scene (Verse 6)
function createQuantumMeasurementScene() {
    const group = verses1To14Scenes[5];
    
    // Create quantum particle in superposition
    const particleGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    group.add(particle);
    
    // Create superposition effect (blurring and multiple states)
    const blurCount = 8;
    const blurs = [];
    
    for (let i = 0; i < blurCount; i++) {
        const blurGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const blurMaterial = new THREE.MeshStandardMaterial({
            color: 0x64ffda,
            emissive: 0x64ffda,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.3
        });
        
        const blur = new THREE.Mesh(blurGeometry, blurMaterial);
        group.add(blur);
        blurs.push(blur);
        
        // Animate blur positions in orbit
        const angle = (i / blurCount) * Math.PI * 2;
        const radius = 0.5;
        
        gsap.to(blur.position, {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: 0,
            duration: 3 + i * 0.5,
            repeat: -1,
            ease: "sine.inOut",
            yoyo: true
        });
        
        gsap.to(blur.material, {
            opacity: 0.1 + Math.random() * 0.3,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Create measurement apparatus
    const apparatusGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32, 1, true);
    const apparatusMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        emissive: 0x444444,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const apparatus = new THREE.Mesh(apparatusGeometry, apparatusMaterial);
    apparatus.rotation.x = Math.PI / 2;
    apparatus.position.set(0, 0, -3);
    group.add(apparatus);
    
    // Create measurement beam
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 16);
    const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    beam.position.copy(apparatus.position);
    group.add(beam);
    
    // Store interaction function
    group.userData = {
        particle,
        blurs,
        beam,
        apparatus,
        measured: false,
        measureParticle: () => {
            if (group.userData.measured) return;
            
            // Activate measurement beam
            gsap.to(beam.material, {
                opacity: 0.8,
                duration: 0.5,
                ease: "power1.out"
            });
            
            gsap.to(beam.position, {
                z: -1.5,
                duration: 1,
                delay: 0.5,
                ease: "power1.inOut",
                onComplete: () => {
                    // Measurement effect
                    const flashGeometry = new THREE.SphereGeometry(1.2, 32, 32);
                    const flashMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                    flash.position.copy(particle.position);
                    group.add(flash);
                    
                    gsap.to(flash.scale, {
                        x: 2,
                        y: 2,
                        z: 2,
                        duration: 0.5,
                        ease: "power1.out",
                        onComplete: () => {
                            group.remove(flash);
                        }
                    });
                    
                    gsap.to(flash.material, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power1.out"
                    });
                    
                    // Hide blur particles
                    blurs.forEach(blur => {
                        gsap.to(blur.material, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power1.out"
                        });
                    });
                    
                    // Solidify main particle
                    gsap.to(particle.material, {
                        opacity: 1,
                        emissiveIntensity: 0.8,
                        duration: 0.5,
                        ease: "power1.out"
                    });
                    
                    // Fix a color for the particle (collapse to a definite state)
                    particle.material.color.set(0x64ffda);
                    particle.material.emissive.set(0x64ffda);
                    
                    group.userData.measured = true;
                }
            });
            
            // Fade out beam after measurement
            gsap.to(beam.material, {
                opacity: 0,
                duration: 0.5,
                delay: 2,
                ease: "power1.in"
            });
            
            gsap.to(beam.position, {
                z: -3,
                duration: 0.5,
                delay: 2.5,
                ease: "power1.in"
            });
        },
        resetParticle: () => {
            if (!group.userData.measured) return;
            
            // Reset beam
            beam.position.copy(apparatus.position);
            beam.material.opacity = 0;
            
            // Show blur particles again
            blurs.forEach(blur => {
                gsap.to(blur.material, {
                    opacity: 0.1 + Math.random() * 0.3,
                    duration: 0.5,
                    ease: "power1.out"
                });
            });
            
            // Return main particle to superposition
            gsap.to(particle.material, {
                opacity: 0.7,
                emissiveIntensity: 0.5,
                duration: 0.5,
                ease: "power1.out"
            });
            
            group.userData.measured = false;
        }
    };
}

// Create the Quantum Maze scene (Verse 7)
function createQuantumMazeScene() {
    const group = verses1To14Scenes[6];
    
    // Create maze structure
    const mazeSize = 5;
    const cellSize = 1;
    const mazeWalls = [];
    const wallHeight = 0.5;
    const wallThickness = 0.1;
    
    // Simple maze layout (1 = wall, 0 = path)
    const mazeLayout = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ];
    
    // Create maze walls
    for (let i = 0; i < mazeLayout.length; i++) {
        for (let j = 0; j < mazeLayout[i].length; j++) {
            if (mazeLayout[i][j] === 1) {
                const wallGeometry = new THREE.BoxGeometry(cellSize, wallHeight, cellSize);
                const wallMaterial = new THREE.MeshStandardMaterial({
                    color: 0x64ffda,
                    emissive: 0x64ffda,
                    emissiveIntensity: 0.2,
                    transparent: true,
                    opacity: 0.7
                });
                
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(
                    (j - mazeLayout[i].length / 2) * cellSize,
                    0,
                    (i - mazeLayout.length / 2) * cellSize
                );
                
                group.add(wall);
                mazeWalls.push(wall);
                
                // Wall pulse animation
                gsap.to(wall.material, {
                    emissiveIntensity: 0.1 + Math.random() * 0.2,
                    opacity: 0.5 + Math.random() * 0.3,
                    duration: 2 + Math.random() * 3,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }
    }
    
    // Create player
    const playerGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const playerMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.8
    });
    
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(-2.5, 0, -0.5);
    group.add(player);
    
    // Create target
    const targetGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const targetMaterial = new THREE.MeshStandardMaterial({
        color: 0xff64a5,
        emissive: 0xff64a5,
        emissiveIntensity: 0.8
    });
    
    const target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(2.5, 0, 0.5);
    group.add(target);
    
    // Create quantum compass
    const compassGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const compassMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
    });
    
    const compass = new THREE.Mesh(compassGeometry, compassMaterial);
    compass.position.set(0, -0.5, -3);
    compass.rotation.x = Math.PI / 2;
    group.add(compass);
    
    // Create compass needle
    const needleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
    const needleMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });
    
    const needle = new THREE.Mesh(needleGeometry, needleMaterial);
    needle.position.copy(compass.position);
    needle.rotation.x = Math.PI / 2;
    group.add(needle);
    
    // Store interaction functions
    group.userData = {
        player,
        target,
        compass,
        needle,
        mazeWalls,
        playerPosition: { x: 1, z: 1 }, // Grid position
        compassActive: false,
        
        movePlayer: (direction) => {
            const currentPos = { ...group.userData.playerPosition };
            let newPos = { ...currentPos };
            
            // Calculate new position
            switch (direction) {
                case 'up':
                    newPos.z -= 1;
                    break;
                case 'down':
                    newPos.z += 1;
                    break;
                case 'left':
                    newPos.x -= 1;
                    break;
                case 'right':
                    newPos.x += 1;
                    break;
            }
            
            // Check if new position is valid (not a wall)
            if (mazeLayout[newPos.z + 3][newPos.x + 3] === 0) {
                group.userData.playerPosition = newPos;
                
                // Animate player movement
                gsap.to(player.position, {
                    x: (newPos.x - 3) * cellSize,
                    z: (newPos.z - 3) * cellSize,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                // Check if reached target
                if (newPos.x === 2 && newPos.z === 0) {
                    console.log("Reached the target!");
                    
                    // Create celebration effect
                    const celebrationGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                    const celebrationMaterial = new THREE.MeshStandardMaterial({
                        color: 0xffd700,
                        emissive: 0xffd700,
                        emissiveIntensity: 1,
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    for (let i = 0; i < 20; i++) {
                        const particle = new THREE.Mesh(celebrationGeometry, celebrationMaterial.clone());
                        particle.position.copy(target.position);
                        group.add(particle);
                        
                        gsap.to(particle.position, {
                            x: target.position.x + (Math.random() - 0.5) * 3,
                            y: target.position.y + (Math.random() - 0.5) * 3,
                            z: target.position.z + (Math.random() - 0.5) * 3,
                            duration: 1 + Math.random(),
                            ease: "power1.out"
                        });
                        
                        gsap.to(particle.material, {
                            opacity: 0,
                            duration: 1 + Math.random(),
                            ease: "power1.out",
                            onComplete: () => {
                                group.remove(particle);
                            }
                        });
                    }
                }
            } else {
                // Hit wall effect
                const hitEffect = new THREE.Mesh(
                    new THREE.SphereGeometry(0.3, 16, 16),
                    new THREE.MeshBasicMaterial({
                        color: 0xff0000,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                hitEffect.position.copy(player.position);
                group.add(hitEffect);
                
                gsap.to(hitEffect.scale, {
                    x: 2,
                    y: 2,
                    z: 2,
                    duration: 0.5,
                    ease: "power1.out",
                    onComplete: () => {
                        group.remove(hitEffect);
                    }
                });
                
                gsap.to(hitEffect.material, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power1.out"
                });
            }
        },
        
        toggleCompass: (active) => {
            group.userData.compassActive = active;
            
            gsap.to(compass.material, {
                emissiveIntensity: active ? 0.8 : 0.3,
                opacity: active ? 1 : 0.7,
                duration: 0.5,
                ease: "power2.out"
            });
            
            gsap.to(needle.material, {
                emissiveIntensity: active ? 1 : 0.5,
                duration: 0.5,
                ease: "power2.out"
            });
            
            // Show hidden paths if compass is active
            mazeWalls.forEach(wall => {
                if (Math.random() < 0.3) {
                    gsap.to(wall.material, {
                        opacity: active ? 0.3 : 0.7,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
            
            // Point needle to target when compass is active
            if (active) {
                const angle = Math.atan2(
                    target.position.z - player.position.z,
                    target.position.x - player.position.x
                );
                
                gsap.to(needle.rotation, {
                    z: angle + Math.PI/2,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                gsap.to(needle.rotation, {
                    z: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        }
    };
}

// Create the Quantum Coin scene (Verse 8)
function createQuantumCoinScene() {
    const group = verses1To14Scenes[7];
    
    // Create massive coin
    const coinRadius = 2;
    const coinThickness = 0.2;
    
    const coinGeometry = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 64);
    const coinMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xffd700,
        emissiveIntensity: 0.2
    });
    
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.rotation.x = Math.PI / 2;
    group.add(coin);
    
    // Create wave pattern side (side 1)
    const waveSideGeometry = new THREE.CircleGeometry(coinRadius * 0.95, 64);
    const waveSideMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.3
    });
    
    const waveSide = new THREE.Mesh(waveSideGeometry, waveSideMaterial);
    waveSide.position.set(0, coinThickness/2 + 0.01, 0);
    coin.add(waveSide);
    
    // Create particle pattern side (side 2)
    const particleSideGeometry = new THREE.CircleGeometry(coinRadius * 0.95, 64);
    const particleSideMaterial = new THREE.MeshStandardMaterial({
        color: 0xff64a5,
        emissive: 0xff64a5,
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.3
    });
    
    const particleSide = new THREE.Mesh(particleSideGeometry, particleSideMaterial);
    particleSide.position.set(0, -coinThickness/2 - 0.01, 0);
    particleSide.rotation.x = Math.PI;
    coin.add(particleSide);
    
    // Add wave patterns to wave side
    const waveCount = 5;
    for (let i = 0; i < waveCount; i++) {
        const waveSegments = 128;
        const wavePoints = [];
        
        for (let j = 0; j <= waveSegments; j++) {
            const theta = (j / waveSegments) * Math.PI * 2;
            const radius = coinRadius * 0.7 * (0.8 + 0.2 * Math.sin(theta * (i + 3)));
            
            wavePoints.push(
                new THREE.Vector3(
                    radius * Math.cos(theta),
                    coinThickness/2 + 0.02 + i * 0.01,
                    radius * Math.sin(theta)
                )
            );
        }
        
        const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
        const waveMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8 - i * 0.1
        });
        
        const wave = new THREE.Line(waveGeometry, waveMaterial);
        coin.add(wave);
        
        // Animate wave pulse
        gsap.to(wave.scale, {
            x: 0.8 + Math.random() * 0.4,
            y: 1,
            z: 0.8 + Math.random() * 0.4,
            duration: 2 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Add particle dots to particle side
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const dotGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const dotMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.8
        });
        
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        
        // Position in clusters
        const angle = Math.random() * Math.PI * 2;
        const clusterCount = 5;
        const clusterIndex = Math.floor(Math.random() * clusterCount);
        const clusterRadius = 0.3;
        const clusterAngle = (clusterIndex / clusterCount) * Math.PI * 2;
        const clusterX = (coinRadius * 0.7) * Math.cos(clusterAngle);
        const clusterZ = (coinRadius * 0.7) * Math.sin(clusterAngle);
        
        dot.position.set(
            clusterX + Math.cos(angle) * clusterRadius * Math.random(),
            -coinThickness/2 - 0.02 - Math.random() * 0.05,
            clusterZ + Math.sin(angle) * clusterRadius * Math.random()
        );
        
        coin.add(dot);
        
        // Pulse animation
        gsap.to(dot.material, {
            emissiveIntensity: 0.4 + Math.random() * 0.4,
            duration: 0.5 + Math.random() * 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Store interaction functions
    group.userData = {
        coin,
        currentSide: 'wave', // Start with wave side up
        
        flipCoin: () => {
            // Determine target rotation based on current side
            const targetRotation = group.userData.currentSide === 'wave' ? Math.PI : 0;
            
            // Flip animation
            gsap.to(coin.rotation, {
                y: `+=${Math.PI * 4 + targetRotation}`, // Multiple rotations for effect
                duration: 2,
                ease: "power2.inOut",
                onComplete: () => {
                    // Update current side
                    group.userData.currentSide = group.userData.currentSide === 'wave' ? 'particle' : 'wave';
                    
                    // Set final rotation precisely
                    coin.rotation.y = group.userData.currentSide === 'wave' ? 0 : Math.PI;
                }
            });
            
            // Scale effect during flip
            gsap.to(coin.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            });
            
            // Create glow effect during flip
            const glowGeometry = new THREE.RingGeometry(coinRadius, coinRadius + 0.5, 64);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.rotation.x = Math.PI / 2;
            group.add(glow);
            
            gsap.to(glow.scale, {
                x: 2,
                y: 2,
                z: 2,
                duration: 2,
                ease: "power1.out",
                onComplete: () => {
                    group.remove(glow);
                }
            });
            
            gsap.to(glow.material, {
                opacity: 0,
                duration: 2,
                ease: "power1.out"
            });
        }
    };
}

// Create the Quantum Lenses scene (Verse 9)
function createQuantumLensesScene() {
    const group = verses1To14Scenes[8];
    
    // Create base image (Buddha figure, initially blurry)
    const imageGeometry = new THREE.PlaneGeometry(4, 4);
    const imageMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x444444,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.5
    });
    
    const image = new THREE.Mesh(imageGeometry, imageMaterial);
    group.add(image);
    
    // Create Buddha silhouette (made of particles)
    const particleCount = 500;
    const particleGroup = new THREE.Group();
    group.add(particleGroup);
    
    // Define Buddha shape as points
    const createBuddhaPoints = () => {
        const points = [];
        
        // Head
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.8 * Math.sqrt(Math.random());
            points.push({
                x: radius * Math.cos(angle),
                y: 1.5 + radius * Math.sin(angle),
                z: 0
            });
        }
        
        // Body
        for (let i = 0; i < 150; i++) {
            const y = -1 + Math.random() * 2.5;
            const width = 0.8 - Math.abs(y) * 0.2;
            points.push({
                x: (Math.random() - 0.5) * width * 2,
                y: y,
                z: 0
            });
        }
        
        // Legs (crossed)
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI;
            const radius = 1.2 * Math.sqrt(Math.random());
            points.push({
                x: radius * Math.cos(angle),
                y: -1.5 + radius * Math.sin(angle) * 0.5,
                z: 0
            });
        }
        
        return points;
    };
    
    const buddhaPoints = createBuddhaPoints();
    
    // Create particles for the Buddha image
    for (let i = 0; i < particleCount; i++) {
        const pointIndex = Math.floor(Math.random() * buddhaPoints.length);
        const point = buddhaPoints[pointIndex];
        
        const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Initial position (blurry)
        const blurFactor = 0.5;
        particle.position.set(
            point.x + (Math.random() - 0.5) * blurFactor,
            point.y + (Math.random() - 0.5) * blurFactor,
            point.z + (Math.random() - 0.5) * blurFactor
        );
        
        // Store original position for animation
        particle.userData = {
            originalX: point.x,
            originalY: point.y,
            originalZ: point.z,
            currentBlur: blurFactor
        };
        
        particleGroup.add(particle);
    }
    
    // Create quantum lenses
    const lensRadius = 1;
    const lensThickness = 0.1;
    
    // Wave lens
    const waveLensGeometry = new THREE.CylinderGeometry(lensRadius, lensRadius, lensThickness, 32);
    const waveLensMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const waveLens = new THREE.Mesh(waveLensGeometry, waveLensMaterial);
    waveLens.position.set(-2, -1.5, -1);
    waveLens.rotation.x = Math.PI / 2;
    group.add(waveLens);
    
    // Wave patterns on wave lens
    const wavePattern = new THREE.Group();
    waveLens.add(wavePattern);
    
    for (let i = 0; i < 3; i++) {
        const radius = lensRadius * 0.7 * (1 - i * 0.2);
        const wavePoints = [];
        
        for (let j = 0; j <= 64; j++) {
            const theta = (j / 64) * Math.PI * 2;
            wavePoints.push(
                new THREE.Vector3(
                    radius * Math.cos(theta),
                    lensThickness/2 + 0.01,
                    radius * Math.sin(theta)
                )
            );
        }
        
        const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
        const waveMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8 - i * 0.2
        });
        
        const wave = new THREE.Line(waveGeometry, waveMaterial);
        wavePattern.add(wave);
    }
    
    // Particle lens
    const particleLensGeometry = new THREE.CylinderGeometry(lensRadius, lensRadius, lensThickness, 32);
    const particleLensMaterial = new THREE.MeshStandardMaterial({
        color: 0xff64a5,
        emissive: 0xff64a5,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const particleLens = new THREE.Mesh(particleLensGeometry, particleLensMaterial);
    particleLens.position.set(2, -1.5, -1);
    particleLens.rotation.x = Math.PI / 2;
    group.add(particleLens);
    
    // Particle patterns on particle lens
    const particlePattern = new THREE.Group();
    particleLens.add(particlePattern);
    
    for (let i = 0; i < 20; i++) {
        const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const dotMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.8
        });
        
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * lensRadius * 0.8;
        dot.position.set(
            radius * Math.cos(angle),
            lensThickness/2 + 0.01,
            radius * Math.sin(angle)
        );
        
        particlePattern.add(dot);
    }
    
    // Store interaction functions
    group.userData = {
        waveLens,
        particleLens,
        particleGroup,
        waveLensValue: 0,
        particleLensValue: 0,
        
        adjustWaveLens: (value) => {
            group.userData.waveLensValue = value / 100; // Normalize to 0-1
            updateBuddhaClarity();
        },
        
        adjustParticleLens: (value) => {
            group.userData.particleLensValue = value / 100; // Normalize to 0-1
            updateBuddhaClarity();
        }
    };
    
    // Function to update Buddha clarity based on lens values
    function updateBuddhaClarity() {
        const waveValue = group.userData.waveLensValue;
        const particleValue = group.userData.particleLensValue;
        
        // Calculate clarity (maximum clarity when both lenses are at 50%)
        const waveFactor = 1 - Math.abs(waveValue - 0.5) * 2; // 1 at 0.5, 0 at 0 or 1
        const particleFactor = 1 - Math.abs(particleValue - 0.5) * 2; // 1 at 0.5, 0 at 0 or 1
        const clarity = waveFactor * particleFactor;
        
        // Update particle positions based on clarity
        const blurAmount = 0.5 * (1 - clarity);
        
        particleGroup.children.forEach(particle => {
            const { originalX, originalY, originalZ } = particle.userData;
            
            gsap.to(particle.position, {
                x: originalX + (Math.random() - 0.5) * blurAmount,
                y: originalY + (Math.random() - 0.5) * blurAmount,
                z: originalZ + (Math.random() - 0.5) * blurAmount,
                duration: 0.3,
                ease: "power1.out"
            });
            
            gsap.to(particle.material, {
                opacity: 0.3 + clarity * 0.7,
                emissiveIntensity: 0.3 + clarity * 0.7,
                duration: 0.3,
                ease: "power1.out"
            });
        });
        
        // Update lens positions and effects
        gsap.to(waveLens.position, {
            y: -1.5 + waveValue * 2,
            duration: 0.3,
            ease: "power1.out"
        });
        
        gsap.to(waveLens.material, {
            emissiveIntensity: 0.5 + waveValue * 0.5,
            opacity: 0.5 + waveValue * 0.5,
            duration: 0.3,
            ease: "power1.out"
        });
        
        gsap.to(particleLens.position, {
            y: -1.5 + particleValue * 2,
            duration: 0.3,
            ease: "power1.out"
        });
        
        gsap.to(particleLens.material, {
            emissiveIntensity: 0.5 + particleValue * 0.5,
            opacity: 0.5 + particleValue * 0.5,
            duration: 0.3,
            ease: "power1.out"
        });
        
        // Special effect when perfect alignment is achieved
        if (clarity > 0.9) {
            // Create glow effect
            const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.5,
                side: THREE.BackSide
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            group.add(glow);
            
            gsap.to(glow.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 1,
                ease: "power1.out",
                onComplete: () => {
                    gsap.to(glow.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 1,
                        ease: "power1.in",
                        onComplete: () => {
                            group.remove(glow);
                        }
                    });
                }
            });
        }
    }
}

// Create the Quantum Ladder scene (Verse 10)
function createQuantumLadderScene() {
    const group = verses1To14Scenes[9];
    
    // Create the ladder
    const ladderHeight = 7;
    const ladderWidth = 3;
    const rungCount = 5;
    const ladder = new THREE.Group();
    group.add(ladder);
    
    // Uprights
    const uprightGeometry = new THREE.CylinderGeometry(0.1, 0.1, ladderHeight, 16);
    const uprightMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.3
    });
    
    const leftUpright = new THREE.Mesh(uprightGeometry, uprightMaterial);
    leftUpright.position.set(-ladderWidth / 2, 0, 0);
    ladder.add(leftUpright);
    
    const rightUpright = new THREE.Mesh(uprightGeometry, uprightMaterial);
    rightUpright.position.set(ladderWidth / 2, 0, 0);
    ladder.add(rightUpright);
    
    // Rungs (steps) with equations
    const rungs = [];
    const equations = [
        "Ψ = Σ c_i |ψ_i⟩",
        "ΔxΔp ≥ ℏ/2",
        "E = ℏω",
        "H|ψ⟩ = E|ψ⟩",
        "U|ψ⟩ = e^(-iHt/ℏ)|ψ⟩"
    ];
    
    for (let i = 0; i < rungCount; i++) {
        const y = -ladderHeight/2 + (i+1) * (ladderHeight/(rungCount+1));
        
        // Rung
        const rungGeometry = new THREE.CylinderGeometry(0.05, 0.05, ladderWidth, 16);
        const rungMaterial = new THREE.MeshStandardMaterial({
            color: 0x64ffda,
            emissive: 0x64ffda,
            emissiveIntensity: 0.3
        });
        
        rungGeometry.rotateZ(Math.PI / 2);
        const rung = new THREE.Mesh(rungGeometry, rungMaterial);
        rung.position.set(0, y, 0);
        ladder.add(rung);
        
        // Equation platform
        const platformGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x64ffda,
            emissive: 0x64ffda,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, y, 0.3);
        ladder.add(platform);
        
        // Glow effect for platforms
        gsap.to(platform.material, {
            emissiveIntensity: 0.1 + Math.random() * 0.3,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        rungs.push({
            rung,
            platform,
            y,
            equation: equations[i],
            solved: false
        });
    }
    
    // Create climber (player)
    const climberGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const climberMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    
    const climber = new THREE.Mesh(climberGeometry, climberMaterial);
    climber.position.set(0, -ladderHeight/2, 0.5);
    group.add(climber);
    
    // Create nirvana platform at the top
    const nirvanaGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const nirvanaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const nirvana = new THREE.Mesh(nirvanaGeometry, nirvanaMaterial);
    nirvana.position.set(0, ladderHeight/2 + 1, 0);
    group.add(nirvana);
    
    // Nirvana glow effect
    const nirvanaGlowGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const nirvanaGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const nirvanaGlow = new THREE.Mesh(nirvanaGlowGeometry, nirvanaGlowMaterial);
    nirvanaGlow.position.copy(nirvana.position);
    group.add(nirvanaGlow);
    
    // Animate the glow
    gsap.to(nirvanaGlow.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    gsap.to(nirvanaGlowMaterial, {
        opacity: 0.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Store interaction functions
    group.userData = {
        ladder,
        rungs,
        climber,
        nirvana,
        currentRung: -1,
        
        solveEquation: () => {
            const nextRung = group.userData.currentRung + 1;
            
            if (nextRung < rungs.length && !rungs[nextRung].solved) {
                // Mark the equation as solved
                rungs[nextRung].solved = true;
                
                // Create solving effect
                const effectGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const effectMaterial = new THREE.MeshBasicMaterial({
                    color: 0x64ffda,
                    transparent: true,
                    opacity: 0.8
                });
                
                const effect = new THREE.Mesh(effectGeometry, effectMaterial);
                effect.position.copy(rungs[nextRung].platform.position);
                group.add(effect);
                
                gsap.to(effect.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                    duration: 1,
                    ease: "power1.out",
                    onComplete: () => {
                        group.remove(effect);
                    }
                });
                
                gsap.to(effect.material, {
                    opacity: 0,
                    duration: 1,
                    ease: "power1.out"
                });
                
                // Change platform appearance to indicate it's solved
                gsap.to(rungs[nextRung].platform.material, {
                    emissiveIntensity: 0.8,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                console.log(`Equation solved: ${rungs[nextRung].equation}`);
                return true;
            }
            
            return false;
        },
        
        climbNextStep: () => {
            const nextRung = group.userData.currentRung + 1;
            
            if (nextRung < rungs.length && rungs[nextRung].solved) {
                // Climb to the next rung
                gsap.to(climber.position, {
                    y: rungs[nextRung].y,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                group.userData.currentRung = nextRung;
                console.log(`Climbed to rung ${nextRung + 1}`);
                
                // If we've reached the top rung, enable final climb to nirvana
                if (nextRung === rungs.length - 1) {
                    console.log("Ready for nirvana!");
                    
                    // Create special effect to indicate readiness
                    const readyEffectGeometry = new THREE.RingGeometry(0.3, 0.4, 32);
                    const readyEffectMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffd700,
                        transparent: true,
                        opacity: 0.8,
                        side: THREE.DoubleSide
                    });
                    
                    const readyEffect = new THREE.Mesh(readyEffectGeometry, readyEffectMaterial);
                    readyEffect.position.copy(climber.position);
                    readyEffect.rotation.x = Math.PI / 2;
                    group.add(readyEffect);
                    
                    gsap.to(readyEffect.scale, {
                        x: 5,
                        y: 5,
                        z: 1,
                        duration: 2,
                        ease: "power1.out",
                        onComplete: () => {
                            group.remove(readyEffect);
                        }
                    });
                    
                    gsap.to(readyEffect.material, {
                        opacity: 0,
                        duration: 2,
                        ease: "power1.out"
                    });
                    
                    // Make the final climb to nirvana possible
                    setTimeout(() => {
                        gsap.to(climber.position, {
                            y: nirvana.position.y,
                            duration: 2,
                            ease: "power2.inOut",
                            onComplete: () => {
                                // Celebration effect
                                const celebrationGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                                const celebrationMaterial = new THREE.MeshBasicMaterial({
                                    color: 0xffd700,
                                    transparent: true,
                                    opacity: 0.8
                                });
                                
                                for (let i = 0; i < 30; i++) {
                                    const particle = new THREE.Mesh(celebrationGeometry, celebrationMaterial.clone());
                                    particle.position.copy(nirvana.position);
                                    group.add(particle);
                                    
                                    gsap.to(particle.position, {
                                        x: nirvana.position.x + (Math.random() - 0.5) * 4,
                                        y: nirvana.position.y + (Math.random() - 0.5) * 4,
                                        z: nirvana.position.z + (Math.random() - 0.5) * 4,
                                        duration: 2 + Math.random(),
                                        ease: "power1.out"
                                    });
                                    
                                    gsap.to(particle.material, {
                                        opacity: 0,
                                        duration: 2 + Math.random(),
                                        ease: "power1.out",
                                        onComplete: () => {
                                            group.remove(particle);
                                        }
                                    });
                                }
                                
                                // Enhance nirvana glow
                                gsap.to(nirvanaGlowMaterial, {
                                    opacity: 0.6,
                                    duration: 1,
                                    ease: "power2.out",
                                    yoyo: true,
                                    repeat: 3
                                });
                            }
                        });
                    }, 1000);
                }
                
                return true;
            }
            
            return false;
        }
    };
}

// Create the Quantum Snake scene (Verse 11)
function createQuantumSnakeScene() {
    const group = verses1To14Scenes[10];
    
    // Create quantum snake (wave function)
    const snakeSegments = 20;
    const snakeLength = 5;
    const snakePoints = [];
    const snake = new THREE.Group();
    group.add(snake);
    
    // Create initial snake shape (sine wave)
    for (let i = 0; i <= snakeSegments; i++) {
        const t = i / snakeSegments;
        const x = (t - 0.5) * snakeLength;
        const y = Math.sin(t * Math.PI * 2) * 0.5;
        const z = 0;
        
        snakePoints.push(new THREE.Vector3(x, y, z));
    }
    
    // Create the snake mesh
    const snakeCurve = new THREE.CatmullRomCurve3(snakePoints);
    const snakeGeometry = new THREE.TubeGeometry(snakeCurve, 64, 0.1, 16, false);
    const snakeMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.4
    });
    
    const snakeMesh = new THREE.Mesh(snakeGeometry, snakeMaterial);
    snake.add(snakeMesh);
    
    // Add energy flow along the snake
    const flowCount = 10;
    const flows = [];
    
    for (let i = 0; i < flowCount; i++) {
        const flowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const flowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        const flow = new THREE.Mesh(flowGeometry, flowMaterial);
        snake.add(flow);
        flows.push(flow);
        
        // Position along the snake with delay
        gsap.to(flow, {
            motionPath: {
                path: snakeCurve,
                alignOrientation: true,
                curviness: 0,
                useRadians: true
            },
            duration: 4,
            repeat: -1,
            delay: i * 0.4,
            ease: "none"
        });
        
        // Pulse animation
        gsap.to(flow.material, {
            opacity: 0.4 + Math.random() * 0.4,
            duration: 1 + Math.random(),
            repeat: -1,
            yoyo: true,
            delay: i * 0.2,
            ease: "sine.inOut"
        });
    }
    
    // Add snake head
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.8
    });
    
    const snakeHead = new THREE.Mesh(headGeometry, headMaterial);
    snakeHead.position.copy(snakePoints[0]);
    snake.add(snakeHead);
    
    // Add eyes to head
    const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.1, 0.1, 0.15);
    snakeHead.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.1, -0.15);
    snakeHead.add(rightEye);
    
    // Store interaction functions
    group.userData = {
        snake,
        snakeMesh,
        snakeHead,
        flows,
        snakeCurve,
        currentState: 'neutral',
        
        correctGrab: () => {
            if (group.userData.currentState !== 'neutral') return;
            group.userData.currentState = 'correct';
            
            // Animate snake into a harmonious spiral
            const newPoints = [];
            for (let i = 0; i <= snakeSegments; i++) {
                const t = i / snakeSegments;
                const angle = t * Math.PI * 4;
                const radius = 2 * (1 - t * 0.7);
                
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                const z = 0;
                
                newPoints.push(new THREE.Vector3(x, y, z));
            }
            
            const newCurve = new THREE.CatmullRomCurve3(newPoints);
            
            // Update the geometry
            updateSnakeGeometry(newCurve);
            
            // Change snake color to indicate harmony
            gsap.to(snakeMesh.material, {
                color: new THREE.Color(0xffd700),
                emissive: new THREE.Color(0xffd700),
                emissiveIntensity: 0.8,
                duration: 1,
                ease: "power2.out"
            });
            
            // Create energy burst effect
            const burstGeometry = new THREE.SphereGeometry(0.2, 32, 32);
            const burstMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            
            const burst = new THREE.Mesh(burstGeometry, burstMaterial);
            burst.position.copy(snakeHead.position);
            group.add(burst);
            
            gsap.to(burst.scale, {
                x: 10,
                y: 10,
                z: 10,
                duration: 2,
                ease: "power1.out",
                onComplete: () => {
                    group.remove(burst);
                }
            });
            
            gsap.to(burst.material, {
                opacity: 0,
                duration: 2,
                ease: "power1.out"
            });
        },
        
        incorrectGrab: () => {
            if (group.userData.currentState !== 'neutral') return;
            group.userData.currentState = 'incorrect';
            
            // Animate snake into a chaotic, collapsing form
            const newPoints = [];
            for (let i = 0; i <= snakeSegments; i++) {
                const x = (Math.random() - 0.5) * 5;
                const y = (Math.random() - 0.5) * 5;
                const z = (Math.random() - 0.5) * 5;
                
                newPoints.push(new THREE.Vector3(x, y, z));
            }
            
            const newCurve = new THREE.CatmullRomCurve3(newPoints);
            
            // Update the geometry
            updateSnakeGeometry(newCurve);
            
            // Change snake color to indicate disharmony
            gsap.to(snakeMesh.material, {
                color: new THREE.Color(0xff0000),
                emissive: new THREE.Color(0xff0000),
                emissiveIntensity: 0.8,
                duration: 1,
                ease: "power2.out"
            });
            
            // Create chaotic effect
            for (let i = 0; i < 20; i++) {
                const fragmentGeometry = new THREE.TetrahedronGeometry(0.2, 0);
                const fragmentMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    transparent: true,
                    opacity: 0.8
                });
                
                const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
                fragment.position.copy(newPoints[Math.floor(Math.random() * newPoints.length)]);
                group.add(fragment);
                
                gsap.to(fragment.position, {
                    x: fragment.position.x + (Math.random() - 0.5) * 5,
                    y: fragment.position.y + (Math.random() - 0.5) * 5,
                    z: fragment.position.z + (Math.random() - 0.5) * 5,
                    duration: 2 + Math.random(),
                    ease: "power1.out"
                });
                
                gsap.to(fragment.material, {
                    opacity: 0,
                    duration: 2 + Math.random(),
                    ease: "power1.out",
                    onComplete: () => {
                        group.remove(fragment);
                    }
                });
            }
        },
        
        resetSnake: () => {
            if (group.userData.currentState === 'neutral') return;
            group.userData.currentState = 'neutral';
            
            // Reset snake to original form
            const newPoints = [];
            for (let i = 0; i <= snakeSegments; i++) {
                const t = i / snakeSegments;
                const x = (t - 0.5) * snakeLength;
                const y = Math.sin(t * Math.PI * 2) * 0.5;
                const z = 0;
                
                newPoints.push(new THREE.Vector3(x, y, z));
            }
            
            const newCurve = new THREE.CatmullRomCurve3(newPoints);
            
            // Update the geometry
            updateSnakeGeometry(newCurve);
            
            // Reset color
            gsap.to(snakeMesh.material, {
                color: new THREE.Color(0x64ffda),
                emissive: new THREE.Color(0x64ffda),
                emissiveIntensity: 0.5,
                duration: 1,
                ease: "power2.out"
            });
            
            // Reset head position
            snakeHead.position.copy(newPoints[0]);
            
            // Create reset effect
            const resetEffect = new THREE.Mesh(
                new THREE.RingGeometry(0.5, 0.6, 32),
                new THREE.MeshBasicMaterial({
                    color: 0x64ffda,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                })
            );
            resetEffect.position.set(0, 0, 0);
            resetEffect.rotation.x = Math.PI / 2;
            group.add(resetEffect);
            
            gsap.to(resetEffect.scale, {
                x: 10,
                y: 10,
                z: 1,
                duration: 2,
                ease: "power1.out",
                onComplete: () => {
                    group.remove(resetEffect);
                }
            });
            
            gsap.to(resetEffect.material, {
                opacity: 0,
                duration: 2,
                ease: "power1.out"
            });
        }
    };
    
    // Helper function to update snake geometry
    function updateSnakeGeometry(newCurve) {
        // Update curve
        group.userData.snakeCurve = newCurve;
        
        // Create new geometry
        const newGeometry = new THREE.TubeGeometry(newCurve, 64, 0.1, 16, false);
        
        // Update mesh
        snakeMesh.geometry.dispose();
        snakeMesh.geometry = newGeometry;
        
        // Update head position
        snakeHead.position.copy(newCurve.getPoint(0));
        
        // Update flow animations
        flows.forEach((flow, index) => {
            // Kill previous animation
            gsap.killTweensOf(flow);
            
            // Create new animation
            gsap.to(flow, {
                motionPath: {
                    path: newCurve,
                    alignOrientation: true,
                    curviness: 0,
                    useRadians: true
                },
                duration: 4,
                repeat: -1,
                delay: index * 0.4,
                ease: "none"
            });
        });
    }
}

// Create the Quantum Puzzle Cube scene (Verse 12)
function createQuantumPuzzleCubeScene() {
    const group = verses1To14Scenes[11];
    
    // Create main puzzle cube
    const cubeSize = 3;
    const segmentCount = 3;
    const puzzleCube = new THREE.Group();
    group.add(puzzleCube);
    
    // Create smaller cube segments
    const segments = [];
    const segmentSize = cubeSize / segmentCount;
    
    for (let x = 0; x < segmentCount; x++) {
        for (let y = 0; y < segmentCount; y++) {
            for (let z = 0; z < segmentCount; z++) {
                // Skip center cube
                if (x === 1 && y === 1 && z === 1) continue;
                
                const segmentGeometry = new THREE.BoxGeometry(
                    segmentSize * 0.9,
                    segmentSize * 0.9,
                    segmentSize * 0.9
                );
                
                const hue = (x + y + z) / (3 * segmentCount);
                const segmentMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(hue, 0.7, 0.5),
                    emissive: new THREE.Color().setHSL(hue, 0.7, 0.3),
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.9
                });
                
                const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
                segment.position.set(
                    (x - segmentCount/2 + 0.5) * segmentSize,
                    (y - segmentCount/2 + 0.5) * segmentSize,
                    (z - segmentCount/2 + 0.5) * segmentSize
                );
                
                puzzleCube.add(segment);
                segments.push({
                    mesh: segment,
                    originalPosition: segment.position.clone(),
                    originalRotation: segment.rotation.clone(),
                    material: segmentMaterial
                });
                
                // Pulse animation
                gsap.to(segment.material, {
                    emissiveIntensity: 0.3 + Math.random() * 0.4,
                    duration: 1 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }
    }
    
    // Add quantum particles around the cube
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position in a spherical shell around the cube
        const radius = cubeSize + 0.5 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        group.add(particle);
        particles.push(particle);
        
        // Orbit animation
        const orbitDuration = 10 + Math.random() * 10;
        const orbitRadius = particle.position.length();
        const randomAxis = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        gsap.to(particle.position, {
            duration: orbitDuration,
            repeat: -1,
            ease: "none",
            onUpdate: function() {
                const progress = this.progress();
                const angle = progress * Math.PI * 2;
                
                // Rotate around random axis
                const rotationMatrix = new THREE.Matrix4().makeRotationAxis(randomAxis, angle);
                const startPoint = new THREE.Vector3(0, 0, orbitRadius);
                particle.position.copy(startPoint).applyMatrix4(rotationMatrix);
            }
        });
        
        // Pulse animation
        gsap.to(particle.material, {
            opacity: 0.3 + Math.random() * 0.4,
            duration: 1 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Create central hidden Buddha image
    const buddhaGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const buddhaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0
    });
    
    const buddha = new THREE.Mesh(buddhaGeometry, buddhaMaterial);
    group.add(buddha);
    
    // Store interaction functions
    group.userData = {
        puzzleCube,
        segments,
        particles,
        buddha,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        progress: 0,
        
        rotateX: (value) => {
            const normalizedValue = value / 100; // 0 to 1
            group.userData.rotationX = normalizedValue * Math.PI * 2;
            
            gsap.to(puzzleCube.rotation, {
                x: group.userData.rotationX,
                duration: 0.5,
                ease: "power2.out"
            });
            
            checkAlignment();
        },
        
        rotateY: (value) => {
            const normalizedValue = value / 100; // 0 to 1
            group.userData.rotationY = normalizedValue * Math.PI * 2;
            
            gsap.to(puzzleCube.rotation, {
                y: group.userData.rotationY,
                duration: 0.5,
                ease: "power2.out"
            });
            
            checkAlignment();
        },
        
        rotateZ: (value) => {
            const normalizedValue = value / 100; // 0 to 1
            group.userData.rotationZ = normalizedValue * Math.PI * 2;
            
            gsap.to(puzzleCube.rotation, {
                z: group.userData.rotationZ,
                duration: 0.5,
                ease: "power2.out"
            });
            
            checkAlignment();
        }
    };
    
    // Function to check if the cube is aligned correctly
    function checkAlignment() {
        // Calculate closeness to correct alignment
        // (In this version, we use a predefined "correct" alignment)
        const targetX = Math.PI / 4;
        const targetY = Math.PI / 3;
        const targetZ = Math.PI / 6;
        
        const errorX = Math.abs(normalizeAngle(group.userData.rotationX) - normalizeAngle(targetX));
        const errorY = Math.abs(normalizeAngle(group.userData.rotationY) - normalizeAngle(targetY));
        const errorZ = Math.abs(normalizeAngle(group.userData.rotationZ) - normalizeAngle(targetZ));
        
        const maxError = Math.PI / 6; // Tolerance
        const progress = 1 - Math.max(errorX, errorY, errorZ) / maxError;
        group.userData.progress = Math.max(0, Math.min(1, progress));
        
        // Update visual feedback
        updatePuzzleState(group.userData.progress);
        
        // If perfectly aligned, reveal the Buddha
        if (group.userData.progress > 0.9) {
            revealBuddha();
        }
    }
    
    // Helper to normalize angle to 0-2PI
    function normalizeAngle(angle) {
        return angle % (Math.PI * 2);
    }
    
    // Update puzzle state based on alignment progress
    function updatePuzzleState(progress) {
        // Update segment positions - move towards center as progress increases
        segments.forEach(segment => {
            const targetPosition = segment.originalPosition.clone().multiplyScalar(1 - progress * 0.5);
            
            gsap.to(segment.mesh.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Update glow intensity
            gsap.to(segment.material, {
                emissiveIntensity: 0.5 + progress * 0.5,
                opacity: 0.9 - progress * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Update particles - move outward as progress increases
        particles.forEach(particle => {
            const currentRadius = particle.position.length();
            const targetRadius = cubeSize + 0.5 + progress * 2;
            const ratio = targetRadius / currentRadius;
            
            gsap.to(particle.position, {
                x: particle.position.x * ratio,
                y: particle.position.y * ratio,
                z: particle.position.z * ratio,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Update glow intensity
            gsap.to(particle.material, {
                emissiveIntensity: 0.8 + progress * 0.2,
                opacity: 0.7 + progress * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }
    
    // Reveal Buddha function
    function revealBuddha() {
        if (buddhaMaterial.opacity > 0) return; // Already revealed
        
        // Fade in Buddha
        gsap.to(buddhaMaterial, {
            opacity: 1,
            duration: 2,
            ease: "power2.out"
        });
        
        // Create revelation effect
        const effectGeometry = new THREE.SphereGeometry(1, 32, 32);
        const effectMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.8,
            side: THREE.BackSide
        });
        
        const effect = new THREE.Mesh(effectGeometry, effectMaterial);
        group.add(effect);
        
        gsap.to(effect.scale, {
            x: 5,
            y: 5,
            z: 5,
            duration: 3,
            ease: "power1.out",
            onComplete: () => {
                group.remove(effect);
            }
        });
        
        gsap.to(effect.material, {
            opacity: 0,
            duration: 3,
            ease: "power1.out"
        });
        
        // Celebration particles
        for (let i = 0; i < 30; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(0, 0, 0);
            group.add(particle);
            
            gsap.to(particle.position, {
                x: (Math.random() - 0.5) * 5,
                y: (Math.random() - 0.5) * 5,
                z: (Math.random() - 0.5) * 5,
                duration: 2 + Math.random(),
                ease: "power1.out"
            });
            
            gsap.to(particle.material, {
                opacity: 0,
                duration: 2 + Math.random(),
                ease: "power1.out",
                onComplete: () => {
                    group.remove(particle);
                }
            });
        }
    }
}

// Create the Quantum Engine scene (Verse 13)
function createQuantumEngineScene() {
    const group = verses1To14Scenes[12];
    
    // Create engine core
    const coreGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    // Create inner components
    const innerGroup = new THREE.Group();
    group.add(innerGroup);
    
    // Rotating quantum gates
    const gateCount = 6;
    const gates = [];
    
    for (let i = 0; i < gateCount; i++) {
        const angle = (i / gateCount) * Math.PI * 2;
        const radius = 0.8;
        
        const gateGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const gateMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const gate = new THREE.Mesh(gateGeometry, gateMaterial);
        gate.position.set(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
        );
        
        innerGroup.add(gate);
        gates.push(gate);
        
        // Rotate animation
        gsap.to(gate.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            z: Math.PI * 2,
            duration: 5 + i,
            repeat: -1,
            ease: "none"
        });
    }
    
    // Energy streams
    const streamCount = 12;
    const streams = [];
    
    for (let i = 0; i < streamCount; i++) {
        const angle = (i / streamCount) * Math.PI * 2;
        
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        
        const outerRadius = 0.9;
        points.push(new THREE.Vector3(
            outerRadius * Math.cos(angle),
            outerRadius * Math.sin(angle),
            0
        ));
        
        const streamGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const streamMaterial = new THREE.LineBasicMaterial({
            color: 0x64ffda,
            transparent: true,
            opacity: 0.7
        });
        
        const stream = new THREE.Line(streamGeometry, streamMaterial);
        innerGroup.add(stream);
        streams.push({
            line: stream,
            angle: angle,
            material: streamMaterial
        });
        
        // Pulse animation
        gsap.to(streamMaterial, {
            opacity: 0.3 + Math.random() * 0.4,
            duration: 1 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Outer ring components
    const componentCount = 8;
    const components = [];
    
    for (let i = 0; i < componentCount; i++) {
        const angle = (i / componentCount) * Math.PI * 2;
        const radius = 1.5;
        
        const componentGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
        const componentMaterial = new THREE.MeshStandardMaterial({
            color: 0xff64a5,
            emissive: 0xff64a5,
            emissiveIntensity: 0.5
        });
        
        const component = new THREE.Mesh(componentGeometry, componentMaterial);
        component.position.set(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
        );
        
        // Orient towards center
        component.lookAt(0, 0, 0);
        
        group.add(component);
        components.push(component);
    }
    
    // Create outer particles in superposition
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position in a spherical shell around
        const radius = 2 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        group.add(particle);
        particles.push(particle);
        
        // Orbit animation
        const orbitDuration = 5 + Math.random() * 5;
        const orbitRadius = particle.position.length();
        const randomAxis = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        gsap.to(particle.position, {
            duration: orbitDuration,
            repeat: -1,
            ease: "none",
            onUpdate: function() {
                const progress = this.progress();
                const angle = progress * Math.PI * 2;
                
                // Rotate around random axis
                const rotationMatrix = new THREE.Matrix4().makeRotationAxis(randomAxis, angle);
                const startPoint = new THREE.Vector3(0, 0, orbitRadius);
                particle.position.copy(startPoint).applyMatrix4(rotationMatrix);
            }
        });
    }
    
    // Store interaction functions
    group.userData = {
        core,
        innerGroup,
        gates,
        streams,
        components,
        particles,
        engineRunning: true,
        phase: 0,
        amplitude: 0.5,
        superposition: true,
        
        adjustPhase: (value) => {
            const normalizedValue = value / 100; // 0 to 1
            group.userData.phase = normalizedValue * Math.PI * 2;
            
            // Adjust inner group rotation
            gsap.to(innerGroup.rotation, {
                z: group.userData.phase,
                duration: 0.5,
                ease: "power2.out"
            });
            
            // Adjust stream colors based on phase
            streams.forEach(stream => {
                const hue = (0.5 + normalizedValue * 0.3) % 1; // Cyan to blue-green range
                stream.material.color.setHSL(hue, 0.8, 0.5);
            });
            
            updateEngineState();
        },
        
        adjustAmplitude: (value) => {
            const normalizedValue = value / 100; // 0 to 1
            group.userData.amplitude = normalizedValue;
            
            // Adjust core glow intensity
            gsap.to(coreMaterial, {
                emissiveIntensity: 0.3 + normalizedValue * 0.7,
                duration: 0.5,
                ease: "power2.out"
            });
            
            // Adjust component scale
            components.forEach(component => {
                gsap.to(component.scale, {
                    x: 0.5 + normalizedValue * 1.5,
                    y: 0.5 + normalizedValue * 1.5,
                    z: 0.5 + normalizedValue * 1.5,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            
            updateEngineState();
        },
        
        toggleSuperposition: (active) => {
            group.userData.superposition = active;
            
            // Update particle behavior
            particles.forEach(particle => {
                if (active) {
                    // Spread out particles (superposition)
                    const currentRadius = particle.position.length();
                    const targetRadius = 2 + Math.random() * 0.5;
                    const ratio = targetRadius / currentRadius;
                    
                    gsap.to(particle.position, {
                        x: particle.position.x * ratio,
                        y: particle.position.y * ratio,
                        z: particle.position.z * ratio,
                        duration: 1,
                        ease: "power2.out"
                    });
                    
                    // Make particles fuzzier
                    gsap.to(particle.material, {
                        opacity: 0.7,
                        duration: 1,
                        ease: "power2.out"
                    });
                } else {
                    // Collapse particles into ring (definite state)
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 2;
                    
                    gsap.to(particle.position, {
                        x: radius * Math.cos(angle),
                        y: radius * Math.sin(angle),
                        z: 0,
                        duration: 1,
                        ease: "power2.out"
                    });
                    
                    // Make particles more definite
                    gsap.to(particle.material, {
                        opacity: 1,
                        duration: 1,
                        ease: "power2.out"
                    });
                }
            });
            
            updateEngineState();
        }
    };
    
    // Function to update overall engine state
    function updateEngineState() {
        // Calculate engine efficiency based on current settings
        const phase = group.userData.phase;
        const amplitude = group.userData.amplitude;
        const superposition = group.userData.superposition;
        
        // Optimal efficiency is at phase = π/4, amplitude = 0.7, superposition = true
        const phaseOptimal = Math.PI / 4;
        const amplitudeOptimal = 0.7;
        
        const phaseError = Math.abs(phase - phaseOptimal) / Math.PI;
        const amplitudeError = Math.abs(amplitude - amplitudeOptimal);
        
        let efficiency = 1 - (phaseError * 0.5 + amplitudeError * 0.5);
        if (!superposition) efficiency *= 0.7;
        
        // Create visual feedback of engine efficiency
        const rotationSpeed = 0.5 + efficiency * 2;
        
        // Adjust core rotation speed
        gsap.to(core.rotation, {
            z: `+=${Math.PI * 2}`,
            duration: 5 / rotationSpeed,
            repeat: -1,
            ease: "none",
            overwrite: true
        });
        
        // Adjust gate colors based on efficiency
        gates.forEach(gate => {
            const hue = efficiency * 0.3; // Red to green
            gate.material.color.setHSL(hue, 0.8, 0.5);
            gate.material.emissive.setHSL(hue, 0.8, 0.3);
        });
        
        // If efficiency is very high, create special effect
        if (efficiency > 0.9) {
            // Create burst effect
            const burstGeometry = new THREE.SphereGeometry(0.2, 32, 32);
            const burstMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            
            const burst = new THREE.Mesh(burstGeometry, burstMaterial);
            group.add(burst);
            
            gsap.to(burst.scale, {
                x: 15,
                y: 15,
                z: 15,
                duration: 2,
                ease: "power1.out",
                onComplete: () => {
                    group.remove(burst);
                }
            });
            
            gsap.to(burst.material, {
                opacity: 0,
                duration: 2,
                ease: "power1.out"
            });
        }
    }
}

// Create the Quantum Canvas scene (Verse 14)
function createQuantumCanvasScene() {
    const group = verses1To14Scenes[13];
    
    // Create canvas background
    const canvasGeometry = new THREE.PlaneGeometry(6, 4);
    const canvasMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x222222,
        emissiveIntensity: 0.2,
        metalness: 0.2,
        roughness: 0.8
    });
    
    const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
    group.add(canvas);
    
    // Create border for canvas
    const borderGeometry = new THREE.PlaneGeometry(6.2, 4.2);
    const borderMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        emissive: 0x64ffda,
        emissiveIntensity: 0.3
    });
    
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.01;
    group.add(border);
    
    // Create particles in superposition
    const maxParticles = 200;
    const particles = [];
    const particleGroup = new THREE.Group();
    group.add(particleGroup);
    
    // Store interaction functions
    group.userData = {
        canvas,
        particleGroup,
        particles,
        isObserving: false,
        
        addParticles: () => {
            const batchSize = 20;
            if (particles.length >= maxParticles) return;
            
            for (let i = 0; i < batchSize; i++) {
                if (particles.length >= maxParticles) break;
                
                // Create particle in superposition
                const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                
                // Random color
                const hue = Math.random();
                const particleMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(hue, 0.8, 0.5),
                    emissive: new THREE.Color().setHSL(hue, 0.8, 0.3),
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.8
                });
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                // Random position on canvas
                const x = (Math.random() - 0.5) * 5.5;
                const y = (Math.random() - 0.5) * 3.5;
                const z = 0.01;
                
                particle.position.set(x, y, z);
                particleGroup.add(particle);
                
                // Create superposition effect for each particle
                const superpositionCount = 5;
                const ghostParticles = [];
                
                for (let j = 0; j < superpositionCount; j++) {
                    const ghostGeometry = new THREE.SphereGeometry(0.03, 8, 8);
                    const ghostMaterial = new THREE.MeshStandardMaterial({
                        color: particleMaterial.color.clone(),
                        emissive: particleMaterial.emissive.clone(),
                        emissiveIntensity: 0.3,
                        transparent: true,
                        opacity: 0.4
                    });
                    
                    const ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
                    ghost.position.copy(particle.position);
                    particleGroup.add(ghost);
                    ghostParticles.push(ghost);
                    
                    // Animate ghost position
                    const radius = 0.2 + Math.random() * 0.3;
                    const angle = (j / superpositionCount) * Math.PI * 2;
                    
                    gsap.to(ghost.position, {
                        x: particle.position.x + radius * Math.cos(angle),
                        y: particle.position.y + radius * Math.sin(angle),
                        duration: 2 + Math.random() * 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                    
                    // Pulse animation
                    gsap.to(ghost.material, {
                        opacity: 0.1 + Math.random() * 0.3,
                        duration: 1 + Math.random() * 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                }
                
                particles.push({
                    main: particle,
                    ghosts: ghostParticles,
                    collapsed: false
                });
            }
        },
        
        clearCanvas: () => {
            // Remove all particles
            particles.forEach(particle => {
                particleGroup.remove(particle.main);
                particle.ghosts.forEach(ghost => {
                    particleGroup.remove(ghost);
                });
            });
            
            particles.length = 0;
        },
        
        observeParticles: (observe) => {
            group.userData.isObserving = observe;
            
            particles.forEach(particle => {
                if (observe && !particle.collapsed) {
                    // Collapse wave function - make ghosts disappear
                    particle.ghosts.forEach(ghost => {
                        gsap.to(ghost.scale, {
                            x: 0,
                            y: 0,
                            z: 0,
                            duration: 0.5,
                            ease: "power1.in",
                            onComplete: () => {
                                particleGroup.remove(ghost);
                            }
                        });
                    });
                    
                    // Make main particle more definite
                    gsap.to(particle.main.material, {
                        opacity: 1,
                        emissiveIntensity: 0.8,
                        duration: 0.5,
                        ease: "power1.out"
                    });
                    
                    // Create collapse effect
                    const effectGeometry = new THREE.RingGeometry(0.05, 0.15, 16);
                    const effectMaterial = new THREE.MeshBasicMaterial({
                        color: particle.main.material.color,
                        transparent: true,
                        opacity: 0.8,
                        side: THREE.DoubleSide
                    });
                    
                    const effect = new THREE.Mesh(effectGeometry, effectMaterial);
                    effect.position.copy(particle.main.position);
                    effect.rotation.x = Math.PI / 2;
                    particleGroup.add(effect);
                    
                    gsap.to(effect.scale, {
                        x: 5,
                        y: 5,
                        z: 1,
                        duration: 1,
                        ease: "power1.out",
                        onComplete: () => {
                            particleGroup.remove(effect);
                        }
                    });
                    
                    gsap.to(effect.material, {
                        opacity: 0,
                        duration: 1,
                        ease: "power1.out"
                    });
                    
                    particle.collapsed = true;
                } else if (!observe && particle.collapsed) {
                    // Recreate superposition effect
                    const superpositionCount = 5;
                    const newGhosts = [];
                    
                    for (let j = 0; j < superpositionCount; j++) {
                        const ghostGeometry = new THREE.SphereGeometry(0.03, 8, 8);
                        const ghostMaterial = new THREE.MeshStandardMaterial({
                            color: particle.main.material.color.clone(),
                            emissive: particle.main.material.emissive.clone(),
                            emissiveIntensity: 0.3,
                            transparent: true,
                            opacity: 0
                        });
                        
                        const ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
                        ghost.position.copy(particle.main.position);
                        ghost.scale.set(0, 0, 0);
                        particleGroup.add(ghost);
                        newGhosts.push(ghost);
                        
                        // Animate ghost appearance
                        gsap.to(ghost.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.5,
                            ease: "power1.out"
                        });
                        
                        gsap.to(ghost.material, {
                            opacity: 0.4,
                            duration: 0.5,
                            ease: "power1.out"
                        });
                        
                        // Animate ghost position
                        const radius = 0.2 + Math.random() * 0.3;
                        const angle = (j / superpositionCount) * Math.PI * 2;
                        
                        gsap.to(ghost.position, {
                            x: particle.main.position.x + radius * Math.cos(angle),
                            y: particle.main.position.y + radius * Math.sin(angle),
                            duration: 2 + Math.random() * 2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                        
                        // Pulse animation
                        gsap.to(ghost.material, {
                            opacity: 0.1 + Math.random() * 0.3,
                            duration: 1 + Math.random() * 2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut",
                            delay: 0.5
                        });
                    }
                    
                    // Update particle ghosts
                    particle.ghosts = newGhosts;
                    
                    // Make main particle less definite
                    gsap.to(particle.main.material, {
                        opacity: 0.8,
                        emissiveIntensity: 0.5,
                        duration: 0.5,
                        ease: "power1.out"
                    });
                    
                    particle.collapsed = false;
                }
            });
        }
    };
}

// Functions to handle loading and transitioning between verses
function loadVerse(verseNum) {
    // Update current verse
    currentVerse = verseNum;
    
    // Clear the scene of current verse
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    
    // Add lighting back
    setupLighting();
    
    // Add the appropriate verse scene
    scene.add(verses1To14Scenes[currentVerse - 1]);
    
    // Reset camera position
    camera.position.set(0, 0, 5);
    controls.target.set(0, 0, 0);
    controls.update();
    
    // Update UI
    document.getElementById('verse-number').textContent = `Verse ${currentVerse}`;
    document.getElementById('verse-text').textContent = verses[currentVerse - 1].text;
    document.getElementById('explanation').textContent = verses[currentVerse - 1].explanation;
    
    // Add accessible explanation
    const accessibilityText = createAccessibilityExplanation(currentVerse);
    document.getElementById('accessibility-explanation').textContent = accessibilityText;
    
    // Update verse dots
    const verseDots = document.querySelectorAll('.verse-dot');
    verseDots.forEach(dot => {
        dot.classList.remove('active');
        if (parseInt(dot.getAttribute('data-verse')) === currentVerse) {
            dot.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentVerse === 1;
    nextBtn.disabled = currentVerse === verses.length;
    
    // Update interaction controls
    updateInteractionControls();
    
    // Close mobile panel after loading verse
    if (isMobile) {
        const textPanel = document.getElementById('text-panel');
        textPanel.classList.remove('open');
        document.getElementById('panel-toggle').textContent = '≡';
        document.getElementById('panel-toggle').setAttribute('aria-expanded', 'false');
    }
    
    // Announce verse change for screen readers
    announceVerseChange(currentVerse);
}

// Create accessibility explanation for each verse
function createAccessibilityExplanation(verseNum) {
    const verse = verses[verseNum - 1];
    
    // Base explanation template
    let explanation = '';
    
    switch (verseNum) {
        case 1:
            explanation = "This visualization shows a double-slit experiment. You can toggle between observing and not observing particles, demonstrating how observation affects quantum behavior - particles behave as waves when unobserved, showing an interference pattern, and as distinct particles when observed. This illustrates how emptiness means dependent existence, not non-existence.";
            break;
        case 2:
            explanation = "This visualization shows a quantum circuit with qubits as glowing lines. You can apply quantum gates to transform the qubits, demonstrating how operations within a framework of emptiness make meaningful outcomes possible, just as practices within Buddhist understanding lead to liberation.";
            break;
        case 3:
            explanation = "This visualization shows an atom with electron energy levels. Each level represents one of the 'four fruits' of Buddhist practice. You can add energy (photons) to make electrons jump to higher levels, demonstrating how specific conditions lead to transitions on the path to enlightenment.";
            break;
        case 4:
            explanation = "This visualization shows entangled quantum particles connected by shimmering lines. Adjusting one particle affects all others instantly, demonstrating how the Sangha (community), Dharma (teachings), and Buddha are interconnected and interdependent.";
            break;
        case 5:
            explanation = "This visualization shows three connected nodes representing Buddha, Dharma, and Sangha. Activating any node affects the entire system, demonstrating how properties are determined by the whole system, not individual parts, just as emptiness doesn't negate the three jewels but defines their nature.";
            break;
        case 6:
            explanation = "This visualization shows a quantum particle in superposition. Using the measurement tool stabilizes its state, demonstrating how conventional properties arise from measurement, just as emptiness doesn't negate conventional reality but is the basis for it.";
            break;
        case 7:
            explanation = "This visualization shows a quantum maze that shifts and changes. Using the quantum compass reveals the correct path, demonstrating how understanding emptiness leads to clarity, while misunderstanding leads to confusion.";
            break;
        case 8:
            explanation = "This visualization shows a quantum coin with wave patterns on one side and particle dots on the other. Flipping the coin lets you explore both aspects, demonstrating the two truths in Buddhism: conventional and ultimate.";
            break;
        case 9:
            explanation = "This visualization shows two quantum lenses (wave and particle) that must be aligned to see a clear Buddha image. This demonstrates that understanding both conventional and ultimate truths is essential for understanding the Buddha's teaching.";
            break;
        case 10:
            explanation = "This visualization shows a quantum ladder with mathematical equations as steps. Solving equations lets you climb higher, demonstrating how conventional truth (the equations) is necessary to reach ultimate truth (nirvana).";
            break;
        case 11:
            explanation = "This visualization shows a quantum 'snake' (wave function) that can be handled correctly or incorrectly. This demonstrates how misunderstanding emptiness can be harmful, just as misapplying quantum principles leads to errors.";
            break;
        case 12:
            explanation = "This visualization shows a quantum puzzle cube with shifting pieces. Rotating the pieces in specific ways reveals a hidden Buddha image, demonstrating the profundity and elusiveness of emptiness that made the Buddha initially reluctant to teach.";
            break;
        case 13:
            explanation = "This visualization shows a quantum engine with unusual behaviors. Adjusting its components shows it functioning despite quantum oddities, demonstrating that emptiness doesn't lead to nihilistic consequences but is the foundation of reality.";
            break;
        case 14:
            explanation = "This visualization shows a quantum canvas where particles exist in multiple states simultaneously. When observed, they collapse to one form, demonstrating how emptiness (like superposition) enables all possibilities.";
            break;
    }
    
    return explanation;
}

// Announce verse change for screen readers
function announceVerseChange(verseNum) {
    // Create an aria-live region if it doesn't exist
    let announcer = document.getElementById('verse-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'verse-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('class', 'sr-only');
        document.body.appendChild(announcer);
    }
    
    // Announce the verse change
    announcer.textContent = `Now viewing verse ${verseNum}. ${verses[verseNum - 1].text}`;
}

// Update interaction controls for the current verse
function updateInteractionControls() {
    const interactionControls = document.getElementById('interaction-controls');
    interactionControls.innerHTML = '';
    
    const verse = verses[currentVerse - 1];
    
    if (verse.interaction) {
        const interactionText = document.createElement('div');
        interactionText.classList.add('interaction-text');
        interactionText.textContent = verse.interaction;
        interactionControls.appendChild(interactionText);
    }
    
    if (verse.controls) {
        verse.controls.forEach(control => {
            switch (control.type) {
                case 'button':
                    const button = document.createElement('button');
                    button.textContent = control.label;
                    button.classList.add('interaction-button');
                    button.setAttribute('aria-label', control.label);
                    button.addEventListener('click', () => {
                        handleInteraction(control.id);
                    });
                    interactionControls.appendChild(button);
                    break;
                    
                case 'toggle':
                    const toggleContainer = document.createElement('div');
                    toggleContainer.classList.add('toggle-container');
                    
                    const toggleLabel = document.createElement('label');
                    toggleLabel.textContent = control.label;
                    toggleLabel.setAttribute('id', `${control.id}-label`);
                    toggleContainer.appendChild(toggleLabel);
                    
                    const toggle = document.createElement('button');
                    toggle.classList.add('interaction-button');
                    toggle.textContent = 'Off';
                    toggle.setAttribute('aria-labelledby', `${control.id}-label`);
                    toggle.setAttribute('role', 'switch');
                    toggle.setAttribute('aria-checked', 'false');
                    
                    let toggleState = false;
                    
                    toggle.addEventListener('click', () => {
                        toggleState = !toggleState;
                        toggle.textContent = toggleState ? 'On' : 'Off';
                        toggle.classList.toggle('active', toggleState);
                        toggle.setAttribute('aria-checked', toggleState.toString());
                        handleInteraction(control.id, toggleState);
                    });
                    
                    toggleContainer.appendChild(toggle);
                    interactionControls.appendChild(toggleContainer);
                    break;
                    
                case 'slider':
                    const sliderContainer = document.createElement('div');
                    sliderContainer.classList.add('slider-container');
                    
                    const sliderLabel = document.createElement('label');
                    sliderLabel.textContent = control.label;
                    sliderLabel.setAttribute('for', control.id);
                    sliderContainer.appendChild(sliderLabel);
                    
                    const slider = document.createElement('input');
                    slider.type = 'range';
                    slider.min = '0';
                    slider.max = '100';
                    slider.value = '50';
                    slider.id = control.id;
                    slider.classList.add('interaction-slider');
                    slider.setAttribute('aria-labelledby', `${control.id}-label`);
                    
                    slider.addEventListener('input', () => {
                        handleInteraction(control.id, parseInt(slider.value));
                    });
                    
                    sliderContainer.appendChild(slider);
                    interactionControls.appendChild(sliderContainer);
                    break;
                    
                case 'drag':
                    // For simplicity, we'll use a button for drag in this version
                    const dragButton = document.createElement('button');
                    dragButton.textContent = `Apply ${control.label}`;
                    dragButton.classList.add('interaction-button');
                    dragButton.setAttribute('aria-label', `Apply ${control.label}`);
                    dragButton.addEventListener('click', () => {
                        handleInteraction(control.id);
                    });
                    interactionControls.appendChild(dragButton);
                    break;
            }
        });
    }
}

// Handle interaction with controls
function handleInteraction(controlId, value) {
    const currentVerseScene = verses1To14Scenes[currentVerse - 1];
    
    switch (controlId) {
        // Verse 1: Double Slit
        case 'toggle-observation':
            currentVerseScene.userData.toggleObservation(value);
            break;
            
        // Verse 2: Quantum Circuit
        case 'hadamard-gate':
            currentVerseScene.userData.applyHadamard();
            break;
        case 'cnot-gate':
            currentVerseScene.userData.applyCNOT();
            break;
        case 'reset-circuit':
            currentVerseScene.userData.resetCircuit();
            break;
            
        // Verse 3: Atom Energy Levels
        case 'add-photon':
            currentVerseScene.userData.addPhoton();
            break;
            
        // Verse 4: Entangled Particles
        case 'adjust-particle':
            currentVerseScene.userData.adjustParticle(value);
            break;
            
        // Verse 5: Three Jewels Network
        case 'buddha-node':
            currentVerseScene.userData.activateNode('buddha');
            break;
        case 'dharma-node':
            currentVerseScene.userData.activateNode('dharma');
            break;
        case 'sangha-node':
            currentVerseScene.userData.activateNode('sangha');
            break;
            
        // Verse 6: Quantum Measurement
        case 'measure-particle':
            currentVerseScene.userData.measureParticle();
            break;
        case 'reset-particle':
            currentVerseScene.userData.resetParticle();
            break;
            
        // Verse 7: Quantum Maze
        case 'move-up':
            currentVerseScene.userData.movePlayer('up');
            break;
        case 'move-down':
            currentVerseScene.userData.movePlayer('down');
            break;
        case 'move-left':
            currentVerseScene.userData.movePlayer('left');
            break;
        case 'move-right':
            currentVerseScene.userData.movePlayer('right');
            break;
        case 'quantum-compass':
            currentVerseScene.userData.toggleCompass(value);
            break;
            
        // Verse 8: Quantum Coin
        case 'flip-coin':
            currentVerseScene.userData.flipCoin();
            break;
            
        // Verse 9: Quantum Lenses
        case 'wave-lens':
            currentVerseScene.userData.adjustWaveLens(value);
            break;
        case 'particle-lens':
            currentVerseScene.userData.adjustParticleLens(value);
            break;
            
        // Verse 10: Quantum Ladder
        case 'solve-equation':
            currentVerseScene.userData.solveEquation();
            break;
        case 'next-step':
            currentVerseScene.userData.climbNextStep();
            break;
            
        // Verse 11: Quantum Snake
        case 'correct-grab':
            currentVerseScene.userData.correctGrab();
            break;
        case 'incorrect-grab':
            currentVerseScene.userData.incorrectGrab();
            break;
        case 'reset-snake':
            currentVerseScene.userData.resetSnake();
            break;
            
        // Verse 12: Quantum Puzzle Cube
        case 'rotate-x':
            currentVerseScene.userData.rotateX(value);
            break;
        case 'rotate-y':
            currentVerseScene.userData.rotateY(value);
            break;
        case 'rotate-z':
            currentVerseScene.userData.rotateZ(value);
            break;
            
        // Verse 13: Quantum Engine
        case 'adjust-phase':
            currentVerseScene.userData.adjustPhase(value);
            break;
        case 'adjust-amplitude':
            currentVerseScene.userData.adjustAmplitude(value);
            break;
        case 'toggle-superposition':
            currentVerseScene.userData.toggleSuperposition(value);
            break;
            
        // Verse 14: Quantum Canvas
        case 'add-particles':
            currentVerseScene.userData.addParticles();
            break;
        case 'clear-canvas':
            currentVerseScene.userData.clearCanvas();
            break;
        case 'observe-particles':
            currentVerseScene.userData.observeParticles(value);
            break;
    }
}

// Window resize handler
function onWindowResize() {
    isMobile = window.innerWidth <= 768;
    const container = document.getElementById('scene-container');
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
    
    // Close mobile panel when orientation changes
    if (isMobile) {
        const textPanel = document.getElementById('text-panel');
        textPanel.classList.remove('open');
        document.getElementById('panel-toggle').textContent = '≡';
        document.getElementById('panel-toggle').setAttribute('aria-expanded', 'false');
    }
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Update orbit controls
    controls.update();
    
    // Special animations for specific verses
    if (currentVerse === 3) {
        // Animate electrons in atom
        verses1To14Scenes[2].userData.animate();
    }
    
    // Render the scene with composer
    composer.render();
}

// Start the application
init();