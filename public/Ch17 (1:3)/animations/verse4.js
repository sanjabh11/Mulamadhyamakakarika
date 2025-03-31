import * as THREE from 'three';
import { colors, animation } from '../config.js';
import * as d3 from 'd3';

export function initVerse4(container, controlsContainer) {
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
    
    // Create D3 timeline overlay for visualization
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
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = window.innerWidth - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;
    
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
    
    // Add coherence line
    const coherenceLine = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', colors.accent3)
        .attr('stroke-width', 2);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create quantum system (coherent state)
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Create initial coherent state (particles in a spherical shape)
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create uniform sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 5;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Color gradient from purple to teal
        colors[i3] = 0.6 + Math.random() * 0.4; // R
        colors[i3 + 1] = 0.3 + Math.random() * 0.3; // G
        colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Create unconscious actions (represented as impulses that cause decoherence)
    const unconsciousActions = [
        { name: "Speech", color: 0xff7e7e, intensity: 0.7 },
        { name: "Movement", color: 0x7effff, intensity: 0.5 },
        { name: "Unconscious not-letting-go", color: 0xffff7e, intensity: 0.8 },
        { name: "Unconscious letting-go", color: 0xff7eff, intensity: 0.6 }
    ];
    
    // Create impulse spheres (sources of decoherence)
    const impulses = [];
    
    unconsciousActions.forEach((action, index) => {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: action.color,
            emissive: action.color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const impulse = new THREE.Mesh(geometry, material);
        
        // Position around the coherent system
        const angle = (index / unconsciousActions.length) * Math.PI * 2;
        const radius = 10;
        impulse.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        
        impulse.userData = {
            action: action,
            active: false,
            pulseTime: 0
        };
        
        scene.add(impulse);
        impulses.push(impulse);
    });
    
    // Add ripple effects (initially invisible)
    const ripples = [];
    
    unconsciousActions.forEach((action, index) => {
        const geometry = new THREE.RingGeometry(0.5, 1, 32);
        const material = new THREE.MeshBasicMaterial({
            color: action.color,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        
        const ripple = new THREE.Mesh(geometry, material);
        ripple.position.copy(impulses[index].position);
        ripple.rotation.x = Math.PI / 2;
        
        ripple.userData = {
            active: false,
            size: 0,
            maxSize: 15,
            action: action
        };
        
        scene.add(ripple);
        ripples.push(ripple);
    });
    
    // Add controls
    const coherenceSlider = document.createElement('div');
    coherenceSlider.className = 'slider-container';
    coherenceSlider.innerHTML = `
        <label for="coherence">Coherence:</label>
        <input type="range" id="coherence" min="0" max="1" step="0.01" value="1">
    `;
    controlsContainer.appendChild(coherenceSlider);
    
    // Add buttons for each unconscious action
    unconsciousActions.forEach((action, index) => {
        const actionButton = document.createElement('button');
        actionButton.textContent = action.name;
        actionButton.style.backgroundColor = `#${action.color.toString(16).padStart(6, '0')}`;
        actionButton.addEventListener('click', () => triggerImpulse(index));
        controlsContainer.appendChild(actionButton);
    });
    
    // Animation variables
    let coherence = 1;
    let coherenceData = Array(100).fill(1);
    let decoherenceRate = 0.0;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Update particle positions based on coherence
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Get original position (normalized)
            const xOrig = positions[i] / 5;
            const yOrig = positions[i + 1] / 5;
            const zOrig = positions[i + 2] / 5;
            
            // Distance from center
            const dist = Math.sqrt(xOrig * xOrig + yOrig * yOrig + zOrig * zOrig);
            
            // Apply coherence factor (increasing distance as coherence decreases)
            const coherenceFactor = 5 + (1 - coherence) * 15;
            
            // Add some noise based on decoherence
            const noise = (1 - coherence) * 2;
            
            // Update position with noise
            positions[i] = xOrig * coherenceFactor + (Math.random() - 0.5) * noise;
            positions[i + 1] = yOrig * coherenceFactor + (Math.random() - 0.5) * noise;
            positions[i + 2] = zOrig * coherenceFactor + (Math.random() - 0.5) * noise;
            
            // Change color based on coherence
            const colors = particles.geometry.attributes.color.array;
            colors[i] = 0.6 + (1 - coherence) * 0.4; // More red as decoherence increases
            colors[i + 1] = 0.3 - (1 - coherence) * 0.2; // Less green
            colors[i + 2] = 0.8 - (1 - coherence) * 0.6; // Less blue
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
        
        // Animate impulses
        impulses.forEach((impulse, index) => {
            // Pulsing effect
            const pulse = 1 + Math.sin(time * 3 + index) * 0.2;
            impulse.scale.set(pulse, pulse, pulse);
            
            // If active, create ripple effect
            if (impulse.userData.active) {
                impulse.userData.pulseTime += 0.02;
                
                if (impulse.userData.pulseTime >= 1) {
                    impulse.userData.active = false;
                    impulse.userData.pulseTime = 0;
                } else {
                    // Increase glow during pulse
                    impulse.material.emissiveIntensity = 0.5 + impulse.userData.pulseTime * 0.5;
                }
            } else {
                impulse.material.emissiveIntensity = 0.5;
            }
        });
        
        // Animate ripples
        ripples.forEach((ripple) => {
            if (ripple.userData.active) {
                ripple.userData.size += 0.3;
                
                if (ripple.userData.size >= ripple.userData.maxSize) {
                    ripple.userData.active = false;
                    ripple.userData.size = 0;
                    ripple.material.opacity = 0;
                } else {
                    // Scale and fade
                    const scale = ripple.userData.size;
                    ripple.scale.set(scale, scale, 1);
                    ripple.material.opacity = 1 - (ripple.userData.size / ripple.userData.maxSize);
                    
                    // Calculate effect on coherence
                    const distanceFactor = Math.max(0, 1 - ripple.userData.size / 15);
                    const impactStrength = ripple.userData.action.intensity * 0.05 * distanceFactor;
                    
                    coherence = Math.max(0, coherence - impactStrength);
                }
            }
        });
        
        // Natural recovery of coherence over time
        coherence = Math.min(1, coherence + 0.001);
        
        // Update coherence data for timeline
        coherenceData.shift();
        coherenceData.push(coherence);
        
        // Update coherence line
        const lineData = coherenceData.map((d, i) => ({x: i, y: d}));
        
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => height - height * d.y)
            .curve(d3.curveCatmullRom);
        
        coherenceLine.attr('d', line(lineData));
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    function triggerImpulse(index) {
        const impulse = impulses[index];
        const ripple = ripples[index];
        
        impulse.userData.active = true;
        impulse.userData.pulseTime = 0;
        
        ripple.userData.active = true;
        ripple.userData.size = 0.5;
        ripple.material.opacity = 1;
        
        // Decrease coherence based on action intensity
        coherence = Math.max(0, coherence - impulse.userData.action.intensity * 0.2);
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
    }
    
    // Setup event listeners
    window.addEventListener('resize', onResize);
    
    document.getElementById('coherence').addEventListener('input', (e) => {
        coherence = parseFloat(e.target.value);
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