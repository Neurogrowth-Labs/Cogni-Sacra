import React, { useState } from 'react';
import { InstructorSettings } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import BellIcon from './icons/BellIcon';

interface InstructorSettingsViewProps {
    settings: InstructorSettings;
    onSave: (updatedSettings: InstructorSettings) => void;
}

type SettingsTab = 'profile' | 'payout' | 'notifications';

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
        role="tab"
        aria-selected={isActive}
    >
        {children}
    </button>
);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: () => void }> = ({ label, enabled, onChange }) => (
     <div className="flex justify-between items-center py-2">
        <label htmlFor={label} className="font-medium">{label}</label>
        <button
            id={label}
            onClick={onChange}
            role="switch"
            aria-checked={enabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

const InstructorSettingsView: React.FC<InstructorSettingsViewProps> = ({ settings, onSave }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        onSave(localSettings);
        alert('Settings saved successfully!');
    };
    
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({ ...prev, publicProfile: { ...prev.publicProfile, [name]: value } }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            publicProfile: {
                ...prev.publicProfile,
                socialLinks: {
                    ...(prev.publicProfile.socialLinks || {}),
                    [name]: value,
                },
            },
        }));
    };

    const handleNotificationToggle = (key: keyof InstructorSettings['notifications']) => {
        setLocalSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [key]: !prev.notifications[key] } }));
    };

    // FIX: Add missing `handlePayoutChange` function to handle updates for payout settings.
    const handlePayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            payout: {
                ...prev.payout,
                [name]: value,
            },
        }));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Public Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                                <input type="text" id="displayName" name="displayName" value={localSettings.publicProfile.displayName} onChange={handleProfileChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructor Bio</label>
                                <textarea id="bio" name="bio" value={localSettings.publicProfile.bio} onChange={handleProfileChange} rows={4} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">Social Links</h3>
                            <div>
                                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter URL</label>
                                <input type="url" id="twitter" name="twitter" value={localSettings.publicProfile.socialLinks?.twitter || ''} onChange={handleSocialChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 dark:text-gray-300">YouTube URL</label>
                                <input type="url" id="youtube" name="youtube" value={localSettings.publicProfile.socialLinks?.youtube || ''} onChange={handleSocialChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Personal Website URL</label>
                                <input type="url" id="website" name="website" value={localSettings.publicProfile.socialLinks?.website || ''} onChange={handleSocialChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                            </div>
                        </div>
                    </div>
                );
            case 'payout':
                return (
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payout Methods</h2>
                        <div>
                            <h3 className="text-lg font-semibold">Primary Method: PayPal</h3>
                            <label htmlFor="paypalEmail" className="block text-sm font-medium mt-2">PayPal Email</label>
                            <input type="email" id="paypalEmail" name="paypalEmail" value={localSettings.payout.paypalEmail || ''} onChange={handlePayoutChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h3 className="font-semibold">Connect to Stripe</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Connect a Stripe account to receive payouts directly to your bank.</p>
                            <button className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Connect Stripe</button>
                        </div>
                    </div>
                );
            case 'notifications':
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                        <div className="space-y-2 divide-y dark:divide-gray-700">
                           <ToggleSwitch label="New Student Enrollments" enabled={localSettings.notifications.newEnrollments} onChange={() => handleNotificationToggle('newEnrollments')} />
                           <ToggleSwitch label="New Course Reviews" enabled={localSettings.notifications.courseReviews} onChange={() => handleNotificationToggle('courseReviews')} />
                           <ToggleSwitch label="Student Joins Community" enabled={localSettings.notifications.studentJoins} onChange={() => handleNotificationToggle('studentJoins')} />
                        </div>
                    </div>
                 );
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Instructor Settings</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Manage your creator profile and preferences.</p>
            </div>
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                    <nav className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-1" role="tablist" aria-orientation="vertical">
                         <TabButton isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                            <UserCircleIcon className="w-5 h-5 mr-3" /> Public Profile
                        </TabButton>
                        <TabButton isActive={activeTab === 'payout'} onClick={() => setActiveTab('payout')}>
                            <CreditCardIcon className="w-5 h-5 mr-3" /> Payout Methods
                        </TabButton>
                        <TabButton isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
                            <BellIcon className="w-5 h-5 mr-3" /> Notifications
                        </TabButton>
                    </nav>
                </div>
                 <div className="md:w-3/4">
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                        {renderContent()}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorSettingsView;