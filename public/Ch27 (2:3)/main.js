import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { verses } from './config.js';

// Animation state tracking
let currentVerseIndex = 0;
let animationMixer;
let currentScene;
let renderer, camera, controls;
let clock = new THREE.Clock();

// Set up the base renderer and camera
function initBaseScene() {
    const container = document.getElementById('animation-container');
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Animation scenes for each verse
function createVerse11Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020924);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xa8e0ff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Quantum circuit base
    const circuitBase = new THREE.Group();
    scene.add(circuitBase);
    
    // Create quantum bit wires
    const wireGeometry = new THREE.CylinderGeometry(0.02, 0.02, 10, 16);
    const wireMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2, emissive: 0x172b4d });
    
    for (let i = 0; i < 3; i++) {
        const wire = new THREE.Mesh(wireGeometry, wireMaterial);
        wire.rotation.z = Math.PI / 2; // Rotate to horizontal
        wire.position.y = i - 1;
        circuitBase.add(wire);
    }
    
    // Create quantum gates
    const gateGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const gateMaterial = new THREE.MeshPhongMaterial({ color: 0xff5a5f, emissive: 0x491819 });
    
    const gates = [];
    const gatePositions = [
        [-3, 0, 0], [-1.5, 1, 0], [0, -1, 0], [1.5, 0, 0], [3, 1, 0]
    ];
    
    gatePositions.forEach(pos => {
        const gate = new THREE.Mesh(gateGeometry, gateMaterial);
        gate.position.set(pos[0], pos[1], pos[2]);
        gates.push(gate);
        circuitBase.add(gate);
    });
    
    // Create quantum particles (qubits)
    const particleGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        emissive: 0x88ccee,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = [];
    for (let i = 0; i < 5; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(-4 + i * 2, -1 + Math.floor(Math.random() * 3), 0);
        particles.push(particle);
        scene.add(particle);
    }
    
    // Error particles
    const errorGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const errorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000, 
        emissive: 0x660000,
        transparent: true,
        opacity: 0.7
    });
    
    const errors = [];
    for (let i = 0; i < 3; i++) {
        const error = new THREE.Mesh(errorGeometry, errorMaterial);
        error.position.set(-3 + i * 3, -1 + Math.floor(Math.random() * 3), 0);
        error.scale.set(0, 0, 0); // Start invisible
        errors.push(error);
        scene.add(error);
    }
    
    // Animation function
    const animate = () => {
        // Animate particles moving along the circuit
        particles.forEach((particle, i) => {
            particle.position.x = (particle.position.x + 0.01) % 6 - 3;
            
            // Oscillate up and down slightly
            particle.position.y = Math.floor(particle.position.y) + Math.sin(Date.now() * 0.002 + i) * 0.2;
        });
        
        // Animate error particles
        errors.forEach((error, i) => {
            const pulseScale = (Math.sin(Date.now() * 0.003 + i * 2) + 1) * 0.5;
            error.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Orbit around their position
            const angle = Date.now() * 0.001 + i * (Math.PI * 2 / 3);
            error.position.z = Math.sin(angle) * 0.3;
            error.position.x = -3 + i * 3 + Math.cos(angle) * 0.3;
        });
        
        // Animate gates pulsing
        gates.forEach((gate, i) => {
            const scale = 1 + Math.sin(Date.now() * 0.002 + i) * 0.1;
            gate.scale.set(scale, scale, scale);
        });
    };
    
    return { scene, animate };
}

function createVerse12Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010B19);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xaaffff, 1, 20);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);
    
    // Create quantum vacuum field
    const vacuumGroup = new THREE.Group();
    scene.add(vacuumGroup);
    
    // Grid to represent energy field
    const gridSize = 20;
    const gridStep = 0.5;
    const gridGeometry = new THREE.BufferGeometry();
    const gridPositions = [];
    const gridColors = [];
    
    for (let x = -gridSize/2; x <= gridSize/2; x += gridStep) {
        for (let z = -gridSize/2; z <= gridSize/2; z += gridStep) {
            gridPositions.push(x, 0, z);
            const intensity = Math.random() * 0.3 + 0.1;
            gridColors.push(intensity * 0.2, intensity * 0.5, intensity);
        }
    }
    
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    gridGeometry.setAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3));
    
    const gridMaterial = new THREE.PointsMaterial({ 
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
    });
    
    const gridPoints = new THREE.Points(gridGeometry, gridMaterial);
    vacuumGroup.add(gridPoints);
    
    // Particle pairs that will emerge from vacuum
    const particlePairs = [];
    const maxPairs = 12;
    
    // Create initial pairs
    for (let i = 0; i < maxPairs; i++) {
        createParticlePair();
    }
    
    function createParticlePair() {
        // Random position for the pair
        const x = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;
        
        // Create particle geometry
        const particleGeometry = new THREE.SphereGeometry(0.1, 12, 12);
        
        // Material for particle
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x88ccff,
            emissive: 0x2255aa,
            transparent: true,
            opacity: 0
        });
        
        // Material for antiparticle
        const antiParticleMaterial = new THREE.MeshPhongMaterial({
            color: 0xff8888,
            emissive: 0xaa2255,
            transparent: true,
            opacity: 0
        });
        
        // Create meshes
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const antiParticle = new THREE.Mesh(particleGeometry, antiParticleMaterial);
        
        // Position at the same spot initially
        particle.position.set(x, 0, z);
        antiParticle.position.set(x, 0, z);
        
        // Add to scene
        scene.add(particle);
        scene.add(antiParticle);
        
        // Track animation state
        particlePairs.push({
            particle,
            antiParticle,
            phase: 0, // 0-1 for lifecycle
            speed: 0.002 + Math.random() * 0.003,
            angle: Math.random() * Math.PI * 2
        });
    }
    
    // Animation function
    const animate = () => {
        // Animate vacuum energy field
        gridPoints.rotation.y += 0.001;
        
        // Update all particle pairs
        particlePairs.forEach((pair, index) => {
            pair.phase += pair.speed;
            
            if (pair.phase < 1) {
                // Growth phase - particles emerge and move apart
                const appearScale = Math.sin(pair.phase * Math.PI) * 1.5;
                
                pair.particle.material.opacity = appearScale < 0.1 ? 0 : Math.min(appearScale, 1);
                pair.antiParticle.material.opacity = pair.particle.material.opacity;
                
                pair.particle.scale.set(appearScale, appearScale, appearScale);
                pair.antiParticle.scale.set(appearScale, appearScale, appearScale);
                
                // Move away from each other
                const distance = pair.phase * 0.7;
                pair.particle.position.x += Math.cos(pair.angle) * 0.01;
                pair.particle.position.z += Math.sin(pair.angle) * 0.01;
                pair.particle.position.y = Math.sin(pair.phase * Math.PI) * 0.5;
                
                pair.antiParticle.position.x -= Math.cos(pair.angle) * 0.01;
                pair.antiParticle.position.z -= Math.sin(pair.angle) * 0.01;
                pair.antiParticle.position.y = Math.sin(pair.phase * Math.PI) * 0.5;
            } else {
                // Reset this pair
                scene.remove(pair.particle);
                scene.remove(pair.antiParticle);
                particlePairs[index] = null;
                
                // Create a new pair
                createParticlePair();
            }
        });
        
        // Clean up null entries
        for (let i = particlePairs.length - 1; i >= 0; i--) {
            if (particlePairs[i] === null) {
                particlePairs.splice(i, 1);
            }
        }
    };
    
    return { scene, animate };
}

function createVerse13Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create central tetralemma structure - representing the four extreme views
    const tetralemmaGroup = new THREE.Group();
    scene.add(tetralemmaGroup);
    
    // Central core - representing emptiness/indeterminacy
    const coreGeometry = new THREE.IcosahedronGeometry(0.5, 1);
    const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x88aaee,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    tetralemmaGroup.add(core);
    
    // The four views as orbital paths
    const orbitalMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4488ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    // Create orbital rings for the four views
    const orbitalPaths = [];
    const orbitalAngles = [0, Math.PI/2, Math.PI, -Math.PI/2];
    
    orbitalAngles.forEach(angle => {
        const ringGeo = new THREE.TorusGeometry(2, 0.03, 16, 64);
        const ring = new THREE.Mesh(ringGeo, orbitalMaterial);
        ring.rotation.y = angle;
        tetralemmaGroup.add(ring);
        orbitalPaths.push(ring);
    });
    
    // View labels (represented as glowing spheres with different colors)
    const viewColors = [
        0xff5a5f, // "The self occurred" - Red
        0x0077cc, // "The self did not occur" - Blue
        0xffbd00, // "Both" - Yellow
        0x66c2a5  // "Neither" - Teal
    ];
    
    const viewNames = ["Existence", "Non-existence", "Both", "Neither"];
    
    const viewSpheres = [];
    const viewGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    
    viewColors.forEach((color, i) => {
        const viewMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: new THREE.Color(color).multiplyScalar(0.3),
            transparent: true,
            opacity: 0.9
        });
        
        const sphere = new THREE.Mesh(viewGeometry, viewMaterial);
        sphere.userData = { 
            position: i,
            orbitRadius: 2,
            orbitSpeed: 0.2 + Math.random() * 0.1,
            angle: i * Math.PI/2,
            viewName: viewNames[i]
        };
        
        // Position on its orbit
        sphere.position.x = Math.cos(sphere.userData.angle) * sphere.userData.orbitRadius;
        sphere.position.z = Math.sin(sphere.userData.angle) * sphere.userData.orbitRadius;
        
        viewSpheres.push(sphere);
        tetralemmaGroup.add(sphere);
    });
    
    // Create quantum wave function representation
    const wavePoints = 100;
    const waveRadius = 3;
    const waveGeometry = new THREE.BufferGeometry();
    const wavePositions = new Float32Array(wavePoints * 3);
    const waveColors = new Float32Array(wavePoints * 3);
    
    for (let i = 0; i < wavePoints; i++) {
        const angle = (i / wavePoints) * Math.PI * 2;
        const x = Math.cos(angle) * waveRadius;
        const z = Math.sin(angle) * waveRadius;
        const y = 0;
        
        wavePositions[i * 3] = x;
        wavePositions[i * 3 + 1] = y;
        wavePositions[i * 3 + 2] = z;
        
        // Color gradient from blue to purple
        const colorPhase = i / wavePoints;
        waveColors[i * 3] = 0.3 + colorPhase * 0.3;
        waveColors[i * 3 + 1] = 0.2;
        waveColors[i * 3 + 2] = 0.5 + colorPhase * 0.5;
    }
    
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));
    
    const waveMaterial = new THREE.LineBasicMaterial({ 
        vertexColors: true,
        transparent: true, 
        opacity: 0.7
    });
    
    const waveLine = new THREE.Line(waveGeometry, waveMaterial);
    waveLine.position.y = -2;
    scene.add(waveLine);
    
    // Create collapse effect for user interaction
    let isCollapsing = false;
    let collapseTarget = null;
    let collapseFactor = 0;
    
    // Add event listener for user interaction
    window.addEventListener('click', () => {
        if (!isCollapsing) {
            isCollapsing = true;
            collapseFactor = 0;
            
            // Randomly select one of the views to collapse to
            const randomView = Math.floor(Math.random() * viewSpheres.length);
            collapseTarget = viewSpheres[randomView];
        }
    });
    
    // Animation function
    const animate = () => {
        // Rotate tetralemma structure slowly
        tetralemmaGroup.rotation.y += 0.003;
        
        // Animate core
        core.rotation.x += 0.01;
        core.rotation.z += 0.007;
        core.scale.x = core.scale.y = core.scale.z = 1 + Math.sin(Date.now() * 0.001) * 0.1;
        
        // Animate view spheres along their orbits
        viewSpheres.forEach(sphere => {
            sphere.userData.angle += 0.005 * sphere.userData.orbitSpeed;
            sphere.position.x = Math.cos(sphere.userData.angle) * sphere.userData.orbitRadius;
            sphere.position.z = Math.sin(sphere.userData.angle) * sphere.userData.orbitRadius;
            
            // Pulsate slightly
            const scale = 1 + Math.sin(Date.now() * 0.002 + sphere.userData.position) * 0.1;
            sphere.scale.set(scale, scale, scale);
        });
        
        // Animate orbitalPaths
        orbitalPaths.forEach((ring, i) => {
            ring.rotation.x += 0.001 * (i % 2 ? 1 : -1);
            ring.rotation.z += 0.0005 * (i % 3 ? 1 : -1);
        });
        
        // Animate wave function
        const positions = waveLine.geometry.attributes.position.array;
        for (let i = 0; i < wavePoints; i++) {
            const angle = (i / wavePoints) * Math.PI * 2;
            const time = Date.now() * 0.001;
            const height = Math.sin(angle * 4 + time) * 0.5 + Math.sin(angle * 2.5 - time * 0.7) * 0.3;
            positions[i * 3 + 1] = height;
        }
        waveLine.geometry.attributes.position.needsUpdate = true;
        waveLine.rotation.y += 0.002;
        
        // Handle collapse effect
        if (isCollapsing) {
            collapseFactor += 0.01;
            
            if (collapseFactor < 1) {
                // Collapse the wave function
                viewSpheres.forEach(sphere => {
                    if (sphere !== collapseTarget) {
                        // Fade out other views
                        sphere.material.opacity = 1 - collapseFactor;
                        sphere.scale.multiplyScalar(0.99);
                    } else {
                        // Emphasize target view
                        sphere.material.opacity = 1;
                        sphere.scale.set(1 + collapseFactor * 0.5, 1 + collapseFactor * 0.5, 1 + collapseFactor * 0.5);
                    }
                });
                
                // Collapse wave function
                waveLine.material.opacity = 1 - collapseFactor;
                
                // Core collapses as well
                core.material.opacity = 1 - collapseFactor * 0.7;
                orbitalPaths.forEach(ring => {
                    ring.material.opacity = 0.3 - collapseFactor * 0.3;
                });
            } else {
                // Reset after collapse is complete
                setTimeout(() => {
                    isCollapsing = false;
                    viewSpheres.forEach(sphere => {
                        sphere.material.opacity = 0.9;
                        sphere.scale.set(1, 1, 1);
                    });
                    waveLine.material.opacity = 0.7;
                    core.material.opacity = 0.9;
                    orbitalPaths.forEach(ring => {
                        ring.material.opacity = 0.3;
                    });
                }, 1000);
            }
        }
    };
    
    return { scene, animate };
}

function createVerse14Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x051426);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create wave function visualization
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);
    
    // Create grid for probability space
    const gridSize = 20;
    const gridDivisions = 20;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x0044aa, 0x002255);
    gridHelper.position.y = -1;
    waveGroup.add(gridHelper);
    
    // Create wave function mesh
    const waveWidth = 10;
    const waveResolution = 50;
    const waveGeometry = new THREE.PlaneGeometry(waveWidth, waveWidth, waveResolution, waveResolution);
    
    const waveMaterial = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        emissive: 0x0044aa,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        wireframe: true
    });
    
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = -Math.PI / 2;
    waveGroup.add(waveMesh);
    
    // Add probability particles
    const particleCount = 150;
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle with random color
        const hue = Math.random();
        const particleColor = new THREE.Color().setHSL(hue, 0.8, 0.6);
        
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: particleColor,
            emissive: particleColor.clone().multiplyScalar(0.2),
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random initial position
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 3 + 1;
        particle.position.x = Math.cos(angle) * radius;
        particle.position.z = Math.sin(angle) * radius;
        particle.position.y = 0;
        
        particle.userData = {
            baseY: 0,
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.02,
            amplitude: 0.1 + Math.random() * 0.1,
            radius: radius,
            angle: angle,
            size: 0.05 + Math.random() * 0.1
        };
        
        particle.scale.set(
            particle.userData.size,
            particle.userData.size,
            particle.userData.size
        );
        
        particles.push(particle);
        waveGroup.add(particle);
    }
    
    // Create measurement visualization elements
    const measurementBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 10, 8),
        new THREE.MeshPhongMaterial({
            color: 0xff5a5f,
            emissive: 0xaa2233,
            transparent: true,
            opacity: 0
        })
    );
    measurementBeam.rotation.x = Math.PI / 2;
    measurementBeam.position.y = 3;
    waveGroup.add(measurementBeam);
    
    const measurementTarget = new THREE.Mesh(
        new THREE.CircleGeometry(0.5, 32),
        new THREE.MeshPhongMaterial({
            color: 0xff5a5f,
            emissive: 0xaa2233,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        })
    );
    measurementTarget.rotation.x = Math.PI / 2;
    waveGroup.add(measurementTarget);
    
    // Create time arrow
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 16);
    const arrowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffcc00,
        emissive: 0x884400
    });
    
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(5, 0, 0);
    arrow.rotation.z = -Math.PI / 2;
    waveGroup.add(arrow);
    
    const arrowLine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 2, 8),
        arrowMaterial
    );
    arrowLine.position.set(4, 0, 0);
    arrowLine.rotation.z = Math.PI / 2;
    waveGroup.add(arrowLine);
    
    // Add "future" text as a sprite
    const makeTextSprite = (text, position, color) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold 40px Arial";
        context.fillStyle = "rgba(255,255,255,0.9)";
        context.fillText(text, 10, 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(2, 1, 1);
        return sprite;
    };
    
    const futureText = makeTextSprite("FUTURE", new THREE.Vector3(6, 0, 0));
    waveGroup.add(futureText);
    
    // Track measurement state
    let isMeasuring = false;
    let measurementProgress = 0;
    let measurementPos = new THREE.Vector3();
    
    // Add click handler for measurement
    window.addEventListener('click', () => {
        if (!isMeasuring) {
            isMeasuring = true;
            measurementProgress = 0;
            
            // Random position for measurement
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 4;
            measurementPos.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            
            measurementTarget.position.copy(measurementPos);
            measurementBeam.position.x = measurementPos.x;
            measurementBeam.position.z = measurementPos.z;
        }
    });
    
    // Animation function
    const animate = () => {
        const time = Date.now() * 0.001;
        
        // Animate wave function mesh
        const positions = waveMesh.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i+2];
            const distance = Math.sqrt(x*x + z*z);
            
            // Wave function shape
            positions[i+1] = Math.sin(distance - time) * 
                             Math.exp(-distance * 0.3) * 
                             Math.cos(x * 0.5) * 
                             Math.sin(z * 0.5 + time * 0.5) * 0.5;
        }
        waveMesh.geometry.attributes.position.needsUpdate = true;
        
        // Animate probability particles
        particles.forEach(particle => {
            const userData = particle.userData;
            
            // If not measuring, particles follow probability wave
            if (!isMeasuring) {
                // Update positions based on wave function
                userData.angle += userData.speed * 0.1;
                particle.position.x = Math.cos(userData.angle) * userData.radius;
                particle.position.z = Math.sin(userData.angle) * userData.radius;
                
                // Height based on wave
                const distance = Math.sqrt(
                    particle.position.x * particle.position.x + 
                    particle.position.z * particle.position.z
                );
                particle.position.y = Math.sin(distance - time) * 
                                     Math.exp(-distance * 0.3) * 
                                     0.5 + 
                                     Math.sin(userData.phase + time * 2) * userData.amplitude;
                
                // Pulsate size slightly
                const scale = userData.size + Math.sin(time * 2 + userData.phase) * 0.03;
                particle.scale.set(scale, scale, scale);
            } else {
                // During measurement, particles get attracted to measurement location
                const toTarget = new THREE.Vector3().subVectors(measurementPos, particle.position);
                const distance = toTarget.length();
                
                if (measurementProgress > 0.5 && distance < 2) {
                    // Move towards measurement position
                    toTarget.normalize().multiplyScalar(0.05 * measurementProgress);
                    particle.position.add(toTarget);
                    
                    // Reduce amplitude
                    userData.amplitude *= 0.95;
                    
                    // Collapse to ground
                    particle.position.y *= 0.9;
                    
                    // Make size more uniform
                    particle.scale.x = particle.scale.y = particle.scale.z = 
                        THREE.MathUtils.lerp(userData.size, 0.1, measurementProgress);
                }
            }
        });
        
        // Handle measurement visualization
        if (isMeasuring) {
            measurementProgress += 0.01;
            
            if (measurementProgress < 1) {
                // Fade in measurement beam
                measurementBeam.material.opacity = measurementProgress;
                measurementTarget.material.opacity = measurementProgress;
                
                // Animate measurement target
                measurementTarget.scale.set(
                    1 + Math.sin(measurementProgress * Math.PI) * 2,
                    1,
                    1 + Math.sin(measurementProgress * Math.PI) * 2
                );
            } else {
                // Fade out measurement effects
                measurementBeam.material.opacity *= 0.95;
                measurementTarget.material.opacity *= 0.95;
                
                if (measurementBeam.material.opacity < 0.01) {
                    isMeasuring = false;
                    // Reset particles
                    particles.forEach(particle => {
                        const userData = particle.userData;
                        userData.amplitude = 0.1 + Math.random() * 0.1;
                        userData.angle = Math.random() * Math.PI * 2;
                    });
                }
            }
        }
        
        // Animate arrow
        arrow.position.y = Math.sin(time) * 0.2;
        arrowLine.position.y = Math.sin(time) * 0.2;
        futureText.position.y = Math.sin(time) * 0.2;
    };
    
    return { scene, animate };
}

function createVerse15Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000B14);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(5, 10, 5);
    scene.add(pointLight);
    
    // Create divine and human representations
    const divineGroup = new THREE.Group();
    scene.add(divineGroup);
    
    // Divine entity - represented as a perfect, golden sphere
    const divineGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const divineMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0x885500,
        metalness: 0.8,
        roughness: 0.1
    });
    
    const divineSphere = new THREE.Mesh(divineGeometry, divineMaterial);
    divineSphere.position.set(-2.5, 2, 0);
    divineGroup.add(divineSphere);
    
    // Add glow effect to divine sphere
    const divineGlowGeometry = new THREE.SphereGeometry(1.6, 32, 32);
    const divineGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const divineGlow = new THREE.Mesh(divineGlowGeometry, divineGlowMaterial);
    divineSphere.add(divineGlow);
    
    // Add label for divine sphere
    const makeTextSprite = (text, position, color = 0xffffff) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold 40px Arial";
        context.fillStyle = "rgba(255,255,255,0.9)";
        context.fillText(text, 10, 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(2, 1, 1);
        return sprite;
    };
    
    const divineLabel = makeTextSprite("DIVINE", new THREE.Vector3(-2.5, 4, 0));
    divineGroup.add(divineLabel);
    
    // Human entity - represented as a changing form
    const humanGroup = new THREE.Group();
    scene.add(humanGroup);
    
    // Human body - simplified figure
    const humanGeometry = new THREE.CylinderGeometry(0.5, 0.3, 2, 8);
    const humanMaterial = new THREE.MeshStandardMaterial({
        color: 0x4488cc,
        emissive: 0x112244,
        metalness: 0.2,
        roughness: 0.8
    });
    
    const humanFigure = new THREE.Mesh(humanGeometry, humanMaterial);
    humanFigure.position.set(2.5, 1, 0);
    humanGroup.add(humanFigure);
    
    // Human head
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const headMaterial = humanMaterial.clone();
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    humanFigure.add(head);
    
    // Human label
    const humanLabel = makeTextSprite("HUMAN", new THREE.Vector3(2.5, 3, 0));
    humanGroup.add(humanLabel);
    
    // Particle systems for both entities
    
    // Divine particles - stable, orderly
    const divineParticleCount = 200;
    const divineParticles = new THREE.BufferGeometry();
    const divineParticlePositions = new Float32Array(divineParticleCount * 3);
    const divineParticleColors = new Float32Array(divineParticleCount * 3);
    
    for (let i = 0; i < divineParticleCount; i++) {
        // Position in a stable orbital shell
        const phi = Math.acos(-1 + (2 * i) / divineParticleCount);
        const theta = Math.sqrt(divineParticleCount * Math.PI) * phi;
        
        const x = 2 * Math.cos(theta) * Math.sin(phi);
        const y = 2 * Math.sin(theta) * Math.sin(phi);
        const z = 2 * Math.cos(phi);
        
        divineParticlePositions[i * 3] = x;
        divineParticlePositions[i * 3 + 1] = y;
        divineParticlePositions[i * 3 + 2] = z;
        
        // Golden color
        divineParticleColors[i * 3] = 1.0;     // R
        divineParticleColors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
        divineParticleColors[i * 3 + 2] = 0.3 + Math.random() * 0.2; // B
    }
    
    divineParticles.setAttribute('position', new THREE.BufferAttribute(divineParticlePositions, 3));
    divineParticles.setAttribute('color', new THREE.BufferAttribute(divineParticleColors, 3));
    
    const divineParticleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const divineParticleSystem = new THREE.Points(divineParticles, divineParticleMaterial);
    divineSphere.add(divineParticleSystem);
    
    // Human particles - decaying, changing
    const humanParticleCount = 100;
    const humanParticles = new THREE.BufferGeometry();
    const humanParticlePositions = new Float32Array(humanParticleCount * 3);
    const humanParticleColors = new Float32Array(humanParticleCount * 3);
    
    const humanParticleData = [];
    
    for (let i = 0; i < humanParticleCount; i++) {
        // Random positions around human figure
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 2;
        const radius = 0.5 + Math.random() * 0.5;
        
        const x = Math.cos(angle) * radius;
        const y = height;
        const z = Math.sin(angle) * radius;
        
        humanParticlePositions[i * 3] = x;
        humanParticlePositions[i * 3 + 1] = y;
        humanParticlePositions[i * 3 + 2] = z;
        
        // Blue color with variation
        humanParticleColors[i * 3] = 0.2 + Math.random() * 0.3;     // R
        humanParticleColors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
        humanParticleColors[i * 3 + 2] = 0.7 + Math.random() * 0.3; // B
        
        // Save particle data for animation
        humanParticleData.push({
            startX: x,
            startY: y,
            startZ: z,
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.03,
            amplitude: 0.1 + Math.random() * 0.2,
            decay: 0.01 + Math.random() * 0.05,
            lifetime: 0
        });
    }
    
    humanParticles.setAttribute('position', new THREE.BufferAttribute(humanParticlePositions, 3));
    humanParticles.setAttribute('color', new THREE.BufferAttribute(humanParticleColors, 3));
    
    const humanParticleMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const humanParticleSystem = new THREE.Points(humanParticles, humanParticleMaterial);
    humanFigure.add(humanParticleSystem);
    
    // Create dividing line/barrier between divine and human
    const barrierGeometry = new THREE.PlaneGeometry(10, 5);
    const barrierMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.set(0, 2, 0);
    barrier.rotation.y = Math.PI / 2;
    scene.add(barrier);
    
    // Add text explanation
    const explanationText = makeTextSprite("PERMANENCE ≠ CHANGE", new THREE.Vector3(0, 5, 0));
    scene.add(explanationText);
    
    // Animation function
    const animate = () => {
        const time = Date.now() * 0.001;
        
        // Divine sphere is stable but slowly rotates (perfect and unchanging)
        divineSphere.rotation.y = time * 0.1;
        divineParticleSystem.rotation.y = -time * 0.2;
        divineParticleSystem.rotation.z = time * 0.05;
        
        // Divine glow pulsates slightly
        const glowScale = 1 + Math.sin(time * 0.5) * 0.05;
        divineGlow.scale.set(glowScale, glowScale, glowScale);
        
        // Human figure changes and decays
        humanFigure.scale.y = 1 + Math.sin(time * 1.5) * 0.1;
        humanFigure.rotation.y = Math.sin(time) * 0.2;
        
        // Update human particles to show decay
        const positions = humanParticleSystem.geometry.attributes.position.array;
        const colors = humanParticleSystem.geometry.attributes.color.array;
        
        for (let i = 0; i < humanParticleCount; i++) {
            const data = humanParticleData[i];
            data.lifetime += data.decay * 0.01;
            
            if (data.lifetime > 1) {
                // Reset decayed particle
                data.lifetime = 0;
                data.startX = (Math.random() - 0.5) * 1;
                data.startY = (Math.random() - 0.5) * 2;
                data.startZ = (Math.random() - 0.5) * 1;
                data.phase = Math.random() * Math.PI * 2;
            }
            
            // Update position with some random movement
            positions[i * 3] = data.startX + Math.sin(time * data.speed + data.phase) * data.amplitude;
            positions[i * 3 + 1] = data.startY + Math.cos(time * data.speed + data.phase) * data.amplitude;
            positions[i * 3 + 2] = data.startZ + Math.sin(time * data.speed * 0.7 + data.phase) * data.amplitude;
            
            // Particles fade as they decay
            const fade = 1 - data.lifetime;
            colors[i * 3 + 1] = (0.4 + Math.random() * 0.3) * fade;
            colors[i * 3 + 2] = (0.7 + Math.random() * 0.3) * fade;
        }
        
        humanParticleSystem.geometry.attributes.position.needsUpdate = true;
        humanParticleSystem.geometry.attributes.color.needsUpdate = true;
        
        // Barrier shimmer effect
        barrier.material.opacity = 0.1 + Math.sin(time * 2) * 0.05;
    };
    
    return { scene, animate };
}

function createVerse16Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010a1a);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(10, 10, 10);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    // Create barrier with quantum tunneling visualization
    const barrierGroup = new THREE.Group();
    scene.add(barrierGroup);
    
    // Create energy barrier
    const barrierGeometry = new THREE.BoxGeometry(1, 3, 6);
    const barrierMaterial = new THREE.MeshPhongMaterial({
        color: 0xff5a5f,
        transparent: true,
        opacity: 0.7
    });
    
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrierGroup.add(barrier);
    
    // Create human side (left)
    const humanGeometry = new THREE.SphereGeometry(1, 32, 32);
    const humanMaterial = new THREE.MeshPhongMaterial({
        color: 0x0077cc,
        emissive: 0x003366
    });
    
    const humanSphere = new THREE.Mesh(humanGeometry, humanMaterial);
    humanSphere.position.x = -3;
    barrierGroup.add(humanSphere);
    
    // Create divine side (right)
    const divineGeometry = new THREE.SphereGeometry(1, 32, 32);
    const divineMaterial = new THREE.MeshPhongMaterial({
        color: 0xffbd00,
        emissive: 0x664400
    });
    
    const divineSphere = new THREE.Mesh(divineGeometry, divineMaterial);
    divineSphere.position.x = 3;
    barrierGroup.add(divineSphere);
    
    // Add labels
    const makeTextSprite = (text, position, color = 0xffffff) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold 40px Arial";
        context.fillStyle = "rgba(255,255,255,0.9)";
        context.fillText(text, 10, 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(2, 1, 1);
        return sprite;
    };
    
    const humanLabel = makeTextSprite("HUMAN", new THREE.Vector3(-3, -2, 0));
    barrierGroup.add(humanLabel);
    
    const divineLabel = makeTextSprite("DIVINE", new THREE.Vector3(3, -2, 0));
    barrierGroup.add(divineLabel);
    
    const barrierLabel = makeTextSprite("BARRIER", new THREE.Vector3(0, 2, 0));
    barrierGroup.add(barrierLabel);
    
    // Create tunneling particles
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle geometry
        const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        
        // Random color between human and divine
        const mixFactor = Math.random();
        const particleColor = new THREE.Color(
            humanMaterial.color.r * (1 - mixFactor) + divineMaterial.color.r * mixFactor,
            humanMaterial.color.g * (1 - mixFactor) + divineMaterial.color.g * mixFactor,
            humanMaterial.color.b * (1 - mixFactor) + divineMaterial.color.b * mixFactor
        );
        
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: particleColor,
            emissive: particleColor.clone().multiplyScalar(0.3),
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Initial position at human side
        particle.position.x = -3;
        particle.position.y = (Math.random() - 0.5) * 1;
        particle.position.z = (Math.random() - 0.5) * 4;
        
        // Particle data for animation
        particle.userData = {
            state: 'approach', // approach, tunnel, emerge
            speed: 0.02 + Math.random() * 0.02,
            tunnelProgress: 0,
            tunnelChance: 0.1 + Math.random() * 0.3, // Probability of tunneling
            size: 0.1 + Math.random() * 0.05
        };
        
        particles.push(particle);
        barrierGroup.add(particle);
    }
    
    // Wave function visualization
    const waveGeometry = new THREE.BufferGeometry();
    const wavePoints = 100;
    const wavePositions = new Float32Array(wavePoints * 3);
    const waveColors = new Float32Array(wavePoints * 3);
    
    for (let i = 0; i < wavePoints; i++) {
        const x = -5 + (i / wavePoints) * 10;
        wavePositions[i * 3] = x;
        wavePositions[i * 3 + 1] = 0;
        wavePositions[i * 3 + 2] = 0;
        
        // Color gradient from human to divine
        const t = (i / wavePoints);
        waveColors[i * 3] = humanMaterial.color.r * (1 - t) + divineMaterial.color.r * t;     // R
        waveColors[i * 3 + 1] = humanMaterial.color.g * (1 - t) + divineMaterial.color.g * t; // G
        waveColors[i * 3 + 2] = humanMaterial.color.b * (1 - t) + divineMaterial.color.b * t; // B
    }
    
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));
    
    const waveMaterial = new THREE.LineBasicMaterial({ 
        vertexColors: true,
        linewidth: 2
    });
    
    const waveLine = new THREE.Line(waveGeometry, waveMaterial);
    waveLine.position.y = -3;
    barrierGroup.add(waveLine);
    
    // Add wave function labels
    const waveLeftLabel = makeTextSprite("PROBABILITY WAVE", new THREE.Vector3(-3, -3.5, 0));
    barrierGroup.add(waveLeftLabel);
    
    // Indicate tunneling region
    const tunnelRegionGeometry = new THREE.PlaneGeometry(1, 1);
    const tunnelRegionMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    
    const tunnelRegion = new THREE.Mesh(tunnelRegionGeometry, tunnelRegionMaterial);
    tunnelRegion.position.set(0, -3, 0);
    tunnelRegion.rotation.x = Math.PI / 2;
    tunnelRegion.scale.set(1, 4, 1);
    barrierGroup.add(tunnelRegion);
    
    const tunnelLabel = makeTextSprite("TUNNELING", new THREE.Vector3(0, -4, 0));
    barrierGroup.add(tunnelLabel);
    
    // Animation function
    const animate = () => {
        const time = Date.now() * 0.001;
        
        // Rotate the entire scene slightly for better perspective
        barrierGroup.rotation.y = Math.sin(time * 0.2) * 0.1;
        
        // Animate the spheres (pulsating)
        humanSphere.scale.x = humanSphere.scale.y = humanSphere.scale.z = 
            1 + Math.sin(time * 1.5) * 0.05;
        
        divineSphere.scale.x = divineSphere.scale.y = divineSphere.scale.z = 
            1 + Math.sin(time * 0.7) * 0.05;
        
        // Animate barrier (slight pulsating)
        barrier.scale.y = 1 + Math.sin(time) * 0.05;
        barrier.material.opacity = 0.6 + Math.sin(time * 1.2) * 0.1;
        
        // Animate particles (tunneling effect)
        particles.forEach(particle => {
            const data = particle.userData;
            
            switch (data.state) {
                case 'approach':
                    // Move toward barrier
                    particle.position.x += data.speed;
                    
                    // Random vertical movement
                    particle.position.y = Math.sin(time * data.speed * 5 + particle.position.z) * 0.5;
                    
                    // When particle reaches barrier, decide if it tunnels
                    if (particle.position.x >= -0.5) {
                        if (Math.random() < data.tunnelChance) {
                            // Particle will tunnel
                            data.state = 'tunnel';
                            // Reduce size during tunneling
                            particle.scale.set(0.5, 0.5, 0.5);
                            // Make semi-transparent during tunneling
                            particle.material.opacity = 0.5;
                        } else {
                            // Particle bounces back
                            data.speed = -data.speed;
                        }
                    }
                    break;
                
                case 'tunnel':
                    // Slow movement through barrier
                    particle.position.x += data.speed * 0.3;
                    
                    // Glow effect during tunneling
                    const glow = (Math.sin(time * 10) + 1) * 0.5;
                    particle.material.emissive.setRGB(glow, glow, glow);
                    
                    // When particle exits barrier
                    if (particle.position.x >= 0.5) {
                        data.state = 'emerge';
                        // Restore size and opacity
                        particle.scale.set(1, 1, 1);
                        particle.material.opacity = 0.8;
                    }
                    break;
                
                case 'emerge':
                    // Continue motion toward divine side
                    particle.position.x += data.speed;
                    
                    // Start transformation toward divine color
                    const progress = (particle.position.x - 0.5) / 2.5; // 0 to 1 between barrier and divine
                    const color = particle.material.color;
                    color.r = (1 - progress) * humanMaterial.color.r + progress * divineMaterial.color.r;
                    color.g = (1 - progress) * humanMaterial.color.g + progress * divineMaterial.color.g;
                    color.b = (1 - progress) * humanMaterial.color.b + progress * divineMaterial.color.b;
                    
                    // When particle reaches divine
                    if (particle.position.x >= 3) {
                        // Reset to human side
                        particle.position.x = -3;
                        particle.position.y = (Math.random() - 0.5) * 1;
                        particle.position.z = (Math.random() - 0.5) * 4;
                        data.state = 'approach';
                        data.speed = 0.02 + Math.random() * 0.02;
                        data.tunnelChance = 0.1 + Math.random() * 0.3;
                        
                        // Reset color to human
                        particle.material.color.copy(humanMaterial.color);
                    }
                    break;
            }
        });
        
        // Animate wave function
        const positions = waveLine.geometry.attributes.position.array;
        
        for (let i = 0; i < wavePoints; i++) {
            const x = positions[i * 3];
            
            // Wave height depends on position
            let height;
            
            if (x < -0.5) {
                // Human side: oscillating wave
                height = Math.sin(x * 2 + time * 2) * Math.exp(x * 0.2) * 0.5;
            } else if (x > 0.5) {
                // Divine side: growing oscillation
                height = Math.sin(x * 2 + time * 2) * Math.exp((x - 5) * -0.2) * 0.5;
            } else {
                // Barrier: exponential decay
                height = Math.sin(-0.5 * 2 + time * 2) * Math.exp(-0.5 * 0.2) * 
                         Math.exp(-(x + 0.5) * 2) * 0.5;
            }
            
            positions[i * 3 + 1] = height;
        }
        
        waveLine.geometry.attributes.position.needsUpdate = true;
        
        // Animate tunnel region
        tunnelRegion.material.opacity = 0.1 + Math.sin(time * 3) * 0.05;
    };
    
    return { scene, animate };
}

function createVerse17Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000910);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create the BEC (Bose-Einstein Condensate) visualization
    const becGroup = new THREE.Group();
    scene.add(becGroup);
    
    // Create states representation
    const normalState = new THREE.Group();
    const condensateState = new THREE.Group();
    becGroup.add(normalState);
    becGroup.add(condensateState);
    
    // Position the states
    normalState.position.y = 2;
    condensateState.position.y = -2;
    
    // Create title labels
    const makeTextSprite = (text, position, color = 0xffffff) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.font = "Bold 40px Arial";
        context.fillStyle = "rgba(255,255,255,0.9)";
        context.fillText(text, 10, 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(4, 1, 1);
        return sprite;
    };
    
    const normalLabel = makeTextSprite("HALF DIVINE, HALF HUMAN: UNREASONABLE", new THREE.Vector3(0, 4, 0));
    const condensateLabel = makeTextSprite("NEW QUANTUM STATE: COHERENT WHOLE", new THREE.Vector3(0, -4, 0));
    becGroup.add(normalLabel);
    becGroup.add(condensateLabel);
    
    // Create individual atoms for normal state
    const atomCount = 50;
    const atoms = [];
    
    // Two types of atoms: "divine" and "human"
    const divineGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const divineMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd700,
        emissive: 0x885500
    });
    
    const humanGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const humanMaterial = new THREE.MeshPhongMaterial({
        color: 0x4488cc,
        emissive: 0x112244
    });
    
    // Create atoms for normal state (divided)
    for (let i = 0; i < atomCount; i++) {
        const isDivine = i < atomCount / 2;
        const geometry = isDivine ? divineGeometry : humanGeometry;
        const material = isDivine ? divineMaterial : humanMaterial;
        
        const atom = new THREE.Mesh(geometry, material);
        
        // Position - divine on left, human on right
        const side = isDivine ? -1 : 1;
        atom.position.set(
            side * (1 + Math.random()),
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        
        // Add user data for animation
        atom.userData = {
            isDivine,
            originalPosition: atom.position.clone(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.01,
            amplitude: 0.1 + Math.random() * 0.1
        };
        
        atoms.push(atom);
        normalState.add(atom);
    }
    
    // Add a dividing line between divine and human parts
    const dividerGeometry = new THREE.PlaneGeometry(0.1, 2, 1, 1);
    const dividerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
    normalState.add(divider);
    
    // Create BEC condensate representation
    
    // Wave function mesh for condensate
    const waveGeometry = new THREE.SphereGeometry(2, 32, 32);
    const waveMaterial = new THREE.MeshPhongMaterial({
        color: 0x8866cc,
        emissive: 0x442266,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    const waveFunction = new THREE.Mesh(waveGeometry, waveMaterial);
    condensateState.add(waveFunction);
    
    // Condensed atoms - all in the same quantum state
    const condensedAtoms = [];
    const condensedGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    
    for (let i = 0; i < atomCount; i++) {
        // Blended material color for condensed atoms
        const blendFactor = Math.random();
        const blendedColor = new THREE.Color(
            divineMaterial.color.r * blendFactor + humanMaterial.color.r * (1 - blendFactor),
            divineMaterial.color.g * blendFactor + humanMaterial.color.g * (1 - blendFactor),
            divineMaterial.color.b * blendFactor + humanMaterial.color.b * (1 - blendFactor)
        );
        
        const blendedEmissive = new THREE.Color(
            divineMaterial.emissive.r * blendFactor + humanMaterial.emissive.r * (1 - blendFactor),
            divineMaterial.emissive.g * blendFactor + humanMaterial.emissive.g * (1 - blendFactor),
            divineMaterial.emissive.b * blendFactor + humanMaterial.emissive.b * (1 - blendFactor)
        );
        
        const condensedMaterial = new THREE.MeshPhongMaterial({
            color: blendedColor,
            emissive: blendedEmissive,
            transparent: true,
            opacity: 0.9
        });
        
        const atom = new THREE.Mesh(condensedGeometry, condensedMaterial);
        
        // All atoms share the same wave function - they're in a superposition
        const phi = Math.acos(-1 + (2 * i) / atomCount);
        const theta = Math.sqrt(atomCount * Math.PI) * phi;
        
        const radius = 1.5;
        atom.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );
        
        // Add data for animation
        atom.userData = {
            originalRadius: radius,
            theta: theta,
            phi: phi,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.5 + Math.random() * 0.5
        };
        
        condensedAtoms.push(atom);
        condensateState.add(atom);
    }
    
    // Add transition temperature indicator
    const temperatureGeometry = new THREE.BoxGeometry(10, 0.1, 1);
    const temperatureMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5a5f
    });
    
    const temperatureBar = new THREE.Mesh(temperatureGeometry, temperatureMaterial);
    temperatureBar.position.y = 0;
    becGroup.add(temperatureBar);
    
    const tempLabel = makeTextSprite("IMPOSSIBLE BOUNDARY", new THREE.Vector3(0, 0.5, 0));
    tempLabel.scale.set(3, 0.8, 1);
    becGroup.add(tempLabel);
    
    // Add arrows showing the impossible transformation
    const arrowGeometry = new THREE.CylinderGeometry(0.05, 0.15, 1, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5a5f
    });
    
    // Down arrow
    const downArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    downArrow.position.set(-2, 0, 0);
    downArrow.rotation.z = Math.PI / 2;
    becGroup.add(downArrow);
    
    // Up arrow
    const upArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    upArrow.position.set(2, 0, 0);
    upArrow.rotation.z = -Math.PI / 2;
    becGroup.add(upArrow);
    
    // Add interaction state for temperature control
    let temperature = 1.0; // Normalized temperature (1.0 = normal, 0.0 = condensate)
    let temperatureTarget = 1.0;
    
    // Click event to change temperature
    window.addEventListener('click', () => {
        // Toggle between states
        temperatureTarget = temperatureTarget > 0.5 ? 0.0 : 1.0;
    });
    
    // Animation function
    const animate = () => {
        const time = Date.now() * 0.001;
        
        // Smoothly adjust temperature
        temperature = temperature + (temperatureTarget - temperature) * 0.02;
        
        // Animate normal state atoms - individual movements
        atoms.forEach(atom => {
            const data = atom.userData;
            
            // Random movement at higher temperatures
            const amplitude = data.amplitude * temperature;
            atom.position.x = data.originalPosition.x + Math.sin(time * data.speed + data.phase) * amplitude;
            atom.position.y = data.originalPosition.y + Math.cos(time * data.speed + data.phase) * amplitude;
            atom.position.z = data.originalPosition.z + Math.sin(time * data.speed * 0.7 + data.phase) * amplitude;
            
            // Fade based on temperature
            atom.material.opacity = temperature;
            atom.scale.setScalar(0.7 + temperature * 0.3);
        });
        
        // Animate divider
        divider.material.opacity = 0.3 * temperature;
        
        // Animate condensate atoms - coherent movement
        condensedAtoms.forEach(atom => {
            const data = atom.userData;
            
            // Synchronized movement in condensate
            const pulseRadius = data.originalRadius * (1 + Math.sin(time * 0.5) * 0.1 * (1 - temperature));
            
            atom.position.x = pulseRadius * Math.cos(data.theta) * Math.sin(data.phi);
            atom.position.y = pulseRadius * Math.sin(data.theta) * Math.sin(data.phi);
            atom.position.z = pulseRadius * Math.cos(data.phi);
            
            // Slight individual variation, decreasing with temperature
            const variation = 0.1 * temperature;
            atom.position.x += Math.sin(time * data.pulseSpeed + data.phase) * variation;
            atom.position.y += Math.cos(time * data.pulseSpeed + data.phase) * variation;
            atom.position.z += Math.sin(time * data.pulseSpeed * 0.7 + data.phase) * variation;
            
            // Fade based on temperature (inverse to normal atoms)
            atom.material.opacity = 0.9 * (1 - temperature);
            atom.scale.setScalar(0.7 + (1 - temperature) * 0.3);
        });
        
        // Animate wave function
        waveFunction.material.opacity = 0.3 * (1 - temperature);
        waveFunction.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1);
        waveFunction.rotation.x = time * 0.1;
        waveFunction.rotation.y = time * 0.15;
        
        // Animate temperature bar
        temperatureBar.scale.y = 1 + Math.sin(time * 2) * 0.2;
        temperatureBar.material.opacity = 0.7 + Math.sin(time * 2) * 0.3;
        
        // Animate arrows
        downArrow.scale.y = 1 + Math.sin(time * 3) * 0.2;
        upArrow.scale.y = 1 + Math.cos(time * 3) * 0.2;
        
        // Animate labels
        normalLabel.material.opacity = 0.5 + temperature * 0.5;
        condensateLabel.material.opacity = 0.5 + (1 - temperature) * 0.5;
    };
    
    return { scene, animate };
}

function createVerse18Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000a14);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create central group for the superposition visualization
    const superpositionGroup = new THREE.Group();
    scene.add(superpositionGroup);
    
    // Create labels for the four states (permanent, impermanent, non-permanent, non-impermanent)
    const makeTextSprite = (text, position, color = 0xffffff) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.font = "Bold 32px Arial";
        context.fillStyle = "rgba(255,255,255,0.9)";
        context.fillText(text, 10, 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(2, 1, 1);
        return sprite;
    };
    
    // Add four state labels
    const labels = [
        { text: "PERMANENT", position: new THREE.Vector3(-3, 3, 0), color: 0xffbd00 },
        { text: "IMPERMANENT", position: new THREE.Vector3(3, 3, 0), color: 0x4488cc },
        { text: "NON-PERMANENT", position: new THREE.Vector3(-3, -3, 0), color: 0xff5a5f },
        { text: "NON-IMPERMANENT", position: new THREE.Vector3(3, -3, 0), color: 0x66c2a5 }
    ];
    
    const stateSpheres = [];
    labels.forEach((label, i) => {
        // Create text sprite
        const sprite = makeTextSprite(label.text, label.position);
        superpositionGroup.add(sprite);
        
        // Create sphere for each state
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(label.color),
            emissive: new THREE.Color(label.color).multiplyScalar(0.3),
            transparent: true,
            opacity: 0.9
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(label.position).add(new THREE.Vector3(0, -1, 0));
        superpositionGroup.add(sphere);
        stateSpheres.push(sphere);
        
        // Add connections to central point
        const lineGeometry = new THREE.BufferGeometry();
        const center = new THREE.Vector3(0, 0, 0);
        const positions = new Float32Array([
            center.x, center.y, center.z,
            sphere.position.x, sphere.position.y, sphere.position.z
        ]);
        
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: label.color,
            transparent: true,
            opacity: 0.5
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        superpositionGroup.add(line);
    });
    
    // Create central entangled state
    const entangledGeometry = new THREE.IcosahedronGeometry(1, 1);
    const entangledMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x888888,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const entangledSphere = new THREE.Mesh(entangledGeometry, entangledMaterial);
    superpositionGroup.add(entangledSphere);
    
    // Create entanglement particles - representing the quantum superposition
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle geometry
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        
        // Pick a base color from one of the four states
        const baseColorIndex = Math.floor(Math.random() * 4);
        const baseColor = new THREE.Color(labels[baseColorIndex].color);
        
        // Mix with a secondary color
        const secondaryIndex = (baseColorIndex + 1 + Math.floor(Math.random() * 3)) % 4;
        const secondaryColor = new THREE.Color(labels[secondaryIndex].color);
        
        const mixFactor = Math.random();
        const mixedColor = new THREE.Color(
            baseColor.r * mixFactor + secondaryColor.r * (1 - mixFactor),
            baseColor.g * mixFactor + secondaryColor.g * (1 - mixFactor),
            baseColor.b * mixFactor + secondaryColor.b * (1 - mixFactor)
        );
        
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: mixedColor,
            emissive: mixedColor.clone().multiplyScalar(0.3),
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Initial position - random on sphere surface
        const phi = Math.acos(-1 + Math.random() * 2);
        const theta = Math.random() * Math.PI * 2;
        const radius = 1 + Math.random() * 0.3;
        
        particle.position.set(
            Math.cos(theta) * Math.sin(phi) * radius,
            Math.sin(theta) * Math.sin(phi) * radius,
            Math.cos(phi) * radius
        );
        
        // Add data for animation
        particle.userData = {
            baseRadius: radius,
            theta: theta,
            phi: phi,
            orbitSpeed: 0.2 + Math.random() * 0.3,
            baseColor: baseColorIndex,
            secondaryColor: secondaryIndex,
            mixFactor: mixFactor,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        particles.push(particle);
        entangledSphere.add(particle);
    }
    
    // Add secondary orbital paths to show quantum correlations
    const orbitalPaths = [];
    
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(1.5 + i * 0.2, 0.02, 16, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 * Math.random();
        ring.rotation.y = Math.PI / 2 * Math.random();
        orbitalPaths.push(ring);
        entangledSphere.add(ring);
    }
    
    // Add title for the visualization
    const title = makeTextSprite("BEYOND CATEGORIES", new THREE.Vector3(0, 5, 0));
    title.scale.set(3, 1.5, 1);
    superpositionGroup.add(title);
    
    // Add explanation label
    const explanation = makeTextSprite("QUANTUM SUPERPOSITION TRANSCENDS DUALITIES", new THREE.Vector3(0, -5, 0));
    explanation.scale.set(3, 1.5, 1);
    superpositionGroup.add(explanation);
    
    // Track interaction state
    let isObserving = false;
    let observedState = -1;
    let observationProgress = 0;
    
    // Add click handler for observation
    window.addEventListener('click', () => {
        if (!isObserving) {
            isObserving = true;
            observationProgress = 0;
            observedState = Math.floor(Math.random() * 4);
        }
    });
    
    // Animation function
    const animate = () => {
        const time = Date.now() * 0.001;
        
        // Rotate the entire superposition group
        superpositionGroup.rotation.y = time * 0.1;
        
        // Animate entangled sphere
        entangledSphere.rotation.x = time * 0.2;
        entangledSphere.rotation.z = time * 0.1;
        
        // Animate orbital paths
        orbitalPaths.forEach((ring, i) => {
            ring.rotation.x += 0.002 * (i % 2 ? 1 : -1);
            ring.rotation.y += 0.001 * (i % 3 ? 1 : -1);
            ring.material.opacity = 0.1 + Math.sin(time + i) * 0.05;
        });
        
        // Animate state spheres
        stateSpheres.forEach((sphere, i) => {
            // Pulsate spheres
            const pulseScale = 1 + Math.sin(time * 0.5 + i) * 0.1;
            sphere.scale.set(pulseScale, pulseScale, pulseScale);
            
            // During observation, highlight observed state
            if (isObserving) {
                if (i === observedState) {
                    sphere.material.opacity = 0.9;
                    sphere.material.emissive.copy(sphere.material.color).multiplyScalar(0.5 + Math.sin(time * 5) * 0.5);
                } else {
                    sphere.material.opacity = 0.3;
                    sphere.material.emissive.copy(sphere.material.color).multiplyScalar(0.1);
                }
            } else {
                sphere.material.opacity = 0.9;
                sphere.material.emissive.copy(sphere.material.color).multiplyScalar(0.3);
            }
        });
        
        // Animate particles
        particles.forEach(particle => {
            const data = particle.userData;
            
            if (!isObserving) {
                // Normal entangled state animation
                
                // Orbital movement
                data.theta += 0.01 * data.orbitSpeed;
                data.phi += 0.005 * data.orbitSpeed;
                
                const pulseRadius = data.baseRadius * (1 + Math.sin(time + data.pulsePhase) * 0.1);
                
                particle.position.x = Math.cos(data.theta) * Math.sin(data.phi) * pulseRadius;
                particle.position.y = Math.sin(data.theta) * Math.sin(data.phi) * pulseRadius;
                particle.position.z = Math.cos(data.phi) * pulseRadius;
                
                // Dynamic color mixing between states
                const dynamicMix = (Math.sin(time * 0.5 + data.pulsePhase) + 1) * 0.5;
                const baseColor = new THREE.Color(labels[data.baseColor].color);
                const secondaryColor = new THREE.Color(labels[data.secondaryColor].color);
                
                particle.material.color.set(
                    baseColor.r * data.mixFactor + secondaryColor.r * (1 - data.mixFactor) * dynamicMix,
                    baseColor.g * data.mixFactor + secondaryColor.g * (1 - data.mixFactor) * dynamicMix,
                    baseColor.b * data.mixFactor + secondaryColor.b * (1 - data.mixFactor) * dynamicMix
                );
            } else {
                // Observation animation - collapse to observed state
                observationProgress += 0.005;
                
                if (observationProgress < 1) {
                    // Move towards the observed state
                    const targetPosition = stateSpheres[observedState].position.clone();
                    const currentPosition = particle.position.clone();
                    
                    // Calculate direction vector to target
                    const direction = targetPosition.sub(currentPosition);
                    direction.normalize().multiplyScalar(observationProgress * 0.05);
                    
                    particle.position.add(direction);
                    
                    // Transition color to observed state
                    const targetColor = new THREE.Color(labels[observedState].color);
                    particle.material.color.lerp(targetColor, observationProgress * 0.1);
                    
                    // Fade out particles not matching the observed state
                    if (data.baseColor !== observedState && data.secondaryColor !== observedState) {
                        particle.material.opacity = Math.max(0, 0.8 - observationProgress);
                    }
                } else {
                    // Reset observation after complete
                    if (observationProgress > 2) {
                        isObserving = false;
                        // Reset particle positions
                        particles.forEach(p => {
                            const pData = p.userData;
                            pData.theta = Math.random() * Math.PI * 2;
                            pData.phi = Math.acos(-1 + Math.random() * 2);
                            p.material.opacity = 0.8;
                        });
                    }
                }
            }
        });
        
        // Entangled sphere appearance during observation
        if (isObserving) {
            entangledSphere.material.opacity = Math.max(0.1, 0.8 - observationProgress * 0.8);
        } else {
            entangledSphere.material.opacity = 0.8;
        }
    };
    
    return { scene, animate };
}

function createVerse19Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create black hole visualization
    const blackHoleGroup = new THREE.Group();
    scene.add(blackHoleGroup);
    
    // Black hole event horizon
    const horizonGeometry = new THREE.SphereGeometry(2, 32, 32);
    const horizonMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: false
    });
    
    const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    blackHoleGroup.add(eventHorizon);
    
    // Accretion disk
    const diskGeometry = new THREE.RingGeometry(2.1, 5, 64, 8);
    const diskMaterial = new THREE.MeshBasicMaterial({
        color: 0xffa500,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.rotation.x = Math.PI / 2;
    blackHoleGroup.add(accretionDisk);
    
    // Create glowing effect for disk
    const glowGeometry = new THREE.RingGeometry(2, 5.2, 64, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff2200,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    
    const diskGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    diskGlow.rotation.x = Math.PI / 2;
    blackHoleGroup.add(diskGlow);
    
    // Create Hawking radiation particles
    const particleCount = 200;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        
        // Random color for particle
        const hue = Math.random();
        const particleColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
        
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: particleColor,
            transparent: true,
            opacity: 0
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Initial position on event horizon
        const phi = Math.acos(-1 + Math.random() * 2);
        const theta = Math.random() * Math.PI * 2;
        
        particle.position.set(
            Math.cos(theta) * Math.sin(phi) * 2,
            Math.sin(theta) * Math.sin(phi) * 2,
            Math.cos(phi) * 2
        );
        
        // Add data for animation
        particle.userData = {
            active: false,
            speed: 0.02 + Math.random() * 0.03,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize(),
            lifetime: 0,
            maxLife: 2 + Math.random() * 3,
            startDelay: Math.random() * 10
        };
        
        particles.push(particle);
        blackHoleGroup.add(particle);
    }
    
    // Create samsara cycle visualization
    const cycleRadius = 7;
    const cyclePoints = 100;
    const cycleGeometry = new THREE.BufferGeometry();
    const cyclePositions = new Float32Array(cyclePoints * 3);
    
    for (let i = 0; i < cyclePoints; i++) {
        const angle = (i / cyclePoints) * Math.PI * 2;
        cyclePositions[i * 3] = Math.cos(angle) * cycleRadius;
        cyclePositions[i * 3 + 1] = Math.sin(angle) * cycleRadius;
        cyclePositions[i * 3 + 2] = 0;
    }
    
    cycleGeometry.setAttribute('position', new THREE.BufferAttribute(cyclePositions, 3));
    
    const cycleMaterial = new THREE.LineBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.7
    });
    
    const samsaraCycle = new THREE.Line(cycleGeometry, cycleMaterial);
    blackHoleGroup.add(samsaraCycle);
    
    // Add cycle marker points representing rebirth states
    const markerCount = 6;
    const markers = [];
    
    for (let i = 0; i < markerCount; i++) {
        const angle = (i / markerCount) * Math.PI * 2;
        const markerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const markerMaterial = new THREE.MeshPhongMaterial({
            color: 0x88ccff,
            emissive: 0x2244aa
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(
            Math.cos(angle) * cycleRadius,
            Math.sin(angle) * cycleRadius,
            0
        );
        
        // Add data for animation
        marker.userData = {
            angle: angle,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        markers.push(marker);
        blackHoleGroup.add(marker);
    }
    
    // Add text labels
    const makeTextSprite = (text, position, color = 0xffffff) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.font = "Bold 40px Arial";
        context.fillStyle = "rgba(255,255,255,0.9)";
        context.fillText(text, 10, 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(3, 1, 1);
        return sprite;
    };
    
    const blackHoleLabel = makeTextSprite("BLACK HOLE EVAPORATION", new THREE.Vector3(0, -4, 0));
    blackHoleGroup.add(blackHoleLabel);
    
    const samsaraLabel = makeTextSprite("SAMSARA CYCLE", new THREE.Vector3(0, 8, 0));
    blackHoleGroup.add(samsaraLabel);
    
    const finiteLabel = makeTextSprite("EVEN CYCLES END", new THREE.Vector3(0, 4, 0));
    blackHoleGroup.add(finiteLabel);
    
    // Track evaporation progress
    let evaporationProgress = 0;
    const evaporationRate = 0.0001;
    let cycleBreakPoint = Math.random() * Math.PI * 2;
    
    // Animation function
    const animate = () => {
        const time = Date.now() * 0.001;
        
        // Rotate black hole and accretion disk
        blackHoleGroup.rotation.y = time * 0.1;
        accretionDisk.rotation.z = time * 0.2;
        diskGlow.rotation.z = -time * 0.1;
        
        // Progress black hole evaporation
        evaporationProgress += evaporationRate;
        
        // Scale down black hole as it evaporates
        const scale = Math.max(0.1, 1 - evaporationProgress * 0.5);
        eventHorizon.scale.set(scale, scale, scale);
        
        // Adjust accretion disk
        const diskScale = Math.max(0.2, 1 - evaporationProgress * 0.3);
        accretionDisk.scale.set(diskScale, diskScale, diskScale);
        diskGlow.scale.set(diskScale, diskScale, diskScale);
        
        // Increase glow as evaporation progresses
        diskGlow.material.opacity = 0.3 + evaporationProgress * 0.5;
        
        // Animate Hawking radiation particles
        particles.forEach(particle => {
            const data = particle.userData;
            
            // Only start some particles initially, more as evaporation progresses
            if (!data.active) {
                data.startDelay -= 0.05;
                if (data.startDelay <= 0 && Math.random() < 0.02 + evaporationProgress * 0.1) {
                    data.active = true;
                    
                    // Reset position to surface of event horizon
                    const phi = Math.acos(-1 + Math.random() * 2);
                    const theta = Math.random() * Math.PI * 2;
                    const radius = 2 * scale; // Adjusted for evaporation
                    
                    particle.position.set(
                        Math.cos(theta) * Math.sin(phi) * radius,
                        Math.sin(theta) * Math.sin(phi) * radius,
                        Math.cos(phi) * radius
                    );
                    
                    // Randomize direction outward
                    data.direction.set(
                        particle.position.x,
                        particle.position.y,
                        particle.position.z
                    ).normalize();
                    
                    // Reset lifetime
                    data.lifetime = 0;
                    
                    // Start visible
                    particle.material.opacity = 0.8;
                }
            }
            
            // Animate active particles
            if (data.active) {
                // Move outward from black hole
                particle.position.add(
                    data.direction.clone().multiplyScalar(data.speed)
                );
                
                // Increase lifetime
                data.lifetime += 0.01;
                
                // Fade out over lifetime
                particle.material.opacity = Math.max(0, 0.8 - (data.lifetime / data.maxLife) * 0.8);
                
                // Grow slightly as energy dissipates
                const growFactor = 1 + data.lifetime * 0.1;
                particle.scale.set(growFactor, growFactor, growFactor);
                
                // Deactivate when lifetime ends
                if (data.lifetime >= data.maxLife) {
                    data.active = false;
                    data.startDelay = Math.random() * 5;
                    particle.material.opacity = 0;
                }
            }
        });
        
        // Animate samsara cycle
        const cycleOpacity = Math.max(0, 0.7 - evaporationProgress);
        samsaraCycle.material.opacity = cycleOpacity;
        
        // Break the cycle as evaporation progresses
        if (evaporationProgress > 0.3) {
            const positions = samsaraCycle.geometry.attributes.position.array;
            
            for (let i = 0; i < cyclePoints; i++) {
                const angle = (i / cyclePoints) * Math.PI * 2;
                
                // Create a gap in the cycle
                const distFromBreak = Math.abs(angle - cycleBreakPoint);
                const breakWidth = evaporationProgress * Math.PI; // Gap widens with evaporation
                
                if (distFromBreak < breakWidth || distFromBreak > (Math.PI * 2 - breakWidth)) {
                    // Points in break area - make them "fall" toward black hole
                    const fallProgress = evaporationProgress - 0.3;
                    const newRadius = cycleRadius * (1 - fallProgress * 0.5);
                    
                    positions[i * 3] = Math.cos(angle) * newRadius;
                    positions[i * 3 + 1] = Math.sin(angle) * newRadius;
                }
            }
            
            samsaraCycle.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate markers
        markers.forEach(marker => {
            const data = marker.userData;
            
            // Pulse effect
            const pulse = 1 + Math.sin(time * 2 + data.pulsePhase) * 0.2;
            marker.scale.set(pulse, pulse, pulse);
            
            // Fade with cycle
            marker.material.opacity = cycleOpacity;
            
            // If near break point, make them fall with the cycle
            if (evaporationProgress > 0.3) {
                const distFromBreak = Math.abs(data.angle - cycleBreakPoint);
                const breakWidth = evaporationProgress * Math.PI;
                
                if (distFromBreak < breakWidth || distFromBreak > (Math.PI * 2 - breakWidth)) {
                    // Move toward black hole
                    const fallProgress = evaporationProgress - 0.3;
                    const newRadius = cycleRadius * (1 - fallProgress * 0.5);
                    
                    marker.position.x = Math.cos(data.angle) * newRadius;
                    marker.position.y = Math.sin(data.angle) * newRadius;
                    
                    // Fade faster than the cycle
                    marker.material.opacity = Math.max(0, cycleOpacity - 0.2);
                }
            }
        });
        
        // Fade labels as appropriate
        blackHoleLabel.material.opacity = 1;
        samsaraLabel.material.opacity = Math.max(0.2, 1 - evaporationProgress * 2);
        finiteLabel.material.opacity = Math.min(1, evaporationProgress * 3);
        
        // Reset evaporation when complete
        if (evaporationProgress > 1.5) {
            evaporationProgress = 0;
            cycleBreakPoint = Math.random() * Math.PI * 2;
            
            // Reset cycle geometry
            const positions = samsaraCycle.geometry.attributes.position.array;
            for (let i = 0; i < cyclePoints; i++) {
                const angle = (i / cyclePoints) * Math.PI * 2;
                positions[i * 3] = Math.cos(angle) * cycleRadius;
                positions[i * 3 + 1] = Math.sin(angle) * cycleRadius;
                positions[i * 3 + 2] = 0;
            }
            samsaraCycle.geometry.attributes.position.needsUpdate = true;
            
            // Reset markers
            markers.forEach(marker => {
                const data = marker.userData;
                marker.position.set(
                    Math.cos(data.angle) * cycleRadius,
                    Math.sin(data.angle) * cycleRadius,
                    0
                );
            });
        }
    };
    
    return { scene, animate };
}

// Setup UI and interaction
function setupUI() {
    const verseNumber = document.getElementById('verse-number');
    const verseText = document.getElementById('verse-text');
    const explanationText = document.getElementById('explanation-text');
    const panelToggle = document.getElementById('panel-toggle');
    const infoPanel = document.getElementById('info-panel');
    const verseNav = document.getElementById('verse-nav');
    
    // Create verse navigation buttons
    verses.forEach((verse, index) => {
        const button = document.createElement('button');
        button.className = 'verse-nav-button' + (index === currentVerseIndex ? ' active' : '');
        button.textContent = verse.number.replace('Verse ', '');
        button.addEventListener('click', () => {
            currentVerseIndex = index;
            loadVerse(currentVerseIndex);
            updateVerseDisplay();
            
            // Update active button
            document.querySelectorAll('.verse-nav-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
        verseNav.appendChild(button);
    });
    
    // Setup panel toggle
    panelToggle.addEventListener('click', () => {
        infoPanel.classList.toggle('collapsed');
        infoPanel.classList.toggle('expanded');
        
        // Update toggle button icon
        panelToggle.textContent = infoPanel.classList.contains('expanded') ? '◀' : '▶';
    });
    
    // Setup collapsible sections
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const section = header.parentElement;
            const toggleIcon = header.querySelector('.toggle-icon');
            
            section.classList.toggle('expanded');
            targetContent.classList.toggle('hidden');
            toggleIcon.textContent = section.classList.contains('expanded') ? '▼' : '►';
        });
    });
    
    // Setup zoom slider
    const zoomSlider = document.getElementById('zoom-slider');
    zoomSlider.addEventListener('input', (e) => {
        if (camera) {
            const zoom = parseFloat(e.target.value);
            camera.position.z = 10 - zoom * 0.5;
        }
    });
    
    // Update UI with current verse
    function updateVerseDisplay() {
        const verse = verses[currentVerseIndex];
        verseNumber.textContent = verse.number;
        verseText.textContent = verse.text;
        explanationText.textContent = verse.explanation;
    }
    
    // Initial update
    updateVerseDisplay();
}

// Load a specific verse and its animation
function loadVerse(index) {
    // Clean up existing scene
    if (currentScene) {
        renderer.clear();
        
        // Remove all children recursively
        function removeAllChildren(obj) {
            while(obj.children.length > 0){ 
                removeAllChildren(obj.children[0]);
                obj.remove(obj.children[0]); 
            }
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
        
        removeAllChildren(currentScene);
        currentScene = null;
        
        if (animationMixer) {
            animationMixer.stopAllAction();
            animationMixer = null;
        }
    }
    
    // Create the new scene based on verse index
    let sceneData;
    
    switch (index) {
        case 0: sceneData = createVerse11Scene(); break;
        case 1: sceneData = createVerse12Scene(); break;
        case 2: sceneData = createVerse13Scene(); break;
        case 3: sceneData = createVerse14Scene(); break;
        case 4: sceneData = createVerse15Scene(); break;
        case 5: sceneData = createVerse16Scene(); break;
        case 6: sceneData = createVerse17Scene(); break;
        case 7: sceneData = createVerse18Scene(); break;
        case 8: sceneData = createVerse19Scene(); break;
        default: sceneData = createVerse11Scene();
    }
    
    currentScene = sceneData.scene;
    
    // Start animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Run scene-specific animation
        if (sceneData.animate) {
            sceneData.animate();
        }
        
        // Update controls
        controls.update();
        
        // Render the scene
        renderer.render(currentScene, camera);
    }
    
    animate();
}

// Initialize everything
function init() {
    initBaseScene();
    setupUI();
    loadVerse(currentVerseIndex);
}

// Start the application
init();