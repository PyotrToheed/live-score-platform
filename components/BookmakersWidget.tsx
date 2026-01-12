import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

interface BookmakersWidgetProps {
    lang: string;
}

export default async function BookmakersWidget({ lang }: BookmakersWidgetProps) {
    const t = getDictionary(lang);

    const bookmakers = await prisma.bookmaker.findMany({
        include: {
            translations: {
                where: { languageCode: lang }
            }
        },
        orderBy: { rating: 'desc' },
        take: 3
    });

    // If no translation for current lang, fallback to English
    const getTranslation = (bm: any) => {
        return bm.translations[0] || bm.translations.find((t: any) => t.languageCode === 'en') || null;
    };

    if (bookmakers.length === 0) {
        return null;
    }

    return (
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                {t.bookmakers?.title || "Recommended Bookmakers"}
            </h3>
            <div className="space-y-3">
                {bookmakers.map((bm) => {
                    const trans = getTranslation(bm);
                    if (!trans) return null;

                    return (
                        <Link
                            key={bm.id}
                            href={trans.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                {bm.logoUrl && (
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                                        <Image
                                            src={bm.logoUrl}
                                            alt={trans.name}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-bold truncate">{trans.name}</div>
                                    <div className="text-blue-200 text-sm truncate">{trans.bonusText}</div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                                        ★ {bm.rating.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <span className="inline-block bg-green-500 hover:bg-green-400 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors group-hover:scale-105 transform">
                                    {t.bookmakers?.visit || "Visit Site"} →
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
