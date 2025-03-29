import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse12Animation(container, handleAction) {
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
    
    // Particle with hazy trail
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Main particle
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
    
    // Create a hazy trail using particle system
    const trailParticles = new THREE.Group();
    particleGroup.add(trailParticles);
    
    const trailParticleCount = 100;
    const trailParticleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const trailParticleMaterials = [];
    const trailParticleObjects = [];
    
    for (let i = 0; i < trailParticleCount; i++) {
        const opacity = 1 - (i / trailParticleCount);
        
        const material = new THREE.MeshBasicMaterial({
            color: 0x3a86ff,
            transparent: true,
            opacity: opacity * 0.7
        });
        
        const trailParticle = new THREE.Mesh(trailParticleGeometry, material);
        trailParticle.visible = false;
        trailParticles.add(trailParticle);
        
        trailParticleMaterials.push(material);
        trailParticleObjects.push(trailParticle);
    }
    
    // Create a measurement apparatus
    const measurementGroup = new THREE.Group();
    scene.add(measurementGroup);
    
    // Measurement device
    const deviceGeometry = new THREE.CylinderGeometry(0.5, 1, 2, 16);
    const deviceMaterial = new THREE.MeshPhongMaterial({
        color: 0xff006e,
        emissive: 0xff006e,
        emissiveIntensity: 0.3
    });
    
    const measurementDevice = new THREE.Mesh(deviceGeometry, deviceMaterial);
    measurementDevice.position.set(5, 0, 0);
    measurementDevice.rotation.z = Math.PI / 2;
    measurementGroup.add(measurementDevice);
    
    // Measurement beam
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    beamGeometry.rotateZ(Math.PI / 2);
    
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        transparent: true,
        opacity: 0
    });
    
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.copy(measurementDevice.position);
    measurementGroup.add(beam);
    
    // Create "past" indicator
    const pastGeometry = new THREE.BoxGeometry(3, 1, 1);
    const pastMaterial = new THREE.MeshBasicMaterial({
        color: 0xffbe0b,
        transparent: true,
        opacity: 0.5
    });
    
    const pastIndicator = new THREE.Mesh(pastGeometry, pastMaterial);
    pastIndicator.position.set(-5, 3, 0);
    scene.add(pastIndicator);
    
    // Text for past indicator
    const pastTextMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    
    // Create "future" indicator
    const futureGeometry = new THREE.BoxGeometry(3, 1, 1);
    const futureMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.5
    });
    
    const futureIndicator = new THREE.Mesh(futureGeometry, futureMaterial);
    futureIndicator.position.set(5, 3, 0);
    scene.add(futureIndicator);
    
    // Create "present" indicator
    const presentGeometry = new THREE.BoxGeometry(3, 1, 1);
    const presentMaterial = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        transparent: true,
        opacity: 0.5
    });
    
    const presentIndicator = new THREE.Mesh(presentGeometry, presentMaterial);
    presentIndicator.position.set(0, 3, 0);
    scene.add(presentIndicator);
    
    // State
    let isMeasuring = false;
    let trailVisibility = 0.5; // 0 = invisible, 1 = fully visible
    
    // Paths
    const createPath = (type) => {
        const points = [];
        const pathPoints = 100;
        
        switch(type) {
            case 'default':
                // Swooping path
                for (let i = 0; i < pathPoints; i++) {
                    const t = i / (pathPoints - 1);
                    const x = (t - 0.5) * 15;
                    const y = Math.sin(t * Math.PI) * 3;
                    const z = Math.cos(t * Math.PI * 3) * 2;
                    
                    points.push(new THREE.Vector3(x, y, z));
                }
                break;
                
            case 'measured':
                // More defined path after measurement
                for (let i = 0; i < pathPoints; i++) {
                    const t = i / (pathPoints - 1);
                    const x = (t - 0.5) * 15;
                    const y = Math.sin(t * Math.PI) * 3;
                    const z = Math.cos(t * Math.PI * 2) * (1 - t) * 2;
                    
                    points.push(new THREE.Vector3(x, y, z));
                }
                break;
        }
        
        return points;
    };
    
    const defaultPath = createPath('default');
    const measuredPath = createPath('measured');
    
    let activePath = defaultPath;
    let pathProgress = 0;
    const pathSpeed = 0.003;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update path progress
        pathProgress += pathSpeed;
        if (pathProgress >= 1) pathProgress = 0;
        
        // Calculate particle position on path
        const pathIndex = Math.floor(pathProgress * (activePath.length - 1));
        particle.position.copy(activePath[pathIndex]);
        
        // Update trail particles
        for (let i = 0; i < trailParticleCount; i++) {
            const trailOffset = (i + 1) / trailParticleCount;
            const trailPathProgress = pathProgress - trailOffset * 0.5;
            
            if (trailPathProgress >= 0) {
                const trailPathIndex = Math.floor(trailPathProgress * (activePath.length - 1));
                trailParticleObjects[i].position.copy(activePath[trailPathIndex]);
                trailParticleObjects[i].visible = true;
                
                // Apply some noise to trail positions for a hazier effect
                const noise = 0.1 + (i / trailParticleCount) * 0.5;
                trailParticleObjects[i].position.x += (Math.random() - 0.5) * noise;
                trailParticleObjects[i].position.y += (Math.random() - 0.5) * noise;
                trailParticleObjects[i].position.z += (Math.random() - 0.5) * noise;
                
                // Adjust opacity based on trail visibility
                trailParticleMaterials[i].opacity = (1 - (i / trailParticleCount)) * 0.7 * trailVisibility;
            } else {
                trailParticleObjects[i].visible = false;
            }
        }
        
        // Handle measurement beam
        if (isMeasuring) {
            // Update beam position and scale
            beam.position.copy(measurementDevice.position);
            beam.lookAt(particle.position);
            
            const distance = measurementDevice.position.distanceTo(particle.position);
            beam.scale.set(1, 1, distance);
            
            // Pulse the beam
            const pulseOpacity = 0.5 + Math.sin(time * 10) * 0.3;
            beamMaterial.opacity = pulseOpacity;
        } else {
            beamMaterial.opacity = 0;
        }
        
        // Visual effects
        particle.scale.set(
            0.8 + Math.sin(time * 3) * 0.2,
            0.8 + Math.sin(time * 3) * 0.2,
            0.8 + Math.sin(time * 3) * 0.2
        );
        
        // Pulse indicators
        pastIndicator.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.1;
        presentIndicator.material.opacity = 0.3 + Math.sin(time * 0.5 + 2) * 0.1;
        futureIndicator.material.opacity = 0.3 + Math.sin(time * 0.5 + 4) * 0.1;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        measureOrigin: function() {
            isMeasuring = true;
            activePath = measuredPath;
            trailVisibility = 1.0;
            
            // Flash effect
            const originalOpacity = particle.material.opacity;
            particle.material.opacity = 1;
            
            setTimeout(() => {
                particle.material.opacity = originalOpacity;
                
                // Stop measuring after a few seconds
                setTimeout(() => {
                    isMeasuring = false;
                }, 3000);
            }, 300);
        },
        
        resetTrail: function() {
            isMeasuring = false;
            activePath = defaultPath;
            trailVisibility = 0.5;
            pathProgress = 0;
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
        trailParticleGeometry.dispose();
        trailParticleMaterials.forEach(material => material.dispose());
        
        deviceGeometry.dispose();
        deviceMaterial.dispose();
        beamGeometry.dispose();
        beamMaterial.dispose();
        
        pastGeometry.dispose();
        pastMaterial.dispose();
        presentGeometry.dispose();
        presentMaterial.dispose();
        futureGeometry.dispose();
        futureMaterial.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

