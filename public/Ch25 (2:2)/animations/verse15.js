import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorThemes } from '../config.js';

let scene, camera, renderer, controls;
let train, platform, observer1, observer2;
let tracks = [];
let animationFrameId;

export function initVerse15(container) {
    // Clear any existing content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    
    // Add fog for atmosphere
    scene.fog = new THREE.FogExp2(0x000814, 0.01);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 30);
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Setup controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Add spotlights for dramatic lighting
    const spotLight1 = new THREE.SpotLight(0x8080ff, 1);
    spotLight1.position.set(-20, 15, 10);
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.3;
    scene.add(spotLight1);
    
    const spotLight2 = new THREE.SpotLight(0xff8080, 1);
    spotLight2.position.set(20, 15, 10);
    spotLight2.angle = Math.PI / 6;
    spotLight2.penumbra = 0.3;
    scene.add(spotLight2);
    
    // Use theme colors
    const theme = colorThemes[2];
    
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111122,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Create railway tracks
    createRailwayTracks();
    
    // Create train
    createTrain(theme);
    
    // Create platform
    createPlatform(theme);
    
    // Create observers
    createObservers(theme);
    
    // Add text labels
    createTextLabels();
    
    // Add stars in the background
    createStars();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

function createRailwayTracks() {
    // Create sleepers (the wooden/concrete beams)
    for (let i = -50; i <= 50; i += 2) {
        const sleeperGeometry = new THREE.BoxGeometry(5, 0.3, 0.8);
        const sleeperMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a3520,
            roughness: 0.9,
            metalness: 0.1
        });
        const sleeper = new THREE.Mesh(sleeperGeometry, sleeperMaterial);
        sleeper.position.set(0, 0.15, i);
        sleeper.receiveShadow = true;
        sleeper.castShadow = true;
        scene.add(sleeper);
    }
    
    // Create rails
    const railGeometry = new THREE.BoxGeometry(0.5, 0.3, 100);
    const railMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x777777,
        roughness: 0.6,
        metalness: 0.8
    });
    
    const leftRail = new THREE.Mesh(railGeometry, railMaterial);
    leftRail.position.set(-1.5, 0.3, 0);
    leftRail.receiveShadow = true;
    leftRail.castShadow = true;
    scene.add(leftRail);
    
    const rightRail = new THREE.Mesh(railGeometry, railMaterial);
    rightRail.position.set(1.5, 0.3, 0);
    rightRail.receiveShadow = true;
    rightRail.castShadow = true;
    scene.add(rightRail);
    
    // Store rails for animation
    tracks = [leftRail, rightRail];
}

function createTrain(theme) {
    train = new THREE.Group();
    
    // Create train body
    const bodyGeometry = new THREE.BoxGeometry(3, 2.5, 7);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.primary),
        roughness: 0.7,
        metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.55;
    body.castShadow = true;
    body.receiveShadow = true;
    train.add(body);
    
    // Create train roof
    const roofGeometry = new THREE.BoxGeometry(3.2, 0.5, 7.2);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.secondary),
        roughness: 0.7,
        metalness: 0.3
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3.05;
    roof.castShadow = true;
    roof.receiveShadow = true;
    train.add(roof);
    
    // Create windows
    const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x88ccff,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7
    });
    
    // Front windows
    const frontWindowGeometry = new THREE.PlaneGeometry(2, 1.2);
    const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
    frontWindow.position.set(0, 1.8, 3.51);
    train.add(frontWindow);
    
    // Side windows
    for (let i = -2; i <= 2; i += 1) {
        if (i === 0) continue; // Skip middle for door
        
        const windowGeometry = new THREE.PlaneGeometry(0.8, 1);
        
        // Left side window
        const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        leftWindow.position.set(-1.51, 1.8, i);
        leftWindow.rotation.y = Math.PI / 2;
        train.add(leftWindow);
        
        // Right side window
        const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        rightWindow.position.set(1.51, 1.8, i);
        rightWindow.rotation.y = -Math.PI / 2;
        train.add(rightWindow);
    }
    
    // Create wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.5
    });
    
    // Add 8 wheels, 4 on each side
    for (let i = -2.5; i <= 2.5; i += 1.6) {
        for (let j = -1.7; j <= 1.7; j += 3.4) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(j, 0.5, i);
            wheel.rotation.x = Math.PI / 2;
            wheel.castShadow = true;
            train.add(wheel);
        }
    }
    
    // Position train on tracks
    train.position.set(0, 0, -10);
    scene.add(train);
}

function createPlatform(theme) {
    platform = new THREE.Group();
    
    // Platform base
    const baseGeometry = new THREE.BoxGeometry(8, 1, 12);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x555555,
        roughness: 0.9,
        metalness: 0.1
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.5;
    base.receiveShadow = true;
    platform.add(base);
    
    // Platform top layer
    const topGeometry = new THREE.BoxGeometry(8, 0.2, 12);
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x777777,
        roughness: 0.8,
        metalness: 0.2
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 1.1;
    top.receiveShadow = true;
    platform.add(top);
    
    // Platform benches
    const benchGeometry = new THREE.BoxGeometry(2, 0.3, 0.8);
    const benchMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.accent),
        roughness: 0.7,
        metalness: 0.3
    });
    
    for (let i = -3; i <= 3; i += 3) {
        const bench = new THREE.Mesh(benchGeometry, benchMaterial);
        bench.position.set(i, 1.45, -2);
        bench.castShadow = true;
        platform.add(bench);
        
        // Bench legs
        const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            roughness: 0.7,
            metalness: 0.4
        });
        
        for (let j = -0.8; j <= 0.8; j += 1.6) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(i + j, 1.15, -2);
            leg.castShadow = true;
            platform.add(leg);
        }
    }
    
    // Platform roof support columns
    const columnGeometry = new THREE.BoxGeometry(0.3, 3, 0.3);
    const columnMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x777777,
        roughness: 0.6,
        metalness: 0.4
    });
    
    for (let i = -5; i <= 5; i += 5) {
        for (let j = -5; j <= 5; j += 10) {
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(i, 2.6, j);
            column.castShadow = true;
            platform.add(column);
        }
    }
    
    // Platform roof
    const roofGeometry = new THREE.BoxGeometry(11, 0.2, 12);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x555555,
        roughness: 0.8,
        metalness: 0.2
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 4.1;
    roof.castShadow = true;
    platform.add(roof);
    
    // Position platform
    platform.position.set(6, 0, 0);
    scene.add(platform);
}

function createObservers(theme) {
    // Create observer on the train
    observer1 = new THREE.Group();
    
    // Observer body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.primary),
        roughness: 0.7,
        metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    observer1.add(body);
    
    // Observer head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffddcc,
        roughness: 0.7,
        metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    head.castShadow = true;
    observer1.add(head);
    
    // Position observer1 on train
    observer1.position.set(0, 1.5, 0);
    train.add(observer1);
    
    // Create observer on the platform
    observer2 = observer1.clone();
    observer2.scale.setScalar(0.8); // Slightly smaller for differentiation
    observer2.children[0].material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(theme.secondary),
        roughness: 0.7,
        metalness: 0.3
    });
    
    // Position observer2 on platform
    observer2.position.set(-2, 1.3, 0);
    platform.add(observer2);
}

function createTextLabels() {
    // Helper function to create text label
    function createLabel(text, position, color = 0xffffff, size = 0.5) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 60px Arial';
        context.fillStyle = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 1.0)`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(size * 10, size * 2.5, 1);
        
        return sprite;
    }
    
    // Create labels for train and platform observer
    const trainLabel = createLabel('Moving Reference Frame', new THREE.Vector3(0, 6, -10), new THREE.Color(0xffffff));
    scene.add(trainLabel);
    
    const platformLabel = createLabel('Stationary Reference Frame', new THREE.Vector3(6, 6, 0), new THREE.Color(0xffffff));
    scene.add(platformLabel);
    
    // Create nirvana label
    const nirvanaLabel = createLabel("Nirvāņa's Perspective", new THREE.Vector3(0, 12, -20), new THREE.Color(0xffff00), 0.6);
    scene.add(nirvanaLabel);
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Move train along tracks
    train.position.z += 0.1;
    if (train.position.z > 50) {
        train.position.z = -50;
    }
    
    // Rotate train wheels
    train.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry) {
            child.rotation.x += 0.1;
        }
    });
    
    // Update observer on train to face camera
    const angle = Math.atan2(
        camera.position.x - train.position.x,
        camera.position.z - train.position.z
    );
    observer1.rotation.y = angle;
    
    // Update observer on platform to face train
    const angle2 = Math.atan2(
        train.position.x - platform.position.x,
        train.position.z - platform.position.z
    );
    observer2.rotation.y = angle2;
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

export function cleanupVerse15() {
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
    train = null;
    platform = null;
    observer1 = null;
    observer2 = null;
    tracks = [];
}