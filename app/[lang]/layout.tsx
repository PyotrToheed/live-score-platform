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

const inter = Inter({ subsets: ["latin"] });

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

    // Fetch all visible languages
    const languages = await prisma.language.findMany({
        where: { isVisible: true },
        orderBy: { name: 'asc' }
    });

    return (
        <html lang={lang} dir={isRTL ? 'rtl' : 'ltr'} className="scroll-smooth" suppressHydrationWarning>
            <body className={`${inter.className} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors`}>
                <ThemeProvider>
                    <Navbar lang={lang} t={t} languages={languages}>
                        <ThemeToggle />
                        <LanguageSwitcher currentLang={lang} languages={languages} />
                    </Navbar>

                    <main className="pt-20 min-h-screen">
                        {children}
                    </main>

                    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pt-24 pb-12 mt-20">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                                <div className="col-span-2">
                                    <Link href={`/${lang}`} className="block relative h-16 w-64 mb-6 hover:opacity-80 transition-opacity">
                                        <Image
                                            src="/logo.png"
                                            alt="LiveBaz Logo"
                                            fill
                                            className="object-contain object-left"
                                        />
                                    </Link>

                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-8">
                                        {t.footer.tagline}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-6">{t.footer.explore}</h4>
                                    <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        <li><Link href={`/${lang}`} className="hover:text-blue-600">{t.footer.leagues}</Link></li>
                                        <li><Link href={`/${lang}/blog`} className="hover:text-blue-600">{t.footer.newsAnalysis}</Link></li>
                                        <li><Link href="#" className="hover:text-blue-600">{t.footer.predictions}</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-6">{t.footer.company}</h4>
                                    <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        <li><Link href="#" className="hover:text-blue-600">{t.footer.aboutUs}</Link></li>
                                        <li><Link href="#" className="hover:text-blue-600">{t.footer.privacyPolicy}</Link></li>
                                        <li><Link href="#" className="hover:text-blue-600">{t.footer.termsOfService}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="pt-12 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">
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


