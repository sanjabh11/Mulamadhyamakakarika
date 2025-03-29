import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse2Animation(container, handleAction) {
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // River particles
    const riverGroup = new THREE.Group();
    scene.add(riverGroup);
    
    // River bed (curved surface)
    const riverWidth = 10;
    const riverLength = 30;
    const segments = 50;
    
    const riverGeometry = new THREE.PlaneGeometry(riverWidth, riverLength, segments / 2, segments);
    riverGeometry.rotateX(-Math.PI / 2);
    
    // Add some undulation to the river bed
    const positions = riverGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        
        // Create gentle curves in the riverbed
        positions[i + 1] = Math.sin(x * 0.5) * 0.3 + Math.sin(z * 0.3) * 0.2;
    }
    
    const riverMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a2472,
        transparent: true,
        opacity: 0.3,
        roughness: 0.5,
        metalness: 0.2,
        wireframe: true
    });
    
    const riverBed = new THREE.Mesh(riverGeometry, riverMaterial);
    riverBed.position.z = -riverLength / 2;
    riverGroup.add(riverBed);
    
    // Flow particles
    const particleCount = 1000;
    const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.7
    });
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        
        // Random position within river bounds
        particle.position.x = (Math.random() - 0.5) * riverWidth;
        particle.position.y = Math.random() * 0.5 + 0.1;
        particle.position.z = (Math.random() - 0.5) * riverLength;
        
        particle.userData = {
            speed: 0.05 + Math.random() * 0.1,
            originalSpeed: 0.05 + Math.random() * 0.1
        };
        
        riverGroup.add(particle);
        particles.push(particle);
    }
    
    // State
    let flowMultiplier = 1.0;
    
    // Interaction plane for mouse events
    const interactionPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(riverWidth, riverLength),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactionPlane.rotation.x = -Math.PI / 2;
    interactionPlane.position.z = -riverLength / 2;
    scene.add(interactionPlane);
    
    // For mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    container.addEventListener('mousemove', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / width) * 2 - 1;
        mouse.y = -(event.clientY / height) * 2 + 1;
    });
    
    container.addEventListener('pointerdown', () => {
        // Cast a ray from the camera through the mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Check if the ray intersects the interaction plane
        const intersects = raycaster.intersectObject(interactionPlane);
        
        if (intersects.length > 0) {
            // Create a ripple at the intersection point
            const point = intersects[0].point;
            createRipple(point.x, point.z);
        }
    });
    
    // Ripple effect
    const ripples = [];
    
    function createRipple(x, z) {
        const geometry = new THREE.RingGeometry(0.1, 0.2, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x8338ec, 
            transparent: true, 
            opacity: 1,
            side: THREE.DoubleSide
        });
        
        const ripple = new THREE.Mesh(geometry, material);
        ripple.position.set(x, 0.5, z);
        ripple.rotation.x = -Math.PI / 2;
        ripple.userData = { 
            age: 0,
            maxAge: 2,
            initialSize: 0.2
        };
        
        riverGroup.add(ripple);
        ripples.push(ripple);
    }
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update particles
        particles.forEach(particle => {
            // Apply flow speed
            particle.position.z += particle.userData.speed * flowMultiplier;
            
            // If particle goes beyond the river length, reset it
            if (particle.position.z > riverLength / 2) {
                particle.position.z = -riverLength / 2;
                particle.position.x = (Math.random() - 0.5) * riverWidth;
                particle.position.y = Math.random() * 0.5 + 0.1;
            }
            
            // Add some gentle up/down movement
            particle.position.y += Math.sin(time * 2 + particle.position.x) * 0.002;
            
            // Particle glow effect
            particle.material.emissiveIntensity = 0.5 + Math.sin(time * 3 + particle.position.x * 2) * 0.3;
        });
        
        // Update ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            const ripple = ripples[i];
            ripple.userData.age += 0.016; // Approx time per frame
            
            const ageRatio = ripple.userData.age / ripple.userData.maxAge;
            const size = ripple.userData.initialSize + ageRatio * 5;
            
            ripple.scale.set(size, size, 1);
            ripple.material.opacity = 1 - ageRatio;
            
            if (ripple.userData.age >= ripple.userData.maxAge) {
                riverGroup.remove(ripple);
                ripples.splice(i, 1);
                ripple.geometry.dispose();
                ripple.material.dispose();
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        flowSpeed: function(value) {
            flowMultiplier = value;
        }
    };
    
    // Handle resize
    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }
    
    // Cleanup
    function dispose() {
        renderer.dispose();
        container.removeChild(renderer.domElement);
        
        // Dispose geometries and materials
        riverGeometry.dispose();
        riverMaterial.dispose();
        particleGeometry.dispose();
        
        particles.forEach(p => {
            p.material.dispose();
        });
        
        ripples.forEach(r => {
            r.geometry.dispose();
            r.material.dispose();
        });
        
        interactionPlane.geometry.dispose();
        interactionPlane.material.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

