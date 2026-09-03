import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import PasswordResetView from './PasswordResetView';
import { authService } from '../../services/authService';

interface LoginViewProps {
    onAuthenticated: (name: string) => void;
}

type AuthTab = 'signin' | 'signup';
type AuthMode = 'auth' | 'reset';

const testimonials = [
    {
        quote: "CogniSacra has revolutionized the way African students access quality education. The AI-powered learning paths are game-changing.",
        name: "Amina Okello",
        role: "Computer Science Student, University of Nairobi",
        avatar: "amina"
    },
    {
        quote: "Finally, a platform that understands the unique challenges of African education. The offline capabilities are perfect for my students.",
        name: "Dr. Kwame Mensah",
        role: "Professor, University of Ghana",
        avatar: "kwame"
    },
    {
        quote: "The personalized AI tutor feels like having a mentor available 24/7. It's transformed how I approach my studies.",
        name: "Fatima Diallo",
        role: "Medical Student, Cheikh Anta Diop University",
        avatar: "fatima"
    }
];

const LoginView: React.FC<LoginViewProps> = ({ onAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [activeTab, setActiveTab] = useState<AuthTab>(() => {
        // Check URL to determine initial tab
        return location.pathname === '/register' ? 'signup' : 'signin';
    });
    const [mode, setMode] = useState<AuthMode>(() => {
        return location.pathname === '/forgot-password' ? 'reset' : 'auth';
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [verificationMsg, setVerificationMsg] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        try {
            const saved = localStorage.getItem('cogniSacraRememberMe');
            return saved !== 'false';
        } catch (e) {
            return true;
        }
    });

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setVerificationMsg(null);

        try {
            if (activeTab === 'signup') {
                const result = await authService.register({
                    name: fullName,
                    email,
                    password,
                    confirmPassword: password,
                });

                if (result.token) {
                    try {
                        localStorage.setItem('cogniSacraRememberMe', rememberMe ? 'true' : 'false');
                    } catch (e) {
                        console.warn("Could not access localStorage.");
                    }
                    onAuthenticated(result.user.name || email);
                } else {
                    setVerificationMsg(result.message || 'Please check your email to verify your account. Once verified, you can sign in.');
                }
            } else {
                const result = await authService.login({ email, password });

                try {
                    localStorage.setItem('cogniSacraRememberMe', rememberMe ? 'true' : 'false');
                } catch (e) {
                    console.warn("Could not access localStorage.");
                }
                onAuthenticated(result.user.name || email);
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            if (error.message?.toLowerCase().includes('verify') || error.message?.toLowerCase().includes('email')) {
                setVerificationMsg(error.message);
            } else {
                setErrorMsg(error.message || 'An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 animate-fade-in">
            {/* Left Side - Artistic / Brand */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-crimson/40 to-blue-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-end w-full p-16">
                    <div className="space-y-8">
                        <div className="relative h-48">
                            {testimonials.map((testimonial, index) => (
                                <blockquote
                                    key={index}
                                    className={`absolute inset-0 space-y-4 transition-all duration-700 ease-in-out ${
                                        index === currentTestimonial
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4 pointer-events-none'
                                    }`}
                                >
                                    <p className="text-2xl font-serif font-medium text-white leading-relaxed">
                                        "{testimonial.quote}"
                                    </p>
                                    <footer className="flex items-center gap-4">
                                        <img
                                            src={`https://i.pravatar.cc/150?u=${testimonial.avatar}`}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full border-2 border-white/20"
                                        />
                                        <div>
                                            <div className="text-white font-bold">{testimonial.name}</div>
                                            <div className="text-white/60 text-sm">{testimonial.role}</div>
                                        </div>
                                    </footer>
                                </blockquote>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === currentTestimonial ? 'bg-white w-6' : 'bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-auto">
                    {mode === 'reset' ? (
                        <PasswordResetView onBack={() => setMode('auth')} />
                    ) : (
                        <>
                            {/* Logo in white section - visible */}
                            <div className="flex justify-center lg:justify-start mb-6">
                                <CogniSacraLogo className="w-28 h-28" />
                            </div>

                            <div className="text-center lg:text-left">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-serif tracking-tight">
                                    {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
                                </h2>
                                <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                                    {activeTab === 'signin' ? 'Enter your details to access your account.' : 'Start your 30-day free trial. Cancel anytime.'}
                                </p>
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

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-crimson focus:ring-crimson"
                                        />
                                        Remember me
                                    </label>
                                    {activeTab === 'signin' && (
                                        <Link
                                            to="/forgot-password"
                                            onClick={() => setMode('reset')}
                                            className="text-sm font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
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
                                <Link
                                    to={activeTab === 'signin' ? '/register' : '/signin'}
                                    onClick={() => {
                                        setActiveTab(activeTab === 'signin' ? 'signup' : 'signin');
                                        setErrorMsg(null);
                                        setVerificationMsg(null);
                                    }}
                                    className="font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                >
                                    {activeTab === 'signin' ? 'Sign up' : 'Log in'}
                                </Link>
                            </p>

                            {/* F6S Badge at bottom */}
                            <div className="flex justify-center pt-4">
                                <a
                                    href="https://www.f6s.com/cognisacra"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    <img src="/f6s.jpeg" alt="F6S" className="h-8 w-auto object-contain" />
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginView;
