import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse9(container, controlsContainer) {
    let scene, camera, renderer, raycaster, mouse;
    let mindSphere, thoughtParticles, actionObject;
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
    
    // Create mind sphere (representing continuum of mind)
    const mindGeometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Create shader material for the mind sphere
    const mindMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            intensity: { value: 1.0 },
            mindColor: { value: new THREE.Color(colors.accent3) }
        },
        vertexShader: `
            uniform float time;
            uniform float intensity;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying float displacement;
            
            float hash(float n) {
                return fract(sin(n) * 43758.5453);
            }
            
            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                
                float n = p.x + p.y * 157.0 + 113.0 * p.z;
                return mix(
                    mix(
                        mix(hash(n + 0.0), hash(n + 1.0), f.x),
                        mix(hash(n + 157.0), hash(n + 158.0), f.x),
                        f.y),
                    mix(
                        mix(hash(n + 113.0), hash(n + 114.0), f.x),
                        mix(hash(n + 270.0), hash(n + 271.0), f.x),
                        f.y),
                    f.z);
            }
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                
                // Create varied displacement for organic mind surface
                float noiseValue = noise(position * 0.5 + time * 0.2) * intensity;
                
                // Add smaller detail noise
                noiseValue += noise(position * 2.0 + time * 0.5) * 0.2 * intensity;
                
                // Store for fragment shader
                displacement = noiseValue;
                
                // Displace vertex
                vec3 newPosition = position + normal * noiseValue * 0.5;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 mindColor;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying float displacement;
            
            void main() {
                // Base color from uniform
                vec3 color = mindColor;
                
                // Create depth effect based on displacement
                color = mix(color, vec3(1.0), displacement * 0.5);
                
                // Create thought pattern
                float pattern = 0.8 + 0.2 * sin(vUv.y * 20.0 + time) * sin(vUv.x * 20.0 + time);
                color *= pattern;
                
                // Add rim lighting for glow effect
                float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
                rim = pow(rim, 3.0);
                color += rim * 0.5 * vec3(1.0, 0.8, 1.0);
                
                // Pulsing effect to represent thoughts
                float pulse = 0.8 + 0.2 * sin(time * 2.0);
                color *= pulse;
                
                gl_FragColor = vec4(color, 0.9);
            }
        `,
        transparent: true
    });
    
    mindSphere = new THREE.Mesh(mindGeometry, mindMaterial);
    scene.add(mindSphere);
    
    // Create thought particles (continuum visualization)
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    // Create particles in a spiral pattern outward from the mind
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const t = i / particleCount;
        
        // Create spiral formation
        const angle = t * Math.PI * 20;
        const radius = 6 + t * 15; // Start just outside the mind sphere
        
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.sin(angle) * radius;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Color gradient based on position
        const colorT = t;
        
        // Gradient from mind color to result color
        const mindColor = new THREE.Color(colors.accent3);
        const resultColor = new THREE.Color(colors.accent4);
        const color = new THREE.Color().lerpColors(mindColor, resultColor, colorT);
        
        particleColors[i3] = color.r;
        particleColors[i3 + 1] = color.g;
        particleColors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    thoughtParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(thoughtParticles);
    
    // Create action object (result of mind continuum)
    const actionGeometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
    const actionMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent4),
        emissive: new THREE.Color(colors.accent4),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    actionObject = new THREE.Mesh(actionGeometry, actionMaterial);
    actionObject.position.set(20, 0, 0);
    actionObject.scale.set(0.01, 0.01, 0.01);
    actionObject.userData = { active: false };
    scene.add(actionObject);
    
    // Create thought types (floating around the mind)
    const thoughtTypes = [
        { name: "Wisdom", color: 0x8ffff2 },
        { name: "Compassion", color: 0x96fb96 },
        { name: "Patience", color: 0xc5a0ff },
        { name: "Diligence", color: 0xffd700 },
        { name: "Love", color: 0xff7e7e }
    ];
    
    const thoughts = [];
    
    thoughtTypes.forEach((type, index) => {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: type.color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        
        const thought = new THREE.Mesh(geometry, material);
        
        // Position around the mind
        const angle = (index / thoughtTypes.length) * Math.PI * 2;
        const radius = 7;
        thought.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        
        thought.userData = { 
            type: type, 
            basePosition: thought.position.clone(),
            angle: angle,
            radius: radius,
            selected: false
        };
        
        // Add label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'thought-label';
        labelDiv.textContent = type.name;
        labelDiv.style.position = 'absolute';
        labelDiv.style.color = '#ffffff';
        labelDiv.style.padding = '5px';
        labelDiv.style.background = `rgba(${new THREE.Color(type.color).r * 255}, ${new THREE.Color(type.color).g * 255}, ${new THREE.Color(type.color).b * 255}, 0.7)`;
        labelDiv.style.borderRadius = '5px';
        labelDiv.style.fontSize = '12px';
        labelDiv.style.pointerEvents = 'none';
        container.appendChild(labelDiv);
        
        thought.userData.label = labelDiv;
        
        scene.add(thought);
        thoughts.push(thought);
    });
    
    // Add controls
    const mindIntensitySlider = document.createElement('div');
    mindIntensitySlider.className = 'slider-container';
    mindIntensitySlider.innerHTML = `
        <label for="mind-intensity">Mind Intensity:</label>
        <input type="range" id="mind-intensity" min="0.5" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(mindIntensitySlider);
    
    const continuumSpeedSlider = document.createElement('div');
    continuumSpeedSlider.className = 'slider-container';
    continuumSpeedSlider.innerHTML = `
        <label for="continuum-speed">Thought Speed:</label>
        <input type="range" id="continuum-speed" min="0.5" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(continuumSpeedSlider);
    
    const manifestButton = document.createElement('button');
    manifestButton.textContent = 'Manifest Action';
    manifestButton.addEventListener('click', manifestAction);
    controlsContainer.appendChild(manifestButton);
    
    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Animation variables
    let mindIntensity = 1.0;
    let continuumSpeed = 1.0;
    let selectedThought = null;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Update mind shader
        mindSphere.material.uniforms.time.value = time;
        mindSphere.material.uniforms.intensity.value = mindIntensity;
        
        // Rotate mind
        mindSphere.rotation.y = time * 0.1;
        mindSphere.rotation.z = time * 0.05;
        
        // Animate thought particles
        const positions = thoughtParticles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Get original spiral coordinates
            const index = i / particleCount;
            const angle = index * Math.PI * 20 + time * continuumSpeed * 0.2;
            const radius = 6 + index * 15;
            
            // Add time-based motion
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = Math.sin(time * 0.5 + index * 10) * 2;
            
            // If a thought is selected, bias particles toward that thought type
            if (selectedThought) {
                if (i % 10 === 0) { // Only affect some particles for better visual effect
                    const thoughtPos = selectedThought.position;
                    const dx = thoughtPos.x - positions[i3];
                    const dy = thoughtPos.y - positions[i3 + 1];
                    const dz = thoughtPos.z - positions[i3 + 2];
                    
                    // Attract particles slightly to the selected thought
                    positions[i3] += dx * 0.01;
                    positions[i3 + 1] += dy * 0.01;
                    positions[i3 + 2] += dz * 0.01;
                }
            }
        }
        
        thoughtParticles.geometry.attributes.position.needsUpdate = true;
        
        // Animate thoughts
        thoughts.forEach((thought, index) => {
            // Orbital motion
            thought.userData.angle += 0.002 * continuumSpeed;
            thought.position.x = Math.cos(thought.userData.angle) * thought.userData.radius;
            thought.position.y = Math.sin(thought.userData.angle) * thought.userData.radius;
            
            // Wobble effect
            thought.position.z = Math.sin(time * 0.5 + index) * 2;
            
            // Rotation
            thought.rotation.x = time * 0.3;
            thought.rotation.y = time * 0.5;
            
            // Pulse effect
            const pulse = 1 + Math.sin(time * 2 + index) * 0.1;
            
            // Scale based on selection
            if (thought === selectedThought) {
                thought.scale.set(pulse * 1.3, pulse * 1.3, pulse * 1.3);
                thought.material.emissiveIntensity = 0.8;
            } else {
                thought.scale.set(pulse, pulse, pulse);
                thought.material.emissiveIntensity = 0.5;
            }
            
            // Update label position
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(thought.matrixWorld);
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            
            thought.userData.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
        
        // Animate action object if active
        if (actionObject.userData.active) {
            actionObject.rotation.x = time * 0.5;
            actionObject.rotation.y = time * 0.7;
        }
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    function manifestAction() {
        if (actionObject.userData.active) {
            // Reset if already active
            actionObject.userData.active = false;
            actionObject.scale.set(0.01, 0.01, 0.01);
            actionObject.material.opacity = 0;
            return;
        }
        
        // Create wave collapse effect
        const targetThought = selectedThought || thoughts[Math.floor(Math.random() * thoughts.length)];
        
        // Set action color based on selected thought
        if (targetThought) {
            actionObject.material.color.setHex(targetThought.userData.type.color);
            actionObject.material.emissive.setHex(targetThought.userData.type.color);
        }
        
        // Create particle effect for mind to action connection
        const connectionGeometry = new THREE.BufferGeometry();
        const connectionCount = 300;
        const connectionPositions = new Float32Array(connectionCount * 3);
        const connectionColors = new Float32Array(connectionCount * 3);
        
        for (let i = 0; i < connectionCount; i++) {
            const i3 = i * 3;
            
            // Start particles around the mind
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 5 + Math.random() * 2;
            
            connectionPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            connectionPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            connectionPositions[i3 + 2] = radius * Math.cos(phi);
            
            // Color gradient from mind to thought to action
            const mindColor = new THREE.Color(colors.accent3);
            let thoughtColor;
            
            if (targetThought) {
                thoughtColor = new THREE.Color(targetThought.userData.type.color);
            } else {
                thoughtColor = new THREE.Color(colors.accent4);
            }
            
            // Interpolate color
            const color = new THREE.Color().lerpColors(mindColor, thoughtColor, Math.random());
            
            connectionColors[i3] = color.r;
            connectionColors[i3 + 1] = color.g;
            connectionColors[i3 + 2] = color.b;
        }
        
        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
        connectionGeometry.setAttribute('color', new THREE.BufferAttribute(connectionColors, 3));
        
        const connectionMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const connectionParticles = new THREE.Points(connectionGeometry, connectionMaterial);
        scene.add(connectionParticles);
        
        // Animate particles to action position
        actionObject.userData.active = true;
        
        let progress = 0;
        const manifestAnimation = setInterval(() => {
            progress += 0.02;
            
            if (progress >= 1) {
                clearInterval(manifestAnimation);
                scene.remove(connectionParticles);
                return;
            }
            
            // Animate particles toward action
            const positions = connectionParticles.geometry.attributes.position.array;
            for (let i = 0; i < connectionCount; i++) {
                const i3 = i * 3;
                
                // Current position
                const x = positions[i3];
                const y = positions[i3 + 1];
                const z = positions[i3 + 2];
                
                // Target position (action object)
                const targetX = actionObject.position.x;
                const targetY = actionObject.position.y;
                const targetZ = actionObject.position.z;
                
                // Move toward target with some randomness
                positions[i3] += (targetX - x) * 0.1 + (Math.random() - 0.5) * 0.2;
                positions[i3 + 1] += (targetY - y) * 0.1 + (Math.random() - 0.5) * 0.2;
                positions[i3 + 2] += (targetZ - z) * 0.1 + (Math.random() - 0.5) * 0.2;
            }
            
            // Fade particles as they approach
            connectionMaterial.opacity = 1 - progress;
            
            // Grow action object
            actionObject.scale.set(progress, progress, progress);
            actionObject.material.opacity = progress;
            
            connectionParticles.geometry.attributes.position.needsUpdate = true;
        }, 16);
    }
    
    // Event handlers
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(thoughts);
        
        if (intersects.length > 0) {
            selectedThought = intersects[0].object;
            document.body.style.cursor = 'pointer';
        } else {
            selectedThought = null;
            document.body.style.cursor = 'default';
        }
    }
    
    function onClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(thoughts);
        
        if (intersects.length > 0) {
            selectedThought = intersects[0].object;
            manifestAction();
        }
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Setup event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    
    document.getElementById('mind-intensity').addEventListener('input', (e) => {
        mindIntensity = parseFloat(e.target.value);
    });
    
    document.getElementById('continuum-speed').addEventListener('input', (e) => {
        continuumSpeed = parseFloat(e.target.value);
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return {
        cleanup: function() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', onResize);
            thoughts.forEach(thought => {
                if (thought.userData.label) {
                    thought.userData.label.remove();
                }
            });
            cancelAnimationFrame(animate);
            renderer.dispose();
        },
        resize: onResize
    };
}

