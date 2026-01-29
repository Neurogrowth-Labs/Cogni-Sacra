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
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <LandingHeader currentView={view} setView={setView} onGetStarted={onGetStarted} />
            <main>
                {renderView()}
            </main>
            <LandingFooter setView={setView} />
        </div>
    );
};

export default LandingPage;
