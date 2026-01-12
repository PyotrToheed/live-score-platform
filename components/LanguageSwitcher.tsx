"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function LanguageSwitcher({ currentLang, languages }: { currentLang: string, languages: any[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (newLang: string) => {
        // Get path segments, filter out empty strings
        const pathSegments = pathname.split('/').filter(Boolean);

        // Replace the first segment (language code) with the new language
        if (pathSegments.length > 0) {
            pathSegments[0] = newLang;
        } else {
            pathSegments.push(newLang);
        }

        const newPath = '/' + pathSegments.join('/');
        router.push(newPath);
        setIsOpen(false);
    };

    const activeLang = languages.find(l => l.code === currentLang) || { name: 'English', code: 'en' };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"

            >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-600">
                    {activeLang.code}
                </span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 ltr:right-0 rtl:left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in duration-200">

                    <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-700">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            {activeLang.code === 'en' ? 'Select Language' :
                                activeLang.code === 'fa' ? 'انتخاب زبان' :
                                    activeLang.code === 'ar' ? 'اختر اللغة' : 'Select Language'}
                        </span>

                    </div>
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full text-start px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between group ${currentLang === lang.code ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}

                        >
                            <span>
                                {lang.code === 'en' ? 'English' :
                                    lang.code === 'fa' ? 'فارسی' :
                                        lang.code === 'ar' ? 'العربية' : lang.name}
                            </span>
                            {currentLang === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
