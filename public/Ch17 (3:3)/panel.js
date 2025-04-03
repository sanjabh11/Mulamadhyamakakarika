// Panel functionality
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('.panel');
    const panelToggle = document.getElementById('panelToggle');
    const explanationHeader = document.getElementById('explanationHeader');
    const explanationContent = document.getElementById('explanationContent');
    const controlsHeader = document.getElementById('controlsHeader');
    const controlsContent = document.getElementById('controlsContent');
    
    // Panel toggle functionality
    panelToggle.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        if (panel.classList.contains('collapsed')) {
            panelToggle.querySelector('i').textContent = '▶';
        } else {
            panelToggle.querySelector('i').textContent = '◀';
        }
    });
    
    // Section toggle functionality
    explanationHeader.addEventListener('click', () => {
        explanationHeader.classList.toggle('collapsed');
        explanationContent.classList.toggle('collapsed');
        explanationHeader.querySelector('i').textContent = 
            explanationHeader.classList.contains('collapsed') ? '►' : '▼';
    });
    
    controlsHeader.addEventListener('click', () => {
        controlsHeader.classList.toggle('collapsed');
        controlsContent.classList.toggle('collapsed');
        controlsHeader.querySelector('i').textContent = 
            controlsHeader.classList.contains('collapsed') ? '►' : '▼';
    });
    
    // Initialize for mobile
    function checkMobile() {
        if (window.innerWidth < 768) {
            // For mobile: start with panel expanded but sections collapsed
            panel.classList.remove('collapsed');
            
            if (!explanationHeader.classList.contains('collapsed')) {
                explanationHeader.classList.add('collapsed');
                explanationContent.classList.add('collapsed');
                explanationHeader.querySelector('i').textContent = '►';
            }
            
            if (!controlsHeader.classList.contains('collapsed')) {
                controlsHeader.classList.add('collapsed');
                controlsContent.classList.add('collapsed');
                controlsHeader.querySelector('i').textContent = '►';
            }
        } else {
            // For desktop: explanation expanded, controls collapsed
            if (explanationHeader.classList.contains('collapsed')) {
                explanationHeader.classList.remove('collapsed');
                explanationContent.classList.remove('collapsed');
                explanationHeader.querySelector('i').textContent = '▼';
            }
        }
    }
    
    // Check on load and resize
    checkMobile();
    window.addEventListener('resize', checkMobile);
});
