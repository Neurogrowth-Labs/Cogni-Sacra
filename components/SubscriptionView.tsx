import React from 'react';
import { SubscriptionTier } from '../types';
import CheckIcon from './icons/CheckIcon';

interface SubscriptionViewProps {
    onSelectPlan: (planName: string) => void;
    tiers: SubscriptionTier[];
    title: string;
    subtitle: string;
}

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onSelectPlan, tiers, title, subtitle }) => {
    return (
        <div className="min-h-full bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl font-serif">
                        {title}
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                        {subtitle}
                    </p>
                </div>

                <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
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
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 h-20">{tier.idealFor}</p>

                            <div className="mt-6">
                                <p className="text-5xl font-extrabold text-gray-900 dark:text-white">${tier.price}</p>
                                <p className="text-base font-medium text-gray-500 dark:text-gray-400">/ month</p>
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

                            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic">{tier.objective}</p>
                            
                            <button
                                onClick={() => onSelectPlan(tier.name)}
                                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium ${
                                    tier.featured
                                        ? 'bg-crimson text-white hover:bg-red-800'
                                        : 'bg-crimson/10 text-crimson hover:bg-crimson/20 dark:bg-crimson/20 dark:text-red-300 dark:hover:bg-crimson/30'
                                }`}
                            >
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionView;