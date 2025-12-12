// admin-auth.js - Simplified version without jsonwebtoken
const bcrypt = require('bcryptjs');

module.exports = {
    // Simple authentication without JWT
    async verifyAdmin(email, password) {
        // You should have admin credentials in your database or environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@collaborativeinvestmentltd.com';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        
        if (!adminPasswordHash) {
            return { success: false, message: 'Admin not configured' };
        }
        
        if (email !== adminEmail) {
            return { success: false, message: 'Invalid credentials' };
        }
        
        const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
        
        if (passwordMatch) {
            return {
                success: true,
                admin: {
                    email: adminEmail,
                    name: 'Administrator',
                    role: 'admin'
                }
            };
        }
        
        return { success: false, message: 'Invalid credentials' };
    }
};