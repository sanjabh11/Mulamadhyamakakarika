import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'; // Added FontLoader import
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'; // Added TextGeometry import
import { animationSettings, colorSchemes, globalSettings } from './config.js';
import { gsap } from 'gsap';

// Base animation class with common functionality
class BaseAnimation {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = globalSettings.cameraDistance;
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true // Enable screenshot capability
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace; // Updated property
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 20;
        this.controls.minDistance = 2;
        
        this.clock = new THREE.Clock();
        this.objects = [];
        this.particles = [];
        
        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Add subtle hemisphere light for better color grading
        const hemisphereLight = new THREE.HemisphereLight(0xbbdefb, 0x3b82f6, 0.3);
        this.scene.add(hemisphereLight);
        
        // Background
        this.setupBackground();
    }
    
    setupBackground() {
        // Create a starfield background
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * 100;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 100;
            starPositions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            // Mix of blue/purple hues for stars
            const colorChoice = Math.random();
            if (colorChoice < 0.3) {
                starColors[i3] = 0.8 + Math.random() * 0.2; // R
                starColors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
                starColors[i3 + 2] = 1.0; // B
            } else if (colorChoice < 0.6) {
                starColors[i3] = 0.5 + Math.random() * 0.3; // R
                starColors[i3 + 1] = 0.3 + Math.random() * 0.3; // G
                starColors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
            } else {
                starColors[i3] = 0.7 + Math.random() * 0.3; // R
                starColors[i3 + 1] = 0.7 + Math.random() * 0.3; // G
                starColors[i3 + 2] = 0.7 + Math.random() * 0.3; // B
            }
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
    }
    
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    update() {
        const elapsedTime = this.clock.getElapsedTime();
        
        // Rotate background slowly
        if (this.starField) {
            this.starField.rotation.y = elapsedTime * 0.02;
            this.starField.rotation.x = Math.sin(elapsedTime * 0.01) * 0.1;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        // Clean up to prevent memory leaks
        this.objects.forEach(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        });
        
        this.objects = [];
        this.particles = [];
    }
    
    createParticleSystem(count, size, color) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 5;
            positions[i + 1] = (Math.random() - 0.5) * 5;
            positions[i + 2] = (Math.random() - 0.5) * 5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            size: size || globalSettings.particleSize,
            color: color || colorSchemes.primary.particles,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.objects.push(particles);
        
        return { particles, positions };
    }
    
    generateControls() {
        // Create base container with enhanced styling
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('scroll-container');
        controlsContainer.style.maxHeight = '200px';
        controlsContainer.style.overflow = 'auto';
        
        // Add help tooltip for better user guidance
        const helpTip = document.createElement('div');
        helpTip.className = 'help-tooltip';
        helpTip.innerHTML = '<small>Interact with the controls below to modify the animation</small>';
        helpTip.style.marginBottom = '8px';
        helpTip.style.opacity = '0.7';
        helpTip.style.fontSize = '0.8rem';
        
        controlsContainer.appendChild(helpTip);
        
        // This should be overridden by each animation
        return controlsContainer;
    }
}

// Double Slit Experiment Animation
export class DoubleSlitAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.doubleSlit };
        this.observing = false;
        
        // Initialize animation components
        this.setupScene();
        this.particleSystem = this.createParticleSystem(this.settings.particleCount, 0.05, 0x8B5CF6);
        this.setupSlits();
        this.setupDetectionScreen();
    }
    
    setupScene() {
        this.camera.position.set(0, 1, 8);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Add emitter
        const emitterGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
        const emitterMaterial = new THREE.MeshPhongMaterial({ 
            color: colorSchemes.primary.highlight,
            emissive: colorSchemes.primary.highlight,
            emissiveIntensity: 0.3
        });
        this.emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);
        this.emitter.position.set(-4, 0, 0);
        this.scene.add(this.emitter);
        this.objects.push(this.emitter);
    }
    
    setupSlits() {
        // Create barrier with slits
        const barrierGeometry = new THREE.BoxGeometry(0.2, 4, 2);
        const barrierMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2a4365,
            transparent: true,
            opacity: 0.9
        });
        this.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        this.scene.add(this.barrier);
        this.objects.push(this.barrier);
        
        // Create cutouts for slits
        const slitWidth = this.settings.slitWidth;
        const slitHeight = 0.8;
        const slitGeometry = new THREE.BoxGeometry(0.3, slitHeight, slitWidth);
        const slitMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            opacity: 0,
            transparent: true,
            alphaTest: 0.1
        });
        
        this.slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
        this.slit1.position.set(0, 0.8, 0);
        this.barrier.add(this.slit1);
        
        this.slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
        this.slit2.position.set(0, -0.8, 0);
        this.barrier.add(this.slit2);
    }
    
    setupDetectionScreen() {
        // Create detection screen where interference pattern forms
        const screenGeometry = new THREE.PlaneGeometry(4, 4);
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1a202c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.set(4, 0, 0);
        this.screen.rotation.y = Math.PI / 2;
        this.scene.add(this.screen);
        this.objects.push(this.screen);
        
        // Create pattern dots
        this.patternDots = [];
        const patternGeometry = new THREE.CircleGeometry(0.02, 16);
        const patternMaterial = new THREE.MeshBasicMaterial({ 
            color: colorSchemes.primary.particles,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < 200; i++) {
            const dot = new THREE.Mesh(patternGeometry, patternMaterial.clone());
            dot.rotation.y = Math.PI / 2;
            dot.position.set(4, (Math.random() - 0.5) * 3.8, (Math.random() - 0.5) * 3.8);
            dot.visible = false;
            this.scene.add(dot);
            this.patternDots.push(dot);
            this.objects.push(dot);
        }
    }
    
    resetParticles() {
        const positions = this.particleSystem.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = this.emitter.position.x + (Math.random() - 0.5) * 0.5;
            positions[i + 1] = this.emitter.position.y + (Math.random() - 0.5) * 0.3;
            positions[i + 2] = this.emitter.position.z + (Math.random() - 0.5) * 0.3;
        }
        
        this.particleSystem.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    toggleObservation(observing) {
        this.observing = observing;
        
        // Change particle material based on observation state
        if (observing) {
            this.particleSystem.particles.material.size = 0.08;
            this.particleSystem.particles.material.color.set(0x10b981);
        } else {
            this.particleSystem.particles.material.size = 0.05;
            this.particleSystem.particles.material.color.set(0x8B5CF6);
        }
        
        // Reset detection screen pattern
        this.patternDots.forEach(dot => {
            dot.visible = false;
        });
        
        // Reset particles
        this.resetParticles();
    }
    
    update() {
        super.update();
        
        const positions = this.particleSystem.particles.geometry.attributes.position.array;
        
        // Update each particle
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // Move particles forward
            positions[i] += this.settings.particleSpeed * 0.05;
            
            // Check if particle is near the barrier
            if (x > -0.5 && x < 0.5) {
                // Determine if particle goes through slits
                const passedThroughSlit1 = Math.abs(y - 0.8) < this.settings.slitWidth / 2;
                const passedThroughSlit2 = Math.abs(y + 0.8) < this.settings.slitWidth / 2;
                
                if (this.observing) {
                    // If observing, particles act like particles - go straight through one slit
                    if (!passedThroughSlit1 && !passedThroughSlit2) {
                        // Reset particle if it hits barrier
                        positions[i] = this.emitter.position.x + (Math.random() - 0.5) * 0.5;
                        positions[i + 1] = this.emitter.position.y + (Math.random() - 0.5) * 0.3;
                        positions[i + 2] = this.emitter.position.z + (Math.random() - 0.5) * 0.3;
                    }
                } else {
                    // If not observing, particles act like waves - show interference pattern
                    if (!passedThroughSlit1 && !passedThroughSlit2) {
                        // Reset particle if it hits barrier
                        positions[i] = this.emitter.position.x + (Math.random() - 0.5) * 0.5;
                        positions[i + 1] = this.emitter.position.y + (Math.random() - 0.5) * 0.3;
                        positions[i + 2] = this.emitter.position.z + (Math.random() - 0.5) * 0.3;
                    } else {
                        // Add wave-like motion - slight randomness to y movement to simulate wave behavior
                        positions[i + 1] += Math.sin(this.clock.getElapsedTime() * 5 + i) * 0.01;
                    }
                }
            }
            
            // Check if particle reached the screen
            if (x > 3.8) {
                // Record hit position on screen and create visible dot
                if (Math.random() < 0.2) {  // Only show some hits to avoid overcrowding
                    for (const dot of this.patternDots) {
                        if (!dot.visible) {
                            if (this.observing) {
                                // Create more random pattern if observing
                                dot.position.y = (Math.random() - 0.5) * 3.8;
                            } else {
                                // Create interference pattern if not observing
                                // More complex probability distribution for wave interference
                                const yPos = Math.sin(y * 7) * Math.cos(z * 7) * 1.5;
                                dot.position.y = yPos;
                            }
                            dot.position.z = z;
                            dot.visible = true;
                            break;
                        }
                    }
                }
                
                // Reset particle
                positions[i] = this.emitter.position.x + (Math.random() - 0.5) * 0.5;
                positions[i + 1] = this.emitter.position.y + (Math.random() - 0.5) * 0.3;
                positions[i + 2] = this.emitter.position.z + (Math.random() - 0.5) * 0.3;
            }
        }
        
        // Update the particles
        this.particleSystem.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Create observation toggle
        const toggleContainer = document.createElement('div');
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.marginBottom = '10px';
        
        const toggleLabel = document.createElement('span');
        toggleLabel.textContent = 'Observe Particles: ';
        toggleContainer.appendChild(toggleLabel);
        
        const toggleSwitch = document.createElement('label');
        toggleSwitch.className = 'switch';
        
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = this.observing;
        toggleInput.addEventListener('change', (e) => {
            this.toggleObservation(e.target.checked);
        });
        
        const slider = document.createElement('span');
        slider.className = 'slider';
        
        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(slider);
        toggleContainer.appendChild(toggleSwitch);
        
        // Slit width slider
        const slitContainer = document.createElement('div');
        slitContainer.style.display = 'flex';
        slitContainer.style.alignItems = 'center';
        slitContainer.style.marginBottom = '10px';
        
        const slitLabel = document.createElement('span');
        slitLabel.className = 'control-label';
        slitLabel.textContent = 'Slit Width: ';
        slitContainer.appendChild(slitLabel);
        
        const slitSlider = document.createElement('input');
        slitSlider.type = 'range';
        slitSlider.min = '0.1';
        slitSlider.max = '1.0';
        slitSlider.step = '0.05';
        slitSlider.value = this.settings.slitWidth;
        
        const slitValue = document.createElement('span');
        slitValue.className = 'value-display';
        slitValue.textContent = this.settings.slitWidth;
        
        slitSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.settings.slitWidth = value;
            slitValue.textContent = value.toFixed(2);
            
            // Update slits
            this.slit1.scale.z = value / 0.5;
            this.slit2.scale.z = value / 0.5;
        });
        
        slitContainer.appendChild(slitSlider);
        slitContainer.appendChild(slitValue);
        
        // Speed slider
        const speedContainer = document.createElement('div');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';
        
        const speedLabel = document.createElement('span');
        speedLabel.className = 'control-label';
        speedLabel.textContent = 'Particle Speed: ';
        speedContainer.appendChild(speedLabel);
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '0.2';
        speedSlider.max = '2.0';
        speedSlider.step = '0.1';
        speedSlider.value = this.settings.particleSpeed;
        
        const speedValue = document.createElement('span');
        speedValue.className = 'value-display';
        speedValue.textContent = this.settings.particleSpeed;
        
        speedSlider.addEventListener('input', (e) => {
            this.settings.particleSpeed = parseFloat(e.target.value);
            speedValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        speedContainer.appendChild(speedSlider);
        speedContainer.appendChild(speedValue);
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Pattern';
        resetButton.addEventListener('click', () => {
            this.patternDots.forEach(dot => {
                dot.visible = false;
            });
            this.resetParticles();
        });
        
        // Add all controls
        controlsContainer.appendChild(toggleContainer);
        controlsContainer.appendChild(slitContainer);
        controlsContainer.appendChild(speedContainer);
        controlsContainer.appendChild(document.createElement('br'));
        controlsContainer.appendChild(resetButton);
        
        return controlsContainer;
    }
}

// Wave Function Collapse Animation
export class WaveCollapseAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.waveCollapse };
        this.isCollapsed = false;
        this.wavePoints = [];
        
        this.setupScene();
        this.createWaveFunction();
    }
    
    setupScene() {
        this.camera.position.set(0, 2, 6);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Add probability cloud visualization
        const cloudGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: colorSchemes.primary.particles,
            transparent: true,
            opacity: 0.2,
            wireframe: false
        });
        
        this.probabilityCloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.scene.add(this.probabilityCloud);
        this.objects.push(this.probabilityCloud);
        
        // Add measurement apparatus
        const apparatusGeometry = new THREE.CylinderGeometry(2, 2, 0.1, 32, 1, true);
        const apparatusMaterial = new THREE.MeshStandardMaterial({
            color: colorSchemes.primary.highlight,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        this.apparatus = new THREE.Mesh(apparatusGeometry, apparatusMaterial);
        this.apparatus.position.y = -2;
        this.apparatus.rotation.x = Math.PI / 2;
        this.scene.add(this.apparatus);
        this.objects.push(this.apparatus);
    }
    
    createWaveFunction() {
        // Create wave points
        const waveCount = 100;
        const waveGeometry = new THREE.BufferGeometry();
        const wavePositions = new Float32Array(waveCount * 3);
        
        for (let i = 0; i < waveCount; i++) {
            const i3 = i * 3;
            const angle = (i / waveCount) * Math.PI * 2;
            const radius = 1.5;
            
            wavePositions[i3] = Math.cos(angle) * radius;
            wavePositions[i3 + 1] = 0;
            wavePositions[i3 + 2] = Math.sin(angle) * radius;
        }
        
        waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
        
        const waveMaterial = new THREE.LineBasicMaterial({
            color: colorSchemes.primary.waves,
            linewidth: 2
        });
        
        this.waveLine = new THREE.Line(waveGeometry, waveMaterial);
        this.scene.add(this.waveLine);
        this.objects.push(this.waveLine);
        
        // Create particle for collapsed state
        const particleGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: colorSchemes.primary.particles,
            emissive: colorSchemes.primary.particles,
            emissiveIntensity: 0.5
        });
        
        this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.particle.visible = false;
        this.scene.add(this.particle);
        this.objects.push(this.particle);
        
        // Create wave rings
        this.waveRings = [];
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.RingGeometry(0.2, 0.21, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: colorSchemes.primary.waves,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = -Math.PI / 2;
            ring.visible = false;
            this.scene.add(ring);
            this.waveRings.push(ring);
            this.objects.push(ring);
        }
    }
    
    collapseWaveFunction() {
        if (this.isCollapsed) return;
        
        this.isCollapsed = true;
        
        // Choose random position on the wave circle
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Show particle at that position
        this.particle.position.set(x, 0, z);
        this.particle.visible = true;
        this.particle.scale.set(0.1, 0.1, 0.1);
        
        // Flash appearance animation
        gsap.to(this.particle.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)"
        });
        
        // Hide the wave
        gsap.to(this.waveLine.material, {
            opacity: 0,
            duration: 0.5
        });
        
        // Shrink probability cloud
        gsap.to(this.probabilityCloud.scale, {
            x: 0.1,
            y: 0.1,
            z: 0.1,
            duration: 0.7,
            ease: "power2.out"
        });
        
        // Show wave rings emanating from the particle
        for (let i = 0; i < this.waveRings.length; i++) {
            const ring = this.waveRings[i];
            ring.position.copy(this.particle.position);
            ring.visible = true;
            ring.scale.set(0.1, 0.1, 0.1);
            
            gsap.to(ring.scale, {
                x: 3 + i * 1.5,
                y: 3 + i * 1.5,
                z: 1,
                duration: 1.5 + i * 0.3,
                delay: i * 0.2,
                ease: "power1.out",
                onComplete: () => {
                    ring.visible = false;
                }
            });
            
            gsap.to(ring.material, {
                opacity: 0,
                duration: 1.2 + i * 0.3,
                delay: 0.2 + i * 0.2
            });
        }
    }
    
    resetWaveFunction() {
        if (!this.isCollapsed) return;
        
        this.isCollapsed = false;
        
        // Hide particle
        this.particle.visible = false;
        
        // Show wave again
        gsap.to(this.waveLine.material, {
            opacity: 1,
            duration: 0.5
        });
        
        // Restore probability cloud
        gsap.to(this.probabilityCloud.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.7,
            ease: "power2.out"
        });
        
        // Hide all wave rings
        this.waveRings.forEach(ring => {
            ring.visible = false;
        });
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Animate wave function before collapse
        if (!this.isCollapsed) {
            const positions = this.waveLine.geometry.attributes.position.array;
            const amplitude = this.settings.waveAmplitude;
            const complexity = this.settings.complexity;
            
            for (let i = 0; i < positions.length; i += 3) {
                const i3 = i / 3;
                const angle = (i3 / (positions.length / 3)) * Math.PI * 2;
                const radius = 1.5 + Math.sin(angle * complexity + time * 3) * amplitude * 0.2;
                
                positions[i] = Math.cos(angle) * radius;
                positions[i + 1] = Math.sin(time * 2 + i3 * 0.2) * amplitude * 0.3;
                positions[i + 2] = Math.sin(angle) * radius;
            }
            
            this.waveLine.geometry.attributes.position.needsUpdate = true;
            
            // Animate probability cloud pulsing
            this.probabilityCloud.scale.x = 1 + Math.sin(time * 1.5) * 0.1;
            this.probabilityCloud.scale.y = 1 + Math.sin(time * 1.7) * 0.1;
            this.probabilityCloud.scale.z = 1 + Math.sin(time * 1.3) * 0.1;
        }
        
        // Rotate apparatus
        this.apparatus.rotation.z = time * 0.2;
        
        // Rotate scene slightly for visual interest
        if (this.starField) {
            this.scene.rotation.y = Math.sin(time * 0.2) * 0.1;
        }
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Collapse button
        const collapseButton = document.createElement('button');
        collapseButton.textContent = 'Collapse Wave Function';
        collapseButton.addEventListener('click', () => {
            this.collapseWaveFunction();
        });
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Wave Function';
        resetButton.addEventListener('click', () => {
            this.resetWaveFunction();
        });
        
        // Wave complexity slider
        const complexityContainer = document.createElement('div');
        complexityContainer.style.display = 'flex';
        complexityContainer.style.alignItems = 'center';
        complexityContainer.style.marginBottom = '10px';
        
        const complexityLabel = document.createElement('span');
        complexityLabel.className = 'control-label';
        complexityLabel.textContent = 'Wave Complexity: ';
        complexityContainer.appendChild(complexityLabel);
        
        const complexitySlider = document.createElement('input');
        complexitySlider.type = 'range';
        complexitySlider.min = '1';
        complexitySlider.max = '10';
        complexitySlider.step = '1';
        complexitySlider.value = this.settings.complexity;
        
        const complexityValue = document.createElement('span');
        complexityValue.className = 'value-display';
        complexityValue.textContent = this.settings.complexity;
        
        complexitySlider.addEventListener('input', (e) => {
            this.settings.complexity = parseInt(e.target.value);
            complexityValue.textContent = e.target.value;
        });
        
        complexityContainer.appendChild(complexitySlider);
        complexityContainer.appendChild(complexityValue);
        
        // Wave amplitude slider
        const amplitudeContainer = document.createElement('div');
        amplitudeContainer.style.display = 'flex';
        amplitudeContainer.style.alignItems = 'center';
        amplitudeContainer.style.marginBottom = '10px';
        
        const amplitudeLabel = document.createElement('span');
        amplitudeLabel.className = 'control-label';
        amplitudeLabel.textContent = 'Wave Amplitude: ';
        amplitudeContainer.appendChild(amplitudeLabel);
        
        const amplitudeSlider = document.createElement('input');
        amplitudeSlider.type = 'range';
        amplitudeSlider.min = '0.1';
        amplitudeSlider.max = '1.0';
        amplitudeSlider.step = '0.1';
        amplitudeSlider.value = this.settings.waveAmplitude;
        
        const amplitudeValue = document.createElement('span');
        amplitudeValue.className = 'value-display';
        amplitudeValue.textContent = this.settings.waveAmplitude;
        
        amplitudeSlider.addEventListener('input', (e) => {
            this.settings.waveAmplitude = parseFloat(e.target.value);
            amplitudeValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        amplitudeContainer.appendChild(amplitudeSlider);
        amplitudeContainer.appendChild(amplitudeValue);
        
        // Add all controls
        controlsContainer.appendChild(complexityContainer);
        controlsContainer.appendChild(amplitudeContainer);
        controlsContainer.appendChild(collapseButton);
        controlsContainer.appendChild(document.createElement('br'));
        controlsContainer.appendChild(resetButton);
        
        return controlsContainer;
    }
}

// Quantum Entanglement Animation
export class EntanglementAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.entanglement };
        this.entangledPairs = [];
        this.setupScene();
        this.createEntangledPairs();
    }
    
    setupScene() {
        this.camera.position.set(0, 5, 10);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Create connection line material
        this.lineMaterial = new THREE.LineBasicMaterial({
            color: colorSchemes.primary.waves,
            transparent: true,
            opacity: 0.6
        });
    }
    
    createEntangledPairs() {
        const pairCount = this.settings.particlePairs;
        
        for (let i = 0; i < pairCount; i++) {
            // Create pair of particles
            const particle1Geometry = new THREE.SphereGeometry(0.2, 16, 16);
            const particle2Geometry = new THREE.SphereGeometry(0.2, 16, 16);
            
            const particle1Material = new THREE.MeshStandardMaterial({
                color: colorSchemes.primary.particles,
                emissive: colorSchemes.primary.particles,
                emissiveIntensity: 0.3
            });
            
            const particle2Material = new THREE.MeshStandardMaterial({
                color: colorSchemes.primary.secondary,
                emissive: colorSchemes.primary.secondary,
                emissiveIntensity: 0.3
            });
            
            const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
            const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
            
            // Position particles
            const angle = Math.random() * Math.PI * 2;
            const distance = 1.5 + Math.random() * 2;
            const height = (Math.random() - 0.5) * 3;
            
            particle1.position.set(Math.cos(angle) * distance, height, Math.sin(angle) * distance);
            particle2.position.set(-Math.cos(angle) * distance, height, -Math.sin(angle) * distance);
            
            this.scene.add(particle1);
            this.scene.add(particle2);
            this.objects.push(particle1, particle2);
            
            // Create connection line
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                particle1.position,
                particle2.position
            ]);
            
            const line = new THREE.Line(lineGeometry, this.lineMaterial.clone());
            this.scene.add(line);
            this.objects.push(line);
            
            // Setup spinning indicators to show quantum states
            const spinGeometry = new THREE.CylinderGeometry(0, 0.15, 0.3, 8);
            const spin1Material = new THREE.MeshBasicMaterial({
                color: 0xff3333
            });
            const spin2Material = new THREE.MeshBasicMaterial({
                color: 0x3333ff
            });
            
            const spin1 = new THREE.Mesh(spinGeometry, spin1Material);
            const spin2 = new THREE.Mesh(spinGeometry, spin2Material);
            
            spin1.rotation.x = Math.PI / 2;
            spin2.rotation.x = -Math.PI / 2;
            
            particle1.add(spin1);
            particle2.add(spin2);
            
            // Track if this pair has been measured
            const measured = false;
            
            // Add to array
            this.entangledPairs.push({
                particle1,
                particle2,
                line,
                spin1,
                spin2,
                spinState: Math.random() > 0.5 ? 1 : -1, // Random initial state
                measured
            });
        }
    }
    
    measureParticle(pairIndex, particleNumber) {
        const pair = this.entangledPairs[pairIndex];
        if (pair.measured) return;
        
        pair.measured = true;
        
        // Determine spin states - always opposite for entangled particles
        const spinState = particleNumber === 1 ? pair.spinState : -pair.spinState;
        
        // Update visuals based on measurement
        if (particleNumber === 1) {
            // First particle is measured
            gsap.to(pair.particle1.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
            
            // Make spin indicator more visible for measured particle
            gsap.to(pair.spin1.material, {
                opacity: 1,
                duration: 0.2
            });
            
            // Set the spin direction
            if (spinState > 0) {
                pair.spin1.rotation.x = Math.PI / 2;
            } else {
                pair.spin1.rotation.x = -Math.PI / 2;
            }
            
            // After a short delay, show reaction of entangled particle
            setTimeout(() => {
                gsap.to(pair.particle2.scale, {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
                
                // Set the opposite spin direction for entangled particle
                if (spinState > 0) {
                    pair.spin2.rotation.x = -Math.PI / 2;
                } else {
                    pair.spin2.rotation.x = Math.PI / 2;
                }
                
                // Make spin indicator more visible for entangled particle
                gsap.to(pair.spin2.material, {
                    opacity: 1,
                    duration: 0.2
                });
                
                // Highlight connection
                gsap.to(pair.line.material, {
                    opacity: 1,
                    duration: 0.3
                });
                
                // Pulse connection
                const pulseGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const pulseMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                
                const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
                pulse.position.copy(pair.particle1.position);
                this.scene.add(pulse);
                this.objects.push(pulse);
                
                gsap.to(pulse.position, {
                    x: pair.particle2.position.x,
                    y: pair.particle2.position.y,
                    z: pair.particle2.position.z,
                    duration: 0.5,
                    ease: "power1.in",
                    onComplete: () => {
                        this.scene.remove(pulse);
                        this.objects = this.objects.filter(obj => obj !== pulse);
                    }
                });
            }, 300);
        } else {
            // Same logic but starting with the second particle
            gsap.to(pair.particle2.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
            
            gsap.to(pair.spin2.material, {
                opacity: 1,
                duration: 0.2
            });
            
            if (spinState > 0) {
                pair.spin2.rotation.x = Math.PI / 2;
            } else {
                pair.spin2.rotation.x = -Math.PI / 2;
            }
            
            setTimeout(() => {
                gsap.to(pair.particle1.scale, {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
                
                if (spinState > 0) {
                    pair.spin1.rotation.x = -Math.PI / 2;
                } else {
                    pair.spin1.rotation.x = Math.PI / 2;
                }
                
                gsap.to(pair.spin1.material, {
                    opacity: 1,
                    duration: 0.2
                });
                
                gsap.to(pair.line.material, {
                    opacity: 1,
                    duration: 0.3
                });
                
                const pulseGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const pulseMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                
                const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
                pulse.position.copy(pair.particle2.position);
                this.scene.add(pulse);
                this.objects.push(pulse);
                
                gsap.to(pulse.position, {
                    x: pair.particle1.position.x,
                    y: pair.particle1.position.y,
                    z: pair.particle1.position.z,
                    duration: 0.5,
                    ease: "power1.in",
                    onComplete: () => {
                        this.scene.remove(pulse);
                        this.objects = this.objects.filter(obj => obj !== pulse);
                    }
                });
            }, 300);
        }
    }
    
    resetMeasurements() {
        for (const pair of this.entangledPairs) {
            pair.measured = false;
            
            // Reset visuals
            gsap.to(pair.line.material, {
                opacity: 0.6,
                duration: 0.3
            });
            
            // Reset spin states
            pair.spinState = Math.random() > 0.5 ? 1 : -1;
            
            pair.spin1.rotation.y = Math.random() * Math.PI * 2;
            pair.spin2.rotation.y = Math.random() * Math.PI * 2;
        }
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Update entangled pairs
        for (const pair of this.entangledPairs) {
            if (!pair.measured) {
                // Rotate spin indicators to show uncertainty when not measured
                pair.spin1.rotation.y += 0.05;
                pair.spin2.rotation.y += 0.05;
            }
            
            // Update connection lines
            const positions = pair.line.geometry.attributes.position.array;
            positions[0] = pair.particle1.position.x;
            positions[1] = pair.particle1.position.y;
            positions[2] = pair.particle1.position.z;
            positions[3] = pair.particle2.position.x;
            positions[4] = pair.particle2.position.y;
            positions[5] = pair.particle2.position.z;
            pair.line.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Create pair selection dropdown
        const pairLabel = document.createElement('span');
        pairLabel.className = 'control-label';
        pairLabel.textContent = 'Select Pair: ';
        
        const pairSelect = document.createElement('select');
        for (let i = 0; i < this.entangledPairs.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Pair ${i + 1}`;
            pairSelect.appendChild(option);
        }
        
        const pairContainer = document.createElement('div');
        pairContainer.style.marginBottom = '10px';
        pairContainer.appendChild(pairLabel);
        pairContainer.appendChild(pairSelect);
        
        // Measurement buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginBottom = '10px';
        
        const measureParticle1Btn = document.createElement('button');
        measureParticle1Btn.textContent = 'Measure Particle A';
        measureParticle1Btn.addEventListener('click', () => {
            const pairIndex = parseInt(pairSelect.value);
            this.measureParticle(pairIndex, 1);
        });
        
        const measureParticle2Btn = document.createElement('button');
        measureParticle2Btn.textContent = 'Measure Particle B';
        measureParticle2Btn.addEventListener('click', () => {
            const pairIndex = parseInt(pairSelect.value);
            this.measureParticle(pairIndex, 2);
        });
        
        buttonContainer.appendChild(measureParticle1Btn);
        buttonContainer.appendChild(measureParticle2Btn);
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset All Measurements';
        resetButton.addEventListener('click', () => {
            this.resetMeasurements();
        });
        
        // Add all controls
        controlsContainer.appendChild(pairContainer);
        controlsContainer.appendChild(buttonContainer);
        controlsContainer.appendChild(resetButton);
        
        return controlsContainer;
    }
}

// Many Worlds Animation
export class ManyWorldsAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.manyWorlds };
        this.branches = [];
        this.branchPoints = [];
        this.universeRoot = null;
        
        this.setupScene();
        this.createMultiverse();
    }
    
    setupScene() {
        this.camera.position.set(0, 5, 10);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Material for branching paths
        this.branchMaterial = new THREE.LineBasicMaterial({
            color: colorSchemes.primary.waves,
            transparent: true,
            opacity: 0.7
        });
        
        // Material for universe bubbles
        this.universeMaterial = new THREE.MeshPhysicalMaterial({
            color: colorSchemes.primary.highlight,
            transparent: true,
            opacity: 0.4,
            roughness: 0.2,
            metalness: 0.3,
            transmission: 0.9
        });
    }
    
    createMultiverse() {
        // Create root universe
        const rootGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const rootMaterial = this.universeMaterial.clone();
        rootMaterial.color.set(0xffffff);
        rootMaterial.emissive = new THREE.Color(0x3a7bd5);
        rootMaterial.emissiveIntensity = 0.3;
        
        this.universeRoot = new THREE.Mesh(rootGeometry, rootMaterial);
        this.universeRoot.position.set(0, 0, 0);
        this.scene.add(this.universeRoot);
        this.objects.push(this.universeRoot);
        
        // Create initial branching
        this.createBranches(this.universeRoot.position, 0);
    }
    
    createBranches(startPosition, depth) {
        if (depth >= this.settings.maxDepth) return;
        
        const branchCount = depth === 0 ? this.settings.branchingFactor : 
                           Math.floor(Math.random() * this.settings.branchingFactor) + 1;
        
        for (let i = 0; i < branchCount; i++) {
            // Create branch endpoint
            const angle = (i / branchCount) * Math.PI * 2 + Math.random() * 0.5;
            const distance = 3 - depth * 0.5 + Math.random() * 0.5;
            const yOffset = (Math.random() - 0.5) * 1.5;
            
            const endX = startPosition.x + Math.cos(angle) * distance;
            const endY = startPosition.y + yOffset;
            const endZ = startPosition.z + Math.sin(angle) * distance;
            
            const endPosition = new THREE.Vector3(endX, endY, endZ);
            
            // Create branch path
            const points = [];
            const segmentCount = 10;
            
            for (let j = 0; j <= segmentCount; j++) {
                const t = j / segmentCount;
                const x = startPosition.x + (endPosition.x - startPosition.x) * t;
                const y = startPosition.y + (endPosition.y - startPosition.y) * t;
                const z = startPosition.z + (endPosition.z - startPosition.z) * t;
                
                // Add some curvature
                const bulge = Math.sin(t * Math.PI) * 0.5;
                const bulgeX = Math.cos(angle + Math.PI/2) * bulge;
                const bulgeZ = Math.sin(angle + Math.PI/2) * bulge;
                
                points.push(new THREE.Vector3(
                    x + bulgeX,
                    y + Math.sin(t * Math.PI) * 0.3,
                    z + bulgeZ
                ));
            }
            
            const branchGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const branch = new THREE.Line(branchGeometry, this.branchMaterial.clone());
            
            branch.material.opacity = 0.7 - depth * 0.15;
            branch.material.color.setHSL(depth * 0.1, 0.8, 0.5);
            
            this.scene.add(branch);
            this.objects.push(branch);
            this.branches.push(branch);
            
            // Create universe bubble at end
            const universeGeometry = new THREE.SphereGeometry(0.3 - depth * 0.05, 24, 24);
            const universeMaterial = this.universeMaterial.clone();
            universeMaterial.color.setHSL(depth * 0.1, 0.7, 0.5);
            
            const universe = new THREE.Mesh(universeGeometry, universeMaterial);
            universe.position.copy(endPosition);
            this.scene.add(universe);
            this.objects.push(universe);
            
            // Store as a branch point for later interaction
            this.branchPoints.push({
                universe,
                position: endPosition.clone(),
                depth,
                branched: false  // Flag to check if this point has already branched
            });
            
            // Recursively create more branches with probability
            if (Math.random() < this.settings.branchingProbability) {
                this.createBranches(endPosition, depth + 1);
            }
        }
    }
    
    triggerBranching(branchIndex) {
        const branchPoint = this.branchPoints[branchIndex];
        
        if (branchPoint.branched || branchPoint.depth >= this.settings.maxDepth - 1) return;
        
        branchPoint.branched = true;
        
        // Highlight the selected universe
        gsap.to(branchPoint.universe.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
        
        // Create new branches from this point
        this.createBranches(branchPoint.position, branchPoint.depth + 1);
    }
    
    resetMultiverse() {
        // Remove all existing branches and universes
        this.branches.forEach(branch => {
            this.scene.remove(branch);
        });
        
        this.branchPoints.forEach(bp => {
            this.scene.remove(bp.universe);
        });
        
        // Clear arrays
        this.branches = [];
        this.branchPoints = [];
        
        // Create new branching structure
        this.createBranches(this.universeRoot.position, 0);
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Gentle pulsation for universe bubbles
        this.branchPoints.forEach((bp, index) => {
            const phase = time * 0.5 + index * 0.2;
            const scale = 1 + Math.sin(phase) * 0.1;
            bp.universe.scale.set(scale, scale, scale);
        });
        
        if (this.universeRoot) {
            const rootScale = 1 + Math.sin(time * 0.7) * 0.2;
            this.universeRoot.scale.set(rootScale, rootScale, rootScale);
        }
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Branch selection dropdown
        const branchLabel = document.createElement('span');
        branchLabel.className = 'control-label';
        branchLabel.textContent = 'Select Universe: ';
        
        const branchSelect = document.createElement('select');
        const updateBranchOptions = () => {
            // Clear existing options
            while (branchSelect.firstChild) {
                branchSelect.removeChild(branchSelect.firstChild);
            }
            
            // Add options for each branch point
            this.branchPoints.forEach((bp, index) => {
                if (bp.depth < this.settings.maxDepth - 1) {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `Universe ${index + 1} (Depth ${bp.depth + 1})`;
                    if (bp.branched) {
                        option.textContent += ' - Branched';
                    }
                    branchSelect.appendChild(option);
                }
            });
        };
        
        updateBranchOptions();
        
        const branchContainer = document.createElement('div');
        branchContainer.style.marginBottom = '10px';
        branchContainer.appendChild(branchLabel);
        branchContainer.appendChild(branchSelect);
        
        // Branch button
        const branchButton = document.createElement('button');
        branchButton.textContent = 'Create Branch';
        branchButton.addEventListener('click', () => {
            if (branchSelect.value !== '') {
                const branchIndex = parseInt(branchSelect.value);
                this.triggerBranching(branchIndex);
                updateBranchOptions();
            }
        });
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Multiverse';
        resetButton.addEventListener('click', () => {
            this.resetMultiverse();
            updateBranchOptions();
        });
        
        // Branching factor slider
        const factorContainer = document.createElement('div');
        factorContainer.style.display = 'flex';
        factorContainer.style.alignItems = 'center';
        factorContainer.style.marginBottom = '10px';
        
        const factorLabel = document.createElement('span');
        factorLabel.className = 'control-label';
        factorLabel.textContent = 'Branching Factor: ';
        factorContainer.appendChild(factorLabel);
        
        const factorSlider = document.createElement('input');
        factorSlider.type = 'range';
        factorSlider.min = '2';
        factorSlider.max = '5';
        factorSlider.step = '1';
        factorSlider.value = this.settings.branchingFactor;
        
        const factorValue = document.createElement('span');
        factorValue.className = 'value-display';
        factorValue.textContent = this.settings.branchingFactor;
        
        factorSlider.addEventListener('input', (e) => {
            this.settings.branchingFactor = parseInt(e.target.value);
            factorValue.textContent = e.target.value;
        });
        
        factorContainer.appendChild(factorSlider);
        factorContainer.appendChild(factorValue);
        
        // Add all controls
        controlsContainer.appendChild(factorContainer);
        controlsContainer.appendChild(branchContainer);
        controlsContainer.appendChild(branchButton);
        controlsContainer.appendChild(document.createElement('br'));
        controlsContainer.appendChild(resetButton);
        
        return controlsContainer;
    }
}

// EPR Paradox Animation
export class EPRParadoxAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.eprParadox };
        this.setupScene();
        this.createParticles();
    }
    
    setupScene() {
        this.camera.position.set(0, 4, 12);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Create central source
        const sourceGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const sourceMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        
        this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.scene.add(this.source);
        this.objects.push(this.source);
        
        // Create measurement apparatus
        this.apparatus1 = this.createApparatus();
        this.apparatus1.position.set(-8, 0, 0);
        this.apparatus1.rotation.y = Math.PI / 2;
        
        this.apparatus2 = this.createApparatus();
        this.apparatus2.position.set(8, 0, 0);
        this.apparatus2.rotation.y = -Math.PI / 2;
        
        // Connection display
        const lineMaterial = new THREE.LineDashedMaterial({
            color: colorSchemes.primary.waves,
            dashSize: 0.5,
            gapSize: 0.2,
            opacity: 0.6,
            transparent: true
        });
        
        const linePoints = [
            new THREE.Vector3(-8, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(8, 0, 0)
        ];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        this.connectionLine = new THREE.Line(lineGeometry, lineMaterial);
        this.connectionLine.computeLineDistances();
        this.scene.add(this.connectionLine);
        this.objects.push(this.connectionLine);
    }
    
    createApparatus() {
        const apparatusGroup = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.5, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.7,
            roughness: 0.2
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.25;
        apparatusGroup.add(base);
        
        // Detection area
        const detectorGeometry = new THREE.CylinderGeometry(1, 1, 0.4, 32);
        const detectorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            emissive: 0x3a7bd5,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
        detector.position.y = 0.2;
        apparatusGroup.add(detector);
        
        // Direction indicator
        const arrowGeometry = new THREE.ConeGeometry(0.4, 0.8, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: colorSchemes.primary.highlight
        });
        
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.y = 1;
        arrow.rotation.x = Math.PI;
        apparatusGroup.add(arrow);
        
        this.scene.add(apparatusGroup);
        this.objects.push(apparatusGroup);
        
        return apparatusGroup;
    }
    
    createParticles() {
        // Create entangled particles
        this.particles = [];
        this.particleStates = [];
        
        // Store detected states for each detector
        this.detector1Results = [];
        this.detector2Results = [];
        
        // Result displays
        this.resultDisplay1 = document.createElement('div');
        this.resultDisplay1.style.position = 'absolute';
        this.resultDisplay1.style.left = '10%';
        this.resultDisplay1.style.top = '10%';
        this.resultDisplay1.style.background = 'rgba(15, 23, 42, 0.7)';
        this.resultDisplay1.style.color = 'white';
        this.resultDisplay1.style.padding = '10px';
        this.resultDisplay1.style.borderRadius = '5px';
        this.resultDisplay1.textContent = 'Detector A: No measurements';
        
        this.resultDisplay2 = document.createElement('div');
        this.resultDisplay2.style.position = 'absolute';
        this.resultDisplay2.style.right = '10%';
        this.resultDisplay2.style.top = '10%';
        this.resultDisplay2.style.background = 'rgba(15, 23, 42, 0.7)';
        this.resultDisplay2.style.color = 'white';
        this.resultDisplay2.style.padding = '10px';
        this.resultDisplay2.style.borderRadius = '5px';
        this.resultDisplay2.textContent = 'Detector B: No measurements';
        
        document.body.appendChild(this.resultDisplay1);
        document.body.appendChild(this.resultDisplay2);
    }
    
    emitParticlePair() {
        // Create particle geometries
        const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const particleMaterial1 = new THREE.MeshStandardMaterial({
            color: 0xff3333,
            emissive: 0xff3333,
            emissiveIntensity: 0.5
        });
        
        const particleMaterial2 = new THREE.MeshStandardMaterial({
            color: 0x3333ff,
            emissive: 0x3333ff,
            emissiveIntensity: 0.5
        });
        
        // Create first particle (going left)
        const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
        particle1.position.copy(this.source.position);
        this.scene.add(particle1);
        this.objects.push(particle1);
        
        // Create second particle (going right)
        const particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);
        particle2.position.copy(this.source.position);
        this.scene.add(particle2);
        this.objects.push(particle2);
        
        // Determine entangled state (randomly)
        const state = Math.random() > 0.5 ? 1 : -1;
        
        // Add to arrays
        this.particles.push({
            left: particle1,
            right: particle2,
            leftDetected: false,
            rightDetected: false
        });
        
        this.particleStates.push(state);
        
        // Flash source to indicate emission
        gsap.to(this.source.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
    }
    
    measureParticles() {
        // Set random angles for both detectors
        const angle1 = (Math.random() * 360).toFixed(0);
        const angle2 = (Math.random() * 360).toFixed(0);
        
        // Rotate detectors to new angles
        gsap.to(this.apparatus1.rotation, {
            z: THREE.MathUtils.degToRad(parseInt(angle1)),
            duration: 0.5
        });
        
        gsap.to(this.apparatus2.rotation, {
            z: THREE.MathUtils.degToRad(parseInt(angle2)),
            duration: 0.5
        });
        
        // Calculate angle difference
        const angleDiff = Math.abs(parseInt(angle1) - parseInt(angle2));
        const normalizedDiff = (angleDiff > 180) ? 360 - angleDiff : angleDiff;
        
        // Calculate quantum correlation based on angle difference
        // Using cos²(θ/2) as per quantum mechanics prediction
        const correlation = Math.cos(THREE.MathUtils.degToRad(normalizedDiff) / 2) ** 2;
        
        // Generate result that respects this correlation probability
        const correlated = Math.random() < correlation;
        
        // Record results
        const result1 = Math.random() > 0.5 ? "UP" : "DOWN";
        const result2 = correlated ? result1 : (result1 === "UP" ? "DOWN" : "UP");
        
        this.detector1Results.push(result1);
        this.detector2Results.push(result2);
        
        // Update visual results
        this.updateResults();
        
        // Emit particles to show measurement
        this.emitParticlePair();
        
        // Flash detectors to indicate measurement
        const detector1 = this.apparatus1.children[1];
        const detector2 = this.apparatus2.children[1];
        
        gsap.to(detector1.material, {
            emissiveIntensity: 0.8,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
        
        gsap.to(detector2.material, {
            emissiveIntensity: 0.8,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            delay: 0.3
        });
        
        // Update connection to indicate correlation
        gsap.to(this.connectionLine.material, {
            opacity: correlated ? 1 : 0.2,
            dashSize: correlated ? 1 : 0.3,
            duration: 0.5
        });
    }
    
    updateResults() {
        if (this.detector1Results.length === 0) return;
        
        // Calculate statistics
        const totalMeasurements = this.detector1Results.length;
        
        let matchingResults = 0;
        for (let i = 0; i < totalMeasurements; i++) {
            if (this.detector1Results[i] === this.detector2Results[i]) {
                matchingResults++;
            }
        }
        
        const correlationPercentage = ((matchingResults / totalMeasurements) * 100).toFixed(1);
        
        // Update displays
        this.resultDisplay1.innerHTML = `
            <strong>Detector A:</strong><br>
            Measurements: ${totalMeasurements}<br>
            Last result: ${this.detector1Results[totalMeasurements - 1]}<br>
            Correlation: ${correlationPercentage}%
        `;
        
        this.resultDisplay2.innerHTML = `
            <strong>Detector B:</strong><br>
            Measurements: ${totalMeasurements}<br>
            Last result: ${this.detector2Results[totalMeasurements - 1]}<br>
            Correlation: ${correlationPercentage}%
        `;
    }
    
    resetMeasurements() {
        // Clear all results
        this.detector1Results = [];
        this.detector2Results = [];
        
        // Reset displays
        this.resultDisplay1.textContent = 'Detector A: No measurements';
        this.resultDisplay2.textContent = 'Detector B: No measurements';
        
        // Reset connection line
        gsap.to(this.connectionLine.material, {
            opacity: 0.6,
            dashSize: 0.5,
            duration: 0.5
        });
        
        // Remove existing particles
        for (const pair of this.particles) {
            this.scene.remove(pair.left);
            this.scene.remove(pair.right);
            this.objects = this.objects.filter(obj => obj !== pair.left && obj !== pair.right);
        }
        
        this.particles = [];
        this.particleStates = [];
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Update particle positions
        for (const pair of this.particles) {
            // Move left particle
            if (!pair.leftDetected && pair.left.position.x > -8) {
                pair.left.position.x -= this.settings.particleSpeed * 0.1;
                
                // Check if particle reached detector
                if (pair.left.position.x <= -7.5) {
                    pair.leftDetected = true;
                    gsap.to(pair.left.scale, {
                        x: 0.1,
                        y: 0.1,
                        z: 0.1,
                        duration: 0.3,
                        onComplete: () => {
                            pair.left.visible = false;
                        }
                    });
                }
            }
            
            // Move right particle
            if (!pair.rightDetected && pair.right.position.x < 8) {
                pair.right.position.x += this.settings.particleSpeed * 0.1;
                
                // Check if particle reached detector
                if (pair.right.position.x >= 7.5) {
                    pair.rightDetected = true;
                    gsap.to(pair.right.scale, {
                        x: 0.1,
                        y: 0.1,
                        z: 0.1,
                        duration: 0.3,
                        onComplete: () => {
                            pair.right.visible = false;
                        }
                    });
                }
            }
        }
        
        // Pulse source
        this.source.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Measure button
        const measureButton = document.createElement('button');
        measureButton.textContent = 'Take Measurement';
        measureButton.addEventListener('click', () => {
            this.measureParticles();
        });
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Measurements';
        resetButton.addEventListener('click', () => {
            this.resetMeasurements();
        });
        
        // Particle speed slider
        const speedContainer = document.createElement('div');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';
        speedContainer.style.marginBottom = '10px';
        
        const speedLabel = document.createElement('span');
        speedLabel.className = 'control-label';
        speedLabel.textContent = 'Particle Speed: ';
        speedContainer.appendChild(speedLabel);
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '0.2';
        speedSlider.max = '2.0';
        speedSlider.step = '0.1';
        speedSlider.value = this.settings.particleSpeed;
        
        const speedValue = document.createElement('span');
        speedValue.className = 'value-display';
        speedValue.textContent = this.settings.particleSpeed;
        
        speedSlider.addEventListener('input', (e) => {
            this.settings.particleSpeed = parseFloat(e.target.value);
            speedValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        speedContainer.appendChild(speedSlider);
        speedContainer.appendChild(speedValue);
        
        // Add all controls
        controlsContainer.appendChild(speedContainer);
        controlsContainer.appendChild(measureButton);
        controlsContainer.appendChild(document.createElement('br'));
        controlsContainer.appendChild(resetButton);
        
        return controlsContainer;
    }
    
    destroy() {
        super.destroy();
        
        // Remove result displays
        if (this.resultDisplay1 && this.resultDisplay1.parentNode) {
            this.resultDisplay1.parentNode.removeChild(this.resultDisplay1);
        }
        
        if (this.resultDisplay2 && this.resultDisplay2.parentNode) {
            this.resultDisplay2.parentNode.removeChild(this.resultDisplay2);
        }
    }
}

// Back Action Animation
export class BackActionAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.backAction };
        this.measured = false;
        this.measuring = false;
        
        this.setupScene();
        this.createQuantumSystem();
    }
    
    setupScene() {
        this.camera.position.set(0, 4, 10);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Create a platform for the system
        const platformGeometry = new THREE.CylinderGeometry(4, 4, 0.2, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.7,
            roughness: 0.2
        });
        
        this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
        this.platform.position.y = -2;
        this.scene.add(this.platform);
        this.objects.push(this.platform);
    }
    
    createQuantumSystem() {
        // Create quantum system group
        this.systemGroup = new THREE.Group();
        this.scene.add(this.systemGroup);
        this.objects.push(this.systemGroup);
        
        // Create central quantum system
        const systemGeometry = new THREE.SphereGeometry(1, 32, 32);
        const systemMaterial = new THREE.MeshStandardMaterial({
            color: colorSchemes.primary.particles,
            emissive: colorSchemes.primary.particles,
            emissiveIntensity: 0.3,
            metalness: 0.3,
            roughness: 0.7
        });
        
        this.quantumSystem = new THREE.Mesh(systemGeometry, systemMaterial);
        this.systemGroup.add(this.quantumSystem);
        
        // Create orbiting electrons to represent quantum state
        this.electrons = [];
        const electronCount = this.settings.systemComplexity * 3;
        
        for (let i = 0; i < electronCount; i++) {
            const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const electronMaterial = new THREE.MeshBasicMaterial({
                color: 0x3b82f6,
                transparent: true,
                opacity: 0.8
            });
            
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            
            // Set initial position on spherical orbit
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const radius = 1.5;
            
            electron.position.x = radius * Math.sin(theta) * Math.cos(phi);
            electron.position.y = radius * Math.sin(theta) * Math.sin(phi);
            electron.position.z = radius * Math.cos(theta);
            
            // Store orbit parameters
            electron.userData = {
                orbitRadius: radius,
                orbitSpeed: 0.5 + Math.random() * 0.5,
                orbitAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize(),
                orbitPhase: Math.random() * Math.PI * 2
            };
            
            this.systemGroup.add(electron);
            this.electrons.push(electron);
        }
        
        // Create orbits visualization
        this.orbits = [];
        for (let i = 0; i < 5; i++) {
            const orbitGeometry = new THREE.RingGeometry(1.45, 1.55, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x64748b,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2 + Math.random() * 0.8;
            orbit.rotation.y = Math.random() * Math.PI;
            
            this.systemGroup.add(orbit);
            this.orbits.push(orbit);
        }
        
        // Create measuring device
        this.measuringDevice = new THREE.Group();
        this.scene.add(this.measuringDevice);
        this.objects.push(this.measuringDevice);
        
        const deviceBaseGeometry = new THREE.BoxGeometry(2, 0.5, 1.5);
        const deviceBaseMaterial = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const deviceBase = new THREE.Mesh(deviceBaseGeometry, deviceBaseMaterial);
        deviceBase.position.y = -1.5;
        deviceBase.position.z = -4;
        this.measuringDevice.add(deviceBase);
        
        // Device sensor
        const sensorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
        const sensorMaterial = new THREE.MeshStandardMaterial({
            color: 0xd1d5db,
            metalness: 0.6,
            roughness: 0.4
        });
        
        this.sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
        this.sensor.position.copy(deviceBase.position);
        this.sensor.position.y += 1.5;
        this.sensor.rotation.x = Math.PI / 2;
        this.measuringDevice.add(this.sensor);
        
        // Sensor tip
        const tipGeometry = new THREE.ConeGeometry(0.3, 0.5, 16);
        const tipMaterial = new THREE.MeshStandardMaterial({
            color: colorSchemes.primary.highlight,
            emissive: colorSchemes.primary.highlight,
            emissiveIntensity: 0.3
        });
        
        this.sensorTip = new THREE.Mesh(tipGeometry, tipMaterial);
        this.sensorTip.position.copy(this.sensor.position);
        this.sensorTip.position.z += 1;
        this.sensorTip.rotation.x = Math.PI / 2;
        this.measuringDevice.add(this.sensorTip);
        
        // Beam from sensor
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: colorSchemes.primary.highlight,
            transparent: true,
            opacity: 0.7
        });
        
        this.beam = new THREE.Mesh(beamGeometry, beamMaterial);
        this.beam.position.copy(this.sensorTip.position);
        this.beam.position.z += 0.1;
        this.beam.rotation.x = Math.PI / 2;
        this.beam.visible = false;
        this.measuringDevice.add(this.beam);
    }
    
    performMeasurement() {
        if (this.measuring || this.measured) return;
        
        this.measuring = true;
        
        // Move sensor toward quantum system
        gsap.to(this.sensor.position, {
            z: 0,
            duration: 1.5,
            ease: "power2.inOut"
        });
        
        gsap.to(this.sensorTip.position, {
            z: 0,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                // Start beam
                this.beam.position.copy(this.sensorTip.position);
                this.beam.visible = true;
                
                // Stretch beam to reach the quantum system
                gsap.to(this.beam.scale, {
                    z: 30,
                    duration: 0.5,
                    ease: "power1.out",
                    onComplete: () => {
                        // Flash quantum system
                        gsap.to(this.quantumSystem.material, {
                            emissiveIntensity: 1,
                            duration: 0.3,
                            yoyo: true,
                            repeat: 3,
                            onComplete: () => {
                                // Change quantum system after measurement
                                this.measured = true;
                                this.measuring = false;
                                
                                // Update electrons (back-action effect)
                                this.electrons.forEach(electron => {
                                    // Disturb orbit
                                    electron.userData.orbitRadius *= 0.7 + Math.random() * 0.6;
                                    electron.userData.orbitSpeed *= 0.8 + Math.random() * 0.4;
                                    
                                    // Change color
                                    electron.material.color.set(0xff3333);
                                });
                                
                                // Change system appearance
                                gsap.to(this.quantumSystem.material, {
                                    color: new THREE.Color(0xff3333),
                                    emissive: new THREE.Color(0xff3333),
                                    duration: 1
                                });
                                
                                // Also affect measuring device (back-action)
                                gsap.to(this.sensorTip.material, {
                                    emissiveIntensity: 0.8,
                                    duration: 0.5
                                });
                                
                                // Wobble measuring device
                                gsap.to(this.measuringDevice.rotation, {
                                    z: 0.1,
                                    duration: 0.3,
                                    yoyo: true,
                                    repeat: 3
                                });
                                
                                // Retract beam
                                gsap.to(this.beam.scale, {
                                    z: 1,
                                    duration: 0.5,
                                    delay: 1,
                                    onComplete: () => {
                                        this.beam.visible = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    
    resetSystem() {
        if (this.measuring) return;
        
        this.measured = false;
        
        // Reset quantum system appearance
        gsap.to(this.quantumSystem.material, {
            color: new THREE.Color(colorSchemes.primary.particles),
            emissive: new THREE.Color(colorSchemes.primary.particles),
            emissiveIntensity: 0.3,
            duration: 1
        });
        
        // Reset electrons
        this.electrons.forEach(electron => {
            // Reset orbit
            electron.userData.orbitRadius = 1.5;
            electron.userData.orbitSpeed = 0.5 + Math.random() * 0.5;
            
            // Reset color
            gsap.to(electron.material.color, {
                r: 0.231,
                g: 0.51,
                b: 0.965,
                duration: 0.5
            });
        });
        
        // Reset measuring device
        gsap.to(this.sensor.position, {
            z: -4,
            duration: 1,
            ease: "power2.inOut"
        });
        
        gsap.to(this.sensorTip.position, {
            z: -3,
            duration: 1,
            ease: "power2.inOut"
        });
        
        gsap.to(this.sensorTip.material, {
            emissiveIntensity: 0.3,
            duration: 0.5
        });
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Update electron positions
        if (this.electrons) {
            this.electrons.forEach(electron => {
                const orbitData = electron.userData;
                const orbitAxis = orbitData.orbitAxis;
                
                // Create rotation matrix around the custom axis
                const rotationMatrix = new THREE.Matrix4();
                const angle = time * orbitData.orbitSpeed + orbitData.orbitPhase;
                
                rotationMatrix.makeRotationAxis(orbitAxis, angle);
                
                // Apply to base position (along x-axis)
                const basePosition = new THREE.Vector3(orbitData.orbitRadius, 0, 0);
                basePosition.applyMatrix4(rotationMatrix);
                
                electron.position.copy(basePosition);
            });
        }
        
        // Update quantum system visualization
        if (this.quantumSystem) {
            if (!this.measured) {
                // Gentle pulsing when not measured
                this.quantumSystem.scale.x = 1 + Math.sin(time * 1.5) * 0.1;
                this.quantumSystem.scale.y = 1 + Math.sin(time * 1.7) * 0.1;
                this.quantumSystem.scale.z = 1 + Math.sin(time * 1.3) * 0.1;
            } else {
                // More erratic behavior after measurement (back-action)
                this.quantumSystem.scale.x = 1 + Math.sin(time * 3.5) * 0.15;
                this.quantumSystem.scale.y = 1 + Math.sin(time * 2.7) * 0.15;
                this.quantumSystem.scale.z = 1 + Math.sin(time * 4.3) * 0.15;
            }
        }
        
        // Rotate orbits slowly
        if (this.orbits) {
            this.orbits.forEach((orbit, i) => {
                orbit.rotation.x += 0.001 * (i % 2 ? 1 : -1);
                orbit.rotation.z += 0.0005 * (i % 3 ? 1 : -1);
            });
        }
        
        // Update beam if visible
        if (this.beam && this.beam.visible) {
            // Animate beam energy
            this.beam.material.opacity = 0.5 + Math.sin(time * 10) * 0.3;
        }
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Measure button
        const measureButton = document.createElement('button');
        measureButton.textContent = 'Perform Measurement';
        measureButton.addEventListener('click', () => {
            this.performMeasurement();
        });
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset System';
        resetButton.addEventListener('click', () => {
            this.resetSystem();
        });
        
        // System complexity slider
        const complexityContainer = document.createElement('div');
        complexityContainer.style.display = 'flex';
        complexityContainer.style.alignItems = 'center';
        complexityContainer.style.marginBottom = '10px';
        
        const complexityLabel = document.createElement('span');
        complexityLabel.className = 'control-label';
        complexityLabel.textContent = 'System Complexity: ';
        complexityContainer.appendChild(complexityLabel);
        
        const complexitySlider = document.createElement('input');
        complexitySlider.type = 'range';
        complexitySlider.min = '1';
        complexitySlider.max = '8';
        complexitySlider.step = '1';
        complexitySlider.value = this.settings.systemComplexity;
        
        const complexityValue = document.createElement('span');
        complexityValue.className = 'value-display';
        complexityValue.textContent = this.settings.systemComplexity;
        
        complexitySlider.addEventListener('input', (e) => {
            this.settings.systemComplexity = parseInt(e.target.value);
            complexityValue.textContent = e.target.value;
        });
        
        complexityContainer.appendChild(complexitySlider);
        complexityContainer.appendChild(complexityValue);
        
        // Interaction strength slider
        const strengthContainer = document.createElement('div');
        strengthContainer.style.display = 'flex';
        strengthContainer.style.alignItems = 'center';
        strengthContainer.style.marginBottom = '10px';
        
        const strengthLabel = document.createElement('span');
        strengthLabel.className = 'control-label';
        strengthLabel.textContent = 'Interaction Strength: ';
        strengthContainer.appendChild(strengthLabel);
        
        const strengthSlider = document.createElement('input');
        strengthSlider.type = 'range';
        strengthSlider.min = '0.1';
        strengthSlider.max = '1.0';
        strengthSlider.step = '0.1';
        strengthSlider.value = this.settings.interactionStrength;
        
        const strengthValue = document.createElement('span');
        strengthValue.className = 'value-display';
        strengthValue.textContent = this.settings.interactionStrength;
        
        strengthSlider.addEventListener('input', (e) => {
            this.settings.interactionStrength = parseFloat(e.target.value);
            strengthValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        strengthContainer.appendChild(strengthSlider);
        strengthContainer.appendChild(strengthValue);
        
        // Add all controls
        controlsContainer.appendChild(complexityContainer);
        controlsContainer.appendChild(strengthContainer);
        controlsContainer.appendChild(measureButton);
        controlsContainer.appendChild(document.createElement('br'));
        controlsContainer.appendChild(resetButton);
        
        return controlsContainer;
    }
}

// Bell's Theorem Animation
export class BellTheoremAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.bellTheorem };
        this.runningExperiment = false;
        this.measurementResults = [];
        this.setupScene();
        this.createExperiment();
    }
    
    setupScene() {
        this.camera.position.set(0, 5, 15);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Create graph for correlation display
        this.createCorrelationGraph();
    }
    
    createCorrelationGraph() {
        // Create graph container
        this.graph = new THREE.Group();
        this.graph.position.set(6, 6, 0);
        this.scene.add(this.graph);
        this.objects.push(this.graph);
        
        // Graph background
        const graphBgGeometry = new THREE.PlaneGeometry(6, 4);
        const graphBgMaterial = new THREE.MeshBasicMaterial({
            color: 0x1e293b,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const graphBg = new THREE.Mesh(graphBgGeometry, graphBgMaterial);
        this.graph.add(graphBg);
        
        // Graph axes
        const axesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.8,
            transparent: true
        });
        
        // X-axis
        const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-3, -2, 0.01),
            new THREE.Vector3(3, -2, 0.01)
        ]);
        
        const xAxis = new THREE.Line(xAxisGeometry, axesMaterial);
        this.graph.add(xAxis);
        
        // Y-axis
        const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-3, -2, 0.01),
            new THREE.Vector3(-3, 2, 0.01)
        ]);
        
        const yAxis = new THREE.Line(yAxisGeometry, axesMaterial);
        this.graph.add(yAxis);
        
        // Axis labels
        const loader = new FontLoader(); // Use imported FontLoader
        this.textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        
        // Create placeholders for data point groups
        this.classicalPoints = new THREE.Group();
        this.graph.add(this.classicalPoints);
        
        this.quantumPoints = new THREE.Group();
        this.graph.add(this.quantumPoints);
        
        // Create theoretical curves
        this.createTheoryCurves();
    }
    
    createTheoryCurves() {
        // Classical theory curve (straight line)
        const classicalPoints = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const x = -3 + t * 6;
            // Classical correlation = 1 - 2θ/π for θ in [0, π/2]
            const y = -2 + 4 * (1 - t);
            classicalPoints.push(new THREE.Vector3(x, y, 0.02));
        }
        
        const classicalCurveGeometry = new THREE.BufferGeometry().setFromPoints(classicalPoints);
        const classicalCurveMaterial = new THREE.LineBasicMaterial({
            color: 0xff5555,
            transparent: true,
            opacity: 0.7
        });
        
        this.classicalCurve = new THREE.Line(classicalCurveGeometry, classicalCurveMaterial);
        this.graph.add(this.classicalCurve);
        
        // Quantum theory curve (cosine)
        const quantumPoints = [];
        for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const x = -3 + t * 6;
            // Quantum correlation = -cos(θ) for θ in [0, π]
            const y = -2 + 4 * (Math.cos(t * Math.PI) * -0.5 + 0.5);
            quantumPoints.push(new THREE.Vector3(x, y, 0.02));
        }
        
        const quantumCurveGeometry = new THREE.BufferGeometry().setFromPoints(quantumPoints);
        const quantumCurveMaterial = new THREE.LineBasicMaterial({
            color: 0x55aaff,
            transparent: true,
            opacity: 0.7
        });
        
        this.quantumCurve = new THREE.Line(quantumCurveGeometry, quantumCurveMaterial);
        this.graph.add(this.quantumCurve);
    }
    
    createExperiment() {
        // Create experiment apparatus
        this.apparatus = new THREE.Group();
        this.scene.add(this.apparatus);
        this.objects.push(this.apparatus);
        
        // Source of entangled particles
        const sourceGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const sourceMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        
        this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.apparatus.add(this.source);
        
        // Create detectors
        this.detector1 = this.createDetector();
        this.detector1.position.set(-4, 0, 0);
        this.apparatus.add(this.detector1);
        
        this.detector2 = this.createDetector();
        this.detector2.position.set(4, 0, 0);
        this.apparatus.add(this.detector2);
        
        // Create detector angle indicators
        const angleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        
        const angleGeometry = new THREE.CircleGeometry(1.2, 32, 0, Math.PI);
        this.angleIndicator1 = new THREE.Mesh(angleGeometry, angleMaterial);
        this.angleIndicator1.position.copy(this.detector1.position);
        this.angleIndicator1.position.y += 0.1;
        this.angleIndicator1.rotation.x = -Math.PI / 2;
        this.apparatus.add(this.angleIndicator1);
        
        this.angleIndicator2 = new THREE.Mesh(angleGeometry, angleMaterial);
        this.angleIndicator2.position.copy(this.detector2.position);
        this.angleIndicator2.position.y += 0.1;
        this.angleIndicator2.rotation.x = -Math.PI / 2;
        this.angleIndicator2.rotation.z = Math.PI;
        this.apparatus.add(this.angleIndicator2);
        
        // Add detector needle
        const needleGeometry = new THREE.BoxGeometry(0.1, 0.05, 1.2);
        const needleMaterial = new THREE.MeshBasicMaterial({
            color: 0xff5555
        });
        
        this.needle1 = new THREE.Mesh(needleGeometry, needleMaterial);
        this.needle1.position.copy(this.angleIndicator1.position);
        this.needle1.rotation.copy(this.angleIndicator1.rotation);
        this.apparatus.add(this.needle1);
        
        this.needle2 = new THREE.Mesh(needleGeometry, needleMaterial);
        this.needle2.position.copy(this.angleIndicator2.position);
        this.needle2.rotation.copy(this.angleIndicator2.rotation);
        this.apparatus.add(this.needle2);
        
        // Create results display
        this.resultsDisplay = document.createElement('div');
        this.resultsDisplay.style.position = 'absolute';
        this.resultsDisplay.style.right = '20px';
        this.resultsDisplay.style.top = '20px';
        this.resultsDisplay.style.background = 'rgba(15, 23, 42, 0.7)';
        this.resultsDisplay.style.color = 'white';
        this.resultsDisplay.style.padding = '15px';
        this.resultsDisplay.style.borderRadius = '5px';
        this.resultsDisplay.style.maxWidth = '300px';
        this.resultsDisplay.innerHTML = `
            <h3>Bell's Theorem Experiment</h3>
            <p>No measurements yet</p>
        `;
        
        document.body.appendChild(this.resultsDisplay);
    }
    
    createDetector() {
        const detector = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.5, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.7,
            roughness: 0.2
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.25;
        detector.add(base);
        
        // Central piece
        const centerGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
        const centerMaterial = new THREE.MeshStandardMaterial({
            color: 0x64748b,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = 0.15;
        detector.add(center);
        
        // Measurement display
        const displayGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
        const displayMaterial = new THREE.MeshStandardMaterial({
            color: 0x111827,
            emissive: 0x111827,
            emissiveIntensity: 0.5
        });
        
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.y = 0.4;
        detector.add(display);
        
        return detector;
    }
    
    runExperiment() {
        if (this.runningExperiment) return;
        
        this.runningExperiment = true;
        
        // Set random angles for both detectors
        const angle1 = Math.random() * Math.PI;
        const angle2 = Math.random() * Math.PI;
        
        // Update needle rotations
        gsap.to(this.needle1.rotation, {
            z: angle1,
            duration: 0.5
        });
        
        gsap.to(this.needle2.rotation, {
            z: -angle2,
            duration: 0.5
        });
        
        // Generate results based on quantum mechanics
        setTimeout(() => {
            // Calculate angle difference
            const angleDiff = Math.abs(angle1 - angle2);
            
            // Calculate theoretical quantum correlation
            const quantumCorrelation = -Math.cos(angleDiff);
            
            // Calculate theoretical classical correlation (local hidden variable)
            const normalizedDiff = angleDiff / Math.PI;
            const classicalCorrelation = 1 - 2 * normalizedDiff;
            
            // Decide measurement results based on quantum correlation
            const correlated = Math.random() < Math.abs(quantumCorrelation);
            const sameSpin = quantumCorrelation < 0 ? !correlated : correlated;
            
            // Flash the detectors
            this.displayMeasurement(this.detector1, sameSpin ? 1 : -1);
            this.displayMeasurement(this.detector2, 1);
            
            // Record results
            this.measurementResults.push({
                angleDiff: angleDiff,
                normalizedDiff: angleDiff / Math.PI,
                quantumCorrelation: quantumCorrelation,
                classicalCorrelation: classicalCorrelation,
                observed: sameSpin ? 1 : -1
            });
            
            // Update results display
            this.updateResultsDisplay();
            
            // Create a particle effect to show entanglement
            this.visualizeEntanglement();
            
            // Add data point to graph
            this.addDataPoint(angleDiff / Math.PI, sameSpin ? 1 : -1, true);
            
            this.runningExperiment = false;
        }, 1000);
    }
    
    displayMeasurement(detector, value) {
        // Get display component (third child)
        const display = detector.children[2];
        
        // Change color based on value
        const color = value > 0 ? 0x22cc55 : 0xff3333;
        
        gsap.to(display.material.emissive, {
            r: color >> 16 & 255 / 255,
            g: color >> 8 & 255 / 255,
            b: color & 255 / 255,
            duration: 0.3
        });
        
        gsap.to(display.material, {
            emissiveIntensity: 1,
            duration: 0.3,
            yoyo: true,
            repeat: 3
        });
    }
    
    visualizeEntanglement() {
        // Create particles between the detectors
        const particleCount = 30;
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random starting position near source
            particle.position.copy(this.source.position);
            particle.position.x += (Math.random() - 0.5) * 0.5;
            particle.position.y += (Math.random() - 0.5) * 0.5;
            particle.position.z += (Math.random() - 0.5) * 0.5;
            
            this.scene.add(particle);
            
            // Randomly choose left or right detector
            const goingLeft = Math.random() < 0.5;
            const target = goingLeft ? this.detector1.position : this.detector2.position;
            
            // Animate particle to detector
            gsap.to(particle.position, {
                x: target.x + (Math.random() - 0.5) * 0.5,
                y: target.y + (Math.random() - 0.5) * 0.5,
                z: target.z + (Math.random() - 0.5) * 0.5,
                duration: 0.5 + Math.random() * 0.5,
                ease: "power1.out",
                onComplete: () => {
                    this.scene.remove(particle);
                }
            });
            
            gsap.to(particle.material, {
                opacity: 0,
                duration: 0.5,
                delay: 0.5
            });
        }
    }
    
    addDataPoint(xNormalized, correlation, isQuantum) {
        // Convert normalized angle to graph position
        const x = -3 + xNormalized * 6;
        const y = -2 + (correlation * 0.5 + 0.5) * 4;
        
        // Create point
        const pointGeometry = new THREE.CircleGeometry(0.1, 16);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: isQuantum ? 0x55aaff : 0xff5555,
            transparent: true,
            opacity: 0.8
        });
        
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x, y, 0.03);
        
        // Add to appropriate group
        if (isQuantum) {
            this.quantumPoints.add(point);
        } else {
            this.classicalPoints.add(point);
        }
    }
    
    updateResultsDisplay() {
        if (this.measurementResults.length === 0) return;
        
        // Calculate statistics from all measurements
        let matches = 0;
        const measurements = this.measurementResults.length;
        
        // Group by angle ranges
        const angleGroups = {
            small: { count: 0, matches: 0 }, // 0-30 degrees
            medium: { count: 0, matches: 0 }, // 30-60 degrees
            large: { count: 0, matches: 0 }, // 60-90 degrees
            vlarge: { count: 0, matches: 0 }  // 90+ degrees
        };
        
        for (const result of this.measurementResults) {
            if (result.observed === 1) matches++;
            
            const angleDegrees = result.angleDiff * 180 / Math.PI;
            
            if (angleDegrees <= 30) {
                angleGroups.small.count++;
                if (result.observed === 1) angleGroups.small.matches++;
            } else if (angleDegrees <= 60) {
                angleGroups.medium.count++;
                if (result.observed === 1) angleGroups.medium.matches++;
            } else if (angleDegrees <= 90) {
                angleGroups.large.count++;
                if (result.observed === 1) angleGroups.large.matches++;
            } else {
                angleGroups.vlarge.count++;
                if (result.observed === 1) angleGroups.vlarge.matches++;
            }
        }
        
        // Calculate correlation for each group
        const correlations = {};
        for (const [range, data] of Object.entries(angleGroups)) {
            if (data.count > 0) {
                correlations[range] = ((data.matches / data.count) * 2) - 1;
            } else {
                correlations[range] = "N/A";
            }
        }
        
        // Update display
        this.resultsDisplay.innerHTML = `
            <h3>Bell's Theorem Results</h3>
            <p>Total measurements: ${measurements}</p>
            <p>Overall correlation: ${((matches / measurements) * 2 - 1).toFixed(2)}</p>
            <table style="width:100%; margin-top:10px; border-collapse:collapse;">
                <tr style="border-bottom:1px solid rgba(255,255,255,0.2);">
                    <th style="text-align:left;padding:3px;">Angle Range</th>
                    <th style="text-align:center;padding:3px;">Correlation</th>
                </tr>
                <tr>
                    <td style="padding:3px;">0°-30°</td>
                    <td style="text-align:center;padding:3px;">${typeof correlations.small === 'number' ? correlations.small.toFixed(2) : correlations.small}</td>
                </tr>
                <tr>
                    <td style="padding:3px;">30°-60°</td>
                    <td style="text-align:center;padding:3px;">${typeof correlations.medium === 'number' ? correlations.medium.toFixed(2) : correlations.medium}</td>
                </tr>
                <tr>
                    <td style="padding:3px;">60°-90°</td>
                    <td style="text-align:center;padding:3px;">${typeof correlations.large === 'number' ? correlations.large.toFixed(2) : correlations.large}</td>
                </tr>
                <tr>
                    <td style="padding:3px;">90°+</td>
                    <td style="text-align:center;padding:3px;">${typeof correlations.vlarge === 'number' ? correlations.vlarge.toFixed(2) : correlations.vlarge}</td>
                </tr>
            </table>
            <p style="margin-top:10px; font-size:0.9em; color:#8B5CF6;">
                Bell's Theorem shows quantum correlations (blue curve) exceed what's possible with classical physics (red line)
            </p>
        `;
    }
    
    resetExperiment() {
        // Clear results
        this.measurementResults = [];
        
        // Reset display
        this.resultsDisplay.innerHTML = `
            <h3>Bell's Theorem Experiment</h3>
            <p>No measurements yet</p>
        `;
        
        // Clear graph points
        while (this.quantumPoints.children.length > 0) {
            const point = this.quantumPoints.children[0];
            this.quantumPoints.remove(point);
        }
        
        while (this.classicalPoints.children.length > 0) {
            const point = this.classicalPoints.children[0];
            this.classicalPoints.remove(point);
        }
        
        // Reset detector displays
        const display1 = this.detector1.children[2];
        const display2 = this.detector2.children[2];
        
        gsap.to(display1.material.emissive, {
            r: 0.067,
            g: 0.094,
            b: 0.153,
            duration: 0.5
        });
        
        gsap.to(display2.material.emissive, {
            r: 0.067,
            g: 0.094,
            b: 0.153,
            duration: 0.5
        });
        
        gsap.to([display1.material, display2.material], {
            emissiveIntensity: 0.5,
            duration: 0.5
        });
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Pulse source
        if (this.source) {
            this.source.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
        }
        
        // Gently rotate the detector bases
        if (!this.runningExperiment) {
            if (this.angleIndicator1) {
                this.angleIndicator1.rotation.z = Math.sin(time * 0.2) * 0.1;
            }
            
            if (this.angleIndicator2) {
                this.angleIndicator2.rotation.z = Math.PI + Math.sin(time * 0.3) * 0.1;
            }
        }
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Run experiment button
        const runButton = document.createElement('button');
        runButton.textContent = 'Run Experiment';
        runButton.addEventListener('click', () => {
            this.runExperiment();
        });
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Experiment';
        resetButton.addEventListener('click', () => {
            this.resetExperiment();
        });
        
        // Auto run multiple trials
        const autoRunButton = document.createElement('button');
        autoRunButton.textContent = 'Auto Run (10 trials)';
        autoRunButton.addEventListener('click', () => {
            let count = 0;
            const runTrial = () => {
                if (count < 10) {
                    this.runExperiment();
                    count++;
                    setTimeout(runTrial, 1500);
                }
            };
            runTrial();
        });
        
        // Info button
        const infoButton = document.createElement('button');
        infoButton.textContent = 'About Bell\'s Theorem';
        infoButton.addEventListener('click', () => {
            const infoPopup = document.createElement('div');
            infoPopup.className = 'info-popup';
            infoPopup.innerHTML = `
                <button class="close-btn">×</button>
                <h4>Bell's Theorem Explained</h4>
                <p>Bell's Theorem proves that no theory of local hidden variables can reproduce all the predictions of quantum mechanics.</p>
                <p>The blue curve shows quantum correlation predictions, which can violate the limits of classical theories (red line) in certain regions.</p>
                <p>This demonstration shows how entangled particles exhibit correlations that exceed what's possible with classical physics, proving the non-local nature of quantum mechanics.</p>
            `;
            
            document.body.appendChild(infoPopup);
            
            const closeBtn = infoPopup.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(infoPopup);
            });
            
            // Position popup
            const rect = infoButton.getBoundingClientRect();
            infoPopup.style.left = `${rect.left}px`;
            infoPopup.style.top = `${rect.bottom + 10}px`;
        });
        
        // Add all controls
        controlsContainer.appendChild(runButton);
        controlsContainer.appendChild(resetButton);
        controlsContainer.appendChild(infoButton);
        
        return controlsContainer;
    }
    
    destroy() {
        super.destroy();
        
        // Remove results display
        if (this.resultsDisplay && this.resultsDisplay.parentNode) {
            this.resultsDisplay.parentNode.removeChild(this.resultsDisplay);
        }
    }
}

// Vacuum Fluctuations Animation
export class VacuumFluctuationsAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.vacuumFluctuations };
        this.activeParticles = [];
        this.setupScene();
        this.createVacuum();
    }
    
    setupScene() {
        this.camera.position.set(0, 0, 10);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Create quantum field visualization background
        const fieldGeometry = new THREE.PlaneGeometry(20, 20, 50, 50);
        const fieldMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        this.field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        this.field.rotation.x = -Math.PI / 2;
        this.field.position.y = -2;
        this.scene.add(this.field);
        this.objects.push(this.field);
        
        // Add magnifying glass to indicate zoomed-in view
        this.createMagnifyingGlass();
    }
    
    createMagnifyingGlass() {
        const glassGroup = new THREE.Group();
        glassGroup.position.set(-5, 3, 0);
        this.scene.add(glassGroup);
        this.objects.push(glassGroup);
        
        // Glass rim
        const rimGeometry = new THREE.TorusGeometry(1.2, 0.1, 16, 50);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0xd1d5db,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = Math.PI / 2;
        glassGroup.add(rim);
        
        // Glass lens
        const lensGeometry = new THREE.CircleGeometry(1.2, 32);
        const lensMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.rotation.x = Math.PI / 2;
        glassGroup.add(lens);
        
        // Handle
        const handleGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 16);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xd1d5db,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.y = -0.75;
        handle.position.x = 0.8;
        handle.rotation.z = Math.PI / 4;
        glassGroup.add(handle);
        
        // Arrow to point to vacuum
        const arrowMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        
        const arrowGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(1.5, -1, 0),
            new THREE.Vector3(3, -2, 0)
        ]);
        
        const arrow = new THREE.Line(arrowGeometry, arrowMaterial);
        glassGroup.add(arrow);
        
        // Label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'quantum-label';
        labelDiv.textContent = "Quantum Vacuum";
        labelDiv.style.position = 'absolute';
        labelDiv.style.left = '10%';
        labelDiv.style.top = '30%';
        labelDiv.style.color = 'white';
        labelDiv.style.background = 'rgba(15, 23, 42, 0.7)';
        labelDiv.style.padding = '5px 10px';
        labelDiv.style.borderRadius = '4px';
        labelDiv.style.fontSize = '0.9rem';
        labelDiv.style.pointerEvents = 'none';
        document.body.appendChild(labelDiv);
        
        this.magnifyingGlass = glassGroup;
        this.vacuumLabel = labelDiv;
    }
    
    createVacuum() {
        // Create vacuum container
        this.vacuum = new THREE.Group();
        this.scene.add(this.vacuum);
        this.objects.push(this.vacuum);
        
        // Energy level indicator
        const energyBarGeometry = new THREE.BoxGeometry(5, 0.3, 0.1);
        const energyBarMaterial = new THREE.MeshBasicMaterial({
            color: 0x64748b
        });
        
        this.energyBar = new THREE.Mesh(energyBarGeometry, energyBarMaterial);
        this.energyBar.position.y = 0;
        this.vacuum.add(this.energyBar);
        
        // Zero point text
        const zeroDiv = document.createElement('div');
        zeroDiv.className = 'zero-point';
        zeroDiv.textContent = "Zero Point Energy";
        zeroDiv.style.position = 'absolute';
        zeroDiv.style.left = '50%';
        zeroDiv.style.top = '50%';
        zeroDiv.style.transform = 'translate(-50%, 20px)';
        zeroDiv.style.color = 'white';
        zeroDiv.style.fontSize = '0.8rem';
        zeroDiv.style.pointerEvents = 'none';
        document.body.appendChild(zeroDiv);
        
        this.zeroPointLabel = zeroDiv;
        
        // Start generating particles
        this.startFluctuations();
    }
    
    startFluctuations() {
        // Schedule particle creations
        setInterval(() => {
            if (this.activeParticles.length < 50) {
                this.createParticleAntiparticlePair();
            }
        }, 1000 / this.settings.fluctuationRate);
    }
    
    createParticleAntiparticlePair() {
        // Create a particle-antiparticle pair
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.8
        });
        
        const antiparticleMaterial = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xef4444,
            emissiveIntensity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial);
        
        // Random position near center
        const posX = (Math.random() - 0.5) * 6;
        const posZ = (Math.random() - 0.5) * 6;
        
        particle.position.set(posX, 0, posZ);
        antiparticle.position.set(posX, 0, posZ);
        
        this.vacuum.add(particle);
        this.vacuum.add(antiparticle);
        
        // Create energy curve visualization
        const curvePoints = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const x = posX - 0.5 + t;
            const y = Math.sin(t * Math.PI) * 0.5;
            curvePoints.push(new THREE.Vector3(x, y, posZ));
        }
        
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveMaterial = new THREE.LineBasicMaterial({
            color: 0x64748b,
            transparent: true,
            opacity: 0.5
        });
        
        const curve = new THREE.Line(curveGeometry, curveMaterial);
        this.vacuum.add(curve);
        
        // Lifespan for the pair
        const lifespan = this.settings.particleLifetime * (0.8 + Math.random() * 0.4);
        
        // Animation paths
        gsap.to(particle.position, {
            x: posX + 0.5,
            y: Math.sin(Math.PI * 0.5) * 0.5,
            duration: lifespan / 2000,
            ease: "power1.out"
        });
        
        gsap.to(antiparticle.position, {
            x: posX - 0.5,
            y: Math.sin(Math.PI * 0.5) * 0.5,
            duration: lifespan / 2000,
            ease: "power1.out"
        });
        
        // Materials fade out
        gsap.to([particle.material, antiparticle.material, curveMaterial], {
            opacity: 0,
            duration: lifespan / 1000,
            delay: lifespan / 2000,
            onComplete: () => {
                this.vacuum.remove(particle);
                this.vacuum.remove(antiparticle);
                this.vacuum.remove(curve);
            }
        });
        
        // Track active particles
        this.activeParticles.push(particle, antiparticle);
        
        // Remove from tracking after lifespan
        setTimeout(() => {
            this.activeParticles = this.activeParticles.filter(p => p !== particle && p !== antiparticle);
        }, lifespan);
    }
    
    updateFieldVisualization() {
        // Update quantum field visualization
        const positions = this.field.geometry.attributes.position.array;
        const time = this.clock.getElapsedTime();
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            
            const xSquared = x * x;
            const zSquared = z * z;
            const distance = Math.sqrt(xSquared + zSquared);
            
            // Combine multiple wave sources for complexity
            positions[i + 1] = 
                Math.sin(distance * 0.5 - time * 2) * 0.2 * Math.exp(-distance * 0.1) +
                Math.sin(x * 0.5 - time * 1.5) * 0.1 * Math.exp(-Math.abs(x) * 0.2) +
                Math.sin(z * 0.5 - time * 1.3) * 0.1 * Math.exp(-Math.abs(z) * 0.2);
        }
        
        this.field.geometry.attributes.position.needsUpdate = true;
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Update quantum field visualization
        this.updateFieldVisualization();
        
        // Animate magnifying glass
        if (this.magnifyingGlass) {
            this.magnifyingGlass.rotation.z = Math.sin(time * 0.5) * 0.1;
        }
        
        // Update energy bar
        if (this.energyBar) {
            // Subtle fluctuations
            this.energyBar.scale.y = 1 + Math.sin(time * 2) * 0.2 + Math.sin(time * 5) * 0.1;
        }
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Fluctuation rate slider
        const rateContainer = document.createElement('div');
        rateContainer.style.display = 'flex';
        rateContainer.style.alignItems = 'center';
        rateContainer.style.marginBottom = '10px';
        
        const rateLabel = document.createElement('span');
        rateLabel.className = 'control-label';
        rateLabel.textContent = 'Fluctuation Rate: ';
        rateContainer.appendChild(rateLabel);
        
        const rateSlider = document.createElement('input');
        rateSlider.type = 'range';
        rateSlider.min = '0.2';
        rateSlider.max = '2.0';
        rateSlider.step = '0.1';
        rateSlider.value = this.settings.fluctuationRate;
        
        const rateValue = document.createElement('span');
        rateValue.className = 'value-display';
        rateValue.textContent = this.settings.fluctuationRate;
        
        rateSlider.addEventListener('input', (e) => {
            this.settings.fluctuationRate = parseFloat(e.target.value);
            rateValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        rateContainer.appendChild(rateSlider);
        rateContainer.appendChild(rateValue);
        
        // Particle lifetime slider
        const lifetimeContainer = document.createElement('div');
        lifetimeContainer.style.display = 'flex';
        lifetimeContainer.style.alignItems = 'center';
        lifetimeContainer.style.marginBottom = '10px';
        
        const lifetimeLabel = document.createElement('span');
        lifetimeLabel.className = 'control-label';
        lifetimeLabel.textContent = 'Particle Lifetime: ';
        lifetimeContainer.appendChild(lifetimeLabel);
        
        const lifetimeSlider = document.createElement('input');
        lifetimeSlider.type = 'range';
        lifetimeSlider.min = '500';
        lifetimeSlider.max = '5000';
        lifetimeSlider.step = '500';
        lifetimeSlider.value = this.settings.particleLifetime;
        
        const lifetimeValue = document.createElement('span');
        lifetimeValue.className = 'value-display';
        lifetimeValue.textContent = (this.settings.particleLifetime / 1000) + 's';
        
        lifetimeSlider.addEventListener('input', (e) => {
            this.settings.particleLifetime = parseInt(e.target.value);
            lifetimeValue.textContent = (parseInt(e.target.value) / 1000) + 's';
        });
        
        lifetimeContainer.appendChild(lifetimeSlider);
        lifetimeContainer.appendChild(lifetimeValue);
        
        // Zoom slider
        const zoomContainer = document.createElement('div');
        zoomContainer.style.display = 'flex';
        zoomContainer.style.alignItems = 'center';
        zoomContainer.style.marginBottom = '10px';
        
        const zoomLabel = document.createElement('span');
        zoomLabel.className = 'control-label';
        zoomLabel.textContent = 'Zoom Level: ';
        zoomContainer.appendChild(zoomLabel);
        
        const zoomSlider = document.createElement('input');
        zoomSlider.type = 'range';
        zoomSlider.min = '5';
        zoomSlider.max = '15';
        zoomSlider.step = '1';
        zoomSlider.value = this.camera.position.z;
        
        const zoomValue = document.createElement('span');
        zoomValue.className = 'value-display';
        zoomValue.textContent = this.camera.position.z;
        
        zoomSlider.addEventListener('input', (e) => {
            this.camera.position.z = parseInt(e.target.value);
            zoomValue.textContent = parseInt(e.target.value);
        });
        
        zoomContainer.appendChild(zoomSlider);
        zoomContainer.appendChild(zoomValue);
        
        // Add all controls
        controlsContainer.appendChild(rateContainer);
        controlsContainer.appendChild(lifetimeContainer);
        controlsContainer.appendChild(zoomContainer);
        
        // Add explanation button
        const infoButton = document.createElement('button');
        infoButton.textContent = 'About Vacuum Fluctuations';
        infoButton.addEventListener('click', () => {
            const infoPopup = document.createElement('div');
            infoPopup.className = 'info-popup';
            infoPopup.innerHTML = `
                <button class="close-btn">×</button>
                <h4>Quantum Vacuum Fluctuations</h4>
                <p>In quantum physics, even empty space (the vacuum) is not truly empty. According to the uncertainty principle, temporary particles can appear and disappear spontaneously.</p>
                <p>These "virtual particles" emerge in pairs (particle and antiparticle) from the vacuum's zero-point energy and quickly annihilate each other.</p>
                <p>This phenomenon supports the idea that reality emerges from underlying conditions rather than having inherent existence - similar to how Madhyamaka Buddhism views phenomena as empty of inherent nature.</p>
            `;
            
            document.body.appendChild(infoPopup);
            
            const closeBtn = infoPopup.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(infoPopup);
            });
            
            // Position popup
            const rect = infoButton.getBoundingClientRect();
            infoPopup.style.left = `${rect.left}px`;
            infoPopup.style.top = `${rect.bottom + 10}px`;
        });
        
        controlsContainer.appendChild(infoButton);
        
        return controlsContainer;
    }
    
    destroy() {
        super.destroy();
        
        // Remove labels
        if (this.vacuumLabel && this.vacuumLabel.parentNode) {
            this.vacuumLabel.parentNode.removeChild(this.vacuumLabel);
        }
        
        if (this.zeroPointLabel && this.zeroPointLabel.parentNode) {
            this.zeroPointLabel.parentNode.removeChild(this.zeroPointLabel);
        }
    }
}

// Statistical Laws Animation
export class StatisticalLawsAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        this.settings = { ...animationSettings.statisticalLaws };
        this.events = [];
        this.dataPoints = [];
        
        this.setupScene();
        this.createDecayVisualization();
    }
    
    setupScene() {
        this.camera.position.set(0, 5, 15);
        this.scene.background = new THREE.Color(colorSchemes.primary.background);
        
        // Create graph for statistical display
        this.createGraph();
    }
    
    createGraph() {
        // Create graph container
        this.graph = new THREE.Group();
        this.graph.position.set(6, 6, 0);
        this.scene.add(this.graph);
        this.objects.push(this.graph);
        
        // Graph background
        const graphBgGeometry = new THREE.PlaneGeometry(8, 6);
        const graphBgMaterial = new THREE.MeshBasicMaterial({
            color: 0x1e293b,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const graphBg = new THREE.Mesh(graphBgGeometry, graphBgMaterial);
        this.graph.add(graphBg);
        
        // Graph axes
        const axesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.8,
            transparent: true
        });
        
        // X-axis
        const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-4, -3, 0.01),
            new THREE.Vector3(4, -3, 0.01)
        ]);
        
        const xAxis = new THREE.Line(xAxisGeometry, axesMaterial);
        this.graph.add(xAxis);
        
        // Y-axis
        const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-4, -3, 0.01),
            new THREE.Vector3(-4, 3, 0.01)
        ]);
        
        const yAxis = new THREE.Line(yAxisGeometry, axesMaterial);
        this.graph.add(yAxis);
        
        // Add labels
        const xLabelDiv = document.createElement('div');
        xLabelDiv.className = 'graph-label';
        xLabelDiv.textContent = "Time";
        xLabelDiv.style.position = 'absolute';
        xLabelDiv.style.right = '20%';
        xLabelDiv.style.top = '75%';
        xLabelDiv.style.color = 'white';
        xLabelDiv.style.fontSize = '0.8rem';
        xLabelDiv.style.pointerEvents = 'none';
        document.body.appendChild(xLabelDiv);
        
        const yLabelDiv = document.createElement('div');
        yLabelDiv.className = 'graph-label';
        yLabelDiv.textContent = "Number of Atoms";
        yLabelDiv.style.position = 'absolute';
        yLabelDiv.style.right = '65%';
        yLabelDiv.style.top = '25%';
        yLabelDiv.style.color = 'white';
        yLabelDiv.style.fontSize = '0.8rem';
        yLabelDiv.style.transform = 'rotate(-90deg)';
        yLabelDiv.style.pointerEvents = 'none';
        document.body.appendChild(yLabelDiv);
        
        this.xLabel = xLabelDiv;
        this.yLabel = yLabelDiv;
        
        // Add exponential decay curve
        this.createDecayCurve();
    }
    
    createDecayCurve() {
        // Create theoretical curve for exponential decay
        const curvePoints = [];
        for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const x = -4 + t * 8;
            const y = -3 + 6 * Math.exp(-t * 3);
            curvePoints.push(new THREE.Vector3(x, y, 0.01));
        }
        
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveMaterial = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.5
        });
        
        this.decayCurve = new THREE.Line(curveGeometry, curveMaterial);
        this.graph.add(this.decayCurve);
    }
    
    createDecayVisualization() {
        // Create container for atoms
        this.atomContainer = new THREE.Group();
        this.atomContainer.position.set(-6, 0, 0);
        this.scene.add(this.atomContainer);
        this.objects.push(this.atomContainer);
        
        // Create atoms in a grid
        const atomCount = this.settings.eventCount;
        const gridSize = Math.ceil(Math.sqrt(atomCount));
        const spacing = 0.6;
        
        for (let i = 0; i < atomCount; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            
            const x = (col - gridSize / 2) * spacing;
            const y = (row - gridSize / 2) * spacing;
            
            const atom = this.createAtom();
            atom.position.set(x, y, 0);
            this.atomContainer.add(atom);
            
            this.events.push({
                atom,
                decayed: false,
                timeToDecay: -Math.log(Math.random()) / 0.1, // Exponential distribution
                xPos: x,
                yPos: y
            });
        }
        
        // Create container label
        const containerLabel = document.createElement('div');
        containerLabel.className = 'container-label';
        containerLabel.textContent = "Radioactive Sample";
        containerLabel.style.position = 'absolute';
        containerLabel.style.left = '15%';
        containerLabel.style.top = '10%';
        containerLabel.style.color = 'white';
        containerLabel.style.background = 'rgba(15, 23, 42, 0.7)';
        containerLabel.style.padding = '5px 10px';
        containerLabel.style.borderRadius = '4px';
        containerLabel.style.fontSize = '0.9rem';
        containerLabel.style.pointerEvents = 'none';
        document.body.appendChild(containerLabel);
        
        this.containerLabel = containerLabel;
        
        // Create statistics display
        this.statsDisplay = document.createElement('div');
        this.statsDisplay.className = 'stats-display';
        this.statsDisplay.style.position = 'absolute';
        this.statsDisplay.style.left = '15%';
        this.statsDisplay.style.top = '80%';
        this.statsDisplay.style.color = 'white';
        this.statsDisplay.style.background = 'rgba(15, 23, 42, 0.7)';
        this.statsDisplay.style.padding = '10px';
        this.statsDisplay.style.borderRadius = '5px';
        this.statsDisplay.style.fontSize = '0.9rem';
        this.statsDisplay.style.width = '250px';
        document.body.appendChild(this.statsDisplay);
        
        this.updateStatsDisplay();
    }
    
    createAtom() {
        const atomGroup = new THREE.Group();
        
        // Nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const nucleusMaterial = new THREE.MeshStandardMaterial({
            color: 0xf87171,
            emissive: 0xf87171,
            emissiveIntensity: 0.5
        });
        
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        atomGroup.add(nucleus);
        
        // Electron orbits
        const orbitCount = 3;
        for (let i = 0; i < orbitCount; i++) {
            const orbitGeometry = new THREE.RingGeometry(0.15 + i * 0.05, 0.16 + i * 0.05, 32);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x60a5fa,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            
            // Random orientation
            orbit.rotation.x = Math.random() * Math.PI;
            orbit.rotation.y = Math.random() * Math.PI;
            
            atomGroup.add(orbit);
            
            // Add electron
            const electronGeometry = new THREE.SphereGeometry(0.03, 8, 8);
            const electronMaterial = new THREE.MeshBasicMaterial({
                color: 0x60a5fa
            });
            
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            
            // Position on orbit
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.15 + i * 0.05;
            electron.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            
            // Store initial position and orbit data for animation
            electron.userData = {
                orbitRadius: radius,
                orbitSpeed: 0.5 + Math.random() * 0.5,
                orbitAngle: angle,
                orbitAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize()
            };
            
            atomGroup.add(electron);
        }
        
        return atomGroup;
    }
    
    simulateDecay() {
        this.events.forEach((event, index) => {
            if (!event.decayed) {
                const elapsed = this.clock.getElapsedTime() * this.settings.randomnessFactor;
                
                if (elapsed > event.timeToDecay) {
                    event.decayed = true;
                    
                    // Visual effect for decay
                    const atom = event.atom;
                    const nucleus = atom.children[0];
                    
                    // Flash
                    gsap.to(nucleus.material, {
                        emissiveIntensity: 1.5,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                    
                    // Change color
                    gsap.to(nucleus.material.color, {
                        r: 0.4,
                        g: 0.4,
                        b: 0.4,
                        duration: 0.5
                    });
                    
                    gsap.to(nucleus.material.emissive, {
                        r: 0.4,
                        g: 0.4,
                        b: 0.4,
                        duration: 0.5
                    });
                    
                    // Fade orbits
                    for (let i = 1; i < 4; i++) {
                        if (atom.children[i]) {
                            gsap.to(atom.children[i].material, {
                                opacity: 0.1,
                                duration: 0.5
                            });
                        }
                    }
                    
                    // Create radiation particle
                    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                    const particleMaterial = new THREE.MeshBasicMaterial({
                        color: 0xfacc15,
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                    particle.position.copy(atom.position);
                    this.atomContainer.add(particle);
                    
                    // Random direction
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.05 + Math.random() * 0.05;
                    const dirX = Math.cos(angle) * speed;
                    const dirY = Math.sin(angle) * speed;
                    
                    // Animate particle
                    gsap.to(particle.position, {
                        x: particle.position.x + dirX * 30,
                        y: particle.position.y + dirY * 30,
                        duration: 2,
                        ease: "power1.out"
                    });
                    
                    gsap.to(particle.material, {
                        opacity: 0,
                        duration: 1.5,
                        delay: 0.5,
                        onComplete: () => {
                            this.atomContainer.remove(particle);
                        }
                    });
                    
                    // Add data point to graph
                    this.addDataPoint(elapsed, this.countActiveAtoms());
                    
                    // Update stats
                    this.updateStatsDisplay();
                }
            }
        });
    }
    
    countActiveAtoms() {
        return this.events.filter(event => !event.decayed).length;
    }
    
    addDataPoint(time, count) {
        // Scale to graph coordinates
        const x = -4 + (time / 10) * 8; // Scale time to fit graph
        const y = -3 + (count / this.settings.eventCount) * 6; // Scale count to fit graph
        
        // Don't add if beyond graph bounds
        if (x > 4) return;
        
        // Create point
        const pointGeometry = new THREE.CircleGeometry(0.08, 16);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.8
        });
        
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x, y, 0.02);
        
        this.graph.add(point);
        this.dataPoints.push(point);
    }
    
    updateStatsDisplay() {
        const activeCount = this.countActiveAtoms();
        const totalCount = this.events.length;
        const decayedCount = totalCount - activeCount;
        const decayPercentage = ((decayedCount / totalCount) * 100).toFixed(1);
        
        this.statsDisplay.innerHTML = `
            <div style="font-weight:bold;margin-bottom:5px;color:#10b981;">Decay Statistics:</div>
            <div>Total atoms: ${totalCount}</div>
            <div>Active atoms: ${activeCount}</div>
            <div>Decayed atoms: ${decayedCount}</div>
            <div>Decay percentage: ${decayPercentage}%</div>
            <div style="margin-top:8px;font-size:0.8rem;color:#94a3b8;">
                Each atom follows random decay, but the overall pattern follows predictable statistical laws.
            </div>
        `;
    }
    
    resetSimulation() {
        // Reset all atoms
        this.events.forEach(event => {
            event.decayed = false;
            event.timeToDecay = -Math.log(Math.random()) / 0.1;
            
            // Reset visuals
            const atom = event.atom;
            const nucleus = atom.children[0];
            
            // Reset nucleus color
            gsap.to(nucleus.material.color, {
                r: 0.97,
                g: 0.45,
                b: 0.45,
                duration: 0.5
            });
            
            gsap.to(nucleus.material.emissive, {
                r: 0.97,
                g: 0.45,
                b: 0.45,
                duration: 0.5
            });
            
            gsap.to(nucleus.material, {
                emissiveIntensity: 0.5,
                duration: 0.5
            });
            
            // Reset orbits
            for (let i = 1; i < 4; i++) {
                if (atom.children[i]) {
                    gsap.to(atom.children[i].material, {
                        opacity: 0.5,
                        duration: 0.5
                    });
                }
            }
        });
        
        // Clear data points
        this.dataPoints.forEach(point => {
            this.graph.remove(point);
        });
        this.dataPoints = [];
        
        // Reset timer
        this.clock.start();
        
        // Update stats
        this.updateStatsDisplay();
    }
    
    update() {
        super.update();
        const time = this.clock.getElapsedTime();
        
        // Update atoms
        this.events.forEach(event => {
            const atom = event.atom;
            
            // Animate electrons
            for (let i = 4; i < atom.children.length; i++) {
                const electron = atom.children[i];
                const orbitData = electron.userData;
                
                // Add checks for orbitData and orbitAxis before using them
                if (orbitData && orbitData.orbitAxis) {
                    // Create rotation matrix around the custom axis
                    const rotationMatrix = new THREE.Matrix4();
                    const angle = time * orbitData.orbitSpeed + orbitData.orbitAngle;
                    
                    rotationMatrix.makeRotationAxis(orbitData.orbitAxis, angle);
                    
                    // Apply to base position (along x-axis)
                    const basePosition = new THREE.Vector3(orbitData.orbitRadius, 0, 0);
                    basePosition.applyMatrix4(rotationMatrix);
                    
                    electron.position.copy(basePosition);
                }
            }
        });
        
        // Simulate decay process
        this.simulateDecay();
    }
    
    generateControls() {
        const controlsContainer = super.generateControls();
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Simulation';
        resetButton.addEventListener('click', () => {
            this.resetSimulation();
        });
        
        // Randomness factor slider
        const randomnessContainer = document.createElement('div');
        randomnessContainer.style.display = 'flex';
        randomnessContainer.style.alignItems = 'center';
        randomnessContainer.style.marginBottom = '10px';
        
        const randomnessLabel = document.createElement('span');
        randomnessLabel.className = 'control-label';
        randomnessLabel.textContent = 'Decay Rate: ';
        randomnessContainer.appendChild(randomnessLabel);
        
        const randomnessSlider = document.createElement('input');
        randomnessSlider.type = 'range';
        randomnessSlider.min = '0.1';
        randomnessSlider.max = '2.0';
        randomnessSlider.step = '0.1';
        randomnessSlider.value = this.settings.randomnessFactor;
        
        const randomnessValue = document.createElement('span');
        randomnessValue.className = 'value-display';
        randomnessValue.textContent = this.settings.randomnessFactor;
        
        randomnessSlider.addEventListener('input', (e) => {
            this.settings.randomnessFactor = parseFloat(e.target.value);
            randomnessValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        randomnessContainer.appendChild(randomnessSlider);
        randomnessContainer.appendChild(randomnessValue);
        
        // Pattern visibility slider
        const patternContainer = document.createElement('div');
        patternContainer.style.display = 'flex';
        patternContainer.style.alignItems = 'center';
        patternContainer.style.marginBottom = '10px';
        
        const patternLabel = document.createElement('span');
        patternLabel.className = 'control-label';
        patternLabel.textContent = 'Pattern Clarity: ';
        patternContainer.appendChild(patternLabel);
        
        const patternSlider = document.createElement('input');
        patternSlider.type = 'range';
        patternSlider.min = '0.1';
        patternSlider.max = '1.0';
        patternSlider.step = '0.1';
        patternSlider.value = this.settings.patternVisibility;
        
        const patternValue = document.createElement('span');
        patternValue.className = 'value-display';
        patternValue.textContent = this.settings.patternVisibility;
        
        patternSlider.addEventListener('input', (e) => {
            this.settings.patternVisibility = parseFloat(e.target.value);
            patternValue.textContent = parseFloat(e.target.value).toFixed(1);
            
            // Update curve visibility
            this.decayCurve.material.opacity = parseFloat(e.target.value) * 0.7;
        });
        
        patternContainer.appendChild(patternSlider);
        patternContainer.appendChild(patternValue);
        
        // Info button
        const infoButton = document.createElement('button');
        infoButton.textContent = 'Statistical Laws & Emptiness';
        infoButton.addEventListener('click', () => {
            const infoPopup = document.createElement('div');
            infoPopup.className = 'info-popup';
            infoPopup.innerHTML = `
                <button class="close-btn">×</button>
                <h4>Statistical Laws & Madhyamaka</h4>
                <p>In quantum physics, individual events (like radioactive decay) appear random, but collectively follow precise statistical patterns.</p>
                <p>This mirrors the Madhyamaka view that phenomena lack inherent existence yet follow dependently arising patterns.</p>
                <p>Just as each atom's decay seems random but creates a predictable exponential curve, suffering arises not from a fixed cause but from conditions - having no inherent nature yet still following causal patterns.</p>
            `;
            
            document.body.appendChild(infoPopup);
            
            const closeBtn = infoPopup.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(infoPopup);
            });
            
            // Position popup
            const rect = infoButton.getBoundingClientRect();
            infoPopup.style.left = `${rect.left}px`;
            infoPopup.style.top = `${rect.bottom + 10}px`;
        });
        
        // Add all controls
        controlsContainer.appendChild(randomnessContainer);
        controlsContainer.appendChild(patternContainer);
        controlsContainer.appendChild(resetButton);
        controlsContainer.appendChild(document.createElement('br'));
        controlsContainer.appendChild(infoButton);
        
        return controlsContainer;
    }
    
    destroy() {
        super.destroy();
        
        // Remove labels
        if (this.containerLabel && this.containerLabel.parentNode) {
            this.containerLabel.parentNode.removeChild(this.containerLabel);
        }
        
        if (this.statsDisplay && this.statsDisplay.parentNode) {
            this.statsDisplay.parentNode.removeChild(this.statsDisplay);
        }
        
        if (this.xLabel && this.xLabel.parentNode) {
            this.xLabel.parentNode.removeChild(this.xLabel);
        }
        
        if (this.yLabel && this.yLabel.parentNode) {
            this.yLabel.parentNode.removeChild(this.yLabel);
        }
    }
}

// Factory function to create the appropriate animation based on type
export function createAnimation(type, container) {
    switch (type) {
        case 'doubleSlit':
            return new DoubleSlitAnimation(container);
        case 'waveCollapse':
            return new WaveCollapseAnimation(container);
        case 'entanglement':
            return new EntanglementAnimation(container);
        case 'manyWorlds':
            return new ManyWorldsAnimation(container);
        case 'eprParadox':
            return new EPRParadoxAnimation(container);
        case 'backAction':
            return new BackActionAnimation(container);
        case 'bellTheorem':
            return new BellTheoremAnimation(container);
        case 'vacuumFluctuations':
            return new VacuumFluctuationsAnimation(container);
        case 'statisticalLaws':
            return new StatisticalLawsAnimation(container);
        default:
            return new DoubleSlitAnimation(container);
    }
}