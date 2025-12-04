// shop-all.js - Complete Products Aggregation and Filtering
console.log('shop-all.js loaded');

// Wait for cart.js to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checking for cart functions...');
    console.log('addToCart available:', typeof window.addToCart);
    console.log('showCartNotification available:', typeof window.showCartNotification);

    // Products data structure - aggregated from all categories
    const allProducts = [
        // AGRICULTURE PRODUCTS
        {
            id: 'agri-001',
            name: 'Crate of Eggs (30 pieces)',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 2400,
            image: '/img/agriculture/crate-of-eggs.jpg',
            description: 'Fresh farm eggs from our free-range layers. Rich in nutrients.',
            stock: 'In Stock',
            minOrder: '1 Crate',
            tags: ['poultry', 'eggs', 'fresh']
        },
        {
            id: 'agri-002',
            name: 'Day Old Broiler Chicks',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 450,
            image: '/img/agriculture/day-old-broilers.jpg',
            description: 'High-quality broiler chicks with fast growth rate.',
            stock: 'In Stock',
            minOrder: '50 chicks',
            tags: ['poultry', 'chicks', 'broiler']
        },
        {
            id: 'agri-003',
            name: 'Day Old Layer Chicks',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 500,
            image: '/img/agriculture/day-old-layers.jpg',
            description: 'Premium layer breeds for high egg production.',
            stock: 'In Stock',
            minOrder: '50 chicks',
            tags: ['poultry', 'chicks', 'layer']
        },
        {
            id: 'agri-004',
            name: 'Point of Lay Layers (18 weeks)',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 2500,
            image: '/img/agriculture/point-of-lay-layers.jpg',
            description: 'Ready-to-lay pullets. Start producing eggs immediately.',
            stock: 'Limited Stock',
            minOrder: '10 birds',
            tags: ['poultry', 'layers', 'ready-to-lay']
        },
        {
            id: 'agri-005',
            name: 'Adult Broiler Chickens (6-8 weeks)',
            category: 'agriculture',
            subcategory: 'poultry',
            price: 4500,
            image: '/img/agriculture/adult-broilers.jpg',
            description: 'Market-ready broiler chickens. Average weight 2-2.5kg.',
            stock: 'In Stock',
            minOrder: '10 birds',
            tags: ['poultry', 'broiler', 'market-ready']
        },
        {
            id: 'agri-006',
            name: 'Baby Pigs (Weaners - 8 weeks)',
            category: 'agriculture',
            subcategory: 'livestock',
            price: 18000,
            image: '/img/agriculture/baby-pigs.jpg',
            description: 'Healthy weaner pigs ready for growing.',
            stock: 'In Stock',
            minOrder: '5 pigs',
            tags: ['livestock', 'pigs', 'weaners']
        },
        {
            id: 'agri-007',
            name: 'Adult Pigs (6 months)',
            category: 'agriculture',
            subcategory: 'livestock',
            price: 120000,
            image: '/img/agriculture/adult-pigs.jpg',
            description: 'Market-ready pigs for meat production or breeding.',
            stock: 'In Stock',
            minOrder: '2 pigs',
            tags: ['livestock', 'pigs', 'adult']
        },
        {
            id: 'agri-008',
            name: 'Catfish Juveniles (Fingerlings)',
            category: 'agriculture',
            subcategory: 'fish',
            price: 25,
            image: '/img/agriculture/catfish-juveniles.jpg',
            description: 'Healthy catfish fingerlings for pond stocking.',
            stock: 'In Stock',
            minOrder: '100 pieces',
            tags: ['fish', 'catfish', 'fingerlings']
        },
        {
            id: 'agri-009',
            name: 'Live Adult Catfish (1kg+)',
            category: 'agriculture',
            subcategory: 'fish',
            price: 1200,
            image: '/img/agriculture/live-adult-catfish.jpg',
            description: 'Fresh live catfish ready for consumption.',
            stock: 'In Stock',
            minOrder: '5kg',
            tags: ['fish', 'catfish', 'live']
        },
        {
            id: 'agri-010',
            name: 'Roasted/Smoked Catfish',
            category: 'agriculture',
            subcategory: 'fish',
            price: 1800,
            image: '/img/agriculture/roasted-catfish.jpg',
            description: 'Premium smoked catfish for soups and delicacies.',
            stock: 'In Stock',
            minOrder: '2kg',
            tags: ['fish', 'catfish', 'smoked']
        },
        {
            id: 'agri-011',
            name: 'Chicken Feed (25kg bag)',
            category: 'agriculture',
            subcategory: 'feeds',
            price: 9500,
            image: '/img/agriculture/chicken-feed.jpg',
            description: 'Complete balanced feed for layers and broilers.',
            stock: 'In Stock',
            minOrder: '1 bag',
            tags: ['feeds', 'chicken', 'poultry']
        },
        {
            id: 'agri-012',
            name: 'Catfish Feed (15kg bag)',
            category: 'agriculture',
            subcategory: 'feeds',
            price: 7200,
            image: '/img/agriculture/catfish-feed.jpg',
            description: 'Floating fish feed with 35-45% protein content.',
            stock: 'In Stock',
            minOrder: '1 bag',
            tags: ['feeds', 'catfish', 'fish']
        },
        {
            id: 'agri-013',
            name: 'Pig Feed (25kg bag)',
            category: 'agriculture',
            subcategory: 'feeds',
            price: 8500,
            image: '/img/agriculture/pig-feed.jpg',
            description: 'Complete swine feed for different growth stages.',
            stock: 'In Stock',
            minOrder: '1 bag',
            tags: ['feeds', 'pig', 'livestock']
        },
        {
            id: 'agri-014',
            name: 'Automatic Poultry Drinker',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 1800,
            image: '/img/agriculture/poultry-drinker.jpg',
            description: '4-liter capacity automatic drinker.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['supplies', 'poultry', 'drinker']
        },
        {
            id: 'agri-015',
            name: 'Automatic Poultry Feeder',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 2200,
            image: '/img/agriculture/poultry-feeder.jpg',
            description: '5kg capacity automatic feeder.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['supplies', 'poultry', 'feeder']
        },
        {
            id: 'agri-016',
            name: 'Digital Egg Incubator (96 eggs)',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 85000,
            image: '/img/agriculture/incubator.jpg',
            description: 'Automatic digital incubator with temperature control.',
            stock: 'Limited Stock',
            minOrder: '1 unit',
            tags: ['supplies', 'incubator', 'poultry']
        },
        {
            id: 'agri-017',
            name: 'Fishing Net (Various Sizes)',
            category: 'agriculture',
            subcategory: 'supplies',
            price: 4500,
            image: '/img/agriculture/fish-net.jpg',
            description: 'Durable fishing nets for pond harvesting.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['supplies', 'fishing', 'net']
        },

        // CONSTRUCTION PRODUCTS
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
            tags: ['custom', 'hanger', 'boutique']
        },

        // MACHINERY PRODUCTS
        {
            id: 'mach-001',
            name: 'Automatic 2-Block Maker (Imported)',
            category: 'machinery',
            subcategory: 'block-makers',
            price: 1025000,
            image: '/img/machinery/imported-2-block-maker.jpg',
            description: 'High-efficiency imported automatic machine producing 2 blocks per cycle.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['block-maker', 'automatic', 'imported']
        },
        {
            id: 'mach-002',
            name: 'Automatic 2-Block Maker (Local)',
            category: 'machinery',
            subcategory: 'block-makers',
            price: 800000,
            image: '/img/machinery/local-2-block-maker.jpg',
            description: 'Reliable locally manufactured automatic machine.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['block-maker', 'automatic', 'local']
        },
        {
            id: 'mach-003',
            name: 'Manual 2-Block Maker',
            category: 'machinery',
            subcategory: 'block-makers',
            price: 150000,
            image: '/img/machinery/manual-2-block-maker.jpg',
            description: 'Affordable manual machine perfect for startups.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['block-maker', 'manual', 'starter']
        },
        {
            id: 'mach-004',
            name: 'Automatic 3-Block Maker (Imported)',
            category: 'machinery',
            subcategory: 'block-makers',
            price: 1500000,
            image: '/img/machinery/imported-3-block-maker.jpg',
            description: 'Advanced imported automatic machine with high production capacity.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['block-maker', 'automatic', 'imported']
        },
        {
            id: 'mach-005',
            name: 'Automatic 5-Block Maker (Imported)',
            category: 'machinery',
            subcategory: 'block-makers',
            price: 3150000,
            image: '/img/machinery/imported-5-block-maker.jpg',
            description: 'Industrial-grade imported machine with maximum production capacity.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['block-maker', 'automatic', 'industrial']
        },
        {
            id: 'mach-006',
            name: 'Large Industrial Mixer',
            category: 'machinery',
            subcategory: 'mixers',
            price: 975000,
            image: '/img/machinery/large-industrial-mixer.jpg',
            description: 'Heavy-duty mixer with large capacity for high-volume production.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['mixer', 'industrial', 'concrete']
        },
        {
            id: 'mach-007',
            name: 'Medium Industrial Mixer',
            category: 'machinery',
            subcategory: 'mixers',
            price: 575000,
            image: '/img/machinery/medium-industrial-mixer.jpg',
            description: 'Versatile mixer suitable for medium-scale block production.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['mixer', 'medium', 'versatile']
        },
        {
            id: 'mach-008',
            name: 'Small Industrial Mixer',
            category: 'machinery',
            subcategory: 'mixers',
            price: 275000,
            image: '/img/machinery/small-industrial-mixer.jpg',
            description: 'Compact mixer perfect for small-scale production.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['mixer', 'small', 'compact']
        },

        // SOLAR PRODUCTS
        {
            id: 'solar-001',
            name: 'Monocrystalline Solar Panels',
            category: 'solar',
            subcategory: 'panels',
            price: 51667,
            image: '/img/solar/monocrystalline-panel.jpg',
            description: 'High-efficiency monocrystalline panels with superior performance.',
            stock: 'In Stock',
            minOrder: '1 panel',
            tags: ['solar', 'panels', 'monocrystalline']
        },
        {
            id: 'solar-002',
            name: 'Polycrystalline Solar Panels',
            category: 'solar',
            subcategory: 'panels',
            price: 42667,
            image: '/img/solar/polycrystalline-panel.jpg',
            description: 'Cost-effective polycrystalline panels with good efficiency.',
            stock: 'In Stock',
            minOrder: '1 panel',
            tags: ['solar', 'panels', 'polycrystalline']
        },
        {
            id: 'solar-003',
            name: 'Lithium Solar Batteries',
            category: 'solar',
            subcategory: 'batteries',
            price: 170000,
            image: '/img/solar/lithium-battery.jpg',
            description: 'Advanced lithium batteries with long lifespan and high efficiency.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['solar', 'batteries', 'lithium']
        },
        {
            id: 'solar-004',
            name: 'Gel Solar Batteries',
            category: 'solar',
            subcategory: 'batteries',
            price: 65000,
            image: '/img/solar/gel-battery.jpg',
            description: 'Maintenance-free gel batteries with good deep cycle performance.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['solar', 'batteries', 'gel']
        },
        {
            id: 'solar-005',
            name: 'Pure Sine Wave Inverters',
            category: 'solar',
            subcategory: 'inverters',
            price: 93333,
            image: '/img/solar/pure-sine-inverter.jpg',
            description: 'Clean power output suitable for sensitive electronics.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['solar', 'inverters', 'pure-sine']
        },
        {
            id: 'solar-006',
            name: 'Hybrid Solar Inverters',
            category: 'solar',
            subcategory: 'inverters',
            price: 315000,
            image: '/img/solar/hybrid-inverter.jpg',
            description: 'Advanced inverters with solar charging and backup functionality.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['solar', 'inverters', 'hybrid']
        },
        {
            id: 'solar-007',
            name: 'MPPT Charge Controllers',
            category: 'solar',
            subcategory: 'controllers',
            price: 48333,
            image: '/img/solar/mppt-controller.jpg',
            description: 'Maximum Power Point Tracking controllers for maximum energy harvest.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['solar', 'controllers', 'mppt']
        },
        {
            id: 'solar-008',
            name: 'Home Solar System Package',
            category: 'solar',
            subcategory: 'systems',
            price: 650000,
            image: '/img/solar/home-solar-system.jpg',
            description: 'Complete solar power system for residential use.',
            stock: 'In Stock',
            minOrder: '1 system',
            tags: ['solar', 'systems', 'home']
        },
        {
            id: 'solar-009',
            name: 'Business Solar System Package',
            category: 'solar',
            subcategory: 'systems',
            price: 1850000,
            image: '/img/solar/business-solar-system.jpg',
            description: 'Commercial solar power system for offices and businesses.',
            stock: 'In Stock',
            minOrder: '1 system',
            tags: ['solar', 'systems', 'business']
        },

        // FURNITURE PRODUCTS
        {
            id: 'furn-001',
            name: 'Mahogany Executive Desk',
            category: 'furniture',
            subcategory: 'office',
            price: 450000,
            image: '/img/furniture/executive-desk.jpg',
            description: 'Solid mahogany executive desk with built-in cable management.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'office', 'desk', 'executive']
        },
        {
            id: 'furn-002',
            name: 'Modern Conference Table',
            category: 'furniture',
            subcategory: 'office',
            price: 680000,
            image: '/img/furniture/conference-table.jpg',
            description: 'Elegant 10-seater conference table with tempered glass top.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'office', 'conference', 'table']
        },
        {
            id: 'furn-003',
            name: 'Premium Ergonomic Chair',
            category: 'furniture',
            subcategory: 'office',
            price: 185000,
            image: '/img/furniture/ergonomic-office-chair.jpg',
            description: 'High-back executive chair with advanced lumbar support.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'office', 'chair', 'ergonomic']
        },
        {
            id: 'furn-004',
            name: 'Luxury Single Seater',
            category: 'furniture',
            subcategory: 'seating',
            price: 120000,
            image: '/img/furniture/single-seater.jpg',
            description: 'Premium single seater chair with high-density foam.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'seating', 'single', 'luxury']
        },
        {
            id: 'furn-005',
            name: 'Modern Two Seater Sofa',
            category: 'furniture',
            subcategory: 'seating',
            price: 280000,
            image: '/img/furniture/two-seater.jpg',
            description: 'Contemporary two-seater sofa with wooden legs.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'seating', 'sofa', 'two-seater']
        },
        {
            id: 'furn-006',
            name: 'Family Three Seater Sofa',
            category: 'furniture',
            subcategory: 'seating',
            price: 420000,
            image: '/img/furniture/three-seater.jpg',
            description: 'Spacious three-seater sofa with deep seating.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'seating', 'sofa', 'three-seater']
        },
        {
            id: 'furn-007',
            name: 'Premium Relaxing Armchair',
            category: 'furniture',
            subcategory: 'seating',
            price: 195000,
            image: '/img/furniture/relaxing-chair.jpg',
            description: 'Ultra-comfortable relaxing chair with reclining feature.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'seating', 'armchair', 'reclining']
        },
        {
            id: 'furn-008',
            name: '5-Piece Living Room Set',
            category: 'furniture',
            subcategory: 'living-room',
            price: 850000,
            image: '/img/furniture/living-room-full-set.jpg',
            description: 'Complete living room package with multiple pieces.',
            stock: 'In Stock',
            minOrder: '1 set',
            tags: ['furniture', 'living-room', 'set', 'complete']
        },
        {
            id: 'furn-009',
            name: 'Compact Dining Table',
            category: 'furniture',
            subcategory: 'dining',
            price: 180000,
            image: '/img/furniture/single-dining-table.jpg',
            description: 'Space-saving single dining table perfect for small spaces.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'dining', 'table', 'compact']
        },
        {
            id: 'furn-010',
            name: '8-Seater Dining Set',
            category: 'furniture',
            subcategory: 'dining',
            price: 620000,
            image: '/img/furniture/full-dining-set.jpg',
            description: 'Complete dining set with extendable table and 8 chairs.',
            stock: 'In Stock',
            minOrder: '1 set',
            tags: ['furniture', 'dining', 'set', 'extendable']
        },
        {
            id: 'furn-011',
            name: 'King Size Bedroom Suite',
            category: 'furniture',
            subcategory: 'bedroom',
            price: 950000,
            image: '/img/furniture/king-bed-set.jpg',
            description: 'Complete bedroom set including king bed and furniture.',
            stock: 'In Stock',
            minOrder: '1 set',
            tags: ['furniture', 'bedroom', 'suite', 'king-size']
        },
        {
            id: 'furn-012',
            name: '6-Door Sliding Wardrobe',
            category: 'furniture',
            subcategory: 'bedroom',
            price: 380000,
            image: '/img/furniture/wardrobe-collection.jpg',
            description: 'Spacious sliding door wardrobe with mirror panels.',
            stock: 'In Stock',
            minOrder: '1 unit',
            tags: ['furniture', 'bedroom', 'wardrobe', 'storage']
        },
        {
            id: 'furn-013',
            name: 'Hotel Reception Desk',
            category: 'furniture',
            subcategory: 'commercial',
            price: 1200000,
            image: '/img/furniture/hotel-reception-desk.jpg',
            description: 'Professional reception desk with built-in storage.',
            stock: 'Made to Order',
            minOrder: '1 unit',
            tags: ['furniture', 'commercial', 'hotel', 'reception']
        },
        {
            id: 'furn-014',
            name: 'Restaurant Dining Collection',
            category: 'furniture',
            subcategory: 'commercial',
            price: 2500000,
            image: '/img/furniture/restaurant-dining-set.jpg',
            description: 'Complete 20-seater restaurant set with durable tables.',
            stock: 'Made to Order',
            minOrder: '1 set',
            tags: ['furniture', 'commercial', 'restaurant', 'dining']
        },
        {
            id: 'furn-015',
            name: 'Teak Outdoor Dining Set',
            category: 'furniture',
            subcategory: 'outdoor',
            price: 750000,
            image: '/img/furniture/outdoor-dining-set.jpg',
            description: '6-seater teak wood dining set with weather-resistant cushions.',
            stock: 'In Stock',
            minOrder: '1 set',
            tags: ['furniture', 'outdoor', 'dining', 'teak']
        },
        {
            id: 'furn-016',
            name: 'Premium Patio Lounge Set',
            category: 'furniture',
            subcategory: 'outdoor',
            price: 1100000,
            image: '/img/furniture/patio-lounge-set.jpg',
            description: 'Complete patio lounge set with deep seating and coffee table.',
            stock: 'In Stock',
            minOrder: '1 set',
            tags: ['furniture', 'outdoor', 'patio', 'lounge']
        }
    ];

    // DOM Elements
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const loadMoreBtn = document.getElementById('load-more');
    const productCount = document.getElementById('product-count');

    // Pagination variables
    let currentPage = 1;
    const productsPerPage = 12;
    let filteredProducts = [...allProducts];
    let currentProducts = []; // Track currently displayed products

    // Initialize the shop
    function initShop() {
        currentPage = 1; // Reset to first page on initial load
        filterProducts();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', function() {
            currentPage = 1; // Reset to first page when searching
            filterProducts();
        });

        // Category filter
        categoryFilter.addEventListener('change', function() {
            currentPage = 1; // Reset to first page when filtering
            filterProducts();
        });

        // Load more button
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            displayProducts(); // Just display next page without re-filtering
        });
    }

    // Filter products based on search and category
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        filteredProducts = allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm) ||
                                product.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        currentPage = 1; // Reset to first page after filtering
        displayProducts();
    }

    // Display products in the grid
    function displayProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        
        // Clear container only if it's the first page
        if (currentPage === 1) {
            productsContainer.innerHTML = '';
        }
        
        // Add only the new products for this page
        const newProducts = filteredProducts.slice(startIndex, endIndex);
        
        newProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
        
        // Update current products
        currentProducts = filteredProducts.slice(0, endIndex);
        
        // Show/hide load more button
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
        
        // Update product count
        updateProductCount();
        
        // Add animation to newly loaded products
        animateNewProducts();
    }

    // FIXED: Create product card HTML with correct data attributes
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const formattedPrice = product.price.toLocaleString();
        
        // CORRECT data attributes format - use data-name, data-price, data-id, data-image
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='/img/logo.jpg'">
                <span class="stock-badge ${getStockClass(product.stock)}">${product.stock}</span>
            </div>
            <div class="product-content">
                <div class="product-category">${formatCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₦${formattedPrice}</div>
                <div class="product-meta">
                    <span>${product.minOrder}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" 
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image || '/img/logo.jpg'}">
                        Add to Cart
                    </button>
                    <a href="https://wa.me/2348129978419?text=I'm interested in ${encodeURIComponent(product.name)} - ₦${formattedPrice}" 
                       class="btn btn-whatsapp" target="_blank">
                        💬 WhatsApp
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    // Animate newly loaded products
    function animateNewProducts() {
        const allProductCards = productsContainer.querySelectorAll('.product-card');
        const newCards = Array.from(allProductCards).slice(-productsPerPage);
        
        newCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100); // Stagger the animations
        });
    }

    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            'agriculture': '🐔',
            'construction': '🏗️',
            'machinery': '⚙️',
            'solar': '☀️',
            'furniture': '🪑'
        };
        return icons[category] || '📦';
    }

    // Format category name for display
    function formatCategoryName(category) {
        const names = {
            'agriculture': 'Agriculture',
            'construction': 'Construction',
            'machinery': 'Machinery',
            'solar': 'Solar',
            'furniture': 'Furniture'
        };
        return names[category] || category;
    }

    // Get stock class for styling
    function getStockClass(stock) {
        if (stock === 'In Stock') return 'stock-in';
        if (stock === 'Limited Stock') return 'stock-low';
        if (stock === 'Made to Order') return 'stock-out';
        return 'stock-in';
    }

    // Update product count display
    function updateProductCount() {
        const totalProducts = filteredProducts.length;
        const showingProducts = Math.min(currentPage * productsPerPage, totalProducts);
        productCount.textContent = `Showing ${showingProducts} of ${totalProducts} products`;
        
        // Update load more button text
        if (showingProducts < totalProducts) {
            const remaining = totalProducts - showingProducts;
            loadMoreBtn.textContent = `Load More (${remaining} more products)`;
        } else {
            loadMoreBtn.textContent = 'All Products Loaded';
        }
    }

// Debug: log all add-to-cart clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.add-to-cart')) {
        console.log('DEBUG: Add to Cart clicked', new Date().getTime());
        console.trace(); // Show where the click came from
    }
});

// FIXED: Add to cart event handler with debouncing
let lastClickTime = 0;
const CLICK_DEBOUNCE_TIME = 500; // 500ms between clicks

function setupAddToCartListeners() {
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart');
        if (!addToCartBtn) return;
        
        // Debounce: prevent multiple rapid clicks
        const now = Date.now();
        if (now - lastClickTime < CLICK_DEBOUNCE_TIME) {
            console.log('Click debounced - too soon after previous click');
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }
        lastClickTime = now;
        
        // Stop any other listeners
        e.preventDefault();
        e.stopImmediatePropagation();
        
        // Get product data
        const product = {
            id: addToCartBtn.getAttribute('data-id'),
            name: addToCartBtn.getAttribute('data-name'),
            price: parseFloat(addToCartBtn.getAttribute('data-price')),
            image: addToCartBtn.getAttribute('data-image') || '/img/logo.jpg'
        };
        
        console.log('Add to Cart clicked - product:', product);
        
        // Validate
        if (!product.id || !product.name || !product.price || isNaN(product.price)) {
            console.error('Invalid product data:', product);
            alert('Error: Product information is incomplete.');
            return;
        }
        
        // Disable button temporarily to prevent double clicks
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = 'Adding...';
        addToCartBtn.disabled = true;
        
        // Use the centralized addToCart function
        setTimeout(() => {
            if (typeof window.addToCart === 'function') {
                window.addToCart(product);
            } else {
                // Fallback to localStorage
                try {
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existingIndex = cart.findIndex(item => item.id === product.id);
                    
                    if (existingIndex > -1) {
                        cart[existingIndex].quantity += 1;
                        console.log('Updated existing item quantity');
                    } else {
                        cart.push({
                            ...product,
                            quantity: 1
                        });
                        console.log('Added new item to cart');
                    }
                    
                    localStorage.setItem('cart', JSON.stringify(cart));
                    console.log('Cart saved, total items:', cart.length);
                    
                    // Update UI
                    if (typeof window.updateCartCount === 'function') window.updateCartCount();
                    if (typeof window.renderCartDrawer === 'function') window.renderCartDrawer();
                    
                    // Show notification
                    if (typeof window.showCartNotification === 'function') {
                        window.showCartNotification(product.name);
                    } else {
                        alert(`Added "${product.name}" to cart!`);
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Error adding to cart. Please try again.');
                }
            }
            
            // Re-enable button after a short delay
            setTimeout(() => {
                addToCartBtn.innerHTML = originalText;
                addToCartBtn.disabled = false;
            }, 1000);
        }, 100);
    }, true); // Use capture phase to handle event first
}

    // Initialize the shop when DOM is loaded
    initShop();
    
    // Setup add to cart listeners
    setupAddToCartListeners();
    
    console.log('shop-all.js initialization complete');
});