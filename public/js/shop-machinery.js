// Machinery products data
const machineryProducts = [
    {
        id: 13,
        name: "Manual Block-making Machine",
        category: "machinery",
        price: 450000,
        unit: "per unit",
        minOrder: 1,
        image: "/img/machine-fabrication.jpg",
        locations: ["Lagos", "Ibadan"],
        description: "Manual operation block-making machine",
        stock: "in-stock"
    },
    {
        id: 14,
        name: "Automatic Block Machine",
        category: "machinery",
        price: 2500000,
        unit: "per unit",
        minOrder: 1,
        image: "/img/machine-fabrication.jpg",
        locations: ["Lagos"],
        description: "Fully automatic block-making machine",
        stock: "in-stock"
    },
    {
        id: 15,
        name: "Industrial Mixer",
        category: "machinery",
        price: 850000,
        unit: "per unit",
        minOrder: 1,
        image: "/img/machine-fabrication.jpg",
        locations: ["Lagos", "Port Harcourt"],
        description: "Heavy-duty industrial mixer",
        stock: "in-stock"
    },
    {
        id: 16,
        name: "Block Curing System",
        category: "machinery",
        price: 1200000,
        unit: "per unit",
        minOrder: 1,
        image: "/img/machine-fabrication.jpg",
        locations: ["Lagos"],
        description: "Automated block curing system",
        stock: "in-stock"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('products-grid') || document.querySelector('.products-grid');
    if (!grid) {
        console.log('Machinery products grid not found, skipping initialization');
        return;
    }
    renderProducts();
    setupMobileMenu();
});

function renderProducts() {
    const grid = document.getElementById('products-grid');
    
    grid.innerHTML = machineryProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="product-content">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">${product.name}</h3>
                
                <div class="product-meta">
                    <div class="product-stock">
                        <span class="stock-dot ${product.stock === 'in-stock' ? 'stock-in' : product.stock === 'low-stock' ? 'stock-low' : 'stock-out'}"></span>
                        ${product.stock === 'in-stock' ? 'In Stock' : product.stock === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </div>
                    <div>Min: ${product.minOrder}</div>
                </div>
                
                <div class="product-price">₦${product.price.toLocaleString()}</div>
                <div class="product-unit">${product.unit}</div>
                
                <div class="product-actions">
                    <button class="btn-cart" onclick="addToCart(${product.id})" ${product.stock === 'out-of-stock' ? 'disabled' : ''}>
                        ${product.stock === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <a href="https://wa.me/2348129978419?text=I'm interested in ${encodeURIComponent(product.name)} - ₦${product.price} ${product.unit}" 
                       class="btn-whatsapp" target="_blank">
                        💬 WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navLinks.classList.remove('active');
        }
    });
}

function addToCart(productId) {
    const product = machineryProducts.find(p => p.id === productId);
    if (product) {
        const message = `I want to order: ${product.name} - ₦${product.price} ${product.unit}. Min order: ${product.minOrder}`;
        window.open(`https://wa.me/2348129978419?text=${encodeURIComponent(message)}`, '_blank');
    }
}