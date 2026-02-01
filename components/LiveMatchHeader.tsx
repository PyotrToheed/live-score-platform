"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";

interface LiveMatchHeaderProps {
    matchId: string;
    initialData: {
        status: string;
        homeScore: number | null;
        awayScore: number | null;
        minute: number | null;
        date: Date;
        homeTeam: string;
        awayTeam: string;
        homeTeamLogo: string | null;
        awayTeamLogo: string | null;
    };
    lang: string;
    t: any;
}

export default function LiveMatchHeader({ matchId, initialData, lang, t }: LiveMatchHeaderProps) {
    const [match, setMatch] = useState(initialData);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        // Check if match is live or starting soon to enable polling
        const matchTime = new Date(match.date).getTime();
        const now = Date.now();
        const isLiveOrSoon = (now >= matchTime - 3600000) && (match.status !== 'FINISHED'); // 1 hour before

        setIsLive(isLiveOrSoon);

        if (isLiveOrSoon) {
            const interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/match/${matchId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setMatch(prev => ({ ...prev, ...data }));
                    }
                } catch (error) {
                    console.error("Polling error", error);
                }
            }, 30000); // Poll every 30 seconds

            return () => clearInterval(interval);
        }
    }, [matchId, match.date, match.status]);

    const isMatchLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || !!match.minute;

    return (
        <div className="premium-card p-12 bg-slate-900 text-white overflow-hidden relative border-b-8 border-blue-600">
            <div className="absolute top-0 end-0 w-96 h-96 bg-blue-600/10 blur-[120px] -me-48 -mt-48 rounded-full" />

            {/* Live Indicator Pulse */}
            {isMatchLive && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-600/20 rounded-full border border-red-500/30 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-[10px] font-black uppercase text-red-500">Live Updates On</span>
                </div>
            )}

            <div className="relative z-10 flex items-center justify-between gap-8 text-center">
                <div className="flex-1 space-y-4">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black border border-white/10 relative overflow-hidden group">
                        {match.homeTeamLogo ? (
                            <Image
                                src={match.homeTeamLogo}
                                alt={match.homeTeam}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            match.homeTeam.substring(0, 1)
                        )}
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">{match.homeTeam}</h1>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-4">
                            {isMatchLive ? (
                                <div className="px-3 py-1 bg-red-600 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                                    {t.ui?.live || "LIVE"}
                                </div>
                            ) : (
                                <div className="px-3 py-1 bg-slate-700 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">
                                    {match.status}
                                </div>
                            )}

                            {match.minute && (
                                <div className="text-blue-500 text-xs font-black tabular-nums">
                                    {match.minute}&apos;
                                </div>
                            )}
                        </div>
                        <div className="text-7xl font-black tracking-tighter tabular-nums flex items-center justify-center gap-6">
                            <span className="text-blue-500 transition-all duration-300">{match.homeScore ?? '0'}</span>
                            <span className="text-2xl opacity-20 italic">VS</span>
                            <span className="text-blue-500 transition-all duration-300">{match.awayScore ?? '0'}</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        {new Date(match.date).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })} • {new Date(match.date).toLocaleDateString(lang, { day: '2-digit', month: 'short' })}
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black border border-white/10 relative overflow-hidden group">
                        {match.awayTeamLogo ? (
                            <Image
                                src={match.awayTeamLogo}
                                alt={match.awayTeam}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            match.awayTeam.substring(0, 1)
                        )}
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">{match.awayTeam}</h1>
                </div>
            </div>
        </div>
    );
}
