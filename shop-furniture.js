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

        // FURNITURE PRODUCTS DATA - EXPANDED WITH MORE PRODUCTS
        const furnitureProducts = [
            // =========== OFFICE FURNITURE (15 products) ===========
            {
                id: 'furn-office-001',
                name: 'Executive Mahogany Desk',
                category: 'office',
                price: 450000,
                basePrice: 450000,
                image: '/img/furniture/executive-mahogany-desk.jpg',
                description: 'Solid mahogany executive desk with built-in cable management, leather inlay, and premium hardware.',
                stock: 'In Stock',
                sizes: {
                    'Standard (180x90cm)': 450000,
                    'Large (200x100cm)': 550000,
                    'Executive (220x110cm)': 650000
                },
                specs: {
                    material: 'Solid Mahogany Wood',
                    finish: 'Hand-rubbed oil finish',
                    features: 'Cable management, leather inlay'
                },
                tags: ['office', 'desk', 'mahogany', 'executive']
            },
            {
                id: 'furn-office-002',
                name: 'Modern Conference Table',
                category: 'office',
                price: 680000,
                basePrice: 680000,
                image: '/img/furniture/modern-conference-table.jpg',
                description: 'Elegant 10-seater conference table with tempered glass top and polished metal base.',
                stock: 'In Stock',
                sizes: {
                    '8-Seater': 550000,
                    '10-Seater': 680000,
                    '12-Seater': 850000
                },
                specs: {
                    material: 'Tempered Glass & Metal',
                    capacity: '8-12 seats',
                    features: 'Professional design, durable construction'
                },
                tags: ['office', 'conference', 'table', 'glass']
            },
            {
                id: 'furn-office-003',
                name: 'Premium Ergonomic Chair',
                category: 'office',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/ergonomic-office-chair.jpg',
                description: 'High-back executive chair with advanced lumbar support, adjustable arms, and premium mesh fabric.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 185000,
                    'Executive': 225000,
                    'Managerial': 285000
                },
                specs: {
                    material: 'Premium Mesh & Leather',
                    features: 'Lumbar support, adjustable arms, tilt mechanism',
                    comfort: 'Ergonomic design with breathable mesh'
                },
                tags: ['office', 'chair', 'ergonomic', 'mesh']
            },
            {
                id: 'furn-office-004',
                name: 'Office Reception Desk',
                category: 'office',
                price: 320000,
                basePrice: 320000,
                image: '/img/furniture/reception-desk.jpg',
                description: 'Professional reception desk with built-in storage, cable management, and durable laminate finish.',
                stock: 'In Stock',
                sizes: {
                    'Small (1.5m)': 220000,
                    'Medium (2m)': 320000,
                    'Large (2.5m)': 420000
                },
                specs: {
                    material: 'Laminate & Metal',
                    features: 'Built-in storage, cable management',
                    style: 'Modern professional'
                },
                tags: ['office', 'reception', 'desk', 'professional']
            },
            {
                id: 'furn-office-005',
                name: 'Office Storage Cabinet',
                category: 'office',
                price: 125000,
                basePrice: 125000,
                image: '/img/furniture/storage-cabinet.jpg',
                description: 'Multi-drawer storage cabinet with lockable doors for document and office supply storage.',
                stock: 'In Stock',
                sizes: {
                    '2-Drawer': 85000,
                    '4-Drawer': 125000,
                    '6-Drawer': 165000
                },
                specs: {
                    material: 'Steel construction',
                    drawers: '2-6 drawers',
                    security: 'Lockable doors'
                },
                tags: ['office', 'storage', 'cabinet', 'filing']
            },
            {
                id: 'furn-office-006',
                name: 'Office Visitor Chairs',
                category: 'office',
                price: 45000,
                basePrice: 45000,
                image: '/img/furniture/visitor-chairs.jpg',
                description: 'Set of 4 comfortable visitor chairs with modern design for reception and waiting areas.',
                stock: 'In Stock',
                sizes: {
                    'Set of 2': 25000,
                    'Set of 4': 45000,
                    'Set of 6': 65000
                },
                specs: {
                    material: 'Fabric & Metal',
                    set: '2-6 chairs',
                    comfort: 'Padded seats'
                },
                tags: ['office', 'chairs', 'visitor', 'set']
            },
            {
                id: 'furn-office-007',
                name: 'Office Bookshelf',
                category: 'office',
                price: 95000,
                basePrice: 95000,
                image: '/img/furniture/office-bookshelf.jpg',
                description: 'Sturdy office bookshelf with multiple shelves for books, files, and office decor.',
                stock: 'In Stock',
                sizes: {
                    '4-Tier': 65000,
                    '5-Tier': 85000,
                    '6-Tier': 105000
                },
                specs: {
                    material: 'Wood composite',
                    shelves: 'Adjustable shelves',
                    capacity: 'Heavy duty'
                },
                tags: ['office', 'bookshelf', 'storage', 'shelves']
            },
            {
                id: 'furn-office-008',
                name: 'Office Partition System',
                category: 'office',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/office-partition.jpg',
                description: 'Modular office partition system for creating private workspaces and cubicles.',
                stock: 'Made to Order',
                sizes: {
                    'Basic (4 panels)': 125000,
                    'Standard (8 panels)': 225000,
                    'Premium (12 panels)': 325000
                },
                specs: {
                    material: 'Glass & metal',
                    panels: 'Modular system',
                    height: 'Adjustable height'
                },
                tags: ['office', 'partition', 'cubicle', 'privacy']
            },
            {
                id: 'furn-office-009',
                name: 'Executive Desk Chair',
                category: 'office',
                price: 285000,
                basePrice: 285000,
                image: '/img/furniture/executive-desk-chair.jpg',
                description: 'Luxury executive desk chair with premium leather and advanced ergonomic features.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 285000,
                    'Deluxe': 385000,
                    'Premium': 485000
                },
                specs: {
                    material: 'Genuine leather',
                    features: 'Memory foam, adjustable everything',
                    warranty: '5 years'
                },
                tags: ['office', 'chair', 'executive', 'leather']
            },
            {
                id: 'furn-office-010',
                name: 'Office Training Table',
                category: 'office',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/training-table.jpg',
                description: 'Training room table with durable surface and built-in power outlets for workshops.',
                stock: 'In Stock',
                sizes: {
                    '4-Seater': 125000,
                    '6-Seater': 185000,
                    '8-Seater': 245000
                },
                specs: {
                    material: 'Laminate top',
                    features: 'Built-in power, cable management',
                    style: 'Training room design'
                },
                tags: ['office', 'training', 'table', 'workshop']
            },
            {
                id: 'furn-office-011',
                name: 'Office Corner Desk',
                category: 'office',
                price: 225000,
                basePrice: 225000,
                image: '/img/furniture/corner-desk.jpg',
                description: 'Space-saving L-shaped corner desk with ample workspace and storage.',
                stock: 'In Stock',
                sizes: {
                    'Standard L': 185000,
                    'Large L': 245000,
                    'Executive L': 325000
                },
                specs: {
                    material: 'Wood & metal',
                    shape: 'L-shaped corner',
                    storage: 'Built-in shelves'
                },
                tags: ['office', 'desk', 'corner', 'L-shaped']
            },
            {
                id: 'furn-office-012',
                name: 'Office Filing Cabinet',
                category: 'office',
                price: 85000,
                basePrice: 85000,
                image: '/img/furniture/filing-cabinet.jpg',
                description: 'Secure filing cabinet with lockable drawers for important document storage.',
                stock: 'In Stock',
                sizes: {
                    '2-Drawer': 65000,
                    '4-Drawer': 85000,
                    '6-Drawer': 115000
                },
                specs: {
                    material: 'Steel construction',
                    security: 'Locking mechanism',
                    capacity: 'Letter/legal size'
                },
                tags: ['office', 'filing', 'cabinet', 'storage']
            },
            {
                id: 'furn-office-013',
                name: 'Office Whiteboard',
                category: 'office',
                price: 35000,
                basePrice: 35000,
                image: '/img/furniture/office-whiteboard.jpg',
                description: 'Magnetic whiteboard with aluminum frame for presentations and brainstorming.',
                stock: 'In Stock',
                sizes: {
                    'Small (60x90cm)': 25000,
                    'Medium (90x120cm)': 35000,
                    'Large (120x180cm)': 55000
                },
                specs: {
                    material: 'Melamine surface',
                    features: 'Magnetic, marker-friendly',
                    frame: 'Aluminum frame'
                },
                tags: ['office', 'whiteboard', 'presentation', 'magnetic']
            },
            {
                id: 'furn-office-014',
                name: 'Office Printer Stand',
                category: 'office',
                price: 45000,
                basePrice: 45000,
                image: '/img/furniture/printer-stand.jpg',
                description: 'Sturdy printer stand with paper storage and cable management features.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 35000,
                    'Large': 45000,
                    'Extra Large': 65000
                },
                specs: {
                    material: 'Metal frame',
                    storage: 'Paper trays included',
                    mobility: 'Locking casters'
                },
                tags: ['office', 'printer', 'stand', 'storage']
            },
            {
                id: 'furn-office-015',
                name: 'Office Credenza',
                category: 'office',
                price: 285000,
                basePrice: 285000,
                image: '/img/furniture/credenza.jpg',
                description: 'Executive credenza with combination of drawers, cabinets, and display shelves.',
                stock: 'Made to Order',
                sizes: {
                    'Standard (1.8m)': 225000,
                    'Executive (2.4m)': 325000,
                    'Custom': 425000
                },
                specs: {
                    material: 'Wood veneer',
                    storage: 'Multiple compartments',
                    style: 'Executive design'
                },
                tags: ['office', 'credenza', 'storage', 'executive']
            },

            // =========== LIVING ROOM FURNITURE (15 products) ===========
            {
                id: 'furn-living-001',
                name: '3-Piece Living Room Set',
                category: 'living',
                price: 450000,
                basePrice: 450000,
                image: '/img/furniture/3-piece-living-set.jpg',
                description: 'Complete 3-piece living room set including sofa, loveseat, and center table.',
                stock: 'In Stock',
                sizes: {
                    '3-Piece Set': 450000,
                    '4-Piece Set': 550000,
                    '5-Piece Set': 650000
                },
                specs: {
                    pieces: 'Sofa, loveseat, center table',
                    material: 'Premium fabric',
                    style: 'Modern contemporary'
                },
                tags: ['living', 'set', 'sofa', 'modern']
            },
            {
                id: 'furn-living-002',
                name: 'Sectional Sofa',
                category: 'living',
                price: 585000,
                basePrice: 585000,
                image: '/img/furniture/sectional-sofa.jpg',
                description: 'L-shaped sectional sofa with chaise lounge for spacious family living rooms.',
                stock: 'In Stock',
                sizes: {
                    '3-Seater': 385000,
                    '4-Seater': 485000,
                    '5-Seater': 585000
                },
                specs: {
                    style: 'L-shaped sectional',
                    material: 'Premium upholstery',
                    comfort: 'High-density foam'
                },
                tags: ['living', 'sofa', 'sectional', 'L-shaped']
            },
            {
                id: 'furn-living-003',
                name: 'Center Coffee Table',
                category: 'living',
                price: 85000,
                basePrice: 85000,
                image: '/img/furniture/coffee-table.jpg',
                description: 'Modern coffee table with tempered glass top and metal legs.',
                stock: 'In Stock',
                sizes: {
                    'Small (90x60cm)': 65000,
                    'Medium (120x60cm)': 85000,
                    'Large (150x80cm)': 115000
                },
                specs: {
                    material: 'Glass & metal',
                    style: 'Modern minimalist',
                    features: 'Tempered safety glass'
                },
                tags: ['living', 'table', 'coffee', 'glass']
            },
            {
                id: 'furn-living-004',
                name: 'TV Stand Unit',
                category: 'living',
                price: 125000,
                basePrice: 125000,
                image: '/img/furniture/tv-stand.jpg',
                description: 'Entertainment center with TV stand, storage shelves, and cable management.',
                stock: 'In Stock',
                sizes: {
                    'Small (1.2m)': 95000,
                    'Medium (1.8m)': 135000,
                    'Large (2.4m)': 185000
                },
                specs: {
                    material: 'Wood composite',
                    features: 'Cable management, adjustable shelves',
                    capacity: 'Up to 65" TV'
                },
                tags: ['living', 'TV', 'stand', 'entertainment']
            },
            {
                id: 'furn-living-005',
                name: 'Accent Chair',
                category: 'living',
                price: 65000,
                basePrice: 65000,
                image: '/img/furniture/accent-chair.jpg',
                description: 'Stylish accent chair with premium fabric and elegant wooden legs.',
                stock: 'In Stock',
                sizes: {
                    'Single': 65000,
                    'Set of 2': 125000,
                    'Set of 4': 225000
                },
                specs: {
                    material: 'Fabric & wood',
                    style: 'Modern accent',
                    comfort: 'Padded seat and back'
                },
                tags: ['living', 'chair', 'accent', 'decor']
            },
            {
                id: 'furn-living-006',
                name: 'Bookshelf Unit',
                category: 'living',
                price: 95000,
                basePrice: 95000,
                image: '/img/furniture/living-bookshelf.jpg',
                description: 'Living room bookshelf with display shelves and storage compartments.',
                stock: 'In Stock',
                sizes: {
                    '4-Shelf': 75000,
                    '5-Shelf': 95000,
                    '6-Shelf': 115000
                },
                specs: {
                    material: 'Wood construction',
                    shelves: 'Adjustable heights',
                    style: 'Modern storage'
                },
                tags: ['living', 'bookshelf', 'storage', 'display']
            },
            {
                id: 'furn-living-007',
                name: 'Console Table',
                category: 'living',
                price: 75000,
                basePrice: 75000,
                image: '/img/furniture/console-table.jpg',
                description: 'Elegant console table for hallway or behind-sofa placement with storage drawer.',
                stock: 'In Stock',
                sizes: {
                    'Standard (1.2m)': 65000,
                    'Long (1.8m)': 85000,
                    'Extra Long (2.4m)': 115000
                },
                specs: {
                    material: 'Wood & metal',
                    features: 'Storage drawer, slim design',
                    use: 'Hallway or behind sofa'
                },
                tags: ['living', 'table', 'console', 'hallway']
            },
            {
                id: 'furn-living-008',
                name: 'Ottoman Coffee Table',
                category: 'living',
                price: 55000,
                basePrice: 55000,
                image: '/img/furniture/ottoman-table.jpg',
                description: 'Multipurpose ottoman that serves as coffee table, footrest, and extra seating.',
                stock: 'In Stock',
                sizes: {
                    'Small (60x60cm)': 45000,
                    'Medium (80x80cm)': 55000,
                    'Large (100x100cm)': 75000
                },
                specs: {
                    material: 'Upholstered fabric',
                    function: 'Table, footrest, seat',
                    storage: 'Some models with storage'
                },
                tags: ['living', 'ottoman', 'multipurpose', 'storage']
            },

            // =========== DINING SETS (15 products) ===========
            {
                id: 'furn-dining-001',
                name: '6-Seater Dining Set',
                category: 'dining',
                price: 285000,
                basePrice: 285000,
                image: '/img/furniture/6-seater-dining.jpg',
                description: 'Complete 6-seater dining set with table and upholstered chairs.',
                stock: 'In Stock',
                sizes: {
                    '6-Seater': 285000,
                    '8-Seater': 385000,
                    '10-Seater': 485000
                },
                specs: {
                    pieces: 'Table + 6 chairs',
                    material: 'Wood & fabric',
                    style: 'Modern dining set'
                },
                tags: ['dining', 'set', '6-seater', 'table']
            },
            {
                id: 'furn-dining-004',
                name: 'Bar Stool Set',
                category: 'dining',
                price: 125000,
                basePrice: 125000,
                image: '/img/furniture/bar-stools.jpg',
                description: 'Set of 4 adjustable height bar stools for kitchen islands.',
                stock: 'In Stock',
                sizes: {
                    'Set of 2': 75000,
                    'Set of 4': 125000,
                    'Set of 6': 185000
                },
                specs: {
                    feature: 'Height adjustable',
                    material: 'Metal & fabric',
                    height: 'Standard bar height'
                },
                tags: ['dining', 'stools', 'bar', 'adjustable']
            },
            {
                id: 'furn-dining-005',
                name: 'Buffet Sideboard',
                category: 'dining',
                price: 145000,
                basePrice: 145000,
                image: '/img/furniture/sideboard.jpg',
                description: 'Dining room sideboard for storage and serving during meals.',
                stock: 'In Stock',
                sizes: {
                    'Standard (1.2m)': 115000,
                    'Large (1.8m)': 165000,
                    'Extra Large (2.4m)': 225000
                },
                specs: {
                    material: 'Wood construction',
                    storage: 'Drawers and cabinets',
                    use: 'Serving and storage'
                },
                tags: ['dining', 'sideboard', 'buffet', 'storage']
            },
            {
                id: 'furn-dining-015',
                name: 'Children Dining Set',
                category: 'dining',
                price: 85000,
                basePrice: 85000,
                image: '/img/furniture/children-dining.jpg',
                description: 'Kid-sized dining set with table and chairs.',
                stock: 'In Stock',
                sizes: {
                    '2-Chair Set': 65000,
                    '4-Chair Set': 95000,
                    '6-Chair Set': 135000
                },
                specs: {
                    size: 'Child-sized',
                    material: 'Safe materials',
                    design: 'Colorful and fun'
                },
                tags: ['dining', 'children', 'kids', 'playroom']
            },

            // =========== BEDROOM FURNITURE (15 products) ===========
            {
                id: 'furn-bedroom-013',
                name: 'Bedroom Chair',
                category: 'bedroom',
                price: 75000,
                basePrice: 75000,
                image: '/img/furniture/bedroom-chair.jpg',
                description: 'Comfortable accent chair for bedroom reading nook.',
                stock: 'In Stock',
                sizes: {
                    'Single': 65000,
                    'Rocking': 85000,
                    'Recliner': 115000
                },
                specs: {
                    purpose: 'Bedroom seating',
                    comfort: 'Upholstered for comfort',
                    style: 'Bedroom accent chair'
                },
                tags: ['bedroom', 'chair', 'seating', 'reading']
            },
            {
                id: 'furn-bedroom-014',
                name: 'Bedroom Bookcase',
                category: 'bedroom',
                price: 115000,
                basePrice: 115000,
                image: '/img/furniture/bedroom-bookcase.jpg',
                description: 'Slim bookcase designed for bedroom storage.',
                stock: 'In Stock',
                sizes: {
                    '4-Shelf': 85000,
                    '5-Shelf': 115000,
                    '6-Shelf': 145000
                },
                specs: {
                    purpose: 'Bedroom storage',
                    design: 'Slim profile',
                    material: 'Wood construction'
                },
                tags: ['bedroom', 'bookcase', 'shelves', 'storage']
            },
            {
                id: 'furn-bedroom-015',
                name: 'Complete Bedroom Set',
                category: 'bedroom',
                price: 685000,
                basePrice: 685000,
                image: '/img/furniture/complete-bedroom.jpg',
                description: 'Complete bedroom suite including bed, wardrobe, dressing table, and nightstands.',
                stock: 'Made to Order',
                sizes: {
                    'Standard Set': 585000,
                    'Deluxe Set': 785000,
                    'Premium Set': 985000
                },
                specs: {
                    pieces: 'Complete matching set',
                    material: 'Premium wood',
                    style: 'Coordinated bedroom suite'
                },
                tags: ['bedroom', 'set', 'complete', 'suite']
            },

            // =========== SEATING & CHAIRS (15 products) ===========
            {
                id: 'furn-seating-001',
                name: 'Accent Armchair',
                category: 'seating',
                price: 85000,
                basePrice: 85000,
                image: '/img/furniture/accent-armchair.jpg',
                description: 'Stylish accent armchair for living room or bedroom.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 75000,
                    'Large': 95000,
                    'Oversized': 125000
                },
                specs: {
                    style: 'Accent chair',
                    material: 'Fabric upholstery',
                    comfort: 'Padded seat and back'
                },
                tags: ['seating', 'armchair', 'accent', 'fabric']
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
            console.log('CIL Furniture page loaded');
            
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
            let filteredProducts = [...furnitureProducts];
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
                    const product = furnitureProducts.find(p => p.id === productId);
                    
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
                
                filteredProducts = furnitureProducts.filter(product => {
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
                const primaryTag = product.tags ? product.tags[0] : '';
                const tagClass = getTagClass(primaryTag);
                
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
                    ${primaryTag ? `<span class="furniture-tag ${tagClass}">${primaryTag.toUpperCase()}</span>` : ''}
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
                            <a href="https://wa.me/2348129978419?text=I'm interested in CIL Furniture: ${encodeURIComponent(product.name)} - ₦${defaultPrice.toLocaleString()}${hasSizes ? ` (${defaultSize})` : ''}" 
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
                                const newWhatsappLink = `https://wa.me/2348129978419?text=I'm interested in CIL Furniture: ${encodeURIComponent(product.name)} - ₦${parseFloat(newPrice).toLocaleString()} (${selectedSize})`;
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
                    'office': 'Office',
                    'living': 'Living Room',
                    'dining': 'Dining',
                    'bedroom': 'Bedroom',
                    'seating': 'Seating',
                    'commercial': 'Commercial',
                    'outdoor': 'Outdoor',
                    'accessories': 'Accessories'
                };
                return categories[category] || category;
            }
            
            // Get tag class
            function getTagClass(tag) {
                const tagClasses = {
                    'wood': 'tag-wood',
                    'leather': 'tag-leather',
                    'fabric': 'tag-fabric',
                    'metal': 'tag-metal',
                    'modern': 'tag-modern',
                    'classic': 'tag-classic',
                    'luxury': 'tag-luxury',
                    'office': 'tag-wood',
                    'executive': 'tag-luxury',
                    'glass': 'tag-modern',
                    'mesh': 'tag-modern',
                    'professional': 'tag-wood',
                    'filing': 'tag-wood',
                    'set': 'tag-classic',
                    'sofa': 'tag-fabric',
                    'sectional': 'tag-fabric',
                    'L-shaped': 'tag-modern',
                    'table': 'tag-wood',
                    'coffee': 'tag-wood',
                    'entertainment': 'tag-modern',
                    'chair': 'tag-fabric',
                    'accent': 'tag-fabric',
                    'decor': 'tag-modern',
                    'storage': 'tag-wood',
                    'display': 'tag-glass',
                    'TV': 'tag-modern',
                    'ottoman': 'tag-fabric',
                    'multipurpose': 'tag-modern',
                    'wall': 'tag-modern',
                    'fireplace': 'tag-luxury',
                    'bed': 'tag-wood',
                    'convertible': 'tag-modern',
                    'bar': 'tag-wood',
                    'wine': 'tag-luxury',
                    'china': 'tag-classic',
                    'patio': 'tag-wood',
                    'weather-resistant': 'tag-metal',
                    'folding': 'tag-metal',
                    'space-saving': 'tag-modern',
                    'round': 'tag-classic',
                    'conversation': 'tag-classic',
                    'bench': 'tag-wood',
                    'seating': 'tag-fabric',
                    'family': 'tag-fabric',
                    'cart': 'tag-metal',
                    'serving': 'tag-wood',
                    'mobile': 'tag-metal',
                    'formal': 'tag-luxury',
                    'elegant': 'tag-luxury',
                    'pub': 'tag-wood',
                    'casual': 'tag-fabric',
                    'children': 'tag-modern',
                    'kids': 'tag-modern',
                    'playroom': 'tag-modern',
                    'queen': 'tag-wood',
                    'king': 'tag-wood',
                    'closet': 'tag-wood',
                    'vanity': 'tag-classic',
                    'bedside': 'tag-wood',
                    'chest': 'tag-wood',
                    'drawers': 'tag-wood',
                    'mirror': 'tag-modern',
                    'canopy': 'tag-luxury',
                    'romantic': 'tag-luxury',
                    'armoire': 'tag-classic',
                    'traditional': 'tag-classic',
                    'practical': 'tag-modern',
                    'jewelry': 'tag-luxury',
                    'entertainment': 'tag-modern',
                    'reading': 'tag-fabric',
                    'shelves': 'tag-wood',
                    'suite': 'tag-luxury',
                    'recliner': 'tag-leather',
                    'comfort': 'tag-fabric',
                    'rocking': 'tag-classic',
                    'nursery': 'tag-modern',
                    'events': 'tag-metal',
                    'ergonomic': 'tag-modern',
                    'beanbag': 'tag-fabric',
                    'entryway': 'tag-wood',
                    'swivel': 'tag-metal',
                    'chaise': 'tag-luxury',
                    'stools': 'tag-wood',
                    'adjustable': 'tag-metal',
                    'cushions': 'tag-fabric',
                    'floor': 'tag-fabric',
                    'director': 'tag-classic',
                    'canvas': 'tag-fabric',
                    'side': 'tag-wood',
                    'simple': 'tag-wood',
                    'lounge': 'tag-fabric'
                };
                return tagClasses[tag] || 'tag-wood';
            }
            
            // Update product count display
            function updateProductCount() {
                if (!productCount) return;
                
                const totalProducts = filteredProducts.length;
                const showingProducts = Math.min(currentPage * productsPerPage, totalProducts);
                
                if (totalProducts === 0) {
                    productCount.textContent = 'No furniture products found matching your criteria';
                } else {
                    productCount.textContent = `Showing ${showingProducts} of ${totalProducts} furniture products`;
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
                                <a href="/shop-furniture" class="btn btn-primary">Browse Furniture</a>
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

console.log('Furniture page JavaScript loaded successfully');