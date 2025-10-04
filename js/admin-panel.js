// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.orders = [];
        this.customers = [];
        this.supportTickets = [];
        this.filteredOrders = [];
        this.filteredCustomers = [];
        this.filteredSupport = [];
        this.init();
    }

    async init() {
        // Check authentication and admin privileges
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                // Check if user is admin
                const isAdmin = await this.checkAdminPrivileges(user);
                if (isAdmin) {
                    this.currentUser = user;
                    this.loadDashboardData();
                } else {
                    alert('Access denied. Admin privileges required.');
                    window.location.href = 'auth-simple.html';
                }
            } else {
                window.location.href = 'auth-simple.html';
            }
        });
    }

    async checkAdminPrivileges(user) {
        try {
            // For now, check if email is admin email
            // In production, use custom claims or admin role in Firestore
            const adminEmails = ['shuvendu.29@gmail.com', 'admin@softwireindia.com'];
            return adminEmails.includes(user.email);
        } catch (error) {
            console.error('Error checking admin privileges:', error);
            return false;
        }
    }

    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadOrders(),
                this.loadCustomers(),
                this.loadSupportTickets()
            ]);
            this.updateStatistics();
            this.calculateAnalytics();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadOrders() {
        try {
            const ordersQuery = await firebase.firestore()
                .collection('orders')
                .orderBy('createdAt', 'desc')
                .get();

            this.orders = ordersQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.filteredOrders = [...this.orders];
            this.renderOrders();
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    async loadCustomers() {
        try {
            const customersQuery = await firebase.firestore()
                .collection('users')
                .get();

            this.customers = customersQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.filteredCustomers = [...this.customers];
            this.renderCustomers();
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    }

    async loadSupportTickets() {
        try {
            const supportQuery = await firebase.firestore()
                .collection('supportTickets')
                .orderBy('createdAt', 'desc')
                .get();

            this.supportTickets = supportQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.filteredSupport = [...this.supportTickets];
            this.renderSupportTickets();
        } catch (error) {
            console.error('Error loading support tickets:', error);
        }
    }

    renderOrders() {
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = '';

        if (this.filteredOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredOrders.forEach(order => {
            const row = document.createElement('tr');
            const createdDate = order.createdAt ? order.createdAt.toDate().toLocaleDateString() : 'N/A';
            const statusClass = `status-${order.status}`;
            
            row.innerHTML = `
                <td><strong>#${order.orderNumber}</strong></td>
                <td>${order.customerEmail}</td>
                <td>${order.projectTitle}</td>
                <td>${order.services ? order.services.length : 0} service(s)</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>${createdDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small btn-view" onclick="viewOrder('${order.id}')">
                            👁️ View
                        </button>
                        <button class="btn-small btn-update" onclick="updateOrderStatus('${order.id}')">
                            📝 Update
                        </button>
                        <button class="btn-small btn-contact" onclick="contactCustomer('${order.customerEmail}')">
                            📧 Contact
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    renderCustomers() {
        const grid = document.getElementById('customersGrid');
        grid.innerHTML = '';

        if (this.filteredCustomers.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                    No customers found
                </div>
            `;
            return;
        }

        this.filteredCustomers.forEach(customer => {
            const customerOrders = this.orders.filter(order => order.customerId === customer.id);
            const card = document.createElement('div');
            card.className = 'customer-card';
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${customer.firstName || 'N/A'} ${customer.lastName || ''}</h3>
                        <p style="margin: 0; color: var(--text-secondary);">${customer.email || 'No email'}</p>
                    </div>
                    <span style="background: var(--primary-color); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                        ${customerOrders.length} orders
                    </span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${customer.phone || 'Not provided'}</p>
                    <p style="margin: 5px 0;"><strong>Company:</strong> ${customer.company || 'Not provided'}</p>
                    <p style="margin: 5px 0;"><strong>Joined:</strong> ${customer.createdAt ? customer.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                </div>
                
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewCustomerOrders('${customer.id}')">
                        📋 Orders
                    </button>
                    <button class="btn-small btn-contact" onclick="contactCustomer('${customer.email}')">
                        📧 Contact
                    </button>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    renderSupportTickets() {
        const tbody = document.getElementById('supportTableBody');
        tbody.innerHTML = '';

        if (this.filteredSupport.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        No support tickets found
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredSupport.forEach(ticket => {
            const row = document.createElement('tr');
            const createdDate = ticket.createdAt ? ticket.createdAt.toDate().toLocaleDateString() : 'N/A';
            const statusClass = `status-${ticket.status}`;
            const priorityClass = `priority-${ticket.priority}`;
            
            row.innerHTML = `
                <td><strong>#${ticket.ticketNumber}</strong></td>
                <td>${ticket.customerEmail}</td>
                <td>${ticket.subject}</td>
                <td><span class="${priorityClass}">${ticket.priority.toUpperCase()}</span></td>
                <td><span class="status-badge ${statusClass}">${ticket.status}</span></td>
                <td>${createdDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small btn-view" onclick="viewSupportTicket('${ticket.id}')">
                            👁️ View
                        </button>
                        <button class="btn-small btn-update" onclick="updateTicketStatus('${ticket.id}')">
                            📝 Update
                        </button>
                        <button class="btn-small btn-contact" onclick="contactCustomer('${ticket.customerEmail}')">
                            📧 Reply
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    updateStatistics() {
        document.getElementById('totalOrders').textContent = this.orders.length;
        document.getElementById('pendingOrders').textContent = 
            this.orders.filter(order => order.status === 'pending').length;
        document.getElementById('totalCustomers').textContent = this.customers.length;
        document.getElementById('supportTickets').textContent = this.supportTickets.length;
    }

    calculateAnalytics() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Monthly orders
        const monthlyOrders = this.orders.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = order.createdAt.toDate();
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        
        document.getElementById('monthlyOrders').textContent = monthlyOrders.length;
        
        // Calculate estimated revenue (rough calculation)
        let totalRevenue = 0;
        monthlyOrders.forEach(order => {
            if (order.services) {
                order.services.forEach(service => {
                    totalRevenue += service.priceMin || 0;
                });
            }
        });
        
        document.getElementById('monthlyRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
        
        // Conversion rate (rough calculation)
        const conversionRate = this.customers.length > 0 ? 
            ((this.orders.length / this.customers.length) * 100).toFixed(1) : 0;
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;
        
        // Average order value
        const avgOrderValue = this.orders.length > 0 ? (totalRevenue / this.orders.length).toFixed(0) : 0;
        document.getElementById('avgOrderValue').textContent = `₹${avgOrderValue}`;
        
        // Popular services
        this.calculatePopularServices();
    }

    calculatePopularServices() {
        const serviceCount = {};
        
        this.orders.forEach(order => {
            if (order.services) {
                order.services.forEach(service => {
                    serviceCount[service.title] = (serviceCount[service.title] || 0) + 1;
                });
            }
        });
        
        const popularServices = Object.entries(serviceCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        const popularServicesContainer = document.getElementById('popularServices');
        popularServicesContainer.innerHTML = '';
        
        if (popularServices.length === 0) {
            popularServicesContainer.innerHTML = '<p>No service data available yet.</p>';
            return;
        }
        
        popularServices.forEach(([service, count]) => {
            const serviceItem = document.createElement('div');
            serviceItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--bg-tertiary);';
            serviceItem.innerHTML = `
                <span>${service}</span>
                <span style="font-weight: 600; color: var(--primary-color);">${count} orders</span>
            `;
            popularServicesContainer.appendChild(serviceItem);
        });
    }

    filterOrders() {
        const statusFilter = document.getElementById('statusFilter').value;
        
        this.filteredOrders = this.orders.filter(order => {
            return !statusFilter || order.status === statusFilter;
        });
        
        this.renderOrders();
    }

    searchOrders() {
        const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
        
        this.filteredOrders = this.orders.filter(order => {
            return !searchTerm || 
                order.orderNumber.toLowerCase().includes(searchTerm) ||
                order.customerEmail.toLowerCase().includes(searchTerm) ||
                order.projectTitle.toLowerCase().includes(searchTerm);
        });
        
        this.renderOrders();
    }

    searchCustomers() {
        const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
        
        this.filteredCustomers = this.customers.filter(customer => {
            return !searchTerm ||
                (customer.firstName && customer.firstName.toLowerCase().includes(searchTerm)) ||
                (customer.lastName && customer.lastName.toLowerCase().includes(searchTerm)) ||
                (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
                (customer.company && customer.company.toLowerCase().includes(searchTerm));
        });
        
        this.renderCustomers();
    }

    filterSupport() {
        const statusFilter = document.getElementById('supportStatusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        
        this.filteredSupport = this.supportTickets.filter(ticket => {
            return (!statusFilter || ticket.status === statusFilter) &&
                   (!priorityFilter || ticket.priority === priorityFilter);
        });
        
        this.renderSupportTickets();
    }

    async viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderModal');
        const title = document.getElementById('modalOrderTitle');
        const content = document.getElementById('modalOrderContent');

        title.textContent = `Order #${order.orderNumber}`;
        
        const createdDate = order.createdAt ? order.createdAt.toDate().toLocaleString() : 'N/A';
        const updatedDate = order.updatedAt ? order.updatedAt.toDate().toLocaleString() : 'N/A';
        
        content.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3>Order Information</h3>
                <p><strong>Customer:</strong> ${order.customerEmail}</p>
                <p><strong>Project Title:</strong> ${order.projectTitle}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
                <p><strong>Created:</strong> ${createdDate}</p>
                <p><strong>Last Updated:</strong> ${updatedDate}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Services Requested</h3>
                <ul>
                    ${order.services ? order.services.map(service => `
                        <li><strong>${service.title}</strong> - ${service.price}</li>
                    `).join('') : 'No services listed'}
                </ul>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Project Requirements</h3>
                <p style="background: var(--bg-tertiary); padding: 15px; border-radius: 8px;">
                    ${order.projectRequirements || 'No requirements specified'}
                </p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Project Details</h3>
                <p><strong>Expected Timeline:</strong> ${order.expectedTimeline || 'Not specified'}</p>
                <p><strong>Budget Range:</strong> ${order.budgetRange || 'Not specified'}</p>
                <p><strong>Additional Notes:</strong> ${order.additionalNotes || 'None'}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Update Order Status</h3>
                <select id="newOrderStatus" class="form-select" style="margin-bottom: 10px; width: 200px;">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in-progress" ${order.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <br>
                <textarea id="adminNotes" class="form-textarea" placeholder="Add notes for customer..." 
                          style="margin-bottom: 10px;">${order.adminNotes || ''}</textarea>
                <br>
                <button class="btn-primary" onclick="saveOrderUpdate('${orderId}')">
                    💾 Save Update
                </button>
            </div>
        `;

        modal.style.display = 'flex';
    }

    async saveOrderUpdate(orderId) {
        const newStatus = document.getElementById('newOrderStatus').value;
        const adminNotes = document.getElementById('adminNotes').value;

        try {
            await firebase.firestore().collection('orders').doc(orderId).update({
                status: newStatus,
                adminNotes: adminNotes,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Reload orders
            await this.loadOrders();
            this.updateStatistics();
            
            this.closeOrderModal();
            alert('Order updated successfully!');
            
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Error updating order. Please try again.');
        }
    }

    closeOrderModal() {
        document.getElementById('orderModal').style.display = 'none';
    }

    contactCustomer(email) {
        window.location.href = `mailto:${email}?subject=Regarding your SoftWire India project`;
    }

    refreshOrders() {
        this.loadOrders();
    }

    refreshCustomers() {
        this.loadCustomers();
    }

    refreshSupport() {
        this.loadSupportTickets();
    }

    async handleLogout() {
        try {
            await firebase.auth().signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }
}

// Global functions
function showAdminTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked nav tab
    event.target.classList.add('active');
}

function viewOrder(orderId) {
    if (window.adminPanel) {
        window.adminPanel.viewOrder(orderId);
    }
}

function updateOrderStatus(orderId) {
    viewOrder(orderId);
}

function contactCustomer(email) {
    if (window.adminPanel) {
        window.adminPanel.contactCustomer(email);
    }
}

function saveOrderUpdate(orderId) {
    if (window.adminPanel) {
        window.adminPanel.saveOrderUpdate(orderId);
    }
}

function closeOrderModal() {
    if (window.adminPanel) {
        window.adminPanel.closeOrderModal();
    }
}

function filterOrders() {
    if (window.adminPanel) {
        window.adminPanel.filterOrders();
    }
}

function searchOrders() {
    if (window.adminPanel) {
        window.adminPanel.searchOrders();
    }
}

function searchCustomers() {
    if (window.adminPanel) {
        window.adminPanel.searchCustomers();
    }
}

function filterSupport() {
    if (window.adminPanel) {
        window.adminPanel.filterSupport();
    }
}

function refreshOrders() {
    if (window.adminPanel) {
        window.adminPanel.refreshOrders();
    }
}

function refreshCustomers() {
    if (window.adminPanel) {
        window.adminPanel.refreshCustomers();
    }
}

function refreshSupport() {
    if (window.adminPanel) {
        window.adminPanel.refreshSupport();
    }
}

function handleAdminLogout() {
    if (window.adminPanel) {
        window.adminPanel.handleLogout();
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});