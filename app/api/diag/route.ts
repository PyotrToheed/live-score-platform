import { NextResponse } from 'next/server';
import { apiSports } from '@/lib/sports-api';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnostics: any = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        connectivity: {
            database: 'Unknown',
            apiSports: 'Unknown'
        },
        services: {
            apiSportsKeyPresent: !!process.env.API_SPORTS_KEY,
            sportsApiUrl: process.env.FOOTBALL_API_URL || 'Not Set'
        }
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        diagnostics.connectivity.database = 'Connected';
    } catch (e: any) {
        diagnostics.connectivity.database = `Error: ${e.message}`;
    }

    try {
        const status = await apiSports.getLiveScores({ live: 'all' });
        diagnostics.connectivity.apiSports = status ? `Active (${status.length} matches found)` : 'No matches returned';
    } catch (e: any) {
        diagnostics.connectivity.apiSports = `Error: ${e.message}`;
    }

    return NextResponse.json(diagnostics);
}
