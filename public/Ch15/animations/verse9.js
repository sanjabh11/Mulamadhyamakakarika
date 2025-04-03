import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as p5 from 'p5';

// Wave Packet Spreading Animation for Verse 9
export function initVerse9(container, controlsContainer, options) {
    // Create Three.js scene for 3D background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Settings
    const initialWidth = options.initialWidth || 0.5;
    const spreadingRate = options.spreadingRate || 0.05;
    const waveAmplitude = options.waveAmplitude || 1.0;
    const timeScale = options.timeScale || 1.0;
    
    // Create p5 canvas for 2D wave visualization
    const p5Container = document.createElement('div');
    p5Container.style.position = 'absolute';
    p5Container.style.top = '0';
    p5Container.style.left = '0';
    p5Container.style.width = '100%';
    p5Container.style.height = '100%';
    p5Container.style.pointerEvents = 'none';
    container.appendChild(p5Container);
    
    // Create 3D grid for reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);
    
    // Create particle group
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // State variables
    let time = 0;
    let particleWidth = initialWidth;
    let isPaused = false;
    let showPosition = true;
    let showMomentum = true;
    let showUncertainty = true;
    
    // p5 instance
    let sketch = new p5((p) => {
        p.setup = function() {
            p.createCanvas(container.clientWidth, container.clientHeight);
            p.colorMode(p.HSB, 255);
            p.textSize(14);
            p.textAlign(p.CENTER, p.CENTER);
        };
        
        p.draw = function() {
            if (isPaused) return;
            
            p.clear();
            
            // Draw position space representation (top)
            if (showPosition) {
                drawPositionSpace(p);
            }
            
            // Draw momentum space representation (bottom)
            if (showMomentum) {
                drawMomentumSpace(p);
            }
            
            // Draw uncertainty product
            if (showUncertainty) {
                drawUncertaintyRelation(p);
            }
        };
        
        // Draw wave packet in position space
        function drawPositionSpace(p) {
            const y = p.height * 0.3;
            const width = p.width * 0.8;
            const height = p.height * 0.2;
            
            p.push();
            p.translate(p.width/2, y);
            
            // Draw axis
            p.stroke(150);
            p.strokeWeight(1);
            p.line(-width/2, 0, width/2, 0);
            p.line(0, -height/2, 0, height/2);
            
            // Label
            p.noStroke();
            p.fill(200);
            p.text("Position Space (Δx increases with time)", 0, -height/2 - 20);
            
            // Draw Gaussian wave packet
            p.noFill();
            p.stroke(150, 200, 255);
            p.strokeWeight(2);
            p.beginShape();
            
            const packetWidth = particleWidth * 100;
            
            for (let x = -width/2; x <= width/2; x += 2) {
                const xNorm = x / 100;
                const amplitude = waveAmplitude * Math.exp(-(xNorm * xNorm) / (2 * packetWidth * packetWidth)) *
                                  Math.cos(5 * xNorm - time);
                p.vertex(x, -amplitude * height/3);
            }
            
            p.endShape();
            
            // Draw envelope
            p.noFill();
            p.stroke(150, 200, 255, 100);
            p.strokeWeight(1);
            p.beginShape();
            
            for (let x = -width/2; x <= width/2; x += 2) {
                const xNorm = x / 100;
                const envelope = waveAmplitude * Math.exp(-(xNorm * xNorm) / (2 * packetWidth * packetWidth));
                p.vertex(x, -envelope * height/3);
            }
            
            p.endShape();
            
            p.beginShape();
            for (let x = -width/2; x <= width/2; x += 2) {
                const xNorm = x / 100;
                const envelope = waveAmplitude * Math.exp(-(xNorm * xNorm) / (2 * packetWidth * packetWidth));
                p.vertex(x, envelope * height/3);
            }
            
            p.endShape();
            
            // Show uncertainty value
            p.noStroke();
            p.fill(150, 200, 255);
            p.text(`Δx = ${packetWidth.toFixed(2)}`, width/2 - 70, -height/2 + 20);
            
            p.pop();
        }
        
        // Draw wave packet in momentum space
        function drawMomentumSpace(p) {
            const y = p.height * 0.7;
            const width = p.width * 0.8;
            const height = p.height * 0.2;
            
            p.push();
            p.translate(p.width/2, y);
            
            // Draw axis
            p.stroke(150);
            p.strokeWeight(1);
            p.line(-width/2, 0, width/2, 0);
            p.line(0, -height/2, 0, height/2);
            
            // Label
            p.noStroke();
            p.fill(200);
            p.text("Momentum Space (Δp decreases with time)", 0, -height/2 - 20);
            
            // Draw momentum space representation (Fourier transform of position)
            p.noFill();
            p.stroke(255, 150, 200);
            p.strokeWeight(2);
            p.beginShape();
            
            // Momentum width is inversely proportional to position width
            const momentumWidth = 1 / (particleWidth * 4);
            
            for (let k = -width/2; k <= width/2; k += 2) {
                const kNorm = k / 50;
                const amplitude = Math.exp(-(kNorm * kNorm) / (2 * momentumWidth * momentumWidth));
                p.vertex(k, -amplitude * height/3);
            }
            
            p.endShape();
            
            // Show uncertainty value
            p.noStroke();
            p.fill(255, 150, 200);
            p.text(`Δp = ${momentumWidth.toFixed(4)}`, width/2 - 70, -height/2 + 20);
            
            p.pop();
        }
        
        // Draw uncertainty relation
        function drawUncertaintyRelation(p) {
            const x = p.width * 0.1;
            const y = p.height * 0.5;
            
            p.push();
            p.translate(x, y);
            
            p.noStroke();
            p.fill(255, 220, 150);
            
            // Momentum width is inversely proportional to position width
            const momentumWidth = 1 / (particleWidth * 4);
            const uncertaintyProduct = particleWidth * 100 * momentumWidth;
            
            p.text(`Uncertainty Relation: Δx · Δp = ${uncertaintyProduct.toFixed(2)} ≥ ℏ/2`, 100, 0);
            
            p.pop();
        }
    }, p5Container);
    
    // Create 3D visualization of wave packet
    function createWavePacket() {
        // Clear previous particles
        while (particleGroup.children.length > 0) {
            const child = particleGroup.children[0];
            particleGroup.remove(child);
            child.geometry.dispose();
            child.material.dispose();
        }
        
        // Create particles distributed according to wave packet
        const particleCount = 200;
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        
        for (let i = 0; i < particleCount; i++) {
            // Generate position from Gaussian distribution
            let x, y, z;
            let r, phi, theta;
            
            // Use Box-Muller transform for normal distribution
            r = particleWidth * Math.sqrt(-2 * Math.log(Math.random()));
            phi = 2 * Math.PI * Math.random();
            theta = Math.PI * Math.random();
            
            x = r * Math.sin(theta) * Math.cos(phi);
            y = r * Math.sin(theta) * Math.sin(phi);
            z = r * Math.cos(theta);
            
            // Create particle with color based on position
            const hue = (r / particleWidth) * 0.3 + 0.6; // Blue to purple
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
            
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(x, y, z);
            particleGroup.add(particle);
        }
    }
    
    // Animation loop
    function animate() {
        const animationId = requestAnimationFrame(animate);
        
        if (!isPaused) {
            // Update time
            time += 0.01 * timeScale;
            
            // Update particle width (spreading over time)
            particleWidth = initialWidth + spreadingRate * time;
            
            // Create wave packet visualization
            createWavePacket();
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
            <h3>Wave Packet Controls</h3>
            
            <div class="slider-container">
                <label for="initial-width">Initial Width: <span id="initial-width-value">${initialWidth.toFixed(2)}</span></label>
                <input type="range" id="initial-width" min="0.1" max="1.0" step="0.05" value="${initialWidth}">
            </div>
            
            <div class="slider-container">
                <label for="spreading-rate">Spreading Rate: <span id="spreading-rate-value">${spreadingRate.toFixed(3)}</span></label>
                <input type="range" id="spreading-rate" min="0.001" max="0.1" step="0.001" value="${spreadingRate}">
            </div>
            
            <div class="slider-container">
                <label for="wave-amplitude">Wave Amplitude: <span id="wave-amplitude-value">${waveAmplitude.toFixed(1)}</span></label>
                <input type="range" id="wave-amplitude" min="0.1" max="2.0" step="0.1" value="${waveAmplitude}">
            </div>
            
            <div class="slider-container">
                <label for="time-scale">Time Scale: <span id="time-scale-value">${timeScale.toFixed(1)}</span></label>
                <input type="range" id="time-scale" min="0.1" max="3.0" step="0.1" value="${timeScale}">
            </div>
            
            <div class="checkbox-container">
                <label>
                    <input type="checkbox" id="show-position" checked>
                    Show Position Space
                </label>
            </div>
            
            <div class="checkbox-container">
                <label>
                    <input type="checkbox" id="show-momentum" checked>
                    Show Momentum Space
                </label>
            </div>
            
            <div class="checkbox-container">
                <label>
                    <input type="checkbox" id="show-uncertainty" checked>
                    Show Uncertainty Relation
                </label>
            </div>
            
            <button id="pause-animation" class="control-button">Pause/Resume</button>
            <button id="reset-time" class="control-button">Reset Time</button>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        
        // Add event listeners
        document.getElementById('initial-width').addEventListener('input', function() {
            initialWidth = parseFloat(this.value);
            document.getElementById('initial-width-value').textContent = initialWidth.toFixed(2);
            
            // Reset time to see effect of initial width
            time = 0;
            particleWidth = initialWidth;
        });
        
        document.getElementById('spreading-rate').addEventListener('input', function() {
            spreadingRate = parseFloat(this.value);
            document.getElementById('spreading-rate-value').textContent = spreadingRate.toFixed(3);
        });
        
        document.getElementById('wave-amplitude').addEventListener('input', function() {
            waveAmplitude = parseFloat(this.value);
            document.getElementById('wave-amplitude-value').textContent = waveAmplitude.toFixed(1);
        });
        
        document.getElementById('time-scale').addEventListener('input', function() {
            timeScale = parseFloat(this.value);
            document.getElementById('time-scale-value').textContent = timeScale.toFixed(1);
        });
        
        document.getElementById('show-position').addEventListener('change', function() {
            showPosition = this.checked;
        });
        
        document.getElementById('show-momentum').addEventListener('change', function() {
            showMomentum = this.checked;
        });
        
        document.getElementById('show-uncertainty').addEventListener('change', function() {
            showUncertainty = this.checked;
        });
        
        document.getElementById('pause-animation').addEventListener('click', function() {
            isPaused = !isPaused;
            this.textContent = isPaused ? 'Resume' : 'Pause';
        });
        
        document.getElementById('reset-time').addEventListener('click', function() {
            time = 0;
            particleWidth = initialWidth;
        });
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        
        // Also resize p5 canvas
        sketch.resizeCanvas(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Initialize controls and start animation
    createControls();
    animate();
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', onWindowResize);
        cancelAnimationFrame(animate.id);
        renderer.dispose();
        container.removeChild(renderer.domElement);
        container.removeChild(p5Container);
        
        // Remove p5 instance
        sketch.remove();
        
        // Dispose geometries and materials
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        particleGeometry.dispose();
    };
}

export function cleanupVerse9() {
    // Cleanup is handled by the returned function from initVerse9
}