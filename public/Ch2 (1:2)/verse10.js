import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse10Animation(container, handleAction) {
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 3, 15);
    
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
    
    // Create a particle system to represent motion
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Main particle (mover)
    const particleGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particleGroup.add(particle);
    
    // Observer visualization
    const observerGroup = new THREE.Group();
    scene.add(observerGroup);
    
    // Observer "eye"
    const eyeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff006e,
        emissive: 0xff006e,
        emissiveIntensity: 0.5
    });
    
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(0, 0, 7);
    observerGroup.add(eye);
    
    // Observer "cone of vision"
    const coneGeometry = new THREE.ConeGeometry(3, 7, 32);
    coneGeometry.rotateX(Math.PI);
    
    const coneMaterial = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    
    const visionCone = new THREE.Mesh(coneGeometry, coneMaterial);
    visionCone.position.set(0, 0, 3.5);
    eye.add(visionCone);
    
    // Path visualization
    const pathGroup = new THREE.Group();
    scene.add(pathGroup);
    
    // Create different paths based on perspective
    const pathCount = 5;
    const perspectivePaths = [];
    
    for (let i = 0; i < pathCount; i++) {
        // Create a spiral path with variations
        const points = [];
        const segmentCount = 100;
        const radius = 6;
        const height = 4;
        const turns = 2 + i * 0.5;
        
        for (let j = 0; j < segmentCount; j++) {
            const t = j / (segmentCount - 1);
            const angle = t * Math.PI * 2 * turns;
            
            const x = Math.cos(angle) * radius * (1 - t * 0.5);
            const y = (t - 0.5) * height + Math.sin(i * 2 + t * 5) * 0.5;
            const z = Math.sin(angle) * radius * (1 - t * 0.5);
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const pathMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(i / pathCount, 0.8, 0.5),
            transparent: true,
            opacity: 0.3
        });
        
        const path = new THREE.Line(pathGeometry, pathMaterial);
        path.visible = i === 0; // Only show initial path
        pathGroup.add(path);
        
        perspectivePaths.push({ path, points });
    }
    
    // Particle trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
        color: 0x3a86ff,
        transparent: true,
        opacity: 0.5
    });
    
    const maxTrailPoints = 50;
    const trailPoints = Array(maxTrailPoints).fill(new THREE.Vector3());
    
    trailGeometry.setFromPoints(trailPoints);
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    particleGroup.add(trail);
    
    // Observation beam visualization
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    beamGeometry.rotateX(Math.PI / 2);
    
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        transparent: true,
        opacity: 0.6
    });
    
    const observationBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    observationBeam.visible = false;
    observerGroup.add(observationBeam);
    
    // State
    let activePerspective = 0;
    let particleProgress = 0;
    const particleSpeed = 0.003;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update particle position along active path
        const activePathData = perspectivePaths[activePerspective];
        const points = activePathData.points;
        
        particleProgress += particleSpeed;
        if (particleProgress >= 1) particleProgress = 0;
        
        const index = Math.floor(particleProgress * (points.length - 1));
        const position = points[index];
        
        particle.position.copy(position);
        
        // Update trail
        for (let i = trailPoints.length - 1; i > 0; i--) {
            trailPoints[i].copy(trailPoints[i-1]);
        }
        trailPoints[0].copy(position);
        trailGeometry.setFromPoints(trailPoints);
        
        // Update observer
        observerGroup.rotation.y = Math.sin(time * 0.3) * 0.5;
        eye.lookAt(particle.position);
        
        // Update observation beam
        observationBeam.position.copy(eye.position);
        observationBeam.lookAt(particle.position);
        
        const distance = eye.position.distanceTo(particle.position);
        observationBeam.scale.z = distance;
        
        // Visual effects
        const pulseFactor = 0.7 + Math.sin(time * 3) * 0.3;
        particle.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        particleMaterial.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
        eyeMaterial.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.2;
        
        visionCone.material.opacity = 0.05 + Math.sin(time * 0.5) * 0.02;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        changePerspective: function() {
            // Toggle observation beam
            observationBeam.visible = true;
            
            // Flash effect
            const originalOpacity = particle.material.opacity;
            particle.material.opacity = 1;
            
            // Change perspective after a slight delay
            setTimeout(() => {
                // Hide all paths
                perspectivePaths.forEach(p => p.path.visible = false);
                
                // Move to next perspective
                activePerspective = (activePerspective + 1) % perspectivePaths.length;
                
                // Show active path
                perspectivePaths[activePerspective].path.visible = true;
                
                // Reset particle
                particleProgress = 0;
                
                // Reset opacity
                particle.material.opacity = originalOpacity;
                
                // Hide beam after effect
                setTimeout(() => {
                    observationBeam.visible = false;
                }, 500);
                
            }, 300);
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
        eyeGeometry.dispose();
        eyeMaterial.dispose();
        coneGeometry.dispose();
        coneMaterial.dispose();
        trailGeometry.dispose();
        trailMaterial.dispose();
        beamGeometry.dispose();
        beamMaterial.dispose();
        
        perspectivePaths.forEach(pathData => {
            pathData.path.geometry.dispose();
            pathData.path.material.dispose();
        });
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

