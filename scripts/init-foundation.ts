import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initFoundation() {
    console.log("🚀 Initializing SEO-First Foundation...");

    // 1. Initialize SiteSettings (Singleton)
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
        await prisma.siteSettings.create({
            data: {
                siteName: "LiveBaz",
                defaultLocale: "en",
                globalTitle: "Live Score & Predictions | LiveBaz",
                globalDesc: "Get the latest live scores, expert predictions, and football analysis on LiveBaz.",
                globalBrandColor: "#2563eb"
            }
        });
        console.log("✅ SiteSettings initialized.");
    } else {
        console.log("ℹ️ SiteSettings already exists.");
    }

    // 2. Update Languages with new fields
    const languages = await prisma.language.findMany();
    for (const lang of languages) {
        await prisma.language.update({
            where: { id: lang.id },
            data: {
                isVisible: true,
                isSource: lang.code === 'en' // English as default source
            }
        });
    }
    console.log(`✅ ${languages.length} languages updated with visibility flags.`);

    // 3. Update existing translations to be active by default
    await prisma.leagueTranslation.updateMany({ data: { isActive: true } });
    await prisma.matchTranslation.updateMany({ data: { isActive: true } });
    await prisma.articleTranslation.updateMany({ data: { isActive: true } });
    console.log("✅ Existing translations set to active.");

    console.log("🏁 Foundation initialization complete.");
}

initFoundation()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
