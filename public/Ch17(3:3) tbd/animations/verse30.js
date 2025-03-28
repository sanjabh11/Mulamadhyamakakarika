import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse30Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080818);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    
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
    
    // Create the main container for all elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    
    // Create quantum vacuum visualization
    
    // 1. Void space (represents emptiness/vacuum)
    const voidGroup = new THREE.Group();
    mainGroup.add(voidGroup);
    
    // Background energy field (quantum vacuum fluctuations)
    const fieldParticlesCount = 2000;
    const fieldGeometry = new THREE.BufferGeometry();
    const fieldMaterial = new THREE.PointsMaterial({
        color: 0x6d4ab1,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const fieldPositions = new Float32Array(fieldParticlesCount * 3);
    const fieldScales = new Float32Array(fieldParticlesCount);
    const fieldLifetimes = [];
    
    for (let i = 0; i < fieldParticlesCount; i++) {
        // Random position in a large sphere
        const radius = 3 + Math.random() * 12;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        fieldPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        fieldPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        fieldPositions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Random initial scale
        fieldScales[i] = Math.random() * 0.5;
        
        // Lifetime data for animation
        fieldLifetimes.push({
            oscillationSpeed: 0.5 + Math.random() * 2,
            oscillationPhase: Math.random() * Math.PI * 2
        });
    }
    
    fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
    fieldGeometry.setAttribute('scale', new THREE.BufferAttribute(fieldScales, 1));
    
    const field = new THREE.Points(fieldGeometry, fieldMaterial);
    voidGroup.add(field);
    
    // 2. Chain of non-existence (action → agent → fruit → consumer)
    const chainGroup = new THREE.Group();
    mainGroup.add(chainGroup);
    
    // Define four positions in a sequence
    const chainPositions = [
        new THREE.Vector3(-4.5, 0, 0),  // Action
        new THREE.Vector3(-1.5, 0, 0),  // Agent
        new THREE.Vector3(1.5, 0, 0),   // Fruit
        new THREE.Vector3(4.5, 0, 0)    // Consumer
    ];
    
    // Labels for the positions
    const labels = ["Action", "Agent", "Fruit", "Consumer"];
    
    // Create fading/flickering entities at each position
    const entities = [];
    
    for (let i = 0; i < chainPositions.length; i++) {
        // Create a fluctuating sphere at each position
        const entityGeometry = new THREE.SphereGeometry(0.7, 24, 24);
        const entityMaterial = new THREE.MeshPhysicalMaterial({
            color: i === 0 ? 0x3a1c71 : (i === 1 ? 0x6d4ab1 : (i === 2 ? 0xd76d77 : 0xffaf7b)),
            emissive: i === 0 ? 0x3a1c71 : (i === 1 ? 0x6d4ab1 : (i === 2 ? 0xd76d77 : 0xffaf7b)),
            emissiveIntensity: 0.3,
            metalness: 0.7,
            roughness: 0.3,
            transparent: true,
            opacity: 0.5,
            transmission: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const entity = new THREE.Mesh(entityGeometry, entityMaterial);
        entity.position.copy(chainPositions[i]);
        
        // Add wireframe to emphasize emptiness
        const wireframeGeometry = new THREE.SphereGeometry(0.72, 16, 16);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        entity.add(wireframe);
        
        // Add metadata for animation
        entity.userData = {
            phase: Math.random() * Math.PI * 2,
            vanishProbability: 0.002, // Chance to temporarily vanish
            vanished: false,
            fadeState: "stable", // stable, fading, appearing
            originalOpacity: 0.5,
            index: i
        };
        
        entities.push(entity);
        chainGroup.add(entity);
        
        // Add connecting arrows between entities
        if (i < chainPositions.length - 1) {
            const arrowGeometry = new THREE.CylinderGeometry(0.05, 0.15, 2, 8);
            arrowGeometry.rotateZ(Math.PI / 2);
            const arrowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrow.position.set(
                (chainPositions[i].x + chainPositions[i+1].x) / 2,
                0,
                0
            );
            arrow.userData = {
                phase: Math.random() * Math.PI * 2,
                startIndex: i,
                endIndex: i + 1
            };
            
            chainGroup.add(arrow);
        }
    }
    
    // 3. "Non-existence" indicator (crossed-out icons)
    const nonExistenceGroup = new THREE.Group();
    mainGroup.add(nonExistenceGroup);
    
    // Create a "non-existence" symbol for each entity
    for (let i = 0; i < chainPositions.length; i++) {
        // Circle with a diagonal line through it
        const circleGeometry = new THREE.RingGeometry(0.3, 0.35, 24);
        const circleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        
        // Diagonal line
        const lineGeometry = new THREE.PlaneGeometry(0.6, 0.05);
        lineGeometry.rotateZ(Math.PI / 4);
        const lineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        
        // Add both to a symbol group
        const symbol = new THREE.Group();
        symbol.add(circle);
        symbol.add(line);
        symbol.position.set(chainPositions[i].x, -1.5, 0);
        symbol.userData = {
            phase: Math.random() * Math.PI * 2,
            relatedEntityIndex: i
        };
        
        nonExistenceGroup.add(symbol);
    }
    
    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the whole scene slightly
        mainGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
        
        // Animate field particles (quantum vacuum fluctuations)
        const fieldPositions = fieldGeometry.attributes.position.array;
        const fieldScales = fieldGeometry.attributes.scale.array;
        
        for (let i = 0; i < fieldParticlesCount; i++) {
            // Oscillate sizes to create vacuum energy fluctuations
            const oscillation = Math.sin(elapsedTime * fieldLifetimes[i].oscillationSpeed + fieldLifetimes[i].oscillationPhase);
            fieldScales[i] = 0.2 + 0.3 * (0.5 + oscillation * 0.5);
            
            // Slightly move particles
            fieldPositions[i * 3] += Math.sin(elapsedTime + i) * 0.002;
            fieldPositions[i * 3 + 1] += Math.cos(elapsedTime + i) * 0.002;
            fieldPositions[i * 3 + 2] += Math.sin(elapsedTime * 0.5 + i) * 0.002;
            
            // Occasionally create "quantum tunneling" by moving particle to a different place
            if (Math.random() < 0.0005) {
                const radius = 3 + Math.random() * 12;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                fieldPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                fieldPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                fieldPositions[i * 3 + 2] = radius * Math.cos(phi);
            }
        }
        
        fieldGeometry.attributes.position.needsUpdate = true;
        fieldGeometry.attributes.scale.needsUpdate = true;
        
        // Animate entities in the chain
        entities.forEach((entity, index) => {
            const userData = entity.userData;
            
            // Check if entity should vanish or appear
            if (!userData.vanished && Math.random() < userData.vanishProbability) {
                userData.vanished = true;
                userData.fadeState = "fading";
            } else if (userData.vanished && userData.fadeState === "faded" && Math.random() < 0.05) {
                userData.fadeState = "appearing";
            }
            
            // Handle fading/appearing
            if (userData.fadeState === "fading") {
                entity.material.opacity -= 0.05;
                if (entity.material.opacity <= 0.01) {
                    entity.material.opacity = 0.01;
                    userData.fadeState = "faded";
                }
            } else if (userData.fadeState === "appearing") {
                entity.material.opacity += 0.05;
                if (entity.material.opacity >= userData.originalOpacity) {
                    entity.material.opacity = userData.originalOpacity;
                    userData.fadeState = "stable";
                    userData.vanished = false;
                }
            } else if (userData.fadeState === "stable") {
                // Subtle pulsing when stable
                entity.material.opacity = userData.originalOpacity + 0.1 * Math.sin(elapsedTime * 0.7 + userData.phase);
            }
            
            // Rotate wireframe independently
            if (entity.children.length > 0) {
                entity.children[0].rotation.x = elapsedTime * 0.2;
                entity.children[0].rotation.y = elapsedTime * 0.3;
            }
            
            // Scale fluctuation
            const scale = 1 + 0.1 * Math.sin(elapsedTime * 0.5 + userData.phase);
            entity.scale.set(scale, scale, scale);
        });
        
        // Animate connecting arrows
        chainGroup.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry) {
                // This is an arrow
                const startEntity = entities[child.userData.startIndex];
                const endEntity = entities[child.userData.endIndex];
                
                // Match arrow opacity to the entities it connects
                const arrowOpacity = Math.min(
                    startEntity.material.opacity,
                    endEntity.material.opacity
                ) * 0.6;
                
                child.material.opacity = arrowOpacity;
                
                // Pulse arrow size
                const scale = 1 + 0.1 * Math.sin(elapsedTime * 0.8 + child.userData.phase);
                child.scale.set(1, scale, scale);
            }
        });
        
        // Animate non-existence symbols
        nonExistenceGroup.children.forEach(symbol => {
            // Match opacity to related entity
            const relatedEntity = entities[symbol.userData.relatedEntityIndex];
            const symbolOpacity = 0.7 * (1 - relatedEntity.material.opacity / relatedEntity.userData.originalOpacity);
            
            symbol.children.forEach(part => {
                part.material.opacity = symbolOpacity;
            });
            
            // Pulse size inversely to entity (grow as entity fades)
            const scale = 1 + 0.2 * (1 - relatedEntity.material.opacity / relatedEntity.userData.originalOpacity);
            symbol.scale.set(scale, scale, scale);
            
            // Slight rotation
            symbol.rotation.z = Math.sin(elapsedTime * 0.3 + symbol.userData.phase) * 0.2;
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

