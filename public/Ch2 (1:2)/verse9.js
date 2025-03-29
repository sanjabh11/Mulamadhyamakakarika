import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse9Animation(container, handleAction) {
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
    
    // Create a pair of entangled particles
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Particle geometries & materials
    const particleGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    
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
    
    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    particle1.position.set(-4, 0, 0);
    particleGroup.add(particle1);
    
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    particle2.position.set(4, 0, 0);
    particleGroup.add(particle2);
    
    // Connection visualization
    const connectionGroup = new THREE.Group();
    particleGroup.add(connectionGroup);
    
    // Create pulsing connection
    const createConnection = () => {
        // Main connection line
        const connectionGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        connectionGeometry.rotateZ(Math.PI / 2);
        
        const connectionMaterial = new THREE.MeshBasicMaterial({
            color: 0x8338ec,
            transparent: true,
            opacity: 0.7
        });
        
        const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
        connectionGroup.add(connection);
        
        // Energy pulses along connection
        const pulseCount = 5;
        const pulses = [];
        
        for (let i = 0; i < pulseCount; i++) {
            const pulseGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const pulseMaterial = new THREE.MeshBasicMaterial({
                color: 0x8338ec,
                transparent: true,
                opacity: 0.8
            });
            
            const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
            pulse.userData = {
                offset: i / pulseCount,
                speed: 0.02 + Math.random() * 0.01,
                position: Math.random()
            };
            
            connectionGroup.add(pulse);
            pulses.push(pulse);
        }
        
        return { connection, pulses };
    };
    
    const { connection, pulses } = createConnection();
    
    // Particle trails
    class ParticleTrail {
        constructor(color, maxPoints = 50) {
            this.maxPoints = maxPoints;
            this.points = Array(maxPoints).fill(new THREE.Vector3());
            
            this.geometry = new THREE.BufferGeometry();
            this.material = new THREE.LineBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.5
            });
            
            this.line = new THREE.Line(this.geometry, this.material);
            particleGroup.add(this.line);
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
            particleGroup.remove(this.line);
        }
    }
    
    const trail1 = new ParticleTrail(0x3a86ff);
    const trail2 = new ParticleTrail(0xff006e);
    
    // State
    let isConnected = true;
    let movementAmplitude = 1.0;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Particle movement
        if (isConnected) {
            // Synchronized motion when connected
            particle1.position.x = -4 + Math.sin(time * 0.5) * movementAmplitude;
            particle1.position.y = Math.sin(time * 0.7) * movementAmplitude;
            
            particle2.position.x = 4 + Math.sin(time * 0.5) * movementAmplitude;
            particle2.position.y = -Math.sin(time * 0.7) * movementAmplitude; // Mirror motion
        } else {
            // Independent motion when disconnected
            particle1.position.x = -4 + Math.sin(time * 0.8) * movementAmplitude * 0.5;
            particle1.position.y = Math.sin(time * 1.2) * movementAmplitude * 0.3;
            
            particle2.position.x = 4 + Math.sin(time * 0.5) * movementAmplitude * 0.3;
            particle2.position.y = Math.sin(time * 0.9) * movementAmplitude * 0.5;
        }
        
        // Update trails
        trail1.update(particle1.position);
        trail2.update(particle2.position);
        
        // Update connection
        if (isConnected) {
            connectionGroup.visible = true;
            
            // Position and scale connection between particles
            connection.position.copy(particle1.position);
            connection.lookAt(particle2.position);
            
            const distance = particle1.position.distanceTo(particle2.position);
            connection.scale.set(1, 1, distance);
            
            // Update pulse positions
            pulses.forEach(pulse => {
                const data = pulse.userData;
                
                // Calculate position along the connection
                data.position += data.speed;
                if (data.position > 1) data.position = 0;
                
                // Interpolate position between particles
                const t = data.position;
                const x = particle1.position.x * (1 - t) + particle2.position.x * t;
                const y = particle1.position.y * (1 - t) + particle2.position.y * t;
                const z = particle1.position.z * (1 - t) + particle2.position.z * t;
                
                pulse.position.set(x, y, z);
                
                // Pulse effect
                const pulseScale = 0.7 + Math.sin(time * 5 + data.offset * 10) * 0.3;
                pulse.scale.set(pulseScale, pulseScale, pulseScale);
            });
        } else {
            connectionGroup.visible = false;
        }
        
        // Particle glow effect
        const glowIntensity = 0.5 + Math.sin(time * 2) * 0.2;
        particle1Material.emissiveIntensity = glowIntensity;
        particle2Material.emissiveIntensity = glowIntensity;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        connect: function() {
            isConnected = true;
            movementAmplitude = 1.0;
        },
        
        disconnect: function() {
            isConnected = false;
            movementAmplitude = 0.5;
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
        particle1Material.dispose();
        particle2Material.dispose();
        
        connection.geometry.dispose();
        connection.material.dispose();
        
        pulses.forEach(pulse => {
            pulse.geometry.dispose();
            pulse.material.dispose();
        });
        
        trail1.dispose();
        trail2.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

