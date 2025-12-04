// admin-db.js - Enhanced with email support and file persistence
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'admin-db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database with sample data if it doesn't exist
function initializeDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            products: [
                { id: 1, name: "Concrete Blocks", category: "construction", price: 300, unit: "per block", minOrder: 50,
                    image: "/img/construction/concrete-blocks.jpg", locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
                    description: "Durable concrete blocks for building construction", stock: "in-stock"
                },
                {
                    id: 2, name: "6-inch Concrete Blocks", category: "construction", price: 250, unit: "per block", minOrder: 100,
                    image: "/img/construction/6inch-blocks.jpg", locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
                    description: "High-quality 6-inch concrete blocks for construction", stock: "in-stock"
                },
                { id: 3, name: "Cement Bags", category: "construction", price: 3200, unit: "per bag", minOrder: 20,
                    image: "/img/construction/cement-bags.jpg", locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
                    description: "Premium cement bags for all construction needs", stock: "low-stock"
                }
            ],
            orders: [
                { id: 1, orderNumber: 'CIL-00001', customerName: 'John Doe', customerPhone: '+2348012345678', total: 15000, status: 'pending', timestamp: new Date().toISOString(), items: [
                    { name: 'Concrete Blocks', quantity: 50, price: 300 }
                ]}
            ],
            customers: [
                { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+2348012345678', orderCount: 3, totalSpent: 75000, type: 'retail', status: 'active' }
            ],
            emails: [],
            campaigns: [
                {
                    id: 1,
                    name: "Welcome Campaign",
                    status: "active",
                    sent: 45,
                    opened: 32,
                    clicked: 15,
                    createdAt: new Date().toISOString()
                }
            ],
            adminLogs: [],
            settings: {
                email: {
                    enabled: true,
                    service: 'gmail',
                    fromEmail: 'collaborativeinvestmentltd@gmail.com',
                    fromName: 'Collaborative Investment Ltd'
                },
                notifications: {
                    lowStock: true,
                    newOrder: true,
                    newCustomer: true
                }
            }
        };
        
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('✅ Database initialized with sample data');
    }
}

// Read database from file
function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            initializeDatabase();
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        // Return in-memory fallback
        return {
            products: [], orders: [], customers: [], emails: [], campaigns: [], adminLogs: [], settings: {}
        };
    }
}

// Write to database file
function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to database:', error);
        return false;
    }
}

// Enhanced database operations
const db = {
    // Get all items from a collection
    getAll(collection) {
        const data = readDB();
        return data[collection] || [];
    },

    // Get item by ID
    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id == id);
    },

    // Create new item
    create(collection, data) {
        const dbData = readDB();
        if (!dbData[collection]) dbData[collection] = [];
        
        const newItem = {
            id: dbData[collection].length > 0 ? Math.max(...dbData[collection].map(i => i.id)) + 1 : 1,
            createdAt: new Date().toISOString(),
            ...data
        };
        
        // Special handling for orders to generate order number
        if (collection === 'orders') {
            const orderPrefix = 'CIL-';
            const orderId = (dbData.orders.length + 1).toString().padStart(5, '0');
            newItem.orderNumber = `${orderPrefix}${orderId}`;
        }
        
        // Special handling for emails
        if (collection === 'emails') {
            newItem.messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            newItem.sentAt = new Date().toISOString();
        }
        
        dbData[collection].push(newItem);
        writeDB(dbData);
        
        // Add to admin logs
        this.addAdminLog(`${collection}.created`, `Created new ${collection.slice(0, -1)}: ${newItem.name || newItem.id}`);
        
        return newItem;
    },

    // Update item
    update(collection, id, updates) {
        const dbData = readDB();
        const items = dbData[collection] || [];
        const index = items.findIndex(item => item.id == id);
        
        if (index !== -1) {
            items[index] = { 
                ...items[index], 
                ...updates,
                updatedAt: new Date().toISOString()
            };
            writeDB(dbData);
            
            // Add to admin logs
            this.addAdminLog(`${collection}.updated`, `Updated ${collection.slice(0, -1)}: ${items[index].name || items[index].id}`);
            
            return items[index];
        }
        return null;
    },

    // Delete item
    delete(collection, id) {
        const dbData = readDB();
        const items = dbData[collection] || [];
        const index = items.findIndex(item => item.id == id);
        
        if (index !== -1) {
            const deletedItem = items.splice(index, 1)[0];
            writeDB(dbData);
            
            // Add to admin logs
            this.addAdminLog(`${collection}.deleted`, `Deleted ${collection.slice(0, -1)}: ${deletedItem.name || deletedItem.id}`);
            
            return deletedItem;
        }
        return null;
    },

    // Get stats
    getStats() {
        const orders = this.getAll('orders');
        const products = this.getAll('products');
        const customers = this.getAll('customers');
        const emails = this.getAll('emails');

        const totalRevenue = orders
            .filter(o => o.status === 'completed' || o.status === 'confirmed')
            .reduce((sum, order) => sum + (order.total || 0), 0);
            
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const lowStockProducts = products.filter(p => p.stock === 'low-stock').length;
        
        const sentEmails = emails.length;
        const deliveredEmails = emails.filter(e => e.status === 'sent').length;
        const failedEmails = emails.filter(e => e.status === 'failed').length;
        const deliveryRate = sentEmails > 0 ? Math.round((deliveredEmails / sentEmails) * 100) : 0;

        return {
            totalRevenue,
            totalOrders: orders.length,
            pendingOrders,
            completedOrders,
            totalProducts: products.length,
            lowStockProducts,
            totalCustomers: customers.length,
            sentEmails,
            deliveryRate,
            failedEmails
        };
    },

    // Email-specific methods
    createEmail(emailData) {
        return this.create('emails', emailData);
    },

    getRecentEmails(limit = 50) {
        const emails = this.getAll('emails');
        return emails
            .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
            .slice(0, limit);
    },

    getEmailCampaigns() {
        return this.getAll('campaigns');
    },

    // Admin logging
    addAdminLog(action, description) {
        const log = {
            id: Date.now(),
            action,
            description,
            timestamp: new Date().toISOString(),
            adminId: 1 // This would come from session in real implementation
        };
        
        const dbData = readDB();
        if (!dbData.adminLogs) dbData.adminLogs = [];
        dbData.adminLogs.unshift(log);
        
        // Keep only last 1000 logs
        if (dbData.adminLogs.length > 1000) {
            dbData.adminLogs = dbData.adminLogs.slice(0, 1000);
        }
        
        writeDB(dbData);
    },

    // Settings management
    getSettings() {
        const dbData = readDB();
        return dbData.settings || {};
    },

    updateSettings(newSettings) {
        const dbData = readDB();
        dbData.settings = { ...dbData.settings, ...newSettings };
        writeDB(dbData);
        return dbData.settings;
    }
};

// Initialize database on first run
initializeDatabase();

module.exports = db;