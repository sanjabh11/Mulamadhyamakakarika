import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse9Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create nodes and links for the perception web
    const nodes = [];
    const links = [];
    
    // Node types
    const nodeTypes = [
        { name: 'Eye', color: 0xff0000 },
        { name: 'Ear', color: 0x00ff00 },
        { name: 'Nose', color: 0x0000ff },
        { name: 'Tongue', color: 0xffff00 },
        { name: 'Body', color: 0xff00ff },
        { name: 'Mind', color: 0xffffff },
        { name: 'Sight', color: 0xff5555 },
        { name: 'Sound', color: 0x55ff55 },
        { name: 'Smell', color: 0x5555ff },
        { name: 'Taste', color: 0xffff55 },
        { name: 'Touch', color: 0xff55ff },
        { name: 'Thought', color: 0xaaaaaa },
        { name: 'Consciousness', color: settings.highlightColor }
    ];
    
    // Create nodes in a spherical arrangement
    const radius = 5;
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);
    
    nodeTypes.forEach((type, index) => {
        // Arrange nodes in a Fibonacci sphere
        const phi = Math.acos(-1 + (2 * index) / nodeTypes.length);
        const theta = Math.sqrt(nodeTypes.length * Math.PI) * phi;
        
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        // Create node
        const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(x, y, z);
        node.userData = {
            type: type.name,
            color: type.color,
            originalPosition: new THREE.Vector3(x, y, z),
            selected: false
        };
        
        nodeGroup.add(node);
        nodes.push(node);
        
        // Create label for the node
        createLabel(type.name, node.position);
    });
    
    // Create connections between nodes
    const linkGroup = new THREE.Group();
    scene.add(linkGroup);
    
    // Connect each sense with its object and consciousness
    const consciousnessNode = nodes.find(node => node.userData.type === 'Consciousness');
    
    const pairs = [
        { sense: 'Eye', object: 'Sight' },
        { sense: 'Ear', object: 'Sound' },
        { sense: 'Nose', object: 'Smell' },
        { sense: 'Tongue', object: 'Taste' },
        { sense: 'Body', object: 'Touch' },
        { sense: 'Mind', object: 'Thought' }
    ];
    
    pairs.forEach(pair => {
        const senseNode = nodes.find(node => node.userData.type === pair.sense);
        const objectNode = nodes.find(node => node.userData.type === pair.object);
        
        if (senseNode && objectNode && consciousnessNode) {
            // Connect sense to object
            createLink(senseNode, objectNode);
            
            // Connect sense to consciousness
            createLink(senseNode, consciousnessNode);
            
            // Connect object to consciousness
            createLink(objectNode, consciousnessNode);
        }
    });
    
    // Connect senses to each other
    for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 6; j++) {
            const senseNode1 = nodes.find(node => node.userData.type === pairs[i].sense);
            const senseNode2 = nodes.find(node => node.userData.type === pairs[j].sense);
            
            if (senseNode1 && senseNode2) {
                createLink(senseNode1, senseNode2);
            }
        }
    }
    
    // Connect objects to each other
    for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 6; j++) {
            const objectNode1 = nodes.find(node => node.userData.type === pairs[i].object);
            const objectNode2 = nodes.find(node => node.userData.type === pairs[j].object);
            
            if (objectNode1 && objectNode2) {
                createLink(objectNode1, objectNode2);
            }
        }
    }
    
    function createLink(node1, node2) {
        const points = [
            node1.position,
            node2.position
        ];
        
        const linkGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const linkMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        const link = new THREE.Line(linkGeometry, linkMaterial);
        link.userData = {
            node1: node1,
            node2: node2
        };
        
        linkGroup.add(link);
        links.push(link);
    }
    
    function createLabel(text, position) {
        // Create canvas for the label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        
        // Draw text on canvas
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        
        // Create sprite material
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8
        });
        
        // Create sprite
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.position.multiplyScalar(1.2); // Position slightly outside the node
        sprite.scale.set(2, 1, 1);
        
        scene.add(sprite);
    }
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    let selectedNode = null;
    let isDragging = false;
    
    // Event listeners
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    
    function onMouseDown(event) {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        checkNodeSelection();
    }
    
    function onMouseMove(event) {
        if (selectedNode) {
            isDragging = true;
            
            // Update mouse position
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Update raycaster
            raycaster.setFromCamera(mouse, camera);
            
            // Calculate drag target in 3D space
            const targetZ = selectedNode.position.z;
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = (targetZ - camera.position.z) / dir.z;
            const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));
            
            // Move the selected node
            selectedNode.position.x = targetPos.x;
            selectedNode.position.y = targetPos.y;
            
            // Update associated links
            updateLinks();
        }
    }
    
    function onMouseUp() {
        if (selectedNode && !isDragging) {
            // This was a click, trigger ripple effect
            createRippleEffect(selectedNode);
        }
        
        selectedNode = null;
        isDragging = false;
    }
    
    function onTouchStart(event) {
        if (event.touches.length > 0) {
            // Calculate touch position in normalized device coordinates
            mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            
            checkNodeSelection();
            event.preventDefault();
        }
    }
    
    function onTouchMove(event) {
        if (selectedNode && event.touches.length > 0) {
            isDragging = true;
            
            // Update touch position
            mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            
            // Update raycaster
            raycaster.setFromCamera(mouse, camera);
            
            // Calculate drag target in 3D space
            const targetZ = selectedNode.position.z;
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = (targetZ - camera.position.z) / dir.z;
            const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));
            
            // Move the selected node
            selectedNode.position.x = targetPos.x;
            selectedNode.position.y = targetPos.y;
            
            // Update associated links
            updateLinks();
            
            event.preventDefault();
        }
    }
    
    function onTouchEnd(event) {
        if (selectedNode && !isDragging) {
            // This was a tap, trigger ripple effect
            createRippleEffect(selectedNode);
        }
        
        selectedNode = null;
        isDragging = false;
    }
    
    function checkNodeSelection() {
        // Update raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections with nodes
        const intersects = raycaster.intersectObjects(nodes);
        
        if (intersects.length > 0) {
            selectedNode = intersects[0].object;
            selectedNode.userData.selected = true;
            selectedNode.material.emissiveIntensity = 0.8;
        }
    }
    
    function updateLinks() {
        // Update all links connected to the selected node
        links.forEach(link => {
            const { node1, node2 } = link.userData;
            
            if (node1 === selectedNode || node2 === selectedNode) {
                // Update link geometry
                const points = [node1.position, node2.position];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                link.geometry.dispose();
                link.geometry = geometry;
                
                // Highlight this link
                link.material.color.set(0xffffff);
                link.material.opacity = 0.8;
            }
        });
    }
    
    // Create ripple effect when a node is clicked
    function createRippleEffect(node) {
        // Highlight the node
        node.material.emissiveIntensity = 1;
        
        // Create ripple wave
        const rippleWaves = [];
        const waveCount = 3;
        
        for (let i = 0; i < waveCount; i++) {
            const waveGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
            const waveMaterial = new THREE.MeshBasicMaterial({
                color: node.userData.color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.position.copy(node.position);
            wave.lookAt(camera.position);
            wave.userData = {
                age: i * 0.3, // Stagger the waves
                node: node,
                originalScale: 0.1
            };
            
            scene.add(wave);
            rippleWaves.push(wave);
        }
        
        // Find connected nodes through links
        const connectedNodes = [];
        
        links.forEach(link => {
            if (link.userData.node1 === node) {
                connectedNodes.push(link.userData.node2);
            } else if (link.userData.node2 === node) {
                connectedNodes.push(link.userData.node1);
            }
        });
        
        // Highlight connected nodes
        connectedNodes.forEach(connectedNode => {
            connectedNode.material.emissiveIntensity = 0.8;
            
            // Create a pulse animation for connected nodes
            const originalScale = connectedNode.scale.x;
            
            const pulseAnimation = () => {
                connectedNode.scale.set(originalScale * 1.3, originalScale * 1.3, originalScale * 1.3);
                
                setTimeout(() => {
                    connectedNode.scale.set(originalScale, originalScale, originalScale);
                }, 300);
            };
            
            pulseAnimation();
        });
        
        // Animation for ripple waves
        const animateRipples = () => {
            rippleWaves.forEach((wave, index) => {
                wave.userData.age += 0.05;
                
                const age = wave.userData.age;
                if (age > 0 && age < 2) {
                    // Scale up the wave
                    const scale = wave.userData.originalScale + age * 5;
                    wave.scale.set(scale, scale, 1);
                    
                    // Fade out the wave
                    wave.material.opacity = Math.max(0, 0.7 - (age / 2) * 0.7);
                } else if (age >= 2) {
                    // Remove the wave
                    scene.remove(wave);
                    rippleWaves.splice(index, 1);
                }
            });
            
            if (rippleWaves.length > 0) {
                requestAnimationFrame(animateRipples);
            } else {
                // Reset node highlights
                nodes.forEach(n => {
                    n.material.emissiveIntensity = 0.3;
                    n.userData.selected = false;
                });
                
                // Reset link appearance
                links.forEach(link => {
                    link.material.color.set(0xffffff);
                    link.material.opacity = 0.3;
                });
            }
        };
        
        animateRipples();
    }
    
    // Add instruction text
    const instruction = document.createElement('div');
    instruction.textContent = 'Click and drag any node to see the interconnected web of perception';
    instruction.style.position = 'absolute';
    instruction.style.bottom = '20px';
    instruction.style.left = '50%';
    instruction.style.transform = 'translateX(-50%)';
    instruction.style.color = 'white';
    instruction.style.fontSize = '16px';
    instruction.style.fontFamily = 'Montserrat, sans-serif';
    instruction.style.padding = '10px 20px';
    instruction.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instruction.style.borderRadius = '5px';
    instruction.style.textAlign = 'center';
    instruction.style.zIndex = '100';
    document.body.appendChild(instruction);
    
    // Animation variables
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        // Rotate the entire node network slowly
        nodeGroup.rotation.y = time * 0.1;
        linkGroup.rotation.y = time * 0.1;
        
        // Make nodes pulse gently
        nodes.forEach(node => {
            if (!node.userData.selected) {
                const pulse = 1 + Math.sin(time * 2 + nodes.indexOf(node)) * 0.05;
                node.scale.set(pulse, pulse, pulse);
            }
        });
        
        controls.update();
    }
    
    // Clean up function
    function cleanup() {
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        document.body.removeChild(instruction);
    }
    
    return {
        scene,
        camera,
        renderer,
        controls,
        animate,
        cleanup
    };
}

