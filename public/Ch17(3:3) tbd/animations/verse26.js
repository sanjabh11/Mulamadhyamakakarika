import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse26Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090918);
    
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
    
    // Create illusion system (representing unreal afflictions and actions)
    const illusionSystem = new THREE.Group();
    scene.add(illusionSystem);
    
    // Create central illusion sphere (represents the unreal affliction)
    const centralGeometry = new THREE.DodecahedronGeometry(1.5, 0);
    const centralMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd76d77,
        metalness: 0.2,
        roughness: 0.5,
        transparent: true,
        opacity: 0.7,
        transmission: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const centralIllusion = new THREE.Mesh(centralGeometry, centralMaterial);
    illusionSystem.add(centralIllusion);
    
    // Create a wireframe overlay for the central illusion
    const wireframeGeometry = new THREE.DodecahedronGeometry(1.55, 0);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const wireframeOverlay = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    illusionSystem.add(wireframeOverlay);
    
    // Create action particles (representing actions)
    const actionParticles = new THREE.Group();
    illusionSystem.add(actionParticles);
    
    const actionCount = 50;
    const actionPositions = [];
    const actionSpheres = [];
    
    for (let i = 0; i < actionCount; i++) {
        // Create oscillating action spheres around the central illusion
        const radius = 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        const position = new THREE.Vector3(x, y, z);
        actionPositions.push(position);
        
        const size = 0.1 + Math.random() * 0.3;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0x3a1c71,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8,
            transmission: 0.5
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position);
        
        // Add metadata for animation
        sphere.userData = {
            originalPosition: position.clone(),
            oscillationSpeed: 0.5 + Math.random() * 2,
            oscillationAmplitude: 0.2 + Math.random() * 0.5,
            phaseOffset: Math.random() * Math.PI * 2,
            originalSize: size,
            fadeState: "visible" // Track whether we're fading in or out
        };
        
        actionSpheres.push(sphere);
        actionParticles.add(sphere);
    }
    
    // Create connecting beams from central illusion to actions
    const beamsGroup = new THREE.Group();
    illusionSystem.add(beamsGroup);
    
    actionSpheres.forEach((sphere, index) => {
        // Create a beam from central illusion to each action
        const start = new THREE.Vector3(0, 0, 0);
        const end = sphere.position.clone();
        const beamGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        
        const beamMaterial = new THREE.LineBasicMaterial({
            color: 0x6d4ab1,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const beam = new THREE.Line(beamGeometry, beamMaterial);
        beam.userData = {
            targetIndex: index,
            opacity: 0.3
        };
        
        beamsGroup.add(beam);
    });
    
    // Create illusion fog particles
    const fogParticlesCount = 200;
    const fogParticlesGeometry = new THREE.BufferGeometry();
    const fogParticlesMaterial = new THREE.PointsMaterial({
        color: 0xd76d77,
        size: 0.1,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const fogPositions = new Float32Array(fogParticlesCount * 3);
    
    for (let i = 0; i < fogParticlesCount; i++) {
        const radius = 1.5 + Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        fogPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        fogPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        fogPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    fogParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(fogPositions, 3));
    const fogParticles = new THREE.Points(fogParticlesGeometry, fogParticlesMaterial);
    illusionSystem.add(fogParticles);
    
    // Create questioning text object (showing "Is this real?")
    const textGroup = new THREE.Group();
    illusionSystem.add(textGroup);
    
    // Use a simple wireframe torus as a symbol for questioning
    const questionGeometry = new THREE.TorusGeometry(0.4, 0.1, 8, 20);
    const questionMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    });
    const questionSymbol = new THREE.Mesh(questionGeometry, questionMaterial);
    questionSymbol.position.set(0, 3, 0);
    textGroup.add(questionSymbol);
    
    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the illusion system
        illusionSystem.rotation.y = elapsedTime * 0.1;
        
        // Animate central illusion
        centralIllusion.rotation.x = elapsedTime * 0.2;
        centralIllusion.rotation.y = elapsedTime * 0.3;
        
        // Pulse the central illusion opacity
        centralMaterial.opacity = 0.5 + Math.sin(elapsedTime) * 0.2;
        
        // Rotate the wireframe overlay differently to create illusion effect
        wireframeOverlay.rotation.x = -elapsedTime * 0.15;
        wireframeOverlay.rotation.y = -elapsedTime * 0.25;
        
        // Animate action particles
        actionSpheres.forEach((sphere, index) => {
            const userData = sphere.userData;
            
            // Oscillate each action sphere
            const oscillation = userData.oscillationAmplitude * 
                Math.sin(elapsedTime * userData.oscillationSpeed + userData.phaseOffset);
            
            sphere.position.x = userData.originalPosition.x + oscillation;
            sphere.position.y = userData.originalPosition.y + oscillation;
            sphere.position.z = userData.originalPosition.z + oscillation;
            
            // Randomly fade actions in and out to show their unreality
            if (Math.random() < 0.005) {
                userData.fadeState = userData.fadeState === "visible" ? "fading" : "appearing";
            }
            
            if (userData.fadeState === "fading") {
                sphere.material.opacity -= 0.01;
                if (sphere.material.opacity <= 0.1) {
                    userData.fadeState = "appearing";
                }
            } else if (userData.fadeState === "appearing") {
                sphere.material.opacity += 0.01;
                if (sphere.material.opacity >= 0.8) {
                    userData.fadeState = "visible";
                }
            }
            
            // Pulse size
            const sizePulse = 1 + 0.2 * Math.sin(elapsedTime * 2 + index);
            sphere.scale.set(sizePulse, sizePulse, sizePulse);
        });
        
        // Update beams connecting central illusion to actions
        beamsGroup.children.forEach((beam, index) => {
            const targetSphere = actionSpheres[beam.userData.targetIndex];
            
            // Update beam end point
            const positions = beam.geometry.attributes.position.array;
            positions[3] = targetSphere.position.x;
            positions[4] = targetSphere.position.y;
            positions[5] = targetSphere.position.z;
            beam.geometry.attributes.position.needsUpdate = true;
            
            // Sync beam opacity with target sphere
            beam.material.opacity = targetSphere.material.opacity * 0.5;
        });
        
        // Animate fog particles
        fogParticles.rotation.y = elapsedTime * 0.05;
        fogParticles.rotation.x = elapsedTime * 0.03;
        
        // Animate the question symbol
        questionSymbol.rotation.z = elapsedTime * 0.5;
        questionSymbol.position.y = 3 + 0.2 * Math.sin(elapsedTime);
        
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

