import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createVerse7Animation(container, handleAction) {
    // Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 10, 15);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 1.5;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);
    
    // Add a soft glow light underneath for dramatic effect
    const purpleLight = new THREE.PointLight(0x8338ec, 3, 15);
    purpleLight.position.set(0, -2, 0);
    scene.add(purpleLight);
    
    // Environment
    // Add subtle starfield background
    const starCount = 1000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    
    for (let i = 0; i < starCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100) - 50; // Push stars to background
        starPositions.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Ground plane for shadow
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshPhongMaterial({
        color: 0x0a0a1e,
        emissive: 0x0a0a1e,
        shininess: 10,
        transparent: true,
        opacity: 0.5
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Seesaw visualization
    const seesawGroup = new THREE.Group();
    scene.add(seesawGroup);
    
    // Base/Fulcrum
    const baseGeometry = new THREE.ConeGeometry(1, 2, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x8338ec,
        emissive: 0x8338ec,
        emissiveIntensity: 0.3,
        shininess: 50
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1;
    base.castShadow = true;
    base.receiveShadow = true;
    seesawGroup.add(base);
    
    // Board
    const boardGeometry = new THREE.BoxGeometry(12, 0.3, 2);
    const boardMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        emissive: 0x555555,
        emissiveIntensity: 0.1,
        shininess: 30
    });
    
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.castShadow = true;
    board.receiveShadow = true;
    seesawGroup.add(board);
    
    // Board decorative lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePoints = [];
    
    // Create lines along the board
    for (let i = -5.5; i <= 5.5; i += 0.5) {
        linePoints.push(
            new THREE.Vector3(i, 0.16, -0.8),
            new THREE.Vector3(i, 0.16, 0.8)
        );
    }
    
    lineGeometry.setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
    const boardLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    board.add(boardLines);
    
    // Particles on seesaw
    const particleGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    
    const particle1Material = new THREE.MeshPhongMaterial({ 
        color: 0x3a86ff,
        emissive: 0x3a86ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9,
        shininess: 80
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({ 
        color: 0xff006e,
        emissive: 0xff006e,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9,
        shininess: 80
    });
    
    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    
    particle1.position.x = -5;
    particle2.position.x = 5;
    
    particle1.castShadow = true;
    particle2.castShadow = true;
    
    seesawGroup.add(particle1);
    seesawGroup.add(particle2);
    
    // Add glow effect for particles
    const createGlow = (particle, color) => {
        const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        particle.add(glow);
        return glow;
    };
    
    const glow1 = createGlow(particle1, 0x3a86ff);
    const glow2 = createGlow(particle2, 0xff006e);
    
    // Particle trails
    class ParticleTrail {
        constructor(color, maxPoints = 50) {
            this.maxPoints = maxPoints;
            this.points = [];
            
            for (let i = 0; i < maxPoints; i++) {
                this.points.push(new THREE.Vector3(0, 0, 0));
            }
            
            this.geometry = new THREE.BufferGeometry();
            this.material = new THREE.LineBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.5
            });
            
            this.line = new THREE.Line(this.geometry, this.material);
            seesawGroup.add(this.line);
        }
        
        update(position) {
            // Shift points back
            for (let i = this.points.length - 1; i > 0; i--) {
                this.points[i].copy(this.points[i - 1]);
            }
            
            // Add new point at front
            this.points[0].copy(position);
            
            // Update geometry
            this.geometry.setFromPoints(this.points);
        }
        
        dispose() {
            this.geometry.dispose();
            this.material.dispose();
            seesawGroup.remove(this.line);
        }
    }
    
    const trail1 = new ParticleTrail(0x3a86ff);
    const trail2 = new ParticleTrail(0xff006e);
    
    // Add particle systems for energy visualization
    class EnergyParticles {
        constructor(color, host) {
            this.particleCount = 30;
            this.particles = new THREE.Group();
            host.add(this.particles);
            
            const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7
            });
            
            this.particleInstances = [];
            
            for (let i = 0; i < this.particleCount; i++) {
                const particle = new THREE.Mesh(particleGeo, particleMat.clone());
                particle.userData = {
                    offset: Math.random() * Math.PI * 2,
                    speed: 0.01 + Math.random() * 0.02,
                    radius: 0.4 + Math.random() * 0.6,
                    initialY: Math.random() * 0.2
                };
                this.particles.add(particle);
                this.particleInstances.push(particle);
            }
        }
        
        update(time, intensity = 1.0) {
            this.particleInstances.forEach(particle => {
                const data = particle.userData;
                const angle = time * data.speed + data.offset;
                
                particle.position.x = Math.cos(angle) * data.radius * intensity;
                particle.position.y = data.initialY + Math.sin(time * 2) * 0.05 * intensity;
                particle.position.z = Math.sin(angle) * data.radius * intensity;
                
                particle.material.opacity = 0.5 * intensity + Math.sin(angle) * 0.2;
                
                const scale = (0.5 + Math.sin(time * 3 + data.offset) * 0.2) * intensity;
                particle.scale.set(scale, scale, scale);
            });
        }
        
        dispose() {
            this.particleInstances.forEach(particle => {
                particle.geometry.dispose();
                particle.material.dispose();
                this.particles.remove(particle);
            });
        }
    }
    
    const energyParticles1 = new EnergyParticles(0x3a86ff, particle1);
    const energyParticles2 = new EnergyParticles(0xff006e, particle2);
    
    // Entanglement visualization
    const entanglementGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    entanglementGeometry.rotateZ(Math.PI / 2);
    
    const entanglementMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        transparent: true,
        opacity: 0.6
    });
    
    const entanglementLine = new THREE.Mesh(entanglementGeometry, entanglementMaterial);
    seesawGroup.add(entanglementLine);
    
    // Add energy flow along entanglement
    const energyFlowCount = 8;
    const energyFlows = [];
    
    for (let i = 0; i < energyFlowCount; i++) {
        const flowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const flowMaterial = new THREE.MeshBasicMaterial({
            color: 0x8338ec,
            transparent: true,
            opacity: 0.8
        });
        
        const flow = new THREE.Mesh(flowGeometry, flowMaterial);
        flow.userData = {
            offset: i / energyFlowCount,
            speed: 0.6 + Math.random() * 0.4
        };
        flow.visible = false;
        seesawGroup.add(flow);
        energyFlows.push(flow);
    }
    
    // Interactive elements - handles on both sides
    const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        emissive: 0x555555,
        shininess: 80
    });
    
    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-5.5, 0.35, 0);
    leftHandle.rotation.x = Math.PI / 2;
    board.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(5.5, 0.35, 0);
    rightHandle.rotation.x = Math.PI / 2;
    board.add(rightHandle);
    
    // State
    let tiltAngle = 0;
    let targetTiltAngle = 0;
    const maxTiltAngle = Math.PI / 8;
    const tiltSpeed = 0.05;
    let energyFlowing = false;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Smoothly tilt the seesaw towards the target angle
        tiltAngle += (targetTiltAngle - tiltAngle) * tiltSpeed;
        seesawGroup.rotation.z = tiltAngle;
        
        // Update particle positions relative to board
        const boardLength = 12;
        const particleHeight = 0.85; // Height above board
        
        // Calculate board height at particle positions
        const leftHeight = -Math.sin(tiltAngle) * (boardLength / 2);
        const rightHeight = Math.sin(tiltAngle) * (boardLength / 2);
        
        // Adjust particles to stay on the board
        particle1.position.set(-5, leftHeight + particleHeight, 0);
        particle2.position.set(5, rightHeight + particleHeight, 0);
        
        // Add small oscillations to particles for visual interest
        particle1.position.y += Math.sin(time * 5) * 0.05;
        particle2.position.y += Math.sin(time * 5 + Math.PI) * 0.05;
        
        // Update trails
        trail1.update(particle1.position);
        trail2.update(particle2.position);
        
        // Update energy particles
        energyParticles1.update(time, 1 + Math.abs(tiltAngle) * 5);
        energyParticles2.update(time, 1 + Math.abs(tiltAngle) * 5);
        
        // Update entanglement visualization
        entanglementLine.position.set(0, 0, 0);
        entanglementLine.lookAt(particle2.position);
        
        const distance = particle1.position.distanceTo(particle2.position);
        entanglementLine.scale.set(distance, 0.15 + Math.sin(time * 3) * 0.05, 0.15 + Math.sin(time * 3) * 0.05);
        
        entanglementLine.material.opacity = 0.5 + Math.sin(time * 2) * 0.2;
        
        // Update energy flows along entanglement
        if (Math.abs(tiltAngle) > 0.05) {
            energyFlowing = true;
        } else if (Math.abs(tiltAngle) < 0.01) {
            energyFlowing = false;
        }
        
        if (energyFlowing) {
            const flowDirection = tiltAngle > 0 ? 1 : -1;
            
            energyFlows.forEach(flow => {
                flow.visible = true;
                const data = flow.userData;
                
                // Calculate position along the entanglement line
                data.offset += data.speed * 0.01 * flowDirection;
                if (data.offset > 1) data.offset = 0;
                if (data.offset < 0) data.offset = 1;
                
                // Interpolate position between particles
                const t = data.offset;
                const x = particle1.position.x * (1 - t) + particle2.position.x * t;
                const y = particle1.position.y * (1 - t) + particle2.position.y * t;
                const z = particle1.position.z * (1 - t) + particle2.position.z * t;
                
                flow.position.set(x, y, z);
                
                // Pulse effect
                const scale = 0.7 + Math.sin(time * 5 + data.offset * 10) * 0.3;
                flow.scale.set(scale, scale, scale);
            });
        } else {
            energyFlows.forEach(flow => {
                flow.visible = false;
            });
        }
        
        // Particle glow effect
        particle1Material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.2;
        particle2Material.emissiveIntensity = 0.5 + Math.sin(time * 3 + Math.PI) * 0.2;
        
        // Update glow size based on energy level
        const glowFactor1 = 1 + Math.abs(tiltAngle) * 5 * (tiltAngle < 0 ? 1 : 0.5);
        const glowFactor2 = 1 + Math.abs(tiltAngle) * 5 * (tiltAngle > 0 ? 1 : 0.5);
        
        glow1.scale.set(glowFactor1, glowFactor1, glowFactor1);
        glow2.scale.set(glowFactor2, glowFactor2, glowFactor2);
        
        // Make stars twinkle
        stars.rotation.y = time * 0.01;
        stars.rotation.z = time * 0.005;
        starMaterial.size = 0.1 + Math.sin(time * 0.5) * 0.02;
        
        // Update controls
        controls.update();
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let selectedSide = null;
    
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchend', onMouseUp);
    
    function onMouseDown(event) {
        event.preventDefault();
        mouse.x = (event.clientX / width) * 2 - 1;
        mouse.y = -(event.clientY / height) * 2 + 1;
        checkIntersection();
    }
    
    function onTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        mouse.x = (touch.clientX / width) * 2 - 1;
        mouse.y = -(touch.clientY / height) * 2 + 1;
        checkIntersection();
    }
    
    function checkIntersection() {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([leftHandle, rightHandle], false);
        
        if (intersects.length > 0) {
            isDragging = true;
            selectedSide = intersects[0].object === leftHandle ? 'left' : 'right';
            
            // Highlight selected handle
            intersects[0].object.material.emissive.set(0x8338ec);
        }
    }
    
    function onMouseMove(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        mouse.y = -(event.clientY / height) * 2 + 1;
        updateTilt();
    }
    
    function onTouchMove(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        const touch = event.touches[0];
        mouse.y = -(touch.clientY / height) * 2 + 1;
        updateTilt();
    }
    
    function updateTilt() {
        // Use mouse y position to determine tilt
        const tiltFactor = mouse.y * 1.5; // Amplify effect
        
        if (selectedSide === 'left') {
            targetTiltAngle = Math.max(-maxTiltAngle, Math.min(maxTiltAngle, tiltFactor));
        } else {
            targetTiltAngle = Math.max(-maxTiltAngle, Math.min(maxTiltAngle, -tiltFactor));
        }
    }
    
    function onMouseUp() {
        if (!isDragging) return;
        
        isDragging = false;
        selectedSide = null;
        
        // Reset handle colors
        leftHandle.material.emissive.set(0x555555);
        rightHandle.material.emissive.set(0x555555);
        
        // Gradually return to balance
        targetTiltAngle = 0;
    }
    
    // Actions
    const actions = {
        tiltLeft: function() {
            targetTiltAngle = maxTiltAngle;
            leftHandle.material.emissive.set(0x8338ec);
            setTimeout(() => {
                leftHandle.material.emissive.set(0x555555);
            }, 500);
        },
        
        tiltRight: function() {
            targetTiltAngle = -maxTiltAngle;
            rightHandle.material.emissive.set(0x8338ec);
            setTimeout(() => {
                rightHandle.material.emissive.set(0x555555);
            }, 500);
        },
        
        balance: function() {
            targetTiltAngle = 0;
            
            // Add a quick flash effect to both handles
            leftHandle.material.emissive.set(0x8338ec);
            rightHandle.material.emissive.set(0x8338ec);
            
            setTimeout(() => {
                leftHandle.material.emissive.set(0x555555);
                rightHandle.material.emissive.set(0x555555);
            }, 300);
        }
    };
    
    // Handle resize
    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }
    
    // Cleanup
    function dispose() {
        renderer.dispose();
        container.removeChild(renderer.domElement);
        
        // Remove event listeners
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('touchend', onMouseUp);
        
        // Dispose geometries and materials
        baseGeometry.dispose();
        baseMaterial.dispose();
        boardGeometry.dispose();
        boardMaterial.dispose();
        particleGeometry.dispose();
        particle1Material.dispose();
        particle2Material.dispose();
        entanglementGeometry.dispose();
        entanglementMaterial.dispose();
        handleGeometry.dispose();
        handleMaterial.dispose();
        starGeometry.dispose();
        starMaterial.dispose();
        groundGeometry.dispose();
        groundMaterial.dispose();
        
        trail1.dispose();
        trail2.dispose();
        energyParticles1.dispose();
        energyParticles2.dispose();
        
        energyFlows.forEach(flow => {
            flow.geometry.dispose();
            flow.material.dispose();
        });
        
        // Remove event listeners
        window.removeEventListener('resize', resize);
    }
    
    return {
        resize,
        dispose,
        actions
    };
}