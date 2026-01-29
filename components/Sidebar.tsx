
import React from 'react';
import HomeIcon from './icons/HomeIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import SparklesIcon from './icons/SparklesIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TrophyIcon from './icons/TrophyIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import { UserRole } from '../types';
import CogIcon from './icons/CogIcon';
import UsersIcon from './icons/UsersIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import CalendarIcon from './icons/CalendarIcon';
import { useTranslation } from '../hooks/useTranslation';
import BuildingLibraryIcon from './icons/BuildingLibraryIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import CogniSacraLogo from './icons/IntelliLearnLogo';
import SignalIcon from './icons/SignalIcon';

type NavView = 'dashboard' | 'tutor' | 'profile' | 'jobs' | 'instructor-dashboard' | 'institution-dashboard' | 'instructor-analytics' | 'community' | 'institution-learners' | 'institution-settings' | 'calendar' | 'institution-profile' | 'instructor-settings' | 'about' | 'contact' | 'data-policy' | 'terms-of-service' | 'ai-tools' | 'live-conversation';

interface SidebarProps {
    isOpen: boolean;
    onNavigate: (view: NavView) => void;
    currentView: string;
    setSidebarOpen: (isOpen: boolean) => void;
    userRole: UserRole;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; isOpen: boolean; onClick: () => void, isDisabled?: boolean }> = ({ icon, label, isActive, isOpen, onClick, isDisabled = false }) => {
    const translatedLabel = useTranslation(label);
    return (
        <li
            onClick={!isDisabled ? onClick : undefined}
            className={`relative flex items-center p-3 my-1.5 rounded-xl transition-all duration-300 group cursor-pointer
                ${isActive 
                    ? 'bg-gradient-to-r from-crimson to-rose-600 text-white shadow-glow' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                } 
                ${isOpen ? 'justify-start' : 'justify-center'} 
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={label}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
        >
            <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
            <span className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                {translatedLabel}
            </span>
            {/* Tooltip for collapsed state */}
            {!isOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
                    {translatedLabel}
                </div>
            )}
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate, currentView, setSidebarOpen, userRole }) => {
    const legalText = useTranslation('Legal');
    const dataPolicyText = useTranslation('Data Policy');
    const termsText = useTranslation('Terms of Service');
    const aiSuiteText = useTranslation('AI Suite');

    const learnerNav = (
        <>
            <NavItem
                icon={<HomeIcon />}
                label="Dashboard"
                isActive={currentView === 'dashboard' || currentView === 'course'}
                isOpen={isOpen}
                onClick={() => onNavigate('dashboard')}
            />
            <NavItem
                icon={<CalendarIcon />}
                label="Calendar"
                isActive={currentView === 'calendar'}
                isOpen={isOpen}
                onClick={() => onNavigate('calendar')}
            />
            <NavItem
                icon={<GlobeAltIcon />}
                label="Community"
                isActive={currentView === 'community'}
                isOpen={isOpen}
                onClick={() => onNavigate('community')}
            />
            <NavItem
                icon={<SparklesIcon />}
                label="AI Tutor"
                isActive={currentView === 'tutor'}
                isOpen={isOpen}
                onClick={() => onNavigate('tutor')}
            />
            <NavItem
                icon={<TrophyIcon />}
                label="Achievements"
                isActive={currentView === 'profile'}
                isOpen={isOpen}
                onClick={() => onNavigate('profile')}
            />
            <NavItem
                icon={<BriefcaseIcon />}
                label="Career Hub"
                isActive={currentView === 'jobs'}
                isOpen={isOpen}
                onClick={() => onNavigate('jobs')}
            />
        </>
    );

    const instructorNav = (
         <>
            <NavItem
                icon={<HomeIcon />}
                label="Dashboard"
                isActive={currentView === 'instructor-dashboard' || currentView === 'course-builder' || currentView === 'course'}
                isOpen={isOpen}
                onClick={() => onNavigate('instructor-dashboard')}
            />
             <NavItem
                icon={<GlobeAltIcon />}
                label="Community"
                isActive={currentView === 'community'}
                isOpen={isOpen}
                onClick={() => onNavigate('community')}
            />
            <NavItem
                icon={<BookOpenIcon />}
                label="My Courses"
                isActive={false} 
                isOpen={isOpen}
                onClick={() => onNavigate('instructor-dashboard')}
            />
            <NavItem
                icon={<ChartBarIcon />}
                label="Analytics"
                isActive={currentView === 'instructor-analytics'}
                isOpen={isOpen}
                onClick={() => onNavigate('instructor-analytics')}
            />
            <NavItem
                icon={<CalendarIcon />}
                label="Calendar"
                isActive={currentView === 'calendar'}
                isOpen={isOpen}
                onClick={() => onNavigate('calendar')}
            />
            <NavItem
                icon={<SparklesIcon />}
                label="AI Architect"
                isActive={currentView === 'tutor'}
                isOpen={isOpen}
                onClick={() => onNavigate('tutor')}
            />
            <NavItem
                icon={<CogIcon />}
                label="Settings"
                isActive={currentView === 'instructor-settings'}
                isOpen={isOpen}
                onClick={() => onNavigate('instructor-settings')}
            />
        </>
    );
    
    const institutionNav = (
         <>
            <NavItem
                icon={<ChartBarIcon />}
                label="Analytics"
                isActive={currentView === 'institution-dashboard'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-dashboard')}
            />
             <NavItem
                icon={<BuildingLibraryIcon />}
                label="Profile"
                isActive={currentView === 'institution-profile' || currentView === 'institution-profile-editing'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-profile')}
            />
            <NavItem
                icon={<UsersIcon />}
                label="Team"
                isActive={currentView === 'institution-learners'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-learners')}
            />
            <NavItem
                icon={<CogIcon />}
                label="Settings"
                isActive={currentView === 'institution-settings'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-settings')}
            />
        </>
    );
    
    const aiSuiteNav = (
        <>
            <NavItem
                icon={<SparklesIcon />}
                label="AI Tools"
                isActive={currentView === 'ai-tools'}
                isOpen={isOpen}
                onClick={() => onNavigate('ai-tools')}
            />
            <NavItem
                icon={<SignalIcon />}
                label="Live Conversation"
                isActive={currentView === 'live-conversation'}
                isOpen={isOpen}
                onClick={() => onNavigate('live-conversation')}
            />
        </>
    );

    const renderNav = () => {
        switch (userRole) {
            case 'learner': return learnerNav;
            case 'instructor': return instructorNav;
            case 'institution': return institutionNav;
            default: return learnerNav;
        }
    }

    return (
        <aside 
            className={`fixed inset-y-0 left-0 z-40 h-[calc(100vh-2rem)] my-4 ml-4 rounded-3xl glass-panel md:transition-all transition-transform duration-500 ease-in-out shadow-glass dark:shadow-glass-dark ${isOpen ? 'translate-x-0 w-64' : '-translate-x-[120%] md:translate-x-0 md:w-20'} flex flex-col`}
        >
            <div className={`flex items-center h-20 px-6 justify-between`}>
                <div className={`flex items-center space-x-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:inline-block md:opacity-0 md:w-0'}`}>
                    <CogniSacraLogo className="w-9 h-9" />
                    <span className="font-bold text-xl text-gray-900 dark:text-white font-serif tracking-tight">Cogni</span>
                </div>
                {/* Logo fallback for collapsed state */}
                {!isOpen && (
                    <div className="w-full flex justify-center">
                         <CogniSacraLogo className="w-10 h-10" />
                    </div>
                )}
                 <button onClick={() => setSidebarOpen(!isOpen)} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-transform duration-300 ${isOpen ? '' : 'rotate-180 absolute right-[-12px] bg-white dark:bg-gray-800 shadow-md border dark:border-gray-700'}`} aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 px-4 pb-4 flex flex-col justify-between overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                    <ul>
                        {renderNav()}
                    </ul>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4"></div>
                    
                    <p className={`px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        {aiSuiteText}
                    </p>
                    <ul>
                        {aiSuiteNav}
                    </ul>
                </div>

                <div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4"></div>
                    <ul>
                        <NavItem
                            icon={<InformationCircleIcon />}
                            label="About Us"
                            isActive={currentView === 'about'}
                            isOpen={isOpen}
                            onClick={() => onNavigate('about')}
                        />
                            <NavItem
                            icon={<EnvelopeIcon />}
                            label="Contact"
                            isActive={currentView === 'contact'}
                            isOpen={isOpen}
                            onClick={() => onNavigate('contact')}
                        />
                    </ul>
                    
                    <div className={`mt-4 pt-4 ${isOpen ? 'block' : 'hidden'}`}>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {legalText}
                            </p>
                            <ul className="space-y-1">
                                <li>
                                    <button onClick={() => onNavigate('data-policy')} className="text-xs text-gray-500 dark:text-gray-400 hover:text-crimson transition-colors">
                                        {dataPolicyText}
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate('terms-of-service')} className="text-xs text-gray-500 dark:text-gray-400 hover:text-crimson transition-colors">
                                        {termsText}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
