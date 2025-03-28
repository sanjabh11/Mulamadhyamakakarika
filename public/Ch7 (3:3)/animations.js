import * as THREE from 'three';
import { animationSettings } from './config.js';

export function initAnimations(scene) {
    const animations = {};
    const objects = {};
    
    // Helper to clear previous animation objects
    function clearAnimationObjects() {
        for (const key in objects) {
            if (objects[key] && objects[key].parent === scene) {
                scene.remove(objects[key]);
            }
        }
        objects = {};
    }
    
    // 1. Entangled Particles Animation
    animations.entangledParticles = {
        init: function() {
            const group = new THREE.Group();
            
            // Create two entangled particles
            const particle1 = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: animationSettings.colorPrimary,
                    emissive: animationSettings.colorPrimary,
                    emissiveIntensity: 0.5
                })
            );
            
            const particle2 = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: animationSettings.colorSecondary,
                    emissive: animationSettings.colorSecondary,
                    emissiveIntensity: 0.5
                })
            );
            
            // Position particles
            particle1.position.set(-3, 0, 0);
            particle2.position.set(3, 0, 0);
            
            // Create connecting line
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                particle1.position,
                particle2.position
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0xffffff,
                opacity: 0.5,
                transparent: true
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            
            // Add to group
            group.add(particle1);
            group.add(particle2);
            group.add(line);
            
            // Add to scene
            scene.add(group);
            objects.entangledGroup = group;
            objects.particle1 = particle1;
            objects.particle2 = particle2;
            objects.line = line;
        },
        
        update: function() {
            if (objects.entangledGroup) {
                objects.entangledGroup.rotation.y += 0.005 * animationSettings.speed;
                
                // Synchronize particle rotations (entanglement)
                const time = Date.now() * 0.001;
                const spin = Math.sin(time) * Math.PI;
                objects.particle1.rotation.y = spin;
                objects.particle2.rotation.y = -spin; // Opposite spin
                
                // Update line vertices
                const positions = objects.line.geometry.attributes.position.array;
                positions[0] = objects.particle1.position.x;
                positions[1] = objects.particle1.position.y;
                positions[2] = objects.particle1.position.z;
                positions[3] = objects.particle2.position.x;
                positions[4] = objects.particle2.position.y;
                positions[5] = objects.particle2.position.z;
                objects.line.geometry.attributes.position.needsUpdate = true;
            }
        },
        
        clear: function() {
            if (objects.entangledGroup) {
                scene.remove(objects.entangledGroup);
            }
        }
    };
    
    // 2. Particle Annihilation Animation
    animations.particleAnnihilation = {
        init: function() {
            const group = new THREE.Group();
            
            // Create particle and antiparticle
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: animationSettings.colorPrimary,
                    emissive: animationSettings.colorPrimary,
                    emissiveIntensity: 0.5
                })
            );
            
            const antiparticle = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: animationSettings.colorSecondary, 
                    emissive: animationSettings.colorSecondary,
                    emissiveIntensity: 0.5
                })
            );
            
            // Create explosion particles
            const explosionParticles = new THREE.Group();
            for (let i = 0; i < 50; i++) {
                const size = Math.random() * 0.2 + 0.1;
                const explosionParticle = new THREE.Mesh(
                    new THREE.SphereGeometry(size, 16, 16),
                    new THREE.MeshPhongMaterial({ 
                        color: Math.random() > 0.5 ? animationSettings.colorPrimary : animationSettings.colorSecondary,
                        emissive: Math.random() > 0.5 ? animationSettings.colorPrimary : animationSettings.colorSecondary,
                        emissiveIntensity: 0.5,
                        transparent: true,
                        opacity: 0.7
                    })
                );
                
                // Random position for particles
                explosionParticle.position.set(
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6
                );
                
                explosionParticle.scale.set(0, 0, 0); // Start invisible
                explosionParticles.add(explosionParticle);
            }
            
            // Position particles
            particle.position.set(-5, 0, 0);
            antiparticle.position.set(5, 0, 0);
            
            // Add to group
            group.add(particle);
            group.add(antiparticle);
            group.add(explosionParticles);
            
            // Add to scene
            scene.add(group);
            objects.annihilationGroup = group;
            objects.particle = particle;
            objects.antiparticle = antiparticle;
            objects.explosionParticles = explosionParticles;
            objects.annihilationTime = 0;
            objects.annihilationState = 'approaching'; // States: approaching, explosion, reset
        },
        
        update: function() {
            if (!objects.annihilationGroup) return;
            
            const time = Date.now() * 0.001;
            objects.annihilationTime += 0.01 * animationSettings.speed;
            
            if (objects.annihilationState === 'approaching') {
                // Move particles closer
                objects.particle.position.x += 0.05 * animationSettings.speed;
                objects.antiparticle.position.x -= 0.05 * animationSettings.speed;
                
                // Detect collision
                if (objects.particle.position.distanceTo(objects.antiparticle.position) < 0.5) {
                    objects.annihilationState = 'explosion';
                    // Hide original particles
                    objects.particle.visible = false;
                    objects.antiparticle.visible = false;
                }
            } 
            else if (objects.annihilationState === 'explosion') {
                // Animate explosion particles
                objects.explosionParticles.children.forEach((particle, i) => {
                    const scale = Math.min(1, objects.annihilationTime * 2);
                    particle.scale.set(scale, scale, scale);
                    
                    // Expand outward
                    const dir = particle.position.clone().normalize();
                    particle.position.add(dir.multiplyScalar(0.05 * animationSettings.speed));
                    
                    // Fade out
                    particle.material.opacity = Math.max(0, 0.7 - objects.annihilationTime * 0.2);
                });
                
                // Reset after explosion completes
                if (objects.annihilationTime > 5) {
                    objects.annihilationState = 'reset';
                    objects.annihilationTime = 0;
                    
                    // Reset positions
                    objects.particle.position.set(-5, 0, 0);
                    objects.antiparticle.position.set(5, 0, 0);
                    objects.particle.visible = true;
                    objects.antiparticle.visible = true;
                    
                    // Reset explosion particles
                    objects.explosionParticles.children.forEach(particle => {
                        particle.scale.set(0, 0, 0);
                        particle.position.set(
                            (Math.random() - 0.5) * 6,
                            (Math.random() - 0.5) * 6,
                            (Math.random() - 0.5) * 6
                        );
                    });
                    
                    objects.annihilationState = 'approaching';
                }
            }
        },
        
        clear: function() {
            if (objects.annihilationGroup) {
                scene.remove(objects.annihilationGroup);
            }
        }
    };
    
    // 3. State Transitions Animation
    animations.stateTransitions = {
        init: function() {
            const group = new THREE.Group();
            
            // Create a quantum system with three states
            const states = [];
            const colors = [0xff0000, 0x00ff00, 0x0000ff]; // Red, Green, Blue like a traffic light
            const positions = [
                new THREE.Vector3(-4, 0, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(4, 0, 0)
            ];
            
            for (let i = 0; i < 3; i++) {
                const state = new THREE.Mesh(
                    new THREE.SphereGeometry(1.5, 32, 32),
                    new THREE.MeshPhongMaterial({ 
                        color: colors[i],
                        emissive: colors[i],
                        emissiveIntensity: 0.3,
                        transparent: true,
                        opacity: i === 0 ? 1 : 0.3 // Start with first state active
                    })
                );
                state.position.copy(positions[i]);
                states.push(state);
                group.add(state);
            }
            
            // Create connecting lines between states
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                opacity: 0.3,
                transparent: true
            });
            
            for (let i = 0; i < states.length - 1; i++) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    states[i].position,
                    states[i + 1].position
                ]);
                const line = new THREE.Line(lineGeometry, lineMaterial);
                group.add(line);
            }
            
            // Create an indicator particle that moves between states
            const indicator = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 0.5
                })
            );
            indicator.position.copy(positions[0]); // Start at first state
            group.add(indicator);
            
            // Add to scene
            scene.add(group);
            objects.stateGroup = group;
            objects.states = states;
            objects.indicator = indicator;
            objects.statePositions = positions;
            objects.currentState = 0;
            objects.transitionTime = 0;
            objects.isTransitioning = false;
        },
        
        update: function() {
            if (!objects.stateGroup) return;
            
            const time = Date.now() * 0.001;
            
            if (!objects.isTransitioning) {
                objects.transitionTime += 0.01 * animationSettings.speed;
                
                // Start transition after a delay
                if (objects.transitionTime > 2) {
                    objects.isTransitioning = true;
                    objects.transitionTime = 0;
                    objects.nextState = (objects.currentState + 1) % objects.states.length;
                }
            } else {
                objects.transitionTime += 0.01 * animationSettings.speed;
                
                // Transition progress (0 to 1)
                const progress = Math.min(1, objects.transitionTime);
                
                // Move indicator
                const currentPos = objects.statePositions[objects.currentState];
                const nextPos = objects.statePositions[objects.nextState];
                objects.indicator.position.lerpVectors(currentPos, nextPos, progress);
                
                // Update state opacities
                objects.states[objects.currentState].material.opacity = 1 - progress;
                objects.states[objects.nextState].material.opacity = progress;
                
                // Complete transition
                if (progress >= 1) {
                    objects.currentState = objects.nextState;
                    objects.isTransitioning = false;
                    objects.transitionTime = 0;
                }
            }
            
            // Rotate the whole system gently
            objects.stateGroup.rotation.y = Math.sin(time * 0.2) * 0.2;
        },
        
        clear: function() {
            if (objects.stateGroup) {
                scene.remove(objects.stateGroup);
            }
        }
    };
    
    // 4. State Superposition Animation
    animations.stateSuperposition = {
        init: function() {
            const group = new THREE.Group();
            
            // Create two quantum states that coexist
            const state1 = new THREE.Mesh(
                new THREE.TorusGeometry(2, 0.5, 16, 100),
                new THREE.MeshPhongMaterial({ 
                    color: animationSettings.colorPrimary,
                    emissive: animationSettings.colorPrimary,
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.7
                })
            );
            
            const state2 = new THREE.Mesh(
                new THREE.TorusGeometry(2, 0.5, 16, 100),
                new THREE.MeshPhongMaterial({ 
                    color: animationSettings.colorSecondary,
                    emissive: animationSettings.colorSecondary,
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.7
                })
            );
            
            // Position the states to intersect/coexist
            state1.rotation.x = Math.PI / 2;
            state2.rotation.y = Math.PI / 2;
            
            // Create particles that move along each state
            const particles1 = new THREE.Group();
            const particles2 = new THREE.Group();
            
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                
                // Particle for state 1
                const particle1 = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 16, 16),
                    new THREE.MeshPhongMaterial({ 
                        color: animationSettings.colorPrimary,
                        emissive: animationSettings.colorPrimary,
                        emissiveIntensity: 0.5
                    })
                );
                
                particle1.position.set(
                    2 * Math.cos(angle),
                    0,
                    2 * Math.sin(angle)
                );
                particles1.add(particle1);
                
                // Particle for state 2
                const particle2 = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 16, 16),
                    new THREE.MeshPhongMaterial({ 
                        color: animationSettings.colorSecondary,
                        emissive: animationSettings.colorSecondary,
                        emissiveIntensity: 0.5
                    })
                );
                
                particle2.position.set(
                    0,
                    2 * Math.cos(angle),
                    2 * Math.sin(angle)
                );
                particles2.add(particle2);
            }
            
            // Add to group
            group.add(state1);
            group.add(state2);
            group.add(particles1);
            group.add(particles2);
            
            // Add to scene
            scene.add(group);
            objects.superpositionGroup = group;
            objects.state1 = state1;
            objects.state2 = state2;
            objects.particles1 = particles1;
            objects.particles2 = particles2;
        },
        
        update: function() {
            if (!objects.superpositionGroup) return;
            
            const time = Date.now() * 0.001;
            
            // Rotate states to show they coexist without affecting each other
            objects.particles1.rotation.z += 0.01 * animationSettings.speed;
            objects.particles2.rotation.x += 0.01 * animationSettings.speed;
            
            // Gentle pulsation to emphasize superposition
            const pulseFactor = Math.sin(time) * 0.1 + 0.9;
            objects.state1.scale.set(pulseFactor, pulseFactor, pulseFactor);
            objects.state2.scale.set(pulseFactor, pulseFactor, pulseFactor);
            
            // Rotate the whole system
            objects.superpositionGroup.rotation.y += 0.003 * animationSettings.speed;
        },
        
        clear: function() {
            if (objects.superpositionGroup) {
                scene.remove(objects.superpositionGroup);
            }
        }
    };
    
    // 5. Particle Creation and Annihilation Animation
    animations.particleCreationAnnihilation = {
        init: function() {
            const group = new THREE.Group();
            
            // Create wave geometry to represent combined birth/death process
            const waveGeometry = new THREE.PlaneGeometry(12, 8, 40, 40);
            const waveMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x6fcbf7,
                wireframe: true,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.rotation.x = Math.PI / 2;
            
            // Create particles that appear and disappear along the wave
            const particles = new THREE.Group();
            for (let i = 0; i < 40; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 16, 16),
                    new THREE.MeshPhongMaterial({
                        color: Math.random() > 0.5 ? animationSettings.colorPrimary : animationSettings.colorSecondary,
                        emissive: Math.random() > 0.5 ? animationSettings.colorPrimary : animationSettings.colorSecondary,
                        emissiveIntensity: 0.5,
                        transparent: true,
                        opacity: Math.random()
                    })
                );
                
                // Random position on the wave
                particle.position.set(
                    (Math.random() - 0.5) * 12,
                    (Math.random() - 0.5) * 8,
                    0
                );
                
                // Store original position
                particle.userData = {
                    originalPosition: particle.position.clone(),
                    phase: Math.random() * Math.PI * 2,
                    lifetime: Math.random() * 5 + 1, // Random lifetime
                    age: 0
                };
                
                particles.add(particle);
            }
            
            // Add to group
            group.add(wave);
            group.add(particles);
            
            // Add to scene
            scene.add(group);
            objects.waveGroup = group;
            objects.wave = wave;
            objects.waveParticles = particles;
        },
        
        update: function() {
            if (!objects.waveGroup) return;
            
            const time = Date.now() * 0.001;
            
            // Animate wave vertices
            const waveVerts = objects.wave.geometry.attributes.position.array;
            for (let i = 0; i < waveVerts.length; i += 3) {
                const x = waveVerts[i];
                const y = waveVerts[i + 1];
                const distance = Math.sqrt(x * x + y * y);
                
                // Create wave pattern
                waveVerts[i + 2] = Math.sin(distance - time * 2 * animationSettings.speed) * 0.5;
            }
            objects.wave.geometry.attributes.position.needsUpdate = true;
            
            // Animate particles (creation/annihilation)
            objects.waveParticles.children.forEach(particle => {
                particle.userData.age += 0.01 * animationSettings.speed;
                
                // Particle lifecycle
                if (particle.userData.age < particle.userData.lifetime) {
                    // Creation phase - fade in and move up from wave
                    if (particle.userData.age < 1) {
                        const progress = particle.userData.age;
                        particle.material.opacity = progress;
                        particle.scale.set(progress, progress, progress);
                        
                        // Rise from the wave
                        const height = Math.sin(time + particle.userData.phase) * 0.5;
                        particle.position.z = height + progress;
                    }
                    // Stable phase
                    else if (particle.userData.age < particle.userData.lifetime - 1) {
                        // Float above the wave
                        const height = Math.sin(time + particle.userData.phase) * 0.5;
                        particle.position.z = height + 1;
                    }
                    // Annihilation phase - fade out
                    else {
                        const progress = (particle.userData.lifetime - particle.userData.age);
                        particle.material.opacity = progress;
                        particle.scale.set(progress, progress, progress);
                        
                        // Sink back into the wave
                        const height = Math.sin(time + particle.userData.phase) * 0.5;
                        particle.position.z = height + progress;
                    }
                }
                // Reset particle after lifecycle
                else {
                    particle.userData.age = 0;
                    particle.userData.lifetime = Math.random() * 5 + 1;
                    
                    // New random position
                    particle.position.set(
                        (Math.random() - 0.5) * 12,
                        (Math.random() - 0.5) * 8,
                        0
                    );
                    particle.userData.originalPosition = particle.position.clone();
                    particle.userData.phase = Math.random() * Math.PI * 2;
                }
            });
            
            // Rotate the whole system
            objects.waveGroup.rotation.z += 0.002 * animationSettings.speed;
        },
        
        clear: function() {
            if (objects.waveGroup) {
                scene.remove(objects.waveGroup);
            }
        }
    };
    
    // 6. Probabilistic Existence Animation
    animations.probabilisticExistence = {
        init: function() {
            const group = new THREE.Group();
            
            // Create probability cloud
            const cloudGeometry = new THREE.SphereGeometry(3, 32, 32);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.2,
                wireframe: true
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            
            // Create quantum particle that fluctuates between states
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: animationSettings.colorPrimary,
                    emissive: animationSettings.colorPrimary,
                    emissiveIntensity: 0.5,
                    transparent: true
                })
            );
            
            // Create probability points within the cloud
            const points = new THREE.Group();
            for (let i = 0; i < 100; i++) {
                const point = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.3
                    })
                );
                
                // Random position within the cloud
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 3 * Math.pow(Math.random(), 1/3);
                
                point.position.set(
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi)
                );
                
                points.add(point);
            }
            
            // Add to group
            group.add(cloud);
            group.add(particle);
            group.add(points);
            
            // Add to scene
            scene.add(group);
            objects.probabilityGroup = group;
            objects.cloud = cloud;
            objects.probabilityParticle = particle;
            objects.probabilityPoints = points;
            objects.currentTarget = null;
            objects.transitionProgress = 0;
        },
        
        update: function() {
            if (!objects.probabilityGroup) return;
            
            const time = Date.now() * 0.001;
            
            // Animate probability cloud
            objects.cloud.rotation.y += 0.003 * animationSettings.speed;
            objects.cloud.rotation.z += 0.001 * animationSettings.speed;
            
            // Animate quantum particle jumping between probable positions
            if (!objects.currentTarget || objects.transitionProgress >= 1) {
                // Pick a new random target position from one of the probability points
                const randomIndex = Math.floor(Math.random() * objects.probabilityPoints.children.length);
                objects.currentTarget = objects.probabilityPoints.children[randomIndex].position.clone();
                objects.transitionProgress = 0;
                
                // Particle briefly disappears between jumps
                objects.probabilityParticle.material.opacity = 0;
            }
            
            objects.transitionProgress += 0.05 * animationSettings.speed;
            
            // Fade in at new position
            if (objects.transitionProgress < 0.2) {
                objects.probabilityParticle.material.opacity = objects.transitionProgress * 5;
            }
            // Fade out before next jump
            else if (objects.transitionProgress > 0.8) {
                objects.probabilityParticle.material.opacity = (1 - objects.transitionProgress) * 5;
            }
            
            // Move particle to target position
            if (objects.currentTarget) {
                objects.probabilityParticle.position.lerp(objects.currentTarget, 0.1);
            }
            
            // Make probability points pulse
            objects.probabilityPoints.children.forEach((point, i) => {
                const pulseFactor = Math.sin(time * 3 + i * 0.1) * 0.5 + 0.5;
                point.material.opacity = 0.1 + pulseFactor * 0.4;
                point.scale.set(pulseFactor, pulseFactor, pulseFactor);
            });
            
            // Rotate the whole system
            objects.probabilityGroup.rotation.y += 0.002 * animationSettings.speed;
        },
        
        clear: function() {
            if (objects.probabilityGroup) {
                scene.remove(objects.probabilityGroup);
            }
        }
    };
    
    // 7. Vacuum Fluctuations Animation
    animations.vacuumFluctuations = {
        init: function() {
            const group = new THREE.Group();
            
            // Create vacuum visualization (empty space with grid)
            const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x222222);
            gridHelper.position.y = -5;
            
            // Create vacuum energy visualization
            const energyField = new THREE.Group();
            
            // Add fluctuating particles that appear and disappear
            for (let i = 0; i < 50; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 16, 16),
                    new THREE.MeshPhongMaterial({
                        color: Math.random() > 0.5 ? 0x6fcbf7 : 0xff00ff,
                        emissive: Math.random() > 0.5 ? 0x6fcbf7 : 0xff00ff,
                        emissiveIntensity: 0.5,
                        transparent: true,
                        opacity: 0
                    })
                );
                
                // Random position in 3D space
                particle.position.set(
                    (Math.random() - 0.5) * 16,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 16
                );
                
                // Lifecycle data
                particle.userData = {
                    phase: Math.random() * Math.PI * 2,
                    lifespan: Math.random() * 2 + 0.5,
                    age: Math.random() * 2, // Start at random age in lifecycle
                    maxScale: Math.random() * 0.5 + 0.2
                };
                
                energyField.add(particle);
            }
            
            // Add to group
            group.add(gridHelper);
            group.add(energyField);
            
            // Add to scene
            scene.add(group);
            objects.vacuumGroup = group;
            objects.energyField = energyField;
        },
        
        update: function() {
            if (!objects.vacuumGroup) return;
            
            // Animate vacuum fluctuations
            objects.energyField.children.forEach(particle => {
                particle.userData.age += 0.02 * animationSettings.speed;
                
                if (particle.userData.age > particle.userData.lifespan) {
                    // Reset particle
                    particle.userData.age = 0;
                    particle.userData.lifespan = Math.random() * 2 + 0.5;
                    particle.userData.phase = Math.random() * Math.PI * 2;
                    particle.userData.maxScale = Math.random() * 0.5 + 0.2;
                    
                    // New random position
                    particle.position.set(
                        (Math.random() - 0.5) * 16,
                        (Math.random() - 0.5) * 8,
                        (Math.random() - 0.5) * 16
                    );
                    
                    particle.scale.set(0, 0, 0);
                    particle.material.opacity = 0;
                } else {
                    // Normalize age to 0-1 range
                    const normalizedAge = particle.userData.age / particle.userData.lifespan;
                    
                    // Particle lifecycle
                    if (normalizedAge < 0.2) {
                        // Appear
                        const factor = normalizedAge / 0.2;
                        particle.scale.set(
                            factor * particle.userData.maxScale,
                            factor * particle.userData.maxScale,
                            factor * particle.userData.maxScale
                        );
                        particle.material.opacity = factor;
                    } else if (normalizedAge > 0.8) {
                        // Disappear
                        const factor = (1 - normalizedAge) / 0.2;
                        particle.scale.set(
                            factor * particle.userData.maxScale,
                            factor * particle.userData.maxScale,
                            factor * particle.userData.maxScale
                        );
                        particle.material.opacity = factor;
                    } else {
                        // Stable existence
                        particle.scale.set(
                            particle.userData.maxScale,
                            particle.userData.maxScale,
                            particle.userData.maxScale
                        );
                        particle.material.opacity = 1;
                        
                        // Slight movement during existence
                        const time = Date.now() * 0.001;
                        particle.position.x += Math.sin(time + particle.userData.phase) * 0.01;
                        particle.position.y += Math.cos(time + particle.userData.phase) * 0.01;
                        particle.position.z += Math.sin(time * 0.5 + particle.userData.phase) * 0.01;
                    }
                }
            });
            
            // Rotate the whole system
            objects.vacuumGroup.rotation.y += 0.002 * animationSettings.speed;
        },
        
        clear: function() {
            if (objects.vacuumGroup) {
                scene.remove(objects.vacuumGroup);
            }
        }
    };
    
    // 8. Probabilistic Events Animation
    animations.probabilisticEvents = {
        init: function() {
            const group = new THREE.Group();
            
            // Create central node representing an event
            const eventNode = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 0.3
                })
            );
            
            // Create "probability paths" radiating outward
            const paths = new THREE.Group();
            const pathCount = 12;
            
            for (let i = 0; i < pathCount; i++) {
                const angle = (i / pathCount) * Math.PI * 2;
                const length = Math.random() * 4 + 3;
                
                // Create path line
                const points = [];
                points.push(new THREE.Vector3(0, 0, 0));
                
                // Add some curve to the path
                const curveOffset = new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                );
                
                points.push(new THREE.Vector3(
                    Math.cos(angle) * length * 0.3 + curveOffset.x,
                    Math.sin(angle) * length * 0.3 + curveOffset.y,
                    curveOffset.z
                ));
                
                points.push(new THREE.Vector3(
                    Math.cos(angle) * length,
                    Math.sin(angle) * length,
                    0
                ));
                
                const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const pathMaterial = new THREE.LineBasicMaterial({
                    color: 0x6fcbf7,
                    transparent: true,
                    opacity: 0.3 + Math.random() * 0.4 // Random opacity for each path
                });
                
                const path = new THREE.Line(pathGeometry, pathMaterial);
                paths.add(path);
                
                // Add endpoint to represent possible outcome
                const outcome = new THREE.Mesh(
                    new THREE.SphereGeometry(0.5, 16, 16),
                    new THREE.MeshPhongMaterial({ 
                        color: Math.random() > 0.5 ? 0x6fcbf7 : 0xff00ff,
                        emissive: Math.random() > 0.5 ? 0x6fcbf7 : 0xff00ff,
                        emissiveIntensity: 0.5,
                        transparent: true,
                        opacity: 0.7
                    })
                );
                
                outcome.position.set(
                    Math.cos(angle) * length,
                    Math.sin(angle) * length,
                    0
                );
                
                paths.add(outcome);
            }
            
            // Add moving particles along paths to show probability flow
            const particles = new THREE.Group();
            
            for (let i = 0; i < 30; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.7
                    })
                );
                
                // Random starting position
                particle.userData = {
                    pathIndex: Math.floor(Math.random() * pathCount),
                    progress: Math.random(), // Random progress along path
                    speed: Math.random() * 0.01 + 0.005
                };
                
                particles.add(particle);
            }
            
            // Add to group
            group.add(eventNode);
            group.add(paths);
            group.add(particles);
            
            // Add to scene
            scene.add(group);
            objects.probabilisticGroup = group;
            objects.eventNode = eventNode;
            objects.paths = paths;
            objects.pathsArray = [];
            
            // Extract path data for animation
            for (let i = 0; i < pathCount; i++) {
                const pathLine = paths.children[i * 2]; // Every other child is a path line
                const points = [];
                
                // Get control points from the path
                const positionAttr = pathLine.geometry.attributes.position;
                for (let j = 0; j < positionAttr.count; j++) {
                    points.push(new THREE.Vector3(
                        positionAttr.getX(j),
                        positionAttr.getY(j),
                        positionAttr.getZ(j)
                    ));
                }
                
                objects.pathsArray.push(points);
            }
            
            objects.particles = particles;
        },
        
        update: function() {
            if (!objects.probabilisticGroup) return;
            
            const time = Date.now() * 0.001;
            
            // Pulse the central event node
            const pulseFactor = Math.sin(time * 2) * 0.2 + 0.8;
            objects.eventNode.scale.set(pulseFactor, pulseFactor, pulseFactor);
            
            // Animate particles along paths
            objects.particles.children.forEach(particle => {
                particle.userData.progress += particle.userData.speed * animationSettings.speed;
                
                if (particle.userData.progress > 1) {
                    // Reset particle
                    particle.userData.progress = 0;
                    particle.userData.pathIndex = Math.floor(Math.random() * objects.pathsArray.length);
                    particle.userData.speed = Math.random() * 0.01 + 0.005;
                }
                
                // Calculate position along the path
                const path = objects.pathsArray[particle.userData.pathIndex];
                
                if (path && path.length >= 2) {
                    // Simple curve interpolation
                    const progress = particle.userData.progress;
                    
                    if (path.length === 2) {
                        // Linear interpolation for 2 points
                        particle.position.lerpVectors(path[0], path[1], progress);
                    } else if (path.length === 3) {
                        // Quadratic Bezier for 3 points
                        const p0 = path[0];
                        const p1 = path[1];
                        const p2 = path[2];
                        
                        const q0 = new THREE.Vector3();
                        q0.lerpVectors(p0, p1, progress);
                        
                        const q1 = new THREE.Vector3();
                        q1.lerpVectors(p1, p2, progress);
                        
                        particle.position.lerpVectors(q0, q1, progress);
                    }
                    
                    // Fade particles based on progress
                    if (progress < 0.2) {
                        particle.material.opacity = progress / 0.2 * 0.7;
                    } else if (progress > 0.8) {
                        particle.material.opacity = (1 - progress) / 0.2 * 0.7;
                    } else {
                        particle.material.opacity = 0.7;
                    }
                }
            });
            
            // Slowly rotate the entire system
            objects.probabilisticGroup.rotation.y += 0.005 * animationSettings.speed;
            objects.probabilisticGroup.rotation.x = Math.sin(time * 0.2) * 0.2;
        },
        
        clear: function() {
            if (objects.probabilisticGroup) {
                scene.remove(objects.probabilisticGroup);
            }
        }
    };
    
    // 9. Quantum Fields Animation
    animations.quantumFields = {
        init: function() {
            const group = new THREE.Group();
            
            // Create quantum field visualization
            const fieldSize = 20;
            const fieldResolution = 20;
            const fieldGeometry = new THREE.PlaneGeometry(
                fieldSize, fieldSize, fieldResolution, fieldResolution
            );
            
            const fieldMaterial = new THREE.MeshBasicMaterial({
                color: 0x6fcbf7,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            
            const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
            field.rotation.x = -Math.PI / 2; // Lay flat
            
            // Create particles that emerge from and return to the field
            const particles = new THREE.Group();
            for (let i = 0; i < 50; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 16, 16),
                    new THREE.MeshPhongMaterial({
                        color: Math.random() > 0.5 ? 0x6fcbf7 : 0xff00ff,
                        emissive: Math.random() > 0.5 ? 0x6fcbf7 : 0xff00ff,
                        emissiveIntensity: 0.5,
                        transparent: true,
                        opacity: 0
                    })
                );
                
                // Random position on the field
                particle.position.set(
                    (Math.random() - 0.5) * fieldSize * 0.8,
                    0, // Start at field level
                    (Math.random() - 0.5) * fieldSize * 0.8
                );
                
                // Particle lifecycle data
                particle.userData = {
                    originalX: particle.position.x,
                    originalZ: particle.position.z,
                    phase: Math.random() * Math.PI * 2,
                    lifetime: Math.random() * 3 + 1,
                    age: Math.random() * 4, // Start at random point
                    maxHeight: Math.random() * 3 + 1
                };
                
                particles.add(particle);
            }
            
            // Add complementary field below for symmetry
            const complementaryField = field.clone();
            complementaryField.material = fieldMaterial.clone();
            complementaryField.material.color.set(0xff00ff);
            complementaryField.position.y = -2;
            
            // Add to group
            group.add(field);
            group.add(complementaryField);
            group.add(particles);
            
            // Add to scene
            scene.add(group);
            objects.fieldsGroup = group;
            objects.field = field;
            objects.complementaryField = complementaryField;
            objects.fieldParticles = particles;
        },
        
        update: function() {
            if (!objects.fieldsGroup) return;
            
            const time = Date.now() * 0.001;
            
            // Animate field waves
            const fieldVerts = objects.field.geometry.attributes.position.array;
            const compFieldVerts = objects.complementaryField.geometry.attributes.position.array;
            
            for (let i = 0; i < fieldVerts.length; i += 3) {
                const x = fieldVerts[i];
                const z = fieldVerts[i + 2];
                
                // Create wave pattern
                const distance = Math.sqrt(x * x + z * z);
                fieldVerts[i + 1] = Math.sin(distance - time * animationSettings.speed) * 0.5;
                
                // Complementary field (inverse phase)
                compFieldVerts[i + 1] = -Math.sin(distance - time * animationSettings.speed) * 0.5;
            }
            
            objects.field.geometry.attributes.position.needsUpdate = true;
            objects.complementaryField.geometry.attributes.position.needsUpdate = true;
            
            // Animate particles (birth and death from field)
            objects.fieldParticles.children.forEach(particle => {
                particle.userData.age += 0.02 * animationSettings.speed;
                
                // Full lifecycle
                const cycle = 4;
                const normalizedTime = (particle.userData.age % cycle) / cycle;
                
                if (normalizedTime < 0.25) {
                    // Birth phase - emerge from field
                    const progress = normalizedTime * 4;
                    const height = progress * particle.userData.maxHeight;
                    
                    particle.position.y = height;
                    particle.material.opacity = progress;
                    particle.scale.set(progress, progress, progress);
                } 
                else if (normalizedTime < 0.75) {
                    // Exist phase - float and move
                    const progress = (normalizedTime - 0.25) * 2; // 0 to 1
                    const height = particle.userData.maxHeight;
                    
                    // Add some movement
                    const x = particle.userData.originalX + Math.sin(time + particle.userData.phase) * 0.5;
                    const z = particle.userData.originalZ + Math.cos(time + particle.userData.phase) * 0.5;
                    
                    particle.position.set(x, height, z);
                    particle.material.opacity = 1;
                    particle.scale.set(1, 1, 1);
                }
                else {
                    // Death phase - return to field
                    const progress = 1 - ((normalizedTime - 0.75) * 4);
                    const height = progress * particle.userData.maxHeight;
                    
                    particle.position.y = height;
                    particle.material.opacity = progress;
                    particle.scale.set(progress, progress, progress);
                }
            });
            
            // Rotate the whole system
            objects.fieldsGroup.rotation.y += 0.003 * animationSettings.speed;
        },
        
        clear: function() {
            if (objects.fieldsGroup) {
                scene.remove(objects.fieldsGroup);
            }
        }
    };
    
    // 10. Quantum Simulations Animation
    animations.quantumSimulations = {
        init: function() {
            const group = new THREE.Group();
            
            // Create "simulation" cube representing a quantum computer
            const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
            const cubeMaterial = new THREE.MeshPhongMaterial({
                color: 0x1a1a2e,
                transparent: true,
                opacity: 0.7
            });
            
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            
            // Add glowing edges to the cube
            const edges = new THREE.EdgesGeometry(cubeGeometry);
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0x6fcbf7,
                transparent: true,
                opacity: 0.7
            });
            
            const lineSegments = new THREE.LineSegments(edges, lineMaterial);
            cube.add(lineSegments);
            
            // Create the "simulated reality" outside the cube
            const realityGroup = new THREE.Group();
            realityGroup.position.set(8, 0, 0);
            
            // Create a simple object in reality (a torus)
            const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 32);
            const torusMaterial = new THREE.MeshPhongMaterial({
                color: 0xff00ff,
                emissive: 0xff00ff,
                emissiveIntensity: 0.3
            });
            
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            realityGroup.add(torus);
            
            // Create data stream connecting simulation and reality
            const dataStream = new THREE.Group();
            
            for (let i = 0; i < 40; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: Math.random() > 0.5 ? 0x6fcbf7 : 0xff00ff,
                        transparent: true,
                        opacity: 0.7
                    })
                );
                
                // Random position along the stream path
                const progress = Math.random();
                particle.position.set(
                    progress * 8 - 3, // -3 to 5
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
                
                particle.userData = {
                    speed: Math.random() * 0.1 + 0.05,
                    initialY: particle.position.y,
                    initialZ: particle.position.z,
                    phase: Math.random() * Math.PI * 2
                };
                
                dataStream.add(particle);
            }
            
            // Add to group
            group.add(cube);
            group.add(realityGroup);
            group.add(dataStream);
            
            // Add to scene
            scene.add(group);
            objects.simulationGroup = group;
            objects.cube = cube;
            objects.realityGroup = realityGroup;
            objects.torus = torus;
            objects.dataStream = dataStream;
        },
        
        update: function() {
            if (!objects.simulationGroup) return;
            
            const time = Date.now() * 0.001;
            
            // Animate cube (simulation) pulsation
            const cubePulse = Math.sin(time) * 0.05 + 1;
            objects.cube.scale.set(cubePulse, cubePulse, cubePulse);
            
            // Animate glowing edges
            objects.cube.children[0].material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
            
            // Animate reality torus
            objects.torus.rotation.x += 0.01 * animationSettings.speed;
            objects.torus.rotation.y += 0.02 * animationSettings.speed;
            
            // Animate data stream particles
            objects.dataStream.children.forEach(particle => {
                // Move particles along x-axis
                particle.position.x += particle.userData.speed * animationSettings.speed;
                
                // Add some wave motion
                particle.position.y = particle.userData.initialY + Math.sin(time * 2 + particle.userData.phase) * 0.3;
                particle.position.z = particle.userData.initialZ + Math.cos(time * 2 + particle.userData.phase) * 0.3;
                
                // Reset position when it reaches the end
                if (particle.position.x > 5) {
                    particle.position.x = -3;
                    particle.userData.initialY = (Math.random() - 0.5) * 2;
                    particle.userData.initialZ = (Math.random() - 0.5) * 2;
                }
                
                // Fade particles at endpoints
                if (particle.position.x < -2) {
                    particle.material.opacity = (particle.position.x + 3) * 0.7;
                } else if (particle.position.x > 4) {
                    particle.material.opacity = (5 - particle.position.x) * 0.7;
                } else {
                    particle.material.opacity = 0.7;
                }
            });
            
            // Rotate the whole system
            objects.simulationGroup.rotation.y += 0.003 * animationSettings.speed;
        },
        
        clear: function() {
            if (objects.simulationGroup) {
                scene.remove(objects.simulationGroup);
            }
        }
    };
    
    // Return all animations
    return animations;
}

