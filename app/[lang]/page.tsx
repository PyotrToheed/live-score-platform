import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n";
import PredictionCard from "@/components/PredictionCard";
import LiveTicker from "@/components/LiveTicker";
import BookmakersWidget from "@/components/BookmakersWidget";
import { Activity, Crown, Trophy } from "lucide-react";



export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    let settings = null;
    try {
        settings = await prisma.siteSettings?.findFirst();
    } catch (e) {
        console.error("Metadata fetch failed:", e);
    }

    return {
        title: settings?.globalTitle || "LiveScore & Expert Predictions | LiveBaz",
        description: settings?.globalDesc || "Professional football picks, live scores, and expert analysis.",
    };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = getDictionary(lang);

    let leagues: any[] = [];
    let featuredArticles: any[] = [];
    let matches: any[] = [];

    try {
        const [leaguesRes, articlesRes, matchesRes] = await Promise.all([
            prisma.league?.findMany({
                where: { translations: { some: { languageCode: lang } } },
                include: { translations: { where: { languageCode: lang } } }
            }) || Promise.resolve([]),
            prisma.article?.findMany({
                where: { published: true, translations: { some: { languageCode: lang } } },
                include: { translations: { where: { languageCode: lang } } },
                take: 4,
                orderBy: { createdAt: 'desc' }
            }) || Promise.resolve([]),
            prisma.match?.findMany({
                where: { translations: { some: { languageCode: lang } } },
                include: {
                    translations: { where: { languageCode: lang } },
                    prediction: true
                },
                take: 8,
                orderBy: { date: 'asc' }
            }) || Promise.resolve([])
        ]);
        leagues = leaguesRes;
        featuredArticles = articlesRes;
        matches = matchesRes;
    } catch (e) {
        console.error("Home page data fetch failed:", e);
    }

    return (
        <div className="flex flex-col animate-fade-in">
            {/* Live Ticker */}
            <LiveTicker lang={lang} t={t} />

            <div className="container mx-auto px-6 py-16 max-w-7xl">
                {/* Hero Section */}
                <section className="mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    <div className="lg:col-span-7 text-center lg:ltr:text-left lg:rtl:text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50/50 dark:bg-blue-900/20 rounded-full border border-blue-100/50 dark:border-blue-800 animate-fade-in shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                            {t.hero.badge}
                        </div>
                        <h1 className="text-6xl lg:text-[6rem] font-black mb-10 leading-[0.9] tracking-[-0.04em] text-slate-900 dark:text-white animate-fade-up">
                            {t.hero.title1} <br />
                            <span className="gradient-text italic opacity-95">{t.hero.titleHighlight}</span> <br className="hidden xl:block" />
                            {t.hero.title2}
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-12 font-medium animate-fade-up animation-delay-100">
                            {t.hero.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 justify-center lg:ltr:justify-start lg:rtl:justify-end animate-fade-up animation-delay-200">
                            <Link href={`/${lang}/predictions`} className="bg-blue-600 text-white px-10 py-5 rounded-[1.25rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-95 shadow-lg">
                                {t.hero.startWinning}
                            </Link>
                            <Link href={`/${lang}/blog`} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-10 py-5 rounded-[1.25rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                                {t.ui.viewAll}
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-1 gap-8 animate-fade-in animation-delay-300">
                        <div className="premium-card p-12 bg-slate-900 text-white border-none relative overflow-hidden group shadow-2xl">
                            <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-blue-400 opacity-80">{t.ui.accuracy}</div>
                                <div className="text-8xl font-black mb-6 tracking-tighter italic">89.4<span className="text-blue-500">%</span></div>
                                <p className="text-sm font-bold leading-relaxed text-slate-400 max-w-xs">{t.ui.aiAccuracyDesc}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="premium-card p-8 bg-blue-600 text-white border-none flex flex-col justify-between aspect-square shadow-xl shadow-blue-500/20 group">
                                <Crown className="w-8 h-8 opacity-20 group-hover:rotate-12 transition-transform" />
                                <div className="text-4xl font-black italic uppercase leading-none mt-4">TOP<br />PICK</div>
                            </div>
                            <div className="premium-card p-8 bg-white dark:bg-slate-900 flex flex-col justify-between aspect-square shadow-lg group">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Experts</div>
                                <div className="text-5xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">50+</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Today's Best Predictions */}
                <section className="mb-32">
                    <div className="flex items-end justify-between mb-12">
                        <div className="space-y-4">
                            <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">{t.ui.featuredTips}</h2>
                        </div>
                        <Link href={`/${lang}/predictions`} className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
                            {t.ui.viewAll} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {matches.length > 0 ? (
                            matches.map((match: any, i: number) => (
                                <div key={match.id} className={`animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                                    <PredictionCard lang={lang} match={match} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Analyzing upcoming matches...</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Promotions / Bonuses */}
                <section className="mb-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "LiveBaz Bonus", val: "$150", code: "BAZ150", color: "bg-blue-600", desc: "First deposit bonus" },
                        { name: "VIP Rebate", val: "20%", code: "VIP20", color: "bg-slate-900", desc: "Weekly loss protection" },
                        { name: "Free Bet", val: "$50", code: "FREE50", color: "bg-indigo-600", desc: "Sign up bonus today" },
                    ].map((bonus, i) => (
                        <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                            <Link href={`/${lang}/pro`} className={`${bonus.color} p-10 rounded-[2.5rem] text-white flex flex-col justify-between items-start gap-12 relative overflow-hidden group hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-500`}>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 w-full">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-3">{bonus.name}</div>
                                    <div className="text-6xl font-black tracking-[-0.05em] italic leading-none mb-3">{bonus.val}</div>
                                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{bonus.desc}</p>
                                </div>
                                <div className="relative z-10 w-full flex items-center justify-between">
                                    <div className="font-mono text-xs font-black border-2 border-dashed border-white/20 px-4 py-2 rounded-xl group-hover:bg-white/10 transition-colors tracking-widest">
                                        {bonus.code}
                                    </div>
                                    <div className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-xl">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    <div className="lg:col-span-2 space-y-32">
                        {/* Leagues Section */}
                        <section className="animate-fade-in">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="h-12 w-2 bg-blue-600 rounded-full" />
                                <hgroup>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">{t.leagues.title}</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Top football competitions</p>
                                </hgroup>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {leagues.map((league: any, i: number) => {
                                    const translation = league.translations[0];
                                    if (!translation) return null;
                                    return (
                                        <Link
                                            key={league.id}
                                            href={`/${lang}/league/${translation.slug}`}
                                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-up"
                                            style={{ animationDelay: `${i * 50}ms` }}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-50 dark:border-slate-700 shadow-sm overflow-hidden relative">
                                                    {league.logoUrl ? (
                                                        <Image src={league.logoUrl} alt={translation.name} fill className="object-contain p-3 group-hover:scale-115 transition-transform duration-500" />
                                                    ) : <span className="font-black text-blue-600">{league.country.substring(0, 2)}</span>}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{translation.name}</h3>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{league.country}</p>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-50 dark:border-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all">
                                                <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Analysis / News Section */}
                        <section className="animate-fade-in">
                            <div className="flex items-end justify-between mb-12">
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-2 bg-slate-900 dark:bg-white rounded-full" />
                                    <hgroup>
                                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">{t.articles.title}</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Deep analysis & insights</p>
                                    </hgroup>
                                </div>
                                <Link href={`/${lang}/blog`} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">{t.ui.viewAll}</Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {featuredArticles.map((article: any, i: number) => {
                                    const translation = article.translations[0];
                                    if (!translation) return null;

                                    return (
                                        <article key={article.id} className="group flex flex-col animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                                            <Link href={`/${lang}/blog/${translation.slug}`} className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-[3rem] relative overflow-hidden block mb-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                                {article.featuredImage ? (
                                                    <Image src={article.featuredImage} alt={translation.title} fill className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1" />
                                                ) : <div className="absolute inset-0 flex items-center justify-center font-black text-slate-200 dark:text-slate-800 text-6xl italic">BAZ</div>}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-8 left-8">
                                                    <span className="bg-white/90 backdrop-blur-md text-blue-600 text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl border border-blue-50">
                                                        {article.category}
                                                    </span>
                                                </div>
                                            </Link>
                                            <div className="px-4">
                                                <h3 className="text-2xl font-black mb-4 leading-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight">
                                                    <Link href={`/${lang}/blog/${translation.slug}`}>{translation.title}</Link>
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6 font-medium text-sm">
                                                    {translation.excerpt || translation.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                                </p>
                                                <Link href={`/${lang}/blog/${translation.slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group/l">
                                                    Discover Analysis <div className="w-8 h-px bg-blue-100 group-hover/l:w-12 transition-all transition-colors" />
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-16 animate-fade-in animation-delay-500">
                        <BookmakersWidget lang={lang} />

                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] space-y-10 sticky top-32 border-2 border-slate-50 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-4 border-b border-slate-50 dark:border-slate-800 pb-6 uppercase">
                                <Activity className="w-5 h-5 text-blue-600" />
                                <h4 className="text-xs font-black tracking-widest">Platform Filter</h4>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">{t.ui.selectLeague}</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {leagues.slice(0, 5).map((l: any) => (
                                            <Link key={l.id} href={`/${lang}/league/${l.translations[0]?.slug}`} className="py-4 px-6 rounded-2xl text-xs font-black uppercase border border-slate-50 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 transition-all bg-slate-50/50 dark:bg-slate-800/20">
                                                {l.translations[0]?.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                                    <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full -mr-12 -mt-12" />
                                        <div className="relative z-10">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-4">{t.ui.expertTipHub}</div>
                                            <p className="text-xs font-bold leading-relaxed mb-6 opacity-60">Get access to professional algorithms and high-confidence picks.</p>
                                            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">{t.ui.goPro}</button>
                                        </div>
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





