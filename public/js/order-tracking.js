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