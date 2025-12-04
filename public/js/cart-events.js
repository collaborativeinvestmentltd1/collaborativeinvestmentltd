// cart-events.js - Single source of truth for cart events
console.log('cart-events.js loaded');

// Global click handler for ALL add-to-cart buttons
let isHandlingClick = false;

document.addEventListener('click', async function(e) {
    const addToCartBtn = e.target.closest('.add-to-cart');
    if (!addToCartBtn || isHandlingClick) return;
    
    isHandlingClick = true;
    
    try {
        // Get product data
        const product = {
            id: addToCartBtn.getAttribute('data-id'),
            name: addToCartBtn.getAttribute('data-name'),
            price: parseFloat(addToCartBtn.getAttribute('data-price')),
            image: addToCartBtn.getAttribute('data-image') || '/img/logo.jpg'
        };
        
        console.log('Adding to cart:', product);
        
        // Get current cart
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('cart') || '[]');
        } catch (err) {
            console.error('Error reading cart:', err);
            cart = [];
        }
        
        // Check if item exists
        const existingIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
            console.log('Incremented quantity for existing item');
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
            console.log('Added new item to cart');
        }
        
        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        const cartBadge = document.getElementById('cart-count-badge');
        if (cartBadge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        // Show notification
        const notification = document.createElement('div');
        notification.textContent = `✓ Added ${product.name} to cart`;
        notification.style.cssText = 'position:fixed;top:100px;right:20px;background:#28a745;color:white;padding:1rem;border-radius:8px;z-index:10000;';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        
        console.log('Cart updated successfully. Total items:', cart.length);
        
    } catch (error) {
        console.error('Error in add to cart:', error);
        alert('Error adding to cart. Please try again.');
    } finally {
        setTimeout(() => {
            isHandlingClick = false;
        }, 300);
    }
}, true); // Use capture phase