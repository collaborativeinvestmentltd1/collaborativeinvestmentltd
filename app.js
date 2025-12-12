require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { connectDB, db, closeDB, backupDatabase } = require('./database');
const adminAuth = require('./admin-auth');

// Import logging module
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'; // Added HOST definition
const DOMAIN = process.env.DOMAIN || 'localhost';

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
    secure: (process.env.EMAIL_SECURE === 'true'), // true for 465, false for 587
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
    '/health': null // Special case - handled separately
};

// Static file directories
const STATIC_DIRS = ['/css/', '/js/', '/img/', '/downloads/', '/public/'];

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
        if (inactiveTime > 24 * 60 * 60 * 1000) { // 24 hours
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
            logger.info(`Admin access: ${session.admin.email} - ${req.method} ${req.url}`);
            return session.admin;
        }
    }
    return null;
}

function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const currentYear = new Date().getFullYear();
    
    // New format: CIL-YYYY-TIMESTAMPPART
    // Use last 6 digits of timestamp for consistency
    const timestampPart = timestamp.slice(-6);
    return `CIL-${timestampPart}-${random}`; // Keep the old format for backward compatibility
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
                
                // Normalize the order number
                const normalizedOrderNumber = orderNumber.toUpperCase().trim();
                
                console.log(`Tracking request for: ${normalizedOrderNumber}`);
                
                // Try multiple search strategies
                let order = null;
                
                // Strategy 1: Exact match on orderNumber
                console.log(`Strategy 1: Exact match for ${normalizedOrderNumber}`);
                order = await findOrderByNumber(normalizedOrderNumber);
                
                // Strategy 2: Search in alternativeOrderNumbers
                if (!order) {
                    console.log(`Strategy 2: Search alternativeOrderNumbers for ${normalizedOrderNumber}`);
                    order = await findOrderByAlternativeNumber(normalizedOrderNumber);
                }
                
                // Strategy 3: Try different formats
                if (!order) {
                    console.log(`Strategy 3: Generate alternative formats for ${normalizedOrderNumber}`);
                    const alternativeFormats = generateAlternativeFormats(normalizedOrderNumber);
                    for (const format of alternativeFormats) {
                        console.log(`  Trying format: ${format}`);
                        order = await findOrderByNumber(format);
                        if (order) {
                            console.log(`  Found with format: ${format}`);
                            break;
                        }
                        
                        order = await findOrderByAlternativeNumber(format);
                        if (order) {
                            console.log(`  Found in alternatives with format: ${format}`);
                            break;
                        }
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

// Helper functions - add these after handleOrderTrack function

async function findOrderByNumber(orderNumber) {
    try {
        const orders = await db.getAll('orders', { orderNumber });
        return orders.length > 0 ? orders[0] : null;
    } catch (error) {
        console.error('Error in findOrderByNumber:', error);
        return null;
    }
}

async function findOrderByAlternativeNumber(orderNumber) {
    try {
        const orders = await db.getAll('orders', { 
            alternativeOrderNumbers: orderNumber 
        });
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
        const timestamp = parts[1]; // 367193
        const random = parts[2]; // 944
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`); // CIL-2025-367193
        formats.push(timestamp); // 367193
        formats.push(`CIL-${timestamp}`); // CIL-367193
        formats.push(`${timestamp}-${random}`); // 367193-944
        formats.push(`CIL-${timestamp}-${random}`); // Original format (just in case)
        
        // Also try without leading zeros in the middle part
        const numericTimestamp = parseInt(timestamp, 10).toString();
        if (numericTimestamp !== timestamp) {
            formats.push(`CIL-${currentYear}-${numericTimestamp}`);
            formats.push(numericTimestamp);
            formats.push(`CIL-${numericTimestamp}`);
        }
    }
    // Try if it's just numbers
    else if (orderNumber.match(/^\d{6}$/)) {
        const timestamp = orderNumber; // 367193
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`); // CIL-2025-367193
        formats.push(`CIL-${timestamp}`); // CIL-367193
        formats.push(`CIL-${timestamp}-???`); // Try with placeholder
    }
    // Try if it's numbers with hyphen
    else if (orderNumber.match(/^\d{6}-\d{3}$/)) {
        const parts = orderNumber.split('-');
        const timestamp = parts[0]; // 367193
        const random = parts[1]; // 944
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`); // CIL-2025-367193
        formats.push(`CIL-${timestamp}`); // CIL-367193
        formats.push(`CIL-${timestamp}-${random}`); // CIL-367193-944
        formats.push(timestamp); // 367193
    }
    // Try if it's CIL- followed by numbers
    else if (orderNumber.match(/^CIL-\d{6}$/)) {
        const timestamp = orderNumber.replace('CIL-', ''); // 367193
        const currentYear = new Date().getFullYear();
        
        formats.push(`CIL-${currentYear}-${timestamp}`); // CIL-2025-367193
        formats.push(timestamp); // 367193
        formats.push(`CIL-${timestamp}-???`); // Try with placeholder
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
        const emailRecord = await db.create('emails', {
            to,
            subject,
            message,
            type,
            status: 'sent',
            messageId: info.messageId,
            sentAt: new Date()
        });

        logger.info(`✅ Email sent to ${to}: ${info.messageId}`);
        return { success: true, emailId: emailRecord._id, messageId: info.messageId };
        
    } catch (error) {
        logger.error('❌ Email sending failed:', error);
        
        // Save failed email record to MongoDB
        await db.create('emails', {
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
        const result = await db.getStats();
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

function handleAdminAPI(req, res, pathname) {
    const admin = checkAdminAuth(req);
    if (!admin) {
        res.writeHead(401, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true'
        });
        res.end(JSON.stringify({ error: 'Unauthorized - Please login again' }));
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
    };

    if (pathname === '/admin/api/products') {
        db.getAll('products').then(products => {
            res.writeHead(200, headers);
            res.end(JSON.stringify(products));
        });
    } 
    else if (pathname === '/admin/api/orders') {
        db.getAll('orders', {}, { createdAt: -1 }).then(orders => {
            res.writeHead(200, headers);
            res.end(JSON.stringify(orders));
        });
    }
    else if (pathname === '/admin/api/customers') {
        db.getAll('customers').then(customers => {
            res.writeHead(200, headers);
            res.end(JSON.stringify(customers));
        });
    }
    else if (pathname === '/admin/api/stats') {
        db.getStats().then(stats => {
            res.writeHead(200, headers);
            res.end(JSON.stringify(stats));
        });
    }
    else if (pathname === '/admin/api/email-campaigns') {
        db.getAll('campaigns').then(campaigns => {
            res.writeHead(200, headers);
            res.end(JSON.stringify(campaigns));
        });
    }
    else if (pathname === '/admin/api/recent-emails') {
        db.getRecentEmails(50).then(emails => {
            res.writeHead(200, headers);
            res.end(JSON.stringify(emails));
        });
    }
    else if (pathname === '/admin/api/send-email') {
        handleSendEmail(req, res);
        return;
    }
    else {
        res.writeHead(404, headers);
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
}

function handleAdminLogin(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const { email, password } = JSON.parse(body);
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
                res.end(JSON.stringify({ success: false, message: 'Server error' }));
            }
            resolve();
        });
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
                
                const newOrder = await db.create('orders', {
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
                    alternativeOrderNumbers: generateAlternativeFormats(orderNumber), // Add this line
                    statusUpdates: [  // Add this field
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
                    order: newOrder,
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
    const sessionMatch = cookies.match(/sessionId=([^;]+)/);
    
    if (sessionMatch) {
        const sessionId = sessionMatch[1];
        sessions.delete(sessionId);
    }

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': 'sessionId=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
    });
    res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
}

// Main request handler function
async function requestHandler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Initialize filePath at the beginning
    let filePath = '';

    // Log request
    logger.info(`${req.method} ${pathname} - ${req.socket.remoteAddress}`);
    
    // Security headers (Render handles HTTPS)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');

    if (pathname === '/order-tracking') {
        filePath = path.join(__dirname, 'views', 'order-tracking.html');
    }
    
    // Handle special routes first
    if (pathname === '/health') {
        await handleHealthCheck(req, res);
        return;
    }
    
    if (pathname.startsWith('/admin/api/')) {
        handleAdminAPI(req, res, pathname);
        return;
    }

    if (req.method === 'POST' && pathname === '/admin/logout') {
        await handleAdminLogout(req, res);
        return;
    }

    if (req.method === 'POST' && pathname === '/api/orders') {
        await handleCreateOrder(req, res);
        return;
    }
    
    if (req.method === 'POST' && pathname === '/admin/login') {
        await handleAdminLogin(req, res);
        return;
    }
    
    if (req.method === 'POST' && pathname === '/contact') {
        await handleContactForm(req, res);
        return;
    }

    if (req.method === 'POST' && pathname === '/api/order/track') {
        await handleOrderTrack(req, res);
        return;
    }

    if (req.method === 'GET' && pathname.startsWith('/api/order/')) {
        const orderNumber = pathname.split('/').pop();

        try {
            const order = await db.getOne('orders', { orderNumber });

            if (!order) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Order not found' }));
                return;
            }

            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
            });
            res.end(JSON.stringify({ success: true, order }));

        } catch (error) {
            logger.error('Order fetch error:', error);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000'
            });
            res.end(JSON.stringify({ success: false, message: 'Server error' }));
        }
        return;
    }
    
    // Handle static files and HTML pages
    const isStaticFile = STATIC_DIRS.some(dir => pathname.startsWith(dir));
    
    if (isStaticFile) {
        filePath = path.join(__dirname, 'public', pathname.substring(1));
    } else if (ROUTES[pathname] !== undefined) {
        if (ROUTES[pathname] === null) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        // Only set filePath if it hasn't been set by /order-tracking handler
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
// ============================================================================
async function startServer() {
    await connectDB();

    const server = http.createServer(requestHandler);

    server.listen(PORT, HOST, () => {
        logger.info(`🚀 Server running at http://${HOST}:${PORT}`);
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