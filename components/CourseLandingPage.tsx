import React, { useState, useMemo } from 'react';
import { Course, Lesson, Coupon, UserProfile } from '../types';
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
    userProfile?: UserProfile;
}

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
};

const CourseLandingPage: React.FC<CourseLandingPageProps> = ({ course, onEnroll, onBack, userProfile }) => {
    const [openModuleId, setOpenModuleId] = useState<string | null>(course.modules[0]?.id || null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
    const [showFinancialAidModal, setShowFinancialAidModal] = useState(false);
    const [financialAidSubmitted, setFinancialAidSubmitted] = useState(false);
    const [financialAidReason, setFinancialAidReason] = useState('');

    const videoEmbedUrl = useMemo(() => {
        return getYouTubeEmbedUrl(course.videoTrailerUrl || (course as any).videoUrl);
    }, [course.videoTrailerUrl, (course as any).videoUrl]);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            alert('Please enter a coupon code (Opt/Required)');
            return;
        }
        const foundCoupon = course.coupons?.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
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
                        
                        {/* Labeled offering details info block */}
                        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex flex-wrap items-center gap-6 mt-4 text-gray-700 dark:text-gray-300">
                            {course.offeredBy === 'institution' ? (
                                <>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl p-2.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 shrink-0">🏢</div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{course.institutionName || course.university || 'CogniSacra Academy'}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Offering Institution</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{course.facultyName || 'Sovereign Academic Faculty'}</p>
                                        <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Faculty</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{course.campusName || 'Main Campus'}</p>
                                        <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Campus</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                                    <div>
                                        <span className="inline-block bg-rose-150 dark:bg-rose-950/40 text-rose-750 dark:text-rose-300 px-2 py-0.5 rounded font-bold text-xs uppercase tracking-wider border border-rose-200/50 dark:border-rose-900/50">
                                            {course.qualificationType || course.certificateType || 'Professional Certificate'}
                                        </span>
                                        <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold mt-0.5">Qualification Offered</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-3">
                                        {course.instructorImage ? (
                                            <img src={course.instructorImage} alt={course.instructor} className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-indigo-500/30" />
                                        ) : (
                                            <div className="text-2xl p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 shrink-0">👨‍🏫</div>
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{course.instructor}</p>
                                            <p className="text-xs text-slate-400">Independent Instructor</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{course.instructorCredentials || 'Certified Professional Creator'}</p>
                                        <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Credentials</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">🌍 {course.instructorCountry || 'Sovereign Africa'}</p>
                                        <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Country</p>
                                    </div>
                                </>
                            )}
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
                            {isPlayingTrailer && videoEmbedUrl ? (
                                <div className="aspect-video bg-black overflow-hidden relative">
                                    <iframe 
                                        src={`${videoEmbedUrl}?autoplay=1`} 
                                        title={course.title} 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen 
                                        className="w-full h-full"
                                    ></iframe>
                                    <button 
                                        onClick={() => setIsPlayingTrailer(false)} 
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/90 text-xs font-bold"
                                    >
                                        Close [X]
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => {
                                        if (videoEmbedUrl) {
                                            setIsPlayingTrailer(true);
                                        } else {
                                            alert("No trailer URL available for this course. Click start learning to view lesson videos!");
                                        }
                                    }} 
                                    className="bg-black aspect-video flex flex-col items-center justify-center cursor-pointer group w-full relative overflow-hidden" 
                                    aria-label="Play course trailer"
                                >
                                    {course.imageUrl && (
                                        <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" />
                                    )}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <PlayIcon className="w-16 h-16 text-white/80 group-hover:text-white transition-colors drop-shadow-lg" />
                                        <span className="text-white text-xs font-bold uppercase tracking-wider mt-2 drop-shadow-md">Play Preview Video</span>
                                    </div>
                                </button>
                            )}
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
                                        <label htmlFor="discount-code-input" className="sr-only">Discount Code (Optional)</label>
                                        <input
                                            type="text"
                                            id="discount-code-input"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Discount Code (Optional)"
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
                                
                                <div className="text-center mt-4 pt-2 border-t border-dashed border-gray-100 dark:border-gray-700">
                                    {userProfile?.academicInstitution ? (
                                        <button 
                                            onClick={() => {
                                                setFinancialAidSubmitted(false);
                                                setShowFinancialAidModal(true);
                                            }}
                                            className="text-sm font-semibold text-crimson dark:text-crimson/95 hover:underline flex items-center justify-center mx-auto gap-1"
                                        >
                                            <AcademicCapIcon className="w-4 h-4" />
                                            Financial Aid Available via {userProfile.academicInstitution}
                                        </button>
                                    ) : (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 p-2.5 bg-gray-100 dark:bg-gray-900/60 rounded-lg">
                                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Financial Aid Unavailable</p>
                                            <span>Only available to students enrolled under an Academic Institution. (Edit your profile details to unlock)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Aid Modal */}
            {showFinancialAidModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-fade-in border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <AcademicCapIcon className="w-6 h-6 text-crimson" />
                                Request Financial Aid
                            </h3>
                            <button 
                                onClick={() => setShowFinancialAidModal(false)}
                                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {financialAidSubmitted ? (
                            <div className="py-6 text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Application Received</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Your request for financial aid for <strong>{course.title}</strong> has been successfully submitted to the office of Student Affairs at <strong>{userProfile?.academicInstitution}</strong>.
                                </p>
                                <p className="text-xs text-gray-400">We will notify you on Alex Turner's email once reviewed.</p>
                                <button 
                                    onClick={() => setShowFinancialAidModal(false)}
                                    className="px-6 py-2 bg-crimson text-white rounded-lg font-semibold hover:bg-red-800"
                                >
                                    Fabulous!
                                </button>
                            </div>
                        ) : (
                            <div className="py-4 space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Target Course</p>
                                    <p className="text-md font-bold text-gray-900 dark:text-white">{course.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Affiliated Institution</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{userProfile?.academicInstitution}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Requester Profile</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{userProfile?.name}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase">Support Percentage Requested</label>
                                    <div className="flex gap-4">
                                        {['50% Scholarship', '75% Scholarship', '100% Full Aid'].map(p => (
                                            <label key={p} className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">
                                                <input type="radio" name="aid-percentage" value={p} defaultChecked={p.includes('100%')} />
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">{p}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="aid-reason" className="block text-xs font-bold text-gray-400 tracking-wider uppercase">Motivation Statement (Explain briefly your need for financial aid)</label>
                                    <textarea 
                                        id="aid-reason"
                                        rows={3} 
                                        value={financialAidReason}
                                        onChange={(e) => setFinancialAidReason(e.target.value)}
                                        placeholder="I am enrolled full-time and believe this certificate will advance my career goals."
                                        className="w-full p-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900" 
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button 
                                        onClick={() => setShowFinancialAidModal(false)}
                                        className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setFinancialAidSubmitted(true);
                                        }}
                                        className="px-5 py-2 text-sm font-bold text-white bg-crimson rounded-lg hover:bg-red-800 shadow-md"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseLandingPage;