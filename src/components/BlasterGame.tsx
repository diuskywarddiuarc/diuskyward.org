"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface BlasterGameProps {
    onClose: () => void;
}

export default function BlasterGame({ onClose }: BlasterGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Game state
        const player = { x: canvas.width / 2, y: canvas.height - 50, size: 20 };
        let bullets: { x: number, y: number }[] = [];
        const enemies: { x: number, y: number, speed: number }[] = [];
        const keys: { [key: string]: boolean } = {};
        let frameId: number;
        let lastFire = 0;

        const spawnEnemy = () => {
            if (Math.random() < 0.04) { // Slightly lower spawn rate
                enemies.push({
                    x: Math.random() * (canvas.width - 20),
                    y: -20,
                    speed: 0.8 + Math.random() * 1.5 // Slower speed
                });
            }
        };

        const update = () => {
            // Move player
            if (keys["ArrowLeft"] && player.x > 0) player.x -= 8; // Faster player
            if (keys["ArrowRight"] && player.x < canvas.width - player.size) player.x += 8;

            // Shoot
            if (keys[" "]) {
                const now = Date.now();
                if (now - lastFire > 150) { // Faster fire rate (150ms vs original restricted check)
                    bullets.push({ x: player.x + player.size / 2 - 2, y: player.y });
                    lastFire = now;
                }
            }

            // Move bullets
            bullets = bullets.filter(b => b.y > 0);
            bullets.forEach(b => b.y -= 7);

            // Move enemies
            enemies.forEach((e, i) => {
                e.y += e.speed;
                if (e.y > canvas.height) {
                    setGameOver(true);
                    cancelAnimationFrame(frameId);
                }
            });

            // Collisions
            bullets.forEach((b, bi) => {
                enemies.forEach((e, ei) => {
                    if (b.x > e.x && b.x < e.x + 20 && b.y > e.y && b.y < e.y + 20) {
                        bullets.splice(bi, 1);
                        enemies.splice(ei, 1);
                        setScore(prev => prev + 10);
                    }
                });
            });

            spawnEnemy();
        };

        const draw = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            ctx.fillStyle = "white";
            for (let i = 0; i < 20; i++) {
                ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
            }

            // Player (White Triangle)
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.moveTo(player.x, player.y + player.size);
            ctx.lineTo(player.x + player.size / 2, player.y);
            ctx.lineTo(player.x + player.size, player.y + player.size);
            ctx.fill();

            // Bullets
            ctx.fillStyle = "white";
            bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));

            // Enemies (Grey Boxes)
            ctx.fillStyle = "#333";
            enemies.forEach(e => {
                ctx.fillRect(e.x, e.y, 20, 20);
                ctx.strokeStyle = "white";
                ctx.strokeRect(e.x, e.y, 20, 20);
            });
        };

        const loop = () => {
            if (gameOver) return;
            update();
            draw();
            frameId = requestAnimationFrame(loop);
        };

        const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; if (e.key === " ") e.preventDefault(); };
        const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        frameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(frameId);
        };
    }, [gameOver]);

    return (
        <div className="fixed inset-0 z-[9999] bg-rl-black flex flex-col items-center justify-center p-6 bg-opacity-95">
            <div className="relative w-full max-w-[600px] border border-rl-white p-4">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-rl-white hover:text-rl-light-grey flex items-center gap-2 font-heading font-bold text-sm tracking-widest uppercase transition-colors"
                >
                    Close [Esc]
                    <X className="w-5 h-5" />
                </button>

                <div className="flex justify-between items-end mb-4 border-b border-rl-white/20 pb-2">
                    <div className="font-heading font-black text-2xl tracking-tighter">BLASTER_MOD_V1</div>
                    <div className="font-heading font-bold text-rl-light-grey uppercase tracking-widest text-sm">Score: {score}</div>
                </div>

                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full h-auto bg-rl-black border border-rl-white/10"
                />

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-rl-black/80">
                        <h2 className="text-4xl font-heading font-black text-rl-white mb-6 tracking-tight">MISSION FAILED</h2>
                        <p className="text-rl-light-grey mb-8 uppercase tracking-widest text-sm">Final Score: {score}</p>
                        <button
                            onClick={() => { setGameOver(false); setScore(0); }}
                            className="px-8 py-3 bg-rl-white text-rl-black font-heading font-bold tracking-widest uppercase hover:bg-rl-light-grey transition-all"
                        >
                            Restart
                        </button>
                    </div>
                )}

                <div className="mt-6 flex justify-between text-[10px] font-heading font-bold text-rl-light-grey/50 uppercase tracking-[4px]">
                    <div>Arow Keys to move</div>
                    <div>Space to fire</div>
                </div>
            </div>
        </div>
    );
}
