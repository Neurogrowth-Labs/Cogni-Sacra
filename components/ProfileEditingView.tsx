import React, { useState, KeyboardEvent } from 'react';
import { UserProfile, EducationEntry } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import CameraIcon from './icons/CameraIcon';
import MagicWandIcon from './icons/MagicWandIcon';
import XMarkIcon from './icons/XMarkIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';
import BehanceIcon from './icons/BehanceIcon';
import LinkIcon from './icons/LinkIcon';
import SparklesIcon from './icons/SparklesIcon';

// This would typically come from a service, but is mocked here for the component
const suggestSkills = async (completedCourseTitles: string[], currentSkills: string[]): Promise<string[]> => {
    console.log("Getting AI skill suggestions for courses:", completedCourseTitles);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    const allPossibleSkills = ["Next.js", "GraphQL", "CI/CD", "Docker", "Redux Toolkit", "Zustand", "Performance Optimization", "WebSockets"];
    const newSuggestions = allPossibleSkills.filter(s => !currentSkills.map(cs => cs.toLowerCase()).includes(s.toLowerCase()));
    return newSuggestions.slice(0, 5);
};


interface ProfileEditingViewProps {
    userProfile: UserProfile;
    onSave: (updatedProfile: UserProfile) => void;
    onBack: () => void;
}

const coverImageThemes = [
    'https://picsum.photos/seed/profile-banner/1200/300',
    'https://picsum.photos/seed/banner-space/1200/300',
    'https://picsum.photos/seed/banner-arch/1200/300',
    'https://picsum.photos/seed/banner-tech/1200/300',
];


const ProfileEditingView: React.FC<ProfileEditingViewProps> = ({ userProfile, onSave, onBack }) => {
    const [profile, setProfile] = useState<UserProfile>(userProfile);
    const [skillInput, setSkillInput] = useState('');
    const [newGoal, setNewGoal] = useState('');
    const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value },
        }));
    };
    
    const handleAddSkill = () => {
        if (skillInput && !profile.skills?.includes(skillInput)) {
            setProfile(prev => ({ ...prev, skills: [...(prev.skills || []), skillInput]}));
            setSkillInput('');
        }
    };
    
    const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setProfile(prev => ({ ...prev, skills: prev.skills?.filter(s => s !== skillToRemove)}));
    };
    
    const handleAddGoal = () => {
        if (newGoal.trim()) {
            setProfile(prev => ({ ...prev, learningGoals: [...(prev.learningGoals || []), newGoal.trim()]}));
            setNewGoal('');
        }
    };

    const handleGoalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddGoal();
        }
    };
    
    const handleRemoveGoal = (goalToRemove: string) => {
        setProfile(prev => ({ ...prev, learningGoals: prev.learningGoals?.filter(g => g !== goalToRemove)}));
    };

    const handleAISuggestions = async () => {
        setIsSuggesting(true);
        // In a real app, this would come from user data. We simulate it here.
        const completedCourseTitles = ['Advanced React & State Management', 'Data Science with Python']; 
        const skills = await suggestSkills(completedCourseTitles, profile.skills || []);
        setSuggestedSkills(skills);
        setIsSuggesting(false);
    };

    const addSuggestedSkill = (skill: string) => {
        if (!profile.skills?.includes(skill)) {
            setProfile(prev => ({ ...prev, skills: [...(prev.skills || []), skill] }));
            setSuggestedSkills(prev => prev.filter(s => s !== skill));
        }
    };


    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             <button onClick={onBack} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6 font-semibold">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Profile
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Edit Profile</h1>
                    <button onClick={() => onSave(profile)} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-lg">
                        Save Changes
                    </button>
                </div>
                
                {/* Profile & Cover Picture */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Appearance</h3>
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img src={profile.avatarUrl} alt={profile.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/50" />
                            <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 border-2 border-white dark:border-gray-800">
                                <CameraIcon className="w-4 h-4"/>
                            </button>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Profile Picture</h2>
                            <button className="mt-2 flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                <MagicWandIcon className="w-4 h-4 mr-2" />
                                AI Background Cleaner
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image</label>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {coverImageThemes.map(url => (
                                <button key={url} onClick={() => setProfile(p => ({...p, coverImageUrl: url}))}>
                                    <img src={url} alt="Cover theme" className={`w-full h-16 object-cover rounded-md ${profile.coverImageUrl === url ? 'ring-4 ring-blue-500' : 'opacity-70 hover:opacity-100'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Basic Information</h3>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" name="name" id="name" value={profile.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input type="text" name="username" id="username" value={profile.username} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="academicInstitution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enrolled Academic Institution (Required for Financial Aid Eligibility)</label>
                        <input type="text" name="academicInstitution" id="academicInstitution" value={profile.academicInstitution || ''} onChange={handleInputChange} placeholder="e.g. State University, Tech University" className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm focus:ring-crimson focus:border-crimson" />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <textarea name="bio" id="bio" value={profile.bio} onChange={handleInputChange} rows={4} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                    </div>
                </div>

                {/* Skills & AI Builder */}
                 <div className="space-y-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Skills</h3>
                     {/* AI Builder */}
                     <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
                        <div className="flex items-center">
                             <SparklesIcon className="w-6 h-6 text-blue-500 mr-3" />
                             <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">AI Profile Builder</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Get skill suggestions based on your completed courses.</p>
                             </div>
                        </div>
                        <button onClick={handleAISuggestions} disabled={isSuggesting} className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-400">
                             {isSuggesting ? 'Analyzing...' : 'Suggest Skills'}
                        </button>
                        {suggestedSkills.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Click to add:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedSkills.map(skill => (
                                        <button key={skill} onClick={() => addSuggestedSkill(skill)} className="px-3 py-1 text-sm font-semibold bg-white text-blue-800 rounded-full dark:bg-gray-700 dark:text-blue-200 shadow-sm hover:bg-blue-100">
                                            + {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                     </div>

                     <div className="flex flex-wrap gap-2">
                         {profile.skills?.map(skill => (
                            <div key={skill} className="flex items-center px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">
                                <span>{skill}</span>
                                <button onClick={() => handleRemoveSkill(skill)} className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <XMarkIcon className="w-3 h-3"/>
                                </button>
                            </div>
                        ))}
                    </div>
                     <div>
                        <label htmlFor="skillInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add a skill</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input type="text" id="skillInput" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} className="flex-1 block w-full min-w-0 rounded-none rounded-l-md dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                            <button onClick={handleAddSkill} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-sm">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                 {/* Learning Goals */}
                 <div className="space-y-4">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Learning Goals</h3>
                     <div className="space-y-2">
                         {profile.learningGoals?.map(goal => (
                            <div key={goal} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <span className="text-sm">{goal}</span>
                                <button onClick={() => handleRemoveGoal(goal)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                    <XMarkIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                     <div>
                        <label htmlFor="goalInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add a goal</label>
                         <div className="mt-1 flex rounded-md shadow-sm">
                            <input type="text" id="goalInput" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} onKeyDown={handleGoalKeyDown} className="flex-1 block w-full min-w-0 rounded-none rounded-l-md dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                            <button onClick={handleAddGoal} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-sm">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mentorship Status */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2">Mentorship Status</h3>
                     <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                            <input id="mentor-none" name="mentorshipStatus" type="radio" checked={profile.mentorshipStatus === 'none' || !profile.mentorshipStatus} onChange={() => setProfile(p => ({...p, mentorshipStatus: 'none'}))} className="h-4 w-4 text-blue-600 border-gray-300" />
                            <label htmlFor="mentor-none" className="ml-3 block text-sm font-medium">Not participating</label>
                        </div>
                         <div className="flex items-center">
                            <input id="mentor-seeking" name="mentorshipStatus" type="radio" checked={profile.mentorshipStatus === 'seeking'} onChange={() => setProfile(p => ({...p, mentorshipStatus: 'seeking'}))} className="h-4 w-4 text-blue-600 border-gray-300" />
                            <label htmlFor="mentor-seeking" className="ml-3 block text-sm font-medium">Seeking a mentor</label>
                        </div>
                        <div className="flex items-center">
                            <input id="mentor-offering" name="mentorshipStatus" type="radio" checked={profile.mentorshipStatus === 'offering'} onChange={() => setProfile(p => ({...p, mentorshipStatus: 'offering'}))} className="h-4 w-4 text-blue-600 border-gray-300" />
                            <label htmlFor="mentor-offering" className="ml-3 block text-sm font-medium">Open to mentoring others</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditingView;
