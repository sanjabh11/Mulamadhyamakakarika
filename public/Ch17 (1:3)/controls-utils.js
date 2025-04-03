// Utility functions for camera controls across animations
export function setupZoomAndPan(camera, renderer) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetPosition = { x: 0, y: 0, z: camera.position.z };
    let damping = 0.1; // Smooth camera movement
    
    // Zoom with mouse wheel
    function onMouseWheel(event) {
        event.preventDefault();
        
        // Get the zoom direction and adjust speed
        const zoomSpeed = 0.1;
        const delta = -Math.sign(event.deltaY) * zoomSpeed;
        
        // Don't allow zooming too close or too far
        const newZ = camera.position.z + delta * camera.position.z;
        if (newZ > 5 && newZ < 150) {
            targetPosition.z = newZ;
        }
    }
    
    // Pan with mouse drag
    function onMouseDown(event) {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    function onMouseMove(event) {
        if (!isDragging) return;
        
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        // Adjust panning sensitivity based on zoom level
        const panSensitivity = 0.01 * (camera.position.z / 30);
        
        targetPosition.x -= deltaX * panSensitivity;
        targetPosition.y += deltaY * panSensitivity;
        
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    function onMouseUp() {
        isDragging = false;
    }
    
    // Animation loop for smooth camera movement
    function updateCamera() {
        // Smooth camera movement with dampening
        camera.position.x += (targetPosition.x - camera.position.x) * damping;
        camera.position.y += (targetPosition.y - camera.position.y) * damping;
        camera.position.z += (targetPosition.z - camera.position.z) * damping;
        
        // Look at center of scene, adjusted for panning
        camera.lookAt(targetPosition.x, targetPosition.y, 0);
        
        requestAnimationFrame(updateCamera);
    }
    
    // Set up event listeners
    renderer.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    // Start the camera update loop
    updateCamera();
    
    // Reset function to return camera to default position
    function resetCamera() {
        targetPosition = { x: 0, y: 0, z: 30 };
    }
    
    // Return cleanup function
    return {
        cleanup: function() {
            renderer.domElement.removeEventListener('wheel', onMouseWheel);
            renderer.domElement.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        },
        reset: resetCamera
    };
}