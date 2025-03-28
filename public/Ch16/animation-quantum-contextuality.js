// animation-quantum-contextuality.js
import * as THREE from 'three';
import { verses, colorThemes } from '/config.js';

// Animation 10: Quantum Contextuality
export function createQuantumContextuality(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Create prism (representing contextuality)
    const prismGeometry = new THREE.ConeGeometry(1, 2, 3);
    const prismMaterial = new THREE.MeshPhysicalMaterial({
        color: localColors.secondary,
        transparent: true,
        opacity: 0.6,
        transmission: 0.5,
    });

    // Create spin particle
    const particleGeometry = new THREE.SphereGeometry(0.2);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.5
    });

    // Create prism
    const prism = new THREE.Mesh(prismGeometry, prismMaterial);
    scene.add(prism);

    // Create spin particle
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(0, 0, 0); // Center of prism
    scene.add(particle);

    // Create coordinate axes
    const axisLength = 1.5;
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(axisLength, 0, 0)
    ]);
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, axisLength, 0)
    ]);
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, axisLength)
    ]);

    const xAxis = new THREE.Line(xAxisGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    const yAxis = new THREE.Line(yAxisGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    const zAxis = new THREE.Line(zAxisGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Animation logic
    let time = 0;

    function init() {
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[9].interactionHint;
        container.appendChild(interactionHint);
        
        // Measure spin in different directions on click
        renderer.domElement.addEventListener('click', (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Determine which axis was clicked based on position
            if (Math.abs(x) > Math.abs(y)) {
                // X-axis measurement
                particleMaterial.color.set(0xff0000);
            } else {
                // Y-axis measurement
                particleMaterial.color.set(0x00ff00);
            }
            
            // Highlight effect
            particle.scale.setScalar(1.5);
            setTimeout(() => particle.scale.setScalar(1), 300);
        });
    }

    function animate() {
        time += 0.01;

        // Prism rotation to show different contexts
        prism.rotation.y += 0.01;
        prism.rotation.x += 0.005;

        // Particle subtle animation
        particle.rotation.y = time;
        particle.position.y = Math.sin(time) * 0.1;

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup, scene, camera, renderer };
}