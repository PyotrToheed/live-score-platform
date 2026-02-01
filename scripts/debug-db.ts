import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkMatches() {
    const matches = await prisma.match.findMany({
        take: 5,
        orderBy: { date: 'desc' }
    });
    console.log('--- matches in DB ---');
    console.log(JSON.stringify(matches, null, 2));
    await prisma.$disconnect();
}

checkMatches();
