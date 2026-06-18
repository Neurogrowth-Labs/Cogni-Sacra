
import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import { supabase } from '../../services/supabaseClient';

interface LoginViewProps {
    onAuthenticated: (name: string) => void;
}

type AuthTab = 'signin' | 'signup';

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
    >
        <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    </button>
);

const LoginView: React.FC<LoginViewProps> = ({ onAuthenticated }) => {
    const [activeTab, setActiveTab] = useState<AuthTab>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            if (activeTab === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            avatar_url: `https://i.pravatar.cc/150?u=${email}`,
                        }
                    }
                });
                
                if (error) throw error;
                
                if (data.user) {
                    // Note: If email confirmation is enabled in Supabase, the user won't be signed in immediately.
                    // For this demo, we assume auto-confirm or we just notify.
                    if (data.session) {
                         onAuthenticated(fullName || email);
                    } else {
                        alert('Please check your email to confirm your account.');
                    }
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                if (data.user) {
                    onAuthenticated(data.user.user_metadata.full_name || email);
                }
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            setErrorMsg(error.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'linkedin' | 'apple') => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
            });
            if (error) throw error;
        } catch (error: any) {
            setErrorMsg(error.message);
        }
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
                            <span className="text-2xl font-bold text-white font-serif tracking-tight">EmpowerAfriq Academy</span>
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
                        <SocialButton icon={<GoogleIcon />} label="Google" onClick={() => handleSocialLogin('google')} />
                        <SocialButton icon={<AppleIcon className="text-gray-900 dark:text-white" />} label="Apple" onClick={() => handleSocialLogin('apple')} />
                        <SocialButton icon={<LinkedInIcon />} label="LinkedIn" onClick={() => handleSocialLogin('linkedin')} />
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
                        {errorMsg && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                                {errorMsg}
                            </div>
                        )}

                        {activeTab === 'signup' && (
                            <div className="space-y-1.5">
                                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                <input
                                    id="fullname"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                                    placeholder="e.g. Alex Turner"
                                />
                            </div>
                        )}
                        
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                                placeholder="e.g. alex@example.com"
                            />
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        id="password"
                                        type={isVisible ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsVisible(!isVisible)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            {activeTab === 'signup' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> Must be at least 6 characters
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : (activeTab === 'signin' ? 'Sign in' : 'Create account')}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setActiveTab(activeTab === 'signin' ? 'signup' : 'signin');
                                setErrorMsg(null);
                            }}
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
