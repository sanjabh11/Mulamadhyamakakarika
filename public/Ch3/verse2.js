import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse2Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create eye mesh
    const eyeGroup = new THREE.Group();
    scene.add(eyeGroup);
    
    // Eye ball
    const eyeGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({
        color: 0xf0f0f0,
        specular: 0x050505,
        shininess: 100
    });
    const eyeBall = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeGroup.add(eyeBall);
    
    // Iris
    const irisGeometry = new THREE.CircleGeometry(0.6, 32);
    const irisMaterial = new THREE.MeshPhongMaterial({
        color: settings.accentColor,
        side: THREE.DoubleSide
    });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    iris.position.z = 1.15;
    eyeGroup.add(iris);
    
    // Pupil
    const pupilGeometry = new THREE.CircleGeometry(0.3, 32);
    const pupilMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.z = 1.16;
    eyeGroup.add(pupil);
    
    // Create a flower as the target object
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(4, 0, 0);
    scene.add(flowerGroup);
    
    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({
        color: 0xffcc00
    });
    const flowerCenter = new THREE.Mesh(centerGeometry, centerMaterial);
    flowerGroup.add(flowerCenter);
    
    // Flower petals
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.25, 0.25, 0.5, 0.5, 0, 1);
    petalShape.bezierCurveTo(-0.5, 0.5, -0.25, 0.25, 0, 0);
    
    const petalGeometry = new THREE.ShapeGeometry(petalShape);
    const petalMaterial = new THREE.MeshPhongMaterial({
        color: settings.highlightColor,
        side: THREE.DoubleSide
    });
    
    for (let i = 0; i < 8; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.z = 0.1;
        petal.scale.set(0.8, 0.8, 0.8);
        petal.rotation.z = (Math.PI * 2 / 8) * i;
        flowerGroup.add(petal);
    }
    
    // Create light rays from eye
    const rayGroup = new THREE.Group();
    eyeGroup.add(rayGroup);
    
    const rayMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    for (let i = 0; i < 5; i++) {
        const rayGeometry = new THREE.ConeGeometry(0.05, 8, 8, 1, true);
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.rotation.x = Math.PI / 2;
        ray.position.z = 1.2;
        rayGroup.add(ray);
        
        // Spread rays
        ray.rotation.z = (Math.PI / 6) * (i - 2);
    }
    
    // Create blur overlay for self-seeing effect
    const blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'fixed';
    blurOverlay.style.left = '0';
    blurOverlay.style.top = '0';
    blurOverlay.style.width = '100%';
    blurOverlay.style.height = '100%';
    blurOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    blurOverlay.style.backdropFilter = 'blur(0px)';
    blurOverlay.style.transition = 'backdrop-filter 0.3s ease';
    blurOverlay.style.pointerEvents = 'none';
    blurOverlay.style.zIndex = '10';
    document.body.appendChild(blurOverlay);
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const targetPosition = new THREE.Vector3();
    
    // Update function
    function updateRayDirection(x, y) {
        // Calculate direction in scene
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Get the direction in world space
        const direction = raycaster.ray.direction.clone();
        targetPosition.copy(direction).multiplyScalar(5).add(eyeGroup.position);
        
        // Calculate vector from eye to target
        const eyeToTarget = new THREE.Vector3().subVectors(targetPosition, eyeGroup.position).normalize();
        
        // Orient the ray group
        rayGroup.lookAt(targetPosition);
        
        // Calculate angle between eye-to-target vector and eye's forward vector
        const dotProduct = eyeToTarget.z;
        
        // Adjust blur based on how much the eye is looking at itself
        // When eye tries to look back at itself, dotProduct will be close to -1
        const selfViewingFactor = Math.max(0, (-dotProduct + 0.5) * 2);
        blurOverlay.style.backdropFilter = `blur(${selfViewingFactor * 15}px)`;
    }
    
    // Event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    
    function onMouseMove(event) {
        updateRayDirection(event.clientX, event.clientY);
    }
    
    function onTouchMove(event) {
        if (event.touches.length > 0) {
            updateRayDirection(event.touches[0].clientX, event.touches[0].clientY);
            event.preventDefault();
        }
    }
    
    // Set initial ray direction
    updateRayDirection(window.innerWidth / 2, window.innerHeight / 2);
    
    // Animation variables
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        // Pulsate the eye and flower
        const scale = 1 + Math.sin(time) * 0.05;
        eyeBall.scale.set(scale, scale, scale);
        
        flowerGroup.rotation.z = time * 0.2;
        flowerCenter.scale.set(scale, scale, scale);
        
        // Animate opacity of rays
        rayGroup.children.forEach(ray => {
            ray.material.opacity = 0.4 + Math.sin(time * 2) * 0.2;
        });
        
        controls.update();
    }
    
    // Clean up function to be called when switching verses
    function cleanup() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        document.body.removeChild(blurOverlay);
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

