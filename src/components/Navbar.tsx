"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useInteractionFeedback } from "@/lib/useInteractionFeedback";
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
    { href: "/who-we-are", label: "About" },
    { href: "/what-we-do", label: "Engineering" },
    { href: "/programs", label: "Programs" },
    { href: "/missions", label: "Missions" },
    { href: "/news", label: "Updates" },
];

interface NavbarProps {
    hideCareerButton?: boolean;
    hideSectionButtons?: boolean;
    adminButtons?: boolean;
    teamDashboard?: boolean;
}

export default function Navbar({ hideCareerButton = false, hideSectionButtons = false, adminButtons = false, teamDashboard = false }: NavbarProps = {}) {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        const closeMenu = () => setIsOpen(false);
        closeMenu();
    }, [pathname]);

    // Prevent body scroll when menu open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            <nav className={`fixed w-full z-50 transition-colors duration-300 border-b border-rl-white/10 ${scrolled || isOpen ? 'bg-rl-black/95 backdrop-blur-md' : 'bg-transparent'}`}>
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link 
                                href="/" 
                                className="flex items-center cursor-pointer focus-visible:outline-white focus-visible:outline-2 focus-visible:outline-offset-4 rounded" 
                                onClick={() => setIsOpen(false)}
                                aria-label="DIU Skyward Homepage"
                            >
                                <Image
                                    src="/media/images/nav-logo.png"
                                    alt="DIU Skyward Logo"
                                    width={180}
                                    height={60}
                                    className="h-10 w-auto brightness-200"
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-10">
                            {!teamDashboard && !hideSectionButtons && NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-rl-white/80 hover:text-rl-white text-xs font-bold tracking-widest uppercase transition-colors focus-visible:text-rl-white focus-visible:outline-white focus-visible:outline-2 focus-visible:outline-offset-8 rounded"
                                    aria-label={`Navigate to ${link.label}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {teamDashboard && (
                                <>
                                    <button 
                                        onClick={() => router.push('/team/dashboard')} 
                                        className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-xs font-bold tracking-widest uppercase group"
                                    >
                                        <span className="relative z-10">My Tasks</span>
                                        <div className="absolute inset-0 bg-rl-space-blue/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            if (supabase) {
                                                await supabase.auth.signOut();
                                                router.push('/login');
                                            }
                                        }} 
                                        className="relative text-red-400 hover:text-red-300 transition-all duration-300 text-xs font-bold tracking-widest uppercase group"
                                    >
                                        <span className="relative z-10">Sign Out</span>
                                        <div className="absolute inset-0 bg-red-500/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    </button>
                                </>
                            )}
                            {adminButtons && (
                                <>
                                    <button 
                                        onClick={() => router.push('/admin/dashboard')} 
                                        className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-xs font-bold tracking-widest uppercase group"
                                    >
                                        <span className="relative z-10">Dashboard</span>
                                        <div className="absolute inset-0 bg-rl-space-blue/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    </button>
                                    <button 
                                        onClick={() => router.push('/admin/missions')} 
                                        className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-xs font-bold tracking-widest uppercase group"
                                    >
                                        <span className="relative z-10">Mission</span>
                                        <div className="absolute inset-0 bg-rl-space-blue/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    </button>
                                    <button 
                                        onClick={() => router.push('/admin/news')} 
                                        className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-xs font-bold tracking-widest uppercase group"
                                    >
                                        <span className="relative z-10">News</span>
                                        <div className="absolute inset-0 bg-rl-space-blue/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    </button>
                                    <button 
                                        onClick={() => router.push('/admin/team')} 
                                        className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-xs font-bold tracking-widest uppercase group"
                                    >
                                        <span className="relative z-10">Team</span>
                                        <div className="absolute inset-0 bg-rl-space-blue/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            if (supabase) {
                                                await supabase.auth.signOut();
                                                router.push('/admin/login');
                                            }
                                        }} 
                                        className="relative text-red-400 hover:text-red-300 transition-all duration-300 text-xs font-bold tracking-widest uppercase group"
                                    >
                                        <span className="relative z-10">Sign Out</span>
                                        <div className="absolute inset-0 bg-red-500/10 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    </button>
                                </>
                            )}
                            {!teamDashboard && !hideCareerButton && (
                                <Link href="/join" className="ml-4 px-6 py-3 border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black text-xs font-bold tracking-widest uppercase transition-all duration-300">
                                    Careers / Join
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="text-rl-white hover:text-rl-light-grey transition-colors p-2"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-rl-white/10 bg-rl-black/95 backdrop-blur-md ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="flex flex-col px-6 py-8 space-y-6">
                        {!teamDashboard && !hideSectionButtons && NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-rl-white/80 hover:text-rl-white text-sm font-bold tracking-widest uppercase transition-colors py-2 border-b border-rl-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {teamDashboard && (
                            <>
                                <button 
                                    onClick={() => { router.push('/team/dashboard'); setIsOpen(false); }} 
                                    className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-sm font-bold tracking-widest uppercase py-2 border-b border-rl-white/10 text-left group"
                                >
                                    <span className="relative z-10">My Tasks</span>
                                    <div className="absolute inset-0 bg-rl-space-blue/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                                <button 
                                    onClick={async () => { 
                                        if (supabase) {
                                            await supabase.auth.signOut(); 
                                            router.push('/login'); 
                                            setIsOpen(false); 
                                        }
                                    }} 
                                    className="relative text-red-400 hover:text-red-300 transition-all duration-300 text-sm font-bold tracking-widest uppercase py-2 border-b border-rl-white/10 text-left group"
                                >
                                    <span className="relative z-10">Sign Out</span>
                                    <div className="absolute inset-0 bg-red-500/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                            </>
                        )}
                        {adminButtons && (
                            <>
                                <button 
                                    onClick={() => { router.push('/admin/dashboard'); setIsOpen(false); }} 
                                    className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-sm font-bold tracking-widest uppercase py-2 border-b border-rl-white/10 text-left group"
                                >
                                    <span className="relative z-10">Dashboard</span>
                                    <div className="absolute inset-0 bg-rl-space-blue/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                                <button 
                                    onClick={() => { router.push('/admin/missions'); setIsOpen(false); }} 
                                    className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-sm font-bold tracking-widest uppercase py-2 border-b border-rl-white/10 text-left group"
                                >
                                    <span className="relative z-10">Mission</span>
                                    <div className="absolute inset-0 bg-rl-space-blue/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                                <button 
                                    onClick={() => { router.push('/admin/news'); setIsOpen(false); }} 
                                    className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-sm font-bold tracking-widest uppercase py-2 border-b border-rl-white/10 text-left group"
                                >
                                    <span className="relative z-10">News</span>
                                    <div className="absolute inset-0 bg-rl-space-blue/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                                <button 
                                    onClick={() => { router.push('/admin/team'); setIsOpen(false); }} 
                                    className="relative text-rl-white/80 hover:text-rl-space-blue transition-all duration-300 text-sm font-bold tracking-widest uppercase py-2 border-b border-rl-white/10 text-left group"
                                >
                                    <span className="relative z-10">Team</span>
                                    <div className="absolute inset-0 bg-rl-space-blue/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                                <button 
                                    onClick={async () => {
                                        if (supabase) {
                                            await supabase.auth.signOut();
                                            router.push('/admin/login');
                                            setIsOpen(false);
                                        }
                                    }} 
                                    className="relative text-red-400 hover:text-red-300 transition-all duration-300 text-sm font-bold tracking-widest uppercase py-2 border-b border-rl-white/10 text-left group"
                                >
                                    <span className="relative z-10">Sign Out</span>
                                    <div className="absolute inset-0 bg-red-500/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                            </>
                        )}
                        {!teamDashboard && !hideCareerButton && (
                            <Link
                                href="/join"
                                className="mt-4 w-full text-center px-6 py-4 border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black text-xs font-bold tracking-widest uppercase transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Careers / Join
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-rl-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
