import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses } from './config.js';

// Global variables
let currentVerseIndex = 0;
let currentAnimation = null;
let isPlaying = true;
let p5Instance = null;

// DOM elements
const animationContainer = document.getElementById('animation-container');
const verseIndicator = document.getElementById('verse-indicator');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const playPauseBtn = document.getElementById('play-pause');
const resetBtn = document.getElementById('reset');
const hideControlsBtn = document.getElementById('hide-controls');
const showControlsBtn = document.getElementById('show-controls');
const controlsPanel = document.getElementById('controls-panel');
const animationSpecificControls = document.getElementById('animation-specific-controls');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const verseContent = document.getElementById('verse-content');
const madhyamakaContent = document.getElementById('madhyamaka-content');
const quantumContent = document.getElementById('quantum-content');
const accessibleContent = document.getElementById('accessible-content');

// Setup event listeners
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    
    // Check for verse in URL hash
    const hash = window.location.hash;
    if (hash.startsWith('#verse-')) {
        const verseNumber = parseInt(hash.substring(7));
        // Find the index of the verse with this number
        const verseIndex = verses.findIndex(v => v.number === verseNumber);
        if (verseIndex !== -1) {
            currentVerseIndex = verseIndex;
        }
    }
    
    loadVerse(currentVerseIndex);
}

function setupEventListeners() {
    prevVerseBtn.addEventListener('click', () => navigateVerse(-1));
    nextVerseBtn.addEventListener('click', () => navigateVerse(1));
    playPauseBtn.addEventListener('click', togglePlayPause);
    resetBtn.addEventListener('click', resetAnimation);
    hideControlsBtn.addEventListener('click', hideControls);
    showControlsBtn.addEventListener('click', showControls);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const tabName = button.getAttribute('data-tab');
            tabPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${tabName}-content`).classList.add('active');
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (currentAnimation) {
            if (currentAnimation.onResize) {
                currentAnimation.onResize();
            }
        }
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash.startsWith('#verse-')) {
            const verseNumber = parseInt(hash.substring(7));
            // Find the index of the verse with this number
            const verseIndex = verses.findIndex(v => v.number === verseNumber);
            if (verseIndex !== -1 && verseIndex !== currentVerseIndex) {
                loadVerse(verseIndex);
            }
        }
    });
}

function navigateVerse(direction) {
    const newIndex = currentVerseIndex + direction;
    if (newIndex >= 0 && newIndex < verses.length) {
        // Update URL hash without triggering hashchange event
        const verse = verses[newIndex];
        history.replaceState(null, null, `#verse-${verse.number}`);
        loadVerse(newIndex);
    }
}

function loadVerse(index) {
    currentVerseIndex = index;
    const verse = verses[index];
    
    // Update verse indicator
    verseIndicator.textContent = `Verse ${verse.number}`;
    
    // Update tab contents
    verseContent.textContent = verse.text;
    madhyamakaContent.textContent = verse.madhyamaka;
    quantumContent.textContent = verse.quantum;
    accessibleContent.textContent = verse.accessible;
    
    // Enable/disable navigation buttons
    prevVerseBtn.disabled = index === 0;
    nextVerseBtn.disabled = index === verses.length - 1;
    
    // Clear animation container
    cleanupCurrentAnimation();
    
    // Reset play/pause button
    isPlaying = true;
    playPauseBtn.textContent = 'Pause';
    
    // Create animation-specific controls
    createControls(verse.animationParams.controls);
    
    // Create new animation
    createAnimation(verse);
}

function createControls(controls) {
    // Clear existing controls
    animationSpecificControls.innerHTML = '';
    
    // Add new controls
    controls.forEach(control => {
        if (control.type === 'range') {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'control-item';
            
            const label = document.createElement('label');
            label.htmlFor = control.id;
            label.textContent = control.label;
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = control.id;
            slider.className = 'control-slider';
            slider.min = control.min;
            slider.max = control.max;
            slider.value = control.value;
            slider.step = control.step;
            
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'control-value';
            valueDisplay.textContent = control.value;
            
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
                if (currentAnimation && currentAnimation.updateControl) {
                    currentAnimation.updateControl(control.id, parseFloat(slider.value));
                }
            });
            
            controlDiv.appendChild(label);
            controlDiv.appendChild(slider);
            controlDiv.appendChild(valueDisplay);
            animationSpecificControls.appendChild(controlDiv);
        }
    });
}

function createAnimation(verse) {
    const animationType = verse.animationType;
    const params = verse.animationParams;
    
    // Create animation based on type
    switch (params.type) {
        case 'threejs':
            switch (animationType) {
                case 'contextuality':
                    currentAnimation = createQuantumContextualityAnimation();
                    break;
                case 'uncertainty':
                    currentAnimation = createUncertaintyPrincipleAnimation();
                    break;
                case 'tunneling':
                    currentAnimation = createQuantumTunnelingAnimation();
                    break;
                case 'quantumfield':
                    currentAnimation = createQuantumFieldAnimation();
                    break;
                case 'summary':
                    currentAnimation = createSummaryAnimation();
                    break;
                default:
                    console.error('Unknown Three.js animation type:', animationType);
            }
            break;
            
        case 'p5js':
            switch (animationType) {
                case 'superposition':
                    currentAnimation = createSuperpositionAnimation();
                    break;
                case 'waveparticle':
                    currentAnimation = createWaveParticleAnimation();
                    break;
                default:
                    console.error('Unknown p5.js animation type:', animationType);
            }
            break;
            
        default:
            console.error('Unknown animation type:', params.type);
    }
    
    // Add title overlay to animation
    addTitleOverlay(params.title);
}

function addTitleOverlay(title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'overlay-text';
    titleEl.id = 'animation-title';
    titleEl.textContent = title;
    titleEl.style.top = '20px';
    titleEl.style.left = '20px';
    animationContainer.appendChild(titleEl);
    
    // Fade out title after a few seconds
    setTimeout(() => {
        titleEl.style.opacity = '0';
        setTimeout(() => {
            if (titleEl.parentNode) {
                titleEl.parentNode.removeChild(titleEl);
            }
        }, 500);
    }, 3000);
}

// Animation control functions
function togglePlayPause() {
    isPlaying = !isPlaying;
    playPauseBtn.textContent = isPlaying ? 'Pause' : 'Play';
    
    if (currentAnimation) {
        if (currentAnimation.togglePlayPause) {
            currentAnimation.togglePlayPause(isPlaying);
        }
    }
}

function resetAnimation() {
    if (currentAnimation) {
        if (currentAnimation.reset) {
            currentAnimation.reset();
        } else {
            // If no reset method, reload the current verse
            loadVerse(currentVerseIndex);
        }
    }
}

function cleanupCurrentAnimation() {
    // Clean up any existing animation
    if (currentAnimation) {
        if (currentAnimation.cleanup) {
            currentAnimation.cleanup();
        }
    }
    
    // Clear animation container
    animationContainer.innerHTML = '';
    
    // Cleanup p5 instance if exists
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
}

function hideControls() {
    controlsPanel.classList.add('controls-hidden');
    hideControlsBtn.style.display = 'none';
    showControlsBtn.style.display = 'block';
}

function showControls() {
    controlsPanel.classList.remove('controls-hidden');
    hideControlsBtn.style.display = 'block';
    showControlsBtn.style.display = 'none';
}

// Three.js Animation Implementations
function createQuantumContextualityAnimation() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, animationContainer.clientWidth / animationContainer.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    animationContainer.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Create mirrors reflecting each other
    const mirrorGeometry = new THREE.PlaneGeometry(5, 5);
    const mirrorMaterial1 = new THREE.MeshStandardMaterial({ 
        color: 0x88ccff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7
    });
    const mirrorMaterial2 = new THREE.MeshStandardMaterial({ 
        color: 0xff8866,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7
    });
    
    const mirror1 = new THREE.Mesh(mirrorGeometry, mirrorMaterial1);
    const mirror2 = new THREE.Mesh(mirrorGeometry, mirrorMaterial2);
    
    mirror1.position.set(-2, 0, 0);
    mirror2.position.set(2, 0, 0);
    mirror1.rotation.y = Math.PI / 4;
    mirror2.rotation.y = -Math.PI / 4;
    
    scene.add(mirror1);
    scene.add(mirror2);
    
    // Add particles between mirrors
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    function createParticles(count) {
        particlesGroup.clear();
        
        for (let i = 0; i < count; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                emissiveIntensity: 0.5
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position particles between mirrors
            particle.position.x = (Math.random() - 0.5) * 3;
            particle.position.y = (Math.random() - 0.5) * 3;
            particle.position.z = (Math.random() - 0.5) * 3;
            
            particle.userData = {
                originalPosition: particle.position.clone(),
                speed: Math.random() * 0.01 + 0.005,
                phase: Math.random() * Math.PI * 2
            };
            
            particlesGroup.add(particle);
        }
    }
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x88ccff, 1, 10);
    pointLight1.position.set(-3, 2, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff8866, 1, 10);
    pointLight2.position.set(3, 2, 2);
    scene.add(pointLight2);
    
    camera.position.z = 10;
    
    // Initial setup
    createParticles(5);
    
    // Animation parameters
    let rotationSpeed = 0.5;
    let complexity = 5;
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (isPlaying) {
            // Update mirrors
            mirror1.rotation.y += 0.01 * rotationSpeed;
            mirror2.rotation.y -= 0.01 * rotationSpeed;
            
            // Update particles
            particlesGroup.children.forEach(particle => {
                const time = Date.now() * 0.001;
                const { originalPosition, speed, phase } = particle.userData;
                
                // Complex movement pattern
                particle.position.x = originalPosition.x + Math.sin(time * speed + phase) * (complexity * 0.1);
                particle.position.y = originalPosition.y + Math.cos(time * speed + phase) * (complexity * 0.1);
                particle.position.z = originalPosition.z + Math.sin(time * speed * 0.5) * (complexity * 0.05);
                
                // Change color based on which mirror is closer
                const dist1 = particle.position.distanceTo(mirror1.position);
                const dist2 = particle.position.distanceTo(mirror2.position);
                
                if (dist1 < dist2) {
                    particle.material.emissive.setHSL(0.6, 0.8, 0.5); // Blue
                } else {
                    particle.material.emissive.setHSL(0.05, 0.8, 0.5); // Orange
                }
                
                // Pulse size
                const scale = 0.8 + 0.4 * Math.sin(time * 2 + phase);
                particle.scale.set(scale, scale, scale);
            });
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Control handlers
    function updateControl(id, value) {
        if (id === 'rotation') {
            rotationSpeed = value;
        } else if (id === 'complexity') {
            complexity = value;
            createParticles(Math.floor(complexity));
        }
    }
    
    function togglePlayPause(playing) {
        // Handled by the global isPlaying variable
    }
    
    function reset() {
        mirror1.rotation.y = Math.PI / 4;
        mirror2.rotation.y = -Math.PI / 4;
        createParticles(Math.floor(complexity));
    }
    
    function onResize() {
        camera.aspect = animationContainer.clientWidth / animationContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    }
    
    function cleanup() {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        controls.dispose();
    }
    
    return {
        updateControl,
        togglePlayPause,
        reset,
        onResize,
        cleanup
    };
}

function createUncertaintyPrincipleAnimation() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, animationContainer.clientWidth / animationContainer.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    animationContainer.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Grid to represent position space
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
    scene.add(gridHelper);
    
    // Particles group
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    // Position measurement plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    const positionPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    positionPlane.rotation.x = Math.PI / 2;
    scene.add(positionPlane);
    
    // Momentum representation (arrows)
    const arrowsGroup = new THREE.Group();
    scene.add(arrowsGroup);
    
    // Parameters
    let precision = 1;
    let particleCount = 10;
    
    function createParticles() {
        // Clear existing particles
        while (particlesGroup.children.length > 0) {
            particlesGroup.remove(particlesGroup.children[0]);
        }
        
        while (arrowsGroup.children.length > 0) {
            arrowsGroup.remove(arrowsGroup.children[0]);
        }
        
        for (let i = 0; i < particleCount; i++) {
            // Create particle
            const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(i / particleCount, 0.8, 0.5),
                emissive: new THREE.Color().setHSL(i / particleCount, 0.8, 0.5),
                emissiveIntensity: 0.5
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random position
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 8;
            particle.position.x = Math.cos(angle) * radius;
            particle.position.z = Math.sin(angle) * radius;
            particle.position.y = 0.2;
            
            // Create uncertainty cloud
            const cloudGeometry = new THREE.SphereGeometry(1, 16, 16);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / particleCount, 0.8, 0.5),
                transparent: true,
                opacity: 0.2
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.copy(particle.position);
            
            // Store metadata
            particle.userData = {
                speed: 0.05 + Math.random() * 0.05,
                direction: new THREE.Vector3(
                    Math.random() - 0.5,
                    0,
                    Math.random() - 0.5
                ).normalize(),
                cloud: cloud,
                phase: Math.random() * Math.PI * 2
            };
            
            // Create momentum arrow
            const arrowLength = 1 + Math.random();
            const arrowDir = particle.userData.direction.clone();
            
            const arrowHelper = new THREE.ArrowHelper(
                arrowDir,
                particle.position,
                arrowLength,
                new THREE.Color().setHSL(i / particleCount, 0.8, 0.5),
                0.3,
                0.2
            );
            
            // Store the arrow with the particle
            particle.userData.arrow = arrowHelper;
            
            particlesGroup.add(particle);
            particlesGroup.add(cloud);
            arrowsGroup.add(arrowHelper);
        }
    }
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);
    
    // Initial setup
    createParticles();
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (isPlaying) {
            const time = Date.now() * 0.001;
            
            // Update particles and their uncertainty
            particlesGroup.children.forEach((object) => {
                if (object.geometry.type === 'SphereGeometry') {
                    if (object.geometry.parameters.radius < 0.5) {  // It's a particle, not a cloud
                        const particle = object;
                        const userData = particle.userData;
                        
                        // Move particle
                        particle.position.x += userData.direction.x * userData.speed;
                        particle.position.z += userData.direction.z * userData.speed;
                        
                        // Bounce off edges
                        if (Math.abs(particle.position.x) > 9 || Math.abs(particle.position.z) > 9) {
                            if (Math.abs(particle.position.x) > 9) {
                                userData.direction.x *= -1;
                                particle.position.x = Math.sign(particle.position.x) * 9;
                            }
                            if (Math.abs(particle.position.z) > 9) {
                                userData.direction.z *= -1;
                                particle.position.z = Math.sign(particle.position.z) * 9;
                            }
                        }
                        
                        // Update cloud position
                        if (userData.cloud) {
                            userData.cloud.position.copy(particle.position);
                            
                            // Uncertainty principle: inversely proportional sizes
                            // Higher precision = smaller position uncertainty, larger momentum uncertainty
                            const posUncertainty = 0.5 + (1 / precision);
                            const momUncertainty = 0.5 + precision;
                            
                            // Apply uncertainty to cloud size (position uncertainty)
                            const cloudScale = posUncertainty * (1 + 0.2 * Math.sin(time * 2 + userData.phase));
                            userData.cloud.scale.set(cloudScale, cloudScale, cloudScale);
                            
                            // Apply uncertainty to arrow (momentum uncertainty)
                            if (userData.arrow) {
                                // Update arrow position
                                userData.arrow.position.copy(particle.position);
                                
                                // Jitter the arrow direction based on momentum uncertainty
                                const jitterAmount = 0.2 * momUncertainty;
                                const jitteredDir = userData.direction.clone();
                                jitteredDir.x += (Math.random() - 0.5) * jitterAmount;
                                jitteredDir.z += (Math.random() - 0.5) * jitterAmount;
                                jitteredDir.normalize();
                                
                                userData.arrow.setDirection(jitteredDir);
                                
                                // Arrow length represents momentum magnitude
                                const arrowLength = 1 + Math.random() * momUncertainty;
                                userData.arrow.setLength(arrowLength, 0.3, 0.2);
                            }
                        }
                    }
                }
            });
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Control handlers
    function updateControl(id, value) {
        if (id === 'precision') {
            precision = value;
        } else if (id === 'particles') {
            particleCount = Math.floor(value);
            createParticles();
        }
    }
    
    function togglePlayPause(playing) {
        // Handled by the global isPlaying variable
    }
    
    function reset() {
        createParticles();
    }
    
    function onResize() {
        camera.aspect = animationContainer.clientWidth / animationContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    }
    
    function cleanup() {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        controls.dispose();
    }
    
    return {
        updateControl,
        togglePlayPause,
        reset,
        onResize,
        cleanup
    };
}

function createQuantumTunnelingAnimation() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    
    const camera = new THREE.PerspectiveCamera(75, animationContainer.clientWidth / animationContainer.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    animationContainer.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Parameters
    let barrierThickness = 2;
    let particleEnergy = 1;
    
    // Create barrier
    const barrierGeometry = new THREE.BoxGeometry(barrierThickness, 5, 10);
    const barrierMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        transparent: true,
        opacity: 0.7
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(barrier);
    
    // Particles container
    const particles = [];
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    // Energy level visualization
    const energyLevelGeometry = new THREE.PlaneGeometry(20, 1);
    const energyLevelMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const energyLevel = new THREE.Mesh(energyLevelGeometry, energyLevelMaterial);
    energyLevel.rotation.x = Math.PI / 2;
    energyLevel.position.y = 1;
    scene.add(energyLevel);
    
    // Potential well visualization
    const createPotentialWell = () => {
        // Remove old potential well if it exists
        scene.children.forEach(child => {
            if (child.userData && child.userData.isPotential) {
                scene.remove(child);
            }
        });
        
        // Create new potential well visualization
        const potentialGeometry = new THREE.PlaneGeometry(20, 5);
        const potentialMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                barrierPos: { value: 0 },
                barrierWidth: { value: barrierThickness },
                barrierHeight: { value: 4 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float barrierPos;
                uniform float barrierWidth;
                uniform float barrierHeight;
                
                void main() {
                    float x = (vUv.x - 0.5) * 20.0;
                    float halfWidth = barrierWidth * 0.5;
                    
                    float potential = 0.0;
                    if (x > -halfWidth && x < halfWidth) {
                        potential = barrierHeight;
                    }
                    
                    gl_FragColor = vec4(0.0, 0.5, 1.0, 0.15 * potential);
                }
            `
        });
        
        const potentialWell = new THREE.Mesh(potentialGeometry, potentialMaterial);
        potentialWell.rotation.x = Math.PI / 2;
        potentialWell.position.y = -1;
        potentialWell.userData = { isPotential: true };
        scene.add(potentialWell);
    };
    
    // Create particles
    const createParticle = (side) => {
        const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0088ff,
            emissiveIntensity: 0.5
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Add wave visualization
        const waveGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.3
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        particle.add(wave);
        
        // Position based on side (left or right of barrier)
        const x = side === 'left' ? -5 - Math.random() * 3 : 5 + Math.random() * 3;
        particle.position.set(x, 0, (Math.random() - 0.5) * 8);
        
        // Particle metadata
        particle.userData = {
            velocity: new THREE.Vector3(side === 'left' ? 0.05 : -0.05, 0, 0),
            energy: particleEnergy,
            wave: wave,
            tunneled: false,
            initialSide: side,
            phase: Math.random() * Math.PI * 2
        };
        
        particlesGroup.add(particle);
        particles.push(particle);
        
        return particle;
    };
    
    // Initialize scene with particles
    const initParticles = () => {
        // Clear existing particles
        while (particlesGroup.children.length > 0) {
            particlesGroup.remove(particlesGroup.children[0]);
        }
        particles.length = 0;
        
        // Create new particles
        for (let i = 0; i < 10; i++) {
            createParticle('left');
        }
    };
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
    
    // Initialize
    createPotentialWell();
    initParticles();
    
    // Update barrier
    function updateBarrier() {
        barrier.geometry.dispose();
        barrier.geometry = new THREE.BoxGeometry(barrierThickness, 5, 10);
        createPotentialWell();
    }
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (isPlaying) {
            const time = Date.now() * 0.001;
            
            // Update energy level visualization
            energyLevel.position.y = particleEnergy;
            
            // Update particles
            particles.forEach((particle, index) => {
                const userData = particle.userData;
                
                // Update position
                particle.position.x += userData.velocity.x;
                
                // Update wave visualization
                if (userData.wave) {
                    const baseScale = 0.8 + 0.4 * Math.sin(time * 5 + userData.phase);
                    userData.wave.scale.set(baseScale, baseScale, baseScale);
                }
                
                // Handle barrier interaction
                const halfBarrierWidth = barrierThickness / 2;
                if (!userData.tunneled && 
                    ((userData.initialSide === 'left' && 
                      particle.position.x > -halfBarrierWidth && 
                      particle.position.x < halfBarrierWidth) ||
                     (userData.initialSide === 'right' && 
                      particle.position.x < halfBarrierWidth && 
                      particle.position.x > -halfBarrierWidth))) {
                    
                    // Calculate tunneling probability
                    // Simple model: higher energy = higher probability
                    const barrierEnergy = 3; // Barrier height
                    const tunnelProb = Math.pow(particleEnergy / barrierEnergy, 2) * 0.5;
                    
                    if (Math.random() < tunnelProb) {
                        // Tunneling occurs
                        userData.tunneled = true;
                        particle.material.emissive.set(0x00ff00);
                        
                        // Create "ghost" particle that continues through barrier
                        const ghostParticle = particle.clone();
                        ghostParticle.material = new THREE.MeshBasicMaterial({
                            color: 0x00aaff,
                            transparent: true,
                            opacity: 0.3
                        });
                        
                        ghostParticle.userData = {
                            velocity: userData.velocity.clone(),
                            energy: userData.energy,
                            isGhost: true,
                            lifetime: 30
                        };
                        
                        particlesGroup.add(ghostParticle);
                        particles.push(ghostParticle);
                    } else {
                        // Reflection
                        userData.velocity.x *= -1;
                        userData.tunneled = true;
                        particle.material.emissive.set(0xff0000);
                    }
                }
                
                // Remove particles that go off screen or expire
                if (Math.abs(particle.position.x) > 12 || 
                    (userData.isGhost && userData.lifetime-- <= 0)) {
                    particlesGroup.remove(particle);
                    particles.splice(index, 1);
                    
                    // Create new particle to replace
                    if (!userData.isGhost) {
                        createParticle(Math.random() < 0.5 ? 'left' : 'right');
                    }
                }
            });
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Control handlers
    function updateControl(id, value) {
        if (id === 'barrier') {
            barrierThickness = value;
            updateBarrier();
        } else if (id === 'energy') {
            particleEnergy = value;
        }
    }
    
    function togglePlayPause(playing) {
        // Handled by the global isPlaying variable
    }
    
    function reset() {
        initParticles();
    }
    
    function onResize() {
        camera.aspect = animationContainer.clientWidth / animationContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    }
    
    function cleanup() {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        controls.dispose();
    }
    
    return {
        updateControl,
        togglePlayPause,
        reset,
        onResize,
        cleanup
    };
}

function createQuantumFieldAnimation() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, animationContainer.clientWidth / animationContainer.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    animationContainer.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Parameters
    let excitationLevel = 0.5;
    let fieldSize = 30;
    
    // Create quantum field
    let field;
    const createField = () => {
        if (field) scene.remove(field);
        
        // Create field grid
        const size = fieldSize;
        const segments = Math.floor(size / 2);
        
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        const material = new THREE.MeshStandardMaterial({
            color: 0x3388ff,
            wireframe: true,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        field = new THREE.Mesh(geometry, material);
        field.rotation.x = Math.PI / 2;
        
        // Store original positions for wave animation
        const positions = geometry.attributes.position.array;
        field.userData.originalPositions = [...positions];
        
        scene.add(field);
    };
    
    // Create particles (field excitations)
    const particles = [];
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    const createParticles = () => {
        // Clear existing particles
        while (particlesGroup.children.length > 0) {
            particlesGroup.remove(particlesGroup.children[0]);
        }
        particles.length = 0;
        
        // Number of particles based on excitation level
        const count = Math.floor(excitationLevel * 20);
        
        for (let i = 0; i < count; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: 0xffaa00,
                emissive: 0xff5500,
                emissiveIntensity: 0.5
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random position within field bounds
            const halfSize = fieldSize / 2 - 2;
            particle.position.set(
                (Math.random() - 0.5) * halfSize,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * halfSize
            );
            
            // Particle trail
            const trailGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const trailMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.3
            });
            
            const trail = [];
            for (let j = 0; j < 10; j++) {
                const trailSegment = new THREE.Mesh(trailGeometry, trailMaterial.clone());
                trailSegment.material.opacity = 0.3 * (1 - j / 10);
                trailSegment.scale.set(1 - j * 0.08, 1 - j * 0.08, 1 - j * 0.08);
                particlesGroup.add(trailSegment);
                trail.push(trailSegment);
            }
            
            // Store metadata
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                ),
                trail: trail,
                age: 0,
                maxAge: 100 + Math.random() * 200,
                phase: Math.random() * Math.PI * 2
            };
            
            particlesGroup.add(particle);
            particles.push(particle);
        }
    };
    
    // Wood and fire visualization
    const createWoodAndFire = () => {
        // Wood (log)
        const woodGeometry = new THREE.CylinderGeometry(1, 1, 6, 8);
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });
        const wood = new THREE.Mesh(woodGeometry, woodMaterial);
        wood.position.set(0, -2, 0);
        wood.rotation.x = Math.PI / 2;
        scene.add(wood);
        
        // Fire particles will be the quantum excitations already created
    };
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add point light to simulate fire glow
    const fireLight = new THREE.PointLight(0xff5500, 1, 10);
    fireLight.position.set(0, 0, 0);
    scene.add(fireLight);
    
    // Camera position
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);
    
    // Initialize
    createField();
    createParticles();
    createWoodAndFire();
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (isPlaying) {
            const time = Date.now() * 0.001;
            
            // Update field (wave animation)
            if (field && field.geometry) {
                const positions = field.geometry.attributes.position.array;
                const originalPositions = field.userData.originalPositions;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const x = originalPositions[i];
                    const z = originalPositions[i + 2];
                    
                    // Calculate distance from center
                    const distance = Math.sqrt(x * x + z * z);
                    
                    // Wave effect
                    const amplitude = 1.5 * excitationLevel;
                    const frequency = 1;
                    const speed = 1;
                    
                    positions[i + 1] = originalPositions[i + 1] + 
                        amplitude * Math.sin(frequency * distance - speed * time);
                }
                
                field.geometry.attributes.position.needsUpdate = true;
            }
            
            // Update fire light intensity
            fireLight.intensity = 1 + 0.5 * Math.sin(time * 3) * excitationLevel;
            
            // Update particles (field excitations)
            particles.forEach((particle, index) => {
                const userData = particle.userData;
                
                // Update position with small random movements
                particle.position.x += userData.velocity.x + (Math.random() - 0.5) * 0.02;
                particle.position.y += userData.velocity.y + (Math.random() - 0.5) * 0.02 + 
                                       Math.sin(time * 2 + userData.phase) * 0.01;
                particle.position.z += userData.velocity.z + (Math.random() - 0.5) * 0.02;
                
                // Update trail
                if (userData.trail) {
                    for (let i = userData.trail.length - 1; i > 0; i--) {
                        userData.trail[i].position.copy(userData.trail[i-1].position);
                    }
                    if (userData.trail.length > 0) {
                        userData.trail[0].position.copy(particle.position);
                    }
                }
                
                // Age particles and replace old ones
                userData.age++;
                if (userData.age > userData.maxAge) {
                    particlesGroup.remove(particle);
                    
                    // Remove trail
                    if (userData.trail) {
                        userData.trail.forEach(segment => {
                            particlesGroup.remove(segment);
                        });
                    }
                    
                    particles.splice(index, 1);
                    
                    // Maybe create a new particle
                    if (Math.random() < excitationLevel) {
                        const halfSize = fieldSize / 2 - 2;
                        
                        // Create new particle near the wood
                        const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                        const particleMaterial = new THREE.MeshStandardMaterial({
                            color: 0xffaa00,
                            emissive: 0xff5500,
                            emissiveIntensity: 0.5
                        });
                        
                        const newParticle = new THREE.Mesh(particleGeometry, particleMaterial);
                        newParticle.position.set(
                            (Math.random() - 0.5) * 3,
                            -1 + Math.random(),
                            (Math.random() - 0.5) * 3
                        );
                        
                        // New trail
                        const trailGeometry = new THREE.SphereGeometry(0.2, 8, 8);
                        const trailMaterial = new THREE.MeshBasicMaterial({
                            color: 0xffaa00,
                            transparent: true,
                            opacity: 0.3
                        });
                        
                        const trail = [];
                        for (let j = 0; j < 10; j++) {
                            const trailSegment = new THREE.Mesh(trailGeometry, trailMaterial.clone());
                            trailSegment.material.opacity = 0.3 * (1 - j / 10);
                            trailSegment.scale.set(1 - j * 0.08, 1 - j * 0.08, 1 - j * 0.08);
                            particlesGroup.add(trailSegment);
                            trail.push(trailSegment);
                        }
                        
                        // Store metadata
                        newParticle.userData = {
                            velocity: new THREE.Vector3(
                                (Math.random() - 0.5) * 0.1,
                                0.05 + Math.random() * 0.05, // Upward bias
                                (Math.random() - 0.5) * 0.1
                            ),
                            trail: trail,
                            age: 0,
                            maxAge: 100 + Math.random() * 200,
                            phase: Math.random() * Math.PI * 2
                        };
                        
                        particlesGroup.add(newParticle);
                        particles.push(newParticle);
                    }
                }
                
                // Keep particles within bounds
                const boundarySize = fieldSize / 2;
                if (Math.abs(particle.position.x) > boundarySize || 
                    Math.abs(particle.position.z) > boundarySize || 
                    particle.position.y < -3 || particle.position.y > 10) {
                    
                    // Redirect toward center
                    userData.velocity.x = -Math.sign(particle.position.x) * 0.05;
                    userData.velocity.z = -Math.sign(particle.position.z) * 0.05;
                    
                    if (particle.position.y < -3) userData.velocity.y = 0.05;
                    if (particle.position.y > 10) userData.velocity.y = -0.05;
                }
            });
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Control handlers
    function updateControl(id, value) {
        if (id === 'excitation') {
            excitationLevel = value;
            if (Math.random() < 0.2) {
                createParticles(); // Occasionally refresh particles
            }
        } else if (id === 'fieldSize') {
            fieldSize = value;
            createField();
        }
    }
    
    function togglePlayPause(playing) {
        // Handled by the global isPlaying variable
    }
    
    function reset() {
        createField();
        createParticles();
    }
    
    function onResize() {
        camera.aspect = animationContainer.clientWidth / animationContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    }
    
    function cleanup() {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        controls.dispose();
    }
    
    return {
        updateControl,
        togglePlayPause,
        reset,
        onResize,
        cleanup
    };
}

function createSummaryAnimation() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, animationContainer.clientWidth / animationContainer.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    animationContainer.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Parameters
    let objectCount = 5;
    let connectionStrength = 0.5;
    
    // Objects
    const objects = [];
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);
    
    // Connections
    const connections = [];
    const connectionsGroup = new THREE.Group();
    scene.add(connectionsGroup);
    
    // Create diverse objects (representing different phenomena)
    const createObjects = () => {
        // Clear existing objects
        while (objectsGroup.children.length > 0) {
            objectsGroup.remove(objectsGroup.children[0]);
        }
        objects.length = 0;
        
        // Clear connections
        while (connectionsGroup.children.length > 0) {
            connectionsGroup.remove(connectionsGroup.children[0]);
        }
        connections.length = 0;
        
        // Create objects
        const shapes = [
            new THREE.BoxGeometry(1, 1, 1), // Cube (jug)
            new THREE.SphereGeometry(0.7, 16, 16), // Sphere
            new THREE.ConeGeometry(0.7, 1.5, 16), // Cone
            new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16), // Cylinder
            new THREE.TorusGeometry(0.7, 0.3, 16, 32), // Torus (ring)
            new THREE.TetrahedronGeometry(0.8), // Tetrahedron
            new THREE.OctahedronGeometry(0.7), // Octahedron
            new THREE.DodecahedronGeometry(0.7) // Dodecahedron
        ];
        
        // Fire and wood at center
        const woodGeometry = new THREE.CylinderGeometry(1, 1, 2, 8);
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });
        const wood = new THREE.Mesh(woodGeometry, woodMaterial);
        wood.position.set(0, 0, 0);
        wood.rotation.x = Math.PI / 2;
        objectsGroup.add(wood);
        objects.push(wood);
        
        const fireGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const fireMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4400,
            emissive: 0xff2200,
            emissiveIntensity: 0.7
        });
        const fire = new THREE.Mesh(fireGeometry, fireMaterial);
        fire.position.set(0, 1, 0);
        objectsGroup.add(fire);
        objects.push(fire);
        
        // Create fire particles
        const particlesCount = 20;
        for (let i = 0; i < particlesCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0xff8800,
                transparent: true,
                opacity: 0.7
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(fire.position);
            particle.position.y += 0.5;
            
            // Particle metadata
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    0.05 + Math.random() * 0.05,
                    (Math.random() - 0.5) * 0.05
                ),
                age: 0,
                maxAge: 50 + Math.random() * 50,
                isFire: true
            };
            
            objectsGroup.add(particle);
            objects.push(particle);
        }
        
        // Create other objects
        for (let i = 0; i < objectCount; i++) {
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(i / objectCount, 0.8, 0.5),
                transparent: true,
                opacity: 0.8
            });
            
            const object = new THREE.Mesh(shape, material);
            
            // Position in circular pattern around center
            const angle = (i / objectCount) * Math.PI * 2;
            const radius = 4 + Math.random() * 2;
            object.position.x = Math.cos(angle) * radius;
            object.position.z = Math.sin(angle) * radius;
            object.position.y = Math.random() * 2 - 1;
            
            // Metadata
            object.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                orbit: {
                    angle: angle,
                    radius: radius,
                    speed: 0.005 + Math.random() * 0.005
                }
            };
            
            objectsGroup.add(object);
            objects.push(object);
        }
        
        // Create connections between objects
        createConnections();
    };
    
    const createConnections = () => {
        // Create connections between objects
        for (let i = 0; i < objects.length; i++) {
            const obj1 = objects[i];
            if (obj1.userData && obj1.userData.isFire) continue; // Skip fire particles
            
            for (let j = i + 1; j < objects.length; j++) {
                const obj2 = objects[j];
                if (obj2.userData && obj2.userData.isFire) continue; // Skip fire particles
                
                // Only connect some objects based on connectionStrength parameter
                if (Math.random() < connectionStrength * 0.3) {
                    const lineGeometry = new THREE.BufferGeometry();
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0x88ccff,
                        transparent: true,
                        opacity: 0.5
                    });
                    
                    // Initial line positions
                    const linePositions = new Float32Array([
                        obj1.position.x, obj1.position.y, obj1.position.z,
                        obj2.position.x, obj2.position.y, obj2.position.z
                    ]);
                    
                    lineGeometry.setAttribute('position', 
                        new THREE.BufferAttribute(linePositions, 3));
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    line.userData = {
                        obj1: obj1,
                        obj2: obj2
                    };
                    
                    connectionsGroup.add(line);
                    connections.push(line);
                }
            }
        }
    };
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Fire light
    const fireLight = new THREE.PointLight(0xff5500, 1, 10);
    fireLight.position.set(0, 1, 0);
    scene.add(fireLight);
    
    // Camera position
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    // Initialize
    createObjects();
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (isPlaying) {
            const time = Date.now() * 0.001;
            
            // Update fire light
            fireLight.intensity = 1 + 0.3 * Math.sin(time * 3);
            
            // Update objects
            objects.forEach((object, index) => {
                if (object.userData) {
                    if (object.userData.isFire) {
                        // Update fire particle
                        object.position.x += object.userData.velocity.x;
                        object.position.y += object.userData.velocity.y;
                        object.position.z += object.userData.velocity.z;
                        
                        object.userData.age++;
                        
                        // Fade out
                        if (object.userData.age > object.userData.maxAge) {
                            object.material.opacity = 1 - (object.userData.age - object.userData.maxAge) / 20;
                        }
                        
                        // Reset particle when it's faded out or moved too far
                        if (object.material.opacity <= 0 || object.position.y > 5) {
                            object.position.set(0, 1, 0);
                            object.userData.velocity = new THREE.Vector3(
                                (Math.random() - 0.5) * 0.05,
                                0.05 + Math.random() * 0.05,
                                (Math.random() - 0.5) * 0.05
                            );
                            object.userData.age = 0;
                            object.material.opacity = 0.7;
                        }
                    } else if (object.userData.rotationSpeed) {
                        // Rotate object
                        object.rotation.x += object.userData.rotationSpeed;
                        object.rotation.y += object.userData.rotationSpeed * 1.5;
                        
                        // Orbit if object has orbit data
                        if (object.userData.orbit) {
                            const orbit = object.userData.orbit;
                            orbit.angle += orbit.speed;
                            
                            object.position.x = Math.cos(orbit.angle) * orbit.radius;
                            object.position.z = Math.sin(orbit.angle) * orbit.radius;
                        }
                    }
                }
            });
            
            // Update connections
            connections.forEach(connection => {
                const positions = connection.geometry.attributes.position.array;
                const obj1 = connection.userData.obj1;
                const obj2 = connection.userData.obj2;
                
                // Update line positions to follow objects
                positions[0] = obj1.position.x;
                positions[1] = obj1.position.y;
                positions[2] = obj1.position.z;
                positions[3] = obj2.position.x;
                positions[4] = obj2.position.y;
                positions[5] = obj2.position.z;
                
                connection.geometry.attributes.position.needsUpdate = true;
                
                // Pulse connection opacity
                connection.material.opacity = 0.2 + 0.3 * connectionStrength * 
                    Math.sin(time * 2 + connections.indexOf(connection));
            });
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Control handlers
    function updateControl(id, value) {
        if (id === 'objects') {
            objectCount = Math.floor(value);
            createObjects();
        } else if (id === 'connections') {
            connectionStrength = value;
            createConnections();
        }
    }
    
    function togglePlayPause(playing) {
        // Handled by the global isPlaying variable
    }
    
    function reset() {
        createObjects();
    }
    
    function onResize() {
        camera.aspect = animationContainer.clientWidth / animationContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(animationContainer.clientWidth, animationContainer.clientHeight);
    }
    
    function cleanup() {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        controls.dispose();
    }
    
    return {
        updateControl,
        togglePlayPause,
        reset,
        onResize,
        cleanup
    };
}

// P5.js Animation Implementations
function createSuperpositionAnimation() {
    let sketch = function(p) {
        let particles = [];
        let particleCount = 50;
        let animationSpeed = 1;
        
        p.setup = function() {
            p.createCanvas(animationContainer.clientWidth, animationContainer.clientHeight);
            p.colorMode(p.HSB, 100);
            initParticles();
        };
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    position: p.createVector(p.random(p.width), p.random(p.height)),
                    velocity: p5.Vector.random2D().mult(p.random(1, 3) * animationSpeed),
                    size: p.random(5, 15),
                    color: p.color(p.random(100), 80, 90, 70),
                    stateA: p.random(1) > 0.5, // Binary state (true/false)
                    stateProb: p.random(1), // Probability of being in state A
                    phaseShift: p.random(p.TWO_PI)
                });
            }
        }
        
        p.draw = function() {
            p.background(240, 20, 10, 10);
            
            if (isPlaying) {
                const time = p.millis() * 0.001;
                
                // Draw fire and wood symbol
                drawFireAndWood(time);
                
                // Update and display particles
                particles.forEach(particle => {
                    // Update position
                    particle.position.add(p.createVector(
                        particle.velocity.x,
                        particle.velocity.y
                    ));
                    
                    // Bounce off edges
                    if (particle.position.x < 0 || particle.position.x > p.width) {
                        particle.velocity.x *= -1;
                    }
                    if (particle.position.y < 0 || particle.position.y > p.height) {
                        particle.velocity.y *= -1;
                    }
                    
                    // Update state probability (oscillating)
                    particle.stateProb = 0.5 + 0.5 * p.sin(time * 2 + particle.phaseShift);
                    
                    // Display particle
                    p.noStroke();
                    
                    // First state (fire-like)
                    p.fill(10, 80, 90, particle.stateProb * 70);
                    p.ellipse(
                        particle.position.x, 
                        particle.position.y, 
                        particle.size, 
                        particle.size
                    );
                    
                    // Second state (wood-like)
                    p.fill(30, 60, 50, (1 - particle.stateProb) * 70);
                    p.ellipse(
                        particle.position.x, 
                        particle.position.y, 
                        particle.size * 0.8, 
                        particle.size * 0.8
                    );
                    
                    // Wave-like visual showing superposition
                    p.noFill();
                    p.stroke(60, 70, 90, 40);
                    p.strokeWeight(1);
                    
                    const waveSize = particle.size * 2;
                    for (let i = 0; i < 3; i++) {
                        const waveScale = 1 + i * 0.5;
                        p.ellipse(
                            particle.position.x,
                            particle.position.y,
                            waveSize * waveScale * (0.8 + 0.2 * p.sin(time * 3 + particle.phaseShift + i)),
                            waveSize * waveScale * (0.8 + 0.2 * p.sin(time * 3 + particle.phaseShift + i))
                        );
                    }
                });
            }
        };
        
        function drawFireAndWood(time) {
            const centerX = p.width / 2;
            const centerY = p.height / 2;
            
            // Draw wood (log)
            p.push();
            p.translate(centerX, centerY + 50);
            p.noStroke();
            p.fill(30, 70, 40);
            p.rectMode(p.CENTER);
            p.rect(0, 0, 200, 40, 10);
            p.pop();
            
            // Draw fire
            p.push();
            p.translate(centerX, centerY - 20);
            
            // Fire base
            p.noStroke();
            for (let i = 0; i < 10; i++) {
                const flameHeight = 80 + 20 * p.sin(time * 2 + i);
                const flameWidth = 40 + 10 * p.sin(time * 3 + i);
                
                p.fill(10 + i * 3, 80 - i * 5, 90, 50);
                p.beginShape();
                p.vertex(0, 0);
                p.bezierVertex(
                    -flameWidth, -flameHeight * 0.4,
                    -flameWidth * 0.5, -flameHeight * 0.7,
                    0, -flameHeight
                );
                p.bezierVertex(
                    flameWidth * 0.5, -flameHeight * 0.7,
                    flameWidth, -flameHeight * 0.4,
                    0, 0
                );
                p.endShape(p.CLOSE);
            }
            
            p.pop();
        }
        
        p.windowResized = function() {
            p.resizeCanvas(animationContainer.clientWidth, animationContainer.clientHeight);
        };
        
        // Control functions
        p.updateParticleCount = function(count) {
            particleCount = count;
            initParticles();
        };
        
        p.updateSpeed = function(speed) {
            animationSpeed = speed;
            particles.forEach(particle => {
                particle.velocity.mult(speed / animationSpeed);
            });
        };
        
        p.resetSketch = function() {
            initParticles();
        };
    };
    
    // Create p5 instance
    p5Instance = new p5(sketch, animationContainer);
    
    // Control handlers
    function updateControl(id, value) {
        if (id === 'particles') {
            p5Instance.updateParticleCount(value);
        } else if (id === 'speed') {
            p5Instance.updateSpeed(value);
        }
    }
    
    function togglePlayPause(playing) {
        // Handled by the global isPlaying variable
    }
    
    function reset() {
        p5Instance.resetSketch();
    }
    
    function onResize() {
        // p5 handles this internally
    }
    
    function cleanup() {
        if (p5Instance) {
            p5Instance.remove();
            p5Instance = null;
        }
    }
    
    return {
        updateControl,
        togglePlayPause,
        reset,
        onResize,
        cleanup
    };
}

function createWaveParticleAnimation() {
    let sketch = function(p) {
        let observationStrength = 0.5;
        let wavelength = 25;
        let particles = [];
        
        // Double slit experiment setup
        let slitWidth = 20;
        let slitSeparation = 80;
        let barrierX;
        let slitY1, slitY2;
        
        p.setup = function() {
            p.createCanvas(animationContainer.clientWidth, animationContainer.clientHeight);
            p.colorMode(p.HSB, 100);
            p.noStroke();
            
            barrierX = p.width * 0.4;
            slitY1 = p.height / 2 - slitSeparation / 2;
            slitY2 = p.height / 2 + slitSeparation / 2;
            
            initParticles();
        };
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < 20; i++) {
                createParticle();
            }
        }
        
        function createParticle() {
            particles.push({
                position: p.createVector(50, p.height / 2 + p.random(-100, 100)),
                velocity: p.createVector(2, 0),
                size: 8,
                color: p.color(60, 80, 90),
                wave: {
                    amplitude: 1,
                    phase: p.random(p.TWO_PI)
                },
                passedBarrier: false,
                age: 0,
                stateProbability: 0.5 // 50% chance of being observed as particle or wave
            });
        }
        
        p.draw = function() {
            p.background(240, 10, 20, 10);
            
            if (isPlaying) {
                const time = p.millis() * 0.001;
                
                // Draw fire and wood symbol
                drawFireAndWood(time);
                
                // Draw barrier with slits
                drawBarrier();
                
                // Draw wave interference pattern
                drawInterferencePattern(time);
                
                // Update and display particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    const particle = particles[i];
                    
                    // Update position
                    particle.position.add(particle.velocity);
                    particle.age++;
                    
                    // Handle barrier interaction
                    if (!particle.passedBarrier && particle.position.x >= barrierX) {
                        // Check if particle passes through either slit
                        const isNearSlit1 = Math.abs(particle.position.y - slitY1) < slitWidth / 2;
                        const isNearSlit2 = Math.abs(particle.position.y - slitY2) < slitWidth / 2;
                        
                        if (isNearSlit1 || isNearSlit2) {
                            particle.passedBarrier = true;
                            
                            // Determine if particle is observed (based on observation strength)
                            particle.stateProbability = (p.random() < observationStrength) ? 1 : 0;
                            
                            // If it's a wave (low observation), add some vertical velocity component
                            if (particle.stateProbability < 0.5) {
                                particle.velocity.y = p.random(-0.5, 0.5);
                            }
                        } else {
                            // Particle hits barrier
                            particles.splice(i, 1);
                            if (p.random() < 0.8) {
                                createParticle(); // Create new particle
                            }
                            continue;
                        }
                    }
                    
                    // Display particle
                    if (particle.passedBarrier) {
                        // After barrier, show as wave or particle based on observation
                        if (particle.stateProbability < 0.5) {
                            // Wave state
                            displayWave(particle, time);
                        } else {
                            // Particle state
                            displayParticle(particle);
                        }
                    } else {
                        // Before barrier, show as both wave and particle
                        displayDuality(particle, time);
                    }
                    
                    // Remove particles that leave the screen
                    if (particle.position.x > p.width || 
                        particle.position.y < 0 || 
                        particle.position.y > p.height) {
                        particles.splice(i, 1);
                        if (p.random() < 0.8) {
                            createParticle(); // Create new particle
                        }
                    }
                }
                
                // Add new particles occasionally
                if (p.frameCount % 20 === 0 && particles.length < 30) {
                    createParticle();
                }
            }
        };
        
        function drawFireAndWood(time) {
            // Draw wood
            p.push();
            p.fill(25, 60, 40);
            p.rectMode(p.CENTER);
            p.rect(p.width / 2, p.height - 50, 200, 30, 10);
            p.pop();
            
            // Draw fire
            p.push();
            p.translate(p.width / 2, p.height - 80);
            
            // Fire base
            p.noStroke();
            for (let i = 0; i < 8; i++) {
                const flameHeight = 60 + 15 * p.sin(time * 2 + i);
                const flameWidth = 30 + 8 * p.sin(time * 3 + i);
                
                p.fill(10 + i * 3, 80 - i * 5, 90, 40);
                p.beginShape();
                p.vertex(0, 0);
                p.bezierVertex(
                    -flameWidth, -flameHeight * 0.4,
                    -flameWidth * 0.5, -flameHeight * 0.7,
                    0, -flameHeight
                );
                p.bezierVertex(
                    flameWidth * 0.5, -flameHeight * 0.7,
                    flameWidth, -flameHeight * 0.4,
                    0, 0
                );
                p.endShape(p.CLOSE);
            }
            
            p.pop();
        }
        
        function drawBarrier() {
            p.fill(30, 20, 80);
            
            // Top part of barrier
            p.rect(barrierX - 5, 0, 10, slitY1 - slitWidth / 2);
            
            // Middle part between slits
            p.rect(barrierX - 5, slitY1 + slitWidth / 2, 
                   10, slitY2 - slitY1 - slitWidth);
            
            // Bottom part of barrier
            p.rect(barrierX - 5, slitY2 + slitWidth / 2, 
                   10, p.height - (slitY2 + slitWidth / 2));
            
            // Highlight slits
            p.fill(60, 40, 90, 20);
            p.rect(barrierX - 5, slitY1 - slitWidth / 2, 10, slitWidth);
            p.rect(barrierX - 5, slitY2 - slitWidth / 2, 10, slitWidth);
        }
        
        function drawInterferencePattern(time) {
            // Only draw if observation is low
            if (observationStrength < 0.7) {
                const opacity = 30 * (1 - observationStrength);
                
                p.push();
                p.noFill();
                p.strokeWeight(1);
                
                // Draw interference pattern on screen
                const screenX = p.width * 0.8;
                p.stroke(60, 30, 90, opacity);
                p.line(screenX, 0, screenX, p.height);
                
                // Draw interference fringes
                for (let y = 0; y < p.height; y += 5) {
                    const d1 = p.dist(screenX, y, barrierX, slitY1);
                    const d2 = p.dist(screenX, y, barrierX, slitY2);
                    
                    // Calculate interference based on path difference
                    const pathDiff = Math.abs(d1 - d2);
                    const phase = (pathDiff / wavelength) * p.TWO_PI;
                    
                    // Interference intensity
                    const intensity = 0.5 + 0.5 * p.cos(phase + time);
                    
                    p.stroke(60, 80, 90, intensity * opacity);
                    p.point(screenX, y);
                    
                    // Add some dots to make pattern more visible
                    if (y % 15 === 0) {
                        p.fill(60, 80, 90, intensity * opacity);
                        p.ellipse(screenX, y, 3, 3);
                    }
                }
                
                p.pop();
            }
        }
        
        function displayParticle(particle) {
            p.fill(10, 80, 90);
            p.ellipse(particle.position.x, particle.position.y, 
                      particle.size, particle.size);
        }
        
        function displayWave(particle, time) {
            const waveColor = p.color(60, 70, 90, 60);
            p.stroke(waveColor);
            p.noFill();
            p.strokeWeight(1);
            
            // Draw rippling waves
            for (let i = 0; i < 3; i++) {
                const waveSize = (i + 1) * 10;
                p.ellipse(
                    particle.position.x, 
                    particle.position.y,
                    waveSize * (0.8 + 0.2 * p.sin(time * 5 + particle.wave.phase)),
                    waveSize * (0.8 + 0.2 * p.sin(time * 5 + particle.wave.phase))
                );
            }
            
            // Small center
            p.fill(waveColor);
            p.ellipse(particle.position.x, particle.position.y, 4, 4);
        }
        
        function displayDuality(particle, time) {
            // Draw particle component
            p.fill(10, 80, 90, 70);
            p.ellipse(particle.position.x, particle.position.y, 
                      particle.size, particle.size);
            
            // Draw wave component
            p.stroke(60, 70, 90, 40);
            p.noFill();
            p.strokeWeight(1);
            
            const waveSize = 20;
            p.ellipse(
                particle.position.x, 
                particle.position.y,
                waveSize * (0.8 + 0.2 * p.sin(time * 3 + particle.wave.phase)),
                waveSize * (0.8 + 0.2 * p.sin(time * 3 + particle.wave.phase))
            );
        }
        
        p.windowResized = function() {
            p.resizeCanvas(animationContainer.clientWidth, animationContainer.clientHeight);
            barrierX = p.width * 0.4;
            slitY1 = p.height / 2 - slitSeparation / 2;
            slitY2 = p.height / 2 + slitSeparation / 2;
        };
        
        // Control functions
        p.updateObservation = function(value) {
            observationStrength = value;
        };
        
        p.updateWavelength = function(value) {
            wavelength = value;
        };
        
        p.resetSketch = function() {
            initParticles();
        };
    };
    
    // Create p5 instance
    p5Instance = new p5(sketch, animationContainer);
    
    // Control handlers
    function updateControl(id, value) {
        if (id === 'observation') {
            p5Instance.updateObservation(value);
        } else if (id === 'wavelength') {
            p5Instance.updateWavelength(value);
        }
    }
    
    function togglePlayPause(playing) {
        // Handled by the global isPlaying variable
    }
    
    function reset() {
        p5Instance.resetSketch();
    }
    
    function onResize() {
        // p5 handles this internally
    }
    
    function cleanup() {
        if (p5Instance) {
            p5Instance.remove();
            p5Instance = null;
        }
    }
    
    return {
        updateControl,
        togglePlayPause,
        reset,
        onResize,
        cleanup
    };
}