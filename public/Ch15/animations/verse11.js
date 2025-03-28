import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as d3 from 'd3';

// Quantum Information Conservation Animation for Verse 11
export function initVerse11(container, controlsContainer, options) {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 7);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Settings
    const systemSize = options?.systemSize || 3.0;
    const interactionStrength = options?.interactionStrength || 0.5;
    const decoherenceRate = options?.decoherenceRate || 0.1;
    const informationVisualization = options?.informationVisualization || 0.8;
    
    // Create D3 overlay for information visualization
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
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create quantum system visualization
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);
    
    // Central quantum system (the source information)
    const centralGeometry = new THREE.SphereGeometry(systemSize / 4, 32, 32);
    const centralMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a7bd5,
        emissive: 0x3a7bd5,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const centralSystem = new THREE.Mesh(centralGeometry, centralMaterial);
    centralSystem.castShadow = true;
    systemGroup.add(centralSystem);
    
    // Environment particles (that the quantum system interacts with)
    const environmentParticles = [];
    const envParticleCount = 20;
    const envRadius = systemSize * 1.5;
    
    // Create environment particles
    for (let i = 0; i < envParticleCount; i++) {
        const particleSize = systemSize / 10 + Math.random() * systemSize / 20;
        const particleGeometry = new THREE.SphereGeometry(particleSize, 16, 16);
        
        // Vary color from blue to cyan
        const hue = 0.5 + Math.random() * 0.2; // Blue to cyan hue range
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8,
            roughness: 0.5,
            metalness: 0.3
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Place randomly in a sphere around the central system
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = envRadius * (0.6 + Math.random() * 0.4);
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        particle.userData = {
            originalPosition: particle.position.clone(),
            orbitalSpeed: 0.1 + Math.random() * 0.2,
            orbitalPhase: Math.random() * Math.PI * 2,
            information: 0, // How much information this particle has
            connectionLine: null
        };
        
        systemGroup.add(particle);
        environmentParticles.push(particle);
    }
    
    // Create information flow visualization
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.5
    });
    
    // Create connection lines between central system and environment particles
    environmentParticles.forEach(particle => {
        const points = [
            centralSystem.position.clone(),
            particle.position.clone()
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial.clone());
        line.visible = false; // Initially hidden
        
        systemGroup.add(line);
        particle.userData.connectionLine = line;
    });
    
    // Information nodes (appear when information transfers)
    const informationNodes = [];
    
    // Create information grid visualization
    const gridContainer = svg.append('g')
        .attr('class', 'information-grid')
        .attr('transform', 'translate(20, 20)');
    
    const gridWidth = 150;
    const gridHeight = 100;
    
    // Add background for grid
    gridContainer.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', gridWidth)
        .attr('height', gridHeight)
        .attr('fill', 'rgba(0, 0, 0, 0.7)')
        .attr('rx', 5)
        .attr('ry', 5);
    
    // Add title
    gridContainer.append('text')
        .attr('x', gridWidth / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text('Quantum Information');
    
    // Create grid cells
    const cellSize = 10;
    const cellsX = 10;
    const cellsY = 5;
    
    const cells = [];
    
    for (let i = 0; i < cellsX; i++) {
        for (let j = 0; j < cellsY; j++) {
            const cell = gridContainer.append('rect')
                .attr('x', 15 + i * cellSize)
                .attr('y', 30 + j * cellSize)
                .attr('width', cellSize - 1)
                .attr('height', cellSize - 1)
                .attr('fill', 'rgba(58, 123, 213, 0.8)');
            
            cells.push({
                element: cell,
                value: 1.0, // Initial information value
                x: i,
                y: j
            });
        }
    }
    
    // Label for total information
    const infoLabel = gridContainer.append('text')
        .attr('x', gridWidth / 2)
        .attr('y', gridHeight - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .text('Total Information: 100%');
    
    // State variables
    let time = 0;
    let totalSystemInfo = 1.0;
    let totalEnvironmentInfo = 0;
    let isDecoherence = false;
    let decoherenceStartTime = 0;
    
    // Function to create information packet
    function createInfoPacket(position, targetParticle) {
        const packetGeometry = new THREE.SphereGeometry(systemSize / 20, 8, 8);
        const packetMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d2ff,
            transparent: true,
            opacity: 0.8
        });
        
        const packet = new THREE.Mesh(packetGeometry, packetMaterial);
        packet.position.copy(position);
        
        packet.userData = {
            targetParticle: targetParticle,
            startPosition: position.clone(),
            progress: 0,
            speed: 0.01 + Math.random() * 0.01,
            informationAmount: 0.05 * interactionStrength // Amount of info transferred
        };
        
        systemGroup.add(packet);
        informationNodes.push(packet);
        
        return packet;
    }
    
    // Function to update information grid
    function updateInfoGrid() {
        // Update central system cells (top half)
        const systemCells = cells.filter(cell => cell.y < Math.floor(cellsY / 2));
        const sysInfoPerCell = totalSystemInfo / systemCells.length;
        
        systemCells.forEach(cell => {
            cell.value = sysInfoPerCell;
            cell.element.attr('fill', `rgba(58, 123, 213, ${cell.value * 0.8})`);
        });
        
        // Update environment cells (bottom half)
        const envCells = cells.filter(cell => cell.y >= Math.floor(cellsY / 2));
        const envInfoPerCell = totalEnvironmentInfo / envCells.length;
        
        envCells.forEach((cell, i) => {
            cell.value = envInfoPerCell;
            
            // Color environment cells differently
            cell.element.attr('fill', `rgba(0, 210, 255, ${cell.value * 0.8})`);
        });
        
        // Update total information label
        const totalInfo = Math.round(
            (totalSystemInfo + totalEnvironmentInfo) * 100
        );
        infoLabel.text(`Total Information: ${totalInfo}%`);
    }
    
    // Function to trigger decoherence event
    function triggerDecoherence() {
        if (isDecoherence) return;
        
        isDecoherence = true;
        decoherenceStartTime = time;
        
        // Make all connection lines visible
        environmentParticles.forEach(particle => {
            particle.userData.connectionLine.visible = true;
            particle.userData.connectionLine.material.opacity = 0.1;
        });
        
        // Create several information packets
        const packetCount = 5 + Math.floor(interactionStrength * 5);
        
        for (let i = 0; i < packetCount; i++) {
            setTimeout(() => {
                // Pick a random environment particle to interact with
                const targetIndex = Math.floor(Math.random() * environmentParticles.length);
                const targetParticle = environmentParticles[targetIndex];
                
                // Create information packet
                createInfoPacket(centralSystem.position.clone(), targetParticle);
                
                // Enhance the connection line
                targetParticle.userData.connectionLine.material.opacity = 0.8;
            }, i * 200);
        }
    }
    
    // Function to reset the system
    function resetSystem() {
        isDecoherence = false;
        
        // Reset information distribution
        totalSystemInfo = 1.0;
        totalEnvironmentInfo = 0;
        
        // Update grid visualization
        updateInfoGrid();
        
        // Remove information packets
        for (let i = informationNodes.length - 1; i >= 0; i--) {
            const packet = informationNodes[i];
            systemGroup.remove(packet);
            packet.geometry.dispose();
            packet.material.dispose();
        }
        informationNodes.length = 0;
        
        // Reset connection lines
        environmentParticles.forEach(particle => {
            particle.userData.connectionLine.visible = false;
            particle.userData.information = 0;
            
            // Reset particle appearance
            particle.material.emissiveIntensity = 0.2;
        });
        
        // Reset central system
        centralSystem.scale.set(1, 1, 1);
        centralSystem.material.emissiveIntensity = 0.3;
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        time += 0.016; // Approximate delta time
        
        // Update environment particles
        environmentParticles.forEach(particle => {
            // Orbital motion
            const orbital = particle.userData.orbitalSpeed;
            const phase = particle.userData.orbitalPhase + time * orbital;
            
            // Create circular orbit around original position
            const originalPos = particle.userData.originalPosition;
            particle.position.x = originalPos.x + Math.sin(phase) * 0.2;
            particle.position.y = originalPos.y + Math.cos(phase) * 0.2;
            particle.position.z = originalPos.z + Math.sin(phase + 1) * 0.2;
            
            // Update connection line
            if (particle.userData.connectionLine.visible) {
                const linePoints = [
                    centralSystem.position.clone(),
                    particle.position.clone()
                ];
                
                particle.userData.connectionLine.geometry.dispose();
                particle.userData.connectionLine.geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
            }
            
            // Visualize information content
            if (particle.userData.information > 0) {
                // Glow based on information
                particle.material.emissiveIntensity = 0.2 + particle.userData.information;
            }
        });
        
        // Update central system visualization
        if (isDecoherence) {
            // Make the central system pulsate slower as it loses information
            const pulseStrength = 0.3 * totalSystemInfo;
            const pulseFactor = 1 + Math.sin(time * 2) * pulseStrength;
            centralSystem.scale.set(pulseFactor, pulseFactor, pulseFactor);
            
            // Dim the glow as information leaves
            centralSystem.material.emissiveIntensity = 0.3 * totalSystemInfo;
        } else {
            // Regular pulsing in coherent state
            const pulseFactor = 1 + Math.sin(time * 3) * 0.1;
            centralSystem.scale.set(pulseFactor, pulseFactor, pulseFactor);
        }
        
        // Update information packets
        for (let i = informationNodes.length - 1; i >= 0; i--) {
            const packet = informationNodes[i];
            packet.userData.progress += packet.userData.speed;
            
            if (packet.userData.progress >= 1) {
                // Transfer information
                const target = packet.userData.targetParticle;
                const infoAmount = packet.userData.informationAmount;
                
                // Update information distribution
                totalSystemInfo = Math.max(0, totalSystemInfo - infoAmount);
                target.userData.information += infoAmount;
                totalEnvironmentInfo += infoAmount;
                
                // Update grid
                updateInfoGrid();
                
                // Remove the packet
                systemGroup.remove(packet);
                packet.geometry.dispose();
                packet.material.dispose();
                informationNodes.splice(i, 1);
            } else {
                // Move along path to target
                const startPos = packet.userData.startPosition;
                const endPos = packet.userData.targetParticle.position;
                
                // Arc trajectory
                const t = packet.userData.progress;
                const arcHeight = new THREE.Vector3(0, Math.sin(t * Math.PI) * 0.5, 0);
                
                packet.position.lerpVectors(startPos, endPos, t).add(arcHeight);
                
                // Fade out at end of journey
                if (t > 0.8) {
                    packet.material.opacity = (1 - t) * 4; // Fade out in last 20%
                }
            }
        }
        
        // Randomly trigger additional information transfer during decoherence
        if (isDecoherence && Math.random() < 0.01 * decoherenceRate) {
            if (totalSystemInfo > 0.1) { // Only if system still has info to transfer
                const targetIndex = Math.floor(Math.random() * environmentParticles.length);
                const targetParticle = environmentParticles[targetIndex];
                
                // Create information packet
                createInfoPacket(centralSystem.position.clone(), targetParticle);
                
                // Enhance the connection line
                targetParticle.userData.connectionLine.material.opacity = 0.7;
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
            <h3>Quantum Information Controls</h3>
            
            <div class="slider-container">
                <label for="interaction-strength">Interaction Strength: <span id="interaction-strength-value">${interactionStrength.toFixed(2)}</span></label>
                <input type="range" id="interaction-strength" min="0.1" max="1.0" step="0.05" value="${interactionStrength}">
            </div>
            
            <div class="slider-container">
                <label for="decoherence-rate">Decoherence Rate: <span id="decoherence-rate-value">${decoherenceRate.toFixed(2)}</span></label>
                <input type="range" id="decoherence-rate" min="0.01" max="0.3" step="0.01" value="${decoherenceRate}">
            </div>
            
            <div class="slider-container">
                <label for="info-visualization">Information Visualization: <span id="info-visualization-value">${informationVisualization.toFixed(2)}</span></label>
                <input type="range" id="info-visualization" min="0.2" max="1.0" step="0.05" value="${informationVisualization}">
            </div>
            
            <button id="trigger-decoherence" class="control-button">Trigger Decoherence</button>
            <button id="reset-system" class="control-button">Reset System</button>
            
            <div class="info-text" style="margin-top: 1rem; font-size: 0.9rem; color: #aaa;">
                <p>Quantum information is never lost, but rather spreads out to the environment during decoherence.</p>
            </div>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('interaction-strength').addEventListener('input', function() {
            const newValue = parseFloat(this.value);
            document.getElementById('interaction-strength-value').textContent = newValue.toFixed(2);
            
            // Update interaction strength (affects future information transfers)
            interactionStrength = newValue;
        });
        
        document.getElementById('decoherence-rate').addEventListener('input', function() {
            const newValue = parseFloat(this.value);
            document.getElementById('decoherence-rate-value').textContent = newValue.toFixed(2);
            
            // Update decoherence rate
            decoherenceRate = newValue;
        });
        
        document.getElementById('info-visualization').addEventListener('input', function() {
            const newValue = parseFloat(this.value);
            document.getElementById('info-visualization-value').textContent = newValue.toFixed(2);
            
            // Update visualization intensity
            informationVisualization = newValue;
            updateInfoGrid(); // Refresh visualization
        });
        
        document.getElementById('trigger-decoherence').addEventListener('click', function() {
            triggerDecoherence();
        });
        
        document.getElementById('reset-system').addEventListener('click', function() {
            resetSystem();
        });
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Initialize controls, grid, and start animation
    createControls();
    updateInfoGrid();
    animate();
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', onWindowResize);
        cancelAnimationFrame(animate.id);
        renderer.dispose();
        container.removeChild(renderer.domElement);
        container.removeChild(svgContainer);
        
        // Dispose geometries and materials
        centralGeometry.dispose();
        centralMaterial.dispose();
        
        // Dispose environment particles
        environmentParticles.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
            
            if (particle.userData.connectionLine) {
                particle.userData.connectionLine.geometry.dispose();
                particle.userData.connectionLine.material.dispose();
            }
        });
        
        // Dispose information nodes
        informationNodes.forEach(node => {
            node.geometry.dispose();
            node.material.dispose();
        });
    };
}

export function cleanupVerse11() {
    // Cleanup is handled by the returned function from initVerse11
}