import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse29Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070714);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 7);
    
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
    
    // Create quantum indeterminacy visualization
    
    // 1. Conditions grid (representing deterministic conditions that don't give rise to action)
    const gridGroup = new THREE.Group();
    mainGroup.add(gridGroup);
    
    // Grid of lines
    const gridSize = 6;
    const gridDivisions = 10;
    const gridStep = gridSize / gridDivisions;
    
    const gridGeometry = new THREE.BufferGeometry();
    const gridVertices = [];
    
    // Create a grid of lines
    for (let i = 0; i <= gridDivisions; i++) {
        const pos = -gridSize / 2 + i * gridStep;
        
        // Horizontal lines
        gridVertices.push(-gridSize / 2, pos, 0);
        gridVertices.push(gridSize / 2, pos, 0);
        
        // Vertical lines
        gridVertices.push(pos, -gridSize / 2, 0);
        gridVertices.push(pos, gridSize / 2, 0);
    }
    
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
    
    const gridMaterial = new THREE.LineBasicMaterial({
        color: 0x3a1c71,
        transparent: true,
        opacity: 0.3
    });
    
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    grid.rotation.x = Math.PI / 2;
    grid.position.y = -2;
    gridGroup.add(grid);
    
    // 2. Indeterminate quantum events (representing actions that emerge without fixed causes)
    const eventsGroup = new THREE.Group();
    mainGroup.add(eventsGroup);
    
    // Create quantum events as particles that appear randomly
    const particlesCount = 300;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xd76d77,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);
    const lifetimes = [];
    
    for (let i = 0; i < particlesCount; i++) {
        // Random position in a volume above the grid
        positions[i * 3] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 1] = Math.random() * 4 - 2; // -2 to 2
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
        
        // Random scale (size)
        scales[i] = 0;
        
        // Lifetime data for animation
        lifetimes.push({
            active: false,
            birth: 0,
            duration: 0.5 + Math.random() * 1.5, // 0.5 to 2 seconds
            maxScale: 0.5 + Math.random() * 1.5
        });
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    eventsGroup.add(particles);
    
    // 3. Agent (that doesn't exist independently)
    const agentGroup = new THREE.Group();
    mainGroup.add(agentGroup);
    
    // Create agent as a transparent, fluctuating form
    const agentGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const agentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5,
        transmission: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const agent = new THREE.Mesh(agentGeometry, agentMaterial);
    agent.position.set(0, 1, 0);
    agentGroup.add(agent);
    
    // Wireframe overlay to emphasize emptiness
    const wireframeGeometry = new THREE.SphereGeometry(0.82, 16, 16);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x6d4ab1,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    wireframe.position.copy(agent.position);
    agentGroup.add(wireframe);
    
    // 4. Disrupted causal arrows (representing no emergence from conditions)
    const arrowsGroup = new THREE.Group();
    mainGroup.add(arrowsGroup);
    
    // Create arrows that try to connect grid to agent but fragment
    const arrowsCount = 15;
    
    for (let i = 0; i < arrowsCount; i++) {
        // Starting point on grid
        const startX = (Math.random() - 0.5) * 5;
        const startZ = (Math.random() - 0.5) * 5;
        const start = new THREE.Vector3(startX, -2, startZ);
        
        // Mid-points for fragmented line
        const segmentsCount = 4;
        const segments = [];
        
        // Create segments with gaps between them
        let currentPoint = start.clone();
        
        for (let j = 0; j < segmentsCount; j++) {
            const progress = (j + 1) / segmentsCount;
            const targetX = start.x * (1 - progress) + agent.position.x * progress;
            const targetY = start.y * (1 - progress) + agent.position.y * progress;
            const targetZ = start.z * (1 - progress) + agent.position.z * progress;
            
            // Add some randomness to the path
            const jitter = 0.2 * (1 - progress);
            const nextPoint = new THREE.Vector3(
                targetX + (Math.random() - 0.5) * jitter,
                targetY + (Math.random() - 0.5) * jitter,
                targetZ + (Math.random() - 0.5) * jitter
            );
            
            // Create segment
            const segmentGeometry = new THREE.BufferGeometry().setFromPoints([currentPoint, nextPoint]);
            const segmentMaterial = new THREE.LineBasicMaterial({
                color: 0xd76d77,
                transparent: true,
                opacity: 0.5
            });
            
            const segment = new THREE.Line(segmentGeometry, segmentMaterial);
            segment.userData = {
                startPoint: currentPoint.clone(),
                endPoint: nextPoint.clone(),
                phase: Math.random() * Math.PI * 2 // For animation
            };
            
            segments.push(segment);
            arrowsGroup.add(segment);
            
            // Update current point with gap for next segment
            currentPoint = nextPoint.clone();
        }
    }
    
    // 5. "No emergence" text symbols
    const symbolsGroup = new THREE.Group();
    mainGroup.add(symbolsGroup);
    
    // Create a "no emergence" symbol (a circle with a diagonal line through it)
    const circleGeometry = new THREE.RingGeometry(0.8, 0.9, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    
    // Diagonal line
    const lineGeometry = new THREE.PlaneGeometry(1.5, 0.1);
    lineGeometry.rotateZ(Math.PI / 4);
    const lineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    
    // Add both to a symbol group
    const symbol = new THREE.Group();
    symbol.add(circle);
    symbol.add(line);
    symbol.position.set(0, 3, 0);
    symbol.scale.set(0.7, 0.7, 0.7);
    symbolsGroup.add(symbol);
    
    // Animation
    const clock = new THREE.Clock();
    let lastEventTime = 0;
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate the whole scene slightly
        mainGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.2;
        
        // Animate the grid
        grid.rotation.z = elapsedTime * 0.05;
        grid.material.opacity = 0.3 + 0.1 * Math.sin(elapsedTime);
        
        // Animate quantum events (particles)
        const positions = particlesGeometry.attributes.position.array;
        const scales = particlesGeometry.attributes.scale.array;
        
        // Periodically spawn new events
        if (elapsedTime - lastEventTime > 0.1) { // Every 0.1 seconds
            lastEventTime = elapsedTime;
            
            // Activate a few random particles
            const activateCount = 5;
            for (let i = 0; i < activateCount; i++) {
                const particleIndex = Math.floor(Math.random() * particlesCount);
                if (!lifetimes[particleIndex].active) {
                    // Activate this particle
                    lifetimes[particleIndex].active = true;
                    lifetimes[particleIndex].birth = elapsedTime;
                    
                    // Move to a new random position
                    positions[particleIndex * 3] = (Math.random() - 0.5) * 6;
                    positions[particleIndex * 3 + 1] = Math.random() * 4 - 2;
                    positions[particleIndex * 3 + 2] = (Math.random() - 0.5) * 6;
                }
            }
        }
        
        // Update all particles
        for (let i = 0; i < particlesCount; i++) {
            if (lifetimes[i].active) {
                const age = elapsedTime - lifetimes[i].birth;
                const lifetime = lifetimes[i].duration;
                
                if (age < lifetime) {
                    // Particle is alive - calculate its size/opacity based on lifecycle
                    let progress;
                    if (age < lifetime * 0.3) {
                        // Growing phase
                        progress = age / (lifetime * 0.3);
                        scales[i] = lifetimes[i].maxScale * progress;
                    } else if (age < lifetime * 0.7) {
                        // Stable phase
                        scales[i] = lifetimes[i].maxScale;
                    } else {
                        // Shrinking phase
                        progress = (lifetime - age) / (lifetime * 0.3);
                        scales[i] = lifetimes[i].maxScale * progress;
                    }
                } else {
                    // Particle died
                    lifetimes[i].active = false;
                    scales[i] = 0;
                }
            }
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
        particlesGeometry.attributes.scale.needsUpdate = true;
        
        // Animate agent (fluctuating form)
        const agentPulse = 1 + 0.1 * Math.sin(elapsedTime * 0.7);
        agent.scale.set(agentPulse, agentPulse, agentPulse);
        
        // Fluctuate agent opacity to emphasize non-existence
        agentMaterial.opacity = 0.3 + 0.2 * Math.sin(elapsedTime * 0.5);
        
        // Animate wireframe rotation independently
        wireframe.rotation.y = elapsedTime * 0.2;
        wireframe.rotation.x = elapsedTime * 0.1;
        wireframe.scale.copy(agent.scale);
        
        // Animate fragmented arrows
        arrowsGroup.children.forEach((segment) => {
            // Oscillate opacity of each segment
            segment.material.opacity = 0.3 + 0.2 * Math.sin(elapsedTime * 2 + segment.userData.phase);
            
            // Sometimes make segments disappear completely
            if (Math.random() < 0.005) {
                segment.visible = !segment.visible;
            }
        });
        
        // Animate "no emergence" symbol
        symbol.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;
        symbol.position.y = 3 + 0.1 * Math.sin(elapsedTime);
        
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

