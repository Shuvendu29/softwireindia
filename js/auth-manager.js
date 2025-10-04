// SoftWire India Authentication System
// Enhanced registration and login functionality

class AuthManager {
    constructor() {
        this.apiEndpoint = 'https://your-api-endpoint.com/api'; // Replace with your API
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupFormListeners();
        this.setupValidation();
        this.setupFirebaseAuthListener();
        this.checkAuthState();
    }

    setupFirebaseAuthListener() {
        // Listen for auth state changes
        if (window.firebaseAuth) {
            window.firebaseAuth.onAuthStateChanged(async (user) => {
                this.currentUser = user;
                
                if (user) {
                    console.log('✅ User signed in:', user.email);
                    
                    // Update email verification status in database if verified
                    if (user.emailVerified) {
                        const userProfile = await this.getUserProfile(user.uid);
                        if (!userProfile.emailVerified) {
                            await this.updateEmailVerificationStatus(user.uid);
                        }
                    }
                    
                    // Check if we're on auth page and user is verified, redirect to home
                    if (user.emailVerified && window.location.pathname.includes('auth-simple.html')) {
                        const urlParams = new URLSearchParams(window.location.search);
                        if (!urlParams.get('verified')) {
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 2000);
                        }
                    }
                } else {
                    console.log('👤 User signed out');
                }
            });
        }
    }

    setupFormListeners() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Registration form
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
        });

        passwordInputs.forEach(input => {
            input.addEventListener('input', () => this.validatePassword(input));
        });
    }

    validateEmail(input) {
        const email = input.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        this.showFieldFeedback(input, isValid, isValid ? 'Valid email address' : 'Please enter a valid email address');
        return isValid;
    }

    validatePassword(input) {
        const password = input.value;
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const strength = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
        const isValid = strength >= 3 && minLength;

        let message = '';
        if (!minLength) message = 'Password must be at least 8 characters long';
        else if (strength < 3) message = 'Password should include uppercase, lowercase, and numbers';
        else message = `Strong password (${strength}/5 criteria met)`;

        this.showFieldFeedback(input, isValid, message);
        return isValid;
    }

    showFieldFeedback(input, isValid, message) {
        const feedbackId = input.id + 'Feedback';
        let feedback = document.getElementById(feedbackId);
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = feedbackId;
            feedback.className = 'field-feedback';
            input.parentNode.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.className = `field-feedback ${isValid ? 'success' : 'error'}`;
        input.classList.toggle('error', !isValid);
        input.classList.toggle('success', isValid);
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        this.showLoading('loginForm');

        try {
            const response = await this.loginUser({ email, password, rememberMe });
            
            if (response.success) {
                this.showMessage('Login successful! Redirecting...', 'success');
                this.setAuthToken(response.token);
                
                // Redirect to dashboard or home page
                setTimeout(() => {
                    window.location.href = response.redirectUrl || '/dashboard.html';
                }, 1500);
            } else {
                this.showMessage(response.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please try again later.', 'error');
        } finally {
            this.hideLoading('loginForm');
        }
    }

    async handleRegistration() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!this.validateRegistrationForm(firstName, lastName, email, password)) {
            return;
        }

        this.showLoading('registerForm');

        try {
            const response = await this.registerUser({
                firstName,
                lastName,
                email,
                password
            });

            if (response.success) {
                this.showMessage('Registration successful! Please check your email for verification.', 'success');
                
                // Clear form and switch to login
                document.getElementById('registerForm').reset();
                setTimeout(() => {
                    this.showLogin();
                }, 2000);
            } else {
                this.showMessage(response.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('Registration failed. Please try again later.', 'error');
        } finally {
            this.hideLoading('registerForm');
        }
    }

    validateLoginForm(email, password) {
        let isValid = true;

        if (!email || !this.validateEmail(document.getElementById('loginEmail'))) {
            isValid = false;
        }

        if (!password || password.length < 1) {
            this.showFieldFeedback(document.getElementById('loginPassword'), false, 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    validateRegistrationForm(firstName, lastName, email, password) {
        let isValid = true;

        if (!firstName || firstName.length < 2) {
            this.showFieldFeedback(document.getElementById('firstName'), false, 'First name must be at least 2 characters');
            isValid = false;
        }

        if (!lastName || lastName.length < 2) {
            this.showFieldFeedback(document.getElementById('lastName'), false, 'Last name must be at least 2 characters');
            isValid = false;
        }

        if (!email || !this.validateEmail(document.getElementById('registerEmail'))) {
            isValid = false;
        }

        if (!password || !this.validatePassword(document.getElementById('registerPassword'))) {
            isValid = false;
        }

        return isValid;
    }

    // Backend Integration Methods
    async loginUser(credentials) {
        // Option 1: Firebase Authentication
        if (window.firebase) {
            return await this.firebaseLogin(credentials);
        }
        
        // Option 2: Custom API
        return await this.apiLogin(credentials);
    }

    async registerUser(userData) {
        console.log('registerUser called with:', userData);
        
        // Check Firebase availability
        if (typeof firebase === 'undefined') {
            console.error('Firebase not loaded');
            return {
                success: false,
                message: 'Firebase not initialized. Please refresh the page and try again.'
            };
        }
        
        if (!window.firebaseAuth) {
            console.error('Firebase Auth not available');
            return {
                success: false,
                message: 'Authentication service not available. Please refresh the page and try again.'
            };
        }
        
        // Firebase Authentication
        return await this.firebaseRegister(userData);
    }

    // Firebase Integration (Option 1)
    async firebaseLogin(credentials) {
        try {
            const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(
                credentials.email, 
                credentials.password
            );
            
            // Check if email is verified
            if (!userCredential.user.emailVerified) {
                return {
                    success: false,
                    message: 'Please verify your email address before logging in. Check your inbox for the verification link.'
                };
            }

            // Get user profile from Firestore
            const userProfile = await this.getUserProfile(userCredential.user.uid);
            
            // Update last login timestamp
            await this.updateLastLogin(userCredential.user.uid);
            
            return {
                success: true,
                token: await userCredential.user.getIdToken(),
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    emailVerified: userCredential.user.emailVerified,
                    displayName: userCredential.user.displayName,
                    ...userProfile
                },
                redirectUrl: '/index.html'
            };
        } catch (error) {
            console.error('Firebase login error:', error);
            return {
                success: false,
                message: this.getFirebaseErrorMessage(error.code)
            };
        }
    }

    async firebaseRegister(userData) {
        console.log('Starting Firebase registration for:', userData.email);
        
        try {
            // Validate inputs
            if (!userData.email || !userData.password) {
                throw new Error('Email and password are required');
            }
            
            console.log('Creating user account...');
            // Create user account
            const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(
                userData.email, 
                userData.password
            );
            
            console.log('User account created, updating profile...');
            // Update user profile
            await userCredential.user.updateProfile({
                displayName: `${userData.firstName} ${userData.lastName}`
            });

            console.log('Saving user profile to Firestore...');
            // Save additional user data to Firestore
            await this.saveUserProfile(userCredential.user.uid, {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: false,
                loginCount: 0,
                lastLogin: null,
                profileCompleted: false
            });

            console.log('Sending email verification...');
            // Send email verification
            await userCredential.user.sendEmailVerification({
                url: `${window.location.origin}/auth-simple.html?verified=true`,
                handleCodeInApp: false
            });

            // Log registration event
            if (window.firebaseAnalytics) {
                window.firebaseAnalytics.logEvent('sign_up', {
                    method: 'email'
                });
            }

            console.log('Registration completed successfully');
            return {
                success: true,
                message: 'Registration successful! Please check your email for verification before logging in.'
            };
        } catch (error) {
            console.error('Firebase registration error:', error);
            return {
                success: false,
                message: this.getFirebaseErrorMessage(error.code)
            };
        }
    }

    // Firestore Database Operations
    async saveUserProfile(uid, userData) {
        try {
            await window.firebaseDB.collection('users').doc(uid).set(userData);
            console.log('✅ User profile saved to Firestore');
        } catch (error) {
            console.error('❌ Error saving user profile:', error);
            throw error;
        }
    }

    async getUserProfile(uid) {
        try {
            const doc = await window.firebaseDB.collection('users').doc(uid).get();
            if (doc.exists) {
                return doc.data();
            } else {
                console.warn('No user profile found in Firestore');
                return {};
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
            return {};
        }
    }

    async updateUserProfile(uid, updates) {
        try {
            await window.firebaseDB.collection('users').doc(uid).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ User profile updated');
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            throw error;
        }
    }

    async updateLastLogin(uid) {
        try {
            await window.firebaseDB.collection('users').doc(uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                loginCount: firebase.firestore.FieldValue.increment(1)
            });
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    async updateEmailVerificationStatus(uid) {
        try {
            await window.firebaseDB.collection('users').doc(uid).update({
                emailVerified: true,
                verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Email verification status updated');
        } catch (error) {
            console.error('❌ Error updating verification status:', error);
        }
    }

    // Custom API Integration (Option 2)
    async apiLogin(credentials) {
        const response = await fetch(`${this.apiEndpoint}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        return await response.json();
    }

    async apiRegister(userData) {
        const response = await fetch(`${this.apiEndpoint}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        return await response.json();
    }

    // Utility Methods
    getFirebaseErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email address.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password': 'Password should be at least 6 characters long.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.'
        };

        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    showLoading(formId) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
        submitBtn.classList.add('loading');
    }

    hideLoading(formId) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Restore original button text
        if (formId === 'loginForm') {
            submitBtn.innerHTML = 'Sign In';
        } else if (formId === 'registerForm') {
            submitBtn.innerHTML = 'Create Account';
        }
    }

    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.getElementById('authMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'authMessage';
            const container = document.querySelector('.auth-container');
            container.insertBefore(messageEl, container.firstChild);
        }

        messageEl.className = `auth-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }

    setAuthToken(token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('loginTime', Date.now().toString());
    }

    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    checkAuthState() {
        const token = this.getAuthToken();
        if (token) {
            // Verify token is still valid
            this.verifyToken(token);
        }
    }

    async verifyToken(token) {
        try {
            const response = await fetch(`${this.apiEndpoint}/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                this.logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
        }
    }

    async logout() {
        try {
            if (window.firebaseAuth) {
                await window.firebaseAuth.signOut();
                console.log('✅ User signed out successfully');
            }
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('loginTime');
            window.location.href = '/auth-simple.html';
        } catch (error) {
            console.error('❌ Logout error:', error);
        }
    }

    // Additional helper methods
    isUserLoggedIn() {
        return this.currentUser && this.currentUser.emailVerified;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async resendVerificationEmail() {
        if (this.currentUser && !this.currentUser.emailVerified) {
            try {
                await this.currentUser.sendEmailVerification({
                    url: `${window.location.origin}/auth-simple.html?verified=true`,
                    handleCodeInApp: false
                });
                this.showMessage('Verification email sent! Please check your inbox.', 'success');
            } catch (error) {
                this.showMessage('Failed to send verification email. Please try again.', 'error');
                console.error('Resend verification error:', error);
            }
        }
    }

    showLogin() {
        document.querySelector('.login-form').classList.add('active');
        document.querySelector('.register-form').classList.remove('active');
    }

    showRegister() {
        document.querySelector('.register-form').classList.add('active');
        document.querySelector('.login-form').classList.remove('active');
    }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}