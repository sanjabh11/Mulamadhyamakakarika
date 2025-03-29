import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse4Animation(container, handleAction) {
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);
    
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
    
    // Particle in superposition
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create a base particle
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.8
    });
    
    const baseParticle = new THREE.Mesh(particleGeometry, particleMaterial);
    particleGroup.add(baseParticle);
    
    // Create ghostly copies to represent superposition states
    const ghostCount = 10;
    const ghosts = [];
    
    for (let i = 0; i < ghostCount; i++) {
        const ghostMaterial = particleMaterial.clone();
        ghostMaterial.opacity = 0.4;
        ghostMaterial.emissiveIntensity = 0.4;
        
        const ghost = new THREE.Mesh(particleGeometry, ghostMaterial);
        particleGroup.add(ghost);
        ghosts.push(ghost);
    }
    
    // Create a misty volume to represent superposition
    const mistGeometry = new THREE.SphereGeometry(6, 32, 32);
    const mistMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    
    const mist = new THREE.Mesh(mistGeometry, mistMaterial);
    particleGroup.add(mist);
    
    // Motion trail for base particle
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
        color: 0x3a86ff,
        transparent: true,
        opacity: 0.5
    });
    
    const trailPoints = [];
    const maxTrailPoints = 100;
    
    for (let i = 0; i < maxTrailPoints; i++) {
        trailPoints.push(new THREE.Vector3(0, 0, 0));
    }
    
    trailGeometry.setFromPoints(trailPoints);
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    particleGroup.add(trail);
    
    // State
    let isStabilized = false;
    let stabilizeTime = 0;
    let transitionDuration = 2.0; // seconds
    
    // Animation parameters
    const orbitRadius = 5;
    const orbitSpeed = 0.5;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        if (!isStabilized) {
            // Base particle follows a somewhat chaotic orbit
            baseParticle.position.x = Math.sin(time * orbitSpeed) * orbitRadius;
            baseParticle.position.y = Math.sin(time * orbitSpeed * 1.3) * orbitRadius * 0.7;
            baseParticle.position.z = Math.cos(time * orbitSpeed) * orbitRadius;
            
            // Update ghosts to show different possible states
            ghosts.forEach((ghost, i) => {
                const offset = (i / ghostCount) * Math.PI * 2;
                const localTime = time + offset;
                
                ghost.position.x = Math.sin(localTime * orbitSpeed * 0.7) * orbitRadius * 0.8;
                ghost.position.y = Math.sin(localTime * orbitSpeed * 1.1) * orbitRadius * 0.6;
                ghost.position.z = Math.cos(localTime * orbitSpeed * 0.9) * orbitRadius * 0.9;
                
                ghost.material.opacity = 0.2 + Math.sin(localTime * 2) * 0.1;
            });
            
            // Mist pulsing
            const pulseFactor = 1 + Math.sin(time) * 0.1;
            mist.scale.set(pulseFactor, pulseFactor, pulseFactor);
            
            // Update trail for chaotic motion
            for (let i = trailPoints.length - 1; i > 0; i--) {
                trailPoints[i].copy(trailPoints[i - 1]);
            }
            trailPoints[0].copy(baseParticle.position);
            trailGeometry.setFromPoints(trailPoints);
            
        } else {
            // Transition to stabilized state
            const progress = Math.min((time - stabilizeTime) / transitionDuration, 1.0);
            
            if (progress < 1.0) {
                // Particle gradually moves to a perfect orbit
                const stableX = Math.sin(time * orbitSpeed) * orbitRadius;
                const stableY = 0; // Flat orbit
                const stableZ = Math.cos(time * orbitSpeed) * orbitRadius;
                
                baseParticle.position.x = THREE.MathUtils.lerp(baseParticle.position.x, stableX, progress * 0.1);
                baseParticle.position.y = THREE.MathUtils.lerp(baseParticle.position.y, stableY, progress * 0.1);
                baseParticle.position.z = THREE.MathUtils.lerp(baseParticle.position.z, stableZ, progress * 0.1);
                
                // Ghosts fade out
                ghosts.forEach((ghost) => {
                    ghost.material.opacity = Math.max(0, 0.4 - progress * 0.4);
                });
                
                // Mist fades out
                mistMaterial.opacity = Math.max(0, 0.15 - progress * 0.15);
                
            } else {
                // Fully stabilized - perfect circular orbit
                baseParticle.position.x = Math.sin(time * orbitSpeed) * orbitRadius;
                baseParticle.position.y = 0;
                baseParticle.position.z = Math.cos(time * orbitSpeed) * orbitRadius;
                
                // Hide ghosts
                ghosts.forEach((ghost) => {
                    ghost.visible = false;
                });
                
                // Hide mist
                mist.visible = false;
            }
            
            // Update trail for stable orbit
            for (let i = trailPoints.length - 1; i > 0; i--) {
                trailPoints[i].copy(trailPoints[i - 1]);
            }
            trailPoints[0].copy(baseParticle.position);
            trailGeometry.setFromPoints(trailPoints);
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        stabilize: function() {
            if (!isStabilized) {
                isStabilized = true;
                stabilizeTime = Date.now() * 0.001;
            } else {
                // Reset to unstable state
                isStabilized = false;
                
                // Reset visibility of ghosts and mist
                ghosts.forEach((ghost) => {
                    ghost.visible = true;
                    ghost.material.opacity = 0.4;
                });
                
                mist.visible = true;
                mistMaterial.opacity = 0.15;
                
                // Clear trail
                for (let i = 0; i < trailPoints.length; i++) {
                    trailPoints[i].set(0, 0, 0);
                }
                trailGeometry.setFromPoints(trailPoints);
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
        ghosts.forEach(ghost => ghost.material.dispose());
        mistGeometry.dispose();
        mistMaterial.dispose();
        trailGeometry.dispose();
        trailMaterial.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

