const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

// Import email utilities (all functions)
const { 
    sendContactEmail, 
    sendUserConfirmation,
    sendNewsletterConfirmation,
    sendNewsletterNotification,
    sendJobApplication,
    sendApplicationConfirmation
} = require('./utils/email');

// Import transporter for testing
const { transporter } = require('./utils/email');

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// ----- ROUTES -----

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// About Us
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Ecosystem
app.get('/ecosystem', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ecosystem.html'));
});

// Companies
app.get('/companies', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'companies.html'));
});

// Partners
app.get('/partners', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'partners.html'));
});

// News
app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news.html'));
});

// News Articles
app.get('/news-sponktech', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-sponktech.html'));
});
app.get('/news-land-to-agriculture', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-land-to-agriculture.html'));
});
app.get('/news-jobberman', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-jobberman.html'));
});
app.get('/news-workforce-academy', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-workforce-academy.html'));
});
app.get('/news-capp', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-capp.html'));
});
app.get('/news-mfb-digital', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-mfb-digital.html'));
});
app.get('/news-diaspora-console', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-diaspora-console.html'));
});
app.get('/news-branch-expansion', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-branch-expansion.html'));
});
app.get('/news-cilconnect', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-cilconnect.html'));
});

// Contact
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Careers
app.get('/careers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'careers.html'));
});

// Register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Terms & Privacy
app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'terms.html'));
});
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'privacy.html'));
});

// Property, Solar, Finance, Workforce
app.get('/property', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'property.html'));
});
app.get('/solar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'solar.html'));
});
app.get('/finance', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'finance.html'));
});
app.get('/workforce', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'workforce.html'));
});

// ----- CONTACT FORM API -----
app.post('/api/contact', async (req, res) => {
    console.log('📨 Contact form submission received:', req.body.email);
    try {
        const { fullName, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!fullName || !email || !message) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({ 
                success: false, 
                error: 'Please fill in all required fields.' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Validation failed: Invalid email format');
            return res.status(400).json({ 
                success: false, 
                error: 'Please enter a valid email address.' 
            });
        }

        // Prepare data
        const contactData = {
            fullName,
            email,
            phone: phone || 'Not provided',
            subject: subject || 'General Inquiry',
            message
        };

        console.log('📧 Sending contact email to admin...');
        await sendContactEmail(contactData);
        console.log('✅ Admin email sent successfully');

        console.log('📧 Sending confirmation email to user...');
        await sendUserConfirmation(contactData);
        console.log('✅ User confirmation sent successfully');

        res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully!' 
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send message. Please try again later.' 
        });
    }
});

// ----- NEWSLETTER API -----
app.post('/api/newsletter', async (req, res) => {
    console.log('📨 Newsletter subscription received:', req.body.email);
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email is required.' 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please enter a valid email address.' 
            });
        }

        console.log('📧 Sending newsletter confirmation to user...');
        await sendNewsletterConfirmation(email);
        console.log('✅ Newsletter confirmation sent to user');

        console.log('📧 Sending newsletter notification to admin...');
        await sendNewsletterNotification(email);
        console.log('✅ Newsletter notification sent to admin');

        res.status(200).json({ 
            success: true, 
            message: 'Subscribed successfully!' 
        });

    } catch (error) {
        console.error('❌ Newsletter error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to subscribe. Please try again later.' 
        });
    }
});

// ----- JOB APPLICATION API -----
app.post('/api/apply', async (req, res) => {
    console.log('📨 Job application received for:', req.body.jobTitle);
    try {
        const { fullName, email, phone, country, state, jobTitle, department, coverLetter, cvFilename } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !jobTitle || !department) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please fill in all required fields.' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please enter a valid email address.' 
            });
        }

        // Validate country and state
        if (!country) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please select your country.' 
            });
        }

        if (!state) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please select your state/province.' 
            });
        }

        // Prepare data
        const applicationData = {
            fullName,
            email,
            phone,
            country,
            state,
            jobTitle,
            department,
            coverLetter: coverLetter || '',
            cvFilename: cvFilename || 'Uploaded via form'
        };

        // Send email to HR team
        await sendJobApplication(applicationData);
        console.log('✅ Job application sent to admin');

        // Send confirmation email to applicant
        await sendApplicationConfirmation(applicationData);
        console.log('✅ Application confirmation sent to user');

        res.status(200).json({ 
            success: true, 
            message: 'Application submitted successfully!' 
        });

    } catch (error) {
        console.error('❌ Job application error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to submit application. Please try again later.' 
        });
    }
});

// ----- EVENT SIGNUP API -----
app.post('/api/event-signup', async (req, res) => {
    console.log('📨 Event registration received:', req.body.email);
    try {
        const { fullName, email, phone } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please fill in all required fields.' 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please enter a valid email address.' 
            });
        }

        // Log registration
        console.log('Event registration:', { fullName, email, phone });

        // TODO: Send notification email to admin
        // await sendEventSignupNotification({ fullName, email, phone });

        // TODO: Send confirmation email to user
        // await sendEventSignupConfirmation({ fullName, email });

        res.status(200).json({ 
            success: true, 
            message: 'Registration successful!' 
        });

    } catch (error) {
        console.error('❌ Event signup error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to register. Please try again later.' 
        });
    }
});

// ----- TEST EMAIL API -----
app.get('/api/test-email', async (req, res) => {
    try {
        console.log('🔧 Testing email configuration...');
        console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
        console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
        
        // Test the transporter
        await transporter.verify();
        console.log('✅ Transporter verification successful');
        
        // Send a test email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email from CIL Website',
            text: 'This is a test email to verify email configuration.',
            html: '<h1>Test Email</h1><p>This is a test email to verify email configuration.</p>'
        });
        console.log('✅ Test email sent successfully');
        
        res.json({ 
            success: true, 
            message: 'Email configuration is working!',
            emailUser: process.env.EMAIL_USER,
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        console.error('❌ Test email failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: error.stack
        });
    }
});

// ----- HEALTH CHECK -----
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        emailConfigured: !!process.env.EMAIL_USER
    });
});

// ----- 404 - Not Found -----
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// ----- Global Error Handler -----
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).sendFile(path.join(__dirname, 'views', '404.html'));
});

// ----- Start Server -----
app.listen(PORT, () => {
    console.log(`🚀 CIL Website running on http://localhost:${PORT}`);
    console.log(`📧 Email configured with: ${process.env.EMAIL_USER}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Server is ready to accept connections`);
});