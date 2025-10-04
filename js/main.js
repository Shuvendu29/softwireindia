// Main JavaScript file for SoftWire India Coming Soon Page
// Version: 20251003130614 - CELEBRATION BANNERS REMOVED
// Last modified: Oct 3, 2025 - All celebration code eliminated
class SoftWireApp {
    constructor() {
        // Set to a future date to prevent auto-celebration
        this.countdownDate = new Date('2026-01-01T00:00:00').getTime();
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.initializeCountdown();
        this.initializeEmailForm();
        this.initializeContactForm();
        this.initializeThemeToggle();
        this.initializeLazyLoading();
        this.initializeServiceWorker();
        this.hideLoadingScreen();
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            
            // Simulate loading progress
            const progressBar = document.querySelector('.loading-progress');
            if (progressBar) {
                let width = 0;
                const interval = setInterval(() => {
                    width += Math.random() * 15;
                    if (width >= 100) {
                        width = 100;
                        clearInterval(interval);
                        setTimeout(() => this.hideLoadingScreen(), 500);
                    }
                    progressBar.style.width = width + '%';
                }, 100);
            }
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.classList.add('loaded');
                this.triggerEntryAnimations();
            }, 1000);
        }
    }
    
    triggerEntryAnimations() {
        // Trigger entrance animations
        const elementsToAnimate = document.querySelectorAll('.header, .hero-section, .features-grid');
        elementsToAnimate.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 200);
        });
    }
    
    setupEventListeners() {
        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Scroll handler
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Page visibility handler
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Touch gestures for mobile
        if ('ontouchstart' in window) {
            this.setupTouchGestures();
        }
    }
    
    handleResize() {
        // Update particle system
        if (window.particleSystem) {
            window.particleSystem.resizeCanvas();
        }
        
        // Update countdown layout
        this.updateCountdownLayout();
        
        // Update responsive features
        this.updateResponsiveFeatures();
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update navigation bar
        this.updateNavigation(scrollTop);
        
        // Parallax effects
        this.updateParallax(scrollTop);
        
        // Progressive element loading
        this.updateProgressiveLoading(scrollTop);
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations and timers
            this.pauseAnimations();
        } else {
            // Resume animations and timers
            this.resumeAnimations();
        }
    }
    
    handleKeyboard(e) {
        // Accessibility keyboard navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Easter egg - Konami code
        this.checkKonamiCode(e);
    }
    
    setupTouchGestures() {
        let startY = 0;
        let startX = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                // Multi-touch gesture
                this.handleMultiTouch(e);
            }
        });
        
        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            
            const deltaY = startY - endY;
            const deltaX = startX - endX;
            
            // Detect swipe gestures
            if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
                this.handleSwipe(deltaX, deltaY);
            }
        });
    }
    
    initializeCountdown() {
        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.countdownDate - now;
        
        if (distance < 0) {
            this.handleCountdownComplete();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.updateCountdownDisplay(days, hours, minutes, seconds);
    }
    
    updateCountdownDisplay(days, hours, minutes, seconds) {
        const timeElements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        Object.entries(timeElements).forEach(([key, element]) => {
            if (element) {
                const value = eval(key);
                const newValue = value.toString().padStart(2, '0');
                
                if (element.textContent !== newValue) {
                    element.style.transform = 'scale(1.1)';
                    element.textContent = newValue;
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        });
    }
    
    handleCountdownComplete() {
        clearInterval(this.countdownInterval);
        
        // Update UI for launch
        this.updateUIForLaunch();
    }
    

    
    initializeEmailForm() {
        const form = document.getElementById('emailForm');
        if (form) {
            form.addEventListener('submit', this.handleEmailSubmit.bind(this));
        }
    }
    
    async handleEmailSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const submitBtn = document.querySelector('.submit-btn');
        const formMessage = document.getElementById('formMessage');
        
        if (!this.validateEmail(email)) {
            this.showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await this.submitEmail(email);
            
            // Success
            this.showFormMessage('Thank you! We\'ll notify you when we launch.', 'success');
            document.getElementById('email').value = '';
            
            // Store email in localStorage for analytics
            this.storeEmailLocally(email);
            
        } catch (error) {
            console.error('Email submission error:', error);
            this.showFormMessage('Something went wrong. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    async submitEmail(email) {
        // Simulate API call - replace with your actual email service
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type} show`;
            
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        }
    }
    
    storeEmailLocally(email) {
        const emails = JSON.parse(localStorage.getItem('softwire-emails') || '[]');
        emails.push({
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('softwire-emails', JSON.stringify(emails));
    }
    
    initializeThemeToggle() {
        // Auto-detect user's theme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('softwire-theme');
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        
        // Listen for theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('softwire-theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
    
    initializeLazyLoading() {
        // Lazy load images and heavy content
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.dataset.lazy;
                    
                    if (element.tagName === 'IMG') {
                        element.src = src;
                    } else {
                        element.style.backgroundImage = `url(${src})`;
                    }
                    
                    element.removeAttribute('data-lazy');
                    lazyLoadObserver.unobserve(element);
                }
            });
        });
        
        lazyElements.forEach(element => {
            lazyLoadObserver.observe(element);
        });
    }
    
    initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }
    
    updateNavigation(scrollTop) {
        const header = document.querySelector('.header');
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    
    updateParallax(scrollTop) {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    updateProgressiveLoading(scrollTop) {
        const windowHeight = window.innerHeight;
        const elements = document.querySelectorAll('[data-progressive]');
        
        elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementVisible = (elementTop - scrollTop) < windowHeight;
            
            if (elementVisible && !element.dataset.loaded) {
                element.dataset.loaded = 'true';
                element.classList.add('loaded');
                
                // Trigger any specific loading animations
                const loadType = element.dataset.progressive;
                this.triggerProgressiveAnimation(element, loadType);
            }
        });
    }
    
    triggerProgressiveAnimation(element, type) {
        switch (type) {
            case 'counter':
                this.animateCounter(element);
                break;
            case 'chart':
                this.animateChart(element);
                break;
            case 'typewriter':
                this.animateTypewriter(element);
                break;
        }
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    pauseAnimations() {
        if (window.particleSystem) {
            window.particleSystem.pause();
        }
    }
    
    resumeAnimations() {
        if (window.particleSystem) {
            window.particleSystem.resume();
        }
    }
    
    updateCountdownLayout() {
        const countdown = document.querySelector('.countdown-timer');
        if (countdown && window.innerWidth < 768) {
            countdown.classList.add('mobile-layout');
        } else if (countdown) {
            countdown.classList.remove('mobile-layout');
        }
    }
    
    updateResponsiveFeatures() {
        const features = document.querySelectorAll('.feature-card');
        features.forEach(feature => {
            if (window.innerWidth < 768) {
                feature.classList.add('mobile-optimized');
            } else {
                feature.classList.remove('mobile-optimized');
            }
        });
    }
    
    handleMultiTouch(e) {
        // Handle pinch-to-zoom or multi-touch gestures
        if (e.touches.length === 2) {
            e.preventDefault(); // Prevent default zoom
            // Could implement custom zoom or rotation effects
        }
    }
    
    handleSwipe(deltaX, deltaY) {
        // Handle swipe gestures
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                // Swipe left
                this.handleSwipeLeft();
            } else {
                // Swipe right
                this.handleSwipeRight();
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                // Swipe up
                this.handleSwipeUp();
            } else {
                // Swipe down
                this.handleSwipeDown();
            }
        }
    }
    
    handleSwipeLeft() {
        // Navigate to next section or trigger animation
        console.log('Swiped left');
    }
    
    handleSwipeRight() {
        // Navigate to previous section or trigger animation
        console.log('Swiped right');
    }
    
    handleSwipeUp() {
        // Scroll to next section
        const nextSection = document.querySelector('.features-grid');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    handleSwipeDown() {
        // Scroll to previous section
        const prevSection = document.querySelector('.hero-section');
        if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    checkKonamiCode(e) {
        // Easter egg - Konami code implementation
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        if (!this.konamiSequence) {
            this.konamiSequence = [];
        }
        
        this.konamiSequence.push(e.code);
        
        if (this.konamiSequence.length > konamiCode.length) {
            this.konamiSequence.shift();
        }
        
        if (this.konamiSequence.length === konamiCode.length &&
            this.konamiSequence.every((code, index) => code === konamiCode[index])) {
            this.activateEasterEgg();
        }
    }
    
    activateEasterEgg() {
        // Secret feature activation
        document.body.classList.add('konami-activated');
        
        // Add special effects
        const style = document.createElement('style');
        style.textContent = `
            .konami-activated .neural-node {
                animation: rainbowPulse 1s infinite !important;
            }
            
            @keyframes rainbowPulse {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Show easter egg message
        const message = document.createElement('div');
        message.className = 'easter-egg-message';
        message.textContent = '🎉 Konami Code Activated! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    

    
    updateUIForLaunch() {
        // Update countdown section
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection) {
            countdownSection.innerHTML = `
                <h3>Welcome to SoftWire India</h3>
                <p>Your AI Innovation Partner</p>
                <button class="launch-btn" onclick="window.location.href='#'">
                    Explore Our Services
                </button>
            `;
        }
        
        // Update status indicator
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.innerHTML = `
                <div class="status-dot" style="background: #4caf50;"></div>
                <span class="status-text">Online</span>
            `;
        }
    }
    
    // Analytics and tracking
    trackEvent(eventName, eventData = {}) {
        // Track user interactions for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Store in localStorage for backup
        const events = JSON.parse(localStorage.getItem('softwire-events') || '[]');
        events.push({
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('softwire-events', JSON.stringify(events));
    }
    
    // Cleanup method
    destroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        document.removeEventListener('keydown', this.handleKeyboard);
    }

    // Contact Form Handling
    initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
    }
    
    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };
        
        const submitBtn = e.target.querySelector('.submit-btn');
        const formMessage = document.getElementById('contactMessage');
        
        // Validate form data
        if (!this.validateContactForm(contactData)) {
            this.showContactMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await this.submitContactForm(contactData);
            
            // Success
            this.showContactMessage('Thank you! We\'ll get back to you soon.', 'success');
            e.target.reset();
            
            // Store contact in localStorage for analytics
            this.storeContactLocally(contactData);
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showContactMessage('Something went wrong. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    validateContactForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,}$/;
        
        return data.name && 
               data.name.length >= 2 && 
               emailRegex.test(data.email) && 
               phoneRegex.test(data.phone) && 
               data.message && 
               data.message.length >= 10;
    }
    
    async submitContactForm(contactData) {
        // Simulate API call - replace with your actual contact service
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }
    
    showContactMessage(message, type) {
        const messageElement = document.getElementById('contactMessage');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `form-message ${type}`;
            messageElement.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
    
    storeContactLocally(contactData) {
        try {
            const contacts = JSON.parse(localStorage.getItem('softwire-contacts') || '[]');
            contacts.push({
                ...contactData,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            });
            localStorage.setItem('softwire-contacts', JSON.stringify(contacts));
        } catch (error) {
            console.warn('Could not store contact data locally:', error);
        }
    }
}

// Initialize the application
// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.softWireApp = new SoftWireApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoftWireApp;
}
