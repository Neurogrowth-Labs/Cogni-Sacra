import React, { useState } from 'react';
import LandingHeader from './LandingHeader';
import LandingHome from './LandingHome';
import LandingAbout from './LandingAbout';
import LandingContact from './LandingContact';
import LandingServices from './LandingServices';
import LandingPricing from './LandingPricing';
import LandingFooter from './LandingFooter';

export type LandingView = 'home' | 'about' | 'contact' | 'services' | 'pricing';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [view, setView] = useState<LandingView>('home');

    const renderView = () => {
        switch(view) {
            case 'home':
                return <LandingHome onGetStarted={onGetStarted} />;
            case 'about':
                return <LandingAbout />;
            case 'contact':
                return <LandingContact />;
            case 'services':
                return <LandingServices />;
            case 'pricing':
                return <LandingPricing onGetStarted={onGetStarted} />;
            default:
                return <LandingHome onGetStarted={onGetStarted} />;
        }
    };

    return (
        <div className="bg-[#FCFCFD] text-slate-900 min-h-screen relative selection:bg-red-100 selection:text-red-750">
            <LandingHeader currentView={view} setView={setView} onGetStarted={onGetStarted} />
            <main className="relative z-10">
                {renderView()}
            </main>
            <LandingFooter setView={setView} />
        </div>
    );
};

export default LandingPage;
