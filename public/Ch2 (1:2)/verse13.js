import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse13Animation(container, handleAction) {
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
    
    // Particle
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
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
    
    // Create symmetric path
    const createPath = () => {
        const points = [];
        const pathPoints = 200;
        
        for (let i = 0; i < pathPoints; i++) {
            const t = i / (pathPoints - 1);
            const angle = t * Math.PI * 4;
            
            const x = Math.cos(angle) * 5;
            const y = Math.sin(angle * 2) * 2;
            const z = Math.sin(angle) * 5;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        return points;
    };
    
    const pathPoints = createPath();
    
    // Visible path
    const forwardPathGeometry = new THREE.BufferGeometry();
    const forwardPathMaterial = new THREE.LineBasicMaterial({
        color: 0x3a86ff,
        transparent: true,
        opacity: 0.5
    });
    
    forwardPathGeometry.setFromPoints(pathPoints);
    const forwardPath = new THREE.Line(forwardPathGeometry, forwardPathMaterial);
    particleGroup.add(forwardPath);
    
    // Mirror path for reverse direction
    const reversePathGeometry = new THREE.BufferGeometry();
    const reversePathMaterial = new THREE.LineBasicMaterial({
        color: 0xff006e,
        transparent: true,
        opacity: 0.1
    });
    
    reversePathGeometry.setFromPoints([...pathPoints].reverse());
    const reversePath = new THREE.Line(reversePathGeometry, reversePathMaterial);
    reversePath.visible = false;
    particleGroup.add(reversePath);
    
    // Create time direction indicators
    const arrowHeight = 1;
    const arrowRadius = 0.5;
    
    const forwardArrowGeometry = new THREE.ConeGeometry(arrowRadius, arrowHeight, 16);
    const forwardArrowMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.5
    });
    
    const forwardArrow = new THREE.Mesh(forwardArrowGeometry, forwardArrowMaterial);
    forwardArrow.position.set(0, 3, -6);
    forwardArrow.rotation.x = -Math.PI / 2;
    scene.add(forwardArrow);
    
    const reverseArrowGeometry = new THREE.ConeGeometry(arrowRadius, arrowHeight, 16);
    const reverseArrowMaterial = new THREE.MeshPhongMaterial({
        color: 0xff006e,
        emissive: 0xff006e,
        emissiveIntensity: 0.5
    });
    
    const reverseArrow = new THREE.Mesh(reverseArrowGeometry, reverseArrowMaterial);
    reverseArrow.position.set(0, 3, -6);
    reverseArrow.rotation.x = Math.PI / 2;
    reverseArrow.visible = false;
    scene.add(reverseArrow);
    
    // Time symmetry visualization
    const timeSymmetryGroup = new THREE.Group();
    scene.add(timeSymmetryGroup);
    
    // Create a plane to represent the point of symmetry
    const symmetryPlaneGeometry = new THREE.PlaneGeometry(15, 15);
    const symmetryPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    
    const symmetryPlane = new THREE.Mesh(symmetryPlaneGeometry, symmetryPlaneMaterial);
    symmetryPlane.rotation.x = Math.PI / 2;
    timeSymmetryGroup.add(symmetryPlane);
    
    // Create grid pattern on the symmetry plane
    const gridSize = 10;
    const gridDivisions = 10;
    const gridGeometry = new THREE.BufferGeometry();
    const gridPoints = [];
    
    // Add horizontal lines
    for (let i = 0; i <= gridDivisions; i++) {
        const y = (i / gridDivisions - 0.5) * gridSize;
        gridPoints.push(
            new THREE.Vector3(-gridSize/2, 0, y),
            new THREE.Vector3(gridSize/2, 0, y)
        );
    }
    
    // Add vertical lines
    for (let i = 0; i <= gridDivisions; i++) {
        const x = (i / gridDivisions - 0.5) * gridSize;
        gridPoints.push(
            new THREE.Vector3(x, 0, -gridSize/2),
            new THREE.Vector3(x, 0, gridSize/2)
        );
    }
    
    gridGeometry.setFromPoints(gridPoints);
    
    const gridMaterial = new THREE.LineBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.2
    });
    
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    symmetryPlane.add(grid);
    
    // State
    let pathProgress = 0;
    const forwardSpeed = 0.003;
    const reverseSpeed = -0.003;
    let currentSpeed = forwardSpeed;
    let isForward = true;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update path progress
        pathProgress += currentSpeed;
        
        // Handle looping or reversing at endpoints
        if (pathProgress >= 1) pathProgress = 0;
        if (pathProgress < 0) pathProgress = 0.999;
        
        // Calculate particle position on path
        const pathIndex = Math.floor(pathProgress * (pathPoints.length - 1));
        particle.position.copy(pathPoints[pathIndex]);
        
        // Visual effects
        const pulseFactor = 0.8 + Math.sin(time * 3) * 0.2;
        particle.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        particle.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
        
        // Rotate time symmetry plane
        timeSymmetryGroup.rotation.y = time * 0.1;
        
        // Pulse arrows
        forwardArrow.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
        reverseArrow.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
        
        // Update path opacities
        if (isForward) {
            forwardPathMaterial.opacity = 0.5;
            reversePathMaterial.opacity = 0.1;
        } else {
            forwardPathMaterial.opacity = 0.1;
            reversePathMaterial.opacity = 0.5;
        }
        
        // Pulse symmetry plane
        symmetryPlaneMaterial.opacity = 0.05 + Math.sin(time * 0.5) * 0.03;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Actions
    const actions = {
        reverseTime: function() {
            isForward = false;
            currentSpeed = reverseSpeed;
            
            // Update visuals
            forwardArrow.visible = false;
            reverseArrow.visible = true;
            
            forwardPath.visible = true;
            reversePath.visible = true;
            
            // Change particle color
            particle.material.color.set(0xff006e);
            particle.material.emissive.set(0xff006e);
        },
        
        forwardTime: function() {
            isForward = true;
            currentSpeed = forwardSpeed;
            
            // Update visuals
            forwardArrow.visible = true;
            reverseArrow.visible = false;
            
            forwardPath.visible = true;
            reversePath.visible = true;
            
            // Change particle color
            particle.material.color.set(0x3a86ff);
            particle.material.emissive.set(0x3a86ff);
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
        
        forwardPathGeometry.dispose();
        forwardPathMaterial.dispose();
        reversePathGeometry.dispose();
        reversePathMaterial.dispose();
        
        forwardArrowGeometry.dispose();
        forwardArrowMaterial.dispose();
        reverseArrowGeometry.dispose();
        reverseArrowMaterial.dispose();
        
        symmetryPlaneGeometry.dispose();
        symmetryPlaneMaterial.dispose();
        gridGeometry.dispose();
        gridMaterial.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}

