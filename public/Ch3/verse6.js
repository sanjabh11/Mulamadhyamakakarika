import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse6Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    
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
    
    // Sky background
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x87ceeb,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({
        color: 0x7cfc00
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    scene.add(ground);
    
    // Create kite
    const kiteGroup = new THREE.Group();
    kiteGroup.position.set(0, 8, 0);
    scene.add(kiteGroup);
    
    // Kite body (diamond shape)
    const kiteShape = new THREE.Shape();
    kiteShape.moveTo(0, 2);
    kiteShape.lineTo(1.5, 0);
    kiteShape.lineTo(0, -2);
    kiteShape.lineTo(-1.5, 0);
    kiteShape.lineTo(0, 2);
    
    const kiteGeometry = new THREE.ShapeGeometry(kiteShape);
    const kiteMaterial = new THREE.MeshPhongMaterial({
        color: settings.highlightColor,
        side: THREE.DoubleSide
    });
    const kite = new THREE.Mesh(kiteGeometry, kiteMaterial);
    kiteGroup.add(kite);
    
    // Kite cross-bars
    const crossBarMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
    
    const horizontalBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 3, 8),
        crossBarMaterial
    );
    horizontalBar.rotation.z = Math.PI / 2;
    kiteGroup.add(horizontalBar);
    
    const verticalBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 4, 8),
        crossBarMaterial
    );
    kiteGroup.add(verticalBar);
    
    // Kite tail
    const tailCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(1, -3, 0),
        new THREE.Vector3(-1, -4, 0),
        new THREE.Vector3(0, -5, 0)
    );
    
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.05, 8, false);
    const tailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6f61
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    kiteGroup.add(tail);
    
    // String (the "seeing" element)
    const stringPoints = [];
    for (let i = 0; i <= 50; i++) {
        const y = -5 * (i / 50);
        // Add a slight curve to the string
        const x = 0.5 * Math.sin((i / 50) * Math.PI);
        stringPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    const stringGeometry = new THREE.BufferGeometry().setFromPoints(stringPoints);
    const stringMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2
    });
    const string = new THREE.Line(stringGeometry, stringMaterial);
    kiteGroup.add(string);
    
    // Person holding the kite
    const personGroup = new THREE.Group();
    personGroup.position.set(0, -5, 0);
    scene.add(personGroup);
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a1c71
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    personGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd700
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    personGroup.add(head);
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const armMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a1c71
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.6, 1, 0);
    leftArm.rotation.z = Math.PI / 4;
    personGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.6, 1, 0);
    rightArm.rotation.z = -Math.PI / 4;
    personGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
    const legMaterial = new THREE.MeshPhongMaterial({
        color: 0x000080
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, -0.5, 0);
    personGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, -0.5, 0);
    personGroup.add(rightLeg);
    
    // Scissors for cutting string
    const scissorsGroup = new THREE.Group();
    scissorsGroup.position.set(5, 0, 2);
    scene.add(scissorsGroup);
    
    // Create scissor blades
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.2, 0.1);
    bladeShape.lineTo(1.5, -0.4);
    bladeShape.lineTo(1.4, -0.6);
    bladeShape.lineTo(0, 0);
    
    const bladeGeometry = new THREE.ShapeGeometry(bladeShape);
    const bladeMaterial = new THREE.MeshPhongMaterial({
        color: 0xc0c0c0,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial);
    scissorsGroup.add(blade1);
    
    const blade2 = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade2.rotation.z = Math.PI;
    scissorsGroup.add(blade2);
    
    // Create handles
    const handleGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333
    });
    
    const handle1 = new THREE.Mesh(handleGeometry, handleMaterial);
    handle1.position.set(-0.5, 0, 0);
    handle1.rotation.z = Math.PI / 2;
    scissorsGroup.add(handle1);
    
    const handle2 = new THREE.Mesh(handleGeometry, handleMaterial);
    handle2.position.set(0.5, 0, 0);
    handle2.rotation.z = -Math.PI / 2;
    scissorsGroup.add(handle2);
    
    // Add a pivot point
    const pivotGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
    const pivotMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000
    });
    const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
    pivot.rotation.x = Math.PI / 2;
    scissorsGroup.add(pivot);
    
    // Animation variables
    let isStringCut = false;
    let scissorsClicked = false;
    let cutAnimationTime = 0;
    let fadeOutTime = 0;
    
    // Add clickable area for scissors
    const scissorsClickArea = new THREE.Mesh(
        new THREE.SphereGeometry(2, 16, 16),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0
        })
    );
    scissorsClickArea.position.copy(scissorsGroup.position);
    scene.add(scissorsClickArea);
    
    // Instructions text
    const instructions = document.createElement('div');
    instructions.textContent = 'Click the scissors to cut the string';
    instructions.style.position = 'absolute';
    instructions.style.bottom = '20px';
    instructions.style.left = '50%';
    instructions.style.transform = 'translateX(-50%)';
    instructions.style.color = 'white';
    instructions.style.fontSize = '16px';
    instructions.style.fontFamily = 'Montserrat, sans-serif';
    instructions.style.padding = '10px 20px';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instructions.style.borderRadius = '5px';
    document.body.appendChild(instructions);
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    window.addEventListener('click', onClick);
    
    function onClick(event) {
        if (isStringCut) return;
        
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections with scissors click area
        const intersects = raycaster.intersectObject(scissorsClickArea);
        
        if (intersects.length > 0) {
            scissorsClicked = true;
            instructions.textContent = 'The string is cut! Seer and seeing fade together.';
        }
    }
    
    // Animation variables
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        if (!isStringCut) {
            // Animate kite floating
            kiteGroup.position.y = 8 + Math.sin(time) * 0.5;
            kiteGroup.rotation.z = Math.sin(time * 0.5) * 0.1;
            
            // Update string points to follow kite
            const positions = stringGeometry.attributes.position;
            for (let i = 0; i <= 50; i++) {
                const y = kiteGroup.position.y - 5 * (i / 50);
                // Add a slight curve to the string
                const x = 0.5 * Math.sin((i / 50) * Math.PI + time * 0.2);
                positions.setXYZ(i, x, y, 0);
            }
            positions.needsUpdate = true;
            
            // Animate scissors cutting action
            if (scissorsClicked) {
                cutAnimationTime += 0.05;
                
                // Open and close scissors
                const openAmount = Math.sin(cutAnimationTime * 5) * 0.5;
                blade1.rotation.z = openAmount;
                blade2.rotation.z = Math.PI - openAmount;
                
                // Move scissors toward string
                scissorsGroup.position.x = 5 - cutAnimationTime * 2.5;
                scissorsClickArea.position.copy(scissorsGroup.position);
                
                // Cut the string when scissors reach it
                if (cutAnimationTime >= 2) {
                    isStringCut = true;
                    fadeOutTime = 0;
                }
            }
        } else {
            // Fade out kite and person after string is cut
            fadeOutTime += 0.01;
            
            // Make kite fall and spin
            kiteGroup.position.y -= 0.1;
            kiteGroup.rotation.z += 0.05;
            
            // Fade out kite and string
            kite.material.opacity = Math.max(0, 1 - fadeOutTime);
            string.material.opacity = Math.max(0, 1 - fadeOutTime * 2);
            horizontalBar.material.opacity = Math.max(0, 1 - fadeOutTime);
            verticalBar.material.opacity = Math.max(0, 1 - fadeOutTime);
            tail.material.opacity = Math.max(0, 1 - fadeOutTime);
            
            // Fade out person (seer)
            body.material.opacity = Math.max(0, 1 - fadeOutTime);
            head.material.opacity = Math.max(0, 1 - fadeOutTime);
            leftArm.material.opacity = Math.max(0, 1 - fadeOutTime);
            rightArm.material.opacity = Math.max(0, 1 - fadeOutTime);
            leftLeg.material.opacity = Math.max(0, 1 - fadeOutTime);
            rightLeg.material.opacity = Math.max(0, 1 - fadeOutTime);
            
            // Make materials transparent
            kite.material.transparent = true;
            horizontalBar.material.transparent = true;
            verticalBar.material.transparent = true;
            tail.material.transparent = true;
            body.material.transparent = true;
            head.material.transparent = true;
            leftArm.material.transparent = true;
            rightArm.material.transparent = true;
            leftLeg.material.transparent = true;
            rightLeg.material.transparent = true;
        }
        
        controls.update();
    }
    
    // Clean up function
    function cleanup() {
        window.removeEventListener('click', onClick);
        document.body.removeChild(instructions);
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

