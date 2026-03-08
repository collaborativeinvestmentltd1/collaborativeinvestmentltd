<<<<<<< HEAD
// setup-admin.js
require('dotenv').config();
const { connectDB, db } = require('./database');
const bcrypt = require('bcryptjs');

async function setupAdmin() {
    try {
        await connectDB();
        
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        
        if (!email || !password) {
            console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
            process.exit(1);
        }
        
        const hash = await bcrypt.hash(password, 12);
        
        // Create or update admin user
        await db.create('admin_users', {
            email,
            passwordHash: hash,
            name: 'Administrator',
            role: 'super_admin',
            createdAt: new Date(),
            updatedAt: new Date()
        }, { upsert: true });
        
        console.log('✅ Admin user created/updated successfully');
        console.log('📧 Email:', email);
        console.log('🔐 Hash saved to database');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

=======
// setup-admin.js
require('dotenv').config();
const { connectDB, db } = require('./database');
const bcrypt = require('bcryptjs');

async function setupAdmin() {
    try {
        await connectDB();
        
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        
        if (!email || !password) {
            console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
            process.exit(1);
        }
        
        const hash = await bcrypt.hash(password, 12);
        
        // Create or update admin user
        await db.create('admin_users', {
            email,
            passwordHash: hash,
            name: 'Administrator',
            role: 'super_admin',
            createdAt: new Date(),
            updatedAt: new Date()
        }, { upsert: true });
        
        console.log('✅ Admin user created/updated successfully');
        console.log('📧 Email:', email);
        console.log('🔐 Hash saved to database');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

>>>>>>> e051c01554491361149ba5c6046c620a72341c42
setupAdmin();