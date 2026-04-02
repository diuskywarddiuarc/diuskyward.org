import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard, Smartphone, CheckCircle } from "lucide-react";

export default function CrowdfundPage() {
    const PAYMENT_METHODS = [
        { name: "bKash", type: "Mobile Wallet" },
        { name: "Nagad", type: "Mobile Wallet" },
        { name: "Rocket", type: "Mobile Wallet" },
        { name: "Upay", type: "Mobile Wallet" },
        { name: "GPay", type: "Digital Wallet" },
    ];

    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">
            {/* Hero Section */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div 
                    className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: `url('/media/images/mission-static-fire-new.png')` }}
                />
                <div className="absolute inset-0 bg-rl-black/40 z-10" />
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <Link href="/" className="inline-flex items-center text-rl-light-grey hover:text-rl-white transition-colors font-heading font-bold tracking-[0.2em] uppercase text-[10px] mb-8 group">
                        <ChevronLeft className="w-3 h-3 mr-2 transition-transform group-hover:-translate-x-1" />
                        Return to Command
                    </Link>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter uppercase">
                        FUND THE MISSION
                    </h1>
                    <p className="text-xl md:text-2xl text-rl-light-grey font-light max-w-2xl mx-auto leading-relaxed">
                        Supporting the next generation of aerospace engineering and experimental rocketry in Bangladesh.
                    </p>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-32 px-6 max-w-[1400px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    
                    {/* Left: QR & Donation Info */}
                    <div className="space-y-16">
                        <div className="border border-rl-white/10 p-12 bg-rl-dark-grey relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CreditCard className="w-24 h-24" strokeWidth={1} />
                            </div>
                            <h2 className="text-3xl font-heading font-black mb-8 tracking-tight flex items-center">
                                <span className="w-8 h-px bg-rl-white mr-4" />
                                SCAN TO SUPPORT
                            </h2>
                            
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="p-4 bg-rl-white relative">
                                    <div className="w-48 h-48 bg-[url('/media/images/qr-crowdfund.png')] bg-cover bg-center" />
                                    {/* Corners for technical look */}
                                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-rl-white" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-rl-white" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <p className="text-rl-light-grey font-light leading-relaxed">
                                        Scan this QR code using bKash, Nagad, Rocket, or any local payment app to contribute directly to our hardware fund.
                                    </p>
                                    <div className="pt-4 border-t border-rl-white/10">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-rl-white/40 font-bold mb-2">Technical Registry</p>
                                        <p className="text-sm font-mono text-rl-white/60 uppercase">Reference: SKYWARD_MISSION_FUND</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-l-2 border-rl-white/10 pl-8 space-y-8">
                            <h2 className="text-2xl font-heading font-bold tracking-widest uppercase">Direct Impact</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h3 className="text-rl-white font-bold uppercase text-xs tracking-widest">Hardware</h3>
                                    <p className="text-sm text-rl-light-grey/70 font-light italic">Carbon fiber airframes, avionics, and sensors.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-rl-white font-bold uppercase text-xs tracking-widest">Reseach</h3>
                                    <p className="text-sm text-rl-light-grey/70 font-light italic">Propulsion chemistry and orbital simulation compute.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Methods & Why */}
                    <div className="space-y-20">
                        <div>
                            <h2 className="text-2xl font-heading font-bold mb-10 tracking-[0.2em] uppercase text-rl-white">Supported Gateways</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {PAYMENT_METHODS.map((method) => (
                                    <div key={method.name} className="flex items-center p-5 border border-rl-white/5 hover:border-rl-white/30 hover:bg-rl-white/5 transition-all group">
                                        <div className="w-10 h-10 flex items-center justify-center bg-rl-black mr-4 border border-rl-white/10 group-hover:border-rl-white transition-colors">
                                            <Smartphone className="w-4 h-4 text-rl-white/50 group-hover:text-rl-white" />
                                        </div>
                                        <div>
                                            <p className="font-heading font-bold text-rl-white uppercase text-xs tracking-wider">{method.name}</p>
                                            <p className="text-[9px] text-rl-light-grey/40 uppercase tracking-[0.2em] mt-1">{method.type}</p>
                                        </div>
                                        <CheckCircle className="ml-auto w-4 h-4 text-rl-white/10 group-hover:text-rl-white/40 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-rl-dark-grey p-12 border border-rl-white/5">
                            <h2 className="text-2xl font-heading font-bold mb-8 uppercase tracking-widest">Why Support Us?</h2>
                            <div className="space-y-6">
                                {[
                                    "Procurement of high-precision aerospace components.",
                                    "Funding for international aerospace competitions and certifications.",
                                    "Upgrading our test facilities and composites lab."
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-sky-400 font-mono text-xs">0{i+1}</span>
                                        <p className="text-rl-light-grey font-light leading-relaxed text-sm">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Payment Note */}
                <div className="mt-32 pt-16 border-t border-rl-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-rl-light-grey/40 text-[10px] uppercase tracking-[0.2em] font-bold text-center md:text-left">
                        Secure Transmission Encrypted / Authorized Payment Channels Only
                    </p>
                    <p className="text-rl-light-grey text-xs font-light text-center md:text-right">
                        Corporate inquiries: <span className="text-rl-white font-bold ml-2">diuskyward.diuarc@gmail.com</span>
                    </p>
                </div>
            </section>
        </div>
    );
}
