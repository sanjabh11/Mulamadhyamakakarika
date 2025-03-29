import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse1Animation(container, handleAction) {
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);
    
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
    
    // Particle cloud
    const particles = new THREE.Group();
    scene.add(particles);
    
    const particleCount = 500;
    const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const particlePositions = [];
    const particleObjects = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Create superposition cloud with gaussian distribution
        const radius = 5 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        particlePositions.push({ x, y, z, origX: x, origY: y, origZ: z });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.position.set(x, y, z);
        particle.scale.setScalar(Math.random() * 0.5 + 0.5);
        particles.add(particle);
        particleObjects.push(particle);
    }
    
    // Path for when "observed"
    const pathGeometry = new THREE.BufferGeometry();
    const pathPoints = [];
    
    // Create a spiral path
    for (let i = 0; i < 100; i++) {
        const t = i / 99;
        const radius = 5 * (1 - t);
        const angle = t * Math.PI * 8;
        
        pathPoints.push(
            new THREE.Vector3(
                radius * Math.cos(angle),
                radius * Math.sin(angle),
                10 * t - 5
            )
        );
    }
    
    pathGeometry.setFromPoints(pathPoints);
    
    const pathMaterial = new THREE.LineBasicMaterial({ 
        color: 0xff006e,
        transparent: true,
        opacity: 0
    });
    
    const path = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(path);
    
    // State
    let observed = false;
    let observeTime = 0;
    let animating = false;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        if (!observed) {
            // Animate particles in superposition cloud
            particleObjects.forEach((particle, i) => {
                const pos = particlePositions[i];
                const noise = Math.sin(time * 0.5 + i) * 0.2;
                
                particle.position.x = pos.origX + noise;
                particle.position.y = pos.origY + noise;
                particle.position.z = pos.origZ + noise;
                
                particle.material.opacity = 0.7 + Math.sin(time * 2 + i) * 0.3;
            });
        } else if (animating) {
            const elapsed = time - observeTime;
            const duration = 2.0; // seconds
            const progress = Math.min(elapsed / duration, 1.0);
            
            // Collapse to path
            particleObjects.forEach((particle, i) => {
                const t = (i / particleCount) * 0.99; // Distribute along path
                const pathPoint = pathPoints[Math.floor(t * pathPoints.length)];
                
                // Blend between original position and path position
                particle.position.x = THREE.MathUtils.lerp(particlePositions[i].origX, pathPoint.x, progress);
                particle.position.y = THREE.MathUtils.lerp(particlePositions[i].origY, pathPoint.y, progress);
                particle.position.z = THREE.MathUtils.lerp(particlePositions[i].origZ, pathPoint.z, progress);
                
                // Make particles more solid as they collapse
                particle.material.opacity = THREE.MathUtils.lerp(0.7, 1.0, progress);
            });
            
            // Reveal path
            pathMaterial.opacity = progress;
            
            if (progress >= 1.0) {
                animating = false;
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        observe: function() {
            if (!observed || !animating) {
                observed = true;
                observeTime = Date.now() * 0.001;
                animating = true;
                
                // Reset if already observed
                if (observed && !animating) {
                    particleObjects.forEach((particle, i) => {
                        const pos = particlePositions[i];
                        particle.position.set(pos.origX, pos.origY, pos.origZ);
                        particle.material.opacity = 0.7;
                    });
                    pathMaterial.opacity = 0;
                }
            } else {
                // Reset to superposition state
                observed = false;
                animating = false;
                
                particleObjects.forEach((particle, i) => {
                    const pos = particlePositions[i];
                    particle.position.set(pos.origX, pos.origY, pos.origZ);
                    particle.material.opacity = 0.7;
                });
                
                pathMaterial.opacity = 0;
            }
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
        particleGeometry.dispose();
        particleMaterial.dispose();
        pathGeometry.dispose();
        pathMaterial.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

