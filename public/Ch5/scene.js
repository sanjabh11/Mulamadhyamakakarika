import * as THREE from 'three';
import { config } from './config.js';

export class SceneManager {
    constructor(scene, camera, soundManager, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.soundManager = soundManager;
        this.renderer = renderer;
        this.currentVerse = -1;
        this.verseObjects = {};
        
        this.createStarryBackground();
        this.createIntroScene();
        this.initVerseScenes();
    }
    
    createStarryBackground() {
        // Create star particles
        const starCount = this.isMobile ? 
            Math.floor(config.scene.starCount / 2) : 
            config.scene.starCount;
            
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            // Random position in sphere
            const radius = 50 + Math.random() * 50; // Stars between 50-100 units away
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);     // x
            starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
            starPositions[i3 + 2] = radius * Math.cos(phi);                   // z
            
            // Random size
            starSizes[i] = Math.random() * 2 + 0.5;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
        
        // Star material with custom shader
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                uniform float time;
                varying float vSize;
                
                void main() {
                    vSize = size;
                    // Simple pulsing effect based on position and time
                    float pulse = sin(position.x * 0.01 + time * 2.0) * 0.1 + 0.9;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vSize;
                
                void main() {
                    // Create circular point with faded edge
                    float r = length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
                    float alpha = 1.0 - smoothstep(0.8, 1.0, r);
                    
                    // Star color with slight blue tint
                    vec3 color = mix(vec3(0.8, 0.9, 1.0), vec3(1.0), vSize * 0.2);
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }
    
    createIntroScene() {
        // Create a simple globe
        const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
        const globeMaterial = new THREE.MeshStandardMaterial({
            color: 0x3355aa,
            emissive: 0x112244,
            metalness: 0.1,
            roughness: 0.7
        });
        
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    // Calculate glow based on angle to camera
                    float intensity = pow(0.75 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    
                    // Pulsing effect
                    float pulse = sin(time * 1.5) * 0.1 + 0.9;
                    
                    // Blue glow color
                    vec3 glow = vec3(0.3, 0.6, 1.0) * intensity * pulse;
                    
                    gl_FragColor = vec4(glow, intensity);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        
        // Create a group for the globe and glow
        this.introGlobe = new THREE.Group();
        this.introGlobe.add(globe);
        this.introGlobe.add(glow);
        this.scene.add(this.introGlobe);
        
        // Make globe interactive
        this.introGlobe.userData.clickable = true;
        this.introGlobe.onGlobeClick = () => {}; // Will be set in main.js
        
        // Setup raycaster for globe interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        window.addEventListener('click', () => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(globe, true);
            
            if (intersects.length > 0) {
                this.introGlobe.onGlobeClick();
            }
        });
        
        // Make globe rotate slowly
        this.introGlobe.userData.rotationSpeed = 0.2;
    }
    
    initVerseScenes() {
        // Initialize objects for each verse
        this.createVerse1Scene();
        this.createVerse2Scene();
        this.createVerse3Scene();
        this.createVerse4Scene();
        this.createVerse5Scene();
        this.createVerse6Scene();
        this.createVerse7Scene();
        this.createVerse8Scene();
        this.createConclusionScene();
        
        // Hide all verse objects initially
        Object.values(this.verseObjects).forEach(group => {
            group.visible = false;
        });
    }
    
    createVerse1Scene() {
        // Verse 1: Double Slit Experiment
        const group = new THREE.Group();
        
        // Create light source
        const light = new THREE.PointLight(0xffffff, 1, 10);
        light.position.set(0, 0, 2);
        group.add(light);
        
        // Create double slit
        const slitGeometry = new THREE.BoxGeometry(3, 0.05, 0.05);
        const slitMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const slit = new THREE.Mesh(slitGeometry, slitMaterial);
        
        // Create two holes in slit
        const hole1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x000000 })
        );
        hole1.position.set(-0.5, 0, 0);
        
        const hole2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x000000 })
        );
        hole2.position.set(0.5, 0, 0);
        
        slit.add(hole1);
        slit.add(hole2);
        group.add(slit);
        
        // Create screen
        const screenGeometry = new THREE.PlaneGeometry(3, 1.5);
        const screenMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide,
            emissive: 0x222222
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0, -2);
        group.add(screen);
        
        // Create particles for wave/particle effect
        const particleCount = this.isMobile ? 
            config.performance.mobileParticleLimit / 2 : 
            config.performance.particleLimit / 2;
            
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocities = new Float32Array(particleCount * 3);
        const particleTypes = new Float32Array(particleCount); // 0 = wave, 1 = particle
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Start at light source
            particlePositions[i3] = 0; 
            particlePositions[i3 + 1] = 0;
            particlePositions[i3 + 2] = 2;
            
            // Set initial velocities toward slits
            const targetX = Math.random() > 0.5 ? -0.5 : 0.5; // Target either slit
            particleVelocities[i3] = targetX * 0.02;
            particleVelocities[i3 + 1] = 0;
            particleVelocities[i3 + 2] = -0.04;
            
            // Initially all are waves
            particleTypes[i] = 0;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));
        particleGeometry.setAttribute('particleType', new THREE.BufferAttribute(particleTypes, 1));
        
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                observing: { value: 0 } // 0 = wave, 1 = particle
            },
            vertexShader: `
                attribute vec3 velocity;
                attribute float particleType;
                uniform float time;
                uniform float observing;
                
                varying float vType;
                
                void main() {
                    vType = particleType;
                    vec3 pos = position + velocity * time;
                    
                    // Reset particles that go beyond the screen
                    if (pos.z < -2.0) {
                        pos.z = 2.0;
                        pos.x = 0.0;
                        pos.y = 0.0;
                    }
                    
                    gl_PointSize = mix(3.0, 5.0, observing) * (1.0 - pos.z * 0.1);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float observing;
                varying float vType;
                
                void main() {
                    // Wave = blue, Particle = orange
                    vec3 waveColor = vec3(0.2, 0.5, 1.0);
                    vec3 particleColor = vec3(1.0, 0.5, 0.2);
                    
                    vec3 finalColor = mix(waveColor, particleColor, observing);
                    
                    // Circular point
                    float r = length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
                    float alpha = 1.0 - smoothstep(0.8, 1.0, r);
                    
                    gl_FragColor = vec4(finalColor, alpha * 0.7);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        group.add(particles);
        
        // Add observe button function
        group.userData.observing = false;
        group.userData.toggleObservation = () => {
            group.userData.observing = !group.userData.observing;
            particles.material.uniforms.observing.value = group.userData.observing ? 1.0 : 0.0;
            
            // Update particle behavior
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.attributes.velocity.array;
            const types = particles.geometry.attributes.particleType.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                if (group.userData.observing) {
                    // When observing, particles go directly to random positions on screen
                    if (positions[i3 + 2] < 0) { // If past slit
                        types[i] = 1; // Become particle
                    }
                } else {
                    // When not observing, return to wave pattern
                    types[i] = 0;
                }
            }
            
            particles.geometry.attributes.particleType.needsUpdate = true;
            
            return group.userData.observing;
        };
        
        // Update function for animations
        group.userData.update = (delta) => {
            particles.material.uniforms.time.value += delta * 10;
            
            // Reset time periodically to prevent floating point issues
            if (particles.material.uniforms.time.value > 1000) {
                particles.material.uniforms.time.value = 0;
                
                // Reset particles
                const positions = particles.geometry.attributes.position.array;
                const velocities = particles.geometry.attributes.velocity.array;
                
                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    
                    // Reset to source
                    positions[i3] = 0;
                    positions[i3 + 1] = 0;
                    positions[i3 + 2] = 2;
                    
                    // Randomize target slit
                    const targetX = Math.random() > 0.5 ? -0.5 : 0.5;
                    velocities[i3] = targetX * 0.02;
                    velocities[i3 + 1] = 0;
                    velocities[i3 + 2] = -0.04;
                }
                
                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.velocity.needsUpdate = true;
            }
            
            // Add interference pattern calculation when particles pass slit
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.attributes.velocity.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const z = positions[i3 + 2] + velocities[i3 + 2] * particles.material.uniforms.time.value;
                
                // If particle just passed the slit
                if (z < 0 && z > -0.1 && !group.userData.observing) {
                    // Add interference pattern
                    velocities[i3] += (Math.random() - 0.5) * 0.01;
                    velocities[i3 + 1] += (Math.random() - 0.5) * 0.01;
                }
            }
        };
        
        this.verseObjects.verse1 = group;
        this.scene.add(group);
    }
    
    createVerse2Scene() {
        // Verse 2: Particle Spin with Measurement Tool
        const group = new THREE.Group();
        
        // Create particle
        const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x3366ff,
            emissive: 0x112244,
            roughness: 0.3,
            metalness: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        group.add(particle);
        
        // Create spin arrow
        const arrowGeometry = new THREE.CylinderGeometry(0, 0.15, 0.5, 12);
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5533,
            emissive: 0x441111,
            roughness: 0.3
        });
        
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.y = 0.5;
        arrow.rotation.x = Math.PI / 2;
        particle.add(arrow);
        
        // Create measurement tool
        const toolGeometry = new THREE.BoxGeometry(3, 0.1, 0.1);
        const toolMaterial = new THREE.MeshStandardMaterial({
            color: 0x33ff77,
            emissive: 0x115522,
            roughness: 0.5
        });
        
        const tool = new THREE.Mesh(toolGeometry, toolMaterial);
        tool.position.z = -2;
        group.add(tool);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x444444);
        group.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        group.add(directionalLight);
        
        // Add interaction function
        group.userData.angleValue = 0;
        group.userData.setAngle = (angle) => {
            group.userData.angleValue = angle;
            tool.rotation.z = angle * Math.PI * 2;
            
            // Calculate spin alignment based on measurement angle
            const alignmentFactor = Math.cos(angle * Math.PI * 2);
            
            // Rotate arrow based on alignment
            arrow.rotation.z = angle * Math.PI * 2;
            
            // Change particle color based on alignment
            const alignedColor = new THREE.Color(0x3366ff);
            const unalignedColor = new THREE.Color(0xff3366);
            const mixedColor = alignedColor.clone().lerp(unalignedColor, (1 - Math.abs(alignmentFactor)) * 0.8);
            
            particleMaterial.color = mixedColor;
            particleMaterial.emissive = mixedColor.clone().multiplyScalar(0.3);
            
            return angle;
        };
        
        // Animation update
        group.userData.update = (delta) => {
            particle.rotation.y += delta * 0.5;
            
            // Add subtle floating motion
            particle.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            
            // Move tool in and out slightly
            tool.position.z = -2 + Math.sin(Date.now() * 0.0005) * 0.2;
        };
        
        this.verseObjects.verse2 = group;
        this.scene.add(group);
    }
    
    createVerse3Scene() {
        // Verse 3: Wave Function Collapse
        const group = new THREE.Group();
        
        // Create wave cloud
        const cloudParticleCount = this.isMobile ? 100 : 200;
        const cloudGeometry = new THREE.BufferGeometry();
        const cloudPositions = new Float32Array(cloudParticleCount * 3);
        const cloudSizes = new Float32Array(cloudParticleCount);
        const cloudPhases = new Float32Array(cloudParticleCount);
        
        // Create cloud in sphere shape
        for (let i = 0; i < cloudParticleCount; i++) {
            const i3 = i * 3;
            const radius = 1 + Math.random() * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            cloudPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            cloudPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            cloudPositions[i3 + 2] = radius * Math.cos(phi);
            
            cloudSizes[i] = Math.random() * 5 + 2;
            cloudPhases[i] = Math.random() * Math.PI * 2;
        }
        
        cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
        cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1));
        cloudGeometry.setAttribute('phase', new THREE.BufferAttribute(cloudPhases, 1));
        
        const cloudMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                collapsed: { value: 0 }, // 0-1 collapse factor
                collapsePoint: { value: new THREE.Vector3(0, 0, 0) }
            },
            vertexShader: `
                attribute float size;
                attribute float phase;
                uniform float time;
                uniform float collapsed;
                uniform vec3 collapsePoint;
                
                varying float vSize;
                
                void main() {
                    vSize = size;
                    
                    // Calculate wave motion
                    vec3 pos = position;
                    
                    // When not collapsed, particles move in wave pattern
                    if (collapsed < 1.0) {
                        float wave = sin(time * 2.0 + phase) * 0.1;
                        pos += normalize(position) * wave * (1.0 - collapsed);
                    }
                    
                    // When collapsing, move toward collapse point
                    vec3 towardCenter = mix(pos, collapsePoint, collapsed);
                    
                    gl_PointSize = size * (1.0 - collapsed * 0.7);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(towardCenter, 1.0);
                }
            `,
            fragmentShader: `
                uniform float collapsed;
                varying float vSize;
                
                void main() {
                    // Create circular point with faded edge
                    float r = length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
                    float alpha = 1.0 - smoothstep(0.8, 1.0, r);
                    
                    // Uncollapsed = blue cloud, Collapsed = orange dot
                    vec3 cloudColor = vec3(0.4, 0.6, 1.0);
                    vec3 particleColor = vec3(1.0, 0.6, 0.2);
                    
                    vec3 finalColor = mix(cloudColor, particleColor, collapsed);
                    
                    gl_FragColor = vec4(finalColor, alpha * 0.7);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        
        const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
        group.add(cloud);
        
        // Create measurement ray
        const rayGeometry = new THREE.CylinderGeometry(0.02, 0.02, 6, 8);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0x33ff88,
            transparent: true,
            opacity: 0.7
        });
        
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.rotation.z = Math.PI / 2;
        ray.position.x = -6;
        group.add(ray);
        
        // Add collapsed particle (appears after collapse)
        const collapsedGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const collapsedMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6622,
            emissive: 0x441100,
            roughness: 0.3,
            metalness: 0.7,
            transparent: true,
            opacity: 0
        });
        
        const collapsedParticle = new THREE.Mesh(collapsedGeometry, collapsedMaterial);
        group.add(collapsedParticle);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x444444);
        group.add(ambientLight);
        
        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 1, 10);
        pointLight.position.set(3, 3, 3);
        group.add(pointLight);
        
        // Add interaction function
        group.userData.collapsed = false;
        group.userData.collapseProgress = 0;
        group.userData.collapsePoint = new THREE.Vector3();
        
        group.userData.triggerCollapse = () => {
            if (!group.userData.collapsed) {
                group.userData.collapsed = true;
                
                // Generate random point on unit sphere for collapse
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const x = Math.sin(phi) * Math.cos(theta) * 0.8;
                const y = Math.sin(phi) * Math.sin(theta) * 0.8;
                const z = Math.cos(phi) * 0.8;
                
                group.userData.collapsePoint.set(x, y, z);
                cloud.material.uniforms.collapsePoint.value = group.userData.collapsePoint;
                
                // Position collapsed particle at collapse point
                collapsedParticle.position.copy(group.userData.collapsePoint);
                
                return true;
            }
            return false;
        };
        
        group.userData.resetCollapse = () => {
            group.userData.collapsed = false;
            group.userData.collapseProgress = 0;
            cloud.material.uniforms.collapsed.value = 0;
            collapsedMaterial.opacity = 0;
            ray.position.x = -6;
        };
        
        // Animation update
        group.userData.update = (delta) => {
            cloud.material.uniforms.time.value += delta;
            
            // Handle collapse animation
            if (group.userData.collapsed) {
                if (group.userData.collapseProgress < 1) {
                    group.userData.collapseProgress += delta * 2; // Collapse over 0.5 seconds
                    if (group.userData.collapseProgress > 1) group.userData.collapseProgress = 1;
                    
                    cloud.material.uniforms.collapsed.value = group.userData.collapseProgress;
                    collapsedMaterial.opacity = group.userData.collapseProgress;
                    
                    // Move ray toward center during collapse
                    ray.position.x = -6 + group.userData.collapseProgress * 6;
                }
            } else {
                // Subtle rotation when not collapsed
                cloud.rotation.y += delta * 0.1;
            }
        };
        
        this.verseObjects.verse3 = group;
        this.scene.add(group);
    }
    
    createVerse4Scene() {
        // Verse 4: Mutual Dependence - Particle and Measurement Interaction
        const group = new THREE.Group();
        
        // Create particle
        const particleGeometry = new THREE.SphereGeometry(0.4, 24, 24);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x3366ff,
            emissive: 0x112244,
            roughness: 0.3,
            metalness: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.x = -1.5;
        group.add(particle);
        
        // Create measurement device
        const meterGeometry = new THREE.BoxGeometry(1, 0.8, 0.2);
        const meterMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.7,
            metalness: 0.3
        });
        
        const meter = new THREE.Mesh(meterGeometry, meterMaterial);
        meter.position.x = 1.5;
        group.add(meter);
        
        // Create meter display
        const displayGeometry = new THREE.PlaneGeometry(0.8, 0.6);
        const displayMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            transparent: true
        });
        
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.z = 0.11;
        meter.add(display);
        
        // Create glow for particle and meter
        const particleGlow = new THREE.PointLight(0x3366ff, 1, 3);
        particleGlow.position.copy(particle.position);
        group.add(particleGlow);
        
        const meterGlow = new THREE.PointLight(0x3366ff, 0.5, 3);
        meterGlow.position.copy(meter.position);
        group.add(meterGlow);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x444444);
        group.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        group.add(directionalLight);
        
        // Create connection beam
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0x3366ff,
            transparent: true,
            opacity: 0
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.rotation.z = Math.PI / 2;
        group.add(beam);
        
        // Add interaction function
        group.userData.measuring = false;
        group.userData.measureProgress = 0;
        group.userData.colorOptions = [
            new THREE.Color(0x3366ff), // Blue
            new THREE.Color(0xff3366), // Red
            new THREE.Color(0x33ff66), // Green
            new THREE.Color(0xffaa33)  // Orange
        ];
        
        group.userData.startMeasurement = () => {
            if (!group.userData.measuring) {
                group.userData.measuring = true;
                group.userData.measureProgress = 0;
                
                // Choose random color
                const colorIndex = Math.floor(Math.random() * group.userData.colorOptions.length);
                const newColor = group.userData.colorOptions[colorIndex];
                
                // Store color for transition
                group.userData.targetColor = newColor;
                group.userData.initialColor = particleMaterial.color.clone();
                
                return true;
            }
            return false;
        };
        
        group.userData.resetMeasurement = () => {
            group.userData.measuring = false;
            group.userData.measureProgress = 0;
            beamMaterial.opacity = 0;
        };
        
        // Animation update
        group.userData.update = (delta) => {
            // Handle measurement animation
            if (group.userData.measuring) {
                if (group.userData.measureProgress < 1) {
                    group.userData.measureProgress += delta * 0.5; // Measure over 2 seconds
                    if (group.userData.measureProgress > 1) group.userData.measureProgress = 1;
                    
                    // Beam animation
                    beamMaterial.opacity = Math.sin(group.userData.measureProgress * Math.PI) * 0.7;
                    
                    // Color transition for both particle and meter
                    const lerpedColor = group.userData.initialColor.clone().lerp(
                        group.userData.targetColor, 
                        group.userData.measureProgress
                    );
                    
                    particleMaterial.color.copy(lerpedColor);
                    particleMaterial.emissive.copy(lerpedColor).multiplyScalar(0.3);
                    particleGlow.color.copy(lerpedColor);
                    meterGlow.color.copy(lerpedColor);
                    beamMaterial.color.copy(lerpedColor);
                    
                    // Particle pulsing during measurement
                    const scale = 1 + Math.sin(group.userData.measureProgress * Math.PI * 10) * 0.1 * 
                                 (1 - group.userData.measureProgress);
                    particle.scale.set(scale, scale, scale);
                    
                    // Display animation
                    displayMaterial.color.copy(lerpedColor).multiplyScalar(0.7);
                } else {
                    // Measurement complete
                    beamMaterial.opacity = 0.2 + Math.sin(Date.now() * 0.003) * 0.1;
                }
            } else {
                // Gentle rotation when not measuring
                particle.rotation.y += delta * 0.2;
                particle.rotation.x += delta * 0.1;
                
                // Subtle hover effect
                particle.position.y = Math.sin(Date.now() * 0.001) * 0.1;
                meter.position.y = Math.sin(Date.now() * 0.001 + 1) * 0.05;
            }
        };
        
        this.verseObjects.verse4 = group;
        this.scene.add(group);
    }
    
    createVerse5Scene() {
        // Verse 5: Quantum Field - Particles as Field Ripples
        const group = new THREE.Group();
        
        // Create field mesh
        const size = 10;
        const resolution = this.isMobile ? 32 : 64;
        const geometry = new THREE.PlaneGeometry(size, size, resolution - 1, resolution - 1);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                wavePoints: { value: [] },
                waveStrengths: { value: [] },
                waveTimes: { value: [] },
                waveCount: { value: 0 }
            },
            vertexShader: `
                uniform float time;
                uniform vec3 wavePoints[10]; // Maximum 10 wave points
                uniform float waveStrengths[10];
                uniform float waveTimes[10];
                uniform int waveCount;
                
                varying vec3 vPosition;
                varying float vElevation;
                
                float calculateWave(vec3 position, vec3 waveCenter, float strength, float waveTime) {
                    float distance = length(position.xy - waveCenter.xy);
                    float waveSpeed = 2.0;
                    float waveFactor = sin(distance * 3.0 - waveTime * waveSpeed);
                    float attenuationFactor = 1.0 / (1.0 + distance * 2.0);
                    
                    return waveFactor * attenuationFactor * strength;
                }
                
                void main() {
                    vPosition = position;
                    
                    // Calculate base waves
                    float baseWave = sin(position.x * 0.5 + time * 0.2) * 0.05 * sin(position.y * 0.5 + time * 0.3) * 0.05;
                    
                    // Calculate dynamic waves from points
                    float dynamicWaves = 0.0;
                    for (int i = 0; i < 10; i++) {
                        if (i < waveCount) {
                            dynamicWaves += calculateWave(position, wavePoints[i], waveStrengths[i], waveTimes[i]);
                        }
                    }
                    
                    // Combine waves
                    float elevation = baseWave + dynamicWaves * 0.5;
                    vElevation = elevation;
                    
                    // Displace vertices along z-axis
                    vec3 newPosition = position;
                    newPosition.z += elevation;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vPosition;
                varying float vElevation;
                
                void main() {
                    // Base color - blue/purple gradient
                    vec3 baseColor = mix(
                        vec3(0.1, 0.3, 0.8), // Deep blue
                        vec3(0.4, 0.2, 0.8), // Purple
                        (vPosition.x + 5.0) / 10.0 // Normalize x from -5 to 5 to 0 to 1
                    );
                    
                    // Add glow based on elevation
                    float glowIntensity = abs(vElevation) * 5.0;
                    vec3 glowColor = mix(baseColor, vec3(0.6, 0.8, 1.0), glowIntensity);
                    
                    // Add grid lines
                    float gridX = mod(vPosition.x, 1.0);
                    float gridY = mod(vPosition.y, 1.0);
                    
                    // Make grid lines thinner near edges
                    float gridLine = min(
                        smoothstep(0.0, 0.03, gridX) * smoothstep(1.0, 0.97, gridX),
                        smoothstep(0.0, 0.03, gridY) * smoothstep(1.0, 0.97, gridY)
                    );
                    
                    // Mix in grid
                    vec3 finalColor = mix(glowColor, vec3(0.7, 0.8, 1.0), gridLine * 0.1);
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            wireframe: false,
            side: THREE.DoubleSide
        });
        
        const field = new THREE.Mesh(geometry, material);
        field.rotation.x = -Math.PI / 2;
        group.add(field);
        
        // Add particle system for wave peaks
        const particleCount = this.isMobile ? 50 : 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = 0;
            particlePositions[i3 + 1] = 0;
            particlePositions[i3 + 2] = -10; // Hidden initially
            particleSizes[i] = Math.random() * 3 + 1;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                uniform float time;
                
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                void main() {
                    // Create circular point with faded edge
                    float r = length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
                    float alpha = 1.0 - smoothstep(0.8, 1.0, r);
                    
                    // Particle color - bright blue/white
                    vec3 color = vec3(0.6, 0.8, 1.0);
                    
                    gl_FragColor = vec4(color, alpha * 0.7);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        group.add(particles);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x444444);
        group.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        group.add(directionalLight);
        
        // Add interaction function
        group.userData.waves = [];
        
        group.userData.spawnWave = () => {
            // Generate random position within field
            const x = (Math.random() - 0.5) * 8;
            const y = (Math.random() - 0.5) * 8;
            const wavePoint = new THREE.Vector3(x, y, 0);
            
            // Add wave to list
            const wave = {
                position: wavePoint,
                strength: 0.6 + Math.random() * 0.4,
                startTime: Date.now() / 1000,
                active: true,
                particles: []
            };
            
            group.userData.waves.push(wave);
            
            // Create particles for this wave
            const particlePositions = particles.geometry.attributes.position.array;
            const particleSizes = particles.geometry.attributes.size.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // If particle is inactive (below field), use it
                if (particlePositions[i3 + 2] < -5) {
                    // Position at wave
                    particlePositions[i3] = x;
                    particlePositions[i3 + 1] = y;
                    particlePositions[i3 + 2] = 0.5; // Just above field
                    
                    // Add to wave's particles
                    wave.particles.push(i);
                    
                    // Only use a few particles per wave
                    if (wave.particles.length >= 5) break;
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            
            return true;
        };
        
        // Animation update
        group.userData.update = (delta) => {
            field.material.uniforms.time.value += delta;
            particles.material.uniforms.time.value += delta;
            
            // Update wave points for shader
            const wavePoints = [];
            const waveStrengths = [];
            const waveTimes = [];
            let activeWaveCount = 0;
            
            const currentTime = Date.now() / 1000;
            
            // Process all active waves
            for (let i = 0; i < group.userData.waves.length; i++) {
                const wave = group.userData.waves[i];
                
                if (wave.active) {
                    const waveAge = currentTime - wave.startTime;
                    
                    // Wave lasts for 3 seconds
                    if (waveAge < 3) {
                        // Add to shader uniforms if we have space
                        if (activeWaveCount < 10) {
                            wavePoints.push(wave.position.x, wave.position.y, wave.position.z);
                            waveStrengths.push(wave.strength * (1 - waveAge / 3));
                            waveTimes.push(waveAge);
                            activeWaveCount++;
                        }
                        
                        // Update particles
                        const particlePositions = particles.geometry.attributes.position.array;
                        
                        for (let j = 0; j < wave.particles.length; j++) {
                            const particleIndex = wave.particles[j];
                            const i3 = particleIndex * 3;
                            
                            // Particle rises and falls with wave
                            const height = Math.sin(waveAge * 2) * 0.5 * (1 - waveAge / 3);
                            particlePositions[i3 + 2] = Math.max(0, height);
                            
                            // Particle drifts from center
                            const angle = Math.PI * 2 * (j / wave.particles.length);
                            const radius = waveAge * 2;
                            particlePositions[i3] = wave.position.x + Math.cos(angle) * radius;
                            particlePositions[i3 + 1] = wave.position.y + Math.sin(angle) * radius;
                        }
                        
                        particles.geometry.attributes.position.needsUpdate = true;
                    } else {
                        // Wave is expired
                        wave.active = false;
                        
                        // Hide particles
                        const particlePositions = particles.geometry.attributes.position.array;
                        
                        for (let j = 0; j < wave.particles.length; j++) {
                            const particleIndex = wave.particles[j];
                            const i3 = particleIndex * 3;
                            
                            // Move below field
                            particlePositions[i3 + 2] = -10;
                        }
                        
                        particles.geometry.attributes.position.needsUpdate = true;
                    }
                }
            }
            
            // Update shader uniforms
            field.material.uniforms.wavePoints.value = wavePoints;
            field.material.uniforms.waveStrengths.value = waveStrengths;
            field.material.uniforms.waveTimes.value = waveTimes;
            field.material.uniforms.waveCount.value = activeWaveCount;
            
            // Clean up expired waves periodically
            if (Math.random() < 0.01) {
                group.userData.waves = group.userData.waves.filter(wave => wave.active);
            }
            
            // Auto-spawn waves occasionally if there aren't many
            if (activeWaveCount < 3 && Math.random() < 0.01) {
                group.userData.spawnWave();
            }
        };
        
        this.verseObjects.verse5 = group;
        this.scene.add(group);
    }
    
    createVerse6Scene() {
        // Verse 6: Superposition - Multiple States Until Observed
        const group = new THREE.Group();
        
        // Create superposition sphere
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                observed: { value: 0 } // 0-1 observation factor
            },
            vertexShader: `
                uniform float time;
                uniform float observed;
                
                varying vec3 vNormal;
                varying float vNoise;
                
                // Simple noise function
                float noise(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
                }
                
                void main() {
                    vNormal = normal;
                    
                    // Calculate noise based on position and time
                    float n = noise(position * 2.0 + time * 0.3);
                    vNoise = n;
                    
                    // Displace vertices along normal when not observed
                    vec3 displacedPosition = position;
                    if (observed < 1.0) {
                        displacedPosition += normal * n * 0.2 * (1.0 - observed);
                    }
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float observed;
                
                varying vec3 vNormal;
                varying float vNoise;
                
                void main() {
                    // Calculate base color - shifts between states when not observed
                    vec3 state1 = vec3(0.3, 0.6, 1.0); // Blue
                    vec3 state2 = vec3(1.0, 0.6, 0.3); // Orange
                    
                    float stateMix;
                    if (observed < 1.0) {
                        // When not observed, color shifts between states
                        stateMix = sin(time * 3.0 + vNoise * 5.0) * 0.5 + 0.5;
                    } else {
                        // When observed, color is fixed to one state based on observation "seed"
                        stateMix = sin(time * 0.1) * 0.5 + 0.5; // Locked but slowly shifting
                    }
                    
                    vec3 color = mix(state1, state2, stateMix);
                    
                    // Add lighting effect
                    float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
                    color *= light;
                    
                    // Add glow around edges
                    float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
                    color += edge * 0.3 * mix(state1, state2, stateMix);
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        group.add(sphere);
        
        // Create "eye" observation device
        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(0, 0, 3);
        group.add(eyeGroup);
        
        // Eye outer
        const eyeOuterGeometry = new THREE.SphereGeometry(0.5, 32, 16);
        eyeOuterGeometry.scale(1, 1, 0.5);
        const eyeOuterMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2
        });
        
        const eyeOuter = new THREE.Mesh(eyeOuterGeometry, eyeOuterMaterial);
        eyeGroup.add(eyeOuter);
        
        // Eye iris
        const eyeIrisGeometry = new THREE.SphereGeometry(0.25, 32, 16);
        eyeIrisGeometry.scale(1, 1, 0.6);
        const eyeIrisMaterial = new THREE.MeshStandardMaterial({
            color: 0x336699,
            roughness: 0.1
        });
        
        const eyeIris = new THREE.Mesh(eyeIrisGeometry, eyeIrisMaterial);
        eyeIris.position.z = 0.3;
        eyeGroup.add(eyeIris);
        
        // Eye pupil
        const eyePupilGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        eyePupilGeometry.scale(1, 1, 0.6);
        const eyePupilMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.1
        });
        
        const eyePupil = new THREE.Mesh(eyePupilGeometry, eyePupilMaterial);
        eyePupil.position.z = 0.4;
        eyeGroup.add(eyePupil);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x444444);
        group.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        group.add(directionalLight);
        
        // Add observation beam
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.rotation.x = Math.PI / 2;
        beam.position.z = 1.5;
        eyeGroup.add(beam);
        
        // Add interaction function
        group.userData.observed = false;
        group.userData.observeProgress = 0;
        
        group.userData.look = () => {
            if (!group.userData.observed) {
                group.userData.observed = true;
                group.userData.observeProgress = 0;
                return true;
            }
            return false;
        };
        
        group.userData.resetObservation = () => {
            group.userData.observed = false;
            group.userData.observeProgress = 0;
            sphere.material.uniforms.observed.value = 0;
            beamMaterial.opacity = 0;
            eyeGroup.position.z = 3;
        };
        
        // Animation update
        group.userData.update = (delta) => {
            sphere.material.uniforms.time.value += delta;
            
            // Handle observation animation
            if (group.userData.observed) {
                if (group.userData.observeProgress < 1) {
                    group.userData.observeProgress += delta * 2; // Observe over 0.5 seconds
                    if (group.userData.observeProgress > 1) group.userData.observeProgress = 1;
                    
                    sphere.material.uniforms.observed.value = group.userData.observeProgress;
                    
                    // Eye moves closer during observation
                    eyeGroup.position.z = 3 - group.userData.observeProgress * 1.5;
                    
                    // Beam appears during observation
                    beamMaterial.opacity = group.userData.observeProgress * 0.7;
                }
            } else {
                // Sphere rotates when not observed
                sphere.rotation.y += delta * 0.2;
                sphere.rotation.x += delta * 0.1;
            }
            
            // Eye always blinks occasionally
            const blinkFactor = Math.pow(Math.sin(Date.now() * 0.001), 20);
            eyeIris.scale.y = 1 - blinkFactor * 0.9;
            eyeOuter.scale.y = 1 - blinkFactor * 0.9;
        };
        
        this.verseObjects.verse6 = group;
        this.scene.add(group);
    }
    
    createVerse7Scene() {
        // Verse 7: Quantum Vacuum - Energy in Empty Space
        const group = new THREE.Group();
        
        // Create "vacuum" space with energy fluctuations
        const particleCount = this.isMobile ? 
            config.performance.mobileParticleLimit : 
            config.performance.particleLimit;
            
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        const particleActiveTimes = new Float32Array(particleCount);
        
        // Distribute particles in sphere volume
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random position in sphere
            const radius = 5 * Math.cbrt(Math.random()); // Uniform distribution in sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i3 + 2] = radius * Math.cos(phi);
            
            particleSizes[i] = Math.random() * 5 + 3;
            
            // Particles start inactive
            particleActiveTimes[i] = -1;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        particleGeometry.setAttribute('activeTime', new THREE.BufferAttribute(particleActiveTimes, 1));
        
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                zoomLevel: { value: 1.0 } // 1.0 = normal, > 1.0 = zoomed in
            },
            vertexShader: `
                attribute float size;
                attribute float activeTime;
                
                uniform float time;
                uniform float zoomLevel;
                
                varying float vActiveTime;
                varying float vSize;
                
                void main() {
                    vActiveTime = activeTime;
                    vSize = size;
                    
                    // Only show active particles
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Scale point size with zoom
                    gl_PointSize = size * zoomLevel * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float time;
                
                varying float vActiveTime;
                varying float vSize;
                
                void main() {
                    // Discard inactive particles
                    if (vActiveTime < 0.0) {
                        discard;
                    }
                    
                    // Calculate particle lifetime (0-1)
                    float lifetime = min((time - vActiveTime) * 3.0, 1.0);
                    
                    // Fade out at end of life
                    float alpha = 1.0 - lifetime;
                    
                    // Create circular point with faded edge
                    float r = length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
                    alpha *= 1.0 - smoothstep(0.8, 1.0, r);
                    
                    // Particle color based on size (larger = more energetic)
                    float energyFactor = vSize / 8.0;
                    vec3 lowEnergyColor = vec3(0.3, 0.6, 1.0); // Blue
                    vec3 highEnergyColor = vec3(1.0, 0.7, 0.3); // Orange
                    
                    vec3 color = mix(lowEnergyColor, highEnergyColor, energyFactor);
                    
                    gl_FragColor = vec4(color, alpha * 0.7);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        group.add(particles);
        
        // Create subtle fog effect
        const fogGeometry = new THREE.SphereGeometry(5, 32, 32);
        const fogMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                
                // Simple noise function
                float noise(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
                }
                
                void main() {
                    // Calculate radius from center
                    float radius = length(vPosition);
                    
                    // Edge fog effect
                    float edge = smoothstep(4.5, 5.0, radius);
                    
                    // Add noise pattern
                    float noisePattern = noise(vPosition * 0.5 + time * 0.05);
                    
                    // Fog color
                    vec3 fogColor = vec3(0.1, 0.2, 0.4);
                    
                    // Final color with opacity based on edge and noise
                    gl_FragColor = vec4(fogColor, (edge + noisePattern * 0.1) * 0.3);
                }
            `,
            side: THREE.BackSide,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const fog = new THREE.Mesh(fogGeometry, fogMaterial);
        group.add(fog);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x333333);
        group.add(ambientLight);
        
        // Add zoom interaction function
        group.userData.zoomLevel = 1.0;
        
        group.userData.setZoom = (zoom) => {
            group.userData.zoomLevel = zoom;
            particles.material.uniforms.zoomLevel.value = zoom;
            
            // More particles activate when zoomed in
            group.userData.activationRate = 0.02 + zoom * 0.05;
            
            return zoom;
        };
        
        // Animation update
        group.userData.activationRate = 0.02; // Base rate of particle activation
        group.userData.lastActivationCheck = 0;
        
        group.userData.update = (delta) => {
            particles.material.uniforms.time.value += delta;
            fog.material.uniforms.time.value += delta;
            
            // Activate random particles periodically
            group.userData.lastActivationCheck += delta;
            
            if (group.userData.lastActivationCheck > 0.05) { // Check every 50ms
                group.userData.lastActivationCheck = 0;
                
                const activeTimes = particles.geometry.attributes.activeTime.array;
                
                // Calculate how many particles should be active based on rate
                const targetActiveCount = Math.floor(particleCount * group.userData.activationRate);
                
                // Count currently active particles
                let activeCount = 0;
                for (let i = 0; i < particleCount; i++) {
                    if (activeTimes[i] >= 0 && 
                        particles.material.uniforms.time.value - activeTimes[i] < 1/3) {
                        activeCount++;
                    }
                }
                
                // Activate more particles if needed
                if (activeCount < targetActiveCount) {
                    const toActivate = Math.min(
                        targetActiveCount - activeCount,
                        Math.ceil(particleCount * 0.01) // Activate at most 1% at once
                    );
                    
                    let activated = 0;
                    
                    for (let i = 0; i < particleCount && activated < toActivate; i++) {
                        // If inactive or expired
                        if (activeTimes[i] < 0 || 
                            particles.material.uniforms.time.value - activeTimes[i] >= 1/3) {
                            
                            // Activate particle
                            activeTimes[i] = particles.material.uniforms.time.value;
                            activated++;
                        }
                    }
                    
                    particles.geometry.attributes.activeTime.needsUpdate = true;
                }
            }
            
            // Rotate scene slowly
            group.rotation.y += delta * 0.05;
        };
        
        this.verseObjects.verse7 = group;
        this.scene.add(group);
    }
    
    createVerse8Scene() {
        // Verse 8: Measurement Problem - Quantum states defy fixed labels
        const group = new THREE.Group();
        
        // Create quantum particle that morphs based on measurement approach
        const particleGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                measurementType: { value: 0 }, // 0-3: different measurement types
                measurementStrength: { value: 0 } // 0-1: how close measurement is
            },
            vertexShader: `
                uniform float time;
                uniform float measurementType;
                uniform float measurementStrength;
                
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                // Simple noise function
                float noise(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
                }
                
                void main() {
                    vNormal = normal;
                    vPosition = position;
                    
                    // Base distortion
                    float baseNoise = noise(position * 2.0 + time * 0.2) * 0.1;
                    
                    // Different distortion patterns based on measurement type
                    float typeNoise = 0.0;
                    
                    // Type 0: Spherical harmonics
                    if (measurementType < 0.5) {
                        typeNoise = sin(position.x * 5.0) * sin(position.y * 5.0) * sin(position.z * 5.0) * 0.2;
                    }
                    // Type 1: Radial waves
                    else if (measurementType < 1.5) {
                        float radius = length(position);
                        typeNoise = sin(radius * 10.0 - time) * 0.2;
                    }
                    // Type 2: Stretching along axis
                    else if (measurementType < 2.5) {
                        typeNoise = position.y * 0.3;
                    }
                    // Type 3: Cubic distortion
                    else {
                        typeNoise = pow(abs(position.x * position.y * position.z), 0.5) * 0.3;
                    }
                    
                    // Combine distortions and apply based on measurement strength
                    vec3 distortion = normal * (baseNoise + typeNoise * measurementStrength);
                    vec3 newPosition = position + distortion;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float measurementType;
                uniform float measurementStrength;
                
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    // Base color selection based on measurement type
                    vec3 colors[4];
                    colors[0] = vec3(0.3, 0.6, 1.0); // Blue
                    colors[1] = vec3(1.0, 0.5, 0.2); // Orange
                    colors[2] = vec3(0.2, 0.8, 0.4); // Green
                    colors[3] = vec3(0.8, 0.3, 0.8); // Purple
                    
                    int colorIndex = int(measurementType);
                    vec3 baseColor = colors[colorIndex];
                    
                    // Add lighting
                    float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
                    
                    // Add pulse effect based on measurement strength
                    float pulse = sin(time * 5.0) * 0.2 + 0.8;
                    float pulseStrength = mix(1.0, pulse, measurementStrength);
                    
                    // Final color
                    vec3 finalColor = baseColor * light * pulseStrength;
                    
                    // Add glow at edges
                    float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
                    finalColor += edge * 0.3 * baseColor;
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        group.add(particle);
        
        // Create measurement tools
        const toolGeometries = [
            new THREE.BoxGeometry(0.5, 0.5, 0.5), // Cube for position
            new THREE.CylinderGeometry(0, 0.3, 0.6, 4), // Pyramid for momentum
            new THREE.TorusGeometry(0.3, 0.1, 16, 32), // Torus for spin
            new THREE.SphereGeometry(0.3, 16, 16) // Sphere for energy
        ];
        
        const toolMaterials = [
            new THREE.MeshStandardMaterial({ color: 0x3366ff, emissive: 0x112244 }), // Blue
            new THREE.MeshStandardMaterial({ color: 0xff6633, emissive: 0x442211 }), // Orange
            new THREE.MeshStandardMaterial({ color: 0x33ff66, emissive: 0x114422 }), // Green
            new THREE.MeshStandardMaterial({ color: 0xcc33cc, emissive: 0x441144 })  // Purple
        ];
        
        const tools = [];
        const toolRadius = 2.5;
        
        for (let i = 0; i < 4; i++) {
            const tool = new THREE.Mesh(toolGeometries[i], toolMaterials[i]);
            
            // Position tools in circle around particle
            const angle = i * Math.PI / 2;
            tool.position.x = Math.cos(angle) * toolRadius;
            tool.position.z = Math.sin(angle) * toolRadius;
            
            // Store original position
            tool.userData.originalPosition = tool.position.clone();
            tool.userData.index = i;
            
            tools.push(tool);
            group.add(tool);
        }
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x444444);
        group.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        group.add(directionalLight);
        
        // Add interaction function
        group.userData.activeTool = -1;
        
        group.userData.useTool = (toolIndex) => {
            if (toolIndex >= 0 && toolIndex < 4) {
                group.userData.activeTool = toolIndex;
                
                // Reset all tools to original positions
                tools.forEach(tool => {
                    tool.position.copy(tool.userData.originalPosition);
                });
                
                return true;
            }
            return false;
        };
        
        group.userData.resetMeasurement = () => {
            group.userData.activeTool = -1;
            
            // Reset particle
            particle.material.uniforms.measurementType.value = 0;
            particle.material.uniforms.measurementStrength.value = 0;
            
            // Reset tools
            tools.forEach(tool => {
                tool.position.copy(tool.userData.originalPosition);
            });
        };
        
        // Animation update
        group.userData.update = (delta) => {
            particle.material.uniforms.time.value += delta;
            
            // Handle active tool animation
            if (group.userData.activeTool >= 0) {
                const activeTool = tools[group.userData.activeTool];
                
                // Move tool toward particle
                const targetPosition = new THREE.Vector3();
                const toolPosition = activeTool.position;
                const originalPosition = activeTool.userData.originalPosition;
                
                // Tool moves from original position to close to particle, but not reaching it
                targetPosition.copy(originalPosition).multiplyScalar(0.3);
                
                // Smoothly move toward target
                toolPosition.lerp(targetPosition, delta * 3);
                
                // Calculate measurement strength based on distance
                const originalDistance = originalPosition.length();
                const currentDistance = toolPosition.length();
                const strengthFactor = 1 - (currentDistance / originalDistance);
                
                // Update particle shader
                particle.material.uniforms.measurementType.value = group.userData.activeTool;
                particle.material.uniforms.measurementStrength.value = strengthFactor;
                
                // Rotate tool to face particle
                activeTool.lookAt(0, 0, 0);
            }
            
            // Rotate inactive tools around themselves
            tools.forEach(tool => {
                if (tool.userData.index !== group.userData.activeTool) {
                    tool.rotation.y += delta * 0.5;
                    tool.rotation.x += delta * 0.3;
                    
                    // Add subtle floating motion
                    tool.position.y = tool.userData.originalPosition.y + 
                                     Math.sin(Date.now() * 0.001 + tool.userData.index) * 0.1;
                }
            });
            
            // Gentle rotation for particle when no tool is active
            if (group.userData.activeTool < 0) {
                particle.rotation.y += delta * 0.1;
                particle.rotation.x += delta * 0.05;
            }
        };
        
        this.verseObjects.verse8 = group;
        this.scene.add(group);
    }
    
    createConclusionScene() {
        // Conclusion: Connected Starry Sky with Links
        const group = new THREE.Group();
        
        // Create key stars (brighter, interactive)
        const keyStarCount = 8;
        const keyStarGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const keyStarMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xaaaaff
        });
        
        const keyStars = [];
        
        for (let i = 0; i < keyStarCount; i++) {
            const star = new THREE.Mesh(keyStarGeometry, keyStarMaterial);
            
            // Position in sphere around camera
            const radius = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            star.position.x = radius * Math.sin(phi) * Math.cos(theta);
            star.position.y = radius * Math.sin(phi) * Math.sin(theta);
            star.position.z = radius * Math.cos(phi);
            
            star.userData.originalRadius = radius;
            star.userData.theta = theta;
            star.userData.phi = phi;
            star.userData.pulseOffset = Math.random() * Math.PI * 2;
            
            keyStars.push(star);
            group.add(star);
        }
        
        // Create connections between stars
        const connectionGeometry = new THREE.BufferGeometry();
        const vertexCount = keyStarCount * (keyStarCount - 1);
        const positions = new Float32Array(vertexCount * 3);
        const colors = new Float32Array(vertexCount * 3);
        
        let vertexIndex = 0;
        
        for (let i = 0; i < keyStarCount; i++) {
            const star1 = keyStars[i];
            
            for (let j = 0; j < keyStarCount; j++) {
                if (i !== j) {
                    const star2 = keyStars[j];
                    
                    // Add line vertices
                    positions[vertexIndex * 3] = star1.position.x;
                    positions[vertexIndex * 3 + 1] = star1.position.y;
                    positions[vertexIndex * 3 + 2] = star1.position.z;
                    
                    // Gradient color (blue to purple)
                    colors[vertexIndex * 3] = 0.4;
                    colors[vertexIndex * 3 + 1] = 0.6;
                    colors[vertexIndex * 3 + 2] = 1.0;
                    
                    vertexIndex++;
                }
            }
        }
        
        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        connectionGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const connectionMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
        group.add(connections);
        
        // Create floating text
        const finalMessage = "The journey goes on...";
        const messageMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                uniform float time;
                
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    
                    // Add gentle floating motion
                    vec3 pos = position;
                    pos.y += sin(time * 0.5) * 0.1;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                
                varying vec2 vUv;
                
                void main() {
                    // Create text effect with gradient
                    float centerDist = length(vUv - vec2(0.5, 0.5)) * 2.0;
                    
                    // Pulsing glow
                    float pulse = sin(time * 0.5) * 0.5 + 0.5;
                    
                    // Gradient from blue to purple
                    vec3 color1 = vec3(0.4, 0.6, 1.0); // Blue
                    vec3 color2 = vec3(0.8, 0.5, 1.0); // Purple
                    
                    vec3 color = mix(color1, color2, vUv.x);
                    
                    // Add glow
                    color += pulse * 0.2;
                    
                    // Fade at edges
                    float alpha = 1.0 - smoothstep(0.8, 1.0, centerDist);
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const messageGeometry = new THREE.PlaneGeometry(2, 0.5);
        const message = new THREE.Mesh(messageGeometry, messageMaterial);
        message.position.set(0, 0, -2);
        message.visible = false; // Hidden initially
        group.add(message);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x444444);
        group.add(ambientLight);
        
        // Add interaction function
        group.userData.activeStar = -1;
        
        group.userData.clickStar = (index) => {
            if (index >= 0 && index < keyStarCount) {
                group.userData.activeStar = index;
                message.visible = true;
                
                // Move message near clicked star
                message.position.copy(keyStars[index].position);
                message.position.multiplyScalar(0.7); // Move closer to center
                
                // Make star brighter
                keyStars[index].scale.set(2, 2, 2);
                
                return true;
            }
            return false;
        };
        
        // Animation update
        group.userData.update = (delta) => {
            message.material.uniforms.time.value += delta;
            
            // Update star positions and connections
            for (let i = 0; i < keyStarCount; i++) {
                const star = keyStars[i];
                
                // Gentle orbit motion
                star.userData.theta += delta * 0.1;
                
                // Update position
                star.position.x = star.userData.originalRadius * Math.sin(star.userData.phi) * 
                                 Math.cos(star.userData.theta);
                star.position.y = star.userData.originalRadius * Math.sin(star.userData.phi) * 
                                 Math.sin(star.userData.theta);
                star.position.z = star.userData.originalRadius * Math.cos(star.userData.phi);
                
                // Pulsing effect
                const pulse = Math.sin(Date.now() * 0.001 + star.userData.pulseOffset) * 0.2 + 1;
                
                // Larger pulse for active star
                if (i === group.userData.activeStar) {
                    star.scale.set(1.5 * pulse, 1.5 * pulse, 1.5 * pulse);
                } else {
                    star.scale.set(pulse, pulse, pulse);
                }
            }
            
            // Update connection positions
            const positions = connections.geometry.attributes.position.array;
            
            let vertexIndex = 0;
            
            for (let i = 0; i < keyStarCount; i++) {
                const star1 = keyStars[i];
                
                for (let j = 0; j < keyStarCount; j++) {
                    if (i !== j) {
                        const star2 = keyStars[j];
                        
                        // Update line vertex
                        positions[vertexIndex * 3] = star1.position.x;
                        positions[vertexIndex * 3 + 1] = star1.position.y;
                        positions[vertexIndex * 3 + 2] = star1.position.z;
                        
                        vertexIndex++;
                    }
                }
            }
            
            connections.geometry.attributes.position.needsUpdate = true;
            
            // Rotate entire scene slowly
            group.rotation.y += delta * 0.05;
        };
        
        this.verseObjects.conclusion = group;
        this.scene.add(group);
    }
    
    transitionToVerse(index, previousIndex) {
        // Hide previous verse objects
        if (previousIndex >= 0 && previousIndex < config.verses.length) {
            const previousId = config.verses[previousIndex].id;
            if (this.verseObjects[previousId]) {
                this.verseObjects[previousId].visible = false;
            }
        }
        
        // Hide intro globe when moving to first verse
        if (index === 0) {
            this.introGlobe.visible = false;
        }
        
        // Show current verse objects
        if (index >= 0 && index < config.verses.length) {
            const currentId = config.verses[index].id;
            if (this.verseObjects[currentId]) {
                this.verseObjects[currentId].visible = true;
                
                // Reset any animations or interactions
                if (currentId === 'verse1') {
                    this.verseObjects[currentId].userData.observing = false;
                    this.verseObjects[currentId].userData.toggleObservation();
                } else if (currentId === 'verse2') {
                    this.verseObjects[currentId].userData.setAngle(0);
                } else if (currentId === 'verse3') {
                    this.verseObjects[currentId].userData.resetCollapse();
                } else if (currentId === 'verse4') {
                    this.verseObjects[currentId].userData.resetMeasurement();
                } else if (currentId === 'verse6') {
                    this.verseObjects[currentId].userData.resetObservation();
                } else if (currentId === 'verse7') {
                    this.verseObjects[currentId].userData.setZoom(1.0);
                } else if (currentId === 'verse8') {
                    this.verseObjects[currentId].userData.resetMeasurement();
                }
            }
        }
    }
    
    update(delta) {
        // Update stars background
        if (this.stars) {
            this.stars.material.uniforms.time.value += delta;
        }
        
        // Update intro globe if visible
        if (this.introGlobe && this.introGlobe.visible) {
            this.introGlobe.rotation.y += delta * this.introGlobe.userData.rotationSpeed;
        }
        
        // Update current verse animations
        const currentVerseIndex = window.sceneManager ? window.sceneManager.currentVerse : -1;
        if (currentVerseIndex >= 0 && currentVerseIndex < config.verses.length) {
            const currentId = config.verses[currentVerseIndex].id;
            if (this.verseObjects[currentId] && this.verseObjects[currentId].userData && this.verseObjects[currentId].userData.update) {
                this.verseObjects[currentId].userData.update(delta);
            }
        }
        
        // Render scene
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    get isMobile() {
        return window.innerWidth < 768;
    }
}