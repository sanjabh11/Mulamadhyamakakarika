import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { animationConfig } from './config.js';
import { gsap } from 'gsap';
import * as d3 from 'd3';

export class BaseAnimation {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        
        // Add fog for depth
        this.scene.fog = new THREE.FogExp2(0x000000, 0.025);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = animationConfig.cameraDistance;
        
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);
        
        // Post-processing for enhanced visual effects
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Outline pass for highlighting interactive objects
        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );
        this.outlinePass.edgeStrength = 3;
        this.outlinePass.edgeGlow = 1;
        this.outlinePass.edgeThickness = 1;
        this.outlinePass.pulsePeriod = 2;
        this.outlinePass.visibleEdgeColor.set(animationConfig.colors.highlight);
        this.outlinePass.hiddenEdgeColor.set(0x190a05);
        this.composer.addPass(this.outlinePass);
        
        // Bloom pass for glow effects
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.2, 0.5, 0.8
        );
        this.composer.addPass(bloomPass);
        
        // FXAA pass for antialiasing
        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.material.uniforms['resolution'].value.set(
            1 / (window.innerWidth * this.renderer.getPixelRatio()),
            1 / (window.innerHeight * this.renderer.getPixelRatio())
        );
        this.composer.addPass(fxaaPass);
        
        // Controls for user interaction
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 20;
        this.controls.minDistance = 2;
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light with shadows
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
        this.scene.add(directionalLight);
        
        // Point lights for dramatic effect
        const pointLight1 = new THREE.PointLight(
            animationConfig.colors.primary, 2, 10, 2
        );
        pointLight1.position.set(-5, 3, 5);
        pointLight1.castShadow = true;
        
        const pointLight2 = new THREE.PointLight(
            animationConfig.colors.secondary, 2, 10, 2
        );
        pointLight2.position.set(5, -3, 5);
        pointLight2.castShadow = true;
        
        this.scene.add(pointLight1, pointLight2);
        
        // Add starfield background
        this.addStarfield();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Animation loop
        this.animate = this.animate.bind(this);
        this.isActive = true;
        
        // Mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactiveObjects = [];
        
        this.container.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });
        
        this.container.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });
        
        // Start with a camera intro animation
        this.cameraIntro();
    }
    
    addStarfield() {
        // Create a starfield background
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const starPositions = [];
        const starCount = 3000;
        const starRadius = 50;
        
        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            const x = starRadius * Math.sin(phi) * Math.cos(theta);
            const y = starRadius * Math.sin(phi) * Math.sin(theta);
            const z = starRadius * Math.cos(phi);
            
            starPositions.push(x, y, z);
        }
        
        starGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starPositions, 3)
        );
        
        this.starfield = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starfield);
    }
    
    cameraIntro() {
        // Starting position further away
        this.camera.position.set(0, 0, animationConfig.cameraDistance * 2.5);
        
        // Animate to normal position
        gsap.to(this.camera.position, {
            z: animationConfig.cameraDistance,
            duration: 2,
            ease: "power2.out"
        });
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
        
        // Check for intersections with interactive objects
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            this.container.style.cursor = 'pointer';
            
            // Update outline pass with hovered object
            this.outlinePass.selectedObjects = [intersects[0].object];
        } else {
            this.container.style.cursor = 'default';
            this.outlinePass.selectedObjects = [];
        }
    }
    
    onMouseClick(event) {
        // Check for intersections with interactive objects
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            // Call click handler if it exists on the object
            if (intersects[0].object.userData.onClick) {
                intersects[0].object.userData.onClick();
            }
        }
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
        
        // Update FXAA shader uniforms
        const fxaaPass = this.composer.passes.find(pass => pass.material && pass.material.uniforms.resolution);
        if (fxaaPass) {
            fxaaPass.material.uniforms.resolution.value.set(
                1 / (width * this.renderer.getPixelRatio()),
                1 / (height * this.renderer.getPixelRatio())
            );
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        requestAnimationFrame(this.animate);
        
        this.update();
        
        // Rotate starfield slowly
        if (this.starfield) {
            this.starfield.rotation.y += 0.0001;
            this.starfield.rotation.x += 0.00005;
        }
        
        this.controls.update();
        this.composer.render();
    }
    
    createLabel(text, position, scale = 1) {
        const canvas = document.createElement('canvas');
        const size = 256 * scale;
        canvas.width = size;
        canvas.height = size / 4;
        
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = `bold ${Math.floor(24 * scale)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Create gradient
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#f72585');
        gradient.addColorStop(0.5, '#4cc9f0');
        gradient.addColorStop(1, '#3a0ca3');
        
        context.fillStyle = gradient;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 0.9
        });
        
        const geometry = new THREE.PlaneGeometry(1 * scale, 0.25 * scale);
        const label = new THREE.Mesh(geometry, material);
        label.position.copy(position);
        
        return label;
    }
    
    createParticleSystem(count, size, color, spread = 1) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * spread;
            positions[i3 + 1] = (Math.random() - 0.5) * spread;
            positions[i3 + 2] = (Math.random() - 0.5) * spread;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Load particle texture for better visual
        const particleTexture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5AoVBgsrsh5vcQAACFBJREFUWMOtl3lwVdUdxz/nnHvfe/e9l/eSF5JAEpJAEggEUJRYUEBwqdal2nGsWmc6WKcjLq1O/6ijdlqndhxap2OtoyKKohRc2GQTBFmCIJCQQBLyXrLd5O59yX13u6d/BFGSgFbn/HXP+f1+n/P9/c75/n5HEEJw43wtwC+B+UDmYDimJyJkZ+eQSSdJJhKkVA2X00kqlULTNfx+P4qi4Ha70XUdh8NBOBwml8sxWFaHw4HFYvn7MgRwO/DRYPDn1z/Pa6veYe+ePRQXF+NwOMhkMqiqisfjoaqqirKyMiZMmEAwGKS+vp5MJsP27dsRBIGCggIqKir46KOPCAQCNxqQNwVWVffqkvtXPiwef+IJ0dLSImKxmEilUiKTyYhMJiOSyaRIJBJi586d4vbbbxfz5s0TL774otizZ49oaWkRp0+fFmfOnBE7d+4Ux44dE1VVVdf3eVMCN80t++x4e/TOu1aKcDgsYrGYyGazQtd10djYKJ577jlRW1srVq9eLRoaGkQymbyh4nQ6LTZs2CBWrFghNC0nbnkrlHf+/tawVWteO5fNyS63G4vVelFLYGJCNlvJZDMIgoCiKAghEASBbDZ7Rdf8iYK2bNnGmJJiu8PtlV9+9VWfRcoXJEnG5XYjCKAoChbL1WQoigKAJEmoqoosy4iiiK7rCBdVCcAlYyRJwmw2X76Hx+PB5/f8NhKJUBbMJ5NOsX7d2j8KzlTvN6ZUTcXlduNyu7FarQiCcE19kiQhimK+BKsVm82G1WpFkqTLvU6nE7fbc/HF4XCkG+3z74QQGAyI/Ol/p/2iQUcQBARR5JZfYLiB+MtWjIADCEHlHoEzDpnuPIHNl0wQ6B4I0tOcwzH1OizZCGgTuIJEwK1eEYHLwFzNUKlUikg0cmUVCEKPESL9YF9GJZS0Y4ldVMKBCKFTJsSOj3GknchHQ+l47jZMg/YjKF3YJB0EAavViiRJGAwGNE0nlUqhaRdlCFSbMl1D2t0U9SvkNCOCLoCoc7bFQvKzDeSceagH3seRCFPe9zRZ+3CM4TMIhULEYjEikSiCKCKbTCQSCRRFxmA04HLaiUajOJ1OhFxOHOlXjLUJdMRp3edCCDajZ0V6To2m5N6nsXR9QRBD0HSdwphGDi/O9J9Ru06hGCWkwIzLXvN4PJSXl7Fly2ZkWUbLaWzcuInNm7dQX1+P0+Vkx/btOJ0uUDWL0CLbsKYyCLoB99y5DHvgeZzHPkbT09jjB5g4aRKhUID6o0epqKgY5EAup9PX14cgwKRJE8nlNCymCIOCRdTV1REKDWHq1Cns37+fvr4+gsEgiqJgkoSrtCFdGlIzMtmcTnFxMbIss3z5P1BVlYceepDq6mrsdvtVGgBdh1wOoeuoquHiyng8zrZtW5FlmXg8jsPhoLm5mcbGRoYOHYooini9XgoLC8nlcjc5igW0S/8qiorNZmPWrFnkchr19ceQJIm1a99j9+7dJJNJysrKEEUDXV1dzJ8/n0WLbsXlcpHLaZfBrxgIrg8NESFnwGFzUl5eTnt7OxMmTODuu+9i3boPqaio4MSJBkZVjiYUKkKSpEvWqBgM4pVnG0GkT5KJiJKMqqoYjSZuvXUJiqKyYcPnTJ48mcrRo2htbaWoKERnZycPP/wwO3fuwmazoapq/tBSVXLa18z9WOcZNqXTScaMGcPRo0eZM2c2U6ZM5rvf/Q7d3d14vV5aWlqorKwkEAgQDAapqamhsbER2WQik9EQRZHNmzYhigbuuONO1qx5F7fbTXd39+V9UqlkT2dn97OdHR0Ig8FwzRkgCAKKotDT00MgEKC1tQ1FURk7dgz79u3H7/dTWlqK3+/H6/VSXFxMOBzG4/FgNpvR83Y+d+4cnZ0h7r//Purq6vD5fGzatBmA9vZ2JkyYQGdnR0QEfovAM/F4nIyqXuoJ9FQqRTweA8DlcnPgwAE++eRTCgsLKS0tpbS0lDFjxjBy5EhMJhOhUIjOzg4aGxs5fvw4sixzxx13MHr0KMaOreL48ePIsszKlX9lxowZtLS0EA6HiUQiP7Yno+j6vHyPJ4okUymmp6JkNQWXN8DUuQs4eOgQfr+fVCrF3LlzCYfD9PdHUFWNtWvXcuedd7J06VL27NnDxImTWLBgAQUFBVgsFrZu3UZNTQ1PP/1rIpEIDQ0nOXjwEM899zwul+tDF0CLrpdFY30UFhZxZvs60p2t5JKJ/F4iUVU1nPLycgoKCoiEw7S1tbFu3TqWLVuGLMucPHmSY8eO0dvbS0FBgLlz51JRMZKjR+spKipi+vTpaJpOR0cHBkFk1qxZ5HI6Npstb/JlgG+fPbtJN2BtbmrE6nRdvobn5yGEw2HsdjsVFRWMGzeOeDyOJEn4fD4kSaS8vAJRFJkwYQI9PT10d3djt9upqqqiP9LPoUOHMJlMRKNR2tvbmTZtGm63G4/HkwMwX7ooaKlkEsMgZ0wXnXE6nciyjM1mQ5ZlJEmiurqa4uJiNE0jHo/T29uLpmlYLBZCoRCzZ89G0zT27t1LX18fiqJw6tRpVFXFYDDg9/uTQFFeoC9XWV1NwqiqalRl5agbgkqShNFoxGw2YzAYcDgcOJ1OJEkiGAwyb948fD4fdrsdn8+H1WrFaDTicDiYOnUqw4cPp76+nlgsRldXF5s3b+bMmTMMGzYsAnxxGaC3t9euaXqr3W5j7NiqwX79pifWwXJQG4IgMGzYMCorR/PHP/6JUCiEwWBk3boPWbFiBYl43A3MA44PCrD9gw9+IGDcEolGvrKAJEsMHz6c6dOn0dfXT3d3Nz09Pbz++uvMmDmD1paW63rXAA5VVX8dj8eZOHES0Wj0K28KIJvNOJ1OGhpO4vV48Hp9JBIJAsEgzU1NN/T8X3WLHBZfhO4EAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEwLTIxVDA2OjExOjQzKzAwOjAwDPn9RAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMC0yMVQwNjoxMTo0MyswMDowMH2kRfgAAAAASUVORK5CYII=');
        
        const material = new THREE.PointsMaterial({
            size: size,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: color
        });
        
        const particles = new THREE.Points(geometry, material);
        return {
            mesh: particles,
            geometry: geometry,
            material: material,
            positions: positions
        };
    }
    
    update() {
        // Override in subclasses
    }
    
    start() {
        this.isActive = true;
        this.animate();
    }
    
    stop() {
        this.isActive = false;
    }
    
    registerInteractiveObject(object, onClick) {
        object.userData.onClick = onClick;
        this.interactiveObjects.push(object);
    }
    
    setupInteractionControls(controlsContainer) {
        // Override in subclasses
        controlsContainer.innerHTML = '';
    }
    
    cleanup() {
        // Remove event listeners, dispose geometries, etc.
        this.stop();
        
        // Clear interactive objects array
        this.interactiveObjects = [];
        
        // Remove event listeners
        this.container.removeEventListener('mousemove', this.onMouseMove);
        this.container.removeEventListener('click', this.onMouseClick);
        
        // Dispose of all geometries and materials
        while(this.scene.children.length > 0){ 
            const object = this.scene.children[0];
            if(object.geometry) object.geometry.dispose();
            if(object.material) {
                if(Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object); 
        }
        
        // Remove renderer from DOM
        if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Verse 1: Measurement Problem Animation
export class MeasurementProblemAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        // Setup particle system for quantum state
        this.particleCount = 1000;
        this.particlesGeometry = new THREE.BufferGeometry();
        
        // Create particles in a spherical cloud (wavefunction)
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Create a sphere of particles
            const phi = Math.acos(-1 + (2 * i) / this.particleCount);
            const theta = Math.sqrt(this.particleCount * Math.PI) * phi;
            
            // Position in sphere
            positions[i * 3] = 2 * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = 2 * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = 2 * Math.cos(phi);
            
            // Color gradient from primary to secondary
            const t = i / this.particleCount;
            colors[i * 3] = (1 - t) * ((animationConfig.colors.primary >> 16) & 0xff) / 255 + 
                           t * ((animationConfig.colors.secondary >> 16) & 0xff) / 255;
            colors[i * 3 + 1] = (1 - t) * ((animationConfig.colors.primary >> 8) & 0xff) / 255 + 
                               t * ((animationConfig.colors.secondary >> 8) & 0xff) / 255;
            colors[i * 3 + 2] = (1 - t) * (animationConfig.colors.primary & 0xff) / 255 + 
                               t * (animationConfig.colors.secondary & 0xff) / 255;
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });
        
        this.particles = new THREE.Points(this.particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
        
        // Three objects for seen, seeing, seer
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        
        this.observer = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: animationConfig.colors.primary, emissive: animationConfig.colors.primary, emissiveIntensity: 0.5 })
        );
        this.observer.position.set(-2, 1.5, 0);
        
        this.observed = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: animationConfig.colors.secondary, emissive: animationConfig.colors.secondary, emissiveIntensity: 0.5 })
        );
        this.observed.position.set(2, -1.5, 0);
        
        this.observingBeam = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 4, 16),
            new THREE.MeshStandardMaterial({ 
                color: animationConfig.colors.highlight,
                emissive: animationConfig.colors.highlight,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0
            })
        );
        this.observingBeam.rotation.z = Math.PI / 4;
        
        this.scene.add(this.observer, this.observed, this.observingBeam);
        
        this.isMeasured = false;
        this.originalPositions = positions.slice();
        this.animateParticles = true;
        
        // Start animation loop
        this.animate();
    }
    
    update() {
        if (this.animateParticles) {
            const positions = this.particlesGeometry.attributes.position.array;
            
            for (let i = 0; i < this.particleCount; i++) {
                const ix = i * 3;
                const iy = ix + 1;
                const iz = ix + 2;
                
                // If not measured, particles move in a wave-like pattern
                if (!this.isMeasured) {
                    positions[ix] = this.originalPositions[ix] + 
                        Math.sin(Date.now() * 0.001 + i * 0.1) * 0.1;
                    positions[iy] = this.originalPositions[iy] + 
                        Math.cos(Date.now() * 0.001 + i * 0.05) * 0.1;
                    positions[iz] = this.originalPositions[iz] + 
                        Math.sin(Date.now() * 0.0005 + i * 0.02) * 0.1;
                }
            }
            
            this.particlesGeometry.attributes.position.needsUpdate = true;
        }
        
        this.particles.rotation.y += 0.001;
        this.observer.rotation.y += 0.01;
        this.observed.rotation.y += 0.01;
    }
    
    measure() {
        if (this.isMeasured) return;
        
        this.isMeasured = true;
        
        // Animate measurement beam
        gsap.to(this.observingBeam.material, {
            opacity: 0.8,
            duration: 1,
            ease: "power2.out"
        });
        
        // Collapse the wavefunction - particles move to discrete positions
        const positions = this.particlesGeometry.attributes.position.array;
        
        // Choose one of three positions for particles to collapse to (representing discrete states)
        const targetPositions = [
            new THREE.Vector3(0, 0, 2),
            new THREE.Vector3(-1.5, -1.5, 0),
            new THREE.Vector3(1.5, 1.5, 0)
        ];
        
        for (let i = 0; i < this.particleCount; i++) {
            const ix = i * 3;
            const targetIndex = Math.floor(Math.random() * 3);
            const target = targetPositions[targetIndex];
            
            // Animate each particle to target position with slight variation
            gsap.to(positions, {
                [ix]: target.x + (Math.random() - 0.5) * 0.4,
                [ix+1]: target.y + (Math.random() - 0.5) * 0.4,
                [ix+2]: target.z + (Math.random() - 0.5) * 0.4,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: () => {
                    this.particlesGeometry.attributes.position.needsUpdate = true;
                }
            });
        }
    }
    
    reset() {
        this.isMeasured = false;
        
        // Fade out measurement beam
        gsap.to(this.observingBeam.material, {
            opacity: 0,
            duration: 0.5
        });
        
        // Reset particles to original wave function
        const positions = this.particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const ix = i * 3;
            
            gsap.to(positions, {
                [ix]: this.originalPositions[ix],
                [ix+1]: this.originalPositions[ix+1],
                [ix+2]: this.originalPositions[ix+2],
                duration: 1.5,
                ease: "power3.out",
                onUpdate: () => {
                    this.particlesGeometry.attributes.position.needsUpdate = true;
                }
            });
        }
    }
    
    setupInteractionControls(controlsContainer) {
        controlsContainer.innerHTML = `
            <button id="measure-btn" class="control-btn">Measure Particle</button>
            <button id="reset-btn" class="control-btn">Reset System</button>
        `;
        
        document.getElementById('measure-btn').addEventListener('click', () => this.measure());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
    }
}

// Verse 2: Quantum Entanglement Animation
export class EntanglementAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        // Create two entangled particles
        const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        
        // First particle
        this.particle1 = new THREE.Mesh(
            particleGeometry,
            new THREE.MeshStandardMaterial({ 
                color: animationConfig.colors.primary,
                emissive: animationConfig.colors.primary,
                emissiveIntensity: 0.5
            })
        );
        this.particle1.position.set(-2, 0, 0);
        
        // Second particle
        this.particle2 = new THREE.Mesh(
            particleGeometry,
            new THREE.MeshStandardMaterial({ 
                color: animationConfig.colors.secondary,
                emissive: animationConfig.colors.secondary,
                emissiveIntensity: 0.5
            })
        );
        this.particle2.position.set(2, 0, 0);
        
        this.scene.add(this.particle1, this.particle2);
        
        // Entanglement connection
        const points = [];
        points.push(this.particle1.position, this.particle2.position);
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: animationConfig.colors.highlight,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });
        
        this.connectionLine = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.connectionLine);
        
        // Particle state visualization
        const stateGeometry = new THREE.TorusGeometry(0.7, 0.05, 16, 100);
        
        this.state1 = new THREE.Mesh(
            stateGeometry,
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            })
        );
        this.state1.position.copy(this.particle1.position);
        this.state1.rotation.x = Math.PI / 2;
        
        this.state2 = new THREE.Mesh(
            stateGeometry.clone(),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            })
        );
        this.state2.position.copy(this.particle2.position);
        this.state2.rotation.x = Math.PI / 2;
        
        this.scene.add(this.state1, this.state2);
        
        // Spinning particles effect
        this.particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const particlePositions = new Float32Array(particlesCount * 3);
        const particleColors = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 3;
            
            particlePositions[i * 3] = Math.cos(angle) * radius;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
            particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
            
            // Interpolate between primary and secondary colors
            const t = Math.random();
            particleColors[i * 3] = (1 - t) * ((animationConfig.colors.primary >> 16) & 0xff) / 255 + 
                                 t * ((animationConfig.colors.secondary >> 16) & 0xff) / 255;
            particleColors[i * 3 + 1] = (1 - t) * ((animationConfig.colors.primary >> 8) & 0xff) / 255 + 
                                     t * ((animationConfig.colors.secondary >> 8) & 0xff) / 255;
            particleColors[i * 3 + 2] = (1 - t) * (animationConfig.colors.primary & 0xff) / 255 + 
                                     t * (animationConfig.colors.secondary & 0xff) / 255;
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.5
        });
        
        this.particles = new THREE.Points(this.particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
        
        this.currentState = 'up'; // Initial state
        
        // Start animation loop
        this.animate();
    }
    
    update() {
        // Rotate particles
        this.particle1.rotation.y += 0.01;
        this.particle2.rotation.y += 0.01;
        
        // Rotate state rings
        this.state1.rotation.z += 0.01;
        this.state2.rotation.z += 0.01;
        
        // Update connection line
        const points = [];
        points.push(this.particle1.position, this.particle2.position);
        this.connectionLine.geometry.setFromPoints(points);
        
        // Animate background particles
        this.particles.rotation.y += 0.001;
    }
    
    flipState() {
        // When one particle's state is changed, the other instantly changes
        if (this.currentState === 'up') {
            this.currentState = 'down';
            
            // Change particle 1 appearance
            gsap.to(this.particle1.material, {
                color: new THREE.Color(animationConfig.colors.highlight),
                emissive: new THREE.Color(animationConfig.colors.highlight),
                duration: 1
            });
            
            gsap.to(this.state1.rotation, {
                x: 0,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            });
            
            // After a slight delay, change particle 2 (entanglement effect)
            setTimeout(() => {
                gsap.to(this.particle2.material, {
                    color: new THREE.Color(animationConfig.colors.highlight),
                    emissive: new THREE.Color(animationConfig.colors.highlight),
                    duration: 1
                });
                
                gsap.to(this.state2.rotation, {
                    x: 0,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)"
                });
                
                // Pulse connection line to show entanglement
                gsap.to(this.connectionLine.material, {
                    opacity: 1,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 3
                });
            }, 300);
            
        } else {
            this.currentState = 'up';
            
            // Reset to original state
            gsap.to(this.particle1.material, {
                color: new THREE.Color(animationConfig.colors.primary),
                emissive: new THREE.Color(animationConfig.colors.primary),
                duration: 1
            });
            
            gsap.to(this.state1.rotation, {
                x: Math.PI / 2,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            });
            
            setTimeout(() => {
                gsap.to(this.particle2.material, {
                    color: new THREE.Color(animationConfig.colors.secondary),
                    emissive: new THREE.Color(animationConfig.colors.secondary),
                    duration: 1
                });
                
                gsap.to(this.state2.rotation, {
                    x: Math.PI / 2,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)"
                });
                
                gsap.to(this.connectionLine.material, {
                    opacity: 1,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 3
                });
            }, 300);
        }
    }
    
    setupInteractionControls(controlsContainer) {
        controlsContainer.innerHTML = `
            <button id="flip-state-btn" class="control-btn">Flip Particle State</button>
            <div class="state-indicator">Current State: <span id="state-label">Up</span></div>
        `;
        
        document.getElementById('flip-state-btn').addEventListener('click', () => {
            this.flipState();
            document.getElementById('state-label').textContent = this.currentState === 'up' ? 'Up' : 'Down';
        });
    }
}

// Factory function to create the appropriate animation
export function createAnimation(verseId, container) {
    switch(verseId) {
        case 1:
            return new MeasurementProblemAnimation(container);
        case 2:
            return new EntanglementAnimation(container);
        case 3:
            return new EntanglementAnimation(container); // Reuse but will be extended
        case 4:
            return new QuantumSuperpositionAnimation(container);
        case 5:
            return new WaveParticleDualityAnimation(container);
        case 6:
            return new QuantumContextualityAnimation(container);
        case 7:
            return new UncertaintyPrincipleAnimation(container);
        case 8:
            return new EntanglementSwappingAnimation(container);
        default:
            return new BaseAnimation(container);
    }
}

// Additional classes for verses 4-8
class QuantumSuperpositionAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        // Create a cat model (simplified as a sphere with cat-like features)
        this.catGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.catMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            emissive: 0x222222,
            emissiveIntensity: 0.2
        });
        
        this.cat = new THREE.Mesh(this.catGeometry, this.catMaterial);
        this.scene.add(this.cat);
        
        // Cat features (ears, face)
        const earGeometry = new THREE.ConeGeometry(0.2, 0.4, 32);
        this.leftEar = new THREE.Mesh(earGeometry, this.catMaterial);
        this.leftEar.position.set(-0.5, 0.8, 0);
        this.leftEar.rotation.z = -Math.PI/4;
        
        this.rightEar = new THREE.Mesh(earGeometry, this.catMaterial);
        this.rightEar.position.set(0.5, 0.8, 0);
        this.rightEar.rotation.z = Math.PI/4;
        
        this.cat.add(this.leftEar, this.rightEar);
        
        // Superposition effect - overlay of alive and dead states
        this.aliveLayerMaterial = new THREE.MeshStandardMaterial({
            color: 0x5ee85e,
            emissive: 0x5ee85e,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.5
        });
        
        this.deadLayerMaterial = new THREE.MeshStandardMaterial({
            color: 0xe85e5e,
            emissive: 0xe85e5e,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.5
        });
        
        this.aliveLayer = new THREE.Mesh(this.catGeometry, this.aliveLayerMaterial);
        this.aliveLayer.scale.set(1.05, 1.05, 1.05);
        
        this.deadLayer = new THREE.Mesh(this.catGeometry, this.deadLayerMaterial);
        this.deadLayer.scale.set(1.1, 1.1, 1.1);
        
        this.scene.add(this.aliveLayer, this.deadLayer);
        
        // Box representing the quantum experiment
        const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(this.box);
        
        // Particles for quantum effect
        this.particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const particlePositions = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount; i++) {
            // Random positions within box
            particlePositions[i * 3] = (Math.random() - 0.5) * 3;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.03,
            transparent: true,
            opacity: 0.5
        });
        
        this.particles = new THREE.Points(this.particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
        
        this.isMeasured = false;
        this.catState = 'superposition';
        
        // Start animation loop
        this.animate();
    }
    
    update() {
        if (!this.isMeasured) {
            // Animate superposition states
            const t = (Math.sin(Date.now() * 0.001) + 1) / 2;
            this.aliveLayerMaterial.opacity = 0.5 - 0.3 * t;
            this.deadLayerMaterial.opacity = 0.5 - 0.3 * (1 - t);
            
            // Pulse the box
            this.box.scale.x = 1 + 0.05 * Math.sin(Date.now() * 0.001);
            this.box.scale.y = 1 + 0.05 * Math.sin(Date.now() * 0.001);
            this.box.scale.z = 1 + 0.05 * Math.sin(Date.now() * 0.001);
        }
        
        // Rotate particles
        this.particles.rotation.y += 0.002;
    }
    
    observeCat() {
        if (this.isMeasured) return;
        
        this.isMeasured = true;
        
        // Randomly decide if cat is alive or dead
        const isAlive = Math.random() > 0.5;
        this.catState = isAlive ? 'alive' : 'dead';
        
        // Box opens effect
        gsap.to(this.box.scale, {
            y: 0.1,
            duration: 1,
            ease: "power2.out"
        });
        
        // Collapse superposition
        if (isAlive) {
            gsap.to(this.aliveLayerMaterial, {
                opacity: 0.8,
                duration: 1
            });
            
            gsap.to(this.deadLayerMaterial, {
                opacity: 0,
                duration: 1
            });
            
            gsap.to(this.catMaterial, {
                color: new THREE.Color(0x5ee85e),
                emissive: new THREE.Color(0x5ee85e),
                emissiveIntensity: 0.3,
                duration: 1
            });
        } else {
            gsap.to(this.deadLayerMaterial, {
                opacity: 0.8,
                duration: 1
            });
            
            gsap.to(this.aliveLayerMaterial, {
                opacity: 0,
                duration: 1
            });
            
            gsap.to(this.catMaterial, {
                color: new THREE.Color(0xe85e5e),
                emissive: new THREE.Color(0xe85e5e),
                emissiveIntensity: 0.3,
                duration: 1
            });
        }
        
        // Update state label
        const stateLabel = document.getElementById('cat-state');
        if (stateLabel) stateLabel.textContent = this.catState.charAt(0).toUpperCase() + this.catState.slice(1);
    }
    
    resetExperiment() {
        if (!this.isMeasured) return;
        
        this.isMeasured = false;
        this.catState = 'superposition';
        
        // Close box
        gsap.to(this.box.scale, {
            y: 1,
            duration: 1,
            ease: "power2.in"
        });
        
        // Reset superposition
        gsap.to(this.aliveLayerMaterial, {
            opacity: 0.5,
            duration: 1
        });
        
        gsap.to(this.deadLayerMaterial, {
            opacity: 0.5,
            duration: 1
        });
        
        gsap.to(this.catMaterial, {
            color: new THREE.Color(0x888888),
            emissive: new THREE.Color(0x222222),
            emissiveIntensity: 0.2,
            duration: 1
        });
        
        // Update state label
        const stateLabel = document.getElementById('cat-state');
        if (stateLabel) stateLabel.textContent = 'Superposition';
    }
    
    setupInteractionControls(controlsContainer) {
        controlsContainer.innerHTML = `
            <button id="observe-btn" class="control-btn">Open Box & Observe</button>
            <button id="reset-box-btn" class="control-btn">Reset Experiment</button>
            <div class="state-indicator">Cat State: <span id="cat-state">Superposition</span></div>
        `;
        
        document.getElementById('observe-btn').addEventListener('click', () => this.observeCat());
        document.getElementById('reset-box-btn').addEventListener('click', () => this.resetExperiment());
    }
}

class WaveParticleDualityAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        // Setup double slit experiment
        this.setupDoubleSlit();
        
        // Detector screen
        const screenGeometry = new THREE.PlaneGeometry(4, 3);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            emissive: 0x222222,
            side: THREE.DoubleSide
        });
        
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.z = 3;
        this.scene.add(this.screen);
        
        // Wave pattern on screen
        this.wavePatternTexture = this.createWavePatternTexture();
        this.wavePattern = new THREE.Mesh(
            screenGeometry,
            new THREE.MeshBasicMaterial({
                map: this.wavePatternTexture,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide
            })
        );
        this.wavePattern.position.z = 3.01;
        this.scene.add(this.wavePattern);
        
        // Particle hits on screen
        this.particleHits = [];
        
        // Start in wave mode
        this.mode = 'none'; // none, wave, particle
        
        // Add camera position for better view
        this.camera.position.set(0, 2, 6);
        this.camera.lookAt(0, 0, 0);
        
        // Start animation loop
        this.animate();
    }
    
    setupDoubleSlit() {
        // Electron source
        const sourceGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
        const sourceMaterial = new THREE.MeshStandardMaterial({
            color: animationConfig.colors.primary,
            emissive: animationConfig.colors.primary,
            emissiveIntensity: 0.5
        });
        
        this.source = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.source.position.z = -3;
        this.source.rotation.x = Math.PI / 2;
        this.scene.add(this.source);
        
        // Double slit barrier
        const barrierGeometry = new THREE.BoxGeometry(4, 2, 0.2);
        const barrierMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666
        });
        
        this.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        this.scene.add(this.barrier);
        
        // Create slits
        const slitGeometry = new THREE.BoxGeometry(0.4, 2, 0.3);
        const slitMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000
        });
        
        this.slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
        this.slit1.position.x = -0.5;
        this.scene.add(this.slit1);
        
        this.slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
        this.slit2.position.x = 0.5;
        this.scene.add(this.slit2);
        
        // Detector at slits
        const detectorGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const detectorMaterial = new THREE.MeshStandardMaterial({
            color: animationConfig.colors.highlight,
            emissive: animationConfig.colors.highlight,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0
        });
        
        this.detector1 = new THREE.Mesh(detectorGeometry, detectorMaterial);
        this.detector1.position.set(-0.5, 0, 0.2);
        this.scene.add(this.detector1);
        
        this.detector2 = new THREE.Mesh(detectorGeometry, detectorMaterial);
        this.detector2.position.set(0.5, 0, 0.2);
        this.scene.add(this.detector2);
    }
    
    createWavePatternTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // Draw interference pattern
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Simulate wave interference pattern
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                // Convert to normalized coordinates
                const nx = (x / canvas.width) * 4 - 2;
                const ny = (y / canvas.height) * 3 - 1.5;
                
                // Distance from each slit
                const d1 = Math.sqrt(Math.pow(nx + 0.5, 2) + Math.pow(ny, 2));
                const d2 = Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny, 2));
                
                // Phase difference
                const wavelength = 0.3;
                const phaseDiff = 2 * Math.PI * Math.abs(d1 - d2) / wavelength;
                
                // Intensity from interference
                const intensity = Math.pow(Math.cos(phaseDiff / 2), 2);
                
                // Fall-off with distance
                const falloff = 10 / (d1 + d2);
                
                // Final intensity
                const finalIntensity = Math.min(255, Math.floor(intensity * falloff * 500));
                
                const color = `rgb(${finalIntensity}, ${finalIntensity / 2 + 100}, ${finalIntensity})`;
                context.fillStyle = color;
                context.fillRect(x, y, 1, 1);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    showWaveBehavior() {
        this.mode = 'wave';
        
        // Hide detectors
        gsap.to(this.detector1.material, { opacity: 0, duration: 0.5 });
        gsap.to(this.detector2.material, { opacity: 0, duration: 0.5 });
        
        // Show wave pattern
        gsap.to(this.wavePattern.material, { opacity: 0.9, duration: 1 });
        
        // Clear particle hits
        this.clearParticleHits();
        
        // Create wave animation from source
        this.createWaveAnimation();
    }
    
    showParticleBehavior() {
        this.mode = 'particle';
        
        // Show detectors
        gsap.to(this.detector1.material, { opacity: 1, duration: 0.5 });
        gsap.to(this.detector2.material, { opacity: 1, duration: 0.5 });
        
        // Hide wave pattern
        gsap.to(this.wavePattern.material, { opacity: 0, duration: 0.5 });
        
        // Clear any wave animation
        if (this.waveRings) {
            this.waveRings.forEach(ring => this.scene.remove(ring));
            this.waveRings = [];
        }
        
        // Start shooting particles
        this.startParticleAnimation();
    }
    
    createWaveAnimation() {
        this.waveRings = [];
        
        // Create expanding rings from source
        const createRing = () => {
            if (this.mode !== 'wave') return;
            
            const ringGeometry = new THREE.RingGeometry(0.1, 0.12, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: animationConfig.colors.primary,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(this.source.position);
            ring.rotation.x = Math.PI / 2;
            this.scene.add(ring);
            
            this.waveRings.push(ring);
            
            // Animate ring expansion
            gsap.to(ring.scale, {
                x: 30,
                y: 30,
                z: 1,
                duration: 3,
                ease: "none",
                onComplete: () => {
                    this.scene.remove(ring);
                    this.waveRings = this.waveRings.filter(r => r !== ring);
                }
            });
            
            gsap.to(ringMaterial, {
                opacity: 0,
                duration: 3,
                ease: "none"
            });
            
            // Create next ring
            if (this.mode === 'wave') {
                setTimeout(createRing, 300);
            }
        };
        
        // Start the animation
        createRing();
    }
    
    startParticleAnimation() {
        const shootParticle = () => {
            if (this.mode !== 'particle') return;
            
            // Create particle
            const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: animationConfig.colors.secondary,
                emissive: animationConfig.colors.secondary
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.copy(this.source.position);
            this.scene.add(particle);
            
            // Random target (through one of the slits)
            const useSlit1 = Math.random() > 0.5;
            const targetSlit = useSlit1 ? this.slit1.position : this.slit2.position;
            
            // Random position on detector screen
            let finalX, finalY;
            
            if (useSlit1) {
                // Particles through slit 1 tend to go left
                finalX = -0.5 + (Math.random() - 0.5) * 3;
            } else {
                // Particles through slit 2 tend to go right
                finalX = 0.5 + (Math.random() - 0.5) * 3;
            }
            
            finalY = (Math.random() - 0.5) * 2;
            
            // Animate particle movement in 2 steps
            gsap.timeline()
                .to(particle.position, {
                    x: targetSlit.x,
                    y: targetSlit.y,
                    z: targetSlit.z,
                    duration: 0.5,
                    ease: "none"
                })
                .to(particle.position, {
                    x: finalX,
                    y: finalY,
                    z: this.screen.position.z,
                    duration: 0.5,
                    ease: "none",
                    onComplete: () => {
                        // Create hit mark on screen
                        this.createParticleHit(finalX, finalY);
                        this.scene.remove(particle);
                        
                        // Flash the detector
                        if (useSlit1) {
                            gsap.to(this.detector1.material, {
                                opacity: 1.5,
                                duration: 0.2,
                                yoyo: true,
                                repeat: 1
                            });
                        } else {
                            gsap.to(this.detector2.material, {
                                opacity: 1.5,
                                duration: 0.2,
                                yoyo: true,
                                repeat: 1
                            });
                        }
                    }
                });
            
            // Shoot next particle
            if (this.mode === 'particle') {
                setTimeout(shootParticle, 1000 + Math.random() * 500);
            }
        };
        
        // Start shooting particles
        shootParticle();
    }
    
    createParticleHit(x, y) {
        const hitGeometry = new THREE.CircleGeometry(0.03, 16);
        const hitMaterial = new THREE.MeshBasicMaterial({
            color: animationConfig.colors.highlight,
            side: THREE.DoubleSide
        });
        
        const hit = new THREE.Mesh(hitGeometry, hitMaterial);
        hit.position.set(x, y, 3.02);
        hit.rotation.x = Math.PI / 2;
        this.scene.add(hit);
        
        this.particleHits.push(hit);
        
        // Limit number of hits shown
        if (this.particleHits.length > 100) {
            const oldestHit = this.particleHits.shift();
            this.scene.remove(oldestHit);
        }
    }
    
    clearParticleHits() {
        this.particleHits.forEach(hit => {
            this.scene.remove(hit);
        });
        this.particleHits = [];
    }
    
    setupInteractionControls(controlsContainer) {
        controlsContainer.innerHTML = `
            <button id="wave-btn" class="control-btn">Show Wave Behavior</button>
            <button id="particle-btn" class="control-btn">Show Particle Behavior</button>
            <button id="reset-exp-btn" class="control-btn">Reset Experiment</button>
        `;
        
        document.getElementById('wave-btn').addEventListener('click', () => this.showWaveBehavior());
        document.getElementById('particle-btn').addEventListener('click', () => this.showParticleBehavior());
        document.getElementById('reset-exp-btn').addEventListener('click', () => {
            // Reset to no behavior mode
            this.mode = 'none';
            
            // Hide wave pattern and detectors
            gsap.to(this.wavePattern.material, { opacity: 0, duration: 0.5 });
            gsap.to(this.detector1.material, { opacity: 0, duration: 0.5 });
            gsap.to(this.detector2.material, { opacity: 0, duration: 0.5 });
            
            // Clear particles and waves
            this.clearParticleHits();
            
            if (this.waveRings) {
                this.waveRings.forEach(ring => this.scene.remove(ring));
                this.waveRings = [];
            }
        });
    }
}

class QuantumContextualityAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        // Create quantum system with three properties to measure
        this.setupQuantumSystem();
        
        // Start animation loop
        this.animate();
    }
    
    setupQuantumSystem() {
        // Central quantum system
        const systemGeometry = new THREE.IcosahedronGeometry(0.8, 1);
        const systemMaterial = new THREE.MeshStandardMaterial({
            color: animationConfig.colors.primary,
            emissive: animationConfig.colors.primary,
            emissiveIntensity: 0.5,
            wireframe: true
        });
        
        this.quantumSystem = new THREE.Mesh(systemGeometry, systemMaterial);
        this.scene.add(this.quantumSystem);
        
        // Create measurement apparatus for three properties: X, Y, Z
        const measurementGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        
        this.xMeasurement = new THREE.Mesh(
            measurementGeometry,
            new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: 0.3
            })
        );
        this.xMeasurement.position.set(2, 0, 0);
        this.xMeasurement.rotation.z = Math.PI / 2;
        this.scene.add(this.xMeasurement);
        
        this.yMeasurement = new THREE.Mesh(
            measurementGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 0.3
            })
        );
        this.yMeasurement.position.set(0, 2, 0);
        this.scene.add(this.yMeasurement);
        
        this.zMeasurement = new THREE.Mesh(
            measurementGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x0000ff,
                emissive: 0x0000ff,
                emissiveIntensity: 0.3
            })
        );
        this.zMeasurement.position.set(0, 0, 2);
        this.zMeasurement.rotation.x = Math.PI / 2;
        this.scene.add(this.zMeasurement);
        
        // Lines connecting system to measurements
        const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 0, 0)
        ]);
        
        const yLineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 2, 0)
        ]);
        
        const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 2)
        ]);
        
        this.xLine = new THREE.Line(
            xLineGeometry,
            new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 })
        );
        
        this.yLine = new THREE.Line(
            yLineGeometry,
            new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 })
        );
        
        this.zLine = new THREE.Line(
            zLineGeometry,
            new THREE.LineBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.3 })
        );
        
        this.scene.add(this.xLine, this.yLine, this.zLine);
        
        // Result displays
        const resultGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        
        this.xResult = new THREE.Mesh(
            resultGeometry,
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0
            })
        );
        this.xResult.position.set(2.5, 0, 0);
        this.xResult.rotation.y = Math.PI / 2;
        
        this.yResult = new THREE.Mesh(
            resultGeometry,
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0
            })
        );
        this.yResult.position.set(0, 2.5, 0);
        this.yResult.rotation.x = Math.PI / 2;
        
        this.zResult = new THREE.Mesh(
            resultGeometry,
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0
            })
        );
        this.zResult.position.set(0, 0, 2.5);
        
        this.scene.add(this.xResult, this.yResult, this.zResult);
        
        // Current measurement selections
        this.xActive = false;
        this.yActive = false;
        this.zActive = false;
        
        // Quantum state values - will be generated on measurement
        this.xValue = null;
        this.yValue = null;
        this.zValue = null;
    }
    
    update() {
        // Rotate quantum system
        this.quantumSystem.rotation.x += 0.005;
        this.quantumSystem.rotation.y += 0.007;
        this.quantumSystem.rotation.z += 0.003;
        
        // Pulse active measurements
        const t = (Math.sin(Date.now() * 0.003) + 1) / 2;
        
        if (this.xActive) {
            this.xMeasurement.scale.set(1 + 0.2 * t, 1 + 0.2 * t, 1 + 0.2 * t);
            this.xLine.material.opacity = 0.3 + 0.7 * t;
        } else {
            this.xMeasurement.scale.set(1, 1, 1);
            this.xLine.material.opacity = 0.3;
        }
        
        if (this.yActive) {
            this.yMeasurement.scale.set(1 + 0.2 * t, 1 + 0.2 * t, 1 + 0.2 * t);
            this.yLine.material.opacity = 0.3 + 0.7 * t;
        } else {
            this.yMeasurement.scale.set(1, 1, 1);
            this.yLine.material.opacity = 0.3;
        }
        
        if (this.zActive) {
            this.zMeasurement.scale.set(1 + 0.2 * t, 1 + 0.2 * t, 1 + 0.2 * t);
            this.zLine.material.opacity = 0.3 + 0.7 * t;
        } else {
            this.zMeasurement.scale.set(1, 1, 1);
            this.zLine.material.opacity = 0.3;
        }
    }
    
    toggleMeasurement(axis) {
        switch(axis) {
            case 'x':
                this.xActive = !this.xActive;
                break;
            case 'y':
                this.yActive = !this.yActive;
                break;
            case 'z':
                this.zActive = !this.zActive;
                break;
        }
        
        this.updateMeasurementResults();
    }
    
    updateMeasurementResults() {
        // Generate contextual measurement outcomes
        // In quantum contextuality, the outcome of measuring property X
        // depends on whether Y or Z are also being measured
        
        // Clear previous results
        if (!this.xActive) {
            this.xValue = null;
            gsap.to(this.xResult.material, { opacity: 0, duration: 0.5 });
        }
        
        if (!this.yActive) {
            this.yValue = null;
            gsap.to(this.yResult.material, { opacity: 0, duration: 0.5 });
        }
        
        if (!this.zActive) {
            this.zValue = null;
            gsap.to(this.zResult.material, { opacity: 0, duration: 0.5 });
        }
        
        // Contextual measurement results
        if (this.xActive) {
            // X result depends on whether Y or Z are measured
            if (this.yActive && this.zActive) {
                // X, Y, Z measured together - quantum constraint XYZ = -1
                this.xValue = Math.random() > 0.5 ? 1 : -1;
                this.yValue = Math.random() > 0.5 ? 1 : -1;
                this.zValue = -this.xValue * this.yValue; // Ensures XYZ = -1
            } else if (this.yActive) {
                // X, Y measured together - can be correlated
                this.xValue = Math.random() > 0.5 ? 1 : -1;
                this.yValue = Math.random() > 0.7 ? -this.xValue : this.xValue;
            } else if (this.zActive) {
                // X, Z measured together - can be anticorrelated
                this.xValue = Math.random() > 0.5 ? 1 : -1;
                this.zValue = Math.random() > 0.7 ? this.xValue : -this.xValue;
            } else {
                // X measured alone
                this.xValue = Math.random() > 0.5 ? 1 : -1;
            }
            
            this.xResult.material.color.set(this.xValue > 0 ? 0xffcccc : 0xcc0000);
            gsap.to(this.xResult.material, { opacity: 1, duration: 0.5 });
        }
        
        if (this.yActive && this.yValue === null) {
            // Only set Y if not already set by X's contextual measurement
            this.yValue = Math.random() > 0.5 ? 1 : -1;
            this.yResult.material.color.set(this.yValue > 0 ? 0xccffcc : 0x00cc00);
            gsap.to(this.yResult.material, { opacity: 1, duration: 0.5 });
        }
        
        if (this.zActive && this.zValue === null) {
            // Only set Z if not already set by X's contextual measurement
            this.zValue = Math.random() > 0.5 ? 1 : -1;
            this.zResult.material.color.set(this.zValue > 0 ? 0xccccff : 0x0000cc);
            gsap.to(this.zResult.material, { opacity: 1, duration: 0.5 });
        }
        
        // Update result text in controls
        this.updateResultsText();
    }
    
    updateResultsText() {
        const xResultEl = document.getElementById('x-result');
        const yResultEl = document.getElementById('y-result');
        const zResultEl = document.getElementById('z-result');
        
        if (xResultEl) xResultEl.textContent = this.xValue === null ? 'Not measured' : (this.xValue > 0 ? '+1' : '-1');
        if (yResultEl) yResultEl.textContent = this.yValue === null ? 'Not measured' : (this.yValue > 0 ? '+1' : '-1');
        if (zResultEl) zResultEl.textContent = this.zValue === null ? 'Not measured' : (this.zValue > 0 ? '+1' : '-1');
    }
    
    setupInteractionControls(controlsContainer) {
        controlsContainer.innerHTML = `
            <div class="measurement-controls">
                <button id="x-button" class="control-btn">X Measurement</button>
                <div>Result: <span id="x-result">Not measured</span></div>
            </div>
            <div class="measurement-controls">
                <button id="y-button" class="control-btn">Y Measurement</button>
                <div>Result: <span id="y-result">Not measured</span></div>
            </div>
            <div class="measurement-controls">
                <button id="z-button" class="control-btn">Z Measurement</button>
                <div>Result: <span id="z-result">Not measured</span></div>
            </div>
            <button id="reset-measurements" class="control-btn">Reset All</button>
        `;
        
        document.getElementById('x-button').addEventListener('click', () => this.toggleMeasurement('x'));
        document.getElementById('y-button').addEventListener('click', () => this.toggleMeasurement('y'));
        document.getElementById('z-button').addEventListener('click', () => this.toggleMeasurement('z'));
        document.getElementById('reset-measurements').addEventListener('click', () => {
            this.xActive = false;
            this.yActive = false;
            this.zActive = false;
            this.updateMeasurementResults();
        });
    }
}

class UncertaintyPrincipleAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        // Particle system to visualize uncertainty
        this.setupParticleSystem();
        
        // Position and momentum measurement devices
        this.setupMeasurementDevices();
        
        // Initial uncertainty values
        this.positionUncertainty = 0.5; // 0 to 1, 1 being maximum uncertainty
        this.momentumUncertainty = 0.5; // 0 to 1, 1 being maximum uncertainty
        
        // Start animation loop
        this.animate();
    }
    
    setupParticleSystem() {
        // Create a particle system to represent the quantum particle
        this.particlesGeometry = new THREE.BufferGeometry();
        this.particleCount = 2000;
        
        // Initial positions in a sphere (maximum uncertainty in both)
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        
        for (let i = 0; i < this.particleCount; i++) {
            // Random position in a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = Math.random() * 1.5;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Color based on position (red for x, green for y, blue for z)
            const r = Math.abs(positions[i * 3]) / 1.5;
            const g = Math.abs(positions[i * 3 + 1]) / 1.5;
            const b = Math.abs(positions[i * 3 + 2]) / 1.5;
            
            colors[i * 3] = r;
            colors[i * 3 + 1] = g;
            colors[i * 3 + 2] = b;
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(this.particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
        
        // Store original positions for reference
        this.originalPositions = positions.slice();
    }
    
    setupMeasurementDevices() {
        // Position measurement device (grid-like)
        const posGridGeometry = new THREE.BoxGeometry(3, 3, 0.05);
        const posGridMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5555,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        this.positionGrid = new THREE.Mesh(posGridGeometry, posGridMaterial);
        this.positionGrid.position.set(0, 0, -2);
        this.scene.add(this.positionGrid);
        
        // Momentum measurement device (detector-like)
        const momDetectorGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
        const momDetectorMaterial = new THREE.MeshStandardMaterial({
            color: 0x5555ff,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        this.momentumDetector = new THREE.Mesh(momDetectorGeometry, momDetectorMaterial);
        this.momentumDetector.position.set(0, 0, 2);
        this.momentumDetector.rotation.x = Math.PI / 2;
        this.scene.add(this.momentumDetector);
        
        // Labels
        const createLabel = (text, position, color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 128;
            const context = canvas.getContext('2d');
            
            context.fillStyle = 'black';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            context.font = 'Bold 24px Arial';
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const geometry = new THREE.PlaneGeometry(1, 0.5);
            const label = new THREE.Mesh(geometry, material);
            label.position.copy(position);
            
            return label;
        };
        
        this.positionLabel = createLabel('Position', new THREE.Vector3(0, 2, -2), '#ff5555');
        this.momentumLabel = createLabel('Momentum', new THREE.Vector3(0, 2, 2), '#5555ff');
        
        this.scene.add(this.positionLabel, this.momentumLabel);
    }
    
    updateParticles() {
        // Update particle distribution based on uncertainty values
        const positions = this.particlesGeometry.attributes.position.array;
        
        // Calculate the product of uncertainties (constrained by Heisenberg principle)
        const minUncertaintyProduct = 0.25; // This represents ħ/2 in our simulation
        
        // Calculate product and correct if needed
        let product = this.positionUncertainty * this.momentumUncertainty;
        if (product < minUncertaintyProduct) {
            // Adjust momentum uncertainty to respect the limit
            this.momentumUncertainty = minUncertaintyProduct / this.positionUncertainty;
            
            // Ensure it stays within bounds
            this.momentumUncertainty = Math.min(1, this.momentumUncertainty);
            
            // Update UI
            const momentumSlider = document.getElementById('momentum-slider');
            if (momentumSlider) {
                momentumSlider.value = this.momentumUncertainty * 100;
            }
        }
        
        // Update position uncertainty indicators
        this.positionGrid.scale.set(
            1 + this.positionUncertainty * 2,
            1 + this.positionUncertainty * 2,
            1
        );
        
        // Update momentum uncertainty indicators
        this.momentumDetector.scale.set(
            1 + this.momentumUncertainty * 2,
            1,
            1 + this.momentumUncertainty * 2
        );
        
        // Update particle distribution
        for (let i = 0; i < this.particleCount; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;
            
            // Position spread (x, y) depends on position uncertainty
            positions[ix] = this.originalPositions[ix] * this.positionUncertainty * 2;
            positions[iy] = this.originalPositions[iy] * this.positionUncertainty * 2;
            
            // Momentum spread (z) depends on momentum uncertainty
            positions[iz] = this.originalPositions[iz] * this.momentumUncertainty * 2;
        }
        
        this.particlesGeometry.attributes.position.needsUpdate = true;
        
        // Update UI labels
        this.updateLabels();
    }
    
    updateLabels() {
        const posUncertaintyEl = document.getElementById('position-uncertainty');
        const momUncertaintyEl = document.getElementById('momentum-uncertainty');
        const productEl = document.getElementById('uncertainty-product');
        
        if (posUncertaintyEl) {
            posUncertaintyEl.textContent = (this.positionUncertainty * 100).toFixed(0) + '%';
        }
        
        if (momUncertaintyEl) {
            momUncertaintyEl.textContent = (this.momentumUncertainty * 100).toFixed(0) + '%';
        }
        
        if (productEl) {
            productEl.textContent = (this.positionUncertainty * this.momentumUncertainty).toFixed(2);
        }
    }
    
    update() {
        // Rotate particles slightly
        this.particles.rotation.y += 0.001;
        
        // Rotate measurement devices
        this.positionGrid.rotation.z += 0.002;
        this.momentumDetector.rotation.z += 0.002;
    }
    
    setPositionUncertainty(value) {
        this.positionUncertainty = value;
        this.updateParticles();
    }
    
    setMomentumUncertainty(value) {
        this.momentumUncertainty = value;
        this.updateParticles();
    }
    
    setupInteractionControls(controlsContainer) {
        controlsContainer.innerHTML = `
            <div class="uncertainty-control">
                <label>Position Uncertainty:</label>
                <input type="range" id="position-slider" min="10" max="100" value="50">
                <span id="position-uncertainty">50%</span>
            </div>
            <div class="uncertainty-control">
                <label>Momentum Uncertainty:</label>
                <input type="range" id="momentum-slider" min="10" max="100" value="50">
                <span id="momentum-uncertainty">50%</span>
            </div>
            <div class="uncertainty-product">
                <label>Uncertainty Product (≥ 0.25):</label>
                <span id="uncertainty-product">0.25</span>
            </div>
        `;
        
        document.getElementById('position-slider').addEventListener('input', (e) => {
            this.setPositionUncertainty(e.target.value / 100);
        });
        
        document.getElementById('momentum-slider').addEventListener('input', (e) => {
            this.setMomentumUncertainty(e.target.value / 100);
        });
        
        // Initialize particle system
        this.updateParticles();
    }
}

class EntanglementSwappingAnimation extends BaseAnimation {
    constructor(container) {
        super(container);
        
        // Four particles for entanglement swapping
        this.setupParticles();
        
        // Initial state
        this.swappingState = 'initial'; // initial, entangled, swapped
        
        // Start animation loop
        this.animate();
    }
    
    setupParticles() {
        // Create four particles
        const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        
        const materials = [
            new THREE.MeshStandardMaterial({
                color: 0xff5555,
                emissive: 0xff5555,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshStandardMaterial({
                color: 0x55ff55,
                emissive: 0x55ff55,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshStandardMaterial({
                color: 0x5555ff,
                emissive: 0x5555ff,
                emissiveIntensity: 0.5
            }),
            new THREE.MeshStandardMaterial({
                color: 0xffff55,
                emissive: 0xffff55,
                emissiveIntensity: 0.5
            })
        ];
        
        this.particles = [];
        
        // Particle 1
        this.particles[0] = new THREE.Mesh(particleGeometry, materials[0]);
        this.particles[0].position.set(-3, 1, 0);
        
        // Particle 2
        this.particles[1] = new THREE.Mesh(particleGeometry, materials[1]);
        this.particles[1].position.set(-1, 1, 0);
        
        // Particle 3
        this.particles[2] = new THREE.Mesh(particleGeometry, materials[2]);
        this.particles[2].position.set(1, -1, 0);
        
        // Particle 4
        this.particles[3] = new THREE.Mesh(particleGeometry, materials[3]);
        this.particles[3].position.set(3, -1, 0);
        
        // Add particles to scene
        for (const particle of this.particles) {
            this.scene.add(particle);
        }
        
        // Connection lines
        const lineMaterial1 = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        
        const lineMaterial2 = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        
        // Initial pairs (1-2, 3-4)
        const points1 = [
            this.particles[0].position,
            this.particles[1].position
        ];
        
        const points2 = [
            this.particles[2].position,
            this.particles[3].position
        ];
        
        const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
        const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        
        this.initialLine1 = new THREE.Line(geometry1, lineMaterial1);
        this.initialLine2 = new THREE.Line(geometry2, lineMaterial2);
        
        this.scene.add(this.initialLine1, this.initialLine2);
        
        // Bell state measurement connection (2-3)
        const bellPoints = [
            this.particles[1].position,
            this.particles[2].position
        ];
        
        const bellGeometry = new THREE.BufferGeometry().setFromPoints(bellPoints);
        const bellMaterial = new THREE.LineBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0
        });
        
        this.bellLine = new THREE.Line(bellGeometry, bellMaterial);
        this.scene.add(this.bellLine);
        
        // Final entanglement connection (1-4)
        const swappedPoints = [
            this.particles[0].position,
            this.particles[3].position
        ];
        
        const swappedGeometry = new THREE.BufferGeometry().setFromPoints(swappedPoints);
        const swappedMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0
        });
        
        this.swappedLine = new THREE.Line(swappedGeometry, swappedMaterial);
        this.scene.add(this.swappedLine);
        
        // Bell state measurement device
        const bellDeviceGeometry = new THREE.BoxGeometry(1, 1, 1);
        const bellDeviceMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0
        });
        
        this.bellDevice = new THREE.Mesh(bellDeviceGeometry, bellDeviceMaterial);
        this.bellDevice.position.set(0, 0, 0);
        this.scene.add(this.bellDevice);
        
        // Add rotational effect for particles
        this.particleRotations = [
            new THREE.Object3D(),
            new THREE.Object3D(),
            new THREE.Object3D(),
            new THREE.Object3D()
        ];
        
        for (let i = 0; i < 4; i++) {
            this.scene.add(this.particleRotations[i]);
            this.particleRotations[i].position.copy(this.particles[i].position);
            this.scene.remove(this.particles[i]);
            this.particleRotations[i].add(this.particles[i]);
            this.particles[i].position.set(0, 0, 0);
        }
        
        // Particle state visualization (orbiting small spheres)
        this.stateOrbiters = [];
        
        for (let i = 0; i < 4; i++) {
            const orbiterGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const orbiterMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.8
            });
            
            const orbiter = new THREE.Mesh(orbiterGeometry, orbiterMaterial);
            orbiter.position.set(0.6, 0, 0);
            
            const orbiterSystem = new THREE.Object3D();
            orbiterSystem.position.copy(this.particleRotations[i].position);
            orbiterSystem.add(orbiter);
            
            this.stateOrbiters.push({
                system: orbiterSystem,
                orbiter: orbiter,
                speed: 0.02 + Math.random() * 0.02,
                phase: Math.random() * Math.PI * 2
            });
            
            this.scene.add(orbiterSystem);
        }
    }
    
    update() {
        // Rotate particles
        for (let i = 0; i < 4; i++) {
            this.particleRotations[i].rotation.y += 0.01;
            this.particleRotations[i].rotation.x += 0.005;
        }
        
        // Animate orbiters
        for (let i = 0; i < 4; i++) {
            const orbiter = this.stateOrbiters[i];
            orbiter.system.rotation.y += orbiter.speed;
            orbiter.system.rotation.z = Math.sin(Date.now() * 0.001 + orbiter.phase) * 0.5;
        }
        
        // Bell measurement effect
        if (this.swappingState === 'measuring') {
            const t = (Math.sin(Date.now() * 0.005) + 1) / 2;
            this.bellDevice.scale.set(1 + 0.2 * t, 1 + 0.2 * t, 1 + 0.2 * t);
        }
    }
    
    performEntanglement() {
        if (this.swappingState !== 'initial') return;
        
        this.swappingState = 'entangled';
        
        // Show entanglement between pairs (1-2, 3-4)
        gsap.to(this.initialLine1.material, {
            opacity: 1,
            duration: 1
        });
        
        gsap.to(this.initialLine2.material, {
            opacity: 1,
            duration: 1
        });
        
        // Synchronize orbiters in entangled pairs
        // Pair 1-2
        const phase12 = Math.random() * Math.PI * 2;
        this.stateOrbiters[0].phase = phase12;
        this.stateOrbiters[1].phase = phase12;
        this.stateOrbiters[0].speed = 0.03;
        this.stateOrbiters[1].speed = 0.03;
        
        // Pair 3-4
        const phase34 = Math.random() * Math.PI * 2;
        this.stateOrbiters[2].phase = phase34;
        this.stateOrbiters[3].phase = phase34;
        this.stateOrbiters[2].speed = 0.03;
        this.stateOrbiters[3].speed = 0.03;
        
        // Animate orbiter colors to match their entangled pair
        gsap.to(this.stateOrbiters[0].orbiter.material.color, {
            r: this.particles[0].material.color.r,
            g: this.particles[0].material.color.g,
            b: this.particles[0].material.color.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[0].orbiter.material.emissive, {
            r: this.particles[0].material.emissive.r,
            g: this.particles[0].material.emissive.g,
            b: this.particles[0].material.emissive.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[1].orbiter.material.color, {
            r: this.particles[1].material.color.r,
            g: this.particles[1].material.color.g,
            b: this.particles[1].material.color.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[1].orbiter.material.emissive, {
            r: this.particles[1].material.emissive.r,
            g: this.particles[1].material.emissive.g,
            b: this.particles[1].material.emissive.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[2].orbiter.material.color, {
            r: this.particles[2].material.color.r,
            g: this.particles[2].material.color.g,
            b: this.particles[2].material.color.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[2].orbiter.material.emissive, {
            r: this.particles[2].material.emissive.r,
            g: this.particles[2].material.emissive.g,
            b: this.particles[2].material.emissive.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[3].orbiter.material.color, {
            r: this.particles[3].material.color.r,
            g: this.particles[3].material.color.g,
            b: this.particles[3].material.color.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[3].orbiter.material.emissive, {
            r: this.particles[3].material.emissive.r,
            g: this.particles[3].material.emissive.g,
            b: this.particles[3].material.emissive.b,
            duration: 1
        });
    }
    
    performBellMeasurement() {
        if (this.swappingState !== 'entangled') return;
        
        this.swappingState = 'measuring';
        
        // Show Bell measurement device
        gsap.to(this.bellDevice.material, {
            opacity: 0.7,
            duration: 1
        });
        
        // Show connection for Bell measurement
        gsap.to(this.bellLine.material, {
            opacity: 0.8,
            duration: 1
        });
        
        // Bell measurement for 1 second, then swap
        setTimeout(() => {
            this.completeSwapping();
        }, 2000);
    }
    
    completeSwapping() {
        this.swappingState = 'swapped';
        
        // Fade out Bell measurement
        gsap.to(this.bellDevice.material, {
            opacity: 0.3,
            duration: 1
        });
        
        // Fade out initial entanglement
        gsap.to(this.initialLine1.material, {
            opacity: 0.3,
            duration: 1
        });
        
        gsap.to(this.initialLine2.material, {
            opacity: 0.3,
            duration: 1
        });
        
        // Show new entanglement
        gsap.to(this.swappedLine.material, {
            opacity: 1,
            duration: 1
        });
        
        // Synchronize new entangled pair (1-4)
        const newPhase = Math.random() * Math.PI * 2;
        this.stateOrbiters[0].phase = newPhase;
        this.stateOrbiters[3].phase = newPhase;
        
        // Adjust speeds
        this.stateOrbiters[0].speed = 0.04;
        this.stateOrbiters[3].speed = 0.04;
        
        // Special effect for successful swapping
        gsap.to(this.swappedLine.material, {
            opacity: 1.5,
            duration: 0.3,
            yoyo: true,
            repeat: 3
        });
        
        // Glow effect for particles 1 and 4
        const originalScale1 = this.particles[0].scale.x;
        const originalScale4 = this.particles[3].scale.x;
        
        gsap.to(this.particles[0].scale, {
            x: originalScale1 * 1.3,
            y: originalScale1 * 1.3,
            z: originalScale1 * 1.3,
            duration: 0.3,
            yoyo: true,
            repeat: 3
        });
        
        gsap.to(this.particles[3].scale, {
            x: originalScale4 * 1.3,
            y: originalScale4 * 1.3,
            z: originalScale4 * 1.3,
            duration: 0.3,
            yoyo: true,
            repeat: 3
        });
        
        // Update orbital colors to show new entanglement
        const mixedColor = new THREE.Color(0x00ffff);
        
        gsap.to(this.stateOrbiters[0].orbiter.material.color, {
            r: mixedColor.r,
            g: mixedColor.g,
            b: mixedColor.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[0].orbiter.material.emissive, {
            r: mixedColor.r,
            g: mixedColor.g,
            b: mixedColor.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[3].orbiter.material.color, {
            r: mixedColor.r,
            g: mixedColor.g,
            b: mixedColor.b,
            duration: 1
        });
        
        gsap.to(this.stateOrbiters[3].orbiter.material.emissive, {
            r: mixedColor.r,
            g: mixedColor.g,
            b: mixedColor.b,
            duration: 1
        });
    }
    
    resetSwapping() {
        this.swappingState = 'initial';
        
        // Reset connections
        gsap.to(this.initialLine1.material, {
            opacity: 0.5,
            duration: 0.5
        });
        
        gsap.to(this.initialLine2.material, {
            opacity: 0.5,
            duration: 0.5
        });
        
        gsap.to(this.bellLine.material, {
            opacity: 0,
            duration: 0.5
        });
        
        gsap.to(this.swappedLine.material, {
            opacity: 0,
            duration: 0.5
        });
        
        // Reset Bell device
        gsap.to(this.bellDevice.material, {
            opacity: 0,
            duration: 0.5
        });
        
        this.bellDevice.scale.set(1, 1, 1);
        
        // Reset particles
        for (let i = 0; i < 4; i++) {
            // Reset orbiter phases and speeds
            this.stateOrbiters[i].phase = Math.random() * Math.PI * 2;
            this.stateOrbiters[i].speed = 0.02 + Math.random() * 0.02;
            
            // Reset orbiter colors
            gsap.to(this.stateOrbiters[i].orbiter.material.color, {
                r: 1,
                g: 1,
                b: 1,
                duration: 0.5
            });
            
            gsap.to(this.stateOrbiters[i].orbiter.material.emissive, {
                r: 1,
                g: 1,
                b: 1,
                duration: 0.5
            });
            
            // Reset particle scales
            this.particles[i].scale.set(1, 1, 1);
        }
    }
    
    setupInteractionControls(controlsContainer) {
        controlsContainer.innerHTML = `
            <button id="entangle-btn" class="control-btn">1. Entangle Pairs</button>
            <button id="bell-measure-btn" class="control-btn" disabled>2. Bell Measurement</button>
            <button id="reset-swapping-btn" class="control-btn">Reset Demonstration</button>
            <div class="state-indicator">Current State: <span id="swapping-state">Initial</span></div>
        `;
        
        const entangleBtn = document.getElementById('entangle-btn');
        const bellMeasureBtn = document.getElementById('bell-measure-btn');
        const resetBtn = document.getElementById('reset-swapping-btn');
        const stateLabel = document.getElementById('swapping-state');
        
        entangleBtn.addEventListener('click', () => {
            this.performEntanglement();
            bellMeasureBtn.disabled = false;
            entangleBtn.disabled = true;
            stateLabel.textContent = 'Entangled Pairs';
        });
        
        bellMeasureBtn.addEventListener('click', () => {
            this.performBellMeasurement();
            bellMeasureBtn.disabled = true;
            stateLabel.textContent = 'Bell Measurement → Swapped';
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetSwapping();
            entangleBtn.disabled = false;
            bellMeasureBtn.disabled = true;
            stateLabel.textContent = 'Initial';
        });
    }
}