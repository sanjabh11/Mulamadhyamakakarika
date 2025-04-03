import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse32Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 7);
    
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
    
    // Agent and action visualization
    
    // Create agent (central sphere)
    const agentGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const agentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3a1c71,
        emissive: 0x3a1c71,
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2,
        transmission: 0.3
    });
    const agent = new THREE.Mesh(agentGeometry, agentMaterial);
    // Initialize userData for the agent, as it acts as the root parent
    agent.userData = { children: [], originalPosition: agent.position.clone() };
    rootGroup.add(agent);
    
    // Create action wave patterns (like ripples emanating from agent)
    const actionWavesGroup = new THREE.Group();
    rootGroup.add(actionWavesGroup);
    
    const waveCount = 5;
    const waves = [];
    
    for (let i = 0; i < waveCount; i++) {
        const waveGeometry = new THREE.TorusGeometry(1 + i * 0.5, 0.05, 16, 100);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xd76d77,
            transparent: true,
            opacity: 0.7 - (i * 0.1)
        });
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.rotation.x = Math.PI / 2;
        
        // Add metadata for animation
        wave.userData = {
            originalRadius: 1 + i * 0.5,
            pulsePhase: i * (Math.PI / waveCount),
            expandingSpeed: 0.2
        };
        
        waves.push(wave);
        actionWavesGroup.add(wave);
    }
    
    // Create cascade of self-referenced creations
    const creationsCascadeGroup = new THREE.Group();
    rootGroup.add(creationsCascadeGroup);
    
    // Build a tree-like structure of creations
    function createCreationTree(parent, position, level, maxLevel, angleOffset, children) {
        if (level > maxLevel) return;
        
        // Create a sphere for this creation
        const radius = 0.5 / (level * 0.7);
        const segments = Math.max(8, 16 - level * 2);
        
        const geometry = new THREE.IcosahedronGeometry(radius, 0);
        const material = new THREE.MeshPhysicalMaterial({
            color: level === 1 ? 0xd76d77 : (level === 2 ? 0xe17b93 : 0xffaf7b),
            emissive: level === 1 ? 0xd76d77 : (level === 2 ? 0xe17b93 : 0xffaf7b),
            emissiveIntensity: 0.3,
            metalness: 0.7 - (level * 0.1),
            roughness: 0.2 + (level * 0.1),
            clearcoat: 1.0 - (level * 0.2),
            clearcoatRoughness: 0.2 + (level * 0.1),
            transparent: true,
            opacity: 0.9 - (level * 0.1)
        });
        
        const creation = new THREE.Mesh(geometry, material);
        creation.position.copy(position);
        
        // Add metadata for animation
        creation.userData = {
            level: level,
            parent: parent,
            children: [],
            originalPosition: position.clone(),
            pulsePhase: Math.random() * Math.PI * 2,
            orbitRadius: parent ? position.distanceTo(parent.position) : 0,
            orbitSpeed: 0.3 / level,
            orbitAngle: angleOffset || 0
        };
        
        if (parent) {
            parent.userData.children.push(creation);
        }
        
        creationsCascadeGroup.add(creation);
        
        // If there's a parent, connect with line
        if (parent) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                parent.position,
                position
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3 - (level * 0.05)
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            
            // Add metadata for animation
            line.userData = {
                startObject: parent,
                endObject: creation,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            creationsCascadeGroup.add(line);
        }
        
        // Create child nodes
        if (children > 0) {
            for (let i = 0; i < children; i++) {
                const angle = (i / children) * Math.PI * 2;
                const distance = 1.2 - (level * 0.1);
                
                const childPosition = new THREE.Vector3(
                    position.x + Math.cos(angle) * distance,
                    position.y + 0.2,
                    position.z + Math.sin(angle) * distance
                );
                
                // Each level has fewer children
                const nextChildren = Math.max(1, children - 1);
                createCreationTree(creation, childPosition, level + 1, maxLevel, angle, nextChildren);
            }
        }
        
        return creation;
    }
    
    // Create the first level of creations directly from agent
    const firstLevelCount = 3;
    
    for (let i = 0; i < firstLevelCount; i++) {
        const angle = (i / firstLevelCount) * Math.PI * 2;
        const distance = 2;
        
        const position = new THREE.Vector3(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
        );
        
        createCreationTree(agent, position, 1, 4, angle, 3);
    }
    
    // Create energy field connecting all creations
    const energyParticlesCount = 200;
    const energyGeometry = new THREE.BufferGeometry();
    const energyMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const energyPositions = new Float32Array(energyParticlesCount * 3);
    const energyColors = new Float32Array(energyParticlesCount * 3);
    const energyVelocities = [];
    
    // Place energy particles near creations
    const allCreations = creationsCascadeGroup.children.filter(obj => obj instanceof THREE.Mesh);
    
    for (let i = 0; i < energyParticlesCount; i++) {
        // Pick a random creation to start from
        const creation = allCreations[Math.floor(Math.random() * allCreations.length)];
        const position = creation.position.clone();
        
        // Add small offset
        position.x += (Math.random() - 0.5) * 0.3;
        position.y += (Math.random() - 0.5) * 0.3;
        position.z += (Math.random() - 0.5) * 0.3;
        
        energyPositions[i * 3] = position.x;
        energyPositions[i * 3 + 1] = position.y;
        energyPositions[i * 3 + 2] = position.z;
        
        // Set color based on creation level
        const color = new THREE.Color(
            creation.userData.level === 1 ? 0xd76d77 : 
            (creation.userData.level === 2 ? 0xe17b93 : 0xffaf7b)
        );
        
        energyColors[i * 3] = color.r;
        energyColors[i * 3 + 1] = color.g;
        energyColors[i * 3 + 2] = color.b;
        
        // Set velocity to move toward another random creation
        const targetCreation = allCreations[Math.floor(Math.random() * allCreations.length)];
        const direction = new THREE.Vector3().subVectors(targetCreation.position, position).normalize();
        
        energyVelocities.push({
            velocity: direction.multiplyScalar(0.01 + Math.random() * 0.02),
            target: targetCreation,
            lifetime: 0,
            maxLifetime: 50 + Math.random() * 100
        });
    }
    
    energyGeometry.setAttribute('position', new THREE.BufferAttribute(energyPositions, 3));
    energyGeometry.setAttribute('color', new THREE.BufferAttribute(energyColors, 3));
    energyMaterial.vertexColors = true;
    
    const energyParticles = new THREE.Points(energyGeometry, energyMaterial);
    rootGroup.add(energyParticles);
    
    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the entire scene slowly
        rootGroup.rotation.y = elapsedTime * 0.1;
        
        // Animate agent
        const agentPulse = 1 + 0.1 * Math.sin(elapsedTime * 0.7);
        agent.scale.set(agentPulse, agentPulse, agentPulse);
        
        // Animate action waves
        waves.forEach((wave, index) => {
            // Pulse wave size
            const pulse = 1 + 0.3 * Math.sin(elapsedTime * 0.5 + wave.userData.pulsePhase);
            wave.scale.set(pulse, pulse, pulse);
            
            // Rotate waves
            wave.rotation.z = elapsedTime * 0.2 * (index % 2 === 0 ? 1 : -1);
            
            // Expand waves and reset
            const newRadius = wave.userData.originalRadius + (elapsedTime * wave.userData.expandingSpeed) % 3;
            wave.geometry.dispose();
            wave.geometry = new THREE.TorusGeometry(newRadius, 0.05, 16, 100);
            
            // Fade opacity based on size
            wave.material.opacity = 0.7 - (newRadius - wave.userData.originalRadius) * 0.1;
        });
        
        // Animate creation cascade
        creationsCascadeGroup.children.forEach(obj => {
            if (obj instanceof THREE.Mesh && obj !== agent) {
                // Animate creation
                const userData = obj.userData;
                
                if (userData.parent) {
                    // Orbit around parent
                    userData.orbitAngle += delta * userData.orbitSpeed;
                    
                    const parent = userData.parent;
                    const radius = userData.orbitRadius;
                    
                    // Calculate new position
                    obj.position.x = parent.position.x + Math.cos(userData.orbitAngle) * radius;
                    obj.position.z = parent.position.z + Math.sin(userData.orbitAngle) * radius;
                    
                    // Maintain Y offset
                    obj.position.y = parent.position.y + (userData.originalPosition.y - parent.userData.originalPosition.y);
                }
                
                // Pulse size based on level
                const pulse = 1 + (0.2 / userData.level) * Math.sin(elapsedTime * (1 / userData.level) + userData.pulsePhase);
                obj.scale.set(pulse, pulse, pulse);
                
                // Rotate around itself
                obj.rotation.x = elapsedTime * 0.5 / userData.level;
                obj.rotation.y = elapsedTime * 0.7 / userData.level;
            } else if (obj instanceof THREE.Line) {
                // Update line connecting creations
                const start = obj.userData.startObject.position;
                const end = obj.userData.endObject.position;
                
                const positions = obj.geometry.attributes.position.array;
                positions[0] = start.x;
                positions[1] = start.y;
                positions[2] = start.z;
                positions[3] = end.x;
                positions[4] = end.y;
                positions[5] = end.z;
                
                obj.geometry.attributes.position.needsUpdate = true;
                
                // Pulse line opacity
                obj.material.opacity = 0.2 + 0.1 * Math.sin(elapsedTime * 2 + obj.userData.pulsePhase);
            }
        });
        
        // Animate energy particles
        const energyPositions = energyGeometry.attributes.position.array;
        const energyColors = energyGeometry.attributes.color.array;
        
        for (let i = 0; i < energyParticlesCount; i++) {
            const particleData = energyVelocities[i];
            
            // Move toward target
            energyPositions[i * 3] += particleData.velocity.x;
            energyPositions[i * 3 + 1] += particleData.velocity.y;
            energyPositions[i * 3 + 2] += particleData.velocity.z;
            
            // Increment lifetime
            particleData.lifetime += 1;
            
            // Check if particle needs to be reset
            if (particleData.lifetime >= particleData.maxLifetime) {
                // Pick a new random creation to start from
                const creation = allCreations[Math.floor(Math.random() * allCreations.length)];
                const position = creation.position.clone();
                
                // Add small offset
                position.x += (Math.random() - 0.5) * 0.3;
                position.y += (Math.random() - 0.5) * 0.3;
                position.z += (Math.random() - 0.5) * 0.3;
                
                energyPositions[i * 3] = position.x;
                energyPositions[i * 3 + 1] = position.y;
                energyPositions[i * 3 + 2] = position.z;
                
                // Set color based on creation level
                const color = new THREE.Color(
                    creation.userData.level === 1 ? 0xd76d77 : 
                    (creation.userData.level === 2 ? 0xe17b93 : 0xffaf7b)
                );
                
                energyColors[i * 3] = color.r;
                energyColors[i * 3 + 1] = color.g;
                energyColors[i * 3 + 2] = color.b;
                
                // Set new target and velocity
                const targetCreation = allCreations[Math.floor(Math.random() * allCreations.length)];
                const direction = new THREE.Vector3().subVectors(targetCreation.position, position).normalize();
                
                particleData.velocity = direction.multiplyScalar(0.01 + Math.random() * 0.02);
                particleData.target = targetCreation;
                particleData.lifetime = 0;
                particleData.maxLifetime = 50 + Math.random() * 100;
            }
        }
        
        energyGeometry.attributes.position.needsUpdate = true;
        energyGeometry.attributes.color.needsUpdate = true;
        
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