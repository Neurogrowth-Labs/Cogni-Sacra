import React from 'react';
import { Course } from '../types';
import StarIcon from './icons/StarIcon';
import { useTranslation } from '../hooks/useTranslation';
import BookmarkIcon from './icons/BookmarkIcon';

interface FeaturedCourseCardProps {
    course: Course;
    onSelect: (course: Course) => void;
    isBookmarked: boolean;
    onToggleBookmark: (courseId: string) => void;
}

const FeaturedCourseCard: React.FC<FeaturedCourseCardProps> = ({ course, onSelect, isBookmarked, onToggleBookmark }) => {
    const featuredText = useTranslation('Featured Course');

    return (
        <div
            className="relative w-full text-left rounded-2xl overflow-hidden shadow-xl cursor-pointer group transform hover:scale-[1.03] transition-transform duration-300 block"
            onClick={() => onSelect(course)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(course) }}
            role="button"
            tabIndex={0}
            aria-label={`View featured course: ${course.title}`}
        >
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(course.id);
                    }}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                    aria-label={isBookmarked ? 'Remove from saved courses' : 'Save course for later'}
                >
                    <BookmarkIcon className={`w-6 h-6 transition-colors ${isBookmarked ? 'fill-white' : 'fill-transparent'}`} />
                </button>
            </div>
            <img src={course.imageUrl} alt="" className="w-full h-64 object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center space-x-2 bg-amber-400 text-black px-3 py-1 rounded-full self-start mb-2 backdrop-blur-sm bg-opacity-90">
                    <StarIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">{featuredText}</span>
                </div>
                <h3 className="text-3xl font-extrabold font-serif">{course.title}</h3>
                <p className="mt-2 text-sm text-gray-200 line-clamp-2 max-w-2xl">{course.description}</p>
                <div className="flex items-center mt-4">
                    {course.instructorImage && (
                        <img src={course.instructorImage} alt={course.instructor} className="w-8 h-8 rounded-full object-cover mr-3" />
                    )}
                    <p className="text-sm font-semibold">{course.instructor}</p>
                    {course.rating && course.reviews && (
                        <div className="flex items-center ml-4">
                            <StarIcon className="w-5 h-5 text-amber-400 fill-current" />
                            <span className="font-bold text-white ml-1">{course.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-300 ml-2">({course.reviews.toLocaleString()})</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedCourseCard;
