
import React, { useState, useRef, useEffect } from 'react';
import MenuIcon from './icons/MenuIcon';
import UserIcon from './icons/UserIcon';
import { UserRole } from '../types';
import LogoutIcon from './icons/LogoutIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import { useLanguage } from '../contexts/LanguageContext';
import CogIcon from './icons/CogIcon';
import SearchIcon from './icons/SearchIcon';
import BellIcon from './icons/BellIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import SparklesIcon from './icons/SparklesIcon';
import ChatBubbleOvalLeftIcon from './icons/ChatBubbleOvalLeftIcon';

interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    userRole: UserRole;
    onLogout: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSettings: () => void;
    userName: string;
    userAvatarUrl: string;
    institutionName: string;
    institutionLogoUrl: string;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'sw', name: 'Kiswahili' },
];

type NotificationType = 'achievement' | 'reminder' | 'mention';
type Notification = {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  { id: 1, type: 'achievement', message: 'You unlocked the "Course Conqueror" achievement!', time: '2 hours ago', read: false },
  { id: 2, type: 'reminder', message: 'Your project for "Advanced React" is due tomorrow.', time: '1 day ago', read: false },
  { id: 3, type: 'mention', message: 'Jane Doe mentioned you in the community hub.', time: '3 days ago', read: true },
];

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'achievement':
            return <SparklesIcon className="w-5 h-5 text-yellow-500" />;
        case 'reminder':
            return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
        case 'mention':
            return <ChatBubbleOvalLeftIcon className="w-5 h-5 text-green-500" />;
        default:
            return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, userRole, onLogout, onNavigateToProfile, onNavigateToSettings, userName, userAvatarUrl, institutionName, institutionLogoUrl, searchTerm, onSearchChange }) => {
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isNotifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    
    const { language, setLanguage } = useLanguage();
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const notifMenuRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const selectedLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false);
            }
            if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
                setNotifDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef, langMenuRef, notifMenuRef]);

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const displayName = userRole === 'institution' ? institutionName : userName;
    const displayAvatarUrl = userRole === 'institution' ? institutionLogoUrl : userAvatarUrl;

    const handleLogoutClick = async () => {
        setUserMenuOpen(false);
        await onLogout();
    };

    return (
        <header className="sticky top-4 z-30 mx-4 sm:mx-6 lg:mx-8 mb-6">
            <div className="glass-panel rounded-2xl px-4 sm:px-6 py-3 shadow-glass dark:shadow-glass-dark flex items-center justify-between transition-all duration-300">
                <div className="flex items-center space-x-4 flex-1">
                    <button onClick={onToggleSidebar} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 md:hidden transition-colors" aria-label="Toggle sidebar">
                        <MenuIcon />
                    </button>
                    <div className="relative hidden sm:block w-full max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-crimson transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search courses, mentors..."
                            aria-label="Search courses"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-crimson/50 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-5">
                    <button className="sm:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        <SearchIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                    </button>
                    {/* Notifications */}
                    <div className="relative" ref={notifMenuRef}>
                        <button 
                            onClick={() => setNotifDropdownOpen(!isNotifDropdownOpen)}
                            className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                            aria-label={`View notifications, ${unreadCount} unread`}
                        >
                            <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"/>
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-crimson ring-2 ring-white dark:ring-gray-800 animate-pulse" />
                            )}
                        </button>
                        {isNotifDropdownOpen && (
                            <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 ring-1 ring-black ring-opacity-5 animate-fade-in origin-top-right overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && <button onClick={handleMarkAllAsRead} className="text-xs font-semibold text-crimson hover:underline">Mark all read</button>}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                                                <div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{notif.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <BellIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No new notifications</p>
                                    </div>
                                )}
                            </div>
                            </div>
                        )}
                    </div>

                    {/* Language Selector */}
                    <div className="relative block" ref={langMenuRef}>
                        <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-300 flex items-center gap-1 sm:gap-1.5" aria-label={`Select language. Current is ${selectedLang.name}`}>
                            <GlobeAltIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
                            <span className="text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">{selectedLang.code}</span>
                        </button>
                        {isLangDropdownOpen && (
                            <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5 animate-fade-in origin-top-right border border-gray-100 dark:border-gray-700">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setLangDropdownOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${language === lang.code ? 'text-crimson font-bold bg-crimson/5' : 'text-gray-700 dark:text-gray-200'}`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative pl-2 border-l border-gray-200 dark:border-gray-700" ref={userMenuRef}>
                        <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300" aria-label="Open user menu">
                            <img className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm" src={displayAvatarUrl} alt="User avatar" />
                            <div className="hidden lg:block text-left mr-2">
                                <p className="font-bold text-sm text-gray-800 dark:text-white leading-tight">{displayName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
                            </div>
                        </button>
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5 animate-fade-in origin-top-right border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Signed in as</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-1">{displayName}</p>
                                </div>
                                <div className="py-2">
                                    {userRole !== 'institution' && (
                                        <button onClick={() => { onNavigateToProfile(); setUserMenuOpen(false); }} className="w-full flex items-center px-5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-crimson dark:hover:text-red-400 transition-colors">
                                            <UserIcon className="w-4 h-4 mr-3" /> My Profile
                                        </button>
                                    )}
                                    <button onClick={() => { onNavigateToSettings(); setUserMenuOpen(false); }} className="w-full flex items-center px-5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-crimson dark:hover:text-red-400 transition-colors">
                                        <CogIcon className="w-4 h-4 mr-3" /> Settings
                                    </button>
                                </div>
                                <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                                    <button onClick={handleLogoutClick} className="w-full flex items-center px-5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                                        <LogoutIcon className="w-4 h-4 mr-3" /> Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
