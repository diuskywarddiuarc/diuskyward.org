"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Users } from "lucide-react";

const SATELLITE_TEAM = [
    { name: "null", title: "Chief Satellite Engineer", image: "/media/images/team/tanvir-ahmed.jpg" },
    { name: "null", title: "Payload Specialist", image: "/media/images/team/sifat-sultana.jpg" },
    { name: "null", title: "Comms Engineer", image: "/media/images/team/niaz-morshed.jpg" },
    { name: "null", title: "Power Systems Lead", image: "/media/images/team/afsana-mimi.jpg" },
];

export default function SatelliteDivisionPage() {
    const [missingImages, setMissingImages] = useState<Record<string, boolean>>({});

    const handleImageError = (name: string) => {
        setMissingImages(prev => ({ ...prev, [name]: true }));
    };

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">
            {/* Header / Back Link */}
            <div className="pt-32 pb-8 px-6 max-w-[1400px] mx-auto w-full">
                <Link href="/team" className="inline-flex items-center text-rl-light-grey hover:text-rl-white transition-colors font-heading font-bold tracking-widest uppercase text-sm">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Team
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-rl-black/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rl-black via-transparent to-rl-black z-10" />
                    <div
                        className="absolute inset-0 bg-[url('/media/images/satellite-earth.png')] bg-cover bg-center bg-fixed opacity-50"
                    />
                </div>
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter uppercase">
                        SATELLITE DIV
                    </h1>
                    <p className="text-xl md:text-3xl text-rl-light-grey font-heading font-light tracking-widest uppercase">
                        Orbital Systems & Payloads.
                    </p>
                </div>
            </section>

            {/* Description */}
            <section className="py-20 px-6 max-w-[1400px] mx-auto w-full">
                <div className="max-w-3xl mb-20 mx-auto text-center">
                    <p className="text-xl text-rl-light-grey font-light leading-relaxed mb-6">
                        The Satellite Division designs and develops CanSat and CubeSat systems with a focus on miniaturization and high performance in constraint environments. Our engineers work on thermal management, power systems, communication protocols, and scientific payload integration.
                    </p>
                    <p className="text-xl text-rl-light-grey font-light leading-relaxed">
                        We simulate orbital missions and push the limits of what can be accomplished within standardized satellite form factors.
                    </p>
                </div>
            </section>

            {/* Team Members */}
            <section className="py-20 px-6 max-w-[1400px] mx-auto w-full mb-20">
                <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight uppercase">
                    Team Members
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {SATELLITE_TEAM.map((member, i) => {
                        const isMissing = missingImages[member.name];
                        return (
                            <div key={i} className="flex flex-col group cursor-pointer">
                                <div className="w-full aspect-[3/4] bg-rl-dark-grey relative overflow-hidden mb-6 border-b-2 border-transparent group-hover:border-rl-white transition-colors duration-300">
                                    {!isMissing ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                            onError={() => handleImageError(member.name)}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                                            <label className="text-xs uppercase tracking-widest mb-4">No Photo</label>
                                            <Users className="w-16 h-16 text-rl-light-grey" strokeWidth={1} />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-rl-black/50 to-transparent pointer-events-none" />
                                </div>
                                <h4 className="font-heading font-bold text-xl uppercase tracking-widest text-rl-white mb-2 group-hover:text-rl-light-grey transition-colors">
                                    {member.name || "TBD"}
                                </h4>
                                <p className="text-sm font-sans text-rl-light-grey font-light leading-relaxed">
                                    {member.title || "Position Open"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
