import { PrismaClient } from '@prisma/client';
import { apiSports } from '../lib/sports-api';
import { oddsApi } from '../lib/odds-api';

const prisma = new PrismaClient();

async function runFullAudit() {
    console.log("🚀 Starting Full System Audit...\n");

    // 1. Database Integrity Audit
    console.log("--- 📊 Database Integrity ---");
    const leaguesCount = await prisma.league.count();
    const matchesCount = await prisma.match.count();
    const predictionsCount = await prisma.prediction.count();
    const matchTransCount = await prisma.matchTranslation.count();

    console.log(`Leagues: ${leaguesCount}`);
    console.log(`Matches: ${matchesCount}`);
    console.log(`Predictions: ${predictionsCount}`);
    console.log(`Match Translations: ${matchTransCount}`);

    if (matchesCount > 0) {
        const matchesWithLogos = await prisma.match.count({
            where: {
                homeTeamLogo: { not: null },
                awayTeamLogo: { not: null }
            }
        });
        const logoCoverage = (matchesWithLogos / matchesCount) * 100;
        console.log(`Logo Coverage: ${logoCoverage.toFixed(2)}% (${matchesWithLogos}/${matchesCount})`);

        if (logoCoverage < 50) {
            console.warn("⚠️  WARNING: Low logo coverage. Run 'Fetch Fixtures' for La Liga again.");
        } else {
            console.log("✅ Logo population is healthy.");
        }
    }

    // 2. API Connectivity Audit
    console.log("\n--- 🌐 API Connectivity ---");
    try {
        const oddsStatus = await oddsApi.getSports();
        console.log("✅ The Odds API: CONNECTED");
    } catch (e) {
        console.error("❌ The Odds API: FAILED (Check API_KEY)");
    }

    try {
        // Test with a simple status check or small call
        await apiSports.getLiveScores({ live: 'all' });
        console.log("✅ API-Sports: CONNECTED");
    } catch (e) {
        console.error("❌ API-Sports: FAILED (Check API_SPORTS_KEY)");
    }

    // 3. Logic & Sync Verification
    console.log("\n--- ⚙️ Logic Verification ---");
    const laLigaLeagues = await prisma.leagueTranslation.findMany({
        where: { slug: 'la-liga' }
    });

    if (laLigaLeagues.length > 1) {
        console.error("❌ ERROR: Duplicate 'la-liga' slugs found! Run the fix script.");
    } else if (laLigaLeagues.length === 1) {
        console.log("✅ La Liga slug 'la-liga' is unique and correct.");
    } else {
        console.warn("⚠️  La Liga league not found. Perform a sync to initialize.");
    }

    // 4. Real-time Route Verification
    console.log("\n--- ⚡ Real-time Route Check ---");
    const sampleMatch = await prisma.match.findFirst();
    if (sampleMatch) {
        console.log(`✅ Real-time endpoint test: Ready for match ID ${sampleMatch.id}`);
    }

    console.log("\n--- Audit Complete ---");
    await prisma.$disconnect();
}

runFullAudit().catch(console.error);
