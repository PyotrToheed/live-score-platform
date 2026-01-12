const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- SEEDING FINAL MILESTONE DATA ---');

    // 1. Get languages
    const langs = await prisma.language.findMany();
    if (langs.length === 0) {
        console.error('No languages found.');
        return;
    }

    console.log('🧹 Cleaning existing data...');
    await prisma.predictionTranslation.deleteMany({});
    await prisma.articleTranslation.deleteMany({});
    await prisma.matchTranslation.deleteMany({});
    await prisma.leagueTranslation.deleteMany({});
    await prisma.seoFields.deleteMany({});
    await prisma.prediction.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.league.deleteMany({});
    console.log('✅ Cleanup complete.');

    // 2. Ensure Leagues Exist
    const leaguesData = [
        { country: 'England', name: 'Premier League', slug: 'premier-league', logo: 'https://media.api-sports.io/football/leagues/39.png' },
        { country: 'Spain', name: 'La Liga', slug: 'la-liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
        { country: 'Italy', name: 'Serie A', slug: 'serie-a', logo: 'https://media.api-sports.io/football/leagues/135.png' },
        { country: 'Germany', name: 'Bundesliga', slug: 'bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
        { country: 'France', name: 'Ligue 1', slug: 'ligue-1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
        { country: 'Europe', name: 'Champions League', slug: 'champions-league', logo: 'https://media.api-sports.io/football/leagues/2.png' },
        { country: 'Europe', name: 'Europa League', slug: 'europa-league', logo: 'https://media.api-sports.io/football/leagues/3.png' },
        { country: 'World', name: 'World Cup', slug: 'world-cup', logo: 'https://media.api-sports.io/football/leagues/1.png' },
        { country: 'Asia', name: 'AFC Asian Cup', slug: 'afc-asian-cup', logo: 'https://media.api-sports.io/football/leagues/7.png' }
    ];

    // Ensure Admin exists with correct branding
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.upsert({
        where: { email: 'admin@livebaz.com' },
        update: { password: hashedPassword },
        create: {
            email: 'admin@livebaz.com',
            password: hashedPassword,
            name: 'LiveBaz Admin',
            role: 'ADMIN'
        }
    });

    const leagueMap = {};

    for (const l of leaguesData) {
        // Try to find by slug first
        let league = await prisma.league.findFirst({
            where: {
                translations: { some: { slug: l.slug } }
            },
            include: { translations: true }
        });

        if (!league) {
            console.log(`Creating league: ${l.name}`);
            try {
                const translationsData = [];
                for (const lang of langs) {
                    // Create unique SEO for each translation
                    const seo = await prisma.seoFields.create({
                        data: {
                            title: `${l.name} Predictions`,
                            description: `Best betting tips for ${l.name}`
                        }
                    });

                    translationsData.push({
                        languageCode: lang.code,
                        name: l.name,
                        slug: lang.code === 'en' ? l.slug : `${l.slug}-${lang.code}`,
                        seoId: seo.id
                    });
                }

                league = await prisma.league.create({
                    data: {
                        country: l.country,
                        logoUrl: l.logo,
                        translations: {
                            create: translationsData
                        }
                    }
                });
            } catch (e) {
                console.log(`League creation failed for ${l.name}: ${e.message}`);
                // Try finding by country as fallback
                league = await prisma.league.findFirst({
                    where: { country: l.country },
                    include: { translations: true }
                });
            }
        } else {
            console.log(`Found existing league: ${l.name}`);
        }

        if (league) {
            leagueMap[l.slug] = league.id;
        }
    }

    // 3. Match Data (25+ Matches)
    const matches = [
        // Premier League
        { l: 'premier-league', home: 'Arsenal', away: 'Liverpool', tip: 'Home Win', conf: 78, prob: { h: 55, d: 25, a: 20 }, featured: true },
        { l: 'premier-league', home: 'Chelsea', away: 'Tottenham', tip: 'Over 2.5', conf: 82, prob: { h: 40, d: 20, a: 40 }, featured: true },
        { l: 'premier-league', home: 'Man City', away: 'Man Utd', tip: 'Home Win', conf: 91, prob: { h: 70, d: 15, a: 15 }, featured: true },
        { l: 'premier-league', home: 'Everton', away: 'West Ham', tip: 'BTTS Yes', conf: 65, prob: { h: 30, d: 40, a: 30 } },
        { l: 'premier-league', home: 'Aston Villa', away: 'Newcastle', tip: 'Draw', conf: 55, prob: { h: 33, d: 34, a: 33 } },
        { l: 'premier-league', home: 'Brighton', away: 'Brentford', tip: 'Home Win', conf: 72, prob: { h: 50, d: 30, a: 20 } },
        { l: 'premier-league', home: 'Fulham', away: 'Wolves', tip: 'Under 2.5', conf: 85, prob: { h: 35, d: 35, a: 30 } },
        { l: 'premier-league', home: 'Crystal Palace', away: 'Luton', tip: 'Home Win', conf: 75, prob: { h: 60, d: 25, a: 15 } },

        // La Liga
        { l: 'la-liga', home: 'Real Madrid', away: 'Barcelona', tip: 'BTTS Yes', conf: 88, prob: { h: 45, d: 25, a: 30 }, featured: true },
        { l: 'la-liga', home: 'Atletico Madrid', away: 'Sevilla', tip: 'Home Win', conf: 70, prob: { h: 55, d: 30, a: 15 } },
        { l: 'la-liga', home: 'Girona', away: 'Valencia', tip: 'Over 2.5', conf: 68, prob: { h: 42, d: 28, a: 30 } },
        { l: 'la-liga', home: 'Real Sociedad', away: 'Betis', tip: 'Draw', conf: 45, prob: { h: 33, d: 34, a: 33 } },
        { l: 'la-liga', home: 'Villareal', away: 'Mallorca', tip: 'Home Win', conf: 76, prob: { h: 58, d: 22, a: 20 } },

        // Serie A
        { l: 'serie-a', home: 'Juventus', away: 'AC Milan', tip: 'Under 2.5', conf: 80, prob: { h: 40, d: 35, a: 25 }, featured: true },
        { l: 'serie-a', home: 'Inter', away: 'Napoli', tip: 'Home Win', conf: 74, prob: { h: 52, d: 28, a: 20 }, featured: true },
        { l: 'serie-a', home: 'Roma', away: 'Lazio', tip: 'BTTS Yes', conf: 66, prob: { h: 35, d: 30, a: 35 } },
        { l: 'serie-a', home: 'Atalanta', away: 'Fiorentina', tip: 'Over 2.5', conf: 75, prob: { h: 45, d: 25, a: 30 } },

        // Bundesliga
        { l: 'bundesliga', home: 'Bayern Munich', away: 'Dortmund', tip: 'Over 3.5', conf: 92, prob: { h: 65, d: 15, a: 20 }, featured: true },
        { l: 'bundesliga', home: 'Leverkusen', away: 'Leipzig', tip: 'Home Win', conf: 78, prob: { h: 50, d: 25, a: 25 } },
        { l: 'bundesliga', home: 'Stuttgart', away: 'Frankfurt', tip: 'BTTS Yes', conf: 70, prob: { h: 40, d: 20, a: 40 } },

        // Champions League
        { l: 'champions-league', home: 'Man City', away: 'Real Madrid', tip: 'BTTS Yes', conf: 89, prob: { h: 40, d: 25, a: 35 }, featured: true },
        { l: 'champions-league', home: 'PSG', away: 'Barcelona', tip: 'Home Win', conf: 65, prob: { h: 45, d: 30, a: 25 } },
        { l: 'champions-league', home: 'Arsenal', away: 'Bayern', tip: 'Draw', conf: 50, prob: { h: 35, d: 30, a: 35 } },
        { l: 'champions-league', home: 'Atletico', away: 'Dortmund', tip: 'Under 2.5', conf: 82, prob: { h: 55, d: 30, a: 15 } }
    ];

    for (const m of matches) {
        const leagueId = leagueMap[m.l];
        if (!leagueId) continue;

        // Random date in next 7 days
        const date = new Date();
        const hoursToAdd = Math.floor(Math.random() * (24 * 7));
        date.setHours(date.getHours() + hoursToAdd);

        // Prepare translations with unique SEO
        const translationsData = [];
        for (const l of langs) {
            const seo = await prisma.seoFields.create({
                data: {
                    title: `${m.home} vs ${m.away} Betting Field`,
                    description: `Prediction and odds for ${m.home} vs ${m.away}`
                }
            });
            translationsData.push({
                languageCode: l.code,
                slug: `${m.home.toLowerCase().replace(/ /g, '-')}-vs-${m.away.toLowerCase().replace(/ /g, '-')}-${l.code}-${Math.floor(Math.random() * 10000)}`,
                name: `${m.home} vs ${m.away}`,
                seoId: seo.id
            });
        }

        await prisma.match.create({
            data: {
                date,
                homeTeam: m.home,
                awayTeam: m.away,
                homeTeamLogo: null,
                awayTeamLogo: null,
                leagueId: leagueId,
                mainTip: m.tip,
                confidence: m.conf,
                isFeatured: !!m.featured,
                status: 'SCHEDULED',
                prediction: {
                    create: {
                        winProbHome: m.prob.h,
                        winProbDraw: m.prob.d,
                        winProbAway: m.prob.a,
                    }
                },
                translations: {
                    create: translationsData
                }
            }
        });
        process.stdout.write('.');
    }

    console.log('\n📰 Seeding Premium Articles...');
    const articlesData = [
        {
            category: 'Analysis',
            img: '/images/art-title-race.png',
            en: { title: 'The 2026 Title Race Analysis', slug: 'title-race-2026', excerpt: 'Who stands the best chance?', content: '<h2>The Contenders</h2><p>With just 10 games remaining, the title race is wide open.</p>' },
            ar: { title: 'تحليل سباق لقب 2026', slug: 'title-race-2026-ar', excerpt: 'من لديه الفرصة الأفضل؟', content: '<h2>المتنافسون</h2><p>مع تبقي 10 مباريات فقط، سباق اللقب مفتوح على مصراعيه.</p>' }
        },
        {
            category: 'Transfer',
            img: '/images/art-transfers.png',
            en: { title: 'Top 10 Summer Transfers to Watch', slug: 'summer-transfers-2026', excerpt: 'The biggest moves expected this summer.', content: '<h2>Market Overview</h2><p>The summer transfer window promises to be one of the most exciting in years.</p>' },
            ar: { title: 'أفضل 10 انتقالات صيفية متوقعة', slug: 'summer-transfers-2026-ar', excerpt: 'أكبر الصفقات المتوقعة هذا الصيف.', content: '<h2>نظرة على السوق</h2><p>تعد نافذة الانتقالات الصيفية بأن تكون من أكثر النوافذ إثارة منذ سنوات.</p>' }
        },
        {
            category: 'Profile',
            img: '/images/art-bellingham.png',
            en: { title: 'Jude Bellingham: The Complete Midfielder', slug: 'bellingham-profile', excerpt: 'How Bellingham became world class.', content: '<h2>From Birmingham to the Bernabeu</h2><p>Jude Bellingham\'s journey is remarkable.</p>' },
            ar: { title: 'جود بيلينغهام: لاعب الوسط الكامل', slug: 'bellingham-profile-ar', excerpt: 'كيف أصبح بيلينغهام نجمًا عالميًا.', content: '<h2>من برمنغهام إلى البرنابيو</h2><p>رحلة جود بيلينغهام رائعة.</p>' }
        }
    ];

    for (const art of articlesData) {
        const translations = [];
        for (const lang of langs) {
            const data = lang.code === 'ar' ? art.ar : art.en;
            const seo = await prisma.seoFields.create({
                data: {
                    title: data.title,
                    description: data.excerpt
                }
            });
            translations.push({
                languageCode: lang.code,
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                seoId: seo.id
            });
        }

        await prisma.article.create({
            data: {
                category: art.category,
                featuredImage: art.img,
                published: true,
                translations: {
                    create: translations
                }
            }
        });
        process.stdout.write('📰');
    }

    console.log('\n--- SEEDING COMPLETE ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
