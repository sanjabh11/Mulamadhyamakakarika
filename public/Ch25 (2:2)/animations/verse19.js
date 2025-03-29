import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let nucleusGroup, particleEmitter;
let energyWaves = [];
let transformationActive = false;
let animationFrameId;
let textLabels = [];

export function initVerse19(container) {
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.FogExp2(0x000814, 0.001);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 15);
    
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
    const theme = colorThemes[6];
    
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111122,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Create nuclear reaction visuals
    createNuclearReaction(theme);
    
    // Create text labels
    createTextLabels(theme);
    
    // Add particle effects for background
    createParticleEffects();
    
    // Add click interaction to start transformation
    renderer.domElement.addEventListener('click', startTransformation);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createNuclearReaction(theme) {
    // Create nucleus group
    nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);
    
    // Create nucleus core (uranium/heavy element)
    const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.primary),
        roughness: 0.3,
        metalness: 0.8,
        emissive: new THREE.Color(theme.primary).multiplyScalar(0.2)
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.castShadow = true;
    nucleusGroup.add(core);
    
    // Add protons and neutrons to the nucleus
    const nucleonCount = 20;
    const nucleonSize = 0.4;
    
    for (let i = 0; i < nucleonCount; i++) {
        // Determine if proton or neutron
        const isProton = i % 2 === 0;
        
        const nucleonGeometry = new THREE.SphereGeometry(nucleonSize, 16, 16);
        const nucleonMaterial = new THREE.MeshStandardMaterial({ 
            color: isProton ? 0xff6666 : 0x6666ff,
            roughness: 0.7,
            metalness: 0.3
        });
        const nucleon = new THREE.Mesh(nucleonGeometry, nucleonMaterial);
        
        // Position within nucleus radius
        const angle = i * (Math.PI * 2 / nucleonCount);
        const radiusVariation = 0.8 + Math.random() * 0.4;
        const radius = 1 * radiusVariation;
        
        nucleon.position.x = Math.cos(angle) * radius;
        nucleon.position.y = (Math.random() - 0.5) * radius;
        nucleon.position.z = Math.sin(angle) * radius;
        
        nucleon.userData = {
            isProton: isProton,
            originalPosition: nucleon.position.clone(),
            vibrationAmplitude: 0.05 + Math.random() * 0.05,
            vibrationSpeed: 0.5 + Math.random()
        };
        
        nucleusGroup.add(nucleon);
    }
    
    // Create energy emitter for nuclear reaction
    particleEmitter = new THREE.Group();
    scene.add(particleEmitter);
    
    // Pre-create some energy waves that will be activated during transformation
    for (let i = 0; i < 5; i++) {
        const waveGeometry = new THREE.TorusGeometry(i * 2 + 2, 0.2, 16, 50);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(theme.secondary),
            transparent: true,
            opacity: 0,
            wireframe: true
        });
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.rotation.x = Math.PI / 2;
        wave.visible = false;
        
        scene.add(wave);
        energyWaves.push(wave);
    }
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
    createText("Mass (Saṃsāra)", new THREE.Vector3(0, -1, 0), new THREE.Color(theme.primary));
    createText("Energy (Nirvāṇa)", new THREE.Vector3(0, 6, 0), new THREE.Color(theme.secondary));
    createText("E = mc²", new THREE.Vector3(0, 3, 0), 0xffffff, 1.5);
    createText("Click to Transform", new THREE.Vector3(0, 8, 0), 0xffffff);
}

function createParticleEffects() {
    // Create a starfield background
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

function startTransformation() {
    if (transformationActive) return;
    
    transformationActive = true;
    
    // Clear existing labels
    textLabels.forEach(label => {
        scene.remove(label);
        if (label.material.map) {
            label.material.map.dispose();
        }
        label.material.dispose();
    });
    textLabels = [];
    
    // Add transformation text
    createText("Mass transforms into Energy", new THREE.Vector3(0, 8, 0), 0xffffff, 1.2);
    createText("Saṃsāra transforms into Nirvāṇa", new THREE.Vector3(0, 6, 0), 0xffff00, 1);
    
    // Trigger explosion animation
    triggerNuclearTransformation();
}

function triggerNuclearTransformation() {
    // Start with a small delay to build anticipation
    setTimeout(() => {
        // First make nucleus unstable
        nucleusGroup.children.forEach((child, index) => {
            if (index > 0) { // Skip the core
                // Increase vibration of nucleons
                if (child.userData) {
                    child.userData.vibrationAmplitude *= 3;
                    child.userData.vibrationSpeed *= 2;
                }
            }
        });
        
        // After slight delay, start explosion
        setTimeout(() => {
            // Explode nucleons outward
            nucleusGroup.children.forEach((child, index) => {
                if (index > 0) { // Skip the core
                    const direction = child.position.clone().normalize();
                    const speed = 0.05 + Math.random() * 0.05;
                    child.userData.explosionDir = direction;
                    child.userData.explosionSpeed = speed;
                }
            });
            
            // Shrink the core as mass converts to energy
            const coreShrinkInterval = setInterval(() => {
                const core = nucleusGroup.children[0];
                core.scale.multiplyScalar(0.98);
                
                if (core.scale.x < 0.1) {
                    clearInterval(coreShrinkInterval);
                    core.visible = false;
                    
                    // Add transformation complete text
                    createText("Transformation Complete", new THREE.Vector3(0, 0, 0), 0xffffff, 1.2);
                    createText("Both states are interconvertible and not separate", new THREE.Vector3(0, -2, 0), 0xffff00, 1);
                }
            }, 50);
            
            // Activate energy waves
            energyWaves.forEach((wave, index) => {
                wave.visible = true;
                wave.userData = {
                    expansionRate: 0.1 + index * 0.02,
                    maxRadius: 20 + index * 5,
                    originalRadius: wave.geometry.parameters.radius
                };
                
                // Stagger the wave activation
                setTimeout(() => {
                    wave.material.opacity = 0.7;
                }, index * 200);
            });
        }, 1000);
    }, 500);
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
    
    // Animate nucleus before transformation
    if (!transformationActive) {
        nucleusGroup.children.forEach((child, index) => {
            if (index > 0 && child.userData) { // Skip the core
                // Apply vibration to nucleons
                const time = Date.now() * 0.001;
                const amplitude = child.userData.vibrationAmplitude;
                const speed = child.userData.vibrationSpeed;
                const originalPos = child.userData.originalPosition;
                
                child.position.x = originalPos.x + Math.sin(time * speed) * amplitude;
                child.position.y = originalPos.y + Math.cos(time * speed * 1.3) * amplitude;
                child.position.z = originalPos.z + Math.sin(time * speed * 0.7) * amplitude;
            }
        });
        
        // Rotate nucleus slightly
        nucleusGroup.rotation.y += 0.005;
    } else {
        // Animate explosion after transformation starts
        nucleusGroup.children.forEach((child, index) => {
            if (index > 0 && child.userData && child.userData.explosionDir) { // Skip the core
                // Move nucleons outward
                child.position.add(child.userData.explosionDir.clone().multiplyScalar(child.userData.explosionSpeed));
                
                // Fade out nucleons
                if (child.material.opacity > 0) {
                    child.material.opacity -= 0.01;
                }
                
                // Remove completely when far away
                if (child.position.length() > 20) {
                    child.visible = false;
                }
            }
        });
        
        // Animate energy waves
        energyWaves.forEach(wave => {
            if (wave.visible && wave.userData) {
                // Expand waves
                const currentRadius = wave.geometry.parameters.radius;
                if (currentRadius < wave.userData.maxRadius) {
                    // Replace with larger geometry
                    const newRadius = currentRadius + wave.userData.expansionRate;
                    wave.geometry.dispose();
                    wave.geometry = new THREE.TorusGeometry(newRadius, 0.2, 16, 50);
                    
                    // Fade out as they expand
                    wave.material.opacity = Math.max(0, wave.material.opacity - 0.002);
                }
            }
        });
    }
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

export function cleanupVerse19() {
    // Stop animation
    cancelAnimationFrame(animationFrameId);
    
    // Remove event listeners
    renderer.domElement.removeEventListener('click', startTransformation);
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
    nucleusGroup = null;
    particleEmitter = null;
    energyWaves = [];
    transformationActive = false;
    textLabels = [];
}

