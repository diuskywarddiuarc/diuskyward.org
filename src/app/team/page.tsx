import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TeamPage() {
    const divisions = [
        {
            id: "rocket",
            title: "ROCKET",
            desc: "Propulsion systems, structural design, and recovery systems engineering.",
            memberCount: "11 members"
        },
        {
            id: "satellite",
            title: "SATELLITE",
            desc: "CanSat and CubeSat systems, thermal management, and power systems.",
            memberCount: "8 members"
        },
        {
            id: "robotics",
            title: "ROBOTICS",
            desc: "Autonomous rovers, mechanical systems, and computer vision.",
            memberCount: "8 members"
        },
        {
            id: "research",
            title: "RESEARCH",
            desc: "Simulation, data analysis, and experimental validation.",
            memberCount: "8 members"
        }
    ];

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">
            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-rl-black/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rl-black via-transparent to-rl-black z-10" />
                    <div
                        className="absolute inset-0 bg-[url('/media/images/team-work.png')] bg-cover bg-center bg-fixed opacity-50"
                    />
                </div>
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        OUR TEAM
                    </h1>
                    <p className="text-xl md:text-3xl text-rl-light-grey font-heading font-light tracking-widest uppercase">
                        Meet the Engineers Behind the Mission.
                    </p>
                </div>
            </section>

            {/* Divisions Grid */}
            <section className="py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {divisions.map((division) => (
                            <Link
                                key={division.id}
                                href={`/team/${division.id}`}
                                className="group"
                            >
                                <div className="border border-rl-white/20 p-10 hover:border-rl-white transition-colors duration-300 h-full flex flex-col justify-between">
                                    <div className="text-center">
                                        <h3 className="text-4xl font-heading font-bold text-rl-white mb-4 group-hover:text-rl-light-grey transition-colors">
                                            {division.title} DIV
                                        </h3>
                                        <p className="text-lg text-rl-light-grey font-light leading-relaxed mb-6">
                                            {division.desc}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-rl-light-grey font-heading font-bold tracking-widest uppercase">
                                            {division.memberCount}
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-rl-white group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* All Members */}
                    <div className="border-t border-rl-white/20 pt-20">
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight uppercase">
                            ALL TEAM MEMBERS
                        </h2>
                    </div>
                </div>
            </section>
        </div>
    );
}
