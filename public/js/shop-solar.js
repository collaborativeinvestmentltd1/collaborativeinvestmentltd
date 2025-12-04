// Solar products data
const solarProducts = [
    {
        id: 28,
        name: "Solar Panels (300W Mono)",
        category: "solar",
        price: 45000,
        unit: "per panel",
        minOrder: 1,
        image: "/img/solar-panel.jpg",
        locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
        description: "High-efficiency 300W monocrystalline solar panels",
        stock: "in-stock"
    },
    {
        id: 29,
        name: "Solar Inverter (5KVA)",
        category: "solar",
        price: 185000,
        unit: "per unit",
        minOrder: 1,
        image: "/img/solar-inverter.jpg",
        locations: ["Lagos", "Abuja", "Port Harcourt"],
        description: "Pure sine wave 5KVA solar inverter with MPPT",
        stock: "in-stock"
    },
    {
        id: 30,
        name: "Solar Batteries (200AH)",
        category: "solar",
        price: 95000,
        unit: "per battery",
        minOrder: 1,
        image: "/img/solar-battery.jpg",
        locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
        description: "Deep cycle 200AH solar batteries for energy storage",
        stock: "in-stock"
    },
    {
        id: 31,
        name: "Solar Charge Controller (60A MPPT)",
        category: "solar",
        price: 65000,
        unit: "per unit",
        minOrder: 1,
        image: "/img/solar-controller.jpg",
        locations: ["Lagos", "Abuja", "Port Harcourt"],
        description: "MPPT solar charge controller 60A",
        stock: "in-stock"
    },
    {
        id: 32,
        name: "Complete Solar Home System (3KVA)",
        category: "solar",
        price: 650000,
        unit: "per system",
        minOrder: 1,
        image: "/img/solar-system.jpg",
        locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
        description: "Complete 3KVA solar power system with installation",
        stock: "in-stock"
    },
    {
        id: 33,
        name: "Solar Installation Service",
        category: "solar",
        price: 75000,
        unit: "per installation",
        minOrder: 1,
        image: "/img/solar-installation.jpg",
        locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
        description: "Professional solar system installation",
        stock: "in-stock"
    },
    {
        id: 34,
        name: "Solar Street Lights",
        category: "solar",
        price: 35000,
        unit: "per unit",
        minOrder: 4,
        image: "/img/solar-streetlight.jpg",
        locations: ["Lagos", "Abuja", "Port Harcourt"],
        description: "Automatic solar-powered street lights",
        stock: "in-stock"
    },
    {
        id: 35,
        name: "Solar Water Heater",
        category: "solar",
        price: 120000,
        unit: "per system",
        minOrder: 1,
        image: "/img/solar-water-heater.jpg",
        locations: ["Lagos", "Abuja"],
        description: "Solar thermal water heating system",
        stock: "in-stock"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('products-grid') || document.querySelector('.products-grid');
    if (!grid) {
        console.log('Solar products grid not found, skipping initialization');
        return;
    }
    renderProducts();
    setupMobileMenu();
});

function renderProducts() {
    const grid = document.getElementById('products-grid');
    
    grid.innerHTML = solarProducts.map(product => `
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
    const product = solarProducts.find(p => p.id === productId);
    if (product) {
        const message = `I want to order: ${product.name} - ₦${product.price} ${product.unit}. Min order: ${product.minOrder}`;
        window.open(`https://wa.me/2348129978419?text=${encodeURIComponent(message)}`, '_blank');
    }
}