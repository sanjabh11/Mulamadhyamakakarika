import * as THREE from 'three';
import { gsap } from 'gsap';
import { config } from '../config.js';

export function waveCollapseAnimation(scene, camera, controls) {
    // Setup specific camera position
    camera.position.set(0, 2, 5);
    controls.update();
    
    // Create a group to hold all animation objects
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);
    
    // Wave function visualization
    const wavePoints = [];
    const waveSegments = 100;
    const waveRadius = 3;
    let waveCollapsed = false;
    let waveAmplitude = 0.5;
    
    // Create initial wave points in a circular pattern
    for (let i = 0; i <= waveSegments; i++) {
        const theta = (i / waveSegments) * Math.PI * 2;
        wavePoints.push(new THREE.Vector3(
            Math.cos(theta) * waveRadius,
            0,
            Math.sin(theta) * waveRadius
        ));
    }
    
    // Create wave geometry
    const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMaterial = new THREE.LineBasicMaterial({ 
        color: config.primaryColor,
        linewidth: 2
    });
    const waveLine = new THREE.Line(waveGeometry, waveMaterial);
    animationGroup.add(waveLine);
    
    // Particle system for the wave function
    const particlesCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleSizes = new Float32Array(particlesCount);
    
    // Initialize particles in a circular probability cloud
    for (let i = 0; i < particlesCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = waveRadius * Math.sqrt(Math.random());
        
        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // Small Y variation
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
        
        particleSizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    // Define material first with null texture
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: null }, // Initialize with null
            color: { value: new THREE.Color(config.primaryColor) }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = vec3(0.5, 0.5, 1.0);
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(color, 1.0) * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });

    // Create a simple 1x1 white pixel texture programmatically
    const pixelData = new Uint8Array([255, 255, 255, 255]); // RGBA white
    const simpleTexture = new THREE.DataTexture(pixelData, 1, 1, THREE.RGBAFormat);
    simpleTexture.needsUpdate = true;

    // Assign the simple texture to the material uniform
    particleMaterial.uniforms.pointTexture.value = simpleTexture;
    
    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    animationGroup.add(particleSystem);
    
    // Add a target sphere that will appear after collapse
    const targetGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const targetMaterial = new THREE.MeshPhongMaterial({
        color: config.secondaryColor,
        emissive: config.secondaryColor,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0
    });
    const targetSphere = new THREE.Mesh(targetGeometry, targetMaterial);
    animationGroup.add(targetSphere);
    
    // Add controls
    const controlsPanel = document.getElementById('animation-controls');
    
    // Add measure button
    const measureButton = document.createElement('button');
    measureButton.textContent = 'Measure Particle';
    measureButton.addEventListener('click', collapseWaveFunction);
    controlsPanel.appendChild(measureButton);
    
    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', resetWaveFunction);
    controlsPanel.appendChild(resetButton);
    
    // Add wave amplitude slider
    const amplitudeContainer = document.createElement('div');
    amplitudeContainer.className = 'slider-container';
    
    const amplitudeLabel = document.createElement('div');
    amplitudeLabel.className = 'slider-label';
    amplitudeLabel.textContent = 'Wave Amplitude';
    amplitudeContainer.appendChild(amplitudeLabel);
    
    const amplitudeSlider = document.createElement('input');
    amplitudeSlider.type = 'range';
    amplitudeSlider.min = '0';
    amplitudeSlider.max = '1';
    amplitudeSlider.step = '0.01';
    amplitudeSlider.value = waveAmplitude.toString();
    amplitudeSlider.addEventListener('input', function() {
        waveAmplitude = parseFloat(this.value);
    });
    amplitudeContainer.appendChild(amplitudeSlider);
    
    controlsPanel.appendChild(amplitudeContainer);
    
    // Collapse wave function to a point
    function collapseWaveFunction() {
        if (waveCollapsed) return;
        
        waveCollapsed = true;
        
        // Choose random point on circle for particle to appear
        const angle = Math.random() * Math.PI * 2;
        const targetX = Math.cos(angle) * waveRadius;
        const targetZ = Math.sin(angle) * waveRadius;
        
        targetSphere.position.set(targetX, 0, targetZ);
        
        // Animate particles moving to the target
        const positions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            
            gsap.to(positions, {
                [i3]: targetX,
                [i3 + 2]: targetZ,
                duration: 1 + Math.random(),
                ease: "power2.inOut"
            });
        }
        
        // Fade in the target sphere
        gsap.to(targetMaterial, {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut"
        });
        
        // Update the wave to be flat
        gsap.to(waveLine.scale, {
            y: 0.01,
            duration: 1,
            ease: "power2.inOut"
        });
    }
    
    // Reset the wave function
    function resetWaveFunction() {
        waveCollapsed = false;
        
        // Reset particle positions
        const positions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particlesCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = waveRadius * Math.sqrt(Math.random());
            
            gsap.to(positions, {
                [i * 3]: Math.cos(angle) * radius,
                [i * 3 + 1]: (Math.random() - 0.5) * 0.2,
                [i * 3 + 2]: Math.sin(angle) * radius,
                duration: 1 + Math.random() * 0.5,
                ease: "power2.out"
            });
        }
        
        // Fade out the target sphere
        gsap.to(targetMaterial, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        });
        
        // Reset the wave
        gsap.to(waveLine.scale, {
            y: 1,
            duration: 1,
            ease: "power2.inOut"
        });
    }
    
    // Animation update function
    function update(deltaTime) {
        if (!waveCollapsed) {
            // Animate wave
            const positions = waveGeometry.attributes.position.array;
            const time = Date.now() * 0.001;
            
            for (let i = 0; i <= waveSegments; i++) {
                const idx = i * 3;
                const theta = (i / waveSegments) * Math.PI * 2;
                
                // Calculate base positions
                const x = Math.cos(theta) * waveRadius;
                const z = Math.sin(theta) * waveRadius;
                
                // Add wave motion
                positions[idx + 1] = Math.sin(theta * 4 + time * 2) * waveAmplitude;
                
                // Update positions
                positions[idx] = x;
                positions[idx + 2] = z;
            }
            
            waveGeometry.attributes.position.needsUpdate = true;
        }
        
        // Update particle positions for drawing
        particlesGeometry.attributes.position.needsUpdate = true;
        
        // Rotate the entire animation group slowly
        animationGroup.rotation.y += deltaTime * 0.2;
    }
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners
        measureButton.removeEventListener('click', collapseWaveFunction);
        resetButton.removeEventListener('click', resetWaveFunction);
        
        // Dispose geometries and materials
        waveGeometry.dispose();
        waveMaterial.dispose();
        particlesGeometry.dispose();
        particleMaterial.dispose();
        targetGeometry.dispose();
        targetMaterial.dispose();
    }
    
    return { update, cleanup };
}

