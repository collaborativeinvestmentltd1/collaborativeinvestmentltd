// cart.js - COMPLETE CART SYSTEM FOR COLLABORATIVE INVESTMENT LTD
console.log('Loading CIL Cart System...');

/* ============================================================
   CART DATA MANAGEMENT - SINGLE SOURCE OF TRUTH
   ============================================================ */

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CIL-${timestamp.slice(-6)}-${random}`;
}

// CORE CART FUNCTIONS
function getCart() {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error reading cart:', error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Update drawer if open
        if (typeof window.renderCartDrawer === 'function') {
            window.renderCartDrawer();
        }
        
        return true;
    } catch (error) {
        console.error('Error saving cart:', error);
        return false;
    }
}

function addToCart(product) {
    console.log('Adding to cart:', product.name);
    
    // Validate product data
    if (!product || !product.id || !product.name || !product.price) {
        console.error('Invalid product data:', product);
        return false;
    }
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated existing item quantity:', existingItem.quantity);
    } else {
        cart.push({
            id: product.id.toString(),
            name: product.name,
            price: parseFloat(product.price),
            image: product.image || '/img/logo.jpg',
            quantity: 1,
            category: product.category || 'general'
        });
        console.log('Added new item to cart');
    }
    
    const saved = saveCart(cart);
    
    if (saved) {
        showCartNotification(product.name);
        return true;
    }
    
    return false;
}

function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId.toString());
    return saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId.toString());
    
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    
    if (typeof window.renderCartDrawer === 'function') {
        window.renderCartDrawer();
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/* ============================================================
   CART UI UPDATES - BADGE, DRAWER, NOTIFICATIONS
   ============================================================ */

function updateCartCount() {
    const count = getCartItemCount();
    const badge = document.getElementById('cart-count-badge');
    
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
    
    return count;
}

function showCartNotification(productName) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.cart-notification');
    existing.forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<span>✓ Added "${productName}" to cart</span>`;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ============================================================
   CART DRAWER FUNCTIONALITY
   ============================================================ */

function initializeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    const openBtn = document.getElementById('open-cart-drawer');
    const closeBtn = document.getElementById('close-cart-drawer');
    
    if (!drawer) return;
    
    // Open drawer
    if (openBtn) {
        openBtn.addEventListener('click', openCartDrawer);
    }
    
    // Close drawer
    function closeCartDrawer() {
        drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartDrawer);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeCartDrawer);
    }
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            closeCartDrawer();
        }
    });
    
    // Global function to open drawer
    window.openCartDrawer = function() {
        drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCartDrawer();
    };
}

function renderCartDrawer() {
    const container = document.getElementById('cart-drawer-items');
    const totalEl = document.getElementById('drawer-total');
    
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-drawer-empty">
                <div class="cart-drawer-empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <a href="/shop-all" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        if (totalEl) totalEl.textContent = '₦0';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-drawer-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" 
                 class="cart-drawer-item-image" 
                 onerror="this.src='/img/logo.jpg'">
            <div class="cart-drawer-item-details">
                <h4 class="cart-drawer-item-name">${item.name}</h4>
                <p class="cart-drawer-item-price">₦${item.price.toLocaleString()} × ${item.quantity}</p>
                <div class="cart-drawer-item-actions">
                    <button class="cart-drawer-item-remove" data-id="${item.id}">Remove</button>
                </div>
            </div>
            <div class="cart-drawer-item-total">
                ₦${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');
    
    // Update total
    const total = getCartTotal();
    if (totalEl) {
        totalEl.textContent = `₦${total.toLocaleString()}`;
    }
    
    // Attach event listeners
    container.querySelectorAll('.cart-drawer-item-remove').forEach(button => {
        button.addEventListener('click', function(e) {
            const productId = e.target.dataset.id;
            removeFromCart(productId);
            renderCartDrawer();
        });
    });
}

/* ============================================================
   CART PAGE FUNCTIONALITY
   ============================================================ */

function initializeCartPage() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary-container');
    const empty = document.getElementById('empty-cart-container');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (!container) return;
    
    function renderCartPage() {
        const cart = getCart();
        
        if (cart.length === 0) {
            container.style.display = 'none';
            if (summary) summary.style.display = 'none';
            if (empty) empty.style.display = 'block';
            return;
        }
        
        container.style.display = 'block';
        if (summary) summary.style.display = 'block';
        if (empty) empty.style.display = 'none';
        
        container.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" 
                     class="cart-item-image" 
                     onerror="this.src='/img/logo.jpg'">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                    <div class="cart-item-quantity">
                        <label for="qty-${item.id}">Quantity:</label>
                        <input type="number" id="qty-${item.id}" 
                               class="quantity-input" 
                               value="${item.quantity}" 
                               min="1" 
                               data-id="${item.id}">
                    </div>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-total">₦${(item.price * item.quantity).toLocaleString()}</p>
                    <button class="remove-item-btn" data-id="${item.id}">&times; Remove</button>
                </div>
            </div>
        `).join('');
        
        updateCartSummary();
        attachCartPageListeners();
    }
    
    function updateCartSummary() {
        const subtotal = getCartTotal();
        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');
        
        if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `₦${subtotal.toLocaleString()}`;
    }
    
    function attachCartPageListeners() {
        // Remove buttons
        container.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                removeFromCart(productId);
                renderCartPage();
            });
        });
        
        // Quantity inputs
        container.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.id;
                const quantity = parseInt(e.target.value);
                
                if (isNaN(quantity) || quantity < 1) {
                    e.target.value = 1;
                    updateCartQuantity(productId, 1);
                } else {
                    updateCartQuantity(productId, quantity);
                }
                
                renderCartPage();
            });
        });
    }
    
    // Checkout form handling
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    // Initial render
    renderCartPage();
}

/* ============================================================
   CHECKOUT & ORDER PROCESSING
   ============================================================ */

function createWhatsAppOrderMessage(orderData) {
    const { orderNumber, customerName, customerPhone, customerAddress, customerNotes, items, total } = orderData;
    
    let message = `🛍️ *WEBSITE ORDER - ${orderNumber}*%0A%0A`;
    
    // Customer Details
    message += `*Customer Information:*%0A`;
    message += `👤 Name: ${customerName}%0A`;
    message += `📞 Phone: ${customerPhone}%0A`;
    if (customerAddress) {
        message += `📍 Address: ${customerAddress}%0A`;
    }
    message += `%0A`;
    
    // Order Items
    message += `*Order Items:*%0A`;
    items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. *${item.quantity}x* ${item.name}%0A`;
        message += `   ₦${item.price.toLocaleString()} each = ₦${itemTotal.toLocaleString()}%0A`;
    });
    message += `%0A`;
    
    // Order Summary
    message += `*Order Summary:*%0A`;
    message += `📦 Subtotal: ₦${total.toLocaleString()}%0A`;
    message += `🚚 Delivery: To be confirmed%0A`;
    message += `💳 *TOTAL: ₦${total.toLocaleString()}*%0A`;
    message += `%0A`;
    
    // Notes
    if (customerNotes) {
        message += `*Customer Notes:*%0A${customerNotes}%0A%0A`;
    }
    
    message += `Order Date: ${new Date().toLocaleDateString()}%0A`;
    message += `Order Time: ${new Date().toLocaleTimeString()}%0A%0A`;
    message += `*ORDER CONFIRMED VIA WEBSITE*%0A`;
    message += `Please process this order and contact the customer.`;
    
    return message;
}

async function sendOrderToServer(orderData) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to send order to server:', error);
        throw error;
    }
}

function showOrderSuccess(orderNumber, customerName) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.order-success-notification');
    existing.forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'order-success-notification';
    notification.innerHTML = `
        <div class="success-content">
            <h3 style="color: #28a745; margin-bottom: 1rem;">🎉 Order Placed Successfully!</h3>
            <div style="text-align: left; background: #f8f9fa; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                <p style="margin: 0.5rem 0;"><strong>Order #:</strong> ${orderNumber}</p>
                <p style="margin: 0.5rem 0;"><strong>Customer:</strong> ${customerName}</p>
            </div>
            <div style="text-align: left; margin: 1rem 0;">
                <p style="margin: 0.5rem 0; color: #28a745;">✓ Order confirmation sent to your email</p>
                <p style="margin: 0.5rem 0; color: #28a745;">✓ Our team will contact you shortly</p>
            </div>
            <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #1a5276;">
                <h4 style="margin-top: 0; color: #1a5276; font-size: 1.1rem;">📦 Track Your Order</h4>
                <p style="margin: 0.5rem 0; font-size: 0.95rem;">You can track your order status anytime using:</p>
                <p style="margin: 0.5rem 0; font-weight: 600; background: #e8f4fd; padding: 0.5rem; border-radius: 4px;">
                    <strong>Order Number:</strong> ${orderNumber}
                </p>
                <a href="/order-track" class="track-order-btn" style="display: inline-block; background: #1a5276; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 1rem; font-size: 0.95rem;">
                    Track Order Status →
                </a>
            </div>
            <p style="margin-top: 1.5rem; color: #666; font-size: 0.9rem;">
                Redirecting to homepage in 10 seconds...
            </p>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: #2d3748;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 450px;
        width: 90%;
        animation: slideInDown 0.3s ease;
        border: 3px solid #28a745;
    `;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
        
        .track-order-btn:hover {
            background: #2980b9 !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
        
        .track-order-btn:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Add click handler for tracking button
    setTimeout(() => {
        const trackBtn = notification.querySelector('.track-order-btn');
        if (trackBtn) {
            trackBtn.addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.setItem('lastOrderNumber', orderNumber);
                window.location.href = '/order-track';
            });
        }
    }, 100);
    
    // Remove after 15 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
            if (overlay.parentNode) overlay.remove();
        }, 300);
    }, 15000);
}

function handleCheckout(e) {
    e.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const customerEmail = document.getElementById('customer-email')?.value.trim() || '';
    const customerAddress = document.getElementById('customer-address')?.value.trim() || '';
    const customerNotes = document.getElementById('customer-notes')?.value.trim() || '';
    
    if (!customerName || !customerPhone) {
        alert('Please fill in your name and phone number.');
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(customerPhone.replace(/\s/g, ''))) {
        alert('Please enter a valid Nigerian phone number.');
        return;
    }
    
    // Validate email if provided
    if (customerEmail && !isValidEmail(customerEmail)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing Order...';
    submitBtn.disabled = true;
    
    // Generate order number
    const orderNumber = generateOrderNumber();
    const total = getCartTotal();
    
    // Create order data
    const orderData = {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        customerNotes,
        items: cart,
        total: total,
        date: new Date().toISOString()
    };
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppOrderMessage(orderData);
    
    // Try to send to server first
    sendOrderToServer(orderData)
        .then(result => {
            if (result.success) {
                // Clear cart
                clearCart();
                
                // Show success message
                showOrderSuccess(orderNumber, customerName);
                
                // Open WhatsApp
                const whatsappUrl = `https://wa.me/2348129978419?text=${whatsappMessage}`;
                window.open(whatsappUrl, '_blank');
                
                // Redirect to home page after delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 5000);
            } else {
                throw new Error(result.message || 'Failed to create order');
            }
        })
        .catch(error => {
            console.error('Order submission error:', error);
            
            // Fallback: proceed with WhatsApp only
            const proceed = confirm(
                'Order processing encountered an issue. ' +
                'We can proceed with WhatsApp order only. ' +
                'Click OK to continue with WhatsApp, or Cancel to try again.\n\n' +
                'Error: ' + error.message
            );
            
            if (proceed) {
                clearCart();
                const whatsappUrl = `https://wa.me/2348129978419?text=${whatsappMessage}`;
                window.open(whatsappUrl, '_blank');
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
}

/* ============================================================
   UNIVERSAL ADD TO CART EVENT HANDLER
   ============================================================ */

let isHandlingCartClick = false;

document.addEventListener('click', function(e) {
    const addToCartBtn = e.target.closest('.add-to-cart');
    if (!addToCartBtn || isHandlingCartClick) return;
    
    isHandlingCartClick = true;
    
    try {
        // Get product data from button attributes
        const product = {
            id: addToCartBtn.getAttribute('data-id'),
            name: addToCartBtn.getAttribute('data-name'),
            price: parseFloat(addToCartBtn.getAttribute('data-price')),
            image: addToCartBtn.getAttribute('data-image') || '/img/logo.jpg',
            category: addToCartBtn.getAttribute('data-category') || 'general'
        };
        
        // Add to cart
        const success = addToCart(product);
        
        if (success) {
            // Visual feedback on button
            const originalText = addToCartBtn.innerHTML;
            const originalBg = addToCartBtn.style.background;
            
            addToCartBtn.innerHTML = '✓ Added!';
            addToCartBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                addToCartBtn.innerHTML = originalText;
                addToCartBtn.style.background = originalBg;
            }, 1500);
        }
    } catch (error) {
        console.error('Error in add to cart event:', error);
        alert('Error adding to cart. Please try again.');
    } finally {
        setTimeout(() => {
            isHandlingCartClick = false;
        }, 300);
    }
}, true);

/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing CIL Cart System...');
    
    // Initialize cart count
    updateCartCount();
    
    // Initialize cart drawer
    initializeCartDrawer();
    
    // Initialize cart page if on cart page
    if (window.location.pathname.includes('/cart')) {
        initializeCartPage();
    }
    
    // Add CSS animations if not present
    if (!document.querySelector('style#cart-animations')) {
        const style = document.createElement('style');
        style.id = 'cart-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            
            @keyframes slideOutUp {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
            }
        `;
        document.head.appendChild(style);
    }
});

/* ============================================================
   GLOBAL EXPORTS
   ============================================================ */

// Make all functions available globally
window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.getCartItemCount = getCartItemCount;
window.updateCartCount = updateCartCount;
window.renderCartDrawer = renderCartDrawer;
window.openCartDrawer = typeof openCartDrawer !== 'undefined' ? openCartDrawer : function() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer) {
        drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCartDrawer();
    }
};

window.generateOrderNumber = generateOrderNumber;
window.createWhatsAppOrderMessage = createWhatsAppOrderMessage;
window.isValidEmail = isValidEmail;
window.sendOrderToServer = sendOrderToServer;
window.showOrderSuccess = showOrderSuccess;

// Test function
window.testCart = function() {
    console.log('=== CART SYSTEM TEST ===');
    console.log('Cart items:', getCart());
    console.log('Total items:', getCartItemCount());
    console.log('Cart total:', getCartTotal());
    console.log('=== END TEST ===');
};

console.log('CIL Cart System loaded successfully');