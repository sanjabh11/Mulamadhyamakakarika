import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { config } from './config.js';
import gsap from 'gsap';

class AnimationEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.animation = null;
        this.interactive = false;
        this.currentVerseId = 1;
        this.labels = [];
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.setupEnvironment();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(config.animation.backgroundColor);
        this.scene.fog = new THREE.FogExp2(config.animation.backgroundColor, 0.08);
    }
    
    setupCamera() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = config.animation.cameraDistance;
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: !config.animation.lowPerformanceMode,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLights() {
        // Main directional light with shadows
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.1;
        mainLight.shadow.camera.far = 20;
        mainLight.shadow.camera.left = -5;
        mainLight.shadow.camera.right = 5;
        mainLight.shadow.camera.top = 5;
        mainLight.shadow.camera.bottom = -5;
        this.scene.add(mainLight);
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
        this.scene.add(ambientLight);
        
        // Accent lights for dramatic effect
        const accent1 = new THREE.PointLight(0x6c63ff, 2, 10);
        accent1.position.set(-3, 2, 3);
        this.scene.add(accent1);
        
        const accent2 = new THREE.PointLight(0xff9500, 2, 10);
        accent2.position.set(3, -2, -3);
        this.scene.add(accent2);
    }
    
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.toggleInteraction(false);
    }
    
    setupEnvironment() {
        // Add stars in the background
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
        
        // Add a subtle grid for spatial reference
        const gridHelper = new THREE.GridHelper(20, 20, 0x2a2a2a, 0x2a2a2a);
        gridHelper.position.y = -2;
        this.scene.add(gridHelper);
    }
    
    createTextLabel(text, position, delay = 0) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = text;
        
        const label = new CSS2DObject(labelDiv);
        label.position.copy(position);
        this.scene.add(label);
        this.labels.push(label);
        
        // Animate label appearance
        gsap.to(labelDiv, {
            opacity: 1,
            delay: delay,
            duration: 0.5
        });
        
        return label;
    }
    
    clearLabels() {
        for (const label of this.labels) {
            this.scene.remove(label);
        }
        this.labels = [];
    }
    
    clearScene() {
        this.clearLabels();
        
        const objectsToRemove = [];
        this.scene.traverse(object => {
            if (object.type === 'Mesh' || object.type === 'Points' || object.type === 'Line') {
                if (object !== this.stars) {
                    objectsToRemove.push(object);
                }
            }
        });
        
        for (const object of objectsToRemove) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        }
        
        this.setupLights();
    }
    
    toggleInteraction(enable) {
        this.interactive = enable !== undefined ? enable : !this.interactive;
        this.controls.enabled = this.interactive;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    createAnimation(verseId) {
        this.currentVerseId = verseId;
        this.clearScene();
        
        const verse = config.verses.find(v => v.id === verseId);
        if (!verse) return;
        
        // Create meaningful content labels for the 3D scene
        this.createTextLabel(`Verse ${verse.id}`, new THREE.Vector3(0, 2.5, 0));
        
        switch(verse.animationType) {
            case "wave-particle-duality":
                this.createWaveParticleDualityAnimation();
                break;
            case "wave-function-collapse":
                this.createWaveFunctionCollapseAnimation();
                break;
            case "force-effect":
                this.createForceEffectAnimation();
                break;
            case "superposition":
                this.createSuperpositionAnimation();
                break;
            case "electron-cloud":
                this.createElectronCloudAnimation();
                break;
            case "double-slit":
                this.createDoubleSlitAnimation();
                break;
            case "field-excitation":
                this.createFieldExcitationAnimation();
                break;
            case "schrodinger-cat":
                this.createSchrodingerCatAnimation();
                break;
            case "schrodinger-cat-resolved":
                this.createSchrodingerCatResolvedAnimation();
                break;
            default:
                this.createDefaultAnimation();
        }
    }
    
    createWaveParticleDualityAnimation() {
        const particles = new THREE.Group();
        this.scene.add(particles);
        
        // Wave state
        const waveGeometry = new THREE.BufferGeometry();
        const wavePositions = [];
        const waveColors = [];
        const color = new THREE.Color(config.animation.waveColor);
        
        const rows = 20;
        const cols = 20;
        const size = 4;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = (j / cols - 0.5) * size;
                const z = (i / rows - 0.5) * size;
                const y = Math.sin(x * 5) * Math.cos(z * 5) * 0.2;
                
                wavePositions.push(x, y, z);
                waveColors.push(color.r, color.g, color.b);
            }
        }
        
        waveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wavePositions, 3));
        waveGeometry.setAttribute('color', new THREE.Float32BufferAttribute(waveColors, 3));
        
        const waveMaterial = new THREE.PointsMaterial({
            size: config.animation.particleSize * 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });
        
        this.wave = new THREE.Points(waveGeometry, waveMaterial);
        particles.add(this.wave);
        
        // Particle state (initially hidden)
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.particleColor,
            emissive: config.animation.particleColor,
            emissiveIntensity: 0.5,
        });
        
        this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.particle.scale.set(0, 0, 0);
        particles.add(this.particle);
        
        // Detector/Measurement
        const detectorGeometry = new THREE.BoxGeometry(1, 0.2, 1);
        const detectorMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            transparent: true,
            opacity: 0.7,
        });
        
        this.detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
        this.detector.position.set(0, -1, 0);
        this.scene.add(this.detector);
        
        // Add explanatory labels
        this.createTextLabel("Wave Nature", new THREE.Vector3(0, 1, 1), 1);
        this.createTextLabel("Particle Nature", new THREE.Vector3(0, -1.5, 1), 3.5);
        this.createTextLabel("Measurement", new THREE.Vector3(0, -1.2, 0), 2.5);
        
        // Animation loop
        let animationPhase = 'wave';
        let elapsed = 0;
        
        this.animation = (time) => {
            elapsed = time * 0.001; // Convert to seconds
            
            if (animationPhase === 'wave') {
                // Animate the wave
                const positions = this.wave.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const z = positions[i + 2];
                    positions[i + 1] = Math.sin(x * 5 + elapsed * 2) * Math.cos(z * 5 + elapsed) * 0.2;
                }
                
                this.wave.geometry.attributes.position.needsUpdate = true;
                
                // After some time, trigger measurement
                if (elapsed > 3 && elapsed < 3.1) {
                    animationPhase = 'measuring';
                    gsap.to(this.detector.position, {
                        y: 0,
                        duration: 1,
                        ease: "power2.inOut",
                        onComplete: () => {
                            animationPhase = 'collapse';
                            // Hide wave, show particle
                            gsap.to(this.wave.material, {
                                opacity: 0,
                                duration: 0.5,
                            });
                            gsap.to(this.particle.scale, {
                                x: 1, y: 1, z: 1,
                                duration: 0.5,
                            });
                        }
                    });
                }
            } else if (animationPhase === 'collapse') {
                // After showing particle for a while, reset
                if (elapsed > 7) {
                    animationPhase = 'resetting';
                    gsap.to(this.detector.position, {
                        y: -1,
                        duration: 1,
                        ease: "power2.inOut",
                    });
                    gsap.to(this.particle.scale, {
                        x: 0, y: 0, z: 0,
                        duration: 0.5,
                    });
                    gsap.to(this.wave.material, {
                        opacity: 0.8,
                        duration: 0.5,
                        onComplete: () => {
                            animationPhase = 'wave';
                        }
                    });
                }
            }
        };
    }
    
    createWaveFunctionCollapseAnimation() {
        // Create a wave function visualization
        const particleCount = config.animation.particleCount;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color = new THREE.Color(config.animation.particleColor);
        const radius = 2;
        
        for (let i = 0; i < particleCount; i++) {
            // Create a spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = Math.random() * radius;
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = config.animation.particleSize * (1 + Math.random());
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: config.animation.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // Target position where the wave function will collapse
        this.targetPosition = new THREE.Vector3(0, 0, 0);
        
        // Measurement marker (initially invisible)
        const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const markerMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            emissive: config.animation.measurementColor,
            emissiveIntensity: 0.5
        });
        
        this.marker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.marker.scale.set(0, 0, 0);
        this.scene.add(this.marker);
        
        // Animation states
        let state = 'wave';
        let elapsed = 0;
        const originalPositions = positions.slice();
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'wave') {
                // Animate the wave function
                const positions = this.particles.geometry.attributes.position.array;
                
                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    const x = originalPositions[i3];
                    const y = originalPositions[i3 + 1];
                    const z = originalPositions[i3 + 2];
                    
                    // Add some wave-like motion
                    positions[i3] = x + Math.sin(elapsed + i * 0.1) * 0.03;
                    positions[i3 + 1] = y + Math.cos(elapsed + i * 0.05) * 0.03;
                    positions[i3 + 2] = z + Math.sin(elapsed * 0.5 + i * 0.02) * 0.03;
                }
                
                this.particles.geometry.attributes.position.needsUpdate = true;
                
                // After some time, trigger collapse
                if (elapsed > 3 && elapsed < 3.1) {
                    state = 'collapsing';
                    
                    // Random position to collapse to
                    this.targetPosition.set(
                        (Math.random() - 0.5) * 1.5,
                        (Math.random() - 0.5) * 1.5,
                        (Math.random() - 0.5) * 1.5
                    );
                    
                    // Show the measurement marker
                    this.marker.position.copy(this.targetPosition);
                    gsap.to(this.marker.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.3,
                    });
                    
                    // Animate positions to collapse to target
                    for (let i = 0; i < particleCount; i++) {
                        const i3 = i * 3;
                        gsap.to(positions, {
                            [i3]: this.targetPosition.x + (Math.random() - 0.5) * 0.1,
                            [i3 + 1]: this.targetPosition.y + (Math.random() - 0.5) * 0.1,
                            [i3 + 2]: this.targetPosition.z + (Math.random() - 0.5) * 0.1,
                            duration: config.animation.collapseDuration,
                            ease: "power2.inOut",
                            onUpdate: () => {
                                this.particles.geometry.attributes.position.needsUpdate = true;
                            },
                            onComplete: () => {
                                if (i === particleCount - 1) {
                                    state = 'collapsed';
                                }
                            }
                        });
                    }
                }
            } else if (state === 'collapsed') {
                // After some time, reset
                if (elapsed > 7) {
                    state = 'resetting';
                    
                    // Hide measurement marker
                    gsap.to(this.marker.scale, {
                        x: 0, y: 0, z: 0,
                        duration: 0.3
                    });
                    
                    // Animate back to wave function
                    for (let i = 0; i < particleCount; i++) {
                        const i3 = i * 3;
                        gsap.to(positions, {
                            [i3]: originalPositions[i3],
                            [i3 + 1]: originalPositions[i3 + 1],
                            [i3 + 2]: originalPositions[i3 + 2],
                            duration: config.animation.collapseDuration,
                            ease: "power2.inOut",
                            onUpdate: () => {
                                this.particles.geometry.attributes.position.needsUpdate = true;
                            },
                            onComplete: () => {
                                if (i === particleCount - 1) {
                                    state = 'wave';
                                }
                            }
                        });
                    }
                }
            }
        };
    }
    
    createForceEffectAnimation() {
        // Create a sphere representing an object
        const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.particleColor,
            roughness: 0.4,
            metalness: 0.6
        });
        
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(-2, 0, 0);
        this.scene.add(this.sphere);
        
        // Create a force vector
        const arrowLength = 1.5;
        const arrowDirection = new THREE.Vector3(1, 0, 0);
        arrowDirection.normalize();
        
        const arrowHelper = new THREE.ArrowHelper(
            arrowDirection,
            new THREE.Vector3(-2, 0, 0),
            arrowLength,
            config.animation.measurementColor,
            0.3,
            0.2
        );
        this.scene.add(arrowHelper);
        
        // Create path for the sphere to follow
        const curve = new THREE.LineCurve3(
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(2, 0, 0)
        );
        
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(
            curve.getPoints(50)
        );
        const pathMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        });
        
        const path = new THREE.Line(pathGeometry, pathMaterial);
        this.scene.add(path);
        
        // Animation states
        let state = 'initial';
        let elapsed = 0;
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'initial' && elapsed > 1) {
                state = 'moving';
                
                // Animate the sphere along the path
                gsap.to(this.sphere.position, {
                    x: 2,
                    duration: 3,
                    ease: "power1.inOut",
                    onComplete: () => {
                        state = 'reset';
                        
                        // Hide arrow when motion is complete
                        gsap.to(arrowHelper.scale, {
                            x: 0, y: 0, z: 0,
                            duration: 0.5
                        });
                    }
                });
                
                // Move arrow with sphere
                gsap.to(arrowHelper.position, {
                    x: 2,
                    duration: 3,
                    ease: "power1.inOut"
                });
            } else if (state === 'reset' && elapsed > 6) {
                state = 'initial';
                
                // Reset sphere position
                gsap.to(this.sphere.position, {
                    x: -2,
                    duration: 0.1,
                    onComplete: () => {
                        // Show arrow again
                        gsap.to(arrowHelper.scale, {
                            x: 1, y: 1, z: 1,
                            duration: 0.5
                        });
                        
                        // Reset arrow position
                        arrowHelper.position.set(-2, 0, 0);
                    }
                });
            }
        };
    }
    
    createSuperpositionAnimation() {
        // Create a quantum state in superposition
        const radius = 1.5;
        const stateGeometry = new THREE.TorusGeometry(radius, 0.05, 16, 100);
        const stateMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.particleColor,
            emissive: config.animation.particleColor,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        this.superpositionRing = new THREE.Mesh(stateGeometry, stateMaterial);
        this.scene.add(this.superpositionRing);
        
        // Particles moving in superposition
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            particlePositions[i * 3] = Math.cos(angle) * radius;
            particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
            particlePositions[i * 3 + 2] = 0;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: config.animation.waveColor,
            size: config.animation.particleSize * 3,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
        
        // Measurement device (initially invisible)
        const measurementGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const measurementMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            emissive: config.animation.measurementColor,
            emissiveIntensity: 0.5
        });
        
        this.measurementDevice = new THREE.Mesh(measurementGeometry, measurementMaterial);
        this.measurementDevice.scale.set(0, 0, 0);
        this.scene.add(this.measurementDevice);
        
        // Position marker for collapsed state
        const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const markerMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        
        this.marker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.marker.scale.set(0, 0, 0);
        this.scene.add(this.marker);
        
        // Animation states
        let state = 'superposition';
        let elapsed = 0;
        let measurementAngle = 0;
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'superposition') {
                // Rotate the particles around the ring
                this.particles.rotation.z = elapsed * 0.5;
                
                // After some time, trigger measurement
                if (elapsed > 3 && elapsed < 3.1) {
                    state = 'measuring';
                    
                    // Random position on the ring for measurement
                    measurementAngle = Math.random() * Math.PI * 2;
                    const measureX = Math.cos(measurementAngle) * radius;
                    const measureY = Math.sin(measurementAngle) * radius;
                    
                    this.measurementDevice.position.set(measureX, measureY, 0);
                    
                    // Show measurement device
                    gsap.to(this.measurementDevice.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.5,
                        onComplete: () => {
                            // Collapse the state
                            gsap.to(this.superpositionRing.material, {
                                opacity: 0.2,
                                duration: 0.7
                            });
                            
                            gsap.to(this.particles.material, {
                                opacity: 0,
                                duration: 0.7
                            });
                            
                            // Show marker at measurement position
                            this.marker.position.set(measureX, measureY, 0);
                            gsap.to(this.marker.scale, {
                                x: 1, y: 1, z: 1,
                                duration: 0.7,
                                onComplete: () => {
                                    state = 'collapsed';
                                }
                            });
                        }
                    });
                }
            } else if (state === 'collapsed' && elapsed > 6) {
                state = 'resetting';
                
                // Hide measurement device and marker
                gsap.to(this.measurementDevice.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5
                });
                
                gsap.to(this.marker.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5
                });
                
                // Return to superposition
                gsap.to(this.superpositionRing.material, {
                    opacity: 0.7,
                    duration: 0.7
                });
                
                gsap.to(this.particles.material, {
                    opacity: 0.8,
                    duration: 0.7,
                    onComplete: () => {
                        state = 'superposition';
                    }
                });
            }
        };
    }
    
    createElectronCloudAnimation() {
        // Create nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const nucleusMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6347,
            emissive: 0xff6347,
            emissiveIntensity: 0.5
        });
        
        this.nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        this.scene.add(this.nucleus);
        
        // Create electron cloud
        const particleCount = 300;
        const cloudGeometry = new THREE.BufferGeometry();
        const cloudPositions = new Float32Array(particleCount * 3);
        const cloudColors = new Float32Array(particleCount * 3);
        const cloudSizes = new Float32Array(particleCount);
        
        const color = new THREE.Color(config.animation.particleColor);
        const cloudRadius = 1.5;
        
        for (let i = 0; i < particleCount; i++) {
            // Create a volumetric sphere with higher density near certain orbitals
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            // Create a probability distribution that resembles electron orbitals
            let r = Math.pow(Math.random(), 0.5) * cloudRadius;
            
            // Apply some orbital shape influence
            const orbitalInfluence = Math.sin(phi * 4) * Math.cos(theta * 4);
            r *= (1 + orbitalInfluence * 0.2);
            
            cloudPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            cloudPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            cloudPositions[i * 3 + 2] = r * Math.cos(phi);
            
            const intensity = Math.max(0.2, 1 - r / cloudRadius);
            cloudColors[i * 3] = color.r * intensity;
            cloudColors[i * 3 + 1] = color.g * intensity;
            cloudColors[i * 3 + 2] = color.b * intensity;
            
            cloudSizes[i] = config.animation.particleSize * (0.5 + Math.random()) * intensity;
        }
        
        cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
        cloudGeometry.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));
        cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1));
        
        const cloudMaterial = new THREE.PointsMaterial({
            size: config.animation.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        this.electronCloud = new THREE.Points(cloudGeometry, cloudMaterial);
        this.scene.add(this.electronCloud);
        
        // Measurement device
        const deviceGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const deviceMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            transparent: true,
            opacity: 0.8
        });
        
        this.measurementDevice = new THREE.Mesh(deviceGeometry, deviceMaterial);
        this.measurementDevice.position.set(0, 0, -2);
        this.measurementDevice.scale.set(0, 0, 0);
        this.scene.add(this.measurementDevice);
        
        // Electron particle for measurement
        const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const electronMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.particleColor,
            emissive: config.animation.particleColor,
            emissiveIntensity: 0.7
        });
        
        this.electron = new THREE.Mesh(electronGeometry, electronMaterial);
        this.electron.scale.set(0, 0, 0);
        this.scene.add(this.electron);
        
        // Animation states
        let state = 'cloud';
        let elapsed = 0;
        let originalPositions = cloudPositions.slice();
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'cloud') {
                // Animate the electron cloud
                this.electronCloud.rotation.y = elapsed * 0.2;
                this.electronCloud.rotation.z = elapsed * 0.1;
                
                // After some time, trigger measurement
                if (elapsed > 3 && elapsed < 3.1) {
                    state = 'measuring';
                    
                    // Show measurement device
                    gsap.to(this.measurementDevice.position, {
                        z: 1,
                        duration: 1,
                        ease: "power2.inOut"
                    });
                    
                    gsap.to(this.measurementDevice.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.5,
                        onComplete: () => {
                            // Pick a random position from the cloud for electron
                            const particleIndex = Math.floor(Math.random() * particleCount);
                            const px = cloudPositions[particleIndex * 3];
                            const py = cloudPositions[particleIndex * 3 + 1];
                            const pz = cloudPositions[particleIndex * 3 + 2];
                            
                            // Position electron
                            this.electron.position.set(px, py, pz);
                            
                            // Collapse cloud
                            gsap.to(this.electronCloud.material, {
                                opacity: 0.2,
                                duration: 0.7
                            });
                            
                            // Show electron
                            gsap.to(this.electron.scale, {
                                x: 1, y: 1, z: 1,
                                duration: 0.3,
                                onComplete: () => {
                                    state = 'collapsed';
                                }
                            });
                        }
                    });
                }
            } else if (state === 'collapsed' && elapsed > 6) {
                state = 'resetting';
                
                // Hide measurement device
                gsap.to(this.measurementDevice.position, {
                    z: -2,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                gsap.to(this.measurementDevice.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5
                });
                
                // Hide electron
                gsap.to(this.electron.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.3
                });
                
                // Return to cloud state
                gsap.to(this.electronCloud.material, {
                    opacity: 0.7,
                    duration: 0.7,
                    onComplete: () => {
                        state = 'cloud';
                    }
                });
            }
        };
    }
    
    createDoubleSlitAnimation() {
        // Create source
        const sourceGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const sourceMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.particleColor,
            emissive: config.animation.particleColor,
            emissiveIntensity: 0.5
        });
        
        this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.source.position.set(0, 0, -2);
        this.scene.add(this.source);
        
        // Create double slit barrier
        const barrierGeometry = new THREE.BoxGeometry(4, 0.5, 0.1);
        const barrierMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            transparent: true,
            opacity: 0.8
        });
        
        this.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        this.barrier.position.set(0, 0, -1);
        this.scene.add(this.barrier);
        
        // Add explanatory labels that specifically mention "neither like nor unlike"
        this.createTextLabel("Wave Nature", new THREE.Vector3(-1.5, 0.8, 0), 0.5);
        this.createTextLabel("Particle Nature", new THREE.Vector3(1.5, 0.8, 0), 0.5);
        this.createTextLabel("Neither like nor unlike its cause", new THREE.Vector3(0, 1.5, 0), 1);
        
        // Create slits
        const slitWidth = 0.3;
        const slitHeight = 0.5;
        const slitSeparation = 0.8;
        
        const slit1Geometry = new THREE.BoxGeometry(slitWidth, slitHeight, 0.15);
        const slit1Material = new THREE.MeshStandardMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0
        });
        
        this.slit1 = new THREE.Mesh(slit1Geometry, slit1Material);
        this.slit1.position.set(-slitSeparation/2, 0, -1);
        this.scene.add(this.slit1);
        
        const slit2Geometry = new THREE.BoxGeometry(slitWidth, slitHeight, 0.15);
        const slit2Material = new THREE.MeshStandardMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0
        });
        
        this.slit2 = new THREE.Mesh(slit2Geometry, slit2Material);
        this.slit2.position.set(slitSeparation/2, 0, -1);
        this.scene.add(this.slit2);
        
        // Create detection screen
        const screenGeometry = new THREE.PlaneGeometry(4, 2);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.set(0, 0, 1.5);
        this.scene.add(this.screen);
        
        // Create particles for wave mode
        const waveMode = new THREE.Group();
        this.scene.add(waveMode);
        
        // Create wave pattern
        const patternWidth = 3;
        const patternHeight = 1.5;
        const patternResolution = 50;
        
        const patternGeometry = new THREE.BufferGeometry();
        const patternPositions = [];
        
        for (let i = 0; i < patternResolution; i++) {
            for (let j = 0; j < patternResolution; j++) {
                const x = (i / patternResolution - 0.5) * patternWidth;
                const y = (j / patternResolution - 0.5) * patternHeight;
                
                // Position on screen
                patternPositions.push(x, y, 1.49);
            }
        }
        
        patternGeometry.setAttribute('position', new THREE.Float32BufferAttribute(patternPositions, 3));
        
        const patternMaterial = new THREE.PointsMaterial({
            color: config.animation.waveColor,
            size: config.animation.particleSize * 2,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });
        
        this.wavePattern = new THREE.Points(patternGeometry, patternMaterial);
        waveMode.add(this.wavePattern);
        
        // Create particles for particle mode
        const particleMode = new THREE.Group();
        this.scene.add(particleMode);
        
        // Create individual particles
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = 0;
            particlePositions[i * 3 + 1] = 0;
            particlePositions[i * 3 + 2] = -2;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: config.animation.particleColor,
            size: config.animation.particleSize * 4,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        particleMode.add(this.particles);
        
        // Detector objects
        const detectorGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const detectorMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            transparent: true,
            opacity: 0
        });
        
        this.detector1 = new THREE.Mesh(detectorGeometry, detectorMaterial);
        this.detector1.position.set(-slitSeparation/2, 0, -0.8);
        this.scene.add(this.detector1);
        
        this.detector2 = new THREE.Mesh(detectorGeometry, detectorMaterial);
        this.detector2.position.set(slitSeparation/2, 0, -0.8);
        this.scene.add(this.detector2);
        
        // Animation states
        let state = 'wave';
        let elapsed = 0;
        let particlePositionsOriginal = particlePositions.slice();
        let activeParticles = [];
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'wave') {
                // Show wave pattern
                if (this.wavePattern.material.opacity < 1) {
                    this.wavePattern.material.opacity += 0.01;
                }
                
                // After some time, add measurement
                if (elapsed > 4 && elapsed < 4.1) {
                    state = 'transition';
                    
                    // Show detectors
                    gsap.to(this.detector1.material, {
                        opacity: 0.8,
                        duration: 0.5
                    });
                    
                    gsap.to(this.detector2.material, {
                        opacity: 0.8,
                        duration: 0.5,
                        onComplete: () => {
                            // Fade out wave pattern
                            gsap.to(this.wavePattern.material, {
                                opacity: 0,
                                duration: 0.7,
                                onComplete: () => {
                                    state = 'particle';
                                    
                                    // Start particle animation
                                    this.particles.material.opacity = 1;
                                    activeParticles = [];
                                }
                            });
                        }
                    });
                }
                
                // Animate wave pattern
                const positions = this.wavePattern.geometry.attributes.position.array;
                for (let i = 0; i < positions.length / 3; i++) {
                    const x = positions[i * 3];
                    const y = positions[i * 3 + 1];
                    
                    // Calculate interference pattern
                    const dist1 = Math.sqrt(Math.pow(x - (-slitSeparation/2), 2) + Math.pow(y, 2));
                    const dist2 = Math.sqrt(Math.pow(x - (slitSeparation/2), 2) + Math.pow(y, 2));
                    
                    const phase = (dist1 - dist2) * 10;
                    const intensity = Math.pow(Math.cos(phase), 2);
                    
                    // Set z based on intensity
                    positions[i * 3 + 2] = 1.49 + intensity * 0.04 * Math.sin(elapsed * 3);
                }
                
                this.wavePattern.geometry.attributes.position.needsUpdate = true;
                
            } else if (state === 'particle') {
                // Send particles through slits
                if (Math.random() < 0.1 && activeParticles.length < 20) {
                    const particleIndex = Math.floor(Math.random() * particleCount);
                    if (!activeParticles.includes(particleIndex)) {
                        activeParticles.push(particleIndex);
                        
                        // Choose which slit to go through
                        const useSlit1 = Math.random() < 0.5;
                        const slitX = useSlit1 ? -slitSeparation/2 : slitSeparation/2;
                        
                        // Final position on screen - no interference pattern
                        const screenX = slitX + (Math.random() - 0.5) * 0.6;
                        const screenY = (Math.random() - 0.5) * 1;
                        
                        // Animate particle through a slit to the screen
                        gsap.to(particlePositions, {
                            [particleIndex * 3]: slitX,
                            [particleIndex * 3 + 1]: 0,
                            [particleIndex * 3 + 2]: -0.9,
                            duration: 0.7,
                            onComplete: () => {
                                gsap.to(particlePositions, {
                                    [particleIndex * 3]: screenX,
                                    [particleIndex * 3 + 1]: screenY,
                                    [particleIndex * 3 + 2]: 1.45,
                                    duration: 1,
                                    onComplete: () => {
                                        // Reset particle
                                        setTimeout(() => {
                                            particlePositions[particleIndex * 3] = particlePositionsOriginal[particleIndex * 3];
                                            particlePositions[particleIndex * 3 + 1] = particlePositionsOriginal[particleIndex * 3 + 1];
                                            particlePositions[particleIndex * 3 + 2] = particlePositionsOriginal[particleIndex * 3 + 2];
                                            
                                            // Remove from active list
                                            activeParticles = activeParticles.filter(i => i !== particleIndex);
                                            
                                            this.particles.geometry.attributes.position.needsUpdate = true;
                                        }, 1000);
                                    }
                                });
                            }
                        });
                    }
                }
                
                this.particles.geometry.attributes.position.needsUpdate = true;
                
                // After some time, reset to wave state
                if (elapsed > 12) {
                    state = 'resetting';
                    
                    // Hide detectors
                    gsap.to(this.detector1.material, {
                        opacity: 0,
                        duration: 0.5
                    });
                    
                    gsap.to(this.detector2.material, {
                        opacity: 0,
                        duration: 0.5
                    });
                    
                    // Fade out particles
                    gsap.to(this.particles.material, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            state = 'wave';
                            elapsed = 0;
                        }
                    });
                }
            }
        };
    }
    
    createFieldExcitationAnimation() {
        // Create a grid representing a field
        const gridSize = 15;
        const spacing = 0.25;
        const fieldPoints = [];
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = (i - gridSize/2) * spacing;
                const z = (j - gridSize/2) * spacing;
                fieldPoints.push(new THREE.Vector3(x, 0, z));
            }
        }
        
        // Create grid of small spheres
        const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.particleColor,
            emissive: config.animation.particleColor,
            emissiveIntensity: 0.3
        });
        
        this.fieldParticles = new THREE.Group();
        this.scene.add(this.fieldParticles);
        
        for (let i = 0; i < fieldPoints.length; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(fieldPoints[i]);
            this.fieldParticles.add(particle);
            particle.userData = {
                basePosition: fieldPoints[i].clone(),
                phase: Math.random() * Math.PI * 2
            };
        }
        
        // Create lines connecting the particles
        const lineMaterial = new THREE.LineBasicMaterial({
            color: config.animation.particleColor,
            transparent: true,
            opacity: 0.2
        });
        
        this.gridLines = new THREE.Group();
        this.scene.add(this.gridLines);
        
        // Create horizontal lines
        for (let i = 0; i < gridSize; i++) {
            const pointsArray = [];
            for (let j = 0; j < gridSize; j++) {
                const index = i * gridSize + j;
                pointsArray.push(fieldPoints[index].clone());
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(pointsArray);
            const line = new THREE.Line(geometry, lineMaterial);
            this.gridLines.add(line);
        }
        
        // Create vertical lines
        for (let j = 0; j < gridSize; j++) {
            const pointsArray = [];
            for (let i = 0; i < gridSize; i++) {
                const index = i * gridSize + j;
                pointsArray.push(fieldPoints[index].clone());
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(pointsArray);
            const line = new THREE.Line(geometry, lineMaterial);
            this.gridLines.add(line);
        }
        
        // Create an excitation particle
        const excitationGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const excitationMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            emissive: config.animation.measurementColor,
            emissiveIntensity: 0.5
        });
        
        this.excitation = new THREE.Mesh(excitationGeometry, excitationMaterial);
        this.excitation.position.set(0, 0.5, 0);
        this.excitation.scale.set(0, 0, 0);
        this.scene.add(this.excitation);
        
        // Add explanatory labels for verse 7
        this.createTextLabel("All particles follow the same rules", new THREE.Vector3(0, 1.5, 0), 0.5);
        this.createTextLabel("Field Excitations", new THREE.Vector3(0, -1.5, 0), 1);
        this.createTextLabel("Uniformity in dependent origination", new THREE.Vector3(0, 2, 0), 1.5);
        
        // Animation states
        let state = 'idle';
        let elapsed = 0;
        let center = new THREE.Vector3();
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'idle') {
                // Small ambient motion in the field
                for (let i = 0; i < this.fieldParticles.children.length; i++) {
                    const particle = this.fieldParticles.children[i];
                    const base = particle.userData.basePosition;
                    const phase = particle.userData.phase;
                    
                    particle.position.y = base.y + Math.sin(elapsed + phase) * 0.02;
                }
                
                // Update line positions
                this.updateGridLines();
                
                // After some time, trigger excitation
                if (elapsed > 3 && elapsed < 3.1) {
                    state = 'excitation';
                    
                    // Show excitation particle
                    gsap.to(this.excitation.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.5
                    });
                    
                    // Move it down to the field
                    gsap.to(this.excitation.position, {
                        y: 0,
                        duration: 1,
                        ease: "bounce.out",
                        onComplete: () => {
                            // Create ripple effect
                            center = new THREE.Vector3(0, 0, 0);
                        }
                    });
                }
            } else if (state === 'excitation') {
                // Create ripple effect from excitation center
                const waveTime = elapsed - 4;
                const waveSpeed = 1; // Speed of propagation
                const waveAmplitude = 0.2; // Max height of wave
                const waveFalloff = 0.5; // How quickly it falls off with distance
                
                for (let i = 0; i < this.fieldParticles.children.length; i++) {
                    const particle = this.fieldParticles.children[i];
                    const base = particle.userData.basePosition;
                    
                    // Calculate distance from excitation center
                    const dist = base.distanceTo(center);
                    
                    // Calculate wave effect based on distance and time
                    const waveEffect = Math.sin(waveTime * 5 - dist * 5) * 
                                     Math.exp(-dist * waveFalloff) * 
                                     waveAmplitude;
                    
                    // Apply wave effect
                    particle.position.y = base.y + waveEffect;
                }
                
                // Update line positions
                this.updateGridLines();
                
                // Hide excitation particle gradually
                if (waveTime > 1) {
                    this.excitation.scale.set(
                        Math.max(0, this.excitation.scale.x - 0.01),
                        Math.max(0, this.excitation.scale.y - 0.01),
                        Math.max(0, this.excitation.scale.z - 0.01)
                    );
                }
                
                // After some time, reset
                if (elapsed > 9) {
                    state = 'resetting';
                    
                    // Reset all particles gradually
                    gsap.to(this.excitation.scale, {
                        x: 0, y: 0, z: 0,
                        duration: 0.5
                    });
                    
                    gsap.to(this.excitation.position, {
                        y: 0.5,
                        duration: 0.5,
                        onComplete: () => {
                            state = 'idle';
                            elapsed = 0;
                        }
                    });
                }
            }
        };
    }
    
    updateGridLines() {
        // Update all the grid lines based on particle positions
        const gridSize = Math.sqrt(this.fieldParticles.children.length);
        
        // Update horizontal lines
        for (let i = 0; i < gridSize; i++) {
            const lineIndex = i;
            const line = this.gridLines.children[lineIndex];
            const positions = line.geometry.attributes.position.array;
            
            for (let j = 0; j < gridSize; j++) {
                const particleIndex = i * gridSize + j;
                const particle = this.fieldParticles.children[particleIndex];
                
                positions[j * 3] = particle.position.x;
                positions[j * 3 + 1] = particle.position.y;
                positions[j * 3 + 2] = particle.position.z;
            }
            
            line.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update vertical lines
        for (let j = 0; j < gridSize; j++) {
            const lineIndex = gridSize + j;
            const line = this.gridLines.children[lineIndex];
            const positions = line.geometry.attributes.position.array;
            
            for (let i = 0; i < gridSize; i++) {
                const particleIndex = i * gridSize + j;
                const particle = this.fieldParticles.children[particleIndex];
                
                positions[i * 3] = particle.position.x;
                positions[i * 3 + 1] = particle.position.y;
                positions[i * 3 + 2] = particle.position.z;
            }
            
            line.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    createSchrodingerCatAnimation() {
        // Create box (representing the cat's box)
        const boxGeometry = new THREE.BoxGeometry(2, 1, 1.5);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x8d6e63,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(this.box);
        
        // Create superposition indicator (wavey surface inside box)
        const superpositionGeometry = new THREE.PlaneGeometry(1.8, 1.3, 20, 20);
        const superpositionMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.waveColor,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        this.superposition = new THREE.Mesh(superpositionGeometry, superpositionMaterial);
        this.superposition.rotation.x = Math.PI / 2;
        this.superposition.position.y = -0.45;
        this.box.add(this.superposition);
        
        // Create cat states (alive and dead representations)
        const catAliveGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const catAliveMaterial = new THREE.MeshStandardMaterial({
            color: 0x4caf50,
            emissive: 0x4caf50,
            emissiveIntensity: 0.5
        });
        
        this.catAlive = new THREE.Mesh(catAliveGeometry, catAliveMaterial);
        this.catAlive.position.set(-0.4, -0.3, 0);
        this.catAlive.scale.set(0, 0, 0);
        this.box.add(this.catAlive);
        
        const catDeadGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const catDeadMaterial = new THREE.MeshStandardMaterial({
            color: 0xf44336,
            emissive: 0xf44336,
            emissiveIntensity: 0.5
        });
        
        this.catDead = new THREE.Mesh(catDeadGeometry, catDeadMaterial);
        this.catDead.position.set(0.4, -0.3, 0);
        this.catDead.scale.set(0, 0, 0);
        this.box.add(this.catDead);
        
        // Create observer/measurement
        const observerGeometry = new THREE.ConeGeometry(0.3, 0.7, 16);
        const observerMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            emissive: config.animation.measurementColor,
            emissiveIntensity: 0.3
        });
        
        this.observer = new THREE.Mesh(observerGeometry, observerMaterial);
        this.observer.position.set(0, 0, 2);
        this.observer.rotation.x = Math.PI / 2;
        this.observer.scale.set(0, 0, 0);
        this.scene.add(this.observer);
        
        // Add explanatory labels for verse 8
        this.createTextLabel("Objection to emptiness", new THREE.Vector3(0, 1.5, 0), 0.5);
        this.createTextLabel("Paradox resolved by quantum principles", new THREE.Vector3(0, 2, 0), 1);
        
        // Animation states
        let state = 'superposition';
        let elapsed = 0;
        
        // Animate the superposition plane
        this.updateSuperpositionWave = (time) => {
            const positions = this.superposition.geometry.attributes.position.array;
            const amp = 0.05;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                positions[i + 1] = Math.sin(x * 10 + time * 3) * Math.cos(z * 10 + time * 2) * amp;
            }
            
            this.superposition.geometry.attributes.position.needsUpdate = true;
        };
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'superposition') {
                // Animate the wave function inside the box
                this.updateSuperpositionWave(elapsed);
                
                // After some time, trigger measurement
                if (elapsed > 4 && elapsed < 4.1) {
                    state = 'measuring';
                    
                    // Show observer
                    gsap.to(this.observer.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.5
                    });
                    
                    // Move observer to the box
                    gsap.to(this.observer.position, {
                        z: 1,
                        duration: 1.5,
                        ease: "power2.inOut",
                        onComplete: () => {
                            // Collapse to either alive or dead state (randomly)
                            const aliveState = Math.random() < 0.5;
                            
                            // Hide superposition
                            gsap.to(this.superposition.material, {
                                opacity: 0,
                                duration: 0.5
                            });
                            
                            if (aliveState) {
                                // Show alive cat
                                gsap.to(this.catAlive.scale, {
                                    x: 1, y: 1, z: 1,
                                    duration: 0.5
                                });
                            } else {
                                // Show dead cat
                                gsap.to(this.catDead.scale, {
                                    x: 1, y: 1, z: 1,
                                    duration: 0.5
                                });
                            }
                            
                            state = 'collapsed';
                        }
                    });
                }
            } else if (state === 'collapsed' && elapsed > 8) {
                state = 'resetting';
                
                // Move observer away
                gsap.to(this.observer.position, {
                    z: 2,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                gsap.to(this.observer.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5
                });
                
                // Hide cat states
                gsap.to(this.catAlive.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5
                });
                
                gsap.to(this.catDead.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 0.5
                });
                
                // Show superposition again
                gsap.to(this.superposition.material, {
                    opacity: 0.7,
                    duration: 0.5,
                    onComplete: () => {
                        state = 'superposition';
                        elapsed = 0;
                    }
                });
            }
        };
    }
    
    createSchrodingerCatResolvedAnimation() {
        // Create essentially the same as the previous animation but with a clearer resolution
        // showing how quantum understanding resolves the paradox
        
        // Create box (representing the cat's box)
        const boxGeometry = new THREE.BoxGeometry(2, 1, 1.5);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x8d6e63,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(this.box);
        
        // Create superposition indicator (wavey surface inside box)
        const superpositionGeometry = new THREE.PlaneGeometry(1.8, 1.3, 20, 20);
        const superpositionMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.waveColor,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        this.superposition = new THREE.Mesh(superpositionGeometry, superpositionMaterial);
        this.superposition.rotation.x = Math.PI / 2;
        this.superposition.position.y = -0.45;
        this.box.add(this.superposition);
        
        // Create cat states (alive and dead representations)
        const catAliveGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const catAliveMaterial = new THREE.MeshStandardMaterial({
            color: 0x4caf50,
            emissive: 0x4caf50,
            emissiveIntensity: 0.5
        });
        
        this.catAlive = new THREE.Mesh(catAliveGeometry, catAliveMaterial);
        this.catAlive.position.set(-0.4, -0.3, 0);
        this.catAlive.scale.set(0, 0, 0);
        this.box.add(this.catAlive);
        
        const catDeadGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const catDeadMaterial = new THREE.MeshStandardMaterial({
            color: 0xf44336,
            emissive: 0xf44336,
            emissiveIntensity: 0.5
        });
        
        this.catDead = new THREE.Mesh(catDeadGeometry, catDeadMaterial);
        this.catDead.position.set(0.4, -0.3, 0);
        this.catDead.scale.set(0, 0, 0);
        this.box.add(this.catDead);
        
        // Create observer/measurement
        const observerGeometry = new THREE.ConeGeometry(0.3, 0.7, 16);
        const observerMaterial = new THREE.MeshStandardMaterial({
            color: config.animation.measurementColor,
            emissive: config.animation.measurementColor,
            emissiveIntensity: 0.3
        });
        
        this.observer = new THREE.Mesh(observerGeometry, observerMaterial);
        this.observer.position.set(0, 0, 2);
        this.observer.rotation.x = Math.PI / 2;
        this.observer.scale.set(0, 0, 0);
        this.scene.add(this.observer);
        
        // Create "resolution" effect - a quantum field that shows understanding
        const resolutionGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const resolutionMaterial = new THREE.MeshStandardMaterial({
            color: 0x6c63ff,
            emissive: 0x6c63ff,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0,
            wireframe: true
        });
        
        this.resolution = new THREE.Mesh(resolutionGeometry, resolutionMaterial);
        this.scene.add(this.resolution);
        
        // Add explanatory labels for verse 9
        this.createTextLabel("Faults with emptiness", new THREE.Vector3(-1.5, 1.8, 0), 0.5);
        this.createTextLabel("Classical intuition fails", new THREE.Vector3(1.5, 1.8, 0), 1);
        this.createTextLabel("Understanding resolves apparent faults", new THREE.Vector3(0, 2.2, 0), 2);
        
        // Animation states
        let state = 'superposition';
        let elapsed = 0;
        
        // Animate the superposition plane
        this.updateSuperpositionWave = (time) => {
            const positions = this.superposition.geometry.attributes.position.array;
            const amp = 0.05;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                positions[i + 1] = Math.sin(x * 10 + time * 3) * Math.cos(z * 10 + time * 2) * amp;
            }
            
            this.superposition.geometry.attributes.position.needsUpdate = true;
        };
        
        // Animation loop
        this.animation = (time) => {
            elapsed = time * 0.001;
            
            if (state === 'superposition') {
                // Animate the wave function inside the box
                this.updateSuperpositionWave(elapsed);
                
                // After some time, trigger measurement
                if (elapsed > 4 && elapsed < 4.1) {
                    state = 'measuring';
                    
                    // Show observer
                    gsap.to(this.observer.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.5
                    });
                    
                    // Move observer to the box
                    gsap.to(this.observer.position, {
                        z: 1,
                        duration: 1.5,
                        ease: "power2.inOut",
                        onComplete: () => {
                            // Collapse to either alive or dead state (randomly)
                            const aliveState = Math.random() < 0.5;
                            
                            // Hide superposition
                            gsap.to(this.superposition.material, {
                                opacity: 0,
                                duration: 0.5
                            });
                            
                            if (aliveState) {
                                // Show alive cat
                                gsap.to(this.catAlive.scale, {
                                    x: 1, y: 1, z: 1,
                                    duration: 0.5
                                });
                            } else {
                                // Show dead cat
                                gsap.to(this.catDead.scale, {
                                    x: 1, y: 1, z: 1,
                                    duration: 0.5
                                });
                            }
                            
                            state = 'collapsed';
                        }
                    });
                }
            } else if (state === 'collapsed' && elapsed > 7) {
                state = 'resolving';
                
                // Show resolution effect
                gsap.to(this.resolution.material, {
                    opacity: 0.7,
                    duration: 1
                });
                
                // Animate resolution field
                gsap.to(this.resolution.scale, {
                    x: 1.1, y: 1.1, z: 1.1,
                    duration: 1.5,
                    repeat: 3,
                    yoyo: true
                });
                
                // After some time, reset
                setTimeout(() => {
                    state = 'resetting';
                    
                    // Hide resolution
                    gsap.to(this.resolution.material, {
                        opacity: 0,
                        duration: 1
                    });
                    
                    // Move observer away
                    gsap.to(this.observer.position, {
                        z: 2,
                        duration: 1,
                        ease: "power2.inOut"
                    });
                    
                    gsap.to(this.observer.scale, {
                        x: 0, y: 0, z: 0,
                        duration: 0.5
                    });
                    
                    // Hide cat states
                    gsap.to(this.catAlive.scale, {
                        x: 0, y: 0, z: 0,
                        duration: 0.5
                    });
                    
                    gsap.to(this.catDead.scale, {
                        x: 0, y: 0, z: 0,
                        duration: 0.5
                    });
                    
                    // Show superposition again
                    gsap.to(this.superposition.material, {
                        opacity: 0.7,
                        duration: 0.5,
                        onComplete: () => {
                            state = 'superposition';
                            elapsed = 0;
                        }
                    });
                }, 4000);
            }
        };
    }
    
    createDefaultAnimation() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: config.animation.particleColor,
            roughness: 0.4,
            metalness: 0.6
        });
        
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
        
        this.animation = (time) => {
            const t = time * 0.001;
            this.sphere.rotation.x = t * 0.5;
            this.sphere.rotation.y = t * 0.3;
        };
    }
    
    animate(time) {
        requestAnimationFrame(this.animate.bind(this));
        
        // Animate stars slowly
        if (this.stars) {
            this.stars.rotation.y += 0.0001;
            this.stars.rotation.x += 0.00005;
        }
        
        // Call the current animation function
        if (this.animation) {
            this.animation(time);
        }
        
        // Update controls
        if (this.controls && this.interactive) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
        
        // Render CSS2D labels if available
        if (this.labelRenderer) {
            this.labelRenderer.render(this.scene, this.camera);
        }
    }
    
    start(labelRenderer) {
        this.labelRenderer = labelRenderer;
        this.animate(0);
    }
}

export { AnimationEngine };