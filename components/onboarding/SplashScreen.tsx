
import React, { useEffect, useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 2000); // Logo visible for 2 seconds

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 2700); // Transition after fade out

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
            <div className="flex flex-col items-center">
                {/* Large Logo Only */}
                <CogniSacraLogo className="w-40 h-40" />

                {/* F6S Logo */}
                <a
                    href="https://www.f6s.com/cognisacra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 hover:opacity-80 transition-opacity"
                >
                    <img src="/f6s.jpeg" alt="F6S" className="h-8 w-auto object-contain" />
                </a>
            </div>
        </div>
    );
};

export default SplashScreen;
