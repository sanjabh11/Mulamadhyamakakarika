import * as THREE from 'three';
import { colors, animation } from '../config.js';

export function initVerse11(container, controlsContainer) {
    let scene, camera, renderer, raycaster, mouse;
    let ethicalPathsGroup, fruitsGroup;
    const clock = new THREE.Clock();
    
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create 10 paths of white action
    const ethicalPaths = [
        { name: "Non-killing", color: 0xff7e7e },
        { name: "Non-stealing", color: 0xff9e44 },
        { name: "Sexual ethics", color: 0xffd700 },
        { name: "Truthful speech", color: 0x96fb96 },
        { name: "Harmonious speech", color: 0x44eebb },
        { name: "Gentle speech", color: 0x8ffff2 },
        { name: "Meaningful speech", color: 0x8f8fff },
        { name: "Non-greed", color: 0xc5a0ff },
        { name: "Non-hatred", color: 0xff7eff },
        { name: "Right view", color: 0xffffff }
    ];
    
    ethicalPathsGroup = new THREE.Group();
    scene.add(ethicalPathsGroup);
    
    // Create dice-like objects for each path
    ethicalPaths.forEach((path, index) => {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({
            color: path.color,
            emissive: path.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });
        
        const pathMesh = new THREE.Mesh(geometry, material);
        
        // Position in a circle
        const angle = (index / ethicalPaths.length) * Math.PI * 2;
        const radius = 10;
        pathMesh.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        
        pathMesh.userData = {
            path: path,
            index: index,
            basePosition: pathMesh.position.clone()
        };
        
        // Add label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'path-label';
        labelDiv.textContent = path.name;
        labelDiv.style.position = 'absolute';
        labelDiv.style.color = '#ffffff';
        labelDiv.style.padding = '5px';
        labelDiv.style.background = `rgba(${new THREE.Color(path.color).r * 255}, ${new THREE.Color(path.color).g * 255}, ${new THREE.Color(path.color).b * 255}, 0.7)`;
        labelDiv.style.borderRadius = '5px';
        labelDiv.style.fontSize = '12px';
        labelDiv.style.pointerEvents = 'none';
        container.appendChild(labelDiv);
        
        pathMesh.userData.label = labelDiv;
        
        ethicalPathsGroup.add(pathMesh);
    });
    
    // Create 5 sensual quality fruits
    const sensualFruits = [
        { name: "Form", color: 0xff7e7e, shape: "torus" },
        { name: "Sound", color: 0xffd700, shape: "sphere" },
        { name: "Smell", color: 0x96fb96, shape: "icosahedron" },
        { name: "Taste", color: 0x8ffff2, shape: "octahedron" },
        { name: "Touch", color: 0xc5a0ff, shape: "dodecahedron" }
    ];
    
    fruitsGroup = new THREE.Group();
    scene.add(fruitsGroup);
    
    // Create fruits (initially hidden)
    sensualFruits.forEach((fruit, index) => {
        let geometry;
        
        switch (fruit.shape) {
            case "torus":
                geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 32);
                break;
            case "sphere":
                geometry = new THREE.SphereGeometry(1.5, 32, 32);
                break;
            case "icosahedron":
                geometry = new THREE.IcosahedronGeometry(1.8);
                break;
            case "octahedron":
                geometry = new THREE.OctahedronGeometry(1.8);
                break;
            case "dodecahedron":
                geometry = new THREE.DodecahedronGeometry(1.8);
                break;
        }
        
        const material = new THREE.MeshPhongMaterial({
            color: fruit.color,
            emissive: fruit.color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0
        });
        
        const fruitMesh = new THREE.Mesh(geometry, material);
        
        // Position in a smaller circle
        const angle = (index / sensualFruits.length) * Math.PI * 2;
        const radius = 5;
        fruitMesh.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            10 // In front of the paths
        );
        
        fruitMesh.userData = {
            fruit: fruit,
            index: index,
            active: false
        };
        
        // Add label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'fruit-label';
        labelDiv.textContent = fruit.name;
        labelDiv.style.position = 'absolute';
        labelDiv.style.color = '#ffffff';
        labelDiv.style.padding = '5px';
        labelDiv.style.background = `rgba(${new THREE.Color(fruit.color).r * 255}, ${new THREE.Color(fruit.color).g * 255}, ${new THREE.Color(fruit.color).b * 255}, 0.7)`;
        labelDiv.style.borderRadius = '5px';
        labelDiv.style.fontSize = '12px';
        labelDiv.style.pointerEvents = 'none';
        labelDiv.style.opacity = '0';
        container.appendChild(labelDiv);
        
        fruitMesh.userData.label = labelDiv;
        
        fruitsGroup.add(fruitMesh);
    });
    
    // Add controls
    const rotationSlider = document.createElement('div');
    rotationSlider.className = 'slider-container';
    rotationSlider.innerHTML = `
        <label for="rotation-speed">Rotation:</label>
        <input type="range" id="rotation-speed" min="0" max="1" step="0.1" value="0.5">
    `;
    controlsContainer.appendChild(rotationSlider);
    
    const karmaButton = document.createElement('button');
    karmaButton.textContent = 'Generate Karmic Result';
    karmaButton.addEventListener('click', generateKarmicResult);
    controlsContainer.appendChild(karmaButton);
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', resetFruits);
    controlsContainer.appendChild(resetButton);
    
    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Animation variables
    let rotationSpeed = 0.5;
    let selectedPath = null;
    
    function animate() {
        const time = clock.getElapsedTime();
        
        // Rotate ethical paths group
        ethicalPathsGroup.rotation.y = time * 0.1 * rotationSpeed;
        
        // Animate individual paths
        ethicalPathsGroup.children.forEach((path, index) => {
            // Dice-like rotation
            path.rotation.x = time * 0.3 + index;
            path.rotation.z = time * 0.2 + index * 0.5;
            
            // Pulse effect
            const pulse = 1 + Math.sin(time * 2 + index) * 0.1;
            path.scale.set(pulse, pulse, pulse);
            
            // Highlight selected path
            if (path === selectedPath) {
                path.material.emissiveIntensity = 0.8;
                path.scale.set(pulse * 1.3, pulse * 1.3, pulse * 1.3);
            } else {
                path.material.emissiveIntensity = 0.3;
            }
            
            // Update label position
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(path.matrixWorld);
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            
            path.userData.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
        
        // Animate fruits
        fruitsGroup.children.forEach((fruit, index) => {
            if (fruit.userData.active) {
                // Rotation
                fruit.rotation.x = time * 0.5;
                fruit.rotation.y = time * 0.7;
                
                // Pulse effect
                const pulse = 1 + Math.sin(time * 1.5 + index) * 0.1;
                fruit.scale.set(pulse, pulse, pulse);
                
                // Update label
                const vector = new THREE.Vector3();
                vector.setFromMatrixPosition(fruit.matrixWorld);
                vector.project(camera);
                
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
                
                fruit.userData.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            }
        });
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    function generateKarmicResult() {
        // Select a path if none is currently selected
        const pathIndex = selectedPath ? 
            ethicalPathsGroup.children.indexOf(selectedPath) : 
            Math.floor(Math.random() * ethicalPathsGroup.children.length);
        
        const selectedPathObject = ethicalPathsGroup.children[pathIndex];
        
        // Select 1-3 random fruits to manifest
        const fruitCount = 1 + Math.floor(Math.random() * 3);
        const fruitIndices = [];
        
        while (fruitIndices.length < fruitCount) {
            const index = Math.floor(Math.random() * fruitsGroup.children.length);
            if (!fruitIndices.includes(index)) {
                fruitIndices.push(index);
            }
        }
        
        // Create connection lines
        const lineMaterial = new THREE.LineBasicMaterial({
            color: selectedPathObject.userData.path.color,
            transparent: true,
            opacity: 1
        });
        
        const lines = [];
        
        fruitIndices.forEach(fruitIndex => {
            const fruit = fruitsGroup.children[fruitIndex];
            
            // Create line from path to fruit
            const lineGeometry = new THREE.BufferGeometry();
            const linePoints = [];
            
            // Start point (path)
            linePoints.push(new THREE.Vector3().copy(selectedPathObject.position));
            
            // Middle point (some curvature)
            const midPoint = new THREE.Vector3().copy(selectedPathObject.position).lerp(fruit.position, 0.5);
            midPoint.z += 5 + Math.random() * 5;
            linePoints.push(midPoint);
            
            // End point (fruit)
            linePoints.push(new THREE.Vector3().copy(fruit.position));
            
            lineGeometry.setFromPoints(linePoints);
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            lines.push(line);
            
            // Activate the fruit
            fruit.userData.active = true;
            fruit.userData.label.style.opacity = '1';
            
            // Animate fruit appearing
            let progress = 0;
            const interval = setInterval(() => {
                progress += 0.05;
                
                if (progress >= 1) {
                    clearInterval(interval);
                    return;
                }
                
                fruit.scale.set(progress, progress, progress);
                fruit.material.opacity = progress;
            }, 16);
        });
        
        // Fade out lines after delay
        setTimeout(() => {
            let lineOpacity = 1;
            const fadeInterval = setInterval(() => {
                lineOpacity -= 0.05;
                
                if (lineOpacity <= 0) {
                    clearInterval(fadeInterval);
                    lines.forEach(line => scene.remove(line));
                    return;
                }
                
                lineMaterial.opacity = lineOpacity;
            }, 50);
        }, 2000);
    }
    
    function resetFruits() {
        fruitsGroup.children.forEach(fruit => {
            fruit.userData.active = false;
            fruit.scale.set(0, 0, 0);
            fruit.material.opacity = 0;
            fruit.userData.label.style.opacity = '0';
        });
    }
    
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(ethicalPathsGroup.children);
        
        if (intersects.length > 0) {
            selectedPath = intersects[0].object;
            document.body.style.cursor = 'pointer';
        } else {
            selectedPath = null;
            document.body.style.cursor = 'default';
        }
    }
    
    function onClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(ethicalPathsGroup.children);
        
        if (intersects.length > 0) {
            selectedPath = intersects[0].object;
            generateKarmicResult();
        }
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Setup event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    
    document.getElementById('rotation-speed').addEventListener('input', (e) => {
        rotationSpeed = parseFloat(e.target.value);
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return {
        cleanup: function() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', onResize);
            
            // Remove labels
            ethicalPathsGroup.children.forEach(path => {
                if (path.userData.label) {
                    path.userData.label.remove();
                }
            });
            
            fruitsGroup.children.forEach(fruit => {
                if (fruit.userData.label) {
                    fruit.userData.label.remove();
                }
            });
            
            cancelAnimationFrame(animate);
            renderer.dispose();
        },
        resize: onResize
    };
}