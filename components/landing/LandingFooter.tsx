import React from 'react';
import LinkedInIcon from '../icons/LinkedInIcon';
import GitHubIcon from '../icons/GitHubIcon';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import { LandingView } from './LandingPage';
import { Terminal, Database, ShieldCheck, Cpu, GitBranch, Key, Activity } from 'lucide-react';

interface LandingFooterProps {
    setView: (view: LandingView) => void;
}

const FooterLink: React.FC<{ view: LandingView, setView: (v: LandingView) => void, children: React.ReactNode }> = ({ view, setView, children }) => (
    <button onClick={() => setView(view)} className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-all duration-300">
        {children}
    </button>
);

const LandingFooter: React.FC<LandingFooterProps> = ({ setView }) => {
    return (
        <footer className="bg-slate-50 text-slate-800 border-t border-rose-100/60 relative overflow-hidden text-left" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer Command Center</h2>
            
            {/* Decors */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-red-100/10 rounded-full filter blur-xl pointer-events-none" />
            <div className="absolute left-1/4 top-1/4 w-40 h-40 bg-rose-100/15 rounded-full filter blur-xl pointer-events-none" />

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Mini Command Center Monitor Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 p-4 bg-white border border-slate-200 rounded-2xl items-center shadow-sm">
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                        <Terminal size={14} className="text-red-600" />
                        <span>Console Node: OK-C2</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                        <Database size={14} className="text-rose-500" />
                        <span>Ledger Sync: 100% Cryptographic</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                        <ShieldCheck size={14} className="text-red-500 animate-pulse" />
                        <span>Governance Gate: active</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 md:col-span-3 lg:col-span-1 justify-end">
                        <Activity size={14} className="text-rose-500 text-right" />
                        <span>Pan-African Uplinks: 54/54</span>
                    </div>
                </div>

                <div className="xl:grid xl:grid-cols-4 xl:gap-12">
                    <div className="space-y-6 xl:col-span-1">
                        <div className="flex items-center space-x-3">
                            <div className="p-1 bg-gradient-to-tr from-red-600 to-rose-500 rounded-lg">
                                <CogniSacraLogo className="w-8 h-8 text-white" />
                            </div>
                            <span className="font-extrabold text-lg font-sans tracking-wide text-slate-900">
                                CogniSacra<span className="text-red-650">™</span>
                            </span>
                        </div>
                        <p className="text-slate-505 text-xs leading-relaxed font-semibold">
                            Africa's First Academic Digital Infrastructure. Empowering learners, institutions, educators, and researchers through a single unified digital operating system.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="p-2 bg-white hover:bg-red-50 rounded-xl border border-slate-200 transition text-slate-400 hover:text-red-600 shadow-sm">
                                <span className="sr-only">LinkedIn</span>
                                <LinkedInIcon className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white hover:bg-red-50 rounded-xl border border-slate-200 transition text-slate-400 hover:text-red-600 shadow-sm">
                                <span className="sr-only">GitHub</span>
                                <GitHubIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
                        <div className="md:grid md:grid-cols-3 md:gap-8">
                            
                            {/* Col 1 */}
                            <div>
                                <h3 className="text-[10px] font-black font-sans text-slate-400 tracking-wider uppercase pb-2 border-b border-rose-100">
                                    Platform Links
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    <li><FooterLink view="home" setView={setView}>Core Hub</FooterLink></li>
                                    <li><FooterLink view="about" setView={setView}>About Platform</FooterLink></li>
                                    <li><FooterLink view="contact" setView={setView}>Contact Registry</FooterLink></li>
                                    <li><FooterLink view="services" setView={setView}>Infrastructure Pricing</FooterLink></li>
                                </ul>
                            </div>

                            {/* Col 2 */}
                            <div>
                                <h3 className="text-[10px] font-black font-sans text-red-658 tracking-wider uppercase pb-2 border-b border-rose-100">
                                    Institution Portal
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            Chancellor Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            Course Accreditation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            Mobile Money Billing
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            Research Repositories
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Col 3 */}
                            <div>
                                <h3 className="text-[10px] font-black font-sans text-red-600 tracking-wider uppercase pb-2 border-b border-rose-100">
                                    API & Innovation
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            SDK Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            Knowledge Marketplace
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            Careers Network
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">
                                            Research Citations API
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        {/* Extra Mini Command Grid for sovereign contact details */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold pb-1 border-b border-slate-100 block">Help Desk Uplinks</span>
                            <div className="space-y-1 py-3 text-slate-700">
                                <p className="text-xs font-extrabold">CogniSacra Sovereign HQ</p>
                                <p className="text-[10px] text-slate-455 font-bold">Nairobi, Kenya</p>
                                <p className="text-[10px] text-red-600 font-mono select-all">uplink@cognisacra.org</p>
                            </div>
                            <span className="text-[8px] text-red-600 font-mono font-bold">● Active Dialing Secure</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-rose-100/60 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-450 gap-4">
                    <p className="text-xs font-semibold text-slate-400 text-center sm:text-left">
                        &copy; {new Date().getFullYear()} CogniSacra™ Academic Digital Infrastructure. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-xs font-mono font-bold">
                        <a href="#" className="text-slate-405 hover:text-red-600 transition">Legals</a>
                        <span className="text-slate-300">|</span>
                        <a href="#" className="text-slate-405 hover:text-red-600 transition">Sovereignty Code</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default LandingFooter;
