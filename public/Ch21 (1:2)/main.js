import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses, settings } from './config.js';
import gsap from 'gsap';

// Main application class
class MadhyamakaQuantumApp {
    constructor() {
        this.currentVerseIndex = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animations = [];
        this.setupScene();
        this.setupEventListeners();
        this.loadVerse(this.currentVerseIndex);
        this.animate();
    }

    setupScene() {
        // Create the scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(settings.backgroundColor);

        // Add fog for depth
        this.scene.fog = new THREE.FogExp2(settings.backgroundColor, 0.02);

        // Create the camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // Create the renderer with post-processing capability
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance" 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('animation-container').appendChild(this.renderer.domElement);

        // Add orbit controls with smoother damping
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.rotateSpeed = 0.7;
        this.controls.zoomSpeed = 0.8;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light with shadows
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);
        
        // Add subtle hemisphere light for better color variation
        const hemiLight = new THREE.HemisphereLight(0x4361ee, 0x080814, 0.3);
        this.scene.add(hemiLight);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupEventListeners() {
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.navigateVerse(-1);
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.navigateVerse(1);
        });

        document.getElementById('toggle-text').addEventListener('click', () => {
            const panel = document.getElementById('text-panel');
            panel.classList.toggle('hide-panel');
            const btn = document.getElementById('toggle-text');
            btn.textContent = panel.classList.contains('hide-panel') ? 'Show Text' : 'Hide Text';
        });

        document.getElementById('toggle-controls').addEventListener('click', () => {
            const controls = document.getElementById('control-panel');
            controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
            const btn = document.getElementById('toggle-controls');
            btn.textContent = controls.style.display === 'none' ? 'Show Controls' : 'Hide Controls';
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.navigateVerse(1);
            if (e.key === 'ArrowLeft') this.navigateVerse(-1);
        });
    }

    navigateVerse(direction) {
        const newIndex = this.currentVerseIndex + direction;
        if (newIndex >= 0 && newIndex < verses.length) {
            this.loadVerse(newIndex);
        }
    }

    loadVerse(index) {
        this.currentVerseIndex = index;
        const verse = verses[index];
        
        // Update verse indicator
        document.getElementById('verse-indicator').textContent = `Verse ${verse.number}/21`;
        
        // Update verse content
        const verseContent = document.getElementById('verse-content');
        verseContent.innerHTML = `
            <div class="section">
                <h2>Verse ${verse.number}</h2>
                <p><em>${verse.text}</em></p>
            </div>
            <div class="section">
                <h3>Madhyamaka Concept</h3>
                <p>${verse.concept}</p>
            </div>
            <div class="section">
                <h3>Quantum Physics Parallel</h3>
                <p>${verse.quantum}</p>
            </div>
            <div class="section">
                <h3>Accessible Explanation</h3>
                <p>${verse.explanation}</p>
            </div>
        `;

        // Update controls
        this.updateControls(verse.controls);
        
        // Clear previous animation
        this.clearScene();
        
        // Load the new animation based on verse number
        this.loadAnimation(verse.number);
    }

    updateControls(controlsConfig) {
        const controlsContainer = document.getElementById('interaction-controls');
        controlsContainer.innerHTML = '';
        
        controlsConfig.forEach(control => {
            if (control.type === 'slider') {
                const sliderContainer = document.createElement('div');
                sliderContainer.className = 'slider-control';
                
                const label = document.createElement('label');
                label.textContent = control.label;
                label.setAttribute('data-value', control.value);
                
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.id = control.id;
                slider.min = control.min;
                slider.max = control.max;
                slider.value = control.value;
                
                sliderContainer.appendChild(label);
                sliderContainer.appendChild(slider);
                controlsContainer.appendChild(sliderContainer);
                
                // Add event listener with visual feedback
                slider.addEventListener('input', (e) => {
                    label.setAttribute('data-value', e.target.value);
                    // Add haptic feedback on mobile if available
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(5);
                    }
                    this.handleControlInput(control.id, e.target.value);
                });
            } else if (control.type === 'button') {
                const button = document.createElement('button');
                button.className = 'button-control';
                button.id = control.id;
                button.textContent = control.label;
                controlsContainer.appendChild(button);
                
                // Add event listener with visual feedback
                button.addEventListener('click', () => {
                    // Create ripple effect
                    const ripple = document.createElement('span');
                    ripple.className = 'ripple';
                    button.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                    
                    // Add haptic feedback on mobile if available
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(10);
                    }
                    
                    this.handleControlInput(control.id);
                });
            }
        });
    }

    handleControlInput(controlId, value) {
        // This will be implemented for each animation
        switch(verses[this.currentVerseIndex].number) {
            case 13:
                this.handleVerse13Controls(controlId, value);
                break;
            case 14:
                this.handleVerse14Controls(controlId, value);
                break;
            case 15:
                this.handleVerse15Controls(controlId, value);
                break;
            case 16:
                this.handleVerse16Controls(controlId, value);
                break;
            case 17:
                this.handleVerse17Controls(controlId, value);
                break;
            case 18:
                this.handleVerse18Controls(controlId, value);
                break;
            case 19:
                this.handleVerse19Controls(controlId, value);
                break;
            case 20:
                this.handleVerse20Controls(controlId, value);
                break;
            case 21:
                this.handleVerse21Controls(controlId, value);
                break;
        }
    }

    clearScene() {
        // Remove all objects except lights and camera
        while(this.scene.children.length > 2) {
            const object = this.scene.children.find(child => 
                !(child instanceof THREE.Light));
            if (object) {
                this.scene.remove(object);
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            } else {
                break;
            }
        }
        
        // Cancel all animations
        this.animations.forEach(animation => {
            if (animation.kill) animation.kill();
        });
        this.animations = [];
    }

    loadAnimation(verseNumber) {
        // Load the appropriate animation based on verse number
        switch(verseNumber) {
            case 13:
                this.loadVerse13Animation();
                break;
            case 14:
                this.loadVerse14Animation();
                break;
            case 15:
                this.loadVerse15Animation();
                break;
            case 16:
                this.loadVerse16Animation();
                break;
            case 17:
                this.loadVerse17Animation();
                break;
            case 18:
                this.loadVerse18Animation();
                break;
            case 19:
                this.loadVerse19Animation();
                break;
            case 20:
                this.loadVerse20Animation();
                break;
            case 21:
                this.loadVerse21Animation();
                break;
        }
    }

    // Verse 13: Quantum field with particle excitations
    loadVerse13Animation() {
        // Create a field surface
        const gridSize = 50;
        const size = 10;
        
        // Create field geometry
        const geometry = new THREE.PlaneGeometry(size, size, gridSize, gridSize);
        const material = new THREE.MeshPhongMaterial({
            color: settings.particleColor,
            wireframe: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        this.fieldMesh = new THREE.Mesh(geometry, material);
        this.fieldMesh.rotation.x = -Math.PI / 2;
        this.scene.add(this.fieldMesh);
        
        // Create particles
        this.particles = [];
        this.particleSystem = new THREE.Group();
        this.scene.add(this.particleSystem);
        
        // Update camera position
        this.camera.position.set(0, 8, 8);
        this.controls.update();
        
        // Initialize wave animation
        this.waveAmplitude = 0.05;
        this.waveFrequency = 0.1;
        this.waveSpeed = 0.02;
        this.time = 0;
        
        // Initialize field animation
        this.animate();
    }
    
    handleVerse13Controls(controlId, value) {
        if (controlId === 'energy-slider') {
            this.waveAmplitude = value / 500; // Scale appropriately
            this.waveFrequency = 0.05 + (value / 1000);
        } else if (controlId === 'create-particle') {
            this.createQuantumParticle();
        }
    }
    
    createQuantumParticle() {
        // Create a particle at a random position on the field
        const x = (Math.random() - 0.5) * 9;
        const z = (Math.random() - 0.5) * 9;
        
        const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: settings.highlightColor,
            emissive: settings.highlightColor,
            emissiveIntensity: 0.5
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(x, 0.5, z);
        
        // Add to scene and particle list
        this.particleSystem.add(particle);
        this.particles.push({
            mesh: particle,
            lifetime: 0,
            maxLifetime: 2 + Math.random() * 3,
            birthScale: 0,
            maxScale: 0.2 + Math.random() * 0.3
        });
        
        // Create a wave ripple
        this.createRipple(x, z);
    }
    
    createRipple(x, z) {
        // Add a temporary ripple effect on the field
        const positions = this.fieldMesh.geometry.attributes.position;
        const center = new THREE.Vector2(x, z);
        
        const ripple = {
            center: center,
            radius: 0,
            maxRadius: 5,
            strength: 0.8,
            speed: 2
        };
        
        const updateRipple = () => {
            ripple.radius += ripple.speed * 0.05;
            
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);
                
                // Original position on the xz plane
                const originalPoint = new THREE.Vector2(x, y);
                const distance = originalPoint.distanceTo(ripple.center);
                
                // Ripple effect - wave that diminishes with distance
                const rippleEffect = Math.sin(distance * 5 - ripple.radius) * 
                                   Math.max(0, 1 - distance / ripple.maxRadius) * 
                                   ripple.strength;
                
                positions.setZ(i, z + rippleEffect);
            }
            
            positions.needsUpdate = true;
            
            if (ripple.radius < ripple.maxRadius) {
                requestAnimationFrame(updateRipple);
            } else {
                // Reset positions to flat surface
                for (let i = 0; i < positions.count; i++) {
                    positions.setZ(i, 0);
                }
                positions.needsUpdate = true;
            }
        };
        
        updateRipple();
    }

    // Verse 14: Electron cloud and measurement
    loadVerse14Animation() {
        // Create atom nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nucleusMaterial = new THREE.MeshPhongMaterial({
            color: 0xf94144,
            emissive: 0xf94144,
            emissiveIntensity: 0.3
        });
        this.nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        this.scene.add(this.nucleus);
        
        // Create electron cloud
        this.electronCloud = new THREE.Group();
        this.scene.add(this.electronCloud);
        
        // Generate cloud particles
        this.cloudParticles = [];
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0x4cc9f0,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 500; i++) {
            const size = 0.05 + Math.random() * 0.05;
            const geometry = new THREE.SphereGeometry(size, 8, 8);
            const particle = new THREE.Mesh(geometry, cloudMaterial);
            
            // Position in a probabilistic cloud
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = 1.5 + Math.random() * 1.5;
            
            particle.position.x = r * Math.sin(phi) * Math.cos(theta);
            particle.position.y = r * Math.sin(phi) * Math.sin(theta);
            particle.position.z = r * Math.cos(phi);
            
            this.electronCloud.add(particle);
            
            // Store original position for animation
            this.cloudParticles.push({
                mesh: particle,
                originalPos: particle.position.clone(),
                speed: 0.01 + Math.random() * 0.02
            });
        }
        
        // Add electron for measurement demonstration
        this.electron = null;
        this.measured = false;
        
        // Position camera
        this.camera.position.set(0, 0, 8);
        this.controls.update();
    }
    
    handleVerse14Controls(controlId) {
        if (controlId === 'measure-electron' && !this.measured) {
            this.measureElectron();
        } else if (controlId === 'reset-electron') {
            this.resetElectronCloud();
        }
    }
    
    measureElectron() {
        this.measured = true;
        
        // Hide cloud particles
        this.cloudParticles.forEach(particle => {
            gsap.to(particle.mesh.material, {
                opacity: 0,
                duration: 0.5
            });
        });
        
        // Create a measured electron at a random position in the cloud
        const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const electronMaterial = new THREE.MeshPhongMaterial({
            color: 0x4cc9f0,
            emissive: 0x4cc9f0,
            emissiveIntensity: 0.5
        });
        
        if (this.electron) this.scene.remove(this.electron);
        
        this.electron = new THREE.Mesh(electronGeometry, electronMaterial);
        
        // Random position within the cloud radius
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 1.5 + Math.random() * 1.5;
        
        this.electron.position.x = r * Math.sin(phi) * Math.cos(theta);
        this.electron.position.y = r * Math.sin(phi) * Math.sin(theta);
        this.electron.position.z = r * Math.cos(phi);
        
        // Add to scene with a "pop" animation
        this.electron.scale.set(0, 0, 0);
        this.scene.add(this.electron);
        
        gsap.to(this.electron.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)"
        });
        
        // Add measurement indicator line
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0
        });
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            this.electron.position
        ]);
        
        this.measurementLine = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.measurementLine);
        
        gsap.to(this.measurementLine.material, {
            opacity: 0.6,
            duration: 0.5
        });
    }
    
    resetElectronCloud() {
        this.measured = false;
        
        // Show cloud particles again
        this.cloudParticles.forEach(particle => {
            gsap.to(particle.mesh.material, {
                opacity: 0.7,
                duration: 0.5
            });
        });
        
        // Remove measured electron
        if (this.electron) {
            gsap.to(this.electron.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.3,
                onComplete: () => {
                    this.scene.remove(this.electron);
                    this.electron = null;
                }
            });
        }
        
        // Remove measurement line
        if (this.measurementLine) {
            gsap.to(this.measurementLine.material, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    this.scene.remove(this.measurementLine);
                    this.measurementLine = null;
                }
            });
        }
    }

    // Verse 15: Time symmetry animation
    loadVerse15Animation() {
        // Create particles system for collision
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
        
        // Initialize particles
        this.timeParticles = [];
        this.timeDirection = 1;
        this.timeSpeed = 0.01;
        
        // Create particles
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: settings.particleColor,
            emissive: settings.particleColor,
            emissiveIntensity: 0.5
        });
        
        // Create two particles that will collide
        const particle1Geo = new THREE.SphereGeometry(0.3, 16, 16);
        const particle1 = new THREE.Mesh(particle1Geo, particleMaterial.clone());
        particle1.position.set(-3, 0, 0);
        this.particleGroup.add(particle1);
        
        const particle2Geo = new THREE.SphereGeometry(0.3, 16, 16);
        const particle2 = new THREE.Mesh(particle2Geo, particleMaterial.clone());
        particle2.position.set(3, 0, 0);
        this.particleGroup.add(particle2);
        
        this.timeParticles.push({
            mesh: particle1,
            velocity: new THREE.Vector3(0.01, 0, 0),
            origPosition: new THREE.Vector3(-3, 0, 0)
        });
        
        this.timeParticles.push({
            mesh: particle2,
            velocity: new THREE.Vector3(-0.01, 0, 0),
            origPosition: new THREE.Vector3(3, 0, 0)
        });
        
        // Create trail particles
        this.trails = [];
        
        // Set initial time state
        this.timeState = 0; // -1: reverse, 0: paused, 1: forward
        
        // Add visual arrow to show time direction
        const arrowHelper = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 2, 0),
            2,
            0x7209b7,
            0.4,
            0.2
        );
        this.timeArrow = arrowHelper;
        this.scene.add(this.timeArrow);
        
        // Position camera
        this.camera.position.set(0, 3, 8);
        this.controls.update();
    }
    
    handleVerse15Controls(controlId, value) {
        if (controlId === 'time-direction') {
            this.timeDirection = value / 50; // Scale to range [-2, 2]
            
            // Update arrow direction
            if (this.timeDirection !== 0) {
                const direction = this.timeDirection > 0 ? 1 : -1;
                this.timeArrow.setDirection(new THREE.Vector3(direction, 0, 0));
                this.timeArrow.setLength(Math.abs(this.timeDirection));
            }
        } else if (controlId === 'toggle-time') {
            this.timeState = (this.timeState + 1) % 3 - 1; // Cycle between -1, 0, 1
            this.timeDirection = this.timeState;
            
            if (this.timeState !== 0) {
                const direction = this.timeState > 0 ? 1 : -1;
                this.timeArrow.setDirection(new THREE.Vector3(direction, 0, 0));
            }
            
            // Update slider
            document.getElementById('time-direction').value = this.timeState * 50;
        }
    }
    
    updateTimeSymmetryAnimation() {
        if (this.timeState === 0) return;
        
        // Update particles based on time direction
        this.timeParticles.forEach(particle => {
            particle.mesh.position.x += particle.velocity.x * this.timeDirection;
            
            // Add trail
            if (Math.random() > 0.7) {
                const trailGeo = new THREE.SphereGeometry(0.05, 8, 8);
                const trailMat = new THREE.MeshBasicMaterial({
                    color: settings.particleColor,
                    transparent: true,
                    opacity: 0.5
                });
                
                const trail = new THREE.Mesh(trailGeo, trailMat);
                trail.position.copy(particle.mesh.position);
                this.particleGroup.add(trail);
                
                this.trails.push({
                    mesh: trail,
                    age: 0,
                    maxAge: 100
                });
            }
        });
        
        // Update trails
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const trail = this.trails[i];
            trail.age++;
            trail.mesh.material.opacity = 0.5 * (1 - trail.age / trail.maxAge);
            
            if (trail.age >= trail.maxAge) {
                this.particleGroup.remove(trail.mesh);
                this.trails.splice(i, 1);
            }
        }
        
        // Check for collision
        const p1 = this.timeParticles[0].mesh.position;
        const p2 = this.timeParticles[1].mesh.position;
        
        if (this.timeDirection > 0 && p1.x > p2.x - 0.6) {
            // Collision in forward time - create explosion
            this.createExplosionParticles(new THREE.Vector3((p1.x + p2.x) / 2, 0, 0));
        } else if (this.timeDirection < 0) {
            // Check if particles need to be reset in reverse time
            if (p1.x < this.timeParticles[0].origPosition.x || 
                p2.x > this.timeParticles[1].origPosition.x) {
                
                // Reset particles to original positions
                this.timeParticles.forEach((particle, i) => {
                    particle.mesh.position.copy(particle.origPosition);
                });
                
                // Clear trails
                this.trails.forEach(trail => {
                    this.particleGroup.remove(trail.mesh);
                });
                this.trails = [];
            }
        }
    }
    
    createExplosionParticles(position) {
        for (let i = 0; i < 20; i++) {
            const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({
                color: settings.highlightColor,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeo, particleMat);
            particle.position.copy(position);
            
            // Random direction
            const direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize();
            
            const speed = 0.03 + Math.random() * 0.03;
            
            this.trails.push({
                mesh: particle,
                velocity: direction.multiplyScalar(speed),
                age: 0,
                maxAge: 100 + Math.random() * 100,
                explosion: true
            });
        }
    }

    // Additional animation methods for verses 16-21
    // These would be implemented similar to the ones above
    // with appropriate physics and visual representations

    loadVerse16Animation() {
        // Create quantum contextuality visualization
        this.axisGroup = new THREE.Group();
        this.scene.add(this.axisGroup);
        
        // Create quantum system (spin)
        const spinGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const spinMaterial = new THREE.MeshPhongMaterial({
            color: settings.particleColor,
            emissive: settings.particleColor,
            emissiveIntensity: 0.3
        });
        
        this.spinParticle = new THREE.Mesh(spinGeometry, spinMaterial);
        this.axisGroup.add(this.spinParticle);
        
        // Create measurement axes
        this.createAxis(new THREE.Vector3(1, 0, 0), 0xff0000, 'X');
        this.createAxis(new THREE.Vector3(0, 1, 0), 0x00ff00, 'Y');
        this.createAxis(new THREE.Vector3(0, 0, 1), 0x0000ff, 'Z');
        
        // Create arrow to represent spin state
        const arrowDir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        this.spinArrow = new THREE.ArrowHelper(
            arrowDir,
            new THREE.Vector3(0, 0, 0),
            1,
            settings.highlightColor,
            0.2,
            0.1
        );
        this.axisGroup.add(this.spinArrow);
        
        // Set initial state
        this.spinState = 'superposition';
        this.measuredAxis = null;
        
        // Position camera
        this.camera.position.set(3, 3, 5);
        this.controls.update();
    }
    
    createAxis(direction, color, label) {
        // Create arrow for axis
        const arrow = new THREE.ArrowHelper(
            direction,
            new THREE.Vector3(0, 0, 0),
            2,
            color,
            0.2,
            0.1
        );
        this.axisGroup.add(arrow);
        
        // Add text label as sprite instead of TextGeometry
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'bold 48px Arial';
        context.fillStyle = `rgb(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255})`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(direction.clone().multiplyScalar(2.2));
        sprite.scale.set(0.5, 0.25, 1);
        this.axisGroup.add(sprite);
    }
    
    handleVerse16Controls(controlId) {
        if (controlId.includes('measure')) {
            const axis = controlId.split('-')[0].toUpperCase();
            this.measureSpin(axis);
        }
    }
    
    measureSpin(axis) {
        this.spinState = 'measured';
        this.measuredAxis = axis;
        
        let direction;
        switch(axis) {
            case 'X':
                direction = new THREE.Vector3(Math.sign(Math.random() - 0.5), 0, 0);
                break;
            case 'Y':
                direction = new THREE.Vector3(0, Math.sign(Math.random() - 0.5), 0);
                break;
            case 'Z':
                direction = new THREE.Vector3(0, 0, Math.sign(Math.random() - 0.5));
                break;
        }
        
        // Animate spin measurement
        gsap.to(this.spinParticle.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        const currentDir = this.spinArrow.direction;
        
        // Create animation for arrow direction change
        gsap.to(currentDir, {
            x: direction.x,
            y: direction.y,
            z: direction.z,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                this.spinArrow.setDirection(currentDir.normalize());
            }
        });
        
        // Change color based on measurement outcome
        const newColor = direction.x > 0 || direction.y > 0 || direction.z > 0 ? 
            0x7209b7 : 0x4361ee;
            
        gsap.to(this.spinParticle.material.color, {
            r: (newColor >> 16 & 255) / 255,
            g: (newColor >> 8 & 255) / 255,
            b: (newColor & 255) / 255,
            duration: 0.5
        });
        
        gsap.to(this.spinParticle.material, {
            emissiveIntensity: 0.6,
            duration: 0.5
        });
    }

    loadVerse17Animation() {
        // Create quantum Zeno effect animation
        this.zenoGroup = new THREE.Group();
        this.scene.add(this.zenoGroup);
        
        // Create base system - a particle that tries to evolve
        const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: settings.particleColor,
            emissive: settings.particleColor,
            emissiveIntensity: 0.3
        });
        
        this.zenoParticle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.zenoGroup.add(this.zenoParticle);
        
        // Create target state visual
        const targetGeometry = new THREE.RingGeometry(1.8, 2, 32);
        const targetMaterial = new THREE.MeshBasicMaterial({
            color: settings.highlightColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        
        this.targetRing = new THREE.Mesh(targetGeometry, targetMaterial);
        this.targetRing.rotation.x = Math.PI / 2;
        this.zenoGroup.add(this.targetRing);
        
        // Create measurement beams
        this.measurementBeams = [];
        
        // Set initial state
        this.observationActive = false;
        this.observationRate = 0;
        this.observationTimer = 0;
        this.evolutionProgress = 0;
        
        // Position camera
        this.camera.position.set(0, 5, 5);
        this.controls.update();
    }
    
    handleVerse17Controls(controlId, value) {
        if (controlId === 'observation-rate') {
            this.observationRate = value / 100; // Scale to [0, 1]
        } else if (controlId === 'toggle-observation') {
            this.observationActive = !this.observationActive;
        }
    }
    
    updateZenoEffect() {
        // Update evolution if observations aren't freezing the system
        if (!this.observationActive || this.observationRate === 0) {
            // Natural evolution toward target state
            this.evolutionProgress = Math.min(1, this.evolutionProgress + 0.004);
            
            // Update particle scale based on evolution
            const scale = 0.5 + this.evolutionProgress * 1.5;
            this.zenoParticle.scale.set(scale, scale, scale);
            
            // Update particle color
            const color = new THREE.Color(settings.particleColor);
            const targetColor = new THREE.Color(settings.highlightColor);
            color.lerp(targetColor, this.evolutionProgress);
            
            this.zenoParticle.material.color.copy(color);
            this.zenoParticle.material.emissive.copy(color);
        } else {
            // Observations reset evolution based on rate
            this.observationTimer += 0.01;
            
            if (this.observationTimer >= (1 - this.observationRate) * 2) {
                // Perform observation - reset evolution progress
                this.createObservationBeam();
                this.evolutionProgress = Math.max(0, this.evolutionProgress - this.observationRate * 0.5);
                
                // Update particle scale
                const scale = 0.5 + this.evolutionProgress * 1.5;
                this.zenoParticle.scale.set(scale, scale, scale);
                
                // Reset color
                const color = new THREE.Color(settings.particleColor);
                const targetColor = new THREE.Color(settings.highlightColor);
                color.lerp(targetColor, this.evolutionProgress);
                
                this.zenoParticle.material.color.copy(color);
                this.zenoParticle.material.emissive.copy(color);
                
                // Reset timer
                this.observationTimer = 0;
            }
        }
        
        // Update measurement beams
        for (let i = this.measurementBeams.length - 1; i >= 0; i--) {
            const beam = this.measurementBeams[i];
            beam.age += 0.02;
            
            if (beam.age >= 1) {
                this.zenoGroup.remove(beam.mesh);
                this.measurementBeams.splice(i, 1);
            } else {
                beam.mesh.material.opacity = 1 - beam.age;
            }
        }
    }
    
    createObservationBeam() {
        // Create a beam that represents measurement
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        
        // Random angle for beam
        const angle = Math.random() * Math.PI * 2;
        beam.position.set(
            Math.sin(angle) * 5,
            5,
            Math.cos(angle) * 5
        );
        
        // Point at the particle
        beam.lookAt(this.zenoParticle.position);
        
        this.zenoGroup.add(beam);
        this.measurementBeams.push({
            mesh: beam,
            age: 0
        });
        
        // Flash effect
        gsap.to(this.zenoParticle.material, {
            emissiveIntensity: 1,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    }

    loadVerse18Animation() {
        // Create uncertainty principle demonstration
        this.uncertaintyGroup = new THREE.Group();
        this.scene.add(this.uncertaintyGroup);
        
        // Create particle
        const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: settings.particleColor,
            emissive: settings.particleColor,
            emissiveIntensity: 0.3
        });
        
        this.uncertaintyParticle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.uncertaintyGroup.add(this.uncertaintyParticle);
        
        // Create position uncertainty visualization
        const posUncertaintyGeo = new THREE.SphereGeometry(1, 32, 16);
        const posUncertaintyMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        
        this.posUncertainty = new THREE.Mesh(posUncertaintyGeo, posUncertaintyMat);
        this.uncertaintyGroup.add(this.posUncertainty);
        
        // Create momentum arrows
        this.momentumArrows = new THREE.Group();
        this.uncertaintyGroup.add(this.momentumArrows);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const dir = new THREE.Vector3(
                Math.cos(angle),
                0,
                Math.sin(angle)
            );
            
            const arrow = new THREE.ArrowHelper(
                dir,
                new THREE.Vector3(0, 0, 0),
                1.5,
                0x00ff00,
                0.1,
                0.05
            );
            
            this.momentumArrows.add(arrow);
        }
        
        // Set initial state
        this.uncertaintyBalance = 0.5; // 0 = all position, 1 = all momentum
        this.measurementType = null;
        
        // Position camera
        this.camera.position.set(0, 4, 5);
        this.controls.update();
    }
    
    handleVerse18Controls(controlId, value) {
        if (controlId === 'uncertainty-balance') {
            this.uncertaintyBalance = value / 100; // Scale to [0, 1]
            this.updateUncertaintyVisualization();
        } else if (controlId === 'measure-position') {
            this.measurePosition();
        } else if (controlId === 'measure-momentum') {
            this.measureMomentum();
        }
    }
    
    updateUncertaintyVisualization() {
        // Update position uncertainty (sphere size)
        const posScale = 0.2 + (1 - this.uncertaintyBalance) * 2;
        this.posUncertainty.scale.set(posScale, posScale, posScale);
        
        // Update position uncertainty opacity
        this.posUncertainty.material.opacity = 0.1 + (1 - this.uncertaintyBalance) * 0.3;
        
        // Update momentum arrows
        const momScale = 0.2 + this.uncertaintyBalance * 2;
        this.momentumArrows.scale.set(momScale, momScale, momScale);
        
        // Update momentum arrows opacity by changing children
        this.momentumArrows.children.forEach(arrow => {
            if (arrow.line) arrow.line.material.opacity = this.uncertaintyBalance * 0.7;
            if (arrow.cone) arrow.cone.material.opacity = this.uncertaintyBalance * 0.7;
        });
    }
    
    measurePosition() {
        // Animate transition to position certainty
        gsap.to(this, {
            uncertaintyBalance: 0,
            duration: 0.5,
            onUpdate: () => this.updateUncertaintyVisualization()
        });
        
        // Flash effect
        gsap.to(this.posUncertainty.material, {
            opacity: 0.8,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        // Set measured state
        this.measurementType = 'position';
    }
    
    measureMomentum() {
        // Animate transition to momentum certainty
        gsap.to(this, {
            uncertaintyBalance: 1,
            duration: 0.5,
            onUpdate: () => this.updateUncertaintyVisualization()
        });
        
        // Flash effect for momentum arrows
        this.momentumArrows.children.forEach(arrow => {
            if (arrow.line) {
                gsap.to(arrow.line.material, {
                    opacity: 1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
            if (arrow.cone) {
                gsap.to(arrow.cone.material, {
                    opacity: 1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
        
        // Set measured state
        this.measurementType = 'momentum';
    }

    loadVerse19Animation() {
        // Create Casimir effect / virtual particles animation
        this.casimirGroup = new THREE.Group();
        this.scene.add(this.casimirGroup);
        
        // Create plates
        const plateGeometry = new THREE.BoxGeometry(5, 0.2, 5);
        const plateMaterial = new THREE.MeshPhongMaterial({
            color: 0x4361ee,
            transparent: true,
            opacity: 0.7
        });
        
        this.topPlate = new THREE.Mesh(plateGeometry, plateMaterial);
        this.bottomPlate = new THREE.Mesh(plateGeometry, plateMaterial);
        
        // Set initial positions
        this.plateDistance = 3;
        this.updatePlatePositions();
        
        this.casimirGroup.add(this.topPlate);
        this.casimirGroup.add(this.bottomPlate);
        
        // Create virtual particles
        this.virtualParticles = [];
        this.virtualParticlesVisible = true;
        this.createVirtualParticles();
        
        // Position camera
        this.camera.position.set(7, 2, 7);
        this.controls.update();
    }
    
    updatePlatePositions() {
        this.topPlate.position.y = this.plateDistance / 2;
        this.bottomPlate.position.y = -this.plateDistance / 2;
    }
    
    createVirtualParticles() {
        // Clear existing particles
        this.virtualParticles.forEach(p => this.casimirGroup.remove(p.mesh));
        this.virtualParticles = [];
        
        // Create new particles based on plate distance
        const particleCount = this.plateDistance < 1 ? 30 : 
                            this.plateDistance < 2 ? 60 : 
                            this.plateDistance < 3 ? 100 : 150;
        
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: settings.highlightColor,
            transparent: true,
            opacity: 0.5,
            visible: this.virtualParticlesVisible
        });
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.05 + Math.random() * 0.1;
            const geometry = new THREE.SphereGeometry(size, 8, 8);
            const particle = new THREE.Mesh(geometry, particleMaterial.clone());
            
            // Position - more concentrated around plates when they're closer
            let y;
            if (Math.random() < 0.4 && this.plateDistance < 2) {
                // Position near plates
                y = (Math.random() - 0.5) * this.plateDistance * 0.9;
            } else {
                // Position anywhere
                y = (Math.random() - 0.5) * 6;
            }
            
            const x = (Math.random() - 0.5) * 6;
            const z = (Math.random() - 0.5) * 6;
            
            particle.position.set(x, y, z);
            
            // Don't place particles inside plates
            if (Math.abs(y) > this.plateDistance / 2 - 0.1 && 
                Math.abs(y) < this.plateDistance / 2 + 0.1) {
                continue;
            }
            
            this.casimirGroup.add(particle);
            
            // Store with animation properties
            this.virtualParticles.push({
                mesh: particle,
                originalY: y,
                speed: 0.01 + Math.random() * 0.02,
                amplitude: 0.1 + Math.random() * 0.2,
                phase: Math.random() * Math.PI * 2
            });
        }
        
        // Create force visualization
        this.updateForceVisualization();
    }
    
    updateForceVisualization() {
        // Remove old arrows if they exist
        if (this.forceArrows) {
            this.forceArrows.forEach(arrow => this.casimirGroup.remove(arrow));
        }
        
        this.forceArrows = [];
        
        // Calculate force strength based on distance
        const forceStrength = this.plateDistance < 1 ? 1 : 
                            this.plateDistance < 2 ? 0.7 : 
                            this.plateDistance < 3 ? 0.4 : 0.1;
        
        if (forceStrength < 0.2) return; // Don't show arrows if force is minimal
        
        // Create arrows pointing from bottom plate to top plate
        for (let i = 0; i < 9; i++) {
            const x = (i % 3 - 1) * 1.5;
            const z = (Math.floor(i / 3) - 1) * 1.5;
            
            const arrowStart = new THREE.Vector3(x, -this.plateDistance / 2 + 0.1, z);
            const arrowDir = new THREE.Vector3(0, 1, 0);
            
            const arrow = new THREE.ArrowHelper(
                arrowDir,
                arrowStart,
                this.plateDistance - 0.2,
                0xff0000,
                0.2 * forceStrength,
                0.1 * forceStrength
            );
            
            this.casimirGroup.add(arrow);
            this.forceArrows.push(arrow);
        }
    }
    
    handleVerse19Controls(controlId, value) {
        if (controlId === 'plate-distance') {
            this.plateDistance = value / 10; // Scale to [1, 10]
            this.updatePlatePositions();
            this.createVirtualParticles();
        } else if (controlId === 'toggle-field') {
            this.virtualParticlesVisible = !this.virtualParticlesVisible;
            this.virtualParticles.forEach(p => {
                p.mesh.visible = this.virtualParticlesVisible;
            });
        }
    }
    
    updateVirtualParticles() {
        const time = performance.now() * 0.001;
        
        this.virtualParticles.forEach(p => {
            // Update position with wave-like motion
            p.mesh.position.y = p.originalY + 
                               Math.sin(time * p.speed + p.phase) * p.amplitude;
            
            // Particles inside plates have attraction effect
            if (Math.abs(p.mesh.position.y) < this.plateDistance / 2) {
                // Make particles between plates move more erratically when plates are close
                if (this.plateDistance < 2) {
                    p.mesh.position.x += (Math.random() - 0.5) * 0.02;
                    p.mesh.position.z += (Math.random() - 0.5) * 0.02;
                    
                    // Keep particles from escaping
                    p.mesh.position.x = Math.max(-2.5, Math.min(2.5, p.mesh.position.x));
                    p.mesh.position.z = Math.max(-2.5, Math.min(2.5, p.mesh.position.z));
                }
                
                // Increase opacity for particles between plates
                p.mesh.material.opacity = 0.7;
            } else {
                // Normal opacity for particles outside
                p.mesh.material.opacity = 0.3;
            }
        });
    }

    loadVerse20Animation() {
        // Create energy conservation animation
        this.conservationGroup = new THREE.Group();
        this.scene.add(this.conservationGroup);
        
        // Create particles for collision
        const particle1Geo = new THREE.SphereGeometry(0.5, 32, 32);
        const particle1Mat = new THREE.MeshPhongMaterial({
            color: 0xff4444,
            emissive: 0xff4444,
            emissiveIntensity: 0.3
        });
        
        const particle2Geo = new THREE.SphereGeometry(0.5, 32, 32);
        const particle2Mat = new THREE.MeshPhongMaterial({
            color: 0x4444ff,
            emissive: 0x4444ff,
            emissiveIntensity: 0.3
        });
        
        this.particle1 = new THREE.Mesh(particle1Geo, particle1Mat);
        this.particle2 = new THREE.Mesh(particle2Geo, particle2Mat);
        
        this.particle1.position.set(-3, 0, 0);
        this.particle2.position.set(3, 0, 0);
        
        this.conservationGroup.add(this.particle1);
        this.conservationGroup.add(this.particle2);
        
        // Create energy bars
        this.createEnergyBars();
        
        // Set initial state
        this.collisionEnergy = 0.5;
        this.collisionPhase = 'ready'; // ready, moving, collided
        this.particle1Velocity = new THREE.Vector3();
        this.particle2Velocity = new THREE.Vector3();
        
        // Position camera
        this.camera.position.set(0, 3, 8);
        this.controls.update();
    }
    
    createEnergyBars() {
        // Create container for energy bars
        this.energyBarsGroup = new THREE.Group();
        this.energyBarsGroup.position.set(0, 3, 0);
        this.conservationGroup.add(this.energyBarsGroup);
        
        // Background for bars
        const barBgGeometry = new THREE.BoxGeometry(6, 0.6, 0.1);
        const barBgMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.5
        });
        
        // Labels
        const createLabel = (text, x) => {
            const div = document.createElement('div');
            div.className = 'energy-label';
            div.textContent = text;
            div.style.position = 'absolute';
            div.style.color = 'white';
            div.style.fontSize = '14px';
            div.style.fontWeight = 'bold';
            div.style.textAlign = 'center';
            div.style.width = '100px';
            
            document.body.appendChild(div);
            
            return div;
        };
        
        // Create energy types
        const types = [
            { name: 'Kinetic', color: 0xff0000 },
            { name: 'Potential', color: 0x00ff00 },
            { name: 'Total', color: 0xffff00 }
        ];
        
        this.energyBars = [];
        
        types.forEach((type, i) => {
            const y = i * 0.8 - 0.8;
            
            // Background bar
            const bgBar = new THREE.Mesh(barBgGeometry, barBgMaterial);
            bgBar.position.set(0, y, 0);
            this.energyBarsGroup.add(bgBar);
            
            // Energy bar
            const barGeometry = new THREE.BoxGeometry(3, 0.4, 0.2);
            const barMaterial = new THREE.MeshBasicMaterial({ color: type.color });
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.set(-1.5, y, 0.1);
            
            // Set origin to left edge for easy scaling
            bar.geometry.translate(1.5, 0, 0);
            
            this.energyBarsGroup.add(bar);
            
            // Store bar reference
            this.energyBars.push({
                type: type.name,
                mesh: bar,
                value: type.name === 'Total' ? 1 : 0.5 // Initial values
            });
            
            // Create label
            const label = createLabel(type.name, i);
            this.energyBars[i].label = label;
        });
        
        // Update bars
        this.updateEnergyBars();
    }
    
    updateEnergyBars() {
        // Calculate positions for labels
        const vector = new THREE.Vector3();
        
        this.energyBars.forEach(bar => {
            bar.mesh.scale.x = bar.value;
            
            // Update label position
            if (bar.label) {
                vector.setFromMatrixPosition(bar.mesh.matrixWorld);
                vector.project(this.camera);
                
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth - 150;
                const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
                
                bar.label.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }
    
    handleVerse20Controls(controlId, value) {
        if (controlId === 'collision-energy') {
            this.collisionEnergy = value / 100; // Scale to [0, 1]
            
            // Update potential energy bar
            const potentialBar = this.energyBars.find(bar => bar.type === 'Potential');
            if (potentialBar) {
                potentialBar.value = this.collisionEnergy;
                this.updateEnergyBars();
            }
        } else if (controlId === 'initiate-collision') {
            this.startCollision();
        }
    }
    
    startCollision() {
        if (this.collisionPhase !== 'ready') return;
        
        this.collisionPhase = 'moving';
        
        // Set velocities based on energy
        const speed = 0.05 + this.collisionEnergy * 0.1;
        this.particle1Velocity.set(speed, 0, 0);
        this.particle2Velocity.set(-speed, 0, 0);
        
        // Update kinetic energy bar
        const kineticBar = this.energyBars.find(bar => bar.type === 'Kinetic');
        if (kineticBar) {
            kineticBar.value = this.collisionEnergy;
            
            // Potential energy becomes 0
            const potentialBar = this.energyBars.find(bar => bar.type === 'Potential');
            if (potentialBar) {
                gsap.to(potentialBar, {
                    value: 0,
                    duration: 0.5,
                    onUpdate: () => this.updateEnergyBars()
                });
            }
            
            this.updateEnergyBars();
        }
    }
    
    updateCollision() {
        if (this.collisionPhase === 'moving') {
            // Update particle positions
            this.particle1.position.add(this.particle1Velocity);
            this.particle2.position.add(this.particle2Velocity);
            
            // Check for collision
            if (this.particle1.position.distanceTo(this.particle2.position) < 1) {
                this.collisionPhase = 'collided';
                
                // Create collision effect
                this.createCollisionEffect();
                
                // Reverse velocities
                this.particle1Velocity.multiplyScalar(-1);
                this.particle2Velocity.multiplyScalar(-1);
                
                // Modify velocities based on energy
                const energyTransfer = 0.2 + this.collisionEnergy * 0.5;
                const p1SpeedChange = 1 - energyTransfer;
                const p2SpeedChange = 1 + energyTransfer;
                
                this.particle1Velocity.multiplyScalar(p1SpeedChange);
                this.particle2Velocity.multiplyScalar(p2SpeedChange);
            }
            
            // Check if particles are far enough to reset
            if (Math.abs(this.particle1.position.x) > 5 || 
                Math.abs(this.particle2.position.x) > 5) {
                
                // Reset positions
                gsap.to(this.particle1.position, {
                    x: -3, y: 0, z: 0,
                    duration: 1
                });
                
                gsap.to(this.particle2.position, {
                    x: 3, y: 0, z: 0,
                    duration: 1,
                    onComplete: () => {
                        this.collisionPhase = 'ready';
                        
                        // Reset energy bars
                        const kineticBar = this.energyBars.find(bar => bar.type === 'Kinetic');
                        const potentialBar = this.energyBars.find(bar => bar.type === 'Potential');
                        
                        if (kineticBar && potentialBar) {
                            gsap.to(kineticBar, {
                                value: 0,
                                duration: 0.5
                            });
                            
                            gsap.to(potentialBar, {
                                value: this.collisionEnergy,
                                duration: 0.5,
                                onUpdate: () => this.updateEnergyBars()
                            });
                        }
                    }
                });
            }
        }
        
        // Update energy bars label positions
        this.updateEnergyBars();
    }
    
    createCollisionEffect() {
        // Create particle explosion effect
        const particleCount = 20 + Math.floor(this.collisionEnergy * 30);
        const collisionPoint = new THREE.Vector3(
            (this.particle1.position.x + this.particle2.position.x) / 2,
            0,
            0
        );
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.05 + Math.random() * 0.1;
            const geometry = new THREE.SphereGeometry(size, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffdd44,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(collisionPoint);
            
            // Random direction
            const direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize();
            
            const speed = 0.05 + Math.random() * 0.1 * this.collisionEnergy;
            const velocity = direction.multiplyScalar(speed);
            
            this.conservationGroup.add(particle);
            
            // Animate particle
            gsap.to(particle.position, {
                x: particle.position.x + velocity.x * 20,
                y: particle.position.y + velocity.y * 20,
                z: particle.position.z + velocity.z * 20,
                duration: 1 + Math.random()
            });
            
            gsap.to(particle.material, {
                opacity: 0,
                duration: 1 + Math.random(),
                onComplete: () => {
                    this.conservationGroup.remove(particle);
                    geometry.dispose();
                    material.dispose();
                }
            });
        }
        
        // Flash effect
        const flash = new THREE.PointLight(0xffff00, 2, 10);
        flash.position.copy(collisionPoint);
        this.conservationGroup.add(flash);
        
        gsap.to(flash, {
            intensity: 0,
            duration: 0.5,
            onComplete: () => {
                this.conservationGroup.remove(flash);
            }
        });
    }

    loadVerse21Animation() {
        // Create emergent time animation
        this.timeGroup = new THREE.Group();
        this.scene.add(this.timeGroup);
        
        // Create quantum state visualization
        this.createQuantumState();
        
        // Set initial state
        this.timeFlowing = false;
        this.observationStrength = 0.5;
        
        // Position camera
        this.camera.position.set(0, 15, 15);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    createQuantumState() {
        // Create 3D lattice of points representing quantum state
        const latticeSize = 10;
        const gridPoints = 15;
        
        this.quantumPoints = new THREE.Group();
        this.timeGroup.add(this.quantumPoints);
        
        // Create points material
        const pointMaterial = new THREE.PointsMaterial({
            color: settings.particleColor,
            size: 0.2,
            transparent: true,
            opacity: 0.7
        });
        
        // Create points in a 3D grid
        const positions = [];
        this.pointsData = [];
        
        for (let x = 0; x < gridPoints; x++) {
            for (let y = 0; y < gridPoints; y++) {
                for (let z = 0; z < gridPoints; z++) {
                    const xPos = (x - gridPoints/2) * latticeSize/gridPoints;
                    const yPos = (y - gridPoints/2) * latticeSize/gridPoints;
                    const zPos = (z - gridPoints/2) * latticeSize/gridPoints;
                    
                    positions.push(xPos, yPos, zPos);
                    
                    // Store point data for animation
                    this.pointsData.push({
                        originalPos: new THREE.Vector3(xPos, yPos, zPos),
                        phase: Math.random() * Math.PI * 2,
                        frequency: 0.2 + Math.random() * 0.8
                    });
                }
            }
        }
        
        // Create buffer geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        // Create points mesh
        this.points = new THREE.Points(geometry, pointMaterial);
        this.quantumPoints.add(this.points);
        
        // Create time axis
        const axisGeometry = new THREE.CylinderGeometry(0.05, 0.05, latticeSize, 8);
        const axisMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        
        this.timeAxis = new THREE.Mesh(axisGeometry, axisMaterial);
        this.timeAxis.rotation.x = Math.PI / 2;
        this.timeAxis.visible = false;
        this.timeGroup.add(this.timeAxis);
        
        // Create time planes
        this.timePlanes = [];
        const planeGeometry = new THREE.PlaneGeometry(latticeSize, latticeSize);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        for (let i = 0; i < 5; i++) {
            const plane = new THREE.Mesh(planeGeometry, planeMaterial.clone());
            plane.visible = false;
            this.timeGroup.add(plane);
            this.timePlanes.push(plane);
        }
    }
    
    handleVerse21Controls(controlId, value) {
        if (controlId === 'start-time') {
            this.timeFlowing = true;
            this.timeAxis.visible = true;
            
            // Show time planes with animation
            this.timePlanes.forEach((plane, i) => {
                plane.visible = true;
                plane.position.z = -5 + i * 2.5;
                plane.material.opacity = 0.2;
            });
        } else if (controlId === 'stop-time') {
            this.timeFlowing = false;
            this.timeAxis.visible = false;
            
            // Hide time planes
            this.timePlanes.forEach(plane => {
                plane.visible = false;
            });
        } else if (controlId === 'observation-strength') {
            this.observationStrength = value / 100; // Scale to [0, 1]
        }
    }
    
    updateEmergingtTime() {
        if (!this.points) return;
        
        const time = performance.now() * 0.001;
        const positions = this.points.geometry.attributes.position.array;
        
        // Update quantum state animation
        for (let i = 0; i < this.pointsData.length; i++) {
            const point = this.pointsData[i];
            const idx = i * 3;
            
            if (this.timeFlowing) {
                // When time is flowing, add wave-like motion
                const amplitude = 0.2 * this.observationStrength;
                
                positions[idx] = point.originalPos.x + 
                              Math.sin(time * point.frequency + point.phase) * amplitude;
                              
                positions[idx+1] = point.originalPos.y + 
                               Math.cos(time * point.frequency + point.phase) * amplitude;
                               
                positions[idx+2] = point.originalPos.z + 
                               Math.sin(time * point.frequency * 0.5 + point.phase) * amplitude;
            } else {
                // Static state when time isn't flowing
                positions[idx] = point.originalPos.x;
                positions[idx+1] = point.originalPos.y;
                positions[idx+2] = point.originalPos.z;
            }
        }
        
        this.points.geometry.attributes.position.needsUpdate = true;
        
        // Update time planes when time is flowing
        if (this.timeFlowing) {
            this.timePlanes.forEach((plane, i) => {
                // Move planes to create time flow effect
                plane.position.z += 0.02;
                
                // Reset plane when it goes too far
                if (plane.position.z > 5) {
                    plane.position.z = -5;
                }
                
                // Adjust opacity based on position
                const distFromCenter = Math.abs(plane.position.z);
                plane.material.opacity = 0.2 * (1 - distFromCenter / 5) * this.observationStrength;
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Update active animation based on current verse
        const verse = verses[this.currentVerseIndex].number;
        
        switch(verse) {
            case 13:
                this.time += 0.01;
                
                // Update field wave animation
                if (this.fieldMesh) {
                    const positions = this.fieldMesh.geometry.attributes.position;
                    
                    for (let i = 0; i < positions.count; i++) {
                        const x = positions.getX(i);
                        const y = positions.getY(i);
                        
                        // Calculate distance from center
                        const distance = Math.sqrt(x * x + y * y);
                        
                        // Create wave pattern
                        const z = Math.sin(distance * this.waveFrequency - this.time * this.waveSpeed) * 
                                  this.waveAmplitude;
                        
                        positions.setZ(i, z);
                    }
                    
                    positions.needsUpdate = true;
                }
                
                // Update particles
                if (this.particles) {
                    for (let i = this.particles.length - 1; i >= 0; i--) {
                        const particle = this.particles[i];
                        
                        // Update lifetime
                        particle.lifetime += 0.01;
                        
                        // Scale up then fade out
                        if (particle.lifetime < 0.5) {
                            // Scale up
                            const scale = (particle.lifetime / 0.5) * particle.maxScale;
                            particle.mesh.scale.set(scale, scale, scale);
                        } else if (particle.lifetime > particle.maxLifetime - 1) {
                            // Fade out
                            const fade = 1 - (particle.lifetime - (particle.maxLifetime - 1));
                            particle.mesh.material.opacity = fade;
                            
                            // Also shrink
                            const shrink = fade * particle.maxScale;
                            particle.mesh.scale.set(shrink, shrink, shrink);
                        }
                        
                        // Remove if past max lifetime
                        if (particle.lifetime >= particle.maxLifetime) {
                            this.particleSystem.remove(particle.mesh);
                            this.particles.splice(i, 1);
                        }
                    }
                }
                break;
            case 14:
                // Update electron cloud animation
                if (this.cloudParticles && !this.measured) {
                    const time = performance.now() * 0.001;
                    
                    this.cloudParticles.forEach(particle => {
                        // Create quantum "jitter" by having particles move in small random patterns
                        const noise = (Math.random() - 0.5) * 0.03;
                        
                        particle.mesh.position.x = particle.originalPos.x + 
                                               Math.sin(time * particle.speed) * 0.2 + noise;
                                               
                        particle.mesh.position.y = particle.originalPos.y + 
                                               Math.cos(time * particle.speed) * 0.2 + noise;
                                               
                        particle.mesh.position.z = particle.originalPos.z + 
                                               Math.sin(time * particle.speed * 0.7) * 0.2 + noise;
                    });
                }
                break;
            case 15:
                // Update time symmetry animation
                this.updateTimeSymmetryAnimation();
                break;
            case 16:
                // Update quantum contextuality animation
                if (this.spinState === 'superposition') {
                    // Gradually rotate spin direction in superposition
                    const time = performance.now() * 0.0001;
                    const direction = new THREE.Vector3(
                        Math.sin(time * 2.1),
                        Math.cos(time * 1.7),
                        Math.sin(time * 1.3) * Math.cos(time * 0.9)
                    ).normalize();
                    
                    this.spinArrow.setDirection(direction);
                }
                break;
            case 17:
                // Update quantum Zeno effect
                this.updateZenoEffect();
                break;
            case 18:
                // Update uncertainty principle animation
                // Already handled by control changes
                break;
            case 19:
                // Update virtual particles
                this.updateVirtualParticles();
                break;
            case 20:
                // Update energy conservation animation
                this.updateCollision();
                break;
            case 21:
                // Update emergent time animation
                this.updateEmergingtTime();
                break;
        }
        
        // Render scene
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MadhyamakaQuantumApp();
});