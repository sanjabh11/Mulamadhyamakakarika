import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { verses } from './config.js';

// DOM elements
const sceneContainer = document.getElementById('scene-container');
const infoPanelElement = document.getElementById('info-panel');
const togglePanelBtn = document.getElementById('toggle-panel');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const verseIndicator = document.getElementById('verse-indicator');
const verseTitleElement = document.getElementById('verse-title');
const verseTextElement = document.getElementById('verse-text');
const madhyamakaConceptElement = document.getElementById('madhyamaka-concept');
const quantumParallelElement = document.getElementById('quantum-parallel');
const accessibleExplanationElement = document.getElementById('accessible-explanation');

// ThreeJS globals
let scene, camera, renderer, composer, controls;
let currentVerseIndex = 0;
let currentAnimation = null;
let isAnimating = false;

// Initialize the 3D scene
function initScene() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Post-processing
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    composer.addPass(bloomPass);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Initial animation
    loadVerse(currentVerseIndex);
    
    // Window resize event
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if (currentAnimation && currentAnimation.update) {
        currentAnimation.update();
    }
    
    composer.render();
}

// Animation Classes for each verse
class ElectronCollapseAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        // Clear previous objects
        clearScene(this.scene);
        
        // Create electron
        const electronGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const electronMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0044ff,
            roughness: 0.2,
            metalness: 0.8
        });
        this.electron = new THREE.Mesh(electronGeometry, electronMaterial);
        this.scene.add(this.electron);
        
        // Create orbit path
        const orbitGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x0088ff,
            transparent: true,
            opacity: 0.5
        });
        this.orbitPath = new THREE.Mesh(orbitGeometry, orbitMaterial);
        this.orbitPath.rotation.x = Math.PI / 2;
        this.scene.add(this.orbitPath);
        
        // Create probability cloud
        this.particles = new THREE.Group();
        const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.3
        });
        
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.8 + Math.random() * 0.4;
            const offset = (Math.random() - 0.5) * 0.5;
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            particle.position.set(
                Math.cos(angle) * radius,
                offset,
                Math.sin(angle) * radius
            );
            particle.material.opacity = Math.random() * 0.5;
            this.particles.add(particle);
        }
        this.scene.add(this.particles);
        
        // Add text explaining
        this.addTextPanel();
        
        // Add interaction
        renderer.domElement.addEventListener('click', this.onSceneClick.bind(this));
        
        // Default animation state
        this.collapsed = false;
        
        // Start animation
        gsap.to(camera.position, { 
            duration: 2,
            x: 3,
            y: 2,
            z: 4,
            ease: "power2.inOut"
        });
    }
    
    addTextPanel() {
        const textGroup = new THREE.Group();
        
        // Add a transparent background panel for text
        const panelGeometry = new THREE.PlaneGeometry(3, 1);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(0, -2.5, 0);
        
        textGroup.add(panel);
        this.scene.add(textGroup);
    }
    
    onSceneClick() {
        if (isAnimating) return;
        isAnimating = true;
        
        if (!this.collapsed) {
            // Collapse to a specific position
            gsap.to(this.electron.position, {
                duration: 1,
                x: 0,
                y: 0, 
                z: 0,
                ease: "power2.inOut",
                onComplete: () => {
                    isAnimating = false;
                }
            });
            
            // Hide the probability cloud
            gsap.to(this.particles.children.map(p => p.material), {
                duration: 0.5,
                opacity: 0,
                ease: "power2.inOut"
            });
            
            this.collapsed = true;
        } else {
            // Return to quantum state
            gsap.to(this.electron.position, {
                duration: 1,
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.inOut",
                onComplete: () => {
                    isAnimating = false;
                }
            });
            
            // Show the probability cloud
            gsap.to(this.particles.children.map(p => p.material), {
                duration: 0.5,
                opacity: p => Math.random() * 0.5,
                ease: "power2.inOut"
            });
            
            this.collapsed = false;
        }
    }
    
    update() {
        if (!this.collapsed) {
            const elapsedTime = this.clock.getElapsedTime();
            this.electron.position.x = Math.cos(elapsedTime) * 2;
            this.electron.position.z = Math.sin(elapsedTime) * 2;
            
            // Slightly animate particles
            this.particles.children.forEach((particle, i) => {
                const angle = elapsedTime * 0.2 + i * 0.01;
                particle.position.y += Math.sin(angle) * 0.001;
            });
        }
    }
    
    dispose() {
        renderer.domElement.removeEventListener('click', this.onSceneClick.bind(this));
    }
}

class ContextDependentParticleAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create particle
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        
        // Particle 1
        const material1 = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.8
        });
        this.particle = new THREE.Mesh(geometry, material1);
        this.scene.add(this.particle);
        
        // Create measurement devices
        this.devices = [];
        const deviceColors = [0xff0000, 0x00ff00, 0x0000ff];
        
        for (let i = 0; i < 3; i++) {
            const deviceGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const deviceMaterial = new THREE.MeshStandardMaterial({
                color: deviceColors[i],
                emissive: deviceColors[i],
                emissiveIntensity: 0.3,
                roughness: 0.3
            });
            const device = new THREE.Mesh(deviceGeometry, deviceMaterial);
            device.position.set(
                Math.cos(i * Math.PI * 2/3) * 3,
                0,
                Math.sin(i * Math.PI * 2/3) * 3
            );
            this.devices.push(device);
            this.scene.add(device);
        }
        
        // Create connection lines
        this.lines = [];
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        for (let i = 0; i < 3; i++) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                this.devices[i].position
            ]);
            const line = new THREE.Line(lineGeometry, lineMaterial.clone());
            this.lines.push(line);
            this.scene.add(line);
        }
        
        // Add control div with buttons
        this.addControls();
        
        // Camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 2,
            y: 4,
            z: 5,
            ease: "power2.inOut"
        });
    }
    
    addControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        const colors = ['Red', 'Green', 'Blue'];
        
        for (let i = 0; i < 3; i++) {
            const btn = document.createElement('button');
            btn.textContent = `Measure with ${colors[i]}`;
            btn.style.display = 'block';
            btn.style.margin = '5px';
            btn.style.padding = '8px 12px';
            btn.style.background = i === 0 ? '#ff0000' : i === 1 ? '#00ff00' : '#0000ff';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            
            btn.addEventListener('click', () => this.measure(i));
            
            controlDiv.appendChild(btn);
        }
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
    }
    
    measure(deviceIndex) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Save original position
        const originalPos = this.particle.position.clone();
        
        // Animate particle to the device
        gsap.to(this.particle.position, {
            duration: 1,
            x: this.devices[deviceIndex].position.x * 0.7,
            y: this.devices[deviceIndex].position.y * 0.7,
            z: this.devices[deviceIndex].position.z * 0.7,
            ease: "power2.inOut"
        });
        
        // Change particle color to match device
        gsap.to(this.particle.material.color, {
            duration: 1,
            r: this.devices[deviceIndex].material.color.r,
            g: this.devices[deviceIndex].material.color.g,
            b: this.devices[deviceIndex].material.color.b,
            ease: "power2.inOut"
        });
        
        // Highlight active line
        for (let i = 0; i < this.lines.length; i++) {
            gsap.to(this.lines[i].material, {
                duration: 0.5,
                opacity: i === deviceIndex ? 0.8 : 0.1
            });
        }
        
        // Return to center after delay
        setTimeout(() => {
            gsap.to(this.particle.position, {
                duration: 1,
                x: originalPos.x,
                y: originalPos.y,
                z: originalPos.z,
                ease: "power2.inOut",
                onComplete: () => {
                    // Reset line opacities
                    for (let i = 0; i < this.lines.length; i++) {
                        gsap.to(this.lines[i].material, {
                            duration: 0.5,
                            opacity: 0.3
                        });
                    }
                    isAnimating = false;
                }
            });
        }, 2000);
    }
    
    update() {
        if (!isAnimating) {
            const time = this.clock.getElapsedTime();
            // Gently move the particle in a small orbit
            this.particle.position.x = Math.cos(time * 0.5) * 0.2;
            this.particle.position.z = Math.sin(time * 0.5) * 0.2;
            
            // Update line positions
            this.lines.forEach((line, i) => {
                const positions = line.geometry.attributes.position.array;
                positions[0] = this.particle.position.x;
                positions[1] = this.particle.position.y;
                positions[2] = this.particle.position.z;
                line.geometry.attributes.position.needsUpdate = true;
            });
        }
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class EntangledParticlesAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create two entangled particles
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        
        // Particle 1
        const material1 = new THREE.MeshStandardMaterial({
            color: 0xff3377,
            emissive: 0xaa1155,
            roughness: 0.2,
            metalness: 0.8
        });
        this.particle1 = new THREE.Mesh(geometry, material1);
        this.particle1.position.set(-2, 0, 0);
        this.scene.add(this.particle1);
        
        // Particle 2
        const material2 = new THREE.MeshStandardMaterial({
            color: 0x33aaff,
            emissive: 0x1155aa,
            roughness: 0.2,
            metalness: 0.8
        });
        this.particle2 = new THREE.Mesh(geometry, material2);
        this.particle2.position.set(2, 0, 0);
        this.scene.add(this.particle2);
        
        // Entanglement connection
        const connectionGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(-2, 0, 0),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(2, 0, 0)
            ]),
            20, 0.05, 8, false
        );
        const connectionMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        this.connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
        this.scene.add(this.connection);
        
        // Add particles to represent quantum uncertainty
        this.addQuantumClouds();
        
        // Add measure buttons
        this.addMeasureControls();
        
        // Set initial state
        this.state = {
            particle1Measured: false,
            particle2Measured: false,
            lastMeasured: null
        };
        
        // Set camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 2,
            z: 6,
            ease: "power2.inOut"
        });
    }
    
    addQuantumClouds() {
        // Cloud for particle 1
        this.cloud1 = new THREE.Group();
        // Cloud for particle 2
        this.cloud2 = new THREE.Group();
        
        const cloudGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        
        for (let i = 0; i < 30; i++) {
            // Particle 1 cloud
            const cloudMaterial1 = new THREE.MeshBasicMaterial({
                color: 0xff3377,
                transparent: true,
                opacity: Math.random() * 0.5 + 0.1
            });
            const cloudParticle1 = new THREE.Mesh(cloudGeometry, cloudMaterial1);
            
            // Random position around particle 1
            const angle1 = Math.random() * Math.PI * 2;
            const radius1 = 0.3 + Math.random() * 0.2;
            cloudParticle1.position.set(
                this.particle1.position.x + Math.cos(angle1) * radius1,
                this.particle1.position.y + (Math.random() - 0.5) * radius1,
                this.particle1.position.z + Math.sin(angle1) * radius1
            );
            this.cloud1.add(cloudParticle1);
            
            // Particle 2 cloud
            const cloudMaterial2 = new THREE.MeshBasicMaterial({
                color: 0x33aaff,
                transparent: true,
                opacity: Math.random() * 0.5 + 0.1
            });
            const cloudParticle2 = new THREE.Mesh(cloudGeometry, cloudMaterial2);
            
            // Random position around particle 2
            const angle2 = Math.random() * Math.PI * 2;
            const radius2 = 0.3 + Math.random() * 0.2;
            cloudParticle2.position.set(
                this.particle2.position.x + Math.cos(angle2) * radius2,
                this.particle2.position.y + (Math.random() - 0.5) * radius2,
                this.particle2.position.z + Math.sin(angle2) * radius2
            );
            this.cloud2.add(cloudParticle2);
        }
        
        this.scene.add(this.cloud1);
        this.scene.add(this.cloud2);
    }
    
    addMeasureControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Measure particle 1 button
        const btn1 = document.createElement('button');
        btn1.textContent = 'Measure Left Particle';
        btn1.style.display = 'block';
        btn1.style.margin = '5px';
        btn1.style.padding = '8px 12px';
        btn1.style.background = '#ff3377';
        btn1.style.color = 'white';
        btn1.style.border = 'none';
        btn1.style.borderRadius = '5px';
        btn1.style.cursor = 'pointer';
        btn1.addEventListener('click', () => this.measureParticle(1));
        controlDiv.appendChild(btn1);
        
        // Measure particle 2 button
        const btn2 = document.createElement('button');
        btn2.textContent = 'Measure Right Particle';
        btn2.style.display = 'block';
        btn2.style.margin = '5px';
        btn2.style.padding = '8px 12px';
        btn2.style.background = '#33aaff';
        btn2.style.color = 'white';
        btn2.style.border = 'none';
        btn2.style.borderRadius = '5px';
        btn2.style.cursor = 'pointer';
        btn2.addEventListener('click', () => this.measureParticle(2));
        controlDiv.appendChild(btn2);
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.display = 'block';
        resetBtn.style.margin = '5px';
        resetBtn.style.padding = '8px 12px';
        resetBtn.style.background = '#444444';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.addEventListener('click', () => this.resetParticles());
        controlDiv.appendChild(resetBtn);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
    }
    
    measureParticle(particleNumber) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Determine which particle is being measured
        const targetParticle = particleNumber === 1 ? this.particle1 : this.particle2;
        const otherParticle = particleNumber === 1 ? this.particle2 : this.particle1;
        const targetCloud = particleNumber === 1 ? this.cloud1 : this.cloud2;
        const otherCloud = particleNumber === 1 ? this.cloud2 : this.cloud1;
        
        // Determine if we should spin up or down
        const spinUp = Math.random() > 0.5;
        const spinColor = spinUp ? 0xffaa00 : 0x00aaff;
        
        // The measured particle collapses to a definite state
        gsap.to(targetParticle.material.color, {
            duration: 0.5,
            r: (spinColor >> 16 & 255) / 255,
            g: (spinColor >> 8 & 255) / 255,
            b: (spinColor & 255) / 255,
            ease: "power2.inOut"
        });
        
        // The cloud disappears
        gsap.to(targetCloud.children.map(p => p.material), {
            duration: 0.5,
            opacity: 0,
            ease: "power2.inOut"
        });
        
        // If this is the first particle measured, the other particle must take the opposite spin
        if (!this.state.particle1Measured && !this.state.particle2Measured) {
            const oppositeSpinColor = spinUp ? 0x00aaff : 0xffaa00;
            
            setTimeout(() => {
                // After a delay, the other particle also collapses, but to the opposite state
                gsap.to(otherParticle.material.color, {
                    duration: 0.5,
                    r: (oppositeSpinColor >> 16 & 255) / 255,
                    g: (oppositeSpinColor >> 8 & 255) / 255,
                    b: (oppositeSpinColor & 255) / 255,
                    ease: "power2.inOut"
                });
                
                // Its cloud also disappears
                gsap.to(otherCloud.children.map(p => p.material), {
                    duration: 0.5,
                    opacity: 0,
                    ease: "power2.inOut"
                });
                
                // The entanglement connection brightens briefly then fades
                gsap.to(this.connection.material, {
                    duration: 0.3,
                    opacity: 0.9,
                    ease: "power2.in",
                    onComplete: () => {
                        gsap.to(this.connection.material, {
                            duration: 0.7,
                            opacity: 0.1,
                            ease: "power2.out",
                            onComplete: () => { isAnimating = false; }
                        });
                    }
                });
            }, 800);
        } else {
            isAnimating = false;
        }
        
        // Update state
        if (particleNumber === 1) {
            this.state.particle1Measured = true;
        } else {
            this.state.particle2Measured = true;
        }
        this.state.lastMeasured = particleNumber;
    }
    
    resetParticles() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Reset particle 1 color
        gsap.to(this.particle1.material.color, {
            duration: 0.5,
            r: 0xff/255,
            g: 0x33/255,
            b: 0x77/255,
            ease: "power2.inOut"
        });
        
        // Reset particle 2 color
        gsap.to(this.particle2.material.color, {
            duration: 0.5,
            r: 0x33/255,
            g: 0xaa/255,
            b: 0xff/255,
            ease: "power2.inOut"
        });
        
        // Reset connection
        gsap.to(this.connection.material, {
            duration: 0.5,
            opacity: 0.5,
            ease: "power2.inOut"
        });
        
        // Bring back the clouds
        for (let i = 0; i < this.cloud1.children.length; i++) {
            gsap.to(this.cloud1.children[i].material, {
                duration: 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                ease: "power2.inOut"
            });
        }
        
        for (let i = 0; i < this.cloud2.children.length; i++) {
            gsap.to(this.cloud2.children[i].material, {
                duration: 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                ease: "power2.inOut"
            });
        }
        
        // Reset state
        this.state = {
            particle1Measured: false,
            particle2Measured: false,
            lastMeasured: null
        };
        
        isAnimating = false;
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Only animate particles if they haven't been measured
        if (!this.state.particle1Measured) {
            this.particle1.rotation.y = time * 0.5;
            // Animate cloud 1
            for (let i = 0; i < this.cloud1.children.length; i++) {
                const particle = this.cloud1.children[i];
                const offset = i * 0.1;
                particle.position.x = this.particle1.position.x + Math.cos(time + offset) * (0.3 + Math.sin(time * 0.5) * 0.05);
                particle.position.z = this.particle1.position.z + Math.sin(time + offset) * (0.3 + Math.sin(time * 0.5) * 0.05);
            }
        }
        
        if (!this.state.particle2Measured) {
            this.particle2.rotation.y = -time * 0.5;
            // Animate cloud 2
            for (let i = 0; i < this.cloud2.children.length; i++) {
                const particle = this.cloud2.children[i];
                const offset = i * 0.1;
                particle.position.x = this.particle2.position.x + Math.cos(time + offset) * (0.3 + Math.sin(time * 0.5) * 0.05);
                particle.position.z = this.particle2.position.z + Math.sin(time + offset) * (0.3 + Math.sin(time * 0.5) * 0.05);
            }
        }
        
        // Gently pulse the connection if not measured
        if (!this.state.particle1Measured && !this.state.particle2Measured) {
            this.connection.material.opacity = 0.3 + Math.sin(time * 2) * 0.2;
        }
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class IdenticalParticlesAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create a group for particles
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
        
        // Create identical particles
        const numberOfParticles = 5;
        const geometry = new THREE.SphereGeometry(0.3, 24, 24);
        const material = new THREE.MeshStandardMaterial({
            color: 0x44aaff,
            emissive: 0x1155aa,
            emissiveIntensity: 0.3,
            roughness: 0.2,
            metalness: 0.8
        });
        
        this.particles = [];
        
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = new THREE.Mesh(geometry, material.clone());
            const angle = (i / numberOfParticles) * Math.PI * 2;
            const radius = 2;
            
            particle.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            
            // Store original position for animation
            particle.userData.originalPosition = particle.position.clone();
            particle.userData.index = i;
            particle.userData.angle = angle;
            
            this.particles.push(particle);
            this.particleGroup.add(particle);
        }
        
        // Add labels to particles
        this.labels = [];
        this.addLabels();
        
        // Add control for swapping
        this.addSwapControls();
        
        // Setup camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 3,
            z: 5,
            ease: "power2.inOut"
        });
    }
    
    addLabels() {
        // Remove old labels if they exist
        this.labels.forEach(label => {
            if (label.element.parentNode) {
                label.element.parentNode.removeChild(label.element);
            }
        });
        this.labels = [];
        
        // Create new labels
        this.particles.forEach((particle, index) => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'particle-label';
            labelDiv.textContent = `Particle ${index + 1}`;
            labelDiv.style.position = 'absolute';
            labelDiv.style.color = 'white';
            labelDiv.style.padding = '2px 6px';
            labelDiv.style.background = 'rgba(0,0,0,0.7)';
            labelDiv.style.borderRadius = '4px';
            labelDiv.style.fontSize = '14px';
            labelDiv.style.pointerEvents = 'none';
            labelDiv.style.transition = 'opacity 0.3s';
            
            sceneContainer.appendChild(labelDiv);
            
            this.labels.push({
                element: labelDiv,
                particle: particle,
                visible: true
            });
        });
    }
    
    updateLabels() {
        this.labels.forEach(label => {
            if (label.visible) {
                // Project 3D position to 2D screen coordinates
                const vector = new THREE.Vector3();
                vector.setFromMatrixPosition(label.particle.matrixWorld);
                vector.project(camera);
                
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(vector.y) * 0.5 + 0.5) * window.innerHeight;
                
                label.element.style.left = `${x}px`;
                label.element.style.top = `${y}px`;
            }
        });
    }
    
    addSwapControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Swap button
        const swapBtn = document.createElement('button');
        swapBtn.textContent = 'Swap Particles';
        swapBtn.style.display = 'block';
        swapBtn.style.margin = '5px';
        swapBtn.style.padding = '8px 12px';
        swapBtn.style.background = '#3377ff';
        swapBtn.style.color = 'white';
        swapBtn.style.border = 'none';
        swapBtn.style.borderRadius = '5px';
        swapBtn.style.cursor = 'pointer';
        swapBtn.addEventListener('click', () => this.swapParticles());
        controlDiv.appendChild(swapBtn);
        
        // Toggle labels button
        const toggleLabelsBtn = document.createElement('button');
        toggleLabelsBtn.textContent = 'Toggle Labels';
        toggleLabelsBtn.style.display = 'block';
        toggleLabelsBtn.style.margin = '5px';
        toggleLabelsBtn.style.padding = '8px 12px';
        toggleLabelsBtn.style.background = '#444444';
        toggleLabelsBtn.style.color = 'white';
        toggleLabelsBtn.style.border = 'none';
        toggleLabelsBtn.style.borderRadius = '5px';
        toggleLabelsBtn.style.cursor = 'pointer';
        toggleLabelsBtn.addEventListener('click', () => this.toggleLabels());
        controlDiv.appendChild(toggleLabelsBtn);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
    }
    
    swapParticles() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Choose two random particles to swap
        const indexA = Math.floor(Math.random() * this.particles.length);
        let indexB = Math.floor(Math.random() * this.particles.length);
        // Make sure we pick a different particle
        while (indexB === indexA) {
            indexB = Math.floor(Math.random() * this.particles.length);
        }
        
        const particleA = this.particles[indexA];
        const particleB = this.particles[indexB];
        
        // Store target positions
        const posA = particleA.position.clone();
        const posB = particleB.position.clone();
        
        // Animate to intermediate position (center)
        gsap.to(particleA.position, {
            duration: 0.7,
            x: 0,
            y: 0.5,
            z: 0,
            ease: "power2.inOut",
            onComplete: () => {
                // Then animate to final position
                gsap.to(particleA.position, {
                    duration: 0.7,
                    x: posB.x,
                    y: posB.y,
                    z: posB.z,
                    ease: "power2.inOut"
                });
            }
        });
        
        gsap.to(particleB.position, {
            duration: 0.7,
            x: 0,
            y: -0.5,
            z: 0,
            ease: "power2.inOut",
            onComplete: () => {
                // Then animate to final position
                gsap.to(particleB.position, {
                    duration: 0.7,
                    x: posA.x,
                    y: posA.y,
                    z: posA.z,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Update user data for future animations
                        const tempAngle = particleA.userData.angle;
                        particleA.userData.angle = particleB.userData.angle;
                        particleB.userData.angle = tempAngle;
                        
                        particleA.userData.originalPosition = posB.clone();
                        particleB.userData.originalPosition = posA.clone();
                        
                        isAnimating = false;
                    }
                });
            }
        });
    }
    
    toggleLabels() {
        const labelsVisible = this.labels[0]?.visible;
        
        this.labels.forEach(label => {
            label.visible = !labelsVisible;
            label.element.style.opacity = label.visible ? '1' : '0';
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        if (!isAnimating) {
            // Gently orbit particles around their original positions
            this.particles.forEach(particle => {
                const angle = particle.userData.angle + time * 0.1;
                const radius = 2;
                particle.position.x = Math.cos(angle) * radius;
                particle.position.z = Math.sin(angle) * radius;
                particle.rotation.y = time * 0.5;
            });
        }
        
        // Update label positions
        this.updateLabels();
    }
    
    dispose() {
        // Remove labels
        this.labels.forEach(label => {
            if (label.element.parentNode) {
                label.element.parentNode.removeChild(label.element);
            }
        });
        
        // Remove control div
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class EntangledMeasurementAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create five connected nodes to represent the fivefold relationship
        this.nodes = [];
        this.connections = [];
        
        // Create central node (self)
        const selfGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const selfMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa22,
            emissive: 0xaa6600,
            roughness: 0.2,
            metalness: 0.8
        });
        this.selfNode = new THREE.Mesh(selfGeometry, selfMaterial);
        this.scene.add(this.selfNode);
        
        // Create five afflictions nodes around it
        const nodePositions = [
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(0.618, 0, 1.902),
            new THREE.Vector3(-1.618, 0, 1.176),
            new THREE.Vector3(-1.618, 0, -1.176),
            new THREE.Vector3(0.618, 0, -1.902)
        ];
        
        const nodeGeometry = new THREE.SphereGeometry(0.3, 24, 24);
        const nodeColors = [
            0xff3366, 0x33ff66, 0x6633ff, 
            0xff9933, 0x33ccff
        ];
        
        for (let i = 0; i < 5; i++) {
            const material = new THREE.MeshStandardMaterial({
                color: nodeColors[i],
                emissive: nodeColors[i],
                emissiveIntensity: 0.3,
                roughness: 0.3,
                metalness: 0.7
            });
            
            const node = new THREE.Mesh(nodeGeometry, material);
            node.position.copy(nodePositions[i]);
            node.userData.originalPosition = nodePositions[i].clone();
            node.userData.index = i;
            
            this.nodes.push(node);
            this.scene.add(node);
            
            // Create connection
            const points = [
                new THREE.Vector3(0, 0, 0),
                nodePositions[i]
            ];
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: nodeColors[i],
                transparent: true,
                opacity: 0.5,
                linewidth: 1
            });
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            this.connections.push(connection);
            this.scene.add(connection);
        }
        
        // Add interactive controls
        this.addInteractiveControls();
        
        // Set camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 3,
            y: 3,
            z: 6,
            ease: "power2.inOut"
        });
    }
    
    addInteractiveControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        const relationshipTypes = [
            'Same', 'Different', 'Possessor', 
            'Possessed', 'Container'
        ];
        
        for (let i = 0; i < 5; i++) {
            const btn = document.createElement('button');
            btn.textContent = `Test ${relationshipTypes[i]} Relationship`;
            btn.style.display = 'block';
            btn.style.margin = '5px';
            btn.style.padding = '8px 12px';
            btn.style.background = `rgb(${(this.nodes[i].material.color.r * 255)}, ${(this.nodes[i].material.color.g * 255)}, ${(this.nodes[i].material.color.b * 255)})`;
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            
            btn.addEventListener('click', () => this.testRelationship(i));
            
            controlDiv.appendChild(btn);
        }
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.display = 'block';
        resetBtn.style.margin = '5px';
        resetBtn.style.padding = '8px 12px';
        resetBtn.style.background = '#444444';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.addEventListener('click', () => this.resetNodes());
        controlDiv.appendChild(resetBtn);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
    }
    
    testRelationship(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        const node = this.nodes[index];
        const connection = this.connections[index];
        
        // Different animations based on relationship type
        switch(index) {
            case 0: // Same
                // Try to merge node with self
                gsap.to(node.position, {
                    duration: 1,
                    x: 0,
                    y: 0,
                    z: 0,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Make node transparent
                        gsap.to(node.material, {
                            duration: 0.5,
                            opacity: 0,
                            transparent: true,
                            onComplete: () => {
                                // Pulse the self node to show relationship fails
                                gsap.to(this.selfNode.scale, {
                                    duration: 0.2,
                                    x: 1.2, y: 1.2, z: 1.2,
                                    yoyo: true,
                                    repeat: 3,
                                    onComplete: () => {
                                        // Reset position and make visible again
                                        setTimeout(() => {
                                            this.resetNode(index);
                                        }, 500);
                                    }
                                });
                            }
                        });
                    }
                });
                break;
                
            case 1: // Different
                // Try to push node away then show it's still connected
                gsap.to(node.position, {
                    duration: 1,
                    x: node.userData.originalPosition.x * 1.8,
                    y: node.userData.originalPosition.y,
                    z: node.userData.originalPosition.z * 1.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Pulse the connection to show relationship fails
                        for (let i = 0; i < 3; i++) {
                            gsap.to(connection.material, {
                                duration: 0.3,
                                opacity: 0.9,
                                delay: i * 0.6,
                                yoyo: true,
                                repeat: 1
                            });
                        }
                        
                        setTimeout(() => {
                            this.resetNode(index);
                        }, 2000);
                    }
                });
                break;
                
            case 2: // Possessor (Self possesses affliction)
                // Try to make self contain the node
                gsap.to(node.scale, {
                    duration: 0.5,
                    x: 0.6, y: 0.6, z: 0.6,
                    ease: "power2.inOut"
                });
                
                gsap.to(node.position, {
                    duration: 1,
                    x: this.selfNode.position.x + 0.2,
                    y: this.selfNode.position.y,
                    z: this.selfNode.position.z,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Pulse the self node to show relationship fails
                        gsap.to(this.selfNode.material, {
                            duration: 0.3,
                            emissiveIntensity: 0.8,
                            yoyo: true,
                            repeat: 3,
                            onComplete: () => {
                                setTimeout(() => {
                                    this.resetNode(index);
                                }, 500);
                            }
                        });
                    }
                });
                break;
                
            case 3: // Possessed (Affliction possesses self)
                // Try to make node contain the self
                gsap.to(this.selfNode.scale, {
                    duration: 0.5,
                    x: 0.6, y: 0.6, z: 0.6,
                    ease: "power2.inOut"
                });
                
                gsap.to(this.selfNode.position, {
                    duration: 1,
                    x: node.position.x,
                    y: node.position.y,
                    z: node.position.z,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Pulse the node to show relationship fails
                        gsap.to(node.material, {
                            duration: 0.3,
                            emissiveIntensity: 0.8,
                            yoyo: true,
                            repeat: 3,
                            onComplete: () => {
                                // Reset self position
                                gsap.to(this.selfNode.position, {
                                    duration: 1,
                                    x: 0, y: 0, z: 0,
                                    ease: "power2.inOut"
                                });
                                
                                gsap.to(this.selfNode.scale, {
                                    duration: 0.5,
                                    x: 1, y: 1, z: 1,
                                    ease: "power2.inOut",
                                    onComplete: () => {
                                        isAnimating = false;
                                    }
                                });
                            }
                        });
                    }
                });
                break;
                
            case 4: // Container
                // Create a temporary container box
                const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
                const boxMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.2,
                    wireframe: true
                });
                const box = new THREE.Mesh(boxGeometry, boxMaterial);
                this.scene.add(box);
                
                // Try to contain both in the same box
                gsap.to(node.position, {
                    duration: 1,
                    x: 0.3,
                    y: 0,
                    z: 0.3,
                    ease: "power2.inOut"
                });
                
                // Fade in the box
                gsap.to(boxMaterial, {
                    duration: 0.5,
                    opacity: 0.5
                });
                
                // After delay, show the relationship fails
                setTimeout(() => {
                    // Make the box dissipate
                    gsap.to(boxMaterial, {
                        duration: 0.5,
                        opacity: 0,
                        onComplete: () => {
                            this.scene.remove(box);
                            this.resetNode(index);
                        }
                    });
                }, 2000);
                break;
        }
    }
    
    resetNode(index) {
        const node = this.nodes[index];
        
        gsap.to(node.position, {
            duration: 1,
            x: node.userData.originalPosition.x,
            y: node.userData.originalPosition.y,
            z: node.userData.originalPosition.z,
            ease: "power2.inOut"
        });
        
        gsap.to(node.scale, {
            duration: 0.5,
            x: 1, y: 1, z: 1,
            ease: "power2.inOut"
        });
        
        gsap.to(node.material, {
            duration: 0.5,
            opacity: 1,
            transparent: false,
            onComplete: () => {
                isAnimating = false;
            }
        });
    }
    
    resetNodes() {
        if (isAnimating) return;
        isAnimating = true;
        
        for (let i = 0; i < this.nodes.length; i++) {
            this.resetNode(i);
        }
        
        // Reset self node
        gsap.to(this.selfNode.position, {
            duration: 1,
            x: 0, y: 0, z: 0,
            ease: "power2.inOut"
        });
        
        gsap.to(this.selfNode.scale, {
            duration: 0.5,
            x: 1, y: 1, z: 1,
            ease: "power2.inOut"
        });
        
        gsap.to(this.selfNode.material, {
            duration: 0.5,
            emissiveIntensity: 0.3,
            onComplete: () => {
                isAnimating = false;
            }
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        if (!isAnimating) {
            // Rotate self node slowly
            this.selfNode.rotation.y = time * 0.3;
            
            // Make nodes slightly orbit around their positions
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                const originalPos = node.userData.originalPosition;
                const orbitRadius = 0.1;
                const orbitSpeed = 0.5 + i * 0.2;
                
                node.position.x = originalPos.x + Math.cos(time * orbitSpeed) * orbitRadius;
                node.position.z = originalPos.z + Math.sin(time * orbitSpeed) * orbitRadius;
                
                // Update connection positions
                const connection = this.connections[i];
                const positions = connection.geometry.attributes.position.array;
                
                // Start point (self)
                positions[0] = this.selfNode.position.x;
                positions[1] = this.selfNode.position.y;
                positions[2] = this.selfNode.position.z;
                
                // End point (node)
                positions[3] = node.position.x;
                positions[4] = node.position.y;
                positions[5] = node.position.z;
                
                connection.geometry.attributes.position.needsUpdate = true;
            }
        }
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class QuantumFluctuationsAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create vacuum field
        this.createVacuumField();
        
        // Create particles that will appear and disappear
        this.particles = new THREE.Group();
        this.scene.add(this.particles);
        
        // Add button controls
        this.addControls();
        
        // Set up camera
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 3,
            z: 6,
            ease: "power2.inOut"
        });
        
        // Start automatic fluctuations
        this.automaticFluctuationsEnabled = true;
        this.nextFluctuation();
    }
    
    createVacuumField() {
        // Create a grid to represent the vacuum field
        const gridSize = 10;
        const gridDivisions = 20;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x0088ff, 0x001133);
        gridHelper.position.y = -1;
        this.scene.add(gridHelper);
        
        // Create energy field points
        this.fieldPoints = new THREE.Group();
        
        const fieldGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const fieldMaterial = new THREE.MeshBasicMaterial({
            color: 0x0077ff,
            transparent: true,
            opacity: 0.3
        });
        
        for (let x = -4; x <= 4; x += 1) {
            for (let z = -4; z <= 4; z += 1) {
                const point = new THREE.Mesh(fieldGeometry, fieldMaterial.clone());
                
                point.position.set(x, 0, z);
                point.userData.originalY = 0;
                point.userData.phaseOffset = Math.random() * Math.PI * 2;
                
                this.fieldPoints.add(point);
            }
        }
        
        this.scene.add(this.fieldPoints);
    }
    
    addControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Button to trigger fluctuation
        const fluctuateBtn = document.createElement('button');
        fluctuateBtn.textContent = 'Create Fluctuation';
        fluctuateBtn.style.display = 'block';
        fluctuateBtn.style.margin = '5px';
        fluctuateBtn.style.padding = '8px 12px';
        fluctuateBtn.style.background = '#0088ff';
        fluctuateBtn.style.color = 'white';
        fluctuateBtn.style.border = 'none';
        fluctuateBtn.style.borderRadius = '5px';
        fluctuateBtn.style.cursor = 'pointer';
        fluctuateBtn.addEventListener('click', () => this.createFluctuation());
        controlDiv.appendChild(fluctuateBtn);
        
        // Toggle automatic fluctuations
        const toggleAutoBtn = document.createElement('button');
        toggleAutoBtn.textContent = 'Toggle Auto Fluctuations';
        toggleAutoBtn.style.display = 'block';
        toggleAutoBtn.style.margin = '5px';
        toggleAutoBtn.style.padding = '8px 12px';
        toggleAutoBtn.style.background = '#444444';
        toggleAutoBtn.style.color = 'white';
        toggleAutoBtn.style.border = 'none';
        toggleAutoBtn.style.borderRadius = '5px';
        toggleAutoBtn.style.cursor = 'pointer';
        toggleAutoBtn.addEventListener('click', () => {
            this.automaticFluctuationsEnabled = !this.automaticFluctuationsEnabled;
            toggleAutoBtn.textContent = this.automaticFluctuationsEnabled ? 
                'Disable Auto Fluctuations' : 'Enable Auto Fluctuations';
            
            if (this.automaticFluctuationsEnabled) {
                this.nextFluctuation();
            }
        });
        controlDiv.appendChild(toggleAutoBtn);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
    }
    
    createFluctuation() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Create a ripple in the field
        const fieldPoints = this.fieldPoints.children;
        const centerX = (Math.random() * 8) - 4;
        const centerZ = (Math.random() * 8) - 4;
        
        for (let i = 0; i < fieldPoints.length; i++) {
            const point = fieldPoints[i];
            const distance = Math.sqrt(
                Math.pow(point.position.x - centerX, 2) + 
                Math.pow(point.position.z - centerZ, 2)
            );
            
            // Ripple effect with delay based on distance
            gsap.to(point.position, {
                duration: 0.5,
                y: 0.5 * Math.exp(-distance / 1.5),
                delay: distance * 0.1,
                ease: "sine.out",
                onComplete: () => {
                    gsap.to(point.position, {
                        duration: 0.5,
                        y: point.userData.originalY,
                        ease: "sine.in"
                    });
                }
            });
        }
        
        // Create particle-antiparticle pair
        const particleGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        
        // Particle
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x0088ff,
            emissive: 0x0044aa,
            roughness: 0.2,
            metalness: 0.8
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(centerX, 0.3, centerZ);
        
        // Antiparticle
        const antiparticleMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4400,
            emissive: 0xaa2200,
            roughness: 0.2,
            metalness: 0.8
        });
        const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial);
        antiparticle.position.set(centerX, 0.3, centerZ);
        
        this.particles.add(particle);
        this.particles.add(antiparticle);
        
        // Create connection between particles
        const points = [
            particle.position,
            antiparticle.position
        ];
        const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        this.particles.add(connection);
        
        // Animate particles moving apart
        gsap.to(particle.position, {
            duration: 1,
            x: centerX + 0.5,
            y: 0.6,
            z: centerZ + 0.5,
            ease: "power2.out"
        });
        
        gsap.to(antiparticle.position, {
            duration: 1,
            x: centerX - 0.5,
            y: 0.6,
            z: centerZ - 0.5,
            ease: "power2.out",
            onComplete: () => {
                // After separating, animate them returning to the vacuum
                setTimeout(() => {
                    gsap.to([particle.position, antiparticle.position], {
                        duration: 1,
                        x: centerX,
                        y: 0,
                        z: centerZ,
                        ease: "power2.in",
                        onComplete: () => {
                            // Remove the particles and connection
                            this.particles.remove(particle);
                            this.particles.remove(antiparticle);
                            this.particles.remove(connection);
                            isAnimating = false;
                        }
                    });
                    
                    // Fade out particles
                    gsap.to([particle.material, antiparticle.material, connectionMaterial], {
                        duration: 0.5,
                        opacity: 0,
                        transparent: true,
                        delay: 0.5
                    });
                }, 1000);
            }
        });
        
        // Update connection line during animation
        const updateConnection = () => {
            const positions = connection.geometry.attributes.position.array;
            
            // Start point (particle)
            positions[0] = particle.position.x;
            positions[1] = particle.position.y;
            positions[2] = particle.position.z;
            
            // End point (antiparticle)
            positions[3] = antiparticle.position.x;
            positions[4] = antiparticle.position.y;
            positions[5] = antiparticle.position.z;
            
            connection.geometry.attributes.position.needsUpdate = true;
            
            if (this.particles.children.includes(connection)) {
                requestAnimationFrame(updateConnection);
            }
        };
        
        updateConnection();
    }
    
    nextFluctuation() {
        if (this.automaticFluctuationsEnabled) {
            const delay = 2000 + Math.random() * 3000; // 2-5 seconds
            setTimeout(() => {
                if (!isAnimating && this.automaticFluctuationsEnabled) {
                    this.createFluctuation();
                }
                this.nextFluctuation();
            }, delay);
        }
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Gentle wave movement of field points when not animating
        if (!isAnimating) {
            const fieldPoints = this.fieldPoints.children;
            for (let i = 0; i < fieldPoints.length; i++) {
                const point = fieldPoints[i];
                point.position.y = point.userData.originalY + 
                    Math.sin(time + point.userData.phaseOffset) * 0.05;
            }
        }
    }
    
    dispose() {
        this.automaticFluctuationsEnabled = false;
        
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class DecoherenceAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create quantum system with surroundings
        this.createQuantumSystem();
        
        // Create environment particles
        this.createEnvironment();
        
        // Add controls
        this.addControls();
        
        // Setup camera
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 3,
            z: 7,
            ease: "power2.inOut"
        });
        
        this.isQuantumState = true;
    }
    
    createQuantumSystem() {
        // Create central quantum particle
        const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x44aaff,
            emissive: 0x0055aa,
            roughness: 0.2,
            metalness: 0.8
        });
        this.quantumParticle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.scene.add(this.quantumParticle);
        
        // Create quantum cloud (representing superposition)
        this.quantumCloud = new THREE.Group();
        
        const cloudGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true
        });
        
        for (let i = 0; i < 50; i++) {
            const cloudParticle = new THREE.Mesh(cloudGeometry, cloudMaterial.clone());
            
            // Random position in a shell around the particle
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 0.6 + Math.random() * 0.4;
            
            cloudParticle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            cloudParticle.material.opacity = Math.random() * 0.5 + 0.2;
            
            // Store original position and add random phase
            cloudParticle.userData.originalPosition = cloudParticle.position.clone();
            cloudParticle.userData.phase = Math.random() * Math.PI * 2;
            
            this.quantumCloud.add(cloudParticle);
        }
        
        this.scene.add(this.quantumCloud);
    }
    
    createEnvironment() {
        // Create boundary to contain the system
        const boundaryGeometry = new THREE.SphereGeometry(5, 32, 16);
        const boundaryMaterial = new THREE.MeshBasicMaterial({
            color: 0x001133,
            transparent: true,
            opacity: 0.1,
            wireframe: true,
            side: THREE.BackSide
        });
        this.boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        this.scene.add(this.boundary);
        
        // Create environment particles
        this.environmentParticles = new THREE.Group();
        
        const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMaterials = [
            new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.6 }),
            new THREE.MeshBasicMaterial({ color: 0x33ff66, transparent: true, opacity: 0.6 }),
            new THREE.MeshBasicMaterial({ color: 0x6633ff, transparent: true, opacity: 0.6 })
        ];
        
        // Create particles in random positions outside quantum system but inside boundary
        for (let i = 0; i < 30; i++) {
            const material = particleMaterials[i % particleMaterials.length].clone();
            const particle = new THREE.Mesh(particleGeometry, material);
            
            // Random position between boundary and quantum system
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 1.5 + Math.random() * 3;
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            particle.userData.originalPosition = particle.position.clone();
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            );
            
            this.environmentParticles.add(particle);
        }
        
        this.scene.add(this.environmentParticles);
    }
    
    addControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Toggle interaction button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Introduce Environment Interaction';
        toggleBtn.style.display = 'block';
        toggleBtn.style.margin = '5px';
        toggleBtn.style.padding = '8px 12px';
        toggleBtn.style.background = '#3388ff';
        toggleBtn.style.color = 'white';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.addEventListener('click', () => this.toggleInteraction());
        controlDiv.appendChild(toggleBtn);
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset to Quantum State';
        resetBtn.style.display = 'block';
        resetBtn.style.margin = '5px';
        resetBtn.style.padding = '8px 12px';
        resetBtn.style.background = '#444444';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.addEventListener('click', () => this.resetToQuantumState());
        controlDiv.appendChild(resetBtn);
        
        // Add a slider to control environment intensity
        const sliderContainer = document.createElement('div');
        sliderContainer.style.margin = '10px 5px';
        
        const sliderLabel = document.createElement('label');
        sliderLabel.textContent = 'Environment Intensity:';
        sliderLabel.style.display = 'block';
        sliderLabel.style.marginBottom = '5px';
        sliderLabel.style.color = 'white';
        sliderLabel.style.fontSize = '14px';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = '30';
        slider.style.width = '100%';
        
        slider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value) / 100;
            this.updateEnvironmentIntensity(value);
        });
        
        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(slider);
        controlDiv.appendChild(sliderContainer);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
        this.interactionButton = toggleBtn;
    }
    
    toggleInteraction() {
        if (isAnimating) return;
        isAnimating = true;
        
        if (this.isQuantumState) {
            // Transition to classical state
            this.collapseQuantumState();
            this.interactionButton.textContent = 'Reset to Quantum State';
            this.isQuantumState = false;
        } else {
            // Transition back to quantum state
            this.resetToQuantumState();
            this.interactionButton.textContent = 'Introduce Environment Interaction';
            this.isQuantumState = true;
        }
    }
    
    collapseQuantumState() {
        // Environment particles gather around quantum particle
        const envParticles = this.environmentParticles.children;
        
        for (let i = 0; i < envParticles.length; i++) {
            const particle = envParticles[i];
            
            gsap.to(particle.position, {
                duration: 1.5,
                x: this.quantumParticle.position.x + (Math.random() - 0.5) * 0.8,
                y: this.quantumParticle.position.y + (Math.random() - 0.5) * 0.8,
                z: this.quantumParticle.position.z + (Math.random() - 0.5) * 0.8,
                ease: "power2.inOut",
                delay: i * 0.03
            });
        }
        
        // Quantum cloud dissipates
        gsap.to(this.quantumCloud.children.map(p => p.material), {
            duration: 1,
            opacity: 0,
            ease: "power2.in"
        });
        
        // Quantum particle becomes more defined
        gsap.to(this.quantumParticle.material, {
            duration: 1,
            emissiveIntensity: 0.1,
            onComplete: () => {
                // After a delay, spread out environment particles slightly
                setTimeout(() => {
                    for (let i = 0; i < envParticles.length; i++) {
                        const particle = envParticles[i];
                        
                        gsap.to(particle.position, {
                            duration: 0.8,
                            x: this.quantumParticle.position.x + (Math.random() - 0.5) * 1.2,
                            y: this.quantumParticle.position.y + (Math.random() - 0.5) * 1.2,
                            z: this.quantumParticle.position.z + (Math.random() - 0.5) * 1.2,
                            ease: "power1.out",
                            onComplete: () => {
                                if (i === envParticles.length - 1) {
                                    isAnimating = false;
                                }
                            }
                        });
                    }
                }, 800);
            }
        });
    }
    
    resetToQuantumState() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Environment particles return to original positions
        const envParticles = this.environmentParticles.children;
        
        for (let i = 0; i < envParticles.length; i++) {
            const particle = envParticles[i];
            
            gsap.to(particle.position, {
                duration: 1.5,
                x: particle.userData.originalPosition.x,
                y: particle.userData.originalPosition.y,
                z: particle.userData.originalPosition.z,
                ease: "power2.inOut",
                delay: i * 0.03
            });
        }
        
        // Quantum cloud reappears
        gsap.to(this.quantumCloud.children.map(p => p.material), {
            duration: 1.5,
            opacity: (index) => Math.random() * 0.5 + 0.2,
            ease: "power2.out"
        });
        
        // Quantum particle becomes more ethereal
        gsap.to(this.quantumParticle.material, {
            duration: 1,
            emissiveIntensity: 0.3,
            onComplete: () => {
                isAnimating = false;
                this.isQuantumState = true;
                if (this.interactionButton) {
                    this.interactionButton.textContent = 'Introduce Environment Interaction';
                }
            }
        });
    }
    
    updateEnvironmentIntensity(value) {
        // Change number of active environment particles based on slider value
        const envParticles = this.environmentParticles.children;
        const activeCount = Math.floor(envParticles.length * value);
        
        for (let i = 0; i < envParticles.length; i++) {
            const particle = envParticles[i];
            
            if (i < activeCount) {
                gsap.to(particle.material, {
                    duration: 0.5,
                    opacity: 0.6
                });
            } else {
                gsap.to(particle.material, {
                    duration: 0.5,
                    opacity: 0.1
                });
            }
        }
        
        // If in quantum state and intensity is high, particles become more visible
        if (this.isQuantumState && value > 0.6) {
            // Start to decohere slightly
            const cloudParticles = this.quantumCloud.children;
            for (let i = 0; i < cloudParticles.length; i++) {
                gsap.to(cloudParticles[i].material, {
                    duration: 0.5,
                    opacity: 0.2 * (1 - value)
                });
            }
        } else if (this.isQuantumState) {
            // Restore cloud visibility
            const cloudParticles = this.quantumCloud.children;
            for (let i = 0; i < cloudParticles.length; i++) {
                gsap.to(cloudParticles[i].material, {
                    duration: 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Animate quantum cloud in quantum state
        if (this.isQuantumState && !isAnimating) {
            const cloudParticles = this.quantumCloud.children;
            
            for (let i = 0; i < cloudParticles.length; i++) {
                const particle = cloudParticles[i];
                const originalPos = particle.userData.originalPosition;
                const phase = particle.userData.phase;
                
                // Orbital movement around original position
                particle.position.x = originalPos.x + Math.sin(time * 0.5 + phase) * 0.1;
                particle.position.y = originalPos.y + Math.cos(time * 0.7 + phase) * 0.1;
                particle.position.z = originalPos.z + Math.sin(time * 0.3 + phase) * 0.1;
            }
        }
        
        // Animate environment particles
        if (!isAnimating) {
            const envParticles = this.environmentParticles.children;
            
            for (let i = 0; i < envParticles.length; i++) {
                const particle = envParticles[i];
                
                if (!this.isQuantumState) {
                    // In classical state, particles stay closer to quantum particle
                    const targetPos = this.quantumParticle.position.clone();
                    const dirToTarget = new THREE.Vector3().subVectors(targetPos, particle.position);
                    const dist = dirToTarget.length();
                    
                    if (dist > 1.5) {
                        dirToTarget.normalize().multiplyScalar(0.01);
                        particle.position.add(dirToTarget);
                    } else {
                        // Random movement when near target
                        particle.position.add(new THREE.Vector3(
                            (Math.random() - 0.5) * 0.02,
                            (Math.random() - 0.5) * 0.02,
                            (Math.random() - 0.5) * 0.02
                        ));
                    }
                } else {
                    // In quantum state, particles move more freely
                    particle.position.add(particle.userData.velocity);
                    
                    // Bounce off boundary
                    const posLength = particle.position.length();
                    if (posLength > 4.5) {
                        const norm = particle.position.clone().normalize();
                        particle.userData.velocity.sub(
                            norm.multiplyScalar(2 * norm.dot(particle.userData.velocity))
                        );
                    }
                }
            }
        }
        
        // Gentle rotation of quantum particle
        this.quantumParticle.rotation.y = time * 0.3;
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class QuantumFoamAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create space-time fabric
        this.createSpaceFabric();
        
        // Create quantum foam
        this.createQuantumFoam();
        
        // Add zoom controls
        this.addZoomControls();
        
        // Set camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 4,
            z: 6,
            ease: "power2.inOut"
        });
        
        // Current zoom level
        this.zoomLevel = 1;
        this.maxZoomLevel = 4;
    }
    
    createSpaceFabric() {
        // Create a grid to represent space-time
        const gridSize = 12;
        const gridSubdivisions = 24;
        const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridSubdivisions, gridSubdivisions);
        const gridMaterial = new THREE.MeshStandardMaterial({
            color: 0x001133,
            side: THREE.DoubleSide,
            wireframe: true,
            emissive: 0x001133,
            emissiveIntensity: 0.2
        });
        
        this.spaceFabric = new THREE.Mesh(gridGeometry, gridMaterial);
        this.spaceFabric.rotation.x = Math.PI / 2;
        this.scene.add(this.spaceFabric);
        
        // Add gravitational wells (celestial bodies)
        this.celestialBodies = new THREE.Group();
        
        // Sun-like object at center
        const sunGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa22,
            emissive: 0xffaa22,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.8
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.celestialBodies.add(this.sun);
        
        // Planet-like objects
        const planetGeometries = [
            new THREE.SphereGeometry(0.3, 24, 24),
            new THREE.SphereGeometry(0.2, 24, 24),
            new THREE.SphereGeometry(0.25, 24, 24)
        ];
        
        const planetMaterials = [
            new THREE.MeshStandardMaterial({
                color: 0x3366ff,
                emissive: 0x3366ff,
                emissiveIntensity: 0.2,
                roughness: 0.4,
                metalness: 0.6
            }),
            new THREE.MeshStandardMaterial({
                color: 0x22cc88,
                emissive: 0x22cc88,
                emissiveIntensity: 0.2,
                roughness: 0.4,
                metalness: 0.6
            }),
            new THREE.MeshStandardMaterial({
                color: 0xff5533,
                emissive: 0xff5533,
                emissiveIntensity: 0.2,
                roughness: 0.4,
                metalness: 0.6
            })
        ];
        
        this.planets = [];
        
        for (let i = 0; i < 3; i++) {
            const planet = new THREE.Mesh(planetGeometries[i], planetMaterials[i]);
            const distance = (i + 1) * 2;
            planet.position.set(distance, 0, 0);
            
            // Store orbit data
            planet.userData.orbitRadius = distance;
            planet.userData.orbitSpeed = 0.1 / Math.sqrt(distance);
            planet.userData.orbitAngle = Math.random() * Math.PI * 2;
            
            this.planets.push(planet);
            this.celestialBodies.add(planet);
        }
        
        this.scene.add(this.celestialBodies);
        
        // Deform space-time fabric based on celestial bodies
        this.updateSpacetimeDeformation();
    }
    
    createQuantumFoam() {
        // Create quantum foam particles (initially hidden)
        this.quantumFoam = new THREE.Group();
        
        const foamGeometry = new THREE.SphereGeometry(0.02, 4, 4);
        const foamMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0
        });
        
        // Create grid of foam particles
        const foamGridSize = 20;
        const foamSpacing = 0.3;
        const foamOffset = (foamGridSize * foamSpacing) / 2;
        
        for (let x = 0; x < foamGridSize; x++) {
            for (let y = 0; y < foamGridSize; y++) {
                for (let z = 0; z < foamGridSize; z++) {
                    const foam = new THREE.Mesh(foamGeometry, foamMaterial.clone());
                    
                    foam.position.set(
                        (x * foamSpacing) - foamOffset,
                        (y * foamSpacing) - foamOffset,
                        (z * foamSpacing) - foamOffset
                    );
                    
                    // Add slight random offset
                    foam.position.x += (Math.random() - 0.5) * foamSpacing * 0.5;
                    foam.position.y += (Math.random() - 0.5) * foamSpacing * 0.5;
                    foam.position.z += (Math.random() - 0.5) * foamSpacing * 0.5;
                    
                    // Store original position for animation
                    foam.userData.originalPosition = foam.position.clone();
                    foam.userData.phase = Math.random() * Math.PI * 2;
                    foam.userData.amplitude = Math.random() * 0.02 + 0.005;
                    foam.userData.frequency = Math.random() * 3 + 1;
                    
                    this.quantumFoam.add(foam);
                }
            }
        }
        
        this.scene.add(this.quantumFoam);
    }
    
    updateSpacetimeDeformation() {
        // Deform the space-time grid based on celestial bodies
        const positions = this.spaceFabric.geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            let y = 0;
            
            // Calculate gravitational wells
            for (let j = 0; j < this.celestialBodies.children.length; j++) {
                const body = this.celestialBodies.children[j];
                const distance = Math.sqrt(
                    Math.pow(x - body.position.x, 2) + 
                    Math.pow(z - body.position.z, 2)
                );
                
                // Mass is proportional to sphere radius
                const mass = body.geometry.parameters.radius * 2;
                
                // Deformation is inverse to distance
                const deformation = -mass / (distance + 0.5);
                y += deformation;
            }
            
            positions.setY(i, y);
        }
        
        this.spaceFabric.geometry.attributes.position.needsUpdate = true;
        this.spaceFabric.geometry.computeVertexNormals();
    }
    
    addZoomControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Zoom in button
        const zoomInBtn = document.createElement('button');
        zoomInBtn.textContent = 'Zoom In';
        zoomInBtn.style.display = 'block';
        zoomInBtn.style.margin = '5px';
        zoomInBtn.style.padding = '8px 12px';
        zoomInBtn.style.background = '#22aaff';
        zoomInBtn.style.color = 'white';
        zoomInBtn.style.border = 'none';
        zoomInBtn.style.borderRadius = '5px';
        zoomInBtn.style.cursor = 'pointer';
        zoomInBtn.addEventListener('click', () => this.zoomIn());
        controlDiv.appendChild(zoomInBtn);
        
        // Zoom out button
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.textContent = 'Zoom Out';
        zoomOutBtn.style.display = 'block';
        zoomOutBtn.style.margin = '5px';
        zoomOutBtn.style.padding = '8px 12px';
        zoomOutBtn.style.background = '#444444';
        zoomOutBtn.style.color = 'white';
        zoomOutBtn.style.border = 'none';
        zoomOutBtn.style.borderRadius = '5px';
        zoomOutBtn.style.cursor = 'pointer';
        zoomOutBtn.addEventListener('click', () => this.zoomOut());
        controlDiv.appendChild(zoomOutBtn);
        
        // Zoom level indicator
        const zoomIndicator = document.createElement('div');
        zoomIndicator.textContent = 'Scale: Macro (celestial)';
        zoomIndicator.style.color = 'white';
        zoomIndicator.style.fontSize = '14px';
        zoomIndicator.style.marginTop = '10px';
        zoomIndicator.style.textAlign = 'center';
        controlDiv.appendChild(zoomIndicator);
        
        this.zoomIndicator = zoomIndicator;
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
    }
    
    zoomIn() {
        if (isAnimating || this.zoomLevel >= this.maxZoomLevel) return;
        isAnimating = true;
        
        this.zoomLevel++;
        this.updateZoom();
    }
    
    zoomOut() {
        if (isAnimating || this.zoomLevel <= 1) return;
        isAnimating = true;
        
        this.zoomLevel--;
        this.updateZoom();
    }
    
    updateZoom() {
        // Update zoom indicator text
        const zoomTexts = [
            'Scale: Macro (celestial)',
            'Scale: Micro (atomic)',
            'Scale: Nano (subatomic)',
            'Scale: Planck (quantum foam)'
        ];
        
        this.zoomIndicator.textContent = zoomTexts[this.zoomLevel - 1];
        
        // Animate based on zoom level
        switch(this.zoomLevel) {
            case 1: // Macro scale - celestial bodies visible
                this.zoomToMacroScale();
                break;
            case 2: // Micro scale - atomic level
                this.zoomToMicroScale();
                break;
            case 3: // Nano scale - subatomic
                this.zoomToNanoScale();
                break;
            case 4: // Planck scale - quantum foam visible
                this.zoomToQuantumScale();
                break;
        }
    }
    
    zoomToMacroScale() {
        // Hide quantum foam
        gsap.to(this.quantumFoam.children.map(p => p.material), {
            duration: 0.5,
            opacity: 0
        });
        
        // Show space fabric and celestial bodies
        gsap.to(this.spaceFabric.material, {
            duration: 0.8,
            opacity: 1
        });
        
        gsap.to(this.celestialBodies.children.map(b => b.material), {
            duration: 0.8,
            opacity: 1
        });
        
        // Zoom camera out
        gsap.to(camera.position, {
            duration: 1.5,
            x: 0,
            y: 4,
            z: 6,
            ease: "power2.inOut",
            onComplete: () => { isAnimating = false; }
        });
    }
    
    zoomToMicroScale() {
        // Start showing hints of quantum foam
        gsap.to(this.quantumFoam.children.map(p => p.material), {
            duration: 0.5,
            opacity: 0.05
        });
        
        // Fade space fabric
        gsap.to(this.spaceFabric.material, {
            duration: 0.8,
            opacity: 0.5
        });
        
        // Hide celestial bodies
        gsap.to(this.celestialBodies.children.map(b => b.material), {
            duration: 0.8,
            opacity: 0.5,
            scale: 0.7
        });
        
        // Zoom camera in
        gsap.to(camera.position, {
            duration: 1.5,
            x: 0,
            y: 2,
            z: 3,
            ease: "power2.inOut",
            onComplete: () => { isAnimating = false; }
        });
    }
    
    zoomToNanoScale() {
        // Show more quantum foam
        gsap.to(this.quantumFoam.children.map(p => p.material), {
            duration: 0.5,
            opacity: 0.3
        });
        
        // Further fade space fabric and celestial bodies
        gsap.to(this.spaceFabric.material, {
            duration: 0.8,
            opacity: 0.2
        });
        
        gsap.to(this.celestialBodies.children.map(b => b.material), {
            duration: 0.8,
            opacity: 0.1
        });
        
        // Zoom camera in further
        gsap.to(camera.position, {
            duration: 1.5,
            x: 0,
            y: 1,
            z: 1.5,
            ease: "power2.inOut",
            onComplete: () => { isAnimating = false; }
        });
    }
    
    zoomToQuantumScale() {
        // Fully show quantum foam
        gsap.to(this.quantumFoam.children.map(p => p.material), {
            duration: 0.8,
            opacity: p => Math.random() * 0.5 + 0.3
        });
        
        // Hide space fabric and celestial bodies
        gsap.to(this.spaceFabric.material, {
            duration: 0.5,
            opacity: 0.05
        });
        
        gsap.to(this.celestialBodies.children.map(b => b.material), {
            duration: 0.5,
            opacity: 0
        });
        
        // Maximum zoom in
        gsap.to(camera.position, {
            duration: 1.5,
            x: 0,
            y: 0.5,
            z: 0.7,
            ease: "power2.inOut",
            onComplete: () => { isAnimating = false; }
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Update planets' orbits
        for (let i = 0; i < this.planets.length; i++) {
            const planet = this.planets[i];
            planet.userData.orbitAngle += planet.userData.orbitSpeed;
            
            planet.position.x = Math.cos(planet.userData.orbitAngle) * planet.userData.orbitRadius;
            planet.position.z = Math.sin(planet.userData.orbitAngle) * planet.userData.orbitRadius;
            
            // Rotate planets
            planet.rotation.y = time * 0.5;
        }
        
        // Rotate sun
        if (this.sun) {
            this.sun.rotation.y = time * 0.2;
        }
        
        // Update spacetime deformation if not in quantum scale
        if (this.zoomLevel < 4 && !isAnimating) {
            this.updateSpacetimeDeformation();
        }
        
        // Animate quantum foam at higher zoom levels
        if (this.zoomLevel > 1) {
            const foamParticles = this.quantumFoam.children;
            
            for (let i = 0; i < foamParticles.length; i++) {
                const foam = foamParticles[i];
                const orig = foam.userData.originalPosition;
                
                // More intense fluctuations at higher zoom levels
                const fluctuationIntensity = this.zoomLevel * 0.01;
                
                foam.position.x = orig.x + Math.sin(time * foam.userData.frequency + foam.userData.phase) * foam.userData.amplitude * this.zoomLevel;
                foam.position.y = orig.y + Math.cos(time * foam.userData.frequency + foam.userData.phase * 2) * foam.userData.amplitude * this.zoomLevel;
                foam.position.z = orig.z + Math.sin(time * foam.userData.frequency + foam.userData.phase * 3) * foam.userData.amplitude * this.zoomLevel;
                
                // Random small fluctuations
                if (this.zoomLevel === 4 && Math.random() < 0.01) {
                    foam.material.opacity = Math.random() * 0.5 + 0.3;
                }
            }
        }
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class HolographicAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create holographic projection system
        this.createHolographicSystem();
        
        // Add interactive controls
        this.addControls();
        
        // Set camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 3,
            z: 6,
            ease: "power2.inOut"
        });
    }
    
    createHolographicSystem() {
        // Create 2D surface (holographic boundary)
        const boundaryGeometry = new THREE.PlaneGeometry(8, 8, 32, 32);
        const boundaryMaterial = new THREE.MeshBasicMaterial({
            color: 0x001144,
            wireframe: true,
            side: THREE.DoubleSide
        });
        this.boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        this.boundary.position.y = -2;
        this.boundary.rotation.x = Math.PI / 2;
        this.scene.add(this.boundary);
        
        // Create data points on the 2D surface
        this.dataPoints = new THREE.Group();
        
        const pointGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff
        });
        
        // Position data points in a grid pattern
        const gridSize = 10;
        const spacing = 0.6;
        const offset = (gridSize * spacing) / 2 - spacing / 2;
        
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const point = new THREE.Mesh(pointGeometry, pointMaterial.clone());
                
                point.position.set(
                    (x * spacing) - offset,
                    -2 + 0.08, // Just above the boundary
                    (z * spacing) - offset
                );
                
                // Store grid position
                point.userData.gridX = x;
                point.userData.gridZ = z;
                
                this.dataPoints.add(point);
            }
        }
        
        this.scene.add(this.dataPoints);
        
        // Create 3D holographic projection
        this.createHolographicProjection();
        
        // Add connection lines
        this.createConnectionLines();
    }
    
    createHolographicProjection() {
        // Create a 3D shape that is projected from the 2D boundary
        // We'll create a cube with faces consisting of points
        
        this.hologram = new THREE.Group();
        
        const cubeSize = 3;
        const pointGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa22,
            transparent: true,
            opacity: 0.7
        });
        
        // Create points at cube vertices and along edges
        const positions = [
            // Bottom face
            new THREE.Vector3(-cubeSize/2, 0, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, 0, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, 0, cubeSize/2),
            new THREE.Vector3(-cubeSize/2, 0, cubeSize/2),
            
            // Top face
            new THREE.Vector3(-cubeSize/2, cubeSize, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, cubeSize, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, cubeSize, cubeSize/2),
            new THREE.Vector3(-cubeSize/2, cubeSize, cubeSize/2),
            
            // Middle points on edges
            new THREE.Vector3(0, 0, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, 0, 0),
            new THREE.Vector3(0, 0, cubeSize/2),
            new THREE.Vector3(-cubeSize/2, 0, 0),
            
            new THREE.Vector3(0, cubeSize, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, cubeSize, 0),
            new THREE.Vector3(0, cubeSize, cubeSize/2),
            new THREE.Vector3(-cubeSize/2, cubeSize, 0),
            
            // Vertical edges
            new THREE.Vector3(-cubeSize/2, cubeSize/2, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, cubeSize/2, -cubeSize/2),
            new THREE.Vector3(cubeSize/2, cubeSize/2, cubeSize/2),
            new THREE.Vector3(-cubeSize/2, cubeSize/2, cubeSize/2),
            
            // Center point
            new THREE.Vector3(0, cubeSize/2, 0)
        ];
        
        this.hologramPoints = [];
        
        for (let i = 0; i < positions.length; i++) {
            const point = new THREE.Mesh(pointGeometry, pointMaterial.clone());
            point.position.copy(positions[i]);
            
            // Add random variation to opacity
            point.material.opacity = 0.5 + Math.random() * 0.5;
            
            this.hologramPoints.push(point);
            this.hologram.add(point);
        }
        
        // Create edges of the cube
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xffaa22,
            transparent: true,
            opacity: 0.3
        });
        
        const edges = [
            // Bottom face
            [0, 1], [1, 2], [2, 3], [3, 0],
            // Top face
            [4, 5], [5, 6], [6, 7], [7, 4],
            // Vertical edges
            [0, 16], [16, 4], [1, 17], [17, 5],
            [2, 18], [18, 6], [3, 19], [19, 7],
            // Center connections
            [20, 0], [20, 1], [20, 2], [20, 3],
            [20, 4], [20, 5], [20, 6], [20, 7]
        ];
        
        for (let i = 0; i < edges.length; i++) {
            const points = [
                positions[edges[i][0]],
                positions[edges[i][1]]
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, edgesMaterial.clone());
            this.hologram.add(line);
        }
        
        // Position the hologram above the 2D surface
        this.hologram.position.y = 1;
        
        // Start with hologram invisible
        this.hologram.children.forEach(child => {
            if (child.material) {
                child.material.opacity = 0;
            }
        });
        
        this.scene.add(this.hologram);
    }
    
    createConnectionLines() {
        // Create lines connecting data points to hologram
        this.connectionLines = new THREE.Group();
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0077ff,
            transparent: true,
            opacity: 0.2
        });
        
        // Connect each data point to a hologram point
        for (let i = 0; i < this.dataPoints.children.length; i++) {
            const dataPoint = this.dataPoints.children[i];
            // Find closest hologram point
            const targetPoint = this.hologramPoints[i % this.hologramPoints.length];
            
            const points = [
                dataPoint.position,
                new THREE.Vector3(
                    targetPoint.position.x + this.hologram.position.x,
                    targetPoint.position.y + this.hologram.position.y,
                    targetPoint.position.z + this.hologram.position.z
                )
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial.clone());
            
            // Store reference to connected points
            line.userData.dataPoint = dataPoint;
            line.userData.targetPoint = targetPoint;
            
            this.connectionLines.add(line);
        }
        
        // Start with connections invisible
        this.connectionLines.children.forEach(line => {
            line.material.opacity = 0;
        });
        
        this.scene.add(this.connectionLines);
    }
    
    addControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Project button
        const projectBtn = document.createElement('button');
        projectBtn.textContent = 'Project Hologram';
        projectBtn.style.display = 'block';
        projectBtn.style.margin = '5px';
        projectBtn.style.padding = '8px 12px';
        projectBtn.style.background = '#ffaa22';
        projectBtn.style.color = 'white';
        projectBtn.style.border = 'none';
        projectBtn.style.borderRadius = '5px';
        projectBtn.style.cursor = 'pointer';
        projectBtn.addEventListener('click', () => this.toggleHologram());
        controlDiv.appendChild(projectBtn);
        
        // Rotate button
        const rotateBtn = document.createElement('button');
        rotateBtn.textContent = 'Rotate Projection';
        rotateBtn.style.display = 'block';
        rotateBtn.style.margin = '5px';
        rotateBtn.style.padding = '8px 12px';
        rotateBtn.style.background = '#22aaff';
        rotateBtn.style.color = 'white';
        rotateBtn.style.border = 'none';
        rotateBtn.style.borderRadius = '5px';
        rotateBtn.style.cursor = 'pointer';
        rotateBtn.addEventListener('click', () => this.rotateHologram());
        controlDiv.appendChild(rotateBtn);
        
        // Add emotional state buttons
        const emotionLabel = document.createElement('div');
        emotionLabel.textContent = 'Change Boundary Pattern:';
        emotionLabel.style.color = 'white';
        emotionLabel.style.margin = '10px 5px 5px 5px';
        emotionLabel.style.fontSize = '14px';
        controlDiv.appendChild(emotionLabel);
        
        const emotions = [
            { name: 'Pleasant', color: '#22cc66' },
            { name: 'Unpleasant', color: '#cc2266' },
            { name: 'Neutral', color: '#66aaff' }
        ];
        
        for (let i = 0; i < emotions.length; i++) {
            const btn = document.createElement('button');
            btn.textContent = emotions[i].name;
            btn.style.display = 'inline-block';
            btn.style.margin = '2px';
            btn.style.padding = '6px 10px';
            btn.style.background = emotions[i].color;
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', () => this.changeEmotionalState(i));
            controlDiv.appendChild(btn);
        }
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
        this.projectButton = projectBtn;
        
        // Store states
        this.isHologramVisible = false;
    }
    
    toggleHologram() {
        if (isAnimating) return;
        isAnimating = true;
        
        if (!this.isHologramVisible) {
            // Show hologram
            this.projectHologram();
            this.projectButton.textContent = 'Hide Hologram';
        } else {
            // Hide hologram
            this.hideHologram();
            this.projectButton.textContent = 'Project Hologram';
        }
        
        this.isHologramVisible = !this.isHologramVisible;
    }
    
    projectHologram() {
        // Animate data points to show activity
        this.dataPoints.children.forEach((point, index) => {
            gsap.to(point.material, {
                duration: 0.3,
                opacity: 1,
                color: new THREE.Color(0x00aaff),
                delay: index * 0.01
            });
        });
        
        // Show connection lines
        this.connectionLines.children.forEach((line, index) => {
            gsap.to(line.material, {
                duration: 0.5,
                opacity: 0.3,
                delay: 0.3 + index * 0.01
            });
        });
        
        // Show hologram
        this.hologram.children.forEach((child, index) => {
            if (child.material) {
                gsap.to(child.material, {
                    duration: 0.5,
                    opacity: child.type === 'Mesh' ? 0.7 : 0.3,
                    delay: 0.5 + index * 0.02,
                    onComplete: () => {
                        if (index === this.hologram.children.length - 1) {
                            isAnimating = false;
                        }
                    }
                });
            }
        });
        
        // Move camera to better view the hologram
        gsap.to(camera.position, {
            duration: 2,
            x: 2,
            y: 3,
            z: 5,
            ease: "power2.inOut"
        });
    }
    
    hideHologram() {
        // Hide hologram
        this.hologram.children.forEach((child, index) => {
            if (child.material) {
                gsap.to(child.material, {
                    duration: 0.5,
                    opacity: 0,
                    delay: index * 0.01
                });
            }
        });
        
        // Hide connection lines
        this.connectionLines.children.forEach((line, index) => {
            gsap.to(line.material, {
                duration: 0.5,
                opacity: 0,
                delay: 0.3 + index * 0.01
            });
        });
        
        // Return data points to normal
        this.dataPoints.children.forEach((point, index) => {
            gsap.to(point.material, {
                duration: 0.3,
                opacity: 1,
                color: new THREE.Color(0x00aaff),
                delay: 0.5 + index * 0.01,
                onComplete: () => {
                    if (index === this.dataPoints.children.length - 1) {
                        isAnimating = false;
                    }
                }
            });
        });
        
        // Reset camera
        gsap.to(camera.position, {
            duration: 2,
            x: 0,
            y: 3,
            z: 6,
            ease: "power2.inOut"
        });
    }
    
    rotateHologram() {
        if (!this.isHologramVisible || isAnimating) return;
        
        isAnimating = true;
        
        // Rotate the hologram
        gsap.to(this.hologram.rotation, {
            duration: 2,
            y: this.hologram.rotation.y + Math.PI/2,
            ease: "power2.inOut",
            onComplete: () => {
                // Update connection lines
                this.updateConnectionLines();
                isAnimating = false;
            }
        });
    }
    
    updateConnectionLines() {
        // Update connection lines positions
        this.connectionLines.children.forEach(line => {
            const dataPoint = line.userData.dataPoint;
            const targetPoint = line.userData.targetPoint;
            
            const targetPosition = new THREE.Vector3(
                targetPoint.position.x + this.hologram.position.x,
                targetPoint.position.y + this.hologram.position.y,
                targetPoint.position.z + this.hologram.position.z
            );
            
            // Apply hologram rotation
            targetPosition.applyEuler(this.hologram.rotation);
            
            // Update line geometry
            const positions = line.geometry.attributes.position.array;
            
            // Start point (data point)
            positions[0] = dataPoint.position.x;
            positions[1] = dataPoint.position.y;
            positions[2] = dataPoint.position.z;
            
            // End point (hologram point)
            positions[3] = targetPosition.x;
            positions[4] = targetPosition.y;
            positions[5] = targetPosition.z;
            
            line.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    changeEmotionalState(emotionIndex) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Define color schemes for different emotional states
        const colorSchemes = [
            { boundary: 0x00aa44, points: 0x22cc66, hologram: 0x44ee88 }, // Pleasant
            { boundary: 0xaa0044, points: 0xcc2266, hologram: 0xee4488 }, // Unpleasant
            { boundary: 0x0066aa, points: 0x0088cc, hologram: 0x00aaff }  // Neutral
        ];
        
        const scheme = colorSchemes[emotionIndex];
        
        // Change boundary color
        gsap.to(this.boundary.material.color, {
            duration: 0.5,
            r: ((scheme.boundary >> 16) & 255) / 255,
            g: ((scheme.boundary >> 8) & 255) / 255,
            b: (scheme.boundary & 255) / 255
        });
        
        // Change data points color
        this.dataPoints.children.forEach((point, index) => {
            gsap.to(point.material.color, {
                duration: 0.5,
                r: ((scheme.points >> 16) & 255) / 255,
                g: ((scheme.points >> 8) & 255) / 255,
                b: (scheme.points & 255) / 255,
                delay: index * 0.01
            });
        });
        
        // Change hologram and connection colors if visible
        if (this.isHologramVisible) {
            // Hologram
            this.hologram.children.forEach((child, index) => {
                if (child.material && child.material.color) {
                    gsap.to(child.material.color, {
                        duration: 0.5,
                        r: ((scheme.hologram >> 16) & 255) / 255,
                        g: ((scheme.hologram >> 8) & 255) / 255,
                        b: (scheme.hologram & 255) / 255,
                        delay: index * 0.01
                    });
                }
            });
            
            // Connection lines
            this.connectionLines.children.forEach((line, index) => {
                gsap.to(line.material.color, {
                    duration: 0.5,
                    r: ((scheme.points >> 16) & 255) / 255,
                    g: ((scheme.points >> 8) & 255) / 255,
                    b: (scheme.points & 255) / 255,
                    delay: index * 0.005,
                    onComplete: () => {
                        if (index === this.connectionLines.children.length - 1) {
                            isAnimating = false;
                        }
                    }
                });
            });
        } else {
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }
        
        // Create a ripple effect on the boundary
        this.createBoundaryRipple(emotionIndex);
    }
    
    createBoundaryRipple(emotionIndex) {
        // Colors for ripple based on emotion
        const rippleColors = [
            0x44ee88, // Pleasant - green
            0xee4488, // Unpleasant - red
            0x00aaff  // Neutral - blue
        ];
        
        const color = rippleColors[emotionIndex];
        
        // Create a ripple geometry
        const rippleGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
        const rippleMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        ripple.position.y = -1.99; // Just above the boundary
        ripple.rotation.x = -Math.PI / 2;
        
        this.scene.add(ripple);
        
        // Animate ripple expanding
        gsap.to(ripple.scale, {
            duration: 2,
            x: 15,
            y: 15,
            z: 1,
            ease: "power1.out"
        });
        
        gsap.to(rippleMaterial, {
            duration: 2,
            opacity: 0,
            onComplete: () => {
                this.scene.remove(ripple);
                rippleGeometry.dispose();
                rippleMaterial.dispose();
            }
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Animate data points gently pulsing
        if (!isAnimating) {
            this.dataPoints.children.forEach((point, index) => {
                const pulse = Math.sin(time * 2 + index * 0.2) * 0.05 + 0.95;
                point.scale.set(pulse, pulse, pulse);
            });
            
            // Make hologram points shimmer if visible
            if (this.isHologramVisible) {
                this.hologramPoints.forEach((point, index) => {
                    point.material.opacity = 0.5 + Math.sin(time * 2 + index) * 0.2;
                });
            }
        }
        
        // Rotate hologram slowly
        if (this.isHologramVisible && !isAnimating) {
            this.hologram.rotation.y += 0.002;
            this.updateConnectionLines();
        }
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class UncertaintyPrincipleAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create quantum particle
        this.createQuantumParticle();
        
        // Create position and momentum visualizations
        this.createMeasurementVisualizations();
        
        // Create interactive controls
        this.addControls();
        
        // Set camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 2,
            z: 6,
            ease: "power2.inOut"
        });
        
        // Initialize uncertainty state
        this.positionCertainty = 0.5; // Middle value (medium certainty)
    }
    
    createQuantumParticle() {
        // Create electron
        const electronGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const electronMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0066cc,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.8
        });
        this.electron = new THREE.Mesh(electronGeometry, electronMaterial);
        this.scene.add(this.electron);
        
        // Create wave appearance around electron
        this.createWaveFunction();
    }
    
    createWaveFunction() {
        this.waveFunction = new THREE.Group();
        
        // Create probability cloud
        const cloudGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true
        });
        
        // Create wave particles
        this.waveParticles = [];
        
        for (let i = 0; i < 100; i++) {
            const particle = new THREE.Mesh(cloudGeometry, cloudMaterial.clone());
            
            // Initial random positions in a cloud
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 0.4 + Math.random() * 2.0;
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Store original position and phase
            particle.userData.originalRadius = radius;
            particle.userData.theta = theta;
            particle.userData.phi = phi;
            particle.userData.phase = Math.random() * Math.PI * 2;
            
            // Random opacity
            particle.material.opacity = Math.random() * 0.4 + 0.1;
            
            this.waveParticles.push(particle);
            this.waveFunction.add(particle);
        }
        
        this.scene.add(this.waveFunction);
    }
    
    createMeasurementVisualizations() {
        // Position measurement visualization - grid
        this.positionGrid = new THREE.Group();
        
        const gridGeometry = new THREE.PlaneGeometry(8, 4, 16, 8);
        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0x0066aa,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -1.5;
        
        this.positionGrid.add(grid);
        
        // Position markers
        const markerGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.7
        });
        
        for (let x = -3.5; x <= 3.5; x += 1) {
            const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
            marker.position.set(x, -1.45, 0);
            this.positionGrid.add(marker);
        }
        
        this.scene.add(this.positionGrid);
        
        // Momentum visualization - arrows
        this.momentumArrows = new THREE.Group();
        
        // Create arrow geometry (simple cone)
        const arrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xff6600 });
        this.arrows = [];
        const numArrows = 8;
        
        for (let i = 0; i < numArrows; i++) {
            const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial.clone());
            const angle = (i / numArrows) * Math.PI * 2;
            
            arrow.position.set(
                Math.cos(angle) * 0.6,
                0,
                Math.sin(angle) * 0.6
            );
            
            // Rotate arrow to point outward
            arrow.rotation.y = Math.PI - angle;
            arrow.rotation.x = Math.PI / 2;
            
            this.arrows.push(arrow);
            this.momentumArrows.add(arrow);
        }
        
        this.scene.add(this.momentumArrows);
    }
    
    addControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Create slider for position-momentum certainty
        const sliderContainer = document.createElement('div');
        sliderContainer.style.margin = '10px 5px';
        
        const sliderLabel = document.createElement('label');
        sliderLabel.textContent = 'Position-Momentum Certainty';
        sliderLabel.style.color = 'white';
        sliderLabel.style.marginBottom = '5px';
        sliderLabel.style.fontSize = '14px';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = '50'; // Start in the middle
        slider.style.width = '100%';
        slider.style.margin = '10px 0';
        
        // Add real-time update on slider move
        slider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value) / 100;
            this.updateUncertainty(value);
        });
        
        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(slider);
        controlDiv.appendChild(sliderContainer);
        
        // Add buttons for extreme cases
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        
        const positionBtn = document.createElement('button');
        positionBtn.textContent = 'Exact Position';
        positionBtn.style.flex = '1';
        positionBtn.style.margin = '5px';
        positionBtn.style.padding = '8px 12px';
        positionBtn.style.background = '#00aaff';
        positionBtn.style.color = 'white';
        positionBtn.style.border = 'none';
        positionBtn.style.borderRadius = '5px';
        positionBtn.style.cursor = 'pointer';
        positionBtn.addEventListener('click', () => {
            slider.value = '0';
            this.updateUncertainty(0);
        });
        
        const momentumBtn = document.createElement('button');
        momentumBtn.textContent = 'Exact Momentum';
        momentumBtn.style.flex = '1';
        momentumBtn.style.margin = '5px';
        momentumBtn.style.padding = '8px 12px';
        momentumBtn.style.background = '#ff6600';
        momentumBtn.style.color = 'white';
        momentumBtn.style.border = 'none';
        momentumBtn.style.borderRadius = '5px';
        momentumBtn.style.cursor = 'pointer';
        momentumBtn.addEventListener('click', () => {
            slider.value = '100';
            this.updateUncertainty(1);
        });
        
        buttonContainer.appendChild(positionBtn);
        buttonContainer.appendChild(momentumBtn);
        controlDiv.appendChild(buttonContainer);
        
        // Add explanation text
        const explanationText = document.createElement('div');
        explanationText.textContent = 'Slide to see how increased certainty in position leads to decreased certainty in momentum, and vice versa.';
        explanationText.style.color = 'rgba(255,255,255,0.7)';
        explanationText.style.fontSize = '12px';
        explanationText.style.marginTop = '10px';
        explanationText.style.textAlign = 'center';
        controlDiv.appendChild(explanationText);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
        this.uncertaintySlider = slider;
    }
    
    updateUncertainty(value) {
        if (isAnimating) return;
        
        this.positionCertainty = value;
        
        // Calculate complementary value
        const momentumCertainty = 1 - value;
        
        // Update wave function visualization
        this.updateWaveFunction();
        
        // Update position grid
        const gridOpacity = 0.3 + (0.5 * value);
        this.positionGrid.children.forEach(child => {
            gsap.to(child.material, {
                duration: 0.5,
                opacity: child.geometry.type === 'PlaneGeometry' ? gridOpacity * 0.6 : gridOpacity
            });
        });
        
        // Update momentum arrows
        const arrowOpacity = 0.3 + (0.5 * momentumCertainty);
        this.arrows.forEach(arrow => {
            gsap.to(arrow.material, {
                duration: 0.5,
                opacity: arrowOpacity
            });
        });
        
        // Scale arrows based on momentum certainty
        const arrowScale = 0.5 + (momentumCertainty * 2);
        gsap.to(this.momentumArrows.scale, {
            duration: 0.5,
            x: arrowScale,
            y: arrowScale,
            z: arrowScale
        });
    }
    
    updateWaveFunction() {
        // Position certainty affects how spread out the wave function is
        // High position certainty = tight wave function
        // Low position certainty = spread out wave function
        
        const spreadFactor = 0.4 + (1 - this.positionCertainty) * 2;
        
        this.waveParticles.forEach(particle => {
            const originalRadius = particle.userData.originalRadius;
            
            // Calculate new radius based on position certainty
            const newRadius = originalRadius * spreadFactor;
            
            // Calculate position
            const theta = particle.userData.theta;
            const phi = particle.userData.phi;
            
            gsap.to(particle.position, {
                duration: 0.5,
                x: newRadius * Math.sin(phi) * Math.cos(theta),
                y: newRadius * Math.sin(phi) * Math.sin(theta),
                z: newRadius * Math.cos(phi)
            });
            
            // Opacity also reflects certainty
            // High position certainty = higher opacity in a small area
            // Low position certainty = lower opacity over larger area
            const baseOpacity = 0.4 * this.positionCertainty + 0.1;
            gsap.to(particle.material, {
                duration: 0.5,
                opacity: baseOpacity * (1 - originalRadius / 3)
            });
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Animate wave function particles
        if (!isAnimating) {
            this.waveParticles.forEach(particle => {
                // Wave-like motion based on position/momentum certainty
                const frequency = 1.5 - this.positionCertainty; // Higher momentum certainty = higher frequency
                const amplitude = 0.05 + this.positionCertainty * 0.1; // Higher position certainty = higher amplitude
                
                const originalRadius = particle.userData.originalRadius;
                const spreadFactor = 0.4 + (1 - this.positionCertainty) * 2;
                const radius = originalRadius * spreadFactor;
                
                const theta = particle.userData.theta;
                const phi = particle.userData.phi;
                const phase = particle.userData.phase;
                
                // Apply wave-like displacement
                particle.position.x = (radius + Math.sin(time * frequency + phase) * amplitude) * Math.sin(phi) * Math.cos(theta);
                particle.position.y = (radius + Math.sin(time * frequency + phase) * amplitude) * Math.sin(phi) * Math.sin(theta);
                particle.position.z = (radius + Math.sin(time * frequency + phase) * amplitude) * Math.cos(phi);
            });
            
            // Gentle oscillation of electron
            this.electron.position.x = Math.sin(time * 0.5) * (0.1 * this.positionCertainty);
            this.electron.position.z = Math.cos(time * 0.5) * (0.1 * this.positionCertainty);
            
            // Rotate momentum arrows
            this.momentumArrows.rotation.y = time * (0.1 + (1 - this.positionCertainty) * 0.2);
        }
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class WaveParticleAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create double-slit experiment setup
        this.createDoubleSlit();
        
        // Create wave/particle
        this.createElectron();
        
        // Create detector screen
        this.createDetectorScreen();
        
        // Add interactive controls
        this.addControls();
        
        // Set camera position
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 2,
            z: 7,
            ease: "power2.inOut"
        });
        
        // Initialize state
        this.observationMode = "unobserved"; // or "observed"
        this.isAnimating = false;
    }
    
    createDoubleSlit() {
        // Create barrier with two slits
        const barrierGeometry = new THREE.BoxGeometry(6, 2, 0.2);
        const barrierMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.7,
            metalness: 0.2
        });
        this.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        this.scene.add(this.barrier);
        
        // Create slits by removing portions of the barrier
        // We'll use additional objects to create the illusion of slits
        const slitWidth = 0.5;
        const slitSpacing = 1.5;
        
        // Top portion
        const topGeometry = new THREE.BoxGeometry(6, (2 - slitWidth) / 2, 0.3);
        const topBarrier = new THREE.Mesh(topGeometry, barrierMaterial.clone());
        topBarrier.position.y = (2 + slitWidth) / 4 + slitSpacing / 2;
        this.scene.add(topBarrier);
        
        // Middle portion
        const middleGeometry = new THREE.BoxGeometry(6, slitSpacing - slitWidth, 0.3);
        const middleBarrier = new THREE.Mesh(middleGeometry, barrierMaterial.clone());
        this.scene.add(middleBarrier);
        
        // Bottom portion
        const bottomGeometry = new THREE.BoxGeometry(6, (2 - slitWidth) / 2, 0.3);
        const bottomBarrier = new THREE.Mesh(bottomGeometry, barrierMaterial.clone());
        bottomBarrier.position.y = -(2 + slitWidth) / 4 - slitSpacing / 2;
        this.scene.add(bottomBarrier);
        
        // Group all barrier parts
        this.barrierGroup = new THREE.Group();
        this.barrierGroup.add(this.barrier);
        this.barrierGroup.add(topBarrier);
        this.barrierGroup.add(middleBarrier);
        this.barrierGroup.add(bottomBarrier);
        
        // Position the barrier in the middle
        this.barrierGroup.position.z = 0;
        this.scene.add(this.barrierGroup);
    }
    
    createElectron() {
        // Create electron source
        const sourceGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
        const sourceMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0066cc,
            roughness: 0.3,
            metalness: 0.7
        });
        this.electronSource = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.electronSource.rotation.x = Math.PI / 2;
        this.electronSource.position.z = -3;
        this.scene.add(this.electronSource);
        
        // Create electron as particle
        const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const electronMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0066cc,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true
        });
        this.electron = new THREE.Mesh(electronGeometry, electronMaterial);
        this.electron.position.copy(this.electronSource.position);
        this.electron.position.y += 0.1; // Lift slightly above source
        this.scene.add(this.electron);
        
        // Create electron as wave
        this.createElectronWave();
    }
    
    createElectronWave() {
        // Create wave representation using rings
        this.electronWave = new THREE.Group();
        
        const waveCount = 5;
        this.waveRings = [];
        
        for (let i = 0; i < waveCount; i++) {
            const ringGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.copy(this.electronSource.position);
            ring.position.y += 0.1;
            ring.scale.set(0.1, 0.1, 0.1); // Start small
            
            this.waveRings.push(ring);
            this.electronWave.add(ring);
        }
        
        this.scene.add(this.electronWave);
        
        // Hide wave initially
        this.electronWave.visible = false;
    }
    
    createDetectorScreen() {
        // Create detector screen
        const screenGeometry = new THREE.PlaneGeometry(6, 4, 60, 40);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        this.detectorScreen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.detectorScreen.position.z = 3;
        this.scene.add(this.detectorScreen);
        
        // Create interference pattern texture
        this.createInterferencePattern();
        
        // Create detector particles for particle mode
        this.detectorParticles = new THREE.Group();
        const detectorGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const detectorMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0
        });
        
        // Create a grid of potential detection points
        const gridSize = 30;
        this.detectorPoints = [];
        
        for (let y = -gridSize/2; y < gridSize/2; y++) {
            for (let x = -gridSize/2; x < gridSize/2; x++) {
                const detector = new THREE.Mesh(detectorGeometry, detectorMaterial.clone());
                detector.position.set(
                    (x / gridSize) * 5,
                    (y / gridSize) * 3,
                    3.01 // Just in front of screen
                );
                this.detectorPoints.push(detector);
                this.detectorParticles.add(detector);
            }
        }
        
        this.scene.add(this.detectorParticles);
    }
    
    createInterferencePattern() {
        // Create a canvas to generate the interference pattern
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Fill with black background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw interference pattern
        ctx.fillStyle = '#0080ff';
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                // Calculate normalized position (-1 to 1)
                const nx = (x / canvas.width) * 2 - 1;
                const ny = (y / canvas.height) * 2 - 1;
                
                // Distance from center
                const d = Math.sqrt(nx * nx + ny * ny);
                
                // Double-slit pattern: two point sources
                const slit1x = 0.2;
                const slit2x = -0.2;
                
                // Distance from each slit
                const d1 = Math.sqrt((nx - slit1x) * (nx - slit1x) + ny * ny);
                const d2 = Math.sqrt((nx - slit2x) * (nx - slit2x) + ny * ny);
                
                // Phase difference creates interference
                const wavelength = 0.1;
                const phaseDiff = ((d1 - d2) / wavelength) * Math.PI * 2;
                
                // Calculate intensity using cosine of phase difference
                const intensity = (Math.cos(phaseDiff) + 1) / 2;
                
                // Apply a falloff with distance from center
                const falloff = Math.max(0, 1 - d * 0.7);
                
                // Only draw if intensity is high enough
                if (intensity > 0.1 && falloff > 0) {
                    ctx.globalAlpha = intensity * falloff * 0.6;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        this.interferenceTexture = texture;
    }
    
    addControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Launch button
        const launchBtn = document.createElement('button');
        launchBtn.textContent = 'Launch Electron';
        launchBtn.style.display = 'block';
        launchBtn.style.margin = '5px';
        launchBtn.style.padding = '8px 12px';
        launchBtn.style.background = '#00aaff';
        launchBtn.style.color = 'white';
        launchBtn.style.border = 'none';
        launchBtn.style.borderRadius = '5px';
        launchBtn.style.cursor = 'pointer';
        launchBtn.addEventListener('click', () => this.launchElectron());
        controlDiv.appendChild(launchBtn);
        
        // Toggle observation button
        const observeBtn = document.createElement('button');
        observeBtn.textContent = 'Toggle Observation';
        observeBtn.style.display = 'block';
        observeBtn.style.margin = '5px';
        observeBtn.style.padding = '8px 12px';
        observeBtn.style.background = '#ff7700';
        observeBtn.style.color = 'white';
        observeBtn.style.border = 'none';
        observeBtn.style.borderRadius = '5px';
        observeBtn.style.cursor = 'pointer';
        observeBtn.addEventListener('click', () => this.toggleObservation());
        controlDiv.appendChild(observeBtn);
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Experiment';
        resetBtn.style.display = 'block';
        resetBtn.style.margin = '5px';
        resetBtn.style.padding = '8px 12px';
        resetBtn.style.background = '#444444';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.addEventListener('click', () => this.resetExperiment());
        controlDiv.appendChild(resetBtn);
        
        // Status text
        const statusText = document.createElement('div');
        statusText.textContent = 'Mode: Wave (Unobserved)';
        statusText.style.color = 'white';
        statusText.style.marginTop = '10px';
        statusText.style.textAlign = 'center';
        statusText.style.fontSize = '14px';
        controlDiv.appendChild(statusText);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
        this.statusText = statusText;
        this.launchButton = launchBtn;
    }
    
    toggleObservation() {
        if (this.isAnimating) return;
        
        if (this.observationMode === "unobserved") {
            this.observationMode = "observed";
            this.statusText.textContent = 'Mode: Particle (Observed)';
            
            // Add an observer at one of the slits
            this.addObserver();
        } else {
            this.observationMode = "unobserved";
            this.statusText.textContent = 'Mode: Wave (Unobserved)';
            
            // Remove the observer
            this.removeObserver();
        }
        
        // Reset detector screen
        this.resetDetector();
    }
    
    addObserver() {
        // Create a detector/camera at one of the slits
        const observerGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const observerMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff3300,
            roughness: 0.3,
            metalness: 0.7
        });
        this.observer = new THREE.Mesh(observerGeometry, observerMaterial);
        
        // Position at the top slit
        this.observer.position.set(0, 0.75, 0.2);
        this.scene.add(this.observer);
        
        // Add a lens/eye to the observer
        const lensGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const lensMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
        this.observerLens = new THREE.Mesh(lensGeometry, lensMaterial);
        this.observerLens.rotation.x = Math.PI / 2;
        this.observerLens.position.set(0, 0, 0.15);
        this.observer.add(this.observerLens);
        
        // Add a spotlight to show it's observing
        const spotLight = new THREE.SpotLight(0xff6600, 1);
        spotLight.position.set(0, 0, 0.2);
        spotLight.target.position.set(0, 0, -1);
        spotLight.angle = 0.3;
        spotLight.penumbra = 0.2;
        spotLight.distance = 2;
        spotLight.intensity = 2;
        this.observer.add(spotLight);
        this.observer.add(spotLight.target);
    }
    
    removeObserver() {
        if (this.observer) {
            this.scene.remove(this.observer);
            this.observer = null;
        }
    }
    
    launchElectron() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.launchButton.disabled = true;
        
        if (this.observationMode === "unobserved") {
            this.launchElectronAsWave();
        } else {
            this.launchElectronAsParticle();
        }
    }
    
    launchElectronAsWave() {
        // Hide particle, show wave
        this.electron.visible = false;
        this.electronWave.visible = true;
        
        // Reset wave rings
        this.waveRings.forEach(ring => {
            ring.position.copy(this.electronSource.position);
            ring.position.y += 0.1;
            ring.scale.set(0.1, 0.1, 0.1);
            ring.material.opacity = 0.7;
        });
        
        // Animate wave rings expanding
        this.waveRings.forEach((ring, index) => {
            gsap.to(ring.scale, {
                duration: 3,
                x: 10,
                y: 10,
                z: 10,
                delay: index * 0.3,
                ease: "power1.out"
            });
            
            gsap.to(ring.material, {
                duration: 3,
                opacity: 0,
                delay: index * 0.3 + 2,
                ease: "power1.out"
            });
        });
        
        // After wave reaches the screen, show interference pattern
        setTimeout(() => {
            // Apply interference pattern to screen
            this.detectorScreen.material.map = this.interferenceTexture;
            this.detectorScreen.material.transparent = true;
            this.detectorScreen.material.opacity = 0;
            this.detectorScreen.material.needsUpdate = true;
            
            gsap.to(this.detectorScreen.material, {
                duration: 1,
                opacity: 1,
                onComplete: () => {
                    this.isAnimating = false;
                    this.launchButton.disabled = false;
                }
            });
        }, 2000);
    }
    
    launchElectronAsParticle() {
        // Show particle, hide wave
        this.electron.visible = true;
        this.electronWave.visible = false;
        
        // Reset electron position
        this.electron.position.copy(this.electronSource.position);
        this.electron.position.y += 0.1;
        
        // Choose a random path (either top or bottom slit)
        const usesTopSlit = Math.random() > 0.5;
        const slitY = usesTopSlit ? 0.75 : -0.75;
        
        // Choose a random final position on screen
        // More likely to be directly across from the slit
        const screenY = slitY + (Math.random() - 0.5) * 2;
        const screenX = (Math.random() - 0.5) * 4;
        
        // Animate electron through slit to screen
        gsap.to(this.electron.position, {
            duration: 1,
            x: 0,
            y: slitY,
            z: 0,
            ease: "power1.inOut",
            onComplete: () => {
                // If there's an observer at the slit, flash it
                if (this.observer && ((usesTopSlit && this.observer.position.y > 0) || 
                                    (!usesTopSlit && this.observer.position.y < 0))) {
                    gsap.to(this.observerLens.material, {
                        duration: 0.1,
                        color: new THREE.Color(0xffffff),
                        yoyo: true,
                        repeat: 3
                    });
                }
                
                gsap.to(this.electron.position, {
                    duration: 1,
                    x: screenX,
                    y: screenY,
                    z: 3,
                    ease: "power1.in",
                    onComplete: () => {
                        // Electron hits the screen
                        this.electron.visible = false;
                        
                        // Add a dot to the screen
                        this.addDetectionDot(screenX, screenY);
                        
                        setTimeout(() => {
                            this.isAnimating = false;
                            this.launchButton.disabled = false;
                        }, 500);
                    }
                });
            }
        });
    }
    
    addDetectionDot(x, y) {
        // Find closest detector point
        let closestPoint = null;
        let closestDistance = Infinity;
        
        this.detectorPoints.forEach(point => {
            const dist = Math.sqrt(
                Math.pow(point.position.x - x, 2) + 
                Math.pow(point.position.y - y, 2)
            );
            
            if (dist < closestDistance) {
                closestDistance = dist;
                closestPoint = point;
            }
        });
        
        if (closestPoint) {
            // Make the point visible
            gsap.to(closestPoint.material, {
                duration: 0.3,
                opacity: 0.8
            });
        }
    }
    
    resetDetector() {
        // Clear detector screen
        if (this.detectorScreen.material.map) {
            this.detectorScreen.material.map = null;
            this.detectorScreen.material.transparent = false;
            this.detectorScreen.material.opacity = 1;
            this.detectorScreen.material.needsUpdate = true;
        }
        
        // Clear detector particles
        this.detectorPoints.forEach(point => {
            point.material.opacity = 0;
        });
    }
    
    resetExperiment() {
        if (this.isAnimating) return;
        
        // Reset everything to initial state
        this.resetDetector();
        
        // Reset electron
        this.electron.position.copy(this.electronSource.position);
        this.electron.position.y += 0.1;
        this.electron.visible = true;
        
        // Reset wave
        this.electronWave.visible = false;
        this.waveRings.forEach(ring => {
            ring.position.copy(this.electronSource.position);
            ring.position.y += 0.1;
            ring.scale.set(0.1, 0.1, 0.1);
            ring.material.opacity = 0.7;
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Gentle ambient movement
        if (!this.isAnimating) {
            // Electron source glow
            this.electronSource.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
            
            // Electron gently bobbing when at start position
            if (this.electron.visible && 
                Math.abs(this.electron.position.z - this.electronSource.position.z) < 0.2) {
                this.electron.position.y = this.electronSource.position.y + 0.1 + Math.sin(time * 3) * 0.05;
            }
            
            // Observer lens rotation
            if (this.observer) {
                this.observerLens.rotation.z = Math.sin(time * 2) * 0.2;
            }
        }
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

class FieldExcitationAnimation {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.init();
    }
    
    init() {
        clearScene(this.scene);
        
        // Create field visualization
        this.createField();
        
        // Create virtual particles
        this.createVirtualParticles();
        
        // Create interactive controls
        this.addControls();
        
        // Setup camera
        gsap.to(camera.position, { 
            duration: 2,
            x: 0,
            y: 3,
            z: 6,
            ease: "power2.inOut"
        });
        
        // Excitation state
        this.excitationLevel = 0; // 0 to 1
        this.desireLevel = 0;
        this.aversionLevel = 0;
        
        // Automatic subtle excitations
        this.enableSubtleExcitations();
    }
    
    createField() {
        // Create field as a grid
        const gridSize = 12;
        const gridDivisions = 40;
        const fieldGeometry = new THREE.PlaneGeometry(
            gridSize, gridSize, gridDivisions, gridDivisions
        );
        const fieldMaterial = new THREE.MeshStandardMaterial({
            color: 0x0055aa,
            side: THREE.DoubleSide,
            wireframe: true,
            emissive: 0x001133,
            transparent: true,
            opacity: 0.8
        });
        
        this.field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        this.field.rotation.x = Math.PI / 2;
        this.field.position.y = -1;
        this.scene.add(this.field);
        
        // Add background for field
        const bgGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: 0x000910,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        
        this.fieldBackground = new THREE.Mesh(bgGeometry, bgMaterial);
        this.fieldBackground.rotation.x = Math.PI / 2;
        this.fieldBackground.position.y = -1.05;
        this.scene.add(this.fieldBackground);
    }
    
    createVirtualParticles() {
        // Create a group for virtual particles
        this.virtualParticles = new THREE.Group();
        this.scene.add(this.virtualParticles);
        
        // Set up particle pools
        this.particlePool = [];
        const particleCount = 100;
        
        // Create particle geometries
        const desireGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const desireMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa33,
            emissive: 0xff8800,
            transparent: true,
            opacity: 0
        });
        
        const aversionGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const aversionMaterial = new THREE.MeshStandardMaterial({
            color: 0xff3366,
            emissive: 0xaa1133,
            transparent: true,
            opacity: 0
        });
        
        // Create pools of particles
        for (let i = 0; i < particleCount; i++) {
            // Desire particle
            const desireParticle = new THREE.Mesh(desireGeometry, desireMaterial.clone());
            desireParticle.userData.type = "desire";
            desireParticle.userData.active = false;
            desireParticle.visible = false;
            this.particlePool.push(desireParticle);
            this.virtualParticles.add(desireParticle);
            
            // Aversion particle
            const aversionParticle = new THREE.Mesh(aversionGeometry, aversionMaterial.clone());
            aversionParticle.userData.type = "aversion";
            aversionParticle.userData.active = false;
            aversionParticle.visible = false;
            this.particlePool.push(aversionParticle);
            this.virtualParticles.add(aversionParticle);
        }
    }
    
    addControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'verse-controls';
        controlDiv.style.position = 'absolute';
        controlDiv.style.left = '20px';
        controlDiv.style.bottom = '80px';
        controlDiv.style.zIndex = '100';
        controlDiv.style.background = 'rgba(0,0,0,0.7)';
        controlDiv.style.padding = '10px';
        controlDiv.style.borderRadius = '10px';
        
        // Sliders container
        const slidersContainer = document.createElement('div');
        
        // Pleasant/desire slider
        const desireContainer = document.createElement('div');
        desireContainer.style.margin = '10px 0';
        
        const desireLabel = document.createElement('label');
        desireLabel.textContent = 'Pleasant (Desire)';
        desireLabel.style.color = '#ffaa33';
        desireLabel.style.marginBottom = '5px';
        desireLabel.style.fontSize = '14px';
        
        const desireSlider = document.createElement('input');
        desireSlider.type = 'range';
        desireSlider.min = '0';
        desireSlider.max = '100';
        desireSlider.value = '0';
        desireSlider.style.width = '100%';
        
        desireSlider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value) / 100;
            this.updateDesireLevel(value);
        });
        
        desireContainer.appendChild(desireLabel);
        desireContainer.appendChild(desireSlider);
        slidersContainer.appendChild(desireContainer);
        
        // Unpleasant/aversion slider
        const aversionContainer = document.createElement('div');
        aversionContainer.style.margin = '10px 0';
        
        const aversionLabel = document.createElement('label');
        aversionLabel.textContent = 'Unpleasant (Aversion)';
        aversionLabel.style.color = '#ff3366';
        aversionLabel.style.marginBottom = '5px';
        aversionLabel.style.fontSize = '14px';
        
        const aversionSlider = document.createElement('input');
        aversionSlider.type = 'range';
        aversionSlider.min = '0';
        aversionSlider.max = '100';
        aversionSlider.value = '0';
        aversionSlider.style.width = '100%';
        
        aversionSlider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value) / 100;
            this.updateAversionLevel(value);
        });
        
        aversionContainer.appendChild(aversionLabel);
        aversionContainer.appendChild(aversionSlider);
        slidersContainer.appendChild(aversionContainer);
        
        controlDiv.appendChild(slidersContainer);
        
        // Excitation buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-between';
        buttonsContainer.style.margin = '10px 0';
        
        // Pleasant excitation button
        const pleasantBtn = document.createElement('button');
        pleasantBtn.textContent = 'Pleasant Event';
        pleasantBtn.style.flex = '1';
        pleasantBtn.style.margin = '0 5px';
        pleasantBtn.style.padding = '8px 12px';
        pleasantBtn.style.background = '#ffaa33';
        pleasantBtn.style.color = 'white';
        pleasantBtn.style.border = 'none';
        pleasantBtn.style.borderRadius = '5px';
        pleasantBtn.style.cursor = 'pointer';
        pleasantBtn.addEventListener('click', () => this.createFieldExcitation("desire", 0.8));
        buttonsContainer.appendChild(pleasantBtn);
        
        // Unpleasant excitation button
        const unpleasantBtn = document.createElement('button');
        unpleasantBtn.textContent = 'Unpleasant Event';
        unpleasantBtn.style.flex = '1';
        unpleasantBtn.style.margin = '0 5px';
        unpleasantBtn.style.padding = '8px 12px';
        unpleasantBtn.style.background = '#ff3366';
        unpleasantBtn.style.color = 'white';
        unpleasantBtn.style.border = 'none';
        unpleasantBtn.style.borderRadius = '5px';
        unpleasantBtn.style.cursor = 'pointer';
        unpleasantBtn.addEventListener('click', () => this.createFieldExcitation("aversion", 0.8));
        buttonsContainer.appendChild(unpleasantBtn);
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Calm Field';
        resetBtn.style.flex = '1';
        resetBtn.style.margin = '0 5px';
        resetBtn.style.padding = '8px 12px';
        resetBtn.style.background = '#444444';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.addEventListener('click', () => this.resetField());
        buttonsContainer.appendChild(resetBtn);
        
        controlDiv.appendChild(buttonsContainer);
        
        // Add explanation text
        const explanation = document.createElement('div');
        explanation.innerHTML = 'Without pleasant and unpleasant stimuli, no mental states of desire and aversion can arise.';
        explanation.style.marginTop = '10px';
        explanation.style.fontSize = '12px';
        explanation.style.color = 'rgba(255,255,255,0.8)';
        explanation.style.textAlign = 'center';
        controlDiv.appendChild(explanation);
        
        sceneContainer.appendChild(controlDiv);
        this.controlDiv = controlDiv;
        this.desireSlider = desireSlider;
        this.aversionSlider = aversionSlider;
    }
    
    updateDesireLevel(level) {
        this.desireLevel = level;
        this.updateFieldAppearance();
    }
    
    updateAversionLevel(level) {
        this.aversionLevel = level;
        this.updateFieldAppearance();
    }
    
    updateFieldAppearance() {
        // Combine desire and aversion to get overall excitation
        this.excitationLevel = Math.max(this.desireLevel, this.aversionLevel);
        
        // Update field appearance based on excitation
        this.updateFieldWaves();
        
        // Generate particles based on levels
        if (this.desireLevel > 0.1) {
            this.createFieldExcitation("desire", this.desireLevel * 0.3);
        }
        
        if (this.aversionLevel > 0.1) {
            this.createFieldExcitation("aversion", this.aversionLevel * 0.3);
        }
    }
    
    updateFieldWaves() {
        // Apply wave pattern to field based on excitation level
        const positions = this.field.geometry.attributes.position;
        const count = positions.count;
        const time = this.clock.getElapsedTime();
        
        const desireFrequency = 1.5;
        const aversionFrequency = 2.2;
        
        for (let i = 0; i < count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            
            // Distance from center
            const distance = Math.sqrt(x * x + z * z);
            
            // Combine desire and aversion waves
            let y = 0;
            
            if (this.desireLevel > 0) {
                const desireWave = Math.sin(distance * desireFrequency - time * 2) * this.desireLevel * 0.3;
                y += desireWave * Math.max(0, 1 - distance / 6);
            }
            
            if (this.aversionLevel > 0) {
                const aversionWave = Math.sin(distance * aversionFrequency - time * 3) * this.aversionLevel * 0.3;
                y += aversionWave * Math.max(0, 1 - distance / 6);
            }
            
            // Background subtle movement always present
            const subtle = Math.sin(x * 0.5 + z * 0.5 + time * 0.5) * 0.05;
            y += subtle;
            
            positions.setY(i, y);
        }
        
        this.field.geometry.attributes.position.needsUpdate = true;
        
        // Update field color based on desire and aversion
        if (this.desireLevel > 0 || this.aversionLevel > 0) {
            // Blend between blue (neutral), orange (desire), and red (aversion)
            const neutralColor = new THREE.Color(0x0055aa);
            const desireColor = new THREE.Color(0xffaa33);
            const aversionColor = new THREE.Color(0xff3366);
            
            const fieldColor = new THREE.Color();
            
            if (this.desireLevel > this.aversionLevel) {
                // Blend between neutral and desire
                fieldColor.copy(neutralColor).lerp(desireColor, this.desireLevel);
            } else {
                // Blend between neutral and aversion
                fieldColor.copy(neutralColor).lerp(aversionColor, this.aversionLevel);
            }
            
            this.field.material.color.copy(fieldColor);
            this.field.material.emissive.copy(fieldColor).multiplyScalar(0.3);
        } else {
            // Reset to neutral
            this.field.material.color.set(0x0055aa);
            this.field.material.emissive.set(0x001133);
        }
    }
    
    createFieldExcitation(type, strength) {
        // Create a burst of virtual particles
        const particleCount = Math.floor(strength * 20) + 5;
        const burstRadius = strength * 2;
        
        // Random position for excitation
        const x = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;
        
        // Create field ripple effect
        this.createRipple(x, z, type, strength);
        
        // Spawn particles
        for (let i = 0; i < particleCount; i++) {
            this.spawnParticle(x, z, type, burstRadius);
        }
    }
    
    createRipple(x, z, type, strength) {
        // Create a ripple in the field
        const positions = this.field.geometry.attributes.position;
        const count = positions.count;
        
        // Get current time for animation phase
        const time = this.clock.getElapsedTime();
        
        // Add the ripple immediately
        for (let i = 0; i < count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            
            // Distance from excitation point
            const dx = x - x;
            const dz = z - z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            // Wave ripple effect
            const ripple = Math.sin(distance * 3 - time * 10) * strength * 0.5;
            const falloff = Math.exp(-distance * 0.5);
            
            const currentY = positions.getY(i);
            positions.setY(i, currentY + ripple * falloff);
        }
        
        positions.needsUpdate = true;
    }
    
    spawnParticle(x, z, type, radius) {
        // Find an inactive particle in the pool
        let particle = null;
        
        for (let i = 0; i < this.particlePool.length; i++) {
            const p = this.particlePool[i];
            if (!p.userData.active && p.userData.type === type) {
                particle = p;
                break;
            }
        }
        
        if (!particle) return; // No available particles
        
        // Activate the particle
        particle.userData.active = true;
        particle.visible = true;
        
        // Random position around excitation point
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        particle.position.set(
            x + Math.cos(angle) * distance,
            -1 + Math.random() * 0.2,
            z + Math.sin(angle) * distance
        );
        
        // Random velocity
        const speed = 0.5 + Math.random() * 1.5;
        particle.userData.velocity = new THREE.Vector3(
            Math.cos(angle) * speed,
            1 + Math.random() * 2,
            Math.sin(angle) * speed
        );
        
        // Random size
        const scale = 0.3 + Math.random() * 0.7;
        particle.scale.set(scale, scale, scale);
        
        // Reset opacity
        particle.material.opacity = 0;
        
        // Animate particle
        gsap.to(particle.material, {
            duration: 0.3,
            opacity: 0.7 + Math.random() * 0.3,
            ease: "power1.out"
        });
        
        // Set lifetime
        const lifetime = 1 + Math.random() * 2;
        
        setTimeout(() => {
            if (particle.userData.active) {
                // Fade out
                gsap.to(particle.material, {
                    duration: 0.5,
                    opacity: 0,
                    ease: "power1.in",
                    onComplete: () => {
                        // Deactivate
                        particle.userData.active = false;
                        particle.visible = false;
                    }
                });
            }
        }, lifetime * 1000);
    }
    
    updateParticles(deltaTime) {
        this.particlePool.forEach(particle => {
            if (particle.userData.active) {
                // Update position based on velocity
                particle.position.x += particle.userData.velocity.x * deltaTime;
                particle.position.y += particle.userData.velocity.y * deltaTime;
                particle.position.z += particle.userData.velocity.z * deltaTime;
                
                // Apply gravity
                particle.userData.velocity.y -= 2 * deltaTime;
                
                // Apply drag
                particle.userData.velocity.multiplyScalar(0.98);
                
                // Rotate particle
                particle.rotation.x += deltaTime * 2;
                particle.rotation.z += deltaTime * 2;
                
                // Remove if it falls too far
                if (particle.position.y < -10) {
                    particle.userData.active = false;
                    particle.visible = false;
                }
            }
        });
    }
    
    enableSubtleExcitations() {
        // Create occasional subtle excitations
        const createRandomExcitation = () => {
            // Only create subtle excitations when manual excitation levels are low
            if (this.desireLevel < 0.3 && this.aversionLevel < 0.3) {
                const type = Math.random() > 0.5 ? "desire" : "aversion";
                const strength = Math.random() * 0.2 + 0.1;
                this.createFieldExcitation(type, strength);
            }
            
            // Schedule next excitation
            const delay = 5000 + Math.random() * 5000;
            setTimeout(createRandomExcitation, delay);
        };
        
        // Start the cycle
        createRandomExcitation();
    }
    
    resetField() {
        // Reset sliders
        this.desireSlider.value = 0;
        this.aversionSlider.value = 0;
        
        // Reset levels
        this.desireLevel = 0;
        this.aversionLevel = 0;
        this.excitationLevel = 0;
        
        // Fade out all active particles
        this.particlePool.forEach(particle => {
            if (particle.userData.active) {
                gsap.to(particle.material, {
                    duration: 0.5,
                    opacity: 0,
                    onComplete: () => {
                        particle.userData.active = false;
                        particle.visible = false;
                    }
                });
            }
        });
        
        // Reset field color
        gsap.to(this.field.material.color, {
            duration: 1,
            r: 0x00/255,
            g: 0x55/255,
            b: 0xaa/255
        });
        
        gsap.to(this.field.material.emissive, {
            duration: 1,
            r: 0x00/255,
            g: 0x11/255,
            b: 0x33/255
        });
        
        // Smooth out field waves
        const positions = this.field.geometry.attributes.position;
        const count = positions.count;
        
        for (let i = 0; i < count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            
            // Subtle background movement
            const subtle = Math.sin(x * 0.5 + z * 0.5 + this.clock.getElapsedTime() * 0.5) * 0.05;
            
            gsap.to({ y: positions.getY(i) }, {
                duration: 1,
                y: subtle,
                onUpdate: function() {
                    positions.setY(i, this.y);
                    positions.needsUpdate = true;
                }
            });
        }
    }
    
    update() {
        const deltaTime = this.clock.getDelta();
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update field waves
        this.updateFieldWaves();
    }
    
    dispose() {
        if (this.controlDiv && this.controlDiv.parentNode) {
            this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
    }
}

function loadVerse(index) {
    // Clear any existing controls from previous animations
    if (currentAnimation && currentAnimation.dispose) {
        currentAnimation.dispose();
    }
    
    // Update UI
    const verse = verses[index];
    verseTitleElement.textContent = verse.title;
    verseTextElement.textContent = verse.text;
    madhyamakaConceptElement.textContent = verse.madhyamakaConcept;
    quantumParallelElement.textContent = verse.quantumParallel;
    accessibleExplanationElement.textContent = verse.accessibleExplanation;
    verseIndicator.textContent = `${index + 1}/${verses.length}`;
    
    // Load the appropriate animation
    switch(verse.animationType) {
        case "electron-collapse":
            currentAnimation = new ElectronCollapseAnimation(scene);
            break;
        case "context-dependent-particle":
            currentAnimation = new ContextDependentParticleAnimation(scene);
            break;
        case "entangled-particles":
            currentAnimation = new EntangledParticlesAnimation(scene);
            break;
        case "identical-particles":
            currentAnimation = new IdenticalParticlesAnimation(scene);
            break;
        case "entangled-measurement":
            currentAnimation = new EntangledMeasurementAnimation(scene);
            break;
        case "quantum-fluctuations":
            currentAnimation = new QuantumFluctuationsAnimation(scene);
            break;
        case "decoherence":
            currentAnimation = new DecoherenceAnimation(scene);
            break;
        case "quantum-foam":
            currentAnimation = new QuantumFoamAnimation(scene);
            break;
        case "holographic":
            currentAnimation = new HolographicAnimation(scene);
            break;
        case "uncertainty-principle":
            currentAnimation = new UncertaintyPrincipleAnimation(scene);
            break;
        case "wave-particle":
            currentAnimation = new WaveParticleAnimation(scene);
            break;
        case "field-excitation":
            currentAnimation = new FieldExcitationAnimation(scene);
            break;
        default:
            // Default to a placeholder animation if specific one isn't implemented
            currentAnimation = new ElectronCollapseAnimation(scene);
    }
}

function nextVerse() {
    if (currentVerseIndex < verses.length - 1) {
        currentVerseIndex++;
        loadVerse(currentVerseIndex);
    }
}

function prevVerse() {
    if (currentVerseIndex > 0) {
        currentVerseIndex--;
        loadVerse(currentVerseIndex);
    }
}

// Event Listeners
togglePanelBtn.addEventListener('click', () => {
    const panelContent = document.querySelector('.panel-content');
    if (panelContent.style.display === 'none') {
        panelContent.style.display = 'block';
        togglePanelBtn.textContent = 'Hide';
    } else {
        panelContent.style.display = 'none';
        togglePanelBtn.textContent = 'Show';
    }
});

nextBtn.addEventListener('click', nextVerse);
prevBtn.addEventListener('click', prevVerse);

// Initialize the application
initScene();

// Helper functions
function clearScene(scene) {
    while(scene.children.length > 0) { 
        const object = scene.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
        scene.remove(object); 
    }
}