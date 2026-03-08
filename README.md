<<<<<<< HEAD
Collaborative Investment Ltd Website

https://img/logo.jpg
🌟 About The Project

Collaborative Investment Ltd (CIL) is a Lagos-based business development and investment management company dedicated to transforming SMEs into profitable, scalable enterprises across Nigeria. Our website serves as a digital platform for showcasing investment opportunities, managing business partnerships, and connecting with investors worldwide.
🏆 Key Features

    Multi-Sector Investment Portfolio - Agriculture, Manufacturing, Renewable Energy, Construction, Furniture

    Professional Business Management - Structured investment oversight and reporting

    Diaspora Investment Solutions - Specialized services for Nigerians abroad

    E-commerce Integration - Product sales and order management

    Investment Analytics - Performance tracking and reporting

🚀 Live Demo

🌐 Website URL: https://collaborativeinvestmentltd.com
🔐 Admin Panel: /admin/login
📁 Project Structure
text

cil-website/
├── index.html              # Home page
├── about.html              # About us page
├── services.html           # Services overview
├── shop-categories.html    # Product categories
├── investment.html         # Investment opportunities
├── contact.html            # Contact form
├── blog/                   # Blog articles
├── css/                    # Stylesheets
│   ├── style.css          # Main styles
│   ├── colors.css         # Color scheme
│   ├── cart.css           # Shopping cart styles
│   └── cart-drawer.css    # Cart drawer styles
├── js/                     # JavaScript files
│   ├── main.js            # Main functionality
│   ├── cart.js            # Cart logic
│   ├── cart-drawer.js     # Cart drawer logic
│   └── admin.js           # Admin panel logic
├── img/                    # Images and assets
│   ├── logo.jpg           # Company logo
│   ├── company-background.jpg
│   ├── blog/              # Blog images
│   ├── testimonials/      # Client testimonials
│   ├── investment/        # Investment images
│   └── icons/             # Iconography
├── views/                  # HTML page templates
├── public/                 # Static assets
└── app.js                  # Backend server

🛠️ Technology Stack
Frontend

    HTML5 - Semantic markup

    CSS3 - Custom styling with CSS Variables

    JavaScript (ES6+) - Interactive features

    FontAwesome 6 - Icon library

    Responsive Design - Mobile-first approach

Backend

    Node.js - Server runtime

    Express-like custom server - Routing and API

    MongoDB - Database (via MongoDB Atlas)

    Nodemailer - Email functionality

    Environment Variables - Configuration management

Features

    Responsive Design - Works on all devices

    Shopping Cart - Full e-commerce functionality

    Investment Calculators - ROI and profit calculators

    Admin Dashboard - Full CMS for managing content

    Email System - Contact forms and notifications

    Order Tracking - Real-time order status

    Blog System - Content management

🚀 Quick Start Guide
Prerequisites

    Node.js 14+ installed

    MongoDB Atlas account (free tier)

    GitHub account for deployment

    Namecheap domain (already configured)

Local Development

    Clone the repository
    bash

git clone https://github.com/collaborativeinvestmentltd1/collaborativeinvestmentltd.git
cd collaborativeinvestmentltd

Install dependencies
bash

npm install

Set up environment variables
bash

cp .env.example .env
# Edit .env with your configuration

Start development server
bash

npm start
# Server runs at http://localhost:3000

Environment Variables

Create a .env file in the root directory:
env

# Server Configuration
PORT=3000
NODE_ENV=development
DOMAIN=localhost

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_SECURE=false

# Admin Credentials
ADMIN_EMAIL=admin@collaborativeinvestmentltd.com
ADMIN_PASSWORD=secure_password_here

# Security
SESSION_SECRET=your_session_secret_here
CORS_ORIGIN=http://localhost:3000

# SSL Configuration (for production)
SSL_KEY_PATH=path/to/ssl.key
SSL_CERT_PATH=path/to/ssl.cert

📦 Deployment
Free Hosting Options
Option 1: Netlify (Recommended)
bash

# Deploy from GitHub
1. Push code to GitHub repository
2. Connect to Netlify
3. Set build command: (empty)
4. Set publish directory: ./
5. Add custom domain from Namecheap

Option 2: Vercel
bash

# For Node.js backend
vercel --prod

Option 3: Render
bash

# For full-stack deployment
# Connect GitHub repo and deploy

Domain Configuration (Namecheap)

    At Namecheap:

        Go to Domain List → Manage

        Change Nameservers to:
        text

dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net

    At Hosting Provider:

        Add custom domain

        Enable SSL/HTTPS

        Set up redirects if needed

🛒 E-commerce Features
Product Categories

    Agriculture & Livestock - Poultry, Fish Farming, Piggery

    Construction Materials - Blocks, Cement, Building Supplies

    Solar Energy Systems - Panels, Inverters, Batteries

    Furniture & Upholstery - Custom Furniture, Office Chairs

    Machinery & Equipment - Block-making Machines, Industrial Tools

Shopping Features

    Add to cart functionality

    Cart drawer sidebar

    Order tracking system

    Email confirmations

    Admin order management

💼 Investment Models

    Asset-Backed Financing - 15-25% ROI, ₦5M minimum

    Profit-Sharing Partnerships - 20-40% ROI, ₦3M minimum

    Project-Specific Funding - 25-50% ROI, project-based

    Diaspora Special - Custom solutions for Nigerians abroad

👥 Admin Features
Admin Panel Access

    /admin/login - Admin login

    /admin/dashboard - Main dashboard

    /admin/products - Product management

    /admin/orders - Order management

    /admin/customers - Customer database

    /admin/emails - Email campaign management

Admin Capabilities

    Add/edit/delete products

    Manage orders and shipments

    View customer information

    Send email campaigns

    Monitor website analytics

    Generate reports

🔒 Security Features

    HTTPS/SSL encryption

    Admin authentication system

    Session management

    Input validation and sanitization

    XSS protection

    CSRF protection

    Rate limiting

    Secure password hashing

📱 Responsive Design

The website is fully responsive with breakpoints:

    Mobile: < 768px

    Tablet: 768px - 1024px

    Desktop: > 1024px

📈 Performance Optimization

    Image optimization and lazy loading

    CSS minification

    JavaScript bundling

    Browser caching

    CDN integration

    Database indexing

📊 Analytics Integration

    Google Analytics - Visitor tracking

    Custom Analytics - Investment performance tracking

    Email Analytics - Campaign performance

    Sales Analytics - Revenue and order tracking

🧪 Testing
Manual Testing Checklist

    All links work correctly

    Forms submit successfully

    Mobile responsiveness

    Cross-browser compatibility

    Shopping cart functionality

    Admin panel access

    Email notifications

    Performance on slow connections

Automated Tests (To implement)
bash

# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

🔄 Continuous Integration

GitHub Actions workflow example (.github/workflows/deploy.yml):
yaml

name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --dir=./ --prod

📞 Support

For support, contact:

    Email: collaborativeinvestmentltd@gmail.com

    Phone: +234 812 997 8419

    Address: 212 Ijegun Road, Ikotun, Lagos

👥 Contributors

    Development Team - Collaborative Investment Ltd

    Design - Professional business design

    Content - Industry experts and copywriters

📄 License

This project is proprietary and confidential. All rights reserved © 2025 Collaborative Investment Ltd.
🔄 Changelog
v1.0.0 (Current)

    Initial website launch

    Complete e-commerce system

    Investment management platform

    Admin dashboard

    Responsive design

    Email notification system

Upcoming Features

    Mobile app integration

    API for third-party services

    Advanced analytics dashboard

    Multi-language support

    Payment gateway integration

Note: This website is designed for professional business operations. Ensure all legal and compliance requirements are met for financial services and investment management in your jurisdiction.

=======
Collaborative Investment Ltd Website

https://img/logo.jpg
🌟 About The Project

Collaborative Investment Ltd (CIL) is a Lagos-based business development and investment management company dedicated to transforming SMEs into profitable, scalable enterprises across Nigeria. Our website serves as a digital platform for showcasing investment opportunities, managing business partnerships, and connecting with investors worldwide.
🏆 Key Features

    Multi-Sector Investment Portfolio - Agriculture, Manufacturing, Renewable Energy, Construction, Furniture

    Professional Business Management - Structured investment oversight and reporting

    Diaspora Investment Solutions - Specialized services for Nigerians abroad

    E-commerce Integration - Product sales and order management

    Investment Analytics - Performance tracking and reporting

🚀 Live Demo

🌐 Website URL: https://collaborativeinvestmentltd.com
🔐 Admin Panel: /admin/login
📁 Project Structure
text

cil-website/
├── index.html              # Home page
├── about.html              # About us page
├── services.html           # Services overview
├── shop-categories.html    # Product categories
├── investment.html         # Investment opportunities
├── contact.html            # Contact form
├── blog/                   # Blog articles
├── css/                    # Stylesheets
│   ├── style.css          # Main styles
│   ├── colors.css         # Color scheme
│   ├── cart.css           # Shopping cart styles
│   └── cart-drawer.css    # Cart drawer styles
├── js/                     # JavaScript files
│   ├── main.js            # Main functionality
│   ├── cart.js            # Cart logic
│   ├── cart-drawer.js     # Cart drawer logic
│   └── admin.js           # Admin panel logic
├── img/                    # Images and assets
│   ├── logo.jpg           # Company logo
│   ├── company-background.jpg
│   ├── blog/              # Blog images
│   ├── testimonials/      # Client testimonials
│   ├── investment/        # Investment images
│   └── icons/             # Iconography
├── views/                  # HTML page templates
├── public/                 # Static assets
└── app.js                  # Backend server

🛠️ Technology Stack
Frontend

    HTML5 - Semantic markup

    CSS3 - Custom styling with CSS Variables

    JavaScript (ES6+) - Interactive features

    FontAwesome 6 - Icon library

    Responsive Design - Mobile-first approach

Backend

    Node.js - Server runtime

    Express-like custom server - Routing and API

    MongoDB - Database (via MongoDB Atlas)

    Nodemailer - Email functionality

    Environment Variables - Configuration management

Features

    Responsive Design - Works on all devices

    Shopping Cart - Full e-commerce functionality

    Investment Calculators - ROI and profit calculators

    Admin Dashboard - Full CMS for managing content

    Email System - Contact forms and notifications

    Order Tracking - Real-time order status

    Blog System - Content management

🚀 Quick Start Guide
Prerequisites

    Node.js 14+ installed

    MongoDB Atlas account (free tier)

    GitHub account for deployment

    Namecheap domain (already configured)

Local Development

    Clone the repository
    bash

git clone https://github.com/collaborativeinvestmentltd1/collaborativeinvestmentltd.git
cd collaborativeinvestmentltd

Install dependencies
bash

npm install

Set up environment variables
bash

cp .env.example .env
# Edit .env with your configuration

Start development server
bash

npm start
# Server runs at http://localhost:3000

Environment Variables

Create a .env file in the root directory:
env

# Server Configuration
PORT=3000
NODE_ENV=development
DOMAIN=localhost

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_SECURE=false

# Admin Credentials
ADMIN_EMAIL=admin@collaborativeinvestmentltd.com
ADMIN_PASSWORD=secure_password_here

# Security
SESSION_SECRET=your_session_secret_here
CORS_ORIGIN=http://localhost:3000

# SSL Configuration (for production)
SSL_KEY_PATH=path/to/ssl.key
SSL_CERT_PATH=path/to/ssl.cert

📦 Deployment
Free Hosting Options
Option 1: Netlify (Recommended)
bash

# Deploy from GitHub
1. Push code to GitHub repository
2. Connect to Netlify
3. Set build command: (empty)
4. Set publish directory: ./
5. Add custom domain from Namecheap

Option 2: Vercel
bash

# For Node.js backend
vercel --prod

Option 3: Render
bash

# For full-stack deployment
# Connect GitHub repo and deploy

Domain Configuration (Namecheap)

    At Namecheap:

        Go to Domain List → Manage

        Change Nameservers to:
        text

dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net

    At Hosting Provider:

        Add custom domain

        Enable SSL/HTTPS

        Set up redirects if needed

🛒 E-commerce Features
Product Categories

    Agriculture & Livestock - Poultry, Fish Farming, Piggery

    Construction Materials - Blocks, Cement, Building Supplies

    Solar Energy Systems - Panels, Inverters, Batteries

    Furniture & Upholstery - Custom Furniture, Office Chairs

    Machinery & Equipment - Block-making Machines, Industrial Tools

Shopping Features

    Add to cart functionality

    Cart drawer sidebar

    Order tracking system

    Email confirmations

    Admin order management

💼 Investment Models

    Asset-Backed Financing - 15-25% ROI, ₦5M minimum

    Profit-Sharing Partnerships - 20-40% ROI, ₦3M minimum

    Project-Specific Funding - 25-50% ROI, project-based

    Diaspora Special - Custom solutions for Nigerians abroad

👥 Admin Features
Admin Panel Access

    /admin/login - Admin login

    /admin/dashboard - Main dashboard

    /admin/products - Product management

    /admin/orders - Order management

    /admin/customers - Customer database

    /admin/emails - Email campaign management

Admin Capabilities

    Add/edit/delete products

    Manage orders and shipments

    View customer information

    Send email campaigns

    Monitor website analytics

    Generate reports

🔒 Security Features

    HTTPS/SSL encryption

    Admin authentication system

    Session management

    Input validation and sanitization

    XSS protection

    CSRF protection

    Rate limiting

    Secure password hashing

📱 Responsive Design

The website is fully responsive with breakpoints:

    Mobile: < 768px

    Tablet: 768px - 1024px

    Desktop: > 1024px

📈 Performance Optimization

    Image optimization and lazy loading

    CSS minification

    JavaScript bundling

    Browser caching

    CDN integration

    Database indexing

📊 Analytics Integration

    Google Analytics - Visitor tracking

    Custom Analytics - Investment performance tracking

    Email Analytics - Campaign performance

    Sales Analytics - Revenue and order tracking

🧪 Testing
Manual Testing Checklist

    All links work correctly

    Forms submit successfully

    Mobile responsiveness

    Cross-browser compatibility

    Shopping cart functionality

    Admin panel access

    Email notifications

    Performance on slow connections

Automated Tests (To implement)
bash

# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

🔄 Continuous Integration

GitHub Actions workflow example (.github/workflows/deploy.yml):
yaml

name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --dir=./ --prod

📞 Support

For support, contact:

    Email: collaborativeinvestmentltd@gmail.com

    Phone: +234 812 997 8419

    Address: 212 Ijegun Road, Ikotun, Lagos

👥 Contributors

    Development Team - Collaborative Investment Ltd

    Design - Professional business design

    Content - Industry experts and copywriters

📄 License

This project is proprietary and confidential. All rights reserved © 2025 Collaborative Investment Ltd.
🔄 Changelog
v1.0.0 (Current)

    Initial website launch

    Complete e-commerce system

    Investment management platform

    Admin dashboard

    Responsive design

    Email notification system

Upcoming Features

    Mobile app integration

    API for third-party services

    Advanced analytics dashboard

    Multi-language support

    Payment gateway integration

Note: This website is designed for professional business operations. Ensure all legal and compliance requirements are met for financial services and investment management in your jurisdiction.

>>>>>>> e051c01554491361149ba5c6046c620a72341c42
For any issues or questions, please contact the development team at collaborativeinvestmentltd@gmail.com