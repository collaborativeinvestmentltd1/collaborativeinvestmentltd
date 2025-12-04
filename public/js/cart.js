// Cart Utility Functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

function addToCart(product) {
    // Validate product data
    if (!product || !product.id || !product.name || !product.price) {
        console.error('Invalid product data:', product);
        return;
    }
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id.toString(), // Ensure ID is string for consistency
            name: product.name,
            price: parseFloat(product.price),
            image: product.image || '/img/placeholder-product.jpg',
            quantity: 1
        });
    }
    
    saveCart(cart);
    showCartNotification(product.name);
    
    // Update cart drawer if open
    if (typeof renderCartDrawer === 'function') {
        renderCartDrawer();
    }
}

function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CIL-${timestamp.slice(-6)}-${random}`;
}

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

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced success notification with tracking
function showOrderSuccess(orderNumber, customerName) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.order-success-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Add tracking link HTML
    const trackingHTML = `
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
    `;
    
    // Create success notification
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
            ${trackingHTML}
            <p style="margin-top: 1.5rem; color: #666; font-size: 0.9rem;">
                Redirecting to homepage in 10 seconds...
            </p>
        </div>
    `;
    
    // Add styles
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
    
    // Add overlay
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
                // Save order number for tracking page
                sessionStorage.setItem('lastOrderNumber', orderNumber);
                window.location.href = '/order-track';
            });
        }
    }, 100);
    
    // Remove after 10 seconds (increased from 5)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutUp 0.3s ease';
            overlay.style.opacity = '0';
            
            // Add slide out animation
            const slideOutStyle = document.createElement('style');
            slideOutStyle.textContent = `
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
            document.head.appendChild(slideOutStyle);
            
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 300);
        }
    }, 15000); // 15 seconds
}
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: #2d3748;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        width: 90%;
        text-align: center;
        border: 3px solid #28a745;
        animation: slideInDown 0.3s ease;
    `;
    
    // Add overlay
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
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
        overlay.remove();
    }, 15000); // 15 seconds

// Send order to server
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

function showCartNotification(productName) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span>✓ Added ${productName} to cart</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Cart Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const emptyCartContainer = document.getElementById('empty-cart-container');
    const checkoutForm = document.getElementById('checkout-form');

    function renderCart() {
        if (!cartItemsContainer) return;
        
        const cart = getCart();

        if (cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
            if (emptyCartContainer) emptyCartContainer.style.display = 'block';
            return;
        }

        cartItemsContainer.style.display = 'block';
        if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';
        if (emptyCartContainer) emptyCartContainer.style.display = 'none';

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='/img/logo.jpg'">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                    <div class="cart-item-quantity">
                        <label for="qty-${item.id}">Quantity:</label>
                        <input type="number" id="qty-${item.id}" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    </div>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-total">₦${(item.price * item.quantity).toLocaleString()}</p>
                    <button class="remove-item-btn" data-id="${item.id}">&times; Remove</button>
                </div>
            </div>
        `).join('');

        updateCartSummary();
        attachEventListeners();
    }

    function updateCartSummary() {
        const cart = getCart();
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        const subtotalElement = document.getElementById('cart-subtotal');
        const totalElement = document.getElementById('cart-total');
        
        if (subtotalElement) subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `₦${subtotal.toLocaleString()}`;
    }

    function attachEventListeners() {
        // Remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                removeFromCart(productId);
                renderCart();
            });
        });

        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.id;
                const quantity = parseInt(e.target.value);
                
                if (isNaN(quantity) || quantity < 1) {
                    e.target.value = 1;
                    updateCartQuantity(productId, 1);
                } else {
                    updateCartQuantity(productId, quantity);
                }
                
                renderCart();
            });
        });
    }

    // Enhanced checkout form handler
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
            total: total
        };
        
        // Create WhatsApp message
        const whatsappMessage = createWhatsAppOrderMessage(orderData);
        
        // Send order to server first
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
                
                // Fallback: proceed with WhatsApp only if server fails
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

    // Initialize cart page
    if (cartItemsContainer) {
        renderCart();
    }

    // Attach checkout form handler
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
});

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});

// Make functions available globally
window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.generateOrderNumber = generateOrderNumber;
window.createWhatsAppOrderMessage = createWhatsAppOrderMessage;
window.isValidEmail = isValidEmail;
window.sendOrderToServer = sendOrderToServer;
window.showOrderSuccess = showOrderSuccess;

// Test function to check cart data
function testCartData() {
    console.log('=== CART DATA TEST ===');
    const rawCart = localStorage.getItem('cart');
    console.log('Raw localStorage cart:', rawCart);
    
    try {
        const parsed = JSON.parse(rawCart || '[]');
        console.log('Parsed cart:', parsed);
        console.log('Number of items:', parsed.length);
    } catch (e) {
        console.error('Failed to parse cart:', e);
    }
    console.log('=== END TEST ===');
}

// Run test on cart page load
if (window.location.pathname.includes('/cart')) {
    setTimeout(testCartData, 1000);
}