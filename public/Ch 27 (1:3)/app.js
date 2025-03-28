import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { verseData, animationSettings } from './config.js';

let currentVerseIndex = 0;
let scene, camera, renderer, controls, composer;
let currentAnimation = null;
let animationMixers = [];

// DOM elements
const togglePanelBtn = document.getElementById('toggle-panel');
const contentPanel = document.getElementById('content-panel');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const verseCounter = document.getElementById('verse-counter');
const verseNumberEl = document.getElementById('verse-number');
const verseTextEl = document.getElementById('verse-text');
const madhyamakaConceptEl = document.getElementById('madhyamaka-concept');
const quantumParallelEl = document.getElementById('quantum-parallel');
const accessibleExplanationEl = document.getElementById('accessible-explanation');
const animationButtonsContainer = document.getElementById('animation-buttons');

// Initialize the application
init();
animate();

function init() {
    initThreeJS();
    setupEventListeners();
    updateVerseContent(currentVerseIndex);
    loadAnimation(verseData[currentVerseIndex].animationType);
}

function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(animationSettings.backgroundColor);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Setup orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Post-processing
    const renderPass = new RenderPass(scene, camera);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85 // threshold
    );
    
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0015;
    
    const dotScreenPass = new ShaderPass(DotScreenShader);
    dotScreenPass.uniforms['scale'].value = 4;
    dotScreenPass.enabled = false;
    
    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(rgbShiftPass);
    composer.addPass(dotScreenPass);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function setupEventListeners() {
    togglePanelBtn.addEventListener('click', () => {
        contentPanel.classList.toggle('panel-collapsed');
        togglePanelBtn.textContent = contentPanel.classList.contains('panel-collapsed') ? 'Show Panel' : 'Hide Panel';
    });
    
    prevVerseBtn.addEventListener('click', () => {
        if (currentVerseIndex > 0) {
            currentVerseIndex--;
            updateVerseContent(currentVerseIndex);
            loadAnimation(verseData[currentVerseIndex].animationType);
            updateNavigationButtons();
        }
    });
    
    nextVerseBtn.addEventListener('click', () => {
        if (currentVerseIndex < verseData.length - 1) {
            currentVerseIndex++;
            updateVerseContent(currentVerseIndex);
            loadAnimation(verseData[currentVerseIndex].animationType);
            updateNavigationButtons();
        }
    });
}

function updateNavigationButtons() {
    prevVerseBtn.disabled = currentVerseIndex === 0;
    nextVerseBtn.disabled = currentVerseIndex === verseData.length - 1;
    verseCounter.textContent = `Verse ${currentVerseIndex + 1}/${verseData.length}`;
}

function updateVerseContent(index) {
    const verse = verseData[index];
    verseNumberEl.textContent = `Verse ${verse.verseNumber}`;
    verseTextEl.textContent = verse.verseText;
    madhyamakaConceptEl.textContent = verse.madhyamakaConcept;
    quantumParallelEl.textContent = verse.quantumParallel;
    accessibleExplanationEl.textContent = verse.accessibleExplanation;
    updateNavigationButtons();
    updateInteractionButtons(verse.animationType);
}

function loadAnimation(type) {
    // Clear existing animation
    clearAnimation();
    
    // Load new animation based on type
    switch(type) {
        case 'superposition':
            createSuperpositionAnimation();
            break;
        case 'wavefunction':
            createWaveFunctionAnimation();
            break;
        case 'indistinguishable':
            createIndistinguishableAnimation();
            break;
        case 'duality':
            createDualityAnimation();
            break;
        case 'decoherence':
            createDecoherenceAnimation();
            break;
        case 'observer':
            createObserverAnimation();
            break;
        case 'uncertainty':
            createUncertaintyAnimation();
            break;
        case 'complementarity':
            createComplementarityAnimation();
            break;
        case 'entanglement':
            createEntanglementAnimation();
            break;
        case 'nonlocality':
            createNonlocalityAnimation();
            break;
        default:
            console.warn(`Animation type "${type}" not implemented.`);
    }
}

function clearAnimation() {
    // Clear all objects except lights
    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    
    // Reset animation mixers
    animationMixers = [];
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Reset current animation
    currentAnimation = null;
}

function createSuperpositionAnimation() {
    const settings = animationSettings.superposition;
    const particles = new THREE.Group();
    
    // Create shader material for more impressive particles
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(animationSettings.particleColor) }
        },
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                vUv = uv;
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                
                float elevation = sin(modelPosition.x * 10.0 + time) * 0.1 +
                                 cos(modelPosition.z * 10.0 + time * 0.5) * 0.1;
                
                modelPosition.y += elevation;
                vElevation = elevation;
                
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                
                gl_Position = projectedPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                float intensity = 0.8 + vElevation * 2.0;
                vec3 finalColor = color * intensity;
                
                float alpha = 0.7 + sin(time * 0.5) * 0.3;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true
    });
    
    // Create particles in superposition state
    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    
    for (let i = 0; i < settings.particleCount * 2; i++) {
        const particle = new THREE.Mesh(geometry, particleMaterial.clone());
        
        // Initial position
        const theta = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 2;
        
        particle.userData = {
            baseX: radius * Math.cos(theta),
            baseY: Math.random() * 4 - 2,
            baseZ: radius * Math.sin(theta),
            phase: Math.random() * Math.PI * 2,
            frequency: 0.5 + Math.random() * 1,
            amplitude: 0.5 + Math.random() * 1,
            collapsing: false,
            collapseTarget: new THREE.Vector3(),
            materialRef: particle.material
        };
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: animationSettings.particleColor,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        particle.add(glow);
        
        particles.add(particle);
    }
    
    scene.add(particles);
    
    // Add interaction plane for clicking
    const planeGeometry = new THREE.PlaneGeometry(40, 40);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 0.0 
    });
    const interactionPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    interactionPlane.rotation.x = -Math.PI / 2;
    scene.add(interactionPlane);
    
    // Add raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObject(interactionPlane);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            
            // Collapse the wave function to this point
            particles.children.forEach(particle => {
                particle.userData.collapsing = true;
                particle.userData.collapseTarget.copy(point);
                particle.userData.collapseTarget.x += (Math.random() - 0.5) * 2;
                particle.userData.collapseTarget.y += (Math.random() - 0.5) * 2;
                particle.userData.collapseTarget.z += (Math.random() - 0.5) * 2;
                particle.userData.collapseProgress = 0;
            });
        }
    });
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update shader materials
        particles.children.forEach(particle => {
            if (particle.userData.materialRef && 
                particle.userData.materialRef.uniforms) {
                particle.userData.materialRef.uniforms.time.value = time;
            }
            
            const data = particle.userData;
            
            if (data.collapsing) {
                // Collapse animation
                data.collapseProgress += 0.01;
                if (data.collapseProgress >= 1) {
                    data.collapseProgress = 1;
                }
                
                particle.position.lerpVectors(
                    new THREE.Vector3(data.baseX, data.baseY, data.baseZ),
                    data.collapseTarget,
                    data.collapseProgress
                );
                
                // Add collapse trail effect
                if (Math.random() > 0.8) {
                    const trailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                    const trailMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.5
                    });
                    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
                    trail.position.copy(particle.position);
                    scene.add(trail);
                    
                    // Fade out and remove trail
                    setTimeout(() => {
                        scene.remove(trail);
                    }, 1000);
                }
                
            } else {
                // Superposition animation
                particle.position.x = data.baseX + Math.sin(time * 0.001 * data.frequency + data.phase) * data.amplitude;
                particle.position.y = data.baseY + Math.cos(time * 0.001 * data.frequency * 1.3 + data.phase) * data.amplitude;
                particle.position.z = data.baseZ + Math.sin(time * 0.001 * data.frequency * 0.7 + data.phase) * data.amplitude;
            }
            
            // Scale pulse
            const scale = 0.8 + Math.sin(time * 2 + data.phase) * 0.2;
            particle.scale.set(scale, scale, scale);
        });
        
        // Add ambient particles occasionally
        if (Math.random() > 0.95) {
            const ambientGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const ambientMaterial = new THREE.MeshBasicMaterial({
                color: animationSettings.particleColor,
                transparent: true,
                opacity: 0.3
            });
            const ambient = new THREE.Mesh(ambientGeometry, ambientMaterial);
            
            // Random position
            ambient.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            
            scene.add(ambient);
            
            // Random movement
            const direction = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            );
            
            // Animation and cleanup
            const animate = () => {
                ambient.position.add(direction);
                ambient.material.opacity -= 0.01;
                
                if (ambient.material.opacity <= 0) {
                    scene.remove(ambient);
                    return;
                }
                
                requestAnimationFrame(animate);
            };
            
            animate();
        }
    };
}

function createWaveFunctionAnimation() {
    const settings = animationSettings.wavefunction;
    
    // Create wave grid
    const gridSize = settings.resolution;
    const gridWidth = 20;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    
    // Create grid points
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x = (i / (gridSize - 1) - 0.5) * gridWidth;
            const z = (j / (gridSize - 1) - 0.5) * gridWidth;
            vertices.push(x, 0, z);
        }
    }
    
    // Create triangles
    for (let i = 0; i < gridSize - 1; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
            const a = i + j * gridSize;
            const b = i + 1 + j * gridSize;
            const c = i + (j + 1) * gridSize;
            const d = i + 1 + (j + 1) * gridSize;
            
            indices.push(a, b, c);
            indices.push(b, d, c);
        }
    }
    
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.3,
        wireframe: false,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    
    const waveMesh = new THREE.Mesh(geometry, material);
    scene.add(waveMesh);
    
    // Add probability particles
    const particleGroup = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.secondaryColor,
        emissive: animationSettings.secondaryColor,
        emissiveIntensity: 0.7
    });
    
    for (let i = 0; i < 50; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.userData = {
            speed: 0.02 + Math.random() * 0.03,
            angle: Math.random() * Math.PI * 2,
            radius: 2 + Math.random() * 6,
            phaseOffset: Math.random() * Math.PI * 2
        };
        particleGroup.add(particle);
    }
    
    scene.add(particleGroup);
    
    // Add control plane for interaction
    const planeGeometry = new THREE.PlaneGeometry(gridWidth, gridWidth);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 0.0 
    });
    const interactionPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    interactionPlane.rotation.x = -Math.PI / 2;
    interactionPlane.position.y = -0.1;
    scene.add(interactionPlane);
    
    // Add raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let waveSource = null;
    
    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObject(interactionPlane);
        
        if (intersects.length > 0) {
            waveSource = intersects[0].point.clone();
            waveSource.time = Date.now() * 0.001;
        }
    });
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update wave grid vertices
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const index = (i + j * gridSize) * 3;
                const x = positions[index];
                const z = positions[index + 2];
                
                let y = 0;
                
                // Natural waves
                const dist1 = Math.sqrt(x * x + z * z);
                y += Math.sin(dist1 * 2 - time * 2) * 0.1 / (1 + dist1 * 0.5);
                
                // User interaction wave
                if (waveSource) {
                    const dx = x - waveSource.x;
                    const dz = z - waveSource.z;
                    const dist2 = Math.sqrt(dx * dx + dz * dz);
                    const timeSince = time - waveSource.time;
                    const waveSpeed = 3.0;
                    const waveFront = 1.0;
                    
                    if (dist2 < waveSpeed * timeSince && dist2 > waveSpeed * timeSince - waveFront) {
                        const intensity = (1 - (waveSpeed * timeSince - dist2) / waveFront) * 1.5;
                        y += Math.exp(-dist2 * 0.2) * intensity * Math.sin(dist2 * 8 - time * 10);
                    }
                }
                
                positions[index + 1] = y;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Update probability particles
        particleGroup.children.forEach(particle => {
            const data = particle.userData;
            
            data.angle += data.speed;
            
            const x = data.radius * Math.cos(data.angle);
            const z = data.radius * Math.sin(data.angle);
            
            // Sample wave height at this position
            let y = 0;
            let waveIntensity = 0;
            
            // Calculate simplified wave height at this point
            for (let i = 0; i < 5; i++) {
                const sampleX = x + (Math.random() - 0.5) * 0.5;
                const sampleZ = z + (Math.random() - 0.5) * 0.5;
                const dist = Math.sqrt(sampleX * sampleX + sampleZ * sampleZ);
                const sample = Math.sin(dist * 2 - time * 2) * 0.1 / (1 + dist * 0.5);
                waveIntensity += Math.abs(sample);
            }
            
            waveIntensity /= 5;
            y = Math.sin(time * 3 + data.phaseOffset) * 0.2 + waveIntensity * 3;
            
            particle.position.set(x, y, z);
            particle.scale.setScalar(0.5 + waveIntensity * 5);
        });
    };
}

function createIndistinguishableAnimation() {
    const settings = animationSettings.indistinguishable;
    
    // Create container for particles
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create particles
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < settings.particleCount; i++) {
        const particle = new THREE.Mesh(geometry, material);
        
        // Random initial state
        particle.userData = {
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize().multiplyScalar(0.05 + Math.random() * 0.05),
            tracked: false
        };
        
        particle.position.copy(particle.userData.position);
        particleGroup.add(particle);
    }
    
    // Create a tracking visual
    const trackingGeometry = new THREE.RingGeometry(0.8, 1.0, 32);
    const trackingMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6b6b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    const trackingRing = new THREE.Mesh(trackingGeometry, trackingMaterial);
    trackingRing.visible = false;
    scene.add(trackingRing);
    
    // Raycaster for tracking particles
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    let trackedParticle = null;
    let trackingStartTime = 0;
    
    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(particleGroup.children);
        
        if (intersects.length > 0) {
            const newTrackedParticle = intersects[0].object;
            
            // Reset any previously tracked particles
            if (trackedParticle) {
                trackedParticle.material = material;
                trackedParticle.userData.tracked = false;
            }
            
            // Track the new particle
            trackedParticle = newTrackedParticle;
            trackedParticle.userData.tracked = true;
            
            // Custom material for tracked particle
            trackedParticle.material = new THREE.MeshStandardMaterial({
                color: 0xff6b6b,
                emissive: 0xff6b6b,
                emissiveIntensity: 0.6
            });
            
            trackingStartTime = Date.now() * 0.001;
            trackingRing.visible = true;
            
            // Reset the tracking ring to match the particle
            trackingRing.position.copy(trackedParticle.position);
            trackingRing.lookAt(camera.position);
        }
    });
    
    // Set up interaction boundaries
    const boxSize = 10;
    const boxGeometry = new THREE.BoxGeometry(boxSize * 2, boxSize * 2, boxSize * 2);
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const boundaryBox = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(boundaryBox);
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update particle positions
        particleGroup.children.forEach(particle => {
            // Update position based on velocity
            particle.userData.position.add(particle.userData.velocity);
            
            // Boundary check and bounce
            const bounds = boxSize - 0.5;
            const pos = particle.userData.position;
            const vel = particle.userData.velocity;
            
            if (Math.abs(pos.x) > bounds) {
                vel.x *= -1;
                pos.x = Math.sign(pos.x) * bounds;
            }
            
            if (Math.abs(pos.y) > bounds) {
                vel.y *= -1;
                pos.y = Math.sign(pos.y) * bounds;
            }
            
            if (Math.abs(pos.z) > bounds) {
                vel.z *= -1;
                pos.z = Math.sign(pos.z) * bounds;
            }
            
            // Apply position
            particle.position.copy(pos);
        });
        
        // Random swapping of positions to simulate indistinguishability
        if (Math.random() < 0.03) {
            const p1 = Math.floor(Math.random() * particleGroup.children.length);
            const p2 = Math.floor(Math.random() * particleGroup.children.length);
            
            if (p1 !== p2 && 
                !particleGroup.children[p1].userData.tracked && 
                !particleGroup.children[p2].userData.tracked) {
                
                // Swap positions
                const tempPos = particleGroup.children[p1].position.clone();
                particleGroup.children[p1].position.copy(particleGroup.children[p2].position);
                particleGroup.children[p2].position.copy(tempPos);
                
                // Also swap in userData
                const tempUserPos = particleGroup.children[p1].userData.position.clone();
                particleGroup.children[p1].userData.position.copy(particleGroup.children[p2].userData.position);
                particleGroup.children[p2].userData.position.copy(tempUserPos);
            }
        }
        
        // Update tracking ring
        if (trackedParticle && trackingRing.visible) {
            // Position tracking ring
            trackingRing.position.copy(trackedParticle.position);
            trackingRing.lookAt(camera.position);
            
            // Fade out tracking after some time
            const trackingDuration = 5; // seconds
            const elapsedTime = time - trackingStartTime;
            
            if (elapsedTime > trackingDuration) {
                // Reset tracking
                trackedParticle.material = material;
                trackedParticle.userData.tracked = false;
                trackedParticle = null;
                trackingRing.visible = false;
            } else if (elapsedTime > trackingDuration - 1) {
                // Fade out in the last second
                const fadeOpacity = 1 - (elapsedTime - (trackingDuration - 1));
                trackingMaterial.opacity = fadeOpacity * 0.7;
            }
        }
    };
}

function createDualityAnimation() {
    const settings = animationSettings.duality;
    
    // Create wave and particle representations
    const waveGroup = new THREE.Group();
    const particleGroup = new THREE.Group();
    scene.add(waveGroup);
    scene.add(particleGroup);
    
    // Wave representation
    const waveWidth = 20;
    const waveDensity = settings.waveDensity;
    const waveGeometry = new THREE.BufferGeometry();
    const waveVertices = [];
    const waveIndices = [];
    
    // Create wave grid
    for (let i = 0; i < waveDensity; i++) {
        for (let j = 0; j < waveDensity; j++) {
            const x = (i / (waveDensity - 1) - 0.5) * waveWidth;
            const z = (j / (waveDensity - 1) - 0.5) * waveWidth;
            waveVertices.push(x, 0, z);
        }
    }
    
    // Create wave triangles
    for (let i = 0; i < waveDensity - 1; i++) {
        for (let j = 0; j < waveDensity - 1; j++) {
            const a = i + j * waveDensity;
            const b = i + 1 + j * waveDensity;
            const c = i + (j + 1) * waveDensity;
            const d = i + 1 + (j + 1) * waveDensity;
            
            waveIndices.push(a, b, c);
            waveIndices.push(b, d, c);
        }
    }
    
    waveGeometry.setIndex(waveIndices);
    waveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(waveVertices, 3));
    waveGeometry.computeVertexNormals();
    
    const waveMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveGroup.add(waveMesh);
    
    // Particle representation
    const particleCount = settings.particleCount;
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.secondaryColor,
        emissive: animationSettings.secondaryColor,
        emissiveIntensity: 0.6
    });
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Set initial positions in a wave-like pattern
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3 + Math.sin(angle * 3) * 2;
        
        particle.position.x = radius * Math.cos(angle);
        particle.position.z = radius * Math.sin(angle);
        particle.position.y = Math.random() * 0.2;
        
        particle.userData = {
            angle: angle,
            radius: radius,
            speed: 0.005 + Math.random() * 0.005,
            phase: Math.random() * Math.PI * 2
        };
        
        particleGroup.add(particle);
    }
    
    // Add a central "detector" sphere
    const detectorGeometry = new THREE.SphereGeometry(1, 32, 32);
    const detectorMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
    });
    
    const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector.position.y = 0.5;
    scene.add(detector);
    
    // State variables for animation
    let viewState = 0; // 0 = wave, 1 = particle, 0.5 = transitioning
    let targetViewState = 0;
    let lastMeasurementTime = -10;
    
    // Add interaction handler
    renderer.domElement.addEventListener('click', () => {
        // Toggle the target state
        targetViewState = 1 - targetViewState;
        lastMeasurementTime = Date.now() * 0.001;
        
        // Detector animation
        detector.scale.set(2, 2, 2);
        detectorMaterial.opacity = 0.9;
    });
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update view state transition
        if (viewState !== targetViewState) {
            const transitionSpeed = 0.02;
            if (viewState < targetViewState) {
                viewState = Math.min(viewState + transitionSpeed, targetViewState);
            } else {
                viewState = Math.max(viewState - transitionSpeed, targetViewState);
            }
        }
        
        // Update wave vertices
        if (viewState < 1) {
            const positions = waveGeometry.attributes.position.array;
            
            for (let i = 0; i < waveDensity; i++) {
                for (let j = 0; j < waveDensity; j++) {
                    const index = (i + j * waveDensity) * 3;
                    const x = positions[index];
                    const z = positions[index + 2];
                    
                    const dist = Math.sqrt(x * x + z * z);
                    let y = Math.sin(dist * 2 - time * 2) * 0.5 / (1 + dist * 0.5);
                    
                    // Measurement effect
                    const timeSinceLastMeasurement = time - lastMeasurementTime;
                    if (timeSinceLastMeasurement < 2) {
                        const measurementProgress = Math.min(timeSinceLastMeasurement, 1);
                        const waveCollapse = Math.exp(-dist * measurementProgress * 0.5) * 
                                           Math.sin(dist * 10 - time * 10) * 
                                           measurementProgress;
                        y += waveCollapse * 0.5;
                    }
                    
                    positions[index + 1] = y * (1 - viewState);
                }
            }
            
            waveGeometry.attributes.position.needsUpdate = true;
            waveGeometry.computeVertexNormals();
        }
        
        // Update wave mesh visibility
        waveMesh.material.opacity = 0.7 * (1 - viewState);
        waveMesh.visible = viewState < 0.99;
        
        // Update particles
        particleGroup.children.forEach(particle => {
            const data = particle.userData;
            
            // In wave state, particles follow wave pattern
            if (viewState < 0.1) {
                data.angle += data.speed;
                particle.position.x = data.radius * Math.cos(data.angle);
                particle.position.z = data.radius * Math.sin(data.angle);
                particle.position.y = 0.2 + Math.sin(time * 2 + data.phase) * 0.3;
                particle.scale.setScalar(0.5 + Math.sin(time + data.phase) * 0.2);
            } 
            // In transition state, particles move to new positions
            else if (viewState < 0.9) {
                const progress = viewState * (1 + Math.sin(data.phase) * 0.3);
                
                // Wave position
                const waveX = data.radius * Math.cos(data.angle + time * data.speed * 10);
                const waveZ = data.radius * Math.sin(data.angle + time * data.speed * 10);
                const waveY = 0.2 + Math.sin(time * 2 + data.phase) * 0.3;
                
                // Particle position (more chaotic)
                const r = 5 + Math.sin(data.phase * 10) * 3;
                const particleX = r * Math.cos(data.phase * 10 + time * data.speed * 2);
                const particleZ = r * Math.sin(data.phase * 5 + time * data.speed * 2);
                const particleY = 1 + Math.sin(time * data.speed * 5 + data.phase) * 2;
                
                // Blend between the two
                particle.position.x = waveX * (1 - progress) + particleX * progress;
                particle.position.z = waveZ * (1 - progress) + particleZ * progress;
                particle.position.y = waveY * (1 - progress) + particleY * progress;
                
                // Scale based on transition
                particle.scale.setScalar(0.5 + progress);
            }
            // In particle state, particles move more chaotically
            else {
                const r = 5 + Math.sin(data.phase * 10) * 3;
                particle.position.x = r * Math.cos(data.phase * 10 + time * data.speed * 2);
                particle.position.z = r * Math.sin(data.phase * 5 + time * data.speed * 2);
                particle.position.y = 1 + Math.sin(time * data.speed * 5 + data.phase) * 2;
                particle.scale.setScalar(1.5);
            }
        });
        
        // Update detector animation
        if (detector.scale.x > 1) {
            detector.scale.x = Math.max(1, detector.scale.x - 0.05);
            detector.scale.y = Math.max(1, detector.scale.y - 0.05);
            detector.scale.z = Math.max(1, detector.scale.z - 0.05);
        }
        
        if (detectorMaterial.opacity > 0.3) {
            detectorMaterial.opacity = Math.max(0.3, detectorMaterial.opacity - 0.03);
        }
    };
}

function createDecoherenceAnimation() {
    const settings = animationSettings.decoherence;
    
    // Create a coherent quantum system
    const particleSystem = new THREE.Group();
    scene.add(particleSystem);
    
    // Create particles in a coherent state
    const particleCount = settings.initialParticles;
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.5
    });
    
    // Create coherent structure - double helix
    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 4;
        const radius = 5;
        
        const particle = new THREE.Mesh(geometry, material.clone());
        
        // Position on a double helix
        particle.position.x = radius * Math.cos(t);
        particle.position.z = radius * Math.sin(t);
        particle.position.y = (t - Math.PI * 2) * 0.5;
        
        particle.userData = {
            originalPosition: particle.position.clone(),
            phase: Math.random() * Math.PI * 2,
            frequency: 0.5 + Math.random() * 1,
            coherent: true,
            decoherenceStart: null,
            decoherenceProgress: 0,
            finalPosition: new THREE.Vector3(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            )
        };
        
        particleSystem.add(particle);
    }
    
    // Create environment particles (causing decoherence)
    const envGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const envMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7
    });
    
    const environmentParticles = new THREE.Group();
    scene.add(environmentParticles);
    
    // Create environment particles
    for (let i = 0; i < 100; i++) {
        const particle = new THREE.Mesh(envGeometry, envMaterial);
        
        // Random position outside the coherent system
        const radius = 10 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.cos(phi);
        particle.position.z = radius * Math.sin(phi) * Math.sin(theta);
        
        particle.userData = {
            speed: 0.02 + Math.random() * 0.03,
            direction: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize()
        };
        
        environmentParticles.add(particle);
    }
    
    // Add a visual representation of coherence
    const coherenceGeometry = new THREE.TorusGeometry(5, 0.1, 16, 100);
    const coherenceMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5
    });
    
    const coherenceRing = new THREE.Mesh(coherenceGeometry, coherenceMaterial);
    coherenceRing.rotation.x = Math.PI / 2;
    scene.add(coherenceRing);
    
    // Add second ring for visual effect
    const coherenceRing2 = coherenceRing.clone();
    coherenceRing2.rotation.x = 0;
    coherenceRing2.rotation.y = Math.PI / 2;
    scene.add(coherenceRing2);
    
    // Add raycaster for interaction
    let isDecoherencing = false;
    let decoherenceTime = 0;
    
    renderer.domElement.addEventListener('click', () => {
        if (!isDecoherencing) {
            isDecoherencing = true;
            decoherenceTime = Date.now() * 0.001;
            
            // Mark all coherent particles for decoherence
            particleSystem.children.forEach(particle => {
                if (particle.userData.coherent) {
                    particle.userData.decoherenceStart = decoherenceTime;
                }
            });
        } else {
            // Reset system on second click
            isDecoherencing = false;
            
            particleSystem.children.forEach(particle => {
                particle.position.copy(particle.userData.originalPosition);
                particle.userData.coherent = true;
                particle.userData.decoherenceStart = null;
                particle.userData.decoherenceProgress = 0;
                particle.material.opacity = 1.0;
                
                // Generate a new random final position
                particle.userData.finalPosition.set(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15
                );
            });
            
            // Reset coherence rings
            coherenceRing.material.opacity = 0.5;
            coherenceRing2.material.opacity = 0.5;
        }
    });
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update coherent particles
        particleSystem.children.forEach(particle => {
            const data = particle.userData;
            
            if (data.coherent) {
                // Coherent motion - small oscillations around original position
                const oscillation = 0.1;
                particle.position.x = data.originalPosition.x + Math.sin(time * data.frequency + data.phase) * oscillation;
                particle.position.y = data.originalPosition.y + Math.cos(time * data.frequency * 1.3 + data.phase) * oscillation;
                particle.position.z = data.originalPosition.z + Math.sin(time * data.frequency * 0.7 + data.phase) * oscillation;
            } 
            else if (data.decoherenceProgress < 1) {
                // Transitioning to decoherent state
                data.decoherenceProgress += 0.01;
                
                // Interpolate between original and final positions
                particle.position.lerpVectors(
                    data.originalPosition,
                    data.finalPosition,
                    data.decoherenceProgress
                );
                
                // Fade out slightly
                particle.material.opacity = 1.0 - data.decoherenceProgress * 0.3;
            }
            else {
                // Random motion in decoherent state
                particle.position.x += (Math.random() - 0.5) * 0.05;
                particle.position.y += (Math.random() - 0.5) * 0.05;
                particle.position.z += (Math.random() - 0.5) * 0.05;
                
                // Keep within bounds
                if (particle.position.length() > 15) {
                    particle.position.normalize().multiplyScalar(15);
                }
            }
        });
        
        // Check for environment particles causing decoherence
        if (!isDecoherencing) {
            environmentParticles.children.forEach(envParticle => {
                const data = envParticle.userData;
                
                // Move toward the coherent system
                envParticle.position.add(
                    data.direction.clone().multiplyScalar(data.speed)
                );
                
                // Check for collision with the system
                if (envParticle.position.length() < 6) {
                    // Cause decoherence to nearby particles
                    particleSystem.children.forEach(particle => {
                        if (particle.userData.coherent && 
                            particle.position.distanceTo(envParticle.position) < 1) {
                            
                            particle.userData.coherent = false;
                            particle.userData.decoherenceStart = time;
                        }
                    });
                    
                    // Reset environment particle
                    const radius = 15;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    
                    envParticle.position.x = radius * Math.sin(phi) * Math.cos(theta);
                    envParticle.position.y = radius * Math.cos(phi);
                    envParticle.position.z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    // New direction toward center
                    envParticle.userData.direction = envParticle.position.clone().negate().normalize();
                }
            });
        }
        
        // Update coherence rings during decoherence
        if (isDecoherencing) {
            const decohereProgress = Math.min(1, (time - decoherenceTime) * 0.2);
            
            coherenceRing.material.opacity = 0.5 * (1 - decohereProgress);
            coherenceRing2.material.opacity = 0.5 * (1 - decohereProgress);
            
            coherenceRing.scale.set(1 + decohereProgress, 1 + decohereProgress, 1 + decohereProgress);
            coherenceRing2.scale.set(1 + decohereProgress, 1 + decohereProgress, 1 + decohereProgress);
            
            // Count how many particles are still coherent
            let coherentCount = 0;
            particleSystem.children.forEach(particle => {
                if (particle.userData.coherent) {
                    coherentCount++;
                }
            });
            
            // If all particles have decohered, reset the rings
            if (coherentCount === 0) {
                coherenceRing.visible = false;
                coherenceRing2.visible = false;
            }
        } else {
            // Reset rings during coherent state
            coherenceRing.material.opacity = 0.5;
            coherenceRing2.material.opacity = 0.5;
            coherenceRing.scale.set(1, 1, 1);
            coherenceRing2.scale.set(1, 1, 1);
            coherenceRing.visible = true;
            coherenceRing2.visible = true;
            
            // Rotate the rings slowly
            coherenceRing.rotation.z += 0.003;
            coherenceRing2.rotation.z += 0.002;
        }
    };
}

function createObserverAnimation() {
    const settings = animationSettings.observer;
    
    // Create quantum system
    const particleSystem = new THREE.Group();
    scene.add(particleSystem);
    
    // Create particles
    const particleCount = settings.particleCount;
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.5
    });
    
    // Create particles in a quantum field-like pattern
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(geometry, material.clone());
        
        // Initial position in a field-like pattern
        const r = 10 * Math.sqrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        
        particle.position.x = r * Math.cos(theta);
        particle.position.z = r * Math.sin(theta);
        particle.position.y = (Math.random() - 0.5) * 4;
        
        particle.userData = {
            originalPosition: particle.position.clone(),
            phase: Math.random() * Math.PI * 2,
            frequency: 0.5 + Math.random() * 1,
            observed: false,
            observedPosition: new THREE.Vector3()
        };
        
        particleSystem.add(particle);
    }
    
    // Create observer
    const observerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const observerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.7
    });
    
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    scene.add(observer);
    
    // Create observation visualization
    const observationGeometry = new THREE.RingGeometry(0, 5, 32);
    const observationMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
    });
    
    const observationRing = new THREE.Mesh(observationGeometry, observationMaterial);
    observationRing.rotation.x = Math.PI / 2;
    scene.add(observationRing);
    
    // Setup raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    const planeIntersection = new THREE.Vector3();
    
    // Track observer position and observation state
    const observerPosition = new THREE.Vector3();
    let isObserving = false;
    let observationStartTime = 0;
    
    renderer.domElement.addEventListener('mousemove', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Cast ray to get intersection with ground plane
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, planeIntersection);
        
        // Limit observer movement to a reasonable range
        if (planeIntersection.length() < 15) {
            observerPosition.copy(planeIntersection);
            observerPosition.y = 0;
        }
    });
    
    renderer.domElement.addEventListener('click', () => {
        isObserving = true;
        observationStartTime = Date.now() * 0.001;
        
        // Record observation positions for particles
        particleSystem.children.forEach(particle => {
            if (!particle.userData.observed && 
                particle.position.distanceTo(observerPosition) < settings.observationRadius) {
                
                particle.userData.observed = true;
                particle.userData.observedPosition.copy(particle.position);
                
                // Set particle material to observed state
                particle.material = new THREE.MeshStandardMaterial({
                    color: 0xff6b6b,
                    emissive: 0xff6b6b,
                    emissiveIntensity: 0.5
                });
            }
        });
        
        // Position observation ring
        observationRing.position.copy(observerPosition);
        observationMaterial.opacity = 0.7;
    });
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update observer position
        observer.position.lerp(observerPosition, 0.1);
        
        // Update particles
        particleSystem.children.forEach(particle => {
            const data = particle.userData;
            
            if (!data.observed) {
                // Quantum behavior - wave-like motion
                const t = time * 0.5;
                
                // Start from original position and add wave motion
                particle.position.x = data.originalPosition.x + Math.sin(t + data.phase) * 0.3;
                particle.position.y = data.originalPosition.y + Math.cos(t * 1.3 + data.phase) * 0.3;
                particle.position.z = data.originalPosition.z + Math.sin(t * 0.7 + data.phase * 2) * 0.3;
                
                // Scale pulse
                const scale = 0.8 + Math.sin(t * 2 + data.phase) * 0.2;
                particle.scale.set(scale, scale, scale);
                
                // Check if being observed now
                if (isObserving && 
                    particle.position.distanceTo(observer.position) < settings.observationRadius) {
                    
                    data.observed = true;
                    data.observedPosition.copy(particle.position);
                    
                    // Set particle material to observed state
                    particle.material = new THREE.MeshStandardMaterial({
                        color: 0xff6b6b,
                        emissive: 0xff6b6b,
                        emissiveIntensity: 0.5
                    });
                }
            } else {
                // Observed behavior - fixed position with small jitter
                const jitter = 0.03;
                particle.position.x = data.observedPosition.x + (Math.random() - 0.5) * jitter;
                particle.position.y = data.observedPosition.y + (Math.random() - 0.5) * jitter;
                particle.position.z = data.observedPosition.z + (Math.random() - 0.5) * jitter;
                
                // Fixed scale
                particle.scale.set(1, 1, 1);
            }
        });
        
        // Update observation ring
        if (isObserving) {
            const timeSinceObservation = time - observationStartTime;
            
            if (timeSinceObservation < 1) {
                // Expand the ring
                const scale = 1 + timeSinceObservation * 3;
                observationRing.scale.set(scale, scale, scale);
                observationMaterial.opacity = 0.7 * (1 - timeSinceObservation);
            } else {
                // End observation
                isObserving = false;
                observationMaterial.opacity = 0;
            }
        }
    };
}

function createUncertaintyAnimation() {
    const settings = animationSettings.uncertainty;
    
    // Setup coordinate system
    const axisLength = 10;
    const axisGroup = new THREE.Group();
    scene.add(axisGroup);
    
    // X-axis (position)
    const xAxisGeometry = new THREE.BufferGeometry();
    const xAxisPoints = [new THREE.Vector3(-axisLength, 0, 0), new THREE.Vector3(axisLength, 0, 0)];
    xAxisGeometry.setFromPoints(xAxisPoints);
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    axisGroup.add(xAxis);
    
    // X-axis label
    const xLabel = createTextSprite("Position", { fontsize: 24, color: 0xffffff });
    xLabel.position.set(axisLength + 1, 0, 0);
    axisGroup.add(xLabel);
    
    // Z-axis (momentum)
    const zAxisGeometry = new THREE.BufferGeometry();
    const zAxisPoints = [new THREE.Vector3(0, 0, -axisLength), new THREE.Vector3(0, 0, axisLength)];
    zAxisGeometry.setFromPoints(zAxisPoints);
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
    axisGroup.add(zAxis);
    
    // Z-axis label
    const zLabel = createTextSprite("Momentum", { fontsize: 24, color: 0xffffff });
    zLabel.position.set(0, 0, axisLength + 1);
    axisGroup.add(zLabel);
    
    // Uncertainty areas
    const uncertaintyGroup = new THREE.Group();
    scene.add(uncertaintyGroup);
    
    // Position certainty (vertical band)
    const positionCertaintyGeometry = new THREE.PlaneGeometry(2, axisLength * 2);
    const positionCertaintyMaterial = new THREE.MeshBasicMaterial({
        color: animationSettings.particleColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const positionCertainty = new THREE.Mesh(positionCertaintyGeometry, positionCertaintyMaterial);
    positionCertainty.rotation.y = Math.PI / 2;
    uncertaintyGroup.add(positionCertainty);
    
    // Momentum certainty (horizontal band)
    const momentumCertaintyGeometry = new THREE.PlaneGeometry(axisLength * 2, 2);
    const momentumCertaintyMaterial = new THREE.MeshBasicMaterial({
        color: animationSettings.secondaryColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const momentumCertainty = new THREE.Mesh(momentumCertaintyGeometry, momentumCertaintyMaterial);
    uncertaintyGroup.add(momentumCertainty);
    
    // Overall uncertainty area
    const gridSize = 100;
    const gridGeometry = new THREE.PlaneGeometry(axisLength * 2, axisLength * 2, gridSize, gridSize);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    uncertaintyGroup.add(gridMesh);
    
    // Particle visualization
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particleGroup.add(particle);
    
    // Uncertainty visualization
    const uncertaintyCloud = new THREE.Group();
    scene.add(uncertaintyCloud);
    
    const cloudPointCount = 300;
    const cloudGeometry = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudPointCount * 3);
    const cloudSizes = new Float32Array(cloudPointCount);
    
    for (let i = 0; i < cloudPointCount; i++) {
        cloudSizes[i] = 0.1 + Math.random() * 0.1;
    }
    
    cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1));
    
    const cloudMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true
    });
    
    const pointCloud = new THREE.Points(cloudGeometry, cloudMaterial);
    uncertaintyCloud.add(pointCloud);
    
    // Measurement indicators
    const positionMeasureGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const positionMeasureMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.5
    });
    const positionMeasure = new THREE.Mesh(positionMeasureGeometry, positionMeasureMaterial);
    positionMeasure.visible = false;
    scene.add(positionMeasure);
    
    const momentumMeasureGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const momentumMeasureMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.secondaryColor,
        emissive: animationSettings.secondaryColor,
        emissiveIntensity: 0.5
    });
    const momentumMeasure = new THREE.Mesh(momentumMeasureGeometry, momentumMeasureMaterial);
    momentumMeasure.visible = false;
    scene.add(momentumMeasure);
    
    // Control state
    let positionUncertainty = 1.0;
    let momentumUncertainty = 1.0;
    let needsUpdate = true;
    
    // Target values for smooth transition
    let targetPositionUncertainty = 1.0;
    let targetMomentumUncertainty = 1.0;
    
    // Setup interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    let selectedAxis = null;
    let measuringPosition = false;
    let measuringMomentum = false;
    
    renderer.domElement.addEventListener('mousedown', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersection with axes
        const intersectsX = raycaster.intersectObject(xAxis);
        const intersectsZ = raycaster.intersectObject(zAxis);
        
        if (intersectsX.length > 0) {
            selectedAxis = 'x';
        } else if (intersectsZ.length > 0) {
            selectedAxis = 'z';
        } else {
            // Click elsewhere to measure
            if (Math.abs(mouse.x) > Math.abs(mouse.y)) {
                // Position measurement
                measuringPosition = true;
                targetPositionUncertainty = 0.2;
                targetMomentumUncertainty = 5.0;
            } else {
                // Momentum measurement
                measuringMomentum = true;
                targetMomentumUncertainty = 0.2;
                targetPositionUncertainty = 5.0;
            }
        }
    });
    
    renderer.domElement.addEventListener('mousemove', (event) => {
        if (selectedAxis) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            if (selectedAxis === 'x') {
                // Adjust position uncertainty
                const value = (mouse.x + 1) / 2; // 0 to 1
                targetPositionUncertainty = 0.2 + value * 5;
                targetMomentumUncertainty = 1.0 / targetPositionUncertainty;
            } else if (selectedAxis === 'z') {
                // Adjust momentum uncertainty
                const value = (mouse.y + 1) / 2; // 0 to 1
                targetMomentumUncertainty = 0.2 + value * 5;
                targetPositionUncertainty = 1.0 / targetMomentumUncertainty;
            }
            
            needsUpdate = true;
        }
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        selectedAxis = null;
    });
    
    // Create text sprite helper function
    function createTextSprite(text, parameters) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold " + (parameters.fontsize || 18) + "px Arial";
        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.textAlign = "center";
        context.fillText(text, 128, 50);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);
        
        return sprite;
    }
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Smooth transition of uncertainty values
        if (Math.abs(positionUncertainty - targetPositionUncertainty) > 0.01) {
            positionUncertainty += (targetPositionUncertainty - positionUncertainty) * 0.1;
            needsUpdate = true;
        }
        
        if (Math.abs(momentumUncertainty - targetMomentumUncertainty) > 0.01) {
            momentumUncertainty += (targetMomentumUncertainty - momentumUncertainty) * 0.1;
            needsUpdate = true;
        }
        
        // Update visualization if needed
        if (needsUpdate) {
            // Update uncertainty bands
            positionCertainty.scale.set(positionUncertainty, 1, 1);
            momentumCertainty.scale.set(1, momentumUncertainty, 1);
            
            // Update particle position (more certain = more localized)
            const positionSpread = 5 / positionUncertainty;
            const momentumSpread = 5 / momentumUncertainty;
            
            particle.position.x = (Math.random() - 0.5) * positionSpread;
            particle.position.z = (Math.random() - 0.5) * momentumSpread;
            
            // Update uncertainty cloud
            const positions = cloudGeometry.attributes.position.array;
            
            for (let i = 0; i < cloudPointCount; i++) {
                const i3 = i * 3;
                
                // Gaussian distribution for position and momentum
                const theta = Math.random() * Math.PI * 2;
                const r1 = Math.sqrt(-2 * Math.log(Math.random())) * positionSpread * 0.4;
                const r2 = Math.sqrt(-2 * Math.log(Math.random())) * momentumSpread * 0.4;
                
                positions[i3] = Math.cos(theta) * r1;
                positions[i3 + 1] = (Math.random() - 0.5) * 0.5; // Small y variation
                positions[i3 + 2] = Math.sin(theta) * r2;
            }
            
            cloudGeometry.attributes.position.needsUpdate = true;
            
            // Update cloud opacity based on certainty
            const totalUncertainty = positionUncertainty * momentumUncertainty;
            cloudMaterial.opacity = 0.2 + 0.3 * (1 / totalUncertainty);
            
            needsUpdate = false;
        }
        
        // Handle measurements
        if (measuringPosition) {
            // Perform position measurement
            positionMeasure.position.x = particle.position.x;
            positionMeasure.position.y = particle.position.y;
            positionMeasure.position.z = 0;
            positionMeasure.visible = true;
            
            // Reset measurement after delay
            setTimeout(() => {
                measuringPosition = false;
                setTimeout(() => {
                    positionMeasure.visible = false;
                    // Return to balanced state
                    targetPositionUncertainty = 1.0;
                    targetMomentumUncertainty = 1.0;
                }, 1000);
            }, 2000);
        }
        
        if (measuringMomentum) {
            // Perform momentum measurement
            momentumMeasure.position.x = 0;
            momentumMeasure.position.y = particle.position.y;
            momentumMeasure.position.z = particle.position.z;
            momentumMeasure.visible = true;
            
            // Reset measurement after delay
            setTimeout(() => {
                measuringMomentum = false;
                setTimeout(() => {
                    momentumMeasure.visible = false;
                    // Return to balanced state
                    targetPositionUncertainty = 1.0;
                    targetMomentumUncertainty = 1.0;
                }, 1000);
            }, 2000);
        }
        
        // Rotate slowly for better visualization
        axisGroup.rotation.y = Math.sin(time * 0.2) * 0.1;
        uncertaintyGroup.rotation.y = axisGroup.rotation.y;
        particleGroup.rotation.y = axisGroup.rotation.y;
        uncertaintyCloud.rotation.y = axisGroup.rotation.y;
    };
}

function createComplementarityAnimation() {
    const settings = animationSettings.complementarity;
    
    // Create container for the dual-nature visualization
    const dualityGroup = new THREE.Group();
    scene.add(dualityGroup);
    
    // Create wave representation
    const waveMeshGroup = new THREE.Group();
    dualityGroup.add(waveMeshGroup);
    
    const waveWidth = 20;
    const waveResolution = settings.resolution;
    const waveGeometry = new THREE.BufferGeometry();
    const waveVertices = [];
    const waveIndices = [];
    
    // Create wave grid
    for (let i = 0; i < waveResolution; i++) {
        for (let j = 0; j < waveResolution; j++) {
            const x = (i / (waveResolution - 1) - 0.5) * waveWidth;
            const z = (j / (waveResolution - 1) - 0.5) * waveWidth;
            waveVertices.push(x, 0, z);
        }
    }
    
    // Create wave triangles
    for (let i = 0; i < waveResolution - 1; i++) {
        for (let j = 0; j < waveResolution - 1; j++) {
            const a = i + j * waveResolution;
            const b = i + 1 + j * waveResolution;
            const c = i + (j + 1) * waveResolution;
            const d = i + 1 + (j + 1) * waveResolution;
            
            waveIndices.push(a, b, c);
            waveIndices.push(b, d, c);
        }
    }
    
    waveGeometry.setIndex(waveIndices);
    waveGeometry.setAttribute('position', new THREE.Float32BufferAttribute(waveVertices, 3));
    waveGeometry.computeVertexNormals();
    
    const waveMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMeshGroup.add(waveMesh);
    
    // Create particle representation
    const particleGroup = new THREE.Group();
    dualityGroup.add(particleGroup);
    
    const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: animationSettings.secondaryColor,
        emissive: animationSettings.secondaryColor,
        emissiveIntensity: 0.5
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particleGroup.add(particle);
    
    // Create observer/measurement apparatus visualization
    const observerGroup = new THREE.Group();
    scene.add(observerGroup);
    
    // Create a detector screen for wave pattern
    const screenWidth = 10;
    const screenHeight = 5;
    const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = -8;
    screen.position.y = screenHeight / 2;
    observerGroup.add(screen);
    
    // Create wave pattern on screen
    const patternWidth = 100;
    const patternHeight = 50;
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternWidth;
    patternCanvas.height = patternHeight;
    const patternContext = patternCanvas.getContext('2d');
    
    // Initial pattern will be updated in animation
    const patternTexture = new THREE.CanvasTexture(patternCanvas);
    const patternGeometry = new THREE.PlaneGeometry(screenWidth - 0.2, screenHeight - 0.2);
    const patternMaterial = new THREE.MeshBasicMaterial({
        map: patternTexture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    
    const patternPlane = new THREE.Mesh(patternGeometry, patternMaterial);
    patternPlane.position.z = -7.9;
    patternPlane.position.y = screenHeight / 2;
    observerGroup.add(patternPlane);
    
    // Create a detector for particle hits
    const detectorGeometry = new THREE.BoxGeometry(1, 1, 0.2);
    const detectorMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        emissive: 0x222222,
        emissiveIntensity: 0.3
    });
    
    const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector.position.z = -8;
    detector.position.y = 1;
    detectorMaterial.transparent = true;
    observerGroup.add(detector);
    
    // Create visualization for particle detection
    const hitGeometry = new THREE.CircleGeometry(0.2, 16);
    const hitMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0
    });
    
    const hitIndicator = new THREE.Mesh(hitGeometry, hitMaterial);
    hitIndicator.position.z = -7.8;
    hitIndicator.position.y = 1;
    observerGroup.add(hitIndicator);
    
    // Add a switch to toggle between wave and particle observation
    const switchBaseGeometry = new THREE.BoxGeometry(3, 1, 1);
    const switchBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        emissive: 0x111111,
        emissiveIntensity: 0.3
    });
    
    const switchBase = new THREE.Mesh(switchBaseGeometry, switchBaseMaterial);
    switchBase.position.set(8, 1, 0);
    scene.add(switchBase);
    
    const switchLeverGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
    const switchLeverMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        emissive: 0x333333,
        emissiveIntensity: 0.3
    });
    
    const switchLever = new THREE.Mesh(switchLeverGeometry, switchLeverMaterial);
    switchLever.position.set(8, 1.5, 0);
    scene.add(switchLever);
    
    // Labels for switch positions
    const waveLabel = createTextSprite("Wave", { fontsize: 14, color: 0xffffff });
    waveLabel.position.set(7, 2.5, 0);
    scene.add(waveLabel);
    
    const particleLabel = createTextSprite("Particle", { fontsize: 14, color: 0xffffff });
    particleLabel.position.set(9, 2.5, 0);
    scene.add(particleLabel);
    
    // State variables
    let observationMode = "wave"; // or "particle"
    let switchPosition = -0.7; // -1 for wave, 1 for particle
    let isAnimatingSwitch = false;
    let hitDetected = false;
    let hitTime = 0;
    
    // Interaction handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersection with switch
        const intersects = raycaster.intersectObjects([switchBase, switchLever]);
        
        if (intersects.length > 0 && !isAnimatingSwitch) {
            isAnimatingSwitch = true;
            
            // Toggle mode
            if (observationMode === "wave") {
                observationMode = "particle";
                // Start animation of switch to particle position
            } else {
                observationMode = "wave";
                // Start animation of switch to wave position
            }
        }
    });
    
    // Helper function to create text sprites
    function createTextSprite(text, parameters) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold " + (parameters.fontsize || 18) + "px Arial";
        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.textAlign = "center";
        context.fillText(text, 128, 50);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 1, 1);
        
        return sprite;
    }
    
    // Helper function to update wave pattern on screen
    function updateWavePattern(time) {
        patternContext.clearRect(0, 0, patternWidth, patternHeight);
        patternContext.fillStyle = 'black';
        patternContext.fillRect(0, 0, patternWidth, patternHeight);
        
        // Draw interference pattern
        patternContext.fillStyle = 'rgba(100, 100, 255, 0.7)';
        
        for (let x = 0; x < patternWidth; x++) {
            const normalizedX = (x / patternWidth) * 2 - 1;
            
            // Calculate intensity using double-slit pattern equation
            const intensity = Math.pow(Math.cos(normalizedX * 15 + time * 2), 2) * patternHeight * 0.4;
            
            // Draw as a vertical line at this x position
            for (let y = 0; y < intensity; y++) {
                const centerY = patternHeight / 2;
                patternContext.fillRect(x, centerY - y/2, 1, 1);
                patternContext.fillRect(x, centerY + y/2, 1, 1);
            }
        }
        
        patternTexture.needsUpdate = true;
    }
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Animate switch position
        if (observationMode === "wave" && switchPosition > -0.7) {
            switchPosition -= 0.05;
            if (switchPosition <= -0.7) {
                switchPosition = -0.7;
                isAnimatingSwitch = false;
            }
        } else if (observationMode === "particle" && switchPosition < 0.7) {
            switchPosition += 0.05;
            if (switchPosition >= 0.7) {
                switchPosition = 0.7;
                isAnimatingSwitch = false;
            }
        }
        
        // Update switch lever position
        switchLever.position.x = 8 + switchPosition;
        
        // Update wave visualization
        if (observationMode === "wave" || isAnimatingSwitch) {
            // Update wave grid
            const positions = waveGeometry.attributes.position.array;
            
            for (let i = 0; i < waveResolution; i++) {
                for (let j = 0; j < waveResolution; j++) {
                    const index = (i + j * waveResolution) * 3;
                    const x = positions[index];
                    const z = positions[index + 2];
                    
                    const dist = Math.sqrt(x * x + z * z);
                    let y = Math.sin(dist * 3 - time * 3) * 0.5 / (1 + dist * 0.5);
                    
                    positions[index + 1] = y * settings.waveAmplitude;
                }
            }
            
            waveGeometry.attributes.position.needsUpdate = true;
            waveGeometry.computeVertexNormals();
            
            // Update wave pattern on screen
            updateWavePattern(time);
            
            // Set wave visibility
            waveMeshGroup.visible = true;
            
            // Update particle visibility based on mode
            const blendFactor = (1 + switchPosition) / 2; // 0 for wave, 1 for particle
            particleGroup.visible = blendFactor > 0.3;
            particle.material.opacity = blendFactor;
            
            // Update detector visibility
            detector.visible = false;
        }
        
        if (observationMode === "particle" || isAnimatingSwitch) {
            // Update particle position
            particle.position.x = Math.sin(time * 1.5) * 3;
            particle.position.z = Math.cos(time * 2) * 3;
            particle.position.y = Math.sin(time) * 0.5 + 0.5;
            
            // Update detector position to try to catch particle
            detector.position.x = particle.position.x * 0.8 + (Math.random() - 0.5) * 0.5;
            detector.position.y = particle.position.y;
            
            // Check for particle hitting detector
            if (!hitDetected && 
                Math.abs(particle.position.x - detector.position.x) < 0.7 &&
                Math.abs(particle.position.z - detector.position.z) < 9) {
                
                hitDetected = true;
                hitTime = time;
                
                // Position hit indicator at detector
                hitIndicator.position.x = detector.position.x;
                hitIndicator.position.y = detector.position.y;
                hitMaterial.opacity = 1.0;
            }
            
            // Animate hit indicator
            if (hitDetected) {
                const timeSinceHit = time - hitTime;
                if (timeSinceHit < 1) {
                    const scale = 1 + timeSinceHit * 2;
                    hitIndicator.scale.set(scale, scale, 1);
                    hitMaterial.opacity = 1 - timeSinceHit;
                } else {
                    hitDetected = false;
                    hitIndicator.scale.set(1, 1, 1);
                    hitMaterial.opacity = 0;
                }
            }
            
            // Set particle visibility
            const blendFactor = (1 + switchPosition) / 2; // 0 for wave, 1 for particle
            particleGroup.visible = true;
            particle.material.opacity = blendFactor;
            
            // Set wave visibility based on mode
            waveMeshGroup.visible = blendFactor < 0.7;
            waveMaterial.opacity = 0.7 * (1 - blendFactor);
            
            // Update detector visibility
            detector.visible = true;
        }
        
        // Update pattern visibility based on mode
        patternPlane.visible = observationMode === "wave" || switchPosition < 0;
        
        // Handle camera angle
        dualityGroup.rotation.y = Math.sin(time * 0.2) * 0.3;
    };
}

function createEntanglementAnimation() {
    const settings = animationSettings.entanglement;
    
    // Create container for particle pairs
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create particle pairs
    const particlePairCount = settings.pairCount;
    
    // Use different geometry for each particle in a pair
    const geometry1 = new THREE.SphereGeometry(0.2, 12, 12);
    const geometry2 = new THREE.SphereGeometry(0.2, 12, 12);
    
    // Materials for particles
    const material1 = new THREE.MeshStandardMaterial({
        color: animationSettings.particleColor,
        emissive: animationSettings.particleColor,
        emissiveIntensity: 0.5
    });
    
    const material2 = new THREE.MeshStandardMaterial({
        color: animationSettings.secondaryColor,
        emissive: animationSettings.secondaryColor,
        emissiveIntensity: 0.5
    });
    
    // Connection material for entanglement visualization
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    
    // Create particle pairs with entanglement connections
    for (let i = 0; i < particlePairCount; i++) {
        // Create particles
        const particle1 = new THREE.Mesh(geometry1, material1.clone());
        const particle2 = new THREE.Mesh(geometry2, material2.clone());
        
        // Initial positions
        const angle = (i / particlePairCount) * Math.PI * 2;
        const radius = 5 + Math.random() * 2;
        
        particle1.userData = {
            angle: angle,
            radius: radius,
            height: (Math.random() - 0.5) * 4,
            speed: 0.01 + Math.random() * 0.005,
            state: Math.random() > 0.5 ? 1 : -1,
            measured: false,
            paired: particle2,
            phase: Math.random() * Math.PI * 2
        };
        
        particle2.userData = {
            angle: angle + Math.PI,
            radius: radius,
            height: (Math.random() - 0.5) * 4,
            speed: 0.01 + Math.random() * 0.005,
            state: particle1.userData.state * -1, // Opposite state
            measured: false,
            paired: particle1,
            phase: particle1.userData.phase + Math.PI
        };
        
        // Set initial positions
        particle1.position.x = Math.cos(particle1.userData.angle) * particle1.userData.radius;
        particle1.position.z = Math.sin(particle1.userData.angle) * particle1.userData.radius;
        particle1.position.y = particle1.userData.height;
        
        particle2.position.x = Math.cos(particle2.userData.angle) * particle2.userData.radius;
        particle2.position.z = Math.sin(particle2.userData.angle) * particle2.userData.radius;
        particle2.position.y = particle2.userData.height;
        
        // Create connection line
        const connectionGeometry = new THREE.BufferGeometry();
        const connectionVertices = new Float32Array(6); // 2 points * 3 coordinates
        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionVertices, 3));
        
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        
        // Store connection in userData
        particle1.userData.connection = connection;
        particle2.userData.connection = connection;
        
        // Add to group
        particleGroup.add(particle1);
        particleGroup.add(particle2);
        particleGroup.add(connection);
    }
    
    // Create measurement apparatus
    const apparatus1Group = new THREE.Group();
    apparatus1Group.position.set(-7, 0, 0);
    scene.add(apparatus1Group);
    
    const apparatus2Group = new THREE.Group();
    apparatus2Group.position.set(7, 0, 0);
    scene.add(apparatus2Group);
    
    // Create apparatus bases
    const apparatusGeometry = new THREE.BoxGeometry(2, 1, 2);
    const apparatusMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        emissive: 0x222222,
        emissiveIntensity: 0.3
    });
    
    const apparatus1Base = new THREE.Mesh(apparatusGeometry, apparatusMaterial);
    apparatus1Group.add(apparatus1Base);
    
    const apparatus2Base = new THREE.Mesh(apparatusGeometry, apparatusMaterial);
    apparatus2Group.add(apparatus2Base);
    
    // Create measurement indicators
    const indicatorGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    const upIndicatorMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.3
    });
    
    const downIndicatorMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.3
    });
    
    const upIndicator1 = new THREE.Mesh(indicatorGeometry, upIndicatorMaterial.clone());
    upIndicator1.position.set(0, 1.2, 0.5);
    apparatus1Group.add(upIndicator1);
    
    const downIndicator1 = new THREE.Mesh(indicatorGeometry, downIndicatorMaterial.clone());
    downIndicator1.position.set(0, 1.2, -0.5);
    apparatus1Group.add(downIndicator1);
    
    const upIndicator2 = new THREE.Mesh(indicatorGeometry, upIndicatorMaterial.clone());
    upIndicator2.position.set(0, 1.2, 0.5);
    apparatus2Group.add(upIndicator2);
    
    const downIndicator2 = new THREE.Mesh(indicatorGeometry, downIndicatorMaterial.clone());
    downIndicator2.position.set(0, 1.2, -0.5);
    apparatus2Group.add(downIndicator2);
    
    // Measurement state variables
    let isMeasuring = false;
    let measurementStartTime = 0;
    let measuredParticle = null;
    
    // Set up raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections with particles
        const intersects = raycaster.intersectObjects(particleGroup.children);
        
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            
            // Only measure particles, not connections
            if (object.type === 'Mesh' && !object.userData.measured && !isMeasuring) {
                isMeasuring = true;
                measurementStartTime = Date.now() * 0.001;
                measuredParticle = object;
                object.userData.measured = true;
                object.userData.paired.userData.measured = true;
                
                // Determine which apparatus to use
                const apparatusGroup = object.position.x < 0 ? apparatus1Group : apparatus2Group;
                const upIndicator = object.position.x < 0 ? upIndicator1 : upIndicator2;
                const downIndicator = object.position.x < 0 ? downIndicator1 : downIndicator2;
                
                // Update indicator based on particle state
                if (object.userData.state > 0) {
                    upIndicator.material.opacity = 1.0;
                    downIndicator.material.opacity = 0.3;
                } else {
                    upIndicator.material.opacity = 0.3;
                    downIndicator.material.opacity = 1.0;
                }
                
                // Also update the paired particle's indicator
                const pairedApparatusGroup = object.userData.paired.position.x < 0 ? apparatus1Group : apparatus2Group;
                const pairedUpIndicator = object.userData.paired.position.x < 0 ? upIndicator1 : upIndicator2;
                const pairedDownIndicator = object.userData.paired.position.x < 0 ? downIndicator1 : downIndicator2;
                
                if (object.userData.paired.userData.state > 0) {
                    pairedUpIndicator.material.opacity = 1.0;
                    pairedDownIndicator.material.opacity = 0.3;
                } else {
                    pairedUpIndicator.material.opacity = 0.3;
                    pairedDownIndicator.material.opacity = 1.0;
                }
                
                break;
            }
        }
    });
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update particle positions and connections
        for (let i = 0; i < particleGroup.children.length; i++) {
            const object = particleGroup.children[i];
            
            // Skip connection lines
            if (object.type !== 'Mesh') continue;
            
            const data = object.userData;
            
            if (!data.measured) {
                // Update particle position
                data.angle += data.speed;
                
                object.position.x = Math.cos(data.angle) * data.radius;
                object.position.z = Math.sin(data.angle) * data.radius;
                object.position.y = data.height + Math.sin(time * 2 + data.phase) * 0.5;
                
                // Quantum state visualization - pulsing scale
                const scale = 0.8 + Math.sin(time * 3 + data.phase) * 0.2;
                object.scale.set(scale, scale, scale);
            } else {
                // Move measured particles to their respective apparatus
                const targetX = object.position.x < 0 ? -7 : 7;
                const targetY = 1.2;
                const targetZ = object.userData.state > 0 ? 0.5 : -0.5;
                
                object.position.x += (targetX - object.position.x) * 0.1;
                object.position.y += (targetY - object.position.y) * 0.1;
                object.position.z += (targetZ - object.position.z) * 0.1;
                
                // Fixed scale for measured particles
                object.scale.set(1, 1, 1);
            }
            
            // Update connection lines
            if (data.connection && i % 2 === 0) {
                const positions = data.connection.geometry.attributes.position.array;
                
                // Update line vertices to connect particles
                positions[0] = object.position.x;
                positions[1] = object.position.y;
                positions[2] = object.position.z;
                
                positions[3] = data.paired.position.x;
                positions[4] = data.paired.position.y;
                positions[5] = data.paired.position.z;
                
                data.connection.geometry.attributes.position.needsUpdate = true;
                
                // Update connection opacity based on distance
                const distance = object.position.distanceTo(data.paired.position);
                const opacity = Math.max(0, 1 - distance / 20) * 0.3;
                
                // Only update material if both particles are not measured
                if (!data.measured && !data.paired.userData.measured) {
                    data.connection.material.opacity = opacity;
                } else if (data.measured && data.paired.userData.measured) {
                    // Fade out connection when both are measured
                    data.connection.material.opacity = Math.max(0, data.connection.material.opacity - 0.01);
                }
            }
        }
        
        // Reset measurement after a delay
        if (isMeasuring) {
            const measurementDuration = 5; // seconds
            const currentTime = Date.now() * 0.001;
            
            if (currentTime - measurementStartTime > measurementDuration) {
                isMeasuring = false;
                
                // Reset indicators
                upIndicator1.material.opacity = 0.3;
                downIndicator1.material.opacity = 0.3;
                upIndicator2.material.opacity = 0.3;
                downIndicator2.material.opacity = 0.3;
                
                // Generate new particles to replace measured ones
                if (measuredParticle) {
                    const pairedParticle = measuredParticle.userData.paired;
                    const connection = measuredParticle.userData.connection;
                    
                    // Remove old particles and connection
                    particleGroup.remove(measuredParticle);
                    particleGroup.remove(pairedParticle);
                    particleGroup.remove(connection);
                    
                    // Create new pair
                    const particle1 = new THREE.Mesh(geometry1, material1);
                    const particle2 = new THREE.Mesh(geometry2, material2);
                    
                    // Generate random parameters for new pair
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 5 + Math.random() * 2;
                    
                    particle1.userData = {
                        angle: angle,
                        radius: radius,
                        height: (Math.random() - 0.5) * 4,
                        speed: 0.01 + Math.random() * 0.005,
                        state: Math.random() > 0.5 ? 1 : -1,
                        measured: false,
                        paired: particle2,
                        phase: Math.random() * Math.PI * 2
                    };
                    
                    particle2.userData = {
                        angle: angle + Math.PI,
                        radius: radius,
                        height: (Math.random() - 0.5) * 4,
                        speed: 0.01 + Math.random() * 0.005,
                        state: particle1.userData.state * -1, // Opposite state
                        measured: false,
                        paired: particle1,
                        phase: particle1.userData.phase + Math.PI
                    };
                    
                    // Set initial positions
                    particle1.position.x = Math.cos(particle1.userData.angle) * particle1.userData.radius;
                    particle1.position.z = Math.sin(particle1.userData.angle) * particle1.userData.radius;
                    particle1.position.y = particle1.userData.height;
                    
                    particle2.position.x = Math.cos(particle2.userData.angle) * particle2.userData.radius;
                    particle2.position.z = Math.sin(particle2.userData.angle) * particle2.userData.radius;
                    particle2.position.y = particle2.userData.height;
                    
                    // Create connection line
                    const connectionGeometry = new THREE.BufferGeometry();
                    const connectionVertices = new Float32Array(6); // 2 points * 3 coordinates
                    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionVertices, 3));
                    
                    const newConnection = new THREE.Line(connectionGeometry, connectionMaterial);
                    
                    // Store connection in userData
                    particle1.userData.connection = newConnection;
                    particle2.userData.connection = newConnection;
                    
                    // Add to group
                    particleGroup.add(particle1);
                    particleGroup.add(particle2);
                    particleGroup.add(newConnection);
                    
                    measuredParticle = null;
                }
            }
        }
        
        // Gentle rotation for better visualization
        particleGroup.rotation.y = Math.sin(time * 0.2) * 0.3;
    };
}

function createNonlocalityAnimation() {
    const settings = animationSettings.nonlocality;
    
    // Create container for particle pairs
    const particlePairGroup = new THREE.Group();
    scene.add(particlePairGroup);
    
    // Create particle pairs with non-local connections
    for (let i = 0; i < settings.particlePairs; i++) {
        // Create a group for this pair
        const pairGroup = new THREE.Group();
        
        // Create the two particles
        const particleGeometry = new THREE.SphereGeometry(0.2, 12, 12);
        
        const material1 = new THREE.MeshStandardMaterial({
            color: animationSettings.particleColor,
            emissive: animationSettings.particleColor,
            emissiveIntensity: 0.5
        });
        
        const material2 = new THREE.MeshStandardMaterial({
            color: animationSettings.secondaryColor,
            emissive: animationSettings.secondaryColor,
            emissiveIntensity: 0.5
        });
        
        const particle1 = new THREE.Mesh(particleGeometry, material1);
        const particle2 = new THREE.Mesh(particleGeometry, material2);
        
        // Position particles on opposite sides
        const angle = (i / settings.particlePairs) * Math.PI * 2;
        const radius = 7;
        
        particle1.position.set(
            -radius * 0.8 + Math.cos(angle) * 2,
            (Math.random() - 0.5) * 4,
            Math.sin(angle) * 2
        );
        
        particle2.position.set(
            radius * 0.8 + Math.cos(angle + Math.PI) * 2,
            (Math.random() - 0.5) * 4,
            Math.sin(angle + Math.PI) * 2
        );
        
        // Setup userData for animation
        particle1.userData = {
            isPast: true,
            state: Math.random() > 0.5 ? 1 : -1,
            phaseOffset: Math.random() * Math.PI * 2,
            frequency: 0.5 + Math.random() * 1,
            pair: particle2,
            affectedByUser: false,
            affectedTime: 0
        };
        
        particle2.userData = {
            isPast: false,
            state: particle1.userData.state,
            phaseOffset: particle1.userData.phaseOffset,
            frequency: particle1.userData.frequency,
            pair: particle1,
            affectedByUser: false,
            affectedTime: 0
        };
        
        // Add connection line
        const connectionGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6);
        positions[0] = particle1.position.x;
        positions[1] = particle1.position.y;
        positions[2] = particle1.position.z;
        positions[3] = particle2.position.x;
        positions[4] = particle2.position.y;
        positions[5] = particle2.position.z;
        
        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const connectionMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 0.5,
            gapSize: 0.3,
            transparent: true,
            opacity: 0.3
        });
        
        const connection = new THREE.Line(connectionGeometry, connectionMaterial);
        connection.computeLineDistances();
        
        // Store connection in userData
        particle1.userData.connection = connection;
        particle2.userData.connection = connection;
        
        // Add to group
        pairGroup.add(particle1);
        pairGroup.add(particle2);
        pairGroup.add(connection);
        
        particlePairGroup.add(pairGroup);
    }
    
    // Create boundaries to represent past and future
    const pastBoundaryGeometry = new THREE.BoxGeometry(0.2, 10, 10);
    const pastBoundaryMaterial = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.2,
        emissive: 0x4444ff,
        emissiveIntensity: 0.1
    });
    
    const pastBoundary = new THREE.Mesh(pastBoundaryGeometry, pastBoundaryMaterial);
    pastBoundary.position.x = -7;
    scene.add(pastBoundary);
    
    // Create past label
    const pastLabel = createTextSprite("Past", { fontsize: 24, color: 0x4444ff });
    pastLabel.position.set(-10, 5, 0);
    scene.add(pastLabel);
    
    const futureBoundaryGeometry = new THREE.BoxGeometry(0.2, 10, 10);
    const futureBoundaryMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.2,
        emissive: 0xff4444,
        emissiveIntensity: 0.1
    });
    
    const futureBoundary = new THREE.Mesh(futureBoundaryGeometry, futureBoundaryMaterial);
    futureBoundary.position.x = 7;
    scene.add(futureBoundary);
    
    // Create future label
    const futureLabel = createTextSprite("Future", { fontsize: 24, color: 0xff4444 });
    futureLabel.position.set(10, 5, 0);
    scene.add(futureLabel);
    
    // Create central event visualization
    const eventGeometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
    const eventMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5
    });
    
    const eventRing = new THREE.Mesh(eventGeometry, eventMaterial);
    eventRing.rotation.x = Math.PI / 2;
    scene.add(eventRing);
    
    // Create influence visualization
    const influenceGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const influenceMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0
    });
    
    const influenceSphere = new THREE.Mesh(influenceGeometry, influenceMaterial);
    scene.add(influenceSphere);
    
    // Interaction handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    let influenceActive = false;
    let influenceStartTime = 0;
    let influenceStartPosition = new THREE.Vector3();
    let influenceTargets = [];
    
    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Find intersections with particles
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            
            // Check if it's a particle
            if (object.type === 'Mesh' && object.geometry.type === 'SphereGeometry' && 
                object.userData.hasOwnProperty('isPast')) {
                
                // Start influence effect
                influenceActive = true;
                influenceStartTime = Date.now() * 0.001;
                influenceStartPosition.copy(object.position);
                influenceSphere.position.copy(object.position);
                influenceSphere.scale.set(0.1, 0.1, 0.1);
                influenceMaterial.opacity = 1.0;
                
                // Mark this particle as affected
                object.userData.affectedByUser = true;
                object.userData.affectedTime = influenceStartTime;
                
                // Change its state
                object.userData.state *= -1;
                
                // Instantly affect paired particle (non-locality)
                const pairedParticle = object.userData.pair;
                pairedParticle.userData.state = object.userData.state;
                pairedParticle.userData.affectedByUser = true;
                pairedParticle.userData.affectedTime = influenceStartTime;
                
                // Add both to influence targets
                influenceTargets = [object, pairedParticle];
                
                break;
            }
        }
    });
    
    // Helper function to create text sprites
    function createTextSprite(text, parameters) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold " + (parameters.fontsize || 18) + "px Arial";
        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.textAlign = "center";
        context.fillText(text, 128, 50);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);
        
        return sprite;
    }
    
    // Animation update function
    currentAnimation = (time) => {
        time *= 0.001; // Convert to seconds
        
        // Update particles and connections
        particlePairGroup.children.forEach(pairGroup => {
            // Get the two particles from the pair
            const particles = pairGroup.children.filter(child => 
                child.type === 'Mesh' && child.geometry.type === 'SphereGeometry'
            );
            
            if (particles.length === 2) {
                particles.forEach(particle => {
                    const data = particle.userData;
                    
                    // Update particle visualization based on state
                    if (data.state > 0) {
                        particle.scale.set(1, 1, 1);
                    } else {
                        particle.scale.set(0.7, 0.7, 0.7);
                    }
                    
                    // Additional animation for affected particles
                    if (data.affectedByUser) {
                        const timeSinceAffected = time - data.affectedTime;
                        
                        if (timeSinceAffected < 2) {
                            // Pulse effect
                            const pulse = 1 + Math.sin(timeSinceAffected * 10) * 0.3 * (1 - timeSinceAffected / 2);
                            particle.scale.multiplyScalar(pulse);
                            
                            // Change material color temporarily
                            if (particle.material.color.g < 1) {
                                particle.material.color.g += 0.05;
                                particle.material.emissive.g += 0.05;
                            }
                        } else {
                            data.affectedByUser = false;
                            
                            // Reset color
                            if (data.isPast) {
                                particle.material.color.set(animationSettings.particleColor);
                                particle.material.emissive.set(animationSettings.particleColor);
                            } else {
                                particle.material.color.set(animationSettings.secondaryColor);
                                particle.material.emissive.set(animationSettings.secondaryColor);
                            }
                        }
                    }
                    
                    // Add small oscillation movement
                    const baseY = particle.position.y;
                    particle.position.y = baseY + Math.sin(time * data.frequency + data.phaseOffset) * 0.2;
                });
                
                // Update connection line
                const connection = pairGroup.children.find(child => child.type === 'Line');
                if (connection) {
                    const positions = connection.geometry.attributes.position.array;
                    
                    // Update line vertices to follow particles
                    positions[0] = particles[0].position.x;
                    positions[1] = particles[0].position.y;
                    positions[2] = particles[0].position.z;
                    positions[3] = particles[1].position.x;
                    positions[4] = particles[1].position.y;
                    positions[5] = particles[1].position.z;
                    
                    connection.geometry.attributes.position.needsUpdate = true;
                    connection.computeLineDistances();
                    
                    // If both particles are affected, highlight the connection
                    if (particles[0].userData.affectedByUser && particles[1].userData.affectedByUser) {
                        connection.material.color.set(0xffff00);
                        connection.material.opacity = 0.7;
                    } else {
                        connection.material.color.set(0xffffff);
                        connection.material.opacity = 0.3;
                    }
                }
            }
        });
        
        // Update influence visualization
        if (influenceActive) {
            const currentTime = Date.now() * 0.001;
            const timeSinceInfluence = currentTime - influenceStartTime;
            
            if (timeSinceInfluence < 1.5) {
                // Expand influence sphere
                const scale = 1 + timeSinceInfluence * 15;
                influenceSphere.scale.set(scale, scale, scale);
                influenceMaterial.opacity = 1 - timeSinceInfluence / 1.5;
            } else {
                // Reset influence
                influenceActive = false;
                influenceMaterial.opacity = 0;
                influenceTargets = [];
            }
        }
        
        // Animate event ring
        eventRing.rotation.z = time * 0.5;
        eventRing.scale.set(
            1 + Math.sin(time * 0.7) * 0.1,
            1 + Math.sin(time * 0.7) * 0.1,
            1 + Math.sin(time * 0.7) * 0.1
        );
        
        // Gently rotate the scene for better visualization
        particlePairGroup.rotation.y = Math.sin(time * 0.2) * 0.3;
    };
}

function updateInteractionButtons(animationType) {
    // Clear previous buttons
    animationButtonsContainer.innerHTML = '';
    
    // Create buttons based on animation type
    switch(animationType) {
        case 'superposition':
            createButton('Collapse Wave', () => collapseWaveFunction());
            createButton('Reset States', () => resetSuperposition());
            createButton('Increase Particles', () => adjustParticleCount(1.5));
            createButton('Decrease Particles', () => adjustParticleCount(0.67));
            break;
            
        case 'wavefunction':
            createButton('Create Wave', () => createWavePulse());
            createButton('Toggle Particles', () => toggleWaveParticles());
            createButton('Increase Amplitude', () => adjustWaveAmplitude(1.5));
            createButton('Decrease Amplitude', () => adjustWaveAmplitude(0.67));
            break;
            
        case 'indistinguishable':
            createButton('Track Particle', () => attemptParticleTracking());
            createButton('Swap Particles', () => swapRandomParticles());
            createButton('Speed Up', () => adjustParticleSpeed(1.5));
            createButton('Slow Down', () => adjustParticleSpeed(0.67));
            break;
            
        case 'duality':
            createButton('Wave View', () => setDualityViewState(0));
            createButton('Particle View', () => setDualityViewState(1));
            createButton('Measure', () => measureDualitySystem());
            createButton('Reset', () => resetDualitySystem());
            break;
            
        case 'decoherence':
            createButton('Trigger Decoherence', () => startDecoherence());
            createButton('Add Environment', () => addEnvironmentParticles());
            createButton('Reset Coherence', () => resetCoherence());
            createButton('Toggle Visualization', () => toggleDecoherenceRings());
            break;
            
        case 'observer':
            createButton('Observe System', () => observeQuantumSystem());
            createButton('Move Observer', () => moveObserverRandomly());
            createButton('Reset System', () => resetObservedSystem());
            createButton('Toggle Paths', () => toggleQuantumPaths());
            break;
            
        case 'uncertainty':
            createButton('Measure Position', () => measurePosition());
            createButton('Measure Momentum', () => measureMomentum());
            createButton('Balanced State', () => balanceUncertainty());
            createButton('Toggle Cloud', () => toggleUncertaintyCloud());
            break;
            
        case 'complementarity':
            createButton('Wave Mode', () => setComplementarityMode('wave'));
            createButton('Particle Mode', () => setComplementarityMode('particle'));
            createButton('Double Slit', () => showDoubleSlit());
            createButton('Single Slit', () => showSingleSlit());
            break;
            
        case 'entanglement':
            createButton('Entangle Pair', () => entangleRandomPair());
            createButton('Measure Particle', () => measureEntangledParticle());
            createButton('Rotate Basis', () => rotateEntanglementBasis());
            createButton('Reset Pairs', () => resetEntangledPairs());
            break;
            
        case 'nonlocality':
            createButton('Change Past', () => influencePastParticle());
            createButton('Change Future', () => influenceFutureParticle());
            createButton('Show Effects', () => demonstrateNonlocality());
            createButton('Reset Timeline', () => resetNonlocalSystem());
            break;
    }
}

function createButton(label, callback) {
    const button = document.createElement('button');
    button.textContent = label;
    button.className = 'interaction-btn';
    button.addEventListener('click', callback);
    animationButtonsContainer.appendChild(button);
}

// Interaction functions for each animation type
function collapseWaveFunction() {
    // For superposition animation
    const intersectionPlane = scene.children.find(obj => obj.type === 'Mesh' && obj.geometry.type === 'PlaneGeometry');
    if (intersectionPlane) {
        // Create a random point on the plane for collapse
        const x = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        const point = new THREE.Vector3(x, 0, z);
        
        // Find particles group
        const particlesGroup = scene.children.find(obj => obj.type === 'Group');
        if (particlesGroup) {
            particlesGroup.children.forEach(particle => {
                if (particle.type === 'Mesh') {
                    particle.userData.collapsing = true;
                    particle.userData.collapseTarget = point.clone();
                    particle.userData.collapseTarget.x += (Math.random() - 0.5) * 2;
                    particle.userData.collapseTarget.y += (Math.random() - 0.5) * 2;
                    particle.userData.collapseTarget.z += (Math.random() - 0.5) * 2;
                    particle.userData.collapseProgress = 0;
                }
            });
        }
    }
}

function resetSuperposition() {
    // Reset particles in superposition state
    const particlesGroup = scene.children.find(obj => obj.type === 'Group');
    if (particlesGroup) {
        particlesGroup.children.forEach(particle => {
            if (particle.type === 'Mesh') {
                particle.userData.collapsing = false;
                particle.userData.collapseProgress = 0;
            }
        });
    }
}

function adjustParticleCount(factor) {
    // Dynamically adjust particle count in animations
    if (currentAnimation === createSuperpositionAnimation) {
        clearAnimation();
        animationSettings.superposition.particleCount = Math.floor(animationSettings.superposition.particleCount * factor);
        createSuperpositionAnimation();
    } else if (currentAnimation === createIndistinguishableAnimation) {
        clearAnimation();
        animationSettings.indistinguishable.particleCount = Math.floor(animationSettings.indistinguishable.particleCount * factor);
        createIndistinguishableAnimation();
    }
}

function createWavePulse() {
    // Create a wave pulse in the wave function animation
    const time = Date.now() * 0.001;
    const x = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;
    
    waveSource = new THREE.Vector3(x, 0, z);
    waveSource.time = time;
}

function toggleWaveParticles() {
    // Toggle visibility of probability particles in wave function
    const particleGroup = scene.children.find(obj => obj.name === 'particleGroup' || 
                                            (obj.type === 'Group' && obj.children.some(c => c.type === 'Mesh' && 
                                                                                     c.material.color.getHex() === animationSettings.secondaryColor)));
    if (particleGroup) {
        particleGroup.visible = !particleGroup.visible;
    }
}

function adjustWaveAmplitude(factor) {
    // Adjust wave amplitude
    if (currentAnimation === createWaveFunctionAnimation) {
        animationSettings.wavefunction.amplitude *= factor;
    }
}

function attemptParticleTracking() {
    // For indistinguishable particles, attempt to track one
    const particleGroup = scene.children.find(obj => obj.type === 'Group');
    if (particleGroup) {
        const particles = particleGroup.children.filter(obj => obj.type === 'Mesh');
        if (particles.length > 0) {
            const randomParticle = particles[Math.floor(Math.random() * particles.length)];
            
            // Reset any previously tracked particles
            particles.forEach(p => {
                p.userData.tracked = false;
                p.material = new THREE.MeshStandardMaterial({
                    color: animationSettings.particleColor,
                    emissive: animationSettings.particleColor,
                    emissiveIntensity: 0.5
                });
            });
            
            // Track the new particle
            randomParticle.userData.tracked = true;
            randomParticle.material = new THREE.MeshStandardMaterial({
                color: 0xff6b6b,
                emissive: 0xff6b6b,
                emissiveIntensity: 0.6
            });
            
            // Find and show tracking ring if it exists
            const trackingRing = scene.children.find(obj => obj.type === 'Mesh' && obj.geometry.type === 'RingGeometry');
            if (trackingRing) {
                trackingRing.position.copy(randomParticle.position);
                trackingRing.lookAt(camera.position);
                trackingRing.visible = true;
            }
        }
    }
}

function swapRandomParticles() {
    // Randomly swap two particles to demonstrate indistinguishability
    const particleGroup = scene.children.find(obj => obj.type === 'Group');
    if (particleGroup) {
        const particles = particleGroup.children.filter(obj => obj.type === 'Mesh' && !obj.userData.tracked);
        if (particles.length >= 2) {
            const p1 = Math.floor(Math.random() * particles.length);
            let p2 = Math.floor(Math.random() * particles.length);
            while (p2 === p1) p2 = Math.floor(Math.random() * particles.length);
            
            // Swap positions
            const tempPos = particles[p1].position.clone();
            particles[p1].position.copy(particles[p2].position);
            particles[p2].position.copy(tempPos);
            
            // Also swap in userData
            const tempUserPos = particles[p1].userData.position.clone();
            particles[p1].userData.position.copy(particles[p2].userData.position);
            particles[p2].userData.position.copy(tempUserPos);
        }
    }
}

function adjustParticleSpeed(factor) {
    // Adjust particle speeds
    const particleGroup = scene.children.find(obj => obj.type === 'Group');
    if (particleGroup) {
        particleGroup.children.forEach(particle => {
            if (particle.type === 'Mesh' && particle.userData.velocity) {
                particle.userData.velocity.multiplyScalar(factor);
            } else if (particle.type === 'Mesh' && particle.userData.speed) {
                particle.userData.speed *= factor;
            }
        });
    }
}

function setDualityViewState(state) {
    // Set view state for wave-particle duality (0 = wave, 1 = particle)
    targetViewState = state;
    lastMeasurementTime = Date.now() * 0.001;
}

function measureDualitySystem() {
    // Measure the duality system, collapsing to particle
    targetViewState = 1;
    lastMeasurementTime = Date.now() * 0.001;
    
    // Trigger detector animation
    const detector = scene.children.find(obj => obj.name === 'detector' || 
                                       (obj.type === 'Mesh' && obj.geometry.type === 'SphereGeometry' && 
                                       obj.material.color.getHex() === 0xff6b6b));
    if (detector) {
        detector.scale.set(2, 2, 2);
        detector.material.opacity = 0.9;
    }
}

function resetDualitySystem() {
    // Reset to wave view
    targetViewState = 0;
    lastMeasurementTime = Date.now() * 0.001;
}

function startDecoherence() {
    // Start decoherence in quantum system
    isDecoherencing = true;
    decoherenceTime = Date.now() * 0.001;
    
    // Mark all coherent particles for decoherence
    const particleSystem = scene.children.find(obj => obj.name === 'particleSystem' || obj.type === 'Group');
    if (particleSystem) {
        particleSystem.children.forEach(particle => {
            if (particle.type === 'Mesh' && particle.userData.coherent) {
                particle.userData.decoherenceStart = decoherenceTime;
            }
        });
    }
}

function addEnvironmentParticles() {
    // Add more environment particles to accelerate decoherence
    const envParticles = scene.children.find(obj => obj.name === 'environmentParticles' || 
                                           (obj.type === 'Group' && obj.children.some(c => c.material && 
                                                                                     c.material.color.getHex() === 0xff6b6b)));
    if (envParticles) {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            emissive: 0xff6b6b,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(geometry, material);
            
            // Random position outside the coherent system
            const radius = 10 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
            particle.position.y = radius * Math.cos(phi);
            particle.position.z = radius * Math.sin(phi) * Math.sin(theta);
            
            particle.userData = {
                speed: 0.02 + Math.random() * 0.03,
                direction: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ).normalize()
            };
            
            envParticles.add(particle);
        }
    }
}

function resetCoherence() {
    // Reset decoherence to coherent state
    isDecoherencing = false;
    
    const particleSystem = scene.children.find(obj => obj.name === 'particleSystem' || obj.type === 'Group');
    if (particleSystem) {
        particleSystem.children.forEach(particle => {
            if (particle.type === 'Mesh') {
                particle.position.copy(particle.userData.originalPosition);
                particle.userData.coherent = true;
                particle.userData.decoherenceStart = null;
                particle.userData.decoherenceProgress = 0;
                particle.material.opacity = 1.0;
                
                // Generate a new random final position
                particle.userData.finalPosition = new THREE.Vector3(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15
                );
            }
        });
    }
    
    // Reset coherence rings
    const rings = scene.children.filter(obj => obj.type === 'Mesh' && obj.geometry.type === 'TorusGeometry');
    rings.forEach(ring => {
        ring.material.opacity = 0.5;
        ring.scale.set(1, 1, 1);
        ring.visible = true;
    });
}

function toggleDecoherenceRings() {
    // Toggle visibility of coherence visualization
    const rings = scene.children.filter(obj => obj.type === 'Mesh' && obj.geometry.type === 'TorusGeometry');
    rings.forEach(ring => {
        ring.visible = !ring.visible;
    });
}

function observeQuantumSystem() {
    // Observe the quantum system, triggering wavefunction collapse
    isObserving = true;
    observationStartTime = Date.now() * 0.001;
    
    // Position observation ring at observer
    const observer = scene.children.find(obj => obj.name === 'observer' || 
                                        (obj.type === 'Mesh' && obj.geometry.type === 'SphereGeometry' && 
                                         obj.material.color.getHex() === 0xff6b6b));
    const observationRing = scene.children.find(obj => obj.name === 'observationRing' || 
                                              (obj.type === 'Mesh' && obj.geometry.type === 'RingGeometry'));
    
    if (observer && observationRing) {
        observationRing.position.copy(observer.position);
        observationRing.material.opacity = 0.7;
    }
}

function moveObserverRandomly() {
    // Move observer to a random position
    const observer = scene.children.find(obj => obj.name === 'observer' || 
                                        (obj.type === 'Mesh' && obj.geometry.type === 'SphereGeometry' && 
                                         obj.material.color.getHex() === 0xff6b6b));
    if (observer) {
        observerPosition = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            0,
            (Math.random() - 0.5) * 10
        );
    }
}

function resetObservedSystem() {
    // Reset all particles to unobserved state
    const particleSystem = scene.children.find(obj => obj.type === 'Group');
    if (particleSystem) {
        particleSystem.children.forEach(particle => {
            if (particle.type === 'Mesh') {
                particle.userData.observed = false;
                particle.material = new THREE.MeshStandardMaterial({
                    color: animationSettings.particleColor,
                    emissive: animationSettings.particleColor,
                    emissiveIntensity: 0.5
                });
            }
        });
    }
}

function toggleQuantumPaths() {
    // Toggle visualization of quantum paths
    const particleSystem = scene.children.find(obj => obj.type === 'Group');
    if (particleSystem) {
        // Create/toggle path traces
        const pathTracesExist = scene.children.some(obj => obj.name === 'pathTraces');
        
        if (pathTracesExist) {
            // Remove paths
            const pathTraces = scene.children.find(obj => obj.name === 'pathTraces');
            scene.remove(pathTraces);
        } else {
            // Create path traces
            const pathTraces = new THREE.Group();
            pathTraces.name = 'pathTraces';
            
            particleSystem.children.forEach(particle => {
                if (particle.type === 'Mesh' && !particle.userData.observed) {
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0x7b68ee,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const points = [];
                    for (let i = 0; i < 20; i++) {
                        const t = Date.now() * 0.001 + i * 0.1;
                        const data = particle.userData;
                        
                        // Calculate potential positions
                        const x = data.originalPosition.x + Math.sin(t + data.phase) * 0.3;
                        const y = data.originalPosition.y + Math.cos(t * 1.3 + data.phase) * 0.3;
                        const z = data.originalPosition.z + Math.sin(t * 0.7 + data.phase * 2) * 0.3;
                        
                        points.push(new THREE.Vector3(x, y, z));
                    }
                    
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    pathTraces.add(line);
                }
            });
            
            scene.add(pathTraces);
        }
    }
}

function measurePosition() {
    // Measure position in uncertainty principle demonstration
    measuringPosition = true;
    targetPositionUncertainty = 0.2;
    targetMomentumUncertainty = 5.0;
}

function measureMomentum() {
    // Measure momentum in uncertainty principle demonstration
    measuringMomentum = true;
    targetMomentumUncertainty = 0.2;
    targetPositionUncertainty = 5.0;
}

function balanceUncertainty() {
    // Return to balanced state
    targetPositionUncertainty = 1.0;
    targetMomentumUncertainty = 1.0;
}

function toggleUncertaintyCloud() {
    // Toggle visibility of uncertainty cloud
    const cloud = scene.children.find(obj => obj.type === 'Group' && obj.name === 'uncertaintyCloud' ||
                                    (obj.type === 'Points'));
    if (cloud) {
        cloud.visible = !cloud.visible;
    }
}

function setComplementarityMode(mode) {
    // Set observation mode for complementarity demonstration
    observationMode = mode;
    
    if (mode === 'wave') {
        // Animate switch to wave position
        isAnimatingSwitch = true;
    } else {
        // Animate switch to particle position
        isAnimatingSwitch = true;
    }
}

function showDoubleSlit() {
    // Show double-slit experiment configuration
    updateWavePattern(Date.now() * 0.001);
}

function showSingleSlit() {
    // Switch to single-slit experiment for comparison
    // This would modify the pattern drawing function to show single-slit diffraction
    patternContext.clearRect(0, 0, patternWidth, patternHeight);
    patternContext.fillStyle = 'black';
    patternContext.fillRect(0, 0, patternWidth, patternHeight);
    
    // Draw single-slit pattern
    patternContext.fillStyle = 'rgba(100, 100, 255, 0.7)';
    const time = Date.now() * 0.001;
    
    for (let x = 0; x < patternWidth; x++) {
        const normalizedX = (x / patternWidth) * 2 - 1;
        
        // Calculate intensity using single-slit pattern equation
        const sinc = function(x) { return x === 0 ? 1 : Math.sin(x) / x; };
        const intensity = Math.pow(sinc(normalizedX * 10), 2) * patternHeight * 0.4;
        
        // Draw as a vertical line at this x position
        for (let y = 0; y < intensity; y++) {
            const centerY = patternHeight / 2;
            patternContext.fillRect(x, centerY - y/2, 1, 1);
            patternContext.fillRect(x, centerY + y/2, 1, 1);
        }
    }
    
    patternTexture.needsUpdate = true;
}

function entangleRandomPair() {
    // Create a new entangled pair of particles
    const particleGroup = scene.children.find(obj => obj.type === 'Group');
    
    if (particleGroup) {
        // Find existing pairs to get their structure
        const existingPairs = particleGroup.children.filter(obj => obj.type === 'Mesh' && 
                                                               obj.userData && obj.userData.paired);
        
        if (existingPairs.length > 0) {
            // Clone properties from an existing pair
            const templateParticle = existingPairs[0];
            const templatePair = templateParticle.userData.paired;
            
            // Create new particle pair
            const geometry1 = templateParticle.geometry.clone();
            const geometry2 = templatePair.geometry.clone();
            
            const material1 = new THREE.MeshStandardMaterial({
                color: animationSettings.particleColor,
                emissive: animationSettings.particleColor,
                emissiveIntensity: 0.5
            });
            
            const material2 = new THREE.MeshStandardMaterial({
                color: animationSettings.secondaryColor,
                emissive: animationSettings.secondaryColor,
                emissiveIntensity: 0.5
            });
            
            const particle1 = new THREE.Mesh(geometry1, material1);
            const particle2 = new THREE.Mesh(geometry2, material2);
            
            // Initial positions
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 2;
            
            particle1.userData = {
                angle: angle,
                radius: radius,
                height: (Math.random() - 0.5) * 4,
                speed: 0.01 + Math.random() * 0.005,
                state: Math.random() > 0.5 ? 1 : -1,
                measured: false,
                paired: particle2,
                phase: Math.random() * Math.PI * 2
            };
            
            particle2.userData = {
                angle: angle + Math.PI,
                radius: radius,
                height: (Math.random() - 0.5) * 4,
                speed: 0.01 + Math.random() * 0.005,
                state: particle1.userData.state * -1, // Opposite state
                measured: false,
                paired: particle1,
                phase: particle1.userData.phase + Math.PI
            };
            
            // Set initial positions
            particle1.position.x = Math.cos(particle1.userData.angle) * particle1.userData.radius;
            particle1.position.z = Math.sin(particle1.userData.angle) * particle1.userData.radius;
            particle1.position.y = particle1.userData.height;
            
            particle2.position.x = Math.cos(particle2.userData.angle) * particle2.userData.radius;
            particle2.position.z = Math.sin(particle2.userData.angle) * particle2.userData.radius;
            particle2.position.y = particle2.userData.height;
            
            // Create connection line
            const connectionGeometry = new THREE.BufferGeometry();
            const connectionVertices = new Float32Array(6); // 2 points * 3 coordinates
            connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionVertices, 3));
            
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            
            // Store connection in userData
            particle1.userData.connection = connection;
            particle2.userData.connection = connection;
            
            // Add to group
            particleGroup.add(particle1);
            particleGroup.add(particle2);
            particleGroup.add(connection);
        }
    }
}

function measureEntangledParticle() {
    // Measure a random particle, affecting its entangled pair
    const particleGroup = scene.children.find(obj => obj.type === 'Group');
    
    if (particleGroup) {
        const particles = particleGroup.children.filter(obj => obj.type === 'Mesh' && 
                                                          obj.userData && !obj.userData.measured);
        
        if (particles.length > 0) {
            const randomIndex = Math.floor(Math.random() * particles.length);
            const selectedParticle = particles[randomIndex];
            
            isMeasuring = true;
            measurementStartTime = Date.now() * 0.001;
            measuredParticle = selectedParticle;
            selectedParticle.userData.measured = true;
            selectedParticle.userData.paired.userData.measured = true;
            
            // Find indicators for visualization
            const upIndicator1 = scene.children.find(obj => obj.name === 'upIndicator1');
            const downIndicator1 = scene.children.find(obj => obj.name === 'downIndicator1');
            const upIndicator2 = scene.children.find(obj => obj.name === 'upIndicator2');
            const downIndicator2 = scene.children.find(obj => obj.name === 'downIndicator2');
            
            // Update indicators based on measurement results
            if (upIndicator1 && downIndicator1 && upIndicator2 && downIndicator2) {
                if (selectedParticle.position.x < 0) {
                    if (selectedParticle.userData.state > 0) {
                        upIndicator1.material.opacity = 1.0;
                        downIndicator1.material.opacity = 0.3;
                    } else {
                        upIndicator1.material.opacity = 0.3;
                        downIndicator1.material.opacity = 1.0;
                    }
                    
                    if (selectedParticle.userData.paired.userData.state > 0) {
                        upIndicator2.material.opacity = 1.0;
                        downIndicator2.material.opacity = 0.3;
                    } else {
                        upIndicator2.material.opacity = 0.3;
                        downIndicator2.material.opacity = 1.0;
                    }
                } else {
                    if (selectedParticle.userData.state > 0) {
                        upIndicator2.material.opacity = 1.0;
                        downIndicator2.material.opacity = 0.3;
                    } else {
                        upIndicator2.material.opacity = 0.3;
                        downIndicator2.material.opacity = 1.0;
                    }
                    
                    if (selectedParticle.userData.paired.userData.state > 0) {
                        upIndicator1.material.opacity = 1.0;
                        downIndicator1.material.opacity = 0.3;
                    } else {
                        upIndicator1.material.opacity = 0.3;
                        downIndicator1.material.opacity = 1.0;
                    }
                }
            }
        }
    }
}

function rotateEntanglementBasis() {
    // Rotate the measurement basis for entangled particles
    const apparatus1Group = scene.children.find(obj => obj.name === 'apparatus1Group');
    const apparatus2Group = scene.children.find(obj => obj.name === 'apparatus2Group');
    
    if (apparatus1Group && apparatus2Group) {
        apparatus1Group.rotation.y += Math.PI / 4;
        apparatus2Group.rotation.y -= Math.PI / 4;
    }
}

function resetEntangledPairs() {
    // Reset entangled pairs to unmeasured state
    const particleGroup = scene.children.find(obj => obj.type === 'Group');
    
    if (particleGroup) {
        particleGroup.children.forEach(obj => {
            if (obj.type === 'Mesh' && obj.userData && obj.userData.measured) {
                obj.userData.measured = false;
            }
        });
    }
    
    // Reset indicators
    const indicators = scene.children.filter(obj => obj.name && obj.name.includes('Indicator'));
    indicators.forEach(indicator => {
        indicator.material.opacity = 0.3;
    });
    
    isMeasuring = false;
    measuredParticle = null;
}

function influencePastParticle() {
    // Influence a particle in the "past"
    const particlePairGroup = scene.children.find(obj => obj.type === 'Group');
    
    if (particlePairGroup) {
        const pastParticles = [];
        
        // Find particles in the "past"
        particlePairGroup.children.forEach(pairGroup => {
            if (pairGroup.type === 'Group') {
                pairGroup.children.forEach(obj => {
                    if (obj.type === 'Mesh' && obj.userData && obj.userData.isPast) {
                        pastParticles.push(obj);
                    }
                });
            }
        });
        
        if (pastParticles.length > 0) {
            // Select a random past particle
            const selectedParticle = pastParticles[Math.floor(Math.random() * pastParticles.length)];
            
            // Start influence effect
            influenceActive = true;
            influenceStartTime = Date.now() * 0.001;
            influenceStartPosition.copy(selectedParticle.position);
            influenceSphere.position.copy(selectedParticle.position);
            influenceSphere.scale.set(0.1, 0.1, 0.1);
            influenceMaterial.opacity = 1.0;
            
            // Mark this particle as affected
            selectedParticle.userData.affectedByUser = true;
            selectedParticle.userData.affectedTime = influenceStartTime;
            
            // Change its state
            selectedParticle.userData.state *= -1;
            
            // Instantly affect paired particle (non-locality)
            const pairedParticle = selectedParticle.userData.pair;
            pairedParticle.userData.state = selectedParticle.userData.state;
            pairedParticle.userData.affectedByUser = true;
            pairedParticle.userData.affectedTime = influenceStartTime;
            
            // Add both to influence targets
            influenceTargets = [selectedParticle, pairedParticle];
        }
    }
}

function influenceFutureParticle() {
    // Influence a particle in the "future"
    const particlePairGroup = scene.children.find(obj => obj.type === 'Group');
    
    if (particlePairGroup) {
        const futureParticles = [];
        
        // Find particles in the "future"
        particlePairGroup.children.forEach(pairGroup => {
            if (pairGroup.type === 'Group') {
                pairGroup.children.forEach(obj => {
                    if (obj.type === 'Mesh' && obj.userData && !obj.userData.isPast) {
                        futureParticles.push(obj);
                    }
                });
            }
        });
        
        if (futureParticles.length > 0) {
            // Select a random future particle
            const selectedParticle = futureParticles[Math.floor(Math.random() * futureParticles.length)];
            
            // Start influence effect
            influenceActive = true;
            influenceStartTime = Date.now() * 0.001;
            influenceStartPosition.copy(selectedParticle.position);
            influenceSphere.position.copy(selectedParticle.position);
            influenceSphere.scale.set(0.1, 0.1, 0.1);
            influenceMaterial.opacity = 1.0;
            
            // Mark this particle as affected
            selectedParticle.userData.affectedByUser = true;
            selectedParticle.userData.affectedTime = influenceStartTime;
            
            // Change its state
            selectedParticle.userData.state *= -1;
            
            // Instantly affect paired particle (non-locality)
            const pairedParticle = selectedParticle.userData.pair;
            pairedParticle.userData.state = selectedParticle.userData.state;
            pairedParticle.userData.affectedByUser = true;
            pairedParticle.userData.affectedTime = influenceStartTime;
            
            // Add both to influence targets
            influenceTargets = [selectedParticle, pairedParticle];
        }
    }
}

function demonstrateNonlocality() {
    // Visual demonstration of non-locality
    const eventRing = scene.children.find(obj => obj.type === 'Mesh' && obj.geometry.type === 'TorusGeometry');
    
    if (eventRing) {
        // Create pulsing effect
        eventRing.scale.set(2, 2, 2);
        eventRing.material.opacity = 0.8;
        
        // Animate back to normal over time
        setTimeout(() => {
            const animate = () => {
                eventRing.scale.x *= 0.98;
                eventRing.scale.y *= 0.98;
                eventRing.scale.z *= 0.98;
                eventRing.material.opacity *= 0.98;
                
                if (eventRing.scale.x > 1.05) {
                    requestAnimationFrame(animate);
                } else {
                    eventRing.scale.set(1, 1, 1);
                    eventRing.material.opacity = 0.5;
                }
            };
            
            animate();
        }, 500);
    }
}

function resetNonlocalSystem() {
    // Reset non-locality demonstration
    influenceActive = false;
    influenceMaterial.opacity = 0;
    influenceTargets = [];
    
    const particlePairGroup = scene.children.find(obj => obj.type === 'Group');
    
    if (particlePairGroup) {
        particlePairGroup.children.forEach(pairGroup => {
            if (pairGroup.type === 'Group') {
                pairGroup.children.forEach(obj => {
                    if (obj.type === 'Mesh' && obj.userData && obj.userData.affectedByUser) {
                        obj.userData.affectedByUser = false;
                        
                        // Reset color
                        if (obj.userData.isPast) {
                            obj.material.color.set(animationSettings.particleColor);
                            obj.material.emissive.set(animationSettings.particleColor);
                        } else {
                            obj.material.color.set(animationSettings.secondaryColor);
                            obj.material.emissive.set(animationSettings.secondaryColor);
                        }
                    }
                });
            }
        });
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update animation mixers
    const delta = 0.016;
    animationMixers.forEach(mixer => mixer.update(delta));
    
    // Update particle rotation for more dynamic feel
    scene.traverse(object => {
        if (object.type === 'Mesh' && object.geometry.type === 'SphereGeometry') {
            object.rotation.x += 0.005;
            object.rotation.y += 0.003;
        }
    });
    
    // Run current animation function if it exists
    if (currentAnimation) {
        currentAnimation(time);
    }
    
    // Render the scene
    composer.render();
}