import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n";
import PredictionCard from "@/components/PredictionCard";
import LiveTicker from "@/components/LiveTicker";
import BookmakersWidget from "@/components/BookmakersWidget";



export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "LiveBaz - Live Scores, Expert Predictions & Football Analysis",
        description: "Your ultimate source for real-time sports data, professional picks, and expert football analysis.",
    };

}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = getDictionary(lang);

    const leagues = await prisma.league.findMany({
        where: { translations: { some: { languageCode: lang } } },
        include: { translations: { where: { languageCode: lang } } }
    });

    const featuredArticles = await prisma.article.findMany({
        where: { published: true, translations: { some: { languageCode: lang } } },
        include: { translations: { where: { languageCode: lang } } },
        take: 4,
        orderBy: { createdAt: 'desc' }
    });

    const matches = await prisma.match.findMany({
        where: { translations: { some: { languageCode: lang } } },
        include: {
            translations: { where: { languageCode: lang } },
            prediction: true
        },
        take: 8,
        orderBy: { date: 'asc' }
    });

    return (
        <div className="flex flex-col">
            {/* Live Ticker */}
            <LiveTicker lang={lang} t={t} />

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Hero Section */}
                <section className="mb-16 grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
                    <div className="lg:col-span-2 text-center ltr:lg:text-start rtl:lg:text-start rtl:lg:text-right">
                        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800">
                            {t.hero.badge}
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                            {t.hero.title1} <span className="gradient-text italic">{t.hero.titleHighlight}</span> <br className="hidden lg:block" />
                            {t.hero.title2}
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mb-10">
                            {t.hero.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 justify-center ltr:lg:justify-start rtl:lg:justify-end">
                            <Link href={`/${lang}/predictions`} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">{t.hero.startWinning}</Link>
                            <Link href={`/${lang}/predictions`} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all">{t.ui.viewAll}</Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2 hidden lg:grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-12">
                            <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">{t.ui.accuracy}</div>
                                <div className="text-5xl font-black mb-2 tracking-tighter">89.4%</div>
                                <div className="text-xs font-bold leading-relaxed opacity-80">{t.ui.aiAccuracyDesc}</div>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden group border border-white/5">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">{t.ui.activeTips}</div>
                                <div className="text-4xl font-black text-blue-500 mb-2">452+</div>
                                <div className="text-xs font-bold opacity-60">Verified tips for top European leagues.</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden group">
                                <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-4">{t.ui.latestWinner}</div>
                                <div className="flex items-center -space-x-2 mb-4">
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 flex items-center justify-center text-[10px] font-black">JD</div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">MK</div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-black">AL</div>
                                </div>
                                <div className="text-xl font-black text-slate-900 dark:text-white leading-tight">21.5 Odds Correct Score</div>
                            </div>
                            <Link href={`/${lang}/pro`} className="relative overflow-hidden p-0 rounded-[3rem] border-2 border-blue-500/20 dark:border-blue-500/10 flex flex-col items-center text-center justify-center min-h-[200px] hover:border-blue-500 transition-all group shadow-2xl shadow-blue-500/10">
                                <Image src="/images/promo-pro.png" alt="Join Pro" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/60 transition-colors" />
                                <div className="relative z-10 p-8">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white mb-4 animate-bounce mx-auto">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{t.ui.unlockPro}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Today's Best Predictions (High Density List) */}
                <section className="mb-24">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-1.5 bg-blue-600 rounded-full" />
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter capitalize underline decoration-blue-500/30 decoration-8 underline-offset-8">{t.ui.featuredTips}</h2>
                        </div>
                        <Link href={`/${lang}/predictions`} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">{t.ui.viewAll}</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {matches.length > 0 ? (
                            matches.map((match: any) => (
                                <PredictionCard key={match.id} lang={lang} match={match} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Analyzing upcoming matches...</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Bookmaker Bonus Section (Mock) */}
                <section className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "LiveBaz Bonus", val: "$150", code: "BAZ150", color: "bg-blue-600" },
                        { name: "First Deposit", val: "200%", code: "DEP200", color: "bg-slate-900" },
                        { name: "Weekly Safe", val: "$50", code: "SAFE50", color: "bg-indigo-600" },
                    ].map((bonus, i) => (
                        <Link href={`/${lang}/pro`} key={i} className={`${bonus.color} p-8 rounded-[2rem] text-white flex flex-col justify-between items-start gap-8 relative overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10 w-full">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{bonus.name}</div>
                                <div className="text-5xl font-black tracking-tighter italic">{bonus.val}</div>
                            </div>
                            <div className="relative z-10 w-full flex items-center justify-between">
                                <div className="font-mono font-bold border-2 border-dashed border-white/20 px-3 py-1.5 rounded-lg text-sm group-hover:bg-white/10 transition-colors">
                                    CODE: {bonus.code}
                                </div>
                                <button className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                            </div>
                        </Link>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-24">
                        {/* Popular Leagues Section */}
                        <section>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-10 w-1.5 bg-blue-600 rounded-full" />
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter capitalize">{t.leagues.title}</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {leagues.map((league: any) => {
                                    const translation = league.translations[0];
                                    if (!translation) return null;
                                    return (
                                        <Link
                                            key={league.id}
                                            href={`/${lang}/league/${translation.slug}`}
                                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-500/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center font-black text-blue-600 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                                    {league.logoUrl ? (
                                                        <div className="relative w-full h-full p-2">
                                                            <Image
                                                                src={league.logoUrl}
                                                                alt={translation.name}
                                                                fill
                                                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        </div>
                                                    ) : league.country.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{translation.name}</h3>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{league.country}</p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Analysis Grid (Articles with Categories) */}
                        <section>
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-1.5 bg-indigo-600 rounded-full" />
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter capitalize">{t.articles.title}</h2>
                                </div>
                                <Link href={`/${lang}/blog`} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">{t.ui.viewAll}</Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {featuredArticles.map((article: any) => {
                                    const translation = article.translations[0];
                                    if (!translation) return null;

                                    // Fallback for generated images if not in DB
                                    let displayImage = article.featuredImage;
                                    if (!displayImage) {
                                        const title = translation.title.toLowerCase();
                                        if (title.includes('title race')) displayImage = '/images/art-title-race.png';
                                        else if (title.includes('transfer')) displayImage = '/images/art-transfers.png';
                                        else if (title.includes('bellingham')) displayImage = '/images/art-bellingham.png';
                                    }

                                    return (
                                        <article key={article.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                            <Link href={`/${lang}/blog/${translation.slug}`} className="aspect-[16/10] bg-slate-200 dark:bg-slate-700 relative overflow-hidden block">
                                                {displayImage ? (
                                                    <Image src={displayImage} alt={translation.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                                                ) : <div className="absolute inset-0 flex items-center justify-center font-black text-slate-400 italic text-4xl">LIVEBAZ</div>}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                                <div className="absolute top-6 left-6">
                                                    <span className="bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl border border-white/20">
                                                        {article.category}
                                                    </span>
                                                </div>
                                            </Link>
                                            <div className="p-10 flex flex-col flex-1 relative">
                                                <div className="absolute top-0 right-10 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18.477s-3.332.477-4.5 1.253"></path></svg>
                                                </div>
                                                <h3 className="text-2xl font-black mb-6 leading-[1.2] text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 uppercase italic tracking-tight">
                                                    <Link href={`/${lang}/blog/${translation.slug}`}>{translation.title}</Link>
                                                </h3>
                                                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-8 font-medium italic opacity-80">
                                                    {translation.excerpt || translation.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                                </p>
                                                <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Analysis #{article.id.substring(article.id.length - 4)}</span>
                                                    </div>
                                                    <Link href={`/${lang}/blog/${translation.slug}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group/link">
                                                        Read Full <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Filters (RatingBet Style) */}
                    <aside className="space-y-12">
                        {/* Bookmakers Widget */}
                        <BookmakersWidget lang={lang} />

                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-8 sticky top-32">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">L</div>
                                <h4 className="text-sm font-black uppercase tracking-widest">LiveBaz Filter</h4>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block">{t.ui.selectLeague}</label>
                                    <div className="flex flex-col gap-2">
                                        {leagues.map((l: any) => (
                                            <button key={l.id} className="text-start py-3 px-4 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 transition-colors text-slate-300">
                                                {l.translations[0]?.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    <div className="p-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-center">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">{t.ui.expertTipHub}</div>
                                        <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">{t.ui.proDescription}</p>
                                        <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{t.ui.goPro}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}





