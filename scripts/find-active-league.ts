import { apiSports } from './lib/sports-api';
import dotenv from 'dotenv';
dotenv.config();

async function findActiveLeague() {
    const today = new Date().toISOString().split('T')[0];
    const leagues = [
        { name: 'Premier League', id: 39 },
        { name: 'La Liga', id: 140 },
        { name: 'Bundesliga', id: 78 },
        { name: 'Serie A', id: 135 },
        { name: 'Ligue 1', id: 61 }
    ];

    console.log(`Checking fixtures for ${today}...`);
    for (const league of leagues) {
        try {
            const fixtures = await apiSports.getLiveScores({ league: league.id.toString(), date: today });
            console.log(`${league.name}: ${fixtures.length} matches today.`);
        } catch (e) {
            console.log(`${league.name}: Error.`);
        }
    }
}

findActiveLeague();
