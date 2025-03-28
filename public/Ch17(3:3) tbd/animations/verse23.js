import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function verse23Animation(container) {
    // Remove any existing canvases
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111133);
    
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
    
    // Observer (represents agency)
    const observerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const observerMaterial = new THREE.MeshStandardMaterial({
        color: 0x6d4ab1,
        emissive: 0x3a1c71,
        metalness: 0.3,
        roughness: 0.4
    });
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    scene.add(observer);
    
    // Quantum particles (represents actions)
    const particlesCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xd76d77,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(particlesCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particlesCount; i++) {
        // Random position in a sphere
        const radius = Math.random() * 3 + 1;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Random velocity
        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        });
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Measurement field (represents quantum measurement)
    const fieldGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    scene.add(field);
    
    // Animation
    let collapsed = false;
    let collapseTime = 0;
    
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Rotate the observer
        observer.rotation.y += 0.005;
        
        // Rotate the field in the opposite direction
        field.rotation.y -= 0.003;
        field.rotation.x += 0.002;
        
        // Simulate quantum collapse when observer moves
        const time = Date.now() * 0.001;
        if (time - collapseTime > 5) {  // Every 5 seconds
            collapsed = !collapsed;
            collapseTime = time;
        }
        
        // Update particle positions
        const positions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particlesCount; i++) {
            if (collapsed) {
                // When collapsed, particles move toward the observer
                const dx = observer.position.x - positions[i * 3];
                const dy = observer.position.y - positions[i * 3 + 1];
                const dz = observer.position.z - positions[i * 3 + 2];
                
                positions[i * 3] += dx * 0.01;
                positions[i * 3 + 1] += dy * 0.01;
                positions[i * 3 + 2] += dz * 0.01;
            } else {
                // When not collapsed, particles move randomly
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;
                
                // Boundary check to keep particles within the field
                const distance = Math.sqrt(
                    positions[i * 3] ** 2 + 
                    positions[i * 3 + 1] ** 2 + 
                    positions[i * 3 + 2] ** 2
                );
                
                if (distance > 3.5) {
                    velocities[i].x *= -1;
                    velocities[i].y *= -1;
                    velocities[i].z *= -1;
                }
            }
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
        
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

