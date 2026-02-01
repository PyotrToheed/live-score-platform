import prisma from "@/lib/db";
import "../globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDictionary } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "800", "900"] });

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const t = getDictionary(lang);
    const isRTL = ['ar', 'fa'].includes(lang);

    // Fetch Site Settings & Visible Languages with safe fallbacks
    let settings = null;
    let languages: any[] = [];

    try {
        const [settingsRes, languagesRes] = await Promise.all([
            prisma.siteSettings?.findFirst() || Promise.resolve(null),
            prisma.language?.findMany({
                where: { isVisible: true },
                orderBy: { name: 'asc' }
            }) || Promise.resolve([])
        ]);
        settings = settingsRes;
        languages = languagesRes;
    } catch (error) {
        console.error("Prisma lookup failed in layout.tsx:", error);
    }

    const displayTitle = settings?.globalTitle || "LiveBaz | Live Scores & Predictions";
    const brandColor = settings?.globalBrandColor || "#2563eb";

    return (
        <html lang={lang} dir={isRTL ? 'rtl' : 'ltr'} className="scroll-smooth" suppressHydrationWarning>
            <head>
                {settings?.headScripts && (
                    <script dangerouslySetInnerHTML={{ __html: settings.headScripts }} />
                )}
                <title>{displayTitle}</title>
                <meta name="description" content={settings?.globalDesc || ""} />
                <meta name="theme-color" content={brandColor} />
            </head>
            <body className={`${inter.className} bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-100 selection:text-blue-900`}>
                {settings?.bodyScripts && (
                    <script dangerouslySetInnerHTML={{ __html: settings.bodyScripts }} />
                )}
                <ThemeProvider>
                    <Navbar lang={lang} t={t} languages={languages}>
                        <ThemeToggle />
                        <LanguageSwitcher currentLang={lang} languages={languages} />
                    </Navbar>

                    <main className="pt-24 min-h-screen">
                        {children}
                    </main>

                    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-24 pb-12 mt-20">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                                <div className="col-span-2">
                                    <Link href={`/${lang}`} className="block relative h-12 w-48 mb-6 hover:opacity-80 transition-opacity">
                                        <Image
                                            src="/logo.png"
                                            alt={settings?.siteName || "LiveBaz"}
                                            fill
                                            className="object-contain object-left"
                                        />
                                    </Link>

                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-8 font-medium">
                                        {t.footer.tagline}
                                    </p>
                                </div>
                                <div className="animate-fade-in animation-delay-100">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{t.footer.explore}</h4>
                                    <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                                        <li><Link href={`/${lang}`} className="hover:text-blue-600 transition-colors">{t.footer.leagues}</Link></li>
                                        <li><Link href={`/${lang}/blog`} className="hover:text-blue-600 transition-colors">{t.footer.newsAnalysis}</Link></li>
                                        <li><Link href="#" className="hover:text-blue-600 transition-colors">{t.footer.predictions}</Link></li>
                                    </ul>
                                </div>
                                <div className="animate-fade-in animation-delay-200">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{t.footer.company}</h4>
                                    <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                                        <li><Link href="#" className="hover:text-blue-600 transition-colors">{t.footer.aboutUs}</Link></li>
                                        <li><Link href="#" className="hover:text-blue-600 transition-colors">{t.footer.privacyPolicy}</Link></li>
                                        <li><Link href="#" className="hover:text-blue-600 transition-colors">{t.footer.termsOfService}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                                    {t.footer.copyright}
                                </p>
                            </div>
                        </div>
                    </footer>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}


