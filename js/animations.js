// Animation utilities and effects
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupTypingAnimation();
        this.setupScrollAnimations();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations based on data attributes
                    const animationType = entry.target.dataset.animation;
                    if (animationType) {
                        this.triggerAnimation(entry.target, animationType);
                    }
                }
            });
        }, options);
        
        // Observe elements with animation attributes
        document.querySelectorAll('[data-animation]').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            const text = typingElement.dataset.text || typingElement.textContent;
            const speed = parseInt(typingElement.dataset.speed) || 50;
            
            typingElement.textContent = '';
            this.typeText(typingElement, text, speed);
        }
    }
    
    typeText(element, text, speed) {
        let index = 0;
        const cursor = document.querySelector('.cursor');
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                // Add blinking cursor animation
                if (cursor) {
                    cursor.style.animation = 'blink 1s infinite';
                }
            }
        }, speed);
    }
    
    setupScrollAnimations() {
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        const aiBrain = document.querySelector('.ai-brain-animation');
        
        if (heroSection && aiBrain) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                aiBrain.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
            });
        }
        
        // Fade in animations for feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            this.observer.observe(card);
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    triggerAnimation(element, type) {
        switch (type) {
            case 'fadeInUp':
                this.fadeInUp(element);
                break;
            case 'slideInLeft':
                this.slideInLeft(element);
                break;
            case 'slideInRight':
                this.slideInRight(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'rotateIn':
                this.rotateIn(element);
                break;
            default:
                this.fadeInUp(element);
        }
    }
    
    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }
    
    slideInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 100);
    }
    
    slideInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 100);
    }
    
    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 100);
    }
    
    rotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-10deg) scale(0.9)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        }, 100);
    }
}

// Floating elements animation
class FloatingElements {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.createFloatingElements();
        this.animate();
    }
    
    createFloatingElements() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        const shapes = ['circle', 'square', 'triangle'];
        const colors = ['#0066cc', '#00a8ff', '#ff6b6b'];
        
        for (let i = 0; i < 10; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0'};
                opacity: ${Math.random() * 0.3 + 0.1};
                pointer-events: none;
                z-index: 1;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 5}s linear infinite;
            `;
            
            container.appendChild(element);
            this.elements.push({
                element: element,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 2
            });
        }
    }
    
    animate() {
        this.elements.forEach(item => {
            item.x += item.vx;
            item.y += item.vy;
            item.rotation += item.rotationSpeed;
            
            // Wrap around screen
            if (item.x < 0) item.x = window.innerWidth;
            if (item.x > window.innerWidth) item.x = 0;
            if (item.y < 0) item.y = window.innerHeight;
            if (item.y > window.innerHeight) item.y = 0;
            
            item.element.style.left = item.x + 'px';
            item.element.style.top = item.y + 'px';
            item.element.style.transform = `rotate(${item.rotation}deg)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Glitch effect for text
class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.originalText = element.textContent;
        this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        this.isGlitching = false;
    }
    
    glitch(duration = 1000) {
        if (this.isGlitching) return;
        
        this.isGlitching = true;
        const startTime = Date.now();
        
        const glitchInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                clearInterval(glitchInterval);
                this.element.textContent = this.originalText;
                this.isGlitching = false;
                return;
            }
            
            let glitchedText = '';
            for (let i = 0; i < this.originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                } else {
                    glitchedText += this.originalText[i];
                }
            }
            
            this.element.textContent = glitchedText;
        }, 50);
    }
}

// Matrix rain effect
class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.drops = [];
        this.fontSize = 14;
        this.columns = 0;
        this.chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        
        this.init();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Initialize drops
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height;
        }
        
        this.animate();
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillText(char, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Magnetic cursor effect
class MagneticCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'magnetic-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 166, 255, 0.8) 0%, rgba(0, 166, 255, 0) 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: screen;
        `;
        
        document.body.appendChild(this.cursor);
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Magnetic effect on interactive elements
        document.querySelectorAll('button, a, .feature-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursor.style.background = 'radial-gradient(circle, rgba(255, 107, 107, 0.8) 0%, rgba(255, 107, 107, 0) 70%)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.background = 'radial-gradient(circle, rgba(0, 166, 255, 0.8) 0%, rgba(0, 166, 255, 0) 70%)';
            });
        });
    }
}

// Smooth scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation manager
    window.animationManager = new AnimationManager();
    
    // Initialize floating elements
    window.floatingElements = new FloatingElements();
    
    // Initialize smooth scrolling
    window.smoothScroll = new SmoothScroll();
    
    // Initialize magnetic cursor (only on desktop)
    if (window.innerWidth > 768) {
        window.magneticCursor = new MagneticCursor();
    }
    
    // Add glitch effect to logo on hover
    const logo = document.querySelector('.logo-text h1');
    if (logo) {
        const glitchEffect = new GlitchEffect(logo);
        logo.addEventListener('mouseenter', () => {
            glitchEffect.glitch(500);
        });
    }
});

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.init();
    }
    
    init() {
        this.monitor();
    }
    
    monitor() {
        const now = performance.now();
        this.frameCount++;
        
        if (now - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            
            // Adjust particle count based on FPS
            if (this.fps < 30 && window.particleSystem) {
                window.particleSystem.maxParticles = Math.max(20, window.particleSystem.maxParticles - 10);
            } else if (this.fps > 50 && window.particleSystem) {
                window.particleSystem.maxParticles = Math.min(100, window.particleSystem.maxParticles + 5);
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
}

// Initialize performance monitor
window.performanceMonitor = new PerformanceMonitor();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationManager,
        FloatingElements,
        GlitchEffect,
        MatrixRain,
        MagneticCursor,
        SmoothScroll,
        PerformanceMonitor
    };
}
