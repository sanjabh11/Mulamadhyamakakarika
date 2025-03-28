import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses, animationSettings } from './config.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import gsap from 'gsap';

// Main class to handle visualization and interaction
class VerseVisualizer {
    constructor() {
        this.currentVerseIndex = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.composer = null;
        this.sceneObjects = [];
        this.particles = null;
        this.animations = {};
        this.animationState = {};
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactiveObjects = [];
        
        this.init();
    }
    
    init() {
        this.setupThreeJS();
        this.setupEventListeners();
        this.updateVerseInfo();
        this.setupAnimation(verses[this.currentVerseIndex].number);
        this.animate();
    }
    
    setupThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(animationSettings.backgroundColor);
        
        // Add subtle fog for depth
        this.scene.fog = new THREE.FogExp2(animationSettings.backgroundColor, 0.035);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = animationSettings.cameraDistance;
        
        // Renderer setup with improved antialiasing
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.getElementById('sceneContainer').appendChild(this.renderer.domElement);
        
        // Controls setup with damping and boundaries
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 20;
        this.controls.minDistance = 2;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        // Post-processing with improved settings
        this.setupPostProcessing();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.bias = -0.0001;
        this.scene.add(directionalLight);
        
        // Add point light for highlights
        const pointLight = new THREE.PointLight(0x3a86ff, 1, 10);
        pointLight.position.set(-2, 1, 2);
        this.scene.add(pointLight);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Add mouse move event for interactive objects
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', (event) => this.onMouseClick(event));
    }
    
    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add outline pass for highlighting interactive objects
        const outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene, 
            this.camera
        );
        outlinePass.edgeStrength = 3;
        outlinePass.edgeGlow = 0.5;
        outlinePass.edgeThickness = 1;
        outlinePass.pulsePeriod = 2;
        outlinePass.visibleEdgeColor.set(0x3a86ff);
        outlinePass.hiddenEdgeColor.set(0x190a05);
        this.composer.addPass(outlinePass);
        this.outlinePass = outlinePass;
        
        // Improved bloom settings
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.0, // strength
            0.3, // radius
            0.9  // threshold
        );
        this.composer.addPass(bloomPass);
        
        // Add antialiasing pass
        const fxaaPass = new ShaderPass(FXAAShader);
        const pixelRatio = this.renderer.getPixelRatio();
        fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
        fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
        this.composer.addPass(fxaaPass);
        this.fxaaPass = fxaaPass;
    }
    
    setupEventListeners() {
        document.getElementById('toggleInfo').addEventListener('click', () => this.toggleInfoPanel());
        document.getElementById('prevVerse').addEventListener('click', () => this.navigateVerse(-1));
        document.getElementById('nextVerse').addEventListener('click', () => this.navigateVerse(1));
        
        // Add scroll listener for intuitive scrolling in info panel
        const infoPanel = document.getElementById('infoPanel');
        infoPanel.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });
        
        // Add keyboard controls for accessibility
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.navigateVerse(1);
            if (e.key === 'ArrowLeft') this.navigateVerse(-1);
            if (e.key === 'Escape') {
                const infoPanel = document.getElementById('infoPanel');
                if (!infoPanel.classList.contains('infoHidden')) {
                    this.toggleInfoPanel();
                }
            }
        });
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections with interactive objects
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        // Update cursor and highlight based on intersections
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
            this.outlinePass.selectedObjects = [intersects[0].object];
        } else {
            document.body.style.cursor = 'auto';
            this.outlinePass.selectedObjects = [];
        }
    }
    
    onMouseClick(event) {
        // Ray cast to check for interactions
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.onClick) {
                object.userData.onClick();
            }
        }
    }
    
    toggleInfoPanel() {
        const infoPanel = document.getElementById('infoPanel');
        const toggleBtn = document.getElementById('toggleInfo');
        
        infoPanel.classList.toggle('infoHidden');
        toggleBtn.textContent = infoPanel.classList.contains('infoHidden') ? 'Show Info' : 'Hide Info';
    }
    
    navigateVerse(direction) {
        const newIndex = this.currentVerseIndex + direction;
        
        if (newIndex >= 0 && newIndex < verses.length) {
            this.currentVerseIndex = newIndex;
            this.updateVerseInfo();
            this.clearScene();
            this.setupAnimation(verses[this.currentVerseIndex].number);
        }
    }
    
    updateVerseInfo() {
        const verse = verses[this.currentVerseIndex];
        
        document.getElementById('verseNumber').textContent = verse.number;
        document.getElementById('verseText').textContent = verse.text;
        document.getElementById('madhyamakaConcept').textContent = verse.madhyamaka;
        document.getElementById('quantumPhysics').textContent = verse.quantum;
        document.getElementById('accessibleExplanation').textContent = verse.explanation;
        
        // Update control panel
        this.updateControlPanel(verse.controls);
        
        // Update navigation buttons
        document.getElementById('prevVerse').disabled = this.currentVerseIndex === 0;
        document.getElementById('nextVerse').disabled = this.currentVerseIndex === verses.length - 1;
    }
    
    updateControlPanel(controls) {
        const controlPanel = document.getElementById('controlPanel');
        controlPanel.innerHTML = '';
        
        controls.forEach(control => {
            if (control.type === 'button') {
                const button = document.createElement('button');
                button.className = 'control-button';
                button.textContent = control.label;
                button.addEventListener('click', () => this.handleControlAction(control.action));
                controlPanel.appendChild(button);
            } 
            else if (control.type === 'slider') {
                const container = document.createElement('div');
                container.className = 'slider-container';
                
                const label = document.createElement('label');
                label.textContent = control.label;
                
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.className = 'slider';
                slider.min = control.min;
                slider.max = control.max;
                slider.step = control.step;
                slider.value = control.value;
                slider.addEventListener('input', (e) => {
                    this.handleControlAction(control.action, parseFloat(e.target.value));
                });
                
                container.appendChild(label);
                container.appendChild(slider);
                controlPanel.appendChild(container);
            }
        });
    }
    
    handleControlAction(action, value) {
        // Route control actions to the appropriate animation functions
        if (typeof this.animations[action] === 'function') {
            this.animations[action](value);
        }
    }
    
    clearScene() {
        // Remove previous animation objects and dispose resources properly
        while(this.sceneObjects.length > 0) {
            const object = this.sceneObjects.pop();
            this.scene.remove(object);
            
            // Properly dispose of geometries and materials to prevent memory leaks
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
            
            // Remove from interactive objects if present
            const index = this.interactiveObjects.indexOf(object);
            if (index !== -1) {
                this.interactiveObjects.splice(index, 1);
            }
        }
        
        // Clear textures and other resources
        THREE.Cache.clear();
        
        // Reset animation state
        this.animations = {};
        this.animationState = {};
        this.interactiveObjects = [];
    }
    
    setupAnimation(verseNumber) {
        switch(verseNumber) {
            case 13: 
                this.setupUncertaintyAnimation();
                break;
            case 14:
                this.setupDelayedChoiceAnimation();
                break;
            case 15:
                this.setupTunnelingAnimation();
                break;
            case 16:
                this.setupDecoherenceAnimation();
                break;
            case 17:
                this.setupAnnihilationAnimation();
                break;
            case 18:
                this.setupQuantumFluctuationsAnimation();
                break;
            case 19:
                this.setupSuperpositionAnimation();
                break;
            case 20:
                this.setupContextualityAnimation();
                break;
            case 21:
                this.setupOperatorsAnimation();
                break;
            case 22:
                this.setupEnergyFluctuationsAnimation();
                break;
            case 23:
                this.setupEmergenceAnimation();
                break;
            case 24:
                this.setupQuantumVacuumAnimation();
                break;
            default:
                this.setupDefaultAnimation();
        }
    }
    
    setupUncertaintyAnimation() {
        // For verse 13: Heisenberg uncertainty principle
        this.animationState = {
            uncertaintyMode: true,
            precision: 0.5,
            particleCount: 1000,
            positions: [],
            velocities: []
        };
        
        // Create particles
        const particleGeometry = new THREE.BufferGeometry();
        const particles = new Float32Array(this.animationState.particleCount * 3);
        const colors = new Float32Array(this.animationState.particleCount * 3);
        
        for (let i = 0; i < this.animationState.particleCount; i++) {
            const i3 = i * 3;
            
            // Position: randomized in a sphere
            const r = 3 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particles[i3] = r * Math.sin(phi) * Math.cos(theta);
            particles[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            particles[i3 + 2] = r * Math.cos(phi);
            
            // Store position and velocity
            this.animationState.positions.push(new THREE.Vector3(
                particles[i3], particles[i3 + 1], particles[i3 + 2]
            ));
            
            // Random velocity
            const vx = (Math.random() - 0.5) * 0.03;
            const vy = (Math.random() - 0.5) * 0.03;
            const vz = (Math.random() - 0.5) * 0.03;
            this.animationState.velocities.push(new THREE.Vector3(vx, vy, vz));
            
            // Color: blueish with precision-dependent saturation
            colors[i3] = 0.2 + Math.random() * 0.1;
            colors[i3 + 1] = 0.4 + Math.random() * 0.2;
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
        this.sceneObjects.push(this.particles);
        
        // Add interactive ring to demonstrate measuring apparatus
        const ringGeometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3a86ff, 
            emissive: 0x3a86ff,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        
        // Make ring interactive
        ring.userData.onClick = () => this.animations.toggleUncertainty();
        this.interactiveObjects.push(ring);
        
        this.scene.add(ring);
        this.sceneObjects.push(ring);
        
        // Add glow effect
        gsap.to(ring.material, {
            emissiveIntensity: 1.2,
            duration: 2,
            repeat: -1,
            yoyo: true
        });
        
        // Add control animations
        this.animations.toggleUncertainty = () => {
            this.animationState.uncertaintyMode = !this.animationState.uncertaintyMode;
            
            gsap.to(this.particles.material, {
                opacity: this.animationState.uncertaintyMode ? 0.8 : 0.3,
                duration: 1
            });
            
            gsap.to(ring.scale, {
                x: this.animationState.uncertaintyMode ? 1 : 3,
                y: this.animationState.uncertaintyMode ? 1 : 3,
                z: this.animationState.uncertaintyMode ? 1 : 3,
                duration: 1
            });
        };
        
        this.animations.setPrecision = (value) => {
            this.animationState.precision = value;
            
            const positions = this.particles.geometry.attributes.position.array;
            const colors = this.particles.geometry.attributes.color.array;
            
            for (let i = 0; i < this.animationState.particleCount; i++) {
                const i3 = i * 3;
                
                // Adjust the spread of particles based on precision
                // High precision = tight position, wide momentum spread
                const spread = 1 - value;
                
                // Update colors based on precision
                colors[i3] = 0.2 + 0.4 * value;     // R increases with precision
                colors[i3 + 1] = 0.4 + 0.2 * spread; // G increases with spread
                colors[i3 + 2] = 0.8;                // B constant
            }
            
            this.particles.geometry.attributes.color.needsUpdate = true;
            this.particles.material.size = 0.03 + value * 0.05;
        };
    }
    
    setupDelayedChoiceAnimation() {
        // For verse 14: Delayed choice experiment
        this.animationState = {
            pathChosen: false,
            experimentState: 'initial',
            photons: []
        };
        
        // Setup double-slit experiment
        // 1. Create barrier with slits
        const barrierGeometry = new THREE.BoxGeometry(4, 3, 0.1);
        const barrierMaterial = new THREE.MeshStandardMaterial({
            color: 0x8338ec,
            transparent: true,
            opacity: 0.7
        });
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        barrier.position.z = -1;
        this.scene.add(barrier);
        this.sceneObjects.push(barrier);
        
        // Create holes in the barrier using boolean operations
        const slit1Geometry = new THREE.BoxGeometry(0.3, 2, 0.3);
        const slit1 = new THREE.Mesh(slit1Geometry);
        slit1.position.set(-0.5, 0, -1);
        
        const slit2Geometry = new THREE.BoxGeometry(0.3, 2, 0.3);
        const slit2 = new THREE.Mesh(slit2Geometry);
        slit2.position.set(0.5, 0, -1);
        
        // Create the slits by making them visible
        const slitMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        
        const visibleSlit1 = new THREE.Mesh(slit1Geometry, slitMaterial);
        visibleSlit1.position.copy(slit1.position);
        this.scene.add(visibleSlit1);
        this.sceneObjects.push(visibleSlit1);
        
        const visibleSlit2 = new THREE.Mesh(slit2Geometry, slitMaterial);
        visibleSlit2.position.copy(slit2.position);
        this.scene.add(visibleSlit2);
        this.sceneObjects.push(visibleSlit2);
        
        // Make slits interactive
        visibleSlit1.userData.onClick = () => this.animations.makeChoice();
        visibleSlit2.userData.onClick = () => this.animations.makeChoice();
        this.interactiveObjects.push(visibleSlit1, visibleSlit2);
        
        // Add pulsing glow to slits
        gsap.to(visibleSlit1.material, {
            emissiveIntensity: 0.8,
            duration: 1.5,
            repeat: -1,
            yoyo: true
        });
        
        gsap.to(visibleSlit2.material, {
            emissiveIntensity: 0.8,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            delay: 0.5
        });
        
        // 2. Create detector screen
        const screenGeometry = new THREE.PlaneGeometry(6, 4);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x001233,
            side: THREE.DoubleSide,
            emissive: 0x001233,
            transparent: true,
            opacity: 0.7
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = -4;
        this.scene.add(screen);
        this.sceneObjects.push(screen);
        
        // 3. Create initial photon wave pattern (interference pattern)
        this.createInterferencePattern();
        
        // Add control animations
        this.animations.makeChoice = () => {
            this.animationState.pathChosen = true;
            this.clearPhotons();
            
            // Create detector at one slit
            const detectorGeometry = new THREE.SphereGeometry(0.2, 32, 32);
            const detectorMaterial = new THREE.MeshStandardMaterial({
                color: 0xff5555,
                emissive: 0xff5555,
                emissiveIntensity: 0.8
            });
            const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
            detector.position.set(0.5, 0, -1); // Position at slit 2
            this.scene.add(detector);
            this.sceneObjects.push(detector);
            
            // Now show individual photons instead of wave pattern
            setTimeout(() => {
                this.createPhotonParticles();
            }, 500);
        };
        
        this.animations.resetExperiment = () => {
            this.animationState.pathChosen = false;
            this.clearPhotons();
            
            // Remove the detector if it exists
            for (let i = 0; i < this.sceneObjects.length; i++) {
                if (this.sceneObjects[i].position.x === 0.5 && 
                    this.sceneObjects[i].position.y === 0 && 
                    this.sceneObjects[i].position.z === -1) {
                    this.scene.remove(this.sceneObjects[i]);
                    this.sceneObjects.splice(i, 1);
                    break;
                }
            }
            
            // Recreate interference pattern
            this.createInterferencePattern();
        };
    }
    
    createInterferencePattern() {
        // Create wave pattern on screen
        const patternGeometry = new THREE.PlaneGeometry(5.5, 3.5, 50, 50);
        const vertices = patternGeometry.attributes.position.array;
        
        // Create interference pattern
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i+1];
            
            // Calculate distance from each slit
            const d1 = Math.sqrt(Math.pow(x - (-0.5), 2) + Math.pow(y, 2) + Math.pow(3, 2));
            const d2 = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y, 2) + Math.pow(3, 2));
            
            // Create interference based on path difference
            const pathDiff = d2 - d1;
            const wavelength = 0.2;
            const amplitude = 0.1;
            
            vertices[i+2] = amplitude * Math.cos(2 * Math.PI * pathDiff / wavelength);
        }
        
        patternGeometry.attributes.position.needsUpdate = true;
        patternGeometry.computeVertexNormals();
        
        const patternMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            side: THREE.DoubleSide,
            wireframe: false,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        
        const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
        pattern.position.z = -3.9;
        this.scene.add(pattern);
        this.sceneObjects.push(pattern);
        this.animationState.pattern = pattern;
    }
    
    createPhotonParticles() {
        // Create individual photon impacts on the screen
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position in a pattern that shows which-path information
            // (no interference, just two bands)
            const bandChoice = Math.random() > 0.5 ? -0.5 : 0.5;
            positions[i3] = bandChoice + (Math.random() - 0.5) * 0.8;
            positions[i3+1] = (Math.random() - 0.5) * 3;
            positions[i3+2] = -3.9 + (Math.random() - 0.5) * 0.1;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x3a86ff,
            size: 0.05,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.sceneObjects.push(particles);
        this.animationState.photons.push(particles);
    }
    
    clearPhotons() {
        // Clear existing photon patterns
        while (this.animationState.photons.length > 0) {
            const photon = this.animationState.photons.pop();
            this.scene.remove(photon);
            
            // Remove from sceneObjects too
            const index = this.sceneObjects.indexOf(photon);
            if (index !== -1) {
                this.sceneObjects.splice(index, 1);
            }
            
            if (photon.geometry) photon.geometry.dispose();
            if (photon.material) photon.material.dispose();
        }
    }
    
    setupTunnelingAnimation() {
        // For verse 15: Quantum tunneling
        this.animationState = {
            mode: 'classical',
            barrierHeight: 0.5,
            particles: []
        };
        
        // Create barrier
        const barrierGeometry = new THREE.BoxGeometry(1, 2, 0.5);
        const barrierMaterial = new THREE.MeshStandardMaterial({
            color: 0x8338ec,
            transparent: true,
            opacity: 0.8
        });
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        barrier.position.z = 0;
        this.scene.add(barrier);
        this.sceneObjects.push(barrier);
        
        // Create classical particle
        const classicalGeometry = new THREE.SphereGeometry(0.2, 32, 16);
        const classicalMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5555,
            emissive: 0xff5555,
            emissiveIntensity: 0.5
        });
        const classicalParticle = new THREE.Mesh(classicalGeometry, classicalMaterial);
        classicalParticle.position.set(-3, 0, 0);
        this.scene.add(classicalParticle);
        this.sceneObjects.push(classicalParticle);
        this.animationState.classicalParticle = classicalParticle;
        
        // Create quantum wave packet
        const waveGeometry = new THREE.SphereGeometry(0.3, 32, 16);
        const waveMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.6
        });
        const wavePacket = new THREE.Mesh(waveGeometry, waveMaterial);
        wavePacket.position.set(-3, 0, 0);
        this.scene.add(wavePacket);
        this.sceneObjects.push(wavePacket);
        this.animationState.wavePacket = wavePacket;
        
        // Add control animations
        this.animations.setClassicalMode = () => {
            this.animationState.mode = 'classical';
            classicalParticle.material.opacity = 1;
            wavePacket.material.opacity = 0.2;
            
            // Reset positions
            classicalParticle.position.set(-3, 0, 0);
            wavePacket.position.set(-3, 0, 0);
        };
        
        this.animations.setQuantumMode = () => {
            this.animationState.mode = 'quantum';
            classicalParticle.material.opacity = 0.2;
            wavePacket.material.opacity = 0.8;
            
            // Reset positions
            classicalParticle.position.set(-3, 0, 0);
            wavePacket.position.set(-3, 0, 0);
        };
        
        this.animations.setBarrierHeight = (value) => {
            this.animationState.barrierHeight = value;
            barrier.scale.y = 1 + value;
            barrier.material.opacity = 0.3 + value * 0.7;
        };
        
        // Create animation timeline for particles
        this.animateTunneling();
    }
    
    animateTunneling() {
        const { classicalParticle, wavePacket } = this.animationState;
        
        // Animate classical particle bouncing off barrier
        gsap.to(classicalParticle.position, {
            x: -0.7,
            duration: 2,
            ease: "power1.inOut",
            onComplete: () => {
                // Bounce back
                gsap.to(classicalParticle.position, {
                    x: -3,
                    duration: 2,
                    ease: "power1.out",
                    onComplete: () => {
                        // Repeat animation if still in classical mode
                        if (this.animationState.mode === 'classical') {
                            setTimeout(() => this.animateTunneling(), 500);
                        }
                    }
                });
            }
        });
        
        // Animate quantum wave packet tunneling through barrier
        gsap.to(wavePacket.position, {
            x: 0,
            duration: 2,
            ease: "power1.inOut",
            onComplete: () => {
                // Create tunneling effect
                if (this.animationState.mode === 'quantum') {
                    // Split the wave packet
                    const tunnelGeometry = new THREE.SphereGeometry(0.2, 32, 16);
                    const tunnelMaterial = new THREE.MeshStandardMaterial({
                        color: 0x3a86ff,
                        emissive: 0x3a86ff,
                        emissiveIntensity: 0.6,
                        transparent: true,
                        opacity: 0.4 * (1 - this.animationState.barrierHeight)
                    });
                    const tunnelPacket = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
                    tunnelPacket.position.copy(wavePacket.position);
                    this.scene.add(tunnelPacket);
                    this.sceneObjects.push(tunnelPacket);
                    
                    // Animate tunneled part
                    gsap.to(tunnelPacket.position, {
                        x: 3,
                        duration: 2,
                        ease: "power1.out",
                        onComplete: () => {
                            // Remove tunneled packet
                            this.scene.remove(tunnelPacket);
                            const index = this.sceneObjects.indexOf(tunnelPacket);
                            if (index !== -1) this.sceneObjects.splice(index, 1);
                            tunnelPacket.geometry.dispose();
                            tunnelPacket.material.dispose();
                        }
                    });
                    
                    // Animate reflection
                    gsap.to(wavePacket.position, {
                        x: -3,
                        duration: 2,
                        ease: "power1.out",
                        onComplete: () => {
                            // Repeat animation if still in quantum mode
                            if (this.animationState.mode === 'quantum') {
                                setTimeout(() => this.animateTunneling(), 500);
                            }
                        }
                    });
                }
            }
        });
    }
    
    setupDecoherenceAnimation() {
        // For verse 16: Quantum decoherence
        this.animationState = {
            observed: false,
            superpositions: []
        };
        
        // Create superposition of states (spinning tops)
        const colors = [0x3a86ff, 0xff5555, 0x4cb944, 0xffd166];
        
        for (let i = 0; i < 4; i++) {
            // Create top geometry
            const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
            const coneMaterial = new THREE.MeshStandardMaterial({
                color: colors[i],
                emissive: colors[i],
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.7
            });
            
            const top = new THREE.Mesh(coneGeometry, coneMaterial);
            
            // Position in a circle
            const angle = (i / 4) * Math.PI * 2;
            top.position.set(
                Math.cos(angle) * 1.5,
                0,
                Math.sin(angle) * 1.5
            );
            
            // Rotate top to point outward
            top.rotation.x = Math.PI;
            top.rotation.y = angle;
            
            this.scene.add(top);
            this.sceneObjects.push(top);
            this.animationState.superpositions.push(top);
            
            // Create animation for each top
            gsap.to(top.rotation, {
                z: Math.PI * 2,
                duration: 2 + i * 0.5,
                repeat: -1,
                ease: "none"
            });
        }
        
        // Create observer sphere (user interaction)
        const observerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const observerMaterial = new THREE.MeshStandardMaterial({
            color: 0x8338ec,
            emissive: 0x8338ec,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.5
        });
        
        const observer = new THREE.Mesh(observerGeometry, observerMaterial);
        observer.position.set(0, 0, 0);
        
        // Make observer interactive
        observer.userData.onClick = () => this.animations.observeSystem();
        this.interactiveObjects.push(observer);
        
        this.scene.add(observer);
        this.sceneObjects.push(observer);
        
        // Add pulsing glow to observer
        gsap.to(observer.material, {
            emissiveIntensity: 1.0,
            opacity: 0.7,
            duration: 1.5,
            repeat: -1,
            yoyo: true
        });
        
        // Add control animations
        this.animations.observeSystem = () => {
            if (this.animationState.observed) return;
            
            this.animationState.observed = true;
            
            // Randomly select one top to remain
            const selectedIndex = Math.floor(Math.random() * 4);
            
            // Fade out non-selected tops
            for (let i = 0; i < 4; i++) {
                if (i !== selectedIndex) {
                    gsap.to(this.animationState.superpositions[i].material, {
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.out"
                    });
                    
                    gsap.to(this.animationState.superpositions[i].rotation, {
                        z: 0,
                        duration: 3,
                        ease: "power2.out"
                    });
                } else {
                    // Make selected top more vivid
                    gsap.to(this.animationState.superpositions[i].material, {
                        opacity: 1,
                        emissiveIntensity: 0.8,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                    
                    // Slow down but don't stop completely
                    gsap.to(this.animationState.superpositions[i].rotation, {
                        z: Math.PI * 2,
                        duration: 4,
                        repeat: -1,
                        ease: "none"
                    });
                }
            }
            
            // Expand observer
            gsap.to(observer.scale, {
                x: 2,
                y: 2,
                z: 2,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(observer.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 1,
                        ease: "power2.in"
                    });
                }
            });
        };
        
        this.animations.resetSuperposition = () => {
            this.animationState.observed = false;
            
            // Reset all tops
            for (let i = 0; i < 4; i++) {
                gsap.to(this.animationState.superpositions[i].material, {
                    opacity: 0.7,
                    emissiveIntensity: 0.5,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                gsap.to(this.animationState.superpositions[i].rotation, {
                    z: Math.PI * 2,
                    duration: 2 + i * 0.5,
                    repeat: -1,
                    ease: "none"
                });
            }
        };
    }
    
    setupAnnihilationAnimation() {
        // For verse 17: Particle-antiparticle annihilation
        this.animationState = {
            particleCreated: false,
            annihilated: false
        };
        
        // Create particle
        const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(-2, 0, 0);
        this.scene.add(particle);
        this.sceneObjects.push(particle);
        this.animationState.particle = particle;
        
        // Create antiparticle
        const antiparticleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const antiparticleMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5555,
            emissive: 0xff5555,
            emissiveIntensity: 0.7
        });
        
        const antiparticle = new THREE.Mesh(antiparticleGeometry, antiparticleMaterial);
        antiparticle.position.set(2, 0, 0);
        this.scene.add(antiparticle);
        this.sceneObjects.push(antiparticle);
        this.animationState.antiparticle = antiparticle;
        
        // Add control animations
        this.animations.triggerCollision = () => {
            if (this.animationState.annihilated) return;
            
            // Move particles toward each other
            gsap.to(particle.position, {
                x: 0,
                duration: 2,
                ease: "power1.inOut"
            });
            
            gsap.to(antiparticle.position, {
                x: 0,
                duration: 2,
                ease: "power1.inOut",
                onComplete: () => {
                    this.animationState.annihilated = true;
                    
                    // Create energy burst
                    const burstGeometry = new THREE.SphereGeometry(0.1, 32, 32);
                    const burstMaterial = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        emissive: 0xffffff,
                        emissiveIntensity: 1,
                        transparent: true,
                        opacity: 1
                    });
                    
                    const burst = new THREE.Mesh(burstGeometry, burstMaterial);
                    burst.position.set(0, 0, 0);
                    this.scene.add(burst);
                    this.sceneObjects.push(burst);
                    
                    // Hide particles
                    particle.visible = false;
                    antiparticle.visible = false;
                    
                    // Animate energy burst
                    gsap.to(burst.scale, {
                        x: 10,
                        y: 10,
                        z: 10,
                        duration: 1.5,
                        ease: "power2.out"
                    });
                    
                    gsap.to(burst.material, {
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.out",
                        onComplete: () => {
                            // Remove burst
                            this.scene.remove(burst);
                            const index = this.sceneObjects.indexOf(burst);
                            if (index !== -1) this.sceneObjects.splice(index, 1);
                            burst.geometry.dispose();
                            burst.material.dispose();
                        }
                    });
                    
                    // Create energy rays
                    this.createEnergyRays();
                }
            });
        };
        
        this.animations.resetParticles = () => {
            this.animationState.annihilated = false;
            
            // Reset particles
            particle.position.set(-2, 0, 0);
            antiparticle.position.set(2, 0, 0);
            particle.visible = true;
            antiparticle.visible = true;
            
            // Remove any energy rays
            this.sceneObjects.forEach(obj => {
                if (obj.userData.isEnergyRay) {
                    this.scene.remove(obj);
                    obj.geometry.dispose();
                    obj.material.dispose();
                }
            });
            
            this.sceneObjects = this.sceneObjects.filter(obj => !obj.userData.isEnergyRay);
        };
    }
    
    createEnergyRays() {
        const rayCount = 12;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const length = 2 + Math.random() * 1;
            
            const rayGeometry = new THREE.CylinderGeometry(0.05, 0.01, length, 8);
            const rayMaterial = new THREE.MeshStandardMaterial({
                color: 0xffd166,
                emissive: 0xffd166,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.8
            });
            
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.userData.isEnergyRay = true;
            
            // Position and rotate ray
            ray.position.set(
                Math.cos(angle) * length * 0.5,
                Math.sin(angle) * length * 0.5,
                0
            );
            
            ray.rotation.z = angle + Math.PI / 2;
            
            this.scene.add(ray);
            this.sceneObjects.push(ray);
            
            // Animate ray
            gsap.to(ray.scale, {
                x: 0.5,
                y: 1.5,
                z: 0.5,
                duration: 1 + Math.random(),
                ease: "power1.out"
            });
            
            gsap.to(ray.material, {
                opacity: 0,
                duration: 1 + Math.random(),
                delay: 0.5,
                ease: "power1.out"
            });
        }
    }
    
    setupQuantumFluctuationsAnimation() {
        // For verse 18: Quantum fluctuations in vacuum
        this.animationState = {
            energyLevel: 0.5,
            zoom: 1,
            particles: []
        };
        
        // Create background "vacuum"
        const vacuumGeometry = new THREE.SphereGeometry(5, 32, 32);
        const vacuumMaterial = new THREE.MeshStandardMaterial({
            color: 0x001233,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        
        const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
        this.scene.add(vacuum);
        this.sceneObjects.push(vacuum);
        
        // Create initial fluctuations
        this.createFluctuations();
        
        // Add control animations
        this.animations.increaseEnergy = () => {
            this.animationState.energyLevel = Math.min(1, this.animationState.energyLevel + 0.2);
            this.updateFluctuationRate();
        };
        
        this.animations.decreaseEnergy = () => {
            this.animationState.energyLevel = Math.max(0, this.animationState.energyLevel - 0.2);
            this.updateFluctuationRate();
        };
        
        this.animations.setZoom = (value) => {
            this.animationState.zoom = value;
            
            // Adjust camera distance based on zoom
            gsap.to(this.camera.position, {
                z: animationSettings.cameraDistance / value,
                duration: 1,
                ease: "power2.inOut"
            });
        };
    }
    
    createFluctuations() {
        const particleCount = Math.floor(50 + this.animationState.energyLevel * 150);
        
        for (let i = 0; i < particleCount; i++) {
            // Create fluctuation
            this.createFluctuation();
        }
    }
    
    createFluctuation() {
        // Randomize size based on energy
        const size = 0.05 + Math.random() * 0.1 * this.animationState.energyLevel;
        
        // Create geometry for particle pair
        const fluctGeometry = new THREE.SphereGeometry(size, 16, 16);
        
        // Randomize color
        const hue = Math.random();
        let color, anticolor;
        
        if (hue < 0.33) {
            color = 0x3a86ff; // Blue
            anticolor = 0xff5555; // Red
        } else if (hue < 0.66) {
            color = 0x4cb944; // Green
            anticolor = 0xffd166; // Yellow
        } else {
            color = 0x8338ec; // Purple
            anticolor = 0xffbe0b; // Orange
        }
        
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        const antiparticleMaterial = new THREE.MeshStandardMaterial({
            color: anticolor,
            emissive: anticolor,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        // Create particles
        const particle = new THREE.Mesh(fluctGeometry, particleMaterial);
        const antiparticle = new THREE.Mesh(fluctGeometry, antiparticleMaterial);
        
        // Position randomly in sphere
        const radius = 2 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Set initial positions close together
        particle.position.set(x, y, z);
        antiparticle.position.set(x, y, z);
        
        this.scene.add(particle);
        this.scene.add(antiparticle);
        this.sceneObjects.push(particle, antiparticle);
        
        // Store particles
        this.animationState.particles.push({
            particle,
            antiparticle,
            lifetime: 0.5 + Math.random() * 2 * this.animationState.energyLevel,
            currentTime: 0
        });
        
        // Create fluctuation animation
        // Particles move slightly apart then back together
        const distance = 0.1 + Math.random() * 0.3;
        const direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        gsap.to(particle.position, {
            x: x + direction.x * distance,
            y: y + direction.y * distance,
            z: z + direction.z * distance,
            duration: 1,
            ease: "power1.out"
        });
        
        gsap.to(antiparticle.position, {
            x: x - direction.x * distance,
            y: y - direction.y * distance,
            z: z - direction.z * distance,
            duration: 1,
            ease: "power1.out"
        });
    }
    
    updateFluctuations(delta) {
        // Update existing fluctuations
        for (let i = this.animationState.particles.length - 1; i >= 0; i--) {
            const pair = this.animationState.particles[i];
            pair.currentTime += delta;
            
            // Check if lifetime expired
            if (pair.currentTime >= pair.lifetime) {
                // Remove particles
                this.scene.remove(pair.particle);
                this.scene.remove(pair.antiparticle);
                
                // Remove from sceneObjects
                const index1 = this.sceneObjects.indexOf(pair.particle);
                if (index1 !== -1) this.sceneObjects.splice(index1, 1);
                
                const index2 = this.sceneObjects.indexOf(pair.antiparticle);
                if (index2 !== -1) this.sceneObjects.splice(index2, 1);
                
                // Dispose resources
                pair.particle.geometry.dispose();
                pair.particle.material.dispose();
                pair.antiparticle.geometry.dispose();
                pair.antiparticle.material.dispose();
                
                // Remove from particles array
                this.animationState.particles.splice(i, 1);
                
                // Create new fluctuation based on energy level
                if (Math.random() < this.animationState.energyLevel) {
                    this.createFluctuation();
                }
            } else {
                // Update opacity based on lifetime
                const remaining = 1 - (pair.currentTime / pair.lifetime);
                pair.particle.material.opacity = remaining * 0.8;
                pair.antiparticle.material.opacity = remaining * 0.8;
            }
        }
        
        // Randomly create new fluctuations based on energy level
        if (Math.random() < this.animationState.energyLevel * 0.1) {
            this.createFluctuation();
        }
    }
    
    updateFluctuationRate() {
        // Clear existing fluctuations
        while (this.animationState.particles.length > 0) {
            const pair = this.animationState.particles.pop();
            this.scene.remove(pair.particle);
            this.scene.remove(pair.antiparticle);
            
            // Remove from sceneObjects
            const index1 = this.sceneObjects.indexOf(pair.particle);
            if (index1 !== -1) this.sceneObjects.splice(index1, 1);
            
            const index2 = this.sceneObjects.indexOf(pair.antiparticle);
            if (index2 !== -1) this.sceneObjects.splice(index2, 1);
            
            // Dispose resources
            pair.particle.geometry.dispose();
            pair.particle.material.dispose();
            pair.antiparticle.geometry.dispose();
            pair.antiparticle.material.dispose();
        }
        
        // Create new fluctuations
        this.createFluctuations();
    }
    
    setupSuperpositionAnimation() {
        // For verse 19: Quantum superposition in qubits
        this.animationState = {
            rotationAxis: 'z',
            blochSphere: null,
            qubitVector: null
        };
        
        // Create Bloch sphere
        const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x001233,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        const blochSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(blochSphere);
        this.sceneObjects.push(blochSphere);
        this.animationState.blochSphere = blochSphere;
        
        // Add axes
        const axisLength = 2;
        const axisWidth = 0.02;
        
        // Z-axis (|0⟩ to |1⟩)
        const zAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
        const zAxisMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.7
        });
        
        const zAxis = new THREE.Mesh(zAxisGeometry, zAxisMaterial);
        zAxis.rotation.x = Math.PI / 2;
        this.scene.add(zAxis);
        this.sceneObjects.push(zAxis);
        
        // Add labels for |0⟩ and |1⟩
        const label0Geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const label0Material = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.9
        });
        
        const label0 = new THREE.Mesh(label0Geometry, label0Material);
        label0.position.set(0, -axisLength/2, 0);
        this.scene.add(label0);
        this.sceneObjects.push(label0);
        
        const label1Geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const label1Material = new THREE.MeshStandardMaterial({
            color: 0xff5555,
            emissive: 0xff5555,
            emissiveIntensity: 0.9
        });
        
        const label1 = new THREE.Mesh(label1Geometry, label1Material);
        label1.position.set(0, axisLength/2, 0);
        this.scene.add(label1);
        this.sceneObjects.push(label1);
        
        // X-axis
        const xAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
        const xAxisMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5555,
            emissive: 0xff5555,
            emissiveIntensity: 0.7
        });
        
        const xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial);
        xAxis.rotation.z = Math.PI / 2;
        this.scene.add(xAxis);
        this.sceneObjects.push(xAxis);
        
        // Y-axis
        const yAxisGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
        const yAxisMaterial = new THREE.MeshStandardMaterial({
            color: 0x4cb944,
            emissive: 0x4cb944,
            emissiveIntensity: 0.7
        });
        
        const yAxis = new THREE.Mesh(yAxisGeometry, yAxisMaterial);
        this.scene.add(yAxis);
        this.sceneObjects.push(yAxis);
        
        // Create qubit vector
        const vectorGeometry = new THREE.CylinderGeometry(0.05, 0, 1.5, 8);
        const vectorMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd166,
            emissive: 0xffd166,
            emissiveIntensity: 0.9
        });
        
        const qubitVector = new THREE.Mesh(vectorGeometry, vectorMaterial);
        qubitVector.position.set(0, 0, 0);
        this.scene.add(qubitVector);
        this.sceneObjects.push(qubitVector);
        this.animationState.qubitVector = qubitVector;
        
        // Set initial position (|0⟩ + |1⟩)/√2
        qubitVector.rotation.x = Math.PI / 2;
        qubitVector.rotation.z = Math.PI / 4;
        
        // Add control animations
        this.animations.rotateX = () => {
            this.animationState.rotationAxis = 'x';
            gsap.to(qubitVector.rotation, {
                z: qubitVector.rotation.z + Math.PI / 2,
                duration: 1,
                ease: "power2.inOut"
            });
        };
        
        this.animations.rotateY = () => {
            this.animationState.rotationAxis = 'y';
            gsap.to(qubitVector.rotation, {
                x: qubitVector.rotation.x + Math.PI / 2,
                duration: 1,
                ease: "power2.inOut"
            });
        };
        
        this.animations.rotateZ = () => {
            this.animationState.rotationAxis = 'z';
            gsap.to(qubitVector.rotation, {
                z: qubitVector.rotation.z - Math.PI / 2,
                duration: 1,
                ease: "power2.inOut"
            });
        };
    }
    
    setupContextualityAnimation() {
        // For verse 20: Quantum contextuality
        this.animationState = {
            currentContext: 'none',
            measured: false,
            particle: null,
            contextA: null,
            contextB: null
        };
        
        // Create central particle
        const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd166,
            emissive: 0xffd166,
            emissiveIntensity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.scene.add(particle);
        this.sceneObjects.push(particle);
        this.animationState.particle = particle;
        
        // Create context A apparatus (red)
        const contextAGeometry = new THREE.TorusGeometry(1, 0.05, 16, 100);
        const contextAMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5555,
            emissive: 0xff5555,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.5
        });
        
        const contextA = new THREE.Mesh(contextAGeometry, contextAMaterial);
        contextA.rotation.x = Math.PI / 2;
        this.scene.add(contextA);
        this.sceneObjects.push(contextA);
        this.animationState.contextA = contextA;
        
        // Create context B apparatus (blue)
        const contextBGeometry = new THREE.TorusGeometry(1, 0.05, 16, 100);
        const contextBMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.5
        });
        
        const contextB = new THREE.Mesh(contextBGeometry, contextBMaterial);
        contextB.rotation.y = Math.PI / 2;
        this.scene.add(contextB);
        this.sceneObjects.push(contextB);
        this.animationState.contextB = contextB;
        
        // Add control animations
        this.animations.setContextA = () => {
            this.animationState.currentContext = 'A';
            this.animationState.measured = false;
            
            // Highlight context A
            gsap.to(contextA.material, {
                opacity: 0.9,
                emissiveIntensity: 0.8,
                duration: 0.5
            });
            
            // Dim context B
            gsap.to(contextB.material, {
                opacity: 0.3,
                emissiveIntensity: 0.3,
                duration: 0.5
            });
            
            // Reset particle
            gsap.to(particle.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5
            });
            
            gsap.to(particle.material, {
                emissiveIntensity: 0.8,
                duration: 0.5
            });
        };
        
        this.animations.setContextB = () => {
            this.animationState.currentContext = 'B';
            this.animationState.measured = false;
            
            // Highlight context B
            gsap.to(contextB.material, {
                opacity: 0.9,
                emissiveIntensity: 0.8,
                duration: 0.5
            });
            
            // Dim context A
            gsap.to(contextA.material, {
                opacity: 0.3,
                emissiveIntensity: 0.3,
                duration: 0.5
            });
            
            // Reset particle
            gsap.to(particle.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5
            });
            
            gsap.to(particle.material, {
                emissiveIntensity: 0.8,
                duration: 0.5
            });
        };
        
        this.animations.measure = () => {
            if (this.animationState.currentContext === 'none' || this.animationState.measured) return;
            
            this.animationState.measured = true;
            
            // Perform measurement based on context
            if (this.animationState.currentContext === 'A') {
                // Context A result: transform to red state
                gsap.to(particle.material.color, {
                    r: 1,
                    g: 0.3,
                    b: 0.3,
                    duration: 1
                });
                
                gsap.to(particle.material.emissive, {
                    r: 1,
                    g: 0.3,
                    b: 0.3,
                    duration: 1
                });
                
                // Pulse effect
                gsap.to(particle.scale, {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    duration: 0.5,
                    repeat: 1,
                    yoyo: true
                });
            } else {
                // Context B result: transform to blue state
                gsap.to(particle.material.color, {
                    r: 0.2,
                    g: 0.5,
                    b: 1,
                    duration: 1
                });
                
                gsap.to(particle.material.emissive, {
                    r: 0.2,
                    g: 0.5,
                    b: 1,
                    duration: 1
                });
                
                // Pulse in different pattern
                gsap.to(particle.scale, {
                    x: 0.5,
                    y: 0.5,
                    z: 0.5,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.to(particle.scale, {
                            x: 1.2,
                            y: 1.2,
                            z: 1.2,
                            duration: 0.5,
                            repeat: 1,
                            yoyo: true
                        });
                    }
                });
            }
        };
    }
    
    setupOperatorsAnimation() {
        // For verse 21: Creation/annihilation operators
        this.animationState = {
            energyLevel: 0.5,
            particles: []
        };
        
        // Create energy level indicators
        const levels = 5;
        this.animationState.levelObjects = [];
        
        for (let i = 0; i < levels; i++) {
            const levelGeometry = new THREE.BoxGeometry(3, 0.05, 0.05);
            const levelMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a86ff,
                emissive: 0x3a86ff,
                emissiveIntensity: 0.5
            });
            
            const level = new THREE.Mesh(levelGeometry, levelMaterial);
            level.position.set(0, -2 + i, 0);
            this.scene.add(level);
            this.sceneObjects.push(level);
            this.animationState.levelObjects.push(level);
        }
        
        // Add control animations
        this.animations.createParticle = () => {
            // Get appropriate energy level based on slider
            const targetLevel = Math.floor(this.animationState.energyLevel * 4);
            
            // Create particle
            const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: 0xff5555,
                emissive: 0xff5555,
                emissiveIntensity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(-1.5, -2 + targetLevel, 0);
            particle.scale.set(0, 0, 0);
            this.scene.add(particle);
            this.sceneObjects.push(particle);
            
            // Store particle
            this.animationState.particles.push({
                particle,
                level: targetLevel
            });
            
            // Animate creation
            gsap.to(particle.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
            
            // Highlight level
            gsap.to(this.animationState.levelObjects[targetLevel].material, {
                emissiveIntensity: 1,
                duration: 0.3,
                repeat: 1,
                yoyo: true
            });
        };
        
        this.animations.annihilateParticle = () => {
            // Find highest level occupied particle
            let highestLevelIndex = -1;
            let highestLevel = -1;
            
            for (let i = 0; i < this.animationState.particles.length; i++) {
                if (this.animationState.particles[i].level > highestLevel) {
                    highestLevel = this.animationState.particles[i].level;
                    highestLevelIndex = i;
                }
            }
            
            if (highestLevelIndex >= 0) {
                const particleInfo = this.animationState.particles[highestLevelIndex];
                const particle = particleInfo.particle;
                
                // Create energy burst
                const burstGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                const burstMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffd166,
                    emissive: 0xffd166,
                    emissiveIntensity: 1,
                    transparent: true,
                    opacity: 1
                });
                
                const burst = new THREE.Mesh(burstGeometry, burstMaterial);
                burst.position.copy(particle.position);
                this.scene.add(burst);
                this.sceneObjects.push(burst);
                
                // Animate annihilation
                gsap.to(particle.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 0.5,
                    ease: "back.in(1.7)",
                    onComplete: () => {
                        // Remove particle
                        this.scene.remove(particle);
                        const index = this.sceneObjects.indexOf(particle);
                        if (index !== -1) this.sceneObjects.splice(index, 1);
                        
                        particle.geometry.dispose();
                        particle.material.dispose();
                        
                        // Remove from particles array
                        this.animationState.particles.splice(highestLevelIndex, 1);
                    }
                });
                
                // Animate burst
                gsap.to(burst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                    duration: 0.8,
                    ease: "power2.out"
                });
                
                gsap.to(burst.material, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        // Remove burst
                        this.scene.remove(burst);
                        const index = this.sceneObjects.indexOf(burst);
                        if (index !== -1) this.sceneObjects.splice(index, 1);
                        
                        burst.geometry.dispose();
                        burst.material.dispose();
                    }
                });
                
                // Highlight level
                gsap.to(this.animationState.levelObjects[highestLevel].material, {
                    emissiveIntensity: 1,
                    duration: 0.3,
                    repeat: 1,
                    yoyo: true
                });
            }
        };
        
        this.animations.setEnergyLevel = (value) => {
            this.animationState.energyLevel = value;
            
            // Update level colors based on energy
            const energyThreshold = Math.floor(value * 4);
            
            for (let i = 0; i < this.animationState.levelObjects.length; i++) {
                const level = this.animationState.levelObjects[i];
                
                if (i <= energyThreshold) {
                    gsap.to(level.material, {
                        emissiveIntensity: 0.5 + (i / this.animationState.levelObjects.length) * 0.5,
                        duration: 0.5
                    });
                } else {
                    gsap.to(level.material, {
                        emissiveIntensity: 0.2,
                        duration: 0.5
                    });
                }
            }
        };
    }
    
    setupEnergyFluctuationsAnimation() {
        // For verse 22: Energy fluctuations
        this.animationState = {
            energyLevel: 0.5,
            fluctuationRate: 0.5,
            waves: [],
            particles: []
        };
        
        // Create energy field
        const fieldGeometry = new THREE.PlaneGeometry(5, 5, 32, 32);
        const fieldMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            wireframe: true
        });
        
        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        field.rotation.x = Math.PI / 2;
        field.position.y = -1;
        this.scene.add(field);
        this.sceneObjects.push(field);
        this.animationState.field = field;
        
        // Create initial waves
        this.createEnergyWaves();
        
        // Add control animations
        this.animations.addEnergy = () => {
            this.animationState.energyLevel = Math.min(1, this.animationState.energyLevel + 0.2);
            this.updateEnergyField();
        };
        
        this.animations.removeEnergy = () => {
            this.animationState.energyLevel = Math.max(0, this.animationState.energyLevel - 0.2);
            this.updateEnergyField();
        };
        
        this.animations.setFluctuationRate = (value) => {
            this.animationState.fluctuationRate = value;
        };
    }
    
    createEnergyWaves() {
        const waveCount = 3;
        
        for (let i = 0; i < waveCount; i++) {
            // Create wave
            const waveGeometry = new THREE.CircleGeometry(0.1, 32);
            const waveMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a86ff,
                emissive: 0x3a86ff,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.position.set(
                (Math.random() - 0.5) * 4,
                -0.9,
                (Math.random() - 0.5) * 4
            );
            wave.rotation.x = Math.PI / 2;
            
            this.scene.add(wave);
            this.sceneObjects.push(wave);
            
            // Store wave
            this.animationState.waves.push({
                wave,
                maxRadius: 1 + Math.random(),
                speed: 0.5 + Math.random() * 0.5
            });
            
            // Animate wave
            this.animateEnergyWave(this.animationState.waves[this.animationState.waves.length - 1]);
        }
    }
    
    animateEnergyWave(waveData) {
        const { wave, maxRadius, speed } = waveData;
        
        // Reset wave
        wave.scale.set(0.1, 0.1, 0.1);
        wave.material.opacity = 0.7;
        
        // Animate expanding wave
        gsap.to(wave.scale, {
            x: maxRadius * 10,
            y: maxRadius * 10,
            z: 1,
            duration: speed * 3,
            ease: "power1.out"
        });
        
        gsap.to(wave.material, {
            opacity: 0,
            duration: speed * 3,
            ease: "power1.out",
            onComplete: () => {
                // Chance to create particle based on energy level
                if (Math.random() < this.animationState.energyLevel * this.animationState.fluctuationRate) {
                    this.createEnergyParticle(wave.position);
                }
                
                // Reposition wave
                wave.position.set(
                    (Math.random() - 0.5) * 4,
                    -0.9,
                    (Math.random() - 0.5) * 4
                );
                
                // Restart animation
                this.animateEnergyWave(waveData);
            }
        });
    }
    
    createEnergyParticle(position) {
        // Create particle
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd166,
            emissive: 0xffd166,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);
        
        this.scene.add(particle);
        this.sceneObjects.push(particle);
        
        // Store particle
        this.animationState.particles.push(particle);
        
        // Animate particle rise
        gsap.to(particle.position, {
            y: 1 + Math.random() * 2,
            duration: 1 + Math.random(),
            ease: "power1.out"
        });
        
        gsap.to(particle.material, {
            opacity: 0,
            duration: 1 + Math.random(),
            delay: 0.5,
            ease: "power1.out",
            onComplete: () => {
                // Remove particle
                this.scene.remove(particle);
                const index = this.sceneObjects.indexOf(particle);
                if (index !== -1) this.sceneObjects.splice(index, 1);
                
                // Remove from particles array
                const particleIndex = this.animationState.particles.indexOf(particle);
                if (particleIndex !== -1) {
                    this.animationState.particles.splice(particleIndex, 1);
                }
                
                // Dispose resources
                particle.geometry.dispose();
                particle.material.dispose();
            }
        });
    }
    
    updateEnergyField() {
        // Update field color based on energy
        gsap.to(this.animationState.field.material, {
            opacity: 0.2 + this.animationState.energyLevel * 0.4,
            duration: 0.5
        });
        
        gsap.to(this.animationState.field.material.color, {
            r: 0.2 + this.animationState.energyLevel * 0.8,
            g: 0.5 - this.animationState.energyLevel * 0.3,
            b: 1 - this.animationState.energyLevel * 0.4,
            duration: 0.5
        });
    }
    
    setupEmergenceAnimation() {
        // For verse 23: Emergent properties
        this.animationState = {
            particleCount: 50,
            interactionStrength: 0.5,
            particles: []
        };
        
        // Create particles
        this.createEmergentParticles();
        
        // Add control animations
        this.animations.addParticles = () => {
            this.animationState.particleCount += 20;
            this.createEmergentParticles();
        };
        
        this.animations.resetSystem = () => {
            // Remove all particles
            while (this.animationState.particles.length > 0) {
                const particleObj = this.animationState.particles.pop();
                
                this.scene.remove(particleObj.particle);
                const index = this.sceneObjects.indexOf(particleObj.particle);
                if (index !== -1) this.sceneObjects.splice(index, 1);
                
                particleObj.particle.geometry.dispose();
                particleObj.particle.material.dispose();
            }
            
            // Reset to initial state
            this.animationState.particleCount = 50;
            this.createEmergentParticles();
        };
        
        this.animations.setInteractionStrength = (value) => {
            this.animationState.interactionStrength = value;
        };
    }
    
    createEmergentParticles() {
        const count = this.animationState.particleCount - this.animationState.particles.length;
        
        for (let i = 0; i < count; i++) {
            // Create particle
            const size = 0.03 + Math.random() * 0.05;
            const particleGeometry = new THREE.SphereGeometry(size, 8, 8);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a86ff,
                emissive: 0x3a86ff,
                emissiveIntensity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position randomly in sphere
            const radius = 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            particle.position.set(x, y, z);
            
            this.scene.add(particle);
            this.sceneObjects.push(particle);
            
            // Create random velocity
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            );
            
            // Store particle data
            this.animationState.particles.push({
                particle,
                velocity,
                size
            });
        }
    }
    
    updateEmergenceAnimation(delta) {
        const particles = this.animationState.particles;
        const strength = this.animationState.interactionStrength;
        
        // Wave parameters
        const time = this.clock.getElapsedTime();
        
        // Update particles
        for (let i = 0; i < particles.length; i++) {
            const particleObj = particles[i];
            const particle = particleObj.particle;
            
            // Apply velocity with time scaling
            particle.position.x += particleObj.velocity.x * delta * 60;
            particle.position.y += particleObj.velocity.y * delta * 60;
            particle.position.z += particleObj.velocity.z * delta * 60;
            
            // Keep within bounds
            const distance = particle.position.length();
            if (distance > 3) {
                particle.position.normalize().multiplyScalar(3);
                
                // Reflect velocity
                const normal = particle.position.clone().normalize();
                const dot = particleObj.velocity.dot(normal);
                particleObj.velocity.sub(normal.multiplyScalar(2 * dot));
                particleObj.velocity.multiplyScalar(0.9); // Damping
            }
            
            // Apply wave effect based on interaction strength
            if (strength > 0.1) {
                // Apply wave motion
                const waveInfluence = strength * 0.1;
                const waveHeight = strength * 0.5;
                
                // Wave 1: circular waves
                const dist = Math.sqrt(
                    particle.position.x * particle.position.x + 
                    particle.position.z * particle.position.z
                );
                
                const wave = Math.sin(dist * 3 - time * 2) * waveHeight;
                
                // Apply emergent wave behavior
                particleObj.velocity.y += (wave - particle.position.y) * waveInfluence;
                
                // Update color based on height
                const heightFactor = (particle.position.y + waveHeight) / (2 * waveHeight);
                
                particle.material.color.r = 0.2 + heightFactor * 0.4;
                particle.material.color.g = 0.5 + heightFactor * 0.3;
                particle.material.color.b = 1.0;
            }
        }
    }
    
    setupQuantumVacuumAnimation() {
        // For verse 24: Quantum vacuum
        this.animationState = {
            zoomLevel: 1,
            energyDensity: 0.2,
            virtualParticles: []
        };
        
        // Create vacuum background
        const vacuumGeometry = new THREE.SphereGeometry(5, 32, 32);
        const vacuumMaterial = new THREE.MeshStandardMaterial({
            color: 0x050a30,
            transparent: true,
            opacity: 0.8,
            side: THREE.BackSide,
            wireframe: true
        });
        
        const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
        this.scene.add(vacuum);
        this.sceneObjects.push(vacuum);
        
        // Create quantum field
        const fieldGeometry = new THREE.SphereGeometry(4, 24, 24);
        const fieldMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a86ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            wireframe: true
        });
        
        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        this.scene.add(field);
        this.sceneObjects.push(field);
        this.animationState.field = field;
        
        // Create initial virtual particles
        this.createVirtualParticles();
        
        // Add control animations
        this.animations.zoomIn = () => {
            this.animationState.zoomLevel = Math.min(3, this.animationState.zoomLevel + 0.5);
            this.updateVacuumZoom();
        };
        
        this.animations.zoomOut = () => {
            this.animationState.zoomLevel = Math.max(0.5, this.animationState.zoomLevel - 0.5);
            this.updateVacuumZoom();
        };
        
        this.animations.setEnergyDensity = (value) => {
            this.animationState.energyDensity = value;
            this.updateEnergyDensity();
        };
    }
    
    createVirtualParticles() {
        const count = Math.floor(50 + this.animationState.energyDensity * 150);
        
        // Clear existing particles
        while (this.animationState.virtualParticles.length > 0) {
            const pair = this.animationState.virtualParticles.pop();
            
            this.scene.remove(pair.particle);
            this.scene.remove(pair.antiparticle);
            
            const index1 = this.sceneObjects.indexOf(pair.particle);
            if (index1 !== -1) this.sceneObjects.splice(index1, 1);
            
            const index2 = this.sceneObjects.indexOf(pair.antiparticle);
            if (index2 !== -1) this.sceneObjects.splice(index2, 1);
            
            pair.particle.geometry.dispose();
            pair.particle.material.dispose();
            pair.antiparticle.geometry.dispose();
            pair.antiparticle.material.dispose();
        }
        
        // Create new particles
        for (let i = 0; i < count; i++) {
            // Create virtual particle pair
            const size = 0.02 + Math.random() * 0.04 * this.animationState.energyDensity;
            
            // Create geometry
            const particleGeometry = new THREE.SphereGeometry(size, 8, 8);
            
            // Randomize color
            const colors = [
                { part: 0x3a86ff, anti: 0xff5555 }, // Blue/Red
                { part: 0x4cb944, anti: 0xffd166 }, // Green/Yellow
                { part: 0x8338ec, anti: 0xffbe0b }  // Purple/Orange
            ];
            
            const colorPair = colors[Math.floor(Math.random() * colors.length)];
            
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: colorPair.part,
                emissive: colorPair.part,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8
            });
            
            const antiparticleMaterial = new THREE.MeshStandardMaterial({
                color: colorPair.anti,
                emissive: colorPair.anti,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8
            });
            
            // Create meshes
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial);
            
            // Position randomly in sphere
            const radius = 3.5 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            // Position particles near each other
            const separation = 0.1 + Math.random() * 0.1;
            const direction = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
            
            particle.position.set(
                x + direction.x * separation * 0.5,
                y + direction.y * separation * 0.5,
                z + direction.z * separation * 0.5
            );
            
            antiparticle.position.set(
                x - direction.x * separation * 0.5,
                y - direction.y * separation * 0.5,
                z - direction.z * separation * 0.5
            );
            
            // Add to scene
            this.scene.add(particle);
            this.scene.add(antiparticle);
            this.sceneObjects.push(particle, antiparticle);
            
            // Store with lifetime based on energy density
            const lifetime = 1 + Math.random() * 5 * (1 - this.animationState.energyDensity);
            
            this.animationState.virtualParticles.push({
                particle,
                antiparticle,
                lifetime,
                currentTime: 0,
                direction
            });
        }
    }
    
    updateVacuumZoom() {
        // Update camera position based on zoom
        gsap.to(this.camera.position, {
            z: animationSettings.cameraDistance / this.animationState.zoomLevel,
            duration: 1,
            ease: "power2.inOut"
        });
        
        // Scale field bubble based on zoom
        gsap.to(this.animationState.field.scale, {
            x: 1 * this.animationState.zoomLevel,
            y: 1 * this.animationState.zoomLevel,
            z: 1 * this.animationState.zoomLevel,
            duration: 1,
            ease: "power2.inOut"
        });
    }
    
    updateEnergyDensity() {
        // Update field appearance
        gsap.to(this.animationState.field.material, {
            opacity: 0.05 + this.animationState.energyDensity * 0.2,
            duration: 1
        });
        
        // Recreate particles with new density
        this.createVirtualParticles();
    }
    
    updateQuantumVacuumAnimation(delta) {
        // Update virtual particles
        for (let i = this.animationState.virtualParticles.length - 1; i >= 0; i--) {
            const pair = this.animationState.virtualParticles[i];
            pair.currentTime += delta;
            
            // Check if lifetime expired
            if (pair.currentTime >= pair.lifetime) {
                // Annihilation effect
                const midpoint = new THREE.Vector3().addVectors(
                    pair.particle.position,
                    pair.antiparticle.position
                ).multiplyScalar(0.5);
                
                // Create tiny flash
                const flashGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                const flashMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 1,
                    transparent: true,
                    opacity: 1
                });
                
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                flash.position.copy(midpoint);
                this.scene.add(flash);
                this.sceneObjects.push(flash);
                
                // Animate flash
                gsap.to(flash.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                gsap.to(flash.material, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        // Remove flash
                        this.scene.remove(flash);
                        const index = this.sceneObjects.indexOf(flash);
                        if (index !== -1) this.sceneObjects.splice(index, 1);
                        
                        flash.geometry.dispose();
                        flash.material.dispose();
                    }
                });
                
                // Remove particles
                this.scene.remove(pair.particle);
                this.scene.remove(pair.antiparticle);
                
                const index1 = this.sceneObjects.indexOf(pair.particle);
                if (index1 !== -1) this.sceneObjects.splice(index1, 1);
                
                const index2 = this.sceneObjects.indexOf(pair.antiparticle);
                if (index2 !== -1) this.sceneObjects.splice(index2, 1);
                
                pair.particle.geometry.dispose();
                pair.particle.material.dispose();
                pair.antiparticle.geometry.dispose();
                pair.antiparticle.material.dispose();
                
                // Remove from array
                this.animationState.virtualParticles.splice(i, 1);
                
                // Create a new particle if needed based on energy density
                if (Math.random() < this.animationState.energyDensity) {
                    this.createVirtualParticles();
                }
            } else {
                // Update opacity based on lifetime
                const remaining = 1 - (pair.currentTime / pair.lifetime);
                pair.particle.material.opacity = remaining * 0.8;
                pair.antiparticle.material.opacity = remaining * 0.8;
                
                // Slight movement
                const oscillation = Math.sin(pair.currentTime * 5) * 0.01;
                pair.particle.position.addScaledVector(pair.direction, oscillation);
                pair.antiparticle.position.addScaledVector(pair.direction, -oscillation);
            }
        }
        
        // Occasionally create new particles based on energy density
        if (Math.random() < this.animationState.energyDensity * 0.05) {
            this.createVirtualParticles();
        }
    }
    
    setupDefaultAnimation() {
        // Default animation if no specific verse is matched
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16, 2, 3);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x3a86ff, 
            metalness: 0.5, 
            roughness: 0.2,
            emissive: 0x3a86ff,
            emissiveIntensity: 0.3
        });
        
        const torusKnot = new THREE.Mesh(geometry, material);
        this.scene.add(torusKnot);
        this.sceneObjects.push(torusKnot);
        
        // Add animation
        this.animations.default = (delta) => {
            torusKnot.rotation.x += delta * 0.5;
            torusKnot.rotation.y += delta * 0.2;
        };
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        
        // Update FXAA resolution
        const pixelRatio = this.renderer.getPixelRatio();
        this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
        this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update controls with damping
        this.controls.update();
        
        // Update verse-specific animations with delta time for consistent speed
        const verseNumber = verses[this.currentVerseIndex].number;
        
        switch(verseNumber) {
            case 13:
                this.updateUncertaintyAnimation(delta);
                break;
            case 18:
                this.updateFluctuations(delta);
                break;
            case 23:
                this.updateEmergenceAnimation(delta);
                break;
            case 24:
                this.updateQuantumVacuumAnimation(delta);
                break;
        }
        
        // Render the scene
        this.composer.render();
    }
    
    updateUncertaintyAnimation(delta) {
        if (!this.particles) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.animationState.particleCount; i++) {
            const i3 = i * 3;
            
            // Apply velocity to position with time scaling
            const scaledVelocity = this.animationState.velocities[i].clone().multiplyScalar(delta * 60);
            this.animationState.positions[i].add(scaledVelocity);
            
            // Keep particles within bounds (sphere of radius 3)
            const distance = this.animationState.positions[i].length();
            if (distance > 3) {
                this.animationState.positions[i].normalize().multiplyScalar(3);
                // Reflect velocity with improved physics
                const normal = this.animationState.positions[i].clone().normalize();
                const dot = this.animationState.velocities[i].dot(normal);
                this.animationState.velocities[i].sub(normal.multiplyScalar(2 * dot));
                this.animationState.velocities[i].multiplyScalar(0.8); // Damping
            }
            
            // Apply uncertainty principle with time scaling
            if (this.animationState.uncertaintyMode) {
                const preciseFactor = this.animationState.precision;
                
                if (Math.random() < 0.05) {
                    const spread = (1 - preciseFactor) * 0.03;
                    this.animationState.velocities[i].x += (Math.random() - 0.5) * spread;
                    this.animationState.velocities[i].y += (Math.random() - 0.5) * spread;
                    this.animationState.velocities[i].z += (Math.random() - 0.5) * spread;
                }
            }
            
            // Update the position in the buffer
            positions[i3] = this.animationState.positions[i].x;
            positions[i3 + 1] = this.animationState.positions[i].y;
            positions[i3 + 2] = this.animationState.positions[i].z;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // ... existing code ...
}

// Initialize the application with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        new VerseVisualizer();
    } catch (error) {
        console.error("Error initializing VerseVisualizer:", error);
        // Display friendly error message to user
        const sceneContainer = document.getElementById('sceneContainer');
        if (sceneContainer) {
            sceneContainer.innerHTML = `
                <div style="color: white; padding: 20px; text-align: center;">
                    <h2>Sorry, we encountered an error</h2>
                    <p>Please try refreshing the page or using a different browser.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }
});