// shop-construction.js - Complete Construction Products Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Construction page loaded - initializing...');
    
    // Check if we're on a construction page
    const constructionElements = document.querySelector('.construction-products, [data-page="construction"], .category-header');
    if (!constructionElements) {
        console.log('Not on construction page, skipping initialization');
        return;
    }

    // Construction products data - Using the SAME structure as shop-all.js
    const constructionProducts = window.constructionProducts || [
        {
            id: 'con-001',
            name: 'Hollow Sandcrete Blocks',
            category: 'blocks',
            subcategory: 'blocks',
            price: 300,
            basePrice: 300,
            image: '/img/construction/hollow-sandcrete-blocks.jpg',
            description: 'Standard hollow blocks with cavities, ideal for load-bearing walls.',
            stock: 'In Stock',
            minOrder: '100 blocks',
            unit: 'per block',
            tags: ['blocks', 'construction', 'hollow'],
            specs: {
                size: '6 inches (450x225x150mm)',
                type: 'Hollow',
                strength: '3.5N/mm²',
                weight: 'Approx 15kg',
                minOrder: '100 blocks'
            }
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

    // Make products available globally for shop-all.js
    if (!window.constructionProducts) {
        window.constructionProducts = constructionProducts;
    }

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
        
        // Initialize cart count if main.js loaded
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
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
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.id;
                const product = constructionProducts.find(p => p.id === productId);
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

    // Filter products based on search and category
    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        filteredProducts = constructionProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
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
                         onerror="this.src='/img/logo.jpg'">
                    <span class="stock-badge ${stockClass}">${product.stock}</span>
                    <span class="category-tag">${categoryName}</span>
                </div>
                
                <div class="product-content">
                    <div class="product-category">${categoryName}</div>
                    <h3 class="product-title">${product.name}</h3>
                    
                    ${product.specs ? `
                    <div class="product-specs">
                        ${Object.entries(product.specs).slice(0, 2).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-label">${key.replace('_', ' ')}:</span>
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
                        <div class="min-order">Min: ${product.minOrder || 'N/A'}</div>
                    </div>
                    
                    <div class="product-price">₦${product.price.toLocaleString()}</div>
                    <div class="product-unit">${product.unit || ''}</div>
                    
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
    function getCategoryDisplayName(category) {
        const categories = {
            'blocks': 'Blocks',
            'materials': 'Materials',
            'custom': 'Custom',
            'courts': 'Sports Courts',
            'poultry': 'Poultry Equipment',
            'machines': 'Machinery',
            'gates': 'Electric Gates',
            'furniture': 'Metal Furniture'
        };
        return categories[category] || category;
    }

    // Add to cart functionality - using global function if available
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
});
        // CIL CONSTRUCTION PRODUCTS DATA - EXPANDED WITH SIZE OPTIONS
        const constructionProducts = [
            // =========== POULTRY EQUIPMENT (15 products) ===========
            {
                id: 'con-poultry-001',
                name: 'Advanced Battery Cage System',
                category: 'poultry',
                price: 450000,
                basePrice: 450000,
                image: '/img/construction/battery-cage-system.jpg',
                description: 'Modern multi-tier battery cage system for efficient poultry farming with automated feeding.',
                stock: 'Made to Order',
                sizes: {
                    'Small (100 birds)': 285000,
                    'Medium (500 birds)': 450000,
                    'Large (1000 birds)': 785000
                },
                specs: {
                    capacity: '100-1000 birds',
                    material: 'Galvanized steel',
                    features: 'Auto feeders, egg collection'
                },
                tags: ['poultry', 'cages', 'automated']
            },
            {
                id: 'con-poultry-002',
                name: 'Poultry Pen Partition System',
                category: 'poultry',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/poultry-pen-partition.jpg',
                description: 'Modular partition system for creating efficient poultry pens with proper ventilation.',
                stock: 'In Stock',
                sizes: {
                    'Small (10 panels)': 85000,
                    'Medium (25 panels)': 185000,
                    'Large (50 panels)': 325000
                },
                specs: {
                    panels: 'Modular system',
                    material: 'Steel mesh & frame',
                    installation: 'Quick assembly'
                },
                tags: ['poultry', 'pens', 'modular']
            },
            {
                id: 'con-poultry-003',
                name: 'Automatic Feeding System',
                category: 'poultry',
                price: 325000,
                basePrice: 325000,
                image: '/img/construction/feeding-system.jpg',
                description: 'Automated feeding system with timer control for efficient feed distribution.',
                stock: 'Made to Order',
                sizes: {
                    'Small (100ft)': 125000,
                    'Medium (250ft)': 250000,
                    'Large (500ft)': 450000
                },
                specs: {
                    capacity: '100-500 feet',
                    power: 'Electric motor',
                    control: 'Timer automated'
                },
                tags: ['poultry', 'feeding', 'automated']
            },
            {
                id: 'con-poultry-004',
                name: 'Poultry Drinking System',
                category: 'poultry',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/drinking-system.jpg',
                description: 'Automatic drinking system with nipple drinkers for clean water supply.',
                stock: 'In Stock',
                sizes: {
                    'Small (50 birds)': 65000,
                    'Medium (200 birds)': 125000,
                    'Large (500 birds)': 225000
                },
                specs: {
                    type: 'Nipple drinkers',
                    material: 'PVC pipes',
                    features: 'Auto refill'
                },
                tags: ['poultry', 'drinking', 'water']
            },
            {
                id: 'con-poultry-005',
                name: 'Egg Collection System',
                category: 'poultry',
                price: 225000,
                basePrice: 225000,
                image: '/img/construction/egg-collection.jpg',
                description: 'Automated egg collection belts for efficient egg gathering in large farms.',
                stock: 'Made to Order',
                sizes: {
                    'Small (2 rows)': 95000,
                    'Medium (5 rows)': 175000,
                    'Large (10 rows)': 285000
                },
                specs: {
                    capacity: '2-10 rows',
                    material: 'Food-grade belts',
                    speed: 'Adjustable'
                },
                tags: ['poultry', 'eggs', 'collection']
            },
            {
                id: 'con-poultry-006',
                name: 'Poultry Manure Cleaner',
                category: 'poultry',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/manure-cleaner.jpg',
                description: 'Automatic manure cleaning system for maintaining poultry house hygiene.',
                stock: 'Made to Order',
                sizes: {
                    'Small (100ft)': 85000,
                    'Medium (250ft)': 145000,
                    'Large (500ft)': 225000
                },
                specs: {
                    type: 'Conveyor belt',
                    material: 'Stainless steel',
                    power: 'Electric motor'
                },
                tags: ['poultry', 'manure', 'cleaner']
            },
            {
                id: 'con-poultry-007',
                name: 'Poultry Ventilation System',
                category: 'poultry',
                price: 155000,
                basePrice: 155000,
                image: '/img/construction/ventilation-system.jpg',
                description: 'Complete ventilation system with fans and temperature control.',
                stock: 'Made to Order',
                sizes: {
                    'Small (500 sqft)': 65000,
                    'Medium (1500 sqft)': 115000,
                    'Large (3000 sqft)': 195000
                },
                specs: {
                    fans: 'High-capacity',
                    control: 'Thermostat',
                    airflow: 'Adjustable'
                },
                tags: ['poultry', 'ventilation', 'fans']
            },
            {
                id: 'con-poultry-008',
                name: 'Broiler Cage System',
                category: 'poultry',
                price: 325000,
                basePrice: 325000,
                image: '/img/construction/broiler-cage.jpg',
                description: 'Specialized cage system for broiler chicken production.',
                stock: 'Made to Order',
                sizes: {
                    'Small (200 birds)': 125000,
                    'Medium (600 birds)': 250000,
                    'Large (1200 birds)': 425000
                },
                specs: {
                    capacity: '200-1200 birds',
                    material: 'Heavy-duty steel',
                    features: 'Adjustable feeders'
                },
                tags: ['poultry', 'broiler', 'cages']
            },
            {
                id: 'con-poultry-009',
                name: 'Layer Cage System',
                category: 'poultry',
                price: 385000,
                basePrice: 385000,
                image: '/img/construction/layer-cage.jpg',
                description: 'Multi-tier cage system specifically designed for layer hens.',
                stock: 'Made to Order',
                sizes: {
                    'Small (150 birds)': 165000,
                    'Medium (450 birds)': 285000,
                    'Large (900 birds)': 485000
                },
                specs: {
                    capacity: '150-900 birds',
                    tiers: '3-5 tiers',
                    features: 'Egg collection'
                },
                tags: ['poultry', 'layer', 'cages']
            },
            {
                id: 'con-poultry-010',
                name: 'Poultry Incubator',
                category: 'poultry',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/incubator.jpg',
                description: 'Digital egg incubator with temperature and humidity control.',
                stock: 'Made to Order',
                sizes: {
                    'Small (100 eggs)': 95000,
                    'Medium (500 eggs)': 185000,
                    'Large (1000 eggs)': 325000
                },
                specs: {
                    capacity: '100-1000 eggs',
                    control: 'Digital',
                    features: 'Auto-turning'
                },
                tags: ['poultry', 'incubator', 'hatching']
            },
            {
                id: 'con-poultry-011',
                name: 'Brooder House System',
                category: 'poultry',
                price: 225000,
                basePrice: 225000,
                image: '/img/construction/brooder-house.jpg',
                description: 'Complete brooder house setup for chicks with heating system.',
                stock: 'Made to Order',
                sizes: {
                    'Small (200 chicks)': 95000,
                    'Medium (600 chicks)': 175000,
                    'Large (1200 chicks)': 285000
                },
                specs: {
                    capacity: '200-1200 chicks',
                    heating: 'Infrared lamps',
                    control: 'Thermostat'
                },
                tags: ['poultry', 'brooder', 'chicks']
            },
            {
                id: 'con-poultry-012',
                name: 'Feed Storage Silo',
                category: 'poultry',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/feed-silo.jpg',
                description: 'Large capacity feed storage silo with discharge system.',
                stock: 'Made to Order',
                sizes: {
                    'Small (1 ton)': 65000,
                    'Medium (3 tons)': 125000,
                    'Large (5 tons)': 195000
                },
                specs: {
                    capacity: '1-5 tons',
                    material: 'Galvanized steel',
                    discharge: 'Auger system'
                },
                tags: ['poultry', 'feed', 'storage']
            },
            {
                id: 'con-poultry-013',
                name: 'Poultry Lighting System',
                category: 'poultry',
                price: 125000,
                basePrice: 125000,
                image: '/img/construction/poultry-lighting.jpg',
                description: 'Automated lighting system with timer for optimal poultry growth.',
                stock: 'In Stock',
                sizes: {
                    'Small (500 sqft)': 45000,
                    'Medium (1500 sqft)': 95000,
                    'Large (3000 sqft)': 165000
                },
                specs: {
                    lights: 'LED fixtures',
                    control: 'Timer/dimmer',
                    power: 'Energy efficient'
                },
                tags: ['poultry', 'lighting', 'led']
            },
            {
                id: 'con-poultry-014',
                name: 'Poultry Scale System',
                category: 'poultry',
                price: 95000,
                basePrice: 95000,
                image: '/img/construction/poultry-scale.jpg',
                description: 'Digital weighing system for monitoring poultry growth.',
                stock: 'In Stock',
                sizes: {
                    'Small (50kg)': 35000,
                    'Medium (200kg)': 65000,
                    'Large (500kg)': 115000
                },
                specs: {
                    capacity: '50-500kg',
                    accuracy: '±0.1kg',
                    display: 'Digital LCD'
                },
                tags: ['poultry', 'scale', 'weighing']
            },
            {
                id: 'con-poultry-015',
                name: 'Poultry Water Chiller',
                category: 'poultry',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/water-chiller.jpg',
                description: 'Water cooling system for maintaining optimal drinking water temperature.',
                stock: 'Made to Order',
                sizes: {
                    'Small (500L)': 125000,
                    'Medium (1500L)': 225000,
                    'Large (3000L)': 385000
                },
                specs: {
                    capacity: '500-3000 liters',
                    cooling: 'Refrigeration',
                    control: 'Thermostat'
                },
                tags: ['poultry', 'water', 'chiller']
            },

            // =========== BLOCK MACHINES (15 products) ===========
            {
                id: 'con-machine-001',
                name: 'Manual Block Making Machine',
                category: 'machines',
                price: 325000,
                basePrice: 325000,
                image: '/img/construction/manual-block-machine.jpg',
                description: 'Robust manual block machine producing 4-6 blocks per cycle, perfect for small businesses.',
                stock: 'In Stock',
                sizes: {
                    'Small (4 blocks)': 185000,
                    'Medium (6 blocks)': 285000,
                    'Large (8 blocks)': 385000
                },
                specs: {
                    production: '4-8 blocks/cycle',
                    power: 'Manual operation',
                    blocks: 'All standard sizes'
                },
                tags: ['block', 'machine', 'manual']
            },
            {
                id: 'con-machine-002',
                name: 'Automatic Block Making Machine',
                category: 'machines',
                price: 1250000,
                basePrice: 1250000,
                image: '/img/construction/automatic-block-machine.jpg',
                description: 'Fully automatic block making machine with hydraulic system for high-volume production.',
                stock: 'Made to Order',
                sizes: {
                    'Small (1000/day)': 650000,
                    'Medium (3000/day)': 950000,
                    'Large (5000/day)': 1450000
                },
                specs: {
                    production: '1000-5000 blocks/day',
                    power: 'Electric 10-20HP',
                    automation: 'Fully automatic'
                },
                tags: ['block', 'machine', 'automatic']
            },
            {
                id: 'con-machine-003',
                name: 'Hydraulic Block Machine',
                category: 'machines',
                price: 850000,
                basePrice: 850000,
                image: '/img/construction/hydraulic-block-machine.jpg',
                description: 'Heavy-duty hydraulic block machine for producing high-density blocks.',
                stock: 'Made to Order',
                sizes: {
                    'Small (8 blocks)': 450000,
                    'Medium (12 blocks)': 650000,
                    'Large (16 blocks)': 950000
                },
                specs: {
                    production: '8-16 blocks/cycle',
                    pressure: 'High hydraulic',
                    blocks: 'High density'
                },
                tags: ['block', 'machine', 'hydraulic']
            },
            {
                id: 'con-machine-004',
                name: 'Concrete Mixer Machine',
                category: 'machines',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/concrete-mixer.jpg',
                description: 'Electric concrete mixer for consistent mixing of block materials.',
                stock: 'In Stock',
                sizes: {
                    'Small (200L)': 125000,
                    'Medium (500L)': 225000,
                    'Large (1000L)': 385000
                },
                specs: {
                    capacity: '200-1000 liters',
                    power: 'Electric motor',
                    mixing: 'Drum type'
                },
                tags: ['concrete', 'mixer', 'machine']
            },
            {
                id: 'con-machine-005',
                name: 'Block Vibrator Table',
                category: 'machines',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/vibrator-table.jpg',
                description: 'Vibration table for compacting blocks and improving density.',
                stock: 'In Stock',
                sizes: {
                    'Small (4x4ft)': 85000,
                    'Medium (6x4ft)': 135000,
                    'Large (8x4ft)': 225000
                },
                specs: {
                    size: '4x4ft to 8x4ft',
                    vibration: 'Adjustable',
                    power: 'Electric motor'
                },
                tags: ['block', 'vibrator', 'table']
            },
            {
                id: 'con-machine-006',
                name: 'Block Curing Chamber',
                category: 'machines',
                price: 325000,
                basePrice: 325000,
                image: '/img/construction/curing-chamber.jpg',
                description: 'Temperature-controlled curing chamber for block hardening.',
                stock: 'Made to Order',
                sizes: {
                    'Small (500 blocks)': 165000,
                    'Medium (1500 blocks)': 285000,
                    'Large (3000 blocks)': 485000
                },
                specs: {
                    capacity: '500-3000 blocks',
                    control: 'Temperature/humidity',
                    material: 'Insulated panels'
                },
                tags: ['block', 'curing', 'chamber']
            },
            {
                id: 'con-machine-007',
                name: 'Block Stacking Machine',
                category: 'machines',
                price: 225000,
                basePrice: 225000,
                image: '/img/construction/stacking-machine.jpg',
                description: 'Mechanical stacking machine for arranging blocks after production.',
                stock: 'Made to Order',
                sizes: {
                    'Small (manual)': 95000,
                    'Medium (semi-auto)': 175000,
                    'Large (full auto)': 285000
                },
                specs: {
                    type: 'Manual to automatic',
                    capacity: 'Up to 1000 blocks/hr',
                    power: 'Electric/hydraulic'
                },
                tags: ['block', 'stacking', 'machine']
            },
            {
                id: 'con-machine-008',
                name: 'Sand Sieving Machine',
                category: 'machines',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/sand-sieve.jpg',
                description: 'Vibratory sand sieving machine for removing impurities.',
                stock: 'In Stock',
                sizes: {
                    'Small (1 ton/hr)': 85000,
                    'Medium (3 tons/hr)': 145000,
                    'Large (5 tons/hr)': 225000
                },
                specs: {
                    capacity: '1-5 tons/hour',
                    mesh: 'Multiple sizes',
                    power: 'Electric motor'
                },
                tags: ['sand', 'sieving', 'machine']
            },
            {
                id: 'con-machine-009',
                name: 'Block Conveyor System',
                category: 'machines',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/block-conveyor.jpg',
                description: 'Belt conveyor system for moving blocks through production line.',
                stock: 'Made to Order',
                sizes: {
                    'Small (10m)': 125000,
                    'Medium (25m)': 225000,
                    'Large (50m)': 385000
                },
                specs: {
                    length: '10-50 meters',
                    belt: 'Rubber conveyor',
                    power: 'Electric motor'
                },
                tags: ['block', 'conveyor', 'system']
            },
            {
                id: 'con-machine-010',
                name: 'Cement Silo',
                category: 'machines',
                price: 325000,
                basePrice: 325000,
                image: '/img/construction/cement-silo.jpg',
                description: 'Large capacity cement storage silo with discharge system.',
                stock: 'Made to Order',
                sizes: {
                    'Small (5 tons)': 165000,
                    'Medium (15 tons)': 285000,
                    'Large (30 tons)': 485000
                },
                specs: {
                    capacity: '5-30 tons',
                    material: 'Steel construction',
                    discharge: 'Auger system'
                },
                tags: ['cement', 'silo', 'storage']
            },
            {
                id: 'con-machine-011',
                name: 'Water Pump System',
                category: 'machines',
                price: 125000,
                basePrice: 125000,
                image: '/img/construction/water-pump.jpg',
                description: 'High-pressure water pump system for block production.',
                stock: 'In Stock',
                sizes: {
                    'Small (1HP)': 45000,
                    'Medium (3HP)': 95000,
                    'Large (5HP)': 165000
                },
                specs: {
                    power: '1-5 HP',
                    pressure: 'High pressure',
                    flow: 'Adjustable'
                },
                tags: ['water', 'pump', 'system']
            },
            {
                id: 'con-machine-012',
                name: 'Block Mold Set',
                category: 'machines',
                price: 85000,
                basePrice: 85000,
                image: '/img/construction/block-mold.jpg',
                description: 'Set of block molds for various block sizes and shapes.',
                stock: 'In Stock',
                sizes: {
                    'Small (3 molds)': 35000,
                    'Medium (6 molds)': 65000,
                    'Large (12 molds)': 115000
                },
                specs: {
                    molds: '3-12 different sizes',
                    material: 'Steel construction',
                    shapes: 'Various designs'
                },
                tags: ['block', 'mold', 'set']
            },
            {
                id: 'con-machine-013',
                name: 'Compressed Air System',
                category: 'machines',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/air-system.jpg',
                description: 'Compressed air system for block machine operations.',
                stock: 'Made to Order',
                sizes: {
                    'Small (5HP)': 85000,
                    'Medium (10HP)': 145000,
                    'Large (20HP)': 225000
                },
                specs: {
                    compressor: '5-20 HP',
                    tank: '100-500 liters',
                    pressure: '8-10 bar'
                },
                tags: ['air', 'compressor', 'system']
            },
            {
                id: 'con-machine-014',
                name: 'Block Testing Machine',
                category: 'machines',
                price: 225000,
                basePrice: 225000,
                image: '/img/construction/testing-machine.jpg',
                description: 'Compression testing machine for block quality control.',
                stock: 'Made to Order',
                sizes: {
                    'Small (50 tons)': 95000,
                    'Medium (100 tons)': 175000,
                    'Large (200 tons)': 285000
                },
                specs: {
                    capacity: '50-200 tons',
                    display: 'Digital readout',
                    accuracy: 'High precision'
                },
                tags: ['block', 'testing', 'quality']
            },
            {
                id: 'con-machine-015',
                name: 'Block Production Line',
                category: 'machines',
                price: 1850000,
                basePrice: 1850000,
                image: '/img/construction/production-line.jpg',
                description: 'Complete automated block production line setup.',
                stock: 'Made to Order',
                sizes: {
                    'Small (2000/day)': 950000,
                    'Medium (5000/day)': 1450000,
                    'Large (10000/day)': 2250000
                },
                specs: {
                    production: '2000-10000 blocks/day',
                    automation: 'Fully automated',
                    components: 'Complete system'
                },
                tags: ['block', 'production', 'line']
            },

            // =========== SPORTS COURTS (15 products) ===========
            {
                id: 'con-court-001',
                name: 'Standard Basketball Court',
                category: 'courts',
                price: 850000,
                basePrice: 850000,
                image: '/img/construction/basketball-standard-court.jpg',
                description: 'FIBA standard basketball court with professional markings and equipment.',
                stock: 'Made to Order',
                sizes: {
                    'Small (half court)': 450000,
                    'Medium (full court)': 750000,
                    'Large (tournament)': 1250000
                },
                specs: {
                    size: 'Half to full court',
                    surface: 'Concrete/asphalt',
                    features: 'Professional hoops, markings'
                },
                tags: ['basketball', 'court', 'sports']
            },
            {
                id: 'con-court-002',
                name: 'Custom Size Basketball Court',
                category: 'courts',
                price: 650000,
                basePrice: 650000,
                image: '/img/construction/basketball-custom-court.jpg',
                description: 'Custom-sized basketball court designed to fit your available space.',
                stock: 'Made to Order',
                sizes: {
                    'Small (15x12m)': 325000,
                    'Medium (20x15m)': 525000,
                    'Large (28x15m)': 825000
                },
                specs: {
                    size: 'Custom dimensions',
                    surface: 'Various options',
                    flexibility: 'Adapts to space'
                },
                tags: ['basketball', 'court', 'custom']
            },
            {
                id: 'con-court-003',
                name: 'Premium Basketball Court Package',
                category: 'courts',
                price: 1850000,
                basePrice: 1850000,
                image: '/img/construction/basketball-premium-court.jpg',
                description: 'Complete premium package with seating, lighting, and professional equipment.',
                stock: 'Made to Order',
                sizes: {
                    'Small (basic)': 950000,
                    'Medium (standard)': 1450000,
                    'Large (premium)': 2250000
                },
                specs: {
                    size: 'Standard + extras',
                    includes: 'Lighting, seating, scoreboard',
                    quality: 'Professional grade'
                },
                tags: ['basketball', 'premium', 'complete']
            },
            {
                id: 'con-court-004',
                name: 'Volleyball Court',
                category: 'courts',
                price: 450000,
                basePrice: 450000,
                image: '/img/construction/volleyball-court.jpg',
                description: 'Professional volleyball court with official markings and net system.',
                stock: 'Made to Order',
                sizes: {
                    'Small (18x9m)': 225000,
                    'Medium (official)': 350000,
                    'Large (tournament)': 550000
                },
                specs: {
                    size: '18x9m standard',
                    surface: 'Sand or hardcourt',
                    net: 'Professional system'
                },
                tags: ['volleyball', 'court', 'sports']
            },
            {
                id: 'con-court-005',
                name: 'Tennis Court',
                category: 'courts',
                price: 1250000,
                basePrice: 1250000,
                image: '/img/construction/tennis-court.jpg',
                description: 'Professional tennis court with acrylic surface and net system.',
                stock: 'Made to Order',
                sizes: {
                    'Small (practice)': 650000,
                    'Medium (single)': 950000,
                    'Large (double)': 1450000
                },
                specs: {
                    size: '23.77x8.23m',
                    surface: 'Acrylic finish',
                    net: 'Professional posts'
                },
                tags: ['tennis', 'court', 'sports']
            },
            {
                id: 'con-court-006',
                name: 'Badminton Court',
                category: 'courts',
                price: 325000,
                basePrice: 325000,
                image: '/img/construction/badminton-court.jpg',
                description: 'Indoor badminton court with wooden flooring and professional net.',
                stock: 'Made to Order',
                sizes: {
                    'Small (single)': 165000,
                    'Medium (double)': 285000,
                    'Large (tournament)': 485000
                },
                specs: {
                    size: '13.4x6.1m',
                    surface: 'Wooden flooring',
                    net: 'Professional height'
                },
                tags: ['badminton', 'court', 'indoor']
            },
            {
                id: 'con-court-007',
                name: 'Futsal Court',
                category: 'courts',
                price: 650000,
                basePrice: 650000,
                image: '/img/construction/futsal-court.jpg',
                description: 'Indoor futsal court with synthetic turf and proper markings.',
                stock: 'Made to Order',
                sizes: {
                    'Small (25x15m)': 325000,
                    'Medium (38x18m)': 525000,
                    'Large (42x25m)': 825000
                },
                specs: {
                    size: '25-42m length',
                    surface: 'Synthetic turf',
                    goals: 'Professional futsal'
                },
                tags: ['futsal', 'court', 'indoor']
            },
            {
                id: 'con-court-008',
                name: 'Handball Court',
                category: 'courts',
                price: 550000,
                basePrice: 550000,
                image: '/img/construction/handball-court.jpg',
                description: 'Professional handball court with proper markings and goals.',
                stock: 'Made to Order',
                sizes: {
                    'Small (practice)': 275000,
                    'Medium (standard)': 425000,
                    'Large (tournament)': 685000
                },
                specs: {
                    size: '40x20m standard',
                    surface: 'Hardcourt',
                    goals: 'Official size'
                },
                tags: ['handball', 'court', 'sports']
            },
            {
                id: 'con-court-009',
                name: 'Multi-Sport Court',
                category: 'courts',
                price: 950000,
                basePrice: 950000,
                image: '/img/construction/multi-sport-court.jpg',
                description: 'Versatile court for multiple sports with adjustable markings.',
                stock: 'Made to Order',
                sizes: {
                    'Small (30x15m)': 485000,
                    'Medium (40x20m)': 725000,
                    'Large (50x25m)': 1125000
                },
                specs: {
                    sports: 'Basketball, volleyball, futsal',
                    surface: 'Multi-purpose',
                    markings: 'Adjustable'
                },
                tags: ['multi', 'sport', 'court']
            },
            {
                id: 'con-court-010',
                name: 'Court Lighting System',
                category: 'courts',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/court-lighting.jpg',
                description: 'Professional LED lighting system for night sports activities.',
                stock: 'Made to Order',
                sizes: {
                    'Small (4 poles)': 125000,
                    'Medium (6 poles)': 225000,
                    'Large (8 poles)': 385000
                },
                specs: {
                    lights: 'High-power LED',
                    poles: 'Galvanized steel',
                    control: 'Timer/dimmer'
                },
                tags: ['court', 'lighting', 'led']
            },
            {
                id: 'con-court-011',
                name: 'Court Fencing System',
                category: 'courts',
                price: 325000,
                basePrice: 325000,
                image: '/img/construction/court-fencing.jpg',
                description: 'Security fencing system around sports courts.',
                stock: 'Made to Order',
                sizes: {
                    'Small (50m)': 165000,
                    'Medium (100m)': 285000,
                    'Large (150m)': 485000
                },
                specs: {
                    height: '3-4 meters',
                    material: 'Galvanized mesh',
                    gates: 'Included'
                },
                tags: ['court', 'fencing', 'security']
            },
            {
                id: 'con-court-012',
                name: 'Bleacher Seating',
                category: 'courts',
                price: 450000,
                basePrice: 450000,
                image: '/img/construction/bleacher-seating.jpg',
                description: 'Stadium-style bleacher seating for spectators.',
                stock: 'Made to Order',
                sizes: {
                    'Small (50 seats)': 225000,
                    'Medium (100 seats)': 350000,
                    'Large (200 seats)': 550000
                },
                specs: {
                    capacity: '50-200 seats',
                    material: 'Steel/aluminum',
                    design: 'Tiered seating'
                },
                tags: ['court', 'seating', 'bleachers']
            },
            {
                id: 'con-court-013',
                name: 'Scoreboard System',
                category: 'courts',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/scoreboard.jpg',
                description: 'Electronic scoreboard with timer and score display.',
                stock: 'Made to Order',
                sizes: {
                    'Small (LED)': 85000,
                    'Medium (LCD)': 145000,
                    'Large (Video)': 225000
                },
                specs: {
                    display: 'LED/LCD/Video',
                    control: 'Wireless remote',
                    features: 'Timer, score, fouls'
                },
                tags: ['court', 'scoreboard', 'electronic']
            },
            {
                id: 'con-court-014',
                name: 'Court Surface Repair',
                category: 'courts',
                price: 225000,
                basePrice: 225000,
                image: '/img/construction/court-repair.jpg',
                description: 'Professional court surface repair and resurfacing service.',
                stock: 'Service',
                sizes: {
                    'Small (500 sqm)': 95000,
                    'Medium (1000 sqm)': 175000,
                    'Large (2000 sqm)': 285000
                },
                specs: {
                    service: 'Repair/resurface',
                    materials: 'Professional grade',
                    warranty: 'Included'
                },
                tags: ['court', 'repair', 'resurface']
            },
            {
                id: 'con-court-015',
                name: 'Court Maintenance Package',
                category: 'courts',
                price: 125000,
                basePrice: 125000,
                image: '/img/construction/court-maintenance.jpg',
                description: 'Annual maintenance package for sports court facilities.',
                stock: 'Service',
                sizes: {
                    'Small (basic)': 65000,
                    'Medium (standard)': 95000,
                    'Large (premium)': 145000
                },
                specs: {
                    frequency: 'Monthly/quarterly',
                    services: 'Cleaning, inspection, repair',
                    duration: '1 year contract'
                },
                tags: ['court', 'maintenance', 'service']
            },

            // =========== ELECTRIC GATES (15 products) ===========
            {
                id: 'con-gate-001',
                name: 'Sliding Electric Gate',
                category: 'gates',
                price: 450000,
                basePrice: 450000,
                image: '/img/construction/sliding-electric-gate.jpg',
                description: 'Modern sliding electric gate with remote control and safety features.',
                stock: 'Made to Order',
                sizes: {
                    'Small (4m)': 225000,
                    'Medium (6m)': 350000,
                    'Large (8m)': 550000
                },
                specs: {
                    type: 'Sliding',
                    power: 'Electric motor',
                    control: 'Remote & manual'
                },
                tags: ['gate', 'electric', 'sliding']
            },
            {
                id: 'con-gate-002',
                name: 'Swinging Electric Gate',
                category: 'gates',
                price: 385000,
                basePrice: 385000,
                image: '/img/construction/swinging-electric-gate.jpg',
                description: 'Dual swinging electric gate system for wide entrances with automatic opening.',
                stock: 'Made to Order',
                sizes: {
                    'Small (single)': 185000,
                    'Medium (double)': 325000,
                    'Large (wide)': 485000
                },
                specs: {
                    type: 'Swinging',
                    style: 'Single or dual',
                    features: 'Safety sensors'
                },
                tags: ['gate', 'electric', 'swinging']
            },
            {
                id: 'con-gate-003',
                name: 'Cantilever Electric Gate',
                category: 'gates',
                price: 550000,
                basePrice: 550000,
                image: '/img/construction/cantilever-gate.jpg',
                description: 'Heavy-duty cantilever gate system for industrial and commercial use.',
                stock: 'Made to Order',
                sizes: {
                    'Small (6m)': 275000,
                    'Medium (8m)': 425000,
                    'Large (10m)': 685000
                },
                specs: {
                    type: 'Cantilever',
                    capacity: 'Heavy duty',
                    installation: 'Professional'
                },
                tags: ['gate', 'industrial', 'cantilever']
            },
            {
                id: 'con-gate-004',
                name: 'Bi-Folding Electric Gate',
                category: 'gates',
                price: 485000,
                basePrice: 485000,
                image: '/img/construction/bi-folding-gate.jpg',
                description: 'Space-saving bi-folding gate system for limited spaces.',
                stock: 'Made to Order',
                sizes: {
                    'Small (3m)': 225000,
                    'Medium (4m)': 350000,
                    'Large (5m)': 550000
                },
                specs: {
                    type: 'Bi-folding',
                    space: 'Space saving',
                    operation: 'Smooth folding'
                },
                tags: ['gate', 'folding', 'compact']
            },
            {
                id: 'con-gate-005',
                name: 'Vertical Lift Electric Gate',
                category: 'gates',
                price: 650000,
                basePrice: 650000,
                image: '/img/construction/vertical-lift-gate.jpg',
                description: 'Vertical lift gate system for high-security applications.',
                stock: 'Made to Order',
                sizes: {
                    'Small (3m)': 325000,
                    'Medium (4m)': 525000,
                    'Large (5m)': 825000
                },
                specs: {
                    type: 'Vertical lift',
                    security: 'High security',
                    operation: 'Vertical movement'
                },
                tags: ['gate', 'vertical', 'security']
            },
            {
                id: 'con-gate-006',
                name: 'Barrier Gate System',
                category: 'gates',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/barrier-gate.jpg',
                description: 'Automatic barrier gate system for parking and access control.',
                stock: 'Made to Order',
                sizes: {
                    'Small (3m arm)': 125000,
                    'Medium (4m arm)': 225000,
                    'Large (6m arm)': 385000
                },
                specs: {
                    type: 'Barrier arm',
                    arm: '3-6 meters',
                    control: 'Ticket/remote'
                },
                tags: ['gate', 'barrier', 'parking']
            },
            {
                id: 'con-gate-007',
                name: 'Boom Barrier System',
                category: 'gates',
                price: 225000,
                basePrice: 225000,
                image: '/img/construction/boom-barrier.jpg',
                description: 'Heavy-duty boom barrier for traffic control.',
                stock: 'Made to Order',
                sizes: {
                    'Small (light duty)': 95000,
                    'Medium (medium duty)': 175000,
                    'Large (heavy duty)': 285000
                },
                specs: {
                    type: 'Boom barrier',
                    duty: 'Light to heavy',
                    control: 'Automatic/manual'
                },
                tags: ['gate', 'boom', 'traffic']
            },
            {
                id: 'con-gate-008',
                name: 'Pedestrian Turnstile',
                category: 'gates',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/turnstile.jpg',
                description: 'Automatic pedestrian turnstile for access control.',
                stock: 'Made to Order',
                sizes: {
                    'Small (tripod)': 85000,
                    'Medium (full height)': 145000,
                    'Large (optical)': 225000
                },
                specs: {
                    type: 'Tripod/full height',
                    control: 'Card/ biometric',
                    security: 'Access control'
                },
                tags: ['gate', 'turnstile', 'pedestrian']
            },
            {
                id: 'con-gate-009',
                name: 'Gate Automation Kit',
                category: 'gates',
                price: 165000,
                basePrice: 165000,
                image: '/img/construction/gate-automation.jpg',
                description: 'Complete automation kit for converting manual gates to electric.',
                stock: 'In Stock',
                sizes: {
                    'Small (light gate)': 75000,
                    'Medium (medium gate)': 125000,
                    'Large (heavy gate)': 225000
                },
                specs: {
                    components: 'Motor, control, safety',
                    capacity: 'Light to heavy gates',
                    installation: 'Professional'
                },
                tags: ['gate', 'automation', 'kit']
            },
            {
                id: 'con-gate-010',
                name: 'Gate Remote Control System',
                category: 'gates',
                price: 45000,
                basePrice: 45000,
                image: '/img/construction/gate-remote.jpg',
                description: 'Wireless remote control system for electric gates.',
                stock: 'In Stock',
                sizes: {
                    'Small (2 remotes)': 25000,
                    'Medium (4 remotes)': 35000,
                    'Large (6 remotes)': 55000
                },
                specs: {
                    remotes: '2-6 units',
                    range: 'Up to 100m',
                    frequency: '433MHz'
                },
                tags: ['gate', 'remote', 'control']
            },
            {
                id: 'con-gate-011',
                name: 'Gate Safety Sensors',
                category: 'gates',
                price: 85000,
                basePrice: 85000,
                image: '/img/construction/gate-sensors.jpg',
                description: 'Safety sensor system for automatic gate protection.',
                stock: 'In Stock',
                sizes: {
                    'Small (2 sensors)': 35000,
                    'Medium (4 sensors)': 65000,
                    'Large (6 sensors)': 115000
                },
                specs: {
                    sensors: '2-6 units',
                    type: 'Infrared/photo cell',
                    protection: 'Obstruction detection'
                },
                tags: ['gate', 'safety', 'sensors']
            },
            {
                id: 'con-gate-012',
                name: 'Gate Intercom System',
                category: 'gates',
                price: 125000,
                basePrice: 125000,
                image: '/img/construction/gate-intercom.jpg',
                description: 'Video intercom system for gate access control.',
                stock: 'Made to Order',
                sizes: {
                    'Small (audio only)': 65000,
                    'Medium (video)': 95000,
                    'Large (smart)': 145000
                },
                specs: {
                    type: 'Audio/video/smart',
                    display: 'LCD screen',
                    features: 'Call, open, monitor'
                },
                tags: ['gate', 'intercom', 'access']
            },
            {
                id: 'con-gate-013',
                name: 'Gate Power Supply',
                category: 'gates',
                price: 95000,
                basePrice: 95000,
                image: '/img/construction/gate-power.jpg',
                description: 'Backup power supply system for electric gates.',
                stock: 'In Stock',
                sizes: {
                    'Small (500VA)': 35000,
                    'Medium (1000VA)': 65000,
                    'Large (2000VA)': 115000
                },
                specs: {
                    capacity: '500-2000VA',
                    battery: 'Deep cycle',
                    runtime: '4-8 hours'
                },
                tags: ['gate', 'power', 'backup']
            },
            {
                id: 'con-gate-014',
                name: 'Gate Maintenance Package',
                category: 'gates',
                price: 85000,
                basePrice: 85000,
                image: '/img/construction/gate-maintenance.jpg',
                description: 'Annual maintenance package for electric gate systems.',
                stock: 'Service',
                sizes: {
                    'Small (basic)': 35000,
                    'Medium (standard)': 65000,
                    'Large (premium)': 115000
                },
                specs: {
                    visits: '2-4 per year',
                    services: 'Inspection, lubrication, repair',
                    duration: '1 year contract'
                },
                tags: ['gate', 'maintenance', 'service']
            },
            {
                id: 'con-gate-015',
                name: 'Gate Installation Service',
                category: 'gates',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/gate-installation.jpg',
                description: 'Professional installation service for electric gate systems.',
                stock: 'Service',
                sizes: {
                    'Small (simple)': 85000,
                    'Medium (standard)': 145000,
                    'Large (complex)': 225000
                },
                specs: {
                    type: 'Simple to complex',
                    team: 'Professional installers',
                    warranty: 'Installation warranty'
                },
                tags: ['gate', 'installation', 'service']
            },

            // =========== FURNITURE & CHAIRS (15 products) ===========
            {
                id: 'con-furniture-001',
                name: 'Executive Conference Table',
                category: 'furniture',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/conference-table.jpg',
                description: 'Custom executive conference table with premium finish and cable management.',
                stock: 'Made to Order',
                sizes: {
                    'Small (6-seater)': 125000,
                    'Medium (10-seater)': 225000,
                    'Large (16-seater)': 385000
                },
                specs: {
                    size: '6-16 seats',
                    material: 'Wood/metal composite',
                    style: 'Modern executive'
                },
                tags: ['table', 'conference', 'executive']
            },
            {
                id: 'con-furniture-002',
                name: 'Restaurant Dining Table',
                category: 'furniture',
                price: 165000,
                basePrice: 165000,
                image: '/img/construction/restaurant-table.jpg',
                description: 'Durable restaurant dining tables in various sizes and designs.',
                stock: 'Made to Order',
                sizes: {
                    'Small (2-seater)': 65000,
                    'Medium (4-seater)': 125000,
                    'Large (8-seater)': 225000
                },
                specs: {
                    sizes: '2-8 seats',
                    material: 'Solid construction',
                    finish: 'Customizable'
                },
                tags: ['table', 'restaurant', 'dining']
            },
            {
                id: 'con-furniture-003',
                name: 'Metal Office Chair',
                category: 'furniture',
                price: 35000,
                basePrice: 35000,
                image: '/img/construction/metal-office-chair.jpg',
                description: 'Ergonomic metal frame office chair with adjustable features.',
                stock: 'In Stock',
                sizes: {
                    'Small (standard)': 25000,
                    'Medium (executive)': 35000,
                    'Large (manager)': 55000
                },
                specs: {
                    frame: 'Steel metal',
                    features: 'Adjustable height',
                    comfort: 'Padded seat'
                },
                tags: ['chair', 'office', 'metal']
            },
            {
                id: 'con-furniture-004',
                name: 'Outdoor Metal Chairs',
                category: 'furniture',
                price: 28500,
                basePrice: 28500,
                image: '/img/construction/outdoor-metal-chairs.jpg',
                description: 'Weather-resistant metal chairs for outdoor cafes and gardens.',
                stock: 'In Stock',
                sizes: {
                    'Small (stacking)': 18500,
                    'Medium (folding)': 28500,
                    'Large (reclining)': 38500
                },
                specs: {
                    material: 'Weatherproof metal',
                    style: 'Outdoor design',
                    finish: 'Powder coated'
                },
                tags: ['chair', 'outdoor', 'metal']
            },
            {
                id: 'con-furniture-005',
                name: 'Custom Metal Bar Stools',
                category: 'furniture',
                price: 32500,
                basePrice: 32500,
                image: '/img/construction/metal-bar-stools.jpg',
                description: 'Custom height metal bar stools for bars and kitchen counters.',
                stock: 'Made to Order',
                sizes: {
                    'Small (65cm)': 22500,
                    'Medium (75cm)': 32500,
                    'Large (85cm)': 42500
                },
                specs: {
                    height: '65-85cm adjustable',
                    material: 'Steel construction',
                    style: 'Modern bar stool'
                },
                tags: ['chair', 'bar', 'stool']
            },
            {
                id: 'con-furniture-006',
                name: 'Industrial Work Table',
                category: 'furniture',
                price: 185000,
                basePrice: 185000,
                image: '/img/construction/industrial-work-table.jpg',
                description: 'Heavy-duty industrial work table for workshops and factories.',
                stock: 'Made to Order',
                sizes: {
                    'Small (1.2m)': 85000,
                    'Medium (1.8m)': 145000,
                    'Large (2.4m)': 225000
                },
                specs: {
                    capacity: 'Heavy duty',
                    material: 'Industrial steel',
                    features: 'Tool storage'
                },
                tags: ['table', 'industrial', 'work']
            },
            {
                id: 'con-furniture-007',
                name: 'Metal Bookshelf',
                category: 'furniture',
                price: 125000,
                basePrice: 125000,
                image: '/img/construction/metal-bookshelf.jpg',
                description: 'Sturdy metal bookshelf with multiple shelves for offices and libraries.',
                stock: 'Made to Order',
                sizes: {
                    'Small (4 shelves)': 65000,
                    'Medium (6 shelves)': 95000,
                    'Large (8 shelves)': 145000
                },
                specs: {
                    shelves: '4-8 adjustable',
                    material: 'Steel construction',
                    weight: 'Heavy capacity'
                },
                tags: ['furniture', 'bookshelf', 'metal']
            },
            {
                id: 'con-furniture-008',
                name: 'Metal Filing Cabinet',
                category: 'furniture',
                price: 85000,
                basePrice: 85000,
                image: '/img/construction/filing-cabinet.jpg',
                description: 'Secure metal filing cabinet for document storage.',
                stock: 'In Stock',
                sizes: {
                    'Small (2-drawer)': 35000,
                    'Medium (4-drawer)': 65000,
                    'Large (6-drawer)': 115000
                },
                specs: {
                    drawers: '2-6 drawers',
                    locks: 'Security locks',
                    material: 'Steel construction'
                },
                tags: ['furniture', 'cabinet', 'storage']
            },
            {
                id: 'con-furniture-009',
                name: 'Metal Display Rack',
                category: 'furniture',
                price: 95000,
                basePrice: 95000,
                image: '/img/construction/display-rack.jpg',
                description: 'Versatile metal display rack for retail stores.',
                stock: 'Made to Order',
                sizes: {
                    'Small (4-tier)': 45000,
                    'Medium (6-tier)': 75000,
                    'Large (8-tier)': 115000
                },
                specs: {
                    tiers: '4-8 levels',
                    material: 'Steel construction',
                    mobility: 'Wheels optional'
                },
                tags: ['furniture', 'display', 'rack']
            },
            {
                id: 'con-furniture-010',
                name: 'Metal Waiting Chair',
                category: 'furniture',
                price: 22500,
                basePrice: 22500,
                image: '/img/construction/waiting-chair.jpg',
                description: 'Comfortable metal waiting chairs for reception areas.',
                stock: 'In Stock',
                sizes: {
                    'Small (single)': 18500,
                    'Medium (double)': 32500,
                    'Large (triple)': 48500
                },
                specs: {
                    seats: '1-3 seats',
                    material: 'Steel frame',
                    comfort: 'Padded seating'
                },
                tags: ['chair', 'waiting', 'reception']
            },
            {
                id: 'con-furniture-011',
                name: 'Metal Classroom Desk',
                category: 'furniture',
                price: 18500,
                basePrice: 18500,
                image: '/img/construction/classroom-desk.jpg',
                description: 'Durable metal classroom desks for schools and training centers.',
                stock: 'Made to Order',
                sizes: {
                    'Small (single)': 12500,
                    'Medium (double)': 22500,
                    'Large (triple)': 38500
                },
                specs: {
                    seats: '1-3 students',
                    material: 'Steel construction',
                    features: 'Book storage'
                },
                tags: ['desk', 'classroom', 'metal']
            },
            {
                id: 'con-furniture-012',
                name: 'Metal Laboratory Table',
                category: 'furniture',
                price: 225000,
                basePrice: 225000,
                image: '/img/construction/lab-table.jpg',
                description: 'Chemical-resistant laboratory tables for schools and research.',
                stock: 'Made to Order',
                sizes: {
                    'Small (1.5m)': 95000,
                    'Medium (2.4m)': 175000,
                    'Large (3.6m)': 285000
                },
                specs: {
                    surface: 'Chemical resistant',
                    material: 'Steel frame',
                    features: 'Sinks, storage'
                },
                tags: ['table', 'laboratory', 'metal']
            },
            {
                id: 'con-furniture-013',
                name: 'Metal Hospital Bed',
                category: 'furniture',
                price: 285000,
                basePrice: 285000,
                image: '/img/construction/hospital-bed.jpg',
                description: 'Medical-grade metal hospital beds with adjustable features.',
                stock: 'Made to Order',
                sizes: {
                    'Small (manual)': 125000,
                    'Medium (electric)': 225000,
                    'Large (ICU)': 385000
                },
                specs: {
                    type: 'Manual/electric/ICU',
                    features: 'Adjustable, wheels',
                    material: 'Medical steel'
                },
                tags: ['bed', 'hospital', 'metal']
            },
            {
                id: 'con-furniture-014',
                name: 'Metal Wardrobe',
                category: 'furniture',
                price: 165000,
                basePrice: 165000,
                image: '/img/construction/metal-wardrobe.jpg',
                description: 'Spacious metal wardrobe for homes and offices.',
                stock: 'Made to Order',
                sizes: {
                    'Small (2-door)': 65000,
                    'Medium (3-door)': 125000,
                    'Large (4-door)': 225000
                },
                specs: {
                    doors: '2-4 doors',
                    material: 'Steel construction',
                    features: 'Shelves, hanging'
                },
                tags: ['furniture', 'wardrobe', 'metal']
            },
            {
                id: 'con-furniture-015',
                name: 'Metal Coffee Table',
                category: 'furniture',
                price: 65000,
                basePrice: 65000,
                image: '/img/construction/metal-coffee-table.jpg',
                description: 'Stylish metal coffee table for living rooms and lounges.',
                stock: 'Made to Order',
                sizes: {
                    'Small (60cm)': 32500,
                    'Medium (90cm)': 52500,
                    'Large (120cm)': 82500
                },
                specs: {
                    size: '60-120cm diameter',
                    material: 'Steel/glass/wood',
                    style: 'Modern design'
                },
                tags: ['table', 'coffee', 'metal']
            }
        ];

        // CART FUNCTIONS
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
                if (typeof window.renderCartDrawer === 'function') {
                    window.renderCartDrawer();
                }
                return true;
            } catch (error) {
                console.error('Error saving cart:', error);
                return false;
            }
        }

        function addToCart(product, selectedSize = null) {
            console.log('Adding to cart:', product, 'Size:', selectedSize);
            
            if (!product || !product.id || !product.name) {
                console.error('Invalid product data:', product);
                return false;
            }
            
            const cart = getCart();
            const productKey = selectedSize ? `${product.id}-${selectedSize}` : product.id;
            const productName = selectedSize ? `${product.name} (${selectedSize})` : product.name;
            const productPrice = selectedSize && product.sizes && product.sizes[selectedSize] 
                ? product.sizes[selectedSize] 
                : product.price;
            
            const existingItem = cart.find(item => item.id === productKey);
            
            if (existingItem) {
                existingItem.quantity += 1;
                console.log('Updated existing item quantity:', existingItem.quantity);
            } else {
                cart.push({
                    id: productKey,
                    name: productName,
                    price: parseFloat(productPrice),
                    image: product.image || '/img/logo.jpg',
                    quantity: 1,
                    category: product.category,
                    originalId: product.id,
                    size: selectedSize
                });
                console.log('Added new item to cart');
            }
            
            const saved = saveCart(cart);
            
            if (saved) {
                showCartNotification(productName);
                return true;
            }
            
            return false;
        }

        function updateCartCount() {
            const cart = getCart();
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            const cartBadge = document.getElementById('cart-count-badge');
            
            if (cartBadge) {
                cartBadge.textContent = totalItems;
                cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
            
            return totalItems;
        }

        function showCartNotification(productName) {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.cart-notification');
            existingNotifications.forEach(notification => notification.remove());
            
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `<span>✓ Added "${productName}" to cart</span>`;
            
            // Add styles
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
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // PRODUCT DISPLAY FUNCTIONS
        document.addEventListener('DOMContentLoaded', function() {
            console.log('CIL Construction page loaded');
            
            // Initialize cart count
            updateCartCount();
            
            // DOM Elements
            const productsContainer = document.getElementById('products-container');
            const searchInput = document.getElementById('product-search');
            const categoryFilter = document.getElementById('category-filter');
            const loadMoreBtn = document.getElementById('load-more');
            const productCount = document.getElementById('product-count');
            
            // Pagination variables
            let currentPage = 1;
            const productsPerPage = 12; // Increased to show more products
            let filteredProducts = [...constructionProducts];
            let isLoading = false;
            
            // Initialize the page
            function initPage() {
                currentPage = 1;
                filterProducts();
                setupEventListeners();
                setupCartDrawer();
                updateCartCount();
                animateFadeInElements();
            }
            
            // Animate fade-in elements
            function animateFadeInElements() {
                const fadeElements = document.querySelectorAll('.fade-in-up');
                fadeElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.animationDelay = `${index * 0.1}s`;
                        el.classList.add('fade-in-up');
                    }, 100);
                });
            }
            
            // Setup event listeners
            function setupEventListeners() {
                // Search functionality
                if (searchInput) {
                    searchInput.addEventListener('input', function() {
                        currentPage = 1;
                        filterProducts();
                    });
                }
                
                // Category filter
                if (categoryFilter) {
                    categoryFilter.addEventListener('change', function() {
                        currentPage = 1;
                        filterProducts();
                    });
                }
                
                // Load more button
                if (loadMoreBtn) {
                    loadMoreBtn.addEventListener('click', function() {
                        currentPage++;
                        displayProducts();
                    });
                }
                
                // Single global event listener for add-to-cart buttons
                document.addEventListener('click', function(e) {
                    const addToCartBtn = e.target.closest('.add-to-cart');
                    if (!addToCartBtn) return;
                    
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    
                    // Get product data
                    const productId = addToCartBtn.getAttribute('data-id');
                    const selectedSize = addToCartBtn.getAttribute('data-size');
                    const product = constructionProducts.find(p => p.id === productId);
                    
                    if (product) {
                        console.log('Add to cart clicked for:', product.name, 'Size:', selectedSize);
                        
                        // Add to cart
                        addToCart(product, selectedSize);
                        
                        // Visual feedback
                        const originalText = addToCartBtn.innerHTML;
                        addToCartBtn.innerHTML = '✓ Added!';
                        addToCartBtn.style.background = '#27ae60';
                        
                        setTimeout(() => {
                            addToCartBtn.innerHTML = originalText;
                            addToCartBtn.style.background = '';
                        }, 1000);
                    }
                }, true);
            }
            
            // Filter products
            function filterProducts() {
                const searchTerm = (searchInput ? searchInput.value.toLowerCase() : '');
                const selectedCategory = (categoryFilter ? categoryFilter.value : 'all');
                
                filteredProducts = constructionProducts.filter(product => {
                    const matchesSearch = 
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm) ||
                        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
                    
                    const matchesCategory = 
                        selectedCategory === 'all' || 
                        product.category === selectedCategory;
                    
                    return matchesSearch && matchesCategory;
                });
                
                currentPage = 1;
                displayProducts();
            }
            
            // Display products
            function displayProducts() {
                if (!productsContainer) return;
                
                const startIndex = (currentPage - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                
                // Clear container if first page
                if (currentPage === 1) {
                    productsContainer.innerHTML = '';
                }
                
                // Get products for this page
                const pageProducts = filteredProducts.slice(startIndex, endIndex);
                
                // Create product cards
                pageProducts.forEach(product => {
                    const productCard = createProductCard(product);
                    productsContainer.appendChild(productCard);
                });
                
                // Update product count
                updateProductCount();
                
                // Show/hide load more button
                if (loadMoreBtn) {
                    if (endIndex >= filteredProducts.length) {
                        loadMoreBtn.style.display = 'none';
                    } else {
                        loadMoreBtn.style.display = 'block';
                        loadMoreBtn.textContent = `Load More (${filteredProducts.length - endIndex} more)`;
                    }
                }
                
                // Animate new products
                animateNewProducts();
            }
            
            // Create product card
            function createProductCard(product) {
                const card = document.createElement('div');
                card.className = 'product-card fade-in-up';
                
                const stockClass = getStockClass(product.stock);
                const formattedPrice = product.price.toLocaleString();
                const categoryName = getCategoryName(product.category);
                const hasSizes = product.sizes && Object.keys(product.sizes).length > 0;
                
                // Determine default size and price
                let defaultSize = null;
                let defaultPrice = product.price;
                if (hasSizes) {
                    const sizes = Object.keys(product.sizes);
                    defaultSize = sizes[1] || sizes[0]; // Prefer Medium, fallback to Small
                    defaultPrice = product.sizes[defaultSize];
                }
                
                card.innerHTML = `
                    <div class="product-category-badge">${categoryName}</div>
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.onerror=null; this.src='/img/logo.jpg'">
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        
                        <div class="product-specs">
                            ${product.specs ? Object.entries(product.specs).map(([key, value]) => `
                                <div class="spec-item">
                                    <span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                    <span class="spec-value">${value}</span>
                                </div>
                            `).join('') : ''}
                        </div>
                        
                        ${hasSizes ? `
                            <div class="size-options" id="size-options-${product.id}">
                                ${Object.keys(product.sizes).map((size, index) => `
                                    <button class="size-option ${index === 1 ? 'selected' : ''}" 
                                            data-product="${product.id}"
                                            data-size="${size}"
                                            data-price="${product.sizes[size]}">
                                        ${size}
                                    </button>
                                `).join('')}
                            </div>
                            <div class="price-display" id="price-display-${product.id}">
                                ₦${defaultPrice.toLocaleString()}
                            </div>
                        ` : `
                            <div class="price-display">
                                ₦${formattedPrice}
                            </div>
                        `}
                        
                        <div class="product-stock ${stockClass}">${product.stock}</div>
                        
                        <div class="product-actions">
                            <button class="btn-primary add-to-cart" 
                                    data-id="${product.id}"
                                    data-name="${product.name}"
                                    data-price="${defaultPrice}"
                                    data-image="${product.image}"
                                    ${hasSizes ? `data-size="${defaultSize}"` : ''}>
                                 Add to Cart
                            </button>
                            <a href="https://wa.me/2348129978419?text=I'm interested in CIL Construction: ${encodeURIComponent(product.name)} - ₦${defaultPrice.toLocaleString()}${hasSizes ? ` (${defaultSize})` : ''}" 
                               class="btn-whatsapp" target="_blank">
                                 WhatsApp
                            </a>
                        </div>
                    </div>
                `;
                
                // Add size selection functionality
                if (hasSizes) {
                    setTimeout(() => {
                        const sizeOptions = card.querySelectorAll(`#size-options-${product.id} .size-option`);
                        const priceDisplay = card.querySelector(`#price-display-${product.id}`);
                        const addToCartBtn = card.querySelector('.add-to-cart');
                        
                        sizeOptions.forEach(option => {
                            option.addEventListener('click', function() {
                                // Remove selected class from all options
                                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                                
                                // Add selected class to clicked option
                                this.classList.add('selected');
                                
                                // Update price display
                                const newPrice = this.getAttribute('data-price');
                                priceDisplay.textContent = `₦${parseFloat(newPrice).toLocaleString()}`;
                                
                                // Update add to cart button
                                const selectedSize = this.getAttribute('data-size');
                                addToCartBtn.setAttribute('data-size', selectedSize);
                                addToCartBtn.setAttribute('data-price', newPrice);
                                
                                // Update WhatsApp link
                                const whatsappBtn = card.querySelector('.btn-whatsapp');
                                const newWhatsappLink = `https://wa.me/2348129978419?text=I'm interested in CIL Construction: ${encodeURIComponent(product.name)} - ₦${parseFloat(newPrice).toLocaleString()} (${selectedSize})`;
                                whatsappBtn.setAttribute('href', newWhatsappLink);
                            });
                        });
                    }, 100);
                }
                
                return card;
            }
            
            // Get stock class
            function getStockClass(stock) {
                if (stock === 'In Stock') return 'stock-in';
                if (stock === 'Made to Order') return 'stock-custom';
                if (stock === 'Service') return 'stock-limited';
                if (stock === 'Limited Stock') return 'stock-limited';
                return 'stock-custom';
            }
            
            // Get category display name
            function getCategoryName(category) {
                const categories = {
                    'poultry': 'Poultry',
                    'machines': 'Machines',
                    'courts': 'Courts',
                    'gates': 'Gates',
                    'furniture': 'Furniture'
                };
                return categories[category] || category;
            }
            
            // Update product count display
            function updateProductCount() {
                if (!productCount) return;
                
                const totalProducts = filteredProducts.length;
                const showingProducts = Math.min(currentPage * productsPerPage, totalProducts);
                
                if (totalProducts === 0) {
                    productCount.textContent = 'No construction products found matching your criteria';
                } else {
                    productCount.textContent = `Showing ${showingProducts} of ${totalProducts} construction products`;
                }
            }
            
            // Animate new products
            function animateNewProducts() {
                const allCards = productsContainer.querySelectorAll('.product-card');
                const newCards = Array.from(allCards).slice(-productsPerPage);
                
                newCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
            
            // Setup cart drawer
            function setupCartDrawer() {
                const cartDrawer = document.getElementById('cart-drawer');
                const openCartBtn = document.getElementById('open-cart-drawer');
                const closeCartBtn = document.getElementById('close-cart-drawer');
                const cartOverlay = document.getElementById('cart-drawer-overlay');
                
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
                
                // Render cart drawer function
                window.renderCartDrawer = function() {
                    const cartItemsContainer = document.getElementById('cart-drawer-items');
                    const drawerTotal = document.getElementById('drawer-total');
                    
                    if (!cartItemsContainer) return;
                    
                    const cart = getCart();
                    
                    if (cart.length === 0) {
                        cartItemsContainer.innerHTML = `
                            <div class="cart-drawer-empty">
                                <div class="cart-drawer-empty-icon">🛒</div>
                                <p>Your cart is empty</p>
                                <a href="/shop-construction" class="btn btn-primary">Browse Construction Products</a>
                            </div>
                        `;
                        if (drawerTotal) drawerTotal.textContent = '₦0';
                        return;
                    }
                    
                    cartItemsContainer.innerHTML = cart.map(item => `
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
                    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    if (drawerTotal) {
                        drawerTotal.textContent = `₦${total.toLocaleString()}`;
                    }
                    
                    // Attach remove button listeners
                    cartItemsContainer.querySelectorAll('.cart-drawer-item-remove').forEach(button => {
                        button.addEventListener('click', function(e) {
                            const productId = e.target.dataset.id;
                            removeFromCart(productId);
                            renderCartDrawer();
                            updateCartCount();
                        });
                    });
                };
                
                // Remove from cart function
                function removeFromCart(productId) {
                    const cart = getCart().filter(item => item.id !== productId);
                    saveCart(cart);
                }
            }
            
            // Start the page
            initPage();
            
            // Make functions available globally
            window.addToCart = addToCart;
            window.updateCartCount = updateCartCount;
            window.getCart = getCart;
            window.showCartNotification = showCartNotification;
        });
console.log('Construction page JavaScript loaded successfully');