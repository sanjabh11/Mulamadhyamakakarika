import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let quantum, quantumMaterial, observationRay;
let wave = [];
let observer;
let isObserved = false;
let animationFrameId;

export function initVerse16(container) {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Add atmospheric fog
    scene.fog = new THREE.FogExp2(0x000000, 0.002);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Create controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Use theme colors
    const theme = colorThemes[3];
    
    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        roughness: 0.8,
        metalness: 0.2,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Create quantum particle in superposition
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    quantumMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(theme.primary),
        emissive: new THREE.Color(theme.primary).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });
    
    quantum = new THREE.Mesh(particleGeometry, quantumMaterial);
    quantum.castShadow = true;
    quantum.position.y = 0;
    scene.add(quantum);
    
    // Create wave function visualization
    createWaveFunction(theme);
    
    // Create observer
    createObserver(theme);
    
    // Create visual for observation ray
    const rayGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const rayMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(theme.accent),
        transparent: true,
        opacity: 0.6
    });
    observationRay = new THREE.Mesh(rayGeometry, rayMaterial);
    observationRay.rotation.z = Math.PI / 2;
    observationRay.position.set(5, 0, 0);
    observationRay.visible = false;
    scene.add(observationRay);
    
    // Create instruction text
    createText("Click to observe the quantum particle", new THREE.Vector3(0, 5, 0), 0xffffff);
    
    // Create explanation text
    createText("Particle in superposition", new THREE.Vector3(0, -5, 0), new THREE.Color(theme.primary));
    
    // Add stars to background
    createStars();
    
    // Add event listener for observation
    window.addEventListener('click', observeParticle);
    
    // Add resize handler
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

function createWaveFunction(theme) {
    // Create circular wave around particle to represent superposition
    const waveCount = 8;
    const waveRadius = 3;
    
    for (let i = 0; i < waveCount; i++) {
        const ringGeometry = new THREE.TorusGeometry(waveRadius, 0.05, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color(theme.secondary),
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Rotate rings in different orientations to create a sphere-like effect
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.rotation.z = Math.random() * Math.PI;
        
        ring.userData = {
            initialRotation: {
                x: ring.rotation.x,
                y: ring.rotation.y,
                z: ring.rotation.z
            },
            pulseSpeed: 0.5 + Math.random() * 0.5,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        scene.add(ring);
        wave.push(ring);
    }
    
    // Add probability cloud particles
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Create particles in a spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2 + Math.random();
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        particlePositions.push(x, y, z);
    }
    
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(theme.primary),
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.userData = { isParticles: true };
    scene.add(particles);
    wave.push(particles);
}

function createObserver(theme) {
    // Create an "observer" mesh
    observer = new THREE.Group();
    
    // Observer base
    const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        shininess: 30
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.25;
    base.castShadow = true;
    observer.add(base);
    
    // Observer body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.secondary),
        shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    observer.add(body);
    
    // Observer "eye" (lens)
    const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.accent),
        emissive: new THREE.Color(theme.accent).multiplyScalar(0.3),
        shininess: 70
    });
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(0.5, 1.5, 0);
    eye.castShadow = true;
    observer.add(eye);
    
    // Position observer
    observer.position.set(10, 0, 0);
    observer.rotation.y = -Math.PI / 2; // Face the particle
    scene.add(observer);
}

function createText(text, position, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'Bold 40px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    if (color instanceof THREE.Color) {
        context.fillStyle = `rgb(${Math.floor(color.r*255)}, ${Math.floor(color.g*255)}, ${Math.floor(color.b*255)})`;
    } else {
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    }
    
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(10, 2.5, 1);
    
    scene.add(sprite);
    return sprite;
}

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starPositions.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function observeParticle() {
    if (isObserved) return;
    
    // Show observation ray
    observationRay.visible = true;
    
    // "Collapse" the wave function
    isObserved = true;
    
    // Simulate the collapse by shrinking the wave
    wave.forEach(ring => {
        if (ring.userData && ring.userData.isParticles) {
            // For probability cloud particles, make them converge
            const positions = ring.geometry.attributes.position.array;
            const collapseSpeed = 0.1;
            
            let collapseTimerId = setInterval(() => {
                let allCollapsed = true;
                
                for (let i = 0; i < positions.length; i += 3) {
                    // Move particles toward the center
                    positions[i] *= (1 - collapseSpeed);    // x
                    positions[i + 1] *= (1 - collapseSpeed); // y
                    positions[i + 2] *= (1 - collapseSpeed); // z
                    
                    // Check if this particle is still not fully collapsed
                    if (Math.abs(positions[i]) > 0.1 || 
                        Math.abs(positions[i + 1]) > 0.1 || 
                        Math.abs(positions[i + 2]) > 0.1) {
                        allCollapsed = false;
                    }
                }
                
                if (ring.geometry && ring.geometry.attributes && ring.geometry.attributes.position) {
                    ring.geometry.attributes.position.needsUpdate = true;
                }
                
                if (allCollapsed) {
                    clearInterval(collapseTimerId);
                    ring.visible = false;
                }
            }, 50);
        } else if (ring) {
            // For wave rings, shrink them
            let scale = 1.0;
            const shrinkSpeed = 0.05;
            
            let shrinkTimerId = setInterval(() => {
                scale -= shrinkSpeed;
                ring.scale.set(scale, scale, scale);
                
                if (scale <= 0.1) {
                    clearInterval(shrinkTimerId);
                    ring.visible = false;
                }
            }, 50);
        }
    });
    
    // Change the particle appearance to a definite state
    setTimeout(() => {
        quantum.material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x440000,
            shininess: 30
        });
        
        // Update the text to show collapse state
        createText("Superposition collapsed to a definite state", new THREE.Vector3(0, -5, 0), 0xff0000);
    }, 1000);
    
    // Move observer closer after observation
    const duration = 2000; // ms
    const startTime = Date.now();
    const startPosition = observer.position.clone();
    const targetPosition = new THREE.Vector3(5, 0, 0);
    
    const moveInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        observer.position.lerpVectors(startPosition, targetPosition, progress);
        
        if (progress === 1) {
            clearInterval(moveInterval);
        }
    }, 16);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    if (!isObserved) {
        // Animate wave rings when in superposition
        wave.forEach(ring => {
            if (!ring.userData || !ring.userData.isParticles) {
                // Rotate rings continuously
                ring.rotation.x = ring.userData.initialRotation.x + Math.sin(Date.now() * 0.001) * 0.2;
                ring.rotation.y = ring.userData.initialRotation.y + Math.cos(Date.now() * 0.0008) * 0.2;
                
                // Pulsate rings
                const t = Date.now() * 0.001 * ring.userData.pulseSpeed + ring.userData.pulsePhase;
                const scale = 1.0 + 0.1 * Math.sin(t);
                ring.scale.set(scale, scale, scale);
            } else {
                // Animate probability cloud particles
                const positions = ring.geometry.attributes.position.array;
                const time = Date.now() * 0.0005;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const y = positions[i + 1];
                    const z = positions[i + 2];
                    
                    const distance = Math.sqrt(x*x + y*y + z*z);
                    const angle = Math.atan2(y, x) + 0.01 * Math.sin(time + distance);
                    const height = z + 0.02 * Math.sin(time * 2 + distance);
                    
                    positions[i] = Math.cos(angle) * distance;
                    positions[i + 1] = Math.sin(angle) * distance;
                    positions[i + 2] = height;
                }
                
                ring.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        // Make the quantum particle shimmer in superposition
        quantum.material.emissiveIntensity = 0.5 + 0.2 * Math.sin(Date.now() * 0.002);
        quantum.scale.set(
            1.0 + 0.05 * Math.sin(Date.now() * 0.003),
            1.0 + 0.05 * Math.sin(Date.now() * 0.004),
            1.0 + 0.05 * Math.sin(Date.now() * 0.005)
        );
    } else {
        // Animate observation ray
        if (observationRay.visible) {
            observationRay.material.opacity = 0.3 + 0.3 * Math.sin(Date.now() * 0.01);
        }
    }
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

export function cleanupVerse16() {
    // Stop animation loop
    cancelAnimationFrame(animationFrameId);
    
    // Remove event listeners
    window.removeEventListener('click', observeParticle);
    window.removeEventListener('resize', onWindowResize);
    
    // Dispose of resources
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (object.material.map) {
                object.material.map.dispose();
            }
            object.material.dispose();
        }
    });
    
    // Remove renderer from DOM
    if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    
    // Dispose of renderer
    renderer.dispose();
    
    // Clear references
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    quantum = null;
    quantumMaterial = null;
    observationRay = null;
    wave = [];
    observer = null;
    isObserved = false;
}