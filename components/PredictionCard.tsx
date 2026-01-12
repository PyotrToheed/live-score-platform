import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n";

interface PredictionCardProps {
    lang: string;
    match: {
        id: string;
        homeTeam: string;
        awayTeam: string;
        homeTeamLogo?: string | null;
        awayTeamLogo?: string | null;
        date: Date | string;
        mainTip?: string | null;
        confidence?: number | null;
        prediction?: {
            winProbHome: number;
            winProbAway: number;
            winProbDraw: number;
        } | null;
        translations: Array<{
            slug: string;
            name: string;
        }>;
    };
}

export default function PredictionCard({ lang, match }: PredictionCardProps) {
    const t = getDictionary(lang);
    const translation = match.translations[0];
    if (!translation) return null;

    const translateTip = (tip: string | null | undefined) => {
        if (!tip) return "";
        const lower = tip.toLowerCase();
        if (lower.includes('home win')) return lang === 'fa' ? 'برد میزبان' : lang === 'ar' ? 'فوز صاحب الأرض' : 'Home Win';
        if (lower.includes('away win')) return lang === 'fa' ? 'برد میهمان' : lang === 'ar' ? 'فوز الضيف' : 'Away Win';
        if (lower.includes('draw')) return lang === 'fa' ? 'مساوی' : lang === 'ar' ? 'تعادل' : 'Draw';
        if (lower.includes('btts')) return lang === 'fa' ? 'گلزنی هر دو تیم' : lang === 'ar' ? 'كلا الفريقين يسجل' : 'BTTS Yes';
        return tip;
    };

    return (
        <Link
            href={`/${lang}/league/any/${translation.slug}`}
            className="group block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                        {new Date(match.date).toLocaleDateString(lang, { day: '2-digit', month: 'short' })} • {new Date(match.date).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {match.confidence && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{match.confidence}% {t.ui.confidence}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex-1 flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-xl relative overflow-hidden flex items-center justify-center text-xs font-black border border-slate-100 dark:border-slate-600">
                            {match.homeTeamLogo ? (
                                <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-cover" />
                            ) : match.homeTeam.substring(0, 1)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{match.homeTeam}</span>
                    </div>

                    <div className="text-xs font-black text-slate-300 dark:text-slate-600 italic">VS</div>

                    <div className="flex-1 flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-xl relative overflow-hidden flex items-center justify-center text-xs font-black border border-slate-100 dark:border-slate-600">
                            {match.awayTeamLogo ? (
                                <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-cover" />
                            ) : match.awayTeam.substring(0, 1)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{match.awayTeam}</span>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        <span>{t.ui.prediction}</span>
                        <span className="text-blue-600 dark:text-blue-400">{t.ui.market1x2}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg text-center">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">1</div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{match.prediction?.winProbHome || '33'}%</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg text-center">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">X</div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{match.prediction?.winProbDraw || '34'}%</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg text-center">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">2</div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{match.prediction?.winProbAway || '33'}%</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{t.ui.bestPick}</span>
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none mt-1">
                            {translateTip(match.mainTip || "Home Win")}
                        </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
