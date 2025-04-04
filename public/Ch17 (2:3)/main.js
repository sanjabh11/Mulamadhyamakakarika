import { verseData } from './config.js';
import { animationTypes } from './animations.js';
import * as THREE from 'three';
import * as d3 from 'd3';

class App {
    constructor() {
        this.currentVerseIndex = 0;
        this.currentAnimation = null;
        this.isTextVisible = true;
        this.isExplanationVisible = false;
        this.transitionActive = false;
        this.isPanelExpanded = true;
        
        this.initElements();
        this.initTransitionEffects();
        this.attachEventListeners();
        this.setupEnhancedControls();
        this.createVerseNavigation();
        this.loadVerse(this.currentVerseIndex);
    }
    
    initElements() {
        this.sceneContainer = document.getElementById('scene-container');
        this.verseTitle = document.getElementById('verse-title');
        this.verseText = document.getElementById('verse-text');
        this.madhyamakaConcept = document.getElementById('madhyamaka-concept');
        this.quantumParallel = document.getElementById('quantum-parallel');
        this.accessibleExplanation = document.getElementById('accessible-explanation');
        this.verseIndicator = document.getElementById('verse-indicator');
        this.sidePanel = document.getElementById('side-panel');
        
        // Create transition element
        this.transitionElement = document.createElement('div');
        this.transitionElement.className = 'verse-transition';
        this.transitionElement.innerHTML = '<h1></h1>';
        document.body.appendChild(this.transitionElement);
    }
    
    initTransitionEffects() {
        // Setup THREE.js for transition effects
        this.transitionRenderer = new THREE.WebGLRenderer({ alpha: true });
        this.transitionRenderer.setSize(window.innerWidth, window.innerHeight);
        this.transitionElement.appendChild(this.transitionRenderer.domElement);
        
        this.transitionScene = new THREE.Scene();
        this.transitionCamera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.transitionCamera.position.z = 5;
        
        // Create particles for transition
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        const posArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x304ffe,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.transitionParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.transitionScene.add(this.transitionParticles);
        
        // Animation function for transition
        const animateTransition = () => {
            if (this.transitionActive) {
                requestAnimationFrame(animateTransition);
                
                this.transitionParticles.rotation.x += 0.002;
                this.transitionParticles.rotation.y += 0.003;
                
                this.transitionRenderer.render(this.transitionScene, this.transitionCamera);
            }
        };
        
        this.startTransition = () => {
            this.transitionActive = true;
            this.transitionElement.classList.add('active');
            animateTransition();
            
            const nextVerseId = verseData[this.currentVerseIndex].id;
            this.transitionElement.querySelector('h1').textContent = `Verse ${nextVerseId}`;
            
            setTimeout(() => {
                this.transitionActive = false;
                this.transitionElement.classList.remove('active');
            }, 1500);
        };
    }
    
    setupEnhancedControls() {
        // Create animation-specific controls
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'animation-controls';
        
        // Reset camera button
        const resetBtn = document.createElement('div');
        resetBtn.className = 'animation-control-btn';
        resetBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>';
        resetBtn.addEventListener('click', () => {
            if (this.currentAnimation && this.currentAnimation.resetCamera) {
                this.currentAnimation.resetCamera();
            }
        });
        
        // Pause/play button
        const pausePlayBtn = document.createElement('div');
        pausePlayBtn.className = 'animation-control-btn';
        pausePlayBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        let isPaused = false;
        pausePlayBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            if (this.currentAnimation) {
                this.currentAnimation.togglePause(isPaused);
                pausePlayBtn.innerHTML = isPaused ? 
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>' :
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            }
        });
        
        controlsDiv.appendChild(resetBtn);
        controlsDiv.appendChild(pausePlayBtn);
        document.body.appendChild(controlsDiv);
        this.animationControls = controlsDiv;
    }
    
    createVerseNavigation() {
        const navContainer = document.querySelector('.verse-navigation');
        
        verseData.forEach((verse, index) => {
            const button = document.createElement('button');
            button.className = 'verse-btn';
            button.textContent = verse.id;
            button.addEventListener('click', () => this.loadVerse(index));
            
            navContainer.appendChild(button);
        });
        
        // Update active verse button
        this.updateActiveVerseButton();
    }
    
    updateActiveVerseButton() {
        const buttons = document.querySelectorAll('.verse-btn');
        buttons.forEach((btn, index) => {
            if (index === this.currentVerseIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    attachEventListeners() {
        document.getElementById('prev-verse').addEventListener('click', () => this.navigateVerse(-1));
        document.getElementById('next-verse').addEventListener('click', () => this.navigateVerse(1));
        document.getElementById('toggle-panel').addEventListener('click', () => this.togglePanelVisibility());
        document.getElementById('panel-toggle-btn').addEventListener('click', () => this.togglePanelExpansion());
        
        // Add section toggle listeners
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.parentElement;
                section.classList.toggle('collapsed');
                section.classList.toggle('expanded');
                
                const toggleIcon = header.querySelector('.toggle-icon');
                toggleIcon.textContent = section.classList.contains('expanded') ? '▼' : '►';
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.currentAnimation) {
                this.currentAnimation.onWindowResize();
            }
            this.transitionRenderer.setSize(window.innerWidth, window.innerHeight);
            this.transitionCamera.aspect = window.innerWidth / window.innerHeight;
            this.transitionCamera.updateProjectionMatrix();
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigateVerse(-1);
            if (e.key === 'ArrowRight') this.navigateVerse(1);
            if (e.key === 'p') this.togglePanelExpansion();
            if (e.key === ' ') {
                // Trigger pause/play
                document.querySelector('.animation-control-btn:nth-child(2)')?.click();
            }
        });
    }
    
    togglePanelVisibility() {
        this.isTextVisible = !this.isTextVisible;
        if (this.isTextVisible) {
            this.sidePanel.style.display = 'block';
            document.getElementById('toggle-panel').textContent = 'Hide Panel';
        } else {
            this.sidePanel.style.display = 'none';
            document.getElementById('toggle-panel').textContent = 'Show Panel';
        }
    }
    
    togglePanelExpansion() {
        this.isPanelExpanded = !this.isPanelExpanded;
        
        if (this.isPanelExpanded) {
            this.sidePanel.classList.remove('collapsed');
            this.sidePanel.classList.add('expanded');
        } else {
            this.sidePanel.classList.remove('expanded');
            this.sidePanel.classList.add('collapsed');
        }
    }
    
    loadVerse(index) {
        // Start transition effect
        this.startTransition();
        
        setTimeout(() => {
            // Get verse data
            const verse = verseData[index];
            
            // Update text content
            this.verseTitle.textContent = `Verse ${verse.id}`;
            this.verseText.textContent = verse.text;
            this.madhyamakaConcept.textContent = verse.madhyamakaConcept;
            this.quantumParallel.textContent = verse.quantumParallel;
            this.accessibleExplanation.textContent = verse.accessibleExplanation;
            this.verseIndicator.textContent = `Verse ${verse.id}/22`;
            
            // Update active verse in navigation
            this.currentVerseIndex = index;
            this.updateActiveVerseButton();
            
            // Add glow effect to headings
            document.querySelectorAll('h2, h3, h4').forEach(el => el.classList.add('glow-text'));
            
            // Clear previous animation
            if (this.currentAnimation) {
                this.sceneContainer.innerHTML = '';
                this.currentAnimation = null;
            }
            
            // Create new animation based on verse type
            const AnimationClass = animationTypes[verse.animationType];
            if (AnimationClass) {
                this.currentAnimation = new AnimationClass(this.sceneContainer);
                
                // Add pause/resume method if not exists
                if (!this.currentAnimation.togglePause) {
                    this.currentAnimation.togglePause = (isPaused) => {
                        this.currentAnimation.animationPaused = isPaused;
                    };
                }
                
                // Add reset camera method if not exists
                if (!this.currentAnimation.resetCamera) {
                    this.currentAnimation.resetCamera = () => {
                        if (this.currentAnimation.camera) {
                            this.currentAnimation.camera.position.set(0, 0, 5);
                            this.currentAnimation.camera.lookAt(0, 0, 0);
                            if (this.currentAnimation.controls) {
                                this.currentAnimation.controls.reset();
                            }
                        }
                    };
                }
            }
            
            // Add d3.js visualization enhancement for certain verses
            this.enhanceWithD3Visualization(verse);
        }, 800);
    }
    
    enhanceWithD3Visualization(verse) {
        // Only add D3 enhancements for specific verse types
        const d3EnhancedVerses = ['quantumIrreversibility', 'quantumDistinction', 'quantumVacuum'];
        
        if (d3EnhancedVerses.includes(verse.animationType) && this.currentAnimation) {
            // Create D3 visualization container
            const d3Container = document.createElement('div');
            d3Container.id = 'd3-visualization';
            d3Container.style.position = 'absolute';
            d3Container.style.bottom = '20%';
            d3Container.style.right = '5%';
            d3Container.style.width = '200px';
            d3Container.style.height = '200px';
            d3Container.style.pointerEvents = 'none';
            d3Container.style.zIndex = '2';
            this.sceneContainer.appendChild(d3Container);
            
            // Simple D3 visualization based on verse type
            const svg = d3.select('#d3-visualization')
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .style('opacity', 0.7);
            
            // Create different visualizations based on verse type
            if (verse.animationType === 'quantumIrreversibility') {
                this.createIrreversibilityVisualization(svg);
            } else if (verse.animationType === 'quantumDistinction') {
                this.createDistinctionVisualization(svg);
            } else if (verse.animationType === 'quantumVacuum') {
                this.createVacuumVisualization(svg);
            }
        }
    }
    
    createIrreversibilityVisualization(svg) {
        const width = 200;
        const height = 200;
        const margin = 20;
        
        // Create data for irreversibility graph
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push({
                x: i,
                y: Math.exp(i/5) - 1
            });
        }
        
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, 19])
            .range([margin, width - margin]);
            
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            .range([height - margin, margin]);
            
        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX);
            
        // Add path
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#304ffe')
            .attr('stroke-width', 2)
            .attr('d', line);
            
        // Add axis labels
        svg.append('text')
            .attr('x', width/2)
            .attr('y', height - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .style('font-size', '10px')
            .text('Irreversibility');
    }
    
    createDistinctionVisualization(svg) {
        const width = 200;
        const height = 200;
        
        // Create nodes for distinction graph
        const nodes = [];
        for (let i = 0; i < 5; i++) {
            nodes.push({
                id: i,
                radius: 10 + Math.random() * 5
            });
        }
        
        // Create color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        
        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(-50))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius + 2));
            
        // Create circles for each node
        const circles = svg.selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('fill', (d, i) => color(i))
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1);
            
        // Update positions on tick
        simulation.on('tick', () => {
            circles
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });
    }
    
    createVacuumVisualization(svg) {
        const width = 200;
        const height = 200;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Create quantum fluctuation particles
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                id: i,
                x: centerX + (Math.random() - 0.5) * width * 0.8,
                y: centerY + (Math.random() - 0.5) * height * 0.8,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.5
            });
        }
        
        // Create circles for particles
        const circles = svg.selectAll('circle')
            .data(particles)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.size)
            .attr('fill', '#80deea');
            
        // Animate particles
        function animate() {
            circles
                .attr('cx', d => {
                    d.x += (Math.random() - 0.5) * d.speed;
                    if (d.x < 0 || d.x > width) d.x = centerX;
                    return d.x;
                })
                .attr('cy', d => {
                    d.y += (Math.random() - 0.5) * d.speed;
                    if (d.y < 0 || d.y > height) d.y = centerY;
                    return d.y;
                })
                .attr('opacity', () => Math.random() * 0.7 + 0.3);
                
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    navigateVerse(direction) {
        const newIndex = (this.currentVerseIndex + direction + verseData.length) % verseData.length;
        this.loadVerse(newIndex);
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Set initial states for mobile
    if (window.innerWidth < 768) {
        document.getElementById('explanation-section').classList.add('collapsed');
        document.getElementById('explanation-section').classList.remove('expanded');
        document.getElementById('explanation-section').querySelector('.toggle-icon').textContent = '►';
    }
});