document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const API_URL = '/api/order/track';
  const REFRESH_INTERVAL = 30000; // ms
  const MAX_RETRIES = 3;

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
    formMessage: document.getElementById('formMessage')
  };

  // Initialize
  setupEventListeners();
  hydrateFromUrlOrSession();

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

    document.addEventListener('click', (e) => {
      const elTarget = e.target;
      if (elTarget.closest && elTarget.closest('.refresh-btn')) {
        e.preventDefault();
        refreshOrder();
      }
      if (elTarget.closest && elTarget.closest('.print-btn')) {
        e.preventDefault();
        window.print();
      }
    });

    window.addEventListener('beforeunload', cleanupTimers);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoRefresh();
      else if (currentOrder) startAutoRefresh();
    });
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
        // ignore parse error
      }
    }

    // Fallback: URL param ?order=...
    const params = new URLSearchParams(location.search);
    const orderNumber = params.get('order');
    if (orderNumber) {
      // populate form and auto-submit
      el.orderNumberInput.value = orderNumber;
      fetchAndShowOrder(orderNumber, el.emailInput.value, el.phoneInput.value);
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

    const orderNumber = (el.orderNumberInput.value || '').trim();
    const email = (el.emailInput.value || '').trim();
    const phone = (el.phoneInput.value || '').trim();

    if (!orderNumber) {
      showFormMessage('Please enter your order number', 'error');
      return;
    }

    // Basic format check (CIL-...)
    if (!/^CIL-[A-Z0-9-]+$/i.test(orderNumber)) {
      showFormMessage('Invalid order number format. Expected: CIL-XXXXXX-XXX', 'error');
      return;
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
        showErrorMessage('Order not found. Please verify your order number and contact details.');
        return;
      }
      onOrderLoaded(order);
      // push order to URL (no reload)
      const url = new URL(window.location);
      url.searchParams.set('order', orderNumber);
      window.history.replaceState({}, '', url);
    } catch (err) {
      console.error('fetchAndShowOrder error:', err);
      showErrorMessage('Unable to retrieve order at this time. Try again later.');
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
          // stop early if server returned not found
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
  }

  function generateOrderHTML(order) {
    // safe getters
    const safe = (v) => (v === undefined || v === null ? '' : v);
    const fmtDate = (d) => {
      try {
        return new Date(d).toLocaleString();
      } catch (e) { return 'N/A'; }
    };

    const statusConfig = getStatusConfig(order.status);
    const progress = calculateProgressPercentage(order.status);

    // Items
    const itemsHtml = (order.items || []).map((it, idx) => {
      const total = (it.price || 0) * (it.quantity || 1);
      return `<div class="item-row">
                <div class="item-name"><strong>${idx+1}.</strong> ${escapeHtml(it.name || 'Item')}</div>
                <div class="item-quantity">${escapeHtml(String(it.quantity || 1))}x</div>
                <div class="item-price">₦${numberWithCommas(total)}</div>
              </div>`;
    }).join('');

    // Timeline (most recent last)
    const updates = (order.statusUpdates || []).slice();
    if (updates.length === 0) {
      updates.push({ title: 'Order Placed', description: 'Order received', date: order.createdAt || new Date(), completed: true });
    }
    const timelineHtml = updates.map((u, i) => {
      const cls = (i === updates.length - 1) ? 'timeline-item active' : (u.completed ? 'timeline-item completed' : 'timeline-item');
      return `<div class="${cls}">
                <div class="timeline-dot" aria-hidden="true"></div>
                <div class="timeline-content">
                  <div class="timeline-header"><strong>${escapeHtml(u.title || 'Update')}</strong> <span class="timeline-date">${fmtDate(u.date)}</span></div>
                  <div class="timeline-description">${escapeHtml(u.description || '')}</div>
                </div>
              </div>`;
    }).join('');

    return `
      <div class="order-header">
        <div>
          <div class="order-number">Order #${escapeHtml(order.orderNumber)}</div>
          <div class="order-meta">
            <small>Placed: ${fmtDate(order.createdAt)}</small>
            ${order.source ? `<small> · Source: ${escapeHtml(order.source)}</small>` : ''}
          </div>
        </div>
        <div>
          <div class="status-badge ${statusConfig.class}">
            <i class="${statusConfig.icon}" aria-hidden="true"></i>
            ${escapeHtml(statusConfig.text)}
          </div>
        </div>
      </div>

      <div class="order-progress-bar" aria-hidden="true">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>

      <section class="status-container">
        <h2>Order Status Timeline</h2>
        <div class="timeline">${timelineHtml}</div>
      </section>

      <section class="order-details-grid">
        <div class="detail-card customer-info">
          <h3>Customer</h3>
          <p class="customer-name">${escapeHtml(order.customerName || 'Customer')}</p>
          ${order.customerEmail ? `<p class="customer-email">${escapeHtml(order.customerEmail)}</p>` : ''}
          ${order.customerPhone ? `<p class="customer-phone">${escapeHtml(order.customerPhone)}</p>` : ''}
        </div>

        ${order.customerAddress ? `<div class="detail-card delivery-info">
          <h3>Delivery Address</h3>
          <p>${escapeHtml(order.customerAddress)}</p>
        </div>` : ''}

        ${order.estimatedDelivery ? `<div class="detail-card estimated-delivery">
          <h3>Estimated Delivery</h3>
          <p>${fmtDate(order.estimatedDelivery)}</p>
        </div>` : ''}
      </section>

      <section class="order-items-section">
        <h2>Items</h2>
        <div class="items-list">${itemsHtml}</div>
        <div class="total-row"><span>Total Amount:</span><strong>₦${numberWithCommas(order.total || 0)}</strong></div>
      </section>

      ${order.notes ? `<section class="order-notes"><h3>Notes</h3><div>${escapeHtml(order.notes)}</div></section>` : ''}

      <div class="order-actions-bar">
        <div class="tracking-actions">
          <button class="btn btn-primary print-btn" aria-label="Print order">Print Details</button>
          <a class="btn btn-secondary" href="/contact?subject=Order%20${encodeURIComponent(order.orderNumber || '')}">Contact Support</a>
          <button class="btn btn-outline refresh-btn" aria-label="Refresh order status">Refresh Status</button>
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
  function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
  function showElement(node) { if (node) node.style.display = ''; }
  function hideElement(node) { if (node) node.style.display = 'none'; }

  function showFormMessage(msg, type = 'error') {
    if (!el.formMessage) return;
    el.formMessage.textContent = msg;
    el.formMessage.style.display = '';
    el.formMessage.className = 'form-message ' + (type === 'error' ? 'error' : 'info');
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

  /* -------------------------
     Auto-refresh control
     ------------------------- */
  function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(() => {
      if (!document.hidden) refreshOrder();
    }, REFRESH_INTERVAL);
  }
  function stopAutoRefresh() {
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  }

  async function refreshOrder() {
    if (!currentOrder || isFetching) return;
    await fetchAndShowOrder(currentOrder.orderNumber, el.emailInput.value, el.phoneInput.value);
  }

  /* -------------------------
     Status/config helpers
     ------------------------- */
  function getStatusConfig(status) {
    const map = {
      pending: { class: 'status-pending', text: 'Pending', icon: 'fas fa-clock' },
      processing: { class: 'status-processing', text: 'Processing', icon: 'fas fa-cogs' },
      shipped: { class: 'status-shipped', text: 'Shipped', icon: 'fas fa-shipping-fast' },
      delivered: { class: 'status-delivered', text: 'Delivered', icon: 'fas fa-check-circle' },
      cancelled: { class: 'status-cancelled', text: 'Cancelled', icon: 'fas fa-times-circle' }
    };
    return map[String(status || '').toLowerCase()] || map.pending;
  }

  function calculateProgressPercentage(status) {
    const map = { pending: 25, processing: 50, shipped: 75, delivered: 100, cancelled: 0 };
    return map[String(status || '').toLowerCase()] || 0;
  }
});
