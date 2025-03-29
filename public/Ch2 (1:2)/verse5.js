import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse5Animation(container, handleAction) {
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
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);
    
    // Main particle
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particleGroup.add(particle);
    
    // Measurement tools visualization
    const toolsGroup = new THREE.Group();
    scene.add(toolsGroup);
    
    // Light measurement tool
    const lightToolGeometry = new THREE.CylinderGeometry(0.1, 0.3, 2, 16);
    const lightToolMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffbe0b,
        emissive: 0xffbe0b,
        emissiveIntensity: 0.3
    });
    const lightTool = new THREE.Mesh(lightToolGeometry, lightToolMaterial);
    lightTool.position.set(-4, 0, 0);
    lightTool.rotation.x = Math.PI / 2;
    toolsGroup.add(lightTool);
    
    // Sound measurement tool
    const soundToolGeometry = new THREE.ConeGeometry(0.5, 2, 16);
    const soundToolMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xfb5607,
        emissive: 0xfb5607,
        emissiveIntensity: 0.3
    });
    const soundTool = new THREE.Mesh(soundToolGeometry, soundToolMaterial);
    soundTool.position.set(0, 0, -4);
    soundTool.rotation.x = Math.PI;
    toolsGroup.add(soundTool);
    
    // Field measurement tool
    const fieldToolGeometry = new THREE.BoxGeometry(1.5, 0.3, 1.5);
    const fieldToolMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8338ec,
        emissive: 0x8338ec,
        emissiveIntensity: 0.3
    });
    const fieldTool = new THREE.Mesh(fieldToolGeometry, fieldToolMaterial);
    fieldTool.position.set(4, 0, 0);
    toolsGroup.add(fieldTool);
    
    // Particle path visualization
    const pathGroup = new THREE.Group();
    scene.add(pathGroup);
    
    // Different paths for different measurement tools
    const lightPathGeometry = new THREE.BufferGeometry();
    const soundPathGeometry = new THREE.BufferGeometry();
    const fieldPathGeometry = new THREE.BufferGeometry();
    
    const pathMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3a86ff,
        transparent: true,
        opacity: 0.5
    });
    
    const lightPath = new THREE.Line(lightPathGeometry, pathMaterial.clone());
    const soundPath = new THREE.Line(soundPathGeometry, pathMaterial.clone());
    const fieldPath = new THREE.Line(fieldPathGeometry, pathMaterial.clone());
    
    pathGroup.add(lightPath);
    pathGroup.add(soundPath);
    pathGroup.add(fieldPath);
    
    // Generate path points
    const generatePathPoints = (type, pointCount = 100) => {
        const points = [];
        
        for (let i = 0; i < pointCount; i++) {
            const t = i / (pointCount - 1);
            let x, y, z;
            
            switch(type) {
                case 'light':
                    // Wave-like path
                    x = t * 8 - 4;
                    y = Math.sin(t * Math.PI * 4) * 2;
                    z = Math.cos(t * Math.PI * 2) * 2;
                    break;
                    
                case 'sound':
                    // Spiral path
                    const angle = t * Math.PI * 6;
                    const radius = 4 * (1 - t * 0.7);
                    x = Math.cos(angle) * radius;
                    y = Math.sin(angle) * radius;
                    z = t * 8 - 4;
                    break;
                    
                case 'field':
                    // Grid-like path
                    x = Math.sin(t * Math.PI * 8) * 4;
                    y = (t % 0.25 < 0.125) ? -2 : 2;
                    z = Math.cos(t * Math.PI * 6) * 3;
                    break;
            }
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        return points;
    };
    
    const lightPathPoints = generatePathPoints('light');
    const soundPathPoints = generatePathPoints('sound');
    const fieldPathPoints = generatePathPoints('field');
    
    lightPathGeometry.setFromPoints(lightPathPoints);
    soundPathGeometry.setFromPoints(soundPathPoints);
    fieldPathGeometry.setFromPoints(fieldPathPoints);
    
    // Make all paths initially invisible
    lightPath.visible = false;
    soundPath.visible = false;
    fieldPath.visible = false;
    
    // Trail for the particle
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
        color: 0x3a86ff,
        transparent: true,
        opacity: 0.7
    });
    
    const maxTrailPoints = 50;
    const trailPoints = [];
    
    for (let i = 0; i < maxTrailPoints; i++) {
        trailPoints.push(new THREE.Vector3(0, 0, 0));
    }
    
    trailGeometry.setFromPoints(trailPoints);
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    particleGroup.add(trail);
    
    // Measurement beam visualization
    const createBeam = (origin, target, color) => {
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        beamGeometry.translate(0, 0.5, 0);
        
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.copy(origin);
        
        // Orient the beam towards the target
        beam.lookAt(target);
        
        // Scale the beam to reach the target
        const distance = origin.distanceTo(target);
        beam.scale.set(1, distance, 1);
        
        beam.visible = false;
        scene.add(beam);
        
        return beam;
    };
    
    const lightBeam = createBeam(lightTool.position, particle.position, 0xffbe0b);
    const soundBeam = createBeam(soundTool.position, particle.position, 0xfb5607);
    const fieldBeam = createBeam(fieldTool.position, particle.position, 0x8338ec);
    
    // State
    let activeMeasurement = null;
    let pathProgress = 0;
    const pathSpeed = 0.003;
    let activePath = null;
    let activePathPoints = null;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Animate measurement tools
        lightTool.rotation.z = Math.sin(time * 0.5) * 0.2;
        soundTool.rotation.y = Math.sin(time * 0.7) * 0.3;
        fieldTool.rotation.y = time * 0.2;
        
        // Handle active measurement path
        if (activeMeasurement) {
            pathProgress += pathSpeed;
            if (pathProgress > 1) pathProgress = 1;
            
            const index = Math.floor(pathProgress * (activePathPoints.length - 1));
            const position = activePathPoints[index];
            
            particle.position.copy(position);
            
            // Update trail
            for (let i = trailPoints.length - 1; i > 0; i--) {
                trailPoints[i].copy(trailPoints[i - 1]);
            }
            trailPoints[0].copy(position);
            trailGeometry.setFromPoints(trailPoints);
            
            // Update measurement beams
            if (activeMeasurement === 'light') {
                lightBeam.visible = true;
                lightBeam.position.copy(lightTool.position);
                lightBeam.lookAt(particle.position);
                lightBeam.scale.y = lightTool.position.distanceTo(particle.position);
            } else if (activeMeasurement === 'sound') {
                soundBeam.visible = true;
                soundBeam.position.copy(soundTool.position);
                soundBeam.lookAt(particle.position);
                soundBeam.scale.y = soundTool.position.distanceTo(particle.position);
            } else if (activeMeasurement === 'field') {
                fieldBeam.visible = true;
                fieldBeam.position.copy(fieldTool.position);
                fieldBeam.lookAt(particle.position);
                fieldBeam.scale.y = fieldTool.position.distanceTo(particle.position);
            }
        } else {
            // Default particle position when no measurement is active
            particle.position.x = Math.sin(time) * 3;
            particle.position.y = Math.cos(time * 1.3) * 2;
            particle.position.z = Math.sin(time * 0.7) * 3;
            
            // Update trail for default motion
            for (let i = trailPoints.length - 1; i > 0; i--) {
                trailPoints[i].copy(trailPoints[i - 1]);
            }
            trailPoints[0].copy(particle.position);
            trailGeometry.setFromPoints(trailPoints);
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Helper function to reset measurements
    function resetMeasurements() {
        activeMeasurement = null;
        pathProgress = 0;
        activePath = null;
        activePathPoints = null;
        
        lightPath.visible = false;
        soundPath.visible = false;
        fieldPath.visible = false;
        
        lightBeam.visible = false;
        soundBeam.visible = false;
        fieldBeam.visible = false;
        
        // Clear trail
        for (let i = 0; i < trailPoints.length; i++) {
            trailPoints[i].set(0, 0, 0);
        }
        trailGeometry.setFromPoints(trailPoints);
    }
    
    // Actions
    const actions = {
        measureLight: function() {
            resetMeasurements();
            activeMeasurement = 'light';
            activePath = lightPath;
            activePathPoints = lightPathPoints;
            lightPath.visible = true;
        },
        
        measureSound: function() {
            resetMeasurements();
            activeMeasurement = 'sound';
            activePath = soundPath;
            activePathPoints = soundPathPoints;
            soundPath.visible = true;
        },
        
        measureField: function() {
            resetMeasurements();
            activeMeasurement = 'field';
            activePath = fieldPath;
            activePathPoints = fieldPathPoints;
            fieldPath.visible = true;
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
        
        lightToolGeometry.dispose();
        lightToolMaterial.dispose();
        soundToolGeometry.dispose();
        soundToolMaterial.dispose();
        fieldToolGeometry.dispose();
        fieldToolMaterial.dispose();
        
        lightPathGeometry.dispose();
        soundPathGeometry.dispose();
        fieldPathGeometry.dispose();
        pathMaterial.dispose();
        
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

