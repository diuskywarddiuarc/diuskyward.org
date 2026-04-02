export const dynamic = 'force-dynamic';

import Card from "@/components/Card";
import { Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function MissionsPage() {
    if (!supabase) {
        return <div className="min-h-screen bg-rl-black text-rl-white flex items-center justify-center">
            <div>Database unavailable</div>
        </div>;
    }
    
    const { data: missions, error } = await supabase.from('missions').select('*').order('created_at', { ascending: false });
    
    if (error) {
        console.error('Missions fetch error:', error);
        return <div className="min-h-screen bg-rl-black text-rl-white flex items-center justify-center">
            <div>Error loading missions: {error.message}</div>
        </div>;
    }
    
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const activeMissions = missions?.filter((m: any) => {
        if (m.status === 'Completed' || m.status === 'Archived') return false;
        const createdDate = new Date(m.created_at);
        return createdDate >= fourMonthsAgo;
    }) || [];

    const pastMissions = missions?.filter((m: any) => {
        if (m.status === 'Completed' || m.status === 'Archived') return true;
        const createdDate = new Date(m.created_at);
        return createdDate < fourMonthsAgo;
    }) || [];

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">
            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-[url('/media/images/galaxy-space.png')] bg-cover bg-center" />
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">Operations</span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        MISSIONS
                    </h1>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">

                    <div className="mb-32 flex flex-col items-center border-b border-rl-white/20 pb-16">
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight flex items-center justify-center gap-4 w-full border-b border-rl-white/20 pb-8 text-center pt-16 uppercase">
                            <span className="w-4 h-4 rounded-full bg-rl-white animate-pulse" />
                            ACTIVE MISSIONS
                        </h2>
                        
                        {activeMissions.length === 0 && (
                            <p className="text-rl-white/50 font-orbitron text-xl">No active missions at this time.</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-start">
                            {activeMissions.map((mission: any) => (
                                <div key={mission.id} className="h-full">
                                    <Card
                                        href={`/missions/${mission.slug}`}
                                        title={mission.title}
                                        description={mission.description}
                                        icon={<Play className="w-16 h-16" />}
                                        category={mission.status.toUpperCase()}
                                        image={mission.cover_image || undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight text-rl-light-grey uppercase border-b border-rl-white/20 pb-8 text-center">
                            PAST MISSIONS
                        </h2>
                        {pastMissions.length === 0 && (
                            <p className="text-rl-white/50 text-center font-orbitron text-xl">Mission history empty.</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-start">
                            {pastMissions.map((mission: any) => (
                                <div key={mission.id} className="h-full">
                                    <Card
                                        href={`/missions/${mission.slug}`}
                                        title={mission.title}
                                        description={mission.description}
                                        category={mission.status.toUpperCase()}
                                        image={mission.cover_image || undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
