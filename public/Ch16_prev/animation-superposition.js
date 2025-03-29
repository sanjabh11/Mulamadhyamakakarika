// animation-superposition.js
import { verses } from '/config.js';

export function createSuperposition(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Create particle
    const particleGeometry = new THREE.SphereGeometry(0.3);
    const particleMaterial = new THREE.MeshStandardMaterial({
        color: localColors.primary,
        emissive: localColors.primary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);

    const stateGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);

    const boundStateMaterial = new THREE.MeshStandardMaterial({
        color: localColors.secondary,
        transparent: true,
        opacity: 0.8
    });

    const freeStateMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        transparent: true,
        opacity: 0.8
    });

    // Create bound state ring
    const boundState = new THREE.Mesh(stateGeometry, boundStateMaterial);
    boundState.rotation.x = Math.PI / 2;
    scene.add(boundState);

    // Create free state ring
    const freeState = new THREE.Mesh(stateGeometry, freeStateMaterial);
    freeState.rotation.x = Math.PI / 4;
    freeState.rotation.y = Math.PI / 4;
    scene.add(freeState);

    // Create probability waves
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ color: localColors.primary });

    const points = [];
    for (let i = -2.5; i <= 2.5; i += 0.1) {
    }

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

    // Animation states and initial setup
    let time = 0;

    function init() {
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[4].interactionHint;
        container.appendChild(interactionHint);
        
        let collapsed = false;
        renderer.domElement.addEventListener('click', () => {
            collapsed = !collapsed;
            boundState.visible = !collapsed;
            freeState.visible = !collapsed;
            particle.scale.setScalar(collapsed ? 2 : 1);
        });
    }

    function animate() {
        time += 0.01;

        // Particle hovering animation in superposition
        particle.position.y = Math.sin(time) * 0.2; 
        
        // State rings animation
        boundState.rotation.z += 0.01;
        freeState.rotation.z += 0.01;

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup };
}