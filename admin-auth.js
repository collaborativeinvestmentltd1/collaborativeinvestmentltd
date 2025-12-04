// admin-auth.js - Enhanced authentication with session management
const crypto = require('crypto');

const admins = [
    {
        id: 1,
        email: 'admin@collaborativeinvestmentltd.com',
        password: 'admin123', // In production, use bcrypt for hashing
        name: 'System Administrator',
        role: 'super_admin',
        permissions: ['all']
    },
    {
        id: 2,
        email: 'manager@collaborativeinvestmentltd.com',
        password: 'manager123',
        name: 'Business Manager',
        role: 'manager',
        permissions: ['products', 'orders', 'customers', 'emails']
    }
];

// Session storage (in production, use Redis)
const sessions = new Map();

module.exports = {
    // Login function
    login(email, password) {
        const admin = admins.find(a => a.email === email && a.password === password);
        if (admin) {
            // Create session
            const sessionId = crypto.randomBytes(16).toString('hex');
            const sessionData = {
                sessionId,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                    permissions: admin.permissions
                },
                loginTime: new Date(),
                lastActivity: new Date()
            };
            
            sessions.set(sessionId, sessionData);
            
            // Clean up old sessions (in production, use proper session management)
            this.cleanupSessions();
            
            return {
                success: true,
                sessionId,
                admin: sessionData.admin
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
    },

    // Verify session
    verify(sessionId) {
        if (!sessionId) return null;
        
        const session = sessions.get(sessionId);
        if (session) {
            // Update last activity
            session.lastActivity = new Date();
            sessions.set(sessionId, session);
            return session.admin;
        }
        return null;
    },

    // Logout
    logout(sessionId) {
        return sessions.delete(sessionId);
    },

    // Get session
    getSession(sessionId) {
        return sessions.get(sessionId);
    },

    // Clean up expired sessions (24 hours)
    cleanupSessions() {
        const now = new Date();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        for (const [sessionId, session] of sessions.entries()) {
            if (now - session.lastActivity > maxAge) {
                sessions.delete(sessionId);
            }
        }
    },

    // Check permissions
    hasPermission(sessionId, permission) {
        const session = sessions.get(sessionId);
        if (!session) return false;
        
        const admin = session.admin;
        if (admin.role === 'super_admin' || admin.permissions.includes('all')) {
            return true;
        }
        
        return admin.permissions.includes(permission);
    }
};

// Clean up sessions every hour
setInterval(() => {
    module.exports.cleanupSessions();
}, 60 * 60 * 1000);