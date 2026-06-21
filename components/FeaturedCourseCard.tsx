import React from 'react';
import { Course } from '../types';
import StarIcon from './icons/StarIcon';
import { useTranslation } from '../hooks/useTranslation';
import { GraduationCap, Globe, Archive, Rocket, Bookmark } from 'lucide-react';

interface FeaturedCourseCardProps {
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
                classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]',
                icon: GraduationCap,
            };
        case 'Online':
            return {
                text: 'Online',
                classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/25 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-pulse-subtle',
                icon: Globe,
            };
        case 'Archived':
            return {
                text: 'Archived',
                classes: 'bg-slate-500/15 text-slate-300 border-slate-500/30 hover:bg-slate-500/25',
                icon: Archive,
            };
        case 'Coming Soon':
            return {
                text: 'Coming Soon',
                classes: 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300 border-amber-500/35 hover:from-amber-500/25 hover:to-orange-500/25 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] relative overflow-hidden',
                icon: Rocket,
                isShimmer: true
            };
        default:
            return {
                text: 'Self-Paced',
                classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                icon: GraduationCap,
            };
    }
};

const FeaturedCourseCard: React.FC<FeaturedCourseCardProps> = ({ course, onSelect, isBookmarked, onToggleBookmark }) => {
    const featuredText = useTranslation('Featured Course');

    const statusLabel = getCourseStatusLabel(course);
    const badge = getBadgeConfig(statusLabel);
    const StatusIcon = badge.icon;

    return (
        <div
            className="group relative w-full text-left rounded-2xl overflow-hidden shadow-xl cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 ease-out block border border-white/5 dark:border-white/10"
            onClick={() => onSelect(course)}
            onKeyDown={(e) => { 
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(course); 
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View featured course: ${course.title}`}
        >
            {/* Glassmorphic bookmark action at Top-Left */}
            <div className="absolute top-4 left-4 z-25">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(course.id);
                    }}
                    className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 active:scale-95 shadow-lg ${
                        isBookmarked 
                        ? 'bg-crimson border-crimson text-white hover:bg-crimson-dark' 
                        : 'bg-black/30 hover:bg-black/55 text-white border-white/20'
                    }`}
                    aria-label={isBookmarked ? 'Remove from saved courses' : 'Save course for later'}
                >
                    <Bookmark className={`w-4.5 h-4.5 transition-transform duration-300 ${isBookmarked ? 'fill-white scale-105' : 'fill-transparent'}`} />
                </button>
            </div>

            {/* Elegant Status Badge at Top-Right */}
            <div className="absolute top-4 right-4 z-25 select-none">
                <div 
                    className={`h-8 px-3.5 rounded-full border border-white/10 ${badge.classes} backdrop-blur-[12px] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 ease-in-out cursor-default shadow-md`}
                >
                    {badge.isShimmer && (
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-none" />
                    )}
                    <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="tracking-wide">{badge.text}</span>
                </div>
            </div>

            <img 
                src={course.imageUrl} 
                alt="" 
                referrerPolicy="no-referrer"
                className="w-full h-72 object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none" 
                aria-hidden="true" 
            />
            
            {/* Premium, deep dark gradient masks to ensure high contrast legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/10"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white select-none">
                <div className="flex items-center space-x-2 bg-amber-450 border border-amber-300/35 text-black px-3.5 py-1 rounded-full self-start mb-3 backdrop-blur-sm bg-opacity-95 shadow-md">
                    <StarIcon className="w-3.5 h-3.5 shrink-0 text-black fill-current" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">{featuredText}</span>
                </div>
                
                <h3 className="text-3xl font-extrabold font-serif tracking-tight leading-tight group-hover:text-amber-300 transition-colors duration-300">
                    {course.title}
                </h3>
                
                <p className="mt-2 text-sm text-slate-200 line-clamp-2 max-w-2xl leading-relaxed">
                    {course.description}
                </p>
                
                {/* Offering Entity Label Info for Featured */}
                <div className="mt-4 max-w-xl p-3.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 space-y-1 text-xs transition-colors duration-300 group-hover:border-white/20">
                    {course.offeredBy === 'institution' ? (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                            <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                                <span className="text-sm">🏢</span>
                                <span>{course.institutionName || course.university || 'CogniSacra Academy'}</span>
                            </div>
                            <div className="text-slate-350"><span className="opacity-60 font-semibold">Faculty:</span> {course.facultyName || 'Sovereign Academic Faculty'}</div>
                            <div className="text-slate-350"><span className="opacity-60 font-semibold">Campus:</span> {course.campusName || 'Main Campus'}</div>
                            <div>
                                <span className="bg-rose-500/25 text-rose-200 border border-rose-500/30 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">
                                    {course.qualificationType || course.certificateType || 'Professional Certificate'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                            <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                                <span className="text-sm">👨‍🏫</span>
                                <span>{course.instructor}</span>
                            </div>
                            <div className="text-slate-350"><span className="opacity-60 font-semibold">Credentials:</span> {course.instructorCredentials || 'Certified Subject Expert'}</div>
                            <div className="text-slate-305 font-medium flex items-center gap-1">🌍 <span>{course.instructorCountry || 'Sovereign Africa'}</span></div>
                        </div>
                    )}
                </div>

                <div className="flex items-center mt-4">
                    {course.instructorImage && (
                        <img src={course.instructorImage} alt={course.instructor} className="w-8 h-8 rounded-full object-cover mr-3 border border-white/20" />
                    )}
                    <p className="text-sm font-semibold text-slate-100">{course.instructor}</p>
                    {course.rating && course.reviews && (
                        <div className="flex items-center ml-5">
                            <StarIcon className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="font-bold text-white ml-1 text-sm">{course.rating.toFixed(1)}</span>
                            <span className="text-xs text-slate-300 ml-1.5 font-medium">({course.reviews.toLocaleString()})</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedCourseCard;
