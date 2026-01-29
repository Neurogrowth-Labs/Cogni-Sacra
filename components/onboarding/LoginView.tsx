
import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';

interface LoginViewProps {
    onAuthenticated: (name: string) => void;
}

type AuthTab = 'signin' | 'signup';

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
    >
        <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    </button>
);

const InputField: React.FC<{ 
    id: string; 
    type?: string; 
    label: string; 
    placeholder: string; 
    required?: boolean;
}> = ({ id, type = 'text', label, placeholder, required = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (isVisible ? 'text' : 'password') : type;

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                {label}
            </label>
            <div className="relative group">
                <input
                    id={id}
                    name={id}
                    type={inputType}
                    required={required}
                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                    placeholder={placeholder}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const LoginView: React.FC<LoginViewProps> = ({ onAuthenticated }) => {
    const [activeTab, setActiveTab] = useState<AuthTab>('signin');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let name = 'Alex Turner'; 
        if (activeTab === 'signup') {
            const form = e.target as HTMLFormElement;
            const nameInput = form.elements.namedItem('fullname') as HTMLInputElement;
            if (nameInput && nameInput.value) {
                name = nameInput.value;
            } else {
                name = 'New User';
            }
        }

        if (activeTab === 'signin' && rememberMe) {
            try {
                localStorage.setItem('cogniSacraRememberMe', 'true');
            } catch (error) {
                console.warn("Could not save 'Remember Me' preference.");
            }
        } else {
            try {
                localStorage.removeItem('cogniSacraRememberMe');
            } catch (error) {
                console.warn("Could not clear 'Remember Me' preference.");
            }
        }
        onAuthenticated(name);
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 animate-fade-in overflow-hidden">
            {/* Left Side - Artistic / Brand */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-crimson/40 to-blue-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="relative z-10 flex flex-col justify-between w-full p-16">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                <CogniSacraLogo className="w-8 h-8" />
                            </div>
                            <span className="text-2xl font-bold text-white font-serif tracking-tight">Cogni-Sacra</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <blockquote className="space-y-4">
                            <p className="text-3xl font-serif font-medium text-white leading-relaxed">
                                "This platform completely transformed how I approach learning. The AI tutor feels like having a personal mentor available 24/7."
                            </p>
                            <footer className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?u=sarahconnor" alt="User" className="w-12 h-12 rounded-full border-2 border-white/20" />
                                <div>
                                    <div className="text-white font-bold">Sarah Connor</div>
                                    <div className="text-white/60 text-sm">Full Stack Developer</div>
                                </div>
                            </footer>
                        </blockquote>
                        
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-serif tracking-tight">
                            {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                            {activeTab === 'signin' ? 'Enter your details to access your account.' : 'Start your 30-day free trial. Cancel anytime.'}
                        </p>
                    </div>

                    {/* Social Auth */}
                    <div className="grid grid-cols-3 gap-4">
                        <SocialButton icon={<GoogleIcon />} label="Google" onClick={() => onAuthenticated('Alex Turner')} />
                        <SocialButton icon={<AppleIcon className="text-gray-900 dark:text-white" />} label="Apple" onClick={() => onAuthenticated('Alex Turner')} />
                        <SocialButton icon={<LinkedInIcon />} label="LinkedIn" onClick={() => onAuthenticated('Alex Turner')} />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {activeTab === 'signup' && (
                            <InputField id="fullname" label="Full Name" placeholder="e.g. Alex Turner" />
                        )}
                        
                        <InputField id="email" type="email" label="Email" placeholder="e.g. alex@example.com" />
                        
                        <div className="space-y-6">
                            <InputField id="password" type="password" label="Password" placeholder="••••••••" />
                            {activeTab === 'signup' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> Must be at least 8 characters
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeTab === 'signin' && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-crimson focus:ring-crimson border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                        Remember me for 30 days
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-crimson hover:text-red-700 dark:hover:text-red-400">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {activeTab === 'signin' ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
                            className="font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                            {activeTab === 'signin' ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
