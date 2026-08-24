import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import { authService } from '../../services/authService';

interface SignUpViewProps {
    onAuthenticated: (name: string) => void;
    onNavigateToSignIn: () => void;
}

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
    >
        <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    </button>
);

const SignUpView: React.FC<SignUpViewProps> = ({ onAuthenticated, onNavigateToSignIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [verificationMsg, setVerificationMsg] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setVerificationMsg(null);

        try {
            const response = await authService.register({
                name: fullName,
                email,
                password,
            });

            if (response.user) {
                try {
                    localStorage.setItem('cogniSacraRememberMe', rememberMe ? 'true' : 'false');
                } catch (e) {
                    console.warn("Could not access localStorage.");
                }
                onAuthenticated(response.user.name || email);
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setErrorMsg(error.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'linkedin' | 'apple') => {
        // Social login not implemented with backend yet
        setErrorMsg(`${provider} login is not available yet. Please use email/password.`);
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 animate-fade-in overflow-hidden">
            {/* Left Side - Artistic / Brand */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-crimson/40 to-purple-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between w-full p-16">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                <CogniSacraLogo className="w-8 h-8" />
                            </div>
                            <span className="text-2xl font-bold text-white font-serif tracking-tight">CogniSacra Academy</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-3xl font-serif font-medium text-white leading-relaxed">
                                Join thousands of learners transforming their careers
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-white/80">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>Personalized AI-powered learning paths</span>
                                </li>
                                <li className="flex items-center gap-3 text-white/80">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>Expert-led courses with real-world projects</span>
                                </li>
                                <li className="flex items-center gap-3 text-white/80">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>24/7 AI tutor assistance</span>
                                </li>
                                <li className="flex items-center gap-3 text-white/80">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>Industry-recognized certificates</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
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
                            Create an account
                        </h2>
                        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                            Start your 30-day free trial. Cancel anytime.
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
                        {verificationMsg && (
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                                {verificationMsg}
                            </div>
                        )}

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
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" /> Must be at least 6 characters
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-crimson focus:ring-crimson"
                                />
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={onNavigateToSignIn}
                            className="font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpView;
