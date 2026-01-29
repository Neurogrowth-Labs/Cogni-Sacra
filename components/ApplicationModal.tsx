
import React, { useEffect, useRef, useState } from 'react';
import { Job, UserProfile } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import { sendMessageToAI } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
    userProfile: UserProfile;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, job, userProfile }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "application-modal-title";
    const [coverLetter, setCoverLetter] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Reset state when modal is opened for a new job
        if (isOpen) {
            setCoverLetter('');
            setIsGenerating(false);
        }
    }, [isOpen, job]);


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

    const handleGenerateCoverLetter = async () => {
        if (!job || !userProfile) return;
        setIsGenerating(true);
        setCoverLetter('');

        const prompt = `
            Write a professional and enthusiastic cover letter for me. My name is ${userProfile.name}. I am applying for the position of ${job.title} at ${job.company}.
            
            Here is information from my profile:
            - My current title/role: ${userProfile.title}
            - My skills: ${userProfile.skills?.join(', ')}
            - My bio: ${userProfile.bio}
            - I have completed these courses: ${userProfile.certificates.map(c => c.courseTitle).join(', ')}

            Here are the details for the job I am applying for:
            - Job Title: ${job.title}
            - Company: ${job.company}
            - Required skills: ${job.skills.join(', ')}

            Please write a cover letter that is concise (around 3-4 paragraphs). It should highlight how my skills and experience (especially my completed courses) align with the required skills for the job. Start the letter with "Dear Hiring Manager," and end it with "Sincerely,\\n${userProfile.name}".
        `;
        
        try {
            const stream = await sendMessageToAI(prompt);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setCoverLetter(fullResponse);
            }
        } catch (error) {
            console.error("Error generating cover letter:", error);
            setCoverLetter("Sorry, I couldn't generate the cover letter at this time. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };


    if (!isOpen || !job) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6 relative transform transition-all animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900">
                        <BriefcaseIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 id={titleId} className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Confirm Your Application</h3>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-400">You are applying for the position of <strong className="text-gray-800 dark:text-gray-200">{job.title}</strong> at <strong className="text-gray-800 dark:text-gray-200">{job.company}</strong>.</p>
                </div>

                <div className="mt-6 text-left space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Profile</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{userProfile.name}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{userProfile.title}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitting</p>
                            <p className="font-semibold text-gray-900 dark:text-white">Your EmpowerAfriq Academy Profile & Certificates</p>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                             <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter (Optional)</label>
                            <button
                                onClick={handleGenerateCoverLetter}
                                disabled={isGenerating}
                                className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-red-400"
                            >
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea
                            id="cover-letter"
                            rows={8}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 focus:ring-crimson focus:border-crimson"
                            placeholder="Your cover letter will appear here..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                     <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
                        onClick={() => { alert('Application submitted successfully!'); onClose(); }}
                    >
                        Submit Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;
