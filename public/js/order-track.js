// Order Tracking JavaScript - Simplified & Fixed Version
class OrderTracker {
    constructor() {
        // Don't auto-initialize - we'll call init() manually
    }

    init() {
        console.log('OrderTracker initialized');
        
        // Determine which page we're on and initialize accordingly
        if (window.location.pathname === '/order-track') {
            this.initTrackPage();
        } else if (window.location.pathname === '/order-tracking') {
            this.initTrackingPage();
        }
    }

    // Initialize the track order form page
    initTrackPage() {
        console.log('Initializing order track page');
        this.setupTrackForm();
        this.checkForSavedOrder();
    }

    // Initialize the tracking results page
    initTrackingPage() {
        console.log('Initializing order tracking results page');
        this.loadOrderData();
    }

    setupTrackForm() {
        const form = document.getElementById('trackOrderForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleTrackOrder(e));
        }

        // Check URL for pre-filled order number
        const urlParams = new URLSearchParams(window.location.search);
        const orderNumber = urlParams.get('order');
        if (orderNumber) {
            const orderNumberInput = document.getElementById('orderNumber');
            if (orderNumberInput) {
                orderNumberInput.value = orderNumber;
            }
        }
    }

    checkForSavedOrder() {
        try {
            // Check for last order from checkout
            const lastOrderNumber = sessionStorage.getItem('lastOrderNumber');
            if (lastOrderNumber) {
                const orderNumberInput = document.getElementById('orderNumber');
                if (orderNumberInput) {
                    orderNumberInput.value = lastOrderNumber;
                }
                sessionStorage.removeItem('lastOrderNumber');
            }
        } catch (error) {
            console.error('Error checking saved order:', error);
        }
    }

    async handleTrackOrder(e) {
        e.preventDefault();
        
        // Get form data
        const orderNumber = document.getElementById('orderNumber')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        
        // Validate
        if (!orderNumber) {
            this.showError('Please enter your order number');
            return;
        }

        // Basic validation
        if (!orderNumber.match(/^CIL-[A-Z0-9-]+$/i)) {
            this.showError('Please enter a valid order number (format: CIL-XXXXXX-XXX)');
            return;
        }

        await this.fetchAndRedirect(orderNumber, email, phone);
    }

    async fetchAndRedirect(orderNumber, email, phone) {
        const trackBtn = document.getElementById('trackBtn');
        const btnText = document.getElementById('btnText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('errorMessage');

        // Show loading state
        if (trackBtn) {
            trackBtn.disabled = true;
            btnText.textContent = 'Tracking...';
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';
        }

        try {
            const response = await fetch('/api/order/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber,
                    email: email || undefined,
                    phone: phone || undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store order data in session storage
                sessionStorage.setItem('trackedOrder', JSON.stringify(data.order));
                
                // Redirect to tracking results page
                window.location.href = `/order-tracking?order=${encodeURIComponent(orderNumber)}`;
            } else {
                this.showError(data.message || 'Order not found. Please check your details.');
            }
        } catch (error) {
            console.error('Tracking error:', error);
            this.showError('Network error. Please check your connection and try again.');
        } finally {
            // Reset button
            if (trackBtn) {
                trackBtn.disabled = false;
                btnText.textContent = 'Track Order';
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            }
        }
    }

    async loadOrderData() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderNumber = urlParams.get('order');
        
        if (!orderNumber) {
            // Try to get from session storage
            try {
                const storedOrder = sessionStorage.getItem('trackedOrder');
                if (storedOrder) {
                    this.displayOrder(JSON.parse(storedOrder));
                    sessionStorage.removeItem('trackedOrder');
                    return;
                }
            } catch (error) {
                console.error('Error parsing stored order:', error);
            }
            
            this.showError('No order specified');
            return;
        }
        
        // Fetch order from server
        await this.fetchOrder(orderNumber);
    }

    async fetchOrder(orderNumber) {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        
        if (loadingState) {
            loadingState.style.display = 'block';
        }
        if (errorState) {
            errorState.style.display = 'none';
        }

        try {
            const response = await fetch('/api/order/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderNumber })
            });

            const data = await response.json();

            if (data.success) {
                this.displayOrder(data.order);
            } else {
                this.showError(data.message || 'Order not found');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            this.showError('Unable to load order details. Please try again.');
        } finally {
            if (loadingState) {
                loadingState.style.display = 'none';
            }
        }
    }

    displayOrder(order) {
        const loadingState = document.getElementById('loadingState');
        const orderContent = document.getElementById('orderContent');
        const errorState = document.getElementById('errorState');

        if (!orderContent) return;

        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
        
        orderContent.style.display = 'block';

        // Format date
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Status configuration
        const statusConfig = {
            'pending': { class: 'status-pending', text: 'Pending' },
            'processing': { class: 'status-processing', text: 'Processing' },
            'shipped': { class: 'status-shipped', text: 'Shipped' },
            'delivered': { class: 'status-delivered', text: 'Delivered' },
            'cancelled': { class: 'status-cancelled', text: 'Cancelled' }
        };

        const status = statusConfig[order.status] || statusConfig.pending;

        // Build timeline
        const timelineHTML = this.buildTimeline(order);

        // Build items list
        const itemsHTML = this.buildItemsList(order);

        // Build order HTML
        orderContent.innerHTML = `
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/order-track" class="back-link">
                            <i class="fas fa-arrow-left"></i>
                            <span>Track Another Order</span>
                        </a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Order Tracking</li>
                </ol>
            </nav>
            
            <div class="order-header">
                <div>
                    <h1 class="order-number">Order #${order.orderNumber}</h1>
                    <div class="order-meta">
                        <span class="order-date"><i class="far fa-calendar"></i> Placed on ${orderDate}</span>
                    </div>
                </div>
                <div class="status-badge ${status.class}">
                    <i class="fas fa-circle"></i> ${status.text}
                </div>
            </div>
            
            <div class="order-progress-bar" aria-label="Order progress">
                <div class="progress-fill" style="width: ${this.calculateProgress(order.status)}%"></div>
            </div>
            
            <div class="status-container">
                <h2><i class="fas fa-history"></i> Order Status Timeline</h2>
                <div class="timeline">
                    ${timelineHTML}
                </div>
            </div>
            
            <div class="order-details-grid">
                <div class="detail-card customer-info">
                    <h3><i class="fas fa-user"></i> Customer Information</h3>
                    <p class="customer-name">${order.customerName}</p>
                    ${order.customerEmail ? `<p class="customer-email"><i class="fas fa-envelope"></i> ${order.customerEmail}</p>` : ''}
                    ${order.customerPhone ? `<p class="customer-phone"><i class="fas fa-phone"></i> ${order.customerPhone}</p>` : ''}
                </div>
                
                ${order.customerAddress ? `
                <div class="detail-card delivery-info">
                    <h3><i class="fas fa-map-marker-alt"></i> Delivery Address</h3>
                    <p class="delivery-address">${order.customerAddress}</p>
                </div>
                ` : ''}
                
                ${order.estimatedDelivery ? `
                <div class="detail-card estimated-delivery">
                    <div class="delivery-icon">
                        <i class="fas fa-shipping-fast"></i>
                    </div>
                    <h3>Estimated Delivery</h3>
                    <p class="delivery-date">${new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}</p>
                    <p class="delivery-note">Our team will contact you for delivery details</p>
                </div>
                ` : ''}
            </div>
            
            <div class="order-items-section">
                <h2><i class="fas fa-box-open"></i> Order Items</h2>
                <div class="items-list">
                    ${itemsHTML}
                </div>
                <div class="total-row">
                    <span>Total Amount:</span>
                    <span class="total-amount">₦${order.total.toLocaleString()}</span>
                </div>
            </div>
            
            ${order.notes ? `
            <div class="order-notes">
                <h3><i class="fas fa-sticky-note"></i> Order Notes</h3>
                <div class="notes-content">${order.notes}</div>
            </div>
            ` : ''}
            
            <div class="order-actions-bar">
                <div class="tracking-actions">
                    <button onclick="window.print()" class="btn btn-primary print-btn">
                        <i class="fas fa-print"></i> Print Details
                    </button>
                    <a href="/contact?subject=Order%20${order.orderNumber}" class="btn btn-secondary">
                        <i class="fas fa-headset"></i> Contact Support
                    </a>
                    <button onclick="location.reload()" class="btn btn-outline refresh-btn">
                        <i class="fas fa-sync-alt"></i> Refresh Status
                    </button>
                </div>
            </div>
        `;

        // Add fade-in animation
        setTimeout(() => {
            orderContent.style.opacity = '1';
            orderContent.style.transform = 'translateY(0)';
        }, 50);
    }

    buildTimeline(order) {
        const statusUpdates = order.statusUpdates || [
            {
                status: 'pending',
                title: 'Order Placed',
                description: 'Your order has been received and is being processed.',
                date: order.createdAt,
                completed: true
            }
        ];

        let timelineHTML = '';
        
        statusUpdates.forEach((update, index) => {
            const updateDate = new Date(update.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const isActive = index === statusUpdates.length - 1;
            const isCompleted = update.completed || index < statusUpdates.length - 1;
            const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'pending';
            
            timelineHTML += `
                <div class="timeline-item ${statusClass}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h3 class="timeline-title">${update.title}</h3>
                            <span class="timeline-date"><i class="far fa-clock"></i> ${updateDate}</span>
                        </div>
                        <p class="timeline-description">${update.description}</p>
                    </div>
                </div>
            `;
        });

        return timelineHTML;
    }

    buildItemsList(order) {
        return order.items.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="item-row">
                    <div class="item-name">
                        <span class="item-index">${index + 1}.</span>
                        ${item.name}
                    </div>
                    <div class="item-quantity">
                        <span class="quantity-badge">${item.quantity}x</span>
                    </div>
                    <div class="item-price">₦${itemTotal.toLocaleString()}</div>
                </div>
            `;
        }).join('');
    }

    calculateProgress(status) {
        const progressMap = {
            'pending': 25,
            'processing': 50,
            'shipped': 75,
            'delivered': 100,
            'cancelled': 0
        };
        return progressMap[status] || 0;
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
        
        // Also show on tracking page if applicable
        const errorState = document.getElementById('errorState');
        if (errorState) {
            const errorText = errorState.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
            errorState.style.display = 'block';
        }
    }

    showSuccess(message) {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize order tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize the order tracker
    window.orderTracker = new OrderTracker();
    window.orderTracker.init();
    
    // Add debug logging
    console.log('OrderTracker initialized for path:', window.location.pathname);
    
    // Test API connectivity
    console.log('Testing API connectivity...');
    fetch('/health')
        .then(response => response.json())
        .then(data => console.log('API Health:', data.status))
        .catch(error => console.warn('API Health check failed:', error));
});

// Make functions available globally
window.showOrderError = function(message) {
    const tracker = window.orderTracker;
    if (tracker) {
        tracker.showError(message);
    }
};

window.showOrderSuccess = function(message) {
    const tracker = window.orderTracker;
    if (tracker) {
        tracker.showSuccess(message);
    }
};