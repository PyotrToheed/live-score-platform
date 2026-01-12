"use client";

import { useEffect, useState } from "react";

interface LiveMatch {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    time: string;
    status: 'LIVE' | 'HALFTIME' | 'FINISHED' | 'SCHEDULED';
}

// Fallback mock data when API is unavailable
const mockLiveMatches: LiveMatch[] = [
    { id: '1', homeTeam: 'Chelsea', awayTeam: 'Arsenal', homeScore: 1, awayScore: 1, time: "65'", status: 'LIVE' },
    { id: '2', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 2, awayScore: 0, time: "HT", status: 'HALFTIME' },
    { id: '3', homeTeam: 'Liverpool', awayTeam: 'Man City', homeScore: 0, awayScore: 0, time: "12'", status: 'LIVE' },
    { id: '4', homeTeam: 'PSG', awayTeam: 'Marseille', homeScore: 3, awayScore: 1, time: "88'", status: 'LIVE' },
];

export default function LiveTicker({ lang, t }: { lang: string, t: any }) {
    const [matches, setMatches] = useState<LiveMatch[]>(mockLiveMatches);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const fetchLiveScores = async () => {
            try {
                const res = await fetch('/api/live-scores', { next: { revalidate: 30 } });
                const data = await res.json();

                if (data.success && data.data?.length > 0) {
                    const liveMatches: LiveMatch[] = data.data.map((game: any) => ({
                        id: game.id,
                        homeTeam: game.home_team,
                        awayTeam: game.away_team,
                        homeScore: game.scores?.find((s: any) => s.name === game.home_team)?.score || 0,
                        awayScore: game.scores?.find((s: any) => s.name === game.away_team)?.score || 0,
                        time: game.completed ? t.ui.finished : t.ui.live,
                        status: game.completed ? 'FINISHED' : 'LIVE',
                    }));
                    setMatches(liveMatches);
                    setIsLive(true);
                }
            } catch (err) {
                console.warn('Failed to fetch live scores, using mock data');
            }
        };

        fetchLiveScores();
        // Refresh every 30 seconds
        const interval = setInterval(fetchLiveScores, 30000);
        return () => clearInterval(interval);
    }, []);

    const translateTime = (match: LiveMatch) => {
        if (match.status === 'FINISHED') return t.ui.finished;
        if (match.status === 'HALFTIME') return t.ui.halftime;
        if (match.status === 'LIVE') {
            if (match.time.includes("'")) {
                const mins = match.time.replace("'", "");
                return lang === 'en' ? `${mins}'` : `${mins}'`; // Minutes suffix is generally universal in sports
            }
            return t.ui.live;
        }
        return match.time;
    };

    return (
        <div className="bg-slate-900 text-white w-full overflow-hidden border-y border-white/5 py-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />

            {/* Live indicator */}
            {isLive && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{t.ui.live}</span>
                </div>
            )}

            <div className="flex items-center gap-12 animate-scroll whitespace-nowrap px-8 ml-16">
                {/* Double the list for seamless loop */}
                {[...matches, ...matches].map((match, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 px-4 py-1.5 rounded-lg transition-colors">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${match.status === 'LIVE' ? 'bg-red-600 animate-pulse' :
                            match.status === 'HALFTIME' ? 'bg-yellow-600' :
                                'bg-slate-700'
                            }`}>
                            {translateTime(match)}
                        </span>
                        <div className="flex items-center gap-3 font-bold text-sm">
                            <span className="text-slate-100">{match.homeTeam}</span>
                            <div className="bg-blue-600 px-2 py-0.5 rounded font-black tabular-nums min-w-[3rem] text-center">
                                {match.homeScore} : {match.awayScore}
                            </div>
                            <span className="text-slate-100">{match.awayTeam}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
