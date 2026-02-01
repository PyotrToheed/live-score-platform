import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debugLeagueData() {
    console.log("--- League Audit ---");
    const leagues = await prisma.league.findMany({
        include: {
            translations: true,
            _count: { select: { matches: true } }
        }
    });

    leagues.forEach(l => {
        console.log(`League ID: ${l.id} | Country: ${l.country} | Matches: ${l._count.matches}`);
        l.translations.forEach(t => {
            console.log(`  - [${t.languageCode}] Name: ${t.name} | Slug: ${t.slug}`);
        });
    });

    console.log("\n--- Match Audit (La Liga) ---");
    // Find the league that has matches
    const laLiga = leagues.find(l => l.translations.some(t => t.slug.includes('la-liga')));
    if (laLiga) {
        const matches = await prisma.match.findMany({
            where: { leagueId: laLiga.id },
            include: { translations: true },
            take: 5
        });
        console.log(`Matches found for ${laLiga.id}: ${matches.length}`);
        matches.forEach(m => {
            console.log(`- ${m.homeTeam} vs ${m.awayTeam} | Date: ${m.date.toISOString()} | Logos: ${m.homeTeamLogo ? '✅' : '❌'}`);
            console.log(`  Translations: ${m.translations.map(t => t.languageCode).join(', ')}`);
        });
    } else {
        console.log("No league found with slug containing 'la-liga'");
    }

    await prisma.$disconnect();
}

debugLeagueData();
