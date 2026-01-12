import { NextRequest, NextResponse } from 'next/server';
import { oddsApi, getAllSoccerKeys, Score } from '@/lib/odds-api';

export const dynamic = 'force-dynamic';
export const revalidate = 30; // Revalidate every 30 seconds

export async function GET(request: NextRequest) {
    try {
        // Fetch scores for EPL as primary, with fallback to other leagues
        const sportsToCheck = ['soccer_epl', 'soccer_spain_la_liga', 'soccer_germany_bundesliga'];

        let allScores: Score[] = [];

        for (const sport of sportsToCheck) {
            try {
                const response = await oddsApi.getScores(sport, 1);
                allScores = [...allScores, ...response.data];
            } catch (err) {
                console.warn(`Failed to fetch scores for ${sport}:`, err);
            }
        }

        // Filter to only live games (not completed, has scores)
        const liveGames = allScores.filter(game => !game.completed && game.scores !== null);

        // Sort by commence time
        liveGames.sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());

        return NextResponse.json({
            success: true,
            data: liveGames.slice(0, 10), // Return top 10 live games
            total: liveGames.length,
        });
    } catch (error: any) {
        console.error('Live scores API error:', error);

        if (error.message === 'API_RATE_LIMIT_EXCEEDED') {
            return NextResponse.json(
                { success: false, error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to fetch live scores' },
            { status: 500 }
        );
    }
}
