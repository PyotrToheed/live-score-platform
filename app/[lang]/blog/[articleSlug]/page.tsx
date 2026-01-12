import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { generatePageMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import ShareButtons from "@/components/ShareButtons";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, articleSlug: string }> }) {
    const { lang, articleSlug } = await params;

    // Find article by any slug, then get the translation for the requested language
    const slugTrans = await prisma.articleTranslation.findUnique({
        where: { slug: articleSlug },
        select: { articleId: true }
    });

    if (!slugTrans) return {};

    const articleTrans = await prisma.articleTranslation.findFirst({
        where: { articleId: slugTrans.articleId, languageCode: lang },
        include: { seo: true }
    });

    if (!articleTrans) return {};
    return generatePageMetadata(articleTrans.seo);
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: string, articleSlug: string }> }) {
    const { lang, articleSlug } = await params;
    const t = getDictionary(lang);

    // First, find the article by any slug
    const slugTrans = await prisma.articleTranslation.findUnique({
        where: { slug: articleSlug },
        select: { articleId: true }
    });

    if (!slugTrans) notFound();

    // Then, get the translation for the current language
    const articleTrans = await prisma.articleTranslation.findFirst({
        where: { articleId: slugTrans.articleId, languageCode: lang },
        include: { article: true }
    });

    // If no translation exists for this language, fall back to the original
    const finalTrans = articleTrans || await prisma.articleTranslation.findUnique({
        where: { slug: articleSlug },
        include: { article: true }
    });

    if (!finalTrans) notFound();

    const article = finalTrans.article;

    // Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": finalTrans.title,
        "description": finalTrans.excerpt || finalTrans.title,
        "datePublished": article.createdAt,
        "dateModified": article.updatedAt,
        "author": { "@type": "Organization", "name": "LiveBaz" },
        "publisher": {
            "@type": "Organization",
            "name": "SportsInfo",
            "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
        }
    };

    return (
        <article className="container mx-auto px-4 py-16 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-12 flex items-center gap-3">
                <Link href={`/${lang}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.nav.home}</Link>

                <span className="opacity-30">/</span>
                <Link href={`/${lang}/blog`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.nav.articles}</Link>

                <span className="opacity-30">/</span>
                <span className="text-slate-900 dark:text-white line-clamp-1">{finalTrans.title}</span>
            </nav>

            <header className="mb-16 space-y-8">
                <div className="flex items-center gap-4">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
                        {article.category}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">

                        {new Date(article.createdAt).toLocaleDateString(lang, { dateStyle: 'long' })}
                    </span>
                </div>

                <h1 className="text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                    {finalTrans.title}
                </h1>

                {finalTrans.excerpt && (
                    <p className="text-2xl font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic border-s-4 border-blue-600 ps-8 py-2">
                        {finalTrans.excerpt}
                    </p>
                )}
            </header>

            {article.featuredImage && (
                <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl relative aspect-[21/10]">
                    <Image
                        src={article.featuredImage}
                        alt={finalTrans.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                </div>
            )}



            <div className="prose prose-slate dark:prose-invert prose-xl max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <div
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{ __html: finalTrans.content }}
                />
            </div>

            <footer className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-black text-slate-400">S</div>
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">SportsInfo Editorial</div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Expert Analysis Team</div>

                    </div>
                </div>
                <ShareButtons title={finalTrans.title} />
            </footer>
        </article>
    );
}


