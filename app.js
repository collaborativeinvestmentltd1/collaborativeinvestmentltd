const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;

// Email configuration
const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'collaborativeinvestmentltd@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password-here' // Use App Password for Gmail
    }
};

const transporter = nodemailer.createTransport(emailConfig);

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

// Route configuration
const ROUTES = {
    '/': 'index.html',
    '/about': 'about.html',
    '/services': 'services.html',
    '/portfolio': 'portfolio.html',
    '/investment': 'investment.html',
    '/contact': 'contact.html',
    '/blog': 'blog.html',
    '/privacy-policy': 'privacy-policy.html',
    '/terms': 'terms.html',
    '/contact-success': 'contact-success.html'
};

// Static file directories
const STATIC_DIRS = ['/css/', '/js/', '/img/', '/downloads/'];

// Contact form handler
async function handleContactForm(req, res) {
    return new Promise((resolve) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const formData = querystring.parse(body);
                
                console.log('Form data received:', formData);

                // Send email to company
                const companyMailOptions = {
                    from: emailConfig.auth.user,
                    to: 'collaborativeinvestmentltd@gmail.com',
                    subject: `New Contact Form Submission - ${formData.name}`,
                    html: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${formData.name}</p>
                        <p><strong>Email:</strong> ${formData.email}</p>
                        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
                        <p><strong>Service Interest:</strong> ${formData.service}</p>
                        <p><strong>Investment Amount:</strong> ${formData.investment_amount || 'Not specified'}</p>
                        <p><strong>Message:</strong></p>
                        <p>${formData.message}</p>
                        <p><strong>Newsletter:</strong> ${formData.newsletter ? 'Subscribed' : 'Not subscribed'}</p>
                        <hr>
                        <p><em>Sent from Collaborative Investment Ltd Website</em></p>
                    `
                };

                // Send auto-reply to user
                const userMailOptions = {
                    from: emailConfig.auth.user,
                    to: formData.email,
                    subject: 'Thank You for Contacting Collaborative Investment Ltd',
                    html: `
                        <h2>Thank You for Contacting Us!</h2>
                        <p>Dear ${formData.name},</p>
                        <p>We have received your message and will get back to you within 24 hours.</p>
                        <p><strong>Your Inquiry Summary:</strong></p>
                        <ul>
                            <li><strong>Service:</strong> ${formData.service}</li>
                            <li><strong>Investment Interest:</strong> ${formData.investment_amount || 'Not specified'}</li>
                        </ul>
                        <p>If you have any urgent questions, please call us at +234 812 997 8419.</p>
                        <br>
                        <p>Best regards,</p>
                        <p><strong>Collaborative Investment Ltd Team</strong></p>
                        <p>📧 collaborativeinvestmentltd@gmail.com</p>
                        <p>📞 +234 812 997 8419</p>
                        <hr>
                        <p><small>This is an automated response. Please do not reply to this email.</small></p>
                    `
                };

                // Send both emails
                console.log('Sending emails...');
                await transporter.sendMail(companyMailOptions);
                console.log('Company email sent');
                await transporter.sendMail(userMailOptions);
                console.log('User auto-reply sent');

                // Redirect to success page
                res.writeHead(302, {
                    'Location': '/contact-success'
                });
                res.end();
                resolve();
            } catch (error) {
                console.error('Email sending error:', error);
                
                // Fallback: still redirect to success but log error
                res.writeHead(302, {
                    'Location': '/contact-success'
                });
                res.end();
                resolve();
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Handle contact form submission
    if (req.method === 'POST' && pathname === '/contact') {
        await handleContactForm(req, res);
        return;
    }
    
    let filePath = '';
    
    // Check if it's a static file request
    const isStaticFile = STATIC_DIRS.some(dir => pathname.startsWith(dir));
    
    if (isStaticFile) {
        // Serve static files from public directory
        filePath = path.join(__dirname, 'public', pathname);
    } else if (ROUTES[pathname]) {
        // Serve HTML pages from views directory
        filePath = path.join(__dirname, 'views', ROUTES[pathname]);
    } else if (pathname === '/favicon.ico') {
        // Serve favicon
        filePath = path.join(__dirname, 'public', 'img', 'favicon.ico');
    } else {
        // Handle blog article routes (simple pattern)
        if (pathname.startsWith('/blog/')) {
            // For now, redirect to main blog page
            // In production, you'd serve individual article pages
            filePath = path.join(__dirname, 'views', 'blog.html');
        } else {
            // Serve other files or 404
            filePath = path.join(__dirname, 'public', pathname);
        }
    }

    // Security: Prevent directory traversal
    filePath = path.normalize(filePath);
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Page not found - serve 404.html
                fs.readFile(path.join(__dirname, 'views', '404.html'), (err, notFoundContent) => {
                    if (err) {
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
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(notFoundContent, 'utf-8');
                    }
                });
            } else {
                // Server error
                console.error('Server Error:', error);
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
            // Success - serve file with appropriate content type
            const cacheControl = isStaticFile 
                ? 'public, max-age=86400' // Cache static files for 1 day
                : 'public, max-age=3600'; // Cache HTML pages for 1 hour
            
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': cacheControl,
                'Content-Length': Buffer.byteLength(content)
            });
            res.end(content, 'utf-8');
        }
    });
});

// Error handling for server
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
        console.log('💡 Try setting a different port: PORT=8080 node app.js');
        process.exit(1);
    } else {
        console.error('❌ Server error:', error);
        process.exit(1);
    }
});

server.listen(PORT, () => {
    console.log('🚀 Collaborative Investment Ltd Website successfully deployed!');
    console.log(`📍 Running at: http://localhost:${PORT}`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`👥 Team: Collaborative Investment Ltd`);
    console.log(`📧 Email: collaborativeinvestmentltd@gmail.com`);
    console.log(`📞 Phone: +234 812 997 8419`);
    console.log('💡 Press Ctrl+C to stop the server');
    console.log('\n📄 Available Pages:');
    console.log('   • /              - Homepage');
    console.log('   • /about         - About Us');
    console.log('   • /services      - Our Services');
    console.log('   • /portfolio     - Portfolio');
    console.log('   • /investment    - Investment Opportunities');
    console.log('   • /blog          - Business Insights Blog');
    console.log('   • /contact       - Contact Us');
    console.log('   • /privacy-policy - Privacy Policy');
    console.log('   • /terms         - Terms of Service');
    console.log('   • /contact-success - Contact Success Page');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});