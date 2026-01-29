import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import MenuIcon from '../icons/MenuIcon';
import XMarkIcon from '../icons/XMarkIcon';
import { LandingView } from './LandingPage';

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
    <button
        onClick={() => setView(view)}
        className={`${isMobile ? 'block w-full text-left px-3 py-2 rounded-md text-base font-medium' : 'px-3 py-2 rounded-md text-sm font-semibold'} ${
            current === view
                ? 'bg-crimson/10 text-crimson dark:bg-crimson/20 dark:text-red-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
    >
        {children}
    </button>
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
        <header className="absolute top-0 left-0 right-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
                        <CogniSacraLogo className="w-8 h-8" />
                        <span className="font-bold text-xl font-serif">Cogni-Sacra</span>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navItems.map(item => (
                            <NavLink key={item.view} view={item.view} current={currentView} setView={setView}>
                                {item.label}
                            </NavLink>
                        ))}
                         <button onClick={onGetStarted} className="ml-4 px-5 py-2 text-sm font-semibold text-white bg-crimson rounded-full hover:bg-red-800 transition-colors">
                            Sign In
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navItems.map(item => (
                            <NavLink key={item.view} view={item.view} current={currentView} setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} isMobile>
                                {item.label}
                            </NavLink>
                        ))}
                         <button onClick={onGetStarted} className="mt-2 w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-crimson">
                            Sign In
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default LandingHeader;
