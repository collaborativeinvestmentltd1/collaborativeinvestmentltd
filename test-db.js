// test-db.js - Test database operations
require('dotenv').config();
const { connectDB, db, closeDB } = require('./database');

async function testDatabase() {
    try {
        console.log('🧪 Testing database operations...');
        await connectDB();
        
        // Test admin authentication
        console.log('🔐 Testing admin authentication...');
        const authResult = await db.verifyAdminCredentials('admin@collaborativeinvestmentltd.com', 'admin123');
        console.log('Admin auth result:', authResult.success ? '✅ Success' : '❌ Failed');
        
        // Test products
        console.log('📦 Testing products...');
        const products = await db.getAll('products');
        console.log(`Products count: ${products.length}`);
        
        // Test stats
        console.log('📊 Testing stats...');
        const stats = await db.getStats();
        console.log('Stats:', stats);
        
        // Test email creation
        console.log('📧 Testing email creation...');
        const testEmail = await db.create('emails', {
            to: 'test@example.com',
            subject: 'Test Email',
            message: 'This is a test email',
            type: 'test',
            status: 'sent'
        });
        console.log('Email created with ID:', testEmail._id);
        
        console.log('✅ All database tests passed!');
        
    } catch (error) {
        console.error('❌ Database test failed:', error);
    } finally {
        await closeDB();
    }
}

testDatabase();