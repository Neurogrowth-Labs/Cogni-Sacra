
import React from 'react';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';

interface FooterProps {
    onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Left Section - Copyright & F6S */}
                    <div className="flex items-center gap-3 order-2 sm:order-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} CogniSacra Academy
                        </p>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <a
                            href="https://www.f6s.com/cognisacra"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                        >
                            <img src="/f6s.jpeg" alt="F6S" className="h-5 w-auto object-contain" />
                        </a>
                    </div>

                    {/* Right Section - Links & Social */}
                    <div className="flex items-center gap-6 order-1 sm:order-2">
                        <button
                            onClick={() => onNavigate('contact')}
                            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-crimson dark:hover:text-crimson transition-colors"
                        >
                            Contact
                        </button>
                        <button
                            onClick={() => onNavigate('data-policy')}
                            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-crimson dark:hover:text-crimson transition-colors"
                        >
                            Privacy
                        </button>
                        <button
                            onClick={() => onNavigate('terms-of-service')}
                            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-crimson dark:hover:text-crimson transition-colors"
                        >
                            Terms
                        </button>

                        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-crimson transition-colors"
                        >
                            <span className="sr-only">LinkedIn</span>
                            <LinkedInIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-crimson transition-colors"
                        >
                            <span className="sr-only">GitHub</span>
                            <GitHubIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
