import * as THREE from 'three';
import gsap from 'gsap';
import { config } from './config.js';

export class AnimationManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.currentAnimation = null;
        this.animations = {};
        this.animationSpeed = config.scene.animationSpeed;
        
        // Initialize all animation types
        this.initAnimations();
    }
    
    initAnimations() {
        // Register all animations
        this.registerAnimation('particle-antiparticle', new ParticleAntiparticleAnimation(this.scene, this.camera));
        this.registerAnimation('quantum-time-evolution', new QuantumTimeEvolutionAnimation(this.scene, this.camera));
        this.registerAnimation('symmetry-breaking', new SymmetryBreakingAnimation(this.scene, this.camera));
        this.registerAnimation('quantum-coherence', new QuantumCoherenceAnimation(this.scene, this.camera));
        this.registerAnimation('vacuum-fluctuation', new VacuumFluctuationAnimation(this.scene, this.camera));
        this.registerAnimation('recursive-quantum', new RecursiveQuantumAnimation(this.scene, this.camera));
        this.registerAnimation('quantum-probability', new QuantumProbabilityAnimation(this.scene, this.camera));
        this.registerAnimation('quantum-superposition', new QuantumSuperpositionAnimation(this.scene, this.camera));
        this.registerAnimation('quantum-decay', new QuantumDecayAnimation(this.scene, this.camera));
        this.registerAnimation('quantum-persistence', new QuantumPersistenceAnimation(this.scene, this.camera));
        this.registerAnimation('decay-rates', new DecayRatesAnimation(this.scene, this.camera));
        this.registerAnimation('thermodynamic-entropy', new ThermodynamicEntropyAnimation(this.scene, this.camera));
    }
    
    registerAnimation(name, animation) {
        this.animations[name] = animation;
    }
    
    changeAnimation(animationName) {
        // Remove current animation if it exists
        if (this.currentAnimation) {
            this.currentAnimation.cleanup();
        }
        
        // Set and initialize new animation
        if (this.animations[animationName]) {
            this.currentAnimation = this.animations[animationName];
            this.currentAnimation.init();
        } else {
            console.warn(`Animation "${animationName}" not found. Defaulting to particle-antiparticle.`);
            this.currentAnimation = this.animations['particle-antiparticle'];
            this.currentAnimation.init();
        }
    }
    
    update() {
        if (this.currentAnimation) {
            this.currentAnimation.update();
        }
    }
    
    updateAnimationSpeed(speed) {
        this.animationSpeed = speed;
        if (this.currentAnimation) {
            this.currentAnimation.updateSpeed(speed);
        }
    }
}

// Base class for all animations
class BaseAnimation {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.objects = [];
        this.clock = new THREE.Clock();
        this.speed = config.scene.animationSpeed;
        this.scrollPosition = 0;
    }
    
    init() {
        // To be implemented by child classes
    }
    
    update() {
        // To be implemented by child classes
    }
    
    updateSpeed(speed) {
        this.speed = speed;
    }
    
    updateScrollPosition(position) {
        this.scrollPosition = position;
    }
    
    cleanup() {
        // Remove all objects from the scene
        for (const object of this.objects) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    for (const material of object.material) {
                        material.dispose();
                    }
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        }
        this.objects = [];
    }
}

// Verse 13: Particle-Antiparticle animation
class ParticleAntiparticleAnimation extends BaseAnimation {
    init() {
        // Create two interacting particle systems
        this.particleCount = config.performance.particleCount / 2;
        
        // Particle system 1 (particles)
        const particles1Geometry = new THREE.BufferGeometry();
        const positions1 = new Float32Array(this.particleCount * 3);
        const colors1 = new Float32Array(this.particleCount * 3);
        const sizes1 = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Position
            const radius = 30 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions1[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions1[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions1[i * 3 + 2] = radius * Math.cos(phi);
            
            // Color - bluish
            colors1[i * 3] = 0.3 + Math.random() * 0.3;
            colors1[i * 3 + 1] = 0.3 + Math.random() * 0.3;
            colors1[i * 3 + 2] = 0.7 + Math.random() * 0.3;
            
            // Size
            sizes1[i] = 2 + Math.random() * 3;
        }
        
        particles1Geometry.setAttribute('position', new THREE.BufferAttribute(positions1, 3));
        particles1Geometry.setAttribute('color', new THREE.BufferAttribute(colors1, 3));
        particles1Geometry.setAttribute('size', new THREE.BufferAttribute(sizes1, 1));
        
        const particlesMaterial1 = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem1 = new THREE.Points(particles1Geometry, particlesMaterial1);
        this.scene.add(this.particleSystem1);
        this.objects.push(this.particleSystem1);
        
        // Particle system 2 (antiparticles)
        const particles2Geometry = new THREE.BufferGeometry();
        const positions2 = new Float32Array(this.particleCount * 3);
        const colors2 = new Float32Array(this.particleCount * 3);
        const sizes2 = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Position - opposite to particles1
            const radius = 30 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions2[i * 3] = -radius * Math.sin(phi) * Math.cos(theta);
            positions2[i * 3 + 1] = -radius * Math.sin(phi) * Math.sin(theta);
            positions2[i * 3 + 2] = -radius * Math.cos(phi);
            
            // Color - reddish
            colors2[i * 3] = 0.7 + Math.random() * 0.3;
            colors2[i * 3 + 1] = 0.3 + Math.random() * 0.3;
            colors2[i * 3 + 2] = 0.3 + Math.random() * 0.3;
            
            // Size
            sizes2[i] = 2 + Math.random() * 3;
        }
        
        particles2Geometry.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
        particles2Geometry.setAttribute('color', new THREE.BufferAttribute(colors2, 3));
        particles2Geometry.setAttribute('size', new THREE.BufferAttribute(sizes2, 1));
        
        const particlesMaterial2 = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem2 = new THREE.Points(particles2Geometry, particlesMaterial2);
        this.scene.add(this.particleSystem2);
        this.objects.push(this.particleSystem2);
        
        // Create central sphere for annihilation zone
        const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        });
        
        this.centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.centralSphere);
        this.objects.push(this.centralSphere);
        
        // Add glowing effect to the central sphere
        const glowGeometry = new THREE.SphereGeometry(7, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform float time;
                void main() {
                    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    vec3 color = mix(vec3(0.5, 0.2, 0.8), vec3(0.2, 0.5, 1.0), sin(time) * 0.5 + 0.5);
                    gl_FragColor = vec4(color, 1.0) * intensity;
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(this.glow);
        this.objects.push(this.glow);
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update particles positions
        const positions1 = this.particleSystem1.geometry.attributes.position.array;
        const positions2 = this.particleSystem2.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            // Move particles slowly toward the center
            const index = i * 3;
            
            // Particle system 1
            const x1 = positions1[index];
            const y1 = positions1[index + 1];
            const z1 = positions1[index + 2];
            
            const distance1 = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
            
            if (distance1 > 5) {
                positions1[index] -= x1 * 0.01 * this.speed / distance1;
                positions1[index + 1] -= y1 * 0.01 * this.speed / distance1;
                positions1[index + 2] -= z1 * 0.01 * this.speed / distance1;
            } else {
                // "Annihilate" and respawn
                const radius = 50;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                positions1[index] = radius * Math.sin(phi) * Math.cos(theta);
                positions1[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions1[index + 2] = radius * Math.cos(phi);
            }
            
            // Particle system 2
            const x2 = positions2[index];
            const y2 = positions2[index + 1];
            const z2 = positions2[index + 2];
            
            const distance2 = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
            
            if (distance2 > 5) {
                positions2[index] -= x2 * 0.01 * this.speed / distance2;
                positions2[index + 1] -= y2 * 0.01 * this.speed / distance2;
                positions2[index + 2] -= z2 * 0.01 * this.speed / distance2;
            } else {
                // "Annihilate" and respawn
                const radius = 50;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                positions2[index] = -radius * Math.sin(phi) * Math.cos(theta);
                positions2[index + 1] = -radius * Math.sin(phi) * Math.sin(theta);
                positions2[index + 2] = -radius * Math.cos(phi);
            }
        }
        
        this.particleSystem1.geometry.attributes.position.needsUpdate = true;
        this.particleSystem2.geometry.attributes.position.needsUpdate = true;
        
        // Pulsate the central sphere
        const scale = 1 + 0.2 * Math.sin(time * 2);
        this.centralSphere.scale.set(scale, scale, scale);
        
        // Update glow effect
        this.glow.material.uniforms.time.value = time;
        this.glow.scale.set(scale, scale, scale);
    }
}

// Verse 14: Quantum Time Evolution animation
class QuantumTimeEvolutionAnimation extends BaseAnimation {
    init() {
        // Create a wave-like grid to represent quantum time evolution
        const size = 50;
        const resolution = 50;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
        
        // Use a shader material for the wave effects
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x3498db) },
                color2: { value: new THREE.Color(0x9b59b6) }
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    vUv = uv;
                    
                    // Multiple waves with different frequencies
                    float elevation1 = sin(position.x * 0.2 + time * 2.0) * 2.0;
                    float elevation2 = sin(position.y * 0.3 + time * 1.5) * 1.5;
                    float elevation3 = sin(position.x * 0.1 + position.y * 0.1 + time) * 1.0;
                    
                    // Combine waves
                    float elevation = elevation1 + elevation2 + elevation3;
                    
                    vElevation = elevation;
                    
                    vec3 newPosition = position;
                    newPosition.z += elevation;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    float mixFactor = (vElevation + 4.5) / 9.0;
                    vec3 color = mix(color1, color2, mixFactor);
                    
                    // Add brightness based on elevation
                    float brightness = (vElevation + 4.5) / 9.0;
                    color += brightness * 0.2;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            wireframe: false,
            side: THREE.DoubleSide
        });
        
        this.wavePlane = new THREE.Mesh(geometry, material);
        this.wavePlane.rotation.x = -Math.PI / 2;
        this.scene.add(this.wavePlane);
        this.objects.push(this.wavePlane);
        
        // Add floating particles above the wave
        this.particleCount = config.performance.particleCount / 2;
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(this.particleCount * 3);
        const particleColors = new Float32Array(this.particleCount * 3);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Position particles above the wave
            particlePositions[i * 3] = (Math.random() - 0.5) * size;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * size;
            particlePositions[i * 3 + 2] = Math.random() * 20;
            
            // Random colors between purple and blue
            const mixFactor = Math.random();
            particleColors[i * 3] = 0.2 + mixFactor * 0.4;     // R
            particleColors[i * 3 + 1] = 0.3 + mixFactor * 0.2; // G
            particleColors[i * 3 + 2] = 0.6 + mixFactor * 0.3; // B
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
        this.objects.push(this.particles);
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update wave shader time
        this.wavePlane.material.uniforms.time.value = time;
        
        // Update particle positions based on the wave
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            const x = positions[index];
            const y = positions[index + 1];
            
            // Calculate wave height at particle position
            const elevation1 = Math.sin(x * 0.2 + time * 2.0) * 2.0;
            const elevation2 = Math.sin(y * 0.3 + time * 1.5) * 1.5;
            const elevation3 = Math.sin(x * 0.1 + y * 0.1 + time) * 1.0;
            const waveHeight = elevation1 + elevation2 + elevation3;
            
            // Slowly move particles along the wave
            positions[index] += Math.sin(time * 0.5 + i) * 0.05;
            positions[index + 1] += Math.cos(time * 0.3 + i) * 0.05;
            
            // Keep particles within bounds
            if (positions[index] > 25) positions[index] = -25;
            if (positions[index] < -25) positions[index] = 25;
            if (positions[index + 1] > 25) positions[index + 1] = -25;
            if (positions[index + 1] < -25) positions[index + 1] = 25;
            
            // Set z position slightly above the wave
            positions[index + 2] = waveHeight + 2 + Math.sin(time + i) * 0.5;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
    }
}

// Verse 15: Symmetry Breaking animation
class SymmetryBreakingAnimation extends BaseAnimation {
    init() {
        // Create an initially symmetric structure that will break
        // Central sphere
        const sphereGeometry = new THREE.SphereGeometry(10, 64, 64);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x9c88ff,
            emissive: 0x34495e,
            specular: 0xffffff,
            shininess: 30,
            transparent: true,
            opacity: 0.8
        });
        
        this.centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.centralSphere);
        this.objects.push(this.centralSphere);
        
        // Create orbiting particles in a symmetric pattern
        this.particleCount = config.performance.particleCount;
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            // Create particle groups in symmetric rings
            const ringIndex = Math.floor(i / (this.particleCount / 5));
            const radius = 15 + ringIndex * 3;
            const ringOffset = (i % (this.particleCount / 5)) / (this.particleCount / 5) * Math.PI * 2;
            
            const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const particleMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(ringIndex * 0.1 + 0.6, 0.8, 0.5),
                emissive: new THREE.Color().setHSL(ringIndex * 0.1 + 0.6, 0.8, 0.2),
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position on ring
            particle.position.x = radius * Math.cos(ringOffset);
            particle.position.y = radius * Math.sin(ringOffset);
            particle.position.z = 0;
            
            // Store original symmetric position
            particle.userData = {
                ringIndex,
                radius,
                ringOffset,
                originalPosition: particle.position.clone(),
                breakDirection: new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ).normalize(),
                breakSpeed: 0.1 + Math.random() * 0.3,
                broken: false,
                breakTime: 10 + Math.random() * 20 // Random time when symmetry breaks
            };
            
            this.scene.add(particle);
            this.particles.push(particle);
            this.objects.push(particle);
        }
        
        // Add directional light for better visibility
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        this.scene.add(light);
        this.objects.push(light);
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Pulse the central sphere
        const pulse = 1 + 0.1 * Math.sin(time * 2);
        this.centralSphere.scale.set(pulse, pulse, pulse);
        
        // Update color based on how many particles have broken symmetry
        let brokenCount = 0;
        
        // Update particles
        for (const particle of this.particles) {
            const { ringIndex, radius, ringOffset, originalPosition, 
                   breakDirection, breakSpeed, breakTime } = particle.userData;
            
            if (time > breakTime && !particle.userData.broken) {
                // Mark as broken
                particle.userData.broken = true;
                
                // Visual effect of breaking
                gsap.to(particle.scale, {
                    x: 2,
                    y: 2, 
                    z: 2,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }
            
            if (particle.userData.broken) {
                // Move away from symmetry along break direction
                particle.position.x += breakDirection.x * breakSpeed;
                particle.position.y += breakDirection.y * breakSpeed;
                particle.position.z += breakDirection.z * breakSpeed;
                
                // Limit how far particles can go
                const distance = particle.position.length();
                if (distance > 100) {
                    // Reset back to original position with a new break direction
                    particle.position.copy(originalPosition);
                    particle.userData.breakDirection = new THREE.Vector3(
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1
                    ).normalize();
                }
                
                brokenCount++;
            } else {
                // Continue symmetric motion
                const angle = ringOffset + time * (0.5 - ringIndex * 0.05);
                particle.position.x = radius * Math.cos(angle);
                particle.position.y = radius * Math.sin(angle);
            }
        }
        
        // Change central sphere color based on symmetry breaking progress
        const breakingProgress = brokenCount / this.particles.length;
        const startColor = new THREE.Color(0x9c88ff);
        const endColor = new THREE.Color(0xff7675);
        const currentColor = startColor.clone().lerp(endColor, breakingProgress);
        
        this.centralSphere.material.color = currentColor;
        this.centralSphere.material.emissive = currentColor.clone().multiplyScalar(0.3);
    }
}

// Verse 16: Quantum Coherence animation
class QuantumCoherenceAnimation extends BaseAnimation {
    init() {
        // Create harmonious wave patterns representing quantum coherence
        this.waveGroups = [];
        
        // Create multiple wave groups that will interact
        for (let i = 0; i < 3; i++) {
            const group = new THREE.Group();
            
            // Base plane for each wave
            const size = 40;
            const resolution = 64;
            const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
            
            // Different color for each wave group
            const colors = [
                [new THREE.Color(0x3498db), new THREE.Color(0x2980b9)],
                [new THREE.Color(0x9b59b6), new THREE.Color(0x8e44ad)],
                [new THREE.Color(0x2ecc71), new THREE.Color(0x27ae60)]
            ];
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color1: { value: colors[i][0] },
                    color2: { value: colors[i][1] },
                    coherence: { value: 1.0 } // 1.0 = fully coherent, 0.0 = decoherent
                },
                vertexShader: `
                    uniform float time;
                    uniform float coherence;
                    varying vec2 vUv;
                    varying float vElevation;
                    
                    // Pseudo-random function
                    float random(vec2 st) {
                        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                    }
                    
                    void main() {
                        vUv = uv;
                        
                        // Base frequency and phase
                        float frequency = 0.2;
                        float timeScale = 1.0;
                        
                        // Coherent wave pattern
                        float coherentWave = sin(position.x * frequency + position.y * frequency + time * timeScale) * 2.0;
                        
                        // Random noise for decoherence
                        float noise = (random(position.xy + time) * 2.0 - 1.0) * 4.0;
                        
                        // Combine based on coherence value
                        float elevation = mix(noise, coherentWave, coherence);
                        
                        vElevation = elevation;
                        
                        vec3 newPosition = position;
                        newPosition.z += elevation;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                    uniform float coherence;
                    varying vec2 vUv;
                    varying float vElevation;
                    
                    void main() {
                        float mixFactor = (vElevation + 4.0) / 8.0;
                        vec3 color = mix(color1, color2, mixFactor);
                        
                        // Adjust brightness based on coherence
                        float brightness = coherence * 0.5;
                        color += brightness;
                        
                        gl_FragColor = vec4(color, 0.8);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(geometry, material);
            group.add(wave);
            
            // Position each wave group at different angles
            group.rotation.x = -Math.PI / 2;
            group.rotation.z = (i / 3) * Math.PI * 2;
            group.position.y = -10 + i * 10; // Stack them vertically
            
            this.scene.add(group);
            this.waveGroups.push({
                group,
                material,
                coherenceState: 1.0,
                targetCoherence: 1.0,
                lastStateChange: 0
            });
            this.objects.push(group);
        }
        
        // Create center glowing orb representing the coherent state
        const orbGeometry = new THREE.SphereGeometry(5, 32, 32);
        const orbMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        this.centerOrb = new THREE.Mesh(orbGeometry, orbMaterial);
        this.scene.add(this.centerOrb);
        this.objects.push(this.centerOrb);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(7, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffffff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, 1.0) * intensity;
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(this.glow);
        this.objects.push(this.glow);
        
        // Connect waves with light beams
        this.beams = [];
        for (let i = 0; i < this.waveGroups.length; i++) {
            const beamGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
            beamGeometry.translate(0, 0.5, 0); // Move origin to bottom
            
            const beamMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            beam.scale.y = 15; // Initial length
            this.scene.add(beam);
            this.beams.push(beam);
            this.objects.push(beam);
        }
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update wave animations and coherence states
        let totalCoherence = 0;
        
        for (let i = 0; i < this.waveGroups.length; i++) {
            const waveGroup = this.waveGroups[i];
            const material = waveGroup.material;
            
            // Update shader time
            material.uniforms.time.value = time;
            
            // Occasionally change coherence state
            if (time - waveGroup.lastStateChange > 5 + Math.random() * 5) {
                if (Math.random() > 0.7) {
                    // Introduce decoherence
                    waveGroup.targetCoherence = Math.random() * 0.5;
                } else {
                    // Return to coherence
                    waveGroup.targetCoherence = 0.8 + Math.random() * 0.2;
                }
                waveGroup.lastStateChange = time;
            }
            
            // Smoothly transition to target coherence
            waveGroup.coherenceState += (waveGroup.targetCoherence - waveGroup.coherenceState) * 0.02;
            material.uniforms.coherence.value = waveGroup.coherenceState;
            
            totalCoherence += waveGroup.coherenceState;
            
            // Update group rotation
            waveGroup.group.rotation.z += 0.005 * (i + 1) * waveGroup.coherenceState;
        }
        
        // Average coherence affects the center orb
        const avgCoherence = totalCoherence / this.waveGroups.length;
        
        // Update center orb based on coherence
        const orbScale = 1 + avgCoherence * 0.5 + Math.sin(time * 2) * 0.1;
        this.centerOrb.scale.set(orbScale, orbScale, orbScale);
        
        // Update orb color
        const hue = (0.6 + avgCoherence * 0.2) % 1.0; // Shift hue based on coherence
        const orbColor = new THREE.Color().setHSL(hue, 0.8, 0.5 + avgCoherence * 0.2);
        this.centerOrb.material.color = orbColor;
        this.glow.material.uniforms.color.value = orbColor;
        
        // Update glow
        this.glow.material.uniforms.time.value = time;
        this.glow.scale.set(orbScale * 1.4, orbScale * 1.4, orbScale * 1.4);
        
        // Update connection beams
        for (let i = 0; i < this.beams.length; i++) {
            const beam = this.beams[i];
            const waveGroup = this.waveGroups[i].group;
            
            // Calculate beam position and orientation to connect orb and wave
            const wavePosition = new THREE.Vector3();
            waveGroup.getWorldPosition(wavePosition);
            
            // Place beam to point from center orb to wave
            beam.position.copy(this.centerOrb.position);
            beam.lookAt(wavePosition);
            
            // Calculate distance and scale beam length
            const distance = this.centerOrb.position.distanceTo(wavePosition);
            beam.scale.y = distance;
            
            // Adjust beam opacity based on coherence
            beam.material.opacity = 0.2 + this.waveGroups[i].coherenceState * 0.4;
        }
    }
}

// Verse 17: Vacuum Fluctuation animation
class VacuumFluctuationAnimation extends BaseAnimation {
    init() {
        // Create "vacuum" background
        this.particleCount = config.performance.particleCount;
        const vacuumGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const colors = new Float32Array(this.particleCount * 3);
        
        // Initialize particles in a large volume representing vacuum
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Positions in a large sphere
            const radius = 100 * Math.cbrt(Math.random()); // Uniform distribution in sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Very small sizes for vacuum "dust"
            sizes[i] = 0.1 + Math.random() * 0.2;
            
            // Dark blue/purple for vacuum
            colors[i3] = 0.1 + Math.random() * 0.1;
            colors[i3 + 1] = 0.0 + Math.random() * 0.1;
            colors[i3 + 2] = 0.2 + Math.random() * 0.1;
        }
        
        vacuumGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        vacuumGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        vacuumGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Custom shader for vacuum particles
        const vacuumMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    
                    // Subtle movement in vacuum
                    vec3 pos = position;
                    pos.x += sin(time * 0.2 + position.y * 0.05) * 0.5;
                    pos.y += cos(time * 0.2 + position.x * 0.05) * 0.5;
                    pos.z += sin(time * 0.2 + position.z * 0.05) * 0.5;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Circular particles
                    vec2 xy = gl_PointCoord.xy - vec2(0.5);
                    float radius = length(xy);
                    if(radius > 0.5) discard;
                    
                    // Soften edges
                    float alpha = 0.5 * smoothstep(0.5, 0.3, radius);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        this.vacuumParticles = new THREE.Points(vacuumGeometry, vacuumMaterial);
        this.scene.add(this.vacuumParticles);
        this.objects.push(this.vacuumParticles);
        
        // Create particle systems for quantum fluctuations
        this.fluctuations = [];
        this.maxFluctuations = 10;
        
        for (let i = 0; i < this.maxFluctuations; i++) {
            this.createFluctuation();
        }
    }
    
    createFluctuation() {
        // Random position for fluctuation
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80
        );
        
        // Create particle pair
        const particleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        
        // Particle A (like matter)
        const particleAMaterial = new THREE.MeshBasicMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0
        });
        
        const particleA = new THREE.Mesh(particleGeometry, particleAMaterial);
        particleA.position.copy(position);
        particleA.scale.set(0, 0, 0);
        this.scene.add(particleA);
        
        // Particle B (like antimatter)
        const particleBMaterial = new THREE.MeshBasicMaterial({
            color: 0xe74c3c,
            transparent: true,
            opacity: 0
        });
        
        const particleB = new THREE.Mesh(particleGeometry, particleBMaterial);
        particleB.position.copy(position);
        particleB.scale.set(0, 0, 0);
        this.scene.add(particleB);
        
        // Add glow effects
        const glowGeometry = new THREE.SphereGeometry(1, 16, 16);
        
        const glowAMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0x3498db) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, 1.0) * intensity;
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        
        const glowA = new THREE.Mesh(glowGeometry, glowAMaterial);
        particleA.add(glowA);
        
        const glowBMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xe74c3c) }
            },
            vertexShader: glowAMaterial.vertexShader,
            fragmentShader: glowAMaterial.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        
        const glowB = new THREE.Mesh(glowGeometry, glowBMaterial);
        particleB.add(glowB);
        
        // Fluctuation lifecycle
        const lifespan = 2 + Math.random() * 3; // How long fluctuation exists
        const direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();
        
        const fluctuation = {
            particleA,
            particleB,
            glowA,
            glowB,
            position,
            direction,
            birthTime: this.clock.getElapsedTime(),
            lifespan,
            state: "emerging" // emerging, existing, annihilating
        };
        
        // Birth animation
        gsap.to(particleA.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5,
            ease: "back.out"
        });
        
        gsap.to(particleB.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5,
            ease: "back.out"
        });
        
        gsap.to(particleAMaterial, {
            opacity: 1,
            duration: 0.5
        });
        
        gsap.to(particleBMaterial, {
            opacity: 1,
            duration: 0.5
        });
        
        this.fluctuations.push(fluctuation);
        this.objects.push(particleA, particleB);
    }
    
    removeFluctuation(fluctuation) {
        // Death animation
        gsap.to(fluctuation.particleA.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.5,
            ease: "back.in"
        });
        
        gsap.to(fluctuation.particleB.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.5,
            ease: "back.in"
        });
        
        gsap.to(fluctuation.particleA.material, {
            opacity: 0,
            duration: 0.5
        });
        
        gsap.to(fluctuation.particleB.material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                // Remove from scene
                this.scene.remove(fluctuation.particleA);
                this.scene.remove(fluctuation.particleB);
                
                // Remove from tracking arrays
                const index = this.fluctuations.indexOf(fluctuation);
                if (index > -1) {
                    this.fluctuations.splice(index, 1);
                }
                
                // Create a new fluctuation
                if (Math.random() > 0.3) {
                    this.createFluctuation();
                }
            }
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update vacuum particles
        this.vacuumParticles.material.uniforms.time.value = time;
        
        // Update fluctuations
        for (let i = this.fluctuations.length - 1; i >= 0; i--) {
            const fluctuation = this.fluctuations[i];
            const age = time - fluctuation.birthTime;
            
            if (age > fluctuation.lifespan) {
                // Time to annihilate
                if (fluctuation.state !== "annihilating") {
                    fluctuation.state = "annihilating";
                    this.removeFluctuation(fluctuation);
                }
                continue;
            }
            
            // Particles move away from each other
            const moveDistance = 0.05;
            fluctuation.particleA.position.add(
                fluctuation.direction.clone().multiplyScalar(moveDistance)
            );
            fluctuation.particleB.position.add(
                fluctuation.direction.clone().multiplyScalar(-moveDistance)
            );
            
            // Particles slowly orbit around their center
            const center = fluctuation.position.clone();
            const aPos = fluctuation.particleA.position.clone();
            const bPos = fluctuation.particleB.position.clone();
            
            const aToCenter = center.clone().sub(aPos);
            const bToCenter = center.clone().sub(bPos);
            
            const aOrbit = new THREE.Vector3().crossVectors(aToCenter, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(0.03);
            const bOrbit = new THREE.Vector3().crossVectors(bToCenter, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(0.03);
            
            fluctuation.particleA.position.add(aOrbit);
            fluctuation.particleB.position.add(bOrbit);
            
            // Pulse glow based on age
            const glowPulse = 1 + 0.2 * Math.sin(age * 5);
            fluctuation.glowA.scale.set(glowPulse, glowPulse, glowPulse);
            fluctuation.glowB.scale.set(glowPulse, glowPulse, glowPulse);
        }
        
        // Occasionally create new fluctuations
        if (this.fluctuations.length < this.maxFluctuations && Math.random() < 0.03) {
            this.createFluctuation();
        }
    }
}

// Verse 18: Recursive Quantum animation
class RecursiveQuantumAnimation extends BaseAnimation {
    init() {
        this.connectionLines = []; // Initialize connectionLines array
        // Create a fractal system to represent recursive quantum processes
        this.fractalDepth = 4;
        this.rootNode = new THREE.Group();
        this.scene.add(this.rootNode);
        this.objects.push(this.rootNode);
        
        // Initialize root object
        const rootGeometry = new THREE.IcosahedronGeometry(10, 0);
        const rootMaterial = new THREE.MeshPhongMaterial({
            color: 0x9b59b6,
            emissive: 0x6c3483,
            shininess: 30,
            flatShading: true
        });
        
        this.rootObject = new THREE.Mesh(rootGeometry, rootMaterial);
        this.rootNode.add(this.rootObject);
        
        // Create fractal structure
        this.createFractalNode(this.rootObject, this.fractalDepth, 10);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
        this.objects.push(ambientLight);
        
        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
        pointLight.position.set(50, 50, 50);
        this.scene.add(pointLight);
        this.objects.push(pointLight);
        
        // Add connection lines between fractal elements
        this.connectionLines = [];
        
        // Add particles to visualize energy flow in the fractal
        this.flowParticles = [];
        this.initFlowParticles();
    }
    
    createFractalNode(parentNode, depth, size) {
        if (depth <= 0) return;
        
        // Number of child nodes
        const childCount = 3;
        
        // Create child nodes around the parent
        for (let i = 0; i < childCount; i++) {
            // Child size is smaller
            const childSize = size * 0.4;
            
            // Position around parent in a spiral pattern
            const angle = (i / childCount) * Math.PI * 2;
            const radius = size * 1.5;
            const height = size * (i / childCount - 0.5) * 0.5;
            
            const childGeometry = new THREE.IcosahedronGeometry(childSize, 0);
            
            // Color varies by depth
            const hue = 0.7 + (depth / this.fractalDepth) * 0.3;
            const childColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
            const emissiveColor = new THREE.Color().setHSL(hue, 0.8, 0.2);
            
            const childMaterial = new THREE.MeshPhongMaterial({
                color: childColor,
                emissive: emissiveColor,
                shininess: 30,
                flatShading: true
            });
            
            const childNode = new THREE.Mesh(childGeometry, childMaterial);
            
            // Position relative to parent
            childNode.position.x = Math.cos(angle) * radius;
            childNode.position.y = height;
            childNode.position.z = Math.sin(angle) * radius;
            
            // Store parent reference and ensure parent exists before creating child
            if (parentNode) {
                childNode.userData = {
                    parent: parentNode,
                    depth: depth,
                    index: i,
                    originalPosition: childNode.position.clone(),
                    phaseOffset: Math.random() * Math.PI * 2
                };
                
                parentNode.add(childNode);
                
                // Create line to connect parent and child
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    childNode.position
                ]);
                
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: childColor,
                    transparent: true,
                    opacity: 0.5
                });
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                parentNode.add(line);
                this.connectionLines.push({ line, parent: parentNode, child: childNode });
                
                // Recursively create children for this node
                this.createFractalNode(childNode, depth - 1, childSize);
            }
        }
    }
    
    initFlowParticles() {
        const particleCount = config.performance.particleCount / 2;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Random positions within the fractal volume
        for (let i = 0; i < particleCount; i++) {
            const radius = 50 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Color based on distance from center
            const distance = radius / 50;
            colors[i * 3] = 0.7 + distance * 0.3; // R
            colors[i * 3 + 1] = 0.3 + distance * 0.4; // G
            colors[i * 3 + 2] = 0.7 - distance * 0.3; // B
            
            // Size
            sizes[i] = 0.5 + Math.random() * 1.5;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.rootNode.add(this.particles);
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Rotate entire fractal
        this.rootNode.rotation.y = time * 0.1;
        this.rootNode.rotation.x = Math.sin(time * 0.2) * 0.2;
        
        // Update all meshes in the fractal
        this.updateFractalNode(this.rootObject, time);
        
        // Update flow particles
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;
            
            // Get current position
            const x = positions[i3];
            const y = positions[i3 + 1];
            const z = positions[i3 + 2];
            
            // Distance from center
            const distance = Math.sqrt(x*x + y*y + z*z);
            
            // Spiral motion toward center
            const angle = 0.01 * Math.sin(distance * 0.1 + time);
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            
            // Move slightly inward
            const newDist = distance - 0.1;
            if (newDist < 5) {
                // Respawn at outer edge when reaching center
                const radius = 50;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);
            } else {
                // Apply spiral movement
                positions[i3] = cosAngle * x - sinAngle * z;
                positions[i3 + 2] = sinAngle * x + cosAngle * z;
                
                // Normalize and scale to new distance
                const newLength = Math.sqrt(positions[i3]*positions[i3] + positions[i3+2]*positions[i3+2]);
                positions[i3] = positions[i3] / newLength * newDist;
                positions[i3 + 2] = positions[i3 + 2] / newLength * newDist;
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    updateFractalNode(node, time) {
        if (!node.children) return;
        
        // For each child that is a mesh
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            
            if (child.isMesh && child.userData && child.userData.originalPosition) {
                // Get original position
                const origPos = child.userData.originalPosition;
                const depth = child.userData.depth;
                const phaseOffset = child.userData.phaseOffset;
                
                // Calculate oscillation
                const frequency = 1 - depth / (this.fractalDepth * 2); // Higher frequency for outer nodes
                const amplitude = 0.2 * depth;
                
                // Apply oscillation
                child.position.x = origPos.x + Math.sin(time * frequency + phaseOffset) * amplitude;
                child.position.y = origPos.y + Math.cos(time * frequency + phaseOffset) * amplitude;
                child.position.z = origPos.z + Math.sin(time * frequency * 0.7 + phaseOffset) * amplitude;
                
                // Update connection lines
                this.updateConnectionLines(child, time);
                
                // Recursive update for children
                this.updateFractalNode(child, time);
            }
        }
    }
    
    updateConnectionLines(node, time) {
        // Find and update connection lines
        for (const connection of this.connectionLines) {
            if (connection.child === node) {
                // Update line geometry
                const points = [
                    new THREE.Vector3(0, 0, 0),
                    node.position.clone()
                ];
                
                connection.line.geometry.setFromPoints(points);
                connection.line.geometry.verticesNeedUpdate = true;
                
                // Pulsate line opacity based on time and depth
                const depth = node.userData.depth;
                const phaseOffset = node.userData.phaseOffset;
                connection.line.material.opacity = 0.3 + 0.4 * Math.sin(time * 2 + depth + phaseOffset);
            }
        }
    }
}

// Verse 19: Quantum Probability animation 
class QuantumProbabilityAnimation extends BaseAnimation {
    init() {
        // Create a visualization of quantum probability clouds
        // Main probability field
        this.fieldResolution = 20;
        this.fieldSize = 50;
        this.field = new THREE.Group();
        this.scene.add(this.field);
        this.objects.push(this.field);
        
        // Create probability field
        this.createProbabilityField();
        
        // Create "dice" particles that represent random quantum events
        this.diceCount = 50;
        this.dice = [];
        this.createDiceParticles();
        
        // Add directional light for better visualization
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        this.objects.push(directionalLight);
    }
    
    createProbabilityField() {
        // Create a 3D grid of small spheres representing probability
        const spacing = this.fieldSize / this.fieldResolution;
        
        for (let x = 0; x < this.fieldResolution; x++) {
            for (let y = 0; y < this.fieldResolution; y++) {
                for (let z = 0; z < this.fieldResolution; z++) {
                    // Position in grid
                    const xPos = (x - this.fieldResolution / 2) * spacing;
                    const yPos = (y - this.fieldResolution / 2) * spacing;
                    const zPos = (z - this.fieldResolution / 2) * spacing;
                    
                    // Calculate distance from center for probability
                    const centerDistance = Math.sqrt(xPos*xPos + yPos*yPos + zPos*zPos);
                    
                    // Higher probability near center, lower at edges
                    const probability = Math.max(0, 1 - centerDistance / (this.fieldSize / 2));
                    
                    // Skip low probability areas for performance
                    if (probability < 0.1) continue;
                    
                    // Create sphere
                    const sphereGeometry = new THREE.SphereGeometry(spacing * 0.2 * probability, 8, 8);
                    
                    // Color based on position and probability
                    const hue = 0.6 + (x / this.fieldResolution) * 0.2;
                    const saturation = 0.5 + probability * 0.5;
                    const lightness = 0.4 + probability * 0.3;
                    
                    const color = new THREE.Color().setHSL(hue, saturation, lightness);
                    
                    const sphereMaterial = new THREE.MeshPhongMaterial({
                        color: color,
                        transparent: true,
                        opacity: probability * 0.7
                    });
                    
                    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    sphere.position.set(xPos, yPos, zPos);
                    
                    // Store original values for animation
                    sphere.userData = {
                        originalSize: spacing * 0.2 * probability,
                        originalPosition: new THREE.Vector3(xPos, yPos, zPos),
                        probability: probability,
                        phaseOffset: Math.random() * Math.PI * 2
                    };
                    
                    this.field.add(sphere);
                }
            }
        }
    }
    
    createDiceParticles() {
        // Create visual representations of quantum "dice" (random outcomes)
        for (let i = 0; i < this.diceCount; i++) {
            // Random color for each die
            const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
            
            // Create a geometric shape
            const geometries = [
                new THREE.TetrahedronGeometry(1),
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.OctahedronGeometry(1)
            ];
            
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
                flatShading: true
            });
            
            const die = new THREE.Mesh(geometry, material);
            
            // Random initial position within probability field
            const radius = this.fieldSize / 2 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            die.position.x = radius * Math.sin(phi) * Math.cos(theta);
            die.position.y = radius * Math.sin(phi) * Math.sin(theta);
            die.position.z = radius * Math.cos(phi);
            
            // Store values for animation
            die.userData = {
                originalPosition: die.position.clone(),
                targetPosition: null,
                moveSpeed: 0.05 + Math.random() * 0.1,
                rotationAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize(),
                rotationSpeed: 0.02 + Math.random() * 0.05,
                lastTargetTime: 0
            };
            
            this.scene.add(die);
            this.dice.push(die);
            this.objects.push(die);
        }
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update probability field
        for (const child of this.field.children) {
            if (child.isMesh) {
                const { originalSize, originalPosition, probability, phaseOffset } = child.userData;
                
                // Pulsate size based on time
                const sizeFactor = 1 + 0.2 * Math.sin(time * 2 + phaseOffset);
                child.scale.set(sizeFactor, sizeFactor, sizeFactor);
                
                // Slight position wobble
                const wobbleAmount = 0.1 * probability;
                child.position.x = originalPosition.x + Math.sin(time + phaseOffset) * wobbleAmount;
                child.position.y = originalPosition.y + Math.cos(time * 1.3 + phaseOffset) * wobbleAmount;
                child.position.z = originalPosition.z + Math.sin(time * 0.7 + phaseOffset * 2) * wobbleAmount;
                
                // Change opacity based on probability and time
                child.material.opacity = probability * (0.5 + 0.3 * Math.sin(time + phaseOffset));
            }
        }
        
        // Update dice particles
        for (const die of this.dice) {
            const {
                targetPosition,
                moveSpeed,
                rotationAxis,
                rotationSpeed,
                lastTargetTime
            } = die.userData;
            
            // Set new random target occasionally
            if (!targetPosition || time - lastTargetTime > 3 + Math.random() * 2) {
                // New target within probability field
                // Higher chance of moving toward center (where probability is higher)
                const distanceFromCenter = 0.2 + 0.8 * Math.random() * Math.random(); // Squared to bias toward center
                const radius = (this.fieldSize / 2) * distanceFromCenter;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                die.userData.targetPosition = new THREE.Vector3(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                );
                
                die.userData.lastTargetTime = time;
                
                // Visual feedback for new direction
                gsap.to(die.scale, {
                    x: 1.5, y: 1.5, z: 1.5,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
            
            // Move toward target
            const target = die.userData.targetPosition;
            const direction = new THREE.Vector3()
                .subVectors(target, die.position)
                .normalize();
            
            die.position.add(direction.multiplyScalar(moveSpeed));
            
            // Rotate die
            die.rotateOnAxis(rotationAxis, rotationSpeed);
            
            // If close to target, increase rotation speed temporarily
            const distanceToTarget = die.position.distanceTo(target);
            if (distanceToTarget < 1) {
                die.rotateOnAxis(rotationAxis, rotationSpeed * 3);
                
                // Change color slightly
                const h = die.material.color.getHSL({}).h;
                const s = die.material.color.getHSL({}).s;
                const l = die.material.color.getHSL({}).l;
                
                die.material.color.setHSL(
                    (h + 0.01) % 1,
                    s,
                    l
                );
            }
            
            // If very close to target, set new target
            if (distanceToTarget < 0.2) {
                die.userData.targetPosition = null;
            }
        }
        
        // Slowly rotate the entire probability field
        this.field.rotation.y = time * 0.1;
    }
}

// Verse 20: Quantum Superposition animation
class QuantumSuperpositionAnimation extends BaseAnimation {
    init() {
        // Create a visualization of Schrödinger's cat state
        
        // Create a box to represent the quantum box
        const boxGeometry = new THREE.BoxGeometry(40, 20, 30);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(this.box);
        this.objects.push(this.box);
        
        // Create cat silhouettes in superposition
        this.createCatSilhouettes();
        
        // Create wave function visualization
        this.createWaveFunction();
        
        // Add point light to illuminate the scene
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 20, 20);
        this.scene.add(light);
        this.objects.push(light);
    }
    
    createCatSilhouettes() {
        // Cat silhouette 1 - "alive" state
        const catAliveGroup = new THREE.Group();
        
        // Simple cat shape made of primitives
        const catBody = new THREE.Mesh(
            new THREE.SphereGeometry(7, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0x2ecc71, // Green for alive
                transparent: true,
                opacity: 0.7
            })
        );
        catBody.scale.set(1.5, 1, 1);
        catAliveGroup.add(catBody);
        
        // Cat head
        const catHead = new THREE.Mesh(
            new THREE.SphereGeometry(3.5, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0x2ecc71,
                transparent: true,
                opacity: 0.7
            })
        );
        catHead.position.set(8, 2, 0);
        catAliveGroup.add(catHead);
        
        // Cat ears
        const earGeometry = new THREE.ConeGeometry(1, 2, 4);
        
        const earLeft = new THREE.Mesh(
            earGeometry,
            new THREE.MeshPhongMaterial({
                color: 0x2ecc71,
                transparent: true,
                opacity: 0.7
            })
        );
        earLeft.position.set(9, 5, -1.5);
        earLeft.rotation.x = -Math.PI / 4;
        earLeft.rotation.z = -Math.PI / 4;
        catAliveGroup.add(earLeft);
        
        const earRight = new THREE.Mesh(
            earGeometry,
            new THREE.MeshPhongMaterial({
                color: 0x2ecc71,
                transparent: true,
                opacity: 0.7
            })
        );
        earRight.position.set(9, 5, 1.5);
        earRight.rotation.x = Math.PI / 4;
        earRight.rotation.z = -Math.PI / 4;
        catAliveGroup.add(earRight);
        
        // Cat tail
        const catTail = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 7, 8),
            new THREE.MeshPhongMaterial({
                color: 0x2ecc71,
                transparent: true,
                opacity: 0.7
            })
        );
        catTail.position.set(-9, 3, 0);
        catTail.rotation.z = Math.PI / 4;
        catAliveGroup.add(catTail);
        
        // Position cat
        catAliveGroup.position.set(-5, -2, -5);
        this.scene.add(catAliveGroup);
        this.objects.push(catAliveGroup);
        this.catAlive = catAliveGroup;
        
        // Cat silhouette 2 - "dead" state
        const catDeadGroup = new THREE.Group();
        
        // Similar structure but different orientation
        const deadBody = new THREE.Mesh(
            new THREE.SphereGeometry(7, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0xe74c3c, // Red for dead
                transparent: true,
                opacity: 0.7
            })
        );
        deadBody.scale.set(1.5, 0.7, 1);
        catDeadGroup.add(deadBody);
        
        // Cat head
        const deadHead = new THREE.Mesh(
            new THREE.SphereGeometry(3.5, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0xe74c3c,
                transparent: true,
                opacity: 0.7
            })
        );
        deadHead.position.set(8, 0, 0);
        catDeadGroup.add(deadHead);
        
        // X eyes
        const xEyeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        
        const xEyeLeft = new THREE.Mesh(
            xEyeGeometry,
            new THREE.MeshPhongMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.9
            })
        );
        xEyeLeft.position.set(9, 1, -1.5);
        xEyeLeft.rotation.z = Math.PI / 4;
        catDeadGroup.add(xEyeLeft);
        
        const xEyeRight = new THREE.Mesh(
            xEyeGeometry,
            new THREE.MeshPhongMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.9
            })
        );
        xEyeRight.position.set(9, 1, 1.5);
        xEyeRight.rotation.z = Math.PI / 4;
        catDeadGroup.add(xEyeRight);
        
        // Position cat
        catDeadGroup.position.set(-5, -2, 5);
        this.scene.add(catDeadGroup);
        this.objects.push(catDeadGroup);
        this.catDead = catDeadGroup;
    }
    
    createWaveFunction() {
        // Create a sine wave that connects both states
        const wavePointCount = 100;
        const pathPoints = [];
        
        for (let i = 0; i < wavePointCount; i++) {
            const t = i / (wavePointCount - 1);
            const x = (t - 0.5) * 40;
            
            // S-curve to connect both cats
            const z = 10 * (2 * t - 1) * (t - 0.5) * (t - 1);
            
            pathPoints.push(new THREE.Vector3(x, 0, z));
        }
        
        const path = new THREE.CatmullRomCurve3(pathPoints);
        
        // Create a tube geometry based on the path
        const tubeGeometry = new THREE.TubeGeometry(
            path,
            100,  // path segments
            0.5,  // tube radius
            8,    // radial segments
            false // closed
        );
        
        // Create a custom material for the wave
        const waveMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x2ecc71) }, // Green
                color2: { value: new THREE.Color(0xe74c3c) }  // Red
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    // Add wave movement
                    vec3 pos = position;
                    pos.y += sin(pos.x * 0.2 + time * 3.0) * 2.0;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    // Mix between the two colors based on position and time
                    float mix_factor = sin(vPosition.x * 0.1 + time * 2.0) * 0.5 + 0.5;
                    vec3 final_color = mix(color1, color2, mix_factor);
                    
                    // Add pulsing glow effect
                    float pulse = sin(time * 3.0) * 0.15 + 0.85;
                    final_color *= pulse;
                    
                    gl_FragColor = vec4(final_color, 0.6);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.wave = new THREE.Mesh(tubeGeometry, waveMaterial);
        this.scene.add(this.wave);
        this.objects.push(this.wave);
        
        // Add particles flowing along the wave
        this.particleCount = 100;
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            const t = i / this.particleCount;
            
            const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            
            // Interpolate color between green and red
            const color = new THREE.Color().lerpColors(
                new THREE.Color(0x2ecc71),
                new THREE.Color(0xe74c3c),
                t
            );
            
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position along path
            const point = path.getPoint(t);
            particle.position.copy(point);
            
            // Store path position for animation
            particle.userData = {
                tPosition: t,
                speed: 0.001 + Math.random() * 0.002
            };
            
            this.scene.add(particle);
            this.particles.push(particle);
            this.objects.push(particle);
        }
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update box pulsing
        const boxPulse = 1 + 0.05 * Math.sin(time * 2);
        this.box.scale.set(boxPulse, boxPulse, boxPulse);
        
        // Update cats' opacity based on sine wave - phasing in and out
        const aliveOpacity = 0.4 + 0.3 * Math.sin(time);
        const deadOpacity = 0.4 + 0.3 * Math.sin(time + Math.PI);
        
        this.catAlive.children.forEach(part => {
            if (part.material) part.material.opacity = aliveOpacity;
        });
        
        this.catDead.children.forEach(part => {
            if (part.material) part.material.opacity = deadOpacity;
        });
        
        // Update cat positioning - subtle movement
        this.catAlive.position.y = -2 + Math.sin(time) * 0.5;
        this.catDead.position.y = -2 + Math.sin(time + Math.PI) * 0.5;
        
        // Update wave function
        this.wave.material.uniforms.time.value = time;
        
        // Update particles along wave
        for (const particle of this.particles) {
            // Update position along path
            particle.userData.tPosition += particle.userData.speed;
            
            // Loop back to beginning when reaching the end
            if (particle.userData.tPosition > 1) {
                particle.userData.tPosition -= 1;
            }
            
            // Get new position from path
            const point = this.wave.geometry.parameters.path.getPoint(particle.userData.tPosition);
            
            // Add wave height offset
            point.y += Math.sin(point.x * 0.2 + time * 3.0) * 2.0;
            
            // Update position
            particle.position.copy(point);
            
            // Update size based on position - bigger in the middle
            const sizeFactor = 1 - 2 * Math.abs(particle.userData.tPosition - 0.5);
            particle.scale.set(sizeFactor + 0.5, sizeFactor + 0.5, sizeFactor + 0.5);
            
            // Update opacity
            particle.material.opacity = 0.5 + 0.5 * sizeFactor;
        }
        
        // Rotate the entire scene slightly
        this.box.rotation.y = time * 0.1;
        this.catAlive.rotation.y = time * 0.1;
        this.catDead.rotation.y = time * 0.1;
        this.wave.rotation.y = time * 0.1;
        
        // Move particles with the rotation
        for (const particle of this.particles) {
            particle.rotation.y = time * 0.1;
        }
    }
}

// Verse 21: Quantum Decay animation
class QuantumDecayAnimation extends BaseAnimation {
    init() {
        // Create a visualization of particle decay
        
        // Create a central unstable particle
        const coreGeometry = new THREE.IcosahedronGeometry(8, 1);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: 0xf39c12,
            emissive: 0xe67e22,
            shininess: 30,
            transparent: true,
            opacity: 0.9
        });
        
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(this.core);
        this.objects.push(this.core);
        
        // Add glow effect to core
        const glowGeometry = new THREE.SphereGeometry(10, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xf39c12) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    vec3 glow = color * intensity;
                    // Add pulsing effect
                    glow *= 0.8 + 0.2 * sin(time * 3.0);
                    gl_FragColor = vec4(glow, intensity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(this.glow);
        this.objects.push(this.glow);
        
        // Decay particles
        this.particles = [];
        this.decayEvents = [];
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        this.objects.push(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(20, 20, 20);
        this.scene.add(pointLight);
        this.objects.push(pointLight);
        
        // Create probability indicators around the core
        this.indicators = [];
        this.createProbabilityIndicators();
    }
    
    createProbabilityIndicators() {
        // Create semi-transparent spheres around the core
        // These will pulse based on decay probability
        const layerCount = 3;
        const indicatorsPerLayer = 8;
        
        for (let layer = 0; layer < layerCount; layer++) {
            const radius = 12 + layer * 5;
            
            for (let i = 0; i < indicatorsPerLayer; i++) {
                const angle = (i / indicatorsPerLayer) * Math.PI * 2;
                
                // Position in ring
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = (Math.random() - 0.5) * 10;
                
                const size = 1 + Math.random() * 1.5;
                
                // Different shapes for variety
                const geometries = [
                    new THREE.SphereGeometry(size, 16, 16),
                    new THREE.BoxGeometry(size, size, size),
                    new THREE.TetrahedronGeometry(size)
                ];
                
                const geometry = geometries[Math.floor(Math.random() * geometries.length)];
                
                // Color based on layer
                const colors = [
                    new THREE.Color(0xf39c12), // Yellow
                    new THREE.Color(0xe74c3c), // Red
                    new THREE.Color(0x9b59b6)  // Purple
                ];
                
                const material = new THREE.MeshPhongMaterial({
                    color: colors[layer],
                    transparent: true,
                    opacity: 0.3,
                    shininess: 80
                });
                
                const indicator = new THREE.Mesh(geometry, material);
                indicator.position.set(x, y, z);
                
                // Store original position for animation
                indicator.userData = {
                    originalPosition: new THREE.Vector3(x, y, z),
                    phaseOffset: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random() * 0.5,
                    layer: layer
                };
                
                this.scene.add(indicator);
                this.indicators.push(indicator);
                this.objects.push(indicator);
            }
        }
    }
    
    createDecayEvent() {
        // Create a single decay event with particles
        const particleCount = 5 + Math.floor(Math.random() * 5);
        const decayParticles = [];
        
        // Origin with slight randomness
        const origin = new THREE.Vector3(
            this.core.position.x + (Math.random() - 0.5) * 2,
            this.core.position.y + (Math.random() - 0.5) * 2,
            this.core.position.z + (Math.random() - 0.5) * 2
        );
        
        for (let i = 0; i < particleCount; i++) {
            // Random direction
            const direction = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalize();
            
            // Choose a decay particle type
            const size = 0.5 + Math.random() * 1;
            const geometries = [
                new THREE.SphereGeometry(size, 8, 8),
                new THREE.BoxGeometry(size, size, size),
                new THREE.TetrahedronGeometry(size)
            ];
            
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            
            // Color based on particle type
            const colors = [
                0xe74c3c, // Red
                0x3498db, // Blue
                0x2ecc71  // Green
            ];
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Start at origin
            particle.position.copy(origin);
            
            // Add to scene
            this.scene.add(particle);
            this.objects.push(particle);
            
            // Store particle data
            const particleData = {
                mesh: particle,
                direction: direction,
                speed: 1 + Math.random() * 2,
                spin: new THREE.Vector3(
                    Math.random() * 0.1,
                    Math.random() * 0.1,
                    Math.random() * 0.1
                ),
                age: 0,
                lifespan: 3 + Math.random() * 2
            };
            
            decayParticles.push(particleData);
            this.particles.push(particleData);
        }
        
        // Add a burst effect
        const burstGeometry = new THREE.SphereGeometry(1, 16, 16);
        const burstMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });
        
        const burst = new THREE.Mesh(burstGeometry, burstMaterial);
        burst.position.copy(origin);
        burst.scale.set(0.1, 0.1, 0.1);
        this.scene.add(burst);
        this.objects.push(burst);
        
        // Animate burst
        gsap.to(burst.scale, {
            x: 6, y: 6, z: 6,
            duration: 0.5,
            ease: "power1.out"
        });
        
        gsap.to(burstMaterial, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.scene.remove(burst);
                this.objects.splice(this.objects.indexOf(burst), 1);
            }
        });
        
        // Reduce core size slightly with each decay
        const currentScale = this.core.scale.x;
        gsap.to(this.core.scale, {
            x: currentScale * 0.97,
            y: currentScale * 0.97,
            z: currentScale * 0.97,
            duration: 0.3,
            ease: "power1.out"
        });
        
        // Add event to tracking
        this.decayEvents.push({
            particles: decayParticles,
            age: 0
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update core
        this.core.rotation.x += 0.005;
        this.core.rotation.y += 0.007;
        
        // Pulsate core
        const corePulse = 1 + 0.1 * Math.sin(time * 3);
        const coreSize = this.core.scale.x;
        this.core.scale.set(coreSize * corePulse, coreSize * corePulse, coreSize * corePulse);
        
        // Update core glow
        this.glow.material.uniforms.time.value = time;
        this.glow.scale.copy(this.core.scale);
        
        // Randomly create new decay events
        if (Math.random() < 0.03 && this.core.scale.x > 0.3) {
            this.createDecayEvent();
        }
        
        // Update decay particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.mesh.position.x += particle.direction.x * particle.speed;
            particle.mesh.position.y += particle.direction.y * particle.speed;
            particle.mesh.position.z += particle.direction.z * particle.speed;
            
            // Update rotation
            particle.mesh.rotation.x += particle.spin.x;
            particle.mesh.rotation.y += particle.spin.y;
            particle.mesh.rotation.z += particle.spin.z;
            
            // Update age
            particle.age += 0.016; // Approximate for 60fps
            
            // Fade out near end of life
            if (particle.age > particle.lifespan * 0.7) {
                const fadeRatio = 1 - ((particle.age - particle.lifespan * 0.7) / (particle.lifespan * 0.3));
                particle.mesh.material.opacity = Math.max(0, fadeRatio);
            }
            
            // Remove if expired
            if (particle.age >= particle.lifespan) {
                this.scene.remove(particle.mesh);
                this.objects.splice(this.objects.indexOf(particle.mesh), 1);
                this.particles.splice(i, 1);
            }
        }
        
        // Update probability indicators
        for (const indicator of this.indicators) {
            const { originalPosition, phaseOffset, speed, layer } = indicator.userData;
            
            // Pulse opacity based on time and layer
            const baseOpacity = 0.2 + layer * 0.1;
            const pulseOpacity = baseOpacity + 0.3 * Math.sin(time * speed + phaseOffset);
            indicator.material.opacity = pulseOpacity;
            
            // Move slightly
            const wobble = 0.5;
            indicator.position.x = originalPosition.x + Math.sin(time * 0.5 + phaseOffset) * wobble;
            indicator.position.y = originalPosition.y + Math.cos(time * 0.7 + phaseOffset) * wobble;
            indicator.position.z = originalPosition.z + Math.sin(time * 0.9 + phaseOffset) * wobble;
            
            // Rotate
            indicator.rotation.x += 0.01;
            indicator.rotation.y += 0.01;
        }
        
        // Clean up decay events
        for (let i = this.decayEvents.length - 1; i >= 0; i--) {
            const event = this.decayEvents[i];
            event.age += 0.016; // Approximate for 60fps
            
            // Remove event if all particles are gone
            let allParticlesGone = true;
            for (const particle of event.particles) {
                if (particle.age < particle.lifespan) {
                    allParticlesGone = false;
                    break;
                }
            }
            
            if (allParticlesGone) {
                this.decayEvents.splice(i, 1);
            }
        }
    }
}

// Verse 22: Quantum Persistence animation
class QuantumPersistenceAnimation extends BaseAnimation {
    init() {
        // Create a visualization of quantum state persistence
        
        // Create a bubble-like structure to represent a quantum state
        this.bubbleRadius = 15;
        const bubbleGeometry = new THREE.SphereGeometry(this.bubbleRadius, 64, 64);
        
        // Custom shader material for bubble
        const bubbleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x3498db) }
            },
            vertexShader: `
                uniform float time;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                float noise(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
                }
                
                void main() {
                    vNormal = normal;
                    
                    // Apply displacement based on noise
                    vec3 pos = position;
                    float displacement = noise(position * 0.5 + time * 0.1) * 2.0;
                    pos += normal * displacement;
                    
                    vPosition = pos;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float time;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    // Compute fresnel effect
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnelTerm = dot(viewDirection, vNormal);
                    fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
                    
                    // Enhance fresnel effect
                    fresnelTerm = pow(fresnelTerm, 2.0);
                    
                    // Combine with base color
                    vec3 finalColor = mix(color, vec3(1.0), fresnelTerm * 0.7);
                    
                    // Add time-based shimmer
                    finalColor += vec3(0.1) * sin(time * 2.0 + vPosition.x * 0.1 + vPosition.y * 0.1 + vPosition.z * 0.1);
                    
                    gl_FragColor = vec4(finalColor, 0.6 + fresnelTerm * 0.3);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        this.bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        this.scene.add(this.bubble);
        this.objects.push(this.bubble);
        
        // Create particles inside the bubble
        this.particleCount = config.performance.particleCount / 2;
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            // Random position within sphere
            const radius = this.bubbleRadius * Math.cbrt(Math.random()); // For uniform distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            // Create particle
            const size = 0.2 + Math.random() * 0.3;
            
            // Color based on position in bubble
            const distFromCenter = radius / this.bubbleRadius;
            const hue = 0.6 - distFromCenter * 0.1; // Bluer in center, greener at edges
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
            
            const particleGeometry = new THREE.SphereGeometry(size, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(x, y, z);
            
            // Store original position for movement
            particle.userData = {
                originalPosition: new THREE.Vector3(x, y, z),
                phaseOffset: Math.random() * Math.PI * 2,
                speed: 0.2 + Math.random() * 0.3,
                amplitude: 0.5 + Math.random() * 0.5
            };
            
            this.scene.add(particle);
            this.particles.push(particle);
            this.objects.push(particle);
        }
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        this.objects.push(ambientLight);
        
        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(30, 30, 30);
        this.scene.add(pointLight);
        this.objects.push(pointLight);
        
        // Add disturbances
        this.disturbances = [];
        this.disturbanceTimer = 0;
    }
    
    createDisturbance() {
        // Create a visual representation of a disturbance to quantum state
        
        // Random position on the bubble surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = this.bubbleRadius * Math.sin(phi) * Math.cos(theta);
        const y = this.bubbleRadius * Math.sin(phi) * Math.sin(theta);
        const z = this.bubbleRadius * Math.cos(phi);
        
        // Create ripple effect
        const ringGeometry = new THREE.RingGeometry(0.5, 2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Orient ring to face outward from center
        ring.position.set(x, y, z);
        ring.lookAt(0, 0, 0);
        
        // Add to scene
        this.scene.add(ring);
        this.objects.push(ring);
        
        // Animate
        const disturbance = {
            mesh: ring,
            age: 0,
            lifespan: 2,
            center: new THREE.Vector3(x, y, z),
            direction: new THREE.Vector3(x, y, z).normalize()
        };
        
        // Scale animation
        gsap.to(ring.scale, {
            x: 5, y: 5, z: 1,
            duration: 2,
            ease: "power1.out"
        });
        
        // Fade out
        gsap.to(ringMaterial, {
            opacity: 0,
            duration: 2,
            ease: "power1.out"
        });
        
        this.disturbances.push(disturbance);
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update bubble shader
        this.bubble.material.uniforms.time.value = time;
        
        // Subtle rotation for the bubble
        this.bubble.rotation.y = time * 0.1;
        this.bubble.rotation.x = Math.sin(time * 0.2) * 0.2;
        
        // Update particles inside bubble
        for (const particle of this.particles) {
            const { originalPosition, phaseOffset, speed, amplitude } = particle.userData;
            
            // Calculate new position with orbital motion
            const distance = originalPosition.length();
            const normalizedPos = originalPosition.clone().normalize();
            
            // Create orbital movement around the original position
            const qx = Math.sin(time * speed + phaseOffset) * amplitude;
            const qy = Math.cos(time * speed + phaseOffset) * amplitude;
            const qz = Math.sin(time * speed * 0.7 + phaseOffset) * amplitude;
            
            // Combine orbital motion with original position
            particle.position.x = originalPosition.x + qx;
            particle.position.y = originalPosition.y + qy;
            particle.position.z = originalPosition.z + qz;
            
            // Ensure particles stay mostly within bubble
            const currentDist = particle.position.length();
            if (currentDist > this.bubbleRadius * 0.95) {
                particle.position.normalize().multiplyScalar(this.bubbleRadius * 0.95);
            }
        }
        
        // Update disturbances
        for (let i = this.disturbances.length - 1; i >= 0; i--) {
            const disturbance = this.disturbances[i];
            disturbance.age += 0.016; // Approximate for 60fps
            
            // Move slightly outward
            disturbance.mesh.position.add(
                disturbance.direction.clone().multiplyScalar(0.05)
            );
            
            // Remove if expired
            if (disturbance.age >= disturbance.lifespan) {
                this.scene.remove(disturbance.mesh);
                this.objects.splice(this.objects.indexOf(disturbance.mesh), 1);
                this.disturbances.splice(i, 1);
            }
        }
        
        // Create new disturbances occasionally
        this.disturbanceTimer += 0.016;
        if (this.disturbanceTimer > 1 && Math.random() < 0.1) {
            this.createDisturbance();
            this.disturbanceTimer = 0;
        }
    }
}

// Verse 23: Decay Rates animation
class DecayRatesAnimation extends BaseAnimation {
    init() {
        // Create a particle system showing decay rates
        
        // Main container for the animation
        this.sandSystem = new THREE.Group();
        this.scene.add(this.sandSystem);
        this.objects.push(this.sandSystem);
        
        // Create an hourglass-like structure
        this.createHourglass();
        
        // Create sand particles
        this.sandParticles = [];
        this.createSandParticles();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        this.objects.push(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(30, 30, 30);
        this.scene.add(pointLight);
        this.objects.push(pointLight);
    }
    
    createHourglass() {
        // Create top container
        const topGeometry = new THREE.CylinderGeometry(15, 1, 20, 32);
        const glassMaterial = new THREE.MeshPhongMaterial({
            color: 0xadd8e6, // Light blue
            transparent: true,
            opacity: 0.3,
            shininess: 90
        });
        
        this.topContainer = new THREE.Mesh(topGeometry, glassMaterial);
        this.topContainer.position.y = 20;
        this.sandSystem.add(this.topContainer);
        
        // Create neck/connection
        const neckGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
        const neckMaterial = new THREE.MeshPhongMaterial({
            color: 0xadd8e6,
            transparent: true,
            opacity: 0.5,
            shininess: 90
        });
        
        this.neck = new THREE.Mesh(neckGeometry, neckMaterial);
        this.neck.position.y = 9;
        this.sandSystem.add(this.neck);
        
        // Create bottom container
        const bottomGeometry = new THREE.CylinderGeometry(1, 15, 20, 32);
        
        this.bottomContainer = new THREE.Mesh(bottomGeometry, glassMaterial);
        this.bottomContainer.position.y = -2;
        this.sandSystem.add(this.bottomContainer);
        
        // Add thin ring around neck for visual detail
        const ringGeometry = new THREE.TorusGeometry(1.3, 0.2, 16, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            emissive: 0x3498db,
            emissiveIntensity: 0.3
        });
        
        this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
        this.ring.position.y = 9;
        this.ring.rotation.x = Math.PI / 2;
        this.sandSystem.add(this.ring);
    }
    
    createSandParticles() {
        // Create particles to represent sand/decay particles
        const particleCount = config.performance.particleCount / 2;
        
        // Different colors for top and bottom
        const topColor = new THREE.Color(0xe74c3c); // Red
        const bottomColor = new THREE.Color(0x9b59b6); // Purple
        
        for (let i = 0; i < particleCount; i++) {
            // Random position within top or bottom container
            let x, y, z, color;
            const isInTop = i < particleCount * 0.7; // 70% in top initially
            
            if (isInTop) {
                // Position within top container
                const radius = 12 * Math.sqrt(Math.random()); // For uniform distribution in circle
                const theta = Math.random() * Math.PI * 2;
                x = radius * Math.cos(theta);
                z = radius * Math.sin(theta);
                y = 20 + Math.random() * 15;
                color = topColor;
            } else {
                // Position within bottom container
                const radius = 12 * Math.sqrt(Math.random()); // For uniform distribution in circle
                const theta = Math.random() * Math.PI * 2;
                x = radius * Math.cos(theta);
                z = radius * Math.sin(theta);
                y = -10 + Math.random() * 15;
                color = bottomColor;
            }
            
            // Create particle
            const size = 0.1 + Math.random() * 0.2;
            
            const particleGeometry = new THREE.SphereGeometry(size, 8, 8);
            const particleMaterial = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 70
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(x, y, z);
            
            // Store particle data
            particle.userData = {
                velocity: new THREE.Vector3(0, 0, 0),
                isInTop: isInTop,
                isActive: true,
                decay: {
                    hasDecayed: false,
                    halfLife: 2 + Math.random() * 3, // Random half-life
                    birthTime: this.clock.getElapsedTime() + Math.random() * 2 // Stagger birth times
                }
            };
            
            this.sandSystem.add(particle);
            this.sandParticles.push(particle);
        }
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        const deltaTime = 0.016; // Approximation for 60fps
        
        // Rotate the entire system slowly
        this.sandSystem.rotation.y = time * 0.1;
        
        // Check for particle decay and update positions
        for (const particle of this.sandParticles) {
            if (!particle.userData.isActive) continue;
            
            const { velocity, isInTop, decay } = particle.userData;
            
            // Handle particle decay
            if (!decay.hasDecayed) {
                const age = time - decay.birthTime;
                const decayProbability = 1 - Math.pow(0.5, age / decay.halfLife);
                
                if (Math.random() < decayProbability * 0.01) { // Scale to make it slower
                    // Particle has decayed
                    decay.hasDecayed = true;
                    
                    // Visual feedback for decay
                    const originalColor = particle.material.color.clone();
                    
                    // Change color to indicate decay
                    gsap.to(particle.material.color, {
                        r: 0.2,
                        g: 0.8,
                        b: 0.5,
                        duration: 0.5,
                        onComplete: () => {
                            // After visual effect, change back to destination color (purple for bottom)
                            gsap.to(particle.material.color, {
                                r: 0.6,
                                g: 0.3,
                                b: 0.7,
                                duration: 1
                            });
                        }
                    });
                    
                    // Briefly increase size
                    const originalScale = particle.scale.x;
                    gsap.to(particle.scale, {
                        x: originalScale * 2,
                        y: originalScale * 2,
                        z: originalScale * 2,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                }
            }
            
            // Physics simulation
            if (isInTop) {
                // Particles in top section flow downward with increasing velocity
                velocity.y -= 0.01; // Gravity
                
                // Limit velocity for stability
                velocity.y = Math.max(velocity.y, -0.3);
                
                // Apply velocity
                particle.position.y += velocity.y;
                
                // Constrain within top container
                const distFromCenter = Math.sqrt(
                    particle.position.x * particle.position.x +
                    particle.position.z * particle.position.z
                );
                
                // Funnel effect - push toward center as particles descend
                if (particle.position.y < 20) {
                    const pushFactor = 0.01 * (20 - particle.position.y) / 10;
                    particle.position.x -= particle.position.x * pushFactor;
                    particle.position.z -= particle.position.z * pushFactor;
                }
                
                // Container walls - simple bounce
                const topRadius = 15 * (1 - (20 - particle.position.y) / 20); // Radius decreases with height
                if (distFromCenter > topRadius && particle.position.y > 10) {
                    const norm = new THREE.Vector3(particle.position.x, 0, particle.position.z).normalize();
                    particle.position.x = norm.x * topRadius;
                    particle.position.z = norm.z * topRadius;
                    
                    // Bounce
                    velocity.x -= norm.x * 0.02;
                    velocity.z -= norm.z * 0.02;
                }
                
                // Check if particle has passed through the neck
                if (particle.position.y < 9) {
                    // Transition to bottom container
                    particle.userData.isInTop = false;
                    
                    // Mark as bottom particle and change color
                    gsap.to(particle.material.color, {
                        r: 0.6,
                        g: 0.3,
                        b: 0.7,
                        duration: 1
                    });
                }
            } else {
                // Particles in bottom section
                velocity.y -= 0.01; // Gravity
                
                // Limit velocity
                velocity.y = Math.max(velocity.y, -0.3);
                
                // Apply velocity
                particle.position.y += velocity.y;
                
                // Constrain within bottom container
                const distFromCenter = Math.sqrt(
                    particle.position.x * particle.position.x +
                    particle.position.z * particle.position.z
                );
                
                // Funnel effect - push outward as particles descend
                if (particle.position.y < 0) {
                    const pushFactor = 0.01 * Math.abs(particle.position.y) / 10;
                    const norm = new THREE.Vector3(particle.position.x, 0, particle.position.z);
                    if (norm.length() < 0.01) {
                        norm.x = Math.random() - 0.5;
                        norm.z = Math.random() - 0.5;
                    }
                    norm.normalize();
                    
                    particle.position.x += norm.x * pushFactor;
                    particle.position.z += norm.z * pushFactor;
                }
                
                // Container walls
                const bottomRadius = 1 + (Math.abs(particle.position.y) / 10) * 14; // Radius increases with depth
                if (distFromCenter > bottomRadius && particle.position.y < 0) {
                    const norm = new THREE.Vector3(particle.position.x, 0, particle.position.z).normalize();
                    particle.position.x = norm.x * bottomRadius;
                    particle.position.z = norm.z * bottomRadius;
                    
                    // Bounce
                    velocity.x -= norm.x * 0.01;
                    velocity.z -= norm.z * 0.01;
                }
                
                // Bottom boundary
                if (particle.position.y < -12) {
                    particle.position.y = -12;
                    velocity.y = 0;
                    
                    // Add some random motion to simulate settling
                    if (Math.random() < 0.1) {
                        velocity.x += (Math.random() - 0.5) * 0.01;
                        velocity.z += (Math.random() - 0.5) * 0.01;
                    }
                }
            }
            
            // Apply friction
            velocity.x *= 0.99;
            velocity.z *= 0.99;
            
            // Apply random motion
            velocity.x += (Math.random() - 0.5) * 0.003;
            velocity.z += (Math.random() - 0.5) * 0.003;
        }
        
        // Pulse the connecting ring
        this.ring.material.emissiveIntensity = 0.3 + 0.2 * Math.sin(time * 3);
    }
}

// Verse 24: Thermodynamic Entropy animation
class ThermodynamicEntropyAnimation extends BaseAnimation {
    init() {
        // Create a visualization of increasing entropy over time
        
        // Create container for the system
        this.systemContainer = new THREE.Group();
        this.scene.add(this.systemContainer);
        this.objects.push(this.systemContainer);
        
        // Create environment box
        const boxSize = 40;
        const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.systemContainer.add(this.box);
        
        // Create particles for the system
        this.particleCount = config.performance.particleCount;
        this.particles = [];
        
        // Initial state: organized particles
        this.createParticles();
        
        // Set initial entropy state
        this.entropyState = 0; // 0 = ordered, 1 = fully random
        this.entropyTarget = 1; // Target entropy level
        
        // Add time indicators
        this.createTimeIndicators();
        
        // Add temperature visualization
        this.createTemperatureVis();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        this.objects.push(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(30, 30, 30);
        this.scene.add(pointLight);
        this.objects.push(pointLight);
    }
    
    createTimeIndicators() {
        // Create visual indicators for time progression
        const timeGeometry = new THREE.SphereGeometry(1, 16, 16);
        const timeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        
        // Create time arrow
        const arrowGeometry = new THREE.CylinderGeometry(0.1, 0.5, 5, 8);
        arrowGeometry.translate(0, -2.5, 0); // Move origin to top
        
        const arrowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        
        this.timeArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.timeArrow.position.set(0, 25, 0);
        this.timeArrow.rotation.z = Math.PI; // Point downward
        this.scene.add(this.timeArrow);
        this.objects.push(this.timeArrow);
        
        // Add simple box instead of text that requires font
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        
        const textProxy = new THREE.Mesh(
            new THREE.BoxGeometry(5, 1, 0.2),
            textMaterial
        );
        textProxy.position.set(0, 30, 0);
        this.scene.add(textProxy);
        this.objects.push(textProxy);
    }
    
    createTemperatureVis() {
        // Create a visual representation of temperature distribution
        // Temperature gauge at side of box
        const gaugeHeight = 30;
        const gaugeWidth = 2;
        
        const gaugeGeometry = new THREE.BoxGeometry(gaugeWidth, gaugeHeight, gaugeWidth);
        const gaugeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        this.temperatureGauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
        this.temperatureGauge.position.set(-25, 0, 0);
        this.scene.add(this.temperatureGauge);
        this.objects.push(this.temperatureGauge);
        
        // Create temperature gradient
        const segmentCount = 10;
        this.temperatureSegments = [];
        
        for (let i = 0; i < segmentCount; i++) {
            const segmentHeight = gaugeHeight / segmentCount;
            const segmentGeometry = new THREE.BoxGeometry(gaugeWidth * 0.8, segmentHeight * 0.9, gaugeWidth * 0.8);
            
            // Color gradient from red (hot) to blue (cold)
            const t = i / (segmentCount - 1);
            const color = new THREE.Color().lerpColors(
                new THREE.Color(0xe74c3c), // Hot
                new THREE.Color(0x3498db), // Cold
                t
            );
            
            const segmentMaterial = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5
            });
            
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.y = gaugeHeight / 2 - segmentHeight / 2 - i * segmentHeight;
            
            this.temperatureGauge.add(segment);
            this.temperatureSegments.push(segment);
        }
        
        // Add temperature indicator (will move based on average temperature)
        const indicatorGeometry = new THREE.SphereGeometry(1, 16, 16);
        const indicatorMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        
        this.temperatureIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        this.temperatureIndicator.position.set(-30, 0, 0);
        this.scene.add(this.temperatureIndicator);
        this.objects.push(this.temperatureIndicator);
    }

    createParticles() {
        const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const boxHalfSize = 18; // Slightly smaller than the container box

        // Calculate grid size for initial ordered state
        const particlesPerSide = Math.ceil(Math.cbrt(this.particleCount));
        const spacing = (boxHalfSize * 2) / particlesPerSide;

        for (let i = 0; i < this.particleCount; i++) {
            // Determine grid position
            const xIndex = i % particlesPerSide;
            const yIndex = Math.floor(i / particlesPerSide) % particlesPerSide;
            const zIndex = Math.floor(i / (particlesPerSide * particlesPerSide));

            const x = -boxHalfSize + spacing / 2 + xIndex * spacing;
            const y = -boxHalfSize + spacing / 2 + yIndex * spacing;
            const z = -boxHalfSize + spacing / 2 + zIndex * spacing;

            const position = new THREE.Vector3(x, y, z);

            // Assign temperature (e.g., half hot, half cold)
            const isHot = y < 0; // Example: bottom half is hot
            const temperature = isHot ? 1.0 : 0.0;
            const color = isHot ? 0xff6600 : 0x0066ff;

            const particleMaterial = new THREE.MeshPhongMaterial({
                color: color,
                emissive: new THREE.Color(color).multiplyScalar(0.5),
                shininess: 50
            });

            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(position);

            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                isHot: isHot,
                temperature: temperature,
                originalPosition: position.clone(),
                targetPosition: position.clone() // Initially target is the original position
            };

            this.particles.push(particle);
            this.systemContainer.add(particle);
            this.objects.push(particle); // Add to objects for cleanup
        }
    }
    
    update() {
        const time = this.clock.getElapsedTime() * this.speed;
        
        // Update entropy state - gradually increase disorder
        this.entropyState += (this.entropyTarget - this.entropyState) * 0.002;
        
        // Update particles based on entropy state
        for (const particle of this.particles) {
            const { velocity, isHot, temperature, originalPosition, targetPosition } = particle.userData;
            
            // As entropy increases, move particles toward random positions
            if (this.entropyState > 0.1 && Math.random() < 0.01) {
                // Set new random target position
                targetPosition.set(
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 30
                );
            }
            
            // Move toward target position
            const moveSpeed = 0.01 + this.entropyState * 0.02;
            particle.position.x += (targetPosition.x - particle.position.x) * moveSpeed;
            particle.position.y += (targetPosition.y - particle.position.y) * moveSpeed;
            particle.position.z += (targetPosition.z - particle.position.z) * moveSpeed;
            
            // Apply velocity (random movement)
            particle.position.x += velocity.x;
            particle.position.y += velocity.y;
            particle.position.z += velocity.z;
            
            // Boundary checks - bounce off walls
            const boxHalfSize = 20;
            if (Math.abs(particle.position.x) > boxHalfSize) {
                particle.position.x = Math.sign(particle.position.x) * boxHalfSize;
                velocity.x *= -0.9;
            }
            
            if (Math.abs(particle.position.y) > boxHalfSize) {
                particle.position.y = Math.sign(particle.position.y) * boxHalfSize;
                velocity.y *= -0.9;
            }
            
            if (Math.abs(particle.position.z) > boxHalfSize) {
                particle.position.z = Math.sign(particle.position.z) * boxHalfSize;
                velocity.z *= -0.9;
            }
            
            // Apply random forces (more for hot particles)
            const forceFactor = 0.001 + temperature * 0.002;
            velocity.x += (Math.random() - 0.5) * forceFactor;
            velocity.y += (Math.random() - 0.5) * forceFactor;
            velocity.z += (Math.random() - 0.5) * forceFactor;
            
            // Apply drag
            velocity.multiplyScalar(0.99);
            
            // Temperature equilibrium - as entropy increases, temperatures converge
            if (Math.random() < 0.05 * this.entropyState) {
                // Find nearby particles
                for (const otherParticle of this.particles) {
                    if (otherParticle === particle) continue;
                    
                    const distance = particle.position.distanceTo(otherParticle.position);
                    if (distance < 3) {
                        // Heat exchange
                        const tempDiff = otherParticle.userData.temperature - particle.userData.temperature;
                        const exchangeRate = 0.01 * this.entropyState;
                        
                        particle.userData.temperature += tempDiff * exchangeRate;
                        otherParticle.userData.temperature -= tempDiff * exchangeRate;
                        
                        // Update colors based on temperature
                        this.updateParticleColor(particle);
                        this.updateParticleColor(otherParticle);
                    }
                }
            }
        }
        
        // Calculate average temperature and variance
        let totalTemp = 0;
        let tempVariance = 0;
        const temps = [];
        
        for (const particle of this.particles) {
            totalTemp += particle.userData.temperature;
            temps.push(particle.userData.temperature);
        }
        
        const avgTemp = totalTemp / this.particles.length;
        
        for (const temp of temps) {
            tempVariance += Math.pow(temp - avgTemp, 2);
        }
        tempVariance /= temps.length;
        
        // Update temperature indicator
        const gaugeHeight = 30;
        this.temperatureIndicator.position.y = (avgTemp - 0.5) * gaugeHeight;
        
        // Pulse temperature segments based on variance
        for (let i = 0; i < this.temperatureSegments.length; i++) {
            const segment = this.temperatureSegments[i];
            const segmentTemp = 1 - i / (this.temperatureSegments.length - 1);
            
            // Segments pulse more when their temperature matches the average
            const tempDiff = Math.abs(segmentTemp - avgTemp);
            const pulseFactor = Math.exp(-tempDiff * 5) * (1 - tempVariance * 2);
            
            const pulse = 1 + pulseFactor * 0.3 * Math.sin(time * 3);
            segment.scale.set(pulse, pulse, pulse);
        }
        
        // Update time arrow
        this.timeArrow.rotation.y = time * 0.5;
        
        // Rotate system for better viewing
        this.systemContainer.rotation.y = time * 0.1;
    }
    
    updateParticleColor(particle) {
        const temp = particle.userData.temperature;
        
        // Interpolate between cold (blue) and hot (red)
        const color = new THREE.Color().lerpColors(
            new THREE.Color(0x3498db), // Cold
            new THREE.Color(0xe74c3c), // Hot
            temp
        );
        
        particle.material.color = color;
        particle.material.emissive = color;
        particle.material.emissiveIntensity = 0.2 + temp * 0.3;
    }
}