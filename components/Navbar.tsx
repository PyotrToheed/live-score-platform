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
            <button className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-600 ${activeMenu === id ? 'text-blue-600' : 'text-slate-400 dark:text-slate-300'}`}>
                <span>{title}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === id ? 'rotate-180' : ''}`} />
            </button>

            {activeMenu === id && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 w-[600px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden mt-2 p-8">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <header className="glass dark:bg-slate-900/80 dark:border-slate-700/50 fixed top-0 left-0 right-0 z-[100] border-b border-slate-200/50 h-20 flex items-center">
            <div className="container mx-auto px-4 flex items-center justify-between h-full">
                <Link href={`/${lang}`} className="relative h-12 w-48 transition-transform hover:scale-105 duration-300">
                    <Image
                        src="/logo.png"
                        alt="LiveBaz Logo"
                        fill
                        className="object-contain ltr:object-left rtl:object-right"
                        priority
                    />
                </Link>

                <nav className="hidden lg:flex items-center gap-10 h-full">
                    <MenuItem title={t.nav.predictions || "Predictions"} id="predictions">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-100 pb-2">{t.ui.bySport}</h4>
                                <div className="space-y-4">
                                    <Link href={`/${lang}/predictions?sport=football`} className="flex items-center gap-3 group/item text-start">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover/item:bg-blue-600 transition-colors">
                                            <Trophy className="w-4 h-4 text-blue-600 group-hover/item:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover/item:text-blue-600">{t.ui.bettingTips}</div>
                                            <div className="text-[10px] text-slate-400">Expert analysis & tips</div>
                                        </div>
                                    </Link>
                                    <Link href={`/${lang}/predictions?sport=basketball`} className="flex items-center space-x-3 group/item">
                                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg group-hover/item:bg-orange-600 transition-colors">
                                            <Zap className="w-4 h-4 text-orange-600 group-hover/item:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover/item:text-orange-600">Basketball Predictions</div>
                                            <div className="text-[10px] text-slate-400">NBA, EuroLeague & more</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">{t.ui.quickAccess}</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <Link href={`/${lang}/predictions?type=top`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center">
                                        <TrendingUp className="w-3 h-3 me-2" /> Daily Top Tips
                                    </Link>
                                    <Link href={`/${lang}/predictions?type=banker`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center">
                                        <Target className="w-3 h-3 me-2" /> Banker of the Day
                                    </Link>
                                    <Link href={`/${lang}/predictions?type=results`} className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center">
                                        <History className="w-3 h-3 me-2" /> Recent Results
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </MenuItem>

                    <MenuItem title={t.footer.leagues || "Leagues"} id="leagues">
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-100 pb-2">Popular Leagues</h4>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Premier League', slug: 'premier-league', flag: 'EN' },
                                        { name: 'La Liga', slug: 'la-liga', flag: 'ES' },
                                        { name: 'Serie A', slug: 'serie-a', flag: 'IT' },
                                        { name: 'Bundesliga', slug: 'bundesliga', flag: 'DE' },
                                        { name: 'Ligue 1', slug: 'ligue-1', flag: 'FR' }
                                    ].map(league => (
                                        <Link key={league.slug} href={`/${lang}/league/${league.slug}`} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group/l">
                                            <span className="text-xs">{league.flag}</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/l:text-blue-600">{league.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">{t.ui.internationals}</h4>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Champions League', slug: 'champions-league', icon: Trophy },
                                        { name: 'Europa League', slug: 'europa-league', icon: Shield },
                                        { name: 'World Cup', slug: 'world-cup', icon: Globe },
                                        { name: 'AFC Asian Cup', slug: 'afc-asian-cup', icon: Star }
                                    ].map(intl => (
                                        <Link key={intl.name} href={`/${lang}/league/${intl.slug}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group/i">
                                            <intl.icon className="w-4 h-4 text-slate-400 group-hover/i:text-blue-600" />
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/i:text-blue-600">{intl.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </MenuItem>

                    <MenuItem title={t.ui.bettingTips} id="tips">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">{t.ui.mainMarkets}</h4>
                                <div className="flex flex-col space-y-2">
                                    <Link href={`/${lang}/predictions?type=1x2`} className="text-xs font-bold hover:text-blue-600">Betting Tips 1x2</Link>
                                    <Link href={`/${lang}/predictions?type=over-under`} className="text-xs font-bold hover:text-blue-600">Over/Under 2.5</Link>
                                    <Link href={`/${lang}/predictions?type=btts`} className="text-xs font-bold hover:text-blue-600">BTTS Predictions</Link>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center sm:text-left">Specialty</h4>
                                <div className="flex flex-col space-y-2">
                                    <Link href={`/${lang}/predictions?type=asian-handicap`} className="text-xs font-bold hover:text-blue-600">Asian Handicap</Link>
                                    <Link href={`/${lang}/predictions?type=corners`} className="text-xs font-bold hover:text-blue-600">Corners Prediction</Link>
                                    <Link href={`/${lang}/predictions?type=cards`} className="text-xs font-bold hover:text-blue-600">Cards Prediction</Link>
                                </div>
                            </div>
                            <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col justify-between">
                                <div className="text-lg font-black italic leading-tight uppercase">{t.ui.proHook}</div>
                                <button className="mt-4 bg-white text-blue-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                    {t.ui.upgradePro}
                                </button>
                            </div>
                        </div>
                    </MenuItem>

                    <MenuItem title={t.nav.articles || "Articles"} id="articles">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-100 pb-2">Latest Insights</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <Link href={`/${lang}/blog`} className="group/a">
                                    <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                                        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                                        <div className="absolute inset-0 bg-blue-600/10 group-hover/a:bg-blue-600/0 transition-colors" />
                                    </div>
                                    <div className="text-sm font-bold line-clamp-2 group-hover/a:text-blue-600 transition-colors">Transfer Rumors: Big moves expected in January</div>
                                </Link>
                                <div className="space-y-3">
                                    <Link href="#" className="block text-xs font-bold hover:text-blue-600 border-l-2 border-slate-100 pl-3">Top 5 Prediction Strategies</Link>
                                    <Link href="#" className="block text-xs font-bold hover:text-blue-600 border-l-2 border-slate-100 pl-3">Interview with Expert X</Link>
                                    <Link href={`/${lang}/blog`} className="block text-xs font-bold text-blue-600 hover:underline">View All Articles →</Link>
                                </div>
                            </div>
                        </div>
                    </MenuItem>
                </nav>

                <div className="flex items-center gap-6">
                    {children}

                    <Link href="/admin/dashboard" className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300 hover:text-blue-600 transition-colors">
                        <LayoutDashboard className="w-3.5 h-3.5 me-2" />
                        {t.nav.admin}
                    </Link>

                    <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center">
                        <Crown className="w-3.5 h-3.5 me-2" />
                        {t.ui.pro}
                    </button>
                </div>
            </div>
        </header>
    );
}
