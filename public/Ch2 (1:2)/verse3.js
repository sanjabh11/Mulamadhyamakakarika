import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse3Animation(container, handleAction) {
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 2, 10);
    
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
    
    // Two entangled particles
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    
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
    particle1.position.set(-3, 0, 0);
    particleGroup.add(particle1);
    
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    particle2.position.set(3, 0, 0);
    particleGroup.add(particle2);
    
    // Connection between particles (entanglement thread)
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionMaterial = new THREE.LineBasicMaterial({ 
        color: 0x8338ec,
        transparent: true,
        opacity: 0.7,
        linewidth: 2
    });
    
    const points = [
        particle1.position,
        particle2.position
    ];
    
    connectionGeometry.setFromPoints(points);
    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
    particleGroup.add(connection);
    
    // Particle trail for motion visualization
    class ParticleTrail {
        constructor(color, maxPoints = 50) {
            this.maxPoints = maxPoints;
            this.points = [];
            
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
            this.points.push(position.clone());
            
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
            
            this.geometry.setFromPoints(this.points);
        }
        
        clear() {
            this.points = [];
            this.geometry.setFromPoints([]);
        }
        
        dispose() {
            this.geometry.dispose();
            this.material.dispose();
            particleGroup.remove(this.line);
        }
    }
    
    const trail1 = new ParticleTrail(0x3a86ff);
    const trail2 = new ParticleTrail(0xff006e);
    
    // Glow effect
    const createGlow = (particle, color) => {
        const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        particle.add(glow);
        
        return glow;
    };
    
    const glow1 = createGlow(particle1, 0x3a86ff);
    const glow2 = createGlow(particle2, 0xff006e);
    
    // State variables
    let isMoving = false;
    let targetPosition = new THREE.Vector3();
    let lastTime = 0;
    let activeParticle = particle1; // The one being directly moved
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        const delta = time - lastTime;
        lastTime = time;
        
        // Basic particle pulsing
        const pulseFactor = Math.sin(time * 2) * 0.1 + 1;
        particle1.scale.set(pulseFactor, pulseFactor, pulseFactor);
        particle2.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        glow1.scale.set(1 + Math.sin(time * 3) * 0.2, 1 + Math.sin(time * 3) * 0.2, 1 + Math.sin(time * 3) * 0.2);
        glow2.scale.set(1 + Math.cos(time * 3) * 0.2, 1 + Math.cos(time * 3) * 0.2, 1 + Math.cos(time * 3) * 0.2);
        
        // Handle movement
        if (isMoving) {
            // Move active particle towards target
            const moveSpeed = 3;
            const direction = new THREE.Vector3().subVectors(targetPosition, activeParticle.position);
            
            if (direction.length() > 0.1) {
                direction.normalize();
                
                // Move active particle
                activeParticle.position.add(direction.multiplyScalar(moveSpeed * delta));
                
                // Update trails
                trail1.update(particle1.position);
                trail2.update(particle2.position);
                
                // Update connection line
                connectionGeometry.setFromPoints([particle1.position, particle2.position]);
                
                // Move the other particle to maintain mirrored position
                if (activeParticle === particle1) {
                    particle2.position.x = -particle1.position.x;
                    particle2.position.y = -particle1.position.y;
                    particle2.position.z = -particle1.position.z;
                } else {
                    particle1.position.x = -particle2.position.x;
                    particle1.position.y = -particle2.position.y;
                    particle1.position.z = -particle2.position.z;
                }
            } else {
                // Reached target
                isMoving = false;
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        moveParticle: function() {
            isMoving = true;
            // Switch active particle
            activeParticle = (activeParticle === particle1) ? particle2 : particle1;
            
            // Random target within bounds
            targetPosition.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            );
        },
        
        resetParticles: function() {
            isMoving = false;
            
            // Reset positions
            particle1.position.set(-3, 0, 0);
            particle2.position.set(3, 0, 0);
            
            // Reset connection
            connectionGeometry.setFromPoints([particle1.position, particle2.position]);
            
            // Clear trails
            trail1.clear();
            trail2.clear();
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
        connectionGeometry.dispose();
        connectionMaterial.dispose();
        
        // Dispose trails
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

