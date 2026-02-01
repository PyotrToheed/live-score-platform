import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixSlugs() {
    console.log("--- Fixing League Slugs ---");

    // 1. Find the "Old" Stale League (slug 'la-liga' or similar)
    // We assume the one with FEW matches is the old one.
    const oldLeagueTrans = await prisma.leagueTranslation.findFirst({
        where: { slug: 'la-liga' },
        include: { league: true }
    });

    if (oldLeagueTrans) {
        console.log(`Found old league: ${oldLeagueTrans.leagueId} (Slug: la-liga)`);

        // Delete related data first
        const matchesToDelete = await prisma.match.findMany({
            where: { leagueId: oldLeagueTrans.leagueId },
            select: { id: true }
        });
        const matchIds = matchesToDelete.map(m => m.id);

        if (matchIds.length > 0) {
            await prisma.prediction.deleteMany({
                where: { matchId: { in: matchIds } }
            });
            await prisma.matchTranslation.deleteMany({
                where: { matchId: { in: matchIds } }
            });

            // Now delete matches
            const deleteMatches = await prisma.match.deleteMany({
                where: { id: { in: matchIds } }
            });
            console.log(`Deleted ${deleteMatches.count} stale matches.`);
        }

        // Delete translations
        await prisma.leagueTranslation.deleteMany({
            where: { leagueId: oldLeagueTrans.leagueId }
        });

        // Delete league
        await prisma.league.delete({
            where: { id: oldLeagueTrans.leagueId }
        });
        console.log("Deleted old league.");
    }

    // 2. Find the "New" Synced League (slug 'spain_la_liga-en')
    const newLeagueTrans = await prisma.leagueTranslation.findFirst({
        where: { slug: 'spain_la_liga-en' },
        include: { league: true }
    });

    if (newLeagueTrans) {
        console.log(`Found new league: ${newLeagueTrans.leagueId} (Slug: spain_la_liga-en)`);

        // Rename slug to 'la-liga'
        await prisma.leagueTranslation.update({
            where: { id: newLeagueTrans.id },
            data: { slug: 'la-liga' }
        });
        console.log("Updated slug to 'la-liga'.");
    } else {
        console.log("Could not find new league with slug 'spain_la_liga-en'.");
    }

    await prisma.$disconnect();
}

fixSlugs();
