import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse33Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Root group for all objects
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    
    // Create illusory city (City of Gandharvas)
    const cityGroup = new THREE.Group();
    rootGroup.add(cityGroup);
    
    // Create buildings
    const buildingCount = 50;
    const buildings = [];
    
    // City layout parameters
    const cityRadius = 8;
    const maxBuildingHeight = 5;
    
    for (let i = 0; i < buildingCount; i++) {
        // Random position within the city radius
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.pow(Math.random(), 0.5) * cityRadius; // Square root for more uniform distribution
        
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        // Random building dimensions
        const width = 0.5 + Math.random() * 1;
        const depth = 0.5 + Math.random() * 1;
        const height = 1 + Math.random() * maxBuildingHeight;
        
        // Create building geometry
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x3a1c71,
            emissive: 0x3a1c71,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.7,
            transmission: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, height / 2, z);
        
        // Add metadata for animation
        building.userData = {
            originalHeight: height,
            pulsePhase: Math.random() * Math.PI * 2,
            fadePhase: Math.random() * Math.PI * 2,
            flickerTime: 0,
            nextFlickerTime: 10 + Math.random() * 20
        };
        
        buildings.push(building);
        cityGroup.add(building);
    }
    
    // Add a city floor (reflecting surface)
    const floorGeometry = new THREE.CircleGeometry(cityRadius, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x6d4ab1,
        metalness: 0.9,
        roughness: 0.3,
        transparent: true,
        opacity: 0.5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01; // Slightly below to avoid z-fighting
    cityGroup.add(floor);
    
    // Create mirage effect (heat distortion)
    const mirageGroup = new THREE.Group();
    rootGroup.add(mirageGroup);
    
    // Create mirage particles
    const mirageParticlesCount = 1000;
    const mirageGeometry = new THREE.BufferGeometry();
    const mirageMaterial = new THREE.PointsMaterial({
        color: 0xd76d77,
        size: 0.1,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const miragePositions = new Float32Array(mirageParticlesCount * 3);
    const mirageVelocities = [];
    
    for (let i = 0; i < mirageParticlesCount; i++) {
        // Random position within a horizontal disc above the city
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * cityRadius;
        
        miragePositions[i * 3] = Math.cos(angle) * distance;
        miragePositions[i * 3 + 1] = Math.random() * 2; // Height above city
        miragePositions[i * 3 + 2] = Math.sin(angle) * distance;
        
        // Random velocity (mostly upward)
        mirageVelocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: 0.01 + Math.random() * 0.02,
            z: (Math.random() - 0.5) * 0.01,
            lifetime: Math.random() * 100
        });
    }
    
    mirageGeometry.setAttribute('position', new THREE.BufferAttribute(miragePositions, 3));
    const mirageParticles = new THREE.Points(mirageGeometry, mirageMaterial);
    mirageGroup.add(mirageParticles);
    
    // Create dream elements
    const dreamGroup = new THREE.Group();
    rootGroup.add(dreamGroup);
    
    // Dream symbols: Afflictions, actions, bodies, agents, fruits
    const symbolTypes = [
        { name: "Affliction", color: 0xd76d77, geometry: new THREE.TetrahedronGeometry(0.7, 0) },
        { name: "Action", color: 0x3a1c71, geometry: new THREE.OctahedronGeometry(0.7, 0) },
        { name: "Body", color: 0x6d4ab1, geometry: new THREE.SphereGeometry(0.7, 16, 16) },
        { name: "Agent", color: 0xe17b93, geometry: new THREE.IcosahedronGeometry(0.7, 0) },
        { name: "Fruit", color: 0xffaf7b, geometry: new THREE.DodecahedronGeometry(0.7, 0) }
    ];
    
    const dreamSymbols = [];
    
    symbolTypes.forEach((type, index) => {
        // Position symbols in a circle above the city
        const angle = (index / symbolTypes.length) * Math.PI * 2;
        const radius = 5;
        const height = 8;
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const material = new THREE.MeshPhysicalMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.3,
            metalness: 0.7,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8,
            transmission: 0.3
        });
        
        const symbol = new THREE.Mesh(type.geometry, material);
        symbol.position.set(x, height, z);
        
        // Add metadata for animation
        symbol.userData = {
            type: type.name,
            originalPosition: new THREE.Vector3(x, height, z),
            orbitRadius: radius,
            orbitHeight: height,
            orbitAngle: angle,
            pulsePhase: Math.random() * Math.PI * 2,
            fadePhase: Math.random() * Math.PI * 2,
            orbitSpeed: 0.2 + Math.random() * 0.1
        };
        
        dreamSymbols.push(symbol);
        dreamGroup.add(symbol);
    });
    
    // Connect dream symbols with energy streams
    dreamSymbols.forEach((symbol, i) => {
        const nextSymbol = dreamSymbols[(i + 1) % dreamSymbols.length];
        
        // Create curved path between symbols
        const curvePoints = [];
        const start = symbol.position;
        const end = nextSymbol.position;
        const mid = new THREE.Vector3(
            (start.x + end.x) / 2,
            ((start.y + end.y) / 2) + 2, // Raise the middle point
            (start.z + end.z) / 2
        );
        
        // Create a quadratic curve
        for (let t = 0; t <= 1; t += 0.05) {
            const point = new THREE.Vector3(
                (1-t)*(1-t)*start.x + 2*(1-t)*t*mid.x + t*t*end.x,
                (1-t)*(1-t)*start.y + 2*(1-t)*t*mid.y + t*t*end.y,
                (1-t)*(1-t)*start.z + 2*(1-t)*t*mid.z + t*t*end.z
            );
            curvePoints.push(point);
        }
        
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        const curve = new THREE.Line(curveGeometry, curveMaterial);
        curve.userData = {
            startSymbol: symbol,
            endSymbol: nextSymbol,
            midPoint: mid,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        dreamGroup.add(curve);
    });
    
    // Add dream particles flowing along the connections
    const dreamParticlesCount = 500;
    const dreamParticlesGeometry = new THREE.BufferGeometry();
    const dreamParticlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const dreamParticlesPositions = new Float32Array(dreamParticlesCount * 3);
    const dreamParticlesData = [];
    
    for (let i = 0; i < dreamParticlesCount; i++) {
        // Assign each particle to a connection between symbols
        const connectionIndex = Math.floor(Math.random() * dreamSymbols.length);
        const startSymbol = dreamSymbols[connectionIndex];
        const endSymbol = dreamSymbols[(connectionIndex + 1) % dreamSymbols.length];
        
        // Calculate midpoint (for quadratic curve)
        const mid = new THREE.Vector3(
            (startSymbol.position.x + endSymbol.position.x) / 2,
            ((startSymbol.position.y + endSymbol.position.y) / 2) + 2, // Raise the middle point
            (startSymbol.position.z + endSymbol.position.z) / 2
        );
        
        // Random progress along the curve
        const t = Math.random();
        
        // Calculate position on quadratic curve
        const x = (1-t)*(1-t)*startSymbol.position.x + 2*(1-t)*t*mid.x + t*t*endSymbol.position.x;
        const y = (1-t)*(1-t)*startSymbol.position.y + 2*(1-t)*t*mid.y + t*t*endSymbol.position.y;
        const z = (1-t)*(1-t)*startSymbol.position.z + 2*(1-t)*t*mid.z + t*t*endSymbol.position.z;
        
        dreamParticlesPositions[i * 3] = x;
        dreamParticlesPositions[i * 3 + 1] = y;
        dreamParticlesPositions[i * 3 + 2] = z;
        
        // Store data for animation
        dreamParticlesData.push({
            connectionIndex: connectionIndex,
            progress: t,
            speed: 0.002 + Math.random() * 0.003,
            color: new THREE.Color(Math.random() > 0.5 ? startSymbol.userData.type.color : endSymbol.userData.type.color)
        });
    }
    
    dreamParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(dreamParticlesPositions, 3));
    const dreamParticles = new THREE.Points(dreamParticlesGeometry, dreamParticlesMaterial);
    dreamGroup.add(dreamParticles);
    
    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Slowly rotate the entire scene
        rootGroup.rotation.y = elapsedTime * 0.05;
        
        // Animate buildings in the illusory city
        buildings.forEach(building => {
            const userData = building.userData;
            
            // Height fluctuation (buildings appear/disappear)
            const heightScale = 0.7 + 0.5 * Math.sin(elapsedTime * 0.2 + userData.pulsePhase);
            building.scale.y = heightScale;
            
            // Adjust y position to keep the bottom at ground level
            building.position.y = userData.originalHeight * heightScale / 2;
            
            // Transparency fluctuation
            building.material.opacity = 0.5 + 0.3 * Math.sin(elapsedTime * 0.3 + userData.fadePhase);
            
            // Occasional flickering
            userData.flickerTime++;
            if (userData.flickerTime > userData.nextFlickerTime) {
                building.visible = !building.visible;
                userData.flickerTime = 0;
                userData.nextFlickerTime = 10 + Math.random() * 20;
                
                // Reset visibility after a brief moment
                setTimeout(() => {
                    building.visible = true;
                }, 100 + Math.random() * 200);
            }
        });
        
        // Animate floor (mirage effect)
        floor.material.opacity = 0.3 + 0.2 * Math.sin(elapsedTime * 0.5);
        
        // Animate mirage particles
        const miragePositions = mirageGeometry.attributes.position.array;
        
        for (let i = 0; i < mirageParticlesCount; i++) {
            // Update position
            miragePositions[i * 3] += mirageVelocities[i].x;
            miragePositions[i * 3 + 1] += mirageVelocities[i].y;
            miragePositions[i * 3 + 2] += mirageVelocities[i].z;
            
            // Update lifetime
            mirageVelocities[i].lifetime--;
            
            // Reset if lifetime expires or if too high
            if (mirageVelocities[i].lifetime <= 0 || miragePositions[i * 3 + 1] > 10) {
                // Reset to a new position within the city radius
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * cityRadius;
                
                miragePositions[i * 3] = Math.cos(angle) * distance;
                miragePositions[i * 3 + 1] = Math.random() * 0.5; // Start low above the city
                miragePositions[i * 3 + 2] = Math.sin(angle) * distance;
                
                // New velocity
                mirageVelocities[i] = {
                    x: (Math.random() - 0.5) * 0.01,
                    y: 0.01 + Math.random() * 0.02,
                    z: (Math.random() - 0.5) * 0.01,
                    lifetime: 50 + Math.random() * 100
                };
            }
        }
        
        mirageGeometry.attributes.position.needsUpdate = true;
        
        // Animate dream symbols
        dreamSymbols.forEach((symbol, index) => {
            const userData = symbol.userData;
            
            // Orbit around the city center
            userData.orbitAngle += delta * userData.orbitSpeed;
            
            // Calculate new position
            symbol.position.x = Math.cos(userData.orbitAngle) * userData.orbitRadius;
            symbol.position.z = Math.sin(userData.orbitAngle) * userData.orbitRadius;
            
            // Bobbing up and down
            symbol.position.y = userData.orbitHeight + Math.sin(elapsedTime * 0.5 + index) * 0.5;
            
            // Rotation
            symbol.rotation.x = elapsedTime * 0.3;
            symbol.rotation.y = elapsedTime * 0.5;
            
            // Pulsing size
            const pulse = 1 + 0.2 * Math.sin(elapsedTime * 0.7 + userData.pulsePhase);
            symbol.scale.set(pulse, pulse, pulse);
            
            // Fluctuating opacity
            symbol.material.opacity = 0.6 + 0.3 * Math.sin(elapsedTime * 0.3 + userData.fadePhase);
        });
        
        // Update energy connections between symbols
        dreamGroup.children.forEach(obj => {
            if (obj instanceof THREE.Line && !(obj instanceof THREE.Points)) {
                const startSymbol = obj.userData.startSymbol;
                const endSymbol = obj.userData.endSymbol;
                
                // Update midpoint based on new symbol positions
                const mid = new THREE.Vector3(
                    (startSymbol.position.x + endSymbol.position.x) / 2,
                    ((startSymbol.position.y + endSymbol.position.y) / 2) + 2, // Raise the middle point
                    (startSymbol.position.z + endSymbol.position.z) / 2
                );
                
                // Update curve points
                const curvePoints = [];
                for (let t = 0; t <= 1; t += 0.05) {
                    const point = new THREE.Vector3(
                        (1-t)*(1-t)*startSymbol.position.x + 2*(1-t)*t*mid.x + t*t*endSymbol.position.x,
                        (1-t)*(1-t)*startSymbol.position.y + 2*(1-t)*t*mid.y + t*t*endSymbol.position.y,
                        (1-t)*(1-t)*startSymbol.position.z + 2*(1-t)*t*mid.z + t*t*endSymbol.position.z
                    );
                    curvePoints.push(point);
                }
                
                // Update curve geometry
                obj.geometry.dispose();
                obj.geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
                
                // Pulse opacity
                obj.material.opacity = 0.2 + 0.2 * Math.sin(elapsedTime * 2 + obj.userData.pulsePhase);
                
                // Store midpoint for particle animation
                obj.userData.midPoint = mid;
            }
        });
        
        // Animate dream particles
        const dreamPositions = dreamParticlesGeometry.attributes.position.array;
        
        for (let i = 0; i < dreamParticlesCount; i++) {
            const particleData = dreamParticlesData[i];
            
            // Update progress along the curve
            particleData.progress += particleData.speed;
            if (particleData.progress > 1) {
                particleData.progress = 0;
                
                // Possibly change to a different connection
                if (Math.random() < 0.3) {
                    particleData.connectionIndex = Math.floor(Math.random() * dreamSymbols.length);
                }
            }
            
            const t = particleData.progress;
            const connectionIndex = particleData.connectionIndex;
            
            // Get start and end symbols
            const startSymbol = dreamSymbols[connectionIndex];
            const endSymbol = dreamSymbols[(connectionIndex + 1) % dreamSymbols.length];
            
            // Calculate midpoint (for quadratic curve)
            const mid = new THREE.Vector3(
                (startSymbol.position.x + endSymbol.position.x) / 2,
                ((startSymbol.position.y + endSymbol.position.y) / 2) + 2, // Raise the middle point
                (startSymbol.position.z + endSymbol.position.z) / 2
            );
            
            // Calculate position on quadratic curve
            dreamPositions[i * 3] = (1-t)*(1-t)*startSymbol.position.x + 2*(1-t)*t*mid.x + t*t*endSymbol.position.x;
            dreamPositions[i * 3 + 1] = (1-t)*(1-t)*startSymbol.position.y + 2*(1-t)*t*mid.y + t*t*endSymbol.position.y;
            dreamPositions[i * 3 + 2] = (1-t)*(1-t)*startSymbol.position.z + 2*(1-t)*t*mid.z + t*t*endSymbol.position.z;
        }
        
        dreamParticlesGeometry.attributes.position.needsUpdate = true;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    function handleResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    function cleanup() {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animate);
        controls.dispose();
        renderer.dispose();
        
        // Clean up THREE.js objects
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
    
    return {
        cleanup,
        resize: handleResize
    };
}

