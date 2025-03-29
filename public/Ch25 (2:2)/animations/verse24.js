import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let quantumSystem, classicalSystem;
let particleCloud = [];
let coherenceLevel = 1.0;
let decoherenceActive = false;
let animationFrameId;
let textLabels = [];

export function initVerse24(container) {
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
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Use theme colors
    const theme = colorThemes[11];
    
    // Create quantum system in superposition
    createQuantumSystem(theme);
    
    // Create classical system (appears after decoherence)
    createClassicalSystem(theme);
    
    // Create text labels
    createTextLabels(theme);
    
    // Add background stars
    createStars();
    
    // Add click interaction to trigger decoherence
    renderer.domElement.addEventListener('click', triggerDecoherence);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createQuantumSystem(theme) {
    quantumSystem = new THREE.Group();
    scene.add(quantumSystem);
    
    // Central quantum state sphere
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(theme.primary),
        emissive: new THREE.Color(theme.primary).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    quantumSystem.add(sphere);
    
    // Add orbital clouds to represent superposition
    const particleCount = 200;
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    for (let i = 0; i < particleCount; i++) {
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(theme.secondary),
            emissive: new THREE.Color(theme.secondary).multiplyScalar(0.5),
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Create complex orbital path
        const radius = 2.5 + Math.random() * 2;
        const inclination = Math.random() * Math.PI;
        const azimuth = Math.random() * Math.PI * 2;
        
        particle.position.set(
            radius * Math.sin(inclination) * Math.cos(azimuth),
            radius * Math.sin(inclination) * Math.sin(azimuth),
            radius * Math.cos(inclination)
        );
        
        // Store original position and orbital parameters
        particle.userData = {
            radius: radius,
            inclination: inclination,
            azimuth: azimuth,
            orbitSpeed: 0.01 + Math.random() * 0.02,
            orbitAxis: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize(),
            originalPosition: particle.position.clone()
        };
        
        quantumSystem.add(particle);
        particleCloud.push(particle);
    }
    
    // Add interference patterns - toroidal rings
    const ringCount = 5;
    for (let i = 0; i < ringCount; i++) {
        const ringGeometry = new THREE.TorusGeometry(3 + i * 0.5, 0.05, 16, 100);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(theme.accent),
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Random orientation
        ring.rotation.set(
            Math.random() * Math.PI, 
            Math.random() * Math.PI, 
            Math.random() * Math.PI
        );
        
        ring.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        };
        
        quantumSystem.add(ring);
    }
}

function createClassicalSystem(theme) {
    classicalSystem = new THREE.Group();
    classicalSystem.visible = false;
    scene.add(classicalSystem);
    
    // Create definite state sphere
    const sphereGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(theme.secondary),
        roughness: 0.3,
        metalness: 0.7
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    classicalSystem.add(sphere);
    
    // Add surface details to show definiteness
    const detailsGeometry = new THREE.IcosahedronGeometry(1.85, 1);
    const detailsMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(theme.accent),
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const details = new THREE.Mesh(detailsGeometry, detailsMaterial);
    classicalSystem.add(details);
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
    createText("Quantum Decoherence", new THREE.Vector3(0, 8, 0), 0xffffff, 1.2);
    createText("Click to Experience Decoherence", new THREE.Vector3(0, 6, 0), 0xffffff);
    createText("Quantum Superposition", new THREE.Vector3(0, -5, 0), new THREE.Color(theme.primary));
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

function triggerDecoherence() {
    if (decoherenceActive) return;
    
    decoherenceActive = true;
    
    // Clear existing labels
    textLabels.forEach(label => {
        scene.remove(label);
        if (label.material.map) {
            label.material.map.dispose();
        }
        label.material.dispose();
    });
    textLabels = [];
    
    // Add new labels for decoherence
    createText("Decoherence In Progress", new THREE.Vector3(0, 8, 0), 0xffffff, 1.2);
    createText("Quantum → Classical Transition", new THREE.Vector3(0, 6, 0), 0xffffff);
    
    // Start decoherence animation
    setTimeout(() => {
        // Make classical system visible
        classicalSystem.visible = true;
        classicalSystem.scale.set(0.1, 0.1, 0.1);
        
        // Animate scale up
        const scaleInterval = setInterval(() => {
            classicalSystem.scale.multiplyScalar(1.05);
            
            if (classicalSystem.scale.x > 1) {
                clearInterval(scaleInterval);
                
                // Update text with Buddhist parallel
                createText("Peace Through Pacifying Mental Fixations", new THREE.Vector3(0, -5, 0), 0xffff00, 1.2);
                createText("As quantum states settle, the mind finds clarity", new THREE.Vector3(0, -7, 0), 0xffffff);
            }
        }, 50);
    }, 2000);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Animate quantum system
    if (!decoherenceActive) {
        // Rotate rings to show interference patterns
        quantumSystem.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'TorusGeometry') {
                const speeds = child.userData.rotationSpeed;
                child.rotation.x += speeds.x;
                child.rotation.y += speeds.y;
                child.rotation.z += speeds.z;
            }
        });
        
        // Animate particles in orbital paths
        particleCloud.forEach(particle => {
            const userData = particle.userData;
            
            // Use rotation matrix for smooth orbital motion
            const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
                userData.orbitAxis, userData.orbitSpeed
            );
            particle.position.applyMatrix4(rotationMatrix);
            
            // Slightly vary the particle size
            const pulseFactor = 1 + 0.2 * Math.sin(Date.now() * 0.001 * userData.orbitSpeed * 5);
            particle.scale.set(pulseFactor, pulseFactor, pulseFactor);
        });
        
        // Subtle pulsing of the central quantum state
        const centralSphere = quantumSystem.children[0];
        const pulseFactor = 1 + 0.05 * Math.sin(Date.now() * 0.001);
        centralSphere.scale.set(pulseFactor, pulseFactor, pulseFactor);
    } else {
        // Handle decoherence animation
        if (coherenceLevel > 0) {
            coherenceLevel -= 0.005;
            
            // Scale down quantum system
            quantumSystem.scale.set(coherenceLevel, coherenceLevel, coherenceLevel);
            
            // Fade out particles
            particleCloud.forEach(particle => {
                if (particle.material.opacity > 0) {
                    particle.material.opacity = coherenceLevel * 0.7;
                }
                
                // Make particles move more chaotically
                particle.position.x += (Math.random() - 0.5) * 0.05;
                particle.position.y += (Math.random() - 0.5) * 0.05;
                particle.position.z += (Math.random() - 0.5) * 0.05;
            });
            
            // If coherence is almost gone, hide quantum system
            if (coherenceLevel < 0.1) {
                quantumSystem.visible = false;
            }
        }
        
        // Animate classical system
        if (classicalSystem.visible) {
            classicalSystem.rotation.y += 0.01;
            
            // Pulse subtly
            const time = Date.now() * 0.001;
            const pulseFactor = 1 + 0.02 * Math.sin(time);
            classicalSystem.children[1].scale.set(pulseFactor, pulseFactor, pulseFactor);
        }
    }
    
    // Update controls
    controls.update();
    
    // Render scene
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

export function cleanupVerse24() {
    // Stop animation loop
    cancelAnimationFrame(animationFrameId);
    
    // Remove event listeners
    renderer.domElement.removeEventListener('click', triggerDecoherence);
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
    quantumSystem = null;
    classicalSystem = null;
    particleCloud = [];
    coherenceLevel = 1.0;
    decoherenceActive = false;
    textLabels = [];
}