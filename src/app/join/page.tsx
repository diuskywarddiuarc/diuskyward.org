"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function JoinPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        studentId: "",
        department: "",
        division: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit application');
            }

            setSubmitted(true);
            setFormData({ fullName: "", studentId: "", department: "", division: "", message: "" });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-[url('/media/images/galaxy-space.png')] bg-cover bg-center" />
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">Recruitment</span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        JOIN SKYWARD
                    </h1>
                </div>
            </section>

            {/* Application Form */}
            <section className="py-32 w-full">
                <div className="max-w-3xl mx-auto px-6">

                    <div className="bg-rl-black border border-rl-white/20 p-10 md:p-16">

                        {submitted ? (
                            <div className="text-center py-20 animate-fade-in">
                                <div className="w-24 h-24 border border-rl-white/50 text-rl-white flex items-center justify-center mx-auto mb-8">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-heading font-bold mb-6 tracking-widest uppercase">APPLICATION RECEIVED</h3>
                                <p className="text-rl-light-grey font-light text-lg">Thank you for your interest in DIU Skyward. Our recruiting team will review your profile and contact you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-12 text-rl-white hover:text-rl-light-grey text-xs font-bold tracking-widest uppercase underline underline-offset-8"
                                >
                                    Submit Another Application
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 text-xs font-bold tracking-widest uppercase animate-shake">
                                        Error: {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Full Name</label>
                                        <input
                                            required
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full bg-transparent border border-rl-white/30 px-5 py-4 text-rl-white placeholder-rl-white/20 focus:outline-none focus:border-rl-white transition-colors uppercase text-sm font-bold tracking-wider rounded-none"
                                            placeholder="JOHN DOE"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Student ID</label>
                                        <input
                                            required
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full bg-transparent border border-rl-white/30 px-5 py-4 text-rl-white placeholder-rl-white/20 focus:outline-none focus:border-rl-white transition-colors uppercase text-sm font-bold tracking-wider rounded-none"
                                            placeholder="XXX-XX-XXXX"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Department</label>
                                        <select
                                            required
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full bg-rl-black border border-rl-white/30 px-5 py-4 text-rl-white focus:outline-none focus:border-rl-white transition-colors uppercase text-sm font-bold tracking-wider rounded-none appearance-none"
                                        >
                                            <option value="" disabled className="lowercase font-sans text-rl-light-grey">Select Department</option>
                                            <option value="SWE" className="uppercase">Software Engineering (SWE)</option>
                                            <option value="CSE" className="uppercase">Computer Science (CSE)</option>
                                            <option value="EEE" className="uppercase">Electrical Engineering (EEE)</option>
                                            <option value="ICE" className="uppercase">Information & Communication Engineering (ICE)</option>
                                            <option value="Other" className="uppercase">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Target Division</label>
                                        <select
                                            required
                                            name="division"
                                            value={formData.division}
                                            onChange={handleChange}
                                            className="w-full bg-rl-black border border-rl-white/30 px-5 py-4 text-rl-white focus:outline-none focus:border-rl-white transition-colors uppercase text-sm font-bold tracking-wider rounded-none appearance-none"
                                        >
                                            <option value="" disabled className="lowercase font-sans text-rl-light-grey">Select Division</option>
                                            <option value="Propulsion" className="uppercase">Propulsion & Aerodynamics</option>
                                            <option value="Avionics" className="uppercase">Avionics & Telemetry</option>
                                            <option value="Software" className="uppercase">Flight Software</option>
                                            <option value="Robotics" className="uppercase">Robotics & Rovers</option>
                                            <option value="Media" className="uppercase">Media & Communications</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Why do you want to join?</label>
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full bg-transparent border border-rl-white/30 px-5 py-4 text-rl-white placeholder-rl-white/20 focus:outline-none focus:border-rl-white transition-colors text-sm font-light leading-relaxed resize-none rounded-none"
                                        placeholder="Briefly describe your interest and any relevant experience..."
                                    />
                                </div>

                                <div className="pt-8">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-4 py-5 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "PROCESSING..." : "SUBMIT APPLICATION"}
                                        {!loading && <Send className="w-5 h-5" strokeWidth={1.5} />}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </section>

        </div>
    );
}
