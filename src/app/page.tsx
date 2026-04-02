"use client";

import Hero from "@/components/Hero";
import Image from "next/image";
import Card from "@/components/Card";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import BlasterGame from "@/components/BlasterGame";
import { supabase } from "@/lib/supabase";

const SPONSORS = [
  { name: "Daffodil International University", logo: "/media/icons/diu.png" },
  { name: "Rocketry Bangladesh", logo: "/media/icons/Rocketrybd.png" },
  { name: "Department of Software Engineering, DIU", logo: "/media/icons/swe.png" },
  { name: "Data Science Lab, DIU", logo: "/media/icons/ds.png" },
  { name: "DoR", logo: "/media/icons/dor.png" },
  { name: "DIIT", logo: "/media/icons/diit.png" },
];

export default function Home() {
  const [showGame, setShowGame] = useState(false);
  const [inputBuffer, setInputBuffer] = useState("");
  const [latestMissions, setLatestMissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestMissions = async () => {
      if (!supabase) return;
      const { data } = await supabase.from('missions').select('*').order('created_at', { ascending: false }).limit(3);
      if (data) setLatestMissions(data);
    };
    fetchLatestMissions();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const nextBuffer = (inputBuffer + e.key.toLowerCase()).slice(-7);
      setInputBuffer(nextBuffer);
      if (nextBuffer === "blaster") {
        setShowGame(true);
        setInputBuffer("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputBuffer]);

  return (
    <div className="flex flex-col w-full bg-rl-black">
      {showGame && <BlasterGame onClose={() => setShowGame(false)} />}
      <Hero />

      {/* About Section - Stark White on Black */}
      <section className="py-32 w-full">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-rl-white/20 pb-8">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-6">
                PIONEERING STUDENT AEROSPACE
              </h2>
              <p className="text-xl text-rl-light-grey font-light leading-relaxed">
                DIU Skyward is the first student-driven flagship engineering initiative at Daffodil International University. We are dedicated to the research, design, and development of experimental rockets, satellites, and autonomous robotics.
              </p>
            </div>
            <Link href="/who-we-are" className="group mt-8 md:mt-0 flex items-center text-rl-white text-sm font-bold tracking-widest uppercase">
              LEARN MORE
              <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-rl-white/10 p-8">
              <h3 className="text-2xl font-bold mb-4 font-heading">EST. 2025</h3>
              <p className="text-rl-light-grey/80">Founded at Daffodil International University to bridge the gap between classroom theory and orbital mechanics.</p>
            </div>
            <div className="border border-rl-white/10 p-8">
              <h3 className="text-2xl font-bold mb-4 font-heading">MISSIONS</h3>
              <p className="text-rl-light-grey/80">Executing suborbital launches, CanSat deployments, and Mars-analog rover tests.</p>
            </div>
            <div className="border border-rl-white/10 p-8">
              <h3 className="text-2xl font-bold mb-4 font-heading">HARDWARE</h3>
              <p className="text-rl-light-grey/80">In-house manufacturing of composite airframes, solid propulsion systems, and flight telemetry computers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Edge-to-Edge Image Section - Programs */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full bg-rl-black">
          <div className="absolute inset-0 bg-rl-black/60 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60"
            style={{ backgroundImage: `url('/media/images/programs-hero.jpg')` }}
          />
        </div>
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-heading font-black text-rl-white mb-8">
            ENGINEERING PROGRAMS
          </h2>
          <p className="text-xl mb-12 text-rl-light-grey">
            From suborbital sounding rockets to autonomous planetary rovers.
          </p>
          <Link href="/programs" className="inline-block px-12 py-4 bg-rl-white text-rl-black hover:bg-rl-light-grey font-heading font-bold tracking-widest uppercase transition-colors">
            EXPLORE PROGRAMS
          </Link>
        </div>
      </section>

      {/* Card Grid - Missions */}
      <section className="py-32 w-full bg-rl-black border-y border-rl-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black">LATEST MISSIONS</h2>
            <Link href="/missions" className="group hidden md:flex items-center text-rl-white text-sm font-bold tracking-widest uppercase">
              ALL MISSIONS
              <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {latestMissions.map((m: any) => (
              <div key={m.id} className="h-[500px]">
                <Card
                  href={`/missions/${m.slug}`}
                  title={m.title}
                  description={m.description}
                  category={m.status.toUpperCase()}
                  image={m.cover_image || undefined}
                />
              </div>
            ))}
            {latestMissions.length === 0 && (
              <div className="col-span-1 md:col-span-3 h-[500px] flex items-center justify-center border border-rl-white/10">
                <p className="text-xl font-orbitron text-rl-white/50">Fetching live mission parameters...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Story Section - Compact Integrated Title */}
      <div className="w-full bg-rl-black border-t border-rl-white/10 pt-16 pb-6">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase text-rl-white">
            OUR STORY
          </h2>
        </div>
      </div>
      <div className="w-full h-[1px] bg-rl-white/10" />

      {/* Our Story Visual - Robust Sizing */}
      <section className="relative w-full h-screen overflow-hidden group">
        <div className="absolute inset-0 w-full h-full bg-rl-black pointer-events-none">
          <iframe
            className="w-[115vw] h-[64.68vw] min-h-[115vh] min-w-[204.44vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"
            src="https://www.youtube.com/embed/Z46vN_E5Mlo?autoplay=1&mute=1&loop=1&playlist=Z46vN_E5Mlo&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
        
        {/* Custom Play Button Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-1000">
          <div className="w-24 h-24 border-2 border-rl-white rounded-full flex items-center justify-center bg-rl-black/20 backdrop-blur-sm">
            <Play className="w-8 h-8 text-rl-white fill-rl-white ml-1" />
          </div>
        </div>
        
        {/* Click Layer */}
        <a 
          href="https://www.youtube.com/watch?v=Z46vN_E5Mlo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 z-30 cursor-pointer"
        />
      </section>

      {/* Team Section - Compact Integrated Title */}
      <div className="w-full bg-rl-black border-t border-rl-white/10 pt-16 pb-6">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase text-rl-white">
            THE TEAM
          </h2>
        </div>
      </div>
      <div className="w-full h-[1px] bg-rl-white/10" />

      {/* Team Visual - Immersive Full-Screen */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-rl-dark-grey">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed grayscale hover:grayscale-0 transition-all duration-1000"
            style={{ 
              backgroundImage: `url('/media/images/team-group.jpg')`
            }}
          />
          <div className="absolute inset-0 bg-rl-black/30 pointer-events-none" />
        </div>
        {/* Stark bottom divider */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-rl-white/20 z-20" />
      </section>






      {/* Sponsors Section */}
      <section className="py-32 w-full bg-rl-dark-grey border-b border-rl-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-2xl font-heading font-bold mb-16 tracking-widest text-center uppercase text-sky-400">
            SPONSORS & PARTNERS
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex space-x-12 animate-marquee whitespace-nowrap opacity-70 transition-opacity hover:opacity-100 py-4">
              {[...SPONSORS, ...SPONSORS].map((spons, i) => (
                <div key={i} className="flex flex-col items-center group cursor-pointer hover:grayscale-0 transition-all min-w-[280px] flex-shrink-0 px-8">
                  <div className="w-16 h-16 mb-6 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100 group-hover:scale-110">
                    <img 
                      src={spons.logo} 
                      alt={spons.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        // Fallback logic if image is missing - using a generic icon box style
                        e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/1063/1063376.png"; 
                      }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-rl-light-grey text-center w-full block leading-relaxed">
                    {spons.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For You! Section - SpaceX Style */}
      <section className="relative w-full border-b border-rl-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/media/images/spacex-rocket-bg.png" 
            alt="Rocket Inquilab 2.0 Launcher" 
            fill 
            className="object-cover brightness-[0.35]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rl-black/90 via-rl-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-32">
          <div className="max-w-2xl">
            <h2 className="text-sm font-heading font-black text-sky-400 mb-4 tracking-[0.2em] uppercase">
              For You!
            </h2>
            <h3 className="text-4xl md:text-6xl font-heading font-black text-rl-white mb-6 tracking-tight">
              SEND YOUR NAME WITH OUR ROCKET <span className="text-sky-500">INQUILAB 2.0</span>
            </h3>
            <p className="text-xl text-rl-light-grey mb-10 font-light leading-relaxed">
              Now we can't send ourselves onboard the rocket... but don't be sad, we can send our name right?
            </p>
            <Link 
              href="/programs/rocket/send-name" 
              className="inline-flex items-center px-12 py-5 bg-transparent border-2 border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-black tracking-widest uppercase transition-all duration-300"
            >
              Send My Name
              <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Crowdfunding Section */}
      <section className="py-32 w-full bg-rl-black border-b border-rl-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tight">SUPPORT THE MISSION</h2>
              <p className="text-xl text-rl-light-grey font-light leading-relaxed">
                Directly fund our research in high-power rocketry and satellite deployment. Your contributions go directly towards hardware, propellant, and laboratory equipment.
              </p>
            </div>
            <Link href="/crowdfund" className="px-16 py-6 bg-rl-white text-rl-black hover:bg-rl-light-grey font-heading font-bold text-xl tracking-widest uppercase transition-all duration-300">
              FUND US
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Solid Black */}
      <section className="py-40 w-full text-center px-6">
        <h2 className="text-5xl md:text-7xl font-heading font-black mb-10 tracking-tight">JOIN THE RACE</h2>
        <p className="text-xl text-rl-light-grey mb-12 max-w-2xl mx-auto font-light">
          We are actively recruiting passionate engineers and innovators. Push your limits.
        </p>
        <Link href="/join" className="inline-block px-12 py-5 bg-transparent border-2 border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold text-lg tracking-widest uppercase transition-all duration-300">
          APPLY NOW
        </Link>
      </section>

      {/* Easter Egg Clue */}
      <div className="py-4 text-center opacity-5 select-none pointer-events-none">
        <span className="text-[8px] font-mono uppercase tracking-[10px]">terminal_id: blaster</span>
      </div>

    </div>
  );
}
