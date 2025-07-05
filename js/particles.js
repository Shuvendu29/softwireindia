// Particle System for AI-themed animations
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.maxParticles = 100;
        this.connectionDistance = 150;
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = Math.floor(this.maxParticles * (window.innerWidth / 1920));
        
        for (let i = 0; i < Math.min(particleCount, this.maxParticles); i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        // Draw connections
        this.drawConnections();
        
        // Draw mouse connections
        this.drawMouseConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const distance = this.getDistance(this.particles[i], this.particles[j]);
                
                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.drawConnection(this.particles[i], this.particles[j], opacity);
                    this.connections.push({
                        particleA: this.particles[i],
                        particleB: this.particles[j],
                        distance: distance
                    });
                }
            }
        }
    }
    
    drawMouseConnections() {
        this.particles.forEach(particle => {
            const distance = this.getDistance(particle, this.mouse);
            
            if (distance < this.connectionDistance) {
                const opacity = (1 - (distance / this.connectionDistance)) * 0.3;
                this.ctx.strokeStyle = `rgba(0, 166, 255, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });
    }
    
    drawConnection(particleA, particleB, opacity) {
        const gradient = this.ctx.createLinearGradient(
            particleA.x, particleA.y,
            particleB.x, particleB.y
        );
        
        gradient.addColorStop(0, `rgba(0, 102, 204, ${opacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(0, 166, 255, ${opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 107, 107, ${opacity * 0.5})`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = opacity * 2;
        this.ctx.beginPath();
        this.ctx.moveTo(particleA.x, particleA.y);
        this.ctx.lineTo(particleB.x, particleB.y);
        this.ctx.stroke();
    }
    
    getDistance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        window.removeEventListener('resize', this.resizeCanvas);
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.life = Math.random() * 100;
        this.maxLife = 100;
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.color = this.getRandomColor();
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulse = Math.random() * Math.PI * 2;
    }
    
    getRandomColor() {
        const colors = [
            'rgba(0, 102, 204, 0.8)',   // Primary blue
            'rgba(0, 166, 255, 0.8)',   // Secondary blue
            'rgba(255, 107, 107, 0.6)', // Accent red
            'rgba(255, 255, 255, 0.4)'  // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Update pulse
        this.pulse += this.pulseSpeed;
        
        // Update life
        this.life++;
        if (this.life > this.maxLife) {
            this.life = 0;
            this.reset();
        }
        
        // Boundary checking with wrapping
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
        
        // Slight drift towards center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const driftStrength = 0.0001;
        
        this.vx += (centerX - this.x) * driftStrength;
        this.vy += (centerY - this.y) * driftStrength;
        
        // Limit velocity
        const maxVelocity = 1;
        const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (velocity > maxVelocity) {
            this.vx = (this.vx / velocity) * maxVelocity;
            this.vy = (this.vy / velocity) * maxVelocity;
        }
    }
    
    draw(ctx) {
        const pulseRadius = this.radius + Math.sin(this.pulse) * 0.5;
        const lifeOpacity = 1 - (this.life / this.maxLife);
        
        // Draw main particle
        ctx.save();
        ctx.globalAlpha = this.opacity * lifeOpacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw glow effect
        ctx.globalAlpha = (this.opacity * lifeOpacity) * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Data Stream Effect
class DataStream {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.streams = [];
        this.maxStreams = 20;
        this.init();
    }
    
    init() {
        this.createStreams();
        this.animate();
    }
    
    createStreams() {
        for (let i = 0; i < this.maxStreams; i++) {
            this.streams.push(new Stream(this.canvas));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.streams.forEach(stream => {
            stream.update();
            stream.draw(this.ctx);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class Stream {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -50;
        this.speed = Math.random() * 2 + 1;
        this.length = Math.random() * 100 + 50;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.characters = this.generateCharacters();
    }
    
    generateCharacters() {
        const chars = '01';
        let result = '';
        for (let i = 0; i < Math.floor(this.length / 10); i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    
    update() {
        this.y += this.speed;
        
        if (this.y > this.canvas.height + 50) {
            this.reset();
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(0, 255, 0, ${this.opacity})`;
        
        for (let i = 0; i < this.characters.length; i++) {
            const char = this.characters[i];
            const y = this.y + i * 15;
            const alpha = this.opacity * (1 - i / this.characters.length);
            
            ctx.fillStyle = `rgba(0, 166, 255, ${alpha})`;
            ctx.fillText(char, this.x, y);
        }
        
        ctx.restore();
    }
}

// Neural Network Visualization
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.layers = [4, 6, 4, 2];
        this.nodeRadius = 8;
        this.init();
    }
    
    init() {
        this.createNodes();
        this.createConnections();
        this.animate();
    }
    
    createNodes() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const layerSpacing = 120;
        const startX = centerX - (this.layers.length - 1) * layerSpacing / 2;
        
        this.nodes = [];
        
        for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
            const nodesInLayer = this.layers[layerIndex];
            const nodeSpacing = 60;
            const startY = centerY - (nodesInLayer - 1) * nodeSpacing / 2;
            
            for (let nodeIndex = 0; nodeIndex < nodesInLayer; nodeIndex++) {
                this.nodes.push({
                    x: startX + layerIndex * layerSpacing,
                    y: startY + nodeIndex * nodeSpacing,
                    layer: layerIndex,
                    index: nodeIndex,
                    activation: Math.random(),
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }
    }
    
    createConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.layers.length - 1; i++) {
            const currentLayer = this.nodes.filter(node => node.layer === i);
            const nextLayer = this.nodes.filter(node => node.layer === i + 1);
            
            currentLayer.forEach(currentNode => {
                nextLayer.forEach(nextNode => {
                    this.connections.push({
                        from: currentNode,
                        to: nextNode,
                        weight: Math.random() * 2 - 1,
                        active: Math.random() > 0.5
                    });
                });
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update activations
        this.nodes.forEach(node => {
            node.pulse += 0.02;
            node.activation = Math.sin(node.pulse) * 0.3 + 0.7;
        });
        
        // Draw connections
        this.connections.forEach(connection => {
            const opacity = Math.abs(connection.weight) * connection.from.activation * 0.5;
            const color = connection.weight > 0 ? 
                `rgba(0, 166, 255, ${opacity})` : 
                `rgba(255, 107, 107, ${opacity})`;
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = Math.abs(connection.weight) * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.stroke();
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const radius = this.nodeRadius + Math.sin(node.pulse) * 2;
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius
            );
            
            gradient.addColorStop(0, `rgba(0, 166, 255, ${node.activation})`);
            gradient.addColorStop(1, `rgba(0, 102, 204, ${node.activation * 0.3})`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw node border
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${node.activation * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        // Initialize particle system
        const particleSystem = new ParticleSystem(canvas);
        
        // Store reference for cleanup
        window.particleSystem = particleSystem;
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (window.particleSystem) {
                window.particleSystem.destroy();
            }
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, DataStream, NeuralNetwork };
}
