
import React, { useState, useMemo, useRef } from 'react';
import { UserProfile, Certificate, Course, Job, EducationEntry, InstructorSettings, UserRole } from '../types';
import BlockchainVerificationModal from './BlockchainVerificationModal';
import CourseCard from './CourseCard';
import ShareIcon from './icons/ShareIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CertificateIcon from './icons/CertificateIcon';
import PencilIcon from './icons/PencilIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';
import BehanceIcon from './icons/BehanceIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import CheckBadgeIcon from './icons/CheckBadgeIcon';
import LinkIcon from './icons/LinkIcon';
import UploadIcon from './icons/UploadIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import XMarkIcon from './icons/XMarkIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';
import BookmarkIcon from './icons/BookmarkIcon';


interface ProfileViewProps {
    userProfile: UserProfile;
    courses: Course[];
    jobs: Job[];
    onSelectCourse: (course: Course) => void;
    onApplyJob: (job: Job) => void;
    onEditProfile: () => void;
    instructorSettings: InstructorSettings;
    userRole: UserRole;
    instructorCourses: Course[];
    allCourses: Course[];
    bookmarkedCourseIds: Set<string>;
    onToggleBookmark: (courseId: string) => void;
}

const ProfileTabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center px-4 py-2 font-semibold transition-colors text-sm rounded-md ${
            isActive
                ? 'bg-crimson/10 dark:bg-crimson/20 text-crimson dark:text-red-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`}
    >
        {children}
    </button>
);


const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, courses, jobs, onSelectCourse, onApplyJob, onEditProfile, instructorSettings, userRole, instructorCourses, allCourses, bookmarkedCourseIds, onToggleBookmark }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'completed' | 'achievements' | 'saved'>('completed');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setResumeFile(event.target.files[0]);
            alert(`File "${event.target.files[0].name}" selected. In a real app, this would be uploaded and the profile updated.`);
        }
    };

    const handleVerifyClick = (certificate: Certificate) => {
        setSelectedCertificate(certificate);
        setModalOpen(true);
    };

    const completedCourses = useMemo(() => courses.filter(c => c.progress === 100), [courses]);
    const savedCourses = useMemo(() => allCourses.filter(c => bookmarkedCourseIds.has(c.id)), [allCourses, bookmarkedCourseIds]);
    
    const careerReadiness = useMemo(() => {
        if (!userProfile.targetCareer || !userProfile.skills) return { percentage: 0, neededSkills: [] };
        
        const targetJob = jobs.find(j => j.title === userProfile.targetCareer);
        if (!targetJob) return { percentage: 0, neededSkills: [] };

        const userSkillsSet = new Set(userProfile.skills.map(s => s.toLowerCase()));
        const requiredSkills = targetJob.skills;
        const matchedSkills = requiredSkills.filter(s => userSkillsSet.has(s.toLowerCase()));
        
        const percentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
        const neededSkills = requiredSkills.filter(s => !userSkillsSet.has(s.toLowerCase()));
        
        return { percentage, neededSkills };
    }, [userProfile.skills, userProfile.targetCareer, jobs]);

    // Render Instructor Profile View
    if (userRole === 'instructor') {
        const { publicProfile } = instructorSettings;
        return (
            <div className="max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg relative overflow-hidden">
                    <img src={userProfile.coverImageUrl} alt="Cover" className="w-full h-48 object-cover" />
                    <div className="absolute top-4 right-4">
                        <button onClick={onEditProfile} className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-100 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-900">
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 space-y-4 sm:space-y-0 sm:space-x-6">
                            <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-800" />
                            <div className="flex-grow text-center sm:text-left">
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">{publicProfile.displayName}</h1>
                                <p className="text-md text-gray-600 dark:text-gray-300 mt-1">Instructor</p>
                                <div className="flex justify-center sm:justify-start space-x-4 mt-3">
                                    {publicProfile.socialLinks?.twitter && <a href={publicProfile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400" aria-label="Twitter profile"> T </a>}
                                    {publicProfile.socialLinks?.website && <a href={publicProfile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Personal website"><LinkIcon className="w-6 h-6" /></a>}
                                </div>
                            </div>
                        </div>
                         <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                             <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif mb-2">About Me</h3>
                             <p className="text-gray-700 dark:text-gray-300">{publicProfile.bio}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">Courses by {publicProfile.displayName}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {instructorCourses.map(course => (
                                    <CourseCard 
                                        key={course.id} 
                                        course={course} 
                                        onSelect={onSelectCourse} 
                                        isBookmarked={bookmarkedCourseIds.has(course.id)}
                                        onToggleBookmark={onToggleBookmark}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0">
                        <div className="sticky top-8 space-y-8">
                            {publicProfile.achievements && publicProfile.achievements.length > 0 && (
                                 <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-serif">Achievements</h3>
                                    <div className="space-y-4">
                                        {publicProfile.achievements.map(ach => (
                                            <div key={ach.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${ach.color} mr-4 flex-shrink-0`}>
                                                    <ach.Icon className="w-7 h-7"/>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{ach.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {publicProfile.certifications && publicProfile.certifications.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-serif">Certifications</h3>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md space-y-3">
                                        {publicProfile.certifications.map(cert => (
                                            <div key={cert.id} className="flex items-center">
                                                <CertificateIcon className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{cert.courseTitle}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Issued: {cert.issuedDate}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {(publicProfile.accreditations && publicProfile.accreditations.length > 0) || (publicProfile.licenses && publicProfile.licenses.length > 0) ? (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-serif">Accreditations & Licenses</h3>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                                        <ul className="space-y-2">
                                            {publicProfile.accreditations?.map(acc => (
                                                <li key={acc} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                                    <AcademicCapIcon className="w-5 h-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0"/> {acc}
                                                </li>
                                            ))}
                                            {publicProfile.licenses?.map(lic => (
                                                <li key={lic} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                                     <CheckBadgeIcon className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0"/> {lic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : null}
                            <div>
                                 <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-serif">CV / Resume</h3>
                                 <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md space-y-2">
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx"/>
                                    {resumeFile ? (
                                        <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/50 rounded-md">
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">{resumeFile.name}</p>
                                            <button onClick={() => setResumeFile(null)} className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800">
                                                <XMarkIcon className="w-4 h-4 text-blue-700 dark:text-blue-200" />
                                            </button>
                                        </div>
                                    ) : (
                                        publicProfile.resumeUrl && (
                                             <a href={publicProfile.resumeUrl} download className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
                                                <DocumentTextIcon className="w-5 h-5 mr-2" /> Download CV/Resume
                                            </a>
                                        )
                                    )}
                                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                                        <UploadIcon className="w-5 h-5 mr-2" /> {publicProfile.resumeUrl ? 'Upload New' : 'Upload File'}
                                    </button>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    

    // Render Learner Profile View
    return (
        <>
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* User Header with Cover Image */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg relative overflow-hidden">
                <img src={userProfile.coverImageUrl} alt="Cover image" className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4">
                    <button onClick={onEditProfile} className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-100 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-900">
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit Profile
                    </button>
                </div>
                <div className="p-6 pt-0">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 space-y-4 sm:space-y-0 sm:space-x-6">
                        <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-800" />
                        <div className="flex-grow text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">{userProfile.name}</h1>
                                {userProfile.mentorshipStatus === 'offering' && (
                                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">Open to Mentoring</span>
                                )}
                                {userProfile.mentorshipStatus === 'seeking' && (
                                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">Seeking a Mentor</span>
                                )}
                            </div>
                            <p className="text-md text-gray-500 dark:text-gray-400">@{userProfile.username}</p>
                            <p className="text-md text-gray-600 dark:text-gray-300 mt-1">{userProfile.title}</p>
                            {userProfile.academicInstitution && (
                                <div className="mt-2 flex items-center justify-center sm:justify-start gap-1 py-1 px-3 bg-red-500/10 border border-red-500/20 text-crimson dark:text-red-300 rounded-full text-xs font-semibold w-fit">
                                    <AcademicCapIcon className="w-3.5 h-3.5 mr-1" />
                                    <span>Enrolled Academic Institution: {userProfile.academicInstitution}</span>
                                </div>
                            )}
                            <div className="flex justify-center sm:justify-start space-x-4 mt-3">
                                {userProfile.socialLinks?.linkedin && <a href={userProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500"><LinkedInIcon className="w-6 h-6" /></a>}
                                {userProfile.socialLinks?.github && <a href={userProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 dark:hover:text-white"><GitHubIcon className="w-6 h-6" /></a>}
                                {userProfile.socialLinks?.behance && <a href={userProfile.socialLinks.behance} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600"><BehanceIcon className="w-6 h-6" /></a>}
                            </div>
                        </div>
                    </div>
                     {userProfile.bio && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                             <p className="text-gray-700 dark:text-gray-300">{userProfile.bio}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <ProfileTabButton isActive={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>Completed Courses</ProfileTabButton>
                        <ProfileTabButton isActive={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')}>Achievements</ProfileTabButton>
                        <ProfileTabButton isActive={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>Saved Courses</ProfileTabButton>
                    </div>

                    {activeTab === 'achievements' && (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {userProfile.achievements.map(ach => (
                                    <div key={ach.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform hover:scale-105">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${ach.color}`}>
                                            <ach.Icon className="w-8 h-8"/>
                                        </div>
                                        <p className="mt-3 font-bold text-gray-900 dark:text-white">{ach.name}</p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'completed' && (
                        <>
                             {completedCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {completedCourses.map(course => (
                                        <CourseCard 
                                            key={course.id} 
                                            course={course} 
                                            onSelect={onSelectCourse} 
                                            isBookmarked={bookmarkedCourseIds.has(course.id)}
                                            onToggleBookmark={onToggleBookmark}
                                        />
                                    ))}
                                </div>
                            ) : <p className="text-center text-gray-500 py-8">You haven't completed any courses yet.</p>}
                        </>
                    )}
                    
                    {activeTab === 'saved' && (
                        <>
                             {savedCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {savedCourses.map(course => (
                                        <CourseCard 
                                            key={course.id} 
                                            course={course} 
                                            onSelect={onSelectCourse} 
                                            isBookmarked={bookmarkedCourseIds.has(course.id)}
                                            onToggleBookmark={onToggleBookmark}
                                        />
                                    ))}
                                </div>
                            ) : <p className="text-center text-gray-500 py-8">You haven't saved any courses yet. Browse courses to add them!</p>}
                        </>
                    )}


                    {/* Certificates Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">My Certificates</h2>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {userProfile.certificates.map(cert => (
                                <li key={cert.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                                    <div className="flex items-center">
                                        <CertificateIcon className="w-8 h-8 text-yellow-500 mr-4"/>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{cert.courseTitle}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Issued: {cert.issuedDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-crimson dark:text-red-300 border border-crimson/50 dark:border-red-300/50 rounded-full hover:bg-crimson/10 dark:hover:bg-crimson/20">
                                            Download
                                        </button>
                                        <button onClick={() => handleVerifyClick(cert)} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-green-600 dark:text-green-300 border border-green-600/50 dark:border-green-300/50 rounded-full hover:bg-green-50 dark:hover:bg-green-900/50">
                                            Verify
                                        </button>
                                        {cert.linkedinShareUrl && (
                                            <a href={cert.linkedinShareUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-600/20 dark:border-gray-300/20 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                                <ShareIcon className="w-4 h-4 mr-2" /> Share
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                 <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <div className="sticky top-8 space-y-8">
                        {/* Career Readiness */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center font-serif">
                                <TrendingUpIcon className="w-6 h-6 mr-3 text-crimson" />
                                Career Readiness
                            </h3>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Target: {userProfile.targetCareer}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-crimson h-2.5 rounded-full" style={{ width: `${careerReadiness.percentage}%` }}></div>
                                    </div>
                                    <span className="font-bold text-crimson dark:text-red-400">{careerReadiness.percentage}%</span>
                                </div>
                                {careerReadiness.neededSkills.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-semibold text-gray-500">Skills to develop:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {careerReadiness.neededSkills.slice(0, 3).map(skill => (
                                                <span key={skill} className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Learning Goals */}
                        {userProfile.learningGoals && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center font-serif">
                                    <CheckBadgeIcon className="w-6 h-6 mr-3 text-green-500" />
                                    Learning Goals
                                </h3>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                                    <ul className="space-y-2">
                                        {userProfile.learningGoals.map(goal => (
                                            <li key={goal} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                                {goal}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {userProfile.skills && (
                             <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-serif">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 text-sm font-semibold bg-crimson/10 text-crimson rounded-full dark:bg-crimson/20 dark:text-red-200">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {userProfile.education && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-serif">Education</h3>
                                <div className="space-y-4">
                                    {userProfile.education.map((edu: EducationEntry) => (
                                        <div key={edu.id}>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{edu.institution}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{edu.degree}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">{edu.period}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        {selectedCertificate && (
             <BlockchainVerificationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                certificate={selectedCertificate}
            />
        )}
        </>
    );
};

export default ProfileView;
