// Customer Dashboard JavaScript
class CustomerDashboard {
    constructor() {
        this.currentUser = null;
        this.selectedServices = new Map();
        this.services = [];
        this.orders = [];
        this.init();
    }

    async init() {
        // Wait for Firebase to initialize
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.loadUserProfile();
                this.loadServices();
                this.loadOrders();
            } else {
                // Redirect to login if not authenticated
                window.location.href = 'auth-simple.html';
            }
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Service request form
        document.getElementById('serviceRequestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitServiceRequest();
        });

        // Profile form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Support form
        document.getElementById('supportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitSupportRequest();
        });
    }

    async loadUserProfile() {
        try {
            const userDoc = await firebase.firestore().collection('users').doc(this.currentUser.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                document.getElementById('welcomeMessage').textContent = 
                    `Welcome back, ${userData.firstName || 'Valued Customer'}!`;
                document.getElementById('userEmail').textContent = this.currentUser.email;
                
                // Populate profile form
                document.getElementById('profileFirstName').value = userData.firstName || '';
                document.getElementById('profileLastName').value = userData.lastName || '';
                document.getElementById('profileEmail').value = this.currentUser.email;
                document.getElementById('profilePhone').value = userData.phone || '';
                document.getElementById('profileCompany').value = userData.company || '';
                document.getElementById('profileAddress').value = userData.address || '';
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.showNotification('Error loading profile data', 'error');
        }
    }

    async loadServices() {
        try {
            this.services = [
                // Web Solutions
                {
                    id: 'static-website',
                    title: 'Static Website Design',
                    category: 'Web Solutions',
                    price: '₹3,000 - ₹25,000',
                    priceMin: 3000,
                    priceMax: 25000,
                    billing: 'Per Project',
                    description: 'Professional static websites with modern design, responsive layout, and fast loading.'
                },
                {
                    id: 'dynamic-website',
                    title: 'Dynamic/Business Website',
                    category: 'Web Solutions',
                    price: '₹10,000 - ₹1,00,000',
                    priceMin: 10000,
                    priceMax: 100000,
                    billing: 'Per Project',
                    description: 'Feature-rich business websites with CMS, database integration, and admin panels.'
                },
                {
                    id: 'web-app',
                    title: 'Web Application Development',
                    category: 'Web Solutions',
                    price: '₹50,000 - ₹5,00,000',
                    priceMin: 50000,
                    priceMax: 500000,
                    billing: 'Per Project',
                    description: 'Custom web applications, portals, and SaaS solutions with advanced functionality.'
                },
                {
                    id: 'ecommerce',
                    title: 'E-Commerce Development',
                    category: 'Web Solutions',
                    price: '₹25,000 - ₹2,00,000',
                    priceMin: 25000,
                    priceMax: 200000,
                    billing: 'Per Project',
                    description: 'Complete e-commerce solutions with payment gateway, inventory management, and more.'
                },
                {
                    id: 'website-hosting',
                    title: 'Website Hosting',
                    category: 'Web Solutions',
                    price: '₹70 - ₹6,000/month',
                    priceMin: 70,
                    priceMax: 6000,
                    billing: 'Per Month',
                    description: 'Reliable hosting solutions from shared hosting to managed cloud infrastructure.'
                },

                // Mobile & Software
                {
                    id: 'mobile-basic',
                    title: 'Mobile App (Basic)',
                    category: 'Mobile & Software',
                    price: '₹50,000 - ₹1,50,000',
                    priceMin: 50000,
                    priceMax: 150000,
                    billing: 'Per Project',
                    description: 'Native Android/iOS apps with essential features and clean design.'
                },
                {
                    id: 'mobile-advanced',
                    title: 'Cross Platform App',
                    category: 'Mobile & Software',
                    price: '₹2,00,000 - ₹6,00,000',
                    priceMin: 200000,
                    priceMax: 600000,
                    billing: 'Per Project',
                    description: 'Advanced mobile apps with complex features, APIs, and cross-platform compatibility.'
                },
                {
                    id: 'mobile-enterprise',
                    title: 'Enterprise Mobile App',
                    category: 'Mobile & Software',
                    price: '₹7,00,000 - ₹20,00,000+',
                    priceMin: 700000,
                    priceMax: 2000000,
                    billing: 'Per Project',
                    description: 'Large-scale enterprise applications with advanced security and integration.'
                },

                // Digital Marketing
                {
                    id: 'seo-marketing',
                    title: 'SEO & Digital Marketing',
                    category: 'Digital Marketing',
                    price: '₹10,000 - ₹60,000/month',
                    priceMin: 10000,
                    priceMax: 60000,
                    billing: 'Per Month',
                    description: 'Complete digital marketing packages including SEO, content marketing, and social media.'
                },

                // Maintenance & Support
                {
                    id: 'maintenance',
                    title: 'Website/App Maintenance',
                    category: 'Maintenance & Support',
                    price: '₹2,500 - ₹30,000/month',
                    priceMin: 2500,
                    priceMax: 30000,
                    billing: 'Per Month',
                    description: 'Regular updates, security patches, backups, and technical support for your applications.'
                }
            ];

            this.renderServices();
        } catch (error) {
            console.error('Error loading services:', error);
            this.showNotification('Error loading services', 'error');
        }
    }

    renderServices() {
        const servicesGrid = document.getElementById('servicesGrid');
        servicesGrid.innerHTML = '';

        this.services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.setAttribute('data-service-id', service.id);
            
            serviceCard.innerHTML = `
                <div class="service-title">${service.title}</div>
                <div class="service-price">${service.price}</div>
                <div style="font-size: 0.9rem; color: var(--primary-color); margin-bottom: 10px;">
                    ${service.billing} • ${service.category}
                </div>
                <div class="service-description">${service.description}</div>
            `;

            serviceCard.addEventListener('click', () => this.toggleService(service));
            servicesGrid.appendChild(serviceCard);
        });
    }

    toggleService(service) {
        const serviceCard = document.querySelector(`[data-service-id="${service.id}"]`);
        
        if (this.selectedServices.has(service.id)) {
            this.selectedServices.delete(service.id);
            serviceCard.classList.remove('selected');
        } else {
            this.selectedServices.set(service.id, service);
            serviceCard.classList.add('selected');
        }

        this.updateSelectedServices();
    }

    updateSelectedServices() {
        const selectedServicesContainer = document.getElementById('selectedServices');
        const selectedServicesList = document.getElementById('selectedServicesList');
        const requirementsForm = document.getElementById('requirementsForm');

        if (this.selectedServices.size === 0) {
            selectedServicesContainer.style.display = 'none';
            requirementsForm.style.display = 'none';
            return;
        }

        selectedServicesContainer.style.display = 'block';
        requirementsForm.style.display = 'block';

        selectedServicesList.innerHTML = '';
        let totalMin = 0, totalMax = 0;

        this.selectedServices.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'selected-service-item';
            serviceItem.innerHTML = `
                <div>
                    <strong>${service.title}</strong>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">${service.billing}</div>
                </div>
                <div style="font-weight: 600; color: var(--primary-color);">${service.price}</div>
            `;
            selectedServicesList.appendChild(serviceItem);

            totalMin += service.priceMin;
            totalMax += service.priceMax;
        });

        const totalAmount = document.getElementById('totalAmount');
        totalAmount.textContent = `Estimated Total: ₹${totalMin.toLocaleString()} - ₹${totalMax.toLocaleString()}`;
    }

    async submitServiceRequest() {
        if (this.selectedServices.size === 0) {
            this.showNotification('Please select at least one service', 'error');
            return;
        }

        const formData = {
            projectTitle: document.getElementById('projectTitle').value,
            projectRequirements: document.getElementById('projectRequirements').value,
            expectedTimeline: document.getElementById('expectedTimeline').value,
            budgetRange: document.getElementById('budgetRange').value,
            additionalNotes: document.getElementById('additionalNotes').value
        };

        if (!formData.projectTitle || !formData.projectRequirements) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const orderData = {
                customerId: this.currentUser.uid,
                customerEmail: this.currentUser.email,
                services: Array.from(this.selectedServices.values()),
                ...formData,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                orderNumber: this.generateOrderNumber()
            };

            await firebase.firestore().collection('orders').add(orderData);

            // Clear form and selections
            document.getElementById('serviceRequestForm').reset();
            this.selectedServices.clear();
            this.updateSelectedServices();
            document.querySelectorAll('.service-card').forEach(card => {
                card.classList.remove('selected');
            });

            this.showNotification('Service request submitted successfully! We\'ll contact you soon.', 'success');
            this.loadOrders(); // Refresh orders list
            
        } catch (error) {
            console.error('Error submitting service request:', error);
            this.showNotification('Error submitting request. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadOrders() {
        try {
            const ordersQuery = await firebase.firestore()
                .collection('orders')
                .where('customerId', '==', this.currentUser.uid)
                .orderBy('createdAt', 'desc')
                .get();

            this.orders = ordersQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.renderOrders();
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showNotification('Error loading orders', 'error');
        }
    }

    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = '';

        if (this.orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet. Browse our services to get started!</p>
                    <button onclick="showTab('services')" class="btn-primary">Browse Services</button>
                </div>
            `;
            return;
        }

        this.orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            
            const createdDate = order.createdAt ? order.createdAt.toDate().toLocaleDateString() : 'N/A';
            const statusClass = `status-${order.status}`;
            
            orderCard.innerHTML = `
                <div class="order-header">
                    <div class="order-id">Order #${order.orderNumber}</div>
                    <div class="order-status ${statusClass}">${order.status}</div>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>${order.projectTitle}</strong>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        ${order.services.length} service(s) • Ordered on ${createdDate}
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Services:</strong>
                    <ul style="margin: 5px 0 0 20px; color: var(--text-secondary);">
                        ${order.services.map(service => `<li>${service.title}</li>`).join('')}
                    </ul>
                </div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                    ${order.projectRequirements.substring(0, 150)}${order.projectRequirements.length > 150 ? '...' : ''}
                </div>
                ${order.adminNotes ? `
                    <div style="margin-top: 15px; padding: 15px; background: var(--bg-tertiary); border-radius: 8px;">
                        <strong>Update from SoftWire India:</strong>
                        <div style="margin-top: 5px;">${order.adminNotes}</div>
                    </div>
                ` : ''}
            `;

            ordersList.appendChild(orderCard);
        });
    }

    async updateProfile() {
        this.showLoading(true);

        try {
            const profileData = {
                firstName: document.getElementById('profileFirstName').value,
                lastName: document.getElementById('profileLastName').value,
                phone: document.getElementById('profilePhone').value,
                company: document.getElementById('profileCompany').value,
                address: document.getElementById('profileAddress').value,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await firebase.firestore().collection('users').doc(this.currentUser.uid).update(profileData);
            
            this.showNotification('Profile updated successfully!', 'success');
            this.loadUserProfile(); // Refresh welcome message
            
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('Error updating profile. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async submitSupportRequest() {
        const formData = {
            subject: document.getElementById('supportSubject').value,
            priority: document.getElementById('supportPriority').value,
            message: document.getElementById('supportMessage').value
        };

        if (!formData.subject || !formData.message) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const supportData = {
                customerId: this.currentUser.uid,
                customerEmail: this.currentUser.email,
                ...formData,
                status: 'open',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                ticketNumber: this.generateTicketNumber()
            };

            await firebase.firestore().collection('supportTickets').add(supportData);
            
            document.getElementById('supportForm').reset();
            this.showNotification('Support request submitted successfully! We\'ll respond within 24 hours.', 'success');
            
        } catch (error) {
            console.error('Error submitting support request:', error);
            this.showNotification('Error submitting support request. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `SW${year}${month}${day}${random}`;
    }

    generateTicketNumber() {
        const date = new Date();
        const timestamp = date.getTime().toString().slice(-6);
        return `TK${timestamp}`;
    }

    refreshOrders() {
        this.loadOrders();
        this.showNotification('Orders refreshed', 'success');
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.querySelector('.dashboard-content').insertBefore(notification, document.querySelector('.dashboard-content').firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    async handleLogout() {
        try {
            await firebase.auth().signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
            this.showNotification('Error signing out', 'error');
        }
    }
}

// Tab Management
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked nav tab
    event.target.classList.add('active');
}

// Global functions
function refreshOrders() {
    if (window.dashboard) {
        window.dashboard.refreshOrders();
    }
}

function handleLogout() {
    if (window.dashboard) {
        window.dashboard.handleLogout();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new CustomerDashboard();
});