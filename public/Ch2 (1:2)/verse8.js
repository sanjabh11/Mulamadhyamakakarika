import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse8Animation(container, handleAction) {
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
    
    // Morphing particle setup
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Mover form (sphere)
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    
    // Non-mover form (cube)
    const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    
    // Morphing particle mesh
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    
    // Create morph target
    const morphMesh = new THREE.Mesh(sphereGeometry, particleMaterial);
    particleGroup.add(morphMesh);
    
    // Setup morphing targets
    morphMesh.geometry.morphAttributes.position = [];
    
    // Helper function to convert vertices from one geometry to another for morphing
    function createMorphTarget(fromGeometry, toGeometry) {
        // Ensure both geometries have the same number of vertices
        if (fromGeometry.attributes.position.count !== toGeometry.attributes.position.count) {
            console.error("Geometries must have the same number of vertices for morphing");
            return null;
        }
        
        // Create morph target array
        const morphPositions = [];
        const fromPositions = fromGeometry.attributes.position.array;
        const toPositions = toGeometry.attributes.position.array;
        
        for (let i = 0; i < fromPositions.length; i += 3) {
            // Calculate the position differences for morphing
            const x = toPositions[i] - fromPositions[i];
            const y = toPositions[i + 1] - fromPositions[i + 1];
            const z = toPositions[i + 2] - fromPositions[i + 2];
            
            morphPositions.push(x, y, z);
        }
        
        // Create the morph attribute
        const morphAttribute = new THREE.Float32BufferAttribute(morphPositions, 3);
        return morphAttribute;
    }
    
    // Since we can't directly morph between different geometries with different vertex counts,
    // we'll fake it using an undefined, fluid state
    
    // Misty effect around the particle
    const mistGeometry = new THREE.SphereGeometry(4, 32, 32);
    const mistMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        wireframe: true
    });
    
    const mist = new THREE.Mesh(mistGeometry, mistMaterial);
    particleGroup.add(mist);
    
    // Create particles that orbit the main form to represent superposition
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const smallParticleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const smallParticleMaterial = new THREE.MeshPhongMaterial({
            color: 0xff006e,
            emissive: 0xff006e,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        
        const smallParticle = new THREE.Mesh(smallParticleGeometry, smallParticleMaterial);
        smallParticle.userData = {
            angle: Math.random() * Math.PI * 2,
            radius: 3 + Math.random() * 2,
            speed: 0.01 + Math.random() * 0.02,
            height: (Math.random() - 0.5) * 2
        };
        
        particleGroup.add(smallParticle);
        particles.push(smallParticle);
    }
    
    // State
    let morphState = 0.5; // 0 = cube (non-mover), 1 = sphere (mover)
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update morphing state - we'll approximate it by manipulating the object
        if (morphState < 0.5) {
            // More cube-like
            const scale = 1 + (0.5 - morphState) * 0.5;
            morphMesh.scale.set(scale, scale, scale);
            
            // Make edges sharper for cube-like appearance
            const edgeFactor = 1 - morphState * 2;
            morphMesh.material.wireframe = true;
            morphMesh.material.opacity = 0.7 - edgeFactor * 0.3;
            
            // Change color towards red (non-mover)
            morphMesh.material.color.setRGB(
                0.3 + edgeFactor * 0.7,
                0.2 + (1 - edgeFactor) * 0.3,
                edgeFactor * 0.3 + 0.3
            );
            morphMesh.material.emissive.copy(morphMesh.material.color);
            
        } else {
            // More sphere-like
            const scale = 1 + (morphState - 0.5) * 0.2;
            morphMesh.scale.set(scale, scale, scale);
            
            // Make smoother for sphere-like appearance
            const sphereFactor = (morphState - 0.5) * 2;
            morphMesh.material.wireframe = sphereFactor < 0.5;
            morphMesh.material.opacity = 0.7 + sphereFactor * 0.3;
            
            // Change color towards blue (mover)
            morphMesh.material.color.setRGB(
                0.2 + (1 - sphereFactor) * 0.2,
                0.3 + sphereFactor * 0.3,
                0.6 + sphereFactor * 0.4
            );
            morphMesh.material.emissive.copy(morphMesh.material.color);
        }
        
        // Gentle rotation
        morphMesh.rotation.x = time * 0.2;
        morphMesh.rotation.y = time * 0.3;
        
        // Update mist effect
        mist.scale.set(
            1 + Math.sin(time) * 0.1,
            1 + Math.sin(time * 1.3) * 0.1,
            1 + Math.sin(time * 0.7) * 0.1
        );
        
        mist.material.opacity = 0.15 + Math.sin(time * 0.5) * 0.05;
        
        // Update orbiting particles
        particles.forEach(particle => {
            const data = particle.userData;
            
            // Update angle based on speed
            data.angle += data.speed * (1 + morphState); // Move faster when more mover-like
            
            // Calculate position
            particle.position.x = Math.cos(data.angle) * data.radius;
            particle.position.y = data.height + Math.sin(time + data.angle) * (morphState * 2);
            particle.position.z = Math.sin(data.angle) * data.radius;
            
            // Update opacity based on morph state
            particle.material.opacity = 0.3 + morphState * 0.7;
            
            // Scale based on morph state
            const particleScale = 0.5 + morphState * 0.5;
            particle.scale.set(particleScale, particleScale, particleScale);
        });
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        morphState: function(value) {
            morphState = value;
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
        sphereGeometry.dispose();
        cubeGeometry.dispose();
        particleMaterial.dispose();
        mistGeometry.dispose();
        mistMaterial.dispose();
        
        particles.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
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

