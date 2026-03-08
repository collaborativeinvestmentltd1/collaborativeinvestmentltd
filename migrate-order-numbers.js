<<<<<<< HEAD
const { connectDB, db, closeDB } = require('./database');
const { ObjectId } = require('mongodb');

async function migrateOrderNumbers() {
    try {
        await connectDB();
        
        // Get all orders
        const orders = await db.getAll('orders', {});
        
        console.log(`Found ${orders.length} orders to migrate`);
        
        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        for (const order of orders) {
            try {
                const oldNumber = order.orderNumber;
                
                // Check if order number needs migration
                if (oldNumber && oldNumber.match(/^CIL-\d{6}-\d{3}$/)) {
                    const parts = oldNumber.split('-');
                    const timestamp = parts[1];
                    const random = parts[2];
                    const currentYear = new Date().getFullYear();
                    
                    // Create new format: CIL-YYYY-TIMESTAMP
                    const newNumber = `CIL-${currentYear}-${timestamp}`;
                    
                    // Debug: Show what we're working with
                    console.log(`Processing order ID: ${order._id} (type: ${typeof order._id})`);
                    console.log(`  Old: ${oldNumber} -> New: ${newNumber}`);
                    
                    // Update order in database - try different approaches
                    let updateResult;
                    
                    // Approach 1: Try with ObjectId if it looks like one
                    if (typeof order._id === 'string' && /^[0-9a-fA-F]{24}$/.test(order._id)) {
                        console.log(`  Using ObjectId approach`);
                        updateResult = await db.update('orders', { _id: new ObjectId(order._id) }, { 
                            orderNumber: newNumber,
                            originalOrderNumber: oldNumber // Keep original for reference
                        });
                    } 
                    // Approach 2: Try with string ID
                    else {
                        console.log(`  Using string ID approach`);
                        updateResult = await db.update('orders', { _id: order._id }, { 
                            orderNumber: newNumber,
                            originalOrderNumber: oldNumber
                        });
                    }
                    
                    if (updateResult) {
                        migratedCount++;
                        console.log(`  ✓ Migrated: ${oldNumber} -> ${newNumber}`);
                    } else {
                        console.log(`  ✗ No update performed for ${oldNumber}`);
                        skippedCount++;
                    }
                } else {
                    console.log(`  - Skipping ${oldNumber} (doesn't match migration pattern)`);
                    skippedCount++;
                }
            } catch (err) {
                errorCount++;
                console.error(`  ✗ Error processing order ${order._id}:`, err.message);
            }
        }
        
        console.log('\n=== Migration Summary ===');
        console.log(`Total orders: ${orders.length}`);
        console.log(`Successfully migrated: ${migratedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log('========================\n');
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await closeDB();
    }
}

// Alternative: Create a diagnostic script first
async function diagnoseOrders() {
    try {
        await connectDB();
        
        const orders = await db.getAll('orders', {});
        
        console.log('\n=== Order Database Diagnosis ===');
        console.log(`Total orders: ${orders.length}`);
        console.log('\nSample of first 3 orders:');
        
        for (let i = 0; i < Math.min(3, orders.length); i++) {
            const order = orders[i];
            console.log(`\nOrder ${i + 1}:`);
            console.log(`  _id: ${order._id} (type: ${typeof order._id})`);
            console.log(`  orderNumber: ${order.orderNumber}`);
            console.log(`  customerName: ${order.customerName}`);
            console.log(`  createdAt: ${order.createdAt}`);
        }
        
        // Check for specific order format
        console.log('\n=== Checking for CIL-367193-944 format ===');
        const targetOrder = orders.find(o => o.orderNumber && o.orderNumber.includes('367193'));
        if (targetOrder) {
            console.log(`Found order with 367193:`, {
                _id: targetOrder._id,
                orderNumber: targetOrder.orderNumber,
                customerName: targetOrder.customerName
            });
        } else {
            console.log('No order found with 367193 in order number');
        }
        
        console.log('\n=== All order numbers ===');
        orders.forEach((o, i) => {
            console.log(`${i + 1}. ${o.orderNumber}`);
        });
        
    } catch (error) {
        console.error('Diagnosis error:', error);
    } finally {
        await closeDB();
    }
}

// Run diagnosis first, then migration
async function runMigration() {
    console.log('Running database diagnosis first...');
    await diagnoseOrders();
    
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    readline.question('\nDo you want to proceed with migration? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            console.log('\nStarting migration...');
            await migrateOrderNumbers();
        } else {
            console.log('Migration cancelled.');
        }
        readline.close();
        process.exit(0);
    });
}

// Check if we should run diagnosis only
if (process.argv.includes('--diagnose')) {
    diagnoseOrders();
} else if (process.argv.includes('--migrate')) {
    migrateOrderNumbers();
} else {
    runMigration();
=======
const { connectDB, db, closeDB } = require('./database');
const { ObjectId } = require('mongodb');

async function migrateOrderNumbers() {
    try {
        await connectDB();
        
        // Get all orders
        const orders = await db.getAll('orders', {});
        
        console.log(`Found ${orders.length} orders to migrate`);
        
        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        for (const order of orders) {
            try {
                const oldNumber = order.orderNumber;
                
                // Check if order number needs migration
                if (oldNumber && oldNumber.match(/^CIL-\d{6}-\d{3}$/)) {
                    const parts = oldNumber.split('-');
                    const timestamp = parts[1];
                    const random = parts[2];
                    const currentYear = new Date().getFullYear();
                    
                    // Create new format: CIL-YYYY-TIMESTAMP
                    const newNumber = `CIL-${currentYear}-${timestamp}`;
                    
                    // Debug: Show what we're working with
                    console.log(`Processing order ID: ${order._id} (type: ${typeof order._id})`);
                    console.log(`  Old: ${oldNumber} -> New: ${newNumber}`);
                    
                    // Update order in database - try different approaches
                    let updateResult;
                    
                    // Approach 1: Try with ObjectId if it looks like one
                    if (typeof order._id === 'string' && /^[0-9a-fA-F]{24}$/.test(order._id)) {
                        console.log(`  Using ObjectId approach`);
                        updateResult = await db.update('orders', { _id: new ObjectId(order._id) }, { 
                            orderNumber: newNumber,
                            originalOrderNumber: oldNumber // Keep original for reference
                        });
                    } 
                    // Approach 2: Try with string ID
                    else {
                        console.log(`  Using string ID approach`);
                        updateResult = await db.update('orders', { _id: order._id }, { 
                            orderNumber: newNumber,
                            originalOrderNumber: oldNumber
                        });
                    }
                    
                    if (updateResult) {
                        migratedCount++;
                        console.log(`  ✓ Migrated: ${oldNumber} -> ${newNumber}`);
                    } else {
                        console.log(`  ✗ No update performed for ${oldNumber}`);
                        skippedCount++;
                    }
                } else {
                    console.log(`  - Skipping ${oldNumber} (doesn't match migration pattern)`);
                    skippedCount++;
                }
            } catch (err) {
                errorCount++;
                console.error(`  ✗ Error processing order ${order._id}:`, err.message);
            }
        }
        
        console.log('\n=== Migration Summary ===');
        console.log(`Total orders: ${orders.length}`);
        console.log(`Successfully migrated: ${migratedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log('========================\n');
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await closeDB();
    }
}

// Alternative: Create a diagnostic script first
async function diagnoseOrders() {
    try {
        await connectDB();
        
        const orders = await db.getAll('orders', {});
        
        console.log('\n=== Order Database Diagnosis ===');
        console.log(`Total orders: ${orders.length}`);
        console.log('\nSample of first 3 orders:');
        
        for (let i = 0; i < Math.min(3, orders.length); i++) {
            const order = orders[i];
            console.log(`\nOrder ${i + 1}:`);
            console.log(`  _id: ${order._id} (type: ${typeof order._id})`);
            console.log(`  orderNumber: ${order.orderNumber}`);
            console.log(`  customerName: ${order.customerName}`);
            console.log(`  createdAt: ${order.createdAt}`);
        }
        
        // Check for specific order format
        console.log('\n=== Checking for CIL-367193-944 format ===');
        const targetOrder = orders.find(o => o.orderNumber && o.orderNumber.includes('367193'));
        if (targetOrder) {
            console.log(`Found order with 367193:`, {
                _id: targetOrder._id,
                orderNumber: targetOrder.orderNumber,
                customerName: targetOrder.customerName
            });
        } else {
            console.log('No order found with 367193 in order number');
        }
        
        console.log('\n=== All order numbers ===');
        orders.forEach((o, i) => {
            console.log(`${i + 1}. ${o.orderNumber}`);
        });
        
    } catch (error) {
        console.error('Diagnosis error:', error);
    } finally {
        await closeDB();
    }
}

// Run diagnosis first, then migration
async function runMigration() {
    console.log('Running database diagnosis first...');
    await diagnoseOrders();
    
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    readline.question('\nDo you want to proceed with migration? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            console.log('\nStarting migration...');
            await migrateOrderNumbers();
        } else {
            console.log('Migration cancelled.');
        }
        readline.close();
        process.exit(0);
    });
}

// Check if we should run diagnosis only
if (process.argv.includes('--diagnose')) {
    diagnoseOrders();
} else if (process.argv.includes('--migrate')) {
    migrateOrderNumbers();
} else {
    runMigration();
>>>>>>> e051c01554491361149ba5c6046c620a72341c42
}