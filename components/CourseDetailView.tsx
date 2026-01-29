
import React, { useState, useMemo } from 'react';
import { Course, Module, Lesson } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import { getLessonIcon } from './utils/uiUtils';
import ComingSoonModal from './ComingSoonModal';
import FeedbackModal from './FeedbackModal';
import AnnotationIcon from './icons/AnnotationIcon';
import LockClosedIcon from './icons/LockClosedIcon';
import CourseCard from './CourseCard';

interface CourseDetailViewProps {
    course: Course;
    onBack: () => void;
    onStartLesson: (lesson: Lesson) => void;
    allCourses: Course[];
    onSelectCourse: (course: Course) => void;
    bookmarkedCourseIds: Set<string>;
    onToggleBookmark: (courseId: string) => void;
}

const getLessonActionText = (format: Lesson['format']) => {
     switch (format) {
        case 'video':
            return 'Start Lesson';
        case 'reading':
            return 'Start Lesson';
        case 'quiz':
            return 'Start Quiz';
        case 'adaptive-quiz':
            return 'Start Assessment';
        case 'metaverse':
            return 'Enter VR';
        case 'project':
            return 'View Project';
        case 'live-session':
            return 'Join Session';
        default:
            return 'Start';
    }
}

const LessonItem: React.FC<{ lesson: Lesson, onStartLesson: (lesson: Lesson) => void, onShowComingSoon: () => void }> = ({ lesson, onStartLesson, onShowComingSoon }) => {
    const handleActionClick = () => {
        if (lesson.isLocked) return;
        if (lesson.format === 'metaverse') {
            onShowComingSoon();
        } else {
            onStartLesson(lesson);
        }
    };
    
    return (
    <div className={`flex flex-col items-start sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${lesson.isLocked ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
        <div className="flex items-center">
             <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-gray-100 dark:bg-gray-900">
                {lesson.isLocked ? <LockClosedIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" /> : getLessonIcon(lesson.format, "w-6 h-6")}
            </div>
            <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{lesson.title}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{lesson.duration}</span>
                    {lesson.isCompleted && <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">Completed</span>}
                </div>
            </div>
        </div>
        <button 
            onClick={handleActionClick}
            disabled={lesson.isLocked}
            className="px-4 py-2 text-sm font-medium text-white bg-crimson rounded-full hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed mt-3 sm:mt-0 self-end sm:self-center"
            aria-label={lesson.isLocked ? `Complete previous module to unlock this lesson` : `${getLessonActionText(lesson.format)}: ${lesson.title}`}
        >
            {getLessonActionText(lesson.format)}
        </button>
    </div>
    );
};


const ModuleItem: React.FC<{ module: Module, onStartLesson: (lesson: Lesson) => void, onShowComingSoon: () => void }> = ({ module, onStartLesson, onShowComingSoon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif">{module.title}</h3>
            {module.prerequisites && module.prerequisites.length > 0 && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400" title={`Requires completion of Module ${module.prerequisites.join(', ')}`}>
                    <LockClosedIcon className="w-4 h-4 mr-1"/>
                    <span>Prerequisite required</span>
                </div>
            )}
        </div>
        <div>
            {module.lessons.map(lesson => <LessonItem key={lesson.id} lesson={lesson} onStartLesson={onStartLesson} onShowComingSoon={onShowComingSoon} />)}
        </div>
    </div>
);


const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, onBack, onStartLesson, allCourses, onSelectCourse, bookmarkedCourseIds, onToggleBookmark }) => {
    const [isComingSoonModalOpen, setComingSoonModalOpen] = useState(false);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const relatedCourses = useMemo(() => {
        return allCourses
            .filter(c => c.category === course.category && c.id !== course.id)
            .slice(0, 3);
    }, [allCourses, course]);

    return (
        <>
        <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="flex items-center text-crimson dark:text-crimson/90 hover:underline mb-6 font-semibold">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Courses
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:h-full md:w-64" src={course.imageUrl} alt={course.title} />
                    </div>
                    <div className="p-8 relative">
                        <div className="uppercase tracking-wide text-sm text-crimson dark:text-crimson/90 font-semibold">{course.category}</div>
                        <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black dark:text-white font-serif">{course.title}</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">by {course.instructor}</p>
                        <p className="mt-4 text-gray-700 dark:text-gray-300">{course.description}</p>
                        <button 
                            onClick={() => setFeedbackModalOpen(true)} 
                            className="absolute top-6 right-6 flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            <AnnotationIcon className="w-4 h-4 mr-2" />
                            Leave Feedback
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Course Content</h2>
                {course.modules.map(module => <ModuleItem key={module.id} module={module} onStartLesson={onStartLesson} onShowComingSoon={() => setComingSoonModalOpen(true)} />)}
            </div>
            
            {relatedCourses.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Related Courses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedCourses.map(relatedCourse => (
                            <CourseCard
                                key={relatedCourse.id}
                                course={relatedCourse}
                                onSelect={onSelectCourse}
                                isBookmarked={bookmarkedCourseIds.has(relatedCourse.id)}
                                onToggleBookmark={onToggleBookmark}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
        <ComingSoonModal 
            isOpen={isComingSoonModalOpen}
            onClose={() => setComingSoonModalOpen(false)}
            featureName="Metaverse Classroom"
            featureDescription="Get ready for a fully immersive VR/AR learning experience. This feature is currently under development and will be available soon!"
        />
        <FeedbackModal 
            isOpen={isFeedbackModalOpen}
            onClose={() => setFeedbackModalOpen(false)}
            courseTitle={course.title}
        />
        </>
    );
};

export default CourseDetailView;
