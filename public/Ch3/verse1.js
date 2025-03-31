import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse1Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = settings.cameraDistance;
    
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
    
    // Central mind node
    const mindGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const mindMaterial = new THREE.MeshPhongMaterial({
        color: settings.glowColor,
        emissive: settings.glowColor,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    const mindNode = new THREE.Mesh(mindGeometry, mindMaterial);
    scene.add(mindNode);
    
    // Sense faculties and their objects
    const senses = [
        { name: 'eye', position: new THREE.Vector3(4, 2, 0), object: { name: 'visible', position: new THREE.Vector3(6, 3, 0) } },
        { name: 'ear', position: new THREE.Vector3(4, -2, 0), object: { name: 'sound', position: new THREE.Vector3(6, -3, 0) } },
        { name: 'nose', position: new THREE.Vector3(-4, 2, 0), object: { name: 'smell', position: new THREE.Vector3(-6, 3, 0) } },
        { name: 'tongue', position: new THREE.Vector3(-4, -2, 0), object: { name: 'taste', position: new THREE.Vector3(-6, -3, 0) } },
        { name: 'body', position: new THREE.Vector3(0, 4, 0), object: { name: 'touch', position: new THREE.Vector3(0, 6, 0) } },
        { name: 'mind', position: new THREE.Vector3(0, -4, 0), object: { name: 'thought', position: new THREE.Vector3(0, -6, 0) } }
    ];
    
    // Create sense spheres and objects
    const senseMeshes = [];
    const objectMeshes = [];
    const lineMeshes = [];
    
    senses.forEach((sense, index) => {
        // Create sense faculty
        const senseGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const senseMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(index / 6, 0.8, 0.5),
            transparent: true,
            opacity: 0.7,
            emissive: new THREE.Color().setHSL(index / 6, 0.8, 0.5),
            emissiveIntensity: 0.3
        });
        
        const senseMesh = new THREE.Mesh(senseGeometry, senseMaterial);
        senseMesh.position.copy(sense.position);
        senseMesh.userData = { type: 'sense', name: sense.name, index };
        scene.add(senseMesh);
        senseMeshes.push(senseMesh);
        
        // Create sense object
        const objectGeometry = new THREE.TetrahedronGeometry(0.7, 2);
        const objectMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(index / 6, 0.5, 0.7),
            transparent: true,
            opacity: 0.7,
            emissive: new THREE.Color().setHSL(index / 6, 0.5, 0.7),
            emissiveIntensity: 0.3
        });
        
        const objectMesh = new THREE.Mesh(objectGeometry, objectMaterial);
        objectMesh.position.copy(sense.object.position);
        objectMesh.userData = { type: 'object', name: sense.object.name, index };
        scene.add(objectMesh);
        objectMeshes.push(objectMesh);
        
        // Create tether between sense and object
        const points = [sense.position, sense.object.position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(index / 6, 0.9, 0.7),
            transparent: true,
            opacity: 0.5,
            linewidth: 2
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = { type: 'tether', index };
        scene.add(line);
        lineMeshes.push(line);
    });
    
    // Connections from mind to all senses
    senses.forEach((sense, index) => {
        const points = [new THREE.Vector3(0, 0, 0), sense.position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: settings.glowColor,
            transparent: true,
            opacity: 0.3,
            linewidth: 1
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    });
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Interactive elements
    let selectedPair = null;
    let isAnimating = false;
    
    // Animation variables
    const pulseAmplitude = 0.2;
    const pulseFrequency = 0.1;
    let time = 0;
    
    // Event listeners
    window.addEventListener('click', onClick, false);
    
    function onClick(event) {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections with all meshes
        const intersects = raycaster.intersectObjects([...senseMeshes, ...objectMeshes, ...lineMeshes]);
        
        if (intersects.length > 0 && !isAnimating) {
            const object = intersects[0].object;
            
            if (object.userData.type === 'tether') {
                // Start animation for the tether and its corresponding sense and object
                selectedPair = object.userData.index;
                isAnimating = true;
                setTimeout(() => {
                    isAnimating = false;
                    selectedPair = null;
                }, 2000);
            } else if (object.userData.type === 'sense' || object.userData.type === 'object') {
                // Highlight the sense and its object
                selectedPair = object.userData.index;
                isAnimating = true;
                setTimeout(() => {
                    isAnimating = false;
                    selectedPair = null;
                }, 2000);
            }
        }
    }
    
    // Animation function
    function animate() {
        time += 0.01;
        
        // Animate mind node
        mindNode.rotation.x += 0.005;
        mindNode.rotation.y += 0.007;
        
        // Pulse mind node
        const scale = 1 + Math.sin(time * 0.5) * 0.05;
        mindNode.scale.set(scale, scale, scale);
        
        // Rotate sense objects
        objectMeshes.forEach(mesh => {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
        });
        
        // Animate the selected pair if any
        if (selectedPair !== null) {
            const senseMesh = senseMeshes[selectedPair];
            const objectMesh = objectMeshes[selectedPair];
            const pulseFactor = Math.sin(time * 5) * pulseAmplitude + 1;
            
            senseMesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
            objectMesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
            
            // Update line color
            lineMeshes[selectedPair].material.color.setHex(settings.highlightColor);
            lineMeshes[selectedPair].material.opacity = 0.8 + Math.sin(time * 10) * 0.2;
        } else {
            // Reset scales and colors
            senseMeshes.forEach((mesh, index) => {
                mesh.scale.set(1, 1, 1);
                lineMeshes[index].material.color.setHSL(index / 6, 0.9, 0.7);
                lineMeshes[index].material.opacity = 0.5;
            });
            
            objectMeshes.forEach(mesh => {
                mesh.scale.set(1, 1, 1);
            });
        }
        
        controls.update();
    }
    
    return { scene, camera, renderer, controls, animate };
}

