import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse25Animation(container, controlsContainer = null) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 6);
    
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
    
    // Create self-referential system (representing actions creating actions)
    const creationSystem = new THREE.Group();
    scene.add(creationSystem);
    
    // Parent creation (original action)
    const parentGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const parentMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a1c71,
        emissive: 0x3a1c71,
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.2
    });
    const parentSphere = new THREE.Mesh(parentGeometry, parentMaterial);
    creationSystem.add(parentSphere);
    
    // Create connecting lines (representing causal relationships)
    const lineGroup = new THREE.Group();
    creationSystem.add(lineGroup);
    
    // Child creations (actions created from original)
    const childrenGroup = new THREE.Group();
    creationSystem.add(childrenGroup);
    
    const childCount = 5;
    const childPositions = [];
    
    for (let i = 0; i < childCount; i++) {
        const angle = (i / childCount) * Math.PI * 2;
        const radius = 2.5;
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.5;  // Small random z offset
        
        const childGeometry = new THREE.SphereGeometry(0.4, 24, 24);
        const childMaterial = new THREE.MeshStandardMaterial({
            color: 0xd76d77,
            emissive: 0xd76d77,
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.3
        });
        const childSphere = new THREE.Mesh(childGeometry, childMaterial);
        childSphere.position.set(x, y, z);
        childrenGroup.add(childSphere);
        
        childPositions.push(new THREE.Vector3(x, y, z));
        
        // Create line from parent to child
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x6d4ab1,
            transparent: true,
            opacity: 0.6
        });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x, y, z)
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        lineGroup.add(line);
    }
    
    // Create grandchild creations
    const grandchildGroup = new THREE.Group();
    creationSystem.add(grandchildGroup);
    
    for (let i = 0; i < childPositions.length; i++) {
        const childPos = childPositions[i];
        
        // Create 2 grandchildren per child
        for (let j = 0; j < 2; j++) {
            const angle = j * Math.PI + (Math.random() * 0.5);
            const radius = 1.2;
            
            const x = childPos.x + Math.cos(angle) * radius;
            const y = childPos.y + Math.sin(angle) * radius;
            const z = childPos.z + (Math.random() - 0.5) * 0.5;
            
            const grandchildGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const grandchildMaterial = new THREE.MeshStandardMaterial({
                color: 0xffaf7b,
                emissive: 0xffaf7b,
                emissiveIntensity: 0.3,
                metalness: 0.3,
                roughness: 0.4
            });
            const grandchildSphere = new THREE.Mesh(grandchildGeometry, grandchildMaterial);
            grandchildSphere.position.set(x, y, z);
            grandchildGroup.add(grandchildSphere);
            
            // Create line from child to grandchild
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xd76d77,
                transparent: true,
                opacity: 0.4
            });
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(childPos.x, childPos.y, childPos.z),
                new THREE.Vector3(x, y, z)
            ]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            lineGroup.add(line);
        }
    }
    
    // Create energy fields (representing quantum influence)
    const energyParticlesCount = 300;
    const energyParticlesGeometry = new THREE.BufferGeometry();
    const energyParticlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const energyPositions = new Float32Array(energyParticlesCount * 3);
    const energyVelocities = [];
    const energySources = [];
    
    for (let i = 0; i < energyParticlesCount; i++) {
        // Assign each particle to either parent, a child, or a grandchild
        let source;
        const sourceType = Math.random();
        
        if (sourceType < 0.3) {
            // Parent-sourced particle
            source = new THREE.Vector3(0, 0, 0);
            energyPositions[i * 3] = source.x + (Math.random() - 0.5) * 0.5;
            energyPositions[i * 3 + 1] = source.y + (Math.random() - 0.5) * 0.5;
            energyPositions[i * 3 + 2] = source.z + (Math.random() - 0.5) * 0.5;
        } else if (sourceType < 0.7) {
            // Child-sourced particle
            const childIndex = Math.floor(Math.random() * childPositions.length);
            source = childPositions[childIndex].clone();
            energyPositions[i * 3] = source.x + (Math.random() - 0.5) * 0.3;
            energyPositions[i * 3 + 1] = source.y + (Math.random() - 0.5) * 0.3;
            energyPositions[i * 3 + 2] = source.z + (Math.random() - 0.5) * 0.3;
        } else {
            // Random position for background particles
            const radius = Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            source = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            energyPositions[i * 3] = source.x;
            energyPositions[i * 3 + 1] = source.y;
            energyPositions[i * 3 + 2] = source.z;
        }
        
        energySources.push(source);
        
        // Random velocity
        energyVelocities.push(new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
        ));
    }
    
    energyParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(energyPositions, 3));
    const energyParticles = new THREE.Points(energyParticlesGeometry, energyParticlesMaterial);
    creationSystem.add(energyParticles);
    
    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the entire creation system
        creationSystem.rotation.y = elapsedTime * 0.1;
        
        // Pulse the parent sphere
        parentSphere.scale.set(
            1 + 0.1 * Math.sin(elapsedTime * 0.8),
            1 + 0.1 * Math.sin(elapsedTime * 0.8),
            1 + 0.1 * Math.sin(elapsedTime * 0.8)
        );
        
        // Animate child spheres
        childrenGroup.children.forEach((child, i) => {
            const offset = i * (Math.PI / childCount);
            child.position.y += Math.sin(elapsedTime + offset) * 0.005;
            child.rotation.y = elapsedTime * 0.5;
        });
        
        // Animate grandchild spheres
        grandchildGroup.children.forEach((grandchild, i) => {
            const offset = i * (Math.PI / grandchildGroup.children.length);
            grandchild.position.z += Math.sin(elapsedTime * 1.5 + offset) * 0.003;
            grandchild.rotation.y = elapsedTime * 0.8;
        });
        
        // Update energy particles
        const positions = energyParticlesGeometry.attributes.position.array;
        
        for (let i = 0; i < energyParticlesCount; i++) {
            // Move particles
            positions[i * 3] += energyVelocities[i].x;
            positions[i * 3 + 1] += energyVelocities[i].y;
            positions[i * 3 + 2] += energyVelocities[i].z;
            
            // Check if particle is too far from its source
            const currentPos = new THREE.Vector3(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            );
            
            const distance = currentPos.distanceTo(energySources[i]);
            
            if (distance > 2.0) {
                // Reset particle to its source
                positions[i * 3] = energySources[i].x + (Math.random() - 0.5) * 0.3;
                positions[i * 3 + 1] = energySources[i].y + (Math.random() - 0.5) * 0.3;
                positions[i * 3 + 2] = energySources[i].z + (Math.random() - 0.5) * 0.3;
                
                // New random velocity
                energyVelocities[i] = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                );
            }
        }
        
        energyParticlesGeometry.attributes.position.needsUpdate = true;
        
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
    
    // Add controls to the controlsContainer if provided
    if (controlsContainer) {
        // Example controls
        const speedControl = document.createElement('div');
        speedControl.innerHTML = `
            <label for="rotationSpeed">Rotation Speed:</label>
            <input type="range" id="rotationSpeed" min="0.01" max="0.5" step="0.01" value="0.1">
        `;
        controlsContainer.appendChild(speedControl);
        
        const rotationSlider = speedControl.querySelector('#rotationSpeed');
        rotationSlider.addEventListener('input', (e) => {
            const newSpeed = parseFloat(e.target.value);
            // Update rotation speed in the animation
            // This is just an example - adjust based on your actual animation
            creationSystem.rotation.y = newSpeed * clock.getElapsedTime();
        });
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset View';
        resetButton.style.padding = '8px 12px';
        resetButton.style.backgroundColor = '#6d4ab1';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.color = 'white';
        resetButton.style.cursor = 'pointer';
        resetButton.style.marginTop = '10px';
        
        resetButton.addEventListener('click', () => {
            // Reset camera to initial position
            camera.position.set(0, 2, 6);
            controls.reset();
        });
        
        controlsContainer.appendChild(resetButton);
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