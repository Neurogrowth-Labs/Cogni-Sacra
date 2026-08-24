import React, { useState } from 'react';
import { UserSettings } from '../../types';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import { authService } from '../../services/authService';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import XMarkIcon from '../icons/XMarkIcon';

interface AccountSettingsProps {
    settings: UserSettings['account'];
}

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (currentPassword === newPassword) {
            setError('New password must be different from current password');
            return;
        }

        setIsLoading(true);

        try {
            const message = await authService.changePassword({
                currentPassword,
                newPassword,
            });
            setSuccess(message || 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                onClose();
                setSuccess(null);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccess(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e: { target: { value: any; }; }) => setCurrentPassword(e.target.value)}
                                required
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e: { target: { value: any; }; }) => setNewPassword(e.target.value)}
                                required
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all"
                                placeholder="Enter new password (min 6 characters)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e: { target: { value: any; }; }) => setConfirmPassword(e.target.value)}
                                required
                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-crimson hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConnectedAccount: React.FC<{ name: string, icon: React.ReactNode }> = ({ name, icon }) => (
    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center">
            {icon}
            <span className="ml-3 font-medium text-gray-800 dark:text-gray-200">Connected to {name}</span>
        </div>
        <button className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">Disconnect</button>
    </div>
);


const AccountSettings: React.FC<AccountSettingsProps> = ({ settings }) => {
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account & Security</h2>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Login Information</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{settings.email}</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-600 hover:underline">Change</button>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">********</p>
                    </div>
                    <button
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Change
                    </button>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Two-Factor Authentication (2FA)</h3>
                 <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">2FA is currently enabled on your account.</p>
                    <button className="text-sm font-semibold text-red-600 hover:underline">Disable</button>
                </div>
            </div>

            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Connected Accounts</h3>
                 <div className="space-y-2">
                     {settings.connectedAccounts.includes('google') && <ConnectedAccount name="Google" icon={<GoogleIcon />} />}
                     {settings.connectedAccounts.includes('linkedin') && <ConnectedAccount name="LinkedIn" icon={<LinkedInIcon />} />}
                     {settings.connectedAccounts.includes('apple') && <ConnectedAccount name="Apple" icon={<AppleIcon />} />}
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
