import React, { useState } from 'react';
import { SubscriptionTier } from '../../types';
import { learnerSubscriptionTiers, instructorSubscriptionTiers, institutionSubscriptionTiers } from '../../constants';
import CheckIcon from '../icons/CheckIcon';

interface LandingPricingProps {
    onGetStarted: () => void;
}

const PricingTierCard: React.FC<{ tier: SubscriptionTier; onSelect: () => void }> = ({ tier, onSelect }) => (
    <div
        className={`relative flex flex-col rounded-2xl border ${
            tier.featured ? 'border-crimson shadow-2xl' : 'border-gray-200 dark:border-gray-700 shadow-lg'
        } bg-white dark:bg-gray-800 p-8`}
    >
        {tier.featured && (
            <div className="absolute top-0 py-1.5 px-4 bg-crimson rounded-full text-sm font-semibold uppercase tracking-wide text-white transform -translate-y-1/2 left-1/2 -translate-x-1/2">
                Most Popular
            </div>
        )}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white font-serif">{tier.name}</h3>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 h-12">{tier.idealFor}</p>

        <div className="mt-6">
            <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
                {tier.price > 0 ? `$${tier.price}` : 'Free'}
            </p>
            {tier.price > 0 && <p className="text-base font-medium text-gray-500 dark:text-gray-400">/ month</p>}
        </div>
        
        <ul className="mt-8 space-y-4 flex-grow">
            {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{feature}</p>
                </li>
            ))}
        </ul>
        
        <button
            onClick={onSelect}
            className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium ${
                tier.featured
                    ? 'bg-crimson text-white hover:bg-red-800'
                    : 'bg-crimson/10 text-crimson hover:bg-crimson/20 dark:bg-crimson/20 dark:text-red-300 dark:hover:bg-crimson/30'
            }`}
        >
            {tier.cta}
        </button>
    </div>
);


const LandingPricing: React.FC<LandingPricingProps> = ({ onGetStarted }) => {
    const [activeTab, setActiveTab] = useState<'learners' | 'instructors' | 'institutions'>('learners');

    const tiers = {
        learners: learnerSubscriptionTiers,
        instructors: instructorSubscriptionTiers,
        institutions: institutionSubscriptionTiers,
    };
    
    const subtitles = {
        learners: 'Affordable plans for every step of your learning journey.',
        instructors: 'Tools and reach to grow your audience and revenue.',
        institutions: 'Scalable solutions to empower your entire organization.',
    }

    return (
        <div className="pt-16">
            <section className="py-20 lg:py-24">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-serif">
                           Choose Your Plan
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                           {subtitles[activeTab]}
                        </p>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <div className="relative flex p-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <button onClick={() => setActiveTab('learners')} className={`relative w-1/3 rounded-full py-2 text-sm font-semibold transition-colors ${activeTab === 'learners' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Learners</button>
                            <button onClick={() => setActiveTab('instructors')} className={`relative w-1/3 rounded-full py-2 text-sm font-semibold transition-colors ${activeTab === 'instructors' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Instructors</button>
                            <button onClick={() => setActiveTab('institutions')} className={`relative w-1/3 rounded-full py-2 text-sm font-semibold transition-colors ${activeTab === 'institutions' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Institutions</button>
                            <div className={`absolute top-1 bottom-1 bg-white dark:bg-gray-800 rounded-full shadow-md transition-all duration-300 ease-in-out`} style={{ width: 'calc((100% - 0.5rem) / 3)', left: activeTab === 'learners' ? '0.25rem' : activeTab === 'instructors' ? 'calc(33.33% + 0.125rem)' : 'calc(66.66% - 0.125rem)' }}></div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
                        {tiers[activeTab].map(tier => (
                            <PricingTierCard key={tier.name} tier={tier} onSelect={onGetStarted} />
                        ))}
                    </div>
                 </div>
            </section>
        </div>
    );
};

export default LandingPricing;
