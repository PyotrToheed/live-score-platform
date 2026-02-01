const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;

async function testNative() {
    console.log('Testing connection with native MongoDB driver...');
    console.log('URI:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
    });

    try {
        const start = Date.now();
        await client.connect();
        console.log(`Native connection successful in ${Date.now() - start}ms!`);

        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log('Collections found:', collections.map(c => c.name));

    } catch (err) {
        console.error('\n--- NATIVE CONNECTION ERROR ---');
        console.error(err);

        if (err.message.includes('timed out')) {
            console.log('\nDIAGNOSIS: Port 27017 is still blocked or unreachable.');
        }
    } finally {
        await client.close();
    }
}

testNative();
