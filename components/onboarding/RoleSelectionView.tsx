import React from 'react';
import { UserRole } from '../../types';
import LearnerIcon from '../icons/LearnerIcon';
import InstructorIcon from '../icons/InstructorIcon';
import InstitutionIcon from '../icons/InstitutionIcon';

interface RoleSelectionViewProps {
    onSelectRole: (role: UserRole) => void;
}

const RoleCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <div
        onClick={onClick}
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border-2 border-transparent hover:border-crimson"
    >
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-crimson/10 dark:bg-gray-700 text-crimson dark:text-red-300">
            {icon}
        </div>
        <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white font-serif">{title}</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);

const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelectRole }) => {
    return (
        <div className="w-full max-w-4xl p-8 animate-fade-in text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">
                How will you use Cogni-Sacra?
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Choose your role to get a personalized experience.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <RoleCard
                    icon={<LearnerIcon className="w-10 h-10" />}
                    title="I'm a Learner"
                    description="Explore courses, track your progress, and achieve your personal learning goals."
                    onClick={() => onSelectRole('learner')}
                />
                <RoleCard
                    icon={<InstructorIcon className="w-10 h-10" />}
                    title="I'm an Instructor"
                    description="Create engaging courses with AI-powered tools and inspire students worldwide."
                    onClick={() => onSelectRole('instructor')}
                />
                <RoleCard
                    icon={<InstitutionIcon className="w-10 h-10" />}
                    title="I'm an Institution"
                    description="Manage your organization's learning programs and track your team's development."
                    onClick={() => onSelectRole('institution')}
                />
            </div>
        </div>
    );
};

export default RoleSelectionView;