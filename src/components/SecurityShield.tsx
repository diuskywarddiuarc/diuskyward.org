"use client";

import { useEffect } from "react";

/**
 * SecurityShield Component
 * 
 * Implements client-side hardening and activity monitoring.
 * Note: While easily bypassable by advanced users, it effectively blocks 
 * casual automated scraping and provides a "hardened" engineering feel.
 */
export default function SecurityShield() {
    useEffect(() => {
        // 1. Log System Initialization
        console.log(
            "%c[SKYWARD ENCRYPTED UPLINK ACTIVE]", 
            "color: #0ea5e9; font-weight: bold; font-size: 16px; background: #000; padding: 4px 8px; border: 1px solid #0ea5e9;"
        );
        console.log("Transmission Level: MOSSAD_CRYPTO_V4");

        // 2. Disable Context Menu (Right Click)
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 3. Black-Hole DevTools Detection
        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            if (widthThreshold || heightThreshold) {
                console.clear();
                console.log("%c[SECURITY BREACH DETECTED] SESSION TERMINATED", "color: red; font-size: 24px; font-weight: bold;");
            }
        };

        // 4. Disable sensitive developer keys
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" || 
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
                (e.ctrlKey && e.key === "u") ||
                (e.ctrlKey && e.key === "s")
            ) {
                e.preventDefault();
                console.clear();
                console.warn("[ACCESS DENIED] UNPRIVILEGED OPERATION");
                return false;
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);
        const interval = setInterval(detectDevTools, 1000);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
            clearInterval(interval);
        };
    }, []);

    return null; // This is a logic-only component
}
