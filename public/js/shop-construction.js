// shop-construction.js - Complete Construction Products Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Construction page loaded - initializing...');
    
    // Debug: Check if cart functions are available
    console.log('Cart functions check:', {
        addToCart: typeof window.addToCart,
        showCartNotification: typeof window.showCartNotification,
        getCart: typeof window.getCart
    });
    
    // Check if we're on a construction page
    const constructionElements = document.querySelector('.construction-products, [data-page="construction"], .category-header');
    if (!constructionElements) {
        console.log('Not on construction page, skipping initialization');
        return;
    }

    // Construction products data
    const constructionProducts = [
        {
            id: 'con-001',
            name: 'Hollow Sandcrete Blocks',
            category: 'construction',
            subcategory: 'blocks',
            price: 300,
            image: '/img/construction/hollow-sandcrete-blocks.jpg',
            description: 'Standard hollow blocks with cavities, ideal for load-bearing walls.',
            stock: 'In Stock',
            minOrder: '100 blocks',
            unit: 'per block',
            tags: ['blocks', 'construction', 'hollow']
        },
        {
            id: 'con-002',
            name: 'Solid Sandcrete Blocks',
            category: 'construction',
            subcategory: 'blocks',
            price: 350,
            image: '/img/construction/solid-sandcrete-blocks.jpg',
            description: 'Dense, solid blocks with no cavities for maximum strength.',
            stock: 'In Stock',
            minOrder: '100 blocks',
            unit: 'per block',
            tags: ['blocks', 'construction', 'solid']
        },
        {
            id: 'con-003',
            name: 'Interlocking Blocks',
            category: 'construction',
            subcategory: 'blocks',
            price: 425,
            image: '/img/construction/interlocking-blocks.jpg',
            description: 'Specially designed blocks that lock together without mortar.',
            stock: 'In Stock',
            minOrder: '100 blocks',
            unit: 'per block',
            tags: ['blocks', 'construction', 'interlocking']
        },
        {
            id: 'con-004',
            name: 'Paving Blocks',
            category: 'construction',
            subcategory: 'blocks',
            price: 750,
            image: '/img/construction/paving-blocks.jpg',
            description: 'Durable blocks designed for outdoor flooring and driveways.',
            stock: 'In Stock',
            minOrder: '10 sqm',
            unit: 'per sqm',
            tags: ['blocks', 'paving', 'outdoor']
        },
        {
            id: 'con-005',
            name: 'Dangote Cement',
            category: 'construction',
            subcategory: 'materials',
            price: 4850,
            image: '/img/construction/dangote-cement.jpg',
            description: 'High-quality 42.5 grade cement for all construction purposes.',
            stock: 'In Stock',
            minOrder: '1 bag',
            unit: 'per bag',
            tags: ['cement', 'construction', 'dangote']
        },
        {
            id: 'con-006',
            name: 'Lafarge Cement',
            category: 'construction',
            subcategory: 'materials',
            price: 4950,
            image: '/img/construction/lafarge-cement.jpg',
            description: 'Premium cement with excellent strength and durability.',
            stock: 'In Stock',
            minOrder: '1 bag',
            unit: 'per bag',
            tags: ['cement', 'construction', 'lafarge']
        },
        {
            id: 'con-007',
            name: 'Sharp Sand',
            category: 'construction',
            subcategory: 'materials',
            price: 30000,
            image: '/img/construction/sharp-sand.jpg',
            description: 'Coarse sand suitable for concrete mixing and construction.',
            stock: 'In Stock',
            minOrder: '1 truck',
            unit: 'per truck',
            tags: ['sand', 'construction', 'materials']
        },
        {
            id: 'con-008',
            name: 'Granite/Gravel',
            category: 'construction',
            subcategory: 'materials',
            price: 42500,
            image: '/img/construction/granite.jpg',
            description: 'Crushed stone aggregate for concrete and foundation works.',
            stock: 'In Stock',
            minOrder: '1 truck',
            unit: 'per truck',
            tags: ['granite', 'gravel', 'construction']
        },
        {
            id: 'con-009',
            name: 'Custom Table',
            category: 'construction',
            subcategory: 'custom',
            price: 110000,
            image: '/img/construction/custom-table.jpg',
            description: 'Handcrafted custom table designed to your specifications.',
            stock: 'Made to Order',
            minOrder: '1 unit',
            unit: 'per unit',
            tags: ['custom', 'table', 'furniture']
        },
        {
            id: 'con-010',
            name: 'Custom Hanger for Boutique',
            category: 'construction',
            subcategory: 'custom',
            price: 90000,
            image: '/img/construction/custom-hanger.jpg',
            description: 'Premium custom clothing hangers for boutique displays.',
            stock: 'Made to Order',
            minOrder: '1 set',
            unit: 'per set',
            tags: ['custom', 'hanger', 'boutique']
        },
        {
            id: 'con-011',
            name: 'Basketball Court - Half Court',
            category: 'construction',
            subcategory: 'courts',
            price: 550000,
            image: '/img/construction/basketball-half-court.jpg',
            description: 'Professional half basketball court construction.',
            stock: 'Made to Order',
            minOrder: '1 court',
            unit: 'per court',
            tags: ['basketball', 'court', 'sports']
        },
        {
            id: 'con-012',
            name: 'Basketball Court - Full Standard',
            category: 'construction',
            subcategory: 'courts',
            price: 1025000,
            image: '/img/construction/basketball-full-court.jpg',
            description: 'FIBA standard full basketball court construction.',
            stock: 'Made to Order',
            minOrder: '1 court',
            unit: 'per court',
            tags: ['basketball', 'court', 'professional']
        },
        {
            id: 'con-013',
            name: 'Basketball Court - Full Premium',
            category: 'construction',
            subcategory: 'courts',
            price: 2000000,
            image: '/img/construction/basketball-premium-court.jpg',
            description: 'Premium basketball court with full amenities.',
            stock: 'Made to Order',
            minOrder: '1 court',
            unit: 'per court',
            tags: ['basketball', 'premium', 'sports']
        }
    ];

    // DOM Elements with null checks
    const productsGrid = document.getElementById('products-grid') || document.querySelector('.products-grid');
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const productCount = document.getElementById('product-count');

    // Filter variables
    let filteredProducts = [...constructionProducts];
    let currentCategory = 'all';

    // Initialize the page
    function initialize() {
        console.log('Initializing construction page...');
        
        if (productsGrid) {
            renderProducts();
        } else {
            console.log('Products grid not found on this page');
        }
        
        setupEventListeners();
        setupMobileMenu();
    }

    // Set up event listeners with null checks
    function setupEventListeners() {
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterProducts();
            });
        }

        // Category filter
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                currentCategory = this.value;
                filterProducts();
            });
        }

        // Add to cart buttons (delegated)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.dataset.id;
                const product = constructionProducts.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            }
        });
    }

    // Filter products based on search and category
    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        filteredProducts = constructionProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm) ||
                                product.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = currentCategory === 'all' || product.subcategory === currentCategory;
            
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

        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-category="${product.subcategory}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy"
                         onerror="this.src='/img/logo.jpg'">
                    <span class="stock-badge ${getStockClass(product.stock)}">${product.stock}</span>
                    <span class="category-tag">${formatCategoryName(product.subcategory)}</span>
                </div>
                
                <div class="product-content">
                    <div class="product-category">${formatCategoryName(product.subcategory)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    
                    <div class="product-meta">
                        <div class="product-stock">
                            <span class="stock-dot ${getStockClass(product.stock)}"></span>
                            ${product.stock}
                        </div>
                        <div class="min-order">Min: ${product.minOrder}</div>
                    </div>
                    
                    <div class="product-price">₦${product.price.toLocaleString()}</div>
                    <div class="product-unit">${product.unit}</div>
                    
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" 
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image}">
                            Add to Cart
                        </button>
                        <a href="https://wa.me/2348129978419?text=I'm interested in ${encodeURIComponent(product.name)} - ₦${product.price.toLocaleString()} ${product.unit}. Min order: ${product.minOrder}" 
                           class="btn btn-whatsapp" target="_blank">
                            💬 WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

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
            const totalProducts = constructionProducts.length;
            const showingProducts = filteredProducts.length;
            productCount.textContent = `Showing ${showingProducts} of ${totalProducts} construction products`;
        }
    }

    // Get stock class for styling
    function getStockClass(stock) {
        if (stock === 'In Stock') return 'stock-in';
        if (stock === 'Limited Stock') return 'stock-low';
        if (stock === 'Made to Order') return 'stock-out';
        return 'stock-in';
    }

    // Format category name for display
    function formatCategoryName(category) {
        const names = {
            'blocks': 'Blocks',
            'materials': 'Materials',
            'custom': 'Custom',
            'courts': 'Sports Courts'
        };
        return names[category] || category;
    }

    // Add to cart functionality
    function addToCart(product) {
        // Validate product data
        if (!product || !product.id || !product.name || !product.price) {
            console.error('Invalid product data:', product);
            return;
        }

        // Create cart product object
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || '/img/logo.jpg',
            quantity: 1
        };

        // Use the global addToCart function if available
        if (typeof window.addToCart === 'function') {
            window.addToCart(cartProduct);
        } else {
            // Fallback: show alert
            alert(`Added ${product.name} to cart! Price: ₦${product.price.toLocaleString()}\n\nFor complete order processing, please contact us via WhatsApp or call.`);
        }
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
});

function testAddToCart() {
    const testProduct = {
        id: 'test-con-001',
        name: 'Test Construction Product',
        price: 5000,
        image: '/img/logo.jpg',
        quantity: 1
    };
    
    console.log('Testing addToCart with:', testProduct);
    
    if (typeof window.addToCart === 'function') {
        const result = window.addToCart(testProduct);
        console.log('addToCart result:', result);
        alert('Test product added to cart! Check cart icon.');
    } else {
        console.error('addToCart function not found!');
        alert('Error: Cart functions not loaded. Check console.');
    }
}

// Add CSS variables if not defined
if (!document.querySelector(':root').style.getPropertyValue('--primary')) {
    document.documentElement.style.setProperty('--primary', '#1a5276');
    document.documentElement.style.setProperty('--secondary', '#f39c12');
    document.documentElement.style.setProperty('--accent', '#2980b9');
    document.documentElement.style.setProperty('--light', '#f8f9fa');
    document.documentElement.style.setProperty('--dark', '#2c3e50');
    document.documentElement.style.setProperty('--success', '#27ae60');
    document.documentElement.style.setProperty('--warning', '#f39c12');
    document.documentElement.style.setProperty('--danger', '#e74c3c');
    document.documentElement.style.setProperty('--gray', '#7f8c8d');
    document.documentElement.style.setProperty('--light-gray', '#ecf0f1');
}

console.log('Construction page JavaScript loaded successfully');