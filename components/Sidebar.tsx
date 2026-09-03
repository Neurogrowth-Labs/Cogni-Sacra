
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { viewToPath, View } from '../App';
import CogniSacraLogo from './icons/IntelliLearnLogo';
import {
    Home,
    Calendar,
    Video,
    Globe,
    Sparkles,
    Trophy,
    Briefcase,
    BookOpen,
    BarChart3,
    Settings,
    Building2,
    Users,
    Info,
    Mail,
    ChevronLeft,
    Brain,
    Network,
    Compass,
    Database,
    Film,
    ShoppingCart,
    Award,
    MessageSquare,
    Mic,
    Upload,
    Shield,
    GraduationCap,
    Library,
    UserCog
} from 'lucide-react';

type NavView = View;

interface SidebarProps {
    isOpen: boolean;
    onNavigate: (view: NavView, subTab?: string) => void;
    currentView: string;
    setSidebarOpen: (isOpen: boolean) => void;
    userRole: UserRole;
    libraryActiveTab?: string;
    tutorActiveTab?: string;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; isOpen: boolean; onClick: () => void; to?: string; isDisabled?: boolean }> = ({ icon, label, isActive, isOpen, onClick, to, isDisabled = false }) => {
    const translatedLabel = useTranslation(label);
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        if (isDisabled) return;
        if (to) {
            e.preventDefault();
            navigate(to);
        }
        onClick();
    };

    const content = (
        <>
            <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
            <span className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                {translatedLabel}
            </span>
            {/* Tooltip for collapsed state */}
            {!isOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
                    {translatedLabel}
                </div>
            )}
        </>
    );

    const className = `relative flex items-center p-3 my-1.5 rounded-xl transition-all duration-300 group cursor-pointer
        ${isActive
            ? 'bg-gradient-to-r from-crimson to-rose-600 text-white shadow-glow'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
        }
        ${isOpen ? 'justify-start' : 'justify-center'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    if (to && !isDisabled) {
        return (
            <li>
                <Link
                    to={to}
                    onClick={handleClick}
                    className={className}
                    aria-label={label}
                >
                    {content}
                </Link>
            </li>
        );
    }

    return (
        <li
            onClick={handleClick}
            className={className}
            role="button"
            tabIndex={0}
            aria-label={label}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
        >
            {content}
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate, currentView, setSidebarOpen, userRole, libraryActiveTab, tutorActiveTab }) => {
    const legalText = useTranslation('Legal');
    const dataPolicyText = useTranslation('Data Policy');
    const termsText = useTranslation('Terms of Service');
    const aiSuiteText = useTranslation('AI Suite');

    const [isLibraryExpanded, setLibraryExpanded] = React.useState(currentView === 'library');
    const [isTutorExpanded, setTutorExpanded] = React.useState(currentView === 'tutor');

    React.useEffect(() => {
        if (currentView === 'library') {
            setLibraryExpanded(true);
        }
    }, [currentView]);

    React.useEffect(() => {
        if (currentView === 'tutor') {
            setTutorExpanded(true);
        }
    }, [currentView]);

    const librarySubItems = [
        { id: 'twin', label: 'CogniSacra Twin', icon: <Brain size={15} /> },
        { id: 'universe', label: 'Knowledge Universe', icon: <Network size={15} /> },
        { id: 'reader', label: 'AI Reading Mode', icon: <BookOpen size={15} /> },
        { id: 'research', label: 'AI Research Desk', icon: <Compass size={15} /> },
        { id: 'labs', label: 'STEM Lab Sandbox', icon: <Database size={15} /> },
        { id: 'workspace', label: 'Study Cockpit', icon: <Settings size={15} /> },
        { id: 'video', label: 'Video Intelligence', icon: <Film size={15} /> },
        { id: 'market', label: 'Marketplace', icon: <ShoppingCart size={15} /> },
        { id: 'network', label: 'Scholar Circle', icon: <Users size={15} /> },
        { id: 'passport', label: 'Academic Passport', icon: <Award size={15} /> },
    ];

    const librarySubNav = isOpen && isLibraryExpanded && (
        <ul className="pl-4 space-y-1 my-1 border-l-2 border-slate-200/60 dark:border-slate-800 ml-6 animate-fade-in text-left">
            {librarySubItems.map(item => {
                const isSubActive = currentView === 'library' && libraryActiveTab === item.id;
                return (
                    <li
                        key={item.id}
                        onClick={() => onNavigate('library', item.id)}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition cursor-pointer select-none
                            ${isSubActive 
                                ? 'bg-crimson/10 text-crimson dark:text-rose-400 font-extrabold border-r-2 border-crimson' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-805/40 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('library', item.id); }}
                    >
                        <span className={`shrink-0 ${isSubActive ? 'text-crimson' : 'text-gray-400 dark:text-gray-500'}`}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                    </li>
                );
            })}
        </ul>
    );

    const tutorSubItems = [
        { id: 'ask-tutor', label: 'Ask Tutor', icon: <MessageSquare size={13} /> },
        { id: 'voice-tutor', label: 'Voice Tutor', icon: <Mic size={13} /> },
        { id: 'video-tutor', label: 'Video Tutor', icon: <Film size={13} /> },
        { id: 'study-mode', label: 'Study Mode', icon: <BookOpen size={13} /> },
        { id: 'homework-help', label: 'Homework Help', icon: <Upload size={13} /> },
        { id: 'exam-prep', label: 'Exam Prep', icon: <Award size={13} /> },
    ];

    const tutorSubNav = isOpen && isTutorExpanded && (
        <ul className="pl-4 space-y-1 my-1 border-l-2 border-slate-200/60 dark:border-slate-800 ml-6 animate-fade-in text-left">
            {tutorSubItems.map(item => {
                const isSubActive = currentView === 'tutor' && tutorActiveTab === item.id;
                return (
                    <li
                        key={item.id}
                        onClick={() => onNavigate('tutor', item.id)}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition cursor-pointer select-none
                            ${isSubActive 
                                ? 'bg-crimson/10 text-crimson dark:text-red-400 font-extrabold border-r-2 border-crimson' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-851/40 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('tutor', item.id); }}
                    >
                        <span className={`shrink-0 ${isSubActive ? 'text-crimson' : 'text-gray-400 dark:text-gray-500'}`}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                    </li>
                );
            })}
        </ul>
    );

    const learnerNav = (
        <>
            <NavItem
                icon={<Home size={20} />}
                label="Dashboard"
                isActive={currentView === 'dashboard' || currentView === 'course'}
                isOpen={isOpen}
                to={viewToPath['dashboard']}
                onClick={() => onNavigate('dashboard')}
            />
            <NavItem
                icon={<Calendar size={20} />}
                label="Calendar"
                isActive={currentView === 'calendar'}
                isOpen={isOpen}
                to={viewToPath['calendar']}
                onClick={() => onNavigate('calendar')}
            />
            <NavItem
                icon={<Video size={20} />}
                label="Attend Class"
                isActive={currentView === 'virtual-class'}
                isOpen={isOpen}
                to={viewToPath['virtual-class']}
                onClick={() => onNavigate('virtual-class')}
            />
            <NavItem
                icon={<Globe size={20} />}
                label="Community"
                isActive={currentView === 'community'}
                isOpen={isOpen}
                to={viewToPath['community']}
                onClick={() => onNavigate('community')}
            />
            <NavItem
                icon={<Sparkles size={20} />}
                label="AI Tutor"
                isActive={currentView === 'tutor'}
                isOpen={isOpen}
                to={viewToPath['tutor']}
                onClick={() => {
                    onNavigate('tutor');
                    setTutorExpanded(!isTutorExpanded);
                }}
            />
            {tutorSubNav}
            <NavItem
                icon={<Trophy size={20} />}
                label="Achievements"
                isActive={currentView === 'profile'}
                isOpen={isOpen}
                to={viewToPath['profile']}
                onClick={() => onNavigate('profile')}
            />
            <NavItem
                icon={<Briefcase size={20} />}
                label="Career Hub"
                isActive={currentView === 'jobs'}
                isOpen={isOpen}
                to={viewToPath['jobs']}
                onClick={() => onNavigate('jobs')}
            />
            <NavItem
                icon={<BookOpen size={20} />}
                label="Virtual Library"
                isActive={currentView === 'library'}
                isOpen={isOpen}
                to={viewToPath['library']}
                onClick={() => {
                    onNavigate('library');
                    setLibraryExpanded(!isLibraryExpanded);
                }}
            />
            {librarySubNav}
        </>
    );

    const instructorNav = (
         <>
            <NavItem
                icon={<Home size={20} />}
                label="Dashboard"
                isActive={currentView === 'instructor-dashboard' || currentView === 'course-builder' || currentView === 'course'}
                isOpen={isOpen}
                to={viewToPath['instructor-dashboard']}
                onClick={() => onNavigate('instructor-dashboard')}
            />
             <NavItem
                icon={<Globe size={20} />}
                label="Community"
                isActive={currentView === 'community'}
                isOpen={isOpen}
                to={viewToPath['community']}
                onClick={() => onNavigate('community')}
            />
            <NavItem
                icon={<BookOpen size={20} />}
                label="My Courses"
                isActive={false}
                isOpen={isOpen}
                to={viewToPath['instructor-dashboard']}
                onClick={() => onNavigate('instructor-dashboard')}
            />
            <NavItem
                icon={<BookOpen size={20} />}
                label="Virtual Library"
                isActive={currentView === 'library'}
                isOpen={isOpen}
                to={viewToPath['library']}
                onClick={() => {
                    onNavigate('library');
                    setLibraryExpanded(!isLibraryExpanded);
                }}
            />
            {librarySubNav}
            <NavItem
                icon={<BarChart3 size={20} />}
                label="Analytics"
                isActive={currentView === 'instructor-analytics'}
                isOpen={isOpen}
                to={viewToPath['instructor-analytics']}
                onClick={() => onNavigate('instructor-analytics')}
            />
            <NavItem
                icon={<Calendar size={20} />}
                label="Calendar"
                isActive={currentView === 'calendar'}
                isOpen={isOpen}
                to={viewToPath['calendar']}
                onClick={() => onNavigate('calendar')}
            />
            <NavItem
                icon={<Sparkles size={20} />}
                label="AI Architect"
                isActive={currentView === 'tutor'}
                isOpen={isOpen}
                to={viewToPath['tutor']}
                onClick={() => onNavigate('tutor')}
            />
            <NavItem
                icon={<Settings size={20} />}
                label="Settings"
                isActive={currentView === 'instructor-settings'}
                isOpen={isOpen}
                to={viewToPath['instructor-settings']}
                onClick={() => onNavigate('instructor-settings')}
            />
        </>
    );
    
    const institutionNav = (
         <>
            <NavItem
                icon={<BarChart3 size={20} />}
                label="Analytics"
                isActive={currentView === 'institution-dashboard'}
                isOpen={isOpen}
                to={viewToPath['institution-dashboard']}
                onClick={() => onNavigate('institution-dashboard')}
            />
            <NavItem
                icon={<Video size={20} />}
                label="Portal"
                isActive={currentView === 'institution-portal'}
                isOpen={isOpen}
                to={viewToPath['institution-portal']}
                onClick={() => onNavigate('institution-portal')}
            />
            <NavItem
                icon={<BookOpen size={20} />}
                label="Academy Library"
                isActive={currentView === 'library'}
                isOpen={isOpen}
                to={viewToPath['library']}
                onClick={() => onNavigate('library')}
            />
            <NavItem
                icon={<Building2 size={20} />}
                label="Profile"
                isActive={currentView === 'institution-profile' || currentView === 'institution-profile-editing'}
                isOpen={isOpen}
                to={viewToPath['institution-profile']}
                onClick={() => onNavigate('institution-profile')}
            />
            <NavItem
                icon={<Users size={20} />}
                label="Team"
                isActive={currentView === 'institution-learners'}
                isOpen={isOpen}
                to={viewToPath['institution-learners']}
                onClick={() => onNavigate('institution-learners')}
            />
            <NavItem
                icon={<Settings size={20} />}
                label="Settings"
                isActive={currentView === 'institution-settings'}
                isOpen={isOpen}
                to={viewToPath['institution-settings']}
                onClick={() => onNavigate('institution-settings')}
            />
            <NavItem
                icon={<Sparkles size={20} className="text-amber-500 fill-amber-500 animate-pulse" />}
                label="AI Architect ⭐"
                isActive={currentView === 'ai-architect'}
                isOpen={isOpen}
                to={viewToPath['ai-architect']}
                onClick={() => onNavigate('ai-architect')}
            />
        </>
    );

    const platformAdminNav = (
        <>
            <NavItem
                icon={<Shield size={20} />}
                label="Admin Dashboard"
                isActive={currentView === 'admin-dashboard'}
                isOpen={isOpen}
                to={viewToPath['admin-dashboard']}
                onClick={() => onNavigate('admin-dashboard')}
            />
            <NavItem
                icon={<UserCog size={20} />}
                label="User Management"
                isActive={currentView === 'admin-users'}
                isOpen={isOpen}
                to={viewToPath['admin-users']}
                onClick={() => onNavigate('admin-users')}
            />
            <NavItem
                icon={<GraduationCap size={20} />}
                label="Course Management"
                isActive={currentView === 'admin-courses'}
                isOpen={isOpen}
                to={viewToPath['admin-courses']}
                onClick={() => onNavigate('admin-courses')}
            />
            <NavItem
                icon={<Library size={20} />}
                label="Library Management"
                isActive={currentView === 'admin-library'}
                isOpen={isOpen}
                to={viewToPath['admin-library']}
                onClick={() => onNavigate('admin-library')}
            />
            <NavItem
                icon={<BarChart3 size={20} />}
                label="Platform Analytics"
                isActive={currentView === 'admin-analytics'}
                isOpen={isOpen}
                to={viewToPath['admin-analytics']}
                onClick={() => onNavigate('admin-analytics')}
            />
            <NavItem
                icon={<Settings size={20} />}
                label="Platform Settings"
                isActive={currentView === 'admin-settings'}
                isOpen={isOpen}
                to={viewToPath['admin-settings']}
                onClick={() => onNavigate('admin-settings')}
            />
        </>
    );

    const aiSuiteNav = (
        <>
            {userRole === 'instructor' && (
                <NavItem
                    icon={<Sparkles size={20} />}
                    label="AI Tools"
                    isActive={currentView === 'ai-tools'}
                    isOpen={isOpen}
                    to={viewToPath['ai-tools']}
                    onClick={() => onNavigate('ai-tools')}
                />
            )}
            {userRole === 'instructor' && (
                <NavItem
                    icon={<Video size={20} />}
                    label="Go Live"
                    isActive={currentView === 'virtual-class'}
                    isOpen={isOpen}
                    to={viewToPath['virtual-class']}
                    onClick={() => onNavigate('virtual-class')}
                />
            )}
        </>
    );

    const renderNav = () => {
        switch (userRole) {
            case 'learner': return learnerNav;
            case 'instructor': return instructorNav;
            case 'institution': return institutionNav;
            case 'platform_admin': return platformAdminNav;
            default: return learnerNav;
        }
    }

    return (
        <aside 
            className={`h-full my-4 ml-4 rounded-3xl glass-panel flex flex-col shadow-glass dark:shadow-glass-dark transition-all duration-500 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}
        >
            <div className={`flex items-center h-20 px-6 justify-between flex-shrink-0`}>
                <div className={`flex items-center space-x-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    <CogniSacraLogo className="w-9 h-9" />
                    <span className="font-bold text-lg text-gray-900 dark:text-white font-serif tracking-tight whitespace-nowrap">CogniSacra</span>
                </div>
                {/* Logo fallback for collapsed state */}
                {!isOpen && (
                    <div className="w-full flex justify-center">
                         <CogniSacraLogo className="w-10 h-10" />
                    </div>
                )}
                 <button onClick={() => setSidebarOpen(!isOpen)} className={`hidden lg:block p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-transform duration-300 ${isOpen ? '' : 'rotate-180 absolute right-[-12px] top-8 bg-white dark:bg-gray-800 shadow-md border dark:border-gray-700'}`} aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
                    <ChevronLeft size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 pb-4 flex flex-col justify-between overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                    <ul>
                        {renderNav()}
                    </ul>

                    {userRole !== 'learner' && (
                        <>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4"></div>
                            
                            <p className={`px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                {aiSuiteText}
                            </p>
                            <ul>
                                {aiSuiteNav}
                            </ul>
                        </>
                    )}
                </div>

                <div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4"></div>
                    <ul>
                        <NavItem
                            icon={<Info size={20} />}
                            label="About Us"
                            isActive={currentView === 'about'}
                            isOpen={isOpen}
                            to={viewToPath['about']}
                            onClick={() => onNavigate('about')}
                        />
                        <NavItem
                            icon={<Mail size={20} />}
                            label="Contact"
                            isActive={currentView === 'contact'}
                            isOpen={isOpen}
                            to={viewToPath['contact']}
                            onClick={() => onNavigate('contact')}
                        />
                    </ul>

                    <div className={`mt-4 pt-4 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {legalText}
                            </p>
                            <ul className="space-y-1">
                                <li>
                                    <Link to={viewToPath['data-policy']} onClick={() => onNavigate('data-policy')} className="text-xs text-gray-500 dark:text-gray-400 hover:text-crimson transition-colors w-full text-left block">
                                        {dataPolicyText}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={viewToPath['terms-of-service']} onClick={() => onNavigate('terms-of-service')} className="text-xs text-gray-500 dark:text-gray-400 hover:text-crimson transition-colors w-full text-left block">
                                        {termsText}
                                    </Link>
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
