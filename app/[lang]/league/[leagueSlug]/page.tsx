import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, leagueSlug: string }> }) {
    const { leagueSlug } = await params;
    const leagueTrans = await prisma.leagueTranslation.findUnique({
        where: { slug: leagueSlug },
        include: { seo: true }
    });

    if (!leagueTrans) return {};
    return generatePageMetadata(leagueTrans.seo);
}

export default async function LeaguePage({ params }: { params: Promise<{ lang: string, leagueSlug: string }> }) {
    const { lang, leagueSlug } = await params;
    const t = getDictionary(lang);

    const translateTip = (tip: string | null | undefined) => {
        if (!tip) return "";
        const lower = tip.toLowerCase();
        if (lower.includes('home win')) return lang === 'fa' ? 'برد میزبان' : lang === 'ar' ? 'فوز صاحب الأرض' : 'Home Win';
        if (lower.includes('away win')) return lang === 'fa' ? 'برد میهمان' : lang === 'ar' ? 'فوز الضيف' : 'Away Win';
        if (lower.includes('draw')) return lang === 'fa' ? 'مساوی' : lang === 'ar' ? 'تعادل' : 'Draw';
        if (lower.includes('btts')) return lang === 'fa' ? 'گلزنی هر دو تیم' : lang === 'ar' ? 'كلا الفريقين يسجل' : 'BTTS Yes';
        return tip;
    };

    const leagueTrans = await prisma.leagueTranslation.findUnique({
        where: { slug: leagueSlug },
        include: {
            league: {
                include: {
                    matches: {
                        where: {
                            translations: {
                                some: { languageCode: lang }
                            }
                        },
                        include: {
                            translations: { where: { languageCode: lang } },
                            prediction: true
                        },
                        orderBy: { date: 'asc' }
                    }
                }
            }
        }
    });

    if (!leagueTrans) notFound();

    return (
        <div className="container mx-auto px-4 py-8">
            <nav className="text-sm text-slate-500 mb-6">
                <Link href={`/${lang}`} className="hover:text-primary dark:hover:text-blue-400">{t.nav.home}</Link>

                <span className="mx-2">/</span>
                <span className="font-medium text-slate-900 dark:text-white">{leagueTrans.name}</span>

            </nav>

            <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-bold text-primary dark:text-blue-500 relative overflow-hidden group">
                    {leagueTrans.league.logoUrl ? (
                        <Image
                            src={leagueTrans.league.logoUrl}
                            alt={leagueTrans.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        leagueTrans.league.country.substring(0, 2).toUpperCase()
                    )}
                </div>
                <div>


                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{leagueTrans.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{leagueTrans.league.country}</p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Mock Standings (Visual Only) */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="font-bold text-slate-900 dark:text-white">{t.ui.leagueStandings}</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse">{t.ui.liveTable}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-start ltr:text-left rtl:text-right">
                                <thead className="text-[10px] uppercase bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-black tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-center">{t.ui.tablePos}</th>
                                        <th className="px-6 py-4">{t.ui.tableTeam}</th>
                                        <th className="px-4 py-4 text-center">{t.ui.tableMP}</th>
                                        <th className="px-4 py-4 text-center">{t.ui.tableW}</th>
                                        <th className="px-4 py-4 text-center">{t.ui.tableD}</th>
                                        <th className="px-4 py-4 text-center">{t.ui.tableL}</th>
                                        <th className="px-4 py-4 text-center">{t.ui.tablePts}</th>
                                        <th className="px-6 py-4 text-center hidden sm:table-cell">{t.ui.tableForm}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {[
                                        { p: 1, t: 'Arsenal', mp: 24, w: 18, d: 4, l: 2, pts: 58, f: ['w', 'w', 'w', 'd', 'w'] },
                                        { p: 2, t: 'Man City', mp: 23, w: 17, d: 4, l: 2, pts: 55, f: ['w', 'w', 'l', 'w', 'w'] },
                                        { p: 3, t: 'Liverpool', mp: 24, w: 15, d: 7, l: 2, pts: 52, f: ['d', 'w', 'w', 'w', 'd'] },
                                        { p: 4, t: 'Aston Villa', mp: 24, w: 14, d: 4, l: 6, pts: 46, f: ['l', 'w', 'w', 'l', 'w'] },
                                        { p: 5, t: 'Tottenham', mp: 24, w: 13, d: 5, l: 6, pts: 44, f: ['w', 'd', 'l', 'w', 'd'] },
                                    ].map((row) => (
                                        <tr key={row.p} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className={`px-6 py-4 text-center font-black ${row.p <= 4 ? 'text-blue-600 border-l-4 border-blue-600' : 'text-slate-400 border-l-4 border-transparent'}`}>{row.p}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white ${['bg-red-600', 'bg-sky-400', 'bg-red-700', 'bg-purple-800', 'bg-slate-900'][row.p - 1]}`}>
                                                    {row.t.substring(0, 1)}
                                                </div>
                                                {row.t}
                                            </td>
                                            <td className="px-4 py-4 text-center text-slate-500">{row.mp}</td>
                                            <td className="px-4 py-4 text-center text-slate-500">{row.w}</td>
                                            <td className="px-4 py-4 text-center text-slate-500">{row.d}</td>
                                            <td className="px-4 py-4 text-center text-slate-500">{row.l}</td>
                                            <td className="px-4 py-4 text-center font-black text-slate-900 dark:text-white">{row.pts}</td>
                                            <td className="px-6 py-4 text-center hidden sm:flex gap-1 justify-center">
                                                {row.f.map((r, i) => (
                                                    <span key={i} className={`w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black uppercase text-white ${r === 'w' ? 'bg-green-500' : r === 'd' ? 'bg-slate-400' : 'bg-red-500'
                                                        }`}>{r}</span>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 text-center bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700">
                                <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">{t.ui.viewFullTable}</button>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Matches Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="font-bold text-slate-900 dark:text-white">{t.ui.upcomingMatches}</h2>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {leagueTrans.league.matches.map((match: any) => {
                                const matchTrans = match.translations[0];
                                if (!matchTrans) return null;
                                return (
                                    <Link
                                        key={match.id}
                                        href={`/${lang}/league/${leagueSlug}/${matchTrans.slug}`}
                                        className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group"
                                    >
                                        <div className="flex-1 grid grid-cols-3 items-center">
                                            <div className="flex items-center justify-end gap-3 text-right">
                                                <div className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-blue-400 transition">{match.homeTeam}</div>
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center text-xs font-black">
                                                    {match.homeTeamLogo ? (
                                                        <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-cover" />
                                                    ) : (
                                                        match.homeTeam.substring(0, 1)
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-center px-4">
                                                <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] py-1 px-3 rounded-full inline-block font-bold uppercase tracking-widest">
                                                    {new Date(match.date).toLocaleDateString(lang, { day: '2-digit', month: 'short' })}
                                                </div>
                                                <div className="font-mono text-xl mt-1 text-slate-900 dark:text-white opacity-20">VS</div>
                                            </div>

                                            <div className="flex items-center justify-start gap-3 text-left">
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center text-xs font-black">
                                                    {match.awayTeamLogo ? (
                                                        <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-cover" />
                                                    ) : (
                                                        match.awayTeam.substring(0, 1)
                                                    )}
                                                </div>
                                                <div className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-blue-400 transition">{match.awayTeam}</div>
                                            </div>
                                        </div>

                                        {match.prediction && (
                                            <div className="mx-8 flex flex-col items-end gap-2">
                                                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest shadow-lg leading-none">
                                                    {translateTip(match.mainTip || "Home Win")}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{match.confidence || 75}% {t.ui.confidence}</span>
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                            {leagueTrans.league.matches.length === 0 && (
                                <div className="p-12 text-center text-slate-400 dark:text-slate-500">{t.ui.noPredictions}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white sticky top-24 shadow-2xl">
                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">{t.ui.expertTipHub}</div>
                        <h3 className="text-2xl font-black leading-tight mb-4 text-white">{t.ui.winMoreOn} {leagueTrans.name}</h3>
                        <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">{t.ui.proDescription}</p>
                        <button className="w-full py-4 bg-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">{t.ui.getProPredictions}</button>
                    </div>

                    <div className="p-8 border border-slate-200 dark:border-slate-700 rounded-[2rem] bg-white dark:bg-slate-800">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{t.ui.leagueStats}</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-600 dark:text-slate-300">{t.ui.avgGoals}</span>
                                <span className="text-slate-900 dark:text-white">2.84</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-600 dark:text-slate-300">{t.ui.homeWinPct}</span>
                                <span className="text-slate-900 dark:text-white">45%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-600 dark:text-slate-300">{t.ui.bttsPct}</span>
                                <span className="text-blue-600">58%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
