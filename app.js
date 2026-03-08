require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); // Added bcrypt
const jwt = require('jsonwebtoken'); // Added JWT
const { connectDB, db, closeDB, backupDatabase, authenticateUser } = require('./database');
const adminAuth = require('./admin-auth');
const passwordResetTokens = new Map();
const MILESTONE_STATUSES = ['Processing', 'Shipped', 'Delivered'];
const userSessions = new Map();


// Import logging module
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'collaborativeinvestmentltd.com';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'MONGODB_URI'];
const missing = requiredEnvVars.filter(env => !process.env[env]);
if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

// Enhanced email configuration
const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: (process.env.EMAIL_SECURE === 'true'),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

const transporter = nodemailer.createTransport(emailConfig);

// async verify (better logs)
(async () => {
    try {
        await transporter.verify();
        logger.info('✅ Email server is ready to send messages');
    } catch (err) {
        logger.warn('❌ Email configuration error:', err.message);
    }
})();

// Session configuration
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// Session storage with improved security
const sessions = new Map();
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

// Route configuration
const ROUTES = {
    '/': 'index.html',
    '/about': 'about.html',
    '/services': 'services.html',
    '/shop': 'shop.html',
    '/shop-categories': 'shop-categories.html',
    '/shop-agriculture': 'shop-agriculture.html',
    '/shop-construction': 'shop-construction.html',
    '/shop-machinery': 'shop-machinery.html',
    '/shop-solar': 'shop-solar.html',
    '/shop-livestock': 'shop-livestock.html',
    '/shop-all': 'shop-all.html',
    '/shop-diaspora': 'shop-diaspora.html',
    '/shop-furniture': 'shop-furniture.html',
    '/register': 'register.html',
    '/login': 'login.html',
    '/register.html': 'register.html', // Add this line
    '/investor-dashboard': 'investor-dashboard.html',
    '/customer-dashboard': 'customer-dashboard.html', // Added customer dashboard
    '/portfolio': 'portfolio.html',
    '/cart': 'cart.html',
    '/investment': 'investment.html',
    '/contact': 'contact.html',
    '/blog': 'blog.html',
    '/blog/poultry-farming-investment-guide': 'blog-poultry-farming-investment-guide.html',
    '/blog/block-manufacturing-investment': 'blog-block-manufacturing-investment.html',
    '/blog/solar-energy-investment': 'blog-solar-energy-investment.html',
    '/blog/catfish-farming-investment': 'blog-catfish-farming-investment.html',
    '/blog/piggery-business-expansion': 'blog-piggery-business-expansion.html',
    '/blog/block-machine-fabrication': 'blog-block-machine-fabrication.html',
    '/blog/solar-installation-services': 'blog-solar-installation-services.html',
    '/blog/custom-furniture-manufacturing': 'blog-custom-furniture-manufacturing.html',
    '/blog/sme-financial-management': 'blog-sme-financial-management.html',
    '/blog/diaspora-investment-guide': 'blog-diaspora-investment-guide.html',
    '/blog/asset-backed-investments': 'blog-asset-backed-investments.html',
    '/blog/category/agriculture': 'blog-category-agriculture.html',
    '/blog/category/manufacturing': 'blog-category-manufacturing.html',
    '/blog/category/solar': 'blog-category-solar.html',
    '/blog/category/furniture': 'blog-category-furniture.html',
    '/privacy-policy': 'privacy-policy.html',
    '/terms': 'terms.html',
    '/contact-success': 'contact-success.html',
    '/order-track': 'order-track.html',
    '/order-tracking': 'order-tracking.html',
    '/admin/login': 'admin-login.html',
    '/admin/dashboard': 'admin-dashboard.html',
    '/admin/products': 'admin-products.html',
    '/admin/orders': 'admin-orders.html',
    '/admin/customers': 'admin-customers.html',
    '/admin/emails': 'admin-emails.html',
    '/admin/analytics': 'admin-analytics.html',
    '/admin/settings': 'admin-settings.html',
    '/admin/change-password': 'admin-change-password.html',
    '/admin/reset-password': 'admin-reset-password.html',
    '/health': null
};

// Static file directories
const STATIC_DIRS = ['/css/', '/js/', '/img/', '/downloads/'];

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
};

// Session cleanup function
function cleanupSessions() {
    const now = new Date();
    for (const [sessionId, session] of sessions.entries()) {
        const inactiveTime = now - session.lastActivity;
        if (inactiveTime > 24 * 60 * 60 * 1000) {
            sessions.delete(sessionId);
            logger.debug(`Cleaned up expired session: ${sessionId}`);
        }
    }
}

// Cache cleanup function
function cleanupCache() {
    const now = Date.now();
    for (const [filePath, cacheEntry] of cache.entries()) {
        if (now - cacheEntry.timestamp > CACHE_DURATION) {
            cache.delete(filePath);
        }
    }
}

// Run session cleanup every hour
setInterval(cleanupSessions, 60 * 60 * 1000);
// Run cache cleanup every 30 minutes
setInterval(cleanupCache, 30 * 60 * 1000);

// Enhanced authentication check with activity tracking
function checkAdminAuth(req) {
    const cookies = req.headers.cookie || '';
    const sessionMatch = cookies.match(/sessionId=([^;]+)/);
    
    if (sessionMatch) {
        const sessionId = sessionMatch[1];
        const session = sessions.get(sessionId);
        
        if (session && session.admin) {
            // Update last activity
            session.lastActivity = new Date();
            sessions.set(sessionId, session);
            
            // Log admin access
            const reqPath = url.parse(req.url).pathname;
            if (reqPath.startsWith('/admin/api') || reqPath === '/admin/dashboard') {
                logger.info(`Admin access: ${session.admin.email} - ${req.method} ${req.url}`);
            }
            return session.admin;
        }
    }
    return null;
}

function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const timestampPart = timestamp.slice(-6);
    return `CIL-${timestampPart}-${random}`;
}

async function logAdminAction(adminEmail, action, details = {}, req) {
    try {
        await db.create('admin_audit_log', {
            adminEmail,
            action,
            details,
            ipAddress: req?.socket?.remoteAddress || 'unknown',
            userAgent: req?.headers?.['user-agent'] || 'unknown',
            timestamp: new Date()
        });
        logger.info(`Admin action logged: ${action} by ${adminEmail}`);
    } catch (error) {
        logger.error('Failed to log admin action:', error);
    }
}

// Handle user registration
async function handleUserRegistration(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    accountType,
                    role,
                    country,
                    referral,
                    verificationMethod,
                    acceptsTerms,
                    acceptsCommunications,
                    preferences,
                    investmentPreferences,
                    payment
                } = data;

                // Validate required fields
                if (!firstName || !lastName || !email || !phone || !password || !accountType) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'All required fields must be provided'
                    }));
                    return resolve();
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid email format'
                    }));
                    return resolve();
                }

                // Check if user already exists
                const existingUser = await db.collection('users').findOne({ email });
                if (existingUser) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Email already registered'
                    }));
                    return resolve();
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Generate user ID based on account type
                const userId = `CIL-${accountType.toUpperCase()}-${Date.now().toString().slice(-8)}`;

                // Prepare user data
                const userData = {
                    userId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: hashedPassword,
                    accountType,
                    role: role || accountType,
                    country: country || 'nigeria',
                    referralCode: referral || '',
                    verificationMethod: verificationMethod || 'email',
                    isVerified: false,
                    verificationToken: generateVerificationToken(),
                    acceptsTerms: acceptsTerms || false,
                    acceptsCommunications: acceptsCommunications || false,
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Add account-specific data
                if (accountType === 'customer') {
                    userData.customerData = {
                        preferences: preferences?.interests || [],
                        shippingAddress: preferences?.shippingAddress || '',
                        totalOrders: 0,
                        totalSpent: 0,
                        wishlist: []
                    };
                } else if (accountType === 'investor') {
                    userData.investorData = {
                        investorId: `CIL-INV-${Date.now().toString().slice(-6)}`,
                        investmentPreferences: investmentPreferences || {},
                        totalInvestments: 0,
                        totalReturns: 0,
                        activeInvestments: 0,
                        preferredSectors: investmentPreferences?.sectors || [],
                        riskProfile: 'moderate',
                        accreditationStatus: 'pending',
                        kycStatus: 'pending'
                    };
                }

                // Insert user into database
                const result = await db.collection('users').insertOne(userData);

                // Create separate record in customer/investor collections
                if (accountType === 'customer') {
                    await db.collection('customers').insertOne({
                        userId: userData.userId,
                        ...userData.customerData,
                        email,
                        phone,
                        name: `${firstName} ${lastName}`,
                        createdAt: new Date()
                    });
                } else if (accountType === 'investor') {
                    await db.collection('investors').insertOne({
                        userId: userData.userId,
                        ...userData.investorData,
                        email,
                        phone,
                        name: `${firstName} ${lastName}`,
                        createdAt: new Date()
                    });
                }

                // Handle payment if applicable
                if (payment && payment.depositAmount > 0) {
                    await handleInitialDeposit(userData, payment);
                }

                // Send verification email
                await sendVerificationEmail(email, userData.verificationToken, accountType);

                // Send welcome notification
                await sendWelcomeNotification(email, firstName, accountType, payment?.depositAmount || 0);

                // Generate JWT token
                const token = jwt.sign(
                    {
                        userId: userData.userId,
                        email,
                        accountType,
                        role: userData.role
                    },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                // Return success response
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Registration successful',
                    token,
                    user: {
                        id: userData.userId,
                        email,
                        name: `${firstName} ${lastName}`,
                        accountType,
                        role: userData.role,
                        investorId: userData.investorData?.investorId || null
                    }
                }));

            } catch (error) {
                console.error('Registration error:', error);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Server error during registration'
                }));
            }
            resolve();
        });
    });
}

// Helper function to generate verification token
function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Helper function to send verification email
async function sendVerificationEmail(email, token, accountType) {
    const verificationLink = `${process.env.BASE_URL || 'http://localhost:3000'}/verify-email?token=${token}&type=${accountType}`;
    
    const mailOptions = {
        from: `"Collaborative Investment Ltd" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: accountType === 'customer' 
            ? 'Verify Your CIL Customer Account' 
            : 'Verify Your CIL Investor Account',
        html: `
            <h2>Welcome to Collaborative Investment Ltd!</h2>
            <p>Thank you for registering as a ${accountType}.</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #1a365d; color: white; text-decoration: none; border-radius: 4px;">
                Verify Email Address
            </a>
            <p>If you didn't create an account, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

// Handle initial deposit
async function handleInitialDeposit(userData, payment) {
    try {
        const paymentRecord = {
            userId: userData.userId,
            userEmail: userData.email,
            userName: `${userData.firstName} ${userData.lastName}`,
            amount: payment.depositAmount,
            paymentMethod: payment.paymentMethod || 'bank_transfer',
            paymentReference: payment.paymentReference || generatePaymentReference(),
            status: payment.skipDeposit ? 'skipped' : 'pending',
            purpose: 'initial_deposit',
            accountType: userData.accountType,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save payment record
        await db.collection('payments').insertOne(paymentRecord);

        // If it's an investor and deposit meets minimum, update investor status
        if (userData.accountType === 'investor' && payment.depositAmount >= 5000000) {
            await db.collection('investors').updateOne(
                { userId: userData.userId },
                { 
                    $set: { 
                        initialDeposit: payment.depositAmount,
                        depositDate: new Date(),
                        investmentStatus: 'pending_approval'
                    }
                }
            );
        }

        // Send payment confirmation email
        if (!payment.skipDeposit) {
            await sendPaymentConfirmationEmail(userData.email, userData.firstName, paymentRecord);
        }

    } catch (error) {
        console.error('Error handling initial deposit:', error);
        throw error;
    }
}

// Generate payment reference
function generatePaymentReference() {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Send payment confirmation email
async function sendPaymentConfirmationEmail(email, firstName, payment) {
    const mailOptions = {
        from: `"Collaborative Investment Ltd" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Payment Confirmation - CIL Account',
        html: `
            <h2>Payment Received</h2>
            <p>Dear ${firstName},</p>
            <p>Your initial deposit has been received successfully!</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Amount:</strong> ₦${payment.amount.toLocaleString()}</p>
                <p><strong>Reference:</strong> ${payment.paymentReference}</p>
                <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>Thank you for choosing Collaborative Investment Ltd!</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

// Send welcome notification
async function sendWelcomeNotification(email, firstName, accountType, depositAmount) {
    const subject = accountType === 'customer' 
        ? 'Welcome to CIL - Customer Account Activated' 
        : 'Welcome to CIL - Investor Account Activated';
    
    const depositInfo = depositAmount > 0 
        ? `<p>Your initial deposit of <strong>₦${depositAmount.toLocaleString()}</strong> has been received and is being processed.</p>` 
        : '';
    
    const mailOptions = {
        from: `"CIL CEO/Management" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: `
            <h2>Welcome to Collaborative Investment Ltd!</h2>
            <p>Dear ${firstName},</p>
            <p>On behalf of the entire CIL team, I'd like to welcome you to our community!</p>
            ${depositInfo}
            <p>As a ${accountType}, you now have access to:</p>
            <ul>
                ${accountType === 'customer' ? 
                    '<li>Thousands of quality products across 8 business sectors</li>' +
                    '<li>Fast and reliable nationwide delivery</li>' +
                    '<li>24/7 customer support</li>' +
                    '<li>Exclusive deals and discounts</li>' 
                    : 
                    '<li>Asset-backed investment opportunities</li>' +
                    '<li>Professional portfolio management</li>' +
                    '<li>Monthly performance reports</li>' +
                    '<li>Direct access to our investment team</li>'
                }
            </ul>
            <p>Our team is committed to providing you with the best experience possible.</p>
            <p>Best regards,<br>
            CIL Management Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

// Investor Dashboard API
async function handleInvestorDashboardAPI(req, res, pathname) {
    const user = checkUserAuth(req);
    if (!user) {
        res.writeHead(401, { 
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer realm="Investor API"'
        });
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Unauthorized - Please login',
            code: 'UNAUTHORIZED'
        }));
        return;
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
    };
    
    try {
        if (pathname === '/api/investor/dashboard-data') {
            // Get investor dashboard data
            const investor = await db.collection('investors').findOne({ userId: user.userId });
            
            const dashboardData = {
                user: {
                    name: user.firstName + ' ' + user.lastName,
                    email: user.email,
                    investorId: investor?.investorId || `INV-${user.userId.slice(-6).toUpperCase()}`,
                    tier: investor?.tier || 'Premium',
                    avatarInitials: (user.firstName[0] + user.lastName[0]).toUpperCase(),
                    kycStatus: investor?.kycStatus || 'pending'
                },
                stats: {
                    totalInvestment: investor?.totalInvestments || 0,
                    totalReturns: investor?.totalReturns || 0,
                    activeInvestments: investor?.activeInvestments || 0,
                    avgROI: investor?.avgROI || 0,
                    portfolioHealth: investor?.portfolioHealth || 92
                },
                recentActivity: [],
                investments: [],
                notifications: []
            };
            
            // Get user's investments from database
            const investments = await db.collection('investments').find({ userId: user.userId }).sort({ createdAt: -1 }).limit(10).toArray();
            dashboardData.investments = investments;
            
            // Get recent activity
            const activity = await db.collection('user_activity').find({ userId: user.userId }).sort({ timestamp: -1 }).limit(5).toArray();
            dashboardData.recentActivity = activity;
            
            // Get notifications
            const notifications = await db.collection('notifications').find({ userId: user.userId, read: false }).sort({ createdAt: -1 }).limit(10).toArray();
            dashboardData.notifications = notifications;
            
            res.writeHead(200, headers);
            res.end(JSON.stringify({ 
                success: true, 
                data: dashboardData 
            }));
        }
        else if (pathname === '/api/investor/invest') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const investmentData = JSON.parse(body);
                
                // Create investment record
                const investment = await db.collection('investments').insertOne({
                    userId: user.userId,
                    userEmail: user.email,
                    userName: user.firstName + ' ' + user.lastName,
                    ...investmentData,
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                // Create activity log
                await db.collection('user_activity').insertOne({
                    userId: user.userId,
                    type: 'investment',
                    title: 'New Investment Made',
                    description: `Invested ₦${investmentData.amount.toLocaleString()} in ${investmentData.sector}`,
                    timestamp: new Date()
                });
                
                // Send confirmation email
                const investmentMessage = `
Dear ${user.firstName},

Your investment request has been received successfully!

Investment Details:
- Amount: ₦${investmentData.amount.toLocaleString()}
- Sector: ${investmentData.sector}
- Duration: ${investmentData.duration} months
- Expected ROI: ${investmentData.expectedROI}%

Next Steps:
1. Our investment team will review your request within 24 hours
2. We'll contact you to complete necessary documentation
3. Once approved, your investment will be activated

You can track your investment status from your dashboard.

Best regards,
Collaborative Investment Ltd Team
📧 collaborativeinvestmentltd@gmail.com
📞 +234 812 997 8419
                `;
                
                await sendEmail(
                    user.email,
                    'Investment Request Confirmation',
                    investmentMessage,
                    'investment_confirmation'
                );
                
                res.writeHead(201, headers);
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Investment request submitted successfully',
                    investment 
                }));
            });
        }
        else if (pathname === '/api/investor/emergency') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const emergencyData = JSON.parse(body);
                
                // Log emergency
                const emergencyLog = await db.collection('emergency_logs').insertOne({
                    userId: user.userId,
                    userName: user.firstName + ' ' + user.lastName,
                    userPhone: user.phone,
                    userLocation: emergencyData.location,
                    emergencyType: emergencyData.type,
                    status: 'dispatched',
                    timestamp: new Date()
                });
                
                // Send emergency alert to admin
                const emergencyMessage = `
🚨 EMERGENCY ALERT - ${emergencyData.type.toUpperCase()}

Investor Details:
- Name: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Phone: ${user.phone}
- Investor ID: ${user.investorId || 'N/A'}

Emergency Type: ${emergencyData.type}
Location: ${emergencyData.location}
Time: ${new Date().toLocaleString()}

ACTION REQUIRED:
1. Contact investor immediately
2. Dispatch appropriate response team
3. Update emergency status

Contact Investor: ${user.phone}
                `;
                
                await sendEmail(
                    'collaborativeinvestmentltd@gmail.com',
                    `🚨 EMERGENCY - ${emergencyData.type.toUpperCase()} - ${user.firstName} ${user.lastName}`,
                    emergencyMessage,
                    'emergency'
                );
                
                // Also notify security team if phone numbers are configured
                if (process.env.SECURITY_PHONE) {
                    // In real app, you'd integrate with SMS service
                    console.log(`Emergency SMS would be sent to: ${process.env.SECURITY_PHONE}`);
                }
                
                res.writeHead(200, headers);
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Emergency alert sent successfully',
                    logId: emergencyLog.insertedId 
                }));
            });
        }
        else if (pathname === '/api/investor/notifications') {
            const notifications = await db.collection('notifications').find({ userId: user.userId }).sort({ createdAt: -1 }).limit(50).toArray();
            
            res.writeHead(200, headers);
            res.end(JSON.stringify({ 
                success: true, 
                notifications 
            }));
        }
        else if (pathname === '/api/investor/mark-notification-read') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const { notificationId } = JSON.parse(body);
                
                await db.collection('notifications').updateOne(
                    { _id: db.toObjectId(notificationId), userId: user.userId },
                    { $set: { read: true, readAt: new Date() } }
                );
                
                res.writeHead(200, headers);
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Notification marked as read' 
                }));
            });
        }
        else if (pathname === '/api/investor/payment') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const paymentData = JSON.parse(body);
                
                // Create payment record
                const payment = await db.collection('payments').insertOne({
                    userId: user.userId,
                    userEmail: user.email,
                    ...paymentData,
                    status: 'pending',
                    paymentMethod: paymentData.method || 'bank_transfer',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                // Create activity log
                await db.collection('user_activity').insertOne({
                    userId: user.userId,
                    type: 'payment',
                    title: 'Payment Initiated',
                    description: `Payment of ₦${paymentData.amount.toLocaleString()} for ${paymentData.purpose}`,
                    timestamp: new Date()
                });
                
                // In real app, integrate with payment gateway
                // For now, simulate payment processing
                setTimeout(async () => {
                    await db.collection('payments').updateOne(
                        { _id: payment.insertedId },
                        { 
                            $set: { 
                                status: 'completed',
                                completedAt: new Date(),
                                reference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                            }
                        }
                    );
                    
                    // If it's an investment payment, update investment
                    if (paymentData.purpose === 'investment') {
                        await db.collection('investments').updateOne(
                            { _id: db.toObjectId(paymentData.investmentId) },
                            { 
                                $set: { 
                                    status: 'active',
                                    paymentId: payment.insertedId,
                                    startDate: new Date()
                                }
                            }
                        );
                    }
                    
                    // Send payment confirmation
                    const paymentMessage = `
Dear ${user.firstName},

Your payment has been successfully processed!

Payment Details:
- Amount: ₦${paymentData.amount.toLocaleString()}
- Purpose: ${paymentData.purpose}
- Reference: ${payment.reference || 'Processing...'}
- Date: ${new Date().toLocaleString()}
- Status: Completed

You can view this transaction in your dashboard under "Transaction History".

Best regards,
Collaborative Investment Ltd Team
                    `;
                    
                    await sendEmail(
                        user.email,
                        'Payment Confirmation',
                        paymentMessage,
                        'payment_confirmation'
                    );
                }, 2000);
                
                res.writeHead(200, headers);
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Payment processing initiated',
                    paymentId: payment.insertedId,
                    reference: payment.reference 
                }));
            });
        }
        else if (pathname === '/api/investor/kyc/start') {
            // Start KYC process
            await db.collection('investors').updateOne(
                { userId: user.userId },
                { $set: { kycStatus: 'in_progress', kycStartedAt: new Date() } }
            );
            
            // Create KYC request
            const kycRequest = await db.collection('kyc_requests').insertOne({
                userId: user.userId,
                userEmail: user.email,
                userName: `${user.firstName} ${user.lastName}`,
                status: 'pending',
                requestedAt: new Date(),
                documentsRequired: ['id_card', 'proof_of_address', 'bank_statement']
            });
            
            // Send KYC instructions email
            const kycMessage = `
Dear ${user.firstName},

Your KYC verification process has been started.

Required Documents:
1. Government-issued ID (Passport, Driver's License, National ID)
2. Proof of Address (Utility bill, Bank statement)
3. Bank Statement (last 3 months)

Please upload these documents through your dashboard or email them to collaborativeinvestmentltd@gmail.com

Once verified, you'll get full access to all investment features.

Best regards,
CIL Compliance Team
            `;
            
            await sendEmail(user.email, 'KYC Verification Started', kycMessage, 'kyc_notification');
            
            res.writeHead(200, headers);
            res.end(JSON.stringify({ 
                success: true, 
                message: 'KYC process started. Please check your email for instructions.',
                kycRequestId: kycRequest.insertedId
            }));
        }
        else {
            res.writeHead(404, headers);
            res.end(JSON.stringify({ 
                success: false, 
                message: 'API endpoint not found',
                code: 'ENDPOINT_NOT_FOUND'
            }));
        }
    } catch (error) {
        logger.error('Investor API Error:', error);
        res.writeHead(500, headers);
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        }));
    }
}

async function handleUserLogin(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const { email, password, accountType } = JSON.parse(body);
                
                if (!email || !password || !accountType) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Email, password and account type are required' 
                    }));
                    return resolve();
                }
                
                // Determine collection based on account type
                const collectionName = accountType === 'investor' ? 'investors' : 'customers';
                const user = await db.collection(collectionName).findOne({ email });
                
                if (!user) {
                    res.writeHead(401, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Invalid credentials' 
                    }));
                    return resolve();
                }
                
                // Verify password
                const isValidPassword = await bcrypt.compare(password, user.password);
                
                if (!isValidPassword) {
                    res.writeHead(401, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Invalid credentials' 
                    }));
                    return resolve();
                }
                
                // Create session
                const sessionId = crypto.randomBytes(16).toString('hex');
                userSessions.set(sessionId, {
                    sessionId,
                    user: {
                        userId: user.userId,
                        email: user.email,
                        firstName: user.name ? user.name.split(' ')[0] : 'User',
                        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
                        accountType: accountType,
                        investorId: user.investorId || null
                    },
                    loginTime: new Date(),
                    lastActivity: new Date()
                });
                
                // Generate JWT token
                const token = jwt.sign(
                    {
                        userId: user.userId,
                        email: user.email,
                        accountType: accountType,
                        name: user.name
                    },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Set-Cookie': `userSessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`,
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true'
                });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.userId,
                        email: user.email,
                        name: user.name,
                        accountType: accountType,
                        investorId: user.investorId || null
                    },
                    redirect: accountType === 'customer' ? '/customer-dashboard' : '/investor-dashboard'
                }));
                
            } catch (error) {
                logger.error('User login error:', error);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Server error during login' 
                }));
            }
            resolve();
        });
    });
}

function checkUserAuth(req) {
    const cookies = req.headers.cookie || '';
    const sessionMatch = cookies.match(/userSessionId=([^;]+)/);
    
    if (sessionMatch) {
        const sessionId = sessionMatch[1];
        const session = userSessions.get(sessionId);
        
        if (session && session.user) {
            // Update last activity
            session.lastActivity = new Date();
            userSessions.set(sessionId, session);
            
            return session.user;
        }
    }
    
    // Also check JWT token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }
    
    return null;
}

function handleUserLogout(req, res) {
    const cookies = req.headers.cookie || '';
    const match = cookies.match(/userSessionId=([^;]+)/);
    
    if (match) {
        userSessions.delete(match[1]);
    }
    
    res.writeHead(200, {
        'Set-Cookie': 'userSessionId=; Path=/; Max-Age=0',
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ success: true }));
}

async function handleUserAPI(req, res, pathname) {
    const user = checkUserAuth(req);
    if (!user) {
        res.writeHead(401, { 
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer realm="User API"'
        });
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Unauthorized - Please login',
            code: 'UNAUTHORIZED'
        }));
        return;
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
    };
    
    try {
        if (pathname === '/api/user/profile') {
            const collectionName = user.accountType === 'investor' ? 'investors' : 'customers';
            const userData = await db.collection(collectionName).findOne({ userId: user.userId });
            
            res.writeHead(200, headers);
            res.end(JSON.stringify({ 
                success: true, 
                user: {
                    ...user,
                    ...userData
                }
            }));
        }
        else if (pathname === '/api/user/orders') {
            // Get user's orders
            const orders = await db.collection('orders').find({ 
                $or: [
                    { customerEmail: user.email },
                    { customerPhone: user.phone }
                ]
            }).sort({ createdAt: -1 }).toArray();
            
            res.writeHead(200, headers);
            res.end(JSON.stringify({ 
                success: true, 
                orders 
            }));
        }
        else if (pathname === '/api/user/update-profile') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const updateData = JSON.parse(body);
                
                // Remove fields that shouldn't be updated
                delete updateData.password;
                delete updateData.email;
                delete updateData.role;
                
                const collectionName = user.accountType === 'investor' ? 'investors' : 'customers';
                
                // Update user in database
                await db.collection(collectionName).updateOne(
                    { userId: user.userId },
                    { 
                        $set: {
                            ...updateData,
                            updatedAt: new Date()
                        }
                    }
                );
                
                // Update session
                const cookies = req.headers.cookie || '';
                const sessionMatch = cookies.match(/userSessionId=([^;]+)/);
                if (sessionMatch) {
                    const sessionId = sessionMatch[1];
                    const session = userSessions.get(sessionId);
                    if (session) {
                        session.user = { ...session.user, ...updateData };
                        userSessions.set(sessionId, session);
                    }
                }
                
                res.writeHead(200, headers);
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Profile updated successfully',
                    user: { ...user, ...updateData }
                }));
            });
        }
        else {
            res.writeHead(404, headers);
            res.end(JSON.stringify({ 
                success: false, 
                message: 'API endpoint not found',
                code: 'ENDPOINT_NOT_FOUND'
            }));
        }
    } catch (error) {
        logger.error('User API Error:', error);
        res.writeHead(500, headers);
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        }));
    }
}

function handleOrderTrack(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const { orderNumber, email, phone } = JSON.parse(body);
                
                if (!orderNumber) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Order number is required' 
                    }));
                    return resolve();
                }
                
                const normalizedOrderNumber = orderNumber.toUpperCase().trim();
                console.log(`Tracking request for: ${normalizedOrderNumber}`);
                
                let order = null;
                
                // Strategy 1: Exact match on orderNumber
                order = await findOrderByNumber(normalizedOrderNumber);
                
                // Strategy 2: Search in alternativeOrderNumbers
                if (!order) {
                    order = await findOrderByAlternativeNumber(normalizedOrderNumber);
                }
                
                // Strategy 3: Try different formats
                if (!order) {
                    const alternativeFormats = generateAlternativeFormats(normalizedOrderNumber);
                    for (const format of alternativeFormats) {
                        order = await findOrderByNumber(format);
                        if (order) break;
                        
                        order = await findOrderByAlternativeNumber(format);
                        if (order) break;
                    }
                }
                
                if (!order) {
                    console.log(`Order not found for: ${normalizedOrderNumber}`);
                    res.writeHead(404, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Order not found. Please check your order number and contact details.' 
                    }));
                    return resolve();
                }
                
                console.log(`Order found: ${order.orderNumber} for customer: ${order.customerName}`);
                
                // Additional verification with email/phone if provided
                if (email && order.customerEmail) {
                    const providedEmail = email.toLowerCase().trim();
                    const orderEmail = order.customerEmail.toLowerCase().trim();
                    if (providedEmail !== orderEmail) {
                        console.log(`Email mismatch: ${providedEmail} vs ${orderEmail}`);
                        res.writeHead(403, { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                        });
                        res.end(JSON.stringify({ 
                            success: false, 
                            message: 'Order found but email does not match. Please verify your email address.' 
                        }));
                        return resolve();
                    }
                }
                
                if (phone && order.customerPhone) {
                    const providedPhone = phone.replace(/\D/g, '');
                    const orderPhone = order.customerPhone.replace(/\D/g, '');
                    if (providedPhone !== orderPhone) {
                        console.log(`Phone mismatch: ${providedPhone} vs ${orderPhone}`);
                        res.writeHead(403, { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                        });
                        res.end(JSON.stringify({ 
                            success: false, 
                            message: 'Order found but phone number does not match. Please verify your phone number.' 
                        }));
                        return resolve();
                    }
                }
                
                // Remove sensitive information
                const safeOrder = {
                    orderNumber: order.orderNumber,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    total: order.total,
                    items: order.items,
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    customerPhone: order.customerPhone,
                    customerAddress: order.customerAddress || '',
                    estimatedDelivery: order.estimatedDelivery || null,
                    trackingNumber: order.trackingNumber || null,
                    statusUpdates: order.statusUpdates || [
                        {
                            status: order.status,
                            title: 'Order Placed',
                            description: 'Your order has been received and is being processed.',
                            date: order.createdAt,
                            completed: true
                        }
                    ],
                    notes: order.notes || '',
                    source: order.source || 'website_cart'
                };
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                });
                res.end(JSON.stringify({ 
                    success: true, 
                    order: safeOrder 
                }));
                
            } catch (error) {
                logger.error('Order tracking error:', error);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Server error while tracking order.' 
                }));
            }
            resolve();
        });
    });
}

async function findOrderByNumber(orderNumber) {
    try {
        const orders = await db.collection('orders').find({ orderNumber }).toArray();
        return orders.length > 0 ? orders[0] : null;
    } catch (error) {
        console.error('Error in findOrderByNumber:', error);
        return null;
    }
}

async function findOrderByAlternativeNumber(orderNumber) {
    try {
        const orders = await db.collection('orders').find({ 
            alternativeOrderNumbers: orderNumber 
        }).toArray();
        return orders.length > 0 ? orders[0] : null;
    } catch (error) {
        console.error('Error in findOrderByAlternativeNumber:', error);
        return null;
    }
}

function generateAlternativeFormats(orderNumber) {
    const formats = [];
    
    console.log(`Generating formats for: ${orderNumber}`);
    
    // Original: CIL-367193-944
    if (orderNumber.match(/^CIL-\d{6}-\d{3}$/)) {
        const parts = orderNumber.split('-');
        const timestamp = parts[1];
        const random = parts[2];
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`);
        formats.push(timestamp);
        formats.push(`CIL-${timestamp}`);
        formats.push(`${timestamp}-${random}`);
        formats.push(`CIL-${timestamp}-${random}`);
        
        const numericTimestamp = parseInt(timestamp, 10).toString();
        if (numericTimestamp !== timestamp) {
            formats.push(`CIL-${currentYear}-${numericTimestamp}`);
            formats.push(numericTimestamp);
            formats.push(`CIL-${numericTimestamp}`);
        }
    }
    // Try if it's just numbers
    else if (orderNumber.match(/^\d{6}$/)) {
        const timestamp = orderNumber;
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`);
        formats.push(`CIL-${timestamp}`);
        formats.push(`CIL-${timestamp}-???`);
    }
    // Try if it's numbers with hyphen
    else if (orderNumber.match(/^\d{6}-\d{3}$/)) {
        const parts = orderNumber.split('-');
        const timestamp = parts[0];
        const random = parts[1];
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`);
        formats.push(`CIL-${timestamp}`);
        formats.push(`CIL-${timestamp}-${random}`);
        formats.push(timestamp);
    }
    // Try if it's CIL- followed by numbers
    else if (orderNumber.match(/^CIL-\d{6}$/)) {
        const timestamp = orderNumber.replace('CIL-', '');
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`);
        formats.push(timestamp);
        formats.push(`CIL-${timestamp}-???`);
    }
    
    console.log(`Generated formats: ${formats.join(', ')}`);
    return formats;
}

// Email template functions
function createCustomerOrderEmail(orderData) {
    const { orderNumber, customerName, items, total } = orderData;
    
    return `
Dear ${customerName},

Thank you for your order with Collaborative Investment Ltd!

📦 Order Details:
Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleDateString()}
Order Time: ${new Date().toLocaleTimeString()}

Your Order Items:
${items.map((item, index) => 
    `${index + 1}. ${item.name} - ${item.quantity} x ₦${item.price.toLocaleString()} = ₦${(item.price * item.quantity).toLocaleString()}`
).join('\n')}

Order Total: ₦${total.toLocaleString()}

📞 Next Steps:
1. Our team will contact you within 24 hours to confirm your order details
2. We'll provide delivery timeline and any additional information
3. For urgent inquiries, call us at +234 812 997 8419

Thank you for choosing Collaborative Investment Ltd. We appreciate your business!

Best regards,
Collaborative Investment Ltd Team
📧 collaborativeinvestmentltd@gmail.com
📞 +234 812 997 8419 | +234 707 826 9765
📍 212 Ijegun Road, Ikotun, Lagos
    `;
}

function createAdminOrderNotification(orderData) {
    const { orderNumber, customerName, customerPhone, customerEmail, customerAddress, customerNotes, items, total } = orderData;
    
    return `
🛍️ NEW ORDER RECEIVED - ${orderNumber}

Customer Information:
👤 Name: ${customerName}
📞 Phone: ${customerPhone}
📧 Email: ${customerEmail || 'Not provided'}
📍 Address: ${customerAddress || 'Not provided'}

Order Summary:
${items.map((item, index) => 
    `${index + 1}. ${item.quantity}x ${item.name} @ ₦${item.price.toLocaleString()} = ₦${(item.price * item.quantity).toLocaleString()}`
).join('\n')}

💰 Order Total: ₦${total.toLocaleString()}

Customer Notes: ${customerNotes || 'None'}

Order Details:
Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleDateString()}
Order Time: ${new Date().toLocaleTimeString()}
Order Source: Website Cart

⚠️ ACTION REQUIRED:
1. Contact customer within 24 hours
2. Confirm order details
3. Arrange delivery/pickup
4. Update order status in admin panel

Customer Phone: ${customerPhone}
${customerEmail ? `Customer Email: ${customerEmail}` : ''}
    `;
}

function convertToHTML(text) {
    const lines = text.split('\n').map(line => {
        if (line.trim() === '') return '<br>';
        return `<p style="margin: 0 0 10px 0;">${line}</p>`;
    }).join('');
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;
                }
                .header { 
                    background: linear-gradient(135deg, #1a5276 0%, #2980b9 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0;
                }
                .content { 
                    padding: 30px; 
                    background: #f8f9fa; 
                    border: 1px solid #e9ecef;
                    border-top: none;
                }
                .footer { 
                    background: #2c3e50; 
                    color: white; 
                    padding: 20px; 
                    text-align: center; 
                    font-size: 12px; 
                    border-radius: 0 0 10px 10px;
                }
                .button { 
                    background: #d4af37; 
                    color: #1a5276; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block; 
                    font-weight: bold;
                    margin: 10px 0;
                }
                .contact-info {
                    background: #e8f4fd;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #3498db;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="margin: 0; font-size: 24px;">Collaborative Investment Ltd</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Building Nigeria's Business Future</p>
            </div>
            
            <div class="content">
                ${lines}
                
                <div class="contact-info">
                    <strong>Need help?</strong><br>
                    We're here to assist you with any questions or concerns.
                </div>
                
                <a href="https://collaborativeinvestmentltd.com" class="button">
                    Visit Our Website
                </a>
            </div>
            
            <div class="footer">
                <p style="margin: 0;">
                    <strong>Collaborative Investment Ltd</strong><br>
                    212 Ijegun Road, Ikotun, Lagos<br>
                    📞 +234 812 997 8419 | +234 707 826 9765<br>
                    📧 collaborativeinvestmentltd@gmail.com
                </p>
                <p style="margin: 10px 0 0 0; opacity: 0.8;">
                    &copy; 2025 Collaborative Investment Ltd. All rights reserved.
                </p>
            </div>
        </body>
        </html>
    `;
}

// Email sending function
async function sendEmail(to, subject, message, type = 'transactional') {
    try {
        const mailOptions = {
            from: `"Collaborative Investment Ltd" <${emailConfig.auth.user}>`,
            to: to,
            subject: subject,
            text: message,
            html: convertToHTML(message),
            replyTo: 'collaborativeinvestmentltd@gmail.com'
        };

        const info = await transporter.sendMail(mailOptions);
        
        // Save email record to MongoDB
        const emailRecord = await db.collection('emails').insertOne({
            to,
            subject,
            message,
            type,
            status: 'sent',
            messageId: info.messageId,
            sentAt: new Date()
        });

        logger.info(`✅ Email sent to ${to}: ${info.messageId}`);
        return { success: true, emailId: emailRecord.insertedId, messageId: info.messageId };
        
    } catch (error) {
        logger.error('❌ Email sending failed:', error);
        
        // Save failed email record to MongoDB
        await db.collection('emails').insertOne({
            to,
            subject,
            message,
            type,
            status: 'failed',
            error: error.message,
            sentAt: new Date()
        });

        return { success: false, error: error.message };
    }
}

async function handleForgotPassword(req, res) {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
        const { email } = JSON.parse(body);

        if (email !== process.env.ADMIN_EMAIL) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success:true }));
            return;
        }

        const token = crypto.randomBytes(20).toString('hex');
        passwordResetTokens.set(token, Date.now() + 15*60*1000);

        const resetLink = `http://localhost:3000/admin/reset-password?token=${token}`;

        await sendEmail(
            process.env.ADMIN_EMAIL,
            'Admin Password Reset',
            `Click the link to reset password:\n\n${resetLink}\n\nThis expires in 15 minutes.`
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success:true }));
    });
}

// Enhanced email sending function with order templates
async function sendOrderConfirmation(orderData) {
    try {
        const { orderNumber, customerName, customerPhone, customerEmail, items, total } = orderData;
        
        // Customer confirmation email
        const customerSubject = `Order Confirmation - ${orderNumber}`;
        const customerMessage = createCustomerOrderEmail(orderData);
        
        // Admin notification email
        const adminSubject = `🛍️ NEW ORDER - ${orderNumber}`;
        const adminMessage = createAdminOrderNotification(orderData);
        
        // Send to customer if email provided
        let customerEmailResult = null;
        if (customerEmail) {
            customerEmailResult = await sendEmail(
                customerEmail,
                customerSubject,
                customerMessage,
                'order_confirmation'
            );
        }
        
        // Send to admin
        const adminEmailResult = await sendEmail(
            'collaborativeinvestmentltd@gmail.com',
            adminSubject,
            adminMessage,
            'order_notification'
        );
        
        return {
            customer: customerEmailResult,
            admin: adminEmailResult
        };
        
    } catch (error) {
        logger.error('Order confirmation email error:', error);
        throw error;
    }
}

// Database health check
async function checkDatabaseHealth() {
    try {
        // Try a simple query
        const result = await db.collection('users').findOne({});
        return true;
    } catch (error) {
        logger.error('Database health check failed:', error.message);
        return false;
    }
}

// Email service health check
async function checkEmailService() {
    try {
        await transporter.verify();
        return true;
    } catch (error) {
        logger.error('Email service health check failed:', error.message);
        return false;
    }
}

// Handler functions
async function handleHealthCheck(req, res) {
    try {
        const dbStatus = await checkDatabaseHealth();
        const emailStatus = await checkEmailService();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: dbStatus && emailStatus ? 'healthy' : 'degraded',
            services: {
                database: dbStatus,
                email: emailStatus,
                uptime: process.uptime(),
                memory: process.memoryUsage().heapUsed
            },
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'unhealthy', 
            error: error.message,
            timestamp: new Date().toISOString()
        }));
    }
}

function handleContactForm(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const formData = querystring.parse(body);
                logger.info('Contact form submission:', formData);

                const emailMessage = `
New Contact Form Submission:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}
Message: ${formData.message}

Submitted at: ${new Date().toLocaleString()}
                `;

                await sendEmail(
                    'collaborativeinvestmentltd@gmail.com',
                    'New Contact Form Submission - CIL Website',
                    emailMessage,
                    'notification'
                );

                res.writeHead(302, {
                    'Location': '/contact-success'
                });
                res.end();
            } catch (error) {
                logger.error('Contact form error:', error);
                // Still redirect to success page even if email fails
                res.writeHead(302, {
                    'Location': '/contact-success'
                });
                res.end();
            }
            resolve();
        });
    });
}

function handleSendEmail(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const { to, subject, message, type } = JSON.parse(body);
                
                if (!to || !subject || !message) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
                        'Access-Control-Allow-Credentials': 'true'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Missing required fields: to, subject, message' 
                    }));
                    return resolve();
                }

                const result = await sendEmail(to, subject, message, type);
                
                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true'
                };

                if (result.success) {
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: 'Email sent successfully',
                        emailId: result.emailId 
                    }));
                } else {
                    res.writeHead(500, headers);
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Failed to send email: ' + result.error 
                    }));
                }
                
            } catch (error) {
                logger.error('Email API error:', error);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true'
                });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Server error: ' + error.message 
                }));
            }
            resolve();
        });
    });
}

async function handleAdminLogin(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const { email, password } = JSON.parse(body);
                
                // Use database authentication
                const authResult = await db.verifyAdminCredentials(email, password);

                if (authResult.success) {
                    // Create session
                    const sessionId = crypto.randomBytes(16).toString('hex');
                    sessions.set(sessionId, {
                        sessionId,
                        admin: authResult.admin,
                        loginTime: new Date(),
                        lastActivity: new Date()
                    });

                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
                        'Access-Control-Allow-Credentials': 'true'
                    });
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: 'Login successful',
                        redirect: '/admin/dashboard'
                    }));
                } else {
                    res.writeHead(401, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
                        'Access-Control-Allow-Credentials': 'true'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: authResult.message || 'Invalid email or password' 
                    }));
                }
            } catch (error) {
                logger.error('Login error:', error);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true'
                });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Server error: ' + error.message 
                }));
            }
            resolve();
        });
    });
}

async function handleAdminUpdateOrderStatus(req, res, orderId) {
    const admin = checkAdminAuth(req);
    if (!admin) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
    }

    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
        try {
            const { status } = JSON.parse(body);
            if (!status) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Status required' }));
                return;
            }

            const order = await db.collection('orders').findOne({ _id: db.toObjectId(orderId) });
            if (!order) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Order not found' }));
                return;
            }

            const oldStatus = order.status;
            const now = new Date();

            // Update with consistent field names
            await db.collection('orders').updateOne(
              { _id: db.toObjectId(orderId) },
              {
                $set: {
                  status
                },
                $push: {
                  statusHistory: {
                    status,
                    date: now,
                    updatedBy: admin.email,
                    notes: `Status changed by ${admin.email}`
                  }
                }
              }
            );

            // Also update statusUpdates if it exists
            if (order.statusUpdates) {
                await db.collection('orders').updateOne(
                    { _id: db.toObjectId(orderId) },
                    {
                        $push: {
                            statusUpdates: {
                                status,
                                title: `Order ${status}`,
                                description: `Your order has been ${status.toLowerCase()}.`,
                                date: now,
                                completed: true
                            }
                        }
                    }
                );
            }
            // Log the admin action
            await logAdminAction(admin.email, 'UPDATE_ORDER_STATUS', {
                orderId,
                orderNumber: order.orderNumber,
                oldStatus,
                newStatus: status
            }, req);

            // Send emails for milestone statuses
            if (MILESTONE_STATUSES.includes(status)) {
                const trackingLink = `${process.env.BASE_URL || 'http://localhost:3000'}/order-track?tracking=${order.orderNumber}`;

                // Customer email
                if (order.customerEmail) {
                    await sendEmail(
                        order.customerEmail,
                        `Your Order Is Now ${status}`,
                        `Hello ${order.customerName},\n\nYour order (${order.orderNumber}) is now ${status}.\n\nTrack your order here:\n${trackingLink}\n\nThank you for choosing Collaborative Investment Ltd.\n\nBest regards,\nThe CIL Team`,
                        'order_update'
                    );
                }

                // Admin notification
                await sendEmail(
                    process.env.ADMIN_EMAIL || 'collaborativeinvestmentltd@gmail.com',
                    `Order Status Updated – ${order.orderNumber}`,
                    `Order: ${order.orderNumber}\nCustomer: ${order.customerName}\nPrevious Status: ${oldStatus}\nNew Status: ${status}\nUpdated By: ${admin.email}\nTime: ${now}\n\nOrder Details:\n- Total: ₦${order.total.toLocaleString()}\n- Items: ${order.items.map(item => item.name).join(', ')}`,
                    'notification'
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Order status updated',
                order: await db.collection('orders').findOne({ _id: db.toObjectId(orderId) })
            }));

        } catch (err) {
            logger.error('Order status update error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Server error: ' + err.message 
            }));
        }
    });
}

async function handleChangePassword(req, res) {
    const admin = checkAdminAuth(req);
    if (!admin) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
    }

    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
        const { oldPass, newPass } = JSON.parse(body);
        const bcrypt = require('bcryptjs');
        
        // Verify current password
        const match = await bcrypt.compare(oldPass, process.env.ADMIN_PASSWORD_HASH);
        
        if (!match) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Current password incorrect' }));
            return;
        }
        
        try {
            const newHash = await bcrypt.hash(newPass, 12);
            
            // Store in database
            await db.collection('admins').updateOne(
              { email: admin.email },
              { $set: { password: newHash } }
            );
            
            console.log('\n🔐 NEW ADMIN PASSWORD HASH:\n', newHash);
            console.log('⚠️ Please update ADMIN_PASSWORD_HASH in your .env file with this value\n');
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Password updated successfully',
                hash: newHash
            }));
            
        } catch (error) {
            logger.error('Password update error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Failed to update password' 
            }));
        }
    });
}

async function handleResetPassword(req, res) {
    const parsed = url.parse(req.url, true);
    const token = parsed.query.token;

    if (!passwordResetTokens.has(token) || Date.now() > passwordResetTokens.get(token)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Invalid or expired token'
        }));
        return;
    }

    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
        const { password } = JSON.parse(body);
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash(password, 12);

        console.log('\n🔐 NEW ADMIN PASSWORD HASH:\n', hash);
        passwordResetTokens.delete(token);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'Password reset. Update ADMIN_PASSWORD_HASH in .env and restart server.'
        }));
    });
}

function handleCreateOrder(req, res) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { items, total, customerName, customerPhone, customerEmail, customerAddress, customerNotes } = data;

                // Basic validation
                if (!items || items.length === 0 || !total || !customerName || !customerPhone) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Missing required order data.' 
                    }));
                    return resolve();
                }

                const orderNumber = generateOrderNumber();
                
                const newOrder = await db.collection('orders').insertOne({
                    orderNumber,
                    customerName,
                    customerPhone,
                    customerEmail: customerEmail || '',
                    customerAddress: customerAddress || '',
                    customerNotes: customerNotes || '',
                    total,
                    status: 'pending',
                    items,
                    source: 'website_cart',
                    alternativeOrderNumbers: generateAlternativeFormats(orderNumber),
                    statusUpdates: [
                        {
                            status: 'pending',
                            title: 'Order Placed',
                            description: 'Your order has been received and is being processed.',
                            date: new Date(),
                            completed: true
                        }
                    ],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                // Log the order
                logger.info('Order created', {
                    orderNumber,
                    customerName,
                    total,
                    itemsCount: items.length,
                    timestamp: new Date().toISOString()
                });

                const emailResult = await sendOrderConfirmation({
                    orderNumber,
                    customerName,
                    customerPhone,
                    customerEmail: customerEmail || '',
                    customerAddress: customerAddress || '',
                    customerNotes: customerNotes || '',
                    items,
                    total
                });

                res.writeHead(201, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                });
                res.end(JSON.stringify({ 
                    success: true, 
                    order: newOrder.ops ? newOrder.ops[0] : newOrder,
                    emails: {
                        customer: emailResult.customer ? 'sent' : 'skipped',
                        admin: emailResult.admin ? 'sent' : 'failed'
                    }
                }));
                
            } catch (error) {
                logger.error('Order creation error:', error);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
                });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Server error while creating order.' 
                }));
            }
            resolve();
        });
    });
}

function handleAdminLogout(req, res) {
    const cookies = req.headers.cookie || '';
    const match = cookies.match(/sessionId=([^;]+)/);

    if (match) {
        sessions.delete(match[1]);
    }

    res.writeHead(200, {
        'Set-Cookie': 'sessionId=; Path=/; Max-Age=0',
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ success: true }));
}

function handleAdminForgotPassword(req, res) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { email } = JSON.parse(body);
                if (!email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Email required' }));
                    return resolve();
                }

                if (email !== process.env.ADMIN_EMAIL) {
                    // Silent fail for security
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                    return resolve();
                }

                const token = crypto.randomBytes(32).toString('hex');
                passwordResetTokens.set(token, {
                    email,
                    expires: Date.now() + (15 * 60 * 1000)
                });

                const resetLink = `https://${DOMAIN}/admin/reset-password?token=${token}`;

                await sendEmail(
                    email,
                    'Admin Password Reset',
                    `Click the link below to reset your admin password:\n\n${resetLink}\n\nThis link expires in 15 minutes.`
                );

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                logger.error('Forgot password error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server error' }));
            }
            resolve();
        });
    });
}

// Main request handler function
async function requestHandler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle user dashboard authentication
    if (req.method === 'GET' && (pathname === '/customer-dashboard' || pathname === '/investor-dashboard')) {
        const user = checkUserAuth(req);
        if (!user) {
            res.writeHead(302, { Location: '/register' });
            res.end();
            return;
        }
        // Continue to serve the dashboard page below
    }

    // Handle user API routes
    if (pathname.startsWith('/api/user/')) {
        return handleUserAPI(req, res, pathname);
    }

    // Handle investor API routes
    if (pathname.startsWith('/api/investor/')) {
        return handleInvestorDashboardAPI(req, res, pathname);
    }

    // Log request
    logger.info(`${req.method} ${pathname} - ${req.socket.remoteAddress}`);
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle POST routes first
    if (req.method === 'POST') {
        if (pathname === '/admin/login') {
            return handleAdminLogin(req, res);
        }
        if (pathname === '/admin/logout') {
            return handleAdminLogout(req, res);
        }
        if (pathname === '/admin/change-password') {
            return handleChangePassword(req, res);
        }
        if (pathname === '/admin/forgot-password') {
            return handleAdminForgotPassword(req, res);
        }
        if (pathname === '/admin/reset-password') {
            return handleResetPassword(req, res);
        }
        if (pathname === '/api/orders') {
            return handleCreateOrder(req, res);
        }
        if (pathname === '/contact') {
            return handleContactForm(req, res);
        }
        if (pathname === '/api/order/track') {
            return handleOrderTrack(req, res);
        }
        if (pathname === '/admin/api/send-email') {
            return handleSendEmail(req, res);
        }
        if (pathname === '/api/register') {
            return handleUserRegistration(req, res);
        }
        if (pathname === '/api/user/login') {
            return handleUserLogin(req, res);
        }
        if (pathname === '/api/user/logout') {
            return handleUserLogout(req, res);
        }
        if (pathname === '/api/investor/invest') {
            return handleInvestorDashboardAPI(req, res, pathname);
        }
        if (pathname === '/api/investor/emergency') {
            return handleInvestorDashboardAPI(req, res, pathname);
        }
        if (pathname === '/api/investor/payment') {
            return handleInvestorDashboardAPI(req, res, pathname);
        }
        if (pathname === '/api/investor/mark-notification-read') {
            return handleInvestorDashboardAPI(req, res, pathname);
        }
        if (pathname === '/api/investor/kyc/start') {
            return handleInvestorDashboardAPI(req, res, pathname);
        }
    }

    // Handle PUT routes
    if (req.method === 'PUT') {
        if (pathname.match(/^\/admin\/api\/orders\/([a-fA-F0-9]{24})\/status$/)) {
            const orderId = pathname.split('/')[4];
            return handleAdminUpdateOrderStatus(req, res, orderId);
        }
    }

    // Check admin authentication for protected routes
    if (pathname.startsWith('/admin') && 
        pathname !== '/admin/login' && 
        pathname !== '/admin/forgot-password' &&
        pathname !== '/admin/reset-password' &&
        !pathname.startsWith('/admin/api')) {
        
        const admin = checkAdminAuth(req);
        if (!admin) {
            res.writeHead(302, { Location: '/admin/login' });
            res.end();
            return;
        }
    }

    // Handle GET /admin/login with auth check
    if (req.method === 'GET' && pathname === '/admin/login') {
        const admin = checkAdminAuth(req);
        if (admin) {
            res.writeHead(302, { Location: '/admin/dashboard' });
            res.end();
            return;
        }

        const filePath = path.join(__dirname, 'views', 'admin-login.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Admin login page missing');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }

    if (req.method === 'GET') {
        if (pathname.startsWith('/api/investor/')) {
            return handleInvestorDashboardAPI(req, res, pathname);
        }
    }
    
    // Handle special routes
    if (pathname === '/health') {
        return handleHealthCheck(req, res);
    }
    
    if (pathname.startsWith('/admin/api/')) {
        return handleAdminAPI(req, res, pathname);
    }

    // Handle static files and HTML pages
    let filePath = '';

    if (pathname === '/order-tracking') {
        filePath = path.join(__dirname, 'views', 'order-tracking.html');
    }

    const isStaticFile = STATIC_DIRS.some(dir => pathname.startsWith(dir));
    
    if (isStaticFile) {
        filePath = path.join(__dirname, 'public', pathname.substring(1));
    } else if (ROUTES[pathname] !== undefined) {
        if (ROUTES[pathname] === null) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        if (!filePath) {
            filePath = path.join(__dirname, 'views', ROUTES[pathname]);
        }
    } else if (pathname === '/favicon.ico') {
        filePath = path.join(__dirname, 'public', 'img', 'favicon.ico');
    } else {
        filePath = path.join(__dirname, 'views', '404.html');
    }

    // Security: Prevent directory traversal
    filePath = path.normalize(filePath);
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Check cache first
    const cached = cache.get(filePath);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        const cacheControl = isStaticFile 
            ? 'public, max-age=86400'
            : 'public, max-age=3600';
        
        res.writeHead(200, { 
            'Content-Type': cached.contentType,
            'Cache-Control': cacheControl
        });
        res.end(cached.content, 'utf-8');
        return;
    }

    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Page not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - Page Not Found</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            h1 { color: #d4af37; }
                            a { color: #1a365d; text-decoration: none; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - Page Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                        <p><a href="/">← Go Back Home</a></p>
                    </body>
                    </html>
                `);
            } else {
                logger.error('Server Error:', error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>500 - Server Error</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            h1 { color: #e53e3e; }
                        </style>
                    </head>
                    <body>
                        <h1>500 - Server Error</h1>
                        <p>Something went wrong on our end. Please try again later.</p>
                        <p><a href="/">← Go Back Home</a></p>
                    </body>
                    </html>
                `);
            }
        } else {
            // Cache the file
            cache.set(filePath, {
                content: content,
                timestamp: Date.now(),
                contentType: contentType
            });
            
            const cacheControl = isStaticFile 
                ? 'public, max-age=86400'
                : 'public, max-age=3600';
            
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': cacheControl
            });
            res.end(content, 'utf-8');
        }
    });
}

// Enhanced admin API handler
async function handleAdminAPI(req, res, pathname) {
    const admin = checkAdminAuth(req);
    if (!admin) {
        res.writeHead(401, { 
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer realm="Admin API"'
        });
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Unauthorized - Please login',
            code: 'UNAUTHORIZED'
        }));
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    };

    try {
        if (pathname === '/admin/api/products') {
            const products = await db.collection('products').find({}).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(products));
        }
        else if (pathname === '/admin/api/orders') {
            const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(orders));
        }
        else if (pathname === '/admin/api/customers') {
            const customers = await db.collection('customers').find({}).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(customers));
        }
        else if (pathname === '/admin/api/stats') {
            const stats = await db.getStats();
            res.writeHead(200, headers);
            res.end(JSON.stringify(stats));
        }
        else if (pathname === '/admin/api/email-campaigns') {
            const campaigns = await db.collection('campaigns').find({}).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(campaigns));
        }
        else if (pathname === '/admin/api/recent-emails') {
            const emails = await db.collection('emails').find({}).sort({ sentAt: -1 }).limit(50).toArray();

            const formattedEmails = emails.map(email => ({
                to: email.to,
                subject: email.subject,
                message: email.body || email.message || '',
                type: email.type || 'transactional',
                status: email.status || 'sent',
                sentAt: email.sentAt || email.createdAt,
                createdAt: email.createdAt
            }));

            res.writeHead(200, headers);
            res.end(JSON.stringify(formattedEmails));
        }
        else if (pathname === '/admin/api/email-stats') {
            // Calculate email stats
            const emails = await db.collection('emails').find({}).sort({ sentAt: -1 }).limit(1000).toArray();
            
            const total = emails.length;
            const sent = emails.filter(e => e.status === 'sent').length;
            const failed = emails.filter(e => e.status === 'failed').length;
            const delivered = emails.filter(e => e.status === 'delivered' || e.status === 'sent').length;
            
            const stats = {
                total,
                sent,
                failed,
                delivered,
                deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
                successRate: total > 0 ? Math.round(((total - failed) / total) * 100) : 0
            };
            
            res.writeHead(200, headers);
            res.end(JSON.stringify(stats));
        }
        else if (pathname === '/admin/api/health') {
            res.writeHead(200, headers);
            res.end(JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                admin: {
                    email: admin.email,
                    lastActivity: admin.lastActivity || new Date()
                },
                services: {
                    database: true,
                    email: true
                }
            }));
        }
        else if (pathname === '/admin/api/send-email') {
            // Already handled in main request handler
            res.writeHead(404, headers);
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Use POST /admin/api/send-email directly',
                code: 'ENDPOINT_NOT_FOUND'
            }));
        }
        else if (pathname === '/admin/api/users') {
            const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(users));
        }
        else if (pathname === '/admin/api/investors') {
            const investors = await db.collection('investors').find({}).sort({ createdAt: -1 }).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(investors));
        }
        else if (pathname === '/admin/api/payments') {
            const payments = await db.collection('payments').find({}).sort({ createdAt: -1 }).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(payments));
        }
        else if (pathname === '/admin/api/kyc-requests') {
            const kycRequests = await db.collection('kyc_requests').find({}).sort({ requestedAt: -1 }).toArray();
            res.writeHead(200, headers);
            res.end(JSON.stringify(kycRequests));
        }
        else {
            res.writeHead(404, headers);
            res.end(JSON.stringify({ 
                success: false, 
                message: 'API endpoint not found',
                code: 'ENDPOINT_NOT_FOUND'
            }));
        }
    } catch (error) {
        logger.error('Admin API Error:', error);
        res.writeHead(500, headers);
        res.end(JSON.stringify({ 
            success: false, 
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }));
    }
}

// ============================================================================
async function startServer() {
    await connectDB();

    const server = http.createServer(requestHandler);

    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

    process.on("SIGINT", async () => {
        logger.info("📦 Creating final backup...");
        try {
            await backupDatabase();
        } catch (err) {
            logger.error("Backup failed:", err.message);
        }

        await closeDB();
        process.exit(0);
    });
}

startServer();