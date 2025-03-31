import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse27Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 6);
    
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
    
    // Create field system (representing quantum fields creating bodies)
    const fieldSystem = new THREE.Group();
    scene.add(fieldSystem);
    
    // Create action field (represents actions)
    const actionFieldGeometry = new THREE.TorusGeometry(3, 0.2, 16, 100);
    const actionFieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a1c71,
        emissive: 0x3a1c71,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 0.5,
        transparent: true,
        opacity: 0.7
    });
    const actionField = new THREE.Mesh(actionFieldGeometry, actionFieldMaterial);
    actionField.rotation.x = Math.PI / 2;
    fieldSystem.add(actionField);
    
    // Create affliction field (represents afflictions)
    const afflictionFieldGeometry = new THREE.TorusGeometry(3, 0.2, 16, 100);
    const afflictionFieldMaterial = new THREE.MeshStandardMaterial({
        color: 0xd76d77,
        emissive: 0xd76d77,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 0.5,
        transparent: true,
        opacity: 0.7
    });
    const afflictionField = new THREE.Mesh(afflictionFieldGeometry, afflictionFieldMaterial);
    afflictionField.rotation.x = Math.PI / 4;
    fieldSystem.add(afflictionField);
    
    // Add field particles (energy of the fields)
    const fieldParticlesCount = 1000;
    const fieldParticlesGeometry = new THREE.BufferGeometry();
    const fieldParticlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(fieldParticlesCount * 3);
    const colors = new Float32Array(fieldParticlesCount * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < fieldParticlesCount; i++) {
        // Determine whether this particle belongs to action or affliction field
        const isActionField = Math.random() > 0.5;
        
        // Calculate position on the appropriate torus
        const fieldRadius = 3;
        const tubeRadius = 0.5 + Math.random() * 0.3; // Slightly wider than the visible torus
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        
        // Position on the torus
        let x = (fieldRadius + tubeRadius * Math.cos(phi)) * Math.cos(theta);
        let y = (fieldRadius + tubeRadius * Math.cos(phi)) * Math.sin(theta);
        let z = tubeRadius * Math.sin(phi);
        
        // Rotate for the appropriate field
        if (isActionField) {
            // Action field is rotated around x-axis by PI/2
            const temp = y;
            y = z;
            z = -temp;
            
            color.set(0x3a1c71);
        } else {
            // Affliction field is rotated around x-axis by PI/4
            const cosAngle = Math.cos(Math.PI / 4);
            const sinAngle = Math.sin(Math.PI / 4);
            const tempY = y;
            y = y * cosAngle + z * sinAngle;
            z = -tempY * sinAngle + z * cosAngle;
            
            color.set(0xd76d77);
        }
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    fieldParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    fieldParticlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    fieldParticlesMaterial.vertexColors = true;
    
    const fieldParticles = new THREE.Points(fieldParticlesGeometry, fieldParticlesMaterial);
    fieldSystem.add(fieldParticles);
    
    // Create body manifestation (representing the body arising from actions and afflictions)
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);
    
    // Human-like form using a simple stick figure made of line segments
    const bodyMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.0 // Start invisible
    });
    
    // Create stick figure outline
    const headRadius = 0.3;
    const bodyHeight = 1.5;
    const shoulderWidth = 0.8;
    const hipWidth = 0.6;
    const legLength = 1.2;
    const armLength = 0.9;
    
    // Head
    const headGeometry = new THREE.CircleGeometry(headRadius, 32);
    const head = new THREE.LineSegments(
        new THREE.EdgesGeometry(headGeometry),
        bodyMaterial
    );
    head.position.y = bodyHeight;
    bodyGroup.add(head);
    
    // Body
    const bodyGeometry = new THREE.BufferGeometry();
    const bodyVertices = [
        // Torso
        0, bodyHeight, 0,
        0, 0, 0,
        
        // Shoulders
        -shoulderWidth/2, bodyHeight * 0.8, 0,
        shoulderWidth/2, bodyHeight * 0.8, 0,
        
        // Arms
        -shoulderWidth/2, bodyHeight * 0.8, 0,
        -shoulderWidth/2 - armLength, bodyHeight * 0.5, 0,
        
        shoulderWidth/2, bodyHeight * 0.8, 0,
        shoulderWidth/2 + armLength, bodyHeight * 0.5, 0,
        
        // Hips
        -hipWidth/2, 0, 0,
        hipWidth/2, 0, 0,
        
        // Legs
        -hipWidth/2, 0, 0,
        -hipWidth/2, -legLength, 0,
        
        hipWidth/2, 0, 0,
        hipWidth/2, -legLength, 0
    ];
    
    bodyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bodyVertices, 3));
    const bodyLines = new THREE.LineSegments(bodyGeometry, bodyMaterial);
    bodyGroup.add(bodyLines);
    
    // Position the body at the center
    bodyGroup.position.set(0, 0, 0);
    
    // Create energy particles flowing toward the body
    const energyParticlesCount = 200;
    const energyGeometry = new THREE.BufferGeometry();
    const energyMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });
    
    const energyPositions = new Float32Array(energyParticlesCount * 3);
    const energyColors = new Float32Array(energyParticlesCount * 3);
    const energyVelocities = [];
    const energyTargets = [];
    
    for (let i = 0; i < energyParticlesCount; i++) {
        // Start positions on the fields
        const isActionField = Math.random() > 0.5;
        
        // Calculate position on the appropriate torus
        const fieldRadius = 3;
        const tubeRadius = 0.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        
        // Position on the torus
        let x = (fieldRadius + tubeRadius * Math.cos(phi)) * Math.cos(theta);
        let y = (fieldRadius + tubeRadius * Math.cos(phi)) * Math.sin(theta);
        let z = tubeRadius * Math.sin(phi);
        
        // Rotate for the appropriate field
        if (isActionField) {
            // Action field is rotated around x-axis by PI/2
            const temp = y;
            y = z;
            z = -temp;
            
            color.set(0x3a1c71);
        } else {
            // Affliction field is rotated around x-axis by PI/4
            const cosAngle = Math.cos(Math.PI / 4);
            const sinAngle = Math.sin(Math.PI / 4);
            const tempY = y;
            y = y * cosAngle + z * sinAngle;
            z = -tempY * sinAngle + z * cosAngle;
            
            color.set(0xd76d77);
        }
        
        energyPositions[i * 3] = x;
        energyPositions[i * 3 + 1] = y;
        energyPositions[i * 3 + 2] = z;
        
        energyColors[i * 3] = color.r;
        energyColors[i * 3 + 1] = color.g;
        energyColors[i * 3 + 2] = color.b;
        
        // Target is a random point on the body
        const bodyParts = [
            {x: 0, y: bodyHeight, z: 0}, // Head center
            {x: 0, y: bodyHeight/2, z: 0}, // Torso
            {x: -shoulderWidth/2, y: bodyHeight * 0.8, z: 0}, // Left shoulder
            {x: shoulderWidth/2, y: bodyHeight * 0.8, z: 0}, // Right shoulder
            {x: -hipWidth/2, y: 0, z: 0}, // Left hip
            {x: hipWidth/2, y: 0, z: 0}, // Right hip
            {x: -hipWidth/2, y: -legLength/2, z: 0}, // Left leg
            {x: hipWidth/2, y: -legLength/2, z: 0}, // Right leg
            {x: -shoulderWidth/2 - armLength/2, y: bodyHeight * 0.65, z: 0}, // Left arm
            {x: shoulderWidth/2 + armLength/2, y: bodyHeight * 0.65, z: 0} // Right arm
        ];
        
        const randomPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
        energyTargets.push(randomPart);
        
        // Velocity for moving toward the body
        energyVelocities.push({
            progress: 0,
            speed: 0.002 + Math.random() * 0.005
        });
    }
    
    energyGeometry.setAttribute('position', new THREE.BufferAttribute(energyPositions, 3));
    energyGeometry.setAttribute('color', new THREE.BufferAttribute(energyColors, 3));
    
    const energyParticles = new THREE.Points(energyGeometry, energyMaterial);
    scene.add(energyParticles);
    
    // Animation
    const clock = new THREE.Clock();
    let bodyManifested = false;
    let animationId;
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the field system
        fieldSystem.rotation.z = elapsedTime * 0.1;
        
        // Rotate action and affliction fields independently
        actionField.rotation.z = elapsedTime * 0.2;
        afflictionField.rotation.z = -elapsedTime * 0.15;
        
        // Pulse the fields
        const actionPulse = 1 + 0.1 * Math.sin(elapsedTime * 0.7);
        const afflictionPulse = 1 + 0.1 * Math.sin(elapsedTime * 0.9 + Math.PI);
        
        actionField.scale.set(actionPulse, actionPulse, actionPulse);
        afflictionField.scale.set(afflictionPulse, afflictionPulse, afflictionPulse);
        
        // Update field particles
        fieldParticles.rotation.z = elapsedTime * 0.05;
        
        // Update energy particles flowing toward the body
        const energyPositions = energyGeometry.attributes.position.array;
        let allParticlesReached = true;
        
        for (let i = 0; i < energyParticlesCount; i++) {
            if (energyVelocities[i].progress < 1) {
                energyVelocities[i].progress += energyVelocities[i].speed;
                allParticlesReached = false;
                
                // Interpolate position from field to body target
                const progress = energyVelocities[i].progress;
                const startX = energyPositions[i * 3];
                const startY = energyPositions[i * 3 + 1];
                const startZ = energyPositions[i * 3 + 2];
                
                const endX = energyTargets[i].x;
                const endY = energyTargets[i].y;
                const endZ = energyTargets[i].z;
                
                // Use ease-in function to make movement accelerate toward the body
                const easeProgress = Math.pow(progress, 2);
                
                energyPositions[i * 3] = startX + (endX - startX) * easeProgress;
                energyPositions[i * 3 + 1] = startY + (endY - startY) * easeProgress;
                energyPositions[i * 3 + 2] = startZ + (endZ - startZ) * easeProgress;
                
                // Fade out as they approach the target
                if (progress > 0.7) {
                    energyMaterial.opacity = 0.7 * (1 - (progress - 0.7) / 0.3);
                }
            }
        }
        
        energyGeometry.attributes.position.needsUpdate = true;
        
        // Manifest the body as energy particles reach it
        if (!bodyManifested && elapsedTime > 3) {
            bodyManifested = true;
            
            // Gradually increase body opacity
            const manifestDuration = 3;
            const startTime = elapsedTime;
            
            const manifestInterval = setInterval(() => {
                const currentTime = clock.getElapsedTime();
                const progress = (currentTime - startTime) / manifestDuration;
                
                if (progress >= 1) {
                    bodyMaterial.opacity = 0.8;
                    clearInterval(manifestInterval);
                } else {
                    bodyMaterial.opacity = progress * 0.8;
                }
            }, 50);
        }
        
        // Slight body movement once manifested
        if (bodyManifested) {
            bodyGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;
            bodyGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.1;
        }
        
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
        cancelAnimationFrame(animationId);
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