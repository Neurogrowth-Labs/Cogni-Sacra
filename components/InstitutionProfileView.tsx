import React, { useState } from 'react';
import { FullInstitutionData, CommunityPost } from '../types';
import PencilIcon from './icons/PencilIcon';
import MapPinIcon from './icons/MapPinIcon';
import LinkIcon from './icons/LinkIcon';
import PhoneIcon from './icons/PhoneIcon';
import LifebuoyIcon from './icons/LifebuoyIcon';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import StarIcon from './icons/StarIcon';
import ClockIcon from './icons/ClockIcon';

interface InstitutionProfileViewProps {
    institutionData: FullInstitutionData;
    onNavigate: (view: 'institution-profile-editing') => void;
}

const CatalogTabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`py-3 px-4 border-b-2 font-semibold transition-colors text-sm ${
            isActive
                ? 'border-crimson text-crimson dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);


const InstitutionProfileView: React.FC<InstitutionProfileViewProps> = ({ institutionData, onNavigate }) => {
    const { name, profile, branding, programs, courses, communityPosts: initialCommunityPosts } = institutionData;
    const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'archived'>('active');
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunityPosts);
    const [newPostContent, setNewPostContent] = useState('');

    const filteredCourses = courses.filter(c => c.status === activeTab);
    
    const handleAddPost = () => {
        if (newPostContent.trim() === '') return;
        const newPost: CommunityPost = {
            id: `post-${Date.now()}`,
            author: 'Alex Turner (You)',
            avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
            timestamp: 'Just now',
            content: newPostContent,
            likes: 0,
            comments: 0,
        };
        setCommunityPosts([newPost, ...communityPosts]);
        setNewPostContent('');
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto space-y-8">
            {/* Header with Banner */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg relative">
                <img src={profile.bannerUrl} alt={`${name} banner`} className="w-full h-48 md:h-64 object-cover rounded-t-2xl" />
                <div className="absolute top-4 right-4">
                    <button onClick={() => onNavigate('institution-profile-editing')} className="flex items-center px-3 py-1.5 text-sm font-medium bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-900">
                        <PencilIcon className="w-4 h-4 mr-2" /> Edit Profile
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 space-y-4 sm:space-y-0 sm:space-x-6">
                        <img src={branding.logoUrl} alt={`${name} logo`} className="w-32 h-32 p-1 rounded-full object-contain bg-white dark:bg-gray-800 ring-4 ring-white dark:ring-gray-800" />
                        <div className="flex-grow text-center sm:text-left">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">{name}</h1>
                            <p className="text-md text-gray-500 dark:text-gray-400">{profile.tagline}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">About {name}</h2>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{profile.about}</p>
                    </div>

                    {/* Video Introduction */}
                    {profile.videoIntroductionUrl && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">A Glimpse into Our World</h2>
                            <div className="aspect-video">
                                <iframe 
                                    src={profile.videoIntroductionUrl} 
                                    title="Institution Introduction" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="w-full h-full rounded-lg"
                                ></iframe>
                            </div>
                        </div>
                    )}
                    
                    {/* Testimonials */}
                    {profile.testimonials && profile.testimonials.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">What Our Learners Say</h2>
                            <div className="space-y-6">
                                {profile.testimonials.map(t => (
                                    <div key={t.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            {t.rating && [...Array(5)].map((_, i) => (
                                               <StarIcon key={i} className={`w-5 h-5 ${i < t.rating! ? 'text-amber-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 italic">"{t.quote}"</p>
                                        <div className="flex items-center mt-3">
                                            <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                                            <p className="ml-3 font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Mentorship & Office Hours */}
                    {profile.mentorshipProgram && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">Mentorship & Office Hours</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{profile.mentorshipProgram.description}</p>
                            <div className="space-y-3">
                                {profile.mentorshipProgram.officeHours.map(oh => (
                                    <div key={oh.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <ClockIcon className="w-5 h-5 mr-3 text-crimson" />
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{oh.day}, {oh.time}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{oh.facultyName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Community Forum */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                         <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">Community Forum</h2>
                         <div className="space-y-4">
                             {/* Post Composer */}
                             <div>
                                <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Ask a question or share an update..."
                                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                    rows={3}
                                ></textarea>
                                <div className="flex justify-end mt-2">
                                    <button onClick={handleAddPost} className="px-5 py-2 text-sm font-semibold text-white bg-crimson rounded-full hover:bg-red-800">Post</button>
                                </div>
                             </div>
                             {/* Posts */}
                             {communityPosts.map(post => (
                                <div key={post.id} className="flex items-start space-x-3 p-3 border-t dark:border-gray-700">
                                    <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <div className="flex items-baseline space-x-2">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{post.author}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{post.content}</p>
                                    </div>
                                </div>
                             ))}
                         </div>
                    </div>

                     {/* Programs & Degrees Section */}
                    {programs && programs.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">Programs & Degrees</h2>
                            <div className="space-y-4">
                                {programs.map(program => (
                                    <div key={program.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                                        <p className="font-semibold text-crimson dark:text-red-400">{program.type}</p>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{program.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{program.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <div className="sticky top-8 space-y-8">
                        {/* Contact Info */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">Contact & Support</h3>
                            <div className="space-y-3">
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    <LinkIcon className="w-5 h-5 mr-3 text-gray-400"/> {profile.website}
                                </a>
                                <div className="flex items-center text-sm">
                                    <PhoneIcon className="w-5 h-5 mr-3 text-gray-400"/> <a href={`tel:${profile.contact.phone}`} className="text-gray-700 dark:text-gray-300">{profile.contact.phone}</a>
                                </div>
                                {profile.supportLinks?.faq && (
                                    <a href={profile.supportLinks.faq} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        <QuestionMarkCircleIcon className="w-5 h-5 mr-3 text-gray-400"/> FAQ
                                    </a>
                                )}
                                {profile.supportLinks?.helpDesk && (
                                    <a href={profile.supportLinks.helpDesk} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        <LifebuoyIcon className="w-5 h-5 mr-3 text-gray-400"/> Help Desk
                                    </a>
                                )}
                                {profile.supportLinks?.applicationPortal && (
                                    <a href={profile.supportLinks.applicationPortal} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        <ClipboardDocumentListIcon className="w-5 h-5 mr-3 text-gray-400"/> Application Portal
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Locations */}
                        {profile.locations && profile.locations.length > 0 && (
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 font-serif">Our Campuses</h3>
                                <div className="space-y-4">
                                    {profile.locations.map(loc => (
                                        <div key={loc.id}>
                                            <img src={loc.imageUrl} alt={loc.name} className="w-full h-24 object-cover rounded-lg"/>
                                            <div className="flex items-start mt-2">
                                                <MapPinIcon className="w-5 h-5 mr-2 mt-1 text-gray-400 flex-shrink-0"/>
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{loc.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{loc.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionProfileView;
