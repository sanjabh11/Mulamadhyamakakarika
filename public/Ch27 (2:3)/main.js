import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import * as d3 from 'd3';
import { verses } from './config.js';

// Animation state tracking
let currentVerseIndex = 0;
let animationMixer;
let currentScene;
let renderer, camera, controls, composer;
let clock = new THREE.Clock();
let interactionMode = false;
let activeTab = 'concept';

// Set up the base renderer and camera
function initBaseScene() {
    const container = document.getElementById('animation-container');
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Set up post-processing
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(new THREE.Scene(), camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,  // strength
        0.4,  // radius
        0.85  // threshold
    );
    composer.addPass(bloomPass);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Setup UI and interaction
function setupUI() {
    const verseNumber = document.getElementById('verse-number');
    const verseText = document.getElementById('verse-text');
    const conceptText = document.getElementById('concept-text');
    const quantumText = document.getElementById('quantum-text');
    const simpleText = document.getElementById('simple-text');
    
    const toggleButton = document.getElementById('toggle-button');
    const explanationContainer = document.getElementById('explanation-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const interactButton = document.getElementById('interact-button');
    const interactionControls = document.getElementById('interaction-controls');
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Activate the clicked tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-panel`).classList.add('active');
            activeTab = tabId;
        });
    });
    
    // Update UI with current verse
    function updateVerseDisplay() {
        const verse = verses[currentVerseIndex];
        verseNumber.textContent = verse.number;
        verseText.textContent = verse.text;
        conceptText.textContent = verse.concept;
        quantumText.textContent = verse.quantum;
        simpleText.textContent = verse.simple;
        
        // Update interaction button
        interactButton.textContent = verse.interactionLabel || "Interact with Animation";
        
        // Clear previous interaction controls
        interactionControls.innerHTML = '';
        
        // Update button states
        prevButton.disabled = currentVerseIndex === 0;
        nextButton.disabled = currentVerseIndex === verses.length - 1;
        
        // Reset interaction mode
        interactionMode = false;
    }
    
    // Handle explanation toggle
    toggleButton.addEventListener('click', () => {
        explanationContainer.classList.toggle('hidden');
        toggleButton.textContent = explanationContainer.classList.contains('hidden') 
            ? 'Show Explanation' 
            : 'Hide Explanation';
    });
    
    // Handle interaction button
    interactButton.addEventListener('click', () => {
        interactionMode = !interactionMode;
        
        if (interactionMode) {
            // Create verse-specific controls
            createInteractionControls(interactionControls, currentVerseIndex);
            interactButton.textContent = "Hide Controls";
        } else {
            interactionControls.innerHTML = '';
            interactButton.textContent = verses[currentVerseIndex].interactionLabel || "Interact with Animation";
        }
    });
    
    // Handle navigation
    prevButton.addEventListener('click', () => {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            loadVerse(currentVerseIndex);
            updateVerseDisplay();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentVerseIndex < verses.length - 1) {
            currentVerseIndex++;
            loadVerse(currentVerseIndex);
            updateVerseDisplay();
        }
    });
    
    // Initial update
    updateVerseDisplay();
}

// Create verse-specific interaction controls
function createInteractionControls(container, verseIndex) {
    container.innerHTML = '';
    
    switch (verseIndex) {
        case 0: // Verse 11 - Quantum Error Correction
            createSlider(container, "Error Rate", 0, 1, 0.1, 0.01, value => {
                // Handle error rate change in verse 11 scene
                if (currentScene?.userData?.updateErrorRate) {
                    currentScene.userData.updateErrorRate(value);
                }
            });
            createButton(container, "Introduce Random Error", () => {
                // Trigger random error in verse 11 scene
                if (currentScene?.userData?.triggerError) {
                    currentScene.userData.triggerError();
                }
            });
            createButton(container, "Correct Errors", () => {
                // Trigger error correction in verse 11 scene
                if (currentScene?.userData?.correctErrors) {
                    currentScene.userData.correctErrors();
                }
            });
            break;
            
        case 1: // Verse 12 - Vacuum Fluctuations
            createSlider(container, "Vacuum Energy", 0, 1, 0.5, 0.01, value => {
                // Handle vacuum energy change in verse 12 scene
                if (currentScene?.userData?.updateVacuumEnergy) {
                    currentScene.userData.updateVacuumEnergy(value);
                }
            });
            createSlider(container, "Particle Lifetime", 0.1, 2, 1, 0.1, value => {
                // Handle particle lifetime change in verse 12 scene
                if (currentScene?.userData?.updateParticleLifetime) {
                    currentScene.userData.updateParticleLifetime(value);
                }
            });
            break;
            
        case 2: // Verse 13 - Wave Function Collapse
            createButton(container, "Reset Superposition", () => {
                // Reset to superposition state in verse 13 scene
                if (currentScene?.userData?.resetSuperposition) {
                    currentScene.userData.resetSuperposition();
                }
            });
            createButton(container, "Observe State", () => {
                // Trigger measurement/observation in verse 13 scene
                if (currentScene?.userData?.observeState) {
                    currentScene.userData.observeState();
                }
            });
            break;
            
        case 3: // Verse 14 - Future Probability
            createSlider(container, "Time Flow", 0, 2, 1, 0.1, value => {
                // Handle time flow rate change in verse 14 scene
                if (currentScene?.userData?.updateTimeFlow) {
                    currentScene.userData.updateTimeFlow(value);
                }
            });
            createButton(container, "Measure Position", () => {
                // Trigger position measurement in verse 14 scene
                if (currentScene?.userData?.measurePosition) {
                    currentScene.userData.measurePosition();
                }
            });
            break;
            
        case 4: // Verse 15 - Particle Stability
            createToggle(container, "Show Decay", value => {
                // Toggle decay visualization in verse 15 scene
                if (currentScene?.userData?.toggleDecay) {
                    currentScene.userData.toggleDecay(value);
                }
            });
            createSlider(container, "Decay Rate", 0, 1, 0.5, 0.01, value => {
                // Handle decay rate change in verse 15 scene
                if (currentScene?.userData?.updateDecayRate) {
                    currentScene.userData.updateDecayRate(value);
                }
            });
            break;
            
        case 5: // Verse 16 - Quantum Tunneling
            createSlider(container, "Barrier Height", 0.1, 2, 1, 0.1, value => {
                // Handle barrier height change in verse 16 scene
                if (currentScene?.userData?.updateBarrierHeight) {
                    currentScene.userData.updateBarrierHeight(value);
                }
            });
            createSlider(container, "Particle Energy", 0.1, 2, 0.8, 0.1, value => {
                // Handle particle energy change in verse 16 scene
                if (currentScene?.userData?.updateParticleEnergy) {
                    currentScene.userData.updateParticleEnergy(value);
                }
            });
            break;
            
        case 6: // Verse 17 - Bose-Einstein Condensate
            createSlider(container, "Temperature", 0, 1, 1, 0.01, value => {
                // Handle temperature change in verse 17 scene
                if (currentScene?.userData?.updateTemperature) {
                    currentScene.userData.updateTemperature(value);
                }
            });
            createButton(container, "Toggle States", () => {
                // Toggle between normal and condensate states in verse 17 scene
                if (currentScene?.userData?.toggleStates) {
                    currentScene.userData.toggleStates();
                }
            });
            break;
            
        case 7: // Verse 18 - Quantum Superposition
            createButton(container, "Entangle Particles", () => {
                // Trigger entanglement in verse 18 scene
                if (currentScene?.userData?.entangleParticles) {
                    currentScene.userData.entangleParticles();
                }
            });
            createButton(container, "Measure Entangled Pair", () => {
                // Trigger measurement of entanglement in verse 18 scene
                if (currentScene?.userData?.measureEntanglement) {
                    currentScene.userData.measureEntanglement();
                }
            });
            break;
            
        case 8: // Verse 19 - Black Hole Evaporation
            createSlider(container, "Evaporation Rate", 0, 1, 0.2, 0.01, value => {
                // Handle evaporation rate change in verse 19 scene
                if (currentScene?.userData?.updateEvaporationRate) {
                    currentScene.userData.updateEvaporationRate(value);
                }
            });
            createToggle(container, "Show Hawking Radiation", value => {
                // Toggle Hawking radiation visualization in verse 19 scene
                if (currentScene?.userData?.toggleRadiation) {
                    currentScene.userData.toggleRadiation(value);
                }
            });
            break;
    }
}

// Helper functions for creating controls
function createSlider(container, label, min, max, value, step, onChange) {
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'control-slider';
    
    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = label;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step;
    slider.addEventListener('input', () => onChange(parseFloat(slider.value)));
    
    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    container.appendChild(sliderContainer);
}

function createButton(container, label, onClick) {
    const button = document.createElement('button');
    button.className = 'control-button';
    button.textContent = label;
    button.addEventListener('click', onClick);
    container.appendChild(button);
}

function createToggle(container, label, onChange) {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'control-slider';
    
    const toggleLabel = document.createElement('label');
    toggleLabel.textContent = label;
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.addEventListener('change', () => onChange(toggle.checked));
    
    toggleContainer.appendChild(toggleLabel);
    toggleContainer.appendChild(toggle);
    container.appendChild(toggleContainer);
}

// Load a specific verse and its animation
function loadVerse(index) {
    // Clean up existing scene
    if (currentScene) {
        renderer.clear();
        
        // Remove all children recursively
        function removeAllChildren(obj) {
            while(obj.children.length > 0){ 
                removeAllChildren(obj.children[0]);
                obj.remove(obj.children[0]); 
            }
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => m.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        }
        
        removeAllChildren(currentScene);
        currentScene = null;
        
        if (animationMixer) {
            animationMixer.stopAllAction();
            animationMixer = null;
        }
    }
    
    // Create the new scene based on verse index
    let sceneData;
    
    switch (index) {
        case 0: sceneData = createVerse11Scene(); break;
        case 1: sceneData = createVerse12Scene(); break;
        case 2: sceneData = createVerse13Scene(); break;
        case 3: sceneData = createVerse14Scene(); break;
        case 4: sceneData = createVerse15Scene(); break;
        case 5: sceneData = createVerse16Scene(); break;
        case 6: sceneData = createVerse17Scene(); break;
        case 7: sceneData = createVerse18Scene(); break;
        case 8: sceneData = createVerse19Scene(); break;
        default: sceneData = createVerse11Scene();
    }
    
    currentScene = sceneData.scene;
    
    // Update render pass with new scene
    composer.passes[0].scene = currentScene;
    
    // Start animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update delta time
        const delta = clock.getDelta();
        
        // Update mixer if it exists
        if (animationMixer) {
            animationMixer.update(delta);
        }
        
        // Run scene-specific animation
        if (sceneData.animate) {
            sceneData.animate(delta);
        }
        
        // Update controls
        controls.update();
        
        // Render the scene with post-processing
        composer.render();
    }
    
    animate();
}

// Enhanced implementation of the first scene as an example
function createVerse11Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020924);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xa8e0ff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Quantum circuit base
    const circuitBase = new THREE.Group();
    scene.add(circuitBase);
    
    // Create quantum bit wires
    const wireGeometry = new THREE.CylinderGeometry(0.02, 0.02, 10, 16);
    const wireMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a90e2, 
        emissive: 0x172b4d,
        shininess: 70
    });
    
    // Enhanced wire visualization with quantum states
    const wires = [];
    for (let i = 0; i < 3; i++) {
        const wire = new THREE.Mesh(wireGeometry, wireMaterial);
        wire.rotation.z = Math.PI / 2; // Rotate to horizontal
        wire.position.y = i - 1;
        wire.castShadow = true;
        wire.receiveShadow = true;
        circuitBase.add(wire);
        wires.push(wire);
        
        // Add quantum state visualization
        const stateGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const stateMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x88aaff,
            shininess: 90
        });
        
        // Create state indicators along the wire
        for (let j = 0; j < 5; j++) {
            const state = new THREE.Mesh(stateGeometry, stateMaterial);
            state.position.set(-4 + j * 2, i - 1, 0);
            state.userData = {
                originalColor: new THREE.Color(0xffffff),
                errorState: false,
                corrected: false
            };
            circuitBase.add(state);
        }
    }
    
    // Create quantum gates with enhanced visuals
    const gateGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const gateMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff5a5f, 
        emissive: 0x491819,
        metalness: 0.3,
        roughness: 0.7
    });
    
    const gates = [];
    const gatePositions = [
        [-3, 0, 0, 'H'], // Hadamard gate
        [-1.5, 1, 0, 'X'], // Pauli-X gate
        [0, -1, 0, 'Z'], // Pauli-Z gate
        [1.5, 0, 0, 'CNOT'], // CNOT gate
        [3, 1, 0, 'T'] // T gate
    ];
    
    gatePositions.forEach(pos => {
        const gateGroup = new THREE.Group();
        
        // Create the gate box
        const gate = new THREE.Mesh(gateGeometry, gateMaterial);
        gate.castShadow = true;
        gate.receiveShadow = true;
        gateGroup.add(gate);
        
        // Add gate label
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 128;
        textCanvas.height = 128;
        const context = textCanvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 80px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(pos[3], 64, 64);
        
        const texture = new THREE.CanvasTexture(textCanvas);
        
        const labelGeometry = new THREE.PlaneGeometry(0.4, 0.4);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.z = 0.26;
        gateGroup.add(label);
        
        gateGroup.position.set(pos[0], pos[1], pos[2]);
        gates.push(gateGroup);
        circuitBase.add(gateGroup);
    });
    
    // Create quantum particles (qubits) with enhanced visuals
    const particleGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        emissive: 0x88ccee,
        transparent: true,
        opacity: 0.8,
        shininess: 90
    });
    
    const particles = [];
    for (let i = 0; i < 5; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.position.set(-4 + i * 2, -1 + Math.floor(Math.random() * 3), 0);
        particle.castShadow = true;
        
        // Add quantum state visualization
        const stateGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const stateWireframe = new THREE.WireframeGeometry(stateGeometry);
        const stateMaterial = new THREE.LineBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.5
        });
        
        const stateVisualization = new THREE.LineSegments(stateWireframe, stateMaterial);
        particle.add(stateVisualization);
        
        // Add particle data
        particle.userData = {
            originalColor: new THREE.Color(0xffffff),
            errorState: false,
            corrected: false,
            wirePosition: Math.floor(Math.random() * 3) // Track which wire it's on
        };
        
        particles.push(particle);
        scene.add(particle);
    }
    
    // Error particles with enhanced visualization
    const errorGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const errorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000, 
        emissive: 0x660000,
        transparent: true,
        opacity: 0.7
    });
    
    const errors = [];
    for (let i = 0; i < 3; i++) {
        const error = new THREE.Mesh(errorGeometry, errorMaterial);
        error.position.set(-3 + i * 3, -1 + Math.floor(Math.random() * 3), 0);
        error.scale.set(0, 0, 0); // Start invisible
        
        // Add pulse effect
        const pulseGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const pulseWireframe = new THREE.WireframeGeometry(pulseGeometry);
        const pulseMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.3
        });
        
        const pulseEffect = new THREE.LineSegments(pulseWireframe, pulseMaterial);
        error.add(pulseEffect);
        
        errors.push(error);
        scene.add(error);
    }
    
    // Create circuit diagram visualization using D3.js
    const createCircuitDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('circuit-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container for circuit diagram
        const svg = d3.create('svg')
            .attr('id', 'circuit-diagram')
            .attr('width', 300)
            .attr('height', 150)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
        
        // Draw circuit wires
        const wireData = [0, 1, 2];
        const wireGroup = svg.append('g')
            .attr('transform', 'translate(30, 30)');
        
        wireGroup.selectAll('.wire')
            .data(wireData)
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('y1', d => d * 40)
            .attr('x2', 240)
            .attr('y2', d => d * 40)
            .attr('stroke', '#4a90e2')
            .attr('stroke-width', 2);
        
        // Draw gates
        const gateData = gatePositions.map((pos, i) => ({
            x: ((pos[0] + 4) / 8) * 240, // Scale to fit in diagram
            y: ((pos[1] + 1) / 2) * 40,  // Map to wire positions
            label: pos[3]
        }));
        
        wireGroup.selectAll('.gate')
            .data(gateData)
            .enter()
            .append('rect')
            .attr('x', d => d.x - 15)
            .attr('y', d => d.y - 15)
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', '#ff5a5f')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1)
            .attr('rx', 3)
            .attr('ry', 3);
        
        wireGroup.selectAll('.gate-label')
            .data(gateData)
            .enter()
            .append('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y + 5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-family', 'Arial')
            .attr('font-weight', 'bold')
            .attr('font-size', '12px')
            .text(d => d.label);
        
        // Add legend for error correction
        const legend = svg.append('g')
            .attr('transform', 'translate(30, 120)');
        
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#ff0000');
        
        legend.append('text')
            .attr('x', 15)
            .attr('y', 9)
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-family', 'Arial')
            .text('Quantum Error');
        
        legend.append('rect')
            .attr('x', 120)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#00ff00');
        
        legend.append('text')
            .attr('x', 135)
            .attr('y', 9)
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-family', 'Arial')
            .text('Corrected');
        
        // Add to the DOM
        document.body.appendChild(svg.node());
    };
    
    // Create initial diagram
    createCircuitDiagram();
    
    // Add error correction visualization
    const errorCorrection = new THREE.Group();
    scene.add(errorCorrection);
    
    // Create the error detection beams
    const beamGeometry = new THREE.CylinderGeometry(0.01, 0.01, 3, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0
    });
    
    const detectionBeams = [];
    for (let i = 0; i < 3; i++) {
        const beam = new THREE.Mesh(beamGeometry, beamMaterial.clone());
        beam.position.set(0, 0, 0);
        beam.rotation.x = Math.PI / 2;
        beam.visible = false;
        detectionBeams.push(beam);
        errorCorrection.add(beam);
    }
    
    // Add scene-specific interaction handling
    let errorRate = 0.1;
    scene.userData = {
        updateErrorRate: (value) => {
            errorRate = value;
        },
        triggerError: () => {
            // Select random particle to introduce error
            const randomIndex = Math.floor(Math.random() * particles.length);
            const particle = particles[randomIndex];
            
            // Only affect if not already in error state
            if (!particle.userData.errorState) {
                particle.userData.errorState = true;
                particle.userData.corrected = false;
                particle.material.color.set(0xff0000);
                particle.scale.set(1.2, 1.2, 1.2); // Expand to show error
                
                // Show error effect
                const errorPos = particle.position.clone();
                const closestError = errors[0];
                closestError.position.copy(errorPos);
                closestError.scale.set(1, 1, 1);
                
                // Pulse animation for error
                const pulseAnimation = {
                    scale: 1,
                    update: function(delta) {
                        this.scale = 1 + Math.sin(Date.now() * 0.01) * 0.3;
                        closestError.scale.set(this.scale, this.scale, this.scale);
                        closestError.material.opacity = 0.7 - (this.scale - 1) * 0.5;
                    }
                };
                
                // Store animation in the error object
                closestError.userData.animation = pulseAnimation;
            }
        },
        correctErrors: () => {
            // Activate detection beams
            detectionBeams.forEach((beam, i) => {
                beam.visible = true;
                beam.position.set(0, i - 1, 0);
                beam.material.opacity = 0.7;
                
                // Animate beam scanning
                const scanAnimation = {
                    position: -5,
                    update: function(delta) {
                        this.position += delta * 3;
                        if (this.position > 5) {
                            beam.visible = false;
                            delete beam.userData.animation;
                            return false; // Stop animation
                        }
                        beam.position.x = this.position;
                        
                        // Check for particles in error state along this wire
                        particles.forEach(particle => {
                            if (particle.userData.errorState && 
                                !particle.userData.corrected &&
                                particle.userData.wirePosition === i &&
                                Math.abs(particle.position.x - this.position) < 0.2) {
                                
                                // Correct the error
                                particle.userData.errorState = false;
                                particle.userData.corrected = true;
                                particle.material.color.set(0x00ff00); // Green for corrected
                                particle.scale.set(1, 1, 1); // Normal size
                                
                                // Hide error effect
                                errors.forEach(error => {
                                    if (error.position.distanceTo(particle.position) < 0.5) {
                                        error.scale.set(0, 0, 0);
                                        delete error.userData.animation;
                                    }
                                });
                                
                                // Create correction effect
                                const effectGeometry = new THREE.RingGeometry(0.2, 0.3, 16);
                                const effectMaterial = new THREE.MeshBasicMaterial({
                                    color: 0x00ff00,
                                    transparent: true,
                                    opacity: 0.8,
                                    side: THREE.DoubleSide
                                });
                                
                                const correctionEffect = new THREE.Mesh(effectGeometry, effectMaterial);
                                correctionEffect.position.copy(particle.position);
                                correctionEffect.rotation.x = Math.PI / 2;
                                scene.add(correctionEffect);
                                
                                // Animate correction effect
                                const effectAnimation = {
                                    scale: 0.1,
                                    opacity: 1,
                                    update: function(delta) {
                                        this.scale += delta * 2;
                                        this.opacity -= delta * 1.5;
                                        
                                        if (this.opacity <= 0) {
                                            scene.remove(correctionEffect);
                                            return false; // Stop animation
                                        }
                                        
                                        correctionEffect.scale.set(this.scale, this.scale, this.scale);
                                        effectMaterial.opacity = this.opacity;
                                        return true;
                                    }
                                };
                                
                                correctionEffect.userData.animation = effectAnimation;
                            }
                        });
                        
                        return true; // Continue animation
                    }
                };
                
                beam.userData.animation = scanAnimation;
            });
        }
    };
    
    // Animation function
    const animate = (delta) => {
        // Animate particles moving along the circuit
        particles.forEach((particle, i) => {
            particle.position.x = (particle.position.x + 0.01) % 6 - 3;
            
            // Oscillate up and down slightly
            particle.position.y = Math.floor(particle.position.y) + Math.sin(Date.now() * 0.002 + i) * 0.2;
            
            // Update wire position in userData
            particle.userData.wirePosition = Math.floor(particle.position.y + 1);
            
            // Random error based on error rate
            if (!particle.userData.errorState && !particle.userData.corrected && Math.random() < errorRate * delta * 2) {
                scene.userData.triggerError();
            }
            
            // Reset corrected state after a while
            if (particle.userData.corrected && Math.random() < 0.01) {
                particle.userData.corrected = false;
                particle.material.color.copy(particle.userData.originalColor);
            }
        });
        
        // Animate gates pulsing
        gates.forEach((gate, i) => {
            const scale = 1 + Math.sin(Date.now() * 0.002 + i) * 0.1;
            gate.scale.set(scale, scale, scale);
        });
        
        // Update scene-specific animations
        scene.traverse(object => {
            if (object.userData && object.userData.animation) {
                const result = object.userData.animation.update(delta);
                if (result === false) {
                    delete object.userData.animation;
                }
            }
        });
    };
    
    return { scene, animate };
}

// Add missing scene creation functions
function createVerse12Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020818);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xa8e0ff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create vacuum chamber
    const vacuumGroup = new THREE.Group();
    scene.add(vacuumGroup);
    
    // Vacuum chamber container - transparent cylinder
    const chamberGeometry = new THREE.CylinderGeometry(3, 3, 5, 32, 1, true);
    const chamberMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.1,
        roughness: 0.1,
        metalness: 0.3,
        side: THREE.DoubleSide
    });
    const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    vacuumGroup.add(chamber);
    
    // End caps for cylinder
    const capGeometry = new THREE.CircleGeometry(3, 32);
    const capMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.3,
        side: THREE.DoubleSide
    });
    
    const topCap = new THREE.Mesh(capGeometry, capMaterial);
    topCap.position.y = 2.5;
    topCap.rotation.x = Math.PI / 2;
    vacuumGroup.add(topCap);
    
    const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
    bottomCap.position.y = -2.5;
    bottomCap.rotation.x = -Math.PI / 2;
    vacuumGroup.add(bottomCap);
    
    // Particle-antiparticle pair system
    const particlePairs = [];
    
    const createParticlePair = () => {
        const pair = new THREE.Group();
        
        // Particle
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x88aaff,
            emissive: 0x2244aa,
            shininess: 70
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Antiparticle
        const antiparticleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const antiparticleMaterial = new THREE.MeshPhongMaterial({
            color: 0xff8866,
            emissive: 0xaa4422,
            shininess: 70
        });
        
        const antiparticle = new THREE.Mesh(antiparticleGeometry, antiparticleMaterial);
        
        // Add to pair group
        pair.add(particle);
        pair.add(antiparticle);
        
        // Set initial position
        pair.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        
        // Add visualization effects
        const particleTrailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleTrailMaterial = new THREE.MeshBasicMaterial({
            color: 0x88aaff,
            transparent: true,
            opacity: 0.5
        });
        
        const antiparticleTrailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const antiparticleTrailMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8866,
            transparent: true,
            opacity: 0.5
        });
        
        // Store trail meshes
        pair.userData = {
            particle,
            antiparticle,
            lifetime: 3 + Math.random() * 2,
            age: 0,
            direction: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize(),
            particleTrails: [],
            antiparticleTrails: [],
            addTrail: function() {
                // Particle trail
                const pTrail = new THREE.Mesh(particleTrailGeometry, particleTrailMaterial.clone());
                pTrail.position.copy(particle.position);
                pTrail.position.x += pair.position.x;
                pTrail.position.y += pair.position.y;
                pTrail.position.z += pair.position.z;
                pTrail.material.opacity = 0.5;
                pTrail.userData = { age: 0 };
                vacuumGroup.add(pTrail);
                this.particleTrails.push(pTrail);
                
                // Antiparticle trail
                const apTrail = new THREE.Mesh(antiparticleTrailGeometry, antiparticleTrailMaterial.clone());
                apTrail.position.copy(antiparticle.position);
                apTrail.position.x += pair.position.x;
                apTrail.position.y += pair.position.y;
                apTrail.position.z += pair.position.z;
                apTrail.material.opacity = 0.5;
                apTrail.userData = { age: 0 };
                vacuumGroup.add(apTrail);
                this.antiparticleTrails.push(apTrail);
            }
        };
        
        vacuumGroup.add(pair);
        particlePairs.push(pair);
        return pair;
    };
    
    // Create initial particles
    for (let i = 0; i < 10; i++) {
        createParticlePair();
    }
    
    // Create energy field visualization
    const energyFieldGeometry = new THREE.IcosahedronGeometry(2.5, 1);
    const energyFieldWireframe = new THREE.WireframeGeometry(energyFieldGeometry);
    const energyFieldMaterial = new THREE.LineBasicMaterial({
        color: 0x44aaff,
        transparent: true,
        opacity: 0.3
    });
    
    const energyField = new THREE.LineSegments(energyFieldWireframe, energyFieldMaterial);
    vacuumGroup.add(energyField);
    
    // Create energy fluctuation visualization
    const fluctuationPoints = [];
    for (let i = 0; i < 100; i++) {
        const point = new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        fluctuationPoints.push(point);
    }
    
    const fluctuationGeometry = new THREE.BufferGeometry().setFromPoints(fluctuationPoints);
    const fluctuationMaterial = new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.05,
        transparent: true,
        opacity: 0.7
    });
    
    const fluctuations = new THREE.Points(fluctuationGeometry, fluctuationMaterial);
    vacuumGroup.add(fluctuations);
    
    // Add scene-specific interaction handling
    let vacuumEnergy = 0.5;
    let particleLifetime = 1;
    
    scene.userData = {
        updateVacuumEnergy: (value) => {
            vacuumEnergy = value;
            energyFieldMaterial.opacity = 0.1 + value * 0.4;
            fluctuationMaterial.opacity = 0.3 + value * 0.7;
        },
        updateParticleLifetime: (value) => {
            particleLifetime = value;
        }
    };
    
    // Create explanatory diagram using D3.js
    const createVacuumDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('vacuum-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container for vacuum diagram
        const svg = d3.create('svg')
            .attr('id', 'vacuum-diagram')
            .attr('width', 300)
            .attr('height', 200)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 20, right: 20, bottom: 50, left: 50};
        const width = 300 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Draw vacuum energy diagram
        const x = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);
            
        const y = d3.scaleLinear()
            .domain([-1, 1])
            .range([height, 0]);
            
        const g2 = g.append('g');
            
        // Draw axes
        g2.append('g')
            .attr('transform', `translate(0,${height/2})`)
            .call(d3.axisBottom(x).ticks(5))
            .style('color', 'white');
            
        g2.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .style('color', 'white');
            
        // Add labels
        g2.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 10)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-size', '12px')
            .text('Position');
            
        g2.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -margin.left + 15)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-size', '12px')
            .text('Vacuum Energy');
            
        // Create fluctuation line function
        const line = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasis);
            
        // Generate random fluctuation data
        const generateFluctuationData = (energy) => {
            const points = [];
            const steps = 50;
            
            for (let i = 0; i <= steps; i++) {
                const x = i * (width / steps);
                const fluctuation = Math.sin(i * 0.5) * energy * 0.5 + Math.random() * energy - energy/2;
                points.push([x, y(fluctuation)]);
            }
            
            return points;
        };
        
        // Draw initial fluctuation
        const fluctuationData = generateFluctuationData(vacuumEnergy);
        
        const fluctuationPath = g2.append('path')
            .datum(fluctuationData)
            .attr('fill', 'none')
            .attr('stroke', '#88aaff')
            .attr('stroke-width', 2)
            .attr('d', line);
            
        // Add particle pair indicators
        const particleIndicators = g2.append('g');
        
        const updateDiagram = (energy) => {
            // Update fluctuation line
            const newData = generateFluctuationData(energy);
            fluctuationPath.datum(newData).attr('d', line);
            
            // Update particle indicators
            particleIndicators.selectAll('*').remove();
            
            // Add particle-antiparticle pairs at random positions on the curve
            const numPairs = Math.round(3 + energy * 7);
            
            for (let i = 0; i < numPairs; i++) {
                const index = Math.floor(Math.random() * (newData.length - 1));
                const position = newData[index];
                
                // Particle (blue dot)
                particleIndicators.append('circle')
                    .attr('cx', position[0])
                    .attr('cy', position[1] - 5)
                    .attr('r', 3)
                    .attr('fill', '#88aaff');
                    
                // Antiparticle (orange dot)
                particleIndicators.append('circle')
                    .attr('cx', position[0])
                    .attr('cy', position[1] + 5)
                    .attr('r', 3)
                    .attr('fill', '#ff8866');
                    
                // Connection line
                particleIndicators.append('line')
                    .attr('x1', position[0])
                    .attr('y1', position[1] - 5)
                    .attr('x2', position[0])
                    .attr('y2', position[1] + 5)
                    .attr('stroke', 'rgba(255,255,255,0.5)')
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '2,2');
            }
        };
        
        // Store update function for later use
        svg.node().updateDiagram = updateDiagram;
        
        // Add to the DOM
        document.body.appendChild(svg.node());
        
        // Initial update
        updateDiagram(vacuumEnergy);
    };
    
    // Create initial diagram
    createVacuumDiagram();
    
    // Animation function
    const animate = (delta) => {
        // Rotate vacuum group slightly for visual interest
        vacuumGroup.rotation.y += delta * 0.1;
        
        // Update energy field effect
        energyField.rotation.x += delta * 0.1;
        energyField.rotation.z += delta * 0.05;
        
        const energyScale = 0.98 + Math.sin(Date.now() * 0.001) * 0.02 * vacuumEnergy;
        energyField.scale.set(energyScale, energyScale, energyScale);
        
        // Update fluctuation points
        fluctuations.rotation.x += delta * 0.2;
        fluctuations.rotation.y += delta * 0.15;
        
        const fluctuationVertices = fluctuations.geometry.attributes.position.array;
        for (let i = 0; i < fluctuationVertices.length; i += 3) {
            // Convert grid position to z (-1 to 1) and radius
            const x = fluctuationVertices[i];
            const z = fluctuationVertices[i+2];
            
            // Distance from origin
            const r = Math.sqrt(x*x);
            
            // Time-dependent sigma (spread)
            const timeProgress = (z + 5) / 10; // 0 to 1
            const sigma = 1 + timeProgress * 3; // Wider spread in the future
            
            // Gaussian height
            const height = Math.exp(-(r*r) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
            
            // Set vertex height
            fluctuationVertices[i+1] = height * 2;
        }
        
        fluctuations.geometry.attributes.position.needsUpdate = true;
        fluctuations.geometry.computeVertexNormals();
        
        // Particle pair creation and annihilation
        particlePairs.forEach((pair, index) => {
            // Update age
            pair.userData.age += delta;
            
            // Move particles apart
            const direction = pair.userData.direction;
            const speed = 0.3 * delta;
            
            pair.userData.particle.position.x = Math.sin(pair.userData.age * 2) * 0.3;
            pair.userData.particle.position.y = Math.cos(pair.userData.age * 2) * 0.3;
            pair.userData.particle.position.z = Math.sin(pair.userData.age * 3) * 0.3;
            
            pair.userData.antiparticle.position.x = -Math.sin(pair.userData.age * 2) * 0.3;
            pair.userData.antiparticle.position.y = -Math.cos(pair.userData.age * 2) * 0.3;
            pair.userData.antiparticle.position.z = -Math.sin(pair.userData.age * 3) * 0.3;
            
            // Add trails occasionally
            if (Math.random() < delta * 3) {
                pair.userData.addTrail();
            }
            
            // Update trails
            [...pair.userData.particleTrails, ...pair.userData.antiparticleTrails].forEach(trail => {
                trail.userData.age += delta;
                
                if (trail.userData.age > 1.5) {
                    // Remove old trails
                    vacuumGroup.remove(trail);
                    
                    const particleIndex = pair.userData.particleTrails.indexOf(trail);
                    if (particleIndex !== -1) {
                        pair.userData.particleTrails.splice(particleIndex, 1);
                    }
                    
                    const antiparticleIndex = pair.userData.antiparticleTrails.indexOf(trail);
                    if (antiparticleIndex !== -1) {
                        pair.userData.antiparticleTrails.splice(antiparticleIndex, 1);
                    }
                } else {
                    // Fade out trail
                    trail.material.opacity = 0.5 * (1 - trail.userData.age / 1.5);
                    trail.scale.multiplyScalar(0.98);
                }
            });
            
            // Check for lifetime expiration based on vacuum energy and particle lifetime
            if (pair.userData.age > pair.userData.lifetime * particleLifetime) {
                // Remove this pair
                vacuumGroup.remove(pair);
                particlePairs.splice(index, 1);
                
                // Clean up trails
                [...pair.userData.particleTrails, ...pair.userData.antiparticleTrails].forEach(trail => {
                    vacuumGroup.remove(trail);
                });
                
                // Create annihilation effect
                const annihilationGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                const annihilationMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 1
                });
                
                const annihilation = new THREE.Mesh(annihilationGeometry, annihilationMaterial);
                annihilation.position.copy(pair.position);
                annihilation.userData = {
                    age: 0,
                    update: function(delta) {
                        this.age += delta;
                        
                        if (this.age > 1) {
                            vacuumGroup.remove(annihilation);
                            return false;
                        }
                        
                        const scale = 1 + this.age * 5;
                        annihilation.scale.set(scale, scale, scale);
                        annihilation.material.opacity = 1 - this.age / 1.5;
                        
                        return true;
                    }
                };
                
                vacuumGroup.add(annihilation);
            }
        });
        
        // Randomly create new pairs based on vacuum energy
        if (particlePairs.length < 20 && Math.random() < delta * vacuumEnergy * 2) {
            createParticlePair();
        }
        
        // Update animations
        vacuumGroup.traverse(object => {
            if (object.userData && object.userData.update) {
                const result = object.userData.update(delta);
                if (result === false) {
                    vacuumGroup.remove(object);
                }
            }
        });
        
        // Update diagram if needed
        const diagram = document.getElementById('vacuum-diagram');
        if (diagram && diagram.updateDiagram) {
            diagram.updateDiagram(vacuumEnergy);
        }
    };
    
    return { scene, animate };
}

function createVerse13Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010814);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create a measurement apparatus
    const apparatusGroup = new THREE.Group();
    scene.add(apparatusGroup);
    
    // Base platform
    const baseGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        metalness: 0.7,
        roughness: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.5;
    apparatusGroup.add(base);
    
    // Create quantum tetralemma diagram (4 positions for superposition representation)
    const tetrahedronGeometry = new THREE.TetrahedronGeometry(2, 0);
    const tetrahedronEdges = new THREE.EdgesGeometry(tetrahedronGeometry);
    const tetrahedronLines = new THREE.LineSegments(
        tetrahedronEdges,
        new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 })
    );
    apparatusGroup.add(tetrahedronLines);
    
    // Create tetrahedral positions for the "4 extremes" of the particle
    const positions = [
        new THREE.Vector3(0, 1.5, 0), // top
        new THREE.Vector3(-1.5, -0.5, -1), // left back
        new THREE.Vector3(1.5, -0.5, -1), // right back
        new THREE.Vector3(0, -0.5, 1.5) // front
    ];
    
    const positionLabels = ['Neither', 'Non-existence', 'Existence', 'Both'];
    
    // Create position markers
    const positionMarkers = [];
    positions.forEach((position, i) => {
        const markerGroup = new THREE.Group();
        markerGroup.position.copy(position);
        
        // Marker sphere
        const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const markerMaterial = new THREE.MeshPhongMaterial({
            color: 0xa8e0ff,
            emissive: 0x113366,
            transparent: true,
            opacity: 0.9
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        markerGroup.add(marker);
        
        // Create text label
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 36px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(positionLabels[i], 128, 64);
        
        const labelTexture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({
            map: labelTexture,
            transparent: true
        });
        
        const label = new THREE.Sprite(labelMaterial);
        label.scale.set(1, 0.5, 1);
        label.position.y = 0.3;
        markerGroup.add(label);
        
        apparatusGroup.add(markerGroup);
        positionMarkers.push(markerGroup);
    });
    
    // Create the quantum particle in superposition
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Main particle
    const particleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xaaccff,
        transparent: true,
        opacity: 0.9
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particleGroup.add(particle);
    
    // Superposition effect - wave function representation
    const waveGeometry = new THREE.IcosahedronGeometry(0.5, 2);
    const waveWireframe = new THREE.WireframeGeometry(waveGeometry);
    const waveMaterial = new THREE.LineBasicMaterial({
        color: 0xaaccff,
        transparent: true,
        opacity: 0.5
    });
    
    const waveFunction = new THREE.LineSegments(waveWireframe, waveMaterial);
    particleGroup.add(waveFunction);
    
    // Superposition ghost particles at each position
    const ghostParticles = [];
    positions.forEach((position, i) => {
        const ghostGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const ghostMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaccff,
            transparent: true,
            opacity: 0.3
        });
        
        const ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
        ghost.position.copy(position);
        
        // Connect to main particle with beam
        const points = [
            new THREE.Vector3(0, 0, 0),
            position
        ];
        
        const beamGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const beamMaterial = new THREE.LineBasicMaterial({
            color: 0xaaccff,
            transparent: true,
            opacity: 0.2
        });
        
        const beam = new THREE.Line(beamGeometry, beamMaterial);
        particleGroup.add(beam);
        
        apparatusGroup.add(ghost);
        ghostParticles.push({ ghost, beam, position: position.clone() });
    });
    
    // Particle is initially in superposition
    let isInSuperposition = true;
    let observedPosition = null;
    let superpositionT = 0;
    
    // Add measurement beam
    const measurementBeamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 5, 8);
    const measurementBeamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0
    });
    
    const measurementBeam = new THREE.Mesh(measurementBeamGeometry, measurementBeamMaterial);
    measurementBeam.rotation.x = Math.PI / 2;
    measurementBeam.visible = false;
    scene.add(measurementBeam);
    
    // Create visualization diagram using D3.js
    const createSuperpositionDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('superposition-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container
        const svg = d3.create('svg')
            .attr('id', 'superposition-diagram')
            .attr('width', 300)
            .attr('height', 300)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 40, right: 40, bottom: 40, left: 40};
        const width = 300 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Draw tetralemma structure
        const center = {x: width/2, y: height/2};
        const radius = Math.min(width, height) / 2 - 20;
        
        // Calculate 2D positions for tetrahedral vertices
        const tetPositions = [
            {x: center.x, y: center.y - radius}, // top (neither)
            {x: center.x - radius * 0.866, y: center.y + radius/2}, // bottom left (non-existence)
            {x: center.x + radius * 0.866, y: center.y + radius/2}, // bottom right (existence)
            {x: center.x, y: center.y + radius/4} // center-bottom (both)
        ];
        
        // Draw connecting lines
        const lines = [
            [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]
        ];
        
        lines.forEach(line => {
            g.append('line')
                .attr('x1', tetPositions[line[0]].x)
                .attr('y1', tetPositions[line[0]].y)
                .attr('x2', tetPositions[line[1]].x)
                .attr('y2', tetPositions[line[1]].y)
                .attr('stroke', '#88ccff')
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0.5);
        });
        
        // Draw position markers
        tetPositions.forEach((pos, i) => {
            // Position circle
            g.append('circle')
                .attr('cx', pos.x)
                .attr('cy', pos.y)
                .attr('r', 8)
                .attr('fill', '#88ccff')
                .attr('fill-opacity', 0.7);
                
            // Position label
            g.append('text')
                .attr('x', pos.x)
                .attr('y', i === 0 ? pos.y - 15 : pos.y + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .style('font-size', '12px')
                .text(positionLabels[i]);
        });
        
        // Add particle representation
        const particleG = g.append('g')
            .attr('transform', `translate(${center.x},${center.y})`);
            
        particleG.append('circle')
            .attr('r', 12)
            .attr('fill', '#ffffff')
            .attr('stroke', '#aaccff')
            .attr('stroke-width', 2);
            
        // Add superposition visualization
        const ghostCircles = [];
        tetPositions.forEach((pos, i) => {
            const dx = pos.x - center.x;
            const dy = pos.y - center.y;
            
            // Connection line
            const connectLine = g.append('line')
                .attr('x1', center.x)
                .attr('y1', center.y)
                .attr('x2', pos.x)
                .attr('y2', pos.y)
                .attr('stroke', '#aaccff')
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0.3);
                
            // Ghost particle
            const ghost = g.append('circle')
                .attr('cx', pos.x)
                .attr('cy', pos.y)
                .attr('r', 5)
                .attr('fill', '#aaccff')
                .attr('fill-opacity', 0.3);
                
            ghostCircles.push({ghost, connectLine});
        });
        
        // Add observation indicator (initially hidden)
        const observationG = g.append('g')
            .attr('opacity', 0);
            
        // Observation beam
        observationG.append('rect')
            .attr('x', -8)
            .attr('y', -height/2)
            .attr('width', 16)
            .attr('height', height)
            .attr('fill', 'url(#observationGradient)')
            .attr('opacity', 0.7);
            
        // Add gradient definition
        const defs = svg.append('defs');
        
        const gradient = defs.append('linearGradient')
            .attr('id', 'observationGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
            
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#ffaa00')
            .attr('stop-opacity', 0);
            
        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', '#ffaa00')
            .attr('stop-opacity', 1);
            
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#ffaa00')
            .attr('stop-opacity', 0);
            
        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${margin.left + 10}, ${margin.top + 10})`);
            
        // Superposition state
        legend.append('circle')
            .attr('cx', 5)
            .attr('cy', 5)
            .attr('r', 6)
            .attr('fill', '#ffffff')
            .attr('stroke', '#aaccff')
            .attr('stroke-width', 2);
            
        legend.append('text')
            .attr('x', 15)
            .attr('y', 9)
            .style('fill', 'white')
            .style('font-size', '10px')
            .text('Superposition');
            
        // Observed state
        legend.append('circle')
            .attr('cx', 120)
            .attr('cy', 10)
            .attr('r', 6)
            .attr('fill', '#ffaa00');
            
        legend.append('text')
            .attr('x', 135)
            .attr('y', 14)
            .style('fill', 'white')
            .style('font-size', '10px')
            .text('Observed');
            
        // Add title
        svg.append('text')
            .attr('x', 150)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .text('Quantum Tetralemma States');
            
        // Function to update diagram
        const updateDiagram = (inSuperposition, observedIndex) => {
            if (inSuperposition) {
                particleG.select('circle')
                    .attr('fill', '#ffffff')
                    .attr('stroke', '#aaccff');
                    
                ghostCircles.forEach(({ghost, connectLine}) => {
                    ghost.attr('fill-opacity', 0.3);
                    connectLine.attr('stroke-opacity', 0.3);
                });
                
                observationG.attr('opacity', 0)
                    .attr('transform', 'translate(0,0)');
            } else if (observedIndex !== null) {
                particleG.select('circle')
                    .attr('fill', '#ffaa00')
                    .attr('stroke', '#ffaa00');
                    
                ghostCircles.forEach(({ghost, connectLine}, i) => {
                    ghost.attr('fill-opacity', i === observedIndex ? 0.8 : 0);
                    connectLine.attr('stroke-opacity', i === observedIndex ? 0.8 : 0);
                });
                
                const targetPos = tetPositions[observedIndex];
                const dx = targetPos.x - center.x;
                const dy = targetPos.y - center.y;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                observationG.attr('opacity', 1)
                    .attr('transform', `translate(${center.x},${center.y}) rotate(${angle})`);
            }
        };
        
        // Store update function for later use
        svg.node().updateDiagram = updateDiagram;
        
        // Add to DOM
        document.body.appendChild(svg.node());
        
        // Initial update
        updateDiagram(isInSuperposition, observedPosition);
    };
    
    // Create initial diagram
    createSuperpositionDiagram();
    
    // Add scene-specific interaction
    scene.userData = {
        resetSuperposition: () => {
            isInSuperposition = true;
            observedPosition = null;
            superpositionT = 0;
            
            // Reset particle appearance
            particleMaterial.color.set(0xffffff);
            particleMaterial.emissive.set(0xaaccff);
            
            // Reset ghost particles
            ghostParticles.forEach(({ghost, beam}) => {
                ghost.material.opacity = 0.3;
                beam.material.opacity = 0.2;
            });
            
            // Hide measurement beam
            measurementBeam.visible = false;
            
            // Reset particle position
            particleGroup.position.set(0, 0, 0);
            
            // Update diagram
            const diagram = document.getElementById('superposition-diagram');
            if (diagram && diagram.updateDiagram) {
                diagram.updateDiagram(isInSuperposition, observedPosition);
            }
        },
        observeState: () => {
            if (!isInSuperposition) return;
            
            isInSuperposition = false;
            
            // Randomly choose a position (weighted)
            const weights = [0.25, 0.25, 0.25, 0.25]; // Equal probability for simplicity
            
            let sum = 0;
            const r = Math.random();
            for (let i = 0; i < weights.length; i++) {
                sum += weights[i];
                if (r <= sum) {
                    observedPosition = i;
                    break;
                }
            }
            
            // Show measurement beam
            measurementBeam.position.copy(particleGroup.position);
            measurementBeam.lookAt(positions[observedPosition].x, positions[observedPosition].y, positions[observedPosition].z);
            measurementBeam.material.opacity = 0.7;
            measurementBeam.visible = true;
            
            // Add measurement beam animation
            measurementBeam.userData = {
                age: 0,
                update: function(delta) {
                    this.age += delta;
                    if (this.age > 1) {
                        measurementBeam.visible = false;
                        return false;
                    }
                    
                    measurementBeam.material.opacity = 0.7 * (1 - this.age);
                    return true;
                }
            };
            
            // Change particle appearance
            particleMaterial.color.set(0xffaa00);
            particleMaterial.emissive.set(0xaa5500);
            
            // Hide other ghosts except the observed one
            ghostParticles.forEach(({ghost, beam}, i) => {
                ghost.material.opacity = i === observedPosition ? 0.8 : 0;
                beam.material.opacity = i === observedPosition ? 0.8 : 0;
            });
            
            // Update diagram
            const diagram = document.getElementById('superposition-diagram');
            if (diagram && diagram.updateDiagram) {
                diagram.updateDiagram(isInSuperposition, observedPosition);
            }
        }
    };
    
    // Animation function
    const animate = (delta) => {
        // Rotate apparatus slightly for visual interest
        apparatusGroup.rotation.y += delta * 0.1;
        
        if (isInSuperposition) {
            // Animate superposition state
            superpositionT += delta;
            
            // Wave function visual effect
            waveFunction.rotation.x += delta * 0.5;
            waveFunction.rotation.y += delta * 0.3;
            
            const wavePulse = 1 + Math.sin(superpositionT * 2) * 0.2;
            waveFunction.scale.set(wavePulse, wavePulse, wavePulse);
            
            // Make particle orbit around the center
            const orbitRadius = 0.2;
            const orbitSpeed = 0.5;
            
            particle.position.x = Math.cos(superpositionT * orbitSpeed) * orbitRadius;
            particle.position.y = Math.sin(superpositionT * orbitSpeed * 1.5) * orbitRadius * 0.5;
            particle.position.z = Math.sin(superpositionT * orbitSpeed) * orbitRadius;
            
            // Animate ghost particles pulsing
            ghostParticles.forEach(({ghost, beam}, i) => {
                const pulseScale = 1 + Math.sin(superpositionT * 2 + i) * 0.2;
                ghost.scale.set(pulseScale, pulseScale, pulseScale);
                
                // Update beam position
                const beamPoints = [
                    particle.position,
                    ghost.position
                ];
                
                beam.geometry.dispose();
                beam.geometry = new THREE.BufferGeometry().setFromPoints(beamPoints);
            });
        } else if (observedPosition !== null) {
            // Gradually move particle to observed position
            const targetPos = positions[observedPosition];
            const t = Math.min(superpositionT / 2, 1);
            
            particleGroup.position.lerp(targetPos, t * delta * 5);
            
            // Scale down wave function
            waveFunction.scale.multiplyScalar(0.95);
            
            // Update superposition counter
            superpositionT += delta;
        }
        
        // Update scene-specific animations
        scene.traverse(object => {
            if (object.userData && object.userData.update) {
                const result = object.userData.update(delta);
                if (result === false) {
                    delete object.userData.update;
                }
            }
        });
    };
    
    return { scene, animate };
}

function createVerse14Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010a18);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create quantum probability landscape
    const landscapeGroup = new THREE.Group();
    scene.add(landscapeGroup);
    
    // Create a base grid
    const gridSize = 40;
    const gridDivisions = 40;
    const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
    const gridMaterial = new THREE.MeshPhongMaterial({
        color: 0x88aaff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = Math.PI / 2;
    landscapeGroup.add(grid);
    
    // Create probability wave landscape
    const waveGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
    const waveMaterial = new THREE.MeshPhongMaterial({
        color: 0x4477ff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        flatShading: true
    });
    
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.rotation.x = Math.PI / 2;
    wave.position.y = 0.1;
    landscapeGroup.add(wave);
    
    // Create time axis
    const timeAxisGeometry = new THREE.CylinderGeometry(0.05, 0.05, gridSize, 8);
    const timeAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const timeAxis = new THREE.Mesh(timeAxisGeometry, timeAxisMaterial);
    timeAxis.rotation.x = Math.PI / 2;
    timeAxis.position.z = -gridSize / 2;
    timeAxis.position.y = -0.5;
    landscapeGroup.add(timeAxis);
    
    // Create arrow tip for time axis
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.rotation.x = -Math.PI / 2;
    arrow.position.set(0, -0.5, gridSize / 2 + 0.25);
    landscapeGroup.add(arrow);
    
    // Add time label
    const createTextSprite = (text) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 1, 1);
        return sprite;
    };
    
    const timeLabel = createTextSprite('Future');
    timeLabel.position.set(0, 0, gridSize / 2 + 2);
    landscapeGroup.add(timeLabel);
    
    const pastLabel = createTextSprite('Present');
    pastLabel.position.set(0, 0, -gridSize / 2 - 2);
    landscapeGroup.add(pastLabel);
    
    // Create quantum particles to visualize probability
    const particles = [];
    const particleCount = 200;
    const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaccff,
        emissive: 0x2244aa,
        transparent: true,
        opacity: 0.7
    });
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.userData = {
            originalZ: -gridSize / 2, // Start at the "present"
            speed: 0.5 + Math.random() * 1.5, // Random speed
            offset: Math.random() * Math.PI * 2 // Phase offset
        };
        
        // Position along the probability wave
        updateParticlePosition(particle, 0);
        
        landscapeGroup.add(particle);
        particles.push(particle);
    }
    
    // Measurement visualization
    const measurementGroup = new THREE.Group();
    scene.add(measurementGroup);
    
    // Measurement plane
    const measurePlaneGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const measurePlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    
    const measurePlane = new THREE.Mesh(measurePlaneGeometry, measurePlaneMaterial);
    measurePlane.rotation.x = Math.PI / 2;
    measurePlane.visible = false;
    measurementGroup.add(measurePlane);
    
    // Grid of potential measurement points
    const potentialPoints = [];
    const pointSize = 0.1;
    const pointSpacing = 2;
    
    for (let x = -gridSize/2 + pointSize; x < gridSize/2; x += pointSpacing) {
        for (let z = -gridSize/2 + pointSize; z < gridSize/2; z += pointSpacing) {
            const pointGeometry = new THREE.SphereGeometry(pointSize, 8, 8);
            const pointMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.3
            });
            
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.set(x, 0, z);
            point.visible = false;
            
            measurementGroup.add(point);
            potentialPoints.push(point);
        }
    }
    
    // Create probability distribution visualization using D3.js
    const createProbabilityDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('probability-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container
        const svg = d3.create('svg')
            .attr('id', 'probability-diagram')
            .attr('width', 300)
            .attr('height', 200)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 40, right: 20, bottom: 40, left: 50};
        const width = 300 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // X scale represents position
        const x = d3.scaleLinear()
            .domain([-5, 5])
            .range([0, width]);
            
        // Y scale represents probability
        const y = d3.scaleLinear()
            .domain([0, 0.5])
            .range([height, 0]);
            
        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5))
            .style('color', 'white');
            
        g.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .style('color', 'white');
            
        // Add axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Position');
            
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Probability');
            
        // Create Gaussian function for probability distribution
        const gaussian = (x, mean, sigma) => {
            return Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(sigma, 2))) / (sigma * Math.sqrt(2 * Math.PI));
        };
        
        // Generate initial distribution data
        const generateDistributionData = (mean, sigma) => {
            const points = [];
            for (let i = -5; i <= 5; i += 0.1) {
                points.push({
                    x: i,
                    y: gaussian(i, mean, sigma)
                });
            }
            return points;
        };
        
        // Line generator
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveBasis);
            
        // Draw initial distribution
        const initialData = generateDistributionData(0, 1);
        
        // Distribution path
        const distributionPath = g.append('path')
            .datum(initialData)
            .attr('fill', 'none')
            .attr('stroke', '#4477ff')
            .attr('stroke-width', 2)
            .attr('d', line);
            
        // Fill area under curve
        const area = d3.area()
            .x(d => x(d.x))
            .y0(height)
            .y1(d => y(d.y))
            .curve(d3.curveBasis);
            
        const areaPath = g.append('path')
            .datum(initialData)
            .attr('fill', 'url(#distributionGradient)')
            .attr('opacity', 0.5)
            .attr('d', area);
            
        // Add gradient definition
        const defs = svg.append('defs');
        
        const gradient = defs.append('linearGradient')
            .attr('id', 'distributionGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
            
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#4477ff')
            .attr('stop-opacity', 0.8);
            
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#4477ff')
            .attr('stop-opacity', 0);
            
        // Add mean indicator
        const meanLine = g.append('line')
            .attr('x1', x(0))
            .attr('y1', 0)
            .attr('x2', x(0))
            .attr('y2', height)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3');
            
        const meanLabel = g.append('text')
            .attr('x', x(0))
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '10px')
            .text('Mean');
            
        // Add measurement indicator (initially hidden)
        const measurementG = g.append('g')
            .style('opacity', 0);
            
        measurementG.append('line')
            .attr('x1', x(0))
            .attr('y1', 0)
            .attr('x2', x(0))
            .attr('y2', height)
            .attr('stroke', '#ffaa00')
            .attr('stroke-width', 2);
            
        measurementG.append('circle')
            .attr('cx', x(0))
            .attr('cy', y(gaussian(0, 0, 1)))
            .attr('r', 5)
            .attr('fill', '#ffaa00');
            
        measurementG.append('text')
            .attr('x', x(0))
            .attr('y', y(gaussian(0, 0, 1)) - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffaa00')
            .style('font-size', '10px')
            .text('Measured');
            
        // Add title
        svg.append('text')
            .attr('x', 150)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .text('Quantum Probability Distribution');
            
        // Function to update diagram
        const updateDiagram = (time, measured, measuredValue) => {
            // Update distribution based on time (spreading)
            const sigma = 1 + Math.min(time, 3) * 0.3; // Gradually increase sigma with time
            const newData = generateDistributionData(0, sigma);
            
            distributionPath.datum(newData).attr('d', line);
            areaPath.datum(newData).attr('d', area);
            
            if (measured) {
                // Show measurement indicator
                measurementG.style('opacity', 1);
                
                // Update position and label
                measurementG.select('line')
                    .attr('x1', x(measuredValue))
                    .attr('x2', x(measuredValue));
                    
                measurementG.select('circle')
                    .attr('cx', x(measuredValue))
                    .attr('cy', y(gaussian(measuredValue, 0, sigma)));
                    
                measurementG.select('text')
                    .attr('x', x(measuredValue))
                    .attr('y', y(gaussian(measuredValue, 0, sigma)) - 10)
                    .text(`Measured (${measuredValue.toFixed(1)})`);
            } else {
                measurementG.style('opacity', 0);
            }
        };
        
        // Store update function for later use
        svg.node().updateDiagram = updateDiagram;
        
        // Add to DOM
        document.body.appendChild(svg.node());
    };
    
    // Create initial diagram
    createProbabilityDiagram();
    
    // Function to update particle positions based on probability curve
    function updateParticlePosition(particle, time) {
        const z = particle.userData.originalZ + time * particle.userData.speed;
        
        // Keep within grid bounds
        if (z > gridSize / 2) {
            particle.userData.originalZ = -gridSize / 2;
            return;
        }
        
        // Calculate position based on gaussian distribution
        const timeProgress = (z + gridSize / 2) / gridSize; // 0 to 1
        const sigma = 1 + timeProgress * 3; // Distribution widens over time
        
        // Get random position from distribution
        const theta = particle.userData.offset + time * 0.5;
        const r = Math.random() * sigma * 2; // Random radius
        
        particle.position.x = r * Math.cos(theta);
        particle.position.z = z;
        
        // Height (y) based on probability density
        const gaussianHeight = Math.exp(-(r*r) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
        particle.position.y = gaussianHeight * 2;
        
        // Adjust opacity based on probability
        particle.material.opacity = 0.2 + gaussianHeight * 0.8;
    }
    
    // Update wave geometry
    function updateWaveGeometry(time) {
        const positions = wave.geometry.attributes.position.array;
        const halfSize = gridSize / 2;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Convert grid position to z (-1 to 1) and radius
            const x = positions[i];
            const z = positions[i+2];
            
            // Distance from origin
            const r = Math.sqrt(x*x);
            
            // Time-dependent sigma (spread)
            const timeProgress = (z + halfSize) / gridSize; // 0 to 1
            const sigma = 1 + timeProgress * 3; // Wider spread in the future
            
            // Gaussian height
            const height = Math.exp(-(r*r) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
            
            // Set vertex height
            positions[i+1] = height * 2;
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
        wave.geometry.computeVertexNormals();
    }
    
    // Define scene variables for animation
    let timeFlow = 1.0;
    let worldTime = 0;
    let measured = false;
    let measuredValue = 0;
    let measuredTime = 0;
    
    // Add scene-specific interaction handling
    scene.userData = {
        updateTimeFlow: (value) => {
            timeFlow = value;
        },
        measurePosition: () => {
            if (!measured) {
                measured = true;
                measuredTime = worldTime;
                
                // Calculate actual measurement time in future
                const measureZ = gridSize * 0.25; // Measure at a specific time in the future
                
                // Show measurement plane
                measurePlane.position.z = measureZ;
                measurePlane.visible = true;
                
                // Determine measurement outcome (gaussian distribution)
                const timeProgress = (measureZ + gridSize / 2) / gridSize;
                const sigma = 1 + timeProgress * 3;
                
                // Get random position from distribution
                measuredValue = Math.random() * 2 - 1; // Add randomness to outcome
                measuredValue = Math.random() * sigma * (measuredValue > 0 ? 1 : -1);
                
                // Show potential points
                potentialPoints.forEach(point => {
                    point.visible = true;
                    
                    // Determine probability at this location
                    const r = Math.sqrt(point.position.x * point.position.x);
                    const probability = Math.exp(-(r*r) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
                    
                    // Adjust color and size based on probability
                    point.material.opacity = probability * 0.7;
                    point.scale.set(
                        1 + probability * 2,
                        1 + probability * 2,
                        1 + probability * 2
                    );
                    
                    // Highlight measured position
                    if (Math.abs(point.position.x - measuredValue) < pointSpacing/2) {
                        point.material.color.set(0xffcc00);
                        point.material.opacity = 1;
                        point.scale.set(3, 3, 3);
                    }
                });
                
                // Create measurement flash effect
                const flashGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                const flashMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffcc00,
                    transparent: true,
                    opacity: 1
                });
                
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                flash.position.set(measuredValue, 0, measureZ);
                flash.userData = {
                    age: 0,
                    update: function(delta) {
                        this.age += delta;
                        
                        if (this.age > 1.5) {
                            scene.remove(flash);
                            return false;
                        }
                        
                        const scale = 1 + this.age * 5;
                        flash.scale.set(scale, scale, scale);
                        flash.material.opacity = 1 - this.age / 1.5;
                        
                        return true;
                    }
                };
                
                scene.add(flash);
                
                // Update diagram to show measurement
                const diagram = document.getElementById('probability-diagram');
                if (diagram && diagram.updateDiagram) {
                    diagram.updateDiagram(worldTime, true, measuredValue);
                }
            }
        }
    };
    
    // Animation function
    const animate = (delta) => {
        // Update world time
        worldTime += delta * timeFlow;
        
        // Update wave geometry
        updateWaveGeometry(worldTime);
        
        // Update particles
        particles.forEach(particle => {
            updateParticlePosition(particle, worldTime);
        });
        
        // If measured, update measurement visualization
        if (measured) {
            const timeSinceMeasurement = worldTime - measuredTime;
            
            // Fade out measurement plane over time
            if (timeSinceMeasurement > 3) {
                measurePlane.material.opacity = Math.max(0, 0.2 - (timeSinceMeasurement - 3) * 0.1);
                
                // Reset measurement after enough time
                if (timeSinceMeasurement > 5) {
                    measured = false;
                    measurePlane.visible = false;
                    potentialPoints.forEach(point => point.visible = false);
                    
                    // Update diagram
                    const diagram = document.getElementById('probability-diagram');
                    if (diagram && diagram.updateDiagram) {
                        diagram.updateDiagram(worldTime, false, 0);
                    }
                }
            }
        } else {
            // Regular update of diagram
            const diagram = document.getElementById('probability-diagram');
            if (diagram && diagram.updateDiagram) {
                diagram.updateDiagram(worldTime, false, 0);
            }
        }
        
        // Update scene-specific animations
        scene.traverse(object => {
            if (object.userData && object.userData.update) {
                const result = object.userData.update(delta);
                if (result === false) {
                    delete object.userData.update;
                }
            }
        });
    };
    
    return { scene, animate };
}

function createVerse15Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000a14);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create container for the permanence vs. change visualization
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create a platform/base
    const baseGeometry = new THREE.CylinderGeometry(5, 5, 0.2, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x333344,
        shininess: 80
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.5;
    particleGroup.add(base);
    
    // Create the "divine"/permanent representation (proton)
    const divineGeometry = new THREE.SphereGeometry(1, 32, 32);
    const divineMaterial = new THREE.MeshPhongMaterial({
        color: 0x4477ff,
        emissive: 0x112244,
        transparent: true,
        opacity: 0.9
    });
    
    const divine = new THREE.Mesh(divineGeometry, divineMaterial);
    divine.position.set(-2.5, 0, 0);
    particleGroup.add(divine);
    
    // Add aura/glow effect to divine
    const divineAuraGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const divineAuraMaterial = new THREE.MeshBasicMaterial({
        color: 0x88aaff,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const divineAura = new THREE.Mesh(divineAuraGeometry, divineAuraMaterial);
    divine.add(divineAura);
    
    // Add stability visualization
    const stabilityRingGeometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const stabilityRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x88aaff,
        transparent: true,
        opacity: 0.7
    });
    
    const stabilityRing = new THREE.Mesh(stabilityRingGeometry, stabilityRingMaterial);
    stabilityRing.rotation.x = Math.PI / 2;
    divine.add(stabilityRing);
    
    // Create the "human"/impermanent representation (neutron)
    const humanGeometry = new THREE.SphereGeometry(1, 32, 32);
    const humanMaterial = new THREE.MeshPhongMaterial({
        color: 0xff8855,
        emissive: 0x441100,
        shininess: 90
    });
    
    const human = new THREE.Mesh(humanGeometry, humanMaterial);
    human.position.set(2.5, 0, 0);
    particleGroup.add(human);
    
    // Create decay particles
    const decayParticles = [];
    
    function createDecayParticle(position) {
        const particle = new THREE.Group();
        
        // Electron
        const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const electronMaterial = new THREE.MeshPhongMaterial({
            color: 0x55aaff,
            emissive: 0x0033aa,
            transparent: true,
            opacity: 0.9
        });
        
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        
        // Electron trail
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0x55aaff,
            transparent: true,
            opacity: 0.5
        });
        
        const trailPositions = [];
        for (let i = 0; i < 50; i++) {
            trailPositions.push(0, 0, 0);
        }
        
        trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        particle.add(trail);
        
        // Antineutrino
        const neutrinoGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const neutrinoMaterial = new THREE.MeshPhongMaterial({
            color: 0xffaa55,
            emissive: 0xaa5500,
            transparent: true,
            opacity: 0.6
        });
        
        const neutrino = new THREE.Mesh(neutrinoGeometry, neutrinoMaterial);
        
        // Neutrino trail
        const neutrinoTrailGeometry = new THREE.BufferGeometry();
        const neutrinoTrailMaterial = new THREE.LineBasicMaterial({
            color: 0xffaa55,
            transparent: true,
            opacity: 0.3
        });
        
        const neutrinoTrailPositions = [];
        for (let i = 0; i < 50; i++) {
            neutrinoTrailPositions.push(0, 0, 0);
        }
        
        neutrinoTrailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(neutrinoTrailPositions, 3));
        const neutrinoTrail = new THREE.Line(neutrinoTrailGeometry, neutrinoTrailMaterial);
        particle.add(neutrinoTrail);
        
        // Add particle data and positioning
        particle.position.copy(position);
        
        // Random direction vectors
        const electronDirection = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize();
        
        const neutrinoDirection = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize();
        
        particle.userData = {
            age: 0,
            electron,
            neutrino,
            electronTrail: trail,
            neutrinoTrail,
            trailPositions: [],
            neutrinoTrailPositions: [],
            electronDirection,
            neutrinoDirection,
            electronSpeed: 0.5 + Math.random() * 0.5,
            neutrinoSpeed: 1 + Math.random() * 1
        };
        
        particleGroup.add(particle);
        decayParticles.push(particle);
        
        return particle;
    }
    
    // Create comparison labels
    function createLabel(text, position) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(3, 0.75, 1);
        particleGroup.add(sprite);
        
        return sprite;
    }
    
    // Create labels
    const divineLabel = createLabel('Divine (Permanent)', new THREE.Vector3(-2.5, -2.5, 0));
    const humanLabel = createLabel('Human (Impermanent)', new THREE.Vector3(2.5, -2.5, 0));
    
    // Create status indicators
    const divineStatus = createLabel('Stable', new THREE.Vector3(-2.5, 2, 0));
    divineStatus.scale.set(1.5, 0.4, 1);
    
    const humanStatus = createLabel('Decaying', new THREE.Vector3(2.5, 2, 0));
    humanStatus.scale.set(1.5, 0.4, 1);
    
    // Create a timer visualization for neutron/human
    const decayTimeGeometry = new THREE.RingGeometry(1.3, 1.4, 32);
    const decayTimeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8855,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const decayTimeRing = new THREE.Mesh(decayTimeGeometry, decayTimeMaterial);
    decayTimeRing.rotation.x = Math.PI / 2;
    human.add(decayTimeRing);
    
    // Create proton/divine internal structure
    const createProtonStructure = () => {
        const structureGroup = new THREE.Group();
        divine.add(structureGroup);
        
        // Add three quarks within the proton
        const quarkGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const quarkMaterials = [
            new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x330000 }), // Red
            new THREE.MeshPhongMaterial({ color: 0x0000ff, emissive: 0x000033 }), // Blue
            new THREE.MeshPhongMaterial({ color: 0x00ff00, emissive: 0x003300 })  // Green
        ];
        
        const quarks = [];
        for (let i = 0; i < 3; i++) {
            const quark = new THREE.Mesh(quarkGeometry, quarkMaterials[i]);
            
            // Position in triangular arrangement
            const angle = (i * Math.PI * 2) / 3;
            quark.position.set(
                Math.cos(angle) * 0.4,
                Math.sin(angle) * 0.4,
                0
            );
            
            structureGroup.add(quark);
            quarks.push(quark);
        }
        
        // Add connections between quarks (gluons)
        const gluonGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
        gluonGeometry.rotateX(Math.PI / 2);
        
        const gluonMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        
        for (let i = 0; i < 3; i++) {
            const nextIndex = (i + 1) % 3;
            
            const gluon = new THREE.Mesh(gluonGeometry, gluonMaterial);
            
            // Position between quarks
            const start = quarks[i].position;
            const end = quarks[nextIndex].position;
            
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            gluon.position.copy(mid);
            
            // Orient correctly
            gluon.lookAt(end);
            
            // Scale to correct length
            const length = start.distanceTo(end);
            gluon.scale.set(1, 1, length);
            
            structureGroup.add(gluon);
        }
        
        // Animate the structure
        structureGroup.userData.animate = (delta, time) => {
            structureGroup.rotation.x = time * 0.5;
            structureGroup.rotation.y = time * 0.3;
            
            // Make quarks move slightly
            quarks.forEach((quark, i) => {
                const angle = (i * Math.PI * 2) / 3 + time;
                quark.position.set(
                    Math.cos(angle) * 0.4,
                    Math.sin(angle) * 0.4,
                    Math.sin(time * 2 + i) * 0.1
                );
            });
        };
        
        return structureGroup;
    };
    
    // Create neutron/human internal structure
    const createNeutronStructure = () => {
        const structureGroup = new THREE.Group();
        human.add(structureGroup);
        
        // Add three quarks within the neutron
        const quarkGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const quarkMaterials = [
            new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x330000 }), // Red
            new THREE.MeshPhongMaterial({ color: 0x0000ff, emissive: 0x000033 }), // Blue
            new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x330000 })  // Red (two red quarks for neutron)
        ];
        
        const quarks = [];
        for (let i = 0; i < 3; i++) {
            const quark = new THREE.Mesh(quarkGeometry, quarkMaterials[i]);
            
            // Position in triangular arrangement
            const angle = (i * Math.PI * 2) / 3;
            quark.position.set(
                Math.cos(angle) * 0.4,
                Math.sin(angle) * 0.4,
                0
            );
            
            structureGroup.add(quark);
            quarks.push(quark);
        }
        
        // Add connections between quarks (gluons)
        const gluonGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
        gluonGeometry.rotateX(Math.PI / 2);
        
        const gluonMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        
        for (let i = 0; i < 3; i++) {
            const nextIndex = (i + 1) % 3;
            
            const gluon = new THREE.Mesh(gluonGeometry, gluonMaterial);
            
            // Position between quarks
            const start = quarks[i].position;
            const end = quarks[nextIndex].position;
            
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            gluon.position.copy(mid);
            
            // Orient correctly
            gluon.lookAt(end);
            
            // Scale to correct length
            const length = start.distanceTo(end);
            gluon.scale.set(1, 1, length);
            
            structureGroup.add(gluon);
        }
        
        // Add instability visualization (vibration)
        const instabilityGroup = new THREE.Group();
        structureGroup.add(instabilityGroup);
        
        // Add a down quark that will become an up quark
        const decayingQuark = quarks[2]; // Last quark (the one that changes)
        
        // Add animation for the structure
        structureGroup.userData.animate = (delta, time) => {
            structureGroup.rotation.x = time * 0.5;
            structureGroup.rotation.y = time * 0.3;
            
            // Make quarks move slightly, with more vibration than proton
            quarks.forEach((quark, i) => {
                const angle = (i * Math.PI * 2) / 3 + time * 1.2;
                quark.position.set(
                    Math.cos(angle) * 0.4,
                    Math.sin(angle) * 0.4,
                    Math.sin(time * 3 + i) * 0.15
                );
            });
            
            // Add instability to the decaying quark
            if (Math.random() < 0.01) {
                decayingQuark.scale.set(1.2, 1.2, 1.2);
                setTimeout(() => {
                    if (decayingQuark) decayingQuark.scale.set(1, 1, 1);
                }, 100);
            }
        };
        
        return structureGroup;
    };
    
    // Add internal structure
    const protonStructure = createProtonStructure();
    const neutronStructure = createNeutronStructure();
    
    // Create decay visualization using D3.js
    const createDecayDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('decay-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container
        const svg = d3.create('svg')
            .attr('id', 'decay-diagram')
            .attr('width', 300)
            .attr('height', 200)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 30, right: 20, bottom: 40, left: 50};
        const width = 300 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // X scale represents time
        const x = d3.scaleLinear()
            .domain([0, 15]) // 15 minutes for neutron decay
            .range([0, width]);
            
        // Y scale represents quantity (percentage remaining)
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
            
        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5))
            .style('color', 'white');
            
        g.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .style('color', 'white');
            
        // Add axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Time (minutes)');
            
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Remaining (%)');
            
        // Create exponential decay function
        const halfLife = 15; // ~15 minutes for free neutrons
        const decayFunction = t => 100 * Math.exp(-0.693 * t / halfLife);
        
        // Generate decay curve data
        const generateDecayData = () => {
            const points = [];
            for (let t = 0; t <= 30; t += 0.5) {
                points.push({
                    x: t,
                    y: decayFunction(t)
                });
            }
            return points;
        };
        
        // Line generator
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveBasis);
            
        // Draw decay curve
        const decayData = generateDecayData();
        
        // Add decay curve
        g.append('path')
            .datum(decayData)
            .attr('fill', 'none')
            .attr('stroke', '#ff8855')
            .attr('stroke-width', 2)
            .attr('d', line);
            
        // Add half-life indicator
        g.append('line')
            .attr('x1', x(halfLife))
            .attr('y1', 0)
            .attr('x2', x(halfLife))
            .attr('y2', height)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3');
            
        g.append('text')
            .attr('x', x(halfLife))
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '10px')
            .text('Half-life (15 min)');
            
        // Add current time indicator (initially at 0)
        const timeIndicator = g.append('line')
            .attr('x1', x(0))
            .attr('y1', 0)
            .attr('x2', x(0))
            .attr('y2', height)
            .attr('stroke', '#ffcc00')
            .attr('stroke-width', 2);
            
        const timeMarker = g.append('circle')
            .attr('cx', x(0))
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', '#ffcc00');
            
        const timeLabel = g.append('text')
            .attr('x', x(0))
            .attr('y', 10 - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffcc00')
            .style('font-size', '10px')
            .text('0 min (100%)');
            
        // Add proton line (stable at 100%)
        g.append('line')
            .attr('x1', 0)
            .attr('y1', y(100))
            .attr('x2', width)
            .attr('y2', y(100))
            .attr('stroke', '#4477ff')
            .attr('stroke-width', 2);
            
        g.append('text')
            .attr('x', 5)
            .attr('y', y(100) - 5)
            .attr('fill', '#4477ff')
            .style('font-size', '10px')
            .text('Proton (Stable)');
            
        // Add title
        svg.append('text')
            .attr('x', 150)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .text('Particle Stability Comparison');
            
        // Function to update the time indicator
        const updateTime = (time, decayRate) => {
            // Scale time to match decay rate (for visualization)
            const scaledTime = time * decayRate * 10;
            const clampedTime = Math.min(scaledTime, 30);
            
            const remaining = decayFunction(clampedTime);
            
            timeIndicator.attr('x1', x(clampedTime)).attr('x2', x(clampedTime));
            timeMarker.attr('cx', x(clampedTime));
            timeLabel
                .attr('x', x(clampedTime))
                .attr('y', y(remaining) - 10)
                .text(`${clampedTime.toFixed(1)} min (${remaining.toFixed(1)}%)`);
        };
        
        // Store update function for later use
        svg.node().updateTime = updateTime;
        
        // Add to DOM
        document.body.appendChild(svg.node());
    };
    
    // Create initial diagram
    createDecayDiagram();
    
    // Scene variables
    let worldTime = 0;
    let showDecay = false;
    let decayRate = 0.5;
    
    // Add scene-specific interaction
    scene.userData = {
        toggleDecay: (value) => {
            showDecay = value;
            
            // Reset counters when toggling
            worldTime = 0;
            
            // Clear existing decay particles
            decayParticles.forEach(particle => {
                particleGroup.remove(particle);
            });
            decayParticles.length = 0;
            
            // Reset human visual
            human.material.opacity = 1;
            humanStatus.material.map.dispose();
            
            // Update status label
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.font = 'Bold 60px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(showDecay ? 'Decaying' : 'Stable', 256, 64);
            
            const texture = new THREE.CanvasTexture(canvas);
            humanStatus.material.map = texture;
            humanStatus.material.needsUpdate = true;
        },
        updateDecayRate: (value) => {
            decayRate = value;
        }
    };
    
    // Animation function
    const animate = (delta) => {
        // Increment world time
        worldTime += delta;
        
        // Rotate particle group slowly for better view
        particleGroup.rotation.y += delta * 0.1;
        
        // Animate divine/proton
        divine.rotation.y += delta * 0.2;
        stabilityRing.rotation.z += delta * 0.5;
        
        // Pulse divine aura
        const auraScale = 1 + Math.sin(worldTime * 2) * 0.1;
        divineAura.scale.set(auraScale, auraScale, auraScale);
        
        // Animate proton structure
        if (protonStructure.userData.animate) {
            protonStructure.userData.animate(delta, worldTime);
        }
        
        // Animate human/neutron
        human.rotation.y += delta * 0.3;
        
        // Animate neutron structure
        if (neutronStructure.userData.animate) {
            neutronStructure.userData.animate(delta, worldTime);
        }
        
        // Handle decay visualization
        if (showDecay) {
            // Calculate decay percentage based on time
            const halfLife = 15; // ~15 minutes, but scaled for visualization
            const decayChance = 1 - Math.exp(-0.693 * worldTime * decayRate / halfLife);
            
            // Update decay time ring
            const ringProgress = Math.min(decayChance, 1);
            decayTimeRing.geometry.dispose();
            decayTimeRing.geometry = new THREE.RingGeometry(
                1.3, 1.4, 32, 1, 0, ringProgress * Math.PI * 2
            );
            
            // Random decay chance
            if (Math.random() < delta * decayRate * 5 && decayParticles.length < 20) {
                createDecayParticle(human.position.clone());
                
                // Gradually fade neutron as it decays
                human.material.opacity = Math.max(0.3, 1 - decayChance);
            }
            
            // Update decay particles
            decayParticles.forEach((particle, index) => {
                particle.userData.age += delta;
                
                // Move electron and neutrino outward
                const electronPos = particle.userData.electron.position;
                electronPos.addScaledVector(particle.userData.electronDirection, delta * particle.userData.electronSpeed);
                
                const neutrinoPos = particle.userData.neutrino.position;
                neutrinoPos.addScaledVector(particle.userData.neutrinoDirection, delta * particle.userData.neutrinoSpeed);
                
                // Update trails
                // For electron trail
                const trailPositions = particle.userData.electronTrail.geometry.attributes.position.array;
                
                // Shift all positions down
                for (let i = trailPositions.length - 1; i >= 3; i--) {
                    trailPositions[i] = trailPositions[i - 3];
                }
                
                // Add current position to front
                trailPositions[0] = electronPos.x;
                trailPositions[1] = electronPos.y;
                trailPositions[2] = electronPos.z;
                
                particle.userData.electronTrail.geometry.attributes.position.needsUpdate = true;
                
                // For neutrino trail
                const neutrinoTrailPositions = particle.userData.neutrinoTrail.geometry.attributes.position.array;
                
                // Shift all positions down
                for (let i = neutrinoTrailPositions.length - 1; i >= 3; i--) {
                    neutrinoTrailPositions[i] = neutrinoTrailPositions[i - 3];
                }
                
                // Add current position to front
                neutrinoTrailPositions[0] = neutrinoPos.x;
                neutrinoTrailPositions[1] = neutrinoPos.y;
                neutrinoTrailPositions[2] = neutrinoPos.z;
                
                particle.userData.neutrinoTrail.geometry.attributes.position.needsUpdate = true;
                
                // Remove old particles
                if (particle.userData.age > 5) {
                    particleGroup.remove(particle);
                    decayParticles.splice(index, 1);
                }
            });
        }
        
        // Update diagram
        const diagram = document.getElementById('decay-diagram');
        if (diagram && diagram.updateTime) {
            diagram.updateTime(worldTime, decayRate);
        }
    };
    
    return { scene, animate };
}

function createVerse16Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00050f);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create quantum tunneling visualization
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    
    // Create energy landscape
    const landscapeWidth = 20;
    const landscapeDepth = 10;
    const resolution = 100;
    
    const landscapeGeometry = new THREE.PlaneGeometry(
        landscapeWidth, 
        landscapeDepth, 
        resolution, 
        Math.floor(resolution * landscapeDepth/landscapeWidth)
    );
    
    const landscapeMaterial = new THREE.MeshPhongMaterial({
        color: 0x88aaff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        flatShading: true,
        shininess: 30
    });
    
    const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
    landscape.rotation.x = -Math.PI / 2;
    landscape.position.y = -2;
    worldGroup.add(landscape);
    
    // Create base grid under landscape
    const gridGeometry = new THREE.PlaneGeometry(landscapeWidth, landscapeDepth);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0x333355,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -2.2;
    worldGroup.add(grid);
    
    // Create energy barrier
    let barrierHeight = 1.0; // Initial height
    let barrierWidth = 1.5;  // Width of barrier
    
    // Function to update landscape geometry with barrier
    function updateLandscape() {
        const positions = landscape.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            
            // Create energy barrier at x=0 (center)
            let height = 0;
            
            const distFromCenter = Math.abs(x);
            if (distFromCenter < barrierWidth) {
                // Smoother barrier shape using cosine
                const normalizedDist = distFromCenter / barrierWidth;
                height = barrierHeight * 0.5 * (1 + Math.cos(Math.PI * normalizedDist));
            }
            
            positions[i+1] = height;
        }
        
        landscape.geometry.attributes.position.needsUpdate = true;
        landscape.geometry.computeVertexNormals();
    }
    
    // Initial landscape update
    updateLandscape();
    
    // Create representation of "human" and "divine" states
    const humanGroup = new THREE.Group();
    humanGroup.position.set(-5, -1, 0);
    worldGroup.add(humanGroup);
    
    const divineGroup = new THREE.Group();
    divineGroup.position.set(5, -1, 0);
    worldGroup.add(divineGroup);
    
    // Human representation
    const humanGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const humanMaterial = new THREE.MeshPhongMaterial({
        color: 0xff8855,
        emissive: 0x441100,
        shininess: 30
    });
    
    const human = new THREE.Mesh(humanGeometry, humanMaterial);
    humanGroup.add(human);
    
    // Human aura (impermanence)
    const humanAuraGeometry = new THREE.SphereGeometry(1, 32, 32);
    const humanAuraMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8855,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const humanAura = new THREE.Mesh(humanAuraGeometry, humanAuraMaterial);
    humanGroup.add(humanAura);
    
    // Divine representation
    const divineGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const divineMaterial = new THREE.MeshPhongMaterial({
        color: 0x88ccff,
        emissive: 0x224488,
        shininess: 70
    });
    
    const divine = new THREE.Mesh(divineGeometry, divineMaterial);
    divineGroup.add(divine);
    
    // Divine aura (permanence)
    const divineAuraGeometry = new THREE.SphereGeometry(1, 32, 32);
    const divineAuraMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const divineAura = new THREE.Mesh(divineAuraGeometry, divineAuraMaterial);
    divineGroup.add(divineAura);
    
    // Add stability rings to divine (representing permanence)
    const stabilityRingGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
    const stabilityRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.7
    });
    
    const stabilityRing1 = new THREE.Mesh(stabilityRingGeometry, stabilityRingMaterial);
    stabilityRing1.rotation.x = Math.PI / 2;
    divineGroup.add(stabilityRing1);
    
    const stabilityRing2 = new THREE.Mesh(stabilityRingGeometry, stabilityRingMaterial);
    stabilityRing2.rotation.y = Math.PI / 2;
    divineGroup.add(stabilityRing2);
    
    // Create tunneling particle
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xaaaaaa,
        transparent: true,
        opacity: 0.9
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(-7, -1, 0);
    worldGroup.add(particle);
    
    // Add wave function visualization to particle
    const waveGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    
    const waveFunction = new THREE.Mesh(waveGeometry, waveMaterial);
    particle.add(waveFunction);
    
    // Add trail effect
    const maxTrailPoints = 100;
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    worldGroup.add(trail);
    
    let trailPointsCount = 0;
    
    // Tunneling visualization
    const tunnelGeometry = new THREE.CylinderGeometry(0.3, 0.3, barrierWidth * 2, 16, 1, true);
    const tunnelMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
    });
    
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.rotation.z = Math.PI / 2;
    tunnel.position.y = -1;
    worldGroup.add(tunnel);
    
    // Create labels for human and divine
    function createLabel(text, position) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(3, 0.75, 1);
        worldGroup.add(sprite);
        
        return sprite;
    }
    
    // Create labels
    const humanLabel = createLabel('Human (Impermanent)', new THREE.Vector3(-5, -3, 0));
    const divineLabel = createLabel('Divine (Permanent)', new THREE.Vector3(5, -3, 0));
    
    // Create tunneling visualization diagram using D3.js
    const createTunnelingDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('tunneling-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container
        const svg = d3.create('svg')
            .attr('id', 'tunneling-diagram')
            .attr('width', 300)
            .attr('height', 200)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 30, right: 20, bottom: 40, left: 40};
        const width = 300 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // X scale represents position
        const x = d3.scaleLinear()
            .domain([-8, 8])
            .range([0, width]);
            
        // Y scale represents energy
        const y = d3.scaleLinear()
            .domain([-0.5, 1.5])
            .range([height, 0]);
            
        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height - y(0)})`)
            .call(d3.axisBottom(x).ticks(5))
            .style('color', 'white');
            
        g.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .style('color', 'white');
            
        // Add axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Position');
            
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Energy');
            
        // Function to generate barrier data
        const generateBarrierData = (height, width) => {
            const points = [];
            
            // Left of barrier
            for (let pos = -8; pos < -width; pos += 0.1) {
                points.push({x: pos, y: 0});
            }
            
            // Barrier left edge
            points.push({x: -width, y: 0});
            points.push({x: -width, y: height});
            
            // Barrier top
            points.push({x: -width, y: height});
            points.push({x: width, y: height});
            
            // Barrier right edge
            points.push({x: width, y: height});
            points.push({x: width, y: 0});
            
            // Right of barrier
            for (let pos = width; pos <= 8; pos += 0.1) {
                points.push({x: pos, y: 0});
            }
            
            return points;
        };
        
        // Line generator
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y));
            
        // Draw energy barrier
        const barrierPath = g.append('path')
            .datum(generateBarrierData(barrierHeight, barrierWidth))
            .attr('fill', 'none')
            .attr('stroke', '#88aaff')
            .attr('stroke-width', 2)
            .attr('d', line);
            
        // Add barrier fill
        const barrierArea = d3.area()
            .x(d => x(d.x))
            .y0(y(0))
            .y1(d => y(d.y));
            
        const barrierAreaPath = g.append('path')
            .datum(generateBarrierData(barrierHeight, barrierWidth))
            .attr('fill', 'url(#barrierGradient)')
            .attr('opacity', 0.5)
            .attr('d', barrierArea);
            
        // Add gradient for barrier
        const defs = svg.append('defs');
        
        const barrierGradient = defs.append('linearGradient')
            .attr('id', 'barrierGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
            
        barrierGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#88aaff')
            .attr('stop-opacity', 0.8);
            
        barrierGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#88aaff')
            .attr('stop-opacity', 0.2);
            
        // Draw wave function
        const generateWaveFunctionData = (position, energy, width, isTunneling) => {
            const points = [];
            const amplitude = 0.3;
            const frequency = 0.5;
            
            // Wave on left side
            for (let pos = -8; pos < 0; pos += 0.1) {
                const distFromParticle = Math.abs(pos - position);
                const envelope = Math.exp(-distFromParticle * 0.2);
                const y = Math.sin(pos * frequency * Math.PI * 2) * amplitude * envelope;
                points.push({x: pos, y: y});
            }
            
            // Wave in barrier (if tunneling)
            if (isTunneling) {
                for (let pos = 0; pos < width * 2; pos += 0.1) {
                    const tunnelAmplitude = amplitude * Math.exp(-pos);
                    const y = Math.sin(pos * frequency * Math.PI * 2) * tunnelAmplitude;
                    points.push({x: pos, y: y});
                }
            }
            
            return points;
        };
        
        // Initial wave (not tunneling)
        const waveFunction = g.append('path')
            .datum(generateWaveFunctionData(-5, 0.3, barrierWidth, false))
            .attr('fill', 'none')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.7)
            .attr('d', line);
            
        // Add particle indicator
        const particleIndicator = g.append('circle')
            .attr('cx', x(-5))
            .attr('cy', y(0))
            .attr('r', 5)
            .attr('fill', '#ffffff');
            
        // Add human and divine indicators
        g.append('circle')
            .attr('cx', x(-5))
            .attr('cy', y(0))
            .attr('r', 8)
            .attr('fill', '#ff8855')
            .attr('opacity', 0.5);
            
        g.append('circle')
            .attr('cx', x(5))
            .attr('cy', y(0))
            .attr('r', 8)
            .attr('fill', '#88ccff')
            .attr('opacity', 0.5);
            
        g.append('text')
            .attr('x', x(-5))
            .attr('y', y(0) - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ff8855')
            .style('font-size', '10px')
            .text('Human');
            
        g.append('text')
            .attr('x', x(5))
            .attr('y', y(0) - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#88ccff')
            .style('font-size', '10px')
            .text('Divine');
            
        // Add tunneling probability indicator
        const probabilityLabel = g.append('text')
            .attr('x', width / 2)
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Tunneling Probability: 0%');
            
        // Add title
        svg.append('text')
            .attr('x', 150)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .text('Quantum Tunneling');
            
        // Function to update diagram
        const updateDiagram = (particlePos, barrierHeight, barrierWidth, isTunneling) => {
            // Update barrier path
            barrierPath.datum(generateBarrierData(barrierHeight, barrierWidth))
                .attr('d', line);
                
            barrierAreaPath.datum(generateBarrierData(barrierHeight, barrierWidth))
                .attr('d', barrierArea);
                
            // Update wave function
            waveFunction.datum(generateWaveFunctionData(particlePos, 0.3, barrierWidth, isTunneling))
                .attr('d', line);
                
            // Update particle position
            particleIndicator.attr('cx', x(particlePos));
            
            // Calculate tunneling probability
            const particleEnergy = 0.3;
            const energyRatio = particleEnergy / barrierHeight;
            const tunnelProbability = Math.exp(-2 * barrierWidth * Math.sqrt(2 * (1 - energyRatio)));
            
            // Update probability label
            probabilityLabel.text(`Tunneling Probability: ${(tunnelProbability * 100).toFixed(2)}%`);
        };
        
        // Store update function for later use
        svg.node().updateDiagram = updateDiagram;
        
        // Add to DOM
        document.body.appendChild(svg.node());
    };
    
    // Create initial diagram
    createTunnelingDiagram();
    
    // Scene variables
    let particleEnergy = 0.3;
    let isTunneling = false;
    let tunnelProgress = 0;
    let worldTime = 0;
    
    // Add scene-specific interaction
    scene.userData = {
        updateBarrierHeight: (value) => {
            barrierHeight = value;
            updateLandscape();
            
            // Update tunnel height
            tunnel.scale.y = value * 2;
            tunnel.position.y = -1 + (value / 2);
            
            // Update diagram
            const diagram = document.getElementById('tunneling-diagram');
            if (diagram && diagram.updateDiagram) {
                diagram.updateDiagram(particle.position.x, barrierHeight, barrierWidth, isTunneling);
            }
        },
        updateParticleEnergy: (value) => {
            particleEnergy = value;
            
            // Scale particle's wave visualization
            const waveScale = 0.5 + value * 0.5;
            waveFunction.scale.set(waveScale, waveScale, waveScale);
            
            // Update diagram
            const diagram = document.getElementById('tunneling-diagram');
            if (diagram && diagram.updateDiagram) {
                diagram.updateDiagram(particle.position.x, barrierHeight, barrierWidth, isTunneling);
            }
        }
    };
    
    // Animation variables
    let particleDirection = 1; // 1 = right, -1 = left
    let particleSpeed = 2;
    
    // Animation function
    const animate = (delta) => {
        // Increment world time
        worldTime += delta;
        
        // Rotate world group slightly for better view
        worldGroup.rotation.y = Math.sin(worldTime * 0.2) * 0.2;
        
        // Animate stability rings on divine
        stabilityRing1.rotation.y += delta;
        stabilityRing2.rotation.x += delta * 0.7;
        
        // Animate auras
        const humanPulse = 1 + Math.sin(worldTime * 3) * 0.1;
        humanAura.scale.set(humanPulse, humanPulse, humanPulse);
        
        const divinePulse = 1 + Math.sin(worldTime * 2) * 0.05;
        divineAura.scale.set(divinePulse, divinePulse, divinePulse);
        
        // Animate wave function on particle
        waveFunction.rotation.x += delta * 2;
        waveFunction.rotation.y += delta * 1.5;
        waveFunction.rotation.z += delta;
        
        // Animate particle movement
        if (!isTunneling) {
            // Normal movement
            particle.position.x += particleDirection * particleSpeed * delta;
            
            // Add point to trail
            if (trailPointsCount < maxTrailPoints) {
                const idx = trailPointsCount * 3;
                trailPositions[idx] = particle.position.x;
                trailPositions[idx+1] = particle.position.y;
                trailPositions[idx+2] = particle.position.z;
                trailPointsCount++;
                
                trail.geometry.setDrawRange(0, trailPointsCount);
                trail.geometry.attributes.position.needsUpdate = true;
            } else {
                // Shift all points back
                for (let i = 0; i < trailPositions.length - 3; i += 3) {
                    trailPositions[i] = trailPositions[i+3];
                    trailPositions[i+1] = trailPositions[i+4];
                    trailPositions[i+2] = trailPositions[i+5];
                }
                
                // Add new point
                const idx = trailPositions.length - 3;
                trailPositions[idx] = particle.position.x;
                trailPositions[idx+1] = particle.position.y;
                trailPositions[idx+2] = particle.position.z;
                
                trail.geometry.attributes.position.needsUpdate = true;
            }
            
            // Check for barrier encounter
            if (particleDirection > 0 && particle.position.x > -barrierWidth && !isTunneling) {
                // Calculate tunneling probability
                const energyRatio = particleEnergy / barrierHeight;
                const tunnelProbability = Math.exp(-2 * barrierWidth * Math.sqrt(2 * (1 - energyRatio)));
                
                if (Math.random() < tunnelProbability) {
                    // Begin tunneling
                    isTunneling = true;
                    tunnelProgress = 0;
                    
                    // Show tunnel effect
                    tunnel.material.opacity = 0.5;
                    
                    // Update diagram
                    const diagram = document.getElementById('tunneling-diagram');
                    if (diagram && diagram.updateDiagram) {
                        diagram.updateDiagram(particle.position.x, barrierHeight, barrierWidth, true);
                    }
                } else {
                    // Reflect off barrier
                    particleDirection = -1;
                    
                    // Create reflection effect
                    const reflectionGeometry = new THREE.SphereGeometry(0.4, 16, 16);
                    const reflectionMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.7
                    });
                    
                    const reflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
                    reflection.position.copy(particle.position);
                    reflection.userData = {
                        age: 0,
                        update: function(delta) {
                            this.age += delta;
                            
                            if (this.age > 0.5) {
                                worldGroup.remove(reflection);
                                return false;
                            }
                            
                            const scale = 1 + this.age * 3;
                            reflection.scale.set(scale, scale, scale);
                            reflection.material.opacity = 0.7 * (1 - this.age / 0.5);
                            
                            return true;
                        }
                    };
                    
                    worldGroup.add(reflection);
                }
            } else if (particleDirection < 0 && particle.position.x < -7) {
                // Reverse at left boundary
                particleDirection = 1;
            } else if (particle.position.x > 7) {
                // Reset position when going too far right
                particle.position.x = -7;
                isTunneling = false;
                trailPointsCount = 0;
            }
        } else {
            // Tunneling animation
            tunnelProgress += delta * 0.5;
            
            if (tunnelProgress < 1) {
                // Going through barrier
                particle.position.x = THREE.MathUtils.lerp(-barrierWidth, barrierWidth, tunnelProgress);
                
                // Fade particle during tunneling
                particle.material.opacity = 0.3 + Math.sin(tunnelProgress * Math.PI) * 0.2;
                waveFunction.material.opacity = 0.3;
            } else {
                // Emerged from barrier
                isTunneling = false;
                particle.material.opacity = 0.9;
                waveFunction.material.opacity = 0.5;
                tunnel.material.opacity = 0;
                
                // Show emergence effect
                const emergenceGeometry = new THREE.SphereGeometry(0.4, 16, 16);
                const emergenceMaterial = new THREE.MeshBasicMaterial({
                    color: 0x88ccff,
                    transparent: true,
                    opacity: 0.7
                });
                
                const emergence = new THREE.Mesh(emergenceGeometry, emergenceMaterial);
                emergence.position.copy(particle.position);
                emergence.userData = {
                    age: 0,
                    update: function(delta) {
                        this.age += delta;
                        
                        if (this.age > 0.5) {
                            worldGroup.remove(emergence);
                            return false;
                        }
                        
                        const scale = 1 + this.age * 3;
                        emergence.scale.set(scale, scale, scale);
                        emergence.material.opacity = 0.7 * (1 - this.age / 0.5);
                        
                        return true;
                    }
                };
                
                worldGroup.add(emergence);
                
                // Update diagram
                const diagram = document.getElementById('tunneling-diagram');
                if (diagram && diagram.updateDiagram) {
                    diagram.updateDiagram(particle.position.x, barrierHeight, barrierWidth, false);
                }
            }
        }
        
        // Update scene-specific animations
        worldGroup.traverse(object => {
            if (object.userData && object.userData.update) {
                const result = object.userData.update(delta);
                if (result === false) {
                    delete object.userData.update;
                }
            }
        });
        
        // Update diagram with current particle position
        const diagram = document.getElementById('tunneling-diagram');
        if (diagram && diagram.updateDiagram) {
            diagram.updateDiagram(particle.position.x, barrierHeight, barrierWidth, isTunneling);
        }
    };
    
    return { scene, animate };
}

function createVerse17Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000a14);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create container for the BEC visualization
    const atomsGroup = new THREE.Group();
    scene.add(atomsGroup);
    
    // Create experimental chamber
    const chamberGeometry = new THREE.CylinderGeometry(4, 4, 6, 32, 1, true);
    const chamberMaterial = new THREE.MeshPhongMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    
    const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    atomsGroup.add(chamber);
    
    // Add chamber caps
    const capGeometry = new THREE.CircleGeometry(4, 32);
    const capMaterial = new THREE.MeshPhongMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    
    const topCap = new THREE.Mesh(capGeometry, capMaterial);
    topCap.rotation.x = Math.PI / 2;
    topCap.position.y = 3;
    atomsGroup.add(topCap);
    
    const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
    bottomCap.rotation.x = -Math.PI / 2;
    bottomCap.position.y = -3;
    atomsGroup.add(bottomCap);
    
    // Create atoms
    const atoms = [];
    const atomCount = 200;
    
    // Atom appearance based on temperature
    function createAtom(position, temperature) {
        const atom = new THREE.Group();
        atom.position.copy(position);
        
        // Core
        const coreGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: temperature > 0.5 ? 0xff5500 : 0x00ccff,
            emissive: temperature > 0.5 ? 0x441100 : 0x004466
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        atom.add(core);
        
        // Electron cloud for hot atoms
        if (temperature > 0.5) {
            const cloudGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: 0xff8844,
                transparent: true,
                opacity: 0.3
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            atom.add(cloud);
            
            // Electrons
            const electronCount = 3;
            const electrons = [];
            
            for (let i = 0; i < electronCount; i++) {
                const electronGeometry = new THREE.SphereGeometry(0.03, 8, 8);
                const electronMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffaa66
                });
                
                const electron = new THREE.Mesh(electronGeometry, electronMaterial);
                
                // Initial position on orbital
                const angle = (i / electronCount) * Math.PI * 2;
                const orbitRadius = 0.2;
                electron.position.set(
                    Math.cos(angle) * orbitRadius,
                    Math.sin(angle) * orbitRadius,
                    0
                );
                
                atom.add(electron);
                electrons.push({
                    mesh: electron,
                    orbitAxis: new THREE.Vector3(
                        Math.random() - 0.5,
                        Math.random() - 0.5,
                        Math.random() - 0.5
                    ).normalize(),
                    orbitSpeed: 2 + Math.random() * 3,
                    offset: Math.random() * Math.PI * 2
                });
            }
            
            atom.userData.electrons = electrons;
        }
        
        // Wave function for cold atoms
        if (temperature <= 0.5) {
            const waveGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const waveMaterial = new THREE.MeshBasicMaterial({
                color: 0x88ccff,
                transparent: true,
                opacity: 0.5,
                wireframe: true
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            atom.add(wave);
            
            atom.userData.wave = wave;
        }
        
        // Store atom data
        atom.userData.temperature = temperature;
        atom.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * temperature * 2,
            (Math.random() - 0.5) * temperature * 2,
            (Math.random() - 0.5) * temperature * 2
        );
        
        atoms.push(atom);
        atomsGroup.add(atom);
        
        return atom;
    }
    
    // Create atoms at different positions
    let temperature = 1.0; // Start with hot atoms
    
    for (let i = 0; i < atomCount; i++) {
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 7
        );
        
        createAtom(position, temperature);
    }
    
    // Create BEC state (initially hidden)
    const becGeometry = new THREE.SphereGeometry(2, 32, 32);
    const becMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ccff,
        emissive: 0x004488,
        transparent: true,
        opacity: 0,
        wireframe: false
    });
    
    const bec = new THREE.Mesh(becGeometry, becMaterial);
    atomsGroup.add(bec);
    
    // Add wave effect to BEC
    const becWaveGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const becWaveMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0,
        wireframe: true
    });
    
    const becWave = new THREE.Mesh(becWaveGeometry, becWaveMaterial);
    bec.add(becWave);
    
    // Create temperature indicators
    const thermometerGroup = new THREE.Group();
    thermometerGroup.position.set(-5, 0, 0);
    scene.add(thermometerGroup);
    
    // Thermometer tube
    const tubeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const tubeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    thermometerGroup.add(tube);
    
    // Thermometer bulb
    const bulbGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const bulbMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.y = -2.7;
    thermometerGroup.add(bulb);
    
    // Temperature level
    const levelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 5, 16);
    const levelMaterial = new THREE.MeshPhongMaterial({
        color: 0xff5500,
        emissive: 0x441100
    });
    
    const level = new THREE.Mesh(levelGeometry, levelMaterial);
    level.position.y = -2.5;
    thermometerGroup.add(level);
    
    // Temperature labels
    function createLabel(text, position) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(2, 1, 1);
        
        return sprite;
    }
    
    // Add temperature labels
    const hotLabel = createLabel("Hot (Classical)", new THREE.Vector3(-5, 3, 0));
    thermometerGroup.add(hotLabel);
    
    const coldLabel = createLabel("Cold (Quantum)", new THREE.Vector3(-5, -3, 0));
    thermometerGroup.add(coldLabel);
    
    // Create BEC visualization diagram using D3.js
    const createBECDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('bec-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container
        const svg = d3.create('svg')
            .attr('id', 'bec-diagram')
            .attr('width', 300)
            .attr('height', 250)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 40, right: 20, bottom: 50, left: 40};
        const width = 300 - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // X scale represents temperature
        const x = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);
            
        // Y scale represents energy states
        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);
            
        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${(d).toFixed(1)}K`))
            .style('color', 'white');
            
        g.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .style('color', 'white');
            
        // Add axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 35)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Temperature');
            
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Energy States');
            
        // Add critical temperature indicator
        const criticalTemp = 0.5;
        
        g.append('line')
            .attr('x1', x(criticalTemp))
            .attr('y1', 0)
            .attr('x2', x(criticalTemp))
            .attr('y2', height)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3');
            
        g.append('text')
            .attr('x', x(criticalTemp))
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '10px')
            .text('Critical Temp');
            
        // Add energy state distribution area
        // Classical (hot) distribution
        const classicalArea = d3.area()
            .x(d => x(d.t))
            .y0(height)
            .y1(d => y(d.normal));
            
        // Ground state (BEC) distribution
        const groundArea = d3.area()
            .x(d => x(d.t))
            .y0(height)
            .y1(d => y(d.ground));
            
        // Generate distribution data
        const generateDistributionData = () => {
            const points = [];
            
            for (let t = 0; t <= 1; t += 0.05) {
                // For illustration: ground state occupation increases dramatically below critical temp
                const groundFraction = t <= criticalTemp ? 
                    Math.pow(1 - t/criticalTemp, 2) : 0;
                
                points.push({
                    t: t,
                    normal: 1 - groundFraction,
                    ground: groundFraction
                });
            }
            
            return points;
        };
        
        const distData = generateDistributionData();
        
        // Draw classical distribution
        g.append('path')
            .datum(distData)
            .attr('fill', 'url(#classicalGradient)')
            .attr('d', classicalArea);
            
        // Draw BEC (ground state) distribution
        g.append('path')
            .datum(distData)
            .attr('fill', 'url(#groundGradient)')
            .attr('d', groundArea);
            
        // Add gradients
        const defs = svg.append('defs');
        
        const classicalGradient = defs.append('linearGradient')
            .attr('id', 'classicalGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
            
        classicalGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#ff5500')
            .attr('stop-opacity', 0.7);
            
        classicalGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#ff5500')
            .attr('stop-opacity', 0.1);
            
        const groundGradient = defs.append('linearGradient')
            .attr('id', 'groundGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
            
        groundGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#00ccff')
            .attr('stop-opacity', 0.8);
            
        groundGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#00ccff')
            .attr('stop-opacity', 0.2);
            
        // Add current temperature indicator
        const tempIndicator = g.append('line')
            .attr('x1', x(temperature))
            .attr('y1', 0)
            .attr('x2', x(temperature))
            .attr('y2', height)
            .attr('stroke', '#ffcc00')
            .attr('stroke-width', 2);
            
        const tempMarker = g.append('circle')
            .attr('cx', x(temperature))
            .attr('cy', 10)
            .attr('r', 5)
            .attr('fill', '#ffcc00');
            
        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top + height + 20})`);
            
        // Classical state
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#ff5500')
            .attr('opacity', 0.7);
            
        legend.append('text')
            .attr('x', 15)
            .attr('y', 9)
            .attr('fill', 'white')
            .style('font-size', '10px')
            .text('Excited States (Classical)');
            
        // Ground state
        legend.append('rect')
            .attr('x', 150)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#00ccff')
            .attr('opacity', 0.8);
            
        legend.append('text')
            .attr('x', 165)
            .attr('y', 9)
            .attr('fill', 'white')
            .style('font-size', '10px')
            .text('Ground State (BEC)');
            
        // Add title
        svg.append('text')
            .attr('x', 150)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .text('Bose-Einstein Condensate');
            
        // Function to update temperature indicator
        const updateTemperature = (temp) => {
            tempIndicator.attr('x1', x(temp)).attr('x2', x(temp));
            tempMarker.attr('cx', x(temp));
            
            // Calculate ground state fraction
            const groundFraction = temp <= criticalTemp ? 
                Math.pow(1 - temp/criticalTemp, 2) : 0;
                
            // Update state labels
            if (groundFraction > 0.5) {
                svg.select('#state-label')?.remove();
                
                svg.append('text')
                    .attr('id', 'state-label')
                    .attr('x', 150)
                    .attr('y', 40)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#00ccff')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text('Quantum Condensate Formed');
            } else if (temp > criticalTemp) {
                svg.select('#state-label')?.remove();
                
                svg.append('text')
                    .attr('id', 'state-label')
                    .attr('x', 150)
                    .attr('y', 40)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#ff5500')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text('Classical Gas');
            } else {
                svg.select('#state-label')?.remove();
                
                svg.append('text')
                    .attr('id', 'state-label')
                    .attr('x', 150)
                    .attr('y', 40)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#ffffff')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text('Transition Region');
            }
        };
        
        // Store update function for later use
        svg.node().updateTemperature = updateTemperature;
        
        // Initial update
        updateTemperature(temperature);
        
        // Add to DOM
        document.body.appendChild(svg.node());
    };
    
    // Create initial diagram
    createBECDiagram();
    
    // Create simple state labels
    const stateLabel = createLabel("Classical State", new THREE.Vector3(0, 4, 0));
    atomsGroup.add(stateLabel);
    
    // Define states
    let currentState = temperature <= 0.5 ? "quantum" : "classical";
    let isStateChanging = false;
    let worldTime = 0;
    
    // Add scene-specific interaction
    scene.userData = {
        updateTemperature: (value) => {
            if (isStateChanging) return;
            
            temperature = value;
            
            // Update thermometer
            updateThermometer(temperature);
            
            // Update atom velocities and appearance based on temperature
            updateAtomState(temperature);
            
            // Update diagram
            const diagram = document.getElementById('bec-diagram');
            if (diagram && diagram.updateTemperature) {
                diagram.updateTemperature(temperature);
            }
        },
        toggleStates: () => {
            if (isStateChanging) return;
            
            isStateChanging = true;
            
            // Toggle between states
            const targetTemp = temperature <= 0.5 ? 1.0 : 0.1;
            
            // Animate temperature change
            const startTemp = temperature;
            const tempChange = {
                progress: 0,
                update: function(delta) {
                    this.progress += delta * 0.5;
                    
                    if (this.progress >= 1) {
                        temperature = targetTemp;
                        isStateChanging = false;
                        return false;
                    }
                    
                    temperature = startTemp + (targetTemp - startTemp) * this.progress;
                    
                    // Update thermometer
                    updateThermometer(temperature);
                    
                    // Update diagram
                    const diagram = document.getElementById('bec-diagram');
                    if (diagram && diagram.updateTemperature) {
                        diagram.updateTemperature(temperature);
                    }
                    
                    return true;
                }
            };
            
            scene.userData.tempAnimation = tempChange;
        }
    };
    
    // Update thermometer based on temperature
    function updateThermometer(temp) {
        // Scale level
        const baseY = -2.5;
        const maxHeight = 5;
        level.scale.y = temp;
        
        // Adjust position to grow from bottom up
        level.position.y = baseY + (maxHeight * temp) / 2;
        
        // Update color
        if (temp > 0.5) {
            levelMaterial.color.set(0xff5500);
            levelMaterial.emissive.set(0x441100);
        } else {
            levelMaterial.color.set(0x00ccff);
            levelMaterial.emissive.set(0x004466);
        }
    }
    
    // Update atoms based on temperature
    function updateAtomState(temp) {
        const newState = temp <= 0.5 ? "quantum" : "classical";
        
        // Skip if state hasn't changed
        if (currentState === newState && !isStateChanging) return;
        
        // Update BEC state
        if (newState === "quantum") {
            // Show BEC
            becMaterial.opacity = 0.7;
            becWaveMaterial.opacity = 0.3;
            
            // Update state label
            updateStateLabel("Quantum Condensate");
        } else {
            // Hide BEC
            becMaterial.opacity = 0;
            becWaveMaterial.opacity = 0;
            
            // Update state label
            updateStateLabel("Classical State");
        }
        
        // Update each atom
        atoms.forEach(atom => {
            // Update temperature and velocity
            atom.userData.temperature = temp;
            const speedScale = Math.max(0.1, temp);
            atom.userData.velocity.multiplyScalar(speedScale / Math.max(0.1, atom.userData.temperature));
            
            // Update appearance if state changed
            if (currentState !== newState) {
                atomsGroup.remove(atom);
                
                const newAtom = createAtom(atom.position, temp);
                newAtom.userData.velocity = atom.userData.velocity.clone();
            }
        });
        
        currentState = newState;
    }
    
    // Update state label
    function updateStateLabel(text) {
        stateLabel.material.map.dispose();
        
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        stateLabel.material.map = texture;
        stateLabel.material.needsUpdate = true;
    }
    
    // Animation function
    const animate = (delta) => {
        // Increment world time
        worldTime += delta;
        
        // Handle temperature animation if active
        if (scene.userData.tempAnimation) {
            const result = scene.userData.tempAnimation.update(delta);
            if (!result) {
                delete scene.userData.tempAnimation;
            }
        }
        
        // Rotate atoms group for better view
        atomsGroup.rotation.y += delta * 0.1;
        
        // Animate BEC effects
        if (temperature <= 0.5) {
            // Pulsate BEC
            const pulseScale = 1 + Math.sin(worldTime) * 0.05;
            bec.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Rotate wave effect
            becWave.rotation.x += delta * 0.2;
            becWave.rotation.y += delta * 0.3;
            becWave.rotation.z += delta * 0.1;
        }
        
        // Update atom positions and effects
        atoms.forEach(atom => {
            if (temperature <= 0.5) {
                // Quantum regime: atoms condense
                if (atom.position.length() > 0.1) {
                    // Move toward center
                    const direction = atom.position.clone().negate().normalize();
                    const speed = 0.1 + (1 - temperature) * 2;
                    atom.position.addScaledVector(direction, delta * speed);
                }
                
                // Rotate wave effect
                if (atom.userData.wave) {
                    atom.userData.wave.rotation.x += delta;
                    atom.userData.wave.rotation.y += delta * 0.7;
                }
            } else {
                // Classical regime: atoms move freely
                // Update position based on velocity
                const speed = atom.userData.temperature * 2;
                atom.position.addScaledVector(atom.userData.velocity, delta * speed);
                
                // Boundary check - reflect off chamber walls
                const pos = atom.position;
                const radius = 3.8; // Just inside chamber
                const distFromCenter = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
                
                if (distFromCenter > radius) {
                    // Reflect off cylindrical wall
                    const normal = new THREE.Vector3(pos.x, 0, pos.z).normalize();
                    atom.userData.velocity.reflect(normal);
                    
                    // Move slightly inward to prevent sticking
                    const inwardDir = normal.clone().negate();
                    pos.addScaledVector(inwardDir, 0.1);
                }
                
                // Reflect off top/bottom
                if (Math.abs(pos.y) > 2.8) {
                    atom.userData.velocity.y *= -1;
                    pos.y = Math.sign(pos.y) * 2.8;
                }
                
                // Animate electrons for hot atoms
                if (atom.userData.electrons) {
                    atom.userData.electrons.forEach(electron => {
                        const time = worldTime + electron.offset;
                        
                        // Create rotation matrix for orbit
                        const axis = electron.orbitAxis;
                        const angle = time * electron.orbitSpeed;
                        
                        // Rotate around axis
                        const quat = new THREE.Quaternion();
                        quat.setFromAxisAngle(axis, angle);
                        
                        const startPos = new THREE.Vector3(0.2, 0, 0);
                        startPos.applyQuaternion(quat);
                        
                        electron.mesh.position.copy(startPos);
                    });
                }
            }
        });
    };
    
    return { scene, animate };
}

function createVerse18Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create container for entanglement visualization
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    
    // Create "categories" or "realms" representing the four possibilities
    const realms = [];
    
    function createRealm(position, name, color) {
        const realm = new THREE.Group();
        realm.position.copy(position);
        
        // Base platform
        const baseGeometry = new THREE.CircleGeometry(2, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.rotation.x = -Math.PI / 2;
        base.position.y = -0.5;
        realm.add(base);
        
        // Add realm label
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(name, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const label = new THREE.Sprite(material);
        label.position.y = -1;
        label.scale.set(2, 1, 1);
        realm.add(label);
        
        // Add aura
        const auraGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.position.y = 0.5;
        realm.add(aura);
        
        worldGroup.add(realm);
        realms.push({
            group: realm,
            color: color,
            name: name,
            position: position.clone()
        });
        
        return realm;
    }
    
    // Create the four realms
    const permanentRealm = createRealm(new THREE.Vector3(-4, 0, -4), "Permanent", 0x4477ff);
    const impermanentRealm = createRealm(new THREE.Vector3(4, 0, -4), "Impermanent", 0xff7744);
    const bothRealm = createRealm(new THREE.Vector3(4, 0, 4), "Both", 0xaa44ff);
    const neitherRealm = createRealm(new THREE.Vector3(-4, 0, 4), "Neither", 0x44ddaa);
    
    // Create entangled particles
    const particleA = new THREE.Group();
    particleA.position.set(-6, 1, 0);
    worldGroup.add(particleA);
    
    const particleB = new THREE.Group();
    particleB.position.set(6, 1, 0);
    worldGroup.add(particleB);
    
    // Core for particle A
    const coreAGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const coreAMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x888888
    });
    
    const coreA = new THREE.Mesh(coreAGeometry, coreAMaterial);
    particleA.add(coreA);
    
    // Core for particle B
    const coreBGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const coreBMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x888888
    });
    
    const coreB = new THREE.Mesh(coreBGeometry, coreBMaterial);
    particleB.add(coreB);
    
    // Quantum state indicators for particle A
    const stateMarkersA = [];
    realms.forEach(realm => {
        const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const markerMaterial = new THREE.MeshPhongMaterial({
            color: realm.color,
            emissive: new THREE.Color(realm.color).multiplyScalar(0.5),
            transparent: true,
            opacity: 0.5
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        
        // Position marker in direction of its realm
        const direction = realm.position.clone().sub(particleA.position).normalize();
        marker.position.copy(direction.multiplyScalar(0.5));
        
        particleA.add(marker);
        stateMarkersA.push({
            mesh: marker,
            realm: realm
        });
    });
    
    // Quantum state indicators for particle B
    const stateMarkersB = [];
    realms.forEach(realm => {
        const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const markerMaterial = new THREE.MeshPhongMaterial({
            color: realm.color,
            emissive: new THREE.Color(realm.color).multiplyScalar(0.5),
            transparent: true,
            opacity: 0.5
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        
        // Position marker in direction of its realm
        const direction = realm.position.clone().sub(particleB.position).normalize();
        marker.position.copy(direction.multiplyScalar(0.5));
        
        particleB.add(marker);
        stateMarkersB.push({
            mesh: marker,
            realm: realm
        });
    });
    
    // Entanglement visualization
    const entanglementGeometry = new THREE.CylinderGeometry(0.05, 0.05, 12, 8);
    const entanglementMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    
    const entanglementBeam = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
    entanglementBeam.rotation.z = Math.PI / 2;
    entanglementBeam.position.y = 1;
    worldGroup.add(entanglementBeam);
    
    // Add "superposition" effect for particles
    function createSuperpositionEffect(particle) {
        const waveGeometry = new THREE.IcosahedronGeometry(0.5, 2);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        particle.add(wave);
        
        return wave;
    }
    
    const waveA = createSuperpositionEffect(particleA);
    const waveB = createSuperpositionEffect(particleB);
    
    // Create particles labels
    const particleALabel = createLabel("Particle A", new THREE.Vector3(-6, -0.5, 0), 0xffffff);
    worldGroup.add(particleALabel);
    
    const particleBLabel = createLabel("Particle B", new THREE.Vector3(6, -0.5, 0), 0xffffff);
    worldGroup.add(particleBLabel);
    
    function createLabel(text, position, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'Bold 36px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(2, 0.5, 1);
        
        return sprite;
    }
    
    // Create arrows connecting realms
    function createArrow(start, end, color) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        
        const arrowGroup = new THREE.Group();
        arrowGroup.position.copy(start);
        
        // Create line
        const lineGeometry = new THREE.CylinderGeometry(0.05, 0.05, length, 8);
        const lineMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        });
        
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.copy(direction.clone().multiplyScalar(0.5));
        line.lookAt(end);
        line.rotateX(Math.PI / 2);
        
        arrowGroup.add(line);
        worldGroup.add(arrowGroup);
        
        return arrowGroup;
    }
    
    // Connect the four realms with arrows
    const arrows = [
        createArrow(permanentRealm.position.clone().add(new THREE.Vector3(1, 0, 0)), 
                   impermanentRealm.position.clone().add(new THREE.Vector3(-1, 0, 0)), 
                   0xaaaaaa),
        createArrow(impermanentRealm.position.clone().add(new THREE.Vector3(0, 0, 1)), 
                   bothRealm.position.clone().add(new THREE.Vector3(0, 0, -1)), 
                   0xaaaaaa),
        createArrow(bothRealm.position.clone().add(new THREE.Vector3(-1, 0, 0)), 
                   neitherRealm.position.clone().add(new THREE.Vector3(1, 0, 0)), 
                   0xaaaaaa),
        createArrow(neitherRealm.position.clone().add(new THREE.Vector3(0, 0, -1)), 
                   permanentRealm.position.clone().add(new THREE.Vector3(0, 0, 1)), 
                   0xaaaaaa)
    ];
    
    // Create entanglement visualization diagram using D3.js
    const createEntanglementDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('entanglement-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container
        const svg = d3.create('svg')
            .attr('id', 'entanglement-diagram')
            .attr('width', 300)
            .attr('height', 250)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 40, right: 20, bottom: 20, left: 20};
        const width = 300 - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Draw entanglement diagram
        const particleRadius = 30;
        const stateRadius = 10;
        
        // Define particles positions
        const particleAPos = { x: width * 0.25, y: height * 0.5 };
        const particleBPos = { x: width * 0.75, y: height * 0.5 };
        
        // Draw entanglement connection
        g.append('line')
            .attr('x1', particleAPos.x)
            .attr('y1', particleAPos.y)
            .attr('x2', particleBPos.x)
            .attr('y2', particleBPos.y)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.5)
            .attr('stroke-dasharray', '3,3');
            
        // Create particle containers
        const particleAGroup = g.append('g')
            .attr('transform', `translate(${particleAPos.x},${particleAPos.y})`);
            
        const particleBGroup = g.append('g')
            .attr('transform', `translate(${particleBPos.x},${particleBPos.y})`);
            
        // Draw particles
        particleAGroup.append('circle')
            .attr('r', particleRadius)
            .attr('fill', 'white')
            .attr('opacity', 0.2);
            
        particleBGroup.append('circle')
            .attr('r', particleRadius)
            .attr('fill', 'white')
            .attr('opacity', 0.2);
            
        // Add particle cores
        particleAGroup.append('circle')
            .attr('r', particleRadius / 3)
            .attr('fill', 'white');
            
        particleBGroup.append('circle')
            .attr('r', particleRadius / 3)
            .attr('fill', 'white');
            
        // Add particle labels
        particleAGroup.append('text')
            .attr('y', particleRadius + 15)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Particle A');
            
        particleBGroup.append('text')
            .attr('y', particleRadius + 15)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text('Particle B');
            
        // Add state markers
        const realmColors = [
            { name: 'Permanent', color: '#4477ff' },
            { name: 'Impermanent', color: '#ff7744' },
            { name: 'Both', color: '#aa44ff' },
            { name: 'Neither', color: '#44ddaa' }
        ];
        
        realmColors.forEach((realm, i) => {
            const angle = (i / realmColors.length) * Math.PI * 2;
            const x = Math.cos(angle) * (particleRadius * 0.6);
            const y = Math.sin(angle) * (particleRadius * 0.6);
            
            // State marker for particle A
            particleAGroup.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', stateRadius)
                .attr('fill', realm.color)
                .attr('opacity', 0.5)
                .attr('id', `state-a-${i}`);
                
            // State marker for particle B
            particleBGroup.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', stateRadius)
                .attr('fill', realm.color)
                .attr('opacity', 0.5)
                .attr('id', `state-b-${i}`);
        });
        
        // Add title
        svg.append('text')
            .attr('x', 150)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .text('Entangled States');
            
        // Function to update entanglement state
        const updateEntanglement = (isEntangled, measuredA, measuredB) => {
            if (isEntangled) {
                // Show superposition
                realmColors.forEach((realm, i) => {
                    svg.select(`#state-a-${i}`).attr('opacity', 0.5);
                    svg.select(`#state-b-${i}`).attr('opacity', 0.5);
                });
                
                // Update connection
                svg.select('line')
                    .attr('stroke', 'white')
                    .attr('stroke-dasharray', '3,3');
                    
                // Status text
                svg.select('#status-text')?.remove();
                svg.append('text')
                    .attr('id', 'status-text')
                    .attr('x', 150)
                    .attr('y', 210)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .style('font-size', '12px')
                    .text('Particles in Superposition of All States');
            } else if (measuredA !== null && measuredB !== null) {
                // Measured state
                realmColors.forEach((realm, i) => {
                    // Particle A
                    svg.select(`#state-a-${i}`)
                        .attr('opacity', i === measuredA ? 1 : 0.1);
                        
                    // Particle B
                    svg.select(`#state-b-${i}`)
                        .attr('opacity', i === measuredB ? 1 : 0.1);
                });
                
                // Update connection
                svg.select('line')
                    .attr('stroke', realmColors[measuredA].color)
                    .attr('stroke-dasharray', null);
                    
                // Status text
                svg.select('#status-text')?.remove();
                svg.append('text')
                    .attr('id', 'status-text')
                    .attr('x', 150)
                    .attr('y', 210)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .style('font-size', '12px')
                    .text(`Measured: A = ${realmColors[measuredA].name}, B = ${realmColors[measuredB].name}`);
            }
        };
        
        // Store update function for later use
        svg.node().updateEntanglement = updateEntanglement;
        
        // Initial update
        updateEntanglement(true, null, null);
        
        // Add to DOM
        document.body.appendChild(svg.node());
    };
    
    // Create initial diagram
    createEntanglementDiagram();
    
    // Scene variables
    let isEntangled = true;
    let measuredA = null;
    let measuredB = null;
    let worldTime = 0;
    
    // Add scene-specific interaction
    scene.userData = {
        entangleParticles: () => {
            // Reset to entangled state
            isEntangled = true;
            measuredA = null;
            measuredB = null;
            
            // Reset particle appearance
            coreAMaterial.color.set(0xffffff);
            coreBMaterial.color.set(0xffffff);
            
            // Enable all state markers
            stateMarkersA.forEach(marker => {
                marker.mesh.material.opacity = 0.5;
                marker.mesh.scale.set(1, 1, 1);
            });
            
            stateMarkersB.forEach(marker => {
                marker.mesh.material.opacity = 0.5;
                marker.mesh.scale.set(1, 1, 1);
            });
            
            // Update entanglement beam
            entanglementBeam.material.color.set(0xffffff);
            entanglementBeam.material.opacity = 0.3;
            
            // Update diagram
            const diagram = document.getElementById('entanglement-diagram');
            if (diagram && diagram.updateEntanglement) {
                diagram.updateEntanglement(true, null, null);
            }
            
            // Add entanglement effect
            const effectGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const effectMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7
            });
            
            const entanglementEffect = new THREE.Mesh(effectGeometry, effectMaterial);
            entanglementEffect.position.set(0, 1, 0);
            
            worldGroup.add(entanglementEffect);
            
            entanglementEffect.userData = {
                age: 0,
                update: function(delta) {
                    this.age += delta;
                    
                    if (this.age > 1.5) {
                        worldGroup.remove(entanglementEffect);
                        return false;
                    }
                    
                    const scale = 1 + this.age * 10;
                    entanglementEffect.scale.set(scale, scale, scale);
                    entanglementEffect.material.opacity = 0.7 * (1 - this.age / 1.5);
                    
                    return true;
                }
            };
        },
        measureEntanglement: () => {
            if (!isEntangled) return;
            
            isEntangled = false;
            
            // Randomly choose a state for particle A
            measuredA = Math.floor(Math.random() * 4);
            
            // Particle B is perfectly correlated (for simplicity)
            measuredB = measuredA;
            
            // Update particle colors
            const color = new THREE.Color(realms[measuredA].color);
            coreAMaterial.color.copy(color);
            coreBMaterial.color.copy(color);
            
            // Update entanglement beam
            entanglementBeam.material.color.copy(color);
            entanglementBeam.material.opacity = 0.7;
            
            // Update state markers
            stateMarkersA.forEach((marker, i) => {
                if (i === measuredA) {
                    marker.mesh.material.opacity = 1;
                    marker.mesh.scale.set(1.5, 1.5, 1.5);
                } else {
                    marker.mesh.material.opacity = 0.1;
                    marker.mesh.scale.set(0.5, 0.5, 0.5);
                }
            });
            
            stateMarkersB.forEach((marker, i) => {
                if (i === measuredB) {
                    marker.mesh.material.opacity = 1;
                    marker.mesh.scale.set(1.5, 1.5, 1.5);
                } else {
                    marker.mesh.material.opacity = 0.1;
                    marker.mesh.scale.set(0.5, 0.5, 0.5);
                }
            });
            
            // Update diagram
            const diagram = document.getElementById('entanglement-diagram');
            if (diagram && diagram.updateEntanglement) {
                diagram.updateEntanglement(false, measuredA, measuredB);
            }
            
            // Add collapse effect for each particle
            const createCollapseEffect = (position, color) => {
                const collapseGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                const collapseMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.7
                });
                
                const collapse = new THREE.Mesh(collapseGeometry, collapseMaterial);
                collapse.position.copy(position);
                
                worldGroup.add(collapse);
                
                collapse.userData = {
                    age: 0,
                    update: function(delta) {
                        this.age += delta;
                        
                        if (this.age > 1) {
                            worldGroup.remove(collapse);
                            return false;
                        }
                        
                        const scale = 1 + this.age * 5;
                        collapse.scale.set(scale, scale, scale);
                        collapse.material.opacity = 0.7 * (1 - this.age / 1);
                        
                        return true;
                    }
                };
            };
            
            createCollapseEffect(particleA.position, realms[measuredA].color);
            createCollapseEffect(particleB.position, realms[measuredB].color);
        }
    };
    
    // Animation function
    const animate = (delta) => {
        // Increment world time
        worldTime += delta;
        
        // Rotate world group for better view
        worldGroup.rotation.y += delta * 0.1;
        
        // Animate realm auras
        realms.forEach(realm => {
            const aura = realm.group.children[2]; // Aura is third child
            const scale = 1 + Math.sin(worldTime + Math.random()) * 0.1;
            aura.scale.set(scale, scale, scale);
        });
        
        // Animate superposition waves if entangled
        if (isEntangled) {
            // Rotate waves
            waveA.rotation.x += delta * 0.5;
            waveA.rotation.y += delta * 0.7;
            waveA.rotation.z += delta * 0.3;
            
            waveB.rotation.x += delta * 0.5;
            waveB.rotation.y += delta * 0.7;
            waveB.rotation.z += delta * 0.3;
            
            // Pulse waves
            const waveScale = 1 + Math.sin(worldTime * 2) * 0.2;
            waveA.scale.set(waveScale, waveScale, waveScale);
            waveB.scale.set(waveScale, waveScale, waveScale);
            
            // Pulse state markers
            stateMarkersA.forEach(marker => {
                const scale = 1 + Math.sin(worldTime * 3 + Math.random() * 10) * 0.3;
                marker.mesh.scale.set(scale, scale, scale);
            });
            
            stateMarkersB.forEach(marker => {
                const scale = 1 + Math.sin(worldTime * 3 + Math.random() * 10) * 0.3;
                marker.mesh.scale.set(scale, scale, scale);
            });
            
            // Animate entanglement beam
            entanglementBeam.material.opacity = 0.3 + Math.sin(worldTime * 5) * 0.2;
        } else {
            // Hide waves when not in superposition
            waveA.scale.set(0.1, 0.1, 0.1);
            waveB.scale.set(0.1, 0.1, 0.1);
        }
        
        // Update scene-specific animations
        worldGroup.traverse(object => {
            if (object.userData && object.userData.update) {
                const result = object.userData.update(delta);
                if (result === false) {
                    delete object.userData.update;
                }
            }
        });
    };
    
    return { scene, animate };
}

function createVerse19Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create container for the black hole visualization
    const blackHoleGroup = new THREE.Group();
    scene.add(blackHoleGroup);
    
    // Create black hole
    const blackHoleRadius = 2;
    const blackHoleGeometry = new THREE.SphereGeometry(blackHoleRadius, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.9
    });
    
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHoleGroup.add(blackHole);
    
    // Create event horizon
    const horizonGeometry = new THREE.SphereGeometry(blackHoleRadius * 1.05, 32, 32);
    const horizonMaterial = new THREE.MeshBasicMaterial({
        color: 0x336699,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    
    const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    blackHoleGroup.add(eventHorizon);
    
    // Create accretion disk
    const diskGeometry = new THREE.RingGeometry(blackHoleRadius * 1.2, blackHoleRadius * 3, 64, 8);
    const diskMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaa66,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        emissive: 0x662200
    });
    
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.rotation.x = Math.PI / 2;
    blackHoleGroup.add(accretionDisk);
    
    // Create gravitational lensing effect
    const lensGeometry = new THREE.SphereGeometry(blackHoleRadius * 1.3, 32, 32);
    const lensMaterial = new THREE.MeshBasicMaterial({
        color: 0x88aaff,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        side: THREE.DoubleSide
    });
    
    const gravitationalLens = new THREE.Mesh(lensGeometry, lensMaterial);
    blackHoleGroup.add(gravitationalLens);
    
    // Create Hawking radiation particles
    const radiationParticles = [];
    
    function createRadiationParticle() {
        const particle = new THREE.Group();
        
        // Random position on event horizon
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        const x = blackHoleRadius * Math.sin(theta) * Math.cos(phi);
        const y = blackHoleRadius * Math.sin(theta) * Math.sin(phi);
        const z = blackHoleRadius * Math.cos(theta);
        
        particle.position.set(x, y, z);
        
        // Create particle pair
        const escapeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const escapeMaterial = new THREE.MeshPhongMaterial({
            color: 0x88ccff,
            emissive: 0x2244aa,
            transparent: true,
            opacity: 0.9
        });
        
        const escapeParticle = new THREE.Mesh(escapeGeometry, escapeMaterial);
        particle.add(escapeParticle);
        
        // Electron trail
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.5
        });
        
        const trailPositions = [];
        for (let i = 0; i < 20; i++) {
            trailPositions.push(0, 0, 0);
        }
        
        trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        escapeParticle.add(trail);
        
        // Antineutrino
        const neutrinoGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const neutrinoMaterial = new THREE.MeshPhongMaterial({
            color: 0xff8866,
            emissive: 0xaa4422,
            transparent: true,
            opacity: 0.9
        });
        
        const neutrino = new THREE.Mesh(neutrinoGeometry, neutrinoMaterial);
        particle.add(neutrino);
        
        // Neutrino trail
        const neutrinoTrailGeometry = new THREE.BufferGeometry();
        const neutrinoTrailMaterial = new THREE.LineBasicMaterial({
            color: 0xff8866,
            transparent: true,
            opacity: 0.3
        });
        
        const neutrinoTrailPositions = [];
        for (let i = 0; i < 20; i++) {
            neutrinoTrailPositions.push(0, 0, 0);
        }
        
        neutrinoTrailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(neutrinoTrailPositions, 3));
        const neutrinoTrail = new THREE.Line(neutrinoTrailGeometry, neutrinoTrailMaterial);
        neutrino.add(neutrinoTrail);
        
        // Add particle data and positioning
        particle.userData = {
            age: 0,
            escapeParticle,
            neutrino,
            escapeTrail: trail,
            neutrinoTrail,
            trailPositions: [],
            neutrinoTrailPositions: [],
            electronDirection: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize(),
            neutrinoDirection: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize(),
            electronSpeed: 0.5 + Math.random() * 1,
            neutrinoSpeed: 1 + Math.random() * 1
        };
        
        blackHoleGroup.add(particle);
        radiationParticles.push(particle);
        return particle;
    }
    
    // Create initial particles
    for (let i = 0; i < 10; i++) {
        createRadiationParticle();
    }
    
    // Create visualization diagram using D3.js
    const createHawkingDiagram = () => {
        // Remove any existing diagram
        const existingDiagram = document.getElementById('hawking-diagram');
        if (existingDiagram) {
            existingDiagram.remove();
        }
        
        // Create SVG container
        const svg = d3.create('svg')
            .attr('id', 'hawking-diagram')
            .attr('width', 300)
            .attr('height', 200)
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '20px')
            .style('background', 'rgba(0,0,0,0.7)')
            .style('border', '1px solid rgba(255,255,255,0.3)')
            .style('border-radius', '5px');
            
        // Set up visualization
        const margin = {top: 30, right: 20, bottom: 40, left: 40};
        const width = 300 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Draw Hawking radiation diagram
        const radiationData = [
            {x: Math.random() * 10, y: Math.random() * 10},
            {x: Math.random() * 10, y: Math.random() * 10},
            {x: Math.random() * 10, y: Math.random() * 10},
            {x: Math.random() * 10, y: Math.random() * 10},
            {x: Math.random() * 10, y: Math.random() * 10}
        ];
        
        // Function to generate radiation points
        const generateRadiationPoints = () => {
            const points = [];
            
            for (let i = 0; i < radiationData.length; i++) {
                const point = radiationData[i];
                points.push([point.x, point.y]);
            }
            
            return points;
        };
        
        // Draw initial radiation points
        const initialPoints = generateRadiationPoints();
        
        // Add points
        g.selectAll('circle')
            .data(initialPoints)
            .enter()
            .append('circle')
            .attr('cx', d => d[0])
            .attr('cy', d => d[1])
            .attr('r', 5)
            .attr('fill', '#ffaa00');
            
        // Function to update radiation points
        const updateRadiationPoints = () => {
            // Update points
            const points = generateRadiationPoints();
            
            // Update circles
            g.selectAll('circle')
                .data(points)
                .attr('cx', d => d[0])
                .attr('cy', d => d[1]);
        };
        
        // Store update function for later use
        svg.node().updateRadiationPoints = updateRadiationPoints;
        
        // Add to DOM
        document.body.appendChild(svg.node());
    };
    
    // Create initial diagram
    createHawkingDiagram();
    
    // Animation function
    const animate = (delta) => {
        // Increment world time
        worldTime += delta;
        
        // Rotate black hole slightly for better view
        blackHoleGroup.rotation.y += delta * 0.05;
        
        // Animate event horizon pulsing
        const scale = 1 + Math.sin(worldTime * 2) * 0.01;
        eventHorizon.scale.set(scale, scale, scale);
        
        // Animate accretion disk
        accretionDisk.rotation.y += delta * 0.1;
        
        // Update radiation particles
        radiationParticles.forEach((particle, index) => {
            particle.userData.age += delta;
            
            // Move particles
            const electronPos = particle.userData.escapeParticle.position;
            electronPos.addScaledVector(particle.userData.electronDirection, delta * particle.userData.electronSpeed);
            
            const neutrinoPos = particle.userData.neutrino.position;
            neutrinoPos.addScaledVector(particle.userData.neutrinoDirection, delta * particle.userData.neutrinoSpeed);
            
            // Update trails
            const trailPositions = particle.userData.escapeTrail.geometry.attributes.position.array;
            const neutrinoTrailPositions = particle.userData.neutrinoTrail.geometry.attributes.position.array;
            
            // Shift all positions down
            for (let i = trailPositions.length - 1; i >= 3; i--) {
                trailPositions[i] = trailPositions[i - 3];
                neutrinoTrailPositions[i] = neutrinoTrailPositions[i - 3];
            }
            
            // Add current position to front
            trailPositions[0] = electronPos.x;
            trailPositions[1] = electronPos.y;
            trailPositions[2] = electronPos.z;
            
            neutrinoTrailPositions[0] = neutrinoPos.x;
            neutrinoTrailPositions[1] = neutrinoPos.y;
            neutrinoTrailPositions[2] = neutrinoPos.z;
            
            particle.userData.escapeTrail.geometry.attributes.position.needsUpdate = true;
            particle.userData.neutrinoTrail.geometry.attributes.position.needsUpdate = true;
            
            // Remove old particles
            if (particle.userData.age > 5) {
                blackHoleGroup.remove(particle);
                radiationParticles.splice(index, 1);
            }
        });
        
        // Update diagram
        const diagram = document.getElementById('hawking-diagram');
        if (diagram && diagram.updateRadiationPoints) {
            diagram.updateRadiationPoints();
        }
    };
    
    return { scene, animate };
}

// Initialize everything
function init() {
    initBaseScene();
    setupUI();
    loadVerse(currentVerseIndex);
}

// Start the application
init();