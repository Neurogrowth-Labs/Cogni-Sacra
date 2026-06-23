import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
    onBrowse: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onBrowse }) => {
    return (
        <div className="relative p-8 sm:p-10 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/10 text-center max-w-3xl mx-auto my-6 animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-crimson/5 dark:bg-crimson/10 border border-crimson/15 rounded-full flex items-center justify-center mb-5 text-crimson">
                <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white mb-2">
                Your Academic Board is Quiet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed mb-6">
                You don't have any active course enrollments or bookmarked courses yet. Feed your mind with certified programs, interactive quizzes, or customized AI tutoring paths.
            </p>
            <button
                onClick={onBrowse}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-crimson hover:bg-crimson/95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition active:scale-95"
            >
                Browse Courses
            </button>
        </div>
    );
};

export default EmptyState;
