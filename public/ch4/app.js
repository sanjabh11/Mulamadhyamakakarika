import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { gsap } from 'gsap';
import { config } from './config.js';

// Global variables
let currentVerse = 0;
let scene, camera, renderer, composer, controls;
let animations = [];
let currentAnimation = null;
let isInteracting = false;
let clock = new THREE.Clock();

// DOM elements
const verseTitle = document.getElementById('verse-title');
const verseNumber = document.getElementById('verse-number');
const verseText = document.getElementById('verse-text');
const madhyamakaConcept = document.getElementById('madhyamaka-concept');
const quantumParallel = document.getElementById('quantum-parallel');
const accessibleExplanation = document.getElementById('accessible-explanation');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const explanationToggle = document.getElementById('explanation-toggle');
const explanationContent = document.getElementById('explanation-content');
const interactionHint = document.getElementById('interaction-hint');
const loader = document.getElementById('loader');

// Initialize the app
init();

async function init() {
    // Set up the 3D scene
    setupScene();
    
    // Create all animations but only the first one is active
    await createAllAnimations();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial verse content update
    updateVerseContent();
    
    // Hide the loader
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Start the animation loop
    animate();
    
    // Hide interaction hint after 5 seconds
    setTimeout(() => {
        interactionHint.classList.add('hidden');
    }, 5000);
}

function setupScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.animation.colorPalette.background);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = config.animation.cameraDistance;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 20;
    controls.minDistance = 2;
    
    // Add post-processing
    setupPostProcessing();
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function setupPostProcessing() {
    // Create composer
    composer = new EffectComposer(renderer);
    
    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Add bloom pass
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85  // threshold
    );
    composer.addPass(bloomPass);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

async function createAllAnimations() {
    // Create an array of animation creation functions
    const animationCreators = [
        createFormCauseAnimation,      // Verse 1
        createParticleFieldAnimation,  // Verse 2
        createChefAnimation,           // Verse 3
        createCoinAnimation,           // Verse 4
        createCloudAnimation,          // Verse 5
        createOrbitingParticlesAnimation, // Verse 6
        createAggregatesAnimation,     // Verse 7
        createSmokeAnimation,          // Verse 8
        createMirageAnimation          // Verse 9
    ];
    
    // Create all animations but keep them hidden
    for (let i = 0; i < animationCreators.length; i++) {
        const animation = await animationCreators[i]();
        animations.push(animation);
        
        // Only show the first animation
        if (i === 0) {
            currentAnimation = animation;
            scene.add(animation.group);
        }
    }
}

// Animation 1: Form and Cause Entanglement
async function createFormCauseAnimation() {
    const group = new THREE.Group();
    
    // Create the "form" orb
    const formGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const formMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.primary),
        emissive: new THREE.Color(config.animation.colorPalette.primary).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.9
    });
    const formOrb = new THREE.Mesh(formGeometry, formMaterial);
    formOrb.position.set(2, 0, 0);
    group.add(formOrb);
    
    // Create the "cause" orb
    const causeGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const causeMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.secondary),
        emissive: new THREE.Color(config.animation.colorPalette.secondary).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.9
    });
    const causeOrb = new THREE.Mesh(causeGeometry, causeMaterial);
    causeOrb.position.set(-2, 0, 0);
    group.add(causeOrb);
    
    // Create connecting thread
    const threadCurve = new THREE.CubicBezierCurve3(
        causeOrb.position,
        new THREE.Vector3(-1, 1, 0),
        new THREE.Vector3(1, 1, 0),
        formOrb.position
    );
    
    const threadGeometry = new THREE.TubeGeometry(threadCurve, 20, 0.05, 8, false);
    const threadMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.animation.colorPalette.tertiary),
        transparent: true,
        opacity: 0.8
    });
    const thread = new THREE.Mesh(threadGeometry, threadMaterial);
    group.add(thread);
    
    // Create particle system around the connection
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const pos = threadCurve.getPoint(t);
        particlePositions[i * 3] = pos.x + (Math.random() - 0.5) * 0.3;
        particlePositions[i * 3 + 1] = pos.y + (Math.random() - 0.5) * 0.3;
        particlePositions[i * 3 + 2] = pos.z + (Math.random() - 0.5) * 0.3;
        particleSizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(config.animation.colorPalette.tertiary),
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Subtle pulsing effect for orbs
        formOrb.scale.set(
            1 + Math.sin(time * 2) * 0.05,
            1 + Math.sin(time * 2) * 0.05,
            1 + Math.sin(time * 2) * 0.05
        );
        
        causeOrb.scale.set(
            1 + Math.sin(time * 2 + 1) * 0.05,
            1 + Math.sin(time * 2 + 1) * 0.05,
            1 + Math.sin(time * 2 + 1) * 0.05
        );
        
        // Update particles
        const positions = particleGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount + time * 0.1) % 1;
            const basePos = threadCurve.getPoint(t);
            
            positions[i * 3] = basePos.x + (Math.sin(time * 3 + i) * 0.1);
            positions[i * 3 + 1] = basePos.y + (Math.cos(time * 2 + i) * 0.1);
            positions[i * 3 + 2] = basePos.z + (Math.sin(time * 4 + i) * 0.1);
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
        
        // Update thread
        if (isInteracting) {
            // If user is interacting, show flickering to demonstrate interdependence
            threadMaterial.opacity = 0.3 + Math.random() * 0.7;
            formMaterial.opacity = 0.3 + Math.random() * 0.7;
            causeMaterial.opacity = 0.3 + Math.random() * 0.7;
        } else {
            threadMaterial.opacity = 0.8;
            formMaterial.opacity = 0.9;
            causeMaterial.opacity = 0.9;
        }
    };
    
    // Interaction: Trying to drag them apart
    const onInteractionStart = (event) => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
        
        // Reset positions with animation
        gsap.to(formOrb.position, {
            x: 2,
            y: 0,
            z: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        });
        
        gsap.to(causeOrb.position, {
            x: -2,
            y: 0,
            z: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        });
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 2: Particle Field Animation
async function createParticleFieldAnimation() {
    const group = new THREE.Group();
    
    // Create field (cause)
    const fieldGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.animation.colorPalette.secondary),
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.position.y = -1;
    group.add(field);
    
    // Create wave animation for the field
    const fieldVertices = fieldGeometry.attributes.position.array;
    const fieldInitialY = [];
    
    for (let i = 0; i < fieldVertices.length; i += 3) {
        fieldInitialY.push(fieldVertices[i + 1]);
    }
    
    // Create particles (form)
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;
        const y = Math.random() * 2 + 0.5;
        
        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;
        
        particleSizes[i] = Math.random() * 0.1 + 0.05;
        
        // Gradient color from primary to tertiary
        const ratio = Math.random();
        const color = new THREE.Color().lerpColors(
            new THREE.Color(config.animation.colorPalette.primary),
            new THREE.Color(config.animation.colorPalette.tertiary),
            ratio
        );
        
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Animate field waves
        for (let i = 0; i < fieldVertices.length / 3; i++) {
            const x = fieldGeometry.attributes.position.array[i * 3];
            const z = fieldGeometry.attributes.position.array[i * 3 + 2];
            fieldGeometry.attributes.position.array[i * 3 + 1] = 
                fieldInitialY[i] + 
                Math.sin(time * 2 + x * 0.5) * 0.2 + 
                Math.cos(time + z * 0.5) * 0.2;
        }
        
        fieldGeometry.attributes.position.needsUpdate = true;
        
        // Animate particles
        const positions = particleGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            // Only animate if field is visible
            if (!isInteracting) {
                // Gentle floating motion
                positions[i * 3 + 1] += Math.sin(time * 2 + i) * 0.002;
                
                // Subtle circular motion
                const angle = time * 0.2 + i * 0.01;
                const radius = 0.1;
                positions[i * 3] += Math.cos(angle) * radius * delta;
                positions[i * 3 + 2] += Math.sin(angle) * radius * delta;
                
                // Gravity keeps particles above the field
                if (positions[i * 3 + 1] < 0) {
                    positions[i * 3 + 1] = Math.random() * 2 + 0.5;
                }
            } else {
                // When interacting (field is cut), particles fall and disappear
                positions[i * 3 + 1] -= 0.05;
                
                // Reset particles that fall too far
                if (positions[i * 3 + 1] < -10) {
                    positions[i * 3] = (Math.random() - 0.5) * 8;
                    positions[i * 3 + 1] = 5; // Start from above
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
                }
            }
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
        
        // Hide/show field based on interaction
        if (isInteracting) {
            if (field.visible) {
                field.visible = false;
            }
        } else {
            if (!field.visible) {
                field.visible = true;
            }
        }
    };
    
    // Interaction: Cutting the field
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
        
        // Reset particle positions when field returns
        const positions = particleGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3] = (Math.random() - 0.5) * 8;
                positions[i * 3 + 1] = Math.random() * 2 + 0.5;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
            }
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 3: Chef Animation
async function createChefAnimation() {
    const group = new THREE.Group();
    
    // Create chef (cause)
    const chefGroup = new THREE.Group();
    group.add(chefGroup);
    
    // Chef's body (simplified stylized representation)
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.primary),
        emissive: new THREE.Color(config.animation.colorPalette.primary).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    chefGroup.add(body);
    
    // Chef's head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5d5c5,
        emissive: 0x553322,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    chefGroup.add(head);
    
    // Chef's hat
    const hatGeometry = new THREE.CylinderGeometry(0.5, 0.4, 0.6, 16);
    const hatMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 1.9;
    chefGroup.add(hat);
    
    // Chef's arm
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    const armMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.primary),
        emissive: new THREE.Color(config.animation.colorPalette.primary).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.9
    });
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(0.6, 0.7, 0);
    arm.rotation.z = -Math.PI / 4;
    chefGroup.add(arm);
    
    // Chef's spoon
    const spoonGeometry = new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const spoonMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.9
    });
    const spoon = new THREE.Mesh(spoonGeometry, spoonMaterial);
    spoon.position.set(1.2, 0.2, 0);
    spoon.rotation.z = Math.PI;
    chefGroup.add(spoon);
    
    // Create pot with stew (effect)
    const potGroup = new THREE.Group();
    potGroup.position.set(1.5, -0.5, 0);
    group.add(potGroup);
    
    // Pot
    const potGeometry = new THREE.CylinderGeometry(0.8, 0.6, 0.8, 16);
    const potMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.9
    });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    potGroup.add(pot);
    
    // Stew
    const stewGeometry = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 16);
    const stewMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.tertiary),
        emissive: new THREE.Color(config.animation.colorPalette.tertiary).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.9
    });
    const stew = new THREE.Mesh(stewGeometry, stewMaterial);
    stew.position.y = 0.35;
    potGroup.add(stew);
    
    // Steam particles
    const steamCount = 50;
    const steamGeometry = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamSizes = new Float32Array(steamCount);
    const steamOpacities = new Float32Array(steamCount);
    
    for (let i = 0; i < steamCount; i++) {
        // Initial positions above the pot
        steamPositions[i * 3] = (Math.random() - 0.5) * 0.5 + 1.5;
        steamPositions[i * 3 + 1] = Math.random() * 0.5 + 0.5;
        steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        
        steamSizes[i] = Math.random() * 0.2 + 0.1;
        steamOpacities[i] = Math.random();
    }
    
    steamGeometry.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    steamGeometry.setAttribute('size', new THREE.BufferAttribute(steamSizes, 1));
    steamGeometry.setAttribute('opacity', new THREE.BufferAttribute(steamOpacities, 1));
    
    const steamMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const steam = new THREE.Points(steamGeometry, steamMaterial);
    group.add(steam);
    
    // Position the entire scene
    group.position.set(0, -1, 0);
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Animate chef stirring
        arm.rotation.z = -Math.PI / 4 + Math.sin(time * 3) * 0.2;
        spoon.position.x = 1.2 + Math.sin(time * 3) * 0.1;
        spoon.position.y = 0.2 + Math.cos(time * 3) * 0.1;
        
        // Animate steam particles
        const positions = steamGeometry.attributes.position.array;
        const opacities = steamGeometry.attributes.opacity.array;
        
        for (let i = 0; i < steamCount; i++) {
            // Make steam rise
            positions[i * 3 + 1] += 0.01;
            
            // Add some gentle swaying
            positions[i * 3] += Math.sin(time * 2 + i) * 0.002;
            positions[i * 3 + 2] += Math.cos(time * 2 + i) * 0.002;
            
            // Fade out as it rises
            opacities[i] -= 0.005;
            
            // Reset particles that have risen too high or faded out
            if (positions[i * 3 + 1] > 2 || opacities[i] <= 0) {
                positions[i * 3] = (Math.random() - 0.5) * 0.5 + 1.5;
                positions[i * 3 + 1] = Math.random() * 0.2 + 0.5;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
                opacities[i] = Math.random();
            }
        }
        
        steamGeometry.attributes.position.needsUpdate = true;
        steamGeometry.attributes.opacity.needsUpdate = true;
        
        // Handle interaction (removing the stew)
        if (isInteracting) {
            // Make chef blur out
            bodyMaterial.opacity = 0.3 + Math.random() * 0.3;
            headMaterial.opacity = 0.3 + Math.random() * 0.3;
            hatMaterial.opacity = 0.3 + Math.random() * 0.3;
            armMaterial.opacity = 0.3 + Math.random() * 0.3;
            spoonMaterial.opacity = 0.3 + Math.random() * 0.3;
            
            // Hide stew
            stew.visible = false;
            steam.visible = false;
        } else {
            // Restore chef
            bodyMaterial.opacity = 0.9;
            headMaterial.opacity = 0.9;
            hatMaterial.opacity = 0.9;
            armMaterial.opacity = 0.9;
            spoonMaterial.opacity = 0.9;
            
            // Show stew
            stew.visible = true;
            steam.visible = true;
        }
    };
    
    // Interaction: Removing the stew
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 4: Coin Animation (Superposition)
async function createCoinAnimation() {
    const group = new THREE.Group();
    
    // Create coin
    const coinGroup = new THREE.Group();
    group.add(coinGroup);
    
    // Coin body
    const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    const coinMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.rotation.x = Math.PI / 2;
    coinGroup.add(coin);
    
    // Heads side
    const headsGeometry = new THREE.CircleGeometry(0.8, 32);
    const headsMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.primary),
        emissive: new THREE.Color(config.animation.colorPalette.primary).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.9
    });
    const heads = new THREE.Mesh(headsGeometry, headsMaterial);
    heads.position.y = 0.051;
    heads.rotation.x = -Math.PI / 2;
    coinGroup.add(heads);
    
    // Tails side
    const tailsGeometry = new THREE.CircleGeometry(0.8, 32);
    const tailsMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.secondary),
        emissive: new THREE.Color(config.animation.colorPalette.secondary).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.9
    });
    const tails = new THREE.Mesh(tailsGeometry, tailsMaterial);
    tails.position.y = -0.051;
    tails.rotation.x = Math.PI / 2;
    coinGroup.add(tails);
    
    // Quantum state particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Place particles in a sphere around the coin
        const radius = 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        
        particleSizes[i] = Math.random() * 0.1 + 0.05;
        
        // Gradient color between primary and secondary
        const ratio = Math.random();
        const color = new THREE.Color().lerpColors(
            new THREE.Color(config.animation.colorPalette.primary),
            new THREE.Color(config.animation.colorPalette.secondary),
            ratio
        );
        
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // "Measure" button
    const measureGeometry = new THREE.PlaneGeometry(2, 0.5);
    const measureMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const measureButton = new THREE.Mesh(measureGeometry, measureMaterial);
    measureButton.position.set(0, -2, 0);
    group.add(measureButton);
    
    // Text for button
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.font = '32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('MEASURE', 128, 32);
    
    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true
    });
    const textMesh = new THREE.Mesh(measureGeometry, textMaterial);
    textMesh.position.set(0, -2, 0.01);
    group.add(textMesh);
    
    // Variables for animation state
    let isSpinning = true;
    let isMeasured = false;
    let spinSpeed = 5;
    let measurement = null; // null, 'heads', or 'tails'
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        if (isSpinning) {
            // Spin the coin
            coinGroup.rotation.x += spinSpeed * delta;
            
            // Create blurred effect while spinning
            coin.material.opacity = 0.7 + Math.sin(time * 10) * 0.1;
            
            // Animate particles
            const positions = particleGeometry.attributes.position.array;
            const sizes = particleGeometry.attributes.size.array;
            
            for (let i = 0; i < particleCount; i++) {
                // Make particles orbit
                const orbit = i % 3;
                if (orbit === 0) {
                    // Orbit in XY plane
                    const angle = time + i * 0.01;
                    const radius = 1.5 + Math.sin(time + i) * 0.2;
                    positions[i * 3] = Math.cos(angle) * radius;
                    positions[i * 3 + 1] = Math.sin(angle) * radius;
                } else if (orbit === 1) {
                    // Orbit in XZ plane
                    const angle = time * 1.1 + i * 0.01;
                    const radius = 1.5 + Math.sin(time * 0.7 + i) * 0.2;
                    positions[i * 3] = Math.cos(angle) * radius;
                    positions[i * 3 + 2] = Math.sin(angle) * radius;
                } else {
                    // Orbit in YZ plane
                    const angle = time * 0.9 + i * 0.01;
                    const radius = 1.5 + Math.sin(time * 1.3 + i) * 0.2;
                    positions[i * 3 + 1] = Math.cos(angle) * radius;
                    positions[i * 3 + 2] = Math.sin(angle) * radius;
                }
                
                // Pulsate particle sizes
                sizes[i] = (Math.sin(time * 2 + i) * 0.05 + 0.1) * particleSizes[i];
            }
            
            particleGeometry.attributes.position.needsUpdate = true;
            particleGeometry.attributes.size.needsUpdate = true;
        } else if (isMeasured) {
            // Coin has stopped on either heads or tails
            particleMaterial.opacity = Math.max(0, particleMaterial.opacity - 0.01);
        }
        
        // Handle interaction (measure button click)
        if (isInteracting && isSpinning) {
            // Slow down and stop the coin
            spinSpeed = Math.max(0, spinSpeed - delta * 10);
            
            if (spinSpeed <= 0.1) {
                isSpinning = false;
                isMeasured = true;
                spinSpeed = 0;
                
                // Determine the measurement result
                measurement = Math.random() > 0.5 ? 'heads' : 'tails';
                
                // Set the final position based on measurement
                if (measurement === 'heads') {
                    gsap.to(coinGroup.rotation, {
                        x: Math.PI * 2 * Math.floor(coinGroup.rotation.x / (Math.PI * 2)),
                        duration: 0.5,
                        ease: "bounce.out"
                    });
                } else {
                    gsap.to(coinGroup.rotation, {
                        x: Math.PI + Math.PI * 2 * Math.floor(coinGroup.rotation.x / (Math.PI * 2)),
                        duration: 0.5,
                        ease: "bounce.out"
                    });
                }
                
                // Update button text to "Reset"
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillText('RESET', 128, 32);
                textTexture.needsUpdate = true;
            }
        }
    };
    
    // Interaction: Measuring the coin state
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
        
        // If measurement is complete and button is clicked again, reset
        if (isMeasured) {
            isSpinning = true;
            isMeasured = false;
            spinSpeed = 5;
            measurement = null;
            particleMaterial.opacity = 0.8;
            
            // Update button text back to "Measure"
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText('MEASURE', 128, 32);
            textTexture.needsUpdate = true;
        }
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 5: Cloud Animation
async function createCloudAnimation() {
    const group = new THREE.Group();
    
    // Create cloud system
    const cloudCount = 300;
    const cloudGeometry = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudCount * 3);
    const cloudSizes = new Float32Array(cloudCount);
    const cloudOpacities = new Float32Array(cloudCount);
    
    // Create a cloud shape (roughly spherical with more density in the center)
    for (let i = 0; i < cloudCount; i++) {
        const radius = 2 * Math.cbrt(Math.random()); // Cube root for more even distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        cloudPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        cloudPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // Flatten vertically
        cloudPositions[i * 3 + 2] = radius * Math.cos(phi);
        
        cloudSizes[i] = Math.random() * 0.4 + 0.2;
        cloudOpacities[i] = Math.random() * 0.8 + 0.2;
    }
    
    cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1));
    cloudGeometry.setAttribute('opacity', new THREE.BufferAttribute(cloudOpacities, 1));
    
    // Custom shader material for cloud particles
    const cloudMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            time: { value: 0 },
            interacting: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute float opacity;
            varying float vOpacity;
            uniform float time;
            uniform float interacting;
            
            void main() {
                vOpacity = opacity;
                
                // Clone position for manipulation
                vec3 pos = position;
                
                // Add gentle movement
                float noise = sin(time * 0.5 + position.x) * 0.1 + 
                             cos(time * 0.7 + position.y) * 0.1 +
                             sin(time * 0.9 + position.z) * 0.1;
                
                // If interacting, scatter particles
                if (interacting > 0.5) {
                    float angle = time * 2.0 + float(gl_VertexID);
                    float distance = interacting * 2.0;
                    pos.x += cos(angle) * distance;
                    pos.y += sin(angle) * distance;
                    pos.z += noise * distance;
                    vOpacity = max(0.0, vOpacity - interacting * 0.8);
                } else {
                    // Normal gentle movement
                    pos.x += noise * 0.2;
                    pos.y += noise * 0.2;
                    pos.z += noise * 0.2;
                }
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vOpacity;
            
            void main() {
                // Calculate distance from center of point
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                // Soft cloud-like edge
                float alpha = smoothstep(0.5, 0.3, dist) * vOpacity;
                
                gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
            }
        `
    });
    
    const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
    group.add(cloud);
    
    // Add a subtle glow effect
    const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.animation.colorPalette.secondary),
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Update time uniform for the shader
        cloudMaterial.uniforms.time.value = time;
        
        // Update interacting state
        cloudMaterial.uniforms.interacting.value = isInteracting ? 1.0 : Math.max(0, cloudMaterial.uniforms.interacting.value - delta);
        
        // Pulsate glow
        glow.scale.set(
            1 + Math.sin(time) * 0.1,
            1 + Math.sin(time) * 0.1,
            1 + Math.sin(time) * 0.1
        );
        
        // Adjust glow opacity
        glowMaterial.opacity = 0.2 + Math.sin(time * 0.5) * 0.05;
        
        // Rotate the entire cloud slowly
        group.rotation.y = time * 0.1;
    };
    
    // Interaction: Trying to hold the cloud
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 6: Orbiting Particles Animation
async function createOrbitingParticlesAnimation() {
    const group = new THREE.Group();
    
    // Create two orbiting particles connected by a thread
    
    // Particle 1
    const particle1Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle1Material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.primary),
        emissive: new THREE.Color(config.animation.colorPalette.primary).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.9
    });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    group.add(particle1);
    
    // Particle 2
    const particle2Geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle2Material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.animation.colorPalette.secondary),
        emissive: new THREE.Color(config.animation.colorPalette.secondary).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.9
    });
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    group.add(particle2);
    
    // Connecting thread (updated in animation)
    const threadCurve = new THREE.LineCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
    );
    
    const threadGeometry = new THREE.TubeGeometry(threadCurve, 20, 0.05, 8, false);
    const threadMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.animation.colorPalette.tertiary),
        transparent: true,
        opacity: 0.8
    });
    const thread = new THREE.Mesh(threadGeometry, threadMaterial);
    group.add(thread);
    
    // Create particle system around the thread
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = 0;
        particlePositions[i * 3 + 1] = 0;
        particlePositions[i * 3 + 2] = 0;
        particleSizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(config.animation.colorPalette.tertiary),
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Calculate positions for orbiting particles
        const orbitRadius = 2;
        const orbit1Speed = 0.5;
        const orbit2Speed = 0.7;
        
        // Particle 1 orbits in XZ plane
        particle1.position.x = Math.cos(time * orbit1Speed) * orbitRadius;
        particle1.position.z = Math.sin(time * orbit1Speed) * orbitRadius;
        particle1.position.y = Math.sin(time) * 0.2; // Small up/down motion
        
        // Particle 2 orbits in a different plane
        particle2.position.x = Math.cos(time * orbit2Speed + Math.PI) * orbitRadius;
        particle2.position.z = Math.sin(time * orbit2Speed + Math.PI) * orbitRadius;
        particle2.position.y = Math.sin(time + Math.PI) * 0.2; // Small up/down motion
        
        // Update thread between particles
        const newThreadCurve = new THREE.LineCurve3(
            particle1.position,
            particle2.position
        );
        
        // Create new geometry for the thread (can't update the curve directly)
        thread.geometry.dispose();
        thread.geometry = new THREE.TubeGeometry(newThreadCurve, 20, 0.05, 8, false);
        
        // Update particles along the thread
        const positions = particleGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            // Position particles along the thread with some random offset
            const t = (i / particleCount + time * 0.1) % 1;
            const pos = new THREE.Vector3().lerpVectors(particle1.position, particle2.position, t);
            
            // Add some randomness
            pos.x += (Math.random() - 0.5) * 0.2;
            pos.y += (Math.random() - 0.5) * 0.2;
            pos.z += (Math.random() - 0.5) * 0.2;
            
            positions[i * 3] = pos.x;
            positions[i * 3 + 1] = pos.y;
            positions[i * 3 + 2] = pos.z;
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
        
        // Handle interaction (trying to merge particles)
        if (isInteracting) {
            // Move particles closer together but they can't merge
            const resistance = 0.1; // How strongly they resist merging
            const currentDistance = particle1.position.distanceTo(particle2.position);
            const targetDistance = 1.0; // Minimum distance they can get
            
            if (currentDistance > targetDistance) {
                // Move particles closer
                const p1Dir = new THREE.Vector3().subVectors(particle2.position, particle1.position).normalize();
                const p2Dir = new THREE.Vector3().subVectors(particle1.position, particle2.position).normalize();
                
                particle1.position.add(p1Dir.multiplyScalar(delta * 2));
                particle2.position.add(p2Dir.multiplyScalar(delta * 2));
            } else {
                // They resist - add some repulsion force
                const p1Dir = new THREE.Vector3().subVectors(particle1.position, particle2.position).normalize();
                const p2Dir = new THREE.Vector3().subVectors(particle2.position, particle1.position).normalize();
                
                particle1.position.add(p1Dir.multiplyScalar(resistance));
                particle2.position.add(p2Dir.multiplyScalar(resistance));
                
                // Visual effect for resistance - make particles pulse
                const pulseScale = 1 + Math.sin(time * 10) * 0.2;
                particle1.scale.set(pulseScale, pulseScale, pulseScale);
                particle2.scale.set(pulseScale, pulseScale, pulseScale);
                
                // Brightening of the thread
                threadMaterial.opacity = 0.8 + Math.sin(time * 20) * 0.2;
                threadMaterial.color.setRGB(
                    1,
                    0.5 + Math.sin(time * 15) * 0.5,
                    0.5 + Math.cos(time * 15) * 0.5
                );
            }
        } else {
            // Reset particle scales
            particle1.scale.set(1, 1, 1);
            particle2.scale.set(1, 1, 1);
            
            // Reset thread color
            threadMaterial.opacity = 0.8;
            threadMaterial.color = new THREE.Color(config.animation.colorPalette.tertiary);
        }
    };
    
    // Interaction: Trying to merge the particles
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 7: Aggregates Animation (Cake mixing)
async function createAggregatesAnimation() {
    const group = new THREE.Group();
    
    // Create a cake bowl
    const bowlGeometry = new THREE.CylinderGeometry(1.5, 1.2, 1, 32, 1, true);
    const bowlMaterial = new THREE.MeshPhongMaterial({
        color: 0x8a7c70,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
    bowl.position.y = -0.5;
    group.add(bowl);
    
    // Create cake base (bottom of bowl)
    const cakeBaseGeometry = new THREE.CircleGeometry(1.2, 32);
    const cakeBaseMaterial = new THREE.MeshPhongMaterial({
        color: 0x8a7c70,
        transparent: true,
        opacity: 0.9
    });
    const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeBaseMaterial);
    cakeBase.position.y = -1;
    cakeBase.rotation.x = -Math.PI / 2;
    group.add(cakeBase);
    
    // Create the five aggregates (ingredients)
    const ingredients = [];
    const ingredientColors = [
        config.animation.colorPalette.primary,    // Form
        config.animation.colorPalette.secondary,  // Feeling
        config.animation.colorPalette.tertiary,   // Perception
        0xf5d25c,                                 // Mental formations
        0x5cf55c                                  // Consciousness
    ];
    
    const ingredientNames = [
        "Form",
        "Feeling",
        "Perception",
        "Mental Formations",
        "Consciousness"
    ];
    
    for (let i = 0; i < 5; i++) {
        // Create an ingredient group
        const ingredientGroup = new THREE.Group();
        
        // Random number of particles for each ingredient
        const particleCount = Math.floor(Math.random() * 30) + 20;
        const ingredientGeometry = new THREE.BufferGeometry();
        const ingredientPositions = new Float32Array(particleCount * 3);
        const ingredientSizes = new Float32Array(particleCount);
        
        // Initial positions outside the bowl
        const angle = (i / 5) * Math.PI * 2;
        const radius = 3;
        const centerX = Math.cos(angle) * radius;
        const centerZ = Math.sin(angle) * radius;
        
        for (let j = 0; j < particleCount; j++) {
            // Cluster particles around the ingredient center
            ingredientPositions[j * 3] = centerX + (Math.random() - 0.5) * 0.5;
            ingredientPositions[j * 3 + 1] = 1 + Math.random() * 0.5;
            ingredientPositions[j * 3 + 2] = centerZ + (Math.random() - 0.5) * 0.5;
            
            ingredientSizes[j] = Math.random() * 0.2 + 0.1;
        }
        
        ingredientGeometry.setAttribute('position', new THREE.BufferAttribute(ingredientPositions, 3));
        ingredientGeometry.setAttribute('size', new THREE.BufferAttribute(ingredientSizes, 1));
        
        const ingredientMaterial = new THREE.PointsMaterial({
            color: new THREE.Color(ingredientColors[i]),
            size: 0.2,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        
        const ingredientParticles = new THREE.Points(ingredientGeometry, ingredientMaterial);
        ingredientGroup.add(ingredientParticles);
        
        // Add a label for the ingredient
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = '20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(ingredientNames[i], 64, 16);
        
        const labelTexture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({
            map: labelTexture,
            transparent: true
        });
        const label = new THREE.Sprite(labelMaterial);
        label.scale.set(1, 0.25, 1);
        label.position.set(centerX, 2, centerZ);
        ingredientGroup.add(label);
        
        // Add to ingredients array and scene
        ingredients.push({
            group: ingredientGroup,
            particles: ingredientParticles,
            geometry: ingredientGeometry,
            material: ingredientMaterial,
            centerX: centerX,
            centerZ: centerZ,
            label: label,
            isRemoved: false
        });
        
        group.add(ingredientGroup);
    }
    
    // Create cake mixture (initially hidden)
    const mixtureCount = 300;
    const mixtureGeometry = new THREE.BufferGeometry();
    const mixturePositions = new Float32Array(mixtureCount * 3);
    const mixtureSizes = new Float32Array(mixtureCount);
    const mixtureColors = new Float32Array(mixtureCount * 3);
    
    for (let i = 0; i < mixtureCount; i++) {
        // Distribute particles within the bowl
        const radius = Math.random() * 1.2;
        const angle = Math.random() * Math.PI * 2;
        mixturePositions[i * 3] = Math.cos(angle) * radius;
        mixturePositions[i * 3 + 1] = -0.5 + Math.random() * 0.5;
        mixturePositions[i * 3 + 2] = Math.sin(angle) * radius;
        
        mixtureSizes[i] = Math.random() * 0.15 + 0.05;
        
        // Random color from the ingredients
        const colorIndex = Math.floor(Math.random() * 5);
        const color = new THREE.Color(ingredientColors[colorIndex]);
        mixtureColors[i * 3] = color.r;
        mixtureColors[i * 3 + 1] = color.g;
        mixtureColors[i * 3 + 2] = color.b;
    }
    
    mixtureGeometry.setAttribute('position', new THREE.BufferAttribute(mixturePositions, 3));
    mixtureGeometry.setAttribute('size', new THREE.BufferAttribute(mixtureSizes, 1));
    mixtureGeometry.setAttribute('color', new THREE.BufferAttribute(mixtureColors, 3));
    
    const mixtureMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    const mixture = new THREE.Points(mixtureGeometry, mixtureMaterial);
    group.add(mixture);
    
    // Variables to track mixing state
    let mixingProgress = 0;
    let selectedIngredient = -1;
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Handle ingredients
        ingredients.forEach((ingredient, index) => {
            if (!ingredient.isRemoved) {
                // Make ingredients float gently
                ingredient.group.position.y = Math.sin(time + index) * 0.1;
                
                // Label always faces camera
                ingredient.label.position.y = 2 + Math.sin(time + index) * 0.1;
            } else {
                // If ingredient is being removed, update its particles
                const positions = ingredient.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length / 3; i++) {
                    // Move towards the bowl
                    const x = positions[i * 3];
                    const y = positions[i * 3 + 1];
                    const z = positions[i * 3 + 2];
                    
                    const dirX = 0 - x;
                    const dirY = -0.5 - y;
                    const dirZ = 0 - z;
                    
                    positions[i * 3] += dirX * delta * 2;
                    positions[i * 3 + 1] += dirY * delta * 2;
                    positions[i * 3 + 2] += dirZ * delta * 2;
                    
                    // Add some randomness for mixing effect
                    positions[i * 3] += (Math.random() - 0.5) * 0.1;
                    positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
                }
                
                ingredient.geometry.attributes.position.needsUpdate = true;
                
                // Fade out the label
                ingredient.label.material.opacity = Math.max(0, ingredient.label.material.opacity - delta);
                
                // Fade out the particles
                ingredient.material.opacity = Math.max(0, ingredient.material.opacity - delta * 0.5);
                
                // If particles have all moved to the bowl, fully remove
                if (ingredient.material.opacity <= 0.1) {
                    ingredient.group.visible = false;
                    
                    // Increase mixing progress
                    mixingProgress += delta * 0.5;
                    
                    // Show the mixture with increasing opacity
                    mixtureMaterial.opacity = Math.min(1, mixingProgress);
                }
            }
        });
        
        // Animate the mixture
        if (mixingProgress > 0) {
            const positions = mixtureGeometry.attributes.position.array;
            
            for (let i = 0; i < mixtureCount; i++) {
                // Gentle stirring motion
                const x = positions[i * 3];
                const z = positions[i * 3 + 2];
                
                const distance = Math.sqrt(x * x + z * z);
                const angle = Math.atan2(z, x) + delta * (1 - distance / 1.2);
                
                positions[i * 3] = Math.cos(angle) * distance;
                positions[i * 3 + 2] = Math.sin(angle) * distance;
                
                // Vertical bobbing
                positions[i * 3 + 1] += Math.sin(time * 2 + i) * 0.005;
                
                // Keep particles inside the bowl
                const newDist = Math.sqrt(positions[i * 3] * positions[i * 3] + positions[i * 3 + 2] * positions[i * 3 + 2]);
                if (newDist > 1.2) {
                    positions[i * 3] *= 1.2 / newDist;
                    positions[i * 3 + 2] *= 1.2 / newDist;
                }
                
                // Keep vertical position correct
                if (positions[i * 3 + 1] > -0.1) {
                    positions[i * 3 + 1] = -0.1;
                }
                if (positions[i * 3 + 1] < -0.9) {
                    positions[i * 3 + 1] = -0.9;
                }
            }
            
            mixtureGeometry.attributes.position.needsUpdate = true;
        }
        
        // Handle interaction (removing an ingredient)
        if (isInteracting && selectedIngredient === -1) {
            // Select a random non-removed ingredient
            const availableIngredients = ingredients.filter(ing => !ing.isRemoved);
            
            if (availableIngredients.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableIngredients.length);
                const selected = availableIngredients[randomIndex];
                selected.isRemoved = true;
                selectedIngredient = ingredients.indexOf(selected);
            }
        }
        
        // If all ingredients are removed, make the mixture unstable
        if (mixingProgress >= 5 && isInteracting) {
            // Mixture collapses
            const positions = mixtureGeometry.attributes.position.array;
            
            for (let i = 0; i < mixtureCount; i++) {
                // Particles fall out of the bowl
                positions[i * 3 + 1] -= 0.1;
                positions[i * 3] += (Math.random() - 0.5) * 0.1;
                positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
            }
            
            mixtureGeometry.attributes.position.needsUpdate = true;
            
            // Fade out the mixture
            mixtureMaterial.opacity = Math.max(0, mixtureMaterial.opacity - 0.01);
            
            // Reset if all particles have fallen
            if (mixtureMaterial.opacity <= 0) {
                resetCake();
            }
        }
    };
    
    // Function to reset the cake animation
    function resetCake() {
        // Reset mixture
        mixingProgress = 0;
        mixtureMaterial.opacity = 0;
        
        // Reset ingredient positions
        ingredients.forEach((ingredient, index) => {
            // Reset flags
            ingredient.isRemoved = false;
            selectedIngredient = -1;
            
            // Make visible again
            ingredient.group.visible = true;
            
            // Reset opacity
            ingredient.material.opacity = 0.9;
            ingredient.label.material.opacity = 1;
            
            // Reset positions
            const positions = ingredient.geometry.attributes.position.array;
            const angle = (index / 5) * Math.PI * 2;
            const radius = 3;
            const centerX = Math.cos(angle) * radius;
            const centerZ = Math.sin(angle) * radius;
            
            for (let j = 0; j < positions.length / 3; j++) {
                positions[j * 3] = centerX + (Math.random() - 0.5) * 0.5;
                positions[j * 3 + 1] = 1 + Math.random() * 0.5;
                positions[j * 3 + 2] = centerZ + (Math.random() - 0.5) * 0.5;
            }
            
            ingredient.geometry.attributes.position.needsUpdate = true;
        });
        
        // Reset mixture positions
        const mixturePositions = mixtureGeometry.attributes.position.array;
        
        for (let i = 0; i < mixtureCount; i++) {
            const radius = Math.random() * 1.2;
            const angle = Math.random() * Math.PI * 2;
            mixturePositions[i * 3] = Math.cos(angle) * radius;
            mixturePositions[i * 3 + 1] = -0.5 + Math.random() * 0.5;
            mixturePositions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        
        mixtureGeometry.attributes.position.needsUpdate = true;
    }
    
    // Interaction: Removing aggregates
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
        selectedIngredient = -1;
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 8: Smoke Animation
async function createSmokeAnimation() {
    const group = new THREE.Group();
    
    // Create smoke system
    const smokeCount = 300;
    const smokeGeometry = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    const smokeSizes = new Float32Array(smokeCount);
    const smokeOpacities = new Float32Array(smokeCount);
    const smokeColors = new Float32Array(smokeCount * 3);
    
    // Initial smoke cloud shape
    for (let i = 0; i < smokeCount; i++) {
        // Distribute in a spherical cloud
        const radius = 1.5 * Math.cbrt(Math.random()); // Cube root distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        smokePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        smokePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        smokePositions[i * 3 + 2] = radius * Math.cos(phi);
        
        smokeSizes[i] = Math.random() * 0.3 + 0.1;
        smokeOpacities[i] = Math.random() * 0.8 + 0.2;
        
        // Gradient from primary to secondary color
        const ratio = Math.random();
        const color = new THREE.Color().lerpColors(
            new THREE.Color(config.animation.colorPalette.primary),
            new THREE.Color(config.animation.colorPalette.secondary),
            ratio
        );
        
        smokeColors[i * 3] = color.r;
        smokeColors[i * 3 + 1] = color.g;
        smokeColors[i * 3 + 2] = color.b;
    }
    
    smokeGeometry.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    smokeGeometry.setAttribute('size', new THREE.BufferAttribute(smokeSizes, 1));
    smokeGeometry.setAttribute('opacity', new THREE.BufferAttribute(smokeOpacities, 1));
    smokeGeometry.setAttribute('color', new THREE.BufferAttribute(smokeColors, 3));
    
    // Custom shader material for smoke
    const smokeMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            time: { value: 0 },
            interacting: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute float opacity;
            attribute vec3 color;
            varying float vOpacity;
            varying vec3 vColor;
            uniform float time;
            uniform float interacting;
            
            void main() {
                vOpacity = opacity;
                vColor = color;
                
                // Clone position for manipulation
                vec3 pos = position;
                
                // Add gentle swirling motion
                float angle = time * 0.5 + length(position);
                
                // If interacting (trying to grab smoke), make it disperse faster
                if (interacting > 0.5) {
                    // Direction away from center
                    vec3 dir = normalize(position);
                    
                    // Move outward
                    pos += dir * interacting * 0.1;
                    
                    // Add turbulence
                    pos.x += sin(time * 3.0 + position.z * 5.0) * 0.2;
                    pos.y += cos(time * 2.7 + position.x * 4.0) * 0.2;
                    pos.z += sin(time * 2.3 + position.y * 4.5) * 0.2;
                    
                    // Reduce opacity
                    vOpacity = max(0.0, vOpacity - interacting * 0.5);
                } else {
                    // Normal gentle movement
                    pos.x += sin(time * 0.7 + position.z * 2.0) * 0.05;
                    pos.y += cos(time * 0.6 + position.x * 1.5) * 0.05;
                    pos.z += sin(time * 0.5 + position.y * 1.7) * 0.05;
                }
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vOpacity;
            varying vec3 vColor;
            
            void main() {
                // Calculate distance from center of point
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                // Soft smoke-like edge
                float alpha = smoothstep(0.5, 0.2, dist) * vOpacity;
                
                gl_FragColor = vec4(vColor, alpha);
            }
        `
    });
    
    const smoke = new THREE.Points(smokeGeometry, smokeMaterial);
    group.add(smoke);
    
    // Add a hand that tries to catch smoke
    const handGroup = new THREE.Group();
    handGroup.visible = false; // Only show when interacting
    group.add(handGroup);
    
    // Simple hand representation
    const palmGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const palmMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5d5c5,
        transparent: true,
        opacity: 0.7
    });
    const palm = new THREE.Mesh(palmGeometry, palmMaterial);
    handGroup.add(palm);
    
    // Fingers
    for (let i = 0; i < 5; i++) {
        const angle = (i / 4) * Math.PI * 0.8 - Math.PI * 0.4;
        const fingerGeometry = new THREE.CapsuleGeometry(0.08, 0.4, 4, 8);
        const fingerMaterial = new THREE.MeshPhongMaterial({
            color: 0xf5d5c5,
            transparent: true,
            opacity: 0.7
        });
        const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);
        finger.position.set(
            Math.sin(angle) * 0.3,
            Math.cos(angle) * 0.3 - 0.2,
            0
        );
        finger.rotation.z = angle - Math.PI / 2;
        handGroup.add(finger);
    }
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Update time uniform for the shader
        smokeMaterial.uniforms.time.value = time;
        smokeMaterial.uniforms.interacting.value = isInteracting ? 1.0 : Math.max(0, smokeMaterial.uniforms.interacting.value - delta);
        
        // Handle interaction (trying to catch smoke)
        if (isInteracting) {
            // Show hand
            handGroup.visible = true;
            
            // Move hand with mouse/touch or animate it
            handGroup.position.set(
                Math.sin(time) * 1.5,
                Math.cos(time * 0.7) * 1.5,
                Math.sin(time * 0.5) * 1.5
            );
            
            // Make grabbing gesture
            handGroup.children.forEach((finger, i) => {
                if (i > 0) { // Skip palm
                    finger.rotation.z = finger.rotation.z - 0.1;
                }
            });
        } else {
            // Hide hand when not interacting
            handGroup.visible = false;
            
            // Reset smoke positions if they've moved too far
            const positions = smokeGeometry.attributes.position.array;
            const opacities = smokeGeometry.attributes.opacity.array;
            
            for (let i = 0; i < smokeCount; i++) {
                const distance = Math.sqrt(
                    positions[i * 3] * positions[i * 3] +
                    positions[i * 3 + 1] * positions[i * 3 + 1] +
                    positions[i * 3 + 2] * positions[i * 3 + 2]
                );
                
                // If particles have moved too far or faded too much, reset them
                if (distance > 3 || opacities[i] < 0.1) {
                    const radius = 1.5 * Math.cbrt(Math.random());
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    
                    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[i * 3 + 2] = radius * Math.cos(phi);
                    
                    opacities[i] = Math.random() * 0.8 + 0.2;
                }
            }
            
            smokeGeometry.attributes.position.needsUpdate = true;
            smokeGeometry.attributes.opacity.needsUpdate = true;
        }
        
        // Rotate the entire smoke system slowly
        smoke.rotation.y = time * 0.1;
    };
    
    // Interaction: Trying to catch smoke
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

// Animation 9: Mirage Animation
async function createMirageAnimation() {
    const group = new THREE.Group();
    
    // Create a desert scene
    
    // Sand base
    const sandGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    const sandMaterial = new THREE.MeshPhongMaterial({
        color: 0xe6cc8f,
        shininess: 0,
        flatShading: true
    });
    const sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.rotation.x = -Math.PI / 2;
    sand.position.y = -1.5;
    group.add(sand);
    
    // Add some gentle dunes to the sand
    const sandVertices = sandGeometry.attributes.position.array;
    
    for (let i = 0; i < sandVertices.length; i += 3) {
        const x = sandVertices[i];
        const z = sandVertices[i + 2];
        
        // Create gentle dunes
        sandVertices[i + 1] = Math.sin(x * 0.5) * 0.2 + Math.cos(z * 0.3) * 0.3;
    }
    
    sandGeometry.attributes.position.needsUpdate = true;
    sandGeometry.computeVertexNormals();
    
    // Create mirage (water illusion)
    const mirageGeometry = new THREE.PlaneGeometry(8, 4, 50, 25);
    const mirageUniforms = {
        time: { value: 0 },
        interacting: { value: 0 }
    };
    const mirageMaterial = new THREE.ShaderMaterial({
        uniforms: mirageUniforms,
        transparent: true,
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            
            void main() {
                vUv = uv;
                
                // Add gentle wave motion
                vec3 pos = position;
                pos.z = sin(position.x * 5.0 + time) * 0.02 + cos(position.y * 3.0 + time * 0.7) * 0.02;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            uniform float interacting;
            
            void main() {
                // Create a shimmering water-like effect
                float waves = sin(vUv.x * 20.0 + time) * 0.1 + cos(vUv.y * 15.0 + time * 0.8) * 0.1;
                
                // Create blue-ish water color with reflective highlights
                vec3 waterColor = vec3(0.1, 0.5, 0.8) + vec3(waves);
                
                // Edge fadeout
                float edgeFade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
                
                // When zooming in (interacting), reveal the illusion
                float opacity = 0.8 - interacting * 0.8;
                
                // Fade out and reveal illusion while interacting
                if (interacting > 0.5) {
                    waterColor = mix(waterColor, vec3(0.8, 0.7, 0.5), interacting);
                }
                
                gl_FragColor = vec4(waterColor, opacity * edgeFade);
            }
        `
    });
    
    const mirage = new THREE.Mesh(mirageGeometry, mirageMaterial);
    mirage.position.set(0, -1.3, -4);
    mirage.rotation.x = -Math.PI / 2 + 0.1;
    group.add(mirage);
    
    // Create heat distortion effect
    const heatGeometry = new THREE.PlaneGeometry(20, 10, 1, 1);
    const heatUniforms = {
        time: { value: 0 }
    };
    const heatMaterial = new THREE.ShaderMaterial({
        uniforms: heatUniforms,
        transparent: true,
        vertexShader: `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            
            void main() {
                // Height-based heat distortion effect
                float height = 1.0 - vUv.y;
                float distortion = sin(vUv.x * 20.0 + time * 2.0) * 0.02 * height * height;
                
                // Stronger near ground
                float opacity = height * height * 0.15;
                
                gl_FragColor = vec4(1.0, 1.0, 1.0, opacity * (0.5 + distortion));
            }
        `
    });
    
    const heat = new THREE.Mesh(heatGeometry, heatMaterial);
    heat.position.set(0, 0, -5);
    group.add(heat);
    
    // Add a magnifying glass
    const glassGroup = new THREE.Group();
    glassGroup.visible = false; // Only show when interacting
    group.add(glassGroup);
    
    // Glass lens
    const lensGeometry = new THREE.CircleGeometry(0.8, 32);
    const lensMaterial = new THREE.MeshPhongMaterial({
        color: 0xadd8e6,
        transparent: true,
        opacity: 0.3,
        shininess: 100
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    glassGroup.add(lens);
    
    // Glass frame
    const frameGeometry = new THREE.RingGeometry(0.8, 0.9, 32);
    const frameMaterial = new THREE.MeshPhongMaterial({
        color: 0xc0c0c0,
        shininess: 80
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = 0.01;
    glassGroup.add(frame);
    
    // Handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: 0xc0c0c0,
        shininess: 80
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0.8, -0.8, 0);
    handle.rotation.z = Math.PI / 4;
    glassGroup.add(handle);
    
    // Animation function
    const update = (delta) => {
        const time = clock.getElapsedTime();
        
        // Update shader uniforms
        mirageUniforms.time.value = time;
        mirageUniforms.interacting.value = isInteracting ? 
            Math.min(1, mirageUniforms.interacting.value + delta * 2) : 
            Math.max(0, mirageUniforms.interacting.value - delta * 2);
        
        heatUniforms.time.value = time;
        
        // Handle interaction (zooming in on mirage)
        if (isInteracting) {
            // Show magnifying glass
            glassGroup.visible = true;
            
            // Position it over the mirage
            glassGroup.position.set(
                Math.sin(time * 0.5) * 2,
                0,
                -3 + Math.cos(time * 0.3)
            );
            glassGroup.rotation.y = Math.sin(time * 0.2) * 0.2;
        } else {
            // Hide magnifying glass
            glassGroup.visible = false;
        }
        
        // Gentle camera movement
        group.rotation.y = Math.sin(time * 0.1) * 0.05;
    };
    
    // Interaction: Zooming in on mirage
    const onInteractionStart = () => {
        isInteracting = true;
    };
    
    const onInteractionEnd = () => {
        isInteracting = false;
    };
    
    return {
        group,
        update,
        onInteractionStart,
        onInteractionEnd
    };
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // Update controls
    controls.update();
    
    // Update current animation
    if (currentAnimation) {
        currentAnimation.update(delta);
    }
    
    // Render scene
    composer.render();
}

function setupEventListeners() {
    // Toggle explanation
    explanationToggle.addEventListener('click', () => {
        const isHidden = explanationContent.classList.contains('hidden');
        
        if (isHidden) {
            explanationContent.classList.remove('hidden');
            explanationToggle.classList.add('expanded');
            explanationToggle.innerHTML = '<span class="toggle-icon">+</span> Hide Explanation';
        } else {
            explanationContent.classList.add('hidden');
            explanationToggle.classList.remove('expanded');
            explanationToggle.innerHTML = '<span class="toggle-icon">+</span> Show Explanation';
        }
    });
    
    // Navigation buttons
    prevVerseBtn.addEventListener('click', showPreviousVerse);
    nextVerseBtn.addEventListener('click', showNextVerse);
    
    // Mouse/touch interaction for animations
    window.addEventListener('mousedown', (event) => {
        if (currentAnimation && currentAnimation.onInteractionStart) {
            currentAnimation.onInteractionStart(event);
        }
    });
    
    window.addEventListener('mouseup', () => {
        if (currentAnimation && currentAnimation.onInteractionEnd) {
            currentAnimation.onInteractionEnd();
        }
    });
    
    window.addEventListener('touchstart', (event) => {
        if (currentAnimation && currentAnimation.onInteractionStart) {
            currentAnimation.onInteractionStart(event);
        }
    });
    
    window.addEventListener('touchend', () => {
        if (currentAnimation && currentAnimation.onInteractionEnd) {
            currentAnimation.onInteractionEnd();
        }
    });
}

function showPreviousVerse() {
    if (currentVerse > 0) {
        // Remove current animation from scene
        scene.remove(currentAnimation.group);
        
        // Decrease verse index
        currentVerse--;
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Update verse content
        updateVerseContent();
        
        // Add new animation to scene
        currentAnimation = animations[currentVerse];
        scene.add(currentAnimation.group);
    }
}

function showNextVerse() {
    if (currentVerse < config.verses.length - 1) {
        // Remove current animation from scene
        scene.remove(currentAnimation.group);
        
        // Increase verse index
        currentVerse++;
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Update verse content
        updateVerseContent();
        
        // Add new animation to scene
        currentAnimation = animations[currentVerse];
        scene.add(currentAnimation.group);
    }
}

function updateNavigationButtons() {
    prevVerseBtn.disabled = currentVerse === 0;
    nextVerseBtn.disabled = currentVerse === config.verses.length - 1;
}

function updateVerseContent() {
    const verse = config.verses[currentVerse];
    
    // Update content
    verseTitle.textContent = verse.title;
    verseNumber.textContent = `Verse ${verse.number}`;
    verseText.innerHTML = verse.text;
    madhyamakaConcept.textContent = verse.madhyamakaConcept;
    quantumParallel.textContent = verse.quantumParallel;
    accessibleExplanation.textContent = verse.accessibleExplanation;
    
    // Hide explanation by default
    explanationContent.classList.add('hidden');
    explanationToggle.classList.remove('expanded');
    explanationToggle.innerHTML = '<span class="toggle-icon">+</span> Show Explanation';
    
    // Show interaction hint
    interactionHint.classList.remove('hidden');
    setTimeout(() => {
        interactionHint.classList.add('hidden');
    }, 5000);
}

