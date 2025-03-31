import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse8(container, controlsContainer) {
    let scene, camera, renderer;
    let entangledParticlesA, entangledParticlesB, continuumMesh;
    let seed, sprout, fruit;
    const clock = new THREE.Clock();
    
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create seed
    const seedGeometry = new THREE.SphereGeometry(2, 32, 32);
    const seedMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent1),
        emissive: new THREE.Color(colors.accent1),
        emissiveIntensity: 0.3,
        shininess: 30
    });
    
    seed = new THREE.Mesh(seedGeometry, seedMaterial);
    seed.position.set(-15, -5, 0);
    scene.add(seed);
    
    // Create seed label
    const seedLabel = document.createElement('div');
    seedLabel.className = 'entity-label';
    seedLabel.textContent = 'Seed';
    seedLabel.style.position = 'absolute';
    seedLabel.style.color = '#ffffff';
    seedLabel.style.padding = '5px';
    seedLabel.style.background = `rgba(${new THREE.Color(colors.accent1).r * 255}, ${new THREE.Color(colors.accent1).g * 255}, ${new THREE.Color(colors.accent1).b * 255}, 0.7)`;
    seedLabel.style.borderRadius = '5px';
    seedLabel.style.fontSize = '12px';
    seedLabel.style.pointerEvents = 'none';
    container.appendChild(seedLabel);
    
    // Create sprout
    const sproutGeometry = new THREE.Group();
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.5, 0.8, 6, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({
        color: 0x229944,
        emissive: 0x113322,
        shininess: 30
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 3;
    sproutGeometry.add(stem);
    
    // Leaves
    const leafGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    leafGeometry.scale(1, 0.3, 1);
    
    const leafMaterial = new THREE.MeshPhongMaterial({
        color: 0x44bb44,
        emissive: 0x224422,
        shininess: 30
    });
    
    for (let i = 0; i < 2; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(i === 0 ? 1.5 : -1.5, 4.5, 0);
        leaf.rotation.z = i === 0 ? -Math.PI / 4 : Math.PI / 4;
        sproutGeometry.add(leaf);
    }
    
    sprout = sproutGeometry;
    sprout.position.set(0, -2, 0);
    scene.add(sprout);
    
    // Create sprout label
    const sproutLabel = document.createElement('div');
    sproutLabel.className = 'entity-label';
    sproutLabel.textContent = 'Continuum';
    sproutLabel.style.position = 'absolute';
    sproutLabel.style.color = '#ffffff';
    sproutLabel.style.padding = '5px';
    sproutLabel.style.background = 'rgba(68, 187, 68, 0.7)';
    sproutLabel.style.borderRadius = '5px';
    sproutLabel.style.fontSize = '12px';
    sproutLabel.style.pointerEvents = 'none';
    container.appendChild(sproutLabel);
    
    // Create fruit
    const fruitGeometry = new THREE.DodecahedronGeometry(2.5, 1);
    const fruitMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent4),
        emissive: new THREE.Color(colors.accent4),
        emissiveIntensity: 0.3,
        shininess: 50
    });
    
    fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
    fruit.position.set(15, 5, 0);
    scene.add(fruit);
    
    // Create fruit label
    const fruitLabel = document.createElement('div');
    fruitLabel.className = 'entity-label';
    fruitLabel.textContent = 'Fruit';
    fruitLabel.style.position = 'absolute';
    fruitLabel.style.color = '#ffffff';
    fruitLabel.style.padding = '5px';
    fruitLabel.style.background = `rgba(${new THREE.Color(colors.accent4).r * 255}, ${new THREE.Color(colors.accent4).g * 255}, ${new THREE.Color(colors.accent4).b * 255}, 0.7)`;
    fruitLabel.style.borderRadius = '5px';
    fruitLabel.style.fontSize = '12px';
    fruitLabel.style.pointerEvents = 'none';
    container.appendChild(fruitLabel);
    
    // Create entangled particles for seed and fruit
    const particleCount = 500;
    
    // Create particle system A (around seed)
    const particleGeometryA = new THREE.BufferGeometry();
    const positionsA = new Float32Array(particleCount * 3);
    const colorsA = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create particles around the seed
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 3 + Math.random() * 1;
        
        positionsA[i3] = seed.position.x + radius * Math.sin(phi) * Math.cos(theta);
        positionsA[i3 + 1] = seed.position.y + radius * Math.sin(phi) * Math.sin(theta);
        positionsA[i3 + 2] = seed.position.z + radius * Math.cos(phi);
        
        // Gradient from seed color to intermediate color
        const t = Math.random();
        const seedColor = new THREE.Color(colors.accent1);
        const midColor = new THREE.Color(0x88cc88);  // Green intermediate
        const color = new THREE.Color().lerpColors(seedColor, midColor, t);
        
        colorsA[i3] = color.r;
        colorsA[i3 + 1] = color.g;
        colorsA[i3 + 2] = color.b;
    }
    
    particleGeometryA.setAttribute('position', new THREE.BufferAttribute(positionsA, 3));
    particleGeometryA.setAttribute('color', new THREE.BufferAttribute(colorsA, 3));
    
    const particleMaterialA = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    entangledParticlesA = new THREE.Points(particleGeometryA, particleMaterialA);
    scene.add(entangledParticlesA);
    
    // Create particle system B (around fruit)
    const particleGeometryB = new THREE.BufferGeometry();
    const positionsB = new Float32Array(particleCount * 3);
    const colorsB = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create particles around the fruit
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 3 + Math.random() * 1;
        
        positionsB[i3] = fruit.position.x + radius * Math.sin(phi) * Math.cos(theta);
        positionsB[i3 + 1] = fruit.position.y + radius * Math.sin(phi) * Math.sin(theta);
        positionsB[i3 + 2] = fruit.position.z + radius * Math.cos(phi);
        
        // Gradient from fruit color to intermediate color
        const t = Math.random();
        const fruitColor = new THREE.Color(colors.accent4);
        const midColor = new THREE.Color(0x88cc88);  // Green intermediate
        const color = new THREE.Color().lerpColors(midColor, fruitColor, t);
        
        colorsB[i3] = color.r;
        colorsB[i3 + 1] = color.g;
        colorsB[i3 + 2] = color.b;
    }
    
    particleGeometryB.setAttribute('position', new THREE.BufferAttribute(positionsB, 3));
    particleGeometryB.setAttribute('color', new THREE.BufferAttribute(colorsB, 3));
    
    const particleMaterialB = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    entangledParticlesB = new THREE.Points(particleGeometryB, particleMaterialB);
    scene.add(entangledParticlesB);
    
    // Create continuum mesh connecting seed to fruit
    const continuumGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(seed.position.x, seed.position.y, seed.position.z),
            new THREE.Vector3(seed.position.x + 5, seed.position.y + 2, seed.position.z),
            new THREE.Vector3(sprout.position.x, sprout.position.y, sprout.position.z),
            new THREE.Vector3(fruit.position.x - 5, fruit.position.y - 2, fruit.position.z),
            new THREE.Vector3(fruit.position.x, fruit.position.y, fruit.position.z)
        ]),
        64,   // tubular segments
        0.5,  // radius
        8,    // radial segments
        false // closed
    );
    
    const continuumMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            colorStart: { value: new THREE.Color(colors.accent1) },
            colorMid: { value: new THREE.Color(0x44bb44) },
            colorEnd: { value: new THREE.Color(colors.accent4) }
        },
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                
                // Add subtle movement to the continuum
                vec3 pos = position;
                float wave = sin(pos.x * 0.2 + time) * cos(pos.z * 0.2 + time) * 0.5;
                pos.y += wave;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 colorStart;
            uniform vec3 colorMid;
            uniform vec3 colorEnd;
            varying vec2 vUv;
            
            void main() {
                // Color gradient along the continuum
                vec3 color;
                
                if(vUv.x < 0.5) {
                    color = mix(colorStart, colorMid, vUv.x * 2.0);
                } else {
                    color = mix(colorMid, colorEnd, (vUv.x - 0.5) * 2.0);
                }
                
                // Add pulse effect
                float pulse = 0.8 + 0.2 * sin(time * 2.0 + vUv.x * 10.0);
                color *= pulse;
                
                // Add energy flow effect
                float flow = 0.5 + 0.5 * sin(time * 3.0 + vUv.x * 20.0);
                color += flow * 0.1;
                
                gl_FragColor = vec4(color, 0.7);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    continuumMesh = new THREE.Mesh(continuumGeometry, continuumMaterial);
    scene.add(continuumMesh);
    
    // Create entanglement visualization (lines connecting particles)
    const entanglementGeometry = new THREE.BufferGeometry();
    const entanglementPositions = new Float32Array(particleCount * 2 * 3); // Two points per line
    
    for (let i = 0; i < particleCount; i++) {
        const i6 = i * 6; // 6 values per line (3 for start, 3 for end)
        const i3 = i * 3; // 3 values per point
        
        // Start point (from particle system A)
        entanglementPositions[i6] = positionsA[i3];
        entanglementPositions[i6 + 1] = positionsA[i3 + 1];
        entanglementPositions[i6 + 2] = positionsA[i3 + 2];
        
        // End point (from particle system B, but don't connect directly)
        // Instead, we'll animate these connections
        entanglementPositions[i6 + 3] = positionsA[i3];
        entanglementPositions[i6 + 4] = positionsA[i3 + 1];
        entanglementPositions[i6 + 5] = positionsA[i3 + 2];
    }
    
    entanglementGeometry.setAttribute('position', new THREE.BufferAttribute(entanglementPositions, 3));
    
    const entanglementMaterial = new THREE.LineBasicMaterial({
        color: 0x88cc88,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    const entanglementLines = new THREE.LineSegments(entanglementGeometry, entanglementMaterial);
    scene.add(entanglementLines);
    
    // Add controls
    const entanglementStrengthSlider = document.createElement('div');
    entanglementStrengthSlider.className = 'slider-container';
    entanglementStrengthSlider.innerHTML = `
        <label for="entanglement-strength">Entanglement:</label>
        <input type="range" id="entanglement-strength" min="0" max="1" step="0.1" value="0.5">
    `;
    controlsContainer.appendChild(entanglementStrengthSlider);
    
    const flowSpeedSlider = document.createElement('div');
    flowSpeedSlider.className = 'slider-container';
    flowSpeedSlider.innerHTML = `
        <label for="flow-speed">Flow Speed:</label>
        <input type="range" id="flow-speed" min="0.1" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(flowSpeedSlider);
    
    const rotateButton = document.createElement('button');
    rotateButton.textContent = 'Rotate View';
    rotateButton.addEventListener('click', () => {
        isRotating = !isRotating;
        rotateButton.textContent = isRotating ? 'Stop Rotation' : 'Rotate View';
    });
    controlsContainer.appendChild(rotateButton);
    
    // Animation variables
    let entanglementStrength = 0.5;
    let flowSpeed = 1;
    let isRotating = false;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Update continuum shader
        continuumMesh.material.uniforms.time.value = time * flowSpeed;
        
        // Animate seed
        seed.rotation.y = time * 0.3;
        const seedPulse = 1 + Math.sin(time * 1.5) * 0.1;
        seed.scale.set(seedPulse, seedPulse, seedPulse);
        
        // Animate sprout
        sprout.rotation.y = time * 0.2;
        const sproutPulse = 1 + Math.sin(time * 1.2) * 0.1;
        sprout.scale.set(sproutPulse, sproutPulse, sproutPulse);
        
        // Animate fruit
        fruit.rotation.y = time * 0.4;
        const fruitPulse = 1 + Math.sin(time * 1.7) * 0.1;
        fruit.scale.set(fruitPulse, fruitPulse, fruitPulse);
        
        // Animate particles around seed
        const positionsA = entangledParticlesA.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Get current position
            const x = positionsA[i3] - seed.position.x;
            const y = positionsA[i3 + 1] - seed.position.y;
            const z = positionsA[i3 + 2] - seed.position.z;
            
            // Calculate distance from center
            const dist = Math.sqrt(x*x + y*y + z*z);
            
            // Orbital rotation
            const speed = (1 / dist) * flowSpeed;
            const theta = Math.atan2(z, x) + speed * 0.05;
            
            // Update position
            positionsA[i3] = seed.position.x + dist * Math.cos(theta);
            positionsA[i3 + 2] = seed.position.z + dist * Math.sin(theta);
            positionsA[i3 + 1] = seed.position.y + y + Math.sin(time + i * 0.1) * 0.05;
        }
        entangledParticlesA.geometry.attributes.position.needsUpdate = true;
        
        // Animate particles around fruit
        const positionsB = entangledParticlesB.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Get current position
            const x = positionsB[i3] - fruit.position.x;
            const y = positionsB[i3 + 1] - fruit.position.y;
            const z = positionsB[i3 + 2] - fruit.position.z;
            
            // Calculate distance from center
            const dist = Math.sqrt(x*x + y*y + z*z);
            
            // Orbital rotation
            const speed = (1 / dist) * flowSpeed;
            const theta = Math.atan2(z, x) - speed * 0.05; // Opposite direction
            
            // Update position
            positionsB[i3] = fruit.position.x + dist * Math.cos(theta);
            positionsB[i3 + 2] = fruit.position.z + dist * Math.sin(theta);
            positionsB[i3 + 1] = fruit.position.y + y + Math.sin(time + i * 0.1) * 0.05;
        }
        entangledParticlesB.geometry.attributes.position.needsUpdate = true;
        
        // Update entanglement lines
        const linePositions = entanglementLines.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i6 = i * 6;
            const i3A = i * 3;
            
            // Pick a random particle from B for entanglement
            const i3B = Math.floor(Math.random() * particleCount) * 3;
            
            // Start point (from A)
            linePositions[i6] = positionsA[i3A];
            linePositions[i6 + 1] = positionsA[i3A + 1];
            linePositions[i6 + 2] = positionsA[i3A + 2];
            
            // End point (from B, but only connect some based on entanglement strength)
            if (Math.random() < entanglementStrength) {
                // Connect to B
                linePositions[i6 + 3] = positionsB[i3B];
                linePositions[i6 + 4] = positionsB[i3B + 1];
                linePositions[i6 + 5] = positionsB[i3B + 2];
            } else {
                // Keep disconnected
                linePositions[i6 + 3] = positionsA[i3A];
                linePositions[i6 + 4] = positionsA[i3A + 1];
                linePositions[i6 + 5] = positionsA[i3A + 2];
            }
        }
        entanglementLines.geometry.attributes.position.needsUpdate = true;
        entanglementLines.material.opacity = 0.2 * entanglementStrength;
        
        // Update entanglement line material
        entanglementLines.material.color.setHSL(
            0.3, // green hue
            0.8,
            0.5 + 0.2 * Math.sin(time * 2)
        );
        
        // Rotate camera if enabled
        if (isRotating) {
            camera.position.x = Math.sin(time * 0.2) * 35;
            camera.position.z = Math.cos(time * 0.2) * 35;
            camera.lookAt(0, 0, 0);
        }
        
        // Update labels
        updateLabel(seedLabel, seed);
        updateLabel(sproutLabel, sprout);
        updateLabel(fruitLabel, fruit);
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    function updateLabel(label, object) {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(object.matrixWorld);
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
        
        label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Setup event listeners
    window.addEventListener('resize', onResize);
    
    document.getElementById('entanglement-strength').addEventListener('input', (e) => {
        entanglementStrength = parseFloat(e.target.value);
    });
    
    document.getElementById('flow-speed').addEventListener('input', (e) => {
        flowSpeed = parseFloat(e.target.value);
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return {
        cleanup: function() {
            window.removeEventListener('resize', onResize);
            seedLabel.remove();
            sproutLabel.remove();
            fruitLabel.remove();
            cancelAnimationFrame(animate);
            renderer.dispose();
        },
        resize: onResize
    };
}

