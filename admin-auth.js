const sessions = new Map(); // This should be shared with app.js ideally


const adminAuth = (req, res, next) => {
    try {
        // Check for admin session in cookies
        const cookies = req.headers.cookie || '';
        const sessionMatch = cookies.match(/sessionId=([^;]+)/);
        
        if (!sessionMatch) {
            // No session cookie found
            if (req.method === 'GET' && req.url.startsWith('/admin/api/')) {
                // API request - return JSON error
                res.writeHead(401, { 
                    'Content-Type': 'application/json',
                    'WWW-Authenticate': 'Bearer realm="Admin API"'
                });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Unauthorized - Please login',
                    code: 'UNAUTHORIZED'
                }));
                return false;
            } else {
                // Page request - redirect to login
                res.writeHead(302, { Location: '/admin/login' });
                res.end();
                return false;
            }
        }

        const sessionId = sessionMatch[1];
        
        // Check if sessions Map is available (should be imported from app.js)
        // For now, we'll check if it exists in global scope or create a local one
        const sessionStore = global.sessions || sessions;
        const session = sessionStore.get(sessionId);
        
        if (!session || !session.admin) {
            // Invalid session
            if (req.method === 'GET' && req.url.startsWith('/admin/api/')) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Session expired - Please login again',
                    code: 'SESSION_EXPIRED'
                }));
            } else {
                res.writeHead(302, { Location: '/admin/login?expired=true' });
                res.end();
            }
            return false;
        }

        // Update last activity
        session.lastActivity = new Date();
        sessionStore.set(sessionId, session);

        // Attach admin info to request for later use
        req.admin = session.admin;
        
        // Log admin activity (optional)
        const adminEmail = session.admin.email;
        const action = `${req.method} ${req.url}`;
        console.log(`[ADMIN ACTION] ${adminEmail} - ${action} - ${new Date().toISOString()}`);

        // Continue to next middleware/handler
        if (next) {
            next();
        }
        
        return true;

    } catch (error) {
        console.error('Admin Auth Error:', error);
        
        if (req.method === 'GET' && req.url.startsWith('/admin/api/')) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Authentication error',
                code: 'AUTH_ERROR'
            }));
        } else {
            res.writeHead(302, { Location: '/admin/login?error=auth' });
            res.end();
        }
        return false;
    }
};

/**
 * Check if request has valid admin authentication
 * Returns admin object if authenticated, null otherwise
 */
adminAuth.checkAuth = (req) => {
    try {
        const cookies = req.headers.cookie || '';
        const sessionMatch = cookies.match(/sessionId=([^;]+)/);
        
        if (!sessionMatch) return null;

        const sessionId = sessionMatch[1];
        const sessionStore = global.sessions || sessions;
        const session = sessionStore.get(sessionId);
        
        if (session && session.admin) {
            // Update last activity
            session.lastActivity = new Date();
            sessionStore.set(sessionId, session);
            return session.admin;
        }
        
        return null;
    } catch (error) {
        console.error('Check Auth Error:', error);
        return null;
    }
};

/**
 * Require admin authentication middleware for Express-style handlers
 * Useful if you migrate to Express later
 */
adminAuth.requireAdmin = (req, res, next) => {
    const admin = adminAuth.checkAuth(req);
    if (!admin) {
        if (req.xhr || req.headers.accept?.includes('json')) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Unauthorized' 
            }));
        } else {
            res.writeHead(302, { Location: '/admin/login' });
            res.end();
        }
        return;
    }
    req.admin = admin;
    next();
};

/**
 * Create a new admin session
 */
adminAuth.createSession = (admin) => {
    const crypto = require('crypto');
    const sessionId = crypto.randomBytes(16).toString('hex');
    
    const session = {
        sessionId,
        admin: {
            email: admin.email,
            name: admin.name || admin.email.split('@')[0],
            role: admin.role || 'admin',
            permissions: admin.permissions || ['read', 'write']
        },
        loginTime: new Date(),
        lastActivity: new Date()
    };
    
    const sessionStore = global.sessions || sessions;
    sessionStore.set(sessionId, session);
    
    return sessionId;
};

/**
 * Destroy an admin session (logout)
 */
adminAuth.destroySession = (sessionId) => {
    const sessionStore = global.sessions || sessions;
    return sessionStore.delete(sessionId);
};

/**
 * Get all active admin sessions
 */
adminAuth.getActiveSessions = () => {
    const sessionStore = global.sessions || sessions;
    const activeSessions = [];
    
    for (const [sessionId, session] of sessionStore.entries()) {
        if (session.admin) {
            activeSessions.push({
                sessionId,
                admin: session.admin.email,
                loginTime: session.loginTime,
                lastActivity: session.lastActivity,
                age: Date.now() - session.loginTime.getTime()
            });
        }
    }
    
    return activeSessions;
};

/**
 * Clean up expired sessions (older than 24 hours)
 */
adminAuth.cleanupExpiredSessions = () => {
    const sessionStore = global.sessions || sessions;
    const now = new Date();
    let cleaned = 0;
    
    for (const [sessionId, session] of sessionStore.entries()) {
        const inactiveTime = now - session.lastActivity;
        if (inactiveTime > 24 * 60 * 60 * 1000) { // 24 hours
            sessionStore.delete(sessionId);
            cleaned++;
        }
    }
    
    if (cleaned > 0) {
        console.log(`[ADMIN AUTH] Cleaned up ${cleaned} expired sessions`);
    }
    
    return cleaned;
};

// Run cleanup every hour
setInterval(adminAuth.cleanupExpiredSessions, 60 * 60 * 1000);

// Share the sessions Map globally so app.js can access it
global.adminSessions = sessions;

module.exports = adminAuth;