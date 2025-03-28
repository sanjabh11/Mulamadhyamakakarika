/**
 * Quantum Animation Controller
 * Version 1.0
 * 
 * This script manages the animations and interactions for the Quantum Madhyamaka project,
 * handling verse navigation, explanation toggles, and responsive design elements.
 */

class QuantumAnimationController {
    constructor() {
        this.currentVerse = '3.1';
        this.isMobileView = window.innerWidth < 768;
        this.isExplanationVisible = true;
        this.isDarkMode = true; // Default dark mode
        this.initEventListeners();
        this.setupAnimations();
    }

    initEventListeners() {
        // Verse navigation
        const verseButtons = document.querySelectorAll('.verse-btn');
        verseButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.changeVerse(button.getAttribute('data-verse'));
            });
        });

        // Explanation toggle
        const hideBtn = document.getElementById('hideBtn');
        const unhideBtn = document.getElementById('unhideBtn');
        
        hideBtn.addEventListener('click', () => this.toggleExplanation(false));
        unhideBtn.addEventListener('click', () => this.toggleExplanation(true));

        // Mobile view toggle
        const toggleMobileBtn = document.getElementById('toggleMobileBtn');
        toggleMobileBtn.addEventListener('click', () => this.toggleMobileView());

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Window resize handler
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobileView;
            this.isMobileView = window.innerWidth < 768;
            
            // If switching between mobile and desktop
            if (wasMobile !== this.isMobileView) {
                this.updateResponsiveLayout();
            }
        });
    }

    changeVerse(verse) {
        // Update active button
        const verseButtons = document.querySelectorAll('.verse-btn');
        verseButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-verse') === verse) {
                btn.classList.add('active');
            }
        });
        
        // Show selected verse container
        const verseContainers = document.querySelectorAll('.verse-container');
        verseContainers.forEach(container => {
            container.classList.remove('active');
            if (container.id === `verse-${verse}`) {
                container.classList.add('active');
                
                // Animate entrance
                container.style.animation = 'none';
                setTimeout(() => {
                    container.style.animation = 'fadeIn 0.5s ease-in-out';
                }, 10);
            }
        });
        
        this.currentVerse = verse;
        this.updateAnimation();
    }

    toggleExplanation(show) {
        const explanationBars = document.querySelectorAll('.explanation-bar');
        const hideBtn = document.getElementById('hideBtn');
        const unhideBtn = document.getElementById('unhideBtn');
        
        explanationBars.forEach(bar => {
            bar.style.display = show ? 'block' : 'none';
        });
        
        hideBtn.style.display = show ? 'inline-block' : 'none';
        unhideBtn.style.display = show ? 'none' : 'inline-block';
        
        this.isExplanationVisible = show;
    }

    toggleMobileView() {
        const mobileElements = document.querySelectorAll('.explanation-section:not(:first-child)');
        const toggleMobileBtn = document.getElementById('toggleMobileBtn');
        
        mobileElements.forEach(element => {
            element.classList.toggle('mobile-hidden');
        });
        
        const isMobileLayout = mobileElements[0].classList.contains('mobile-hidden');
        toggleMobileBtn.innerHTML = isMobileLayout ? 
            '<i class="fas fa-desktop"></i> Desktop View' : 
            '<i class="fas fa-mobile-alt"></i> Mobile View';
    }

    toggleTheme() {
        const root = document.documentElement;
        const themeIcon = document.querySelector('.theme-toggle i');
        
        if (this.isDarkMode) {
            // Switch to light mode
            root.style.setProperty('--background-color', '#f0f4f8');
            root.style.setProperty('--text-color', '#1a1a2e');
            root.style.setProperty('--panel-bg', 'rgba(240, 244, 248, 0.8)');
            root.style.setProperty('--panel-border', 'rgba(58, 134, 255, 0.3)');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            // Switch to dark mode
            root.style.setProperty('--background-color', '#0a0a1a');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--panel-bg', 'rgba(20, 20, 40, 0.8)');
            root.style.setProperty('--panel-border', 'rgba(100, 100, 255, 0.3)');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        this.isDarkMode = !this.isDarkMode;
    }

    updateResponsiveLayout() {
        if (this.isMobileView) {
            // Apply mobile-specific adjustments
            document.querySelectorAll('.animation-container').forEach(container => {
                container.style.height = '300px';
            });
        } else {
            // Apply desktop-specific adjustments
            document.querySelectorAll('.animation-container').forEach(container => {
                container.style.height = '500px';
            });
        }
    }

    setupAnimations() {
        // Setup initial animation for verse 3.1
        this.setupEntanglementAnimation();
    }

    setupEntanglementAnimation() {
        if (this.currentVerse !== '3.1') return;
        
        const container = document.querySelector('#verse-3\\.1 .animation-simulation');
        if (!container) return;
        
        const particleBlue = container.querySelector('.particle-blue');
        const particleRed = container.querySelector('.particle-red');
        const connection = container.querySelector('.connection');
        
        // Position particles
        particleBlue.style.left = '30%';
        particleBlue.style.top = '50%';
        particleBlue.style.transform = 'translate(-50%, -50%)';
        
        particleRed.style.left = '70%';
        particleRed.style.top = '50%';
        particleRed.style.transform = 'translate(-50%, -50%)';
        
        // Position connection
        this.updateConnection(particleBlue, particleRed, connection);
        
        // Animate particles
        this.animateEntanglement(particleBlue, particleRed, connection);
    }

    updateConnection(particle1, particle2, connection) {
        // Get positions
        const rect1 = particle1.getBoundingClientRect();
        const rect2 = particle2.getBoundingClientRect();
        
        const container = particle1.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Calculate relative positions
        const x1 = rect1.left - containerRect.left + rect1.width / 2;
        const y1 = rect1.top - containerRect.top + rect1.height / 2;
        const x2 = rect2.left - containerRect.left + rect2.width / 2;
        const y2 = rect2.top - containerRect.top + rect2.height / 2;
        
        // Calculate angle and length
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        // Position and rotate connection
        connection.style.width = `${length}px`;
        connection.style.left = `${x1}px`;
        connection.style.top = `${y1}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        connection.style.transformOrigin = '0 50%';
    }

    animateEntanglement(particle1, particle2, connection) {
        // Create animation
        let time = 0;
        const animate = () => {
            time += 0.02;
            
            // Move particles in circular motion
            const radius1 = 20;
            const radius2 = 20;
            const speed1 = 1;
            const speed2 = -1; // Opposite direction
            
            const x1 = parseFloat(particle1.style.left) + radius1 * Math.cos(time * speed1);
            const y1 = parseFloat(particle1.style.top) + radius1 * Math.sin(time * speed1);
            
            const x2 = parseFloat(particle2.style.left) + radius2 * Math.cos(time * speed2);
            const y2 = parseFloat(particle2.style.top) + radius2 * Math.sin(time * speed2);
            
            particle1.style.left = `${x1}%`;
            particle1.style.top = `${y1}%`;
            
            particle2.style.left = `${x2}%`;
            particle2.style.top = `${y2}%`;
            
            // Update connection
            this.updateConnection(particle1, particle2, connection);
            
            // Pulse effect
            const pulseScale = 1 + 0.2 * Math.sin(time * 3);
            particle1.style.transform = `translate(-50%, -50%) scale(${pulseScale})`;
            particle2.style.transform = `translate(-50%, -50%) scale(${pulseScale})`;
            
            // Continue animation if still on this verse
            if (this.currentVerse === '3.1') {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    updateAnimation() {
        // Clear any existing animations
        
        // Setup animation based on current verse
        switch(this.currentVerse) {
            case '3.1':
                this.setupEntanglementAnimation();
                break;
            case '3.2':
                // Observer effect animation would go here
                break;
            case '3.3':
                // Mutual dependence animation would go here
                break;
            // Additional verse animations would be added here
        }
    }
}

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.quantumController = new QuantumAnimationController();
});
