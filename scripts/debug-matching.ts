import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debugMatch() {
    const homeNameAPI = "Espanyol";
    const awayNameAPI = "Alaves";

    console.log(`Searching for: "${homeNameAPI}" vs "${awayNameAPI}"`);

    const dbMatches = await prisma.match.findMany({
        where: {
            status: { in: ['SCHEDULED', 'LIVE'] }
        }
    });

    console.log(`Total DB Matches: ${dbMatches.length}`);

    for (const m of dbMatches) {
        const hMatch = (m.homeTeam.toLowerCase().includes(homeNameAPI.toLowerCase()) || homeNameAPI.toLowerCase().includes(m.homeTeam.toLowerCase()));
        const aMatch = (m.awayTeam.toLowerCase().includes(awayNameAPI.toLowerCase()) || awayNameAPI.toLowerCase().includes(m.awayTeam.toLowerCase()));

        if (m.homeTeam.toLowerCase().includes("espanyol") || m.awayTeam.toLowerCase().includes("alaves")) {
            console.log(`Found candidate in DB: "${m.homeTeam}" vs "${m.awayTeam}"`);
            console.log(`- Home Match? ${hMatch}`);
            console.log(`- Away Match? ${aMatch}`);
            console.log(`- CharCodes Home DB: ${m.homeTeam.split('').map(c => c.charCodeAt(0)).join(',')}`);
            console.log(`- CharCodes Home API: ${homeNameAPI.split('').map(c => c.charCodeAt(0)).join(',')}`);
        }
    }

    await prisma.$disconnect();
}

debugMatch();
