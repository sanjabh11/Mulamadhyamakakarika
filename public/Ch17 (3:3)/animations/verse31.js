import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse31Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a20);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    
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
    
    // Create root group for all objects
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    
    // Create magical teacher (source of creations)
    const teacherGroup = new THREE.Group();
    rootGroup.add(teacherGroup);
    
    // Teacher represented as a glowing orb
    const teacherGeometry = new THREE.SphereGeometry(1, 32, 32);
    const teacherMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3a1c71,
        emissive: 0x3a1c71,
        emissiveIntensity: 0.7,
        metalness: 0.9,
        roughness: 0.1,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const teacher = new THREE.Mesh(teacherGeometry, teacherMaterial);
    teacher.position.set(0, 3, 0);
    teacherGroup.add(teacher);
    
    // Add aura to teacher
    const auraGeometry = new THREE.SphereGeometry(1.3, 32, 32);
    const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0x6d4ab1,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    teacher.add(aura);
    
    // Create magical power emanations
    const magicParticlesCount = 100;
    const magicParticlesGeometry = new THREE.BufferGeometry();
    const magicParticlesMaterial = new THREE.PointsMaterial({
        color: 0xd76d77,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const magicPositions = new Float32Array(magicParticlesCount * 3);
    const magicVelocities = [];
    
    for (let i = 0; i < magicParticlesCount; i++) {
        // Start at teacher position
        magicPositions[i * 3] = teacher.position.x;
        magicPositions[i * 3 + 1] = teacher.position.y;
        magicPositions[i * 3 + 2] = teacher.position.z;
        
        // Random velocity outward
        const angle = Math.random() * Math.PI * 2;
        const z = Math.random() * 2 - 1;
        const radius = Math.sqrt(1 - z * z);
        
        magicVelocities.push({
            x: radius * Math.cos(angle) * 0.03,
            y: radius * Math.sin(angle) * 0.03,
            z: z * 0.03,
            life: 1.0, // Full life
            maxLife: 2 + Math.random() * 3 // 2-5 seconds
        });
    }
    
    magicParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(magicPositions, 3));
    const magicParticles = new THREE.Points(magicParticlesGeometry, magicParticlesMaterial);
    teacherGroup.add(magicParticles);
    
    // Create first generation of creations
    const creationsGroup = new THREE.Group();
    rootGroup.add(creationsGroup);
    
    // First creation levels
    const firstCreationsCount = 5;
    const firstCreations = [];
    
    for (let i = 0; i < firstCreationsCount; i++) {
        const angle = (i / firstCreationsCount) * Math.PI * 2;
        const radius = 3;
        
        const x = Math.cos(angle) * radius;
        const y = 0;
        const z = Math.sin(angle) * radius;
        
        const creationGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 64, 16);
        const creationMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd76d77,
            emissive: 0xd76d77,
            emissiveIntensity: 0.3,
            metalness: 0.7,
            roughness: 0.3,
            transmission: 0.3,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        const creation = new THREE.Mesh(creationGeometry, creationMaterial);
        creation.position.set(x, y, z);
        
        // Add metadata for animation
        creation.userData = {
            angleOffset: angle,
            level: 1,
            pulsePhase: Math.random() * Math.PI * 2,
            rotationSpeed: {
                x: 0.2 + Math.random() * 0.3,
                y: 0.2 + Math.random() * 0.3,
                z: 0.2 + Math.random() * 0.3
            }
        };
        
        firstCreations.push(creation);
        creationsGroup.add(creation);
    }
    
    // Connect teacher to first creations with energy beams
    const beamsGroup = new THREE.Group();
    rootGroup.add(beamsGroup);
    
    firstCreations.forEach(creation => {
        const start = teacher.position.clone();
        const end = creation.position.clone();
        
        const beamGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const beamMaterial = new THREE.LineBasicMaterial({
            color: 0x6d4ab1,
            transparent: true,
            opacity: 0.7
        });
        
        const beam = new THREE.Line(beamGeometry, beamMaterial);
        beam.userData = {
            startObject: teacher,
            endObject: creation,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        beamsGroup.add(beam);
    });
    
    // Create second generation of creations
    const secondCreationsCount = 10;
    const secondCreations = [];
    
    for (let i = 0; i < secondCreationsCount; i++) {
        // Each second creation is linked to one of the first creations
        const parentIndex = Math.floor(i / (secondCreationsCount / firstCreationsCount));
        const parentCreation = firstCreations[parentIndex];
        
        // Position around its parent
        const angleOffset = (i % (secondCreationsCount / firstCreationsCount)) / 
                           (secondCreationsCount / firstCreationsCount) * Math.PI * 2;
        const angle = parentCreation.userData.angleOffset + angleOffset;
        const radius = 1.5;
        
        const parentPos = parentCreation.position;
        const x = parentPos.x + Math.cos(angle) * radius;
        const y = parentPos.y;
        const z = parentPos.z + Math.sin(angle) * radius;
        
        const creationGeometry = new THREE.OctahedronGeometry(0.3, 0);
        const creationMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffaf7b,
            emissive: 0xffaf7b,
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.4,
            transmission: 0.3,
            clearcoat: 0.5,
            clearcoatRoughness: 0.3,
            transparent: true,
            opacity: 0.8
        });
        
        const creation = new THREE.Mesh(creationGeometry, creationMaterial);
        creation.position.set(x, y, z);
        
        // Add metadata for animation
        creation.userData = {
            angleOffset: angle,
            level: 2,
            parentCreation: parentCreation,
            pulsePhase: Math.random() * Math.PI * 2,
            rotationSpeed: {
                x: 0.3 + Math.random() * 0.5,
                y: 0.3 + Math.random() * 0.5,
                z: 0.3 + Math.random() * 0.5
            }
        };
        
        secondCreations.push(creation);
        creationsGroup.add(creation);
        
        // Connect first creation to second creation with energy beam
        const start = parentCreation.position.clone();
        const end = creation.position.clone();
        
        const beamGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const beamMaterial = new THREE.LineBasicMaterial({
            color: 0xd76d77,
            transparent: true,
            opacity: 0.5
        });
        
        const beam = new THREE.Line(beamGeometry, beamMaterial);
        beam.userData = {
            startObject: parentCreation,
            endObject: creation,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        beamsGroup.add(beam);
    } // Correctly close the for loop from line 185
    
    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the entire scene slightly
        rootGroup.rotation.y = elapsedTime * 0.1;
        
        // Animate teacher
        const teacherPulse = 1 + 0.1 * Math.sin(elapsedTime * 0.7);
        teacher.scale.set(teacherPulse, teacherPulse, teacherPulse);
        
        // Animate aura with different pulse
        aura.scale.set(
            1 + 0.1 * Math.sin(elapsedTime * 0.5),
            1 + 0.1 * Math.sin(elapsedTime * 0.5),
            1 + 0.1 * Math.sin(elapsedTime * 0.5)
        );
        
        // Animate magic particles
        const magicPositions = magicParticlesGeometry.attributes.position.array;
        
        for (let i = 0; i < magicParticlesCount; i++) {
            // Update particle position
            magicPositions[i * 3] += magicVelocities[i].x;
            magicPositions[i * 3 + 1] += magicVelocities[i].y;
            magicPositions[i * 3 + 2] += magicVelocities[i].z;
            
            // Update life
            magicVelocities[i].life -= delta / magicVelocities[i].maxLife;
            
            // Reset particle if it's dead or too far
            const x = magicPositions[i * 3];
            const y = magicPositions[i * 3 + 1];
            const z = magicPositions[i * 3 + 2];
            const distanceSq = x*x + y*y + z*z;
            
            if (magicVelocities[i].life <= 0 || distanceSq > 100) {
                // Reset to teacher position
                magicPositions[i * 3] = teacher.position.x;
                magicPositions[i * 3 + 1] = teacher.position.y;
                magicPositions[i * 3 + 2] = teacher.position.z;
                
                // New random velocity
                const angle = Math.random() * Math.PI * 2;
                const z = Math.random() * 2 - 1;
                const radius = Math.sqrt(1 - z * z);
                
                magicVelocities[i] = {
                    x: radius * Math.cos(angle) * 0.03,
                    y: radius * Math.sin(angle) * 0.03,
                    z: z * 0.03,
                    life: 1.0,
                    maxLife: 2 + Math.random() * 3
                };
            }
        }
        
        magicParticlesGeometry.attributes.position.needsUpdate = true;
        
        // Animate first level creations
        firstCreations.forEach(creation => {
            // Rotate each creation
            creation.rotation.x += delta * creation.userData.rotationSpeed.x;
            creation.rotation.y += delta * creation.userData.rotationSpeed.y;
            creation.rotation.z += delta * creation.userData.rotationSpeed.z;
            
            // Pulse size
            const pulse = 1 + 0.1 * Math.sin(elapsedTime * 0.8 + creation.userData.pulsePhase);
            creation.scale.set(pulse, pulse, pulse);
            
            // Orbital motion
            const orbitSpeed = 0.1;
            const newAngle = creation.userData.angleOffset + elapsedTime * orbitSpeed;
            const radius = 3;
            
            creation.position.x = Math.cos(newAngle) * radius;
            creation.position.z = Math.sin(newAngle) * radius;
        });
        
        // Animate second level creations
        secondCreations.forEach(creation => {
            // Rotate each creation
            creation.rotation.x += delta * creation.userData.rotationSpeed.x;
            creation.rotation.y += delta * creation.userData.rotationSpeed.y;
            creation.rotation.z += delta * creation.userData.rotationSpeed.z;
            
            // Pulse size
            const pulse = 1 + 0.15 * Math.sin(elapsedTime * 1.2 + creation.userData.pulsePhase);
            creation.scale.set(pulse, pulse, pulse);
            
            // Follow parent's position with offset
            const parent = creation.userData.parentCreation;
            const angleOffset = creation.userData.angleOffset - parent.userData.angleOffset;
            const newAngle = parent.userData.angleOffset + elapsedTime * 0.1 + angleOffset;
            const radius = 1.5;
            
            creation.position.x = parent.position.x + Math.cos(newAngle) * radius;
            creation.position.z = parent.position.z + Math.sin(newAngle) * radius;
        });
        
        // Update beams to connect moving objects
        beamsGroup.children.forEach(beam => {
            const start = beam.userData.startObject.position;
            const end = beam.userData.endObject.position;
            
            const positions = beam.geometry.attributes.position.array;
            positions[0] = start.x;
            positions[1] = start.y;
            positions[2] = start.z;
            positions[3] = end.x;
            positions[4] = end.y;
            positions[5] = end.z;
            
            beam.geometry.attributes.position.needsUpdate = true;
            
            // Pulse beam opacity
            beam.material.opacity = 0.4 + 0.3 * Math.sin(elapsedTime * 2 + beam.userData.pulsePhase);
        });
        
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

