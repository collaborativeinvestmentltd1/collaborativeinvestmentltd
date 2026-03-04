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
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Enhanced Order Tracking loaded - Updated for multiple format support');
            
            // Elements
            const form = document.getElementById('trackOrderForm');
            const orderInput = document.getElementById('orderNumber');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const errorMessage = document.getElementById('errorMessage');
            const successMessage = document.getElementById('successMessage');
            const statusInfo = document.getElementById('statusInfo');
            const trackBtn = document.getElementById('trackBtn');
            const btnText = document.getElementById('btnText');
            const loadingSpinner = document.getElementById('loadingSpinner');
            
            // Remove the strict pattern validation from input
            orderInput.pattern = ".*"; // Accept any pattern
            
            // Update the order example to show multiple formats
            const orderExample = document.querySelector('.order-example');
            if (orderExample) {
                orderExample.innerHTML = `
                    <h4><i class="fas fa-info-circle"></i> Accepted Order Number Formats</h4>
                    <p>Your order number can be found in:</p>
                    <ul style="margin-top: 0.5rem; color: var(--gray); font-size: 0.9rem;">
                        <li>• Order confirmation email (sent after purchase)</li>
                        <li>• WhatsApp confirmation message from our support team</li>
                        <li>• SMS confirmation (for phone orders)</li>
                    </ul>
                    <p style="margin-top: 0.5rem; font-weight: 600; color: var(--primary);">
                        Accepted Formats:
                    </p>
                    <ul style="margin-top: 0.5rem; color: var(--primary); font-size: 0.9rem;">
                        <li>• CIL-367193-944 (original format)</li>
                        <li>• CIL-2025-367193 (year format)</li>
                        <li>• 367193 (just the number)</li>
                        <li>• CIL-367193 (simple format)</li>
                        <li>• 367193-944 (without CIL)</li>
                    </ul>
                `;
            }
            
            // Format phone number
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = '+234 ' + value;
                }
                e.target.value = value;
            });
            
            // Auto-focus order input
            orderInput.focus();
            
            // Check for previous order in localStorage
            const lastOrder = localStorage.getItem('lastTrackedOrder');
            if (lastOrder) {
                const orderData = JSON.parse(lastOrder);
                orderInput.value = orderData.orderNumber || '';
                emailInput.value = orderData.email || '';
                phoneInput.value = orderData.phone || '';
            }
            
            // Check URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const orderParam = urlParams.get('order');
            const emailParam = urlParams.get('email');
            
            if (orderParam) {
                orderInput.value = orderParam;
                if (emailParam) {
                    emailInput.value = emailParam;
                }
                // Auto-track after a delay
                setTimeout(() => {
                    trackRealOrder();
                }, 1000);
            }
            
            // Form submission
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!validateForm()) {
                    return;
                }
                
                await trackRealOrder();
            });
            
            // Validation function - updated for multiple formats
            function validateForm() {
                const orderNumber = orderInput.value.trim();
                const email = emailInput.value.trim();
                const phone = phoneInput.value.trim();
                
                // Clear previous messages
                hideMessages();
                
                // Validate order number
                if (!orderNumber) {
                    showError('Please enter your order number');
                    orderInput.focus();
                    return false;
                }
                
                // Accept multiple formats, not just CIL-YYYY-XXXXX
                const orderRegex = /^(CIL-)?[\d-]+$/i;
                if (!orderRegex.test(orderNumber)) {
                    showError('Please enter a valid order number. Accepted formats: CIL-367193-944, 367193, CIL-2025-367193, etc.');
                    orderInput.focus();
                    return false;
                }
                
                // Validate email if provided
                if (email && !isValidEmail(email)) {
                    showError('Please enter a valid email address');
                    emailInput.focus();
                    return false;
                }
                
                // Validate phone if provided
                if (phone && !isValidPhone(phone)) {
                    showError('Please enter a valid phone number (format: +234 812 997 8419)');
                    phoneInput.focus();
                    return false;
                }
                
                return true;
            }
            
            // REAL tracking function with actual API call
            async function trackRealOrder() {
                const orderNumber = orderInput.value.trim();
                const email = emailInput.value.trim();
                const phone = phoneInput.value.trim();
                
                console.log('Tracking order:', { orderNumber, email, phone });
                
                // Save to localStorage
                localStorage.setItem('lastTrackedOrder', JSON.stringify({
                    orderNumber,
                    email,
                    phone,
                    timestamp: new Date().toISOString()
                }));
                
                // Show loading state
                setLoading(true);
                
                // Hide previous messages
                hideMessages();
                statusInfo.classList.remove('show');
                
                try {
                    // Make API call to backend
                    const response = await fetch('/api/order/track', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            orderNumber: orderNumber,
                            email: email || undefined,
                            phone: phone || undefined
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Store order data in session storage for the tracking page
                        sessionStorage.setItem('trackedOrder', JSON.stringify(data.order));
                        
                        // Show success
                        showSuccess('Order found! Redirecting to tracking details...');
                        
                        // Show status info briefly
                        statusInfo.classList.add('show');
                        statusInfo.innerHTML = `
                            <h4><i class="fas fa-check-circle" style="color: var(--success);"></i> Order Located</h4>
                            <p><strong>Order:</strong> ${data.order.orderNumber}</p>
                            <p><strong>Status:</strong> ${data.order.status}</p>
                            <p><strong>Customer:</strong> ${data.order.customerName}</p>
                            <p><strong>Total:</strong> ₦${data.order.total.toLocaleString()}</p>
                        `;
                        
                        // Redirect to tracking page after delay
                        setTimeout(() => {
                            window.location.href = `/order-tracking?order=${encodeURIComponent(orderNumber)}`;
                        }, 1500);
                    } else {
                        showError(data.message || 'Order not found. Please check your order number and contact details.');
                        statusInfo.classList.add('show');
                        statusInfo.innerHTML = `
                            <h4><i class="fas fa-exclamation-triangle" style="color: var(--accent);"></i> Order Not Found</h4>
                            <p>Unable to locate order "${orderNumber}". Please:</p>
                            <ul style="margin: 0.5rem 0 0.5rem 1.5rem;">
                                <li>Double-check your order number</li>
                                <li>Contact support if you placed the order recently</li>
                                <li>Check your email for the confirmation message</li>
                                <li>Try different formats: 367193, CIL-367193, CIL-2025-367193</li>
                            </ul>
                            <p style="margin-top: 1rem;">
                                <a href="https://wa.me/2348129978419?text=Hi! I need help tracking order ${encodeURIComponent(orderNumber)}" 
                                   class="btn btn-primary" target="_blank" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                                    <i class="fab fa-whatsapp"></i> Get Help on WhatsApp
                                </a>
                            </p>
                        `;
                    }
                } catch (error) {
                    console.error('Tracking error:', error);
                    showError('Network error. Please check your connection and try again.');
                    statusInfo.classList.add('show');
                    statusInfo.innerHTML = `
                        <h4><i class="fas fa-exclamation-triangle" style="color: var(--accent);"></i> Connection Error</h4>
                        <p>Unable to connect to the tracking server. Please:</p>
                        <ul style="margin: 0.5rem 0 0.5rem 1.5rem;">
                            <li>Check your internet connection</li>
                            <li>Try again in a few moments</li>
                            <li>Contact support if the issue persists</li>
                        </ul>
                    `;
                } finally {
                    setLoading(false);
                }
            }
            
            // Helper functions
            function normalizeOrderNumber(orderNumber) {
                let normalized = orderNumber.toUpperCase().trim();
                
                // Add CIL- prefix if missing
                if (!normalized.startsWith('CIL-') && normalized.match(/^\d/)) {
                    normalized = 'CIL-' + normalized;
                }
                
                return normalized;
            }
            
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            function isValidPhone(phone) {
                const phoneRegex = /^\+234\s\d{10}$/;
                return phoneRegex.test(phone);
            }
            
            function showError(message) {
                errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                errorMessage.style.display = 'flex';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Auto-hide after 8 seconds
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 8000);
            }
            
            function showSuccess(message) {
                successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
                successMessage.style.display = 'flex';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            function hideMessages() {
                errorMessage.style.display = 'none';
                successMessage.style.display = 'none';
            }
            
            function setLoading(loading) {
                if (loading) {
                    trackBtn.disabled = true;
                    btnText.textContent = 'Tracking...';
                    loadingSpinner.style.display = 'inline-block';
                    trackBtn.style.opacity = '0.8';
                } else {
                    trackBtn.disabled = false;
                    btnText.textContent = 'Track Order Status';
                    loadingSpinner.style.display = 'none';
                    trackBtn.style.opacity = '1';
                }
            }
            
            // Quick test function - can be removed in production
            function testOrderNumberFormats() {
                console.log('Testing order number formats:');
                
                const testCases = [
                    'CIL-367193-944',
                    '367193-944',
                    '367193',
                    'CIL-367193',
                    'CIL-2025-367193',
                    'cil-367193-944',
                    'CIL-816082-554',
                    '816082',
                    'CIL-816082'
                ];
                
                testCases.forEach(testCase => {
                    console.log(`Testing: ${testCase}`);
                    orderInput.value = testCase;
                    setTimeout(() => {
                        trackRealOrder();
                    }, 100);
                });
            }
            
            // Uncomment to test formats (remove in production)
            // testOrderNumberFormats();
            
            // Initialize cart count
            function updateCartCount() {
                try {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                    const badge = document.getElementById('cart-count-badge');
                    if (badge) {
                        badge.textContent = totalItems;
                        badge.style.display = totalItems > 0 ? 'flex' : 'none';
                    }
                } catch (error) {
                    console.error('Error updating cart count:', error);
                }
            }
            
            updateCartCount();
            
            // Add some helpful tips
            console.log('Order tracking supports multiple formats:');
            console.log('1. CIL-367193-944 (original format)');
            console.log('2. 367193 (just the number part)');
            console.log('3. CIL-367193 (without the last part)');
            console.log('4. CIL-2025-367193 (with year format)');
            console.log('5. 367193-944 (without CIL prefix)');
        });