import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse3(container, controlsContainer) {
    let scene, camera, renderer, raycaster, mouse;
    let waveFunctionMesh, physicalActionMesh;
    let waveFunction = new THREE.Group();
    let thoughts = [];
    const clock = new THREE.Clock();
    
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create wave function visualization
    const waveSize = 15;
    const waveDetail = 50;
    const waveGeometry = new THREE.PlaneGeometry(waveSize * 2, waveSize * 2, waveDetail, waveDetail);
    
    // Use a shader material for the wave
    const waveMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(colors.accent3) },
            color2: { value: new THREE.Color(colors.accent2) }
        },
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            varying float elevation;
            
            float wave(vec2 position, float time, float frequency, float amplitude) {
                return sin(position.x * frequency + time) * 
                       sin(position.y * frequency + time) * amplitude;
            }
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Generate multiple overlapping waves
                float waves = 0.0;
                waves += wave(position.xy, time * 0.5, 0.2, 1.0);
                waves += wave(position.xy, time * 0.8, 0.5, 0.5);
                waves += wave(position.xy, time * 1.2, 1.0, 0.2);
                
                pos.z += waves;
                elevation = waves; // Pass to fragment shader
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying float elevation;
            
            void main() {
                // Color based on elevation
                float t = (elevation + 1.5) / 3.0; // normalize to [0,1]
                vec3 color = mix(color1, color2, t);
                
                // Add pulse effect from center
                float dist = length(vUv - 0.5);
                float pulse = sin(dist * 10.0 - elevation * 2.0) * 0.5 + 0.5;
                
                color = mix(color, vec3(1.0), pulse * 0.2);
                
                gl_FragColor = vec4(color, 0.8);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    waveFunctionMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveFunctionMesh.rotation.x = -Math.PI / 2;
    waveFunctionMesh.position.y = -5;
    waveFunction.add(waveFunctionMesh);
    scene.add(waveFunction);
    
    // Create thought bubbles (floating above the wave)
    const thoughtCount = 8;
    const thoughtColors = [
        colors.accent1, 
        colors.accent2, 
        colors.accent3, 
        colors.accent4,
        0xff7e7e, // red
        0x7effff, // cyan
        0xffff7e, // yellow
        0xff7eff  // magenta
    ];
    
    const thoughtTypes = [
        'Thinking', 'Love', 'Compassion', 'Wisdom',
        'Creativity', 'Patience', 'Diligence', 'Joy'
    ];
    
    for (let i = 0; i < thoughtCount; i++) {
        const size = 0.5 + Math.random() * 1;
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        
        // Custom shader for thought bubbles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseColor: { value: new THREE.Color(thoughtColors[i]) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 baseColor;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    // Create ripple pattern
                    float pattern = sin(vPosition.x * 10.0 + time) * 
                                   sin(vPosition.y * 10.0 + time) * 
                                   sin(vPosition.z * 10.0 + time);
                    
                    // Rim lighting effect
                    float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
                    rim = pow(rim, 3.0);
                    
                    // Final color
                    vec3 finalColor = baseColor * (0.8 + pattern * 0.2);
                    finalColor += rim * 0.5;
                    
                    gl_FragColor = vec4(finalColor, 0.85);
                }
            `,
            transparent: true
        });
        
        const thought = new THREE.Mesh(geometry, material);
        
        // Position in a circle floating above the wave
        const angle = (i / thoughtCount) * Math.PI * 2;
        const radius = 7 + Math.random() * 3;
        thought.position.set(
            Math.cos(angle) * radius,
            2 + Math.random() * 3,
            Math.sin(angle) * radius
        );
        
        thought.userData = {
            baseHeight: thought.position.y,
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: 0.5 + Math.random() * 0.5,
            rotateSpeed: 0.2 + Math.random() * 0.3,
            type: thoughtTypes[i],
            color: thoughtColors[i],
            isThought: true
        };
        
        // Add label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'thought-label';
        labelDiv.textContent = thoughtTypes[i];
        labelDiv.style.position = 'absolute';
        labelDiv.style.color = '#ffffff';
        labelDiv.style.padding = '3px 6px';
        labelDiv.style.background = `rgba(${new THREE.Color(thoughtColors[i]).r * 255}, ${new THREE.Color(thoughtColors[i]).g * 255}, ${new THREE.Color(thoughtColors[i]).b * 255}, 0.7)`;
        labelDiv.style.borderRadius = '3px';
        labelDiv.style.fontSize = '10px';
        labelDiv.style.pointerEvents = 'none';
        container.appendChild(labelDiv);
        
        thought.userData.label = labelDiv;
        
        scene.add(thought);
        thoughts.push(thought);
    }
    
    // Create physical action representation (initially hidden)
    const actionGeometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
    const actionMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent1),
        emissive: new THREE.Color(colors.accent1),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    
    physicalActionMesh = new THREE.Mesh(actionGeometry, actionMaterial);
    physicalActionMesh.position.set(0, 10, 0);
    physicalActionMesh.scale.set(0.01, 0.01, 0.01);
    scene.add(physicalActionMesh);
    
    // Add controls
    const intentionStrengthSlider = document.createElement('div');
    intentionStrengthSlider.className = 'slider-container';
    intentionStrengthSlider.innerHTML = `
        <label for="wave-intensity">Wave Intensity:</label>
        <input type="range" id="wave-intensity" min="0.5" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(intentionStrengthSlider);
    
    const rotationSlider = document.createElement('div');
    rotationSlider.className = 'slider-container';
    rotationSlider.innerHTML = `
        <label for="rotation-speed">Rotation:</label>
        <input type="range" id="rotation-speed" min="0" max="2" step="0.1" value="0.5">
    `;
    controlsContainer.appendChild(rotationSlider);
    
    const collapseButton = document.createElement('button');
    collapseButton.textContent = 'Collapse to Action';
    collapseButton.addEventListener('click', collapseToAction);
    controlsContainer.appendChild(collapseButton);
    
    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Animation variables
    let waveIntensity = 1;
    let rotationSpeed = 0.5;
    let selectedThought = null;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Update wave function shader
        waveFunctionMesh.material.uniforms.time.value = time * waveIntensity;
        
        // Rotate wave
        waveFunction.rotation.y = time * rotationSpeed * 0.2;
        
        // Animate thoughts
        thoughts.forEach((thought) => {
            // Floating motion
            thought.position.y = thought.userData.baseHeight + 
                Math.sin(time * thought.userData.floatSpeed + thought.userData.floatOffset) * 0.5;
            
            // Rotation
            thought.rotation.x = time * thought.userData.rotateSpeed;
            thought.rotation.y = time * thought.userData.rotateSpeed * 1.3;
            
            // Update shader
            thought.material.uniforms.time.value = time;
            
            // Highlight if selected
            if (selectedThought === thought) {
                thought.material.uniforms.baseColor.value.setHex(0xffffff);
                thought.scale.set(1.2, 1.2, 1.2);
            } else {
                thought.material.uniforms.baseColor.value.setHex(thought.userData.color);
                thought.scale.set(1, 1, 1);
            }
            
            // Update label position
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(thought.matrixWorld);
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            
            thought.userData.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
        
        // Animate physical action if visible
        if (physicalActionMesh.userData.active) {
            physicalActionMesh.rotation.x = time * 0.5;
            physicalActionMesh.rotation.y = time * 0.7;
        }
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
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
        if (selectedThought) {
            collapseToAction(selectedThought);
        }
    }
    
    function collapseToAction(thought) {
        const selectedType = typeof thought === 'object' ? thought : selectedThought;
        
        // If no thought is selected, use a random one
        const targetThought = selectedType || thoughts[Math.floor(Math.random() * thoughts.length)];
        
        // Create wave collapse effect (lines connecting thought to physical action)
        const linesMaterial = new THREE.LineBasicMaterial({
            color: targetThought ? targetThought.userData.color : colors.accent1,
            transparent: true,
            opacity: 1
        });
        
        const linesCount = 30;
        const lines = [];
        
        for (let i = 0; i < linesCount; i++) {
            const lineGeometry = new THREE.BufferGeometry();
            const start = new THREE.Vector3(
                targetThought ? targetThought.position.x + (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 10,
                targetThought ? targetThought.position.y + (Math.random() - 0.5) * 2 : 2 + (Math.random() - 0.5) * 4,
                targetThought ? targetThought.position.z + (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 10
            );
            
            const end = new THREE.Vector3(
                physicalActionMesh.position.x + (Math.random() - 0.5) * 3,
                physicalActionMesh.position.y + (Math.random() - 0.5) * 3,
                physicalActionMesh.position.z + (Math.random() - 0.5) * 3
            );
            
            const points = [start, end];
            lineGeometry.setFromPoints(points);
            
            const line = new THREE.Line(lineGeometry, linesMaterial);
            scene.add(line);
            lines.push(line);
        }
        
        // Update physical action appearance based on thought
        if (targetThought) {
            physicalActionMesh.material.color.setHex(targetThought.userData.color);
            physicalActionMesh.material.emissive.setHex(targetThought.userData.color);
        }
        
        // Animate physical action appearing
        physicalActionMesh.userData.active = true;
        
        let progress = 0;
        const collapseAnimation = setInterval(() => {
            progress += 0.02;
            
            if (progress >= 1) {
                clearInterval(collapseAnimation);
                lines.forEach(line => scene.remove(line));
                return;
            }
            
            // Lines fade out
            linesMaterial.opacity = 1 - progress;
            
            // Action grows
            physicalActionMesh.scale.set(progress, progress, progress);
            physicalActionMesh.material.opacity = progress;
            
        }, 16);
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
    
    document.getElementById('wave-intensity').addEventListener('input', (e) => {
        waveIntensity = parseFloat(e.target.value);
    });
    
    document.getElementById('rotation-speed').addEventListener('input', (e) => {
        rotationSpeed = parseFloat(e.target.value);
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

