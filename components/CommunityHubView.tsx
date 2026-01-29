import React, { useState } from 'react';
import { communityPosts as initialCommunityPosts, mentors, clubs } from '../constants';
import { CommunityPost } from '../types';
import GlobeAltIcon from './icons/GlobeAltIcon';
import HeartIcon from './icons/HeartIcon';
import ChatBubbleOvalLeftIcon from './icons/ChatBubbleOvalLeftIcon';
import ArrowUpOnSquareIcon from './icons/ArrowUpOnSquareIcon';
import UserPlusIcon from './icons/UserPlusIcon';

type CommunityTab = 'feed' | 'mentorship' | 'clubs';

const PostCard: React.FC<{ post: typeof initialCommunityPosts[0] }> = ({ post }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <div className="flex items-start space-x-4">
            <img src={post.avatarUrl} alt={post.author} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <p className="font-bold text-gray-900 dark:text-white">{post.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
            </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-around">
            <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                <HeartIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">{post.likes}</span>
            </button>
             <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">{post.comments}</span>
            </button>
             <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                <ArrowUpOnSquareIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Share</span>
            </button>
        </div>
    </div>
);

const MentorCard: React.FC<{ mentor: typeof mentors[0] }> = ({ mentor }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg text-center flex flex-col items-center">
        <img src={mentor.avatarUrl} alt={mentor.name} className="w-24 h-24 rounded-full ring-4 ring-blue-500/50" />
        <h4 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{mentor.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.title}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
            {mentor.expertise.map(skill => (
                <span key={skill} className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/50 dark:text-blue-200">{skill}</span>
            ))}
        </div>
        <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Request Mentorship
        </button>
    </div>
);

const ClubCard: React.FC<{ club: typeof clubs[0] }> = ({ club }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
        <img className="h-32 w-full object-cover" src={club.imageUrl} alt={club.name} />
        <div className="p-4 flex flex-col flex-grow">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{club.name}</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex-grow">{club.description}</p>
            <div className="flex justify-between items-center mt-4">
                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{club.memberCount.toLocaleString()} members</p>
                 <button className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700">Join</button>
            </div>
        </div>
    </div>
);

const CommunityHubView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CommunityTab>('feed');
    const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts);
    const [newPostContent, setNewPostContent] = useState('');

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
        setPosts([newPost, ...posts]);
        setNewPostContent('');
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'feed':
                return (
                    <div className="md:col-span-2 space-y-6">
                        {/* Post Composer */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Share your thoughts or ask a question..."
                                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleAddPost}
                                    disabled={!newPostContent.trim()}
                                    className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                        {posts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                );
            case 'mentorship':
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI-Powered Mentor Matching</h2>
                        <p className="text-gray-600 dark:text-gray-400">Connect with experienced professionals who can guide you on your learning journey. Here are some recommendations based on your profile:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)}
                        </div>
                    </div>
                );
            case 'clubs':
                 return (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Discover Clubs & Groups</h2>
                                <p className="text-gray-600 dark:text-gray-400">Join communities based on your interests to learn and collaborate with peers.</p>
                            </div>
                            <button className="px-4 py-2 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700">
                                Create a Club
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clubs.map(club => <ClubCard key={club.id} club={club} />)}
                        </div>
                    </div>
                 );
        }
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-6">
                <GlobeAltIcon className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white ml-3">Community Hub</h1>
            </div>
            
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-6">
                    <TabButton isActive={activeTab === 'feed'} onClick={() => setActiveTab('feed')}>Social Feed</TabButton>
                    <TabButton isActive={activeTab === 'mentorship'} onClick={() => setActiveTab('mentorship')}>Mentorship</TabButton>
                    <TabButton isActive={activeTab === 'clubs'} onClick={() => setActiveTab('clubs')}>Clubs & Groups</TabButton>
                </nav>
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
};

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`py-3 px-1 border-b-2 font-semibold transition-colors ${
            isActive
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);

export default CommunityHubView;
