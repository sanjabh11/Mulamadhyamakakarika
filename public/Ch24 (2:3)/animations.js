import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config } from './config.js';

// Base Animation class that all verse animations will extend
class BaseAnimation {
    constructor(canvas) {
        // Set up the renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Set up the scene
        this.scene = new THREE.Scene();
        
        // Set up the camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Set up controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Set up clock for animations
        this.clock = new THREE.Clock();
        
        // Store mouse/touch position for interactions
        this.mouse = new THREE.Vector2();
        this.touchActive = false;
        
        // Set up event listeners
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Handle window resize
        window.addEventListener('resize', this.onResize.bind(this));
    }
    
    setupLights() {
        const lights = new THREE.Group();
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        lights.add(ambientLight);
        
        // Directional light (sun-like)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        lights.add(dirLight);
        
        // Point lights for more dynamic lighting
        const pointLight1 = new THREE.PointLight(0x3677ac, 1, 20);
        pointLight1.position.set(-5, 3, 5);
        lights.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x8844aa, 1, 20);
        pointLight2.position.set(5, 3, -5);
        lights.add(pointLight2);
        
        this.scene.add(lights);
        return lights;
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onMouseDown(event) {
        // Handle mouse down event
    }
    
    onMouseUp(event) {
        // Handle mouse up event
    }
    
    onTouchStart(event) {
        this.touchActive = true;
        if (event.touches.length > 0) {
            this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    onTouchMove(event) {
        if (event.touches.length > 0) {
            this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    onTouchEnd(event) {
        this.touchActive = false;
    }
    
    onResize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
    }
    
    update() {
        // Update controls
        this.controls.update();
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        // Clean up resources to prevent memory leaks
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('mousedown', this.onMouseDown.bind(this));
        window.removeEventListener('mouseup', this.onMouseUp.bind(this));
        window.removeEventListener('touchstart', this.onTouchStart.bind(this));
        window.removeEventListener('touchmove', this.onTouchMove.bind(this));
        window.removeEventListener('touchend', this.onTouchEnd.bind(this));
        window.removeEventListener('resize', this.onResize.bind(this));
        
        // Dispose of all scene objects
        this.scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        // Clear the scene
        while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        
        // Dispose of the renderer
        this.renderer.dispose();
    }
}

function createVerse16Animation(canvas) {
    class QuantumHarmonics extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse16);
            this.lights = this.setupLights();
            
            this.createQuantumField();
            this.createOscillators();
            
            this.animate();
        }
        
        createQuantumField() {
            const geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
            const material = new THREE.MeshStandardMaterial({
                color: 0x0a4a6b,
                wireframe: false,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7,
                emissive: 0x002233,
                emissiveIntensity: 0.5,
                metalness: 0.3,
                roughness: 0.7
            });
            
            this.quantumField = new THREE.Mesh(geometry, material);
            this.quantumField.rotation.x = -Math.PI / 2;
            this.quantumField.position.y = -1;
            this.scene.add(this.quantumField);
            
            const positionAttribute = geometry.attributes.position;
            const initialPositions = new Float32Array(positionAttribute.array.length);
            for (let i = 0; i < positionAttribute.array.length; i++) {
                initialPositions[i] = positionAttribute.array[i];
            }
            this.quantumField.userData.initialPositions = initialPositions;
        }
        
        createOscillators() {
            this.oscillators = [];
            
            for (let i = 0; i < 5; i++) {
                this.addOscillator();
            }
        }
        
        addOscillator() {
            const geometry = new THREE.SphereGeometry(0.2, 16, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0x00aaff,
                emissive: 0x0044ff,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            
            const oscillator = new THREE.Mesh(geometry, material);
            
            const x = (Math.random() - 0.5) * 16;
            const z = (Math.random() - 0.5) * 16;
            oscillator.position.set(x, 0, z);
            
            oscillator.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.1
            );
            
            oscillator.userData.lifetime = 0;
            oscillator.userData.maxLifetime = 10 + Math.random() * 10;
            
            this.scene.add(oscillator);
            this.oscillators.push(oscillator);
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            if (this.quantumField) {
                const positionAttribute = this.quantumField.geometry.attributes.position;
                const initialPositions = this.quantumField.userData.initialPositions;
                
                for (let i = 0; i < positionAttribute.count; i++) {
                    const x = initialPositions[i * 3];
                    const z = initialPositions[i * 3 + 2];
                    
                    const waveHeight = 0.1 * Math.sin(x * 0.5 + elapsedTime) * Math.cos(z * 0.5 + elapsedTime);
                    
                    const currentZ = positionAttribute.getZ(i);
                    const newHeight = currentZ * 0.9 + waveHeight * 0.1;
                    positionAttribute.setZ(i, newHeight);
                }
                
                positionAttribute.needsUpdate = true;
            }
            
            if (this.oscillators) {
                const particlesToRemove = [];
                
                this.oscillators.forEach(oscillator => {
                    oscillator.userData.lifetime += deltaTime;
                    
                    oscillator.position.add(oscillator.userData.velocity);
                    
                    if (oscillator.position.y > 0.2) {
                        oscillator.userData.velocity.y -= 0.001;
                    }
                    
                    oscillator.userData.velocity.multiplyScalar(0.99);
                    
                    if (oscillator.userData.isMarkedForAnnihilation || 
                        oscillator.userData.lifetime > oscillator.userData.maxLifetime) {
                        particlesToRemove.push(oscillator);
                    }
                    
                    const pulse = 0.9 + Math.sin(elapsedTime * 3 + oscillator.userData.lifetime * 5) * 0.1;
                    oscillator.scale.set(pulse, pulse, pulse);
                });
                
                particlesToRemove.forEach(particle => {
                    this.oscillators.splice(this.oscillators.indexOf(particle), 1);
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                });
            }
            
            super.update();
        }
    }
    
    return new QuantumHarmonics(canvas);
}

function createVerse17Animation(canvas) {
    class QuantumTunneling extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse17);
            this.lights = this.setupLights();
            
            this.createPotentialBarriers();
            this.createQuantumParticle();
            this.createTunnelingEffect();
            
            this.animate();
        }
        
        createPotentialBarriers() {
            this.barriers = new THREE.Group();
            this.scene.add(this.barriers);
            
            const barrierGeometry = new THREE.BoxGeometry(1, 3, 6);
            const barrierMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.8,
                emissive: 0x222222
            });
            
            for (let i = 0; i < 3; i++) {
                const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
                barrier.position.set(i * 4 - 4, 0.5, 0);
                this.barriers.add(barrier);
            }
        }
        
        createQuantumParticle() {
            const geometry = new THREE.SphereGeometry(0.5, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0xff00ff,
                emissive: 0xaa00aa,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            this.particle = new THREE.Mesh(geometry, material);
            this.particle.position.set(-8, 0.5, 0);
            this.particle.userData.velocity = new THREE.Vector3(0.05, 0, 0);
            this.scene.add(this.particle);
        }
        
        createTunnelingEffect() {
            this.tunnelingEffect = new THREE.Group();
            this.scene.add(this.tunnelingEffect);
            
            for (let i = 0; i < 20; i++) {
                const size = 0.2 - (i * 0.01);
                const geometry = new THREE.SphereGeometry(size, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.7
                });
                
                const trail = new THREE.Mesh(geometry, material);
                trail.position.copy(this.particle.position);
                trail.position.x -= (i * 0.2);
                trail.userData.velocity = new THREE.Vector3(0.05, 0, 0);
                this.tunnelingEffect.add(trail);
            }
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            
            if (this.particle) {
                this.particle.position.x += this.particle.userData.velocity.x * 0.01;
                this.particle.position.y += this.particle.userData.velocity.y * 0.01;
                this.particle.position.z += this.particle.userData.velocity.z * 0.01;
            }
            
            if (this.tunnelingEffect) {
                this.tunnelingEffect.children.forEach(child => {
                    child.position.x += child.userData.velocity.x * 0.01;
                    child.position.y += child.userData.velocity.y * 0.01;
                    child.position.z += child.userData.velocity.z * 0.01;
                });
            }
            
            super.update();
        }
    }
    
    return new QuantumTunneling(canvas);
}

function createVerse18Animation(canvas) {
    class QuantumEntanglement extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse18);
            this.lights = this.setupLights();
            
            this.createEntangledParticles();
            this.createConnection();
            
            this.animate();
        }
        
        createEntangledParticles() {
            this.entangledParticles = [];
            
            const geometry = new THREE.SphereGeometry(0.7, 32, 32);
            
            const material1 = new THREE.MeshStandardMaterial({
                color: 0x00aaff,
                emissive: 0x0044ff,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            const material2 = new THREE.MeshStandardMaterial({
                color: 0xff00aa,
                emissive: 0xff0044,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            const particle1 = new THREE.Mesh(geometry, material1);
            particle1.position.set(-3, 0.5, 0);
            particle1.userData.velocity = new THREE.Vector3(-0.01, 0.005, 0.008);
            this.scene.add(particle1);
            
            const particle2 = new THREE.Mesh(geometry, material2);
            particle2.position.set(3, 0.5, 0);
            particle2.userData.velocity = new THREE.Vector3(0.01, 0.005, -0.008);
            this.scene.add(particle2);
            
            this.entangledParticles.push(particle1, particle2);
        }
        
        createConnection() {
            const points = [];
            points.push(this.entangledParticles[0].position);
            points.push(this.entangledParticles[1].position);
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5
            });
            
            this.connection = new THREE.Line(geometry, material);
            this.connection.userData.velocity = new THREE.Vector3(0, 0.01, 0);
            this.scene.add(this.connection);
            
            for (let i = 0; i < 5; i++) {
                const pulseGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const pulseMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.7
                });
                
                const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
                pulse.position.lerp(this.entangledParticles[1].position, i / 5);
                this.connection.add(pulse);
            }
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            
            this.entangledParticles.forEach(particle => {
                particle.position.x += particle.userData.velocity.x * 0.01;
                particle.position.y += particle.userData.velocity.y * 0.01;
                particle.position.z += particle.userData.velocity.z * 0.01;
            });
            
            if (this.connection) {
                this.connection.position.x += this.connection.userData.velocity.x * 0.01;
                this.connection.position.y += this.connection.userData.velocity.y * 0.01;
                this.connection.position.z += this.connection.userData.velocity.z * 0.01;
            }
            
            super.update();
        }
    }
    
    return new QuantumEntanglement(canvas);
}

function createVerse19Animation(canvas) {
    class QuantumSuperposition extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse19);
            this.lights = this.setupLights();
            
            this.createSuperpositionOrb();
            this.createParticles();
            
            this.animate();
        }
        
        createSuperpositionOrb() {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0x44aaff,
                emissive: 0x004488,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            this.superpositionOrb = new THREE.Mesh(geometry, material);
            this.superpositionOrb.position.set(0, 1, 0);
            this.scene.add(this.superpositionOrb);
        }
        
        createParticles() {
            this.particles = [];
            
            for (let i = 0; i < 20; i++) {
                const size = 0.1 + Math.random() * 0.2;
                const geometry = new THREE.SphereGeometry(size, 16, 16);
                const material = new THREE.MeshStandardMaterial({
                    color: 0xaaddff,
                    emissive: 0x0088aa,
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.7
                });
                
                const particle = new THREE.Mesh(geometry, material);
                
                const radius = 1.5 + Math.random() * 1;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                particle.position.set(
                    this.superpositionOrb.position.x + radius * Math.sin(phi) * Math.cos(theta),
                    this.superpositionOrb.position.y + radius * Math.cos(phi),
                    this.superpositionOrb.position.z + radius * Math.sin(phi) * Math.sin(theta)
                );
                
                particle.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                );
                
                this.scene.add(particle);
                this.particles.push(particle);
            }
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            
            this.superpositionOrb.rotation.x += 0.01;
            this.superpositionOrb.rotation.y += 0.01;
            
            this.particles.forEach(particle => {
                particle.position.x += particle.userData.velocity.x * 0.01;
                particle.position.y += particle.userData.velocity.y * 0.01;
                particle.position.z += particle.userData.velocity.z * 0.01;
            });
            
            super.update();
        }
    }
    
    return new QuantumSuperposition(canvas);
}

function createVerse20Animation(canvas) {
    class QuantumMeasurement extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse20);
            this.lights = this.setupLights();
            
            this.createMeasurementDevice();
            this.createQuantumSystem();
            
            this.animate();
        }
        
        createMeasurementDevice() {
            const baseGeometry = new THREE.BoxGeometry(3, 0.5, 3);
            const baseMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                metalness: 0.7,
                roughness: 0.3
            });
            
            this.measurementDevice = new THREE.Group();
            
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            this.measurementDevice.add(base);
            
            const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
            const cylinderMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.6,
                roughness: 0.4
            });
            
            const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            cylinder.position.y = 1;
            this.measurementDevice.add(cylinder);
            
            const sensorGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const sensorMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0xaa0000,
                emissiveIntensity: 0.5
            });
            
            const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
            sensor.position.y = 2;
            this.measurementDevice.add(sensor);
            
            this.measurementDevice.position.set(0, 0, -4);
            this.scene.add(this.measurementDevice);
        }
        
        createQuantumSystem() {
            const geometry = new THREE.SphereGeometry(0.8, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00aaaa,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            this.quantumSystem = new THREE.Mesh(geometry, material);
            this.quantumSystem.position.set(0, 1, 0);
            this.quantumSystem.userData.velocity = new THREE.Vector3(0, 0.01, 0);
            this.scene.add(this.quantumSystem);
            
            const ring1Geometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
            const ring1Material = new THREE.MeshBasicMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.5
            });
            
            const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
            ring1.rotation.x = Math.PI / 2;
            this.quantumSystem.add(ring1);
            
            const ring2Geometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
            const ring2Material = new THREE.MeshBasicMaterial({
                color: 0xff0088,
                transparent: true,
                opacity: 0.5
            });
            
            const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
            ring2.rotation.x = Math.PI / 3;
            ring2.rotation.y = Math.PI / 4;
            this.quantumSystem.add(ring2);
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            
            this.measurementDevice.rotation.x += 0.01;
            this.measurementDevice.rotation.y += 0.01;
            
            this.quantumSystem.position.x += this.quantumSystem.userData.velocity.x * 0.01;
            this.quantumSystem.position.y += this.quantumSystem.userData.velocity.y * 0.01;
            this.quantumSystem.position.z += this.quantumSystem.userData.velocity.z * 0.01;
            
            super.update();
        }
    }
    
    return new QuantumMeasurement(canvas);
}

function createVerse21Animation(canvas) {
    class QuantumEntropy extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse21);
            this.lights = this.setupLights();
            
            this.createEntropyField();
            this.createParticles();
            
            this.animate();
        }
        
        createEntropyField() {
            const geometry = new THREE.SphereGeometry(3, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0x8800ff,
                emissive: 0x440088,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            
            this.entropyField = new THREE.Mesh(geometry, material);
            this.entropyField.position.set(0, 0, 0);
            this.scene.add(this.entropyField);
        }
        
        createParticles() {
            this.particles = [];
            
            for (let i = 0; i < 30; i++) {
                const size = 0.1 + Math.random() * 0.3;
                const geometry = new THREE.SphereGeometry(size, 16, 16);
                const material = new THREE.MeshStandardMaterial({
                    color: 0xddaaff,
                    emissive: 0x8800aa,
                    emissiveIntensity: 0.7,
                    transparent: true,
                    opacity: 0.8
                });
                
                const particle = new THREE.Mesh(geometry, material);
                
                const radius = Math.random() * 2.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                particle.position.set(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.cos(phi),
                    radius * Math.sin(phi) * Math.sin(theta)
                );
                
                particle.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05
                );
                
                this.scene.add(particle);
                this.particles.push(particle);
            }
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            
            this.entropyField.rotation.x += 0.01;
            this.entropyField.rotation.y += 0.01;
            
            this.particles.forEach(particle => {
                particle.position.x += particle.userData.velocity.x * 0.01;
                particle.position.y += particle.userData.velocity.y * 0.01;
                particle.position.z += particle.userData.velocity.z * 0.01;
            });
            
            super.update();
        }
    }
    
    return new QuantumEntropy(canvas);
}

function createVerse22Animation(canvas) {
    class CreationAnnihilationOperators extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse22);
            this.lights = this.setupLights();
            
            this.createQuantumField();
            this.createOperators();
            
            this.animate();
        }
        
        createQuantumField() {
            const geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
            const material = new THREE.MeshStandardMaterial({
                color: 0x0a2a4b,
                wireframe: false,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7,
                emissive: 0x001a33,
                emissiveIntensity: 0.5,
                metalness: 0.3,
                roughness: 0.7
            });
            
            this.energyField = new THREE.Mesh(geometry, material);
            this.energyField.rotation.x = -Math.PI / 2;
            this.energyField.position.y = -1;
            this.scene.add(this.energyField);
            
            const positionAttribute = geometry.attributes.position;
            const initialPositions = new Float32Array(positionAttribute.array.length);
            for (let i = 0; i < positionAttribute.array.length; i++) {
                initialPositions[i] = positionAttribute.array[i];
            }
            this.energyField.userData.initialPositions = initialPositions;
        }
        
        createOperators() {
            this.particles = new THREE.Group();
            this.scene.add(this.particles);
            
            this.creationOperator = new THREE.Group();
            
            const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
            const baseMaterial = new THREE.MeshStandardMaterial({
                color: 0x00aa66,
                metalness: 0.5,
                roughness: 0.5
            });
            
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            this.creationOperator.add(base);
            
            const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
            const stemMaterial = new THREE.MeshStandardMaterial({
                color: 0x008855,
                metalness: 0.6,
                roughness: 0.4
            });
            
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            stem.position.y = 0.6;
            this.creationOperator.add(stem);
            
            const plusGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.1);
            const plusMaterial = new THREE.MeshStandardMaterial({
                color: 0x00ff88,
                emissive: 0x00aa66,
                emissiveIntensity: 0.8
            });
            
            const horizontal = new THREE.Mesh(plusGeometry, plusMaterial);
            horizontal.position.y = 1.1;
            this.creationOperator.add(horizontal);
            
            const vertical = new THREE.Mesh(plusGeometry, plusMaterial);
            vertical.rotation.z = Math.PI / 2;
            vertical.position.y = 1.1;
            this.creationOperator.add(vertical);
            
            this.creationOperator.position.set(-3, 0, 0);
            this.scene.add(this.creationOperator);
            
            this.annihilationOperator = new THREE.Group();
            
            const annBase = new THREE.Mesh(baseGeometry, baseMaterial.clone());
            annBase.material.color.set(0xaa0066);
            this.annihilationOperator.add(annBase);
            
            const annStem = new THREE.Mesh(stemGeometry, stemMaterial.clone());
            annStem.material.color.set(0x880055);
            annStem.position.y = 0.6;
            this.annihilationOperator.add(annStem);
            
            const minusGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.1);
            const minusMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0088,
                emissive: 0xaa0066,
                emissiveIntensity: 0.8
            });
            
            const minus = new THREE.Mesh(minusGeometry, minusMaterial);
            minus.position.y = 1.1;
            this.annihilationOperator.add(minus);
            
            this.annihilationOperator.position.set(3, 0, 0);
            this.scene.add(this.annihilationOperator);
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            if (this.energyField) {
                const positionAttribute = this.energyField.geometry.attributes.position;
                const initialPositions = this.energyField.userData.initialPositions;
                
                for (let i = 0; i < positionAttribute.count; i++) {
                    const x = initialPositions[i * 3];
                    const z = initialPositions[i * 3 + 2];
                    
                    const waveHeight = 0.1 * Math.sin(x * 0.5 + elapsedTime) * Math.cos(z * 0.5 + elapsedTime);
                    
                    const currentZ = positionAttribute.getZ(i);
                    const newHeight = currentZ * 0.9 + waveHeight * 0.1;
                    positionAttribute.setZ(i, newHeight);
                }
                
                positionAttribute.needsUpdate = true;
            }
            
            if (this.particles) {
                const particlesToRemove = [];
                
                this.particles.children.forEach(particle => {
                    particle.userData.lifetime += deltaTime;
                    
                    particle.position.add(particle.userData.velocity);
                    
                    if (particle.position.y > 0.2) {
                        particle.userData.velocity.y -= 0.001;
                    }
                    
                    particle.userData.velocity.multiplyScalar(0.99);
                    
                    if (particle.userData.isMarkedForAnnihilation || 
                        particle.userData.lifetime > particle.userData.maxLifetime) {
                        particlesToRemove.push(particle);
                    }
                    
                    const pulse = 0.9 + Math.sin(elapsedTime * 3 + particle.userData.lifetime * 5) * 0.1;
                    particle.scale.set(pulse, pulse, pulse);
                });
                
                particlesToRemove.forEach(particle => {
                    this.particles.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                });
            }
            
            if (this.creationOperator) {
                const pulseCreation = 0.9 + Math.sin(elapsedTime * 2) * 0.1;
                this.creationOperator.children[2].scale.set(pulseCreation, pulseCreation, pulseCreation);
                this.creationOperator.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
            }
            
            if (this.annihilationOperator) {
                const pulseAnnihilation = 0.9 + Math.sin(elapsedTime * 2 + Math.PI) * 0.1;
                this.annihilationOperator.children[1].scale.set(pulseAnnihilation, pulseAnnihilation, pulseAnnihilation);
                this.annihilationOperator.rotation.y = Math.sin(elapsedTime * 0.5 + Math.PI) * 0.1;
            }
            
            super.update();
        }
    }
    
    return new CreationAnnihilationOperators(canvas);
}

function createVerse23Animation(canvas) {
    class MetastableState extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse23);
            this.lights = this.setupLights();
            
            this.createPotentialWell();
            this.createTrappedParticle();
            
            this.animate();
        }
        
        createPotentialWell() {
            const wellGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
            const wellMaterial = new THREE.MeshStandardMaterial({
                color: 0x4422aa,
                emissive: 0x221155,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.7
            });
            
            this.potentialWell = new THREE.Mesh(wellGeometry, wellMaterial);
            this.potentialWell.rotation.x = Math.PI / 2;
            this.scene.add(this.potentialWell);
            
            // Add energy barrier visualization
            const barrierGeometry = new THREE.TorusGeometry(3, 0.1, 8, 100);
            const barrierMaterial = new THREE.MeshStandardMaterial({
                color: 0xff2288,
                emissive: 0xaa1144,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            this.energyBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
            this.energyBarrier.rotation.x = Math.PI / 2;
            this.energyBarrier.position.y = 0.5;
            this.scene.add(this.energyBarrier);
        }
        
        createTrappedParticle() {
            const geometry = new THREE.SphereGeometry(0.5, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0x00ffaa,
                emissive: 0x00aa77,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            this.particle = new THREE.Mesh(geometry, material);
            this.particle.position.set(2.5, 0, 0);
            this.particle.userData.angle = 0;
            this.particle.userData.radius = 2.5;
            this.particle.userData.energy = 0;
            this.particle.userData.escaping = false;
            this.scene.add(this.particle);
            
            // Add particle trail
            this.trail = new THREE.Group();
            this.scene.add(this.trail);
            
            for (let i = 0; i < 10; i++) {
                const trailGeometry = new THREE.SphereGeometry(0.2 - i * 0.02, 8, 8);
                const trailMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00ffaa,
                    transparent: true,
                    opacity: 0.5 - i * 0.05
                });
                
                const trailSegment = new THREE.Mesh(trailGeometry, trailMaterial);
                this.trail.add(trailSegment);
            }
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            // Handle user interaction
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mouse, this.camera);
            
            const intersects = raycaster.intersectObject(this.potentialWell);
            
            if ((this.touchActive || (this.mouse.x !== 0 && this.mouse.y !== 0)) && intersects.length > 0) {
                this.particle.userData.energy += 0.01;
                
                if (this.particle.userData.energy > 1 && !this.particle.userData.escaping) {
                    this.particle.userData.escaping = true;
                }
            } else {
                this.particle.userData.energy = Math.max(0, this.particle.userData.energy - 0.005);
            }
            
            // Update particle movement
            if (!this.particle.userData.escaping) {
                this.particle.userData.angle += 0.02 + this.particle.userData.energy * 0.05;
                this.particle.position.x = Math.cos(this.particle.userData.angle) * this.particle.userData.radius;
                this.particle.position.z = Math.sin(this.particle.userData.angle) * this.particle.userData.radius;
            } else {
                this.particle.userData.radius += 0.05;
                this.particle.position.x = Math.cos(this.particle.userData.angle) * this.particle.userData.radius;
                this.particle.position.z = Math.sin(this.particle.userData.angle) * this.particle.userData.radius;
                this.particle.position.y = (this.particle.userData.radius - 3) * 0.5;
            }
            
            // Update particle trail
            if (this.trail) {
                for (let i = this.trail.children.length - 1; i > 0; i--) {
                    this.trail.children[i].position.copy(this.trail.children[i-1].position);
                }
                if (this.trail.children.length > 0) {
                    this.trail.children[0].position.copy(this.particle.position);
                }
            }
            
            // Update energy visualization
            if (this.energyBarrier) {
                const scale = 1 + this.particle.userData.energy * 0.5;
                this.energyBarrier.scale.set(scale, scale, scale);
                
                const hue = 0.8 - this.particle.userData.energy * 0.5;
                this.energyBarrier.material.emissive.setHSL(hue, 1, 0.5);
            }
            
            super.update();
        }
    }
    
    return new MetastableState(canvas);
}

function createVerse24Animation(canvas) {
    class QuantumPathCultivation extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse24);
            this.lights = this.setupLights();
            
            this.createQuantumCircuit();
            this.createGates();
            
            this.animate();
        }
        
        createQuantumCircuit() {
            const geometry = new THREE.PlaneGeometry(10, 2, 1, 1);
            const material = new THREE.MeshStandardMaterial({
                color: 0x222244,
                emissive: 0x111122,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            
            this.circuit = new THREE.Mesh(geometry, material);
            this.circuit.rotation.x = -Math.PI / 2;
            this.circuit.position.y = -0.5;
            this.scene.add(this.circuit);
            
            // Create quantum wire
            const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
            const wireMaterial = new THREE.MeshStandardMaterial({
                color: 0x4444ff,
                emissive: 0x2222aa,
                emissiveIntensity: 0.5
            });
            
            const wire = new THREE.Mesh(wireGeometry, wireMaterial);
            wire.rotation.z = Math.PI / 2;
            wire.position.y = 0;
            this.scene.add(wire);
            
            // Create qubit
            const qubitGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            const qubitMaterial = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00aaaa,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            this.qubit = new THREE.Mesh(qubitGeometry, qubitMaterial);
            this.qubit.position.set(-4, 0, 0);
            this.qubit.userData.originalPosition = new THREE.Vector3(-4, 0, 0);
            this.qubit.userData.targetPosition = new THREE.Vector3(-4, 0, 0);
            this.qubit.userData.state = new THREE.Vector3(0, 1, 0); // |0⟩ state
            this.scene.add(this.qubit);
            
            // Add qubit state visualization
            const stateGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
            const stateMaterial = new THREE.MeshStandardMaterial({
                color: 0x00ffaa,
                emissive: 0x00aa77,
                emissiveIntensity: 0.8
            });
            
            this.stateVector = new THREE.Mesh(stateGeometry, stateMaterial);
            this.stateVector.position.copy(this.qubit.position);
            this.stateVector.rotation.z = Math.PI / 2;
            this.scene.add(this.stateVector);
        }
        
        createGates() {
            this.gates = new THREE.Group();
            this.scene.add(this.gates);
            
            const gateTypes = [
                { name: "X", color: 0xff0000, operation: (v) => new THREE.Vector3(v.x, -v.y, v.z) },
                { name: "H", color: 0x00ff00, operation: (v) => {
                    // Hadamard transform
                    return new THREE.Vector3(
                        (v.x + v.y) / Math.sqrt(2),
                        (v.x - v.y) / Math.sqrt(2),
                        v.z
                    );
                }},
                { name: "Z", color: 0x0000ff, operation: (v) => new THREE.Vector3(-v.x, v.y, v.z) }
            ];
            
            for (let i = 0; i < gateTypes.length; i++) {
                const gateData = gateTypes[i];
                
                const gateGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
                const gateMaterial = new THREE.MeshStandardMaterial({
                    color: gateData.color,
                    emissive: new THREE.Color(gateData.color).multiplyScalar(0.5),
                    emissiveIntensity: 0.5
                });
                
                const gate = new THREE.Mesh(gateGeometry, gateMaterial);
                gate.position.set(i * 2 - 2, 2, 0);
                gate.userData.operation = gateData.operation;
                gate.userData.name = gateData.name;
                gate.userData.originalPosition = gate.position.clone();
                gate.userData.isPlaced = false;
                this.gates.add(gate);
                
                // Add label
                const textGeometry = new THREE.PlaneGeometry(0.6, 0.6);
                const textMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.9
                });
                
                const text = new THREE.Mesh(textGeometry, textMaterial);
                text.position.z = 0.41;
                gate.add(text);
            }
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            // Handle gates dragging
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.gates.children);
            
            if (this.touchActive || (this.mouse.x !== 0 && this.mouse.y !== 0)) {
                if (intersects.length > 0) {
                    const gate = intersects[0].object;
                    
                    if (!gate.userData.isPlaced) {
                        // Place the gate on the circuit
                        gate.position.set(this.qubit.position.x + 1, 0, 0);
                        gate.userData.isPlaced = true;
                        
                        // Apply gate operation to qubit state
                        this.qubit.userData.state = gate.userData.operation(this.qubit.userData.state);
                        
                        // Move the qubit forward
                        this.qubit.userData.targetPosition.x += 1;
                    }
                }
            }
            
            // Update qubit position
            this.qubit.position.lerp(this.qubit.userData.targetPosition, 0.1);
            
            // Update state vector visualization
            if (this.stateVector) {
                this.stateVector.position.copy(this.qubit.position);
                
                // Set the rotation based on qubit state
                const stateVector = this.qubit.userData.state;
                const angle = Math.atan2(stateVector.y, stateVector.x);
                this.stateVector.rotation.z = angle;
                
                // Set the length based on state magnitude
                const magnitude = Math.sqrt(stateVector.x * stateVector.x + stateVector.y * stateVector.y);
                this.stateVector.scale.y = magnitude;
            }
            
            // Reset gates that went off-screen
            this.gates.children.forEach(gate => {
                if (gate.userData.isPlaced && gate.position.x < -5) {
                    gate.position.copy(gate.userData.originalPosition);
                    gate.userData.isPlaced = false;
                }
                
                if (gate.userData.isPlaced) {
                    // Move placed gates with the circuit
                    gate.position.x -= 0.01;
                }
            });
            
            // Cycle qubit when it reaches the end
            if (this.qubit.position.x > 5) {
                this.qubit.position.copy(this.qubit.userData.originalPosition);
                this.qubit.userData.targetPosition.copy(this.qubit.userData.originalPosition);
                this.qubit.userData.state = new THREE.Vector3(0, 1, 0); // Reset to |0⟩ state
            }
            
            super.update();
        }
    }
    
    return new QuantumPathCultivation(canvas);
}

function createVerse25Animation(canvas) {
    class QuantumComputer extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse25);
            this.lights = this.setupLights();
            
            this.createQuantumComputer();
            this.createComputerComponents();
            
            this.animate();
        }
        
        createQuantumComputer() {
            this.computer = new THREE.Group();
            this.scene.add(this.computer);
            
            const baseGeometry = new THREE.BoxGeometry(6, 0.5, 6);
            const baseMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = -0.25;
            this.computer.add(base);
        }
        
        createComputerComponents() {
            this.components = new THREE.Group();
            this.computer.add(this.components);
            
            const componentTypes = [
                { name: "processor", geometry: new THREE.BoxGeometry(1, 0.2, 1), position: new THREE.Vector3(-1.5, 0.1, -1.5), color: 0x00aaff },
                { name: "memory", geometry: new THREE.BoxGeometry(1, 0.2, 2), position: new THREE.Vector3(-1.5, 0.1, 0.5), color: 0x00ff88 },
                { name: "qubits", geometry: new THREE.BoxGeometry(3, 0.2, 1), position: new THREE.Vector3(0.5, 0.1, -1.5), color: 0xff00aa },
                { name: "controller", geometry: new THREE.BoxGeometry(2, 0.2, 2), position: new THREE.Vector3(1, 0.1, 0.5), color: 0xffaa00 }
            ];
            
            this.componentObjects = [];
            
            componentTypes.forEach(componentType => {
                const material = new THREE.MeshStandardMaterial({
                    color: componentType.color,
                    emissive: new THREE.Color(componentType.color).multiplyScalar(0.5),
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.9
                });
                
                const component = new THREE.Mesh(componentType.geometry, material);
                component.position.copy(componentType.position);
                component.userData.name = componentType.name;
                component.userData.isPlaced = false;
                component.userData.originalPosition = component.position.clone();
                component.userData.originalPosition.y += 3;
                
                // Start components floating above
                component.position.copy(component.userData.originalPosition);
                
                this.components.add(component);
                this.componentObjects.push(component);
            });
            
            // Add connections between components
            this.connections = new THREE.Group();
            this.computer.add(this.connections);
            
            for (let i = 0; i < this.componentObjects.length; i++) {
                for (let j = i + 1; j < this.componentObjects.length; j++) {
                    const comp1 = this.componentObjects[i];
                    const comp2 = this.componentObjects[j];
                    
                    const connectionGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
                    const connectionMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0
                    });
                    
                    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
                    connection.userData.comp1 = comp1;
                    connection.userData.comp2 = comp2;
                    
                    this.connections.add(connection);
                }
            }
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            // Handle component placement
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.componentObjects);
            
            if (this.touchActive || (this.mouse.x !== 0 && this.mouse.y !== 0)) {
                if (intersects.length > 0) {
                    const component = intersects[0].object;
                    
                    if (!component.userData.isPlaced) {
                        // Place the component on the computer
                        component.userData.targetPosition = component.userData.originalPosition.clone();
                        component.userData.targetPosition.y = 0.3;
                        component.userData.isPlaced = true;
                    }
                }
            }
            
            // Update component positions
            this.componentObjects.forEach(component => {
                if (component.userData.targetPosition) {
                    component.position.lerp(component.userData.targetPosition, 0.1);
                }
                
                // Add a slight hover animation
                if (!component.userData.isPlaced) {
                    component.position.y += Math.sin(elapsedTime * 2 + component.position.x) * 0.01;
                }
            });
            
            // Update connections
            this.connections.children.forEach(connection => {
                const comp1 = connection.userData.comp1;
                const comp2 = connection.userData.comp2;
                
                if (comp1.userData.isPlaced && comp2.userData.isPlaced && !connection.userData.activated) {
                    connection.userData.activated = true;
                    
                    // Change connection appearance when activated
                    connection.material.opacity = 0.7;
                    
                    // Mix the node colors for the connection
                    connection.material.color.copy(comp1.userData.color);
                    connection.material.color.lerp(comp2.userData.color, 0.5);
                    connection.material.emissive.copy(connection.material.color);
                }
                
                if (connection.userData.activated) {
                    const pulse = 0.5 + Math.sin(elapsedTime * 5) * 0.3;
                    connection.material.emissiveIntensity = pulse;
                }
            });
            
            // Check if all components are placed - "computer is working"
            let allPlaced = true;
            this.componentObjects.forEach(component => {
                if (!component.userData.isPlaced) {
                    allPlaced = false;
                }
            });
            
            if (allPlaced) {
                // Make the computer "come alive"
                this.componentObjects.forEach(component => {
                    const pulse = 0.3 + Math.sin(elapsedTime * 3 + component.position.x * 2) * 0.2;
                    component.material.emissiveIntensity = pulse;
                });
            }
            
            super.update();
        }
    }
    
    return new QuantumComputer(canvas);
}

function createVerse26Animation(canvas) {
    class QuantumUncertainty extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 5, 10);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse26);
            this.lights = this.setupLights();
            
            this.createUncertaintySystem();
            
            this.animate();
        }
        
        createUncertaintySystem() {
            // Create the primary quantum system in superposition
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0xaa00ff,
                emissive: 0x7700aa,
                emissiveIntensity: 0.7,
                transparent: true,
                opacity: 0.8
            });
            
            this.quantumSystem = new THREE.Mesh(geometry, material);
            this.quantumSystem.position.set(0, 1, 0);
            this.quantumSystem.userData.isMeasured = false;
            this.scene.add(this.quantumSystem);
            
            // Create superposition visualization (cloud of particles)
            this.superpositionCloud = new THREE.Group();
            this.scene.add(this.superpositionCloud);
            
            for (let i = 0; i < 30; i++) {
                const particleSize = 0.1 + Math.random() * 0.2;
                const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
                const particleMaterial = new THREE.MeshStandardMaterial({
                    color: 0xcc88ff,
                    emissive: 0x9944aa,
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.5 + Math.random() * 0.3
                });
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                // Position particles around the quantum system
                const radius = 1 + Math.random() * 1.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                particle.position.set(
                    this.quantumSystem.position.x + radius * Math.sin(phi) * Math.cos(theta),
                    this.quantumSystem.position.y + radius * Math.cos(phi),
                    this.quantumSystem.position.z + radius * Math.sin(phi) * Math.sin(theta)
                );
                
                particle.userData.radius = radius;
                particle.userData.theta = theta;
                particle.userData.phi = phi;
                particle.userData.speed = 0.2 + Math.random() * 0.5;
                particle.userData.centerPosition = this.quantumSystem.position.clone();
                
                this.superpositionCloud.add(particle);
            }
            
            // Create measurement apparatus
            this.measurementDevice = new THREE.Group();
            this.scene.add(this.measurementDevice);
            
            const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
            const baseMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.set(0, -0.25, -3);
            this.measurementDevice.add(base);
            
            const sensorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
            const sensorMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0xaa0000,
                emissiveIntensity: 0.5
            });
            
            const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
            sensor.position.set(0, 0.5, -3);
            this.measurementDevice.add(sensor);
            
            // Create a beam for the measurement
            const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
            const beamMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0
            });
            
            this.beam = new THREE.Mesh(beamGeometry, beamMaterial);
            this.measurementDevice.add(this.beam);
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            // Handle user interaction
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mouse, this.camera);
            
            const intersects = raycaster.intersectObject(this.quantumSystem);
            
            if ((this.touchActive || (this.mouse.x !== 0 && this.mouse.y !== 0)) && intersects.length > 0) {
                if (!this.quantumSystem.userData.isMeasured) {
                    // Perform measurement
                    this.quantumSystem.userData.isMeasured = true;
                    
                    // Choose a definite state
                    const states = [
                        { color: 0xff0000, position: new THREE.Vector3(-1, 1, 0) },
                        { color: 0x00ff00, position: new THREE.Vector3(1, 1, 0) }
                    ];
                    
                    const chosenState = states[Math.floor(Math.random() * states.length)];
                    
                    this.quantumSystem.userData.targetColor = new THREE.Color(chosenState.color);
                    this.quantumSystem.userData.targetPosition = chosenState.position;
                    
                    // Activate measurement beam
                    this.beam.material.opacity = 0.8;
                    this.beam.position.set(0, 0, -1.5);
                    this.beam.scale.y = 3;
                    this.beam.rotation.x = Math.PI / 2;
                }
            }
            
            // Update quantum system in superposition
            if (!this.quantumSystem.userData.isMeasured) {
                // Add a slight wobble to represent uncertainty
                this.quantumSystem.position.x = Math.sin(elapsedTime) * 0.2;
                this.quantumSystem.position.z = Math.cos(elapsedTime * 1.3) * 0.2;
                
                // Pulse the opacity to represent uncertainty
                this.quantumSystem.material.opacity = 0.6 + Math.sin(elapsedTime * 2) * 0.2;
                
                // Slight color shifts
                const hue = (elapsedTime * 0.1) % 1;
                this.quantumSystem.material.color.setHSL(hue, 0.8, 0.5);
                this.quantumSystem.material.emissive.setHSL(hue, 0.8, 0.3);
            } else {
                // Update to measured state
                if (this.quantumSystem.userData.targetColor) {
                    this.quantumSystem.material.color.lerp(this.quantumSystem.userData.targetColor, 0.1);
                    this.quantumSystem.material.emissive.copy(this.quantumSystem.material.color).multiplyScalar(0.5);
                }
                
                if (this.quantumSystem.userData.targetPosition) {
                    this.quantumSystem.position.lerp(this.quantumSystem.userData.targetPosition, 0.1);
                }
                
                // Fixed opacity for measured state
                this.quantumSystem.material.opacity = 0.9;
            }
            
            // Update superposition cloud
            if (this.superpositionCloud) {
                this.superpositionCloud.children.forEach((particle, i) => {
                    if (!this.quantumSystem.userData.isMeasured) {
                        // Update positions of particles in cloud
                        particle.userData.theta += particle.userData.speed * 0.01;
                        
                        particle.position.set(
                            particle.userData.centerPosition.x + particle.userData.radius * Math.sin(particle.userData.phi) * Math.cos(particle.userData.theta),
                            particle.userData.centerPosition.y + particle.userData.radius * Math.cos(particle.userData.phi),
                            particle.userData.centerPosition.z + particle.userData.radius * Math.sin(particle.userData.phi) * Math.sin(particle.userData.theta)
                        );
                    } else {
                        // Collapse the cloud during measurement
                        particle.position.lerp(this.quantumSystem.position, 0.2);
                        particle.scale.multiplyScalar(0.95);
                        
                        if (particle.scale.x < 0.01) {
                            particle.visible = false;
                        }
                    }
                });
            }
            
            super.update();
        }
    }
    
    return new QuantumUncertainty(canvas);
}

function createVerse27Animation(canvas) {
    class QuantumNetwork extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 8, 12);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse27);
            this.lights = this.setupLights();
            
            this.createNetwork();
            
            this.animate();
        }
        
        createNetwork() {
            this.network = new THREE.Group();
            this.scene.add(this.network);
            
            // Create network nodes
            this.nodes = [];
            
            const nodePositions = [
                { position: new THREE.Vector3(-4, 0, -4), name: "Letting Go" },
                { position: new THREE.Vector3(4, 0, -4), name: "Realizing" },
                { position: new THREE.Vector3(-4, 0, 4), name: "Cultivating" },
                { position: new THREE.Vector3(4, 0, 4), name: "Fruit" },
                { position: new THREE.Vector3(0, 3, 0), name: "Understanding" }
            ];
            
            const nodeColors = [
                0xff5500, 0x00aaff, 0x00ff88, 0xffaa00, 0xaa00ff
            ];
            
            nodePositions.forEach((nodeData, i) => {
                const nodeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
                const nodeMaterial = new THREE.MeshStandardMaterial({
                    color: nodeColors[i],
                    emissive: new THREE.Color(nodeColors[i]).multiplyScalar(0.5),
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.9
                });
                
                const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
                node.position.copy(nodeData.position);
                node.userData.name = nodeData.name;
                node.userData.activated = false;
                node.userData.color = new THREE.Color(nodeColors[i]);
                
                this.network.add(node);
                this.nodes.push(node);
            });
            
            // Create connections between nodes
            this.connections = [];
            
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const node1 = this.nodes[i];
                    const node2 = this.nodes[j];
                    
                    const connectionGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
                    const connectionMaterial = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.5,
                        emissive: 0xffffff,
                        emissiveIntensity: 0.3
                    });
                    
                    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
                    connection.userData.node1 = node1;
                    connection.userData.node2 = node2;
                    connection.userData.activated = false;
                    
                    // Position the connection between nodes
                    const midpoint = new THREE.Vector3().addVectors(node1.position, node2.position).multiplyScalar(0.5);
                    connection.position.copy(midpoint);
                    
                    // Orient the connection
                    const direction = new THREE.Vector3().subVectors(node2.position, node1.position);
                    const length = direction.length();
                    connection.scale.y = length;
                    
                    // Align the cylinder with the direction
                    const arrow = new THREE.ArrowHelper(direction.clone().normalize(), new THREE.Vector3(0, 0, 0));
                    connection.quaternion.copy(arrow.quaternion);
                    connection.rotateX(Math.PI / 2);
                    
                    this.network.add(connection);
                    this.connections.push(connection);
                }
            }
            
            // Create activation particles
            this.activationParticles = new THREE.Group();
            this.scene.add(this.activationParticles);
        }
        
        createActivationParticle(sourceNode, targetNode) {
            const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: sourceNode.userData.color,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(sourceNode.position);
            particle.userData.sourceNode = sourceNode;
            particle.userData.targetNode = targetNode;
            particle.userData.progress = 0;
            
            this.activationParticles.add(particle);
            return particle;
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            // Handle user interaction
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.nodes);
            
            if ((this.touchActive || (this.mouse.x !== 0 && this.mouse.y !== 0)) && intersects.length > 0) {
                const node = intersects[0].object;
                
                if (!node.userData.activated) {
                    // Activate the node
                    node.userData.activated = true;
                    node.material.emissiveIntensity = 1.0;
                    
                    // Create particles flowing to connected nodes
                    this.nodes.forEach(targetNode => {
                        if (targetNode !== node) {
                            this.createActivationParticle(node, targetNode);
                        }
                    });
                }
            }
            
            // Update nodes
            this.nodes.forEach(node => {
                if (node.userData.activated) {
                    const pulse = 0.5 + Math.sin(elapsedTime * 3) * 0.5;
                    node.material.emissiveIntensity = pulse;
                    
                    // Scale effect
                    const scalePulse = 1 + Math.sin(elapsedTime * 3) * 0.1;
                    node.scale.set(scalePulse, scalePulse, scalePulse);
                }
            });
            
            // Update connections
            this.connections.forEach(connection => {
                const node1 = connection.userData.node1;
                const node2 = connection.userData.node2;
                
                if (node1.userData.activated && node2.userData.activated && !connection.userData.activated) {
                    connection.userData.activated = true;
                    
                    // Change connection appearance when activated
                    connection.material.opacity = 0.8;
                    connection.material.emissiveIntensity = 0.8;
                    
                    // Mix the node colors for the connection
                    connection.material.color.copy(node1.userData.color);
                    connection.material.color.lerp(node2.userData.color, 0.5);
                    connection.material.emissive.copy(connection.material.color);
                }
                
                if (connection.userData.activated) {
                    const pulse = 0.5 + Math.sin(elapsedTime * 5) * 0.3;
                    connection.material.emissiveIntensity = pulse;
                }
            });
            
            // Update activation particles
            const particlesToRemove = [];
            
            this.activationParticles.children.forEach(particle => {
                particle.userData.progress += deltaTime * 0.5;
                
                if (particle.userData.progress >= 1) {
                    // Reached the target node, activate it
                    if (!particle.userData.targetNode.userData.activated) {
                        particle.userData.targetNode.userData.activated = true;
                    }
                    particlesToRemove.push(particle);
                } else {
                    // Update particle position
                    particle.position.lerpVectors(
                        particle.userData.sourceNode.position,
                        particle.userData.targetNode.position,
                        particle.userData.progress
                    );
                    
                    // Add a slight arc to the particle path
                    const arcHeight = 1;
                    const arcProgress = Math.sin(particle.userData.progress * Math.PI);
                    particle.position.y += arcHeight * arcProgress;
                    
                    // Scale down as it approaches target
                    const scale = 1 - particle.userData.progress * 0.5;
                    particle.scale.set(scale, scale, scale);
                }
            });
            
            // Remove particles that reached their targets
            particlesToRemove.forEach(particle => {
                this.activationParticles.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            });
            
            super.update();
        }
    }
    
    return new QuantumNetwork(canvas);
}

function createVerse28Animation(canvas) {
    class QuantumRace extends BaseAnimation {
        constructor(canvas) {
            super(canvas);
            this.camera.position.set(0, 7, 15);
            this.controls.target.set(0, 0, 0);
            this.scene.background = new THREE.Color(config.animation.backgroundColors.verse28);
            this.lights = this.setupLights();
            
            this.createRaceTrack();
            this.createRacers();
            this.createMeasurementDevice();
            
            this.animate();
        }
        
        createRaceTrack() {
            // Create track base
            const trackGeometry = new THREE.PlaneGeometry(20, 6, 20, 6);
            const trackMaterial = new THREE.MeshStandardMaterial({
                color: 0x444466,
                roughness: 0.8,
                metalness: 0.2,
                side: THREE.DoubleSide
            });
            
            this.track = new THREE.Mesh(trackGeometry, trackMaterial);
            this.track.rotation.x = -Math.PI / 2;
            this.track.position.y = -0.5;
            this.scene.add(this.track);
            
            // Add track markings
            const startLineGeometry = new THREE.PlaneGeometry(0.2, 6);
            const startLineMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            
            const startLine = new THREE.Mesh(startLineGeometry, startLineMaterial);
            startLine.rotation.x = -Math.PI / 2;
            startLine.position.set(-8, -0.48, 0);
            this.scene.add(startLine);
            
            const finishLineGeometry = new THREE.PlaneGeometry(0.2, 6);
            const finishLineMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide
            });
            
            const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial);
            finishLine.rotation.x = -Math.PI / 2;
            finishLine.position.set(8, -0.48, 0);
            this.scene.add(finishLine);
            
            // Add lane markings
            for (let i = -2; i <= 2; i++) {
                if (i === 0) continue; // Skip center line
                
                const laneGeometry = new THREE.PlaneGeometry(16, 0.05);
                const laneMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                });
                
                const lane = new THREE.Mesh(laneGeometry, laneMaterial);
                lane.rotation.x = -Math.PI / 2;
                lane.position.set(0, -0.48, i * 1.5);
                this.scene.add(lane);
            }
        }
        
        createRacers() {
            this.racers = [];
            
            const racerColors = [
                0xff0000, 0x00ff00, 0x0000ff, 0xffaa00, 0xff00ff
            ];
            
            for (let i = 0; i < 5; i++) {
                const racerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
                const racerMaterial = new THREE.MeshStandardMaterial({
                    color: racerColors[i],
                    emissive: new THREE.Color(racerColors[i]).multiplyScalar(0.5),
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.9
                });
                
                const racer = new THREE.Mesh(racerGeometry, racerMaterial);
                racer.position.set(-8, 0, (i - 2) * 1.5);
                racer.userData.lane = i;
                racer.userData.progress = 0;
                racer.userData.speed = 0;
                racer.userData.waveFunction = [];
                racer.userData.measured = false;
                racer.userData.winner = false;
                
                // Create superposition visualization
                for (let j = 0; j < 10; j++) {
                    const waveGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                    const waveMaterial = new THREE.MeshBasicMaterial({
                        color: racerColors[i],
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const waveParticle = new THREE.Mesh(waveGeometry, waveMaterial);
                    waveParticle.visible = false;
                    racer.add(waveParticle);
                    racer.userData.waveFunction.push(waveParticle);
                }
                
                this.scene.add(racer);
                this.racers.push(racer);
            }
            
            this.raceStarted = false;
            this.raceFinished = false;
        }
        
        createMeasurementDevice() {
            this.measurementDevice = new THREE.Group();
            this.scene.add(this.measurementDevice);
            
            const baseGeometry = new THREE.BoxGeometry(1, 0.5, 1);
            const baseMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            this.measurementDevice.add(base);
            
            const sensorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
            const sensorMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0xaa0000,
                emissiveIntensity: 0.5
            });
            
            const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
            sensor.position.y = 0.5;
            this.measurementDevice.add(sensor);
            
            // Add measurement beam
            const beamGeometry = new THREE.BoxGeometry(0.1, 10, 0.1);
            const beamMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0
            });
            
            this.measurementBeam = new THREE.Mesh(beamGeometry, beamMaterial);
            this.measurementBeam.position.set(0, 0, 0);
            this.measurementDevice.add(this.measurementBeam);
            
            this.measurementDevice.position.set(0, 1, -8);
            this.measurementDevice.visible = false;
        }
        
        startRace() {
            this.raceStarted = true;
            
            this.racers.forEach(racer => {
                // Set random potential speeds
                racer.userData.speed = 0.05 + Math.random() * 0.1;
                
                // Make wave function visible
                racer.userData.waveFunction.forEach(wave => {
                    wave.visible = true;
                });
            });
        }
        
        measureRacers() {
            if (!this.raceStarted || this.raceFinished) return;
            
            // Activate measurement device
            this.measurementDevice.visible = true;
            this.measurementBeam.material.opacity = 0.8;
            
            // Determine winner through "quantum measurement"
            // Weight by progress but still allow for randomness
            let totalProbability = 0;
            this.racers.forEach(racer => {
                totalProbability += racer.userData.progress;
            });
            
            let choice = Math.random() * totalProbability;
            let winner = this.racers[0];
            let currentSum = 0;
            
            for (let i = 0; i < this.racers.length; i++) {
                currentSum += this.racers[i].userData.progress;
                if (choice <= currentSum) {
                    winner = this.racers[i];
                    break;
                }
            }
            
            // Mark the winner
            winner.userData.winner = true;
            
            // Mark all racers as measured
            this.racers.forEach(racer => {
                racer.userData.measured = true;
                
                // Collapse wave function
                racer.userData.waveFunction.forEach(wave => {
                    wave.visible = false;
                });
                
                // Set opacity based on winner status
                if (racer.userData.winner) {
                    racer.material.opacity = 1.0;
                    racer.scale.set(1.5, 1.5, 1.5);
                } else {
                    racer.material.opacity = 0.6;
                }
            });
            
            this.raceFinished = true;
        }
        
        update() {
            const elapsedTime = this.clock.getElapsedTime();
            const deltaTime = this.clock.getDelta();
            
            // Handle user interaction
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mouse, this.camera);
            
            // Start race with click/touch on track
            const trackIntersects = raycaster.intersectObject(this.track);
            if (!this.raceStarted && (this.touchActive || (this.mouse.x !== 0 && this.mouse.y !== 0)) && trackIntersects.length > 0) {
                this.startRace();
            }
            
            // Measure racers with click/touch on any racer
            const racerIntersects = raycaster.intersectObjects(this.racers);
            if (this.raceStarted && !this.raceFinished && (this.touchActive || (this.mouse.x !== 0 && this.mouse.y !== 0)) && racerIntersects.length > 0) {
                this.measureRacers();
            }
            
            // Update racers
            if (this.raceStarted && !this.raceFinished) {
                this.racers.forEach(racer => {
                    // Update progress
                    racer.userData.progress += racer.userData.speed * deltaTime;
                    
                    // Move racer
                    const newX = -8 + racer.userData.progress * 16;
                    racer.position.x = newX;
                    
                    // Update wave function (superposition visualization)
                    racer.userData.waveFunction.forEach((wave, i) => {
                        const spread = 1.5 + Math.sin(elapsedTime * 2 + i) * 0.5;
                        const angle = (i / racer.userData.waveFunction.length) * Math.PI * 2;
                        
                        wave.position.x = Math.cos(angle + elapsedTime) * spread * 0.3;
                        wave.position.z = Math.sin(angle + elapsedTime) * spread * 0.2;
                        
                        // Fade spread based on position
                        const opacity = 0.3 - Math.abs(racer.position.x) / 30;
                        wave.material.opacity = Math.max(0.1, opacity);
                    });
                    
                    // Finish race if any racer reaches the end
                    if (racer.position.x >= 8 && !this.raceFinished) {
                        this.measureRacers();
                    }
                });
            }
            
            // Update measurement device
            if (this.measurementDevice.visible) {
                this.measurementDevice.position.x = Math.sin(elapsedTime) * 8;
                
                // Pulse the sensor
                const pulse = 0.5 + Math.sin(elapsedTime * 5) * 0.5;
                this.measurementDevice.children[1].material.emissiveIntensity = pulse;
            }
            
            // Update winner visuals
            if (this.raceFinished) {
                this.racers.forEach(racer => {
                    if (racer.userData.winner) {
                        // Make winner pulse with light
                        const pulse = 0.5 + Math.sin(elapsedTime * 3) * 0.5;
                        racer.material.emissiveIntensity = pulse;
                        
                        // Add a slight hovering effect
                        racer.position.y = 0.5 + Math.sin(elapsedTime * 2) * 0.2;
                    }
                });
            }
            
            super.update();
        }
    }
    
    return new QuantumRace(canvas);
}

export function createAnimation(verseNumber, canvas) {
    switch(verseNumber) {
        case 15:
            // Implement Quantum Rider animation
            class QuantumRider extends BaseAnimation {
                constructor(canvas) {
                    super(canvas);
                    this.camera.position.set(0, 3, 8);
                    this.controls.target.set(0, 0, 0);
                    this.scene.background = new THREE.Color(config.animation.backgroundColors.verse15);
                    this.lights = this.setupLights();
                    
                    this.createHorse();
                    this.createRider();
                    
                    this.animate();
                }
                
                createHorse() {
                    const geometry = new THREE.BoxGeometry(2, 1, 4);
                    const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.5 });
                    this.horse = new THREE.Mesh(geometry, material);
                    this.horse.position.set(0, 0.5, 0);
                    this.scene.add(this.horse);
                }
                
                createRider() {
                    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
                    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa });
                    this.rider = new THREE.Mesh(geometry, material);
                    this.rider.position.set(0, 1.5, 0);
                    this.scene.add(this.rider);
                }
                
                update() {
                    const elapsedTime = this.clock.getElapsedTime();
                    
                    this.horse.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(elapsedTime)) * 0.5;
                    this.horse.rotation.y += 0.005;
                    this.rider.rotation.y += 0.01;
                    
                    super.update();
                }
            }
            return new QuantumRider(canvas);
        case 16:
            return createVerse16Animation(canvas);
        case 17:
            return createVerse17Animation(canvas);
        case 18:
            return createVerse18Animation(canvas);
        case 19:
            return createVerse19Animation(canvas);
        case 20:
            return createVerse20Animation(canvas);
        case 21:
            return createVerse21Animation(canvas);
        case 22:
            return createVerse22Animation(canvas);
        case 23:
            return createVerse23Animation(canvas);
        case 24:
            return createVerse24Animation(canvas);
        case 25:
            return createVerse25Animation(canvas);
        case 26:
            return createVerse26Animation(canvas);
        case 27:
            return createVerse27Animation(canvas);
        case 28:
            return createVerse28Animation(canvas);
        default:
            console.error(`No animation defined for verse ${verseNumber}`);
            return null;
    }
}