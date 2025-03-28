import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as d3 from 'd3';

// Entangled Particle Correlation Animation for Verse 6
export function initVerse6(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 12);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);
    
    // Settings
    const particleCount = options.particleCount || 2;
    const correlationDistance = options.correlationDistance || 5;
    const interactionStrength = options.interactionStrength || 0.8;
    const visualizationScale = options.visualizationScale || 1.0;
    
    // Create a grid for reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x222222);
    scene.add(gridHelper);
    
    // Create particles
    const particles = [];
    const particleSize = 0.5 * visualizationScale;
    
    // Materials for different correlation states
    const particleMaterials = [
        new THREE.MeshStandardMaterial({
            color: 0x3a7bd5,
            emissive: 0x3a7bd5,
            emissiveIntensity: 0.3
        }),
        new THREE.MeshStandardMaterial({
            color: 0x00d2ff,
            emissive: 0x00d2ff,
            emissiveIntensity: 0.3
        })
    ];
    
    // Create correlation visualization
    const correlationLines = [];
    const lineWidthFactor = 2 * visualizationScale;
    
    // Create D3 correlation graph (SVG overlay)
    const svgContainer = document.createElement('div');
    svgContainer.style.position = 'absolute';
    svgContainer.style.top = '0';
    svgContainer.style.left = '0';
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    svgContainer.style.pointerEvents = 'none';
    container.appendChild(svgContainer);
    
    const svg = d3.select(svgContainer)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');
        
    // Create histogram visualization
    const histogram = svg.append('g')
        .attr('class', 'histogram')
        .attr('transform', 'translate(20, 50)');
        
    const histWidth = 150;
    const histHeight = 80;
    
    // Add background for histogram
    histogram.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', histWidth)
        .attr('height', histHeight)
        .attr('fill', 'rgba(0, 0, 0, 0.7)')
        .attr('rx', 5)
        .attr('ry', 5);
        
    // Add title
    histogram.append('text')
        .attr('x', histWidth / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text('Correlation Measurements');
        
    // Create position data
    const positions = [];
    const measurements = [];
    const histBins = [0, 0]; // [uncorrelated, correlated]
    
    // Initialize particles
    const particleGeometry = new THREE.SphereGeometry(particleSize, 16, 16);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(
            particleGeometry,
            particleMaterials[i % particleMaterials.length].clone()
        );
        
        // Position randomly
        particle.position.set(
            (Math.random() - 0.5) * 10,
            0,
            (Math.random() - 0.5) * 10
        );
        
        // Add properties
        particle.userData = {
            index: i,
            correlatedWith: [],
            originalPosition: particle.position.clone(),
            targetPosition: particle.position.clone(),
            velocity: new THREE.Vector3(),
            isSelected: false
        };
        
        scene.add(particle);
        particles.push(particle);
        positions.push(particle.position.clone());
    }
    
    // Create correlation lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.4,
        linewidth: lineWidthFactor
    });
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
                particles[i].position,
                particles[j].position
            ]);
            
            const line = new THREE.Line(geometry, lineMaterial.clone());
            line.userData = {
                particleA: i,
                particleB: j,
                strength: 0
            };
            
            scene.add(line);
            correlationLines.push(line);
            
            // Establish correlation
            particles[i].userData.correlatedWith.push(j);
            particles[j].userData.correlatedWith.push(i);
        }
    }
    
    // Create selection indicator
    const selectionRingGeometry = new THREE.RingGeometry(particleSize * 1.2, particleSize * 1.5, 32);
    const selectionRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xff7675,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const selectionRing = new THREE.Mesh(selectionRingGeometry, selectionRingMaterial);
    selectionRing.rotation.x = Math.PI / 2; // Lay flat
    selectionRing.visible = false;
    scene.add(selectionRing);
    
    // State variables
    let selectedParticle = null;
    let isInteracting = false;
    let lastInteractionTime = 0;
    
    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Function to update correlation lines
    function updateCorrelationLines() {
        correlationLines.forEach(line => {
            const particleA = particles[line.userData.particleA];
            const particleB = particles[line.userData.particleB];
            
            // Update line endpoints
            const points = [
                particleA.position.clone(),
                particleB.position.clone()
            ];
            
            line.geometry.dispose();
            line.geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // Update correlation strength
            const distance = particleA.position.distanceTo(particleB.position);
            const normalizedDistance = Math.min(distance / correlationDistance, 1);
            const strength = 1 - normalizedDistance;
            
            line.userData.strength = strength * interactionStrength;
            line.material.opacity = 0.3 * line.userData.strength;
            
            // Scale line width with correlation strength
            line.material.linewidth = lineWidthFactor * line.userData.strength;
        });
    }
    
    // Function to update histogram
    function updateHistogram() {
        // Update bin data
        const total = histBins[0] + histBins[1];
        const normalizedBins = total > 0 ? 
            [histBins[0] / total, histBins[1] / total] : 
            [0.5, 0.5];
        
        // Clear existing bars
        histogram.selectAll('.bar').remove();
        
        // Draw new bars
        const barWidth = histWidth / 3;
        
        histogram.selectAll('.bar')
            .data(normalizedBins)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => 20 + i * (barWidth + 10))
            .attr('y', (d) => histHeight - 25 - d * 50)
            .attr('width', barWidth)
            .attr('height', (d) => d * 50)
            .attr('fill', (d, i) => i === 0 ? '#ff7675' : '#00d2ff');
            
        // Add labels
        histogram.selectAll('.label')
            .data(['Uncorrelated', 'Correlated'])
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', (d, i) => 20 + barWidth/2 + i * (barWidth + 10))
            .attr('y', histHeight - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '8px')
            .text(d => d);
            
        // Add count text
        histogram.selectAll('.count')
            .data(histBins)
            .enter()
            .append('text')
            .attr('class', 'count')
            .attr('x', (d, i) => 20 + barWidth/2 + i * (barWidth + 10))
            .attr('y', (d, i) => histHeight - 30 - normalizedBins[i] * 50)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .text(d => d);
    }
    
    // Function to interact with a particle
    function interactWithParticle(particle) {
        if (isInteracting) return;
        
        isInteracting = true;
        lastInteractionTime = Date.now();
        
        // Record original positions
        particles.forEach(p => {
            p.userData.originalPosition = p.position.clone();
        });
        
        // Move the selected particle
        selectedParticle = particle;
        particle.userData.isSelected = true;
        
        // Update selection ring
        selectionRing.position.copy(particle.position);
        selectionRing.position.y = 0.01; // Slightly above ground
        selectionRing.visible = true;
        
        // Apply random movement to selected particle
        const randomOffset = new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            0,
            (Math.random() - 0.5) * 4
        );
        
        particle.userData.targetPosition.copy(particle.position).add(randomOffset);
        
        // After a delay, check correlation with other particles
        setTimeout(measureCorrelation, 1000);
    }
    
    // Function to measure correlation between particles
    function measureCorrelation() {
        if (!selectedParticle) return;
        
        // For each particle correlated with the selected one
        selectedParticle.userData.correlatedWith.forEach(index => {
            const correlatedParticle = particles[index];
            
            // Find the correlation line
            const line = correlationLines.find(l => 
                (l.userData.particleA === selectedParticle.userData.index && l.userData.particleB === index) ||
                (l.userData.particleB === selectedParticle.userData.index && l.userData.particleA === index)
            );
            
            if (!line) return;
            
            // Determine if movement is correlated based on strength
            const isCorrelated = Math.random() < line.userData.strength;
            
            if (isCorrelated) {
                // Move correlated particle in the same relative direction
                const selectedMovement = new THREE.Vector3().subVectors(
                    selectedParticle.userData.targetPosition,
                    selectedParticle.userData.originalPosition
                );
                
                correlatedParticle.userData.targetPosition.copy(
                    correlatedParticle.userData.originalPosition.clone().add(selectedMovement)
                );
                
                // Update line color to show correlation
                line.material.color.set(0x00d2ff);
                line.material.opacity = 0.8;
                
                // Record measurement
                measurements.push({
                    time: Date.now(),
                    type: 'correlated',
                    particles: [selectedParticle.userData.index, index]
                });
                
                histBins[1]++;
            } else {
                // Move randomly if not correlated
                const randomOffset = new THREE.Vector3(
                    (Math.random() - 0.5) * 4,
                    0,
                    (Math.random() - 0.5) * 4
                );
                
                correlatedParticle.userData.targetPosition.copy(
                    correlatedParticle.userData.originalPosition.clone().add(randomOffset)
                );
                
                // Update line color to show lack of correlation
                line.material.color.set(0xff7675);
                line.material.opacity = 0.8;
                
                // Record measurement
                measurements.push({
                    time: Date.now(),
                    type: 'uncorrelated',
                    particles: [selectedParticle.userData.index, index]
                });
                
                histBins[0]++;
            }
        });
        
        // Update histogram
        updateHistogram();
        
        // Reset state after a delay
        setTimeout(() => {
            isInteracting = false;
            
            if (selectedParticle) {
                selectedParticle.userData.isSelected = false;
                selectedParticle = null;
            }
            
            selectionRing.visible = false;
            
            // Reset line colors
            correlationLines.forEach(line => {
                line.material.color.set(0x00d2ff);
                line.material.opacity = 0.4 * line.userData.strength;
            });
        }, 2000);
    }
    
    // Initialize mouse interaction
    container.addEventListener('mousedown', onMouseDown);
    
    function onMouseDown(event) {
        // Convert mouse coordinates to normalized device coordinates
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Check for intersection with particles
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(particles);
        
        if (intersects.length > 0 && !isInteracting) {
            interactWithParticle(intersects[0].object);
        }
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        // Update particle positions
        particles.forEach(particle => {
            if (isInteracting) {
                // Move towards target position during interaction
                particle.position.lerp(particle.userData.targetPosition, 0.05);
            } else {
                // Apply slight random movement when not interacting
                if (Math.random() < 0.01) {
                    const wiggle = new THREE.Vector3(
                        (Math.random() - 0.5) * 0.05,
                        0,
                        (Math.random() - 0.5) * 0.05
                    );
                    particle.position.add(wiggle);
                }
            }
        });
        
        // Update correlation visualization
        updateCorrelationLines();
        
        // Animate selection ring
        if (selectionRing.visible) {
            const time = Date.now() * 0.001;
            selectionRing.scale.set(
                1 + Math.sin(time * 5) * 0.1,
                1 + Math.sin(time * 5) * 0.1,
                1
            );
            
            if (selectedParticle) {
                selectionRing.position.x = selectedParticle.position.x;
                selectionRing.position.z = selectedParticle.position.z;
            }
        }
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
        
        // Store animation ID for cleanup
        animate.id = animationId;
    }
    
    // Create control panel
    function createControls() {
        const controlsHTML = `
            <h3>Entangled Particles Controls</h3>
            
            <div class="slider-container">
                <label for="correlation-distance">Correlation Distance: <span id="correlation-distance-value">${correlationDistance.toFixed(1)}</span></label>
                <input type="range" id="correlation-distance" min="1" max="15" step="0.5" value="${correlationDistance}">
            </div>
            
            <div class="slider-container">
                <label for="interaction-strength">Interaction Strength: <span id="interaction-strength-value">${interactionStrength.toFixed(2)}</span></label>
                <input type="range" id="interaction-strength" min="0" max="1" step="0.05" value="${interactionStrength}">
            </div>
            
            <div class="slider-container">
                <label for="visualization-scale">Visualization Scale: <span id="visualization-scale-value">${visualizationScale.toFixed(2)}</span></label>
                <input type="range" id="visualization-scale" min="0.5" max="2.0" step="0.1" value="${visualizationScale}">
            </div>
            
            <button id="reset-particles" class="control-button">Reset Particle Positions</button>
            <button id="clear-measurements" class="control-button">Clear Measurement Data</button>
            <button id="random-interaction" class="control-button">Random Interaction</button>
            
            <div class="info-text">
                <p>Click on a particle to interact with it and observe correlations</p>
            </div>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('correlation-distance').addEventListener('input', function() {
            const newValue = parseFloat(this.value);
            document.getElementById('correlation-distance-value').textContent = newValue.toFixed(1);
            
            updateCorrelationLines();
        });
        
        document.getElementById('interaction-strength').addEventListener('input', function() {
            const newValue = parseFloat(this.value);
            document.getElementById('interaction-strength-value').textContent = newValue.toFixed(2);
            
            updateCorrelationLines();
        });
        
        document.getElementById('visualization-scale').addEventListener('input', function() {
            const newValue = parseFloat(this.value);
            document.getElementById('visualization-scale-value').textContent = newValue.toFixed(2);
        });
        
        document.getElementById('reset-particles').addEventListener('click', function() {
            // Reset particle positions
            particles.forEach(particle => {
                const randomPos = new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    0,
                    (Math.random() - 0.5) * 10
                );
                
                particle.position.copy(randomPos);
                particle.userData.originalPosition.copy(randomPos);
                particle.userData.targetPosition.copy(randomPos);
            });
            
            // Update correlation lines
            updateCorrelationLines();
        });
        
        document.getElementById('clear-measurements').addEventListener('click', function() {
            measurements.length = 0;
            histBins[0] = 0;
            histBins[1] = 0;
            updateHistogram();
        });
        
        document.getElementById('random-interaction').addEventListener('click', function() {
            if (!isInteracting) {
                const randomIndex = Math.floor(Math.random() * particles.length);
                interactWithParticle(particles[randomIndex]);
            }
        });
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Initialize controls and start animation
    createControls();
    updateHistogram();
    animate();
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', onWindowResize);
        container.removeEventListener('mousedown', onMouseDown);
        cancelAnimationFrame(animate.id);
        renderer.dispose();
        container.removeChild(renderer.domElement);
        container.removeChild(svgContainer);
        
        // Dispose geometries and materials
        [particleGeometry, selectionRingGeometry].forEach(geometry => {
            if (geometry) geometry.dispose();
        });
        
        [selectionRingMaterial].forEach(material => {
            if (material) material.dispose();
        });
        
        // Dispose particle materials
        particleMaterials.forEach(material => {
            if (material) material.dispose();
        });
        
        // Dispose correlation lines
        correlationLines.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
        });
        
        // Dispose particles
        particles.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
    };
}

export function cleanupVerse6() {
    // Cleanup is handled by the returned function from initVerse6
}

