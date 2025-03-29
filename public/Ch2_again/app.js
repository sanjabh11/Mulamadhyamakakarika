import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses, animationSettings } from './config.js';
import { gsap } from 'gsap';

class QuantumAnimationApp {
    constructor() {
        this.currentVerse = 1;
        this.isPaused = false;
        this.clock = new THREE.Clock();
        this.animations = {};
        this.particles = [];
        this.isPanelHidden = false;
        this.wasMobileBeforeResize = false;
        
        this.initUI();
        this.initThreeJS();
        this.setupAnimations();
        this.loadVerse(this.currentVerse);
        this.animate();
        this.setupResponsiveControls();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    initUI() {
        // Populate verse selector
        const verseSelect = document.getElementById('verse-select');
        verses.forEach(verse => {
            const option = document.createElement('option');
            option.value = verse.id;
            option.textContent = `Verse ${verse.id}: ${verse.text.substring(0, 30)}...`;
            verseSelect.appendChild(option);
        });
        
        // Event listeners
        verseSelect.addEventListener('change', (e) => this.loadVerse(Number(e.target.value)));
        document.getElementById('reset-btn').addEventListener('click', this.resetAnimation.bind(this));
        document.getElementById('pause-btn').addEventListener('click', this.togglePause.bind(this));
    }
    
    initThreeJS() {
        const container = document.getElementById('animation-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
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
                    
                    const gaussian = Math.exp(-0.1 * x * x);
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
        
        // Add default for other animation types
        const animationTypes = [
            'contextuality', 'recursion', 'indeterminacy', 'timeSymmetry',
            'waveParticleDuality', 'complementarity', 'quantumIdentity'
        ];
        
        animationTypes.forEach(type => {
            if (!this.animations[type]) {
                this.animations[type] = this.animations.superposition;
            }
        });
    }
    
    setupResponsiveControls() {
        const toggleBtn = document.getElementById('toggle-panel-btn');
        const infoPanel = document.querySelector('.info-panel');
        const panelIcon = document.getElementById('panel-icon');
        
        // Initialize panel state based on screen width
        if (window.innerWidth < 768) {
            this.isPanelHidden = true;
            infoPanel.classList.add('hidden');
            panelIcon.textContent = '📋';
        }
        
        toggleBtn.addEventListener('click', () => {
            this.isPanelHidden = !this.isPanelHidden;
            if (this.isPanelHidden) {
                infoPanel.classList.add('hidden');
                panelIcon.textContent = '📋';
            } else {
                infoPanel.classList.remove('hidden');
                panelIcon.textContent = '✖️';
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
        this.currentVerse = verseId;
        const verse = verses.find(v => v.id === verseId);
        
        // Update UI elements with verse data
        document.getElementById('verse-number').textContent = verse.id;
        document.getElementById('verse-content').textContent = verse.text;
        document.getElementById('madhyamaka-concept').textContent = verse.madhyamakaConcept;
        document.getElementById('quantum-parallel').textContent = verse.quantumParallel;
        document.getElementById('analysis-text').textContent = verse.analysis;
        
        // Update verse selector
        document.getElementById('verse-select').value = verse.id;
        
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
        
        // Update panel visibility based on screen size
        const infoPanel = document.querySelector('.info-panel');
        const panelIcon = document.getElementById('panel-icon');
        
        if (window.innerWidth >= 768) {
            this.isPanelHidden = false;
            infoPanel.classList.remove('hidden');
        } else if (!this.wasMobileBeforeResize && window.innerWidth < 768) {
            // Only hide panel on initial resize from desktop to mobile
            this.isPanelHidden = true;
            infoPanel.classList.add('hidden');
            panelIcon.textContent = '📋';
        }
        
        this.wasMobileBeforeResize = window.innerWidth < 768;
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        
        // Update current animation
        if (this.currentAnimation && this.animations[this.currentAnimation]) {
            this.animations[this.currentAnimation].update(delta);
        }
        
        // Update controls
        this.controls.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuantumAnimationApp();
});