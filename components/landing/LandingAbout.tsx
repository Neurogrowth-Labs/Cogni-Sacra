import React from 'react';
import { teamMembers } from '../../constants';
import { ShieldCheck, Heart, Users, Compass, ExternalLink } from 'lucide-react';

const TeamMemberCard: React.FC<{ name: string; title: string; avatarUrl: string; }> = ({ name, title, avatarUrl }) => (
    <div className="text-center group p-6 bg-slate-50 border border-slate-200/60 rounded-3xl hover:border-red-500 hover:bg-white hover:shadow-[0_4px_25px_rgba(239,68,68,0.06)] transition duration-300">
        <div className="relative mx-auto h-32 w-32 rounded-full overflow-hidden border border-slate-250 group-hover:border-red-500 transition duration-300">
            <img className="h-full w-full object-cover transform group-hover:scale-105 transition duration-300" src={avatarUrl} alt={name} />
        </div>
        <h3 className="mt-4 text-lg font-black text-slate-900">{name}</h3>
        <p className="mt-1 text-xs text-red-600 font-extrabold uppercase tracking-wider">{title}</p>
    </div>
);

const LandingAbout: React.FC = () => {
    return (
        <div className="bg-white text-slate-900 font-sans antialiased pt-28">
            {/* Page Header */}
            <section className="py-20 relative overflow-hidden bg-slate-50 border-b border-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.02),transparent)] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
                    <span className="text-xs uppercase tracking-widest text-red-600 font-black block">Origin & Purpose</span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
                        Our Mission: Sovereign <br/> Pan-African Digital Sovereignty
                    </h1>
                    <p className="text-slate-605 text-sm sm:text-base leading-relaxed font-semibold">
                        CogniSacra™ was founded to construct the ultimate decentralized digital infrastructure powering primary, tertiary, and independent academic pipelines across the continent. We believe education is a fundamental sovereign resource.
                    </p>
                </div>
            </section>

            {/* Our Values / Stats Section */}
            <section className="py-20 border-b border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200/80 space-y-3 hover:border-red-300 transition">
                            <div className="p-2.5 bg-red-100/10 text-red-600 rounded-xl w-fit"><ShieldCheck size={20} /></div>
                            <h3 className="text-base font-black text-slate-900">Cryptographic Trust</h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                Zero reliance on unverifiable PDF degrees. Direct on-chain signatures protect student hard labor and intellectual property instantly.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200/80 space-y-3 hover:border-red-300 transition">
                            <div className="p-2.5 bg-red-100/10 text-red-600 rounded-xl w-fit"><Users size={20} /></div>
                            <h3 className="text-base font-black text-slate-900">Inclusive Integration</h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                Fully structured to facilitate custom cross-border settlements, localized mobile money triggers, and off-grid offline libraries.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200/80 space-y-3 hover:border-red-300 transition">
                            <div className="p-2.5 bg-red-105/10 text-red-600 rounded-xl w-fit"><Compass size={20} /></div>
                            <h3 className="text-base font-black text-slate-900">Dynamic Evolution</h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                Adapting dynamically to match central ministry requirements, changing student drift parameters, and state credentials.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 lg:py-24 bg-white">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 font-sans">Our Founding Story</h2>
                    </div>
                     <div className="mt-8 max-w-3xl mx-auto">
                        <p className="text-slate-655 text-sm sm:text-base leading-relaxed font-semibold text-center">
                            Created in Nairobi by a cooperative division of software engineers, central ministry registrars, and university rectors, CogniSacra™ bridges administrative integrity and adaptive learning. Recognizing that standard LMS platforms fail African connectivity configurations, we synthesized an interactive suite containing blockchain credentialing, secure localized asset storage, and offline-ready companions. Today, we power millions of metrics.
                        </p>
                    </div>
                 </div>
            </section>

            {/* Our Team */}
            <section className="py-20 lg:py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">The Engineering Directorate</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-sm text-slate-500 font-bold">
                            Vetted researchers and systems engineers designing Africa's academic digital infrastructure.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map(member => (
                            <TeamMemberCard key={member.name} {...member} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingAbout;
