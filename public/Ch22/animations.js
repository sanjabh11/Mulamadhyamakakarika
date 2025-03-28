import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import { animationSettings } from './config.js';

// Base Animation class
class BaseAnimation {
    constructor(container) {
        this.container = container;
        this.particleCount = animationSettings.particleCount;
        this.colors = animationSettings.colorPalette;
        this.speed = animationSettings.defaultSpeed;
        this.isPlaying = true;
        this.clock = new THREE.Clock();
        
        this.initScene();
        this.initPostprocessing();
        this.setupResizeHandler();
    }
    
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.colors.background);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Clear any existing canvas
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        
        this.container.appendChild(this.renderer.domElement);
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }
    
    initPostprocessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        this.composer.addPass(bloomPass);
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.clock.start();
        } else {
            this.clock.stop();
        }
    }
    
    restart() {
        this.dispose();
        this.initScene();
        this.initPostprocessing();
        this.init(); // Implemented by child classes
    }
    
    dispose() {
        // Dispose of geometries, materials, textures
        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => disposeMaterial(material));
                } else {
                    disposeMaterial(object.material);
                }
            }
        });
        
        function disposeMaterial(material) {
            if (material.map) material.map.dispose();
            if (material.lightMap) material.lightMap.dispose();
            if (material.bumpMap) material.bumpMap.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.specularMap) material.specularMap.dispose();
            if (material.envMap) material.envMap.dispose();
            material.dispose();
        }
        
        this.renderer.dispose();
        this.composer.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeHandler);
    }
    
    animate() {
        if (!this.renderer) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        if (this.isPlaying) {
            const delta = this.clock.getDelta() * this.speed;
            this.update(delta);
        }
        
        this.controls.update();
        this.composer.render();
    }
    
    update(delta) {
        // To be implemented by child classes
    }
    
    init() {
        // To be implemented by child classes
    }
}

// Specific animation implementations
export class SuperpositionAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create a quantum particle in superposition
        this.particleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        this.particleMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0.8
        });
        
        this.particle = new THREE.Mesh(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particle);
        
        // Create wave function visualization
        this.waveGeometry = new THREE.BufferGeometry();
        const wavePoints = [];
        this.waveCount = 200;
        
        for (let i = 0; i < this.waveCount; i++) {
            const angle = (i / this.waveCount) * Math.PI * 2;
            const radius = 2;
            wavePoints.push(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
        }
        
        this.waveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wavePoints, 3));
        this.waveMaterial = new THREE.LineBasicMaterial({ color: this.colors.primary });
        this.wave = new THREE.Line(this.waveGeometry, this.waveMaterial);
        this.scene.add(this.wave);
        
        // Add measurement plane
        this.planeMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        this.planeGeometry = new THREE.PlaneGeometry(5, 5);
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.position.z = -3;
        this.plane.visible = false;
        this.scene.add(this.plane);
        
        // Add probability clouds
        this.cloudGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 3;
            positions[i3 + 1] = (Math.random() - 0.5) * 3;
            positions[i3 + 2] = (Math.random() - 0.5) * 3;
            
            const color = new THREE.Color(this.colors.secondary);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        this.cloudGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.cloudGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        this.cloudMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.5
        });
        
        this.cloud = new THREE.Points(this.cloudGeometry, this.cloudMaterial);
        this.scene.add(this.cloud);
        
        // Animation timeline
        this.setupTimeline();
        
        // Set camera position
        this.camera.position.set(0, 0, 8);
        this.controls.update();
    }
    
    setupTimeline() {
        this.timeline = gsap.timeline({ repeat: -1 });
        
        // Phase 1: Particle in superposition
        this.timeline.to(this.particle.scale, {
            x: 1.5, y: 1.5, z: 1.5,
            duration: 2,
            ease: "sine.inOut",
            onStart: () => {
                this.wave.visible = true;
                this.plane.visible = false;
            }
        });
        
        // Phase 2: Introduce measurement
        this.timeline.to(this.plane.position, {
            z: 0,
            duration: 3,
            onStart: () => {
                this.plane.visible = true;
                gsap.to(this.plane.material, { opacity: 0.5, duration: 1 });
            }
        });
        
        // Phase 3: Collapse to a specific state
        this.timeline.to(this.particle.position, {
            x: 1, y: 0, z: 0,
            duration: 1,
            ease: "power2.in",
            onStart: () => {
                gsap.to(this.waveMaterial, { opacity: 0, duration: 0.5 });
                gsap.to(this.cloudMaterial, { opacity: 0, duration: 0.5 });
            }
        });
        
        // Phase 4: Reset
        this.timeline.to(this.particle.position, {
            x: 0, y: 0, z: 0,
            duration: 1,
            delay: 1,
            onComplete: () => {
                gsap.to(this.waveMaterial, { opacity: 1, duration: 0.5 });
                gsap.to(this.cloudMaterial, { opacity: 0.5, duration: 0.5 });
                gsap.to(this.plane.material, { opacity: 0, duration: 1 });
                gsap.to(this.plane.position, { z: -3, duration: 0 });
            }
        });
    }
    
    update(delta) {
        // Update wave function visualization
        const positions = this.waveGeometry.attributes.position.array;
        
        for (let i = 0; i < this.waveCount; i++) {
            const i3 = i * 3;
            const angle = (i / this.waveCount) * Math.PI * 2;
            const time = this.clock.getElapsedTime() * this.speed;
            
            const radius = 2 + Math.sin(angle * 3 + time) * 0.2;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = Math.sin(angle * 5 + time) * 0.1;
        }
        
        this.waveGeometry.attributes.position.needsUpdate = true;
        
        // Update probability cloud
        const cloudPositions = this.cloudGeometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const time = this.clock.getElapsedTime() * this.speed;
            
            cloudPositions[i3] += Math.sin(time + i * 0.1) * 0.01;
            cloudPositions[i3 + 1] += Math.cos(time + i * 0.1) * 0.01;
            cloudPositions[i3 + 2] += Math.sin(time * 0.5 + i * 0.1) * 0.01;
            
            // Keep particles in bounds
            const distance = Math.sqrt(
                cloudPositions[i3] * cloudPositions[i3] +
                cloudPositions[i3 + 1] * cloudPositions[i3 + 1] +
                cloudPositions[i3 + 2] * cloudPositions[i3 + 2]
            );
            
            if (distance > 3) {
                cloudPositions[i3] *= 0.95;
                cloudPositions[i3 + 1] *= 0.95;
                cloudPositions[i3 + 2] *= 0.95;
            }
        }
        
        this.cloudGeometry.attributes.position.needsUpdate = true;
        
        // Rotate the entire scene slightly
        this.scene.rotation.y += delta * 0.1;
    }
}

export class QuantumFieldAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create quantum field visualization
        this.fieldGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
        this.fieldMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        this.field = new THREE.Mesh(this.fieldGeometry, this.fieldMaterial);
        this.scene.add(this.field);
        
        // Create particles that emerge from the field
        this.particles = new THREE.Group();
        this.scene.add(this.particles);
        
        this.particlePool = [];
        this.activeParticles = [];
        
        // Create particle pool
        for (let i = 0; i < 50; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: this.colors.secondary,
                transparent: true,
                opacity: 0
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.scale.set(0, 0, 0);
            this.particles.add(particle);
            this.particlePool.push({
                mesh: particle,
                life: 0,
                maxLife: 0,
                speed: new THREE.Vector3(0, 0, 0),
                active: false
            });
        }
        
        // Set camera position
        this.camera.position.set(0, 4, 6);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
        
        // Start particle emission
        this.particleTimer = 0;
        this.particleEmitRate = 0.2; // seconds
    }
    
    createParticle() {
        // Find an inactive particle
        const particle = this.particlePool.find(p => !p.active);
        if (!particle) return;
        
        // Activate particle
        particle.active = true;
        particle.life = 0;
        particle.maxLife = 2 + Math.random() * 3;
        
        // Position particle on the field
        const x = (Math.random() - 0.5) * 8;
        const y = 0;
        const z = (Math.random() - 0.5) * 8;
        particle.mesh.position.set(x, y, z);
        
        // Set particle speed
        const speed = 0.2 + Math.random() * 0.3;
        particle.speed.set(
            (Math.random() - 0.5) * 0.1,
            speed,
            (Math.random() - 0.5) * 0.1
        );
        
        // Reset scale and opacity
        particle.mesh.scale.set(0, 0, 0);
        particle.mesh.material.opacity = 0;
        
        // Add to active particles
        this.activeParticles.push(particle);
        
        // Animate particle emergence
        gsap.to(particle.mesh.scale, {
            x: 0.5 + Math.random() * 0.5,
            y: 0.5 + Math.random() * 0.5,
            z: 0.5 + Math.random() * 0.5,
            duration: 0.5,
            ease: "back.out"
        });
        
        gsap.to(particle.mesh.material, {
            opacity: 0.8,
            duration: 0.5
        });
        
        // Randomly colorize particle
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        particle.mesh.material.color.set(color);
    }
    
    update(delta) {
        // Update field wave effect
        const positions = this.fieldGeometry.attributes.position.array;
        const time = this.clock.getElapsedTime() * this.speed;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            const distance = Math.sqrt(x * x + z * z);
            
            positions[i + 1] = Math.sin(distance - time) * 0.3 + 
                              Math.sin(x * 2 + time) * 0.1 +
                              Math.sin(z * 2 + time) * 0.1;
        }
        
        this.fieldGeometry.attributes.position.needsUpdate = true;
        
        // Emit new particles
        this.particleTimer += delta;
        if (this.particleTimer >= this.particleEmitRate) {
            this.particleTimer = 0;
            this.createParticle();
        }
        
        // Update active particles
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            
            // Update life
            particle.life += delta;
            
            // Update position
            particle.mesh.position.add(particle.speed.clone().multiplyScalar(delta));
            
            // Fade out near end of life
            if (particle.life >= particle.maxLife * 0.7) {
                const factor = 1 - (particle.life - particle.maxLife * 0.7) / (particle.maxLife * 0.3);
                particle.mesh.material.opacity = 0.8 * factor;
                particle.mesh.scale.multiplyScalar(0.99);
            }
            
            // Check if particle is dead
            if (particle.life >= particle.maxLife) {
                particle.active = false;
                particle.mesh.material.opacity = 0;
                particle.mesh.scale.set(0, 0, 0);
                this.activeParticles.splice(i, 1);
            }
        }
    }
}

export class DecoherenceAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create superposition state
        this.waveGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
        this.waveMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.wave = new THREE.Mesh(this.waveGeometry, this.waveMaterial);
        this.scene.add(this.wave);
        
        // Create particles in superposition
        this.particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(this.particleCount * 3);
        const particleColors = new Float32Array(this.particleCount * 3);
        
        this.particlesData = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Position particles in a torus shape
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = Math.random() * Math.PI * 2;
            
            const radius = 3;
            const tubeRadius = 0.5 + (Math.random() - 0.5) * 0.3;
            
            particlePositions[i3] = (radius + tubeRadius * Math.cos(angle2)) * Math.cos(angle1);
            particlePositions[i3 + 1] = (radius + tubeRadius * Math.cos(angle2)) * Math.sin(angle1);
            particlePositions[i3 + 2] = tubeRadius * Math.sin(angle2);
            
            // Create vibrant colors
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
            
            particleColors[i3] = color.r;
            particleColors[i3 + 1] = color.g;
            particleColors[i3 + 2] = color.b;
            
            // Store original position for animation
            this.particlesData.push({
                originalPosition: new THREE.Vector3(
                    particlePositions[i3],
                    particlePositions[i3 + 1],
                    particlePositions[i3 + 2]
                ),
                finalPosition: new THREE.Vector3(0, 0, 0),
                phase: Math.random() * Math.PI * 2
            });
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        
        this.particlesMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
        this.scene.add(this.particles);
        
        // Create measurement detector
        this.detectorGeometry = new THREE.BoxGeometry(6, 1, 6);
        this.detectorMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        this.detector = new THREE.Mesh(this.detectorGeometry, this.detectorMaterial);
        this.detector.position.y = -3;
        this.scene.add(this.detector);
        
        // Animation state
        this.decoherenceState = 0; // 0: superposition, 1: measurement, 2: decoherence
        this.decoherenceTimer = 0;
        this.decoherenceDelay = 8; // seconds before state changes
        
        // Set camera position
        this.camera.position.set(0, 5, 8);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    update(delta) {
        // Update timer and state
        this.decoherenceTimer += delta;
        if (this.decoherenceTimer > this.decoherenceDelay) {
            this.decoherenceTimer = 0;
            this.decoherenceState = (this.decoherenceState + 1) % 3;
            
            if (this.decoherenceState === 1) {
                // Start measurement - move detector
                gsap.to(this.detector.position, {
                    y: 0,
                    duration: 2,
                    ease: "power2.inOut"
                });
                gsap.to(this.detectorMaterial, {
                    opacity: 0.7,
                    duration: 1
                });
            } else if (this.decoherenceState === 2) {
                // Start decoherence - assign final positions
                for (let i = 0; i < this.particleCount; i++) {
                    // 50% chance to collapse to state 1 or state 2
                    const state = Math.random() > 0.5 ? 1 : 2;
                    
                    if (state === 1) {
                        this.particlesData[i].finalPosition.set(
                            (Math.random() - 0.5) * 2,
                            2,
                            (Math.random() - 0.5) * 2
                        );
                    } else {
                        this.particlesData[i].finalPosition.set(
                            (Math.random() - 0.5) * 2,
                            -2,
                            (Math.random() - 0.5) * 2
                        );
                    }
                }
                
                // Fade out wave function
                gsap.to(this.waveMaterial, {
                    opacity: 0,
                    duration: 1.5
                });
            } else {
                // Reset to superposition
                gsap.to(this.detector.position, {
                    y: -3,
                    duration: 1.5,
                    ease: "power2.inOut"
                });
                gsap.to(this.detectorMaterial, {
                    opacity: 0.3,
                    duration: 1
                });
                gsap.to(this.waveMaterial, {
                    opacity: 0.8,
                    duration: 1.5
                });
            }
        }
        
        // Update particles based on state
        const positions = this.particlesGeometry.attributes.position.array;
        const time = this.clock.getElapsedTime() * this.speed;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const data = this.particlesData[i];
            
            if (this.decoherenceState === 0) {
                // Superposition state - particles follow wave function
                const phase = data.phase + time;
                positions[i3] = data.originalPosition.x + Math.sin(phase) * 0.1;
                positions[i3 + 1] = data.originalPosition.y + Math.cos(phase) * 0.1;
                positions[i3 + 2] = data.originalPosition.z + Math.sin(phase * 1.5) * 0.1;
            } else if (this.decoherenceState === 1) {
                // Measurement - particles start to shift
                const factor = Math.min(1, this.decoherenceTimer / 2);
                positions[i3] = data.originalPosition.x * (1 - factor) + (Math.random() - 0.5) * 0.1;
                positions[i3 + 1] = data.originalPosition.y * (1 - factor) + (Math.random() - 0.5) * 0.1;
                positions[i3 + 2] = data.originalPosition.z * (1 - factor) + (Math.random() - 0.5) * 0.1;
            } else {
                // Decoherence - particles move to final positions
                const factor = Math.min(1, this.decoherenceTimer / 2);
                positions[i3] = data.originalPosition.x * (1 - factor) + data.finalPosition.x * factor;
                positions[i3 + 1] = data.originalPosition.y * (1 - factor) + data.finalPosition.y * factor;
                positions[i3 + 2] = data.originalPosition.z * (1 - factor) + data.finalPosition.z * factor;
            }
        }
        
        this.particlesGeometry.attributes.position.needsUpdate = true;
        
        // Rotate wave in superposition state
        if (this.decoherenceState === 0) {
            this.wave.rotation.x += delta * 0.2;
            this.wave.rotation.y += delta * 0.1;
        }
    }
}

export class EntanglementAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create two entangled particles
        this.particle1 = this.createParticle(this.colors.primary);
        this.particle2 = this.createParticle(this.colors.secondary);
        
        this.scene.add(this.particle1);
        this.scene.add(this.particle2);
        
        // Position particles
        this.particle1.position.x = -2;
        this.particle2.position.x = 2;
        
        // Create connection line
        const lineGeometry = new THREE.BufferGeometry();
        const lineVertices = new Float32Array([
            -2, 0, 0,
            2, 0, 0
        ]);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));
        
        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 0.2,
            gapSize: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        this.connectionLine = new THREE.Line(lineGeometry, lineMaterial);
        this.connectionLine.computeLineDistances();
        this.scene.add(this.connectionLine);
        
        // Animation state
        this.rotationPhase = 0;
        this.entanglementState = 0; // 0: entangled, 1: measurement, 2: correlated
        this.stateTimer = 0;
        this.stateDelay = 7; // seconds
        
        // Set camera
        this.camera.position.set(0, 3, 7);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    createParticle(color) {
        const group = new THREE.Group();
        
        // Core particle
        const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);
        
        // Orbital
        const orbitGeometry = new THREE.TorusGeometry(0.6, 0.05, 16, 100);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        group.add(orbit);
        
        // Orbital electron
        const electronGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const electronMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        electron.position.x = 0.6;
        group.add(electron);
        
        // Store electron reference
        group.electron = electron;
        group.orbit = orbit;
        
        return group;
    }
    
    update(delta) {
        // Update timer and state
        this.stateTimer += delta;
        if (this.stateTimer > this.stateDelay) {
            this.stateTimer = 0;
            this.entanglementState = (this.entanglementState + 1) % 3;
            
            if (this.entanglementState === 1) {
                // Measurement - particles separate
                gsap.to(this.particle1.position, {
                    x: -4,
                    duration: 2,
                    ease: "power2.inOut"
                });
                gsap.to(this.particle2.position, {
                    x: 4,
                    duration: 2,
                    ease: "power2.inOut"
                });
            } else if (this.entanglementState === 0) {
                // Back to entangled state
                gsap.to(this.particle1.position, {
                    x: -2,
                    duration: 2,
                    ease: "power2.inOut"
                });
                gsap.to(this.particle2.position, {
                    x: 2,
                    duration: 2,
                    ease: "power2.inOut"
                });
            }
        }
        
        // Update connection line
        const linePositions = this.connectionLine.geometry.attributes.position.array;
        linePositions[0] = this.particle1.position.x;
        linePositions[1] = this.particle1.position.y;
        linePositions[2] = this.particle1.position.z;
        linePositions[3] = this.particle2.position.x;
        linePositions[4] = this.particle2.position.y;
        linePositions[5] = this.particle2.position.z;
        
        this.connectionLine.geometry.attributes.position.needsUpdate = true;
        this.connectionLine.computeLineDistances();
        
        // Update particle rotations and electrons
        this.rotationPhase += delta * 2;
        
        const updateParticle = (particle, phase, stateOffset) => {
            const time = this.rotationPhase + stateOffset;
            
            // Rotate orbit
            particle.orbit.rotation.x = time * 0.3;
            particle.orbit.rotation.y = time * 0.5;
            
            // Move electron
            particle.electron.position.x = Math.cos(time) * 0.6;
            particle.electron.position.z = Math.sin(time) * 0.6;
        };
        
        if (this.entanglementState === 0) {
            // Entangled - particles rotate together
            updateParticle(this.particle1, this.rotationPhase, 0);
            updateParticle(this.particle2, this.rotationPhase, Math.PI); // opposite phase
        } else if (this.entanglementState === 1) {
            // Measurement - particles start to desynchronize
            const desync = Math.min(Math.PI / 2, this.stateTimer * 0.5);
            updateParticle(this.particle1, this.rotationPhase, 0);
            updateParticle(this.particle2, this.rotationPhase, Math.PI + desync);
        } else {
            // Correlated - particles maintain correlation but with independent motion
            const p1phase = this.rotationPhase;
            const p2phase = this.rotationPhase + Math.PI; // still correlated but moving independently
            
            updateParticle(this.particle1, p1phase, 0);
            updateParticle(this.particle2, p2phase, 0);
        }
        
        // Connection line opacity based on distance
        const distance = this.particle1.position.distanceTo(this.particle2.position);
        this.connectionLine.material.opacity = Math.max(0, 1 - distance / 10);
    }
}

export class QuantumErasureAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create double slit setup
        this.slitGeometry = new THREE.PlaneGeometry(6, 3, 1, 1);
        this.slitMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            transparent: true,
            opacity: 0.7
        });
        this.slitPlane = new THREE.Mesh(this.slitGeometry, this.slitMaterial);
        this.slitPlane.position.z = -2;
        this.scene.add(this.slitPlane);
        
        // Create slits
        const slitWidth = 0.4;
        const slitHeight = 1.5;
        const slitSeparation = 1.5;
        
        // Create holes in the slit plane
        const slitGeometry1 = new THREE.PlaneGeometry(slitWidth, slitHeight);
        const slitGeometry2 = new THREE.PlaneGeometry(slitWidth, slitHeight);
        
        const slitMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.0
        });
        
        this.slit1 = new THREE.Mesh(slitGeometry1, slitMaterial);
        this.slit1.position.set(-slitSeparation/2, 0, -1.9);
        this.scene.add(this.slit1);
        
        this.slit2 = new THREE.Mesh(slitGeometry2, slitMaterial);
        this.slit2.position.set(slitSeparation/2, 0, -1.9);
        this.scene.add(this.slit2);
        
        // Create detector screen
        this.screenGeometry = new THREE.PlaneGeometry(8, 4, 40, 20);
        this.screenMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        this.screen = new THREE.Mesh(this.screenGeometry, this.screenMaterial);
        this.screen.position.z = 2;
        this.scene.add(this.screen);
        
        // Create eraser device
        this.eraserGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        this.eraserMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0.7
        });
        this.eraser = new THREE.Mesh(this.eraserGeometry, this.eraserMaterial);
        this.eraser.position.set(0, 2, 0);
        this.scene.add(this.eraser);
        
        // Create particles
        this.particlesGeometry = new THREE.BufferGeometry();
        this.maxParticles = 200;
        this.particlePositions = new Float32Array(this.maxParticles * 3);
        this.particleColors = new Float32Array(this.maxParticles * 3);
        
        this.particlesData = [];
        
        for (let i = 0; i < this.maxParticles; i++) {
            const i3 = i * 3;
            
            // Set initial positions
            this.particlePositions[i3] = 0;
            this.particlePositions[i3 + 1] = 0;
            this.particlePositions[i3 + 2] = -5; // Start behind
            
            // Set colors
            const color = new THREE.Color(this.colors.secondary);
            this.particleColors[i3] = color.r;
            this.particleColors[i3 + 1] = color.g;
            this.particleColors[i3 + 2] = color.b;
            
            // Add particle data
            this.particlesData.push({
                velocity: new THREE.Vector3(0, 0, 1),
                active: false,
                interference: 0,
                whichPath: Math.random() > 0.5 ? 1 : 2, // Which slit
                pathErased: false
            });
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
        
        this.particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
        this.scene.add(this.particles);
        
        // Set up interference pattern
        this.screenData = [];
        const screenPositions = this.screenGeometry.attributes.position.array;
        
        for (let i = 0; i < screenPositions.length; i += 3) {
            this.screenData.push({
                x: screenPositions[i],
                y: screenPositions[i + 1],
                intensity: 0
            });
        }
        
        // Set up animation state
        this.eraserMode = false; // Toggle between showing interference and which-path
        this.eraseTimer = 0;
        this.eraseInterval = 5; // Toggle every 5 seconds
        
        // Set camera
        this.camera.position.set(0, 1, 10);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    resetParticle(index) {
        const i3 = index * 3;
        
        // Reset position back to source
        this.particlePositions[i3] = (Math.random() - 0.5) * 0.2;
        this.particlePositions[i3 + 1] = (Math.random() - 0.5) * 0.2;
        this.particlePositions[i3 + 2] = -5;
        
        // Reset data
        const data = this.particlesData[index];
        data.active = true;
        data.whichPath = Math.random() > 0.5 ? 1 : 2;
        data.interference = Math.random() * Math.PI * 2;
        data.pathErased = this.eraserMode;
        
        // Set velocity based on destination (slit)
        const slit = data.whichPath === 1 ? this.slit1 : this.slit2;
        
        const target = new THREE.Vector3(
            slit.position.x + (Math.random() - 0.5) * 0.3,
            slit.position.y + (Math.random() - 0.5) * 0.3,
            slit.position.z
        );
        
        data.velocity = target.clone().sub(new THREE.Vector3(
            this.particlePositions[i3],
            this.particlePositions[i3 + 1],
            this.particlePositions[i3 + 2]
        )).normalize().multiplyScalar(1.5 + Math.random() * 0.5);
    }
    
    update(delta) {
        // Handle eraser mode toggle
        this.eraseTimer += delta;
        if (this.eraseTimer > this.eraseInterval) {
            this.eraseTimer = 0;
            this.eraserMode = !this.eraserMode;
            
            // Animate eraser
            gsap.to(this.eraser.position, {
                y: this.eraserMode ? 0 : 2,
                duration: 1,
                ease: "power2.inOut"
            });
            
            gsap.to(this.eraserMaterial, {
                opacity: this.eraserMode ? 1 : 0.7,
                duration: 1
            });
            
            // Update screen appearance
            gsap.to(this.screenMaterial, {
                opacity: this.eraserMode ? 0.4 : 0.2,
                duration: 1
            });
        }
        
        // Update particles
        let particlesCount = 0;
        
        for (let i = 0; i < this.maxParticles; i++) {
            const i3 = i * 3;
            const data = this.particlesData[i];
            
            if (!data.active) {
                // Try to activate some particles
                if (Math.random() > 0.9 && particlesCount < 100) {
                    this.resetParticle(i);
                    particlesCount++;
                }
                continue;
            }
            
            particlesCount++;
            
            // Get current position
            const x = this.particlePositions[i3];
            const y = this.particlePositions[i3 + 1];
            const z = this.particlePositions[i3 + 2];
            
            // Different behavior based on position
            if (z < this.slitPlane.position.z) {
                // Moving toward slits
                this.particlePositions[i3] += data.velocity.x * delta;
                this.particlePositions[i3 + 1] += data.velocity.y * delta;
                this.particlePositions[i3 + 2] += data.velocity.z * delta;
            } else if (z < this.screen.position.z) {
                // After slits, before screen
                
                // Check if just passed slits
                if (z - delta * data.velocity.z < this.slitPlane.position.z) {
                    // Adjust velocity based on slit
                    const slit = data.whichPath === 1 ? this.slit1 : this.slit2;
                    
                    // Adjust for interference or which-path
                    if (this.eraserMode) {
                        // Which-path: direct line to screen
                        const screenX = data.whichPath === 1 ? -1.5 : 1.5;
                        const screenTargetX = screenX + (Math.random() - 0.5) * 1;
                        const screenTargetY = (Math.random() - 0.5) * 2;
                        
                        const target = new THREE.Vector3(
                            screenTargetX,
                            screenTargetY,
                            this.screen.position.z
                        );
                        
                        data.velocity = target.clone().sub(new THREE.Vector3(x, y, z)).normalize().multiplyScalar(2);
                        
                        // Update color based on path
                        const color = new THREE.Color(data.whichPath === 1 ? 0xff0000 : 0x0000ff);
                        this.particleColors[i3] = color.r;
                        this.particleColors[i3 + 1] = color.g;
                        this.particleColors[i3 + 2] = color.b;
                    } else {
                        // Interference: spread in all directions
                        const angle = (Math.random() - 0.5) * Math.PI * 0.5;
                        data.velocity.x = Math.sin(angle) * 2;
                        data.velocity.z = Math.cos(angle) * 2;
                        
                        // Neutral color
                        const color = new THREE.Color(this.colors.secondary);
                        this.particleColors[i3] = color.r;
                        this.particleColors[i3 + 1] = color.g;
                        this.particleColors[i3 + 2] = color.b;
                    }
                }
                
                // Move the particle
                this.particlePositions[i3] += data.velocity.x * delta;
                this.particlePositions[i3 + 1] += data.velocity.y * delta;
                this.particlePositions[i3 + 2] += data.velocity.z * delta;
            } else {
                // Hit screen, reset
                this.resetParticle(i);
            }
        }
        
        // Update geometry
        this.particlesGeometry.attributes.position.needsUpdate = true;
        this.particlesGeometry.attributes.color.needsUpdate = true;
        
        // Rotate eraser
        this.eraser.rotation.y += delta;
    }
}

export class IndeterminacyAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create central particle with indeterminate properties
        this.particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.particleMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            transparent: true,
            opacity: 0.8
        });
        this.particle = new THREE.Mesh(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particle);
        
        // Create property axes
        this.createPropertyAxis('position', new THREE.Vector3(-3, 0, 0), new THREE.Vector3(3, 0, 0), 0x00ff00);
        this.createPropertyAxis('momentum', new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 3, 0), 0xff0000);
        this.createPropertyAxis('energy', new THREE.Vector3(0, 0, -3), new THREE.Vector3(0, 0, 3), 0x0000ff);
        
        // Create property indicators
        this.positionIndicator = this.createIndicator(0x00ff00);
        this.momentumIndicator = this.createIndicator(0xff0000);
        this.energyIndicator = this.createIndicator(0x0000ff);
        
        // Create measurement devices
        this.positionDevice = this.createMeasurementDevice(new THREE.Vector3(-4, 0, 0), 0x00ff00);
        this.momentumDevice = this.createMeasurementDevice(new THREE.Vector3(0, -4, 0), 0xff0000);
        this.energyDevice = this.createMeasurementDevice(new THREE.Vector3(0, 0, -4), 0x0000ff);
        
        // Create uncertainty clouds
        this.positionCloud = this.createUncertaintyCloud(0x00ff00);
        this.momentumCloud = this.createUncertaintyCloud(0xff0000);
        this.energyCloud = this.createUncertaintyCloud(0x0000ff);
        
        // Animation state
        this.animationPhase = 0;
        this.phaseTimer = 0;
        this.phaseDuration = 6;
        this.measuredProperty = null;
        
        // Set camera position
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    createPropertyAxis(name, start, end, color) {
        const points = [];
        points.push(start);
        points.push(end);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color });
        
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        
        // Add axis labels
        const textGeometry = new THREE.PlaneGeometry(1, 0.3);
        const textMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.copy(end).multiplyScalar(1.2);
        this.scene.add(textMesh);
        
        return line;
    }
    
    createIndicator(color) {
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const indicator = new THREE.Mesh(geometry, material);
        indicator.visible = false;
        this.scene.add(indicator);
        return indicator;
    }
    
    createMeasurementDevice(position, color) {
        const group = new THREE.Group();
        
        // Device body
        const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
        const bodyMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Measuring component
        const compGeometry = new THREE.CylinderGeometry(0.1, 0.3, 1, 16);
        const compMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const comp = new THREE.Mesh(compGeometry, compMaterial);
        comp.rotation.x = Math.PI / 2;
        comp.position.copy(position.clone().normalize().multiplyScalar(-0.8));
        group.add(comp);
        
        group.position.copy(position);
        
        // Make it face center
        group.lookAt(0, 0, 0);
        
        // Store original position
        group.userData = {
            name: position,
            color: color,
            originalPosition: position.clone(),
            active: false
        };
        
        this.scene.add(group);
        return group;
    }
    
    createUncertaintyCloud(color) {
        const pointCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(pointCount * 3);
        
        for (let i = 0; i < pointCount; i++) {
            const i3 = i * 3;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const radius = 0.3 + Math.random() * 0.5;
            
            positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i3 + 2] = radius * Math.cos(theta);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.05,
            transparent: true,
            opacity: 0.5
        });
        
        const cloud = new THREE.Points(geometry, material);
        cloud.visible = true;
        this.scene.add(cloud);
        
        return cloud;
    }
    
    update(delta) {
        // Update phase timer
        this.phaseTimer += delta;
        if (this.phaseTimer > this.phaseDuration) {
            this.phaseTimer = 0;
            this.animationPhase = (this.animationPhase + 1) % 4;
            
            // Set measured property based on phase
            if (this.animationPhase === 1) {
                this.measuredProperty = 'position';
                this.performMeasurement(this.positionDevice, this.positionIndicator, 
                                       this.positionCloud, this.momentumCloud, this.energyCloud);
            } else if (this.animationPhase === 2) {
                this.measuredProperty = 'momentum';
                this.performMeasurement(this.momentumDevice, this.momentumIndicator,
                                       this.momentumCloud, this.positionCloud, this.energyCloud);
            } else if (this.animationPhase === 3) {
                this.measuredProperty = 'energy';
                this.performMeasurement(this.energyDevice, this.energyIndicator,
                                       this.energyCloud, this.positionCloud, this.momentumCloud);
            } else {
                this.measuredProperty = null;
                this.resetMeasurement();
            }
        }
        
        // Animate the indeterminate state when no measurement
        if (this.animationPhase === 0) {
            const time = this.clock.getElapsedTime();
            
            // Pulse the central particle
            this.particle.scale.set(
                1 + Math.sin(time * 2) * 0.2,
                1 + Math.sin(time * 2.2) * 0.2,
                1 + Math.sin(time * 1.8) * 0.2
            );
            
            // Update uncertainty clouds
            this.animateCloud(this.positionCloud, time * 0.5, 0.6);
            this.animateCloud(this.momentumCloud, time * 0.7, 0.6);
            this.animateCloud(this.energyCloud, time * 0.3, 0.6);
        }
        
        // Animate after measurement
        if (this.measuredProperty) {
            const t = this.phaseTimer / this.phaseDuration;
            
            // Gradually return to uncertainty as time passes
            if (t > 0.6) {
                const uncertainty = (t - 0.6) / 0.4;
                
                if (this.measuredProperty === 'position') {
                    this.animateCloud(this.momentumCloud, this.clock.getElapsedTime() * 0.7, uncertainty * 0.6);
                    this.animateCloud(this.energyCloud, this.clock.getElapsedTime() * 0.3, uncertainty * 0.6);
                } else if (this.measuredProperty === 'momentum') {
                    this.animateCloud(this.positionCloud, this.clock.getElapsedTime() * 0.5, uncertainty * 0.6);
                    this.animateCloud(this.energyCloud, this.clock.getElapsedTime() * 0.3, uncertainty * 0.6);
                } else if (this.measuredProperty === 'energy') {
                    this.animateCloud(this.positionCloud, this.clock.getElapsedTime() * 0.5, uncertainty * 0.6);
                    this.animateCloud(this.momentumCloud, this.clock.getElapsedTime() * 0.7, uncertainty * 0.6);
                }
            }
        }
    }
    
    animateCloud(cloud, time, scale) {
        if (!cloud.visible) return;
        
        // Animate cloud points
        const positions = cloud.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const i3 = i;
            const originalX = positions[i3];
            const originalY = positions[i3 + 1];
            const originalZ = positions[i3 + 2];
            
            const distance = Math.sqrt(originalX**2 + originalY**2 + originalZ**2);
            
            positions[i3] = originalX + Math.sin(time + i * 0.01) * 0.03;
            positions[i3 + 1] = originalY + Math.cos(time + i * 0.01) * 0.03;
            positions[i3 + 2] = originalZ + Math.sin(time * 0.7 + i * 0.01) * 0.03;
            
            // Scale based on uncertainty
            const newDistance = Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2);
            const scaleFactor = (distance * scale) / newDistance;
            
            positions[i3] *= scaleFactor;
            positions[i3 + 1] *= scaleFactor;
            positions[i3 + 2] *= scaleFactor;
        }
        
        cloud.geometry.attributes.position.needsUpdate = true;
    }
    
    performMeasurement(device, indicator, measuredCloud, uncertainCloud1, uncertainCloud2) {
        // Animate device approaching
        const originalPosition = device.position.clone();
        const targetPosition = originalPosition.clone().normalize().multiplyScalar(2);
        
        gsap.to(device.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                // Flash particle
                gsap.to(this.particleMaterial, {
                    opacity: 0.3,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
                
                // Show indicator
                const direction = originalPosition.clone().normalize();
                const position = direction.multiplyScalar(1.5);
                indicator.position.copy(position);
                indicator.visible = true;
                
                // Collapse uncertainty for other properties
                uncertainCloud1.visible = false;
                uncertainCloud2.visible = false;
                
                // Return device
                gsap.to(device.position, {
                    x: originalPosition.x,
                    y: originalPosition.y,
                    z: originalPosition.z,
                    duration: 1,
                    delay: 0.5,
                    ease: "power2.inOut"
                });
            }
        });
    }
    
    resetMeasurement() {
        // Hide indicators
        this.positionIndicator.visible = false;
        this.momentumIndicator.visible = false;
        this.energyIndicator.visible = false;
        
        // Show all clouds
        this.positionCloud.visible = true;
        this.momentumCloud.visible = true;
        this.energyCloud.visible = true;
        
        // Restore particle
        gsap.to(this.particle.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5
        });
    }
}

export class CoherenceAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create quantum system that maintains coherence
        this.coherentSystem = new THREE.Group();
        this.scene.add(this.coherentSystem);
        
        // Create central wave function
        this.waveGeometry = new THREE.TorusKnotGeometry(2, 0.4, 128, 16, 2, 3);
        this.waveMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        this.wave = new THREE.Mesh(this.waveGeometry, this.waveMaterial);
        this.coherentSystem.add(this.wave);
        
        // Create quantum state particles
        this.particlesCount = 500;
        this.particlesGeometry = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.particlesCount * 3);
        this.particleColors = new Float32Array(this.particlesCount * 3);
        
        // Initialize particles along the wave function
        for (let i = 0; i < this.particlesCount; i++) {
            const i3 = i * 3;
            
            // Sample a point on the torus knot
            const t = i / this.particlesCount * Math.PI * 2;
            const tubularSegments = 128;
            const tubularIndex = Math.floor(t / (Math.PI * 2) * tubularSegments);
            const verticesPerTubularSegment = 16;
            const baseIndex = tubularIndex * verticesPerTubularSegment;
            
            // Get position from wave geometry
            const vertices = this.waveGeometry.attributes.position.array;
            const baseVertex = baseIndex * 3;
            
            this.particlePositions[i3] = vertices[baseVertex] + (Math.random() - 0.5) * 0.1;
            this.particlePositions[i3 + 1] = vertices[baseVertex + 1] + (Math.random() - 0.5) * 0.1;
            this.particlePositions[i3 + 2] = vertices[baseVertex + 2] + (Math.random() - 0.5) * 0.1;
            
            // Assign colors (shifted along spectrum)
            const hue = i / this.particlesCount;
            const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
            this.particleColors[i3] = color.r;
            this.particleColors[i3 + 1] = color.g;
            this.particleColors[i3 + 2] = color.b;
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
        
        this.particlesMaterial = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
        this.coherentSystem.add(this.particles);
        
        // Create environment (decoherence sources)
        this.decoherenceElementsGroup = new THREE.Group();
        this.scene.add(this.decoherenceElementsGroup);
        
        // Create several decoherence elements
        this.decoherenceElements = [];
        for (let i = 0; i < 5; i++) {
            const element = this.createDecoherenceElement();
            element.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12
            );
            
            // Ensure they're not too close to center
            if (element.position.length() < 6) {
                element.position.normalize().multiplyScalar(6 + Math.random() * 2);
            }
            
            this.decoherenceElementsGroup.add(element);
            this.decoherenceElements.push({
                mesh: element,
                active: false,
                originalPosition: element.position.clone(),
                originalScale: element.scale.clone()
            });
        }
        
        // Create protective shield
        this.shieldGeometry = new THREE.SphereGeometry(4, 32, 32);
        this.shieldMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });
        this.shield = new THREE.Mesh(this.shieldGeometry, this.shieldMaterial);
        this.scene.add(this.shield);
        
        // Set up animation state
        this.coherenceState = 'protected'; // protected, threatened, broken, recovering
        this.stateTimer = 0;
        this.stateDuration = 6;
        
        // Set camera
        this.camera.position.set(0, 0, 12);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    createDecoherenceElement() {
        const group = new THREE.Group();
        
        // Create core
        const coreGeometry = new THREE.OctahedronGeometry(0.5, 0);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.8
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);
        
        // Create effect field
        const fieldGeometry = new THREE.SphereGeometry(1, 16, 16);
        const fieldMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        group.add(field);
        
        return group;
    }
    
    update(delta) {
        // Update state timer and progress state machine
        this.stateTimer += delta;
        if (this.stateTimer > this.stateDuration) {
            this.stateTimer = 0;
            
            // Cycle through states
            if (this.coherenceState === 'protected') {
                this.coherenceState = 'threatened';
                this.transitionToThreatened();
            } else if (this.coherenceState === 'threatened') {
                this.coherenceState = 'broken';
                this.transitionToBroken();
            } else if (this.coherenceState === 'broken') {
                this.coherenceState = 'recovering';
                this.transitionToRecovering();
            } else {
                this.coherenceState = 'protected';
                this.transitionToProtected();
            }
        }
        
        // Update wave and particles based on state
        if (this.coherenceState === 'protected' || this.coherenceState === 'recovering') {
            this.updateCoherentSystem(delta);
        } else {
            this.updateDecoheringSystem(delta);
        }
        
        // Rotate the entire coherent system
        this.coherentSystem.rotation.y += delta * 0.2;
        this.coherentSystem.rotation.z += delta * 0.1;
        
        // Update shield
        if (this.coherenceState === 'protected') {
            this.shield.rotation.y += delta * 0.1;
            this.shield.rotation.x += delta * 0.05;
        }
        
        // Update decoherence elements
        this.decoherenceElements.forEach(element => {
            element.mesh.rotation.x += delta * 0.5;
            element.mesh.rotation.y += delta * 0.3;
            
            // Pulse the active elements
            if (element.active) {
                const time = this.clock.getElapsedTime();
                const pulse = Math.sin(time * 3) * 0.2 + 0.8;
                element.mesh.scale.set(pulse, pulse, pulse);
                
                // Rotate around the coherent system
                if (this.coherenceState === 'threatened') {
                    const orbit = 0.5 * delta;
                    const position = element.mesh.position;
                    const distance = Math.sqrt(position.x**2 + position.z**2);
                    
                    const angle = Math.atan2(position.z, position.x) + orbit;
                    element.mesh.position.x = Math.cos(angle) * distance;
                    element.mesh.position.z = Math.sin(angle) * distance;
                }
            }
        });
    }
    
    updateCoherentSystem(delta) {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update particle positions based on wave function
        for (let i = 0; i < this.particlesCount; i++) {
            const i3 = i * 3;
            
            // Sample a point on the torus knot with time evolution
            const t = (i / this.particlesCount + time * 0.05) % 1 * Math.PI * 2;
            const tubularSegments = 128;
            const tubularIndex = Math.floor(t / (Math.PI * 2) * tubularSegments) % tubularSegments;
            const verticesPerTubularSegment = 16;
            const baseIndex = tubularIndex * verticesPerTubularSegment;
            
            // Get position from wave geometry with some randomness for quantum fluctuations
            const vertices = this.waveGeometry.attributes.position.array;
            const baseVertex = (baseIndex % (tubularSegments * verticesPerTubularSegment)) * 3;
            
            // Target position on wave function
            const targetX = vertices[baseVertex] + (Math.random() - 0.5) * 0.1;
            const targetY = vertices[baseVertex + 1] + (Math.random() - 0.5) * 0.1;
            const targetZ = vertices[baseVertex + 2] + (Math.random() - 0.5) * 0.1;
            
            // Move toward target with some coherent motion
            this.particlePositions[i3] += (targetX - this.particlePositions[i3]) * 0.1;
            this.particlePositions[i3 + 1] += (targetY - this.particlePositions[i3 + 1]) * 0.1;
            this.particlePositions[i3 + 2] += (targetZ - this.particlePositions[i3 + 2]) * 0.1;
            
            // Add some oscillation
            this.particlePositions[i3] += Math.sin(time + i * 0.1) * 0.01;
            this.particlePositions[i3 + 1] += Math.cos(time + i * 0.1) * 0.01;
            this.particlePositions[i3 + 2] += Math.sin(time * 0.7 + i * 0.1) * 0.01;
        }
        
        this.particlesGeometry.attributes.position.needsUpdate = true;
    }
    
    updateDecoheringSystem(delta) {
        // In decoherence, particles move away from wave function
        const decoherenceStrength = this.coherenceState === 'broken' ? 0.05 : 0.02;
        
        for (let i = 0; i < this.particlesCount; i++) {
            const i3 = i * 3;
            
            // Add random motion
            this.particlePositions[i3] += (Math.random() - 0.5) * decoherenceStrength;
            this.particlePositions[i3 + 1] += (Math.random() - 0.5) * decoherenceStrength;
            this.particlePositions[i3 + 2] += (Math.random() - 0.5) * decoherenceStrength;
            
            // Keep particles within bounds
            const distance = Math.sqrt(
                this.particlePositions[i3]**2 + 
                this.particlePositions[i3+1]**2 + 
                this.particlePositions[i3+2]**2
            );
            
            if (distance > 4) {
                this.particlePositions[i3] *= 0.98;
                this.particlePositions[i3 + 1] *= 0.98;
                this.particlePositions[i3 + 2] *= 0.98;
            }
        }
        
        this.particlesGeometry.attributes.position.needsUpdate = true;
    }
    
    transitionToThreatened() {
        // Animate shield disappearing
        gsap.to(this.shieldMaterial, {
            opacity: 0,
            duration: 1
        });
        
        // Activate some decoherence elements
        this.decoherenceElements.forEach((element, index) => {
            if (index < 2) { // Activate first two elements
                element.active = true;
                
                // Move element closer to coherent system
                gsap.to(element.mesh.position, {
                    x: element.originalPosition.x * 0.5,
                    y: element.originalPosition.y * 0.5,
                    z: element.originalPosition.z * 0.5,
                    duration: 2,
                    ease: "power2.inOut"
                });
            }
        });
    }
    
    transitionToBroken() {
        // Activate all decoherence elements
        this.decoherenceElements.forEach(element => {
            element.active = true;
            
            // Move elements inside coherent system
            gsap.to(element.mesh.position, {
                x: element.originalPosition.x * 0.3,
                y: element.originalPosition.y * 0.3,
                z: element.originalPosition.z * 0.3,
                duration: 1.5,
                ease: "power2.in"
            });
        });
        
        // Distort wave function
        gsap.to(this.wave.scale, {
            x: 0.7, y: 0.7, z: 0.7,
            duration: 1
        });
        
        gsap.to(this.waveMaterial, {
            opacity: 0.3,
            duration: 1
        });
    }
    
    transitionToRecovering() {
        // Deactivate and move away all decoherence elements
        this.decoherenceElements.forEach(element => {
            element.active = false;
            
            // Return to original positions
            gsap.to(element.mesh.position, {
                x: element.originalPosition.x,
                y: element.originalPosition.y,
                z: element.originalPosition.z,
                duration: 2,
                ease: "power2.out"
            });
            
            gsap.to(element.mesh.scale, {
                x: 1, y: 1, z: 1,
                duration: 1
            });
        });
        
        // Restore wave function
        gsap.to(this.wave.scale, {
            x: 1, y: 1, z: 1,
            duration: 1.5
        });
        
        gsap.to(this.waveMaterial, {
            opacity: 0.7,
            duration: 1.5
        });
    }
    
    transitionToProtected() {
        // Restore shield
        gsap.to(this.shieldMaterial, {
            opacity: 0.15,
            duration: 1
        });
    }
}

export class ZenoEffectAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create quantum system that demonstrates the Zeno effect
        this.particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.particleMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            transparent: true,
            opacity: 0.8
        });
        this.particle = new THREE.Mesh(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particle);
        
        // Create multiple states (destinations)
        this.states = [];
        this.stateCount = 5;
        this.activeState = 0;
        
        for (let i = 0; i < this.stateCount; i++) {
            const angle = (i / this.stateCount) * Math.PI * 2;
            const x = Math.cos(angle) * 4;
            const z = Math.sin(angle) * 4;
            
            const stateGeometry = new THREE.SphereGeometry(0.4, 24, 24);
            const stateMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / this.stateCount, 0.7, 0.5),
                transparent: true,
                opacity: 0.4
            });
            const state = new THREE.Mesh(stateGeometry, stateMaterial);
            state.position.set(x, 0, z);
            
            this.scene.add(state);
            this.states.push({
                mesh: state,
                position: new THREE.Vector3(x, 0, z),
                probability: 0
            });
        }
        
        // Create path to each state
        this.paths = [];
        for (let i = 0; i < this.stateCount; i++) {
            const pathGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6); // 2 points (start and end)
            
            // Will update these in the update method
            positions[0] = 0; // Start x
            positions[1] = 0; // Start y
            positions[2] = 0; // Start z
            positions[3] = this.states[i].position.x; // End x
            positions[4] = this.states[i].position.y; // End y
            positions[5] = this.states[i].position.z; // End z
            
            pathGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(i / this.stateCount, 0.7, 0.5),
                transparent: true,
                opacity: 0.2
            });
            
            const path = new THREE.Line(pathGeometry, lineMaterial);
            this.scene.add(path);
            this.paths.push({
                line: path,
                material: lineMaterial
            });
        }
        
        // Create observation device
        this.observer = this.createObserver();
        this.scene.add(this.observer);
        
        // Create wave function visualization
        this.waveGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.waveMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        this.wave = new THREE.Mesh(this.waveGeometry, this.waveMaterial);
        this.scene.add(this.wave);
        
        // Animation state
        this.zenoState = 'evolving'; // evolving, observing, frozen, released
        this.stateTimer = 0;
        this.stateDuration = 5;
        this.observationCount = 0;
        this.targetState = 1; // The state we're evolving toward
        
        // Set up camera
        this.camera.position.set(0, 8, 8);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    createObserver() {
        const group = new THREE.Group();
        
        // Observer body
        const bodyGeometry = new THREE.ConeGeometry(0.6, 1.5, 16);
        const bodyMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI;
        body.position.y = 0.75;
        group.add(body);
        
        // Observer base
        const baseGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 16);
        const baseMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        group.add(base);
        
        // Emission beam
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.2, 3, 16);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.5
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.y = -1.5;
        beam.rotation.x = Math.PI / 2;
        group.add(beam);
        
        // Store beam reference for animations
        group.beam = beam;
        
        // Position above scene
        group.position.y = 5;
        group.visible = false;
        
        return group;
    }
    
    update(delta) {
        // Update state timer and progress state machine
        this.stateTimer += delta;
        if (this.stateTimer > this.stateDuration) {
            this.stateTimer = 0;
            
            // Progress through states
            if (this.zenoState === 'evolving') {
                this.zenoState = 'observing';
                this.startObservation();
            } else if (this.zenoState === 'observing') {
                this.observationCount++;
                
                if (this.observationCount >= 3) {
                    this.zenoState = 'frozen';
                    this.transitionToFrozen();
                    this.observationCount = 0;
                } else {
                    // Continue observing
                    this.startObservation();
                }
            } else if (this.zenoState === 'frozen') {
                this.zenoState = 'released';
                this.transitionToReleased();
            } else {
                this.zenoState = 'evolving';
                this.transitionToEvolving();
                // Pick a new target state
                this.targetState = (this.targetState + 1) % this.stateCount;
            }
        }
        
        // Update based on current state
        if (this.zenoState === 'evolving') {
            this.updateEvolvingState(delta);
        } else if (this.zenoState === 'frozen') {
            this.updateFrozenState(delta);
        } else if (this.zenoState === 'released') {
            this.updateReleasedState(delta);
        }
        
        // Always update wave function
        this.updateWaveFunction(delta);
    }
    
    updateEvolvingState(delta) {
        // Gradually move toward target state
        const targetPos = this.states[this.targetState].position;
        const currentPos = this.particle.position;
        
        // Calculate evolution speed (slower at start, faster as probabilities increase)
        const evolutionSpeed = 0.2 * delta * this.speed;
        
        // Update position
        this.particle.position.x += (targetPos.x - currentPos.x) * evolutionSpeed;
        this.particle.position.y += (targetPos.y - currentPos.y) * evolutionSpeed;
        this.particle.position.z += (targetPos.z - currentPos.z) * evolutionSpeed;
        
        // Update probabilities
        this.updateStateProbabilities();
        
        // Update paths
        this.updatePaths();
    }
    
    updateFrozenState(delta) {
        // Particle is frozen in its state
        const time = this.clock.getElapsedTime();
        
        // Small vibration to show it's trying to evolve but can't
        this.particle.position.x += (Math.random() - 0.5) * 0.01;
        this.particle.position.y += (Math.random() - 0.5) * 0.01;
        this.particle.position.z += (Math.random() - 0.5) * 0.01;
        
        // Pulse to visualize being trapped
        const pulse = Math.sin(time * 5) * 0.1 + 0.9;
        this.particle.scale.set(pulse, pulse, pulse);
    }
    
    updateReleasedState(delta) {
        // Rapidly evolve to target state after being released
        const targetPos = this.states[this.targetState].position;
        const currentPos = this.particle.position;
        
        // Fast evolution
        const evolutionSpeed = 0.8 * delta * this.speed;
        
        // Update position
        this.particle.position.x += (targetPos.x - currentPos.x) * evolutionSpeed;
        this.particle.position.y += (targetPos.y - currentPos.y) * evolutionSpeed;
        this.particle.position.z += (targetPos.z - currentPos.z) * evolutionSpeed;
        
        // Update probabilities
        this.updateStateProbabilities();
        
        // Update paths
        this.updatePaths();
    }
    
    updateWaveFunction(delta) {
        const time = this.clock.getElapsedTime();
        
        // Scale wave based on state
        let targetScale;
        if (this.zenoState === 'observing') {
            // Collapse wave function during observation
            targetScale = 0.5;
        } else if (this.zenoState === 'frozen') {
            // Minimal wave function when frozen
            targetScale = 0.7;
        } else {
            // Normal wave function
            targetScale = 1 + Math.sin(time) * 0.1;
        }
        
        // Smoothly adjust wave scale
        this.wave.scale.x += (targetScale - this.wave.scale.x) * 0.1;
        this.wave.scale.y += (targetScale - this.wave.scale.y) * 0.1;
        this.wave.scale.z += (targetScale - this.wave.scale.z) * 0.1;
        
        // Update wave position to follow particle
        this.wave.position.copy(this.particle.position);
        
        // Add some periodic motion
        this.wave.rotation.x = time * 0.3;
        this.wave.rotation.y = time * 0.2;
    }
    
    updateStateProbabilities() {
        // Calculate probabilities based on distance
        let totalInverseDist = 0;
        
        this.states.forEach(state => {
            const dist = this.particle.position.distanceTo(state.position);
            state.inverseDist = 1 / (1 + dist * 0.5); // Transform distance to inverse
            totalInverseDist += state.inverseDist;
        });
        
        // Normalize
        this.states.forEach(state => {
            state.probability = state.inverseDist / totalInverseDist;
            
            // Update visualization
            const scale = 0.4 + state.probability * 0.6;
            state.mesh.scale.set(scale, scale, scale);
            
            // Update color intensity
            state.mesh.material.opacity = 0.2 + state.probability * 0.6;
        });
    }
    
    updatePaths() {
        // Update path line positions and opacity
        this.paths.forEach((path, index) => {
            const positions = path.line.geometry.attributes.position.array;
            
            // Update start point to current particle position
            positions[0] = this.particle.position.x;
            positions[1] = this.particle.position.y;
            positions[2] = this.particle.position.z;
            
            path.line.geometry.attributes.position.needsUpdate = true;
            
            // Update opacity based on probability
            path.material.opacity = 0.1 + this.states[index].probability * 0.5;
        });
    }
    
    startObservation() {
        // Show observer
        this.observer.visible = true;
        
        // Position observer above particle
        this.observer.position.x = this.particle.position.x;
        this.observer.position.z = this.particle.position.z;
        
        // Animate beam
        gsap.fromTo(this.observer.beam.material, 
            { opacity: 0 },
            { opacity: 0.7, duration: 0.5, yoyo: true, repeat: 1 }
        );
        
        // Flash particle
        gsap.fromTo(this.particleMaterial,
            { opacity: 0.8 },
            { opacity: 0.2, duration: 0.2, yoyo: true, repeat: 2 }
        );
        
        // Hide observer after observation
        gsap.to(this.observer, {
            delay: 1,
            onComplete: () => {
                this.observer.visible = false;
            }
        });
    }
    
    transitionToFrozen() {
        // Particle gets stuck in its current state
        gsap.to(this.waveMaterial, {
            opacity: 0.1,
            duration: 1
        });
        
        // Fade out paths
        this.paths.forEach(path => {
            gsap.to(path.material, {
                opacity: 0.05,
                duration: 1
            });
        });
    }
    
    transitionToReleased() {
        // Particle is released from Zeno effect
        gsap.to(this.waveMaterial, {
            opacity: 0.2,
            duration: 1
        });
        
        // Restore paths
        this.paths.forEach(path => {
            gsap.to(path.material, {
                opacity: 0.2,
                duration: 1
            });
        });
        
        // Reset particle scale
        gsap.to(this.particle.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5
        });
    }
    
    transitionToEvolving() {
        // Just ensure everything is back to normal
        gsap.to(this.particleMaterial, {
            opacity: 0.8,
            duration: 0.5
        });
    }
}

export class ContextualityAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create central quantum object
        this.quantumObjectGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.quantumObjectMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            transparent: true,
            opacity: 0.8
        });
        this.quantumObject = new THREE.Mesh(this.quantumObjectGeometry, this.quantumObjectMaterial);
        this.scene.add(this.quantumObject);
        
        // Create different measurement contexts
        this.contexts = [
            this.createContext('X', new THREE.Vector3(5, 0, 0), 0xff0000),
            this.createContext('Y', new THREE.Vector3(0, 5, 0), 0x00ff00),
            this.createContext('Z', new THREE.Vector3(0, 0, 5), 0x0000ff)
        ];
        
        // Create results visualizations
        this.resultsGroup = new THREE.Group();
        this.scene.add(this.resultsGroup);
        
        // Create results for each context
        this.results = {
            X: this.createResults(['X+', 'X-'], 0xff0000),
            Y: this.createResults(['Y+', 'Y-'], 0x00ff00),
            Z: this.createResults(['Z+', 'Z-'], 0x0000ff)
        };
        
        // Create connection lines
        this.connectionLinesGeometry = new THREE.BufferGeometry();
        this.connectionLinesPositions = new Float32Array(18); // 3 lines * 2 points * 3 coordinates
        this.connectionLinesGeometry.setAttribute('position', 
            new THREE.BufferAttribute(this.connectionLinesPositions, 3));
        
        this.connectionLinesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        this.connectionLines = new THREE.LineSegments(this.connectionLinesGeometry, this.connectionLinesMaterial);
        this.scene.add(this.connectionLines);
        
        // Set up property symbols (plus and minus)
        this.propertySymbols = {};
        ['X', 'Y', 'Z'].forEach(context => {
            this.propertySymbols[context] = {
                '+': this.createPropertySymbol('+', 0.3),
                '-': this.createPropertySymbol('-', 0.3)
            };
            
            this.propertySymbols[context]['+'].visible = false;
            this.propertySymbols[context]['-'].visible = false;
            this.scene.add(this.propertySymbols[context]['+']);
            this.scene.add(this.propertySymbols[context]['-']);
        });
        
        // Animation state
        this.animationState = 'initial'; // initial, measuring, showing, transitioning
        this.stateTimer = 0;
        this.currentContext = null;
        this.measurementResult = null;
        this.cycleIndex = 0;
        
        // Set camera
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    createContext(name, position, color) {
        const group = new THREE.Group();
        
        // Device base
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.5, 1.5);
        const baseMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        group.add(base);
        
        // Device top
        const topGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.8, 16);
        const topMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 0.65;
        group.add(top);
        
        // Device label
        const textGeometry = new THREE.PlaneGeometry(0.8, 0.8);
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.y = 0.65;
        text.position.z = 0.36;
        group.add(text);
        
        // Beam projector
        const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.rotation.x = Math.PI / 2;
        beam.position.z = -1;
        group.add(beam);
        
        // Sensor
        const sensorGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.3);
        const sensorMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
        sensor.position.z = -2;
        group.add(sensor);
        
        // Positioning
        group.position.copy(position);
        group.lookAt(0, 0, 0);
        
        // Store original position
        group.userData = {
            name: name,
            color: color,
            originalPosition: position.clone(),
            active: false
        };
        
        // Hide beam initially
        beam.visible = false;
        group.userData.beam = beam;
        
        this.scene.add(group);
        return group;
    }
    
    createResults(labels, color) {
        const group = new THREE.Group();
        
        // Create result display
        const displayGeometry = new THREE.BoxGeometry(3, 2, 0.2);
        const displayMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        group.add(display);
        
        // Create divider
        const dividerGeometry = new THREE.BoxGeometry(3, 0.05, 0.25);
        const dividerMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
        group.add(divider);
        
        // Create labels
        const topLabelGeometry = new THREE.PlaneGeometry(1, 0.5);
        const bottomLabelGeometry = new THREE.PlaneGeometry(1, 0.5);
        
        const labelMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const topLabel = new THREE.Mesh(topLabelGeometry, labelMaterial);
        topLabel.position.y = 0.7;
        topLabel.position.z = 0.11;
        
        const bottomLabel = new THREE.Mesh(bottomLabelGeometry, labelMaterial);
        bottomLabel.position.y = -0.7;
        bottomLabel.position.z = 0.11;
        
        group.add(topLabel);
        group.add(bottomLabel);
        
        // Add probability bars
        const topBarGeometry = new THREE.BoxGeometry(0.5, 0, 0.1);
        const bottomBarGeometry = new THREE.BoxGeometry(0.5, 0, 0.1);
        
        const topBarMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9
        });
        
        const bottomBarMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9
        });
        
        const topBar = new THREE.Mesh(topBarGeometry, topBarMaterial);
        topBar.position.set(-1, 0.7, 0.16);
        
        const bottomBar = new THREE.Mesh(bottomBarGeometry, bottomBarMaterial);
        bottomBar.position.set(-1, -0.7, 0.16);
        
        group.add(topBar);
        group.add(bottomBar);
        
        // Store references and data
        group.userData = {
            topBar,
            bottomBar,
            probabilities: [0.5, 0.5],
            color: color
        };
        
        group.visible = false;
        this.resultsGroup.add(group);
        
        return group;
    }
    
    createPropertySymbol(symbol, size) {
        const group = new THREE.Group();
        
        if (symbol === '+') {
            // Create plus sign
            const horizontal = new THREE.BoxGeometry(size, size/4, size/4);
            const vertical = new THREE.BoxGeometry(size/4, size, size/4);
            
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            });
            
            const hBar = new THREE.Mesh(horizontal, material);
            const vBar = new THREE.Mesh(vertical, material);
            
            group.add(hBar);
            group.add(vBar);
        } else {
            // Create minus sign
            const horizontal = new THREE.BoxGeometry(size, size/4, size/4);
            
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            });
            
            const hBar = new THREE.Mesh(horizontal, material);
            group.add(hBar);
        }
        
        return group;
    }
    
    update(delta) {
        // Update state timer and progress through states
        this.stateTimer += delta;
        
        if (this.animationState === 'initial' && this.stateTimer > 1) {
            this.animationState = 'measuring';
            this.stateTimer = 0;
            this.startMeasurement();
        } else if (this.animationState === 'measuring' && this.stateTimer > 2) {
            this.animationState = 'showing';
            this.stateTimer = 0;
            this.showResults();
        } else if (this.animationState === 'showing' && this.stateTimer > 3) {
            this.animationState = 'transitioning';
            this.stateTimer = 0;
            this.transitionToNextContext();
        } else if (this.animationState === 'transitioning' && this.stateTimer > 1) {
            this.animationState = 'measuring';
            this.stateTimer = 0;
            this.startMeasurement();
        }
        
        // Update connection lines
        this.updateConnectionLines();
        
        // Update quantum object appearance
        this.updateQuantumObject(delta);
        
        // Update result bars if showing
        if (this.animationState === 'showing') {
            this.updateResultBars(delta);
        }
    }
    
    updateQuantumObject(delta) {
        // Make the quantum object pulse and rotate
        const time = this.clock.getElapsedTime();
        
        if (this.animationState === 'measuring') {
            // Pulsate more rapidly during measurement
            const pulse = Math.sin(time * 10) * 0.2 + 0.8;
            this.quantumObject.scale.set(pulse, pulse, pulse);
            
            // Change color toward measurement context
            if (this.currentContext) {
                const contextColor = new THREE.Color(this.currentContext.userData.color);
                this.quantumObjectMaterial.color.lerp(contextColor, delta * 2);
            }
        } else {
            // Normal pulsation
            const pulse = Math.sin(time * 2) * 0.1 + 0.9;
            this.quantumObject.scale.set(pulse, pulse, pulse);
            
            // Return to original color
            const originalColor = new THREE.Color(this.colors.primary);
            this.quantumObjectMaterial.color.lerp(originalColor, delta);
        }
    }
    
    updateConnectionLines() {
        // Update line positions to connect quantum object to contexts
        let index = 0;
        this.contexts.forEach(context => {
            const i6 = index * 6; // Each line uses 6 values (2 points * 3 coordinates)
            
            // Set starting point (quantum object)
            this.connectionLinesPositions[i6] = this.quantumObject.position.x;
            this.connectionLinesPositions[i6 + 1] = this.quantumObject.position.y;
            this.connectionLinesPositions[i6 + 2] = this.quantumObject.position.z;
            
            // Set ending point (context device)
            this.connectionLinesPositions[i6 + 3] = context.position.x;
            this.connectionLinesPositions[i6 + 4] = context.position.y;
            this.connectionLinesPositions[i6 + 5] = context.position.z;
            
            index++;
        });
        
        this.connectionLinesGeometry.attributes.position.needsUpdate = true;
    }
    
    updateResultBars(delta) {
        if (!this.currentContext) return;
        
        const contextName = this.currentContext.userData.name;
        const resultGroup = this.results[contextName];
        
        // Animate result bars to match probabilities
        const currentProbs = resultGroup.userData.probabilities;
        const targetHeight1 = currentProbs[0] * 1.2;
        const targetHeight2 = currentProbs[1] * 1.2;
        
        const topBar = resultGroup.userData.topBar;
        const bottomBar = resultGroup.userData.bottomBar;
        
        // Update bar heights
        if (topBar.geometry.parameters.height !== targetHeight1) {
            // Create new geometry with updated height
            topBar.geometry.dispose();
            topBar.geometry = new THREE.BoxGeometry(0.5, targetHeight1, 0.1);
            topBar.position.y = 0.7 - (1.2 - targetHeight1) / 2;
        }
        
        if (bottomBar.geometry.parameters.height !== targetHeight2) {
            // Create new geometry with updated height
            bottomBar.geometry.dispose();
            bottomBar.geometry = new THREE.BoxGeometry(0.5, targetHeight2, 0.1);
            bottomBar.position.y = -0.7 + (1.2 - targetHeight2) / 2;
        }
    }
    
    startMeasurement() {
        // Choose context based on cycle
        const contextIndex = this.cycleIndex % this.contexts.length;
        this.currentContext = this.contexts[contextIndex];
        
        // Activate current context
        this.contexts.forEach(context => {
            context.userData.active = (context === this.currentContext);
            
            // Move active context closer
            if (context.userData.active) {
                gsap.to(context.position, {
                    x: context.userData.originalPosition.x * 0.6,
                    y: context.userData.originalPosition.y * 0.6,
                    z: context.userData.originalPosition.z * 0.6,
                    duration: 1,
                    ease: "power2.out"
                });
                
                // Show beam
                context.userData.beam.visible = true;
                gsap.to(context.userData.beam.material, {
                    opacity: 0.8,
                    duration: 0.5
                });
            } else {
                // Move inactive contexts back
                gsap.to(context.position, {
                    x: context.userData.originalPosition.x,
                    y: context.userData.originalPosition.y,
                    z: context.userData.originalPosition.z,
                    duration: 1,
                    ease: "power2.out"
                });
                
                // Hide beam
                gsap.to(context.userData.beam.material, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        context.userData.beam.visible = false;
                    }
                });
            }
        });
        
        // Hide previous result
        Object.values(this.results).forEach(result => {
            result.visible = false;
        });
        
        // Hide property symbols
        Object.values(this.propertySymbols).forEach(symbols => {
            symbols['+'].visible = false;
            symbols['-'].visible = false;
        });
        
        // "Perform" the quantum measurement
        const contextName = this.currentContext.userData.name;
        
        // Different probability patterns based on context
        let probPlus, probMinus;
        if (contextName === 'X') {
            probPlus = 0.7;
            probMinus = 0.3;
        } else if (contextName === 'Y') {
            probPlus = 0.5;
            probMinus = 0.5;
        } else {
            probPlus = 0.2;
            probMinus = 0.8;
        }
        
        // Store probabilities
        this.results[contextName].userData.probabilities = [probPlus, probMinus];
        
        // Determine result (biased by probabilities)
        this.measurementResult = Math.random() < probPlus ? '+' : '-';
        
        // Position the result symbol near the quantum object
        const symbol = this.propertySymbols[contextName][this.measurementResult];
        symbol.position.copy(this.quantumObject.position);
    }
    
    showResults() {
        if (!this.currentContext) return;
        
        const contextName = this.currentContext.userData.name;
        
        // Show result display
        this.results[contextName].visible = true;
        this.results[contextName].position.copy(this.currentContext.position);
        this.results[contextName].position.multiplyScalar(1.2);
        this.results[contextName].lookAt(0, 0, 0);
        
        // Show property symbol
        const symbol = this.propertySymbols[contextName][this.measurementResult];
        symbol.visible = true;
        
        // Animate symbol moving from quantum object to display
        gsap.to(symbol.position, {
            x: this.results[contextName].position.x * 0.8,
            y: this.results[contextName].position.y * 0.8,
            z: this.results[contextName].position.z * 0.8,
            duration: 1,
            ease: "power2.out"
        });
        
        // Scale the symbol for emphasis
        gsap.to(symbol.scale, {
            x: 1.5, y: 1.5, z: 1.5,
            duration: 0.5,
            yoyo: true,
            repeat: 1
        });
    }
    
    transitionToNextContext() {
        // Move to next context in cycle
        this.cycleIndex++;
    }
}

export class TunnelingAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create barrier
        this.barrierGeometry = new THREE.BoxGeometry(0.5, 4, 8);
        this.barrierMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0.7
        });
        this.barrier = new THREE.Mesh(this.barrierGeometry, this.barrierMaterial);
        this.scene.add(this.barrier);
        
        // Create quantum particle
        this.particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.particleMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            transparent: true,
            opacity: 0.8
        });
        this.particle = new THREE.Mesh(this.particleGeometry, this.particleMaterial);
        this.particle.position.x = -5;
        this.scene.add(this.particle);
        
        // Create wave function
        this.waveGeometry = new THREE.PlaneGeometry(10, 2, 100, 1);
        this.waveMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0.4,
            wireframe: true,
            side: THREE.DoubleSide
        });
        this.wave = new THREE.Mesh(this.waveGeometry, this.waveMaterial);
        this.wave.rotation.x = Math.PI / 2;
        this.wave.position.y = -1;
        this.scene.add(this.wave);
        
        // Create wave function inside barrier
        this.barrierWaveGeometry = new THREE.PlaneGeometry(0.5, 2, 10, 1);
        this.barrierWaveMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0.2,
            wireframe: true,
            side: THREE.DoubleSide
        });
        this.barrierWave = new THREE.Mesh(this.barrierWaveGeometry, this.barrierWaveMaterial);
        this.barrierWave.rotation.x = Math.PI / 2;
        this.barrierWave.position.y = -1;
        this.scene.add(this.barrierWave);
        
        // Create transmitted wave
        this.transmittedWaveGeometry = new THREE.PlaneGeometry(5, 2, 50, 1);
        this.transmittedWaveMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0,
            wireframe: true,
            side: THREE.DoubleSide
        });
        this.transmittedWave = new THREE.Mesh(this.transmittedWaveGeometry, this.transmittedWaveMaterial);
        this.transmittedWave.rotation.x = Math.PI / 2;
        this.transmittedWave.position.y = -1;
        this.transmittedWave.position.x = 3;
        this.scene.add(this.transmittedWave);
        
        // Create ghost particle for tunneling visualization
        this.ghostGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        this.ghostMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            transparent: true,
            opacity: 0
        });
        this.ghost = new THREE.Mesh(this.ghostGeometry, this.ghostMaterial);
        this.scene.add(this.ghost);
        
        // Animation state
        this.tunnelState = 'approaching'; // approaching, tunneling, transmitted, resetting
        this.stateTimer = 0;
        this.approachDuration = 5;
        this.tunnelingDuration = 2;
        this.transmittedDuration = 3;
        this.resetDuration = 2;
        
        // Set camera
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }
    
    update(delta) {
        // Update wave functions
        this.updateIncidentWave(delta);
        this.updateBarrierWave(delta);
        this.updateTransmittedWave(delta);
        
        // State machine for tunneling phases
        if (this.tunnelState === 'approaching') {
            this.updateApproaching(delta);
        } else if (this.tunnelState === 'tunneling') {
            this.updateTunneling(delta);
        } else if (this.tunnelState === 'transmitted') {
            this.updateTransmitted(delta);
        } else if (this.tunnelState === 'resetting') {
            this.updateResetting(delta);
        }
    }
    
    updateIncidentWave(delta) {
        const positions = this.waveGeometry.attributes.position.array;
        const time = this.clock.getElapsedTime() * this.speed;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            
            // Wave amplitude decreases near barrier
            let amplitude = 0.5;
            if (x > -3) amplitude *= (1 - (x + 3) / 3);
            if (amplitude < 0) amplitude = 0;
            
            // Wave propagation
            positions[i + 1] = Math.sin(x * 2 + time * 5) * amplitude;
        }
        
        this.waveGeometry.attributes.position.needsUpdate = true;
    }
    
    updateBarrierWave(delta) {
        const positions = this.barrierWaveGeometry.attributes.position.array;
        const time = this.clock.getElapsedTime() * this.speed;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Exponentially decaying wave inside barrier
            positions[i + 1] = Math.sin(time * 5) * 0.2 * Math.exp(-Math.abs(positions[i]) * 4);
        }
        
        this.barrierWaveGeometry.attributes.position.needsUpdate = true;
    }
    
    updateTransmittedWave(delta) {
        if (this.transmittedWaveMaterial.opacity <= 0) return;
        
        const positions = this.transmittedWaveGeometry.attributes.position.array;
        const time = this.clock.getElapsedTime() * this.speed;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            positions[i + 1] = Math.sin(x * 2 + time * 5) * 0.3;
        }
        
        this.transmittedWaveGeometry.attributes.position.needsUpdate = true;
    }
    
    updateApproaching(delta) {
        this.stateTimer += delta;
        
        // Move particle toward barrier
        const progress = Math.min(1, this.stateTimer / this.approachDuration);
        const startX = -5;
        const endX = -0.5;
        
        this.particle.position.x = startX + (endX - startX) * progress;
        this.wave.position.x = this.particle.position.x;
        
        // Decrease opacity as it approaches barrier
        if (progress > 0.7) {
            const fadeProgress = (progress - 0.7) / 0.3;
            this.particleMaterial.opacity = 0.8 * (1 - fadeProgress);
        }
        
        // Transition to tunneling
        if (progress >= 1) {
            this.tunnelState = 'tunneling';
            this.stateTimer = 0;
        }
    }
    
    updateTunneling(delta) {
        this.stateTimer += delta;
        
        // Move ghost particle through barrier
        const progress = Math.min(1, this.stateTimer / this.tunnelingDuration);
        const startX = -0.5;
        const endX = 0.5;
        
        this.ghost.position.x = startX + (endX - startX) * progress;
        this.ghost.position.y = this.particle.position.y;
        this.ghost.position.z = this.particle.position.z;
        
        // Fade in ghost at start of tunneling
        if (progress < 0.2) {
            this.ghostMaterial.opacity = progress * 0.4;
        } 
        // Maintain opacity during tunneling
        else if (progress < 0.8) {
            this.ghostMaterial.opacity = 0.4;
        } 
        // Fade out ghost at end of tunneling
        else {
            this.ghostMaterial.opacity = 0.4 * (1 - (progress - 0.8) / 0.2);
        }
        
        // Start showing transmitted wave toward end of tunneling
        if (progress > 0.8) {
            const appearProgress = (progress - 0.8) / 0.2;
            this.transmittedWaveMaterial.opacity = appearProgress * 0.4;
        }
        
        // Transition to transmitted
        if (progress >= 1) {
            this.tunnelState = 'transmitted';
            this.stateTimer = 0;
            
            // Recreate particle on other side
            this.particle.position.x = 0.5;
            this.particleMaterial.opacity = 0;
        }
    }
    
    updateTransmitted(delta) {
        this.stateTimer += delta;
        
        // Move transmitted particle away from barrier
        const progress = Math.min(1, this.stateTimer / this.transmittedDuration);
        const startX = 0.5;
        const endX = 5;
        
        this.particle.position.x = startX + (endX - startX) * progress;
        this.transmittedWave.position.x = 0.5 + (this.particle.position.x - 0.5) / 2;
        
        // Fade in particle after tunneling
        if (progress < 0.2) {
            this.particleMaterial.opacity = progress * 0.8;
        } else {
            this.particleMaterial.opacity = 0.8;
        }
        
        // Transition to resetting
        if (progress >= 1) {
            this.tunnelState = 'resetting';
            this.stateTimer = 0;
        }
    }
    
    updateResetting(delta) {
        this.stateTimer += delta;
        
        // Fade out everything
        const progress = Math.min(1, this.stateTimer / this.resetDuration);
        
        this.particleMaterial.opacity = 0.8 * (1 - progress);
        this.transmittedWaveMaterial.opacity = 0.4 * (1 - progress);
        
        // Reset at end
        if (progress >= 1) {
            this.tunnelState = 'approaching';
            this.stateTimer = 0;
            this.particle.position.x = -5;
            this.wave.position.x = -5;
            this.particleMaterial.opacity = 0.8;
            this.ghostMaterial.opacity = 0;
            this.transmittedWaveMaterial.opacity = 0;
        }
    }
}

export class VacuumFluctuationsAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    
    init() {
        // Create vacuum field
        this.vacuumGeometry = new THREE.PlaneGeometry(20, 20, 40, 40);
        this.vacuumMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.vacuum = new THREE.Mesh(this.vacuumGeometry, this.vacuumMaterial);
        this.vacuum.rotation.x = -Math.PI / 2;
        this.scene.add(this.vacuum);
        
        // Create particles for fluctuations
        this.particles = new THREE.Group();
        this.scene.add(this.particles);
        
        this.particlePool = [];
        for (let i = 0; i < 100; i++) {
            const particle = this.createParticle();
            particle.active = false;
            this.particlePool.push(particle);
        }
        
        // Set camera
        this.camera.position.set(0, 8, 12);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
        
        // Emission timer
        this.emissionTimer = 0;
        this.emissionRate = 0.2; // particles per second
    }
    
    createParticle() {
        const group = new THREE.Group();
        
        // Particle and anti-particle
        const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.secondary,
            transparent: true,
            opacity: 0
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        group.add(particle);
        
        const antiParticleMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.tertiary,
            transparent: true,
            opacity: 0
        });
        const antiParticle = new THREE.Mesh(particleGeometry, antiParticleMaterial);
        group.add(antiParticle);
        
        // Store properties
        group.particle = particle;
        group.antiParticle = antiParticle;
        group.active = false;
        group.lifetime = 0;
        group.maxLifetime = 0;
        
        this.particles.add(group);
        return group;
    }
    
    emitParticle() {
        // Find inactive particle
        const particleGroup = this.particlePool.find(p => !p.active);
        if (!particleGroup) return;
        
        // Position
        const x = (Math.random() - 0.5) * 16;
        const z = (Math.random() - 0.5) * 16;
        particleGroup.position.set(x, 0, z);
        
        // Reset
        particleGroup.particle.position.set(0, 0, 0);
        particleGroup.antiParticle.position.set(0, 0, 0);
        particleGroup.particle.material.opacity = 0;
        particleGroup.antiParticle.material.opacity = 0;
        particleGroup.scale.set(0, 0, 0);
        
        // Activate
        particleGroup.active = true;
        particleGroup.lifetime = 0;
        particleGroup.maxLifetime = 2 + Math.random() * 2;
        
        // Set random direction
        const angle = Math.random() * Math.PI * 2;
        particleGroup.direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
        
        // Animate emergence
        gsap.to(particleGroup.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.3,
            ease: "back.out"
        });
        
        gsap.to(particleGroup.particle.material, {
            opacity: 0.8,
            duration: 0.3
        });
        
        gsap.to(particleGroup.antiParticle.material, {
            opacity: 0.8,
            duration: 0.3
        });
        
        return particleGroup;
    }
    
    update(delta) {
        // Update vacuum field
        const positions = this.vacuumGeometry.attributes.position.array;
        const time = this.clock.getElapsedTime() * this.speed;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            positions[i + 1] = Math.sin(x * 0.5 + time) * 0.1 + 
                              Math.sin(z * 0.5 + time * 0.8) * 0.1;
        }
        
        this.vacuumGeometry.attributes.position.needsUpdate = true;
        
        // Emit particles
        this.emissionTimer += delta;
        if (this.emissionTimer > this.emissionRate) {
            this.emissionTimer = 0;
            this.emitParticle();
        }
        
        // Update particles
        this.particlePool.forEach(particleGroup => {
            if (!particleGroup.active) return;
            
            particleGroup.lifetime += delta;
            
            // Update particle positions
            const separation = Math.min(2, particleGroup.lifetime * 1.5);
            particleGroup.particle.position.x = separation / 2;
            particleGroup.antiParticle.position.x = -separation / 2;
            
            // Rotate to face direction
            particleGroup.rotation.y = Math.atan2(
                particleGroup.direction.x,
                particleGroup.direction.z
            );
            
            // Move the particle pair
            if (particleGroup.lifetime > 1) {
                const moveSpeed = 0.5;
                particleGroup.position.add(
                    particleGroup.direction.clone().multiplyScalar(delta * moveSpeed)
                );
            }
            
            // Fade out near end of life
            if (particleGroup.lifetime > particleGroup.maxLifetime * 0.7) {
                const fadeProgress = (particleGroup.lifetime - particleGroup.maxLifetime * 0.7) / 
                                   (particleGroup.maxLifetime * 0.3);
                const opacity = 0.8 * (1 - fadeProgress);
                
                particleGroup.particle.material.opacity = opacity;
                particleGroup.antiParticle.material.opacity = opacity;
                particleGroup.scale.multiplyScalar(0.99);
            }
            
            // Check if lifetime expired
            if (particleGroup.lifetime >= particleGroup.maxLifetime) {
                particleGroup.active = false;
            }
        });
    }
}

// NEW ANIMATION IMPLEMENTATIONS FOR VERSES 12-16

export class FluctuationAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    init() {
        // Create a cloud of particles that slightly fluctuate randomly.
        this.particleCount = 200;
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 4;
            positions[i3 + 1] = (Math.random() - 0.5) * 4;
            positions[i3 + 2] = (Math.random() - 0.5) * 4;
        }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.material = new THREE.PointsMaterial({ color: this.colors.primary, size: 0.1, transparent: true, opacity: 0.8 });
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }
    update(delta) {
        const positions = this.geometry.attributes.position.array;
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            // Apply slight random displacements scaled by delta.
            positions[i3] += (Math.random() - 0.5) * 0.02 * delta * 50;
            positions[i3 + 1] += (Math.random() - 0.5) * 0.02 * delta * 50;
            positions[i3 + 2] += (Math.random() - 0.5) * 0.02 * delta * 50;
        }
        this.geometry.attributes.position.needsUpdate = true;
        // Slow rotation of the fluctuation cloud.
        this.points.rotation.y += delta * 0.2;
    }
}

export class QubitAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    init() {
        // Create a Bloch sphere wireframe.
        this.sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        this.sphereMaterial = new THREE.MeshBasicMaterial({ color: this.colors.secondary, wireframe: true, opacity: 0.5, transparent: true });
        this.blochSphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.scene.add(this.blochSphere);
        
        // Create a state vector arrow.
        const arrowLength = 1.8;
        const arrowGeometry = new THREE.CylinderGeometry(0.05, 0.05, arrowLength, 16);
        this.arrowMaterial = new THREE.MeshBasicMaterial({ color: this.colors.tertiary });
        this.arrowShaft = new THREE.Mesh(arrowGeometry, this.arrowMaterial);
        this.arrowShaft.position.y = arrowLength / 2;
        
        const coneGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
        const cone = new THREE.Mesh(coneGeometry, this.arrowMaterial);
        cone.position.y = arrowLength + 0.15;
        
        this.stateArrow = new THREE.Group();
        this.stateArrow.add(this.arrowShaft);
        this.stateArrow.add(cone);
        this.scene.add(this.stateArrow);
        
        // Random initial orientation.
        this.stateArrow.rotation.x = Math.random() * Math.PI * 2;
        this.stateArrow.rotation.y = Math.random() * Math.PI * 2;
    }
    update(delta) {
        // Slowly rotate the Bloch sphere and animate the state vector.
        this.blochSphere.rotation.y += delta * 0.2;
        this.stateArrow.rotation.x += delta * 0.5;
        this.stateArrow.rotation.y += delta * 0.3;
    }
}

export class TimeSymmetryAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    init() {
        // Create a cube that moves back and forth to illustrate time reversal.
        this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.cubeMaterial = new THREE.MeshBasicMaterial({ color: this.colors.primary });
        this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
        this.scene.add(this.cube);
        this.cube.position.x = -3;
        // Use GSAP timeline for forward and reverse motion.
        this.timeline = gsap.timeline({ repeat: -1, yoyo: true });
        this.timeline.to(this.cube.position, { x: 3, duration: 3, ease: "power1.inOut" });
    }
    update(delta) {
        // Additional subtle rotation.
        this.cube.rotation.x += delta * 0.5;
        this.cube.rotation.y += delta * 0.5;
    }
}

export class QbismAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    init() {
        // Create a set of particles that respond to observer input.
        this.particleCount = 50;
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 6;
            positions[i3 + 1] = (Math.random() - 0.5) * 6;
            positions[i3 + 2] = (Math.random() - 0.5) * 6;
        }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.material = new THREE.PointsMaterial({ color: this.colors.secondary, size: 0.15, transparent: true, opacity: 0.7 });
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
        
        // Change particle color on mouse click to simulate observer-dependent outcomes.
        window.addEventListener('click', () => {
            const newColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            this.material.color = newColor;
        });
    }
    update(delta) {
        const positions = this.geometry.attributes.position.array;
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += (Math.random() - 0.5) * 0.01;
            positions[i3 + 1] += (Math.random() - 0.5) * 0.01;
            positions[i3 + 2] += (Math.random() - 0.5) * 0.01;
        }
        this.geometry.attributes.position.needsUpdate = true;
        this.points.rotation.y += delta * 0.2;
    }
}

export class HarmonicOscillatorAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        this.init();
        this.animate();
    }
    init() {
        // Create a simple pendulum to simulate a harmonic oscillator.
        this.anchor = new THREE.Vector3(0, 2, 0);
        this.bobGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        this.bobMaterial = new THREE.MeshBasicMaterial({ color: this.colors.secondary });
        this.bob = new THREE.Mesh(this.bobGeometry, this.bobMaterial);
        this.scene.add(this.bob);
        
        // Create a line from the anchor to the bob.
        const lineMaterial = new THREE.LineBasicMaterial({ color: this.colors.primary });
        const points = [this.anchor, new THREE.Vector3(0, 0, 0)];
        this.lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        this.line = new THREE.Line(this.lineGeometry, lineMaterial);
        this.scene.add(this.line);
        
        // Initialize pendulum properties.
        this.angle = Math.PI / 4;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.length = 2;
    }
    update(delta) {
        const gravity = 9.8;
        this.angularAcceleration = (-gravity / this.length) * Math.sin(this.angle);
        this.angularVelocity += this.angularAcceleration * delta;
        this.angle += this.angularVelocity * delta;
        this.angularVelocity *= 0.99;
        
        // Update the bob's position.
        this.bob.position.x = this.anchor.x + this.length * Math.sin(this.angle);
        this.bob.position.y = this.anchor.y - this.length * Math.cos(this.angle);
        this.bob.position.z = this.anchor.z;
        
        // Update the connecting line.
        const points = [this.anchor, this.bob.position];
        this.line.geometry.setFromPoints(points);
    }
}

// Update the animation mapping to include all implementations.
const animationMap = {
    'superposition': SuperpositionAnimation,
    'quantumField': QuantumFieldAnimation,
    'decoherence': DecoherenceAnimation,
    'entanglement': EntanglementAnimation,
    'quantumErasure': QuantumErasureAnimation,
    'indeterminacy': IndeterminacyAnimation,
    'coherence': CoherenceAnimation,
    'zenoEffect': ZenoEffectAnimation,
    'contextuality': ContextualityAnimation,
    'tunneling': TunnelingAnimation,
    'fluctuation': FluctuationAnimation,
    'qubit': QubitAnimation,
    'timeSymmetry': TimeSymmetryAnimation,
    'qbism': QbismAnimation,
    'harmonicOscillator': HarmonicOscillatorAnimation,
    'vacuumFluctuations': VacuumFluctuationsAnimation,
};

export function createAnimation(animationType, container) {
    const AnimationClass = animationMap[animationType] || SuperpositionAnimation;
    return new AnimationClass(container);
}