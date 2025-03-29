import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let bosonGroup, fermionGroup;
let animationFrameId;

export function initVerse13(container) {
    // Setup basic Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const theme = colorThemes[0]; // Use the theme for verse 13
    
    // Create boson group (photons that can occupy the same state)
    bosonGroup = new THREE.Group();
    scene.add(bosonGroup);
    
    // Create fermion group (electrons that repel each other)
    fermionGroup = new THREE.Group();
    scene.add(fermionGroup);
    
    // Create photons (bosons)
    const photonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const photonMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.primary),
        emissive: new THREE.Color(theme.primary).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.8
    });
    
    // Create a center point for bosons
    const bosonCenter = new THREE.Vector3(-5, 0, 0);
    
    // Add multiple photons at almost the same position
    for (let i = 0; i < 30; i++) {
        const photon = new THREE.Mesh(photonGeometry, photonMaterial);
        const offset = 0.05;
        photon.position.set(
            bosonCenter.x + (Math.random() - 0.5) * offset,
            bosonCenter.y + (Math.random() - 0.5) * offset,
            bosonCenter.z + (Math.random() - 0.5) * offset
        );
        photon.scale.setScalar(1 + Math.random() * 0.5);
        bosonGroup.add(photon);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(theme.primary),
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        photon.add(glow);
    }
    
    // Create electrons (fermions)
    const electronGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const electronMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(theme.secondary),
        emissive: new THREE.Color(theme.secondary).multiplyScalar(0.3)
    });
    
    // Create electrons that repel each other
    const electronCount = 15;
    const radius = 5;
    
    for (let i = 0; i < electronCount; i++) {
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        // Distribute electrons evenly in a circle on the right side
        const angle = (i / electronCount) * Math.PI * 2;
        electron.position.set(
            5 + Math.cos(angle) * radius * 0.5,
            Math.sin(angle) * radius * 0.5,
            0
        );
        electron.userData = { 
            angle: angle,
            speed: 0.01 + Math.random() * 0.01,
            radius: 2 + Math.random() * 1
        };
        fermionGroup.add(electron);
        
        // Add negative charge indicator
        const chargeGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
        const chargeMaterial = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color(theme.accent),
            transparent: true,
            opacity: 0.8
        });
        const charge = new THREE.Mesh(chargeGeometry, chargeMaterial);
        charge.rotation.x = Math.PI / 2;
        electron.add(charge);
    }
    
    // Create a divider to separate the two concepts
    const dividerGeometry = new THREE.PlaneGeometry(0.2, 15);
    const dividerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
    scene.add(divider);
    
    // Add labels
    createTextSprite("Conditioned Phenomena\n(Fermions/Electrons)", new THREE.Vector3(5, 4, 0), 0xffffff);
    createTextSprite("Unconditioned Nirvāṇa\n(Bosons/Photons)", new THREE.Vector3(-5, 4, 0), 0xffffff);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createTextSprite(text, position, color = 0xffffff) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'Bold 40px Arial';
    context.fillStyle = `rgba(255, 255, 255, 1.0)`;
    context.textAlign = 'center';
    
    const lines = text.split('\n');
    let y = canvas.height / 2 - (lines.length - 1) * 25;
    
    lines.forEach(line => {
        context.fillText(line, canvas.width / 2, y);
        y += 50;
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(10, 5, 1);
    scene.add(sprite);
    
    return sprite;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Animate bosons (photons) pulsing
    bosonGroup.children.forEach((photon, i) => {
        const t = Date.now() * 0.001 + i;
        photon.scale.setScalar(1 + 0.2 * Math.sin(t * 2));
        
        // Make photons slightly move around their center
        photon.position.x = -5 + Math.sin(t + i) * 0.1;
        photon.position.y = Math.cos(t * 1.1 + i) * 0.1;
        photon.position.z = Math.sin(t * 0.7 + i) * 0.1;
        
        // Make the glow pulsate
        if (photon.children.length > 0) {
            photon.children[0].scale.setScalar(1.5 + 0.5 * Math.sin(t * 3));
        }
    });
    
    // Animate fermions (electrons) repelling each other
    fermionGroup.children.forEach((electron, i) => {
        const userData = electron.userData;
        userData.angle += userData.speed;
        
        electron.position.x = 5 + Math.cos(userData.angle) * userData.radius;
        electron.position.y = Math.sin(userData.angle) * userData.radius;
        
        // Rotate the charge indicator
        if (electron.children.length > 0) {
            electron.children[0].rotation.z += 0.02;
        }
    });
    
    // Rotate the boson group slowly
    bosonGroup.rotation.y += 0.005;
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

export function cleanupVerse13() {
    // Stop animation loop
    cancelAnimationFrame(animationFrameId);
    
    // Remove event listener
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
    bosonGroup = null;
    fermionGroup = null;
}

