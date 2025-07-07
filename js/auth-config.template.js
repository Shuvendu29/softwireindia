// Google OAuth Configuration Template
// Copy this file to auth-config.js and update with your credentials

const AUTH_CONFIG = {
    // Replace with your actual Google OAuth Client ID
    // Get this from: https://console.cloud.google.com/apis/credentials
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    
    // Your domain configuration
    DOMAIN: 'softwireindia.com',
    
    // API endpoints (for future backend integration)
    API_BASE_URL: 'https://api.softwireindia.com',
    
    // OAuth settings
    OAUTH_SCOPES: 'profile email',
    
    // Feature flags
    FEATURES: {
        GOOGLE_OAUTH: true,
        PHONE_VERIFICATION: true,
        PASSWORD_STRENGTH: true,
        REMEMBER_ME: true
    },
    
    // UI settings
    UI: {
        SHOW_SOCIAL_LOGIN: true,
        SHOW_PHONE_FIELD: true,
        ENABLE_ANIMATIONS: true,
        PARTICLE_EFFECTS: true
    },
    
    // Validation rules
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 8,
        PHONE_FORMAT: 'US', // US, INTERNATIONAL, etc.
        EMAIL_DOMAIN_RESTRICTION: false, // Set to ['gmail.com', 'company.com'] to restrict
        REQUIRE_PHONE_VERIFICATION: true
    },
    
    // Messages
    MESSAGES: {
        LOGIN_SUCCESS: 'Welcome back to SoftWire India!',
        REGISTER_SUCCESS: 'Account created successfully!',
        OTP_SENT: 'Verification code sent to your phone',
        INVALID_OTP: 'Invalid verification code. Please try again.',
        GOOGLE_AUTH_ERROR: 'Google authentication failed. Please try again.'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AUTH_CONFIG;
}

// Make available globally
window.AUTH_CONFIG = AUTH_CONFIG;
