import React, { useState } from 'react';
import { interests } from '../../constants';

interface PersonalizationViewProps {
    onComplete: (interests: string[]) => void;
}

const InterestPill: React.FC<{
    name: string;
    icon: string;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ name, icon, isSelected, onSelect }) => (
    <button
        onClick={onSelect}
        className={`flex items-center p-4 border-2 rounded-lg shadow-sm transition-all duration-200 ${
            isSelected 
                ? 'bg-crimson/10 dark:bg-crimson/20 border-crimson ring-2 ring-crimson' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-crimson/50 dark:hover:border-crimson/70'
        }`}
    >
        <span className="text-2xl mr-3">{icon}</span>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{name}</span>
    </button>
);


const PersonalizationView: React.FC<PersonalizationViewProps> = ({ onComplete }) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interestName: string) => {
        setSelectedInterests(prev => 
            prev.includes(interestName) 
            ? prev.filter(i => i !== interestName) 
            : [...prev, interestName]
        );
    };

    return (
        <div className="w-full max-w-4xl p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">
                    Personalize Your Experience
                </h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Select a few interests to get tailored course recommendations.
                </p>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {interests.map(interest => (
                    <InterestPill
                        key={interest.name}
                        name={interest.name}
                        icon={interest.icon}
                        isSelected={selectedInterests.includes(interest.name)}
                        onSelect={() => toggleInterest(interest.name)}
                    />
                ))}
            </div>
            <div className="mt-8 text-center">
                <button 
                    onClick={() => onComplete(selectedInterests)}
                    disabled={selectedInterests.length === 0}
                    className="px-10 py-4 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transition-transform hover:scale-105"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PersonalizationView;