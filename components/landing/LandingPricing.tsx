import React, { useState } from 'react';
import { SubscriptionTier } from '../../types';
import { learnerSubscriptionTiers, instructorSubscriptionTiers, institutionSubscriptionTiers } from '../../constants';
import { Check, Star } from 'lucide-react';

interface LandingPricingProps {
    onGetStarted: () => void;
}

const PricingTierCard: React.FC<{ tier: SubscriptionTier; onSelect: () => void }> = ({ tier, onSelect }) => (
    <div
        className={`relative flex flex-col rounded-3xl border transition duration-350 ${
            tier.featured 
                ? 'border-red-500 bg-white shadow-[0_8px_30px_rgba(239,68,68,0.08)] ring-1 ring-red-400/20' 
                : 'border-slate-200 bg-slate-50/55 shadow-sm hover:border-red-300 hover:bg-white hover:shadow-md'
        } p-8`}
    >
        {tier.featured && (
            <div className="absolute top-0 py-1.5 px-4 bg-gradient-to-r from-red-600 to-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest text-white transform -translate-y-1/2 left-1/2 -translate-x-1/2">
                Featured Configuration
            </div>
        )}
        <h3 className="text-xl font-black text-slate-900">{tier.name}</h3>
        <p className="mt-2 text-xs text-slate-500 h-10 font-bold leading-relaxed">{tier.idealFor}</p>

        <div className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-905">
                {tier.price > 0 ? `$${tier.price}` : 'Free'}
            </span>
            {tier.price > 0 && <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">/ Mo</span>}
        </div>
        
        <ul className="mt-8 space-y-3.5 flex-grow">
            {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0 p-0.5 bg-red-55 border border-red-100 rounded-lg text-red-600">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="ml-3 text-xs text-slate-658 font-semibold">{feature}</p>
                </li>
            ))}
        </ul>
        
        <button
            onClick={onSelect}
            className={`mt-8 block w-full py-3.5 px-6 rounded-xl text-center text-xs font-black uppercase tracking-widest transition duration-300 ${
                tier.featured
                    ? 'bg-gradient-to-r from-red-600 to-rose-550 text-white hover:shadow-[0_4px_15px_rgba(239,68,68,0.3)]'
                    : 'bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white border border-slate-200 hover:border-red-600'
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
        learners: 'Scale your individual goals with cloud assets & AI companions.',
        instructors: 'Direct syllabus control, automated lecture tools, & MTN monetization.',
        institutions: 'Full multi-campus enterprise dashboards & direct registrar overrides.',
    }

    return (
        <div className="bg-white text-slate-900 font-sans antialiased pt-28 min-h-[85vh]">
            <section className="py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02),transparent)] pointer-events-none" />
                
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                     <div className="text-center space-y-2">
                        <span className="text-xs uppercase tracking-widest text-red-656 font-black block">Investment plans</span>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                           Choose Your Configuration
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-sm sm:text-base font-semibold">
                           {subtitles[activeTab]}
                        </p>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <div className="relative flex p-1.5 bg-slate-105 border border-slate-200 rounded-full w-full max-w-lg">
                            <button 
                                onClick={() => setActiveTab('learners')} 
                                className={`relative z-25 w-1/3 rounded-full py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
                                    activeTab === 'learners' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Learners
                            </button>
                            <button 
                                onClick={() => setActiveTab('instructors')} 
                                className={`relative z-25 w-1/3 rounded-full py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
                                    activeTab === 'instructors' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Instructors
                            </button>
                            <button 
                                onClick={() => setActiveTab('institutions')} 
                                className={`relative z-25 w-1/3 rounded-full py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
                                    activeTab === 'institutions' ? 'text-red-605' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Institutions
                            </button>
                            
                            {/* Slide element bg */}
                            <div 
                                className="absolute top-1.5 bottom-1.5 bg-white border border-slate-200 shadow-sm rounded-full transition-all duration-300 ease-in-out" 
                                style={{ 
                                    width: 'calc((100% - 1.5rem) / 3)', 
                                    left: activeTab === 'learners' 
                                        ? '0.5rem' 
                                        : activeTab === 'instructors' 
                                            ? 'calc(33.33% + 0.25rem)' 
                                            : 'calc(66.66%)' 
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8 items-stretch">
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
