import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-rl-black border-t border-rl-white/20 pt-20 pb-10">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Col */}
                    <div className="col-span-1 md:col-span-1 md:border-r border-rl-white/10 md:pr-8">
                        <Link href="/" className="block mb-6">
                            <Image
                                src="/media/images/footer-logo.png"
                                alt="DIU SKYWARD"
                                width={150}
                                height={50}
                                className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-rl-light-grey/60 text-sm mb-6 leading-relaxed">
                            Daffodil International University&apos;s advanced student-led aerospace engineering initiative.
                        </p>
                    </div>

                    {/* Site Map */}
                    <div>
                        <h4 className="font-heading font-bold text-rl-white text-sm tracking-widest mb-6 border-b border-rl-white/20 pb-2">DISCOVER</h4>
                        <ul className="space-y-4">
                            <li><Link href="/who-we-are" className="text-rl-light-grey/70 hover:text-rl-white transition-colors text-xs font-bold uppercase tracking-widest">About</Link></li>
                            <li><Link href="/programs" className="text-rl-light-grey/70 hover:text-rl-white transition-colors text-xs font-bold uppercase tracking-widest">Programs</Link></li>
                            <li><Link href="/missions" className="text-rl-light-grey/70 hover:text-rl-white transition-colors text-xs font-bold uppercase tracking-widest">Missions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="font-heading font-bold text-rl-white text-sm tracking-widest mb-6 border-b border-rl-white/20 pb-2">CONTACT</h4>
                        <ul className="space-y-4">
                            <li className="text-rl-light-grey/70 text-sm leading-relaxed">
                                Daffodil Smart City, Birulia<br />Savar, Dhaka-1216<br />Bangladesh
                            </li>
                            <li>
                                <a href="mailto:diuskyward.diuarc@gmail.com" className="text-rl-light-grey/70 hover:text-rl-white transition-colors text-sm">
                                    diuskyward.diuarc@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Action */}
                    <div>
                        <h4 className="font-heading font-bold text-rl-white text-sm tracking-widest mb-6 border-b border-rl-white/20 pb-2">CONNECT</h4>
                        <div className="flex gap-6 mb-8">
                            <a href="#" className="text-rl-light-grey/70 hover:text-rl-white text-sm font-bold transition-colors">IN</a>
                            <a href="https://www.facebook.com/profile.php/?id=61584006667931" target="_blank" rel="noopener noreferrer" className="text-rl-light-grey/70 hover:text-rl-white text-sm font-bold transition-colors">FB</a>
                            <a href="https://www.youtube.com/@DIUSkyward" target="_blank" rel="noopener noreferrer" className="text-rl-light-grey/70 hover:text-rl-white text-sm font-bold transition-colors">YT</a>
                            <a href="https://www.instagram.com/diuskyward" target="_blank" rel="noopener noreferrer" className="text-rl-light-grey/70 hover:text-rl-white text-sm font-bold transition-colors">IG</a>
                        </div>
                        <Link href="/join" className="inline-block w-full text-center px-6 py-4 border border-rl-white hover:bg-rl-white hover:text-rl-black text-rl-white text-xs font-bold tracking-widest uppercase transition-all">
                            CAREERS
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-rl-white/20 flex flex-col md:flex-row items-center justify-between text-rl-light-grey/50 text-xs">
                    <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> DIU Skyward. All Rights Reserved.</p>
                    <div className="mt-4 md:mt-0 space-x-6">
                        <Link href="/privacy" className="hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors uppercase tracking-widest">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
