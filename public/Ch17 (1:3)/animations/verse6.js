import * as THREE from 'three';
import { colors, animation } from '../config.js';
import * as d3 from 'd3';

export function initVerse6(container, controlsContainer) {
    let scene, camera, renderer;
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
    
    // Create timeline visualization with d3
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'timeline-container';
    timelineContainer.style.position = 'absolute';
    timelineContainer.style.bottom = '200px';
    timelineContainer.style.left = '0';
    timelineContainer.style.width = '100%';
    timelineContainer.style.height = '100px';
    timelineContainer.style.pointerEvents = 'none';
    container.appendChild(timelineContainer);
    
    // Setup D3 timeline
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = window.innerWidth - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;
    
    const svg = d3.select(timelineContainer)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Add axis
    const x = d3.scaleTime()
        .domain([new Date(0), new Date(100000)])
        .range([0, width]);
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .attr('class', 'x-axis')
        .style('color', '#fff')
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat('%M:%S'))
            .ticks(5));
    
    // Add wave function curve
    const waveLine = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', colors.accent3)
        .attr('stroke-width', 2);
    
    // Add action and fruit markers
    const actionMarker = svg.append('circle')
        .attr('r', 6)
        .attr('fill', colors.accent1)
        .attr('cx', x(new Date(10000)))
        .attr('cy', height / 2);
    
    const fruitMarker = svg.append('circle')
        .attr('r', 6)
        .attr('fill', colors.accent4)
        .attr('cx', x(new Date(70000)))
        .attr('cy', height / 2);
    
    // Add labels
    svg.append('text')
        .attr('x', x(new Date(10000)))
        .attr('y', height / 2 - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .text('Action');
        
    svg.append('text')
        .attr('x', x(new Date(70000)))
        .attr('y', height / 2 - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .text('Fruit');
    
    // Create action wave function
    const actionData = [];
    for (let i = 0; i <= 100; i++) {
        actionData.push({
            time: new Date(i * 1000),
            value: Math.exp(-Math.pow((i - 10) / 5, 2)) * 0.8
        });
    }
    
    // Create fruit wave function
    const fruitData = [];
    for (let i = 0; i <= 100; i++) {
        fruitData.push({
            time: new Date(i * 1000),
            value: Math.exp(-Math.pow((i - 70) / 15, 2)) * 0.8
        });
    }
    
    // Create combined wave function
    const combinedData = [];
    for (let i = 0; i <= 100; i++) {
        combinedData.push({
            time: new Date(i * 1000),
            value: actionData[i].value + fruitData[i].value
        });
    }
    
    // Create wave function visualization in 3D
    const waveGeometry = new THREE.PlaneGeometry(40, 20, 100, 1);
    const waveMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            actionCenter: { value: 0.1 }, // 10% along timeline
            fruitCenter: { value: 0.7 }, // 70% along timeline
            actionWidth: { value: 0.05 },
            fruitWidth: { value: 0.15 },
            actionColor: { value: new THREE.Color(colors.accent1) },
            fruitColor: { value: new THREE.Color(colors.accent4) }
        },
        vertexShader: `
            uniform float time;
            uniform float actionCenter;
            uniform float fruitCenter;
            uniform float actionWidth;
            uniform float fruitWidth;
            
            varying vec2 vUv;
            varying float vElevation;
            
            float gaussian(float x, float center, float width) {
                return exp(-pow((x - center) / width, 2.0));
            }
            
            void main() {
                vUv = uv;
                
                // Calculate position along wave
                float x = vUv.x;
                
                // Action wave
                float actionWave = gaussian(x, actionCenter, actionWidth) * 0.8;
                
                // Fruit wave
                float fruitWave = gaussian(x, fruitCenter, fruitWidth) * 0.8;
                
                // Combined wave with animation
                float wave = actionWave * (0.8 + 0.2 * sin(time * 2.0 + x * 10.0));
                wave += fruitWave * (0.8 + 0.2 * sin(time * 1.5 + x * 8.0));
                
                // Add mid-point connection
                float connection = 0.0;
                if (x > actionCenter && x < fruitCenter) {
                    float dist = min(abs(x - actionCenter), abs(x - fruitCenter));
                    connection = 0.2 * exp(-dist * 30.0) * (0.8 + 0.2 * sin(time * 3.0 + x * 20.0));
                }
                
                wave += connection;
                
                // Set vertex position
                vec3 pos = position;
                pos.z = wave * 5.0;
                vElevation = wave;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float actionCenter;
            uniform float fruitCenter;
            uniform vec3 actionColor;
            uniform vec3 fruitColor;
            
            varying vec2 vUv;
            varying float vElevation;
            
            float gaussian(float x, float center, float width) {
                return exp(-pow((x - center) / width, 2.0));
            }
            
            void main() {
                float x = vUv.x;
                
                // Calculate blend between action and fruit color
                float actionInfluence = gaussian(x, actionCenter, 0.1);
                float fruitInfluence = gaussian(x, fruitCenter, 0.2);
                
                // Normalize influences
                float total = actionInfluence + fruitInfluence;
                if (total > 0.0) {
                    actionInfluence = actionInfluence / total;
                    fruitInfluence = fruitInfluence / total;
                } else {
                    // Default to mixing based on position
                    actionInfluence = 1.0 - x;
                    fruitInfluence = x;
                }
                
                // Mix colors
                vec3 color = mix(actionColor, fruitColor, fruitInfluence);
                
                // Add glow based on elevation
                color = mix(color, vec3(1.0), vElevation * 0.5);
                
                // Add time-based ripple effect
                float ripple = sin(time * 2.0 + vUv.x * 20.0) * 0.1 + 0.9;
                color *= ripple;
                
                gl_FragColor = vec4(color, 0.9);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = -Math.PI / 3;
    waveMesh.position.y = -5;
    scene.add(waveMesh);
    
    // Create action object
    const actionGeometry = new THREE.SphereGeometry(2, 32, 32);
    const actionMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent1),
        emissive: new THREE.Color(colors.accent1),
        emissiveIntensity: 0.5
    });
    
    const action = new THREE.Mesh(actionGeometry, actionMaterial);
    action.position.set(-10, 0, 0);
    scene.add(action);
    
    // Create fruit object
    const fruitGeometry = new THREE.DodecahedronGeometry(2);
    const fruitMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent4),
        emissive: new THREE.Color(colors.accent4),
        emissiveIntensity: 0.5
    });
    
    const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
    fruit.position.set(10, 0, 0);
    scene.add(fruit);
    
    // Create connecting particles
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    // Create particles along the wave path
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const t = i / particleCount;
        
        // Position along path from action to fruit
        const x = -10 + t * 20;
        
        // Add some variability to y and z
        const y = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        // Color gradient from action to fruit
        const actionColor = new THREE.Color(colors.accent1);
        const fruitColor = new THREE.Color(colors.accent4);
        const color = new THREE.Color().lerpColors(actionColor, fruitColor, t);
        
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
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Add controls
    const waveSpeedSlider = document.createElement('div');
    waveSpeedSlider.className = 'slider-container';
    waveSpeedSlider.innerHTML = `
        <label for="wave-speed">Wave Speed:</label>
        <input type="range" id="wave-speed" min="0.1" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(waveSpeedSlider);
    
    const connectionStrengthSlider = document.createElement('div');
    connectionStrengthSlider.className = 'slider-container';
    connectionStrengthSlider.innerHTML = `
        <label for="connection-strength">Connection:</label>
        <input type="range" id="connection-strength" min="0" max="1" step="0.1" value="0.5">
    `;
    controlsContainer.appendChild(connectionStrengthSlider);
    
    const timeWindowButton = document.createElement('button');
    timeWindowButton.textContent = 'Change Time Window';
    timeWindowButton.addEventListener('click', () => {
        // Update action and fruit positions in time
        const newActionPos = Math.random() * 0.3;
        const newFruitPos = 0.6 + Math.random() * 0.3;
        
        waveMesh.material.uniforms.actionCenter.value = newActionPos;
        waveMesh.material.uniforms.fruitCenter.value = newFruitPos;
        
        // Update timeline markers
        actionMarker.attr('cx', x(new Date(newActionPos * 100000)));
        fruitMarker.attr('cx', x(new Date(newFruitPos * 100000)));
        
        // Update labels
        svg.selectAll('text').remove();
        
        svg.append('text')
            .attr('x', x(new Date(newActionPos * 100000)))
            .attr('y', height / 2 - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text('Action');
            
        svg.append('text')
            .attr('x', x(new Date(newFruitPos * 100000)))
            .attr('y', height / 2 - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text('Fruit');
    });
    controlsContainer.appendChild(timeWindowButton);
    
    // Animation variables
    let waveSpeed = 1;
    let connectionStrength = 0.5;
    
    function animate() {
        const time = clock.getElapsedTime() * waveSpeed;
        
        // Update shader time
        waveMesh.material.uniforms.time.value = time;
        
        // Animate action and fruit objects
        action.rotation.y = time * 0.5;
        action.rotation.z = time * 0.3;
        
        fruit.rotation.y = time * 0.4;
        fruit.rotation.x = time * 0.6;
        
        // Pulse effect
        const actionPulse = 1 + Math.sin(time * 2) * 0.1;
        action.scale.set(actionPulse, actionPulse, actionPulse);
        
        const fruitPulse = 1 + Math.sin(time * 1.5) * 0.1;
        fruit.scale.set(fruitPulse, fruitPulse, fruitPulse);
        
        // Animate connection particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const t = i / particleCount;
            
            // Base position
            const x = -10 + t * 20;
            
            // Animated offset
            const offset = Math.sin(time * 2 + t * 10) * connectionStrength;
            const yOffset = Math.cos(time + t * 5) * connectionStrength * 2;
            
            // Update position with animation
            positions[i3 + 1] = (Math.random() - 0.5) * 4 * connectionStrength + yOffset;
            positions[i3 + 2] = (Math.random() - 0.5) * 4 * connectionStrength + offset;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Update wave function on timeline
        const waveData = [];
        for (let i = 0; i <= 100; i++) {
            const x = i / 100;
            const actionCenter = waveMesh.material.uniforms.actionCenter.value;
            const fruitCenter = waveMesh.material.uniforms.fruitCenter.value;
            const actionWidth = waveMesh.material.uniforms.actionWidth.value;
            const fruitWidth = waveMesh.material.uniforms.fruitWidth.value;
            
            const actionWave = Math.exp(-Math.pow((x - actionCenter) / actionWidth, 2)) * 0.8;
            const fruitWave = Math.exp(-Math.pow((x - fruitCenter) / fruitWidth, 2)) * 0.8;
            
            // Add sin wave animation
            const actionAnim = actionWave * (0.8 + 0.2 * Math.sin(time * 2 + x * 10));
            const fruitAnim = fruitWave * (0.8 + 0.2 * Math.sin(time * 1.5 + x * 8));
            
            // Add connection between action and fruit
            let connection = 0;
            if (x > actionCenter && x < fruitCenter) {
                const dist = Math.min(Math.abs(x - actionCenter), Math.abs(x - fruitCenter));
                connection = 0.2 * Math.exp(-dist * 30) * (0.8 + 0.2 * Math.sin(time * 3 + x * 20));
            }
            
            const value = actionAnim + fruitAnim + connection * connectionStrength;
            
            waveData.push({
                time: new Date(i * 1000),
                value: value
            });
        }
        
        // Update timeline wave
        const line = d3.line()
            .x(d => x(d.time))
            .y(d => height - d.value * height)
            .curve(d3.curveCatmullRom);
        
        waveLine.attr('d', line(waveData));
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update D3 timeline
        const width = window.innerWidth - margin.left - margin.right;
        
        svg.select('.x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%M:%S'))
                .ticks(5));
            
        x.range([0, width]);
        
        // Update SVG size
        d3.select(timelineContainer)
            .select('svg')
            .attr('width', width + margin.left + margin.right);
            
        // Update markers
        actionMarker.attr('cx', x(new Date(waveMesh.material.uniforms.actionCenter.value * 100000)));
        fruitMarker.attr('cx', x(new Date(waveMesh.material.uniforms.fruitCenter.value * 100000)));
        
        // Update labels
        svg.selectAll('text').remove();
        
        svg.append('text')
            .attr('x', x(new Date(waveMesh.material.uniforms.actionCenter.value * 100000)))
            .attr('y', height / 2 - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text('Action');
            
        svg.append('text')
            .attr('x', x(new Date(waveMesh.material.uniforms.fruitCenter.value * 100000)))
            .attr('y', height / 2 - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text('Fruit');
    }
    
    // Setup event listeners
    window.addEventListener('resize', onResize);
    
    document.getElementById('wave-speed').addEventListener('input', (e) => {
        waveSpeed = parseFloat(e.target.value);
    });
    
    document.getElementById('connection-strength').addEventListener('input', (e) => {
        connectionStrength = parseFloat(e.target.value);
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return {
        cleanup: function() {
            window.removeEventListener('resize', onResize);
            timelineContainer.remove();
            cancelAnimationFrame(animate);
            renderer.dispose();
        },
        resize: onResize,
        camera: camera,
        renderer: renderer
    };
}