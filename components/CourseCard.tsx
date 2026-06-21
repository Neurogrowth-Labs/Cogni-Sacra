import React from 'react';
import { Course } from '../types';
import StarIcon from './icons/StarIcon';
import { useTranslation } from '../hooks/useTranslation';
import BookmarkIcon from './icons/BookmarkIcon';
import { GraduationCap, Globe, Archive, Rocket, Sparkles, Shield, Bookmark } from 'lucide-react';

interface CourseCardProps {
    course: Course;
    onSelect: (course: Course) => void;
    isBookmarked: boolean;
    onToggleBookmark: (courseId: string) => void;
}

const getCourseStatusLabel = (course: Course): 'Self-Paced' | 'Online' | 'Archived' | 'Coming Soon' => {
    if (course.statusLabel) return course.statusLabel;
    if (course.status === 'upcoming') return 'Coming Soon';
    if (course.status === 'archived') return 'Archived';
    if (course.offeredBy === 'institution' && course.status === 'active') return 'Online';
    return 'Self-Paced';
};

const getBadgeConfig = (statusLabel: 'Self-Paced' | 'Online' | 'Archived' | 'Coming Soon') => {
    switch (statusLabel) {
        case 'Self-Paced':
            return {
                text: 'Self-Paced',
                classes: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]',
                icon: GraduationCap,
            };
        case 'Online':
            return {
                text: 'Online',
                classes: 'bg-blue-600/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-600/20 hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] animate-pulse-subtle',
                icon: Globe,
            };
        case 'Archived':
            return {
                text: 'Archived',
                classes: 'bg-slate-500/10 dark:bg-slate-550/15 text-slate-700 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/20 hover:opacity-90',
                icon: Archive,
            };
        case 'Coming Soon':
            return {
                text: 'Coming Soon',
                classes: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/15 dark:to-orange-500/20 text-amber-700 dark:text-amber-400 border-amber-500/25 hover:from-amber-500/20 hover:to-orange-500/25 hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] relative overflow-hidden',
                icon: Rocket,
                isShimmer: true
            };
        default:
            return {
                text: 'Self-Paced',
                classes: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                icon: GraduationCap,
            };
    }
};

const getBonusLabels = (course: Course): string[] => {
    const labels: string[] = [];
    if (course.price === 0) {
        labels.push('Scholarship');
    }
    if (course.offeredBy === 'institution') {
        labels.push('Faculty Led');
    } else {
        labels.push('Professional');
    }
    if (course.level === 'Advanced') {
        labels.push('Research');
    } else if (course.level === 'Intermediate') {
        labels.push('Accredited');
    } else {
        labels.push('Featured');
    }
    return labels;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, isBookmarked, onToggleBookmark }) => {
    const byText = useTranslation('by');
    const completeText = useTranslation('complete');
    const freeText = useTranslation('Free');

    const statusLabel = getCourseStatusLabel(course);
    const badge = getBadgeConfig(statusLabel);
    const StatusIcon = badge.icon;
    const bonusLabels = getBonusLabels(course);

    return (
        <div
            className="group relative bg-white/95 dark:bg-gray-800/95 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/60 shadow-md hover:shadow-2xl hover:shadow-crimson/10 dark:hover:shadow-black/60 hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer flex flex-col text-left h-full"
            onClick={() => onSelect(course)}
            onKeyDown={(e) => { 
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(course); 
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View course: ${course.title}`}
        >
            {/* Elegant glassmorphism bookmark action at Top-Left */}
            <div className="absolute top-3 left-3 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(course.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 active:scale-95 shadow-lg ${
                        isBookmarked 
                        ? 'bg-crimson border-crimson text-white hover:bg-crimson-dark' 
                        : 'bg-black/25 hover:bg-black/45 text-white border-white/20'
                    }`}
                    aria-label={isBookmarked ? 'Remove from saved courses' : 'Save course for later'}
                >
                    <Bookmark className={`w-4 h-4 transition-transform duration-300 ${isBookmarked ? 'fill-white scale-105' : 'fill-transparent'}`} />
                </button>
            </div>

            {/* Elegant Status Badge at Top-Right */}
            <div className="absolute top-3 right-3 z-20 select-none">
                <div 
                    className={`h-8 px-3.5 rounded-full border border-black/5 dark:border-white/10 ${badge.classes} backdrop-blur-[12px] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 ease-in-out cursor-default shadow-sm`}
                >
                    {badge.isShimmer && (
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-none" />
                    )}
                    <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="tracking-wide">{badge.text}</span>
                </div>
            </div>

            {/* Card Hero Image Area */}
            <div className="relative overflow-hidden h-48 select-none">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    src={course.imageUrl} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    aria-hidden="true" 
                />
                
                {/* Premium academic gradient mask overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                
                {/* Premium stacked category and bonus labels at bottom-left */}
                <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase bg-crimson/90 rounded-md shadow-sm backdrop-blur-[4px]">
                        {course.category}
                    </span>
                    {bonusLabels.slice(0, 2).map((lbl, idx) => (
                        <span 
                            key={idx} 
                            className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase bg-slate-900/60 rounded-md shadow-sm backdrop-blur-[6px] border border-white/10"
                        >
                            {lbl}
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Card Body Information */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Academic Title - serif / premium feeling */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 font-serif group-hover:text-crimson dark:group-hover:text-red-400 transition-colors duration-300 leading-tight">
                    {course.title}
                </h3>
                
                {/* Offered By Academic Detail Block */}
                <div className="mt-3.5 mb-4 p-3 rounded-xl bg-slate-50/75 dark:bg-slate-900/40 border border-slate-100/80 dark:border-slate-800/60 text-[11px] leading-snug space-y-1.5 transition-colors duration-300 group-hover:border-slate-200 dark:group-hover:border-slate-700">
                    {course.offeredBy === 'institution' ? (
                        <>
                            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                                <span className="shrink-0 text-xs">🏢</span>
                                <span className="truncate">{course.institutionName || course.university || 'CogniSacra Academy'}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-0.5 text-slate-500 dark:text-slate-450 font-medium pl-3.5">
                                <div className="truncate">
                                    <span className="opacity-60 font-semibold text-[10.5px]">Faculty:</span> {course.facultyName || 'Sovereign Academic Faculty'}
                                </div>
                                <div className="truncate">
                                    <span className="opacity-60 font-semibold text-[10.5px]">Campus:</span> {course.campusName || 'Main Campus'}
                                </div>
                                <div className="truncate mt-0.5">
                                    <span className="inline-block bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider border border-rose-100/30 dark:border-rose-900/30">
                                        {course.qualificationType || course.certificateType || 'Professional Certificate'}
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                                <span className="shrink-0 text-xs">👨‍🏫</span>
                                <span className="truncate">{course.instructor}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-0.5 text-slate-500 dark:text-slate-450 font-medium pl-3.5">
                                <div className="line-clamp-1">
                                    <span className="opacity-60 font-semibold text-[10.5px]">Credentials:</span> {course.instructorCredentials || 'Subject Matter Expert'}
                                </div>
                                <div className="truncate">
                                    <span className="opacity-60 font-semibold text-[10.5px]">Country:</span> 🌍 {course.instructorCountry || 'Sovereign Africa'}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Metadata & Pricing */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/80">
                    <div className="flex flex-col">
                        {course.rating && course.reviews ? (
                            <div className="flex items-center mb-1 select-none">
                                <span className="font-bold text-amber-500 text-sm mr-1">{course.rating.toFixed(1)}</span>
                                <StarIcon className="w-3.5 h-3.5 text-amber-450 fill-current text-amber-500" />
                                <span className="text-xs text-slate-405 dark:text-slate-400 ml-1">
                                    ({course.reviews >= 1000 ? (course.reviews / 1000).toFixed(1) + 'k' : course.reviews})
                                </span>
                            </div>
                        ) : <div className="h-5"></div>}
                        <p className="text-base font-extrabold text-slate-900 dark:text-white select-none">
                            {course.price === 0 ? freeText : `$${course.price}`}
                        </p>
                    </div>

                    {course.progress > 0 ? (
                        <div className="flex flex-col items-end select-none">
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-705 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-crimson to-orange-500 rounded-full animate-pulse-subtle" style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <p className="text-[10px] font-semibold text-slate-505 dark:text-slate-400 mt-1">
                                {course.progress === 100 ? 'Done' : `${course.progress}% ${completeText}`}
                            </p>
                        </div>
                    ) : (
                        <div className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-700/80 px-2 py-1 rounded select-none border border-slate-200/20">
                            {course.level}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
