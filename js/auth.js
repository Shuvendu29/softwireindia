// Authentication JavaScript for SoftWire India
class AuthManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupOTPInputs();
    }

    init() {
        // Initialize Google Sign-In
        this.initGoogleSignIn();
        
        // Show login form by default
        this.showForm('login');
    }

    initGoogleSignIn() {
        // This will be configured when you get your Google OAuth credentials
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
            });
        });
    }

    setupEventListeners() {
        // Form switching
        document.querySelectorAll('.switch-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('data-target');
                this.showForm(target);
            });
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Google Sign-In buttons
        document.getElementById('googleLoginBtn').addEventListener('click', () => {
            this.handleGoogleAuth('login');
        });

        document.getElementById('googleRegisterBtn').addEventListener('click', () => {
            this.handleGoogleAuth('register');
        });

        // Modal controls
        document.getElementById('closeOtpModal').addEventListener('click', () => {
            this.hideModal('otpModal');
        });

        document.getElementById('verifyOtp').addEventListener('click', () => {
            this.verifyOTP();
        });

        document.getElementById('resendOtp').addEventListener('click', () => {
            this.resendOTP();
        });

        document.getElementById('continueBtn').addEventListener('click', () => {
            this.redirectToDashboard();
        });

        // Password strength checker
        document.getElementById('registerPassword').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Phone number formatting
        document.getElementById('phoneNumber').addEventListener('input', (e) => {
            this.formatPhoneNumber(e.target);
        });

        // Confirm password validation
        document.getElementById('confirmPassword').addEventListener('input', (e) => {
            this.validatePasswordMatch();
        });
    }

    setupFormValidation() {
        // Real-time email validation
        document.querySelectorAll('input[type=\"email\"]').forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateEmail(e.target);
            });
        });

        // Real-time phone validation
        document.getElementById('phoneNumber').addEventListener('blur', (e) => {
            this.validatePhone(e.target);
        });
    }

    setupOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    // Move to next input
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '') {
                    // Move to previous input
                    if (index > 0) {
                        otpInputs[index - 1].focus();
                    }
                }
            });
        });
    }

    showForm(formType) {
        const loginContainer = document.querySelector('.login-container');
        const registerContainer = document.querySelector('.register-container');

        if (formType === 'login') {
            loginContainer.classList.add('active');
            registerContainer.classList.remove('active');
        } else {
            registerContainer.classList.add('active');
            loginContainer.classList.remove('active');
        }
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!this.validateEmail(document.getElementById('loginEmail'))) {
            return;
        }

        const loginBtn = document.querySelector('#loginForm .auth-btn');
        this.setButtonLoading(loginBtn, true);

        try {
            // Simulate API call
            const response = await this.mockApiCall('/api/auth/login', {
                email,
                password,
                rememberMe
            });

            if (response.success) {
                // Store token
                localStorage.setItem('authToken', response.token);
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Show success and redirect
                this.showNotification('Login successful!', 'success');
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1000);
            } else {
                this.showNotification(response.message || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please check your credentials.', 'error');
        } finally {
            this.setButtonLoading(loginBtn, false);
        }
    }

    async handleRegister() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('phoneNumber').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked,
            newsletter: document.getElementById('newsletter').checked
        };

        // Validation
        if (!this.validateRegistrationForm(formData)) {
            return;
        }

        const registerBtn = document.querySelector('#registerForm .auth-btn');
        this.setButtonLoading(registerBtn, true);

        try {
            // Simulate API call
            const response = await this.mockApiCall('/api/auth/register', formData);

            if (response.success) {
                // Show OTP modal for phone verification
                this.showModal('otpModal');
                this.sendOTP(formData.phone);
                this.showNotification('Account created! Please verify your phone number.', 'success');
            } else {
                this.showNotification(response.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading(registerBtn, false);
        }
    }

    async handleGoogleAuth(type) {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            const profile = user.getBasicProfile();

            const userData = {
                email: profile.getEmail(),
                firstName: profile.getGivenName(),
                lastName: profile.getFamilyName(),
                googleId: profile.getId(),
                avatar: profile.getImageUrl(),
                authType: 'google'
            };

            // Send to backend
            const response = await this.mockApiCall('/api/auth/google', userData);

            if (response.success) {
                localStorage.setItem('authToken', response.token);
                this.showNotification(`Welcome, ${userData.firstName}!`, 'success');
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1000);
            } else {
                this.showNotification('Google authentication failed.', 'error');
            }
        } catch (error) {
            console.error('Google auth error:', error);
            this.showNotification('Google authentication failed.', 'error');
        }
    }

    async sendOTP(phoneNumber) {
        try {
            const response = await this.mockApiCall('/api/auth/send-otp', { phone: phoneNumber });
            if (response.success) {
                this.showNotification('OTP sent to your phone!', 'success');
            }
        } catch (error) {
            console.error('OTP send error:', error);
            this.showNotification('Failed to send OTP. Please try again.', 'error');
        }
    }

    async verifyOTP() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const otp = Array.from(otpInputs).map(input => input.value).join('');

        if (otp.length !== 6) {
            this.showNotification('Please enter the complete 6-digit code.', 'error');
            return;
        }

        const verifyBtn = document.getElementById('verifyOtp');
        this.setButtonLoading(verifyBtn, true);

        try {
            const response = await this.mockApiCall('/api/auth/verify-otp', { otp });

            if (response.success) {
                this.hideModal('otpModal');
                this.showModal('successModal');
                this.showNotification('Phone number verified successfully!', 'success');
            } else {
                this.showNotification('Invalid OTP. Please try again.', 'error');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            this.showNotification('OTP verification failed.', 'error');
        } finally {
            this.setButtonLoading(verifyBtn, false);
        }
    }

    async resendOTP() {
        const phoneNumber = document.getElementById('phoneNumber').value;
        await this.sendOTP(phoneNumber);
    }

    validateRegistrationForm(formData) {
        // Check required fields
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phone || !formData.password || !formData.confirmPassword) {
            this.showNotification('Please fill in all required fields.', 'error');
            return false;
        }

        // Check email format
        if (!this.isValidEmail(formData.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        // Check phone format
        if (!this.isValidPhone(formData.phone)) {
            this.showNotification('Please enter a valid phone number.', 'error');
            return false;
        }

        // Check password strength
        if (!this.isStrongPassword(formData.password)) {
            this.showNotification('Password must be at least 8 characters with uppercase, lowercase, and number.', 'error');
            return false;
        }

        // Check password match
        if (formData.password !== formData.confirmPassword) {
            this.showNotification('Passwords do not match.', 'error');
            return false;
        }

        // Check terms agreement
        if (!formData.agreeTerms) {
            this.showNotification('Please agree to the Terms of Service.', 'error');
            return false;
        }

        return true;
    }

    validateEmail(emailInput) {
        const email = emailInput.value;
        const isValid = this.isValidEmail(email);
        
        if (!isValid && email.length > 0) {
            emailInput.classList.add('invalid');
        } else {
            emailInput.classList.remove('invalid');
        }
        
        return isValid;
    }

    validatePhone(phoneInput) {
        const phone = phoneInput.value;
        const isValid = this.isValidPhone(phone);
        
        if (!isValid && phone.length > 0) {
            phoneInput.classList.add('invalid');
        } else {
            phoneInput.classList.remove('invalid');
        }
        
        return isValid;
    }

    validatePasswordMatch() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');
        
        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                confirmInput.classList.remove('invalid');
                confirmInput.classList.add('valid');
            } else {
                confirmInput.classList.add('invalid');
                confirmInput.classList.remove('valid');
            }
        }
    }

    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('passwordStrength');
        const strength = this.getPasswordStrength(password);
        
        strengthIndicator.className = `password-strength ${strength.level}`;
        strengthIndicator.textContent = strength.text;
    }

    getPasswordStrength(password) {
        if (password.length === 0) {
            return { level: '', text: '' };
        }
        
        if (password.length < 6) {
            return { level: 'weak', text: 'Too short' };
        }
        
        let score = 0;
        
        // Length
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character types
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score < 3) {
            return { level: 'weak', text: 'Weak password' };
        } else if (score < 5) {
            return { level: 'medium', text: 'Medium strength' };
        } else {
            return { level: 'strong', text: 'Strong password' };
        }
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})/, '($1)');
        }
        
        input.value = value;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$/;
        return phoneRegex.test(phone);
    }

    isStrongPassword(password) {
        return password.length >= 8 && 
               /[a-z]/.test(password) && 
               /[A-Z]/.test(password) && 
               /[0-9]/.test(password);
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10001',
            fontSize: '0.875rem',
            fontWeight: '500',
            maxWidth: '300px',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    redirectToDashboard() {
        // For now, redirect to home page
        // In a real app, this would be the user dashboard
        window.location.href = 'index.html';
    }

    // Mock API call for demonstration
    async mockApiCall(endpoint, data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock responses
        if (endpoint === '/api/auth/login') {
            if (data.email === 'demo@softwireindia.com' && data.password === 'Demo123!') {
                return {
                    success: true,
                    token: 'mock-jwt-token-' + Date.now(),
                    user: {
                        id: 1,
                        email: data.email,
                        firstName: 'Demo',
                        lastName: 'User'
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid email or password'
                };
            }
        }
        
        if (endpoint === '/api/auth/register') {
            // Simulate successful registration
            return {
                success: true,
                message: 'Account created successfully',
                user: {
                    id: Date.now(),
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName
                }
            };
        }
        
        if (endpoint === '/api/auth/google') {
            return {
                success: true,
                token: 'mock-google-jwt-token-' + Date.now(),
                user: data
            };
        }
        
        if (endpoint === '/api/auth/send-otp') {
            return {
                success: true,
                message: 'OTP sent successfully'
            };
        }
        
        if (endpoint === '/api/auth/verify-otp') {
            // Accept any 6-digit code for demo
            return {
                success: data.otp.length === 6,
                message: data.otp.length === 6 ? 'OTP verified' : 'Invalid OTP'
            };
        }
        
        return { success: false, message: 'Unknown endpoint' };
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Demo credentials info
console.log('🚀 SoftWire India Auth Demo');
console.log('Demo login credentials:');
console.log('Email: demo@softwireindia.com');
console.log('Password: Demo123!');
console.log('For OTP verification, enter any 6-digit code.');
