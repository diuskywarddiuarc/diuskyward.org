import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, CloudRain, ShieldAlert, Rocket } from "lucide-react";

// Icon mapping for dynamic icons
const iconMap: Record<string, any> = {
    Cpu,
    CloudRain,
    ShieldAlert,
    Rocket
};

export default async function MissionDetail({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    
    if (!supabase) {
        notFound();
        return;
    }
    
    const { data: mission, error } = await supabase.from('missions').select('*').eq('slug', slug).single();

    if (error || !mission) {
        console.error('Mission fetch error:', error);
        notFound();
    }

    // Use mission-specific data or fall back to defaults
    const heroBackgroundImage = mission.hero_background_image || mission.cover_image || '/media/images/team-work.png';
    const heroSubtitle = mission.hero_subtitle || 'Mission';
    const heroTitle = (mission.title || '').toUpperCase();
    const overviewTitle = mission.overview_title || 'Mission Overview';
    const overviewDescription = mission.overview_description || mission.description || '';
    const missionObjective = mission.mission_objective || mission.description || '';
    const keyMetrics = Array.isArray(mission.key_metrics) ? mission.key_metrics : [];
    const testOutcomes = Array.isArray(mission.test_outcomes) ? mission.test_outcomes : [];
    const expectedOutcome = mission.expected_outcome || mission.detailed_content || '';
    const statusDisplay = mission.status_display || mission.status || 'Unknown';

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Sub-navigation */}
            <div className="w-full bg-rl-dark-grey border-b border-rl-white/10 pt-20 px-6">
                <div className="max-w-[1400px] mx-auto py-4 flex gap-8 overflow-x-auto no-scrollbar">
                    <Link href="/missions" className="text-rl-light-grey hover:text-rl-white text-xs font-heading font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                        ← All Missions
                    </Link>
                    <span className="text-rl-white text-xs font-heading font-bold uppercase tracking-widest">
                        {mission.title}
                    </span>
                </div>
            </div>

            {/* Hero */}
            <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex flex-col items-center justify-center text-center w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rl-black to-transparent z-10" />
                    <div className="absolute inset-0 bg-rl-black/40 z-10" />
                    <div
                        className="absolute inset-0 bg-[url('/media/images/team-work.png')] bg-cover bg-center bg-fixed opacity-70"
                        style={{
                            backgroundImage: `url('${heroBackgroundImage}')`
                        }}
                    />
                </div>
                <div className="relative z-20 max-w-[1400px] px-6">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">{heroSubtitle}</span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter mix-blend-difference">
                        {heroTitle}
                    </h1>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-24 md:py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">

                    {/* Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-heading font-black mb-10 tracking-tight leading-none uppercase">
                                {(overviewTitle || '').split(' ').map((word: string, index: number) => (
                                    <span key={index}>
                                        {word}
                                        {index < (overviewTitle || '').split(' ').length - 1 && <br />}
                                    </span>
                                ))}
                            </h2>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-xl md:text-2xl text-rl-light-grey font-light leading-relaxed mb-8">
                                {overviewDescription}
                            </p>
                            {keyMetrics.length > 0 && (
                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-rl-white/20">
                                    {keyMetrics.map((metric: any, index: number) => (
                                        <div key={index}>
                                            <span className="block text-4xl font-heading font-bold mb-2">{metric?.value || ''}</span>
                                            <span className="text-rl-light-grey text-sm tracking-widest uppercase">{metric?.label || ''}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Test Outcomes */}
                    {testOutcomes.length > 0 && (
                        <div className="mb-40">
                            <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight uppercase border-b border-rl-white/20 pb-6">
                                Test Outcomes
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-rl-white/20">
                                {testOutcomes.map((outcome: any, index: number) => {
                                    const IconComponent = iconMap[outcome?.icon] || Rocket;
                                    return (
                                        <div key={index} className="p-10 border-b md:border-b-0 md:border-r border-rl-white/20 group hover:bg-rl-dark-grey transition-colors">
                                            <IconComponent className="w-12 h-12 text-rl-white mb-8" strokeWidth={1} />
                                            <h3 className="text-2xl font-heading font-bold uppercase mb-4 tracking-widest">{outcome?.title || ''}</h3>
                                            <p className="text-rl-light-grey font-light leading-relaxed">
                                                {outcome?.description || ''}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Expected Outcome */}
                    {expectedOutcome && (
                        <div className="mb-40">
                            <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight uppercase border-b border-rl-white/20 pb-6">
                                Expected Outcome
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none">
                                <p className="text-xl md:text-2xl text-rl-light-grey font-light leading-relaxed">
                                    {expectedOutcome}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Mission Status */}
                    <div className="border-t border-rl-white/20 pt-16">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-heading font-bold uppercase mb-2">Mission Status</h3>
                                <span className="text-rl-light-grey text-sm tracking-widest uppercase">{statusDisplay}</span>
                            </div>
                            {mission.launch_date && (
                                <div className="text-right">
                                    <span className="text-rl-light-grey text-sm tracking-widest uppercase">Target Launch</span>
                                    <div className="text-2xl font-heading font-bold">
                                        {(() => {
                                            try {
                                                return new Date(mission.launch_date).toLocaleDateString();
                                            } catch {
                                                return 'Invalid Date';
                                            }
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}
