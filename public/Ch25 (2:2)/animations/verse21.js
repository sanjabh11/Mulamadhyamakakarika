import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let symmetryField, particleSystem, fieldParticles;
let particlesLow = [];
let particlesHigh = [];
let symmetryBroken = false;
let animationFrameId;
let textLabels = [];

export function initVerse21(container) {
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 30);
    
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
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Use theme colors
    const theme = colorThemes[8];
    
    // Create symmetry field
    createSymmetryField(theme);
    
    // Create particle system
    createParticleSystem(theme);
    
    // Create text labels
    createTextLabels(theme);
    
    // Add interaction to break symmetry
    renderer.domElement.addEventListener('click', breakSymmetry);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createSymmetryField(theme) {
    // Create potential well visualization (Mexican hat potential)
    symmetryField = new THREE.Group();
    scene.add(symmetryField);
    
    // Create circular base
    const baseGeometry = new THREE.CylinderGeometry(15, 15, 0.5, 64);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.secondary),
        transparent: true,
        opacity: 0.2,
        roughness: 0.7,
        metalness: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.25;
    base.receiveShadow = true;
    symmetryField.add(base);
    
    // Create central bump
    const bumpGeometry = new THREE.CylinderGeometry(2, 4, 2, 32);
    const bumpMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.primary),
        roughness: 0.7,
        metalness: 0.3
    });
    const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
    bump.position.y = 1;
    bump.castShadow = true;
    symmetryField.add(bump);
    
    // Create circular valley
    const valleyGeometry = new THREE.TorusGeometry(9, 1, 16, 100);
    const valleyMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.accent),
        roughness: 0.7,
        metalness: 0.3
    });
    const valley = new THREE.Mesh(valleyGeometry, valleyMaterial);
    valley.rotation.x = Math.PI / 2;
    valley.position.y = 0;
    valley.castShadow = true;
    valley.receiveShadow = true;
    symmetryField.add(valley);
    
    // Add grid on the base
    const gridHelper = new THREE.GridHelper(30, 30, 0xffffff, 0x888888);
    gridHelper.position.y = -0.2;
    symmetryField.add(gridHelper);
}

function createParticleSystem(theme) {
    // Create particles floating in the high state (around the center)
    fieldParticles = new THREE.Group();
    scene.add(fieldParticles);
    
    // Create high-energy state particles around central bump
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const particleMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(theme.primary),
            emissive: new THREE.Color(theme.primary).multiplyScalar(0.3),
            shininess: 30
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position around central bump
        const angle = i * (Math.PI * 2 / particleCount);
        const radius = 2 + Math.random() * 1.5;
        particle.position.x = Math.cos(angle) * radius;
        particle.position.z = Math.sin(angle) * radius;
        particle.position.y = 2 + Math.random() * 2;
        
        // Store motion properties
        particle.userData = {
            angle: angle,
            radius: radius,
            height: particle.position.y,
            speed: 0.02 + Math.random() * 0.02,
            phaseOffset: Math.random() * Math.PI * 2
        };
        
        fieldParticles.add(particle);
        particlesHigh.push(particle);
    }
    
    // Prepare arrays for particles in low state (after symmetry breaking)
    particlesLow = [];
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
    createText("Symmetry Breaking in the Higgs Field", new THREE.Vector3(0, 10, 0), 0xffffff, 1.2);
    createText("Click to Break Symmetry", new THREE.Vector3(0, 8, 0), 0xffffff, 1);
    
    // Create labels for before state
    createText("High Energy State", new THREE.Vector3(0, 5, 0), new THREE.Color(theme.primary));
    createText("(Symmetry Preserved)", new THREE.Vector3(0, 3.5, 0), 0xffffff, 0.8);
}

function breakSymmetry() {
    if (symmetryBroken) return;
    
    symmetryBroken = true;
    
    // Clear existing labels
    textLabels.forEach(label => {
        scene.remove(label);
        if (label.material.map) {
            label.material.map.dispose();
        }
        label.material.dispose();
    });
    textLabels = [];
    
    // Add new labels for broken symmetry
    createText("Symmetry Breaking", new THREE.Vector3(0, 10, 0), 0xffffff, 1.2);
    createText("Low Energy State", new THREE.Vector3(0, 8, 0), new THREE.Color(colorThemes[8].accent));
    createText("Particles gain mass through Higgs mechanism", new THREE.Vector3(0, 6, 0), 0xffffff);
    createText("Concepts like permanence depend on Nirvāņa", new THREE.Vector3(0, 4.5, 0), 0xffff00, 0.9);
    
    // Start transition of particles to low state (valley)
    transitionParticles();
}

function transitionParticles() {
    const theme = colorThemes[8];
    
    // Transition particles from high to low state
    particlesHigh.forEach((particle, index) => {
        // Choose a random position in the valley
        const angle = Math.random() * Math.PI * 2;
        const targetPosition = new THREE.Vector3(
            Math.cos(angle) * 9,
            0,
            Math.sin(angle) * 9
        );
        
        // Store transition data
        particle.userData.transitioning = true;
        particle.userData.startPosition = particle.position.clone();
        particle.userData.targetPosition = targetPosition;
        particle.userData.transitionStart = Date.now();
        particle.userData.transitionDuration = 1000 + Math.random() * 1000;
        
        // Change color
        particle.material.color.set(new THREE.Color(theme.accent));
        particle.material.emissive.set(new THREE.Color(theme.accent).multiplyScalar(0.3));
        
        // After transition, increase size (gain mass)
        setTimeout(() => {
            // Grow particle (represents gaining mass)
            let scale = 1.0;
            const growInterval = setInterval(() => {
                scale += 0.1;
                particle.scale.set(scale, scale, scale);
                
                if (scale >= 2.0) {
                    clearInterval(growInterval);
                    
                    // Add trail effect to show it's now "massive"
                    createParticleTrail(particle);
                }
            }, 100);
        }, particle.userData.transitionDuration + 200);
    });
}

function createParticleTrail(particle) {
    const theme = colorThemes[8];
    
    // Create trail particles
    const trailCount = 5;
    for (let i = 0; i < trailCount; i++) {
        const trailGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color(theme.accent),
            transparent: true,
            opacity: 0.7
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        
        // Position at parent particle
        trail.position.copy(particle.position);
        
        // Store trail data
        trail.userData = {
            parent: particle,
            offset: i * 0.2,
            lifespan: 1000,
            birthtime: Date.now()
        };
        
        scene.add(trail);
        particlesLow.push(trail);
    }
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Rotate symmetry field slowly
    symmetryField.rotation.y += 0.001;
    
    // Animate high state particles
    if (!symmetryBroken) {
        // Particles orbit around central bump
        particlesHigh.forEach(particle => {
            const userData = particle.userData;
            
            // Update angle
            userData.angle += userData.speed;
            
            // Update position
            particle.position.x = Math.cos(userData.angle) * userData.radius;
            particle.position.z = Math.sin(userData.angle) * userData.radius;
            particle.position.y = userData.height + Math.sin(Date.now() * 0.001 + userData.phaseOffset) * 0.5;
        });
    } else {
        // Animate transitioning particles
        particlesHigh.forEach(particle => {
            if (particle.userData.transitioning) {
                const elapsed = Date.now() - particle.userData.transitionStart;
                const progress = Math.min(elapsed / particle.userData.transitionDuration, 1);
                
                // Use easing function for smooth transition
                const easedProgress = easeOutCubic(progress);
                
                // Interpolate position
                particle.position.lerpVectors(
                    particle.userData.startPosition,
                    particle.userData.targetPosition,
                    easedProgress
                );
                
                // When transition completes
                if (progress === 1) {
                    particle.userData.transitioning = false;
                    
                    // Set up orbital motion in valley
                    const angle = Math.atan2(particle.position.z, particle.position.x);
                    particle.userData.valleyAngle = angle;
                    particle.userData.valleySpeed = 0.01 + Math.random() * 0.01;
                    particle.userData.valleyRadius = 9;
                }
            } else if (particle.userData.valleyAngle !== undefined) {
                // Orbit in valley
                particle.userData.valleyAngle += particle.userData.valleySpeed;
                
                particle.position.x = Math.cos(particle.userData.valleyAngle) * particle.userData.valleyRadius;
                particle.position.z = Math.sin(particle.userData.valleyAngle) * particle.userData.valleyRadius;
                particle.position.y = 0;
            }
        });
        
        // Animate trail particles
        particlesLow.forEach((trail, index) => {
            if (trail.userData.parent) {
                const parent = trail.userData.parent;
                const parentAngle = parent.userData.valleyAngle;
                
                if (parentAngle !== undefined) {
                    // Follow parent with delay
                    const delayedAngle = parentAngle - trail.userData.offset;
                    
                    trail.position.x = Math.cos(delayedAngle) * parent.userData.valleyRadius;
                    trail.position.z = Math.sin(delayedAngle) * parent.userData.valleyRadius;
                    trail.position.y = 0;
                    
                    // Fade out based on age
                    const age = Date.now() - trail.userData.birthtime;
                    if (age > trail.userData.lifespan) {
                        trail.userData.birthtime = Date.now(); // Reset
                        trail.position.copy(parent.position);
                    } else {
                        const opacity = 1 - (age / trail.userData.lifespan);
                        trail.material.opacity = opacity * 0.7;
                    }
                }
            }
        });
    }
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

// Easing function for smooth transition
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

export function cleanupVerse21() {
    // Stop animation
    cancelAnimationFrame(animationFrameId);
    
    // Remove event listeners
    renderer.domElement.removeEventListener('click', breakSymmetry);
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
    symmetryField = null;
    particleSystem = null;
    fieldParticles = null;
    particlesLow = [];
    particlesHigh = [];
    symmetryBroken = false;
    textLabels = [];
}

