// shop-machinery.js - Complete Machinery Products Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Machinery page loaded - initializing...');
    
    // Check if we're on a machinery page
    const machineryElements = document.querySelector('.machinery-products, [data-page="machinery"], .category-header');
    if (!machineryElements) {
        console.log('Not on machinery page, skipping initialization');
        return;
    }

    // Machinery products data - COMPLETELY CONSISTENT STRUCTURE
    const machineryProducts = [
        // =========== BLOCK MAKING MACHINES ===========
        {
            id: 'mach-block-001',
            name: "Manual Block Making Machine (2 Blocks)",
            category: "machines",
            subcategory: "manual",
            price: 450000,
            basePrice: 450000,
            image: "/img/machinery/manual-block-machine.jpg",
            description: "Manual operation block-making machine producing 2 blocks per cycle, perfect for small businesses.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per machine",
            specs: {
                capacity: "2 blocks/cycle",
                production: "300-500 blocks/day",
                power: "Manual operation",
                blockTypes: "6\", 9\" hollow/solid blocks",
                warranty: "3 months",
                weight: "Approx 250kg"
            },
            tags: ['machine', 'manual', 'block-making', 'construction']
        },
        {
            id: 'mach-block-002',
            name: "Semi-Automatic Block Machine (3 Blocks)",
            category: "machines",
            subcategory: "semi-auto",
            price: 950000,
            basePrice: 950000,
            image: "/img/machinery/semi-auto-block-machine.jpg",
            description: "Semi-automatic block machine with motorized vibration for 3 blocks per cycle.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per machine",
            specs: {
                capacity: "3 blocks/cycle",
                production: "800-1200 blocks/day",
                power: "Electric 3HP motor",
                blockTypes: "All standard sizes",
                warranty: "6 months",
                automation: "Motorized vibration"
            },
            tags: ['machine', 'semi-auto', 'block-making', 'construction']
        },
        {
            id: 'mach-block-003',
            name: "Automatic Block Making Machine (5 Blocks)",
            category: "machines",
            subcategory: "auto",
            price: 2500000,
            basePrice: 2500000,
            image: "/img/machinery/automatic-block-machine.jpg",
            description: "Fully automatic hydraulic block machine producing 5 blocks per cycle for high-volume production.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per machine",
            specs: {
                capacity: "5 blocks/cycle",
                production: "2000-3000 blocks/day",
                power: "Electric 10HP",
                blockTypes: "All types including paving blocks",
                warranty: "1 year",
                automation: "Fully automatic hydraulic"
            },
            tags: ['machine', 'automatic', 'hydraulic', 'block-making']
        },
        {
            id: 'mach-block-004',
            name: "Mobile Block Making Machine",
            category: "machines",
            subcategory: "mobile",
            price: 1850000,
            basePrice: 1850000,
            image: "/img/machinery/mobile-block-machine.jpg",
            description: "Mobile block machine with diesel engine for on-site production, trailer mounted for easy transport.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per machine",
            specs: {
                capacity: "4 blocks/cycle",
                production: "1500-2000 blocks/day",
                power: "Diesel engine",
                mobility: "Trailer mounted",
                warranty: "6 months",
                blockTypes: "6\", 9\" blocks"
            },
            tags: ['machine', 'mobile', 'diesel', 'on-site']
        },

        // =========== INDUSTRIAL MIXERS ===========
        {
            id: 'mach-mixer-001',
            name: "Small Concrete Mixer (200L)",
            category: "mixers",
            subcategory: "concrete",
            price: 350000,
            basePrice: 350000,
            image: "/img/machinery/small-concrete-mixer.jpg",
            description: "Compact concrete mixer suitable for small-scale construction and block production.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per mixer",
            specs: {
                capacity: "200 liters",
                power: "Electric 3HP motor",
                mixing: "Drum rotation type",
                mobility: "Wheel mounted",
                warranty: "3 months",
                output: "0.15 cubic meters/batch"
            },
            tags: ['mixer', 'concrete', 'small', 'construction']
        },
        {
            id: 'mach-mixer-002',
            name: "Medium Concrete Mixer (500L)",
            category: "mixers",
            subcategory: "concrete",
            price: 700000,
            basePrice: 700000,
            image: "/img/machinery/medium-concrete-mixer.jpg",
            description: "Medium capacity mixer for construction sites and commercial block production.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per mixer",
            specs: {
                capacity: "500 liters",
                power: "Electric 7.5HP motor",
                mixing: "Forced action mixing",
                features: "Tilting drum for easy discharge",
                warranty: "6 months",
                output: "0.35 cubic meters/batch"
            },
            tags: ['mixer', 'concrete', 'medium', 'commercial']
        },
        {
            id: 'mach-mixer-003',
            name: "Large Industrial Mixer (1000L)",
            category: "mixers",
            subcategory: "concrete",
            price: 1200000,
            basePrice: 1200000,
            image: "/img/machinery/large-industrial-mixer.jpg",
            description: "Heavy-duty industrial mixer for high-volume block production and large construction projects.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per mixer",
            specs: {
                capacity: "1000 liters",
                power: "Electric 15HP or Diesel option",
                mixing: "Planetary action for thorough mixing",
                automation: "Auto discharge system",
                warranty: "1 year",
                output: "0.7 cubic meters/batch"
            },
            tags: ['mixer', 'industrial', 'large', 'heavy-duty']
        },
        {
            id: 'mach-mixer-004',
            name: "Mortar Mixer (150L)",
            category: "mixers",
            subcategory: "mortar",
            price: 250000,
            basePrice: 250000,
            image: "/img/machinery/mortar-mixer.jpg",
            description: "Specialized mortar mixer for plaster and mortar production with paddle mixing action.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per mixer",
            specs: {
                capacity: "150 liters",
                power: "Electric 2HP motor",
                application: "Mortar and plaster mixing",
                features: "Paddle mixing for smooth consistency",
                warranty: "3 months",
                portability: "Compact and mobile"
            },
            tags: ['mixer', 'mortar', 'plaster', 'specialized']
        },

        // =========== BLOCK CURING & PROCESSING ===========
        {
            id: 'mach-curing-001',
            name: "Block Curing System",
            category: "processing",
            subcategory: "curing",
            price: 1200000,
            basePrice: 1200000,
            image: "/img/machinery/block-curing-system.jpg",
            description: "Automated block curing system with temperature and humidity control for optimal block hardening.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per system",
            specs: {
                capacity: "Up to 3000 blocks",
                control: "Temperature and humidity control",
                automation: "Fully automated",
                material: "Insulated panels",
                warranty: "1 year",
                efficiency: "Reduces curing time by 70%"
            },
            tags: ['curing', 'system', 'automated', 'processing']
        },
        {
            id: 'mach-curing-002',
            name: "Block Vibrator Table",
            category: "processing",
            subcategory: "vibrating",
            price: 185000,
            basePrice: 185000,
            image: "/img/machinery/vibrator-table.jpg",
            description: "Vibration table for compacting blocks and improving density with adjustable vibration settings.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per table",
            specs: {
                size: "6x4 feet standard",
                vibration: "Adjustable frequency",
                power: "Electric motor",
                capacity: "Up to 500kg load",
                warranty: "6 months",
                application: "Block compaction"
            },
            tags: ['vibrator', 'table', 'compaction', 'processing']
        },
        {
            id: 'mach-curing-003',
            name: "Block Stacking Machine",
            category: "processing",
            subcategory: "stacking",
            price: 225000,
            basePrice: 225000,
            image: "/img/machinery/block-stacking-machine.jpg",
            description: "Mechanical stacking machine for arranging blocks after production, available in manual or automatic versions.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per machine",
            specs: {
                type: "Manual/Semi-auto/Auto options",
                capacity: "Up to 1000 blocks/hour",
                power: "Electric/Hydraulic options",
                operation: "Easy to operate",
                warranty: "6 months",
                efficiency: "Reduces labor by 80%"
            },
            tags: ['stacking', 'machine', 'automation', 'processing']
        },

        // =========== SUPPORT EQUIPMENT ===========
        {
            id: 'mach-support-001',
            name: "Sand Sieving Machine",
            category: "support",
            subcategory: "sieving",
            price: 185000,
            basePrice: 185000,
            image: "/img/machinery/sand-sieve-machine.jpg",
            description: "Vibratory sand sieving machine for removing impurities and ensuring consistent sand quality.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per machine",
            specs: {
                capacity: "3-5 tons/hour",
                mesh: "Multiple mesh sizes available",
                power: "Electric motor",
                efficiency: "High screening efficiency",
                warranty: "6 months",
                application: "Sand cleaning and grading"
            },
            tags: ['sieving', 'sand', 'cleaning', 'support']
        },
        {
            id: 'mach-support-002',
            name: "Block Conveyor System",
            category: "support",
            subcategory: "conveyor",
            price: 285000,
            basePrice: 285000,
            image: "/img/machinery/block-conveyor.jpg",
            description: "Belt conveyor system for moving blocks through production line, available in various lengths.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per system",
            specs: {
                length: "10-50 meters customizable",
                belt: "Industrial rubber conveyor belt",
                power: "Electric motor with variable speed",
                capacity: "Heavy duty construction",
                warranty: "6 months",
                application: "Material handling"
            },
            tags: ['conveyor', 'system', 'transport', 'support']
        },
        {
            id: 'mach-support-003',
            name: "Cement Storage Silo",
            category: "support",
            subcategory: "storage",
            price: 325000,
            basePrice: 325000,
            image: "/img/machinery/cement-silo.jpg",
            description: "Large capacity cement storage silo with discharge system for automated cement handling.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per silo",
            specs: {
                capacity: "15 tons standard",
                material: "Galvanized steel construction",
                discharge: "Auger system with motor",
                features: "Level indicator, safety valves",
                warranty: "1 year",
                protection: "Weatherproof design"
            },
            tags: ['silo', 'storage', 'cement', 'support']
        },
        {
            id: 'mach-support-004',
            name: "Water Pump System",
            category: "support",
            subcategory: "pump",
            price: 125000,
            basePrice: 125000,
            image: "/img/machinery/water-pump-system.jpg",
            description: "High-pressure water pump system for block production water supply with adjustable flow control.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per system",
            specs: {
                power: "1-5 HP options",
                pressure: "High pressure output",
                flow: "Adjustable flow control",
                type: "Centrifugal pump",
                warranty: "6 months",
                application: "Water supply for production"
            },
            tags: ['pump', 'water', 'system', 'support']
        },

        // =========== ACCESSORIES & TOOLS ===========
        {
            id: 'mach-accessory-001',
            name: "Block Mold Set",
            category: "accessories",
            subcategory: "molds",
            price: 85000,
            basePrice: 85000,
            image: "/img/machinery/block-mold-set.jpg",
            description: "Complete set of block molds for various block sizes and shapes including hollow, solid, and paving blocks.",
            stock: "In Stock",
            minOrder: "1 set",
            unit: "per set",
            specs: {
                molds: "6 different sizes included",
                material: "Steel construction for durability",
                shapes: "Hollow, solid, and paving options",
                durability: "Long-lasting design",
                warranty: "3 months",
                compatibility: "Fits most block machines"
            },
            tags: ['mold', 'set', 'accessory', 'tools']
        },
        {
            id: 'mach-accessory-002',
            name: "Compressed Air System",
            category: "accessories",
            subcategory: "air",
            price: 185000,
            basePrice: 185000,
            image: "/img/machinery/compressed-air-system.jpg",
            description: "Complete compressed air system for block machine operations including compressor and accessories.",
            stock: "Made to Order",
            minOrder: "1 system",
            unit: "per system",
            specs: {
                compressor: "5-20 HP options",
                tank: "100-500 liter capacity",
                pressure: "8-10 bar working pressure",
                accessories: "Hoses, fittings, regulator",
                warranty: "6 months",
                application: "Pneumatic operations"
            },
            tags: ['air', 'compressor', 'system', 'accessory']
        },
        {
            id: 'mach-accessory-003',
            name: "Block Testing Machine",
            category: "accessories",
            subcategory: "testing",
            price: 225000,
            basePrice: 225000,
            image: "/img/machinery/block-testing-machine.jpg",
            description: "Compression testing machine for block quality control with digital readout and high precision.",
            stock: "Made to Order",
            minOrder: "1 unit",
            unit: "per machine",
            specs: {
                capacity: "100 tons standard",
                display: "Digital LCD readout",
                accuracy: "High precision measurement",
                features: "Data recording capability",
                warranty: "1 year",
                application: "Quality control testing"
            },
            tags: ['testing', 'machine', 'quality', 'accessory']
        },
        {
            id: 'mach-accessory-004',
            name: "Block Production Line",
            category: "accessories",
            subcategory: "complete",
            price: 1850000,
            basePrice: 1850000,
            image: "/img/machinery/block-production-line.jpg",
            description: "Complete automated block production line setup including all machines and conveyor systems.",
            stock: "Made to Order",
            minOrder: "1 line",
            unit: "per production line",
            specs: {
                production: "5000-10000 blocks/day",
                automation: "Fully automated system",
                components: "Complete production setup",
                efficiency: "High production efficiency",
                warranty: "1 year comprehensive",
                support: "Installation and training included"
            },
            tags: ['production', 'line', 'complete', 'automated']
        }
    ];

    // Make products available globally
    if (!window.machineryProducts) {
        window.machineryProducts = machineryProducts;
    }

    // DOM Elements with null checks
    const productsGrid = document.getElementById('products-grid') || document.querySelector('.products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCount = document.getElementById('product-count');
    const searchInput = document.getElementById('product-search');

    // Filter variables
    let filteredProducts = [...machineryProducts];
    let currentCategory = 'all';

    // Initialize the page
    function initialize() {
        console.log('Initializing machinery page...');
        
        if (productsGrid) {
            renderProducts();
        } else {
            console.log('Products grid not found on this page');
        }
        
        setupEventListeners();
        setupMobileMenu();
        updateProductCount();
        
        // Initialize cart count if main.js loaded
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
    }

    // Set up event listeners with null checks
    function setupEventListeners() {
        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                currentCategory = this.getAttribute('data-category');
                filterProducts();
            });
        });

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterProducts();
            });
        }

        // Add to cart buttons (delegated)
        document.addEventListener('click', function(e) {
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.id;
                const product = machineryProducts.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                    
                    // Visual feedback
                    const originalText = addToCartBtn.innerHTML;
                    addToCartBtn.innerHTML = '✓ Added!';
                    addToCartBtn.style.background = '#27ae60';
                    
                    setTimeout(() => {
                        addToCartBtn.innerHTML = originalText;
                        addToCartBtn.style.background = '';
                    }, 1500);
                }
            }
        });
    }

    // Filter products based on category and search
    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        filteredProducts = machineryProducts.filter(product => {
            const matchesSearch = searchTerm === '' || 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
            
            const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
            
            return matchesSearch && matchesCategory;
        });

        renderProducts();
        updateProductCount();
    }

    // Render products to the grid
    function renderProducts() {
        if (!productsGrid) {
            console.log('Products grid not available for rendering');
            return;
        }

        productsGrid.innerHTML = filteredProducts.map(product => {
            const stockClass = getStockClass(product.stock);
            const categoryName = getCategoryDisplayName(product.category);
            
            return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy"
                         onerror="this.src='/img/logo.jpg'; this.alt='${product.name} - Image not available'">
                    <span class="stock-badge ${stockClass}">${product.stock}</span>
                    <span class="category-tag">${categoryName}</span>
                </div>
                
                <div class="product-content">
                    <div class="product-category">${categoryName}</div>
                    <h3 class="product-title">${product.name}</h3>
                    
                    <p class="product-description">${product.description}</p>
                    
                    ${product.specs ? `
                    <div class="product-specs">
                        ${Object.entries(product.specs).slice(0, 3).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    <div class="product-meta">
                        <div class="product-stock">
                            <span class="stock-dot ${stockClass}"></span>
                            ${product.stock}
                        </div>
                        <div class="min-order">Min: ${product.minOrder}</div>
                    </div>
                    
                    <div class="product-price">₦${product.price.toLocaleString()}</div>
                    <div class="product-unit">${product.unit}</div>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" 
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image}"
                                ${product.stock === 'Out of Stock' ? 'disabled' : ''}>
                            ${product.stock === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <a href="https://wa.me/2348129978419?text=I'm interested in ${encodeURIComponent(product.name)} - ₦${product.price.toLocaleString()} ${product.unit}. Min order: ${product.minOrder}" 
                           class="btn btn-whatsapp" target="_blank">
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        // Add animation to products
        animateProducts();
    }

    // Animate product cards
    function animateProducts() {
        const productCards = productsGrid.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Update product count display
    function updateProductCount() {
        if (productCount) {
            const totalProducts = machineryProducts.length;
            const showingProducts = filteredProducts.length;
            productCount.textContent = `Showing ${showingProducts} of ${totalProducts} machinery products`;
        }
    }

    // Get stock class for styling
    function getStockClass(stock) {
        if (stock === 'In Stock') return 'stock-in';
        if (stock === 'Limited Stock') return 'stock-low';
        if (stock === 'Made to Order') return 'stock-custom';
        if (stock === 'Out of Stock') return 'stock-out';
        return 'stock-in';
    }

    // Format category name for display
    function getCategoryDisplayName(category) {
        const categories = {
            'machines': ' Machinery',
            'mixers': ' Mixers',
            'processing': ' Processing',
            'support': ' Support Equipment',
            'accessories': ' Accessories'
        };
        return categories[category] || category;
    }

    // Get main category for shop-all.js compatibility
    function getMainCategory(product) {
        return 'machinery';
    }

    // Add to cart functionality
    function addToCart(product) {
        // Use global function from main.js if available
        if (typeof window.addToCart === 'function') {
            window.addToCart(product);
        } else {
            // Fallback implementation
            console.log('Adding to cart (fallback):', product.name);
            
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    image: product.image || '/img/logo.jpg',
                    quantity: 1,
                    category: product.category
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart badge
            updateCartBadge();
            
            // Show notification
            showCartNotification(product.name);
        }
    }

    // Update cart badge (fallback)
    function updateCartBadge() {
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

            const badge = document.getElementById("cart-count-badge");
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? "inline-flex" : "none";
            }
        } catch (e) {
            console.error("Error updating cart badge:", e);
        }
    }

    // Show cart notification (fallback)
    function showCartNotification(productName) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());
        
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

    // Mobile menu setup
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            });
        }
    }

    // Initialize the page
    initialize();

    // Make functions available globally for shop-all.js
    window.getMainCategory = window.getMainCategory || getMainCategory;
    window.getCategoryDisplayName = window.getCategoryDisplayName || getCategoryDisplayName;
    window.getStockClass = window.getStockClass || getStockClass;
});

// Add CSS animations if not defined
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
    `;
    document.head.appendChild(style);
}

console.log('Machinery page JavaScript loaded successfully');