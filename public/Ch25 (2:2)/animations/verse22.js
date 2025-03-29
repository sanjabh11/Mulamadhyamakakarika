import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let quantumFoam, particleSystem;
let virtualParticles = [];
let zoomLevel = 1;
let textLabels = [];
let animationFrameId;

export function initVerse22(container) {
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Setup controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Use theme colors
    const theme = colorThemes[9];
    
    // Create quantum foam visualization
    createQuantumFoam(theme);
    
    // Create virtual particles
    createVirtualParticles(theme);
    
    // Create text labels
    createTextLabels(theme);
    
    // Add zoom interaction
    renderer.domElement.addEventListener('wheel', onMouseWheel);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createQuantumFoam(theme) {
    // Create foam base - a distorted sphere
    quantumFoam = new THREE.Group();
    scene.add(quantumFoam);
    
    // Create base geometry for foam
    const foamGeometry = new THREE.IcosahedronGeometry(5, 3);
    const foamMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.primary),
        transparent: true,
        opacity: 0.3,
        wireframe: true,
        shininess: 30
    });
    const foam = new THREE.Mesh(foamGeometry, foamMaterial);
    quantumFoam.add(foam);
    
    // Store original vertices for animation
    const positionAttribute = foam.geometry.getAttribute('position');
    foam.userData.originalPositions = new Float32Array(positionAttribute.array.length);
    for (let i = 0; i < positionAttribute.array.length; i++) {
        foam.userData.originalPositions[i] = positionAttribute.array[i];
    }
    
    // Create solid core
    const coreGeometry = new THREE.IcosahedronGeometry(4.5, 2);
    const coreMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.secondary),
        transparent: true,
        opacity: 0.15,
        shininess: 30
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    quantumFoam.add(core);
    
    // Add inner particles to show emptiness
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Create in spherical distribution
        const radius = 4 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(theme.accent),
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const innerParticles = new THREE.Points(particleGeometry, particleMaterial);
    quantumFoam.add(innerParticles);
}

function createVirtualParticles(theme) {
    // Create system for virtual particles
    particleSystem = new THREE.Group();
    scene.add(particleSystem);
    
    // Create particle pairs
    const pairCount = 20;
    for (let i = 0; i < pairCount; i++) {
        createParticlePair(theme);
    }
}

function createParticlePair(theme) {
    // Create particle and antiparticle
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    // Particle
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.primary),
        emissive: new THREE.Color(theme.primary).multiplyScalar(0.5),
        shininess: 30
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    
    // Antiparticle
    const antiparticleMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.secondary),
        emissive: new THREE.Color(theme.secondary).multiplyScalar(0.5),
        shininess: 30
    });
    const antiparticle = new THREE.Mesh(particleGeometry, antiparticleMaterial);
    
    // Position randomly in space
    const radius = 4.5 + Math.random() * 0.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // Set initial positions close to each other
    particle.position.set(x, y, z);
    antiparticle.position.set(x, y, z);
    
    // Set animation properties
    const lifespan = 1000 + Math.random() * 2000; // ms
    const direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
    ).normalize();
    
    const pairData = {
        particle: particle,
        antiparticle: antiparticle,
        birthTime: Date.now(),
        lifespan: lifespan,
        direction: direction,
        speed: 0.02 + Math.random() * 0.03,
        originalPosition: new THREE.Vector3(x, y, z)
    };
    
    // Add to scene
    particleSystem.add(particle);
    particleSystem.add(antiparticle);
    virtualParticles.push(pairData);
    
    // Add particle trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailPoints = [
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(x, y, z)
    ];
    trailGeometry.setFromPoints(trailPoints);
    
    const trailMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(theme.accent),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    particleSystem.add(trail);
    
    pairData.trail = trail;
    pairData.trailPoints = trailPoints;
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
        textLabels.push(sprite);
        return sprite;
    }
    
    // Create explanatory labels
    createText("Quantum Foam at Planck Scale", new THREE.Vector3(0, 8, 0), 0xffffff, 1.2);
    createText("Use mouse wheel to zoom in/out", new THREE.Vector3(0, 6, 0), 0xffffff);
    createText("In emptiness, distinctions dissolve", new THREE.Vector3(0, -8, 0), new THREE.Color(theme.accent));
}

function onMouseWheel(event) {
    // Scale zoom level based on wheel direction
    zoomLevel = Math.max(0.5, Math.min(3, zoomLevel + event.deltaY * -0.001));
    
    // Scale the quantum foam with zoom
    updateZoom();
}

function updateZoom() {
    // Scale quantum foam based on zoom level
    quantumFoam.scale.set(zoomLevel, zoomLevel, zoomLevel);
    
    // Make particles more visible as we zoom in
    if (quantumFoam.children.length > 0) {
        const foamMesh = quantumFoam.children[0];
        if (foamMesh.material) {
            foamMesh.material.opacity = 0.3 * Math.min(1, 1.5 / zoomLevel);
        }
    }
    
    // Increase distortion with zoom
    // (This happens in animate function)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Animate quantum foam distortion
    if (quantumFoam.children.length > 0) {
        const foamMesh = quantumFoam.children[0];
        
        if (foamMesh.geometry && foamMesh.userData.originalPositions) {
            const time = Date.now() * 0.001;
            const positionAttribute = foamMesh.geometry.getAttribute('position');
            const originalPositions = foamMesh.userData.originalPositions;
            
            // Apply distortion based on zoom level - more visible at high zoom
            const noiseScale = 0.5 + (3 - zoomLevel) * 0.5; // More noise when zoomed in
            const noiseAmplitude = 0.1 + (3 - zoomLevel) * 0.3; // Stronger effect when zoomed in
            
            for (let i = 0; i < positionAttribute.array.length; i += 3) {
                const x = originalPositions[i];
                const y = originalPositions[i + 1];
                const z = originalPositions[i + 2];
                
                // Apply noise-based distortion
                positionAttribute.array[i] = x + Math.sin(time + x * noiseScale) * noiseAmplitude;
                positionAttribute.array[i + 1] = y + Math.cos(time + y * noiseScale) * noiseAmplitude;
                positionAttribute.array[i + 2] = z + Math.sin(time + z * noiseScale) * noiseAmplitude;
            }
            
            positionAttribute.needsUpdate = true;
        }
    }
    
    // Animate virtual particles
    const currentTime = Date.now();
    
    virtualParticles.forEach((pairData, index) => {
        const age = currentTime - pairData.birthTime;
        
        if (age < pairData.lifespan) {
            // Calculate progress
            const progress = age / pairData.lifespan;
            
            // Move particles away from each other
            const offset = pairData.direction.clone().multiplyScalar(progress * pairData.speed * 15);
            
            pairData.particle.position.copy(pairData.originalPosition).add(offset);
            pairData.antiparticle.position.copy(pairData.originalPosition).sub(offset);
            
            // Fade out as they approach end of life
            const opacity = Math.sin(progress * Math.PI);
            pairData.particle.material.opacity = opacity;
            pairData.antiparticle.material.opacity = opacity;
            
            // Update trail
            if (pairData.trail && pairData.trailPoints) {
                pairData.trailPoints[0].copy(pairData.particle.position);
                pairData.trailPoints[1].copy(pairData.antiparticle.position);
                
                pairData.trail.geometry.setFromPoints(pairData.trailPoints);
                pairData.trail.geometry.verticesNeedUpdate = true;
                pairData.trail.material.opacity = opacity * 0.5;
            }
        } else {
            // Remove particles
            particleSystem.remove(pairData.particle);
            particleSystem.remove(pairData.antiparticle);
            if (pairData.trail) {
                particleSystem.remove(pairData.trail);
            }
            
            // Create new pair
            virtualParticles.splice(index, 1);
            createParticlePair(colorThemes[9]);
        }
    });
    
    // Slowly rotate quantum foam
    quantumFoam.rotation.x += 0.001;
    quantumFoam.rotation.y += 0.0007;
    
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
    textLabels.push(sprite);
    return sprite;
}

export function cleanupVerse22() {
    // Stop animation
    cancelAnimationFrame(animationFrameId);
    
    // Remove event listeners
    renderer.domElement.removeEventListener('wheel', onMouseWheel);
    window.removeEventListener('resize', onWindowResize);
    
    // Dispose of resources
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
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
    quantumFoam = null;
    particleSystem = null;
    virtualParticles = [];
    zoomLevel = 1;
    textLabels = [];
}

