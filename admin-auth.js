// admin-auth.js (FINAL FIXED VERSION)
const bcrypt = require('bcryptjs');
const { db } = require('./database');

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

async function verifyAdmin(email, password) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
        return {
            success: false,
            message: 'Admin not configured'
        };
    }

    if (email !== adminEmail) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    const match = await bcrypt.compare(password, adminPasswordHash);

    if (!match) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    return {
        success: true,
        admin: {
            email: adminEmail,
            role: 'superadmin'
        }
    };
}

module.exports = {
    async verifyAdmin(email, password) {
        try {
            // Use database authentication
            const result = await db.verifyAdminCredentials(email, password);
            
            if (result.success) {
                return {
                    success: true,
                    admin: result.admin
                };
            } else {
                return {
                    success: false,
                    message: result.message
                };
            }
        } catch (error) {
            console.error('Admin auth error:', error);
            return {
                success: false,
                message: 'Authentication failed'
            };
        }
    }
};
