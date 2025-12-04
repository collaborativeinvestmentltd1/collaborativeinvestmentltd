console.log('cart-drawer.js loaded');

// Cart Drawer Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartDrawer = document.getElementById('cart-drawer');
    const openCartBtn = document.getElementById('open-cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const cartItemsContainer = document.getElementById('cart-drawer-items');
    const drawerTotal = document.getElementById('drawer-total');

    // Open cart drawer
    if (openCartBtn) {
        openCartBtn.addEventListener('click', function() {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCartDrawer();
        });
    }

    // Close cart drawer
    function closeCartDrawer() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartDrawer);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartDrawer);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartDrawer.classList.contains('active')) {
            closeCartDrawer();
        }
    });

    // Render cart drawer content
    function renderCartDrawer() {
        if (!cartItemsContainer) return;
        
        const cart = getCart();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-drawer-empty">
                    <div class="cart-drawer-empty-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <a href="/shop-all" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            if (drawerTotal) drawerTotal.textContent = '₦0';
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-drawer-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" 
                     class="cart-drawer-item-image" 
                     onerror="this.src='/img/logo.jpg'"
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
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
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (drawerTotal) {
            drawerTotal.textContent = `₦${total.toLocaleString()}`;
        }

        // Attach event listeners
        attachDrawerEventListeners();
    }

    function attachDrawerEventListeners() {
        // Remove buttons
        document.querySelectorAll('.cart-drawer-item-remove').forEach(button => {
            button.addEventListener('click', function(e) {
                const productId = e.target.dataset.id;
                removeFromCart(productId);
                renderCartDrawer();
                updateCartCount();
            });
        });
    }

    // Update cart count in header
    function updateCartCount() {
        const cartCountBadge = document.getElementById('cart-count-badge');
        if (cartCountBadge) {
            const cart = getCart();
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountBadge.textContent = totalItems;
            
            // Show/hide badge
            if (totalItems > 0) {
                cartCountBadge.style.display = 'flex';
            } else {
                cartCountBadge.style.display = 'none';
            }
        }
    }

    // Make functions available globally
    window.renderCartDrawer = renderCartDrawer;
    window.updateCartCount = updateCartCount;

    // Initialize cart count
    updateCartCount();
});

// Fallback getCart function if not defined elsewhere
if (typeof getCart === 'undefined') {
    function getCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error reading cart:', error);
            return [];
        }
    }
    window.getCart = getCart;
}

// Fallback removeFromCart function if not defined elsewhere
if (typeof removeFromCart === 'undefined') {
    function removeFromCart(productId) {
        try {
            const cart = getCart().filter(item => item.id !== productId.toString());
            localStorage.setItem('cart', JSON.stringify(cart));
            // Trigger cart update
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    }
    window.removeFromCart = removeFromCart;
}

// Fallback addToCart function if not defined elsewhere
if (typeof addToCart === 'undefined') {
    function addToCart(product) {
        console.log('Using fallback addToCart function');
        
        if (!product || !product.id || !product.name || !product.price) {
            console.error('Invalid product data:', product);
            return false;
        }
        
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === product.id.toString());
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id.toString(),
                    name: product.name,
                    price: parseFloat(product.price),
                    image: product.image || '/img/logo.jpg',
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
            if (typeof renderCartDrawer === 'function') {
                renderCartDrawer();
            }
            
            // Show notification
            if (typeof showCartNotification === 'function') {
                showCartNotification(product.name);
            } else {
                alert(`Added "${product.name}" to cart!`);
            }
            
            return true;
        } catch (error) {
            console.error('Error in addToCart:', error);
            return false;
        }
    }
    window.addToCart = addToCart;
}