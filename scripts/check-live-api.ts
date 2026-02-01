import { apiSports } from './lib/sports-api';
import dotenv from 'dotenv';
dotenv.config();

async function checkLive() {
    try {
        const live = await apiSports.getLiveScores();
        console.log(`Found ${live.length} live matches on API-Sports`);
        if (live.length > 0) {
            console.log('Sample Live Fixture:');
            console.log(JSON.stringify({
                home: live[0].teams.home.name,
                away: live[0].teams.away.name,
                league: live[0].league.name,
                status: live[0].fixture.status.short
            }, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

checkLive();
