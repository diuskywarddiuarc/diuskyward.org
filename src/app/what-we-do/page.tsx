import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WhatWeDoPage() {
    const areas = [
        {
            id: "propulsion",
            title: "ROCKET PROPULSION",
            desc: "Design, mix, and cast solid-propellant grains. We utilize KN03/Sucrose and Ammonium Perchlorate Composite Propellants (APCP) to achieve desired thrust curves. We also engineer composite airframes using fiberglass and carbon fiber layup techniques to withstand high aerodynamic stresses at transonic velocities."
        },
        {
            id: "avionics",
            title: "AVIONICS & TELEMETRY",
            desc: "Custom PCB design and firmware development for flight computers. Our systems integrate IMUs, barometric pressure sensors, and GPS modules to calculate apogee and deploy dual-stage recovery parachutes. RF modules transmit real-time telemetry back to our ground station command center."
        },
        {
            id: "satellite",
            title: "SATELLITE SYSTEMS",
            desc: "Designing standardized volume-constrained payloads (CanSats and CubeSats) to simulate orbital missions. Focus areas include extreme temperature thermal management, solar EPS (Electrical Power Systems), and radiation-hardened microcontroller architectures."
        },
        {
            id: "robotics",
            title: "AUTONOMOUS ROBOTICS",
            desc: "Prototyping Mars-analog rovers utilizing rocker-bogie suspension systems for obstacle climbing. We integrate computer vision for autonomous navigation, LIDAR for topological mapping, and multi-axis mechanical arms for simulated soil sample retrieval."
        },
        {
            id: "simulation",
            title: "RESEARCH & SIMULATION",
            desc: "Before any hardware is built, we conduct rigorous software simulations. Utilizing Computational Fluid Dynamics (CFD) for aerodynamic modeling, Finite Element Analysis (FEA) for structural load testing, and OpenRocket for 6-DOF trajectory simulation."
        }
    ];

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">Design & Engineering</span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        CAPABILITIES
                    </h1>
                </div>
            </section>

            {/* Engineering Focus Areas Details */}
            <section className="py-32 w-full">
                <div className="max-w-[1200px] mx-auto px-6">

                    {areas.map((area, idx) => (
                        <div key={area.id} id={area.id} className="scroll-mt-40 mb-32 last:mb-0 border-t border-rl-white/20 pt-16">
                            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                                {/* Large Number Indicator */}
                                <div className="text-6xl md:text-8xl font-heading font-black text-rl-space-blue/80 shrink-0 tabular-nums">
                                    0{idx + 1}
                                </div>

                                <div className="flex-grow pt-4">
                                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 tracking-tight">{area.title}</h2>
                                    <p className="text-rl-light-grey text-xl font-light leading-relaxed mb-12">
                                        {area.desc}
                                    </p>
                                    <Link href={`/programs`} className="group inline-flex items-center text-rl-white text-sm font-bold tracking-widest uppercase">
                                        EXPLORE PROGRAMS
                                        <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </section>

        </div>
    );
}
