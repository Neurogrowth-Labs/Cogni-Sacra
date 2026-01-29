import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';

interface LoginViewProps {
    onAuthenticated: (name: string) => void;
}

type AuthTab = 'signin' | 'signup';

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
        {icon}
        <span className="ml-3 font-medium text-gray-700 dark:text-gray-200">{label}</span>
    </button>
);

const PasswordInput: React.FC<{ id: string; placeholder: string; required?: boolean }> = ({ id, placeholder, required = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                name={id}
                type={isVisible ? 'text' : 'password'}
                required={required}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-crimson focus:border-crimson dark:bg-gray-700"
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                aria-label={isVisible ? "Hide password" : "Show password"}
            >
                {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
        </div>
    );
};

const LoginView: React.FC<LoginViewProps> = ({ onAuthenticated }) => {
    const [activeTab, setActiveTab] = useState<AuthTab>('signup');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let name = 'Alex Turner'; // Default for sign in
        if (activeTab === 'signup') {
            const form = e.target as HTMLFormElement;
            const nameInput = form.elements.namedItem('fullname') as HTMLInputElement;
            if (nameInput && nameInput.value) {
                name = nameInput.value;
            } else {
                name = 'New User'; // Fallback
            }
        }

        if (activeTab === 'signin' && rememberMe) {
            try {
                localStorage.setItem('cogniSacraRememberMe', 'true');
            } catch (error) {
                console.warn("Could not save 'Remember Me' preference to localStorage.");
            }
        } else {
            try {
                localStorage.removeItem('cogniSacraRememberMe');
            } catch (error) {
                console.warn("Could not clear 'Remember Me' preference from localStorage.");
            }
        }
        onAuthenticated(name);
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-fade-in">
            <div className="text-center">
                <CogniSacraLogo className="w-16 h-16 mx-auto" />
                <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white font-serif">
                    {activeTab === 'signup' ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {activeTab === 'signup' ? 'Join a community of learners and creators.' : 'Sign in to continue your journey.'}
                </p>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'signup' ? 'text-crimson dark:text-red-400 border-b-2 border-crimson' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                    Sign Up
                </button>
                <button
                    onClick={() => setActiveTab('signin')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'signin' ? 'text-crimson dark:text-red-400 border-b-2 border-crimson' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                    Sign In
                </button>
            </div>

            {activeTab === 'signup' ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fullname" className="sr-only">Full Name</label>
                        <input id="fullname" name="fullname" type="text" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-crimson focus:border-crimson dark:bg-gray-700" placeholder="Full Name" />
                    </div>
                    <div>
                        <label htmlFor="email-signup" className="sr-only">Email address</label>
                        <input id="email-signup" name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-crimson focus:border-crimson dark:bg-gray-700" placeholder="Email address" />
                    </div>
                    <PasswordInput id="password-signup" placeholder="Password" />
                    <PasswordInput id="password-confirm" placeholder="Confirm Password" />
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson">
                            Create Account
                        </button>
                    </div>
                </form>
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-signin" className="sr-only">Email address</label>
                        <input id="email-signin" name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-crimson focus:border-crimson dark:bg-gray-700" placeholder="Email address" />
                    </div>
                    <PasswordInput id="password-signin" placeholder="Password" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-crimson focus:ring-crimson border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                                Remember me
                            </label>
                        </div>
                         <div className="text-sm">
                            <a href="#" className="font-medium text-crimson hover:text-red-700">
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson">
                            Sign In
                        </button>
                    </div>
                </form>
            )}

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Or
                    </span>
                </div>
            </div>
            <div className="space-y-3">
                <SocialButton icon={<GoogleIcon />} label="Continue with Google" onClick={() => onAuthenticated('Alex Turner')} />
                <SocialButton icon={<AppleIcon className="text-gray-800 dark:text-white" />} label="Continue with Apple" onClick={() => onAuthenticated('Alex Turner')} />
                <SocialButton icon={<LinkedInIcon />} label="Continue with LinkedIn" onClick={() => onAuthenticated('Alex Turner')} />
            </div>
        </div>
    );
};

export default LoginView;
