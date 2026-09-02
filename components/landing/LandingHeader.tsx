import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import MenuIcon from '../icons/MenuIcon';
import XMarkIcon from '../icons/XMarkIcon';
import { LandingView, landingViewToPath } from './LandingPage';

interface LandingHeaderProps {
    currentView: LandingView;
    setView: (view: LandingView) => void;
    onGetStarted: () => void;
}

const NavLink: React.FC<{
    view: LandingView;
    current: LandingView;
    setView: (view: LandingView) => void;
    children: React.ReactNode;
    isMobile?: boolean;
}> = ({ view, current, setView, children, isMobile = false }) => (
    <Link
        to={landingViewToPath[view]}
        onClick={() => setView(view)}
        className={`${isMobile ? 'block w-full text-left px-4 py-2 text-base font-semibold' : 'px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all duration-305'} ${
            current === view
                ? 'bg-red-50 text-red-600 border border-red-200/60 shadow-[0_2px_12px_rgba(239,68,68,0.08)]'
                : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
        }`}
    >
        {children}
    </Link>
);


const LandingHeader: React.FC<LandingHeaderProps> = ({ currentView, setView, onGetStarted }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navItems: { view: LandingView; label: string }[] = [
        { view: 'home', label: 'Home' },
        { view: 'about', label: 'About Us' },
        { view: 'services', label: 'Services' },
        { view: 'pricing', label: 'Pricing' },
        { view: 'contact', label: 'Contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100/60 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex-shrink-0 flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(239,68,68,0.2)]">
                            <CogniSacraLogo className="w-full h-full" />
                        </div>
                        <span className="font-extrabold text-lg sm:text-xl font-sans tracking-wider text-slate-900 flex items-center gap-1">
                            CogniSacra<span className="text-red-600">™</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex md:items-center md:space-x-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/50">
                        {navItems.map(item => (
                            <NavLink key={item.view} view={item.view} current={currentView} setView={setView}>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                         <Link to="/signin" onClick={onGetStarted} className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-crimson to-rose-600 hover:from-rose-600 hover:to-crimson rounded-full shadow-[0_4px_15px_rgba(165,28,48,0.3)] hover:shadow-[0_6px_25px_rgba(165,28,48,0.45)] transition-all duration-300 transform hover:-translate-y-0.5">
                            Sign In
                         </Link>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-slate-50 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6 text-slate-800" /> : <MenuIcon className="block h-6 w-6 text-slate-800" />}
                        </button>
                    </div>
                </div>
            </div>
            
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 border-b border-rose-100 backdrop-blur-lg" id="mobile-menu">
                    <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 text-center">
                         {navItems.map(item => (
                            <NavLink key={item.view} view={item.view} current={currentView} setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} isMobile>
                                {item.label}
                            </NavLink>
                        ))}
                         <Link to="/signin" onClick={onGetStarted} className="mt-4 w-11/12 ml-auto mr-auto block px-4 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-500">
                            Sign In
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default LandingHeader;
