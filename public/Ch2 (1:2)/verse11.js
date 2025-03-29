import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse11Animation(container, handleAction) {
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 20);
    
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
    
    // Create recursive spiral system
    const spiralGroup = new THREE.Group();
    scene.add(spiralGroup);
    
    // Recursive particle system
    class RecursiveParticleSystem {
        constructor(level, maxLevels) {
            this.level = level;
            this.maxLevels = maxLevels;
            this.group = new THREE.Group();
            
            // Create particle for this level
            const size = 0.7 - (level * 0.1);
            const hue = level / maxLevels;
            
            const particleGeometry = new THREE.SphereGeometry(size, 32, 32);
            const particleMaterial = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color().setHSL(hue, 0.8, 0.5),
                emissive: new THREE.Color().setHSL(hue, 0.8, 0.3),
                emissiveIntensity: 0.7,
                transparent: true,
                opacity: 0.9
            });
            
            this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
            this.group.add(this.particle);
            
            // Create trail for this particle
            this.trail = this.createTrail(new THREE.Color().setHSL(hue, 0.8, 0.5));
            
            // Create child systems if not at max level
            this.children = [];
            
            if (level < maxLevels) {
                // Create child recursive system
                const childSystem = new RecursiveParticleSystem(level + 1, maxLevels);
                this.children.push(childSystem);
                this.group.add(childSystem.group);
            }
            
            // Initialize animation parameters
            this.radius = 5 - (level * 0.8);
            this.speed = 0.5 + (level * 0.2);
            this.offset = Math.random() * Math.PI * 2;
        }
        
        createTrail(color) {
            const maxTrailPoints = 50;
            const trailPoints = Array(maxTrailPoints).fill(new THREE.Vector3());
            
            const trailGeometry = new THREE.BufferGeometry();
            trailGeometry.setFromPoints(trailPoints);
            
            const trailMaterial = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.5
            });
            
            const trail = new THREE.Line(trailGeometry, trailMaterial);
            this.group.add(trail);
            
            return {
                points: trailPoints,
                geometry: trailGeometry,
                line: trail
            };
        }
        
        update(time, parentPosition = null) {
            // Calculate position for this level
            const angle = time * this.speed + this.offset;
            
            if (parentPosition) {
                // Position relative to parent
                this.particle.position.x = parentPosition.x + Math.cos(angle) * this.radius;
                this.particle.position.y = parentPosition.y + Math.sin(angle * 1.5) * (this.radius * 0.5);
                this.particle.position.z = parentPosition.z + Math.sin(angle) * this.radius;
            } else {
                // Root position
                this.particle.position.x = Math.cos(angle) * this.radius;
                this.particle.position.y = Math.sin(angle * 1.5) * (this.radius * 0.5);
                this.particle.position.z = Math.sin(angle) * this.radius;
            }
            
            // Update trail
            for (let i = this.trail.points.length - 1; i > 0; i--) {
                this.trail.points[i].copy(this.trail.points[i-1]);
            }
            this.trail.points[0].copy(this.particle.position);
            this.trail.geometry.setFromPoints(this.trail.points);
            
            // Update children
            this.children.forEach(child => {
                child.update(time, this.particle.position);
            });
        }
        
        dispose() {
            this.particle.geometry.dispose();
            this.particle.material.dispose();
            this.trail.geometry.dispose();
            this.trail.line.material.dispose();
            
            this.children.forEach(child => {
                child.dispose();
            });
        }
    }
    
    // Create root recursive system
    let recursionLevels = 1;
    let particleSystem = new RecursiveParticleSystem(0, recursionLevels);
    spiralGroup.add(particleSystem.group);
    
    // Create reference sphere to show the motion scale
    const referenceGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const referenceMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    
    const reference = new THREE.Mesh(referenceGeometry, referenceMaterial);
    spiralGroup.add(reference);
    
    // Create a guide for the overall motion path
    const guideGeometry = new THREE.TorusGeometry(5, 0.05, 16, 100);
    const guideMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.2
    });
    
    const guide = new THREE.Mesh(guideGeometry, guideMaterial);
    guide.rotation.x = Math.PI / 2;
    spiralGroup.add(guide);
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update particle system
        particleSystem.update(time);
        
        // Gently rotate the entire spiral system
        spiralGroup.rotation.y = time * 0.1;
        
        // Pulse the reference point
        const pulseFactor = 0.8 + Math.sin(time * 3) * 0.2;
        reference.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Helper function to recreate particle system with new recursion level
    function recreateParticleSystem(levels) {
        // Remove old system
        spiralGroup.remove(particleSystem.group);
        particleSystem.dispose();
        
        // Create new system
        recursionLevels = levels;
        particleSystem = new RecursiveParticleSystem(0, recursionLevels);
        spiralGroup.add(particleSystem.group);
    }
    
    // Actions
    const actions = {
        recursionLevel: function(value) {
            // Value will be an integer 1-5
            if (value !== recursionLevels) {
                recreateParticleSystem(value);
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
        
        // Dispose recursive particle system
        particleSystem.dispose();
        
        // Dispose other geometries
        referenceGeometry.dispose();
        referenceMaterial.dispose();
        guideGeometry.dispose();
        guideMaterial.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

