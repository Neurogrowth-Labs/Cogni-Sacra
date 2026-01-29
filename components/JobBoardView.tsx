

import React from 'react';
import { Job } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface JobBoardViewProps {
    jobs: Job[];
    onApplyJob: (job: Job) => void;
}

const JobCard: React.FC<{ job: Job; onApply: (job: Job) => void; }> = ({ job, onApply }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-[0_10px_25px_-5px_rgba(165,28,48,0.2),_0_8px_10px_-6px_rgba(165,28,48,0.2)] dark:hover:shadow-[0_10px_25px_-5px_rgba(165,28,48,0.4),_0_8px_10px_-6px_rgba(165,28,48,0.4)] hover:scale-[1.03] transition-all duration-300 ease-in-out flex flex-col">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-semibold text-crimson dark:text-crimson/90">{job.location}</p>
                <h3 className="text-xl font-bold mt-1 text-gray-900 dark:text-white font-serif">{job.title}</h3>
                <p className="text-md text-gray-600 dark:text-gray-400">{job.company}</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-crimson/10 dark:bg-crimson/20 border-4 border-crimson/20 dark:border-crimson/30">
                <span className="text-xl font-bold text-crimson dark:text-red-300">{job.matchPercentage}%</span>
            </div>
        </div>
        <div className="mt-4">
             <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Skills:</p>
             <div className="flex flex-wrap gap-2 mt-2">
                {job.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">{skill}</span>
                ))}
            </div>
        </div>
        <div className="mt-6 flex-grow"></div>
        <button 
            onClick={() => onApply(job)}
            className="w-full mt-2 px-4 py-2 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-transform duration-200 hover:scale-105 active:scale-95"
        >
            Apply Now
        </button>
    </div>
);


const JobBoardView: React.FC<JobBoardViewProps> = ({ jobs, onApplyJob }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-2">
                <BriefcaseIcon className="w-8 h-8 text-crimson" />
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white ml-3 font-serif">Career Hub</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Personalized job opportunities based on your skills and completed courses.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {jobs.map(job => (
                    <JobCard key={job.id} job={job} onApply={onApplyJob} />
                ))}
            </div>
        </div>
    );
};

export default JobBoardView;
