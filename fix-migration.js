const { connectDB, db, closeDB } = require('./database');

async function fixMigration() {
    try {
        await connectDB();
        
        // Get all orders
        const orders = await db.getAll('orders', {});
        
        console.log(`Found ${orders.length} orders`);
        
        for (const order of orders) {
            const oldNumber = order.orderNumber;
            
            // Handle the new format CIL-367193-944
            if (oldNumber && oldNumber.match(/^CIL-\d{6}-\d{3}$/)) {
                console.log(`\nProcessing: ${oldNumber}`);
                
                const parts = oldNumber.split('-');
                const timestamp = parts[1]; // 367193
                const random = parts[2]; // 944
                const currentYear = new Date().getFullYear();
                
                const newNumber = `CIL-${currentYear}-${timestamp}`;
                
                console.log(`  Creating alternative formats for: ${oldNumber}`);
                
                // Update the order with alternative number formats
                const updateResult = await db.update('orders', 
                    { orderNumber: oldNumber }, // Find by current order number
                    { 
                        orderNumber: oldNumber, // Keep original
                        alternativeOrderNumbers: [
                            oldNumber, // Original: CIL-367193-944
                            newNumber, // New format: CIL-2025-367193
                            timestamp, // Just the number: 367193
                            `CIL-${timestamp}`, // CIL-367193
                            `${timestamp}-${random}` // 367193-944
                        ]
                    }
                );
                
                if (updateResult) {
                    console.log(`  ✓ Added alternative formats for ${oldNumber}`);
                } else {
                    console.log(`  ✗ Failed to update ${oldNumber}`);
                }
            }
        }
        
        console.log('\n=== Migration Complete ===');
        
        // Verify the updates
        console.log('\n=== Verifying Updates ===');
        const updatedOrders = await db.getAll('orders', {});
        for (const order of updatedOrders) {
            if (order.alternativeOrderNumbers) {
                console.log(`\n${order.orderNumber}:`);
                console.log(`  Alternative formats: ${order.alternativeOrderNumbers.join(', ')}`);
            }
        }
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await closeDB();
    }
}

fixMigration();