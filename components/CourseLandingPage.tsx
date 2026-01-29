import React, { useState, useMemo } from 'react';
import { Course, Lesson, Coupon } from '../types';
import AcademicCapIcon from './icons/AcademicCapIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import PlayIcon from './icons/PlayIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { getLessonIcon } from './utils/uiUtils';

interface CourseLandingPageProps {
    course: Course;
    onEnroll: (course: Course) => void;
    onBack: () => void;
}

const CourseLandingPage: React.FC<CourseLandingPageProps> = ({ course, onEnroll, onBack }) => {
    const [openModuleId, setOpenModuleId] = useState<string | null>(course.modules[0]?.id || null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

    const handleApplyCoupon = () => {
        const foundCoupon = course.coupons?.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
        if (foundCoupon) {
            setAppliedCoupon(foundCoupon);
        } else {
            alert('Invalid coupon code');
        }
    };

    const finalPrice = useMemo(() => {
        if (!course.price || !appliedCoupon) {
            return course.price;
        }
        if (appliedCoupon.type === 'percentage') {
            return course.price * (1 - appliedCoupon.discount / 100);
        }
        if (appliedCoupon.type === 'fixed') {
            return Math.max(0, course.price - appliedCoupon.discount);
        }
        return course.price;
    }, [course.price, appliedCoupon]);

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <button onClick={onBack} className="flex items-center text-crimson dark:text-crimson/90 hover:underline mb-6 font-semibold">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Explore
            </button>
            <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Hero */}
                    <div className="space-y-4">
                        <p className="text-crimson dark:text-crimson/90 font-semibold uppercase">{course.category}</p>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white font-serif">{course.title}</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">{course.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-gray-700 dark:text-gray-300">
                            <div className="flex items-center space-x-3">
                                <img src={course.instructorImage} alt={course.instructor} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold">{course.instructor}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                                </div>
                            </div>
                             <div className="flex items-center space-x-3">
                                <AcademicCapIcon className="w-12 h-12 p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" />
                                <div>
                                    <p className="font-semibold">{course.university}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Partner University</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What you'll learn */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-serif">What you'll learn</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {course.learningOutcomes?.map((outcome, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                     {/* Syllabus */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">Syllabus & Course Content</h2>
                        <div className="space-y-2">
                            {course.modules.map(module => {
                                const isOpen = openModuleId === module.id;
                                return (
                                    <div key={module.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <button 
                                            onClick={() => setOpenModuleId(isOpen ? null : module.id)}
                                            className="w-full flex justify-between items-center text-left p-4 font-bold text-lg text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="font-serif">{module.title}</span>
                                            <ChevronDownIcon className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {module.lessons.map(lesson => (
                                                    <li key={lesson.id} className="p-4 flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            {getLessonIcon(lesson.format, "w-5 h-5")}
                                                            <span className="text-gray-700 dark:text-gray-300">{lesson.title}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">{lesson.duration}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* Testimonials */}
                    {course.testimonials && course.testimonials.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">What Learners Are Saying</h2>
                            <div className="space-y-6">
                                {course.testimonials.map(t => (
                                <div key={t.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-400 italic">"{t.quote}"</p>
                                    <div className="flex items-center mt-4">
                                        <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                                        <p className="ml-3 font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Sticky Card) */}
                <div className="mt-8 lg:mt-0">
                    <div className="sticky top-8 space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <button className="bg-black aspect-video flex items-center justify-center cursor-pointer group w-full" aria-label="Play course trailer">
                                <PlayIcon className="w-16 h-16 text-white/70 group-hover:text-white transition-colors" />
                            </button>
                            <div className="p-6">
                                <div className="flex items-baseline gap-2">
                                    <p className={`text-4xl font-extrabold text-gray-900 dark:text-white ${appliedCoupon ? 'text-green-600 dark:text-green-400' : ''}`}>
                                        {finalPrice === 0 ? 'Free' : `$${finalPrice?.toFixed(2)}`}
                                    </p>
                                    {appliedCoupon && course.price && (
                                        <p className="text-xl font-medium text-gray-400 line-through">${course.price.toFixed(2)}</p>
                                    )}
                                </div>
                                <button onClick={() => onEnroll(course)} className="w-full mt-4 text-center py-3 px-4 bg-crimson text-white font-bold rounded-lg hover:bg-red-800 transition-transform hover:scale-105 shadow-lg">
                                    {course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                                </button>
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex gap-2">
                                        <label htmlFor="discount-code-input" className="sr-only">Discount Code</label>
                                        <input
                                            type="text"
                                            id="discount-code-input"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Discount Code"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <button onClick={handleApplyCoupon} className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Apply</button>
                                    </div>
                                    {appliedCoupon && (
                                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                            "{appliedCoupon.code}" applied! You saved {appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `$${appliedCoupon.discount}`}.
                                        </p>
                                    )}
                                </div>
                                 <div className="text-center mt-4">
                                     <a href="#" className="text-sm font-medium text-crimson dark:text-crimson/90 hover:underline">Financial Aid Available</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseLandingPage;