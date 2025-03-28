import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config } from './config.js';
import gsap from 'gsap';

class Application {
    constructor() {
        this.currentVerseIndex = 0;
        this.scenes = [];
        this.currentScene = null;
        this.initialized = false;
        
        this.setupDOM();
        this.setupBaseScene();
        this.setupEventListeners();
        
        // Initialize all scenes (but only activate the first one)
        this.initScenes();
        
        // Check URL for verse parameter
        this.checkURLForVerse();
        
        // Start animation loop
        this.animate();
    }
    
    checkURLForVerse() {
        const urlParams = new URLSearchParams(window.location.search);
        const verseParam = urlParams.get('verse');
        
        if (verseParam) {
            const verseIndex = parseInt(verseParam) - 1; // Convert to 0-based index
            if (verseIndex >= 0 && verseIndex < config.verses.length) {
                this.setActiveVerse(verseIndex);
            }
        }
    }
    
    setupDOM() {
        this.container = document.getElementById('scene-container');
        this.verseDisplay = document.getElementById('verse-display');
        this.sceneControls = document.getElementById('scene-controls');
        this.prevButton = document.getElementById('prev-verse');
        this.nextButton = document.getElementById('next-verse');
        this.explanationContent = document.getElementById('explanation-content');
        this.toggleExplanationButton = document.getElementById('toggle-explanation');
    }
    
    setupBaseScene() {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Setup camera (will be used by all scenes)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = config.defaultAnimationSettings.cameraDistance;
        
        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.prevButton.addEventListener('click', this.goToPreviousVerse.bind(this));
        this.nextButton.addEventListener('click', this.goToNextVerse.bind(this));
        this.toggleExplanationButton.addEventListener('click', this.toggleExplanation.bind(this));
    }
    
    initScenes() {
        // Initialize a scene for each verse
        this.scenes = [
            new QuantumFluctuationsScene(this),
            new TimeNetworkScene(this),
            new PairProductionScene(this),
            new SternGerlachScene(this),
            new AtomicTransitionsScene(this),
            new ContextualityScene(this),
            new EntanglementScene(this),
            new ObserverEffectScene(this)
        ];
        
        // Set initial scene
        this.setActiveVerse(0);
    }
    
    setActiveVerse(index) {
        if (index < 0 || index >= config.verses.length) return;
        
        // Deactivate current scene
        if (this.currentScene) {
            this.currentScene.deactivate();
        }
        
        this.currentVerseIndex = index;
        this.currentScene = this.scenes[index];
        
        // Update navigation buttons
        this.prevButton.disabled = (index === 0);
        this.nextButton.disabled = (index === config.verses.length - 1);
        
        // Update verse display
        this.updateVerseDisplay();
        
        // Update scene controls
        this.updateSceneControls();
        
        // Activate the new scene
        this.currentScene.activate();
    }
    
    updateVerseDisplay() {
        const verse = config.verses[this.currentVerseIndex];
        
        this.verseDisplay.innerHTML = `
            <div class="verse-number">Verse ${verse.number}</div>
            <div class="verse-text">${verse.text}</div>
            
            <div class="concept-section">
                <div class="concept-title">Madhyamaka Concept:</div>
                <div class="concept-content">${verse.concepts.madhyamaka}</div>
            </div>
            
            <div class="concept-section">
                <div class="concept-title">Quantum Physics Parallel:</div>
                <div class="concept-content">${verse.concepts.quantum}</div>
            </div>
        `;
        
        this.explanationContent.innerHTML = `
            <div class="concept-content">${verse.concepts.accessible}</div>
        `;
    }
    
    updateSceneControls() {
        this.sceneControls.innerHTML = '';
        const verse = config.verses[this.currentVerseIndex];
        
        verse.controls.forEach(control => {
            const controlItem = document.createElement('div');
            controlItem.className = 'control-item';
            
            switch (control.type) {
                case 'slider':
                    controlItem.innerHTML = `
                        <label for="${control.id}">${control.label}</label>
                        <input 
                            type="range" 
                            id="${control.id}" 
                            min="${control.min}" 
                            max="${control.max}" 
                            value="${control.value}" 
                            step="${control.step || 1}"
                        >
                    `;
                    this.sceneControls.appendChild(controlItem);
                    
                    // Add event listener
                    document.getElementById(control.id).addEventListener('input', (e) => {
                        if (this.currentScene && this.currentScene.onControlChange) {
                            this.currentScene.onControlChange(control.id, parseFloat(e.target.value));
                        }
                    });
                    break;
                    
                case 'button':
                    controlItem.innerHTML = `
                        <button id="${control.id}" class="control-button">${control.label}</button>
                    `;
                    this.sceneControls.appendChild(controlItem);
                    
                    // Add event listener
                    document.getElementById(control.id).addEventListener('click', () => {
                        if (this.currentScene && this.currentScene.onControlChange) {
                            this.currentScene.onControlChange(control.id);
                        }
                    });
                    break;
                    
                case 'select':
                    let options = '';
                    control.options.forEach(option => {
                        options += `<option value="${option}">${option}</option>`;
                    });
                    
                    controlItem.innerHTML = `
                        <label for="${control.id}">${control.label}</label>
                        <select id="${control.id}">
                            ${options}
                        </select>
                    `;
                    this.sceneControls.appendChild(controlItem);
                    
                    // Add event listener
                    document.getElementById(control.id).addEventListener('change', (e) => {
                        if (this.currentScene && this.currentScene.onControlChange) {
                            this.currentScene.onControlChange(control.id, e.target.value);
                        }
                    });
                    break;
            }
        });
    }
    
    goToPreviousVerse() {
        if (this.currentVerseIndex > 0) {
            this.setActiveVerse(this.currentVerseIndex - 1);
        }
    }
    
    goToNextVerse() {
        if (this.currentVerseIndex < config.verses.length - 1) {
            this.setActiveVerse(this.currentVerseIndex + 1);
        }
    }
    
    toggleExplanation() {
        const explanationContent = document.getElementById('explanation-content');
        if (explanationContent.style.display === 'none') {
            explanationContent.style.display = 'block';
            this.toggleExplanationButton.textContent = 'Hide';
            document.body.classList.remove('explanation-hidden');
        } else {
            explanationContent.style.display = 'none';
            this.toggleExplanationButton.textContent = 'Show';
            document.body.classList.add('explanation-hidden');
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.controls.update();
        
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update();
        }
        
        this.renderer.render(this.currentScene.scene, this.camera);
    }
}

// Base Scene class for all verse animations
class BaseScene {
    constructor(app) {
        this.app = app;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(config.defaultAnimationSettings.backgroundColor);
        this.active = false;
        this.clock = new THREE.Clock();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        this.init();
    }
    
    init() {
        // To be implemented by subclasses
    }
    
    activate() {
        this.active = true;
        this.clock.start();
    }
    
    deactivate() {
        this.active = false;
    }
    
    update() {
        // To be implemented by subclasses
    }
    
    onControlChange(controlId, value) {
        // To be implemented by subclasses
    }
    
    createParticle(color = 0xffffff, size = 0.05) {
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            shininess: 90
        });
        return new THREE.Mesh(geometry, material);
    }
}

// Verse 1: Quantum Fluctuations Scene
class QuantumFluctuationsScene extends BaseScene {
    init() {
        this.particles = [];
        this.particleDensity = 500;
        this.energyLevel = 1.0;
        
        // Create particle group
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
        
        // Initialize particles
        this.createParticles();
    }
    
    createParticles() {
        // Clear existing particles
        while (this.particleGroup.children.length > 0) {
            this.particleGroup.remove(this.particleGroup.children[0]);
        }
        this.particles = [];
        
        // Create new particles
        for (let i = 0; i < this.particleDensity; i++) {
            this.addParticle();
        }
    }
    
    addParticle() {
        const radius = 5;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        
        // Randomize color based on position
        const hue = (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 15;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        
        const particle = this.createParticle(color.getHex(), 0.05);
        particle.position.set(x, y, z);
        
        // Add lifetime and animation properties
        particle.userData = {
            lifetime: Math.random() * 2 + 1,
            age: 0,
            originalScale: particle.scale.x,
            speed: Math.random() * 0.5 + 0.5
        };
        
        this.particleGroup.add(particle);
        this.particles.push(particle);
    }
    
    update() {
        if (!this.active) return;
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.userData.age += delta * this.energyLevel;
            
            // Fade in/out effect
            const normalizedAge = particle.userData.age / particle.userData.lifetime;
            let scale;
            
            if (normalizedAge < 0.2) {
                // Fade in
                scale = normalizedAge * 5 * particle.userData.originalScale;
            } else if (normalizedAge > 0.8) {
                // Fade out
                scale = (1 - (normalizedAge - 0.8) * 5) * particle.userData.originalScale;
            } else {
                // Stable
                scale = particle.userData.originalScale * (1 + 0.1 * Math.sin(time * 5 * particle.userData.speed));
            }
            
            particle.scale.set(scale, scale, scale);
            
            // Remove particles that have lived their life
            if (particle.userData.age >= particle.userData.lifetime) {
                this.particleGroup.remove(particle);
                this.particles.splice(i, 1);
                this.addParticle(); // Replace with a new one
            }
        }
        
        // Rotate the entire particle system slightly
        this.particleGroup.rotation.y += 0.001;
        this.particleGroup.rotation.x += 0.0005;
    }
    
    onControlChange(controlId, value) {
        if (controlId === 'particle-density') {
            this.particleDensity = value;
            this.createParticles();
        } else if (controlId === 'energy-level') {
            this.energyLevel = value;
        }
    }
}

// Verse 2: Time Network Scene
class TimeNetworkScene extends BaseScene {
    init() {
        this.nodeCount = 40;
        this.connectionDistance = 1.5;
        this.nodes = [];
        this.connections = [];
        this.selectedPath = null;
        
        // Create node group
        this.nodeGroup = new THREE.Group();
        this.scene.add(this.nodeGroup);
        
        // Create nodes
        this.createNetwork();
    }
    
    createNetwork() {
        // Clear existing network
        while (this.nodeGroup.children.length > 0) {
            this.nodeGroup.remove(this.nodeGroup.children[0]);
        }
        this.nodes = [];
        this.connections = [];
        
        // Create nodes
        for (let i = 0; i < this.nodeCount; i++) {
            const node = this.createNode();
            this.nodes.push(node);
            this.nodeGroup.add(node);
        }
        
        // Create connections
        this.createConnections();
    }
    
    createNode() {
        // Create node
        const size = Math.random() * 0.1 + 0.05;
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        
        const node = this.createParticle(color.getHex(), size);
        
        // Position in a sphere
        const radius = 4;
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * radius * 2,
            (Math.random() - 0.5) * radius * 2,
            (Math.random() - 0.5) * radius * 2
        );
        node.position.copy(position);
        
        // Add properties
        node.userData = {
            hue: hue,
            connections: [],
            pulseSpeed: Math.random() * 2 + 1,
            selected: false
        };
        
        // Add hover effect
        node.callback = () => this.selectPath(node);
        
        return node;
    }
    
    createConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            const node1 = this.nodes[i];
            
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node2 = this.nodes[j];
                const distance = node1.position.distanceTo(node2.position);
                
                if (distance < this.connectionDistance) {
                    this.connectNodes(node1, node2);
                }
            }
        }
    }
    
    connectNodes(node1, node2) {
        // Create line geometry
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            node1.position,
            node2.position
        ]);
        
        // Blend colors
        const blendedHue = (node1.userData.hue + node2.userData.hue) / 2;
        const lineColor = new THREE.Color().setHSL(blendedHue, 1, 0.5);
        
        // Create line material
        const lineMaterial = new THREE.LineBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: 0.3
        });
        
        // Create line
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.nodeGroup.add(line);
        
        // Store connection
        const connection = {
            line: line,
            node1: node1,
            node2: node2,
            color: lineColor
        };
        
        this.connections.push(connection);
        node1.userData.connections.push(connection);
        node2.userData.connections.push(connection);
    }
    
    selectPath(startNode) {
        // Deselect current path
        if (this.selectedPath) {
            this.selectedPath.forEach(node => {
                node.userData.selected = false;
                node.scale.set(1, 1, 1);
            });
            
            // Reset connection colors
            this.connections.forEach(connection => {
                connection.line.material.opacity = 0.3;
            });
        }
        
        // Create a new path
        this.selectedPath = [startNode];
        startNode.userData.selected = true;
        
        // Highlight the start node
        startNode.scale.set(1.5, 1.5, 1.5);
        
        // Find a random path through the network
        let currentNode = startNode;
        const pathLength = Math.floor(Math.random() * 5) + 3; // 3-7 nodes
        
        for (let i = 0; i < pathLength; i++) {
            if (currentNode.userData.connections.length === 0) break;
            
            // Choose a random connection
            const randomConnectionIndex = Math.floor(Math.random() * currentNode.userData.connections.length);
            const connection = currentNode.userData.connections[randomConnectionIndex];
            
            // Highlight the connection
            connection.line.material.opacity = 1;
            
            // Move to the next node
            const nextNode = (connection.node1 === currentNode) ? connection.node2 : connection.node1;
            
            // Skip if already in path
            if (this.selectedPath.includes(nextNode)) break;
            
            // Add to path
            this.selectedPath.push(nextNode);
            nextNode.userData.selected = true;
            nextNode.scale.set(1.5, 1.5, 1.5);
            
            currentNode = nextNode;
        }
    }
    
    update() {
        if (!this.active) return;
        
        const time = this.clock.getElapsedTime();
        
        // Pulsate nodes
        this.nodes.forEach(node => {
            const pulse = 0.9 + 0.2 * Math.sin(time * node.userData.pulseSpeed);
            const baseScale = node.userData.selected ? 1.5 : 1;
            node.scale.set(baseScale * pulse, baseScale * pulse, baseScale * pulse);
        });
        
        // Gentle rotation of the entire network
        this.nodeGroup.rotation.y += 0.001;
    }
    
    onControlChange(controlId, value) {
        if (controlId === 'node-count') {
            this.nodeCount = value;
            this.createNetwork();
        } else if (controlId === 'connection-distance') {
            this.connectionDistance = value;
            this.createNetwork();
        }
    }
}

// Verse 3: Pair Production Scene
class PairProductionScene extends BaseScene {
    init() {
        this.energyThreshold = 1.0;
        this.animationState = 'idle'; // idle, creating, created, annihilating
        
        // Create container
        this.container = new THREE.Group();
        this.scene.add(this.container);
        
        // Create photon
        this.photon = this.createPhoton();
        this.container.add(this.photon);
        
        // Create electron and positron (initially hidden)
        this.electron = this.createParticle(0x0088ff, 0.2);
        this.positron = this.createParticle(0xff4400, 0.2);
        
        this.electron.scale.set(0, 0, 0);
        this.positron.scale.set(0, 0, 0);
        
        this.container.add(this.electron);
        this.container.add(this.positron);
        
        // Create field lines
        this.fieldLines = this.createFieldLines();
        this.container.add(this.fieldLines);
    }
    
    createPhoton() {
        const group = new THREE.Group();
        
        // Create wavy line for photon
        const points = [];
        const segments = 20;
        const length = 3;
        
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * length - length / 2;
            const y = Math.sin(i * Math.PI * 2 / 5) * 0.2;
            points.push(new THREE.Vector3(x, y, 0));
        }
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffff00,
            linewidth: 3
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
        
        // Add arrows to indicate direction
        const arrowSize = 0.1;
        const arrowGeometry = new THREE.ConeGeometry(arrowSize, arrowSize * 2, 8);
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        
        const arrow1 = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow1.position.set(1, 0, 0);
        arrow1.rotation.z = -Math.PI / 2;
        group.add(arrow1);
        
        const arrow2 = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow2.position.set(-1, 0, 0);
        arrow2.rotation.z = Math.PI / 2;
        group.add(arrow2);
        
        return group;
    }
    
    createFieldLines() {
        const group = new THREE.Group();
        
        // Create field line material
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x444466,
            transparent: true,
            opacity: 0.5
        });
        
        // Create field lines
        const fieldSize = 4;
        const fieldDensity = 5;
        
        for (let i = -fieldDensity; i <= fieldDensity; i++) {
            const x = (i / fieldDensity) * fieldSize;
            
            // Vertical lines
            const vLinePoints = [
                new THREE.Vector3(x, -fieldSize, 0),
                new THREE.Vector3(x, fieldSize, 0)
            ];
            const vLineGeometry = new THREE.BufferGeometry().setFromPoints(vLinePoints);
            const vLine = new THREE.Line(vLineGeometry, lineMaterial);
            group.add(vLine);
            
            // Horizontal lines
            const y = (i / fieldDensity) * fieldSize;
            const hLinePoints = [
                new THREE.Vector3(-fieldSize, y, 0),
                new THREE.Vector3(fieldSize, y, 0)
            ];
            const hLineGeometry = new THREE.BufferGeometry().setFromPoints(hLinePoints);
            const hLine = new THREE.Line(hLineGeometry, lineMaterial);
            group.add(hLine);
        }
        
        return group;
    }
    
    triggerPairProduction() {
        if (this.animationState !== 'idle') return;
        
        this.animationState = 'creating';
        const duration = 2.0 / this.energyThreshold;
        
        // Animate photon disappearing
        gsap.to(this.photon.scale, {
            x: 0, y: 0, z: 0,
            duration: duration * 0.4,
            ease: "power2.in",
            onComplete: () => {
                // Create electron-positron pair
                this.electron.position.set(-0.5, 0, 0);
                this.positron.position.set(0.5, 0, 0);
                
                gsap.to(this.electron.scale, {
                    x: 1, y: 1, z: 1,
                    duration: duration * 0.3,
                    ease: "back.out"
                });
                
                gsap.to(this.positron.scale, {
                    x: 1, y: 1, z: 1,
                    duration: duration * 0.3,
                    ease: "back.out",
                    onComplete: () => {
                        this.animationState = 'created';
                        
                        // Move particles away from each other
                        gsap.to(this.electron.position, {
                            x: -2,
                            duration: duration * 1.0,
                            ease: "power1.out"
                        });
                        
                        gsap.to(this.positron.position, {
                            x: 2,
                            duration: duration * 1.0,
                            ease: "power1.out",
                            onComplete: () => {
                                // After some time, start annihilation
                                setTimeout(() => {
                                    this.triggerAnnihilation();
                                }, 2000);
                            }
                        });
                    }
                });
            }
        });
    }
    
    triggerAnnihilation() {
        if (this.animationState !== 'created') return;
        
        this.animationState = 'annihilating';
        const duration = 2.0 / this.energyThreshold;
        
        // Move particles toward each other
        gsap.to(this.electron.position, {
            x: -0.5,
            duration: duration * 1.0,
            ease: "power1.in"
        });
        
        gsap.to(this.positron.position, {
            x: 0.5,
            duration: duration * 1.0,
            ease: "power1.in",
            onComplete: () => {
                // Annihilate particles
                gsap.to(this.electron.scale, {
                    x: 0, y: 0, z: 0,
                    duration: duration * 0.3,
                    ease: "power2.in"
                });
                
                gsap.to(this.positron.scale, {
                    x: 0, y: 0, z: 0,
                    duration: duration * 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        // Recreate photon
                        this.photon.scale.set(0, 0, 0);
                        gsap.to(this.photon.scale, {
                            x: 1, y: 1, z: 1,
                            duration: duration * 0.4,
                            ease: "back.out",
                            onComplete: () => {
                                this.animationState = 'idle';
                            }
                        });
                    }
                });
            }
        });
    }
    
    update() {
        if (!this.active) return;
        
        const time = this.clock.getElapsedTime();
        
        // Animate photon
        if (this.animationState === 'idle') {
            // Gentle pulsation
            const scale = 0.9 + 0.2 * Math.sin(time * 3);
            this.photon.scale.set(scale, scale, scale);
            
            // Color shift
            const intensity = 0.5 + 0.5 * Math.sin(time * 2);
            this.photon.children[0].material.color.setHSL(0.15, 1, intensity);
        }
        
        // Rotate the container slightly
        this.container.rotation.z += 0.001;
    }
    
    onControlChange(controlId, value) {
        if (controlId === 'energy-threshold') {
            this.energyThreshold = value;
        } else if (controlId === 'trigger-pair') {
            this.triggerPairProduction();
        }
    }
}

// Verse 4: Stern-Gerlach Scene
class SternGerlachScene extends BaseScene {
    init() {
        // Setup container
        this.container = new THREE.Group();
        this.scene.add(this.container);
        
        // Create apparatus components
        this.createApparatus();
        
        // Atom source (initially not visible)
        this.atoms = [];
        
        // Animation state
        this.animationState = 'idle'; // idle, preparing, running, error
    }
    
    createApparatus() {
        // Create source
        const sourceGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const sourceMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.source.position.set(-3, 0, 0);
        this.container.add(this.source);
        
        // Create magnet
        const magnetGeometry = new THREE.BoxGeometry(1.5, 1, 0.5);
        const magnetMaterial = new THREE.MeshPhongMaterial({ color: 0x8888ff });
        this.magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
        this.magnet.position.set(0, 0, 0);
        this.container.add(this.magnet);
        
        // Create detector
        const detectorGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
        const detectorMaterial = new THREE.MeshPhongMaterial({ color: 0x88cc88 });
        this.detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
        this.detector.position.set(3, 0, 0);
        this.container.add(this.detector);
        
        // Create field lines in magnet
        this.fieldLines = new THREE.Group();
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.3
        });
        
        for (let i = -4; i <= 4; i++) {
            const y = i * 0.1;
            const strength = 1 - Math.abs(y) * 2;
            
            if (strength <= 0) continue;
            
            const points = [];
            for (let j = -5; j <= 5; j++) {
                const x = j * 0.15;
                const fieldY = y + x * x * (y > 0 ? -0.2 : 0.2);
                points.push(new THREE.Vector3(x, fieldY, 0));
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            this.fieldLines.add(line);
        }
        
        this.magnet.add(this.fieldLines);
        
        // Add labels
        this.createLabel("Source", this.source.position, -0.8);
        this.createLabel("Magnetic Field", this.magnet.position, -1.2);
        this.createLabel("Detector", this.detector.position, -0.8);
    }
    
    createLabel(text, position, yOffset) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        
        const geometry = new THREE.PlaneGeometry(1, 0.25);
        const label = new THREE.Mesh(geometry, material);
        
        label.position.set(position.x, position.y + yOffset, position.z);
        this.container.add(label);
    }
    
    runProperSequence() {
        if (this.animationState !== 'idle') return;
        
        this.animationState = 'preparing';
        this.clearAtoms();
        
        // Animate source preparation
        this.source.material.color.set(0x88ffff);
        gsap.to(this.source.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            duration: 1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                // Reset source appearance
                this.source.material.color.set(0xcccccc);
                
                // Start emitting atoms
                this.animationState = 'running';
                this.emitAtom();
            }
        });
    }
    
    runReverseSequence() {
        if (this.animationState !== 'idle') return;
        
        this.animationState = 'error';
        this.clearAtoms();
        
        // Show error at detector (it's trying to detect before preparation)
        this.detector.material.color.set(0xff0000);
        gsap.to(this.detector.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            duration: 0.5,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                // Reset detector appearance
                this.detector.material.color.set(0x88cc88);
                this.detector.scale.set(1, 1, 1);
                
                // Show error text
                this.showErrorMessage();
                
                // Reset after delay
                setTimeout(() => {
                    this.animationState = 'idle';
                }, 3000);
            }
        });
    }
    
    showErrorMessage() {
        // Create error message as a sprite
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(255, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 32px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('ERROR: Detection cannot precede preparation!', canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const message = new THREE.Sprite(material);
        message.scale.set(4, 1, 1);
        message.position.set(0, 2, 0);
        this.container.add(message);
        
        // Remove after delay
        setTimeout(() => {
            this.container.remove(message);
        }, 3000);
    }
    
    emitAtom() {
        if (this.animationState !== 'running') return;
        
        // Create atom
        const atom = this.createParticle(0xff8800, 0.15);
        atom.position.copy(this.source.position);
        atom.userData = {
            velocity: new THREE.Vector3(0.05, 0, 0),
            spin: Math.random() > 0.5 ? 1 : -1,
            deflected: false
        };
        
        this.container.add(atom);
        this.atoms.push(atom);
        
        // Schedule next atom emission
        setTimeout(() => {
            if (this.animationState === 'running') {
                this.emitAtom();
            }
        }, 500);
    }
    
    clearAtoms() {
        // Remove all atoms
        for (const atom of this.atoms) {
            this.container.remove(atom);
        }
        this.atoms = [];
    }
    
    update() {
        if (!this.active) return;
        
        const time = this.clock.getElapsedTime();
        
        // Update atoms
        for (let i = this.atoms.length - 1; i >= 0; i--) {
            const atom = this.atoms[i];
            
            // Update position
            atom.position.add(atom.userData.velocity);
            
            // Check if in magnetic field
            if (Math.abs(atom.position.x) < 0.75 && !atom.userData.deflected) {
                // Apply deflection based on spin
                atom.userData.velocity.y += 0.001 * atom.userData.spin;
                atom.userData.deflected = true;
                
                // Color change to indicate interaction
                atom.material.color.set(atom.userData.spin > 0 ? 0x00ffff : 0xff00ff);
            }
            
            // Check if reached detector
            if (atom.position.x > 3) {
                // Flash detector
                this.detector.material.color.set(0x00ff00);
                setTimeout(() => {
                    this.detector.material.color.set(0x88cc88);
                }, 100);
                
                // Remove atom
                this.container.remove(atom);
                this.atoms.splice(i, 1);
            }
            
            // Remove if out of bounds
            if (atom.position.x > 5 || Math.abs(atom.position.y) > 3) {
                this.container.remove(atom);
                this.atoms.splice(i, 1);
            }
        }
        
        // Subtle container rotation
        this.container.rotation.z = Math.sin(time * 0.2) * 0.03;
    }
    
    onControlChange(controlId) {
        if (controlId === 'proper-sequence') {
            this.runProperSequence();
        } else if (controlId === 'reverse-sequence') {
            this.runReverseSequence();
        }
    }
}

// Verse 5: Atomic Transitions Scene
class AtomicTransitionsScene extends BaseScene {
    init() {
        // Create atom model
        this.atom = new THREE.Group();
        this.scene.add(this.atom);
        
        // Create nucleus
        this.nucleus = this.createParticle(0xff6600, 0.3);
        this.atom.add(this.nucleus);
        
        // Create electron energy levels (orbits)
        this.energyLevels = [];
        this.createEnergyLevels();
        
        // Create electron
        this.electron = this.createParticle(0x00aaff, 0.15);
        this.currentLevel = 1; // Ground state
        this.moveElectronToLevel(this.currentLevel);
        this.atom.add(this.electron);
        
        // Create photon (initially not visible)
        this.photon = this.createPhoton();
        this.photon.visible = false;
        this.scene.add(this.photon);
        
        // Animation state
        this.animationState = 'idle'; // idle, absorbing, emitting, error
    }
    
    createEnergyLevels() {
        const levels = 3;
        
        for (let i = 0; i < levels; i++) {
            const radius = 0.8 + i * 0.6;
            
            // Create orbit line
            const segments = 64;
            const orbitPoints = [];
            
            for (let j = 0; j <= segments; j++) {
                const theta = (j / segments) * Math.PI * 2;
                orbitPoints.push(new THREE.Vector3(
                    radius * Math.cos(theta),
                    radius * Math.sin(theta),
                    0
                ));
            }
            
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0x444466,
                transparent: true,
                opacity: 0.5
            });
            
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            this.atom.add(orbit);
            
            // Add to energy levels array
            this.energyLevels.push({
                radius: radius,
                orbit: orbit
            });
            
            // Add energy level label
            this.createEnergyLabel(i, radius);
        }
    }
    
    createEnergyLabel(level, radius) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 32;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 16px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`n=${level+1}`, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        
        const geometry = new THREE.PlaneGeometry(0.3, 0.15);
        const label = new THREE.Mesh(geometry, material);
        
        label.position.set(radius + 0.2, 0, 0);
        this.atom.add(label);
    }
    
    createPhoton() {
        const group = new THREE.Group();
        
        // Create wavy line for photon
        const points = [];
        const segments = 20;
        const length = 0.8;
        
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * length;
            const y = Math.sin(i * Math.PI * 2 / 5) * 0.1;
            points.push(new THREE.Vector3(x, y, 0));
        }
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffdd00
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
        
        // Add arrows to indicate direction
        const arrowSize = 0.05;
        const arrowGeometry = new THREE.ConeGeometry(arrowSize, arrowSize * 2, 8);
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
        
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.set(length, 0, 0);
        arrow.rotation.z = -Math.PI / 2;
        group.add(arrow);
        
        return group;
    }
    
    moveElectronToLevel(level) {
        if (level < 0 || level >= this.energyLevels.length) return;
        
        this.currentLevel = level;
        const radius = this.energyLevels[level].radius;
        
        // Highlight current level
        this.energyLevels.forEach((energyLevel, i) => {
            energyLevel.orbit.material.color.set(i === level ? 0x88aaff : 0x444466);
            energyLevel.orbit.material.opacity = i === level ? 0.8 : 0.5;
        });
    }
    
    showAbsorption() {
        if (this.animationState !== 'idle') return;
        
        this.animationState = 'absorbing';
        
        // Reset electron to ground state
        this.moveElectronToLevel(0);
        this.electron.userData = { angle: 0, speed: 0.02 };
        
        // Position and show photon
        this.photon.position.set(-3, 0, 0);
        this.photon.rotation.z = 0;
        this.photon.visible = true;
        
        // Animate photon moving toward atom
        gsap.to(this.photon.position, {
            x: -this.energyLevels[0].radius,
            duration: 1.5,
            ease: "power1.inOut",
            onComplete: () => {
                // Hide photon (absorbed)
                this.photon.visible = false;
                
                // Excite electron to higher level
                gsap.to(this.electron.position, {
                    x: this.energyLevels[2].radius,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        this.moveElectronToLevel(2);
                        this.electron.userData = { angle: 0, speed: 0.01 };
                        this.animationState = 'idle';
                    }
                });
            }
        });
    }
    
    showEmission() {
        if (this.animationState !== 'idle') return;
        if (this.currentLevel === 0) return; // Already in ground state
        
        this.animationState = 'emitting';
        
        // Prepare electron in excited state if not already
        if (this.currentLevel !== 2) {
            this.moveElectronToLevel(2);
            this.electron.userData = { angle: 0, speed: 0.01 };
        }
        
        // After a short delay, emit photon
        setTimeout(() => {
            // Position photon at electron
            this.photon.position.copy(this.electron.position);
            this.photon.visible = true;
            
            // Move electron to ground state
            gsap.to(this.electron.position, {
                x: this.energyLevels[0].radius,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    this.moveElectronToLevel(0);
                    this.electron.userData = { angle: 0, speed: 0.02 };
                }
            });
            
            // Move photon away from atom
            gsap.to(this.photon.position, {
                x: 3,
                duration: 1.5,
                ease: "power1.in",
                onComplete: () => {
                    this.photon.visible = false;
                    this.animationState = 'idle';
                }
            });
        }, 500);
    }
    
    trySimultaneous() {
        if (this.animationState !== 'idle') return;
        
        this.animationState = 'error';
        
        // Show error effect
        this.atom.scale.set(1.2, 1.2, 1.2);
        gsap.to(this.atom.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.3,
            ease: "elastic.out",
            onComplete: () => {
                // Show error message
                this.showErrorMessage();
                
                // Reset after delay
                setTimeout(() => {
                    this.animationState = 'idle';
                }, 3000);
            }
        });
    }
    
    showErrorMessage() {
        // Create error message
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(255, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('ERROR: Absorption and emission', canvas.width / 2, canvas.height / 2 - 15);
        context.fillText('cannot occur simultaneously!', canvas.width / 2, canvas.height / 2 + 15);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const message = new THREE.Sprite(material);
        message.scale.set(3, 0.75, 1);
        message.position.set(0, 2, 0);
        this.scene.add(message);
        
        // Remove after delay
        setTimeout(() => {
            this.scene.remove(message);
        }, 3000);
    }
    
    update() {
        if (!this.active) return;
        
        const time = this.clock.getElapsedTime();
        
        // Update electron position in orbit
        if (this.electron.userData && this.electron.userData.angle !== undefined) {
            const angle = this.electron.userData.angle;
            const radius = this.energyLevels[this.currentLevel].radius;
            
            this.electron.position.x = radius * Math.cos(angle);
            this.electron.position.y = radius * Math.sin(angle);
            
            // Update angle for next frame
            this.electron.userData.angle += this.electron.userData.speed;
        }
        
        // If photon is visible, slightly oscillate it
        if (this.photon.visible) {
            this.photon.rotation.z = Math.sin(time * 5) * 0.1;
        }
        
        // Gentle atom rotation
        this.atom.rotation.z = Math.sin(time * 0.2) * 0.05;
    }
    
    onControlChange(controlId) {
        if (controlId === 'absorption') {
            this.showAbsorption();
        } else if (controlId === 'emission') {
            this.showEmission();
        } else if (controlId === 'try-simultaneous') {
            this.trySimultaneous();
        }
    }
}

// Verse 6: Contextuality Scene
class ContextualityScene extends BaseScene {
    init() {
        // Create qubit representation
        this.qubit = new THREE.Group();
        this.scene.add(this.qubit);
        
        // Create Bloch sphere
        this.createBlochSphere();
        
        // Create state vector
        this.stateVector = this.createStateVector();
        this.qubit.add(this.stateVector);
        
        // Create measurement axes
        this.axes = {
            x: this.createAxis(0xff0000, new THREE.Vector3(1, 0, 0)),
            y: this.createAxis(0x00ff00, new THREE.Vector3(0, 1, 0)),
            z: this.createAxis(0x0000ff, new THREE.Vector3(0, 0, 1))
        };
        
        // Current axis selection
        this.selectedAxis = 'Z-Axis';
        this.updateAxisVisibility();
        
        // Measurement result indicator (initially hidden)
        this.measurementResult = this.createMeasurementResult();
        this.measurementResult.visible = false;
        this.scene.add(this.measurementResult);
    }
    
    createBlochSphere() {
        // Create wireframe sphere
        const sphereGeometry = new THREE.SphereGeometry(1, 16, 12);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.qubit.add(this.sphere);
        
        // Create equator
        const equatorGeometry = new THREE.CircleGeometry(1, 32);
        const points = [];
        for (let i = 1; i < equatorGeometry.attributes.position.count; i++) {
            points.push(new THREE.Vector3().fromBufferAttribute(equatorGeometry.attributes.position, i));
        }
        const equatorMaterial = new THREE.LineBasicMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.5
        });
        
        const equator = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), equatorMaterial);
        equator.rotation.x = Math.PI / 2;
        this.qubit.add(equator);
    }
    
    createStateVector() {
        // Create arrow for state vector
        const arrowGroup = new THREE.Group();
        
        // Arrow line
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 1)
        ]);
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffff00,
            linewidth: 3
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        arrowGroup.add(line);
        
        // Arrow head
        const headGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
        const headMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });
        
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 0, 1);
        head.rotation.x = Math.PI / 2;
        arrowGroup.add(head);
        
        return arrowGroup;
    }
    
    createAxis(color, direction) {
        const axisGroup = new THREE.Group();
        
        // Create axis line
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            direction.clone().multiplyScalar(-1.2),
            direction.clone().multiplyScalar(1.2)
        ]);
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 2
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        axisGroup.add(line);
        
        // Create axis labels
        const labelPositive = this.createAxisLabel('+', color);
        labelPositive.position.copy(direction.clone().multiplyScalar(1.3));
        axisGroup.add(labelPositive);
        
        const labelNegative = this.createAxisLabel('-', color);
        labelNegative.position.copy(direction.clone().multiplyScalar(-1.3));
        axisGroup.add(labelNegative);
        
        // Initially hidden
        axisGroup.visible = false;
        this.qubit.add(axisGroup);
        
        return axisGroup;
    }
    
    createAxisLabel(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;
        
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 48px Arial';
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const label = new THREE.Sprite(material);
        label.scale.set(0.3, 0.3, 0.3);
        
        return label;
    }
    
    createMeasurementResult() {
        const group = new THREE.Group();
        
        // Create result panel
        const panelGeometry = new THREE.PlaneGeometry(2, 0.6);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            transparent: true,
            opacity: 0.8
        });
        
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        group.add(panel);
        
        // Create text texture (will be updated)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 48px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Measured: +1', canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        
        const text = new THREE.Mesh(panelGeometry, textMaterial);
        text.position.z = 0.01; // Slightly in front of panel
        group.add(text);
        
        // Store context and texture for updates
        group.userData = {
            canvas: canvas,
            context: context,
            texture: texture,
            textMesh: text
        };
        
        // Position above the sphere
        group.position.set(0, 2, 0);
        
        return group;
    }
    
    updateAxisVisibility() {
        // Hide all axes
        this.axes.x.visible = false;
        this.axes.y.visible = false;
        this.axes.z.visible = false;
        
        // Show selected axis
        if (this.selectedAxis === 'X-Axis') {
            this.axes.x.visible = true;
        } else if (this.selectedAxis === 'Y-Axis') {
            this.axes.y.visible = true;
        } else { // Z-Axis is default
            this.axes.z.visible = true;
        }
    }
    
    measureProperty() {
        // Get current axis
        let axis, color;
        if (this.selectedAxis === 'X-Axis') {
            axis = new THREE.Vector3(1, 0, 0);
            color = 0xff0000;
        } else if (this.selectedAxis === 'Y-Axis') {
            axis = new THREE.Vector3(0, 1, 0);
            color = 0x00ff00;
        } else {
            axis = new THREE.Vector3(0, 0, 1);
            color = 0x0000ff;
        }
        
        // Get current state vector direction
        const stateDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(this.stateVector.quaternion);
        
        // Compute projection onto axis
        const projection = stateDirection.dot(axis);
        
        // Determine measurement result
        const result = Math.abs(projection) < 0.3 ? 0 : (projection > 0 ? 1 : -1);
        const resultText = `Measured: ${result > 0 ? '+' : ''}${result}`;
        
        // Update state vector to align with measurement outcome
        if (result !== 0) {
            const targetDirection = axis.clone().multiplyScalar(result);
            
            // Animate rotation to measured state
            this.animateStateVectorRotation(targetDirection);
        }
        
        // Show measurement result
        this.showMeasurementResult(resultText, color);
    }
    
    animateStateVectorRotation(targetDirection) {
        // Get current direction
        const currentDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(this.stateVector.quaternion);
        
        // Calculate rotation from current to target
        const rotationAxis = new THREE.Vector3().crossVectors(currentDirection, targetDirection).normalize();
        const angle = Math.acos(currentDirection.dot(targetDirection));
        
        if (isNaN(angle) || rotationAxis.length() === 0) return;
        
        const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
        
        // Animate rotation
        gsap.to(this.stateVector.quaternion, {
            x: quaternion.x,
            y: quaternion.y,
            z: quaternion.z,
            w: quaternion.w,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
                this.stateVector.quaternion.normalize();
            }
        });
    }
    
    showMeasurementResult(text, color) {
        // Get objects from userData
        const { canvas, context, texture, textMesh } = this.measurementResult.userData;
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw result text
        context.font = 'bold 48px Arial';
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Update texture
        texture.needsUpdate = true;
        
        // Show result
        this.measurementResult.visible = true;
        this.measurementResult.scale.set(0, 0, 0);
        
        // Animate appearance
        gsap.to(this.measurementResult.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.3,
            ease: "back.out"
        });
        
        // Hide after delay
        setTimeout(() => {
            gsap.to(this.measurementResult.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    this.measurementResult.visible = false;
                }
            });
        }, 3000);
    }
    
    update() {
        if (!this.active) return;
        
        const time = this.clock.getElapsedTime();
        
        // Gentle rotation of the entire qubit system
        this.qubit.rotation.y = Math.sin(time * 0.3) * 0.2;
        
        // Subtle pulsation of the state vector
        const pulse = 0.95 + 0.05 * Math.sin(time * 2);
        this.stateVector.scale.set(pulse, pulse, pulse);
    }
    
    onControlChange(controlId, value) {
        if (controlId === 'measurement-axis') {
            this.selectedAxis = value;
            this.updateAxisVisibility();
        } else if (controlId === 'measure-property') {
            this.measureProperty();
        }
    }
}

// Verse 7: Entanglement Scene
class EntanglementScene extends BaseScene {
    init() {
        // Create particles container
        this.particlesContainer = new THREE.Group();
        this.scene.add(this.particlesContainer);
        
        // Create entangled particles
        this.particleA = this.createParticle(0x0088ff, 0.2);
        this.particleB = this.createParticle(0xff4400, 0.2);
        
        this.particleA.position.set(-2, 0, 0);
        this.particleB.position.set(2, 0, 0);
        
        this.particlesContainer.add(this.particleA);
        this.particlesContainer.add(this.particleB);
        
        // Create entanglement visualization
        this.entanglementConnection = this.createEntanglementConnection();
        this.particlesContainer.add(this.entanglementConnection);
        
        // Create measurement indicators
        this.particleAMeasurement = this.createMeasurementIndicator(0x0088ff);
        this.particleBMeasurement = this.createMeasurementIndicator(0xff4400);
        
        this.particleAMeasurement.position.set(-2, 1.2, 0);
        this.particleBMeasurement.position.set(2, 1.2, 0);
        
        this.particleAMeasurement.visible = false;
        this.particleBMeasurement.visible = false;
        
        this.scene.add(this.particleAMeasurement);
        this.scene.add(this.particleBMeasurement);
        
        // Track state
        this.entanglementState = {
            entangled: true,
            particleAMeasured: false,
            particleBMeasured: false,
            particleAState: null,
            particleBState: null
        };
        
        // Add labels
        this.createParticleLabel("Particle 1", this.particleA.position, -1);
        this.createParticleLabel("Particle 2", this.particleB.position, -1);
    }
    
    createParticleLabel(text, position, yOffset) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        
        const geometry = new THREE.PlaneGeometry(1, 0.25);
        const label = new THREE.Mesh(geometry, material);
        
        label.position.set(position.x, position.y + yOffset, position.z);
        this.scene.add(label);
    }
    
    createEntanglementConnection() {
        // Create connection line
        const points = [];
        const segments = 20;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = (1 - t) * -2 + t * 2;
            const y = Math.sin(t * Math.PI) * 0.3;
            points.push(new THREE.Vector3(x, y, 0));
        }
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xaaaaff,
            transparent: true,
            opacity: 0.8,
            linewidth: 2
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        
        // Add some decoration (small spheres along the line)
        const decorationGroup = new THREE.Group();
        
        for (let i = 1; i < segments; i += 3) {
            const t = i / segments;
            const x = (1 - t) * -2 + t * 2;
            const y = Math.sin(t * Math.PI) * 0.3;
            
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0xaaaaff,
                    transparent: true,
                    opacity: 0.8
                })
            );
            
            sphere.position.set(x, y, 0);
            decorationGroup.add(sphere);
        }
        
        const group = new THREE.Group();
        group.add(line);
        group.add(decorationGroup);
        
        return group;
    }
    
    createMeasurementIndicator(color) {
        const group = new THREE.Group();
        
        // Create background panel
        const panelGeometry = new THREE.PlaneGeometry(1, 0.4);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            transparent: true,
            opacity: 0.8
        });
        
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        group.add(panel);
        
        // Create text texture (will be updated)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 32px Arial';
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Spin: ↑', canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        
        const text = new THREE.Mesh(panelGeometry, textMaterial);
        text.position.z = 0.01; // Slightly in front of panel
        group.add(text);
        
        // Store context and texture for updates
        group.userData = {
            canvas: canvas,
            context: context,
            texture: texture,
            textMesh: text
        };
        
        return group;
    }
    
    updateMeasurementDisplay(indicator, spin) {
        // Get objects from userData
        const { canvas, context, texture } = indicator.userData;
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw result text
        context.font = 'bold 32px Arial';
        context.fillStyle = indicator === this.particleAMeasurement ? '#0088ff' : '#ff4400';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`Spin: ${spin ? '↑' : '↓'}`, canvas.width / 2, canvas.height / 2);
        
        // Update texture
        texture.needsUpdate = true;
    }
    
    measureParticle(particleNum) {
        if (!this.entanglementState.entangled) {
            this.resetEntanglement();
            return;
        }
        
        if (particleNum === 1) {
            // Measure particle A
            if (this.entanglementState.particleAMeasured) return;
            
            // Determine random state if not already measured
            if (this.entanglementState.particleBMeasured) {
                // Particle B already measured, so A must be opposite
                this.entanglementState.particleAState = !this.entanglementState.particleBState;
            } else {
                // Neither particle measured yet, choose randomly
                this.entanglementState.particleAState = Math.random() >= 0.5;
            }
            
            // Mark as measured
            this.entanglementState.particleAMeasured = true;
            
            // Update display
            this.updateMeasurementDisplay(this.particleAMeasurement, this.entanglementState.particleAState);
            this.particleAMeasurement.visible = true;
            this.particleAMeasurement.scale.set(0, 0, 0);
            
            // Animate appearance
            gsap.to(this.particleAMeasurement.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.3,
                ease: "back.out"
            });
            
            // Update particle appearance
            this.updateParticleAppearance(this.particleA, this.entanglementState.particleAState);
            
            // If B is not measured, its state is now determined (entanglement)
            if (!this.entanglementState.particleBMeasured) {
                this.entanglementState.particleBState = !this.entanglementState.particleAState;
            }
        } else {
            // Measure particle B
            if (this.entanglementState.particleBMeasured) return;
            
            // Determine random state if not already measured
            if (this.entanglementState.particleAMeasured) {
                // Particle A already measured, so B must be opposite
                this.entanglementState.particleBState = !this.entanglementState.particleAState;
            } else {
                // Neither particle measured yet, choose randomly
                this.entanglementState.particleBState = Math.random() >= 0.5;
            }
            
            // Mark as measured
            this.entanglementState.particleBMeasured = true;
            
            // Update display
            this.updateMeasurementDisplay(this.particleBMeasurement, this.entanglementState.particleBState);
            this.particleBMeasurement.visible = true;
            this.particleBMeasurement.scale.set(0, 0, 0);
            
            // Animate appearance
            gsap.to(this.particleBMeasurement.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.3,
                ease: "back.out"
            });
            
            // Update particle appearance
            this.updateParticleAppearance(this.particleB, this.entanglementState.particleBState);
            
            // If A is not measured, its state is now determined (entanglement)
            if (!this.entanglementState.particleAMeasured) {
                this.entanglementState.particleAState = !this.entanglementState.particleBState;
            }
        }
        
        // If both particles measured, break entanglement
        if (this.entanglementState.particleAMeasured && this.entanglementState.particleBMeasured) {
            this.entanglementState.entangled = false;
            
            // Hide entanglement connection
            gsap.to(this.entanglementConnection.children[0].material, {
                opacity: 0,
                duration: 0.5
            });
            
            gsap.to(this.entanglementConnection.children[1].children, {
                opacity: 0,
                duration: 0.5,
                stagger: 0.1
            });
        }
    }
    
    updateParticleAppearance(particle, spinUp) {
        // Change color based on spin
        const targetColor = spinUp ? 0x00ffff : 0xff00ff;
        
        gsap.to(particle.material.color, {
            r: (targetColor >> 16 & 255) / 255,
            g: (targetColor >> 8 & 255) / 255,
            b: (targetColor & 255) / 255,
            duration: 0.5
        });
        
        // Add visual rotation effect
        gsap.to(particle.rotation, {
            z: spinUp ? Math.PI * 2 : -Math.PI * 2,
            duration: 1,
            ease: "power2.inOut"
        });
    }
    
    resetEntanglement() {
        // Reset state
        this.entanglementState = {
            entangled: true,
            particleAMeasured: false,
            particleBMeasured: false,
            particleAState: null,
            particleBState: null
        };
        
        // Hide measurement indicators
        gsap.to(this.particleAMeasurement.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                this.particleAMeasurement.visible = false;
            }
        });
        
        gsap.to(this.particleBMeasurement.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                this.particleBMeasurement.visible = false;
            }
        });
        
        // Reset particle appearances
        gsap.to(this.particleA.material.color, {
            r: 0x00 / 255,
            g: 0x88 / 255,
            b: 0xff / 255,
            duration: 0.5
        });
        
        gsap.to(this.particleB.material.color, {
            r: 0xff / 255,
            g: 0x44 / 255,
            b: 0x00 / 255,
            duration: 0.5
        });
        
        // Reset rotations
        gsap.to(this.particleA.rotation, {
            x: 0, y: 0, z: 0,
            duration: 0.5
        });
        
        gsap.to(this.particleB.rotation, {
            x: 0, y: 0, z: 0,
            duration: 0.5
        });
        
        // Show entanglement connection
        gsap.to(this.entanglementConnection.children[0].material, {
            opacity: 0.8,
            duration: 0.5
        });
        
        this.entanglementConnection.children[1].children.forEach(sphere => {
            gsap.to(sphere.material, {
                opacity: 0.8,
                duration: 0.5
            });
        });
    }
    
    update() {
        if (!this.active) return;
        
        const time = this.clock.getElapsedTime();
        
        // Animate entanglement connection if entangled
        if (this.entanglementState.entangled) {
            this.entanglementConnection.children[1].children.forEach((sphere, i) => {
                const t = (time * 0.5 + i * 0.2) % 1;
                const x = (1 - t) * -2 + t * 2;
                const y = Math.sin(t * Math.PI) * 0.3;
                sphere.position.set(x, y, 0);
            });
        }
        
        // Gentle rotation of particles
        if (!this.entanglementState.particleAMeasured) {
            this.particleA.rotation.y = Math.sin(time) * 0.5;
        }
        
        if (!this.entanglementState.particleBMeasured) {
            this.particleB.rotation.y = Math.sin(time + Math.PI) * 0.5;
        }
        
        // Subtle container movement
        this.particlesContainer.position.y = Math.sin(time * 0.5) * 0.1;
    }
    
    onControlChange(controlId) {
        if (controlId === 'measure-particle1') {
            this.measureParticle(1);
        } else if (controlId === 'measure-particle2') {
            this.measureParticle(2);
        } else if (controlId === 'reset-entanglement') {
            this.resetEntanglement();
        }
    }
}

// Verse 8: Observer Effect Scene
class ObserverEffectScene extends BaseScene {
    init() {
        // Create main container
        this.container = new THREE.Group();
        this.scene.add(this.container);
        
        // Create quantum particle in superposition
        this.particle = this.createSuperpositionParticle();
        this.container.add(this.particle);
        
        // Create observer representation
        this.observer = this.createObserver();
        this.observer.position.set(3, 0, 0);
        this.container.add(this.observer);
        
        // Create observation beam (initially hidden)
        this.observationBeam = this.createObservationBeam();
        this.observationBeam.visible = false;
        this.container.add(this.observationBeam);
        
        // Particle state
        this.particleState = {
            observed: false,
            collapsedState: null
        };
    }
    
    createSuperpositionParticle() {
        // Create a cloud-like effect to represent superposition
        const group = new THREE.Group();
        
        // Center particle
        const centerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaddff,
            transparent: true,
            opacity: 0.7,
            emissive: 0xaaddff,
            emissiveIntensity: 0.3
        });
        
        const centerParticle = new THREE.Mesh(centerGeometry, centerMaterial);
        group.add(centerParticle);
        
        // Create cloud of smaller particles
        this.cloudParticles = [];
        const cloudCount = 30;
        
        for (let i = 0; i < cloudCount; i++) {
            const radius = 0.05 + Math.random() * 0.05;
            const distance = 0.3 + Math.random() * 0.7;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);
            
            const cloudGeometry = new THREE.SphereGeometry(radius, 8, 8);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                color: 0xaaddff,
                transparent: true,
                opacity: 0.3 + Math.random() * 0.3,
                emissive: 0xaaddff,
                emissiveIntensity: 0.2
            });
            
            const cloudParticle = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloudParticle.position.set(x, y, z);
            
            // Add properties for animation
            cloudParticle.userData = {
                originDistance: distance,
                originPhi: phi,
                originTheta: theta,
                speed: 0.5 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2
            };
            
            group.add(cloudParticle);
            this.cloudParticles.push(cloudParticle);
        }
        
        return group;
    }
    
    createObserver() {
        const group = new THREE.Group();
        
        // Create brain-like structure
        const brainGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const brainMaterial = new THREE.MeshPhongMaterial({
            color: 0xffbb99,
            emissive: 0x553322,
            emissiveIntensity: 0.2,
            shininess: 10
        });
        
        const brain = new THREE.Mesh(brainGeometry, brainMaterial);
        group.add(brain);
        
        // Add wrinkle details
        const wrinkles = new THREE.Group();
        
        for (let i = 0; i < 10; i++) {
            const curve = new THREE.EllipseCurve(
                0, 0,
                0.5, 0.5,
                0, Math.PI * 2,
                false,
                Math.random() * Math.PI * 2
            );
            
            const points = curve.getPoints(50);
            const wrinkleGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const wrinkleMaterial = new THREE.LineBasicMaterial({
                color: 0x773322,
                linewidth: 2
            });
            
            const wrinkle = new THREE.Line(wrinkleGeometry, wrinkleMaterial);
            wrinkle.rotation.x = Math.random() * Math.PI;
            wrinkle.rotation.y = Math.random() * Math.PI;
            wrinkle.rotation.z = Math.random() * Math.PI;
            
            wrinkles.add(wrinkle);
        }
        
        brain.add(wrinkles);
        
        // Create eye
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xaaaaaa,
            emissiveIntensity: 0.2
        });
        
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.set(-0.25, 0.25, 0.4);
        group.add(eye);
        
        // Create pupil
        const pupilGeometry = new THREE.SphereGeometry(0.07, 8, 8);
        const pupilMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        
        const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        pupil.position.set(0, 0, 0.08);
        eye.add(pupil);
        
        // Create neural activity (small glowing spheres)
        this.neurons = [];
        
        for (let i = 0; i < 15; i++) {
            const radius = 0.04 + Math.random() * 0.04;
            const distance = 0.3;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);
            
            const neuronGeometry = new THREE.SphereGeometry(radius, 8, 8);
            const neuronMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.7
            });
            
            const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
            neuron.position.set(x, y, z);
            
            // Add properties for animation
            neuron.userData = {
                pulseSpeed: 1 + Math.random() * 3,
                phase: Math.random() * Math.PI * 2
            };
            
            brain.add(neuron);
            this.neurons.push(neuron);
        }
        
        // Add label
        const labelCanvas = document.createElement('canvas');
        const context = labelCanvas.getContext('2d');
        labelCanvas.width = 256;
        labelCanvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
        
        context.font = 'bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Observer', labelCanvas.width / 2, labelCanvas.height / 2);
        
        const texture = new THREE.CanvasTexture(labelCanvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        
        const geometry = new THREE.PlaneGeometry(1, 0.25);
        const label = new THREE.Mesh(geometry, material);
        
        label.position.set(0, -0.8, 0);
        group.add(label);
        
        return group;
    }
    
    createObservationBeam() {
        const group = new THREE.Group();
        
        // Create main beam
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.2, 3, 16);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaffff,
            transparent: true,
            opacity: 0.3
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.rotation.z = Math.PI / 2;
        beam.position.set(1.5, 0, 0);
        group.add(beam);
        
        // Add particle effects along the beam
        this.beamParticles = [];
        
        for (let i = 0; i < 20; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.04, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0xaaffff,
                transparent: true,
                opacity: 0.7
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position along the beam
            const x = Math.random() * 3;
            const y = Math.random() * 0.2 - 0.1;
            const z = Math.random() * 0.2 - 0.1;
            particle.position.set(x, y, z);
            
            // Add properties for animation
            particle.userData = {
                speed: 0.05 + Math.random() * 0.05
            };
            
            group.add(particle);
            this.beamParticles.push(particle);
        }
        
        return group;
    }
    
    observeParticle() {
        if (this.particleState.observed) {
            this.resetSuperposition();
            return;
        }
        
        // Start observation process
        this.observationBeam.visible = true;
        
        // Animate observer (neural activity during observation)
        this.neurons.forEach(neuron => {
            gsap.to(neuron.material, {
                opacity: 1,
                duration: 0.5
            });
            
            gsap.to(neuron.scale, {
                x: 1.5, y: 1.5, z: 1.5,
                duration: 0.5,
                yoyo: true,
                repeat: 3
            });
        });
        
        // After a delay, collapse the wavefunction
        setTimeout(() => {
            // Choose random collapsed state
            this.collapseWavefunction();
        }, 1500);
    }
    
    collapseWavefunction() {
        // Choose a random state (position)
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * 0.5;
        const y = Math.sin(angle) * 0.5;
        
        // Store state
        this.particleState.observed = true;
        this.particleState.collapsedState = new THREE.Vector3(x, y, 0);
        
        // Collapse cloud particles
        this.cloudParticles.forEach(particle => {
            gsap.to(particle.scale, {
                x: 0, y: 0, z: 0,
                duration: 1,
                ease: "power2.in"
            });
        });
        
        // Move center particle to collapsed position
        gsap.to(this.particle.children[0].position, {
            x: x,
            y: y,
            z: 0,
            duration: 1,
            ease: "elastic.out",
            onComplete: () => {
                // Fade out observation beam
                gsap.to(this.observationBeam.children[0].material, {
                    opacity: 0,
                    duration: 0.5
                });
                
                this.beamParticles.forEach(particle => {
                    gsap.to(particle.material, {
                        opacity: 0,
                        duration: 0.5
                    });
                });
                
                // After fading, hide beam
                setTimeout(() => {
                    this.observationBeam.visible = false;
                }, 500);
            }
        });
        
        // Change center particle appearance
        gsap.to(this.particle.children[0].material.color, {
            r: 0xff / 255,
            g: 0x88 / 255,
            b: 0x00 / 255,
            duration: 0.5
        });
        
        gsap.to(this.particle.children[0].material.emissive, {
            r: 0xaa / 255,
            g: 0x44 / 255,
            b: 0x00 / 255,
            duration: 0.5
        });
        
        gsap.to(this.particle.children[0].scale, {
            x: 1.5, y: 1.5, z: 1.5,
            duration: 0.5
        });
    }
    
    resetSuperposition() {
        // Reset particle state
        this.particleState.observed = false;
        this.particleState.collapsedState = null;
        
        // Hide observation beam if visible
        this.observationBeam.visible = false;
        
        // Reset center particle
        gsap.to(this.particle.children[0].position, {
            x: 0, y: 0, z: 0,
            duration: 1
        });
        
        gsap.to(this.particle.children[0].material.color, {
            r: 0xaa / 255,
            g: 0xdd / 255,
            b: 0xff / 255,
            duration: 0.5
        });
        
        gsap.to(this.particle.children[0].material.emissive, {
            r: 0xaa / 255,
            g: 0xdd / 255,
            b: 0xff / 255,
            duration: 0.5
        });
        
        gsap.to(this.particle.children[0].scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5
        });
        
        // Restore cloud particles
        this.cloudParticles.forEach(particle => {
            const { originDistance, originPhi, originTheta } = particle.userData;
            
            const x = originDistance * Math.sin(originTheta) * Math.cos(originPhi);
            const y = originDistance * Math.sin(originTheta) * Math.sin(originPhi);
            const z = originDistance * Math.cos(originTheta);
            
            particle.position.set(x, y, z);
            
            gsap.to(particle.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5
            });
        });
        
        // Reset neurons
        this.neurons.forEach(neuron => {
            gsap.to(neuron.material, {
                opacity: 0.7,
                duration: 0.5
            });
            
            gsap.to(neuron.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5
            });
        });
    }
    
    update() {
        if (!this.active) return;
        
        const time = this.clock.getElapsedTime();
        
        // Animate cloud particles if in superposition
        if (!this.particleState.observed) {
            this.cloudParticles.forEach(particle => {
                const { originDistance, originPhi, originTheta, speed, phase } = particle.userData;
                
                // Orbit around center with fluctuation
                const fluctuation = Math.sin(time * speed + phase) * 0.1;
                const distance = originDistance + fluctuation;
                
                const x = distance * Math.sin(originTheta) * Math.cos(originPhi + time * speed * 0.2);
                const y = distance * Math.sin(originTheta) * Math.sin(originPhi + time * speed * 0.2);
                const z = distance * Math.cos(originTheta);
                
                particle.position.set(x, y, z);
                
                // Pulse opacity
                particle.material.opacity = 0.3 + 0.3 * Math.sin(time * speed + phase);
            });
            
            // Gentle pulsation of center particle
            const pulse = 0.9 + 0.2 * Math.sin(time * 2);
            this.particle.children[0].scale.set(pulse, pulse, pulse);
        }
        
        // Animate beam particles if visible
        if (this.observationBeam.visible) {
            this.beamParticles.forEach(particle => {
                // Move toward the quantum particle
                particle.position.x -= particle.userData.speed;
                
                // Reset position if reached the end
                if (particle.position.x < 0) {
                    particle.position.x = 3;
                    particle.position.y = Math.random() * 0.2 - 0.1;
                    particle.position.z = Math.random() * 0.2 - 0.1;
                }
            });
        }
        
        // Animate neurons
        this.neurons.forEach(neuron => {
            const { pulseSpeed, phase } = neuron.userData;
            const pulse = 0.5 + 0.5 * Math.sin(time * pulseSpeed + phase);
            neuron.material.opacity = 0.5 + 0.3 * pulse;
        });
        
        // Gentle movement
        this.container.rotation.y = Math.sin(time * 0.3) * 0.1;
    }
    
    onControlChange(controlId) {
        if (controlId === 'observe-particle') {
            this.observeParticle();
        } else if (controlId === 'reset-superposition') {
            this.resetSuperposition();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new Application();
});