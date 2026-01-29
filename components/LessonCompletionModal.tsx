import React, { useEffect, useRef } from 'react';
import { Achievement } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface LessonCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    achievement: Achievement | undefined;
}

const LessonCompletionModal: React.FC<LessonCompletionModalProps> = ({ isOpen, onClose, achievement }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "completion-modal-title";

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        setTimeout(() => modalRef.current?.focus(), 100);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 relative transform transition-all text-center animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <SparklesIcon className="w-16 h-16 text-yellow-400 absolute top-4 right-4 -rotate-12 opacity-50" />
                <SparklesIcon className="w-8 h-8 text-yellow-400 absolute bottom-8 left-8 rotate-12 opacity-50" />
                
                <h2 id={titleId} className="text-3xl font-extrabold text-green-500">Lesson Complete!</h2>
                <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">Congratulations, you're one step closer to mastery!</p>

                {achievement && (
                    <div className="mt-6 bg-gray-100 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">Achievement Unlocked</p>
                        <div className="mt-4 flex flex-col items-center text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white ${achievement.color} shadow-lg`}>
                                <achievement.Icon className="w-10 h-10"/>
                            </div>
                            <p className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{achievement.name}</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-lg shadow-lg px-6 py-3 bg-blue-600 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none transition-transform hover:scale-105"
                        onClick={onClose}
                    >
                        Continue Learning
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonCompletionModal;