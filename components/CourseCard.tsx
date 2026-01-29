
import React from 'react';
import { Course } from '../types';
import StarIcon from './icons/StarIcon';
import { useTranslation } from '../hooks/useTranslation';
import BookmarkIcon from './icons/BookmarkIcon';

interface CourseCardProps {
    course: Course;
    onSelect: (course: Course) => void;
    isBookmarked: boolean;
    onToggleBookmark: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, isBookmarked, onToggleBookmark }) => {
    const byText = useTranslation('by');
    const completeText = useTranslation('complete');
    const freeText = useTranslation('Free');

    return (
        <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-crimson/10 dark:hover:shadow-black/50 hover:scale-105 transition-all duration-300 ease-out cursor-pointer flex flex-col text-left group h-full"
            onClick={() => onSelect(course)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(course) }}
            role="button"
            tabIndex={0}
            aria-label={`View course: ${course.title}`}
        >
             <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(course.id);
                    }}
                    className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm active:scale-90 ${isBookmarked ? 'bg-crimson text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                    aria-label={isBookmarked ? 'Remove from saved courses' : 'Save course for later'}
                >
                    <BookmarkIcon className={`w-5 h-5 transition-colors ${isBookmarked ? 'fill-white' : 'fill-transparent'}`} />
                </button>
            </div>
            <div className="relative overflow-hidden h-48">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={course.imageUrl} 
                    alt="" 
                    aria-hidden="true" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                <div className="absolute bottom-3 left-3">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase bg-crimson/90 rounded-md shadow-sm">
                        {course.category}
                    </span>
                </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white h-[3.5rem] line-clamp-2 font-serif group-hover:text-crimson dark:group-hover:text-red-400 transition-colors leading-tight">
                    {course.title}
                </h3>
                
                <div className="flex items-center mt-3 mb-3">
                    {course.instructorImage ? (
                         <img src={course.instructorImage} alt={course.instructor} className="w-6 h-6 rounded-full object-cover mr-2 ring-2 ring-gray-100 dark:ring-gray-700" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                    )}
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{byText} <span className="text-gray-700 dark:text-gray-300">{course.instructor}</span></p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col">
                         {course.rating && course.reviews ? (
                            <div className="flex items-center mb-1">
                                <span className="font-bold text-amber-500 text-sm mr-1">{course.rating.toFixed(1)}</span>
                                <StarIcon className="w-4 h-4 text-amber-400 fill-current" />
                                <span className="text-xs text-gray-400 ml-1">({course.reviews >= 1000 ? (course.reviews/1000).toFixed(1) + 'k' : course.reviews})</span>
                            </div>
                        ) : <div className="h-5"></div>}
                        <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                            {course.price === 0 ? freeText : `$${course.price}`}
                        </p>
                    </div>

                    {course.progress > 0 ? (
                        <div className="flex flex-col items-end">
                             <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-crimson to-orange-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                             </div>
                             <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                {course.progress === 100 ? 'Done' : `${course.progress}%`}
                            </p>
                        </div>
                    ) : (
                        <div className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {course.level}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
