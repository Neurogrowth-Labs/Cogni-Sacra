
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Course, Lesson, DiscussionPost, Annotation } from '../types';
import { 
    ChevronLeft, 
    List, 
    MessageSquare, 
    Edit, 
    Sparkles, 
    Check, 
    X, 
    BookOpen 
} from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';
import { getLessonIcon } from './utils/uiUtils';

type SidebarTab = 'syllabus' | 'notes' | 'annotations';
type InfoTab = 'transcript' | 'discussion';

interface LearningViewProps {
    course: Course;
    lesson: Lesson;
    onBack: () => void;
    onCompleteLesson: (lesson: Lesson) => void;
    onNavigateLesson: (lesson: Lesson) => void;
}

const NotesPanel: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    const [notes, setNotes] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem(`cognisacra-notes-${lesson.id}`);
            if (savedNotes) {
                setNotes(savedNotes);
            } else {
                setNotes('');
            }
        } catch (error) {
            console.error("Failed to read notes from localStorage", error);
        }
    }, [lesson.id]);

    useEffect(() => {
        const handler = setTimeout(() => {
            try {
                localStorage.setItem(`cognisacra-notes-${lesson.id}`, notes);
            } catch (error) {
                console.error("Failed to save notes to localStorage", error);
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [notes, lesson.id]);


    const handleSummarize = async () => {
        if (!lesson.transcript || isSummarizing) return;
        setIsSummarizing(true);
        
        const originalNotes = notes.trim();
        const summaryHeader = originalNotes ? "\n\n**AI Summary:**\n" : "**AI Summary:**\n";

        try {
            const prompt = `Summarize the key points of the following lesson transcript into a concise, bulleted list:\n\n---\n\n${lesson.transcript}`;
            const stream = await sendMessageToAI(prompt);
            let summaryText = '';
            
            setNotes(originalNotes + summaryHeader + '...');

            for await (const chunk of stream) {
                summaryText += chunk.text;
                setNotes(originalNotes + summaryHeader + summaryText);
            }
        } catch (error) {
            console.error('Error summarizing:', error);
            setNotes(originalNotes + summaryHeader + "Sorry, there was an error generating the summary.");
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-serif">My Notes</h3>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down your thoughts and key takeaways here..."
                className="w-full flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-crimson focus:border-crimson resize-none"
            />
            {lesson.transcript && (
                <button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-crimson text-white rounded-lg font-semibold hover:bg-red-800 disabled:bg-red-400"
                >
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    {isSummarizing ? 'Summarizing...' : 'AI Auto-Summarize'}
                </button>
            )}
        </div>
    );
};

const AnnotationsPanel: React.FC<{ annotations: Annotation[]; onSelectAnnotation: (id: string) => void }> = ({ annotations, onSelectAnnotation }) => {
    return (
        <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-serif">My Annotations</h3>
            {annotations.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Highlight text in the transcript to add annotations.</p>
            ) : (
                <div className="space-y-3 overflow-y-auto">
                    {annotations.map(anno => (
                        <div key={anno.id} onClick={() => onSelectAnnotation(anno.id)} className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                            <p className="text-sm font-semibold text-crimson dark:text-red-300 italic truncate">"{anno.text}"</p>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{anno.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const SyllabusPanel: React.FC<{ course: Course; currentLessonId: string; onNavigateLesson: (lesson: Lesson) => void; }> = ({ course, currentLessonId, onNavigateLesson }) => (
    <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-serif">{course.title}</h3>
        <div className="space-y-4">
            {course.modules.map(module => (
                <div key={module.id}>
                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2 font-serif">{module.title}</h4>
                    <ul className="space-y-1">
                        {module.lessons.map(lesson => (
                            <li key={lesson.id}>
                                <button
                                    onClick={() => onNavigateLesson(lesson)}
                                    className={`w-full text-left p-3 rounded-lg flex items-center transition-colors ${
                                        lesson.id === currentLessonId
                                            ? 'bg-crimson/10 dark:bg-crimson/20 text-crimson dark:text-red-200'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <div className="mr-3 flex-shrink-0">{getLessonIcon(lesson.format, "w-5 h-5")}</div>
                                    <span className="flex-grow text-sm font-medium">{lesson.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);

const DiscussionPostItem: React.FC<{ 
    post: DiscussionPost,
    replyingToPostId: string | null,
    onSetReplyingTo: (postId: string | null) => void,
    onAddReply: (parentPostId: string, replyContent: string) => void
}> = ({ post, replyingToPostId, onSetReplyingTo, onAddReply }) => {
    const [replyText, setReplyText] = useState('');
    const isReplying = replyingToPostId === post.id;

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyText.trim()) {
            onAddReply(post.id, replyText);
            setReplyText('');
        }
    };
    
    return (
        <div className="flex items-start space-x-4">
            <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <p className="font-bold text-gray-900 dark:text-white">{post.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300">{post.text}</p>
                <button
                    onClick={() => onSetReplyingTo(isReplying ? null : post.id)}
                    className="mt-2 text-sm font-semibold text-crimson dark:text-crimson/90 hover:underline"
                >
                    {isReplying ? 'Cancel' : 'Reply'}
                </button>
                {isReplying && (
                    <form onSubmit={handleSubmitReply} className="mt-2">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Replying to ${post.author}...`}
                            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-crimson focus:border-crimson resize-none"
                            rows={2}
                            autoFocus
                        />
                        <div className="flex justify-end mt-2">
                            <button type="submit" className="px-4 py-1.5 text-sm font-semibold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-red-400">
                                Submit Reply
                            </button>
                        </div>
                    </form>
                )}
                <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                    {post.replies.map(reply => (
                        <DiscussionPostItem 
                            key={reply.id} 
                            post={reply} 
                            replyingToPostId={replyingToPostId}
                            onSetReplyingTo={onSetReplyingTo}
                            onAddReply={onAddReply}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const DiscussionPanel: React.FC<{
    posts: DiscussionPost[];
    replyingToPostId: string | null;
    onSetReplyingTo: (postId: string | null) => void;
    onAddReply: (parentPostId: string, replyContent: string) => void;
}> = ({ posts, replyingToPostId, onSetReplyingTo, onAddReply }) => {
    if (!posts || posts.length === 0) {
        return <div className="text-center text-gray-500">No discussions yet. Start one!</div>;
    }
    return (
        <div className="space-y-6">
            {posts.map(post => (
                <DiscussionPostItem 
                    key={post.id} 
                    post={post}
                    replyingToPostId={replyingToPostId}
                    onSetReplyingTo={onSetReplyingTo}
                    onAddReply={onAddReply}
                />
            ))}
        </div>
    );
};

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
};

const LearningView: React.FC<LearningViewProps> = ({ course, lesson, onBack, onCompleteLesson, onNavigateLesson }) => {
    const [sidebarTab, setSidebarTab] = useState<SidebarTab>('syllabus');
    const [infoTab, setInfoTab] = useState<InfoTab>('transcript');
    const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    
    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [quizAttempts, setQuizAttempts] = useState(1);

    // Annotation State
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [selection, setSelection] = useState<{ range: Range, rect: DOMRect } | null>(null);
    const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);
    const [newAnnotationComment, setNewAnnotationComment] = useState("");
    const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);

    const updateAndSyncDiscussions = useCallback((newPosts: DiscussionPost[]) => {
        setDiscussionPosts(newPosts);
        try {
            // This triggers the 'storage' event in other tabs, enabling real-time updates.
            localStorage.setItem(`cognisacra-discussion-${lesson.id}`, JSON.stringify(newPosts));
        } catch (e) {
            console.error("Failed to save discussion to localStorage", e);
        }
    }, [lesson.id]);
    
    // Quiz passing logic
    const questions = lesson.questions || [];
    const passingScorePercentage = 70;
    const userScorePercentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    const hasPassed = isQuizFinished && userScorePercentage >= passingScorePercentage;

    useEffect(() => {
        const discussionKey = `cognisacra-discussion-${lesson.id}`;
        try {
            const savedDiscussions = localStorage.getItem(discussionKey);
            setDiscussionPosts(savedDiscussions ? JSON.parse(savedDiscussions) : lesson.discussion || []);
        } catch (error) { setDiscussionPosts(lesson.discussion || []); }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === discussionKey && event.newValue) {
                try { setDiscussionPosts(JSON.parse(event.newValue)); } catch (e) { console.error(e); }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [lesson.id, lesson.discussion]);
    
    // Load/Save Annotations
    useEffect(() => {
        try {
            const saved = localStorage.getItem(`cognisacra-annotations-${lesson.id}`);
            setAnnotations(saved ? JSON.parse(saved) : []);
        } catch (e) { setAnnotations([]); }
    }, [lesson.id]);

    useEffect(() => {
        try {
            localStorage.setItem(`cognisacra-annotations-${lesson.id}`, JSON.stringify(annotations));
        } catch(e) { console.error("Failed to save annotations", e); }
    }, [annotations, lesson.id]);


    useEffect(() => {
        setReplyingToPostId(null);
        setNewPostContent('');
        const initialChecked = new Set<string>();
        lesson.checklist?.forEach(item => { if (item.isCompleted) initialChecked.add(item.id); });
        setCheckedItems(initialChecked);

        if (lesson.format === 'quiz') {
            setCurrentQuestionIndex(0);
            setSelectedOptionId(null);
            setFeedback(null);
            setScore(0);
            setIsQuizFinished(false);
            setQuizAttempts(1);
        }
    }, [lesson]);
    
    const handleMouseUp = () => {
        if (!transcriptContainerRef.current) return;
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (transcriptContainerRef.current.contains(range.commonAncestorContainer)) {
                const rect = range.getBoundingClientRect();
                setSelection({ range, rect });
                return;
            }
        }
        setSelection(null);
    };
    
    const handleSaveAnnotation = () => {
        if (!selection || !newAnnotationComment.trim()) return;

        const container = transcriptContainerRef.current;
        if (!container) return;

        const textContent = container.textContent || "";
        const range = selection.range;
        
        // This is a simplified offset calculation assuming a single text node.
        // A more robust solution would handle multiple child nodes.
        let startOffset = 0;
        let endOffset = 0;
        
        const preRange = document.createRange();
        preRange.selectNodeContents(container);
        preRange.setEnd(range.startContainer, range.startOffset);
        startOffset = preRange.toString().length;
        endOffset = startOffset + range.toString().length;

        const newAnnotation: Annotation = {
            id: `anno-${Date.now()}`,
            text: range.toString(),
            comment: newAnnotationComment,
            startOffset,
            endOffset,
        };

        setAnnotations(prev => [...prev, newAnnotation].sort((a,b) => a.startOffset - b.startOffset));
        setAnnotationModalOpen(false);
        setNewAnnotationComment("");
        setSelection(null);
        window.getSelection()?.removeAllRanges();
    };

    const handleAddReply = (parentPostId: string, replyContent: string) => {
        const newReply: DiscussionPost = {
            id: `reply-${Date.now()}`,
            author: 'Alex Turner',
            avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
            timestamp: 'Just now',
            text: replyContent,
            replies: [],
        };

        const addReplyRecursively = (posts: DiscussionPost[]): DiscussionPost[] => posts.map(post => {
            if (post.id === parentPostId) return { ...post, replies: [...post.replies, newReply] };
            if (post.replies.length > 0) return { ...post, replies: addReplyRecursively(post.replies) };
            return post;
        });

        const updatedPosts = addReplyRecursively(discussionPosts);
        updateAndSyncDiscussions(updatedPosts);
        setReplyingToPostId(null);
    };
    
    const handleAddPost = () => {
        if (!newPostContent.trim()) return;
        const newPost: DiscussionPost = {
            id: `post-${Date.now()}`,
            author: 'Alex Turner',
            avatarUrl: 'https://i.pravatar.cc/150?u=alexturner',
            timestamp: 'Just now',
            text: newPostContent.trim(),
            replies: [],
        };
        const updatedPosts = [newPost, ...discussionPosts];
        updateAndSyncDiscussions(updatedPosts);
        setNewPostContent('');
    };

    const handleCheckItem = (itemId: string) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) newSet.delete(itemId); else newSet.add(itemId);
            return newSet;
        });
    };

    const handleSelectOption = (optionId: string) => !feedback && setSelectedOptionId(optionId);
    
    const handleSubmitAnswer = () => {
        if (!selectedOptionId) return;
        const currentQuestion = questions?.[currentQuestionIndex];
        if (!currentQuestion) return;

        const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
        if (isCorrect) setScore(prev => prev + 1);
        setFeedback({ isCorrect, explanation: currentQuestion.explanation });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex === (questions?.length ?? 0) - 1) setIsQuizFinished(true);
        else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOptionId(null);
            setFeedback(null);
        }
    };

    const handleRestartQuiz = () => {
        setQuizAttempts(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setSelectedOptionId(null);
        setFeedback(null);
        setScore(0);
        setIsQuizFinished(false);
    };
    
    const renderDiscussionTab = () => (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Start a new discussion</h4>
                <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="What's on your mind?" className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-crimson focus:border-crimson resize-none" rows={3} />
                <div className="flex justify-end mt-2"><button onClick={handleAddPost} disabled={!newPostContent.trim()} className="px-5 py-2 text-sm font-semibold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-red-400">Post</button></div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6"><DiscussionPanel posts={discussionPosts} replyingToPostId={replyingToPostId} onSetReplyingTo={setReplyingToPostId} onAddReply={handleAddReply} /></div>
        </div>
    );
    
    const renderQuizContent = () => {
        if (questions.length === 0) return <div className="p-8 text-center text-gray-500">This quiz has no questions.</div>;

        if (isQuizFinished) return (
            <div className="p-4 sm:p-8 flex-1 flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">{hasPassed ? 'Congratulations! You Passed!' : 'Quiz Complete'}</h2>
                <p className="mt-2 text-md text-gray-500 dark:text-gray-400">Attempt {quizAttempts}</p>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Your Final Score:</p>
                <p className={`text-7xl font-extrabold my-4 ${hasPassed ? 'text-green-500' : 'text-crimson'}`}>{score} / {questions.length}</p>
                <p className="text-lg text-gray-500 dark:text-gray-400">({userScorePercentage.toFixed(0)}%)</p>
                <div className="mt-8">
                    {!hasPassed ? (
                        <><p className="mb-4 text-gray-600 dark:text-gray-400">You need a score of {passingScorePercentage}% or higher to pass. Please try again.</p><button onClick={handleRestartQuiz} className="px-6 py-3 font-semibold text-crimson dark:text-red-300 border border-crimson/50 rounded-full hover:bg-crimson/10">Restart Quiz</button></>
                    ) : ( <p className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 p-3 rounded-lg">Great job! You can now mark this lesson as complete.</p>)}
                </div>
            </div>
        );

        const currentQuestion = questions[currentQuestionIndex];
        return (
            <div className="p-4 sm:p-8 flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-serif">Quiz: {lesson.title}</h2>
                    <div className="flex items-center space-x-4 text-sm">
                        <span className="font-bold text-gray-500 dark:text-gray-400">Attempt: {quizAttempts}</span>
                        <span className="font-bold text-gray-500 dark:text-gray-400">Score: {score}/{questions.length}</span>
                        <span className="font-medium text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                    </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-crimson h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div></div>
                <h3 className="text-2xl font-semibold my-6 text-gray-800 dark:text-gray-200">{currentQuestion.questionText}</h3>
                <div className="space-y-4">{currentQuestion.options.map(option => {
                    const isCorrect = option.id === currentQuestion.correctOptionId, isSelected = option.id === selectedOptionId;
                    let btnClass = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-crimson/50 dark:hover:border-crimson';
                    if (feedback) {
                        if (isCorrect) btnClass = 'bg-green-100 dark:bg-green-900/50 border-green-500 ring-2 ring-green-500 text-green-800 dark:text-green-200';
                        else if (isSelected && !feedback.isCorrect) btnClass = 'bg-red-100 dark:bg-red-900/50 border-red-500 ring-2 ring-red-500 text-red-800 dark:text-red-200';
                        else btnClass = 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed';
                    } else if (isSelected) btnClass = 'bg-crimson/10 dark:bg-crimson/20 border-crimson ring-2 ring-crimson';
                    return (<button key={option.id} onClick={() => handleSelectOption(option.id)} disabled={!!feedback} className={`w-full text-left p-4 border rounded-lg transition-all flex items-center ${btnClass}`}>
                        {feedback && (isCorrect ? <Check className="w-5 h-5 mr-3 text-green-600" /> : isSelected ? <X className="w-5 h-5 mr-3 text-red-600" /> : <div className="w-5 h-5 mr-3"/>)} {option.text}
                    </button>);
                })}</div>
                {feedback && (<div className={`mt-6 p-4 rounded-lg animate-fade-in ${feedback.isCorrect ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                    <h3 className="font-bold">{feedback.isCorrect ? "Correct!" : "Not quite..."}</h3><p className="text-sm mt-1">{feedback.explanation}</p>
                </div>)}
                <div className="mt-auto pt-6">{feedback ? (<button onClick={handleNextQuestion} className="w-full py-3 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800">{currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</button>) : (<button onClick={handleSubmitAnswer} disabled={!selectedOptionId} className="w-full py-3 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed">Submit Answer</button>)}</div>
            </div>);
    };

    const renderDefaultContent = () => {
        const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl) || '';
        return (
            <>
                {lesson.format === 'video' && lesson.videoUrl ? (
                    <div className="aspect-video bg-black rounded-t-2xl overflow-hidden">
                        <iframe 
                            src={embedUrl} 
                            title={lesson.title} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                            className="w-full h-full"
                        ></iframe>
                    </div>
                ) : (
                    <div className="bg-black aspect-video flex items-center justify-center rounded-t-2xl">
                        <p className="text-white">Video Player Placeholder</p>
                    </div>
                )}
            {lesson.checklist?.length > 0 && (
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 font-serif">Lesson Checklist</h3>
                    <div className="space-y-3">{lesson.checklist.map(item => (<div key={item.id} className="flex items-center"><input id={`checklist-${item.id}`} type="checkbox" checked={checkedItems.has(item.id)} onChange={() => handleCheckItem(item.id)} className="h-5 w-5 rounded border-gray-300 text-crimson focus:ring-crimson" /><label htmlFor={`checklist-${item.id}`} className={`ml-3 text-gray-700 dark:text-gray-300 cursor-pointer ${checkedItems.has(item.id) ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{item.text}</label></div>))}</div>
                </div>
            )}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4 px-4 sm:px-6">
                    <TabButton isActive={infoTab === 'transcript'} onClick={() => setInfoTab('transcript')}><List className="w-5 h-5 mr-2" /> Transcript</TabButton>
                    <TabButton isActive={infoTab === 'discussion'} onClick={() => setInfoTab('discussion')}><MessageSquare className="w-5 h-5 mr-2" /> Discussion</TabButton>
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto relative" onMouseUp={handleMouseUp} onMouseDown={() => setSelection(null)}>
                {infoTab === 'transcript' && <AnnotatedTranscript transcript={lesson.transcript || 'No transcript available.'} annotations={annotations} onAnnotationHover={setActiveAnnotation} transcriptRef={transcriptContainerRef} />}
                {infoTab === 'discussion' && renderDiscussionTab()}
            </div>
            {activeAnnotation && <AnnotationTooltip annotation={activeAnnotation} />}
        </>
    ); };

    return (
        <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-8rem)] animate-fade-in gap-6">
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-shrink-0 mb-4"><button onClick={onBack} className="flex items-center text-crimson dark:text-crimson/90 hover:underline font-semibold"><ChevronLeft className="w-5 h-5 mr-2" />Back to Course Details</button><h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-serif">{lesson.title}</h1></div>
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden relative">
                    {lesson.format === 'quiz' ? renderQuizContent() : renderDefaultContent()}
                    {selection && <button onClick={() => setAnnotationModalOpen(true)} className="absolute bg-black text-white px-3 py-1 rounded-full text-sm shadow-lg" style={{ top: `${selection.rect.top - 40}px`, left: `${selection.rect.left + selection.rect.width / 2}px`, transform: 'translateX(-50%)' }}>Annotate</button>}
                </div>
                <button onClick={() => onCompleteLesson(lesson)} className="mt-4 w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={lesson.format === 'quiz' && !hasPassed}>Mark as Complete</button>
            </div>
            <div className="w-full lg:w-96 flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700"><nav className="flex">
                    <SidebarTabButton isActive={sidebarTab === 'syllabus'} onClick={() => setSidebarTab('syllabus')}><List className="w-5 h-5 mr-2" /> Syllabus</SidebarTabButton>
                    <SidebarTabButton isActive={sidebarTab === 'notes'} onClick={() => setSidebarTab('notes')}><Edit className="w-5 h-5 mr-2" /> My Notes</SidebarTabButton>
                    <SidebarTabButton isActive={sidebarTab === 'annotations'} onClick={() => setSidebarTab('annotations')}><BookOpen className="w-5 h-5 mr-2" /> Annotations</SidebarTabButton>
                </nav></div>
                <div className="flex-1 overflow-y-auto">
                    {sidebarTab === 'syllabus' && <SyllabusPanel course={course} currentLessonId={lesson.id} onNavigateLesson={onNavigateLesson}/>}
                    {sidebarTab === 'notes' && <NotesPanel lesson={lesson} />}
                    {sidebarTab === 'annotations' && <AnnotationsPanel annotations={annotations} onSelectAnnotation={(id) => { /* TODO: Scroll to annotation */ }} />}
                </div>
            </div>
            {isAnnotationModalOpen && <AnnotationModal onSave={handleSaveAnnotation} onCancel={() => setAnnotationModalOpen(false)} selectedText={selection?.range.toString() || ""} setComment={setNewAnnotationComment} comment={newAnnotationComment} />}
        </div>
    );
};

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (<button onClick={onClick} className={`flex items-center py-3 px-1 border-b-2 font-semibold transition-colors ${isActive ? 'border-crimson text-crimson dark:text-red-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'}`}>{children}</button>);
const SidebarTabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (<button onClick={onClick} className={`flex-1 flex items-center justify-center py-3 font-semibold transition-colors ${isActive ? 'bg-gray-100 dark:bg-gray-700/50 text-crimson dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/20'}`}>{children}</button>);
const AnnotationModal: React.FC<{ onSave: () => void; onCancel: () => void; selectedText: string; comment: string; setComment: (c: string) => void; }> = ({ onSave, onCancel, selectedText, comment, setComment }) => (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}><div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}><h3 className="text-lg font-bold">Add Annotation</h3><p className="text-sm my-2 p-2 bg-gray-100 dark:bg-gray-700 rounded italic">"{selectedText}"</p><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Your note..." rows={4} className="w-full mt-2 p-2 border rounded dark:bg-gray-900 dark:border-gray-600 focus:border-crimson focus:ring-crimson"></textarea><div className="flex justify-end space-x-2 mt-4"><button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">Cancel</button><button onClick={onSave} className="px-4 py-2 rounded bg-crimson text-white">Save</button></div></div></div>);
const AnnotatedTranscript: React.FC<{ transcript: string; annotations: Annotation[]; onAnnotationHover: (anno: Annotation | null) => void; transcriptRef: React.RefObject<HTMLDivElement>; }> = ({ transcript, annotations, onAnnotationHover, transcriptRef }) => {
    if (annotations.length === 0) return <div ref={transcriptRef} className="p-4 sm:p-6 whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{transcript}</div>;
    
    let lastIndex = 0;
    const parts = [];
    annotations.forEach(anno => {
        if (anno.startOffset > lastIndex) parts.push(<span>{transcript.substring(lastIndex, anno.startOffset)}</span>);
        parts.push(<mark onMouseEnter={() => onAnnotationHover(anno)} onMouseLeave={() => onAnnotationHover(null)} className="bg-yellow-200 dark:bg-yellow-700/50 cursor-pointer">{transcript.substring(anno.startOffset, anno.endOffset)}</mark>);
        lastIndex = anno.endOffset;
    });
    if (lastIndex < transcript.length) parts.push(<span>{transcript.substring(lastIndex)}</span>);

    return <div ref={transcriptRef} className="p-4 sm:p-6 whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{parts.map((p, i) => React.cloneElement(p, { key: i }))}</div>;
};
const AnnotationTooltip: React.FC<{ annotation: Annotation }> = ({ annotation }) => <div className="absolute z-10 p-2 text-sm bg-black text-white rounded-md shadow-lg pointer-events-none -translate-y-full -translate-x-1/2 left-1/2 top-0" style={{ /* This needs JS to position correctly */ }}>{annotation.comment}</div>;

export default LearningView;
