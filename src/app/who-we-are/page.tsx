"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Target, Search } from "lucide-react";

const TEAM_MEMBERS = [
    { name: "MD ASIF HASAN OVI", title: "Team Lead & Chief Propulsion Engineer", image: "/media/images/team/md-asif-hasan-ovi.jpg" },
    { name: "Masrafee Faruqee", title: "Chief Recovery Officer", image: "/media/images/team/masrafee-faruqee.jpg" },
    { name: "Apurba Roy", title: "Chief Operations Officer", image: "/media/images/team/apurba-roy.jpg" },
    { name: "Ibnul Jubaer", title: "External Affairs Officer", image: "/media/images/team/ibnul-jubaer.jpg" },
    { name: "Swassa", title: "Lead Public Relations Officer", image: "/media/images/team/swassa.jpg" },
    { name: "Masnoon", title: "Lead Branding Officer", image: "/media/images/team/masnoon.jpg" },
    { name: "Zihad", title: "Embedded Systems Engineer", image: "/media/images/team/jihad.jpg" },
    { name: "Morshad", title: "System Engineer", image: "/media/images/team/morshad.jpg" },
];

const ADVISORY_PANEL = [
    { name: "Dr. Imran Mahmud", title: "Professor & Head of Department of Software Engineering, DIU", image: "/media/images/team/dr-imran-mahmud.jpg" },
    { name: "Dr. Fazla Elahe", title: "Associate Professor Department of Software Engineering, DIU", image: "/media/images/team/dr-fazla-elahe.jpg" },
    { name: "Nahiyan Al Rahman", title: "Technical Advisor (Honorary)", image: "/media/images/team/nahiyan-al-rahman.jpg" },
    { name: "Sheikh Mohammad Allayar", title: "Strategic Advisor", image: "/media/images/team/sheikh-mohammad-allayar.jpg" },
];

const MENTORS = [
    { name: "Sakib Ali Mazumdar", title: "Lead Mentor & Team Coordinator", image: "/media/images/team/sakib-ali-mazumdar.jpg" },
    { name: "Md. Mozammelul Haque", title: "Propulsion & GNC Mentor", image: "/media/images/team/md-mozammelul-haque.jpg" },
    { name: "Masrufa Tasnim Esha", title: "Robotics Mentor", image: "/media/images/team/masrufa-tasnim-esha.jpg" },
    { name: "Dr Farjana Rahman", title: "Scientific Advisor & Mentor (Chemistry)", image: "/media/images/team/dr-farjana-rahman.jpg" },
];

export default function WhoWeArePage() {
    const [missingImages, setMissingImages] = useState<Record<string, boolean>>({});

    const handleImageError = (name: string) => {
        setMissingImages(prev => ({ ...prev, [name]: true }));
    };

    interface TeamMember {
        name: string;
        title: string;
        image: string;
    }

    const renderMember = (member: TeamMember, index: number) => {
        const isMissing = missingImages[member.name];

        return (
            <div key={`${member.name}-${index}`} className="flex flex-col group cursor-pointer">
                {/* Monochromatic Portrait Container */}
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

                {/* Name & Title */}
                <h4 className="font-heading font-bold text-xl uppercase tracking-widest text-rl-white mb-2 group-hover:text-rl-light-grey transition-colors">
                    {member.name}
                </h4>
                <p className="text-sm font-sans text-rl-light-grey font-light leading-relaxed">
                    {member.title}
                </p>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-rl-black/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rl-black via-transparent to-rl-black z-10" />
                    <div
                        className="absolute inset-0 bg-[url('/media/images/skyward-logo.png')] bg-cover bg-center bg-fixed opacity-50"
                    />
                </div>
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter uppercase">
                        WHO WE ARE
                    </h1>
                    <p className="text-xl md:text-3xl text-rl-light-grey font-heading font-light tracking-widest uppercase">
                        Engineering The Future.
                    </p>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">

                    {/* History */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-center">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-heading font-black mb-10 tracking-tight">HISTORY</h2>
                            <p className="text-xl text-rl-light-grey font-light leading-relaxed mb-6">
                                Founded in 2025 at Daffodil International University, Skyward began as a small group of ambitious engineering students looking beyond the classroom. What started as theoretical design evolved into a fully-fledged research organization.
                            </p>
                            <p className="text-xl text-rl-light-grey font-light leading-relaxed">
                                Today, we represent the peak of undergraduate engineering capability, actively developing high-power rocketry and autonomous systems.
                            </p>
                        </div>
                        <div className="aspect-[4/3] bg-rl-dark-grey relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/media/images/history-rocket.png')] bg-cover bg-center opacity-100 hover:scale-105 transition-transform duration-1000" />
                        </div>
                    </div>

                    {/* Mission/Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
                        <div className="border border-rl-white/20 p-8 md:p-16">
                            <h3 className="text-4xl font-heading font-bold mb-8">MISSION</h3>
                            <p className="text-xl text-rl-light-grey font-light leading-relaxed">
                                To engineer, manufacture, and fly advanced aerospace systems while providing students with unparalleled hands-on experience in complex, interdisciplinary project management.
                            </p>
                        </div>
                        <div className="border border-rl-white/20 p-8 md:p-16">
                            <h3 className="text-4xl font-heading font-bold mb-8">VISION</h3>
                            <p className="text-xl text-rl-light-grey font-light leading-relaxed">
                                To become a leading university-level aerospace research center in South Asia, ultimately deploying student-built artifacts into Low Earth Orbit (LEO) and beyond.
                            </p>
                        </div>
                    </div>

                    {/* Structure */}
                    <div className="mb-40">
                        <h2 className="text-5xl md:text-7xl font-heading font-black mb-16 tracking-tight text-center">STRUCTURE</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-y border-rl-white/20">
                            {['Rocket', 'Satellite', 'Robotics', 'Research'].map((div, i) => (
                                <div key={div} className={`p-10 text-center ${i !== 3 ? 'border-b sm:border-b-0 sm:border-r border-rl-white/20' : ''}`}>
                                    <h4 className="font-heading font-bold text-2xl uppercase tracking-widest">{div} Div</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Executive Leadership */}
                    <div className="mb-40">
                        <div className="border-b border-rl-white/20 mb-16 pb-6">
                            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight uppercase">
                                EXECUTIVE LEADERSHIP
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 mb-12">
                            {TEAM_MEMBERS.map((member, i) => renderMember(member, i))}
                        </div>
                        <div className="text-center">
                            <a href="/team" className="inline-block px-12 py-4 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300">
                                VIEW FULL TEAM
                            </a>
                        </div>
                    </div>

                    {/* Mentors */}
                    <div className="mb-40">
                        <div className="border-b border-rl-white/20 mb-16 pb-6">
                            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight uppercase">
                                MENTORS
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {MENTORS.map((member, i) => renderMember(member, i))}
                        </div>
                    </div>

                    {/* Advisory Panel */}
                    <div className="mb-40">
                        <div className="border-b border-rl-white/20 mb-16 pb-6">
                            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight uppercase">
                                ADVISORY PANEL
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {ADVISORY_PANEL.map((member, i) => renderMember(member, i))}
                        </div>
                    </div>

                    <div className="mt-20 border-t border-rl-white/20 pt-16 text-center">
                        <a href="/join" className="inline-block px-12 py-4 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300">
                            JOIN THE TEAM
                        </a>
                    </div>

                </div>
            </section>

        </div>
    );
}
