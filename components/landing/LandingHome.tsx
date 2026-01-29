
import React from 'react';
import SparklesIcon from '../icons/SparklesIcon';
import TrendingUpIcon from '../icons/TrendingUpIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import CubeTransparentIcon from '../icons/CubeTransparentIcon';
import StarIcon from '../icons/StarIcon';

interface LandingHomeProps {
    onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 bg-crimson/10 text-crimson rounded-xl mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{children}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; avatar: string }> = ({ quote, name, title, avatar }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex text-amber-400 mb-4">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}
        </div>
        <p className="text-gray-700 dark:text-gray-300 italic">"{quote}"</p>
        <div className="flex items-center mt-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div className="ml-4">
                <p className="font-bold text-gray-900 dark:text-white">{name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            </div>
        </div>
    </div>
);

const LandingHome: React.FC<LandingHomeProps> = ({ onGetStarted }) => {
    const companies = [
        { name: 'Google', style: 'font-sans font-medium tracking-tight' },
        { name: 'Microsoft', style: 'font-sans font-semibold' },
        { name: 'Amazon', style: 'font-serif font-bold italic' },
        { name: 'OpenAI', style: 'font-mono font-medium tracking-tighter' },
        { name: 'Tesla', style: 'font-sans font-bold tracking-[0.2em]' },
        { name: 'IBM', style: 'font-mono font-bold tracking-widest' },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-50 dark:opacity-20"></div>
                 <div className="absolute top-0 left-0 w-64 h-64 bg-crimson/10 dark:bg-crimson/20 rounded-full filter blur-3xl animate-float"></div>
                 <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full filter blur-3xl animate-float [animation-delay:'3s']"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white font-serif tracking-tight">
                                Learn Without Limits
                            </h1>
                            <p className="mt-6 text-lg lg:text-xl text-gray-600 dark:text-gray-400">
                                Unlock your potential with an AI-powered education platform designed for the future of learning. Personalized, engaging, and career-focused.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button 
                                    onClick={onGetStarted}
                                    className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-crimson rounded-full shadow-lg shadow-crimson/30 hover:bg-red-800 transition-transform duration-200 hover:scale-105 active:scale-95"
                                >
                                    Get Started Free
                                </button>
                                <a 
                                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-crimson dark:text-red-300 bg-white dark:bg-gray-800/50 rounded-full shadow-lg border-2 border-crimson/20 dark:border-red-400/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform duration-200 hover:scale-105 active:scale-95"
                                >
                                    Watch Demo
                                </a>
                            </div>
                        </div>
                        
                        {/* VFX Animated Dashboard Mockup */}
                        <div className="relative animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl w-full h-[300px] md:h-[450px] shadow-2xl overflow-hidden group">
                                
                                {/* Screen Container */}
                                <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden flex flex-col">
                                    {/* Scanning Line Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/20 to-transparent h-[15%] w-full animate-scan pointer-events-none z-30"></div>
                                    
                                    {/* Animated Background Grid */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                                    
                                    {/* Mock Dashboard Layout */}
                                    <div className="flex h-full p-4 gap-4 relative z-10">
                                        {/* Sidebar Skeleton */}
                                        <div className="w-1/4 h-full bg-gray-800/40 rounded-lg backdrop-blur-sm border border-white/5 flex flex-col gap-3 p-3">
                                            <div className="h-8 w-8 bg-crimson rounded-lg mb-4 opacity-80 animate-pulse"></div>
                                            <div className="h-2 w-3/4 bg-gray-700/50 rounded"></div>
                                            <div className="h-2 w-1/2 bg-gray-700/50 rounded"></div>
                                            <div className="h-2 w-5/6 bg-gray-700/50 rounded"></div>
                                            <div className="mt-auto h-16 w-full bg-gray-700/30 rounded-lg"></div>
                                        </div>

                                        {/* Main Content Area */}
                                        <div className="flex-1 flex flex-col gap-4">
                                            {/* Header Skeleton */}
                                            <div className="h-14 w-full bg-gray-800/40 rounded-lg backdrop-blur-sm border border-white/5 flex items-center px-4 justify-between">
                                                 <div className="h-3 w-1/3 bg-gray-700/50 rounded"></div>
                                                 <div className="flex gap-2">
                                                    <div className="h-8 w-8 bg-gray-700/50 rounded-full"></div>
                                                    <div className="h-8 w-8 bg-gray-700/50 rounded-full"></div>
                                                 </div>
                                            </div>

                                            {/* Content Area with Floating Cards */}
                                            <div className="flex-1 relative perspective-container">
                                                 {/* Floating Card 1 (Top Left) */}
                                                 <div className="absolute top-0 left-0 w-5/12 h-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 shadow-xl animate-float [animation-duration:6s] p-4 flex flex-col justify-between z-20">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                            <SparklesIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="h-2 w-16 bg-gray-600 rounded"></div>
                                                            <div className="h-1.5 w-10 bg-gray-700 rounded"></div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="h-1.5 w-full bg-gray-700/50 rounded overflow-hidden">
                                                            <div className="h-full w-2/3 bg-blue-500 rounded animate-pulse"></div>
                                                        </div>
                                                        <div className="flex justify-between text-[8px] text-gray-500">
                                                            <span>Progress</span>
                                                            <span>68%</span>
                                                        </div>
                                                    </div>
                                                 </div>

                                                 {/* Floating Card 2 (Right Side) - Analytics */}
                                                 <div className="absolute top-8 right-0 w-1/2 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 shadow-xl animate-float [animation-duration:7s] [animation-delay:1s] p-4 flex flex-col gap-3 z-10 opacity-90">
                                                     <div className="flex justify-between items-center">
                                                        <div className="h-3 w-16 bg-green-500/20 rounded-full text-green-400 text-[8px] flex items-center px-2 uppercase tracking-wide">Activity</div>
                                                     </div>
                                                     <div className="flex-1 flex items-end gap-1.5">
                                                        <div className="w-full bg-gray-700/50 rounded-t h-1/3"></div>
                                                        <div className="w-full bg-crimson/60 rounded-t h-2/3 animate-pulse"></div>
                                                        <div className="w-full bg-gray-700/50 rounded-t h-1/2"></div>
                                                        <div className="w-full bg-gray-700/50 rounded-t h-3/4"></div>
                                                        <div className="w-full bg-gray-700/50 rounded-t h-1/4"></div>
                                                     </div>
                                                 </div>

                                                 {/* Floating Card 3 (Bottom) - Stats */}
                                                 <div className="absolute bottom-2 left-6 w-3/4 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 shadow-xl animate-float [animation-duration:8s] [animation-delay:2s] p-3 flex items-center gap-4 z-30">
                                                    <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                        <TrendingUpIcon className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="h-2 w-24 bg-gray-600 rounded"></div>
                                                        <div className="h-1.5 w-32 bg-gray-700 rounded"></div>
                                                    </div>
                                                    <div className="h-6 w-12 bg-crimson rounded-md opacity-90 flex items-center justify-center text-[10px] text-white font-bold">
                                                        NEW
                                                    </div>
                                                 </div>
                                                 
                                                 {/* Background decoration circles */}
                                                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-crimson/10 rounded-full blur-2xl"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Reflection Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Trusted By Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-center text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Powering education for forward-thinking institutions
                    </h3>
                    <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6 items-center">
                        {companies.map((company) => (
                            <div key={company.name} className="col-span-1 flex justify-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-default group">
                                <span className={`text-2xl md:text-3xl text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white ${company.style}`}>
                                    {company.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-24 bg-white dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white font-serif">A Smarter Way to Learn</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                            Our platform combines cutting-edge technology with proven educational strategies to help you succeed.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="animate-stagger-in" style={{ animationDelay: '200ms' }}>
                            <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="AI-Powered Tutoring">
                                Get instant help and clear explanations from your personal AI tutor, available 24/7.
                            </FeatureCard>
                        </div>
                        <div className="animate-stagger-in" style={{ animationDelay: '300ms' }}>
                            <FeatureCard icon={<TrendingUpIcon className="w-6 h-6" />} title="Personalized Paths">
                                Our AI adapts to your learning style, suggesting courses and content tailored just for you.
                            </FeatureCard>
                        </div>
                        <div className="animate-stagger-in" style={{ animationDelay: '400ms' }}>
                            <FeatureCard icon={<BriefcaseIcon className="w-6 h-6" />} title="Career Hub">
                                Connect your skills to real-world job opportunities with our AI-driven career matching.
                            </FeatureCard>
                        </div>
                         <div className="animate-stagger-in" style={{ animationDelay: '500ms' }}>
                            <FeatureCard icon={<CubeTransparentIcon className="w-6 h-6" />} title="Immersive Learning">
                                Engage with content like never before through interactive simulations and VR classrooms.
                            </FeatureCard>
                        </div>
                    </div>
                </div>
            </section>
            
             {/* Testimonials Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white font-serif">Loved by Learners Worldwide</h2>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                        <div className="animate-stagger-in" style={{ animationDelay: '200ms' }}>
                            <TestimonialCard 
                                quote="This course took my React skills to a whole new level. Highly recommended for any serious developer!"
                                name="Mike P."
                                title="Senior Developer"
                                avatar="https://i.pravatar.cc/150?u=mikep"
                            />
                        </div>
                        <div className="animate-stagger-in" style={{ animationDelay: '300ms' }}>
                            <TestimonialCard 
                                quote="A game-changer for my design process. The future of UX is here, and this course shows you the way."
                                name="Emily R."
                                title="UX/UI Designer"
                                avatar="https://i.pravatar.cc/150?u=emilyr"
                            />
                        </div>
                         <div className="animate-stagger-in" style={{ animationDelay: '400ms' }}>
                            <TestimonialCard 
                                quote="The best free data science course I have ever taken. The content is top-notch and the instructor is wonderful."
                                name="Chris G."
                                title="Data Analyst"
                                avatar="https://i.pravatar.cc/150?u=chrisg"
                            />
                        </div>
                    </div>
                </div>
            </section>

             {/* Final CTA Section */}
            <section className="bg-white dark:bg-gray-800/50">
                <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl font-serif">
                        <span className="block">Ready to start your learning journey?</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-gray-600 dark:text-gray-400">
                        Join Cogni-Sacra today and gain access to a world of knowledge.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-crimson hover:bg-red-800 sm:w-auto"
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>
        </>
    );
};

export default LandingHome;
