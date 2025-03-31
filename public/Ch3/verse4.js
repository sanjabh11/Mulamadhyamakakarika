import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse4Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create object (cube)
    const objectGeometry = new THREE.BoxGeometry(2, 4, 2);
    const objectMaterial = new THREE.MeshStandardMaterial({
        color: settings.accentColor,
        roughness: 0.7,
        metalness: 0.3
    });
    const object = new THREE.Mesh(objectGeometry, objectMaterial);
    object.position.set(0, 0, 0);
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    
    // Create light source (spotlight)
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 8, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.distance = 20;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
    
    // Add visible lightbulb
    const bulbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const bulbMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        emissive: 0xffffee,
        emissiveIntensity: 1
    });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.copy(spotLight.position);
    scene.add(bulb);
    
    // Create shadow
    const shadowGroup = new THREE.Group();
    scene.add(shadowGroup);
    
    const shadowGeometry = new THREE.PlaneGeometry(4, 8);
    const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(-3, 0, 0);
    shadow.rotation.y = Math.PI / 2;
    shadowGroup.add(shadow);
    
    // Controls for toggling elements
    let lightActive = true;
    let objectActive = true;
    let shadowActive = true;
    
    // Create UI controls
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '10px';
    uiContainer.style.left = '10px';
    uiContainer.style.padding = '10px';
    uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    uiContainer.style.borderRadius = '5px';
    uiContainer.style.zIndex = '100';
    document.body.appendChild(uiContainer);
    
    // Light toggle
    const lightToggle = createToggleButton('Toggle Light');
    lightToggle.addEventListener('click', () => {
        lightActive = !lightActive;
        spotLight.visible = lightActive;
        bulb.visible = lightActive;
        updateShadow();
    });
    uiContainer.appendChild(lightToggle);
    
    // Object toggle
    const objectToggle = createToggleButton('Toggle Object');
    objectToggle.addEventListener('click', () => {
        objectActive = !objectActive;
        object.visible = objectActive;
        updateShadow();
    });
    uiContainer.appendChild(objectToggle);
    
    function createToggleButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.display = 'block';
        button.style.margin = '5px 0';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#3a1c71';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        return button;
    }
    
    // Update shadow visibility based on light and object state
    function updateShadow() {
        shadowActive = lightActive && objectActive;
        shadow.visible = shadowActive;
    }
    
    // Position shadow
    function updateShadowPosition() {
        if (!shadowActive) return;
        
        // Calculate shadow position based on light and object
        const lightPos = spotLight.position.clone();
        const objectPos = object.position.clone();
        
        // Direction from light to object
        const direction = new THREE.Vector3().subVectors(objectPos, lightPos).normalize();
        
        // Project shadow on the ground
        const distance = 10;
        const targetPos = new THREE.Vector3().addVectors(objectPos, direction.multiplyScalar(distance));
        
        // Position shadow on the floor
        shadow.position.x = targetPos.x;
        shadow.position.z = targetPos.z;
        shadow.position.y = -1.99; // Just above the floor
        
        // Orient shadow to face the light
        shadow.lookAt(new THREE.Vector3(lightPos.x, shadow.position.y, lightPos.z));
        
        // Scale shadow based on distance from object to light
        const objectLightDistance = objectPos.distanceTo(lightPos);
        const shadowScale = 1 + objectLightDistance * 0.1;
        shadow.scale.set(shadowScale, shadowScale, 1);
        
        // Adjust shadow opacity based on light intensity
        shadow.material.opacity = shadowActive ? 0.6 : 0;
    }
    
    // Animation variables
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        // Rotate object slightly
        if (objectActive) {
            object.rotation.y = time * 0.2;
        }
        
        // Animate light position
        if (lightActive) {
            spotLight.position.x = 5 * Math.cos(time * 0.5);
            spotLight.position.z = 5 * Math.sin(time * 0.5);
            bulb.position.copy(spotLight.position);
            
            // Make light look at object
            spotLight.lookAt(object.position);
        }
        
        // Update shadow
        updateShadowPosition();
        
        controls.update();
    }
    
    // Clean up function
    function cleanup() {
        document.body.removeChild(uiContainer);
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

