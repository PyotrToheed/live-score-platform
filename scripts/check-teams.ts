import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkTeams() {
    const matches = await prisma.match.findMany({
        select: { homeTeam: true, awayTeam: true, date: true }
    });
    console.log('--- Teams in Database ---');
    console.log(JSON.stringify(matches, null, 2));
    await prisma.$disconnect();
}

checkTeams();
