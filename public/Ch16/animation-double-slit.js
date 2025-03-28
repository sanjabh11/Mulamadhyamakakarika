// animation-double-slit.js
import { verses } from '/config.js';

export function createDoubleSlit(localColors, animationContainer, THREE, animationParams) {
    const container = animationContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(localColors.background);

    // Setup camera with better perspective
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 0, -1);

    // Create better looking double slit setup with enhanced materials
    const barrierGeometry = new THREE.BoxGeometry(3, 2, 0.2);
    const barrierMaterial = new THREE.MeshPhysicalMaterial({ 
        color: localColors.primary, 
        transparent: true, 
        opacity: 0.8,
        metalness: 0.3,
        roughness: 0.5
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    
    // Create slits by cutting into the barrier
    const slitGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
    const slitMaterial = new THREE.MeshBasicMaterial({ 
        color: localColors.background,
        transparent: true,
        opacity: 0
    });
    
    const slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit1.position.set(0, 0.5, 0);
    barrier.add(slit1);
    
    const slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit2.position.set(0, -0.5, 0);
    barrier.add(slit2);
    
    scene.add(barrier);

    // Create better looking screen with interference pattern
    const screenGeometry = new THREE.PlaneGeometry(4, 2, 100, 1);
    const screenMaterial = new THREE.MeshPhysicalMaterial({ 
        color: localColors.secondary, 
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = -2;
    scene.add(screen);

    // Add texture for interference pattern
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 512;
    patternCanvas.height = 128;
    const patternContext = patternCanvas.getContext('2d');
    const patternTexture = new THREE.CanvasTexture(patternCanvas);
    screenMaterial.map = patternTexture;

    // Improved particle system
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = 2; // Start at emitter
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        particlePositions[i * 3 + 2] = 1;
        particleSizes[i] = Math.random() * 0.05 + 0.02;
        
        // Particle color gradient
        const color = new THREE.Color(localColors.tertiary);
        color.multiplyScalar(0.5 + Math.random() * 0.5);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleTexture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5gsdFDgj+Wgn5QAAAltJREFUWMPtlk9IVFEUxn/n3jdTOimJOkGQYDSLymKCMKWgP0SSQNEiahURFkG2aNeiRRBR2yKojZWLVtGiwiIIrEUUZk6ZFkFZZhqV5Yxv5p5246gzzbyZYRaGC2dz7z33+853vnvuFVUlTLNCZQdKA/5fA6ZhWAHkx1V+GnAUTAAW4KlqPBs4kRrQN9XZRCSgqpl5KSJnPEP6nJH9/X17gCpgF7AbKAc2APM7WoEfwDDwCegHeoGeZDJZ73neRxFJTMOZNyJAROqBx8DWXAENmAImVfU9UOu67htgUVwiskREbgCvF0h+JlLA9kQiMQB4cxowDEOASuBVWPIzmVbZ53ne7Wk2Tdf1VPWl4zgKXACcsPVnEDeAJsdxUoZhHM6agqNAZXSK6bqucwJYnZcBEUkCP0WkCShbaPVAgYi0pVKpu6ZpbplR9wsi4sG0/mP94pOeC4YRuai12uLzZcYcCNxiNBqD1tpIoATuUG4eGMF1P3oQ3sBiE7C2MGvdPdR5G0wD1gaAxxnoSEK3NhiUsBaYUQn4g+1sMIyIATQWFfWnlpaelVjsaQgDIkArUG8Y0ZMABw+e8hsa7voPHjSJyCIRORWkAlR1O9ALrA+LXlW/A+1AE0CzZV312tv3o46Tyup7ROShiJxW1Rdaf1WDvgGvQhYfwDmgy7KsXnT0pOM40Nz8MFFR8RGtLwX2A15UVfuB06raxWw7pwOsA3YAFcAWYDNQSuC9YsAPoAP4APQBPcBgSgVctxPHGQIGF3rxRCmY6+eyDvw7AxGnYE4DS30c/waGXHIKBX1IMQAAAABJRU5ErkJggg==');
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    // Create wave visualization with shader material for better effect
    const waveGeometry = new THREE.PlaneGeometry(4, 2, 100, 1);
    
    const waveShader = {
        uniforms: {
            color: { value: new THREE.Color(localColors.tertiary) },
            time: { value: 0.0 },
            amplitude: { value: 0.3 },
            frequency: { value: 2.0 },
            opacity: { value: 0.5 }
        },
        vertexShader: `
            uniform float time;
            uniform float amplitude;
            uniform float frequency;
            
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                
                // Calculate wave effect
                float wave = sin(position.x * frequency + time) * amplitude;
                
                // Apply wave to y position
                vec3 newPosition = position;
                newPosition.y += wave;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            
            varying vec2 vUv;
            
            void main() {
                // Gradient effect
                float intensity = 1.0 - abs(vUv.y - 0.5) * 2.0;
                
                gl_FragColor = vec4(color, opacity * intensity);
            }
        `
    };
    
    const waveMaterial = new THREE.ShaderMaterial({
        uniforms: waveShader.uniforms,
        vertexShader: waveShader.vertexShader,
        fragmentShader: waveShader.fragmentShader,
        transparent: true,
        wireframe: true
    });
    
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.position.z = 1;
    scene.add(wave);

    // Better lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(localColors.primary, 0.3);
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);

    // Renderer with post-processing effects
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Enhanced animation parameters
    let time = 0;
    let wavesActive = true;
    let particlesArray = [];
    let particleSpeed = 0.05;
    let particleEmissionRate = 0.1;
    let particleEmissionCounter = 0;
    
    // Control panel for interactive adjustments
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'absolute';
    controlPanel.style.top = '10px';
    controlPanel.style.right = '10px';
    controlPanel.style.display = 'flex';
    controlPanel.style.flexDirection = 'column';
    controlPanel.style.zIndex = '100';
    
    const speedControl = document.createElement('input');
    speedControl.type = 'range';
    speedControl.min = '0.01';
    speedControl.max = '0.2';
    speedControl.step = '0.01';
    speedControl.value = particleSpeed;
    speedControl.style.width = '100px';
    speedControl.addEventListener('input', (e) => {
        particleSpeed = parseFloat(e.target.value);
    });
    
    const speedLabel = document.createElement('div');
    speedLabel.textContent = 'Particle Speed';
    speedLabel.style.color = 'white';
    speedLabel.style.fontSize = '12px';
    speedLabel.style.textAlign = 'center';
    
    const rateControl = document.createElement('input');
    rateControl.type = 'range';
    rateControl.min = '0.01';
    rateControl.max = '0.5';
    rateControl.step = '0.01';
    rateControl.value = particleEmissionRate;
    rateControl.style.width = '100px';
    rateControl.addEventListener('input', (e) => {
        particleEmissionRate = parseFloat(e.target.value);
    });
    
    const rateLabel = document.createElement('div');
    rateLabel.textContent = 'Emission Rate';
    rateLabel.style.color = 'white';
    rateLabel.style.fontSize = '12px';
    rateLabel.style.textAlign = 'center';
    
    controlPanel.appendChild(speedLabel);
    controlPanel.appendChild(speedControl);
    controlPanel.appendChild(rateLabel);
    controlPanel.appendChild(rateControl);
    container.appendChild(controlPanel);

    function updatePatternTexture() {
        patternContext.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
        patternContext.fillStyle = `rgb(${localColors.tertiary & 0xFF}, ${(localColors.tertiary >> 8) & 0xFF}, ${(localColors.tertiary >> 16) & 0xFF})`;
        
        const centerY = patternCanvas.height / 2;
        const intensity = wavesActive ? 1.0 : 0.3;
        
        for (let x = 0; x < patternCanvas.width; x++) {
            const normalizedX = (x / patternCanvas.width) * 10 - 5;
            const sinVal = Math.sin(normalizedX * 5 + time * 2) * Math.sin(normalizedX * 3 - time);
            const height = sinVal * 30 * intensity;
            
            patternContext.globalAlpha = Math.abs(sinVal) * intensity;
            patternContext.fillRect(x, centerY - height, 1, height * 2);
        }
        
        patternTexture.needsUpdate = true;
    }

    function createParticle() {
        // Create particle positions at random emission points
        const y = (Math.random() - 0.5) * 1.8;
        particleEmissionCounter += particleEmissionRate;
        
        if (particleEmissionCounter >= 1) {
            particleEmissionCounter = 0;
            
            const particlePosition = new THREE.Vector3(2, y, 1);
            particlePositions.set([particlePosition.x, particlePosition.y, particlePosition.z], 0);
            
            // Update particle system
            for (let i = 0; i < particleCount - 1; i++) {
                particlePositions[i * 3] = particlePositions[(i + 1) * 3];
                particlePositions[i * 3 + 1] = particlePositions[(i + 1) * 3 + 1];
                particlePositions[i * 3 + 2] = particlePositions[(i + 1) * 3 + 2];
            }
            
            particlesGeometry.attributes.position.needsUpdate = true;
        }
    }

    function updateParticles() {
        // Move particles
        for (let i = 0; i < particleCount; i++) {
            if (particlePositions[i * 3] > -2) {
                particlePositions[i * 3] -= particleSpeed;
                
                // Apply wave pattern when passing through slits
                if (particlePositions[i * 3] < 0 && particlePositions[i * 3] > -0.2) {
                    // Determine which slit the particle goes through
                    const throughTopSlit = Math.abs(particlePositions[i * 3 + 1] - 0.5) < 0.4;
                    const throughBottomSlit = Math.abs(particlePositions[i * 3 + 1] + 0.5) < 0.4;
                    
                    if (throughTopSlit || throughBottomSlit) {
                        // Add slight randomness to trajectory after passing through slit
                        if (wavesActive) {
                            particlePositions[i * 3 + 1] += (Math.random() - 0.5) * 0.1;
                        }
                    } else {
                        // Particles hitting the barrier become invisible
                        particlePositions[i * 3] = -10; // Move far away
                    }
                }
                
                // Create interference pattern on screen
                if (particlePositions[i * 3] <= -1.9) {
                    // Fix position on screen
                    particlePositions[i * 3] = -2;
                    
                    // Draw on interference pattern
                    const screenX = (particlePositions[i * 3 + 1] / 2 + 0.5) * patternCanvas.width;
                    const screenY = patternCanvas.height / 2;
                    
                    patternContext.globalAlpha = 0.2;
                    patternContext.fillStyle = `rgb(${particleColors[i * 3] * 255}, ${particleColors[i * 3 + 1] * 255}, ${particleColors[i * 3 + 2] * 255})`;
                    patternContext.fillRect(screenX, screenY, 2, 2);
                    patternTexture.needsUpdate = true;
                }
            }
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
    }

    function updateWave() {
        time += 0.02;
        
        // Update wave shader time uniform
        waveMaterial.uniforms.time.value = time;
        waveMaterial.uniforms.opacity.value = wavesActive ? 0.5 : 0;
    }

    function init() {
        // Add interaction functionality with better hints
        const interactionHint = document.createElement('div');
        interactionHint.className = 'interaction-hint';
        interactionHint.textContent = verses[0].interactionHint;
        container.appendChild(interactionHint);
        
        // Create better toggle controls
        const waveToggle = document.createElement('button');
        waveToggle.className = 'control-button';
        waveToggle.textContent = 'Toggle Wave/Particle';
        waveToggle.style.position = 'absolute';
        waveToggle.style.bottom = '10px';
        waveToggle.style.right = '10px';
        waveToggle.addEventListener('click', () => {
            wavesActive = !wavesActive;
            wave.visible = wavesActive;
            interactionHint.classList.toggle('active');
            
            // Clear pattern when toggling
            if (!wavesActive) {
                patternContext.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
                patternTexture.needsUpdate = true;
            }
        });
        container.appendChild(waveToggle);

        // Reset detector screen button
        const clearButton = document.createElement('button');
        clearButton.className = 'control-button';
        clearButton.textContent = 'Clear Detector';
        clearButton.style.position = 'absolute';
        clearButton.style.bottom = '10px';
        clearButton.style.right = '160px';
        clearButton.addEventListener('click', () => {
            patternContext.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
            patternTexture.needsUpdate = true;
        });
        container.appendChild(clearButton);
    }

    function animate() {
        time += 0.02;
        
        createParticle();
        updateParticles();
        updateWave();
        updatePatternTexture();
        
        renderer.render(scene, camera);
    }

    function cleanup() {
        renderer.dispose();
        particleMaterial.dispose();
        waveMaterial.dispose();
        particlesGeometry.dispose();
        waveGeometry.dispose();
    }

    return { init, animate, cleanup, scene, camera, renderer };
}