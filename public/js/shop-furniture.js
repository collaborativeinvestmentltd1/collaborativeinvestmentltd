// Enhanced Furniture Products Data Management
class FurnitureStore {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Executive Leather Office Chair",
                category: "chairs",
                material: "leather",
                price: 75000,
                originalPrice: 89000,
                description: "Premium executive office chair with high-quality leather upholstery and ergonomic design for maximum comfort during long work hours.",
                specs: ["Genuine Leather", "Adjustable Height", "Lumbar Support", "Swivel Base", "360° Rotation"],
                image: "🪑",
                featured: true,
                inStock: true,
                deliveryTime: "3-5 days",
                warranty: "2 years"
            },
            {
                id: 2,
                name: "Fabric Lounge Sofa Set",
                category: "sofas",
                material: "fabric",
                price: 185000,
                originalPrice: 220000,
                description: "3-seater sofa set with premium fabric upholstery, perfect for modern living rooms and reception areas.",
                specs: ["3-Piece Set", "Durable Fabric", "Solid Wood Frame", "Comfort Cushions", "Easy Maintenance"],
                image: "🛋️",
                featured: true,
                inStock: true,
                deliveryTime: "5-7 days",
                warranty: "3 years"
            },
            {
                id: 3,
                name: "Solid Wood Dining Table",
                category: "tables",
                material: "wood",
                price: 95000,
                originalPrice: 115000,
                description: "Elegant solid wood dining table that comfortably seats 6 people, perfect for family gatherings and dinner parties.",
                specs: ["Solid Wood", "Seats 6", "Natural Finish", "Sturdy Construction", "Scratch Resistant"],
                image: "🪵",
                featured: false,
                inStock: true,
                deliveryTime: "4-6 days",
                warranty: "2 years"
            },
            {
                id: 4,
                name: "Industrial Metal Bar Stools",
                category: "chairs",
                material: "metal",
                price: 35000,
                description: "Set of 2 industrial-style bar stools with sturdy metal frames and comfortable padded seats.",
                specs: ["Set of 2", "Metal Frame", "Adjustable Height", "Modern Design", "Non-slip Base"],
                image: "🪑",
                featured: false,
                inStock: true,
                deliveryTime: "2-4 days",
                warranty: "1 year"
            },
            {
                id: 5,
                name: "Premium Living Room Set",
                category: "sets",
                material: "fabric",
                price: 320000,
                originalPrice: 380000,
                description: "Complete 5-piece luxury living room set including sofa, loveseat, armchairs, and coffee table.",
                specs: ["5-Piece Set", "Premium Fabric", "Coffee Table", "Matching Design", "Professional Assembly"],
                image: "🏠",
                featured: true,
                inStock: true,
                deliveryTime: "7-10 days",
                warranty: "5 years"
            },
            {
                id: 6,
                name: "Leather Recliner Chair",
                category: "chairs",
                material: "leather",
                price: 120000,
                originalPrice: 145000,
                description: "Luxurious recliner chair with premium leather and multiple reclining positions for ultimate relaxation.",
                specs: ["Full Recline", "Premium Leather", "Footrest", "Side Pockets", "Smooth Mechanism"],
                image: "🪑",
                featured: true,
                inStock: false,
                deliveryTime: "10-14 days",
                warranty: "3 years"
            },
            {
                id: 7,
                name: "Modern Coffee Table",
                category: "tables",
                material: "wood",
                price: 45000,
                description: "Contemporary wooden coffee table with built-in storage shelf and smooth protective finish.",
                specs: ["Storage Shelf", "Solid Wood", "Smooth Finish", "Modern Design", "Easy Assembly"],
                image: "🪵",
                featured: false,
                inStock: true,
                deliveryTime: "3-5 days",
                warranty: "2 years"
            },
            {
                id: 8,
                name: "Designer Accent Chairs",
                category: "chairs",
                material: "fabric",
                price: 55000,
                description: "Set of 2 stylish accent chairs with premium patterned fabric and elegant wooden legs.",
                specs: ["Set of 2", "Patterned Fabric", "Wooden Legs", "Comfortable", "Versatile Design"],
                image: "🪑",
                featured: false,
                inStock: true,
                deliveryTime: "4-6 days",
                warranty: "2 years"
            },
            {
                id: 9,
                name: "L-Shaped Leather Sectional",
                category: "sofas",
                material: "leather",
                price: 280000,
                originalPrice: 335000,
                description: "Spacious L-shaped sectional sofa with genuine leather and multiple modular seating positions.",
                specs: ["L-Shape", "Genuine Leather", "Chaise Lounge", "Modern Design", "Modular"],
                image: "🛋️",
                featured: true,
                inStock: true,
                deliveryTime: "10-12 days",
                warranty: "4 years"
            },
            {
                id: 10,
                name: "Wooden Dining Chair Set",
                category: "chairs",
                material: "wood",
                price: 85000,
                description: "Set of 4 elegant wooden dining chairs with comfortable padded seats and ergonomic design.",
                specs: ["Set of 4", "Wooden Frame", "Padded Seats", "Matching Design", "Stackable"],
                image: "🪑",
                featured: false,
                inStock: true,
                deliveryTime: "3-5 days",
                warranty: "2 years"
            },
            {
                id: 11,
                name: "Executive Office Desk",
                category: "tables",
                material: "wood",
                price: 65000,
                description: "Professional office desk with multiple drawers, cable management system, and spacious work surface.",
                specs: ["Multiple Drawers", "Cable Management", "Spacious", "Durable", "Lockable"],
                image: "🪵",
                featured: false,
                inStock: true,
                deliveryTime: "5-7 days",
                warranty: "3 years"
            },
            {
                id: 12,
                name: "Complete Bedroom Suite",
                category: "sets",
                material: "wood",
                price: 195000,
                originalPrice: 235000,
                description: "Complete bedroom suite including queen bed frame, matching nightstands, and 6-drawer dresser.",
                specs: ["Queen Bed Frame", "Nightstands", "6-Drawer Dresser", "Matching Design", "Under-bed Storage"],
                image: "🛏️",
                featured: true,
                inStock: true,
                deliveryTime: "7-9 days",
                warranty: "5 years"
            }
        ];

        this.filters = {
            category: 'all',
            material: 'all',
            price: 'all',
            sort: 'featured',
            search: ''
        };

        this.pagination = {
            currentPage: 1,
            itemsPerPage: 8,
            totalPages: 1
        };

        this.initialize();
    }

    initialize() {
        this.cacheDomElements();
        this.setupEventListeners();
        this.renderProducts();
        this.updateProductCount();
    }

    cacheDomElements() {
        this.elements = {
            furnitureContainer: document.getElementById('furniture-container'),
            loadMoreBtn: document.getElementById('load-more'),
            categoryFilter: document.getElementById('category-filter'),
            materialFilter: document.getElementById('material-filter'),
            priceFilter: document.getElementById('price-filter'),
            sortFilter: document.getElementById('sort-filter'),
            searchInput: document.getElementById('search-input'),
            productCount: document.getElementById('product-count'),
            filterReset: document.getElementById('filter-reset'),
            featuredToggle: document.getElementById('featured-toggle')
        };
    }

    setupEventListeners() {
        this.elements.categoryFilter.addEventListener('change', () => this.handleFilterChange());
        this.elements.materialFilter.addEventListener('change', () => this.handleFilterChange());
        this.elements.priceFilter.addEventListener('change', () => this.handleFilterChange());
        this.elements.sortFilter.addEventListener('change', () => this.handleFilterChange());
        this.elements.searchInput.addEventListener('input', () => this.handleSearch());
        this.elements.loadMoreBtn.addEventListener('click', () => this.loadMoreProducts());
        this.elements.filterReset.addEventListener('click', () => this.resetFilters());
        this.elements.featuredToggle.addEventListener('change', () => this.handleFilterChange());

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    handleFilterChange() {
        this.filters.category = this.elements.categoryFilter.value;
        this.filters.material = this.elements.materialFilter.value;
        this.filters.price = this.elements.priceFilter.value;
        this.filters.sort = this.elements.sortFilter.value;
        
        this.pagination.currentPage = 1;
        this.renderProducts();
        this.updateProductCount();
    }

    handleSearch() {
        this.filters.search = this.elements.searchInput.value.toLowerCase();
        this.pagination.currentPage = 1;
        this.renderProducts();
        this.updateProductCount();
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            this.elements.searchInput.focus();
        }
    }

    filterProducts() {
        let filtered = [...this.products];

        // Apply search filter
        if (this.filters.search) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.filters.search) ||
                product.description.toLowerCase().includes(this.filters.search) ||
                product.category.toLowerCase().includes(this.filters.search)
            );
        }

        // Apply category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(product => product.category === this.filters.category);
        }

        // Apply material filter
        if (this.filters.material !== 'all') {
            filtered = filtered.filter(product => product.material === this.filters.material);
        }

        // Apply price filter
        if (this.filters.price !== 'all') {
            filtered = filtered.filter(product => {
                switch(this.filters.price) {
                    case 'budget': return product.price < 50000;
                    case 'mid': return product.price >= 50000 && product.price <= 150000;
                    case 'premium': return product.price > 150000;
                    default: return true;
                }
            });
        }

        // Apply featured filter if enabled
        if (this.elements.featuredToggle.checked) {
            filtered = filtered.filter(product => product.featured);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch(this.filters.sort) {
                case 'price-low': return a.price - b.price;
                case 'price-high': return b.price - a.price;
                case 'name': return a.name.localeCompare(b.name);
                case 'newest': return b.id - a.id;
                case 'featured':
                default: 
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.id - a.id;
            }
        });

        return filtered;
    }

    renderProducts() {
        const filteredProducts = this.filterProducts();
        const startIndex = 0;
        const endIndex = this.pagination.currentPage * this.pagination.itemsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        this.elements.furnitureContainer.innerHTML = '';

        if (productsToShow.length === 0) {
            this.showNoProductsMessage();
            return;
        }

        productsToShow.forEach(product => {
            const productElement = this.createProductElement(product);
            this.elements.furnitureContainer.appendChild(productElement);
        });

        this.updateLoadMoreButton(filteredProducts.length, endIndex);
    }

    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = `furniture-card ${product.featured ? 'featured' : ''} ${!product.inStock ? 'out-of-stock' : ''}`;
        
        const discountBadge = product.originalPrice ? 
            `<div class="discount-badge">Save ₦${(product.originalPrice - product.price).toLocaleString()}</div>` : '';
        
        const stockBadge = !product.inStock ? 
            `<div class="stock-badge out-of-stock-badge">Pre-order</div>` : 
            `<div class="stock-badge in-stock-badge">In Stock</div>`;

        const featuredBadge = product.featured ? 
            `<div class="featured-badge">Featured</div>` : '';

        const originalPrice = product.originalPrice ? 
            `<div class="original-price">₦${product.originalPrice.toLocaleString()}</div>` : '';

        productDiv.innerHTML = `
            <div class="furniture-card-header">
                ${featuredBadge}
                ${discountBadge}
                ${stockBadge}
                <div class="furniture-image">
                    ${product.image}
                </div>
            </div>
            <div class="furniture-details">
                <div class="furniture-meta">
                    <span class="furniture-category">${this.formatCategory(product.category)}</span>
                    <span class="furniture-material">${this.formatMaterial(product.material)}</span>
                </div>
                <h3 class="furniture-title">${product.name}</h3>
                <p class="furniture-description">${product.description}</p>
                
                <div class="furniture-specs">
                    ${product.specs.map(spec => `
                        <div class="spec-item">
                            <span class="spec-icon">✓</span>
                            <span class="spec-text">${spec}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="furniture-features">
                    <div class="feature-item">
                        <span class="feature-icon">⏱️</span>
                        <span class="feature-text">${product.deliveryTime}</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🛡️</span>
                        <span class="feature-text">${product.warranty}</span>
                    </div>
                </div>

                <div class="furniture-pricing">
                    ${originalPrice}
                    <div class="current-price">₦${product.price.toLocaleString()}</div>
                </div>

                <div class="furniture-actions">
                    <a href="https://wa.me/2348129978419?text=${this.generateWhatsAppMessage(product)}" 
                       class="btn-primary" target="_blank" ${!product.inStock ? 'style="opacity: 0.7;"' : ''}>
                        ${product.inStock ? '🛒 Inquire Now' : '📅 Pre-order'}
                    </a>
                    <button class="btn-secondary wishlist-btn" data-product-id="${product.id}">
                        ❤️ Save
                    </button>
                </div>
            </div>
        `;

        // Add wishlist functionality
        const wishlistBtn = productDiv.querySelector('.wishlist-btn');
        wishlistBtn.addEventListener('click', () => this.toggleWishlist(product.id));

        return productDiv;
    }

    generateWhatsAppMessage(product) {
        const message = `Hello! I'm interested in your ${product.name} priced at ₦${product.price.toLocaleString()}. Could you provide more details?`;
        return encodeURIComponent(message);
    }

    showNoProductsMessage() {
        this.elements.furnitureContainer.innerHTML = `
            <div class="no-products-message">
                <div class="no-products-icon">🔍</div>
                <h3>No Furniture Found</h3>
                <p>We couldn't find any products matching your current filters.</p>
                <div class="no-products-actions">
                    <button class="btn-primary" onclick="furnitureStore.resetFilters()">
                        Reset Filters
                    </button>
                    <a href="/contact" class="btn-secondary">
                        Request Custom Design
                    </a>
                </div>
            </div>
        `;
        this.elements.loadMoreBtn.style.display = 'none';
    }

    updateLoadMoreButton(totalProducts, endIndex) {
        this.elements.loadMoreBtn.style.display = endIndex < totalProducts ? 'flex' : 'none';
        this.elements.loadMoreBtn.innerHTML = endIndex < totalProducts ? 
            `Load More (${totalProducts - endIndex} remaining)` : 
            'All Products Loaded';
    }

    updateProductCount() {
        const filteredProducts = this.filterProducts();
        const total = filteredProducts.length;
        const showing = Math.min(this.pagination.currentPage * this.pagination.itemsPerPage, total);
        
        this.elements.productCount.textContent = `Showing ${showing} of ${total} products`;
    }

    loadMoreProducts() {
        this.pagination.currentPage++;
        this.renderProducts();
        this.updateProductCount();
        
        // Smooth scroll to new products
        setTimeout(() => {
            this.elements.loadMoreBtn.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }

    resetFilters() {
        this.elements.categoryFilter.value = 'all';
        this.elements.materialFilter.value = 'all';
        this.elements.priceFilter.value = 'all';
        this.elements.sortFilter.value = 'featured';
        this.elements.searchInput.value = '';
        this.elements.featuredToggle.checked = false;
        
        this.filters = {
            category: 'all',
            material: 'all',
            price: 'all',
            sort: 'featured',
            search: ''
        };
        
        this.pagination.currentPage = 1;
        this.renderProducts();
        this.updateProductCount();
    }

    toggleWishlist(productId) {
        // Implement wishlist functionality
        const wishlist = JSON.parse(localStorage.getItem('furnitureWishlist') || '[]');
        const index = wishlist.indexOf(productId);
        
        if (index > -1) {
            wishlist.splice(index, 1);
            this.showNotification('Product removed from wishlist', 'info');
        } else {
            wishlist.push(productId);
            this.showNotification('Product added to wishlist', 'success');
        }
        
        localStorage.setItem('furnitureWishlist', JSON.stringify(wishlist));
        this.updateWishlistButtons();
    }

    updateWishlistButtons() {
        const wishlist = JSON.parse(localStorage.getItem('furnitureWishlist') || '[]');
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            if (wishlist.includes(productId)) {
                btn.innerHTML = '❤️ Saved';
                btn.classList.add('in-wishlist');
            } else {
                btn.innerHTML = '❤️ Save';
                btn.classList.remove('in-wishlist');
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
    }

    formatCategory(category) {
        const categories = {
            'chairs': 'Chairs & Seating',
            'sofas': 'Sofas & Couches',
            'tables': 'Tables & Desks',
            'sets': 'Complete Sets'
        };
        return categories[category] || category;
    }

    formatMaterial(material) {
        const materials = {
            'leather': 'Genuine Leather',
            'fabric': 'Premium Fabric',
            'wood': 'Solid Wood',
            'metal': 'Metal Frame'
        };
        return materials[material] || material;
    }

    // Public method to get featured products
    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    // Public method to search products
    searchProducts(query) {
        this.filters.search = query.toLowerCase();
        this.pagination.currentPage = 1;
        this.renderProducts();
        this.updateProductCount();
    }
}

// Initialize the furniture store when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Furniture store initializing...');
    
    // Check if we're on a furniture page
    const furnitureElements = document.querySelector('.furniture-products, [data-page="furniture"]');
    if (!furnitureElements) {
        console.log('Not on furniture page, skipping initialization');
        return;
    }

    window.furnitureStore = new FurnitureStore();
});

// Utility function for price formatting (can be used elsewhere)
function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(price);
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FurnitureStore, formatPrice };
}