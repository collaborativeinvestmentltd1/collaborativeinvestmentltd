// shop-agriculture.js - Complete Agriculture Products Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Agriculture page loaded - initializing...');
    
    // Check if we're on an agriculture page
    const agricultureElements = document.querySelector('.agriculture-products, [data-page="agriculture"], .category-header');
    if (!agricultureElements) {
        console.log('Not on agriculture page, skipping initialization');
        return;
    }

    // Agriculture products data - Using the SAME structure as shop-all.js
    const agricultureProducts = window.agricultureProducts || [
        // POULTRY PRODUCTS
        {
            id: 'agri-001',
            name: 'Crate of Eggs (30 pieces)',
            category: 'poultry',
            subcategory: 'poultry',
            price: 2400,
            basePrice: 2400,
            image: '/img/agriculture/crate-of-eggs.jpg',
            description: 'Fresh farm eggs from our free-range layers. Rich in nutrients and perfect for consumption or hatching.',
            stock: 'In Stock',
            minOrder: '1 Crate',
            unit: 'per crate',
            tags: ['poultry', 'eggs', 'fresh'],
            specs: {
                size: 'Medium to Large',
                type: 'Fresh farm eggs',
                packaging: '30 pieces/crate',
                shelf_life: '21 days'
            }
        },
        {
            id: 'agri-002',
            name: 'Day Old Broiler Chicks',
            category: 'poultry',
            subcategory: 'poultry',
            price: 450,
            basePrice: 450,
            image: '/img/agriculture/day-old-broilers.jpg',
            description: 'High-quality broiler chicks with fast growth rate. Ready for meat production in 6-8 weeks.',
            stock: 'In Stock',
            minOrder: '50 chicks',
            unit: 'each',
            tags: ['poultry', 'chicks', 'broiler'],
            specs: {
                breed: 'Cobb/Arbor Acres',
                growth: '6-8 weeks to market',
                vaccination: 'Marek\'s disease',
                delivery: 'Live delivery available'
            }
        },
        {
            id: 'agri-003',
            name: 'Day Old Layer Chicks',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 500,
            image: '/img/agriculture/day-old-layers.jpg',
            description: 'Premium layer breeds for high egg production. Start laying at 18-20 weeks.',
            stock: 'In Stock',
            minOrder: '50 chicks',
            unit: 'each',
            tags: ['poultry', 'chicks', 'layer']
        },
        {
            id: 'agri-004',
            name: 'Point of Lay Layers (18 weeks)',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 2500,
            image: '/img/agriculture/point-of-lay-layers.jpg',
            description: 'Ready-to-lay pullets. Start producing eggs immediately. Fully vaccinated and dewormed.',
            stock: 'Limited Stock',
            minOrder: '10 birds',
            unit: 'each',
            tags: ['poultry', 'layers', 'ready-to-lay']
        },
        {
            id: 'agri-005',
            name: 'Adult Broiler Chickens (6-8 weeks)',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 4500,
            image: '/img/agriculture/adult-broilers.jpg',
            description: 'Market-ready broiler chickens. Average weight 2-2.5kg. Perfect for immediate processing.',
            stock: 'In Stock',
            minOrder: '10 birds',
            unit: 'each',
            tags: ['poultry', 'broiler', 'market-ready']
        },

        // LIVESTOCK PRODUCTS
        {
            id: 'agri-006',
            name: 'Baby Pigs (Weaners - 8 weeks)',
            category: 'agriculture',
            subcategory: 'livestock',
            price: 18000,
            image: '/img/agriculture/baby-pigs.jpg',
            description: 'Healthy weaner pigs ready for growing. Crossbreed for fast growth and disease resistance.',
            stock: 'In Stock',
            minOrder: '5 pigs',
            unit: 'each',
            tags: ['livestock', 'pigs', 'weaners']
        },
        {
            id: 'agri-007',
            name: 'Adult Pigs (6 months)',
            category: 'agriculture',
            subcategory: 'livestock',
            price: 120000,
            image: '/img/agriculture/adult-pigs.jpg',
            description: 'Market-ready pigs for meat production or breeding. Average weight 80-100kg.',
            stock: 'In Stock',
            minOrder: '2 pigs',
            unit: 'each',
            tags: ['livestock', 'pigs', 'adult']
        },

        // FISH & AQUACULTURE PRODUCTS
        {
            id: 'agri-008',
            name: 'Catfish Juveniles (Fingerlings)',
            category: 'agriculture',
            subcategory: 'fish',
            price: 25,
            image: '/img/agriculture/catfish-juveniles.jpg',
            description: 'Healthy catfish fingerlings for pond stocking. Uniform size and disease-free.',
            stock: 'In Stock',
            minOrder: '100 pieces',
            unit: 'each',
            tags: ['fish', 'catfish', 'fingerlings']
        },
        {
            id: 'agri-009',
            name: 'Live Adult Catfish (1kg+)',
            category: 'agriculture',
            subcategory: 'fish',
            price: 1200,
            image: '/img/agriculture/live-adult-catfish.jpg',
            description: 'Fresh live catfish ready for consumption. Grown in clean water systems.',
            stock: 'In Stock',
            minOrder: '5kg',
            unit: 'per kg',
            tags: ['fish', 'catfish', 'live']
        },
        {
            id: 'agri-010',
            name: 'Roasted/Smoked Catfish',
            category: 'agriculture',
            subcategory: 'fish',
            price: 1800,
            image: '/img/agriculture/roasted-catfish.jpg',
            description: 'Premium smoked catfish. Perfect for soups, peppersoup, and local delicacies.',
            stock: 'In Stock',
            minOrder: '2kg',
            unit: 'per kg',
            tags: ['fish', 'catfish', 'smoked']
        },

        // ANIMAL FEEDS
        {
            id: 'agri-011',
            name: 'Chicken Feed (25kg bag)',
            category: 'agriculture',
            subcategory: 'feeds',
            price: 9500,
            image: '/img/agriculture/chicken-feed.jpg',
            description: 'Complete balanced feed for layers and broilers. High protein content for optimal growth.',
            stock: 'In Stock',
            minOrder: '1 bag',
            unit: 'per bag',
            tags: ['feeds', 'chicken', 'poultry']
        },
        {
            id: 'agri-012',
            name: 'Catfish Feed (15kg bag)',
            category: 'agriculture',
            subcategory: 'feeds',
            price: 7200,
            image: '/img/agriculture/catfish-feed.jpg',
            description: 'Floating fish feed with 35-45% protein content. Promotes fast growth and good feed conversion.',
            stock: 'In Stock',
            minOrder: '1 bag',
            unit: 'per bag',
            tags: ['feeds', 'catfish', 'fish']
        },
        {
            id: 'agri-013',
            name: 'Pig Feed (25kg bag)',
            category: 'agriculture',
            subcategory: 'feeds',
            price: 8500,
            image: '/img/agriculture/pig-feed.jpg',
            description: 'Complete swine feed for different growth stages. Formulated for optimal weight gain.',
            stock: 'In Stock',
            minOrder: '1 bag',
            unit: 'per bag',
            tags: ['feeds', 'pig', 'livestock']
        },

        // FARMING SUPPLIES
        {
            id: 'agri-014',
            name: 'Automatic Poultry Drinker',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 1800,
            image: '/img/agriculture/poultry-drinker.jpg',
            description: '4-liter capacity automatic drinker. Ensures clean water supply and reduces labor.',
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'each',
            tags: ['supplies', 'poultry', 'drinker']
        },
        {
            id: 'agri-015',
            name: 'Automatic Poultry Feeder',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 2200,
            image: '/img/agriculture/poultry-feeder.jpg',
            description: '5kg capacity automatic feeder. Reduces feed waste and ensures continuous feeding.',
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'each',
            tags: ['supplies', 'poultry', 'feeder']
        },
        {
            id: 'agri-016',
            name: 'Digital Egg Incubator (96 eggs)',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 85000,
            image: '/img/agriculture/incubator.jpg',
            description: 'Automatic digital incubator with temperature and humidity control. 85%+ hatch rate.',
            stock: 'Limited Stock',
            minOrder: '1 unit',
            unit: 'each',
            tags: ['supplies', 'incubator', 'poultry']
        },
        {
            id: 'agri-017',
            name: 'Fishing Net (Various Sizes)',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 4500,
            image: '/img/agriculture/fish-net.jpg',
            description: 'Durable fishing nets for pond harvesting. Various mesh sizes available.',
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'each',
            tags: ['supplies', 'fishing', 'net']
        }
    ];

    // Make products available globally for shop-all.js
    if (!window.agricultureProducts) {
        window.agricultureProducts = agricultureProducts;
    }

    // DOM Elements with null checks
    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCount = document.getElementById('product-count');

    // Filter variables
    let filteredProducts = [...agricultureProducts];
    let currentCategory = 'all';

    // Initialize the page
    function initialize() {
        console.log('Initializing agriculture page...');
        
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

        // Add to cart buttons (delegated)
        document.addEventListener('click', function(e) {
            const addToCartBtn = e.target.closest('.add-to-cart');
            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.id;
                const product = agricultureProducts.find(p => p.id === productId);
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

    // Filter products based on category
    function filterProducts() {
        filteredProducts = agricultureProducts.filter(product => {
            return currentCategory === 'all' || product.category === currentCategory;
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
                
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
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
                    
                    <div class="product-price">₦${product.price.toLocaleString()} ${product.unit || ''}</div>
                    
                    <div class="product-meta">
                        <span>Minimum Order: ${product.minOrder}</span>
                        <span class="bulk-discount">Bulk Discount Available</span>
                    </div>
                    
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
            const totalProducts = agricultureProducts.length;
            const showingProducts = filteredProducts.length;
            productCount.textContent = `Showing ${showingProducts} of ${totalProducts} agriculture products`;
        }
    }

    // Get stock class for styling
    function getStockClass(stock) {
        if (stock === 'In Stock') return 'stock-in';
        if (stock === 'Limited Stock') return 'stock-low';
        if (stock === 'Made to Order') return 'stock-out';
        return '';
    }

    // Format category name for display
    function getCategoryDisplayName(category) {
        const categories = {
            'poultry': ' Poultry',
            'livestock': ' Livestock',
            'fish': ' Fish',
            'feeds': ' Feeds',
            'supplies': ' Supplies'
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
        // AGRICULTURE PRODUCTS DATA - EXPANDED WITH MORE PRODUCTS
        const agricultureProducts = [
            // =========== POULTRY PRODUCTS (20+ products) ===========
            {
                id: 'agri-poultry-001',
                name: 'Day Old Broiler Chicks',
                category: 'poultry',
                price: 450,
                basePrice: 450,
                image: '/img/agriculture/day-old-broilers.jpg',
                description: 'High-quality broiler chicks with fast growth rate. Ready for meat production in 6-8 weeks.',
                stock: 'In Stock',
                quantities: {
                    '50 chicks': 22500,
                    '100 chicks': 42500,
                    '500 chicks': 212500,
                    '1000 chicks': 425000
                },
                specs: {
                    breed: 'Cobb/Arbor Acres',
                    growth: '6-8 weeks to market',
                    vaccination: 'Marek\'s disease',
                    delivery: 'Live delivery available'
                },
                tags: ['poultry', 'chicks', 'broiler', 'vaccinated']
            },
            {
                id: 'agri-poultry-002',
                name: 'Day Old Layer Chicks',
                category: 'poultry',
                price: 500,
                basePrice: 500,
                image: '/img/agriculture/day-old-layers.jpg',
                description: 'Premium layer breeds for high egg production. Start laying at 18-20 weeks.',
                stock: 'In Stock',
                quantities: {
                    '50 chicks': 25000,
                    '100 chicks': 47500,
                    '500 chicks': 237500,
                    '1000 chicks': 475000
                },
                specs: {
                    breed: 'ISA Brown/Lohmann',
                    production: '300+ eggs/year',
                    vaccination: 'Complete program',
                    maturity: '18-20 weeks'
                },
                tags: ['poultry', 'chicks', 'layer', 'vaccinated']
            },
            {
                id: 'agri-poultry-003',
                name: 'Point of Lay Layers (18 weeks)',
                category: 'poultry',
                price: 2500,
                basePrice: 2500,
                image: '/img/agriculture/point-of-lay-layers.jpg',
                description: 'Ready-to-lay pullets. Start producing eggs immediately. Fully vaccinated and dewormed.',
                stock: 'Limited Stock',
                quantities: {
                    '10 birds': 25000,
                    '25 birds': 60000,
                    '50 birds': 117500,
                    '100 birds': 230000
                },
                specs: {
                    age: '18 weeks',
                    weight: '1.5-1.8kg',
                    vaccination: 'Complete',
                    status: 'Ready to lay'
                },
                tags: ['poultry', 'layers', 'ready-to-lay', 'vaccinated']
            },
            {
                id: 'agri-poultry-004',
                name: 'Crate of Eggs (30 pieces)',
                category: 'poultry',
                price: 2400,
                basePrice: 2400,
                image: '/img/agriculture/crate-of-eggs.jpg',
                description: 'Fresh farm eggs from our free-range layers. Rich in nutrients for consumption or hatching.',
                stock: 'In Stock',
                quantities: {
                    '1 crate': 2400,
                    '5 crates': 11500,
                    '10 crates': 22500,
                    '20 crates': 44000
                },
                specs: {
                    size: 'Medium to Large',
                    type: 'Fresh farm eggs',
                    packaging: '30 pieces/crate',
                    shelf_life: '21 days'
                },
                tags: ['poultry', 'eggs', 'fresh', 'organic']
            },
            {
                id: 'agri-poultry-005',
                name: 'Adult Broiler Chickens (6-8 weeks)',
                category: 'poultry',
                price: 4500,
                basePrice: 4500,
                image: '/img/agriculture/adult-broilers.jpg',
                description: 'Market-ready broiler chickens. Average weight 2-2.5kg. Perfect for immediate processing.',
                stock: 'In Stock',
                quantities: {
                    '10 birds': 45000,
                    '25 birds': 110000,
                    '50 birds': 217500,
                    '100 birds': 430000
                },
                specs: {
                    age: '6-8 weeks',
                    weight: '2-2.5kg',
                    processing: 'Ready for slaughter',
                    packaging: 'Live or processed'
                },
                tags: ['poultry', 'broiler', 'market-ready', 'meat']
            },
            {
                id: 'agri-poultry-006',
                name: 'Cockerels (Local Breed)',
                category: 'poultry',
                price: 3500,
                basePrice: 3500,
                image: '/img/agriculture/cockerels.jpg',
                description: 'Healthy local breed cockerels for meat or breeding. Disease resistant and hardy.',
                stock: 'In Stock',
                quantities: {
                    '5 birds': 17500,
                    '10 birds': 34000,
                    '20 birds': 67000,
                    '50 birds': 165000
                },
                specs: {
                    breed: 'Local/Native',
                    age: '4-6 months',
                    use: 'Meat/Breeding',
                    characteristics: 'Disease resistant'
                },
                tags: ['poultry', 'cockerels', 'local', 'breeding']
            },
            {
                id: 'agri-poultry-007',
                name: 'Turkey Poults (Day Old)',
                category: 'poultry',
                price: 1200,
                basePrice: 1200,
                image: '/img/agriculture/turkey-poults.jpg',
                description: 'Day old turkey poults for meat production. Fast growing with high meat yield.',
                stock: 'In Stock',
                quantities: {
                    '10 poults': 12000,
                    '25 poults': 29000,
                    '50 poults': 57500,
                    '100 poults': 115000
                },
                specs: {
                    breed: 'Broad Breasted White',
                    maturity: '16-20 weeks',
                    weight: '10-15kg adult',
                    purpose: 'Meat production'
                },
                tags: ['poultry', 'turkey', 'poults', 'meat']
            },
            {
                id: 'agri-poultry-008',
                name: 'Ducklings (Day Old)',
                category: 'poultry',
                price: 600,
                basePrice: 600,
                image: '/img/agriculture/ducklings.jpg',
                description: 'Day old ducklings for meat or egg production. Hardy and easy to manage.',
                stock: 'In Stock',
                quantities: {
                    '10 ducklings': 6000,
                    '25 ducklings': 14500,
                    '50 ducklings': 29000,
                    '100 ducklings': 57500
                },
                specs: {
                    breed: 'Pekin/Muscovy',
                    eggs: '200-300/year',
                    meat: 'Excellent quality',
                    management: 'Easy care'
                },
                tags: ['poultry', 'ducklings', 'ducks', 'eggs']
            },
            {
                id: 'agri-poultry-009',
                name: 'Guinea Fowl Keets',
                category: 'poultry',
                price: 550,
                basePrice: 550,
                image: '/img/agriculture/guinea-keets.jpg',
                description: 'Day old guinea fowl keets. Excellent for pest control and lean meat production.',
                stock: 'In Stock',
                quantities: {
                    '10 keets': 5500,
                    '25 keets': 13250,
                    '50 keets': 26250,
                    '100 keets': 52500
                },
                specs: {
                    breed: 'Helmeted Guinea',
                    meat: 'Lean and tasty',
                    eggs: 'Small but nutritious',
                    pest_control: 'Excellent'
                },
                tags: ['poultry', 'guinea', 'keets', 'pest-control']
            },
            {
                id: 'agri-poultry-010',
                name: 'Quail Chicks (Day Old)',
                category: 'poultry',
                price: 150,
                basePrice: 150,
                image: '/img/agriculture/quail-chicks.jpg',
                description: 'Day old quail chicks for meat and egg production. Fast maturity and high productivity.',
                stock: 'In Stock',
                quantities: {
                    '50 chicks': 7500,
                    '100 chicks': 14500,
                    '200 chicks': 28500,
                    '500 chicks': 70000
                },
                specs: {
                    breed: 'Japanese/Coturnix',
                    maturity: '6-8 weeks',
                    eggs: '300+/year',
                    space: 'Compact housing'
                },
                tags: ['poultry', 'quail', 'chicks', 'mini-livestock']
            },

            // =========== LIVESTOCK PRODUCTS (15+ products) ===========
            {
                id: 'agri-livestock-001',
                name: 'Baby Pigs (Weaners - 8 weeks)',
                category: 'livestock',
                price: 18000,
                basePrice: 18000,
                image: '/img/agriculture/baby-pigs.jpg',
                description: 'Healthy weaner pigs ready for growing. Crossbreed for fast growth and disease resistance.',
                stock: 'In Stock',
                quantities: {
                    '5 pigs': 90000,
                    '10 pigs': 175000,
                    '20 pigs': 345000,
                    '50 pigs': 850000
                },
                specs: {
                    age: '8 weeks',
                    weight: '15-20kg',
                    breed: 'Large White/Duroc cross',
                    growth: 'Fast growing'
                },
                tags: ['livestock', 'pigs', 'weaners', 'breeding']
            },
            {
                id: 'agri-livestock-002',
                name: 'Adult Pigs (6 months)',
                category: 'livestock',
                price: 120000,
                basePrice: 120000,
                image: '/img/agriculture/adult-pigs.jpg',
                description: 'Market-ready pigs for meat production or breeding. Average weight 80-100kg.',
                stock: 'In Stock',
                quantities: {
                    '2 pigs': 240000,
                    '5 pigs': 590000,
                    '10 pigs': 1175000
                },
                specs: {
                    age: '6 months',
                    weight: '80-100kg',
                    purpose: 'Meat/Breeding',
                    condition: 'Healthy and active'
                },
                tags: ['livestock', 'pigs', 'adult', 'meat']
            },
            {
                id: 'agri-livestock-003',
                name: 'Goat Kids (3 months)',
                category: 'livestock',
                price: 25000,
                basePrice: 25000,
                image: '/img/agriculture/goat-kids.jpg',
                description: 'Healthy goat kids for meat or breeding. Various breeds available.',
                stock: 'In Stock',
                quantities: {
                    '3 kids': 75000,
                    '5 kids': 122500,
                    '10 kids': 240000
                },
                specs: {
                    age: '3 months',
                    breed: 'West African Dwarf/Boer cross',
                    purpose: 'Meat/Breeding',
                    health: 'Dewormed and vaccinated'
                },
                tags: ['livestock', 'goats', 'kids', 'breeding']
            },
            {
                id: 'agri-livestock-004',
                name: 'Adult Goats',
                category: 'livestock',
                price: 45000,
                basePrice: 45000,
                image: '/img/agriculture/adult-goats.jpg',
                description: 'Mature goats for meat, milk, or breeding. Healthy and well-fed.',
                stock: 'In Stock',
                quantities: {
                    '2 goats': 90000,
                    '5 goats': 220000,
                    '10 goats': 435000
                },
                specs: {
                    age: '12+ months',
                    weight: '25-40kg',
                    purpose: 'Meat/Milk/Breeding',
                    breed: 'Various available'
                },
                tags: ['livestock', 'goats', 'adult', 'meat']
            },
            {
                id: 'agri-livestock-005',
                name: 'Sheep Lambs',
                category: 'livestock',
                price: 30000,
                basePrice: 30000,
                image: '/img/agriculture/sheep-lambs.jpg',
                description: 'Healthy sheep lambs for meat production. Fast growing with good feed conversion.',
                stock: 'In Stock',
                quantities: {
                    '3 lambs': 90000,
                    '5 lambs': 147500,
                    '10 lambs': 290000
                },
                specs: {
                    age: '3-4 months',
                    breed: 'West African/Improved',
                    growth: 'Fast growing',
                    meat: 'Quality mutton'
                },
                tags: ['livestock', 'sheep', 'lambs', 'meat']
            },
            {
                id: 'agri-livestock-006',
                name: 'Rabbits (Breeding Stock)',
                category: 'livestock',
                price: 5000,
                basePrice: 5000,
                image: '/img/agriculture/rabbits.jpg',
                description: 'Breeding rabbits for meat production. High reproductive rate and fast growth.',
                stock: 'In Stock',
                quantities: {
                    '5 rabbits': 25000,
                    '10 rabbits': 48000,
                    '20 rabbits': 95000
                },
                specs: {
                    breed: 'New Zealand/California',
                    reproduction: 'High rate',
                    meat: 'Lean and healthy',
                    housing: 'Compact systems'
                },
                tags: ['livestock', 'rabbits', 'breeding', 'mini-livestock']
            },
            {
                id: 'agri-livestock-007',
                name: 'Snails (Breeding Stock)',
                category: 'livestock',
                price: 2000,
                basePrice: 2000,
                image: '/img/agriculture/snails.jpg',
                description: 'Giant African land snails for breeding. Low investment, high return business.',
                stock: 'In Stock',
                quantities: {
                    '50 snails': 100000,
                    '100 snails': 195000,
                    '200 snails': 385000
                },
                specs: {
                    species: 'Archachatina marginata',
                    reproduction: 'High prolificacy',
                    market: 'High demand',
                    management: 'Low cost'
                },
                tags: ['livestock', 'snails', 'breeding', 'high-value']
            },

            // =========== FISH & AQUACULTURE (15+ products) ===========
            {
                id: 'agri-fish-001',
                name: 'Catfish Juveniles (Fingerlings)',
                category: 'fish',
                price: 25,
                basePrice: 25,
                image: '/img/agriculture/catfish-juveniles.jpg',
                description: 'Healthy catfish fingerlings for pond stocking. Uniform size and disease-free.',
                stock: 'In Stock',
                quantities: {
                    '100 pieces': 2500,
                    '500 pieces': 12000,
                    '1000 pieces': 23500,
                    '5000 pieces': 115000
                },
                specs: {
                    species: 'Clarias gariepinus',
                    size: '2-3 inches',
                    survival: 'High rate',
                    growth: 'Fast growing'
                },
                tags: ['fish', 'catfish', 'fingerlings', 'aquaculture']
            },
            {
                id: 'agri-fish-002',
                name: 'Live Adult Catfish (1kg+)',
                category: 'fish',
                price: 1200,
                basePrice: 1200,
                image: '/img/agriculture/live-adult-catfish.jpg',
                description: 'Fresh live catfish ready for consumption. Grown in clean water systems.',
                stock: 'In Stock',
                quantities: {
                    '5kg': 6000,
                    '10kg': 11750,
                    '20kg': 23000,
                    '50kg': 57500
                },
                specs: {
                    weight: '1-1.5kg each',
                    freshness: 'Live delivery',
                    processing: 'Can be processed',
                    packaging: 'Oxygen bags available'
                },
                tags: ['fish', 'catfish', 'live', 'fresh']
            },
            {
                id: 'agri-fish-003',
                name: 'Roasted/Smoked Catfish',
                category: 'fish',
                price: 1800,
                basePrice: 1800,
                image: '/img/agriculture/roasted-catfish.jpg',
                description: 'Premium smoked catfish. Perfect for soups, peppersoup, and local delicacies.',
                stock: 'In Stock',
                quantities: {
                    '2kg': 3600,
                    '5kg': 8750,
                    '10kg': 17500,
                    '20kg': 34500
                },
                specs: {
                    processing: 'Traditional smoking',
                    shelf_life: '3-4 weeks',
                    packaging: 'Vacuum sealed',
                    quality: 'Premium grade'
                },
                tags: ['fish', 'catfish', 'smoked', 'processed']
            },
            {
                id: 'agri-fish-004',
                name: 'Tilapia Fingerlings',
                category: 'fish',
                price: 30,
                basePrice: 30,
                image: '/img/agriculture/tilapia-fingerlings.jpg',
                description: 'High-quality tilapia fingerlings for pond culture. Fast growth and good market value.',
                stock: 'In Stock',
                quantities: {
                    '100 pieces': 3000,
                    '500 pieces': 14500,
                    '1000 pieces': 28500,
                    '5000 pieces': 140000
                },
                specs: {
                    species: 'Oreochromis niloticus',
                    size: '1-2 inches',
                    growth: '5-6 months to harvest',
                    system: 'Pond/cage culture'
                },
                tags: ['fish', 'tilapia', 'fingerlings', 'aquaculture']
            },
            {
                id: 'agri-fish-005',
                name: 'Fish Feed (Floating)',
                category: 'fish',
                price: 7200,
                basePrice: 7200,
                image: '/img/agriculture/catfish-feed.jpg',
                description: 'Floating fish feed with 35-45% protein content. Promotes fast growth and good feed conversion.',
                stock: 'In Stock',
                quantities: {
                    '1 bag (15kg)': 7200,
                    '5 bags': 35000,
                    '10 bags': 69500,
                    '20 bags': 138000
                },
                specs: {
                    protein: '35-45%',
                    type: 'Floating pellets',
                    size: 'Various sizes',
                    brand: 'Premium quality'
                },
                tags: ['fish', 'feed', 'aquaculture', 'nutrition']
            },

            // =========== ANIMAL FEEDS (15+ products) ===========
            {
                id: 'agri-feeds-001',
                name: 'Chicken Feed (25kg bag)',
                category: 'feeds',
                price: 9500,
                basePrice: 9500,
                image: '/img/agriculture/chicken-feed.jpg',
                description: 'Complete balanced feed for layers and broilers. High protein content for optimal growth.',
                stock: 'In Stock',
                quantities: {
                    '1 bag (25kg)': 9500,
                    '5 bags': 46500,
                    '10 bags': 92500,
                    '20 bags': 184000
                },
                specs: {
                    types: 'Starter, Grower, Layer',
                    protein: '16-20%',
                    energy: 'High energy',
                    additives: 'Vitamins & minerals'
                },
                tags: ['feeds', 'chicken', 'poultry', 'nutrition']
            },
            {
                id: 'agri-feeds-002',
                name: 'Pig Feed (25kg bag)',
                category: 'feeds',
                price: 8500,
                basePrice: 8500,
                image: '/img/agriculture/pig-feed.jpg',
                description: 'Complete swine feed for different growth stages. Formulated for optimal weight gain.',
                stock: 'In Stock',
                quantities: {
                    '1 bag (25kg)': 8500,
                    '5 bags': 41500,
                    '10 bags': 82500,
                    '20 bags': 164000
                },
                specs: {
                    types: 'Weaner, Grower, Finisher',
                    protein: '18-22%',
                    digestibility: 'High',
                    additives: 'Growth promoters'
                },
                tags: ['feeds', 'pig', 'swine', 'nutrition']
            },
            {
                id: 'agri-feeds-003',
                name: 'Cattle Feed',
                category: 'feeds',
                price: 6500,
                basePrice: 6500,
                image: '/img/agriculture/cattle-feed.jpg',
                description: 'Complete feed for dairy and beef cattle. Balanced nutrition for optimal production.',
                stock: 'In Stock',
                quantities: {
                    '1 bag (25kg)': 6500,
                    '5 bags': 31500,
                    '10 bags': 62500,
                    '20 bags': 124000
                },
                specs: {
                    types: 'Dairy, Beef, Calf',
                    protein: '16-18%',
                    fiber: 'High fiber',
                    minerals: 'Complete mineral mix'
                },
                tags: ['feeds', 'cattle', 'dairy', 'beef']
            },
            {
                id: 'agri-feeds-004',
                name: 'Goat/Sheep Feed',
                category: 'feeds',
                price: 7500,
                basePrice: 7500,
                image: '/img/agriculture/goat-feed.jpg',
                description: 'Specialized feed for goats and sheep. Promotes growth and milk production.',
                stock: 'In Stock',
                quantities: {
                    '1 bag (25kg)': 7500,
                    '5 bags': 36500,
                    '10 bags': 72500,
                    '20 bags': 144000
                },
                specs: {
                    protein: '14-16%',
                    energy: 'Moderate energy',
                    minerals: 'Essential minerals',
                    palatability: 'Highly palatable'
                },
                tags: ['feeds', 'goat', 'sheep', 'small-ruminants']
            },

            // =========== FARMING SUPPLIES (20+ products) ===========
            {
                id: 'agri-supplies-001',
                name: 'Automatic Poultry Drinker',
                category: 'supplies',
                price: 1800,
                basePrice: 1800,
                image: '/img/agriculture/poultry-drinker.jpg',
                description: '4-liter capacity automatic drinker. Ensures clean water supply and reduces labor.',
                stock: 'In Stock',
                quantities: {
                    '1 unit': 1800,
                    '5 units': 8500,
                    '10 units': 16500,
                    '20 units': 32500
                },
                specs: {
                    capacity: '4 liters',
                    material: 'Food-grade plastic',
                    birds: 'Up to 20 birds',
                    features: 'Automatic refill'
                },
                tags: ['supplies', 'poultry', 'drinker', 'equipment']
            },
            {
                id: 'agri-supplies-002',
                name: 'Automatic Poultry Feeder',
                category: 'supplies',
                price: 2200,
                basePrice: 2200,
                image: '/img/agriculture/poultry-feeder.jpg',
                description: '5kg capacity automatic feeder. Reduces feed waste and ensures continuous feeding.',
                stock: 'In Stock',
                quantities: {
                    '1 unit': 2200,
                    '5 units': 10500,
                    '10 units': 20500,
                    '20 units': 40500
                },
                specs: {
                    capacity: '5kg feed',
                    material: 'Durable plastic',
                    birds: 'Up to 25 birds',
                    features: 'Feed saving design'
                },
                tags: ['supplies', 'poultry', 'feeder', 'equipment']
            },
            {
                id: 'agri-supplies-003',
                name: 'Digital Egg Incubator (96 eggs)',
                category: 'supplies',
                price: 85000,
                basePrice: 85000,
                image: '/img/agriculture/incubator.jpg',
                description: 'Automatic digital incubator with temperature and humidity control. 85%+ hatch rate.',
                stock: 'Limited Stock',
                quantities: {
                    '1 unit': 85000,
                    '2 units': 165000,
                    '5 units': 415000
                },
                specs: {
                    capacity: '96 eggs',
                    control: 'Digital automatic',
                    hatch_rate: '85%+',
                    warranty: '1 year'
                },
                tags: ['supplies', 'incubator', 'poultry', 'hatching']
            },
            {
                id: 'agri-supplies-004',
                name: 'Fishing Net (Various Sizes)',
                category: 'supplies',
                price: 4500,
                basePrice: 4500,
                image: '/img/agriculture/fish-net.jpg',
                description: 'Durable fishing nets for pond harvesting. Various mesh sizes available.',
                stock: 'In Stock',
                quantities: {
                    'Small (10m)': 4500,
                    'Medium (20m)': 8500,
                    'Large (30m)': 12500
                },
                specs: {
                    material: 'Nylon monofilament',
                    mesh: '1-4 inch options',
                    length: '10-30 meters',
                    durability: 'Long lasting'
                },
                tags: ['supplies', 'fishing', 'net', 'aquaculture']
            },
            {
                id: 'agri-supplies-005',
                name: 'Water Pump for Farming',
                category: 'supplies',
                price: 25000,
                basePrice: 25000,
                image: '/img/agriculture/water-pump.jpg',
                description: 'Diesel/ petrol water pump for irrigation and pond filling. Various capacities available.',
                stock: 'In Stock',
                quantities: {
                    '2-inch pump': 25000,
                    '3-inch pump': 35000,
                    '4-inch pump': 55000
                },
                specs: {
                    type: 'Centrifugal pump',
                    capacity: 'Various options',
                    power: 'Diesel/petrol',
                    use: 'Irrigation/water supply'
                },
                tags: ['supplies', 'water-pump', 'irrigation', 'equipment']
            }
        ];

        // CART FUNCTIONS (Same as other pages)
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

        function addToCart(product, selectedQuantity = null) {
            console.log('Adding to cart:', product, 'Quantity:', selectedQuantity);
            
            if (!product || !product.id || !product.name) {
                console.error('Invalid product data:', product);
                return false;
            }
            
            const cart = getCart();
            const productKey = selectedQuantity ? `${product.id}-${selectedQuantity}` : product.id;
            const productName = selectedQuantity ? `${product.name} (${selectedQuantity})` : product.name;
            const productPrice = selectedQuantity && product.quantities && product.quantities[selectedQuantity] 
                ? product.quantities[selectedQuantity] 
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
                    quantityOption: selectedQuantity
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
            console.log('CIL Agriculture page loaded');
            
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
            const productsPerPage = 12;
            let filteredProducts = [...agricultureProducts];
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
                    const selectedQuantity = addToCartBtn.getAttribute('data-quantity');
                    const product = agricultureProducts.find(p => p.id === productId);
                    
                    if (product) {
                        console.log('Add to cart clicked for:', product.name, 'Quantity:', selectedQuantity);
                        
                        // Add to cart
                        addToCart(product, selectedQuantity);
                        
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
                
                filteredProducts = agricultureProducts.filter(product => {
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
                const hasQuantities = product.quantities && Object.keys(product.quantities).length > 0;
                const primaryTag = product.tags ? product.tags[0] : '';
                const tagClass = getTagClass(primaryTag);
                
                // Determine default quantity and price
                let defaultQuantity = null;
                let defaultPrice = product.price;
                if (hasQuantities) {
                    const quantities = Object.keys(product.quantities);
                    defaultQuantity = quantities[0]; // First option
                    defaultPrice = product.quantities[defaultQuantity];
                }
                
                card.innerHTML = `
                    <div class="product-category-badge">${categoryName}</div>
                    ${primaryTag ? `<span class="agriculture-tag ${tagClass}">${primaryTag.toUpperCase()}</span>` : ''}
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
                                    <span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:</span>
                                    <span class="spec-value">${value}</span>
                                </div>
                            `).join('') : ''}
                        </div>
                        
                        ${hasQuantities ? `
                            <div class="quantity-options" id="quantity-options-${product.id}">
                                ${Object.keys(product.quantities).map((quantity, index) => `
                                    <button class="quantity-option ${index === 0 ? 'selected' : ''}" 
                                            data-product="${product.id}"
                                            data-quantity="${quantity}"
                                            data-price="${product.quantities[quantity]}">
                                        ${quantity}
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
                                    ${hasQuantities ? `data-quantity="${defaultQuantity}"` : ''}>
                                 Add to Cart
                            </button>
                            <a href="https://wa.me/2348129978419?text=I'm interested in CIL Agriculture: ${encodeURIComponent(product.name)} - ₦${defaultPrice.toLocaleString()}${hasQuantities ? ` (${defaultQuantity})` : ''}" 
                               class="btn-whatsapp" target="_blank">
                                 WhatsApp
                            </a>
                        </div>
                    </div>
                `;
                
                // Add quantity selection functionality
                if (hasQuantities) {
                    setTimeout(() => {
                        const quantityOptions = card.querySelectorAll(`#quantity-options-${product.id} .quantity-option`);
                        const priceDisplay = card.querySelector(`#price-display-${product.id}`);
                        const addToCartBtn = card.querySelector('.add-to-cart');
                        
                        quantityOptions.forEach(option => {
                            option.addEventListener('click', function() {
                                // Remove selected class from all options
                                quantityOptions.forEach(opt => opt.classList.remove('selected'));
                                
                                // Add selected class to clicked option
                                this.classList.add('selected');
                                
                                // Update price display
                                const newPrice = this.getAttribute('data-price');
                                priceDisplay.textContent = `₦${parseFloat(newPrice).toLocaleString()}`;
                                
                                // Update add to cart button
                                const selectedQuantity = this.getAttribute('data-quantity');
                                addToCartBtn.setAttribute('data-quantity', selectedQuantity);
                                addToCartBtn.setAttribute('data-price', newPrice);
                                
                                // Update WhatsApp link
                                const whatsappBtn = card.querySelector('.btn-whatsapp');
                                const newWhatsappLink = `https://wa.me/2348129978419?text=I'm interested in CIL Agriculture: ${encodeURIComponent(product.name)} - ₦${parseFloat(newPrice).toLocaleString()} (${selectedQuantity})`;
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
                if (stock === 'Limited Stock') return 'stock-limited';
                return 'stock-custom';
            }
            
            // Get category display name
            function getCategoryName(category) {
                const categories = {
                    'poultry': ' Poultry',
                    'livestock': ' Livestock',
                    'fish': ' Fish',
                    'feeds': ' Feeds',
                    'supplies': ' Supplies'
                };
                return categories[category] || category;
            }
            
            // Get tag class
            function getTagClass(tag) {
                const tagClasses = {
                    'poultry': 'tag-poultry',
                    'livestock': 'tag-livestock',
                    'fish': 'tag-fish',
                    'feeds': 'tag-feeds',
                    'supplies': 'tag-supplies',
                    'vaccinated': 'tag-vaccinated',
                    'organic': 'tag-organic',
                    'fresh': 'tag-organic',
                    'breeding': 'tag-livestock',
                    'meat': 'tag-poultry'
                };
                return tagClasses[tag] || 'tag-poultry';
            }
            
            // Update product count display
            function updateProductCount() {
                if (!productCount) return;
                
                const totalProducts = filteredProducts.length;
                const showingProducts = Math.min(currentPage * productsPerPage, totalProducts);
                
                if (totalProducts === 0) {
                    productCount.textContent = 'No agriculture products found matching your criteria';
                } else {
                    productCount.textContent = `Showing ${showingProducts} of ${totalProducts} agriculture products`;
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
            
            // Setup cart drawer (same as other pages)
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
                                <a href="/shop-agriculture" class="btn btn-primary">Browse Agriculture Products</a>
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

console.log('Agriculture page JavaScript loaded successfully');