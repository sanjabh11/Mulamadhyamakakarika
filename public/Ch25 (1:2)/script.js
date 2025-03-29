import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config } from './config.js';
import { gsap } from 'gsap';

// Main state
let currentVerse = 1;
const TOTAL_VERSES = 12;
let scene, camera, renderer, controls;
let currentAnimation = null;

// DOM elements
const canvas = document.getElementById('canvas');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const verseTitle = document.getElementById('verse-title');
const verseText = document.getElementById('verse-text');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const explanation = document.getElementById('explanation');
const verseSpecificControls = document.getElementById('verse-specific-controls');
const navDots = document.querySelector('.nav-dots');

// Initialize the scene
function initScene() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.backgroundColor);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 50);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, 20);
    scene.add(directionalLight);

    // Create navigation dots
    createNavigationDots();
    
    // Set up sidebar toggle
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
    
    // Handle touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 70;
        
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right
            if (currentVerse > 1) {
                loadVerse(currentVerse - 1);
            }
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Swiped left
            if (currentVerse < TOTAL_VERSES) {
                loadVerse(currentVerse + 1);
            }
        }
    }
    
    // Load first verse
    loadVerse(currentVerse);
    
    // Start animation loop
    animate();
}

function toggleSidebar() {
    sidebar.classList.toggle('hidden');
    toggleSidebarBtn.classList.toggle('hidden');
}

function createNavigationDots() {
    for (let i = 1; i <= TOTAL_VERSES; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 1) dot.classList.add('active');
        dot.addEventListener('click', () => {
            loadVerse(i);
        });
        navDots.appendChild(dot);
    }
}

function updateNavigationDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (i + 1 === currentVerse) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function loadVerse(verseNumber) {
    // Update current verse
    currentVerse = verseNumber;
    
    // Clear previous animation and controls
    clearScene();
    clearVerseControls();
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update navigation dots
    updateNavigationDots();
    
    // Update sidebar content with fade effect
    const sidebarContent = document.getElementById('sidebar');
    sidebarContent.classList.add('fade-in');
    setTimeout(() => {
        sidebarContent.classList.remove('fade-in');
    }, 500);
    
    // Set verse title and text
    verseTitle.textContent = `Verse ${verseNumber}`;
    verseText.textContent = getVerseText(verseNumber);
    
    // Load verse content based on verse number
    switch(verseNumber) {
        case 1:
            loadVerse1();
            break;
        case 2:
            loadVerse2();
            break;
        case 3:
            loadVerse3();
            break;
        case 4:
            loadVerse4();
            break;
        case 5:
            loadVerse5();
            break;
        case 6:
            loadVerse6();
            break;
        case 7:
            loadVerse7();
            break;
        case 8:
            loadVerse8();
            break;
        case 9:
            loadVerse9();
            break;
        case 10:
            loadVerse10();
            break;
        case 11:
            loadVerse11();
            break;
        case 12:
            loadVerse12();
            break;
    }
}

function getVerseText(verseNumber) {
    switch(verseNumber) {
        case 1:
            return "\"If everything were empty, there would be no arising and perishing. From the letting go of and ceasing of what could one assert nirvana(-ing)?\"";
        case 2:
            return "\"If everything were not empty, there would be no arising and perishing. From the letting go of and ceasing of what could one assert nirvana(-ing)?\"";
        case 3:
            return "\"No letting go, no attainment, no annihilation, no permanence, no cessation, no birth: that is spoken of as nirvana.\"";
        case 4:
            return "\"Nirvana is not a thing. Then it would follow that it would have the characteristics of aging and death. There does not exist any thing that is without aging and death.\"";
        case 5:
            return "\"If nirvana were a thing, nirvana would be a conditioned phenomenon. There does not exist any thing anywhere that is not a conditioned phenomenon.\"";
        case 6:
            return "\"If nirvana were a thing, how would nirvana not be dependent? There does not exist any thing at all that is not dependent.\"";
        case 7:
            return "\"If nirvana were not a thing, how could it possibly be nothing? The one for whom nirvana is not a thing, for him it is not nothing.\"";
        case 8:
            return "\"If nirvana were nothing, how could nirvana possibly be not dependent? There does not exist any nothing which is not dependent.\"";
        case 9:
            return "\"Whatever things come and go are dependent or caused. Not being dependent and not being caused is taught to be Nirvana.\"";
        case 10:
            return "\"The teacher taught [it] to be the letting go of arising and perishing. Therefore, it is correct that nirvana is not a thing or nothing.\"";
        case 11:
            return "\"If nirvana were both a thing and nothing, it would follow that it would be a thing and nothing. That is incorrect.\"";
        case 12:
            return "\"If nirvana were both a thing and nothing, nirvana would not be not-dependent, because it would depend on those two.\"";
        default:
            return "";
    }
}

function clearScene() {
    // Keep lights and essential elements, remove specific verse elements
    while(scene.children.length > 2) {
        const object = scene.children[2];
        scene.remove(object);
        
        // Dispose of geometries and materials if they exist
        if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
    }
    
    // Reset camera position
    gsap.to(camera.position, {
        x: 0,
        y: 20,
        z: 50,
        duration: 1.5,
        ease: "power2.inOut"
    });
    
    // Reset controls
    controls.reset();
}

function clearVerseControls() {
    verseSpecificControls.innerHTML = '';
}

function updateNavigationButtons() {
    prevVerseBtn.disabled = currentVerse === 1;
    nextVerseBtn.disabled = currentVerse === TOTAL_VERSES;
}

// Verse 1: Quantum Field with Waves
function loadVerse1() {
    // Create quantum field
    const { size, segments, amplitude, waveSpeed, color } = config.quantumField;
    
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        wireframe: true,
        emissive: color,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
    });
    
    const field = new THREE.Mesh(geometry, material);
    field.rotation.x = -Math.PI / 2;
    scene.add(field);
    
    // Animation function for the quantum field
    currentAnimation = function(time) {
        const position = geometry.attributes.position;
        
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const distance = Math.sqrt(x * x + y * y);
            
            // Create wave effect based on distance and time
            const wave = Math.sin(distance * 0.05 + time * waveSpeed) * amplitude;
            position.setZ(i, wave);
        }
        
        position.needsUpdate = true;
    };
    
    // Add stone throw button
    const throwButton = document.createElement('button');
    throwButton.textContent = 'Throw Stone';
    throwButton.classList.add('action-button');
    throwButton.addEventListener('click', createRipple);
    verseSpecificControls.appendChild(throwButton);
    
    // Add amplitude control
    const amplitudeContainer = document.createElement('div');
    amplitudeContainer.classList.add('slider-container');
    
    const amplitudeLabel = document.createElement('label');
    amplitudeLabel.textContent = 'Wave Amplitude';
    
    const amplitudeSlider = document.createElement('input');
    amplitudeSlider.type = 'range';
    amplitudeSlider.min = '0';
    amplitudeSlider.max = '2';
    amplitudeSlider.step = '0.1';
    amplitudeSlider.value = amplitude;
    
    amplitudeSlider.addEventListener('input', () => {
        config.quantumField.amplitude = parseFloat(amplitudeSlider.value);
    });
    
    amplitudeContainer.appendChild(amplitudeLabel);
    amplitudeContainer.appendChild(amplitudeSlider);
    verseSpecificControls.appendChild(amplitudeContainer);
    
    // Function to create ripple effect
    function createRipple() {
        // Store original positions
        const originalPositions = [];
        const position = geometry.attributes.position;
        
        for (let i = 0; i < position.count; i++) {
            originalPositions.push(position.getZ(i));
        }
        
        // Random point on the field
        const centerX = (Math.random() - 0.5) * size * 0.5;
        const centerY = (Math.random() - 0.5) * size * 0.5;
        
        // Create expanding ripple animation
        let progress = 0;
        const rippleSpeed = 0.02;
        const maxRadius = size * 0.7;
        
        function animateRipple() {
            progress += rippleSpeed;
            
            for (let i = 0; i < position.count; i++) {
                const x = position.getX(i);
                const y = position.getY(i);
                
                // Distance from ripple center
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Create ripple wave
                const ripple = Math.sin(distance * 0.4 - progress * 10) * 
                               Math.exp(-Math.pow(distance - progress * maxRadius, 2) / 50);
                
                position.setZ(i, originalPositions[i] + ripple * 4);
            }
            
            position.needsUpdate = true;
            
            if (progress < 1.5) {
                requestAnimationFrame(animateRipple);
            }
        }
        
        // Start ripple animation
        animateRipple();
    }
}

// Verse 2: Entangled Particles
function loadVerse2() {
    // Create entangled particles
    const { distance, size, color1, color2, rotationSpeed } = config.entangledParticles;
    
    // Create container for the entire system
    const system = new THREE.Group();
    scene.add(system);
    
    // Create first particle
    const sphere1Geometry = new THREE.SphereGeometry(size, 32, 32);
    const sphere1Material = new THREE.MeshStandardMaterial({
        color: color1,
        emissive: color1,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
    sphere1.position.x = -distance / 2;
    system.add(sphere1);
    
    // Create second particle
    const sphere2Geometry = new THREE.SphereGeometry(size, 32, 32);
    const sphere2Material = new THREE.MeshStandardMaterial({
        color: color2,
        emissive: color2,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    sphere2.position.x = distance / 2;
    system.add(sphere2);
    
    // Create connection line
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-distance / 2, 0, 0),
        new THREE.Vector3(distance / 2, 0, 0)
    ]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    system.add(line);
    
    // Particle state (up/down)
    let particle1State = 'unknown';
    let particle2State = 'unknown';
    
    // Animation function
    currentAnimation = function(time) {
        // Rotate the system
        system.rotation.y += rotationSpeed;
        
        // Pulsing glow effect for unknown state
        if (particle1State === 'unknown') {
            const pulse = Math.sin(time * 3) * 0.3 + 0.7;
            sphere1Material.emissiveIntensity = pulse;
        }
        
        if (particle2State === 'unknown') {
            const pulse = Math.sin(time * 3) * 0.3 + 0.7;
            sphere2Material.emissiveIntensity = pulse;
        }
    };
    
    // Add measurement buttons
    const measure1Button = document.createElement('button');
    measure1Button.textContent = 'Measure Particle 1';
    measure1Button.classList.add('action-button');
    measure1Button.addEventListener('click', () => measureParticle(1));
    verseSpecificControls.appendChild(measure1Button);
    
    const measure2Button = document.createElement('button');
    measure2Button.textContent = 'Measure Particle 2';
    measure2Button.classList.add('action-button');
    measure2Button.addEventListener('click', () => measureParticle(2));
    verseSpecificControls.appendChild(measure2Button);
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.classList.add('action-button');
    resetButton.addEventListener('click', resetParticles);
    verseSpecificControls.appendChild(resetButton);
    
    // Function to measure a particle
    function measureParticle(particleNum) {
        // Randomly determine state for first measured particle
        if (particle1State === 'unknown' && particle2State === 'unknown') {
            const randomState = Math.random() > 0.5 ? 'up' : 'down';
            
            if (particleNum === 1) {
                particle1State = randomState;
                particle2State = randomState === 'up' ? 'down' : 'up';
            } else {
                particle2State = randomState;
                particle1State = randomState === 'up' ? 'down' : 'up';
            }
        }
        
        // Update visuals based on state
        updateParticleVisuals();
    }
    
    // Function to reset particles to unknown state
    function resetParticles() {
        particle1State = 'unknown';
        particle2State = 'unknown';
        
        // Reset materials
        sphere1Material.color.set(color1);
        sphere1Material.emissive.set(color1);
        
        sphere2Material.color.set(color2);
        sphere2Material.emissive.set(color2);
        
        // Remove any effects added during measurement
        if (sphere1.userData.effectMesh) {
            system.remove(sphere1.userData.effectMesh);
            sphere1.userData.effectMesh = null;
        }
        
        if (sphere2.userData.effectMesh) {
            system.remove(sphere2.userData.effectMesh);
            sphere2.userData.effectMesh = null;
        }
    }
    
    // Function to update particle visuals based on state
    function updateParticleVisuals() {
        // Update particle 1
        if (particle1State !== 'unknown') {
            const upColor = 0x00ff00;
            const downColor = 0xff0000;
            
            sphere1Material.color.set(particle1State === 'up' ? upColor : downColor);
            sphere1Material.emissive.set(particle1State === 'up' ? upColor : downColor);
            sphere1Material.emissiveIntensity = 1;
            
            // Add effect for measured particle
            if (!sphere1.userData.effectMesh) {
                const effectGeometry = new THREE.RingGeometry(size + 0.5, size + 1, 32);
                const effectMaterial = new THREE.MeshBasicMaterial({
                    color: particle1State === 'up' ? upColor : downColor,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                const effectMesh = new THREE.Mesh(effectGeometry, effectMaterial);
                effectMesh.position.copy(sphere1.position);
                effectMesh.lookAt(camera.position);
                
                // Store reference to remove later
                sphere1.userData.effectMesh = effectMesh;
                system.add(effectMesh);
            }
        }
        
        // Update particle 2
        if (particle2State !== 'unknown') {
            const upColor = 0x00ff00;
            const downColor = 0xff0000;
            
            sphere2Material.color.set(particle2State === 'up' ? upColor : downColor);
            sphere2Material.emissive.set(particle2State === 'up' ? upColor : downColor);
            sphere2Material.emissiveIntensity = 1;
            
            // Add effect for measured particle
            if (!sphere2.userData.effectMesh) {
                const effectGeometry = new THREE.RingGeometry(size + 0.5, size + 1, 32);
                const effectMaterial = new THREE.MeshBasicMaterial({
                    color: particle2State === 'up' ? upColor : downColor,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                const effectMesh = new THREE.Mesh(effectGeometry, effectMaterial);
                effectMesh.position.copy(sphere2.position);
                effectMesh.lookAt(camera.position);
                
                // Store reference to remove later
                sphere2.userData.effectMesh = effectMesh;
                system.add(effectMesh);
            }
        }
    }
}

// Verse 3: Qubit Superposition
function loadVerse3() {
    // Get configuration
    const { radius, detail, speedFactor, color1, color2 } = config.superpositionQubit;
    
    // Create qubit sphere
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    
    // Create vertex shader for superposition effect
    const vertexShader = `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            vPosition = position;
            vNormal = normal;
            
            vec3 newPosition = position;
            newPosition.x += sin(position.y * 3.0 + time) * 0.5;
            newPosition.y += cos(position.z * 3.0 + time) * 0.5;
            newPosition.z += sin(position.x * 3.0 + time) * 0.5;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `;
    
    // Create fragment shader for color shifting
    const fragmentShader = `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            float wave = sin(vPosition.x * 10.0 + vPosition.y * 10.0 + vPosition.z * 10.0 + time * 2.0) * 0.5 + 0.5;
            vec3 finalColor = mix(color1, color2, wave);
            
            // Add glow
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            finalColor += fresnel * 0.5;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    // Create shader material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(color1) },
            color2: { value: new THREE.Color(color2) }
        },
        vertexShader,
        fragmentShader
    });
    
    // Create mesh
    const qubit = new THREE.Mesh(geometry, material);
    scene.add(qubit);
    
    // Add surrounding effect particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Create particles in a sphere shape around the qubit
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = radius + 2 + Math.random() * 8;
        
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Superposition state
    let superpositionState = true;
    
    // Animation function
    currentAnimation = function(time) {
        if (superpositionState) {
            // Update shader time uniform
            material.uniforms.time.value = time * speedFactor;
            
            // Rotate qubit
            qubit.rotation.y = time * 0.2;
            qubit.rotation.z = time * 0.1;
            
            // Animate particles
            particles.rotation.y = -time * 0.1;
            
            for (let i = 0; i < particleCount * 3; i += 3) {
                const i3 = i / 3;
                const positions = particlesGeometry.attributes.position;
                
                // Create flowing motion
                const x = positions.getX(i3);
                const y = positions.getY(i3);
                const z = positions.getZ(i3);
                
                const distance = Math.sqrt(x * x + y * y + z * z);
                const normalized = { x: x / distance, y: y / distance, z: z / distance };
                
                // Breathing effect
                const breathe = Math.sin(time + i3 * 0.1) * 0.5 + 1;
                const newDistance = (radius + 2) + breathe * 3;
                
                positions.setX(i3, normalized.x * newDistance);
                positions.setY(i3, normalized.y * newDistance);
                positions.setZ(i3, normalized.z * newDistance);
            }
            
            particlesGeometry.attributes.position.needsUpdate = true;
        }
    };
    
    // Add measure button
    const measureButton = document.createElement('button');
    measureButton.textContent = 'Measure Qubit';
    measureButton.classList.add('action-button');
    
    measureButton.addEventListener('click', () => {
        if (superpositionState) {
            // Collapse to a random state
            collapseQubit();
        } else {
            // Return to superposition
            returnToSuperposition();
        }
    });
    
    verseSpecificControls.appendChild(measureButton);
    
    // Function to collapse the qubit to a specific state
    function collapseQubit() {
        superpositionState = false;
        
        // Random state (0 or 1)
        const collapseToState = Math.random() > 0.5 ? 0 : 1;
        
        // Animation to collapse
        gsap.to(material.uniforms.color1.value, {
            r: collapseToState ? 1 : 0,
            g: collapseToState ? 0 : 1,
            b: collapseToState ? 0 : 1,
            duration: 1
        });
        
        gsap.to(material.uniforms.color2.value, {
            r: collapseToState ? 1 : 0,
            g: collapseToState ? 0 : 1,
            b: collapseToState ? 0 : 1,
            duration: 1
        });
        
        // Update button text
        measureButton.textContent = 'Return to Superposition';
        
        // Make particles converge and fade
        gsap.to(particlesMaterial, {
            opacity: 0.1,
            duration: 1
        });
        
        // Smoothly stop qubit rotation
        gsap.to(qubit.rotation, {
            y: collapseToState ? Math.PI * 2 : 0,
            z: 0,
            duration: 1,
            ease: "power2.out"
        });
    }
    
    // Function to return to superposition
    function returnToSuperposition() {
        superpositionState = true;
        
        // Reset colors
        gsap.to(material.uniforms.color1.value, {
            r: new THREE.Color(color1).r,
            g: new THREE.Color(color1).g,
            b: new THREE.Color(color1).b,
            duration: 1
        });
        
        gsap.to(material.uniforms.color2.value, {
            r: new THREE.Color(color2).r,
            g: new THREE.Color(color2).g,
            b: new THREE.Color(color2).b,
            duration: 1
        });
        
        // Update button text
        measureButton.textContent = 'Measure Qubit';
        
        // Make particles reappear
        gsap.to(particlesMaterial, {
            opacity: 0.6,
            duration: 1
        });
    }
}

// Verse 4: Quantum Vacuum with Particles
function loadVerse4() {
    // Get configuration
    const { size, particleCount, particleSize, particleColor, vacuumColor } = config.quantumVacuum;
    
    // Create quantum vacuum (background glow)
    const vacuumGeometry = new THREE.SphereGeometry(size, 32, 32);
    const vacuumMaterial = new THREE.MeshBasicMaterial({
        color: vacuumColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    
    const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
    scene.add(vacuum);
    
    // Create particles that appear and disappear
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    // Create function to generate particles
    function createParticle() {
        const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: particleColor,
            transparent: true,
            opacity: 0
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position within vacuum
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = size * (0.2 + Math.random() * 0.7); // Keep away from center
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        // Add to group
        particlesGroup.add(particle);
        
        // Random lifespan
        const lifespan = 1 + Math.random() * 3;
        
        // Animate appearing
        gsap.to(material, {
            opacity: 0.8,
            duration: lifespan * 0.3,
            ease: "power1.in",
            onComplete: () => {
                // Animate disappearing
                gsap.to(material, {
                    opacity: 0,
                    duration: lifespan * 0.7,
                    ease: "power1.out",
                    onComplete: () => {
                        // Remove particle when done
                        particlesGroup.remove(particle);
                        geometry.dispose();
                        material.dispose();
                    }
                });
            }
        });
        
        // Small random movement
        gsap.to(particle.position, {
            x: particle.position.x + (Math.random() - 0.5) * 5,
            y: particle.position.y + (Math.random() - 0.5) * 5,
            z: particle.position.z + (Math.random() - 0.5) * 5,
            duration: lifespan,
            ease: "none"
        });
    }
    
    // Initial particles
    for (let i = 0; i < particleCount * 0.3; i++) {
        setTimeout(() => createParticle(), i * 50);
    }
    
    // Animation function
    currentAnimation = function(time) {
        // Slowly rotate vacuum
        vacuum.rotation.y = time * 0.03;
        vacuum.rotation.z = time * 0.01;
        
        // Add new particles randomly
        if (Math.random() < 0.05 && particlesGroup.children.length < particleCount) {
            createParticle();
        }
    };
    
    // Add zoom control
    const zoomContainer = document.createElement('div');
    zoomContainer.classList.add('slider-container');
    
    const zoomLabel = document.createElement('label');
    zoomLabel.textContent = 'Zoom Level';
    
    const zoomSlider = document.createElement('input');
    zoomSlider.type = 'range';
    zoomSlider.min = '20';
    zoomSlider.max = '100';
    zoomSlider.value = camera.position.z;
    
    zoomSlider.addEventListener('input', () => {
        gsap.to(camera.position, {
            z: parseFloat(zoomSlider.value),
            duration: 0.5
        });
    });
    
    zoomContainer.appendChild(zoomLabel);
    zoomContainer.appendChild(zoomSlider);
    verseSpecificControls.appendChild(zoomContainer);
    
    // Add particle density control
    const densityContainer = document.createElement('div');
    densityContainer.classList.add('slider-container');
    
    const densityLabel = document.createElement('label');
    densityLabel.textContent = 'Particle Density';
    
    const densitySlider = document.createElement('input');
    densitySlider.type = 'range';
    densitySlider.min = '0';
    densitySlider.max = '1';
    densitySlider.step = '0.1';
    densitySlider.value = '0.5';
    
    let particleDensity = 0.5;
    
    densitySlider.addEventListener('input', () => {
        particleDensity = parseFloat(densitySlider.value);
    });
    
    densityContainer.appendChild(densityLabel);
    densityContainer.appendChild(densitySlider);
    verseSpecificControls.appendChild(densityContainer);
    
    // Override the animation function to include particle density control
    const originalAnimation = currentAnimation;
    currentAnimation = function(time) {
        originalAnimation(time);
        
        // Adjust particle creation rate based on density
        if (Math.random() < 0.05 * particleDensity && particlesGroup.children.length < particleCount * particleDensity) {
            createParticle();
        }
    };
}

// Verse 5: Orbiting Particles under Gravity
function loadVerse5() {
    // Get configuration
    const { centralMass, particleCount, orbitRange, particleSize, centerColor, particleColor } = config.gravitationalSystem;
    
    // Create gravitational system
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);
    
    // Create central mass
    const centerGeometry = new THREE.SphereGeometry(centralMass / 10, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
        color: centerColor,
        emissive: centerColor,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    systemGroup.add(center);
    
    // Create glow for central mass
    const glowGeometry = new THREE.SphereGeometry(centralMass / 10 + 0.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: centerColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    center.add(glow);
    
    // Create particles
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle
        const geometry = new THREE.SphereGeometry(particleSize, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: particleColor,
            emissive: particleColor,
            emissiveIntensity: 0.3,
            roughness: 0.5,
            metalness: 0.5
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Set initial orbit
        const orbitRadius = orbitRange[0] + Math.random() * (orbitRange[1] - orbitRange[0]);
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 10;
        
        particle.position.x = Math.cos(angle) * orbitRadius;
        particle.position.y = height;
        particle.position.z = Math.sin(angle) * orbitRadius;
        
        // Set random orbital speed and direction
        const speed = 0.2 + Math.random() * 0.6;
        const clockwise = Math.random() > 0.5;
        
        // Store particle data
        particle.userData = {
            angle,
            radius: orbitRadius,
            speed,
            clockwise
        };
        
        // Add particle
        systemGroup.add(particle);
        particles.push(particle);
        
        // Add small trail effect
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: particleColor,
            transparent: true,
            opacity: 0.4
        });
        
        // Create trail positions (initially just the particle position)
        const trailPositions = [];
        for (let j = 0; j < 20; j++) {
            trailPositions.push(particle.position.x, particle.position.y, particle.position.z);
        }
        
        trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        systemGroup.add(trail);
        
        // Reference to trail for updates
        particle.userData.trail = trail;
        particle.userData.trailPositions = trailPositions;
    }
    
    // Set gravity constant (G)
    let gravitationalConstant = 0.5;
    
    // Animation function
    currentAnimation = function(time) {
        // Rotate central mass
        center.rotation.y = time * 0.2;
        
        // Update particle positions
        for (const particle of particles) {
            const { angle, radius, speed, clockwise, trail, trailPositions } = particle.userData;
            
            // Update angle based on orbit speed and direction
            particle.userData.angle = angle + (clockwise ? -speed : speed) * 0.02 * gravitationalConstant;
            
            // Calculate new position
            particle.position.x = Math.cos(particle.userData.angle) * radius;
            particle.position.z = Math.sin(particle.userData.angle) * radius;
            
            // Small oscillation in height
            particle.position.y = Math.sin(time * speed + radius) * 3;
            
            // Update trail
            for (let i = trailPositions.length - 3; i >= 3; i -= 3) {
                trailPositions[i] = trailPositions[i - 3];
                trailPositions[i + 1] = trailPositions[i - 2];
                trailPositions[i + 2] = trailPositions[i - 1];
            }
            
            // Add current position to front of trail
            trailPositions[0] = particle.position.x;
            trailPositions[1] = particle.position.y;
            trailPositions[2] = particle.position.z;
            
            // Update trail geometry
            trail.geometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
            trail.geometry.attributes.position.needsUpdate = true;
        }
        
        // Pulse glow
        const pulse = Math.sin(time) * 0.1 + 1;
        glow.scale.set(pulse, pulse, pulse);
    };
    
    // Add gravity constant slider
    const gravityContainer = document.createElement('div');
    gravityContainer.classList.add('slider-container');
    
    const gravityLabel = document.createElement('label');
    gravityLabel.textContent = 'Gravitational Constant';
    
    const gravitySlider = document.createElement('input');
    gravitySlider.type = 'range';
    gravitySlider.min = '0.1';
    gravitySlider.max = '1.5';
    gravitySlider.step = '0.1';
    gravitySlider.value = gravitationalConstant;
    
    gravitySlider.addEventListener('input', () => {
        gravitationalConstant = parseFloat(gravitySlider.value);
    });
    
    gravityContainer.appendChild(gravityLabel);
    gravityContainer.appendChild(gravitySlider);
    verseSpecificControls.appendChild(gravityContainer);
    
    // Add button to change perspective
    const perspectiveButton = document.createElement('button');
    perspectiveButton.textContent = 'Change Perspective';
    perspectiveButton.classList.add('action-button');
    
    perspectiveButton.addEventListener('click', () => {
        // Move camera to a new random position
        const radius = 70;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI / 2 + Math.PI / 4; // Avoid poles
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        gsap.to(camera.position, {
            x, y, z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.lookAt(0, 0, 0);
            }
        });
    });
    
    verseSpecificControls.appendChild(perspectiveButton);
}

// Verse 6: Light in Different Reference Frames
function loadVerse6() {
    // Get configuration
    const { lightSpeed, frameSpeeds, lightColor, frame1Color, frame2Color } = config.lorentzInvariance;
    
    // Create scene for Lorentz invariance
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);
    
    // Create reference frames
    const frame1Group = new THREE.Group();
    const frame2Group = new THREE.Group();
    
    systemGroup.add(frame1Group);
    systemGroup.add(frame2Group);
    
    // Set initial positions
    frame1Group.position.z = -20;
    frame2Group.position.z = 20;
    
    // Create frame 1 (stationary reference frame)
    const frame1Geometry = new THREE.BoxGeometry(20, 5, 10);
    const frame1Material = new THREE.MeshStandardMaterial({
        color: frame1Color,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    
    const frame1 = new THREE.Mesh(frame1Geometry, frame1Material);
    frame1Group.add(frame1);
    
    // Create frame 2 (moving reference frame)
    const frame2Geometry = new THREE.BoxGeometry(20, 5, 10);
    const frame2Material = new THREE.MeshStandardMaterial({
        color: frame2Color,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    
    const frame2 = new THREE.Mesh(frame2Geometry, frame2Material);
    frame2Group.add(frame2);
    
    // Create light beams
    // Frame 1 light beam
    const beam1Group = new THREE.Group();
    frame1Group.add(beam1Group);
    beam1Group.position.y = 3;
    
    const beam1Geometry = new THREE.CylinderGeometry(0.2, 0.2, 15, 8);
    beam1Geometry.rotateX(Math.PI / 2);
    
    const beam1Material = new THREE.MeshBasicMaterial({
        color: lightColor,
        transparent: true,
        opacity: 0.8
    });
    
    const beam1 = new THREE.Mesh(beam1Geometry, beam1Material);
    beam1Group.add(beam1);
    
    // Add emission point for frame 1
    const emitter1Geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const emitter1Material = new THREE.MeshBasicMaterial({
        color: lightColor,
        emissive: lightColor,
        emissiveIntensity: 1
    });
    
    const emitter1 = new THREE.Mesh(emitter1Geometry, emitter1Material);
    emitter1.position.z = -7.5;
    beam1Group.add(emitter1);
    
    // Frame 2 light beam
    const beam2Group = new THREE.Group();
    frame2Group.add(beam2Group);
    beam2Group.position.y = 3;
    
    const beam2Geometry = new THREE.CylinderGeometry(0.2, 0.2, 15, 8);
    beam2Geometry.rotateX(Math.PI / 2);
    
    const beam2Material = new THREE.MeshBasicMaterial({
        color: lightColor,
        transparent: true,
        opacity: 0.8
    });
    
    const beam2 = new THREE.Mesh(beam2Geometry, beam2Material);
    beam2Group.add(beam2);
    
    // Add emission point for frame 2
    const emitter2Geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const emitter2Material = new THREE.MeshBasicMaterial({
        color: lightColor,
        emissive: lightColor,
        emissiveIntensity: 1
    });
    
    const emitter2 = new THREE.Mesh(emitter2Geometry, emitter2Material);
    emitter2.position.z = -7.5;
    beam2Group.add(emitter2);
    
    // Set frame speeds
    let frame1Speed = frameSpeeds[0];
    let frame2Speed = frameSpeeds[1];
    
    // Animation function
    currentAnimation = function(time) {
        // Move reference frames
        frame1Group.position.x += frame1Speed * 0.1;
        frame2Group.position.x += frame2Speed * 0.1;
        
        // Reset positions if they go too far
        if (Math.abs(frame1Group.position.x) > 50) {
            frame1Group.position.x = -50 * Math.sign(frame1Group.position.x);
        }
        
        if (Math.abs(frame2Group.position.x) > 50) {
            frame2Group.position.x = -50 * Math.sign(frame2Group.position.x);
        }
        
        // Simulate light propagation - always at constant speed regardless of reference frame
        // Instead of animating the beam, we just spin it to create a "moving light" illusion
        beam1Group.rotation.y = time * lightSpeed * 0.1;
        beam2Group.rotation.y = time * lightSpeed * 0.1;
        
        // Pulse the emitters
        const pulse = (Math.sin(time * 5) * 0.3 + 0.7);
        emitter1.scale.set(pulse, pulse, pulse);
        emitter2.scale.set(pulse, pulse, pulse);
    };
    
    // Add frame speed sliders
    const frame1Container = document.createElement('div');
    frame1Container.classList.add('slider-container');
    
    const frame1Label = document.createElement('label');
    frame1Label.textContent = 'Frame 1 Speed';
    
    const frame1Slider = document.createElement('input');
    frame1Slider.type = 'range';
    frame1Slider.min = '-10';
    frame1Slider.max = '10';
    frame1Slider.step = '1';
    frame1Slider.value = frame1Speed;
    
    frame1Slider.addEventListener('input', () => {
        frame1Speed = parseFloat(frame1Slider.value);
    });
    
    frame1Container.appendChild(frame1Label);
    frame1Container.appendChild(frame1Slider);
    verseSpecificControls.appendChild(frame1Container);
    
    const frame2Container = document.createElement('div');
    frame2Container.classList.add('slider-container');
    
    const frame2Label = document.createElement('label');
    frame2Label.textContent = 'Frame 2 Speed';
    
    const frame2Slider = document.createElement('input');
    frame2Slider.type = 'range';
    frame2Slider.min = '-10';
    frame2Slider.max = '10';
    frame2Slider.step = '1';
    frame2Slider.value = frame2Speed;
    
    frame2Slider.addEventListener('input', () => {
        frame2Speed = parseFloat(frame2Slider.value);
    });
    
    frame2Container.appendChild(frame2Label);
    frame2Container.appendChild(frame2Slider);
    verseSpecificControls.appendChild(frame2Container);
    
    // Add button to view from different frames
    const viewFrame1Button = document.createElement('button');
    viewFrame1Button.textContent = 'View from Frame 1';
    viewFrame1Button.classList.add('action-button');
    
    viewFrame1Button.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: frame1Group.position.x,
            y: 10,
            z: -30,
            duration: 1,
            onUpdate: () => {
                camera.lookAt(frame1Group.position.x, 0, 0);
            }
        });
    });
    
    const viewFrame2Button = document.createElement('button');
    viewFrame2Button.textContent = 'View from Frame 2';
    viewFrame2Button.classList.add('action-button');
    
    viewFrame2Button.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: frame2Group.position.x,
            y: 10,
            z: 30,
            duration: 1,
            onUpdate: () => {
                camera.lookAt(frame2Group.position.x, 0, 0);
            }
        });
    });
    
    const resetViewButton = document.createElement('button');
    resetViewButton.textContent = 'Reset View';
    resetViewButton.classList.add('action-button');
    
    resetViewButton.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: 0,
            y: 30,
            z: 70,
            duration: 1,
            onUpdate: () => {
                camera.lookAt(0, 0, 0);
            }
        });
    });
    
    verseSpecificControls.appendChild(viewFrame1Button);
    verseSpecificControls.appendChild(viewFrame2Button);
    verseSpecificControls.appendChild(resetViewButton);
}

// Verse 7: Another Qubit Superposition
function loadVerse7() {
    // Get configuration
    const { radius, detail, speedFactor, color1, color2 } = config.superpositionQubit2;
    
    // Create qubit sphere
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    
    // Create vertex shader for superposition effect
    const vertexShader = `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            vPosition = position;
            vNormal = normal;
            
            vec3 newPosition = position;
            // More complex distortion pattern
            float displacement = sin(position.x * 2.0 + time) * sin(position.y * 2.0 + time) * sin(position.z * 2.0 + time) * 0.5;
            newPosition += normal * displacement;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `;
    
    // Create fragment shader for superposition effect
    const fragmentShader = `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        // Simplex noise function (borrowed from common shader patterns)
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            
            i = mod289(i);
            vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                   
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
            float noise = snoise(vPosition * 0.5 + vec3(0.0, 0.0, time * 0.2)) * 0.5 + 0.5;
            vec3 finalColor = mix(color1, color2, noise);
            
            // Add glow at edges
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            finalColor += fresnel * mix(color2, color1, noise) * 0.5;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    // Create shader material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(color1) },
            color2: { value: new THREE.Color(color2) }
        },
        vertexShader,
        fragmentShader
    });
    
    // Create qubit mesh
    const qubit = new THREE.Mesh(geometry, material);
    scene.add(qubit);
    
    // Create orbiting particles
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? color1 : color2,
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Set random orbit
        const orbitRadius = radius + 2 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        // Convert spherical to cartesian coordinates
        particle.position.x = orbitRadius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = orbitRadius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = orbitRadius * Math.cos(phi);
        
        // Store initial angles for animation
        particle.userData = {
            radius: orbitRadius,
            theta,
            phi,
            speed: 0.2 + Math.random() * 0.3,
            phiSpeed: 0.1 + Math.random() * 0.2
        };
        
        particlesGroup.add(particle);
    }
    
    // Superposition state
    let superpositionState = true;
    
    // Animation function
    currentAnimation = function(time) {
        if (superpositionState) {
            // Update shader time uniform
            material.uniforms.time.value = time * speedFactor;
            
            // Rotate qubit
            qubit.rotation.y = time * 0.1;
            qubit.rotation.x = Math.sin(time * 0.2) * 0.2;
            qubit.rotation.z = Math.cos(time * 0.15) * 0.15;
            
            // Animate particles
            particlesGroup.children.forEach(particle => {
                const { radius, theta, phi, speed, phiSpeed } = particle.userData;
                
                // Update angles for orbit
                particle.userData.theta += speed * 0.05;
                particle.userData.phi += phiSpeed * 0.01;
                
                // Update position based on new angles
                particle.position.x = radius * Math.sin(particle.userData.phi) * Math.cos(particle.userData.theta);
                particle.position.y = radius * Math.sin(particle.userData.phi) * Math.sin(particle.userData.theta);
                particle.position.z = radius * Math.cos(particle.userData.phi);
                
                // Pulse size
                const pulse = Math.sin(time * speed * 5 + radius) * 0.3 + 0.7;
                particle.scale.set(pulse, pulse, pulse);
            });
        }
    };
    
    // Add measure button
    const measureButton = document.createElement('button');
    measureButton.textContent = 'Measure Qubit';
    measureButton.classList.add('action-button');
    
    measureButton.addEventListener('click', () => {
        if (superpositionState) {
            // Collapse to a random state
            collapseQubit();
        } else {
            // Return to superposition
            returnToSuperposition();
        }
    });
    
    verseSpecificControls.appendChild(measureButton);
    
    // Function to collapse the qubit
    function collapseQubit() {
        superpositionState = false;
        
        // Choose a random collapsed state (0 or 1)
        const collapsedState = Math.random() > 0.5 ? 0 : 1;
        
        // Set to one color based on state
        const targetColor = collapsedState ? color1 : color2;
        
        // Animate color transition
        gsap.to(material.uniforms.color1.value, {
            r: new THREE.Color(targetColor).r,
            g: new THREE.Color(targetColor).g,
            b: new THREE.Color(targetColor).b,
            duration: 1
        });
        
        gsap.to(material.uniforms.color2.value, {
            r: new THREE.Color(targetColor).r,
            g: new THREE.Color(targetColor).g,
            b: new THREE.Color(targetColor).b,
            duration: 1
        });
        
        // Stop qubit rotation
        gsap.to(qubit.rotation, {
            y: 0,
            x: 0,
            z: 0,
            duration: 1
        });
        
        // Make particles converge to single state
        particlesGroup.children.forEach(particle => {
            gsap.to(particle.material, {
                opacity: collapsedState === (particle.material.color.getHex() === new THREE.Color(color1).getHex() ? 1 : 0) ? 0.9 : 0,
                duration: 1
            });
            
            gsap.to(particle.position, {
                x: particle.position.x * 0.7,
                y: particle.position.y * 0.7,
                z: particle.position.z * 0.7,
                duration: 1,
                ease: "power2.inOut"
            });
        });
        
        // Update button text
        measureButton.textContent = 'Return to Superposition';
    }
    
    // Function to return to superposition
    function returnToSuperposition() {
        superpositionState = true;
        
        // Reset colors
        gsap.to(material.uniforms.color1.value, {
            r: new THREE.Color(color1).r,
            g: new THREE.Color(color1).g,
            b: new THREE.Color(color1).b,
            duration: 1
        });
        
        gsap.to(material.uniforms.color2.value, {
            r: new THREE.Color(color2).r,
            g: new THREE.Color(color2).g,
            b: new THREE.Color(color2).b,
            duration: 1
        });
        
        // Reset particles
        particlesGroup.children.forEach((particle, i) => {
            gsap.to(particle.material, {
                opacity: 0.7,
                duration: 1
            });
            
            // Return to original orbit radius
            const { radius } = particle.userData;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            gsap.to(particle.position, {
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi),
                duration: 1,
                ease: "power2.inOut"
            });
        });
        
        // Update button text
        measureButton.textContent = 'Measure Qubit';
    }
}

// Verse 8: Quantum Vacuum with Potential
function loadVerse8() {
    // Get configuration
    const { size, particleCount, particleSize, particleColor, vacuumColor } = config.quantumVacuum2;
    
    // Create quantum vacuum (energy field)
    const vacuumGroup = new THREE.Group();
    scene.add(vacuumGroup);
    
    // Create vacuum glow
    const vacuumGeometry = new THREE.SphereGeometry(size, 32, 32);
    const vacuumMaterial = new THREE.MeshBasicMaterial({
        color: vacuumColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    
    const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
    vacuumGroup.add(vacuum);
    
    // Add inner structure to represent "not nothing"
    const innerStructureGeometry = new THREE.IcosahedronGeometry(size * 0.3, 1);
    const innerStructureMaterial = new THREE.MeshStandardMaterial({
        color: vacuumColor,
        emissive: vacuumColor,
        emissiveIntensity: 0.3,
        wireframe: true
    });
    
    const innerStructure = new THREE.Mesh(innerStructureGeometry, innerStructureMaterial);
    vacuumGroup.add(innerStructure);
    
    // Create energy lines to represent field potential
    const linesGroup = new THREE.Group();
    vacuumGroup.add(linesGroup);
    
    const lineCount = 40;
    
    for (let i = 0; i < lineCount; i++) {
        // Create curved line from center outward
        const curvePoints = [];
        const radius = size * 0.3;
        const endRadius = size * (0.5 + Math.random() * 0.4);
        const segments = 20;
        
        // Random direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const direction = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        );
        
        // Create points along curve
        for (let j = 0; j <= segments; j++) {
            const t = j / segments;
            const currentRadius = radius + (endRadius - radius) * t;
            
            // Add some variation to create curved path
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * t * 5,
                (Math.random() - 0.5) * t * 5,
                (Math.random() - 0.5) * t * 5
            );
            
            const point = direction.clone().multiplyScalar(currentRadius).add(offset);
            curvePoints.push(point);
        }
        
        // Create geometry from points
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        
        // Create material with color gradient
        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(vacuumColor).lerp(new THREE.Color(particleColor), 0.5),
            transparent: true,
            opacity: 0.4
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        linesGroup.add(line);
        
        // Store original points for animation
        line.userData = {
            originalPoints: curvePoints.map(p => p.clone()),
            amplitude: 0.2 + Math.random() * 0.8,
            speed: 0.5 + Math.random() * 1.5
        };
    }
    
    // Create virtual particles
    const particlesGroup = new THREE.Group();
    vacuumGroup.add(particlesGroup);
    
    // Function to create and animate particles
    function createParticle() {
        if (particlesGroup.children.length >= particleCount) return;
        
        // Create particle geometry
        const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: particleColor,
            transparent: true,
            opacity: 0
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position on the inner structure
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = size * 0.3;
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        // Determine target position (along one of the field lines)
        const randomLine = linesGroup.children[Math.floor(Math.random() * linesGroup.children.length)];
        const originalPoints = randomLine.userData.originalPoints;
        const targetPoint = originalPoints[originalPoints.length - 1].clone();
        
        // Add to scene
        particlesGroup.add(particle);
        
        // Animate appearance, movement, and disappearance
        gsap.to(material, {
            opacity: 0.8,
            duration: 0.5,
            ease: "power1.in"
        });
        
        gsap.to(particle.position, {
            x: targetPoint.x,
            y: targetPoint.y,
            z: targetPoint.z,
            duration: 2 + Math.random() * 2,
            ease: "power1.out",
            onComplete: () => {
                // Fade out
                gsap.to(material, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power1.out",
                    onComplete: () => {
                        // Remove particle
                        particlesGroup.remove(particle);
                        geometry.dispose();
                        material.dispose();
                    }
                });
            }
        });
    }
    
    // Initial particles
    for (let i = 0; i < particleCount * 0.3; i++) {
        setTimeout(createParticle, i * 100);
    }
    
    // Animation function
    currentAnimation = function(time) {
        // Rotate entire vacuum
        vacuumGroup.rotation.y = time * 0.05;
        
        // Animate inner structure
        innerStructure.rotation.y = time * 0.2;
        innerStructure.rotation.z = time * 0.1;
        
        // Pulse inner structure
        const pulse = Math.sin(time) * 0.1 + 1;
        innerStructure.scale.set(pulse, pulse, pulse);
        
        // Animate energy lines
        linesGroup.children.forEach(line => {
            const { originalPoints, amplitude, speed } = line.userData;
            const positions = line.geometry.attributes.position;
            
            for (let i = 0; i < positions.count; i++) {
                const originalPoint = originalPoints[i];
                
                // Add wave motion
                const t = i / positions.count;
                const wave = Math.sin(time * speed + t * 10) * amplitude * t;
                
                // Apply offset
                positions.setXYZ(
                    i,
                    originalPoint.x + (Math.random() - 0.5) * wave,
                    originalPoint.y + (Math.random() - 0.5) * wave,
                    originalPoint.z + (Math.random() - 0.5) * wave
                );
            }
            
            positions.needsUpdate = true;
        });
        
        // Create new particles randomly
        if (Math.random() < 0.05) {
            createParticle();
        }
    };
    
    // Add zoom control
    const zoomContainer = document.createElement('div');
    zoomContainer.classList.add('slider-container');
    
    const zoomLabel = document.createElement('label');
    zoomLabel.textContent = 'Zoom Level';
    
    const zoomSlider = document.createElement('input');
    zoomSlider.type = 'range';
    zoomSlider.min = '30';
    zoomSlider.max = '120';
    zoomSlider.value = '80';
    
    zoomSlider.addEventListener('input', () => {
        gsap.to(camera.position, {
            z: parseFloat(zoomSlider.value),
            duration: 0.5
        });
    });
    
    zoomContainer.appendChild(zoomLabel);
    zoomContainer.appendChild(zoomSlider);
    verseSpecificControls.appendChild(zoomContainer);
    
    // Add button to look inside
    const lookInsideButton = document.createElement('button');
    lookInsideButton.textContent = 'Look Inside';
    lookInsideButton.classList.add('action-button');
    
    lookInsideButton.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: size * 0.5,
            duration: 1.5,
            ease: "power2.inOut"
        });
    });
    
    const lookOutsideButton = document.createElement('button');
    lookOutsideButton.textContent = 'Look Outside';
    lookOutsideButton.classList.add('action-button');
    
    lookOutsideButton.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: 0,
            y: 20,
            z: 80,
            duration: 1.5,
            ease: "power2.inOut"
        });
    });
    
    verseSpecificControls.appendChild(lookInsideButton);
    verseSpecificControls.appendChild(lookOutsideButton);
}

// Verse 9: Particles with Physical Laws
function loadVerse9() {
    // Get configuration
    const { particleCount, particleSize, fieldSize, baseColor, accentColor } = config.physicalLaws;
    
    // Create field for physical laws
    const fieldGroup = new THREE.Group();
    scene.add(fieldGroup);
    
    // Create field visualization
    const fieldGeometry = new THREE.PlaneGeometry(fieldSize, fieldSize, 32, 32);
    const fieldMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
        side: THREE.DoubleSide
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = Math.PI / 2;
    fieldGroup.add(field);
    
    // Create particles
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(particleSize, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: accentColor,
            emissive: accentColor,
            emissiveIntensity: 0.5
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position within field
        particle.position.x = (Math.random() - 0.5) * fieldSize * 0.8;
        particle.position.z = (Math.random() - 0.5) * fieldSize * 0.8;
        particle.position.y = 0.5;
        
        // Random velocity
        const speed = 0.5 + Math.random() * 1;
        const angle = Math.random() * Math.PI * 2;
        
        particle.userData = {
            velocity: new THREE.Vector3(
                Math.cos(angle) * speed,
                0,
                Math.sin(angle) * speed
            ),
            mass: 0.5 + Math.random() * 1.5
        };
        
        // Add trail
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: accentColor,
            transparent: true,
            opacity: 0.3
        });
        
        // Initialize with current position
        const trailPositions = [];
        for (let j = 0; j < 20; j++) {
            trailPositions.push(
                particle.position.x,
                particle.position.y,
                particle.position.z
            );
        }
        
        trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        fieldGroup.add(trail);
        
        // Store reference to trail
        particle.userData.trail = trail;
        particle.userData.trailPositions = trailPositions;
        
        fieldGroup.add(particle);
        particles.push(particle);
    }
    
    // Physics parameters
    let gravityStrength = 1;
    let bounceStrength = 0.8;
    
    // Animation function
    currentAnimation = function(time) {
        // Update each particle based on physical laws
        for (const particle of particles) {
            const { velocity, mass, trail, trailPositions } = particle.userData;
            
            // Apply gravity towards center
            const directionToCenter = new THREE.Vector3(
                -particle.position.x,
                0,
                -particle.position.z
            );
            
            const distanceToCenter = directionToCenter.length();
            
            if (distanceToCenter > 0.1) {
                directionToCenter.normalize();
                
                // Gravitational acceleration (F = G * m1 * m2 / r^2)
                const acceleration = directionToCenter.multiplyScalar(
                    (gravityStrength * 0.5) / (distanceToCenter * distanceToCenter) / mass
                );
                
                // Update velocity
                velocity.add(acceleration);
            }
            
            // Update position
            particle.position.add(velocity);
            
            // Check boundaries
            const bounds = fieldSize / 2 * 0.9;
            
            if (Math.abs(particle.position.x) > bounds) {
                particle.position.x = Math.sign(particle.position.x) * bounds;
                velocity.x *= -bounceStrength;
            }
            
            if (Math.abs(particle.position.z) > bounds) {
                particle.position.z = Math.sign(particle.position.z) * bounds;
                velocity.z *= -bounceStrength;
            }
            
            // Update trail
            for (let i = trailPositions.length - 3; i >= 3; i -= 3) {
                trailPositions[i] = trailPositions[i - 3];
                trailPositions[i + 1] = trailPositions[i - 2];
                trailPositions[i + 2] = trailPositions[i - 1];
            }
            
            // Add current position to front of trail
            trailPositions[0] = particle.position.x;
            trailPositions[1] = particle.position.y;
            trailPositions[2] = particle.position.z;
            
            // Update trail geometry
            trail.geometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
            trail.geometry.attributes.position.needsUpdate = true;
        }
        
        // Subtly deform the field based on particle positions
        const positions = fieldGeometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            
            // Calculate displacement based on nearby particles
            let totalDisplacement = 0;
            
            for (const particle of particles) {
                const dx = x - particle.position.x;
                const dz = z - particle.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                if (distance < 10) {
                    // Particles create "dips" in the field
                    totalDisplacement -= (1 / (distance + 0.1)) * particle.userData.mass * 0.5;
                }
            }
            
            // Apply displacement
            positions.setY(i, totalDisplacement);
        }
        
        fieldGeometry.attributes.position.needsUpdate = true;
    };
    
    // Add gravity control
    const gravityContainer = document.createElement('div');
    gravityContainer.classList.add('slider-container');
    
    const gravityLabel = document.createElement('label');
    gravityLabel.textContent = 'Gravity Strength';
    
    const gravitySlider = document.createElement('input');
    gravitySlider.type = 'range';
    gravitySlider.min = '0';
    gravitySlider.max = '2';
    gravitySlider.step = '0.1';
    gravitySlider.value = gravityStrength;
    
    gravitySlider.addEventListener('input', () => {
        gravityStrength = parseFloat(gravitySlider.value);
    });
    
    gravityContainer.appendChild(gravityLabel);
    gravityContainer.appendChild(gravitySlider);
    verseSpecificControls.appendChild(gravityContainer);
    
    // Add bounce control
    const bounceContainer = document.createElement('div');
    bounceContainer.classList.add('slider-container');
    
    const bounceLabel = document.createElement('label');
    bounceLabel.textContent = 'Bounce Strength';
    
    const bounceSlider = document.createElement('input');
    bounceSlider.type = 'range';
    bounceSlider.min = '0';
    bounceSlider.max = '1';
    bounceSlider.step = '0.1';
    bounceSlider.value = bounceStrength;
    
    bounceSlider.addEventListener('input', () => {
        bounceStrength = parseFloat(bounceSlider.value);
    });
    
    bounceContainer.appendChild(bounceLabel);
    bounceContainer.appendChild(bounceSlider);
    verseSpecificControls.appendChild(bounceContainer);
    
    // Add button to reset particles
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Particles';
    resetButton.classList.add('action-button');
    
    resetButton.addEventListener('click', () => {
        for (const particle of particles) {
            // Random position within field
            particle.position.x = (Math.random() - 0.5) * fieldSize * 0.8;
            particle.position.z = (Math.random() - 0.5) * fieldSize * 0.8;
            
            // Random velocity
            const speed = 0.5 + Math.random() * 1;
            const angle = Math.random() * Math.PI * 2;
            
            particle.userData.velocity.set(
                Math.cos(angle) * speed,
                0,
                Math.sin(angle) * speed
            );
            
            // Reset trail
            const { trailPositions } = particle.userData;
            for (let j = 0; j < trailPositions.length; j += 3) {
                trailPositions[j] = particle.position.x;
                trailPositions[j + 1] = particle.position.y;
                trailPositions[j + 2] = particle.position.z;
            }
        }
    });
    
    verseSpecificControls.appendChild(resetButton);
}

// Verse 10: Qubit with Measurement
function loadVerse10() {
    // Get configuration
    const { radius, detail, pulseRate, color1, color2 } = config.measurementQubit;
    
    // Create qubit geometry
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    
    // Create shader material for superposition
    const vertexShader = `
        uniform float time;
        uniform float pulseRate;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            vPosition = position;
            vNormal = normal;
            
            // Create pulsing effect
            float pulse = sin(time * pulseRate) * 0.2 + 1.0;
            vec3 newPosition = position * pulse;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `;
    
    const fragmentShader = `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            // Oscillate between colors
            float t = sin(time * 2.0 + vPosition.x * 0.5 + vPosition.y * 0.5 + vPosition.z * 0.5) * 0.5 + 0.5;
            vec3 finalColor = mix(color1, color2, t);
            
            // Add glow effect
            float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
            finalColor += fresnel * 0.4;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pulseRate: { value: pulseRate },
            color1: { value: new THREE.Color(color1) },
            color2: { value: new THREE.Color(color2) }
        },
        vertexShader,
        fragmentShader
    });
    
    // Create qubit mesh
    const qubit = new THREE.Mesh(geometry, material);
    scene.add(qubit);
    
    // Create surrounding wavefunction visualization
    const wavefunctionGroup = new THREE.Group();
    scene.add(wavefunctionGroup);
    
    // Create wave rings
    const ringCount = 5;
    const rings = [];
    
    for (let i = 0; i < ringCount; i++) {
        const ringGeometry = new THREE.TorusGeometry(radius + 3 + i * 2, 0.2, 16, 50);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color1).lerp(new THREE.Color(color2), i / (ringCount - 1)),
            transparent: true,
            opacity: 0.5 - (i / ringCount) * 0.3
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        wavefunctionGroup.add(ring);
        rings.push(ring);
    }
    
    // Create particles around qubit
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color1).lerp(new THREE.Color(color2), Math.random()),
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Set random position in probability cloud
        const distance = radius + 1 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.x = distance * Math.sin(phi) * Math.cos(theta);
        particle.position.y = distance * Math.sin(phi) * Math.sin(theta);
        particle.position.z = distance * Math.cos(phi);
        
        // Add to scene
        wavefunctionGroup.add(particle);
        particles.push({
            mesh: particle,
            initialPosition: particle.position.clone(),
            speed: 0.2 + Math.random() * 0.8
        });
    }
    
    // Qubit state
    let superpositionState = true;
    
    // Animation function
    currentAnimation = function(time) {
        if (superpositionState) {
            // Update shader time uniform
            material.uniforms.time.value = time;
            
            // Rotate qubit
            qubit.rotation.y = time * 0.2;
            qubit.rotation.x = time * 0.1;
            
            // Animate wave rings
            rings.forEach((ring, i) => {
                ring.rotation.x = time * 0.3 + i * 0.2;
                ring.rotation.y = time * 0.5 - i * 0.3;
                
                // Pulse size
                const pulse = Math.sin(time * pulseRate + i) * 0.1 + 1;
                ring.scale.set(pulse, pulse, pulse);
            });
            
            // Animate particles
            particles.forEach(particle => {
                const { mesh, initialPosition, speed } = particle;
                
                // Oscillate around initial position
                mesh.position.x = initialPosition.x + Math.sin(time * speed) * 1;
                mesh.position.y = initialPosition.y + Math.cos(time * speed * 1.3) * 1;
                mesh.position.z = initialPosition.z + Math.sin(time * speed * 0.7) * 1;
                
                // Pulse size
                const pulse = Math.sin(time * speed * 3) * 0.3 + 0.7;
                mesh.scale.set(pulse, pulse, pulse);
            });
        }
    };
    
    // Add measure button
    const measureButton = document.createElement('button');
    measureButton.textContent = 'Measure Qubit';
    measureButton.classList.add('action-button');
    
    measureButton.addEventListener('click', () => {
        if (superpositionState) {
            // Collapse to a measured state
            collapseQubit();
        } else {
            // Return to superposition
            returnToSuperposition();
        }
    });
    
    verseSpecificControls.appendChild(measureButton);
    
    // Function to collapse qubit
    function collapseQubit() {
        superpositionState = false;
        
        // Choose random state
        const state = Math.random() > 0.5 ? 0 : 1;
        const stateColor = state === 0 ? color1 : color2;
        
        // Animate to single color
        gsap.to(material.uniforms.color1.value, {
            r: new THREE.Color(stateColor).r,
            g: new THREE.Color(stateColor).g,
            b: new THREE.Color(stateColor).b,
            duration: 1
        });
        
        gsap.to(material.uniforms.color2.value, {
            r: new THREE.Color(stateColor).r,
            g: new THREE.Color(stateColor).g,
            b: new THREE.Color(stateColor).b,
            duration: 1
        });
        
        // Stop qubit rotation
        gsap.to(qubit.rotation, {
            x: 0,
            y: 0,
            duration: 1
        });
        
        // Collapse rings
        rings.forEach((ring, i) => {
            gsap.to(ring.material, {
                opacity: 0.1,
                duration: 0.5
            });
            
            gsap.to(ring.scale, {
                x: 0.5,
                y: 0.5,
                z: 0.1,
                duration: 0.7,
                ease: "power2.in"
            });
        });
        
        // Collapse particles
        particles.forEach(particle => {
            const { mesh } = particle;
            
            gsap.to(mesh.position, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: "power3.in"
            });
            
            gsap.to(mesh.material, {
                opacity: 0,
                duration: 0.5
            });
        });
        
        // Update button
        measureButton.textContent = 'Return to Superposition';
    }
    
    // Function to return to superposition
    function returnToSuperposition() {
        superpositionState = true;
        
        // Restore colors
        gsap.to(material.uniforms.color1.value, {
            r: new THREE.Color(color1).r,
            g: new THREE.Color(color1).g,
            b: new THREE.Color(color1).b,
            duration: 1
        });
        
        gsap.to(material.uniforms.color2.value, {
            r: new THREE.Color(color2).r,
            g: new THREE.Color(color2).g,
            b: new THREE.Color(color2).b,
            duration: 1
        });
        
        // Restore rings
        rings.forEach((ring, i) => {
            gsap.to(ring.material, {
                opacity: 0.5 - (i / ringCount) * 0.3,
                duration: 0.5
            });
            
            gsap.to(ring.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.7,
                ease: "power2.out"
            });
        });
        
        // Restore particles
        particles.forEach(particle => {
            const { mesh, initialPosition } = particle;
            
            gsap.to(mesh.position, {
                x: initialPosition.x,
                y: initialPosition.y,
                z: initialPosition.z,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.to(mesh.material, {
                opacity: 0.7,
                duration: 0.5
            });
        });
        
        // Update button
        measureButton.textContent = 'Measure Qubit';
    }
}

// Verse 11: Contradictory States
function loadVerse11() {
    // Get configuration
    const { radius, detail, morphSpeed, color1, color2 } = config.contradictionQubit;
    
    // Create main group
    const contradictionGroup = new THREE.Group();
    scene.add(contradictionGroup);
    
    // Create core geometry showing contradiction
    // We'll use a sphere that morphs between two states
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    
    // Create shader material for the contradiction effect
    const vertexShader = `
        uniform float time;
        uniform float morphSpeed;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        // Noise function for distortion
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            
            i = mod289(i);
            vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                   
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
            vPosition = position;
            vNormal = normal;
            
            // Create two conflicting distortions
            float noise1 = snoise(position * 0.2 + vec3(time * morphSpeed)) * 0.5;
            float noise2 = snoise(position * 0.3 - vec3(time * morphSpeed * 0.7)) * 0.5;
            
            // These distortions fight against each other
            vec3 newPosition = position;
            newPosition += normal * noise1;
            newPosition -= normal * noise2;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `;
    
    const fragmentShader = `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            // Create interference pattern between two colors
            float pattern1 = sin(vPosition.x * 5.0 + time * 2.0) * 0.5 + 0.5;
            float pattern2 = cos(vPosition.y * 5.0 - time * 1.5) * 0.5 + 0.5;
            
            // These patterns conflict with each other
            vec3 colorMix1 = mix(color1, color2, pattern1);
            vec3 colorMix2 = mix(color2, color1, pattern2);
            
            // Final color is caught between two states
            float t = sin(time) * 0.5 + 0.5;
            vec3 finalColor = mix(colorMix1, colorMix2, t);
            
            // Add edge glow
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            finalColor += fresnel * 0.3;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            morphSpeed: { value: morphSpeed },
            color1: { value: new THREE.Color(color1) },
            color2: { value: new THREE.Color(color2) }
        },
        vertexShader,
        fragmentShader
    });
    
    // Create main mesh
    const contradictionSphere = new THREE.Mesh(geometry, material);
    contradictionGroup.add(contradictionSphere);
    
    // Create sparks that appear at contradictions
    const sparksGroup = new THREE.Group();
    contradictionGroup.add(sparksGroup);
    
    function createSpark(position) {
        const sparkGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 8);
        const sparkMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? color1 : color2,
            transparent: true,
            opacity: 1
        });
        
        const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
        spark.position.copy(position);
        
        // Random direction
        const direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize();
        
        // Random speed
        const speed = 0.05 + Math.random() * 0.1;
        
        spark.userData = {
            direction,
            speed,
            life: 1.0  // Life counter (1.0 to 0.0)
        };
        
        sparksGroup.add(spark);
        
        // Animate spark
        gsap.to(spark.userData, {
            life: 0,
            duration: 1 + Math.random(),
            ease: "power1.out",
            onUpdate: () => {
                const { life } = spark.userData;
                sparkMaterial.opacity = life;
                spark.scale.set(life, life, life);
            },
            onComplete: () => {
                sparksGroup.remove(spark);
                sparkGeometry.dispose();
                sparkMaterial.dispose();
            }
        });
    }
    
    // Add symbolic elements showing conflicting states
    // Create "thing" and "nothing" symbols
    
    // "Thing" symbol (cube)
    const thingGeometry = new THREE.BoxGeometry(3, 3, 3);
    const thingMaterial = new THREE.MeshStandardMaterial({
        color: color1,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const thingSymbol = new THREE.Mesh(thingGeometry, thingMaterial);
    thingSymbol.position.x = -radius - 5;
    contradictionGroup.add(thingSymbol);
    
    // "Nothing" symbol (wireframe sphere with inner core)
    const nothingGeometry = new THREE.SphereGeometry(2, 16, 16);
    const nothingMaterial = new THREE.MeshStandardMaterial({
        color: color2,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    
    const nothingSymbol = new THREE.Mesh(nothingGeometry, nothingMaterial);
    nothingSymbol.position.x = radius + 5;
    contradictionGroup.add(nothingSymbol);
    
    // Create connecting lines that try and fail to connect
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
    });
    
    // Start with positions that will be updated in animation
    const linePositions = new Float32Array([
        thingSymbol.position.x, thingSymbol.position.y, thingSymbol.position.z,
        contradictionSphere.position.x, contradictionSphere.position.y, contradictionSphere.position.z,
        nothingSymbol.position.x, nothingSymbol.position.y, nothingSymbol.position.z
    ]);
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
    contradictionGroup.add(connectionLine);
    
    // State for animation
    let showingContradiction = true;
    
    // Animation function
    currentAnimation = function(time) {
        if (showingContradiction) {
            // Update shader time
            material.uniforms.time.value = time;
            
            // Rotate contradiction sphere
            contradictionSphere.rotation.y = time * 0.3;
            contradictionSphere.rotation.x = time * 0.2;
            
            // Rotate symbols
            thingSymbol.rotation.y = time * 0.5;
            nothingSymbol.rotation.y = -time * 0.5;
            
            // Create sparks randomly
            if (Math.random() < 0.05) {
                // Create spark at random point on sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);
                
                const position = new THREE.Vector3(x, y, z);
                createSpark(position);
            }
            
            // Update sparks
            sparksGroup.children.forEach(spark => {
                const { direction, speed } = spark.userData;
                spark.position.add(direction.clone().multiplyScalar(speed));
            });
            
            // Animate connection lines to show contradiction
            // The line tries to connect but breaks in the middle
            const positions = connectionLine.geometry.attributes.position;
            
            // First segment - from thing to center
            positions.setXYZ(
                0,
                thingSymbol.position.x,
                thingSymbol.position.y,
                thingSymbol.position.z
            );
            
            // Middle point - breaks and vibrates
            const breakPoint = Math.sin(time * 5) * 2;
            positions.setXYZ(
                1,
                contradictionSphere.position.x + Math.sin(time * 7) * 2,
                contradictionSphere.position.y + breakPoint,
                contradictionSphere.position.z + Math.cos(time * 6) * 2
            );
            
            // End segment - from nothing to center
            positions.setXYZ(
                2,
                nothingSymbol.position.x,
                nothingSymbol.position.y,
                nothingSymbol.position.z
            );
            
            positions.needsUpdate = true;
        }
    };
    
    // Add measurement button
    const measureButton = document.createElement('button');
    measureButton.textContent = 'Measure State';
    measureButton.classList.add('action-button');
    
    measureButton.addEventListener('click', () => {
        if (showingContradiction) {
            // Resolve contradiction by choosing one state
            resolveContradiction();
        } else {
            // Return to contradiction
            returnToContradiction();
        }
    });
    
    verseSpecificControls.appendChild(measureButton);
    
    // Function to resolve contradiction
    function resolveContradiction() {
        showingContradiction = false;
        
        // Choose one state randomly
        const chosenState = Math.random() > 0.5 ? 'thing' : 'nothing';
        
        if (chosenState === 'thing') {
            // Transition to "thing" state
            gsap.to(material.uniforms.color1.value, {
                r: new THREE.Color(color1).r,
                g: new THREE.Color(color1).g,
                b: new THREE.Color(color1).b,
                duration: 1
            });
            
            gsap.to(material.uniforms.color2.value, {
                r: new THREE.Color(color1).r,
                g: new THREE.Color(color1).g,
                b: new THREE.Color(color1).b,
                duration: 1
            });
            
            // Highlight thing symbol
            gsap.to(thingMaterial, {
                opacity: 1,
                emissive: color1,
                emissiveIntensity: 0.5,
                duration: 1
            });
            
            // Fade nothing symbol
            gsap.to(nothingMaterial, {
                opacity: 0.2,
                duration: 1
            });
        } else {
            // Transition to "nothing" state
            gsap.to(material.uniforms.color1.value, {
                r: new THREE.Color(color2).r,
                g: new THREE.Color(color2).g,
                b: new THREE.Color(color2).b,
                duration: 1
            });
            
            gsap.to(material.uniforms.color2.value, {
                r: new THREE.Color(color2).r,
                g: new THREE.Color(color2).g,
                b: new THREE.Color(color2).b,
                duration: 1
            });
            
            // Highlight nothing symbol
            gsap.to(nothingMaterial, {
                opacity: 1,
                emissive: color2,
                emissiveIntensity: 0.5,
                duration: 1
            });
            
            // Fade thing symbol
            gsap.to(thingMaterial, {
                opacity: 0.2,
                duration: 1
            });
        }
        
        // Update connection line
        const positions = connectionLine.geometry.attributes.position;
        
        if (chosenState === 'thing') {
            // Connect only to thing
            gsap.to(positions.array, {
                '3': thingSymbol.position.x + (contradictionSphere.position.x - thingSymbol.position.x) * 0.5,
                '4': thingSymbol.position.y,
                '5': thingSymbol.position.z,
                duration: 1
            });
            
            gsap.to(positions.array, {
                '6': contradictionSphere.position.x,
                '7': contradictionSphere.position.y,
                '8': contradictionSphere.position.z,
                duration: 1,
                onUpdate: () => {
                    positions.needsUpdate = true;
                }
            });
        } else {
            // Connect only to nothing
            gsap.to(positions.array, {
                '0': contradictionSphere.position.x,
                '1': contradictionSphere.position.y,
                '2': contradictionSphere.position.z,
                duration: 1
            });
            
            gsap.to(positions.array, {
                '3': nothingSymbol.position.x + (contradictionSphere.position.x - nothingSymbol.position.x) * 0.5,
                '4': nothingSymbol.position.y,
                '5': nothingSymbol.position.z,
                duration: 1,
                onUpdate: () => {
                    positions.needsUpdate = true;
                }
            });
        }
        
        // Remove all sparks
        while (sparksGroup.children.length > 0) {
            const spark = sparksGroup.children[0];
            sparksGroup.remove(spark);
            spark.geometry.dispose();
            spark.material.dispose();
        }
        
        // Update button
        measureButton.textContent = 'Show Contradiction Again';
    }
    
    // Function to return to contradiction
    function returnToContradiction() {
        showingContradiction = true;
        
        // Restore original colors
        gsap.to(material.uniforms.color1.value, {
            r: new THREE.Color(color1).r,
            g: new THREE.Color(color1).g,
            b: new THREE.Color(color1).b,
            duration: 1
        });
        
        gsap.to(material.uniforms.color2.value, {
            r: new THREE.Color(color2).r,
            g: new THREE.Color(color2).g,
            b: new THREE.Color(color2).b,
            duration: 1
        });
        
        // Restore symbols
        gsap.to(thingMaterial, {
            opacity: 0.7,
            emissiveIntensity: 0,
            duration: 1
        });
        
        gsap.to(nothingMaterial, {
            opacity: 0.7,
            emissiveIntensity: 0,
            duration: 1
        });
        
        // Restore connection line
        const positions = connectionLine.geometry.attributes.position;
        
        gsap.to(positions.array, {
            '0': thingSymbol.position.x,
            '1': thingSymbol.position.y,
            '2': thingSymbol.position.z,
            duration: 1
        });
        
        gsap.to(positions.array, {
            '3': contradictionSphere.position.x,
            '4': contradictionSphere.position.y,
            '5': contradictionSphere.position.z,
            duration: 1
        });
        
        gsap.to(positions.array, {
            '6': nothingSymbol.position.x,
            '7': nothingSymbol.position.y,
            '8': nothingSymbol.position.z,
            duration: 1,
            onUpdate: () => {
                positions.needsUpdate = true;
            }
        });
        
        // Update button
        measureButton.textContent = 'Measure State';
    }
}

// Verse 12: Quantum Vacuum Independence
function loadVerse12() {
    // Get configuration
    const { size, density, particleSize, vacuumColor, particleColor } = config.independentVacuum;
    
    // Create vacuum group
    const vacuumGroup = new THREE.Group();
    scene.add(vacuumGroup);
    
    // Create spherical vacuum
    const vacuumGeometry = new THREE.SphereGeometry(size, 32, 32);
    const vacuumMaterial = new THREE.MeshBasicMaterial({
        color: vacuumColor,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    
    const vacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
    vacuumGroup.add(vacuum);
    
    // Create inner glow
    const glowGeometry = new THREE.SphereGeometry(size * 0.8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: vacuumColor,
        transparent: true,
        opacity: 0.05,
        side: THREE.FrontSide
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    vacuumGroup.add(glow);
    
    // Create underlying grid structure to represent independence
    const gridGroup = new THREE.Group();
    vacuumGroup.add(gridGroup);
    
    // Create 3D grid of lines
    const gridSize = size * 1.5;
    const gridDivisions = 8;
    const gridStep = gridSize / gridDivisions;
    
    // Create grid lines
    for (let i = -gridDivisions/2; i <= gridDivisions/2; i++) {
        for (let j = -gridDivisions/2; j <= gridDivisions/2; j++) {
            // X-aligned line
            const xLineGeometry = new THREE.BufferGeometry();
            const xLinePositions = new Float32Array([
                -gridSize/2, i * gridStep, j * gridStep,
                gridSize/2, i * gridStep, j * gridStep
            ]);
            xLineGeometry.setAttribute('position', new THREE.BufferAttribute(xLinePositions, 3));
            
            // Y-aligned line
            const yLineGeometry = new THREE.BufferGeometry();
            const yLinePositions = new Float32Array([
                i * gridStep, -gridSize/2, j * gridStep,
                i * gridStep, gridSize/2, j * gridStep
            ]);
            yLineGeometry.setAttribute('position', new THREE.BufferAttribute(yLinePositions, 3));
            
            // Z-aligned line
            const zLineGeometry = new THREE.BufferGeometry();
            const zLinePositions = new Float32Array([
                i * gridStep, j * gridStep, -gridSize/2,
                i * gridStep, j * gridStep, gridSize/2
            ]);
            zLineGeometry.setAttribute('position', new THREE.BufferAttribute(zLinePositions, 3));
            
            // Create materials with varying opacity based on distance from center
            const iDistance = Math.abs(i) / (gridDivisions/2);
            const jDistance = Math.abs(j) / (gridDivisions/2);
            const distanceFromCenter = Math.max(iDistance, jDistance);
            
            const opacity = 0.5 - distanceFromCenter * 0.4;
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: opacity
            });
            
            // Create lines
            const xLine = new THREE.Line(xLineGeometry, lineMaterial.clone());
            const yLine = new THREE.Line(yLineGeometry, lineMaterial.clone());
            const zLine = new THREE.Line(zLineGeometry, lineMaterial.clone());
            
            // Add to group
            gridGroup.add(xLine);
            gridGroup.add(yLine);
            gridGroup.add(zLine);
        }
    }
    
    // Create particle system for flickering particles
    const particlesGroup = new THREE.Group();
    vacuumGroup.add(particlesGroup);
    
    // Function to create particle pair
    function createParticlePair() {
        // Only create if below density limit
        if (particlesGroup.children.length < density * 100) {
            // Random point within vacuum
            const radius = size * (0.3 + Math.random() * 0.6);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            const position = new THREE.Vector3(x, y, z);
            
            // Create particle and anti-particle
            const geometry1 = new THREE.SphereGeometry(particleSize, 8, 8);
            const geometry2 = new THREE.SphereGeometry(particleSize, 8, 8);
            
            const material1 = new THREE.MeshBasicMaterial({
                color: particleColor,
                transparent: true,
                opacity: 0
            });
            
            const material2 = new THREE.MeshBasicMaterial({
                color: new THREE.Color(particleColor).offsetHSL(0.5, 0, 0), // Complementary color
                transparent: true,
                opacity: 0
            });
            
            const particle1 = new THREE.Mesh(geometry1, material1);
            const particle2 = new THREE.Mesh(geometry2, material2);
            
            // Set positions
            particle1.position.copy(position);
            particle2.position.copy(position);
            
            // Set random directions
            const direction = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
            
            particle1.userData.direction = direction.clone();
            particle2.userData.direction = direction.clone().negate();
            
            // Add to scene
            particlesGroup.add(particle1);
            particlesGroup.add(particle2);
            
            // Animate appearance
            gsap.to(material1, {
                opacity: 0.8,
                duration: 0.3,
                ease: "power1.in"
            });
            
            gsap.to(material2, {
                opacity: 0.8,
                duration: 0.3,
                ease: "power1.in"
            });
            
            // Move particles apart
            const distance = 5 + Math.random() * 10;
            
            gsap.to(particle1.position, {
                x: position.x + direction.x * distance,
                y: position.y + direction.y * distance,
                z: position.z + direction.z * distance,
                duration: 1 + Math.random(),
                ease: "power1.out"
            });
            
            gsap.to(particle2.position, {
                x: position.x - direction.x * distance,
                y: position.y - direction.y * distance,
                z: position.z - direction.z * distance,
                duration: 1 + Math.random(),
                ease: "power1.out",
                onComplete: () => {
                    // Fade out both particles
                    gsap.to(material1, {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power1.out",
                        onComplete: () => {
                            particlesGroup.remove(particle1);
                            geometry1.dispose();
                            material1.dispose();
                        }
                    });
                    
                    gsap.to(material2, {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power1.out",
                        onComplete: () => {
                            particlesGroup.remove(particle2);
                            geometry2.dispose();
                            material2.dispose();
                        }
                    });
                }
            });
        }
    }
    
    // Add some initial particles
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createParticlePair(), i * 200);
    }
    
    // Animation function
    currentAnimation = function(time) {
        // Slowly rotate grid
        gridGroup.rotation.y = time * 0.1;
        gridGroup.rotation.z = time * 0.05;
        
        // Pulse inner glow
        const pulse = Math.sin(time * 0.5) * 0.2 + 1;
        glow.scale.set(pulse, pulse, pulse);
        
        // Create new particle pairs randomly
        if (Math.random() < 0.03 * density) {
            createParticlePair();
        }
    };
    
    // Add density control
    const densityContainer = document.createElement('div');
    densityContainer.classList.add('slider-container');
    
    const densityLabel = document.createElement('label');
    densityLabel.textContent = 'Particle Density';
    
    const densitySlider = document.createElement('input');
    densitySlider.type = 'range';
    densitySlider.min = '0.1';
    densitySlider.max = '2';
    densitySlider.step = '0.1';
    densitySlider.value = density;
    
    densitySlider.addEventListener('input', () => {
        config.independentVacuum.density = parseFloat(densitySlider.value);
    });
    
    densityContainer.appendChild(densityLabel);
    densityContainer.appendChild(densitySlider);
    verseSpecificControls.appendChild(densityContainer);
    
    // Add zoom control
    const zoomContainer = document.createElement('div');
    zoomContainer.classList.add('slider-container');
    
    const zoomLabel = document.createElement('label');
    zoomLabel.textContent = 'Zoom Level';
    
    const zoomSlider = document.createElement('input');
    zoomSlider.type = 'range';
    zoomSlider.min = '50';
    zoomSlider.max = '150';
    zoomSlider.value = '100';
    
    zoomSlider.addEventListener('input', () => {
        gsap.to(camera.position, {
            z: parseFloat(zoomSlider.value),
            duration: 0.5
        });
    });
    
    zoomContainer.appendChild(zoomLabel);
    zoomContainer.appendChild(zoomSlider);
    verseSpecificControls.appendChild(zoomContainer);
    
    // Add enter vacuum button
    const enterButton = document.createElement('button');
    enterButton.textContent = 'Enter Vacuum';
    enterButton.classList.add('action-button');
    
    enterButton.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: "power2.inOut"
        });
    });
    
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit Vacuum';
    exitButton.classList.add('action-button');
    
    exitButton.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: 0,
            y: 20,
            z: 100,
            duration: 2,
            ease: "power2.inOut"
        });
    });
    
    verseSpecificControls.appendChild(enterButton);
    verseSpecificControls.appendChild(exitButton);
}

// Animation loop
function animate(time) {
    time *= 0.001; // Convert to seconds
    
    // Execute current animation function if it exists
    if (currentAnimation) {
        currentAnimation(time);
    }
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
    
    // Continue animation loop
    requestAnimationFrame(animate);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Adjust sidebar based on screen size
    if (window.innerWidth <= 480 && !sidebar.classList.contains('hidden')) {
        toggleSidebar();
    }
}

// Event listeners
window.addEventListener('resize', onWindowResize);

prevVerseBtn.addEventListener('click', () => {
    if (currentVerse > 1) {
        loadVerse(currentVerse - 1);
    }
});

nextVerseBtn.addEventListener('click', () => {
    if (currentVerse < TOTAL_VERSES) {
        loadVerse(currentVerse + 1);
    }
});

// Initialize the scene when page loads
window.onload = initScene;