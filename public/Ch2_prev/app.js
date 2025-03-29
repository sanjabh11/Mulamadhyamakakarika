import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses, animationSettings } from './config.js';
import { gsap } from 'gsap';

class QuantumAnimationApp {
    constructor() {
        try {
        this.currentVerse = 1;
        this.isPaused = false;
        this.clock = new THREE.Clock();
        this.animations = {};
        this.particles = [];
        
        this.initUI();
        this.initThreeJS();
        this.setupAnimations();
        this.loadVerse(this.currentVerse);
        this.animate();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
            console.log("QuantumAnimationApp initialized successfully");
        } catch (error) {
            console.error("Error initializing QuantumAnimationApp:", error);
        }
    }
    
    initUI() {
        try {
        // Populate verse selector
        const verseSelect = document.getElementById('verse-select');
            if (!verseSelect) {
                console.warn("Verse select element not found");
                return;
            }

        verses.forEach(verse => {
            const option = document.createElement('option');
            option.value = verse.id;
            option.textContent = `Verse ${verse.id}: ${verse.text.substring(0, 30)}...`;
            verseSelect.appendChild(option);
        });
        
        // Event listeners
            verseSelect.addEventListener('change', (e) => this.loadVerse(e.target.value));
            
            const resetBtn = document.getElementById('reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', this.resetAnimation.bind(this));
            }
            
            const pauseBtn = document.getElementById('pause-btn');
            if (pauseBtn) {
                pauseBtn.addEventListener('click', this.togglePause.bind(this));
            }
        } catch (error) {
            console.error("Error initializing UI:", error);
        }
    }
    
    initThreeJS() {
        try {
        const container = document.getElementById('animation-container');
            if (!container) {
                console.error("Animation container not found");
                return;
            }
            
        const width = container.clientWidth;
            const height = container.clientHeight || 400; // Set a default height if not available
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(animationSettings.colors.background);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = animationSettings.cameraDistance;
        
        // Renderer setup with error handling for WebGL context creation
        try {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
        } catch (error) {
            console.error('Error creating WebGL context:', error);
            this.handleWebGLError(error);
            return;
        }
        if (!this.renderer.getContext()) {
            this.handleWebGLError(new Error('WebGL context is null'));
            return;
        }
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
            container.innerHTML = ''; // Clear the container before adding the renderer
        container.appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        this.scene.add(directionalLight);
            
            console.log("THREE.js initialized successfully");
        } catch (error) {
            console.error("Error initializing THREE.js:", error);
        }
    }
    
    setupAnimations() {
        // Superposition animation
        this.animations.superposition = {
            init: () => {
                this.clearScene();
                
                // Create wave function
                const waveGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
                const waveMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.wave,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                
                this.wave = new THREE.Mesh(waveGeometry, waveMaterial);
                this.wave.rotation.x = Math.PI / 2;
                this.scene.add(this.wave);
                
                // Create particle
                const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3
                });
                
                this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
                this.scene.add(this.particle);
                
                // Create measurement plane
                const planeGeometry = new THREE.PlaneGeometry(12, 12);
                const planeMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.measurement,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
                
                this.measurementPlane = new THREE.Mesh(planeGeometry, planeMaterial);
                this.measurementPlane.position.z = -6;
                this.measurementPlane.visible = false;
                this.scene.add(this.measurementPlane);
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                // Animate wave
                const vertices = this.wave.geometry.attributes.position;
                const time = this.clock.getElapsedTime();
                
                for (let i = 0; i < vertices.count; i++) {
                    const x = vertices.getX(i);
                    const y = vertices.getY(i);
                    const distance = Math.sqrt(x * x + y * y);
                    
                    // Create wave pattern
                    const z = Math.sin(distance * 0.5 + time * 2) * animationSettings.waveHeight * 0.2;
                    vertices.setZ(i, z);
                }
                
                vertices.needsUpdate = true;
                
                // Animate particle in superposition
                this.particle.position.x = Math.sin(time) * 3;
                this.particle.position.y = Math.cos(time * 1.5) * 2;
                this.particle.position.z = Math.sin(time * 2) * 1.5;
                
                // Occasionally show measurement effect
                if (Math.random() < 0.005) {
                    this.triggerMeasurement();
                }
            }
        };
        
        // Entanglement animation
        this.animations.entanglement = {
            init: () => {
                this.clearScene();
                
                // Create entangled particles
                const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
                const particleMaterial1 = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3
                });
                
                const particleMaterial2 = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.entanglement,
                    emissive: animationSettings.colors.entanglement,
                    emissiveIntensity: 0.3
                });
                
                this.particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
                this.particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);
                
                this.scene.add(this.particle1);
                this.scene.add(this.particle2);
                
                // Create connection line
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.5
                });
                
                const lineGeometry = new THREE.BufferGeometry();
                this.linePositions = new Float32Array(6);
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
                
                this.connectionLine = new THREE.Line(lineGeometry, lineMaterial);
                this.scene.add(this.connectionLine);
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Animate particles with entangled behavior
                this.particle1.position.x = Math.sin(time) * 3;
                this.particle1.position.y = Math.cos(time * 1.5) * 2;
                this.particle1.position.z = Math.sin(time * 0.7) * 1.5;
                
                // Particle 2 moves in complementary way
                this.particle2.position.x = -Math.sin(time) * 3;
                this.particle2.position.y = -Math.cos(time * 1.5) * 2;
                this.particle2.position.z = -Math.sin(time * 0.7) * 1.5;
                
                // Update connection line
                this.linePositions[0] = this.particle1.position.x;
                this.linePositions[1] = this.particle1.position.y;
                this.linePositions[2] = this.particle1.position.z;
                this.linePositions[3] = this.particle2.position.x;
                this.linePositions[4] = this.particle2.position.y;
                this.linePositions[5] = this.particle2.position.z;
                
                this.connectionLine.geometry.attributes.position.needsUpdate = true;
                
                // Pulse effect on the line
                const pulseOpacity = Math.abs(Math.sin(time * 3)) * 0.5 + 0.3;
                this.connectionLine.material.opacity = pulseOpacity;
            }
        };
        
        // Wave Function Collapse animation
        this.animations.waveCollapse = {
            init: () => {
                this.clearScene();
                
                // Create probability cloud
                this.particles = [];
                const particleCount = 100;
                
                for (let i = 0; i < particleCount; i++) {
                    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                    const particleMaterial = new THREE.MeshPhongMaterial({
                        color: animationSettings.colors.particle,
                        transparent: true,
                        opacity: 0.7
                    });
                    
                    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                    
                    // Random position within probability cloud
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    const radius = 2 + Math.random() * 2;
                    
                    particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
                    particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
                    particle.position.z = radius * Math.cos(phi);
                    
                    particle.userData = {
                        theta: theta,
                        phi: phi,
                        radius: radius,
                        speed: 0.5 + Math.random()
                    };
                    
                    this.scene.add(particle);
                    this.particles.push(particle);
                }
                
                // Create central particle (collapsed state)
                const centralGeometry = new THREE.SphereGeometry(0.4, 32, 32);
                const centralMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.measurement,
                    emissive: animationSettings.colors.measurement,
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0
                });
                
                this.centralParticle = new THREE.Mesh(centralGeometry, centralMaterial);
                this.scene.add(this.centralParticle);
                
                // Measurement status
                this.hasMeasured = false;
                this.measurementTime = 0;
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                if (!this.hasMeasured && time > 3 && Math.random() < 0.01) {
                    this.triggerWaveCollapse();
                } else if (!this.hasMeasured) {
                    // Animate probability cloud
                    this.particles.forEach(particle => {
                        const userData = particle.userData;
                        
                        // Update particle position in probability cloud
                        userData.theta += delta * userData.speed * 0.3;
                        
                        particle.position.x = userData.radius * Math.sin(userData.phi) * Math.cos(userData.theta);
                        particle.position.y = userData.radius * Math.sin(userData.phi) * Math.sin(userData.theta);
                        particle.position.z = userData.radius * Math.cos(userData.phi);
                        
                        // Pulse the opacity based on time
                        particle.material.opacity = 0.3 + 0.4 * Math.sin(time * 2 + userData.theta);
                    });
                } else {
                    // After measurement animation
                    const elapsed = time - this.measurementTime;
                    if (elapsed < 2) {
                        // Fade out probability cloud
                        this.particles.forEach(particle => {
                            particle.material.opacity = Math.max(0, 0.7 - elapsed * 0.35);
                        });
                    } else if (elapsed > 5 && Math.random() < 0.005) {
                        // Reset after a while
                        this.resetWaveCollapse();
                    }
                }
            }
        };
        
        // State Evolution animation
        this.animations.stateEvolution = {
            init: () => {
                this.clearScene();
                
                // Create wave function geometry
                const waveGeometry = new THREE.BufferGeometry();
                const wavePoints = 200;
                const positions = new Float32Array(wavePoints * 3);
                
                for (let i = 0; i < wavePoints; i++) {
                    const x = (i / wavePoints) * 20 - 10;
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = 0;
                    positions[i * 3 + 2] = 0;
                }
                
                waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const waveMaterial = new THREE.LineBasicMaterial({
                    color: animationSettings.colors.wave,
                    linewidth: 2
                });
                
                this.waveLine = new THREE.Line(waveGeometry, waveMaterial);
                this.scene.add(this.waveLine);
                
                // Particle system to represent probability density
                const particleGeometry = new THREE.BufferGeometry();
                const particlePositions = new Float32Array(100 * 3);
                const particleColors = new Float32Array(100 * 3);
                
                for (let i = 0; i < 100; i++) {
                    const x = Math.random() * 20 - 10;
                    particlePositions[i * 3] = x;
                    particlePositions[i * 3 + 1] = 0;
                    particlePositions[i * 3 + 2] = 0;
                    
                    // Colors
                    particleColors[i * 3] = 0.4;
                    particleColors[i * 3 + 1] = 0.75;
                    particleColors[i * 3 + 2] = 0.75;
                }
                
                particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
                particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
                
                const particleMaterial = new THREE.PointsMaterial({
                    size: 0.15,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.7
                });
                
                this.particles = new THREE.Points(particleGeometry, particleMaterial);
                this.scene.add(this.particles);
                
                // Add axes for reference
                const axesHelper = new THREE.AxesHelper(5);
                axesHelper.position.y = -3;
                this.scene.add(axesHelper);
                
                // Set camera for better view
                this.camera.position.set(0, 5, 10);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Update wave function
                const positions = this.waveLine.geometry.attributes.position;
                
                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i);
                    
                    // Create evolving wave function
                    const frequency = 0.5 + 0.2 * Math.sin(time * 0.2);
                    const amplitude = 1.5 + Math.sin(time * 0.3) * 0.5;
                    const phaseShift = time * 0.5;
                    
                    // Gaussian envelope
                    const gaussian = Math.exp(-0.1 * x * x);
                    const y = gaussian * amplitude * Math.sin(frequency * x + phaseShift);
                    
                    positions.setY(i, y);
                }
                
                positions.needsUpdate = true;
                
                // Update particles to follow probability density
                const particlePositions = this.particles.geometry.attributes.position;
                
                for (let i = 0; i < particlePositions.count; i++) {
                    const x = particlePositions.getX(i);
                    
                    // Calculate probability at this x position
                    const frequency = 0.5 + 0.2 * Math.sin(time * 0.2);
                    const amplitude = 1.5 + Math.sin(time * 0.3) * 0.5;
                    const phaseShift = time * 0.5;
                    
                    const gaussian = Math.exp(-Math.pow(x / this.wavePacketWidth, 2) / 2);
                    const probabilityAmplitude = gaussian * amplitude * Math.sin(frequency * x + phaseShift);
                    
                    // Probability density is |ψ|²
                    const probabilityDensity = probabilityAmplitude * probabilityAmplitude;
                    
                    // Apply random motion within probability density envelope
                    const y = probabilityDensity * (Math.random() - 0.5) * 2;
                    const z = probabilityDensity * (Math.random() - 0.5) * 2;
                    
                    particlePositions.setY(i, y);
                    particlePositions.setZ(i, z);
                }
                
                particlePositions.needsUpdate = true;
            }
        };
        
        // Observer Effect animation
        this.animations.observerEffect = {
            init: () => {
                this.clearScene();
                
                // Create quantum system
                const systemGeometry = new THREE.TorusGeometry(3, 0.5, 16, 50);
                const systemMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.wave,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                
                this.quantumSystem = new THREE.Mesh(systemGeometry, systemMaterial);
                this.scene.add(this.quantumSystem);
                
                // Create observer (camera representation)
                const observerGeometry = new THREE.ConeGeometry(0.5, 1, 16);
                const observerMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.measurement
                });
                
                this.observer = new THREE.Mesh(observerGeometry, observerMaterial);
                this.observer.position.set(6, 0, 0);
                this.observer.rotation.z = Math.PI / 2;
                this.scene.add(this.observer);
                
                // Create particle
                const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3
                });
                
                this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
                this.scene.add(this.particle);
                
                // Create observation ray
                const rayGeometry = new THREE.BufferGeometry();
                this.rayPositions = new Float32Array(6);
                rayGeometry.setAttribute('position', new THREE.BufferAttribute(this.rayPositions, 3));
                
                const rayMaterial = new THREE.LineBasicMaterial({
                    color: animationSettings.colors.measurement,
                    transparent: true,
                    opacity: 0
                });
                
                this.observationRay = new THREE.Line(rayGeometry, rayMaterial);
                this.scene.add(this.observationRay);
                
                // Observation state
                this.isObserving = false;
                this.observationTime = 0;
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Rotate quantum system
                this.quantumSystem.rotation.x = time * 0.2;
                this.quantumSystem.rotation.y = time * 0.3;
                
                // Move observer around
                this.observer.position.x = 6 * Math.cos(time * 0.5);
                this.observer.position.z = 6 * Math.sin(time * 0.5);
                this.observer.lookAt(0, 0, 0);
                
                if (!this.isObserving) {
                    // Particle in undefined state, moving in probability cloud
                    const theta = time * 0.7;
                    const phi = time * 0.5;
                    const radius = 3;
                    
                    this.particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
                    this.particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
                    this.particle.position.z = radius * Math.cos(phi);
                    
                    // Randomly trigger observation
                    if (Math.random() < 0.005) {
                        this.triggerObservation();
                    }
                } else {
                    // During observation
                    const elapsed = time - this.observationTime;
                    
                    if (elapsed < 2) {
                        // Fade in observation ray
                        this.observationRay.material.opacity = Math.min(1, elapsed * 0.5);
                        
                        // Update ray position
                        this.rayPositions[0] = this.observer.position.x;
                        this.rayPositions[1] = this.observer.position.y;
                        this.rayPositions[2] = this.observer.position.z;
                        this.rayPositions[3] = this.particle.position.x;
                        this.rayPositions[4] = this.particle.position.y;
                        this.rayPositions[5] = this.particle.position.z;
                        
                        this.observationRay.geometry.attributes.position.needsUpdate = true;
                        
                        // Particle "freezes" during observation
                        this.particle.material.emissiveIntensity = 0.3 + elapsed * 0.5;
                    } else if (elapsed > 3) {
                        // End observation
                        this.isObserving = false;
                        this.observationRay.material.opacity = 0;
                        this.particle.material.emissiveIntensity = 0.3;
                    }
                }
            }
        };
        
        // Contextuality animation implementation
        this.animations.contextuality = {
            init: () => {
                this.clearScene();
                
                // Create measurement contexts (represented as planes)
                const contextGeometry = new THREE.PlaneGeometry(8, 8);
                const contextMaterial1 = new THREE.MeshPhongMaterial({
                    color: 0x3a506b,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.3,
                    wireframe: false
                });
                
                const contextMaterial2 = new THREE.MeshPhongMaterial({
                    color: 0x5bc0be,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.3,
                    wireframe: false
                });
                
                this.context1 = new THREE.Mesh(contextGeometry, contextMaterial1);
                this.context1.rotation.x = Math.PI / 2;
                this.context1.position.y = 2;
                
                this.context2 = new THREE.Mesh(contextGeometry, contextMaterial2);
                this.context2.rotation.z = Math.PI / 2;
                this.context2.position.x = -2;
                
                this.scene.add(this.context1);
                this.scene.add(this.context2);
                
                // Create quantum system (particle representing property)
                const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3
                });
                
                this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
                this.scene.add(this.particle);
                
                // Create measurement rays for each context
                const rayGeometry = new THREE.BufferGeometry();
                this.rayPositions1 = new Float32Array(6);
                rayGeometry.setAttribute('position', new THREE.BufferAttribute(this.rayPositions1, 3));
                
                const rayMaterial1 = new THREE.LineBasicMaterial({
                    color: 0x3a506b,
                    transparent: true,
                    opacity: 0
                });
                
                this.measurementRay1 = new THREE.Line(rayGeometry.clone(), rayMaterial1);
                this.scene.add(this.measurementRay1);
                
                const rayGeometry2 = new THREE.BufferGeometry();
                this.rayPositions2 = new Float32Array(6);
                rayGeometry2.setAttribute('position', new THREE.BufferAttribute(this.rayPositions2, 3));
                
                const rayMaterial2 = new THREE.LineBasicMaterial({
                    color: 0x5bc0be,
                    transparent: true,
                    opacity: 0
                });
                
                this.measurementRay2 = new THREE.Line(rayGeometry2, rayMaterial2);
                this.scene.add(this.measurementRay2);
                
                // Create value indicators
                const valueGeometry = new THREE.CircleGeometry(0.3, 32);
                const valueMaterialPlus = new THREE.MeshBasicMaterial({
                    color: 0x6fffe9,
                    side: THREE.DoubleSide
                });
                const valueMaterialMinus = new THREE.MeshBasicMaterial({
                    color: 0xff5e5b,
                    side: THREE.DoubleSide
                });
                
                this.value1Plus = new THREE.Mesh(valueGeometry, valueMaterialPlus);
                this.value1Plus.position.set(0, 4, 0);
                this.value1Plus.rotation.x = Math.PI / 2;
                this.value1Plus.visible = false;
                this.scene.add(this.value1Plus);
                
                this.value1Minus = new THREE.Mesh(valueGeometry, valueMaterialMinus);
                this.value1Minus.position.set(0, 0, 0);
                this.value1Minus.rotation.x = Math.PI / 2;
                this.value1Minus.visible = false;
                this.scene.add(this.value1Minus);
                
                this.value2Plus = new THREE.Mesh(valueGeometry, valueMaterialPlus);
                this.value2Plus.position.set(-4, 0, 0);
                this.value2Plus.rotation.z = Math.PI / 2;
                this.value2Plus.visible = false;
                this.scene.add(this.value2Plus);
                
                this.value2Minus = new THREE.Mesh(valueGeometry, valueMaterialMinus);
                this.value2Minus.position.set(0, 0, 0);
                this.value2Minus.rotation.z = Math.PI / 2;
                this.value2Minus.visible = false;
                this.scene.add(this.value2Minus);
                
                // Measurement state
                this.activeContext = null;
                this.measurementTime = 0;
                this.measuringInterval = 5; // seconds between measurements
                
                // Set camera position
                this.camera.position.set(8, 6, 8);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Rotate contexts slightly
                this.context1.rotation.z = Math.sin(time * 0.2) * 0.1;
                this.context2.rotation.x = Math.sin(time * 0.3) * 0.1;
                
                if (!this.activeContext) {
                    // Particle in superposition, moving in 3D space
                    this.particle.position.x = Math.sin(time * 0.7) * 2;
                    this.particle.position.y = Math.sin(time * 1.1) * 2;
                    this.particle.position.z = Math.cos(time * 0.9) * 2;
                    
                    // Randomly trigger measurement in one context
                    if (time % this.measuringInterval < delta) {
                        // Alternate between contexts
                        this.activeContext = Math.floor(time / this.measuringInterval) % 2 === 0 ? 1 : 2;
                        this.measurementTime = time;
                        
                        // Hide all value indicators
                        this.value1Plus.visible = false;
                        this.value1Minus.visible = false;
                        this.value2Plus.visible = false;
                        this.value2Minus.visible = false;
                    }
                } else {
                    // During measurement in a context
                    const elapsed = time - this.measurementTime;
                    
                    if (elapsed < 2) {
                        if (this.activeContext === 1) {
                            // Measurement in context 1 (horizontal plane)
                            // Particle moves to the plane
                            this.particle.position.x = Math.sin(time * 0.7) * 2;
                            this.particle.position.y = 2; // fixed to context1 plane
                            this.particle.position.z = Math.cos(time * 0.9) * 2;
                            
                            // Show measurement ray
                            this.rayPositions1[0] = this.particle.position.x;
                            this.rayPositions1[1] = 4; // top of context
                            this.rayPositions1[2] = this.particle.position.z;
                            this.rayPositions1[3] = this.particle.position.x;
                            this.rayPositions1[4] = 0; // bottom of context
                            this.rayPositions1[5] = this.particle.position.z;
                            
                            this.measurementRay1.geometry.attributes.position.needsUpdate = true;
                            this.measurementRay1.material.opacity = Math.min(1, elapsed * 2);
                            
                            // At the end of measurement, show result
                            if (elapsed > 1.8) {
                                // Random outcome (plus or minus)
                                const isPlus = Math.random() > 0.5;
                                this.value1Plus.visible = isPlus;
                                this.value1Minus.visible = !isPlus;
                                
                                if (isPlus) {
                                    this.value1Plus.position.set(
                                        this.particle.position.x,
                                        4,
                                        this.particle.position.z
                                    );
                                } else {
                                    this.value1Minus.position.set(
                                        this.particle.position.x,
                                        0,
                                        this.particle.position.z
                                    );
                                }
                            }
                        } else {
                            // Measurement in context 2 (vertical plane)
                            // Particle moves to the plane
                            this.particle.position.x = -2; // fixed to context2 plane
                            this.particle.position.y = Math.sin(time * 1.1) * 2;
                            this.particle.position.z = Math.cos(time * 0.9) * 2;
                            
                            // Show measurement ray
                            this.rayPositions2[0] = -4; // left of context
                            this.rayPositions2[1] = this.particle.position.y;
                            this.rayPositions2[2] = this.particle.position.z;
                            this.rayPositions2[3] = 0; // right of context
                            this.rayPositions2[4] = this.particle.position.y;
                            this.rayPositions2[5] = this.particle.position.z;
                            
                            this.measurementRay2.geometry.attributes.position.needsUpdate = true;
                            this.measurementRay2.material.opacity = Math.min(1, elapsed * 2);
                            
                            // At the end of measurement, show result
                            if (elapsed > 1.8) {
                                // Random outcome (plus or minus)
                                const isPlus = Math.random() > 0.5;
                                this.value2Plus.visible = isPlus;
                                this.value2Minus.visible = !isPlus;
                                
                                if (isPlus) {
                                    this.value2Plus.position.set(
                                        -4,
                                        this.particle.position.y,
                                        this.particle.position.z
                                    );
                                } else {
                                    this.value2Minus.position.set(
                                        0,
                                        this.particle.position.y, 
                                        this.particle.position.z
                                    );
                                }
                            }
                        }
                    } else if (elapsed > 3) {
                        // End measurement
                        this.activeContext = null;
                        this.measurementRay1.material.opacity = 0;
                        this.measurementRay2.material.opacity = 0;
                    }
                }
            }
        };
        
        // Recursion animation implementation
        this.animations.recursion = {
            init: () => {
                this.clearScene();
                
                // Create recursive particle system
                this.particleSystems = [];
                this.particleColors = [
                    new THREE.Color(animationSettings.colors.particle),
                    new THREE.Color(animationSettings.colors.wave),
                    new THREE.Color(animationSettings.colors.entanglement),
                    new THREE.Color(animationSettings.colors.measurement)
                ];
                
                // Create main particle
                const mainGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const mainMaterial = new THREE.MeshPhongMaterial({
                    color: this.particleColors[0],
                    emissive: this.particleColors[0],
                    emissiveIntensity: 0.3
                });
                
                this.mainParticle = new THREE.Mesh(mainGeometry, mainMaterial);
                this.scene.add(this.mainParticle);
                
                // Create recursive levels
                this.createRecursiveLevel(0, this.mainParticle, 3, 1.0);
                
                // Set camera for better view
                this.camera.position.set(8, 8, 8);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
                
                // Track focus particle for zoom effect
                this.focusParticle = this.mainParticle;
                this.zoomLevel = 0;
                this.zoomingIn = false;
                this.zoomStartTime = 0;
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Animate main particle in a figure-8 pattern
                this.mainParticle.position.x = Math.sin(time * 0.5) * 3;
                this.mainParticle.position.y = Math.sin(time * 0.7) * Math.cos(time * 0.5) * 2;
                this.mainParticle.position.z = Math.cos(time * 0.6) * 2;
                
                // Update all particle systems
                this.updateRecursiveParticles(time);
                
                // Occasionally trigger zoom into recursive level
                if (!this.zoomingIn && Math.random() < 0.003) {
                    this.zoomingIn = true;
                    this.zoomStartTime = time;
                    
                    // Find a child particle to focus on
                    if (this.zoomLevel < 3 && this.focusParticle.children.length > 0) {
                        const randomChild = Math.floor(Math.random() * this.focusParticle.children.length);
                        this.focusParticle = this.focusParticle.children[randomChild];
                        this.zoomLevel++;
                    } else {
                        // Reset to main particle if max depth reached
                        this.focusParticle = this.mainParticle;
                        this.zoomLevel = 0;
                    }
                }
                
                // Handle zooming animation
                if (this.zoomingIn) {
                    const zoomDuration = 2.0; // seconds
                    const elapsed = time - this.zoomStartTime;
                    
                    if (elapsed < zoomDuration) {
                        // Calculate camera position interpolating towards focus particle
                        const t = elapsed / zoomDuration;
                        const easedT = t * t * (3 - 2 * t); // Smoothstep easing
                        
                        // Get current camera position and target position
                        const currentPos = this.camera.position.clone();
                        const targetPos = this.focusParticle.position.clone();
                        
                        // Maintain some distance from target
                        const distance = 2 - this.zoomLevel * 0.5;
                        const direction = currentPos.clone().sub(targetPos).normalize();
                        targetPos.add(direction.multiplyScalar(distance));
                        
                        // Interpolate and set camera position
                        this.camera.position.lerpVectors(currentPos, targetPos, easedT * 0.1);
                        this.camera.lookAt(this.focusParticle.position);
                    } else {
                        this.zoomingIn = false;
                    }
                }
            }
        };
        
        // Helper method for recursion animation
        this.createRecursiveLevel = (level, parentParticle, maxLevels, scale) => {
            if (level >= maxLevels) return;
            
            const particleCount = 3 + Math.floor(Math.random() * 2); // 3-4 particles per level
            const orbitRadius = 0.8 * scale;
            
            for (let i = 0; i < particleCount; i++) {
                // Create child particle
                const childGeometry = new THREE.SphereGeometry(0.2 * scale, 16, 16);
                const childMaterial = new THREE.MeshPhongMaterial({
                    color: this.particleColors[level + 1 % this.particleColors.length],
                    emissive: this.particleColors[level + 1 % this.particleColors.length],
                    emissiveIntensity: 0.3
                });
                
                const childParticle = new THREE.Mesh(childGeometry, childMaterial);
                
                // Initial position
                const angle = (i / particleCount) * Math.PI * 2;
                childParticle.position.x = Math.cos(angle) * orbitRadius;
                childParticle.position.y = Math.sin(angle) * orbitRadius;
                
                // Add custom properties for animation
                childParticle.userData = {
                    orbitSpeed: 0.5 + Math.random() * 0.5,
                    orbitRadius: orbitRadius,
                    phaseOffset: Math.random() * Math.PI * 2,
                    yOffset: (Math.random() - 0.5) * 0.5 * scale
                };
                
                // Add to parent
                parentParticle.add(childParticle);
                
                // Recursively create next level
                this.createRecursiveLevel(level + 1, childParticle, maxLevels, scale * 0.6);
            }
        };
        
        // Helper method for updating recursive particles
        this.updateRecursiveParticles = (time) => {
            // Define a function to traverse the hierarchy
            const updateParticle = (particle) => {
                if (particle !== this.mainParticle && particle.userData) {
                    // Update position in orbit around parent
                    const userData = particle.userData;
                    const angle = time * userData.orbitSpeed + userData.phaseOffset;
                    
                    particle.position.x = Math.cos(angle) * userData.orbitRadius;
                    particle.position.y = Math.sin(angle) * userData.orbitRadius + userData.yOffset;
                    
                    // Add slight wobble
                    particle.position.z = Math.sin(time * 2 + userData.phaseOffset) * 0.1;
                }
                
                // Recursively update children
                if (particle.children && particle.children.length > 0) {
                    particle.children.forEach(child => updateParticle(child));
                }
            };
            
            // Start recursive update from main particle's children
            this.mainParticle.children.forEach(child => updateParticle(child));
        };
        
        // Indeterminacy animation implementation
        this.animations.indeterminacy = {
            init: () => {
                this.clearScene();
                
                // Create position measurement apparatus (x-axis)
                const xAxisGeometry = new THREE.BoxGeometry(10, 0.1, 0.1);
                const xAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xff5e5b });
                this.xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial);
                this.xAxis.position.y = -3;
                this.scene.add(this.xAxis);
                
                // Create momentum measurement apparatus (y-axis)
                const yAxisGeometry = new THREE.BoxGeometry(0.1, 10, 0.1);
                const yAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x6fffe9 });
                this.yAxis = new THREE.Mesh(yAxisGeometry, yAxisMaterial);
                this.yAxis.position.x = -3;
                this.scene.add(this.yAxis);
                
                // Create measurement indicators
                const indicatorGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                const xIndicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xff5e5b });
                const yIndicatorMaterial = new THREE.MeshBasicMaterial({ color: 0x6fffe9 });
                
                this.xIndicator = new THREE.Mesh(indicatorGeometry, xIndicatorMaterial);
                this.xIndicator.position.set(0, -3, 0);
                this.xIndicator.visible = false;
                this.scene.add(this.xIndicator);
                
                this.yIndicator = new THREE.Mesh(indicatorGeometry, yIndicatorMaterial);
                this.yIndicator.position.set(-3, 0, 0);
                this.yIndicator.visible = false;
                this.scene.add(this.yIndicator);
                
                // Create quantum particle
                const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3
                });
                
                this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
                this.scene.add(this.particle);
                
                // Create wave packet visualization
                const wavePoints = 50;
                const waveGeometry = new THREE.BufferGeometry();
                this.wavePositions = new Float32Array(wavePoints * 3);
                
                for (let i = 0; i < wavePoints; i++) {
                    this.wavePositions[i * 3] = (i / (wavePoints - 1)) * 6 - 3;
                    this.wavePositions[i * 3 + 1] = 0;
                    this.wavePositions[i * 3 + 2] = 0;
                }
                
                waveGeometry.setAttribute('position', new THREE.BufferAttribute(this.wavePositions, 3));
                
                const waveMaterial = new THREE.LineBasicMaterial({
                    color: animationSettings.colors.wave,
                    transparent: true,
                    opacity: 0.7
                });
                
                this.waveLine = new THREE.Line(waveGeometry, waveMaterial);
                this.scene.add(this.waveLine);
                
                // Create uncertainty areas
                const xUncertaintyGeometry = new THREE.PlaneGeometry(6, 1);
                const xUncertaintyMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff5e5b,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
                
                this.xUncertainty = new THREE.Mesh(xUncertaintyGeometry, xUncertaintyMaterial);
                this.xUncertainty.position.y = -3;
                this.xUncertainty.rotation.x = Math.PI / 2;
                this.scene.add(this.xUncertainty);
                
                const yUncertaintyGeometry = new THREE.PlaneGeometry(1, 6);
                const yUncertaintyMaterial = new THREE.MeshBasicMaterial({
                    color: 0x6fffe9,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
                
                this.yUncertainty = new THREE.Mesh(yUncertaintyGeometry, yUncertaintyMaterial);
                this.yUncertainty.position.x = -3;
                this.yUncertainty.rotation.y = Math.PI / 2;
                this.scene.add(this.yUncertainty);
                
                // Measurement state
                this.activeMeasurement = null;
                this.measurementTime = 0;
                this.wavePacketWidth = 1.0;
                this.wavePacketHeight = 1.0;
                
                // Set camera position
                this.camera.position.set(0, 5, 10);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                if (!this.activeMeasurement) {
                    // Animate the wave packet and particle in indeterminate state
                    const waveSpeed = 0.5;
                    
                    // Position oscillates within uncertainty bound
                    this.particle.position.x = Math.sin(time * waveSpeed) * 2;
                    this.particle.position.y = Math.cos(time * waveSpeed * 1.3) * 2;
                    this.particle.position.z = Math.sin(time * waveSpeed * 0.7) * 0.5;
                    
                    // Update wave packet size (inverse relationship with uncertainty)
                    const pulseRate = 0.2;
                    this.wavePacketWidth = 1.0 + 0.5 * Math.sin(time * pulseRate);
                    this.wavePacketHeight = 1.0 + 0.5 * Math.cos(time * pulseRate);
                    
                    // Update uncertainty visualization
                    this.xUncertainty.scale.x = this.wavePacketWidth * 2;
                    this.xUncertainty.scale.z = 0.2 + (1 / this.wavePacketHeight);
                    
                    this.yUncertainty.scale.y = this.wavePacketHeight * 2;
                    this.yUncertainty.scale.z = 0.2 + (1 / this.wavePacketWidth);
                    
                    // Update wave function visualization
                    const points = this.waveLine.geometry.attributes.position;
                    const pointCount = points.count;
                    
                    for (let i = 0; i < pointCount; i++) {
                        const x = points.getX(i);
                        
                        // Gaussian wave packet
                        const gaussian = Math.exp(-Math.pow(x / this.wavePacketWidth, 2) / 2);
                        const waveY = gaussian * Math.sin(x * 5 - time * 3) * this.wavePacketHeight;
                        
                        points.setY(i, waveY);
                    }
                    
                    points.needsUpdate = true;
                    
                    // Randomly trigger a measurement
                    if (Math.random() < 0.005) {
                        this.activeMeasurement = Math.random() < 0.5 ? 'position' : 'momentum';
                        this.measurementTime = time;
                        
                        // Hide indicators
                        this.xIndicator.visible = false;
                        this.yIndicator.visible = false;
                    }
                } else {
                    // During measurement
                    const elapsed = time - this.measurementTime;
                    
                    if (elapsed < 2) {
                        if (this.activeMeasurement === 'position') {
                            // Position measurement collapses position uncertainty
                            // but increases momentum uncertainty
                            
                            // Fix particle position
                            const measuredX = this.particle.position.x;
                            this.particle.position.x = measuredX;
                            
                            // Particle moves to x-axis for measurement
                            this.particle.position.y = -3 + elapsed * 1.5; // Move toward x-axis
                            
                            // Update uncertainty visualization
                            this.xUncertainty.scale.x = Math.max(0.2, this.wavePacketWidth * 2 * (1 - elapsed / 2));
                            this.xUncertainty.scale.z = 0.2;
                            
                            this.yUncertainty.scale.y = this.wavePacketHeight * 2 * (1 + elapsed);
                            this.yUncertainty.scale.z = 0.2 + (1 / this.wavePacketWidth) * (1 + elapsed);
                            
                            // Show measurement indicator if near completion
                            if (elapsed > 1.7) {
                                this.xIndicator.position.x = measuredX;
                                this.xIndicator.visible = true;
                            }
                        } else {
                            // Momentum measurement collapses momentum uncertainty
                            // but increases position uncertainty
                            
                            // Fix particle momentum (represented by vertical position)
                            const measuredY = this.particle.position.y;
                            this.particle.position.y = measuredY;
                            
                            // Particle moves to y-axis for measurement
                            this.particle.position.x = -3 + elapsed * 1.5; // Move toward y-axis
                            
                            // Update uncertainty visualization
                            this.xUncertainty.scale.x = this.wavePacketWidth * 2 * (1 + elapsed);
                            this.xUncertainty.scale.z = 0.2 + (1 / this.wavePacketHeight) * (1 + elapsed);
                            
                            this.yUncertainty.scale.y = Math.max(0.2, this.wavePacketHeight * 2 * (1 - elapsed / 2));
                            this.yUncertainty.scale.z = 0.2;
                            
                            // Show measurement indicator if near completion
                            if (elapsed > 1.7) {
                                this.yIndicator.position.y = measuredY;
                                this.yIndicator.visible = true;
                            }
                        }
                        
                        // Update wave packet during collapse
                        const points = this.waveLine.geometry.attributes.position;
                        const pointCount = points.count;
                        
                        for (let i = 0; i < pointCount; i++) {
                            const x = points.getX(i);
                            
                            let waveY;
                            if (this.activeMeasurement === 'position') {
                                // Position measurement: wave becomes more localized
                                const packetWidth = Math.max(0.1, this.wavePacketWidth * (1 - elapsed / 3));
                                const gaussian = Math.exp(-Math.pow((x - this.particle.position.x) / packetWidth, 2) / 2);
                                waveY = gaussian * this.wavePacketHeight;
                            } else {
                                // Momentum measurement: wave becomes more spread out
                                const packetWidth = this.wavePacketWidth * (1 + elapsed);
                                const gaussian = Math.exp(-Math.pow(x / packetWidth, 2) / 2);
                                waveY = gaussian * Math.sin(x * 5 - time * 3) * this.wavePacketHeight;
                            }
                            
                            points.setY(i, waveY);
                        }
                        
                        points.needsUpdate = true;
                    } else if (elapsed > 3) {
                        // End measurement and reset
                        this.activeMeasurement = null;
                        this.xIndicator.visible = false;
                        this.yIndicator.visible = false;
                    }
                }
            }
        };
        
        // Time Symmetry animation implementation
        this.animations.timeSymmetry = {
            init: () => {
                this.clearScene();
                
                // Create timeline axis
                const timelineGeometry = new THREE.BoxGeometry(15, 0.05, 0.05);
                const timelineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                this.timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
                this.scene.add(this.timeline);
                
                // Create markers for past, present, future
                const markerGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
                const pastMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0x5bc0be });
                const presentMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const futureMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5e5b });
                
                this.pastMarker = new THREE.Mesh(markerGeometry, pastMarkerMaterial);
                this.pastMarker.position.x = -5;
                this.scene.add(this.pastMarker);
                
                this.presentMarker = new THREE.Mesh(markerGeometry, presentMarkerMaterial);
                this.presentMarker.position.x = 0;
                this.scene.add(this.presentMarker);
                
                this.futureMarker = new THREE.Mesh(markerGeometry, futureMarkerMaterial);
                this.futureMarker.position.x = 5;
                this.scene.add(this.futureMarker);
                
                // Text labels for markers
                // (Note: In Three.js, text would require additional libraries like troika-three-text. 
                // We'll use simple shapes as placeholders)
                
                // Create quantum system (particles)
                const particleGeometry = new THREE.SphereGeometry(0.3, 24, 24);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3
                });
                
                // Create multiple particles that will show time symmetry in quantum evolution
                this.particles = [];
                const particleCount = 50;
                const pathRadius = 3;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = new THREE.Mesh(particleGeometry.clone(), particleMaterial.clone());
                    
                    // Set initial position on a path
                    const angle = (i / particleCount) * Math.PI * 2;
                    particle.position.y = Math.sin(angle) * pathRadius;
                    particle.position.z = Math.cos(angle) * pathRadius;
                    
                    // Random initial x position along timeline
                    particle.position.x = -7 + Math.random() * 14;
                    
                    // Store angle for animation
                    particle.userData = {
                        angle: angle,
                        speed: 0.2 + Math.random() * 0.3,
                        radius: pathRadius * (0.8 + Math.random() * 0.4),
                        phase: Math.random() * Math.PI * 2,
                        direction: 1, // forward in time
                        timeFlipAt: null,
                        flipsRemaining: 1 + Math.floor(Math.random() * 2)
                    };
                    
                    // Scale particle by time position
                    this.updateParticleByTimePosition(particle);
                    
                    this.particles.push(particle);
                    this.scene.add(particle);
                }
                
                // Create trails
                this.trails = [];
                const trailMaterial = new THREE.LineBasicMaterial({
                    color: animationSettings.colors.particle,
                    transparent: true,
                    opacity: 0.3
                });
                
                for (let i = 0; i < particleCount; i++) {
                    const trailGeometry = new THREE.BufferGeometry();
                    const points = [
                        this.particles[i].position.clone(),
                        this.particles[i].position.clone(),
                        this.particles[i].position.clone(),
                        this.particles[i].position.clone(),
                        this.particles[i].position.clone()
                    ];
                    trailGeometry.setFromPoints(points);
                    
                    const trail = new THREE.Line(trailGeometry, trailMaterial.clone());
                    this.trails.push({
                        line: trail,
                        points: points
                    });
                    this.scene.add(trail);
                }
                
                // Create time reversal zone (special event where particles reverse direction)
                const reverseZoneGeometry = new THREE.RingGeometry(0.5, 0.6, 32);
                const reverseZoneMaterial = new THREE.MeshBasicMaterial({
                    color: animationSettings.colors.measurement,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0
                });
                
                this.reverseZone = new THREE.Mesh(reverseZoneGeometry, reverseZoneMaterial);
                this.reverseZone.rotation.x = Math.PI / 2;
                this.scene.add(this.reverseZone);
                
                // Reversal event trackers
                this.nextReverseTime = this.clock.getElapsedTime() + 5;
                this.reversalActive = false;
                this.reversalPosition = new THREE.Vector3(0, 0, 0);
                
                // Set camera position
                this.camera.position.set(0, 6, 10);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Check if we should trigger a time reversal event
                if (time > this.nextReverseTime && !this.reversalActive) {
                    this.reversalActive = true;
                    
                    // Place the reversal zone at a random position
                    this.reversalPosition.set(
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * 5
                    );
                    this.reverseZone.position.copy(this.reversalPosition);
                    
                    // Show the zone
                    gsap.to(this.reverseZone.material, {
                        opacity: 0.8,
                        duration: 0.5
                    });
                    
                    // Schedule next reversal
                    this.nextReverseTime = time + 5 + Math.random() * 5;
                    
                    // Grow the zone
                    gsap.to(this.reverseZone.scale, {
                        x: 5,
                        y: 5,
                        z: 5,
                        duration: 2,
                        ease: "power2.out",
                        onComplete: () => {
                            // Hide the zone
                            gsap.to(this.reverseZone.material, {
                                opacity: 0,
                                duration: 0.5,
                                onComplete: () => {
                                    this.reversalActive = false;
                                    this.reverseZone.scale.set(1, 1, 1);
                                }
                            });
                        }
                    });
                }
                
                // Update all particles
                this.particles.forEach((particle, index) => {
                    const userData = particle.userData;
                    
                    // Check if particle is in reversal zone
                    if (this.reversalActive && 
                        particle.position.distanceTo(this.reversalPosition) < this.reverseZone.scale.x * 0.6 &&
                        userData.flipsRemaining > 0 && 
                        userData.timeFlipAt === null) {
                        
                        // Mark particle for time direction reversal
                        userData.timeFlipAt = time;
                        userData.flipsRemaining--;
                    }
                    
                    // If particle is in time flip transition
                    if (userData.timeFlipAt !== null) {
                        const flipElapsed = time - userData.timeFlipAt;
                        
                        if (flipElapsed < 1.0) {
                            // During flip transition, particle briefly freezes and glows
                            particle.material.emissiveIntensity = 0.3 + flipElapsed;
                            particle.scale.setScalar(1 + flipElapsed * 0.5);
                            
                            // Freeze in same position
                            return;
                        } else {
                            // Flip completed, reverse time direction
                            userData.direction *= -1;
                            userData.timeFlipAt = null;
                            particle.material.emissiveIntensity = 0.3;
                        }
                    }
                    
                    // Move along timeline based on direction
                    particle.position.x += userData.speed * userData.direction * delta * 2;
                    
                    // If particle moves beyond timeline, wraparound
                    if (particle.position.x > 7) {
                        particle.position.x = -7;
                        userData.flipsRemaining = 1 + Math.floor(Math.random() * 2); // Reset flip count
                    } else if (particle.position.x < -7) {
                        particle.position.x = 7;
                        userData.flipsRemaining = 1 + Math.floor(Math.random() * 2); // Reset flip count
                    }
                    
                    // Circular/wave path evolution is the same regardless of time direction
                    userData.angle += userData.speed * delta;
                    particle.position.y = Math.sin(userData.angle) * userData.radius;
                    particle.position.z = Math.cos(userData.angle) * userData.radius;
                    
                    // Update particle appearance based on timeline position
                    this.updateParticleByTimePosition(particle);
                    
                    // Update trail
                    const trail = this.trails[index];
                    trail.points.push(particle.position.clone());
                    if (trail.points.length > 10) {
                        trail.points.shift();
                    }
                    
                    trail.line.geometry.setFromPoints(trail.points);
                    
                    // Update trail transparency based on time direction
                    if (userData.direction > 0) {
                        trail.line.material.color.set(0x5bc0be); // future color
                    } else {
                        trail.line.material.color.set(0xff5e5b); // past color
                    }
                });
            }
        };
        
        // Helper method for timeSymmetry animation
        this.updateParticleByTimePosition = (particle) => {
            // Adjust particle appearance based on position in timeline
            const timePosition = (particle.position.x + 7) / 14; // 0 to 1 from past to future
            
            // Past particles more blue, future particles more red
            particle.material.color.setRGB(
                0.4 + timePosition * 0.6,   // Red increases toward future
                0.4 + 0.2 * Math.sin(timePosition * Math.PI), // Green peaks in present
                0.4 + (1 - timePosition) * 0.6  // Blue increases toward past
            );
            
            // Update particle size based on timeline position (larger in present)
            const sizeScale = 0.7 + 0.6 * (1 - Math.abs(timePosition - 0.5) * 2);
            particle.scale.setScalar(sizeScale);
        };
        
        // Wave-Particle Duality animation implementation
        this.animations.waveParticleDuality = {
            init: () => {
                this.clearScene();
                
                // Create wave representation
                const waveWidth = 12;
                const wavePoints = 120;
                const waveGeometry = new THREE.BufferGeometry();
                this.wavePositions = new Float32Array(wavePoints * 3);
                
                for (let i = 0; i < wavePoints; i++) {
                    this.wavePositions[i * 3] = (i / (wavePoints - 1)) * waveWidth - waveWidth / 2;
                    this.wavePositions[i * 3 + 1] = 0;
                    this.wavePositions[i * 3 + 2] = 0;
                }
                
                waveGeometry.setAttribute('position', new THREE.BufferAttribute(this.wavePositions, 3));
                
                const waveMaterial = new THREE.LineBasicMaterial({
                    color: animationSettings.colors.wave,
                    linewidth: 2
                });
                
                this.waveLine = new THREE.Line(waveGeometry, waveMaterial);
                this.scene.add(this.waveLine);
                
                // Create particle representation
                const particleGeometry = new THREE.SphereGeometry(0.3, 24, 24);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3
                });
                
                // Create multiple particles that move along the wave
                this.particles = [];
                const particleCount = 20;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = new THREE.Mesh(particleGeometry.clone(), particleMaterial.clone());
                    
                    // Distribute particles along the wave
                    const position = (i / particleCount) * waveWidth - waveWidth / 2;
                    particle.position.x = position;
                    
                    // Track particle state
                    particle.userData = {
                        initialPosition: position,
                        waveState: 1.0, // 1.0 = full wave, 0.0 = full particle
                        phase: Math.random() * Math.PI * 2
                    };
                    
                    this.particles.push(particle);
                    this.scene.add(particle);
                }
                
                // Create double slit experiment setup
                const slitWidth = 0.5;
                const slitSpacing = 1.5;
                const wallDepth = 0.2;
                
                // Create wall with slits
                const wallGeometry = new THREE.BoxGeometry(10, 5, wallDepth);
                const wallMaterial = new THREE.MeshPhongMaterial({
                    color: 0x3a506b,
                    transparent: true,
                    opacity: 0.8
                });
                
                // Use BufferGeometry to create a wall with two slits
                const wallVertices = [
                    // Top part
                    -5, 2.5, -wallDepth/2,    5, 2.5, -wallDepth/2,    5, 2.5, wallDepth/2,
                    -5, 2.5, -wallDepth/2,    5, 2.5, wallDepth/2,    -5, 2.5, wallDepth/2,
                    
                    -5, 2.5, -wallDepth/2,    -5, 0.5 + slitSpacing/2, -wallDepth/2,    -5, 0.5 + slitSpacing/2, wallDepth/2,
                    -5, 2.5, -wallDepth/2,    -5, 0.5 + slitSpacing/2, wallDepth/2,    -5, 2.5, wallDepth/2,
                    
                    5, 2.5, -wallDepth/2,    5, 0.5 + slitSpacing/2, -wallDepth/2,    5, 0.5 + slitSpacing/2, wallDepth/2,
                    5, 2.5, -wallDepth/2,    5, 0.5 + slitSpacing/2, wallDepth/2,    5, 2.5, wallDepth/2,
                    
                    -5, 0.5 + slitSpacing/2, -wallDepth/2,    -5 + 5 - slitWidth/2, 0.5 + slitSpacing/2, -wallDepth/2,    -5 + 5 - slitWidth/2, 0.5 + slitSpacing/2, wallDepth/2,
                    -5, 0.5 + slitSpacing/2, -wallDepth/2,    -5 + 5 - slitWidth/2, 0.5 + slitSpacing/2, wallDepth/2,    -5, 0.5 + slitSpacing/2, wallDepth/2,
                    
                    -5 + 5 + slitWidth/2, 0.5 + slitSpacing/2, -wallDepth/2,    5, 0.5 + slitSpacing/2, -wallDepth/2,    5, 0.5 + slitSpacing/2, wallDepth/2,
                    -5 + 5 + slitWidth/2, 0.5 + slitSpacing/2, -wallDepth/2,    5, 0.5 + slitSpacing/2, wallDepth/2,    -5 + 5 + slitWidth/2, 0.5 + slitSpacing/2, wallDepth/2,
                    
                    // Middle part
                    -5, 0.5 + slitSpacing/2, -wallDepth/2,    -5, 0.5 - slitSpacing/2, -wallDepth/2,    -5, 0.5 - slitSpacing/2, wallDepth/2,
                    -5, 0.5 + slitSpacing/2, -wallDepth/2,    -5, 0.5 - slitSpacing/2, wallDepth/2,    -5, 0.5 + slitSpacing/2, wallDepth/2,
                    
                    5, 0.5 + slitSpacing/2, -wallDepth/2,    5, 0.5 - slitSpacing/2, -wallDepth/2,    5, 0.5 - slitSpacing/2, wallDepth/2,
                    5, 0.5 + slitSpacing/2, -wallDepth/2,    5, 0.5 - slitSpacing/2, wallDepth/2,    5, 0.5 + slitSpacing/2, wallDepth/2,
                    
                    -5, 0.5 - slitSpacing/2, -wallDepth/2,    -5 + 5 - slitWidth/2, 0.5 - slitSpacing/2, -wallDepth/2,    -5 + 5 - slitWidth/2, 0.5 - slitSpacing/2, wallDepth/2,
                    -5, 0.5 - slitSpacing/2, -wallDepth/2,    -5 + 5 - slitWidth/2, 0.5 - slitSpacing/2, wallDepth/2,    -5, 0.5 - slitSpacing/2, wallDepth/2,
                    
                    -5 + 5 + slitWidth/2, 0.5 - slitSpacing/2, -wallDepth/2,    5, 0.5 - slitSpacing/2, -wallDepth/2,    5, 0.5 - slitSpacing/2, wallDepth/2,
                    -5 + 5 + slitWidth/2, 0.5 - slitSpacing/2, -wallDepth/2,    5, 0.5 - slitSpacing/2, wallDepth/2,    -5 + 5 + slitWidth/2, 0.5 - slitSpacing/2, wallDepth/2,
                    
                    // Bottom part
                    -5, 0.5 - slitSpacing/2, -wallDepth/2,    -5, -2.5, -wallDepth/2,    -5, -2.5, wallDepth/2,
                    -5, 0.5 - slitSpacing/2, -wallDepth/2,    -5, -2.5, wallDepth/2,    -5, 0.5 - slitSpacing/2, wallDepth/2,
                    
                    5, 0.5 - slitSpacing/2, -wallDepth/2,    5, -2.5, -wallDepth/2,    5, -2.5, wallDepth/2,
                    5, 0.5 - slitSpacing/2, -wallDepth/2,    5, -2.5, wallDepth/2,    5, 0.5 - slitSpacing/2, wallDepth/2,
                    
                    -5, -2.5, -wallDepth/2,    5, -2.5, -wallDepth/2,    5, -2.5, wallDepth/2,
                    -5, -2.5, -wallDepth/2,    5, -2.5, wallDepth/2,    -5, -2.5, wallDepth/2
                ];
                
                const wallGeometryCustom = new THREE.BufferGeometry();
                wallGeometryCustom.setAttribute('position', new THREE.Float32BufferAttribute(wallVertices, 3));
                wallGeometryCustom.computeVertexNormals();
                
                this.wall = new THREE.Mesh(wallGeometryCustom, wallMaterial);
                this.wall.position.z = -3;
                this.scene.add(this.wall);
                
                // Create detector screen
                const screenGeometry = new THREE.PlaneGeometry(10, 5);
                const screenMaterial = new THREE.MeshPhongMaterial({
                    color: 0x000000,
                    emissive: 0x222222,
                    side: THREE.DoubleSide
                });
                
                this.detectorScreen = new THREE.Mesh(screenGeometry, screenMaterial);
                this.detectorScreen.position.z = -6;
                this.scene.add(this.detectorScreen);
                
                // Create interference pattern
                this.detectionPoints = [];
                
                // Create toggle button for wave/particle view
                const toggleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                const toggleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.measurement,
                    emissive: animationSettings.colors.measurement,
                    emissiveIntensity: 0.3
                });
                
                this.observeToggle = new THREE.Mesh(toggleGeometry, toggleMaterial);
                this.observeToggle.position.set(5, 3, 0);
                this.scene.add(this.observeToggle);
                
                // Animation state
                this.experimentStage = 'incoming'; // 'incoming', 'slits', 'screen'
                this.observing = false; // Whether we're observing which slit the particle goes through
                this.nextToggleTime = this.clock.getElapsedTime() + 10;
                this.detectionTimer = 0;
                
                // Set camera position
                this.camera.position.set(0, 0, 12);
                this.camera.lookAt(0, 0, -3);
                this.controls.update();
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Occasionally toggle observation mode
                if (time > this.nextToggleTime) {
                    this.observing = !this.observing;
                    this.nextToggleTime = time + 10;
                    
                    // Visual feedback for observation mode
                    if (this.observing) {
                        gsap.to(this.observeToggle.material, {
                            emissiveIntensity: 0.8,
                            duration: 0.5
                        });
                    } else {
                        gsap.to(this.observeToggle.material, {
                            emissiveIntensity: 0.3,
                            duration: 0.5
                        });
                    }
                    
                    // Clear detection points when changing modes
                    for (const point of this.detectionPoints) {
                        this.scene.remove(point);
                    }
                    this.detectionPoints = [];
                }
                
                // Update wave function visualization
                const points = this.waveLine.geometry.attributes.position;
                const pointCount = points.count;
                const waveAmplitude = this.observing ? 0.3 : 1.0; // Lower amplitude when observing
                
                for (let i = 0; i < pointCount; i++) {
                    const x = points.getX(i);
                    
                    // Wave evolution depends on observation mode
                    let waveY;
                    
                    if (this.observing) {
                        // When observing, more particle-like behavior (less interference)
                        waveY = Math.sin(x * 2 + time * 3) * 0.5 * waveAmplitude;
                    } else {
                        // When not observing, more wave-like behavior (with interference)
                        const wavePart1 = Math.sin(x * 2 + time * 3) * 0.5;
                        const wavePart2 = Math.sin(x * 2 + Math.PI / 2 + time * 3) * 0.5;
                        waveY = (wavePart1 + wavePart2) * waveAmplitude;
                    }
                    
                    points.setY(i, waveY);
                }
                
                points.needsUpdate = true;
                
                // Update particles
                this.particles.forEach(particle => {
                    const userData = particle.userData;
                    
                    // Transition between wave and particle based on observation
                    if (this.observing) {
                        userData.waveState = Math.max(0, userData.waveState - delta * 0.5);
                    } else {
                        userData.waveState = Math.min(1, userData.waveState + delta * 0.5);
                    }
                    
                    // Apply wave state visually
                    particle.material.opacity = 0.3 + 0.7 * (1 - userData.waveState);
                    particle.scale.setScalar(0.7 + 0.3 * (1 - userData.waveState));
                    
                    // Particle motion
                    const particleSpeed = 1.5;
                    const initialX = userData.initialPosition;
                    
                    // Different motion behaviors based on stage
                    if (this.experimentStage === 'incoming') {
                        // Moving toward the slits
                        particle.position.z += particleSpeed * delta;
                        
                        // Calculate wave-based y position
                        if (userData.waveState > 0) {
                            const wavePhase = time * 3 + userData.phase;
                            particle.position.y = Math.sin(wavePhase) * userData.waveState;
                        }
                        
                        // Check if reached the slits
                        if (particle.position.z >= -3) {
                            this.experimentStage = 'slits';
                            
                            // Determine which slit to go through
                            if (this.observing) {
                                // When observing, randomly choose one slit
                                const upperSlit = Math.random() > 0.5;
                                particle.position.y = upperSlit ? 0.5 + slitSpacing/2 : 0.5 - slitSpacing/2;
                            } else {
                                // When not observing, position influenced by wave state
                                const waveInfluence = Math.sin(time + userData.phase) * userData.waveState;
                                particle.position.y = waveInfluence;
                            }
                        }
                    } else if (this.experimentStage === 'slits') {
                        // Moving through the slits to the detector
                        particle.position.z += particleSpeed * delta;
                        
                        if (!this.observing) {
                            // In wave state, y position evolves with interference pattern
                            const distance = particle.position.z - (-3); // Distance from slits
                            const angle = Math.atan2(particle.position.y, distance);
                            
                            // Add wave-like motion
                            const waveContribution = Math.sin(distance * 2 + time * 2) * 0.2 * userData.waveState;
                            particle.position.y += waveContribution * delta;
                        }
                        
                        // Check if reached the detector screen
                        if (particle.position.z >= -6) {
                            this.experimentStage = 'screen';
                            
                            // Record detection point
                            this.recordDetection(particle.position.y);
                            
                            // Reset particle to beginning
                            particle.position.x = userData.initialPosition;
                            particle.position.y = 0;
                            particle.position.z = 0;
                            this.experimentStage = 'incoming';
                        }
                    }
                });
                
                // Fade out old detection points
                this.detectionPoints.forEach(point => {
                    point.material.opacity -= 0.01 * delta;
                    if (point.material.opacity <= 0) {
                        this.scene.remove(point);
                        this.detectionPoints = this.detectionPoints.filter(p => p !== point);
                    }
                });
                
                // Add detection points periodically
                this.detectionTimer += delta;
                if (this.detectionTimer > 0.5) {
                    this.detectionTimer = 0;
                    
                    // Calculate a detection point
                    const y = this.getDetectionPosition();
                    this.recordDetection(y);
                }
            }
        };
        
        // Helper methods for wave-particle duality animation
        this.getDetectionPosition = () => {
            if (this.observing) {
                // With observation - random distribution around two points
                const upperSlit = Math.random() > 0.5;
                return (upperSlit ? 1 : -1) * (0.5 + Math.random() * 0.5);
            } else {
                // Without observation - interference pattern
                // This simulates double-slit interference with multiple maxima/minima
                const maxHeight = 2;
                const slitDistance = 1.5; // same as slitSpacing above
                
                // Create multiple detection probability peaks (interference pattern)
                let position;
                const pattern = Math.random();
                
                if (pattern < 0.2) {
                    position = 0; // Central maximum
                } else if (pattern < 0.35) {
                    position = slitDistance * 0.7; // First maximum above
                } else if (pattern < 0.5) {
                    position = -slitDistance * 0.7; // First maximum below
                } else if (pattern < 0.6) {
                    position = slitDistance * 1.4; // Second maximum above
                } else if (pattern < 0.7) {
                    position = -slitDistance * 1.4; // Second maximum below
                } else {
                    // Random position (low probability regions)
                    position = (Math.random() * 2 - 1) * maxHeight;
                }
                
                // Add some randomness
                position += (Math.random() - 0.5) * 0.3;
                
                return position;
            }
        };
        
        this.recordDetection = (y) => {
            // Create a dot on the detector screen
            const dotGeometry = new THREE.CircleGeometry(0.05, 16);
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: this.observing ? 0xff5e5b : 0x6fffe9,
                transparent: true,
                opacity: 1.0,
                side: THREE.DoubleSide
            });
            
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            dot.position.set(0, y, -5.98); // Just in front of detector screen
            dot.rotation.y = Math.PI / 2; // Face the camera
            
            this.scene.add(dot);
            this.detectionPoints.push(dot);
            
            // Limit total detection points
            if (this.detectionPoints.length > 100) {
                const oldestDot = this.detectionPoints.shift();
                this.scene.remove(oldestDot);
            }
        };
        
        // Complementarity animation implementation
        this.animations.complementarity = {
            init: () => {
                this.clearScene();
                
                // Create measurement apparatuses
                const apparatusGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
                const apparatusMaterial1 = new THREE.MeshPhongMaterial({
                    color: 0xff5e5b,
                    transparent: true,
                    opacity: 0.8
                });
                
                const apparatusMaterial2 = new THREE.MeshPhongMaterial({
                    color: 0x6fffe9,
                    transparent: true,
                    opacity: 0.8
                });
                
                // Position apparatus
                this.apparatus1 = new THREE.Mesh(apparatusGeometry, apparatusMaterial1);
                this.apparatus1.position.set(-3, 0, 0);
                this.scene.add(this.apparatus1);
                
                this.apparatus2 = new THREE.Mesh(apparatusGeometry, apparatusMaterial2);
                this.apparatus2.position.set(3, 0, 0);
                this.apparatus2.rotation.y = Math.PI / 2; // Oriented perpendicular to first
                this.scene.add(this.apparatus2);
                
                // Create labels
                const labelGeometry1 = new THREE.BoxGeometry(1, 0.3, 0.1);
                const labelMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff5e5b });
                this.label1 = new THREE.Mesh(labelGeometry1, labelMaterial1);
                this.label1.position.set(-3, -2, 0);
                this.scene.add(this.label1);
                
                const labelGeometry2 = new THREE.BoxGeometry(1, 0.3, 0.1);
                const labelMaterial2 = new THREE.MeshBasicMaterial({ color: 0x6fffe9 });
                this.label2 = new THREE.Mesh(labelGeometry2, labelMaterial2);
                this.label2.position.set(3, -2, 0);
                this.scene.add(this.label2);
                
                // Create quantum system (both particle and wave)
                const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: animationSettings.colors.particle,
                    emissive: animationSettings.colors.particle,
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.7
                });
                
                this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
                this.scene.add(this.particle);
                
                // Create wave representation (rings around particle)
                const ringCount = 3;
                this.rings = [];
                
                for (let i = 0; i < ringCount; i++) {
                    const ringGeometry = new THREE.RingGeometry(0.5 + i * 0.3, 0.6 + i * 0.3, 32);
                    const ringMaterial = new THREE.MeshBasicMaterial({
                        color: animationSettings.colors.wave,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.3 - i * 0.05
                    });
                    
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.userData = {
                        baseScale: 1.0,
                        pulseFactor: 0.2,
                        pulseSpeed: 1 + i * 0.5
                    };
                    
                    this.rings.push(ring);
                    this.particle.add(ring);
                }
                
                // Create measurement beams
                const beamGeometry1 = new THREE.BoxGeometry(6, 0.1, 0.1);
                const beamMaterial1 = new THREE.MeshBasicMaterial({
                    color: 0xff5e5b,
                    transparent: true,
                    opacity: 0
                });
                
                this.beam1 = new THREE.Mesh(beamGeometry1, beamMaterial1);
                this.beam1.position.copy(this.apparatus1.position);
                this.scene.add(this.beam1);
                
                const beamGeometry2 = new THREE.BoxGeometry(0.1, 0.1, 6);
                const beamMaterial2 = new THREE.MeshBasicMaterial({
                    color: 0x6fffe9,
                    transparent: true,
                    opacity: 0
                });
                
                this.beam2 = new THREE.Mesh(beamGeometry2, beamMaterial2);
                this.beam2.position.copy(this.apparatus2.position);
                this.scene.add(this.beam2);
                
                // Create measurement results
                const resultGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                const resultMaterial1 = new THREE.MeshBasicMaterial({
                    color: 0xff5e5b,
                    transparent: true,
                    opacity: 0
                });
                
                const resultMaterial2 = new THREE.MeshBasicMaterial({
                    color: 0x6fffe9,
                    transparent: true,
                    opacity: 0
                });
                
                this.result1Plus = new THREE.Mesh(resultGeometry, resultMaterial1.clone());
                this.result1Plus.position.set(-1, 1, 0);
                this.scene.add(this.result1Plus);
                
                this.result1Minus = new THREE.Mesh(resultGeometry, resultMaterial1.clone());
                this.result1Minus.position.set(-1, -1, 0);
                this.scene.add(this.result1Minus);
                
                this.result2Plus = new THREE.Mesh(resultGeometry, resultMaterial2.clone());
                this.result2Plus.position.set(1, 0, 1);
                this.scene.add(this.result2Plus);
                
                this.result2Minus = new THREE.Mesh(resultGeometry, resultMaterial2.clone());
                this.result2Minus.position.set(1, 0, -1);
                this.scene.add(this.result2Minus);
                
                // Measurement state
                this.activeMeasurement = null;
                this.measurementTime = 0;
                this.measuringInterval = 7; // seconds between measurements
                this.measurementResult = null;
                this.lastMeasurement = null;
                
                // Set camera position
                this.camera.position.set(0, 5, 10);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
                
                // Info text elements (would be displayed in UI in a real implementation)
                this.infoText = {
                    property1: "Position",
                    property2: "Momentum",
                    state: "Complementary properties cannot be measured simultaneously with precision"
                };
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Update particle position with some drift
                if (!this.activeMeasurement) {
                    // Quantum system in superposition state
                    const drift = 0.01;
                    this.particle.position.x += (Math.random() - 0.5) * drift;
                    this.particle.position.y += (Math.random() - 0.5) * drift;
                    this.particle.position.z += (Math.random() - 0.5) * drift;
                    
                    // Keep within bounds
                    if (Math.abs(this.particle.position.x) > 2) {
                        this.particle.position.x *= 0.95;
                    }
                    if (Math.abs(this.particle.position.y) > 2) {
                        this.particle.position.y *= 0.95;
                    }
                    if (Math.abs(this.particle.position.z) > 2) {
                        this.particle.position.z *= 0.95;
                    }
                    
                    // Update wave rings
                    this.rings.forEach(ring => {
                        const userData = ring.userData;
                        ring.rotation.z = time * 0.2 * userData.pulseSpeed;
                        ring.rotation.x = Math.PI / 2;
                        
                        const pulse = 1 + Math.sin(time * userData.pulseSpeed) * userData.pulseFactor;
                        ring.scale.set(pulse, pulse, 1);
                        
                        // Ensure rings are visible
                        ring.visible = true;
                    });
                    
                    // Start measurement periodically
                    if (time % this.measuringInterval < delta) {
                        // Choose which property to measure (alternating)
                        if (this.lastMeasurement === 'property1') {
                            this.activeMeasurement = 'property2';
                        } else {
                            this.activeMeasurement = 'property1';
                        }
                        
                        this.lastMeasurement = this.activeMeasurement;
                        this.measurementTime = time;
                    }
                } else {
                    // During measurement
                    const elapsed = time - this.measurementTime;
                    
                    if (elapsed < 2) {
                        // Measurement in progress
                        if (this.activeMeasurement === 'property1') {
                            // Position measurement (X direction)
                            
                            // Show measurement beam
                            this.beam1.material.opacity = Math.min(1, elapsed * 2);
                            
                            // Collapse wave function in x direction
                            this.rings.forEach(ring => {
                                ring.scale.x = Math.max(0.2, 1 - elapsed / 2);
                                ring.rotation.x = Math.PI / 2;
                            });
                            
                            // Fix x position during measurement
                            this.particle.position.y *= 0.9; // Gradually center y
                            this.particle.position.z *= 0.9; // Gradually center z
                            
                            // Show result at end of measurement
                            if (elapsed > 1.7 && !this.measurementResult) {
                                this.measurementResult = Math.random() > 0.5 ? 'plus' : 'minus';
                                
                                if (this.measurementResult === 'plus') {
                                    this.result1Plus.material.opacity = 1;
                                    this.particle.position.y = 1; // Move to result position
                                } else {
                                    this.result1Minus.material.opacity = 1;
                                    this.particle.position.y = -1; // Move to result position
                                }
                            }
                        } else {
                            // Momentum measurement (Z direction)
                            
                            // Show measurement beam
                            this.beam2.material.opacity = Math.min(1, elapsed * 2);
                            
                            // Collapse wave function in z direction
                            this.rings.forEach(ring => {
                                ring.scale.z = Math.max(0.2, 1 - elapsed / 2);
                                ring.rotation.z = 0;
                                ring.rotation.x = 0;
                            });
                            
                            // Fix z position during measurement
                            this.particle.position.x *= 0.9; // Gradually center x
                            this.particle.position.y *= 0.9; // Gradually center y
                            
                            // Show result at end of measurement
                            if (elapsed > 1.7 && !this.measurementResult) {
                                this.measurementResult = Math.random() > 0.5 ? 'plus' : 'minus';
                                
                                if (this.measurementResult === 'plus') {
                                    this.result2Plus.material.opacity = 1;
                                    this.particle.position.z = 1; // Move to result position
                                } else {
                                    this.result2Minus.material.opacity = 1;
                                    this.particle.position.z = -1; // Move to result position
                                }
                            }
                        }
                    } else if (elapsed > 3) {
                        // End measurement
                        this.activeMeasurement = null;
                        this.measurementResult = null;
                        
                        // Hide beams
                        this.beam1.material.opacity = 0;
                        this.beam2.material.opacity = 0;
                        
                        // Hide results
                        this.result1Plus.material.opacity = 0;
                        this.result1Minus.material.opacity = 0;
                        this.result2Plus.material.opacity = 0;
                        this.result2Minus.material.opacity = 0;
                        
                        // Update info text (would be displayed in UI)
                        this.infoText.state = `After measuring ${this.activeMeasurement === 'property1' ? 'position' : 'momentum'}, the complementary property becomes uncertain`;
                    }
                }
            }
        };
        
        // Add default for remaining animation type
        const animationTypes = [
            'quantumIdentity'
        ];
        
        // Quantum Identity animation implementation
        this.animations.quantumIdentity = {
            init: () => {
                this.clearScene();
                
                // Create particle system for identical particles
                const particleCount = 30;
                this.particles = [];
                
                // Create two types of particles (representing two types of quantum particles)
                const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                
                const fermionMaterial = new THREE.MeshPhongMaterial({
                    color: 0xff5e5b,
                    emissive: 0xff5e5b,
                    emissiveIntensity: 0.3
                });
                
                const bosonMaterial = new THREE.MeshPhongMaterial({
                    color: 0x6fffe9,
                    emissive: 0x6fffe9,
                    emissiveIntensity: 0.3
                });
                
                // Create areas for each type
                const areaGeometry = new THREE.RingGeometry(3, 3.1, 32);
                const fermionAreaMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff5e5b,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.1
                });
                
                const bosonAreaMaterial = new THREE.MeshBasicMaterial({
                    color: 0x6fffe9,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.1
                });
                
                // Left area for fermions
                this.fermionArea = new THREE.Mesh(areaGeometry, fermionAreaMaterial);
                this.fermionArea.position.set(-3, 0, 0);
                this.fermionArea.rotation.x = Math.PI / 2;
                this.fermionArea.scale.set(1.2, 1.2, 1);
                this.scene.add(this.fermionArea);
                
                // Right area for bosons
                this.bosonArea = new THREE.Mesh(areaGeometry, bosonAreaMaterial);
                this.bosonArea.position.set(3, 0, 0);
                this.bosonArea.rotation.x = Math.PI / 2;
                this.bosonArea.scale.set(1.2, 1.2, 1);
                this.scene.add(this.bosonArea);
                
                // Create labels
                const labelGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.1);
                const fermionLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xff5e5b });
                this.fermionLabel = new THREE.Mesh(labelGeometry, fermionLabelMaterial);
                this.fermionLabel.position.set(-3, -3, 0);
                this.scene.add(this.fermionLabel);
                
                const bosonLabelMaterial = new THREE.MeshBasicMaterial({ color: 0x6fffe9 });
                this.bosonLabel = new THREE.Mesh(labelGeometry, bosonLabelMaterial);
                this.bosonLabel.position.set(3, -3, 0);
                this.scene.add(this.bosonLabel);
                
                // Create fermions (particles that obey Pauli exclusion)
                for (let i = 0; i < particleCount/2; i++) {
                    const particle = new THREE.Mesh(particleGeometry, fermionMaterial.clone());
                    
                    // Random position within fermion area
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 3;
                    
                    particle.position.set(
                        -3 + Math.cos(angle) * radius,
                        Math.random() * 2 - 1,
                        Math.sin(angle) * radius
                    );
                    
                    // Track particle type and state
                    particle.userData = {
                        type: 'fermion',
                        energy: Math.floor(Math.random() * 5), // Discrete energy levels
                        orbitSpeed: 0.2 + Math.random() * 0.5,
                        orbitRadius: radius,
                        orbitAngle: angle,
                        orbitCenter: new THREE.Vector3(-3, 0, 0)
                    };
                    
                    this.particles.push(particle);
                    this.scene.add(particle);
                }
                
                // Create bosons (particles that can occupy same state)
                for (let i = 0; i < particleCount/2; i++) {
                    const particle = new THREE.Mesh(particleGeometry, bosonMaterial.clone());
                    
                    // Random position within boson area
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 3;
                    
                    particle.position.set(
                        3 + Math.cos(angle) * radius,
                        Math.random() * 2 - 1,
                        Math.sin(angle) * radius
                    );
                    
                    // Track particle type and state
                    particle.userData = {
                        type: 'boson',
                        energy: Math.floor(Math.random() * 3), // Fewer energy levels, as they can stack
                        orbitSpeed: 0.2 + Math.random() * 0.5,
                        orbitRadius: radius,
                        orbitAngle: angle,
                        orbitCenter: new THREE.Vector3(3, 0, 0)
                    };
                    
                    this.particles.push(particle);
                    this.scene.add(particle);
                }
                
                // Energy level indicators
                this.fermionLevels = [];
                this.bosonLevels = [];
                
                const levelGeometry = new THREE.PlaneGeometry(2, 0.2);
                const levelMaterial = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                });
                
                // Create fermion energy levels
                for (let i = 0; i < 5; i++) {
                    const level = new THREE.Mesh(levelGeometry, levelMaterial.clone());
                    level.material.color.set(0xff5e5b);
                    level.position.set(-6, -2 + i, 0);
                    level.userData = {
                        energy: i,
                        particles: 0, // Track how many fermions in this level
                        maxParticles: 2 // Maximum 2 fermions per level (spin up/down)
                    };
                    this.fermionLevels.push(level);
                    this.scene.add(level);
                }
                
                // Create boson energy levels
                for (let i = 0; i < 3; i++) {
                    const level = new THREE.Mesh(levelGeometry, levelMaterial.clone());
                    level.material.color.set(0x6fffe9);
                    level.position.set(6, -2 + i, 0);
                    level.userData = {
                        energy: i,
                        particles: 0 // Track how many bosons in this level (unlimited)
                    };
                    this.bosonLevels.push(level);
                    this.scene.add(level);
                }
                
                // Setup simulation parameters
                this.redistribution = false;
                this.redistributionTime = 0;
                this.nextRedistributionTime = this.clock.getElapsedTime() + 5;
                
                // Set camera position
                this.camera.position.set(0, 5, 15);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
            },
            
            update: (delta) => {
                if (this.isPaused) return;
                
                const time = this.clock.getElapsedTime();
                
                // Trigger periodic energy redistribution
                if (time > this.nextRedistributionTime && !this.redistribution) {
                    this.redistribution = true;
                    this.redistributionTime = time;
                    this.nextRedistributionTime = time + 8;
                }
                
                // Update particles
                this.particles.forEach(particle => {
                    const userData = particle.userData;
                    
                    if (this.redistribution) {
                        // During redistribution period, particles seek their energy levels
                        const elapsed = time - this.redistributionTime;
                        
                        if (elapsed < 3) {
                            // Get target position based on energy level
                            let targetY = -2 + userData.energy;
                            
                            // For fermions, enforce Pauli exclusion principle
                            if (userData.type === 'fermion') {
                                const level = this.fermionLevels[userData.energy];
                                
                                // If level is filled, try to move to next level
                                if (level.userData.particles >= level.userData.maxParticles) {
                                    // Find next available level
                                    for (let i = 0; i < this.fermionLevels.length; i++) {
                                        const newLevel = this.fermionLevels[i];
                                        if (newLevel.userData.particles < newLevel.userData.maxParticles) {
                                            userData.energy = i;
                                            targetY = -2 + i;
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            // Move gradually to target height
                            particle.position.y += (targetY - particle.position.y) * delta * 2;
                            
                            // For fermions, spread out horizontally to show exclusion
                            if (userData.type === 'fermion') {
                                const level = this.fermionLevels[userData.energy];
                                const position = level.userData.particles % level.userData.maxParticles;
                                const targetX = -3 + (position - 0.5) * 2;
                                
                                particle.position.x += (targetX - particle.position.x) * delta * 2;
                                
                                // Reset z position to keep particles visible
                                particle.position.z *= 0.9;
                            } else {
                                // For bosons, cluster toward same position to show bunching
                                const targetX = 3;
                                particle.position.x += (targetX - particle.position.x) * delta * 2;
                                
                                // Reset z position
                                particle.position.z *= 0.9;
                            }
                        } else if (elapsed > 6) {
                            // End redistribution
                            this.redistribution = false;
                            
                            // Reset energy level counters
                            this.fermionLevels.forEach(level => {
                                level.userData.particles = 0;
                            });
                            
                            this.bosonLevels.forEach(level => {
                                level.userData.particles = 0;
                            });
                        }
                    } else {
                        // Normal animation - orbit around respective centers
                        userData.orbitAngle += userData.orbitSpeed * delta;
                        
                        particle.position.x = userData.orbitCenter.x + Math.cos(userData.orbitAngle) * userData.orbitRadius;
                        particle.position.z = userData.orbitCenter.z + Math.sin(userData.orbitAngle) * userData.orbitRadius;
                        
                        // Add some vertical oscillation
                        particle.position.y = Math.sin(time * userData.orbitSpeed + userData.orbitAngle) * 0.5;
                    }
                });
                
                // Count particles at each energy level for visualization
                if (this.redistribution) {
                    // Reset counts
                    this.fermionLevels.forEach(level => {
                        level.userData.particles = 0;
                    });
                    
                    this.bosonLevels.forEach(level => {
                        level.userData.particles = 0;
                    });
                    
                    // Count particles
                    this.particles.forEach(particle => {
                        const userData = particle.userData;
                        if (userData.type === 'fermion') {
                            if (userData.energy >= 0 && userData.energy < this.fermionLevels.length) {
                                this.fermionLevels[userData.energy].userData.particles++;
                            }
                        } else {
                            if (userData.energy >= 0 && userData.energy < this.bosonLevels.length) {
                                this.bosonLevels[userData.energy].userData.particles++;
                            }
                        }
                    });
                    
                    // Update energy level visualization
                    this.fermionLevels.forEach(level => {
                        const fill = Math.min(1, level.userData.particles / level.userData.maxParticles);
                        level.scale.x = fill;
                        level.position.x = -6 + (1 - fill);
                    });
                    
                    this.bosonLevels.forEach(level => {
                        const fill = Math.min(2, level.userData.particles / 5); // Scale for visibility
                        level.scale.x = fill;
                        level.position.x = 6 - (1 - fill);
                    });
                }
            }
        };
        
        animationTypes.forEach(type => {
            if (!this.animations[type]) {
                this.animations[type] = this.animations.superposition;
            }
        });
    }
    
    triggerMeasurement() {
        if (this.isPaused) return;
        
        // Show measurement plane
        this.measurementPlane.visible = true;
        
        // Freeze particle position
        const currentPosition = this.particle.position.clone();
        
        // Animation effect
        gsap.to(this.measurementPlane.position, {
            z: currentPosition.z,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                // Flash effect
                gsap.to(this.measurementPlane.material, {
                    opacity: 0.5,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        // Hide plane and reset
                        gsap.to(this.measurementPlane.position, {
                            z: -6,
                            duration: 0.5,
                            delay: 1,
                            onComplete: () => {
                                this.measurementPlane.visible = false;
                            }
                        });
                    }
                });
            }
        });
    }
    
    triggerWaveCollapse() {
        if (this.isPaused || this.hasMeasured) return;
        
        this.hasMeasured = true;
        this.measurementTime = this.clock.getElapsedTime();
        
        // Pick random position for collapsed state
        const randomParticle = this.particles[Math.floor(Math.random() * this.particles.length)];
        const position = randomParticle.position.clone();
        
        // Move central particle to collapsed position
        this.centralParticle.position.copy(position);
        
        // Animate collapse
        gsap.to(this.centralParticle.material, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut"
        });
    }
    
    resetWaveCollapse() {
        this.hasMeasured = false;
        
        // Reset central particle
        gsap.to(this.centralParticle.material, {
            opacity: 0,
            duration: 0.5
        });
        
        // Reset cloud particles
        this.particles.forEach(particle => {
            gsap.to(particle.material, {
                opacity: 0.7,
                duration: 0.5
            });
        });
    }
    
    triggerObservation() {
        if (this.isPaused || this.isObserving) return;
        
        this.isObserving = true;
        this.observationTime = this.clock.getElapsedTime();
    }
    
    loadVerse(verseId) {
        try {
        this.currentVerse = verseId;
            const verse = verses.find(v => v.id === verseId || v.id === Number(verseId) || v.id === `${verseId}`);
            
            if (!verse) {
                console.error(`Verse with ID ${verseId} not found`);
                return;
            }
            
            // Update UI elements with verse data - safely
            const updateElement = (id, property, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element[property] = value;
                }
            };
            
            updateElement('verse-number', 'textContent', verse.id);
            updateElement('verse-content', 'textContent', verse.text);
            updateElement('madhyamaka-concept', 'textContent', verse.madhyamakaConcept);
            updateElement('quantum-parallel', 'textContent', verse.quantumParallel);
            updateElement('analysis-text', 'textContent', verse.analysis);
            
            // Update verse selector safely
            const verseSelect = document.getElementById('verse-select');
            if (verseSelect) {
                verseSelect.value = verse.id;
            }
        
        // Initialize the appropriate animation
        const animationType = verse.animationType;
        if (this.animations[animationType]) {
            this.animations[animationType].init();
            this.currentAnimation = animationType;
        } else {
            // Fallback to superposition if animation not found
            this.animations.superposition.init();
            this.currentAnimation = 'superposition';
            }
            
            console.log(`Loaded verse ${verseId} with animation type: ${this.currentAnimation}`);
        } catch (error) {
            console.error('Error loading verse:', error);
        }
    }
    
    clearScene() {
        // Remove all objects except camera, lights
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        
        // Add back lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        this.scene.add(directionalLight);
    }
    
    resetAnimation() {
        const animationType = verses.find(v => v.id === this.currentVerse).animationType;
        if (this.animations[animationType]) {
            this.animations[animationType].init();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause-btn');
        pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
    
    onWindowResize() {
        const container = document.getElementById('animation-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        // Set up animation loop
        const animateFrame = () => {
            try {
                // Request next frame early to ensure smooth animation even if error occurs
                requestAnimationFrame(animateFrame);
                
                if (!this.scene || !this.camera || !this.renderer) {
                    return; // Skip if not initialized
        }
        
        // Update controls
                if (this.controls) {
        this.controls.update();
                }
                
                // Update active animation
                const delta = this.clock.getDelta();
                if (this.currentAnimation && this.animations[this.currentAnimation]) {
                    this.animations[this.currentAnimation].update(delta);
                }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
            } catch (error) {
                console.error("Error in animation loop:", error);
            }
        };
        
        // Start animation loop
        animateFrame();
    }
    
    handleWebGLError(error) {
        const container = document.getElementById('animation-container');
        container.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        errorDiv.style.color = '#fff';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.fontSize = '1.2rem';
        errorDiv.textContent = 'WebGL is not available on your browser. Please update your browser or graphics drivers and try again.';
        container.appendChild(errorDiv);
    }
}

// Initialize application and make it globally available
window.addEventListener('DOMContentLoaded', () => {
    try {
        window.quantumApp = new QuantumAnimationApp();
        console.log('Quantum Animation App initialized successfully');
    } catch (error) {
        console.error('Error initializing Quantum Animation App:', error);
    }
});

// Export the class for potential module usage
export default QuantumAnimationApp;