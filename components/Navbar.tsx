"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Trophy, Globe, Zap, Newspaper, Shield, Star, LayoutDashboard, Crown, Target, Activity, BarChart3, TrendingUp, History, User } from "lucide-react";

interface NavbarProps {
    lang: string;
    t: any;
    languages: any[];
    children?: React.ReactNode; // For ThemeToggle and LanguageSwitcher
}

export default function Navbar({ lang, t, languages, children }: NavbarProps) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (menu: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveMenu(null);
        }, 150);
    };

    const MenuItem = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
        <div
            className="group relative h-full flex items-center"
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={handleMouseLeave}
        >
            <button className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative ${activeMenu === id ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'}`}>
                <span>{title}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${activeMenu === id ? 'rotate-180 text-blue-600' : 'text-slate-300'}`} />
                <div className={`absolute -bottom-[25px] left-0 right-0 h-1 bg-blue-600 rounded-t-full transition-all duration-300 ${activeMenu === id ? 'opacity-100' : 'opacity-0 translate-y-2'}`} />
            </button>

            {activeMenu === id && (
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 pt-0 w-[640px] animate-fade-up">
                    <div className="bg-white dark:bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-3xl border border-slate-200/60 dark:border-slate-800 overflow-hidden p-10">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <header className="glass fixed top-0 left-0 right-0 z-[100] h-20 flex items-center">
            <div className="container mx-auto px-6 flex items-center justify-between h-full">
                <Link href={`/${lang}`} className="relative h-10 w-44 transition-all hover:scale-[1.02] active:scale-[0.98] duration-300">
                    <Image
                        src="/logo.png"
                        alt="LiveBaz Logo"
                        fill
                        className="object-contain ltr:object-left rtl:object-right"
                        priority
                    />
                </Link>

                <nav className="hidden lg:flex items-center gap-12 h-full">
                    <MenuItem title={t.nav.predictions || "Predictions"} id="predictions">
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 dark:border-blue-900/30 pb-3">{t.ui.bySport}</h4>
                                <div className="space-y-5">
                                    <Link href={`/${lang}/predictions?sport=football`} className="flex items-center gap-4 group/item text-start">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover/item:bg-blue-600 transition-all duration-300 shadow-sm">
                                            <Trophy className="w-5 h-5 text-blue-600 group-hover/item:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-900 dark:text-white group-hover/item:text-blue-600 transition-colors uppercase tracking-tight">{t.ui.bettingTips}</div>
                                            <div className="text-[11px] text-slate-400 font-medium">Expert football analysis</div>
                                        </div>
                                    </Link>
                                    <Link href={`/${lang}/predictions?sport=basketball`} className="flex items-center gap-4 group/item text-start">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover/item:bg-blue-600 transition-all duration-300 shadow-sm">
                                            <Zap className="w-5 h-5 text-slate-400 group-hover/item:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-900 dark:text-white group-hover/item:text-blue-600 transition-colors uppercase tracking-tight">Basketball Tips</div>
                                            <div className="text-[11px] text-slate-400 font-medium">NBA & EuroLeague insights</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800 pb-3">{t.ui.quickAccess}</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <Link href={`/${lang}/predictions?type=top`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                        <TrendingUp className="w-4 h-4 text-blue-500" /> Daily Top Tips
                                    </Link>
                                    <Link href={`/${lang}/predictions?type=banker`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                        <Target className="w-4 h-4 text-red-500" /> Banker of the Day
                                    </Link>
                                    <Link href={`/${lang}/predictions?type=results`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                        <History className="w-4 h-4 text-slate-400" /> Recent Results
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </MenuItem>

                    <MenuItem title={t.footer.leagues || "Leagues"} id="leagues">
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 dark:border-blue-900/30 pb-3">Popular Leagues</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { name: 'Premier League', slug: 'premier-league', flag: '🇬🇧' },
                                        { name: 'La Liga', slug: 'la-liga', flag: '🇪🇸' },
                                        { name: 'Serie A', slug: 'serie-a', flag: '🇮🇹' },
                                        { name: 'Bundesliga', slug: 'bundesliga', flag: '🇩🇪' },
                                        { name: 'Ligue 1', slug: 'ligue-1', flag: '🇫🇷' }
                                    ].map(league => (
                                        <Link key={league.slug} href={`/${lang}/league/${league.slug}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group/l">
                                            <span className="text-lg opacity-80 group-hover/l:opacity-100 transition-opacity grayscale group-hover/l:grayscale-0">{league.flag}</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/l:text-blue-600">{league.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800 pb-3">{t.ui.internationals}</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { name: 'Champions League', slug: 'champions-league', icon: Trophy, color: 'text-yellow-500' },
                                        { name: 'Europa League', slug: 'europa-league', icon: Shield, color: 'text-blue-400' },
                                        { name: 'World Cup', slug: 'world-cup', icon: Globe, color: 'text-green-500' },
                                        { name: 'AFC Asian Cup', slug: 'afc-asian-cup', icon: Star, color: 'text-red-400' }
                                    ].map(intl => (
                                        <Link key={intl.name} href={`/${lang}/league/${intl.slug}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group/i">
                                            <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 group-hover/i:border-blue-200 transition-all ${intl.color}`}>
                                                <intl.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/i:text-blue-600">{intl.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </MenuItem>

                    <MenuItem title={t.ui.bettingTips} id="tips">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 pb-2 border-b border-blue-50 dark:border-blue-900/20">{t.ui.mainMarkets}</h4>
                                <div className="flex flex-col space-y-4">
                                    <Link href={`/${lang}/predictions?type=1x2`} className="text-xs font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">Betting Tips 1x2</Link>
                                    <Link href={`/${lang}/predictions?type=over-under`} className="text-xs font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">Over/Under 2.5</Link>
                                    <Link href={`/${lang}/predictions?type=btts`} className="text-xs font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">BTTS Predictions</Link>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-50 dark:border-slate-800">Specialty</h4>
                                <div className="flex flex-col space-y-4">
                                    <Link href={`/${lang}/predictions?type=asian-handicap`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Asian Handicap</Link>
                                    <Link href={`/${lang}/predictions?type=corners`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Corners Prediction</Link>
                                    <Link href={`/${lang}/predictions?type=cards`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Cards Prediction</Link>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-500/20 relative overflow-hidden group/pro">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover/pro:scale-150 transition-transform duration-700" />
                                <div className="text-xl font-black italic leading-tight uppercase relative z-10">{t.ui.proHook}</div>
                                <button className="mt-6 bg-white text-blue-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-lg active:scale-95 relative z-10">
                                    {t.ui.upgradePro}
                                </button>
                            </div>
                        </div>
                    </MenuItem>

                    <MenuItem title={t.nav.articles || "Articles"} id="articles">
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 dark:border-blue-900/30 pb-3">Latest Insights</h4>
                            <div className="grid grid-cols-2 gap-10">
                                <Link href={`/${lang}/blog`} className="group/a block">
                                    <div className="relative h-32 rounded-3xl overflow-hidden mb-4 shadow-md">
                                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800" />
                                        <div className="absolute inset-0 bg-blue-600/5 group-hover/a:bg-blue-600/0 transition-all duration-500" />
                                        <div className="absolute bottom-4 left-4">
                                            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[8px] font-black uppercase tracking-widest text-blue-600">Featured</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-black uppercase leading-snug line-clamp-2 group-hover/a:text-blue-600 transition-colors tracking-tight">Transfer Rumors: Big moves expected in January</div>
                                </Link>
                                <div className="space-y-5">
                                    <Link href="#" className="block text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1 hover:border-blue-600">Top 5 Prediction Strategies</Link>
                                    <Link href="#" className="block text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1 hover:border-blue-600">Interview with Expert Analysts</Link>
                                    <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all pt-2">
                                        View All News <ChevronDown className="w-3 h-3 -rotate-90" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </MenuItem>
                </nav>

                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 sm:gap-4 border-r border-slate-200 dark:border-slate-800 pe-4 sm:pe-6 h-8">
                        {children}
                    </div>

                    <Link
                        href="/admin/dashboard"
                        title={t.nav.admin}
                        className="flex items-center p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                    >
                        <LayoutDashboard className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </Link>

                    <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 hidden sm:flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5" />
                        {t.ui.pro}
                    </button>

                    <button className="lg:hidden p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                        <Activity className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
