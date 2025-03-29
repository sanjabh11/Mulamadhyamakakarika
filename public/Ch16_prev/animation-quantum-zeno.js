// animation-quantum-zeno.js
import { verses } from '/config.js';

export function createQuantumZeno(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Create pot and water (for the "watching pot never boils" metaphor)
    const potGeometry = new THREE.CylinderGeometry(1, 0.8, 0.8, 32);
    const potMaterial = new THREE.MeshStandardMaterial({
        color: localColors.secondary,
        metalness: 0.8,
        roughness: 0.2
    });

    // Create pot
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    scene.add(pot);

    // Create pot top
    const potTopGeometry = new THREE.RingGeometry(0.8, 1, 32);
    const potTopMaterial = new THREE.MeshStandardMaterial({
        color: localColors.secondary,
        metalness: 0.8,
        roughness: 0.2,
        side: THREE.DoubleSide
    });

    // Create pot top
    const potTop = new THREE.Mesh(potTopGeometry, potTopMaterial);
    potTop.position.y = 0.4;
    pot.add(potTop);

    // Create water surface
    const waterGeometry = new THREE.CircleGeometry(0.8, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: localColors.primary,
        transparent: true,
        opacity: 0.8
    });

    // Create water surface
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = 0.1;
    pot.add(water);

    const particleCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: localColors.tertiary,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
    });

    const irisGeometry = new THREE.SphereGeometry(0.2);
    const irisMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.5
    });

    // Create iris
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    iris.position.set(0, 0.6, 0);
    pot.add(iris);

    // Particles for water surface
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    pot.add(particles);

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
    let freezeCounter = 0;

    function init() {
        // Initialize particle positions
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.8;
            positions[i * 3 + 1] = 0.2 + Math.random() * 0.1;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[8].interactionHint;
        container.appendChild(interactionHint);
        
        renderer.domElement.addEventListener('click', () => {
            freezeCounter += 20; // Freeze for 20 animation frames
            iris.scale.setScalar(1.5);
            setTimeout(() => iris.scale.setScalar(1), 200);
        });
    }

    function animate() {
        time += 0.01;

        // Iris animation - subtle pulsing
        iris.scale.setScalar(1 + 0.05 * Math.sin(time * 2));
        iris.material.emissiveIntensity = 0.5 + 0.3 * Math.sin(time * 2);
        
        // Only animate particles if not frozen by measurement
        if (freezeCounter <= 0) {
            // Animate particles to simulate boiling
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += Math.random() * 0.01 - 0.005;
                positions[i * 3 + 1] = Math.max(0.1, Math.min(0.4, positions[i * 3 + 1]));
            }
            particlesGeometry.attributes.position.needsUpdate = true;
        } else {
            freezeCounter--;
        }

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup };
}