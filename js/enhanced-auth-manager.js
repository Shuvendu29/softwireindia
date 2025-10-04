// Enhanced SoftWire India Multi-Authentication System
// Supports Email/Password, Google OAuth, and Phone Authentication

class EnhancedAuthManager {
    constructor() {
        this.currentUser = null;
        this.confirmationResult = null; // For phone authentication
        this.recaptchaVerifier = null;
        this.registrationData = null; // Store registration data during phone auth
        this.init();
    }

    init() {
        this.setupFormListeners();
        this.setupFirebaseAuthListener();
        this.setupRecaptcha();
        this.checkAuthState();
    }

    setupFirebaseAuthListener() {
        if (window.firebaseAuth) {
            window.firebaseAuth.onAuthStateChanged(async (user) => {
                this.currentUser = user;
                
                if (user) {
                    console.log('✅ User signed in:', user.email || user.phoneNumber);
                    
                    // Check if this is a new user and needs profile completion
                    if (user.metadata.creationTime === user.metadata.lastSignInTime) {
                        console.log('New user detected, checking profile...');
                        await this.handleNewUserFlow(user);
                    }
                    
                    // Redirect to dashboard if user is verified
                    if (this.isUserVerified(user)) {
                        setTimeout(() => {
                            window.location.href = 'customer-dashboard.html';
                        }, 2000);
                    }
                } else {
                    console.log('👤 User signed out');
                }
            });
        }
    }

    isUserVerified(user) {
        // Email users need email verification
        if (user.email && !user.emailVerified) {
            return false;
        }
        // Phone users are automatically verified after OTP
        // Google users are automatically verified
        return true;
    }

    async handleNewUserFlow(user) {
        try {
            // Check if user profile already exists
            const existingProfile = await this.getUserProfile(user.uid);
            
            if (!existingProfile.firstName) {
                // Create profile for new users
                let profileData = {
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || '',
                    emailVerified: user.emailVerified || false,
                    phoneVerified: !!user.phoneNumber,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    loginCount: 1,
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    authProvider: this.getAuthProvider(user),
                    profileCompleted: false
                };

                // For Google users, extract name from displayName
                if (user.providerData.some(provider => provider.providerId === 'google.com')) {
                    const displayName = user.displayName || '';
                    const nameParts = displayName.split(' ');
                    profileData.firstName = nameParts[0] || '';
                    profileData.lastName = nameParts.slice(1).join(' ') || '';
                    profileData.profileCompleted = true;
                }

                // For phone registration, use stored data
                if (this.registrationData) {
                    profileData.firstName = this.registrationData.firstName;
                    profileData.lastName = this.registrationData.lastName;
                    profileData.profileCompleted = true;
                    this.registrationData = null; // Clear after use
                }

                await this.saveUserProfile(user.uid, profileData);
                this.showMessage('Profile created successfully! Welcome to SoftWire India!', 'success');
            }
        } catch (error) {
            console.error('Error handling new user:', error);
        }
    }

    getAuthProvider(user) {
        if (user.phoneNumber) return 'phone';
        if (user.providerData.some(provider => provider.providerId === 'google.com')) return 'google';
        return 'email';
    }

    setupRecaptcha() {
        // Setup reCAPTCHA for phone authentication
        if (window.firebaseAuth) {
            this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log('reCAPTCHA verified');
                }
            });

            // Setup second reCAPTCHA for registration 
            this.recaptchaVerifierReg = new firebase.auth.RecaptchaVerifier('recaptcha-container-reg', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log('reCAPTCHA verified for registration');
                }
            });
        }
    }

    setupFormListeners() {
        // Email login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailLogin();
        });

        // Email registration form
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailRegistration();
        });

        // Phone login form
        document.getElementById('phoneLoginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePhoneLogin();
        });

        // Phone registration form
        document.getElementById('phoneRegisterForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePhoneRegistration();
        });
    }

    // Google Authentication
    async handleGoogleLogin() {
        try {
            this.showMessage('Connecting to Google...', 'info');
            
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await window.firebaseAuth.signInWithPopup(provider);
            const user = result.user;
            
            // Log analytics event
            if (window.firebaseAnalytics) {
                window.firebaseAnalytics.logEvent('login', {
                    method: 'google'
                });
            }
            
            this.showMessage('Google authentication successful!', 'success');
            
        } catch (error) {
            console.error('Google authentication error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error.code), 'error');
        }
    }

    // Email Authentication
    async handleEmailLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showMessage('Please enter both email and password', 'error');
            return;
        }

        try {
            this.showMessage('Signing in...', 'info');
            
            const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
            
            if (!userCredential.user.emailVerified) {
                this.showMessage('Please verify your email address before logging in. Check your inbox for the verification link.', 'error');
                await window.firebaseAuth.signOut();
                return;
            }

            // Update last login
            await this.updateLastLogin(userCredential.user.uid);
            
            this.showMessage('Login successful! Redirecting...', 'success');
            
        } catch (error) {
            console.error('Email login error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error.code), 'error');
        }
    }

    async handleEmailRegistration() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!this.validateRegistrationForm(firstName, lastName, email, password)) {
            return;
        }

        try {
            this.showMessage('Creating account...', 'info');

            // Create user account
            const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);

            // Update user profile
            await userCredential.user.updateProfile({
                displayName: `${firstName} ${lastName}`
            });

            // Save user data to Firestore
            await this.saveUserProfile(userCredential.user.uid, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: false,
                loginCount: 0,
                lastLogin: null,
                authProvider: 'email',
                profileCompleted: true
            });

            // Send email verification
            await userCredential.user.sendEmailVerification({
                url: `${window.location.origin}/auth-simple.html?verified=true`,
                handleCodeInApp: false
            });

            this.showMessage('Registration successful! Please check your email for verification before logging in.', 'success');
            
            // Clear form and switch to login
            document.getElementById('registerForm').reset();
            setTimeout(() => {
                showLogin();
            }, 3000);

        } catch (error) {
            console.error('Email registration error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error.code), 'error');
        }
    }

    // Phone Authentication
    async handlePhoneLogin() {
        const phoneNumber = document.getElementById('phoneNumber').value;

        if (!phoneNumber) {
            this.showMessage('Please enter a phone number', 'error');
            return;
        }

        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showMessage('Please enter a valid phone number with country code (e.g., +1234567890)', 'error');
            return;
        }

        try {
            this.showMessage('Sending OTP...', 'info');

            this.confirmationResult = await window.firebaseAuth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier);
            
            document.getElementById('otpSection').style.display = 'block';
            this.showMessage('OTP sent to your phone. Please enter the code.', 'success');

        } catch (error) {
            console.error('Phone login error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error.code), 'error');
        }
    }

    async handlePhoneRegistration() {
        const firstName = document.getElementById('regFirstName').value;
        const lastName = document.getElementById('regLastName').value;
        const phoneNumber = document.getElementById('regPhoneNumber').value;

        if (!firstName || !lastName || !phoneNumber) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showMessage('Please enter a valid phone number with country code (e.g., +1234567890)', 'error');
            return;
        }

        try {
            this.showMessage('Sending OTP...', 'info');

            // Store registration data for later use
            this.registrationData = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber
            };

            this.confirmationResult = await window.firebaseAuth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifierReg);
            
            document.getElementById('regOtpSection').style.display = 'block';
            this.showMessage('OTP sent to your phone. Please enter the code to complete registration.', 'success');

        } catch (error) {
            console.error('Phone registration error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error.code), 'error');
            this.registrationData = null;
        }
    }

    async verifyOTP() {
        const otpCode = document.getElementById('otpCode').value;

        if (!otpCode || otpCode.length !== 6) {
            this.showMessage('Please enter a valid 6-digit OTP', 'error');
            return;
        }

        try {
            this.showMessage('Verifying OTP...', 'info');

            const result = await this.confirmationResult.confirm(otpCode);
            
            this.showMessage('Phone verification successful! Signing you in...', 'success');

        } catch (error) {
            console.error('OTP verification error:', error);
            this.showMessage('Invalid OTP. Please try again.', 'error');
        }
    }

    async verifyRegistrationOTP() {
        const otpCode = document.getElementById('regOtpCode').value;

        if (!otpCode || otpCode.length !== 6) {
            this.showMessage('Please enter a valid 6-digit OTP', 'error');
            return;
        }

        try {
            this.showMessage('Verifying OTP and creating account...', 'info');

            const result = await this.confirmationResult.confirm(otpCode);
            
            this.showMessage('Phone verification successful! Account created!', 'success');

        } catch (error) {
            console.error('Registration OTP verification error:', error);
            this.showMessage('Invalid OTP. Please try again.', 'error');
        }
    }

    async resendOTP() {
        const phoneNumber = document.getElementById('phoneNumber').value;
        if (phoneNumber) {
            await this.handlePhoneLogin();
        }
    }

    async resendRegistrationOTP() {
        const phoneNumber = document.getElementById('regPhoneNumber').value;
        if (phoneNumber) {
            await this.handlePhoneRegistration();
        }
    }

    // Validation Methods
    validatePhoneNumber(phoneNumber) {
        // Basic phone number validation (should start with + and have 10-15 digits)
        const phoneRegex = /^\+\d{10,15}$/;
        return phoneRegex.test(phoneNumber);
    }

    validateRegistrationForm(firstName, lastName, email, password) {
        let isValid = true;

        if (!firstName || firstName.length < 2) {
            this.showMessage('First name must be at least 2 characters', 'error');
            isValid = false;
        }

        if (!lastName || lastName.length < 2) {
            this.showMessage('Last name must be at least 2 characters', 'error');
            isValid = false;
        }

        if (!email || !this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            isValid = false;
        }

        if (!password || password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            isValid = false;
        }

        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Utility Methods
    showMessage(message, type = 'info') {
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

    async saveUserProfile(uid, userData) {
        try {
            await window.firebaseDB.collection('users').doc(uid).set(userData, { merge: true });
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

    getFirebaseErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email address is already registered. Please use a different email or try logging in.',
            'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/user-not-found': 'No account found with this email address.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
            'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
            'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
            'auth/popup-closed-by-user': 'Authentication canceled. Please try again.',
            'auth/account-exists-with-different-credential': 'An account already exists with this email address but different sign-in method.',
            'default': 'An error occurred. Please try again.'
        };

        return errorMessages[errorCode] || errorMessages['default'];
    }

    async handleLogout() {
        try {
            await window.firebaseAuth.signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }
}

// Global function declarations for HTML onclick events
function handleGoogleLogin() {
    if (window.enhancedAuthManager) {
        window.enhancedAuthManager.handleGoogleLogin();
    }
}

function verifyOTP() {
    if (window.enhancedAuthManager) {
        window.enhancedAuthManager.verifyOTP();
    }
}

function verifyRegistrationOTP() {
    if (window.enhancedAuthManager) {
        window.enhancedAuthManager.verifyRegistrationOTP();
    }
}

function resendOTP() {
    if (window.enhancedAuthManager) {
        window.enhancedAuthManager.resendOTP();
    }
}

function resendRegistrationOTP() {
    if (window.enhancedAuthManager) {
        window.enhancedAuthManager.resendRegistrationOTP();
    }
}

// Initialize enhanced authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to load
    setTimeout(() => {
        if (typeof firebase !== 'undefined' && window.firebaseAuth) {
            window.enhancedAuthManager = new EnhancedAuthManager();
            console.log('🚀 Enhanced Auth Manager initialized');
        } else {
            console.error('❌ Firebase not available');
        }
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAuthManager;
}