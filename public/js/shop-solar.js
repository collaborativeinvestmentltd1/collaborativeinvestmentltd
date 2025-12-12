// shop-solar.js - Complete Solar Products Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Solar page loaded - initializing...');
    
    // Check if we're on a solar page
    const solarElements = document.querySelector('.solar-products, [data-page="solar"], .category-header');
    if (!solarElements) {
        console.log('Not on solar page, skipping initialization');
        return;
    }

    // Solar products data - COMPLETELY CONSISTENT STRUCTURE
    const solarProducts = [
        // =========== SOLAR PANELS ===========
        {
            id: 'solar-panel-001',
            name: "Monocrystalline Solar Panel 330W",
            category: "panels",
            subcategory: "monocrystalline",
            price: 45000,
            basePrice: 45000,
            image: "/img/solar/monocrystalline-330w.jpg",
            description: "High-efficiency 330W monocrystalline solar panel with 20-22% efficiency, perfect for residential and commercial installations.",
            stock: "In Stock",
            minOrder: "1 panel",
            unit: "per panel",
            specs: {
                type: "Monocrystalline",
                wattage: "330W",
                efficiency: "20-22%",
                warranty: "25 years linear",
                dimensions: "1.95m x 1.0m",
                weight: "18.5kg"
            },
            tags: ['solar', 'panel', 'monocrystalline', '330w', 'high-efficiency']
        },
        {
            id: 'solar-panel-002',
            name: "Polycrystalline Solar Panel 300W",
            category: "panels",
            subcategory: "polycrystalline",
            price: 38000,
            basePrice: 38000,
            image: "/img/solar/polycrystalline-300w.jpg",
            description: "Cost-effective 300W polycrystalline solar panel with 16-18% efficiency for budget-conscious solar projects.",
            stock: "In Stock",
            minOrder: "1 panel",
            unit: "per panel",
            specs: {
                type: "Polycrystalline",
                wattage: "300W",
                efficiency: "16-18%",
                warranty: "25 years",
                dimensions: "1.96m x 0.99m",
                weight: "19kg"
            },
            tags: ['solar', 'panel', 'polycrystalline', '300w', 'budget']
        },
        {
            id: 'solar-panel-003',
            name: "Monocrystalline Solar Panel 550W",
            category: "panels",
            subcategory: "monocrystalline",
            price: 75000,
            basePrice: 75000,
            image: "/img/solar/monocrystalline-550w.jpg",
            description: "High-power 550W monocrystalline panel with 21-23% efficiency for commercial and industrial solar installations.",
            stock: "In Stock",
            minOrder: "1 panel",
            unit: "per panel",
            specs: {
                type: "Monocrystalline",
                wattage: "550W",
                efficiency: "21-23%",
                warranty: "25 years linear",
                dimensions: "2.27m x 1.13m",
                weight: "27.5kg"
            },
            tags: ['solar', 'panel', 'monocrystalline', '550w', 'commercial']
        },

        // =========== SOLAR INVERTERS ===========
        {
            id: 'solar-inverter-001',
            name: "Pure Sine Wave Inverter 3KVA",
            category: "inverters",
            subcategory: "pure-sine",
            price: 125000,
            basePrice: 125000,
            image: "/img/solar/pure-sine-3kva.jpg",
            description: "3KVA pure sine wave inverter perfect for homes with sensitive electronics like computers, TVs, and medical equipment.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per inverter",
            specs: {
                type: "Pure Sine Wave",
                capacity: "3KVA/2400W",
                input: "24V DC",
                output: "220V AC",
                efficiency: "90-95%",
                warranty: "2 years"
            },
            tags: ['solar', 'inverter', 'pure-sine', '3kva', 'home']
        },
        {
            id: 'solar-inverter-002',
            name: "Hybrid Solar Inverter 5KVA",
            category: "inverters",
            subcategory: "hybrid",
            price: 325000,
            basePrice: 325000,
            image: "/img/solar/hybrid-5kva.jpg",
            description: "5KVA hybrid inverter with MPPT solar charger and grid backup functionality for seamless power supply.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per inverter",
            specs: {
                type: "Hybrid MPPT",
                capacity: "5KVA/4000W",
                features: "Solar + Grid + Generator input",
                charger: "MPPT solar charger included",
                warranty: "3 years",
                monitoring: "WIFI/Bluetooth options available"
            },
            tags: ['solar', 'inverter', 'hybrid', '5kva', 'mppt']
        },
        {
            id: 'solar-inverter-003',
            name: "Pure Sine Wave Inverter 1.5KVA",
            category: "inverters",
            subcategory: "pure-sine",
            price: 75000,
            basePrice: 75000,
            image: "/img/solar/pure-sine-1.5kva.jpg",
            description: "Compact 1.5KVA pure sine wave inverter for small homes, offices, and basic power backup needs.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per inverter",
            specs: {
                type: "Pure Sine Wave",
                capacity: "1.5KVA/1200W",
                input: "12V DC",
                output: "220V AC",
                efficiency: "85-90%",
                warranty: "18 months"
            },
            tags: ['solar', 'inverter', 'pure-sine', '1.5kva', 'compact']
        },

        // =========== SOLAR BATTERIES ===========
        {
            id: 'solar-battery-001',
            name: "Lithium LiFePO4 Battery 100Ah",
            category: "batteries",
            subcategory: "lithium",
            price: 125000,
            basePrice: 125000,
            image: "/img/solar/lifepo4-100ah.jpg",
            description: "Advanced lithium iron phosphate battery with 3000+ cycles, lightweight, and 5-year warranty for long-term solar storage.",
            stock: "In Stock",
            minOrder: "1 battery",
            unit: "per battery",
            specs: {
                type: "LiFePO4 Lithium",
                capacity: "100Ah",
                voltage: "12.8V",
                cycles: "3000+",
                warranty: "5 years",
                weight: "14kg"
            },
            tags: ['solar', 'battery', 'lithium', 'lifepo4', '100ah']
        },
        {
            id: 'solar-battery-002',
            name: "Gel Deep Cycle Battery 200Ah",
            category: "batteries",
            subcategory: "gel",
            price: 85000,
            basePrice: 85000,
            image: "/img/solar/gel-200ah.jpg",
            description: "Maintenance-free gel battery with excellent deep cycle performance (1200+ cycles) for reliable solar energy storage.",
            stock: "In Stock",
            minOrder: "1 battery",
            unit: "per battery",
            specs: {
                type: "Gel VRLA",
                capacity: "200Ah",
                voltage: "12V",
                cycles: "1200+",
                warranty: "2 years",
                maintenance: "Maintenance-free"
            },
            tags: ['solar', 'battery', 'gel', 'deep-cycle', '200ah']
        },
        {
            id: 'solar-battery-003',
            name: "AGM Solar Battery 150Ah",
            category: "batteries",
            subcategory: "agm",
            price: 65000,
            basePrice: 65000,
            image: "/img/solar/agm-150ah.jpg",
            description: "Affordable AGM battery suitable for entry-level solar power systems with 800+ cycles and good performance.",
            stock: "In Stock",
            minOrder: "1 battery",
            unit: "per battery",
            specs: {
                type: "AGM VRLA",
                capacity: "150Ah",
                voltage: "12V",
                cycles: "800+",
                warranty: "18 months",
                price: "Budget-friendly"
            },
            tags: ['solar', 'battery', 'agm', '150ah', 'budget']
        },

        // =========== CHARGE CONTROLLERS ===========
        {
            id: 'solar-controller-001',
            name: "MPPT Charge Controller 60A",
            category: "controllers",
            subcategory: "mppt",
            price: 65000,
            basePrice: 65000,
            image: "/img/solar/mppt-60a.jpg",
            description: "60A MPPT charge controller for maximum solar energy harvest with 98-99% efficiency and LCD display.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per controller",
            specs: {
                type: "MPPT",
                current: "60A",
                voltage: "12/24/48V auto",
                efficiency: "98-99%",
                warranty: "2 years",
                display: "LCD with settings"
            },
            tags: ['solar', 'controller', 'mppt', '60a', 'efficient']
        },
        {
            id: 'solar-controller-002',
            name: "PWM Charge Controller 40A",
            category: "controllers",
            subcategory: "pwm",
            price: 25000,
            basePrice: 25000,
            image: "/img/solar/pwm-40a.jpg",
            description: "40A PWM charge controller for basic solar power systems with reliable performance and simple operation.",
            stock: "In Stock",
            minOrder: "1 unit",
            unit: "per controller",
            specs: {
                type: "PWM",
                current: "40A",
                voltage: "12/24V",
                efficiency: "75-80%",
                warranty: "1 year",
                features: "Basic protection functions"
            },
            tags: ['solar', 'controller', 'pwm', '40a', 'basic']
        },

        // =========== COMPLETE SOLAR SYSTEMS ===========
        {
            id: 'solar-system-001',
            name: "Home Solar System 3KVA",
            category: "systems",
            subcategory: "home",
            price: 850000,
            basePrice: 850000,
            image: "/img/solar/home-system-3kva.jpg",
            description: "Complete 3KVA solar power system for 3-4 bedroom homes including installation and all necessary components.",
            stock: "Made to Order",
            minOrder: "1 system",
            unit: "per system",
            specs: {
                includes: "6x330W panels, 4x200Ah batteries, 3KVA inverter, MPPT controller",
                backup: "8-12 hours typical",
                warranty: "5 years system warranty",
                installation: "Professional installation included",
                output: "Daily production: 6-8 kWh"
            },
            tags: ['solar', 'system', 'home', '3kva', 'complete']
        },
        {
            id: 'solar-system-002',
            name: "Business Solar System 10KVA",
            category: "systems",
            subcategory: "business",
            price: 2250000,
            basePrice: 2250000,
            image: "/img/solar/business-system-10kva.jpg",
            description: "10KVA commercial solar system for offices, shops, and small businesses with professional installation.",
            stock: "Made to Order",
            minOrder: "1 system",
            unit: "per system",
            specs: {
                includes: "20x330W panels, 8x200Ah batteries, 10KVA hybrid inverter",
                backup: "Full business day operation",
                warranty: "5 years system warranty",
                installation: "Professional commercial installation",
                monitoring: "Remote monitoring system"
            },
            tags: ['solar', 'system', 'business', '10kva', 'commercial']
        },

        // =========== SOLAR LIGHTS ===========
        {
            id: 'solar-light-001',
            name: "Solar Street Light 60W",
            category: "lights",
            subcategory: "street",
            price: 45000,
            basePrice: 45000,
            image: "/img/solar/street-light-60w.jpg",
            description: "60W solar street light with motion sensor, automatic dusk-to-dawn operation, and 12-14 hours runtime.",
            stock: "In Stock",
            minOrder: "4 units",
            unit: "per light",
            specs: {
                type: "LED Solar Street Light",
                power: "60W LED",
                battery: "Lithium 12.8V 40Ah",
                operation: "12-14 hours",
                sensor: "Motion sensor included",
                pole: "6-meter pole included"
            },
            tags: ['solar', 'light', 'street', '60w', 'motion-sensor']
        },
        {
            id: 'solar-light-002',
            name: "Solar Flood Light 100W",
            category: "lights",
            subcategory: "flood",
            price: 35000,
            basePrice: 35000,
            image: "/img/solar/flood-light-100w.jpg",
            description: "100W solar flood light for security and area illumination with wide coverage and motion detection.",
            stock: "In Stock",
            minOrder: "2 units",
            unit: "per light",
            specs: {
                type: "Solar Flood Light",
                power: "100W LED",
                battery: "Lithium 12.8V 30Ah",
                coverage: "Large area illumination",
                features: "Motion detection, adjustable",
                runtime: "8-10 hours on high"
            },
            tags: ['solar', 'light', 'flood', '100w', 'security']
        },

        // =========== SOLAR ACCESSORIES ===========
        {
            id: 'solar-accessory-001',
            name: "Solar DC Cable Set",
            category: "accessories",
            subcategory: "cables",
            price: 15000,
            basePrice: 15000,
            image: "/img/solar/dc-cables.jpg",
            description: "Complete set of UV-resistant solar DC cables with MC4 connectors for safe and efficient solar installations.",
            stock: "In Stock",
            minOrder: "1 set",
            unit: "per set",
            specs: {
                cable: "PV1-F 6mm² solar cable",
                length: "20 meters total (10m red, 10m black)",
                connectors: "MC4 connectors included",
                color: "Red/Black for polarity",
                rating: "1000V DC, 90°C rated"
            },
            tags: ['solar', 'cables', 'accessory', 'installation']
        },
        {
            id: 'solar-accessory-002',
            name: "Solar Mounting Structure",
            category: "accessories",
            subcategory: "mounting",
            price: 35000,
            basePrice: 35000,
            image: "/img/solar/mounting-structure.jpg",
            description: "Galvanized steel mounting structure for 6 solar panels with adjustable angles for optimal sun exposure.",
            stock: "In Stock",
            minOrder: "1 structure",
            unit: "per structure",
            specs: {
                material: "Hot-dip galvanized steel",
                capacity: "6 panels (up to 2kW)",
                type: "Ground-mounted adjustable",
                warranty: "10 years",
                installation: "Easy assembly design"
            },
            tags: ['solar', 'mounting', 'structure', 'installation']
        },

        // =========== SOLAR SERVICES ===========
        {
            id: 'solar-service-001',
            name: "Solar Installation Service",
            category: "services",
            subcategory: "installation",
            price: 75000,
            basePrice: 75000,
            image: "/img/solar/installation-service.jpg",
            description: "Professional solar system installation service by certified technicians including site assessment and commissioning.",
            stock: "Service",
            minOrder: "1 installation",
            unit: "per installation",
            specs: {
                service: "Complete installation service",
                team: "Certified solar technicians",
                includes: "Site assessment, installation, testing",
                warranty: "1 year workmanship warranty",
                coverage: "Residential and commercial"
            },
            tags: ['solar', 'service', 'installation', 'professional']
        },
        {
            id: 'solar-service-002',
            name: "Solar Water Heater System",
            category: "services",
            subcategory: "water-heating",
            price: 120000,
            basePrice: 120000,
            image: "/img/solar/water-heater-system.jpg",
            description: "Complete solar thermal water heating system for domestic hot water supply with installation included.",
            stock: "Made to Order",
            minOrder: "1 system",
            unit: "per system",
            specs: {
                capacity: "150-200 liters storage",
                type: "Thermosiphon system",
                collectors: "2-3 evacuated tube collectors",
                installation: "Professional installation included",
                savings: "Reduces electricity bill by 60-80%"
            },
            tags: ['solar', 'water-heater', 'thermal', 'energy-saving']
        }
    ];

    // Make products available globally
    if (!window.solarProducts) {
        window.solarProducts = solarProducts;
    }

    // DOM Elements with null checks
    const productsGrid = document.getElementById('products-grid') || document.querySelector('.products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCount = document.getElementById('product-count');
    const searchInput = document.getElementById('product-search');

    // Filter variables
    let filteredProducts = [...solarProducts];
    let currentCategory = 'all';

    // Initialize the page
    function initialize() {
        console.log('Initializing solar page...');
        
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
                const product = solarProducts.find(p => p.id === productId);
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
        
        filteredProducts = solarProducts.filter(product => {
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
                                ${product.stock === 'Out of Stock' || product.stock === 'Service' ? 'disabled' : ''}>
                            ${product.stock === 'Out of Stock' ? 'Out of Stock' : product.stock === 'Service' ? 'Contact Us' : 'Add to Cart'}
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
            const totalProducts = solarProducts.length;
            const showingProducts = filteredProducts.length;
            productCount.textContent = `Showing ${showingProducts} of ${totalProducts} solar products`;
        }
    }

    // Get stock class for styling
    function getStockClass(stock) {
        if (stock === 'In Stock') return 'stock-in';
        if (stock === 'Limited Stock') return 'stock-low';
        if (stock === 'Made to Order') return 'stock-custom';
        if (stock === 'Service') return 'stock-service';
        if (stock === 'Out of Stock') return 'stock-out';
        return 'stock-in';
    }

    // Format category name for display
    function getCategoryDisplayName(category) {
        const categories = {
            'panels': ' Solar Panels',
            'inverters': ' Inverters',
            'batteries': ' Batteries',
            'controllers': ' Controllers',
            'systems': ' Complete Systems',
            'lights': ' Solar Lights',
            'accessories': ' Accessories',
            'services': ' Services'
        };
        return categories[category] || category;
    }

    // Get main category for shop-all.js compatibility
    function getMainCategory(product) {
        return 'solar';
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

console.log('Solar page JavaScript loaded successfully');