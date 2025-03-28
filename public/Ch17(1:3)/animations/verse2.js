import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse2(container, controlsContainer) {
    let scene, camera, renderer;
    let intentionSphere, measurementObjects = [];
    let currentMeasurement = 0;
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
    
    // Create intention sphere (representation of mind)
    const intentionGeometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Shader material for glowing effect
    const intentionMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(colors.accent3) },
            color2: { value: new THREE.Color(colors.accent2) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
                float pulse = 0.5 + 0.5 * sin(time * 2.0);
                
                // Calculate a pattern based on position and time
                float pattern = 0.5 + 0.5 * sin(vUv.y * 20.0 + time) * sin(vUv.x * 20.0 + time);
                
                // Mix colors based on pattern and pulse
                vec3 finalColor = mix(color1, color2, pattern * pulse);
                
                // Add rim lighting effect
                float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
                rim = pow(rim, 3.0);
                
                finalColor += rim * 0.5 * vec3(1.0);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    
    intentionSphere = new THREE.Mesh(intentionGeometry, intentionMaterial);
    scene.add(intentionSphere);
    
    // Create measurement setups (different intentions)
    const measurementTypes = [
        { name: "Compassion", color: 0x96fb96, shape: "cube" },
        { name: "Wisdom", color: 0x8ffff2, shape: "octahedron" },
        { name: "Patience", color: 0xc5a0ff, shape: "icosahedron" },
        { name: "Generosity", color: 0xffd700, shape: "dodecahedron" }
    ];
    
    // Create orbital particles around the intention sphere
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create particles in orbital shells
        const radius = 7 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i3 + 2] = radius * Math.cos(phi);
        
        // Color gradient
        const t = Math.random();
        particleColors[i3] = 0.5 + t * 0.5; // R
        particleColors[i3 + 1] = 0.2 + t * 0.8; // G
        particleColors[i3 + 2] = 0.8 - t * 0.3; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Create measurement apparatuses positioned around the intention sphere
    measurementTypes.forEach((type, index) => {
        let geometry;
        
        switch (type.shape) {
            case "cube":
                geometry = new THREE.BoxGeometry(3, 3, 3);
                break;
            case "octahedron":
                geometry = new THREE.OctahedronGeometry(3);
                break;
            case "icosahedron":
                geometry = new THREE.IcosahedronGeometry(3);
                break;
            case "dodecahedron":
                geometry = new THREE.DodecahedronGeometry(3);
                break;
        }
        
        const material = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position in a circle around intention sphere
        const angle = (index / measurementTypes.length) * Math.PI * 2;
        const radius = 20;
        mesh.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        
        // Add label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'measurement-label';
        labelDiv.textContent = type.name;
        labelDiv.style.position = 'absolute';
        labelDiv.style.color = '#ffffff';
        labelDiv.style.padding = '5px';
        labelDiv.style.background = 'rgba(0,0,0,0.5)';
        labelDiv.style.borderRadius = '5px';
        labelDiv.style.fontSize = '12px';
        labelDiv.style.pointerEvents = 'none';
        labelDiv.style.opacity = '0';
        container.appendChild(labelDiv);
        
        mesh.userData = {
            label: labelDiv,
            type: type,
            index: index
        };
        
        scene.add(mesh);
        measurementObjects.push(mesh);
    });
    
    // Add outcome objects (initially hidden)
    const outcomes = [];
    measurementTypes.forEach((type, index) => {
        const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
        const material = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0
        });
        
        const outcome = new THREE.Mesh(geometry, material);
        outcome.position.copy(measurementObjects[index].position);
        outcome.position.z = 5;
        outcome.scale.set(0.01, 0.01, 0.01);
        outcome.userData = { isOutcome: true, type: type };
        
        scene.add(outcome);
        outcomes.push(outcome);
    });
    
    // Add controls
    const intentionStrengthSlider = document.createElement('div');
    intentionStrengthSlider.className = 'slider-container';
    intentionStrengthSlider.innerHTML = `
        <label for="intention-strength">Intention Strength:</label>
        <input type="range" id="intention-strength" min="0.5" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(intentionStrengthSlider);
    
    const intentionTypeSelect = document.createElement('div');
    intentionTypeSelect.className = 'slider-container';
    intentionTypeSelect.innerHTML = `
        <label for="intention-type">Intention Type:</label>
        <select id="intention-type">
            ${measurementTypes.map((type, i) => `<option value="${i}">${type.name}</option>`).join('')}
        </select>
    `;
    controlsContainer.appendChild(intentionTypeSelect);
    
    const measureButton = document.createElement('button');
    measureButton.textContent = 'Measure Intention';
    measureButton.addEventListener('click', performMeasurement);
    controlsContainer.appendChild(measureButton);
    
    // Animation loop
    let intentionStrength = 1;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Update intention sphere shader uniforms
        intentionSphere.material.uniforms.time.value = time;
        
        // Scale intention sphere based on strength
        const scale = 1 + Math.sin(time) * 0.1 * intentionStrength;
        intentionSphere.scale.set(scale, scale, scale);
        
        // Rotate intention sphere
        intentionSphere.rotation.y = time * 0.1;
        intentionSphere.rotation.z = time * 0.05;
        
        // Animate particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            // Calculate current position
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // Calculate distance from center
            const distance = Math.sqrt(x * x + y * y + z * z);
            
            // Orbital rotation
            const speed = (1 / distance) * intentionStrength;
            const theta = Math.atan2(y, x) + speed * 0.05;
            
            // Update position
            positions[i] = distance * Math.cos(theta);
            positions[i + 1] = distance * Math.sin(theta);
            positions[i + 2] = z + Math.sin(time + i * 0.01) * 0.05 * intentionStrength;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Animate measurement objects
        measurementObjects.forEach((obj, index) => {
            // Rotate
            obj.rotation.x = time * 0.2;
            obj.rotation.y = time * 0.3;
            
            // Pulse effect
            const pulse = 1 + Math.sin(time * 2 + index) * 0.1;
            obj.scale.set(pulse, pulse, pulse);
            
            // Highlight current selection
            const isSelected = index === currentMeasurement;
            obj.material.emissiveIntensity = isSelected ? 0.5 + Math.sin(time * 3) * 0.3 : 0.2;
            
            // Update label position
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(obj.matrixWorld);
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            
            obj.userData.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            obj.userData.label.style.opacity = isSelected ? '1' : '0.7';
        });
        
        // Animate outcomes
        outcomes.forEach((outcome) => {
            if (outcome.userData.active) {
                outcome.rotation.x = time * 0.5;
                outcome.rotation.y = time * 0.7;
                outcome.rotation.z = time * 0.3;
            }
        });
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    function performMeasurement() {
        const selectedType = currentMeasurement;
        const outcome = outcomes[selectedType];
        
        // Create wave collapse effect
        const linesMaterial = new THREE.LineBasicMaterial({
            color: measurementTypes[selectedType].color,
            transparent: true,
            opacity: 1
        });
        
        const linesCount = 50;
        const lines = [];
        
        for (let i = 0; i < linesCount; i++) {
            const lineGeometry = new THREE.BufferGeometry();
            const start = new THREE.Vector3(
                intentionSphere.position.x + (Math.random() - 0.5) * 5,
                intentionSphere.position.y + (Math.random() - 0.5) * 5,
                intentionSphere.position.z + (Math.random() - 0.5) * 5
            );
            
            const end = new THREE.Vector3(
                measurementObjects[selectedType].position.x + (Math.random() - 0.5) * 3,
                measurementObjects[selectedType].position.y + (Math.random() - 0.5) * 3,
                measurementObjects[selectedType].position.z + (Math.random() - 0.5) * 3
            );
            
            const points = [start, end];
            lineGeometry.setFromPoints(points);
            
            const line = new THREE.Line(lineGeometry, linesMaterial);
            scene.add(line);
            lines.push(line);
        }
        
        // Animate the outcome appearing
        outcome.userData.active = true;
        
        let progress = 0;
        const measurementAnimation = setInterval(() => {
            progress += 0.02;
            
            if (progress >= 1) {
                clearInterval(measurementAnimation);
                lines.forEach(line => scene.remove(line));
                return;
            }
            
            // Lines fade out
            linesMaterial.opacity = 1 - progress;
            
            // Outcome grows
            outcome.scale.set(progress, progress, progress);
            outcome.material.opacity = progress;
            
        }, 16);
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Setup event listeners
    window.addEventListener('resize', onResize);
    
    document.getElementById('intention-strength').addEventListener('input', (e) => {
        intentionStrength = parseFloat(e.target.value);
    });
    
    document.getElementById('intention-type').addEventListener('change', (e) => {
        currentMeasurement = parseInt(e.target.value);
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return {
        cleanup: function() {
            window.removeEventListener('resize', onResize);
            measurementObjects.forEach(obj => {
                if (obj.userData.label) {
                    obj.userData.label.remove();
                }
            });
            cancelAnimationFrame(animate);
            renderer.dispose();
        },
        resize: onResize
    };
}

