// database.js - MongoDB connection and models
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://collaborativeinvestmentltd:Collaborativeinvestmentltd@cluster0.za2h0re.mongodb.net/cil_database?retryWrites=true&w=majority';
const DB_NAME = 'cil_database';

let client;
let mongoDB; // Changed variable name to avoid conflict

async function connectDB() {
    try {
        client = new MongoClient(MONGODB_URL);
        await client.connect();
        mongoDB = client.db(DB_NAME); // Use mongoDB instead of db
        console.log('✅ MongoDB connected successfully');
        
        // Initialize collections with indexes
        await initializeCollections();
        return mongoDB;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

async function initializeCollections() {
    try {
        // Products collection
        await mongoDB.collection('products').createIndex({ category: 1 });
        await mongoDB.collection('products').createIndex({ name: 'text', description: 'text' });
        
        // Orders collection
        await mongoDB.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
        await mongoDB.collection('orders').createIndex({ status: 1 });
        await mongoDB.collection('orders').createIndex({ customerPhone: 1 });
        
        // Customers collection
        await mongoDB.collection('customers').createIndex({ email: 1 }, { unique: true });
        await mongoDB.collection('customers').createIndex({ phone: 1 });
        
        // Emails collection
        await mongoDB.collection('emails').createIndex({ sentAt: -1 });
        await mongoDB.collection('emails').createIndex({ status: 1 });
        
        // Admin collection with sample data
        const adminCount = await mongoDB.collection('admins').countDocuments();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await mongoDB.collection('admins').insertOne({
                email: 'admin@collaborativeinvestmentltd.com',
                password: hashedPassword,
                name: 'System Administrator',
                role: 'super_admin',
                permissions: ['all'],
                createdAt: new Date()
            });
            console.log('✅ Default admin user created');
        }
        
        // Insert sample products if empty
        const productCount = await mongoDB.collection('products').countDocuments();
        if (productCount === 0) {
            const sampleProducts = [
                {
                    name: "6-inch Concrete Blocks",
                    category: "construction",
                    price: 250,
                    unit: "per block",
                    minOrder: 100,
                    image: "/img/construction/6inch-blocks.jpg",
                    locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
                    description: "High-quality 6-inch concrete blocks for construction",
                    stock: "in-stock",
                    createdAt: new Date()
                },
                {
                    name: "Solar Panels (300W Mono)",
                    category: "solar",
                    price: 45000,
                    unit: "per panel",
                    minOrder: 1,
                    image: "/img/solar/solar-panels.jpg",
                    locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
                    description: "High-efficiency 300W monocrystalline solar panels",
                    stock: "in-stock",
                    createdAt: new Date()
                },
                {
                    name: "Live Broiler Chickens",
                    category: "livestock",
                    price: 3500,
                    unit: "per bird",
                    minOrder: 10,
                    image: "/img/livestock/broiler-chickens.jpg",
                    locations: ["Lagos", "Ibadan", "Abuja"],
                    description: "Healthy live broiler chickens, 6-8 weeks old",
                    stock: "in-stock",
                    createdAt: new Date()
                },
                {
                    name: "Manual Block-making Machine",
                    category: "machinery",
                    price: 450000,
                    unit: "per unit",
                    minOrder: 1,
                    image: "/img/machinery/manual-block-machine.jpg",
                    locations: ["Lagos", "Ibadan"],
                    description: "Manual operation block-making machine",
                    stock: "in-stock",
                    createdAt: new Date()
                }
            ];
            await mongoDB.collection('products').insertMany(sampleProducts);
            console.log('✅ Sample products inserted');
        }
        
        // Insert sample orders if empty
        const orderCount = await mongoDB.collection('orders').countDocuments();
        if (orderCount === 0) {
            const sampleOrders = [
                {
                    orderNumber: 'CIL-00001',
                    customerName: 'John Adebayo',
                    customerPhone: '+2348012345678',
                    customerEmail: 'john@example.com',
                    items: [
                        { name: '6-inch Concrete Blocks', quantity: 500, price: 250, total: 125000 }
                    ],
                    total: 125000,
                    status: 'completed',
                    createdAt: new Date(Date.now() - 86400000) // 1 day ago
                },
                {
                    orderNumber: 'CIL-00002',
                    customerName: 'Jane Smith',
                    customerPhone: '+2348098765432',
                    customerEmail: 'jane@example.com',
                    items: [
                        { name: 'Solar Panels (300W Mono)', quantity: 2, price: 45000, total: 90000 }
                    ],
                    total: 90000,
                    status: 'pending',
                    createdAt: new Date()
                }
            ];
            await mongoDB.collection('orders').insertMany(sampleOrders);
            console.log('✅ Sample orders inserted');
        }
        
        console.log('✅ Database initialization completed');
        
    } catch (error) {
        console.error('Error initializing collections:', error);
    }
}

// Database operations
const dbOperations = {
    // Generic CRUD operations
    async getAll(collection, query = {}, sort = {}, limit = 0) {
        try {
            let cursor = mongoDB.collection(collection).find(query);
            if (Object.keys(sort).length > 0) {
                cursor = cursor.sort(sort);
            }
            if (limit > 0) {
                cursor = cursor.limit(limit);
            }
            return await cursor.toArray();
        } catch (error) {
            console.error(`Error getting all from ${collection}:`, error);
            return [];
        }
    },

    async getById(collection, id) {
        try {
            return await mongoDB.collection(collection).findOne({ _id: new ObjectId(id) });
        } catch (error) {
            console.error(`Error getting by id from ${collection}:`, error);
            return null;
        }
    },

    async create(collection, data) {
        try {
            data.createdAt = new Date();
            const result = await mongoDB.collection(collection).insertOne(data);
            return { _id: result.insertedId, ...data };
        } catch (error) {
            console.error(`Error creating in ${collection}:`, error);
            throw error;
        }
    },

    async update(collection, id, updates) {
        try {
            updates.updatedAt = new Date();
            const result = await mongoDB.collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: updates }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            console.error(`Error updating in ${collection}:`, error);
            throw error;
        }
    },

    async delete(collection, id) {
        try {
            const result = await mongoDB.collection(collection).deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error deleting from ${collection}:`, error);
            throw error;
        }
    },

    // Specific collection methods
    async getProductsByCategory(category) {
        return await this.getAll('products', { category });
    },

    async getOrdersByStatus(status) {
        return await this.getAll('orders', { status }, { createdAt: -1 });
    },

    async getRecentEmails(limit = 50) {
        return await this.getAll('emails', {}, { sentAt: -1 }, limit);
    },

    async getAdminByEmail(email) {
        return await mongoDB.collection('admins').findOne({ email });
    },

    async verifyAdminCredentials(email, password) {
        try {
            const admin = await this.getAdminByEmail(email);
            if (admin && await bcrypt.compare(password, admin.password)) {
                const { password: _, ...adminWithoutPassword } = admin;
                return { success: true, admin: adminWithoutPassword };
            }
            return { success: false, message: 'Invalid email or password' };
        } catch (error) {
            console.error('Error verifying admin credentials:', error);
            return { success: false, message: 'Authentication error' };
        }
    },

    // Stats methods
    async getStats() {
        try {
            const [
                totalProducts,
                totalOrders,
                pendingOrders,
                completedOrders,
                totalCustomers,
                sentEmails,
                failedEmails
            ] = await Promise.all([
                mongoDB.collection('products').countDocuments(),
                mongoDB.collection('orders').countDocuments(),
                mongoDB.collection('orders').countDocuments({ status: 'pending' }),
                mongoDB.collection('orders').countDocuments({ status: 'completed' }),
                mongoDB.collection('customers').countDocuments(),
                mongoDB.collection('emails').countDocuments({ status: 'sent' }),
                mongoDB.collection('emails').countDocuments({ status: 'failed' })
            ]);

            // Calculate revenue from completed orders
            const revenueResult = await mongoDB.collection('orders')
                .aggregate([
                    { $match: { status: 'completed' } },
                    { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
                ])
                .toArray();
            
            const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

            return {
                totalRevenue,
                totalOrders,
                pendingOrders,
                completedOrders,
                totalProducts,
                totalCustomers,
                sentEmails,
                failedEmails,
                deliveryRate: sentEmails > 0 ? Math.round(((sentEmails - failedEmails) / sentEmails) * 100) : 0
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            return {
                totalRevenue: 0,
                totalOrders: 0,
                pendingOrders: 0,
                completedOrders: 0,
                totalProducts: 0,
                totalCustomers: 0,
                sentEmails: 0,
                failedEmails: 0,
                deliveryRate: 0
            };
        }
    }
};

// Close database connection
async function closeDB() {
    if (client) {
        await client.close();
        console.log('✅ MongoDB connection closed');
    }
}

module.exports = { connectDB, closeDB, db: dbOperations, ObjectId };