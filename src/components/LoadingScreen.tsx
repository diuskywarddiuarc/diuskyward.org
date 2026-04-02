"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
    const [text, setText] = useState("");
    const [show, setShow] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const fullText = "As High as Honor";

    useEffect(() => {
        // Only show for the first time in the session
        const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");
        if (hasSeenLoading) {
            setShow(false);
            return;
        }

        setShow(true);
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setIsFinished(true);
                    sessionStorage.setItem("hasSeenLoading", "true");
                    setTimeout(() => setShow(false), 800); // Fade out duration
                }, 1000);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    if (!show) return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] bg-rl-black flex items-center justify-center transition-opacity duration-1000 ${isFinished ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
            {/* Background Texture: Subtle Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            
            <div className="flex flex-col items-center relative z-10">
                <div className="flex items-center space-x-2">
                    <span className="text-rl-white font-heading text-4xl md:text-7xl lg:text-8xl tracking-tighter uppercase font-black leading-none">
                        {text}
                    </span>
                    <span className="w-2 h-10 md:h-16 lg:h-20 bg-sky-400 animate-pulse" />
                </div>
                
                {/* Subtle technical readout */}
                <div className="mt-12 overflow-hidden h-4 w-64 md:w-96 border-l border-rl-white/20 pl-4">
                    <div className="text-[10px] font-mono text-rl-white/40 uppercase tracking-[0.3em] flex space-x-8">
                        <span className="shrink-0">DIU SKYWARD_OS V1.0</span>
                        <span className="shrink-0">ENCRYPTION: ḥimāyat al-waṭan_ENFORCED</span>
                        <span className="shrink-0">TERMINAL_ID: dhawd ʿan al-ḥaqq 786</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
