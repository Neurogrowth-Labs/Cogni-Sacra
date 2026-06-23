import React, { useState, useMemo } from 'react';
import { 
    Home, Users, MessageSquare, Compass, Award, HelpCircle, Heart, Star, 
    Shield, Flame, BookOpen, Share2, Search, Plus, ThumbsUp, Calendar, 
    Send, Activity, Settings, Filter, Smile, Sparkles, Trophy, Globe, 
    UserPlus, Info, Check, MessageCircle, BarChart2, ChevronRight, 
    CheckCircle, Cloud, BookOpen as BookMarked, Download, FileText, User
} from 'lucide-react';

type SubView = 
    | 'home' 
    | 'communities' 
    | 'forums' 
    | 'circles' 
    | 'mentorship' 
    | 'events' 
    | 'challenges' 
    | 'prayer' 
    | 'knowledge' 
    | 'networking' 
    | 'leaderboards' 
    | 'recognition' 
    | 'ai-guide' 
    | 'analytics';

// ---------------------- TYPES & INTERFACES ----------------------
interface Post {
    id: string;
    author: string;
    avatarUrl: string;
    role: string;
    timestamp: string;
    content: string;
    likes: number;
    hasLiked?: boolean;
    comments: string[];
    showCommentBox?: boolean;
    type?: 'general' | 'testimony' | 'prayer' | 'resource';
}

interface Community {
    id: string;
    name: string;
    category: 'Faith & Spiritual Growth' | 'Academic Learning' | 'Professional Networks' | 'Other';
    membersCount: number;
    discussionsCount: number;
    description: string;
    isJoined: boolean;
    imageUrl: string;
}

interface ForumThread {
    id: string;
    title: string;
    category: string;
    author: string;
    avatarUrl: string;
    repliesCount: number;
    views: number;
    pinned?: boolean;
    content: string;
    replies: { author: string; content: string; date: string; bestAnswer?: boolean }[];
    isExpanded?: boolean;
}

interface StudyCircle {
    id: string;
    name: string;
    description: string;
    goals: string;
    privacy: 'Public' | 'Private';
    members: string[];
    notes: string;
    tasks: { id: string; text: string; done: boolean }[];
    chatMessages: { sender: string; text: string; time: string }[];
}

interface Mentor {
    id: string;
    name: string;
    title: string;
    organization: string;
    expertise: string[];
    avatarUrl: string;
    rating: number;
    reviews: number;
}

interface PrayerRequest {
    id: string;
    title: string;
    author: string;
    content: string;
    prayersCount: number;
    hasPrayed?: boolean;
    spiritSupport: number;
}

interface WebinarEvent {
    id: string;
    title: string;
    speaker: string;
    date: string;
    category: 'Webinar' | 'Workshop' | 'Prayer Session' | 'Masterclass';
    description: string;
    isRegistered: boolean;
    avatarUrl: string;
}

interface ResourceItem {
    id: string;
    title: string;
    author: string;
    category: string;
    downloads: number;
    hasSaved?: boolean;
}

// ---------------------- MAIN HUB COMPONENT ----------------------
const CommunityHubView: React.FC = () => {
    const [currentView, setCurrentView] = useState<SubView>('home');
    const [searchQuery, setSearchQuery] = useState('');

    // --- 1. USER STATS FOR ACCREDITED ENGAGEMENT ---
    const [userPoints, setUserPoints] = useState(380);
    const [userLevel, setUserLevel] = useState(3); // Level 3: Collaborator
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['Community Builder', 'Prayer Warrior']);

    // --- 2. SOCIAL FEED STATES ---
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 'p1',
            author: 'Jane Doe',
            role: 'Lead Instructor',
            avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
            timestamp: '2 hours ago',
            content: 'Just published a new guide on implementing advanced useMemo structures inside your applications. How is everyone applying state selectors this week?',
            likes: 42,
            comments: ["Applying it on my final project and it made a huge difference!", "Excellent guide, Jane!"],
            type: 'resource'
        },
        {
            id: 'p2',
            author: 'Michael Lawson',
            role: 'Kingdom Entrepreneur',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            timestamp: '5 hours ago',
            content: 'Gratitude Post: Launched my theological resource startup today! The mentorship here has given me the spiritual and business backing I needed to scale ethically.',
            likes: 128,
            comments: ["Amen! Wish you the best brother.", "Huge milestone!"],
            type: 'testimony'
        }
    ]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostType, setNewPostType] = useState<'general' | 'testimony' | 'prayer' | 'resource'>('general');
    const [newPostComment, setNewPostComment] = useState<{ [postId: string]: string }>({});

    // --- 3. COMMUNITIES SEARCH & CATEGORIES ---
    const [communities, setCommunities] = useState<Community[]>([
        {
            id: 'c1',
            name: 'Kingdom Entrepreneurship Lounge',
            category: 'Professional Networks',
            membersCount: 15200,
            discussionsCount: 120,
            description: 'Building ethical Kingdom-minded startups and corporations through shared resource masterclasses and mentorship.',
            isJoined: true,
            imageUrl: 'https://picsum.photos/seed/biz/600/400'
        },
        {
            id: 'c2',
            name: 'Bible Study & Reflections',
            category: 'Faith & Spiritual Growth',
            membersCount: 8400,
            discussionsCount: 95,
            description: 'Daily devotionals, structured biblical exploration, and collaborative scripture review cycles.',
            isJoined: false,
            imageUrl: 'https://picsum.photos/seed/bible/600/400'
        },
        {
            id: 'c3',
            name: 'Gen-AI Researchers & Innovators',
            category: 'Academic Learning',
            membersCount: 6200,
            discussionsCount: 88,
            description: 'Deep technical discussions surrounding model fine-tuning, retrieval techniques, and ethical AI integration.',
            isJoined: false,
            imageUrl: 'https://picsum.photos/seed/tech/600/400'
        },
        {
            id: 'c4',
            name: 'Sovereign Academics Networking',
            category: 'Academic Learning',
            membersCount: 3100,
            discussionsCount: 44,
            description: 'Collaborating on thesis validation, peer-review support, and research paper publication.',
            isJoined: true,
            imageUrl: 'https://picsum.photos/seed/academy/600/400'
        }
    ]);
    const [selectedCommunityCat, setSelectedCommunityCat] = useState<'All' | 'Faith & Spiritual Growth' | 'Academic Learning' | 'Professional Networks'>('All');

    // --- 4. EXPLICIT DISCUSSION FORUMS ---
    const [forums, setForums] = useState<ForumThread[]>([
        {
            id: 'f1',
            title: 'Is traditional relational DB better suited for enterprise Kingdom SaaS projects?',
            category: 'Questions & Answers',
            author: 'David Vance',
            avatarUrl: 'https://i.pravatar.cc/150?u=david',
            repliesCount: 3,
            views: 240,
            pinned: true,
            content: 'We are deciding whether to choose Postgres (Cloud SQL) or Firestore for a large platform. Looking for architectural tradeoffs concerning transaction safety.',
            replies: [
                { author: 'Emily White', content: 'For nested real-time chats, Firestore is amazing, but schema consistency and reporting metrics definitely favor relational databases.', date: '3 hours ago', bestAnswer: true },
                { author: 'Jane Doe', content: 'Yes! If you require complex SQL aggregations, use PostgreSQL.', date: '1 hour ago' }
            ]
        },
        {
            id: 'f2',
            title: 'Course Discussion: Section 5 of Advanced React Hooks',
            category: 'Course Discussions',
            author: 'Sarah Jenkins',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
            repliesCount: 1,
            views: 110,
            content: 'I got stuck on custom reducer dependencies. Does anyone have a clean refactoring example?',
            replies: [
                { author: 'Alex Turner (You)', content: 'Try moving the state updater function outside of the component or tracking dispatch.', date: '30 min ago' }
            ]
        }
    ]);
    const [newForumTitle, setNewForumTitle] = useState('');
    const [newForumCategory, setNewForumCategory] = useState('Questions & Answers');
    const [newForumContent, setNewForumContent] = useState('');
    const [newForumReply, setNewForumReply] = useState<{ [threadId: string]: string }>({});

    // --- 5. STUDY CIRCLES STATE ---
    const [studyCircles, setStudyCircles] = useState<StudyCircle[]>([
        {
            id: 'sc1',
            name: 'React Mastery Accountability Group',
            description: 'A 4-week intensive checking in daily to finish courses, review homework, and clear obstacles.',
            goals: 'Finish React + TypeScript Curriculum with 100% homework submission.',
            privacy: 'Public',
            members: ['Alex Turner', 'Sarah Jenkins', 'Esther K.'],
            notes: 'Current study notes: Focused heavily on layout animations and responsive canvas styling during week 2.',
            tasks: [
                { id: 't1', text: 'Complete React Profiler Lesson', done: true },
                { id: 't2', text: 'Submit Midterm Prototype', done: false },
                { id: 't3', text: 'Review peer project submission', done: false }
            ],
            chatMessages: [
                { sender: 'Sarah Jenkins', text: 'Hey guys! Just completed the rendering optimization assignment.', time: '12:30 PM' },
                { sender: 'Esther K.', text: 'Awesome! Let’s hop on an audio sync tomorrow!', time: '12:45 PM' }
            ]
        }
    ]);
    const [activeCircleId, setActiveCircleId] = useState<string | null>('sc1');
    const [newCircleName, setNewCircleName] = useState('');
    const [newCircleDesc, setNewCircleDesc] = useState('');
    const [newCircleGoals, setNewCircleGoals] = useState('');
    const [newCirclePrivacy, setNewCirclePrivacy] = useState<'Public' | 'Private'>('Public');
    const [showCreateCircleForm, setShowCreateCircleForm] = useState(false);
    const [circleChatMessage, setCircleChatMessage] = useState('');

    // --- 6. MENTORSHIP MARKETPLACE ---
    const [mentorsInfo] = useState<Mentor[]>([
        {
            id: 'm1',
            name: 'Dr. Evelyn Reed',
            title: 'Theologian & Strategic Business Advisor',
            organization: 'CogniSacra Academy',
            expertise: ['Kingdom Entrepreneurship', 'Sovereign Leadership', 'Ethics'],
            avatarUrl: 'https://i.pravatar.cc/150?u=evelyn',
            rating: 4.9,
            reviews: 142
        },
        {
            id: 'm2',
            name: 'John Smith',
            title: 'Principal UX/UI Designer',
            organization: 'Creative AI Studios',
            expertise: ['Figma', 'Generative Design Systems', 'Visual Craft'],
            avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith',
            rating: 4.8,
            reviews: 98
        },
        {
            id: 'm3',
            name: 'Emily White',
            title: 'Lead Quantitative Analyst',
            organization: 'DataDriven Corp',
            expertise: ['Python', 'Large Language Models', 'Data Architectures'],
            avatarUrl: 'https://i.pravatar.cc/150?u=emilywhite',
            rating: 5.0,
            reviews: 164
        }
    ]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [bookingRequested, setBookingRequested] = useState(false);
    const [bookingTopic, setBookingTopic] = useState('Career Roadmap & Kingdom Alignment');
    const [bookingDay, setBookingDay] = useState('2026-06-25');
    const [scheduledSessions, setScheduledSessions] = useState<{ id: string; mentorName: string; topic: string; date: string; time: string }[]>([
        { id: 's1', mentorName: 'Dr. Evelyn Reed', topic: 'Kingdom Alignment in Business Startup', date: '2026-06-23', time: '14:00' }
    ]);

    // --- 7. PRAYER ROOM ---
    const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([
        { id: 'pr1', title: 'Wisdom for Devs working on Community Impact Apps', author: 'Brother David', content: 'Please uplift our engineering circles as we design digital platforms. Let us prioritize human dignity and sacred study methods.', prayersCount: 28, spiritSupport: 12 },
        { id: 'pr2', title: 'Strengthening Theological Researchers', author: 'Esther Vance', content: 'Seeking prayer for guidance on translating rare manuscript references into the institutional digital library catalog.', prayersCount: 15, spiritSupport: 5 }
    ]);
    const [newPrayerTitle, setNewPrayerTitle] = useState('');
    const [newPrayerBody, setNewPrayerBody] = useState('');
    const [gratitudeNotes, setGratitudeNotes] = useState<string[]>([
        "Grateful for finding a study buddy who values both state hooks and prayer!",
        "Completed my AWS certificate. Praise God!"
    ]);
    const [newGratitudeText, setNewGratitudeText] = useState('');

    // --- 8. EVENTS & WEBINARS ---
    const [events, setEvents] = useState<WebinarEvent[]>([
        {
            id: 'ev1',
            title: 'Artificial Intelligence & Kingdom Wisdom Mini-Conference',
            speaker: 'Dr. Evelyn Reed & Emily White',
            date: '2026-06-22T17:00:00.000Z',
            category: 'Webinar',
            description: 'Exploring neural network alignment through the lens of ethical wisdom frameworks, deep reflection techniques, and practical data science.',
            isRegistered: false,
            avatarUrl: 'https://i.pravatar.cc/150?u=evelyn'
        },
        {
            id: 'ev2',
            title: 'Sovereign Designing with Figma: High-Fidelity Interactive Layouts',
            speaker: 'John Smith',
            date: '2026-06-24T15:00:00.000Z',
            category: 'Masterclass',
            description: 'Intense masterclass targeting typography systems, rhythmic space variations, component variables, and grid logic.',
            isRegistered: true,
            avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith'
        }
    ]);

    // --- 9. KNOWLEDGE EXCHANGE FILES ---
    const [resources, setResources] = useState<ResourceItem[]>([
        { id: 'r1', title: 'Kingdom Startup Pitch-Deck Template v2', author: 'Dr. Evelyn Reed', category: 'Templates', downloads: 356 },
        { id: 'r2', title: 'React Performance Audit Checksheet & Core Metrics', author: 'Jane Doe', category: 'Articles', downloads: 820 },
        { id: 'r3', title: 'Theological Digitalization Ethics Proposal Paper', author: 'Brother David', category: 'Research Papers', downloads: 145 }
    ]);
    const [uploadedResourceTitle, setUploadedResourceTitle] = useState('');
    const [uploadedResourceCat, setUploadedResourceCat] = useState('Templates');

    // --- 10. CONNECTIONS & loungers ---
    const [loungers, setLoungers] = useState<{ id: string; name: string; title: string; country: string; mutualG: number; isConnected: boolean }[]>([
        { id: 'l1', name: 'Alena K.', title: 'UX Designer - Cape Town, South Africa', country: 'South Africa', mutualG: 5, isConnected: false },
        { id: 'l2', name: 'Ephraim J.', title: 'Theological Scholar - Nairobi, Kenya', country: 'Kenya', mutualG: 2, isConnected: true },
        { id: 'l3', name: 'Jonathan Wade', title: 'Software Architect - Lagos, Nigeria', country: 'Nigeria', mutualG: 8, isConnected: false }
    ]);

    // --- 11. AI SPIRITUAL GUIDE MESSAGE AGENT ---
    const [aiGuideInput, setAiGuideInput] = useState('');
    const [aiGuideLog, setAiGuideLog] = useState<{ sender: 'user' | 'assistant'; text: string; time: string }[]>([
        { sender: 'assistant', text: 'Grace and Peace, Alex! I am your CogniSacra AI Guide. I can summarize thread posts, recommend study circles, search theological archives, or offer alignment encouragement. Ask me anything.', time: '14:02' }
    ]);

    // ---------------------- LOGICAL ENGAGEMENT ACTIONS ----------------------
    const addPoints = (amount: number, badgeName?: string) => {
        setUserPoints(prev => {
            const next = prev + amount;
            // Level tier calculation placeholder
            if (next >= 500 && userLevel < 4) {
                setUserLevel(4); // Upgraded!
            }
            return next;
        });
        if (badgeName && !unlockedBadges.includes(badgeName)) {
            setUnlockedBadges([...unlockedBadges, badgeName]);
        }
    };

    // Social post handlers
    const createSocialPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;
        const fresh: Post = {
            id: `post-${Date.now()}`,
            author: 'Alex Turner (You)',
            role: 'Lead Developer',
            avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
            timestamp: 'Just now',
            content: newPostContent,
            likes: 0,
            comments: [],
            type: newPostType
        };
        setPosts([fresh, ...posts]);
        setNewPostContent('');
        addPoints(15);
    };

    const toggleLikePost = (postId: string) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const liked = !p.hasLiked;
                return {
                    ...p,
                    hasLiked: liked,
                    likes: liked ? p.likes + 1 : p.likes - 1
                };
            }
            return p;
        }));
    };

    const addPostComment = (postId: string, commentText: string) => {
        if (!commentText.trim()) return;
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    comments: [...p.comments, commentText]
                };
            }
            return p;
        }));
        setNewPostComment({ ...newPostComment, [postId]: '' });
        addPoints(5);
    };

    // Discussion boards handlers
    const createForumThread = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newForumTitle.trim() || !newForumContent.trim()) return;
        const fresh: ForumThread = {
            id: `f-${Date.now()}`,
            title: newForumTitle,
            category: newForumCategory,
            author: 'Alex Turner (You)',
            avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
            repliesCount: 0,
            views: 4,
            content: newForumContent,
            replies: []
        };
        setForums([fresh, ...forums]);
        setNewForumTitle('');
        setNewForumContent('');
        addPoints(25);
    };

    const addForumReply = (threadId: string) => {
        const text = newForumReply[threadId];
        if (!text || !text.trim()) return;
        setForums(forums.map(f => {
            if (f.id === threadId) {
                return {
                    ...f,
                    repliesCount: f.repliesCount + 1,
                    replies: [...f.replies, { author: 'Alex Turner (You)', content: text, date: 'Just now' }]
                };
            }
            return f;
        }));
        setNewForumReply({ ...newForumReply, [threadId]: '' });
        addPoints(10);
    };

    // Study circle handlers
    const createStudyCircle = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCircleName.trim()) return;
        const fresh: StudyCircle = {
            id: `sc-${Date.now()}`,
            name: newCircleName,
            description: newCircleDesc,
            goals: newCircleGoals,
            privacy: newCirclePrivacy,
            members: ['Alex Turner (You)'],
            notes: 'Notes starting area. Write important references here!',
            tasks: [
                { id: `t-${Date.now()}-1`, text: 'Add milestone checkpoint', done: false },
                { id: `t-${Date.now()}-2`, text: 'Schedule study room meeting', done: false }
            ],
            chatMessages: [
                { sender: 'AI Guide Support', text: 'Welcome to your brand-new, accountability-backed study circle!', time: 'Now' }
            ]
        };
        setStudyCircles([...studyCircles, fresh]);
        setActiveCircleId(fresh.id);
        setNewCircleName('');
        setNewCircleDesc('');
        setNewCircleGoals('');
        setShowCreateCircleForm(false);
        addPoints(35, 'Community Builder');
    };

    const toggleCircleTask = (circleId: string, taskId: string) => {
        setStudyCircles(studyCircles.map(sc => {
            if (sc.id === circleId) {
                return {
                    ...sc,
                    tasks: sc.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
                };
            }
            return sc;
        }));
        addPoints(2);
    };

    const appendCircleNotes = (circleId: string, updatedNotes: string) => {
        setStudyCircles(studyCircles.map(sc => {
            if (sc.id === circleId) {
                return { ...sc, notes: updatedNotes };
            }
            return sc;
        }));
    };

    const sendCircleMessage = (circleId: string) => {
        if (!circleChatMessage.trim()) return;
        setStudyCircles(studyCircles.map(sc => {
            if (sc.id === circleId) {
                return {
                    ...sc,
                    chatMessages: [...sc.chatMessages, { sender: 'Alex Turner (You)', text: circleChatMessage, time: 'Now' }]
                };
            }
            return sc;
        }));
        setCircleChatMessage('');
        addPoints(2);
    };

    // Mentorship Actions
    const bookMentorSession = () => {
        if (!selectedMentor) return;
        const freshSession = {
            id: `s-${Date.now()}`,
            mentorName: selectedMentor.name,
            topic: bookingTopic,
            date: bookingDay,
            time: '11:00'
        };
        setScheduledSessions([...scheduledSessions, freshSession]);
        setBookingRequested(true);
        setTimeout(() => {
            setBookingRequested(false);
            setSelectedMentor(null);
        }, 3000);
        addPoints(20);
    };

    // Prayer room actions
    const sendPrayerRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPrayerTitle.trim() || !newPrayerBody.trim()) return;
        const fresh: PrayerRequest = {
            id: `pr-${Date.now()}`,
            title: newPrayerTitle,
            author: 'Alex Turner (You)',
            content: newPrayerBody,
            prayersCount: 1,
            spiritSupport: 0
        };
        setPrayerRequests([fresh, ...prayerRequests]);
        setNewPrayerTitle('');
        setNewPrayerBody('');
        addPoints(15, 'Prayer Warrior');
    };

    const supportPrayer = (id: string) => {
        setPrayerRequests(prayerRequests.map(pr => {
            if (pr.id === id) {
                const already = pr.hasPrayed;
                return {
                    ...pr,
                    hasPrayed: !already,
                    prayersCount: already ? pr.prayersCount - 1 : pr.prayersCount + 1,
                    spiritSupport: already ? pr.spiritSupport - 1 : pr.spiritSupport + 1
                };
            }
            return pr;
        }));
        addPoints(3);
    };

    const submitGratitude = () => {
        if (!newGratitudeText.trim()) return;
        setGratitudeNotes([newGratitudeText, ...gratitudeNotes]);
        setNewGratitudeText('');
        addPoints(5);
    };

    // Event registrations
    const toggleRegisterEvent = (id: string) => {
        setEvents(events.map(ev => {
            if (ev.id === id) {
                const changed = !ev.isRegistered;
                if (changed) addPoints(10);
                return { ...ev, isRegistered: changed };
            }
            return ev;
        }));
    };

    const submitResource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedResourceTitle.trim()) return;
        const fresh: ResourceItem = {
            id: `r-${Date.now()}`,
            title: uploadedResourceTitle,
            author: 'Alex Turner (You)',
            category: uploadedResourceCat,
            downloads: 0
        };
        setResources([fresh, ...resources]);
        setUploadedResourceTitle('');
        addPoints(25);
    };

    // Networking
    const toggleConnectLounger = (id: string) => {
        setLoungers(loungers.map(l => {
            if (l.id === id) {
                const val = !l.isConnected;
                if (val) addPoints(5);
                return { ...l, isConnected: val };
            }
            return l;
        }));
    };

    // AI guide conversation trigger
    const queryAiGuide = () => {
        if (!aiGuideInput.trim()) return;
        const userMsg = { sender: 'user' as const, text: aiGuideInput, time: 'Now' };
        setAiGuideLog(prev => [...prev, userMsg]);
        const q = aiGuideInput.toLowerCase();
        setAiGuideInput('');

        setTimeout(() => {
            let replyText = "I have scanned the CogniSacra Knowledge Base and Theology archives. For complex questions, I recommend booking with Dr. Evelyn Reed, or joining the Bible Study reflections community circles.";
            if (q.includes('react') || q.includes('hook') || q.includes('web')) {
                replyText = "Excellent technical search. Jane Doe is currently our top Mentor in frontend architecture. There is also an active Study Circle named 'React Mastery Accountability Group' that you are joined in! Head to the Study Circles tab to share project hurdles.";
            } else if (q.includes('prayer') || q.includes('holy') || q.includes('faith') || q.includes('devotional')) {
                replyText = "Faith & Reflections are the spiritual core of our community. In the 'Prayer & Reflection Room' page, you can access daily scripture devotionals, support peer prayers, or add to our collective Gratitude Wall.";
            } else if (q.includes('point') || q.includes('level') || q.includes('badge')) {
                replyText = "Your Kingdom Impact level depends on both technical excellence and active mentorship or prayer support. You have unlocked 'Community Builder' and 'Prayer Warrior'. Contributing files to the Knowledge Exchange tab yields a high volume of points (25 pts!).";
            }
            setAiGuideLog(prev => [...prev, { sender: 'assistant', text: replyText, time: 'Now' }]);
            addPoints(2);
        }, 1000);
    };

    // Filtered data computing
    const filteredCommunities = useMemo(() => {
        return communities.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
            if (selectedCommunityCat === 'All') return matchesSearch;
            return c.category === selectedCommunityCat && matchesSearch;
        });
    }, [communities, selectedCommunityCat, searchQuery]);

    const activeCircle = useMemo(() => {
        return studyCircles.find(sc => sc.id === activeCircleId);
    }, [studyCircles, activeCircleId]);

    // ---------------------- MENU NAVIGATION LIST ----------------------
    const menuItems = [
        { id: 'home', label: 'Home Feed', icon: Home, count: null },
        { id: 'communities', label: 'Browse Communities', icon: Compass, count: null },
        { id: 'forums', label: 'Discussion Forums', icon: MessageSquare, count: 5 },
        { id: 'circles', label: 'Study Circles', icon: CheckCircle, count: 'Active' },
        { id: 'mentorship', label: 'Mentorship Hub', icon: UserPlus, count: null },
        { id: 'events', label: 'Events & Webinars', icon: Calendar, count: 1 },
        { id: 'challenges', label: 'Challenges & Gamification', icon: Trophy, count: null },
        { id: 'prayer', label: 'Prayer & Reflection Room', icon: Heart, count: prayerRequests.length },
        { id: 'knowledge', label: 'Knowledge Exchange', icon: BookOpen, count: null },
        { id: 'networking', label: 'Networking Lounge', icon: Users, count: null },
        { id: 'leaderboards', label: 'Leaderboards', icon: Flame, count: null },
        { id: 'recognition', label: 'Recognition Wall', icon: Award, count: null },
        { id: 'ai-guide', label: 'AI Spiritual Companion', icon: Sparkles, count: 'Guide' },
        { id: 'analytics', label: 'Contribution Analytics', icon: BarChart2, count: null }
    ];

    return (
        <div className="max-w-7xl mx-auto py-4 px-2 sm:px-6 lg:px-8 mt-1 text-slate-800 dark:text-slate-100">
            {/* Top Hub Header Banner */}
            <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 p-6 shadow-xl border border-rose-900/40 select-none">
                <div className="absolute top-0 right-0 w-80 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-rose-500 to-slate-900 blur-2xl pointer-none"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center space-x-3.5">
                        <div className="p-3 bg-crimson/25 rounded-xl border border-rose-500/20 shadow-inner">
                            <Globe className="w-8 h-8 text-rose-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white flex items-center gap-2">
                                CogniSacra Community Hub
                            </h1>
                            <p className="text-xs text-rose-200/80 font-mono tracking-wide mt-0.5">
                                SECRETS OF DIGITAL & SPIRITUAL COLLABORATION • KINGDOM PERSPECTIVE
                            </p>
                        </div>
                    </div>
                    {/* Level Profile Badge in Header */}
                    <div className="flex items-center space-x-3 bg-black/40 px-4 py-2.5 rounded-full border border-white/10 shadow bg-opacity-95 text-xs text-slate-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center font-extrabold text-black font-mono ring-2 ring-white/10 text-xs">
                            L{userLevel}
                        </div>
                        <div>
                            <div className="font-extrabold text-white">Alex Turner (You)</div>
                            <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 shrink-0" />
                                {userPoints} Points • Collaborator
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Screen Community Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* ----------------- SECTOR A: COMMUNITY MENU SIDEBAR ----------------- */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow p-4 select-none">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3.5">
                        Menu Navigation
                    </h3>
                    <div className="space-y-1">
                        {menuItems.map(item => {
                            const IconC = item.icon;
                            const isSelected = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id as SubView)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all duration-150 ${
                                        isSelected 
                                        ? 'bg-crimson text-white font-bold shadow-md shadow-crimson/10 border-r-4 border-amber-300' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2.5">
                                        <IconC className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.count !== null && (
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                            isSelected 
                                            ? 'bg-white/20 text-white' 
                                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-thin border-rose-100/10'
                                        }`}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Gamification Box showing Points breakdown */}
                    <div className="mt-5 p-3.5 bg-gradient-to-br from-amber-500/10 to-rose-500/10 dark:from-amber-500/5 dark:to-rose-500/5 rounded-xl border border-rose-500/10 text-xs">
                        <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold mb-2">
                            <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-500" /> Milestone Check</span>
                            <span className="text-amber-500">{userPoints}/500</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full" style={{ width: `${(userPoints / 500) * 100}%` }}></div>
                        </div>
                        <div className="mt-2.5 text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
                            Unlock <span className="font-bold text-slate-700 dark:text-slate-200">Level 4: Leader</span> by contributing answers, files, or backing peer prayers (+120 Points Left).
                        </div>
                    </div>
                </div>

                {/* ----------------- SECTOR B: ACTIVE VIEW CONTENT ----------------- */}
                <div className="lg:col-span-3 space-y-6">

                    {/* 1. HOME SOCIAL FEED VIEW */}
                    {currentView === 'home' && (
                        <div className="space-y-6">
                            {/* Welcome interactive banner */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Good Morning, Lusimadio</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Continue your deep learning session today. Here is your community status report:</p>
                                    <div className="flex flex-wrap items-center gap-3.5 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                                        <span className="flex items-center gap-1.5"><span className="text-xs">✉</span> 2 New Accountability Messages</span>
                                        <span className="flex items-center gap-1.5"><span className="text-xs">💬</span> 5 Active Forum Conversations</span>
                                        <span className="flex items-center gap-1.5"><span className="text-xs">🎙</span> Webinar sessions in 3 Hours</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setCurrentView('forums')} className="px-3.5 py-1.5 text-xs font-bold text-white bg-crimson rounded-full hover:bg-red-800 shadow transition-all">Join Discussion</button>
                                    <button onClick={() => setCurrentView('circles')} className="px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-white bg-slate-200 dark:bg-gray-700 rounded-full hover:bg-slate-300 dark:hover:bg-gray-600 border border-slate-300/10">My Study Circle</button>
                                </div>
                            </div>

                            {/* Feed Composer Form */}
                            <form onSubmit={createSocialPost} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-slate-200/60 dark:border-slate-700/60">
                                <label htmlFor="social-input" className="sr-only">Post Content</label>
                                <textarea
                                    id="social-input"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your testimonies, questions, or template links here..."
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-crimson focus:border-crimson text-sm resize-none text-slate-800 dark:text-slate-200"
                                    rows={3}
                                />
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400 select-none">Tag post as:</span>
                                        {(['general', 'testimony', 'prayer', 'resource'] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewPostType(type)}
                                                className={`px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider border transition-all ${
                                                    newPostType === type
                                                    ? 'bg-crimson border-crimson text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newPostContent.trim()}
                                        className="w-full sm:w-auto px-5 py-2 font-bold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                    >
                                        <Send className="w-3.5 h-3.5" /> Publish
                                    </button>
                                </div>
                            </form>

                            {/* Feed log rendering */}
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <div key={post.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                        <div className="flex items-start space-x-3.5">
                                            <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full object-cover select-none border border-slate-200 dark:border-slate-700" />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-extrabold text-slate-900 dark:text-white font-serif text-sm">{post.author}</p>
                                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9.5px] font-bold text-slate-500 dark:text-slate-300 select-none">{post.role}</span>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{post.timestamp}</p>
                                                </div>
                                                {post.type && (
                                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-[9px] font-extrabold uppercase tracking-widest">{post.type}</span>
                                                )}
                                                <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                                                {/* Interaction Row */}
                                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-705 flex justify-around">
                                                    <button 
                                                        onClick={() => toggleLikePost(post.id)} 
                                                        className={`flex items-center space-x-2 text-xs font-semibold ${post.hasLiked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`}
                                                    >
                                                        <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                                                        <span>{post.likes}</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setPosts(posts.map(p => p.id === post.id ? { ...p, showCommentBox: !p.showCommentBox } : p));
                                                        }} 
                                                        className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-500"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        <span>{post.comments.length} Comments</span>
                                                    </button>
                                                    <button className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-500">
                                                        <Share2 className="w-4 h-4" />
                                                        <span>Share</span>
                                                    </button>
                                                </div>

                                                {/* Hidden or Opened Comment block */}
                                                {post.showCommentBox && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-705 space-y-2.5">
                                                        <div className="space-y-1.5">
                                                            {post.comments.map((comment, index) => (
                                                                <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl text-xs space-y-0.5">
                                                                    <div className="font-bold text-slate-800 dark:text-slate-200">Community Companion</div>
                                                                    <p className="text-slate-600 dark:text-slate-300">{comment}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Add your insightful reply..."
                                                                value={newPostComment[post.id] || ''}
                                                                onChange={(e) => setNewPostComment({ ...newPostComment, [post.id]: e.target.value })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') addPostComment(post.id, newPostComment[post.id]);
                                                                }}
                                                                className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                                                            />
                                                            <button 
                                                                onClick={() => addPostComment(post.id, newPostComment[post.id])} 
                                                                className="px-3 py-1 bg-crimson hover:bg-red-800 text-white rounded-xl text-xs font-bold"
                                                            >
                                                                Send
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. COMMUNITIES BROWSE */}
                    {currentView === 'communities' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Browse Communities & Circles</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join specialized groupings connecting technical mastery with faith foundation ministries.</p>
                                
                                {/* Search and categories bar */}
                                <div className="mt-4 flex flex-col md:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by community name or focus areas..."
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['All', 'Faith & Spiritual Growth', 'Academic Learning', 'Professional Networks'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCommunityCat(cat as any)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                    selectedCommunityCat === cat
                                                    ? 'bg-crimson border-crimson text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                                }`}
                                            >
                                                {cat === 'All' ? 'All categories' : cat.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Communities list grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredCommunities.map(c => (
                                    <div key={c.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shadow hover:-translate-y-1 transition-all duration-300">
                                        <div className="h-32 w-full relative">
                                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover select-none" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                                            <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-crimson font-bold text-[9px] uppercase tracking-wider text-white rounded">
                                                {c.category}
                                            </span>
                                        </div>
                                        <div className="p-4 flex flex-col justify-between h-48">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">{c.name}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{c.description}</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                    <span className="font-bold text-slate-750 dark:text-slate-250">{c.membersCount.toLocaleString()}</span> Members • <span className="font-bold text-slate-755 dark:text-slate-255">{c.discussionsCount}</span> active threads
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setCommunities(communities.map(item => item.id === c.id ? { ...item, isJoined: !item.isJoined } : item));
                                                        addPoints(c.isJoined ? -10 : 15);
                                                    }}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                                        c.isJoined
                                                        ? 'bg-slate-100 dark:bg-slate-750 text-slate-500 border border-slate-200'
                                                        : 'bg-crimson text-white hover:bg-red-800'
                                                    }`}
                                                >
                                                    {c.isJoined ? 'Joined ✔' : 'Join Circle'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. DISCUSSION FORUMS VIEW */}
                    {currentView === 'forums' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Discussion Boards & Forums</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get fast solutions, share theological insights, and collaborate side-by-side with peer researchers.</p>
                                
                                {/* Forum Category list indicators */}
                                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                    {['General Discussion', 'Course Discussions', 'Questions & Answers', 'Success Stories'].map(fcat => (
                                        <span key={fcat} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 rounded-md font-bold tracking-wide">
                                            {fcat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Create Forum thread block */}
                            <form onSubmit={createForumThread} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow space-y-3">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">Start a New Forum Thread</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            value={newForumTitle}
                                            onChange={(e) => setNewForumTitle(e.target.value)}
                                            placeholder="What is your question or topic?"
                                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={newForumCategory}
                                            onChange={(e) => setNewForumCategory(e.target.value)}
                                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-dashed dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-350"
                                        >
                                            <option>Questions & Answers</option>
                                            <option>Course Discussions</option>
                                            <option>General Discussion</option>
                                            <option>Success Stories</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea
                                    value={newForumContent}
                                    onChange={(e) => setNewForumContent(e.target.value)}
                                    placeholder="Provide background context, logs, code, or quotes to get accurate peer feedback."
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs resize-none"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!newForumTitle.trim() || !newForumContent.trim()}
                                        className="px-5 py-1.5 text-xs font-bold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-slate-300"
                                    >
                                        Publish Thread
                                    </button>
                                </div>
                            </form>

                            {/* Thread listings */}
                            <div className="space-y-4">
                                {forums.map(t => (
                                    <div key={t.id} className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow overflow-hidden">
                                        <div 
                                            onClick={() => setForums(forums.map(item => item.id === t.id ? { ...item, isExpanded: !item.isExpanded } : item))} 
                                            className="p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/10 flex items-start justify-between gap-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    {t.pinned && <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">PINNED</span>}
                                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-305 font-bold px-2 py-0.5 rounded">{t.category}</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-805 dark:text-slate-150 leading-snug">{t.title}</h4>
                                                <div className="flex items-center space-x-2 text-[10.5px] text-slate-400">
                                                    <span>By {t.author}</span>
                                                    <span>•</span>
                                                    <span>{t.views} views</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-xs font-extrabold text-crimson dark:text-rose-400">{t.repliesCount} Replies</span>
                                                <p className="text-[10px] text-slate-400">Click to view</p>
                                            </div>
                                        </div>

                                        {/* Thread expanded details */}
                                        {t.isExpanded && (
                                            <div className="p-4 bg-slate-50/50 dark:bg-slate-905/30 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                                                <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200/30">
                                                    <p className="font-semibold text-slate-500 text-[10.5px] mb-1">Original Query:</p>
                                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{t.content}</p>
                                                </div>

                                                {/* Replies list */}
                                                <div className="space-y-3.5 pl-3 border-l-2 border-slate-300">
                                                    {t.replies.map((rep, rIdx) => (
                                                        <div key={rIdx} className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-slate-100 text-xs">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-extrabold text-slate-800 dark:text-slate-200">{rep.author}</span>
                                                                <div className="flex items-center gap-1">
                                                                    {rep.bestAnswer && (
                                                                        <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[9.5px] font-bold">BEST ANSWER ✔</span>
                                                                    )}
                                                                    <span className="text-[10px] text-slate-400">{rep.date}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{rep.content}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Submit reply */}
                                                <div className="flex gap-2.5 pt-2">
                                                    <input
                                                        type="text"
                                                        value={newForumReply[t.id] || ''}
                                                        onChange={(e) => setNewForumReply({ ...newForumReply, [t.id]: e.target.value })}
                                                        placeholder="Post your feedback into this thread..."
                                                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl text-xs"
                                                    />
                                                    <button
                                                        onClick={() => addForumReply(t.id)}
                                                        className="px-4 py-1.5 text-xs font-bold text-white bg-crimson hover:bg-red-800 rounded-xl"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. CLINU STUDY CIRCLES VIEW */}
                    {currentView === 'circles' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                    <h2 className="text-xl font-bold font-serif">Study Circles Room</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Form close accountability circles checking in weekly to secure target performance.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateCircleForm(!showCreateCircleForm)}
                                    className="px-4 py-1.5 text-xs font-bold text-white bg-crimson rounded-full hover:bg-red-800 flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Launch Study Circle
                                </button>
                            </div>

                            {/* Create Study circle form modal or inline */}
                            {showCreateCircleForm && (
                                <form onSubmit={createStudyCircle} className="bg-white dark:bg-gray-800 p-5 rounded-xl border-2 border-dashed border-rose-500/30 shadow-lg space-y-3 text-xs">
                                    <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm">Configure Core Study Circle Specs</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Study Circle Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={newCircleName}
                                                onChange={(e) => setNewCircleName(e.target.value)}
                                                placeholder="e.g. AI Ethics Daily Check-In"
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Privacy Level</label>
                                            <select
                                                value={newCirclePrivacy}
                                                onChange={(e) => setNewCirclePrivacy(e.target.value as any)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                            >
                                                <option>Public</option>
                                                <option>Private</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold mb-1">Milestones & Study Goals</label>
                                        <textarea
                                            value={newCircleGoals}
                                            onChange={(e) => setNewCircleGoals(e.target.value)}
                                            placeholder="Specify the learning plan output goals..."
                                            className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold mb-1">Aesthetic Description</label>
                                        <input
                                            type="text"
                                            value={newCircleDesc}
                                            onChange={(e) => setNewCircleDesc(e.target.value)}
                                            placeholder="A short brief explaining the spiritual/learning vibe."
                                            className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-900"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 text-xs">
                                        <button type="button" onClick={() => setShowCreateCircleForm(false)} className="px-3.5 py-1.5 font-bold bg-slate-100 rounded">Cancel</button>
                                        <button type="submit" className="px-4 py-1.5 font-bold text-white bg-crimson rounded hover:bg-red-800">Boot Circle</button>
                                    </div>
                                </form>
                            )}

                            {/* Circle selector row */}
                            <div className="flex gap-2 overflow-x-auto pb-1 select-none">
                                {studyCircles.map(sc => (
                                    <button
                                        key={sc.id}
                                        onClick={() => setActiveCircleId(sc.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                                            activeCircleId === sc.id
                                            ? 'bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-500/40 ring-1 ring-crimson'
                                            : 'bg-white dark:bg-gray-800 text-slate-500 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {sc.name}
                                    </button>
                                ))}
                            </div>

                            {/* Accountability Workspace layout */}
                            {activeCircle ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-xs">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="pb-3 border-b">
                                            <div className="flex justify-between">
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">{activeCircle.name}</h3>
                                                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{activeCircle.privacy} Room</span>
                                            </div>
                                            <p className="text-slate-500 mt-1">{activeCircle.description}</p>
                                        </div>

                                        {/* Accountability goals */}
                                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl space-y-1">
                                            <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Shared Commitments</div>
                                            <p className="text-slate-600 dark:text-slate-300">{activeCircle.goals}</p>
                                        </div>

                                        {/* Task checklist */}
                                        <div className="space-y-2">
                                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                <span>Active Peer Checkpoints</span>
                                                <span className="text-[10.5px] text-slate-400">
                                                    Score: {activeCircle.tasks.filter(t => t.done).length}/{activeCircle.tasks.length} Completed
                                                </span>
                                            </div>
                                            <div className="space-y-1.5">
                                                {activeCircle.tasks.map(t => (
                                                    <div 
                                                        key={t.id} 
                                                        onClick={() => toggleCircleTask(activeCircle.id, t.id)}
                                                        className="flex items-center space-x-2 p-2.5 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/50 cursor-pointer transition-all"
                                                    >
                                                        <input 
                                                            type="checkbox" 
                                                            checked={t.done} 
                                                            readOnly
                                                            className="rounded text-crimson focus:ring-crimson" 
                                                        />
                                                        <span className={`${t.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>{t.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shared Notes Area */}
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-800 dark:text-slate-200 block">Shared Notes Workspace (Persistent memory)</label>
                                            <textarea
                                                value={activeCircle.notes}
                                                onChange={(e) => appendCircleNotes(activeCircle.id, e.target.value)}
                                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-905 border border-slate-200 rounded-lg focus:ring-1 text-xs"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    {/* Sidebar Live Group chat inside circle */}
                                    <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 pl-0 md:pl-4 flex flex-col justify-between h-[360px]">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white pb-2 border-b">Live Circle Chat</h4>
                                            <div className="space-y-3.5 overflow-y-auto h-[260px] pr-1 py-1 text-xs">
                                                {activeCircle.chatMessages.map((msg, index) => (
                                                    <div key={index} className="space-y-0.5">
                                                        <div className="flex justify-between text-[10.5px] text-slate-400 font-bold">
                                                            <span>{msg.sender}</span>
                                                            <span>{msg.time}</span>
                                                        </div>
                                                        <p className="bg-slate-50 dark:bg-slate-900 border px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">{msg.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 pt-2 border-t">
                                            <input
                                                type="text"
                                                value={circleChatMessage}
                                                onChange={(e) => setCircleChatMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') sendCircleMessage(activeCircle.id);
                                                }}
                                                placeholder="Say something to the group..."
                                                className="flex-1 px-2.5 py-1.5 bg-slate-100 rounded border border-slate-200"
                                            />
                                            <button 
                                                onClick={() => sendCircleMessage(activeCircle.id)}
                                                className="px-2.5 py-1.5 bg-crimson hover:bg-red-800 text-white rounded font-bold"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 text-xs py-8">Select or create a study circle accountability room to begin.</p>
                            )}
                        </div>
                    )}

                    {/* 5. MENTORSHIP HUB VIEW */}
                    {currentView === 'mentorship' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Acreedited Spiritual & Technical Mentors</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect with industry principals who provide alignment roadmap checks.</p>
                            </div>

                            {/* Mentors list cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {mentorsInfo.map(m => (
                                    <div key={m.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl text-center border overflow-hidden flex flex-col justify-between items-center shadow relative">
                                        <div className="absolute top-3 right-3 flex items-center text-amber-500 font-extrabold text-xs">
                                            <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                                            {m.rating}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <img src={m.avatarUrl} alt={m.name} className="w-20 h-20 rounded-full object-cover border-2 border-crimson/30 ring-4 ring-slate-100 bg-slate-100 flex-shrink-0" />
                                            <h4 className="mt-3.5 text-base font-bold font-serif text-slate-900 dark:text-white leading-tight">{m.name}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{m.title}</p>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-350 bg-slate-100 rounded px-2 py-0.5 mt-1 font-semibold">{m.organization}</span>
                                            
                                            <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                                                {m.expertise.map(skill => (
                                                    <span key={skill} className="px-2 py-0.5 text-[9.5px] font-extrabold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 rounded border border-rose-100/10">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedMentor(m)}
                                            className="mt-5 w-full py-2 bg-crimson hover:bg-red-800 text-white rounded-full text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <UserPlus className="w-3.5 h-3.5" /> Book Consultation
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Booking session modal panel */}
                            {selectedMentor && (
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-crimson/50 shadow-lg space-y-4 text-xs animate-fade-in">
                                    <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                                        Schedule 1-on-1 Consultation Session with {selectedMentor.name}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Target Topic</label>
                                            <select
                                                value={bookingTopic}
                                                onChange={(e) => setBookingTopic(e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded dark:bg-slate-900"
                                            >
                                                <option>Career Roadmap & Kingdom Alignment</option>
                                                <option>Theological Alignment Strategy</option>
                                                <option>Technical Architectural Code Review</option>
                                                <option>Ethics & Deep Learning</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-500 font-bold mb-1">Select Consultation Day</label>
                                            <input
                                                type="date"
                                                value={bookingDay}
                                                onChange={(e) => setBookingDay(e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    {bookingRequested ? (
                                        <div className="p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-center rounded">
                                            ✔ Consultation Requested! Confirmed on dashboard.
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2 text-xs">
                                            <button onClick={() => setSelectedMentor(null)} className="px-3.5 py-1.5 font-bold bg-slate-100 rounded">Cancel</button>
                                            <button onClick={bookMentorSession} className="px-4 py-1.5 font-bold text-white bg-crimson rounded">Confirm Booking</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mentorship upcoming list */}
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-xs">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm mb-3">Scheduled Mentorship Dashboard</h3>
                                <div className="space-y-2">
                                    {scheduledSessions.map(sess => (
                                        <div key={sess.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 text-slate-600 dark:text-slate-300">
                                            <div>
                                                <span className="font-bold text-slate-800 dark:text-white text-sm">{sess.mentorName}</span>
                                                <p className="text-[11px] text-slate-405 mt-0.5">Topic: {sess.topic}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-rose-700 dark:text-rose-400">{sess.date}</span>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">At {sess.time} GMT</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. EVENTS & WEBINARS DISCOVERY */}
                    {currentView === 'events' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Community Events & Masterclasses</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Participate in live weekly sessions discussing neural ethics, architecture design, or career alignment.</p>
                            </div>

                            <div className="space-y-4">
                                {events.map(ev => (
                                    <div key={ev.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-205 shadow flex flex-col md:flex-row gap-5 items-start">
                                        <div className="flex md:flex-col items-center gap-2 shrink-0 text-center bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 w-full md:w-28">
                                            <span className="text-xs font-mono font-bold text-slate-500 uppercase">{ev.category}</span>
                                            <span className="text-xl font-black font-serif text-crimson dark:text-rose-400">
                                                {new Date(ev.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <span className="text-[10.5px] text-slate-400 font-semibold">17:00 GMT</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-white leading-tight">{ev.title}</h4>
                                            <div className="flex items-center text-xs text-slate-550 select-none">
                                                <img src={ev.avatarUrl} className="w-5 h-5 rounded-full object-cover mr-1.5" alt="" />
                                                <span className="font-semibold text-slate-700 dark:text-slate-350">Led by {ev.speaker}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ev.description}</p>
                                            
                                            <div className="pt-2 flex flex-wrap gap-2 text-xs">
                                                <button
                                                    onClick={() => toggleRegisterEvent(ev.id)}
                                                    className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                                                        ev.isRegistered
                                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                        : 'bg-crimson text-white hover:bg-red-800'
                                                    }`}
                                                >
                                                    {ev.isRegistered ? 'Registered ✔' : 'Register Seat'}
                                                </button>
                                                {ev.isRegistered && (
                                                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full font-semibold select-none border border-slate-200/20">
                                                        Added to Calendar
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 7. CHALLENGES & GAMIFICATION VIEW */}
                    {currentView === 'challenges' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-center sm:text-left">
                                <h2 className="text-xl font-bold font-serif">Missions & Gamification Board</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Accelerate contributions and solidify skills by enrolling in custom community missions.</p>
                            </div>

                            {/* Challenges Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-250 shadow flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="px-2 py-0.5 bg-amber-500/15 text-amber-500 border border-amber-500/20 rounded font-bold uppercase text-[9px] tracking-wider">7-DAY FAITH & DEVOTION MISSION</span>
                                            <span className="text-rose-500 font-bold text-xs">+100pts</span>
                                        </div>
                                        <h4 className="text-base font-bold font-serif text-slate-900 dark:text-white">The Devotional Learner Loop</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">Publish study circle check-ins and prayers seven days consecutively to earn the exclusive "Theological Contributor" bronze badge.</p>
                                        
                                        <div className="pt-2">
                                            <div className="flex justify-between text-[11px] text-slate-405 font-bold mb-1">
                                                <span>Mission Progress</span>
                                                <span>4/7 Days</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full" style={{ width: '57%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => addPoints(10)} className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-bold text-xs">Verify Day Check</button>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-250 shadow flex flex-col justify-between container">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="px-2 py-0.5 bg-blue-500/15 text-blue-500 border border-blue-500/20 rounded font-bold uppercase text-[9px] tracking-wider">PEER REVIEW MISSION</span>
                                            <span className="text-rose-500 font-bold text-xs">+60pts</span>
                                        </div>
                                        <h4 className="text-base font-bold font-serif text-slate-900 dark:text-white">Accredited Peer Assessor</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">Review and score three homework submissions in the 'Knowledge Exchange' template logs to secure higher community trust standing.</p>
                                        
                                        <div className="pt-2">
                                            <div className="flex justify-between text-[11px] text-slate-405 font-bold mb-1">
                                                <span>Reviews Completed</span>
                                                <span>1/3 Submissions</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full rounded-full" style={{ width: '33%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => addPoints(20)} className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-bold text-xs">Submit Peer Feedback</button>
                                </div>
                            </div>

                            {/* Badge collection view */}
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow text-xs">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm mb-4">ALEX TURNER’S UNLOCKED ACCREDITATION BADGES</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    {[
                                        { name: 'Community Builder', desc: 'Launched a custom accountability study group', icon: Users, color: 'from-amber-400 to-amber-600' },
                                        { name: 'Prayer Warrior', desc: 'Supported 10+ peer requests under reflections', icon: Heart, color: 'from-rose-400 to-red-600' },
                                        { name: 'Knight Contributor', desc: 'Uploaded theological resource models', icon: BookOpen, color: 'from-blue-400 to-indigo-600' },
                                        { name: 'Sovereign Leader', desc: 'Gave mentorship feedback to 5 peers', icon: Shield, color: 'from-emerald-400 to-teal-600' }
                                    ].map(b => {
                                        const unlocked = unlockedBadges.includes(b.name);
                                        const BIcon = b.icon;
                                        return (
                                            <div key={b.name} className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${unlocked ? 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-905 dark:to-slate-900 border-rose-500/20' : 'opacity-40 bg-slate-105 border-slate-200'}`}>
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold shadow-md`}>
                                                    <BIcon className="w-5 h-5" />
                                                </div>
                                                <span className="font-extrabold text-[11px] text-slate-800 dark:text-white leading-tight">{b.name}</span>
                                                <p className="text-[10px] text-slate-400 leading-snug">{b.desc}</p>
                                                {!unlocked && <span className="bg-slate-100 text-[8.5px] font-bold px-1.5 py-0.2 rounded text-slate-500">LOCKED</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 8. PRAYER & REFLECTION ROOM UNIQUE DIFFERENTIATOR */}
                    {currentView === 'prayer' && (
                        <div className="space-y-6">
                            {/* Intro devotions block */}
                            <div className="bg-gradient-to-r from-rose-950/90 to-slate-900 text-white p-5 rounded-2xl border border-rose-900/30 select-none">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-350 border border-rose-500/30 rounded font-bold uppercase text-[9px] tracking-wider">DAILY SCRIPTURE DEVOTIONAL</span>
                                        <h3 className="text-lg font-bold font-serif text-white mt-1.5">"As iron sharpens iron, so one person sharpens another."</h3>
                                        <p className="text-xs text-rose-200/80 mt-1 italic font-mono">— Proverbs 27:17 • Kingdom Learning Wisdom</p>
                                    </div>
                                    <span className="text-2xl">📖</span>
                                </div>
                            </div>

                            {/* Send prayer request box */}
                            <form onSubmit={sendPrayerRequest} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow space-y-3 font-xs">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm">Add a Devotional Reflection or Prayer Request</h3>
                                <div className="grid grid-cols-1 gap-2.5">
                                    <input
                                        type="text"
                                        required
                                        value={newPrayerTitle}
                                        onChange={(e) => setNewPrayerTitle(e.target.value)}
                                        placeholder="e.g. Seeking Guidance for Theological Coding Project"
                                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded text-xs"
                                    />
                                    <textarea
                                        required
                                        value={newPrayerBody}
                                        onChange={(e) => setNewPrayerBody(e.target.value)}
                                        placeholder="Uplift our community, share a breakthrough testimony, or ask for accountability checks..."
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded text-xs resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={!newPrayerTitle.trim() || !newPrayerBody.trim()} className="px-5 py-2 text-xs font-bold text-white bg-crimson rounded-full">
                                        Submit Reflection
                                    </button>
                                </div>
                            </form>

                            {/* Active prayers log board */}
                            <div className="space-y-3.5">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base">Shared Prayer & Reflection Records</h3>
                                {prayerRequests.map(pr => (
                                    <div key={pr.id} className="bg-white dark:bg-gray-800 p-4.5 rounded-xl border border-slate-220 shadow-sm flex justify-between items-start">
                                        <div className="space-y-1.5 flex-1 pr-4">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif">{pr.title}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold">Reflected by {pr.author}</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{pr.content}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <button
                                                onClick={() => supportPrayer(pr.id)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                                                    pr.hasPrayed
                                                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                                                }`}
                                            >
                                                <span>🙏 Prayed</span>
                                                <span className="font-extrabold">{pr.prayersCount}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Gratitude Sticky wall */}
                            <div className="bg-amber-50 dark:bg-slate-900/60 p-5 rounded-xl border border-amber-200/40 text-xs">
                                <h3 className="font-serif font-bold text-amber-900 dark:text-amber-300 text-sm mb-3">Community Gratitude Wall</h3>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newGratitudeText}
                                        onChange={(e) => setNewGratitudeText(e.target.value)}
                                        placeholder="Add your note of thanks..."
                                        className="flex-1 px-3 py-1.5 bg-white border border-amber-200 rounded text-xs text-slate-700"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') submitGratitude();
                                        }}
                                    />
                                    <button onClick={submitGratitude} className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold">Stick Post-It</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                    {gratitudeNotes.map((note, index) => (
                                        <div key={index} className="p-3 bg-white/95 text-slate-700 rounded-lg border-l-4 border-amber-500 shadow-sm relative leading-relaxed">
                                            <p className="font-medium text-xs">{note}</p>
                                            <span className="absolute bottom-1 right-2 text-[9px] text-amber-500 font-bold opacity-60 uppercase font-mono">GRATEFUL</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 9. KNOWLEDGE EXCHANGE TEMPLATE FILES */}
                    {currentView === 'knowledge' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold font-serif">Knowledge Exchange Database</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Acquire and publish community-guided startup cheat sheets, templates, and academic papers.</p>
                                </div>
                            </div>

                            {/* File Upload mock workspace form */}
                            <form onSubmit={submitResource} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow space-y-3 text-xs">
                                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm">Upload a Community Resource Tool</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            required
                                            value={uploadedResourceTitle}
                                            onChange={(e) => setUploadedResourceTitle(e.target.value)}
                                            placeholder="e.g. Figma Layout Token Mapping Cheat Sheet"
                                            className="w-full px-3 py-1.5 border border-slate-205 rounded dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={uploadedResourceCat}
                                            onChange={(e) => setUploadedResourceCat(e.target.value)}
                                            className="w-full px-3 py-1.5 border border-slate-205 rounded dark:bg-slate-900 text-slate-600 dark:text-slate-350"
                                        >
                                            <option>Templates</option>
                                            <option>Research Papers</option>
                                            <option>Articles</option>
                                            <option>Cheat Sheets</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-5 text-center bg-slate-50/50 dark:bg-slate-900/10">
                                    <span className="text-2xl block mb-1">📁</span>
                                    <span className="text-xs font-semibold text-crimson cursor-pointer hover:underline">Select your local PDF/ZIP resource file</span>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Maximum size: 15MB • Standard formats</p>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={!uploadedResourceTitle.trim()} className="px-5 py-1.5 text-xs font-bold text-white bg-crimson rounded-full">
                                        Publish Resource Model
                                    </button>
                                </div>
                            </form>

                            {/* Resource grid list with downloads counter */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                                {resources.map(res => (
                                    <div key={res.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow hover:-translate-y-0.5 transition-all">
                                        <div>
                                            <div className="flex justify-between items-center mb-1 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded self-start shrink-0">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wide text-rose-700 dark:text-rose-300">{res.category}</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-905 dark:text-slate-100 font-serif leading-snug">{res.title}</h4>
                                            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Author: {res.author}</p>
                                        </div>
                                        <div className="mt-4 pt-2 border-t flex justify-between items-center text-xs">
                                            <span className="text-[10.5.px] text-slate-400 font-mono">{res.downloads} downloads</span>
                                            <button
                                                onClick={() => {
                                                    setResources(resources.map(item => item.id === res.id ? { ...item, downloads: item.downloads + 1 } : item));
                                                    addPoints(5);
                                                }}
                                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold flex items-center gap-1 text-[10.5px]"
                                            >
                                                <Download className="w-3 h-3" /> Get
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 10. NETWORKING LOUNGE VIEW */}
                    {currentView === 'networking' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Networking Lounge</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse members directory, search by profession, skills, or country, and expand your corporate web.</p>
                            </div>

                            {/* directory layout connection roster */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loungers.map(l => (
                                    <div key={l.id} className="bg-white dark:bg-gray-800 p-4.5 rounded-xl border border-slate-200 text-center flex flex-col justify-between items-center shadow-sm">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm border-2 border-slate-200">
                                                {l.name.slice(0, 2)}
                                            </div>
                                            <h4 className="mt-3.5 font-bold font-serif text-slate-900 dark:text-white leading-tight">{l.name}</h4>
                                            <p className="text-[11px] text-slate-405 mt-0.5 leading-snug">{l.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-semibold flex items-center gap-1 text-center">🌍 Mutual Groups: {l.mutualG}</p>
                                        </div>

                                        <button
                                            onClick={() => toggleConnectLounger(l.id)}
                                            className={`mt-4 w-full py-1.5 rounded-full text-xs font-bold transition-all ${
                                                l.isConnected
                                                ? 'bg-slate-100 text-slate-500 border border-slate-200'
                                                : 'bg-crimson text-white hover:bg-red-800'
                                            }`}
                                        >
                                            {l.isConnected ? 'Connected ✔' : 'Connect'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 11. LEADERBOARDS & MARQUEE RANKINGS */}
                    {currentView === 'leaderboards' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif text-center sm:text-left">Weekly Engagement Roster</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Recognizing highest peer mentorship contributions, scripture backing, and file uploads.</p>
                            </div>

                            {/* Leaderboard layout rows */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 overflow-hidden shadow">
                                <div className="grid grid-cols-4 px-4.5 py-3 bg-slate-50 dark:bg-slate-905 border-b font-mono text-[10.5px] font-bold text-slate-400">
                                    <span>RANK TYPE</span>
                                    <span className="col-span-2">ENGAGEMENT PEER AUTHOR</span>
                                    <span className="text-right">COGNIPOINTS</span>
                                </div>
                                <div className="divide-y text-xs">
                                    {[
                                        { rank: '1 👑', name: 'Dr. Alan Grant', role: 'Theology Scholar', pts: 1240 },
                                        { rank: '2 🥈', name: 'Esther Vance', role: 'Active Peer Mentor', pts: 940 },
                                        { rank: '3 🥉', name: 'Chris G.', role: 'Academic Contributor', pts: 820 },
                                        { rank: '4', name: 'Alex Turner (You)', role: 'Web Masterclass Dev', pts: userPoints }
                                    ].map(r => (
                                        <div key={r.rank} className="grid grid-cols-4 px-4.5 py-3.5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                            <span className="font-extrabold text-slate-400 font-mono text-sm">{r.rank}</span>
                                            <div className="col-span-2">
                                                <span className="font-bold text-slate-800 dark:text-white">{r.name}</span>
                                                <p className="text-[10px] text-slate-400">{r.role}</p>
                                            </div>
                                            <span className="text-right font-extrabold text-rose-700 dark:text-rose-400 font-mono">{r.pts} PTS</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 12. RECOGNITION WALL HERO TILES */}
                    {currentView === 'recognition' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Sovereign Recognition Wall</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Celebrating excellence and outstanding dedication to fellow community members.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-slate-900 to-rose-950 p-5 rounded-2xl border-2 border-amber-400 text-white shadow-lg relative overflow-hidden select-none">
                                    <div className="absolute top-2 right-2 text-3xl opacity-20 font-serif font-black">HERO</div>
                                    <span className="px-2.5 py-0.5 bg-amber-400 text-black border border-amber-300 rounded font-black uppercase text-[9px] tracking-widest">FEATURED PEER HERO</span>
                                    <div className="mt-4 flex items-center space-x-3.5">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center font-bold text-base">EV</div>
                                        <div>
                                            <h4 className="text-base font-extrabold font-serif text-amber-300">Esther Vance</h4>
                                            <p className="text-xs text-rose-200/80 mt-0.5">Assisted over 12 students in resolving TypeScript recursive types and hosted consecutive Bible Study reflections.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-5 rounded-2xl border-2 border-cyan-400 text-white shadow-lg relative overflow-hidden select-none">
                                    <div className="absolute top-2 right-2 text-3xl opacity-20 font-serif font-black">LEADER</div>
                                    <span className="px-2.5 py-0.5 bg-cyan-400 text-black border border-cyan-300 rounded font-black uppercase text-[9px] tracking-widest">TOP MENTOR PLATINUM</span>
                                    <div className="mt-4 flex items-center space-x-3.5">
                                        <div className="w-12 h-12 rounded-full bg-slate-850 border-2 border-cyan-400 flex items-center justify-center font-bold text-base">JD</div>
                                        <div>
                                            <h4 className="text-base font-extrabold font-serif text-cyan-300">Jane Doe</h4>
                                            <p className="text-xs text-sky-200/80 mt-0.5">Consistently rated 4.9/5 stars for deep codebase audits, helping academic circles draft optimized system engines.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 13. COGNISACRA AI GUIDE PROMPT SERVICE */}
                    {currentView === 'ai-guide' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-205 shadow overflow-hidden flex flex-col justify-between h-[450px]">
                            {/* AI Guide Header */}
                            <div className="bg-gradient-to-r from-red-950 to-slate-900 p-4 text-white flex items-center justify-between border-b border-rose-900/20">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-crimson/20 rounded border border-rose-500/30">
                                        <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-sm">CogniSacra AI Spiritual & Tech Guide</h3>
                                        <p className="text-[10px] text-rose-200/80">Continuous theological and development alignment support</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message log */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                                {aiGuideLog.map((log, index) => (
                                    <div key={index} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl border shadow-sm leading-relaxed ${
                                            log.sender === 'user'
                                            ? 'bg-crimson text-white border-crimson'
                                            : 'bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 border-slate-200'
                                        }`}>
                                            <p>{log.text}</p>
                                            <span className="text-[9px] opacity-60 block mt-1 text-right font-mono">{log.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Prompt Input row */}
                            <div className="p-3.5 bg-slate-50 dark:bg-slate-905 border-t flex gap-2">
                                <label htmlFor="ai-guide-query" className="sr-only">Ask AI Guide</label>
                                <input
                                    id="ai-guide-query"
                                    type="text"
                                    value={aiGuideInput}
                                    onChange={(e) => setAiGuideInput(e.target.value)}
                                    placeholder="e.g. Recommend a study circle for React hooks, or ask faith questions..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') queryAiGuide();
                                    }}
                                    className="flex-1 px-3 py-2 bg-white border border-slate-205 rounded-xl text-xs text-slate-700"
                                />
                                <button
                                    onClick={queryAiGuide}
                                    className="px-4 py-2 bg-crimson hover:bg-red-800 text-white rounded-xl font-bold text-xs"
                                >
                                    Query AI
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 14. CONTRIBUTION ANALYTICS DASHBOARD */}
                    {currentView === 'analytics' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow">
                                <h2 className="text-xl font-bold font-serif">Contribution Analytics</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time charts tracking your spiritual collaboration and technical engagement scores with the community.</p>
                            </div>

                            {/* Metrics gauges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-205 shadow-sm text-center space-y-1">
                                    <div className="text-2xl font-black font-serif text-rose-700">86%</div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">Kingdom Impact Level</div>
                                    <p className="text-[10px] text-slate-400 leading-snug">Continuous metric tracking prayer supports, comments, and file download metrics.</p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-205 shadow-sm text-center space-y-1">
                                    <div className="text-2xl font-black font-serif text-blue-700">14 Active</div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">Study Connections</div>
                                    <p className="text-[10px] text-slate-400 leading-snug">Calculated by mutual groups, mentors assigned, and study circle partnerships.</p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-205 shadow-sm text-center space-y-1">
                                    <div className="text-2xl font-black font-serif text-amber-600">380 PTS</div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">Weekly Achievement Score</div>
                                    <p className="text-[10px] text-slate-400 leading-snug">Verified reward tokens. Spend points to schedule elite peer reviews.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CommunityHubView;
