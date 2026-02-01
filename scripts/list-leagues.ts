import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listLeagues() {
    const leagues = await prisma.league.findMany({
        select: { id: true, name: true, apiSportsId: true }
    });
    console.log('--- Available Leagues ---');
    console.log(JSON.stringify(leagues, null, 2));
    await prisma.$disconnect();
}

listLeagues();
