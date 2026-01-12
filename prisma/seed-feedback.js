const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🏁 Seeding Client Feedback Milestone Data...');

    // 1. Add Persian Language
    const fa = await prisma.language.upsert({
        where: { code: 'fa' },
        update: { isVisible: true },
        create: {
            code: 'fa',
            name: 'Persian',
            isVisible: true
        }
    });
    console.log('✅ Persian language added');

    // 2. Add Iranian League
    const languages = await prisma.language.findMany();
    console.log('Available languages:', languages.map(l => l.code));

    const leagueData = {
        country: 'Iran',
        logoUrl: 'https://media.api-sports.io/football/leagues/290.png',
        translations: {
            create: languages.map(lang => {
                let name = 'Persian Gulf Pro League';
                let desc = 'The top tier of professional football in Iran.';

                if (lang.code === 'ar') {
                    name = 'دوري الخليج الفارسي';
                    desc = 'الدرجة الأولى لكرة القدم الاحترافية في إيران.';
                } else if (lang.code === 'fa') {
                    name = 'لیگ برتر خلیج فارس';
                    desc = 'بالاترین سطح فوتبال حرفه‌ای در ایران.';
                }

                const slug = `persian-gulf-pro-league-${lang.code}`;

                return {
                    language: { connect: { code: lang.code } },
                    name,
                    slug,
                    description: desc,
                    seo: {
                        create: {
                            title: name,
                            description: desc
                        }
                    }
                };
            })
        }
    };

    console.log('League data structure verified. Creating...');
    let persianLeague;
    try {
        persianLeague = await prisma.league.create({
            data: leagueData
        });
    } catch (err) {
        console.error('FAILED TO CREATE LEAGUE:');
        console.error(err);
        throw err;
    }
    console.log('✅ Iranian league added');

    // 3. Add a sample match for the Iranian League
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() + 2);

    await prisma.match.create({
        data: {
            date: matchDate,
            homeTeam: 'Persepolis',
            awayTeam: 'Esteghlal',
            homeTeamLogo: 'https://media.api-sports.io/football/teams/3282.png',
            awayTeamLogo: 'https://media.api-sports.io/football/teams/3281.png',
            leagueId: persianLeague.id,
            mainTip: 'Home Win',
            confidence: 75,
            isFeatured: true,
            status: 'SCHEDULED',
            prediction: {
                create: {
                    winProbHome: 45,
                    winProbDraw: 30,
                    winProbAway: 25
                }
            },
            translations: {
                create: languages.map(lang => {
                    let name = 'Persepolis vs Esteghlal';
                    if (lang.code === 'ar') {
                        name = 'برسپوليس ضد استقلال';
                    } else if (lang.code === 'fa') {
                        name = 'پرسپولیس در مقابل استقلال';
                    }

                    const slug = `persepolis-vs-esteghlal-${lang.code}`;
                    return {
                        language: { connect: { code: lang.code } },
                        name,
                        slug,
                        seo: {
                            create: {
                                title: name,
                                description: `Match preview and predictions for ${name}`
                            }
                        }
                    };
                })
            }
        }
    });
    console.log('✅ Sample Iranian match added');

    console.log('🚀 SEEDING COMPLETE');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
