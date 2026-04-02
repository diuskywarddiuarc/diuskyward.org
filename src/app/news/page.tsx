"use client";

import Card from "@/components/Card";
import { Newspaper } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const INITIAL_NEWS_COUNT = 4;

export default function NewsPage() {
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_NEWS_COUNT);

    useEffect(() => {
        const fetchNews = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('news').select('*').order('published_date', { ascending: false });
            if (data) setNewsItems(data);
        };
        fetchNews();
    }, []);

    const loadMore = () => {
        setVisibleCount(prev => Math.min(prev + 3, newsItems.length));
    };

    const hasMore = visibleCount < newsItems.length;

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">
            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-[url('/media/images/rocket-launch.png')] bg-cover bg-center" />
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">Updates</span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        NEWS
                    </h1>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">
                    {newsItems.length === 0 ? (
                        <div className="text-center text-rl-white/60 font-orbitron text-xl">
                            Fetching latest transmissions...
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-start">
                                {newsItems.slice(0, visibleCount).map((item, index) => (
                                    <div key={item.id} className="h-full">
                                        <Card
                                            href={`/news/${item.slug}`}
                                            title={item.title}
                                            description={item.content.substring(0, 150) + "..."}
                                            icon={<Newspaper className="w-16 h-16" />}
                                            category="UPDATE"
                                            image={item.cover_image || undefined}
                                        />
                                    </div>
                                ))}
                            </div>
                            {hasMore && (
                                <div className="mt-20 text-center">
                                    <button
                                        onClick={loadMore}
                                        className="px-12 py-4 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300"
                                    >
                                        LOAD OLDER STORIES
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
