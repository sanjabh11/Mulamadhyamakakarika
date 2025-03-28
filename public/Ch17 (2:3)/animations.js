import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colors, animationSettings } from './config.js';

class Animation {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(colors.background, 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.container.appendChild(this.renderer.domElement);
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        
        this.camera.position.z = animationSettings.cameraDistance;
        
        this.particles = [];
        this.clock = new THREE.Clock();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        this.setupLighting();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
        
        this.animationPaused = false;
    }
    
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(colors.glow, 2, 50);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }
    
    clearScene() {
        // Remove all particles and other objects
        while(this.scene.children.length > 0) { 
            const object = this.scene.children[0];
            if(object.type === 'Mesh' || object.type === 'Points') {
                if(object.geometry) object.geometry.dispose();
                if(object.material) {
                    if(Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
            this.scene.remove(object); 
        }
        
        this.particles = [];
        this.setupLighting(); // Re-add lights
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate);
        
        if (!this.animationPaused) {
            const delta = this.clock.getDelta();
            this.updateAnimation(delta);
            
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    updateAnimation(delta) {
        // This will be overridden by specific animations
    }
    
    createParticles(count, size = 0.1) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        const color = new THREE.Color();
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            
            vertices.push(x, y, z);
            
            color.setHSL(Math.random(), 0.7, 0.5);
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        return particles;
    }
    
    createGlowMaterial(color) {
        return new THREE.MeshPhongMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
    }
    
    togglePause(isPaused) {
        this.animationPaused = isPaused;
    }
    
    resetCamera() {
        this.camera.position.set(0, 0, animationSettings.cameraDistance);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }
}

export class QuantumMeasurementAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Create measurement apparatus
        const apparatus = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            emissive: 0x222222,
            shininess: 30
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -5;
        apparatus.add(base);
        
        // Glass dome
        const domeGeometry = new THREE.SphereGeometry(4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            roughness: 0.1,
            metalness: 0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.y = -4;
        apparatus.add(dome);
        
        // Quantum state under observation
        const particleSystem = this.createParticles(1000, 0.15);
        particleSystem.position.y = -2;
        apparatus.add(particleSystem);
        this.particleSystem = particleSystem;
        
        // Different interpretations (error states)
        this.interpretations = [];
        const colors = [0xff4444, 0x44ff44, 0x4444ff];
        
        for (let i = 0; i < 3; i++) {
            const interpretation = new THREE.Group();
            
            // Interpretation marker
            const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const markerMaterial = this.createGlowMaterial(colors[i]);
            
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set((i-1) * 8, 0, 0);
            
            // Label for interpretation
            const textGeometry = new THREE.BoxGeometry(4, 0.5, 0.1);
            const textMaterial = new THREE.MeshPhongMaterial({ color: colors[i] });
            const label = new THREE.Mesh(textGeometry, textMaterial);
            label.position.set((i-1) * 8, -2, 0);
            
            interpretation.add(marker);
            interpretation.add(label);
            
            this.scene.add(interpretation);
            this.interpretations.push(interpretation);
        }
        
        this.scene.add(apparatus);
        this.apparatus = apparatus;
        
        // Wave function visual
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-10, -6, 0),
            new THREE.Vector3(-5, 2, 0),
            new THREE.Vector3(5, 2, 0),
            new THREE.Vector3(10, -6, 0)
        );
        
        const points = curve.getPoints(50);
        const waveGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const waveMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00ffff,
            linewidth: 2
        });
        
        const waveLine = new THREE.Line(waveGeometry, waveMaterial);
        waveLine.position.y = -8;
        this.scene.add(waveLine);
        this.waveLine = waveLine;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate measurement process
        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Oscillate particles
                positions[i] += Math.sin(this.time * 2 + i) * 0.01;
                positions[i+1] += Math.cos(this.time * 3 + i) * 0.01;
                positions[i+2] += Math.sin(this.time * 1.5 + i) * 0.01;
            }
            
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate interpretations showing errors
        this.interpretations.forEach((interpretation, i) => {
            interpretation.rotation.y = this.time * 0.2;
            interpretation.position.y = Math.sin(this.time + i) * 0.5;
            
            // Scale effect to show error
            const scale = 1 + 0.2 * Math.sin(this.time * 2 + i * 2);
            interpretation.scale.set(scale, scale, scale);
        });
        
        // Animate the wave function
        if (this.waveLine) {
            this.waveLine.rotation.z = Math.sin(this.time * 0.5) * 0.1;
        }
        
        // Rotate entire apparatus
        if (this.apparatus) {
            this.apparatus.rotation.y = this.time * 0.1;
        }
    }
}

export class QuantumStatePreparationAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Create a group for the quantum state preparation
        const stateGroup = new THREE.Group();
        
        // Central sphere representing the quantum state
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMaterial = this.createGlowMaterial(0x3f51b5);
        const centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        stateGroup.add(centralSphere);
        
        // Orbiting particles
        this.orbitalParticles = [];
        const orbitCount = 3;
        
        for (let i = 0; i < orbitCount; i++) {
            const orbitRadius = 4 + i * 1.5;
            const particleCount = 20 + i * 10;
            const orbitGroup = new THREE.Group();
            
            const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const particleMaterial = this.createGlowMaterial(0x64ffda);
            
            for (let j = 0; j < particleCount; j++) {
                const angle = (j / particleCount) * Math.PI * 2;
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                particle.position.x = Math.cos(angle) * orbitRadius;
                particle.position.z = Math.sin(angle) * orbitRadius;
                particle.userData = { 
                    angle,
                    speed: 0.5 - (i * 0.1),
                    radius: orbitRadius,
                    originY: particle.position.y
                };
                
                orbitGroup.add(particle);
                this.orbitalParticles.push(particle);
            }
            
            // Tilt each orbit differently
            orbitGroup.rotation.x = Math.PI / 4 * (i + 1);
            orbitGroup.rotation.z = Math.PI / 6 * i;
            
            stateGroup.add(orbitGroup);
        }
        
        // Add teachers/guides (Buddhas, Pratyekabuddhas, Sravakas)
        const teacherPositions = [
            { x: -8, y: 0, z: 0, color: 0xffd700, size: 1.2 }, // Buddha
            { x: 0, y: 8, z: 0, color: 0xf5f5f5, size: 1.0 },  // Pratyekabuddha
            { x: 8, y: 0, z: 0, color: 0xffa500, size: 0.8 }   // Sravaka
        ];
        
        teacherPositions.forEach(pos => {
            const teacherGeometry = new THREE.SphereGeometry(pos.size, 32, 32);
            const teacherMaterial = this.createGlowMaterial(pos.color);
            const teacher = new THREE.Mesh(teacherGeometry, teacherMaterial);
            
            teacher.position.set(pos.x, pos.y, pos.z);
            
            // Create connecting beams to central state
            const beamStart = new THREE.Vector3(pos.x, pos.y, pos.z);
            const beamEnd = new THREE.Vector3(0, 0, 0);
            
            const beamGeometry = new THREE.BufferGeometry().setFromPoints([beamStart, beamEnd]);
            const beamMaterial = new THREE.LineBasicMaterial({ 
                color: pos.color,
                linewidth: 3,
                transparent: true,
                opacity: 0.7
            });
            
            const beam = new THREE.Line(beamGeometry, beamMaterial);
            stateGroup.add(beam);
            stateGroup.add(teacher);
        });
        
        // Create reference framework
        const gridHelper = new THREE.GridHelper(20, 20, 0x555555, 0x333333);
        gridHelper.position.y = -5;
        stateGroup.add(gridHelper);
        
        // Create energy field particles
        const energyParticles = this.createParticles(2000, 0.08);
        stateGroup.add(energyParticles);
        this.energyParticles = energyParticles;
        
        this.scene.add(stateGroup);
        this.stateGroup = stateGroup;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Orbit particles around the central sphere
        this.orbitalParticles.forEach(particle => {
            particle.userData.angle += particle.userData.speed * delta;
            
            particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
            particle.position.z = Math.sin(particle.userData.angle) * particle.userData.radius;
            
            // Add vertical oscillation
            particle.position.y = particle.userData.originY + 
                Math.sin(this.time * 2 + particle.userData.angle) * 0.3;
                
            // Pulse size
            const scale = 1 + 0.2 * Math.sin(this.time * 3 + particle.userData.angle * 2);
            particle.scale.set(scale, scale, scale);
        });
        
        // Animate energy field particles
        if (this.energyParticles) {
            const positions = this.energyParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Spiral motion towards center
                const x = positions[i];
                const y = positions[i+1];
                const z = positions[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                if (dist > 15) {
                    // Reset particle to edge
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    positions[i] = 15 * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = 15 * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = 15 * Math.cos(theta);
                } else {
                    // Move particle toward center
                    const moveSpeed = 0.01 + (15 - dist) * 0.003;
                    positions[i] -= (x / dist) * moveSpeed;
                    positions[i+1] -= (y / dist) * moveSpeed;
                    positions[i+2] -= (z / dist) * moveSpeed;
                    
                    // Add some random movement
                    positions[i] += (Math.random() - 0.5) * 0.05;
                    positions[i+1] += (Math.random() - 0.5) * 0.05;
                    positions[i+2] += (Math.random() - 0.5) * 0.05;
                }
            }
            
            this.energyParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Rotate entire state group
        if (this.stateGroup) {
            this.stateGroup.rotation.y = this.time * 0.1;
        }
    }
}

export class QuantumIrreversibilityAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Create four realms group
        const realmsGroup = new THREE.Group();
        
        // Create four distinct realms
        this.realms = [];
        const realmPositions = [
            { x: -7, y: 7, z: 0, color: 0x4fc3f7 },   // Realm 1
            { x: 7, y: 7, z: 0, color: 0x81c784 },    // Realm 2
            { x: -7, y: -7, z: 0, color: 0xff8a65 },  // Realm 3
            { x: 7, y: -7, z: 0, color: 0xba68c8 }    // Realm 4
        ];
        
        realmPositions.forEach(pos => {
            const realmGroup = new THREE.Group();
            
            // Base structure for the realm
            const realmGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
            const realmMaterial = this.createGlowMaterial(pos.color);
            const realmBase = new THREE.Mesh(realmGeometry, realmMaterial);
            
            // Core of the realm
            const coreGeometry = new THREE.IcosahedronGeometry(1, 1);
            const coreMaterial = this.createGlowMaterial(pos.color);
            coreMaterial.emissiveIntensity = 1.0;
            const realmCore = new THREE.Mesh(coreGeometry, coreMaterial);
            
            realmGroup.add(realmBase);
            realmGroup.add(realmCore);
            
            // Add particles for each realm
            const particleCount = 300;
            const realmParticles = this.createParticles(particleCount, 0.1);
            
            // Modify particle colors
            const colors = realmParticles.geometry.attributes.color.array;
            const color = new THREE.Color(pos.color);
            for (let i = 0; i < colors.length; i += 3) {
                colors[i] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
            }
            realmParticles.geometry.attributes.color.needsUpdate = true;
            
            realmGroup.add(realmParticles);
            realmGroup.position.set(pos.x, pos.y, pos.z);
            
            this.realms.push({
                group: realmGroup,
                particles: realmParticles,
                base: realmBase,
                core: realmCore,
                position: new THREE.Vector3(pos.x, pos.y, pos.z),
                color: pos.color
            });
            
            realmsGroup.add(realmGroup);
        });
        
        // Create the irrevocable action/debt visualization
        const contractGeometry = new THREE.BoxGeometry(2, 3, 0.2);
        const contractMaterial = new THREE.MeshPhongMaterial({
            color: 0xf5f5dc,  // Parchment color
            emissive: 0x111111,
            specular: 0x555555,
            shininess: 30
        });
        const contract = new THREE.Mesh(contractGeometry, contractMaterial);
        contract.position.set(0, 0, 3);
        realmsGroup.add(contract);
        this.contract = contract;
        
        // Create action threads connecting contract to realms
        this.actionThreads = [];
        
        this.realms.forEach(realm => {
            const start = new THREE.Vector3(0, 0, 3);
            const end = realm.position.clone();
            
            const points = [];
            points.push(start);
            
            // Add a few control points to make the thread curve
            const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
            mid.z += 5;
            points.push(mid);
            points.push(end);
            
            const curve = new THREE.CatmullRomCurve3(points);
            const threadGeometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
            const threadMaterial = new THREE.MeshPhongMaterial({
                color: realm.color,
                emissive: realm.color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.7
            });
            
            const thread = new THREE.Mesh(threadGeometry, threadMaterial);
            
            this.actionThreads.push({
                mesh: thread,
                curve: curve,
                targetRealm: realm
            });
            
            realmsGroup.add(thread);
        });
        
        // Add energy particles flowing along the threads
        this.flowParticles = [];
        
        this.actionThreads.forEach(thread => {
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const particleMaterial = this.createGlowMaterial(thread.targetRealm.color);
                particleMaterial.transparent = true;
                particleMaterial.opacity = 0.9;
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                // Place along the thread
                const position = thread.curve.getPoint(i / particleCount);
                particle.position.copy(position);
                
                particle.userData = {
                    thread: thread,
                    progress: i / particleCount,
                    speed: 0.2 + Math.random() * 0.3
                };
                
                this.flowParticles.push(particle);
                realmsGroup.add(particle);
            }
        });
        
        this.scene.add(realmsGroup);
        this.realmsGroup = realmsGroup;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate realm rotations
        this.realms.forEach((realm, index) => {
            realm.group.rotation.x = this.time * 0.2 * (index % 2 ? 1 : -1);
            realm.group.rotation.y = this.time * 0.3 * (index % 3 ? 1 : -1);
            
            // Pulsate core
            const scale = 1 + 0.2 * Math.sin(this.time * 2 + index);
            realm.core.scale.set(scale, scale, scale);
            
            // Animate realm particles
            if (realm.particles) {
                const positions = realm.particles.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const y = positions[i+1];
                    const z = positions[i+2];
                    
                    const dist = Math.sqrt(x*x + y*y + z*z);
                    
                    if (dist > 3) {
                        // Reset particle
                        const phi = Math.random() * Math.PI * 2;
                        const theta = Math.random() * Math.PI;
                        positions[i] = 3 * Math.sin(theta) * Math.cos(phi);
                        positions[i+1] = 3 * Math.sin(theta) * Math.sin(phi);
                        positions[i+2] = 3 * Math.cos(theta);
                    } else {
                        // Movement pattern
                        positions[i] += Math.sin(this.time * 2 + i) * 0.01;
                        positions[i+1] += Math.cos(this.time * 2 + i) * 0.01;
                        positions[i+2] += Math.sin(this.time * 1.5 + i) * 0.01;
                    }
                }
                
                realm.particles.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        // Animate contract
        if (this.contract) {
            this.contract.rotation.y = this.time * 0.5;
            this.contract.position.z = 3 + Math.sin(this.time) * 0.5;
        }
        
        // Animate flow particles
        this.flowParticles.forEach(particle => {
            particle.userData.progress += particle.userData.speed * delta;
            
            if (particle.userData.progress > 1) {
                particle.userData.progress = 0;
            }
            
            const position = particle.userData.thread.curve.getPoint(particle.userData.progress);
            particle.position.copy(position);
            
            // Pulse size
            const scale = 1 + 0.3 * Math.sin(this.time * 5 + particle.userData.progress * 10);
            particle.scale.set(scale, scale, scale);
        });
        
        // Rotate entire realm group
        if (this.realmsGroup) {
            this.realmsGroup.rotation.z = Math.sin(this.time * 0.1) * 0.1;
        }
    }
}

export class QuantumCultivationAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Create cultivation environment
        const environmentGroup = new THREE.Group();
        
        // Energy field
        const fieldGeometry = new THREE.SphereGeometry(10, 32, 32);
        const fieldMaterial = new THREE.MeshPhongMaterial({
            color: 0x304ffe,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        environmentGroup.add(energyField);
        
        // Central action seed
        const seedGeometry = new THREE.IcosahedronGeometry(1, 2);
        const seedMaterial = this.createGlowMaterial(0xff4081);
        const actionSeed = new THREE.Mesh(seedGeometry, seedMaterial);
        environmentGroup.add(actionSeed);
        this.actionSeed = actionSeed;
        
        // Create cultivation energy particles
        this.energyParticles = this.createParticles(2000, 0.1);
        environmentGroup.add(this.energyParticles);
        
        // Create cultivation beams
        this.cultivationBeams = [];
        
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const distance = 5;
            
            const beamSource = new THREE.Vector3(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                0
            );
            
            // Create source node
            const sourceGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const sourceMaterial = this.createGlowMaterial(0x00e676);
            const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
            source.position.copy(beamSource);
            
            // Create beam
            const beamCurve = new THREE.QuadraticBezierCurve3(
                beamSource,
                new THREE.Vector3(
                    beamSource.x * 0.5,
                    beamSource.y * 0.5,
                    3 * (i % 2 ? 1 : -1)
                ),
                new THREE.Vector3(0, 0, 0)
            );
            
            const beamGeometry = new THREE.TubeGeometry(beamCurve, 20, 0.1, 8, false);
            const beamMaterial = new THREE.MeshPhongMaterial({
                color: 0x00e676,
                emissive: 0x00e676,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.7
            });
            
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            
            this.cultivationBeams.push({
                source,
                beam,
                curve: beamCurve,
                angle
            });
            
            environmentGroup.add(source);
            environmentGroup.add(beam);
        }
        
        // Add flow particles along cultivation beams
        this.flowParticles = [];
        
        this.cultivationBeams.forEach(beamObj => {
            for (let i = 0; i < 20; i++) {
                const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const particleMaterial = this.createGlowMaterial(0x00e676);
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                // Position along beam
                const position = beamObj.curve.getPoint(i / 20);
                particle.position.copy(position);
                
                particle.userData = {
                    beam: beamObj,
                    progress: i / 20,
                    speed: 0.3 + Math.random() * 0.3
                };
                
                this.flowParticles.push(particle);
                environmentGroup.add(particle);
            }
        });
        
        // Ground platform
        const groundGeometry = new THREE.CircleGeometry(10, 32);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x263238,
            emissive: 0x111111,
            shininess: 10
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -4;
        environmentGroup.add(ground);
        
        this.scene.add(environmentGroup);
        this.environmentGroup = environmentGroup;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate action seed transformation
        if (this.actionSeed) {
            this.actionSeed.rotation.x = this.time * 0.5;
            this.actionSeed.rotation.y = this.time * 0.7;
            
            // Pulse and grow
            const growthFactor = 1 + Math.sin(this.time * 0.3) * 0.2;
            const baseFactor = Math.min(2, 1 + this.time * 0.05);
            this.actionSeed.scale.set(
                baseFactor * growthFactor,
                baseFactor * growthFactor,
                baseFactor * growthFactor
            );
            
            // Change color over time (from red to gold)
            const hue = (0.95 + Math.sin(this.time * 0.1) * 0.05);
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            this.actionSeed.material.color.set(color);
            this.actionSeed.material.emissive.set(color);
        }
        
        // Animate energy particles
        if (this.energyParticles) {
            const positions = this.energyParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i+1];
                const z = positions[i+2];
                
                const distToCenter = Math.sqrt(x*x + y*y + z*z);
                
                if (distToCenter < 1.5 * Math.max(1, Math.min(2, 1 + this.time * 0.05))) {
                    // Reset particle to outer ring
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    positions[i] = 10 * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = 10 * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = 10 * Math.cos(theta);
                } else {
                    // Spiral toward center
                    const angle = Math.atan2(y, x) + 0.02;
                    const radius = distToCenter * 0.99;
                    
                    positions[i] = Math.cos(angle) * radius;
                    positions[i+1] = Math.sin(angle) * radius;
                    
                    // Add some vertical motion
                    positions[i+2] *= 0.99;
                    positions[i+2] += Math.sin(this.time * 5 + i) * 0.01;
                }
            }
            
            this.energyParticles.geometry.attributes.position.needsUpdate = true;
            
            // Update colors based on position
            const colors = this.energyParticles.geometry.attributes.color.array;
            const positions2 = this.energyParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < colors.length; i += 3) {
                const x = positions2[i];
                const y = positions2[i+1];
                const z = positions2[i+2];
                
                const distToCenter = Math.sqrt(x*x + y*y + z*z);
                const color = new THREE.Color();
                
                // Color gradient based on distance to center
                const hue = 0.6 + 0.3 * (1 - Math.min(1, distToCenter / 10));
                color.setHSL(hue, 0.8, 0.5);
                
                colors[i] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
            }
            
            this.energyParticles.geometry.attributes.color.needsUpdate = true;
        }
        
        // Animate cultivation beams and sources
        this.cultivationBeams.forEach((beamObj, index) => {
            // Pulse source
            const sourceScale = 1 + 0.3 * Math.sin(this.time * 3 + index);
            beamObj.source.scale.set(sourceScale, sourceScale, sourceScale);
            
            // Orbit sources
            const angle = beamObj.angle + this.time * 0.2;
            const distance = 5 + Math.sin(this.time * 0.5 + index) * 0.5;
            
            beamObj.source.position.x = Math.cos(angle) * distance;
            beamObj.source.position.y = Math.sin(angle) * distance;
            
            // Update beam curve
            beamObj.curve = new THREE.QuadraticBezierCurve3(
                beamObj.source.position.clone(),
                new THREE.Vector3(
                    beamObj.source.position.x * 0.5,
                    beamObj.source.position.y * 0.5,
                    3 * Math.sin(this.time + index)
                ),
                this.actionSeed.position.clone()
            );
            
            // Recreate beam with new curve
            const newBeamGeometry = new THREE.TubeGeometry(beamObj.curve, 20, 0.1, 8, false);
            beamObj.beam.geometry.dispose();
            beamObj.beam.geometry = newBeamGeometry;
        });
        
        // Update flow particles
        this.flowParticles.forEach(particle => {
            particle.userData.progress += particle.userData.speed * delta;
            
            if (particle.userData.progress > 1) {
                particle.userData.progress = 0;
            }
            
            const position = particle.userData.beam.curve.getPoint(particle.userData.progress);
            particle.position.copy(position);
            
            // Pulse size
            const scale = 1 + 0.5 * Math.sin(this.time * 10 + particle.userData.progress * 20);
            particle.scale.set(scale, scale, scale);
        });
        
        // Slowly rotate entire environment
        if (this.environmentGroup) {
            this.environmentGroup.rotation.y = this.time * 0.1;
        }
    }
}

export class QuantumPreservationAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Create quantum state preservation system
        const preservationGroup = new THREE.Group();
        
        // Quantum state container
        const containerGeometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
        const containerMaterial = this.createGlowMaterial(0x3949ab);
        const stateContainer = new THREE.Mesh(containerGeometry, containerMaterial);
        preservationGroup.add(stateContainer);
        this.stateContainer = stateContainer;
        
        // Create second container
        const container2Geometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
        const container2Material = this.createGlowMaterial(0x3949ab);
        const stateContainer2 = new THREE.Mesh(container2Geometry, container2Material);
        stateContainer2.rotation.x = Math.PI / 2;
        preservationGroup.add(stateContainer2);
        this.stateContainer2 = stateContainer2;
        
        // Central quantum state
        const stateGeometry = new THREE.IcosahedronGeometry(2, 1);
        const stateMaterial = this.createGlowMaterial(0x00b0ff);
        const quantumState = new THREE.Mesh(stateGeometry, stateMaterial);
        preservationGroup.add(quantumState);
        this.quantumState = quantumState;
        
        // Create protection field (smooth sphere)
        const fieldGeometry = new THREE.SphereGeometry(3, 32, 32);
        const fieldMaterial = new THREE.MeshPhongMaterial({
            color: 0x80deea,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const protectionField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        preservationGroup.add(protectionField);
        this.protectionField = protectionField;
        
        // Create three demonstration zones for handling
        const zonePositions = [
            { x: -10, y: 0, z: 0, color: 0xf44336, label: "Wrong Letting Go" },
            { x: 0, y: 10, z: 0, color: 0xffeb3b, label: "Transcendence" },
            { x: 10, y: 0, z: 0, color: 0x4caf50, label: "Proper Handling" }
        ];
        
        this.demonstrationZones = [];
        
        zonePositions.forEach((zone, index) => {
            const zoneGroup = new THREE.Group();
            
            // Zone indicator
            const zoneGeometry = new THREE.RingGeometry(1.5, 2, 32);
            const zoneMaterial = new THREE.MeshPhongMaterial({
                color: zone.color,
                emissive: zone.color,
                emissiveIntensity: 0.3,
                side: THREE.DoubleSide
            });
            const zoneIndicator = new THREE.Mesh(zoneGeometry, zoneMaterial);
            
            // Rotation to make it horizontal
            zoneIndicator.rotation.x = Math.PI / 2;
            
            // Create demonstration state (smaller version of the main state)
            const demoStateGeometry = new THREE.IcosahedronGeometry(1, 1);
            const demoStateMaterial = this.createGlowMaterial(0x00b0ff);
            const demoState = new THREE.Mesh(demoStateGeometry, demoStateMaterial);
            
            // Position them
            zoneGroup.position.set(zone.x, zone.y, zone.z);
            
            // Add particles to show effects
            const effectParticles = this.createParticles(300, 0.1);
            
            // Adjust particle colors
            const colors = effectParticles.geometry.attributes.color.array;
            const color = new THREE.Color(zone.color);
            for (let i = 0; i < colors.length; i += 3) {
                colors[i] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
            }
            effectParticles.geometry.attributes.color.needsUpdate = true;
            
            zoneGroup.add(zoneIndicator);
            zoneGroup.add(demoState);
            zoneGroup.add(effectParticles);
            
            this.demonstrationZones.push({
                group: zoneGroup,
                indicator: zoneIndicator,
                state: demoState,
                particles: effectParticles,
                type: index  // 0: wrong, 1: transcendence, 2: proper
            });
            
            preservationGroup.add(zoneGroup);
        });
        
        // Main state particles
        this.stateParticles = this.createParticles(1000, 0.08);
        preservationGroup.add(this.stateParticles);
        
        this.scene.add(preservationGroup);
        this.preservationGroup = preservationGroup;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate state containers (rotate)
        if (this.stateContainer) {
            this.stateContainer.rotation.z = this.time * 0.2;
            this.stateContainer.rotation.x = Math.sin(this.time * 0.3) * 0.2;
        }
        
        if (this.stateContainer2) {
            this.stateContainer2.rotation.z = -this.time * 0.3;
            this.stateContainer2.rotation.y = Math.sin(this.time * 0.2) * 0.2;
        }
        
        // Animate central quantum state
        if (this.quantumState) {
            this.quantumState.rotation.x = this.time * 0.5;
            this.quantumState.rotation.y = this.time * 0.7;
            
            // Subtle pulsing
            const scale = 1 + 0.1 * Math.sin(this.time * 2);
            this.quantumState.scale.set(scale, scale, scale);
        }
        
        // Animate protection field
        if (this.protectionField) {
            // Subtle pulsing
            const scale = 1 + 0.05 * Math.sin(this.time * 1.5);
            this.protectionField.scale.set(scale, scale, scale);
            
            // Change opacity
            this.protectionField.material.opacity = 0.15 + 0.1 * Math.sin(this.time * 1.2);
        }
        
        // Animate main state particles
        if (this.stateParticles) {
            const positions = this.stateParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Orbit around center
                const x = positions[i];
                const y = positions[i+1];
                const z = positions[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                if (dist > 3.5) {
                    // Reset particle
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    positions[i] = 3 * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = 3 * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = 3 * Math.cos(theta);
                } else {
                    // Orbital movement
                    const phi = Math.atan2(y, x) + 0.01;
                    const theta = Math.acos(z / dist);
                    
                    positions[i] = dist * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = dist * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = dist * Math.cos(theta);
                    
                    // Add some fluctuation
                    positions[i] += (Math.random() - 0.5) * 0.02;
                    positions[i+1] += (Math.random() - 0.5) * 0.02;
                    positions[i+2] += (Math.random() - 0.5) * 0.02;
                }
            }
            
            this.stateParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate demonstration zones
        this.demonstrationZones.forEach((zone, index) => {
            // Spin zone indicator
            zone.indicator.rotation.z = this.time * 0.3 * (index % 2 ? 1 : -1);
            
            // Animate demo state based on type
            if (zone.type === 0) {  // Wrong letting go
                // Collapse and fragment
                zone.state.scale.set(
                    Math.max(0.1, 1 - 0.5 * Math.sin(this.time * 0.5)),
                    Math.max(0.1, 1 - 0.5 * Math.sin(this.time * 0.5)),
                    Math.max(0.1, 1 - 0.5 * Math.sin(this.time * 0.5))
                );
                
                // Change color to error
                const errorIntensity = 0.5 + 0.5 * Math.sin(this.time);
                const errorColor = new THREE.Color(errorIntensity, 0, 0);
                zone.state.material.color.set(errorColor);
                zone.state.material.emissive.set(errorColor);
                
                // Chaotic rotation
                zone.state.rotation.x = this.time * 3;
                zone.state.rotation.y = this.time * 4;
                zone.state.rotation.z = this.time * 5;
            } 
            else if (zone.type === 1) {  // Transcendence
                // Expand and become more transparent
                const transcendScale = 1 + 0.5 * Math.sin(this.time * 0.3);
                zone.state.scale.set(transcendScale, transcendScale, transcendScale);
                
                // Shift color to gold/white
                const transcendColor = new THREE.Color(1, 0.9, 0.5);
                zone.state.material.color.set(transcendColor);
                zone.state.material.emissive.set(transcendColor);
                
                // Gentle rotation
                zone.state.rotation.y = this.time * 0.5;
            }
            else {  // Proper handling
                // Stable with gentle pulsing
                const stableScale = 1 + 0.1 * Math.sin(this.time * 1.5);
                zone.state.scale.set(stableScale, stableScale, stableScale);
                
                // Healthy blue color
                const healthyColor = new THREE.Color(0, 0.7, 1);
                zone.state.material.color.set(healthyColor);
                zone.state.material.emissive.set(healthyColor);
                
                // Balanced rotation
                zone.state.rotation.y = this.time * 0.7;
                zone.state.rotation.z = this.time * 0.5;
            }
            
            // Animate particles based on zone type
            if (zone.particles) {
                const positions = zone.particles.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    if (zone.type === 0) {  // Wrong letting go - chaotic scattering
                        positions[i] += (Math.random() - 0.5) * 0.2;
                        positions[i+1] += (Math.random() - 0.5) * 0.2;
                        positions[i+2] += (Math.random() - 0.5) * 0.2;
                        
                        // Keep particles within range
                        const dist = Math.sqrt(
                            positions[i]*positions[i] + 
                            positions[i+1]*positions[i+1] + 
                            positions[i+2]*positions[i+2]
                        );
                        
                        if (dist > 3) {
                            positions[i] *= 0.9;
                            positions[i+1] *= 0.9;
                            positions[i+2] *= 0.9;
                        }
                    }
                    else if (zone.type === 1) {  // Transcendence - expanding gently
                        const x = positions[i];
                        const y = positions[i+1];
                        const z = positions[i+2];
                        
                        const dist = Math.sqrt(x*x + y*y + z*z);
                        
                        if (dist < 0.5) {
                            // Reset to sphere surface
                            const phi = Math.random() * Math.PI * 2;
                            const theta = Math.random() * Math.PI;
                            positions[i] = 0.5 * Math.sin(theta) * Math.cos(phi);
                            positions[i+1] = 0.5 * Math.sin(theta) * Math.sin(phi);
                            positions[i+2] = 0.5 * Math.cos(theta);
                        } else {
                            // Expand outward
                            positions[i] *= 1.01;
                            positions[i+1] *= 1.01;
                            positions[i+2] *= 1.01;
                            
                            // Reset if too far
                            if (dist > 3) {
                                const phi = Math.random() * Math.PI * 2;
                                const theta = Math.random() * Math.PI;
                                positions[i] = 0.5 * Math.sin(theta) * Math.cos(phi);
                                positions[i+1] = 0.5 * Math.sin(theta) * Math.sin(phi);
                                positions[i+2] = 0.5 * Math.cos(theta);
                            }
                        }
                    }
                    else {  // Proper handling - stable orbital pattern
                        const x = positions[i];
                        const y = positions[i+1];
                        const z = positions[i+2];
                        
                        const dist = Math.sqrt(x*x + y*y + z*z);
                        const phi = Math.atan2(y, x) + 0.02;
                        const theta = Math.acos(z / (dist || 0.001));
                        
                        // Stable orbital movement
                        positions[i] = dist * Math.sin(theta) * Math.cos(phi);
                        positions[i+1] = dist * Math.sin(theta) * Math.sin(phi);
                        positions[i+2] = dist * Math.cos(theta);
                        
                        // Keep in good range
                        if (dist < 0.5 || dist > 2) {
                            const targetDist = 1 + Math.random() * 0.5;
                            positions[i] = targetDist * Math.sin(theta) * Math.cos(phi);
                            positions[i+1] = targetDist * Math.sin(theta) * Math.sin(phi);
                            positions[i+2] = targetDist * Math.cos(theta);
                        }
                    }
                }
                
                zone.particles.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        // Rotate entire scene gently
        if (this.preservationGroup) {
            this.preservationGroup.rotation.y = this.time * 0.1;
        }
    }
}

export class QuantumTunneling extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Create tunneling visualization
        const tunnelGroup = new THREE.Group();
        
        // Create multiple realms separated by barriers
        this.realms = [];
        
        const realmCount = 4;
        const realmSpacing = 8;
        const realmColors = [0x4fc3f7, 0x81c784, 0xff8a65, 0xba68c8];
        const realmCenterX = ((realmCount - 1) * realmSpacing) / -2;
        
        // Create a barrier material
        const barrierMaterial = new THREE.MeshPhongMaterial({
            color: 0x455a64,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        for (let i = 0; i < realmCount; i++) {
            const realmGroup = new THREE.Group();
            
            // Realm container
            const realmGeometry = new THREE.SphereGeometry(3, 32, 32);
            const realmMaterial = new THREE.MeshPhongMaterial({
                color: realmColors[i],
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const realmSphere = new THREE.Mesh(realmGeometry, realmMaterial);
            realmGroup.add(realmSphere);
            
            // Realm core
            const coreGeometry = new THREE.IcosahedronGeometry(1, 1);
            const coreMaterial = this.createGlowMaterial(realmColors[i]);
            const realmCore = new THREE.Mesh(coreGeometry, coreMaterial);
            realmGroup.add(realmCore);
            
            // Position this realm
            realmGroup.position.x = realmCenterX + (i * realmSpacing);
            
            // Create barrier if not the last realm
            if (i < realmCount - 1) {
                const barrierGeometry = new THREE.BoxGeometry(1, 6, 6);
                const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
                barrier.position.x = realmGroup.position.x + (realmSpacing / 2);
                tunnelGroup.add(barrier);
            }
            
            // Realm particles
            const realmParticles = this.createParticles(300, 0.08);
            
            // Set positions within realm sphere
            const positions = realmParticles.geometry.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI;
                const radius = 3 * Math.random();
                
                positions[j] = radius * Math.sin(theta) * Math.cos(phi);
                positions[j+1] = radius * Math.sin(theta) * Math.sin(phi);
                positions[j+2] = radius * Math.cos(theta);
            }
            realmParticles.geometry.attributes.position.needsUpdate = true;
            
            // Set colors to match realm
            const colors = realmParticles.geometry.attributes.color.array;
            const color = new THREE.Color(realmColors[i]);
            for (let j = 0; j < colors.length; j += 3) {
                colors[j] = color.r;
                colors[j+1] = color.g;
                colors[j+2] = color.b;
            }
            realmParticles.geometry.attributes.color.needsUpdate = true;
            
            realmGroup.add(realmParticles);
            
            this.realms.push({
                group: realmGroup,
                sphere: realmSphere,
                core: realmCore,
                particles: realmParticles,
                color: realmColors[i],
                index: i
            });
            
            tunnelGroup.add(realmGroup);
        }
        
        // Create tunneling particles
        this.tunnelingParticles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const realmIndex = Math.floor(Math.random() * realmCount);
            const nextRealmIndex = (realmIndex + 1) % realmCount;
            
            const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const particleMaterial = this.createGlowMaterial(realmColors[realmIndex]);
            particleMaterial.transparent = true;
            particleMaterial.opacity = 0.9;
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Start in random position in source realm
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const radius = 3 * Math.random();
            
            particle.position.x = this.realms[realmIndex].group.position.x + 
                radius * Math.sin(theta) * Math.cos(phi);
            particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
            particle.position.z = radius * Math.cos(theta);
            
            particle.userData = {
                sourceRealm: realmIndex,
                targetRealm: nextRealmIndex,
                tunnelProgress: 0,
                tunnelSpeed: 0.2 + Math.random() * 0.3,
                inTunnel: false,
                complete: false
            };
            
            this.tunnelingParticles.push(particle);
            tunnelGroup.add(particle);
        }
        
        // Create action labels (irrevocability indicator)
        const textGeometry = new THREE.BoxGeometry(4, 0.5, 0.1);
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
        const actionLabel = new THREE.Mesh(textGeometry, textMaterial);
        actionLabel.position.y = 5;
        tunnelGroup.add(actionLabel);
        this.actionLabel = actionLabel;
        
        this.scene.add(tunnelGroup);
        this.tunnelGroup = tunnelGroup;
        
        // Position camera for better view of tunneling
        this.camera.position.set(0, 5, 25);
        this.controls.update();
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate realm cores
        this.realms.forEach((realm, index) => {
            // Rotate cores
            realm.core.rotation.x = this.time * 0.5 * (index % 2 ? 1 : -1);
            realm.core.rotation.y = this.time * 0.7 * (index % 3 ? 1 : -1);
            
            // Pulse cores
            const scale = 1 + 0.2 * Math.sin(this.time * 2 + index);
            realm.core.scale.set(scale, scale, scale);
            
            // Animate realm particles
            if (realm.particles) {
                const positions = realm.particles.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    // Orbital motion within realm
                    const x = positions[i];
                    const y = positions[i+1];
                    const z = positions[i+2];
                    
                    const dist = Math.sqrt(x*x + y*y + z*z);
                    const phi = Math.atan2(y, x) + 0.01;
                    const theta = Math.acos(z / (dist || 0.001));
                    
                    positions[i] = dist * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = dist * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = dist * Math.cos(theta);
                    
                    // Add some fluctuation
                    positions[i] += (Math.random() - 0.5) * 0.02;
                    positions[i+1] += (Math.random() - 0.5) * 0.02;
                    positions[i+2] += (Math.random() - 0.5) * 0.02;
                    
                    // Keep particles within realm
                    if (dist > 3) {
                        const newDist = 2 + Math.random();
                        positions[i] *= newDist / dist;
                        positions[i+1] *= newDist / dist;
                        positions[i+2] *= newDist / dist;
                    }
                }
                
                realm.particles.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        // Animate tunneling particles
        this.tunnelingParticles.forEach(particle => {
            if (!particle.userData.complete) {
                if (!particle.userData.inTunnel) {
                    // Move toward barrier
                    const sourceRealm = this.realms[particle.userData.sourceRealm];
                    const barrierX = sourceRealm.group.position.x + 4; // Position of barrier
                    
                    // Move toward barrier
                    if (particle.position.x < barrierX - 0.5) {
                        particle.position.x += 0.05;
                        
                        // Keep within source realm until ready to tunnel
                        const dx = particle.position.x - sourceRealm.group.position.x;
                        const dy = particle.position.y;
                        const dz = particle.position.z;
                        
                        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                        
                        if (dist > 3) {
                            particle.position.y *= 0.95;
                            particle.position.z *= 0.95;
                        }
                    } else {
                        // Start tunneling
                        particle.userData.inTunnel = true;
                        particle.userData.tunnelProgress = 0;
                        
                        // Make particle more transparent during tunneling
                        particle.material.opacity = 0.5;
                    }
                } else {
                    // Progress through tunnel
                    particle.userData.tunnelProgress += particle.userData.tunnelSpeed * delta;
                    
                    if (particle.userData.tunnelProgress >= 1) {
                        // Tunneling complete - arrive in target realm
                        particle.userData.inTunnel = false;
                        
                        // Restore opacity
                        particle.material.opacity = 0.9;
                        
                        // Move to next realm pair
                        particle.userData.sourceRealm = particle.userData.targetRealm;
                        particle.userData.targetRealm = (particle.userData.targetRealm + 1) % this.realms.length;
                        
                        // Update particle color to match new realm
                        const newColor = this.realms[particle.userData.sourceRealm].color;
                        particle.material.color.set(new THREE.Color(newColor));
                        particle.material.emissive.set(new THREE.Color(newColor));
                        
                        // Position in new realm
                        const targetRealm = this.realms[particle.userData.sourceRealm];
                        
                        const phi = Math.random() * Math.PI * 2;
                        const theta = Math.random() * Math.PI;
                        const radius = 2 * Math.random();
                        
                        particle.position.x = targetRealm.group.position.x - 2; // Start on the opposite side
                        particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
                        particle.position.z = radius * Math.cos(theta);
                        
                        // Check if we've gone full circle
                        if (particle.userData.sourceRealm === 0 && 
                            particle.userData.originalRealm === undefined) {
                            particle.userData.originalRealm = 0;
                        } else if (particle.userData.sourceRealm === 0 && 
                                   particle.userData.originalRealm === 0) {
                            // Mark as complete after one full cycle
                            particle.userData.complete = true;
                        }
                    } else {
                        // Visualize tunneling
                        const sourceRealm = this.realms[particle.userData.sourceRealm];
                        const targetRealm = this.realms[particle.userData.targetRealm];
                        
                        // Interpolate position through barrier
                        particle.position.x = THREE.MathUtils.lerp(
                            sourceRealm.group.position.x + 4, // Barrier position
                            targetRealm.group.position.x - 3, // Entry point to next realm
                            particle.userData.tunnelProgress
                        );
                        
                        // Make particle pulse during tunneling
                        const scale = 1 + 0.5 * Math.sin(this.time * 10);
                        particle.scale.set(scale, scale, scale);
                        
                        // Interpolate color during tunneling
                        const sourceColor = new THREE.Color(sourceRealm.color);
                        const targetColor = new THREE.Color(targetRealm.color);
                        const mixedColor = sourceColor.clone().lerp(targetColor, particle.userData.tunnelProgress);
                        
                        particle.material.color.set(mixedColor);
                        particle.material.emissive.set(mixedColor);
                    }
                }
            } else {
                // Completed full cycle - celebrate with a visual effect
                particle.rotation.x += 0.1;
                particle.rotation.y += 0.1;
                
                const pulseScale = 1 + 0.3 * Math.sin(this.time * 5);
                particle.scale.set(pulseScale, pulseScale, pulseScale);
                
                // Rainbow color effect
                const hue = (this.time * 0.2) % 1;
                const cycleColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
                particle.material.color.set(cycleColor);
                particle.material.emissive.set(cycleColor);
            }
        });
        
        // Animate action label
        if (this.actionLabel) {
            this.actionLabel.rotation.y = this.time * 0.5;
            this.actionLabel.position.y = 5 + Math.sin(this.time) * 0.3;
            
            // Pulse color to indicate irrevocability
            const pulseColor = new THREE.Color().setHSL(0.15, 0.8, 0.5 + 0.2 * Math.sin(this.time * 2));
            this.actionLabel.material.color.set(pulseColor);
        }
        
        // Gentle rotation of entire scene
        if (this.tunnelGroup) {
            this.tunnelGroup.rotation.y = Math.sin(this.time * 0.1) * 0.1;
        }
    }
}

export class QuantumDistinctionAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Group for all elements
        const distinctionGroup = new THREE.Group();
        
        // Create timeline visualization
        const timelineGeometry = new THREE.BoxGeometry(30, 0.5, 0.5);
        const timelineMaterial = new THREE.MeshPhongMaterial({ color: 0x9e9e9e });
        const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
        timeline.position.y = -5;
        distinctionGroup.add(timeline);
        
        // Create action types that remain distinct
        this.actionTypes = [];
        const actionColors = [0x4fc3f7, 0xff8a65, 0x81c784, 0xba68c8, 0xffe082];
        
        for (let i = 0; i < actionColors.length; i++) {
            const actionGroup = new THREE.Group();
            
            // Action core
            const coreGeometry = new THREE.IcosahedronGeometry(1, 1);
            const coreMaterial = this.createGlowMaterial(actionColors[i]);
            const actionCore = new THREE.Mesh(coreGeometry, coreMaterial);
            
            // Action trail visualization
            const maxTrailPoints = 50;
            const trailPoints = [];
            
            // Create initial trail points (will be updated)
            for (let j = 0; j < maxTrailPoints; j++) {
                trailPoints.push(new THREE.Vector3(0, 0, 0));
            }
            
            const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
            const trailMaterial = new THREE.LineBasicMaterial({ 
                color: actionColors[i],
                transparent: true,
                opacity: 0.5
            });
            
            const trail = new THREE.Line(trailGeometry, trailMaterial);
            
            // Create particle cloud for this action
            const actionParticles = this.createParticles(200, 0.05);
            
            // Set particle colors
            const colors = actionParticles.geometry.attributes.color.array;
            const color = new THREE.Color(actionColors[i]);
            for (let j = 0; j < colors.length; j += 3) {
                colors[j] = color.r;
                colors[j+1] = color.g;
                colors[j+2] = color.b;
            }
            actionParticles.geometry.attributes.color.needsUpdate = true;
            
            // Place particles near core
            const positions = actionParticles.geometry.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                const radius = 1 + Math.random();
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI;
                
                positions[j] = radius * Math.sin(theta) * Math.cos(phi);
                positions[j+1] = radius * Math.sin(theta) * Math.sin(phi);
                positions[j+2] = radius * Math.cos(theta);
            }
            actionParticles.geometry.attributes.position.needsUpdate = true;
            
            // Initial position on timeline
            const startPosition = -12 + i * 6;
            actionGroup.position.x = startPosition;
            actionGroup.position.y = 0;
            
            actionGroup.add(actionCore);
            actionGroup.add(trail);
            actionGroup.add(actionParticles);
            
            this.actionTypes.push({
                group: actionGroup,
                core: actionCore,
                trail: trail,
                trailPoints: trailPoints,
                maxTrailPoints: maxTrailPoints,
                particles: actionParticles,
                color: actionColors[i],
                startX: startPosition,
                timeOffset: i * 0.5, // Stagger movements
                ripening: false,
                ripeningProgress: 0
            });
            
            distinctionGroup.add(actionGroup);
        }
        
        // Create ripening zone
        const ripeningZoneGeometry = new THREE.RingGeometry(3, 4, 32);
        const ripeningZoneMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            emissive: 0xffa000,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const ripeningZone = new THREE.Mesh(ripeningZoneGeometry, ripeningZoneMaterial);
        ripeningZone.rotation.x = Math.PI / 2; // Make horizontal
        ripeningZone.position.x = 12;
        distinctionGroup.add(ripeningZone);
        this.ripeningZone = ripeningZone;
        
        // Create "irrevocability" label
        const labelGeometry = new THREE.BoxGeometry(6, 0.8, 0.2);
        const labelMaterial = new THREE.MeshPhongMaterial({ color: 0xf5f5f5 });
        const irrevocabilityLabel = new THREE.Mesh(labelGeometry, labelMaterial);
        irrevocabilityLabel.position.set(0, 6, 0);
        distinctionGroup.add(irrevocabilityLabel);
        this.irrevocabilityLabel = irrevocabilityLabel;
        
        this.scene.add(distinctionGroup);
        this.distinctionGroup = distinctionGroup;
        
        // Position camera
        this.camera.position.set(0, 3, 25);
        this.controls.update();
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate action types
        this.actionTypes.forEach((action, index) => {
            // Move actions along timeline while maintaining distinction
            const timeWithOffset = this.time + action.timeOffset;
            const movementX = action.startX + Math.sin(timeWithOffset * 0.2) * 5;
            
            // Move entire group
            action.group.position.x = movementX;
            action.group.position.y = Math.sin(timeWithOffset * 0.5) * 1;
            
            // Different rotations for each action to show they're distinct
            action.core.rotation.x = timeWithOffset * 0.5 * (index % 2 ? 1 : -1);
            action.core.rotation.y = timeWithOffset * 0.7 * (index % 3 ? 1 : -1);
            
            // Pulse the core
            const pulseScale = 1 + 0.1 * Math.sin(timeWithOffset * 2);
            action.core.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Update trail points (shift and add new point)
            for (let i = 0; i < action.maxTrailPoints - 1; i++) {
                action.trailPoints[i].copy(action.trailPoints[i + 1]);
            }
            
            // Add current position as newest point
            action.trailPoints[action.maxTrailPoints - 1].copy(action.group.position);
            
            // Update trail geometry
            action.trail.geometry.dispose();
            action.trail.geometry = new THREE.BufferGeometry().setFromPoints(action.trailPoints);
            
            // Animate particles
            if (action.particles) {
                const positions = action.particles.geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    // Orbital movement
                    const x = positions[i];
                    const y = positions[i+1];
                    const z = positions[i+2];
                    
                    const dist = Math.sqrt(x*x + y*y + z*z);
                    const phi = Math.atan2(y, x) + 0.02;
                    const theta = Math.acos(z / (dist || 0.001));
                    
                    positions[i] = dist * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = dist * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = dist * Math.cos(theta);
                    
                    // Random fluctuations
                    positions[i] += (Math.random() - 0.5) * 0.05;
                    positions[i+1] += (Math.random() - 0.5) * 0.05;
                    positions[i+2] += (Math.random() - 0.5) * 0.05;
                    
                    // Keep particles in range
                    const newDist = Math.sqrt(
                        positions[i]*positions[i] + 
                        positions[i+1]*positions[i+1] + 
                        positions[i+2]*positions[i+2]
                    );
                    
                    if (newDist > 2) {
                        positions[i] *= 1.5 / newDist;
                        positions[i+1] *= 1.5 / newDist;
                        positions[i+2] *= 1.5 / newDist;
                    }
                }
                
                action.particles.geometry.attributes.position.needsUpdate = true;
            }
            
            // Check if action has entered ripening zone
            const distToRipening = Math.abs(action.group.position.x - this.ripeningZone.position.x);
            
            if (distToRipening < 3 && !action.ripening) {
                action.ripening = true;
                action.ripeningProgress = 0;
            }
            
            // Handle ripening animation
            if (action.ripening) {
                action.ripeningProgress += delta * 0.2;
                
                if (action.ripeningProgress < 1) {
                    // During ripening, change appearance but maintain distinction
                    const ripeningColor = new THREE.Color(action.color);
                    ripeningColor.lerp(new THREE.Color(0xffd700), action.ripeningProgress);
                    
                    action.core.material.color.set(ripeningColor);
                    action.core.material.emissive.set(ripeningColor);
                    
                    // Grow slightly during ripening
                    const growthScale = 1 + action.ripeningProgress * 0.5;
                    action.core.scale.set(growthScale, growthScale, growthScale);
                } else {
                    // Reset ripening when action moves away from zone
                    if (distToRipening > 4) {
                        action.ripening = false;
                        
                        // Reset color
                        action.core.material.color.set(new THREE.Color(action.color));
                        action.core.material.emissive.set(new THREE.Color(action.color));
                    }
                }
            }
        });
        
        // Animate ripening zone
        if (this.ripeningZone) {
            this.ripeningZone.rotation.z = this.time * 0.3;
            
            // Pulse
            const pulseScale = 1 + 0.1 * Math.sin(this.time);
            this.ripeningZone.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Change opacity
            this.ripeningZone.material.opacity = 0.3 + 0.3 * Math.sin(this.time * 0.5);
        }
        
        // Animate irrevocability label
        if (this.irrevocabilityLabel) {
            this.irrevocabilityLabel.rotation.y = this.time * 0.3;
            this.irrevocabilityLabel.position.y = 6 + Math.sin(this.time * 0.7) * 0.3;
        }
        
        // Subtle rotation of whole scene
        if (this.distinctionGroup) {
            this.distinctionGroup.rotation.z = Math.sin(this.time * 0.1) * 0.05;
        }
    }
}

export class QuantumDecayAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Main group
        const decayGroup = new THREE.Group();
        
        // Two paths: transcendence and death
        this.paths = [];
        
        // Create common origin (action fruit)
        const fruitGeometry = new THREE.IcosahedronGeometry(2, 2);
        const fruitMaterial = this.createGlowMaterial(0xffeb3b);
        const actionFruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
        decayGroup.add(actionFruit);
        this.actionFruit = actionFruit;
        
        // Create paths
        const pathPositions = [
            { x: -8, y: 5, z: 0, color: 0x4fc3f7, type: "transcendence" },
            { x: 8, y: -5, z: 0, color: 0xff5252, type: "death" }
        ];
        
        pathPositions.forEach(path => {
            const pathGroup = new THREE.Group();
            
            // Path endpoint indicator
            const endpointGeometry = new THREE.SphereGeometry(1.5, 32, 32);
            const endpointMaterial = new THREE.MeshPhongMaterial({
                color: path.color,
                transparent: true,
                opacity: 0.5
            });
            const endpoint = new THREE.Mesh(endpointGeometry, endpointMaterial);
            
            // Center of endpoint (more solid)
            const centerGeometry = new THREE.IcosahedronGeometry(0.7, 1);
            const centerMaterial = this.createGlowMaterial(path.color);
            const endpointCenter = new THREE.Mesh(centerGeometry, centerMaterial);
            
            // Create path visualization
            const pathCurve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(path.x * 0.3, path.y * 0.3, 5),
                new THREE.Vector3(path.x * 0.7, path.y * 0.7, -5),
                new THREE.Vector3(path.x, path.y, path.z)
            );
            
            const pathPoints = pathCurve.getPoints(50);
            const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
            const pathMaterial = new THREE.LineBasicMaterial({ 
                color: path.color,
                transparent: true,
                opacity: 0.7
            });
            const pathLine = new THREE.Line(pathGeometry, pathMaterial);
            
            // Position endpoint
            pathGroup.position.set(path.x, path.y, path.z);
            
            pathGroup.add(endpoint);
            pathGroup.add(endpointCenter);
            decayGroup.add(pathGroup);
            decayGroup.add(pathLine);
            
            // Create decay particles flowing along the path
            const decayParticles = [];
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const particleMaterial = this.createGlowMaterial(path.color);
                particleMaterial.transparent = true;
                particleMaterial.opacity = 0.8;
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                // Initial position along path
                const pathPos = pathCurve.getPoint(i / particleCount);
                particle.position.copy(pathPos);
                
                particle.userData = {
                    progress: i / particleCount,
                    speed: 0.2 + Math.random() * 0.3,
                    curve: pathCurve
                };
                
                decayParticles.push(particle);
                decayGroup.add(particle);
            }
            
            // Create ethical state labels (with/without corruption)
            const labelGeometry = new THREE.BoxGeometry(4, 0.5, 0.1);
            const labelColor = path.type === "transcendence" ? 0x4caf50 : 0xff5252;
            const labelMaterial = new THREE.MeshPhongMaterial({ color: labelColor });
            const ethicalLabel = new THREE.Mesh(labelGeometry, labelMaterial);
            
            // Position label above endpoint
            ethicalLabel.position.y = 2;
            pathGroup.add(ethicalLabel);
            
            this.paths.push({
                group: pathGroup,
                endpoint: endpoint,
                center: endpointCenter,
                particles: decayParticles,
                curve: pathCurve,
                type: path.type,
                label: ethicalLabel,
                color: path.color
            });
        });
        
        // Create action system
        const actionSystemGeometry = new THREE.TorusGeometry(4, 0.5, 16, 100);
        const actionSystemMaterial = this.createGlowMaterial(0x9c27b0);
        const actionSystem = new THREE.Mesh(actionSystemGeometry, actionSystemMaterial);
        actionSystem.rotation.x = Math.PI / 2;
        decayGroup.add(actionSystem);
        this.actionSystem = actionSystem;
        
        // Create energy field particles
        this.energyParticles = this.createParticles(1000, 0.05);
        decayGroup.add(this.energyParticles);
        
        this.scene.add(decayGroup);
        this.decayGroup = decayGroup;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate action fruit
        if (this.actionFruit) {
            this.actionFruit.rotation.x = this.time * 0.5;
            this.actionFruit.rotation.y = this.time * 0.7;
            
            // Pulse
            const scale = 1 + 0.1 * Math.sin(this.time * 2);
            this.actionFruit.scale.set(scale, scale, scale);
            
            // Gradually decay/diminish over time
            const decayFactor = Math.max(0.2, 1 - (this.time * 0.03) % 1);
            this.actionFruit.material.opacity = decayFactor;
            
            // Shift color as it decays
            const hue = (0.15 + (1 - decayFactor) * 0.05) % 1; // Shift from gold toward red
            const saturation = 0.8 - (1 - decayFactor) * 0.3;
            const lightness = 0.6 - (1 - decayFactor) * 0.2;
            
            const decayColor = new THREE.Color().setHSL(hue, saturation, lightness);
            this.actionFruit.material.color.set(decayColor);
            this.actionFruit.material.emissive.set(decayColor);
        }
        
        // Animate paths and particles
        this.paths.forEach((path, index) => {
            // Path endpoint animations
            path.endpoint.rotation.y = this.time * 0.5 * (index % 2 ? 1 : -1);
            path.endpoint.rotation.x = this.time * 0.3 * (index % 2 ? -1 : 1);
            
            // Pulse endpoint
            const pulseScale = 1 + 0.2 * Math.sin(this.time + index);
            path.center.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Different effects based on path type
            if (path.type === "transcendence") {
                // Transcendence gets brighter and expands
                const transcendScale = 1 + 0.1 * Math.sin(this.time * 0.5) + 
                                      0.2 * (Math.sin(this.time * 0.1) + 1) / 2;
                path.endpoint.scale.set(transcendScale, transcendScale, transcendScale);
                
                // Increase glow for transcendence
                const glowColor = new THREE.Color(path.color).lerp(
                    new THREE.Color(0xffffff), 
                    0.3 + 0.3 * Math.sin(this.time)
                );
                path.center.material.emissive.set(glowColor);
                
                // Label animation
                path.label.rotation.y = this.time * 0.3;
                path.label.position.y = 2 + Math.sin(this.time * 0.5) * 0.5;
            } else {
                // Death path gets darker and more chaotic
                const deathPulse = 1 + 0.3 * Math.sin(this.time * 3);
                path.endpoint.scale.set(deathPulse, deathPulse, deathPulse);
                
                // Add flickering effect
                const flickerIntensity = 0.5 + 0.5 * Math.random();
                const flickerColor = new THREE.Color(path.color).multiplyScalar(flickerIntensity);
                path.center.material.emissive.set(flickerColor);
                
                // More chaotic label animation
                path.label.rotation.y = this.time * 0.5 + Math.sin(this.time * 2) * 0.2;
                path.label.position.y = 2 + Math.sin(this.time * 2) * 0.3;
            }
            
            // Animate particles along path
            path.particles.forEach(particle => {
                // Move particles along path
                particle.userData.progress += particle.userData.speed * delta * 
                                            (path.type === "death" ? 1.5 : 1); // Death path faster
                
                if (particle.userData.progress > 1) {
                    if (path.type === "transcendence") {
                        // Transcendence particles loop back
                        particle.userData.progress = 0;
                    } else {
                        // Death particles stay at end and fade
                        particle.userData.progress = 1;
                        particle.material.opacity *= 0.95;
                        
                        // Reset when completely faded
                        if (particle.material.opacity < 0.1) {
                            particle.userData.progress = 0;
                            particle.material.opacity = 0.8;
                        }
                    }
                }
                
                // Update position
                const position = particle.userData.curve.getPoint(particle.userData.progress);
                particle.position.copy(position);
                
                // Different effects based on path
                if (path.type === "transcendence") {
                    // Transcendence particles get brighter near end
                    const brightenFactor = 0.5 + 0.5 * particle.userData.progress;
                    const particleColor = new THREE.Color(path.color).multiplyScalar(brightenFactor);
                    particle.material.color.set(particleColor);
                    particle.material.emissive.set(particleColor);
                    
                    // Grow slightly
                    const growScale = 1 + particle.userData.progress * 0.5;
                    particle.scale.set(growScale, growScale, growScale);
                } else {
                    // Death particles get redder and fade
                    const darkFactor = 1 - particle.userData.progress * 0.5;
                    const particleColor = new THREE.Color(path.color).multiplyScalar(darkFactor);
                    particle.material.color.set(particleColor);
                    particle.material.emissive.set(particleColor);
                    
                    // Shrink slightly
                    const shrinkScale = 1 - particle.userData.progress * 0.3;
                    particle.scale.set(shrinkScale, shrinkScale, shrinkScale);
                }
            });
        });
        
        // Animate action system
        if (this.actionSystem) {
            this.actionSystem.rotation.z = this.time * 0.3;
            this.actionSystem.rotation.y = Math.sin(this.time * 0.2) * 0.3;
            
            // Pulse
            const systemScale = 1 + 0.1 * Math.sin(this.time);
            this.actionSystem.scale.set(systemScale, systemScale, systemScale);
        }
        
        // Animate energy particles
        if (this.energyParticles) {
            const positions = this.energyParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Dynamic flow pattern
                const x = positions[i];
                const y = positions[i+1];
                const z = positions[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                if (dist > 8) {
                    // Reset particle to center
                    positions[i] = (Math.random() - 0.5) * 2;
                    positions[i+1] = (Math.random() - 0.5) * 2;
                    positions[i+2] = (Math.random() - 0.5) * 2;
                } else {
                    // Flow outward
                    const angle = Math.atan2(y, x);
                    const outwardSpeed = 0.02 + dist * 0.005;
                    
                    positions[i] += Math.cos(angle) * outwardSpeed;
                    positions[i+1] += Math.sin(angle) * outwardSpeed;
                    positions[i+2] += (Math.random() - 0.5) * 0.05;
                    
                    // Add some swirl
                    const swirl = 0.02 * Math.sin(this.time + dist);
                    positions[i] += Math.cos(angle + Math.PI/2) * swirl;
                    positions[i+1] += Math.sin(angle + Math.PI/2) * swirl;
                }
            }
            
            this.energyParticles.geometry.attributes.position.needsUpdate = true;
            
            // Update colors based on distance from center
            const colors = this.energyParticles.geometry.attributes.color.array;
            const positions2 = this.energyParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < colors.length; i += 3) {
                const x = positions2[i];
                const y = positions2[i+1];
                const z = positions2[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                // Color gradient based on distance and angle
                const angle = Math.atan2(y, x) + Math.PI;
                const normalizedAngle = angle / (Math.PI * 2);
                
                const color = new THREE.Color();
                
                // Blend between path colors based on angle
                if (normalizedAngle < 0.5) {
                    // Blend toward transcendence color
                    color.setHSL(0.6, 0.8, 0.5);
                } else {
                    // Blend toward death color
                    color.setHSL(0, 0.8, 0.5);
                }
                
                // Fade based on distance
                const intensity = Math.max(0, 1 - dist/8);
                color.multiplyScalar(intensity);
                
                colors[i] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
            }
            
            this.energyParticles.geometry.attributes.color.needsUpdate = true;
        }
        
        // Gently rotate entire scene
        if (this.decayGroup) {
            this.decayGroup.rotation.z = Math.sin(this.time * 0.1) * 0.05;
        }
    }
}

export class QuantumSuperpositionAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Main group
        const superpositionGroup = new THREE.Group();
        
        // Create central superposition state
        const stateGeometry = new THREE.IcosahedronGeometry(2, 2);
        const stateMaterial = this.createGlowMaterial(0x7e57c2);
        const superpositionState = new THREE.Mesh(stateGeometry, stateMaterial);
        superpositionGroup.add(superpositionState);
        this.superpositionState = superpositionState;
        
        // Create wave function visualization
        const wavePoints = [];
        const waveSegments = 100;
        const waveRadius = 5;
        
        for (let i = 0; i <= waveSegments; i++) {
            const angle = (i / waveSegments) * Math.PI * 2;
            wavePoints.push(
                new THREE.Vector3(
                    Math.cos(angle) * waveRadius,
                    Math.sin(angle) * waveRadius,
                    0
                )
            );
        }
        
        const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
        const waveMaterial = new THREE.LineBasicMaterial({ 
            color: 0x7e57c2,
            transparent: true,
            opacity: 0.7
        });
        
        const waveFunction = new THREE.Line(waveGeometry, waveMaterial);
        superpositionGroup.add(waveFunction);
        this.waveFunction = waveFunction;
        this.wavePoints = wavePoints;
        this.waveRadius = waveRadius;
        
        // Create two extreme states to show avoidance
        const extremePositions = [
            { x: -8, y: 0, z: 0, color: 0xff5252, label: "Annihilation" },
            { x: 8, y: 0, z: 0, color: 0x4caf50, label: "Permanence" }
        ];
        
        this.extremes = [];
        
        extremePositions.forEach(pos => {
            const extremeGroup = new THREE.Group();
            
            // Extreme state visualization
            const extremeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
            const extremeMaterial = new THREE.MeshPhongMaterial({
                color: pos.color,
                transparent: true,
                opacity: 0.5
            });
            const extremeState = new THREE.Mesh(extremeGeometry, extremeMaterial);
            
            // Core of extreme state
            const coreGeometry = new THREE.IcosahedronGeometry(0.7, 1);
            const coreMaterial = this.createGlowMaterial(pos.color);
            const extremeCore = new THREE.Mesh(coreGeometry, coreMaterial);
            
            // Label for the extreme
            const labelGeometry = new THREE.BoxGeometry(4, 0.5, 0.1);
            const labelMaterial = new THREE.MeshPhongMaterial({ color: pos.color });
            const extremeLabel = new THREE.Mesh(labelGeometry, labelMaterial);
            extremeLabel.position.y = -2.5;
            
            extremeGroup.add(extremeState);
            extremeGroup.add(extremeCore);
            extremeGroup.add(extremeLabel);
            
            extremeGroup.position.set(pos.x, pos.y, pos.z);
            
            this.extremes.push({
                group: extremeGroup,
                state: extremeState,
                core: extremeCore,
                label: extremeLabel,
                color: pos.color,
                type: pos.label
            });
            
            superpositionGroup.add(extremeGroup);
        });
        
        // Create connecting beams to show tension
        this.beams = [];
        
        // Beam from superposition to each extreme
        this.extremes.forEach(extreme => {
            const start = new THREE.Vector3(0, 0, 0);
            const end = new THREE.Vector3(extreme.group.position.x, 0, 0);
            
            // Create middle control point for curve
            const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
            mid.y = 3 * (extreme.type === "Annihilation" ? -1 : 1);
            
            const beamCurve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const beamGeometry = new THREE.TubeGeometry(beamCurve, 20, 0.2, 8, false);
            
            const beamMaterial = new THREE.MeshPhongMaterial({
                color: extreme.color,
                transparent: true,
                opacity: 0.4
            });
            
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            
            this.beams.push({
                beam: beam,
                curve: beamCurve,
                start: start,
                mid: mid,
                end: end,
                target: extreme
            });
            
            superpositionGroup.add(beam);
        });
        
        // Create flow particles along beams
        this.flowParticles = [];
        
        this.beams.forEach(beam => {
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const particleMaterial = this.createGlowMaterial(beam.target.color);
                particleMaterial.transparent = true;
                particleMaterial.opacity = 0.8;
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                // Position along beam
                const pathPos = beam.curve.getPoint(i / particleCount);
                particle.position.copy(pathPos);
                
                particle.userData = {
                    progress: i / particleCount,
                    speed: 0.2 + Math.random() * 0.3,
                    forward: true,
                    beam: beam
                };
                
                this.flowParticles.push(particle);
                superpositionGroup.add(particle);
            }
        });
        
        // Create Buddha teaching label
        const teachingGeometry = new THREE.BoxGeometry(8, 0.8, 0.2);
        const teachingMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
        const buddhaDharma = new THREE.Mesh(teachingGeometry, teachingMaterial);
        buddhaDharma.position.set(0, 7, 0);
        superpositionGroup.add(buddhaDharma);
        this.buddhaDharma = buddhaDharma;
        
        // Create action field particles
        this.actionParticles = this.createParticles(2000, 0.05);
        superpositionGroup.add(this.actionParticles);
        
        this.scene.add(superpositionGroup);
        this.superpositionGroup = superpositionGroup;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate central superposition state
        if (this.superpositionState) {
            this.superpositionState.rotation.x = this.time * 0.2;
            this.superpositionState.rotation.y = this.time * 0.3;
            
            // Pulse to show quantum nature
            const pulseScale = 1 + 0.1 * Math.sin(this.time * 1.5);
            this.superpositionState.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Shift color to show balance
            const hue = 0.7 + 0.05 * Math.sin(this.time * 0.3);
            const superpositionColor = new THREE.Color().setHSL(hue, 0.7, 0.5);
            this.superpositionState.material.color.set(superpositionColor);
            this.superpositionState.material.emissive.set(superpositionColor);
        }
        
        // Animate wave function
        if (this.waveFunction && this.wavePoints) {
            for (let i = 0; i <= this.wavePoints.length - 1; i++) {
                const angle = (i / (this.wavePoints.length - 1)) * Math.PI * 2;
                
                // Dynamic wave pattern
                const radiusVar = this.waveRadius + Math.sin(angle * 3 + this.time * 2) * 0.5;
                const heightVar = Math.sin(angle * 5 + this.time * 3) * 0.5;
                
                this.wavePoints[i].x = Math.cos(angle) * radiusVar;
                this.wavePoints[i].y = Math.sin(angle) * radiusVar;
                this.wavePoints[i].z = heightVar;
            }
            
            // Update geometry
            this.waveFunction.geometry.dispose();
            this.waveFunction.geometry = new THREE.BufferGeometry().setFromPoints(this.wavePoints);
            
            // Animate wave opacity
            this.waveFunction.material.opacity = 0.5 + 0.3 * Math.sin(this.time);
        }
        
        // Animate extreme states
        this.extremes.forEach((extreme, index) => {
            // Rotate
            extreme.core.rotation.y = this.time * 0.5 * (index % 2 ? 1 : -1);
            extreme.core.rotation.z = this.time * 0.3 * (index % 2 ? -1 : 1);
            
            // Pulse
            const extremePulse = 1 + 0.15 * Math.sin(this.time * 1.5 + index);
            extreme.core.scale.set(extremePulse, extremePulse, extremePulse);
            
            // State bubble pulsing
            extreme.state.scale.set(extremePulse, extremePulse, extremePulse);
            
            // Label animation
            extreme.label.rotation.y = this.time * 0.3 * (index % 2 ? 1 : -1);
            extreme.label.position.y = -2.5 + 0.2 * Math.sin(this.time + index);
            
            // Repulsion effect - move away from center slightly when center pulses
            const repelFactor = 0.2 * Math.sin(this.time * 1.5);
            extreme.group.position.x = (index === 0 ? -8 : 8) + repelFactor * (index === 0 ? -1 : 1);
        });
        
        // Update connecting beams
        this.beams.forEach((beam, index) => {
            // Update endpoints based on current positions
            beam.start.copy(this.superpositionState.position);
            beam.end.copy(beam.target.group.position);
            
            // Update mid control point
            const midX = (beam.start.x + beam.end.x) / 2;
            const midHeight = 3 * (index === 0 ? -1 : 1) * (1 + 0.3 * Math.sin(this.time));
            beam.mid.set(midX, midHeight, 0);
            
            // Recreate curve with updated points
            beam.curve = new THREE.QuadraticBezierCurve3(beam.start, beam.mid, beam.end);
            
            // Update beam geometry
            beam.beam.geometry.dispose();
            beam.beam.geometry = new THREE.TubeGeometry(beam.curve, 20, 0.2, 8, false);
            
            // Pulse opacity to show tension
            beam.beam.material.opacity = 0.3 + 0.2 * Math.sin(this.time + index);
        });
        
        // Animate flow particles
        this.flowParticles.forEach(particle => {
            // Move particles along beams
            if (particle.userData.forward) {
                particle.userData.progress += particle.userData.speed * delta;
                
                if (particle.userData.progress >= 1) {
                    // Reverse direction at end
                    particle.userData.forward = false;
                }
            } else {
                particle.userData.progress -= particle.userData.speed * delta;
                
                if (particle.userData.progress <= 0) {
                    // Forward direction at start
                    particle.userData.forward = true;
                }
            }
            
            // Update position
            const position = particle.userData.beam.curve.getPoint(particle.userData.progress);
            particle.position.copy(position);
            
            // Pulse size
            const pulseScale = 1 + 0.5 * Math.sin(this.time * 5 + particle.userData.progress * 10);
            particle.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Adjust color based on direction
            if (particle.userData.forward) {
                // Moving away from center - more like extreme color
                particle.material.color.set(particle.userData.beam.target.color);
                particle.material.emissive.set(particle.userData.beam.target.color);
            } else {
                // Moving toward center - blend with center color
                const centerColor = new THREE.Color(0x7e57c2);
                const extremeColor = new THREE.Color(particle.userData.beam.target.color);
                const blendColor = extremeColor.clone().lerp(centerColor, 1 - particle.userData.progress);
                
                particle.material.color.set(blendColor);
                particle.material.emissive.set(blendColor);
            }
        });
        
        // Animate Buddha dharma label
        if (this.buddhaDharma) {
            this.buddhaDharma.rotation.y = this.time * 0.3;
            this.buddhaDharma.position.y = 7 + Math.sin(this.time * 0.7) * 0.3;
            
            // Pulse gold color
            const dharmaColor = new THREE.Color().setHSL(0.14, 0.8, 0.5 + 0.1 * Math.sin(this.time * 2));
            this.buddhaDharma.material.color.set(dharmaColor);
        }
        
        // Animate action field particles
        if (this.actionParticles) {
            const positions = this.actionParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i+1];
                const z = positions[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                if (dist > 12) {
                    // Reset particle to inner area
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    const radius = 3 + Math.random() * 3;
                    
                    positions[i] = radius * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = radius * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = radius * Math.cos(theta);
                } else {
                    // Complex movement
                    const angle = Math.atan2(y, x);
                    const elevation = Math.atan2(z, Math.sqrt(x*x + y*y));
                    
                    // Spiral outward with pulsing
                    const outwardForce = 0.03 + 0.01 * Math.sin(this.time * 2 + dist);
                    const rotationSpeed = 0.01 * (1 - dist/12);
                    
                    // Calculate new position
                    const newRadius = dist + outwardForce;
                    const newAngle = angle + rotationSpeed;
                    
                    // Convert back to cartesian
                    positions[i] = newRadius * Math.cos(elevation) * Math.cos(newAngle);
                    positions[i+1] = newRadius * Math.cos(elevation) * Math.sin(newAngle);
                    positions[i+2] = newRadius * Math.sin(elevation);
                    
                    // Add some random movement
                    positions[i] += (Math.random() - 0.5) * 0.02;
                    positions[i+1] += (Math.random() - 0.5) * 0.02;
                    positions[i+2] += (Math.random() - 0.5) * 0.02;
                }
            }
            
            this.actionParticles.geometry.attributes.position.needsUpdate = true;
            
            // Update colors based on position
            const colors = this.actionParticles.geometry.attributes.color.array;
            const positions2 = this.actionParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < colors.length; i += 3) {
                const x = positions2[i];
                const y = positions2[i+1];
                const z = positions2[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                // Color gradient based on position
                const color = new THREE.Color();
                
                // Angle determines which extreme it's closer to
                const angle = Math.atan2(y, x);
                const normalizedAngle = ((angle + Math.PI) / (Math.PI * 2));
                
                // Blend between center color and extreme colors
                const centerWeight = Math.max(0, 1 - dist/8);
                const centerColor = new THREE.Color(0x7e57c2);
                
                let extremeColor;
                if (x < 0) {
                    // Left side - annihilation (red)
                    extremeColor = new THREE.Color(0xff5252);
                } else {
                    // Right side - permanence (green)
                    extremeColor = new THREE.Color(0x4caf50);
                }
                
                // Blend based on distance
                color.copy(centerColor).lerp(extremeColor, 1 - centerWeight);
                
                colors[i] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
            }
            
            this.actionParticles.geometry.attributes.color.needsUpdate = true;
        }
        
        // Gentle rotation of entire scene
        if (this.superpositionGroup) {
            this.superpositionGroup.rotation.z = Math.sin(this.time * 0.1) * 0.05;
        }
    }
}

export class QuantumIndeterminacyAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Main group
        const indeterminacyGroup = new THREE.Group();
        
        // Create central action-agent system
        const actionAgentGeometry = new THREE.SphereGeometry(2, 32, 32);
        const actionAgentMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a148c,
            transparent: true,
            opacity: 0.6
        });
        const actionAgentSystem = new THREE.Mesh(actionAgentGeometry, actionAgentMaterial);
        indeterminacyGroup.add(actionAgentSystem);
        this.actionAgentSystem = actionAgentSystem;
        
        // Create inner core structure
        const coreGeometry = new THREE.IcosahedronGeometry(1, 2);
        const coreMaterial = this.createGlowMaterial(0xd500f9);
        const systemCore = new THREE.Mesh(coreGeometry, coreMaterial);
        indeterminacyGroup.add(systemCore);
        this.systemCore = systemCore;
        
        // Create floating "action" representation
        const actionGeometry = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 16);
        const actionMaterial = this.createGlowMaterial(0x00b0ff);
        const actionRepresentation = new THREE.Mesh(actionGeometry, actionMaterial);
        indeterminacyGroup.add(actionRepresentation);
        this.actionRepresentation = actionRepresentation;
        
        // Create "agent" representation
        const agentGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const agentMaterial = this.createGlowMaterial(0xff4081);
        const agentRepresentation = new THREE.Mesh(agentGeometry, agentMaterial);
        indeterminacyGroup.add(agentRepresentation);
        this.agentRepresentation = agentRepresentation;
        
        // Create condition system
        this.conditions = [];
        const conditionCount = 6;
        
        for (let i = 0; i < conditionCount; i++) {
            const angle = (i / conditionCount) * Math.PI * 2;
            const radius = 6;
            
            const conditionGeometry = new THREE.BoxGeometry(1, 1, 1);
            const conditionMaterial = this.createGlowMaterial(0x4fc3f7);
            const condition = new THREE.Mesh(conditionGeometry, conditionMaterial);
            
            // Position in a circle
            condition.position.x = Math.cos(angle) * radius;
            condition.position.y = Math.sin(angle) * radius;
            
            // Connection line to center
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(condition.position.x, condition.position.y, 0),
                new THREE.Vector3(0, 0, 0)
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0x4fc3f7,
                transparent: true,
                opacity: 0.3
            });
            const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
            
            indeterminacyGroup.add(condition);
            indeterminacyGroup.add(connectionLine);
            
            this.conditions.push({
                mesh: condition,
                line: connectionLine,
                angle: angle,
                radius: radius,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        // Create non-conditions
        this.nonConditions = [];
        const nonConditionCount = 6;
        
        for (let i = 0; i < nonConditionCount; i++) {
            const angle = ((i / nonConditionCount) * Math.PI * 2) + (Math.PI / conditionCount);
            const radius = 8;
            
            const nonConditionGeometry = new THREE.BoxGeometry(1, 1, 1);
            const nonConditionMaterial = this.createGlowMaterial(0xff5252);
            const nonCondition = new THREE.Mesh(nonConditionGeometry, nonConditionMaterial);
            
            // Position in a circle
            nonCondition.position.x = Math.cos(angle) * radius;
            nonCondition.position.y = Math.sin(angle) * radius;
            
            // Connection line to center (dashed)
            const points = [];
            const segments = 10;
            
            for (let j = 0; j <= segments; j++) {
                if (j % 2 === 0) {
                    const t = j / segments;
                    points.push(
                        new THREE.Vector3(
                            nonCondition.position.x * t,
                            nonCondition.position.y * t,
                            0
                        )
                    );
                } else {
                    // Skip a segment for dashed effect
                    points.push(
                        new THREE.Vector3(
                            nonCondition.position.x * (j / segments),
                            nonCondition.position.y * (j / segments),
                            0
                        )
                    );
                }
            }
            
            const dashedLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const dashedLineMaterial = new THREE.LineBasicMaterial({ 
                color: 0xff5252,
                transparent: true,
                opacity: 0.3
            });
            const dashedConnectionLine = new THREE.Line(dashedLineGeometry, dashedLineMaterial);
            
            indeterminacyGroup.add(nonCondition);
            indeterminacyGroup.add(dashedConnectionLine);
            
            this.nonConditions.push({
                mesh: nonCondition,
                line: dashedConnectionLine,
                angle: angle,
                radius: radius,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        // Create "non-existence" label for agent
        const labelGeometry = new THREE.BoxGeometry(4, 0.5, 0.1);
        const labelMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
        const nonExistenceLabel = new THREE.Mesh(labelGeometry, labelMaterial);
        nonExistenceLabel.position.y = -5;
        indeterminacyGroup.add(nonExistenceLabel);
        this.nonExistenceLabel = nonExistenceLabel;
        
        // Create quantum field particles
        this.fieldParticles = this.createParticles(3000, 0.03);
        indeterminacyGroup.add(this.fieldParticles);
        
        this.scene.add(indeterminacyGroup);
        this.indeterminacyGroup = indeterminacyGroup;
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate action-agent system
        if (this.actionAgentSystem) {
            // Dynamic pulsing
            const systemPulse = 1 + 0.1 * Math.sin(this.time);
            this.actionAgentSystem.scale.set(systemPulse, systemPulse, systemPulse);
            
            // Change opacity to show indeterminacy
            this.actionAgentSystem.material.opacity = 0.4 + 0.3 * Math.sin(this.time * 0.7);
        }
        
        // Animate system core
        if (this.systemCore) {
            this.systemCore.rotation.x = this.time * 0.3;
            this.systemCore.rotation.y = this.time * 0.5;
            
            // Pulse
            const corePulse = 1 + 0.2 * Math.sin(this.time * 1.5);
            this.systemCore.scale.set(corePulse, corePulse, corePulse);
        }
        
        // Animate action representation
        if (this.actionRepresentation) {
            // Orbit around center
            const actionRadius = 3;
            const actionSpeed = 0.5;
            const actionAngle = this.time * actionSpeed;
            
            this.actionRepresentation.position.x = Math.cos(actionAngle) * actionRadius;
            this.actionRepresentation.position.y = Math.sin(actionAngle) * actionRadius;
            
            // Rotate on its own axis
            this.actionRepresentation.rotation.x = this.time * 2;
            this.actionRepresentation.rotation.y = this.time * 1.5;
            
            // Pulse
            const actionPulse = 1 + 0.15 * Math.sin(this.time * 3);
            this.actionRepresentation.scale.set(actionPulse, actionPulse, actionPulse);
        }
        
        // Animate agent representation
        if (this.agentRepresentation) {
            // Orbit opposite of action
            const agentRadius = 3;
            const agentSpeed = 0.5;
            const agentAngle = this.time * agentSpeed + Math.PI; // Opposite side
            
            this.agentRepresentation.position.x = Math.cos(agentAngle) * agentRadius;
            this.agentRepresentation.position.y = Math.sin(agentAngle) * agentRadius;
            
            // Pulse and fluctuate to show non-existence
            const agentPulse = 0.8 + 0.4 * Math.sin(this.time * 2);
            this.agentRepresentation.scale.set(agentPulse, agentPulse, agentPulse);
            
            // Occasionally "flicker" to show indeterminacy
            if (Math.sin(this.time * 10) > 0.9) {
                this.agentRepresentation.material.opacity = 0.3 + Math.random() * 0.7;
            } else {
                this.agentRepresentation.material.opacity = 0.8;
            }
        }
        
        // Animate conditions
        this.conditions.forEach((condition, index) => {
            // Orbital movement
            const adjustedRadius = condition.radius + 0.5 * Math.sin(this.time + condition.pulsePhase);
            const adjustedAngle = condition.angle + Math.sin(this.time * 0.2) * 0.1;
            
            condition.mesh.position.x = Math.cos(adjustedAngle) * adjustedRadius;
            condition.mesh.position.y = Math.sin(adjustedAngle) * adjustedRadius;
            
            // Rotation
            condition.mesh.rotation.x = this.time * 0.5 * (index % 2 ? 1 : -1);
            condition.mesh.rotation.y = this.time * 0.7 * (index % 3 ? 1 : -1);
            
            // Pulse
            const conditionPulse = 1 + 0.2 * Math.sin(this.time * 2 + condition.pulsePhase);
            condition.mesh.scale.set(conditionPulse, conditionPulse, conditionPulse);
            
            // Update connection line
            condition.line.geometry.dispose();
            condition.line.geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(condition.mesh.position.x, condition.mesh.position.y, 0),
                new THREE.Vector3(0, 0, 0)
            ]);
            
            // Change line opacity
            condition.line.material.opacity = 0.2 + 0.3 * Math.sin(this.time + index);
        });
        
        // Animate non-conditions
        this.nonConditions.forEach((nonCondition, index) => {
            // More chaotic orbital movement
            const adjustedRadius = nonCondition.radius + 1 * Math.sin(this.time * 1.5 + nonCondition.pulsePhase);
            const adjustedAngle = nonCondition.angle + Math.sin(this.time * 0.3) * 0.2;
            
            nonCondition.mesh.position.x = Math.cos(adjustedAngle) * adjustedRadius;
            nonCondition.mesh.position.y = Math.sin(adjustedAngle) * adjustedRadius;
            
            // Faster rotation
            nonCondition.mesh.rotation.x = this.time * 0.8 * (index % 2 ? 1 : -1);
            nonCondition.mesh.rotation.y = this.time * 1.0 * (index % 3 ? 1 : -1);
            
            // More erratic pulse
            const nonConditionPulse = 1 + 0.3 * Math.sin(this.time * 3 + nonCondition.pulsePhase);
            nonCondition.mesh.scale.set(nonConditionPulse, nonConditionPulse, nonConditionPulse);
            
            // Flicker opacity
            nonCondition.mesh.material.opacity = 0.6 + 0.4 * Math.sin(this.time * 5 + index);
            
            // Update connection line
            const points = [];
            const segments = 10;
            
            for (let j = 0; j <= segments; j++) {
                if (j % 2 === 0) {
                    const t = j / segments;
                    points.push(
                        new THREE.Vector3(
                            nonCondition.mesh.position.x * t,
                            nonCondition.mesh.position.y * t,
                            0
                        )
                    );
                } else {
                    points.push(
                        new THREE.Vector3(
                            nonCondition.mesh.position.x * (j / segments),
                            nonCondition.mesh.position.y * (j / segments),
                            0
                        )
                    );
                }
            }
            
            nonCondition.line.geometry.dispose();
            nonCondition.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // Fade line in and out
            nonCondition.line.material.opacity = 0.1 + 0.2 * Math.sin(this.time * 2 + index);
        });
        
        // Animate non-existence label
        if (this.nonExistenceLabel) {
            this.nonExistenceLabel.rotation.y = this.time * 0.3;
            this.nonExistenceLabel.position.y = -5 + 0.3 * Math.sin(this.time * 0.7);
            
            // Fade in and out
            this.nonExistenceLabel.material.opacity = 0.7 + 0.3 * Math.sin(this.time);
        }
        
        // Animate field particles
        if (this.fieldParticles) {
            const positions = this.fieldParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i+1];
                const z = positions[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                if (dist > 12) {
                    // Reset particle
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    const radius = 2 + Math.random() * 2;
                    
                    positions[i] = radius * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = radius * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = radius * Math.cos(theta);
                } else {
                    // Quantum field fluctuations
                    const angle = Math.atan2(y, x);
                    const elevation = Math.atan2(z, Math.sqrt(x*x + y*y));
                    
                    // Random fluctuations with some outward drift
                    positions[i] += (Math.random() - 0.5) * 0.1;
                    positions[i+1] += (Math.random() - 0.5) * 0.1;
                    positions[i+2] += (Math.random() - 0.5) * 0.1;
                    
                    // Slight drift outward
                    const outwardForce = 0.01 + 0.01 * Math.sin(this.time + dist);
                    positions[i] += (x / dist) * outwardForce;
                    positions[i+1] += (y / dist) * outwardForce;
                    positions[i+2] += (z / dist) * outwardForce;
                    
                    // Add some swirl
                    const swirl = 0.01 * Math.sin(this.time * 0.5 + dist);
                    positions[i] += Math.cos(angle + Math.PI/2) * Math.cos(elevation) * swirl;
                    positions[i+1] += Math.sin(angle + Math.PI/2) * Math.cos(elevation) * swirl;
                    positions[i+2] += Math.sin(elevation + Math.PI/2) * swirl;
                    
                    // Occasionally create virtual particle-antiparticle pairs
                    if (Math.random() < 0.001) {
                        const pairPhi = Math.random() * Math.PI * 2;
                        const pairTheta = Math.random() * Math.PI;
                        const pairDist = 0.1;
                        
                        positions[i] += pairDist * Math.sin(pairTheta) * Math.cos(pairPhi);
                        positions[i+1] += pairDist * Math.sin(pairTheta) * Math.sin(pairPhi);
                        positions[i+2] += pairDist * Math.cos(pairTheta);
                    }
                }
            }
            
            this.fieldParticles.geometry.attributes.position.needsUpdate = true;
            
            // Update colors for quantum effect
            const colors = this.fieldParticles.geometry.attributes.color.array;
            const positions2 = this.fieldParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < colors.length; i += 3) {
                const x = positions2[i];
                const y = positions2[i+1];
                const z = positions2[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                // Color based on position and fluctuations
                const color = new THREE.Color();
                
                // Create quantum probability field effect
                const probability = Math.max(0, 1 - dist/10);
                
                // Blend between purple (core) and blue (field)
                if (dist < 3) {
                    // Near the core - purple tint
                    color.setHSL(0.75, 0.8, 0.5 * probability);
                } else if (dist < 6) {
                    // Middle region - blue
                    color.setHSL(0.6, 0.8, 0.5 * probability);
                } else {
                    // Outer region - cyan to indigo
                    const hue = 0.5 + 0.1 * Math.sin(dist + this.time);
                    color.setHSL(hue, 0.7, 0.4 * probability);
                }
                
                colors[i] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
            }
            
            this.fieldParticles.geometry.attributes.color.needsUpdate = true;
        }
        
        // Gentle rotation of entire scene
        if (this.indeterminacyGroup) {
            this.indeterminacyGroup.rotation.z = Math.sin(this.time * 0.1) * 0.05;
        }
    }
}

export class QuantumVacuumAnimation extends Animation {
    constructor(container) {
        super(container);
        this.setup();
    }
    
    setup() {
        this.clearScene();
        
        // Main group
        const vacuumGroup = new THREE.Group();
        
        // Create quantum vacuum visualization
        const vacuumGeometry = new THREE.SphereGeometry(8, 32, 32);
        const vacuumMaterial = new THREE.MeshPhongMaterial({
            color: 0x0d47a1,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const quantumVacuum = new THREE.Mesh(vacuumGeometry, vacuumMaterial);
        vacuumGroup.add(quantumVacuum);
        this.quantumVacuum = quantumVacuum;
        
        // Create empty entities
        this.entities = [];
        const entityTypes = [
            { type: "action", color: 0x00b0ff, symbol: "✧", size: 1.0 },
            { type: "agent", color: 0xff4081, symbol: "○", size: 1.2 },
            { type: "fruit", color: 0xffd54f, symbol: "✦", size: 1.1 },
            { type: "consumer", color: 0x4caf50, symbol: "◇", size: 1.3 }
        ];
        
        entityTypes.forEach((entity, index) => {
            const entityGroup = new THREE.Group();
            
            // Entity visualization
            const entityGeometry = new THREE.IcosahedronGeometry(entity.size, 1);
            const entityMaterial = new THREE.MeshPhongMaterial({
                color: entity.color,
                transparent: true,
                opacity: 0.7,
                wireframe: true
            });
            const entityMesh = new THREE.Mesh(entityGeometry, entityMaterial);
            
            // Core of entity (less visible)
            const coreGeometry = new THREE.SphereGeometry(entity.size * 0.3, 16, 16);
            const coreMaterial = this.createGlowMaterial(entity.color);
            coreMaterial.opacity = 0.5;
            const entityCore = new THREE.Mesh(coreGeometry, coreMaterial);
            
            // Create orbit path
            const orbitRadius = 5;
            const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: entity.color,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbitPath = new THREE.Mesh(orbitGeometry, orbitMaterial);
            
            // Adjust orbit orientation
            orbitPath.rotation.x = Math.PI / 2 + index * (Math.PI / entityTypes.length);
            orbitPath.rotation.y = index * (Math.PI / entityTypes.length);
            
            // Position entity on orbit
            const angle = (index / entityTypes.length) * Math.PI * 2;
            entityGroup.position.x = Math.cos(angle) * orbitRadius;
            entityGroup.position.y = Math.sin(angle) * orbitRadius;
            
            entityGroup.add(entityMesh);
            entityGroup.add(entityCore);
            vacuumGroup.add(orbitPath);
            vacuumGroup.add(entityGroup);
            
            this.entities.push({
                group: entityGroup,
                mesh: entityMesh,
                core: entityCore,
                orbit: orbitPath,
                angle: angle,
                radius: orbitRadius,
                rotationOffset: index * (Math.PI / entityTypes.length),
                type: entity.type,
                color: entity.color
            });
        });
        
        // Create emptiness/dependent arising particles
        this.vacuumParticles = this.createParticles(5000, 0.03);
        vacuumGroup.add(this.vacuumParticles);
        
        // Create entity connections to show dependency
        this.connections = [];
        
        for (let i = 0; i < this.entities.length; i++) {
            const nextIndex = (i + 1) % this.entities.length;
            
            const sourceEntity = this.entities[i];
            const targetEntity = this.entities[nextIndex];
            
            // Create curved connection
            const connectionPoints = [];
            const segments = 20;
            
            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                
                // Interpolate between entities with curve toward center
                const sourcePos = sourceEntity.group.position.clone();
                const targetPos = targetEntity.group.position.clone();
                const midPoint = new THREE.Vector3().lerpVectors(sourcePos, targetPos, 0.5);
                
                // Pull midpoint toward center
                midPoint.multiplyScalar(0.5);
                
                // Quadratic bezier curve
                const p0 = sourcePos;
                const p1 = midPoint;
                const p2 = targetPos;
                
                // Quadratic bezier formula
                const point = new THREE.Vector3(
                    (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x,
                    (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y,
                    (1-t)*(1-t)*p0.z + 2*(1-t)*t*p1.z + t*t*p2.z
                );
                
                connectionPoints.push(point);
            }
            
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints(connectionPoints);
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: sourceEntity.color,
                transparent: true,
                opacity: 0.4
            });
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            
            vacuumGroup.add(connection);
            
            this.connections.push({
                line: connection,
                source: sourceEntity,
                target: targetEntity,
                points: connectionPoints
            });
        }
        
        // Create flow particles along connections
        this.flowParticles = [];
        
        this.connections.forEach(connection => {
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const particleMaterial = this.createGlowMaterial(connection.source.color);
                particleMaterial.transparent = true;
                particleMaterial.opacity = 0.8;
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                
                // Initial position along connection
                const position = connection.points[Math.floor(i / particleCount * connection.points.length)];
                particle.position.copy(position);
                
                particle.userData = {
                    progress: i / particleCount,
                    speed: 0.2 + Math.random() * 0.3,
                    connection: connection
                };
                
                this.flowParticles.push(particle);
                vacuumGroup.add(particle);
            }
        });
        
        // Create emptiness label
        const emptinessGeometry = new THREE.BoxGeometry(5, 0.7, 0.1);
        const emptinessMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const emptinessLabel = new THREE.Mesh(emptinessGeometry, emptinessMaterial);
        emptinessLabel.position.y = 7;
        vacuumGroup.add(emptinessLabel);
        this.emptinessLabel = emptinessLabel;
        
        this.scene.add(vacuumGroup);
        this.vacuumGroup = vacuumGroup;
        
        // Position camera for better view
        this.camera.position.set(0, 3, 20);
        this.controls.update();
        
        this.time = 0;
    }
    
    updateAnimation(delta) {
        this.time += delta;
        
        // Animate quantum vacuum
        if (this.quantumVacuum) {
            this.quantumVacuum.rotation.x = this.time * 0.1;
            this.quantumVacuum.rotation.y = this.time * 0.15;
            
            // Subtle pulsing
            const vacuumPulse = 1 + 0.05 * Math.sin(this.time * 0.5);
            this.quantumVacuum.scale.set(vacuumPulse, vacuumPulse, vacuumPulse);
            
            // Change opacity
            this.quantumVacuum.material.opacity = 0.15 + 0.1 * Math.sin(this.time * 0.3);
        }
        
        // Animate entities
        this.entities.forEach((entity, index) => {
            // Orbit movement
            const speed = 0.2 + index * 0.05;
            entity.angle += speed * delta;
            
            // Calculate new position
            const x = Math.cos(entity.angle) * entity.radius;
            const y = Math.sin(entity.angle) * entity.radius;
            
            // Apply rotation offset
            const rotatedX = x * Math.cos(entity.rotationOffset) - y * Math.sin(entity.rotationOffset);
            const rotatedY = x * Math.sin(entity.rotationOffset) + y * Math.cos(entity.rotationOffset);
            
            entity.group.position.x = rotatedX;
            entity.group.position.y = rotatedY;
            
            // Rotate entity
            entity.mesh.rotation.x = this.time * 0.7 * (index % 2 ? 1 : -1);
            entity.mesh.rotation.y = this.time * 0.5 * (index % 3 ? 1 : -1);
            
            // Fluctuating opacity and wireframe effect
            entity.mesh.material.opacity = 0.5 + 0.3 * Math.sin(this.time + index);
            
            // Core pulsing
            const corePulse = 0.8 + 0.5 * Math.sin(this.time * 2 + index);
            entity.core.scale.set(corePulse, corePulse, corePulse);
            
            // Fluctuating core opacity
            entity.core.material.opacity = 0.3 + 0.2 * Math.sin(this.time * 3 + index);
        });
        
        // Update connections
        this.connections.forEach((connection, index) => {
            // Update connection points
            const sourcePos = connection.source.group.position.clone();
            const targetPos = connection.target.group.position.clone();
            const midPoint = new THREE.Vector3().lerpVectors(sourcePos, targetPos, 0.5);
            
            // Pull midpoint toward center with dynamic offset
            const centerPull = 0.5 + 0.2 * Math.sin(this.time + index);
            midPoint.multiplyScalar(centerPull);
            
            const segments = connection.points.length - 1;
            
            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                
                // Quadratic bezier formula
                const p0 = sourcePos;
                const p1 = midPoint;
                const p2 = targetPos;
                
                connection.points[j].set(
                    (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x,
                    (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y,
                    (1-t)*(1-t)*p0.z + 2*(1-t)*t*p1.z + t*t*p2.z
                );
            }
            
            // Update geometry
            connection.line.geometry.dispose();
            connection.line.geometry = new THREE.BufferGeometry().setFromPoints(connection.points);
            
            // Animate line opacity
            connection.line.material.opacity = 0.2 + 0.3 * Math.sin(this.time * 0.5 + index);
        });
        
        // Animate flow particles
        this.flowParticles.forEach(particle => {
            // Move particles along connections
            particle.userData.progress += particle.userData.speed * delta;
            
            if (particle.userData.progress > 1) {
                particle.userData.progress = 0;
            }
            
            // Get position from connection points
            const pointIndex = Math.floor(particle.userData.progress * 
                                      (particle.userData.connection.points.length - 1));
            const position = particle.userData.connection.points[pointIndex];
            particle.position.copy(position);
            
            // Pulse size
            const pulseScale = 1 + 0.5 * Math.sin(this.time * 5 + particle.userData.progress * 10);
            particle.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Shift color towards target as it moves
            const sourceColor = new THREE.Color(particle.userData.connection.source.color);
            const targetColor = new THREE.Color(particle.userData.connection.target.color);
            const blendColor = sourceColor.clone().lerp(targetColor, particle.userData.progress);
            
            particle.material.color.set(blendColor);
            particle.material.emissive.set(blendColor);
        });
        
        // Animate vacuum particles
        if (this.vacuumParticles) {
            const positions = this.vacuumParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i+1];
                const z = positions[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                if (dist > 12) {
                    // Reset particle
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    const radius = 2 + Math.random() * 2;
                    
                    positions[i] = radius * Math.sin(theta) * Math.cos(phi);
                    positions[i+1] = radius * Math.sin(theta) * Math.sin(phi);
                    positions[i+2] = radius * Math.cos(theta);
                } else {
                    // Quantum vacuum fluctuations
                    const angle = Math.atan2(y, x);
                    const elevation = Math.atan2(z, Math.sqrt(x*x + y*y));
                    
                    // Random fluctuations
                    positions[i] += (Math.random() - 0.5) * 0.05;
                    positions[i+1] += (Math.random() - 0.5) * 0.05;
                    positions[i+2] += (Math.random() - 0.5) * 0.05;
                    
                    // Gentle outward drift
                    const outwardForce = 0.01;
                    positions[i] += (x / (dist || 0.1)) * outwardForce;
                    positions[i+1] += (y / (dist || 0.1)) * outwardForce;
                    positions[i+2] += (z / (dist || 0.1)) * outwardForce;
                    
                    // Add some swirl
                    const swirl = 0.01 * Math.sin(this.time + dist);
                    positions[i] += Math.cos(angle + Math.PI/2) * Math.cos(elevation) * swirl;
                    positions[i+1] += Math.sin(angle + Math.PI/2) * Math.cos(elevation) * swirl;
                    positions[i+2] += Math.sin(elevation + Math.PI/2) * swirl;
                    
                    // Occasionally create virtual particle-antiparticle pairs
                    if (Math.random() < 0.001) {
                        const pairPhi = Math.random() * Math.PI * 2;
                        const pairTheta = Math.random() * Math.PI;
                        const pairDist = 0.1;
                        
                        positions[i] += pairDist * Math.sin(pairTheta) * Math.cos(pairPhi);
                        positions[i+1] += pairDist * Math.sin(pairTheta) * Math.sin(pairPhi);
                        positions[i+2] += pairDist * Math.cos(pairTheta);
                    }
                }
            }
            
            this.vacuumParticles.geometry.attributes.position.needsUpdate = true;
            
            // Update colors for quantum vacuum effect
            const colors = this.vacuumParticles.geometry.attributes.color.array;
            const positions2 = this.vacuumParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < colors.length; i += 3) {
                const x = positions2[i];
                const y = positions2[i+1];
                const z = positions2[i+2];
                
                const dist = Math.sqrt(x*x + y*y + z*z);
                
                // Color based on position and fluctuations
                const color = new THREE.Color();
                
                // Create quantum vacuum effect
                const vacuumIntensity = Math.max(0, 1 - dist/10);
                
                // Base color with fluctuations
                const hue = 0.6 + 0.1 * Math.sin(dist + this.time) + Math.random() * 0.05;
                const saturation = 0.7 + Math.random() * 0.3;
                const lightness = 0.5 * vacuumIntensity * (0.8 + Math.random() * 0.2);
                
                color.setHSL(hue, saturation, lightness);
                
                colors[i] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
            }
            
            this.vacuumParticles.geometry.attributes.color.needsUpdate = true;
        }
        
        // Animate emptiness label
        if (this.emptinessLabel) {
            this.emptinessLabel.rotation.y = this.time * 0.3;
            this.emptinessLabel.position.y = 7 + 0.3 * Math.sin(this.time * 0.7);
            
            // Pulse color to emphasize emptiness
            const labelColor = new THREE.Color().setHSL(0, 0, 0.7 + 0.3 * Math.sin(this.time));
            this.emptinessLabel.material.color.set(labelColor);
        }
        
        // Gentle rotation of entire scene
        if (this.vacuumGroup) {
            this.vacuumGroup.rotation.z = Math.sin(this.time * 0.1) * 0.05;
        }
    }
}

// Map animation types to their constructor classes
export const animationTypes = {
    quantumMeasurement: QuantumMeasurementAnimation,
    quantumStatePreparation: QuantumStatePreparationAnimation,
    quantumIrreversibility: QuantumIrreversibilityAnimation,
    quantumCultivation: QuantumCultivationAnimation,
    quantumPreservation: QuantumPreservationAnimation,
    quantumTunneling: QuantumTunneling,
    quantumDistinction: QuantumDistinctionAnimation,
    quantumDecay: QuantumDecayAnimation,
    quantumSuperposition: QuantumSuperpositionAnimation,
    quantumIndeterminacy: QuantumIndeterminacyAnimation,
    quantumVacuum: QuantumVacuumAnimation
};