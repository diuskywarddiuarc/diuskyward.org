"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, Rocket } from "lucide-react";
import { supabase } from "@/lib/supabase";

const FIELDS = [
    { key: "name",       label: "Full Name",      type: "text",  placeholder: "Your full name" },
    { key: "email",      label: "Official Email", type: "email", placeholder: "your@diu.edu.bd" },
    { key: "studentId",  label: "Student ID",     type: "text",  placeholder: "XXX-XX-XXXX" },
    { key: "department", label: "Department",     type: "text",  placeholder: "Software Engineering" },
] as const;

export default function SendNamePage() {
    const [formData, setFormData] = useState({ name: "", email: "", studentId: "", department: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError]   = useState<string | null>(null);
    const [manifestId]        = useState(`INQ-${Math.floor(Math.random() * 89999) + 10000}`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            if (!supabase) throw new Error("Database connection not ready.");
            const { error: dbError } = await supabase.from("boarding_passes").insert([{
                name: formData.name, email: formData.email,
                student_id: formData.studentId, department: formData.department,
            }]);
            if (dbError) throw dbError;
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ── SUCCESS ── */
    if (submitted) {
        return (
            <div className="flex flex-col w-full bg-rl-black min-h-screen">
                {/* sub-nav */}
                <div className="w-full bg-rl-dark-grey border-b border-rl-white/10 pt-20 px-6">
                    <div className="max-w-[1400px] mx-auto py-4 flex gap-8">
                        <Link href="/programs/rocket" className="text-rl-light-grey hover:text-rl-white text-xs font-heading font-bold uppercase tracking-widest transition-colors">
                            ← Rocket Program
                        </Link>
                        <span className="text-rl-white text-xs font-heading font-bold uppercase tracking-widest">
                            Boarding Pass
                        </span>
                    </div>
                </div>

                <section className="flex-grow flex items-center justify-center py-32 px-6">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <div className="border border-rl-white/20 p-8 md:p-16 flex flex-col items-center justify-center text-center">
                            <CheckCircle2 className="w-16 h-16 text-rl-white mb-8" strokeWidth={1} />
                            <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight uppercase">
                                Boarding Pass Issued
                            </h1>
                            <p className="text-xl text-rl-light-grey font-light max-w-2xl mx-auto mb-4">
                                <strong className="text-rl-white">{formData.name}</strong> — your name has been encoded in Inquilab 2.0's flight manifest.
                                You are officially part of the mission.
                            </p>
                            <p className="text-sm font-mono text-rl-light-grey/60 tracking-widest uppercase mb-10">
                                Manifest ID: #{manifestId}
                            </p>
                            <Link
                                href="/programs/rocket"
                                className="inline-flex py-4 px-12 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300"
                            >
                                Return to Mission Control
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    /* ── FORM ── */
    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Sub-navigation — matches program slug style exactly */}
            <div className="w-full bg-rl-dark-grey border-b border-rl-white/10 pt-20 px-6">
                <div className="max-w-[1400px] mx-auto py-4 flex gap-8 overflow-x-auto no-scrollbar">
                    <Link
                        href="/programs/rocket"
                        className="text-rl-light-grey hover:text-rl-white text-xs font-heading font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        ← Rocket Program
                    </Link>
                    <span className="text-rl-white text-xs font-heading font-bold uppercase tracking-widest">
                        Boarding Pass
                    </span>
                </div>
            </div>

            {/* Hero */}
            <section className="relative h-[50vh] min-h-[400px] overflow-hidden flex flex-col items-center justify-center text-center w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rl-black to-transparent z-10" />
                    <div className="absolute inset-0 bg-rl-black/50 z-10" />
                    <div className="absolute inset-0 bg-[url('/media/images/spacex-rocket-bg.png')] bg-cover bg-center bg-fixed opacity-50" />
                </div>
                <div className="relative z-20 max-w-[1400px] px-6">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block text-sm">
                        Mission Inquilab 2.0
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black text-rl-white mb-4 tracking-tighter">
                        BOARDING PASS
                    </h1>
                </div>
            </section>

            {/* Form Content */}
            <section className="py-24 md:py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">

                    {/* Intro row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 pb-20 border-b border-rl-white/20">
                        <div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black mb-6 tracking-tight leading-none uppercase">
                                Send Your<br />Name With<br />Inquilab 2.0
                            </h2>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-xl md:text-2xl text-rl-light-grey font-light leading-relaxed mb-8">
                                We can't send ourselves onboard the rocket — but we can send our names. Fill out the form below to be added to the symbolic mission manifest before launch.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-rl-white/20">
                                <div>
                                    <span className="block text-4xl font-heading font-bold mb-2">8200 m</span>
                                    <span className="text-rl-light-grey text-sm tracking-widest uppercase">Target Apogee</span>
                                </div>
                                <div>
                                    <span className="block text-4xl font-heading font-bold mb-2">Mach 1.6</span>
                                    <span className="text-rl-light-grey text-sm tracking-widest uppercase">Target Velocity</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-16 tracking-tight uppercase border-b border-rl-white/20 pb-6">
                            Flight Manifest Registration
                        </h2>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Fields grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-y border-rl-white/20">
                                {FIELDS.map((field, i) => {
                                    const isLastRow  = i >= 2;
                                    const isRightCol = i % 2 === 1;
                                    return (
                                        <div
                                            key={field.key}
                                            className={[
                                                "p-10 group",
                                                isRightCol   ? "md:border-l border-rl-white/20" : "",
                                                !isLastRow   ? "border-b border-rl-white/20" : "",
                                                "hover:bg-rl-dark-grey transition-colors",
                                            ].join(" ")}
                                        >
                                            <label
                                                htmlFor={field.key}
                                                className="block text-xs font-heading font-bold tracking-widest uppercase text-rl-light-grey mb-6"
                                            >
                                                {field.label}
                                            </label>
                                            <input
                                                id={field.key}
                                                required
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={formData[field.key]}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                className="w-full bg-transparent border-b border-rl-white/20 focus:border-rl-white pb-3 text-xl text-rl-white placeholder:text-rl-white/15 outline-none transition-all duration-300 font-light font-heading"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mt-8 p-6 border-l-2 border-red-500 bg-red-500/5 text-base text-rl-light-grey font-light">
                                    {error}
                                </div>
                            )}

                            {/* Submit row */}
                            <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8">
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="inline-flex items-center gap-3 py-5 px-12 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Manifesting…" : "Submit Boarding Pass"}
                                    {!submitting && <Send className="w-4 h-4" />}
                                </button>
                                <p className="text-sm text-rl-light-grey font-light">
                                    Your name will be encoded in the mission manifest before launch day.
                                </p>
                            </div>

                            <p className="mt-8 text-xs text-rl-light-grey/40 font-light tracking-widest uppercase">
                                By submitting, you agree to have your name encoded on Inquilab 2.0's mission manifest.
                            </p>
                        </form>
                    </div>

                </div>
            </section>

        </div>
    );
}
