const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://collaborativeinvestmentltd:090909090@ciladmin.dqdm0as.mongodb.net/?appName=Ciladmin';

console.log('Testing connection to MongoDB Atlas...');

const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log('✅ Connected successfully to MongoDB Atlas!');
        const db = client.db('cil_database');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    } finally {
        await client.close();
    }
}

run();