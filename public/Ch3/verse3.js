import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse3Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create lamp
    const lampGroup = new THREE.Group();
    scene.add(lampGroup);
    
    // Lamp base
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.8, 0.3, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333
    });
    const lampBase = new THREE.Mesh(baseGeometry, baseMaterial);
    lampBase.position.y = -1;
    lampGroup.add(lampBase);
    
    // Lamp pole
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const poleMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777
    });
    const lampPole = new THREE.Mesh(poleGeometry, poleMaterial);
    lampPole.position.y = 0;
    lampGroup.add(lampPole);
    
    // Lamp shade
    const shadeGeometry = new THREE.ConeGeometry(0.8, 1, 32, 1, true);
    const shadeMaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        side: THREE.DoubleSide
    });
    const lampShade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    lampShade.position.y = 1;
    lampShade.rotation.x = Math.PI;
    lampGroup.add(lampShade);
    
    // Lamp light bulb
    const bulbGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const bulbMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 1
    });
    const lightBulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    lightBulb.position.y = 0.8;
    lampGroup.add(lightBulb);
    
    // Light source
    const light = new THREE.PointLight(0xffffcc, 1, 10);
    light.position.copy(lightBulb.position);
    lampGroup.add(light);
    
    // Create objects in the scene
    const objects = [];
    
    // Book
    const bookGroup = new THREE.Group();
    bookGroup.position.set(3, -1, 2);
    bookGroup.rotation.y = -Math.PI / 4;
    scene.add(bookGroup);
    objects.push(bookGroup);
    
    const bookGeometry = new THREE.BoxGeometry(1.5, 0.2, 1);
    const bookMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b4513
    });
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    bookGroup.add(book);
    
    // Vase
    const vaseGroup = new THREE.Group();
    vaseGroup.position.set(-3, -1, 2);
    scene.add(vaseGroup);
    objects.push(vaseGroup);
    
    const vaseBaseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16);
    const vaseMidGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.6, 16);
    const vaseTopGeometry = new THREE.CylinderGeometry(0.4, 0.2, 0.4, 16);
    
    const vaseMaterial = new THREE.MeshPhongMaterial({
        color: settings.accentColor
    });
    
    const vaseBase = new THREE.Mesh(vaseBaseGeometry, vaseMaterial);
    vaseBase.position.y = -0.6;
    vaseGroup.add(vaseBase);
    
    const vaseMid = new THREE.Mesh(vaseMidGeometry, vaseMaterial);
    vaseMid.position.y = -0.2;
    vaseGroup.add(vaseMid);
    
    const vaseTop = new THREE.Mesh(vaseTopGeometry, vaseMaterial);
    vaseTop.position.y = 0.3;
    vaseGroup.add(vaseTop);
    
    // Create light beam
    const beamGroup = new THREE.Group();
    lampGroup.add(beamGroup);
    
    const beamGeometry = new THREE.CylinderGeometry(0.1, 1.5, 5, 32, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffcc,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    beam.position.z = 2.5;
    beam.position.y = lightBulb.position.y;
    beamGroup.add(beam);
    
    // Create wave patterns for when light tries to illuminate itself
    const waveContainer = new THREE.Group();
    waveContainer.visible = false;
    scene.add(waveContainer);
    
    const waveCount = 5;
    const waveMeshes = [];
    
    for (let i = 0; i < waveCount; i++) {
        const waveGeometry = new THREE.TorusGeometry(0.5 + i * 0.3, 0.02, 16, 100);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.7 - (i / waveCount) * 0.5
        });
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        waveContainer.add(wave);
        waveMeshes.push(wave);
    }
    
    // User interaction - control light beam direction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const targetPosition = new THREE.Vector3();
    
    // Update function
    function updateBeamDirection(x, y) {
        // Calculate direction in scene
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Get the direction in world space
        const direction = raycaster.ray.direction.clone();
        targetPosition.copy(direction).multiplyScalar(10).add(lampGroup.position);
        
        // Orient the beam group
        beamGroup.lookAt(targetPosition);
        
        // Check if beam is directed back at lamp
        const lampPosition = new THREE.Vector3().setFromMatrixPosition(lampGroup.matrixWorld);
        const lampToTarget = new THREE.Vector3().subVectors(targetPosition, lampPosition).normalize();
        const beamDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(beamGroup.quaternion);
        
        // Calculate angle between beam direction and lamp-to-target vector
        const dotProduct = beamDirection.dot(lampToTarget);
        
        // When beam tries to illuminate lamp itself
        if (dotProduct < -0.7) {
            beam.visible = false;
            waveContainer.visible = true;
            waveContainer.position.copy(lampPosition);
            
            // Set wave rotation to face camera
            waveContainer.lookAt(camera.position);
        } else {
            beam.visible = true;
            waveContainer.visible = false;
        }
    }
    
    // Event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    
    function onMouseMove(event) {
        updateBeamDirection(event.clientX, event.clientY);
    }
    
    function onTouchMove(event) {
        if (event.touches.length > 0) {
            updateBeamDirection(event.touches[0].clientX, event.touches[0].clientY);
            event.preventDefault();
        }
    }
    
    // Set initial beam direction
    updateBeamDirection(window.innerWidth / 2, window.innerHeight / 2);
    
    // Animation variables
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        // Animate light bulb intensity
        const pulseValue = 0.9 + Math.sin(time * 3) * 0.1;
        lightBulb.material.emissiveIntensity = pulseValue;
        light.intensity = pulseValue;
        
        // Animate beam opacity
        if (beam.visible) {
            beam.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
        }
        
        // Animate wave patterns
        if (waveContainer.visible) {
            waveMeshes.forEach((wave, index) => {
                wave.scale.set(
                    0.8 + Math.sin(time * 2 + index * 0.2) * 0.2,
                    0.8 + Math.sin(time * 2 + index * 0.2) * 0.2,
                    1
                );
                wave.rotation.z = time * (0.5 - index * 0.1);
            });
        }
        
        controls.update();
    }
    
    // Clean up function to be called when switching verses
    function cleanup() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
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

