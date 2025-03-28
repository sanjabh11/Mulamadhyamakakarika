import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config, uiConfig } from './config.js';

// Global variables for current animation
let currentAnimation = null;
let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let animationId = null;

// Dispose current animation resources
export function disposeCurrentAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (currentAnimation && typeof currentAnimation.dispose === 'function') {
        currentAnimation.dispose();
    }
    
    if (scene) {
        disposeScene(scene);
        scene = null;
    }
    
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
    
    if (controls) {
        controls.dispose();
        controls = null;
    }
    
    camera = null;
    currentAnimation = null;
}

// Helper function to dispose all objects in a scene
function disposeScene(scene) {
    scene.traverse((object) => {
        if (object.geometry) {
            object.geometry.dispose();
        }
        
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => disposeMaterial(material));
            } else {
                disposeMaterial(object.material);
            }
        }
    });
}

// Helper function to dispose material resources
function disposeMaterial(material) {
    if (material.map) material.map.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.envMap) material.envMap.dispose();
    
    material.dispose();
}

// Setup common Three.js environment
function setupThreeEnvironment() {
    const container = document.getElementById('animation-container');
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c1e);
    scene.fog = new THREE.FogExp2(0x0c0c1e, 0.02);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 15;
    
    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 50;
    controls.autoRotate = uiConfig.autoRotateObjects;
    controls.autoRotateSpeed = uiConfig.rotationSpeed * 5;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light with shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Add point light for better highlights
    const pointLight = new THREE.PointLight(0x7e3ff2, 1, 20);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
    
    // Add loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    container.appendChild(loadingSpinner);
    
    // Hide spinner after scene is ready
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
    }, 1000);
    
    // Add window resize handler
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return { container, renderer, scene, camera, controls };
}

//=========================================
// VERSE 1: QUANTUM ERASER EXPERIMENT
//=========================================
export function initQuantumEraserAnimation() {
    disposeCurrentAnimation();
    
    const { container, renderer, scene, camera, controls } = setupThreeEnvironment();
    
    // Create experiment elements
    // Light source
    const sourceGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sourceMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        emissive: 0x4361ee,
        emissiveIntensity: 1
    });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.set(0, 0, -10);
    scene.add(source);
    
    // Double slit barrier
    const barrierGeometry = new THREE.BoxGeometry(10, 5, 0.2);
    const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.set(0, 0, -5);
    scene.add(barrier);
    
    // Create slits
    const slitWidth = config.quantumEraser.slitWidth;
    const slitHeight = 2;
    const slitDistance = config.quantumEraser.slitDistance;
    
    const slitGeometry = new THREE.BoxGeometry(slitWidth, slitHeight, 0.3);
    const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit1.position.set(-slitDistance/2, 0, -5);
    scene.add(slit1);
    
    const slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit2.position.set(slitDistance/2, 0, -5);
    scene.add(slit2);
    
    // Create screen
    const screenGeometry = new THREE.PlaneGeometry(10, 5);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 5);
    scene.add(screen);
    
    // Create detector/eraser objects
    const detectorGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const detectorMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    
    const detector1 = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector1.position.set(-slitDistance/2, 0, -4);
    detector1.visible = false;
    scene.add(detector1);
    
    const detector2 = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector2.position.set(slitDistance/2, 0, -4);
    detector2.visible = false;
    scene.add(detector2);
    
    const eraserGeometry = new THREE.BoxGeometry(1, 1, 1);
    const eraserMaterial = new THREE.MeshPhongMaterial({ color: 0x4cc9f0 });
    
    const eraser = new THREE.Mesh(eraserGeometry, eraserMaterial);
    eraser.position.set(0, 0, 0);
    eraser.visible = false;
    scene.add(eraser);
    
    // Create interference pattern on screen
    const patternTexture = createInterferencePatternTexture();
    const patternMaterial = new THREE.MeshBasicMaterial({
        map: patternTexture,
        transparent: true,
        opacity: 0.8
    });
    const patternPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(9.8, 4.8),
        patternMaterial
    );
    patternPlane.position.set(0, 0, 5.01);
    patternPlane.visible = false;
    scene.add(patternPlane);
    
    // Create particles
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: config.quantumEraser.particleColor,
        emissive: config.quantumEraser.particleColor,
        emissiveIntensity: 0.5
    });
    
    function createParticle() {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.position.copy(source.position);
        
        // Generate a trail for the particle
        const trailPoints = [];
        for (let i = 0; i < 10; i++) {
            trailPoints.push(
                new THREE.Vector3(
                    source.position.x + (Math.random() - 0.5) * 0.05,
                    source.position.y + (Math.random() - 0.5) * 0.05,
                    source.position.z - i * 0.1
                )
            );
        }
        
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
        const trailMaterial = new THREE.LineBasicMaterial({ 
            color: config.quantumEraser.particleColor,
            transparent: true,
            opacity: 0.3
        });
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(trail);
        
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                0.1 + Math.random() * 0.1
            ),
            isDetected: false,
            path: Math.random() < 0.5 ? 1 : 2, // Which slit the particle will go through
            trail: trail,
            trailPoints: trailPoints
        };
        
        scene.add(particle);
        particles.push(particle);
        return particle;
    }
    
    // Create helper text
    const helperTextElement = document.createElement('div');
    helperTextElement.style.position = 'absolute';
    helperTextElement.style.top = '10px';
    helperTextElement.style.left = '10px';
    helperTextElement.style.color = 'white';
    helperTextElement.style.fontFamily = 'Arial, sans-serif';
    helperTextElement.style.padding = '5px';
    helperTextElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    helperTextElement.style.borderRadius = '4px';
    container.appendChild(helperTextElement);
    
    let lastParticleTime = 0;
    const clock = new THREE.Clock();
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Create new particles based on photon rate
        if (elapsedTime - lastParticleTime > 1 / (config.quantumEraser.photonRate * 0.1)) {
            createParticle();
            lastParticleTime = elapsedTime;
        }
        
        // Update detector and eraser visibility based on config
        detector1.visible = config.quantumEraser.measurementOn;
        detector2.visible = config.quantumEraser.measurementOn;
        eraser.visible = config.quantumEraser.eraserOn;
        
        // Update pattern visibility
        patternPlane.visible = (!config.quantumEraser.measurementOn || config.quantumEraser.eraserOn);
        
        // Update helper text
        helperTextElement.textContent = `Measurement: ${config.quantumEraser.measurementOn ? 'ON' : 'OFF'} | Eraser: ${config.quantumEraser.eraserOn ? 'ON' : 'OFF'}`;
        
        // Update particles
        particles.forEach((particle, index) => {
            particle.position.add(particle.userData.velocity);
            
            // When particle reaches barrier plane
            if (particle.position.z > -5 && particle.position.z < -4.9 && !particle.userData.passedBarrier) {
                particle.userData.passedBarrier = true;
                
                // Check if particle goes through a slit
                let goesThrough = false;
                if (particle.userData.path === 1 && 
                    Math.abs(particle.position.x + slitDistance/2) < slitWidth/2 && 
                    Math.abs(particle.position.y) < slitHeight/2) {
                    goesThrough = true;
                } else if (particle.userData.path === 2 && 
                           Math.abs(particle.position.x - slitDistance/2) < slitWidth/2 && 
                           Math.abs(particle.position.y) < slitHeight/2) {
                    goesThrough = true;
                }
                
                if (!goesThrough) {
                    scene.remove(particle);
                    particles.splice(index, 1);
                    return;
                }
                
                // If measurement is on, change trajectory
                if (config.quantumEraser.measurementOn && !config.quantumEraser.eraserOn) {
                    // Add slight randomness to straight path
                    particle.userData.velocity.x = (Math.random() - 0.5) * 0.02;
                    particle.userData.velocity.y = (Math.random() - 0.5) * 0.02;
                    
                    // Visual effect of detection
                    if (particle.userData.path === 1) {
                        detector1.material.emissive = new THREE.Color(0xff0000);
                        setTimeout(() => {
                            detector1.material.emissive = new THREE.Color(0x000000);
                        }, 100);
                    } else {
                        detector2.material.emissive = new THREE.Color(0xff0000);
                        setTimeout(() => {
                            detector2.material.emissive = new THREE.Color(0x000000);
                        }, 100);
                    }
                } else {
                    // Interference behavior - adjust trajectory for wave-like behavior
                    const angle = Math.random() * Math.PI * 0.4 - Math.PI * 0.2;
                    particle.userData.velocity.x = Math.sin(angle) * 0.1;
                    particle.userData.velocity.z = Math.cos(angle) * 0.1;
                }
            }
            
            // If eraser is active and particle passes it
            if (config.quantumEraser.eraserOn && 
                particle.position.z > -0.5 && 
                particle.position.z < 0.5 && 
                !particle.userData.eraserPassed) {
                particle.userData.eraserPassed = true;
                
                // Eraser effect: adjust trajectory for interference pattern
                if (config.quantumEraser.measurementOn) {
                    const angle = Math.random() * Math.PI * 0.4 - Math.PI * 0.2;
                    particle.userData.velocity.x = Math.sin(angle) * 0.1;
                    particle.userData.velocity.z = Math.cos(angle) * 0.1;
                    
                    // Visual effect
                    eraser.material.emissive = new THREE.Color(0x00ffff);
                    setTimeout(() => {
                        eraser.material.emissive = new THREE.Color(0x000000);
                    }, 100);
                }
            }
            
            // When particle hits screen
            if (particle.position.z > 5) {
                scene.remove(particle);
                particles.splice(index, 1);
            }
        });
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Function to create interference pattern texture
    function createInterferencePatternTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Fill with transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create interference pattern
        const lambda = 20; // Wavelength
        const k = 2 * Math.PI / lambda;
        const d = 50; // Slit separation in pixels
        const L = 300; // Distance to screen
        
        // Create gradient for more vibrant interference pattern
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#3a0ca3');
        gradient.addColorStop(0.5, '#7209b7');
        gradient.addColorStop(1, '#f72585');
        
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                // Center coordinates
                const x0 = x - canvas.width / 2;
                const y0 = y - canvas.height / 2;
                
                // Distance from each slit
                const r1 = Math.sqrt(Math.pow(x0 - d/2, 2) + Math.pow(y0, 2) + Math.pow(L, 2));
                const r2 = Math.sqrt(Math.pow(x0 + d/2, 2) + Math.pow(y0, 2) + Math.pow(L, 2));
                
                // Phase difference and intensity
                const phaseDiff = k * (r2 - r1);
                const intensity = Math.pow(Math.cos(phaseDiff / 2), 2);
                
                // Draw with appropriate color and alpha
                const alpha = intensity * 0.7;
                ctx.fillStyle = `rgba(114, 9, 183, ${alpha})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    // Start animation
    clock.start();
    animate();
    
    // Store current animation and return cleanup function
    currentAnimation = {
        dispose: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (helperTextElement.parentNode === container) {
                container.removeChild(helperTextElement);
            }
        }
    };
}

//=========================================
// VERSE 2: DELAYED CHOICE EXPERIMENT
//=========================================
export function initDelayedChoiceAnimation() {
    disposeCurrentAnimation();
    
    const { container, renderer, scene, camera, controls } = setupThreeEnvironment();
    
    // Create experiment elements
    // Light source
    const sourceGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sourceMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        emissive: 0x4361ee,
        emissiveIntensity: 1
    });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.set(0, 0, -10);
    scene.add(source);
    
    // Double slit barrier
    const barrierGeometry = new THREE.BoxGeometry(10, 5, 0.2);
    const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.set(0, 0, -5);
    scene.add(barrier);
    
    // Create slits
    const slitWidth = 0.2;
    const slitHeight = 2;
    const slitDistance = 1;
    
    const slitGeometry = new THREE.BoxGeometry(slitWidth, slitHeight, 0.3);
    const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit1.position.set(-slitDistance/2, 0, -5);
    scene.add(slit1);
    
    const slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit2.position.set(slitDistance/2, 0, -5);
    scene.add(slit2);
    
    // Create screen
    const screenGeometry = new THREE.PlaneGeometry(10, 5);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 5);
    scene.add(screen);
    
    // Create measurement plane (movable)
    const measurePlaneGeometry = new THREE.PlaneGeometry(10, 5);
    const measurePlaneMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const measurePlane = new THREE.Mesh(measurePlaneGeometry, measurePlaneMaterial);
    scene.add(measurePlane);
    
    // Create visual indicators
    const pathGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(0, 0, 5)
        ]),
        20, 0.05, 8, false
    );
    const pathMaterial = new THREE.MeshBasicMaterial({
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.3
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);
    
    // Create particles
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: config.delayedChoice.particleColor,
        emissive: config.delayedChoice.particleColor,
        emissiveIntensity: 0.5
    });
    
    function createParticle() {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(source.position);
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                config.delayedChoice.particleSpeed
            ),
            isDetected: false,
            phase: 0, // Phase for wave visualization
            path: Math.random() < 0.5 ? 1 : 2 // Which slit the particle will go through
        };
        scene.add(particle);
        particles.push(particle);
        return particle;
    }
    
    // Helper text
    const helperTextElement = document.createElement('div');
    helperTextElement.style.position = 'absolute';
    helperTextElement.style.top = '10px';
    helperTextElement.style.left = '10px';
    helperTextElement.style.color = 'white';
    helperTextElement.style.fontFamily = 'Arial, sans-serif';
    helperTextElement.style.padding = '5px';
    helperTextElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    helperTextElement.style.borderRadius = '4px';
    container.appendChild(helperTextElement);
    
    // Create interference pattern on screen
    const patternTexture = createInterferencePatternTexture();
    const patternMaterial = new THREE.MeshBasicMaterial({
        map: patternTexture,
        transparent: true,
        opacity: 0.7
    });
    const patternPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(9.8, 4.8),
        patternMaterial
    );
    patternPlane.position.set(0, 0, 5.01);
    scene.add(patternPlane);
    
    // Animation variables
    let lastParticleTime = 0;
    const clock = new THREE.Clock();
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Update measurement plane position based on timing setting
        const measureZ = -5 + (10 * config.delayedChoice.measurementTiming / 100);
        measurePlane.position.set(0, 0, measureZ);
        
        // Update helper text
        helperTextElement.textContent = `Measurement at: ${config.delayedChoice.measurementTiming}% | Mode: ${config.delayedChoice.choiceType}`;
        
        // Pattern visibility depends on choice type
        patternPlane.visible = config.delayedChoice.choiceType === 'wave';
        
        // Create new particles periodically
        if (elapsedTime - lastParticleTime > 0.2) {
            createParticle();
            lastParticleTime = elapsedTime;
        }
        
        // Update particles
        particles.forEach((particle, index) => {
            particle.position.add(particle.userData.velocity);
            
            // When particle reaches barrier plane
            if (particle.position.z > -5 && particle.position.z < -4.9 && !particle.userData.passedBarrier) {
                particle.userData.passedBarrier = true;
                
                // Check if particle goes through a slit
                let goesThrough = false;
                if (particle.userData.path === 1 && 
                    Math.abs(particle.position.x + slitDistance/2) < slitWidth/2 && 
                    Math.abs(particle.position.y) < slitHeight/2) {
                    goesThrough = true;
                    // Adjust trajectory slightly
                    particle.userData.velocity.x += (Math.random() - 0.5) * 0.01;
                    particle.userData.velocity.y += (Math.random() - 0.5) * 0.01;
                } else if (particle.userData.path === 2 && 
                           Math.abs(particle.position.x - slitDistance/2) < slitWidth/2 && 
                           Math.abs(particle.position.y) < slitHeight/2) {
                    goesThrough = true;
                    // Adjust trajectory slightly
                    particle.userData.velocity.x += (Math.random() - 0.5) * 0.01;
                    particle.userData.velocity.y += (Math.random() - 0.5) * 0.01;
                }
                
                if (!goesThrough) {
                    scene.remove(particle);
                    particles.splice(index, 1);
                    return;
                }
            }
            
            // Check if particle crosses measurement plane
            if (!particle.userData.measured && 
                ((particle.position.z < measureZ && particle.userData.velocity.z > 0) || 
                 (particle.position.z > measureZ && particle.userData.velocity.z < 0))) {
                
                particle.userData.measured = true;
                
                // Apply measurement effect based on choice type
                if (config.delayedChoice.choiceType === 'particle') {
                    // Particle behavior - localize and reduce wave-like behavior
                    particle.userData.velocity.x = (Math.random() - 0.5) * 0.03;
                    particle.userData.velocity.y = (Math.random() - 0.5) * 0.03;
                    
                    // Visual effect
                    measurePlane.material.opacity = 0.5;
                    setTimeout(() => {
                        measurePlane.material.opacity = 0.3;
                    }, 100);
                } else {
                    // Wave behavior - enhance interference pattern
                    const angle = Math.random() * Math.PI * 0.4 - Math.PI * 0.2;
                    particle.userData.velocity.x = Math.sin(angle) * 0.04;
                    particle.userData.velocity.z = Math.abs(Math.cos(angle) * 0.04);
                }
            }
            
            // When particle hits screen
            if (particle.position.z > 5) {
                scene.remove(particle);
                particles.splice(index, 1);
            }
        });
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Function to create interference pattern texture
    function createInterferencePatternTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Fill with transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create interference pattern
        const lambda = 20; // Wavelength
        const k = 2 * Math.PI / lambda;
        const d = 50; // Slit separation in pixels
        const L = 300; // Distance to screen
        
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                // Center coordinates
                const x0 = x - canvas.width / 2;
                const y0 = y - canvas.height / 2;
                
                // Distance from each slit
                const r1 = Math.sqrt(Math.pow(x0 - d/2, 2) + Math.pow(y0, 2) + Math.pow(L, 2));
                const r2 = Math.sqrt(Math.pow(x0 + d/2, 2) + Math.pow(y0, 2) + Math.pow(L, 2));
                
                // Phase difference and intensity
                const phaseDiff = k * (r2 - r1);
                const intensity = Math.pow(Math.cos(phaseDiff / 2), 2);
                
                // Draw with appropriate color and alpha
                const alpha = intensity * 0.7;
                ctx.fillStyle = `rgba(114, 9, 183, ${alpha})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    // Start animation
    clock.start();
    animate();
    
    // Store current animation and return cleanup function
    currentAnimation = {
        dispose: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (helperTextElement.parentNode === container) {
                container.removeChild(helperTextElement);
            }
        }
    };
}

//=========================================
// VERSE 3: TIME DILATION ANIMATION
//=========================================
export function initTimeDilationAnimation() {
    disposeCurrentAnimation();
    
    const { container, renderer, scene, camera, controls } = setupThreeEnvironment();
    
    // Create helper function for clock creation
    function createClock(size, color) {
        const clock = new THREE.Group();
        
        // Clock face
        const faceGeometry = new THREE.CircleGeometry(size, config.timeDilation.clockDetail);
        const faceMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        clock.add(face);
        
        // Clock outline
        const outlineGeometry = new THREE.RingGeometry(size * 0.98, size * 1.02, 32);
        const outlineMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5
        });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        outline.position.z = 0.01;
        clock.add(outline);
        
        // Hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const markerGeometry = new THREE.BoxGeometry(size * 0.05, size * 0.2, 0.05);
            const markerMaterial = new THREE.MeshPhongMaterial({ color: color });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            
            marker.position.x = Math.sin(angle) * size * 0.85;
            marker.position.y = Math.cos(angle) * size * 0.85;
            marker.position.z = 0.02;
            marker.rotation.z = -angle;
            
            clock.add(marker);
        }
        
        // Clock hands
        // Hour hand
        const hourHandGeometry = new THREE.BoxGeometry(size * 0.05, size * 0.5, 0.05);
        const hourHandMaterial = new THREE.MeshPhongMaterial({ color: color });
        const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
        hourHand.position.y = size * 0.25;
        hourHand.position.z = 0.05;
        clock.add(hourHand);
        clock.hourHand = hourHand;
        
        // Minute hand
        const minuteHandGeometry = new THREE.BoxGeometry(size * 0.04, size * 0.7, 0.05);
        const minuteHandMaterial = new THREE.MeshPhongMaterial({ color: color });
        const minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
        minuteHand.position.y = size * 0.35;
        minuteHand.position.z = 0.06;
        clock.add(minuteHand);
        clock.minuteHand = minuteHand;
        
        // Second hand
        const secondHandGeometry = new THREE.BoxGeometry(size * 0.02, size * 0.8, 0.05);
        const secondHandMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b6b,
            emissive: 0xff0000,
            emissiveIntensity: 0.5 
        });
        const secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
        secondHand.position.y = size * 0.4;
        secondHand.position.z = 0.07;
        clock.add(secondHand);
        clock.secondHand = secondHand;
        
        // Central pin
        const pinGeometry = new THREE.CylinderGeometry(size * 0.08, size * 0.08, 0.1, 16);
        const pinMaterial = new THREE.MeshPhongMaterial({ color: color });
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.rotation.x = Math.PI / 2;
        pin.position.z = 0.08;
        clock.add(pin);
        
        return clock;
    }
    
    // Create space-time grid with curvature
    const gridSize = config.timeDilation.spaceGridSize;
    const gridDivisions = 20;
    
    // Create custom curved grid
    const curvedGrid = new THREE.Group();
    scene.add(curvedGrid);
    
    // Create grid lines
    const gridMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4361ee, 
        transparent: true, 
        opacity: 0.3 
    });
    
    // Create horizontal grid lines
    for (let i = -gridSize/2; i <= gridSize/2; i += gridSize/gridDivisions) {
        const points = [];
        for (let j = -gridSize/2; j <= gridSize/2; j += gridSize/100) {
            // Calculate distortion based on velocity
            const distortion = config.timeDilation.velocity / 100;
            const y = i;
            const x = j;
            const z = distortion * 0.5 * Math.exp(-Math.pow(x/10, 2) - Math.pow(y/10, 2));
            points.push(new THREE.Vector3(x, y, z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, gridMaterial);
        curvedGrid.add(line);
    }
    
    // Create vertical grid lines
    for (let i = -gridSize/2; i <= gridSize/2; i += gridSize/gridDivisions) {
        const points = [];
        for (let j = -gridSize/2; j <= gridSize/2; j += gridSize/100) {
            // Calculate distortion based on velocity
            const distortion = config.timeDilation.velocity / 100;
            const x = i;
            const y = j;
            const z = distortion * 0.5 * Math.exp(-Math.pow(x/10, 2) - Math.pow(y/10, 2));
            points.push(new THREE.Vector3(x, y, z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, gridMaterial);
        curvedGrid.add(line);
    }
    
    // Create stationary clock
    const stationaryClock = createClock(config.timeDilation.clockSize, config.timeDilation.statClockColor);
    stationaryClock.position.set(-5, 0, 0);
    scene.add(stationaryClock);
    
    // Create moving clock
    const movingClock = createClock(config.timeDilation.clockSize, config.timeDilation.movingClockColor);
    movingClock.position.set(5, 0, 0);
    scene.add(movingClock);
    
    // Create path visualization for moving clock
    const pathPoints = [];
    for (let t = -Math.PI; t <= Math.PI; t += 0.1) {
        pathPoints.push(new THREE.Vector3(5, 8 * Math.sin(t), 0));
    }
    
    const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
    const pathGeometry = new THREE.TubeGeometry(pathCurve, 50, 0.1, 8, true);
    const pathMaterial = new THREE.MeshPhongMaterial({
        color: config.timeDilation.movingClockColor,
        transparent: true,
        opacity: 0.6,
        emissive: config.timeDilation.movingClockColor,
        emissiveIntensity: 0.3
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(path);
    
    // Add light cone visualizations
    const lightConeGeometry = new THREE.ConeGeometry(2, 4, 32);
    const lightConeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    
    const lightCone1 = new THREE.Mesh(lightConeGeometry, lightConeMaterial);
    lightCone1.position.set(-5, 0, 0);
    lightCone1.rotation.x = Math.PI;
    scene.add(lightCone1);
    
    const lightCone2 = new THREE.Mesh(lightConeGeometry, lightConeMaterial);
    lightCone2.position.set(-5, 0, 0);
    scene.add(lightCone2);
    
    // Create light particles traveling along light cone
    const lightParticles = [];
    const lightParticleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const lightParticleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1
    });
    
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.8;
        const speed = 0.05 + Math.random() * 0.05;
        
        const particle = new THREE.Mesh(lightParticleGeometry, lightParticleMaterial);
        particle.position.set(
            -5 + Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        particle.userData = {
            angle: angle,
            radius: radius,
            speed: speed,
            direction: Math.random() > 0.5 ? 1 : -1
        };
        
        scene.add(particle);
        lightParticles.push(particle);
    }
    
    // Create helper text
    const helperTextElement = document.createElement('div');
    helperTextElement.style.position = 'absolute';
    helperTextElement.style.top = '10px';
    helperTextElement.style.left = '10px';
    helperTextElement.style.color = 'white';
    helperTextElement.style.fontFamily = 'Arial, sans-serif';
    helperTextElement.style.padding = '10px';
    helperTextElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    helperTextElement.style.borderRadius = '4px';
    container.appendChild(helperTextElement);
    
    // Animation variables
    const clock = new THREE.Clock();
    let stationaryTime = 0;
    let movingTime = 0;
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Calculate relativistic factor (gamma)
        const relativeVelocity = config.timeDilation.velocity / 100; // As fraction of c
        const gamma = 1 / Math.sqrt(1 - relativeVelocity * relativeVelocity);
        
        // Update spacetime curvature
        curvedGrid.children.forEach((line, index) => {
            const positions = line.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i+1];
                
                // Calculate new curvature based on velocity
                positions[i+2] = relativeVelocity * 0.5 * Math.exp(-Math.pow(x/10, 2) - Math.pow(y/10, 2)) * 
                                 (1 + 0.2 * Math.sin(elapsedTime + x/5 + y/5));
            }
            line.geometry.attributes.position.needsUpdate = true;
        });
        
        // Update times
        stationaryTime += deltaTime;
        movingTime += deltaTime / gamma;
        
        // Update clock hands based on observer perspective
        if (config.timeDilation.observerPerspective === 'stationary') {
            // From stationary observer's perspective
            updateClockHands(stationaryClock, stationaryTime);
            updateClockHands(movingClock, movingTime);
            
            // Move the moving clock
            movingClock.position.y = 8 * Math.sin(elapsedTime * relativeVelocity);
            
            // Show length contraction
            movingClock.scale.y = 1 / gamma;
            
            // Add motion blur effect to moving clock
            movingClock.children.forEach(child => {
                if (child.material) {
                    child.material.roughness = 0.8 + relativeVelocity * 0.2;
                }
            });
        } else {
            // From moving observer's perspective
            updateClockHands(stationaryClock, stationaryTime * gamma);
            updateClockHands(movingClock, movingTime);
            
            // In moving frame, stationary clock appears to move
            stationaryClock.position.y = -8 * Math.sin(elapsedTime * relativeVelocity);
            
            // Show length contraction of stationary objects
            stationaryClock.scale.y = 1 / gamma;
            
            // Add motion blur to stationary clock
            stationaryClock.children.forEach(child => {
                if (child.material) {
                    child.material.roughness = 0.8 + relativeVelocity * 0.2;
                }
            });
        }
        
        // Update light cone particles
        lightParticles.forEach(particle => {
            // Move along cone surface
            particle.userData.angle += 0.02;
            const height = particle.userData.direction * particle.userData.speed * elapsedTime;
            const coneRadius = particle.userData.radius * (1 + Math.abs(height)/2);
            
            particle.position.set(
                -5 + Math.cos(particle.userData.angle) * coneRadius,
                Math.sin(particle.userData.angle) * coneRadius,
                height
            );
            
            // Reset if too far
            if (Math.abs(height) > 4) {
                particle.userData.direction *= -1;
            }
        });
        
        // Update helper text
        helperTextElement.textContent = `Velocity: ${config.timeDilation.velocity}% of c | γ factor: ${gamma.toFixed(2)} | Perspective: ${config.timeDilation.observerPerspective}`;
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Helper function to update clock hands
    function updateClockHands(clockObj, time) {
        // Convert time to hours, minutes, seconds
        const seconds = time % 60;
        const minutes = (time / 60) % 60;
        const hours = (time / 3600) % 12;
        
        // Update rotations
        clockObj.secondHand.rotation.z = -((seconds / 60) * Math.PI * 2);
        clockObj.minuteHand.rotation.z = -((minutes / 60) * Math.PI * 2);
        clockObj.hourHand.rotation.z = -((hours / 12) * Math.PI * 2 + (minutes / 60) * (Math.PI * 2 / 12));
    }
    
    // Set initial camera position for better view
    camera.position.set(15, 5, 20);
    camera.lookAt(0, 0, 0);
    
    // Start animation
    clock.start();
    animate();
    
    // Store current animation and return cleanup function
    currentAnimation = {
        dispose: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (helperTextElement.parentNode === container) {
                container.removeChild(helperTextElement);
            }
            
            // Clean up light particles
            lightParticles.forEach(particle => {
                scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            });
        }
    };
}

//=========================================
// VERSE 4: UNCERTAINTY PRINCIPLE
//=========================================
export function initUncertaintyAnimation() {
    disposeCurrentAnimation();
    
    const { container, renderer, scene, camera, controls } = setupThreeEnvironment();
    
    // Create coordinate system
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    
    // Create helper text
    const helperTextElement = document.createElement('div');
    helperTextElement.style.position = 'absolute';
    helperTextElement.style.top = '10px';
    helperTextElement.style.left = '10px';
    helperTextElement.style.color = 'white';
    helperTextElement.style.fontFamily = 'Arial, sans-serif';
    helperTextElement.style.padding = '5px';
    helperTextElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    helperTextElement.style.borderRadius = '4px';
    container.appendChild(helperTextElement);
    
    // Create wave packet visualization
    const waveResolution = 100;
    const waveWidth = 15;
    
    // Position-space wave function
    const positionWaveGeometry = new THREE.BufferGeometry();
    const positionWavePositions = new Float32Array((waveResolution + 1) * 3);
    
    for (let i = 0; i <= waveResolution; i++) {
        const x = (i / waveResolution) * waveWidth - waveWidth / 2;
        positionWavePositions[i * 3] = x;
        positionWavePositions[i * 3 + 1] = 0;
        positionWavePositions[i * 3 + 2] = 0;
    }
    
    positionWaveGeometry.setAttribute('position', new THREE.BufferAttribute(positionWavePositions, 3));
    
    const positionWaveMaterial = new THREE.LineBasicMaterial({
        color: config.uncertaintyPrinciple.waveColor,
        linewidth: 2
    });
    
    const positionWave = new THREE.Line(positionWaveGeometry, positionWaveMaterial);
    positionWave.position.y = 2;
    scene.add(positionWave);
    
    // Momentum-space wave function
    const momentumWaveGeometry = new THREE.BufferGeometry();
    const momentumWavePositions = new Float32Array((waveResolution + 1) * 3);
    
    for (let i = 0; i <= waveResolution; i++) {
        const x = (i / waveResolution) * waveWidth - waveWidth / 2;
        momentumWavePositions[i * 3] = x;
        momentumWavePositions[i * 3 + 1] = 0;
        momentumWavePositions[i * 3 + 2] = 0;
    }
    
    momentumWaveGeometry.setAttribute('position', new THREE.BufferAttribute(momentumWavePositions, 3));
    
    const momentumWaveMaterial = new THREE.LineBasicMaterial({
        color: 0xff6b6b,
        linewidth: 2
    });
    
    const momentumWave = new THREE.Line(momentumWaveGeometry, momentumWaveMaterial);
    momentumWave.position.y = -2;
    scene.add(momentumWave);
    
    // Create labels
    const positionLabelGeo = new THREE.PlaneGeometry(2, 0.6);
    const positionLabelMat = createTextTextureMaterial("Position Space (Δx)");
    const positionLabel = new THREE.Mesh(positionLabelGeo, positionLabelMat);
    positionLabel.position.set(-7, 2, 0);
    scene.add(positionLabel);
    
    const momentumLabelGeo = new THREE.PlaneGeometry(2, 0.6);
    const momentumLabelMat = createTextTextureMaterial("Momentum Space (Δp)");
    const momentumLabel = new THREE.Mesh(momentumLabelGeo, momentumLabelMat);
    momentumLabel.position.set(-7, -2, 0);
    scene.add(momentumLabel);
    
    // Create measurement grid visualizations
    const positionGridGeometry = new THREE.BoxGeometry(0.05, 4, 0.05);
    const positionGridMaterial = new THREE.MeshBasicMaterial({
        color: config.uncertaintyPrinciple.gridColor,
        transparent: true,
        opacity: 0.7
    });
    
    const positionGridLeft = new THREE.Mesh(positionGridGeometry, positionGridMaterial);
    scene.add(positionGridLeft);
    
    const positionGridRight = new THREE.Mesh(positionGridGeometry, positionGridMaterial);
    scene.add(positionGridRight);
    
    const momentumGridLeft = new THREE.Mesh(positionGridGeometry, positionGridMaterial);
    scene.add(momentumGridLeft);
    
    const momentumGridRight = new THREE.Mesh(positionGridGeometry, positionGridMaterial);
    scene.add(momentumGridRight);
    
    // Create product indicator (ΔxΔp ≥ ħ/2)
    const productGeometry = new THREE.PlaneGeometry(4, 1);
    const productMaterial = createTextTextureMaterial("ΔxΔp ≥ ħ/2");
    const productIndicator = new THREE.Mesh(productGeometry, productMaterial);
    productIndicator.position.set(0, -5, 0);
    scene.add(productIndicator);
    
    // Animation variables
    const clock = new THREE.Clock();
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Update wave visualization based on position precision setting
        const precisionFactor = config.uncertaintyPrinciple.positionPrecision / 100;
        const positionWidth = 0.5 + (1 - precisionFactor) * 4;
        const momentumWidth = 0.5 + precisionFactor * 4;
        
        // Update position wave
        const positions = positionWave.geometry.attributes.position.array;
        for (let i = 0; i <= waveResolution; i++) {
            const x = (i / waveResolution) * waveWidth - waveWidth / 2;
            positions[i * 3] = x;
            positions[i * 3 + 1] = 2 * Math.exp(-Math.pow(x / positionWidth, 2)) * Math.cos(x * 5 + elapsedTime * 2);
        }
        positionWave.geometry.attributes.position.needsUpdate = true;
        
        // Update momentum wave
        const momentumPositions = momentumWave.geometry.attributes.position.array;
        for (let i = 0; i <= waveResolution; i++) {
            const x = (i / waveResolution) * waveWidth - waveWidth / 2;
            momentumPositions[i * 3] = x;
            momentumPositions[i * 3 + 1] = -2 * Math.exp(-Math.pow(x / momentumWidth, 2)) * Math.cos(x * 5 + elapsedTime * 2);
        }
        momentumWave.geometry.attributes.position.needsUpdate = true;
        
        // Update measurement grid positions
        positionGridLeft.position.set(-positionWidth, 2, 0);
        positionGridRight.position.set(positionWidth, 2, 0);
        
        momentumGridLeft.position.set(-momentumWidth, -2, 0);
        momentumGridRight.position.set(momentumWidth, -2, 0);
        
        // Calculate uncertainty product
        const uncertaintyProduct = positionWidth * momentumWidth;
        const minUncertainty = 0.5; // Representing ħ/2
        
        // Update product indicator
        productIndicator.material = createTextTextureMaterial(
            `ΔxΔp = ${uncertaintyProduct.toFixed(2)} ≥ ${minUncertainty} (ħ/2)`,
            uncertaintyProduct < minUncertainty ? 0xff0000 : 0x00ff00
        );
        
        // Update helper text
        helperTextElement.textContent = `Position Precision: ${config.uncertaintyPrinciple.positionPrecision}% | Visualization: ${config.uncertaintyPrinciple.visualizationType}`;
        
        // Show/hide waves based on visualization type
        positionWave.visible = config.uncertaintyPrinciple.visualizationType === 'position' || config.uncertaintyPrinciple.visualizationType === 'both';
        momentumWave.visible = config.uncertaintyPrinciple.visualizationType === 'momentum' || config.uncertaintyPrinciple.visualizationType === 'both';
        
        positionGridLeft.visible = positionGridRight.visible = positionWave.visible;
        momentumGridLeft.visible = momentumGridRight.visible = momentumWave.visible;
        
        positionLabel.visible = positionWave.visible;
        momentumLabel.visible = momentumWave.visible;
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Helper function to create text texture
    function createTextTextureMaterial(text, color = 0xffffff) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'rgba(40, 40, 60, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = `rgb(${color >> 16 & 255}, ${color >> 8 & 255}, ${color & 255})`;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
    }
    
    // Set initial camera position
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);
    
    // Start animation
    clock.start();
    animate();
    
    // Store current animation and return cleanup function
    currentAnimation = {
        dispose: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (helperTextElement.parentNode === container) {
                container.removeChild(helperTextElement);
            }
        }
    };
}

//=========================================
// VERSE 5: ENERGY-TIME UNCERTAINTY
//=========================================
export function initEnergyTimeAnimation() {
    disposeCurrentAnimation();
    
    const { container, renderer, scene, camera, controls } = setupThreeEnvironment();
    
    // Create helper text
    const helperTextElement = document.createElement('div');
    helperTextElement.style.position = 'absolute';
    helperTextElement.style.top = '10px';
    helperTextElement.style.left = '10px';
    helperTextElement.style.color = 'white';
    helperTextElement.style.fontFamily = 'Arial, sans-serif';
    helperTextElement.style.padding = '5px';
    helperTextElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    helperTextElement.style.borderRadius = '4px';
    container.appendChild(helperTextElement);
    
    // Create energy level visualization
    const energyLevels = 5;
    const levelHeight = 1.5;
    const levelWidth = 10;
    
    // Create energy level platforms
    const platforms = [];
    for (let i = 0; i < energyLevels; i++) {
        const platform = createEnergyPlatform(
            i, 
            levelWidth, 
            new THREE.Color(config.energyTimeUncertainty.energyColors[i])
        );
        platform.position.y = i * levelHeight;
        scene.add(platform);
        platforms.push(platform);
    }
    
    // Create particle system
    const particles = [];
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create initial particles
    for (let i = 0; i < config.energyTimeUncertainty.particleCount; i++) {
        createParticle();
    }
    
    // Create measurement window visualization
    const measurementWindowGeo = new THREE.PlaneGeometry(1, energyLevels * levelHeight);
    const measurementWindowMat = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    const measurementWindow = new THREE.Mesh(measurementWindowGeo, measurementWindowMat);
    measurementWindow.position.set(0, (energyLevels * levelHeight) / 2 - levelHeight/2, 0);
    scene.add(measurementWindow);
    
    // Create energy-time uncertainty indicator
    const uncertaintyDisplay = createTextDisplay("ΔE·Δt ≥ ħ/2");
    uncertaintyDisplay.position.set(0, -2, 0);
    scene.add(uncertaintyDisplay);
    
    // Animation variables
    const clock = new THREE.Clock();
    let particleUpdateTime = 0;
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Update measurement window
        const windowWidth = (config.energyTimeUncertainty.measurementDuration / 100) * 10;
        measurementWindow.scale.x = windowWidth;
        
        // Update helper text
        const durationValue = config.energyTimeUncertainty.measurementDuration;
        const energyLevel = config.energyTimeUncertainty.energyLevel;
        const energyUncertainty = 100 / durationValue; // Inverse relationship
        
        helperTextElement.textContent = 
            `Measurement Duration: ${durationValue} | Energy Level: ${energyLevel} | Energy Uncertainty: ${energyUncertainty.toFixed(2)}`;
        
        // Update uncertainty display
        const product = durationValue * energyUncertainty / 100;
        uncertaintyDisplay.material = createTextTextureMaterial(
            `ΔE·Δt = ${product.toFixed(2)} ≥ 0.5 (ħ/2)`,
            product < 0.5 ? 0xff0000 : 0x00ff00
        );
        
        // Update particles
        particles.forEach((particle, index) => {
            // Update particle position
            particle.userData.age += deltaTime;
            
            // Particles oscillate around their energy level
            const amplitude = 0.2;
            const frequency = 2 + particle.userData.energyLevel * 0.5;
            
            particle.position.y = 
                (particle.userData.energyLevel * levelHeight) + 
                amplitude * Math.sin(particle.userData.age * frequency + particle.userData.phase);
            
            // Particles move along x-axis
            particle.position.x += particle.userData.velocity.x * deltaTime;
            
            // When particle goes beyond screen, reset
            if (Math.abs(particle.position.x) > levelWidth / 2) {
                particle.position.x = -Math.sign(particle.position.x) * levelWidth / 2;
            }
            
            // Particles inside measurement window can transition
            if (Math.abs(particle.position.x) < windowWidth / 2) {
                const transitionChance = 0.02 * deltaTime / (windowWidth / 5);
                
                if (Math.random() < transitionChance) {
                    // Quantum jump to random level with preference to current level
                    let newLevel;
                    const jumpDistance = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                    
                    if (particle.userData.energyLevel === energyLevel - 1) {
                        // Preferred level, more likely to stay
                        newLevel = energyLevel - 1 + jumpDistance;
                    } else {
                        // Random transition with bias towards target level
                        const bias = Math.random() < 0.7 ? 
                            Math.sign(energyLevel - 1 - particle.userData.energyLevel) : 
                            jumpDistance;
                        
                        newLevel = particle.userData.energyLevel + bias;
                    }
                    
                    // Clamp to valid levels
                    newLevel = Math.max(0, Math.min(energyLevels - 1, newLevel));
                    
                    // Visual effect for transition
                    if (newLevel !== particle.userData.energyLevel) {
                        createTransitionEffect(particle.position, 
                                              particle.userData.energyLevel * levelHeight, 
                                              newLevel * levelHeight);
                        
                        // Update particle properties
                        particle.userData.energyLevel = newLevel;
                        particle.material.color = new THREE.Color(
                            config.energyTimeUncertainty.energyColors[newLevel]
                        );
                    }
                }
            }
        });
        
        // Update particle count if needed
        if (particles.length < config.energyTimeUncertainty.particleCount) {
            createParticle();
        } else if (particles.length > config.energyTimeUncertainty.particleCount) {
            const particle = particles.pop();
            particleGroup.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        }
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Helper function to create energy platform
    function createEnergyPlatform(level, width, color) {
        const group = new THREE.Group();
        
        // Platform
        const platformGeo = new THREE.BoxGeometry(width, 0.1, 1);
        const platformMat = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        group.add(platform);
        
        // Level label
        const labelGeo = new THREE.PlaneGeometry(1, 0.6);
        const labelMat = createTextTextureMaterial(`E${level}`, color.getHex());
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.set(-width/2 - 0.8, 0, 0);
        group.add(label);
        
        return group;
    }
    
    // Helper function to create a particle
    function createParticle() {
        const energyLevel = Math.floor(Math.random() * energyLevels);
        const color = new THREE.Color(config.energyTimeUncertainty.energyColors[energyLevel]);
        
        const particleGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const particleMat = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5
        });
        
        const particle = new THREE.Mesh(particleGeo, particleMat);
        
        // Set initial position
        particle.position.set(
            (Math.random() - 0.5) * levelWidth,
            energyLevel * levelHeight,
            (Math.random() - 0.5) * 0.5
        );
        
        // Set particle data
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                0,
                0
            ),
            energyLevel: energyLevel,
            age: Math.random() * 10,
            phase: Math.random() * Math.PI * 2
        };
        
        particleGroup.add(particle);
        particles.push(particle);
        
        return particle;
    }
    
    // Create transition effect
    function createTransitionEffect(position, startY, endY) {
        const points = [];
        const segments = 10;
        
        for (let i = 0; i <= segments; i++) {
            const y = startY + (endY - startY) * (i / segments);
            const x = position.x + (Math.random() - 0.5) * 0.5;
            points.push(new THREE.Vector3(x, y, position.z));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, segments, 0.05, 8, false);
        
        const color = startY < endY ? 0x4cc9f0 : 0xff6b6b;
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const tube = new THREE.Mesh(geometry, material);
        scene.add(tube);
        
        // Fade out and remove
        setTimeout(() => {
            let opacity = 0.8;
            const fadeInterval = setInterval(() => {
                opacity -= 0.1;
                if (opacity <= 0) {
                    scene.remove(tube);
                    tube.geometry.dispose();
                    tube.material.dispose();
                    clearInterval(fadeInterval);
                } else {
                    tube.material.opacity = opacity;
                }
            }, 50);
        }, 500);
    }
    
    // Create text display
    function createTextDisplay(text) {
        const textGeo = new THREE.PlaneGeometry(6, 1);
        const textMat = createTextTextureMaterial(text);
        return new THREE.Mesh(textGeo, textMat);
    }
    
    // Helper function to create text texture
    function createTextTextureMaterial(text, color = 0xffffff) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'rgba(40, 40, 60, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = `rgb(${color >> 16 & 255}, ${color >> 8 & 255}, ${color & 255})`;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
    }
    
    // Set initial camera position
    camera.position.set(0, (energyLevels * levelHeight) / 2, 15);
    camera.lookAt(0, (energyLevels * levelHeight) / 2, 0);
    
    // Start animation
    clock.start();
    animate();
    
    // Store current animation and return cleanup function
    currentAnimation = {
        dispose: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (helperTextElement.parentNode === container) {
                container.removeChild(helperTextElement);
            }
            
            // Dispose all particles
            particles.forEach(particle => {
                particleGroup.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            });
            particles.length = 0;
        }
    };
}

//=========================================
// VERSE 6: ENTROPY AND ARROW OF TIME
//=========================================
export function initEntropyAnimation() {
    disposeCurrentAnimation();
    
    const { container, renderer, scene, camera, controls } = setupThreeEnvironment();
    
    // Create helper text
    const helperTextElement = document.createElement('div');
    helperTextElement.style.position = 'absolute';
    helperTextElement.style.top = '10px';
    helperTextElement.style.left = '10px';
    helperTextElement.style.color = 'white';
    helperTextElement.style.fontFamily = 'Arial, sans-serif';
    helperTextElement.style.padding = '5px';
    helperTextElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    helperTextElement.style.borderRadius = '4px';
    container.appendChild(helperTextElement);
    
    // Create entropy graph if enabled
    let entropyGraph, entropyContext, entropyValues = [];
    
    if (config.entropy.showEntropyGraph) {
        entropyGraph = document.createElement('canvas');
        entropyGraph.width = 300;
        entropyGraph.height = 100;
        entropyGraph.style.position = 'absolute';
        entropyGraph.style.bottom = '10px';
        entropyGraph.style.right = '10px';
        entropyGraph.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        entropyGraph.style.borderRadius = '4px';
        entropyGraph.style.zIndex = '30';
        container.appendChild(entropyGraph);
        
        entropyContext = entropyGraph.getContext('2d');
        
        // Initialize entropy values array
        for (let i = 0; i < entropyGraph.width; i++) {
            entropyValues.push(0);
        }
    }
    
    // Create container box with better visuals
    const containerSize = config.entropy.containerSize;
    const boxGeometry = new THREE.BoxGeometry(containerSize, containerSize, containerSize);
    const boxMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
        wireframe: false,
        emissive: 0x1a1a2e,
        emissiveIntensity: 0.2
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);
    
    // Add box edges for better visibility
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.6
    });
    const boxEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    box.add(boxEdges);
    
    // Create divider (removable) with better visuals
    const dividerGeometry = new THREE.BoxGeometry(0.05, containerSize, containerSize);
    const dividerMaterial = new THREE.MeshPhongMaterial({
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.6,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.3
    });
    const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
    scene.add(divider);
    
    // Add divider edges for better visibility
    const dividerEdgesGeometry = new THREE.EdgesGeometry(dividerGeometry);
    const dividerEdgesMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const dividerEdges = new THREE.LineSegments(dividerEdgesGeometry, dividerEdgesMaterial);
    divider.add(dividerEdges);
    
    // Create particles with improved visuals
    const particles = [];
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create initial particles in ordered state (low entropy)
    for (let i = 0; i < config.entropy.particleCount; i++) {
        createParticle(true); // true = ordered state
    }
    
    // Create entropy indicator with better visuals
    const entropyDisplay = createTextDisplay("Entropy: Low");
    entropyDisplay.position.set(0, -containerSize/2 - 1.5, 0);
    scene.add(entropyDisplay);
    
    // Create timeline arrow with better visuals
    const arrowGroup = new THREE.Group();
    scene.add(arrowGroup);
    
    const arrowBodyGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 12);
    const arrowBodyMat = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.3
    });
    const arrowBody = new THREE.Mesh(arrowBodyGeo, arrowBodyMat);
    arrowBody.rotation.z = -Math.PI / 2;
    arrowBody.position.set(-4, 0, 0);
    arrowGroup.add(arrowBody);
    
    const arrowHeadGeo = new THREE.ConeGeometry(0.3, 1, 12);
    const arrowHeadMat = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });
    const arrowHead = new THREE.Mesh(arrowHeadGeo, arrowHeadMat);
    arrowHead.position.set(0, 0, 0);
    arrowHead.rotation.z = -Math.PI / 2;
    arrowGroup.add(arrowHead);
    
    const timelineLabelGeo = new THREE.PlaneGeometry(2, 0.8);
    const timelineLabelMat = createTextTextureMaterial("Time", 0xffffff);
    const timelineLabel = new THREE.Mesh(timelineLabelGeo, timelineLabelMat);
    timelineLabel.position.set(-4, -1, 0);
    arrowGroup.add(timelineLabel);
    
    arrowGroup.position.set(0, -containerSize/2 - 3, 0);
    
    // System state variables
    let ordered = true;
    let dividerRemoved = false;
    let entropyLevel = 0;
    let simulationTime = 0;
    
    // Animation variables
    const clock = new THREE.Clock();
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        simulationTime += deltaTime;
        
        // Update system based on temperature
        const temperature = config.entropy.temperature / 10;
        
        // Update particle count if needed
        if (particles.length < config.entropy.particleCount) {
            createParticle(ordered);
        } else if (particles.length > config.entropy.particleCount) {
            const particle = particles.pop();
            particleGroup.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        }
        
        // Check if we should remove divider
        if (!dividerRemoved && simulationTime > 3) {
            dividerRemoved = true;
            divider.visible = false;
            
            // Visual effect for divider removal
            const particlesBurst = [];
            for (let i = 0; i < 50; i++) {
                const burstGeo = new THREE.SphereGeometry(0.05, 8, 8);
                const burstMat = new THREE.MeshPhongMaterial({
                    color: 0x4cc9f0,
                    emissive: 0x4cc9f0,
                    emissiveIntensity: 0.8
                });
                const burst = new THREE.Mesh(burstGeo, burstMat);
                burst.position.set(0, 
                                  (Math.random() - 0.5) * containerSize,
                                  (Math.random() - 0.5) * containerSize);
                
                burst.userData = {
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.2,
                        (Math.random() - 0.5) * 0.2,
                        (Math.random() - 0.5) * 0.2
                    ),
                    life: 1 + Math.random()
                };
                
                scene.add(burst);
                particlesBurst.push(burst);
            }
            
            // Animate burst particles
            const burstInterval = setInterval(() => {
                particlesBurst.forEach((particle, i) => {
                    particle.position.add(particle.userData.velocity);
                    particle.userData.life -= 0.05;
                    particle.scale.multiplyScalar(0.95);
                    
                    if (particle.userData.life <= 0) {
                        scene.remove(particle);
                        particle.geometry.dispose();
                        particle.material.dispose();
                        particlesBurst.splice(i, 1);
                    }
                });
                
                if (particlesBurst.length === 0) {
                    clearInterval(burstInterval);
                }
            }, 50);
        }
        
        // Update particles with improved physics
        particles.forEach((particle) => {
            // Apply velocity with temperature scaling
            particle.position.add(particle.userData.velocity.clone().multiplyScalar(deltaTime * temperature));
            
            // Apply slight rotation to particles
            particle.rotation.x += deltaTime * 2 * temperature;
            particle.rotation.y += deltaTime * 2 * temperature;
            
            // Boundary collisions with better physics
            const halfSize = containerSize / 2;
            for (let axis of ['x', 'y', 'z']) {
                if (Math.abs(particle.position[axis]) > halfSize - 0.1) {
                    // Slightly randomize bounce direction for more natural behavior
                    particle.position[axis] = Math.sign(particle.position[axis]) * (halfSize - 0.1);
                    particle.userData.velocity[axis] = -particle.userData.velocity[axis] * 0.98;
                    
                    // Add slight randomness to other axes on collision
                    const otherAxes = ['x', 'y', 'z'].filter(a => a !== axis);
                    otherAxes.forEach(a => {
                        particle.userData.velocity[a] += (Math.random() - 0.5) * 0.02;
                    });
                    
                    // Visual effect for collision
                    if (Math.random() > 0.95) {
                        const collisionGeo = new THREE.SphereGeometry(0.03, 8, 8);
                        const collisionMat = new THREE.MeshBasicMaterial({
                            color: 0xffffff,
                            transparent: true,
                            opacity: 0.7
                        });
                        const collision = new THREE.Mesh(collisionGeo, collisionMat);
                        collision.position.copy(particle.position);
                        scene.add(collision);
                        
                        // Fade out and remove
                        setTimeout(() => {
                            scene.remove(collision);
                            collision.geometry.dispose();
                            collision.material.dispose();
                        }, 100);
                    }
                }
            }
            
            // Divider collision if present
            if (!dividerRemoved && Math.abs(particle.position.x) < 0.1 && particle.userData.lastX * particle.position.x <= 0) {
                particle.userData.velocity.x *= -0.98;
                particle.position.x = Math.sign(particle.userData.lastX) * 0.1;
                
                // Visual effect for divider collision
                if (Math.random() > 0.8) {
                    const collisionGeo = new THREE.SphereGeometry(0.05, 8, 8);
                    const collisionMat = new THREE.MeshBasicMaterial({
                        color: 0x4cc9f0,
                        transparent: true,
                        opacity: 0.8
                    });
                    const collision = new THREE.Mesh(collisionGeo, collisionMat);
                    collision.position.copy(particle.position);
                    scene.add(collision);
                    
                    // Fade out and remove
                    setTimeout(() => {
                        scene.remove(collision);
                        collision.geometry.dispose();
                        collision.material.dispose();
                    }, 150);
                }
            }
            
            // Store last position
            particle.userData.lastX = particle.position.x;
            
            // Calculate position in container
            const posX = (particle.position.x + halfSize) / containerSize;
            
            // Update color based on position if system is evolving
            if (dividerRemoved) {
                const lerpFactor = Math.abs(posX - 0.5) * 2; // 0 at center, 1 at edges
                const color = new THREE.Color().lerpColors(
                    new THREE.Color(config.entropy.highEntropyColor),
                    new THREE.Color(config.entropy.lowEntropyColor),
                    lerpFactor
                );
                particle.material.color.copy(color);
                particle.material.emissive.copy(color);
                
                // Add trail effect to particles
                if (Math.random() > 0.97) {
                    const trailGeo = new THREE.SphereGeometry(0.03, 8, 8);
                    const trailMat = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: 0.3
                    });
                    const trail = new THREE.Mesh(trailGeo, trailMat);
                    trail.position.copy(particle.position);
                    scene.add(trail);
                    
                    // Fade out and remove
                    let opacity = 0.3;
                    const fadeInterval = setInterval(() => {
                        opacity -= 0.05;
                        if (opacity <= 0) {
                            scene.remove(trail);
                            trail.geometry.dispose();
                            trail.material.dispose();
                            clearInterval(fadeInterval);
                        } else {
                            trail.material.opacity = opacity;
                        }
                    }, 50);
                }
            }
        });
        
        // Calculate entropy
        if (dividerRemoved) {
            let leftCount = 0;
            let rightCount = 0;
            
            particles.forEach(particle => {
                if (particle.position.x < 0) leftCount++;
                else rightCount++;
            });
            
            // Normalize to get entropy measure (max when equal distribution)
            const totalParticles = leftCount + rightCount;
            const leftRatio = leftCount / totalParticles;
            const rightRatio = rightCount / totalParticles;
            
            // Shannon entropy formula: -sum(p_i * log(p_i))
            const epsilon = 0.0001; // To avoid log(0)
            entropyLevel = -((leftRatio + epsilon) * Math.log(leftRatio + epsilon) + 
                             (rightRatio + epsilon) * Math.log(rightRatio + epsilon));
            
            // Normalize to 0-1 range (max entropy is log(2) for binary)
            entropyLevel /= Math.log(2);
            
            // Update entropy display
            let entropyText;
            if (entropyLevel < 0.3) entropyText = "Entropy: Low";
            else if (entropyLevel < 0.8) entropyText = "Entropy: Medium";
            else entropyText = "Entropy: High";
            
            entropyDisplay.material = createTextTextureMaterial(
                `${entropyText} (${(entropyLevel * 100).toFixed(1)}%)`,
                lerpColor(0x3a0ca3, 0xf72585, entropyLevel)
            );
            
            // Update entropy graph if enabled
            if (config.entropy.showEntropyGraph) {
                // Add new value to graph
                entropyValues.push(entropyLevel);
                if (entropyValues.length > entropyGraph.width) {
                    entropyValues.shift();
                }
                
                // Draw the graph
                entropyContext.clearRect(0, 0, entropyGraph.width, entropyGraph.height);
                
                // Draw background
                entropyContext.fillStyle = "rgba(0, 0, 0, 0.5)";
                entropyContext.fillRect(0, 0, entropyGraph.width, entropyGraph.height);
                
                // Draw border
                entropyContext.strokeStyle = "rgba(255, 255, 255, 0.5)";
                entropyContext.lineWidth = 1;
                entropyContext.strokeRect(0, 0, entropyGraph.width, entropyGraph.height);
                
                // Draw title
                entropyContext.font = "12px Arial";
                entropyContext.fillStyle = "rgba(255, 255, 255, 0.8)";
                entropyContext.textAlign = "center";
                entropyContext.fillText("Entropy Over Time", entropyGraph.width/2, 12);
                
                // Draw the line
                entropyContext.beginPath();
                entropyContext.moveTo(0, entropyGraph.height - entropyValues[0] * entropyGraph.height);
                
                for (let i = 1; i < entropyValues.length; i++) {
                    entropyContext.lineTo(i, entropyGraph.height - entropyValues[i] * entropyGraph.height);
                }
                
                entropyContext.strokeStyle = "rgba(76, 201, 240, 0.8)";
                entropyContext.lineWidth = 2;
                entropyContext.stroke();
                
                // Draw max entropy line
                entropyContext.beginPath();
                entropyContext.moveTo(0, entropyGraph.height - 1 * entropyGraph.height);
                entropyContext.lineTo(entropyGraph.width, entropyGraph.height - 1 * entropyGraph.height);
                entropyContext.strokeStyle = "rgba(255, 255, 255, 0.3)";
                entropyContext.lineWidth = 1;
                entropyContext.stroke();
                
                // Draw current value
                entropyContext.font = "14px Arial";
                entropyContext.fillStyle = "rgba(255, 255, 255, 0.8)";
                entropyContext.textAlign = "right";
                entropyContext.fillText(
                    `${(entropyLevel * 100).toFixed(1)}%`, 
                    entropyGraph.width - 5, 
                    entropyGraph.height - 5
                );
            }
        }
        
        // Update helper text
        helperTextElement.textContent = 
            `Particles: ${particles.length} | Temperature: ${config.entropy.temperature} | Entropy: ${(entropyLevel * 100).toFixed(1)}%`;
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Helper function to create a particle with better visuals
    function createParticle(ordered = false) {
        const halfSize = containerSize / 2;
        
        // Position based on order state
        let position;
        if (ordered) {
            // Particles on left side for ordered state
            position = new THREE.Vector3(
                -halfSize / 2 - Math.random() * halfSize / 2,
                (Math.random() - 0.5) * containerSize * 0.9,
                (Math.random() - 0.5) * containerSize * 0.9
            );
        } else {
            // Random positions throughout container
            position = new THREE.Vector3(
                (Math.random() - 0.5) * containerSize * 0.9,
                (Math.random() - 0.5) * containerSize * 0.9,
                (Math.random() - 0.5) * containerSize * 0.9
            );
        }
        
        // Color based on position
        const color = ordered ? 
            new THREE.Color(config.entropy.lowEntropyColor) : 
            new THREE.Color(config.entropy.highEntropyColor);
        
        // Create particle with varying sizes for more natural look
        const size = 0.08 + Math.random() * 0.06;
        const particleGeo = new THREE.SphereGeometry(size, 16, 16);
        const particleMat = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            shininess: 70
        });
        
        const particle = new THREE.Mesh(particleGeo, particleMat);
        particle.position.copy(position);
        particle.castShadow = true;
        particle.receiveShadow = true;
        
        // Set random velocity
        const speed = config.entropy.particleSpeed;
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * speed,
                (Math.random() - 0.5) * speed,
                (Math.random() - 0.5) * speed
            ),
            lastX: position.x,
            size: size
        };
        
        particleGroup.add(particle);
        particles.push(particle);
        
        return particle;
    }
    
    // Create text display
    function createTextDisplay(text) {
        const textGeo = new THREE.PlaneGeometry(6, 1);
        const textMat = createTextTextureMaterial(text);
        return new THREE.Mesh(textGeo, textMat);
    }
    
    // Helper function to create text texture
    function createTextTextureMaterial(text, color = 0xffffff) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'rgba(40, 40, 60, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = `rgb(${color >> 16 & 255}, ${color >> 8 & 255}, ${color & 255})`;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
    }
    
    // Set initial camera position for better view
    camera.position.set(15, 5, 15);
    camera.lookAt(0, 0, 0);
    
    // Start animation
    clock.start();
    animate();
    
    // Store current animation and return cleanup function
    currentAnimation = {
        dispose: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (helperTextElement.parentNode === container) {
                container.removeChild(helperTextElement);
            }
            
            if (config.entropy.showEntropyGraph && entropyGraph) {
                if (entropyGraph.parentNode === container) {
                    container.removeChild(entropyGraph);
                }
            }
            
            // Dispose all particles
            particles.forEach(particle => {
                particleGroup.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            });
            particles.length = 0;
        }
    };
}

// Helper function to linearly interpolate between two colors
function lerpColor(color1Hex, color2Hex, factor) {
    const color1 = new THREE.Color(color1Hex);
    const color2 = new THREE.Color(color2Hex);
    const lerpedColor = new THREE.Color();
    
    lerpedColor.lerpColors(color1, color2, factor);
    
    return lerpedColor.getHex();
}