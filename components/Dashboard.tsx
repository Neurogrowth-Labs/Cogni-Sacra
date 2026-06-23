
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Course, UserRole } from '../types';
import { motivationalQuotes } from '../constants';
import CourseCard from './CourseCard';
import FireIcon from './icons/FireIcon';
import TrophyIcon from './icons/TrophyIcon';
import ClockIcon from './icons/ClockIcon';
import { useTranslation } from '../hooks/useTranslation';
import FeaturedCourseCard from './FeaturedCourseCard';
import EmptyState from './EmptyState';
import CogniSacraLogo from './icons/IntelliLearnLogo';
import { getQuickAnswer } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface DashboardProps {
    courses: Course[];
    onSelectCourse: (course: Course) => void;
    onNavigate: (view: 'profile') => void;
    bookmarkedCourseIds: Set<string>;
    onToggleBookmark: (courseId: string) => void;
    userName: string;
    searchTerm: string;
    userRole: UserRole;
}

const ProgressCircle: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-32 h-32 group">
            <div className="absolute inset-0 bg-crimson/5 rounded-full blur-xl group-hover:bg-crimson/10 transition-colors duration-500"></div>
            <svg className="w-full h-full relative z-10" viewBox="0 0 120 120">
                 <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A51C30" />
                        <stop offset="100%" stopColor="#FB7185" />
                    </linearGradient>
                </defs>
                <circle className="text-gray-100 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                <circle 
                    strokeWidth="8" 
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="url(#progressGradient)" 
                    fill="transparent" 
                    r={radius} 
                    cx="60" 
                    cy="60" 
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{percentage}%</span>
                 <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Avg</span>
            </div>
        </div>
    );
};

const QuickQuestionWidget: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = useCallback(async () => {
        if (!question.trim()) return;
        setIsLoading(true);
        setAnswer('');
        try {
            const response = await getQuickAnswer(question);
            setAnswer(response.text);
        } catch (error) {
            console.error(error);
            setAnswer('Sorry, I couldn\'t get an answer. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [question]);
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-glass dark:shadow-none border border-white/50 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif mb-4 flex items-center relative z-10">
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
                Quick Question
            </h3>
            <div className="relative z-10">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
                    placeholder="e.g., 'What is React?'"
                    className="w-full pl-4 pr-16 py-3 text-sm rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button
                    onClick={handleAsk}
                    disabled={isLoading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
                >
                    {isLoading ? '...' : 'Ask'}
                </button>
            </div>
            {answer && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 animate-fade-in relative z-10">
                    {answer}
                </div>
            )}
        </div>
    );
};


const DashboardSidebar: React.FC<{ onNavigate: (view: 'profile') => void, courses: Course[] }> = ({ onNavigate, courses }) => {
    const yourProgressText = useTranslation('Your Progress');
    const avgCompletionText = useTranslation('Average completion');
    const upcomingDeadlinesText = useTranslation('Upcoming Deadlines');
    const noDeadlinesText = useTranslation('No upcoming deadlines.');
    const myAchievementsText = useTranslation('My Achievements');
    const viewAchievementsText = useTranslation('View unlocked badges');
    const viewNowText = useTranslation('View Now');

    const ongoingCourses = useMemo(() => courses.filter(c => c.progress > 0 && c.progress < 100), [courses]);
    const avgProgress = useMemo(() => ongoingCourses.length > 0 ? Math.round(ongoingCourses.reduce((acc, c) => acc + c.progress, 0) / ongoingCourses.length) : 0, [ongoingCourses]);
    
    const deadlines = useMemo(() => {
        const allDeadlines: { date: Date; title: string; course: string; }[] = [];
        courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => {
            if (l.deadline && !l.isCompleted && new Date(l.deadline) > new Date()) {
                allDeadlines.push({ date: new Date(l.deadline), title: l.title, course: c.title });
            }
        })));
        return allDeadlines.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 3);
    }, [courses]);
    
    return (
        <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-glass dark:shadow-none border border-white/50 dark:border-gray-700 flex flex-col items-center text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif mb-4 w-full text-left">{yourProgressText}</h3>
                <ProgressCircle percentage={avgProgress} />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-4">{avgCompletionText}</p>
            </div>
            
            <QuickQuestionWidget />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-glass dark:shadow-none border border-white/50 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif mb-4 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-crimson" />
                    {upcomingDeadlinesText}
                </h3>
                {deadlines.length > 0 ? (
                    <ul className="space-y-4">
                        {deadlines.map((d, i) => (
                             <li key={i} className="flex flex-col border-l-2 border-gray-200 dark:border-gray-700 pl-3 py-1">
                                <span className="text-xs font-bold text-crimson uppercase tracking-wide">{d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 mt-0.5">{d.title}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">{d.course}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{noDeadlinesText}</p>
                )}
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl shadow-glass dark:shadow-none border border-amber-100 dark:border-gray-700 flex items-center space-x-4 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('profile')}>
                <div className="absolute right-0 top-0 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-amber-400/30 transition-colors"></div>
                <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-amber-500 relative z-10">
                    <TrophyIcon className="w-6 h-6" />
                </div>
                <div className="relative z-10">
                    <h3 className="font-bold text-gray-900 dark:text-white">{myAchievementsText}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{viewAchievementsText}</p>
                </div>
            </div>
        </div>
    );
};


const DashboardHero: React.FC<{ quote: string, userName: string, userRole: UserRole }> = ({ quote, userName, userRole }) => {
    const welcomeText = useTranslation('Welcome back,');
    const subtitleText = useTranslation("Let's make today a great day for learning.");
    
    // Display full name for institutions, first name for others
    const displayName = userRole === 'institution' ? userName : (userName.split(' ')[0] || 'Learner');
    
    return (
        <div className="relative p-8 sm:p-10 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
            <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6 text-gray-900 dark:text-white">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center space-x-2 bg-crimson/5 dark:bg-crimson/10 px-3 py-1 rounded-full mb-4 border border-crimson/10">
                        <FireIcon className="w-4 h-4 text-crimson" />
                        <span className="text-xs font-bold tracking-wide uppercase text-crimson">5 Day Streak</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-tight">
                        {welcomeText} <br/><span className="font-extrabold text-crimson">{displayName}!</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-normal max-w-lg leading-relaxed">{subtitleText}</p>
                </div>
                
                <div className="md:text-right max-w-xs border-l-2 border-crimson/30 pl-4 md:border-l-0 md:border-r-2 md:pl-0 md:pr-4">
                     <p className="text-sm italic text-gray-400 dark:text-gray-500">
                        "{quote}"
                     </p>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ courses, onSelectCourse, onNavigate, bookmarkedCourseIds, onToggleBookmark, userName, searchTerm, userRole }) => {
    const [quote, setQuote] = useState('');
    const [courseTypeFilter, setCourseTypeFilter] = useState<'all' | 'instructor' | 'institution'>('all');
    const [filters, setFilters] = useState({
        subject: 'All',
        level: 'All',
        price: 'All',
        university: 'All',
        language: 'All',
    });

    const continueJourneyText = useTranslation('Continue Your Journey');
    const exploreCoursesText = useTranslation('Explore Courses');
    const findPerfectCourseText = useTranslation('Find the perfect course to kickstart your learning journey.');
    const trendingSkillsText = useTranslation('Trending Skills');
    const freeCoursesText = useTranslation('Free Courses');


    useEffect(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, []);

    const handleScrollToCatalog = useCallback(() => {
        const catalogElement = document.getElementById('explore-catalog');
        if (catalogElement) {
            catalogElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const ongoingCourses = useMemo(() => courses.filter(c => c.progress > 0 && c.progress < 100), [courses]);
    const categories = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.category)))], [courses]);
    const universities = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.university).filter(Boolean)))], [courses]);
    const languages = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.language).filter(Boolean)))], [courses]);
    
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const typeMatch = courseTypeFilter === 'all' || 
                              (courseTypeFilter === 'instructor' && !course.university) || 
                              (courseTypeFilter === 'institution' && !!course.university);

            const searchMatch = searchTerm === '' || 
                                course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                course.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
            const subjectMatch = filters.subject === 'All' || course.category === filters.subject;
            const levelMatch = filters.level === 'All' || course.level === filters.level;
            const priceMatch = filters.price === 'All' || (filters.price === 'Free' && course.price === 0);
            const universityMatch = filters.university === 'All' || course.university === filters.university;
            const languageMatch = filters.language === 'All' || course.language === filters.language;
            
            return typeMatch && searchMatch && subjectMatch && levelMatch && priceMatch && universityMatch && languageMatch;
        });
    }, [courses, searchTerm, filters, courseTypeFilter]);

    const freeCourses = useMemo(() => courses.filter(c => c.price === 0), [courses]);
    const trendingCourses = useMemo(() => [...courses].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5), [courses]);
    const featuredCourse = trendingCourses.length > 0 ? trendingCourses[0] : null;

    const gridKey = useMemo(() => JSON.stringify(filters) + searchTerm + courseTypeFilter, [filters, searchTerm, courseTypeFilter]);

    return (
        <div className="animate-fade-in pb-12">
            <div>
                <DashboardHero quote={quote} userName={userName} userRole={userRole} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                <div className="lg:col-span-3 space-y-12">
                     {ongoingCourses.length === 0 && bookmarkedCourseIds.size === 0 && (
                         <EmptyState onBrowse={handleScrollToCatalog} />
                     )}
                     
                     {ongoingCourses.length > 0 && (
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="h-8 w-1 bg-crimson rounded-full mr-3"></div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{continueJourneyText}</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                {ongoingCourses.map(course => (
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
                    )}
                    
                    <div id="explore-catalog">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{exploreCoursesText}</h2>
                            <p className="mt-1 text-md text-gray-500 dark:text-gray-400">{findPerfectCourseText}</p>
                        </div>
                        
                        {featuredCourse && (
                            <div className="my-8">
                                <FeaturedCourseCard 
                                    course={featuredCourse} 
                                    onSelect={onSelectCourse} 
                                    isBookmarked={bookmarkedCourseIds.has(featuredCourse.id)}
                                    onToggleBookmark={onToggleBookmark}
                                />
                            </div>
                        )}

                        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-glass dark:shadow-none border border-white/50 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                                {(['all', 'instructor', 'institution'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setCourseTypeFilter(type)}
                                        className={`px-5 py-2 text-sm font-bold rounded-full capitalize transition-all duration-300 ${
                                            courseTypeFilter === type
                                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg transform scale-105'
                                                : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {type === 'instructor' ? 'Instructors' : type}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <SelectFilter label="Level" value={filters.level} onChange={(v) => setFilters({...filters, level: v})} options={['All', 'Beginner', 'Intermediate', 'Advanced']} />
                                <SelectFilter label="Price" value={filters.price} onChange={(v) => setFilters({...filters, price: v})} options={['All', 'Free']} />
                                <SelectFilter label="Partner" value={filters.university} onChange={(v) => setFilters({...filters, university: v})} options={universities} />
                                <SelectFilter label="Language" value={filters.language} onChange={(v) => setFilters({...filters, language: v})} options={languages} />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setFilters({ ...filters, subject: category })}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors duration-200 border ${
                                            filters.subject === category 
                                                ? 'bg-crimson/10 text-crimson border-crimson/20' 
                                                : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* High Visibility Quick-Filter Category Pills */}
                        <div className="flex flex-wrap items-center gap-2 mt-8 mb-1 border-b border-gray-100 dark:border-gray-800 pb-4 select-none">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-2">Categories:</span>
                            {categories.map(category => {
                                const isActive = filters.subject === category;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setFilters(f => ({ ...f, subject: category }))}
                                        className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all duration-200 transform active:scale-95 cursor-pointer ${
                                            isActive
                                                ? 'bg-crimson border-crimson text-white shadow-md'
                                                : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>

                        <div key={gridKey} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            {filteredCourses.map((course, index) => (
                                <div key={course.id} className="animate-stagger-in" style={{ animationDelay: `${index * 75}ms` }}>
                                    <CourseCard
                                        course={course} 
                                        onSelect={onSelectCourse} 
                                        isBookmarked={bookmarkedCourseIds.has(course.id)}
                                        onToggleBookmark={onToggleBookmark}
                                    />
                                </div>
                            ))}
                        </div>
                        {filteredCourses.length === 0 && (
                            <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 mt-6">
                                <p className="text-lg font-medium">No courses match your criteria.</p>
                                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="h-8 w-1 bg-amber-400 rounded-full mr-3"></div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{trendingSkillsText}</h2>
                            </div>
                            <div className="flex overflow-x-auto space-x-6 pb-6 -mx-4 px-4 scrollbar-hide">
                                {trendingCourses.map(course => (
                                <div key={course.id} className="flex-shrink-0 w-80">
                                        <CourseCard 
                                            course={course} 
                                            onSelect={onSelectCourse} 
                                            isBookmarked={bookmarkedCourseIds.has(course.id)}
                                            onToggleBookmark={onToggleBookmark}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center mb-6">
                                <div className="h-8 w-1 bg-green-500 rounded-full mr-3"></div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{freeCoursesText}</h2>
                            </div>
                            <div className="flex overflow-x-auto space-x-6 pb-6 -mx-4 px-4 scrollbar-hide">
                                {freeCourses.map(course => (
                                    <div key={course.id} className="flex-shrink-0 w-80">
                                        <CourseCard 
                                            course={course} 
                                            onSelect={onSelectCourse} 
                                            isBookmarked={bookmarkedCourseIds.has(course.id)}
                                            onToggleBookmark={onToggleBookmark}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <DashboardSidebar onNavigate={onNavigate} courses={courses} />
                </div>
            </div>
        </div>
    );
};

const SelectFilter: React.FC<{ label: string; value: string; onChange: (val: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="sr-only">Filter by {label}</label>
        <select 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-crimson focus:bg-white dark:focus:bg-gray-700 transition-colors cursor-pointer"
        >
            <option value="All">{label}: All</option>
            {options.filter(o => o !== 'All').map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default Dashboard;
