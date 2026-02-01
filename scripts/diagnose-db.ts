import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function diagnose() {
    console.log('Testing connection to MongoDB Atlas (Direct String)...');
    const directUrl = "mongodb://satoheed1_db_user:dUa3qgTxcrGSGcoR@ac-cwuo72r-shard-00-00.ljc5k6j.mongodb.net:27017,ac-cwuo72r-shard-00-01.ljc5k6j.mongodb.net:27017,ac-cwuo72r-shard-00-02.ljc5k6j.mongodb.net:27017/sports_platform?ssl=true&replicaSet=atlas-oa84yi-shard-0&authSource=admin";

    const testPrisma = new PrismaClient({
        datasources: {
            db: {
                url: directUrl
            }
        }
    });

    try {
        const start = Date.now();
        await testPrisma.$connect();
        console.log(`Connection established in ${Date.now() - start}ms`);

        const count = await prisma.adminUser.count();
        console.log(`Success! Found ${count} admin user(s) in the database.`);
    } catch (error: any) {
        console.error('\n--- CONNECTION ERROR ---');
        console.error(`Error Code: ${error.code}`);
        console.error(`Message: ${error.message}`);

        if (error.message.includes('Server selection timeout')) {
            console.log('\nDIAGNOSIS: IP Whitelist or Network Block');
            console.log('1. Go to MongoDB Atlas > Network Access.');
            console.log('2. Ensure your current IP is whitelisted (or use 0.0.0.0/0 for testing).');
            console.log('3. Ensure your firewall allows outgoing traffic on port 27017.');
        }
    } finally {
        await testPrisma.$disconnect();
        await prisma.$disconnect();
    }
}

diagnose();
