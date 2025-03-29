import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse6Animation(container, handleAction) {
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
    
    // Two entangled particles that harmonize
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    const particle1Geometry = new THREE.SphereGeometry(0.6, 32, 32);
    const particle2Geometry = new THREE.SphereGeometry(0.6, 32, 32);
    
    const particle1Material = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({ 
        color: 0xff006e,
        emissive: 0xff006e,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
    });
    
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    
    particlesGroup.add(particle1);
    particlesGroup.add(particle2);
    
    // Particle trails
    class ParticleTrail {
        constructor(color, maxPoints = 100) {
            this.maxPoints = maxPoints;
            this.points = Array(maxPoints).fill(new THREE.Vector3());
            
            this.geometry = new THREE.BufferGeometry();
            this.material = new THREE.LineBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.5
            });
            
            this.line = new THREE.Line(this.geometry, this.material);
            particlesGroup.add(this.line);
        }
        
        update(position) {
            // Shift all points back
            for (let i = this.points.length - 1; i > 0; i--) {
                this.points[i] = this.points[i-1].clone();
            }
            
            // Add new point at the front
            this.points[0] = position.clone();
            
            // Update geometry
            this.geometry.setFromPoints(this.points);
        }
        
        dispose() {
            this.geometry.dispose();
            this.material.dispose();
            particlesGroup.remove(this.line);
        }
    }
    
    const trail1 = new ParticleTrail(0x3a86ff);
    const trail2 = new ParticleTrail(0xff006e);
    
    // Entanglement visualization
    const flowGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    flowGeometry.rotateX(Math.PI / 2);
    
    const flowMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.6
    });
    
    const entanglementFlow = new THREE.Mesh(flowGeometry, flowMaterial);
    particlesGroup.add(entanglementFlow);
    
    // Harmonics visualization
    const harmonicsGroup = new THREE.Group();
    scene.add(harmonicsGroup);
    
    // Create harmonic wave visualizations
    const waveCount = 5;
    const waves = [];
    
    for (let i = 0; i < waveCount; i++) {
        const points = [];
        const segments = 50;
        const radius = 7 + i * 0.5;
        
        for (let j = 0; j <= segments; j++) {
            const angle = (j / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            ));
        }
        
        const waveGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const waveMaterial = new THREE.LineBasicMaterial({ 
            color: new THREE.Color().setHSL(i/waveCount, 0.8, 0.5),
            transparent: true,
            opacity: 0.3
        });
        
        const wave = new THREE.Line(waveGeometry, waveMaterial);
        harmonicsGroup.add(wave);
        waves.push({ line: wave, radius, points, geometry: waveGeometry });
    }
    
    // State
    let harmonyLevel = 0.5; // 0 = chaotic, 1 = perfect harmony
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Calculate motion patterns based on harmony level
        const baseFrequency = 0.5;
        const radius = 5;
        
        // Particle 1 motion (more chaotic at low harmony)
        const randomOffset1 = Math.sin(time * 3.7) * (1 - harmonyLevel) * 2;
        particle1.position.x = Math.sin(time * baseFrequency) * radius + randomOffset1;
        particle1.position.y = Math.sin(time * baseFrequency * 2.3) * (1 - harmonyLevel) * 2;
        particle1.position.z = Math.cos(time * baseFrequency) * radius + randomOffset1;
        
        // Particle 2 motion (approaches harmony with particle 1)
        const randomOffset2 = Math.sin(time * 4.3) * (1 - harmonyLevel) * 2;
        const phaseShift = Math.PI * (1 - harmonyLevel); // At perfect harmony, they're opposite phases
        
        particle2.position.x = Math.sin(time * baseFrequency + phaseShift) * radius + randomOffset2;
        particle2.position.y = Math.sin(time * baseFrequency * 1.7) * (1 - harmonyLevel) * 2;
        particle2.position.z = Math.cos(time * baseFrequency + phaseShift) * radius + randomOffset2;
        
        // Update trails
        trail1.update(particle1.position);
        trail2.update(particle2.position);
        
        // Update entanglement visualization
        const entanglementStrength = harmonyLevel;
        entanglementFlow.position.copy(particle1.position);
        entanglementFlow.lookAt(particle2.position);
        
        const distance = particle1.position.distanceTo(particle2.position);
        entanglementFlow.scale.set(entanglementStrength * 2, entanglementStrength * 2, distance);
        
        entanglementFlow.material.opacity = entanglementStrength * 0.8;
        
        // Update harmonic waves
        waves.forEach((wave, i) => {
            const waveHeight = Math.sin(time * (1 + i * 0.2) + i) * (harmonyLevel * 1.5);
            
            for (let j = 0; j < wave.points.length; j++) {
                const angle = (j / (wave.points.length - 1)) * Math.PI * 2;
                wave.points[j].y = Math.sin(angle * 3 + time * 2) * waveHeight;
            }
            
            wave.geometry.setFromPoints(wave.points);
            wave.line.material.opacity = harmonyLevel * 0.5;
        });
        
        harmonicsGroup.rotation.y = time * 0.1;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        harmonyLevel: function(value) {
            harmonyLevel = value;
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
        particle1Geometry.dispose();
        particle1Material.dispose();
        particle2Geometry.dispose();
        particle2Material.dispose();
        
        flowGeometry.dispose();
        flowMaterial.dispose();
        
        trail1.dispose();
        trail2.dispose();
        
        waves.forEach(wave => {
            wave.geometry.dispose();
            wave.line.material.dispose();
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

