import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, Layers, BookOpen, Film, Image as ImageIcon, Video, HelpCircle, 
  Settings, Award, Users, BarChart3, ChevronRight, Play, Plus, Check, 
  Sliders, RefreshCw, Send, ArrowRight, Save, Trash2, MessageSquare, 
  Star, Zap, Network, Flame, Compass, Radio, Download, Globe, Laptop, 
  Clock, Target, Cpu, FileText, CheckCircle2, AlertTriangle, AlertCircle, 
  Calendar, Trophy, Briefcase, Volume2, Mic, Square, Paperclip, Upload, 
  Info, Lock, BookMarked, Eye, ChevronLeft, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendMessageToTutor } from '../services/geminiService';

// Speech interface definitions
interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition };
        webkitSpeechRecognition: { new(): SpeechRecognition };
    }
}

// Interfaces
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AITutorViewProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
  userRole?: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({ initialTab, onTabChange, userRole }) => {
  // Navigation Tabs for AI Tutor Workspace
  const [activeTabInternal, setActiveTabInternal] = useState<string>('ask-tutor');
  
  const activeTab = initialTab || activeTabInternal;
  const setActiveTab = (tab: string) => {
    setActiveTabInternal(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  
  // Theme and Accessbility states
  const [dyslexiaMode, setDyslexiaMode] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Gamification & Progress state
  const [xp, setXp] = useState<number>(3750);
  const [streak, setStreak] = useState<number>(45);
  const [level, setLevel] = useState<number>(14);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([
    'Knowledge Seeker', 'Critical Thinker', 'Spiritual Scholar'
  ]);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Mentor Personality Engine State
  const [currentPersonality, setCurrentPersonality] = useState<string>('academic');
  const personalities = {
    academic: {
      name: 'Prof. Isabella Al-Fara',
      role: 'Academic Mentor & Professor',
      desc: 'Structured, rigorous intellectual training emphasizing critical analysis & academic precision.',
      greeting: 'Greetings, scholar. I have assessed your recent progress in cognitive epistemology. Ready to dissect our next system bottleneck?'
    },
    executive: {
      name: 'Chief David Mensah',
      role: 'Enterprise Executive Coach',
      desc: 'Action-oriented, practical frameworks focusing on strategy implementation & business ROI.',
      greeting: 'Welcome back! Let’s waste no time. What strategy models can we stress-test or build today to hit our milestone targets?'
    },
    spiritual: {
      name: 'Father Gregory',
      role: 'Spiritual Guide & Chaplain',
      desc: 'Contemplative, faith-centered wisdom integrating ancient sacred histories with ethical reasoning.',
      greeting: 'Peace be with you. In our pursuit of scientific understanding, let’s take a breath to reflect on ethics, purpose, and the soul.'
    },
    research: {
      name: 'Dr. Linus Vance',
      role: 'Peer Review Supervisor',
      desc: 'Methodical researcher pointing out citations, proof of claims, and validating academic papers.',
      greeting: 'Ready to write? Let’s check our research references. I have loaded peer-reviewed journals aligned with your topic.'
    },
    companion: {
      name: 'Sam',
      role: 'Conversational Study Mate',
      desc: 'Relaxed, supportive helper creating simple diagrams, quizzes, and motivating checklists.',
      greeting: 'Hey! Good to see you. Don’t stress too much about testing today; we’ve got this! What topic should we sketch together?'
    }
  };

  // Chat message thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'm-init', 
      sender: 'ai', 
      text: personalities.academic.greeting,
      timestamp: '14:45'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  
  // Socratic homework helper state
  const [uploadedFile, setUploadedFile] = useState<{name: string, size: string} | null>(null);
  const [socraticHintStep, setSocraticHintStep] = useState<number>(0);
  
  // Voice interface options
  const [voiceLang, setVoiceLang] = useState<string>('en-US');
  const [voiceTranscriptLog, setVoiceTranscriptLog] = useState<string[]>([
    "Tutor: Let’s talk about sustainable business design.",
    "User: I want to optimize regional transit routes.",
    "Tutor: Excellent priority. How do we measure transit cost constraints?"
  ]);

  // Video tutor mode interactive variables
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [videoTimestamp, setVideoTimestamp] = useState<number>(145); // seconds
  const [videoSlideIndex, setVideoSlideIndex] = useState<number>(1);
  const [videoSubtitles, setVideoSubtitles] = useState<string>(
    "We integrate regional governance overlays to map out sustainable freight parameters."
  );

  // Exam counts
  const examReadiness = {
    progress: 89,
    confidence: "High (Grade Forecast: A)",
    daysRemaining: 12,
    weakAreas: ["Postgradient Sharding Mechanics", "Multi-Tier Node Latency Matrices"]
  };

  // Mock Exam Interactive State
  const [mockExamFinished, setMockExamFinished] = useState<boolean>(false);
  const [mockExamScore, setMockExamScore] = useState<number | null>(null);
  const [mockSelectedAnswers, setMockSelectedAnswers] = useState<Record<number, number>>({});
  const mockQuestions = [
    {
      id: 1,
      q: "Under NQF Level 8 standards, how are micro-credentials structured for cross-border alignment?",
      options: [
        "Fixed 120 credit hour cycles only",
        "Stackable micro-units mapped via unique cryptographic hashes and learning outcomes",
        "Non-standard freeform modules parsed without accreditation review",
        "Strictly unilateral national registrations"
      ],
      correct: 1,
      exp: "Unique cryptographic learning outcomes provide portable, stackable validations compliant with corporate or national standards."
    },
    {
      id: 2,
      q: "Which Socratic method is most effective at diagnosing logical fallacies in architectural claims?",
      options: [
        "Answering with direct code snippets",
        "Asking progressive counter-factual questions regarding extreme scale-out workloads",
        "Direct correction with grade penalties",
        "Ignoring foundational premises to focus solely on user metrics"
      ],
      correct: 1,
      exp: "Counter-factual Socratic questioning forces the student to analyze their underlying assumptions on complex workloads."
    }
  ];

  // AI Whiteboard Canvas Interactive State
  const [wbNodes, setWbNodes] = useState<Array<{id: string, x: number, y: number, text: string, color: string}>>([
    { id: 'wn1', x: 200, y: 100, text: 'Digital Leadership Foundations', color: 'bg-crimson' },
    { id: 'wn2', x: 100, y: 220, text: 'Strategic Execution', color: 'bg-indigo-500' },
    { id: 'wn3', x: 300, y: 220, text: 'Governance Frameworks', color: 'bg-teal-500' },
    { id: 'wn4', x: 200, y: 340, text: 'Systemic Transformation', color: 'bg-emerald-500' },
  ]);
  const [newWbText, setNewWbText] = useState<string>('');

  // Socratic Knowledge map node tracker
  const [selectedKNode, setSelectedKNode] = useState<string>('gov');
  const knowledgeNodes = {
    lead: {
      name: "Strategic Leadership",
      status: "Mastered",
      score: "94% Mastery Progress",
      color: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
      lessons: ["Ethics of Scale", "Resource Optimization Principles", "De-escalation Metrics"],
      assessments: ["Assignment: Strategy Analysis", "Micro-Quiz level 8"],
      desc: "Architect and coordinate multi-faceted teams across distributed geographic nodes."
    },
    gov: {
      name: "Governance Constraints",
      status: "In Progress",
      score: "78% Mastery Progress",
      color: "border-crimson text-crimson/90 dark:text-crimson/80 bg-crimson/10",
      lessons: ["Cross-border compliance channels", "Sovereign data policies", "Risk mitigation models"],
      assessments: ["Draft Assessment: Policy Matrix"],
      desc: "Understand regulatory standards (NQF, SETA) mapped to localized institutional ecosystems."
    },
    strat: {
      name: "Strategy Models",
      status: "In Progress",
      score: "65% Mastery Progress",
      color: "border-indigo-500 text-indigo-400 bg-indigo-500/10",
      lessons: ["Micro-economic network dynamics", "Iterative deployment schedules"],
      assessments: ["Simulation Check 1"],
      desc: "Develop scalable and resilient commercial models for under-resourced regional sectors."
    },
    inno: {
      name: "Grassroots Innovation",
      status: "Not Started",
      score: "0% Mastery Progress",
      color: "border-gray-200 dark:border-gray-700/85 text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-gray-800/40",
      lessons: ["Edge-level resource fabrication", "Participatory research mechanisms"],
      assessments: [],
      desc: "Integrate citizen-science networks to optimize localized municipal deployment nodes."
    }
  };

  // Speech Recognition hook setup
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Trigger toast or XP notification helper
  const addXp = (amount: number, reason: string) => {
    setXp(prev => prev + amount);
    setRecentNotification(`🎉 +${amount} XP Earned: ${reason}`);
    
    // Check level up constraint
    if ((xp + amount) >= (level * 300) + 1200) {
      setLevel(prev => prev + 1);
      setRecentNotification(`🏆 LEVEL UP! You reached Level ${level + 1}!`);
    }

    setTimeout(() => {
      setRecentNotification(null);
    }, 4500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle personality swap
  const handlePersonalityChange = (persKey: string) => {
    setCurrentPersonality(persKey);
    const chosen = personalities[persKey as keyof typeof personalities];
    setMessages(prev => [
      ...prev, 
      { id: `ps-${Date.now()}`, sender: 'ai', text: `*[Switched to ${chosen.name} - ${chosen.role}]* \n\n${chosen.greeting}`, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    ]);
    addXp(15, `Selected ${chosen.name} as Mentor`);
  };

  // Chat sending handler using actual Gemini API Stream or local rich fallback
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const actionText = customText || chatInput;
    if (!actionText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: actionText,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setIsLoading(true);

    const botMsgId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, { id: botMsgId, sender: 'ai', text: 'Analyzing context & scaffolding explanation...', timestamp: '' }]);

    try {
      const streamResult = await sendMessageToTutor(actionText);
      let textBuffer = '';
      
      for await (const chunk of streamResult) {
        textBuffer += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.id === botMsgId) {
            updated[lastIdx] = { 
              ...updated[lastIdx], 
              text: textBuffer,
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
          }
          return updated;
        });
      }
      
      // Award XP for asking rigorous questions
      addXp(40, "Deep Inquiry Practice");
    } catch (err) {
      console.error(err);
      // Beautiful fallback system instructions
      setTimeout(() => {
        const fallbacks = [
          "Let's break that down mathematically. If you look at the sovereign data boundary, we establish constraints. How would you prioritize localized regulatory alignment versus total global deployment speed?",
          "An excellent point of research. Let's practice Socratic investigation: What do you anticipate is the major latency trade-off when hosting direct quantization protocols locally inside the student's browser frame?",
          "According to leadership frameworks, we must align regional competencies prior to scheduling capital budgets. Let's review the active lesson notes directly in the Lesson Summary tab of your sidebar."
        ];
        const text = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.id === botMsgId) {
            updated[lastIdx] = { 
              ...updated[lastIdx], 
              text,
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
          }
          return updated;
        });
        addXp(20, "Academic Practice Step");
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech input implementation
  useEffect(() => {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechAPI) {
      const rec = new SpeechAPI();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = voiceLang;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setChatInput(transcript);
          handleSendMessage(undefined, transcript);
        }
      };
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, [voiceLang]);

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      addXp(5, "Simulated Mic Check");
      setIsListening(!isListening);
      if (!isListening) {
        setTimeout(() => {
          setIsListening(false);
          const mockVoiceTranscripts = [
            "How do we model regulatory risk patterns in NQF framework?",
            "What is the mathematical formulation of Socratic questioning?",
            "Can you create a mindmap summary of Leadership course?"
          ];
          const userQuery = mockVoiceTranscripts[Math.floor(Math.random() *3)];
          setVoiceTranscriptLog(p => [...p, `User (Voice): ${userQuery}`, "Tutor: Analyzing speech patterns... Synthesizing answer..."]);
          handleSendMessage(undefined, userQuery);
        }, 3000);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setChatInput('');
      recognitionRef.current.start();
    }
  };

  // Adaptive Quiz checker
  const handleScoreMockExam = () => {
    let score = 0;
    mockQuestions.forEach(q => {
      if (mockSelectedAnswers[q.id] === q.correct) score += 50;
    });
    setMockExamScore(score);
    setMockExamFinished(true);
    addXp(score + 100, `Completed Critical Reasoning Prep Quiz`);
  };

  // File drag & drop simulator
  const handleFileDropSimulator = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadedFile({ name: 'EP_CaseStudy_V4_Draft.pdf', size: '2.4 MB' });
    setSocraticHintStep(1);
    addXp(50, "Workspace Case Study Uploaded");
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-200 dark:border-gray-700/85 text-slate-800 dark:text-slate-800 dark:text-gray-105 min-h-screen rounded-3xl p-6 font-sans relative shadow-xl overflow-hidden ${dyslexiaMode ? 'font-serif tracking-wide leading-relaxed' : ''} ${largeText ? 'text-lg' : 'text-sm'}`}>
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-crimson/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-crimson/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Experience Header Layer */}
      <div className="relative border-b border-sans border-gray-200 dark:border-gray-700/85/80 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Tutor Identity */}
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#A51C30]/25 text-crimson dark:text-crimson/90 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#A51C30]/30 flex items-center gap-1.5 animate-pulse">
              <Sparkles size={11} className="text-[#00E5A8]" />
              Cognitive Learning Ecosystem
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/85 text-[10px] uppercase font-mono px-2 py-0.5 rounded text-amber-400">
              Personal Mentor Mode
            </span>
          </div>
          <h1 className="text-3xl font-black mt-2 tracking-tight text-white font-serif">
            CogniSacra AI Tutor Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-bold font-mono">
            Direct discovery • Mastery tracking • 24/7 Spiritual & Academic Guide
          </p>
        </div>

        {/* Global Level Indicator & Gamification widgets */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Level Progress */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 border border-gray-200 dark:border-gray-700/85 rounded-2xl p-2.5 flex items-center gap-3 text-left">
            <div className="bg-gradient-to-tr from-[#A51C30] to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-lg">
              Lvl {level}
            </div>
            <div>
              <div className="flex justify-between items-center w-28 text-[9px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                <span>XP PROGRESS</span>
                <span>{xp} XP</span>
              </div>
              <div className="w-28 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 h-1.5 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#00E5A8] to-[#A51C30] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(xp % 1000) / 10}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Daily Streak Indicator */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 border border-gray-200 dark:border-gray-700/85 rounded-2xl p-2.5 flex items-center gap-2">
            <Flame className="text-amber-500 fill-amber-500 animate-bounce" size={20} />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono block">STREAK</span>
              <span className="text-xs font-black text-white">{streak} Days</span>
            </div>
          </div>

          {/* Quick Settings Panel Toggles */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40/40 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700/85">
            <button 
              onClick={() => { setDyslexiaMode(!dyslexiaMode); addXp(5, "Accessibility Check"); }}
              className={`p-2 rounded-lg text-xs font-extrabold transition-all border ${dyslexiaMode ? 'bg-[#A51C30] text-white border-crimson' : 'text-slate-500 dark:text-slate-450 hover:text-crimson border-transparent'}`}
              title="Dyslexia Font Mode Toggle"
            >
              Abc
            </button>
            <button 
              onClick={() => setLargeText(!largeText)}
              className={`p-2 rounded-lg text-xs font-black transition-all border ${largeText ? 'bg-[#A51C30] text-white border-crimson' : 'text-slate-500 dark:text-slate-450 hover:text-crimson border-transparent'}`}
              title="Text Sizing"
            >
              AA
            </button>
            <button 
              onClick={() => { setHighContrast(!highContrast); addXp(5, "Contrast Tuning"); }}
              className={`p-2 rounded-lg transition-all border ${highContrast ? 'bg-amber-500 text-black border-amber-400' : 'text-slate-500 dark:text-slate-450 hover:text-crimson border-transparent'}`}
              title="High Contrast Mode"
            >
              <Sliders size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* Floating dynamic achievement notification toast */}
      <AnimatePresence>
        {recentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 right-10 z-50 bg-gray-50 dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 text-[#00E5A8] border border-[#00E5A8]/30 font-black text-xs px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <Trophy size={16} className="text-yellow-400 animate-spin" />
            <span>{recentNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Socratic Journey Map Progress tracker */}
      <div className="bg-gray-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-200 dark:border-gray-700/85 border border-gray-200 dark:border-gray-700/85 rounded-3xl p-4 mb-6 flex flex-col md:flex-row justify-between gap-4 overflow-x-auto text-left backdrop-blur-sm">
        {[
          { step: "Profile Analysis", desc: "Dynamic diagnostic loaded", done: true },
          { step: "Personalized Journey Map", desc: "NQF Objectives verified", done: true },
          { step: "Socratic Discovery Work", desc: "Active workspace interactive", done: true },
          { step: "Knowledge Validation", desc: "Skills Graph adaptive checker", done: false, active: true },
          { step: "Accreditation Output", desc: "120-credit portable badges", done: false }
        ].map((item, idx) => (
          <div key={idx} className="flex-1 min-w-[160px] relative">
            <div className="flex items-center gap-2">
              {item.done ? (
                <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full border border-emerald-500/30">
                  <Check size={11} />
                </div>
              ) : item.active ? (
                <div className="bg-[#A51C30]/25 text-crimson dark:text-crimson/90 p-1 rounded-full border border-crimson/30 animate-pulse">
                  <Sparkles size={11} className="text-[#00E5A8]" />
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 text-slate-500 p-1 rounded-full border border-gray-200 dark:border-gray-700/85">
                  <Lock size={11} />
                </div>
              )}
              <span className={`text-[11px] font-black uppercase tracking-wider ${item.active ? 'text-crimson dark:text-crimson/90 font-extrabold' : item.done ? 'text-gray-300' : 'text-slate-500'}`}>
                {item.step}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Experience layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL (20% - ColSpan 3): Hierarchical Learner Navigator */}
        <div className="lg:col-span-3 bg-gray-50/80 dark:bg-gray-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-xl text-left">
          
          {/* Persona selector block */}
          <div className="p-3 bg-gradient-to-tr from-rose-50/60 to-gray-50/30 dark:from-rose-950/20 dark:to-gray-800/20 border border-crimson/20 rounded-xl space-y-2">
            <span className="text-[10px] text-crimson/90 dark:text-crimson/80 font-extrabold uppercase font-mono tracking-widest block">ACTIVE PERSONALIZED MENTOR</span>
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-[#A51C30] to-pink-600 w-10.5 h-10.5 rounded-full flex items-center justify-center font-black shadow-md border border-crimson/30">
                {currentPersonality === 'academic' && <Award size={18} className="text-yellow-300" />}
                {currentPersonality === 'executive' && <Target size={18} className="text-cyan-300" />}
                {currentPersonality === 'spiritual' && <Compass size={18} className="text-teal-300" />}
                {currentPersonality === 'research' && <BookMarked size={18} className="text-emerald-600" />}
                {currentPersonality === 'companion' && <Users size={18} className="text-pink-300" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-black text-white truncate">
                  {personalities[currentPersonality as keyof typeof personalities].name}
                </p>
                <p className="text-[9px] text-[#00E5A8] font-bold uppercase tracking-wider font-mono">
                  {personalities[currentPersonality as keyof typeof personalities].role}
                </p>
              </div>
            </div>

            {/* Custom selectors */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700/85 grid grid-cols-5 gap-1">
              {[
                { key: 'academic', icon: <Award size={13} />, label: "Academic Mentor" },
                { key: 'executive', icon: <Target size={13} />, label: "Executive Coach" },
                { key: 'spiritual', icon: <Compass size={13} />, label: "Spiritual Guide" },
                { key: 'research', icon: <BookMarked size={13} />, label: "Research Supervisor" },
                { key: 'companion', icon: <Users size={13} />, label: "Companion" },
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => handlePersonalityChange(p.key)}
                  className={`p-1.5 rounded-lg flex items-center justify-center transition border ${currentPersonality === p.key ? 'bg-[#A51C30] border-crimson text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                  title={p.label}
                >
                  {p.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-850"></div>

          {/* Navigation Directory Hierarchy */}
          <div className="space-y-4">
            
            {/* Group 1: General & Goals */}
            <div>
              <p className="px-2 mb-1.5 text-[9.5px] font-black uppercase tracking-widest text-[#00E5A8] font-mono">Home Dashboard</p>
              <div className="space-y-0.5">
                {[
                  { id: 'dashboard', label: "Dashboard Overview", action: () => addXp(5, "Overview Check") },
                  { id: 'continue-course', label: "Continue Learning" },
                  { id: 'streaks-goals', label: "Today's Goals & Streaks" }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); if (item.action) item.action(); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex justify-between items-center ${activeTab === item.id ? 'bg-rose-50/60 dark:bg-rose-950/20 text-crimson dark:text-crimson/90 font-black border-l-3 border-[#A51C30]' : 'text-slate-500 dark:text-slate-500 dark:text-slate-400 hover:text-crimson hover:bg-rose-50/40 dark:hover:bg-rose-950/10'}`}
                  >
                    <span>{item.label}</span>
                    {activeTab === item.id && <ChevronRight size={12} className="text-crimson/90 dark:text-crimson/80" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2: AI Tutor Core Engines */}
            <div>
              <p className="px-2 mb-1.5 text-[9.5px] font-black uppercase tracking-widest text-[#A51C30] font-mono">Personal AI Tutor</p>
              <div className="space-y-0.5">
                {[
                  { id: 'ask-tutor', label: "Ask Tutor (Socratic Chat)", icon: <MessageSquare size={12} /> },
                  { id: 'voice-tutor', label: "Voice Tutor Mode", icon: <Mic size={12} /> },
                  { id: 'video-tutor', label: "Video Tutor Mode", icon: <Film size={12} /> },
                  { id: 'study-mode', label: "Study Mode (Summaries)", icon: <BookOpen size={12} /> },
                  { id: 'homework-help', label: "Homework Socratic Helper", icon: <Upload size={12} /> },
                  { id: 'exam-prep', label: "Exam Preparation Mode", icon: <Award size={12} /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${activeTab === item.id ? 'bg-rose-50/60 dark:bg-rose-950/20 text-crimson dark:text-crimson/90 font-extrabold border-l-3 border-[#A51C30]' : 'text-slate-500 dark:text-slate-500 dark:text-slate-400 hover:text-crimson hover:bg-rose-50/40 dark:hover:bg-rose-950/10'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={activeTab === item.id ? 'text-[#00E5A8]' : 'text-slate-500'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight size={11} className="text-crimson/90 dark:text-crimson/80" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 3: Dynamic Channels */}
            <div>
              <p className="px-2 mb-1.5 text-[9.5px] font-black uppercase tracking-widest text-slate-500 font-mono">Knowledge Graph & Vaults</p>
              <div className="space-y-0.5">
                {[
                  { id: 'knowledge-map', label: "Skills Knowledge Map", icon: <Network size={12} /> },
                  { id: 'whiteboard', label: "AI Interactive Whiteboard", icon: <Sliders size={12} /> },
                  { id: 'research-library', label: "Sacred Texts & Research", icon: <Globe size={12} /> },
                  { id: 'analytics-dashboard', label: "Learning Analytics Mastery", icon: <BarChart3 size={12} /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${activeTab === item.id ? 'bg-rose-50/60 dark:bg-rose-950/20 text-crimson dark:text-crimson/90 font-extrabold border-l-3 border-[#A51C30]' : 'text-slate-500 dark:text-slate-500 dark:text-slate-400 hover:text-crimson hover:bg-rose-50/40 dark:hover:bg-rose-950/10'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={activeTab === item.id ? 'text-[#00E5A8]' : 'text-slate-500'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight size={11} className="text-crimson/90 dark:text-crimson/80" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700/85">
            <div className="p-3 bg-indigo-950/15 rounded-xl border border-indigo-900/20 text-xs">
              <span className="text-[9.5px] text-crimson/90 dark:text-crimson/80 font-extrabold block uppercase tracking-wider font-mono">Accreditation Match</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Course mapped to SETA/NQF standard credits.
              </p>
            </div>
          </div>

        </div>

        {/* CENTER PANEL (60% - ColSpan 6): Active Socratic Workspace Canvas */}
        <div className="lg:col-span-6 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* SUBVIEW 1: ASK TUTOR (CHAT INTERACTION) */}
            {activeTab === 'ask-tutor' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a]/85 border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 flex flex-col justify-between h-[540px] text-left relative shadow-2xl"
              >
                
                {/* Visual Avatar State line */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700/85/70 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#00E5A8] animate-ping"></span>
                    <span className="text-xs font-black text-white">{personalities[currentPersonality as keyof typeof personalities].name} is Listening...</span>
                  </div>
                  <span className="text-[10px] bg-indigo-900/20 px-2 py-1 rounded text-crimson dark:text-crimson/90 font-mono font-bold">
                    Socratic Mode Active
                  </span>
                </div>

                {/* Socratic Dialog Field */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 p-2 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40/35 rounded-2xl border border-gray-200 dark:border-gray-700/60 leading-relaxed text-xs">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                      {m.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-[#A51C30]/30 flex items-center justify-center flex-shrink-0 border border-crimson/20">
                          <Sparkles size={14} className="text-[#00E5A8]" />
                        </div>
                      )}
                      <div className={`max-w-[76%] p-3.5 rounded-2xl ${m.sender === 'user' 
                        ? 'bg-gradient-to-tr from-[#A51C30] to-indigo-600 border border-crimson/20 text-white rounded-br-none' 
                        : 'bg-[#12162a]/90 text-indigo-100 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        {m.timestamp && <span className="text-[8px] text-slate-450 block text-right mt-1.5 opacity-60 font-mono">{m.timestamp}</span>}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-crimson dark:text-crimson/90 font-mono text-[10px] pl-2 animate-pulse">
                      <RefreshCw size={11} className="animate-spin text-[#00E5A8]" />
                      <span>Thinking: Analyzing cognitive context & framing Socratic prompt...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Interactive prompts */}
                <div className="my-2.5 flex flex-wrap gap-1.5">
                  {[
                    "Ask for real-world case study",
                    "Explain leadership ethics of scale",
                    "Stress-test my commercial model",
                    "Help me understand SETA NQF requirements"
                  ].map((p, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setChatInput(p);
                        addXp(5, "Prompt selected");
                      }}
                      className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-[#A51C30]/40 rounded-xl text-[10.5px] font-bold text-slate-600 dark:text-slate-700 dark:text-slate-300 hover:text-crimson transition truncate max-w-xs"
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>

                {/* Input action dock with Voice & Attachments toggles */}
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                  <div className="absolute left-3 flex items-center gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => addXp(10, "Simulated document analysis link")}
                      className="p-1.5 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 rounded-lg hover:bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:text-[#00E5A8]"
                      title="Attach assignment document (PDF/Word)"
                    >
                      <Paperclip size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => addXp(10, "Simulated screenshot checker")}
                      className="p-1.5 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 rounded-lg hover:bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:text-[#00E5A8]"
                      title="Attach snapshot / code draft"
                    >
                      <ImageIcon size={13} />
                    </button>
                  </div>

                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a deep question or propose a strategy claim..."
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700/85 rounded-2xl pl-20 pr-24 py-3 text-xs font-bold text-slate-800 dark:text-gray-200 focus:outline-none focus:border-[#A51C30] placeholder-slate-500"
                    disabled={isLoading}
                  />

                  {/* Right hand buttons */}
                  <div className="absolute right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleVoiceListen}
                      className={`p-1.5 rounded-xl transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#141628] hover:bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300'}`}
                      title="Speak to Personal Tutor"
                    >
                      <Mic size={14} />
                    </button>
                    <button 
                      type="submit"
                      className="px-3 py-1.5 bg-gradient-to-r from-[#A51C30] to-indigo-600 hover:opacity-90 rounded-xl text-xs font-black text-white flex items-center gap-1"
                    >
                      <span>Send</span>
                    </button>
                  </div>
                </form>

              </motion.div>
            )}

            {/* SUBVIEW 2: VOICE TUTOR MODE (DYNAMIC TRANSCRIPTS) */}
            {activeTab === 'voice-tutor' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-center space-y-6 min-h-[460px] flex flex-col justify-between"
              >
                <div className="text-left">
                  <h3 className="text-base font-black text-white">Advanced Voice Guided Interaction</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Practice live verbal presentations or oral defense of policy criteria with instantaneous corrections.</p>
                </div>

                {/* Pulsing Visual Wave Area */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-32 w-32 rounded-full bg-[#A51C30]/10 animate-ping"></span>
                    <span className="absolute h-24 w-24 rounded-full bg-crimson/15 animate-pulse"></span>
                    <button
                      onClick={toggleVoiceListen}
                      className={`h-16 w-16 rounded-full flex items-center justify-center border transition-all duration-300 ${isListening ? 'bg-red-500 border-red-400 text-white animate-pulse shadow-lg' : 'bg-[#A51C30] border-crimson hover:scale-105 text-white shadow-xl'}`}
                    >
                      {isListening ? <Square size={20} /> : <Mic size={24} />}
                    </button>
                  </div>
                  <span className="text-xs font-mono text-slate-450 uppercase tracking-widest font-bold">
                    {isListening ? "Listening with accent-adaptation active..." : "Tap to speak and defend your framework claims"}
                  </span>
                </div>

                {/* Voice Transcripts Scroll Area */}
                <div className="bg-[#04060d] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-left font-mono text-[11px] text-slate-500 dark:text-slate-400 h-36 overflow-y-auto space-y-2">
                  <div className="text-[10px] text-indigo-400 border-b border-indigo-900/30 pb-1 mb-2 font-black uppercase">Live Transcription Monitor</div>
                  {voiceTranscriptLog.map((log, i) => (
                    <p key={i} className={log.startsWith("Tutor:") ? 'text-[#00E5A8]' : 'text-slate-200'}>{log}</p>
                  ))}
                </div>

                {/* Language selections */}
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Accent Adaptation Language</span>
                  <select 
                    value={voiceLang}
                    onChange={(e) => { setVoiceLang(e.target.value); addXp(10, `Language Switched`); }}
                    className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 rounded px-2.5 py-1 text-xs text-[#00E5A8] focus:outline-none"
                  >
                    <option value="en-US">English (Pan-African accent check)</option>
                    <option value="sw-KE">Kiswahili (East African dialect)</option>
                    <option value="fr-FR">Français (West African format)</option>
                    <option value="es-ES">Español (Global format)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* SUBVIEW 3: VIDEO TUTOR PLAYBACK ENGINE */}
            {activeTab === 'video-tutor' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700/85 rounded-3xl overflow-hidden shadow-2xl relative">
                  
                  {/* Mock Video Container */}
                  <div className="aspect-video bg-gray-50 dark:bg-gray-950 flex flex-col justify-between p-4 relative text-left">
                    {/* Background Visual mock of instructor */}
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#A51C30_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <img 
                      className="absolute inset-0 w-full h-full object-cover opacity-45"
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
                      alt="AI Instructor"
                    />

                    {/* Badge */}
                    <span className="self-start relative z-10 bg-red-500 text-white font-black uppercase text-[9px] px-2.5 py-1 rounded">
                      ● LIVE INSTRUCTOR RENDER
                    </span>

                    {/* Slides overlay right side */}
                    <div className="absolute right-4 top-4 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40/90 border border-gray-200 dark:border-gray-700/85 p-3 rounded-2xl w-52 text-xs text-left shadow-2xl z-10">
                      <span className="text-[8px] text-crimson/90 dark:text-crimson/80 block font-mono font-bold uppercase tracking-wider">Lesson Slide 1.4</span>
                      <p className="font-extrabold text-white mt-1">SETA Accreditation Blueprint Map</p>
                      <ul className="text-[9px] text-slate-500 dark:text-slate-400 mt-2 list-disc pl-3.5 space-y-1">
                        <li>Credit hours: 12 semester cycle</li>
                        <li>Sovereign geographic checks</li>
                      </ul>
                    </div>

                    {/* Subtitles Area */}
                    <div className="mt-auto w-full text-center bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-[11.5px] font-black text-[#00E5A8] z-10">
                      "{videoSubtitles}"
                    </div>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="bg-[#12162a] p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700/85">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setVideoPlaying(!videoPlaying);
                          addXp(10, videoPlaying ? "Paused Instruction" : "Resumed AI Lecture Stream");
                        }}
                        className="p-2.5 bg-[#A51C30] hover:bg-crimson rounded-full text-white shadow-md active:scale-95 transition"
                      >
                        {videoPlaying ? <Square size={13} /> : <Play size={13} className="fill-white" />}
                      </button>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">02:25 / 15:00</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setVideoSubtitles("We now align the micro-competencies directly to South African SAQA credentials."); 
                          addXp(15, "Synchronized lecture slides");
                        }}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/85 text-[10.5px] rounded-lg font-bold text-slate-600 dark:text-slate-700 dark:text-slate-300 hover:text-crimson transition"
                      >
                        → Next Lecture Slide
                      </button>
                      <button
                        onClick={() => {
                          setMessages(p => [...p, { id: `vn-${Date.now()}`, sender: 'ai', text: "✓ Generated comprehensive lecture study companion notes matching NQF levels in your sidebar library drawer.", timestamp: 'Now' }]);
                          addXp(25, "Speaker Notes Generated");
                        }}
                        className="px-3 py-1.5 bg-[#00E5A8]/10 border border-[#00E5A8]/20 text-[10.5px] rounded-lg font-black text-[#00E5A8]"
                      >
                        Generate Handouts
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant search question field */}
                <div className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 p-4 rounded-3xl text-left">
                  <span className="text-[10px] text-crimson/90 dark:text-crimson/80 font-extrabold uppercase font-mono block">ASK-ANYTIME VIDEO CO-PILOT</span>
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="Ask a question about the current slide..." 
                      className="w-full bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-slate-205 focus:outline-none"
                    />
                    <button 
                      onClick={() => addXp(20, "Interactive Video Query")}
                      className="px-4 bg-[#A51C30] hover:bg-crimson text-xs font-bold rounded-xl text-white whitespace-nowrap"
                    >
                      Ask Co-Pilot
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUBVIEW 4: STUDY MODE & SUMMARIES */}
            {activeTab === 'study-mode' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-left space-y-5"
              >
                <div>
                  <h3 className="text-base font-black text-white">Smart Revision & Flashcard Engine</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-yield study guidelines and foundational concept summaries calibrated to your current course track.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "NQF Unit Standards Summary", desc: "Core policy guidelines and accredited criteria broken down in simple terms.", items: ["3 Credits", "NQF Level 8", "SAQA Aligned"] },
                    { title: "Governance Risk Assessment", desc: "Interactive framework analyzing sovereignty limits and edge routing policies.", items: ["Critical path analysis", "Risk mitigation metrics"] }
                  ].map((sum, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl relative hover:border-[#A51C30]/40 transition space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-black text-white">{sum.title}</h4>
                        <span className="bg-[#A51C30]/10 text-crimson dark:text-crimson/90 text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase">Flashcards Ready</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{sum.desc}</p>
                      <div className="flex flex-wrap gap-1">
                        {sum.items.map(item => (
                          <span key={item} className="bg-gray-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400 border border-gray-200 dark:border-gray-700 text-[9px] px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => addXp(30, "Reviewed revision card summaries")}
                        className="w-full py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-slate-850 border border-gray-200 dark:border-gray-700/85 rounded-lg text-[10px] font-black uppercase text-slate-600 dark:text-slate-700 dark:text-slate-300 hover:text-crimson transition flex items-center justify-center gap-1.5"
                      >
                        <Eye size={12} />
                        <span>Flip & Study 5 Cards</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Simulated Custom generation block */}
                <div className="p-4 bg-crimson/5 border border-crimson/20 rounded-2xl">
                  <span className="text-[9.5px] text-[#00E5A8] font-extrabold uppercase font-mono block">GENERATE ACTIVE SMART FLASHCARDS</span>
                  <p className="text-[11px] text-slate-450 mt-1 leading-normal">
                    Enter any topic below to let the AI create active memory cards for your review.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <input 
                      type="text" 
                      placeholder="e.g., Mathematical matrix decomposition protocols" 
                      className="w-full bg-[#04060b] border border-gray-200 dark:border-gray-700/85 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={() => addXp(45, "Active memory set generated")}
                      className="px-4 py-2 bg-[#A51C30] hover:bg-crimson rounded-xl text-xs font-black text-white whitespace-nowrap"
                    >
                      Create Deck
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* SUBVIEW 5: HOMEWORK HELPER (SOCRATIC FILE DRAG & DROP) */}
            {activeTab === 'homework-help' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-left space-y-5"
              >
                <div>
                  <h3 className="text-base font-black text-white">Socratic Assignment Discovery Guide</h3>
                  <p className="text-xs text-[#00E5A8] mt-1 font-bold">
                    ✓ Grounded Socratic teaching guidelines: This engine prompts logical corrections without directly answering the tasks for you.
                  </p>
                </div>

                {/* Drag and Drop Container */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDropSimulator}
                  className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#A51C30]/50 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="text-[#A51C30]" size={28} />
                  <div>
                    <p className="text-xs font-black text-white">Drag & Drop assignment sheet or screenshot here</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Supports PDF, DOCX, PNG, JPEG formats up to 25MB</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setUploadedFile({ name: 'NQF_PolicyDraft_Cole.pdf', size: '1.8 MB' });
                      setSocraticHintStep(1);
                      addXp(40, "Diagnostic uploaded");
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/85 text-[10px] rounded-lg font-bold text-slate-500 dark:text-slate-400"
                  >
                    Select File Manually
                  </button>
                </div>

                {/* Uploaded File Panel with Socratic Hints */}
                {uploadedFile && (
                  <div className="bg-[#10142c] border border-gray-200 dark:border-gray-700/85 p-4 rounded-xl space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40/80 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <FileText className="text-crimson/90 dark:text-crimson/80" size={14} />
                        <span className="text-xs font-black text-white">{uploadedFile.name} ({uploadedFile.size})</span>
                      </div>
                      <button 
                        onClick={() => { setUploadedFile(null); setSocraticHintStep(0); }}
                        className="text-slate-500 dark:text-slate-400 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[9.5px] text-crimson/90 dark:text-crimson/80 font-extrabold uppercase font-mono tracking-widest block">AI Socratic Exploration Path</span>
                      
                      {socraticHintStep === 1 && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-indigo-200">
                          <p className="font-bold">Socratic Query Step 1 of 3:</p>
                          <p className="mt-1 leading-normal text-slate-350">
                            I parsed your assignment. Under Chapter 3, you are requested to balance governance risks with capital constraints. Before I show you how to formulate the math, what is your understanding of NQF Level 8 regional sovereign limitations?
                          </p>
                          <div className="flex gap-1.5 mt-3">
                            <button 
                              onClick={() => { setSocraticHintStep(2); addXp(20, "Responded to Socratic Prompt"); }}
                              className="px-3 py-1 bg-[#A51C30] text-[10px] rounded text-white font-bold"
                            >
                              "It establishes compliance bounds"
                            </button>
                            <button 
                              onClick={() => { setSocraticHintStep(2); addXp(20, "Responded to Socratic Prompt"); }}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] rounded text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-gray-700"
                            >
                              "I'm not fully sure of sovereignty constraints"
                            </button>
                          </div>
                        </div>
                      )}

                      {socraticHintStep === 2 && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-indigo-300 space-y-2">
                          <p className="font-extrabold text-[#00E5A8]">✓ Concept Progressing! Step 2 of 3:</p>
                          <p className="leading-normal text-slate-350">
                            Splendid priority. Think of sovereignty bounds as critical policy friction. If we must satisfy local compliance, we adjust deployment parameters. What regulatory risks do you expect if we deploy high-bandwidth networks without regional reviews?
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Write your explanation..."
                              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700/85 rounded px-2.5 py-1 text-xs text-white"
                            />
                            <button 
                              onClick={() => { setSocraticHintStep(3); addXp(30, "Completed Socratic feedback cycle"); }}
                              className="px-3 bg-[#A51C30] text-[11px] rounded text-white font-bold"
                            >
                              Evaluate Answer
                            </button>
                          </div>
                        </div>
                      )}

                      {socraticHintStep === 3 && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-xs text-emerald-355 space-y-2">
                          <p className="font-extrabold text-[#00C853] flex items-center gap-1">
                            <CheckCircle2 size={13} />
                            <span>Discovery Completed! Socratic feedback synchronized.</span>
                          </p>
                          <p className="leading-normal text-slate-350">
                            Excellent validation! Your response captures regional risk perfectly. I have compiled high-yield outlines and formatted notes. Ready to review and apply to your assignment formulation draft?
                          </p>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => {
                                setMessages(p => [...p, { id: `as-${Date.now()}`, sender: 'ai', text: "✓ Generated assignment structured draft templates matching NQF specifications.", timestamp: 'Now' }]);
                                showToast("Blueprint draft templates updated!");
                              }}
                              className="px-3 py-1 bg-[#00C853] text-[9.5px] rounded text-white font-bold uppercase transition hover:scale-105"
                            >
                              Import Outline To Workspace
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* SUBVIEW 6: EXAM PREPARATION WORKSPACE */}
            {activeTab === 'exam-prep' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                
                {/* Confidence countdown metrics card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 p-4 rounded-2xl">
                    <span className="text-[9px] text-crimson/90 dark:text-crimson/80 font-extrabold uppercase font-mono block">READINES COUNTDOWN</span>
                    <span className="text-2xl font-black text-white mt-1 block">{examReadiness.daysRemaining} Days</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Strategic Leadership Exam</p>
                  </div>
                  <div className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 p-4 rounded-2xl">
                    <span className="text-[9px] text-[#00E5A8] font-extrabold uppercase font-mono block">READINESS GRADE</span>
                    <span className="text-2xl font-black text-[#00E5A8] mt-1 block">{examReadiness.progress}%</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{examReadiness.confidence}</p>
                  </div>
                  <div className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 p-4 rounded-2xl">
                    <span className="text-[9px] text-amber-400 font-extrabold uppercase font-mono block">WEAK AREAS DETECTED</span>
                    <span className="text-2xl font-black text-amber-500 mt-1 block">{examReadiness.weakAreas.length} Concepts</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Requires active retrieval practice</p>
                  </div>
                </div>

                {/* Socratic Prep Test Mock UI */}
                <div className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700 rounded-3xl p-5 text-left space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700/85 pb-3">
                    <span className="text-xs font-black text-white uppercase tracking-wider">Accredited Mock testing practice block</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Bloom Taxonomy Level 8 Alignment</span>
                  </div>

                  {!mockExamFinished ? (
                    <div className="space-y-5">
                      {mockQuestions.map((q, qindex) => (
                        <div key={q.id} className="space-y-2">
                          <p className="text-xs font-black text-indigo-100">{qindex+1}. {q.q}</p>
                          <div className="grid grid-cols-1 gap-2 pl-3">
                            {q.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => setMockSelectedAnswers({...mockSelectedAnswers, [q.id]: idx})}
                                className={`w-full text-left p-3 rounded-xl text-xs font-bold border transition ${mockSelectedAnswers[q.id] === idx ? 'bg-[#A51C30]/10 border-[#A51C30] text-crimson dark:text-crimson/90' : 'bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-300'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={handleScoreMockExam}
                        className="w-full py-2.5 bg-gradient-to-r from-crimson to-rose-600 hover:opacity-95 text-xs font-black uppercase text-white rounded-xl shadow-lg transition"
                      >
                        Submit Answers & Parse Explanations
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in text-xs">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-505/25 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 size={24} className="text-[#00C853]" />
                        <div>
                          <p className="font-extrabold text-white text-sm">Exam Score: {mockExamScore}% Passed</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Retrieved correct knowledge outcomes. Handout and certificates updated in analytics tracker.</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {mockQuestions.map((q, qindex) => (
                          <div key={q.id} className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 p-3.5 rounded-xl space-y-1">
                            <p className="font-black text-indigo-100">{qindex+1}. {q.q}</p>
                            <p className="text-emerald-400 font-extrabold">Correct Answer: {q.options[q.correct]}</p>
                            <p className="text-slate-500 dark:text-slate-400 pt-1 text-[11px] leading-normal italic">
                              💡 Explanation: {q.exp}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setMockExamFinished(false);
                          setMockSelectedAnswers({});
                        }}
                        className="py-1.5 px-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/85 rounded-lg text-slate-500 dark:text-slate-400"
                      >
                        Reset Mock Practice
                      </button>
                    </div>
                  )}

                </div>

              </motion.div>
            )}

            {/* SUBVIEW 7: KNOWLEDGE GRAPH INTERACTIVE NETWORKS */}
            {activeTab === 'knowledge-map' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-left space-y-4"
              >
                <div>
                  <h3 className="text-base font-black text-white">Sovereign Knowledge Network Map</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explore curriculum competencies visually. Click nodes to trace academic compliance dependencies.</p>
                </div>

                {/* SVG Graph visual drawing space */}
                <div className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 h-64 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#1c2242_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  
                  {/* Dynamic Nodes layout mapping */}
                  <div className="relative z-10 w-full flex items-center justify-center my-6 gap-6 flex-wrap">
                    {[
                      { id: 'lead', label: '1. Strategic Leadership', color: selectedKNode === 'lead' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/25' },
                      { id: 'gov', label: '2. Governance Constraints', color: selectedKNode === 'gov' ? 'bg-crimson text-white shadow-lg' : 'bg-crimson/10 text-crimson dark:text-crimson/90 border border-crimson/20 animate-pulse' },
                      { id: 'strat', label: '3. Strategic Execution', color: selectedKNode === 'strat' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-950/15 text-indigo-300 border border-indigo-900/25' },
                      { id: 'inno', label: '4. Localized Innovation', color: selectedKNode === 'inno' ? 'bg-slate-800 text-white border-slate-700' : 'bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 text-slate-500 border border-gray-200 dark:border-gray-700' }
                    ].map(node => (
                      <button
                        key={node.id}
                        onClick={() => { setSelectedKNode(node.id); addXp(10, `Explored ${node.label}`); }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${node.color}`}
                      >
                        {node.label}
                      </button>
                    ))}
                  </div>

                  {/* Nodes link path description block */}
                  <div className="relative z-10 bg-[#0a0d1d]/90 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-left max-w-lg mx-auto">
                    <p className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono text-center">Interactive Graph Dependencies Flow</p>
                    <p className="text-[10.5px] text-slate-350 mt-1 leading-relaxed text-center">
                      Strategic Leadership (Done) → Governance & Accreditation (Active) → Execution (Locked) → Innovation
                    </p>
                  </div>
                </div>

                {/* Node details */}
                <div className="bg-[#12162a]/80 border border-gray-200 dark:border-gray-700/85 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-indigo-950 pb-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Network size={14} className="text-[#00E5A8]" />
                      <span>{knowledgeNodes[selectedKNode as keyof typeof knowledgeNodes].name}</span>
                    </h4>
                    <span className="text-[9.5px] font-mono uppercase bg-rose-50/60 dark:bg-rose-950/20 border border-blue-900/30 text-crimson px-2.5 py-1 rounded-full font-bold">
                      {knowledgeNodes[selectedKNode as keyof typeof knowledgeNodes].status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-350 leading-normal mb-1">{knowledgeNodes[selectedKNode as keyof typeof knowledgeNodes].desc}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-crimson/90 dark:text-crimson/80 uppercase font-mono font-bold block">Assigned Lessons</span>
                      <ul className="text-[10.5px] text-slate-500 dark:text-slate-400 list-disc pl-4 space-y-0.5">
                        {knowledgeNodes[selectedKNode as keyof typeof knowledgeNodes].lessons.map(les => (
                          <li key={les}>{les}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-[#00E5A8] uppercase font-mono font-bold block">Course Assessments</span>
                      <ul className="text-[10.5px] text-slate-500 dark:text-slate-400 list-disc pl-4 space-y-0.5">
                        {knowledgeNodes[selectedKNode as keyof typeof knowledgeNodes].assessments.map(ass => (
                          <li key={ass}>{ass}</li>
                        ))}
                        {knowledgeNodes[selectedKNode as keyof typeof knowledgeNodes].assessments.length === 0 && (
                          <span className="text-[10px] italic text-slate-500">None parsed yet</span>
                        )}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => addXp(20, "Triggered localized tutorial check")}
                    className="w-full py-1.5 bg-[#A51C30] hover:bg-crimson rounded-lg text-[10.5px] font-black uppercase text-white tracking-wider text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Execute Active Study Diagnostics</span>
                    <ArrowRight size={11} />
                  </button>
                </div>

              </motion.div>
            )}

            {/* SUBVIEW 8: ACTIVE AI INTERACTIVE WHITEBOARD */}
            {activeTab === 'whiteboard' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-left space-y-4 shadow-xl"
              >
                <div>
                  <h3 className="text-base font-black text-white">Dynamic AI Blackboard Concept Canvas</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Visualize and connect strategy nodes in real-time. Double tap or append ideas for immediate AI translation.</p>
                </div>

                {/* Simulated Canvas field */}
                <div className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 h-72 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#060812] bg-[radial-gradient(#1c2242_1px,transparent_1px)] [background-size:20px_20px] opacity-55"></div>
                  
                  {/* Drawing / Mind nodes map rendering */}
                  {wbNodes.map(node => (
                    <motion.div
                      key={node.id}
                      drag
                      dragMomentum={false}
                      className="absolute p-3 rounded-2xl text-[10px] font-black text-white shadow-xl cursor-move flex items-center justify-between gap-1 border border-white/15 select-none"
                      style={{ left: node.x, top: node.y }}
                    >
                      <span className={`h-2 w-2 rounded-full ${node.color}`}></span>
                      <span>{node.text}</span>
                    </motion.div>
                  ))}

                  <div className="absolute bottom-4 right-4 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 p-2 rounded-lg text-[10px] font-mono text-slate-550 z-20">
                    💡 Drag concept cards anywhere to cluster them
                  </div>
                </div>

                {/* Toolbar controls append node */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newWbText}
                    onChange={(e) => setNewWbText(e.target.value)}
                    placeholder="Type a new strategy concept card..." 
                    className="w-full bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700/85 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200"
                  />
                  <button 
                    onClick={() => {
                      if (!newWbText.trim()) return;
                      const randomOffset = Math.floor(Math.random() * 140) + 50;
                      setWbNodes([...wbNodes, { id: `wn-${Date.now()}`, x: randomOffset, y: randomOffset, text: newWbText, color: 'bg-[#A51C30]' }]);
                      setNewWbText('');
                      addXp(30, "Appended whiteboard conceptual card");
                    }}
                    className="px-4 py-2 bg-[#A51C30] hover:bg-crimson rounded-xl text-xs font-black text-white whitespace-nowrap"
                  >
                    + Add Card
                  </button>
                  <button 
                    onClick={() => {
                      setWbNodes([
                        { id: 'wn1', x: 200, y: 100, text: 'Digital Leadership Foundations', color: 'bg-crimson' },
                        { id: 'wn2', x: 100, y: 220, text: 'Strategic Execution', color: 'bg-indigo-500' },
                        { id: 'wn3', x: 300, y: 220, text: 'Governance Frameworks', color: 'bg-teal-500' },
                        { id: 'wn4', x: 200, y: 340, text: 'Systemic Transformation', color: 'bg-emerald-500' },
                      ]);
                      addXp(10, "Whiteboard concept clusters reset");
                    }}
                    className="p-2 border border-gray-200 dark:border-gray-700/85 text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs"
                    title="Reset mind maps"
                  >
                    Reset Map
                  </button>
                </div>

              </motion.div>
            )}

            {/* SUBVIEW 9: STUDY MODE & PROGRESS OVERVIEW */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Immersive Welcome Area */}
                <div className="bg-[#12162a] border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-left relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                  <div className="absolute right-0 top-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-black text-white leading-tight">Welcome to your Personal Growth Center, Lusimadio 👋</h3>
                    <p className="text-xs text-slate-405 leading-relaxed text-slate-500 dark:text-slate-400">
                      Your diagnostic parameters are locked. Socratic tutor, exam prep testing suite, custom micro-certificates and dynamic compliance reviews stand ready in your workspace.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-indigo-950">
                    <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block">Quick launching activities:</span>
                    <button 
                      onClick={() => { setActiveTab('ask-tutor'); addXp(5, "Tapped continue"); }}
                      className="px-3.5 py-1.5 bg-[#A51C30] hover:bg-crimson text-[10.5px] rounded-lg font-black text-white shadow"
                    >
                      Continue Leadership Framework
                    </button>
                    <button 
                      onClick={() => { setActiveTab('exam-prep'); addXp(5, "Tapped mock"); }}
                      className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/85 hover:bg-slate-800 text-[10.5px] rounded-lg font-bold text-slate-700 dark:text-slate-300"
                    >
                      Practice Socratic Exam Questions
                    </button>
                  </div>
                </div>

                {/* Socratic recommended tasks list */}
                <div className="space-y-3 text-left">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1 font-mono">
                    Adaptive Recommendations For You
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { type: "Leadership", title: "Practice Governance Framework Quiz", xp: 100, completed: false, action: () => setActiveTab('exam-prep') },
                      { type: "Compliance", title: "Review SETA sovereign data limits", xp: 50, completed: true, action: () => setActiveTab('knowledge-map') },
                      { type: "Socratic Dialog", title: "Defend strategic claims verbally via Mic", xp: 120, completed: false, action: () => setActiveTab('voice-tutor') },
                      { type: "Visual Mind Map", title: "Reorder whiteboards and coordinate logic", xp: 40, completed: false, action: () => setActiveTab('whiteboard') }
                    ].map((rec, index) => (
                      <button
                        key={index}
                        onClick={() => { rec.action(); addXp(10, `Recommended: ${rec.title}`); }}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/85 hover:border-crimson/50 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 flex items-start gap-3.5"
                      >
                        <div className="p-2 bg-crimson/10 border border-crimson/20 text-crimson/90 dark:text-crimson/80 rounded-lg mt-0.5">
                          {rec.completed ? <Check size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        </div>
                        <div className="space-y-1 truncate-all">
                          <span className="text-[9px] text-[#00E5A8] font-bold uppercase tracking-wider font-mono block">
                            {rec.type} • +{rec.xp} XP
                          </span>
                          <p className="text-xs font-black text-white leading-snug">
                            {rec.title}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: STUDY TEXTS AND SACRED LIBRARIES */}
            {activeTab === 'research-library' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700 rounded-3xl p-6 text-left space-y-4"
              >
                <div>
                  <h3 className="text-base font-black text-white font-serif">Academic Research & Sacred Library</h3>
                  <p className="text-xs text-slate-450 mt-1">Review authenticated journal publications, historical ethical texts, and NQF regulatory parameters.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: "Epistemological Boundaries of Distributive Leadership", authors: "A. Cole, L. Mensah", journal: "NQF Board Review V14", text: "Under represented African micro-economies demand stackable decentralized qualification tracks..." },
                    { title: "Patristic Ethics of Digital Wealth Stewardship", authors: "Rev. Dr. Joseph Vance", journal: "Journal of Faith & Technology Ethics", text: "Stewardship demands that technological scalability prioritizes localized infrastructure parity and ethical bounds..." }
                  ].map((paper, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-slate-855 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-crimson/90 dark:text-crimson/80 uppercase font-mono font-bold tracking-wider">{paper.journal}</span>
                        <button 
                          onClick={() => addXp(20, "Research reference appended")}
                          className="text-[9px] text-[#00E5A8] font-mono border border-[#00E5A8]/20 px-2 py-0.5 rounded"
                        >
                          Cite Reference
                        </button>
                      </div>
                      <h4 className="text-xs font-black text-white leading-snug">{paper.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">By {paper.authors}</p>
                      <p className="text-[11px] text-slate-350 leading-relaxed font-mono mt-1 border-l border-gray-200 dark:border-gray-700/85 pl-3">
                        "{paper.text}"
                      </p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => addXp(25, "Synchronized study books folder")}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-lg text-center"
                >
                  Search Database for Citation Keywords
                </button>
              </motion.div>
            )}

            {/* TAB: ANALYTICS MASTERY PROGRESS */}
            {activeTab === 'analytics-dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a] border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-left space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-white">Interactive Mastery Metrics Center</h3>
                  <p className="text-xs text-[#00E5A8] mt-1">Focusing strictly on performance outcomes, verified credits, and competency benchmarks.</p>
                </div>

                {/* Main analytics scores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Learning Health Score", val: "87%", color: "text-emerald-400", desc: "Socratic discovery multiplier high" },
                    { label: "Strategic Leadership", val: "92%", color: "text-crimson/90 dark:text-crimson/80", desc: "3 competencies verified" },
                    { label: "Accredited Outcomes", val: "12 Credits", color: "text-cyan-400", desc: "NQF Unit standards compliant" },
                    { label: "System Calibration", val: "Pass Forecast", color: "text-emerald-400", desc: "Mock exam parameters standard" }
                  ].map(stat => (
                    <div key={stat.label} className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 p-3.5 rounded-2xl">
                      <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">{stat.label}</span>
                      <span className={`text-xl font-black mt-1 block ${stat.color}`}>{stat.val}</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{stat.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Simulated Chart visualization graph */}
                <div className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl relative overflow-hidden space-y-3">
                  <span className="text-[9.5px] text-crimson/90 dark:text-crimson/80 uppercase font-mono font-bold tracking-widest block">Cognitive Learning Velocity Cycle</span>
                  <div className="h-28 flex items-end justify-between gap-2.5 pt-4">
                    {[30, 45, 60, 50, 75, 90, 85].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div 
                          className="bg-gradient-to-t from-[#A51C30] to-[#00E5A8] w-full rounded-t-lg transition-all duration-500"
                          style={{ height: `${h}px` }}
                        ></div>
                        <span className="text-[8px] text-slate-500 font-mono">Week {i+1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10.5px] text-slate-450 italic mt-2 text-center text-slate-450">
                    Velocity metrics indicate optimal study rhythm. Keep active stream up to trigger remedial badges.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB: GOALS & STREAKS DETAILS */}
            {activeTab === 'streaks-goals' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e1a]/85 border border-gray-200 dark:border-gray-700/85 rounded-3xl p-6 text-left space-y-5"
              >
                <div>
                  <h3 className="text-base font-black text-white font-serif">Today's Daily Goals & Achievements</h3>
                  <p className="text-xs text-slate-450 mt-1">Satisfy active daily goals to keep your {streak}-day active study streak going and level up.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Define Sovereign Data Jurisdictions", xp: 120, completed: false },
                    { title: "Identify regional SETA standards constraints", xp: 80, completed: true },
                    { title: "Socratic verbal micro-defense check", xp: 150, completed: false }
                  ].map((goal, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${goal.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-slate-500'}`}>
                          {goal.completed ? <Check size={14} /> : <Plus size={14} />}
                        </div>
                        <span className={`text-xs font-black ${goal.completed ? 'text-slate-450 line-through' : 'text-slate-200'}`}>
                          {goal.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-500 font-mono font-bold font-extrabold">+ {goal.xp} XP</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => addXp(20, "Claimed milestone reward points")}
                  className="w-full py-2 bg-gradient-to-r from-crimson to-rose-600 hover:opacity-90 rounded-xl text-xs font-black text-white"
                >
                  Verify Daily Progress & Update Leaderboard
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT PANEL (20% - ColSpan 3): Learning Companion Metrics & Shortcuts */}
        <div className="lg:col-span-3 space-y-4 text-left">
          
          {/* Achievement Trophy case */}
          <div className="bg-[#12162a]/95 border border-gray-200 dark:border-gray-700/85 rounded-2xl p-4 shadow-md text-left space-y-3 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"></div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-crimson/90 dark:text-crimson/80 font-extrabold uppercase font-mono tracking-wider">UNLOCKED COMPETENCY BADGES</span>
              <Award className="text-yellow-400 animate-pulse" size={15} />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {unlockedBadges.map(badge => (
                <span 
                  key={badge} 
                  className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40 text-indigo-200 border border-gray-200 dark:border-gray-700 text-[9.5px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 hover:border-amber-400 transition"
                >
                  🏆 <span>{badge}</span>
                </span>
              ))}
            </div>

            <button 
              onClick={() => {
                setUnlockedBadges([...unlockedBadges, 'Research Master']);
                addXp(100, `Unlocked Research Master Badge!`);
              }}
              className="w-full py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-slate-850 text-[10px] text-slate-600 dark:text-slate-700 dark:text-slate-300 hover:text-crimson font-bold rounded-lg transition"
            >
              Unlock Next Level Milestone badge
            </button>
          </div>

          {/* Quick study metrics panel */}
          <div className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40/60 border border-gray-200 dark:border-gray-700/85/85 rounded-2xl p-4 text-left space-y-3.5">
            <span className="text-[10px] text-slate-505 font-black uppercase tracking-widest font-mono">Learning Companion Stats</span>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800/60 p-2 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Course Completion:</span>
                <span className="text-white font-black">74% Complete</span>
              </div>
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800/60 p-2 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Knowledge Mastery:</span>
                <span className="text-[#00E5A8] font-black">890/1000 Pts</span>
              </div>
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800/60 p-2 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Learning Velocity:</span>
                <span className="text-crimson dark:text-crimson/90 font-black">95% (Stable)</span>
              </div>
            </div>
          </div>

          {/* Core high value quick tools dock */}
          <div className="bg-gray-50 dark:bg-gray-950/80 border border-slate-200/40 dark:border-gray-200 dark:border-gray-700/85/40/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-left space-y-2">
            <span className="text-[9.5px] text-[#00E5A8] font-extrabold uppercase font-mono tracking-widest block">COMPANION QUICK ACTIONS</span>
            <div className="space-y-1">
              {[
                { label: "Generate Study Notes", action: () => { setMessages(p => [...p, { id: `na-${Date.now()}`, sender: 'ai', text: "✓ Done. Synthesized detailed NQF-standard revision notes on epistemological bounds.", timestamp: 'Now' }]); addXp(20, "Synthesized study handouts"); } },
                { label: "Create Active Flashcards", action: () => { setActiveTab('study-mode'); addXp(20, "Launched Flashcards Drawer"); } },
                { label: "Summarize Syllabus", action: () => { setMessages(p => [...p, { id: `sy-${Date.now()}`, sender: 'ai', text: "✓ Mapped summary: Leadership course focuses on Strategic Governance, regional sovereignty dependencies, and stakeholder consensus models.", timestamp: 'Now' }]); addXp(20, "Generated summary cards"); } },
                { label: "Practice Adaptive Socratic Quiz", action: () => { setActiveTab('exam-prep'); addXp(20, "Quiz workspace activated"); } },
              ].map((tool, idx) => (
                <button
                  key={idx}
                  onClick={tool.action}
                  className="w-full text-left p-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-gray-700 hover:border-[#A51C30]/40 rounded-xl transition flex justify-between items-center"
                >
                  <span>{tool.label}</span>
                  <Plus size={11} className="text-crimson/90 dark:text-crimson/80" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AITutorView;
