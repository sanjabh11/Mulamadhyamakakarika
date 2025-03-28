import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse28Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070720);
    
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
    
    // Create root node for all objects
    const rootNode = new THREE.Group();
    scene.add(rootNode);
    
    // Create agent and consumer (neither same nor different)
    const agentConsumerGroup = new THREE.Group();
    rootNode.add(agentConsumerGroup);
    
    // Agent sphere
    const agentGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const agentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3a1c71,
        emissive: 0x3a1c71,
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1
    });
    const agent = new THREE.Mesh(agentGeometry, agentMaterial);
    agent.position.set(-2.5, 0, 0);
    agentConsumerGroup.add(agent);
    
    // Consumer sphere
    const consumerGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const consumerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd76d77,
        emissive: 0xd76d77,
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1
    });
    const consumer = new THREE.Mesh(consumerGeometry, consumerMaterial);
    consumer.position.set(2.5, 0, 0);
    agentConsumerGroup.add(consumer);
    
    // Create quantum entanglement visual (representing non-locality)
    const entanglementGroup = new THREE.Group();
    rootNode.add(entanglementGroup);
    
    // Connecting beam between agent and consumer (represents entanglement)
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
    beamGeometry.rotateZ(Math.PI / 2);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    entanglementGroup.add(beam);
    
    // Energy particles flowing along the entanglement beam
    const particlesCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.06,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(particlesCount * 3);
    const particleVelocities = [];
    
    for (let i = 0; i < particlesCount; i++) {
        // Random position along the beam
        const position = Math.random() * 5 - 2.5;
        positions[i * 3] = position;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        
        // Direction and speed
        particleVelocities.push({
            direction: Math.random() > 0.5 ? 1 : -1,
            speed: 0.01 + Math.random() * 0.03
        });
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    entanglementGroup.add(particles);
    
    // Create ignorance cloud (representing obscuration by ignorance)
    const ignoranceGroup = new THREE.Group();
    rootNode.add(ignoranceGroup);
    
    // Cloud around consumer
    const cloudParticlesCount = 200;
    const cloudGeometry = new THREE.BufferGeometry();
    const cloudMaterial = new THREE.PointsMaterial({
        color: 0x6d4ab1,
        size: 0.08,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const cloudPositions = new Float32Array(cloudParticlesCount * 3);
    
    for (let i = 0; i < cloudParticlesCount; i++) {
        // Position in a sphere around the consumer
        const radius = 1.2 + Math.random() * 0.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        cloudPositions[i * 3] = 2.5 + radius * Math.sin(phi) * Math.cos(theta);
        cloudPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        cloudPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
    ignoranceGroup.add(cloud);
    
    // Create craving symbol (representing those with craving)
    const cravingGroup = new THREE.Group();
    rootNode.add(cravingGroup);
    
    // Spiral around consumer (represents craving)
    const spiralCurve = new THREE.Curve();
    spiralCurve.getPoint = function(t) {
        const a = 1.2;
        const b = 0.5;
        const c = 0.4;
        
        const angle = 10 * Math.PI * t;
        const radius = a + b * Math.cos(20 * Math.PI * t);
        
        const x = 2.5 + radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = c * t;
        
        return new THREE.Vector3(x, y, z);
    };
    
    const spiralGeometry = new THREE.TubeGeometry(spiralCurve, 100, 0.05, 8, false);
    const spiralMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaf7b,
        transparent: true,
        opacity: 0.7
    });
    const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial);
    cravingGroup.add(spiral);
    
    // Create identity symbols (representing neither same nor different)
    const identityGroup = new THREE.Group();
    rootNode.add(identityGroup);
    
    // Equal sign that transforms into "not equal" sign
    const equalGeometry = new THREE.BoxGeometry(1.5, 0.15, 0.15);
    const equalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const equalTop = new THREE.Mesh(equalGeometry, equalMaterial);
    equalTop.position.y = 0.3;
    identityGroup.add(equalTop);
    
    const equalBottom = new THREE.Mesh(equalGeometry, equalMaterial);
    equalBottom.position.y = -0.3;
    identityGroup.add(equalBottom);
    
    // Slash for "not equal" sign (starts invisible)
    const slashGeometry = new THREE.BoxGeometry(2, 0.15, 0.15);
    slashGeometry.rotateZ(Math.PI / 4);
    const slashMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
    });
    const slash = new THREE.Mesh(slashGeometry, slashMaterial);
    identityGroup.add(slash);
    
    // Position identity symbols between agent and consumer, slightly above
    identityGroup.position.set(0, 2, 0);
    
    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the entire scene slightly
        rootNode.rotation.y = Math.sin(elapsedTime * 0.2) * 0.2;
        
        // Pulse the agent and consumer
        const agentPulse = 1 + 0.1 * Math.sin(elapsedTime * 0.7);
        const consumerPulse = 1 + 0.1 * Math.sin(elapsedTime * 0.7 + Math.PI);
        
        agent.scale.set(agentPulse, agentPulse, agentPulse);
        consumer.scale.set(consumerPulse, consumerPulse, consumerPulse);
        
        // Pulse beam opacity
        beamMaterial.opacity = 0.3 + 0.2 * Math.sin(elapsedTime * 2);
        
        // Move particles along the beam
        const particlePositions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particlesCount; i++) {
            // Move particle
            particlePositions[i * 3] += particleVelocities[i].direction * particleVelocities[i].speed;
            
            // If particle reaches either end, send it back
            if (particlePositions[i * 3] > 2.5) {
                particleVelocities[i].direction = -1;
                // Transfer to consumer color briefly
                particlesMaterial.color.set(0xd76d77);
                setTimeout(() => {
                    particlesMaterial.color.set(0xffffff);
                }, 100);
            } else if (particlePositions[i * 3] < -2.5) {
                particleVelocities[i].direction = 1;
                // Transfer to agent color briefly
                particlesMaterial.color.set(0x3a1c71);
                setTimeout(() => {
                    particlesMaterial.color.set(0xffffff);
                }, 100);
            }
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
        
        // Animate cloud of ignorance
        cloud.rotation.y = elapsedTime * 0.2;
        cloud.rotation.z = elapsedTime * 0.1;
        
        // Pulse cloud opacity
        cloudMaterial.opacity = 0.3 + 0.2 * Math.sin(elapsedTime);
        
        // Rotate spiral of craving
        cravingGroup.rotation.y = elapsedTime * 0.5;
        cravingGroup.rotation.z = elapsedTime * 0.3;
        
        // Animate identity symbols (equal/not equal)
        const cycleTime = 5; // 5 seconds per cycle
        const cycleProgress = (elapsedTime % cycleTime) / cycleTime;
        
        if (cycleProgress < 0.5) {
            // First half of cycle: show equals sign
            slashMaterial.opacity = 0;
            equalTop.position.y = 0.3;
            equalBottom.position.y = -0.3;
        } else {
            // Second half: transform to not equals
            slashMaterial.opacity = 1;
            
            // Move equal signs to get them slightly out of the way of the slash
            const transitionProgress = (cycleProgress - 0.5) * 2; // 0 to 1
            
            equalTop.position.y = 0.3 + 0.1 * transitionProgress;
            equalBottom.position.y = -0.3 - 0.1 * transitionProgress;
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

