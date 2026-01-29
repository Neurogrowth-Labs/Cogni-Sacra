
import React from 'react';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';

interface FooterProps {
    onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} Cogni-Sacra. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <button onClick={() => onNavigate('contact')} className="text-sm text-gray-500 hover:text-crimson transition-colors">Contact</button>
                    <button onClick={() => onNavigate('data-policy')} className="text-sm text-gray-500 hover:text-crimson transition-colors">Privacy</button>
                    <button onClick={() => onNavigate('terms-of-service')} className="text-sm text-gray-500 hover:text-crimson transition-colors">Terms</button>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500"><span className="sr-only">LinkedIn</span><LinkedInIcon className="w-5 h-5" /></a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500"><span className="sr-only">GitHub</span><GitHubIcon className="w-5 h-5" /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
