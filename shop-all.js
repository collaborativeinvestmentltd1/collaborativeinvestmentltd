// Utility functions
function getStockClass(stock) {
    if (stock === 'In Stock') return 'stock-in';
    if (stock === 'Made to Order') return 'stock-custom';
    if (stock === 'Limited Stock') return 'stock-limited';
    return 'stock-custom';
}

function getCategoryDisplayName(category) {
    const categories = {
        'agriculture': 'Agriculture',
        'construction': 'Construction',
        'furniture': 'Furniture',
        'machinery': 'Machinery',
        'solar': 'Solar',
        'poultry': 'Poultry',
        'livestock': 'Livestock',
        'fish': 'Fish & Aquaculture',
        'feeds': 'Animal Feeds',
        'supplies': 'Farming Supplies',
        'machines': 'Machinery',
        'courts': 'Sports Courts',
        'gates': 'Electric Gates',
        'office': 'Office Furniture',
        'living': 'Living Room',
        'dining': 'Dining Sets',
        'bedroom': 'Bedroom',
        'seating': 'Seating',
        'panels': 'Solar Panels',
        'batteries': 'Solar Batteries',
        'inverters': 'Solar Inverters',
        'controllers': 'Charge Controllers',
        'systems': 'Solar Systems',
        'lights': 'Solar Lights',
        'accessories': 'Solar Accessories',
        'blocks': 'Construction Blocks',
        'cement': 'Bulk Cement',
        'mixers': 'Industrial Mixers'
    };
    return categories[category] || category;
}

// Helper function to get main category from product
function getMainCategory(product) {
    const category = product.category;
    const mainCategoryMap = {
        'poultry': 'agriculture',
        'livestock': 'agriculture',
        'fish': 'agriculture',
        'feeds': 'agriculture',
        'supplies': 'agriculture',
        
        // Construction subcategories
        'machines': 'construction',
        'courts': 'construction',
        'gates': 'construction',
        
        // Furniture subcategories
        'office': 'furniture',
        'living': 'furniture',
        'dining': 'furniture',
        'bedroom': 'furniture',
        'seating': 'furniture',
        
        // Machinery subcategories
        'blocks': 'machinery',
        'cement': 'machinery',
        'mixers': 'machinery',
        
        // Solar subcategories
        'panels': 'solar',
        'batteries': 'solar',
        'inverters': 'solar',
        'controllers': 'solar',
        'systems': 'solar',
        'lights': 'solar',
        'accessories': 'solar'
    };
    
    return mainCategoryMap[category] || category;
}

// COMBINED PRODUCTS DATA FROM ALL CATEGORIES
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
            {
                id: 'furn-living-009',
                name: 'Wall Display Unit',
                category: 'living',
                price: 115000,
                basePrice: 115000,
                image: '/img/furniture/wall-display.jpg',
                description: 'Wall-mounted display unit with shelves and cabinets for living room decor.',
                stock: 'Made to Order',
                sizes: {
                    'Small (1m)': 85000,
                    'Medium (1.5m)': 115000,
                    'Large (2m)': 155000
                },
                specs: {
                    material: 'Wood & glass',
                    mounting: 'Wall-mounted',
                    style: 'Modern floating shelves'
                },
                tags: ['living', 'wall', 'display', 'shelves']
            },
            {
                id: 'furn-living-010',
                name: 'Fireplace TV Stand',
                category: 'living',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/fireplace-tv-stand.jpg',
                description: 'Entertainment center with built-in electric fireplace and TV mounting.',
                stock: 'Made to Order',
                sizes: {
                    'Standard': 185000,
                    'Large': 245000,
                    'Custom': 325000
                },
                specs: {
                    features: 'Electric fireplace, TV mount',
                    material: 'Wood & metal',
                    style: 'Modern entertainment center'
                },
                tags: ['living', 'fireplace', 'TV', 'entertainment']
            },
            {
                id: 'furn-living-011',
                name: 'Sofa Bed',
                category: 'living',
                price: 285000,
                basePrice: 285000,
                image: '/img/furniture/sofa-bed.jpg',
                description: 'Convertible sofa that transforms into comfortable bed for guests.',
                stock: 'In Stock',
                sizes: {
                    'Single': 225000,
                    'Double': 285000,
                    'Queen': 385000
                },
                specs: {
                    function: 'Sofa converts to bed',
                    mattress: 'Included comfortable mattress',
                    size: 'Various sizes available'
                },
                tags: ['living', 'sofa', 'bed', 'convertible']
            },
            {
                id: 'furn-living-012',
                name: 'Bar Cabinet',
                category: 'living',
                price: 125000,
                basePrice: 125000,
                image: '/img/furniture/bar-cabinet.jpg',
                description: 'Stylish bar cabinet with glass shelves, wine storage, and locking doors.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 115000,
                    'Deluxe': 165000,
                    'Premium': 225000
                },
                specs: {
                    material: 'Wood & glass',
                    storage: 'Wine racks, glass holders',
                    features: 'Locking doors, lighting'
                },
                tags: ['living', 'bar', 'cabinet', 'wine']
            },
            {
                id: 'furn-living-013',
                name: 'Display Cabinet',
                category: 'living',
                price: 145000,
                basePrice: 145000,
                image: '/img/furniture/display-cabinet.jpg',
                description: 'Glass display cabinet for showcasing collectibles, china, or books.',
                stock: 'In Stock',
                sizes: {
                    'Small': 95000,
                    'Medium': 145000,
                    'Large': 195000
                },
                specs: {
                    material: 'Wood & tempered glass',
                    lighting: 'Optional LED lights',
                    security: 'Locking glass doors'
                },
                tags: ['living', 'display', 'cabinet', 'glass']
            },
            {
                id: 'furn-living-014',
                name: 'Room Divider',
                category: 'living',
                price: 85000,
                basePrice: 85000,
                image: '/img/furniture/room-divider.jpg',
                description: 'Decorative room divider/screen for creating separate spaces in open floor plans.',
                stock: 'In Stock',
                sizes: {
                    '3-Panel': 65000,
                    '4-Panel': 85000,
                    '6-Panel': 115000
                },
                specs: {
                    material: 'Wood & fabric/paper',
                    panels: 'Folding screen design',
                    style: 'Decorative room divider'
                },
                tags: ['living', 'divider', 'screen', 'decor']
            },
            {
                id: 'furn-living-015',
                name: 'Floor Lamp',
                category: 'living',
                price: 35000,
                basePrice: 35000,
                image: '/img/furniture/floor-lamp.jpg',
                description: 'Modern floor lamp with adjustable height and dimmable LED lighting.',
                stock: 'In Stock',
                sizes: {
                    'Standard (1.5m)': 25000,
                    'Tall (1.8m)': 35000,
                    'Extra Tall (2.1m)': 45000
                },
                specs: {
                    lighting: 'Dimmable LED',
                    adjustment: 'Height adjustable',
                    style: 'Modern floor lamp'
                },
                tags: ['living', 'lamp', 'lighting', 'floor']
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
                id: 'furn-dining-002',
                name: 'Extendable Dining Table',
                category: 'dining',
                price: 225000,
                basePrice: 225000,
                image: '/img/furniture/extendable-table.jpg',
                description: 'Dining table with extension leaves to accommodate more guests.',
                stock: 'In Stock',
                sizes: {
                    'Seats 6-8': 185000,
                    'Seats 8-10': 225000,
                    'Seats 10-12': 285000
                },
                specs: {
                    feature: 'Extendable with leaves',
                    material: 'Solid wood',
                    extension: 'Extra leaves included'
                },
                tags: ['dining', 'table', 'extendable', 'wood']
            },
            {
                id: 'furn-dining-003',
                name: 'Dining Chairs Set',
                category: 'dining',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/dining-chairs.jpg',
                description: 'Set of 6 upholstered dining chairs with comfortable padding.',
                stock: 'In Stock',
                sizes: {
                    'Set of 4': 125000,
                    'Set of 6': 185000,
                    'Set of 8': 245000
                },
                specs: {
                    set: '4-8 chairs',
                    material: 'Fabric upholstery',
                    comfort: 'Padded seats'
                },
                tags: ['dining', 'chairs', 'set', 'upholstered']
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
                id: 'furn-dining-006',
                name: 'Kitchen Island',
                category: 'dining',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/kitchen-island.jpg',
                description: 'Mobile kitchen island with storage, seating, and work surface.',
                stock: 'Made to Order',
                sizes: {
                    'Small': 125000,
                    'Medium': 185000,
                    'Large': 245000
                },
                specs: {
                    features: 'Storage, seating, workspace',
                    material: 'Wood & metal',
                    mobility: 'Locking casters'
                },
                tags: ['dining', 'kitchen', 'island', 'mobile']
            },
            {
                id: 'furn-dining-007',
                name: 'China Cabinet',
                category: 'dining',
                price: 225000,
                basePrice: 225000,
                image: '/img/furniture/china-cabinet.jpg',
                description: 'Display china cabinet with glass doors and interior lighting.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 185000,
                    'Large': 245000,
                    'Extra Large': 325000
                },
                specs: {
                    material: 'Wood & glass',
                    lighting: 'Interior LED lights',
                    display: 'Glass doors for display'
                },
                tags: ['dining', 'china', 'cabinet', 'display']
            },
            {
                id: 'furn-dining-008',
                name: 'Outdoor Dining Set',
                category: 'dining',
                price: 285000,
                basePrice: 285000,
                image: '/img/furniture/outdoor-dining.jpg',
                description: 'Weather-resistant outdoor dining set for patio or garden.',
                stock: 'In Stock',
                sizes: {
                    '4-Seater': 225000,
                    '6-Seater': 285000,
                    '8-Seater': 385000
                },
                specs: {
                    material: 'Weather-resistant materials',
                    set: 'Table and chairs',
                    use: 'Outdoor dining'
                },
                tags: ['dining', 'outdoor', 'patio', 'weather-resistant']
            },
            {
                id: 'furn-dining-009',
                name: 'Folding Dining Table',
                category: 'dining',
                price: 95000,
                basePrice: 95000,
                image: '/img/furniture/folding-table.jpg',
                description: 'Space-saving folding dining table for small apartments.',
                stock: 'In Stock',
                sizes: {
                    'Small (seats 4)': 65000,
                    'Medium (seats 6)': 95000,
                    'Large (seats 8)': 135000
                },
                specs: {
                    feature: 'Folding design',
                    material: 'Wood & metal',
                    storage: 'Folds flat for storage'
                },
                tags: ['dining', 'table', 'folding', 'space-saving']
            },
            {
                id: 'furn-dining-010',
                name: 'Round Dining Table',
                category: 'dining',
                price: 165000,
                basePrice: 165000,
                image: '/img/furniture/round-table.jpg',
                description: 'Round dining table perfect for conversation and small spaces.',
                stock: 'In Stock',
                sizes: {
                    'Small (120cm)': 125000,
                    'Medium (150cm)': 165000,
                    'Large (180cm)': 225000
                },
                specs: {
                    shape: 'Round table',
                    material: 'Solid wood',
                    seating: 'Comfortable for conversation'
                },
                tags: ['dining', 'table', 'round', 'conversation']
            },
            {
                id: 'furn-dining-011',
                name: 'Dining Bench',
                category: 'dining',
                price: 85000,
                basePrice: 85000,
                image: '/img/furniture/dining-bench.jpg',
                description: 'Upholstered dining bench for family-style seating.',
                stock: 'In Stock',
                sizes: {
                    '2-Seater': 65000,
                    '3-Seater': 85000,
                    '4-Seater': 115000
                },
                specs: {
                    seating: 'Bench style',
                    material: 'Wood & fabric',
                    comfort: 'Padded seating'
                },
                tags: ['dining', 'bench', 'seating', 'family']
            },
            {
                id: 'furn-dining-012',
                name: 'Server Cart',
                category: 'dining',
                price: 75000,
                basePrice: 75000,
                image: '/img/furniture/server-cart.jpg',
                description: 'Mobile serving cart for dining room or kitchen.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 65000,
                    'Large': 85000,
                    'Deluxe': 115000
                },
                specs: {
                    features: 'Shelves, wine rack',
                    material: 'Wood & metal',
                    mobility: 'Wheels for easy movement'
                },
                tags: ['dining', 'cart', 'serving', 'mobile']
            },
            {
                id: 'furn-dining-013',
                name: 'Formal Dining Set',
                category: 'dining',
                price: 485000,
                basePrice: 485000,
                image: '/img/furniture/formal-dining.jpg',
                description: 'Formal dining set with elegant table and upholstered chairs.',
                stock: 'Made to Order',
                sizes: {
                    '8-Seater': 385000,
                    '10-Seater': 485000,
                    '12-Seater': 585000
                },
                specs: {
                    style: 'Formal elegant',
                    material: 'Premium wood & fabric',
                    set: 'Table + matching chairs'
                },
                tags: ['dining', 'formal', 'elegant', 'luxury']
            },
            {
                id: 'furn-dining-014',
                name: 'Pub Table Set',
                category: 'dining',
                price: 165000,
                basePrice: 165000,
                image: '/img/furniture/pub-table.jpg',
                description: 'Tall pub table with matching stools for casual dining.',
                stock: 'In Stock',
                sizes: {
                    'Set for 2': 125000,
                    'Set for 4': 185000,
                    'Set for 6': 245000
                },
                tags: ['dining', 'pub', 'table', 'casual']
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
                id: 'furn-bedroom-001',
                name: 'Queen Bed Frame',
                category: 'bedroom',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/queen-bed.jpg',
                description: 'Solid wood queen bed frame with headboard and footboard.',
                stock: 'In Stock',
                sizes: {
                    'Single': 125000,
                    'Queen': 185000,
                    'King': 245000
                },
                specs: {
                    size: 'Queen size',
                    material: 'Solid wood',
                    features: 'Headboard & footboard'
                },
                tags: ['bedroom', 'bed', 'queen', 'wood']
            },
            {
                id: 'furn-bedroom-002',
                name: 'Wardrobe Closet',
                category: 'bedroom',
                price: 285000,
                basePrice: 285000,
                image: '/img/furniture/wardrobe.jpg',
                description: 'Spacious wardrobe with hanging space, shelves, and drawers.',
                stock: 'Made to Order',
                sizes: {
                    '3-Door': 225000,
                    '4-Door': 285000,
                    '6-Door': 385000
                },
                specs: {
                    doors: 'Sliding or hinged',
                    storage: 'Hanging, shelves, drawers',
                    material: 'Wood construction'
                },
                tags: ['bedroom', 'wardrobe', 'closet', 'storage']
            },
            {
                id: 'furn-bedroom-003',
                name: 'Dressing Table',
                category: 'bedroom',
                price: 125000,
                basePrice: 125000,
                image: '/img/furniture/dressing-table.jpg',
                description: 'Vanity dressing table with mirror and storage drawers.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 95000,
                    'Large': 135000,
                    'Deluxe': 185000
                },
                specs: {
                    features: 'Mirror, drawers, stool',
                    material: 'Wood & glass',
                    style: 'Vanity dressing table'
                },
                tags: ['bedroom', 'dressing', 'table', 'vanity']
            },
            {
                id: 'furn-bedroom-004',
                name: 'Nightstand Set',
                category: 'bedroom',
                price: 95000,
                basePrice: 95000,
                image: '/img/furniture/nightstands.jpg',
                description: 'Set of 2 matching nightstands with drawers.',
                stock: 'In Stock',
                sizes: {
                    'Single': 65000,
                    'Set of 2': 95000,
                    'Set of 3': 135000
                },
                specs: {
                    set: 'Matching pair',
                    storage: 'Drawers for bedside items',
                    material: 'Wood construction'
                },
                tags: ['bedroom', 'nightstand', 'set', 'bedside']
            },
            {
                id: 'furn-bedroom-005',
                name: 'Chest of Drawers',
                category: 'bedroom',
                price: 145000,
                basePrice: 145000,
                image: '/img/furniture/chest-drawers.jpg',
                description: 'Tall chest of drawers for clothing storage.',
                stock: 'In Stock',
                sizes: {
                    '4-Drawer': 115000,
                    '6-Drawer': 145000,
                    '8-Drawer': 185000
                },
                specs: {
                    drawers: 'Multiple drawers',
                    material: 'Wood construction',
                    storage: 'Clothing and linens'
                },
                tags: ['bedroom', 'chest', 'drawers', 'storage']
            },
            {
                id: 'furn-bedroom-006',
                name: 'Bedroom Bench',
                category: 'bedroom',
                price: 65000,
                basePrice: 65000,
                image: '/img/furniture/bedroom-bench.jpg',
                description: 'Upholstered bench for foot of bed seating and storage.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 55000,
                    'Large': 75000,
                    'Storage': 95000
                },
                specs: {
                    feature: 'Foot of bed bench',
                    material: 'Fabric & wood',
                    storage: 'Some with storage'
                },
                tags: ['bedroom', 'bench', 'seating', 'decor']
            },
            {
                id: 'furn-bedroom-007',
                name: 'Mirrored Wardrobe',
                category: 'bedroom',
                price: 325000,
                basePrice: 325000,
                image: '/img/furniture/mirrored-wardrobe.jpg',
                description: 'Wardrobe with mirrored doors to create space illusion.',
                stock: 'Made to Order',
                sizes: {
                    '3-Door': 285000,
                    '4-Door': 365000,
                    '6-Door': 485000
                },
                specs: {
                    feature: 'Mirrored doors',
                    material: 'Wood & mirror',
                    effect: 'Creates space illusion'
                },
                tags: ['bedroom', 'wardrobe', 'mirror', 'storage']
            },
            {
                id: 'furn-bedroom-008',
                name: 'Canopy Bed',
                category: 'bedroom',
                price: 385000,
                basePrice: 385000,
                image: '/img/furniture/canopy-bed.jpg',
                description: 'Romantic canopy bed frame with fabric draping.',
                stock: 'Made to Order',
                sizes: {
                    'Queen': 385000,
                    'King': 485000,
                    'Custom': 585000
                },
                specs: {
                    style: 'Canopy design',
                    material: 'Wood & fabric',
                    feature: 'Draping included'
                },
                tags: ['bedroom', 'bed', 'canopy', 'romantic']
            },
            {
                id: 'furn-bedroom-009',
                name: 'Bedroom Armoire',
                category: 'bedroom',
                price: 245000,
                basePrice: 245000,
                image: '/img/furniture/armoire.jpg',
                description: 'Traditional armoire with doors and interior storage.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 195000,
                    'Large': 265000,
                    'Extra Large': 345000
                },
                specs: {
                    style: 'Traditional armoire',
                    storage: 'Hanging and shelves',
                    material: 'Solid wood'
                },
                tags: ['bedroom', 'armoire', 'storage', 'traditional']
            },
            {
                id: 'furn-bedroom-010',
                name: 'Storage Bed',
                category: 'bedroom',
                price: 225000,
                basePrice: 225000,
                image: '/img/furniture/storage-bed.jpg',
                description: 'Bed frame with built-in storage drawers.',
                stock: 'In Stock',
                sizes: {
                    'Single': 165000,
                    'Queen': 225000,
                    'King': 285000
                },
                specs: {
                    feature: 'Built-in storage drawers',
                    material: 'Wood construction',
                    storage: 'Under-bed storage'
                },
                tags: ['bedroom', 'bed', 'storage', 'practical']
            },
            {
                id: 'furn-bedroom-011',
                name: 'Jewelry Armoire',
                category: 'bedroom',
                price: 85000,
                basePrice: 85000,
                image: '/img/furniture/jewelry-armoire.jpg',
                description: 'Small armoire specifically for jewelry storage.',
                stock: 'In Stock',
                sizes: {
                    'Small': 65000,
                    'Medium': 85000,
                    'Large': 115000
                },
                specs: {
                    purpose: 'Jewelry storage',
                    features: 'Ring holders, necklace hooks',
                    security: 'Locking mechanism'
                },
                tags: ['bedroom', 'jewelry', 'storage', 'armoire']
            },
            {
                id: 'furn-bedroom-012',
                name: 'Bedroom TV Stand',
                category: 'bedroom',
                price: 95000,
                basePrice: 95000,
                image: '/img/furniture/bedroom-tv-stand.jpg',
                description: 'TV stand designed for bedroom with storage for media.',
                stock: 'In Stock',
                sizes: {
                    'Small': 75000,
                    'Medium': 95000,
                    'Large': 135000
                },
                specs: {
                    purpose: 'Bedroom TV placement',
                    storage: 'Media and component storage',
                    material: 'Wood composite'
                },
                tags: ['bedroom', 'TV', 'stand', 'entertainment']
            },
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
            },
            {
                id: 'furn-seating-002',
                name: 'Recliner Chair',
                category: 'seating',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/recliner-chair.jpg',
                description: 'Comfortable recliner chair with multiple positions.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 165000,
                    'Deluxe': 225000,
                    'Massage': 325000
                },
                specs: {
                    feature: 'Reclining mechanism',
                    material: 'Leather or fabric',
                    comfort: 'Multiple positions'
                },
                tags: ['seating', 'recliner', 'comfort', 'leather']
            },
            {
                id: 'furn-seating-003',
                name: 'Rocking Chair',
                category: 'seating',
                price: 95000,
                basePrice: 95000,
                image: '/img/furniture/rocking-chair.jpg',
                description: 'Traditional rocking chair for nursery or relaxation.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 85000,
                    'Large': 115000,
                    'Glider': 135000
                },
                specs: {
                    feature: 'Rocking motion',
                    material: 'Wood & cushion',
                    use: 'Nursery or relaxation'
                },
                tags: ['seating', 'rocking', 'chair', 'traditional']
            },
            {
                id: 'furn-seating-004',
                name: 'Folding Chairs',
                category: 'seating',
                price: 25000,
                basePrice: 25000,
                image: '/img/furniture/folding-chairs.jpg',
                description: 'Set of 4 folding chairs for events and extra seating.',
                stock: 'In Stock',
                sizes: {
                    'Set of 4': 25000,
                    'Set of 6': 35000,
                    'Set of 8': 45000
                },
                specs: {
                    feature: 'Folding for storage',
                    material: 'Metal & plastic',
                    use: 'Events and extra seating'
                },
                tags: ['seating', 'folding', 'chairs', 'events']
            },
            {
                id: 'furn-seating-005',
                name: 'Dining Chair',
                category: 'seating',
                price: 35000,
                basePrice: 35000,
                image: '/img/furniture/single-dining-chair.jpg',
                description: 'Single upholstered dining chair.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 30000,
                    'Upholstered': 35000,
                    'Premium': 45000
                },
                specs: {
                    purpose: 'Dining seating',
                    material: 'Wood & fabric',
                    comfort: 'Padded seat'
                },
                tags: ['seating', 'dining', 'chair', 'single']
            },
            {
                id: 'furn-seating-006',
                name: 'Office Chair',
                category: 'seating',
                price: 125000,
                basePrice: 125000,
                image: '/img/furniture/basic-office-chair.jpg',
                description: 'Basic ergonomic office chair with adjustable features.',
                stock: 'In Stock',
                sizes: {
                    'Basic': 95000,
                    'Standard': 125000,
                    'Ergonomic': 185000
                },
                specs: {
                    purpose: 'Office seating',
                    features: 'Adjustable height',
                    comfort: 'Ergonomic design'
                },
                tags: ['seating', 'office', 'chair', 'ergonomic']
            },
            {
                id: 'furn-seating-007',
                name: 'Bean Bag Chair',
                category: 'seating',
                price: 35000,
                basePrice: 35000,
                image: '/img/furniture/bean-bag.jpg',
                description: 'Large bean bag chair for casual seating.',
                stock: 'In Stock',
                sizes: {
                    'Small': 25000,
                    'Medium': 35000,
                    'Large': 45000
                },
                specs: {
                    style: 'Casual bean bag',
                    filling: 'EPS beads',
                    cover: 'Removable washable cover'
                },
                tags: ['seating', 'beanbag', 'casual', 'kids']
            },
            {
                id: 'furn-seating-008',
                name: 'Bench Seating',
                category: 'seating',
                price: 75000,
                basePrice: 75000,
                image: '/img/furniture/bench-seating.jpg',
                description: 'Wooden bench for entryway or dining.',
                stock: 'In Stock',
                sizes: {
                    '2-Seater': 55000,
                    '3-Seater': 75000,
                    '4-Seater': 95000
                },
                specs: {
                    style: 'Bench seating',
                    material: 'Solid wood',
                    use: 'Entryway or dining'
                },
                tags: ['seating', 'bench', 'wood', 'entryway']
            },
            {
                id: 'furn-seating-009',
                name: 'Swivel Chair',
                category: 'seating',
                price: 115000,
                basePrice: 115000,
                image: '/img/furniture/swivel-chair.jpg',
                description: '360-degree swivel chair for office or living room.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 95000,
                    'Deluxe': 135000,
                    'Executive': 185000
                },
                specs: {
                    feature: '360-degree swivel',
                    material: 'Fabric & metal',
                    base: 'Sturdy five-point base'
                },
                tags: ['seating', 'swivel', 'chair', 'office']
            },
            {
                id: 'furn-seating-010',
                name: 'Chaise Lounge',
                category: 'seating',
                price: 185000,
                basePrice: 185000,
                image: '/img/furniture/chaise-lounge.jpg',
                description: 'Elegant chaise lounge for living room or bedroom.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 165000,
                    'Large': 225000,
                    'Premium': 285000
                },
                specs: {
                    style: 'Chaise lounge',
                    material: 'Upholstered fabric',
                    comfort: 'Reclining position'
                },
                tags: ['seating', 'chaise', 'lounge', 'elegant']
            },
            {
                id: 'furn-seating-011',
                name: 'Stool Set',
                category: 'seating',
                price: 65000,
                basePrice: 65000,
                image: '/img/furniture/stool-set.jpg',
                description: 'Set of 3 adjustable height stools.',
                stock: 'In Stock',
                sizes: {
                    'Set of 2': 45000,
                    'Set of 3': 65000,
                    'Set of 4': 85000
                },
                specs: {
                    feature: 'Height adjustable',
                    material: 'Metal & wood',
                    use: 'Kitchen or bar'
                },
                tags: ['seating', 'stools', 'set', 'adjustable']
            },
            {
                id: 'furn-seating-012',
                name: 'Floor Cushions',
                category: 'seating',
                price: 25000,
                basePrice: 25000,
                image: '/img/furniture/floor-cushions.jpg',
                description: 'Set of 4 floor cushions for casual seating.',
                stock: 'In Stock',
                sizes: {
                    'Set of 2': 15000,
                    'Set of 4': 25000,
                    'Set of 6': 35000
                },
                specs: {
                    style: 'Floor seating',
                    material: 'Fabric filled',
                    use: 'Casual floor seating'
                },
                tags: ['seating', 'cushions', 'floor', 'casual']
            },
            {
                id: 'furn-seating-013',
                name: 'Director Chair',
                category: 'seating',
                price: 55000,
                basePrice: 55000,
                image: '/img/furniture/director-chair.jpg',
                description: 'Classic director chair with canvas seat and back.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 45000,
                    'Folding': 55000,
                    'Premium': 75000
                },
                specs: {
                    style: 'Director chair',
                    material: 'Wood & canvas',
                    feature: 'Folding design'
                },
                tags: ['seating', 'director', 'chair', 'canvas']
            },
            {
                id: 'furn-seating-014',
                name: 'Side Chair',
                category: 'seating',
                price: 45000,
                basePrice: 45000,
                image: '/img/furniture/side-chair.jpg',
                description: 'Simple side chair for various rooms.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 35000,
                    'Upholstered': 45000,
                    'Wooden': 55000
                },
                specs: {
                    purpose: 'General seating',
                    material: 'Various options',
                    style: 'Simple side chair'
                },
                tags: ['seating', 'side', 'chair', 'simple']
            },
            {
                id: 'furn-seating-015',
                name: 'Lounge Chair',
                category: 'seating',
                price: 125000,
                basePrice: 125000,
                image: '/img/furniture/lounge-chair.jpg',
                description: 'Comfortable lounge chair for reading or relaxing.',
                stock: 'In Stock',
                sizes: {
                    'Standard': 105000,
                    'Large': 135000,
                    'Premium': 185000
                },
                specs: {
                    purpose: 'Lounge seating',
                    comfort: 'Deep seating',
                    material: 'Upholstered fabric'
                },
                tags: ['seating', 'lounge', 'chair', 'reading']
            }
        ];

        const machineryProducts = [
            // =========== BLOCK MACHINES ===========
            {
                id: 'mach-001',
                name: 'Manual Block Making Machine (2 Blocks)',
                category: 'machines',
                subcategory: 'manual',
                price: 450000,
                basePrice: 450000,
                image: '/img/machinery/manual-2-block.jpg',
                description: 'Manual operation block-making machine producing 2 blocks per cycle.',
                stock: 'In Stock',
                specs: {
                    capacity: '2 blocks/cycle',
                    production: '300-500 blocks/day',
                    power: 'Manual operation',
                    blockTypes: '6", 9" hollow/solid',
                    warranty: '3 months'
                },
                tags: ['machine', 'manual', '2-block']
            },
            {
                id: 'mach-002',
                name: 'Semi-Automatic Block Machine (3 Blocks)',
                category: 'machines',
                subcategory: 'semi-auto',
                price: 950000,
                basePrice: 950000,
                image: '/img/machinery/semi-auto-3-block.jpg',
                description: 'Semi-automatic block machine with motorized vibration for 3 blocks per cycle.',
                stock: 'In Stock',
                specs: {
                    capacity: '3 blocks/cycle',
                    production: '800-1200 blocks/day',
                    power: 'Electric 3HP',
                    blockTypes: 'All standard sizes',
                    warranty: '6 months'
                },
                tags: ['machine', 'semi-auto', '3-block']
            },
            {
                id: 'mach-003',
                name: 'Automatic Block Machine (5 Blocks)',
                category: 'machines',
                subcategory: 'auto',
                price: 2500000,
                basePrice: 2500000,
                image: '/img/machinery/auto-5-block.jpg',
                description: 'Fully automatic hydraulic block machine producing 5 blocks per cycle.',
                stock: 'Made to Order',
                specs: {
                    capacity: '5 blocks/cycle',
                    production: '2000-3000 blocks/day',
                    power: 'Electric 10HP',
                    blockTypes: 'All types including paving',
                    warranty: '1 year'
                },
                tags: ['machine', 'automatic', '5-block']
            },
            {
                id: 'mach-004',
                name: 'Mobile Block Making Machine',
                category: 'machines',
                subcategory: 'mobile',
                price: 1850000,
                basePrice: 1850000,
                image: '/img/machinery/mobile-block-machine.jpg',
                description: 'Mobile block machine with diesel engine for on-site production.',
                stock: 'Made to Order',
                specs: {
                    capacity: '4 blocks/cycle',
                    production: '1500-2000 blocks/day',
                    power: 'Diesel engine',
                    mobility: 'Trailer mounted',
                    warranty: '6 months'
                },
                tags: ['machine', 'mobile', 'diesel']
            },

            // =========== CONSTRUCTION BLOCKS ===========
            {
                id: 'block-001',
                name: '6-inch Hollow Sandcrete Blocks',
                category: 'blocks',
                subcategory: '6-inch',
                price: 670,
                basePrice: 670,
                image: '/img/machinery/6-inch-blocks.jpg',
                description: 'Standard 6-inch hollow sandcrete blocks, minimum order 100 blocks.',
                stock: 'In Stock',
                specs: {
                    size: '6 inches (450x225x150mm)',
                    type: 'Hollow',
                    strength: '3.5N/mm²',
                    weight: 'Approx 15kg',
                    minOrder: '100 blocks'
                },
                tags: ['blocks', '6-inch', 'hollow']
            },
            {
                id: 'block-002',
                name: '6-inch Solid Sandcrete Blocks',
                category: 'blocks',
                subcategory: '6-inch',
                price: 750,
                basePrice: 750,
                image: '/img/machinery/6-inch-solid-blocks.jpg',
                description: 'High-density 6-inch solid blocks for load-bearing walls.',
                stock: 'In Stock',
                specs: {
                    size: '6 inches (450x225x150mm)',
                    type: 'Solid',
                    strength: '4.5N/mm²',
                    weight: 'Approx 22kg',
                    minOrder: '100 blocks'
                },
                tags: ['blocks', '6-inch', 'solid']
            },
            {
                id: 'block-003',
                name: '9-inch Hollow Sandcrete Blocks',
                category: 'blocks',
                subcategory: '9-inch',
                price: 770,
                basePrice: 770,
                image: '/img/machinery/9-inch-blocks.jpg',
                description: 'Standard 9-inch hollow sandcrete blocks, minimum order 100 blocks.',
                stock: 'In Stock',
                specs: {
                    size: '9 inches (450x225x225mm)',
                    type: 'Hollow',
                    strength: '3.5N/mm²',
                    weight: 'Approx 20kg',
                    minOrder: '100 blocks'
                },
                tags: ['blocks', '9-inch', 'hollow']
            },
            {
                id: 'block-004',
                name: '9-inch Solid Sandcrete Blocks',
                category: 'blocks',
                subcategory: '9-inch',
                price: 850,
                basePrice: 850,
                image: '/img/machinery/9-inch-solid-blocks.jpg',
                description: 'High-density 9-inch solid blocks for foundation and structural walls.',
                stock: 'In Stock',
                specs: {
                    size: '9 inches (450x225x225mm)',
                    type: 'Solid',
                    strength: '4.5N/mm²',
                    weight: 'Approx 30kg',
                    minOrder: '100 blocks'
                },
                tags: ['blocks', '9-inch', 'solid']
            },
            {
                id: 'block-005',
                name: 'Interlocking Blocks',
                category: 'blocks',
                subcategory: 'interlocking',
                price: 950,
                basePrice: 950,
                image: '/img/machinery/interlocking-blocks.jpg',
                description: 'Specially designed interlocking blocks for quick construction.',
                stock: 'In Stock',
                specs: {
                    size: 'Various patterns',
                    type: 'Interlocking',
                    feature: 'No mortar needed',
                    application: 'Quick build structures',
                    minOrder: '100 blocks'
                },
                tags: ['blocks', 'interlocking']
            },
            {
                id: 'block-006',
                name: 'Paving Blocks',
                category: 'blocks',
                subcategory: 'paving',
                price: 1250,
                basePrice: 1250,
                image: '/img/machinery/paving-blocks.jpg',
                description: 'High-quality paving blocks for driveways and walkways.',
                stock: 'In Stock',
                specs: {
                    size: 'Various (60x60mm to 100x100mm)',
                    thickness: '60-80mm',
                    color: 'Natural gray or colored',
                    application: 'Driveways, walkways',
                    minOrder: '10 sqm'
                },
                tags: ['blocks', 'paving', 'outdoor']
            },

            // =========== BULK CEMENT ===========
            {
                id: 'cement-001',
                name: 'Dangote Cement (42.5 Grade)',
                category: 'cement',
                subcategory: 'dangote',
                price: 8000,
                basePrice: 8000,
                image: '/img/machinery/dangote-cement.jpg',
                description: 'Premium 42.5 grade cement, minimum bulk order 100 bags.',
                stock: 'In Stock',
                specs: {
                    brand: 'Dangote',
                    grade: '42.5R',
                    setting: 'Quick setting',
                    packaging: '50kg bags',
                    minOrder: '100 bags'
                },
                tags: ['cement', 'dangote', 'bulk']
            },
            {
                id: 'cement-002',
                name: 'Lafarge Cement (42.5 Grade)',
                category: 'cement',
                subcategory: 'lafarge',
                price: 8200,
                basePrice: 8200,
                image: '/img/machinery/lafarge-cement.jpg',
                description: 'High-quality Lafarge cement for structural concrete.',
                stock: 'In Stock',
                specs: {
                    brand: 'Lafarge',
                    grade: '42.5R',
                    strength: 'High early strength',
                    packaging: '50kg bags',
                    minOrder: '100 bags'
                },
                tags: ['cement', 'lafarge', 'bulk']
            },
            {
                id: 'cement-003',
                name: 'BUA Cement (42.5 Grade)',
                category: 'cement',
                subcategory: 'bua',
                price: 7900,
                basePrice: 7900,
                image: '/img/machinery/bua-cement.jpg',
                description: 'Reliable BUA cement for all construction applications.',
                stock: 'In Stock',
                specs: {
                    brand: 'BUA',
                    grade: '42.5R',
                    application: 'General construction',
                    packaging: '50kg bags',
                    minOrder: '100 bags'
                },
                tags: ['cement', 'bua', 'bulk']
            },

            // =========== INDUSTRIAL MIXERS ===========
            {
                id: 'mixer-001',
                name: 'Small Concrete Mixer (200L)',
                category: 'mixers',
                subcategory: 'small',
                price: 350000,
                basePrice: 350000,
                image: '/img/machinery/small-mixer.jpg',
                description: 'Compact concrete mixer suitable for small-scale operations.',
                stock: 'In Stock',
                specs: {
                    capacity: '200 liters',
                    power: 'Electric 3HP',
                    mixing: 'Drum rotation',
                    mobility: 'Wheel mounted',
                    warranty: '3 months'
                },
                tags: ['mixer', 'concrete', 'small']
            },
            {
                id: 'mixer-002',
                name: 'Medium Concrete Mixer (500L)',
                category: 'mixers',
                subcategory: 'medium',
                price: 700000,
                basePrice: 700000,
                image: '/img/machinery/medium-mixer.jpg',
                description: 'Medium capacity mixer for construction sites and block production.',
                stock: 'In Stock',
                specs: {
                    capacity: '500 liters',
                    power: 'Electric 7.5HP',
                    mixing: 'Forced action',
                    features: 'Tilting drum',
                    warranty: '6 months'
                },
                tags: ['mixer', 'concrete', 'medium']
            },
            {
                id: 'mixer-003',
                name: 'Large Industrial Mixer (1000L)',
                category: 'mixers',
                subcategory: 'large',
                price: 1200000,
                basePrice: 1200000,
                image: '/img/machinery/large-mixer.jpg',
                description: 'Heavy-duty industrial mixer for high-volume block production.',
                stock: 'Made to Order',
                specs: {
                    capacity: '1000 liters',
                    power: 'Electric 15HP or Diesel',
                    mixing: 'Planetary action',
                    automation: 'Auto discharge',
                    warranty: '1 year'
                },
                tags: ['mixer', 'industrial', 'large']
            },
            {
                id: 'mixer-004',
                name: 'Mortar Mixer (150L)',
                category: 'mixers',
                subcategory: 'mortar',
                price: 250000,
                basePrice: 250000,
                image: '/img/machinery/mortar-mixer.jpg',
                description: 'Specialized mortar mixer for plaster and mortar production.',
                stock: 'In Stock',
                specs: {
                    capacity: '150 liters',
                    power: 'Electric 2HP',
                    application: 'Mortar/plaster mixing',
                    features: 'Paddle mixing',
                    warranty: '3 months'
                },
                tags: ['mixer', 'mortar', 'plaster']
            }
        ];

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

// ====================================================
// Make sure all arrays are properly defined here

// Combined products
const allProducts = [
    ...agricultureProducts,
    ...constructionProducts,
    ...furnitureProducts,
    ...machineryProducts,
    ...solarProducts,
];

// Debug: Check if products are loaded
console.log('Total products loaded:', allProducts.length);
console.log('Sample product:', allProducts[0]);

// Make products available globally
window.allProducts = allProducts;

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

function addToCart(product) {
    console.log('Adding to cart:', product.name);
    
    if (!product || !product.id || !product.name || !product.price) {
        console.error('Invalid product data:', product);
        return false;
    }
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated existing item quantity:', existingItem.quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image || '/img/logo.jpg',
            quantity: 1,
            category: product.category
        });
        console.log('Added new item to cart');
    }
    
    const saved = saveCart(cart);
    
    if (saved) {
        showCartNotification(product.name);
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
    console.log('Shop All page loaded');
    console.log('Total products available:', allProducts.length);
    
    // Initialize cart count
    updateCartCount();
    
    // DOM Elements
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('product-search');
    const sortSelect = document.getElementById('sort-select');
    const categoryTabs = document.getElementById('category-tabs');
    const loadMoreBtn = document.getElementById('load-more');
    const productCount = document.getElementById('product-count');
    const noProducts = document.getElementById('no-products');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    // Check if DOM elements exist
    if (!productsContainer) {
        console.error('CRITICAL: products-container not found in HTML!');
        alert('Error: Products container not found. Please check your HTML.');
        return;
    }
    
    if (!allProducts || allProducts.length === 0) {
        console.error('CRITICAL: No products loaded!');
        productsContainer.innerHTML = '<div class="no-products"><h3>No products available at the moment</h3><p>Please check back later.</p></div>';
        return;
    }
    
    // Pagination variables
    let currentPage = 1;
    const productsPerPage = 12;
    let filteredProducts = [...allProducts];
    let currentCategory = 'all';
    
    // Initialize the page
    function initPage() {
        console.log('Initializing page with', allProducts.length, 'products');
        currentPage = 1;
        updateCategoryCounts();
        filterProducts();
        setupEventListeners();
        setupCartDrawer();
        updateCartCount();
    }
    
    // Update category counts
    function updateCategoryCounts() {
        console.log('Updating category counts...');
        const categories = ['all', 'agriculture', 'construction', 'furniture', 'machinery', 'solar'];
        
        categories.forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                let count;
                if (category === 'all') {
                    count = allProducts.length;
                } else {
                    count = allProducts.filter(product => getMainCategory(product) === category).length;
                }
                countElement.textContent = count;
                console.log(`Category ${category}: ${count} products`);
            }
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                console.log('Search input:', this.value);
                currentPage = 1;
                filterProducts();
            });
        }
        
        // Sort functionality
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                console.log('Sort changed to:', this.value);
                currentPage = 1;
                filterProducts();
            });
        }
        
        // Category tabs
        if (categoryTabs) {
            const tabs = categoryTabs.querySelectorAll('.category-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    console.log('Category tab clicked:', this.dataset.category);
                    
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Update current category
                    currentCategory = this.dataset.category;
                    currentPage = 1;
                    filterProducts();
                });
            });
        }
        
        // Load more button
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                console.log('Load more clicked, page:', currentPage + 1);
                currentPage++;
                displayProducts();
            });
        }
        
        // Reset filters button
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                console.log('Resetting filters');
                if (searchInput) searchInput.value = '';
                if (sortSelect) sortSelect.value = 'name-asc';
                
                // Reset category tabs
                if (categoryTabs) {
                    const tabs = categoryTabs.querySelectorAll('.category-tab');
                    tabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.dataset.category === 'all') {
                            tab.classList.add('active');
                        }
                    });
                }
                
                currentCategory = 'all';
                currentPage = 1;
                filterProducts();
            });
        }
        
        // Single global event listener for add-to-cart buttons
        document.addEventListener('click', function(e) {
            const addToCartBtn = e.target.closest('.btn-primary.add-to-cart');
            if (!addToCartBtn) return;
            
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // Get product data
            const productId = addToCartBtn.getAttribute('data-id');
            const product = allProducts.find(p => p.id === productId);
            
            if (product) {
                console.log('Add to cart clicked for:', product.name);
                
                // Add to cart
                const success = addToCart(product);
                
                if (success) {
                    // Visual feedback
                    const originalText = addToCartBtn.innerHTML;
                    const originalBackground = addToCartBtn.style.background;
                    
                    addToCartBtn.innerHTML = '✓ Added!';
                    addToCartBtn.style.background = '#27ae60';
                    
                    setTimeout(() => {
                        addToCartBtn.innerHTML = originalText;
                        addToCartBtn.style.background = originalBackground;
                    }, 1500);
                }
            } else {
                console.error('Product not found with ID:', productId);
                alert('Product not found!');
            }
        }, true);
    }
    
    // Filter products
    function filterProducts() {
        console.log('Filtering products...');
        const searchTerm = (searchInput ? searchInput.value.toLowerCase() : '');
        const sortValue = (sortSelect ? sortSelect.value : 'name-asc');
        
        // Filter by category
        if (currentCategory === 'all') {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(product => {
                return getMainCategory(product) === currentCategory;
            });
        }
        
        console.log(`After category filter (${currentCategory}):`, filteredProducts.length, 'products');
        
        // Filter by search term
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => {
                return (
                    product.name.toLowerCase().includes(searchTerm) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm)) ||
                    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
                    (product.specs && Object.values(product.specs).some(value => 
                        value.toString().toLowerCase().includes(searchTerm)
                    ))
                );
            });
            console.log(`After search filter ("${searchTerm}"):`, filteredProducts.length, 'products');
        }
        
        // Sort products
        filteredProducts = sortProducts(filteredProducts, sortValue);
        
        // Display products
        displayProducts();
    }
    
    // Sort products
    function sortProducts(products, sortValue) {
        const sortedProducts = [...products];
        
        switch (sortValue) {
            case 'name-asc':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // Sort by ID (assuming newer products have higher IDs)
                sortedProducts.sort((a, b) => b.id.localeCompare(a.id));
                break;
        }
        
        return sortedProducts;
    }
    
    // Display products
    function displayProducts() {
        console.log('Displaying products...');
        
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        
        console.log(`Displaying products ${startIndex + 1} to ${endIndex} of ${filteredProducts.length}`);
        
        // Clear container if first page
        if (currentPage === 1) {
            productsContainer.innerHTML = '';
        }
        
        // Get products for this page
        const pageProducts = filteredProducts.slice(startIndex, endIndex);
        
        // Show/hide no products message
        if (noProducts) {
            if (filteredProducts.length === 0) {
                console.log('No products found');
                noProducts.style.display = 'block';
                productsContainer.innerHTML = '';
            } else {
                noProducts.style.display = 'none';
                
                // Create product cards
                pageProducts.forEach(product => {
                    const productCard = createProductCard(product);
                    productsContainer.appendChild(productCard);
                });
            }
        } else {
            // If noProducts element doesn't exist, just show products
            pageProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsContainer.appendChild(productCard);
            });
        }
        
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
        if (currentPage === 1) {
            animateNewProducts();
        }
    }
    
    // Create product card
    function createProductCard(product) {
        console.log('Creating card for:', product.name);
        
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up';
        
        const stockClass = getStockClass(product.stock);
        const formattedPrice = product.price.toLocaleString();
        const categoryName = getCategoryDisplayName(product.category);
        
        // Build specs HTML if available
        let specsHTML = '';
        if (product.specs && Object.keys(product.specs).length > 0) {
            const specEntries = Object.entries(product.specs).slice(0, 2);
            specsHTML = `
                <div class="product-specs">
                    ${specEntries.map(([key, value]) => `
                        <div class="spec-item">
                            <span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</span>
                            <span class="spec-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Build description (truncate if too long)
        let description = product.description || 'No description available';
        if (description.length > 120) {
            description = description.substring(0, 120) + '...';
        }
        
        card.innerHTML = `
            <div class="product-category-badge">${categoryName}</div>
            <div class="product-image">
                <img src="${product.image || '/img/logo.jpg'}" alt="${product.name}" 
                     onerror="this.onerror=null; this.src='/img/logo.jpg'">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${description}</p>
                
                ${specsHTML}
                
                <div class="product-price">₦${formattedPrice}</div>
                
                <div class="product-stock ${stockClass}">${product.stock}</div>
                
                <div class="product-actions">
                    <button class="btn-primary add-to-cart" 
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image || '/img/logo.jpg'}">
                        Add to Cart
                    </button>
                    <a href="https://wa.me/2348129978419?text=I'm interested in: ${encodeURIComponent(product.name)} - ₦${formattedPrice}" 
                       class="btn-whatsapp" target="_blank">
                        WhatsApp
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Update product count display
    function updateProductCount() {
        if (!productCount) {
            console.warn('product-count element not found');
            return;
        }
        
        const totalProducts = filteredProducts.length;
        const showingProducts = Math.min(currentPage * productsPerPage, totalProducts);
        
        if (totalProducts === 0) {
            productCount.textContent = 'No products found matching your criteria';
        } else {
            productCount.textContent = `Showing ${showingProducts} of ${totalProducts} products`;
        }
        
        console.log('Product count updated:', productCount.textContent);
    }
    
    // Animate new products
    function animateNewProducts() {
        const allCards = productsContainer.querySelectorAll('.product-card');
        
        allCards.forEach((card, index) => {
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
        console.log('Setting up cart drawer');
        const cartDrawer = document.getElementById('cart-drawer');
        const openCartBtn = document.getElementById('open-cart-drawer');
        const closeCartBtn = document.getElementById('close-cart-drawer');
        const cartOverlay = document.getElementById('cart-drawer-overlay');
        
        // Open cart drawer
        if (openCartBtn && cartDrawer) {
            openCartBtn.addEventListener('click', function() {
                console.log('Opening cart drawer');
                cartDrawer.classList.add('active');
                if (cartOverlay) cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                renderCartDrawer();
            });
        }
        
        // Close cart drawer
        function closeCartDrawer() {
            console.log('Closing cart drawer');
            if (cartDrawer) cartDrawer.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
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
            if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('active')) {
                closeCartDrawer();
            }
        });
        
        // Render cart drawer function
        window.renderCartDrawer = function() {
            console.log('Rendering cart drawer');
            const cartItemsContainer = document.getElementById('cart-drawer-items');
            const drawerTotal = document.getElementById('drawer-total');
            
            if (!cartItemsContainer) return;
            
            const cart = getCart();
            console.log('Cart items:', cart);
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-drawer-empty">
                        <div class="cart-drawer-empty-icon">🛒</div>
                        <p>Your cart is empty</p>
                        <a href="/shop-all" class="btn btn-primary">Browse Products</a>
                    </div>
                `;
                if (drawerTotal) drawerTotal.textContent = '₦0';
                return;
            }
            
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-drawer-item" data-id="${item.id}">
                    <img src="${item.image || '/img/logo.jpg'}" alt="${item.name}" 
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
                    console.log('Removing item:', productId);
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
        
        // Initial render
        if (typeof window.renderCartDrawer === 'function') {
            window.renderCartDrawer();
        }
    }
    
    // Start the page
    console.log('Starting page initialization');
    initPage();
    
    // Make functions available globally
    window.addToCart = addToCart;
    window.updateCartCount = updateCartCount;
    window.getCart = getCart;
    window.showCartNotification = showCartNotification;
    window.getMainCategory = getMainCategory;
});