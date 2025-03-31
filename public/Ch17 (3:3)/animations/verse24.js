import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse24Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x112233);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
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
    
    // Create different contexts (represents contextuality)
    const contexts = [];
    const contextColors = [
        0x3a1c71, // Purple
        0xd76d77, // Pink
        0xffaf7b, // Orange
        0x009688, // Teal
        0x4CAF50  // Green
    ];
    
    for (let i = 0; i < 5; i++) {
        const contextGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
        const contextMaterial = new THREE.MeshStandardMaterial({
            color: contextColors[i],
            transparent: true,
            opacity: 0.7
        });
        const torus = new THREE.Mesh(contextGeometry, contextMaterial);
        
        // Rotate each torus to a different orientation
        torus.rotation.x = Math.PI / 2;
        torus.rotation.y = i * Math.PI / 5;
        
        scene.add(torus);
        contexts.push(torus);
    }
    
    // Create quantum particles
    const particlesCount = 200;
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    for (let i = 0; i < particlesCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: contextColors[Math.floor(Math.random() * contextColors.length)]
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random position within the scene
        particle.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        
        // Add metadata for animation
        particle.userData = {
            originalColor: particle.material.emissive.getHex(),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            context: Math.floor(Math.random() * contexts.length)
        };
        
        particlesGroup.add(particle);
    }
    
    // Create ethical symbols (good and evil)
    const symbolsGroup = new THREE.Group();
    scene.add(symbolsGroup);
    
    // Good symbol (yin)
    const yinGeometry = new THREE.CircleGeometry(0.4, 32);
    const yinMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const yin = new THREE.Mesh(yinGeometry, yinMaterial);
    yin.position.set(-1.5, 0, 0);
    symbolsGroup.add(yin);
    
    // Evil symbol (yang)
    const yangGeometry = new THREE.CircleGeometry(0.4, 32);
    const yangMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const yang = new THREE.Mesh(yangGeometry, yangMaterial);
    yang.position.set(1.5, 0, 0);
    symbolsGroup.add(yang);
    
    // Animation
    let activeContext = 0;
    const clock = new THREE.Clock();
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate contexts
        contexts.forEach((context, i) => {
            context.rotation.z += 0.001 * (i + 1);
            
            // Pulse the active context
            if (i === activeContext) {
                context.material.opacity = 0.7 + 0.3 * Math.sin(elapsedTime * 2);
                context.scale.set(1 + 0.05 * Math.sin(elapsedTime * 2), 1 + 0.05 * Math.sin(elapsedTime * 2), 1);
            } else {
                context.material.opacity = 0.3;
                context.scale.set(1, 1, 1);
            }
        });
        
        // Change active context every few seconds
        if (Math.floor(elapsedTime) % 5 === 0 && Math.floor(elapsedTime) !== 0) {
            if (Math.floor(elapsedTime / 5) !== activeContext) {
                activeContext = (activeContext + 1) % contexts.length;
            }
        }
        
        // Update particles
        particlesGroup.children.forEach(particle => {
            // Move particles
            particle.position.add(particle.userData.velocity);
            
            // Boundary check
            if (particle.position.length() > 4) {
                particle.userData.velocity.negate();
            }
            
            // Change color based on context
            if (particle.userData.context === activeContext) {
                particle.material.emissive.setHex(particle.userData.originalColor);
                particle.material.emissiveIntensity = 1.5;
                particle.scale.set(1.5, 1.5, 1.5);
            } else {
                particle.material.emissive.setHex(0x333333);
                particle.material.emissiveIntensity = 0.5;
                particle.scale.set(1, 1, 1);
            }
        });
        
        // Rotate yin-yang symbols
        symbolsGroup.rotation.z = elapsedTime * 0.2;
        
        // Oscillate the symbols
        yin.position.x = -1.5 + 0.2 * Math.sin(elapsedTime);
        yang.position.x = 1.5 + 0.2 * Math.sin(elapsedTime + Math.PI);
        
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
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                object.material.dispose();
            }
        });
    }
    
    return {
        cleanup,
        resize: handleResize
    };
}

