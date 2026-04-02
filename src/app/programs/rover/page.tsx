import Image from "next/image";
import { Settings, Map, Camera, Navigation2 } from "lucide-react";
import Link from "next/link";

export default function RoverProgramPage() {
    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Sub-navigation */}
            <div className="w-full bg-rl-dark-grey border-b border-rl-white/10 pt-20 px-6">
                <div className="max-w-[1400px] mx-auto py-4 flex gap-8 overflow-x-auto no-scrollbar">
                    <Link href="/programs" className="text-rl-light-grey hover:text-rl-white text-xs font-heading font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                        ← All Programs
                    </Link>
                    <span className="text-rl-white text-xs font-heading font-bold uppercase tracking-widest">
                        Autonomous Rover
                    </span>
                </div>
            </div>

            {/* Hero */}
            <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex flex-col items-center justify-center text-center w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rl-black to-transparent z-10" />
                    <div className="absolute inset-0 bg-rl-black/50 z-10" />
                    <div
                        className="absolute inset-0 bg-[url('/media/images/mission-rover-new.png')] bg-cover bg-center bg-fixed opacity-60"
                    />
                </div>
                <div className="relative z-20 max-w-[1400px] px-6">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">Ground Robotics</span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        PROJECT<br />ARES
                    </h1>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-24 md:py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">

                    {/* Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-40">
                        <div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black mb-10 tracking-tight leading-tight uppercase">
                                Extraterrestrial<br />Mobility
                            </h2>
                        </div>
                        <div className="flex flex-col justify-start lg:justify-center">
                            <p className="text-lg sm:text-xl md:text-2xl text-rl-light-grey font-light leading-relaxed mb-8">
                                The Robotics division is dedicated to the development of next-generation autonomous ground vehicles. Project Ares tackles the mobility, navigation, and science-caching challenges associated with Martian and Lunar exploration.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-rl-white/20">
                                <div>
                                    <span className="block text-3xl sm:text-4xl font-heading font-bold mb-2">6-Wheel</span>
                                    <span className="text-rl-light-grey text-sm tracking-widest uppercase">Rocker-Bogie Suspension</span>
                                </div>
                                <div>
                                    <span className="block text-3xl sm:text-4xl font-heading font-bold mb-2">ROS 2</span>
                                    <span className="text-rl-light-grey text-sm tracking-widest uppercase">Control System</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Architecture */}
                    <div className="mb-40">
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight uppercase border-b border-rl-white/20 pb-6">
                            Subsystem Architecture
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-rl-white/20">
                            {/* System 1 */}
                            <div className="p-10 border-b md:border-b-0 md:border-r border-rl-white/20 group hover:bg-rl-dark-grey transition-colors">
                                <Navigation2 className="w-12 h-12 text-rl-white mb-8" strokeWidth={1.5} />
                                <h3 className="text-2xl font-heading font-bold uppercase mb-4 tracking-widest">AUTONOMY</h3>
                                <p className="text-rl-light-grey font-light leading-relaxed">
                                    Simultaneous Localization and Mapping (SLAM) implemented via ROS 2, allowing for robust obstacle avoidance and path planning without human intervention.
                                </p>
                            </div>

                            {/* System 2 */}
                            <div className="p-10 border-b md:border-b-0 md:border-r border-rl-white/20 group hover:bg-rl-dark-grey transition-colors">
                                <Camera className="w-12 h-12 text-rl-white mb-8" strokeWidth={1.5} />
                                <h3 className="text-2xl font-heading font-bold uppercase mb-4 tracking-widest">VISION</h3>
                                <p className="text-rl-light-grey font-light leading-relaxed">
                                    Stereo high-definition camera arrays coupled with 360-degree LiDAR scanning to generate dense point clouds of the surrounding terrain.
                                </p>
                            </div>

                            {/* System 3 */}
                            <div className="p-10 group hover:bg-rl-dark-grey transition-colors">
                                <Map className="w-12 h-12 text-rl-white mb-8" strokeWidth={1.5} />
                                <h3 className="text-2xl font-heading font-bold uppercase mb-4 tracking-widest">SCIENCE</h3>
                                <p className="text-rl-light-grey font-light leading-relaxed">
                                    A 6-axis robotic manipulator arm designed for precise soil sample collection, caching, and running astrobiological sensor suites.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Block */}
                    <div className="w-full aspect-[21/9] bg-rl-dark-grey relative overflow-hidden mb-40 border-y border-rl-white/10">
                        <div className="absolute inset-0 bg-[url('/media/images/mission-rover-new.png')] bg-cover bg-center opacity-90" />
                    </div>

                    {/* Join The Program */}
                    <div className="border border-rl-white/20 p-16 flex flex-col items-center justify-center text-center">
                        <Settings className="w-16 h-16 text-rl-white mb-8" strokeWidth={1} />
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight uppercase">
                            Join Project Ares
                        </h2>
                        <p className="text-xl text-rl-light-grey font-light max-w-2xl mx-auto mb-10">
                            We are looking for computer vision specialists, mechatronics engineers, and control systems experts to pioneer our ground division.
                        </p>
                        <Link href="/join" className="inline-flex py-4 px-12 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300">
                            APPLY TO DIVISION
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
}
