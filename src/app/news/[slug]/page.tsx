import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Link as LinkIcon, Image } from "lucide-react";

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    
    if (!supabase) {
        notFound();
        return;
    }
    
    // Fetch article from supabase
    const { data: newsItems, error: searchError } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug);

    const newsItem = newsItems?.[0];

    if (!newsItem) {
        notFound();
    }

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen text-rl-white">
            
            {/* Sub-navigation */}
            <div className="w-full bg-rl-dark-grey border-b border-rl-white/10 pt-20 px-6">
                <div className="max-w-[1400px] mx-auto py-4 flex gap-8 overflow-x-auto no-scrollbar">
                    <Link href="/news" className="text-rl-light-grey hover:text-rl-white text-xs font-heading font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shrink-0">
                        ← All News
                    </Link>
                    <span className="text-rl-white text-xs font-heading font-bold uppercase tracking-widest truncate">
                        {newsItem.title}
                    </span>
                </div>
            </div>

            <div className="max-w-[900px] mx-auto w-full py-16 md:py-24 px-6">
                {/* Cover Image */}
                {newsItem.cover_image && (
                    <img src={newsItem.cover_image} alt={newsItem.title} className="w-full h-auto rounded-xl mb-12 border border-rl-white/10 shadow-2xl" />
                )}

                {/* Category Badge */}
                {newsItem.category && (
                    <div className="inline-block bg-rl-space-blue/20 border border-rl-space-blue/50 rounded-lg px-3 py-1 mb-6">
                        <span className="text-rl-space-blue text-xs font-heading font-bold uppercase tracking-widest">
                            {newsItem.category}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 uppercase tracking-tight leading-none">
                    {newsItem.title}
                </h1>

                {/* Article Metadata */}
                <div className="flex flex-col gap-4 text-rl-white/50 font-inter mb-12 pb-8 border-b border-rl-white/10">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>
                                By <span className="text-rl-white font-semibold">{newsItem.author}</span>
                                {newsItem.author_role && (
                                    <span className="text-rl-white/40 ml-2">({newsItem.author_role})</span>
                                )}
                            </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(newsItem.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                    {newsItem.author_email && (
                        <div className="text-xs">
                            <a href={`mailto:${newsItem.author_email}`} className="text-rl-space-blue hover:text-rl-space-blue/80 transition-colors">
                                {newsItem.author_email}
                            </a>
                        </div>
                    )}
                </div>

                {/* Summary */}
                {newsItem.summary && (
                    <div className="bg-rl-white/5 border border-rl-white/10 rounded-lg p-6 mb-12">
                        <p className="text-rl-white/70 italic text-lg leading-relaxed">
                            {newsItem.summary}
                        </p>
                    </div>
                )}

                {/* Main Content */}
                <div className="prose prose-invert max-w-none mb-12">
                    <div className="font-inter text-rl-white/80 leading-relaxed whitespace-pre-wrap text-base">
                        {newsItem.content}
                    </div>
                </div>

                {/* Tags */}
                {newsItem.tags && newsItem.tags.length > 0 && (
                    <div className="mb-12 pb-8 border-b border-rl-white/10">
                        <h3 className="text-lg font-heading font-bold text-rl-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Tag className="w-5 h-5 text-rl-space-blue" />
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {newsItem.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="bg-rl-white/10 hover:bg-rl-white/20 border border-rl-white/20 rounded-full px-4 py-2 text-sm transition-colors cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery Images */}
                {newsItem.gallery_images && newsItem.gallery_images.length > 0 && (
                    <div className="mb-12 pb-8 border-b border-rl-white/10">
                        <h3 className="text-lg font-heading font-bold text-rl-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Image className="w-5 h-5 text-rl-space-blue" />
                            Gallery
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {newsItem.gallery_images.map((image: any, idx: number) => (
                                <div key={idx} className="rounded-lg overflow-hidden border border-rl-white/10 hover:border-rl-space-blue/50 transition-colors">
                                    <img 
                                        src={image.url} 
                                        alt={image.caption || `Gallery image ${idx + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                    {image.caption && (
                                        <div className="bg-rl-white/5 p-3">
                                            <p className="text-xs text-rl-white/60">{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* External Links */}
                {newsItem.external_links && newsItem.external_links.length > 0 && (
                    <div className="mb-12 pb-8 border-b border-rl-white/10">
                        <h3 className="text-lg font-heading font-bold text-rl-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-rl-space-blue" />
                            External Resources
                        </h3>
                        <div className="space-y-3">
                            {newsItem.external_links.map((link: any, idx: number) => (
                                <a 
                                    key={idx}
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block bg-rl-white/5 hover:bg-rl-white/10 border border-rl-white/10 hover:border-rl-space-blue/50 rounded-lg p-4 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-rl-space-blue group-hover:text-rl-space-blue/80 font-semibold">
                                            {link.title}
                                        </span>
                                        <LinkIcon className="w-4 h-4 text-rl-white/30 group-hover:text-rl-space-blue/50" />
                                    </div>
                                    {link.url && (
                                        <span className="text-xs text-rl-white/40 mt-1 line-clamp-1">
                                            {link.url}
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related News */}
                {newsItem.related_news && newsItem.related_news.length > 0 && (
                    <div>
                        <h3 className="text-lg font-heading font-bold text-rl-white mb-6 uppercase tracking-wider">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {newsItem.related_news.map((relatedSlug: string, idx: number) => (
                                <Link 
                                    key={idx}
                                    href={`/news/${relatedSlug}`}
                                    className="group bg-rl-white/5 hover:bg-rl-white/10 border border-rl-white/10 hover:border-rl-space-blue/50 rounded-lg p-6 transition-colors"
                                >
                                    <div className="text-rl-space-blue text-sm font-heading font-bold uppercase tracking-widest mb-2">
                                        {relatedSlug}
                                    </div>
                                    <div className="text-rl-white/40 group-hover:text-rl-white/60 transition-colors">
                                        Read article →
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
