// animation-wave-function-collapse.js
import { verses } from '/config.js';

export function createWaveFunctionCollapse(localColors, animationContainer, THREE, animationParams) { 
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 3, 5);

    // Create observer
    const observerGeometry = new THREE.ConeGeometry(0.4, 1, 32);
    const observerMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.3
    });

    const fieldMaterial = new THREE.MeshStandardMaterial({
        color: localColors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
    });

    // Create observed point
    const pointGeometry = new THREE.SphereGeometry(0.2);
    const pointMaterial = new THREE.MeshStandardMaterial({
        color: localColors.secondary,
        emissive: localColors.secondary,
        emissiveIntensity: 0.8
    });

    const rayGeometry = new THREE.BufferGeometry();
    const rayMaterial = new THREE.MeshStandardMaterial({
        color: localColors.tertiary,
        emissive: localColors.tertiary,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6
    });

    // Create observer
    const observer = new THREE.Mesh(observerGeometry, observerMaterial);
    observer.position.set(0, 3, 0);
    scene.add(observer);

    // Create field
    const field = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), fieldMaterial);
    scene.add(field);

    // Create observed point
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(0, 0, 0); // Initially at origin
    scene.add(point);

    // Create ray
    const ray = new THREE.Line(rayGeometry, rayMaterial);
    scene.add(ray);

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
    function init() {
        // Add interaction functionality
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[5].interactionHint;
        container.appendChild(interactionHint);
        
        let collapsed = false;
        renderer.domElement.addEventListener('click', () => {
            collapsed = !collapsed;
            field.visible = !collapsed;
            ray.visible = collapsed;
        });
    }

    function animate() {
        // Update observer position slightly to suggest observation
        observer.rotation.y += 0.01;

        // Ray from observer to observed point (can be animated or updated on interaction)
        const observerWorldPosition = new THREE.Vector3();
        observer.getWorldPosition(observerWorldPosition);
        const points = [observerWorldPosition, point.position];
        rayGeometry.setFromPoints(points);
        rayGeometry.needsUpdate = true;

        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
    }

    return { init, animate, cleanup };
}