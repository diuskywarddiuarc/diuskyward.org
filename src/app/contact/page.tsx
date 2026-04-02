"use client";

import { MapPin, Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send message');
            }

            setSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">

            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-[url('/media/images/hero-ocean.png')] bg-cover bg-center" />
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block">Connect</span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter">
                        CONTACT
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

                        {/* Contact Info & Map */}
                        <div className="space-y-16">
                            <div>
                                <h2 className="text-4xl font-heading font-black mb-12 tracking-tight">DETAILS</h2>
                                <div className="space-y-10">
                                    <div className="flex items-start gap-6 border-b border-rl-white/10 pb-8">
                                        <div className="text-rl-white shrink-0">
                                            <MapPin className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-bold text-xl uppercase mb-2 tracking-widest">Headquarters</h3>
                                            <p className="text-rl-light-grey font-light leading-relaxed">Daffodil Smart City, Birulia<br />Savar, Dhaka-1216<br />Bangladesh</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 border-b border-rl-white/10 pb-8">
                                        <div className="text-rl-white shrink-0">
                                            <Mail className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-bold text-xl uppercase mb-2 tracking-widest">Email</h3>
                                            <a href="mailto:diuskyward.diuarc@gmail.com" className="block text-rl-light-grey font-light hover:text-rl-white transition-colors">diuskyward.diuarc@gmail.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 border-b border-rl-white/10 pb-8">
                                        <div className="text-rl-white shrink-0">
                                            <Phone className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-bold text-xl uppercase mb-2 tracking-widest">Phone</h3>
                                            <p className="text-rl-light-grey font-light">+880 1XXX-XXXXXX <span className="opacity-50 ml-2">(General)</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-rl-dark-grey border border-rl-white/20 min-h-[300px] relative group overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/media/images/tech-setup.png')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-rl-black/80 backdrop-blur-md px-8 py-6 border border-rl-white/20 text-center pointer-events-auto">
                                        <MapPin className="w-10 h-10 text-rl-white mx-auto mb-4" strokeWidth={1.5} />
                                        <span className="font-heading font-bold tracking-widest text-sm uppercase">VIEW ON MAP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-rl-dark-grey border border-rl-white/10 p-10 md:p-16">
                            <h2 className="text-4xl font-heading font-black mb-12 tracking-tight">MESSAGE</h2>

                            {submitted ? (
                                <div className="py-20 text-center animate-fade-in">
                                    <CheckCircle className="w-16 h-16 text-rl-white mx-auto mb-6 opacity-50" strokeWidth={1} />
                                    <h3 className="text-2xl font-heading font-bold mb-4 tracking-widest uppercase">MESSAGE SENT</h3>
                                    <p className="text-rl-light-grey font-light mb-10">We have received your message and will get back to you soon.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-rl-white hover:text-rl-light-grey text-xs font-bold tracking-widest uppercase underline underline-offset-8"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 text-xs font-bold tracking-widest uppercase">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Full Name</label>
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full bg-transparent border border-rl-white/20 px-5 py-4 text-rl-white placeholder-rl-white/10 focus:outline-none focus:border-rl-white transition-colors uppercase text-sm font-bold tracking-wider rounded-none"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Email Address</label>
                                        <input
                                            required
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            className="w-full bg-transparent border border-rl-white/20 px-5 py-4 text-rl-white placeholder-rl-white/10 focus:outline-none focus:border-rl-white transition-colors text-sm font-bold tracking-wider rounded-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Subject</label>
                                        <input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full bg-transparent border border-rl-white/20 px-5 py-4 text-rl-white placeholder-rl-white/10 focus:outline-none focus:border-rl-white transition-colors uppercase text-sm font-bold tracking-wider rounded-none"
                                            placeholder="General Inquiry"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-heading font-bold text-rl-white uppercase tracking-widest">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full bg-transparent border border-rl-white/20 px-5 py-4 text-rl-white placeholder-rl-white/10 focus:outline-none focus:border-rl-white transition-colors text-sm font-light leading-relaxed resize-none rounded-none"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-4 py-5 bg-transparent border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black font-heading font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
                                        >
                                            {loading ? "SENDING..." : "SEND MESSAGE"}
                                            {!loading && <Send className="w-5 h-5" strokeWidth={1.5} />}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
