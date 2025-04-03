import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config, verseData } from './config.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Global variables
let currentVerse = 1;
let scene, camera, renderer, composer, controls;
let currentAnimation = null;
let isInteracting = false;

// DOM elements
const canvasContainer = document.getElementById('canvas-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const interactBtn = document.getElementById('interact-btn');
const resetBtn = document.getElementById('reset-btn');
const verseTitleElement = document.getElementById('verse-title');
const madhyamakaConceptElement = document.getElementById('madhyamaka-concept');
const quantumPhysicsElement = document.getElementById('quantum-physics');
const accessibleExplanationElement = document.getElementById('accessible-explanation');
const verseNumberDisplay = document.getElementById('verse-number');
const panelToggle = document.getElementById('panel-toggle');
const sidePanel = document.getElementById('side-panel');
const verseButtons = document.querySelectorAll('.verse-btn');
const sectionHeaders = document.querySelectorAll('.section-header');

// Add event listeners for panel interactions
panelToggle.addEventListener('click', () => {
    sidePanel.classList.toggle('collapsed');
});

sectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        header.classList.toggle('collapsed');
        const content = header.nextElementSibling;
        content.classList.toggle('collapsed');
    });
});

verseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const verseId = parseInt(button.getAttribute('data-verse'));
        if (verseId !== currentVerse) {
            currentVerse = verseId;
            loadVerseContent(currentVerse);
            
            // Update active button
            verseButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
    });
});

// Initialize three.js scene
function initScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000016);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);
    
    // Add post-processing
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85 // threshold
    );
    composer.addPass(bloomPass);
    
    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add stars
    addStars();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function addStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if (currentAnimation) {
        currentAnimation();
    }
    
    composer.render();
}

// Clear scene except for stars
function clearScene() {
    // Find and keep stars
    const starsObject = scene.children.find(obj => obj instanceof THREE.Points);
    
    // Keep lights
    const lights = scene.children.filter(obj => 
        obj instanceof THREE.AmbientLight || 
        obj instanceof THREE.DirectionalLight
    );
    
    // Clear everything else
    scene.children = [];
    
    // Add back stars and lights
    if (starsObject) scene.add(starsObject);
    lights.forEach(light => scene.add(light));
}

// Load verse content
function loadVerseContent(verseId) {
    const verse = verseData.find(v => v.id === verseId);
    
    // Update text content
    verseTitleElement.textContent = `Verse ${verseId}: ${verse.title}`;
    madhyamakaConceptElement.textContent = verse.madhyamakaConcept;
    quantumPhysicsElement.textContent = verse.quantumPhysics;
    accessibleExplanationElement.textContent = verse.explanation;
    verseNumberDisplay.textContent = `Verse ${verseId}/10`;
    
    // Update active verse button
    verseButtons.forEach(btn => {
        const btnVerseId = parseInt(btn.getAttribute('data-verse'));
        if (btnVerseId === verseId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Clear previous animation
    currentAnimation = null;
    isInteracting = false;
    interactBtn.textContent = "Interact";
    
    // Clear scene and create new visualization
    clearScene();
    
    // Load visualization for the verse
    switch (verseId) {
        case 1: createDoubleSlit(); break;
        case 2: createEntangledParticles(); break;
        case 3: createWaveCollapse(); break;
        case 4: createUncertaintyPrinciple(); break;
        case 5: createSuperpositionStates(); break;
        case 6: createObserverEffect(); break;
        case 7: createTimelessEntanglement(); break;
        case 8: createBoundFreeParadox(); break;
        case 9: createQuantumZenoEffect(); break;
        case 10: createQuantumContextuality(); break;
    }
    
    // Reset camera position
    camera.position.set(0, 0, 5);
    controls.reset();
}

// Verse 1: Double-slit experiment
function createDoubleSlit() {
    const { slitDistance, waveIntensity } = config.verse1;
    
    // Create source
    const sourceGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const sourceMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5
    });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.set(0, 0, -4);
    scene.add(source);
    
    // Create barrier with slits
    const barrierGeometry = new THREE.BoxGeometry(5, 2, 0.1);
    const barrierMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a0ca3,
        transparent: true,
        opacity: 0.7
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.set(0, 0, -2);
    scene.add(barrier);
    
    // Create slits
    const slitGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.2);
    const slitMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0
    });
    
    const slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit1.position.set(-slitDistance/2, 0, -2);
    scene.add(slit1);
    
    const slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit2.position.set(slitDistance/2, 0, -2);
    scene.add(slit2);
    
    // Create detection screen
    const screenGeometry = new THREE.PlaneGeometry(5, 2);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 0);
    scene.add(screen);
    
    // Particles for wave visualization
    const particleCount = 200;
    const particles = new THREE.Group();
    scene.add(particles);
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4cc9f0,
            emissive: 0x4cc9f0
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.visible = false;
        particle.userData = {
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.01,
            amplitude: 0.1 + Math.random() * 0.1,
            slit: Math.random() > 0.5 ? 1 : 2
        };
        particles.add(particle);
    }
    
    let wavePattern = true;
    
    function showInterferencePattern() {
        particles.children.forEach((particle, i) => {
            if (particle.position.z > 0) {
                particle.position.set(
                    source.position.x, 
                    source.position.y, 
                    source.position.z
                );
                particle.visible = false;
            }
            
            if (Math.random() < 0.02 && !particle.visible) {
                particle.visible = true;
                if (wavePattern) {
                    // In wave pattern, particles go through both slits
                    particle.userData.slit = Math.random() > 0.5 ? 1 : 2;
                } else {
                    // In particle pattern, particles go through only one slit
                    particle.userData.chosenSlit = particle.userData.slit;
                }
            }
            
            if (particle.visible) {
                // Move from source to screen
                particle.position.z += particle.userData.speed;
                
                // Calculate path and interference
                if (particle.position.z < -2) {
                    // Before slits, straight path
                    particle.position.x = source.position.x;
                    particle.position.y = source.position.y;
                } else if (particle.position.z >= -2 && particle.position.z < 0) {
                    // Between slits and screen
                    if (wavePattern) {
                        // Wave interference pattern
                        const progress = (particle.position.z + 2) / 2; // 0 to 1
                        const slitPos = particle.userData.slit === 1 ? -slitDistance/2 : slitDistance/2;
                        
                        // Direction from slit
                        particle.position.x = slitPos + progress * (Math.sin(particle.userData.phase) * waveIntensity);
                        
                        // Add interference wave pattern
                        const wavePos = Math.sin(particle.position.x * 5 + particle.userData.phase) * 
                                        particle.userData.amplitude * progress;
                        particle.position.y = wavePos;
                    } else {
                        // Particle behavior - straight path from one slit
                        const progress = (particle.position.z + 2) / 2; // 0 to 1
                        const slitPos = particle.userData.chosenSlit === 1 ? -slitDistance/2 : slitDistance/2;
                        
                        // Slightly random path from the slit
                        if (!particle.userData.targetX) {
                            particle.userData.targetX = slitPos + (Math.random() - 0.5) * 1.5;
                        }
                        
                        particle.position.x = slitPos + (particle.userData.targetX - slitPos) * progress;
                        particle.position.y = (Math.random() - 0.5) * 0.1;
                    }
                }
            }
        });
    }
    
    currentAnimation = showInterferencePattern;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 1) {
            isInteracting = true;
            interactBtn.textContent = "Collapse Wave";
            wavePattern = false;
            
            // Clear current particles for new pattern
            particles.children.forEach(particle => {
                particle.visible = false;
            });
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 1) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            wavePattern = true;
            
            // Reset all particles
            particles.children.forEach(particle => {
                particle.visible = false;
                delete particle.userData.targetX;
            });
        }
    });
}

// Verse 2: Entangled particles
function createEntangledParticles() {
    const { particleDistance, connectionStrength, rotationSpeed } = config.verse2;
    
    // Create two entangled particles
    const particle1Geometry = new THREE.SphereGeometry(0.4, 32, 32);
    const particle1Material = new THREE.MeshStandardMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.5
    });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    particle1.position.set(-particleDistance/2, 0, 0);
    scene.add(particle1);
    
    const particle2Geometry = new THREE.SphereGeometry(0.4, 32, 32);
    const particle2Material = new THREE.MeshStandardMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5
    });
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    particle2.position.set(particleDistance/2, 0, 0);
    scene.add(particle2);
    
    // Create entanglement connection
    const points = [];
    points.push(new THREE.Vector3(-particleDistance/2, 0, 0));
    points.push(new THREE.Vector3(particleDistance/2, 0, 0));
    
    const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const connectionMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: connectionStrength,
        linewidth: 2
    });
    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
    scene.add(connection);
    
    // Create particle spin visualizers
    const arrow1Geometry = new THREE.ConeGeometry(0.2, 0.5, 16);
    const arrow1Material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const arrow1 = new THREE.Mesh(arrow1Geometry, arrow1Material);
    arrow1.position.set(0, 0.7, 0);
    arrow1.rotation.z = Math.PI;
    particle1.add(arrow1);
    
    const arrow2Geometry = new THREE.ConeGeometry(0.2, 0.5, 16);
    const arrow2Material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const arrow2 = new THREE.Mesh(arrow2Geometry, arrow2Material);
    arrow2.position.set(0, 0.7, 0);
    particle2.add(arrow2);
    
    // Particle spin states
    let particle1State = "up";
    let particle2State = "down";
    let measuredParticle = null;
    
    // Entanglement animation
    function animateEntanglement() {
        if (!measuredParticle) {
            // Rotate particles slowly to indicate quantum uncertainty
            particle1.rotation.y += rotationSpeed;
            particle2.rotation.y += rotationSpeed;
            
            // Make connection pulse
            const time = Date.now() * 0.001;
            connectionMaterial.opacity = connectionStrength * (0.5 + 0.5 * Math.sin(time * 2));
        } else {
            // After measurement, particles stop rotating
            // Connection becomes solid
            connectionMaterial.opacity = connectionStrength;
        }
        
        // Update connection position
        const positions = connection.geometry.attributes.position.array;
        positions[0] = particle1.position.x;
        positions[1] = particle1.position.y;
        positions[2] = particle1.position.z;
        positions[3] = particle2.position.x;
        positions[4] = particle2.position.y;
        positions[5] = particle2.position.z;
        connection.geometry.attributes.position.needsUpdate = true;
    }
    
    currentAnimation = animateEntanglement;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 2) {
            isInteracting = true;
            interactBtn.textContent = "Measured";
            
            // Measure the first particle
            measuredParticle = particle1;
            
            // First particle's state becomes fixed (determined randomly)
            particle1State = Math.random() > 0.5 ? "up" : "down";
            
            // Second particle's state becomes the opposite (entanglement)
            particle2State = particle1State === "up" ? "down" : "up";
            
            // Update visuals to match measured states
            if (particle1State === "up") {
                arrow1.rotation.z = Math.PI;
                particle1Material.color.set(0xf72585);
                particle1Material.emissive.set(0xf72585);
            } else {
                arrow1.rotation.z = 0;
                particle1Material.color.set(0x3a0ca3);
                particle1Material.emissive.set(0x3a0ca3);
            }
            
            if (particle2State === "up") {
                arrow2.rotation.z = Math.PI;
                particle2Material.color.set(0xf72585);
                particle2Material.emissive.set(0xf72585);
            } else {
                arrow2.rotation.z = 0;
                particle2Material.color.set(0x3a0ca3);
                particle2Material.emissive.set(0x3a0ca3);
            }
            
            // Stop rotation
            particle1.rotation.set(0, 0, 0);
            particle2.rotation.set(0, 0, 0);
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 2) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            measuredParticle = null;
            
            // Reset particles to initial state
            particle1Material.color.set(0xf72585);
            particle1Material.emissive.set(0xf72585);
            particle2Material.color.set(0x4cc9f0);
            particle2Material.emissive.set(0x4cc9f0);
            
            // Reset arrows
            arrow1.rotation.z = Math.PI;
            arrow2.rotation.z = 0;
        }
    });
}

// Verse 3: Wave collapse
function createWaveCollapse() {
    const { waveSpread, collapseRadius, waveColor } = config.verse3;
    
    // Create central point
    const centerGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({ 
        color: waveColor,
        emissive: waveColor,
        emissiveIntensity: 0.5
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(center);
    
    // Create wave particles
    const particles = new THREE.Group();
    scene.add(particles);
    
    for (let i = 0; i < 500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * waveSpread;
        
        const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({ 
            color: waveColor,
            emissive: waveColor,
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Initial positions in sphere
        particle.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * waveSpread,
            Math.sin(angle) * radius
        );
        
        particle.userData = {
            initialPosition: particle.position.clone(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.01
        };
        
        particles.add(particle);
    }
    
    let collapsing = false;
    let collapseTarget = new THREE.Vector3();
    let collapseProgress = 0;
    
    function animateWave() {
        const time = Date.now() * 0.001;
        
        if (collapsing) {
            // Animate collapse
            collapseProgress = Math.min(collapseProgress + 0.01, 1);
            
            particles.children.forEach((particle) => {
                // Move toward collapse point
                particle.position.lerp(collapseTarget, collapseProgress * 0.1);
                
                // Adjust opacity based on distance to center
                const distance = particle.position.distanceTo(collapseTarget);
                if (distance < collapseRadius) {
                    particle.material.opacity = 1.0;
                } else {
                    particle.material.opacity = Math.max(0, 1 - (distance - collapseRadius));
                }
            });
            
            // Pulse center point
            center.scale.set(
                1 + 0.2 * Math.sin(time * 10),
                1 + 0.2 * Math.sin(time * 10),
                1 + 0.2 * Math.sin(time * 10)
            );
        } else {
            // Animate wave
            particles.children.forEach((particle) => {
                // Wave motion
                const offset = Math.sin(time * 2 + particle.userData.phase) * 0.1;
                
                particle.position.x = particle.userData.initialPosition.x * (1 + offset);
                particle.position.y = particle.userData.initialPosition.y * (1 + offset);
                particle.position.z = particle.userData.initialPosition.z * (1 + offset);
                
                // Pulse opacity with distance from center
                const distance = particle.position.length();
                particle.material.opacity = 0.7 + 0.3 * Math.sin(time * 3 + distance);
            });
            
            // Subtle pulse for center
            center.scale.set(
                1 + 0.1 * Math.sin(time * 3),
                1 + 0.1 * Math.sin(time * 3),
                1 + 0.1 * Math.sin(time * 3)
            );
        }
    }
    
    currentAnimation = animateWave;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 3) {
            isInteracting = true;
            interactBtn.textContent = "Collapsing";
            
            // Set random collapse point
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * waveSpread * 0.7;
            collapseTarget.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * waveSpread * 0.5,
                Math.sin(angle) * radius
            );
            
            // Move center to collapse point
            center.position.copy(collapseTarget);
            
            // Start collapse
            collapsing = true;
            collapseProgress = 0;
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 3) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset
            collapsing = false;
            collapseProgress = 0;
            center.position.set(0, 0, 0);
            
            // Reset particles
            particles.children.forEach((particle) => {
                particle.material.opacity = 0.7;
            });
        }
    });
}

// Verse 4: Uncertainty principle
function createUncertaintyPrinciple() {
    const { initialUncertainty, maxPrecision, particleSize } = config.verse4;
    
    // Create particle
    const particleGeometry = new THREE.SphereGeometry(particleSize, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    
    // Create position uncertainty visualization
    const positionUncertaintyGeometry = new THREE.SphereGeometry(1, 32, 32);
    const positionUncertaintyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a0ca3,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const positionUncertainty = new THREE.Mesh(positionUncertaintyGeometry, positionUncertaintyMaterial);
    positionUncertainty.scale.set(initialUncertainty, initialUncertainty, initialUncertainty);
    scene.add(positionUncertainty);
    
    // Create momentum uncertainty visualization
    const momentumArrows = new THREE.Group();
    scene.add(momentumArrows);
    
    const arrowCount = 12;
    for (let i = 0; i < arrowCount; i++) {
        const angle = (i / arrowCount) * Math.PI * 2;
        
        const arrowGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xf72585,
            transparent: true,
            opacity: 0.7
        });
        
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.set(
            Math.cos(angle) * 1.5,
            0,
            Math.sin(angle) * 1.5
        );
        arrow.rotation.x = Math.PI/2;
        arrow.rotation.y = angle;
        
        // Cone at arrow end
        const coneGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
        const coneMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xf72585,
            transparent: true,
            opacity: 0.7
        });
        
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(0, 0.6, 0);
        arrow.add(cone);
        
        arrow.scale.y = (1 / initialUncertainty) * 0.5;
        
        momentumArrows.add(arrow);
    }
    
    let currentUncertainty = initialUncertainty;
    let uncertaintyDirection = -1; // -1 decreasing position uncertainty, 1 increasing
    
    function animateUncertainty() {
        const time = Date.now() * 0.001;
        
        // Update uncertainty if interacting
        if (isInteracting) {
            currentUncertainty += uncertaintyDirection * 0.01;
            
            // Limit to range
            if (currentUncertainty < maxPrecision) {
                currentUncertainty = maxPrecision;
                uncertaintyDirection = 1;
            } else if (currentUncertainty > initialUncertainty * 1.5) {
                currentUncertainty = initialUncertainty * 1.5;
                uncertaintyDirection = -1;
            }
            
            // Update position uncertainty visualization
            positionUncertainty.scale.set(
                currentUncertainty,
                currentUncertainty,
                currentUncertainty
            );
            
            // Update momentum uncertainty visualization (inverse relationship)
            const momentumScale = (1 / currentUncertainty) * 0.5;
            momentumArrows.children.forEach(arrow => {
                arrow.scale.y = momentumScale;
            });
        }
        
        // Particle movement (more precise position = less precise momentum)
        particle.position.set(
            (Math.sin(time) * 0.1) * currentUncertainty,
            (Math.cos(time * 1.3) * 0.1) * currentUncertainty,
            (Math.sin(time * 0.7) * 0.1) * currentUncertainty
        );
        
        // Visualize position uncertainty with slight pulsing
        positionUncertainty.material.opacity = 0.2 + 0.1 * Math.sin(time * 2);
        
        // Rotate momentum arrows
        momentumArrows.rotation.y += 0.005 * (1 / currentUncertainty);
    }
    
    currentAnimation = animateUncertainty;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 4) {
            isInteracting = true;
            interactBtn.textContent = "Adjusting Precision";
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 4) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset uncertainty
            currentUncertainty = initialUncertainty;
            uncertaintyDirection = -1;
            
            // Reset visualizations
            positionUncertainty.scale.set(
                currentUncertainty,
                currentUncertainty,
                currentUncertainty
            );
            
            // Reset momentum arrows
            const momentumScale = (1 / currentUncertainty) * 0.5;
            momentumArrows.children.forEach(arrow => {
                arrow.scale.y = momentumScale;
            });
        }
    });
}

// Verse 5: Superposition states
function createSuperpositionStates() {
    const { stateDistance, oscillationSpeed, collapseTime } = config.verse5;
    
    // Create bound state
    const boundGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 64, 8, 2, 3);
    const boundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff3366,
        emissive: 0xff3366,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    const boundState = new THREE.Mesh(boundGeometry, boundMaterial);
    boundState.position.set(-stateDistance/2, 0, 0);
    scene.add(boundState);
    
    // Create free state
    const freeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const freeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x33ff99,
        emissive: 0x33ff99,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    const freeState = new THREE.Mesh(freeGeometry, freeMaterial);
    freeState.position.set(stateDistance/2, 0, 0);
    scene.add(freeState);
    
    // Create superposition particle
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(0, 0, 0);
    scene.add(particle);
    
    // Add trails for particle
    const trailToFree = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ 
            color: 0x33ff99,
            transparent: true,
            opacity: 0.5
        })
    );
    scene.add(trailToFree);
    
    const trailToBound = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ 
            color: 0xff3366,
            transparent: true,
            opacity: 0.5
        })
    );
    scene.add(trailToBound);
    
    let collapsing = false;
    let collapseTarget = null;
    let collapseStartTime = 0;
    
    function updateTrails() {
        // Update trails to connect particle to states
        const pointsToFree = [];
        pointsToFree.push(particle.position.clone());
        pointsToFree.push(freeState.position.clone());
        
        const pointsToBound = [];
        pointsToBound.push(particle.position.clone());
        pointsToBound.push(boundState.position.clone());
        
        trailToFree.geometry.dispose();
        trailToFree.geometry = new THREE.BufferGeometry().setFromPoints(pointsToFree);
        
        trailToBound.geometry.dispose();
        trailToBound.geometry = new THREE.BufferGeometry().setFromPoints(pointsToBound);
    }
    
    function animateSuperposition() {
        const time = Date.now() * 0.001;
        
        // Animate states
        boundState.rotation.x = time * 0.5;
        boundState.rotation.y = time * 0.3;
        
        freeState.rotation.x = time * 0.3;
        freeState.rotation.y = time * 0.5;
        
        if (collapsing) {
            const elapsed = Date.now() - collapseStartTime;
            const progress = Math.min(elapsed / collapseTime, 1);
            
            // Move particle toward target state
            particle.position.lerp(collapseTarget.position, progress * 0.05);
            
            // Color shifting
            const targetColor = collapseTarget === boundState ? 
                new THREE.Color(0xff3366) : new THREE.Color(0x33ff99);
            
            particleMaterial.color.lerp(targetColor, progress * 0.05);
            particleMaterial.emissive.lerp(targetColor, progress * 0.05);
            
            // Fade out the other trail
            if (collapseTarget === boundState) {
                trailToFree.material.opacity = Math.max(0, 0.5 - progress * 0.5);
                trailToBound.material.opacity = 0.5;
            } else {
                trailToBound.material.opacity = Math.max(0, 0.5 - progress * 0.5);
                trailToFree.material.opacity = 0.5;
            }
            
            // Complete collapse
            if (progress >= 1) {
                collapsing = false;
                
                // Hide unused trail
                if (collapseTarget === boundState) {
                    trailToFree.visible = false;
                } else {
                    trailToBound.visible = false;
                }
            }
        } else if (!isInteracting) {
            // Oscillate between states
            particle.position.x = Math.sin(time * oscillationSpeed) * stateDistance/2;
            
            // Blend color based on position
            const blendFactor = (particle.position.x + stateDistance/2) / stateDistance;
            particleMaterial.color.set(0xffffff);
            particleMaterial.emissive.set(0xffffff);
            
            // Update trail opacity based on position
            trailToFree.material.opacity = 0.5 - 0.4 * (1 - blendFactor);
            trailToBound.material.opacity = 0.5 - 0.4 * blendFactor;
            
            // Make sure both trails are visible
            trailToFree.visible = true;
            trailToBound.visible = true;
        }
        
        // Update trails
        updateTrails();
    }
    
    currentAnimation = animateSuperposition;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 5) {
            isInteracting = true;
            interactBtn.textContent = "Measuring";
            
            // Collapse to random state
            collapseTarget = Math.random() > 0.5 ? boundState : freeState;
            collapsing = true;
            collapseStartTime = Date.now();
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 5) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset
            collapsing = false;
            
            // Reset particle
            particle.position.set(0, 0, 0);
            particleMaterial.color.set(0xffffff);
            particleMaterial.emissive.set(0xffffff);
            
            // Reset trails
            trailToFree.material.opacity = 0.5;
            trailToBound.material.opacity = 0.5;
            trailToFree.visible = true;
            trailToBound.visible = true;
            updateTrails();
        }
    });
}

// Verse 6: Observer effect
function createObserverEffect() {
    const { observerDistance, waveComplexity, collapseDelay } = config.verse6;
    
    // Create wave function
    const wavePoints = [];
    const waveSegments = 100;
    const waveWidth = 4;
    
    for (let i = 0; i <= waveSegments; i++) {
        const x = (i / waveSegments) * waveWidth - waveWidth/2;
        wavePoints.push(new THREE.Vector3(x, 0, 0));
    }
    
    const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4cc9f0,
        linewidth: 2
    });
    const wave = new THREE.Line(waveGeometry, waveMaterial);
    scene.add(wave);
    
    // Create observer
    const observerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const observerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.5
    });
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.position.set(0, 0, observerDistance);
    scene.add(observer);
    
    // Add eye to observer
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff
    });
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(0, 0, 0.2);
    observer.add(eye);
    
    // Add pupil to eye
    const pupilGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000
    });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.set(0, 0, 0.05);
    eye.add(pupil);
    
    // Add "observation" ray
    const rayGeometry = new THREE.CylinderGeometry(0.01, 0.01, observerDistance, 8);
    const rayMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf72585,
        transparent: true,
        opacity: 0,
        emissive: 0xf72585
    });
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    ray.position.set(0, 0, observerDistance/2);
    ray.rotation.x = Math.PI/2;
    scene.add(ray);
    
    let observing = false;
    let observationStartTime = 0;
    let observationPoint = 0;
    
    function animateObserverEffect() {
        const time = Date.now() * 0.001;
        
        // Update wave function
        const positions = wave.geometry.attributes.position.array;
        
        for (let i = 0; i <= waveSegments; i++) {
            const x = (i / waveSegments) * waveWidth - waveWidth/2;
            
            if (observing) {
                const elapsed = Date.now() - observationStartTime;
                
                if (elapsed < collapseDelay) {
                    // Wave still moving before collapse
                    positions[i * 3 + 1] = Math.sin(x * waveComplexity + time * 2) * 0.5;
                } else {
                    // Begin collapse
                    const collapseProgress = Math.min((elapsed - collapseDelay) / 1000, 1);
                    const distance = Math.abs(x - observationPoint);
                    const collapseFactor = Math.min(distance * 5, 1);
                    
                    // Wave gradually collapses to a spike at observation point
                    const uncollapsedHeight = Math.sin(x * waveComplexity + time * 2) * 0.5;
                    const collapsedHeight = x === observationPoint ? 1 : 0;
                    
                    positions[i * 3 + 1] = uncollapsedHeight * (1 - collapseProgress * collapseFactor) + 
                                          collapsedHeight * collapseProgress * (1 - collapseFactor);
                }
            } else {
                // Normal wave motion
                positions[i * 3 + 1] = Math.sin(x * waveComplexity + time * 2) * 0.5;
            }
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
        
        // Update observer
        if (!observing) {
            // Observer moves back and forth slightly
            observer.position.x = Math.sin(time * 0.5) * 1;
        } else {
            // Observer looks at observation point
            observer.lookAt(new THREE.Vector3(observationPoint, 0, 0));
            
            // Update ray
            ray.position.set(
                (observer.position.x + observationPoint) / 2,
                0,
                observer.position.z / 2
            );
            ray.scale.y = observer.position.distanceTo(new THREE.Vector3(observationPoint, 0, 0));
            ray.lookAt(new THREE.Vector3(observationPoint, 0, 0));
            
            // Make ray visible during observation
            const elapsed = Date.now() - observationStartTime;
            if (elapsed > collapseDelay / 2) {
                ray.material.opacity = Math.min((elapsed - collapseDelay/2) / 500, 0.7);
            }
        }
    }
    
    currentAnimation = animateObserverEffect;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 6) {
            isInteracting = true;
            interactBtn.textContent = "Observing";
            
            // Start observation
            observing = true;
            observationStartTime = Date.now();
            
            // Choose a random point to observe
            observationPoint = (Math.random() - 0.5) * 3;
            
            // Freeze observer position
            observer.position.x = Math.random() * 2 - 1;
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 6) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset
            observing = false;
            ray.material.opacity = 0;
        }
    });
}

// Verse 7: Timeless entanglement
function createTimelessEntanglement() {
    const { particleSize, correlationSpeed, spinRate } = config.verse7;
    
    // Create entangled particles
    const particle1Geometry = new THREE.SphereGeometry(particleSize, 32, 32);
    const particle1Material = new THREE.MeshStandardMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.5
    });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    particle1.position.set(-2, 0, 0);
    scene.add(particle1);
    
    const particle2Geometry = new THREE.SphereGeometry(particleSize, 32, 32);
    const particle2Material = new THREE.MeshStandardMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5
    });
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    particle2.position.set(2, 0, 0);
    scene.add(particle2);
    
    // Add spin visualizers
    const ring1Geometry = new THREE.TorusGeometry(0.6, 0.05, 16, 100);
    const ring1Material = new THREE.MeshStandardMaterial({ 
        color: 0xf72585,
        transparent: true,
        opacity: 0.7
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    particle1.add(ring1);
    
    const ring2Geometry = new THREE.TorusGeometry(0.6, 0.05, 16, 100);
    const ring2Material = new THREE.MeshStandardMaterial({ 
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.7
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    particle2.add(ring2);
    
    // Add arrow indicators for spin
    const arrow1Geometry = new THREE.ConeGeometry(0.15, 0.3, 16);
    const arrow1Material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff
    });
    const arrow1 = new THREE.Mesh(arrow1Geometry, arrow1Material);
    arrow1.position.set(0, 0.6, 0);
    particle1.add(arrow1);
    
    const arrow2Geometry = new THREE.ConeGeometry(0.15, 0.3, 16);
    const arrow2Material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff
    });
    const arrow2 = new THREE.Mesh(arrow2Geometry, arrow2Material);
    arrow2.position.set(0, 0.6, 0);
    particle2.add(arrow2);
    
    // Create entanglement visualization
    const entanglementGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(2, 0, 0)
        ]),
        64, // path segments
        0.05, // tube radius
        8, // tubular segments
        false // closed
    );
    
    const entanglementMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        emissive: 0xffffff,
        emissiveIntensity: 0.2
    });
    
    const entanglement = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
    scene.add(entanglement);
    
    // Variables for state
    let particleStates = {
        particle1: "undetermined",
        particle2: "undetermined"
    };
    
    let spinDirections = {
        particle1: 1,
        particle2: -1
    };
    
    let measuredParticle = null;
    let correlationEffect = null;
    
    function animateEntanglement() {
        const time = Date.now() * 0.001;
        
        // Rotate rings to indicate spin
        ring1.rotation.x = Math.PI/2;
        ring1.rotation.z += spinRate * spinDirections.particle1;
        
        ring2.rotation.x = Math.PI/2;
        ring2.rotation.z += spinRate * spinDirections.particle2;
        
        // Before measurement, particles spin in uncertainty
        if (!measuredParticle) {
            particle1.rotation.y += spinRate * 0.5;
            particle2.rotation.y += spinRate * 0.5;
            
            // Pulsing entanglement
            entanglementMaterial.opacity = 0.3 + 0.2 * Math.sin(time * 2);
        } else {
            // After measurement, correlate states
            if (correlationEffect) {
                correlationEffect();
            }
        }
    }
    
    currentAnimation = animateEntanglement;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 7) {
            isInteracting = true;
            interactBtn.textContent = "Measured";
            
            // Choose which particle to measure
            measuredParticle = Math.random() > 0.5 ? particle1 : particle2;
            
            // Determine measured state randomly
            const measuredState = Math.random() > 0.5 ? "up" : "down";
            
            // Set measured particle state
            if (measuredParticle === particle1) {
                particleStates.particle1 = measuredState;
                particleStates.particle2 = measuredState === "up" ? "down" : "up";
                
                // Adjust spin direction
                spinDirections.particle1 = measuredState === "up" ? 1 : -1;
                spinDirections.particle2 = -spinDirections.particle1;
                
                // Adjust arrow
                arrow1.rotation.x = measuredState === "up" ? 0 : Math.PI;
                
                // Create correlation effect
                const startTime = Date.now();
                correlationEffect = function() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / 1000, 1); // 1 second transition
                    
                    // Make entanglement pulse from particle1 to particle2
                    const pulsePos = Math.min(progress * 2, 1); // Pulse moves in 0.5 seconds
                    
                    entanglementMaterial.opacity = 0.3 + 0.5 * (1 - Math.abs(pulsePos - 0.5) * 2);
                    entanglementMaterial.emissiveIntensity = 0.2 + 0.8 * (1 - Math.abs(pulsePos - 0.5) * 2);
                    
                    // Rotate second particle to correct orientation gradually
                    if (progress > 0.5) {
                        const rotationProgress = (progress - 0.5) * 2; // 0 to 1 in second half
                        arrow2.rotation.x = particleStates.particle2 === "up" ? 
                            0 * rotationProgress + (1 - rotationProgress) * arrow2.rotation.x : 
                            Math.PI * rotationProgress + (1 - rotationProgress) * arrow2.rotation.x;
                        
                        // Stop particle2 rotation
                        particle2.rotation.y *= (1 - rotationProgress * 0.1);
                    }
                    
                    // Stop effect when complete
                    if (progress >= 1) {
                        correlationEffect = null;
                        arrow2.rotation.x = particleStates.particle2 === "up" ? 0 : Math.PI;
                    }
                };
            } else {
                particleStates.particle2 = measuredState;
                particleStates.particle1 = measuredState === "up" ? "down" : "up";
                
                // Adjust spin direction
                spinDirections.particle2 = measuredState === "up" ? 1 : -1;
                spinDirections.particle1 = -spinDirections.particle2;
                
                // Adjust arrow
                arrow2.rotation.x = measuredState === "up" ? 0 : Math.PI;
                
                // Create correlation effect
                const startTime = Date.now();
                correlationEffect = function() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / 1000, 1); // 1 second transition
                    
                    // Make entanglement pulse from particle2 to particle1
                    const pulsePos = Math.min(progress * 2, 1); // Pulse moves in 0.5 seconds
                    
                    entanglementMaterial.opacity = 0.3 + 0.5 * (1 - Math.abs(pulsePos - 0.5) * 2);
                    entanglementMaterial.emissiveIntensity = 0.2 + 0.8 * (1 - Math.abs(pulsePos - 0.5) * 2);
                    
                    // Rotate first particle to correct orientation gradually
                    if (progress > 0.5) {
                        const rotationProgress = (progress - 0.5) * 2; // 0 to 1 in second half
                        arrow1.rotation.x = particleStates.particle1 === "up" ? 
                            0 * rotationProgress + (1 - rotationProgress) * arrow1.rotation.x : 
                            Math.PI * rotationProgress + (1 - rotationProgress) * arrow1.rotation.x;
                        
                        // Stop particle1 rotation
                        particle1.rotation.y *= (1 - rotationProgress * 0.1);
                    }
                    
                    // Stop effect when complete
                    if (progress >= 1) {
                        correlationEffect = null;
                        arrow1.rotation.x = particleStates.particle1 === "up" ? 0 : Math.PI;
                    }
                };
            }
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 7) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset states
            particleStates.particle1 = "undetermined";
            particleStates.particle2 = "undetermined";
            measuredParticle = null;
            correlationEffect = null;
            
            // Reset visuals
            particle1.rotation.set(0, 0, 0);
            particle2.rotation.set(0, 0, 0);
            arrow1.rotation.set(0, 0, 0);
            arrow2.rotation.set(0, 0, 0);
            
            entanglementMaterial.opacity = 0.3;
            entanglementMaterial.emissiveIntensity = 0.2;
        }
    });
}

// Verse 8: Bound/Free Paradox
function createBoundFreeParadox() {
    const { stateBlendFactor, transitionSpeed, boundColor, freeColor } = config.verse8;
    
    // Create main particle
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    
    // Create bound state visualization (cage)
    const cageRadius = 1.5;
    const cageGroup = new THREE.Group();
    scene.add(cageGroup);
    
    // Create circular bars for cage
    const barCount = 8;
    for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        
        const circleGeometry = new THREE.TorusGeometry(cageRadius, 0.05, 16, 50, Math.PI);
        const circleMaterial = new THREE.MeshStandardMaterial({ 
            color: boundColor,
            transparent: true,
            opacity: 0.7
        });
        
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.rotation.y = angle;
        circle.rotation.x = Math.PI/2;
        
        cageGroup.add(circle);
    }
    
    // Create free state visualization (flowing ribbons)
    const ribbonsGroup = new THREE.Group();
    scene.add(ribbonsGroup);
    
    const ribbonCount = 5;
    for (let i = 0; i < ribbonCount; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2 + Math.random() * 4, -1 + Math.random() * 2, -1 + Math.random() * 2),
            new THREE.Vector3(-2 + Math.random() * 4, -1 + Math.random() * 2, -1 + Math.random() * 2),
            new THREE.Vector3(-2 + Math.random() * 4, -1 + Math.random() * 2, -1 + Math.random() * 2),
            new THREE.Vector3(-2 + Math.random() * 4, -1 + Math.random() * 2, -1 + Math.random() * 2)
        ]);
        
        curve.closed = true;
        
        const ribbonGeometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, true);
        const ribbonMaterial = new THREE.MeshStandardMaterial({ 
            color: freeColor,
            transparent: true,
            opacity: 0.7
        });
        
        const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbonsGroup.add(ribbon);
    }
    
    let stateFactor = 0.5; // 0 = fully bound, 1 = fully free
    let measuredState = null;
    let collapseStartTime = 0;
    
    function animateParadox() {
        const time = Date.now() * 0.001;
        
        if (measuredState) {
            // After measurement, collapse to one state
            const elapsed = Date.now() - collapseStartTime;
            const progress = Math.min(elapsed / 1000, 1); // 1 second transition
            
            if (measuredState === "bound") {
                // Collapse to bound state
                stateFactor = Math.max(0, stateFactor - progress * 0.05);
                
                // Shrink ribbons
                ribbonsGroup.scale.set(
                    1 - progress,
                    1 - progress,
                    1 - progress
                );
                
                // Highlight cage
                cageGroup.children.forEach(bar => {
                    bar.material.opacity = 0.7 + 0.3 * progress;
                    bar.material.emissiveIntensity = progress * 0.5;
                });
                
                // Center particle
                particle.position.set(
                    particle.position.x * (1 - progress * 0.1),
                    particle.position.y * (1 - progress * 0.1),
                    particle.position.z * (1 - progress * 0.1)
                );
                
                // Change particle color
                particleMaterial.color.lerp(new THREE.Color(boundColor), progress * 0.1);
                particleMaterial.emissive.lerp(new THREE.Color(boundColor), progress * 0.1);
            } else {
                // Collapse to free state
                stateFactor = Math.min(1, stateFactor + progress * 0.05);
                
                // Expand ribbons
                ribbonsGroup.scale.set(
                    1 + progress * 0.5,
                    1 + progress * 0.5,
                    1 + progress * 0.5
                );
                
                // Fade cage
                cageGroup.children.forEach(bar => {
                    bar.material.opacity = Math.max(0, 0.7 - progress * 0.7);
                });
                
                // Move particle in free motion
                if (progress > 0.5) {
                    particle.position.x += Math.sin(time * 2) * 0.01;
                    particle.position.y += Math.cos(time * 1.5) * 0.01;
                    particle.position.z += Math.sin(time * 1.7) * 0.01;
                }
                
                // Change particle color
                particleMaterial.color.lerp(new THREE.Color(freeColor), progress * 0.1);
                particleMaterial.emissive.lerp(new THREE.Color(freeColor), progress * 0.1);
            }
        } else {
            // In superposition - oscillate between bound and free
            stateFactor = 0.5 + 0.5 * Math.sin(time * transitionSpeed);
            
            // Animate cage
            cageGroup.rotation.y = time * 0.2;
            cageGroup.scale.set(
                1 + 0.1 * Math.sin(time),
                1 + 0.1 * Math.sin(time),
                1 + 0.1 * Math.sin(time)
            );
            
            // Fade cage based on state
            cageGroup.children.forEach(bar => {
                bar.material.opacity = 0.7 * (1 - stateFactor * 0.7);
            });
            
            // Animate ribbons
            ribbonsGroup.rotation.y = -time * 0.1;
            ribbonsGroup.rotation.x = Math.sin(time * 0.2) * 0.1;
            
            // Scale ribbons based on state
            ribbonsGroup.scale.set(
                0.5 + stateFactor * 0.5,
                0.5 + stateFactor * 0.5,
                0.5 + stateFactor * 0.5
            );
            
            // Particle position - confined when bound, free when not
            particle.position.x = Math.sin(time) * stateFactor * 0.7;
            particle.position.y = Math.cos(time * 1.3) * stateFactor * 0.5;
            particle.position.z = Math.sin(time * 0.7) * stateFactor * 0.6;
            
            // Blend particle color
            const blendedColor = new THREE.Color(boundColor).lerp(new THREE.Color(freeColor), stateFactor);
            particleMaterial.color.lerp(blendedColor, 0.05);
            particleMaterial.emissive.lerp(blendedColor, 0.05);
        }
    }
    
    currentAnimation = animateParadox;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (!isInteracting && currentVerse === 8) {
            isInteracting = true;
            interactBtn.textContent = "Collapsing";
            
            // Choose a state to collapse to
            measuredState = Math.random() > 0.5 ? "bound" : "free";
            collapseStartTime = Date.now();
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 8) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset state
            measuredState = null;
            stateFactor = 0.5;
            
            // Reset visuals
            particle.position.set(0, 0, 0);
            particleMaterial.color.set(0xffffff);
            particleMaterial.emissive.set(0xffffff);
            
            ribbonsGroup.scale.set(1, 1, 1);
            cageGroup.scale.set(1, 1, 1);
            
            cageGroup.children.forEach(bar => {
                bar.material.opacity = 0.7;
                bar.material.emissiveIntensity = 0;
            });
        }
    });
}

// Verse 9: Quantum Zeno effect
function createQuantumZenoEffect() {
    const { freezeThreshold, decayRate, measurementEffect } = config.verse9;
    
    // Create central particle
    const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    
    // Create target state visualization
    const targetGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const targetMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf72585,
        emissive: 0xf72585,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(2, 0, 0);
    scene.add(target);
    
    // Create transition path
    const pathGeometry = new THREE.TubeGeometry(
        new THREE.LineCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 0, 0)
        ),
        20, // path segments
        0.05, // tube radius
        8, // tubular segments
        false // closed
    );
    
    const pathMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);
    
    // Create measurement visualization
    const measurementGeometry = new THREE.RingGeometry(0.8, 1, 32);
    const measurementMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffcc00,
        emissive: 0xffcc00,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
    });
    const measurement = new THREE.Mesh(measurementGeometry, measurementMaterial);
    measurement.rotation.x = Math.PI/2;
    scene.add(measurement);
    
    let transitionProgress = 0;
    let isFrozen = false;
    let measurementCount = 0;
    let lastMeasurementTime = 0;
    
    function animateQuantumZeno() {
        const time = Date.now() * 0.001;
        
        // Normal state transition when not frozen
        if (!isFrozen) {
            transitionProgress += decayRate * 0.01;
            
            // Cap at 1 (complete transition)
            transitionProgress = Math.min(transitionProgress, 1);
            
            // Move particle along path
            particle.position.x = transitionProgress * 2;
            
            // Blend particle color toward target
            particleMaterial.color.lerp(targetMaterial.color, transitionProgress * 0.01);
            particleMaterial.emissive.lerp(targetMaterial.emissive, transitionProgress * 0.01);
            
            // Update path opacity
            pathMaterial.opacity = 0.3 * (1 - transitionProgress);
        }
        
        // Fade measurement effect
        if (measurement.material.opacity > 0) {
            measurement.material.opacity -= 0.02;
            measurement.scale.x += 0.03;
            measurement.scale.y += 0.03;
            measurement.scale.z += 0.03;
            
            // Position measurement at particle
            measurement.position.copy(particle.position);
        }
        
        // Pulse target
        target.scale.set(
            1 + 0.1 * Math.sin(time * 3),
            1 + 0.1 * Math.sin(time * 3),
            1 + 0.1 * Math.sin(time * 3)
        );
        
        // Check if state is frozen by frequent measurements
        if (measurementCount >= freezeThreshold) {
            isFrozen = true;
            
            // Visual indicator for frozen state
            if (time % 1 < 0.5) {
                particleMaterial.emissiveIntensity = 0.5 + 0.3 * Math.sin(time * 10);
            }
        } else {
            isFrozen = false;
            particleMaterial.emissiveIntensity = 0.5;
        }
        
        // Decay measurement count over time
        if (Date.now() - lastMeasurementTime > 2000 && measurementCount > 0) {
            measurementCount--;
            lastMeasurementTime = Date.now();
        }
    }
    
    currentAnimation = animateQuantumZeno;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (currentVerse === 9) {
            // Each click is a measurement
            measurementCount = Math.min(measurementCount + 1, freezeThreshold + 2);
            lastMeasurementTime = Date.now();
            
            // Reset progress a little (measurement collapses to initial state)
            transitionProgress = Math.max(0, transitionProgress - measurementEffect);
            
            // Update position immediately
            particle.position.x = transitionProgress * 2;
            
            // Visual effect for measurement
            measurement.material.opacity = 0.8;
            measurement.position.copy(particle.position);
            measurement.scale.set(1, 1, 1);
            
            // Update button text
            if (measurementCount >= freezeThreshold) {
                interactBtn.textContent = "Frozen: " + measurementCount;
            } else {
                interactBtn.textContent = "Measure: " + measurementCount;
            }
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 9) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset state
            transitionProgress = 0;
            isFrozen = false;
            measurementCount = 0;
            
            // Reset visuals
            particle.position.set(0, 0, 0);
            particleMaterial.color.set(0x4cc9f0);
            particleMaterial.emissive.set(0x4cc9f0);
            particleMaterial.emissiveIntensity = 0.5;
            
            pathMaterial.opacity = 0.3;
            measurement.material.opacity = 0;
        }
    });
}

// Verse 10: Quantum contextuality
function createQuantumContextuality() {
    const { perspectiveCount, rotationAngle, transitionTime } = config.verse10;
    
    // Create central particle
    const particleGeometry = new THREE.OctahedronGeometry(0.5, 0);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    
    // Create perspective frames
    const perspectives = [];
    
    for (let i = 0; i < perspectiveCount; i++) {
        const angle = (i / perspectiveCount) * Math.PI * 2;
        
        // Create perspective container
        const perspective = new THREE.Group();
        perspective.position.set(
            Math.cos(angle) * 3,
            0,
            Math.sin(angle) * 3
        );
        perspective.lookAt(0, 0, 0);
        scene.add(perspective);
        
        // Add frame
        const frameGeometry = new THREE.TorusGeometry(1, 0.05, 16, 50);
        const frameMaterial = new THREE.MeshStandardMaterial({ 
            color: [0x4cc9f0, 0xf72585, 0x7209b7][i % 3],
            transparent: true,
            opacity: 0.7
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.rotation.y = Math.PI/2;
        perspective.add(frame);
        
        // Add directional arrow
        const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 16);
        const arrowMaterial = new THREE.MeshStandardMaterial({ 
            color: frameMaterial.color,
            transparent: true,
            opacity: 0.9
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.set(0, 1.3, 0);
        perspective.add(arrow);
        
        // Add to list
        perspectives.push({
            group: perspective,
            frame: frame,
            arrow: arrow,
            color: new THREE.Color(frameMaterial.color.getHex())
        });
    }
    
    // Create visualization of measurement outcomes
    const outcomesGroup = new THREE.Group();
    scene.add(outcomesGroup);
    
    for (let i = 0; i < perspectiveCount; i++) {
        const outcomeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const outcomeMaterial = new THREE.MeshStandardMaterial({ 
            color: perspectives[i].color,
            transparent: true,
            opacity: 0,
            emissive: perspectives[i].color,
            emissiveIntensity: 0.5
        });
        const outcome = new THREE.Mesh(outcomeGeometry, outcomeMaterial);
        
        // Position outcomes in a circle around the particle
        const angle = (i / perspectiveCount) * Math.PI * 2;
        outcome.position.set(
            Math.cos(angle) * 1.5,
            0,
            Math.sin(angle) * 1.5
        );
        
        outcomesGroup.add(outcome);
    }
    
    let currentPerspective = null;
    let activePerspectiveIndex = -1;
    let transitionStartTime = 0;
    
    function animateContextuality() {
        const time = Date.now() * 0.001;
        
        // Rotate particle slowly
        particle.rotation.x = time * 0.2;
        particle.rotation.y = time * 0.3;
        particle.rotation.z = time * 0.1;
        
        // Animate perspectives
        perspectives.forEach((perspective, i) => {
            // Make frames pulse slightly
            perspective.frame.scale.set(
                1 + 0.05 * Math.sin(time * 2 + i),
                1 + 0.05 * Math.sin(time * 2 + i),
                1 + 0.05 * Math.sin(time * 2 + i)
            );
            
            // If this is active perspective
            if (currentPerspective === perspective) {
                const elapsed = Date.now() - transitionStartTime;
                const progress = Math.min(elapsed / transitionTime, 1);
                
                // Highlight active perspective
                perspective.frame.material.opacity = 0.7 + 0.3 * progress;
                perspective.frame.material.emissiveIntensity = 0.3 * progress;
                
                // Move camera toward this perspective
                const cameraTarget = new THREE.Vector3();
                perspective.group.getWorldPosition(cameraTarget);
                cameraTarget.multiplyScalar(0.6); // Don't go all the way
                
                camera.position.lerp(cameraTarget, 0.02);
                camera.lookAt(0, 0, 0);
                
                // Show measurement outcome
                if (progress > 0.5) {
                    outcomesGroup.children[i].material.opacity = 
                        Math.min(1, (progress - 0.5) * 2);
                    
                    // Adjust particle color to match this perspective's color
                    particleMaterial.color.lerp(perspective.color, 0.02);
                    particleMaterial.emissive.lerp(perspective.color, 0.02);
                }
            } else {
                // Dim inactive perspectives
                perspective.frame.material.opacity = 0.7;
                perspective.frame.material.emissiveIntensity = 0;
                
                // Hide their outcomes
                if (currentPerspective && i !== activePerspectiveIndex) {
                    outcomesGroup.children[i].material.opacity *= 0.95;
                }
            }
        });
    }
    
    currentAnimation = animateContextuality;
    
    // Interaction behavior
    interactBtn.addEventListener('click', function() {
        if (currentVerse === 10) {
            // Choose a random perspective
            activePerspectiveIndex = (activePerspectiveIndex + 1 + Math.floor(Math.random() * (perspectiveCount - 1))) % perspectiveCount;
            currentPerspective = perspectives[activePerspectiveIndex];
            transitionStartTime = Date.now();
            
            // Update button
            interactBtn.textContent = `Perspective ${activePerspectiveIndex + 1}`;
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (currentVerse === 10) {
            isInteracting = false;
            interactBtn.textContent = "Interact";
            
            // Reset state
            currentPerspective = null;
            activePerspectiveIndex = -1;
            
            // Reset camera
            camera.position.set(0, 0, 5);
            
            // Reset visuals
            particleMaterial.color.set(0xffffff);
            particleMaterial.emissive.set(0xffffff);
            
            // Hide all outcomes
            outcomesGroup.children.forEach(outcome => {
                outcome.material.opacity = 0;
            });
        }
    });
}

// Navigation
prevBtn.addEventListener('click', function() {
    if (currentVerse > 1) {
        currentVerse--;
        loadVerseContent(currentVerse);
    }
});

nextBtn.addEventListener('click', function() {
    if (currentVerse < 10) {
        currentVerse++;
        loadVerseContent(currentVerse);
    }
});

// Initialize and start
function init() {
    initScene();
    loadVerseContent(currentVerse);
    
    // Set initial states
    if (window.innerWidth < 768) {
        // On mobile, collapse sections by default
        sectionHeaders.forEach(header => {
            header.classList.add('collapsed');
            header.nextElementSibling.classList.add('collapsed');
        });
    } else {
        // On desktop, expand explanation but collapse controls
        const explanationHeader = document.querySelector('#explanation-section .section-header');
        const controlsHeader = document.querySelector('#controls-section .section-header');
        
        if (controlsHeader) {
            controlsHeader.classList.add('collapsed');
            controlsHeader.nextElementSibling.classList.add('collapsed');
        }
        
        if (explanationHeader) {
            explanationHeader.classList.remove('collapsed');
            explanationHeader.nextElementSibling.classList.remove('collapsed');
        }
    }
    
    animate();
}

init();