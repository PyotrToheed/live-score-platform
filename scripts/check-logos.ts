import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkLogos() {
    console.log("Checking for matches with logos...");
    const matches = await prisma.match.findMany({
        select: {
            id: true,
            homeTeam: true,
            homeTeamLogo: true,
            awayTeam: true,
            awayTeamLogo: true,
            date: true
        },
        take: 20,
        orderBy: { date: 'desc' }
    });

    console.log(`Found ${matches.length} recent matches:`);
    matches.forEach(m => {
        console.log(`- ${m.homeTeam} (${m.homeTeamLogo ? 'LOGO ✅' : 'NO LOGO ❌'}) vs ${m.awayTeam} (${m.awayTeamLogo ? 'LOGO ✅' : 'NO LOGO ❌'}) - ${m.date.toISOString()}`);
    });

    await prisma.$disconnect();
}

checkLogos();
