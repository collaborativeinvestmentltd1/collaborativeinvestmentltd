// order-track.js - Order Tracking Form Page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Order Track page initialized');
    
    // Initialize OrderTracker
    window.orderTracker = new OrderTracker();
    window.orderTracker.init();
});

class OrderTracker {
    constructor() {
        // Don't auto-initialize - we'll call init() manually
    }

    init() {
        console.log('OrderTracker initialized');
        
        // Determine which page we're on and initialize accordingly
        if (window.location.pathname === '/order-track' || window.location.pathname.includes('order-track')) {
            this.initTrackPage();
        }
    }

    // Initialize the track order form page
    initTrackPage() {
        console.log('Initializing order track page');
        this.setupTrackForm();
        this.checkForSavedOrder();
        this.setupQuickLinks();
    }

    setupQuickLinks() {
        // Setup sample order links for testing
        document.querySelectorAll('.sample-order-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const orderNumber = link.dataset.order;
                const orderNumberInput = document.getElementById('orderNumber');
                if (orderNumberInput) {
                    orderNumberInput.value = orderNumber;
                }
                // Optionally auto-submit
                // const form = document.getElementById('trackOrderForm');
                // if (form) form.submit();
            });
        });
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
                orderNumberInput.value = this.normalizeOrderNumber(orderNumber);
            }
        }

        // Setup clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const orderNumberInput = document.getElementById('orderNumber');
                const emailInput = document.getElementById('email');
                const phoneInput = document.getElementById('phone');
                
                if (orderNumberInput) orderNumberInput.value = '';
                if (emailInput) emailInput.value = '';
                if (phoneInput) phoneInput.value = '';
                
                const errorMsg = document.getElementById('errorMessage');
                if (errorMsg) errorMsg.style.display = 'none';
            });
        }
    }

    checkForSavedOrder() {
        try {
            // Check for last order from checkout
            const lastOrderNumber = sessionStorage.getItem('lastOrderNumber');
            if (lastOrderNumber) {
                const orderNumberInput = document.getElementById('orderNumber');
                if (orderNumberInput) {
                    orderNumberInput.value = this.normalizeOrderNumber(lastOrderNumber);
                }
                sessionStorage.removeItem('lastOrderNumber');
            }
        } catch (error) {
            console.error('Error checking saved order:', error);
        }
    }

    normalizeOrderNumber(orderNumber) {
        if (!orderNumber) return '';
        
        let clean = orderNumber.toUpperCase().trim();
        
        // Handle various formats
        if (clean.includes('-')) {
            const parts = clean.split('-').filter(p => p);
            
            // Format: 367193-944 (without CIL prefix)
            if (parts.length === 2 && parts[0].length === 6 && parts[1].length === 3) {
                const currentYear = new Date().getFullYear();
                return `CIL-${currentYear}-${parts[0]}`;
            }
            
            // Format: CIL-367193-944
            if (parts.length === 3 && parts[0] === 'CIL' && parts[1].length === 6 && parts[2].length === 3) {
                const currentYear = new Date().getFullYear();
                return `CIL-${currentYear}-${parts[1]}`;
            }
        }
        
        // Add CIL prefix if missing
        if (!clean.startsWith('CIL')) {
            clean = 'CIL-' + clean;
        }
        
        return clean;
    }

    async handleTrackOrder(e) {
        e.preventDefault();
        
        // Get form data
        let orderNumber = document.getElementById('orderNumber')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        
        // Validate
        if (!orderNumber) {
            this.showError('Please enter your order number');
            return;
        }

        // Normalize order number
        orderNumber = this.normalizeOrderNumber(orderNumber);
        
        // Update the input field
        const orderNumberInput = document.getElementById('orderNumber');
        if (orderNumberInput) {
            orderNumberInput.value = orderNumber;
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
            // First try direct fetch
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

            if (!response.ok) {
                throw new Error('Server error');
            }

            const data = await response.json();

            if (data.success) {
                // Store order data in session storage
                sessionStorage.setItem('trackedOrder', JSON.stringify(data.order));
                
                // Redirect to tracking results page
                window.location.href = `/order-tracking?order=${encodeURIComponent(orderNumber)}`;
            } else {
                // Check if it's a demo order
                if (orderNumber.includes('DEMO') || orderNumber.includes('TEST')) {
                    // Create demo order data
                    const demoOrder = this.createDemoOrder(orderNumber, email, phone);
                    sessionStorage.setItem('trackedOrder', JSON.stringify(demoOrder));
                    window.location.href = `/order-tracking?order=${encodeURIComponent(orderNumber)}`;
                } else {
                    this.showError(data.message || 'Order not found. Please check your details.');
                }
            }
        } catch (error) {
            console.error('Tracking error:', error);
            
            // Fallback: Check for demo orders
            if (orderNumber.includes('DEMO') || orderNumber.includes('TEST')) {
                const demoOrder = this.createDemoOrder(orderNumber, email, phone);
                sessionStorage.setItem('trackedOrder', JSON.stringify(demoOrder));
                window.location.href = `/order-tracking?order=${encodeURIComponent(orderNumber)}`;
            } else {
                this.showError('Network error. Please check your connection and try again.');
            }
        } finally {
            // Reset button
            if (trackBtn) {
                trackBtn.disabled = false;
                btnText.textContent = 'Track Order';
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            }
        }
    }

    createDemoOrder(orderNumber, email, phone) {
        const now = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        
        return {
            orderNumber: orderNumber,
            status: 'processing',
            createdAt: now.toISOString(),
            customerName: email ? email.split('@')[0] : 'Demo Customer',
            customerEmail: email || 'demo@example.com',
            customerPhone: phone || '+2348123456789',
            customerAddress: '123 Demo Street, Lagos, Nigeria',
            estimatedDelivery: deliveryDate.toISOString(),
            total: 185000,
            items: [
                {
                    name: 'Executive Leather Office Chair',
                    price: 75000,
                    quantity: 2
                },
                {
                    name: 'Modern Coffee Table',
                    price: 35000,
                    quantity: 1
                }
            ],
            statusUpdates: [
                {
                    status: 'pending',
                    title: 'Order Placed',
                    description: 'Your order has been received and is being processed.',
                    date: now.toISOString(),
                    completed: true
                },
                {
                    status: 'processing',
                    title: 'Order Processing',
                    description: 'Your items are being prepared for shipping.',
                    date: new Date(now.getTime() + 3600000).toISOString(),
                    completed: true
                },
                {
                    status: 'shipped',
                    title: 'Order Shipped',
                    description: 'Your order has been shipped. You will receive tracking details soon.',
                    date: new Date(now.getTime() + 7200000).toISOString(),
                    completed: false
                }
            ],
            notes: 'This is a demo order for testing purposes.',
            source: 'Online Store'
        };
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

// Make functions available globally
window.normalizeOrderNumber = function(orderNumber) {
    const tracker = window.orderTracker;
    if (tracker) {
        return tracker.normalizeOrderNumber(orderNumber);
    }
    return orderNumber;
};