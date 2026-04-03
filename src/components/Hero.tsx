"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useInteractionFeedback } from "@/lib/useInteractionFeedback";

const TimerUnit = ({ val, label }: { val: number, label: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-3xl sm:text-5xl md:text-7xl font-heading font-black tracking-tighter">
            {String(val).padStart(2, '0')}
        </span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-heading font-bold tracking-[0.15em] sm:tracking-[0.2em] opacity-50 uppercase mt-1 sm:mt-2">
            {label}
        </span>
    </div>
);

export default function Hero() {
    const { triggerClick, triggerHover } = useInteractionFeedback();
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const target = new Date("2027-01-01T00:00:00").getTime();
        const interval = setInterval(() => {
            const now = Date.now();
            const distance = target - now;
            if (distance < 0) {
                clearInterval(interval);
                return;
            }
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Dynamic Audio Logic: Unmute when in view and user has interacted
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleAudio = (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                // Try to unmute - might still be blocked by browser if no prior interaction
                video.muted = false;
                // Attempt play just in case it was paused
                video.play().catch(() => {
                    // Fail silently if autoplay with sound is blocked
                    video.muted = true;
                    video.play();
                });
            } else {
                video.muted = true;
            }
        };

        const observer = new IntersectionObserver(handleAudio, { threshold: 0.3 });
        observer.observe(video);

        // Also attempt to unmute on first user click/scroll anywhere on the page
        const unmuteOnInteraction = () => {
            if (video && video.paused === false) {
                video.muted = false;
            }
        };

        window.addEventListener("click", unmuteOnInteraction, { once: true });
        window.addEventListener("scroll", unmuteOnInteraction, { once: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("click", unmuteOnInteraction);
            window.removeEventListener("scroll", unmuteOnInteraction);
        };
    }, []);

    return (
        <div className="relative min-h-[60vh] sm:min-h-[70vh] md:h-screen w-full overflow-hidden flex flex-col items-center justify-center">

            {/* Background Video - Responsive Container */}
            <div className="absolute inset-0 w-full h-full bg-rl-black overflow-hidden">
                <div className="absolute inset-0 bg-rl-black/40 z-10" /> {/* Dark Overlay for text legibility */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="min-w-full min-h-full w-auto h-auto object-cover opacity-70"
                        style={{ 
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            minWidth: '100%',
                            minHeight: '100%'
                        }}
                        src="/media/videos/hero-rocket.mp4"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-7xl mt-20">
                <div className="flex items-center gap-1 sm:gap-4 md:gap-12 mb-4 py-8">
                    <div className="text-2xl sm:text-4xl md:text-6xl font-heading font-extralight tracking-tighter self-center mr-1 sm:mr-2 opacity-80">T-</div>
                    <TimerUnit val={timeLeft.days} label="Days" />
                    <div className="text-xl sm:text-3xl md:text-5xl font-extralight opacity-20 self-center">:</div>
                    <TimerUnit val={timeLeft.hours} label="Hours" />
                    <div className="text-xl sm:text-3xl md:text-5xl font-extralight opacity-20 self-center">:</div>
                    <TimerUnit val={timeLeft.minutes} label="Mins" />
                    <div className="text-xl sm:text-3xl md:text-5xl font-extralight opacity-20 self-center">:</div>
                    <TimerUnit val={timeLeft.seconds} label="Secs" />
                </div>

                {/* Minimalist Divider line */}
                <div className="w-full max-w-3xl h-[1px] bg-rl-white/20 mb-16" />

                <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                    <Link 
                        href="/missions" 
                        className="group flex items-center justify-center px-12 py-4 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                        onClick={() => triggerClick(true, true)}
                        onMouseEnter={() => triggerHover(false, false)}
                    >
                        WATCH MISSION
                    </Link>
                </div>
            </div>

            {/* Scroll indicator - Minimalist */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-80">
            </div>

        </div>
    );
}
