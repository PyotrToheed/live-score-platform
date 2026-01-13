"use server";

import prisma from "@/lib/db";
import { oddsApi, SOCCER_SPORTS, Event, OddsEvent } from "@/lib/odds-api";
import { revalidatePath } from "next/cache";

interface SyncResult {
    success: boolean;
    created: number;
    updated: number;
    errors: string[];
}

/**
 * Sync fixtures from The Odds API for a specific sport
 */
export async function syncFixtures(sportKey: string = SOCCER_SPORTS.EPL): Promise<SyncResult> {
    const result: SyncResult = {
        success: false,
        created: 0,
        updated: 0,
        errors: [],
    };

    try {
        // Get all languages for translations
        const languages = await prisma.language.findMany();

        // Get league for this sport (or create placeholder)
        let league = await prisma.league.findFirst({
            where: {
                translations: {
                    some: {
                        slug: { contains: sportKey.replace('soccer_', '') }
                    }
                }
            }
        });

        if (!league) {
            // Create a placeholder league
            league = await prisma.league.create({
                data: {
                    country: getSportCountry(sportKey, 'en'),
                    logoUrl: getSportLogo(sportKey),
                    translations: {
                        create: languages.map(lang => ({
                            language: { connect: { code: lang.code } },
                            name: getSportTitle(sportKey, lang.code),
                            slug: `${sportKey.replace('soccer_', '')}-${lang.code}`,
                            description: `Fixtures and predictions for ${getSportTitle(sportKey, lang.code)}`,
                            seo: {
                                create: {
                                    title: getSportTitle(sportKey, lang.code),
                                    description: `Live scores and predictions for ${getSportTitle(sportKey, lang.code)}`,
                                }
                            }
                        }))
                    }
                }
            });
        }

        // Fetch events from API
        const eventsResponse = await oddsApi.getEvents(sportKey);
        const events = eventsResponse.data;

        // Fetch odds for these events
        let oddsData: OddsEvent[] = [];
        try {
            const oddsResponse = await oddsApi.getOdds(sportKey, {
                regions: 'eu',
                markets: 'h2h',
            });
            oddsData = oddsResponse.data;
        } catch (err) {
            result.errors.push('Could not fetch odds data');
        }

        // Process each event
        for (const event of events) {
            try {
                // Check if match already exists (by API ID stored in a field)
                const existingMatch = await prisma.match.findFirst({
                    where: {
                        homeTeam: event.home_team,
                        awayTeam: event.away_team,
                        date: {
                            gte: new Date(new Date(event.commence_time).getTime() - 3600000), // within 1 hour
                            lte: new Date(new Date(event.commence_time).getTime() + 3600000),
                        }
                    }
                });

                // Get odds for this event
                const eventOdds = oddsData.find(o => o.id === event.id);
                const h2hOdds = extractH2HOdds(eventOdds);

                if (existingMatch) {
                    // Update existing match with latest odds
                    if (h2hOdds) {
                        await prisma.prediction.upsert({
                            where: { matchId: existingMatch.id },
                            update: {
                                winProbHome: h2hOdds.home,
                                winProbDraw: h2hOdds.draw,
                                winProbAway: h2hOdds.away,
                            },
                            create: {
                                matchId: existingMatch.id,
                                winProbHome: h2hOdds.home,
                                winProbDraw: h2hOdds.draw,
                                winProbAway: h2hOdds.away,
                            }
                        });
                    }

                    // Ensure translations exist for all languages
                    for (const lang of languages) {
                        const existingTrans = await prisma.matchTranslation.findFirst({
                            where: { matchId: existingMatch.id, languageCode: lang.code }
                        });

                        if (!existingTrans) {
                            await prisma.matchTranslation.create({
                                data: {
                                    match: { connect: { id: existingMatch.id } },
                                    language: { connect: { code: lang.code } },
                                    name: `${event.home_team} vs ${event.away_team}`,
                                    slug: `${event.home_team.toLowerCase().replace(/\s+/g, '-')}-vs-${event.away_team.toLowerCase().replace(/\s+/g, '-')}-${lang.code}-${Date.now()}`,
                                    seo: {
                                        create: {
                                            title: `${event.home_team} vs ${event.away_team} - Predictions`,
                                            description: `Match preview, odds and predictions for ${event.home_team} vs ${event.away_team}`,
                                        }
                                    }
                                }
                            });
                        }
                    }
                    result.updated++;
                } else {
                    // Create new match
                    const newMatch = await prisma.match.create({
                        data: {
                            date: new Date(event.commence_time),
                            homeTeam: event.home_team,
                            awayTeam: event.away_team,
                            leagueId: league.id,
                            status: 'SCHEDULED',
                            mainTip: h2hOdds ? getBestTip(h2hOdds) : null,
                            confidence: h2hOdds ? calculateConfidence(h2hOdds) : null,
                            translations: {
                                create: languages.map(lang => ({
                                    language: { connect: { code: lang.code } },
                                    name: `${event.home_team} vs ${event.away_team}`,
                                    slug: `${event.home_team.toLowerCase().replace(/\s+/g, '-')}-vs-${event.away_team.toLowerCase().replace(/\s+/g, '-')}-${lang.code}-${Date.now()}`,
                                    seo: {
                                        create: {
                                            title: `${event.home_team} vs ${event.away_team} - Predictions`,
                                            description: `Match preview, odds and predictions for ${event.home_team} vs ${event.away_team}`,
                                        }
                                    }
                                }))
                            },
                            prediction: h2hOdds ? {
                                create: {
                                    winProbHome: h2hOdds.home,
                                    winProbDraw: h2hOdds.draw,
                                    winProbAway: h2hOdds.away,
                                }
                            } : undefined
                        }
                    });
                    result.created++;
                }
            } catch (err: any) {
                result.errors.push(`Error processing ${event.home_team} vs ${event.away_team}: ${err.message}`);
            }
        }

        result.success = true;
        revalidatePath('/admin/matches');
        revalidatePath('/[lang]', 'layout');

    } catch (error: any) {
        result.errors.push(`Sync failed: ${error.message}`);
    }

    return result;
}

// Helper functions
function getSportCountry(sportKey: string, lang: string = 'en'): string {
    const map: Record<string, Record<string, string>> = {
        'soccer_epl': { en: 'England', fa: 'انگلستان', ar: 'إنجلترا' },
        'soccer_spain_la_liga': { en: 'Spain', fa: 'اسپانیا', ar: 'إسبانيا' },
        'soccer_germany_bundesliga': { en: 'Germany', fa: 'آلمان', ar: 'ألمانيا' },
        'soccer_italy_serie_a': { en: 'Italy', fa: 'ایتالیا', ar: 'إيطاليا' },
        'soccer_france_ligue_one': { en: 'France', fa: 'فرانسه', ar: 'فرنسا' },
    };
    return map[sportKey]?.[lang] || map[sportKey]?.['en'] || 'International';
}

function getSportTitle(sportKey: string, lang: string = 'en'): string {
    const map: Record<string, Record<string, string>> = {
        'soccer_epl': { en: 'Premier League', fa: 'لیگ برتر', ar: 'الدوري الإنجليزي الممتاز' },
        'soccer_spain_la_liga': { en: 'La Liga', fa: 'لالیگا', ar: 'الدوري الإسباني' },
        'soccer_germany_bundesliga': { en: 'Bundesliga', fa: 'بوندسلیگا', ar: 'الدوري الألماني' },
        'soccer_italy_serie_a': { en: 'Serie A', fa: 'سری آ', ar: 'الدوري الإيطالي' },
        'soccer_france_ligue_one': { en: 'Ligue 1', fa: 'لوشامپیونه', ar: 'الدوري الفرنسي' },
    };
    return map[sportKey]?.[lang] || map[sportKey]?.['en'] || sportKey;
}

function getSportLogo(sportKey: string): string {
    const map: Record<string, string> = {
        'soccer_epl': 'https://media.api-sports.io/football/leagues/39.png',
        'soccer_spain_la_liga': 'https://media.api-sports.io/football/leagues/140.png',
        'soccer_germany_bundesliga': 'https://media.api-sports.io/football/leagues/78.png',
        'soccer_italy_serie_a': 'https://media.api-sports.io/football/leagues/135.png',
        'soccer_france_ligue_one': 'https://media.api-sports.io/football/leagues/61.png',
    };
    return map[sportKey] || '';
}

function extractH2HOdds(event?: OddsEvent): { home: number; draw: number; away: number } | null {
    if (!event?.bookmakers?.length) return null;

    // Get first bookmaker with h2h market
    for (const bookmaker of event.bookmakers) {
        const h2hMarket = bookmaker.markets?.find(m => m.key === 'h2h');
        if (!h2hMarket) continue;

        const homeOutcome = h2hMarket.outcomes.find(o => o.name === event.home_team);
        const awayOutcome = h2hMarket.outcomes.find(o => o.name === event.away_team);
        const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');

        if (homeOutcome && awayOutcome) {
            // Convert decimal odds to implied probability
            const homeProb = (1 / homeOutcome.price) * 100;
            const awayProb = (1 / awayOutcome.price) * 100;
            const drawProb = drawOutcome ? (1 / drawOutcome.price) * 100 : 0;

            // Normalize to 100%
            const total = homeProb + awayProb + drawProb;
            return {
                home: Math.round((homeProb / total) * 100),
                draw: Math.round((drawProb / total) * 100),
                away: Math.round((awayProb / total) * 100),
            };
        }
    }

    return null;
}

function getBestTip(odds: { home: number; draw: number; away: number }): string {
    if (odds.home > odds.away && odds.home > odds.draw) return 'Home Win';
    if (odds.away > odds.home && odds.away > odds.draw) return 'Away Win';
    return 'Draw';
}

function calculateConfidence(odds: { home: number; draw: number; away: number }): number {
    return Math.max(odds.home, odds.draw, odds.away);
}
