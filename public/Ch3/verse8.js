import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse8Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create pond
    const pondGroup = new THREE.Group();
    scene.add(pondGroup);
    
    // Pond base
    const pondGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
    const pondMaterial = new THREE.MeshPhongMaterial({
        color: 0x4169e1,
        transparent: true,
        opacity: 0.8
    });
    const pond = new THREE.Mesh(pondGeometry, pondMaterial);
    pond.position.y = -0.5;
    pondGroup.add(pond);
    
    // Pond edge
    const edgeGeometry = new THREE.TorusGeometry(5, 0.3, 16, 32);
    const edgeMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b4513
    });
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.rotation.x = Math.PI / 2;
    edge.position.y = 0;
    pondGroup.add(edge);
    
    // Pond bottom
    const bottomGeometry = new THREE.CircleGeometry(5, 32);
    const bottomMaterial = new THREE.MeshPhongMaterial({
        color: 0x6b8e23
    });
    const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -1;
    pondGroup.add(bottom);
    
    // Create ripples
    const rippleGroup = new THREE.Group();
    pondGroup.add(rippleGroup);
    
    const ripples = [];
    const maxRipples = 5;
    
    function createRipple(x, z, color) {
        const rippleGeometry = new THREE.TorusGeometry(0.1, 0.02, 16, 100);
        const rippleMaterial = new THREE.MeshBasicMaterial({
            color: color || 0xffffff,
            transparent: true,
            opacity: 1
        });
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        ripple.position.set(x, 0, z);
        ripple.rotation.x = Math.PI / 2;
        ripple.scale.set(0.1, 0.1, 1);
        ripple.userData = {
            age: 0,
            growthRate: 0.1 + Math.random() * 0.1,
            maxSize: 1 + Math.random() * 0.5
        };
        rippleGroup.add(ripple);
        ripples.push(ripple);
        
        // Limit number of ripples
        if (ripples.length > maxRipples) {
            const oldestRipple = ripples.shift();
            rippleGroup.remove(oldestRipple);
        }
    }
    
    // Create sense symbols around the pond
    const senseSymbols = [
        { name: 'seeing', position: new THREE.Vector3(3.5, 0, 0), color: 0xff0000 },
        { name: 'hearing', position: new THREE.Vector3(0, 0, 3.5), color: 0x00ff00 },
        { name: 'smelling', position: new THREE.Vector3(-3.5, 0, 0), color: 0x0000ff },
        { name: 'tasting', position: new THREE.Vector3(0, 0, -3.5), color: 0xffff00 },
        { name: 'touching', position: new THREE.Vector3(2.5, 0, 2.5), color: 0xff00ff }
    ];
    
    senseSymbols.forEach(sense => {
        const symbol = createSenseSymbol(sense.name, sense.color);
        symbol.position.copy(sense.position);
        pondGroup.add(symbol);
    });
    
    function createSenseSymbol(name, color) {
        const group = new THREE.Group();
        
        // Create base for the symbol
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: color
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        group.add(base);
        
        // Create specific icon based on sense
        let icon;
        
        switch (name) {
            case 'seeing':
                // Eye
                const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const eyeMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                });
                icon = new THREE.Mesh(eyeGeometry, eyeMaterial);
                
                const pupilGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                const pupilMaterial = new THREE.MeshBasicMaterial({
                    color: 0x000000
                });
                const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
                pupil.position.z = 0.1;
                icon.add(pupil);
                break;
                
            case 'hearing':
                // Ear
                const earShape = new THREE.Shape();
                earShape.moveTo(0, 0);
                earShape.bezierCurveTo(0.1, 0.1, 0.2, 0, 0.15, -0.1);
                earShape.bezierCurveTo(0.1, -0.2, 0, -0.15, 0, 0);
                
                const earGeometry = new THREE.ShapeGeometry(earShape);
                const earMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffd700,
                    side: THREE.DoubleSide
                });
                icon = new THREE.Mesh(earGeometry, earMaterial);
                icon.scale.set(1.5, 1.5, 1.5);
                break;
                
            case 'smelling':
                // Nose
                const noseGeometry = new THREE.ConeGeometry(0.1, 0.2, 16);
                const noseMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffd700
                });
                icon = new THREE.Mesh(noseGeometry, noseMaterial);
                icon.rotation.x = Math.PI / 2;
                break;
                
            case 'tasting':
                // Tongue
                const tongueShape = new THREE.Shape();
                tongueShape.moveTo(-0.1, 0);
                tongueShape.quadraticCurveTo(0, 0.15, 0.1, 0);
                tongueShape.quadraticCurveTo(0, -0.05, -0.1, 0);
                
                const tongueGeometry = new THREE.ShapeGeometry(tongueShape);
                const tongueMaterial = new THREE.MeshPhongMaterial({
                    color: 0xff6347,
                    side: THREE.DoubleSide
                });
                icon = new THREE.Mesh(tongueGeometry, tongueMaterial);
                icon.scale.set(1.5, 1.5, 1.5);
                break;
                
            case 'touching':
                // Hand
                const handGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.2);
                const handMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffd700
                });
                icon = new THREE.Mesh(handGeometry, handMaterial);
                
                // Fingers
                for (let i = 0; i < 3; i++) {
                    const fingerGeometry = new THREE.BoxGeometry(0.03, 0.03, 0.1);
                    const finger = new THREE.Mesh(fingerGeometry, handMaterial);
                    finger.position.set((i - 1) * 0.05, 0, 0.15);
                    icon.add(finger);
                }
                break;
        }
        
        if (icon) {
            icon.position.y = 0.15;
            group.add(icon);
        }
        
        group.userData = { name, color };
        
        return group;
    }
    
    // Create drain control
    const drainControl = document.createElement('div');
    drainControl.style.position = 'absolute';
    drainControl.style.bottom = '20px';
    drainControl.style.left = '50%';
    drainControl.style.transform = 'translateX(-50%)';
    drainControl.style.padding = '10px 20px';
    drainControl.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    drainControl.style.color = 'white';
    drainControl.style.fontFamily = 'Montserrat, sans-serif';
    drainControl.style.fontSize = '16px';
    drainControl.style.borderRadius = '5px';
    drainControl.style.cursor = 'pointer';
    drainControl.style.textAlign = 'center';
    drainControl.style.zIndex = '100';
    drainControl.textContent = 'Drain the Pond';
    document.body.appendChild(drainControl);
    
    // Instruction text
    const instruction = document.createElement('div');
    instruction.style.position = 'absolute';
    instruction.style.top = '20px';
    instruction.style.left = '50%';
    instruction.style.transform = 'translateX(-50%)';
    instruction.style.padding = '10px 20px';
    instruction.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instruction.style.color = 'white';
    instruction.style.fontFamily = 'Montserrat, sans-serif';
    instruction.style.fontSize = '16px';
    instruction.style.borderRadius = '5px';
    instruction.style.textAlign = 'center';
    instruction.style.zIndex = '100';
    instruction.textContent = 'Click on the pond to create ripples (senses)';
    document.body.appendChild(instruction);
    
    // State variables
    let isEmptying = false;
    let emptinessLevel = 0;
    
    // Event listeners
    pondGroup.userData = { clickable: true };
    
    // Listen for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    window.addEventListener('click', onClick);
    
    function onClick(event) {
        if (isEmptying || emptinessLevel >= 1) return;
        
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections with pond
        const intersects = raycaster.intersectObject(pond);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            
            // Select a random sense to generate a colored ripple
            const sense = senseSymbols[Math.floor(Math.random() * senseSymbols.length)];
            
            // Create ripple at the click point
            createRipple(point.x, point.z, sense.color);
        }
    }
    
    // Drain control event
    drainControl.addEventListener('click', () => {
        if (!isEmptying) {
            isEmptying = true;
            drainControl.textContent = 'Draining...';
            drainControl.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            instruction.textContent = 'Without the pond (interdependence), ripples (senses) cannot exist';
        } else {
            isEmptying = false;
            drainControl.textContent = 'Drain the Pond';
            drainControl.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            instruction.textContent = 'Click on the pond to create ripples (senses)';
            
            // Start refilling
            if (emptinessLevel > 0) {
                const refill = () => {
                    emptinessLevel -= 0.01;
                    updatePondAppearance();
                    
                    if (emptinessLevel > 0) {
                        requestAnimationFrame(refill);
                    } else {
                        emptinessLevel = 0;
                        pondGroup.userData.clickable = true;
                    }
                };
                refill();
            }
        }
    });
    
    function updatePondAppearance() {
        // Adjust pond appearance based on emptiness level
        pond.position.y = -0.5 - emptinessLevel * 1;
        pond.material.opacity = 0.8 * (1 - emptinessLevel);
        
        // Fade out ripples as pond empties
        ripples.forEach(ripple => {
            ripple.material.opacity = Math.max(0, ripple.material.opacity - 0.05);
        });
    }
    
    // Animation variables
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        // Update ripple animations
        ripples.forEach((ripple, index) => {
            ripple.userData.age += 0.01;
            
            // Grow the ripple
            const growth = Math.min(ripple.userData.age * ripple.userData.growthRate, ripple.userData.maxSize);
            ripple.scale.x = growth;
            ripple.scale.y = growth;
            
            // Fade out ripple as it grows
            ripple.material.opacity = Math.max(0, 1 - ripple.userData.age / 2);
            
            // Remove ripple when it fades out
            if (ripple.material.opacity <= 0) {
                rippleGroup.remove(ripple);
                ripples.splice(index, 1);
            }
        });
        
        // Handle pond emptying
        if (isEmptying && emptinessLevel < 1) {
            emptinessLevel += 0.005;
            updatePondAppearance();
            
            // When pond is nearly empty, disable clicking
            if (emptinessLevel >= 0.8) {
                pondGroup.userData.clickable = false;
            }
            
            // When completely empty
            if (emptinessLevel >= 1) {
                emptinessLevel = 1;
                drainControl.textContent = 'Refill the Pond';
                drainControl.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
                isEmptying = false;
            }
        }
        
        // Animate sense symbols
        senseSymbols.forEach((sense, index) => {
            const symbol = pondGroup.children[index + 3]; // +3 to skip pond, edge, and bottom
            if (symbol) {
                symbol.rotation.y = time + index;
                
                // Make symbols float up when pond is emptying
                if (emptinessLevel > 0) {
                    symbol.position.y = sense.position.y + Math.min(3, emptinessLevel * 5);
                    
                    // Fade out symbols as they rise
                    symbol.children.forEach(child => {
                        if (child.material) {
                            child.material.opacity = Math.max(0, 1 - emptinessLevel);
                            child.material.transparent = true;
                        }
                    });
                } else {
                    symbol.position.y = sense.position.y;
                }
            }
        });
        
        controls.update();
    }
    
    // Clean up function
    function cleanup() {
        window.removeEventListener('click', onClick);
        document.body.removeChild(drainControl);
        document.body.removeChild(instruction);
    }
    
    return {
        scene,
        camera,
        renderer,
        controls,
        animate,
        cleanup
    };
}

