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

    // We assume the first league translation slug is the leagueSlug for routing
    // In a real scenario, we'd include the league object in the props
    const leagueSlug = "any";

    const translateTip = (tip: string | null | undefined) => {
        if (!tip) return "";
        const lower = tip.toLowerCase();
        if (lower.includes('home win')) return lang === 'fa' ? 'برد میزبان' : lang === 'ar' ? 'فوز صاحب الأرض' : 'Home Win';
        if (lower.includes('away win')) return lang === 'fa' ? 'برد میهمان' : lang === 'ar' ? 'فوز الضيف' : 'Away Win';
        if (lower.includes('draw')) return lang === 'fa' ? 'مساوی' : lang === 'ar' ? 'تعادل' : 'Draw';
        if (lower.includes('btts')) return lang === 'fa' ? 'گلزنی هر دو تیم' : lang === 'ar' ? 'كلا الفريقين يسجل' : 'BTTS';
        return tip;
    };

    return (
        <Link
            href={`/${lang}/league/${leagueSlug}/${translation.slug}`}
            className="group block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 shadow-sm"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] border border-blue-100/50 dark:border-blue-800/50">
                        {new Date(match.date).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {match.confidence && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50/50 dark:bg-green-900/10 rounded-full border border-green-100/50 dark:border-green-900/20">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-[9px] font-black text-green-600/80 dark:text-green-400/80 uppercase tracking-widest">{match.confidence}%</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-6 mb-8 group-hover:scale-[1.02] transition-transform duration-500 px-2">
                    <div className="flex-1 flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-50 dark:border-slate-700 shadow-sm transition-shadow group-hover:shadow-md">
                            {match.homeTeamLogo ? (
                                <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain p-2" />
                            ) : <span className="font-black text-slate-300 italic">{match.homeTeam.substring(0, 2)}</span>}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 italic">{match.homeTeam}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <div className="text-[10px] font-black text-slate-200 dark:text-slate-800 uppercase tracking-widest">VS</div>
                        <div className="w-px h-6 bg-gradient-to-b from-slate-100 to-transparent dark:from-slate-800" />
                    </div>

                    <div className="flex-1 flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-50 dark:border-slate-700 shadow-sm transition-shadow group-hover:shadow-md">
                            {match.awayTeamLogo ? (
                                <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain p-2" />
                            ) : <span className="font-black text-slate-300 italic">{match.awayTeam.substring(0, 2)}</span>}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 italic">{match.awayTeam}</span>
                    </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 mb-6 border border-slate-100/50 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                        <span className="opacity-60">{t.ui.prediction}</span>
                        <div className="flex items-baseline gap-1">
                            <div className="w-1 h-1 bg-blue-600 rounded-full" />
                            <span className="text-blue-600 dark:text-blue-400">{t.ui.market1x2}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {[
                            { label: '1', prob: match.prediction?.winProbHome || 33 },
                            { label: 'X', prob: match.prediction?.winProbDraw || 34 },
                            { label: '2', prob: match.prediction?.winProbAway || 33 }
                        ].map((item, i) => (
                            <div key={i} className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 py-2 rounded-xl text-center relative overflow-hidden group/item">
                                <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-700" style={{ width: `${item.prob}%` }} />
                                <div className="text-[8px] text-slate-400 font-black uppercase tracking-tighter mb-0.5">{item.label}</div>
                                <div className="text-xs font-black text-slate-900 dark:text-white italic tracking-tighter">{item.prob}%</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50 dark:border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500/60 dark:text-blue-400/40">{t.ui.bestPick}</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mt-1.5 italic group-hover:text-blue-600 transition-colors">
                            {translateTip(match.mainTip || "Home Win")}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center scale-90 group-hover:scale-100 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-blue-600/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
