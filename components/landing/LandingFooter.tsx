import React from 'react';
import LinkedInIcon from '../icons/LinkedInIcon';
import GitHubIcon from '../icons/GitHubIcon';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import { LandingView } from './LandingPage';

interface LandingFooterProps {
    setView: (view: LandingView) => void;
}

const FooterLink: React.FC<{ view: LandingView, setView: (v: LandingView) => void, children: React.ReactNode }> = ({ view, setView, children }) => (
    <button onClick={() => setView(view)} className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        {children}
    </button>
);


const LandingFooter: React.FC<LandingFooterProps> = ({ setView }) => {
    return (
        <footer className="bg-white dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <div className="flex items-center space-x-2">
                             <CogniSacraLogo className="w-10 h-10" />
                            <span className="font-bold text-xl font-serif">Cogni-Sacra</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-base">
                            Learn Without Limits.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">LinkedIn</span><LinkedInIcon className="w-6 h-6" /></a>
                            <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">GitHub</span><GitHubIcon className="w-6 h-6" /></a>
                        </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><FooterLink view="home" setView={setView}>Home</FooterLink></li>
                                    <li><FooterLink view="about" setView={setView}>About</FooterLink></li>
                                    <li><FooterLink view="contact" setView={setView}>Contact</FooterLink></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Offerings</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><FooterLink view="services" setView={setView}>Services</FooterLink></li>
                                    <li><FooterLink view="pricing" setView={setView}>Pricing</FooterLink></li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-1 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                                <ul className="mt-4 space-y-4">
                                     <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Data Policy</a></li>
                                     <li><a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} Cogni-Sacra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
