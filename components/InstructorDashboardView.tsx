import React from 'react';
import { Course, UserProfile } from '../types';
import PencilIcon from './icons/PencilIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import MentorshipRequestCard from './MentorshipRequestCard';
import CheckIcon from './icons/CheckIcon';
import { Radio } from 'lucide-react';

interface InstructorDashboardViewProps {
    courses: Course[];
    onEditCourse: (course: Course) => void;
    onViewCourse: (course: Course) => void;
    onCreateCourse: () => void;
    onViewAnalytics: (course: Course) => void;
    seekingMentorshipLearners: UserProfile[];
    subscriptionPlan: string | null;
    rejoinSession?: any;
    onRejoinSession?: () => void;
}

const InstructorCourseCard: React.FC<{ 
    course: Course; 
    onEdit: () => void; 
    onView: () => void;
    onViewAnalytics: () => void;
}> = ({ course, onEdit, onView, onViewAnalytics }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl">
        <img className="h-40 w-full object-cover" src={course.imageUrl} alt={course.title} />
        <div className="p-4 flex flex-col flex-grow">
            <p className="text-xs font-semibold text-crimson dark:text-crimson/90 uppercase">{course.category}</p>
            <h3 className="text-lg font-bold mt-1 text-gray-900 dark:text-white font-serif">{course.title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{course.isDraft ? 'Status: Draft' : 'Status: Published'}</p>
            <div className="mt-4 flex-grow"></div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={onEdit} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-crimson rounded-full hover:bg-red-800">
                    <PencilIcon className="w-4 h-4 mr-2"/>
                    Edit
                </button>
                 <button onClick={onView} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                    <BookOpenIcon className="w-4 h-4 mr-2"/>
                    View
                </button>
                 <button onClick={onViewAnalytics} className="col-span-2 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                    <ChartBarIcon className="w-4 h-4 mr-2"/>
                    Analytics
                </button>
            </div>
        </div>
    </div>
);

const InstructorDashboardView: React.FC<InstructorDashboardViewProps> = ({ 
    courses, 
    onEditCourse, 
    onViewCourse, 
    onCreateCourse, 
    onViewAnalytics, 
    seekingMentorshipLearners, 
    subscriptionPlan,
    rejoinSession,
    onRejoinSession
}) => {
    return (
        <div className="animate-fade-in">
            {rejoinSession && (
                <div id="instructor-rejoin-banner" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-pulse-subtle">
                    <div className="flex items-center gap-3">
                         <div className="p-2.5 bg-crimson text-white rounded-xl">
                              <Radio className="w-5 h-5 animate-pulse" />
                         </div>
                         <div>
                              <h3 className="text-sm font-bold text-gray-900">Live Session Interrupted / Left</h3>
                              <p className="text-xs text-slate-600 font-medium mt-0.5">
                                   "{rejoinSession.title}" is currently active. Click below to rejoin the session.
                              </p>
                         </div>
                    </div>
                    <button 
                         onClick={onRejoinSession}
                         className="px-4 py-2 text-xs font-bold text-white bg-crimson hover:bg-red-800 rounded-xl shadow cursor-pointer transition flex items-center gap-1 shrink-0"
                    >
                         Rejoin Live Class &rarr;
                    </button>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">Instructor Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Manage your courses and create new content.</p>
                     {subscriptionPlan && (
                        <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                            <CheckIcon className="w-5 h-5" />
                            <span>Active Plan: {subscriptionPlan}</span>
                        </div>
                    )}
                </div>
                <button onClick={onCreateCourse} className="px-6 py-3 font-semibold text-white bg-crimson rounded-full hover:bg-red-800 shadow-lg transition-transform hover:scale-105 self-start md:self-center">
                    Create New Course
                </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">My Courses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map(course => (
                    <InstructorCourseCard 
                        key={course.id} 
                        course={course} 
                        onEdit={() => onEditCourse(course)} 
                        onView={() => onViewCourse(course)}
                        onViewAnalytics={() => onViewAnalytics(course)} 
                    />
                ))}
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-8"></div>

            <div>
                <div className="flex items-center mb-4">
                     <UserPlusIcon className="w-6 h-6 mr-3 text-crimson" />
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-serif">Learners Seeking Mentorship</h2>
                </div>
                {seekingMentorshipLearners && seekingMentorshipLearners.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {seekingMentorshipLearners.map(learner => (
                            <MentorshipRequestCard key={learner.username} learner={learner} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No learners are currently seeking mentorship.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorDashboardView;
