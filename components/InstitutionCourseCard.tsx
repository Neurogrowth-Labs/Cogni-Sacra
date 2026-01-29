import React from 'react';
import { Course } from '../types';
import PencilIcon from './icons/PencilIcon';
import BookOpenIcon from './icons/BookOpenIcon';

interface InstitutionCourseCardProps { 
    course: Course; 
    onEdit: () => void; 
    onView: () => void;
}

const InstitutionCourseCard: React.FC<InstitutionCourseCardProps> = ({ course, onEdit, onView }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl">
        <img className="h-40 w-full object-cover" src={course.imageUrl} alt={course.title} />
        <div className="p-4 flex flex-col flex-grow">
            <p className="text-xs font-semibold text-crimson dark:text-crimson/90 uppercase">{course.category}</p>
            <h3 className="text-lg font-bold mt-1 text-gray-900 dark:text-white font-serif">{course.title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{course.isDraft ? 'Status: Draft' : `Status: ${course.status}`}</p>
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
            </div>
        </div>
    </div>
);

export default InstitutionCourseCard;
