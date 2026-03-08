// order-tracking.js - Order Tracking Results Page
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    console.log('Order Tracking page initialized');

    const API_URL = '/api/order/track';
    const REFRESH_INTERVAL = 30000; // ms
    const MAX_RETRIES = 3;

    // Add at the top of order-tracking.js
    function normalizeOrderNumberClient(orderNumber) {
        if (!orderNumber) return '';
        
        let clean = orderNumber.toUpperCase().trim();
        
        // Handle different formats
        if (clean.includes('-')) {
            const parts = clean.split('-').filter(p => p);
            
            // Format: 367193-944 (without CIL)
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
        
        // Add CIL- prefix if missing
        if (!clean.startsWith('CIL')) {
            clean = 'CIL-' + clean;
        } else if (clean.startsWith('CIL') && !clean.startsWith('CIL-')) {
            clean = 'CIL-' + clean.substring(3);
        }
        
        return clean;
    }

    // State
    let currentOrder = null;
    let isFetching = false;
    let refreshTimer = null;

    // Elements
    const el = {
        form: document.getElementById('trackOrderForm'),
        orderNumberInput: document.getElementById('orderNumberInput'),
        emailInput: document.getElementById('emailInput'),
        phoneInput: document.getElementById('phoneInput'),
        trackBtn: document.getElementById('trackBtn'),
        btnText: document.getElementById('btnText'),
        clearBtn: document.getElementById('clearBtn'),
        loading: document.getElementById('loadingState'),
        error: document.getElementById('errorState'),
        errorText: document.getElementById('errorText'),
        orderContent: document.getElementById('orderContent'),
        statusAlert: document.getElementById('statusUpdateAlert'),
        statusMessage: document.getElementById('statusMessage'),
        statusAlertClose: document.querySelector('.alert-close'),
        formMessage: document.getElementById('formMessage'),
        // New elements for back navigation
        backToTrackLink: document.getElementById('backToTrack')
    };

    // Initialize
    setupEventListeners();
    hydrateFromUrlOrSession();
    setupBackNavigation();

    /* -------------------------
       Setup listeners
       ------------------------- */
    function setupEventListeners() {
        if (el.form) {
            el.form.addEventListener('submit', handleFormSubmit);
        }

        if (el.clearBtn) {
            el.clearBtn.addEventListener('click', () => {
                el.orderNumberInput.value = '';
                el.emailInput.value = '';
                el.phoneInput.value = '';
                hideElement(el.formMessage);
            });
        }

        if (el.statusAlertClose) {
            el.statusAlertClose.addEventListener('click', () => hideElement(el.statusAlert));
        }

        // Handle action buttons
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Refresh button
            if (target.closest && target.closest('.refresh-btn')) {
                e.preventDefault();
                refreshOrder();
            }
            
            // Print button
            if (target.closest && target.closest('.print-btn')) {
                e.preventDefault();
                printOrder();
            }
            
            // Back to tracking link
            if (target.closest && target.closest('.back-to-track')) {
                e.preventDefault();
                window.location.href = '/order-track';
            }
        });

        // Auto-refresh control
        window.addEventListener('beforeunload', cleanupTimers);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAutoRefresh();
            else if (currentOrder) startAutoRefresh();
        });
    }

    function setupBackNavigation() {
        // Add breadcrumb navigation if not present
        if (el.orderContent && !document.querySelector('.breadcrumb-nav')) {
            const breadcrumb = document.createElement('nav');
            breadcrumb.className = 'breadcrumb-nav';
            breadcrumb.setAttribute('aria-label', 'Breadcrumb');
            breadcrumb.innerHTML = `
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/order-track" class="back-link">
                            <i class="fas fa-arrow-left"></i>
                            <span>Track Another Order</span>
                        </a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Order Tracking</li>
                </ol>
            `;
            el.orderContent.insertBefore(breadcrumb, el.orderContent.firstChild);
        }
    }

    /* -------------------------
       Hydration: check sessionStorage or URL param
       ------------------------- */
    function hydrateFromUrlOrSession() {
        // Check session first (when redirected from track form)
        const stored = sessionStorage.getItem('trackedOrder');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                sessionStorage.removeItem('trackedOrder');
                onOrderLoaded(parsed);
                return;
            } catch (err) {
                console.error('Error parsing stored order:', err);
            }
        }

        // Fallback: URL param ?order=...
        const params = new URLSearchParams(location.search);
        let orderNumber = params.get('order');
        if (orderNumber) {
            // Normalize order number
            orderNumber = normalizeOrderNumberClient(orderNumber);
            
            // Update input field
            if (el.orderNumberInput) {
                el.orderNumberInput.value = orderNumber;
            }
            
            // Auto-fetch order
            fetchAndShowOrder(orderNumber, 
                el.emailInput ? el.emailInput.value : '', 
                el.phoneInput ? el.phoneInput.value : ''
            );
        }
    }

    /* -------------------------
       Form submit handler
       ------------------------- */
    async function handleFormSubmit(e) {
        e.preventDefault();
        hideElement(el.error);
        hideElement(el.orderContent);
        hideElement(el.statusAlert);
        hideElement(el.formMessage);

        let orderNumber = (el.orderNumberInput.value || '').trim();
        const email = (el.emailInput.value || '').trim();
        const phone = (el.phoneInput.value || '').trim();

        if (!orderNumber) {
            showFormMessage('Please enter your order number', 'error');
            return;
        }

        // Normalize the order number
        orderNumber = normalizeOrderNumberClient(orderNumber);
        
        // Update input field with normalized value for user feedback
        if (el.orderNumberInput) {
            el.orderNumberInput.value = orderNumber;
        }

        // Disable UI
        disableTrackButton(true);

        // Fetch
        await fetchAndShowOrder(orderNumber, email, phone);

        // Re-enable UI
        disableTrackButton(false);
    }

    /* -------------------------
       Fetch & display logic with retry/backoff
       ------------------------- */
    async function fetchAndShowOrder(orderNumber, email = '', phone = '') {
        if (isFetching) return;
        isFetching = true;
        showElement(el.loading);

        try {
            const order = await fetchOrderWithRetry(orderNumber, email, phone);
            if (!order) {
                // Try demo orders
                if (orderNumber.includes('DEMO') || orderNumber.includes('TEST')) {
                    const demoOrder = createDemoOrder(orderNumber, email, phone);
                    onOrderLoaded(demoOrder);
                } else {
                    showErrorMessage('Order not found. Please verify your order number and contact details.');
                }
                return;
            }
            onOrderLoaded(order);
            
            // Update URL without reload
            const url = new URL(window.location);
            url.searchParams.set('order', orderNumber);
            window.history.replaceState({}, '', url);
        } catch (err) {
            console.error('fetchAndShowOrder error:', err);
            
            // Fallback for demo orders
            if (orderNumber.includes('DEMO') || orderNumber.includes('TEST')) {
                const demoOrder = createDemoOrder(orderNumber, email, phone);
                onOrderLoaded(demoOrder);
            } else {
                showErrorMessage('Unable to retrieve order at this time. Try again later.');
            }
        } finally {
            hideElement(el.loading);
            isFetching = false;
        }
    }

    async function fetchOrderWithRetry(orderNumber, email = '', phone = '') {
        let attempts = 0;
        const max = MAX_RETRIES;

        while (attempts < max) {
            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderNumber, email: email || undefined, phone: phone || undefined })
                });

                if (!res.ok) {
                    throw new Error('Network or server error');
                }

                const payload = await res.json();
                if (!payload || !payload.success) {
                    return null;
                }

                return payload.order;
            } catch (err) {
                attempts++;
                if (attempts >= max) {
                    console.error('fetchOrderWithRetry failed after', attempts, 'attempts');
                    return null;
                }
                // Exponential backoff
                await delay(500 * Math.pow(2, attempts));
            }
        }
        return null;
    }

    function createDemoOrder(orderNumber, email, phone) {
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

    /* -------------------------
       When order is loaded
       ------------------------- */
    function onOrderLoaded(order) {
        currentOrder = order;
        renderOrder(order);
        startAutoRefresh();
    }

    /* -------------------------
       Render helpers
       ------------------------- */
    function renderOrder(order) {
        hideElement(el.error);

        // Construct HTML
        const html = generateOrderHTML(order);
        el.orderContent.innerHTML = html;
        showElement(el.orderContent);
        
        // Add fade-in animation
        setTimeout(() => {
            el.orderContent.style.opacity = '1';
            el.orderContent.style.transform = 'translateY(0)';
        }, 50);
    }

    function generateOrderHTML(order) {
        // safe getters
        const safe = (v) => (v === undefined || v === null ? '' : v);
        const fmtDate = (d) => {
            try {
                return new Date(d).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) { 
                return 'N/A'; 
            }
        };

        const statusConfig = getStatusConfig(order.status);
        const progress = calculateProgressPercentage(order.status);

        // Items
        const itemsHtml = (order.items || []).map((it, idx) => {
            const total = (it.price || 0) * (it.quantity || 1);
            return `<div class="item-row">
                        <div class="item-name">
                            <span class="item-index">${idx+1}.</span>
                            ${escapeHtml(it.name || 'Item')}
                        </div>
                        <div class="item-quantity">
                            <span class="quantity-badge">${escapeHtml(String(it.quantity || 1))}x</span>
                        </div>
                        <div class="item-price">₦${numberWithCommas(total)}</div>
                    </div>`;
        }).join('');

        // Timeline (most recent last)
        const updates = (order.statusUpdates || []).slice();
        if (updates.length === 0) {
            updates.push({ 
                title: 'Order Placed', 
                description: 'Order received and being processed.', 
                date: order.createdAt || new Date(), 
                completed: true 
            });
        }
        
        const timelineHtml = updates.map((u, i) => {
            const isLast = i === updates.length - 1;
            const statusClass = isLast ? 'active' : (u.completed ? 'completed' : 'pending');
            return `<div class="timeline-item ${statusClass}">
                        <div class="timeline-dot" aria-hidden="true"></div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <h3 class="timeline-title">${escapeHtml(u.title || 'Update')}</h3>
                                <span class="timeline-date"><i class="far fa-clock"></i> ${fmtDate(u.date)}</span>
                            </div>
                            <p class="timeline-description">${escapeHtml(u.description || '')}</p>
                        </div>
                    </div>`;
        }).join('');

        return `
            <div class="breadcrumb-nav" aria-label="Breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/order-track" class="back-link">
                            <i class="fas fa-arrow-left"></i>
                            <span>Track Another Order</span>
                        </a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Order Tracking</li>
                </ol>
            </div>
            
            <div class="order-header">
                <div>
                    <h1 class="order-number">Order #${escapeHtml(order.orderNumber)}</h1>
                    <div class="order-meta">
                        <span class="order-date"><i class="far fa-calendar"></i> Placed on ${fmtDate(order.createdAt)}</span>
                        ${order.source ? `<span class="order-source"><i class="fas fa-store"></i> ${escapeHtml(order.source)}</span>` : ''}
                    </div>
                </div>
                <div class="status-badge ${statusConfig.class}">
                    <i class="${statusConfig.icon}" aria-hidden="true"></i>
                    ${escapeHtml(statusConfig.text)}
                </div>
            </div>
            
            <div class="order-progress-bar" aria-hidden="true">
                <div class="progress-fill" style="width:${progress}%"></div>
            </div>
            
            <section class="status-container">
                <h2><i class="fas fa-history"></i> Order Status Timeline</h2>
                <div class="timeline">${timelineHtml}</div>
            </section>
            
            <section class="order-details-grid">
                <div class="detail-card customer-info">
                    <h3><i class="fas fa-user"></i> Customer Information</h3>
                    <p class="customer-name">${escapeHtml(order.customerName || 'Customer')}</p>
                    ${order.customerEmail ? `<p class="customer-email"><i class="fas fa-envelope"></i> ${escapeHtml(order.customerEmail)}</p>` : ''}
                    ${order.customerPhone ? `<p class="customer-phone"><i class="fas fa-phone"></i> ${escapeHtml(order.customerPhone)}</p>` : ''}
                </div>
                
                ${order.customerAddress ? `<div class="detail-card delivery-info">
                    <h3><i class="fas fa-map-marker-alt"></i> Delivery Address</h3>
                    <p class="delivery-address">${escapeHtml(order.customerAddress)}</p>
                </div>` : ''}
                
                ${order.estimatedDelivery ? `<div class="detail-card estimated-delivery">
                    <div class="delivery-icon">
                        <i class="fas fa-shipping-fast"></i>
                    </div>
                    <h3>Estimated Delivery</h3>
                    <p class="delivery-date">${fmtDate(order.estimatedDelivery)}</p>
                    <p class="delivery-note">Our team will contact you for delivery details</p>
                </div>` : ''}
            </section>
            
            <section class="order-items-section">
                <h2><i class="fas fa-box-open"></i> Order Items</h2>
                <div class="items-list">${itemsHtml}</div>
                <div class="total-row">
                    <span>Total Amount:</span>
                    <span class="total-amount">₦${numberWithCommas(order.total || 0)}</span>
                </div>
            </section>
            
            ${order.notes ? `<div class="order-notes">
                <h3><i class="fas fa-sticky-note"></i> Order Notes</h3>
                <div class="notes-content">${escapeHtml(order.notes)}</div>
            </div>` : ''}
            
            <div class="order-actions-bar">
                <div class="tracking-actions">
                    <button class="btn btn-primary print-btn" aria-label="Print order">
                        <i class="fas fa-print"></i> Print Details
                    </button>
                    <a class="btn btn-secondary" href="/contact?subject=Order%20${encodeURIComponent(order.orderNumber || '')}">
                        <i class="fas fa-headset"></i> Contact Support
                    </a>
                    <button class="btn btn-outline refresh-btn" aria-label="Refresh order status">
                        <i class="fas fa-sync-alt"></i> Refresh Status
                    </button>
                </div>
            </div>
        `;
    }

    /* -------------------------
       Utilities & small helpers
       ------------------------- */
    function escapeHtml(str = '') {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    function numberWithCommas(x) {
        return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    function delay(ms) { 
        return new Promise(res => setTimeout(res, ms)); 
    }
    
    function showElement(node) { 
        if (node) {
            node.style.display = '';
            node.style.opacity = '0';
            node.style.transform = 'translateY(20px)';
            setTimeout(() => {
                node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    function hideElement(node) { 
        if (node) node.style.display = 'none'; 
    }

    function showFormMessage(msg, type = 'error') {
        if (!el.formMessage) return;
        el.formMessage.textContent = msg;
        el.formMessage.style.display = '';
        el.formMessage.className = 'form-message ' + (type === 'error' ? 'error' : 'info');
        
        // Auto-hide
        setTimeout(() => {
            hideElement(el.formMessage);
        }, 5000);
    }

    function showErrorMessage(msg) {
        hideElement(el.orderContent);
        showElement(el.error);
        if (el.errorText) el.errorText.textContent = msg;
    }

    function disableTrackButton(disable) {
        if (!el.trackBtn) return;
        const btn = el.trackBtn;
        btn.disabled = Boolean(disable);
        if (disable) {
            el.btnText && (el.btnText.textContent = 'Tracking…');
        } else {
            el.btnText && (el.btnText.textContent = 'Track Order');
        }
    }

    function cleanupTimers() {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }
    }

    function printOrder() {
        const printContent = document.getElementById('orderContent');
        if (!printContent) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order ${currentOrder ? currentOrder.orderNumber : 'Details'} - Collaborative Investment Ltd</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .order-details { margin: 20px 0; }
                    .item-row { display: flex; justify-content: space-between; margin: 5px 0; }
                    .total-row { border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; font-weight: bold; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    /* -------------------------
       Auto-refresh control
       ------------------------- */
    function startAutoRefresh() {
        stopAutoRefresh();
        refreshTimer = setInterval(() => {
            if (!document.hidden && currentOrder) {
                refreshOrder();
            }
        }, REFRESH_INTERVAL);
    }
    
    function stopAutoRefresh() {
        if (refreshTimer) { 
            clearInterval(refreshTimer); 
            refreshTimer = null; 
        }
    }

    async function refreshOrder() {
        if (!currentOrder || isFetching) return;
        await fetchAndShowOrder(currentOrder.orderNumber, 
            el.emailInput ? el.emailInput.value : '', 
            el.phoneInput ? el.phoneInput.value : ''
        );
    }

    /* -------------------------
       Status/config helpers
       ------------------------- */
    function getStatusConfig(status) {
        const statusMap = {
            pending: { class: 'status-pending', text: 'Pending', icon: 'fas fa-clock' },
            processing: { class: 'status-processing', text: 'Processing', icon: 'fas fa-cogs' },
            shipped: { class: 'status-shipped', text: 'Shipped', icon: 'fas fa-shipping-fast' },
            delivered: { class: 'status-delivered', text: 'Delivered', icon: 'fas fa-check-circle' },
            cancelled: { class: 'status-cancelled', text: 'Cancelled', icon: 'fas fa-times-circle' }
        };
        return statusMap[String(status || '').toLowerCase()] || statusMap.pending;
    }

    function calculateProgressPercentage(status) {
        const progressMap = { 
            pending: 25, 
            processing: 50, 
            shipped: 75, 
            delivered: 100, 
            cancelled: 0 
        };
        return progressMap[String(status || '').toLowerCase()] || 0;
    }
});

        document.addEventListener('DOMContentLoaded', function() {
            console.log('Order Tracking page loaded');
            
            // Header scroll effect
            const header = document.querySelector('.header');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
            
            // Check URL for order number parameter
            const urlParams = new URLSearchParams(window.location.search);
            const orderNumberFromUrl = urlParams.get('order');
            
            if (orderNumberFromUrl) {
                document.getElementById('orderNumberInput').value = orderNumberFromUrl;
                trackOrder(orderNumberFromUrl);
            }
            
            // Form submission handler
            const trackForm = document.getElementById('trackOrderForm');
            trackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const orderNumber = document.getElementById('orderNumberInput').value.trim();
                if (orderNumber) {
                    trackOrder(orderNumber);
                    // Update URL with order number
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.set('order', orderNumber);
                    window.history.pushState({}, '', newUrl);
                }
            });
            
            // Clear form handler
            document.getElementById('clearBtn').addEventListener('click', function() {
                trackForm.reset();
                document.getElementById('formMessage').style.display = 'none';
                // Clear URL parameter
                const newUrl = new URL(window.location);
                newUrl.searchParams.delete('order');
                window.history.pushState({}, '', newUrl);
            });
            
            // Alert close handler
            document.querySelector('.alert-close')?.addEventListener('click', function() {
                document.getElementById('statusUpdateAlert').style.display = 'none';
            });
            
            // Close alert on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.getElementById('statusUpdateAlert').style.display = 'none';
                }
            });
            
            // Close alert on click outside
            document.addEventListener('click', function(e) {
                const alert = document.getElementById('statusUpdateAlert');
                if (alert.style.display !== 'none' && !e.target.closest('.status-update-alert')) {
                    alert.style.display = 'none';
                }
            });
            
            // Update cart count
            updateCartCount();
            
            // Main tracking function
function trackOrder(orderNumber) {
    // Show loading state
    showLoading();

    // Make API call
    fetch('/api/order/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderNumber: orderNumber,
            email: document.getElementById('emailInput').value.trim(),
            phone: document.getElementById('phoneInput').value.trim()
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data);
        if (data.success) {
            renderOrderDetails(data.order);
            showStatusUpdate('Order found!', 'Your order details have been loaded successfully.');
        } else {
            showError(data.message || 'Order not found. Please check your order number and try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Network error. Please check your connection and try again.');
    });
}

            // Also add a direct URL access function
            function trackOrderFromURL(orderNumber) {
                if (orderNumber) {
                    document.getElementById('orderNumberInput').value = orderNumber;
                    trackOrder(orderNumber);
                }
            }
            
            function showLoading() {
                document.getElementById('trackPanel').style.display = 'none';
                document.getElementById('errorState').style.display = 'none';
                document.getElementById('orderContent').style.display = 'none';
                document.getElementById('loadingState').style.display = 'block';
            }
            
            function showError(message) {
                document.getElementById('loadingState').style.display = 'none';
                document.getElementById('errorState').style.display = 'block';
                document.getElementById('errorText').textContent = message;
                document.getElementById('trackPanel').style.display = 'block';
            }
            
            function showStatusUpdate(title, detail) {
                const alert = document.getElementById('statusUpdateAlert');
                const message = document.getElementById('statusMessage');
                const detailEl = document.getElementById('statusDetail');
                
                message.textContent = title;
                if (detailEl) detailEl.textContent = detail;
                alert.style.display = 'block';
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    alert.style.display = 'none';
                }, 5000);
            }
            
            function renderOrderDetails(order) {
                document.getElementById('loadingState').style.display = 'none';
                document.getElementById('trackPanel').style.display = 'none';
                
                const orderContent = document.getElementById('orderContent');
                orderContent.innerHTML = generateOrderHTML(order);
                orderContent.style.display = 'block';
            }
            
function generateOrderHTML(order) {
    console.log('Generating HTML for order:', order);
    
    // Format dates
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const updatedDate = order.updatedAt ? 
        new Date(order.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : orderDate;

    // Status configuration
    const statusConfig = {
        'pending': { class: 'status-pending', text: 'Pending', icon: 'fa-clock', color: '#f39c12' },
        'processing': { class: 'status-processing', text: 'Processing', icon: 'fa-cogs', color: '#3498db' },
        'shipped': { class: 'status-shipped', text: 'Shipped', icon: 'fa-shipping-fast', color: '#7f8c8d' },
        'delivered': { class: 'status-delivered', text: 'Delivered', icon: 'fa-check-circle', color: '#27ae60' },
        'cancelled': { class: 'status-cancelled', text: 'Cancelled', icon: 'fa-times-circle', color: '#e74c3c' }
    };

    const status = statusConfig[order.status] || statusConfig.pending;

    // Build timeline
    const timeline = order.statusUpdates || [
        {
            status: order.status,
            title: 'Order Placed',
            description: 'Your order has been received and is being processed.',
            date: order.createdAt,
            completed: true,
            type: 'order_placed'
        }
    ];

    // SVG fallback for missing images
const svgFallback = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <rect width="80" height="80" fill="#f8f9fa"/>
        <path d="M25 25L55 55M55 25L25 55" stroke="#dee2e6" stroke-width="2"/>
        <text x="40" y="45" text-anchor="middle" font-family="Arial" font-size="12" fill="#6c757d">Image</text>
    </svg>
`)}`;

    // Build order items HTML
    const itemsHTML = order.items.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        const imageUrl = item.image || svgFallback;
        
        return `
            <div class="item-card">
                <img src="${imageUrl}" alt="${item.name}" class="item-image" 
                     onerror="this.src='${svgFallback}';">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-meta">
                        <span>Quantity: ${item.quantity}</span>
                        <span>Unit Price: ₦${item.price.toLocaleString()}</span>
                    </div>
                </div>
                <div class="item-price">₦${itemTotal.toLocaleString()}</div>
            </div>
        `;
    }).join('');

    // Build timeline HTML
    const timelineHTML = timeline.map((step, index) => {
        const stepDate = new Date(step.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const isActive = index === timeline.length - 1;
        const isCompleted = step.completed || index < timeline.length - 1;
        const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'pending';
        
        // Get step icon
        const stepIcon = getStepIcon(step.type || 'order_placed');
        
        return `
            <div class="timeline-step ${statusClass}">
                <div class="step-icon">
                    <i class="fas ${stepIcon}"></i>
                </div>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                    <span class="step-time">
                        <i class="far fa-clock"></i> ${stepDate}
                    </span>
                </div>
            </div>
        `;
    }).join('');

    // Calculate progress percentage
    const progressPercent = calculateProgress(order.status);

    // Build the complete HTML
    return `
        <div class="order-header">
            <div>
                <h1 class="order-number">Order #${order.orderNumber}</h1>
                <div class="order-meta">
                    <span class="order-date"><i class="far fa-calendar"></i> Placed on ${orderDate}</span>
                    ${order.updatedAt ? `<span class="order-updated"> • Updated: ${updatedDate}</span>` : ''}
                </div>
            </div>
            <div class="status-badge ${status.class}">
                <i class="fas ${status.icon}"></i> ${status.text}
            </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="order-progress-bar" aria-label="Order progress">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        
        <!-- Order Timeline -->
        <div class="status-container">
            <h2><i class="fas fa-history"></i> Order Status Timeline</h2>
            <div class="timeline">
                ${timelineHTML}
            </div>
        </div>
        
        <!-- Order Details Grid -->
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
        
        <!-- Order Items -->
        <div class="order-items-section">
            <h2><i class="fas fa-box-open"></i> Order Items (${order.items.length})</h2>
            <div class="items-list">
                ${itemsHTML}
            </div>
            <div class="total-row">
                <span>Total Amount:</span>
                <span class="total-amount">₦${order.total.toLocaleString()}</span>
            </div>
        </div>
        
        <!-- Order Notes -->
        ${order.notes ? `
        <div class="order-notes">
            <h3><i class="fas fa-sticky-note"></i> Order Notes</h3>
            <div class="notes-content">${order.notes}</div>
        </div>
        ` : ''}
        
        <!-- Order Actions -->
        <div class="order-actions-bar">
            <div class="tracking-actions">
                <button onclick="window.print()" class="btn btn-primary print-btn">
                    <i class="fas fa-print"></i> Print Details
                </button>
                <a href="/contact?subject=Order%20${order.orderNumber}" class="btn btn-secondary">
                    <i class="fas fa-headset"></i> Contact Support
                </a>
                <a href="/shop-all" class="btn btn-outline">
                    <i class="fas fa-shopping-cart"></i> Continue Shopping
                </a>
            </div>
        </div>
    `;
}

// Add helper functions
function calculateProgress(status) {
    const progressMap = {
        'pending': 25,
        'processing': 50,
        'shipped': 75,
        'delivered': 100,
        'cancelled': 0
    };
    return progressMap[status] || 0;
}

function getStepIcon(type) {
    const icons = {
        'order_placed': 'fa-shopping-cart',
        'payment': 'fa-credit-card',
        'processing': 'fa-cog',
        'shipping': 'fa-shipping-fast',
        'delivery': 'fa-truck',
        'delivered': 'fa-check-circle',
        'cancelled': 'fa-times-circle'
    };
    return icons[type] || 'fa-circle';
}

            function generateTimelineHTML(timeline) {
                return timeline.map(step => `
                    <div class="timeline-step ${step.status}">
                        <div class="step-icon">
                            <i class="fas ${getStepIcon(step.type)}"></i>
                        </div>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p>${step.description}</p>
                            <span class="step-time">
                                <i class="far fa-clock"></i> ${step.time}
                            </span>
                        </div>
                    </div>
                `).join('');
            }

            function generateOrderItemsHTML(items) {
                return items.map(item => `
                    <div class="item-card">
                        <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='/img/placeholder.jpg'">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <div class="item-meta">
                                <span>Qty: ${item.quantity}</span>
                                <span>Price: ${item.price}</span>
                            </div>
                        </div>
                        <div class="item-price">${item.total}</div>
                    </div>
                `).join('');
            }

            function getStatusColor(status) {
                const colors = {
                    'Processing': '#3498db',
                    'Shipped': '#f39c12',
                    'Delivered': '#27ae60',
                    'Cancelled': '#e74c3c',
                    'Pending': '#95a5a6'
                };
                return colors[status] || '#95a5a6';
            }

            function getStatusIcon(status) {
                const icons = {
                    'Processing': 'fa-cog',
                    'Shipped': 'fa-shipping-fast',
                    'Delivered': 'fa-check-circle',
                    'Cancelled': 'fa-times-circle',
                    'Pending': 'fa-clock'
                };
                return icons[status] || 'fa-question-circle';
            }

            function getStepIcon(type) {
                const icons = {
                    'order_placed': 'fa-shopping-cart',
                    'payment': 'fa-credit-card',
                    'processing': 'fa-cog',
                    'shipping': 'fa-shipping-fast',
                    'delivery': 'fa-truck',
                    'delivered': 'fa-check-circle'
                };
                return icons[type] || 'fa-circle';
            }

            function getSampleOrder(orderNumber) {
                // Sample order data - replace with actual API call
                const sampleOrders = {
                    'CIL-2025-123456': {
                        orderNumber: 'CIL-2025-123456',
                        orderDate: 'March 15, 2025',
                        status: 'Shipped',
                        total: '₦125,800',
                        paymentMethod: 'Bank Transfer',
                        trackingNumber: 'TRK-987654321',
                        estimatedDelivery: 'March 25-28, 2025',
                        customer: {
                            name: 'John Smith',
                            email: 'john.smith@example.com',
                            phone: '+2348123456789'
                        },
                        shipping: {
                            address: '123 Main Street, Lagos Island, Lagos',
                            method: 'Express Delivery',
                            cost: '₦3,500'
                        },
                        timeline: [
                            {
                                type: 'order_placed',
                                title: 'Order Placed',
                                description: 'Your order has been received and confirmed',
                                time: 'Mar 15, 2025 - 10:30 AM',
                                status: 'completed'
                            },
                            {
                                type: 'payment',
                                title: 'Payment Confirmed',
                                description: 'Payment has been successfully verified',
                                time: 'Mar 15, 2025 - 11:45 AM',
                                status: 'completed'
                            },
                            {
                                type: 'processing',
                                title: 'Order Processing',
                                description: 'Your items are being prepared for shipment',
                                time: 'Mar 16, 2025 - 9:00 AM',
                                status: 'completed'
                            },
                            {
                                type: 'shipping',
                                title: 'Shipped',
                                description: 'Your order has left our warehouse',
                                time: 'Mar 18, 2025 - 2:30 PM',
                                status: 'active'
                            },
                            {
                                type: 'delivery',
                                title: 'Out for Delivery',
                                description: 'Your order is on its way to your address',
                                time: 'Expected: Mar 25-28, 2025',
                                status: 'pending'
                            }
                        ],
                        items: [
                            {
                                name: 'Premium Office Chair',
                                image: '/img/products/chair.jpg',
                                quantity: 2,
                                price: '₦45,000',
                                total: '₦90,000'
                            },
                            {
                                name: 'Ergonomic Desk',
                                image: '/img/products/desk.jpg',
                                quantity: 1,
                                price: '₦35,800',
                                total: '₦35,800'
                            }
                        ]
                    },
                    'CIL-2025-789012': {
                        orderNumber: 'CIL-2025-789012',
                        orderDate: 'March 10, 2025',
                        status: 'Delivered',
                        total: '₦89,500',
                        paymentMethod: 'Card Payment',
                        trackingNumber: 'TRK-123456789',
                        estimatedDelivery: 'March 18, 2025',
                        customer: {
                            name: 'Sarah Johnson',
                            email: 'sarah.j@example.com',
                            phone: '+2348123456789'
                        },
                        shipping: {
                            address: '456 Victoria Island, Lagos',
                            method: 'Standard Delivery',
                            cost: '₦2,500'
                        },
                        timeline: [
                            {
                                type: 'order_placed',
                                title: 'Order Placed',
                                description: 'Your order has been received and confirmed',
                                time: 'Mar 10, 2025 - 2:15 PM',
                                status: 'completed'
                            },
                            {
                                type: 'payment',
                                title: 'Payment Confirmed',
                                description: 'Payment has been successfully verified',
                                time: 'Mar 10, 2025 - 2:30 PM',
                                status: 'completed'
                            },
                            {
                                type: 'processing',
                                title: 'Order Processing',
                                description: 'Your items are being prepared for shipment',
                                time: 'Mar 11, 2025 - 10:00 AM',
                                status: 'completed'
                            },
                            {
                                type: 'shipping',
                                title: 'Shipped',
                                description: 'Your order has left our warehouse',
                                time: 'Mar 12, 2025 - 3:45 PM',
                                status: 'completed'
                            },
                            {
                                type: 'delivered',
                                title: 'Delivered',
                                description: 'Your order has been delivered successfully',
                                time: 'Mar 18, 2025 - 11:20 AM',
                                status: 'completed'
                            }
                        ],
                        items: [
                            {
                                name: 'Wireless Keyboard',
                                image: '/img/products/keyboard.jpg',
                                quantity: 1,
                                price: '₦25,000',
                                total: '₦25,000'
                            },
                            {
                                name: 'Wireless Mouse',
                                image: '/img/products/mouse.jpg',
                                quantity: 2,
                                price: '₦12,500',
                                total: '₦25,000'
                            },
                            {
                                name: 'Monitor Stand',
                                image: '/img/products/stand.jpg',
                                quantity: 1,
                                price: '₦39,500',
                                total: '₦39,500'
                            }
                        ]
                    }
                };

                return sampleOrders[orderNumber] || null;
            }

            function downloadOrderDetails(orderNumber) {
                showStatusUpdate('Download Started', 'Your invoice is being prepared for download.');
                // In a real implementation, this would trigger a PDF download
                setTimeout(() => {
                    showStatusUpdate('Download Complete', 'Invoice has been downloaded successfully.');
                }, 1500);
            }

            // Cart functionality
            function updateCartCount() {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
                document.getElementById('cart-count-badge').textContent = cartCount;
            }

            // Cart drawer functionality
            const openCartBtn = document.getElementById('open-cart-drawer');
            const closeCartBtn = document.getElementById('close-cart-drawer');
            const cartDrawer = document.getElementById('cart-drawer');
            const cartOverlay = document.getElementById('cart-drawer-overlay');

            if (openCartBtn) {
                openCartBtn.addEventListener('click', function() {
                    cartDrawer.classList.add('open');
                    cartOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }

            if (closeCartBtn) {
                closeCartBtn.addEventListener('click', closeCartDrawer);
            }

            if (cartOverlay) {
                cartOverlay.addEventListener('click', closeCartDrawer);
            }

            function closeCartDrawer() {
                cartDrawer.classList.remove('open');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Close cart drawer with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && cartDrawer.classList.contains('open')) {
                    closeCartDrawer();
                }
            });

            // Mobile menu toggle
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');

            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    this.setAttribute('aria-expanded', this.classList.contains('active'));
                });
            }

            // Close mobile menu on link click
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                });
            });

            // No JavaScript warning
            const noscriptWarning = document.createElement('div');
            noscriptWarning.className = 'noscript-warning';
            noscriptWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> JavaScript is required for the order tracking feature. Please enable JavaScript in your browser.';
            document.getElementById('trackPanel').prepend(noscriptWarning);
            noscriptWarning.style.display = 'none'; // Hide if JavaScript is enabled
        });

// Test function - remove after testing
function testOrderTracking() {
    console.log('Testing order tracking...');
    
    // Simulate successful order fetch
    const testOrder = {
        orderNumber: 'CIL-367193-944',
        status: 'pending',
        createdAt: '2025-12-08T13:12:47.000Z',
        updatedAt: '2025-12-08T13:12:47.000Z',
        total: 450000,
        items: [
            {
                name: '3-Piece Living Room Set',
                quantity: 1,
                price: 450000,
                image: '/img/furniture/3-piece-living-set.jpg'
            }
        ],
        customerName: 'Adam Kingygug',
        customerEmail: 'adamkingygug@example.com',
        customerPhone: '+2348129978419',
        customerAddress: '212 Ijegun Road, Ikotun, Lagos',
        estimatedDelivery: '2025-12-15T00:00:00.000Z',
        trackingNumber: 'TRK-944-367193',
        statusUpdates: [
            {
                status: 'pending',
                title: 'Order Placed',
                description: 'Your order has been received and is being processed.',
                date: '2025-12-08T13:12:47.000Z',
                completed: true,
                type: 'order_placed'
            },
            {
                status: 'processing',
                title: 'Order Processing',
                description: 'We are preparing your items for shipment.',
                date: '2025-12-09T10:00:00.000Z',
                completed: true,
                type: 'processing'
            }
        ],
        notes: 'Customer requested delivery before 5 PM',
        source: 'website_cart'
    };
    
    console.log('Test order data:', testOrder);
    renderOrderDetails(testOrder);
}

// testOrderTracking();