import Card from "@/components/Card";
import { Rocket, Box, Radio, Settings } from "lucide-react";

export default function ProgramsPage() {
    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-[url('/media/images/hero-ocean.png')] bg-cover bg-center" />
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">Initiatives</span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        PROGRAMS
                    </h1>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        <div className="h-auto sm:h-[500px] md:h-[600px]">
                            <Card
                                href="/programs/rocket"
                                title="ROCKET ENGINEERING"
                                description="Design, manufacturing, and flight testing of experimental high-power sounding rockets. Focus on custom solid motors, composite airframes, and dual-deploy recovery systems."
                                icon={<Rocket className="w-16 h-16" />}
                                category="SUBORBITAL"
                            />
                        </div>
                        <div className="h-[600px]">
                            <Card
                                href="/programs/cansat"
                                title="CANSAT SIMULATOR"
                                description="Developing volume-constrained payloads (soda can sized) that are launched via rocket or drone to collect atmospheric telemetry and validate descent control algorithms."
                                icon={<Radio className="w-16 h-16" />}
                                category="TELEMETRY"
                            />
                        </div>
                        <div className="h-[600px]">
                            <Card
                                href="/programs/cubesat"
                                title="CUBESAT DEVELOPMENT"
                                description="Engineering 1U to 3U nanosatellites utilizing standardized forms for LEO deployment. Focusing on extreme environment survivability and EPS (Electrical Power Systems)."
                                icon={<Box className="w-16 h-16" />}
                                category="ORBITAL"
                            />
                        </div>
                        <div className="h-[600px]">
                            <Card
                                href="/programs/rover"
                                title="AUTONOMOUS ROVER"
                                description="Prototyping automated ground vehicles for simulated extraterrestrial terrain navigation, utilizing advanced computer vision, LIDAR mapping, and robotic sample caching."
                                icon={<Settings className="w-16 h-16" />}
                                category="ROBOTICS"
                            />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
