// User Profile Manager for SoftWire India
// Handles user profile data and dashboard functionality

class UserProfileManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.init();
    }

    init() {
        this.setupProfileListeners();
        this.loadUserProfile();
    }

    setupProfileListeners() {
        // Listen for auth state changes
        if (window.firebaseAuth) {
            window.firebaseAuth.onAuthStateChanged((user) => {
                if (user && user.emailVerified) {
                    this.loadUserProfile();
                    this.updateUIForLoggedInUser(user);
                } else {
                    this.updateUIForLoggedOutUser();
                }
            });
        }
    }

    async loadUserProfile() {
        if (!this.authManager.currentUser) return;

        try {
            const profile = await this.authManager.getUserProfile(this.authManager.currentUser.uid);
            this.displayUserInfo(profile);
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    displayUserInfo(profile) {
        // Update navigation with user info
        this.updateNavigation(profile);
        
        // Show welcome message if on home page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.showWelcomeMessage(profile);
        }
    }

    updateNavigation(profile) {
        // Find auth buttons in navigation
        const authButtons = document.querySelectorAll('.auth-btn, .cta-button');
        
        authButtons.forEach(btn => {
            if (btn.textContent.includes('Login') || btn.textContent.includes('Get Started')) {
                btn.textContent = `Welcome, ${profile.firstName || 'User'}!`;
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.showUserMenu(e.target);
                };
            }
        });
    }

    showWelcomeMessage(profile) {
        // Create welcome banner for logged-in users
        const existingBanner = document.getElementById('welcomeBanner');
        if (existingBanner) existingBanner.remove();

        const banner = document.createElement('div');
        banner.id = 'welcomeBanner';
        banner.className = 'welcome-banner';
        banner.innerHTML = `
            <div class="welcome-content">
                <h3>Welcome back, ${profile.firstName}! 👋</h3>
                <p>You're logged into your SoftWire India account.</p>
                <div class="welcome-actions">
                    <button onclick="userProfile.showDashboard()" class="btn-primary">View Dashboard</button>
                    <button onclick="authManager.logout()" class="btn-secondary">Logout</button>
                </div>
            </div>
            <button onclick="this.parentElement.remove()" class="close-btn">×</button>
        `;

        // Insert banner after hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.parentNode.insertBefore(banner, hero.nextSibling);
        }
    }

    showUserMenu(element) {
        // Create user dropdown menu
        const existingMenu = document.getElementById('userMenu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'userMenu';
        menu.className = 'user-menu';
        menu.innerHTML = `
            <div class="user-menu-content">
                <div class="user-info">
                    <div class="user-avatar">${this.authManager.currentUser?.displayName?.charAt(0) || 'U'}</div>
                    <div class="user-details">
                        <div class="user-name">${this.authManager.currentUser?.displayName || 'User'}</div>
                        <div class="user-email">${this.authManager.currentUser?.email}</div>
                    </div>
                </div>
                <div class="menu-divider"></div>
                <button onclick="userProfile.showProfile()" class="menu-item">
                    👤 View Profile
                </button>
                <button onclick="userProfile.showDashboard()" class="menu-item">
                    📊 Dashboard
                </button>
                <button onclick="userProfile.showSettings()" class="menu-item">
                    ⚙️ Settings
                </button>
                <div class="menu-divider"></div>
                <button onclick="authManager.logout()" class="menu-item logout">
                    🚪 Logout
                </button>
            </div>
        `;

        // Position menu near clicked element
        const rect = element.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = (rect.bottom + 10) + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';

        document.body.appendChild(menu);

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && e.target !== element) {
                    menu.remove();
                }
            }, { once: true });
        }, 100);
    }

    updateUIForLoggedInUser(user) {
        // Hide auth buttons, show user menu
        document.body.classList.add('user-logged-in');
    }

    updateUIForLoggedOutUser() {
        // Show auth buttons, hide user menu
        document.body.classList.remove('user-logged-in');
        const banner = document.getElementById('welcomeBanner');
        if (banner) banner.remove();
        const menu = document.getElementById('userMenu');
        if (menu) menu.remove();
    }

    async updateProfile(updates) {
        if (!this.authManager.currentUser) return;

        try {
            await this.authManager.updateUserProfile(this.authManager.currentUser.uid, updates);
            this.loadUserProfile(); // Refresh profile data
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error };
        }
    }

    showProfile() {
        // Create profile modal/page
        console.log('Showing user profile...');
        // Implementation for profile view
    }

    showDashboard() {
        // Navigate to user dashboard
        console.log('Showing user dashboard...');
        // Implementation for dashboard
    }

    showSettings() {
        // Show user settings
        console.log('Showing user settings...');
        // Implementation for settings
    }

    // Analytics and tracking
    trackUserActivity(activity) {
        if (window.firebaseAnalytics && this.authManager.currentUser) {
            window.firebaseAnalytics.logEvent('user_activity', {
                activity: activity,
                user_id: this.authManager.currentUser.uid
            });
        }
    }

    // Save user preferences
    async saveUserPreferences(preferences) {
        if (!this.authManager.currentUser) return;

        try {
            await window.firebaseDB.collection('users')
                .doc(this.authManager.currentUser.uid)
                .update({
                    preferences: preferences,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    }
}

// Initialize when DOM is loaded and AuthManager is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for AuthManager to be initialized
    const initUserProfile = () => {
        if (window.authManager) {
            window.userProfile = new UserProfileManager(window.authManager);
        } else {
            setTimeout(initUserProfile, 100);
        }
    };
    
    initUserProfile();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserProfileManager;
}