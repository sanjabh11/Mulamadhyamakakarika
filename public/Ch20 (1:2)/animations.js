import * as THREE from 'three';

export class AnimationManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.clock = new THREE.Clock();
        this.animations = [];
        this.currentAnimation = null;
    }
    
    loadAnimation(verseIndex) {
        this.clearAnimation();
        
        switch(verseIndex) {
            case 0: this.setupVerse1Animation(); break;
            case 1: this.setupVerse2Animation(); break;
            case 2: this.setupVerse3Animation(); break;
            case 3: this.setupVerse4Animation(); break;
            case 4: this.setupVerse5Animation(); break;
            case 5: this.setupVerse6Animation(); break;
            case 6: this.setupVerse7Animation(); break;
            case 7: this.setupVerse8Animation(); break;
            case 8: this.setupVerse9Animation(); break;
            case 9: this.setupVerse10Animation(); break;
            case 10: this.setupVerse11Animation(); break;
            case 11: this.setupVerse12Animation(); break;
        }
    }
    
    clearAnimation() {
        // Remove all animation-specific objects
        while(this.scene.children.length > 0) {
            const object = this.scene.children[0];
            if(object.geometry) object.geometry.dispose();
            if(object.material) {
                if(Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        }
        
        // Add lights back
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Reset camera position
        this.camera.position.set(0, 0, 5);
        
        // Clear animation objects
        this.animations = [];
        this.currentAnimation = null;
    }
    
    update() {
        const delta = this.clock.getDelta();
        
        // Call update method for each animation
        for(const animation of this.animations) {
            if(animation.update) {
                animation.update(delta);
            }
        }
    }
    
    triggerInteraction() {
        if(this.currentAnimation && this.currentAnimation.triggerInteraction) {
            this.currentAnimation.triggerInteraction();
        }
    }
    
    setupVerse1Animation() {
        const animation = {
            particles: [],
            superposition: true,
            observedColor: null,
            
            initialize: () => {
                // Create superposition box
                const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
                const boxMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.7
                });
                
                animation.box = new THREE.Mesh(boxGeometry, boxMaterial);
                this.scene.add(animation.box);
                
                // Create swirling particles inside the box
                const colors = [0xf72585, 0x7209b7, 0x3a0ca3, 0x4361ee, 0x4cc9f0, 0x00f5d4, 0xffd60a];
                const particleCount = 200;
                
                for (let i = 0; i < particleCount; i++) {
                    const geometry = new THREE.SphereGeometry(0.08, 8, 8);
                    const material = new THREE.MeshBasicMaterial({
                        color: colors[Math.floor(Math.random() * colors.length)],
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const particle = new THREE.Mesh(geometry, material);
                    
                    // Position randomly inside the box
                    particle.position.set(
                        (Math.random() - 0.5) * 2.5,
                        (Math.random() - 0.5) * 2.5,
                        (Math.random() - 0.5) * 2.5
                    );
                    
                    // Add velocity
                    particle.userData.velocity = {
                        x: (Math.random() - 0.5) * 0.03,
                        y: (Math.random() - 0.5) * 0.03,
                        z: (Math.random() - 0.5) * 0.03
                    };
                    
                    // Store original color for reset
                    particle.userData.originalColor = particle.material.color.clone();
                    
                    this.scene.add(particle);
                    animation.particles.push(particle);
                }
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Fruit emerges from conditions", 40, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
            },
            
            update: (delta) => {
                if (animation.superposition) {
                    // Update particle positions in superposition
                    animation.particles.forEach(particle => {
                        particle.position.x += particle.userData.velocity.x;
                        particle.position.y += particle.userData.velocity.y;
                        particle.position.z += particle.userData.velocity.z;
                        
                        // Keep particles inside the box
                        const limit = 1.3;
                        if (Math.abs(particle.position.x) > limit) {
                            particle.userData.velocity.x *= -1;
                        }
                        if (Math.abs(particle.position.y) > limit) {
                            particle.userData.velocity.y *= -1;
                        }
                        if (Math.abs(particle.position.z) > limit) {
                            particle.userData.velocity.z *= -1;
                        }
                    });
                    
                    // Make box shimmer
                    animation.box.rotation.y += 0.003;
                    animation.box.rotation.x += 0.001;
                    
                    // Create slight color shift effect
                    const hue = (this.clock.elapsedTime * 0.05) % 1;
                    animation.box.material.color.setHSL(hue, 0.5, 0.7);
                } else {
                    // Observed state - rotate the ball
                    if (animation.observedBall) {
                        animation.observedBall.rotation.y += 0.01;
                        animation.observedBall.rotation.x += 0.005;
                    }
                    
                    // Fade in text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                }
            },
            
            triggerInteraction: () => {
                if (!animation.superposition) {
                    // Reset to superposition
                    animation.superposition = true;
                    
                    // Show box and particles
                    animation.box.visible = true;
                    animation.particles.forEach(particle => {
                        particle.visible = true;
                        particle.material.color.copy(particle.userData.originalColor);
                    });
                    
                    // Hide observed ball
                    if (animation.observedBall) {
                        this.scene.remove(animation.observedBall);
                        animation.observedBall = null;
                    }
                    
                    // Update button text
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Observe";
                    }
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                    
                    return;
                }
                
                // Transition to observed state
                animation.superposition = false;
                
                // Create flash effect
                const flashGeometry = new THREE.SphereGeometry(2, 32, 32);
                const flashMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                this.scene.add(flash);
                
                // Animate flash and transition
                const animateFlash = () => {
                    flash.scale.multiplyScalar(1.1);
                    flash.material.opacity -= 0.05;
                    
                    if (flash.material.opacity > 0) {
                        requestAnimationFrame(animateFlash);
                    } else {
                        this.scene.remove(flash);
                        completeObservation();
                    }
                };
                
                const completeObservation = () => {
                    // Hide box and particles
                    animation.box.visible = false;
                    animation.particles.forEach(particle => {
                        particle.visible = false;
                    });
                    
                    // Choose a random color for the observed state
                    const colors = [0xf72585, 0x7209b7, 0x3a0ca3, 0x4361ee, 0x4cc9f0, 0x00f5d4, 0xffd60a];
                    animation.observedColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    // Create the observed ball
                    const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
                    const ballMaterial = new THREE.MeshPhongMaterial({
                        color: animation.observedColor,
                        emissive: animation.observedColor,
                        emissiveIntensity: 0.3,
                        shininess: 30
                    });
                    
                    animation.observedBall = new THREE.Mesh(ballGeometry, ballMaterial);
                    this.scene.add(animation.observedBall);
                    
                    // Update button text
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Reset";
                    }
                };
                
                animateFlash();
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse2Animation() {
        const scene = this.scene;
        const animation = {
            particles: [],
            energyLevel: 0,
            maxEnergyLevel: 3,
            
            initialize: () => {
                // Create vacuum chamber
                const chamberGeometry = new THREE.BoxGeometry(6, 4, 4);
                const chamberMaterial = new THREE.MeshPhongMaterial({
                    color: 0x3a0ca3,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
                animation.chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
                scene.add(animation.chamber);
                
                // Create energy level indicator
                const indicatorGeometry = new THREE.BoxGeometry(0.8, 3, 0.2);
                const indicatorMaterial = new THREE.MeshBasicMaterial({
                    color: 0x4cc9f0
                });
                animation.energyIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
                animation.energyIndicator.position.set(-4, 0, 0);
                scene.add(animation.energyIndicator);
                
                // Create energy level marks
                for (let i = 0; i <= animation.maxEnergyLevel; i++) {
                    const markGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.3);
                    const markMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff
                    });
                    const mark = new THREE.Mesh(markGeometry, markMaterial);
                    mark.position.set(-4, -1.5 + i, 0);
                    scene.add(mark);
                    
                    // Add label
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 32;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#ffffff';
                    context.font = 'Bold 16px Arial';
                    context.fillText(`${i}`, 10, 20);
                    
                    const texture = new THREE.CanvasTexture(canvas);
                    const material = new THREE.SpriteMaterial({ map: texture });
                    
                    const sprite = new THREE.Sprite(material);
                    sprite.position.set(-4.5, -1.5 + i, 0);
                    sprite.scale.set(0.5, 0.25, 1);
                    scene.add(sprite);
                }
                
                // Create initial energy fill
                const fillGeometry = new THREE.BoxGeometry(0.7, 0.01, 0.18);
                const fillMaterial = new THREE.MeshBasicMaterial({
                    color: 0xf72585
                });
                animation.energyFill = new THREE.Mesh(fillGeometry, fillMaterial);
                animation.energyFill.position.set(-4, -1.5, 0);
                scene.add(animation.energyFill);
                                 
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Particles emerge from conditions", 30, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                scene.add(sprite);
                animation.textSprite = sprite;
                
                // Create UI controls for material selection
                const interactionControls = document.getElementById('interaction-controls');
                interactionControls.innerHTML = '';
                
                const materialLabel = document.createElement('div');
                materialLabel.textContent = 'Select material:';
                materialLabel.style.marginBottom = '10px';
                interactionControls.appendChild(materialLabel);
                
                const materials = [
                    {id: 'wet', label: 'Wet Wood'},
                    {id: 'dry', label: 'Dry Wood'},
                    {id: 'dry_with_match', label: 'Dry Wood + Match'}
                ];
                
                materials.forEach(material => {
                    const button = document.createElement('button');
                    button.className = 'interaction-btn';
                    button.textContent = material.label;
                    button.addEventListener('click', () => {
                        animation.changeMaterial(material.id);
                    });
                    interactionControls.appendChild(button);
                });
                
                const igniteButton = document.createElement('button');
                igniteButton.className = 'interaction-btn';
                igniteButton.textContent = 'Ignite';
                igniteButton.style.marginTop = '10px';
                igniteButton.style.backgroundColor = '#f72585';
                igniteButton.addEventListener('click', () => {
                    animation.triggerInteraction();
                });
                interactionControls.appendChild(igniteButton);
                
                // Create match (initially hidden)
                const matchStickGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 16);
                const matchHeadGeometry = new THREE.SphereGeometry(0.08, 16, 16);
                
                const matchStickMaterial = new THREE.MeshPhongMaterial({
                    color: 0xd2b48c
                });
                
                const matchHeadMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf72585
                });
                
                animation.matchStick = new THREE.Mesh(matchStickGeometry, matchStickMaterial);
                animation.matchHead = new THREE.Mesh(matchHeadGeometry, matchHeadMaterial);
                
                animation.matchStick.position.set(0, 0, 2);
                animation.matchStick.rotation.x = Math.PI / 2;
                animation.matchHead.position.set(0, 0, 2.5);
                
                const matchGroup = new THREE.Group();
                matchGroup.add(animation.matchStick);
                matchGroup.add(animation.matchHead);
                matchGroup.visible = false;
                
                scene.add(matchGroup);
                animation.matchGroup = matchGroup;
                
                // Create fluctuating particles (Moved call here after textSprite is defined)
                animation.updateParticles();
            },
            
            updateParticles: () => {
                // Clear previous particles
                animation.particles.forEach(p => scene.remove(p));
                animation.particles = [];
                
                // Vacuum fluctuations (small random particles)
                const fluctuationCount = 30;
                const smallParticleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                
                for (let i = 0; i < fluctuationCount; i++) {
                    const material = new THREE.MeshBasicMaterial({
                        color: 0x4cc9f0,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const particle = new THREE.Mesh(smallParticleGeometry, material);
                    particle.position.set(
                        (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * 3,
                        (Math.random() - 0.5) * 3
                    );
                    
                    // Add random motion
                    particle.userData.velocity = {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    };
                    particle.userData.lifespan = 2 + Math.random() * 3;
                    particle.userData.age = 0;
                    
                    scene.add(particle);
                    animation.particles.push(particle);
                }
                
                // Add stable particles based on energy level
                if (animation.energyLevel > 0) {
                    const stableCount = animation.energyLevel * 2;
                    const colors = [0xf72585, 0x7209b7, 0xffd60a];
                    
                    for (let i = 0; i < stableCount; i++) {
                        const size = 0.15 + (animation.energyLevel * 0.05);
                        const geometry = new THREE.SphereGeometry(size, 16, 16);
                        const material = new THREE.MeshPhongMaterial({
                            color: colors[i % colors.length],
                            emissive: colors[i % colors.length],
                            emissiveIntensity: 0.3
                        });
                        
                        const particle = new THREE.Mesh(geometry, material);
                        particle.position.set(
                            (Math.random() - 0.5) * 4,
                            (Math.random() - 0.5) * 2,
                            (Math.random() - 0.5) * 2
                        );
                        
                        // Add orbital motion
                        particle.userData.velocity = {
                            x: (Math.random() - 0.5) * 0.01,
                            y: (Math.random() - 0.5) * 0.01,
                            z: (Math.random() - 0.5) * 0.01
                        };
                        particle.userData.orbit = {
                            center: new THREE.Vector3(
                                (Math.random() - 0.5) * 2,
                                (Math.random() - 0.5) * 1,
                                (Math.random() - 0.5) * 1
                            ),
                            radius: 0.5 + Math.random() * 0.5,
                            speed: 0.2 + Math.random() * 0.2,
                            phase: Math.random() * Math.PI * 2
                        };
                        
                        scene.add(particle);
                        animation.particles.push(particle);
                    }
                    
                    if (animation.energyLevel >= 2 && animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity = 0.8;
                    }
                } else {
                    animation.textSprite.material.opacity = 0;
                }
            },
            
            update: (delta) => {
                // Update vacuum fluctuation particles
                animation.particles.forEach((particle, index) => {
                    if (particle.userData.lifespan) {
                        // Update vacuum fluctuation
                        particle.position.x += particle.userData.velocity.x;
                        particle.position.y += particle.userData.velocity.y;
                        particle.position.z += particle.userData.velocity.z;
                        
                        // Update age
                        particle.userData.age += delta;
                        
                        // Fade out at end of life
                        if (particle.userData.age > particle.userData.lifespan) {
                            particle.userData.age = 0;
                            
                            // Reposition particle
                            particle.position.set(
                                (Math.random() - 0.5) * 5,
                                (Math.random() - 0.5) * 3,
                                (Math.random() - 0.5) * 3
                            );
                        }
                        
                        // Flicker effect
                        particle.material.opacity = 0.3 * (1 - (particle.userData.age / particle.userData.lifespan));
                    } else if (particle.userData.orbit) {
                        // Update stable particle with orbital motion
                        const orbit = particle.userData.orbit;
                        const time = this.clock.elapsedTime;
                        
                        // Combine Brownian motion with orbital motion
                        particle.position.x += particle.userData.velocity.x;
                        particle.position.y += particle.userData.velocity.y;
                        particle.position.z += particle.userData.velocity.z;
                        
                        // Add orbital component
                        particle.position.x = orbit.center.x + Math.cos(time * orbit.speed + orbit.phase) * orbit.radius;
                        particle.position.y = orbit.center.y + Math.sin(time * orbit.speed + orbit.phase) * orbit.radius;
                        
                        // Bounce off chamber walls
                        const limit = {
                            x: animation.chamber.geometry.parameters.width / 2 - 0.2,
                            y: animation.chamber.geometry.parameters.height / 2 - 0.2,
                            z: animation.chamber.geometry.parameters.depth / 2 - 0.2
                        };
                        
                        if (Math.abs(particle.position.x) > limit.x) {
                            particle.userData.velocity.x *= -1;
                            orbit.center.x = Math.sign(orbit.center.x) * (limit.x - orbit.radius);
                        }
                        if (Math.abs(particle.position.y) > limit.y) {
                            particle.userData.velocity.y *= -1;
                            orbit.center.y = Math.sign(orbit.center.y) * (limit.y - orbit.radius);
                        }
                        if (Math.abs(particle.position.z) > limit.z) {
                            particle.userData.velocity.z *= -1;
                            orbit.center.z = Math.sign(orbit.center.z) * (limit.z - orbit.radius);
                        }
                        
                        // Rotate particle
                        particle.rotation.x += 0.01;
                        particle.rotation.y += 0.01;
                    }
                });
                
                // Make chamber pulse slightly
                const pulse = 1 + Math.sin(this.clock.elapsedTime * 2) * 0.02;
                animation.chamber.scale.set(pulse, pulse, pulse);
                
                // Glow based on energy level
                animation.chamber.material.emissive = new THREE.Color(0x4cc9f0);
                animation.chamber.material.emissiveIntensity = animation.energyLevel * 0.1;
                
                // Update energy fill
                const fillHeight = animation.energyLevel / animation.maxEnergyLevel * 3;
                animation.energyFill.scale.set(1, fillHeight * 100, 1);
                animation.energyFill.position.y = -1.5 + fillHeight / 2;
            },
            
            triggerInteraction: () => {
                // Increase energy level
                animation.energyLevel = (animation.energyLevel + 1) % (animation.maxEnergyLevel + 1);
                
                // Energy pulse effect
                const pulseGeometry = new THREE.SphereGeometry(animation.chamber.geometry.parameters.width / 1.5, 32, 32);
                const pulseMaterial = new THREE.MeshBasicMaterial({
                    color: 0xf72585,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                
                const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
                scene.add(pulse);
                
                // Animate pulse
                const animatePulse = () => {
                    pulse.scale.multiplyScalar(1.05);
                    pulse.material.opacity -= 0.02;
                    
                    if (pulse.material.opacity > 0) {
                        requestAnimationFrame(animatePulse);
                    } else {
                        scene.remove(pulse);
                    }
                };
                
                animatePulse();
                
                // Update particles
                animation.updateParticles();
                
                // Update button text
                const button = document.querySelector('.interaction-btn[style*="background-color"]');
                if (button) {
                    button.textContent = animation.energyLevel === 0 ? 
                        "Add Energy" : 
                        `Energy Level: ${animation.energyLevel}/${animation.maxEnergyLevel}`;
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse3Animation() {
        const animation = {
            boxState: "wrapped", // wrapped, unwrapping, unwrapped
            
            initialize: () => {
                // Create wrapped gift box
                const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
                const boxMaterial = new THREE.MeshPhongMaterial({
                    color: 0x4cc9f0,
                    specular: 0xffffff,
                    shininess: 30
                });
                
                animation.box = new THREE.Mesh(boxGeometry, boxMaterial);
                this.scene.add(animation.box);
                
                // Create wrapping paper
                const wrappingGeometry = new THREE.BoxGeometry(2.05, 2.05, 2.05);
                const wrappingMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf72585,
                    specular: 0xffffff,
                    shininess: 50
                });
                
                animation.wrapping = new THREE.Mesh(wrappingGeometry, wrappingMaterial);
                this.scene.add(animation.wrapping);
                
                // Create ribbon
                const ribbonXGeometry = new THREE.BoxGeometry(2.2, 0.2, 0.2);
                const ribbonYGeometry = new THREE.BoxGeometry(0.2, 2.2, 0.2);
                const ribbonZGeometry = new THREE.BoxGeometry(0.2, 0.2, 2.2);
                
                const ribbonMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffd60a,
                    specular: 0xffffff,
                    shininess: 80
                });
                
                animation.ribbonX = new THREE.Mesh(ribbonXGeometry, ribbonMaterial);
                animation.ribbonY = new THREE.Mesh(ribbonYGeometry, ribbonMaterial);
                animation.ribbonZ = new THREE.Mesh(ribbonZGeometry, ribbonMaterial);
                
                this.scene.add(animation.ribbonX);
                this.scene.add(animation.ribbonY);
                this.scene.add(animation.ribbonZ);
                
                // Create bow
                const bowGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
                const bowMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffd60a,
                    specular: 0xffffff,
                    shininess: 80
                });
                
                animation.bow = new THREE.Mesh(bowGeometry, bowMaterial);
                animation.bow.position.set(0, 1.1, 0);
                animation.bow.rotation.x = Math.PI / 2;
                this.scene.add(animation.bow);
                
                // Create gift inside (initially hidden)
                const giftGeometry = new THREE.SphereGeometry(0.8, 32, 32);
                const giftMaterial = new THREE.MeshPhongMaterial({
                    color: 0x7209b7,
                    emissive: 0x7209b7,
                    emissiveIntensity: 0.3,
                    specular: 0xffffff,
                    shininess: 100
                });
                
                animation.gift = new THREE.Mesh(giftGeometry, giftMaterial);
                animation.gift.visible = false;
                this.scene.add(animation.gift);
                
                // Create quantum cloud (representing non-apprehendability)
                animation.createQuantumCloud();
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Fruit isn't apprehendable until produced", 5, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
            },
            
            createQuantumCloud: () => {
                const particles = [];
                const particleCount = 100;
                const cloudRadius = 1.5;
                
                const cloudGeometry = new THREE.SphereGeometry(0.08, 8, 8);
                
                for (let i = 0; i < particleCount; i++) {
                    // Use different colors for visual interest
                    const hue = i / particleCount;
                    const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
                    
                    const cloudMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: 0.4
                    });
                    
                    const particle = new THREE.Mesh(cloudGeometry, cloudMaterial);
                    
                    // Position particles in a spherical cloud
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const r = cloudRadius * Math.cbrt(Math.random()); // Cubic root for even distribution
                    
                    particle.position.set(
                        r * Math.sin(phi) * Math.cos(theta),
                        r * Math.sin(phi) * Math.sin(theta),
                        r * Math.cos(phi)
                    );
                    
                    // Add random motion
                    particle.userData = {
                        initialPosition: particle.position.clone(),
                        phase: Math.random() * Math.PI * 2,
                        frequency: 0.5 + Math.random() * 0.2,
                        amplitude: 0.1 + Math.random() * 0.2
                    };
                    
                    particles.push(particle);
                    this.scene.add(particle);
                }
                
                animation.cloudParticles = particles;
            },
            
            update: (delta) => {
                // Rotate gift box
                if (animation.boxState === "wrapped") {
                    animation.box.rotation.y += 0.005;
                    animation.wrapping.rotation.copy(animation.box.rotation);
                    animation.ribbonX.rotation.copy(animation.box.rotation);
                    animation.ribbonY.rotation.copy(animation.box.rotation);
                    animation.ribbonZ.rotation.copy(animation.box.rotation);
                    animation.bow.rotation.x = Math.PI / 2 + animation.box.rotation.x;
                    animation.bow.rotation.y = animation.box.rotation.y;
                    animation.bow.rotation.z = animation.box.rotation.z;
                    
                    // Update quantum cloud
                    const time = this.clock.elapsedTime;
                    animation.cloudParticles.forEach(particle => {
                        const userData = particle.userData;
                        
                        // Oscillatory motion
                        particle.position.x = userData.initialPosition.x + 
                            Math.sin(time * userData.frequency + userData.phase) * userData.amplitude;
                        particle.position.y = userData.initialPosition.y + 
                            Math.sin(time * userData.frequency + userData.phase + Math.PI/2) * userData.amplitude;
                        particle.position.z = userData.initialPosition.z + 
                            Math.sin(time * userData.frequency + userData.phase + Math.PI) * userData.amplitude;
                        
                        // Pulse opacity
                        particle.material.opacity = 0.2 + 0.2 * Math.sin(time * 2 + userData.phase);
                    });
                } else if (animation.boxState === "unwrapped") {
                    // Rotate gift
                    animation.gift.rotation.y += 0.01;
                    
                    // Fade in text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                }
            },
            
            triggerInteraction: () => {
                if (animation.boxState === "wrapped") {
                    // Start unwrapping
                    animation.boxState = "unwrapping";
                    
                    // Animate wrapping paper opening
                    const unwrap = () => {
                        const pieces = [animation.wrapping, animation.ribbonX, animation.ribbonY, animation.ribbonZ, animation.bow];
                        
                        // Unwrap animation - move each piece outward and fade
                        pieces.forEach((piece, i) => {
                            // Calculate direction based on position
                            const direction = piece.position.clone().normalize();
                            if (direction.length() === 0) {
                                direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
                            }
                            
                            // Add random rotation
                            piece.userData = {
                                direction: direction.multiplyScalar(0.1),
                                rotation: new THREE.Vector3(
                                    Math.random() * 0.1,
                                    Math.random() * 0.1,
                                    Math.random() * 0.1
                                )
                            };
                        });
                        
                        // Animate pieces moving outward
                        let frame = 0;
                        const maxFrames = 60;
                        const animatePieces = () => {
                            pieces.forEach(piece => {
                                piece.position.add(piece.userData.direction);
                                piece.rotation.x += piece.userData.rotation.x;
                                piece.rotation.y += piece.userData.rotation.y;
                                piece.rotation.z += piece.userData.rotation.z;
                                piece.material.opacity = 1 - (frame / maxFrames);
                            });
                            
                            frame++;
                            if (frame < maxFrames) {
                                requestAnimationFrame(animatePieces);
                            } else {
                                // Hide unwrapped pieces
                                pieces.forEach(piece => {
                                    piece.visible = false;
                                });
                                
                                // Complete unwrapping
                                animation.completeUnwrapping();
                            }
                        };
                        
                        // Make materials transparent for fading
                        pieces.forEach(piece => {
                            piece.material.transparent = true;
                        });
                        
                        animatePieces();
                    };
                    
                    // Stagger unwrapping
                    setTimeout(unwrap, 500);
                    
                    // Hide cloud particles
                    animation.cloudParticles.forEach(particle => {
                        particle.visible = false;
                    });
                    
                    // Update button
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Unwrapping...";
                        button.disabled = true;
                    }
                } else if (animation.boxState === "unwrapped") {
                    // Reset to wrapped state
                    animation.boxState = "wrapped";
                    
                    // Hide gift
                    animation.gift.visible = false;
                    
                    // Show wrapping
                    animation.wrapping.visible = true;
                    animation.ribbonX.visible = true;
                    animation.ribbonY.visible = true;
                    animation.ribbonZ.visible = true;
                    animation.bow.visible = true;
                    
                    // Reset positions
                    animation.wrapping.position.set(0, 0, 0);
                    animation.ribbonX.position.set(0, 0, 0);
                    animation.ribbonY.position.set(0, 0, 0);
                    animation.ribbonZ.position.set(0, 0, 0);
                    animation.bow.position.set(0, 1.1, 0);
                    
                    // Reset rotations
                    animation.box.rotation.set(0, 0, 0);
                    animation.wrapping.rotation.set(0, 0, 0);
                    animation.ribbonX.rotation.set(0, 0, 0);
                    animation.ribbonY.rotation.set(0, 0, 0);
                    animation.ribbonZ.rotation.set(0, 0, 0);
                    animation.bow.rotation.set(Math.PI/2, 0, 0);
                    
                    // Reset materials
                    [animation.wrapping, animation.ribbonX, animation.ribbonY, animation.ribbonZ, animation.bow].forEach(piece => {
                        piece.material.opacity = 1;
                    });
                    
                    // Show cloud particles
                    animation.cloudParticles.forEach(particle => {
                        particle.visible = true;
                    });
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                    
                    // Update button
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Unwrap";
                        button.disabled = false;
                    }
                }
            },
            
            completeUnwrapping: () => {
                animation.boxState = "unwrapped";
                
                // Show gift with a flash
                const flashGeometry = new THREE.SphereGeometry(1.2, 32, 32);
                const flashMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 1
                });
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                this.scene.add(flash);
                
                // Hide box
                animation.box.visible = false;
                
                // Animate flash
                const animateFlash = () => {
                    flash.scale.multiplyScalar(1.1);
                    flash.material.opacity -= 0.05;
                    
                    if (flash.material.opacity > 0) {
                        requestAnimationFrame(animateFlash);
                    } else {
                        this.scene.remove(flash);
                    }
                };
                
                animateFlash();
                
                // Show gift
                animation.gift.visible = true;
                
                // Update button
                const button = document.querySelector('[data-action="primary-action"]');
                if (button) {
                    button.textContent = "Wrap Again";
                    button.disabled = false;
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse4Animation() {
        const animation = {
            fireState: "unlit", // unlit, lit
            currentMaterial: "wet", // wet, dry, dry_with_match
            
            initialize: () => {
                // Create fire pit
                const pitGeometry = new THREE.CylinderGeometry(1.5, 1.2, 0.5, 32);
                const pitMaterial = new THREE.MeshPhongMaterial({
                    color: 0x3a0ca3,
                    emissive: 0x3a0ca3,
                    emissiveIntensity: 0.2
                });
                
                animation.pit = new THREE.Mesh(pitGeometry, pitMaterial);
                animation.pit.position.y = -0.5;
                this.scene.add(animation.pit);
                
                // Create match (initially hidden) - Moved before createLogs
                const matchStickGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 16);
                const matchHeadGeometry = new THREE.SphereGeometry(0.08, 16, 16);
                
                const matchStickMaterial = new THREE.MeshPhongMaterial({
                    color: 0xd2b48c
                });
                
                const matchHeadMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf72585
                });
                
                animation.matchStick = new THREE.Mesh(matchStickGeometry, matchStickMaterial);
                animation.matchHead = new THREE.Mesh(matchHeadGeometry, matchHeadMaterial);
                
                animation.matchStick.position.set(0, 0, 2);
                animation.matchStick.rotation.x = Math.PI / 2;
                animation.matchHead.position.set(0, 0, 2.5);
                
                const matchGroup = new THREE.Group();
                matchGroup.add(animation.matchStick);
                matchGroup.add(animation.matchHead);
                matchGroup.visible = false;
                
                this.scene.add(matchGroup);
                animation.matchGroup = matchGroup;
                
                // Create logs (initially wet)
                animation.createLogs("wet");
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Without conditions, no effect", 40, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
                
                // Create UI controls for material selection
                const interactionControls = document.getElementById('interaction-controls');
                interactionControls.innerHTML = '';
                
                const materialLabel = document.createElement('div');
                materialLabel.textContent = 'Select material:';
                materialLabel.style.marginBottom = '10px';
                interactionControls.appendChild(materialLabel);
                
                const materials = [
                    {id: 'wet', label: 'Wet Wood'},
                    {id: 'dry', label: 'Dry Wood'},
                    {id: 'dry_with_match', label: 'Dry Wood + Match'}
                ];
                
                materials.forEach(material => {
                    const button = document.createElement('button');
                    button.className = 'interaction-btn';
                    button.textContent = material.label;
                    button.addEventListener('click', () => {
                        animation.changeMaterial(material.id);
                    });
                    interactionControls.appendChild(button);
                });
                
                const igniteButton = document.createElement('button');
                igniteButton.className = 'interaction-btn';
                igniteButton.textContent = 'Ignite';
                igniteButton.style.marginTop = '10px';
                igniteButton.style.backgroundColor = '#f72585';
                igniteButton.addEventListener('click', () => {
                    animation.triggerInteraction();
                });
                interactionControls.appendChild(igniteButton);
                
                // Match creation code was moved earlier in initialize()
            },
            
            createLogs: (materialType) => {
                // Remove previous logs if they exist
                if (animation.logs) {
                    animation.logs.forEach(log => this.scene.remove(log));
                }
                
                animation.logs = [];
                
                // Create logs based on material type
                const logCount = 5;
                let color, emissive, emissiveIntensity;
                
                switch(materialType) {
                    case "wet":
                        color = 0x4361ee;
                        emissive = 0x4361ee;
                        emissiveIntensity = 0.1;
                        break;
                    case "dry":
                    case "dry_with_match":
                        color = 0x7209b7;
                        emissive = 0x7209b7;
                        emissiveIntensity = 0.2;
                        break;
                }
                
                for (let i = 0; i < logCount; i++) {
                    const logGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
                    const logMaterial = new THREE.MeshPhongMaterial({
                        color: color,
                        emissive: emissive,
                        emissiveIntensity: emissiveIntensity
                    });
                    
                    const log = new THREE.Mesh(logGeometry, logMaterial);
                    
                    // Position logs in a tepee arrangement
                    const angle = (i / logCount) * Math.PI * 2;
                    const radius = 0.8;
                    
                    log.position.set(
                        Math.cos(angle) * radius,
                        0.5,
                        Math.sin(angle) * radius
                    );
                    
                    // Tilt logs inward
                    log.rotation.x = Math.random() * 0.2 + 0.1;
                    log.rotation.z = -Math.atan2(Math.sin(angle), Math.cos(angle));
                    
                    this.scene.add(log);
                    animation.logs.push(log);
                }
                
                // Show/hide match based on material
                animation.matchGroup.visible = (materialType === "dry_with_match");
                
                // Reset fire state if material changes
                if (animation.fireState === "lit") {
                    animation.fireState = "unlit";
                    
                    // Remove flames if they exist
                    if (animation.flames) {
                        animation.flames.forEach(flame => this.scene.remove(flame));
                        animation.flames = null;
                    }
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                }
            },
            
            createFlames: () => {
                animation.flames = [];
                
                // Create multiple flame particles
                const flameCount = 20;
                const flameColors = [0xffd60a, 0xff9500, 0xff4800, 0xff0000];
                
                for (let i = 0; i < flameCount; i++) {
                    const size = 0.2 + Math.random() * 0.3;
                    const flameGeometry = new THREE.SphereGeometry(size, 16, 16);
                    const flameMaterial = new THREE.MeshBasicMaterial({
                        color: flameColors[Math.floor(Math.random() * flameColors.length)],
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
                    
                    flame.position.set(
                        (Math.random() - 0.5) * 0.8,
                        0.5 + Math.random() * 0.5,
                        (Math.random() - 0.5) * 0.8
                    );
                    
                    // Add flame animation data
                    flame.userData = {
                        initialY: flame.position.y,
                        speed: 0.05 + Math.random() * 0.1,
                        wiggle: 0.05 + Math.random() * 0.05,
                        phase: Math.random() * Math.PI * 2
                    };
                    
                    this.scene.add(flame);
                    animation.flames.push(flame);
                }
                
                // Create smoke particles
                const smokeCount = 15;
                animation.smokeParticles = [];
                
                for (let i = 0; i < smokeCount; i++) {
                    const size = 0.1 + Math.random() * 0.2;
                    const smokeGeometry = new THREE.SphereGeometry(size, 16, 16);
                    const smokeMaterial = new THREE.MeshBasicMaterial({
                        color: 0x444444,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
                    
                    smoke.position.set(
                        (Math.random() - 0.5) * 1,
                        1 + Math.random() * 0.5,
                        (Math.random() - 0.5) * 1
                    );
                    
                    // Add smoke animation data
                    smoke.userData = {
                        speed: 0.02 + Math.random() * 0.02,
                        wiggle: 0.03 + Math.random() * 0.03,
                        phase: Math.random() * Math.PI * 2,
                        growRate: 1.01 + Math.random() * 0.01
                    };
                    
                    this.scene.add(smoke);
                    animation.smokeParticles.push(smoke);
                }
                
                // Add point light for fire glow
                const fireLight = new THREE.PointLight(0xff9500, 2, 10);
                fireLight.position.set(0, 0.5, 0);
                this.scene.add(fireLight);
                animation.fireLight = fireLight;
            },
            
            update: (delta) => {
                if (animation.fireState === "lit") {
                    // Animate flames
                    const time = this.clock.elapsedTime;
                    
                    animation.flames.forEach(flame => {
                        const userData = flame.userData;
                        
                        // Moving upward with wiggle
                        flame.position.y = userData.initialY + Math.sin(time * userData.speed) * 0.2;
                        flame.position.x += Math.sin(time * 2 + userData.phase) * userData.wiggle * delta;
                        flame.position.z += Math.cos(time * 2 + userData.phase) * userData.wiggle * delta;
                        
                        // Random scale fluctuation
                        const scaleFluctuation = 0.9 + Math.sin(time * 3 + userData.phase) * 0.2;
                        flame.scale.set(scaleFluctuation, scaleFluctuation, scaleFluctuation);
                        
                        // Random opacity fluctuation
                        flame.material.opacity = 0.7 + Math.sin(time * 4 + userData.phase) * 0.3;
                    });
                    
                    // Animate smoke
                    animation.smokeParticles.forEach((smoke, index) => {
                        const userData = smoke.userData;
                        
                        // Rising smoke
                        smoke.position.y += userData.speed;
                        smoke.position.x += Math.sin(time + userData.phase) * userData.wiggle * delta;
                        smoke.position.z += Math.cos(time + userData.phase) * userData.wiggle * delta;
                        
                        // Growing as it rises
                        smoke.scale.multiplyScalar(userData.growRate * delta * 10);
                        
                        // Fading out
                        smoke.material.opacity -= 0.01 * delta * 10;
                        
                        // Reset if gone too high or faded out
                        if (smoke.position.y > 3 || smoke.material.opacity <= 0) {
                            smoke.position.set(
                                (Math.random() - 0.5) * 1,
                                1 + Math.random() * 0.5,
                                (Math.random() - 0.5) * 1
                            );
                            smoke.scale.set(1, 1, 1);
                            smoke.material.opacity = 0.3;
                            userData.phase = Math.random() * Math.PI * 2;
                        }
                    });
                    
                    // Animate fire light intensity
                    animation.fireLight.intensity = 1.5 + Math.sin(time * 3) * 0.5;
                    
                    // Show text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                }
                
                // If match is present, make it sway slightly
                if (animation.matchGroup.visible) {
                    animation.matchGroup.rotation.z = Math.sin(this.clock.elapsedTime) * 0.1;
                }
            },
            
            changeMaterial: (materialType) => {
                animation.currentMaterial = materialType;
                animation.createLogs(materialType);
            },
            
            triggerInteraction: () => {
                // Try to ignite based on current material
                if (animation.fireState === "lit") {
                    // Extinguish fire
                    animation.fireState = "unlit";
                    
                    // Remove flames
                    if (animation.flames) {
                        animation.flames.forEach(flame => this.scene.remove(flame));
                        animation.flames = null;
                    }
                    
                    // Remove smoke
                    if (animation.smokeParticles) {
                        animation.smokeParticles.forEach(smoke => this.scene.remove(smoke));
                        animation.smokeParticles = null;
                    }
                    
                    // Remove light
                    if (animation.fireLight) {
                        this.scene.remove(animation.fireLight);
                        animation.fireLight = null;
                    }
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                    
                    // Update button
                    const igniteButton = document.querySelector('.interaction-btn[style*="background-color"]');
                    if (igniteButton) {
                        igniteButton.textContent = "Ignite";
                    }
                    
                    return;
                }
                
                let willIgnite = false;
                
                switch(animation.currentMaterial) {
                    case "wet":
                        // Show failed ignition effect
                        this.showFailedIgnitionEffect();
                        break;
                    case "dry":
                        // Show failed ignition effect - dry wood also needs a match
                        this.showFailedIgnitionEffect();
                        break;
                    case "dry_with_match":
                        // Success! Create fire
                        willIgnite = true;
                        break;
                }
                
                if (willIgnite) {
                    // Successful ignition
                    animation.fireState = "lit";
                    
                    // Create flames
                    animation.createFlames();
                    
                    // Create ignition flash
                    const flashGeometry = new THREE.SphereGeometry(1.5, 32, 32);
                    const flashMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffd60a,
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                    flash.position.set(0, 0.5, 0);
                    this.scene.add(flash);
                    
                    // Animate flash
                    const animateFlash = () => {
                        flash.scale.multiplyScalar(1.1);
                        flash.material.opacity -= 0.05;
                        
                        if (flash.material.opacity > 0) {
                            requestAnimationFrame(animateFlash);
                        } else {
                            this.scene.remove(flash);
                        }
                    };
                    
                    animateFlash();
                    
                    // Hide match after use
                    animation.matchGroup.visible = false;
                    
                    // Update button
                    const igniteButton = document.querySelector('.interaction-btn[style*="background-color"]');
                    if (igniteButton) {
                        igniteButton.textContent = "Extinguish";
                    }
                }
            },
            
            showFailedIgnitionEffect: function() {
                // Show smoke puff but no fire
                const smokeCount = 10;
                const smokePuffs = [];
                
                for (let i = 0; i < smokeCount; i++) {
                    const size = 0.1 + Math.random() * 0.2;
                    const smokeGeometry = new THREE.SphereGeometry(size, 16, 16);
                    const smokeMaterial = new THREE.MeshBasicMaterial({
                        color: 0x888888,
                        transparent: true,
                        opacity: 0.5
                    });
                    
                    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
                    
                    smoke.position.set(
                        (Math.random() - 0.5) * 1,
                        0.5 + Math.random() * 0.5,
                        (Math.random() - 0.5) * 1
                    );
                    
                    // Animation data
                    smoke.userData = {
                        velocity: new THREE.Vector3(
                            (Math.random() - 0.5) * 0.01,
                            0.01 + Math.random() * 0.01,
                            (Math.random() - 0.5) * 0.01
                        ),
                        fadeRate: 0.02 + Math.random() * 0.01
                    };
                    
                    this.scene.add(smoke);
                    smokePuffs.push(smoke);
                }
                
                // Animate smoke puffs
                const animateSmokePuffs = () => {
                    let allFaded = true;
                    
                    smokePuffs.forEach(smoke => {
                        smoke.position.add(smoke.userData.velocity);
                        smoke.scale.multiplyScalar(1.01);
                        smoke.material.opacity -= smoke.userData.fadeRate;
                        
                        if (smoke.material.opacity > 0) {
                            allFaded = false;
                        }
                    });
                    
                    if (!allFaded) {
                        requestAnimationFrame(animateSmokePuffs);
                    } else {
                        // Remove all smoke puffs
                        smokePuffs.forEach(smoke => this.scene.remove(smoke));
                    }
                };
                
                animateSmokePuffs();
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse5Animation() {
        const animation = {
            isExcited: false,
            
            initialize: () => {
                // Create atom nucleus
                const nucleusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const nucleusMaterial = new THREE.MeshPhongMaterial({
                    color: 0x7209b7,
                    emissive: 0x7209b7,
                    emissiveIntensity: 0.3
                });
                
                animation.nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
                this.scene.add(animation.nucleus);
                
                // Create electron shells (orbits)
                const orbits = [];
                const orbitCount = 3;
                
                for (let i = 0; i < orbitCount; i++) {
                    const radius = 1 + i * 0.8;
                    const orbitGeometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
                    const orbitMaterial = new THREE.MeshBasicMaterial({
                        color: 0x4cc9f0,
                        transparent: true,
                        opacity: 0.7
                    });
                    
                    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                    orbit.rotation.x = Math.PI / 2;
                    orbit.rotation.y = Math.PI / 6 * i; // Tilt each orbit differently
                    
                    this.scene.add(orbit);
                    orbits.push({
                        mesh: orbit,
                        radius: radius
                    });
                }
                
                animation.orbits = orbits;
                
                // Create electron
                const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const electronMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf72585,
                    emissive: 0xf72585,
                    emissiveIntensity: 0.5
                });
                
                animation.electron = new THREE.Mesh(electronGeometry, electronMaterial);
                
                // Start electron in first orbit
                animation.currentOrbit = 0;
                animation.positionElectronInOrbit(animation.currentOrbit);
                this.scene.add(animation.electron);
                
                // Add energy level labels
                for (let i = 0; i < orbitCount; i++) {
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 32;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#ffffff';
                    context.font = 'Bold 16px Arial';
                    context.fillText(`E${i+1}`, 10, 20);
                    
                    const texture = new THREE.CanvasTexture(canvas);
                    const material = new THREE.SpriteMaterial({ map: texture });
                    
                    const sprite = new THREE.Sprite(material);
                    sprite.position.set(orbits[i].radius + 0.3, 0, 0);
                    sprite.scale.set(0.5, 0.25, 1);
                    this.scene.add(sprite);
                }
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Cause can't be both giving and stopping", 10, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
                
                // Create electron trail
                animation.createElectronTrail();
            },
            
            createElectronTrail: () => {
                const trailPoints = [];
                const trailLength = 20;
                
                for (let i = 0; i < trailLength; i++) {
                    trailPoints.push(animation.electron.position.clone());
                }
                
                const trailGeometry = new THREE.BufferGeometry();
                const trailMaterial = new THREE.LineBasicMaterial({
                    color: 0xf72585,
                    transparent: true,
                    opacity: 0.4
                });
                
                const trail = new THREE.Line(trailGeometry, trailMaterial);
                this.scene.add(trail);
                
                animation.trail = {
                    line: trail,
                    points: trailPoints,
                    maxLength: trailLength
                };
            },
            
            positionElectronInOrbit: (orbitIndex) => {
                const orbit = animation.orbits[orbitIndex];
                animation.orbitParams = {
                    radius: orbit.radius,
                    speed: 1 - orbitIndex * 0.2, // Higher orbits are slower
                    angle: Math.random() * Math.PI * 2,
                    tilt: orbit.mesh.rotation.y
                };
            },
            
            update: (delta) => {
                // Update electron position in orbit
                if (!animation.isJumping) {
                    const params = animation.orbitParams;
                    params.angle += delta * params.speed;
                    
                    // Calculate position on tilted orbit
                    const x = params.radius * Math.cos(params.angle);
                    const z = params.radius * Math.sin(params.angle);
                    
                    // Apply tilt
                    const tiltedX = x;
                    const tiltedZ = z * Math.cos(params.tilt);
                    const tiltedY = z * Math.sin(params.tilt);
                    
                    animation.electron.position.set(tiltedX, tiltedY, tiltedZ);
                }
                
                // Update electron glow
                const glow = 0.5 + 0.2 * Math.sin(this.clock.elapsedTime * 5);
                animation.electron.material.emissiveIntensity = glow;
                
                // Update nucleus glow
                const nucleusGlow = 0.3 + 0.1 * Math.sin(this.clock.elapsedTime * 2);
                animation.nucleus.material.emissiveIntensity = nucleusGlow;
                
                // Update electron trail
                if (animation.trail) {
                    const trail = animation.trail;
                    
                    // Add current position to the beginning
                    trail.points.unshift(animation.electron.position.clone());
                    
                    // Remove oldest position if too long
                    if (trail.points.length > trail.maxLength) {
                        trail.points.pop();
                    }
                    
                    // Update trail geometry
                    const positions = new Float32Array(trail.points.length * 3);
                    
                    for (let i = 0; i < trail.points.length; i++) {
                        const index = i * 3;
                        positions[index] = trail.points[i].x;
                        positions[index + 1] = trail.points[i].y;
                        positions[index + 2] = trail.points[i].z;
                    }
                    
                    trail.line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    trail.line.geometry.attributes.position.needsUpdate = true;
                    
                    // Fade trail based on length
                    for (let i = 0; i < trail.points.length; i++) {
                        const opacity = 1 - (i / trail.points.length);
                        // Could implement per-vertex opacity if needed
                    }
                }
                
                // Fade in text if excited
                if (animation.isExcited && animation.textSprite.material.opacity < 1) {
                    animation.textSprite.material.opacity += delta * 0.5;
                }
                
                // Rotate orbits slightly
                animation.orbits.forEach(orbit => {
                    orbit.mesh.rotation.z += delta * 0.1;
                });
            },
            
            triggerInteraction: () => {
                if (animation.isJumping) return; // Prevent multiple jumps at once
                
                animation.isJumping = true;
                
                // Determine if we're exciting or de-exciting
                let targetOrbit;
                if (animation.isExcited) {
                    // De-excite: go to lower orbit
                    targetOrbit = 0;
                    animation.isExcited = false;
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                } else {
                    // Excite: go to higher orbit
                    targetOrbit = animation.orbits.length - 1;
                    animation.isExcited = true;
                }
                
                // Create photon effect
                if (targetOrbit > animation.currentOrbit) {
                    // Absorption (external photon)
                    this.createPhoton(
                        new THREE.Vector3(-5, 0, 0), 
                        animation.electron.position.clone(), 
                        0xffd60a
                    );
                } else {
                    // Emission (electron emits photon)
                    this.createPhoton(
                        animation.electron.position.clone(), 
                        new THREE.Vector3(5, 0, 0), 
                        0xf72585
                    );
                }
                
                // Animate jump
                const startPosition = animation.electron.position.clone();
                const endOrbit = animation.orbits[targetOrbit];
                
                // Calculate end position on target orbit
                const endAngle = Math.random() * Math.PI * 2;
                const endRadius = endOrbit.radius;
                const endTilt = endOrbit.mesh.rotation.y;
                
                const endX = endRadius * Math.cos(endAngle);
                const endZ = endRadius * Math.sin(endAngle);
                
                // Apply tilt
                const endTiltedX = endX;
                const endTiltedZ = endZ * Math.cos(endTilt);
                const endTiltedY = endZ * Math.sin(endTilt);
                
                const endPosition = new THREE.Vector3(endTiltedX, endTiltedY, endTiltedZ);
                
                // Create flash at electron
                const flashGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const flashMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 1
                });
                
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                flash.position.copy(startPosition);
                this.scene.add(flash);
                
                // Animate flash
                const animateFlash = () => {
                    flash.scale.multiplyScalar(1.1);
                    flash.material.opacity -= 0.05;
                    
                    if (flash.material.opacity > 0) {
                        requestAnimationFrame(animateFlash);
                    } else {
                        this.scene.remove(flash);
                    }
                };
                
                animateFlash();
                
                // Perform jump with arc
                let progress = 0;
                const jumpDuration = 0.5; // seconds
                const startTime = this.clock.elapsedTime;
                
                const jumpInterval = setInterval(() => {
                    const currentTime = this.clock.elapsedTime;
                    progress = (currentTime - startTime) / jumpDuration;
                    
                    if (progress >= 1) {
                        clearInterval(jumpInterval);
                        progress = 1;
                        animation.currentOrbit = targetOrbit;
                        animation.positionElectronInOrbit(targetOrbit);
                        
                        // Create arrival flash
                        const arrivalFlash = new THREE.Mesh(flashGeometry.clone(), flashMaterial.clone());
                        arrivalFlash.position.copy(endPosition);
                        this.scene.add(arrivalFlash);
                        
                        const animateArrivalFlash = () => {
                            arrivalFlash.scale.multiplyScalar(1.1);
                            arrivalFlash.material.opacity -= 0.05;
                            
                            if (arrivalFlash.material.opacity > 0) {
                                requestAnimationFrame(animateArrivalFlash);
                            } else {
                                this.scene.remove(arrivalFlash);
                            }
                        };
                        
                        animateArrivalFlash();
                        
                        // Update button text
                        const button = document.querySelector('[data-action="primary-action"]');
                        if (button) {
                            button.textContent = animation.isExcited ? "De-excite" : "Excite";
                        }
                        
                        return;
                    }
                    
                    // Use smooth step function
                    const smoothProgress = progress * progress * (3 - 2 * progress);
                    
                    // Interpolate position with arc
                    const arcHeight = 0.5;
                    const arcOffset = Math.sin(smoothProgress * Math.PI) * arcHeight;
                    
                    animation.electron.position.x = startPosition.x + (endPosition.x - startPosition.x) * smoothProgress;
                    animation.electron.position.y = startPosition.y + (endPosition.y - startPosition.y) * smoothProgress + arcOffset;
                    animation.electron.position.z = startPosition.z + (endPosition.z - startPosition.z) * smoothProgress;
                    
                }, 16); // roughly 60fps
            },
            
            createPhoton: (startPosition, endPosition, color) => {
                const photonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                const photonMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.8
                });
                
                const photon = new THREE.Mesh(photonGeometry, photonMaterial);
                photon.position.copy(startPosition);
                this.scene.add(photon);
                
                // Create photon trail
                const trailGeometry = new THREE.BufferGeometry();
                const trailMaterial = new THREE.LineBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.5
                });
                
                const trail = new THREE.Line(trailGeometry, trailMaterial);
                this.scene.add(trail);
                
                const trailPoints = [startPosition.clone()];
                
                // Animate photon movement
                const photonSpeed = 0.1;
                const direction = new THREE.Vector3().subVectors(endPosition, startPosition).normalize();
                
                const animatePhoton = () => {
                    photon.position.add(direction.clone().multiplyScalar(photonSpeed));
                    photon.rotation.x += 0.1;
                    photon.rotation.y += 0.1;
                    
                    // Add current position to trail
                    trailPoints.push(photon.position.clone());
                    
                    // Limit trail length
                    if (trailPoints.length > 20) {
                        trailPoints.shift();
                    }
                    
                    // Update trail geometry
                    const positions = new Float32Array(trailPoints.length * 3);
                    
                    for (let i = 0; i < trailPoints.length; i++) {
                        const index = i * 3;
                        positions[index] = trailPoints[i].x;
                        positions[index + 1] = trailPoints[i].y;
                        positions[index + 2] = trailPoints[i].z;
                    }
                    
                    trail.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    trail.geometry.attributes.position.needsUpdate = true;
                    
                    // Check if photon has reached destination
                    const distanceToEnd = photon.position.distanceTo(endPosition);
                    
                    if (distanceToEnd < photonSpeed) {
                        this.scene.remove(photon);
                        this.scene.remove(trail);
                    } else {
                        requestAnimationFrame(animatePhoton);
                    }
                };
                
                animatePhoton();
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse6Animation() {
        const animation = {
            energyEnabled: false,
            particles: [],
            
            initialize: () => {
                // Create vacuum chamber
                const chamberGeometry = new THREE.BoxGeometry(6, 4, 4);
                const chamberMaterial = new THREE.MeshPhongMaterial({
                    color: 0x3a0ca3,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
                animation.chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
                this.scene.add(animation.chamber);
                
                // Create energy source/controller
                const energySourceGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
                const energySourceMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf72585,
                    emissive: 0xf72585,
                    emissiveIntensity: 0.2
                });
                
                animation.energySource = new THREE.Mesh(energySourceGeometry, energySourceMaterial);
                animation.energySource.position.set(-4, 0, 0);
                animation.energySource.rotation.x = Math.PI / 2;
                this.scene.add(animation.energySource);
                
                // Add energy beam (initially invisible)
                const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 16);
                const beamMaterial = new THREE.MeshBasicMaterial({
                    color: 0xf72585,
                    transparent: true,
                    opacity: 0
                });
                
                animation.beam = new THREE.Mesh(beamGeometry, beamMaterial);
                animation.beam.position.set(-1, 0, 0);
                animation.beam.rotation.z = Math.PI / 2;
                this.scene.add(animation.beam);
                
                // Label energy source
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 64;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 16px Arial';
                context.fillText("Energy Source", 10, 30);
                
                const texture = new THREE.CanvasTexture(canvas);
                const material = new THREE.SpriteMaterial({ map: texture });
                
                const sprite = new THREE.Sprite(material);
                sprite.position.set(-4, -1, 0);
                sprite.scale.set(1, 0.5, 1);
                this.scene.add(sprite);
                
                // Add text sprite
                const textCanvas = document.createElement('canvas');
                textCanvas.width = 512;
                textCanvas.height = 128;
                const textContext = textCanvas.getContext('2d');
                textContext.fillStyle = '#ffffff';
                textContext.font = 'Bold 32px Arial';
                textContext.fillText("Fruits need ongoing conditions", 40, 70);
                
                const textTexture = new THREE.CanvasTexture(textCanvas);
                const textMaterial = new THREE.SpriteMaterial({ 
                    map: textTexture,
                    transparent: true,
                    opacity: 0
                });
                
                const textSprite = new THREE.Sprite(textMaterial);
                textSprite.position.set(0, -3, 0);
                textSprite.scale.set(4, 1, 1);
                this.scene.add(textSprite);
                animation.textSprite = textSprite;
                
                // Create initial fluctuating particles
                animation.createParticles();
            },
            
            createParticles: () => {
                // Clear existing particles
                animation.particles.forEach(p => this.scene.remove(p));
                animation.particles = [];
                
                const isEnergized = animation.energyEnabled;
                
                // Create fluctuating particles
                const fluctuationCount = isEnergized ? 30 : 15;
                
                for (let i = 0; i < fluctuationCount; i++) {
                    createFluctuatingParticle( // Pass this.scene to the helper function
                        this.scene,
                        Math.random() * 0.05 + 0.03,
                        isEnergized ? 0.5 : 0.3,
                        isEnergized ? 0x4cc9f0 : 0x7209b7
                    );
                }
                
                // Add stable particles if energy is on
                if (isEnergized) {
                    const stableCount = 8;
                    const colors = [0xf72585, 0x7209b7, 0xffd60a];
                    
                    for (let i = 0; i < stableCount; i++) {
                        const size = 0.15 + Math.random() * 0.1;
                        const geometry = new THREE.SphereGeometry(size, 16, 16);
                        const material = new THREE.MeshPhongMaterial({
                            color: colors[i % colors.length],
                            emissive: colors[i % colors.length],
                            emissiveIntensity: 0.3
                        });
                        
                        const particle = new THREE.Mesh(geometry, material);
                        particle.position.set(
                            (Math.random() - 0.5) * 4,
                            (Math.random() - 0.5) * 2,
                            (Math.random() - 0.5) * 2
                        );
                        
                        // Add orbital motion
                        particle.userData = {
                            orbitCenter: new THREE.Vector3(
                                (Math.random() - 0.5) * 2,
                                (Math.random() - 0.5) * 1,
                                (Math.random() - 0.5) * 1
                            ),
                            orbitRadius: 0.5 + Math.random() * 0.5,
                            orbitSpeed: 0.5 + Math.random() * 0.5,
                            orbitPhase: Math.random() * Math.PI * 2,
                            isStable: true
                        };
                        
                        this.scene.add(particle);
                        animation.particles.push(particle);
                    }
                    
                    // Show text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += 0.05;
                    }
                } else {
                    // Hide text
                    if (animation.textSprite.material.opacity > 0) {
                        animation.textSprite.material.opacity -= 0.05;
                    }
                }
                
                function createFluctuatingParticle(scene, size, opacity, color) { // Accept scene as argument
                    const geometry = new THREE.SphereGeometry(size, 8, 8);
                    const material = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: opacity
                    });
                    
                    const particle = new THREE.Mesh(geometry, material);
                    particle.position.set(
                        (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * 3,
                        (Math.random() - 0.5) * 3
                    );
                    
                    // Add random motion
                    particle.userData = {
                        velocity: new THREE.Vector3(
                            (Math.random() - 0.5) * 0.01,
                            (Math.random() - 0.5) * 0.01,
                            (Math.random() - 0.5) * 0.01
                        ),
                        lifespan: 1 + Math.random() * 2,
                        age: 0,
                        isStable: false
                    };
                    
                    scene.add(particle); // Use the passed scene argument
                    animation.particles.push(particle);
                    
                    return particle;
                }
            },
            
            update: (delta) => {
                // Update particles
                animation.particles.forEach((particle, index) => {
                    if (!particle.userData.isStable) {
                        // Update fluctuating particle
                        particle.position.add(particle.userData.velocity);
                        
                        // Bounce off chamber walls
                        const limit = {
                            x: animation.chamber.geometry.parameters.width / 2 - 0.1,
                            y: animation.chamber.geometry.parameters.height / 2 - 0.1,
                            z: animation.chamber.geometry.parameters.depth / 2 - 0.1
                        };
                        
                        if (Math.abs(particle.position.x) > limit.x) {
                            particle.userData.velocity.x *= -1;
                            particle.position.x = Math.sign(particle.position.x) * limit.x;
                        }
                        if (Math.abs(particle.position.y) > limit.y) {
                            particle.userData.velocity.y *= -1;
                            particle.position.y = Math.sign(particle.position.y) * limit.y;
                        }
                        if (Math.abs(particle.position.z) > limit.z) {
                            particle.userData.velocity.z *= -1;
                            particle.position.z = Math.sign(particle.position.z) * limit.z;
                        }
                        
                        // Update age and check if particle should be replaced
                        particle.userData.age += delta;
                        if (particle.userData.age > particle.userData.lifespan) {
                            // Replace with a new particle at a random position
                            particle.position.set(
                                (Math.random() - 0.5) * 5,
                                (Math.random() - 0.5) * 3,
                                (Math.random() - 0.5) * 3
                            );
                            particle.userData.age = 0;
                            particle.userData.lifespan = 1 + Math.random() * 2;
                            
                            // Randomize velocity
                            particle.userData.velocity.set(
                                (Math.random() - 0.5) * 0.01,
                                (Math.random() - 0.5) * 0.01,
                                (Math.random() - 0.5) * 0.01
                            );
                        }
                    } else {
                        // Update stable particle
                        const orbit = particle.userData;
                        const time = this.clock.elapsedTime;
                        
                        // Orbital motion
                        particle.position.x = orbit.orbitCenter.x + 
                            Math.cos(time * orbit.orbitSpeed + orbit.orbitPhase) * orbit.orbitRadius;
                        particle.position.y = orbit.orbitCenter.y + 
                            Math.sin(time * orbit.orbitSpeed + orbit.orbitPhase) * orbit.orbitRadius;
                        
                        // Rotation
                        particle.rotation.x += 0.01;
                        particle.rotation.y += 0.01;
                    }
                });
                
                // Update energy source glow based on state
                const time = this.clock.elapsedTime;
                
                if (animation.energyEnabled) {
                    animation.energySource.material.emissiveIntensity = 0.5 + 0.3 * Math.sin(time * 5);
                    animation.beam.material.opacity = 0.3 + 0.2 * Math.sin(time * 5);
                    
                    // Add occasional new particles at beam end
                    if (Math.random() < 0.1) {
                        const geometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.05, 8, 8);
                        const material = new THREE.MeshBasicMaterial({
                            color: 0xf72585,
                            transparent: true,
                            opacity: 0.7
                        });
                        
                        const particle = new THREE.Mesh(geometry, material);
                        particle.position.set(
                            3 + (Math.random() - 0.5) * 2,
                            (Math.random() - 0.5) * 1,
                            (Math.random() - 0.5) * 1
                        );
                        
                        // Add motion
                        particle.userData = {
                            velocity: new THREE.Vector3(
                                (Math.random() - 0.5) * 0.02,
                                (Math.random() - 0.5) * 0.02,
                                (Math.random() - 0.5) * 0.02
                            ),
                            lifespan: 1 + Math.random(),
                            age: 0,
                            isStable: false
                        };
                        
                        this.scene.add(particle);
                        animation.particles.push(particle);
                    }
                    
                    // Glow the chamber slightly
                    animation.chamber.material.emissive = new THREE.Color(0xf72585);
                    animation.chamber.material.emissiveIntensity = 0.05 + 0.05 * Math.sin(time * 2);
                    
                    // Show text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                } else {
                    animation.energySource.material.emissiveIntensity = 0.2;
                    animation.beam.material.opacity = 0;
                    
                    // No chamber glow
                    animation.chamber.material.emissiveIntensity = 0;
                    
                    // Hide text
                    if (animation.textSprite.material.opacity > 0) {
                        animation.textSprite.material.opacity -= delta * 0.5;
                    }
                }
            },
            
            triggerInteraction: () => {
                // Toggle energy state
                animation.energyEnabled = !animation.energyEnabled;
                
                if (animation.energyEnabled) {
                    // Create energy pulse
                    const pulseGeometry = new THREE.SphereGeometry(0.6, 32, 32);
                    const pulseMaterial = new THREE.MeshBasicMaterial({
                        color: 0xf72585,
                        transparent: true,
                        opacity: 1
                    });
                    
                    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
                    pulse.position.copy(animation.energySource.position);
                    this.scene.add(pulse);
                    
                    // Animate pulse
                    const animatePulse = () => {
                        pulse.scale.multiplyScalar(1.1);
                        pulse.material.opacity -= 0.03;
                        
                        if (pulse.material.opacity > 0) {
                            requestAnimationFrame(animatePulse);
                        } else {
                            this.scene.remove(pulse);
                        }
                    };
                    
                    animatePulse();
                } else {
                    // Show particles disappearing
                    animation.particles.forEach(particle => {
                        if (particle.userData.isStable) {
                            // Animate stable particles fading out
                            const animateFadeOut = () => {
                                particle.scale.multiplyScalar(0.95);
                                particle.material.opacity -= 0.05;
                                
                                if (particle.material.opacity > 0) {
                                    requestAnimationFrame(animateFadeOut);
                                } else {
                                    this.scene.remove(particle);
                                    const index = animation.particles.indexOf(particle);
                                    if (index !== -1) {
                                        animation.particles.splice(index, 1);
                                    }
                                }
                            };
                            
                            // Make material transparent for fade out
                            particle.material.transparent = true;
                            animateFadeOut();
                        }
                    });
                }
                
                // Update particles after a short delay (for visual effect)
                setTimeout(() => {
                    animation.createParticles();
                }, 500);
                
                // Update button text
                const button = document.querySelector('[data-action="primary-action"]');
                if (button) {
                    button.textContent = animation.energyEnabled ? "Remove Energy" : "Add Energy";
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse7Animation() {
        const animation = {
            entangledParticles: [],
            isEntangled: false,
            
            initialize: () => {
                // Create two quantum particles
                const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
                const particleMaterial1 = new THREE.MeshPhongMaterial({
                    color: 0x4cc9f0,
                    emissive: 0x4cc9f0,
                    emissiveIntensity: 0.3
                });
                const particleMaterial2 = new THREE.MeshPhongMaterial({
                    color: 0xf72585,
                    emissive: 0xf72585,
                    emissiveIntensity: 0.3
                });
                
                const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
                const particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);
                
                particle1.position.set(-2, 0, 0);
                particle2.position.set(2, 0, 0);
                
                this.scene.add(particle1);
                this.scene.add(particle2);
                
                animation.entangledParticles = [particle1, particle2];
                
                // Create connecting line (entanglement visualization)
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-2, 0, 0),
                    new THREE.Vector3(2, 0, 0)
                ]);
                const lineMaterial = new THREE.LineBasicMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.scene.add(line);
                animation.entanglementLine = line;
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Cause and effect aren't simultaneous", 10, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
                
                // Add measurement devices
                const deviceGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
                const deviceMaterial = new THREE.MeshPhongMaterial({ color: 0x7209b7 });
                
                const device1 = new THREE.Mesh(deviceGeometry, deviceMaterial);
                const device2 = new THREE.Mesh(deviceGeometry, deviceMaterial);
                
                device1.position.set(-3.5, 0, 0);
                device2.position.set(3.5, 0, 0);
                
                this.scene.add(device1);
                this.scene.add(device2);
                
                animation.devices = [device1, device2];
            },
            
            update: (delta) => {
                if (!animation.isEntangled) {
                    // Particles rotate around their own axes
                    animation.entangledParticles.forEach(particle => {
                        particle.rotation.y += 0.01;
                        particle.rotation.x += 0.005;
                    });
                } else {
                    // Synchronized rotation when entangled
                    const rotationY = animation.entangledParticles[0].rotation.y + 0.01;
                    const rotationX = animation.entangledParticles[0].rotation.x + 0.005;
                    
                    animation.entangledParticles.forEach(particle => {
                        particle.rotation.y = rotationY;
                        particle.rotation.x = rotationX;
                    });
                    
                    // Pulse the connection line
                    const pulse = (Math.sin(this.clock.elapsedTime * 3) + 1) / 2;
                    animation.entanglementLine.material.opacity = 0.3 + 0.7 * pulse;
                    
                    // Update line's position (in case particles move)
                    const positions = animation.entanglementLine.geometry.attributes.position;
                    positions.setXYZ(0, animation.entangledParticles[0].position.x, 
                                    animation.entangledParticles[0].position.y, 
                                    animation.entangledParticles[0].position.z);
                    positions.setXYZ(1, animation.entangledParticles[1].position.x, 
                                    animation.entangledParticles[1].position.y, 
                                    animation.entangledParticles[1].position.z);
                    positions.needsUpdate = true;
                    
                    // Fade in text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                }
            },
            
            triggerInteraction: () => {
                animation.isEntangled = !animation.isEntangled;
                
                if (animation.isEntangled) {
                    // Create entanglement effect
                    const flashGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                    const flashMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 1
                    });
                    
                    // Flash at both particles
                    const flash1 = new THREE.Mesh(flashGeometry, flashMaterial);
                    const flash2 = new THREE.Mesh(flashGeometry, flashMaterial);
                    
                    flash1.position.copy(animation.entangledParticles[0].position);
                    flash2.position.copy(animation.entangledParticles[1].position);
                    
                    this.scene.add(flash1);
                    this.scene.add(flash2);
                    
                    // Animate flashes
                    const animateFlash = () => {
                        flash1.scale.multiplyScalar(1.1);
                        flash2.scale.multiplyScalar(1.1);
                        
                        flash1.material.opacity -= 0.05;
                        flash2.material.opacity -= 0.05;
                        
                        if (flash1.material.opacity > 0) {
                            requestAnimationFrame(animateFlash);
                        } else {
                            this.scene.remove(flash1);
                            this.scene.remove(flash2);
                        }
                    };
                    
                    animateFlash();
                    
                    // Show entanglement line
                    animation.entanglementLine.material.opacity = 1;
                    
                    // Update button text
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Disentangle";
                    }
                } else {
                    // Hide entanglement line
                    animation.entanglementLine.material.opacity = 0;
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                    
                    // Update button text
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Entangle";
                    }
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse8Animation() {
        const animation = {
            timeline: null,
            marker: null,
            particles: [],
            timeState: 0, // 0: before, 1: during, 2: after
            
            initialize: () => {
                // Create timeline
                const timelineGeometry = new THREE.BoxGeometry(10, 0.1, 0.1);
                const timelineMaterial = new THREE.MeshBasicMaterial({ color: 0x4cc9f0 });
                animation.timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
                this.scene.add(animation.timeline);
                
                // Add time markers (pass scene)
                const pastMarker = createTimeMarker(this.scene, "Past", -3);
                const presentMarker = createTimeMarker(this.scene, "Present", 0);
                const futureMarker = createTimeMarker(this.scene, "Future", 3);
                
                // Create time position marker
                const markerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                // Use MeshPhongMaterial to support emissive properties
                const markerMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf72585,
                    emissive: 0xf72585,
                    emissiveIntensity: 0.5
                });
                animation.marker = new THREE.Mesh(markerGeometry, markerMaterial);
                animation.marker.position.set(-3, 0, 0); // Start in "past"
                this.scene.add(animation.marker);
                
                // Create "cause" and "effect" zones (pass scene)
                createZone(this.scene, "Conditions/Cause", -2, 0x7209b7);
                createZone(this.scene, "Effect/Fruit", 2, 0xffd100);
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Fruit needs prior causes", 70, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
                
                // Create particles (initially none)
                animation.updateParticles();
                
                // Move camera back
                this.camera.position.z = 8;
                
                // Helper function to create time markers
                function createTimeMarker(scene, text, position) { // Accept scene argument
                    const canvas = document.createElement('canvas');
                    canvas.width = 128;
                    canvas.height = 64;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#ffffff';
                    context.font = 'Bold 20px Arial';
                    context.fillText(text, 10, 30);
                    
                    const texture = new THREE.CanvasTexture(canvas);
                    const material = new THREE.SpriteMaterial({ map: texture });
                    
                    const sprite = new THREE.Sprite(material);
                    sprite.position.set(position, -0.5, 0);
                    sprite.scale.set(1, 0.5, 1);
                    scene.add(sprite); // Use passed scene argument
                    
                    // Add a vertical line
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(position, -0.2, 0),
                        new THREE.Vector3(position, 0.2, 0)
                    ]);
                    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    scene.add(line); // Use passed scene argument
                    
                    return sprite;
                }
                
                // Helper function to create zones
                function createZone(scene, text, position, color) { // Accept scene argument
                    const zoneGeometry = new THREE.BoxGeometry(2, 1, 0.5);
                    // Use MeshPhongMaterial as a test to avoid MeshBasicMaterial emissive error
                    const zoneMaterial = new THREE.MeshPhongMaterial({
                        color: color,
                        transparent: true,
                        opacity: 0.3
                    });
                    const zone = new THREE.Mesh(zoneGeometry, zoneMaterial);
                    zone.position.set(position, 1, 0);
                    scene.add(zone); // Use passed scene argument
                    
                    // Add label
                    const canvas = document.createElement('canvas');
                    canvas.width = 256;
                    canvas.height = 64;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#ffffff';
                    context.font = 'Bold 20px Arial';
                    context.fillText(text, 10, 30);
                    
                    const texture = new THREE.CanvasTexture(canvas);
                    const material = new THREE.SpriteMaterial({ map: texture });
                    
                    const sprite = new THREE.Sprite(material);
                    sprite.position.set(position, 1.8, 0);
                    sprite.scale.set(2, 0.5, 1);
                    scene.add(sprite); // Use passed scene argument
                    
                    return zone;
                }
            },
            
            updateParticles: () => {
                // Clear existing particles
                animation.particles.forEach(p => this.scene.remove(p));
                animation.particles = [];
                
                if (animation.timeState === 0) {
                    // Before causes - no particles
                    return;
                }
                
                // Create particles in the cause zone
                const causeParticleCount = 10;
                for (let i = 0; i < causeParticleCount; i++) {
                    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x7209b7,
                        emissive: 0x7209b7,
                        emissiveIntensity: 0.3
                    });
                    
                    const particle = new THREE.Mesh(geometry, material);
                    particle.position.set(
                        -2 + Math.random() * 2 - 1,
                        1 + Math.random() * 0.8 - 0.4,
                        Math.random() * 0.4 - 0.2
                    );
                    
                    // Add motion
                    particle.userData.speed = {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    };
                    
                    this.scene.add(particle);
                    animation.particles.push(particle);
                    
                    // Add motion
                    particle.userData = {
                        speed: {
                            x: (Math.random() - 0.5) * 0.02,
                            y: (Math.random() - 0.5) * 0.02,
                            z: (Math.random() - 0.5) * 0.02
                        }
                    };
                }
                
                // Create particles in effect zone if in "after" state
                if (animation.timeState === 2) {
                    const effectParticleCount = 5;
                    for (let i = 0; i < effectParticleCount; i++) {
                        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
                        const material = new THREE.MeshPhongMaterial({
                            color: 0xffd100,
                            emissive: 0xffd100,
                            emissiveIntensity: 0.3
                        });
                        
                        const particle = new THREE.Mesh(geometry, material);
                        particle.position.set(
                            2 + Math.random() * 2 - 1,
                            1 + Math.random() * 0.8 - 0.4,
                            Math.random() * 0.4 - 0.2
                        );
                        
                        // Start with zero scale and grow
                        particle.scale.set(0, 0, 0);
                        
                        this.scene.add(particle);
                        animation.particles.push(particle);
                        
                        // Add motion
                        particle.userData.speed = {
                            x: (Math.random() - 0.5) * 0.01,
                            y: (Math.random() - 0.5) * 0.01,
                            z: (Math.random() - 0.5) * 0.01
                        };
                        
                        // Animate growth
                        const animateGrowth = () => {
                            particle.scale.x += 0.05;
                            particle.scale.y += 0.05;
                            particle.scale.z += 0.05;
                            
                            if (particle.scale.x < 1) {
                                requestAnimationFrame(animateGrowth);
                            }
                        };
                        
                        setTimeout(() => animateGrowth(), i * 200);
                    }
                }
            },
            
            update: (delta) => {
                // Move particles slightly with Brownian motion
                animation.particles.forEach(particle => {
                    if (particle.userData.speed) {
                        particle.position.x += particle.userData.speed.x;
                        particle.position.y += particle.userData.speed.y;
                        particle.position.z += particle.userData.speed.z;
                        
                        // Contain particles within their zones
                        const isCauseParticle = particle.position.x < 0;
                        const centerX = isCauseParticle ? -2 : 2;
                        const bounds = 1;
                        
                        if (Math.abs(particle.position.x - centerX) > bounds) {
                            particle.userData.speed.x *= -1;
                        }
                        
                        if (Math.abs(particle.position.y - 1) > 0.4) {
                            particle.userData.speed.y *= -1;
                        }
                        
                        if (Math.abs(particle.position.z) > 0.2) {
                            particle.userData.speed.z *= -1;
                        }
                    }
                });
                
                // Fade in text if we're showing the effect
                if (animation.timeState === 2 && animation.textSprite.material.opacity < 1) {
                    animation.textSprite.material.opacity += delta * 0.5;
                }
            },
            
            triggerInteraction: () => {
                // Advance time state
                animation.timeState = (animation.timeState + 1) % 3;
                
                // Update marker position
                const positions = [-3, 0, 3]; // past, present, future
                const targetPosition = positions[animation.timeState];
                
                // Animate marker movement
                const currentPosition = animation.marker.position.x;
                const animateMarker = () => {
                    const step = (targetPosition - currentPosition) / 20;
                    animation.marker.position.x += step;
                    
                    if ((step > 0 && animation.marker.position.x < targetPosition) ||
                        (step < 0 && animation.marker.position.x > targetPosition)) {
                        requestAnimationFrame(animateMarker);
                    } else {
                        animation.marker.position.x = targetPosition;
                        // Update particles after marker reaches position
                        animation.updateParticles();
                    }
                };
                
                animateMarker();
                
                // Update button text
                const button = document.querySelector('[data-action="primary-action"]');
                if (button) {
                    const labels = ["View Present", "View Future", "Reset to Past"];
                    button.textContent = labels[animation.timeState];
                }
                
                // Hide text when resetting
                if (animation.timeState === 0) {
                    animation.textSprite.material.opacity = 0;
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse9Animation() {
        const animation = {
            initialParticle: null,
            decayProducts: [],
            hasDecayed: false,
            
            initialize: () => {
                // Create unstable particle
                const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: 0x7209b7,
                    emissive: 0x7209b7,
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 1
                });
                
                animation.initialParticle = new THREE.Mesh(particleGeometry, particleMaterial);
                this.scene.add(animation.initialParticle);
                
                // Add glow effect
                const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: 0x7209b7,
                    transparent: true,
                    opacity: 0.3
                });
                animation.glow = new THREE.Mesh(glowGeometry, glowMaterial);
                this.scene.add(animation.glow);
                
                // Add decay lines (initially invisible)
                const lines = [];
                const lineCount = 8;
                for (let i = 0; i < lineCount; i++) {
                    const angle = (i / lineCount) * Math.PI * 2;
                    const endPoint = new THREE.Vector3(
                        Math.cos(angle) * 3,
                        Math.sin(angle) * 3,
                        0
                    );
                    
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(0, 0, 0),
                        endPoint
                    ]);
                    
                    const lineMaterial = new THREE.LineBasicMaterial({ 
                        color: 0xf72585,
                        transparent: true,
                        opacity: 0
                    });
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    this.scene.add(line);
                    lines.push(line);
                }
                animation.decayLines = lines;
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Cause doesn't persist and re-emerge", 10, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
            },
            
            update: (delta) => {
                if (!animation.hasDecayed) {
                    // Pulse the unstable particle
                    const pulseScale = 1 + Math.sin(this.clock.elapsedTime * 2) * 0.05;
                    animation.initialParticle.scale.set(pulseScale, pulseScale, pulseScale);
                    animation.glow.scale.set(pulseScale, pulseScale, pulseScale);
                    
                    // Random "almost decay" flashes
                    if (Math.random() < 0.02) {
                        const flashGeometry = new THREE.SphereGeometry(1.5, 32, 32);
                        const flashMaterial = new THREE.MeshBasicMaterial({
                            color: 0xff0000,
                            transparent: true,
                            opacity: 0.3
                        });
                        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                        this.scene.add(flash);
                        
                        // Animate flash
                        const animateFlash = () => {
                            flash.scale.multiplyScalar(1.1);
                            flash.material.opacity -= 0.05;
                            
                            if (flash.material.opacity > 0) {
                                requestAnimationFrame(animateFlash);
                            } else {
                                this.scene.remove(flash);
                            }
                        };
                        
                        animateFlash();
                    }
                } else {
                    // Update decay products
                    animation.decayProducts.forEach(product => {
                        product.rotation.x += product.userData.rotationSpeed.x;
                        product.rotation.y += product.userData.rotationSpeed.y;
                        product.rotation.z += product.userData.rotationSpeed.z;
                    });
                    
                    // Fade in text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                }
            },
            
            triggerInteraction: () => {
                if (animation.hasDecayed) {
                    // Reset animation
                    animation.hasDecayed = false;
                    
                    // Fade out decay lines
                    animation.decayLines.forEach(line => {
                        line.material.opacity = 0;
                    });
                    
                    // Remove decay products
                    animation.decayProducts.forEach(product => {
                        this.scene.remove(product);
                    });
                    animation.decayProducts = [];
                    
                    // Restore initial particle
                    animation.initialParticle.material.opacity = 1;
                    animation.glow.material.opacity = 0.3;
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                    
                    // Update button
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Decay";
                    }
                    
                    return;
                }
                
                // Trigger decay
                animation.hasDecayed = true;
                
                // Flash effect
                const flashGeometry = new THREE.SphereGeometry(1.5, 32, 32);
                const flashMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 1
                });
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                this.scene.add(flash);
                
                // Animate flash
                const animateFlash = () => {
                    flash.scale.multiplyScalar(1.2);
                    flash.material.opacity -= 0.1;
                    
                    if (flash.material.opacity > 0) {
                        requestAnimationFrame(animateFlash);
                    } else {
                        this.scene.remove(flash);
                    }
                };
                
                animateFlash();
                
                // Fade out initial particle
                const fadeOut = () => {
                    animation.initialParticle.material.opacity -= 0.1;
                    animation.glow.material.opacity -= 0.03;
                    
                    if (animation.initialParticle.material.opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    }
                };
                
                fadeOut();
                
                // Show decay lines
                animation.decayLines.forEach(line => {
                    line.material.opacity = 1;
                });
                
                // Create decay products
                const colors = [0xf72585, 0x4cc9f0, 0x4361ee, 0xffd100];
                const productCount = 3 + Math.floor(Math.random() * 3); // 3-5 decay products
                
                for (let i = 0; i < productCount; i++) {
                    const angle = (i / productCount) * Math.PI * 2;
                    const distance = 3 + Math.random() * 0.5;
                    
                    const geometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 16, 16);
                    const material = new THREE.MeshPhongMaterial({
                        color: colors[i % colors.length],
                        emissive: colors[i % colors.length],
                        emissiveIntensity: 0.3
                    });
                    
                    const product = new THREE.Mesh(geometry, material);
                    
                    // Set final position
                    product.position.set(
                        Math.cos(angle) * distance,
                        Math.sin(angle) * distance,
                        (Math.random() - 0.5) * 2
                    );
                    
                    // Add rotation
                    product.userData.rotationSpeed = {
                        x: (Math.random() - 0.5) * 0.05,
                        y: (Math.random() - 0.5) * 0.05,
                        z: (Math.random() - 0.5) * 0.05
                    };
                    
                    // Start with zero scale
                    product.scale.set(0, 0, 0);
                    
                    this.scene.add(product);
                    animation.decayProducts.push(product);
                    
                    // Animate appearance
                    const delay = i * 150;
                    setTimeout(() => {
                        const animateProduct = () => {
                            product.scale.x += 0.1;
                            product.scale.y += 0.1;
                            product.scale.z += 0.1;
                            
                            if (product.scale.x < 1) {
                                requestAnimationFrame(animateProduct);
                            }
                        };
                        
                        animateProduct();
                    }, delay);
                }
                
                // Update button
                const button = document.querySelector('[data-action="primary-action"]');
                if (button) {
                    button.textContent = "Reset";
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse10Animation() {
        const animation = {
            particles: [],
            hasScattered: false,
            
            initialize: () => {
                // Create two particles that will scatter
                const particleGeometry = new THREE.SphereGeometry(0.5, 24, 24);
                const particleMaterial1 = new THREE.MeshPhongMaterial({
                    color: 0xf72585,
                    emissive: 0xf72585,
                    emissiveIntensity: 0.3
                });
                const particleMaterial2 = new THREE.MeshPhongMaterial({
                    color: 0x4cc9f0,
                    emissive: 0x4cc9f0,
                    emissiveIntensity: 0.3
                });
                
                const particle1 = new THREE.Mesh(particleGeometry, particleMaterial1);
                const particle2 = new THREE.Mesh(particleGeometry, particleMaterial2);
                
                particle1.position.set(-3, 0, 0);
                particle2.position.set(3, 0, 0);
                
                this.scene.add(particle1);
                this.scene.add(particle2);
                
                animation.particles = [particle1, particle2];
                
                // Add velocity indicators (arrows)
                const dir1 = new THREE.Vector3(1, 0, 0);
                const dir2 = new THREE.Vector3(-1, 0, 0);
                const origin1 = new THREE.Vector3(-2, 0, 0);
                const origin2 = new THREE.Vector3(2, 0, 0);
                const length = 1;
                
                const arrowHelper1 = new THREE.ArrowHelper(dir1, origin1, length, 0xf72585);
                const arrowHelper2 = new THREE.ArrowHelper(dir2, origin2, length, 0x4cc9f0);
                
                this.scene.add(arrowHelper1);
                this.scene.add(arrowHelper2);
                
                animation.arrows = [arrowHelper1, arrowHelper2];
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Fruit needs active conditions", 50, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
            },
            
            update: (delta) => {
                if (!animation.hasScattered) {
                    // Move particles towards each other
                    animation.particles[0].position.x += delta * 0.5;
                    animation.particles[1].position.x -= delta * 0.5;
                    
                    // Update arrow positions
                    animation.arrows[0].position.x = animation.particles[0].position.x + 1;
                    animation.arrows[1].position.x = animation.particles[1].position.x - 1;
                    
                    // Check for collision
                    if (animation.particles[0].position.x >= -0.5 && animation.particles[1].position.x <= 0.5) {
                        this.triggerScattering();
                    }
                } else {
                    // Move scattered particles along their new trajectories
                    animation.scatteredParticles.forEach(particle => {
                        if (particle.userData.velocity) {
                            particle.position.x += particle.userData.velocity.x * delta;
                            particle.position.y += particle.userData.velocity.y * delta;
                            particle.position.z += particle.userData.velocity.z * delta;
                            
                            // Rotate particles
                            particle.rotation.x += 0.01;
                            particle.rotation.y += 0.01;
                        }
                    });
                    
                    // Fade in text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                }
            },
            
            triggerScattering: function() {
                if (animation.hasScattered) return;
                animation.hasScattered = true;
                
                // Hide original particles
                animation.particles.forEach(particle => {
                    particle.visible = false;
                });
                
                // Hide arrows
                animation.arrows.forEach(arrow => {
                    arrow.visible = false;
                });
                
                // Create collision flash
                const flashGeometry = new THREE.SphereGeometry(1, 32, 32);
                const flashMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 1
                });
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                this.scene.add(flash);
                
                // Animate flash
                const animateFlash = () => {
                    flash.scale.multiplyScalar(1.1);
                    flash.material.opacity -= 0.05;
                    
                    if (flash.material.opacity > 0) {
                        requestAnimationFrame(animateFlash);
                    } else {
                        this.scene.remove(flash);
                    }
                };
                
                animateFlash();
                
                // Create scattered particles
                const colors = [0xf72585, 0x4cc9f0, 0x7209b7, 0x3a0ca3, 0x4361ee, 0xffd100];
                const particleCount = 6 + Math.floor(Math.random() * 3);
                animation.scatteredParticles = [];
                
                for (let i = 0; i < particleCount; i++) {
                    const size = 0.2 + Math.random() * 0.3;
                    const geometry = new THREE.SphereGeometry(size, 16, 16);
                    const material = new THREE.MeshPhongMaterial({
                        color: colors[i % colors.length],
                        emissive: colors[i % colors.length],
                        emissiveIntensity: 0.3
                    });
                    
                    const particle = new THREE.Mesh(geometry, material);
                    particle.position.set(0, 0, 0);
                    
                    // Random velocity in all directions
                    const angle = Math.random() * Math.PI * 2;
                    const elevation = Math.random() * Math.PI - Math.PI/2;
                    const speed = 1 + Math.random();
                    
                    particle.userData.velocity = {
                        x: Math.cos(angle) * Math.cos(elevation) * speed,
                        y: Math.sin(elevation) * speed,
                        z: Math.sin(angle) * Math.cos(elevation) * speed
                    };
                    
                    this.scene.add(particle);
                    animation.scatteredParticles.push(particle);
                }
            },
            
            triggerInteraction: () => {
                if (animation.hasScattered) {
                    // Reset animation
                    animation.hasScattered = false;
                    
                    // Remove scattered particles
                    if (animation.scatteredParticles) {
                        animation.scatteredParticles.forEach(particle => {
                            this.scene.remove(particle);
                        });
                    }
                    
                    // Reset original particles
                    animation.particles.forEach((particle, i) => {
                        particle.visible = true;
                        particle.position.x = i === 0 ? -3 : 3;
                    });
                    
                    // Show arrows
                    animation.arrows.forEach(arrow => {
                        arrow.visible = true;
                    });
                    animation.arrows[0].position.x = -2;
                    animation.arrows[1].position.x = 2;
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                } else {
                    // Manually trigger scattering if not close enough
                    this.triggerScattering();
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse11Animation() {
        const animation = {
            particle: null,
            barrier: null,
            tunneled: false,
            
            initialize: () => {
                // Create quantum particle
                const particleGeometry = new THREE.SphereGeometry(0.3, 24, 24);
                const particleMaterial = new THREE.MeshPhongMaterial({
                    color: 0x4cc9f0,
                    emissive: 0x4cc9f0,
                    emissiveIntensity: 0.5
                });
                
                animation.particle = new THREE.Mesh(particleGeometry, particleMaterial);
                animation.particle.position.set(-3, 0, 0);
                this.scene.add(animation.particle);
                
                // Create energy barrier
                const barrierGeometry = new THREE.BoxGeometry(0.5, 2, 2);
                const barrierMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf72585,
                    transparent: true,
                    opacity: 0.7
                });
                
                animation.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
                this.scene.add(animation.barrier);
                
                // Add wavefront visualization
                const waveGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
                const waveMaterial = new THREE.MeshBasicMaterial({
                    color: 0x4cc9f0,
                    transparent: true,
                    opacity: 0.3
                });
                animation.waveRing = new THREE.Mesh(waveGeometry, waveMaterial);
                animation.waveRing.position.copy(animation.particle.position);
                animation.waveRing.rotation.x = Math.PI / 2;
                this.scene.add(animation.waveRing);
                
                // Create detector on other side
                const detectorGeometry = new THREE.BoxGeometry(0.6, 1, 1);
                const detectorMaterial = new THREE.MeshPhongMaterial({ color: 0x7209b7 });
                animation.detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
                animation.detector.position.set(3, 0, 0);
                this.scene.add(animation.detector);
                
                // Add visualization lines
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-5, -1.5, 0),
                    new THREE.Vector3(5, -1.5, 0)
                ]);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.scene.add(line);
                
                // Add labels
                const labels = [
                    {text: "Particle", position: new THREE.Vector3(-3, -2, 0)},
                    {text: "Barrier", position: new THREE.Vector3(0, -2, 0)},
                    {text: "Detector", position: new THREE.Vector3(3, -2, 0)}
                ];
                
                labels.forEach(label => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 128;
                    canvas.height = 32;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#ffffff';
                    context.font = 'Bold 16px Arial';
                    context.fillText(label.text, 10, 20);
                    
                    const texture = new THREE.CanvasTexture(canvas);
                    const material = new THREE.SpriteMaterial({ map: texture });
                    
                    const sprite = new THREE.Sprite(material);
                    sprite.position.copy(label.position);
                    sprite.scale.set(1, 0.25, 1);
                    this.scene.add(sprite);
                });
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Cause and fruit need relation", 50, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, -3.5, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
                
                // Move camera back for better view
                this.camera.position.z = 7;
            },
            
            update: (delta) => {
                if (!animation.tunneled) {
                    // Move particle slowly toward barrier
                    if (animation.particle.position.x < -0.5) {
                        animation.particle.position.x += delta * 0.5;
                        
                        // Move wave ring with particle
                        animation.waveRing.position.x = animation.particle.position.x;
                        
                        // Pulse wave ring
                        const scale = 1 + 0.2 * Math.sin(this.clock.elapsedTime * 5);
                        animation.waveRing.scale.set(scale, scale, scale);
                    } else {
                        // Particle reached barrier - show probability wave continuing
                        if (!animation.ghostParticle) {
                            // Create ghost particle (probability wave through barrier)
                            const ghostGeometry = new THREE.SphereGeometry(0.3, 24, 24);
                            const ghostMaterial = new THREE.MeshBasicMaterial({
                                color: 0x4cc9f0,
                                transparent: true,
                                opacity: 0.2
                            });
                            
                            animation.ghostParticle = new THREE.Mesh(ghostGeometry, ghostMaterial);
                            animation.ghostParticle.position.set(0.5, 0, 0);
                            this.scene.add(animation.ghostParticle);
                            
                            // Add ghost wave ring
                            const ghostWaveGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
                            const ghostWaveMaterial = new THREE.MeshBasicMaterial({
                                color: 0x4cc9f0,
                                transparent: true,
                                opacity: 0.1
                            });
                            animation.ghostWaveRing = new THREE.Mesh(ghostWaveGeometry, ghostWaveMaterial);
                            animation.ghostWaveRing.position.copy(animation.ghostParticle.position);
                            animation.ghostWaveRing.rotation.x = Math.PI / 2;
                            this.scene.add(animation.ghostWaveRing);
                        }
                        
                        // Move ghost particle 
                        if (animation.ghostParticle && animation.ghostParticle.position.x < 3) {
                            animation.ghostParticle.position.x += delta * 0.3;
                            animation.ghostWaveRing.position.x = animation.ghostParticle.position.x;
                            
                            // Pulse ghost wave ring
                            const scale = 1 + 0.2 * Math.sin(this.clock.elapsedTime * 5);
                            animation.ghostWaveRing.scale.set(scale, scale, scale);
                        }
                    }
                } else {
                    // Particle has tunneled - just pulse the detector
                    const pulseScale = 1 + 0.1 * Math.sin(this.clock.elapsedTime * 3);
                    animation.detector.scale.set(pulseScale, pulseScale, pulseScale);
                    
                    // Make the particle at detector pulse
                    if (animation.particleAtDetector) {
                        animation.particleAtDetector.scale.set(pulseScale, pulseScale, pulseScale);
                    }
                    
                    // Fade in text
                    if (animation.textSprite.material.opacity < 1) {
                        animation.textSprite.material.opacity += delta * 0.5;
                    }
                }
            },
            
            triggerInteraction: () => {
                if (animation.tunneled) {
                    // Reset animation
                    animation.tunneled = false;
                    
                    // Reset particle
                    animation.particle.position.set(-3, 0, 0);
                    animation.particle.visible = true;
                    
                    // Reset wave ring
                    animation.waveRing.position.copy(animation.particle.position);
                    animation.waveRing.visible = true;
                    
                    // Remove ghost if exists
                    if (animation.ghostParticle) {
                        this.scene.remove(animation.ghostParticle);
                        this.scene.remove(animation.ghostWaveRing);
                        animation.ghostParticle = null;
                        animation.ghostWaveRing = null;
                    }
                    
                    // Remove particle at detector
                    if (animation.particleAtDetector) {
                        this.scene.remove(animation.particleAtDetector);
                        animation.particleAtDetector = null;
                    }
                    
                    // Reset detector
                    animation.detector.scale.set(1, 1, 1);
                    animation.detector.material.emissive = new THREE.Color(0x000000);
                    
                    // Hide text
                    animation.textSprite.material.opacity = 0;
                    
                    // Update button
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Tunnel";
                    }
                } else {
                    // Perform tunneling
                    animation.tunneled = true;
                    
                    // Hide original particle
                    animation.particle.visible = false;
                    animation.waveRing.visible = false;
                    
                    // Show tunneling effect
                    const flashGeometry = new THREE.BoxGeometry(0.55, 2.1, 2.1);
                    const flashMaterial = new THREE.MeshBasicMaterial({
                        color: 0x4cc9f0,
                        transparent: true,
                        opacity: 0.7
                    });
                    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                    flash.position.copy(animation.barrier.position);
                    this.scene.add(flash);
                    
                    // Animate flash
                    const animateFlash = () => {
                        flash.material.opacity -= 0.05;
                        
                        if (flash.material.opacity > 0) {
                            requestAnimationFrame(animateFlash);
                        } else {
                            this.scene.remove(flash);
                        }
                    };
                    
                    animateFlash();
                    
                    // Create particle at detector with delay
                    setTimeout(() => {
                        // Create particle at detector
                        const particleGeometry = new THREE.SphereGeometry(0.3, 24, 24);
                        const particleMaterial = new THREE.MeshPhongMaterial({
                            color: 0x4cc9f0,
                            emissive: 0x4cc9f0,
                            emissiveIntensity: 0.5
                        });
                        
                        animation.particleAtDetector = new THREE.Mesh(particleGeometry, particleMaterial);
                        animation.particleAtDetector.position.set(3, 0, 0);
                        this.scene.add(animation.particleAtDetector);
                        
                        // Flash detector
                        animation.detector.material.emissive = new THREE.Color(0x7209b7);
                        animation.detector.material.emissiveIntensity = 0.5;
                        
                        // Fade emissive over time
                        const fadeEmissive = () => {
                            animation.detector.material.emissiveIntensity -= 0.01;
                            
                            if (animation.detector.material.emissiveIntensity > 0) {
                                requestAnimationFrame(fadeEmissive);
                            } else {
                                animation.detector.material.emissive = new THREE.Color(0x000000);
                            }
                        };
                        
                        setTimeout(fadeEmissive, 500);
                    }, 500);
                    
                    // Remove ghost if exists
                    if (animation.ghostParticle) {
                        this.scene.remove(animation.ghostParticle);
                        this.scene.remove(animation.ghostWaveRing);
                        animation.ghostParticle = null;
                        animation.ghostWaveRing = null;
                    }
                    
                    // Update button
                    const button = document.querySelector('[data-action="primary-action"]');
                    if (button) {
                        button.textContent = "Reset";
                    }
                }
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
    
    setupVerse12Animation() {
        const animation = {
            particles: [],
            timeline: null,
            timeState: "normal", // normal, paused, reversed
            
            initialize: () => {
                // Create timeline
                const timelineGeometry = new THREE.BoxGeometry(10, 0.1, 0.1);
                const timelineMaterial = new THREE.MeshBasicMaterial({ color: 0x4cc9f0 });
                animation.timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
                animation.timeline.position.set(0, -2, 0);
                this.scene.add(animation.timeline);
                
                // Add time markers (pass scene)
                const pastMarker = createTimeMarker(this.scene, "Past", -4, -2);
                const presentMarker = createTimeMarker(this.scene, "Present", 0, -2);
                const futureMarker = createTimeMarker(this.scene, "Future", 4, -2);
                
                // Add time control label
                const timeControlCanvas = document.createElement('canvas');
                timeControlCanvas.width = 256;
                timeControlCanvas.height = 64;
                const timeContext = timeControlCanvas.getContext('2d');
                timeContext.fillStyle = '#ffffff';
                timeContext.font = 'Bold 20px Arial';
                timeContext.fillText("Time flow: Normal", 10, 30);
                
                const timeTexture = new THREE.CanvasTexture(timeControlCanvas);
                const timeMaterial = new THREE.SpriteMaterial({ map: timeTexture });
                
                const timeSprite = new THREE.Sprite(timeMaterial);
                timeSprite.position.set(0, -3, 0);
                timeSprite.scale.set(2, 0.5, 1);
                this.scene.add(timeSprite);
                animation.timeControlLabel = timeSprite;
                
                // Create quantum particles with wave functions
                const particleCount = 5;
                const radius = 2;
                
                for (let i = 0; i < particleCount; i++) {
                    // Create particle
                    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                    const particleMaterial = new THREE.MeshPhongMaterial({
                        color: 0xf72585,
                        emissive: 0xf72585,
                        emissiveIntensity: 0.3
                    });
                    
                    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                    
                    // Position in circular arrangement
                    const angle = (i / particleCount) * Math.PI * 2;
                    particle.position.set(
                        radius * Math.cos(angle),
                        radius * Math.sin(angle),
                        0
                    );
                    
                    // Add wave function visualization
                    const waveGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
                    const waveMaterial = new THREE.MeshBasicMaterial({
                        color: 0xf72585,
                        transparent: true,
                        opacity: 0.3
                    });
                    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
                    wave.position.copy(particle.position);
                    
                    // Set rotation to make torus face camera
                    wave.rotation.x = Math.PI / 2;
                    
                    // Store data for animation
                    particle.userData = {
                        initialAngle: angle,
                        orbitRadius: radius,
                        wave: wave,
                        speed: 0.2 + Math.random() * 0.3, // Different speeds
                        evolvePhase: Math.random() * Math.PI * 2
                    };
                    
                    this.scene.add(particle);
                    this.scene.add(wave);
                    animation.particles.push(particle);
                }
                
                // Add connecting lines between particles (entanglement visualization)
                const lineGeometry = new THREE.BufferGeometry();
                const lineMaterial = new THREE.LineBasicMaterial({ 
                    color: 0x4cc9f0,
                    transparent: true,
                    opacity: 0.3
                });
                
                // Create points for all possible connections
                const points = [];
                for (let i = 0; i < particleCount; i++) {
                    for (let j = i + 1; j < particleCount; j++) {
                        points.push(animation.particles[i].position.clone());
                        points.push(animation.particles[j].position.clone());
                    }
                }
                
                lineGeometry.setFromPoints(points);
                const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
                this.scene.add(lines);
                animation.connectionLines = lines;
                
                // Add text sprite
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 128;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.font = 'Bold 32px Arial';
                context.fillText("Fruit can't connect simultaneously", 10, 70);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(0, 2.8, 0);
                sprite.scale.set(4, 1, 1);
                this.scene.add(sprite);
                animation.textSprite = sprite;
                
                // Move camera back slightly
                this.camera.position.z = 7;
                
                // Update controls to show 3 buttons
                const interactionControls = document.getElementById('interaction-controls');
                interactionControls.innerHTML = '';
                
                const pauseButton = document.createElement('button');
                pauseButton.className = 'interaction-btn';
                pauseButton.textContent = 'Pause Time';
                pauseButton.addEventListener('click', () => this.adjustTime('paused'));
                interactionControls.appendChild(pauseButton);
                
                const reverseButton = document.createElement('button');
                reverseButton.className = 'interaction-btn';
                reverseButton.textContent = 'Reverse Time';
                reverseButton.addEventListener('click', () => this.adjustTime('reversed'));
                interactionControls.appendChild(reverseButton);
                
                const normalButton = document.createElement('button');
                normalButton.className = 'interaction-btn';
                normalButton.textContent = 'Normal Time';
                normalButton.addEventListener('click', () => this.adjustTime('normal'));
                interactionControls.appendChild(normalButton);
                
                function createTimeMarker(scene, text, x, y) { // Accept scene argument
                    const canvas = document.createElement('canvas');
                    canvas.width = 128;
                    canvas.height = 64;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#ffffff';
                    context.font = 'Bold 16px Arial';
                    context.fillText(text, 10, 30);
                    
                    const texture = new THREE.CanvasTexture(canvas);
                    const material = new THREE.SpriteMaterial({ map: texture });
                    
                    const sprite = new THREE.Sprite(material);
                    sprite.position.set(x, y - 0.5, 0);
                    sprite.scale.set(1, 0.5, 1);
                    scene.add(sprite); // Use passed scene argument
                    
                    return sprite;
                }
            },
            
            update: (delta) => {
                if (animation.timeState === "paused") {
                    // No updates when paused
                    return;
                }
                
                const timeDirection = animation.timeState === "reversed" ? -1 : 1;
                
                // Update each particle position and wave
                animation.particles.forEach(particle => {
                    const userData = particle.userData;
                    
                    // Update orbital position
                    const angle = userData.initialAngle + 
                                this.clock.elapsedTime * userData.speed * timeDirection;
                    
                    particle.position.x = userData.orbitRadius * Math.cos(angle);
                    particle.position.y = userData.orbitRadius * Math.sin(angle);
                    
                    // Move wave with particle
                    userData.wave.position.copy(particle.position);
                    
                    // Scale wave based on time
                    const waveScale = 1 + 0.3 * Math.sin(this.clock.elapsedTime * 2 + userData.evolvePhase);
                    userData.wave.scale.set(waveScale, waveScale, waveScale);
                });
                
                // Update connection lines
                const positions = animation.connectionLines.geometry.attributes.position;
                let index = 0;
                
                for (let i = 0; i < animation.particles.length; i++) {
                    for (let j = i + 1; j < animation.particles.length; j++) {
                        positions.setXYZ(index++, 
                            animation.particles[i].position.x,
                            animation.particles[i].position.y,
                            animation.particles[i].position.z);
                        positions.setXYZ(index++, 
                            animation.particles[j].position.x,
                            animation.particles[j].position.y,
                            animation.particles[j].position.z);
                    }
                }
                
                positions.needsUpdate = true;
                
                // Fade in text if not in normal time
                if (animation.timeState !== "normal" && animation.textSprite.material.opacity < 1) {
                    animation.textSprite.material.opacity += delta * 0.5;
                } else if (animation.timeState === "normal" && animation.textSprite.material.opacity > 0) {
                    animation.textSprite.material.opacity -= delta * 0.5;
                }
            },
            
            adjustTime: function(state) {
                animation.timeState = state;
                
                // Update time control label
                const canvas = animation.timeControlLabel.material.map.image;
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = '#ffffff';
                context.font = 'Bold 20px Arial';
                
                let stateText;
                switch (state) {
                    case "normal": stateText = "Normal"; break;
                    case "paused": stateText = "Paused"; break;
                    case "reversed": stateText = "Reversed"; break;
                }
                
                context.fillText(`Time flow: ${stateText}`, 10, 30);
                animation.timeControlLabel.material.map.needsUpdate = true;
            },
            
            triggerInteraction: () => {
                // Cycle through states
                const states = ["normal", "paused", "reversed"];
                const currentIndex = states.indexOf(animation.timeState);
                const nextIndex = (currentIndex + 1) % states.length;
                animation.adjustTime(states[nextIndex]);
            }
        };
        
        animation.initialize();
        this.animations.push(animation);
        this.currentAnimation = animation;
    }
}