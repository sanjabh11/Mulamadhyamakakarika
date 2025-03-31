import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse5Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;
    
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
    
    // Create a coin
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);
    
    // Coin edge
    const edgeGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const edgeMaterial = new THREE.MeshPhongMaterial({
        color: 0xd4af37,
        metalness: 0.8,
        roughness: 0.2
    });
    const coinEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    coinEdge.rotation.x = Math.PI / 2;
    coinGroup.add(coinEdge);
    
    // Coin face - Seeing side (bright)
    const faceGeometry = new THREE.CircleGeometry(2, 32);
    const brightMaterial = new THREE.MeshPhongMaterial({
        color: settings.highlightColor,
        metalness: 0.8,
        roughness: 0.2,
        emissive: settings.highlightColor,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
    });
    
    const brightFace = new THREE.Mesh(faceGeometry, brightMaterial);
    brightFace.position.set(0, 0, 0.1);
    brightFace.rotation.x = Math.PI / 2;
    coinGroup.add(brightFace);
    
    // Add eye symbol to bright face
    const eyeShape = new THREE.Shape();
    eyeShape.ellipse(0, 0, 0.8, 0.5, 0, Math.PI * 2);
    
    const eyeHole = new THREE.Path();
    eyeHole.ellipse(0, 0, 0.3, 0.3, 0, Math.PI * 2);
    eyeShape.holes.push(eyeHole);
    
    const eyeGeometry = new THREE.ShapeGeometry(eyeShape);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    });
    
    const eyeSymbol = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeSymbol.position.z = 0.101;
    brightFace.add(eyeSymbol);
    
    // Coin face - Non-seeing side (dim)
    const dimMaterial = new THREE.MeshPhongMaterial({
        color: settings.accentColor,
        metalness: 0.8,
        roughness: 0.5,
        side: THREE.DoubleSide
    });
    
    const dimFace = new THREE.Mesh(faceGeometry, dimMaterial);
    dimFace.position.set(0, 0, -0.1);
    dimFace.rotation.x = -Math.PI / 2;
    coinGroup.add(dimFace);
    
    // Add closed eye symbol to dim face
    const closedEyeShape = new THREE.Shape();
    closedEyeShape.moveTo(-0.8, 0);
    closedEyeShape.bezierCurveTo(-0.5, -0.2, 0.5, -0.2, 0.8, 0);
    
    const closedEyeGeometry = new THREE.ShapeGeometry(closedEyeShape);
    const closedEyeSymbol = new THREE.Mesh(closedEyeGeometry, eyeMaterial);
    closedEyeSymbol.position.z = -0.101;
    dimFace.add(closedEyeSymbol);
    
    // Animation state
    let isSpinning = true;
    let spinSpeed = 0.1;
    let spinDecay = 0;
    
    // Click handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    window.addEventListener('click', onClick);
    
    function onClick(event) {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections
        const intersects = raycaster.intersectObject(coinGroup, true);
        
        if (intersects.length > 0) {
            if (isSpinning) {
                // Start slowing down the coin
                spinDecay = 0.01;
            } else {
                // Restart spinning
                isSpinning = true;
                spinSpeed = 0.1;
                spinDecay = 0;
                
                // Reset coin rotation
                coinGroup.rotation.set(0, 0, 0);
            }
        }
    }
    
    // Create text overlay
    const observePrompt = document.createElement('div');
    observePrompt.textContent = 'Click the coin to observe it';
    observePrompt.style.position = 'absolute';
    observePrompt.style.top = '20px';
    observePrompt.style.left = '50%';
    observePrompt.style.transform = 'translateX(-50%)';
    observePrompt.style.color = 'white';
    observePrompt.style.fontSize = '18px';
    observePrompt.style.fontFamily = 'Montserrat, sans-serif';
    observePrompt.style.padding = '10px 20px';
    observePrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    observePrompt.style.borderRadius = '5px';
    observePrompt.style.zIndex = '100';
    document.body.appendChild(observePrompt);
    
    // Create result text
    const resultText = document.createElement('div');
    resultText.style.position = 'absolute';
    resultText.style.bottom = '100px';
    resultText.style.left = '50%';
    resultText.style.transform = 'translateX(-50%)';
    resultText.style.color = 'white';
    resultText.style.fontSize = '24px';
    resultText.style.fontWeight = 'bold';
    resultText.style.fontFamily = 'Montserrat, sans-serif';
    resultText.style.padding = '15px 30px';
    resultText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    resultText.style.borderRadius = '5px';
    resultText.style.zIndex = '100';
    resultText.style.opacity = '0';
    resultText.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(resultText);
    
    // Animation variables
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        if (isSpinning) {
            // Rotate the coin
            coinGroup.rotation.x += spinSpeed;
            
            // Apply spin decay if set
            if (spinDecay > 0) {
                spinSpeed -= spinDecay;
                
                // Stop spinning when speed gets very low
                if (spinSpeed <= 0) {
                    isSpinning = false;
                    spinSpeed = 0;
                    
                    // Determine which face is showing and snap to it
                    const normalizedRotation = coinGroup.rotation.x % (Math.PI * 2);
                    const isBrightFaceUp = (normalizedRotation > Math.PI / 2 && normalizedRotation < Math.PI * 3 / 2);
                    
                    // Snap to the nearest face
                    if (isBrightFaceUp) {
                        coinGroup.rotation.x = Math.PI;
                        resultText.textContent = 'SEEING';
                        resultText.style.backgroundColor = `rgba(${parseInt(settings.highlightColor.toString(16).substring(0, 2), 16)}, ${parseInt(settings.highlightColor.toString(16).substring(2, 4), 16)}, ${parseInt(settings.highlightColor.toString(16).substring(4, 6), 16)}, 0.7)`;
                    } else {
                        coinGroup.rotation.x = 0;
                        resultText.textContent = 'NON-SEEING';
                        resultText.style.backgroundColor = `rgba(${parseInt(settings.accentColor.toString(16).substring(0, 2), 16)}, ${parseInt(settings.accentColor.toString(16).substring(2, 4), 16)}, ${parseInt(settings.accentColor.toString(16).substring(4, 6), 16)}, 0.7)`;
                    }
                    
                    // Show result
                    resultText.style.opacity = '1';
                    
                    // Update prompt
                    observePrompt.textContent = 'Click again to spin';
                }
            }
        } else {
            // Hide result when starting to spin again
            resultText.style.opacity = '0';
            observePrompt.textContent = 'Click the coin to observe it';
        }
        
        controls.update();
    }
    
    // Clean up function
    function cleanup() {
        window.removeEventListener('click', onClick);
        document.body.removeChild(observePrompt);
        document.body.removeChild(resultText);
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

