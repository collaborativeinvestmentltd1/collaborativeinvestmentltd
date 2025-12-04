// database.js - Enhanced with backup functionality
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const logger = require('./logger');

// MongoDB Configuration
const DB_NAME = 'cil_database';
const MONGODB_URI = process.env.MONGODB_URI; // Atlas only, no fallback
const MONGODB_BACKUP_PATH = process.env.MONGODB_BACKUP_PATH || './backups';

let client;
let db;

async function connectDB() {
    try {
        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            minPoolSize: 5
        });
        
        await client.connect();
        db = client.db(DB_NAME);
        
        // Create indexes for better performance
        await createIndexes();
        
        // Initialize collections if they don't exist
        await initializeCollections();
        
        logger.info('✅ MongoDB connected successfully');
        return db;
    } catch (error) {
        logger.error('❌ MongoDB connection failed:', error.message);
        throw error;
    }
}

async function createIndexes() {
    try {
        // Index for orders collection
        await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
        await db.collection('orders').createIndex({ createdAt: -1 });
        await db.collection('orders').createIndex({ customerPhone: 1 });
        await db.collection('orders').createIndex({ status: 1 });
        
        // Index for products collection
        await db.collection('products').createIndex({ category: 1 });
        await db.collection('products').createIndex({ price: 1 });
        
        // Index for emails collection
        await db.collection('emails').createIndex({ sentAt: -1 });
        await db.collection('emails').createIndex({ status: 1 });
        
        // Index for customers collection
        await db.collection('customers').createIndex({ email: 1 }, { unique: true, sparse: true });
        await db.collection('customers').createIndex({ phone: 1 }, { unique: true });
        
        logger.info('✅ Database indexes created successfully');
    } catch (error) {
        logger.error('❌ Failed to create indexes:', error.message);
    }
}

async function initializeCollections() {
    const collections = ['products', 'orders', 'customers', 'emails', 'campaigns', 'settings', 'backups'];
    
    for (const collectionName of collections) {
        const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
        if (!collectionExists) {
            await db.createCollection(collectionName);
            logger.info(`Created collection: ${collectionName}`);
        }
    }
    
    // Initialize admin user if not exists
    const adminExists = await db.collection('users').findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
        await db.collection('users').insertOne({
            email: process.env.ADMIN_EMAIL,
            password: await hashPassword(process.env.ADMIN_PASSWORD),
            role: 'admin',
            name: 'System Administrator',
            createdAt: new Date(),
            lastLogin: null
        });
        logger.info('✅ Admin user initialized');
    }
}

async function hashPassword(password) {
    // In production, use bcrypt
    // For now, simple hash for demo
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function verifyAdminCredentials(email, password) {
    try {
        const user = await db.collection('users').findOne({ email });
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }
        
        const hashedPassword = await hashPassword(password);
        if (user.password !== hashedPassword) {
            return { success: false, message: 'Invalid email or password' };
        }
        
        // Update last login
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );
        
        return {
            success: true,
            admin: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    } catch (error) {
        logger.error('Admin authentication error:', error);
        return { success: false, message: 'Authentication error' };
    }
}

// Database backup function - Optimized for Atlas
async function backupDatabase() {
    try {
        // Ensure backup folder exists
        if (!fs.existsSync(MONGODB_BACKUP_PATH)) {
            fs.mkdirSync(MONGODB_BACKUP_PATH, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(MONGODB_BACKUP_PATH, `backup-${timestamp}`);

        // Create timestamped backup directory
        fs.mkdirSync(backupDir, { recursive: true });

        // Backup command - only cil_database
        const command = `mongodump --uri="${MONGODB_URI}" --db="${DB_NAME}" --out="${backupDir}"`;

        logger.info(`Starting database backup to: ${backupDir}`);

        // Execute mongodump
        const { stdout, stderr } = await execPromise(command);

        if (stdout) logger.info(stdout);
        if (stderr) logger.warn(stderr);

        // Record backup in database
        await db.collection('backups').insertOne({
            path: backupDir,
            timestamp: new Date(),
            size: await getDirectorySize(backupDir),
            status: 'completed'
        });

        logger.info(`✅ Database backup completed: ${backupDir}`);

        // Cleanup old backups (keep last 7 days)
        await cleanupOldBackups();

        return { success: true, backupPath: backupDir };
    } catch (error) {
        logger.error('❌ Database backup failed:', error.message);

        await db.collection('backups').insertOne({
            timestamp: new Date(),
            status: 'failed',
            error: error.message
        });

        return { success: false, error: error.message };
    }
}


async function getDirectorySize(dir) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    let size = 0;
    
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            size += await getDirectorySize(filePath);
        } else {
            const stats = await fs.promises.stat(filePath);
            size += stats.size;
        }
    }
    
    return size;
}

async function cleanupOldBackups() {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const oldBackups = await db.collection('backups').find({
            timestamp: { $lt: sevenDaysAgo }
        }).toArray();
        
        for (const backup of oldBackups) {
            if (backup.path && fs.existsSync(backup.path)) {
                await fs.promises.rm(backup.path, { recursive: true, force: true });
                logger.info(`Cleaned up old backup: ${backup.path}`);
            }
            
            await db.collection('backups').deleteOne({ _id: backup._id });
        }
    } catch (error) {
        logger.error('Failed to cleanup old backups:', error.message);
    }
}

// Database operations
const database = {
    create: async (collection, data) => {
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const result = await db.collection(collection).insertOne(data);
        return { _id: result.insertedId, ...data };
    },
    
    find: async (collection, query = {}, sort = {}, limit = 0) => {
        let cursor = db.collection(collection).find(query);
        if (Object.keys(sort).length > 0) cursor = cursor.sort(sort);
        if (limit > 0) cursor = cursor.limit(limit);
        return await cursor.toArray();
    },
    
    findOne: async (collection, query) => {
        return await db.collection(collection).findOne(query);
    },
    
    update: async (collection, query, update, options = {}) => {
        update.$set = update.$set || {};
        update.$set.updatedAt = new Date();
        return await db.collection(collection).updateOne(query, update, options);
    },
    
    delete: async (collection, query) => {
        return await db.collection(collection).deleteOne(query);
    },
    
    getAll: async (collection, query = {}, sort = {}) => {
        return await db.collection(collection).find(query).sort(sort).toArray();
    },
    
    getStats: async () => {
        const [
            totalOrders,
            totalProducts,
            totalCustomers,
            pendingOrders,
            completedOrders,
            revenue
        ] = await Promise.all([
            db.collection('orders').countDocuments(),
            db.collection('products').countDocuments(),
            db.collection('customers').countDocuments(),
            db.collection('orders').countDocuments({ status: 'pending' }),
            db.collection('orders').countDocuments({ status: 'completed' }),
            db.collection('orders').aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]).toArray()
        ]);
        
        return {
            totalOrders,
            totalProducts,
            totalCustomers,
            pendingOrders,
            completedOrders,
            revenue: revenue.length > 0 ? revenue[0].total : 0
        };
    },
    
    getRecentEmails: async (limit = 50) => {
        return await db.collection('emails')
            .find()
            .sort({ sentAt: -1 })
            .limit(limit)
            .toArray();
    },
    
    verifyAdminCredentials,
    backupDatabase
};

async function closeDB() {
    try {
        if (client) {
            await client.close();
            logger.info('✅ MongoDB connection closed');
        }
    } catch (error) {
        logger.error('❌ Error closing MongoDB connection:', error.message);
    }
}

module.exports = {
    connectDB,
    db: database,
    closeDB,
    backupDatabase
};