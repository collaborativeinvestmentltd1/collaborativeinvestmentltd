<<<<<<< HEAD
// reset-admin.js
require('dotenv').config();
const { connectDB, db } = require('./database');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
    try {
        await connectDB();
        
        const newPassword = 'Admin@123';
        const hash = await bcrypt.hash(newPassword, 12);
        
        // Update admin password
        await db.collection('admins').updateOne(
            { email: 'admin@cil.com' },
            {
                $set: {
                    password: hash,
                    updatedAt: new Date(),
                    isActive: true
                },
                $setOnInsert: {
                    role: 'super_admin',
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
        
        console.log('✅ Admin password reset successfully');
        console.log('Email: admin@cil.com');
        console.log('Password: Admin@123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Reset failed:', error);
        process.exit(1);
    }
}

=======
// reset-admin.js
require('dotenv').config();
const { connectDB, db } = require('./database');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
    try {
        await connectDB();
        
        const newPassword = 'Admin@123';
        const hash = await bcrypt.hash(newPassword, 12);
        
        // Update admin password
        await db.collection('admins').updateOne(
            { email: 'admin@cil.com' },
            {
                $set: {
                    password: hash,
                    updatedAt: new Date(),
                    isActive: true
                },
                $setOnInsert: {
                    role: 'super_admin',
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
        
        console.log('✅ Admin password reset successfully');
        console.log('Email: admin@cil.com');
        console.log('Password: Admin@123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Reset failed:', error);
        process.exit(1);
    }
}

>>>>>>> e051c01554491361149ba5c6046c620a72341c42
resetAdminPassword();