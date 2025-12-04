// scripts/setup-ssl.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const logger = require('../utils/logger');

async function setupSSL() {
    const sslDir = path.join(__dirname, '../ssl');
    
    // Create SSL directory
    if (!fs.existsSync(sslDir)) {
        fs.mkdirSync(sslDir, { recursive: true });
    }
    
    // For production, you would use Let's Encrypt or purchased certificates
    // For development, we can generate self-signed certificates
    
    if (process.env.NODE_ENV === 'development') {
        await generateSelfSignedCert();
    } else {
        logger.info('SSL certificates should be placed in:', sslDir);
        logger.info('Expected files:');
        logger.info('- private.key');
        logger.info('- certificate.crt');
        logger.info('- ca_bundle.crt (optional)');
    }
}

async function generateSelfSignedCert() {
    const sslDir = path.join(__dirname, '../ssl');
    const keyPath = path.join(sslDir, 'private.key');
    const certPath = path.join(sslDir, 'certificate.crt');
    
    // Check if certificates already exist
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        logger.info('Self-signed certificates already exist');
        return;
    }
    
    logger.info('Generating self-signed SSL certificates for development...');
    
    const command = `openssl req -x509 -newkey rsa:4096 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=NG/ST=Lagos/L=Lagos/O=CIL/CN=localhost"`;
    
    try {
        await execPromise(command);
        logger.info('✅ Self-signed certificates generated successfully');
        
        // Update .env file with SSL paths
        updateEnvFile();
    } catch (error) {
        logger.error('❌ Failed to generate SSL certificates:', error.message);
    }
}

function updateEnvFile() {
    const envPath = path.join(__dirname, '../.env');
    const envContent = `
# SSL Configuration
SSL_KEY_PATH=./ssl/private.key
SSL_CERT_PATH=./ssl/certificate.crt
SSL_CA_PATH=./ssl/ca_bundle.crt
`;
    
    try {
        if (fs.existsSync(envPath)) {
            let content = fs.readFileSync(envPath, 'utf8');
            
            // Remove existing SSL configuration
            content = content.replace(/SSL_KEY_PATH=.*\n/g, '');
            content = content.replace(/SSL_CERT_PATH=.*\n/g, '');
            content = content.replace(/SSL_CA_PATH=.*\n/g, '');
            
            // Add new SSL configuration
            content += envContent;
            
            fs.writeFileSync(envPath, content);
        } else {
            fs.writeFileSync(envPath, envContent);
        }
        
        logger.info('✅ .env file updated with SSL configuration');
    } catch (error) {
        logger.error('❌ Failed to update .env file:', error.message);
    }
}

// Run setup
setupSSL().catch(console.error);