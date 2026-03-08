// database-local.js - JSON file-based database
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Collection file paths
const COLLECTIONS = {
    users: path.join(DATA_DIR, 'users.json'),
    customers: path.join(DATA_DIR, 'customers.json'),
    investors: path.join(DATA_DIR, 'investors.json'),
    admins: path.join(DATA_DIR, 'admins.json'),
    orders: path.join(DATA_DIR, 'orders.json'),
    products: path.join(DATA_DIR, 'products.json'),
    emails: path.join(DATA_DIR, 'emails.json'),
    investments: path.join(DATA_DIR, 'investments.json'),
    payments: path.join(DATA_DIR, 'payments.json'),
    notifications: path.join(DATA_DIR, 'notifications.json'),
    user_activity: path.join(DATA_DIR, 'user_activity.json'),
    emergency_logs: path.join(DATA_DIR, 'emergency_logs.json'),
    kyc_verifications: path.join(DATA_DIR, 'kyc_verifications.json'),
    kyc_documents: path.join(DATA_DIR, 'kyc_documents.json'),
    admin_audit_log: path.join(DATA_DIR, 'admin_audit_log.json'),
    payment_transactions: path.join(DATA_DIR, 'payment_transactions.json'),
    bank_accounts: path.join(DATA_DIR, 'bank_accounts.json'),
    investment_portfolios: path.join(DATA_DIR, 'investment_portfolios.json'),
    customer_preferences: path.join(DATA_DIR, 'customer_preferences.json'),
    investor_preferences: path.join(DATA_DIR, 'investor_preferences.json'),
    sms_notifications: path.join(DATA_DIR, 'sms_notifications.json'),
    email_templates: path.join(DATA_DIR, 'email_templates.json'),
    backup_logs: path.join(DATA_DIR, 'backup_logs.json'),
    admin_review_tasks: path.join(DATA_DIR, 'admin_review_tasks.json'),
    tier_access: path.join(DATA_DIR, 'tier_access.json'),
    auto_verification_logs: path.join(DATA_DIR, 'auto_verification_logs.json'),
    campaigns: path.join(DATA_DIR, 'campaigns.json')
};

// Initialize collections
function initializeCollections() {
    Object.values(COLLECTIONS).forEach(filePath => {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
    });
    
    // Initialize default admin
    initializeDefaultAdmin();
    
    // Initialize tier access
    initializeTierAccess();
    
    // Initialize email templates
    initializeEmailTemplates();
    
    console.log('✅ Local database initialized');
}

// Read collection
function readCollection(name) {
    try {
        const filePath = COLLECTIONS[name];
        if (!filePath) {
            console.error(`Collection ${name} not found`);
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading collection ${name}:`, error.message);
        return [];
    }
}

// Write collection
function writeCollection(name, data) {
    try {
        const filePath = COLLECTIONS[name];
        if (!filePath) {
            console.error(`Collection ${name} not found`);
            return false;
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing collection ${name}:`, error.message);
        return false;
    }
}

// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Generate ObjectId-like string
function generateObjectId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const random = crypto.randomBytes(5).toString('hex');
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    return timestamp + random + counter;
}

// Check if string looks like an ObjectId
function isValidObjectId(id) {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
}

// Initialize default admin
async function initializeDefaultAdmin() {
    const admins = readCollection('admins');
    
    if (admins.length === 0) {
        const hashedPassword = await bcrypt.hash('Admin@123', 12);
        
        const defaultAdmin = {
            _id: generateObjectId(),
            email: 'admin@cil.com',
            password: hashedPassword,
            role: 'super_admin',
            isActive: true,
            name: 'System Administrator',
            permissions: ['all'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        admins.push(defaultAdmin);
        writeCollection('admins', admins);
        console.log('🔐 Default Admin Created → admin@cil.com / Admin@123');
        console.log('⚠️ CHANGE DEFAULT PASSWORD IMMEDIATELY!');
    }
}

// Initialize tier access
function initializeTierAccess() {
    const tiers = readCollection('tier_access');
    
    if (tiers.length === 0) {
        const defaultTiers = [
            {
                _id: generateObjectId(),
                tierName: 'basic',
                level: 1,
                name: 'Basic Tier',
                description: 'Limited access for unverified users',
                features: [
                    'View basic dashboard',
                    'Browse products (limited)',
                    'Basic profile management',
                    'Email notifications only'
                ],
                restrictions: [
                    'No investments',
                    'No withdrawals',
                    'No KYC access',
                    'Limited transaction history'
                ],
                kycRequired: false,
                minVerification: 'email',
                maxDailyDeposit: 0,
                maxDailyWithdrawal: 0,
                maxInvestmentAmount: 0,
                createdAt: new Date().toISOString()
            },
            {
                _id: generateObjectId(),
                tierName: 'email_verified',
                level: 2,
                name: 'Email Verified',
                description: 'Access for email-verified users',
                features: [
                    'Full dashboard access',
                    'Browse all products',
                    'Complete profile management',
                    'Email & SMS notifications',
                    'Basic investment browsing',
                    'View transaction history'
                ],
                restrictions: [
                    'No investment transactions',
                    'No withdrawals',
                    'KYC required for full access'
                ],
                kycRequired: false,
                minVerification: 'email',
                maxDailyDeposit: 50000,
                maxDailyWithdrawal: 0,
                maxInvestmentAmount: 0,
                createdAt: new Date().toISOString()
            },
            {
                _id: generateObjectId(),
                tierName: 'phone_verified',
                level: 3,
                name: 'Phone Verified',
                description: 'Access for phone-verified users',
                features: [
                    'Full dashboard access',
                    'Browse all products',
                    'Complete profile management',
                    'Email & SMS notifications',
                    'Basic investment browsing',
                    'View transaction history',
                    'Basic deposit capabilities'
                ],
                restrictions: [
                    'Limited investment transactions',
                    'No withdrawals',
                    'KYC required for full access'
                ],
                kycRequired: false,
                minVerification: 'phone',
                maxDailyDeposit: 100000,
                maxDailyWithdrawal: 0,
                maxInvestmentAmount: 1000000,
                createdAt: new Date().toISOString()
            },
            {
                _id: generateObjectId(),
                tierName: 'fully_verified',
                level: 4,
                name: 'Fully Verified',
                description: 'Full access for email & phone verified users',
                features: [
                    'Full dashboard access',
                    'Complete profile management',
                    'Email & SMS notifications',
                    'Complete investment access',
                    'Transaction capabilities',
                    'Withdrawal capabilities',
                    'Priority support',
                    'Advanced analytics'
                ],
                restrictions: [
                    'KYC required for large transactions',
                    'Enhanced verification for high amounts'
                ],
                kycRequired: false,
                minVerification: 'both',
                maxDailyDeposit: 500000,
                maxDailyWithdrawal: 200000,
                maxInvestmentAmount: 5000000,
                createdAt: new Date().toISOString()
            },
            {
                _id: generateObjectId(),
                tierName: 'kyc_verified',
                level: 5,
                name: 'KYC Verified',
                description: 'Full access with KYC verification',
                features: [
                    'All features from Fully Verified tier',
                    'Unlimited investment access',
                    'Full transaction history',
                    'Advanced reporting',
                    'Dedicated account manager (for investors)',
                    'Priority customer support',
                    'Early access to new features'
                ],
                restrictions: [],
                kycRequired: true,
                minVerification: 'both',
                maxDailyDeposit: 10000000,
                maxDailyWithdrawal: 5000000,
                maxInvestmentAmount: 50000000,
                createdAt: new Date().toISOString()
            },
            {
                _id: generateObjectId(),
                tierName: 'investor_premium',
                level: 6,
                name: 'Investor Premium',
                description: 'Premium access for verified investors',
                features: [
                    'All features from KYC Verified tier',
                    'Minimum ₦5,000,000 investment access',
                    'Personal investment advisor',
                    'Monthly portfolio reviews',
                    'Exclusive investment opportunities',
                    'Priority deal flow',
                    'VIP events access',
                    '24/7 dedicated support'
                ],
                restrictions: [],
                kycRequired: true,
                minVerification: 'both',
                minInvestment: 5000000,
                maxDailyDeposit: 50000000,
                maxDailyWithdrawal: 20000000,
                maxInvestmentAmount: 100000000,
                createdAt: new Date().toISOString()
            }
        ];
        
        writeCollection('tier_access', defaultTiers);
        console.log('✅ Tier access initialized');
    }
}

// Initialize email templates
function initializeEmailTemplates() {
    const templates = readCollection('email_templates');
    
    if (templates.length === 0) {
        const defaultTemplates = [
            {
                _id: generateObjectId(),
                templateName: 'welcome_customer',
                templateType: 'welcome',
                subject: 'Welcome to CIL - Your Customer Account is Ready!',
                html: `<!DOCTYPE html>...`, // Truncated for brevity
                text: `Welcome to CIL...`, // Truncated for brevity
                variables: ['firstName', 'email', 'dashboardLink'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                _id: generateObjectId(),
                templateName: 'welcome_investor',
                templateType: 'welcome',
                subject: 'Welcome to CIL - Your Investor Journey Begins!',
                html: `<!DOCTYPE html>...`, // Truncated for brevity
                text: `Welcome to CIL...`, // Truncated for brevity
                variables: ['firstName', 'investorId', 'email', 'dashboardLink'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        writeCollection('email_templates', defaultTemplates);
        console.log('✅ Email templates initialized');
    }
}

// Database operations object
const db = {
    collection(name) {
        return {
            find: (query = {}) => ({
                toArray: () => {
                    const data = readCollection(name);
                    return db.filterDocuments(data, query);
                },
                sort: (sortObj) => ({
                    toArray: () => {
                        const data = readCollection(name);
                        const filtered = db.filterDocuments(data, query);
                        return db.sortDocuments(filtered, sortObj);
                    }
                }),
                limit: (limit) => ({
                    toArray: () => {
                        const data = readCollection(name);
                        const filtered = db.filterDocuments(data, query);
                        const sorted = db.sortDocuments(filtered, {});
                        return sorted.slice(0, limit);
                    }
                })
            }),
            findOne: (query) => {
                const data = readCollection(name);
                const filtered = db.filterDocuments(data, query);
                return filtered.length > 0 ? filtered[0] : null;
            },
            insertOne: (doc) => {
                const data = readCollection(name);
                const newDoc = { 
                    ...doc, 
                    _id: generateObjectId(),
                    createdAt: doc.createdAt || new Date().toISOString(),
                    updatedAt: doc.updatedAt || new Date().toISOString()
                };
                data.push(newDoc);
                writeCollection(name, data);
                return { insertedId: newDoc._id };
            },
            insertMany: (docs) => {
                const data = readCollection(name);
                const newDocs = docs.map(doc => ({
                    ...doc,
                    _id: generateObjectId(),
                    createdAt: doc.createdAt || new Date().toISOString(),
                    updatedAt: doc.updatedAt || new Date().toISOString()
                }));
                data.push(...newDocs);
                writeCollection(name, data);
                return { insertedCount: newDocs.length };
            },
            updateOne: (filter, update) => {
                const data = readCollection(name);
                const index = data.findIndex(doc => db.matchesFilter(doc, filter));
                
                if (index === -1) return { modifiedCount: 0 };
                
                const doc = data[index];
                
                if (update.$set) {
                    Object.assign(doc, update.$set);
                }
                
                if (update.$push) {
                    Object.entries(update.$push).forEach(([key, value]) => {
                        if (!doc[key]) doc[key] = [];
                        doc[key].push(value);
                    });
                }
                
                doc.updatedAt = new Date().toISOString();
                data[index] = doc;
                writeCollection(name, data);
                
                return { modifiedCount: 1 };
            },
            updateMany: (filter, update) => {
                const data = readCollection(name);
                let modifiedCount = 0;
                
                data.forEach((doc, index) => {
                    if (db.matchesFilter(doc, filter)) {
                        if (update.$set) {
                            Object.assign(doc, update.$set);
                        }
                        if (update.$push) {
                            Object.entries(update.$push).forEach(([key, value]) => {
                                if (!doc[key]) doc[key] = [];
                                doc[key].push(value);
                            });
                        }
                        doc.updatedAt = new Date().toISOString();
                        data[index] = doc;
                        modifiedCount++;
                    }
                });
                
                writeCollection(name, data);
                return { modifiedCount };
            },
            deleteOne: (filter) => {
                const data = readCollection(name);
                const newData = data.filter(doc => !db.matchesFilter(doc, filter));
                const deletedCount = data.length - newData.length;
                writeCollection(name, newData);
                return { deletedCount };
            },
            deleteMany: (filter) => {
                const data = readCollection(name);
                const newData = data.filter(doc => !db.matchesFilter(doc, filter));
                const deletedCount = data.length - newData.length;
                writeCollection(name, newData);
                return { deletedCount };
            },
            countDocuments: (query = {}) => {
                const data = readCollection(name);
                const filtered = db.filterDocuments(data, query);
                return filtered.length;
            }
        };
    },
    
    matchesFilter(doc, filter) {
        if (!filter) return true;
        
        return Object.entries(filter).every(([key, value]) => {
            if (key === '_id' && typeof value === 'string') {
                return doc._id === value;
            }
            return doc[key] === value;
        });
    },
    
    filterDocuments(data, query) {
        if (!query || Object.keys(query).length === 0) return data;
        
        return data.filter(doc => {
            return Object.entries(query).every(([key, value]) => {
                if (key === '$or' && Array.isArray(value)) {
                    return value.some(condition => db.matchesFilter(doc, condition));
                }
                if (key === '$and' && Array.isArray(value)) {
                    return value.every(condition => db.matchesFilter(doc, condition));
                }
                if (key.startsWith('$')) return true;
                
                if (typeof value === 'object' && value !== null) {
                    if (value.$regex) {
                        const regex = new RegExp(value.$regex, value.$options || '');
                        return regex.test(doc[key]);
                    }
                    if (value.$in && Array.isArray(value.$in)) {
                        return value.$in.includes(doc[key]);
                    }
                }
                
                return doc[key] === value;
            });
        });
    },
    
    sortDocuments(data, sortObj) {
        if (!sortObj || Object.keys(sortObj).length === 0) return data;
        
        return [...data].sort((a, b) => {
            for (const [key, order] of Object.entries(sortObj)) {
                if (order === 1 || order === -1) {
                    if (a[key] < b[key]) return order === 1 ? -1 : 1;
                    if (a[key] > b[key]) return order === 1 ? 1 : -1;
                }
            }
            return 0;
        });
    },
    
    toObjectId(id) {
        return id;
    },
    
    isValidObjectId(id) {
        return typeof id === 'string' && id.length > 0;
    },
    
    // Helper methods
    async create(col, data) {
        const result = this.collection(col).insertOne(data);
        return { _id: result.insertedId, ...data };
    },
    
    async getAll(col, query = {}, sort = {}, limit = 0) {
        let cursor = this.collection(col).find(query);
        if (Object.keys(sort).length) {
            cursor = cursor.sort(sort);
        }
        let results = await cursor.toArray();
        if (limit) {
            results = results.slice(0, limit);
        }
        return results;
    },
    
    async getOne(col, query) {
        return this.collection(col).findOne(query);
    },
    
    async getById(col, id) {
        return this.collection(col).findOne({ _id: id });
    },
    
    async update(col, query, update) {
        const result = this.collection(col).updateOne(query, { $set: update });
        return result.modifiedCount > 0;
    },
    
    async updateWithOperators(col, query, operators) {
        const result = this.collection(col).updateOne(query, operators);
        return result.modifiedCount > 0;
    },
    
    async count(col, query = {}) {
        return this.collection(col).countDocuments(query);
    },
    
    async delete(col, query) {
        const result = this.collection(col).deleteOne(query);
        return result.deletedCount > 0;
    },
    
    async findAndUpdate(col, query, update) {
        const data = this.collection(col).findOne(query);
        if (data) {
            await this.update(col, query, update);
            return { ...data, ...update, updatedAt: new Date().toISOString() };
        }
        return null;
    },
    
    // Admin authentication
    async verifyAdminCredentials(email, password) {
        const admin = await this.collection('admins').findOne({ 
            email: email.toLowerCase(),
            isActive: true 
        });
        
        if (!admin) {
            return { success: false, message: 'Invalid credentials' };
        }
        
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return { success: false, message: 'Invalid credentials' };
        }
        
        // Update last login
        await this.collection('admins').updateOne(
            { _id: admin._id },
            { $set: { lastLogin: new Date().toISOString() } }
        );
        
        const { password: _, ...safeAdmin } = admin;
        return { success: true, admin: safeAdmin };
    },
    
    // Order tracking
    async getOrderByNumber(orderNumber) {
        return this.collection('orders').findOne({
            orderNumber: { $regex: new RegExp(`^${orderNumber}$`, 'i') }
        });
    },
    
    // Email logging
    async logEmail(to, subject, body, status = 'sent', type = 'transactional') {
        await this.collection('emails').insertOne({
            to,
            subject,
            body,
            status,
            type,
            sentAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        });
    },
    
    async getRecentEmails(limit = 50) {
        return this.getAll('emails', {}, { sentAt: -1 }, limit);
    },
    
    // Stats
    async getStats() {
        const orders = await this.count('orders');
        const products = await this.count('products');
        const customers = await this.count('customers');
        const emails = await this.count('emails');
        const users = await this.count('users');
        const investors = await this.count('investors');
        const payments = await this.count('payments', { status: 'completed' });
        
        const recentUsers = await this.getAll('users', {}, { createdAt: -1 }, 10);
        const activeInvestments = await this.count('investments', { status: 'active' });
        
        return {
            orders,
            products,
            customers,
            emails,
            users,
            investors,
            payments,
            activeInvestments,
            recentUsers: recentUsers.map(user => ({
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email,
                accountType: user.accountType,
                createdAt: user.createdAt
            })),
            generatedAt: new Date().toISOString()
        };
    }
};

// Connect function (simulated)
async function connectDB() {
    initializeCollections();
    console.log('✅ Local database connected');
    return db;
}

async function closeDB() {
    console.log('🔌 Local database closed');
}

// Backup function (simulated)
async function backupDatabase() {
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    
    const backup = {};
    Object.keys(COLLECTIONS).forEach(col => {
        backup[col] = readCollection(col);
    });
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`✅ Backup created: ${backupFile}`);
    
    return {
        success: true,
        message: 'Backup completed',
        backupPath: backupFile
    };
}

// List backups
async function listBackups() {
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
        return { success: true, backups: [] };
    }
    
    const files = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .map(f => ({
            name: f,
            path: path.join(backupDir, f),
            size: fs.statSync(path.join(backupDir, f)).size,
            created: fs.statSync(path.join(backupDir, f)).birthtime
        }))
        .sort((a, b) => b.created - a.created);
    
    return { success: true, backups: files };
}

// Restore backup
async function restoreBackup(backupName) {
    const backupFile = path.join(__dirname, 'backups', backupName);
    
    if (!fs.existsSync(backupFile)) {
        return { success: false, message: 'Backup not found' };
    }
    
    try {
        const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
        
        Object.entries(backup).forEach(([col, data]) => {
            if (COLLECTIONS[col]) {
                writeCollection(col, data);
            }
        });
        
        console.log(`✅ Restored from backup: ${backupName}`);
        return { success: true, message: 'Restore completed' };
    } catch (error) {
        console.error('Restore failed:', error);
        return { success: false, message: 'Restore failed', error: error.message };
    }
}

// Initialize on load
initializeCollections();

module.exports = {
    connectDB,
    closeDB,
    db,
    ObjectId: { isValid: isValidObjectId },
    backupDatabase,
    listBackups,
    restoreBackup,
    authenticateUser: async (email, password) => {
        // Legacy authentication function
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (!user) return null;
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;
        
        const { password: _, ...safeUser } = user;
        return safeUser;
    },
    createUser: async (userData) => {
        // Legacy create user function
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = {
            ...userData,
            email: userData.email.toLowerCase(),
            password: hashedPassword,
            userId: `CIL-${userData.accountType?.toUpperCase() || 'USER'}-${Date.now().toString().slice(-8)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const result = await db.collection('users').insertOne(user);
        return { ...user, _id: result.insertedId };
    }
};