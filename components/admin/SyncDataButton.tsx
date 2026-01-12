"use client";

import { useState } from "react";
import { syncFixtures } from "@/lib/actions/sync-actions";
import { SOCCER_SPORTS } from "@/lib/odds-api";

export default function SyncDataButton() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [selectedSport, setSelectedSport] = useState(SOCCER_SPORTS.EPL);

    const handleSync = async () => {
        setLoading(true);
        setResult(null);

        try {
            const syncResult = await syncFixtures(selectedSport);
            setResult(syncResult);
        } catch (err: any) {
            setResult({ success: false, errors: [err.message] });
        } finally {
            setLoading(false);
        }
    };

    const sports = [
        { key: SOCCER_SPORTS.EPL, name: "Premier League" },
        { key: SOCCER_SPORTS.LA_LIGA, name: "La Liga" },
        { key: SOCCER_SPORTS.BUNDESLIGA, name: "Bundesliga" },
        { key: SOCCER_SPORTS.SERIE_A, name: "Serie A" },
        { key: SOCCER_SPORTS.LIGUE_1, name: "Ligue 1" },
        { key: SOCCER_SPORTS.CHAMPIONS_LEAGUE, name: "Champions League" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                Sync Live Data
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Select League</label>
                    <select
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2"
                        disabled={loading}
                    >
                        {sports.map((sport) => (
                            <option key={sport.key} value={sport.key}>
                                {sport.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleSync}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${loading
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Syncing...
                        </span>
                    ) : (
                        '🚀 Sync Fixtures & Odds'
                    )}
                </button>

                {result && (
                    <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {result.success ? (
                            <div className="space-y-2">
                                <div className="text-green-700 font-bold">✅ Sync Complete!</div>
                                <div className="text-sm text-green-600">
                                    <div>Created: {result.created} matches</div>
                                    <div>Updated: {result.updated} matches</div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="text-red-700 font-bold">❌ Sync Failed</div>
                                {result.errors?.map((err: string, i: number) => (
                                    <div key={i} className="text-sm text-red-600">{err}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-400 mt-4">
                Pulls latest fixtures and odds from The Odds API. Creates new matches or updates existing predictions.
            </p>
        </div>
    );
}
