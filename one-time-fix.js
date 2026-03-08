<<<<<<< HEAD
const { MongoClient } = require('mongodb');

const MONGODB_URL = 'mongodb+srv://collaborativeinvestmentltd:Collaborativeinvestmentltd@cluster0.za2h0re.mongodb.net/cil_database?retryWrites=true&w=majority';

async function fixOrderNumbers() {
    const client = new MongoClient(MONGODB_URL);
    
    try {
        await client.connect();
        const db = client.db('cil_database');
        const ordersCollection = db.collection('orders');
        
        // Get all orders
        const orders = await ordersCollection.find({}).toArray();
        
        console.log(`Found ${orders.length} orders to fix`);
        
        for (const order of orders) {
            const oldNumber = order.orderNumber;
            
            if (oldNumber && oldNumber.match(/^CIL-\d{6}-\d{3}$/)) {
                console.log(`\nFixing: ${oldNumber}`);
                
                const parts = oldNumber.split('-');
                const timestamp = parts[1];
                const random = parts[2];
                const currentYear = new Date().getFullYear();
                
                const newNumber = `CIL-${currentYear}-${timestamp}`;
                
                // Add alternativeOrderNumbers field
                await ordersCollection.updateOne(
                    { _id: order._id },
                    { 
                        $set: { 
                            alternativeOrderNumbers: [
                                oldNumber,
                                newNumber,
                                timestamp,
                                `CIL-${timestamp}`,
                                `${timestamp}-${random}`
                            ]
                        } 
                    }
                );
                
                console.log(`  ✓ Added alternative formats for ${oldNumber}`);
                console.log(`    1. ${oldNumber} (original)`);
                console.log(`    2. ${newNumber} (new format)`);
                console.log(`    3. ${timestamp} (numeric only)`);
                console.log(`    4. CIL-${timestamp} (simple format)`);
                console.log(`    5. ${timestamp}-${random} (without CIL)`);
            }
        }
        
        console.log('\n=== All Done! ===');
        console.log('Now orders can be tracked using any of these formats:');
        console.log('1. CIL-367193-944 (original)');
        console.log('2. CIL-2025-367193 (new format)');
        console.log('3. 367193 (just the number)');
        console.log('4. CIL-367193 (simple format)');
        console.log('5. 367193-944 (without CIL)');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

=======
const { MongoClient } = require('mongodb');

const MONGODB_URL = 'mongodb+srv://collaborativeinvestmentltd:Collaborativeinvestmentltd@cluster0.za2h0re.mongodb.net/cil_database?retryWrites=true&w=majority';

async function fixOrderNumbers() {
    const client = new MongoClient(MONGODB_URL);
    
    try {
        await client.connect();
        const db = client.db('cil_database');
        const ordersCollection = db.collection('orders');
        
        // Get all orders
        const orders = await ordersCollection.find({}).toArray();
        
        console.log(`Found ${orders.length} orders to fix`);
        
        for (const order of orders) {
            const oldNumber = order.orderNumber;
            
            if (oldNumber && oldNumber.match(/^CIL-\d{6}-\d{3}$/)) {
                console.log(`\nFixing: ${oldNumber}`);
                
                const parts = oldNumber.split('-');
                const timestamp = parts[1];
                const random = parts[2];
                const currentYear = new Date().getFullYear();
                
                const newNumber = `CIL-${currentYear}-${timestamp}`;
                
                // Add alternativeOrderNumbers field
                await ordersCollection.updateOne(
                    { _id: order._id },
                    { 
                        $set: { 
                            alternativeOrderNumbers: [
                                oldNumber,
                                newNumber,
                                timestamp,
                                `CIL-${timestamp}`,
                                `${timestamp}-${random}`
                            ]
                        } 
                    }
                );
                
                console.log(`  ✓ Added alternative formats for ${oldNumber}`);
                console.log(`    1. ${oldNumber} (original)`);
                console.log(`    2. ${newNumber} (new format)`);
                console.log(`    3. ${timestamp} (numeric only)`);
                console.log(`    4. CIL-${timestamp} (simple format)`);
                console.log(`    5. ${timestamp}-${random} (without CIL)`);
            }
        }
        
        console.log('\n=== All Done! ===');
        console.log('Now orders can be tracked using any of these formats:');
        console.log('1. CIL-367193-944 (original)');
        console.log('2. CIL-2025-367193 (new format)');
        console.log('3. 367193 (just the number)');
        console.log('4. CIL-367193 (simple format)');
        console.log('5. 367193-944 (without CIL)');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

>>>>>>> e051c01554491361149ba5c6046c620a72341c42
fixOrderNumbers();