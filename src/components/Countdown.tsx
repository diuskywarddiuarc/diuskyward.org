"use client";

import { useState, useEffect } from "react";
import { COUNTDOWN_TARGET_DATE } from "@/lib/countdown-config";

interface CountdownProps {
    targetDate?: string;
}

export default function Countdown({ targetDate = COUNTDOWN_TARGET_DATE }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    }>({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });
    const [timeOffset, setTimeOffset] = useState(0);

    // Get server time offset on component mount
    useEffect(() => {
        const fetchServerTime = async () => {
            try {
                const response = await fetch("/api/time");
                const data = await response.json();
                const serverTime = data.timestamp;
                const clientTime = Date.now();
                // Calculate the offset between server and client time
                setTimeOffset(serverTime - clientTime);
            } catch (error) {
                console.error("Failed to fetch server time:", error);
                // Fallback to client time if API fails
                setTimeOffset(0);
            }
        };

        fetchServerTime();
    }, []);

    useEffect(() => {
        const calculateTimeLeft = () => {
            // Get the actual server time by adding offset to client time
            const actualServerTime = Date.now() + timeOffset;
            const difference = +new Date(targetDate) - actualServerTime;
            let timeLeft = {
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
            };

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, "0"),
                    minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, "0"),
                    seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, "0"),
                };
            }
            setTimeLeft(timeLeft);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate, timeOffset]);

    return (
        <div className="flex bg-space-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-[0_0_30px_rgba(0,174,239,0.2)]">
            <div className="flex items-center gap-1 md:gap-4 font-orbitron font-bold text-3xl md:text-5xl tracking-widest text-stellar-white shadow-black drop-shadow-lg">
                <div className="flex flex-col items-center">
                    <span>{timeLeft.days}</span>
                    <span className="text-[10px] md:text-xs text-orbital-blue tracking-widest mt-1 uppercase">Days</span>
                </div>
                <span className="text-orbital-blue pb-4">:</span>
                <div className="flex flex-col items-center">
                    <span>{timeLeft.hours}</span>
                    <span className="text-[10px] md:text-xs text-orbital-blue tracking-widest mt-1 uppercase">Hours</span>
                </div>
                <span className="text-orbital-blue pb-4">:</span>
                <div className="flex flex-col items-center">
                    <span>{timeLeft.minutes}</span>
                    <span className="text-[10px] md:text-xs text-orbital-blue tracking-widest mt-1 uppercase">Mins</span>
                </div>
                <span className="text-orbital-blue pb-4">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-electric-blue text-shadow-glow">{timeLeft.seconds}</span>
                    <span className="text-[10px] md:text-xs text-orbital-blue tracking-widest mt-1 uppercase">Secs</span>
                </div>
            </div>
        </div>
    );
}
