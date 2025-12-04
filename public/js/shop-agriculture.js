// shop-agriculture.js - Complete Agriculture Products Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Agriculture page loaded - initializing...');
    
    // Check if we're on an agriculture page
    const agricultureElements = document.querySelector('.agriculture-products, [data-page="agriculture"], .category-header');
    if (!agricultureElements) {
        console.log('Not on agriculture page, skipping initialization');
        return;
    }

    // Agriculture products data
    const agricultureProducts = [
        // POULTRY PRODUCTS
        {
            id: 'agri-001',
            name: 'Crate of Eggs (30 pieces)',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 2400,
            image: '/img/agriculture/crate-of-eggs.jpg',
            description: 'Fresh farm eggs from our free-range layers. Rich in nutrients and perfect for consumption or hatching.',
            stock: 'In Stock',
            minOrder: '1 Crate',
            unit: 'per crate',
            tags: ['poultry', 'eggs', 'fresh']
        },
        {
            id: 'agri-002',
            name: 'Day Old Broiler Chicks',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 450,
            image: '/img/agriculture/day-old-broilers.jpg',
            description: 'High-quality broiler chicks with fast growth rate. Ready for meat production in 6-8 weeks.',
            stock: 'In Stock',
            minOrder: '50 chicks',
            unit: 'each',
            tags: ['poultry', 'chicks', 'broiler']
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
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.dataset.id;
                const product = agricultureProducts.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            }
        });
    }

    // Filter products based on category
    function filterProducts() {
        filteredProducts = agricultureProducts.filter(product => {
            return currentCategory === 'all' || product.subcategory === currentCategory;
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
                
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-price">₦${product.price.toLocaleString()} ${product.unit}</div>
                    
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
            const totalProducts = agricultureProducts.length;
            const showingProducts = filteredProducts.length;
            productCount.textContent = `Showing ${showingProducts} of ${totalProducts} agriculture products`;
        }
    }

    // Get stock class for styling
    function getStockClass(stock) {
        if (stock === 'In Stock') return '';
        if (stock === 'Limited Stock') return 'low-stock';
        if (stock === 'Made to Order') return 'out-of-stock';
        return '';
    }

    // Format category name for display
    function formatCategoryName(category) {
        const names = {
            'poultry': '🐔 Poultry',
            'livestock': '🐖 Livestock',
            'fish': '🐟 Fish',
            'feeds': '🌾 Feeds',
            'supplies': '⚙️ Supplies'
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

console.log('Agriculture page JavaScript loaded successfully');