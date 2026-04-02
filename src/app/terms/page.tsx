import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="flex flex-col w-full bg-rl-black min-h-screen">
            {/* Hero */}
            <section className="relative py-40 overflow-hidden flex flex-col items-center justify-center text-center w-full bg-rl-dark-grey border-b border-rl-white/10">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-[url('/media/images/galaxy-space.png')] bg-cover bg-center" />
                <div className="relative z-20 max-w-[1400px] px-6 mt-16">
                    <span className="text-rl-light-grey font-bold tracking-[0.3em] uppercase mb-4 block text-xs sm:text-sm">
                        Terms & Conditions
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-black text-rl-white mb-6 tracking-tighter uppercase">
                        TERMS
                    </h1>
                    <p className="text-xl md:text-2xl text-rl-light-grey/90 font-light leading-relaxed max-w-3xl mx-auto">
                        The rules for using the DIU Skyward website and submitting Join / Contact information.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-32 w-full">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                Acceptance of these Terms
                            </h2>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg">
                                By accessing or using the DIU Skyward website, you agree to be bound by these Terms of Service (“Terms”).
                                If you do not agree, please do not use the website.
                            </p>
                        </div>

                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                Use of the website
                            </h2>
                            <ul className="list-disc pl-6 space-y-3 text-rl-light-grey font-light text-lg">
                                <li>You may use the website for informational and non-commercial purposes.</li>
                                <li>You agree not to interfere with the website or attempt to gain unauthorized access to systems or data.</li>
                                <li>You agree to provide accurate information when submitting forms (Join / Contact).</li>
                            </ul>
                        </div>

                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                User submissions
                            </h2>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg mb-6">
                                If you submit content through our forms, you are responsible for the information you provide.
                                By submitting, you grant DIU Skyward the right to use your submission solely to process your application and/or respond to your message.
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-rl-light-grey font-light text-lg">
                                <li>Do not submit personal data that you do not want us to store and use for these purposes.</li>
                                <li>Do not submit content that is unlawful, harmful, or violates the rights of others.</li>
                                <li>We may review submissions to ensure compliance and for security purposes.</li>
                            </ul>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg mt-6">
                                For applications, submission does not guarantee selection or participation.
                            </p>
                        </div>

                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                Intellectual property
                            </h2>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg">
                                Unless otherwise stated, all content on this website (including text, graphics, branding, and layout) is owned by DIU Skyward or used under license.
                                You may not copy, distribute, or create derivative works from our content without permission.
                            </p>
                        </div>

                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                Prohibited conduct
                            </h2>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg mb-6">
                                You agree not to:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-rl-light-grey font-light text-lg">
                                <li>Use the website for unlawful activities or to harm others.</li>
                                <li>Upload or transmit malware, spam, or other malicious content.</li>
                                <li>Attempt to bypass security or disrupt service performance.</li>
                                <li>Impersonate others or provide false information in submissions.</li>
                            </ul>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg mt-6">
                                We may suspend or remove access when we believe violations occur.
                            </p>
                        </div>

                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                Disclaimers
                            </h2>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg">
                                The website is provided on an “as is” and “as available” basis. To the maximum extent permitted by law, DIU Skyward disclaims all warranties of any kind,
                                whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                            </p>
                        </div>

                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                Limitation of liability
                            </h2>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg">
                                In no event will DIU Skyward be liable for any indirect, incidental, special, consequential, or punitive damages,
                                or any loss of profits, revenue, data, or goodwill, arising out of or related to your use of the website,
                                even if advised of the possibility of such damages.
                            </p>
                        </div>

                        <div className="border border-rl-white/20 bg-rl-dark-grey/40 p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-tight">
                                Changes to these Terms
                            </h2>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg mb-6">
                                We may update these Terms from time to time. When we do, we will revise the effective date at the top of this page (or update the content without notice where permitted by law).
                                Your continued use of the website after changes means you accept the updated Terms.
                            </p>
                            <p className="text-rl-light-grey font-light leading-relaxed text-lg">
                                Contact us at{" "}
                                <a
                                    href="mailto:diuskyward.diuarc@gmail.com"
                                    className="text-rl-white hover:text-rl-light-grey transition-colors underline underline-offset-4"
                                >
                                    diuskyward.diuarc@gmail.com
                                </a>{" "}
                                for questions.
                            </p>
                        </div>

                        <div className="pt-6 text-center">
                            <Link
                                href="/"
                                className="inline-block px-10 py-4 border border-rl-white text-rl-white hover:bg-rl-white hover:text-rl-black transition-all duration-300 text-xs sm:text-sm font-bold tracking-widest uppercase"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

