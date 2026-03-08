<<<<<<< HEAD
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

/* =========================================================
   ENV CONFIG - ONLY ACCESS THROUGH process.env
========================================================= */

// Remove hardcoded MongoDB URL - Only use from environment variables
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME || "cil_database";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, "backup", "cil_database");

// Validate environment variables
if (!MONGODB_URL) {
    console.error("❌ ERROR: MONGODB_URL environment variable is required");
    console.error("Please add MONGODB_URL to your .env file");
    process.exit(1);
}

let client;
let database;

/* =========================================================
   CONNECT / CLOSE
========================================================= */

async function connectDB() {
    if (database) return database;

    console.log("🔗 Connecting to MongoDB...");
    
    client = new MongoClient(MONGODB_URL, {
        maxPoolSize: 20,
        connectTimeoutMS: 15000,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        tls: process.env.MONGODB_TLS === 'true',
        retryWrites: true,
        w: 'majority'
    });

    try {
        await client.connect();
        database = client.db(DB_NAME);
        
        console.log(`✅ MongoDB Connected Successfully → DB: ${DB_NAME}`);
        await initializeCollections();
        
        return database;
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        console.error("Please check your MONGODB_URL in .env file");
        process.exit(1);
    }
}

async function closeDB() {
    if (client) {
        await client.close();
        console.log("🔌 MongoDB Connection Closed");
    }
}

/* =========================================================
   BACKUP DATABASE FUNCTION
========================================================= */

async function backupDatabase() {
    try {
        console.log("📦 Starting database backup...");
        
        // Create backup directory if it doesn't exist
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            console.log(`✅ Created backup directory: ${BACKUP_DIR}`);
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `cil_backup_${timestamp}`;
        const backupPath = path.join(BACKUP_DIR, backupName);
        
        console.log(`📁 Backup location: ${backupPath}`);
        
        // Extract connection details from MONGODB_URL
        const url = new URL(MONGODB_URL);
        const host = url.hostname;
        const port = url.port || 27017;
        const username = url.username;
        const password = url.password;
        const database = url.pathname.substring(1) || DB_NAME;
        
        // Build mongodump command
        const args = [
            '--host', host,
            '--port', port.toString(),
            '--db', database,
            '--out', backupPath,
            '--gzip'
        ];
        
        // Add authentication if provided
        if (username && password) {
            args.push('--username', username);
            args.push('--password', password);
            args.push('--authenticationDatabase', 'admin');
        }
        
        // Add SSL/TLS if enabled
        if (process.env.MONGODB_TLS === 'true') {
            args.push('--ssl');
        }
        
        console.log("🚀 Running mongodump command...");
        
        // Execute mongodump
        const mongodump = spawn('mongodump', args);
        
        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';
            
            mongodump.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log(`📤 mongodump stdout: ${data.toString().trim()}`);
            });
            
            mongodump.stderr.on('data', (data) => {
                stderr += data.toString();
                console.error(`📥 mongodump stderr: ${data.toString().trim()}`);
            });
            
            mongodump.on('close', async (code) => {
                if (code === 0) {
                    console.log(`✅ Database backup completed successfully`);
                    console.log(`📁 Backup saved to: ${backupPath}`);
                    
                    // Create a backup manifest file
                    const manifest = {
                        backupName: backupName,
                        database: database,
                        timestamp: new Date().toISOString(),
                        size: await getBackupSize(backupPath),
                        collections: await getBackupCollections(backupPath),
                        status: 'completed'
                    };
                    
                    const manifestPath = path.join(backupPath, 'backup_manifest.json');
                    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
                    
                    console.log(`📄 Backup manifest created: ${manifestPath}`);
                    
                    // Clean up old backups (keep last 7 days)
                    await cleanupOldBackups();
                    
                    resolve({
                        success: true,
                        message: 'Database backup completed successfully',
                        backupPath: backupPath,
                        backupName: backupName,
                        timestamp: new Date().toISOString(),
                        size: manifest.size
                    });
                } else {
                    console.error(`❌ mongodump failed with code ${code}`);
                    reject({
                        success: false,
                        message: `Backup failed with code ${code}`,
                        error: stderr
                    });
                }
            });
            
            mongodump.on('error', (error) => {
                console.error(`❌ Failed to start mongodump: ${error.message}`);
                reject({
                    success: false,
                    message: `Failed to start backup process: ${error.message}`,
                    error: error.message
                });
            });
        });
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        return {
            success: false,
            message: 'Backup failed',
            error: error.message
        };
    }
}

async function getBackupSize(backupPath) {
    try {
        let totalSize = 0;
        
        function getSize(dir) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const itemPath = path.join(dir, item);
                const stats = fs.statSync(itemPath);
                if (stats.isDirectory()) {
                    getSize(itemPath);
                } else {
                    totalSize += stats.size;
                }
            });
        }
        
        getSize(backupPath);
        return formatBytes(totalSize);
    } catch (error) {
        return 'Unknown';
    }
}

async function getBackupCollections(backupPath) {
    try {
        const collections = [];
        const dbPath = path.join(backupPath, DB_NAME);
        
        if (fs.existsSync(dbPath)) {
            const items = fs.readdirSync(dbPath);
            items.forEach(item => {
                if (item.endsWith('.bson.gz') || item.endsWith('.bson')) {
                    collections.push(item.replace(/\.(bson\.gz|bson)$/, ''));
                }
            });
        }
        
        return collections;
    } catch (error) {
        return [];
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function cleanupOldBackups() {
    try {
        console.log("🧹 Cleaning up old backups...");
        
        const maxBackupAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const now = Date.now();
        
        const backupDirs = fs.readdirSync(BACKUP_DIR)
            .filter(dir => dir.startsWith('cil_backup_'))
            .map(dir => ({
                name: dir,
                path: path.join(BACKUP_DIR, dir),
                time: fs.statSync(path.join(BACKUP_DIR, dir)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time); // Sort by newest first
        
        // Keep the 10 most recent backups as a safety measure
        const backupsToKeep = backupDirs.slice(0, 10);
        const backupsToDelete = backupDirs.slice(10);
        
        // Also delete backups older than 7 days
        const oldBackups = backupDirs.filter(backup => (now - backup.time) > maxBackupAge);
        
        const allBackupsToDelete = [...new Set([...backupsToDelete, ...oldBackups])];
        
        for (const backup of allBackupsToDelete) {
            try {
                fs.rmSync(backup.path, { recursive: true, force: true });
                console.log(`🗑️  Deleted old backup: ${backup.name}`);
            } catch (error) {
                console.error(`❌ Failed to delete backup ${backup.name}:`, error.message);
            }
        }
        
        console.log(`✅ Cleanup completed. Kept ${backupsToKeep.length} recent backups.`);
        
    } catch (error) {
        console.error('❌ Error cleaning up old backups:', error.message);
    }
}

async function listBackups() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            return { success: true, backups: [], message: 'No backup directory found' };
        }
        
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(dir => dir.startsWith('cil_backup_'))
            .map(dir => {
                const backupPath = path.join(BACKUP_DIR, dir);
                const manifestPath = path.join(backupPath, 'backup_manifest.json');
                const stats = fs.statSync(backupPath);
                
                let manifest = {};
                if (fs.existsSync(manifestPath)) {
                    try {
                        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    } catch (error) {
                        console.error(`Error reading manifest for ${dir}:`, error.message);
                    }
                }
                
                return {
                    name: dir,
                    path: backupPath,
                    size: manifest.size || 'Unknown',
                    timestamp: manifest.timestamp || stats.mtime.toISOString(),
                    collections: manifest.collections || [],
                    status: manifest.status || 'unknown'
                };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first
        
        return {
            success: true,
            backups: backups,
            total: backups.length,
            backupDir: BACKUP_DIR
        };
        
    } catch (error) {
        console.error('❌ Error listing backups:', error.message);
        return {
            success: false,
            message: 'Error listing backups',
            error: error.message
        };
    }
}

async function restoreBackup(backupName) {
    try {
        console.log(`🔄 Starting restore from backup: ${backupName}`);
        
        const backupPath = path.join(BACKUP_DIR, backupName);
        const dbPath = path.join(backupPath, DB_NAME);
        
        if (!fs.existsSync(backupPath)) {
            return {
                success: false,
                message: `Backup ${backupName} not found`
            };
        }
        
        if (!fs.existsSync(dbPath)) {
            return {
                success: false,
                message: `Database backup not found in ${backupName}`
            };
        }
        
        // Extract connection details from MONGODB_URL
        const url = new URL(MONGODB_URL);
        const host = url.hostname;
        const port = url.port || 27017;
        const username = url.username;
        const password = url.password;
        const database = url.pathname.substring(1) || DB_NAME;
        
        // Build mongorestore command
        const args = [
            '--host', host,
            '--port', port.toString(),
            '--db', database,
            '--drop', // Drop existing collections before restore
            path.join(dbPath, ''),
            '--gzip'
        ];
        
        // Add authentication if provided
        if (username && password) {
            args.push('--username', username);
            args.push('--password', password);
            args.push('--authenticationDatabase', 'admin');
        }
        
        // Add SSL/TLS if enabled
        if (process.env.MONGODB_TLS === 'true') {
            args.push('--ssl');
        }
        
        console.log("🚀 Running mongorestore command...");
        
        // Execute mongorestore
        const mongorestore = spawn('mongorestore', args);
        
        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';
            
            mongorestore.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log(`📤 mongorestore stdout: ${data.toString().trim()}`);
            });
            
            mongorestore.stderr.on('data', (data) => {
                stderr += data.toString();
                console.error(`📥 mongorestore stderr: ${data.toString().trim()}`);
            });
            
            mongorestore.on('close', (code) => {
                if (code === 0) {
                    console.log(`✅ Database restore completed successfully from ${backupName}`);
                    resolve({
                        success: true,
                        message: `Database restored successfully from ${backupName}`,
                        backup: backupName,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    console.error(`❌ mongorestore failed with code ${code}`);
                    reject({
                        success: false,
                        message: `Restore failed with code ${code}`,
                        error: stderr
                    });
                }
            });
            
            mongorestore.on('error', (error) => {
                console.error(`❌ Failed to start mongorestore: ${error.message}`);
                reject({
                    success: false,
                    message: `Failed to start restore process: ${error.message}`,
                    error: error.message
                });
            });
        });
        
    } catch (error) {
        console.error('❌ Restore failed:', error.message);
        return {
            success: false,
            message: 'Restore failed',
            error: error.message
        };
    }
}

/* =========================================================
   COLLECTION INITIALIZATION
========================================================= */

async function initializeCollections() {
    try {
        // Create collections if they don't exist
        const collections = [
            'users',
            'customers',
            'investors',
            'admins',
            'orders',
            'products',
            'emails',
            'investments',
            'payments',
            'notifications',
            'user_activity',
            'emergency_logs',
            'kyc_verifications',
            'kyc_documents',
            'admin_review_tasks',
            'email_verifications',
            'phone_verifications',
            'admin_audit_log',
            'tier_access',
            'payment_transactions',
            'bank_accounts',
            'investment_portfolios',
            'customer_preferences',
            'investor_preferences',
            'welcome_messages',
            'auto_verification_logs',
            'sms_notifications',
            'email_templates',
            'backup_logs'
        ];

        for (const colName of collections) {
            const collectionsList = await database.listCollections({ name: colName }).toArray();
            if (collectionsList.length === 0) {
                await database.createCollection(colName);
                console.log(`✅ Created collection: ${colName}`);
            }
        }

        // Create indexes
        await createIndexes();
        
        // Initialize default admin
        await initializeDefaultAdmin();
        
        // Initialize default tier access levels
        await initializeTierAccess();
        
        // Initialize email templates
        await initializeEmailTemplates();
        
    } catch (error) {
        console.error("Error initializing collections:", error.message);
    }
}

async function createIndexes() {
    const indexes = [
        // Users indexes
        { collection: 'users', index: { email: 1 }, options: { unique: true } },
        { collection: 'users', index: { phone: 1 }, options: { unique: true } },
        { collection: 'users', index: { userId: 1 }, options: { unique: true } },
        { collection: 'users', index: { verificationToken: 1 }, options: { sparse: true } },
        { collection: 'users', index: { accountType: 1 } },
        { collection: 'users', index: { kycStatus: 1 } },
        { collection: 'users', index: { tierLevel: 1 } },
        { collection: 'users', index: { createdAt: -1 } },
        
        // Customers indexes
        { collection: 'customers', index: { email: 1 }, options: { unique: true } },
        { collection: 'customers', index: { phone: 1 }, options: { unique: true } },
        { collection: 'customers', index: { userId: 1 }, options: { unique: true } },
        
        // Investors indexes
        { collection: 'investors', index: { email: 1 }, options: { unique: true } },
        { collection: 'investors', index: { phone: 1 }, options: { unique: true } },
        { collection: 'investors', index: { userId: 1 }, options: { unique: true } },
        { collection: 'investors', index: { investorId: 1 }, options: { unique: true } },
        { collection: 'investors', index: { accreditationStatus: 1 } },
        { collection: 'investors', index: { kycStatus: 1 } },
        
        // Orders indexes
        { collection: 'orders', index: { orderNumber: 1 }, options: { unique: true } },
        { collection: 'orders', index: { customerEmail: 1 } },
        { collection: 'orders', index: { customerPhone: 1 } },
        { collection: 'orders', index: { status: 1 } },
        { collection: 'orders', index: { createdAt: -1 } },
        
        // Payments indexes
        { collection: 'payments', index: { paymentReference: 1 }, options: { unique: true } },
        { collection: 'payments', index: { userId: 1 } },
        { collection: 'payments', index: { status: 1 } },
        { collection: 'payments', index: { paymentMethod: 1 } },
        { collection: 'payments', index: { createdAt: -1 } },
        
        // KYC indexes
        { collection: 'kyc_verifications', index: { userId: 1 }, options: { unique: true } },
        { collection: 'kyc_verifications', index: { status: 1 } },
        { collection: 'kyc_verifications', index: { submittedAt: -1 } },
        
        // Email verifications
        { collection: 'email_verifications', index: { email: 1, token: 1 }, options: { unique: true } },
        { collection: 'email_verifications', index: { expiresAt: 1 } },
        
        // Phone verifications
        { collection: 'phone_verifications', index: { phone: 1, code: 1 }, options: { unique: true } },
        { collection: 'phone_verifications', index: { expiresAt: 1 } },
        
        // Notifications
        { collection: 'notifications', index: { userId: 1 } },
        { collection: 'notifications', index: { read: 1 } },
        { collection: 'notifications', index: { createdAt: -1 } },
        
        // Tier access
        { collection: 'tier_access', index: { tierName: 1 }, options: { unique: true } },
        { collection: 'tier_access', index: { level: 1 } },
        
        // Investment indexes
        { collection: 'investments', index: { userId: 1 } },
        { collection: 'investments', index: { investmentId: 1 }, options: { unique: true } },
        { collection: 'investments', index: { status: 1 } },
        { collection: 'investments', index: { sector: 1 } },
        
        // Email templates
        { collection: 'email_templates', index: { templateName: 1 }, options: { unique: true } },
        { collection: 'email_templates', index: { templateType: 1 } },
        
        // Backup logs
        { collection: 'backup_logs', index: { timestamp: -1 } },
        { collection: 'backup_logs', index: { status: 1 } }
    ];

    for (const { collection: colName, index, options } of indexes) {
        try {
            await database.collection(colName).createIndex(index, options);
            console.log(`✅ Created index for ${colName}:`, JSON.stringify(index));
        } catch (error) {
            console.warn(`⚠️ Could not create index for ${colName}:`, error.message);
        }
    }
}

async function initializeDefaultAdmin() {
    const adminCount = await database.collection("admins").countDocuments();
    if (adminCount === 0) {
        const hash = await bcrypt.hash("Admin@123", 12);
        await database.collection("admins").insertOne({
            email: "admin@cil.com",
            password: hash,
            role: "super_admin",
            isActive: true,
            name: "System Administrator",
            permissions: ['all'],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log("🔐 Default Admin Created → admin@cil.com / Admin@123");
        console.log("⚠️ CHANGE DEFAULT PASSWORD IMMEDIATELY!");
    }
}

async function initializeTierAccess() {
    const tiers = [
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        }
    ];

    for (const tier of tiers) {
        const existingTier = await database.collection("tier_access").findOne({ tierName: tier.tierName });
        if (!existingTier) {
            await database.collection("tier_access").insertOne(tier);
            console.log(`✅ Created tier: ${tier.name}`);
        }
    }
}

async function initializeEmailTemplates() {
    const templates = [
        {
            templateName: 'welcome_customer',
            templateType: 'welcome',
            subject: 'Welcome to CIL - Your Customer Account is Ready!',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #d69e2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Collaborative Investment Ltd!</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p>On behalf of the entire CIL team, welcome to our community!</p>
        <p>Your customer account has been successfully created. Here's what you can do now:</p>
        <ul>
            <li>Shop thousands of quality products across 8 business sectors</li>
            <li>Track your orders in real-time</li>
            <li>Manage your profile and preferences</li>
            <li>Receive exclusive deals and discounts</li>
        </ul>
        <p><strong>Account Details:</strong></p>
        <p>Email: {{email}}<br>
        Account Type: Customer<br>
        Status: Active</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardLink}}" class="button">Go to Your Dashboard</a>
        </p>
        <p>We're committed to providing you with the best shopping experience.</p>
        <p>Best regards,<br>
        <strong>CIL Management Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Welcome to Collaborative Investment Ltd!

Dear {{firstName}},

On behalf of the entire CIL team, welcome to our community!

Your customer account has been successfully created.

Account Details:
- Email: {{email}}
- Account Type: Customer
- Status: Active

What you can do now:
1. Shop thousands of quality products across 8 business sectors
2. Track your orders in real-time
3. Manage your profile and preferences
4. Receive exclusive deals and discounts

Go to your dashboard: {{dashboardLink}}

We're committed to providing you with the best shopping experience.

Best regards,
CIL Management Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'email', 'dashboardLink'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'welcome_investor',
            templateType: 'welcome',
            subject: 'Welcome to CIL - Your Investor Journey Begins!',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .highlight { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to CIL Investments!</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p>On behalf of our CEO and management team, welcome to Collaborative Investment Ltd!</p>
        <p>Your investor account has been successfully created. We're excited to partner with you on your investment journey.</p>
        
        <div class="highlight">
            <p><strong>Investor Details:</strong></p>
            <p>Investor ID: {{investorId}}<br>
            Email: {{email}}<br>
            Account Type: Investor<br>
            Minimum Investment: ₦5,000,000</p>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ol>
            <li>Complete your KYC verification for full access</li>
            <li>Explore investment opportunities in our dashboard</li>
            <li>Connect with your assigned account manager</li>
            <li>Start your first investment (minimum ₦5,000,000)</li>
        </ol>
        
        <p><strong>Benefits of investing with CIL:</strong></p>
        <ul>
            <li>Asset-backed security on all investments</li>
            <li>Professional portfolio management</li>
            <li>Monthly performance reports</li>
            <li>Expected ROI: 18-38% depending on sector</li>
            <li>Dedicated support team</li>
        </ul>
        
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardLink}}" class="button">Access Investor Dashboard</a>
        </p>
        
        <p>A dedicated account manager will contact you within 24 hours to discuss your investment goals.</p>
        
        <p>Welcome aboard,<br>
        <strong>CIL CEO & Management Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Welcome to CIL Investments!

Dear {{firstName}},

On behalf of our CEO and management team, welcome to Collaborative Investment Ltd!

Your investor account has been successfully created. We're excited to partner with you on your investment journey.

Investor Details:
- Investor ID: {{investorId}}
- Email: {{email}}
- Account Type: Investor
- Minimum Investment: ₦5,000,000

Next Steps:
1. Complete your KYC verification for full access
2. Explore investment opportunities in our dashboard
3. Connect with your assigned account manager
4. Start your first investment (minimum ₦5,000,000)

Benefits of investing with CIL:
- Asset-backed security on all investments
- Professional portfolio management
- Monthly performance reports
- Expected ROI: 18-38% depending on sector
- Dedicated support team

Access your dashboard: {{dashboardLink}}

A dedicated account manager will contact you within 24 hours to discuss your investment goals.

Welcome aboard,
CIL CEO & Management Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'investorId', 'email', 'dashboardLink'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'payment_confirmation',
            templateType: 'transaction',
            subject: 'Payment Confirmation - CIL Account',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .receipt { background: white; padding: 20px; border-radius: 5px; border: 1px solid #e2e8f0; margin: 20px 0; }
        .success { color: #38a169; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Payment Received!</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p class="success">✅ Your payment has been successfully processed!</p>
        
        <div class="receipt">
            <h3>Payment Details</h3>
            <p><strong>Amount:</strong> ₦{{amountFormatted}}</p>
            <p><strong>Reference:</strong> {{reference}}</p>
            <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
            <p><strong>Purpose:</strong> {{purpose}}</p>
            <p><strong>Date:</strong> {{date}}</p>
            <p><strong>Status:</strong> <span class="success">Completed</span></p>
        </div>
        
        <p>This transaction has been recorded in your account. You can view it in your dashboard under "Transaction History".</p>
        
        <p>Thank you for choosing Collaborative Investment Ltd!</p>
        
        <p>Best regards,<br>
        <strong>CIL Finance Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Payment Received!

Dear {{firstName}},

✅ Your payment has been successfully processed!

Payment Details:
- Amount: ₦{{amountFormatted}}
- Reference: {{reference}}
- Payment Method: {{paymentMethod}}
- Purpose: {{purpose}}
- Date: {{date}}
- Status: Completed

This transaction has been recorded in your account. You can view it in your dashboard under "Transaction History".

Thank you for choosing Collaborative Investment Ltd!

Best regards,
CIL Finance Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'amountFormatted', 'reference', 'paymentMethod', 'purpose', 'date'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'kyc_reminder',
            templateType: 'kyc',
            subject: 'Complete Your KYC for Full Account Access',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #d69e2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .info-box { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Complete Your KYC Verification</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p>To unlock full access to your {{accountType}} account features, please complete your KYC (Know Your Customer) verification.</p>
        
        <div class="info-box">
            <p><strong>Required Documents:</strong></p>
            <ul>
                <li>Government-issued ID (Passport, Driver's License, National ID)</li>
                <li>Proof of Address (Utility bill, Bank statement)</li>
                <li>Bank Statement (last 3 months)</li>
                {{#if isInvestor}}
                <li>Proof of Income/Source of Funds</li>
                <li>Investment Experience Questionnaire</li>
                {{/if}}
            </ul>
        </div>
        
        <p><strong>Benefits of KYC Verification:</strong></p>
        <ul>
            <li>Full account access</li>
            <li>Higher transaction limits</li>
            <li>Priority customer support</li>
            {{#if isInvestor}}
            <li>Access to all investment opportunities</li>
            <li>Dedicated account manager</li>
            {{/if}}
        </ul>
        
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{kycLink}}" class="button">Start KYC Verification</a>
        </p>
        
        <p>If you have any questions, our support team is here to help.</p>
        
        <p>Best regards,<br>
        <strong>CIL Compliance Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Complete Your KYC Verification

Dear {{firstName}},

To unlock full access to your {{accountType}} account features, please complete your KYC (Know Your Customer) verification.

Required Documents:
1. Government-issued ID (Passport, Driver's License, National ID)
2. Proof of Address (Utility bill, Bank statement)
3. Bank Statement (last 3 months)
{{#if isInvestor}}
4. Proof of Income/Source of Funds
5. Investment Experience Questionnaire
{{/if}}

Benefits of KYC Verification:
- Full account access
- Higher transaction limits
- Priority customer support
{{#if isInvestor}}
- Access to all investment opportunities
- Dedicated account manager
{{/if}}

Start your KYC verification here: {{kycLink}}

If you have any questions, our support team is here to help.

Best regards,
CIL Compliance Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'accountType', 'kycLink', 'isInvestor'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'auto_verification_success',
            templateType: 'verification',
            subject: 'Auto-Verification Successful - Your Account is Ready!',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .success { color: #38a169; font-weight: bold; font-size: 18px; }
        .tier-box { background: white; padding: 20px; border-radius: 5px; border: 1px solid #e2e8f0; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Auto-Verification Complete! 🎉</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        
        <p class="success">✅ Your {{verificationMethod}} verification was successful!</p>
        
        <p>We've automatically verified your account using our fast verification system.</p>
        
        <div class="tier-box">
            <h3>Your Current Access Tier: {{tierName}}</h3>
            <p><strong>Features Available:</strong></p>
            <ul>
                {{#each features}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </div>
        
        <p><strong>Next Steps for Full Access:</strong></p>
        <ol>
            <li>Complete your profile information</li>
            <li>Set up your security preferences</li>
            <li>Start exploring your dashboard</li>
            {{#if requiresKYC}}
            <li>Complete KYC for maximum access</li>
            {{/if}}
        </ol>
        
        <p>Thank you for choosing our fast verification process!</p>
        
        <p>Best regards,<br>
        <strong>CIL Verification Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Auto-Verification Complete! 🎉

Dear {{firstName}},

✅ Your {{verificationMethod}} verification was successful!

We've automatically verified your account using our fast verification system.

Your Current Access Tier: {{tierName}}

Features Available:
{{#each features}}
- {{this}}
{{/each}}

Next Steps for Full Access:
1. Complete your profile information
2. Set up your security preferences
3. Start exploring your dashboard
{{#if requiresKYC}}
4. Complete KYC for maximum access
{{/if}}

Thank you for choosing our fast verification process!

Best regards,
CIL Verification Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'verificationMethod', 'tierName', 'features', 'requiresKYC'],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    for (const template of templates) {
        const existingTemplate = await database.collection("email_templates").findOne({ templateName: template.templateName });
        if (!existingTemplate) {
            await database.collection("email_templates").insertOne(template);
            console.log(`✅ Created email template: ${template.templateName}`);
        }
    }
}

/* =========================================================
   DATABASE OPERATIONS
========================================================= */

const db = {
    /* ---------------- CORE OPERATIONS ---------------- */
    
    collection(name) {
        if (!database) {
            throw new Error("Database not connected. Call connectDB() first.");
        }
        return database.collection(name);
    },

    toObjectId(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
        }
        return new ObjectId(id);
    },

    isValidObjectId(id) {
        return ObjectId.isValid(id);
    },

    async getAll(col, query = {}, sort = {}, limit = 0) {
        let cursor = this.collection(col).find(query);
        if (Object.keys(sort).length) cursor = cursor.sort(sort);
        if (limit) cursor = cursor.limit(limit);
        return cursor.toArray();
    },

    async getOne(col, query) {
        return this.collection(col).findOne(query);
    },

    async getById(col, id) {
        if (!this.isValidObjectId(id)) return null;
        return this.collection(col).findOne({ _id: this.toObjectId(id) });
    },

    async create(col, data) {
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const result = await this.collection(col).insertOne(data);
        return { _id: result.insertedId, ...data };
    },

    async update(col, query, update) {
        if (!update.$set) update.$set = {};
        update.$set.updatedAt = new Date();
        return (await this.collection(col).updateOne(query, update)).modifiedCount > 0;
    },

    async updateWithOperators(col, query, operators) {
        if (!operators.$set) operators.$set = {};
        operators.$set.updatedAt = new Date();
        return (await this.collection(col).updateOne(query, operators)).modifiedCount > 0;
    },

    async count(col, query = {}) {
        return this.collection(col).countDocuments(query);
    },

    async delete(col, query) {
        return (await this.collection(col).deleteOne(query)).deletedCount > 0;
    },

    async findAndUpdate(col, query, update) {
        update.$set = update.$set || {};
        update.$set.updatedAt = new Date();
        return this.collection(col).findOneAndUpdate(
            query,
            update,
            { returnDocument: 'after' }
        );
    },

    /* ---------------- USER REGISTRATION ---------------- */

    async createUserWithVerification(userData) {
        const session = client.startSession();
        
        try {
            session.startTransaction();
            
            // Check if user already exists
            const existingUser = await this.collection('users').findOne({ 
                $or: [
                    { email: userData.email.toLowerCase() },
                    { phone: userData.phone }
                ]
            }, { session });
            
            if (existingUser) {
                await session.abortTransaction();
                return { 
                    success: false, 
                    message: existingUser.email === userData.email.toLowerCase() 
                        ? 'Email already registered' 
                        : 'Phone number already registered' 
                };
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Generate user ID
            const userId = `CIL-${userData.accountType.toUpperCase()}-${Date.now().toString().slice(-8)}`;
            
            // Determine verification status based on method
            let isVerified = false;
            let verificationStatus = 'pending';
            let verificationMethod = userData.verificationMethod || 'email';
            
            // Auto-verification logic
            if (verificationMethod === 'email' || verificationMethod === 'both') {
                // For auto-verification, we mark as verified immediately
                // In production, you would send verification email/code
                isVerified = true;
                verificationStatus = 'email_verified';
            }
            
            if (verificationMethod === 'phone' || verificationMethod === 'both') {
                // For auto-verification, we mark as verified immediately
                // In production, you would send SMS verification code
                isVerified = true;
                verificationStatus = verificationStatus === 'email_verified' ? 'fully_verified' : 'phone_verified';
            }
            
            // Determine tier based on verification
            const tierLevel = this.determineTierLevel(verificationStatus, userData.accountType);
            const tier = await this.getTierByLevel(tierLevel);
            
            // Prepare user data
            const user = {
                userId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.toLowerCase(),
                phone: userData.phone,
                password: hashedPassword,
                accountType: userData.accountType,
                role: userData.accountType,
                country: userData.country || 'nigeria',
                referralCode: userData.referral || '',
                verificationMethod: verificationMethod,
                verificationStatus: verificationStatus,
                isVerified: isVerified,
                verificationToken: this.generateVerificationToken(),
                acceptsTerms: userData.acceptsTerms || false,
                acceptsCommunications: userData.acceptsCommunications || false,
                tierLevel: tierLevel,
                tierName: tier.tierName,
                kycStatus: 'pending',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Insert user
            const userResult = await this.collection('users').insertOne(user, { session });
            
            // Create account-specific record
            if (userData.accountType === 'customer') {
                const customerData = {
                    userId: userId,
                    email: user.email,
                    phone: user.phone,
                    name: `${user.firstName} ${user.lastName}`,
                    preferences: userData.preferences || {},
                    shippingAddress: userData.preferences?.shippingAddress || '',
                    totalOrders: 0,
                    totalSpent: 0,
                    wishlist: [],
                    createdAt: new Date()
                };
                
                await this.collection('customers').insertOne(customerData, { session });
                
            } else if (userData.accountType === 'investor') {
                const investorId = `CIL-INV-${Date.now().toString().slice(-6)}`;
                
                const investorData = {
                    userId: userId,
                    investorId: investorId,
                    email: user.email,
                    phone: user.phone,
                    name: `${user.firstName} ${user.lastName}`,
                    investmentPreferences: userData.investmentPreferences || {},
                    totalInvestments: 0,
                    totalReturns: 0,
                    activeInvestments: 0,
                    preferredSectors: userData.investmentPreferences?.sectors || [],
                    riskProfile: 'moderate',
                    accreditationStatus: 'pending',
                    kycStatus: 'pending',
                    initialDeposit: userData.payment?.depositAmount || 0,
                    depositDate: userData.payment?.depositAmount > 0 ? new Date() : null,
                    investmentStatus: userData.payment?.depositAmount >= 5000000 ? 'pending_approval' : 'inactive',
                    createdAt: new Date()
                };
                
                await this.collection('investors').insertOne(investorData, { session });
                user.investorId = investorId;
            }
            
            // Handle initial deposit if provided
            if (userData.payment && userData.payment.depositAmount > 0 && !userData.payment.skipDeposit) {
                await this.createInitialDeposit(userId, userData.payment, user.accountType, session);
            }
            
            // Create auto-verification log
            await this.createAutoVerificationLog({
                userId: userId,
                email: user.email,
                phone: user.phone,
                verificationMethod: verificationMethod,
                verificationStatus: verificationStatus,
                tierAssigned: tier.tierName,
                isAutoVerified: true,
                timestamp: new Date()
            }, session);
            
            await session.commitTransaction();
            
            // Remove password from returned object
            const { password, ...safeUser } = user;
            
            return {
                success: true,
                message: 'Registration successful',
                user: safeUser,
                tier: tier
            };
            
        } catch (error) {
            await session.abortTransaction();
            console.error('Error creating user:', error);
            return { 
                success: false, 
                message: 'Error during registration' 
            };
        } finally {
            await session.endSession();
        }
    },

    generateVerificationToken() {
        return require('crypto').randomBytes(32).toString('hex');
    },

    determineTierLevel(verificationStatus, accountType) {
        const tierMap = {
            'pending': 1, // basic
            'email_verified': 2, // email_verified
            'phone_verified': 3, // phone_verified
            'fully_verified': 4 // fully_verified
        };
        
        let level = tierMap[verificationStatus] || 1;
        
        // Investors start at a higher tier if they meet minimum investment
        if (accountType === 'investor') {
            level = Math.max(level, 2); // Investors start at email_verified minimum
        }
        
        return level;
    },

    async getTierByLevel(level) {
        return this.collection('tier_access').findOne({ level: level });
    },

    async getTierByName(tierName) {
        return this.collection('tier_access').findOne({ tierName: tierName });
    },

    async createInitialDeposit(userId, paymentData, accountType, session) {
        const paymentReference = paymentData.paymentReference || `DEP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const payment = {
            userId: userId,
            userEmail: paymentData.email,
            userName: paymentData.name,
            amount: paymentData.depositAmount,
            paymentMethod: paymentData.paymentMethod || 'bank_transfer',
            paymentReference: paymentReference,
            purpose: 'initial_deposit',
            accountType: accountType,
            status: paymentData.skipDeposit ? 'skipped' : 'pending',
            paymentProof: paymentData.paymentProof || null,
            gatewayResponse: paymentData.gatewayResponse || null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // If using payment gateway, mark as completed
        if (paymentData.paymentMethod === 'paystack' || paymentData.paymentMethod === 'flutterwave') {
            payment.status = 'completed';
            payment.completedAt = new Date();
        }
        
        await this.collection('payments').insertOne(payment, { session });
        
        // Log transaction
        await this.collection('payment_transactions').insertOne({
            userId: userId,
            paymentId: payment._id,
            type: 'deposit',
            amount: paymentData.depositAmount,
            reference: paymentReference,
            status: payment.status,
            metadata: {
                accountType: accountType,
                purpose: 'initial_deposit',
                method: paymentData.paymentMethod
            },
            createdAt: new Date()
        }, { session });
        
        return payment;
    },

    async createAutoVerificationLog(logData, session = null) {
        const log = {
            ...logData,
            createdAt: new Date()
        };
        
        if (session) {
            return this.collection('auto_verification_logs').insertOne(log, { session });
        } else {
            return this.collection('auto_verification_logs').insertOne(log);
        }
    },

    /* ---------------- EMAIL TEMPLATES ---------------- */

    async getEmailTemplate(templateName) {
        return this.collection('email_templates').findOne({ templateName: templateName });
    },

    async renderEmailTemplate(templateName, variables) {
        const template = await this.getEmailTemplate(templateName);
        if (!template) return null;
        
        let html = template.html;
        let text = template.text;
        
        // Replace variables
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, value || '');
            text = text.replace(regex, value || '');
        }
        
        // Handle conditional blocks
        if (variables.isInvestor) {
            html = html.replace(/{{#if isInvestor}}/g, '').replace(/{{\/if}}/g, '');
            text = text.replace(/{{#if isInvestor}}/g, '').replace(/{{\/if}}/g, '');
        } else {
            html = html.replace(/{{#if isInvestor}}[\s\S]*?{{\/if}}/g, '');
            text = text.replace(/{{#if isInvestor}}[\s\S]*?{{\/if}}/g, '');
        }
        
        if (variables.requiresKYC) {
            html = html.replace(/{{#if requiresKYC}}/g, '').replace(/{{\/if}}/g, '');
            text = text.replace(/{{#if requiresKYC}}/g, '').replace(/{{\/if}}/g, '');
        } else {
            html = html.replace(/{{#if requiresKYC}}[\s\S]*?{{\/if}}/g, '');
            text = text.replace(/{{#if requiresKYC}}[\s\S]*?{{\/if}}/g, '');
        }
        
        // Replace feature list
        if (variables.features && Array.isArray(variables.features)) {
            let featuresHtml = '';
            let featuresText = '';
            
            variables.features.forEach(feature => {
                featuresHtml += `<li>${feature}</li>`;
                featuresText += `- ${feature}\n`;
            });
            
            html = html.replace(/{{#each features}}[\s\S]*?{{\/each}}/g, featuresHtml);
            text = text.replace(/{{#each features}}[\s\S]*?{{\/each}}/g, featuresText);
        }
        
        return {
            subject: template.subject,
            html: html,
            text: text
        };
    },

    /* ---------------- KYC MANAGEMENT ---------------- */

    async createKYCRequest(userId, userData) {
        const kycRequest = {
            userId: userId,
            userEmail: userData.email,
            userName: `${userData.firstName} ${userData.lastName}`,
            accountType: userData.accountType,
            status: 'pending',
            submittedAt: new Date(),
            documentsRequired: [
                'government_id',
                'proof_of_address',
                'bank_statement'
            ],
            documentsSubmitted: [],
            verificationLevel: 'basic',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        if (userData.accountType === 'investor') {
            kycRequest.documentsRequired.push('proof_of_income');
            kycRequest.documentsRequired.push('investment_experience');
            kycRequest.verificationLevel = 'enhanced';
        }
        
        const result = await this.collection('kyc_verifications').insertOne(kycRequest);
        
        // Update user KYC status
        await this.collection('users').updateOne(
            { userId: userId },
            { $set: { kycStatus: 'pending', updatedAt: new Date() } }
        );
        
        if (userData.accountType === 'investor') {
            await this.collection('investors').updateOne(
                { userId: userId },
                { $set: { kycStatus: 'pending', updatedAt: new Date() } }
            );
        }
        
        return { ...kycRequest, _id: result.insertedId };
    },

    async uploadKYCDocument(userId, documentData) {
        const document = {
            userId: userId,
            documentType: documentData.documentType,
            documentName: documentData.documentName,
            fileUrl: documentData.fileUrl,
            fileSize: documentData.fileSize,
            mimeType: documentData.mimeType,
            status: 'pending_review',
            uploadedAt: new Date(),
            verifiedAt: null,
            verifiedBy: null,
            createdAt: new Date()
        };
        
        const result = await this.collection('kyc_documents').insertOne(document);
        
        // Add to KYC request
        await this.collection('kyc_verifications').updateOne(
            { userId: userId },
            { 
                $push: { 
                    documentsSubmitted: {
                        documentId: result.insertedId,
                        documentType: documentData.documentType,
                        uploadedAt: new Date()
                    }
                },
                $set: { updatedAt: new Date() }
            }
        );
        
        return { ...document, _id: result.insertedId };
    },

    async updateKYCStatus(userId, status, verifiedBy = null, notes = '') {
        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        
        if (verifiedBy) {
            updateData.verifiedBy = verifiedBy;
            updateData.verifiedAt = new Date();
        }
        
        if (notes) {
            updateData.verificationNotes = notes;
        }
        
        await this.collection('kyc_verifications').updateOne(
            { userId: userId },
            { $set: updateData }
        );
        
        // Update user tier if KYC is approved
        if (status === 'approved') {
            const user = await this.collection('users').findOne({ userId: userId });
            const newTierLevel = user.accountType === 'investor' ? 6 : 5; // investor_premium or kyc_verified
            const tier = await this.getTierByLevel(newTierLevel);
            
            await this.collection('users').updateOne(
                { userId: userId },
                { 
                    $set: { 
                        kycStatus: 'verified',
                        tierLevel: newTierLevel,
                        tierName: tier.tierName,
                        updatedAt: new Date()
                    }
                }
            );
            
            if (user.accountType === 'investor') {
                await this.collection('investors').updateOne(
                    { userId: userId },
                    { 
                        $set: { 
                            kycStatus: 'verified',
                            accreditationStatus: 'accredited',
                            updatedAt: new Date()
                        }
                    }
                );
            }
            
            return tier;
        } else if (status === 'rejected') {
            await this.collection('users').updateOne(
                { userId: userId },
                { 
                    $set: { 
                        kycStatus: 'rejected',
                        updatedAt: new Date()
                    }
                }
            );
            
            if (user.accountType === 'investor') {
                await this.collection('investors').updateOne(
                    { userId: userId },
                    { 
                        $set: { 
                            kycStatus: 'rejected',
                            updatedAt: new Date()
                        }
                    }
                );
            }
        }
        
        return null;
    },

    /* ---------------- PAYMENT GATEWAY INTEGRATION ---------------- */

    async createPaymentGatewayTransaction(paymentData) {
        const transaction = {
            userId: paymentData.userId,
            userEmail: paymentData.email,
            amount: paymentData.amount,
            currency: paymentData.currency || 'NGN',
            gateway: paymentData.gateway, // 'paystack', 'flutterwave', 'bank_transfer'
            reference: paymentData.reference,
            purpose: paymentData.purpose || 'deposit',
            metadata: paymentData.metadata || {},
            status: 'initiated',
            gatewayResponse: null,
            callbackData: null,
            requiresVerification: paymentData.gateway === 'bank_transfer',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await this.collection('payment_transactions').insertOne(transaction);
        
        // If bank transfer, create verification task
        if (paymentData.gateway === 'bank_transfer' && paymentData.paymentProof) {
            await this.createBankTransferVerification({
                transactionId: result.insertedId,
                userId: paymentData.userId,
                amount: paymentData.amount,
                reference: paymentData.reference,
                paymentProof: paymentData.paymentProof,
                bankDetails: paymentData.bankDetails
            });
        }
        
        return { ...transaction, _id: result.insertedId };
    },

    async createBankTransferVerification(transferData) {
        const verification = {
            transactionId: transferData.transactionId,
            userId: transferData.userId,
            amount: transferData.amount,
            reference: transferData.reference,
            paymentProof: transferData.paymentProof,
            bankDetails: transferData.bankDetails,
            status: 'pending_review',
            reviewedBy: null,
            reviewedAt: null,
            reviewNotes: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await this.collection('bank_transfer_verifications').insertOne(verification);
        
        // Create admin review task
        await this.createAdminReviewTask({
            type: 'bank_transfer_verification',
            referenceId: result.insertedId,
            title: `Bank Transfer Verification - ₦${transferData.amount.toLocaleString()}`,
            description: `Verify bank transfer for user ${transferData.userId}`,
            priority: 'medium',
            assignedTo: null,
            status: 'pending'
        });
        
        return { ...verification, _id: result.insertedId };
    },

    async createAdminReviewTask(taskData) {
        const task = {
            type: taskData.type,
            referenceId: taskData.referenceId,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority || 'medium',
            assignedTo: taskData.assignedTo,
            status: taskData.status || 'pending',
            dueDate: taskData.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            completedAt: null,
            completedBy: null,
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        return this.collection('admin_review_tasks').insertOne(task);
    },

    async updatePaymentTransactionStatus(transactionId, status, gatewayResponse = null) {
        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        
        if (gatewayResponse) {
            updateData.gatewayResponse = gatewayResponse;
            updateData.callbackData = gatewayResponse;
        }
        
        if (status === 'completed') {
            updateData.completedAt = new Date();
        } else if (status === 'failed') {
            updateData.failedAt = new Date();
        }
        
        await this.collection('payment_transactions').updateOne(
            { _id: this.toObjectId(transactionId) },
            { $set: updateData }
        );
        
        // Update payment record if exists
        const transaction = await this.collection('payment_transactions').findOne({ _id: this.toObjectId(transactionId) });
        if (transaction) {
            await this.collection('payments').updateOne(
                { paymentReference: transaction.reference },
                { 
                    $set: { 
                        status: status,
                        gatewayResponse: gatewayResponse,
                        updatedAt: new Date()
                    }
                }
            );
        }
        
        return true;
    },

    /* ---------------- NOTIFICATION SYSTEM ---------------- */

    async createNotification(notificationData) {
        const notification = {
            userId: notificationData.userId,
            type: notificationData.type, // 'email', 'sms', 'system', 'investment', 'payment', 'kyc'
            title: notificationData.title,
            message: notificationData.message,
            priority: notificationData.priority || 'medium',
            read: false,
            readAt: null,
            metadata: notificationData.metadata || {},
            createdAt: new Date(),
            expiresAt: notificationData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        };
        
        const result = await this.collection('notifications').insertOne(notification);
        
        // Log SMS notification if type is sms
        if (notificationData.type === 'sms') {
            await this.logSMSNotification({
                userId: notificationData.userId,
                phone: notificationData.phone,
                message: notificationData.message,
                status: 'sent',
                notificationId: result.insertedId,
                sentAt: new Date()
            });
        }
        
        return { ...notification, _id: result.insertedId };
    },

    async logSMSNotification(smsData) {
        const smsLog = {
            userId: smsData.userId,
            phone: smsData.phone,
            message: smsData.message.substring(0, 500), // Truncate long messages
            status: smsData.status || 'sent',
            notificationId: smsData.notificationId,
            provider: smsData.provider || 'default',
            messageId: smsData.messageId,
            error: smsData.error,
            sentAt: smsData.sentAt || new Date(),
            deliveredAt: smsData.deliveredAt,
            createdAt: new Date()
        };
        
        return this.collection('sms_notifications').insertOne(smsLog);
    },

    async markNotificationAsRead(notificationId, userId) {
        return this.collection('notifications').updateOne(
            { _id: this.toObjectId(notificationId), userId: userId },
            { 
                $set: { 
                    read: true,
                    readAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );
    },

    async getUserNotifications(userId, limit = 50, unreadOnly = false) {
        const query = { userId: userId };
        if (unreadOnly) {
            query.read = false;
        }
        
        return this.collection('notifications')
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    },

    /* ---------------- USER ACTIVITY LOGGING ---------------- */

    async logUserActivity(activityData) {
        const activity = {
            userId: activityData.userId,
            userEmail: activityData.userEmail,
            activityType: activityData.activityType, // 'login', 'registration', 'investment', 'payment', 'profile_update', 'kyc_submission'
            description: activityData.description,
            ipAddress: activityData.ipAddress,
            userAgent: activityData.userAgent,
            metadata: activityData.metadata || {},
            timestamp: new Date(),
            createdAt: new Date()
        };
        
        return this.collection('user_activity').insertOne(activity);
    },

    /* ---------------- ADMIN AUTH ---------------- */

    async getAdminByEmail(email) {
        return this.collection("admins").findOne({
            email: email.toLowerCase(),
            isActive: true
        });
    },

    async verifyAdminCredentials(email, password) {
        const admin = await this.getAdminByEmail(email);
        if (!admin) {
            return { success: false, message: "Invalid credentials" };
        }

        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) {
            return { success: false, message: "Invalid credentials" };
        }

        await this.collection("admins").updateOne(
            { _id: admin._id },
            { $set: { lastLogin: new Date() } }
        );

        // Create safe admin object without password
        const { password: _, ...safeAdmin } = admin;
        return { success: true, admin: safeAdmin };
    },

    /* ---------------- ORDERS ---------------- */

    async getOrderByNumber(orderNumber) {
        return this.collection("orders").findOne({
            orderNumber: { $regex: new RegExp(`^${orderNumber}$`, "i") }
        });
    },

    async updateOrderStatus(orderId, status, by) {
        if (!this.isValidObjectId(orderId)) return false;

        return (await this.collection("orders").updateOne(
            { _id: this.toObjectId(orderId) },
            {
                $set: { status, updatedAt: new Date() },
                $push: {
                    statusHistory: {
                        status,
                        date: new Date(),
                        by
                    }
                }
            }
        )).modifiedCount > 0;
    },

    /* ---------------- EMAILS ---------------- */

    async logEmail(to, subject, body, status = "sent", type = "transactional") {
        await this.collection("emails").insertOne({
            to,
            subject,
            body,
            status,
            type,
            sentAt: new Date(),
            createdAt: new Date()
        });
    },

    async getRecentEmails(limit = 50) {
        return this.collection("emails")
            .find({})
            .sort({ sentAt: -1 })
            .limit(limit)
            .toArray();
    },

    /* ---------------- STATS ---------------- */

    async getStats() {
        const [orders, products, customers, emails, users, investors, payments] = await Promise.all([
            this.count("orders"),
            this.count("products"),
            this.count("customers"),
            this.count("emails"),
            this.count("users"),
            this.count("investors"),
            this.count("payments", { status: 'completed' })
        ]);

        // Get recent registrations
        const recentUsers = await this.collection("users")
            .find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();

        // Get active investments
        const activeInvestments = await this.count("investments", { status: 'active' });

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
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                accountType: user.accountType,
                createdAt: user.createdAt
            })),
            generatedAt: new Date()
        };
    },

    /* ---------------- USER MANAGEMENT ---------------- */

    async getUserByEmail(email) {
        return this.collection("users").findOne({ 
            email: email.toLowerCase(),
            status: 'active' 
        });
    },

    async getUserByPhone(phone) {
        return this.collection("users").findOne({ 
            phone: phone,
            status: 'active' 
        });
    },

    async getUserByUserId(userId) {
        return this.collection("users").findOne({ userId: userId });
    },

    async getCustomerByUserId(userId) {
        return this.collection("customers").findOne({ userId: userId });
    },

    async getInvestorByUserId(userId) {
        return this.collection("investors").findOne({ userId: userId });
    },

    async updateUserVerification(userId, verificationData) {
        const update = {
            verificationStatus: verificationData.status,
            isVerified: verificationData.isVerified || false,
            updatedAt: new Date()
        };
        
        if (verificationData.method === 'email') {
            update.emailVerified = true;
            update.emailVerifiedAt = new Date();
        } else if (verificationData.method === 'phone') {
            update.phoneVerified = true;
            update.phoneVerifiedAt = new Date();
        }
        
        // Update tier based on new verification status
        if (verificationData.status === 'fully_verified') {
            const tier = await this.getTierByName('fully_verified');
            update.tierLevel = tier.level;
            update.tierName = tier.tierName;
        }
        
        return this.collection('users').updateOne(
            { userId: userId },
            { $set: update }
        );
    },

    /* ---------------- INVESTMENT MANAGEMENT ---------------- */

    async createInvestment(investmentData) {
        const investmentId = `INV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        const investment = {
            investmentId: investmentId,
            userId: investmentData.userId,
            userEmail: investmentData.userEmail,
            userName: investmentData.userName,
            amount: investmentData.amount,
            sector: investmentData.sector,
            duration: investmentData.duration,
            expectedROI: investmentData.expectedROI,
            actualROI: null,
            status: 'pending',
            paymentStatus: 'pending',
            startDate: null,
            maturityDate: null,
            paymentId: null,
            documents: [],
            milestones: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await this.collection('investments').insertOne(investment);
        
        // Update investor stats
        if (investmentData.userId) {
            await this.collection('investors').updateOne(
                { userId: investmentData.userId },
                { 
                    $inc: { pendingInvestments: 1 },
                    $set: { updatedAt: new Date() }
                }
            );
        }
        
        return { ...investment, _id: result.insertedId };
    },

    async updateInvestmentStatus(investmentId, status, paymentId = null) {
        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        
        if (paymentId) {
            updateData.paymentId = paymentId;
            updateData.paymentStatus = 'completed';
        }
        
        if (status === 'active') {
            updateData.startDate = new Date();
            const investment = await this.collection('investments').findOne({ investmentId: investmentId });
            if (investment && investment.duration) {
                updateData.maturityDate = new Date(Date.now() + investment.duration * 30 * 24 * 60 * 60 * 1000);
            }
            
            // Update investor stats
            await this.collection('investors').updateOne(
                { userId: investment.userId },
                { 
                    $inc: { 
                        pendingInvestments: -1,
                        activeInvestments: 1,
                        totalInvestments: investment.amount
                    },
                    $set: { updatedAt: new Date() }
                }
            );
        }
        
        return this.collection('investments').updateOne(
            { investmentId: investmentId },
            { $set: updateData }
        );
    },

    /* ---------------- BACKUP LOGGING ---------------- */

    async logBackupOperation(operation, status, details = {}) {
        const log = {
            operation: operation, // 'backup', 'restore', 'cleanup'
            status: status, // 'started', 'completed', 'failed'
            details: details,
            timestamp: new Date(),
            createdAt: new Date()
        };
        
        return this.collection('backup_logs').insertOne(log);
    }
};

/* =========================================================
   USER MANAGEMENT FUNCTIONS (Legacy - for backward compatibility)
========================================================= */

async function createUser(userData) {
    try {
        // Check if user already exists
        const existingEmail = await db.getUserByEmail(userData.email);
        if (existingEmail) {
            return { success: false, message: 'User with this email already exists' };
        }

        if (userData.phone) {
            const existingPhone = await db.getUserByPhone(userData.phone);
            if (existingPhone) {
                return { success: false, message: 'User with this phone number already exists' };
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Determine role and account tier
        const isInvestor = userData.registeringAs === 'investor' || userData.role === 'investor';
        const role = isInvestor ? 'investor_applicant' : 'customer';
        const accountTier = isInvestor ? 'investor_applicant' : 'customer';
        const verificationLevel = isInvestor ? 'unverified' : 'email_verified';
        
        const user = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            phone: userData.phone || '',
            password: hashedPassword,
            role: role,
            accountTier: accountTier,
            verificationLevel: verificationLevel,
            isActive: true,
            emailVerified: false,
            phoneVerified: false,
            
            // Investor-specific fields (if applicable)
            investorId: isInvestor ? `INV-${Date.now().toString().slice(-6)}` : null,
            investorSince: isInvestor ? new Date() : null,
            
            // Limits based on account type
            dailyDepositLimit: isInvestor ? 0 : 100000, // ₦100,000 for customers, 0 for investors until verified
            dailyWithdrawalLimit: isInvestor ? 0 : 50000, // ₦50,000 for customers
            maxInvestmentAmount: isInvestor ? 0 : 0,
            
            // Preferences
            preferences: {
                notifications: true,
                marketingEmails: userData.communications || false
            },
            
            // Security
            twoFactorEnabled: false,
            failedLoginAttempts: 0,
            accountLockedUntil: null,
            lastPasswordChange: new Date(),
            
            // Timestamps
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null
        };

        const result = await db.create('users', user);
        
        // Remove password from returned object
        const { password, ...safeUser } = user;
        
        return { 
            success: true, 
            userId: result._id,
            user: safeUser 
        };
        
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Error creating user account' };
    }
}

async function authenticateUser(email, password) {
    try {
        const user = await db.getUserByEmail(email);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }
        
        // Check if account is locked
        if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
            const lockTime = Math.ceil((user.accountLockedUntil - new Date()) / 60000); // minutes
            return { 
                success: false, 
                message: `Account locked. Try again in ${lockTime} minute(s).` 
            };
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            // Increment failed login attempts
            const failedAttempts = user.failedLoginAttempts + 1;
            let updateData = { failedLoginAttempts };
            
            // Lock account after 5 failed attempts for 30 minutes
            if (failedAttempts >= 5) {
                updateData.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
            }
            
            await db.update('users', { _id: user._id }, updateData);
            
            return { 
                success: false, 
                message: `Invalid email or password. ${5 - failedAttempts} attempt(s) remaining.` 
            };
        }
        
        // Reset failed login attempts on successful login
        const updateData = { 
            lastLogin: new Date(),
            failedLoginAttempts: 0,
            accountLockedUntil: null
        };
        
        await db.update('users', { _id: user._id }, updateData);
        
        // Remove password from returned object
        const { password: _, ...safeUser } = user;
        return { success: true, user: safeUser };
        
    } catch (error) {
        console.error('Error authenticating user:', error);
        return { success: false, message: 'Authentication failed' };
    }
}

async function getUserById(userId) {
    try {
        if (!db.isValidObjectId(userId)) return null;
        
        const user = await db.getById('users', userId);
        if (user) {
            const { password, ...safeUser } = user;
            return safeUser;
        }
        return null;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

async function updateUser(userId, updateData) {
    try {
        if (!db.isValidObjectId(userId)) {
            return { success: false, message: 'Invalid user ID' };
        }
        
        // Remove fields that shouldn't be updated directly
        delete updateData.password;
        delete updateData.email;
        delete updateData._id;
        
        updateData.updatedAt = new Date();
        
        const result = await db.update('users', { _id: db.toObjectId(userId) }, updateData);
        
        if (result) {
            const updatedUser = await getUserById(userId);
            return { success: true, user: updatedUser };
        }
        
        return { success: false, message: 'User not found or no changes made' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Error updating user' };
    }
}

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    connectDB,
    closeDB,
    db,
    ObjectId,
    createUser,
    authenticateUser,
    getUserById,
    updateUser,
    backupDatabase,
    listBackups,
    restoreBackup,
    
    // Re-export db functions for backward compatibility
    create: db.create.bind(db),
    getAll: db.getAll.bind(db),
    getById: db.getById.bind(db),
    update: db.update.bind(db),
    updateWithOperators: db.updateWithOperators.bind(db),
    getStats: db.getStats.bind(db),
    count: db.count.bind(db),
    getOne: db.getOne.bind(db),
    collection: db.collection.bind(db),
    toObjectId: db.toObjectId.bind(db),
    verifyAdminCredentials: db.verifyAdminCredentials.bind(db),
    getOrderByNumber: db.getOrderByNumber.bind(db),
    logEmail: db.logEmail.bind(db),
    getRecentEmails: db.getRecentEmails.bind(db),
    
    // New exports for enhanced features
    JWT_SECRET
};
=======
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

/* =========================================================
   ENV CONFIG - ONLY ACCESS THROUGH process.env
========================================================= */

// Remove hardcoded MongoDB URL - Only use from environment variables
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME || "cil_database";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, "backup", "cil_database");

// Validate environment variables
if (!MONGODB_URL) {
    console.error("❌ ERROR: MONGODB_URL environment variable is required");
    console.error("Please add MONGODB_URL to your .env file");
    process.exit(1);
}

let client;
let database;

/* =========================================================
   CONNECT / CLOSE
========================================================= */

async function connectDB() {
    if (database) return database;

    console.log("🔗 Connecting to MongoDB...");
    
    client = new MongoClient(MONGODB_URL, {
        maxPoolSize: 20,
        connectTimeoutMS: 15000,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        tls: process.env.MONGODB_TLS === 'true',
        retryWrites: true,
        w: 'majority'
    });

    try {
        await client.connect();
        database = client.db(DB_NAME);
        
        console.log(`✅ MongoDB Connected Successfully → DB: ${DB_NAME}`);
        await initializeCollections();
        
        return database;
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        console.error("Please check your MONGODB_URL in .env file");
        process.exit(1);
    }
}

async function closeDB() {
    if (client) {
        await client.close();
        console.log("🔌 MongoDB Connection Closed");
    }
}

/* =========================================================
   BACKUP DATABASE FUNCTION
========================================================= */

async function backupDatabase() {
    try {
        console.log("📦 Starting database backup...");
        
        // Create backup directory if it doesn't exist
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            console.log(`✅ Created backup directory: ${BACKUP_DIR}`);
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `cil_backup_${timestamp}`;
        const backupPath = path.join(BACKUP_DIR, backupName);
        
        console.log(`📁 Backup location: ${backupPath}`);
        
        // Extract connection details from MONGODB_URL
        const url = new URL(MONGODB_URL);
        const host = url.hostname;
        const port = url.port || 27017;
        const username = url.username;
        const password = url.password;
        const database = url.pathname.substring(1) || DB_NAME;
        
        // Build mongodump command
        const args = [
            '--host', host,
            '--port', port.toString(),
            '--db', database,
            '--out', backupPath,
            '--gzip'
        ];
        
        // Add authentication if provided
        if (username && password) {
            args.push('--username', username);
            args.push('--password', password);
            args.push('--authenticationDatabase', 'admin');
        }
        
        // Add SSL/TLS if enabled
        if (process.env.MONGODB_TLS === 'true') {
            args.push('--ssl');
        }
        
        console.log("🚀 Running mongodump command...");
        
        // Execute mongodump
        const mongodump = spawn('mongodump', args);
        
        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';
            
            mongodump.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log(`📤 mongodump stdout: ${data.toString().trim()}`);
            });
            
            mongodump.stderr.on('data', (data) => {
                stderr += data.toString();
                console.error(`📥 mongodump stderr: ${data.toString().trim()}`);
            });
            
            mongodump.on('close', async (code) => {
                if (code === 0) {
                    console.log(`✅ Database backup completed successfully`);
                    console.log(`📁 Backup saved to: ${backupPath}`);
                    
                    // Create a backup manifest file
                    const manifest = {
                        backupName: backupName,
                        database: database,
                        timestamp: new Date().toISOString(),
                        size: await getBackupSize(backupPath),
                        collections: await getBackupCollections(backupPath),
                        status: 'completed'
                    };
                    
                    const manifestPath = path.join(backupPath, 'backup_manifest.json');
                    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
                    
                    console.log(`📄 Backup manifest created: ${manifestPath}`);
                    
                    // Clean up old backups (keep last 7 days)
                    await cleanupOldBackups();
                    
                    resolve({
                        success: true,
                        message: 'Database backup completed successfully',
                        backupPath: backupPath,
                        backupName: backupName,
                        timestamp: new Date().toISOString(),
                        size: manifest.size
                    });
                } else {
                    console.error(`❌ mongodump failed with code ${code}`);
                    reject({
                        success: false,
                        message: `Backup failed with code ${code}`,
                        error: stderr
                    });
                }
            });
            
            mongodump.on('error', (error) => {
                console.error(`❌ Failed to start mongodump: ${error.message}`);
                reject({
                    success: false,
                    message: `Failed to start backup process: ${error.message}`,
                    error: error.message
                });
            });
        });
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        return {
            success: false,
            message: 'Backup failed',
            error: error.message
        };
    }
}

async function getBackupSize(backupPath) {
    try {
        let totalSize = 0;
        
        function getSize(dir) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const itemPath = path.join(dir, item);
                const stats = fs.statSync(itemPath);
                if (stats.isDirectory()) {
                    getSize(itemPath);
                } else {
                    totalSize += stats.size;
                }
            });
        }
        
        getSize(backupPath);
        return formatBytes(totalSize);
    } catch (error) {
        return 'Unknown';
    }
}

async function getBackupCollections(backupPath) {
    try {
        const collections = [];
        const dbPath = path.join(backupPath, DB_NAME);
        
        if (fs.existsSync(dbPath)) {
            const items = fs.readdirSync(dbPath);
            items.forEach(item => {
                if (item.endsWith('.bson.gz') || item.endsWith('.bson')) {
                    collections.push(item.replace(/\.(bson\.gz|bson)$/, ''));
                }
            });
        }
        
        return collections;
    } catch (error) {
        return [];
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function cleanupOldBackups() {
    try {
        console.log("🧹 Cleaning up old backups...");
        
        const maxBackupAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const now = Date.now();
        
        const backupDirs = fs.readdirSync(BACKUP_DIR)
            .filter(dir => dir.startsWith('cil_backup_'))
            .map(dir => ({
                name: dir,
                path: path.join(BACKUP_DIR, dir),
                time: fs.statSync(path.join(BACKUP_DIR, dir)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time); // Sort by newest first
        
        // Keep the 10 most recent backups as a safety measure
        const backupsToKeep = backupDirs.slice(0, 10);
        const backupsToDelete = backupDirs.slice(10);
        
        // Also delete backups older than 7 days
        const oldBackups = backupDirs.filter(backup => (now - backup.time) > maxBackupAge);
        
        const allBackupsToDelete = [...new Set([...backupsToDelete, ...oldBackups])];
        
        for (const backup of allBackupsToDelete) {
            try {
                fs.rmSync(backup.path, { recursive: true, force: true });
                console.log(`🗑️  Deleted old backup: ${backup.name}`);
            } catch (error) {
                console.error(`❌ Failed to delete backup ${backup.name}:`, error.message);
            }
        }
        
        console.log(`✅ Cleanup completed. Kept ${backupsToKeep.length} recent backups.`);
        
    } catch (error) {
        console.error('❌ Error cleaning up old backups:', error.message);
    }
}

async function listBackups() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            return { success: true, backups: [], message: 'No backup directory found' };
        }
        
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(dir => dir.startsWith('cil_backup_'))
            .map(dir => {
                const backupPath = path.join(BACKUP_DIR, dir);
                const manifestPath = path.join(backupPath, 'backup_manifest.json');
                const stats = fs.statSync(backupPath);
                
                let manifest = {};
                if (fs.existsSync(manifestPath)) {
                    try {
                        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    } catch (error) {
                        console.error(`Error reading manifest for ${dir}:`, error.message);
                    }
                }
                
                return {
                    name: dir,
                    path: backupPath,
                    size: manifest.size || 'Unknown',
                    timestamp: manifest.timestamp || stats.mtime.toISOString(),
                    collections: manifest.collections || [],
                    status: manifest.status || 'unknown'
                };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first
        
        return {
            success: true,
            backups: backups,
            total: backups.length,
            backupDir: BACKUP_DIR
        };
        
    } catch (error) {
        console.error('❌ Error listing backups:', error.message);
        return {
            success: false,
            message: 'Error listing backups',
            error: error.message
        };
    }
}

async function restoreBackup(backupName) {
    try {
        console.log(`🔄 Starting restore from backup: ${backupName}`);
        
        const backupPath = path.join(BACKUP_DIR, backupName);
        const dbPath = path.join(backupPath, DB_NAME);
        
        if (!fs.existsSync(backupPath)) {
            return {
                success: false,
                message: `Backup ${backupName} not found`
            };
        }
        
        if (!fs.existsSync(dbPath)) {
            return {
                success: false,
                message: `Database backup not found in ${backupName}`
            };
        }
        
        // Extract connection details from MONGODB_URL
        const url = new URL(MONGODB_URL);
        const host = url.hostname;
        const port = url.port || 27017;
        const username = url.username;
        const password = url.password;
        const database = url.pathname.substring(1) || DB_NAME;
        
        // Build mongorestore command
        const args = [
            '--host', host,
            '--port', port.toString(),
            '--db', database,
            '--drop', // Drop existing collections before restore
            path.join(dbPath, ''),
            '--gzip'
        ];
        
        // Add authentication if provided
        if (username && password) {
            args.push('--username', username);
            args.push('--password', password);
            args.push('--authenticationDatabase', 'admin');
        }
        
        // Add SSL/TLS if enabled
        if (process.env.MONGODB_TLS === 'true') {
            args.push('--ssl');
        }
        
        console.log("🚀 Running mongorestore command...");
        
        // Execute mongorestore
        const mongorestore = spawn('mongorestore', args);
        
        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';
            
            mongorestore.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log(`📤 mongorestore stdout: ${data.toString().trim()}`);
            });
            
            mongorestore.stderr.on('data', (data) => {
                stderr += data.toString();
                console.error(`📥 mongorestore stderr: ${data.toString().trim()}`);
            });
            
            mongorestore.on('close', (code) => {
                if (code === 0) {
                    console.log(`✅ Database restore completed successfully from ${backupName}`);
                    resolve({
                        success: true,
                        message: `Database restored successfully from ${backupName}`,
                        backup: backupName,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    console.error(`❌ mongorestore failed with code ${code}`);
                    reject({
                        success: false,
                        message: `Restore failed with code ${code}`,
                        error: stderr
                    });
                }
            });
            
            mongorestore.on('error', (error) => {
                console.error(`❌ Failed to start mongorestore: ${error.message}`);
                reject({
                    success: false,
                    message: `Failed to start restore process: ${error.message}`,
                    error: error.message
                });
            });
        });
        
    } catch (error) {
        console.error('❌ Restore failed:', error.message);
        return {
            success: false,
            message: 'Restore failed',
            error: error.message
        };
    }
}

/* =========================================================
   COLLECTION INITIALIZATION
========================================================= */

async function initializeCollections() {
    try {
        // Create collections if they don't exist
        const collections = [
            'users',
            'customers',
            'investors',
            'admins',
            'orders',
            'products',
            'emails',
            'investments',
            'payments',
            'notifications',
            'user_activity',
            'emergency_logs',
            'kyc_verifications',
            'kyc_documents',
            'admin_review_tasks',
            'email_verifications',
            'phone_verifications',
            'admin_audit_log',
            'tier_access',
            'payment_transactions',
            'bank_accounts',
            'investment_portfolios',
            'customer_preferences',
            'investor_preferences',
            'welcome_messages',
            'auto_verification_logs',
            'sms_notifications',
            'email_templates',
            'backup_logs'
        ];

        for (const colName of collections) {
            const collectionsList = await database.listCollections({ name: colName }).toArray();
            if (collectionsList.length === 0) {
                await database.createCollection(colName);
                console.log(`✅ Created collection: ${colName}`);
            }
        }

        // Create indexes
        await createIndexes();
        
        // Initialize default admin
        await initializeDefaultAdmin();
        
        // Initialize default tier access levels
        await initializeTierAccess();
        
        // Initialize email templates
        await initializeEmailTemplates();
        
    } catch (error) {
        console.error("Error initializing collections:", error.message);
    }
}

async function createIndexes() {
    const indexes = [
        // Users indexes
        { collection: 'users', index: { email: 1 }, options: { unique: true } },
        { collection: 'users', index: { phone: 1 }, options: { unique: true } },
        { collection: 'users', index: { userId: 1 }, options: { unique: true } },
        { collection: 'users', index: { verificationToken: 1 }, options: { sparse: true } },
        { collection: 'users', index: { accountType: 1 } },
        { collection: 'users', index: { kycStatus: 1 } },
        { collection: 'users', index: { tierLevel: 1 } },
        { collection: 'users', index: { createdAt: -1 } },
        
        // Customers indexes
        { collection: 'customers', index: { email: 1 }, options: { unique: true } },
        { collection: 'customers', index: { phone: 1 }, options: { unique: true } },
        { collection: 'customers', index: { userId: 1 }, options: { unique: true } },
        
        // Investors indexes
        { collection: 'investors', index: { email: 1 }, options: { unique: true } },
        { collection: 'investors', index: { phone: 1 }, options: { unique: true } },
        { collection: 'investors', index: { userId: 1 }, options: { unique: true } },
        { collection: 'investors', index: { investorId: 1 }, options: { unique: true } },
        { collection: 'investors', index: { accreditationStatus: 1 } },
        { collection: 'investors', index: { kycStatus: 1 } },
        
        // Orders indexes
        { collection: 'orders', index: { orderNumber: 1 }, options: { unique: true } },
        { collection: 'orders', index: { customerEmail: 1 } },
        { collection: 'orders', index: { customerPhone: 1 } },
        { collection: 'orders', index: { status: 1 } },
        { collection: 'orders', index: { createdAt: -1 } },
        
        // Payments indexes
        { collection: 'payments', index: { paymentReference: 1 }, options: { unique: true } },
        { collection: 'payments', index: { userId: 1 } },
        { collection: 'payments', index: { status: 1 } },
        { collection: 'payments', index: { paymentMethod: 1 } },
        { collection: 'payments', index: { createdAt: -1 } },
        
        // KYC indexes
        { collection: 'kyc_verifications', index: { userId: 1 }, options: { unique: true } },
        { collection: 'kyc_verifications', index: { status: 1 } },
        { collection: 'kyc_verifications', index: { submittedAt: -1 } },
        
        // Email verifications
        { collection: 'email_verifications', index: { email: 1, token: 1 }, options: { unique: true } },
        { collection: 'email_verifications', index: { expiresAt: 1 } },
        
        // Phone verifications
        { collection: 'phone_verifications', index: { phone: 1, code: 1 }, options: { unique: true } },
        { collection: 'phone_verifications', index: { expiresAt: 1 } },
        
        // Notifications
        { collection: 'notifications', index: { userId: 1 } },
        { collection: 'notifications', index: { read: 1 } },
        { collection: 'notifications', index: { createdAt: -1 } },
        
        // Tier access
        { collection: 'tier_access', index: { tierName: 1 }, options: { unique: true } },
        { collection: 'tier_access', index: { level: 1 } },
        
        // Investment indexes
        { collection: 'investments', index: { userId: 1 } },
        { collection: 'investments', index: { investmentId: 1 }, options: { unique: true } },
        { collection: 'investments', index: { status: 1 } },
        { collection: 'investments', index: { sector: 1 } },
        
        // Email templates
        { collection: 'email_templates', index: { templateName: 1 }, options: { unique: true } },
        { collection: 'email_templates', index: { templateType: 1 } },
        
        // Backup logs
        { collection: 'backup_logs', index: { timestamp: -1 } },
        { collection: 'backup_logs', index: { status: 1 } }
    ];

    for (const { collection: colName, index, options } of indexes) {
        try {
            await database.collection(colName).createIndex(index, options);
            console.log(`✅ Created index for ${colName}:`, JSON.stringify(index));
        } catch (error) {
            console.warn(`⚠️ Could not create index for ${colName}:`, error.message);
        }
    }
}

async function initializeDefaultAdmin() {
    const adminCount = await database.collection("admins").countDocuments();
    if (adminCount === 0) {
        const hash = await bcrypt.hash("Admin@123", 12);
        await database.collection("admins").insertOne({
            email: "admin@cil.com",
            password: hash,
            role: "super_admin",
            isActive: true,
            name: "System Administrator",
            permissions: ['all'],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log("🔐 Default Admin Created → admin@cil.com / Admin@123");
        console.log("⚠️ CHANGE DEFAULT PASSWORD IMMEDIATELY!");
    }
}

async function initializeTierAccess() {
    const tiers = [
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        },
        {
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
            createdAt: new Date()
        }
    ];

    for (const tier of tiers) {
        const existingTier = await database.collection("tier_access").findOne({ tierName: tier.tierName });
        if (!existingTier) {
            await database.collection("tier_access").insertOne(tier);
            console.log(`✅ Created tier: ${tier.name}`);
        }
    }
}

async function initializeEmailTemplates() {
    const templates = [
        {
            templateName: 'welcome_customer',
            templateType: 'welcome',
            subject: 'Welcome to CIL - Your Customer Account is Ready!',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #d69e2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Collaborative Investment Ltd!</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p>On behalf of the entire CIL team, welcome to our community!</p>
        <p>Your customer account has been successfully created. Here's what you can do now:</p>
        <ul>
            <li>Shop thousands of quality products across 8 business sectors</li>
            <li>Track your orders in real-time</li>
            <li>Manage your profile and preferences</li>
            <li>Receive exclusive deals and discounts</li>
        </ul>
        <p><strong>Account Details:</strong></p>
        <p>Email: {{email}}<br>
        Account Type: Customer<br>
        Status: Active</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardLink}}" class="button">Go to Your Dashboard</a>
        </p>
        <p>We're committed to providing you with the best shopping experience.</p>
        <p>Best regards,<br>
        <strong>CIL Management Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Welcome to Collaborative Investment Ltd!

Dear {{firstName}},

On behalf of the entire CIL team, welcome to our community!

Your customer account has been successfully created.

Account Details:
- Email: {{email}}
- Account Type: Customer
- Status: Active

What you can do now:
1. Shop thousands of quality products across 8 business sectors
2. Track your orders in real-time
3. Manage your profile and preferences
4. Receive exclusive deals and discounts

Go to your dashboard: {{dashboardLink}}

We're committed to providing you with the best shopping experience.

Best regards,
CIL Management Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'email', 'dashboardLink'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'welcome_investor',
            templateType: 'welcome',
            subject: 'Welcome to CIL - Your Investor Journey Begins!',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .highlight { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to CIL Investments!</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p>On behalf of our CEO and management team, welcome to Collaborative Investment Ltd!</p>
        <p>Your investor account has been successfully created. We're excited to partner with you on your investment journey.</p>
        
        <div class="highlight">
            <p><strong>Investor Details:</strong></p>
            <p>Investor ID: {{investorId}}<br>
            Email: {{email}}<br>
            Account Type: Investor<br>
            Minimum Investment: ₦5,000,000</p>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ol>
            <li>Complete your KYC verification for full access</li>
            <li>Explore investment opportunities in our dashboard</li>
            <li>Connect with your assigned account manager</li>
            <li>Start your first investment (minimum ₦5,000,000)</li>
        </ol>
        
        <p><strong>Benefits of investing with CIL:</strong></p>
        <ul>
            <li>Asset-backed security on all investments</li>
            <li>Professional portfolio management</li>
            <li>Monthly performance reports</li>
            <li>Expected ROI: 18-38% depending on sector</li>
            <li>Dedicated support team</li>
        </ul>
        
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardLink}}" class="button">Access Investor Dashboard</a>
        </p>
        
        <p>A dedicated account manager will contact you within 24 hours to discuss your investment goals.</p>
        
        <p>Welcome aboard,<br>
        <strong>CIL CEO & Management Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Welcome to CIL Investments!

Dear {{firstName}},

On behalf of our CEO and management team, welcome to Collaborative Investment Ltd!

Your investor account has been successfully created. We're excited to partner with you on your investment journey.

Investor Details:
- Investor ID: {{investorId}}
- Email: {{email}}
- Account Type: Investor
- Minimum Investment: ₦5,000,000

Next Steps:
1. Complete your KYC verification for full access
2. Explore investment opportunities in our dashboard
3. Connect with your assigned account manager
4. Start your first investment (minimum ₦5,000,000)

Benefits of investing with CIL:
- Asset-backed security on all investments
- Professional portfolio management
- Monthly performance reports
- Expected ROI: 18-38% depending on sector
- Dedicated support team

Access your dashboard: {{dashboardLink}}

A dedicated account manager will contact you within 24 hours to discuss your investment goals.

Welcome aboard,
CIL CEO & Management Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'investorId', 'email', 'dashboardLink'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'payment_confirmation',
            templateType: 'transaction',
            subject: 'Payment Confirmation - CIL Account',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .receipt { background: white; padding: 20px; border-radius: 5px; border: 1px solid #e2e8f0; margin: 20px 0; }
        .success { color: #38a169; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Payment Received!</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p class="success">✅ Your payment has been successfully processed!</p>
        
        <div class="receipt">
            <h3>Payment Details</h3>
            <p><strong>Amount:</strong> ₦{{amountFormatted}}</p>
            <p><strong>Reference:</strong> {{reference}}</p>
            <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
            <p><strong>Purpose:</strong> {{purpose}}</p>
            <p><strong>Date:</strong> {{date}}</p>
            <p><strong>Status:</strong> <span class="success">Completed</span></p>
        </div>
        
        <p>This transaction has been recorded in your account. You can view it in your dashboard under "Transaction History".</p>
        
        <p>Thank you for choosing Collaborative Investment Ltd!</p>
        
        <p>Best regards,<br>
        <strong>CIL Finance Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Payment Received!

Dear {{firstName}},

✅ Your payment has been successfully processed!

Payment Details:
- Amount: ₦{{amountFormatted}}
- Reference: {{reference}}
- Payment Method: {{paymentMethod}}
- Purpose: {{purpose}}
- Date: {{date}}
- Status: Completed

This transaction has been recorded in your account. You can view it in your dashboard under "Transaction History".

Thank you for choosing Collaborative Investment Ltd!

Best regards,
CIL Finance Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'amountFormatted', 'reference', 'paymentMethod', 'purpose', 'date'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'kyc_reminder',
            templateType: 'kyc',
            subject: 'Complete Your KYC for Full Account Access',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #d69e2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .info-box { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Complete Your KYC Verification</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        <p>To unlock full access to your {{accountType}} account features, please complete your KYC (Know Your Customer) verification.</p>
        
        <div class="info-box">
            <p><strong>Required Documents:</strong></p>
            <ul>
                <li>Government-issued ID (Passport, Driver's License, National ID)</li>
                <li>Proof of Address (Utility bill, Bank statement)</li>
                <li>Bank Statement (last 3 months)</li>
                {{#if isInvestor}}
                <li>Proof of Income/Source of Funds</li>
                <li>Investment Experience Questionnaire</li>
                {{/if}}
            </ul>
        </div>
        
        <p><strong>Benefits of KYC Verification:</strong></p>
        <ul>
            <li>Full account access</li>
            <li>Higher transaction limits</li>
            <li>Priority customer support</li>
            {{#if isInvestor}}
            <li>Access to all investment opportunities</li>
            <li>Dedicated account manager</li>
            {{/if}}
        </ul>
        
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{kycLink}}" class="button">Start KYC Verification</a>
        </p>
        
        <p>If you have any questions, our support team is here to help.</p>
        
        <p>Best regards,<br>
        <strong>CIL Compliance Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Complete Your KYC Verification

Dear {{firstName}},

To unlock full access to your {{accountType}} account features, please complete your KYC (Know Your Customer) verification.

Required Documents:
1. Government-issued ID (Passport, Driver's License, National ID)
2. Proof of Address (Utility bill, Bank statement)
3. Bank Statement (last 3 months)
{{#if isInvestor}}
4. Proof of Income/Source of Funds
5. Investment Experience Questionnaire
{{/if}}

Benefits of KYC Verification:
- Full account access
- Higher transaction limits
- Priority customer support
{{#if isInvestor}}
- Access to all investment opportunities
- Dedicated account manager
{{/if}}

Start your KYC verification here: {{kycLink}}

If you have any questions, our support team is here to help.

Best regards,
CIL Compliance Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'accountType', 'kycLink', 'isInvestor'],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            templateName: 'auto_verification_success',
            templateType: 'verification',
            subject: 'Auto-Verification Successful - Your Account is Ready!',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .success { color: #38a169; font-weight: bold; font-size: 18px; }
        .tier-box { background: white; padding: 20px; border-radius: 5px; border: 1px solid #e2e8f0; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Auto-Verification Complete! 🎉</h1>
    </div>
    <div class="content">
        <p>Dear {{firstName}},</p>
        
        <p class="success">✅ Your {{verificationMethod}} verification was successful!</p>
        
        <p>We've automatically verified your account using our fast verification system.</p>
        
        <div class="tier-box">
            <h3>Your Current Access Tier: {{tierName}}</h3>
            <p><strong>Features Available:</strong></p>
            <ul>
                {{#each features}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </div>
        
        <p><strong>Next Steps for Full Access:</strong></p>
        <ol>
            <li>Complete your profile information</li>
            <li>Set up your security preferences</li>
            <li>Start exploring your dashboard</li>
            {{#if requiresKYC}}
            <li>Complete KYC for maximum access</li>
            {{/if}}
        </ol>
        
        <p>Thank you for choosing our fast verification process!</p>
        
        <p>Best regards,<br>
        <strong>CIL Verification Team</strong></p>
    </div>
    <div class="footer">
        <p>Collaborative Investment Ltd<br>
        212 Ijegun Road, Ikotun, Lagos<br>
        📞 +234 812 997 8419 | 📧 collaborativeinvestmentltd@gmail.com</p>
    </div>
</body>
</html>`,
            text: `Auto-Verification Complete! 🎉

Dear {{firstName}},

✅ Your {{verificationMethod}} verification was successful!

We've automatically verified your account using our fast verification system.

Your Current Access Tier: {{tierName}}

Features Available:
{{#each features}}
- {{this}}
{{/each}}

Next Steps for Full Access:
1. Complete your profile information
2. Set up your security preferences
3. Start exploring your dashboard
{{#if requiresKYC}}
4. Complete KYC for maximum access
{{/if}}

Thank you for choosing our fast verification process!

Best regards,
CIL Verification Team

---
Collaborative Investment Ltd
212 Ijegun Road, Ikotun, Lagos
📞 +234 812 997 8419
📧 collaborativeinvestmentltd@gmail.com`,
            variables: ['firstName', 'verificationMethod', 'tierName', 'features', 'requiresKYC'],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    for (const template of templates) {
        const existingTemplate = await database.collection("email_templates").findOne({ templateName: template.templateName });
        if (!existingTemplate) {
            await database.collection("email_templates").insertOne(template);
            console.log(`✅ Created email template: ${template.templateName}`);
        }
    }
}

/* =========================================================
   DATABASE OPERATIONS
========================================================= */

const db = {
    /* ---------------- CORE OPERATIONS ---------------- */
    
    collection(name) {
        if (!database) {
            throw new Error("Database not connected. Call connectDB() first.");
        }
        return database.collection(name);
    },

    toObjectId(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
        }
        return new ObjectId(id);
    },

    isValidObjectId(id) {
        return ObjectId.isValid(id);
    },

    async getAll(col, query = {}, sort = {}, limit = 0) {
        let cursor = this.collection(col).find(query);
        if (Object.keys(sort).length) cursor = cursor.sort(sort);
        if (limit) cursor = cursor.limit(limit);
        return cursor.toArray();
    },

    async getOne(col, query) {
        return this.collection(col).findOne(query);
    },

    async getById(col, id) {
        if (!this.isValidObjectId(id)) return null;
        return this.collection(col).findOne({ _id: this.toObjectId(id) });
    },

    async create(col, data) {
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const result = await this.collection(col).insertOne(data);
        return { _id: result.insertedId, ...data };
    },

    async update(col, query, update) {
        if (!update.$set) update.$set = {};
        update.$set.updatedAt = new Date();
        return (await this.collection(col).updateOne(query, update)).modifiedCount > 0;
    },

    async updateWithOperators(col, query, operators) {
        if (!operators.$set) operators.$set = {};
        operators.$set.updatedAt = new Date();
        return (await this.collection(col).updateOne(query, operators)).modifiedCount > 0;
    },

    async count(col, query = {}) {
        return this.collection(col).countDocuments(query);
    },

    async delete(col, query) {
        return (await this.collection(col).deleteOne(query)).deletedCount > 0;
    },

    async findAndUpdate(col, query, update) {
        update.$set = update.$set || {};
        update.$set.updatedAt = new Date();
        return this.collection(col).findOneAndUpdate(
            query,
            update,
            { returnDocument: 'after' }
        );
    },

    /* ---------------- USER REGISTRATION ---------------- */

    async createUserWithVerification(userData) {
        const session = client.startSession();
        
        try {
            session.startTransaction();
            
            // Check if user already exists
            const existingUser = await this.collection('users').findOne({ 
                $or: [
                    { email: userData.email.toLowerCase() },
                    { phone: userData.phone }
                ]
            }, { session });
            
            if (existingUser) {
                await session.abortTransaction();
                return { 
                    success: false, 
                    message: existingUser.email === userData.email.toLowerCase() 
                        ? 'Email already registered' 
                        : 'Phone number already registered' 
                };
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Generate user ID
            const userId = `CIL-${userData.accountType.toUpperCase()}-${Date.now().toString().slice(-8)}`;
            
            // Determine verification status based on method
            let isVerified = false;
            let verificationStatus = 'pending';
            let verificationMethod = userData.verificationMethod || 'email';
            
            // Auto-verification logic
            if (verificationMethod === 'email' || verificationMethod === 'both') {
                // For auto-verification, we mark as verified immediately
                // In production, you would send verification email/code
                isVerified = true;
                verificationStatus = 'email_verified';
            }
            
            if (verificationMethod === 'phone' || verificationMethod === 'both') {
                // For auto-verification, we mark as verified immediately
                // In production, you would send SMS verification code
                isVerified = true;
                verificationStatus = verificationStatus === 'email_verified' ? 'fully_verified' : 'phone_verified';
            }
            
            // Determine tier based on verification
            const tierLevel = this.determineTierLevel(verificationStatus, userData.accountType);
            const tier = await this.getTierByLevel(tierLevel);
            
            // Prepare user data
            const user = {
                userId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.toLowerCase(),
                phone: userData.phone,
                password: hashedPassword,
                accountType: userData.accountType,
                role: userData.accountType,
                country: userData.country || 'nigeria',
                referralCode: userData.referral || '',
                verificationMethod: verificationMethod,
                verificationStatus: verificationStatus,
                isVerified: isVerified,
                verificationToken: this.generateVerificationToken(),
                acceptsTerms: userData.acceptsTerms || false,
                acceptsCommunications: userData.acceptsCommunications || false,
                tierLevel: tierLevel,
                tierName: tier.tierName,
                kycStatus: 'pending',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Insert user
            const userResult = await this.collection('users').insertOne(user, { session });
            
            // Create account-specific record
            if (userData.accountType === 'customer') {
                const customerData = {
                    userId: userId,
                    email: user.email,
                    phone: user.phone,
                    name: `${user.firstName} ${user.lastName}`,
                    preferences: userData.preferences || {},
                    shippingAddress: userData.preferences?.shippingAddress || '',
                    totalOrders: 0,
                    totalSpent: 0,
                    wishlist: [],
                    createdAt: new Date()
                };
                
                await this.collection('customers').insertOne(customerData, { session });
                
            } else if (userData.accountType === 'investor') {
                const investorId = `CIL-INV-${Date.now().toString().slice(-6)}`;
                
                const investorData = {
                    userId: userId,
                    investorId: investorId,
                    email: user.email,
                    phone: user.phone,
                    name: `${user.firstName} ${user.lastName}`,
                    investmentPreferences: userData.investmentPreferences || {},
                    totalInvestments: 0,
                    totalReturns: 0,
                    activeInvestments: 0,
                    preferredSectors: userData.investmentPreferences?.sectors || [],
                    riskProfile: 'moderate',
                    accreditationStatus: 'pending',
                    kycStatus: 'pending',
                    initialDeposit: userData.payment?.depositAmount || 0,
                    depositDate: userData.payment?.depositAmount > 0 ? new Date() : null,
                    investmentStatus: userData.payment?.depositAmount >= 5000000 ? 'pending_approval' : 'inactive',
                    createdAt: new Date()
                };
                
                await this.collection('investors').insertOne(investorData, { session });
                user.investorId = investorId;
            }
            
            // Handle initial deposit if provided
            if (userData.payment && userData.payment.depositAmount > 0 && !userData.payment.skipDeposit) {
                await this.createInitialDeposit(userId, userData.payment, user.accountType, session);
            }
            
            // Create auto-verification log
            await this.createAutoVerificationLog({
                userId: userId,
                email: user.email,
                phone: user.phone,
                verificationMethod: verificationMethod,
                verificationStatus: verificationStatus,
                tierAssigned: tier.tierName,
                isAutoVerified: true,
                timestamp: new Date()
            }, session);
            
            await session.commitTransaction();
            
            // Remove password from returned object
            const { password, ...safeUser } = user;
            
            return {
                success: true,
                message: 'Registration successful',
                user: safeUser,
                tier: tier
            };
            
        } catch (error) {
            await session.abortTransaction();
            console.error('Error creating user:', error);
            return { 
                success: false, 
                message: 'Error during registration' 
            };
        } finally {
            await session.endSession();
        }
    },

    generateVerificationToken() {
        return require('crypto').randomBytes(32).toString('hex');
    },

    determineTierLevel(verificationStatus, accountType) {
        const tierMap = {
            'pending': 1, // basic
            'email_verified': 2, // email_verified
            'phone_verified': 3, // phone_verified
            'fully_verified': 4 // fully_verified
        };
        
        let level = tierMap[verificationStatus] || 1;
        
        // Investors start at a higher tier if they meet minimum investment
        if (accountType === 'investor') {
            level = Math.max(level, 2); // Investors start at email_verified minimum
        }
        
        return level;
    },

    async getTierByLevel(level) {
        return this.collection('tier_access').findOne({ level: level });
    },

    async getTierByName(tierName) {
        return this.collection('tier_access').findOne({ tierName: tierName });
    },

    async createInitialDeposit(userId, paymentData, accountType, session) {
        const paymentReference = paymentData.paymentReference || `DEP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const payment = {
            userId: userId,
            userEmail: paymentData.email,
            userName: paymentData.name,
            amount: paymentData.depositAmount,
            paymentMethod: paymentData.paymentMethod || 'bank_transfer',
            paymentReference: paymentReference,
            purpose: 'initial_deposit',
            accountType: accountType,
            status: paymentData.skipDeposit ? 'skipped' : 'pending',
            paymentProof: paymentData.paymentProof || null,
            gatewayResponse: paymentData.gatewayResponse || null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // If using payment gateway, mark as completed
        if (paymentData.paymentMethod === 'paystack' || paymentData.paymentMethod === 'flutterwave') {
            payment.status = 'completed';
            payment.completedAt = new Date();
        }
        
        await this.collection('payments').insertOne(payment, { session });
        
        // Log transaction
        await this.collection('payment_transactions').insertOne({
            userId: userId,
            paymentId: payment._id,
            type: 'deposit',
            amount: paymentData.depositAmount,
            reference: paymentReference,
            status: payment.status,
            metadata: {
                accountType: accountType,
                purpose: 'initial_deposit',
                method: paymentData.paymentMethod
            },
            createdAt: new Date()
        }, { session });
        
        return payment;
    },

    async createAutoVerificationLog(logData, session = null) {
        const log = {
            ...logData,
            createdAt: new Date()
        };
        
        if (session) {
            return this.collection('auto_verification_logs').insertOne(log, { session });
        } else {
            return this.collection('auto_verification_logs').insertOne(log);
        }
    },

    /* ---------------- EMAIL TEMPLATES ---------------- */

    async getEmailTemplate(templateName) {
        return this.collection('email_templates').findOne({ templateName: templateName });
    },

    async renderEmailTemplate(templateName, variables) {
        const template = await this.getEmailTemplate(templateName);
        if (!template) return null;
        
        let html = template.html;
        let text = template.text;
        
        // Replace variables
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, value || '');
            text = text.replace(regex, value || '');
        }
        
        // Handle conditional blocks
        if (variables.isInvestor) {
            html = html.replace(/{{#if isInvestor}}/g, '').replace(/{{\/if}}/g, '');
            text = text.replace(/{{#if isInvestor}}/g, '').replace(/{{\/if}}/g, '');
        } else {
            html = html.replace(/{{#if isInvestor}}[\s\S]*?{{\/if}}/g, '');
            text = text.replace(/{{#if isInvestor}}[\s\S]*?{{\/if}}/g, '');
        }
        
        if (variables.requiresKYC) {
            html = html.replace(/{{#if requiresKYC}}/g, '').replace(/{{\/if}}/g, '');
            text = text.replace(/{{#if requiresKYC}}/g, '').replace(/{{\/if}}/g, '');
        } else {
            html = html.replace(/{{#if requiresKYC}}[\s\S]*?{{\/if}}/g, '');
            text = text.replace(/{{#if requiresKYC}}[\s\S]*?{{\/if}}/g, '');
        }
        
        // Replace feature list
        if (variables.features && Array.isArray(variables.features)) {
            let featuresHtml = '';
            let featuresText = '';
            
            variables.features.forEach(feature => {
                featuresHtml += `<li>${feature}</li>`;
                featuresText += `- ${feature}\n`;
            });
            
            html = html.replace(/{{#each features}}[\s\S]*?{{\/each}}/g, featuresHtml);
            text = text.replace(/{{#each features}}[\s\S]*?{{\/each}}/g, featuresText);
        }
        
        return {
            subject: template.subject,
            html: html,
            text: text
        };
    },

    /* ---------------- KYC MANAGEMENT ---------------- */

    async createKYCRequest(userId, userData) {
        const kycRequest = {
            userId: userId,
            userEmail: userData.email,
            userName: `${userData.firstName} ${userData.lastName}`,
            accountType: userData.accountType,
            status: 'pending',
            submittedAt: new Date(),
            documentsRequired: [
                'government_id',
                'proof_of_address',
                'bank_statement'
            ],
            documentsSubmitted: [],
            verificationLevel: 'basic',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        if (userData.accountType === 'investor') {
            kycRequest.documentsRequired.push('proof_of_income');
            kycRequest.documentsRequired.push('investment_experience');
            kycRequest.verificationLevel = 'enhanced';
        }
        
        const result = await this.collection('kyc_verifications').insertOne(kycRequest);
        
        // Update user KYC status
        await this.collection('users').updateOne(
            { userId: userId },
            { $set: { kycStatus: 'pending', updatedAt: new Date() } }
        );
        
        if (userData.accountType === 'investor') {
            await this.collection('investors').updateOne(
                { userId: userId },
                { $set: { kycStatus: 'pending', updatedAt: new Date() } }
            );
        }
        
        return { ...kycRequest, _id: result.insertedId };
    },

    async uploadKYCDocument(userId, documentData) {
        const document = {
            userId: userId,
            documentType: documentData.documentType,
            documentName: documentData.documentName,
            fileUrl: documentData.fileUrl,
            fileSize: documentData.fileSize,
            mimeType: documentData.mimeType,
            status: 'pending_review',
            uploadedAt: new Date(),
            verifiedAt: null,
            verifiedBy: null,
            createdAt: new Date()
        };
        
        const result = await this.collection('kyc_documents').insertOne(document);
        
        // Add to KYC request
        await this.collection('kyc_verifications').updateOne(
            { userId: userId },
            { 
                $push: { 
                    documentsSubmitted: {
                        documentId: result.insertedId,
                        documentType: documentData.documentType,
                        uploadedAt: new Date()
                    }
                },
                $set: { updatedAt: new Date() }
            }
        );
        
        return { ...document, _id: result.insertedId };
    },

    async updateKYCStatus(userId, status, verifiedBy = null, notes = '') {
        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        
        if (verifiedBy) {
            updateData.verifiedBy = verifiedBy;
            updateData.verifiedAt = new Date();
        }
        
        if (notes) {
            updateData.verificationNotes = notes;
        }
        
        await this.collection('kyc_verifications').updateOne(
            { userId: userId },
            { $set: updateData }
        );
        
        // Update user tier if KYC is approved
        if (status === 'approved') {
            const user = await this.collection('users').findOne({ userId: userId });
            const newTierLevel = user.accountType === 'investor' ? 6 : 5; // investor_premium or kyc_verified
            const tier = await this.getTierByLevel(newTierLevel);
            
            await this.collection('users').updateOne(
                { userId: userId },
                { 
                    $set: { 
                        kycStatus: 'verified',
                        tierLevel: newTierLevel,
                        tierName: tier.tierName,
                        updatedAt: new Date()
                    }
                }
            );
            
            if (user.accountType === 'investor') {
                await this.collection('investors').updateOne(
                    { userId: userId },
                    { 
                        $set: { 
                            kycStatus: 'verified',
                            accreditationStatus: 'accredited',
                            updatedAt: new Date()
                        }
                    }
                );
            }
            
            return tier;
        } else if (status === 'rejected') {
            await this.collection('users').updateOne(
                { userId: userId },
                { 
                    $set: { 
                        kycStatus: 'rejected',
                        updatedAt: new Date()
                    }
                }
            );
            
            if (user.accountType === 'investor') {
                await this.collection('investors').updateOne(
                    { userId: userId },
                    { 
                        $set: { 
                            kycStatus: 'rejected',
                            updatedAt: new Date()
                        }
                    }
                );
            }
        }
        
        return null;
    },

    /* ---------------- PAYMENT GATEWAY INTEGRATION ---------------- */

    async createPaymentGatewayTransaction(paymentData) {
        const transaction = {
            userId: paymentData.userId,
            userEmail: paymentData.email,
            amount: paymentData.amount,
            currency: paymentData.currency || 'NGN',
            gateway: paymentData.gateway, // 'paystack', 'flutterwave', 'bank_transfer'
            reference: paymentData.reference,
            purpose: paymentData.purpose || 'deposit',
            metadata: paymentData.metadata || {},
            status: 'initiated',
            gatewayResponse: null,
            callbackData: null,
            requiresVerification: paymentData.gateway === 'bank_transfer',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await this.collection('payment_transactions').insertOne(transaction);
        
        // If bank transfer, create verification task
        if (paymentData.gateway === 'bank_transfer' && paymentData.paymentProof) {
            await this.createBankTransferVerification({
                transactionId: result.insertedId,
                userId: paymentData.userId,
                amount: paymentData.amount,
                reference: paymentData.reference,
                paymentProof: paymentData.paymentProof,
                bankDetails: paymentData.bankDetails
            });
        }
        
        return { ...transaction, _id: result.insertedId };
    },

    async createBankTransferVerification(transferData) {
        const verification = {
            transactionId: transferData.transactionId,
            userId: transferData.userId,
            amount: transferData.amount,
            reference: transferData.reference,
            paymentProof: transferData.paymentProof,
            bankDetails: transferData.bankDetails,
            status: 'pending_review',
            reviewedBy: null,
            reviewedAt: null,
            reviewNotes: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await this.collection('bank_transfer_verifications').insertOne(verification);
        
        // Create admin review task
        await this.createAdminReviewTask({
            type: 'bank_transfer_verification',
            referenceId: result.insertedId,
            title: `Bank Transfer Verification - ₦${transferData.amount.toLocaleString()}`,
            description: `Verify bank transfer for user ${transferData.userId}`,
            priority: 'medium',
            assignedTo: null,
            status: 'pending'
        });
        
        return { ...verification, _id: result.insertedId };
    },

    async createAdminReviewTask(taskData) {
        const task = {
            type: taskData.type,
            referenceId: taskData.referenceId,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority || 'medium',
            assignedTo: taskData.assignedTo,
            status: taskData.status || 'pending',
            dueDate: taskData.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            completedAt: null,
            completedBy: null,
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        return this.collection('admin_review_tasks').insertOne(task);
    },

    async updatePaymentTransactionStatus(transactionId, status, gatewayResponse = null) {
        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        
        if (gatewayResponse) {
            updateData.gatewayResponse = gatewayResponse;
            updateData.callbackData = gatewayResponse;
        }
        
        if (status === 'completed') {
            updateData.completedAt = new Date();
        } else if (status === 'failed') {
            updateData.failedAt = new Date();
        }
        
        await this.collection('payment_transactions').updateOne(
            { _id: this.toObjectId(transactionId) },
            { $set: updateData }
        );
        
        // Update payment record if exists
        const transaction = await this.collection('payment_transactions').findOne({ _id: this.toObjectId(transactionId) });
        if (transaction) {
            await this.collection('payments').updateOne(
                { paymentReference: transaction.reference },
                { 
                    $set: { 
                        status: status,
                        gatewayResponse: gatewayResponse,
                        updatedAt: new Date()
                    }
                }
            );
        }
        
        return true;
    },

    /* ---------------- NOTIFICATION SYSTEM ---------------- */

    async createNotification(notificationData) {
        const notification = {
            userId: notificationData.userId,
            type: notificationData.type, // 'email', 'sms', 'system', 'investment', 'payment', 'kyc'
            title: notificationData.title,
            message: notificationData.message,
            priority: notificationData.priority || 'medium',
            read: false,
            readAt: null,
            metadata: notificationData.metadata || {},
            createdAt: new Date(),
            expiresAt: notificationData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        };
        
        const result = await this.collection('notifications').insertOne(notification);
        
        // Log SMS notification if type is sms
        if (notificationData.type === 'sms') {
            await this.logSMSNotification({
                userId: notificationData.userId,
                phone: notificationData.phone,
                message: notificationData.message,
                status: 'sent',
                notificationId: result.insertedId,
                sentAt: new Date()
            });
        }
        
        return { ...notification, _id: result.insertedId };
    },

    async logSMSNotification(smsData) {
        const smsLog = {
            userId: smsData.userId,
            phone: smsData.phone,
            message: smsData.message.substring(0, 500), // Truncate long messages
            status: smsData.status || 'sent',
            notificationId: smsData.notificationId,
            provider: smsData.provider || 'default',
            messageId: smsData.messageId,
            error: smsData.error,
            sentAt: smsData.sentAt || new Date(),
            deliveredAt: smsData.deliveredAt,
            createdAt: new Date()
        };
        
        return this.collection('sms_notifications').insertOne(smsLog);
    },

    async markNotificationAsRead(notificationId, userId) {
        return this.collection('notifications').updateOne(
            { _id: this.toObjectId(notificationId), userId: userId },
            { 
                $set: { 
                    read: true,
                    readAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );
    },

    async getUserNotifications(userId, limit = 50, unreadOnly = false) {
        const query = { userId: userId };
        if (unreadOnly) {
            query.read = false;
        }
        
        return this.collection('notifications')
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    },

    /* ---------------- USER ACTIVITY LOGGING ---------------- */

    async logUserActivity(activityData) {
        const activity = {
            userId: activityData.userId,
            userEmail: activityData.userEmail,
            activityType: activityData.activityType, // 'login', 'registration', 'investment', 'payment', 'profile_update', 'kyc_submission'
            description: activityData.description,
            ipAddress: activityData.ipAddress,
            userAgent: activityData.userAgent,
            metadata: activityData.metadata || {},
            timestamp: new Date(),
            createdAt: new Date()
        };
        
        return this.collection('user_activity').insertOne(activity);
    },

    /* ---------------- ADMIN AUTH ---------------- */

    async getAdminByEmail(email) {
        return this.collection("admins").findOne({
            email: email.toLowerCase(),
            isActive: true
        });
    },

    async verifyAdminCredentials(email, password) {
        const admin = await this.getAdminByEmail(email);
        if (!admin) {
            return { success: false, message: "Invalid credentials" };
        }

        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) {
            return { success: false, message: "Invalid credentials" };
        }

        await this.collection("admins").updateOne(
            { _id: admin._id },
            { $set: { lastLogin: new Date() } }
        );

        // Create safe admin object without password
        const { password: _, ...safeAdmin } = admin;
        return { success: true, admin: safeAdmin };
    },

    /* ---------------- ORDERS ---------------- */

    async getOrderByNumber(orderNumber) {
        return this.collection("orders").findOne({
            orderNumber: { $regex: new RegExp(`^${orderNumber}$`, "i") }
        });
    },

    async updateOrderStatus(orderId, status, by) {
        if (!this.isValidObjectId(orderId)) return false;

        return (await this.collection("orders").updateOne(
            { _id: this.toObjectId(orderId) },
            {
                $set: { status, updatedAt: new Date() },
                $push: {
                    statusHistory: {
                        status,
                        date: new Date(),
                        by
                    }
                }
            }
        )).modifiedCount > 0;
    },

    /* ---------------- EMAILS ---------------- */

    async logEmail(to, subject, body, status = "sent", type = "transactional") {
        await this.collection("emails").insertOne({
            to,
            subject,
            body,
            status,
            type,
            sentAt: new Date(),
            createdAt: new Date()
        });
    },

    async getRecentEmails(limit = 50) {
        return this.collection("emails")
            .find({})
            .sort({ sentAt: -1 })
            .limit(limit)
            .toArray();
    },

    /* ---------------- STATS ---------------- */

    async getStats() {
        const [orders, products, customers, emails, users, investors, payments] = await Promise.all([
            this.count("orders"),
            this.count("products"),
            this.count("customers"),
            this.count("emails"),
            this.count("users"),
            this.count("investors"),
            this.count("payments", { status: 'completed' })
        ]);

        // Get recent registrations
        const recentUsers = await this.collection("users")
            .find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();

        // Get active investments
        const activeInvestments = await this.count("investments", { status: 'active' });

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
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                accountType: user.accountType,
                createdAt: user.createdAt
            })),
            generatedAt: new Date()
        };
    },

    /* ---------------- USER MANAGEMENT ---------------- */

    async getUserByEmail(email) {
        return this.collection("users").findOne({ 
            email: email.toLowerCase(),
            status: 'active' 
        });
    },

    async getUserByPhone(phone) {
        return this.collection("users").findOne({ 
            phone: phone,
            status: 'active' 
        });
    },

    async getUserByUserId(userId) {
        return this.collection("users").findOne({ userId: userId });
    },

    async getCustomerByUserId(userId) {
        return this.collection("customers").findOne({ userId: userId });
    },

    async getInvestorByUserId(userId) {
        return this.collection("investors").findOne({ userId: userId });
    },

    async updateUserVerification(userId, verificationData) {
        const update = {
            verificationStatus: verificationData.status,
            isVerified: verificationData.isVerified || false,
            updatedAt: new Date()
        };
        
        if (verificationData.method === 'email') {
            update.emailVerified = true;
            update.emailVerifiedAt = new Date();
        } else if (verificationData.method === 'phone') {
            update.phoneVerified = true;
            update.phoneVerifiedAt = new Date();
        }
        
        // Update tier based on new verification status
        if (verificationData.status === 'fully_verified') {
            const tier = await this.getTierByName('fully_verified');
            update.tierLevel = tier.level;
            update.tierName = tier.tierName;
        }
        
        return this.collection('users').updateOne(
            { userId: userId },
            { $set: update }
        );
    },

    /* ---------------- INVESTMENT MANAGEMENT ---------------- */

    async createInvestment(investmentData) {
        const investmentId = `INV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        const investment = {
            investmentId: investmentId,
            userId: investmentData.userId,
            userEmail: investmentData.userEmail,
            userName: investmentData.userName,
            amount: investmentData.amount,
            sector: investmentData.sector,
            duration: investmentData.duration,
            expectedROI: investmentData.expectedROI,
            actualROI: null,
            status: 'pending',
            paymentStatus: 'pending',
            startDate: null,
            maturityDate: null,
            paymentId: null,
            documents: [],
            milestones: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await this.collection('investments').insertOne(investment);
        
        // Update investor stats
        if (investmentData.userId) {
            await this.collection('investors').updateOne(
                { userId: investmentData.userId },
                { 
                    $inc: { pendingInvestments: 1 },
                    $set: { updatedAt: new Date() }
                }
            );
        }
        
        return { ...investment, _id: result.insertedId };
    },

    async updateInvestmentStatus(investmentId, status, paymentId = null) {
        const updateData = {
            status: status,
            updatedAt: new Date()
        };
        
        if (paymentId) {
            updateData.paymentId = paymentId;
            updateData.paymentStatus = 'completed';
        }
        
        if (status === 'active') {
            updateData.startDate = new Date();
            const investment = await this.collection('investments').findOne({ investmentId: investmentId });
            if (investment && investment.duration) {
                updateData.maturityDate = new Date(Date.now() + investment.duration * 30 * 24 * 60 * 60 * 1000);
            }
            
            // Update investor stats
            await this.collection('investors').updateOne(
                { userId: investment.userId },
                { 
                    $inc: { 
                        pendingInvestments: -1,
                        activeInvestments: 1,
                        totalInvestments: investment.amount
                    },
                    $set: { updatedAt: new Date() }
                }
            );
        }
        
        return this.collection('investments').updateOne(
            { investmentId: investmentId },
            { $set: updateData }
        );
    },

    /* ---------------- BACKUP LOGGING ---------------- */

    async logBackupOperation(operation, status, details = {}) {
        const log = {
            operation: operation, // 'backup', 'restore', 'cleanup'
            status: status, // 'started', 'completed', 'failed'
            details: details,
            timestamp: new Date(),
            createdAt: new Date()
        };
        
        return this.collection('backup_logs').insertOne(log);
    }
};

/* =========================================================
   USER MANAGEMENT FUNCTIONS (Legacy - for backward compatibility)
========================================================= */

async function createUser(userData) {
    try {
        // Check if user already exists
        const existingEmail = await db.getUserByEmail(userData.email);
        if (existingEmail) {
            return { success: false, message: 'User with this email already exists' };
        }

        if (userData.phone) {
            const existingPhone = await db.getUserByPhone(userData.phone);
            if (existingPhone) {
                return { success: false, message: 'User with this phone number already exists' };
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Determine role and account tier
        const isInvestor = userData.registeringAs === 'investor' || userData.role === 'investor';
        const role = isInvestor ? 'investor_applicant' : 'customer';
        const accountTier = isInvestor ? 'investor_applicant' : 'customer';
        const verificationLevel = isInvestor ? 'unverified' : 'email_verified';
        
        const user = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            phone: userData.phone || '',
            password: hashedPassword,
            role: role,
            accountTier: accountTier,
            verificationLevel: verificationLevel,
            isActive: true,
            emailVerified: false,
            phoneVerified: false,
            
            // Investor-specific fields (if applicable)
            investorId: isInvestor ? `INV-${Date.now().toString().slice(-6)}` : null,
            investorSince: isInvestor ? new Date() : null,
            
            // Limits based on account type
            dailyDepositLimit: isInvestor ? 0 : 100000, // ₦100,000 for customers, 0 for investors until verified
            dailyWithdrawalLimit: isInvestor ? 0 : 50000, // ₦50,000 for customers
            maxInvestmentAmount: isInvestor ? 0 : 0,
            
            // Preferences
            preferences: {
                notifications: true,
                marketingEmails: userData.communications || false
            },
            
            // Security
            twoFactorEnabled: false,
            failedLoginAttempts: 0,
            accountLockedUntil: null,
            lastPasswordChange: new Date(),
            
            // Timestamps
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null
        };

        const result = await db.create('users', user);
        
        // Remove password from returned object
        const { password, ...safeUser } = user;
        
        return { 
            success: true, 
            userId: result._id,
            user: safeUser 
        };
        
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Error creating user account' };
    }
}

async function authenticateUser(email, password) {
    try {
        const user = await db.getUserByEmail(email);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }
        
        // Check if account is locked
        if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
            const lockTime = Math.ceil((user.accountLockedUntil - new Date()) / 60000); // minutes
            return { 
                success: false, 
                message: `Account locked. Try again in ${lockTime} minute(s).` 
            };
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            // Increment failed login attempts
            const failedAttempts = user.failedLoginAttempts + 1;
            let updateData = { failedLoginAttempts };
            
            // Lock account after 5 failed attempts for 30 minutes
            if (failedAttempts >= 5) {
                updateData.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
            }
            
            await db.update('users', { _id: user._id }, updateData);
            
            return { 
                success: false, 
                message: `Invalid email or password. ${5 - failedAttempts} attempt(s) remaining.` 
            };
        }
        
        // Reset failed login attempts on successful login
        const updateData = { 
            lastLogin: new Date(),
            failedLoginAttempts: 0,
            accountLockedUntil: null
        };
        
        await db.update('users', { _id: user._id }, updateData);
        
        // Remove password from returned object
        const { password: _, ...safeUser } = user;
        return { success: true, user: safeUser };
        
    } catch (error) {
        console.error('Error authenticating user:', error);
        return { success: false, message: 'Authentication failed' };
    }
}

async function getUserById(userId) {
    try {
        if (!db.isValidObjectId(userId)) return null;
        
        const user = await db.getById('users', userId);
        if (user) {
            const { password, ...safeUser } = user;
            return safeUser;
        }
        return null;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

async function updateUser(userId, updateData) {
    try {
        if (!db.isValidObjectId(userId)) {
            return { success: false, message: 'Invalid user ID' };
        }
        
        // Remove fields that shouldn't be updated directly
        delete updateData.password;
        delete updateData.email;
        delete updateData._id;
        
        updateData.updatedAt = new Date();
        
        const result = await db.update('users', { _id: db.toObjectId(userId) }, updateData);
        
        if (result) {
            const updatedUser = await getUserById(userId);
            return { success: true, user: updatedUser };
        }
        
        return { success: false, message: 'User not found or no changes made' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Error updating user' };
    }
}

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    connectDB,
    closeDB,
    db,
    ObjectId,
    createUser,
    authenticateUser,
    getUserById,
    updateUser,
    backupDatabase,
    listBackups,
    restoreBackup,
    
    // Re-export db functions for backward compatibility
    create: db.create.bind(db),
    getAll: db.getAll.bind(db),
    getById: db.getById.bind(db),
    update: db.update.bind(db),
    updateWithOperators: db.updateWithOperators.bind(db),
    getStats: db.getStats.bind(db),
    count: db.count.bind(db),
    getOne: db.getOne.bind(db),
    collection: db.collection.bind(db),
    toObjectId: db.toObjectId.bind(db),
    verifyAdminCredentials: db.verifyAdminCredentials.bind(db),
    getOrderByNumber: db.getOrderByNumber.bind(db),
    logEmail: db.logEmail.bind(db),
    getRecentEmails: db.getRecentEmails.bind(db),
    
    // New exports for enhanced features
    JWT_SECRET
};
>>>>>>> e051c01554491361149ba5c6046c620a72341c42
