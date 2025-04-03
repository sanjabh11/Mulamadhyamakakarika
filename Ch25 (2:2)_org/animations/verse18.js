import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let originalQuantumState, clonedQuantumState;
let noCloningText, originalLabel, cloneLabel;
let copyingProcess = [];
let buddhaMesh;
let animationFrameId;
let animationStartTime;
let cloningStarted = false;

export function initVerse18(container) {
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.FogExp2(0x000814, 0.002);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 12);
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Setup controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add spot lights for dramatic effect
    const spotLight1 = new THREE.SpotLight(0x8080ff, 1);
    spotLight1.position.set(-10, 10, 5);
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.3;
    spotLight1.castShadow = true;
    scene.add(spotLight1);
    
    const spotLight2 = new THREE.SpotLight(0xff8080, 1);
    spotLight2.position.set(10, 10, 5);
    spotLight2.angle = Math.PI / 6;
    spotLight2.penumbra = 0.3;
    spotLight2.castShadow = true;
    scene.add(spotLight2);
    
    // Use theme colors
    const theme = colorThemes[5];
    
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111122,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Create original quantum state object
    originalQuantumState = createQuantumState(theme.primary, -4, 0, 0);
    scene.add(originalQuantumState);
    
    // Create placeholder for cloned state
    clonedQuantumState = createQuantumState(theme.secondary, 4, 0, 0, true);
    scene.add(clonedQuantumState);
    
    // Create copying process elements
    createCopyingProcess(theme.accent);
    
    // Create Buddha figure
    createBuddha(theme);
    
    // Create text labels
    createTextLabels(theme);
    
    // Add particle effects
    createParticleEffects();
    
    // Add click interaction to start cloning animation
    renderer.domElement.addEventListener('click', startCloningAnimation);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Initialize animation timer
    animationStartTime = Date.now();
    
    // Start animation loop
    animate();
}

function createQuantumState(color, x, y, z, isClone = false) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Create base
    const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.2, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    
    // Create quantum state visualization
    if (!isClone) {
        // Original quantum state - complex, beautiful and ordered
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(color),
            emissive: new THREE.Color(color).multiplyScalar(0.3),
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
        group.add(sphere);
        
        // Add orbital rings around the original state
        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
            const ringGeometry = new THREE.TorusGeometry(1.2 + i * 0.2, 0.05, 16, 100);
            const ringMaterial = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color(color),
                emissive: new THREE.Color(color).multiplyScalar(0.3),
                transparent: true,
                opacity: 0.6
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.castShadow = true;
            
            // Rotate each ring differently
            ring.rotation.x = Math.PI / 2 + i * Math.PI / 4;
            ring.rotation.y = i * Math.PI / 3;
            
            group.add(ring);
        }
        
        // Add particles orbiting the state
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMaterial = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color(color),
                emissive: new THREE.Color(color).multiplyScalar(0.5)
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position in a spherical distribution
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            
            const radius = 1.5;
            particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
            particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
            particle.position.z = radius * Math.cos(phi);
            
            // Store original position and orbit speed
            particle.userData = {
                orbitalAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize(),
                orbitalSpeed: 0.01 + Math.random() * 0.02,
                originalPos: particle.position.clone()
            };
            
            group.add(particle);
        }
    } else {
        // Cloned state - initially empty/broken
        const meshGeometry = new THREE.DodecahedronGeometry(1, 0);
        const meshMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(color),
            emissive: new THREE.Color(color).multiplyScalar(0.1),
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        mesh.castShadow = true;
        group.add(mesh);
    }
    
    return group;
}

function createCopyingProcess(color) {
    // Create a beam/path between original and clone
    const pathGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const pathMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.3
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.z = Math.PI / 2;
    path.position.y = 0;
    scene.add(path);
    
    // Add transfer particles along the path
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const particleMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(color),
            emissive: new THREE.Color(color).multiplyScalar(0.5),
            transparent: true,
            opacity: 0
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position along path
        particle.position.set(-4 + 8 * (i / particleCount), 0, 0);
        
        // Store animation properties
        particle.userData = {
            speed: 0.05 + Math.random() * 0.05,
            delay: i * 100,
            active: false
        };
        
        scene.add(particle);
        copyingProcess.push(particle);
    }
}

function createBuddha(theme) {
    buddhaMesh = new THREE.Group();
    
    // Create base for Buddha
    const baseGeometry = new THREE.CylinderGeometry(2, 2.5, 0.5, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.8,
        metalness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.75;
    base.castShadow = true;
    base.receiveShadow = true;
    buddhaMesh.add(base);
    
    // Create Buddha stylized figure
    const bodyGeometry = new THREE.CylinderGeometry(1, 1.5, 3, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.primary),
        roughness: 0.7,
        metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.25;
    body.castShadow = true;
    buddhaMesh.add(body);
    
    // Create head
    const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffe0bd,
        roughness: 0.7,
        metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.3;
    head.castShadow = true;
    buddhaMesh.add(head);
    
    // Create halo/aura
    const haloGeometry = new THREE.TorusGeometry(1.2, 0.1, 16, 100);
    const haloMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.accent),
        emissive: new THREE.Color(theme.accent).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.7
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.y = 2.3;
    halo.rotation.x = Math.PI / 2;
    buddhaMesh.add(halo);
    
    // Position Buddha behind the scene
    buddhaMesh.position.set(0, 0, -8);
    buddhaMesh.scale.set(0.7, 0.7, 0.7);
    scene.add(buddhaMesh);
}

function createTextLabels(theme) {
    // Helper function to create text sprite
    function createText(text, position, color = 0xffffff, size = 1) {
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
        sprite.scale.set(size * 10, size * 2.5, 1);
        
        scene.add(sprite);
        return sprite;
    }
    
    // Create labels
    originalLabel = createText("Original Quantum State", new THREE.Vector3(-4, 2, 0), new THREE.Color(theme.primary));
    cloneLabel = createText("Attempted Clone", new THREE.Vector3(4, 2, 0), new THREE.Color(theme.secondary));
    
    // No-cloning theorem text
    noCloningText = createText("Click to demonstrate the No-Cloning Theorem", new THREE.Vector3(0, 4, 0), 0xffffff, 1.2);
}

function createParticleEffects() {
    // Create a background starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starPositions.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function startCloningAnimation() {
    if (cloningStarted) return;
    
    cloningStarted = true;
    noCloningText.visible = false;
    
    // Update text to show process
    originalLabel.material.map.dispose();
    originalLabel = null;
    originalLabel = createText("Original Quantum State", new THREE.Vector3(-4, 2, 0), 0xffffff);
    
    cloneLabel.material.map.dispose();
    cloneLabel = null;
    cloneLabel = createText("Attempting to Clone...", new THREE.Vector3(4, 2, 0), 0xffffff);
    
    // Start animation for transfer particles
    copyingProcess.forEach((particle, index) => {
        setTimeout(() => {
            particle.userData.active = true;
            particle.material.opacity = 1;
        }, particle.userData.delay);
    });
    
    // After all particles have been sent, show failure text
    setTimeout(() => {
        cloneLabel.material.map.dispose();
        cloneLabel = null;
        cloneLabel = createText("Cloning Failed!", new THREE.Vector3(4, 2, 0), 0xff0000);
        
        // Create explanation text
        createText("The No-Cloning Theorem: Quantum states cannot be perfectly copied", 
                  new THREE.Vector3(0, 6, 0), 0xffffff, 1.2);
        
        createText("Similarly, the Buddha's enlightenment cannot be duplicated", 
                  new THREE.Vector3(0, 5, 0), 0xffff00, 1);
        
        // Make Buddha glow
        const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        buddhaMesh.add(glow);
        
        // Make the clone visibly broken/distorted
        clonedQuantumState.children.forEach(child => {
            if (child instanceof THREE.Mesh && child !== clonedQuantumState.children[0]) {
                child.material.wireframe = false;
                child.material.opacity = 0.6;
                child.geometry.dispose();
                child.geometry = new THREE.DodecahedronGeometry(1, 1);
                child.scale.set(1 + Math.random() * 0.3, 1 + Math.random() * 0.3, 1 + Math.random() * 0.3);
                child.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            }
        });
    }, 4000);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    const elapsedTime = (Date.now() - animationStartTime) * 0.001; // Time in seconds
    
    // Animate original quantum state
    originalQuantumState.children.forEach((child, index) => {
        if (index > 0) { // Skip the base
            if (child.geometry.type === 'TorusGeometry') {
                // Rotate rings
                child.rotation.x += 0.005;
                child.rotation.y += 0.003;
                child.rotation.z += 0.002;
            } else if (child.geometry.type === 'SphereGeometry' && index > 1) {
                // Orbit particles
                const orbit = child.userData;
                if (orbit) {
                    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
                        orbit.orbitalAxis, orbit.orbitalSpeed
                    );
                    child.position.applyMatrix4(rotationMatrix);
                }
            }
        }
    });
    
    // Animate cloned quantum state
    if (cloningStarted) {
        clonedQuantumState.children.forEach((child, index) => {
            if (index > 0) { // Skip the base
                // Make the clone distorted and glitchy
                child.rotation.x += Math.sin(elapsedTime * 2) * 0.02;
                child.rotation.y += Math.cos(elapsedTime * 1.5) * 0.02;
                child.rotation.z += Math.sin(elapsedTime) * 0.01;
                
                if (child.material) {
                    child.material.opacity = 0.3 + 0.3 * Math.sin(elapsedTime * 3 + index);
                }
            }
        });
    }
    
    // Animate copying process particles
    copyingProcess.forEach(particle => {
        if (particle.userData.active) {
            // Move particle along the path
            particle.position.x += particle.userData.speed;
            
            // When it reaches the end, make it disappear
            if (particle.position.x > 4) {
                particle.position.x = -4;
                particle.material.opacity = 0;
                
                // Brief delay before showing again
                setTimeout(() => {
                    if (cloningStarted) {
                        particle.material.opacity = 1;
                    }
                }, 1000 + Math.random() * 1000);
            }
        }
    });
    
    // Animate Buddha figure
    if (buddhaMesh) {
        // Subtle floating motion
        buddhaMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
        
        // Make halo glow
        if (buddhaMesh.children.length > 3) {
            buddhaMesh.children[3].rotation.y += 0.01;
            buddhaMesh.children[3].material.opacity = 0.4 + 0.3 * Math.sin(elapsedTime * 2);
        }
        
        // If there's a glow effect (after animation starts)
        if (buddhaMesh.children.length > 4) {
            const glow = buddhaMesh.children[4];
            glow.scale.set(
                1 + 0.2 * Math.sin(elapsedTime * 2),
                1 + 0.2 * Math.sin(elapsedTime * 2),
                1 + 0.2 * Math.sin(elapsedTime * 2)
            );
        }
    }
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

function createText(text, position, color = 0xffffff, size = 1) {
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
    sprite.scale.set(size * 10, size * 2.5, 1);
    
    scene.add(sprite);
    return sprite;
}

export function cleanupVerse18() {
    // Stop animation
    cancelAnimationFrame(animationFrameId);
    
    // Remove event listeners
    renderer.domElement.removeEventListener('click', startCloningAnimation);
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
    originalQuantumState = null;
    clonedQuantumState = null;
    noCloningText = null;
    originalLabel = null;
    cloneLabel = null;
    copyingProcess = [];
    buddhaMesh = null;
    cloningStarted = false;
}

