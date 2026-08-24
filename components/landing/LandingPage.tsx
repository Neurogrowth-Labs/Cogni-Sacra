import React, { useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import LandingHeader from './LandingHeader';
import LandingHome from './LandingHome';
import LandingAbout from './LandingAbout';
import LandingContact from './LandingContact';
import LandingServices from './LandingServices';
import LandingPricing from './LandingPricing';
import LandingFooter from './LandingFooter';

export type LandingView = 'home' | 'about' | 'contact' | 'services' | 'pricing';

// Map landing views to paths
export const landingViewToPath: Record<LandingView, string> = {
    'home': '/',
    'about': '/about-us',
    'contact': '/contact-us',
    'services': '/services',
    'pricing': '/pricing',
};

export const landingPathToView: Record<string, LandingView> = {
    '/': 'home',
    '/about-us': 'about',
    '/contact-us': 'contact',
    '/services': 'services',
    '/pricing': 'pricing',
};

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentView: LandingView = landingPathToView[location.pathname] || 'home';

    const setView = (view: LandingView) => {
        navigate(landingViewToPath[view]);
    };

    return (
        <div className="bg-[#FCFCFD] text-slate-900 min-h-screen relative selection:bg-red-100 selection:text-red-750">
            <LandingHeader currentView={currentView} setView={setView} onGetStarted={onGetStarted} />
            <main className="relative z-10">
                <Routes>
                    <Route path="/" element={<LandingHome onGetStarted={onGetStarted} />} />
                    <Route path="/about-us" element={<LandingAbout />} />
                    <Route path="/contact-us" element={<LandingContact />} />
                    <Route path="/services" element={<LandingServices />} />
                    <Route path="/pricing" element={<LandingPricing onGetStarted={onGetStarted} />} />
                    <Route path="*" element={<LandingHome onGetStarted={onGetStarted} />} />
                </Routes>
            </main>
            <LandingFooter setView={setView} />
        </div>
    );
};

export default LandingPage;
