import React from 'react';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';

interface FooterProps {
    onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} Cogni-Sacra. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">LinkedIn</span><LinkedInIcon className="w-6 h-6" /></a>
                    <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">GitHub</span><GitHubIcon className="w-6 h-6" /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;