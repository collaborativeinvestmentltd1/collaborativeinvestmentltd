
        // SOLAR PRODUCTS DATA - EXPANDED WITH HIGH-DEMAND PRODUCTS
        const solarProducts = [
            // =========== SOLAR PANELS (Best Sellers) ===========
            {
                id: 'solar-panel-001',
                name: 'Monocrystalline Solar Panel 330W',
                category: 'panels',
                price: 45000,
                basePrice: 45000,
                image: '/img/solar/monocrystalline-330w.jpg',
                description: 'High-efficiency monocrystalline solar panel with 330W output, perfect for residential and commercial installations.',
                stock: 'In Stock',
                capacities: {
                    '330W (Single)': 45000,
                    '3.3KW (10 Panels)': 425000,
                    '6.6KW (20 Panels)': 825000
                },
                specs: {
                    type: 'Monocrystalline',
                    wattage: '330W',
                    efficiency: '20-22%',
                    warranty: '25 years linear'
                },
                tags: ['mono', 'panel', 'best-seller', '330w']
            },
            {
                id: 'solar-panel-002',
                name: 'Polycrystalline Solar Panel 300W',
                category: 'panels',
                price: 38000,
                basePrice: 38000,
                image: '/img/solar/polycrystalline-300w.jpg',
                description: 'Cost-effective polycrystalline solar panel with 300W output for budget-conscious projects.',
                stock: 'In Stock',
                capacities: {
                    '300W (Single)': 38000,
                    '3KW (10 Panels)': 365000,
                    '6KW (20 Panels)': 715000
                },
                specs: {
                    type: 'Polycrystalline',
                    wattage: '300W',
                    efficiency: '16-18%',
                    warranty: '25 years'
                },
                tags: ['poly', 'panel', 'budget', '300w']
            },
            {
                id: 'solar-panel-003',
                name: 'Monocrystalline Solar Panel 550W',
                category: 'panels',
                price: 75000,
                basePrice: 75000,
                image: '/img/solar/monocrystalline-550w.jpg',
                description: 'High-power 550W monocrystalline panel for commercial and industrial installations.',
                stock: 'In Stock',
                capacities: {
                    '550W (Single)': 75000,
                    '5.5KW (10 Panels)': 725000,
                    '11KW (20 Panels)': 1425000
                },
                specs: {
                    type: 'Monocrystalline',
                    wattage: '550W',
                    efficiency: '21-23%',
                    warranty: '25 years linear'
                },
                tags: ['mono', 'panel', 'commercial', '550w']
            },

            // =========== SOLAR BATTERIES (High Demand) ===========
            {
                id: 'solar-battery-001',
                name: 'Lithium LiFePO4 Battery 100Ah',
                category: 'batteries',
                price: 125000,
                basePrice: 125000,
                image: '/img/solar/lifepo4-100ah.jpg',
                description: 'Advanced lithium iron phosphate battery with 3000+ cycles and 5-year warranty.',
                stock: 'In Stock',
                capacities: {
                    '100Ah (Single)': 125000,
                    '200Ah (2 units)': 245000,
                    '400Ah (4 units)': 480000
                },
                specs: {
                    type: 'LiFePO4 Lithium',
                    capacity: '100Ah',
                    cycles: '3000+',
                    warranty: '5 years'
                },
                tags: ['lithium', 'battery', 'best-seller', 'lifepo4']
            },
            {
                id: 'solar-battery-002',
                name: 'Gel Deep Cycle Battery 200Ah',
                category: 'batteries',
                price: 85000,
                basePrice: 85000,
                image: '/img/solar/gel-200ah.jpg',
                description: 'Maintenance-free gel battery with excellent deep cycle performance for solar systems.',
                stock: 'In Stock',
                capacities: {
                    '200Ah (Single)': 85000,
                    '400Ah (2 units)': 165000,
                    '800Ah (4 units)': 325000
                },
                specs: {
                    type: 'Gel VRLA',
                    capacity: '200Ah',
                    cycles: '1200+',
                    warranty: '2 years'
                },
                tags: ['gel', 'battery', 'deep-cycle', '200ah']
            },
            {
                id: 'solar-battery-003',
                name: 'AGM Solar Battery 150Ah',
                category: 'batteries',
                price: 65000,
                basePrice: 65000,
                image: '/img/solar/agm-150ah.jpg',
                description: 'Affordable AGM battery suitable for entry-level solar power systems.',
                stock: 'In Stock',
                capacities: {
                    '150Ah (Single)': 65000,
                    '300Ah (2 units)': 125000,
                    '600Ah (4 units)': 245000
                },
                specs: {
                    type: 'AGM VRLA',
                    capacity: '150Ah',
                    cycles: '800+',
                    warranty: '18 months'
                },
                tags: ['agm', 'battery', 'budget', '150ah']
            },

            // =========== SOLAR INVERTERS (Most Popular) ===========
            {
                id: 'solar-inverter-001',
                name: 'Pure Sine Wave Inverter 3KVA',
                category: 'inverters',
                price: 125000,
                basePrice: 125000,
                image: '/img/solar/pure-sine-3kva.jpg',
                description: '3KVA pure sine wave inverter perfect for homes with sensitive electronics.',
                stock: 'In Stock',
                capacities: {
                    '3KVA (24V)': 125000,
                    '3KVA (48V)': 135000,
                    'With LCD Display': 145000
                },
                specs: {
                    type: 'Pure Sine Wave',
                    capacity: '3KVA/2400W',
                    efficiency: '90-95%',
                    warranty: '2 years'
                },
                tags: ['pure-sine', 'inverter', 'best-seller', '3kva']
            },
            {
                id: 'solar-inverter-002',
                name: 'Hybrid Solar Inverter 5KVA',
                category: 'inverters',
                price: 325000,
                basePrice: 325000,
                image: '/img/solar/hybrid-5kva.jpg',
                description: '5KVA hybrid inverter with MPPT solar charger and grid backup functionality.',
                stock: 'In Stock',
                capacities: {
                    '5KVA (48V)': 325000,
                    'With WIFI Monitoring': 375000,
                    'With Bluetooth': 350000
                },
                specs: {
                    type: 'Hybrid MPPT',
                    capacity: '5KVA/4000W',
                    features: 'Solar + Grid + Generator',
                    warranty: '3 years'
                },
                tags: ['hybrid', 'inverter', 'mppt', '5kva']
            },
            {
                id: 'solar-inverter-003',
                name: 'Pure Sine Wave Inverter 1.5KVA',
                category: 'inverters',
                price: 75000,
                basePrice: 75000,
                image: '/img/solar/pure-sine-1.5kva.jpg',
                description: 'Compact 1.5KVA pure sine wave inverter for small homes and offices.',
                stock: 'In Stock',
                capacities: {
                    '1.5KVA (12V)': 75000,
                    '1.5KVA (24V)': 80000,
                    'With UPS function': 85000
                },
                specs: {
                    type: 'Pure Sine Wave',
                    capacity: '1.5KVA/1200W',
                    efficiency: '85-90%',
                    warranty: '18 months'
                },
                tags: ['pure-sine', 'inverter', 'compact', '1.5kva']
            },

            // =========== CHARGE CONTROLLERS ===========
            {
                id: 'solar-controller-001',
                name: 'MPPT Charge Controller 60A',
                category: 'controllers',
                price: 65000,
                basePrice: 65000,
                image: '/img/solar/mppt-60a.jpg',
                description: '60A MPPT charge controller for maximum solar energy harvest.',
                stock: 'In Stock',
                capacities: {
                    '60A (12/24V)': 65000,
                    '60A (48V)': 75000,
                    'With LCD Display': 85000
                },
                specs: {
                    type: 'MPPT',
                    current: '60A',
                    efficiency: '98-99%',
                    warranty: '2 years'
                },
                tags: ['mppt', 'controller', '60a', 'best-seller']
            },
            {
                id: 'solar-controller-002',
                name: 'PWM Charge Controller 40A',
                category: 'controllers',
                price: 25000,
                basePrice: 25000,
                image: '/img/solar/pwm-40a.jpg',
                description: '40A PWM charge controller for basic solar power systems.',
                stock: 'In Stock',
                capacities: {
                    '40A (12V)': 25000,
                    '40A (12/24V)': 30000,
                    'With LCD': 35000
                },
                specs: {
                    type: 'PWM',
                    current: '40A',
                    efficiency: '75-80%',
                    warranty: '1 year'
                },
                tags: ['pwm', 'controller', 'budget', '40a']
            },

            // =========== COMPLETE SYSTEMS (Best Sellers) ===========
            {
                id: 'solar-system-001',
                name: 'Home Solar System 3KVA',
                category: 'systems',
                price: 850000,
                basePrice: 850000,
                image: '/img/solar/home-system-3kva.jpg',
                description: 'Complete 3KVA solar power system for 3-4 bedroom homes with installation.',
                stock: 'Made to Order',
                capacities: {
                    'Basic (3KVA)': 850000,
                    'Standard (4KVA)': 1150000,
                    'Premium (5KVA)': 1450000
                },
                specs: {
                    includes: '6x330W panels, 4x200Ah batteries, 3KVA inverter, MPPT, installation',
                    backup: '8-12 hours',
                    warranty: '5 years system'
                },
                tags: ['system', 'home', 'best-seller', '3kva']
            },
            {
                id: 'solar-system-002',
                name: 'Business Solar System 10KVA',
                category: 'systems',
                price: 2250000,
                basePrice: 2250000,
                image: '/img/solar/business-system-10kva.jpg',
                description: '10KVA commercial solar system for offices, shops, and small businesses.',
                stock: 'Made to Order',
                capacities: {
                    'Basic (10KVA)': 2250000,
                    'Standard (15KVA)': 3250000,
                    'Premium (20KVA)': 4250000
                },
                specs: {
                    includes: '20x330W panels, 8x200Ah batteries, 10KVA hybrid inverter, professional installation',
                    backup: 'Full business day',
                    warranty: '5 years system'
                },
                tags: ['system', 'business', 'commercial', '10kva']
            },

            // =========== SOLAR LIGHTS (High Volume) ===========
            {
                id: 'solar-light-001',
                name: 'Solar Street Light 60W',
                category: 'lights',
                price: 45000,
                basePrice: 45000,
                image: '/img/solar/street-light-60w.jpg',
                description: '60W solar street light with motion sensor and 12-hour operation.',
                stock: 'In Stock',
                capacities: {
                    '60W (Single)': 45000,
                    'Pack of 4': 175000,
                    'Pack of 10': 425000
                },
                specs: {
                    type: 'LED Solar Street Light',
                    power: '60W LED',
                    battery: 'Lithium 12.8V 40Ah',
                    operation: '12-14 hours'
                },
                tags: ['light', 'street', 'solar', '60w']
            },
            {
                id: 'solar-light-002',
                name: 'Solar Flood Light 100W',
                category: 'lights',
                price: 35000,
                basePrice: 35000,
                image: '/img/solar/flood-light-100w.jpg',
                description: '100W solar flood light for security and area illumination.',
                stock: 'In Stock',
                capacities: {
                    '100W (Single)': 35000,
                    'Pack of 4': 135000,
                    'Pack of 10': 325000
                },
                specs: {
                    type: 'Solar Flood Light',
                    power: '100W LED',
                    battery: 'Lithium 12.8V 30Ah',
                    coverage: 'Large area'
                },
                tags: ['light', 'flood', 'security', '100w']
            },

            // =========== ACCESSORIES ===========
            {
                id: 'solar-accessory-001',
                name: 'Solar DC Cable Set',
                category: 'accessories',
                price: 15000,
                basePrice: 15000,
                image: '/img/solar/dc-cables.jpg',
                description: 'Complete set of UV-resistant solar DC cables with connectors.',
                stock: 'In Stock',
                capacities: {
                    'Basic Set': 15000,
                    'Standard Set': 25000,
                    'Professional Set': 45000
                },
                specs: {
                    cable: 'PV1-F 6mm²',
                    length: '20 meters total',
                    connectors: 'MC4 included',
                    color: 'Red/Black'
                },
                tags: ['cables', 'accessory', 'installation']
            },
            {
                id: 'solar-accessory-002',
                name: 'Solar Mounting Structure',
                category: 'accessories',
                price: 35000,
                basePrice: 35000,
                image: '/img/solar/mounting-structure.jpg',
                description: 'Galvanized steel mounting structure for 6 solar panels.',
                stock: 'In Stock',
                capacities: {
                    'For 6 panels': 35000,
                    'For 12 panels': 65000,
                    'For 24 panels': 125000
                },
                specs: {
                    material: 'Hot-dip galvanized steel',
                    capacity: '6 panels',
                    type: 'Roof ground adjustable',
                    warranty: '10 years'
                },
                tags: ['mounting', 'structure', 'installation']
            }
        ];

        // CART FUNCTIONS (Same as construction page)
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

        function addToCart(product, selectedCapacity = null) {
            console.log('Adding to cart:', product, 'Capacity:', selectedCapacity);
            
            if (!product || !product.id || !product.name) {
                console.error('Invalid product data:', product);
                return false;
            }
            
            const cart = getCart();
            const productKey = selectedCapacity ? `${product.id}-${selectedCapacity}` : product.id;
            const productName = selectedCapacity ? `${product.name} (${selectedCapacity})` : product.name;
            const productPrice = selectedCapacity && product.capacities && product.capacities[selectedCapacity] 
                ? product.capacities[selectedCapacity] 
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
                    capacity: selectedCapacity
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
            console.log('CIL Solar page loaded');
            
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
            let filteredProducts = [...solarProducts];
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
                    const selectedCapacity = addToCartBtn.getAttribute('data-capacity');
                    const product = solarProducts.find(p => p.id === productId);
                    
                    if (product) {
                        console.log('Add to cart clicked for:', product.name, 'Capacity:', selectedCapacity);
                        
                        // Add to cart
                        addToCart(product, selectedCapacity);
                        
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
                
                filteredProducts = solarProducts.filter(product => {
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
                const hasCapacities = product.capacities && Object.keys(product.capacities).length > 0;
                const primaryTag = product.tags ? product.tags[0] : '';
                const tagClass = getTagClass(primaryTag);
                
                // Determine default capacity and price
                let defaultCapacity = null;
                let defaultPrice = product.price;
                if (hasCapacities) {
                    const capacities = Object.keys(product.capacities);
                    defaultCapacity = capacities[0]; // First option
                    defaultPrice = product.capacities[defaultCapacity];
                }
                
                card.innerHTML = `
                    <div class="product-category-badge">${categoryName}</div>
                    ${primaryTag ? `<span class="solar-tag ${tagClass}">${primaryTag.toUpperCase()}</span>` : ''}
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
                        
                        ${hasCapacities ? `
                            <div class="capacity-options" id="capacity-options-${product.id}">
                                ${Object.keys(product.capacities).map((capacity, index) => `
                                    <button class="capacity-option ${index === 0 ? 'selected' : ''}" 
                                            data-product="${product.id}"
                                            data-capacity="${capacity}"
                                            data-price="${product.capacities[capacity]}">
                                        ${capacity}
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
                                    ${hasCapacities ? `data-capacity="${defaultCapacity}"` : ''}>
                                 Add to Cart
                            </button>
                            <a href="https://wa.me/2348129978419?text=I'm interested in CIL Solar: ${encodeURIComponent(product.name)} - ₦${defaultPrice.toLocaleString()}${hasCapacities ? ` (${defaultCapacity})` : ''}" 
                               class="btn-whatsapp" target="_blank">
                                 WhatsApp
                            </a>
                        </div>
                    </div>
                `;
                
                // Add capacity selection functionality
                if (hasCapacities) {
                    setTimeout(() => {
                        const capacityOptions = card.querySelectorAll(`#capacity-options-${product.id} .capacity-option`);
                        const priceDisplay = card.querySelector(`#price-display-${product.id}`);
                        const addToCartBtn = card.querySelector('.add-to-cart');
                        
                        capacityOptions.forEach(option => {
                            option.addEventListener('click', function() {
                                // Remove selected class from all options
                                capacityOptions.forEach(opt => opt.classList.remove('selected'));
                                
                                // Add selected class to clicked option
                                this.classList.add('selected');
                                
                                // Update price display
                                const newPrice = this.getAttribute('data-price');
                                priceDisplay.textContent = `₦${parseFloat(newPrice).toLocaleString()}`;
                                
                                // Update add to cart button
                                const selectedCapacity = this.getAttribute('data-capacity');
                                addToCartBtn.setAttribute('data-capacity', selectedCapacity);
                                addToCartBtn.setAttribute('data-price', newPrice);
                                
                                // Update WhatsApp link
                                const whatsappBtn = card.querySelector('.btn-whatsapp');
                                const newWhatsappLink = `https://wa.me/2348129978419?text=I'm interested in CIL Solar: ${encodeURIComponent(product.name)} - ₦${parseFloat(newPrice).toLocaleString()} (${selectedCapacity})`;
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
                    'panels': 'Solar Panels',
                    'batteries': 'Batteries',
                    'inverters': 'Inverters',
                    'controllers': 'Controllers',
                    'systems': 'Complete Systems',
                    'accessories': 'Accessories',
                    'lights': 'Solar Lights'
                };
                return categories[category] || category;
            }
            
            // Get tag class
            function getTagClass(tag) {
                const tagClasses = {
                    'mono': 'tag-mono',
                    'poly': 'tag-poly',
                    'lithium': 'tag-lithium',
                    'gel': 'tag-gel',
                    'agm': 'tag-agm',
                    'pure-sine': 'tag-pure-sine',
                    'hybrid': 'tag-hybrid',
                    'mppt': 'tag-mppt',
                    'pwm': 'tag-pwm',
                    'best-seller': 'tag-pure-sine',
                    'commercial': 'tag-hybrid',
                    'budget': 'tag-pwm'
                };
                return tagClasses[tag] || 'tag-mono';
            }
            
            // Update product count display
            function updateProductCount() {
                if (!productCount) return;
                
                const totalProducts = filteredProducts.length;
                const showingProducts = Math.min(currentPage * productsPerPage, totalProducts);
                
                if (totalProducts === 0) {
                    productCount.textContent = 'No solar products found matching your criteria';
                } else {
                    productCount.textContent = `Showing ${showingProducts} of ${totalProducts} solar products`;
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
            
            // Setup cart drawer (same as construction)
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
                                <a href="/shop-solar" class="btn btn-primary">Browse Solar Products</a>
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
