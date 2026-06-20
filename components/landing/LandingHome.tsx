import React, { useState, useEffect } from 'react';
import { 
  Globe, Sparkles, Shield, Cpu, Network, Users, BookOpen, Award, Database, 
  Map, HardDrive, ArrowRight, Brain, Zap, Search, Eye, HelpCircle, CheckCircle, 
  Check, Play, ArrowUpRight, CheckCircle2, Star, TrendingUp, ShieldAlert, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingHomeProps {
  onGetStarted: () => void;
}

export default function LandingHome({ onGetStarted }: LandingHomeProps) {
  // Section 2: Infrastructure Animation State
  const [activeLayer, setActiveLayer] = useState<'student' | 'instructor' | 'department' | 'institution' | 'research' | 'cloud'>('student');
  
  // Section 3: Academic Ecosystem Module State
  const [selectedModule, setSelectedModule] = useState<string>('learner-hub');

  // Section 4: AI Knowledge Cloud Demo State
  const [selectedTerm, setSelectedTerm] = useState<string>('Renewable Energy');
  const [customTerm, setCustomTerm] = useState<string>('');
  
  // Section 6: Student Verification Engine State
  const [studentId, setStudentId] = useState<string>('COG-992-KE');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  // Section 11: Testimonial Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);

  // Live Counter state for numerical sections
  const [metrics, setMetrics] = useState({
    learners: 4100000,
    institutions: 8200,
    resources: 42000000,
    countries: 42,
    connections: 84000000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        learners: prev.learners + Math.floor(Math.random() * 5) + 1,
        institutions: prev.institutions,
        resources: prev.resources + Math.floor(Math.random() * 3) + 1,
        countries: 54, // Target representing 54 nations of Africa
        connections: prev.connections + Math.floor(Math.random() * 11) + 2
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Section 2 Infrastructure steps data
  const infraLayers = [
    {
      id: 'student',
      title: '1. Verified Learner',
      description: 'The atom of the ecosystem. Students gain secure digital credentials, micro-credentials, and personal offline-capable AI tutoring companions.',
      stat: '5M+ Learners Activated',
      color: 'from-red-600 to-rose-500'
    },
    {
      id: 'instructor',
      title: '2. Empowered Educator',
      description: 'Instructors utilize intelligent AI curriculum builders to auto-generate courses and publish premium content to the continental marketplace.',
      stat: '25,000+ Deployed Educators',
      color: 'from-rose-500 to-red-500'
    },
    {
      id: 'department',
      title: '3. Smart Department',
      description: 'Head of Departments govern curriculum drifts, assign teaching workloads, and automate lecture approval workflows with absolute version control.',
      stat: '3,400+ Department Portals',
      color: 'from-red-650 to-red-400'
    },
    {
      id: 'institution',
      title: '4. Enterprise Campus',
      description: 'Chancellor and Board members oversee student engagement drop-offs, track revenue streams on-chain, and administrate multi-campus setups seamlessly.',
      stat: '10,000+ Active Campuses',
      color: 'from-red-700 to-rose-600'
    },
    {
      id: 'research',
      title: '5. Connected Research Network',
      description: 'Researchers upload secure citations, map DOI hashes, and co-collaborate on high-tier Pan-African studies with dedicated government nodes.',
      stat: '50M+ Research Data Connections',
      color: 'from-rose-600 to-orange-500'
    },
    {
      id: 'cloud',
      title: '6. Africa Knowledge Cloud',
      description: 'The ultimate academic operating system. All decentralized repositories and institutional networks compiled into a secure, single sovereignty node.',
      stat: '100% Academic Sovereignty',
      color: 'from-red-600 to-orange-600'
    }
  ];

  // Section 3 Modules list
  const modules = [
    {
      id: 'learner-hub',
      title: 'Learner Hub',
      stat: 'Active adaptive learning path',
      icon: Users,
      desc: 'Seamless personal dashboard featuring offline-first course lectures, dynamic blockchain micro-credentials, and peer-to-peer messaging forums.',
      details: 'Integrates real-time diagnostic quiz engine checking conceptual gaps directly.'
    },
    {
      id: 'inst-library',
      title: 'Institutional Library',
      stat: 'Sovereign digital preservation',
      icon: Library,
      desc: 'Centralized repository with automated citation hashes, advanced metadata categorization, and instant PDF download security triggers.',
      details: 'Transforms raw assets into encrypted offline-first packages with legal proof-of-ownership.'
    },
    {
      id: 'marketplace',
      title: 'Instructor Marketplace',
      stat: 'Direct-to-learner payouts',
      icon: Zap,
      desc: 'Let educators directly publish interactive courses, rent laboratory slides, and track mobile money (M-Pesa, MTN, Airtel) sales shares natively.',
      details: 'Pre-fitted with instant contract micro-transacts splitting 90% revenue directly to creators.'
    },
    {
      id: 'research-cloud',
      title: 'Research Cloud',
      stat: 'High-throughput cataloging',
      icon: Network,
      desc: 'Pan-African collaborative workspace securely preserving on-chain document hashes, citation metrics, and sovereign peer-reviews.',
      details: 'Directly hooks into global registries and university cluster systems.'
    },
    {
      id: 'verification',
      title: 'Student Verification',
      stat: 'Instant trusted credentialing',
      icon: Shield,
      desc: 'Eliminate credential fraud overnight. Employers verify academic status, degrees, and grades in 3 seconds via immutable cryptographic signatures.',
      details: 'Direct SIS integrations supporting student discount verification instantly.'
    },
    {
      id: 'curriculum-intel',
      title: 'Curriculum Intelligence',
      stat: 'Accreditation alignment check',
      icon: Brain,
      desc: 'Automated auditing mapping local course syllabus items to international standard matrices and accreditation parameters.',
      details: 'Pre-detects structural curriculum drifts across separated campus databases.'
    },
    {
      id: 'ai-assistant',
      title: 'AI Academic Assistant',
      stat: 'Next-gen LLM integration',
      icon: Cpu,
      desc: 'Contextual tutor answering localized student questions, auto-suggesting course slides to professors, and drafting department compliance papers.',
      details: 'Powered by highly trained local knowledge pipelines without data leakage risk.'
    },
    {
      id: 'cert-engine',
      title: 'Certification Engine',
      stat: 'Blockchain backed credentials',
      icon: Award,
      desc: 'Issue verified tamper-proof diplomas and learning badges backed by cryptographically verifiable blockchain standards.',
      details: 'Supports native PDF embedding with direct single-click QR authenticity verification.'
    }
  ];

  // Section 4 mapping data details
  const knowledgeMapData: Record<string, { courses: string[]; researchers: string[]; universities: string[]; papers: string[] }> = {
    'Renewable Energy': {
      courses: ['Solar PV Microgrid Dynamics', 'Hydro-Electric Turbine Modeling', 'Wind Battery Array Architecture'],
      researchers: ['Dr. Sarah Mwangi', 'Prof. Maryam Al-Mansoor', 'Eng. Fatoumata Diallo'],
      universities: ['Kenyatta University', 'University of Cape Town', 'Ashesi University'],
      papers: ['Decentralized Solar Load-bearing Parameters v2', 'Bio-chemical Kinetic Systems in Agronomy']
    },
    'Decentralized Agronomy': {
      courses: ['Precision Farming in Sahel', 'Bio-Chemical Crop Diagnostics', 'Sub-Saharan Fertilizer Scaling'],
      researchers: ['Dr. James Adebayo', 'Prof. Helen Naidoo', 'Auditor Charles Kamau'],
      universities: ['Makerere University', 'Lilongwe University', 'University of Ibadan'],
      papers: ['Localized Soil Microgrid Data Arrays', 'Nitrogen Cycling in Renewable Orchards']
    },
    'Fintech Infrastructure': {
      courses: ['Mobile Money Protocol Engineering', 'Distributed Ledgers for Micro-Credit', 'Pan-African Settlement APIs'],
      researchers: ['Chancellor Maryam Al-Mansoor', 'Dr. Sarah Ndlovu', 'Prof. David Nkosi'],
      universities: ['Strathmore University', 'University of Witwatersrand', 'Accra Institute of Technology'],
      papers: ['On-Chain Revenue Split Audits on M-Pesa', 'SSO Gateways for Rural Student Financial Index']
    }
  };

  const handleVerifyStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (studentId.toUpperCase() === 'COG-992-KE') {
        setVerificationResult({
          status: 'SUCCESS',
          name: 'Adewale Mensah',
          institution: 'CogniSacra Sovereign University',
          campus: 'Nairobi Main Campus',
          credential: 'Bachelor of Science (First Class Hons) in Sustainable Microgrids',
          issuedDate: 'November 24, 2025',
          hash: '0xBD79A814F912...C83'
        });
      } else {
        setVerificationResult({
          status: 'NOT_FOUND',
          studentId: studentId
        });
      }
    }, 1500);
  };

  // Section 11 Testimonials List
  const testimonials = [
    {
      quote: "CogniSacra has completely transformed our sovereign administration. Hosting multiple campuses under a single unified dashboard while retaining departmental curriculum control is a massive leap forward for higher education in Africa.",
      name: "Prof. Maryam Al-Mansoor",
      title: "Vice Chancellor, STEM Agronomy Institute",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      quote: "As an instructor, the automated AI course outline generator and direct billing to students mobile money accounts solved our biggest bottlenecks. We monetize peer-vetted papers within 3 minutes of upload approval.",
      name: "Dr. Sarah Mwangi",
      title: "Senior Lecturer, Sustainable Resources",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      quote: "Applying for on-chain scholarship credentials used to take 3 weeks of physical stamps. On CogniSacra, my verified academic fingerprint was vetted by independent registrars and unlocked my study grants instantly.",
      name: "Adewale Mensah",
      title: "Decentralized Microgrid Student Scholar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5
    }
  ];

  return (
    <div className="bg-white text-slate-900 font-sans antialiased relative overflow-hidden pt-12">
      
      {/* Decorative red theme ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-gradient-to-tr from-red-100/40 to-rose-200/20 filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[50%] rounded-full bg-gradient-to-tr from-rose-100/30 to-red-50/15 filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[30%] rounded-full bg-gradient-to-br from-red-100/20 to-slate-100/10 filter blur-[100px] pointer-events-none z-0" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(239,68,68,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80" />

      {/* SECTION 1: HERO EXPERIENCE (Full Screen Immersive Hero) */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-16 md:py-24 z-10 px-4">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-150/80 shadow-[0_4px_25px_rgba(239,68,68,0.06)] transform transition duration-300 hover:scale-105">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-650">
                CogniShield Deployment Active <span className="text-red-600">•</span> Sovereign Protocol
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight font-sans leading-none text-slate-900">
              Africa's First <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-755">Academic Digital</span> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-650 via-red-500 to-rose-600 drop-shadow-[0_2px_10px_rgba(220,38,38,0.15)] animate-pulse">Infrastructure</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              "This is not another LMS. This is the digital infrastructure powering the future of education across Africa." Empowering learners, educators, researchers, and institutions through one intelligent ecosystem for learning, publishing, verification, research, and academic innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-red-600 to-rose-550 hover:from-rose-550 hover:to-red-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_6px_25px_rgba(239,68,68,0.22)] hover:shadow-[0_8px_35px_rgba(239,68,68,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Start Free</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-205 text-slate-800 hover:border-red-500 hover:text-red-600 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Book Institutional Demo</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="text-2xl font-black text-slate-900 block">50M+</span>
                <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Encrypted Books</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl font-black text-red-600 block">99.9%</span>
                <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Accreditation Match</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl font-black text-slate-900 block">54</span>
                <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Nations Connected</span>
              </div>
            </div>
          </div>

          {/* Living 3D-styled Digital Africa Globe (Red and White themed) */}
          <div className="lg:col-span-5 relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-100/30 to-rose-200/10 rounded-full filter blur-xl animate-pulse" />
            
            {/* Core rotating orbital grid */}
            <div className="relative w-80 h-80 rounded-full border border-red-100 flex items-center justify-center animate-[spin_25s_linear_infinite]">
              <div className="absolute w-72 h-72 rounded-full border border-red-50/80 border-dashed" />
              <div className="absolute w-44 h-44 rounded-full border border-rose-200 flex items-center justify-center" />
              
              {/* Floating nodes with absolute position */}
              <div className="absolute top-2 left-10 bg-white border border-red-200 rounded-lg p-1.5 text-[8px] font-mono shadow-[0_4px_15px_rgba(239,68,68,0.06)] whitespace-nowrap text-red-650 font-black z-20">
                ● University of Cape Town Node
              </div>
              <div className="absolute bottom-10 right-0 bg-white border border-red-200 rounded-lg p-1.5 text-[8px] font-mono shadow-[0_4px_15px_rgba(239,68,68,0.06)] whitespace-nowrap text-red-650 font-black z-20">
                ● Makerere Academic Hub
              </div>
            </div>

            {/* Simulated 3D Africa Map Node Graph in Red Accent */}
            <div className="absolute w-72 h-72 pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 200 220" className="w-full h-full text-red-600 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.15)]" fill="currentColor">
                <path d="M70,25 C110,15 150,30 160,70 C165,110 140,140 125,170 C120,180 115,190 110,210 C105,190 98,180 91,170 C70,140 50,110 55,75 C58,35 63,28 70,25 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" className="text-red-300 animate-[pulse_3s_infinite]" />
                
                {/* Network edge connections */}
                <line x1="70" y1="25" x2="110" y2="210" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1" />
                <line x1="160" y1="70" x2="91" y2="170" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="1" />
                <line x1="55" y1="75" x2="160" y2="70" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1" />
                
                {/* Glowing dots */}
                <circle cx="110" cy="50" r="5" className="text-white fill-red-600 animate-pulse" />
                <circle cx="140" cy="90" r="4.5" className="text-rose-500 fill-rose-500" />
                <circle cx="85" cy="80" r="5" className="text-red-500 fill-red-500 animate-pulse" />
                <circle cx="112" cy="120" r="6" className="text-white fill-red-600 animate-pulse" />
                <circle cx="110" cy="180" r="4" className="text-rose-500 fill-rose-500" />
                <circle cx="75" cy="130" r="5" className="text-red-500 fill-red-500" />
                
                {/* Floating books translating into cloud particles representation */}
                <g className="animate-bounce">
                  <rect x="95" y="30" width="8" height="6" rx="1" fill="#DC2626" />
                  <rect x="145" y="110" width="7" height="5" rx="1" fill="#F43F5E" />
                </g>
              </svg>
            </div>

            {/* Holographic style white grid panels with red borders */}
            <div className="absolute right-0 top-1/4 bg-white border border-red-50 p-4 rounded-2xl shadow-[0_8px_30px_rgba(239,68,68,0.06)] max-w-[150px] space-y-1 transform rotate-6 hover:rotate-0 transition duration-300">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Research Papers</span>
              <p className="text-xs font-black font-sans text-slate-900">42.1M Active</p>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-red-600 rounded-full" />
              </div>
            </div>

            <div className="absolute left-2 bottom-8 bg-white border border-red-50 p-4 rounded-2xl shadow-[0_8px_30px_rgba(239,68,68,0.06)] max-w-[150px] space-y-1 transform -rotate-6 hover:rotate-0 transition duration-300">
              <span className="text-[8px] uppercase tracking-wider text-red-600 block font-extrabold">SSO Identity</span>
              <p className="text-xs font-bold text-slate-800">Verified Secure</p>
              <span className="text-[8px] block text-green-600 font-bold">● 100% On-Chain</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: THE INFRASTRUCTURE ANIMATION (How CogniSacra Works) */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-red-600 font-extrabold block">Scale & Architecture</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900">The Pan-African Knowledge Highway</h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">
              Observe how a single student scales up dynamically to power continental academic sovereignty. Select layers to trigger instant rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Layers Selector */}
            <div className="lg:col-span-5 space-y-3">
              {infraLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                    activeLayer === layer.id
                      ? `bg-white border-red-500 shadow-[0_6px_20px_rgba(239,68,68,0.08)]`
                      : 'bg-white border-slate-200/50 hover:border-red-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className={`text-sm md:text-base font-black ${
                      activeLayer === layer.id ? 'text-red-650' : 'text-slate-700'
                    }`}>{layer.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase font-black">{layer.stat}</span>
                  </div>
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    activeLayer === layer.id ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <ArrowUpRight size={14} />
                  </div>
                </button>
              ))}
            </div>

            {/* Right Col: Layer visual showcase panel */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 relative overflow-hidden min-h-[350px] flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
              <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-red-500">
                <Globe size={300} />
              </div>
              
              <AnimatePresence mode="wait">
                {infraLayers.map(layer => layer.id === activeLayer && (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2.5 rounded-2xl bg-gradient-to-r ${layer.color} text-white`}>
                        <Cpu size={20} />
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black font-sans text-slate-900">{layer.title}</h4>
                    </div>

                    <p className="text-slate-650 text-sm sm:text-base leading-relaxed font-semibold">
                      {layer.description}
                    </p>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Live Ecosystem Deployment Scale</span>
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-red-650 font-bold">Active Handshakes</span>
                        <span className="text-[#DC2626] font-black">99.98% Latency Secure</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-11/12 bg-gradient-to-r from-red-600 to-rose-500 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

          {/* Interactive numbers counter bottom segment */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200 text-center">
            <div className="space-y-1 transform hover:scale-105 transition duration-300">
              <p className="text-3xl md:text-5xl font-sans font-black text-slate-900">{metrics.countries}</p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">African Sovereign States</span>
            </div>
            <div className="space-y-1 transform hover:scale-105 transition duration-300">
              <p className="text-3xl md:text-5xl font-sans font-black text-red-600">{(metrics.learners / 1000000).toFixed(1)}M</p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Active Verified Students</span>
            </div>
            <div className="space-y-1 transform hover:scale-105 transition duration-300">
              <p className="text-3xl md:text-5xl font-sans font-black text-slate-900">{(metrics.resources / 1000000).toFixed(0)}M+</p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Vetted Knowledge Assets</span>
            </div>
            <div className="space-y-1 transform hover:scale-105 transition duration-300">
              <p className="text-3xl md:text-5xl font-sans font-black text-red-600">{(metrics.connections / 1000000).toFixed(0)}M+</p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">AI Citations Mapped</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: ACADEMIC ECOSYSTEM (Platform Showcase modules) */}
      <section className="py-24 bg-white relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-red-600 font-black block">Command Center Modules</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900">Unified Module Showcase</h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">
              Each module of the ecosystem features reactive glowing outlines on-focus, rendering standard database integrations instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Grid of Modules Selector */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((mod) => {
                const IconComponent = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModule(mod.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-4 ${
                      selectedModule === mod.id
                        ? 'bg-red-50/50 border-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.1)] ring-1 ring-red-400/20'
                        : 'bg-white border-slate-200 hover:border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className={`p-2.5 rounded-xl ${
                        selectedModule === mod.id ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <IconComponent size={20} />
                      </div>
                      <span className="text-[8px] uppercase tracking-wider font-mono text-slate-400 font-bold">{mod.stat}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className={`text-base font-black ${
                        selectedModule === mod.id ? 'text-red-750' : 'text-slate-800'
                      }`}>{mod.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-semibold">{mod.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Showcase Visual specifications details (Right Col) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="absolute right-[-30px] bottom-[-20px] opacity-10 pointer-events-none text-red-600">
                <Brain size={250} />
              </div>
              
              <AnimatePresence mode="wait">
                {modules.map(mod => mod.id === selectedModule && (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-widest text-red-600 font-black block">Active Selected Module</span>
                      <h3 className="text-2xl md:text-3xl font-black font-sans text-slate-900">{mod.title}</h3>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-rose-100/60 shadow-[0_2px_15px_rgba(239,68,68,0.02)]">
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[9.5px] uppercase tracking-wider font-black text-slate-400 block pb-1 border-b border-slate-200">Integration Specifications</span>
                      <div className="text-xs text-slate-650 leading-relaxed font-semibold">
                        • {mod.details}
                      </div>
                      <div className="text-xs text-slate-650 leading-relaxed font-semibold">
                        • Cryptographic validation speed: &lt; 40ms.
                      </div>
                    </div>

                    <button 
                      onClick={onGetStarted}
                      className="w-full py-4 bg-white border border-red-200 hover:border-red-600 text-red-650 hover:text-white hover:bg-red-600 text-xs font-black uppercase tracking-widest rounded-xl transition duration-300"
                    >
                      Initialize Module Sandbox
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: AI KNOWLEDGE CLOUD (Demo: Renewable Energy etc.) */}
      <section className="py-24 bg-slate-50 border-t border-slate-100 relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-widest text-red-650 font-black block">AI Signature Cloud</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900 leading-tight">
                Every Academic Resource Connected by AI
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
                Type an academic focus or select preset keywords. The artificial neural cloud instantly maps relative courses, active scholars, and peer-reviewed journals.
              </p>

              {/* Tag Selection Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['Renewable Energy', 'Decentralized Agronomy', 'Fintech Infrastructure'].map(term => (
                  <button
                    key={term}
                    onClick={() => { setSelectedTerm(term); setCustomTerm(''); }}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      selectedTerm === term && !customTerm
                        ? 'bg-red-50 text-red-650 border border-red-300 shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    #{term}
                  </button>
                ))}
              </div>

              {/* Interactive Search input */}
              <div className="relative pt-2">
                <Search size={16} className="absolute left-4 top-[22px] text-slate-400" />
                <input
                  type="text"
                  placeholder="Type sovereign search theme or hashtag..."
                  value={customTerm}
                  onChange={(e) => {
                    setCustomTerm(e.target.value);
                    if (knowledgeMapData[e.target.value]) {
                      setSelectedTerm(e.target.value);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 transition shadow-[0_2px_15px_rgba(0,0,0,0.01)]"
                />
              </div>
            </div>

            {/* Neural Net graph (Red and White styled) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02),transparent)]" />
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] uppercase font-black text-slate-500 flex items-center gap-1.5">
                  <Brain size={12} className="text-red-600 animate-pulse" />
                  <span>CogniSeed Neural Net Index</span>
                </span>
                <span className="text-[9px] uppercase font-bold text-red-655 bg-red-50 px-2 py-0.5 rounded-full">Interactive Cloud</span>
              </div>

              {/* Nodes display */}
              <div className="relative flex-1 min-h-[280px] flex items-center justify-center">
                
                {/* Central Root Anchor */}
                <div className="absolute p-4 rounded-2xl bg-gradient-to-tr from-white to-red-50/50 border border-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.15)] text-center max-w-[170px] z-20">
                  <span className="text-[8px] uppercase tracking-wider text-red-600 font-extrabold block">Central Anchor</span>
                  <h4 className="text-xs font-black uppercase text-slate-900 truncate">{customTerm || selectedTerm}</h4>
                </div>

                {/* Left Top Node */}
                <div className="absolute left-2 top-8 bg-white border border-slate-200 p-3 rounded-xl max-w-[130px] space-y-1 transform hover:scale-105 transition duration-300 z-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                  <span className="text-[8px] uppercase tracking-wider text-red-500 font-extrabold block">Active Course</span>
                  <p className="text-[10px] font-bold text-slate-800 line-clamp-2">
                    {knowledgeMapData[selectedTerm]?.courses[0] || 'Dynamic Module Outline'}
                  </p>
                </div>

                {/* Left Bottom Node */}
                <div className="absolute left-10 bottom-4 bg-white border border-slate-200 p-3 rounded-xl max-w-[130px] space-y-1 transform hover:scale-105 transition duration-300 z-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Secondary Path</span>
                  <p className="text-[10px] font-bold text-slate-605 line-clamp-2">
                    {knowledgeMapData[selectedTerm]?.courses[1] || 'Accreditation Syllabi'}
                  </p>
                </div>

                {/* Right Top Node */}
                <div className="absolute right-2 top-10 bg-white border border-slate-200 p-3 rounded-xl max-w-[130px] space-y-1 transform hover:scale-105 transition duration-300 z-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                  <span className="text-[8px] uppercase tracking-wider text-red-500 font-extrabold block">Top Expert</span>
                  <p className="text-[10px] font-bold text-slate-850">
                    {knowledgeMapData[selectedTerm]?.researchers[0] || 'Prof. Maryam Al-Mansoor'}
                  </p>
                </div>

                {/* Right Bottom Node */}
                <div className="absolute right-12 bottom-2 bg-white border border-slate-200 p-3 rounded-xl max-w-[130px] space-y-1 transform hover:scale-105 transition duration-300 z-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Affiliate University</span>
                  <p className="text-[10px] font-semibold text-slate-658">
                    {knowledgeMapData[selectedTerm]?.universities[0] || 'Kenyatta University'}
                  </p>
                </div>

                {/* Connecting SVGs lines in red */}
                <svg className="absolute inset-0 w-full h-full text-slate-200 pointer-events-none z-0">
                  <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="25%" y1="80%" x2="50%" y2="50%" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1.5" />
                  <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1.5" />
                  <line x1="75%" y1="80%" x2="50%" y2="50%" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>

              </div>

              <div className="space-y-1.5 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="text-[8px] uppercase font-black text-red-600 block">Related Research Citation Log</span>
                <p className="text-slate-700 italic font-medium">
                  "{knowledgeMapData[selectedTerm]?.papers[0] || 'Sovereign Knowledge Preservation metrics loaded'}"
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: GLOBAL INSTITUTIONAL LIBRARY (Transforming Books animation effect) */}
      <section className="py-24 bg-white border-y border-slate-100 relative z-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative w-full h-[400px] flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-100/20 to-rose-200/10 rounded-full filter blur-xl animate-pulse" />
            
            {/* Visual Books stack */}
            <div className="relative space-y-3 w-72">
              <div className="p-4 bg-white border border-red-200 rounded-2xl shadow-[0_4px_25px_rgba(239,68,68,0.06)] flex items-center gap-3 transform -rotate-2 hover:rotate-0 transition duration-300">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl font-sans font-black text-xs">PDF</div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Solar PV Kinetics Manual</h4>
                  <p className="text-[9px] text-red-500 font-bold">Approved Core Library</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center gap-3 transform rotate-3 hover:rotate-0 transition duration-300">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-xl font-sans font-extrabold text-xs">DOC</div>
                <div>
                  <h4 className="text-xs font-black text-slate-805">Sahel Bio-Chemical Crop Diagnostic</h4>
                  <p className="text-[9px] text-slate-500 font-semibold">Accredited Syllabus</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center gap-3 transform -rotate-1 hover:rotate-0 transition duration-300">
                <div className="p-2 bg-red-50 text-red-650 rounded-xl font-sans font-black text-xs">XLS</div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Microgrid Array Data Set</h4>
                  <p className="text-[9px] text-green-600 font-bold">M-Pesa Ledger Mapped</p>
                </div>
              </div>
            </div>

            {/* Glowing particle arcs to symbolise books transformation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none text-red-300">
              <path d="M 120 120 Q 200 40 320 180" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className="opacity-50" />
              <path d="M 100 240 Q 220 320 300 150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" className="opacity-40" />
            </svg>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-red-600 font-extrabold block">Digital Preservation</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900 leading-tight">
              Cinematic Global Institutional Library
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
              Publish university assets into encrypted, legally authenticated virtual packages. Books, theses, lab records, and syllabus modules dissolve into digital knowledge particles, indexable and searchable instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-red-605 font-black text-base flex items-center gap-1.5">
                  <Library size={16} />
                  <span>Instant Ingestion</span>
                </span>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Convert standard files into cryptographic index items automatically.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-900 font-black text-base flex items-center gap-1.5">
                  <Shield size={16} className="text-red-600" />
                  <span>Sovereign Copyright</span>
                </span>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Decentralized timestamps protect local academic labor.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: STUDENT VERIFICATION ENGINE */}
      <section className="py-24 bg-white relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-red-600 font-black block">Anti-Fraud Protection</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900">Student Verification Engine</h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">
              Test drive the sovereign identity verification. Enter the dummy student key below to run real-time compliance evaluation against blockchain ledgers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-red-500">
              <Shield size={350} />
            </div>

            <form onSubmit={handleVerifyStudent} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Student ID Code</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. COG-992-KE"
                    className="w-full text-xs font-mono tracking-wider font-bold px-4 py-3.5 border rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
                  />
                  <span className="text-[9px] text-[#DC2626] block font-bold">Use test code: <b>COG-992-KE</b> for verified layout trigger</span>
                </div>

                <div className="sm:col-span-4 pt-5">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-500 hover:from-rose-500 hover:to-red-650 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-900/10 transition duration-300 disabled:opacity-50"
                  >
                    {isVerifying ? 'Evaluating...' : 'Verify Cryptography'}
                  </button>
                </div>

              </div>
            </form>

            <AnimatePresence mode="wait">
              {isVerifying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-red-600 animate-spin" />
                  <p className="text-xs font-mono text-red-600 uppercase tracking-widest font-black">Accessing Deployed Sovereign Ledger...</p>
                </motion.div>
              )}

              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-8 p-6 rounded-2xl border ${
                    verificationResult.status === 'SUCCESS'
                      ? 'border-green-250 bg-green-50/50 space-y-4 shadow-sm'
                      : 'border-red-250 bg-red-50/50 space-y-2 shadow-sm'
                  }`}
                >
                  {verificationResult.status === 'SUCCESS' ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                          <CheckCircle2 size={22} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-green-650 tracking-wider">Identity Confirmed</span>
                          <h4 className="text-lg font-sans font-black text-slate-900">{verificationResult.name}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-green-100 text-xs font-semibold text-slate-700">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Institution</span>
                          <p className="text-slate-900 font-extrabold">{verificationResult.institution}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Campus / Location</span>
                          <p>{verificationResult.campus}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Completed Degree</span>
                          <p className="text-red-605 font-bold">{verificationResult.credential}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Cryptographic Ledger Stamp</span>
                          <p className="font-mono text-[10px] text-slate-500 break-all">{verificationResult.hash}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-105 text-red-600 rounded-full">
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black text-red-600 tracking-wider">Verification Error</span>
                        <h4 className="text-sm font-black text-slate-900">Record Not Resolved</h4>
                        <p className="text-xs text-slate-500 mt-1 font-semibold">
                          The signature "{verificationResult.studentId}" does not map to any deploy block. Inquire directly at local registry desk.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECTION 7: INSTITUTION CONTROL CENTER (3D Dashboard showcase panels) */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 relative z-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-red-600 font-black block">Administration Hub</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900 leading-tight">
              Sovereign Control Center
            </h2>
            <p className="text-slate-650 text-sm md:text-base leading-relaxed font-semibold">
              The Chancellor's desktop provides absolute overview metrics. Manage aggregate course enrollment volumes, download logs, mobile money settlements, and research indexing across state line nodes.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-red-100 text-red-605 rounded-lg mt-0.5"><TrendingUp size={16} /></div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Real-Time Auditable Volume</h4>
                  <p className="text-xs text-slate-500 font-semibold">Track student engagement logs compiled each UTC midnight.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-red-100 text-red-605 rounded-lg mt-0.5"><Users size={16} /></div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Enterprise Accreditation Audits</h4>
                  <p className="text-xs text-slate-500 font-semibold">Direct compliance mappings sent instantly to central education ministers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating dashboard showcase mock */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/30 to-red-50/10 rounded-full filter blur-xl" />
            
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative z-10 space-y-3">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Aggregated Asset Downloads</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900">4,192,204</span>
                <span className="text-xs text-green-600 font-bold">▲ 12.4%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-red-600 rounded-full" />
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative z-10 space-y-3 transform sm:translate-y-6">
              <span className="text-[8px] uppercase tracking-wider text-red-600 font-extrabold block">Total Consolidated Revenue</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900">$2.4M</span>
                <span className="text-xs text-slate-400 font-semibold">MTN/M-Pesa Sync</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-red-600 rounded-full" />
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative z-10 space-y-3">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Active Research Citation Index</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900">104.9M</span>
                <span className="text-xs text-green-600 font-bold">▲ 8.1%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-red-600 rounded-full" />
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-205 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative z-10 space-y-3 transform sm:translate-y-6">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Accreditation Drift Check</span>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={14} />
                <span className="text-xs font-extrabold uppercase">100% Compliant</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">Last checked 3 minutes ago.</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: RESEARCH & INNOVATION NETWORK */}
      <section className="py-24 bg-white relative z-10 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative w-full h-[400px] flex items-center justify-center lg:order-last">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-100/30 to-rose-200/10 rounded-full filter blur-xl animate-pulse" />
            
            {/* Visual representations of connected Universities, Government nodes and Industrial Hubs */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Central Sovereignty Pillar */}
              <div className="p-4 bg-white border border-red-500 rounded-2xl shadow-xl z-20 text-center text-xs font-black uppercase text-slate-800 max-w-[120px]">
                Sovereignty Node
              </div>

              {/* Around Nodes */}
              <div className="absolute top-4 left-4 p-2 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-bold text-slate-658 z-10">
                🏫 Universities
              </div>
              <div className="absolute bottom-4 right-4 p-2 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-bold text-slate-658 z-10">
                🏛 Government
              </div>
              <div className="absolute top-1/2 right-2 p-2 bg-slate-50 border border-slate-205 rounded-xl text-[9px] font-bold text-slate-658 z-10">
                🏭 Industry Hubs
              </div>

              <svg className="absolute inset-0 w-full h-full text-red-200 pointer-events-none z-0">
                <line x1="15%" y1="15%" x2="50%" y2="50%" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" />
                <line x1="85%" y1="85%" x2="50%" y2="50%" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" />
                <line x1="90%" y1="50%" x2="50%" y2="50%" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-red-600 font-extrabold block">Cross-Border Curation</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900 leading-tight">
              Africa Innovation Research Network
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
              Ecosystem pathways link physical laboratories, patent offices, and industrial testing grids under a single sovereign ledger. Direct DOI mappings guarantee absolute priority tracking of inventions.
            </p>

            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition"
            >
              Request Network Onboarding
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 9: SUCCESS METRICS (Animate upward as scroll trigger representation) */}
      <section className="py-20 bg-slate-50 border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-red-600 font-black">Platform Milestones</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Active Sovereign Verification</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-1.5 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-905">5M+</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Active Students</p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-1.5 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
              <span className="text-3xl sm:text-4xl font-extrabold text-red-600">10,000+</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Institutions</p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-1.5 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex flex-col justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-905">50M+</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Total Resources</p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-1.5 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
              <span className="text-3xl sm:text-4xl font-extrabold text-red-600">54</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Countries Active</p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-1.5 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-905">100M+</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: WHY COGNISACRA */}
      <section className="py-24 bg-white border-b border-slate-100 relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-red-650 font-black block">Why CogniSacra</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900 animate-pulse">Africa's Sovereign Academic OS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 hover:border-red-300 transition duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="p-3 bg-red-100 text-red-605 rounded-2xl w-fit">
                <Brain size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">AI Native</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Engineered from the ground up for AI-first sovereign learning pathways. Personal contextual tutees answer local questions safely.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 hover:border-red-300 transition duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="p-3 bg-red-105 text-red-605 rounded-2xl w-fit">
                <Shield size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">Institution Ready</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Enterprise school governance protocols pre-equipped with Ministry checks, granular work scopes and SSO.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 hover:border-red-300 transition duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl w-fit">
                <Globe size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">Pan-African</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  One interconnected digital infrastructure aligned with standard sovereign educational currencies across the 54 nations.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 hover:border-red-300 transition duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="p-3 bg-red-105 text-red-600 rounded-2xl w-fit">
                <Award size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">Secure</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Zero room for certificates fraud. High-throughput cryptographic ledger stamps keep degree statuses immutable.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 hover:border-red-300 transition duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="p-3 bg-red-100 text-red-605 rounded-2xl w-fit">
                <HardDrive size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">Scalable</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Built to scale from isolated rural secondary schools using offline nodes up to massive multi-campus state universities.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 hover:border-red-300 transition duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="p-3 bg-red-105 text-red-600 rounded-2xl w-fit">
                <Zap size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">Revenue Generating</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Monetize premium curricula natively. Instructors collect instant royalty shares via integrated mobile wallet transfers.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 11: TESTIMONIALS (Carousel with soft red overlays & rating) */}
      <section className="py-24 bg-slate-50 border-b border-slate-100 relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-red-650 font-black block">Success Stories</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-slate-900">Voice of the Directorate</h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-red-500">
              <Star size={300} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* 5 Red Stars */}
                <div className="flex gap-1 text-red-550">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>

                <blockquote className="text-base sm:text-lg lg:text-xl font-medium text-slate-800 leading-relaxed italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-xs text-red-600 font-bold">{testimonials[activeTestimonial].title}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Manual Dot controls */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === idx ? 'bg-red-600 w-6' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Show testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 12: PARTNERS & ACCREDITATION */}
      <section className="py-16 bg-white relative overflow-hidden z-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">Trust Networks & Accreditation</span>
          
          {/* Animated Ribbon layout style */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="flex gap-8 justify-around items-center opacity-65 flex-wrap md:flex-nowrap">
              <div className="px-6 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-700 tracking-wider">
                🛡 Ministry of Education
              </div>
              <div className="px-6 py-2 border border-red-200 rounded-xl text-xs font-black uppercase text-red-600 tracking-wider">
                🎓 Cape Town University
              </div>
              <div className="px-6 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-700 tracking-wider">
                🏢 Sovereign Agronomy Council
              </div>
              <div className="px-6 py-2 border border-red-250 rounded-xl text-xs font-black uppercase text-red-656 tracking-wider">
                🌍 Pan-African Research Hub
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: FINAL CONVERSION SECTION (Cinematic closing scene) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03),transparent)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex p-1.5 bg-red-100 text-red-600 rounded-2xl animate-bounce">
            <Cpu size={24} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
            Building the Future of Education <br /> Infrastructure in Africa
          </h2>

          <p className="max-w-2xl mx-auto text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
            One platform. One ecosystem. Unlimited knowledge. Deploy your sovereign university nodes today, protect student curricula, and automate direct mobile licensing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-500 hover:from-rose-500 hover:to-red-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-900/10 transition transform hover:-translate-y-0.5"
            >
              Launch Your Institution
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-800 hover:border-red-500 hover:text-red-600 text-xs font-black uppercase tracking-widest rounded-xl transition"
            >
              Request Enterprise Demo
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
