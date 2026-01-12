import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning database...');
    await prisma.predictionTranslation.deleteMany({});
    await prisma.articleTranslation.deleteMany({});
    await prisma.matchTranslation.deleteMany({});
    await prisma.leagueTranslation.deleteMany({});
    await prisma.seoFields.deleteMany({});
    await prisma.prediction.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.league.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.adminUser.deleteMany({});

    // Create Admin User
    console.log('👤 Creating Admin User...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.create({
        data: {
            email: 'admin@livebaz.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN'
        }
    });

    // Languages
    console.log('🌐 Creating Languages...');
    await prisma.language.create({ data: { code: 'en', name: 'English', isVisible: true } });
    await prisma.language.create({ data: { code: 'ar', name: 'Arabic', isVisible: true } });

    // ========== LEAGUES ==========
    console.log('🏆 Creating Leagues...');

    // Premier League
    const pl = await prisma.league.create({ data: { country: 'England' } });
    const plSeoEn = await prisma.seoFields.create({ data: { title: 'Premier League Predictions', description: 'Expert analysis for EPL matches.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: pl.id, languageCode: 'en', name: 'Premier League', slug: 'premier-league', seoId: plSeoEn.id } });
    const plSeoAr = await prisma.seoFields.create({ data: { title: 'توقعات الدوري الإنجليزي', description: 'تحليل الخبراء للدوري الإنجليزي.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: pl.id, languageCode: 'ar', name: 'الدوري الإنجليزي الممتاز', slug: 'premier-league-ar', seoId: plSeoAr.id } });

    // La Liga
    const laliga = await prisma.league.create({ data: { country: 'Spain' } });
    const laligaSeoEn = await prisma.seoFields.create({ data: { title: 'La Liga Predictions', description: 'Spanish football expert analysis.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: laliga.id, languageCode: 'en', name: 'La Liga', slug: 'la-liga', seoId: laligaSeoEn.id } });
    const laligaSeoAr = await prisma.seoFields.create({ data: { title: 'توقعات الليغا', description: 'تحليل كرة القدم الإسبانية.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: laliga.id, languageCode: 'ar', name: 'الدوري الإسباني', slug: 'la-liga-ar', seoId: laligaSeoAr.id } });

    // Bundesliga
    const bundesliga = await prisma.league.create({ data: { country: 'Germany' } });
    const bundSeoEn = await prisma.seoFields.create({ data: { title: 'Bundesliga Predictions', description: 'German football expert analysis.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: bundesliga.id, languageCode: 'en', name: 'Bundesliga', slug: 'bundesliga', seoId: bundSeoEn.id } });
    const bundSeoAr = await prisma.seoFields.create({ data: { title: 'توقعات البوندسليغا', description: 'تحليل كرة القدم الألمانية.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: bundesliga.id, languageCode: 'ar', name: 'الدوري الألماني', slug: 'bundesliga-ar', seoId: bundSeoAr.id } });

    // Serie A
    const serieA = await prisma.league.create({ data: { country: 'Italy' } });
    const serieSeoEn = await prisma.seoFields.create({ data: { title: 'Serie A Predictions', description: 'Italian football expert analysis.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: serieA.id, languageCode: 'en', name: 'Serie A', slug: 'serie-a', seoId: serieSeoEn.id } });
    const serieSeoAr = await prisma.seoFields.create({ data: { title: 'توقعات الدوري الإيطالي', description: 'تحليل كرة القدم الإيطالية.' } });
    await prisma.leagueTranslation.create({ data: { leagueId: serieA.id, languageCode: 'ar', name: 'الدوري الإيطالي', slug: 'serie-a-ar', seoId: serieSeoAr.id } });

    // ========== MATCHES ==========
    console.log('⚽ Creating Matches...');

    // PL Match 1: Man City vs Arsenal
    const match1 = await prisma.match.create({
        data: { date: new Date('2026-02-15T20:00:00Z'), homeTeam: 'Man City', awayTeam: 'Arsenal', leagueId: pl.id, status: 'SCHEDULED', lineups: 'Man City: Ederson, Walker, Dias, Stones, Gvardiol; Rodri, De Bruyne, Bernardo; Foden, Haaland, Grealish\nArsenal: Raya, White, Saliba, Gabriel, Zinchenko; Rice, Odegaard, Havertz; Saka, Jesus, Martinelli', stats: 'Head to Head: City 3-1 Arsenal (last 5)\nForm: City WWWDW, Arsenal WDWWW' }
    });
    await prisma.prediction.create({ data: { matchId: match1.id, winProbHome: 45, winProbAway: 30, winProbDraw: 25 } });
    const m1SeoEn = await prisma.seoFields.create({ data: { title: 'Man City vs Arsenal Prediction', description: 'Title decider at Etihad Stadium.' } });
    await prisma.matchTranslation.create({ data: { matchId: match1.id, languageCode: 'en', name: 'Man City vs Arsenal', slug: 'man-city-vs-arsenal', content: '<p>The biggest match of the season as City host the Gunners in a title showdown.</p>', analysis: '<strong>Key Battle:</strong> Haaland vs Saliba will be decisive. Expect a tactical masterclass from both managers.', seoId: m1SeoEn.id } });
    const m1SeoAr = await prisma.seoFields.create({ data: { title: 'توقع السيتي وأرسنال', description: 'مواجهة حاسمة على ملعب الاتحاد.' } });
    await prisma.matchTranslation.create({ data: { matchId: match1.id, languageCode: 'ar', name: 'مانشستر سيتي ضد أرسنال', slug: 'man-city-vs-arsenal-ar', content: '<p>أكبر مباراة في الموسم حيث يستضيف السيتي الغانرز في مواجهة حاسمة على اللقب.</p>', analysis: '<strong>المواجهة الحاسمة:</strong> هالاند ضد ساليبا ستكون حاسمة. توقعوا درسًا تكتيكيًا من المدربين.', seoId: m1SeoAr.id } });

    // PL Match 2: Liverpool vs Chelsea
    const match2 = await prisma.match.create({
        data: { date: new Date('2026-02-16T17:30:00Z'), homeTeam: 'Liverpool', awayTeam: 'Chelsea', leagueId: pl.id, status: 'SCHEDULED', lineups: 'Liverpool: Alisson, Alexander-Arnold, Konate, Van Dijk, Robertson; Mac Allister, Szoboszlai, Jones; Salah, Nunez, Diaz', stats: 'Liverpool unbeaten at Anfield this season' }
    });
    await prisma.prediction.create({ data: { matchId: match2.id, winProbHome: 55, winProbAway: 25, winProbDraw: 20 } });
    const m2SeoEn = await prisma.seoFields.create({ data: { title: 'Liverpool vs Chelsea Prediction', description: 'Anfield showdown.' } });
    await prisma.matchTranslation.create({ data: { matchId: match2.id, languageCode: 'en', name: 'Liverpool vs Chelsea', slug: 'liverpool-vs-chelsea', content: '<p>Liverpool host Chelsea at fortress Anfield.</p>', analysis: '<strong>Prediction:</strong> Liverpool to dominate possession and create chances through Salah.', seoId: m2SeoEn.id } });
    const m2SeoAr = await prisma.seoFields.create({ data: { title: 'توقع ليفربول وتشيلسي', description: 'مواجهة أنفيلد.' } });
    await prisma.matchTranslation.create({ data: { matchId: match2.id, languageCode: 'ar', name: 'ليفربول ضد تشيلسي', slug: 'liverpool-vs-chelsea-ar', content: '<p>ليفربول يستضيف تشيلسي في قلعة أنفيلد.</p>', analysis: '<strong>التوقع:</strong> ليفربول سيسيطر على الاستحواذ وسيخلق فرصًا عبر صلاح.', seoId: m2SeoAr.id } });

    // La Liga Match: Real Madrid vs Barcelona
    const match3 = await prisma.match.create({
        data: { date: new Date('2026-02-22T21:00:00Z'), homeTeam: 'Real Madrid', awayTeam: 'Barcelona', leagueId: laliga.id, status: 'SCHEDULED', lineups: 'Real Madrid: Courtois, Carvajal, Militao, Rudiger, Mendy; Valverde, Tchouameni, Bellingham; Rodrygo, Vinicius, Mbappe', stats: 'El Clasico #250 - Historic rivalry' }
    });
    await prisma.prediction.create({ data: { matchId: match3.id, winProbHome: 40, winProbAway: 35, winProbDraw: 25 } });
    const m3SeoEn = await prisma.seoFields.create({ data: { title: 'El Clasico Prediction', description: 'Real Madrid vs Barcelona preview.' } });
    await prisma.matchTranslation.create({ data: { matchId: match3.id, languageCode: 'en', name: 'Real Madrid vs Barcelona', slug: 'real-madrid-vs-barcelona', content: '<p>The 250th El Clasico promises fireworks at the Bernabeu.</p>', analysis: '<strong>Star Watch:</strong> Mbappe vs Yamal - the present vs the future.', seoId: m3SeoEn.id } });
    const m3SeoAr = await prisma.seoFields.create({ data: { title: 'توقع الكلاسيكو', description: 'معاينة ريال مدريد ضد برشلونة.' } });
    await prisma.matchTranslation.create({ data: { matchId: match3.id, languageCode: 'ar', name: 'ريال مدريد ضد برشلونة', slug: 'real-madrid-vs-barcelona-ar', content: '<p>الكلاسيكو رقم 250 يعد بالإثارة في البرنابيو.</p>', analysis: '<strong>نجوم المباراة:</strong> مبابي ضد يامال - الحاضر مقابل المستقبل.', seoId: m3SeoAr.id } });

    // Bundesliga Match: Bayern vs Dortmund
    const match4 = await prisma.match.create({
        data: { date: new Date('2026-02-23T18:30:00Z'), homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', leagueId: bundesliga.id, status: 'LIVE', homeScore: 2, awayScore: 1, lineups: 'Bayern: Neuer, Kimmich, Upamecano, Kim, Davies; Goretzka, Musiala; Sane, Muller, Coman; Kane', stats: 'Der Klassiker - Most watched German game' }
    });
    await prisma.prediction.create({ data: { matchId: match4.id, winProbHome: 50, winProbAway: 28, winProbDraw: 22 } });
    const m4SeoEn = await prisma.seoFields.create({ data: { title: 'Der Klassiker Prediction', description: 'Bayern vs Dortmund preview.' } });
    await prisma.matchTranslation.create({ data: { matchId: match4.id, languageCode: 'en', name: 'Bayern Munich vs Dortmund', slug: 'bayern-vs-dortmund', content: '<p>Der Klassiker never disappoints.</p>', analysis: '<strong>Key Player:</strong> Harry Kane leading the line for Bayern.', seoId: m4SeoEn.id } });
    const m4SeoAr = await prisma.seoFields.create({ data: { title: 'توقع الكلاسيكر', description: 'معاينة بايرن ودورتموند.' } });
    await prisma.matchTranslation.create({ data: { matchId: match4.id, languageCode: 'ar', name: 'بايرن ميونخ ضد دورتموند', slug: 'bayern-vs-dortmund-ar', content: '<p>الكلاسيكر الألماني لا يخيب الآمال أبدًا.</p>', analysis: '<strong>اللاعب الأساسي:</strong> هاري كين يقود خط هجوم بايرن.', seoId: m4SeoAr.id } });

    // ========== ARTICLES ==========
    console.log('📰 Creating Articles...');

    // Article 1: Title Race Analysis
    const art1 = await prisma.article.create({ data: { category: 'Analysis', published: true } });
    const a1SeoEn = await prisma.seoFields.create({ data: { title: '2026 Title Race Guide', description: 'Full breakdown of the title race.' } });
    await prisma.articleTranslation.create({ data: { articleId: art1.id, languageCode: 'en', title: 'The 2026 Title Race Analysis', slug: 'title-race-2026', excerpt: 'Who stands the best chance?', content: '<h2>The Contenders</h2><p>With just 10 games remaining, the title race is wide open. Man City leads by 2 points from Arsenal, with Liverpool just 4 points behind.</p><h3>Man City</h3><p>The defending champions have the experience and depth to go all the way again.</p><h3>Arsenal</h3><p>Arteta\'s side has shown remarkable consistency this season.</p>', seoId: a1SeoEn.id } });
    const a1SeoAr = await prisma.seoFields.create({ data: { title: 'تحليل سباق اللقب 2026', description: 'تحليل شامل لسباق اللقب.' } });
    await prisma.articleTranslation.create({ data: { articleId: art1.id, languageCode: 'ar', title: 'تحليل سباق لقب 2026', slug: 'title-race-2026-ar', excerpt: 'من لديه الفرصة الأفضل؟', content: '<h2>المتنافسون</h2><p>مع تبقي 10 مباريات فقط، سباق اللقب مفتوح على مصراعيه. السيتي يتصدر بفارق نقطتين عن أرسنال، وليفربول على بعد 4 نقاط فقط.</p>', seoId: a1SeoAr.id } });

    // Article 2: Transfer News
    const art2 = await prisma.article.create({ data: { category: 'Transfer', published: true } });
    const a2SeoEn = await prisma.seoFields.create({ data: { title: 'Summer Transfer Window Preview', description: 'Top transfers to watch.' } });
    await prisma.articleTranslation.create({ data: { articleId: art2.id, languageCode: 'en', title: 'Top 10 Summer Transfers to Watch', slug: 'summer-transfers-2026', excerpt: 'The biggest moves expected this summer.', content: '<h2>Market Overview</h2><p>The summer transfer window promises to be one of the most exciting in years.</p><h3>1. Florian Wirtz</h3><p>Every top club in Europe is monitoring the German wonderkid.</p><h3>2. Victor Osimhen</h3><p>The Nigerian striker could finally make his Premier League move.</p>', seoId: a2SeoEn.id } });
    const a2SeoAr = await prisma.seoFields.create({ data: { title: 'نافذة الانتقالات الصيفية', description: 'أهم الانتقالات المتوقعة.' } });
    await prisma.articleTranslation.create({ data: { articleId: art2.id, languageCode: 'ar', title: 'أفضل 10 انتقالات صيفية متوقعة', slug: 'summer-transfers-2026-ar', excerpt: 'أكبر الصفقات المتوقعة هذا الصيف.', content: '<h2>نظرة على السوق</h2><p>تعد نافذة الانتقالات الصيفية بأن تكون من أكثر النوافذ إثارة منذ سنوات.</p><h3>1. فلوريان فيرتز</h3><p>كل الأندية الكبرى في أوروبا تراقب المعجزة الألمانية.</p>', seoId: a2SeoAr.id } });

    // Article 3: Player Profile
    const art3 = await prisma.article.create({ data: { category: 'Profile', published: true } });
    const a3SeoEn = await prisma.seoFields.create({ data: { title: 'Jude Bellingham Profile', description: 'The rise of England\'s superstar.' } });
    await prisma.articleTranslation.create({ data: { articleId: art3.id, languageCode: 'en', title: 'Jude Bellingham: The Complete Midfielder', slug: 'bellingham-profile', excerpt: 'How Bellingham became world class.', content: '<h2>From Birmingham to the Bernabeu</h2><p>Jude Bellingham\'s journey from Championship football to becoming one of the world\'s best players is nothing short of remarkable.</p><p>At just 22, he has already won La Liga, scored crucial Champions League goals, and become the beating heart of Real Madrid\'s midfield.</p>', seoId: a3SeoEn.id } });
    const a3SeoAr = await prisma.seoFields.create({ data: { title: 'ملف جود بيلينغهام', description: 'صعود نجم إنجلترا.' } });
    await prisma.articleTranslation.create({ data: { articleId: art3.id, languageCode: 'ar', title: 'جود بيلينغهام: لاعب الوسط الكامل', slug: 'bellingham-profile-ar', excerpt: 'كيف أصبح بيلينغهام نجمًا عالميًا.', content: '<h2>من برمنغهام إلى البرنابيو</h2><p>رحلة جود بيلينغهام من دوري الدرجة الثانية الإنجليزي إلى أحد أفضل اللاعبين في العالم رائعة.</p>', seoId: a3SeoAr.id } });

    console.log('✅ Seeding completed successfully!');
    console.log('📧 Admin Login: admin@sportsinfo.com / admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
