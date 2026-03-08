// shop-furniture.js - Enhanced Furniture Products with Images
document.addEventListener('DOMContentLoaded', function() {
    console.log('Furniture page loaded - initializing...');
    
    // Check if we're on a furniture page
    const furnitureElements = document.querySelector('.furniture-products, [data-page="furniture"], .category-header');
    if (!furnitureElements) {
        console.log('Not on furniture page, skipping initialization');
        return;
    }

    // Furniture products data with proper image paths
    const furnitureProducts = [
        // =========== OFFICE FURNITURE ===========
        {
            id: 'furn-office-001',
            name: "Executive Leather Office Chair",
            category: "office",
            subcategory: "chairs",
            price: 75000,
            basePrice: 75000,
            image: '/img/furniture/executive-office-chair.jpg',
            description: "Premium executive office chair with high-quality leather upholstery and ergonomic design for maximum comfort.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per chair',
            specs: {
                material: "Genuine Leather",
                features: "Adjustable Height, Lumbar Support, Swivel Base",
                warranty: "2 years",
                delivery: "3-5 days",
                color: "Black/Brown"
            },
            tags: ['office', 'chair', 'leather', 'executive', 'ergonomic']
        },
        {
            id: 'furn-office-002',
            name: "Fabric Office Chair",
            category: "office",
            subcategory: "chairs",
            price: 45000,
            basePrice: 45000,
            image: '/img/furniture/fabric-office-chair.jpg',
            description: "Comfortable office chair with breathable mesh back and adjustable features.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per chair',
            specs: {
                material: "Premium Fabric & Mesh",
                features: "Adjustable Armrests, Breathable Back",
                warranty: "1 year",
                delivery: "2-4 days",
                color: "Multiple options"
            },
            tags: ['office', 'chair', 'fabric', 'mesh', 'ergonomic']
        },
        {
            id: 'furn-office-003',
            name: "Executive Desk",
            category: "office",
            subcategory: "tables",
            price: 95000,
            basePrice: 95000,
            image: '/img/furniture/executive-desk.jpg',
            description: "Spacious executive desk with built-in drawers and cable management system.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per desk',
            specs: {
                material: "Solid Wood",
                features: "Built-in Drawers, Cable Management",
                dimensions: "180cm x 90cm x 75cm",
                warranty: "3 years",
                delivery: "5-7 days"
            },
            tags: ['office', 'desk', 'wood', 'executive']
        },
        {
            id: 'furn-office-004',
            name: "Conference Table",
            category: "office",
            subcategory: "tables",
            price: 185000,
            basePrice: 185000,
            image: '/img/furniture/conference-table.jpg',
            description: "Large conference table for 8-10 people with modern design.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per table',
            specs: {
                material: "Wood & Glass",
                capacity: "8-10 people",
                dimensions: "240cm x 120cm",
                warranty: "2 years",
                delivery: "7-10 days"
            },
            tags: ['office', 'table', 'conference', 'glass']
        },
        {
            id: 'furn-office-005',
            name: "Office Storage Cabinet",
            category: "office",
            subcategory: "storage",
            price: 65000,
            basePrice: 65000,
            image: '/img/furniture/storage-cabinet.jpg',
            description: "Multi-drawer storage cabinet for files and office supplies.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per cabinet',
            specs: {
                material: "Metal & Wood",
                drawers: "4 drawers",
                lock: "Built-in lock",
                warranty: "2 years",
                delivery: "3-5 days"
            },
            tags: ['office', 'cabinet', 'storage', 'filing']
        },

        // =========== LIVING ROOM FURNITURE ===========
        {
            id: 'furn-living-001',
            name: "3-Seater Fabric Sofa",
            category: "living",
            subcategory: "sofas",
            price: 125000,
            basePrice: 125000,
            image: '/img/furniture/3-seater-sofa.jpg',
            description: "Comfortable 3-seater sofa with premium fabric upholstery.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per sofa',
            specs: {
                material: "Premium Fabric",
                seats: "3 seats",
                frame: "Solid wood frame",
                cushions: "High-density foam",
                warranty: "3 years"
            },
            tags: ['living', 'sofa', 'fabric', '3-seater']
        },
        {
            id: 'furn-living-002',
            name: "L-Shaped Sectional Sofa",
            category: "living",
            subcategory: "sofas",
            price: 225000,
            basePrice: 225000,
            image: '/img/furniture/sectional-sofa.jpg',
            description: "Spacious L-shaped sectional sofa perfect for family rooms.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per set',
            specs: {
                material: "Leather/Fabric options",
                pieces: "5-piece sectional",
                color: "Various colors",
                warranty: "4 years",
                delivery: "7-10 days"
            },
            tags: ['living', 'sofa', 'sectional', 'L-shaped']
        },
        {
            id: 'furn-living-003',
            name: "Modern Coffee Table",
            category: "living",
            subcategory: "tables",
            price: 45000,
            basePrice: 45000,
            image: '/img/furniture/coffee-table.jpg',
            description: "Contemporary coffee table with tempered glass top.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per table',
            specs: {
                material: "Glass & Metal",
                dimensions: "120cm x 60cm",
                style: "Modern minimalist",
                warranty: "2 years",
                delivery: "3-5 days"
            },
            tags: ['living', 'table', 'coffee', 'glass']
        },
        {
            id: 'furn-living-004',
            name: "TV Stand Entertainment Unit",
            category: "living",
            subcategory: "storage",
            price: 85000,
            basePrice: 85000,
            image: '/img/furniture/tv-stand.jpg',
            description: "TV stand with storage shelves and cable management.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per unit',
            specs: {
                material: "Wood composite",
                capacity: "Up to 65-inch TV",
                shelves: "Adjustable shelves",
                warranty: "2 years",
                delivery: "4-6 days"
            },
            tags: ['living', 'TV', 'stand', 'entertainment']
        },
        {
            id: 'furn-living-005',
            name: "Accent Chair",
            category: "living",
            subcategory: "chairs",
            price: 55000,
            basePrice: 55000,
            image: '/img/furniture/accent-chair.jpg',
            description: "Stylish accent chair for living room decor.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per chair',
            specs: {
                material: "Fabric upholstery",
                style: "Modern accent",
                legs: "Wooden legs",
                warranty: "2 years",
                delivery: "3-5 days"
            },
            tags: ['living', 'chair', 'accent', 'decor']
        },

        // =========== DINING FURNITURE ===========
        {
            id: 'furn-dining-001',
            name: "6-Seater Dining Table Set",
            category: "dining",
            subcategory: "sets",
            price: 185000,
            basePrice: 185000,
            image: '/img/furniture/dining-table-set.jpg',
            description: "Complete dining set with table and 6 chairs.",
            stock: 'In Stock',
            minOrder: '1 set',
            unit: 'per set',
            specs: {
                material: "Solid wood",
                pieces: "Table + 6 chairs",
                capacity: "6 people",
                warranty: "3 years",
                delivery: "5-7 days"
            },
            tags: ['dining', 'set', 'table', 'chairs']
        },
        {
            id: 'furn-dining-002',
            name: "Extendable Dining Table",
            category: "dining",
            subcategory: "tables",
            price: 125000,
            basePrice: 125000,
            image: '/img/furniture/extendable-table.jpg',
            description: "Dining table with extension leaves for extra guests.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per table',
            specs: {
                material: "Wood",
                capacity: "Seats 6-10",
                feature: "Extendable design",
                warranty: "2 years",
                delivery: "4-6 days"
            },
            tags: ['dining', 'table', 'extendable', 'wood']
        },
        {
            id: 'furn-dining-003',
            name: "Upholstered Dining Chairs",
            category: "dining",
            subcategory: "chairs",
            price: 35000,
            basePrice: 35000,
            image: '/img/furniture/dining-chairs.jpg',
            description: "Set of 4 upholstered dining chairs.",
            stock: 'In Stock',
            minOrder: '4 chairs',
            unit: 'per set',
            specs: {
                material: "Fabric upholstery",
                set: "4 chairs",
                comfort: "Padded seats",
                warranty: "2 years",
                delivery: "3-5 days"
            },
            tags: ['dining', 'chairs', 'upholstered', 'set']
        },
        {
            id: 'furn-dining-004',
            name: "Bar Stools Set",
            category: "dining",
            subcategory: "chairs",
            price: 65000,
            basePrice: 65000,
            image: '/img/furniture/bar-stools.jpg',
            description: "Set of 2 adjustable height bar stools.",
            stock: 'In Stock',
            minOrder: '2 stools',
            unit: 'per set',
            specs: {
                material: "Metal & fabric",
                set: "2 stools",
                feature: "Adjustable height",
                warranty: "1 year",
                delivery: "2-4 days"
            },
            tags: ['dining', 'stools', 'bar', 'adjustable']
        },
        {
            id: 'furn-dining-005',
            name: "Kitchen Island",
            category: "dining",
            subcategory: "tables",
            price: 95000,
            basePrice: 95000,
            image: '/img/furniture/kitchen-island.jpg',
            description: "Mobile kitchen island with storage and seating.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per island',
            specs: {
                material: "Wood & metal",
                features: "Storage, seating, workspace",
                mobility: "Locking casters",
                warranty: "2 years",
                delivery: "5-7 days"
            },
            tags: ['dining', 'kitchen', 'island', 'mobile']
        },

        // =========== BEDROOM FURNITURE ===========
        {
            id: 'furn-bedroom-001',
            name: "Queen Bed Frame",
            category: "bedroom",
            subcategory: "beds",
            price: 85000,
            basePrice: 85000,
            image: '/img/furniture/queen-bed.jpg',
            description: "Solid wood queen bed frame with headboard.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per bed',
            specs: {
                material: "Solid wood",
                size: "Queen size",
                features: "Headboard included",
                warranty: "3 years",
                delivery: "4-6 days"
            },
            tags: ['bedroom', 'bed', 'queen', 'wood']
        },
        {
            id: 'furn-bedroom-002',
            name: "Wardrobe Closet",
            category: "bedroom",
            subcategory: "storage",
            price: 125000,
            basePrice: 125000,
            image: '/img/furniture/wardrobe.jpg',
            description: "Spacious wardrobe with hanging space and shelves.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per wardrobe',
            specs: {
                material: "Wood composite",
                doors: "Sliding doors",
                storage: "Hanging & shelves",
                warranty: "2 years",
                delivery: "5-7 days"
            },
            tags: ['bedroom', 'wardrobe', 'closet', 'storage']
        },
        {
            id: 'furn-bedroom-003',
            name: "Dressing Table with Mirror",
            category: "bedroom",
            subcategory: "tables",
            price: 75000,
            basePrice: 75000,
            image: '/img/furniture/dressing-table.jpg',
            description: "Vanity dressing table with mirror and storage.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per set',
            specs: {
                material: "Wood & mirror",
                features: "Mirror, drawers, stool",
                style: "Vanity dressing table",
                warranty: "2 years",
                delivery: "3-5 days"
            },
            tags: ['bedroom', 'dressing', 'table', 'vanity']
        },
        {
            id: 'furn-bedroom-004',
            name: "Nightstand Set",
            category: "bedroom",
            subcategory: "tables",
            price: 45000,
            basePrice: 45000,
            image: '/img/furniture/nightstands.jpg',
            description: "Set of 2 matching nightstands.",
            stock: 'In Stock',
            minOrder: '2 units',
            unit: 'per set',
            specs: {
                material: "Wood",
                set: "2 nightstands",
                drawers: "1-2 drawers each",
                warranty: "2 years",
                delivery: "2-4 days"
            },
            tags: ['bedroom', 'nightstand', 'set', 'bedside']
        },
        {
            id: 'furn-bedroom-005',
            name: "Chest of Drawers",
            category: "bedroom",
            subcategory: "storage",
            price: 85000,
            basePrice: 85000,
            image: '/img/furniture/chest-drawers.jpg',
            description: "Tall chest of drawers for clothing storage.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per chest',
            specs: {
                material: "Wood",
                drawers: "6 drawers",
                height: "120cm",
                warranty: "3 years",
                delivery: "4-6 days"
            },
            tags: ['bedroom', 'chest', 'drawers', 'storage']
        },

        // =========== SPECIALTY FURNITURE ===========
        {
            id: 'furn-special-001',
            name: "Bookshelf Unit",
            category: "special",
            subcategory: "storage",
            price: 65000,
            basePrice: 65000,
            image: '/img/furniture/bookshelf.jpg',
            description: "5-tier bookshelf for books and decor.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per shelf',
            specs: {
                material: "Wood composite",
                tiers: "5 shelves",
                adjustable: "Adjustable shelves",
                warranty: "2 years",
                delivery: "3-5 days"
            },
            tags: ['special', 'bookshelf', 'storage', 'shelves']
        },
        {
            id: 'furn-special-002',
            name: "Console Table",
            category: "special",
            subcategory: "tables",
            price: 55000,
            basePrice: 55000,
            image: '/img/furniture/console-table.jpg',
            description: "Elegant console table for hallway or entryway.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per table',
            specs: {
                material: "Wood & metal",
                length: "120cm",
                style: "Slim design",
                warranty: "2 years",
                delivery: "2-4 days"
            },
            tags: ['special', 'console', 'table', 'hallway']
        },
        {
            id: 'furn-special-003',
            name: "Display Cabinet",
            category: "special",
            subcategory: "storage",
            price: 95000,
            basePrice: 95000,
            image: '/img/furniture/display-cabinet.jpg',
            description: "Glass display cabinet for collectibles.",
            stock: 'In Stock',
            minOrder: '1 unit',
            unit: 'per cabinet',
            specs: {
                material: "Wood & glass",
                lighting: "LED lights included",
                security: "Locking doors",
                warranty: "2 years",
                delivery: "5-7 days"
            },
            tags: ['special', 'cabinet', 'display', 'glass']
        },
        {
            id: 'furn-special-004',
            name: "Folding Chairs Set",
            category: "special",
            subcategory: "chairs",
            price: 25000,
            basePrice: 25000,
            image: '/img/furniture/folding-chairs.jpg',
            description: "Set of 4 folding chairs for events.",
            stock: 'In Stock',
            minOrder: '4 chairs',
            unit: 'per set',
            specs: {
                material: "Metal & plastic",
                set: "4 chairs",
                feature: "Folding design",
                warranty: "1 year",
                delivery: "1-3 days"
            },
            tags: ['special', 'chairs', 'folding', 'events']
        },
        {
            id: 'furn-special-005',
            name: "Outdoor Patio Set",
            category: "special",
            subcategory: "sets",
            price: 185000,
            basePrice: 185000,
            image: '/img/furniture/patio-set.jpg',
            description: "Weather-resistant outdoor patio furniture set.",
            stock: 'In Stock',
            minOrder: '1 set',
            unit: 'per set',
            specs: {
                material: "Weather-resistant",
                pieces: "Table + 4 chairs",
                use: "Outdoor/patio",
                warranty: "2 years",
                delivery: "5-7 days"
            },
            tags: ['special', 'outdoor', 'patio', 'set']
        }
    ];

    // Make products available globally
    if (!window.furnitureProducts) {
        window.furnitureProducts = furnitureProducts;
    }

    // DOM Elements with null checks
    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCount = document.getElementById('product-count');
    const searchInput = document.getElementById('product-search');

    // Filter variables
    let filteredProducts = [...furnitureProducts];
    let currentCategory = 'all';

    // Initialize the page
    function initialize() {
        console.log('Initializing furniture page...');
        
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
                const product = furnitureProducts.find(p => p.id === productId);
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
        
        filteredProducts = furnitureProducts.filter(product => {
            const matchesSearch = searchTerm === '' || 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
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
                                <span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
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
            const totalProducts = furnitureProducts.length;
            const showingProducts = filteredProducts.length;
            productCount.textContent = `Showing ${showingProducts} of ${totalProducts} furniture products`;
        }
    }

    // Get stock class for styling
    function getStockClass(stock) {
        if (stock === 'In Stock') return 'stock-in';
        if (stock === 'Limited Stock') return 'stock-low';
        if (stock === 'Out of Stock') return 'stock-out';
        return 'stock-in';
    }

    // Format category name for display
    function getCategoryDisplayName(category) {
        const categories = {
            'office': ' Office Furniture',
            'living': ' Living Room',
            'dining': ' Dining Room',
            'bedroom': ' Bedroom',
            'special': ' Specialty Furniture'
        };
        return categories[category] || category;
    }

    // Get main category for shop-all.js compatibility
    function getMainCategory(product) {
        return 'furniture';
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

console.log('Furniture page JavaScript loaded successfully');