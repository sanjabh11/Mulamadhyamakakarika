import * as THREE from 'three';
import { colors, animation } from '../config.js';
import * as d3 from 'd3';

export function initVerse10(container, controlsContainer) {
    let scene, camera, renderer;
    let mindContinuum, actionObject, fruitObject;
    const clock = new THREE.Clock();
    
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create timeline visualization with d3
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'timeline-container';
    timelineContainer.style.position = 'absolute';
    timelineContainer.style.bottom = '200px';
    timelineContainer.style.left = '0';
    timelineContainer.style.width = '100%';
    timelineContainer.style.height = '80px';
    timelineContainer.style.pointerEvents = 'none';
    container.appendChild(timelineContainer);
    
    // Setup D3 timeline
    const margin = {top: 10, right: 30, bottom: 20, left: 40};
    const width = window.innerWidth - margin.left - margin.right;
    const height = 80 - margin.top - margin.bottom;
    
    const svg = d3.select(timelineContainer)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Add axis
    const x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .attr('class', 'x-axis')
        .style('color', '#fff')
        .call(d3.axisBottom(x));
    
    // Add mind wave line
    const mindLine = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', colors.accent3)
        .attr('stroke-width', 2);
    
    // Add action marker
    const actionMarker = svg.append('circle')
        .attr('r', 5)
        .attr('fill', colors.accent1)
        .attr('cx', x(20))
        .attr('cy', height / 2);
    
    // Add fruit marker
    const fruitMarker = svg.append('circle')
        .attr('r', 5)
        .attr('fill', colors.accent4)
        .attr('cx', x(80))
        .attr('cy', height / 2);
    
    // Add labels
    svg.append('text')
        .attr('x', x(20))
        .attr('y', height / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .text('Action');
        
    svg.append('text')
        .attr('x', x(80))
        .attr('y', height / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .text('Fruit');
    
    // Create mind continuum wave
    const mindContinuumGeometry = new THREE.PlaneGeometry(30, 10, 50, 10);
    const mindContinuumMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            flowSpeed: { value: 1.0 },
            color1: { value: new THREE.Color(colors.accent3) },
            color2: { value: new THREE.Color(colors.accent2) }
        },
        vertexShader: `
            uniform float time;
            uniform float flowSpeed;
            varying vec2 vUv;
            varying float elevation;
            
            void main() {
                vUv = uv;
                
                // Create wave pattern
                float wave = sin(vUv.x * 10.0 + time * flowSpeed) * cos(vUv.y * 5.0 + time * 0.7 * flowSpeed) * 0.5;
                wave += sin(vUv.x * 5.0 - time * 0.8 * flowSpeed) * 0.3;
                
                // Displace vertex
                vec3 pos = position;
                pos.z += wave;
                elevation = wave;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying float elevation;
            
            void main() {
                // Color gradient based on elevation
                vec3 color = mix(color1, color2, elevation + 0.5);
                
                // Add ripple effect
                float ripple = sin(vUv.x * 20.0 + time * 2.0) * 0.5 + 0.5;
                color = mix(color, vec3(1.0), ripple * 0.1);
                
                gl_FragColor = vec4(color, 0.9);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    mindContinuum = new THREE.Mesh(mindContinuumGeometry, mindContinuumMaterial);
    mindContinuum.rotation.x = -Math.PI / 3;
    mindContinuum.position.y = -3;
    scene.add(mindContinuum);
    
    // Create action object
    const actionGeometry = new THREE.SphereGeometry(2, 32, 32);
    const actionMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent1),
        emissive: new THREE.Color(colors.accent1),
        emissiveIntensity: 0.5
    });
    
    actionObject = new THREE.Mesh(actionGeometry, actionMaterial);
    actionObject.position.set(-10, 0, 5);
    scene.add(actionObject);
    
    // Create fruit object
    const fruitGeometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const fruitMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colors.accent4),
        emissive: new THREE.Color(colors.accent4),
        emissiveIntensity: 0.5
    });
    
    fruitObject = new THREE.Mesh(fruitGeometry, fruitMaterial);
    fruitObject.position.set(10, 0, 5);
    scene.add(fruitObject);
    
    // Create connecting particles
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const t = i / particleCount;
        
        // Position particles along the mind continuum
        const x = -15 + t * 30;
        const y = Math.sin(t * Math.PI * 4) * 2 - 3;
        const z = Math.cos(t * Math.PI * 3) * 2 + 2;
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        // Color gradient from action to fruit
        const colorStart = new THREE.Color(colors.accent3);
        const colorMiddle = new THREE.Color(colors.accent1);
        const colorEnd = new THREE.Color(colors.accent4);
        
        let color;
        if (t < 0.5) {
            color = new THREE.Color().lerpColors(colorStart, colorMiddle, t * 2);
        } else {
            color = new THREE.Color().lerpColors(colorMiddle, colorEnd, (t - 0.5) * 2);
        }
        
        particleColors[i3] = color.r;
        particleColors[i3 + 1] = color.g;
        particleColors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add controls
    const flowSpeedSlider = document.createElement('div');
    flowSpeedSlider.className = 'slider-container';
    flowSpeedSlider.innerHTML = `
        <label for="flow-speed">Flow Speed:</label>
        <input type="range" id="flow-speed" min="0.5" max="2" step="0.1" value="1">
    `;
    controlsContainer.appendChild(flowSpeedSlider);
    
    const continuitySlider = document.createElement('div');
    continuitySlider.className = 'slider-container';
    continuitySlider.innerHTML = `
        <label for="continuity">Continuity:</label>
        <input type="range" id="continuity" min="0.2" max="1" step="0.1" value="0.6">
    `;
    controlsContainer.appendChild(continuitySlider);
    
    const cycleButton = document.createElement('button');
    cycleButton.textContent = 'Cycle Wave Function';
    cycleButton.addEventListener('click', () => {
        // Change the wave pattern
        mindContinuum.material.uniforms.time.value = Math.random() * 100;
    });
    controlsContainer.appendChild(cycleButton);
    
    // Animation variables
    let flowSpeed = 1.0;
    let continuity = 0.6;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Update mind continuum
        mindContinuum.material.uniforms.time.value = time;
        mindContinuum.material.uniforms.flowSpeed.value = flowSpeed;
        
        // Rotate objects
        actionObject.rotation.y = time * 0.3;
        fruitObject.rotation.y = time * 0.5;
        fruitObject.rotation.z = time * 0.2;
        
        // Pulse effect
        const actionPulse = 1 + Math.sin(time * 2) * 0.1;
        actionObject.scale.set(actionPulse, actionPulse, actionPulse);
        
        const fruitPulse = 1 + Math.sin(time * 1.5) * 0.1;
        fruitObject.scale.set(fruitPulse, fruitPulse, fruitPulse);
        
        // Animate particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const t = i / particleCount;
            
            // Base position along the path
            const x = -15 + t * 30;
            
            // Wave pattern for y and z
            const waveY = Math.sin(t * Math.PI * 4 + time * flowSpeed) * 2 - 3;
            const waveZ = Math.cos(t * Math.PI * 3 + time * flowSpeed * 0.7) * 2 + 2;
            
            // Random jitter based on continuity
            const jitterAmount = (1 - continuity) * 2;
            const jitterY = (Math.random() - 0.5) * jitterAmount;
            const jitterZ = (Math.random() - 0.5) * jitterAmount;
            
            // Update positions
            positions[i3] = x;
            positions[i3 + 1] = waveY + jitterY;
            positions[i3 + 2] = waveZ + jitterZ;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Update mind wave on timeline
        const waveData = [];
        for (let i = 0; i <= 100; i++) {
            waveData.push({
                x: i,
                y: 0.5 + 0.4 * Math.sin(i * 0.1 + time * flowSpeed) * Math.cos(i * 0.05 + time * 0.7 * flowSpeed)
            });
        }
        
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => height * (1 - d.y))
            .curve(d3.curveCatmullRom);
        
        mindLine.attr('d', line(waveData));
        
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
            .call(d3.axisBottom(x));
            
        x.range([0, width]);
        
        // Update SVG size
        d3.select(timelineContainer)
            .select('svg')
            .attr('width', width + margin.left + margin.right);
            
        // Update markers
        actionMarker.attr('cx', x(20));
        fruitMarker.attr('cx', x(80));
        
        // Update labels
        svg.selectAll('text').remove();
        
        svg.append('text')
            .attr('x', x(20))
            .attr('y', height / 2 - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text('Action');
            
        svg.append('text')
            .attr('x', x(80))
            .attr('y', height / 2 - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text('Fruit');
    }
    
    // Setup event listeners
    window.addEventListener('resize', onResize);
    
    document.getElementById('flow-speed').addEventListener('input', (e) => {
        flowSpeed = parseFloat(e.target.value);
    });
    
    document.getElementById('continuity').addEventListener('input', (e) => {
        continuity = parseFloat(e.target.value);
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
        resize: onResize
    };
}