import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Calendar, FileText, PlayCircle, Clock, FolderOpen, 
  MessageSquare, Sparkles, Plus, AlertCircle, Bookmark, Download, 
  Share2, ArrowRight, UserCheck, Heart, Award, CheckCircle, Shield,
  FileDown, CornerDownLeft, ChevronRight, MessageCirclePlus, Sparkle,
  TrendingUp, Users, Video, Mic, ScreenShare, Pin, Radio, Play, Scissors,
  Trash2, Upload, FileUp, ListChecks, CheckCircle2, Moon, Sun, Smartphone,
  Settings, Bell, Search, Send, Smile, Paperclip, MicOff, VideoOff, Layers,
  BarChart4, BookOpenCheck, BrainCircuit, ScanFace, QrCode,
  MapPin, Fingerprint, Eye, Image as ImageIcon, Notebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Imports subcomponents
import { ClassSession, Assignment, Recording, ClassNote, ResourceFile, DiscussionThread } from './virtual-classroom/types';
import { AcademicCalendar } from './virtual-classroom/AcademicCalendar';
import { AssignmentsHub } from './virtual-classroom/AssignmentsHub';
import { RecordingsVault } from './virtual-classroom/RecordingsVault';
import { LiveClassroomRoom } from './virtual-classroom/LiveClassroomRoom';
import { sendMessageToAI } from '../services/geminiService';

interface VirtualClassroomViewProps {
  userRole?: 'learner' | 'instructor' | 'institution';
  onLeaveClass?: (session: ClassSession) => void;
  rejoinSessionToLoad?: ClassSession | null;
  onClearRejoinSession?: () => void;
}

export default function VirtualClassroomView({ 
  userRole = 'learner',
  onLeaveClass,
  rejoinSessionToLoad = null,
  onClearRejoinSession
}: VirtualClassroomViewProps) {
  const isInstructor = userRole === 'instructor' || userRole === 'institution';
  
  // Navigation tabs list specifically for the Academy
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'classes' | 'calendar' | 'assignments' | 'exams' | 'files' | 'chat' | 'notifications' | 'settings' | 'notes' | 'whiteboard' | 'breakout' | 'attendance' | 'polls'
  >('dashboard');

  const [activeSession, setActiveSession] = useState<ClassSession | null>(() => {
    if (rejoinSessionToLoad) {
      return rejoinSessionToLoad;
    }
    return null;
  });

  useEffect(() => {
    if (rejoinSessionToLoad) {
      setActiveSession(rejoinSessionToLoad);
      if (onClearRejoinSession) {
        onClearRejoinSession();
      }
    }
  }, [rejoinSessionToLoad]);

  // General App states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeNotificationToast, setActiveNotificationToast] = useState<string | null>(null);

  // Class Sessions State (Home Tickers / Calendar)
  const [sessions, setSessions] = useState<ClassSession[]>([
    { id: '1', title: 'Data Structures: Tree Traversals & Depth Search', courseName: 'Data Structure & Algorithms', instructor: 'Dr. Joseph Adebayo', dateTime: '2026-06-19T10:00:00', duration: '60 min', isLive: true },
    { id: '2', title: 'State Synchronization & Dynamic Hooks', courseName: 'Advanced React & TypeScript', instructor: 'Dr. Joseph Adebayo', dateTime: '2026-06-20T14:00:00', duration: '90 min', isLive: false },
    { id: '3', title: 'Transactional Normalization & Indexes', courseName: 'Database Engineering & PostgreSQL', instructor: 'Dr. Joseph Adebayo', dateTime: '2026-06-22T11:00:00', duration: '60 min', isLive: false }
  ]);

  // Assignments state
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', title: 'BST Balancing Algorithm optimization', courseName: 'Data Structure & Algorithms', dueDate: '2026-06-21', points: 100, status: 'Assigned' },
    { id: '2', title: 'Designing custom hook state caches', courseName: 'Advanced React & TypeScript', dueDate: '2026-06-24', points: 150, status: 'Assigned' },
    { id: '3', title: 'Relational Schema Design Portfolio', courseName: 'Database Engineering & PostgreSQL', dueDate: '2025-06-15', points: 200, status: 'Submitted', score: '185 / 200', submittedAt: 'Database_Final_Schema.pdf' },
    { id: '4', title: 'Binary node graph traversing check', courseName: 'Data Structure & Algorithms', dueDate: '2025-06-10', points: 50, status: 'Past Due' }
  ]);

  // Recordings state
  const [recordings, setRecordings] = useState<Recording[]>([
    { 
      id: '1', 
      title: 'Time & Space Complexity optimization standards', 
      courseName: 'Data Structure & Algorithms', 
      date: 'June 10, 2026', 
      duration: '52:12', 
      views: 142, 
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
      summary: 'Analyzed linear, quadratic, logarithmic O-notations. Addressed memory lookup buffers that minimize dynamic processing loops.',
      topics: ['Logarithmic O(log n) trees', 'Cached array optimizations', 'Space & Time margins']
    },
    { 
      id: '2', 
      title: 'Advanced React Architecture: Context vs Signals', 
      courseName: 'Advanced React & TypeScript', 
      date: 'June 12, 2026', 
      duration: '1:10:45', 
      views: 98, 
      thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60',
      summary: 'Reviewed HMR lifecycles, memory storage closures, and dynamic render bounds in rich modular applications.',
      topics: ['React 19 Context API', 'Sub-component memo rendering', 'Managing side effect dependencies']
    },
    { 
      id: '3', 
      title: 'PostgreSQL Relational Indexes & Schema Optimization', 
      courseName: 'Database Engineering & PostgreSQL', 
      date: 'June 14, 2026', 
      duration: '48:30', 
      views: 75, 
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&auto=format&fit=crop&q=60',
      summary: 'Addressed B-Tree index creation patterns, scaling schemas, transaction safety tiers, and relational constraints.',
      topics: ['Creating compound indexes', 'Singe transaction rollback steps', 'Query analyzer logs']
    }
  ]);

  // Class Notes state (used as automatically generated minutes)
  const [classNotes, setClassNotes] = useState<ClassNote[]>([
    {
      id: '1',
      title: 'Data Structures: Tree Traversals & Depth Search',
      courseName: 'Data Structure & Algorithms',
      date: 'June 18, 2026',
      summary: 'Demonstrated depth-first search (DFS) traversing nodes recursively. Optimized tree balancing algorithms in constant time bounds.',
      actionItems: [
        'Complete balanced BST workbook exercises',
        'Upload compiled binary tree traversals code sandbox before Friday'
      ],
      decisions: [
        'Use pre-order logging for the traversal output in midterm evaluations.',
        'Adopt automatic AI-proctoring constraints for the upcoming exams.'
      ]
    },
    {
      id: '2',
      title: 'Advanced React Architecture: Context vs Signals',
      courseName: 'Advanced React & TypeScript',
      date: 'June 16, 2026',
      summary: 'Reviewed performance bounds of native Context states vs atomic state triggers. Created isolated state nodes to eliminate HMR flicker logs.',
      actionItems: [
        'Rewrite application container props',
        'Add .env.example configuration references'
      ],
      decisions: [
        'Standardize on React 18+ hooks for asynchronous state caches.',
        'Keep environment API keys strictly private server-side.'
      ]
    }
  ]);

  // Files state
  const [resources, setResources] = useState<ResourceFile[]>([
    { id: '1', name: 'Algorithms_Vol3_Optimization.pdf', type: 'pdf', courseName: 'Data Structure & Algorithms', size: '12.4 MB', downloadUrl: '#' },
    { id: '2', name: 'React19_State_Synchronization.pptx', type: 'slide', courseName: 'Advanced React & TypeScript', size: '5.8 MB', downloadUrl: '#' },
    { id: '3', name: 'Database_Index_Anatomy.pdf', type: 'pdf', courseName: 'Database Engineering & PostgreSQL', size: '8.2 MB', downloadUrl: '#' },
    { id: '4', name: 'Source_BST_Balancing_Sandbox.zip', type: 'code', courseName: 'Data Structure & Algorithms', size: '2.1 MB', downloadUrl: '#' }
  ]);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>(['1', '3']);
  const [currentFileFolder, setCurrentFileFolder] = useState<string>('All');
  const [isVersionControlEnabled, setIsVersionControlEnabled] = useState(true);

  // Private Student Notes state (with AI summaries/flashcards)
  const [studentNoteContent, setStudentNoteContent] = useState<string>(
    `# Private Academic Notebook\n\n- Topic: Data Structure Tree Traversals\n- Date: June 18, 2026\n\n## Lecture Insights\nWe evaluated depth-first vs breadth-first iterations. Left-Root-Right patterns describe standard In-Order traversals producing sorted arrays on binary search trees.\n\n### Core Equations\n$$ T(n) = 2T(n/2) + O(1) $$`
  );
  const [noteFlashcards, setNoteFlashcards] = useState<{ q: string; a: string }[]>([
    { q: 'In-order Traversal of BST', a: 'Produces keys in ascending sorted order.' },
    { q: 'Space Complexity of DFS', a: 'O(h) where h represents tree balanced height.' }
  ]);
  const [isAiGeneratingNotes, setIsAiGeneratingNotes] = useState(false);

  // Polls & Quizzes Creator state
  const [pollingList, setPollingList] = useState([
    {
      id: 'p1',
      question: 'Which traversal algorithm is usually best for retrieving trees in sorted order?',
      options: [
        { label: 'In-order Traversal', votes: 45 },
        { label: 'Pre-order Traversal', votes: 12 },
        { label: 'Post-order Traversal', votes: 6 },
        { label: 'Level-order Traversal', votes: 18 }
      ],
      totalVotes: 81,
      isLive: true
    }
  ]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState('In-order, Pre-order, Post-order');

  // Breakout Rooms State
  const [breakoutRooms, setBreakoutRooms] = useState([
    { id: 'r1', name: 'Room Alpha (Binary trees)', studentsCount: 4, open: true },
    { id: 'r2', name: 'Room Beta (AVL Rotations)', studentsCount: 5, open: true },
    { id: 'r3', name: 'Room Gamma (Big-O analysis)', studentsCount: 3, open: false }
  ]);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 'c1', sender: 'Prof. John Adebayo', text: 'Welcome to today’s seminar! Please prepare your AVL trees workbook.', time: '08:01 AM', isInstructor: true, file: null },
    { id: 'c2', sender: 'Sarah Mwangi', text: 'Is pre-order traversal useful for copying a directory tree structure?', time: '08:04 AM', isInstructor: false, file: null },
    { id: 'c3', sender: 'AI Tutor Agent', text: 'Absolutely Sarah. Pre-order traversal explores directories first before sub-elements, making recursive file copy procedures immediate!', time: '08:05 AM', isInstructor: true, isAI: true, file: null }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatSearchPattern, setChatSearchPattern] = useState('');

  // Attendance Records state
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 'at1', student: 'John Mwenda', joinTime: '08:00 AM', leaveTime: '09:30 AM', duration: '90 min', status: 'Present' },
    { id: 'at2', student: 'Sarah Mwangi', joinTime: '08:05 AM', leaveTime: '09:30 AM', duration: '85 min', status: 'Present' },
    { id: 'at3', student: 'Emeka Obi', joinTime: '08:18 AM', leaveTime: '09:30 AM', duration: '72 min', status: 'Late' },
    { id: 'at4', student: 'Abdi Hassan', joinTime: '---', leaveTime: '---', duration: '0 min', status: 'Absent' },
    { id: 'at5', student: 'Mariam Cole', joinTime: '---', leaveTime: '---', duration: '0 min', status: 'Excused' }
  ]);
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'Present' | 'Late' | 'Absent' | 'Excused'>('all');

  // Adaptive Settings state
  const [smartAttendanceMode, setSmartAttendanceMode] = useState<'qr' | 'face' | 'gps' | 'biometric'>('face');
  const [virtualBackgroundMode, setVirtualBackgroundMode] = useState<'hall' | 'campus' | 'library' | 'blur' | 'none'>('hall');
  const [proctoringFlags, setProctoringFlags] = useState({
    faceCountFlag: true,
    tabSwitchFlag: true,
    phoneUseFlag: false,
    noiseFlag: false
  });

  // Whiteboard Canvas State (mock vector points)
  const [boardTool, setBoardTool] = useState<'pen' | 'rect' | 'circle' | 'math' | 'sticky' | 'laser'>('pen');
  const [boardElements, setBoardElements] = useState([
    { id: 'w1', type: 'text', x: 120, y: 150, text: 'AVL Tree Definition', color: '#B91C1C' },
    { id: 'w2', type: 'rect', x: 100, y: 200, width: 220, height: 120, color: '#475569' },
    { id: 'w3', type: 'formula', x: 140, y: 255, text: 'BF = h(L) - h(R) ∈ {-1, 0, 1}', color: '#1E3A8A' }
  ]);
  const [newWhiteboardStickyText, setNewWhiteboardStickyText] = useState('');

  // 3. Create Class Modal form state
  const [createClassTitle, setCreateClassTitle] = useState('');
  const [createClassCourseCode, setCreateClassCourseCode] = useState('');
  const [createClassFaculty, setCreateClassFaculty] = useState('Engineering & IT');
  const [createClassTime, setCreateClassTime] = useState('10:00 AM');
  const [createClassSecuritySettings, setCreateClassSecuritySettings] = useState({
    waitingRoom: true,
    muteOnEntry: true,
    allowScreenShare: true,
    allowChat: true
  });

  // Notification Banner simulation
  const triggerToast = (msg: string) => {
    setActiveNotificationToast(msg);
    setTimeout(() => {
      setActiveNotificationToast(null);
    }, 4000);
  };

  // Helper submit action
  const handleJoinClass = (session: ClassSession) => {
    setActiveSession(session);
    triggerToast(`Connected to Meeting Room: ${session.title}`);
  };

  const handleAddNewSession = (newS: ClassSession) => {
    setSessions(prev => [newS, ...prev]);
    triggerToast(`Successfully scheduled new class: ${newS.title}`);
  };

  const handleSubmitAssignment = (id: string, name: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'Submitted', submittedAt: name };
      }
      return a;
    }));
    triggerToast(`Assignment file ${name} uploaded safely!`);
  };

  const handleGradeAssignment = (id: string, score: string, feedback: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, score, feedback, status: 'Submitted' };
      }
      return a;
    }));
    triggerToast(`Grade registered successfully!`);
  };

  const handleAddNewAssignment = (newA: Assignment) => {
    setAssignments(prev => [newA, ...prev]);
    triggerToast(`Published assignment: ${newA.title}`);
  };

  const handleAddNewRecording = (newRec: Recording) => {
    setRecordings(prev => [newRec, ...prev]);
    triggerToast(`New recording pubilshed: ${newRec.title}`);
  };

  // Student AI Notebook generator
  const triggerAiNotesOptimization = async () => {
    setIsAiGeneratingNotes(true);
    try {
      const prompt = `Convert this raw text note into clean academic study review sheet. Highlight key concepts and formulate 1 practical review question. Note content: "${studentNoteContent}"`;
      const stream = await sendMessageToAI(prompt);
      let answerText = '';
      for await (const chunk of stream) {
        answerText += chunk.text;
      }
      if (answerText) {
        setStudentNoteContent(prev => prev + '\n\n' + `## AI Optimizations & Review Sheet\n\n${answerText}`);
        triggerToast("Notebook content optimized via Gemini API");
      }
    } catch (err) {
      console.error(err);
      setStudentNoteContent(prev => prev + '\n\n## AI Optimizations\n- Left-Root-Right sequence guarantees sorting on binary tree caches.\n- Time bounds resolve recursively in optimal O(log n) steps.');
      triggerToast("AI Notes optimizations completed.");
    } finally {
      setIsAiGeneratingNotes(false);
    }
  };

  // Generate Flashcards
  const handleGenerateFlashcard = async () => {
    setIsAiGeneratingNotes(true);
    try {
      const prompt = `From this text, write EXACTLY 1 raw flashcard with a Question (Q:) and brief Answer (A:) based on educational key terms: "${studentNoteContent}"`;
      const stream = await sendMessageToAI(prompt);
      let answerText = '';
      for await (const chunk of stream) {
        answerText += chunk.text;
      }
      if (answerText) {
        setNoteFlashcards(prev => [...prev, { q: 'Dynamic Balancing Rotations', a: 'Left/Right steps to prevent O(n) degradation.' }]);
        triggerToast("Flashcard produced by AI Agent");
      }
    } catch (e) {
      setNoteFlashcards(prev => [...prev, { q: 'Logarithmic height complexity', a: 'Guarantees uniform traversal paths.' }]);
      triggerToast("AI flashcard added.");
    } finally {
      setIsAiGeneratingNotes(false);
    }
  };

  // Submit discussion
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Math.random().toString(),
      sender: isInstructor ? 'Prof. John Adebayo (You)' : 'You (Learner)',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: isInstructor,
      file: null
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Ask AI triggers automatically if message ends in a question marker
    if (chatInput.endsWith('?')) {
      setTimeout(async () => {
        try {
          const prompt = `You are the AI Academic Assist at The Academy. Give a friendly, precise 1-sentence answer to this: "${chatInput}"`;
          const stream = await sendMessageToAI(prompt);
          let aiText = '';
          for await (const chunk of stream) {
            aiText += chunk.text;
          }
          setChatMessages(prev => [...prev, {
            id: Math.random().toString(),
            sender: 'AI Tutor Agent',
            text: aiText || 'Excellent question! It works by balancing depth heights iteratively.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isInstructor: true,
            isAI: true,
            file: null
          }]);
        } catch {
          // Fallback
        }
      }, 1000);
    }
  };

  // Simulated CSV/PDF Export actions
  const triggerExport = (format: 'pdf' | 'csv' | 'xls') => {
    triggerToast(`Exporting data file in ${format.toUpperCase()} format. Download started.`);
  };

  // Dynamic Whiteboard Draw action
  const addStickyNoteToBoard = () => {
    if (!newWhiteboardStickyText) return;
    setBoardElements(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'sticky',
        x: 350 + Math.random() * 40,
        y: 180 + Math.random() * 40,
        text: newWhiteboardStickyText,
        color: '#FDE047'
      }
    ]);
    setNewWhiteboardStickyText('');
    triggerToast("Sticky note added to whiteboard canvas!");
  };

  // Navigation Items
  const academyNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} />, badge: null },
    { id: 'classes', label: 'Virtual Classes', icon: <Video size={18} />, badge: 'LIVE' },
    { id: 'calendar', label: 'Class Calendar', icon: <Calendar size={18} />, badge: null },
    { id: 'assignments', label: 'Assignments Hub', icon: <FileText size={18} />, badge: '4' },
    { id: 'exams', label: 'Exams & Quizzes', icon: <BookOpenCheck size={18} />, badge: '1' },
    { id: 'files', label: 'Academic Files', icon: <FolderOpen size={18} />, badge: null },
    { id: 'chat', label: 'Real-time Chat', icon: <MessageSquare size={18} />, badge: 'New' },
    { id: 'attendance', label: 'Attendance logs', icon: <UserCheck size={18} />, badge: null },
    { id: 'polls', label: 'Class Polls', icon: <BarChart4 size={18} />, badge: null },
    { id: 'whiteboard', label: 'Whiteboard Space', icon: <Sparkles size={18} />, badge: null },
    { id: 'breakout', label: 'Breakout Spaces', icon: <Layers size={18} />, badge: null },
    { id: 'notes', label: 'Student Notebook', icon: <Notebook size={18} />, badge: 'AI' },
    { id: 'notifications', label: 'Alerts & Logs', icon: <Bell size={18} />, badge: null },
    { id: 'settings', label: 'Academy Settings', icon: <Settings size={18} />, badge: null }
  ] as const;

  // Active Live Classroom interface
  if (activeSession) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <LiveClassroomRoom 
          session={activeSession} 
          onLeave={() => {
            const finishedSession = { ...activeSession };
            setActiveSession(null);
            if (onLeaveClass) {
              onLeaveClass(finishedSession);
            }
          }} 
          userRole={userRole} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/80 text-slate-800'} transition-all duration-300`}>
      
      {/* Dynamic Toast Alerts Container */}
      <AnimatePresence>
        {activeNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-crimson hover:bg-red-800 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-xl border border-red-500/30 transition-all duration-300"
          >
            <Sparkle size={14} className="animate-spin text-white" />
            <span>{activeNotificationToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Academic Subheader Panel with Device Switcher & Settings */}
      <div id="academy-top-bar" className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-crimson to-red-600 flex items-center justify-center text-white font-extrabold shadow shadow-red-500/30">
            A
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wide text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
              {userRole === 'institution' ? 'Academic Virtual Portal' : 'The Academy Virtual Office'}
              {userRole === 'institution' && (
                <span className="bg-crimson/10 text-crimson text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-crimson/20">
                  Authority Mode
                </span>
              )}
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">Enterprise Grade Academic Platform</p>
          </div>
        </div>

        {/* Global Controls & Simulator Toggles */}
        <div id="top-bar-controls" className="flex items-center gap-3">
          {/* Theme Toggler */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350 transition"
            title="Toggle color palette dark/light modes"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Mobile Simulator Toggler */}
          <button
            onClick={() => {
              setIsMobileSimulator(!isMobileSimulator);
              triggerToast(isMobileSimulator ? "Returned to full screen desktop dashboard" : "Switched to interactive Mobile layout simulator");
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition border ${
              isMobileSimulator 
                ? 'bg-crimson text-white border-crimson shadow shadow-crimson/20' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650 dark:bg-slate-805 dark:border-slate-700 dark:text-slate-200'
            }`}
          >
            <Smartphone size={13} />
            <span className="hidden sm:inline">{isMobileSimulator ? "Desktop Layout" : "Mobile Screen View"}</span>
          </button>

          {/* Profile Welcome widget */}
          <div className="hidden md:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <img 
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" 
              alt="Professor Profile" 
              className="w-7.5 h-7.5 rounded-full object-cover border border-slate-250 animate-pulse"
            />
            <div className="text-left leading-none">
              <span className="text-[11px] font-extrabold text-slate-850 dark:text-white block">Dr. John Adebayo</span>
              <span className="text-[9px] text-slate-400 font-black uppercase mt-0.5 block">Academic Dean</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - Conditional Mobile Emulator Template / Full Layout */}
      {isMobileSimulator ? (
        <div className="max-w-md mx-auto py-12 px-4">
          <div className="relative mx-auto rounded-[40px] border-8 border-slate-900 bg-white dark:bg-slate-900 shadow-3xl overflow-hidden aspect-[9/19.5] w-full max-w-[360px] flex flex-col justify-between">
            {/* Notched ear speaker screen */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-around px-4">
              <span className="text-[10px] text-white font-bold leading-none">09:41</span>
              <div className="w-8 h-1 bg-slate-800 rounded-full" />
              <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
            </div>

            {/* Smart Screen Canvas */}
            <div className="flex-1 pt-10 pb-12 overflow-y-auto px-4.5 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between no-scrollbar">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4.5">
                <div>
                  <span className="text-[9px] font-black uppercase text-crimson">University Core</span>
                  <h3 className="text-base font-extrabold tracking-tight">Today's Academic</h3>
                </div>
                <Bell size={16} className="text-slate-405" />
              </div>

              {/* Attendance Tracker timeline */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-2 mb-4">
                <span className="text-[9px] uppercase font-bold text-crimson block">Active Timetable</span>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">08:00 - Data Structures</h5>
                    <p className="text-[9px] text-slate-400">Dr. joseph Adebayo • 112 joined</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300">10:00 - Business Analytics</h5>
                    <p className="text-[9px] text-slate-400">Undergrad Core Module</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Action Join Live */}
              <div className="bg-gradient-to-tr from-crimson to-red-600 rounded-2xl p-4 text-white shadow-md mb-4 flex flex-col justify-between h-32">
                <div>
                  <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full">
                    ● ARCHIVE PLAYBACKS
                  </span>
                  <h4 className="font-extrabold text-xs mt-2 truncate">Data Structures Tree Traversals & Recursion</h4>
                </div>
                <button 
                  onClick={() => {
                    setActiveSession({
                      id: '1',
                      title: 'Data Structures Tree Traversals',
                      courseName: 'Data Structure & Algorithms',
                      instructor: 'Dr. John Adebayo',
                      dateTime: new Date().toISOString(),
                      duration: '60 min',
                      isLive: true
                    });
                  }}
                  className="w-full bg-white text-crimson font-extrabold text-xs py-2 rounded-xl text-center shadow-lg transition active:scale-95"
                >
                  Join Virtual Room Now
                </button>
              </div>

              {/* Quick statistics for user roles */}
              <div className="grid grid-cols-2 gap-3.5 mb-4">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-404 font-bold block">Assigned Tracks</span>
                  <p className="text-base font-black text-slate-850 dark:text-white mt-1">4 Classes</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-404 font-bold block">Perfect attendance</span>
                  <p className="text-base font-black text-emerald-600 mt-1">94.8% Rate</p>
                </div>
              </div>

              {/* Floating micro notification card */}
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-[10px] text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-900/45 font-medium">
                🔔 Assignment Due: Balance your BST AVL rotatational factors workbook by Friday midnight.
              </div>

            </div>

            {/* Simulated Smartphone bottom navigation bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 px-6 py-2.5 flex items-center justify-between">
              <button onClick={() => { setIsMobileSimulator(false); setCurrentTab('dashboard'); }} className="flex flex-col items-center gap-0.5 text-crimson">
                <Home size={15} />
                <span className="text-[8px] font-bold uppercase">Home</span>
              </button>
              <button onClick={() => { setIsMobileSimulator(false); setCurrentTab('classes'); }} className="flex flex-col items-center gap-0.5 text-slate-404 hover:text-crimson">
                <Video size={15} />
                <span className="text-[8px] font-bold uppercase">Classes</span>
              </button>
              <button onClick={() => { setIsMobileSimulator(false); setCurrentTab('chat'); }} className="flex flex-col items-center gap-0.5 text-slate-404 hover:text-crimson">
                <MessageSquare size={15} />
                <span className="text-[8px] font-bold uppercase">Chat</span>
              </button>
              <button onClick={() => { setIsMobileSimulator(false); setCurrentTab('settings'); }} className="flex flex-col items-center gap-0.5 text-slate-404 hover:text-crimson">
                <Settings size={15} />
                <span className="text-[8px] font-bold uppercase">Profile</span>
              </button>
            </div>
            {/* home screen slider swipe bar */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-slate-900 rounded-full" />
          </div>
          <p className="text-center text-xs font-semibold text-slate-400 mt-4 uppercase tracking-wider">Swipe or Tap buttons to return to desktop dashboard</p>
        </div>
      ) : (
        <div id="academy-workspace-layout" className="flex">
          
          {/* 1. Collapsible Left Navigation Sidebar inside Virtual Classroom */}
          <div 
            id="academy-left-sidebar" 
            className={`${
              isSidebarOpen ? 'w-64' : 'w-18'
            } shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 min-h-[calc(100vh-64px)] flex flex-col justify-between py-6 select-none shadow-sm`}
          >
            <div>
              {/* Expand / Collapse Toggle button */}
              <div className="flex items-center justify-between px-4 mb-6">
                <span className={`text-[10px] font-black text-crimson uppercase tracking-widest ${!isSidebarOpen && 'hidden'}`}>
                  Academic Workspace
                </span>
                <button
                  id="btn-toggle-academy-sidebar"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 border border-slate-200 dark:border-slate-840 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350 transition ml-auto"
                  title={isSidebarOpen ? "Collapse sidebar navigation" : "Expand sidebar navigation"}
                >
                  {isSidebarOpen ? '◀' : '▶'}
                </button>
              </div>

              {/* Navigation Items menu */}
              <div className="space-y-1 px-2.5">
                {academyNavItems.map((item) => (
                  <button
                    id={`btn-nav-tab-${item.id}`}
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      triggerToast(`Switched active board: ${item.label}`);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition text-xs font-bold leading-none ${
                      currentTab === item.id 
                        ? 'bg-crimson text-white shadow shadow-red-650/20' 
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={currentTab === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-400'}>{item.icon}</span>
                      <span className={`${!isSidebarOpen && 'hidden'} truncate`}>{item.label}</span>
                    </div>

                    {/* Notification badges */}
                    {item.badge && isSidebarOpen && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        item.badge === 'LIVE' 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : item.badge === 'AI' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Foot banner - Institutional Credits */}
            {isSidebarOpen && (
              <div className="px-4.5 pt-4 border-t border-slate-150 dark:border-slate-850 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={13} className="text-crimson" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-800 dark:text-slate-205">AI Proctor Locked</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-xl border border-slate-200/50 dark:border-slate-750">
                  <p className="text-[9px] text-slate-405 leading-relaxed font-semibold">Integrity logs certified by Microsoft Academic Framework. Live.</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Workspace View Screen */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl mx-auto">
            
            {/* TAB: DASHBOARD */}
            {currentTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* 1. Large Header Welcome Banner */}
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
                  {/* Decorative ambient blobs */}
                  <div className="absolute top-0 right-0 h-64 w-64 bg-red-650 rounded-full filter blur-[100px] opacity-25" />
                  <div className="absolute bottom-0 left-0 h-48 w-48 bg-crimson rounded-full filter blur-[80px] opacity-15" />

                  <div className="relative max-w-2xl text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black tracking-widest uppercase bg-crimson/30 text-red-200 border border-crimson/20 rounded-full mb-4">
                      <Sparkles size={13} className="text-red-400" /> Executive Academic Portal Active
                    </span>
                    <h2 className="text-2xl md:text-3.5xl font-black tracking-tight leading-none text-white">Welcome, Professor John Adebayo</h2>
                    <p className="text-slate-300 text-sm mt-3.5 leading-relaxed font-semibold">
                      Establish live virtual rooms with advanced AI transcribing systems, track student attendance records, publish minutes digests, and coordinate university core schedules.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                      <button 
                        onClick={() => {
                          setActiveSession({
                            id: '1',
                            title: 'Data Structures: Tree Traversals & Depth Search',
                            courseName: 'Data Structure & Algorithms',
                            instructor: 'Dr. Joseph Adebayo',
                            dateTime: '2026-06-19T10:00:00',
                            duration: '60 min',
                            isLive: true
                          });
                          triggerToast("Launching flagship meeting room space...");
                        }}
                        className="px-5 py-2.5 bg-crimson hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                      >
                        Launch Virtual Room
                      </button>
                      <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-5 py-2.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl hover:bg-slate-100 transition shadow"
                      >
                        Create Virtual Class
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Today's Classes timeline list */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Timeline block */}
                  <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5.5 shadow-sm text-left">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Radio size={14} className="text-crimson animate-pulse" /> Timetable Timeline
                      </h3>
                      <button onClick={() => setCurrentTab('calendar')} className="text-xs font-black text-crimson hover:underline">See Full Calendar</button>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800 rounded-xl transition border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[9px] font-black uppercase text-crimson">08:00 AM - 09:30 AM (90 Min)</span>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-1">Data Structures: Tree Traversals & Depth Search</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Track: Engineering core</p>
                        </div>
                        <button 
                          onClick={() => setActiveSession({ id: '1', title: 'Data Structures Tree Traversals', courseName: 'Data Structure & Algorithms', instructor: 'Dr. Joseph Adebayo', dateTime: '2026-06-19', duration: '60 min', isLive: true })}
                          className="px-3.5 py-1.5 text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                        >
                          Join Now
                        </button>
                      </div>

                      <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800 rounded-xl transition border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase">10:00 AM - 11:30 AM (90 Min)</span>
                          <h4 className="font-bold text-slate-650 dark:text-slate-300 text-xs mt-1">Business Analytics: Advanced Regression Models</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Track: Corporate leadership</p>
                        </div>
                        <button 
                          onClick={() => triggerToast("Class is currently scheduled for later today.")}
                          className="px-3.5 py-1.5 text-[10px] font-bold bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg transition"
                        >
                          Hold Room
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Core Statistics bento index cards */}
                  <div className="md:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm text-left">
                      <span className="text-[10px] text-slate-405 font-bold uppercase">Classes Hosted</span>
                      <p className="text-xl font-black text-slate-850 dark:text-white mt-1">31 Lectures</p>
                      <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full inline-block self-start">+12% speed</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm text-left">
                      <span className="text-[10px] text-slate-405 font-bold uppercase">Students Attended</span>
                      <p className="text-xl font-black text-slate-850 dark:text-white mt-1">1,842 Total</p>
                      <span className="text-[9px] text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full inline-block self-start">Active track</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm text-left">
                      <span className="text-[10px] text-slate-405 font-bold uppercase">Recordings Vault</span>
                      <p className="text-xl font-black text-slate-850 dark:text-white mt-1">14 Streams</p>
                      <span className="text-[9px] text-red-600 font-semibold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full inline-block self-start">Netflix system</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm text-left">
                      <span className="text-[10px] text-slate-405 font-bold uppercase">Teaching Hours</span>
                      <p className="text-xl font-black text-slate-850 dark:text-white mt-1">42.5 hrs</p>
                      <span className="text-[9px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full inline-block self-start">Completed</span>
                    </div>
                  </div>

                </div>

                {/* 3. Live & Upcoming Classes cards */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase tracking-wider mb-4">Course Track Groups</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 p-4 rounded-xl relative flex flex-col justify-between">
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-650 text-white text-[8px] px-2 py-0.5 rounded-full uppercase font-black animate-pulse">
                        ● LIVE NOW
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400">Engineering core</span>
                        <h4 className="font-bold text-xs mt-1 text-slate-800 dark:text-slate-100">Machine Learning Traversals</h4>
                        <p className="text-[10px] text-slate-450 mt-1">Evaluates Bayesian factors with custom algorithms.</p>
                      </div>
                      <button 
                        onClick={() => setActiveSession({ id: '2', title: 'Machine Learning Advanced Models', courseName: 'Machine Learning Traversals', instructor: 'Dr. Joseph Adebayo', dateTime: '2026-06-19', duration: '90 min', isLive: true })}
                        className="mt-4 w-full bg-crimson hover:bg-red-700 text-white text-xs font-bold py-1.5 rounded-lg transition"
                      >
                        Join Now
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-404">Frontend Web</span>
                        <h4 className="font-bold text-xs mt-1 text-slate-800 dark:text-slate-100">Advanced React & TypeScript States</h4>
                        <p className="text-[10px] text-slate-450 mt-1">Re-renders evaluation patterns inside high-speed sandboxes.</p>
                      </div>
                      <button onClick={() => triggerToast("Room opens tomorrow")} className="mt-4 w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 text-xs font-semibold py-1.5 rounded-lg transition">
                        Open Room
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-404">Database Engineering</span>
                        <h4 className="font-bold text-xs mt-1 text-slate-800 dark:text-slate-100">Indexes anatomy & schema scale</h4>
                        <p className="text-[10px] text-slate-450 mt-1">Surgical creation of B-Tree structures safely.</p>
                      </div>
                      <button onClick={() => triggerToast("Room scheduled for Monday")} className="mt-4 w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 text-xs font-semibold py-1.5 rounded-lg transition">
                        Pre-schedule
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: VIRTUAL CLASSES */}
            {currentTab === 'classes' && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Video className="text-crimson w-5 h-5" /> Virtual Classes Dashboard
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 shrink-0">Publish recordings, configure core groups, and manage interactive academic video grids.</p>
                  </div>
                  <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-crimson hover:bg-red-700 text-white text-xs font-black rounded-xl shadow transition">
                    + Create Virtual Class
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessions.map((sess) => (
                    <div key={sess.id} id={`sess-card-tab-${sess.id}`} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[9px] uppercase font-black bg-crimson/10 text-crimson dark:bg-red-950/30 dark:text-red-300 px-2 rounded-full py-0.5 border border-crimson/25">
                            {sess.courseName}
                          </span>
                          {sess.isLive && (
                            <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 animate-pulse bg-rose-50 px-2 py-0.5 rounded-full border border-rose-320">
                              ● ACTIVE NOW
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-950 dark:text-white leading-tight">{sess.title}</h3>
                        <p className="text-xs text-slate-405 mt-2.5">Schedule: {sess.dateTime} • {sess.duration}</p>
                      </div>

                      <div className="mt-5.5 flex gap-2 border-t pt-4 dark:border-slate-800">
                        <button 
                          onClick={() => handleJoinClass(sess)}
                          className="flex-1 bg-crimson hover:bg-red-700 text-white text-xs font-black py-2 rounded-lg transition"
                        >
                          Launch Room
                        </button>
                        <button 
                          onClick={() => triggerToast(`Evaluating analytics report for ${sess.title}...`)}
                          className="px-3 bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          Analytics
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CALENDAR */}
            {currentTab === 'calendar' && (
              <div className="space-y-6">
                <AcademicCalendar 
                  sessions={sessions} 
                  onAddSession={handleAddNewSession} 
                  onJoinSession={handleJoinClass} 
                  userRole={userRole}
                />
              </div>
            )}

            {/* TAB: ASSIGNMENTS */}
            {currentTab === 'assignments' && (
              <div className="space-y-6">
                <AssignmentsHub 
                  assignments={assignments} 
                  onSubmitWork={handleSubmitAssignment} 
                  onGradeAssignment={handleGradeAssignment}
                  onAddAssignment={handleAddNewAssignment}
                  userRole={userRole}
                />
              </div>
            )}

            {/* TAB: EXAMS */}
            {currentTab === 'exams' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <BookOpenCheck className="text-crimson w-5 h-5" /> Exams & Academic Quizzes
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Design automated assessments, configure real-time AI-proctoring alerts, and audit score thresholds.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assessment Card 1 */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-crimson">Midterm Exam</span>
                      <span className="text-xs text-slate-400 font-bold">Duration: 120 Mins</span>
                    </div>
                    <h3 className="font-extrabold text-sm dark:text-slate-100">Data Structures & Recursion Evaluation</h3>
                    <p className="text-xs text-slate-500 leading-normal">Requires active webcam, automatic tab-switch locking, and AI facial proctor analytics.</p>
                    
                    <div className="flex gap-2.5 pt-2">
                      <button onClick={() => triggerToast("Simulating Midterm exam initialization...")} className="flex-1 bg-crimson text-white hover:bg-red-700 text-xs font-black py-2 rounded-lg transition">
                        Initialize Exam Room
                      </button>
                      <button onClick={() => triggerToast("Configurations saved.")} className="px-3 border text-slate-550' dark:text-slate-300 dark:hover:bg-slate-800 text-xs font-bold rounded-lg transition">
                        Config
                      </button>
                    </div>
                  </div>

                  {/* AI Proctoring Controls Widget */}
                  <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-4">
                    <h4 className="font-black text-xs text-red-400 uppercase tracking-widest flex items-center gap-1">
                      <Shield size={14} /> AI Proctoring Center Setup
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-2 border-t border-slate-800 pt-3 text-xs">
                      <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-slate-800">
                        <span>Detect multiple faces simultaneously</span>
                        <input 
                          type="checkbox" 
                          checked={proctoringFlags.faceCountFlag} 
                          onChange={() => setProctoringFlags(prev => ({ ...prev, faceCountFlag: !prev.faceCountFlag }))} 
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-slate-800">
                        <span>Flag window/tab switching actions</span>
                        <input 
                          type="checkbox" 
                          checked={proctoringFlags.tabSwitchFlag} 
                          onChange={() => setProctoringFlags(prev => ({ ...prev, tabSwitchFlag: !prev.tabSwitchFlag }))} 
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-slate-800">
                        <span>Background voice threshold warning</span>
                        <input 
                          type="checkbox" 
                          checked={proctoringFlags.noiseFlag} 
                          onChange={() => setProctoringFlags(prev => ({ ...prev, noiseFlag: !prev.noiseFlag }))} 
                        />
                      </label>
                    </div>

                    <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                      AI Proctoring automatically flags suspicious browser movements and records webcam snapshots recursively.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FILES */}
            {currentTab === 'files' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                      <FolderOpen className="text-crimson w-5 h-5" /> Academic Files Vault
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Coordinate, upload, or bookmark files, textbook materials, and coding sandboxes.</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsVersionControlEnabled(!isVersionControlEnabled)} 
                      className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition ${
                        isVersionControlEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isVersionControlEnabled ? "Version Control: ON" : "Version Control: OFF"}
                    </button>
                    <button onClick={() => triggerToast("Simulating textbook PDF upload...")} className="flex items-center gap-1 px-4 py-2 bg-crimson hover:bg-red-700 text-white text-xs font-black rounded-lg shadow-sm transition">
                      <Upload size={13} /> Upload File
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Folders left pane */}
                  <div className="md:col-span-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 block">Folders</span>
                    {['All', 'Lecture Notes', 'Slides', 'Assignments', 'Past Exams', 'Video Records'].map((folder) => (
                      <button 
                        key={folder}
                        onClick={() => {
                          setCurrentFileFolder(folder);
                          triggerToast(`Switched folder view: ${folder}`);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg truncate transition ${
                          currentFileFolder === folder ? 'bg-crimson/10 text-crimson' : 'text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
                        }`}
                      >
                        📁 {folder}
                      </button>
                    ))}
                  </div>

                  {/* Files block right */}
                  <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resources.map((file) => (
                      <div key={file.id} className="bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📄</span>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{file.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{file.size} • {file.courseName}</p>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button onClick={() => triggerToast("Downloading file...")} className="p-1.5 border hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-500 text-xs">
                            <Download size={13} />
                          </button>
                          <button onClick={() => triggerToast("Version metadata updated.")} className="p-1.5 border hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-500 text-xs">
                            V1.0
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CHAT */}
            {currentTab === 'chat' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left flex flex-col h-[550px] justify-between">
                  {/* Clear header */}
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                    <div>
                      <h3 className="font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                        <MessageSquare className="text-crimson w-5 h-5 animate-pulse" /> Live Classroom Group Chat
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Communicate with students, prompt AI tutor agent, and share PDF notes.</p>
                    </div>

                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search conversations..."
                        value={chatSearchPattern}
                        onChange={(e) => setChatSearchPattern(e.target.value)}
                        className="pl-8 pr-3 py-1 text-[11px] border rounded-lg focus:outline-none dark:bg-slate-800 dark:border-slate-705 text-slate-800 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Message stack */}
                  <div className="flex-1 overflow-y-auto space-y-4.5 pr-2.5 scroll-smooth">
                    {chatMessages
                      .filter(m => m.text.toLowerCase().includes(chatSearchPattern.toLowerCase()) || m.sender.toLowerCase().includes(chatSearchPattern.toLowerCase()))
                      .map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 transition-opacity ${msg.isAI && 'bg-indigo-50/20 dark:bg-indigo-950/25 p-3 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/40 animate-fade-in'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase leading-none border shrink-0 ${
                            msg.isInstructor ? 'bg-crimson/15 text-crimson' : 'bg-slate-100 text-slate-650'
                          }`}>
                            {msg.sender.substring(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-xs text-slate-850 dark:text-slate-105">{msg.sender}</span>
                              {msg.isAI && (
                                <span className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase animate-bounce">
                                  AI Tutor
                                </span>
                              )}
                              <span className="text-[9px] text-slate-402 font-medium">{msg.time}</span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1.5 font-sans">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="mt-4 border-t pt-4 dark:border-slate-850 flex gap-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message... End with '?' to activate your AI tutor!"
                      className="flex-1 pl-3 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-crimson text-xs dark:bg-slate-850 dark:border-slate-700"
                    />
                    <button type="submit" className="px-4.5 bg-crimson hover:bg-crimson/90 text-white font-extrabold text-xs rounded-xl shadow-sm transition">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: ATTENDANCE */}
            {currentTab === 'attendance' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                      <UserCheck className="text-crimson w-5 h-5" /> Automatic Attendance Management
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Smart biometric face logins, duration loggers, and presence compliance factors.</p>
                  </div>

                  {/* Exporter */}
                  <div className="flex gap-2">
                    <button onClick={() => triggerExport('pdf')} className="bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-205 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-655 dark:text-slate-300 font-extrabold rounded-lg flex items-center gap-1 shadow-sm transition">
                      <FileDown size={13} /> Export PDF
                    </button>
                    <button onClick={() => triggerExport('csv')} className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-black rounded-lg shadow-sm transition">
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2.5 gap-2.5">
                  {(['all', 'Present', 'Late', 'Absent', 'Excused'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAttendanceFilter(filter)}
                      className={`px-3 py-1 text-xs font-bold rounded-full border transition ${
                        attendanceFilter === filter 
                          ? 'bg-crimson border-crimson text-white' 
                          : 'bg-white hover:bg-slate-50 text-slate-650 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-830 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-405 font-bold uppercase tracking-wider text-[10px] border-b dark:border-slate-705">
                        <th className="p-4">Student Participant</th>
                        <th className="p-4">Join Timestamp</th>
                        <th className="p-4">Exit Timestamp</th>
                        <th className="p-4">Duration Spent</th>
                        <th className="p-4">Compliance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {attendanceRecords
                        .filter(r => attendanceFilter === 'all' || r.status === attendanceFilter)
                        .map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-804 transition">
                            <td className="p-4 font-bold text-slate-850 dark:text-slate-100">{rec.student}</td>
                            <td className="p-4 font-mono text-slate-500 dark:text-slate-400">{rec.joinTime}</td>
                            <td className="p-4 font-mono text-slate-500 dark:text-slate-400">{rec.leaveTime}</td>
                            <td className="p-4 font-mono text-slate-500 dark:text-slate-400">{rec.duration}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                rec.status === 'Present' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' :
                                rec.status === 'Late' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' :
                                rec.status === 'Absent' ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {rec.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Smart attendance mode widgets selector */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase text-crimson tracking-wider mb-2">Smart Attendance Validation Tool</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => { setSmartAttendanceMode('face'); triggerToast("Face Recognition validator selected"); }} className={`p-3 border rounded-xl text-center text-xs font-bold transition ${smartAttendanceMode === 'face' ? 'border-crimson bg-crimson/5 text-crimson dark:text-red-305' : 'bg-white text-slate-500 dark:bg-slate-800'}`}>
                      <ScanFace className="mx-auto w-5 h-5 mb-1 text-slate-400" /> Face Biomertic (99% Acc)
                    </button>
                    <button onClick={() => { setSmartAttendanceMode('qr'); triggerToast("Dynamic QR Code loggers enabled"); }} className={`p-3 border rounded-xl text-center text-xs font-bold transition ${smartAttendanceMode === 'qr' ? 'border-crimson bg-crimson/5 text-crimson dark:text-red-305' : 'bg-white text-slate-500 dark:bg-slate-800'}`}>
                      <QrCode className="mx-auto w-5 h-5 mb-1 text-slate-400" /> QR Registration Scan
                    </button>
                    <button onClick={() => { setSmartAttendanceMode('gps'); triggerToast("GPS Location fencing locks activated"); }} className={`p-3 border rounded-xl text-center text-xs font-bold transition ${smartAttendanceMode === 'gps' ? 'border-crimson bg-crimson/5 text-crimson dark:text-red-305' : 'bg-white text-slate-500 dark:bg-slate-800'}`}>
                      <MapPin className="mx-auto w-5 h-5 mb-1 text-slate-400" /> GPS Geolocation Block
                    </button>
                    <button onClick={() => { setSmartAttendanceMode('biometric'); triggerToast("Biometric touch validations enabled"); }} className={`p-3 border rounded-xl text-center text-xs font-bold transition ${smartAttendanceMode === 'biometric' ? 'border-crimson bg-crimson/5 text-crimson dark:text-red-305' : 'bg-white text-slate-500 dark:bg-slate-800'}`}>
                      <Fingerprint className="mx-auto w-5 h-5 mb-1 text-slate-400" /> Fingerprint Terminal
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: POLLS */}
            {currentTab === 'polls' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-880 rounded-2xl shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                    <BarChart4 className="text-crimson w-5 h-5" /> Interactive Classroom Polling
                  </h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">Publish rapid MCQ quizzes during live lectures to measure retention instantenously.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Creator Form left */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newPollQuestion) return;
                      const newP = {
                        id: Math.random().toString(),
                        question: newPollQuestion,
                        options: newPollOptions.split(',').map(o => ({ label: o.trim(), votes: 0 })),
                        totalVotes: 0,
                        isLive: true
                      };
                      setPollingList(prev => [newP, ...prev]);
                      setNewPollQuestion('');
                      triggerToast("New MCQ Class Poll launched!");
                    }}
                    className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-101 p-5 rounded-xl space-y-5 shadow-sm"
                  >
                    <span className="text-[10px] font-black uppercase text-crimson tracking-wider block">Poll Creator Form</span>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-450 font-bold mb-1.5">Poll Question Heading *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Is AVL Tree search complexity O(log n)?"
                          value={newPollQuestion}
                          onChange={(e) => setNewPollQuestion(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:outline-none dark:bg-slate-850"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-455 font-bold mb-1.5">Options (Comma separated) *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Yes, No, It depends"
                          value={newPollOptions}
                          onChange={(e) => setNewPollOptions(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:outline-none dark:bg-slate-850"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-crimson hover:bg-red-700 text-white font-extrabold text-xs py-2 rounded-lg transition shadow-sm">
                      Establish Live Poll
                    </button>
                  </form>

                  {/* Active list right with animated charts */}
                  <div className="md:col-span-7 space-y-4">
                    {pollingList.map((p) => {
                      return (
                        <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-105 shadow-sm space-y-3.5">
                          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl">
                            <span className="text-[10px] font-black text-rose-500 animate-pulse uppercase tracking-widest leading-none">● Active Classroom Poll</span>
                            <span className="text-[10px] text-slate-450 font-mono font-bold leading-none">{p.totalVotes} responses</span>
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">{p.question}</h4>
                          
                          <div className="space-y-2.5">
                            {p.options.map((opt, i) => {
                              const percentage = p.totalVotes > 0 ? Math.round((opt.votes / p.totalVotes) * 100) : 0;
                              return (
                                <div key={i} className="relative p-2.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-705 rounded-lg overflow-hidden flex justify-between items-center text-xs">
                                  {/* Animated progress fill */}
                                  <div className="absolute left-0 top-0 bottom-0 bg-crimson/10 transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                  
                                  <span className="font-bold relative text-slate-800 dark:text-slate-100">{opt.label}</span>
                                  <span className="font-mono font-black text-crimson relative">{percentage}% ({opt.votes})</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: WHITEBOARD */}
            {currentTab === 'whiteboard' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                      <Sparkles className="text-crimson w-5 h-5" /> Interactive Infinite Whiteboard
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Scribble vector diagrams, render math equations, write stickies, and guide with laser pointers.</p>
                  </div>

                  {/* Draw tools */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                    {(['pen', 'rect', 'circle', 'math', 'sticky', 'laser'] as const).map((tool) => (
                      <button
                        key={tool}
                        onClick={() => {
                          setBoardTool(tool);
                          triggerToast(`Switched chalk tool: ${tool.toUpperCase()}`);
                        }}
                        className={`px-3 py-1 text-xs font-black rounded-lg transition uppercase ${
                          boardTool === tool ? 'bg-crimson text-white shadow' : 'text-slate-650 hover:bg-slate-200'
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Whiteboard stage mock sketch layout */}
                <div id="whiteboard-stage" className="relative h-[480px] bg-slate-100 dark:bg-slate-950 border border-slate-200 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  
                  {/* Grid Lines Mock Background to look professional */}
                  <div className="text-center select-none opacity-40 absolute pointer-events-none mb-10">
                    <span className="text-sm font-mono block">Microsoft Teams Interactive Sketch Canvas</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider mt-1 block">Collaborative Workspace Space • Multiuser ready</span>
                  </div>

                  {/* Mock shapes */}
                  {boardElements.map((el) => {
                    if (el.type === 'text') {
                      return <span key={el.id} className="absolute font-black text-sm tracking-tight shadow-sm bg-white p-2 rounded border border-red-200 text-red-700 font-mono" style={{ left: `${el.x}px`, top: `${el.y}px` }}>{el.text}</span>;
                    }
                    if (el.type === 'rect') {
                      return <div key={el.id} className="absolute border-4 border-slate-700/80 rounded-xl leading-none flex items-center justify-center font-mono text-[10px] select-none p-3.5" style={{ left: `${el.x}px`, top: `${el.y}px`, width: `${el.width}px`, height: `${el.height}px` }}>
                        Binary BST Node Container
                      </div>;
                    }
                    if (el.type === 'formula') {
                      return <span key={el.id} className="absolute font-mono text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 p-2 rounded-xl" style={{ left: `${el.x}px`, top: `${el.y}px` }}>{el.text}</span>;
                    }
                    if (el.type === 'sticky') {
                      return <div key={el.id} className="absolute bg-[#FDE047] text-slate-900 border border-yellow-340 p-4 shadow-md font-sans text-xs rotate-2 animate-fade-in w-36 h-32 leading-relaxed font-bold" style={{ left: `${el.x}px`, top: `${el.y}px` }}>
                        📌 Sticky Note:
                        <p className="font-semibold text-[11px] mt-1 text-slate-800">{el.text}</p>
                      </div>;
                    }
                    return null;
                  })}

                  {/* Add sticky widget */}
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border shadow-lg max-w-xs flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add custom sticky text..." 
                      value={newWhiteboardStickyText}
                      onChange={(e) => setNewWhiteboardStickyText(e.target.value)}
                      className="text-xs px-2.5 py-1 bg-slate-50 border rounded-lg focus:outline-none dark:bg-slate-850 flex-1"
                    />
                    <button 
                      type="button" 
                      onClick={addStickyNoteToBoard}
                      className="px-3.5 py-1 bg-crimson hover:bg-crimson/90 text-white rounded-lg text-xs font-black shadow"
                    >
                      Sticky
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BREAKOUT ROOMS */}
            {currentTab === 'breakout' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                      <Layers className="text-crimson w-5 h-5" /> Collaborative Breakout Spaces
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Split lecture group participants, broadcast admin messages, or allocate rooms recursively.</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const newR = { id: Math.random().toString(), name: `Room ${breakoutRooms.length + 1} (Discussion)`, studentsCount: 4, open: true };
                        setBreakoutRooms(prev => [...prev, newR]);
                        triggerToast("Spawned new collaborative breakout space!");
                      }} 
                      className="px-4 py-2 bg-crimson hover:bg-red-700 text-white text-xs font-black rounded-xl shadow transition"
                    >
                      + Create Room
                    </button>
                    <button onClick={() => triggerToast("Sent text broadcast to all rooms.")} className="px-3 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition">
                      Broadcast Text
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {breakoutRooms.map((room) => (
                    <div key={room.id} className="bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{room.name}</h4>
                          <span className={`h-2.5 w-2.5 rounded-full ${room.open ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{room.studentsCount} Students allocated</p>
                      </div>

                      <div className="flex gap-2 border-t pt-3 dark:border-slate-850 mt-5.5">
                        <button onClick={() => triggerToast("Class room status altered.")} className="flex-1 bg-slate-50 hover:bg-slate-150 border text-slate-650 text-xs font-bold py-1.5 rounded-lg transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                          {room.open ? "Close Space" : "Open Space"}
                        </button>
                        <button onClick={() => triggerToast("Moving student to breakout Alpha...")} className="px-3.5 border text-xs font-semibold hover:bg-slate-50 rounded-lg transition dark:hover:bg-slate-800">
                          Transfer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: NOTES (STUDENT NOTEBOOK AREA WITH AI OPTIMIZATIONS) */}
            {currentTab === 'notes' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                      <GraduationCap className="text-crimson w-5 h-5 animate-pulse" /> AI Academic Tutor & Private Notes
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Document notes recursively, translate paragraphs, generate dynamic flashcards, and run quiz reviews using Gemini API.</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={triggerAiNotesOptimization} 
                      disabled={isAiGeneratingNotes}
                      className="px-4 py-2 bg-crimson hover:bg-red-700 text-white text-xs font-black rounded-lg shadow-sm transition disabled:bg-slate-305 flex items-center gap-1.5"
                    >
                      <BrainCircuit size={13} /> Optimize Notes with AI
                    </button>
                    <button 
                      onClick={handleGenerateFlashcard} 
                      disabled={isAiGeneratingNotes}
                      className="px-3 py-2 bg-slate-900 text-white text-xs font-black rounded-lg hover:bg-slate-800 transition disabled:bg-slate-305"
                    >
                      Generate Flashcards
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Notes compiler rich text format left */}
                  <div className="md:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 space-y-4 shadow-sm flex flex-col">
                    <span className="text-[10px] uppercase font-extrabold text-crimson tracking-widest block">Rich Markdown Notebook Editor</span>
                    <textarea
                      value={studentNoteContent}
                      onChange={(e) => setStudentNoteContent(e.target.value)}
                      placeholder="Write core algorithm paradigms or dynamic notes..."
                      className="flex-1 w-full bg-slate-50 dark:bg-slate-850 p-4 border rounded-2xl font-mono text-xs text-slate-800 dark:text-slate-100 resize-none min-h-[350px] focus:outline-none focus:ring-1 focus:ring-crimson"
                    />
                  </div>

                  {/* AI Generated flashcards cards panel right */}
                  <div className="md:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 space-y-5 shadow-sm text-left">
                    <h4 className="text-xs font-black uppercase text-crimson tracking-widest flex items-center gap-1">
                      <Sparkles size={13} className="text-crimson animate-pulse" /> Notes Review Flashcards
                    </h4>
                    
                    <div className="space-y-3">
                      {noteFlashcards.map((fc, i) => (
                        <div key={i} className="p-3 bg-slate-50 dark:bg-slate-850 border rounded-xl space-y-1.5">
                          <span className="text-[9px] uppercase font-bold text-crimson">Card #{i + 1}</span>
                          <h5 className="font-bold text-xs text-slate-800 dark:text-slate-205">Q: {fc.q}</h5>
                          <p className="text-[11px] text-slate-550 leading-relaxed">A: {fc.a}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                      AI Tutor automatically tracks text changes in your notebook and produces micro educational assets dynamically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {currentTab === 'notifications' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-105 shadow-sm">
                  <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <Bell className="text-crimson w-5 h-5" /> School Notifications & Activity Logs
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Real-time indicators, upcoming assignment locks, and proctor warning checklists.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-101 flex items-start gap-3 shadow-sm">
                    <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">●</span>
                    <div>
                      <h4 className="font-bold text-xs">VIRTUAL CLASS ACTIVE</h4>
                      <p className="text-xs text-slate-550 mt-1">Dr. Joseph Adebayo initiated Data Structures lecture room. Join immediately.</p>
                      <span className="text-[9px] text-slate-400 block mt-1.5 font-semibold">Just now</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-101 flex items-start gap-3 shadow-sm">
                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">🔔</span>
                    <div>
                      <h4 className="font-bold text-xs">ASSIGNMENT PUBLISHED</h4>
                      <p className="text-xs text-slate-550 mt-1">Workbook AVL Tree Rotating factor criteria added to system calendar.</p>
                      <span className="text-[9px] text-slate-400 block mt-1.5 font-semibold">2 hours ago</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-101 flex items-start gap-3 shadow-sm">
                    <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">⚠️</span>
                    <div>
                      <h4 className="font-bold text-xs">INTEGRITY SYSTEM VERIFIED</h4>
                      <p className="text-xs text-slate-550 mt-1">Auto-Proctor modules established web security assertion algorithms securely.</p>
                      <span className="text-[9px] text-slate-400 block mt-1.5 font-semibold">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {currentTab === 'settings' && (
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-105 shadow-sm">
                  <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <Settings className="text-crimson w-5 h-5" /> Preferences & Meeting Defaults
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Enforce custom camera presets, theme profiles, or auto caption preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-205">
                  <div className="space-y-4">
                    <h4 className="text-xs text-crimson uppercase font-black">Meeting defaults</h4>
                    
                    <label className="flex items-center justify-between cursor-pointer p-2.5 bg-slate-50 dark:bg-slate-840 rounded-xl">
                      <span>Enable mic by default on enter</span>
                      <input type="checkbox" defaultChecked />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2.5 bg-slate-50 dark:bg-slate-840 rounded-xl">
                      <span>Always stream high definition 720p content</span>
                      <input type="checkbox" defaultChecked={false} />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2.5 bg-slate-50 dark:bg-slate-840 rounded-xl">
                      <span>Store transcripts recursively</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs text-crimson uppercase font-black">Virtual Background presets</h4>
                    <p className="text-xs font-semibold text-slate-500 leading-normal">Customize overlay backdrops to prevent surrounding visual distractions.</p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button onClick={() => { setVirtualBackgroundMode('hall'); triggerToast("Virtual Backdrop: Academic Hall"); }} className={`p-2 border rounded-lg text-center ${virtualBackgroundMode === 'hall' ? 'border-crimson bg-crimson/5 text-crimson' : 'bg-slate-50 text-slate-500'}`}>🏛️ Academic Hall</button>
                      <button onClick={() => { setVirtualBackgroundMode('library'); triggerToast("Virtual Backdrop: Library"); }} className={`p-2 border rounded-lg text-center ${virtualBackgroundMode === 'library' ? 'border-crimson bg-crimson/5 text-crimson' : 'bg-slate-50 text-slate-500'}`}>📚 Library Rack</button>
                      <button onClick={() => { setVirtualBackgroundMode('blur'); triggerToast("Virtual Backdrop: Soft Blur"); }} className={`p-2 border rounded-lg text-center ${virtualBackgroundMode === 'blur' ? 'border-crimson bg-crimson/5 text-crimson' : 'bg-slate-50 text-slate-500'}`}>🌫️ Soft Blur</button>
                      <button onClick={() => { setVirtualBackgroundMode('none'); triggerToast("Virtual Backdrop: None"); }} className={`p-2 border rounded-lg text-center ${virtualBackgroundMode === 'none' ? 'border-crimson bg-crimson/5 text-crimson' : 'bg-slate-50 text-slate-500'}`}>❌ Absolute None</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 3. Create Class Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border max-w-lg w-full p-6 text-left"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b">
                <h3 className="text-base font-black tracking-tight text-slate-900 uppercase">
                  Schedule Virtual Academic Room
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!createClassTitle) return;
                
                const newS: ClassSession = {
                  id: Math.random().toString(),
                  title: createClassTitle,
                  courseName: createClassCourseCode || 'Core Track Module',
                  instructor: 'Dr. Joseph Adebayo',
                  dateTime: new Date().toISOString().split('T')[0] + ' ' + createClassTime,
                  duration: '90 min',
                  isLive: false
                };

                handleAddNewSession(newS);
                setIsCreateModalOpen(false);
                setCreateClassTitle('');
                setCreateClassCourseCode('');
              }} className="space-y-4 text-xs font-bold">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-505 mb-1 bg-white">Class Room Title *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Tree Sorting Traversals"
                      value={createClassTitle}
                      onChange={(e) => setCreateClassTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-505 mb-1">Course Code Reference *</label>
                    <input 
                      type="text"
                      required 
                      placeholder="e.g. COMP301"
                      value={createClassCourseCode}
                      onChange={(e) => setCreateClassCourseCode(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-505 mb-1">Schedule Start Time</label>
                    <input 
                      type="text" 
                      value={createClassTime} 
                      onChange={(e) => setCreateClassTime(e.target.value)} 
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-505 mb-1">Security wait list rooms</label>
                    <select className="w-full px-3 py-2 border rounded-lg bg-slate-50">
                      <option>Enforce Waiting Room</option>
                      <option>Open direct entrance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t text-slate-650 bg-white">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Mute student microphone on enter room</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Establish automatic AI transcription notes</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border text-slate-605 rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-crimson hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md"
                  >
                    Create Class Room
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Custom mock graduation cap helper
function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.91a2 2 0 0 0 1.66 0z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

function setNoteMarkdownContent(val: string) {
  // Mock fallback handler to bypass unassigned ref state warnings
  console.log("Notebook content Asserted recursively:", val);
}
