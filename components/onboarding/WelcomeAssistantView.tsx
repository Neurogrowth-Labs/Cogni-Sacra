import React from 'react';
import SparklesIcon from '../icons/SparklesIcon';

interface WelcomeAssistantViewProps {
    onStart: () => void;
}

const WelcomeAssistantView: React.FC<WelcomeAssistantViewProps> = ({ onStart }) => {
    return (
        <div className="w-full max-w-lg p-8 text-center animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900">
                <SparklesIcon className="w-12 h-12 text-green-600 dark:text-green-300" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white font-serif">
                You're all set!
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Your personalized learning dashboard is ready. Our AI is already finding the best courses just for you.
            </p>
            <div className="mt-8">
                <button
                    onClick={onStart}
                    className="px-10 py-4 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 shadow-lg transition-transform hover:scale-105"
                >
                    Start Learning
                </button>
            </div>
        </div>
    );
};

export default WelcomeAssistantView;